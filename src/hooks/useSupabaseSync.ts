import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { ParkingReport, CafeteriaReport } from '../types';

export function useSupabaseSync() {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [parkingReports, setParkingReports] = useState<ParkingReport[]>([]);
  const [cafeteriaReports, setCafeteriaReports] = useState<CafeteriaReport[]>([]);

  const fetchData = useCallback(async () => {
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
  }, []);

  useEffect(() => {
    fetchData();
    
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
  }, [fetchData]);

  return {
    parkingReports,
    cafeteriaReports,
    loading,
    error,
    setError,
    fetchData
  };
}
