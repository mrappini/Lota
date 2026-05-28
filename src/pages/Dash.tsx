import React from 'react';
import { useLota } from '../context/LotaContext';
import { useTheme } from '../context/ThemeContext';
import { getContextualPhrase, getDayName } from '../utils/phrases';
import { motion } from 'motion/react';
import { Users, Clock, AlertTriangle, CheckCircle2, HelpCircle } from 'lucide-react';
import { LotaLoader } from '../components/LotaLoader';

export default function Dash() {
  const { 
    currentStatus, 
    last60MinReportsCount, 
    minutesSinceLastReport, 
    loading,
    error 
  } = useLota();
  const { isDark } = useTheme();

  const today = new Date();
  const dayOfWeek = today.getDay(); // 0-6
  
  // Format current date
  const formattedDate = today.toLocaleDateString('pt-BR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).toUpperCase();

  const dayName = getDayName(dayOfWeek).toUpperCase();

  // Status-based configuration mapping for the dial and indicators
  const statusConfig = {
    green: {
      borderColor: 'border-emerald-500',
      glowShadow: 'shadow-[0_0_50px_rgba(16,185,129,0.3)]',
      glowColor: 'rgba(16,185,129,0.45)', // Stronger green glow
      pulseBg: 'bg-emerald-500/5',
      accentText: 'text-emerald-500',
      tagText: 'SEM FILA',
      icon: CheckCircle2,
      lightBg: 'from-emerald-100 via-emerald-50/40 to-white',
      darkBg: 'from-emerald-950/60 via-[#0a0a0b] to-[#040405]',
      badgeText: 'text-emerald-500'
    },
    yellow: {
      borderColor: 'border-[#FACC15]',
      glowShadow: 'shadow-[0_0_50px_rgba(250,204,21,0.3)]',
      glowColor: 'rgba(250,204,21,0.45)', // Stronger yellow glow
      pulseBg: 'bg-amber-500/5',
      accentText: 'text-[#FACC15]',
      tagText: 'FILA MODERADA',
      icon: Clock,
      lightBg: 'from-amber-100 via-amber-50/40 to-white',
      darkBg: 'from-[#FACC15]/20 via-[#0a0a0b] to-[#040405]',
      badgeText: 'text-[#FACC15]'
    },
    red: {
      borderColor: 'border-rose-500',
      glowShadow: 'shadow-[0_0_50px_rgba(239,68,68,0.3)]',
      glowColor: 'rgba(239,68,68,0.45)', // Stronger red glow
      pulseBg: 'bg-rose-500/5',
      accentText: 'text-rose-500',
      tagText: 'FILA INTENSA',
      icon: AlertTriangle,
      lightBg: 'from-rose-100 via-rose-50/40 to-white',
      darkBg: 'from-rose-950/60 via-[#0a0a0b] to-[#040405]',
      badgeText: 'text-rose-500'
    },
    none: {
      borderColor: 'border-zinc-500',
      glowShadow: 'shadow-[0_0_30px_rgba(113,113,122,0.15)]',
      glowColor: 'rgba(113,113,122,0.25)',
      pulseBg: 'bg-zinc-500/5',
      accentText: 'text-zinc-400',
      tagText: 'SEM DADOS',
      icon: HelpCircle,
      lightBg: 'from-zinc-100 via-zinc-50/40 to-white',
      darkBg: 'from-zinc-900/60 via-[#0a0a0b] to-[#040405]',
      badgeText: 'text-zinc-400'
    }
  };

  const activeConfig = statusConfig[currentStatus];

  // Context Phrase
  const phrase = getContextualPhrase(dayOfWeek, currentStatus === 'none' ? 'green' : currentStatus);

  if (loading) {
    return <LotaLoader />;
  }

  const StatusIcon = activeConfig.icon;

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
      {/* Top broad color wash for maximum immediate color recognition */}
      <div 
        className="absolute top-0 left-0 right-0 h-[40%] blur-3xl pointer-events-none opacity-[0.4] transition-all duration-[1500ms]"
        style={{ background: `linear-gradient(to bottom, ${activeConfig.glowColor}, transparent)` }}
      ></div>

      {/* Decorative ambient blurred orb */}
      <div 
        className="absolute top-[30%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full blur-[110px] pointer-events-none opacity-[0.45] transition-all duration-1000"
        style={{ backgroundColor: activeConfig.glowColor }}
      ></div>

      {/* Header Info */}
      <div className="flex flex-col space-y-1 relative z-10">
        <span className={`text-[11px] font-sans tracking-[0.2em] font-black uppercase ${isDark ? 'text-zinc-400/90' : 'text-zinc-500/90'}`}>
          Hoje • <span className={isDark ? 'text-[#FACC15]' : 'text-amber-600'}>{dayName}</span>
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

      {/* Central Icon & Status (Old Layout Polished) */}
      <div className="flex flex-col items-center text-center justify-center my-auto py-8 relative z-10 w-full max-w-xs mx-auto">
        <motion.div 
          animate={{ y: [0, -8, 0] }} 
          transition={{ repeat: Infinity, duration: 4.5, ease: "easeInOut" }}
          className="mb-8 relative flex items-center justify-center"
        >
          {/* Subtle glowing aura directly behind the icon */}
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
          {currentStatus === 'none' 
            ? 'Sem atualizações recentes. Apoie a comunidade reportando a lotação atual.' 
            : phrase}
        </p>
      </div>

      {/* Single Unified Card Layout (Bottom) */}
      <div className="relative z-10 w-full max-w-sm mx-auto mt-2">
        <div 
          className={`backdrop-blur-xl border rounded-[2rem] p-5.5 shadow-xl flex flex-col space-y-4 transition-all duration-500 ${
            isDark 
              ? 'bg-[#121215]/65 border-white/[0.06] text-white shadow-[0_8px_30px_rgba(0,0,0,0.4)]' 
              : 'bg-white/80 border-zinc-200/60 text-zinc-900 shadow-sm'
          }`}
        >
          {/* Row 1: Last Time */}
          <div className="flex items-center space-x-4">
            <div className={`p-3 rounded-2xl flex items-center justify-center shrink-0 border transition-all ${
              isDark 
                ? 'bg-zinc-900/50 border-white/5 text-[#FACC15]' 
                : 'bg-zinc-100 border-zinc-200/30 text-amber-500'
            }`}>
              <Clock size={20} className="stroke-[2.5px]" />
            </div>
            <div className="flex flex-col">
              <span className={`text-[12px] font-sans font-medium tracking-wide ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>
                Último status enviado
              </span>
              <span className={`text-[17px] font-sans font-black tracking-tight ${isDark ? 'text-white' : 'text-zinc-950'}`}>
                {minutesSinceLastReport !== null 
                  ? (minutesSinceLastReport === 0 ? 'agora' : `há ${minutesSinceLastReport} ${minutesSinceLastReport === 1 ? 'minuto' : 'minutos'}`) 
                  : 'Nenhum reporte enviado'}
              </span>
            </div>
          </div>
          
          {/* Divider */}
          <div className={`h-[1px] w-full ${isDark ? 'bg-white/10' : 'bg-black/10'}`}></div>

          {/* Row 2: People Count */}
          <div className="flex items-center space-x-4">
            <div className={`p-3 rounded-2xl flex items-center justify-center shrink-0 border transition-all ${
              isDark 
                ? 'bg-zinc-900/50 border-white/5 text-[#FACC15]' 
                : 'bg-zinc-100 border-zinc-200/30 text-amber-500'
            }`}>
              <Users size={20} className="stroke-[2.5px]" />
            </div>
            <div className="flex flex-col">
              <span className={`text-[12px] font-sans font-medium tracking-wide ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>
                Atividade na última hora
              </span>
              <span className={`text-[17px] font-sans font-black tracking-tight ${isDark ? 'text-white' : 'text-zinc-950'}`}>
                {last60MinReportsCount === 1 
                  ? '1 pessoa reportou' 
                  : `${last60MinReportsCount} pessoas reportaram`}
              </span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
