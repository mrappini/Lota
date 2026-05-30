import React from 'react';
import { useLota } from '../context/LotaContext';
import { useTheme } from '../context/ThemeContext';
import { getDayName } from '../utils/phrases';
import { getRelativeTime } from '../utils/time';
import { motion } from 'motion/react';
import { Users, Clock, AlertTriangle, CheckCircle2, HelpCircle } from 'lucide-react';
import { LotaLoader } from '../components/LotaLoader';

export default function Dash() {
  const { 
    currentStatus, 
    last60MinReportsCount, 
    lastReport,
    loading,
    error,
    activeDomain
  } = useLota();
  const { isDark } = useTheme();

  const today = new Date();
  const dayOfWeek = today.getDay(); // 0-6
  
  const formattedDate = today.toLocaleDateString('pt-BR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).toUpperCase();

  const dayName = getDayName(dayOfWeek).toUpperCase();

  const isParking = activeDomain === 'parking';
  const accentBorderClass = isParking ? 'border-[#FACC15]' : 'border-blue-500';
  const accentTextClass = isParking ? 'text-[#FACC15]' : 'text-blue-500';
  const accentBgClass = isParking ? 'bg-[#FACC15]' : 'bg-blue-500';
  const accentGradientDarkClass = isParking ? 'from-[#FACC15]/20' : 'from-blue-500/20';

  const statusConfig = {
    green: {
      color: '#22C55E',
      ringConfig: 'border-[#22C55E]',
      tagText: 'LIVRE',
      darkBg: 'from-emerald-900/20 via-zinc-900 to-zinc-950',
      lightBg: 'from-emerald-100/50 via-zinc-50 to-white',
      accentText: 'text-emerald-500',
      badgeText: 'text-emerald-500',
      badgeBg: isDark ? 'bg-emerald-500/10' : 'bg-emerald-50',
      badgeBorder: 'border-emerald-500/20',
      icon: CheckCircle2
    },
    yellow: {
      color: '#FACC15',
      ringConfig: 'border-[#FACC15]',
      tagText: 'MODERADO',
      darkBg: `from-[#FACC15]/20 via-zinc-900 to-zinc-950`,
      lightBg: 'from-amber-100/50 via-zinc-50 to-white',
      accentText: 'text-[#FACC15]',
      badgeText: 'text-[#FACC15]',
      badgeBg: isDark ? 'bg-amber-500/10' : 'bg-amber-50',
      badgeBorder: 'border-amber-500/20',
      icon: Clock
    },
    red: {
      color: '#EF4444',
      ringConfig: 'border-[#EF4444]',
      tagText: 'LOTADO',
      darkBg: 'from-rose-900/20 via-zinc-900 to-zinc-950',
      lightBg: 'from-rose-100/50 via-zinc-50 to-white',
      accentText: 'text-rose-500',
      badgeText: 'text-rose-500',
      badgeBg: isDark ? 'bg-rose-500/10' : 'bg-rose-50',
      badgeBorder: 'border-rose-500/20',
      icon: AlertTriangle
    },
    none: {
      color: isDark ? '#3F3F46' : '#E4E4E7',
      ringConfig: isDark ? 'border-zinc-800' : 'border-zinc-200',
      tagText: 'SEM DADOS',
      darkBg: 'from-zinc-900 via-zinc-900 to-zinc-950',
      lightBg: 'from-zinc-100/50 via-zinc-50 to-white',
      accentText: isDark ? 'text-zinc-500' : 'text-zinc-400',
      badgeText: isDark ? 'text-zinc-400' : 'text-zinc-500',
      badgeBg: isDark ? 'bg-zinc-800/50' : 'bg-zinc-100',
      badgeBorder: isDark ? 'border-zinc-700' : 'border-zinc-200',
      icon: HelpCircle
    }
  };

  const activeConfig = statusConfig[currentStatus];

  if (loading) {
    return <LotaLoader />;
  }

  const StatusIcon = activeConfig.icon;

  const phrase = currentStatus === 'none' 
    ? 'Sem atualizações recentes. Apoie a comunidade reportando a lotação atual.'
    : activeDomain === 'parking'
      ? (currentStatus === 'green' ? 'Guarita livre, pode vir tranquilo!' : currentStatus === 'yellow' ? 'Fila começando a formar, preveja um pequeno atraso.' : 'Estacionamento e guarita lotados. Evite chegar agora se possível.')
      : (currentStatus === 'green' ? 'Bandejão vazio, ótimo horário para comer.' : currentStatus === 'yellow' ? 'Filas nas catracas do bandejão.' : 'Bandejão cheio. Considere outro horário para almoçar.');

  return (
    <motion.div
      id="dash-screen"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.3 }}
      className={`min-h-[75vh] flex flex-col justify-between p-6 pb-6 rounded-3xl overflow-hidden shadow-2xl relative transition-all duration-700 ease-in-out ${
        isDark 
          ? `bg-gradient-to-b ${activeConfig.darkBg} text-white border border-white/[0.04]` 
          : `bg-gradient-to-b ${activeConfig.lightBg} text-zinc-900 border border-black/[0.03]`
      }`}
    >
      <div 
        className="absolute top-0 left-0 right-0 h-[40%] blur-3xl pointer-events-none opacity-[0.4] transition-all duration-[1500ms]"
        style={{ background: `linear-gradient(to bottom, ${activeConfig.glowColor}, transparent)` }}
      ></div>

      <div 
        className="absolute top-[30%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full blur-[110px] pointer-events-none opacity-[0.45] transition-all duration-1000"
        style={{ backgroundColor: activeConfig.glowColor }}
      ></div>

      <div className="flex flex-col space-y-1 relative z-10">
        <span className={`text-[11px] font-sans tracking-[0.2em] font-black uppercase ${isDark ? 'text-zinc-400/90' : 'text-zinc-500/90'}`}>
          Hoje • <span className={isDark ? accentTextClass : (isParking ? 'text-amber-600' : 'text-blue-600')}>{dayName}</span>
        </span>
        <span className={`text-xs font-sans font-medium tracking-wide ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>
          {formattedDate}
        </span>
        {error && (
          <div className="mt-2 text-[10px] font-sans px-3 py-1.5 rounded-xl bg-rose-500/10 text-rose-450 border border-rose-500/20 flex items-center gap-1.5 self-start">
            <span>⚠️</span> Erro: {error}
          </div>
        )}
      </div>

      <div className="flex flex-col items-center text-center justify-center my-auto py-8 relative z-10 w-full max-w-xs mx-auto">
        <motion.div 
          animate={{ y: [0, -8, 0] }} 
          transition={{ repeat: Infinity, duration: 4.5, ease: "easeInOut" }}
          className="mb-8 relative flex items-center justify-center"
        >
          <div className="absolute inset-0 blur-3xl opacity-60 scale-150 rounded-full" style={{ backgroundColor: activeConfig.glowColor }}></div>
          <StatusIcon 
            size={110} 
            className={`relative z-10 ${activeConfig.accentText} stroke-[2px] filter drop-shadow-[0_10px_20px_rgba(0,0,0,0.15)]`} 
          />
        </motion.div>

        <h2 className={`text-[36px] sm:text-[42px] leading-none font-sans font-black tracking-tighter ${
          isDark ? 'text-white drop-shadow-md' : 'text-zinc-900'
        }`}>
          {activeConfig.tagText}
        </h2>

        <p className={`mt-4 px-2 text-[16px] sm:text-[18px] leading-relaxed text-balance ${
          isDark ? 'text-zinc-400 font-medium' : 'text-zinc-600 font-medium'
        }`}>
          {phrase}
        </p>
      </div>

      <div className="relative z-10 w-full max-w-sm mx-auto mt-2">
        <div 
          className={`backdrop-blur-xl border rounded-[2rem] p-5.5 shadow-xl flex flex-col space-y-4 transition-all duration-500 ${
            isDark 
              ? 'bg-[#121215]/65 border-white/[0.06] text-white shadow-[0_8px_30px_rgba(0,0,0,0.4)]' 
              : 'bg-white/80 border-zinc-200/60 text-zinc-900 shadow-sm'
          }`}
        >
          <div className="flex items-center space-x-4">
            <div className={`p-3 rounded-2xl flex items-center justify-center shrink-0 border transition-all ${
              isDark 
                ? `bg-zinc-900/50 border-white/5 ${accentTextClass}` 
                : `bg-zinc-100 border-zinc-200/30 ${isParking ? 'text-amber-500' : 'text-blue-500'}`
            }`}>
              <Clock size={20} className="stroke-[2.5px]" />
            </div>
            <div className="flex flex-col">
              <span className={`text-[12px] font-sans font-medium tracking-wide ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>
                Último status enviado
              </span>
              <span className={`text-[17px] font-sans font-black tracking-tight ${isDark ? 'text-white' : 'text-zinc-950'}`}>
                {lastReport 
                  ? getRelativeTime(lastReport.createdAt) 
                  : 'Nenhum reporte'}
              </span>
            </div>
          </div>
          
          <div className={`h-[1px] w-full ${isDark ? 'bg-white/10' : 'bg-black/10'}`}></div>

          <div className="flex items-center space-x-4">
            <div className={`p-3 rounded-2xl flex items-center justify-center shrink-0 border transition-all ${
              isDark 
                ? `bg-zinc-900/50 border-white/5 ${accentTextClass}` 
                : `bg-zinc-100 border-zinc-200/30 ${isParking ? 'text-amber-500' : 'text-blue-500'}`
            }`}>
              <Users size={20} className="stroke-[2.5px]" />
            </div>
            <div className="flex flex-col">
              <span className={`text-[12px] font-sans font-medium tracking-wide ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>
                Atividade na última hora
              </span>
              <span className={`text-[17px] font-sans font-black tracking-tight ${isDark ? 'text-white' : 'text-zinc-950'}`}>
                {last60MinReportsCount === 1 
                  ? '1 reporte' 
                  : `${last60MinReportsCount} reportes`}
              </span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
