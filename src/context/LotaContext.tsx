import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { StatusType } from '../types';
import { useSupabaseSync } from '../hooks/useSupabaseSync';
import { useGamification } from '../hooks/useGamification';
import toast from 'react-hot-toast';

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

  lotaPoints: number;
  level: number;
  progress: number;
  nextLevelPoints: number;
  
  inventory: string[];
  equippedTheme: string;
  equippedLogo: string;
  buyItem: (id: string, price: number, type: 'theme' | 'logo') => boolean;
  equipItem: (id: string, type: 'theme' | 'logo', force?: boolean) => void;
  spendPoints: (amount: number) => boolean;
  addPoints: (amount: number) => number;
}

const LotaContext = createContext<LotaContextType | undefined>(undefined);

export const LotaProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeDomain, setActiveDomain] = useState<Domain | null>(null);
  const [adminOverride, setAdminOverride] = useState<StatusType | null>(null);
  const [currentTime, setCurrentTime] = useState<Date>(new Date());

  const { parkingReports, cafeteriaReports, loading, error, setError, fetchData } = useSupabaseSync();
  const { lotaPoints, addPoints, spendPoints, level, progress, nextLevelPoints, inventory, buyItem, equipItem, equippedTheme, equippedLogo } = useGamification();

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
        const { error } = await supabase.from(tableName)
          .update({ status_texto: status, timestamp: new Date().toISOString() })
          .eq('id', todayReport.id);
        if (error) throw error;
        toast.success('Relatório atualizado com sucesso!');
      } else {
        const { error } = await supabase.from(tableName)
          .insert([{ status_texto: status, user_id: userId }]);
        if (error) throw error;
        
        // Add points for Gamification!
        addPoints(10);
        toast.success('+10 LotaPoints! Relatório enviado.', { icon: '✨' });
      }
      
      await fetchData();
    } catch (err: any) {
      setError('Erro ao enviar: ' + err.message);
      toast.error('Erro ao enviar relatório.');
    }
  };

  const clearMyVote = async () => {
    if (!todayReport) return;
    try {
      const tableName = activeDomain === 'parking' ? 'parking_status' : 'cafeteria_status';
      const { error } = await supabase.from(tableName).delete().eq('id', todayReport.id);
      if (error) throw error;
      await fetchData();
      toast.success('Seu voto foi apagado.');
    } catch (err: any) {
      setError('Erro ao deletar: ' + err.message);
      toast.error('Erro ao apagar voto.');
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
      
      hasReportedToday, todayReport, adminOverride, setAdminOverride, clearMyVote,
      
      lotaPoints, level, progress, nextLevelPoints,
      inventory, buyItem, equipItem, equippedTheme, equippedLogo, spendPoints, addPoints
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
