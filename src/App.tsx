import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { LotaProvider, useLota } from './context/LotaContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import Dash from './pages/Dash';
import Report from './pages/Report';
import Status from './pages/Status';
import History from './pages/History';
import { LotaLogo } from './components/LotaLogo';
import { 
  Home, 
  Plus, 
  Activity, 
  BarChart3, 
  Sun, 
  Moon, 
  Laptop, 
  X, 
  Settings, 
  Sliders, 
  Database, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Sparkles,
  ChevronDown,
  Info,
  HelpCircle,
  ShieldAlert,
  Lock,
  Car,
  Utensils,
  LogOut
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

function ThemeSelector() {
  const { themeMode, setThemeMode, isDark } = useTheme();
  const { activeDomain } = useLota();
  const isParking = activeDomain === 'parking' || activeDomain === null;
  const accentTextClass = isParking ? 'text-[#FACC15]' : 'text-blue-500';

  return (
    <div className={`flex items-center gap-0.5 p-1 rounded-full ${isDark ? 'bg-zinc-900/40 border border-white/5' : 'bg-zinc-200/65 border border-zinc-300/40'} text-xs font-sans`}>
      <button
        onClick={() => setThemeMode('light')}
        className={`p-1.5 rounded-full transition-all cursor-pointer ${
          themeMode === 'light' 
            ? 'bg-white text-zinc-950 shadow-sm' 
            : `${isDark ? 'text-zinc-500 hover:text-zinc-300' : 'text-zinc-500 hover:text-zinc-800'}`
        }`}
        title="Modo Claro"
      >
        <Sun size={12} />
      </button>
      <button
        onClick={() => setThemeMode('dark')}
        className={`p-1.5 rounded-full transition-all cursor-pointer ${
          themeMode === 'dark' 
            ? `${isDark ? 'bg-zinc-850 text-white shadow-sm' : 'bg-zinc-900 text-white shadow-sm'}` 
            : `${isDark ? 'text-zinc-500 hover:text-zinc-300' : 'text-zinc-500 hover:text-zinc-800'}`
        }`}
        title="Modo Escuro"
      >
        <Moon size={12} />
      </button>
      <button
        onClick={() => setThemeMode('auto')}
        className={`p-1.5 rounded-full transition-all cursor-pointer ${
          themeMode === 'auto' 
            ? `${isDark ? `bg-zinc-800 ${accentTextClass}` : 'bg-zinc-400 text-zinc-950 shadow-sm'}` 
            : `${isDark ? 'text-zinc-500 hover:text-zinc-300' : 'text-zinc-500 hover:text-zinc-800'}`
        }`}
        title="Automático (Sistema)"
      >
        <Laptop size={12} />
      </button>
    </div>
  );
}

function NavigationFooter() {
  const location = useLocation();
  const path = location.pathname;
  const { isDark } = useTheme();
  const { activeDomain } = useLota();
  
  const isParking = activeDomain === 'parking' || activeDomain === null;
  const accentBgClass = isParking ? 'bg-[#FACC15] shadow-amber-500/10' : 'bg-blue-500 shadow-blue-500/10';
  const accentTextClass = isParking ? 'text-[#FACC15]' : 'text-blue-500';

  const basePath = activeDomain === 'parking' ? '/estacionamento' : activeDomain === 'cafeteria' ? '/bandejao' : '';

  const navItems = [
    {
      to: basePath || '/',
      label: 'Dash',
      icon: Home,
    },
    {
      to: `${basePath}/reportar`,
      label: 'Reportar',
      icon: Plus,
      isAction: true,
    },
    {
      to: `${basePath}/status`,
      label: 'Status',
      icon: Activity,
    },
    {
      to: `${basePath}/historico`,
      label: 'Histórico',
      icon: BarChart3,
    },
  ];

  return (
    <footer 
      id="navigation-footer" 
      className={`absolute bottom-0 left-0 right-0 h-20 px-4 flex justify-around items-center z-40 backdrop-blur-md rounded-b-[2.5rem] md:rounded-b-[3rem] shadow-2xl transition-all ${
        isDark 
          ? 'bg-black/40 border-t border-white/5' 
          : 'bg-white/90 border-t border-zinc-200/80 shadow-[0_-10px_30px_rgba(0,0,0,0.03)]'
      }`}
    >
      {navItems.map((item) => {
        const isActive = path === item.to;
        const Icon = item.icon;

        if (item.isAction) {
          // Center action giant button (Reportar)
          return (
            <Link 
              key={item.to} 
              to={item.to} 
              id="nav-link-reportar"
              className="relative -top-3.5 z-50 flex flex-col items-center"
            >
              <motion.div
                whileTap={{ scale: 0.9 }}
                className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg cursor-pointer ${
                  isActive 
                    ? `${accentBgClass} text-black` 
                    : isDark
                      ? 'bg-zinc-900 border border-white/10 text-zinc-100 hover:bg-zinc-800'
                      : 'bg-white border border-zinc-200 text-zinc-800 hover:bg-zinc-100 shadow-md'
                }`}
              >
                <Plus size={28} className="stroke-[3px]" />
              </motion.div>
              <span className={`text-[10px] font-sans font-bold tracking-tight mt-1 ${
                isActive 
                  ? accentTextClass 
                  : isDark 
                    ? 'text-zinc-500' 
                    : 'text-zinc-650'
              }`}>
                {item.label}
              </span>
            </Link>
          );
        }

        return (
          <Link
            key={item.to}
            to={item.to}
            id={`nav-link-${item.label.toLowerCase()}`}
            className="flex flex-col items-center justify-center flex-1 h-full py-1 relative"
          >
            {/* Active page indicator dot */}
            {isActive && (
              <motion.div
                layoutId="active-indicator"
                className={`absolute top-1 w-1.5 h-1.5 rounded-full ${isParking ? 'bg-[#FACC15]' : 'bg-blue-500'}`}
                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
              />
            )}

            <Icon 
              size={20} 
              className={`transition-colors duration-250 ${
                isActive 
                  ? accentTextClass 
                  : isDark 
                    ? 'text-zinc-500 hover:text-zinc-350' 
                    : 'text-zinc-400 hover:text-zinc-800'
              }`} 
            />
            
            <span className={`text-[10px] font-sans font-extrabold tracking-tight mt-1 ${
              isActive 
                ? accentTextClass 
                : isDark 
                  ? 'text-zinc-500' 
                  : 'text-zinc-550'
            }`}>
              {item.label}
            </span>
          </Link>
        );
      })}
    </footer>
  );
}

function AppContent() {
  const { isDark } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const { 
    currentStatus, 
    adminOverride, 
    setAdminOverride,
    clearMyVote,
    todayReport,
    activeDomain,
    setActiveDomain
  } = useLota();

  const [clickCount, setClickCount] = useState(0);
  const [lastClickTime, setLastClickTime] = useState(0);
  const [isAdminUnlocked, setIsAdminUnlocked] = useState(() => {
    return localStorage.getItem('lota-admin-unlocked') === 'true';
  });
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isInjecting, setIsInjecting] = useState(false);
  const [adminNotification, setAdminNotification] = useState<string | null>(null);

  const isParking = activeDomain === 'parking' || activeDomain === null;
  const accentTextClass = isParking ? 'text-[#FACC15]' : 'text-blue-500';
  const accentBgClass = isParking ? 'bg-[#FACC15]' : 'bg-blue-500';

  useEffect(() => {
    const path = location.pathname;
    if (path.startsWith('/estacionamento') && activeDomain !== 'parking') {
      setActiveDomain('parking');
    } else if (path.startsWith('/bandejao') && activeDomain !== 'cafeteria') {
      setActiveDomain('cafeteria');
    }
  }, [location.pathname, activeDomain, setActiveDomain]);

  // Secure controls & funny responses
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [errorShakeCounter, setErrorShakeCounter] = useState(0);

  const FUNNY_MESSAGES = [
    "🔑 Código incorreto. Nem com o Wi-Fi do Pilotis cooperando essa senha passa.",
    "🔑 Quase lá! Mas essa chave não bate com a nossa. Tente novamente.",
    "🔑 Senha incorreta. Mais errado do que tentar achar sala livre no bloco L em semana de prova.",
    "🔑 Acesso negado. A fila da integração no metrô tá menor do que o caminho para adivinhar essa senha.",
    "🔑 Código inválido. Para realizar simulações de fluxo, insira a senha oficial de testes.",
    "🔑 Ops, não é por aí! Essa senha é mais instável que a luz em dia de chuva na Gávea."
  ];

  const showAdminToast = (msg: string) => {
    setAdminNotification(msg);
    setTimeout(() => {
      setAdminNotification(null);
    }, 3000);
  };

  const handleBrandingClick = () => {
    const now = Date.now();
    if (now - lastClickTime > 2000) {
      setClickCount(1);
    } else {
      const nextCount = clickCount + 1;
      setClickCount(nextCount);
      if (nextCount >= 5) {
        setClickCount(0);
        if (isAdminUnlocked) {
          setIsAdminOpen(prev => !prev);
          showAdminToast("🔒 Painel Administrativo Ativado!");
        } else {
          setIsPasswordModalOpen(true);
          setPasswordInput('');
          setPasswordError(null);
        }
      }
    }
    setLastClickTime(now);
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput.trim() === '1431103') {
      setIsAdminUnlocked(true);
      localStorage.setItem('lota-admin-unlocked', 'true');
      setIsPasswordModalOpen(false);
      setIsAdminOpen(true);
      setPasswordInput('');
      setPasswordError(null);
      showAdminToast("🔒 Painel Administrador Ativado! Use os controles.");
    } else {
      const msg = FUNNY_MESSAGES[Math.floor(Math.random() * FUNNY_MESSAGES.length)];
      setPasswordError(msg);
      setErrorShakeCounter(prev => prev + 1);
    }
  };


  return (
    <div className={`min-h-screen flex justify-center items-center font-sans antialiased overflow-x-hidden p-0 sm:p-4 transition-colors duration-500 ${
      isDark ? 'bg-[#121212] text-white' : 'bg-zinc-100 text-zinc-900'
    }`}>
      
      {/* Absolute Admin micro-toasts feedback */}
      <AnimatePresence>
        {adminNotification && (
          <motion.div
            initial={{ opacity: 0, y: -25, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -15, scale: 0.95 }}
            className="fixed top-6 z-50 px-4 py-2.5 rounded-2xl bg-zinc-900 border border-zinc-805 text-[#FACC15] shadow-2xl text-xs font-mono max-w-xs text-center font-bold"
          >
            {adminNotification}
          </motion.div>
        )}
      </AnimatePresence>

      <div className={`w-full max-w-md h-screen sm:h-[85vh] sm:max-h-[900px] sm:rounded-[3rem] sm:border shadow-2xl relative flex flex-col overflow-hidden transition-all duration-500 ${
        isDark 
          ? 'sm:border-zinc-800/40 bg-[#18181b]' 
          : 'sm:border-zinc-200/60 bg-zinc-50'
      }`}>

        {activeDomain === null ? (
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center h-full w-full p-6 relative"
          >
            {/* Background ambient glow - dynamic shapes */}
            <div className={`absolute top-0 right-0 w-64 h-64 rounded-full blur-[100px] pointer-events-none transition-all duration-1000 ${
              isDark ? 'bg-blue-600/10' : 'bg-blue-300/30'
            }`}></div>
            <div className={`absolute bottom-0 left-0 w-80 h-80 rounded-full blur-[120px] pointer-events-none transition-all duration-1000 ${
              isDark ? 'bg-[#FACC15]/10' : 'bg-amber-300/30'
            }`}></div>

            <div className="text-center mb-10 z-10">
              <div className="flex justify-center mb-5">
                <LotaLogo className="h-12 w-auto drop-shadow-2xl" isDark={isDark} activeDomain={activeDomain} />
              </div>
              <h1 className="text-[28px] font-black font-sans tracking-tight mb-2">Selecione o Fluxo</h1>
              <p className={`text-[13px] font-sans font-medium max-w-[240px] mx-auto leading-relaxed ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>
                Escolha qual área você deseja monitorar a lotação agora.
              </p>
            </div>

            <div className="w-full flex flex-col space-y-4 max-w-sm z-10">
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => { setActiveDomain('parking'); navigate('/estacionamento'); }}
                className={`flex flex-col items-start p-6 rounded-[2rem] border transition-all cursor-pointer shadow-lg overflow-hidden relative group ${
                  isDark 
                    ? 'bg-zinc-900/60 border-white/5 hover:border-[#FACC15]/40 hover:bg-zinc-900/80 backdrop-blur-sm' 
                    : 'bg-white border-zinc-200 hover:border-[#FACC15]/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)]'
                }`}
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#FACC15] blur-[80px] rounded-full opacity-0 group-hover:opacity-10 transition-opacity duration-500"></div>
                <div className="p-3 bg-[#FACC15]/10 text-[#FACC15] rounded-2xl mb-4 border border-[#FACC15]/20">
                  <Car size={26} className="stroke-[2.5px]" />
                </div>
                <div className="text-left font-sans">
                  <h2 className="font-black text-xl tracking-tight mb-1">Estacionamento</h2>
                  <p className={`text-[12px] font-medium ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>Guarita principal e trânsito da PUC-Rio</p>
                </div>
              </motion.button>

              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => { setActiveDomain('cafeteria'); navigate('/bandejao'); }}
                className={`flex flex-col items-start p-6 rounded-[2rem] border transition-all cursor-pointer shadow-lg overflow-hidden relative group ${
                  isDark 
                    ? 'bg-zinc-900/60 border-white/5 hover:border-blue-500/40 hover:bg-zinc-900/80 backdrop-blur-sm' 
                    : 'bg-white border-zinc-200 hover:border-blue-500/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)]'
                }`}
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500 blur-[80px] rounded-full opacity-0 group-hover:opacity-10 transition-opacity duration-500"></div>
                <div className="p-3 bg-blue-500/10 text-blue-500 rounded-2xl mb-4 border border-blue-500/20">
                  <Utensils size={26} className="stroke-[2.5px]" />
                </div>
                <div className="text-left font-sans">
                  <h2 className="font-black text-xl tracking-tight mb-1">Bandejão</h2>
                  <p className={`text-[12px] font-medium ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>Filas das catracas do restaurante universitário</p>
                </div>
              </motion.button>
            </div>
          </motion.div>
        ) : (
          <>

        {/* Password Modal Overlay */}
        <AnimatePresence>
          {isPasswordModalOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/85 backdrop-blur-md z-55 flex items-center justify-center p-5 rounded-[3rem] overflow-hidden"
            >
              <motion.div
                key={errorShakeCounter}
                initial={{ scale: 0.9, opacity: 0, y: 15 }}
                animate={{ 
                  scale: 1, 
                  opacity: 1, 
                  y: 0,
                  x: passwordError ? [0, -8, 8, -8, 8, 0] : 0
                }}
                exit={{ scale: 0.9, opacity: 0, y: 15 }}
                transition={{ 
                  type: 'spring', 
                  damping: 25, 
                  stiffness: 350,
                  x: { duration: 0.35 }
                }}
                className={`w-full max-w-xs rounded-3xl p-6 border shadow-2xl space-y-4 ${
                  isDark 
                    ? 'bg-zinc-950 border-zinc-900 text-white' 
                    : 'bg-white border-zinc-200 text-zinc-900'
                }`}
              >
                <div className="flex flex-col items-center text-center space-y-2">
                  <div className="p-3 bg-[#FACC15]/10 border border-[#FACC15]/25 rounded-2xl text-[#EAB308]">
                    <Lock size={18} className="animate-pulse" />
                  </div>
                  <h3 className="font-sans font-black text-sm uppercase tracking-tight">
                    Acesso Restrito
                  </h3>
                  <p className="text-[10px] text-zinc-500 font-sans font-bold leading-relaxed px-1">
                    Insira o código secreto de clicks de administrador para simulações e alteração do status de lotação do estacionamento.
                  </p>
                </div>

                <form onSubmit={handlePasswordSubmit} className="space-y-3.5">
                  <div className="space-y-1">
                    <label className="text-[9px] font-mono text-zinc-400 font-bold block uppercase tracking-wide text-center">
                      Senha Secreta
                    </label>
                    <input
                      type="password"
                      pattern="[0-9]*"
                      inputMode="numeric"
                      placeholder="•••••••"
                      value={passwordInput}
                      onChange={(e) => setPasswordInput(e.target.value)}
                      autoFocus
                      className={`w-full px-4 py-3 rounded-xl text-center text-sm font-mono tracking-widest border transition-all ${
                        passwordError
                          ? 'bg-rose-500/10 border-rose-500 text-rose-500 focus:ring-1 focus:ring-rose-500'
                          : isDark
                            ? 'bg-zinc-900/40 border-white/5 text-white focus:border-[#FACC15] focus:ring-1 focus:ring-[#FACC15]'
                            : 'bg-zinc-50 border-zinc-200 text-zinc-900 focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500'
                      }`}
                    />
                  </div>

                  {passwordError && (
                    <motion.div
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-500 text-[10.5px] leading-relaxed text-center font-bold rounded-xl font-sans"
                    >
                      {passwordError}
                    </motion.div>
                  )}

                  <div className="grid grid-cols-2 gap-2 text-xs font-sans font-bold">
                    <button
                      type="button"
                      onClick={() => {
                        setIsPasswordModalOpen(false);
                        setPasswordInput('');
                        setPasswordError(null);
                      }}
                      className={`py-2.5 rounded-xl border transition-all cursor-pointer ${
                        isDark
                          ? 'bg-zinc-900/45 border-zinc-800 text-zinc-400 hover:bg-zinc-900'
                          : 'bg-zinc-100 border-zinc-300 text-zinc-600 hover:bg-zinc-200'
                      }`}
                    >
                      Desistir
                    </button>
                    <button
                      type="submit"
                      className="py-2.5 rounded-xl bg-[#FACC15] text-black hover:bg-[#FACC15]/90 transition-all font-extrabold cursor-pointer text-center flex items-center justify-center"
                    >
                      Acessar
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Lota Info Modal Overlay (?) */}
        <AnimatePresence>
          {isInfoModalOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/75 backdrop-blur-md z-55 flex items-center justify-center p-5 rounded-[3rem] overflow-hidden"
              onClick={() => setIsInfoModalOpen(false)}
            >
              <motion.div
                initial={{ scale: 0.92, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.92, opacity: 0, y: 20 }}
                transition={{ type: 'spring', damping: 25, stiffness: 360 }}
                className={`w-full max-w-sm rounded-[2rem] p-6 border shadow-2xl space-y-5 overflow-y-auto max-h-[85%] ${
                  isDark 
                    ? 'bg-zinc-950/95 border-zinc-900 text-white' 
                    : 'bg-white border-zinc-200 text-zinc-900'
                }`}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Header branding */}
                <div className="flex flex-col items-center text-center space-y-2 border-b border-zinc-500/10 pb-4">
                  <div className={`p-3 rounded-2xl flex items-center justify-center ${isDark ? 'bg-zinc-900' : 'bg-zinc-100'}`}>
                    <LotaLogo className="h-6 w-auto" isDark={isDark} activeDomain={activeDomain} />
                  </div>
                  <h3 className="font-sans font-black text-base uppercase tracking-tight mt-1">
                    Como funciona o Lota?
                  </h3>
                  <p className={`text-[11px] font-sans ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>
                    A plataforma colaborativa da PUC-Rio.
                  </p>
                </div>

                {/* Body Explanation */}
                <div className="space-y-4 text-xs font-sans">
                  {/* What is Lota */}
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-mono font-black text-[#FACC15] tracking-wider block">
                      O que é o Lota?
                    </span>
                    <p className={`leading-relaxed ${isDark ? 'text-zinc-300' : 'text-zinc-700'}`}>
                      É um projeto comunitário focado em facilitar o seu dia a dia na universidade. O <strong>Lota</strong> permite que alunos, professores e funcionários monitorem e compartilhem a lotação do <strong>Estacionamento</strong> e das filas do <strong>Bandejão</strong> em tempo real.
                    </p>
                  </div>

                  {/* How to use */}
                  <div className="space-y-3">
                    <span className="text-[10px] uppercase font-mono font-black text-[#FACC15] tracking-wider block">
                      Como Usar?
                    </span>
                    
                    {/* Step 1 */}
                    <div className="flex gap-2.5 items-start">
                      <div className="p-1 rounded-lg bg-emerald-500/10 text-emerald-500 mt-0.5 shrink-0">
                        <Activity size={14} />
                      </div>
                      <div>
                        <h4 className="font-extrabold text-[11px] text-zinc-500 uppercase tracking-tight">1. Olhe o Status Geral</h4>
                        <p className={`text-[11px] leading-snug ${isDark ? 'text-zinc-400' : 'text-zinc-650'}`}>
                          A tela principal exibe o termômetro de consenso geral baseado nos informes recentes recebidos {activeDomain === 'parking' ? 'da guarita' : 'das catracas do bandejão'}.
                        </p>
                      </div>
                    </div>

                    {/* Step 2 */}
                    <div className="flex gap-2.5 items-start">
                      <div className="p-1 rounded-lg bg-amber-500/10 text-amber-500 mt-0.5 shrink-0">
                        <Plus size={14} />
                      </div>
                      <div>
                        <h4 className="font-extrabold text-[11px] text-zinc-500 uppercase tracking-tight">2. Envie Seu Reporte</h4>
                        <p className={`text-[11px] leading-snug ${isDark ? 'text-zinc-400' : 'text-zinc-650'}`}>
                          Ao passar pela fila {activeDomain === 'parking' ? 'da guarita ou estacionamento' : 'do restaurante'}, toque em <strong>"Reportar"</strong> e selecione a situação atual. Seu reporte atualiza o termômetro no mesmo instante!
                        </p>
                      </div>
                    </div>

                    {/* Step 3 */}
                    <div className="flex gap-2.5 items-start">
                      <div className="p-1 rounded-lg bg-[#FACC15]/10 text-[#EAB308] mt-0.5 shrink-0">
                        <BarChart3 size={14} />
                      </div>
                      <div>
                        <h4 className="font-extrabold text-[11px] text-zinc-500 uppercase tracking-tight">3. Fuja de Horários de Pico</h4>
                        <p className={`text-[11px] leading-snug ${isDark ? 'text-zinc-400' : 'text-zinc-650'}`}>
                          Consulte a aba de <strong>Histórico</strong> para acompanhar gráficos detalhados de congestionamento por hora e planejar melhor a sua viagem.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Close Button */}
                <button
                  type="button"
                  onClick={() => setIsInfoModalOpen(false)}
                  className="w-full py-2.5 rounded-xl bg-[#FACC15] text-black hover:bg-[#FACC15]/90 transition-all font-extrabold cursor-pointer text-center text-xs tracking-wide uppercase active:scale-95"
                >
                  Entendi tudo!
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Unified Top Header Bar */}
        <div className={`px-5 pt-5 pb-2 flex justify-between items-center z-40 transition-all ${
          isDark ? 'bg-zinc-950/90' : 'bg-zinc-50/90'
        }`}>
          <div 
            onClick={handleBrandingClick}
            className="flex items-center space-x-2 cursor-pointer select-none active:scale-95 transition-transform"
            title="Toque 5 vezes para habilitar controles de teste"
          >
            <div className="flex items-center gap-1.5 py-0.5">
              <LotaLogo className="h-5.5 w-auto" isDark={isDark} activeDomain={activeDomain} />
              {isAdminUnlocked && (
                <ShieldAlert size={12} className="text-[#FACC15] animate-pulse shrink-0" />
              )}
            </div>
            <span 
              onClick={(e) => {
                e.stopPropagation();
                setActiveDomain(null);
                navigate('/');
              }}
              className={`text-[10px] px-2 py-0.5 rounded-full font-sans font-extrabold tracking-wide uppercase transition-all flex items-center gap-1 cursor-pointer active:scale-95 ${
              isDark ? `bg-zinc-900 hover:bg-zinc-800 ${accentTextClass} border border-zinc-800` : 'bg-zinc-200/80 hover:bg-zinc-300 text-zinc-800 border border-zinc-300/30'
            }`}
              title="Trocar de domínio"
            >
              {activeDomain === 'parking' ? 'Estacionamento' : 'Bandejão'} <ChevronDown size={10} />
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Admin Slider Icon */}
            {isAdminUnlocked && (
              <button
                onClick={() => setIsAdminOpen(prev => !prev)}
                className={`p-2 rounded-xl border transition-all cursor-pointer ${
                  isAdminOpen 
                    ? 'bg-[#FACC15] text-black border-transparent' 
                    : isDark 
                      ? 'bg-zinc-900/50 border-white/5 text-[#FACC15]' 
                      : 'bg-white border-zinc-200 text-[#EAB308] shadow-sm'
                }`}
                title="Configurações de teste de lotação"
              >
                <Sliders size={12} />
              </button>
            )}

            {/* Help Info Button (?) */}
            <button
              onClick={() => setIsInfoModalOpen(true)}
              className={`p-2 rounded-xl border transition-all cursor-pointer active:scale-95 ${
                isDark 
                  ? 'bg-zinc-900/50 border-white/5 text-zinc-400 hover:text-white hover:bg-zinc-900 shadow-sm' 
                  : 'bg-white border-zinc-200 text-zinc-500 hover:text-zinc-900 shadow-sm hover:bg-zinc-50'
              }`}
              title="O que é o Lota & Como Usar"
            >
              <HelpCircle size={13} className="stroke-[2.5px]" />
            </button>

            <ThemeSelector />
          </div>
        </div>

        {/* Sliding Admin Controls Panel */}
        <AnimatePresence>
          {isAdminOpen && isAdminUnlocked && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: 'easeInOut' }}
              className={`border-b z-40 overflow-hidden relative ${
                isDark 
                  ? 'bg-zinc-950 border-zinc-900/60 text-white' 
                  : 'bg-zinc-100/95 border-zinc-200 text-zinc-900 shadow-inner'
              }`}
            >
              <div className="p-4 space-y-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-1.5">
                    <Sliders size={13} className="text-[#FACC15]" />
                    <span className="text-[10px] font-mono font-black tracking-wider uppercase text-[#FACC15]">
                      CONTROLES ADMINISTRATIVOS
                    </span>
                  </div>
                  <button 
                    onClick={() => setIsAdminOpen(false)}
                    className="p-1 rounded-md hover:bg-zinc-800/20 transition-colors cursor-pointer"
                  >
                    <X size={12} />
                  </button>
                </div>

                {/* 1. Memory Level Override */}
                <div className="space-y-1.5">
                  <span className="text-[9px] font-mono text-zinc-500 uppercase block font-bold">
                    1. FORÇAR STATUS (APENAS LOCAL EM MEMÓRIA)
                  </span>
                  <div className="grid grid-cols-4 gap-1.5">
                    <button
                      onClick={() => setAdminOverride(null)}
                      className={`py-1 text-[10px] rounded-lg font-sans font-bold border transition-all cursor-pointer ${
                        adminOverride === null
                          ? 'bg-zinc-800 border-[#FACC15] text-white'
                          : isDark ? 'bg-zinc-900/50 border-zinc-800/40 text-zinc-400 hover:bg-zinc-900' : 'bg-white border-zinc-200 hover:bg-zinc-100 text-zinc-700'
                      }`}
                    >
                      Real (BD)
                    </button>
                    <button
                      onClick={() => setAdminOverride('green')}
                      className={`py-1 text-[10px] rounded-lg font-sans font-bold border transition-all flex items-center justify-center gap-0.5 cursor-pointer ${
                        adminOverride === 'green'
                          ? 'bg-emerald-950 border-emerald-500 text-emerald-400 font-black'
                          : isDark ? 'bg-zinc-900/50 border-zinc-800/40 text-emerald-500/80 hover:bg-zinc-900' : 'bg-white border-zinc-200 hover:bg-zinc-100 text-emerald-600'
                      }`}
                    >
                      <CheckCircle2 size={10} /> Sem Fila
                    </button>
                    <button
                      onClick={() => setAdminOverride('yellow')}
                      className={`py-1 text-[10px] rounded-lg font-sans font-bold border transition-all flex items-center justify-center gap-0.5 cursor-pointer ${
                        adminOverride === 'yellow'
                          ? 'bg-amber-950 border-amber-500 text-amber-400 font-black'
                          : isDark ? 'bg-zinc-900/50 border-zinc-800/40 text-amber-500/85 hover:bg-zinc-900' : 'bg-white border-zinc-200 hover:bg-zinc-100 text-amber-600'
                      }`}
                    >
                      <Clock size={10} /> Andando
                    </button>
                    <button
                      onClick={() => setAdminOverride('red')}
                      className={`py-1 text-[10px] rounded-lg font-sans font-bold border transition-all flex items-center justify-center gap-0.5 cursor-pointer ${
                        adminOverride === 'red'
                          ? 'bg-rose-950 border-rose-500 text-rose-400 font-black'
                          : isDark ? 'bg-zinc-900/50 border-zinc-800/40 text-rose-500/80 hover:bg-zinc-900' : 'bg-white border-zinc-200 hover:bg-zinc-100 text-rose-700'
                      }`}
                    >
                      <AlertTriangle size={10} /> Lotado
                    </button>
                  </div>
                </div>

                {/* 2. Session Controls */}
                <div className="space-y-1.5">
                  <span className="text-[9px] font-mono text-zinc-500 uppercase block font-bold">
                    2. CONTROLES DE SESSÃO & DEBUG
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={async () => {
                        await clearMyVote();
                        showAdminToast("🗑️ Seu voto de hoje foi deletado!");
                      }}
                      disabled={!todayReport}
                      className="py-1.5 px-3 text-[10px] rounded-lg font-sans bg-rose-500/10 border border-rose-500/20 hover:bg-rose-500/20 text-rose-500 transition-all font-bold disabled:opacity-30 cursor-pointer flex items-center justify-center gap-1"
                    >
                      Apagar Meu Voto
                    </button>
                    <div className="py-1.5 px-3 text-[10px] rounded-lg font-mono bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 flex items-center justify-center gap-1 font-bold">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                      WSS Online
                    </div>
                  </div>
                </div>

                <div className="pt-2.5 border-t border-zinc-800/30 flex justify-between items-center text-[9px] font-mono text-zinc-500 font-bold">
                  <button 
                    onClick={() => {
                      setIsAdminUnlocked(false);
                      localStorage.removeItem('lota-admin-unlocked');
                      setIsAdminOpen(false);
                      showAdminToast("🔒 Modo Admin Desativado!");
                    }}
                    className="flex items-center gap-1 text-rose-500 hover:text-rose-400 font-bold transition-all cursor-pointer bg-transparent border-none p-0"
                    title="Bloquear painel administrativa de teste"
                  >
                    <X size={10} className="stroke-[3]" /> Bloquear Painel
                  </button>
                  <div className="flex items-center gap-1 text-right">
                    <span>BD Gravado: {allReports.length}</span>
                    <span className="text-zinc-650">•</span>
                    <span>Consenso: {adminOverride ? 'FORÇADO' : 'SINCRONIZADO'}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Scrollable contents zone */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto pb-24 relative">
          <AnimatePresence mode="wait">
            {/* @ts-ignore - React Router types sometimes miss key, but AnimatePresence requires it directly */}
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<Dash />} />
              <Route path="/reportar" element={<Report />} />
              <Route path="/status" element={<Status />} />
              <Route path="/historico" element={<History />} />
              
              <Route path="/estacionamento" element={<Dash />} />
              <Route path="/estacionamento/reportar" element={<Report />} />
              <Route path="/estacionamento/status" element={<Status />} />
              <Route path="/estacionamento/historico" element={<History />} />

              <Route path="/bandejao" element={<Dash />} />
              <Route path="/bandejao/reportar" element={<Report />} />
              <Route path="/bandejao/status" element={<Status />} />
              <Route path="/bandejao/historico" element={<History />} />
            </Routes>
          </AnimatePresence>
        </main>

        {/* Premium action navigation footer */}
        <NavigationFooter />
          </>
        )}
        
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <LotaProvider>
          <AppContent />
        </LotaProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
