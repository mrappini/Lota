import React, { useState } from 'react';
import { useLota } from '../context/LotaContext';
import { useTheme } from '../context/ThemeContext';
import { motion } from 'motion/react';
import { ShoppingCart, Trophy, Lock, Unlock, CheckCircle2, Star, Palette, Zap, Heart, Flag } from 'lucide-react';

export default function Store() {
  const { lotaPoints, level, progress, inventory, buyItem, equipItem, equippedTheme, equippedLogo } = useLota();
  const { isDark } = useTheme();
  const [activeTab, setActiveTab] = useState<'conquistas' | 'loja'>('conquistas');

  const storeItems = [
    {
      id: 'rainbow_logo',
      type: 'logo' as const,
      title: 'Logo Arco-Íris',
      desc: 'As barrinhas do Lota ganham as cores do arco-íris de forma permanente.',
      price: 80,
      icon: Star,
      color: 'text-amber-400',
      bg: 'bg-amber-400/10'
    },
    {
      id: 'hacker_theme',
      type: 'theme' as const,
      title: 'Tema Hacker Neon',
      desc: 'As cores do app mudam para tons verdes estilo tela de terminal.',
      price: 150,
      icon: Zap,
      color: 'text-emerald-400',
      bg: 'bg-emerald-400/10'
    },
    {
      id: 'amethyst_theme',
      type: 'theme' as const,
      title: 'Tema Ametista',
      desc: 'Um tema premium escuro banhado em tons violetas e púrpuras.',
      price: 150,
      icon: Palette,
      color: 'text-purple-400',
      bg: 'bg-purple-400/10'
    },
    {
      id: 'algodao_doce_theme',
      type: 'theme' as const,
      title: 'Tema Algodão Doce',
      desc: 'Um tema fofinho, rosa claro e delicado para alegrar o seu dia.',
      price: 200,
      icon: Heart,
      color: 'text-pink-400',
      bg: 'bg-pink-400/10'
    },
    {
      id: 'brazil_theme',
      type: 'theme' as const,
      title: 'Tema Brasil Copa',
      desc: 'Rumo ao Hexa! Sistema tematizado com as cores da nossa bandeira.',
      price: 200,
      icon: Flag,
      color: 'text-blue-400',
      bg: 'bg-yellow-400/10'
    }
  ];

  const badges = [
    { id: 'b1', title: 'Novato', desc: 'Fez seu primeiro reporte.', condition: level >= 2, color: 'text-blue-500' },
    { id: 'b2', title: 'Colaborador Frequente', desc: 'Atingiu o Nível 5.', condition: level >= 5, color: 'text-emerald-500' },
    { id: 'b3', title: 'Herói da Comunidade', desc: 'Atingiu o Nível 10.', condition: level >= 10, color: 'text-amber-500' }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.3 }}
      className={`min-h-[75vh] flex flex-col p-6 pb-24 rounded-3xl overflow-hidden shadow-2xl relative transition-all duration-700 ease-in-out ${
        isDark 
          ? 'bg-[#121215] text-white border border-white/[0.04]' 
          : 'bg-zinc-50 text-zinc-900 border border-black/[0.03]'
      }`}
    >
      <div className="flex flex-col space-y-4 relative z-10 mb-6">
        <h2 className="text-2xl font-sans font-black tracking-tighter">Meu Perfil</h2>
        
        {/* LotaPoints Card */}
        <div className={`p-5 rounded-3xl border flex items-center justify-between shadow-lg ${
          isDark ? 'bg-zinc-900/80 border-white/5' : 'bg-white border-zinc-200'
        }`}>
          <div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-zinc-500 mb-1 block">Saldo LotaPoints</span>
            <div className="flex items-center gap-2">
              <span className="text-3xl font-black text-amber-500">{lotaPoints}</span>
              <span className="text-sm font-bold text-amber-500">pts</span>
            </div>
          </div>
          <div className="flex flex-col items-end">
            <span className={`text-[12px] font-sans font-bold px-3 py-1 rounded-xl mb-2 ${
              isDark ? 'bg-zinc-800 text-white' : 'bg-zinc-100 text-zinc-800'
            }`}>
              Nível {level}
            </span>
            <div className="w-24 h-2 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
              <div className="h-full bg-amber-500 rounded-full" style={{ width: `${progress * 100}%` }}></div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className={`flex p-1 rounded-2xl border ${isDark ? 'bg-zinc-900/50 border-white/5' : 'bg-zinc-200/50 border-zinc-300/30'}`}>
          <button
            onClick={() => setActiveTab('conquistas')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all flex justify-center items-center gap-1.5 ${
              activeTab === 'conquistas' 
                ? (isDark ? 'bg-zinc-800 text-white shadow-sm' : 'bg-white text-zinc-900 shadow-sm')
                : 'text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'
            }`}
          >
            <Trophy size={14} /> Conquistas
          </button>
          <button
            onClick={() => setActiveTab('loja')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all flex justify-center items-center gap-1.5 ${
              activeTab === 'loja' 
                ? (isDark ? 'bg-zinc-800 text-white shadow-sm' : 'bg-white text-zinc-900 shadow-sm')
                : 'text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'
            }`}
          >
            <ShoppingCart size={14} /> Loja
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-4 custom-scrollbar pr-1 relative z-10 pb-8">
        {activeTab === 'conquistas' && (
          <div className="space-y-3">
            {badges.map(badge => (
              <div key={badge.id} className={`p-4 rounded-2xl border flex items-center gap-4 transition-all ${
                badge.condition 
                  ? (isDark ? 'bg-zinc-900/80 border-white/5' : 'bg-white border-zinc-200')
                  : (isDark ? 'bg-zinc-950/50 border-white/5 opacity-60 grayscale' : 'bg-zinc-50 border-zinc-200/50 opacity-60 grayscale')
              }`}>
                <div className={`p-3 rounded-2xl ${badge.condition ? 'bg-zinc-100 dark:bg-zinc-800 ' + badge.color : 'bg-zinc-200 dark:bg-zinc-900 text-zinc-500'}`}>
                  {badge.condition ? <Trophy size={20} /> : <Lock size={20} />}
                </div>
                <div className="flex-1">
                  <h4 className={`text-sm font-bold ${isDark ? 'text-white' : 'text-zinc-900'}`}>{badge.title}</h4>
                  <p className="text-[11px] text-zinc-500 leading-tight mt-0.5">{badge.desc}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'loja' && (
          <div className="space-y-4">
            <p className="text-xs text-zinc-500 leading-relaxed font-medium px-1">
              Gaste seus LotaPoints ganhos reportando filas para desbloquear personalizações exclusivas.
            </p>
            {storeItems.map(item => {
              const isOwned = inventory.includes(item.id);
              const isEquipped = item.type === 'theme' ? equippedTheme === item.id : equippedLogo === item.id;
              
              return (
                <div key={item.id} className={`p-4 rounded-2xl border flex flex-col gap-3 shadow-sm ${
                  isOwned 
                    ? (isDark ? 'bg-zinc-900/50 border-white/5' : 'bg-white border-zinc-200')
                    : (isDark ? 'bg-zinc-900/90 border-amber-500/10' : 'bg-white border-amber-500/10')
                }`}>
                  <div className="flex items-start gap-3">
                    <div className={`p-2.5 rounded-xl ${item.bg} ${item.color}`}>
                      <item.icon size={20} />
                    </div>
                    <div className="flex-1">
                      <h4 className={`text-sm font-bold ${isDark ? 'text-white' : 'text-zinc-900'}`}>{item.title}</h4>
                      <p className="text-[11px] text-zinc-500 leading-snug mt-1">{item.desc}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between pt-3 border-t border-zinc-500/10">
                    <span className="text-xs font-black text-amber-500 flex items-center gap-1">
                      <Star size={12} className="fill-amber-500" />
                      {item.price} pts
                    </span>
                    
                    {isOwned ? (
                      <button
                        onClick={() => isEquipped ? equipItem('default', item.type) : equipItem(item.id, item.type)}
                        className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          isEquipped
                            ? 'bg-emerald-500/10 hover:bg-rose-500/10 text-emerald-500 hover:text-rose-500 hover:border-rose-500/20 border border-emerald-500/20'
                            : (isDark ? 'bg-zinc-800 hover:bg-zinc-700 text-white' : 'bg-zinc-200 hover:bg-zinc-300 text-zinc-900')
                        }`}
                      >
                        {isEquipped ? 'Desativar' : 'Equipar'}
                      </button>
                    ) : (
                      <button
                        onClick={() => buyItem(item.id, item.price, item.type)}
                        className="px-4 py-1.5 rounded-xl text-xs font-bold bg-amber-500 text-black hover:bg-amber-400 transition-all active:scale-95 shadow-lg shadow-amber-500/20 flex items-center gap-1"
                      >
                        <Unlock size={12} /> Comprar
                      </button>
                    )}
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
