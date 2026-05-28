import React from 'react';
import { motion } from 'motion/react';
import { useTheme } from '../context/ThemeContext';

interface LotaLoaderProps {
  label?: string;
  size?: number;
}

export function LotaLoader({ label = "Lendo Lotação...", size = 64 }: LotaLoaderProps) {
  const { isDark } = useTheme();

  return (
    <div className={`flex flex-col items-center justify-center min-h-[70vh] ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>
      <motion.div 
        className="relative"
        style={{ width: size, height: size }}
      >
        <svg 
          viewBox="0 0 48 48" 
          className={`w-full h-full overflow-visible ${isDark ? 'text-white' : 'text-zinc-950'}`}
          fill="currentColor"
        >
          {/* Main 'L' stroke */}
          <path 
            d="M 12 8 L 12 32 C 12 38.5, 16.5 40, 21 40 L 41 40" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="8" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            className="opacity-20"
          />
          
          {/* The three bars animating sequentially from bottom to top */}
          {/* Bottom Bar */}
          <motion.rect 
            x="21" y="27" width="16" height="5" rx="2.5"
            initial={{ opacity: 0.2 }}
            animate={{ opacity: [0.2, 1, 0.2] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: 0.0 }}
            fill="#FACC15" 
          />
          {/* Middle Bar */}
          <motion.rect 
            x="21" y="19" width="16" height="5" rx="2.5"
            initial={{ opacity: 0.2 }}
            animate={{ opacity: [0.2, 1, 0.2] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
            fill="#FACC15" 
          />
          {/* Top Bar */}
          <motion.rect 
            x="21" y="11" width="16" height="5" rx="2.5"
            initial={{ opacity: 0.2 }}
            animate={{ opacity: [0.2, 1, 0.2] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }}
            fill="#FACC15" 
          />
        </svg>
      </motion.div>
      {label && <p className="font-sans text-sm tracking-wide mt-4 font-medium animate-pulse">{label}</p>}
    </div>
  );
}
