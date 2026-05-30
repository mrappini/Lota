import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { ParkingReport, CafeteriaReport, StatusType } from '../types';

export type Domain = 'parking' | 'cafeteria';

interface LotaContextType {
  activeDomain: Domain | null;
  setActiveDomain: (domain: Domain | null) => void;

  loading: boolean;
  error: string | null;
  userId: string;
  
  currentStatus: StatusType;
  minutesSinceLastReport: number | null;
  last60MinReportsCount: number;
  allReports: any[];
  recentReports: any[];
  lastReport: any;
  submitReport: (status: StatusType) => Promise<void>;

  hasReportedToday: boolean;
  todayReport: any;
  adminOverride: any;
  setAdminOverride: any;
  clearMyVote: () => Promise<void>;
}

const LotaContext = createContext<LotaContextType | undefined>(undefined);

export const LotaProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeDomain, setActiveDomain] = useState<Domain | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [parkingReports, setParkingReports] = useState<ParkingReport[]>([]);
  const [cafeteriaReports, setCafeteriaReports] = useState<CafeteriaReport[]>([]);
  const [adminOverride, setAdminOverride] = useState<StatusType | null>(null);
  const [currentTime, setCurrentTime] = useState<Date>(new Date());

  const [userId] = useState<string>(() => {
    let id = localStorage.getItem('lota-user-id');
    if (!id) {
      id = 'usr_' + Math.random().toString(36).substring(2, 11);
      localStorage.setItem('lota-user-id', id);
    }
    return id;
  });

  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 10000);
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    try {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      const isoWeekAgo = weekAgo.toISOString();

      const { data: pData, error: pError } = await supabase
        .from('parking_status')
        .select('*')
        .gte('timestamp', isoWeekAgo)
        .order('timestamp', { ascending: false });
        
      if (pError) throw pError;
      
      const { data: cData, error: cError } = await supabase
        .from('cafeteria_status')
        .select('*')
        .gte('timestamp', isoWeekAgo)
        .order('timestamp', { ascending: false });

      if (cError) throw cError;

      setParkingReports(pData as ParkingReport[]);
      setCafeteriaReports(cData as CafeteriaReport[]);
      setLoading(false);
    } catch (err: any) {
      console.error('Erro ao buscar do Supabase', err);
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    
    // Supabase Realtime via WebSockets instead of Polling
    const parkingSub = supabase
      .channel('public:parking_status')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'parking_status' }, () => {
        fetchData();
      })
      .subscribe();

    const cafeteriaSub = supabase
      .channel('public:cafeteria_status')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'cafeteria_status' }, () => {
        fetchData();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(parkingSub);
      supabase.removeChannel(cafeteriaSub);
    };
  }, []);

  // Compute common variables based on active domain
  const activeReports = activeDomain === 'parking' ? parkingReports : cafeteriaReports;
  
  const oneHourAgo = new Date(currentTime.getTime() - 60 * 60 * 1000);
  const thirtyMinAgo = new Date(currentTime.getTime() - 30 * 60 * 1000);

  const recent = activeReports.filter(r => new Date(r.timestamp) >= thirtyMinAgo);
  const last60MinReportsCount = activeReports.filter(r => new Date(r.timestamp) >= oneHourAgo).length;
  
  let currentStatus: StatusType = 'none';
  if (recent.length > 0) {
    const sum = recent.reduce((acc, r) => acc + (r.status_texto === 'green' ? 1 : r.status_texto === 'yellow' ? 2 : 3), 0);
    const avg = sum / recent.length;
    currentStatus = avg < 1.8 ? 'green' : avg < 2.3 ? 'yellow' : 'red';
  }
  if (adminOverride) {
    currentStatus = adminOverride;
  }

  const lastReportData = activeReports.length > 0 ? activeReports[0] : null;
  const minutesSinceLastReport = lastReportData 
    ? Math.max(0, Math.floor((currentTime.getTime() - new Date(lastReportData.timestamp).getTime()) / 60000))
    : null;

  // Map to legacy format so other screens don't break
  const allReportsMapped = activeReports.map(r => ({
    ...r,
    status: r.status_texto,
    createdAt: r.timestamp,
    dayOfWeek: new Date(r.timestamp).getDay(),
    hour: new Date(r.timestamp).getHours(),
    userId: r.user_id || 'unknown'
  }));

  const recentReportsMapped = recent.map(r => ({
    ...r,
    status: r.status_texto,
    createdAt: r.timestamp,
    dayOfWeek: new Date(r.timestamp).getDay(),
    hour: new Date(r.timestamp).getHours(),
    userId: r.user_id || 'unknown'
  }));

  const lastReportMapped = lastReportData ? {
    ...lastReportData,
    status: lastReportData.status_texto,
    createdAt: lastReportData.timestamp
  } : null;

  const userTodayReports = allReportsMapped.filter(r => r.userId === userId && new Date(r.createdAt).toDateString() === new Date().toDateString());
  const hasReportedToday = userTodayReports.length > 0;
  const todayReport = hasReportedToday ? userTodayReports[0] : null;

  const submitReport = async (status: StatusType) => {
    try {
      const tableName = activeDomain === 'parking' ? 'parking_status' : 'cafeteria_status';
      
      if (hasReportedToday && todayReport) {
        // Anti-spam: Update previous vote today instead of adding new one
        const { error } = await supabase.from(tableName)
          .update({ status_texto: status, timestamp: new Date().toISOString() })
          .eq('id', todayReport.id);
        if (error) throw error;
      } else {
        // First vote of the day
        const { error } = await supabase.from(tableName)
          .insert([{ status_texto: status, user_id: userId }]);
        if (error) throw error;
      }
      
      await fetchData();
    } catch (err: any) {
      setError('Erro ao enviar: ' + err.message);
    }
  };

  const clearMyVote = async () => {
    if (!todayReport) return;
    try {
      const tableName = activeDomain === 'parking' ? 'parking_status' : 'cafeteria_status';
      const { error } = await supabase.from(tableName).delete().eq('id', todayReport.id);
      if (error) throw error;
      await fetchData();
    } catch (err: any) {
      setError('Erro ao deletar: ' + err.message);
    }
  };

  return (
    <LotaContext.Provider value={{
      activeDomain, setActiveDomain,
      loading, error, userId,
      
      currentStatus, last60MinReportsCount, minutesSinceLastReport, submitReport,
      allReports: allReportsMapped,
      recentReports: recentReportsMapped,
      lastReport: lastReportMapped,
      
      hasReportedToday,
      todayReport,
      adminOverride,
      setAdminOverride,
      clearMyVote
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
