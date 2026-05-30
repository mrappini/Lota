import React, { useState } from 'react';
import { useLota } from '../context/LotaContext';
import { useTheme } from '../context/ThemeContext';
import { getDayName } from '../utils/phrases';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Calendar, 
  AlertCircle, 
  Database, 
  Clock, 
  UserCheck, 
  RefreshCw,
  TrendingUp,
  CheckCircle2,
  AlertTriangle 
} from 'lucide-react';

export default function History() {
  const { allReports, loading, error, userId, activeDomain } = useLota();
  const { isDark } = useTheme();
  const [selectedDay, setSelectedDay] = useState<number>(new Date().getDay());
  const [activeHour, setActiveHour] = useState<number | null>(null);

  const daysLabels = [
    { label: 'Dom', value: 0 },
    { label: 'Seg', value: 1 },
    { label: 'Ter', value: 2 },
    { label: 'Qua', value: 3 },
    { label: 'Qui', value: 4 },
    { label: 'Sex', value: 5 },
    { label: 'Sáb', value: 6 },
  ];
  
  // Focus hour range (7h - 22h)
  const hoursOfOperation = Array.from({ length: 16 }, (_, i) => i + 7);

  // Grouping reports
  const reportsForSelectedDay = allReports.filter(r => r.dayOfWeek === selectedDay);
  const totalDayReports = reportsForSelectedDay.length;

  const hoursData = hoursOfOperation.map((h) => {
    const matchingReports = reportsForSelectedDay.filter((r) => r.hour === h);
    const green = matchingReports.filter((r) => r.status === 'green').length;
    const yellow = matchingReports.filter((r) => r.status === 'yellow').length;
    const red = matchingReports.filter((r) => r.status === 'red').length;
    const total = matchingReports.length;

    return {
      hour: h,
      hourStr: `${String(h).padStart(2, '0')}h`,
      green,
      yellow,
      red,
      total,
    };
  });

  // Calculate highest weight hour for selected day
  const peakHourData = hoursData.reduce(
    (max, curr) => {
      // Weight red/yellow heavily to locate true peak congestion hours
      const weight = curr.green * 1 + curr.yellow * 3 + curr.red * 6;
      return weight > max.weight ? { hour: curr.hour, weight, total: curr.total } : max;
    },
    { hour: 12, weight: 0, total: 0 }
  );

  // Calculate consensus trend status
  const dayGreen = reportsForSelectedDay.filter(r => r.status === 'green').length;
  const dayYellow = reportsForSelectedDay.filter(r => r.status === 'yellow').length;
  const dayRed = reportsForSelectedDay.filter(r => r.status === 'red').length;

  let consensusStatus: 'green' | 'yellow' | 'red' | 'none' = 'none';
  if (totalDayReports > 0) {
    if (dayGreen >= dayYellow && dayGreen >= dayRed) consensusStatus = 'green';
    else if (dayYellow >= dayGreen && dayYellow >= dayRed) consensusStatus = 'yellow';
    else consensusStatus = 'red';
  }

  const dayName = getDayName(selectedDay);

  // Formatting timestamp naturally
  const formatReportTime = (createdAt: any) => {
    if (!createdAt) return 'Agora';
    // Mapeamento temporário para o novo modelo do Supabase (timestamp) ou fallback do legado
    const dateStr = typeof createdAt === 'string' ? createdAt : (createdAt?.timestamp || new Date());
    const date = new Date(dateStr);

    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Agora';
    if (diffMins < 60) return `Há ${diffMins} min`;
    if (diffHours < 24) return `Há ${diffHours}h`;
    if (diffDays === 1) return 'Ontem';
    if (diffDays < 7) {
      const weekdays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
      return `${weekdays[date.getDay()]} às ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
    }
    
    return date.toLocaleDateString('pt-BR', { 
      day: '2-digit', 
      month: '2-digit', 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  // Display-friendly identifier tags for contributors
  const getCollaboratorTag = (itemUserId?: string) => {
    if (!itemUserId) return 'Colaborador';
    if (itemUserId === userId) return 'Você';
    const hash = itemUserId.substring(4, 8) || 'abcd';
    return `Membro #${hash}`;
  };

  // Get historical density bar calculations (proportional heights absolute to busiest hours)
  const maxHourReportsCount = Math.max(...hoursData.map(h => h.total), 1);

  const isParking = activeDomain === 'parking';
  const accentTextClass = isParking ? 'text-[#FACC15]' : 'text-blue-500';
  const bgDarkClass = 'bg-zinc-900';

  return (
    <motion.div
      id="history-screen"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.3 }}
      className={`min-h-[75vh] flex flex-col justify-start p-5 relative rounded-3xl overflow-hidden shadow-2xl transition-all ${
        isDark ? `text-white ${bgDarkClass} border border-white/[0.03]` : 'text-zinc-900 bg-zinc-50 border border-zinc-200/50'
      }`}
    >
      {/* Header Panel */}
      <div className="flex justify-between items-center mb-5 mt-1 border-b pb-4 border-zinc-200/50 dark:border-zinc-800/50">
        <div>
          <h2 className={`text-xl font-sans font-black tracking-tight ${isDark ? 'text-white' : 'text-zinc-950'}`}>
            Histórico de Fluxo
          </h2>
          <p className={`text-xs font-sans mt-0.5 ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>
            Acompanhe o movimento histórico enviado por alunos e servidores.
          </p>
        </div>
        <div className={`p-2 rounded-xl border ${
          isDark 
            ? 'bg-zinc-900 border-zinc-800/80 text-zinc-400' 
            : 'bg-white border-zinc-200 text-zinc-500 shadow-sm'
        }`}>
          <Calendar size={16} />
        </div>
      </div>

      {error && (
        <div className={`mb-4 p-3.5 rounded-2xl border text-xs font-sans transition-all leading-relaxed flex items-start gap-2 ${
          isDark 
            ? 'bg-rose-500/10 border-rose-500/20 text-rose-400' 
            : 'bg-rose-50 border-rose-200 text-rose-900'
        }`}>
          <span className="text-sm shrink-0">⚠️</span>
          <span>
            <strong>Conexão interrompida com o banco:</strong> {error}
          </span>
        </div>
      )}

      {/* Modern, high-end stats cards */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        <div className={`p-3 rounded-2xl border transition-all ${
          isDark ? 'bg-[#0f0f0f] border-zinc-900' : 'bg-white border-zinc-205/80 shadow-sm'
        }`}>
          <div className="flex items-center gap-1 text-[9px] uppercase font-mono tracking-wider text-zinc-400">
            <Database size={10} className="text-zinc-400" />
            <span>Registros</span>
          </div>
          <p className={`text-base font-sans font-extrabold mt-1 tracking-tight ${isDark ? accentTextClass : 'text-zinc-950'}`}>
            {totalDayReports}
          </p>
          <span className="text-[9px] font-sans text-zinc-500 block mt-0.5">nesta {dayName.toLowerCase()}</span>
        </div>

        <div className={`p-3 rounded-2xl border transition-all ${
          isDark ? 'bg-[#0f0f0f] border-zinc-900' : 'bg-white border-zinc-205/80 shadow-sm'
        }`}>
          <div className="flex items-center gap-1 text-[9px] uppercase font-mono tracking-wider text-zinc-400">
            <Clock size={10} className="text-zinc-400" />
            <span>Horário Pico</span>
          </div>
          <p className={`text-base font-sans font-extrabold mt-1 tracking-tight ${isDark ? 'text-zinc-200' : 'text-zinc-950'}`}>
            {totalDayReports > 0 && peakHourData.weight > 0 ? `${peakHourData.hour}:00` : '--:--'}
          </p>
          <span className="text-[9px] font-sans text-zinc-500 block mt-0.5">maior concentração</span>
        </div>

        <div className={`p-3 rounded-2xl border transition-all ${
          isDark ? 'bg-[#0f0f0f] border-zinc-900' : 'bg-white border-zinc-205/80 shadow-sm'
        }`}>
          <div className="flex items-center gap-1 text-[9px] uppercase font-mono tracking-wider text-zinc-400">
            <UserCheck size={10} className="text-zinc-400" />
            <span>Frequente</span>
          </div>
          <div className="mt-1 font-sans font-extrabold text-xs">
            {consensusStatus === 'green' && (
              <span className={`${isDark ? 'text-emerald-400' : 'text-emerald-700'} flex items-center gap-1 font-bold`}>
                <CheckCircle2 size={12} className="shrink-0" /> Rápido
              </span>
            )}
            {consensusStatus === 'yellow' && (
              <span className={`${isDark ? 'text-amber-400' : 'text-amber-700'} flex items-center gap-1 font-bold`}>
                <Clock size={12} className="shrink-0" /> Médio
              </span>
            )}
            {consensusStatus === 'red' && (
              <span className={`${isDark ? 'text-rose-400' : 'text-rose-700'} flex items-center gap-1 font-bold`}>
                <AlertTriangle size={12} className="shrink-0" /> Demorado
              </span>
            )}
            {consensusStatus === 'none' && (
              <span className="text-zinc-500">
                Sem dados
              </span>
            )}
          </div>
          <span className="text-[9px] font-sans text-zinc-500 block mt-0.5">comportamento</span>
        </div>
      </div>

      {/* Week Day Pills Picker */}
      <div className={`p-1.5 flex justify-between gap-1 w-full rounded-2xl mb-4 border transition-colors ${
        isDark ? 'bg-zinc-950 border-zinc-910' : 'bg-zinc-100/80 border-zinc-200'
      }`}>
        {daysLabels.map((day) => {
          const isSelected = selectedDay === day.value;
          return (
            <button
              key={day.value}
              onClick={() => {
                setSelectedDay(day.value);
                setActiveHour(null);
              }}
              className={`flex-1 text-center py-1.5 px-0.5 rounded-xl text-xs font-sans font-bold cursor-pointer transition-all ${
                isSelected
                  ? isDark 
                    ? 'bg-zinc-800 text-white font-extrabold border border-zinc-800'
                    : 'bg-white text-zinc-950 shadow-sm font-extrabold border border-zinc-200'
                  : isDark
                    ? 'text-zinc-400 hover:text-white'
                    : 'text-zinc-500 hover:text-zinc-900'
              }`}
            >
              {day.label}
            </button>
          );
        })}
      </div>

      {/* Smart informative description banner */}
      <div className={`rounded-2xl p-3.5 mb-4 flex items-start space-x-3 text-left border ${
        isDark ? 'bg-zinc-900/20 border-zinc-900/60' : 'bg-white border-zinc-200/80 shadow-sm'
      }`}>
        <div className="p-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-900 text-zinc-500 dark:text-zinc-400 border border-zinc-200/40 dark:border-zinc-800/40 shrink-0 mt-0.5">
          <AlertCircle size={14} />
        </div>
        <div className={`text-[11px] font-sans leading-relaxed ${isDark ? 'text-zinc-300' : 'text-zinc-605'}`}>
          {totalDayReports > 0 ? (
            <span>
              Nas <strong>{dayName}s</strong>, o fluxo tende a acumular por volta de{' '}
              <strong>{peakHourData.hour}:00</strong>. Prefira horários alternativos para desviar da fila {activeDomain === 'parking' ? 'do estacionamento' : 'do bandejão'}.
            </span>
          ) : (
            <span>Sem registros salvos para <strong>{dayName}</strong>. Envie a situação atual agora mesmo para registrar o status no painel.</span>
          )}
        </div>
      </div>

      {/* Bulletproof Custom Hourly Heatmap / Distribution Chart */}
      <div className={`rounded-3xl p-4 flex flex-col mb-4 border transition-colors ${
        isDark ? 'bg-zinc-950/30 border-zinc-900' : 'bg-white border-zinc-200 shadow-sm'
      }`}>
        <div className="flex justify-between items-center mb-4">
          <span className="text-xs font-sans font-extrabold tracking-tight flex items-center gap-1.5">
            <TrendingUp size={14} className="text-zinc-500" />
            Densidade Horária ({dayName})
          </span>
          <span className="text-[10px] font-mono text-zinc-400">7h às 22h</span>
        </div>

        {totalDayReports === 0 ? (
          <div className="text-center py-12 px-4 transition-all">
            <Database size={32} className="text-zinc-600 dark:text-zinc-800 mx-auto mb-2 animate-pulse" />
            <h4 className={`text-xs font-sans font-bold mb-1 ${isDark ? 'text-zinc-400' : 'text-zinc-700'}`}>
              Nenhum relato no histórico
            </h4>
            <p className={`text-[10px] font-sans max-w-[250px] mx-auto leading-normal ${isDark ? 'text-zinc-600' : 'text-zinc-500'}`}>
              Não há dados salvos para este dia da semana. Clique no botão de simulação no final da página para preencher com dados reais.
            </p>
          </div>
        ) : (
          <div className="flex flex-col">
            {/* Chart Grid with robust layout heights */}
            <div className="flex items-end justify-between h-28 pt-2 px-1 relative border-b border-zinc-200/50 dark:border-zinc-800/50">
              {hoursData.map((hData) => {
                const isActive = activeHour === hData.hour;
                const totalReports = hData.total;
                
                // Solid proportional height bounds (minimum 4% to remain selectable)
                const heightPercentage = totalReports > 0 
                  ? Math.max(12, Math.floor((totalReports / maxHourReportsCount) * 100)) 
                  : 4;

                // Sector percentages inside stacked bars
                const greenPct = totalReports > 0 ? (hData.green / totalReports) * 100 : 0;
                const yellowPct = totalReports > 0 ? (hData.yellow / totalReports) * 100 : 0;
                const redPct = totalReports > 0 ? (hData.red / totalReports) * 100 : 0;

                return (
                  <div 
                    key={hData.hour} 
                    className="flex-1 h-full flex flex-col justify-end items-center group cursor-pointer"
                    onClick={() => setActiveHour(isActive ? null : hData.hour)}
                  >
                    {/* Segmented bar wrapper growing to occupy chart area minus label */}
                    <div className="w-full flex-1 flex flex-col justify-end items-center px-0.5 min-h-[30px]">
                      {/* Stacked bar structure */}
                      <div 
                        style={{ height: `${heightPercentage}%` }}
                        className={`w-3 relative rounded-[3px] overflow-hidden transition-all duration-200 flex flex-col justify-end ${
                          isActive 
                            ? 'ring-2 ring-zinc-400 dark:ring-zinc-600 ring-offset-2 ring-offset-white dark:ring-offset-black scale-105' 
                            : 'hover:scale-110'
                        } ${totalReports === 0 ? 'bg-zinc-200 dark:bg-zinc-900/60' : ''}`}
                      >
                        {totalReports > 0 ? (
                          <>
                            <div style={{ height: `${redPct}%` }} className="bg-rose-500 dark:bg-rose-600 w-full" />
                            <div style={{ height: `${yellowPct}%` }} className="bg-amber-400 dark:bg-amber-500 w-full" />
                            <div style={{ height: `${greenPct}%` }} className="bg-emerald-500 dark:bg-emerald-600 w-full" />
                          </>
                        ) : (
                          <div className="w-full h-1 bg-zinc-220 dark:bg-zinc-800 rounded-full" />
                        )}
                      </div>
                    </div>
                    {/* Precise hour coordinates label */}
                    <span className={`text-[10px] font-mono mt-1.5 select-none transition-colors duration-200 ${
                      isActive 
                        ? 'text-amber-500 font-bold' 
                        : 'text-zinc-400 dark:text-zinc-500 group-hover:text-zinc-800 dark:group-hover:text-zinc-300'
                    }`}>
                      {hData.hour}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Selected Hour Detail Overlay inside screen boundaries */}
            <div className="min-h-[46px] mt-3">
              <AnimatePresence mode="wait">
                {activeHour !== null ? (
                  (() => {
                    const selectedHourData = hoursData.find(h => h.hour === activeHour);
                    if (!selectedHourData || selectedHourData.total === 0) {
                      return (
                        <motion.div 
                          key="no-relatos"
                          initial={{ opacity: 0, scale: 0.98 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0 }}
                          className={`text-xs p-2.5 rounded-xl text-center border font-sans ${
                            isDark ? 'bg-zinc-900/40 border-zinc-900 text-zinc-500' : 'bg-zinc-100/50 border-zinc-200 text-zinc-500'
                          }`}
                        >
                          Sem registros históricos às <strong>{activeHour}:00</strong>.
                        </motion.div>
                      );
                    }

                    return (
                      <motion.div
                        key="active-details"
                        initial={{ opacity: 0, scale: 0.98, y: -2 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.98, y: -2 }}
                        className={`p-3 rounded-2xl flex items-center justify-between gap-3 text-xs border transition-all ${
                          isDark 
                            ? 'bg-zinc-900 border-zinc-800/80 text-white' 
                            : 'bg-zinc-100/60 border-zinc-200 text-zinc-805'
                        }`}
                      >
                        <div>
                          <p className={`font-extrabold text-sm tracking-tight ${isDark ? 'text-amber-400' : 'text-amber-800'}`}>Detalhes de {activeHour}:00</p>
                          <p className={`text-[10px] font-sans ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
                            {selectedHourData.total} {selectedHourData.total === 1 ? 'registro' : 'registros recebidos'}
                          </p>
                        </div>
                        <div className="flex gap-3 items-center font-mono font-bold text-[11px] shrink-0">
                          <span className={`flex items-center gap-1 ${isDark ? 'text-emerald-400' : 'text-emerald-700 font-bold'} mr-0.5`}>
                            <CheckCircle2 size={11} className="shrink-0" /> {selectedHourData.green}
                          </span>
                          <span className={`flex items-center gap-1 ${isDark ? 'text-amber-400' : 'text-amber-700 font-bold'} mr-0.5`}>
                            <Clock size={11} className="shrink-0" /> {selectedHourData.yellow}
                          </span>
                          <span className={`flex items-center gap-1 ${isDark ? 'text-rose-400' : 'text-rose-700 font-bold'}`}>
                            <AlertTriangle size={11} className="shrink-0" /> {selectedHourData.red}
                          </span>
                        </div>
                      </motion.div>
                    );
                  })()
                ) : (
                  <div className={`text-[11px] p-3 rounded-2xl border border-dashed text-center font-sans ${
                    isDark ? 'border-zinc-900 bg-zinc-900/5 text-zinc-600' : 'border-zinc-200 bg-zinc-50/50 text-zinc-500'
                  }`}>
                    Selecione uma barra do gráfico para detalhar o fluxo daquele horário por cor.
                  </div>
                )}
              </AnimatePresence>
            </div>
          </div>
        )}
      </div>

      {/* Real-time Collaboration Live Feed */}
      <div className={`rounded-3xl p-4 flex flex-col mb-4 border transition-colors ${
        isDark ? 'bg-zinc-950/10 border-zinc-900' : 'bg-white border-zinc-200'
      }`}>
        <div className="flex justify-between items-center mb-3.5">
          <span className="text-xs font-sans font-extrabold tracking-tight flex items-center gap-1.5 text-zinc-800 dark:text-zinc-200">
            <RefreshCw size={13} className="text-zinc-400 dark:text-zinc-500 shrink-0" />
            Transmissões Recentes
          </span>
          <span className={`px-2 py-0.5 rounded-full text-[9px] font-mono tracking-wider font-extrabold uppercase shrink-0 ${
            isDark ? 'bg-zinc-900 text-zinc-400' : 'bg-zinc-100 text-zinc-600'
          }`}>
            Feed Vivo
          </span>
        </div>

        {allReports.length === 0 ? (
          <div className="text-center py-10 px-4">
            <span className="text-lg block mb-1">📡</span>
            <p className={`text-[11px] font-sans leading-normal font-bold ${isDark ? 'text-zinc-500' : 'text-zinc-600'}`}>
              Nenhuma entrada de dados recebida
            </p>
          </div>
        ) : (
          <div className="max-h-60 overflow-y-auto pr-1 space-y-3.5 scrollbar-thin">
            {allReports.slice(0, 10).map((report, idx) => {
              const isMine = report.userId === userId;
              return (
                <div key={report.id || idx} className="flex gap-3 text-left">
                  {/* Visual Node Connector & Line */}
                  <div className="flex flex-col items-center">
                    <div className={`w-3 h-3 rounded-full flex items-center justify-center relative z-10 shrink-0 mt-1 border ${
                      report.status === 'green' 
                        ? 'bg-emerald-500/15 border-emerald-500/20' 
                        : report.status === 'yellow' 
                        ? 'bg-amber-500/15 border-amber-500/20' 
                        : 'bg-rose-500/15 border-rose-500/20'
                    }`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${
                        report.status === 'green' 
                          ? 'bg-emerald-500' 
                          : report.status === 'yellow' 
                          ? 'bg-amber-400' 
                          : 'bg-rose-500'
                      }`} />
                    </div>
                    {idx !== Math.min(allReports.length, 10) - 1 && (
                      <div className={`w-[1px] flex-1 mt-1.5 ${isDark ? 'bg-zinc-900/60' : 'bg-zinc-200/80'}`} />
                    )}
                  </div>

                  {/* Status update block */}
                  <div className="flex-1 pb-1">
                    <div className="flex justify-between items-baseline gap-2">
                      <span className={`text-[11px] font-sans font-bold ${
                        isMine 
                          ? isDark ? 'text-amber-400' : 'text-zinc-950 font-black' 
                          : isDark ? 'text-zinc-300' : 'text-zinc-800'
                      }`}>
                        {getCollaboratorTag(report.userId)}
                      </span>
                      <span className="text-[10px] font-mono text-zinc-400 dark:text-zinc-500 shrink-0">
                        {formatReportTime(report.createdAt)}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 mt-1">
                      <span className={`text-[9.5px] font-sans rounded-lg px-2 py-0.5 font-bold border ${
                        report.status === 'green' 
                          ? isDark 
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/10' 
                            : 'bg-emerald-100 text-emerald-800 border-emerald-300/40' 
                          : report.status === 'yellow' 
                          ? isDark 
                            ? 'bg-amber-500/10 text-amber-400 border-amber-500/10' 
                            : 'bg-amber-100 text-amber-900 border-amber-300/40' 
                          : isDark 
                            ? 'bg-rose-500/10 text-rose-400 border-rose-500/10' 
                            : 'bg-rose-100 text-rose-900 border-rose-300/40'
                      }`}>
                        {report.status === 'green' && 'Livre'}
                        {report.status === 'yellow' && 'Moderado'}
                        {report.status === 'red' && 'Lotado'}
                      </span>
                      <span className={`text-[10px] font-mono ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>
                        ({getDayName(report.dayOfWeek).substring(0, 3)}, {String(report.hour).padStart(2, '0')}h)
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </motion.div>
  );
}
