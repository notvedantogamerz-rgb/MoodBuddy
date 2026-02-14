
import React from 'react';
import { Mood } from '../types';
import { MOODS } from '../constants';

interface MoodButtonProps {
  mood: Mood;
  isActive: boolean;
  onClick: (mood: Mood) => void;
  variant?: 'full' | 'compact';
}

const MoodButton: React.FC<MoodButtonProps> = ({ mood, isActive, onClick, variant = 'full' }) => {
  const config = MOODS[mood];
  
  if (variant === 'compact') {
    return (
      <button
        onClick={() => onClick(mood)}
        className={`
          flex flex-col items-center justify-center p-2 rounded-xl transition-all duration-300 transform w-full h-full min-h-[48px] border-2
          ${isActive 
            ? `shadow-lg ${config.bgColor} border-indigo-600 scale-95 ring-2 ring-white` 
            : `${config.bgColor} border-transparent hover:scale-105 opacity-60 hover:opacity-100`
          }
        `}
      >
        <span className={`text-[10px] sm:text-[11px] font-black uppercase tracking-tight leading-tight truncate w-full ${isActive ? 'text-indigo-900' : config.color} text-center`}>
          {mood}
        </span>
      </button>
    );
  }

  return (
    <button
      onClick={() => onClick(mood)}
      className={`
        flex flex-col items-center justify-center p-3 sm:p-4 rounded-xl sm:rounded-2xl transition-all duration-300 transform
        ${isActive 
          ? `scale-105 sm:scale-110 shadow-xl ${config.bgColor} border-2 border-indigo-600 ring-2 sm:ring-4 ring-white ring-opacity-50` 
          : 'bg-white hover:bg-gray-50 border-2 border-transparent shadow-sm hover:shadow-md'
        }
        w-full
      `}
    >
      <span className={`text-[11px] sm:text-sm font-black uppercase tracking-widest leading-tight ${isActive ? 'text-indigo-900' : 'text-gray-600'} text-center break-words`}>
        {mood}
      </span>
    </button>
  );
};

export default MoodButton;
