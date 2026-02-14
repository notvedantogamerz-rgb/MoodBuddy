
import React from 'react';
import { AvatarConfig } from '../types';

interface MascotLogoProps {
  config: AvatarConfig;
  className?: string;
}

const MascotLogo: React.FC<MascotLogoProps> = ({ config, className = "" }) => {
  return (
    <div className={`relative animate-float drop-shadow-xl flex-shrink-0 ${className}`}>
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <circle cx="15" cy="20" r="2" fill="#60EFFF" />
        <circle cx="85" cy="15" r="2.5" fill="#FF8EC7" />
        <path d="M25 45 Q50 30 75 45" stroke="#2D1E5F" strokeWidth="8" fill="none" />
        
        {/* Main Body */}
        <circle cx="50" cy="55" r="30" fill={config.bodyColor} />
        <circle cx="50" cy="55" r="30" fill="url(#faceGradient)" opacity="0.6" />
        
        {/* Eyes */}
        <circle cx="42" cy="50" r="5" fill="#1A1A1A" />
        <circle cx="40" cy="48" r="2" fill="white" />
        <circle cx="58" cy="50" r="5" fill="#1A1A1A" />
        <circle cx="56" cy="48" r="2" fill="white" />
        
        {/* Mouth */}
        <path d="M42 62 Q50 72 58 62 L42 62" fill="#1A1A1A" />
        
        {/* Headphones */}
        <path d="M20 55 Q20 40 30 40" stroke="#4FB9FF" strokeWidth="6" fill="none" strokeLinecap="round" />
        <rect x="15" y="45" width="12" height="20" rx="6" fill="#4FB9FF" />
        <path d="M80 55 Q80 40 70 40" stroke="#4FB9FF" strokeWidth="6" fill="none" strokeLinecap="round" />
        <rect x="73" y="45" width="12" height="20" rx="6" fill="#4FB9FF" />

        {/* Accessories */}
        {config.accessory === 'glasses' && (
          <g>
            <rect x="35" y="45" width="12" height="10" rx="2" fill="none" stroke="#000" strokeWidth="2" />
            <rect x="53" y="45" width="12" height="10" rx="2" fill="none" stroke="#000" strokeWidth="2" />
            <line x1="47" y1="50" x2="53" y2="50" stroke="#000" strokeWidth="2" />
          </g>
        )}
        {config.accessory === 'hat' && (
          <path d="M35 30 L50 10 L65 30 Z" fill="#FF5B5B" />
        )}
        {config.accessory === 'bow' && (
          <g transform="translate(65, 30)">
            <circle cx="0" cy="0" r="5" fill="#FF8EC7" />
            <path d="M-8 -5 L8 5 M-8 5 L8 -5" stroke="#FF8EC7" strokeWidth="4" />
          </g>
        )}

        <defs>
          <radialGradient id="faceGradient">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0" />
          </radialGradient>
        </defs>
      </svg>
    </div>
  );
};

export default MascotLogo;
