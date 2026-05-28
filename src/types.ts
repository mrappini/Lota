export type StatusType = 'green' | 'yellow' | 'red';

export interface Report {
  id?: string;
  status: StatusType;
  createdAt: any; // Firestore Timestamp
  dayOfWeek: number; // 0-6 (0=Domingo, 1=Segunda, etc.)
  hour: number; // 0-23
  userId?: string;
}

export interface DayPattern {
  hour: number;
  greenCount: number;
  yellowCount: number;
  redCount: number;
  score: number; // average score used for rendering charts
}
