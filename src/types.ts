export type StatusType = 'green' | 'yellow' | 'red' | 'none';

export interface ParkingReport {
  id?: string;
  timestamp: string; // ISO string from Supabase
  capacidade_total: number;
  vagas_ocupadas: number;
  status_texto: StatusType;
  user_id?: string;
}

export interface CafeteriaReport {
  id?: string;
  timestamp: string; // ISO string from Supabase
  capacidade_total: number;
  pessoas_presentes: number;
  tempo_medio_espera_minutos: number;
  status_texto: StatusType;
  user_id?: string;
}

// Keep legacy for now just in case other components depend on it heavily
export interface Report {
  id?: string;
  status: StatusType;
  createdAt: any; 
  dayOfWeek: number; 
  hour: number; 
  userId?: string;
}

export interface DayPattern {
  hour: number;
  greenCount: number;
  yellowCount: number;
  redCount: number;
  score: number;
}
