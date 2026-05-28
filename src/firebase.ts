import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDocFromServer } from 'firebase/firestore';

// Environment variables are the standard, secure way in Vite for production
const meta = import.meta as any;
const config = {
  apiKey: (meta.env?.VITE_FIREBASE_API_KEY as string) || "",
  authDomain: (meta.env?.VITE_FIREBASE_AUTH_DOMAIN as string) || "",
  projectId: (meta.env?.VITE_FIREBASE_PROJECT_ID as string) || "",
  storageBucket: (meta.env?.VITE_FIREBASE_STORAGE_BUCKET as string) || "",
  messagingSenderId: (meta.env?.VITE_FIREBASE_MESSAGING_SENDER_ID as string) || "",
  appId: (meta.env?.VITE_FIREBASE_APP_ID as string) || "",
  firestoreDatabaseId: (meta.env?.VITE_FIREBASE_DATABASE_ID as string) || "",
};

const app = initializeApp(config);

// If firestoreDatabaseId is provided, use it, otherwise use default database
export const db = config.firestoreDatabaseId 
  ? getFirestore(app, config.firestoreDatabaseId)
  : getFirestore(app);

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: null,
      email: null,
      emailVerified: null,
      isAnonymous: null,
    },
    operationType,
    path,
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Connection test
async function testConnection() {
  if (!config.apiKey) {
    console.warn("Firebase config is empty. Please set environment variables in your server or .env file.");
    return;
  }
  try {
    await getDocFromServer(doc(db, 'test_connection_placeholder', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error("Please check your Firebase configuration and internet connection.");
    }
  }
}

testConnection();
