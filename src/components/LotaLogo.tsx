import React from 'react';
import { motion } from 'motion/react';
interface LotaLogoProps {
  className?: string;
  isDark?: boolean;
  activeDomain?: 'parking' | 'cafeteria' | null;
  forceColor?: string;
}

export const LotaLogo: React.FC<LotaLogoProps> = ({ className = 'h-8 w-auto', isDark = true, activeDomain = null, forceColor }) => {
  let bar1Color = activeDomain === 'parking' ? '#FACC15' : activeDomain === 'cafeteria' ? '#3B82F6' : '#3B82F6';
  let bar2Color = activeDomain === 'parking' ? '#FACC15' : activeDomain === 'cafeteria' ? '#3B82F6' : (isDark ? '#FFFFFF' : '#000000');
  let bar3Color = activeDomain === 'parking' ? '#FACC15' : activeDomain === 'cafeteria' ? '#3B82F6' : '#FACC15';

  if (forceColor === 'rainbow') {
    bar1Color = 'url(#rainbowGrad)';
    bar2Color = 'url(#rainbowGrad)';
    bar3Color = 'url(#rainbowGrad)';
  } else if (forceColor === 'brazil') {
    bar1Color = '#22c55e'; // Green
    bar2Color = '#facc15'; // Yellow
    bar3Color = '#3b82f6'; // Blue
  } else if (forceColor) {
    bar1Color = forceColor;
    bar2Color = forceColor;
    bar3Color = forceColor;
  }

  const strokeColor = forceColor === 'rainbow' ? 'url(#rainbowGrad)' : 'currentColor';

  return (
    <svg 
      viewBox="0 0 160 48" 
      className={`${className} overflow-visible transition-colors duration-305 ${
        isDark ? 'text-white' : 'text-zinc-950'
      }`}
      fill="currentColor"
    >
      <defs>
        <linearGradient id="rainbowGrad" x1="0" y1="0" x2="160" y2="48" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FF007A">
            <animate attributeName="stop-color" values="#FF007A; #7928CA; #FF007A" dur="4s" repeatCount="indefinite" />
          </stop>
          <stop offset="25%" stopColor="#7928CA">
            <animate attributeName="stop-color" values="#7928CA; #FF007A; #7928CA" dur="4s" repeatCount="indefinite" />
          </stop>
          <stop offset="50%" stopColor="#00E676">
            <animate attributeName="stop-color" values="#00E676; #00BFFF; #00E676" dur="4s" repeatCount="indefinite" />
          </stop>
          <stop offset="75%" stopColor="#00BFFF">
            <animate attributeName="stop-color" values="#00BFFF; #7928CA; #00BFFF" dur="4s" repeatCount="indefinite" />
          </stop>
          <stop offset="100%" stopColor="#FF007A">
            <animate attributeName="stop-color" values="#FF007A; #00E676; #FF007A" dur="4s" repeatCount="indefinite" />
          </stop>
        </linearGradient>
      </defs>

      {/* 
        Custom Vector Rendering of 'Lota' brand logo:
        - Geometric, perfectly rounded, high-contrast, scalable strokes.
      */}
      
      {/* Letter 'L' */}
      <path 
        d="M 16 8 L 16 32 C 16 38.5, 20.5 40, 25 40 L 45 40" 
        fill="none" 
        stroke={strokeColor} 
        strokeWidth="8" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
      />
      {/* Inner parking/menu pill bars inside L */}
      <motion.rect x="25" y="11" width="16" height="5" rx="2.5" fill={bar1Color} animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 2, repeat: Infinity, delay: 0 }} />
      <motion.rect x="25" y="19" width="16" height="5" rx="2.5" fill={bar2Color} animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 2, repeat: Infinity, delay: 0.3 }} />
      <motion.rect x="25" y="27" width="16" height="5" rx="2.5" fill={bar3Color} animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 2, repeat: Infinity, delay: 0.6 }} />

      {/* Letter 'o' */}
      <circle 
        cx="68" 
        cy="28.5" 
        r="11" 
        fill="none" 
        stroke={strokeColor} 
        strokeWidth="8" 
      />

      {/* Letter 't' */}
      <path 
        d="M 97 10 L 97 32 A 7 7 0 0 0 104 39 L 105 39" 
        fill="none" 
        stroke={strokeColor} 
        strokeWidth="8" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
      />
      <path 
        d="M 88 18.5 L 103 18.5" 
        fill="none" 
        stroke={strokeColor} 
        strokeWidth="8" 
        strokeLinecap="round" 
      />

      {/* Letter 'a' */}
      <circle 
        cx="126" 
        cy="28.5" 
        r="11" 
        fill="none" 
        stroke={strokeColor} 
        strokeWidth="8" 
      />
      <path 
        d="M 137 18.5 L 137 32 A 7 7 0 0 0 144 39 L 145 39" 
        fill="none" 
        stroke={strokeColor} 
        strokeWidth="8" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
      />
    </svg>
  );
};
