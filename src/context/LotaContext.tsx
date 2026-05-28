import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  collection, 
  onSnapshot, 
  query, 
  orderBy, 
  addDoc, 
  serverTimestamp,
  Timestamp,
  doc,
  setDoc,
  limit
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { Report, StatusType } from '../types';

interface LotaContextType {
  allReports: Report[];
  recentReports: Report[];
  last60MinReportsCount: number;
  currentStatus: StatusType | 'none';
  lastReport: Report | null;
  minutesSinceLastReport: number | null;
  loading: boolean;
  error: string | null;
  submitReport: (status: StatusType) => Promise<void>;
  userId: string;
  hasReportedToday: boolean;
  todayReport: Report | null;
  adminOverride: StatusType | 'none' | null;
  setAdminOverride: (status: StatusType | 'none' | null) => void;
  injectAdminReports: (status: StatusType, count: number) => Promise<void>;
}

const LotaContext = createContext<LotaContextType | undefined>(undefined);

export const LotaProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [allReports, setAllReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [adminOverride, setAdminOverride] = useState<StatusType | 'none' | null>(null);
  const [currentTime, setCurrentTime] = useState<Date>(new Date());

  const [userId] = useState<string>(() => {
    let id = localStorage.getItem('lota-user-id');
    if (!id) {
      id = 'usr_' + Math.random().toString(36).substring(2, 11) + Math.random().toString(36).substring(2, 11);
      localStorage.setItem('lota-user-id', id);
    }
    return id;
  });

  // Ticker to refresh real-time estimations every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const q = query(
      collection(db, 'reports'),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const reports: Report[] = [];
        snapshot.forEach((doc) => {
          const data = doc.data();
          reports.push({
            id: doc.id,
            status: data.status,
            createdAt: data.createdAt || Timestamp.now(), // Fallback to current local time for instant real-time optimistic updates
            dayOfWeek: data.dayOfWeek,
            hour: data.hour,
            userId: data.userId,
          });
        });
        setAllReports(reports);
        setLoading(false);
        setError(null);
      },
      (err) => {
        setLoading(false);
        setError('Erro de sincronização com banco: ' + err.message);
        console.error('Firestore Sync Error:', err);
      }
    );

    return () => unsubscribe();
  }, []);

  // Compute status metrics based on real-time data
  const thirtyMinutesAgo = new Date(currentTime.getTime() - 30 * 60 * 1000);
  const oneHourAgo = new Date(currentTime.getTime() - 60 * 60 * 1000);

  // Filter reports within last 30 minutes
  const recentReports = allReports.filter(report => {
    if (!report.createdAt) return false;
    // Handle both Firestore Timestamp and JS Date
    const rDate = report.createdAt instanceof Timestamp 
      ? report.createdAt.toDate() 
      : new Date(report.createdAt);
    return rDate >= thirtyMinutesAgo;
  });

  // Filter reports within last 60 minutes
  const lastHourReports = allReports.filter(report => {
    if (!report.createdAt) return false;
    const rDate = report.createdAt instanceof Timestamp 
      ? report.createdAt.toDate() 
      : new Date(report.createdAt);
    return rDate >= oneHourAgo;
  });

  const last60MinReportsCount = lastHourReports.length;

  // Calculate current status (green / yellow / red / none)
  let currentStatus: StatusType | 'none' = 'none';
  if (adminOverride !== null) {
    currentStatus = adminOverride;
  } else if (recentReports.length > 0) {
    const sum = recentReports.reduce((acc, r) => {
      if (r.status === 'green') return acc + 1;
      if (r.status === 'yellow') return acc + 2;
      return acc + 3; // 'red'
    }, 0);
    const avg = sum / recentReports.length;

    if (avg <= 1.5) {
      currentStatus = 'green';
    } else if (avg <= 2.5) {
      currentStatus = 'yellow';
    } else {
      currentStatus = 'red';
    }
  }

  // Find most recent report
  const lastReportWithDate = allReports.find(r => r.createdAt !== null);
  const lastReport = lastReportWithDate || null;

  let minutesSinceLastReport: number | null = null;
  if (lastReport && lastReport.createdAt) {
    const lrDate = lastReport.createdAt instanceof Timestamp 
      ? lastReport.createdAt.toDate() 
      : new Date(lastReport.createdAt);
    const diffMs = currentTime.getTime() - lrDate.getTime();
    minutesSinceLastReport = Math.max(0, Math.floor(diffMs / 60000));
  }

  // Check if current user has reported today
  const todayStr = currentTime.toDateString();
  const todayReport = allReports.find(report => {
    if (!report.createdAt) return false;
    const isUserDoc = report.id?.includes(userId) || (report as any).userId === userId;
    if (!isUserDoc) return false;
    const rDate = report.createdAt instanceof Timestamp 
      ? report.createdAt.toDate() 
      : new Date(report.createdAt);
    return rDate.toDateString() === todayStr;
  }) || null;
  const hasReportedToday = !!todayReport;

  // Submit a new report (max 1 per user per day; updating/overwriting if already submitted today)
  const submitReport = async (status: StatusType) => {
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0 is Sunday, 1 is Monday, etc.
    const hour = today.getHours();

    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const dateStr = `${year}-${month}-${day}`;

    // Document ID combines user ID and date string so each user gets 1 document per calendar day
    const reportDocId = `rep_${userId}_${dateStr}`;
    const reportDocRef = doc(db, 'reports', reportDocId);

    const payload = {
      status,
      createdAt: serverTimestamp(),
      dayOfWeek,
      hour,
      userId,
    };

    try {
      await setDoc(reportDocRef, payload);
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `reports/${reportDocId}`);
    }
  };

  const injectAdminReports = async (status: StatusType, count: number) => {
    const reportsCol = collection(db, 'reports');
    try {
      const now = new Date();
      for (let i = 0; i < count; i++) {
        const reportDate = new Date(now.getTime() - i * 60 * 1000); // 1-minute interval
        const rId = doc(reportsCol).id;
        const reportRef = doc(db, 'reports', rId);
        
        await setDoc(reportRef, {
          status,
          createdAt: Timestamp.fromDate(reportDate),
          dayOfWeek: reportDate.getDay(),
          hour: reportDate.getHours(),
          userId: `admin_simulation_${Math.random().toString(36).substring(2, 6)}`
        });
      }
    } catch (err: any) {
      console.error('Erro ao injetar relatos administrivados:', err);
      setError('Erro admin: ' + err.message);
    }
  };

  return (
    <LotaContext.Provider value={{
      allReports,
      recentReports,
      last60MinReportsCount,
      currentStatus,
      lastReport,
      minutesSinceLastReport,
      loading,
      error,
      submitReport,
      userId,
      hasReportedToday,
      todayReport,
      adminOverride,
      setAdminOverride,
      injectAdminReports
    }}>
      {children}
    </LotaContext.Provider>
  );
};

export const useLota = () => {
  const context = useContext(LotaContext);
  if (context === undefined) {
    throw new Error('useLota deve ser usado dentro de um LotaProvider');
  }
  return context;
};
