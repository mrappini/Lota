import React from 'react';
import { useLota } from '../context/LotaContext';
import { useTheme } from '../context/ThemeContext';
import { getRelativeTime } from '../utils/time';
import { motion } from 'motion/react';
import { Activity, ShieldAlert, Award, AlertCircle, RefreshCw, CheckCircle2, Clock, AlertTriangle, HelpCircle } from 'lucide-react';

import { LotaLoader } from '../components/LotaLoader';

export default function Status() {
  const { 
    currentStatus, 
    recentReports, 
    lastReport,
    allReports,
    loading,
    error,
    activeDomain
  } = useLota();
  const { isDark } = useTheme();

  // Background style based on the consensus status
  const bgStyles = {
    green: isDark 
      ? 'from-emerald-950/20 via-zinc-900 to-zinc-900 border-emerald-500/15 text-white' 
      : 'from-emerald-250/40 via-white to-white border-emerald-500/30 text-zinc-900 shadow-[inset_0_2px_15px_-5px_rgba(16,185,129,0.15)]',
    yellow: isDark 
      ? 'from-amber-950/20 via-zinc-900 to-zinc-900 border-amber-500/15 text-white' 
      : 'from-amber-250/40 via-white to-white border-amber-500/30 text-zinc-900 shadow-[inset_0_2px_15px_-5px_rgba(245,158,11,0.15)]',
    red: isDark 
      ? 'from-rose-950/20 via-zinc-900 to-zinc-900 border-rose-500/15 text-white' 
      : 'from-rose-250/40 via-white to-white border-rose-500/30 text-zinc-900 shadow-[inset_0_2px_15px_-5px_rgba(244,63,94,0.15)]',
    none: isDark 
      ? 'from-zinc-800/10 via-zinc-900 to-zinc-900 border-zinc-800/15 text-white' 
      : 'from-zinc-100/60 via-white to-white border-zinc-200 text-zinc-900'
  };

  const badgeStyles = {
    green: {
      text: activeDomain === 'parking' ? 'Sem Fila' : 'Livre',
      sub: activeDomain === 'parking' ? 'Excelente momento, sem fila no estacionamento da PUC-Rio.' : 'Bandejão com bastante espaço livre e sem espera nas catracas.',
      color: isDark 
        ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20 font-bold' 
        : 'text-emerald-800 bg-emerald-100 border-emerald-300 font-extrabold',
      radial: isDark ? 'bg-emerald-500/10' : 'bg-emerald-500/20',
      icon: CheckCircle2,
      iconColor: isDark ? 'text-emerald-400' : 'text-emerald-600'
    },
    yellow: {
      text: 'Fila Moderada',
      sub: activeDomain === 'parking' ? 'Alguma espera, mas com fluxo ágil e constante' : 'Fila começando a formar para pegar a comida, mas fluindo bem.',
      color: isDark 
        ? 'text-amber-400 bg-amber-500/10 border-amber-500/20 font-bold' 
        : 'text-amber-900 bg-amber-100 border-amber-300 font-extrabold',
      radial: isDark ? 'bg-amber-500/10' : 'bg-amber-500/20',
      icon: Clock,
      iconColor: isDark ? 'text-amber-400' : 'text-amber-600'
    },
    red: {
      text: 'Fila Intensa',
      sub: activeDomain === 'parking' ? 'Fila volumosa, recomendável retornar mais tarde' : 'Restaurante lotado. Considere ir em outro horário se possível.',
      color: isDark 
        ? 'text-rose-400 bg-rose-500/10 border-rose-500/20 font-bold' 
        : 'text-rose-900 bg-rose-100 border-rose-300 font-extrabold',
      radial: isDark ? 'bg-rose-500/10' : 'bg-rose-500/20',
      icon: AlertTriangle,
      iconColor: isDark ? 'text-rose-400' : 'text-rose-600'
    },
    none: {
      text: 'Sem Consenso',
      sub: 'Toque em Reportar para ajudar a catalogar!',
      color: isDark 
        ? 'text-zinc-500 bg-zinc-800/10 border-zinc-700/20 font-bold' 
        : 'text-zinc-800 bg-zinc-100 border-zinc-250 font-extrabold',
      radial: 'bg-zinc-700/5',
      icon: HelpCircle,
      iconColor: isDark ? 'text-zinc-400 font-normal' : 'text-zinc-500 font-semibold'
    }
  };

  const statusInfo = badgeStyles[currentStatus];

  // Map counts for recent reports (last 30 minutes)
  const greenCount = recentReports.filter(r => r.status === 'green').length;
  const yellowCount = recentReports.filter(r => r.status === 'yellow').length;
  const redCount = recentReports.filter(r => r.status === 'red').length;
  const totalRecent = recentReports.length;

  // Percentage calculations
  const pGreen = totalRecent > 0 ? Math.round((greenCount / totalRecent) * 100) : 0;
  const pYellow = totalRecent > 0 ? Math.round((yellowCount / totalRecent) * 100) : 0;
  const pRed = totalRecent > 0 ? Math.round((redCount / totalRecent) * 100) : 0;

  // Show only 5 latest historical reports in a nice timeline
  const recentTimeline = allReports.slice(0, 5);

  if (loading) {
    return <LotaLoader label="Calculando status atual..." />;
  }

  return (
    <motion.div
      id="status-screen"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.3 }}
      className={`min-h-[75vh] flex flex-col p-5 bg-gradient-to-b ${bgStyles[currentStatus]} border rounded-3xl overflow-hidden shadow-2xl relative`}
    >
      {/* Dynamic ambient center halo */}
      <div className={`absolute top-28 left-1/2 -translate-x-1/2 w-48 h-48 rounded-full blur-3xl pointer-events-none transition-all duration-700 ${statusInfo.radial}`}></div>

      {/* Header */}
      <div className="flex justify-between items-center mb-5 mt-1 z-10">
        <div>
          <span className="text-xs font-mono text-zinc-500 uppercase tracking-widest">Painel de Controle</span>
          <h2 className={`text-2xl font-sans font-extrabold tracking-tight mt-1 ${isDark ? 'text-white' : 'text-zinc-950'}`}>Status Atual</h2>
        </div>
        <div className={`p-2 border rounded-xl relative ${isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200 shadow-sm'}`}>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 12, ease: 'linear' }}
          >
            <Activity className={isDark ? 'text-zinc-400' : 'text-zinc-650'} size={14} />
          </motion.div>
        </div>
      </div>

      {error && (
        <div className={`mb-5 p-3.5 rounded-2xl border text-xs font-sans transition-all leading-relaxed flex items-start gap-2 z-10 ${
          isDark 
            ? 'bg-rose-500/10 border-rose-500/20 text-rose-300' 
            : 'bg-rose-50 border-rose-200 text-rose-900 shadow-sm'
        }`}>
          <span className="text-sm">⚠️</span>
          <div>
            <strong>Erro na conexão com Firestore:</strong> {error}
          </div>
        </div>
      )}

      {/* Highlight/Consensus state section */}
      <div className={`flex flex-col items-center text-center p-6 rounded-[2.5rem] mt-2 shadow-lg mb-6 z-10 ${
        isDark ? 'glass' : 'bg-white border border-zinc-200/80 shadow-md text-zinc-900'
      }`}>
        <span className="text-[10px] font-mono font-bold tracking-[0.2em] text-zinc-500 uppercase">
          CONSENSO NOS ÚLTIMOS 30 MINUTOS
        </span>

        <div className="my-5 flex items-center justify-center filter drop-shadow-md">
          <statusInfo.icon size={68} className={statusInfo.iconColor} />
        </div>

        <div className={`px-4 py-1.5 rounded-full text-xs font-mono tracking-widest uppercase font-bold border ${statusInfo.color}`}>
          {statusInfo.text}
        </div>

        <p className={`mt-2.5 text-xs font-sans px-4 ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
          {statusInfo.sub}
        </p>
      </div>

      {/* Recent report breakdown card */}
      <div className={`rounded-[2rem] p-5 mb-6 z-10 ${
        isDark ? 'glass' : 'bg-white border border-zinc-200 shadow-md text-zinc-900'
      }`}>
        <div className="flex justify-between items-center mb-3">
          <h4 className={`text-xs font-mono uppercase tracking-wider font-bold ${isDark ? 'text-zinc-400' : 'text-zinc-660'}`}>RELAÇÕES RECENTES ({totalRecent})</h4>
          <span className="text-[10px] font-mono text-zinc-500 font-semibold uppercase">Últimos 30 min</span>
        </div>

        {totalRecent === 0 ? (
          <div className="text-center py-5">
            <AlertCircle size={32} className="text-zinc-500 mx-auto mb-2" />
            <p className="text-xs text-zinc-500 font-sans">Sem relatórios nesse intervalo.</p>
          </div>
        ) : (
          <div className="space-y-4 pt-1">
            {/* Green Reports bar */}
            <div>
              <div className="flex justify-between text-xs font-sans font-medium mb-1.5">
                <span className={`flex items-center gap-1.5 ${isDark ? 'text-emerald-400' : 'text-emerald-700 font-bold'}`}>
                  <CheckCircle2 size={13} className={isDark ? 'text-emerald-400' : 'text-emerald-600'} /> Sem Fila
                </span>
                <span className={`${isDark ? 'text-zinc-550' : 'text-zinc-700'} font-mono font-bold`}>{greenCount} ({pGreen}%)</span>
              </div>
              <div className={`h-2.5 rounded-full overflow-hidden ${isDark ? 'bg-zinc-850' : 'bg-zinc-200'}`}>
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${pGreen}%` }}
                  transition={{ duration: 0.8 }}
                  className={`h-full ${isDark ? 'bg-emerald-500' : 'bg-emerald-600 shadow-[0_0_8px_rgba(16,185,129,0.3)]'}`}
                ></motion.div>
              </div>
            </div>

            {/* Yellow Reports bar */}
            <div>
              <div className="flex justify-between text-xs font-sans font-medium mb-1.5">
                <span className={`flex items-center gap-1.5 ${isDark ? 'text-amber-400' : 'text-amber-800 font-bold'}`}>
                  <Clock size={13} className={isDark ? 'text-amber-400' : 'text-amber-600'} /> Fila Moderada
                </span>
                <span className={`${isDark ? 'text-zinc-550' : 'text-zinc-700'} font-mono font-bold`}>{yellowCount} ({pYellow}%)</span>
              </div>
              <div className={`h-2.5 rounded-full overflow-hidden ${isDark ? 'bg-zinc-850' : 'bg-zinc-200'}`}>
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${pYellow}%` }}
                  transition={{ duration: 0.8 }}
                  className={`h-full ${isDark ? 'bg-amber-500' : 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.3)]'}`}
                ></motion.div>
              </div>
            </div>

            {/* Red Reports bar */}
            <div>
              <div className="flex justify-between text-xs font-sans font-medium mb-1.5">
                <span className={`flex items-center gap-1.5 ${isDark ? 'text-rose-450' : 'text-rose-700 font-bold'}`}>
                  <AlertTriangle size={13} className={isDark ? 'text-rose-450' : 'text-rose-600'} /> Fila Intensa
                </span>
                <span className={`${isDark ? 'text-zinc-550' : 'text-zinc-700'} font-mono font-bold`}>{redCount} ({pRed}%)</span>
              </div>
              <div className={`h-2.5 rounded-full overflow-hidden ${isDark ? 'bg-zinc-850' : 'bg-zinc-200'}`}>
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${pRed}%` }}
                  transition={{ duration: 0.8 }}
                  className={`h-full ${isDark ? 'bg-rose-500' : 'bg-rose-600 shadow-[0_0_8px_rgba(244,63,94,0.3)]'}`}
                ></motion.div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Latest overall report detail card */}
      <div className={`rounded-[2rem] p-5 mb-auto z-10 ${
        isDark ? 'glass' : 'bg-white border border-zinc-200 shadow-md text-zinc-900'
      }`}>
        <h4 className={`text-xs font-mono uppercase tracking-wider font-bold mb-4 ${isDark ? 'text-zinc-400' : 'text-zinc-650'}`}>
          ÚLTIMOS RELATOS GERAIS
        </h4>

        {recentTimeline.length === 0 ? (
          <p className="text-xs text-zinc-500 text-center py-4 font-sans">Sem relatos históricos cadastrados.</p>
        ) : (
          <div className="space-y-3">
            {recentTimeline.map((item, index) => {
              const rTime = getRelativeTime(item.createdAt);
              let label = 'Sem Fila';
              let styleCls = 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
              let StatusIcon = CheckCircle2;
              let iconColor = isDark ? 'text-emerald-400' : 'text-emerald-600';

              if (item.status === 'yellow') {
                label = 'Fila Moderada';
                styleCls = 'bg-amber-500/10 text-amber-505 border-amber-500/20';
                StatusIcon = Clock;
                iconColor = isDark ? 'text-amber-400' : 'text-amber-600';
              } else if (item.status === 'red') {
                label = 'Fila Intensa';
                styleCls = 'bg-rose-500/10 text-rose-500 border-rose-500/20';
                StatusIcon = AlertTriangle;
                iconColor = isDark ? 'text-rose-450' : 'text-rose-600';
              }

              return (
                <div 
                  key={item.id || index}
                  className={`flex justify-between items-center p-3 rounded-2xl border transition-colors ${
                    isDark 
                      ? 'bg-white/5 border-white/5 hover:bg-white/10' 
                      : 'bg-zinc-50 border-zinc-200 hover:bg-zinc-100 text-zinc-850'
                  }`}
                >
                  <div className="flex items-center space-x-2.5">
                    <StatusIcon size={14} className={`${iconColor} shrink-0`} />
                    <span className={`text-xs font-sans font-bold ${isDark ? 'text-zinc-200' : 'text-zinc-850'}`}>{label}</span>
                  </div>
                  <span className="text-xs font-mono text-zinc-500 font-bold">{rTime}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </motion.div>
  );
}
