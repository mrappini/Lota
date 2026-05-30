import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLota } from '../context/LotaContext';
import { useTheme } from '../context/ThemeContext';
import { StatusType } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, Clock, AlertTriangle } from 'lucide-react';

export default function Report() {
  const { submitReport, hasReportedToday, todayReport, activeDomain } = useLota();
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [reportedStatus, setReportedStatus] = useState<StatusType | null>(null);

  const handleReport = (status: StatusType) => {
    setSubmitting(true);
    setReportedStatus(status);
    
    // Fire real database insert without awaiting, ensuring the UI always progresses
    submitReport(status).catch(err => {
      console.warn("Failed to submit report:", err);
    });

    // Keep animation visible briefly
    setTimeout(() => {
      setSubmitting(false);
      navigate('/');
    }, 2500);
  };

  const isParking = activeDomain === 'parking';
  const accentTextClass = isParking ? 'text-amber-950' : 'text-blue-950';
  const accentTextTitleClass = isParking ? 'text-[#FACC15]' : 'text-blue-500';
  
  const statusOptions = [
    {
      type: 'green' as StatusType,
      title: isParking ? 'Sem Fila' : 'Livre',
      description: isParking ? 'Entrada livre e imediata' : 'Vazio, sirva-se rápido',
      icon: CheckCircle2,
      bgClass: 'bg-[#22C55E] text-black border-transparent active:opacity-90 hover:opacity-95 mb-4',
      glow: 'shadow-emerald-950/20',
      textColor: 'text-emerald-950'
    },
    {
      type: 'yellow' as StatusType,
      title: 'Fila Moderada',
      description: isParking ? 'Linha existente, mas correndo rápido' : 'Alguma espera, mas andando',
      icon: Clock,
      bgClass: 'bg-[#FACC15] text-black border-transparent active:opacity-90 hover:opacity-95 mb-4',
      glow: 'shadow-amber-950/20',
      textColor: 'text-amber-950'
    },
    {
      type: 'red' as StatusType,
      title: 'Fila Intensa',
      description: isParking ? 'Lotação máxima ou tempo lento' : 'Catracas lotadas e lento',
      icon: AlertTriangle,
      bgClass: 'bg-[#EF4444] text-white border-transparent active:opacity-90 hover:opacity-95',
      glow: 'shadow-rose-950/20',
      textColor: 'text-rose-100'
    }
  ];

  return (
    <motion.div
      id="report-screen"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.3 }}
      className={`min-h-[75vh] flex flex-col justify-start p-5 relative rounded-3xl overflow-hidden shadow-2xl transition-all ${
      isDark ? 'bg-zinc-900 text-white border border-white/[0.03]' : 'bg-zinc-50 text-zinc-900 border border-zinc-200/50'
    }`}>
      {/* Dynamic confirm state overlay */}
      <AnimatePresence>
        {submitting && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`absolute inset-0 z-50 flex flex-col items-center justify-center backdrop-blur-md p-6 transition-all ${
              isDark ? 'bg-zinc-900/95' : 'bg-white/95'
            }`}
          >
            <motion.div
              initial={{ scale: 0.6, rotate: -20 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0.6 }}
              className={`flex flex-col items-center p-8 rounded-[2.5rem] text-center shadow-2xl transition-all ${
                isDark ? 'glass border border-white/5 text-white' : 'bg-white border border-zinc-200 shadow-xl text-zinc-900'
              }`}
            >
              <div className="mb-4">
                {reportedStatus === 'green' && <CheckCircle2 size={56} className="text-emerald-500 animate-bounce stroke-[2.5px]" />}
                {reportedStatus === 'yellow' && <Clock size={56} className="text-amber-550 animate-bounce stroke-[2.5px]" />}
                {reportedStatus === 'red' && <AlertTriangle size={56} className="text-rose-500 animate-bounce stroke-[2.5px]" />}
              </div>
              
              <h3 className={`text-2xl font-sans font-black tracking-tight ${accentTextTitleClass}`}>
                {hasReportedToday ? 'Relato Atualizado!' : 'Obrigado por Colaborar!'}
              </h3>
              <p className={`mt-2 text-sm font-sans max-w-xs px-2 leading-relaxed ${isDark ? 'text-zinc-450' : 'text-zinc-650'}`}>
                {hasReportedToday 
                  ? 'Seu relato foi atualizado para manter o painel o mais preciso possível.'
                  : 'Sua contribuição foi registrada com sucesso e ajuda toda a comunidade da PUC-Rio.'}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header instructions */}
      <div className="flex flex-col mb-5 mt-1 text-left px-1">
        <span className="text-xs font-mono text-zinc-500 uppercase tracking-widest">Colaborativo</span>
        <h2 className={`text-2xl font-sans font-extrabold tracking-tight mt-1 ${isDark ? 'text-zinc-100' : 'text-zinc-900'}`}>
          {activeDomain === 'parking' ? 'Como está a fila do estacionamento agora?' : 'Como está a fila do bandejão agora?'}
        </h2>
        <p className={`text-xs font-sans mt-1 ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
          Toque no botão que melhor descreve a sua visão da lotação.
        </p>
      </div>

      {hasReportedToday && todayReport && (
        <div className={`mb-5 p-4 rounded-2xl flex items-start gap-2.5 border text-xs font-sans transition-all leading-relaxed ${
          isDark 
            ? 'bg-amber-500/10 border-amber-500/20 text-amber-305' 
            : 'bg-amber-50 border-amber-200 text-amber-900 shadow-sm'
        }`}>
          <span className="text-sm mt-0.5">⚠️</span>
          <div>
            <strong>Você já colaborou hoje!</strong> Seu relato anterior foi{' '}
            <span className="font-bold inline-flex items-center gap-1.5 bg-zinc-200/60 dark:bg-zinc-900 px-2 py-0.5 rounded-lg border border-black/5 dark:border-white/5 mx-1">
              {todayReport.status === 'green' && <><CheckCircle2 size={12} className="text-emerald-500" /> Sem Fila</>}
              {todayReport.status === 'yellow' && <><Clock size={12} className="text-amber-500" /> Fila andando</>}
              {todayReport.status === 'red' && <><AlertTriangle size={12} className="text-rose-500" /> Fila dando volta</>}
            </span>
            . Ao escolher uma nova opção abaixo, você <strong>atualizará</strong> seu relato existente.
          </div>
        </div>
      )}

      {/* 3 Giant Stacked vertical buttons */}
      <div className="flex-1 flex flex-col justify-stretch">
        {statusOptions.map((opt) => (
          <motion.button
            key={opt.type}
            id={`btn-report-${opt.type}`}
            whileTap={{ scale: 0.97 }}
            onClick={() => handleReport(opt.type)}
            className={`flex-1 flex flex-col justify-center items-center p-6 border rounded-[2rem] text-center cursor-pointer transition-all ${opt.bgClass} shadow-xl relative overflow-hidden`}
          >
            {/* Visual shine accents on cards */}
            <div className="absolute top-0 left-0 w-full h-[1px] bg-white/20"></div>
            
            <div className="mb-3 filter drop-shadow-md">
              <opt.icon size={44} className="stroke-[2.5px]" />
            </div>
            
            <span className="text-xl md:text-2xl font-sans font-black tracking-tight">
              {opt.title}
            </span>
            
            <span className="text-xs font-sans tracking-wide font-semibold uppercase opacity-75 mt-1">
              — {opt.description}
            </span>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}
