import React from 'react';

interface LotaLogoProps {
  className?: string;
  isDark?: boolean;
}

export const LotaLogo: React.FC<LotaLogoProps> = ({ className = 'h-8 w-auto', isDark = true }) => {
  return (
    <svg 
      viewBox="0 0 160 48" 
      className={`${className} overflow-visible transition-colors duration-305 ${
        isDark ? 'text-white' : 'text-zinc-950'
      }`}
      fill="currentColor"
    >
      {/* 
        Custom Vector Rendering of 'Lota' brand logo:
        - Geometric, perfectly rounded, high-contrast, scalable strokes.
      */}
      
      {/* Letter 'L' */}
      <path 
        d="M 16 8 L 16 32 C 16 38.5, 20.5 40, 25 40 L 45 40" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="8" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
      />
      {/* Inner parking/menu pill bars inside L */}
      <rect x="25" y="11" width="16" height="5" rx="2.5" />
      <rect x="25" y="19" width="16" height="5" rx="2.5" />
      <rect x="25" y="27" width="16" height="5" rx="2.5" />

      {/* Letter 'o' */}
      <circle 
        cx="68" 
        cy="28.5" 
        r="11" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="8" 
      />

      {/* Letter 't' */}
      <path 
        d="M 97 10 L 97 32 A 7 7 0 0 0 104 39 L 105 39" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="8" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
      />
      <path 
        d="M 88 18.5 L 103 18.5" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="8" 
        strokeLinecap="round" 
      />

      {/* Letter 'a' */}
      <circle 
        cx="126" 
        cy="28.5" 
        r="11" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="8" 
      />
      <path 
        d="M 137 18.5 L 137 32 A 7 7 0 0 0 144 39 L 145 39" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="8" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
      />
    </svg>
  );
};
