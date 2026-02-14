
import React, { useState, useEffect } from 'react';

const BreathingTool: React.FC = () => {
  const [phase, setPhase] = useState<'In' | 'Hold' | 'Out'>('In');
  const [counter, setCounter] = useState(4);

  useEffect(() => {
    const timer = setInterval(() => {
      setCounter((prev) => {
        if (prev <= 1) {
          if (phase === 'In') { setPhase('Hold'); return 4; }
          if (phase === 'Hold') { setPhase('Out'); return 4; }
          if (phase === 'Out') { setPhase('In'); return 4; }
          return 4;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [phase]);

  return (
    <div className="bg-white/60 backdrop-blur-md rounded-2xl p-6 border border-white/80 shadow-sm flex flex-col items-center">
      <h3 className="text-xs font-black uppercase tracking-widest text-teal-600 mb-6 text-center">Belly Breathing</h3>
      
      <div className="relative flex items-center justify-center w-32 h-32">
        <div 
          className={`absolute rounded-full transition-all duration-[4000ms] ease-in-out bg-teal-200/50
            ${phase === 'In' ? 'w-32 h-32' : phase === 'Hold' ? 'w-32 h-32' : 'w-16 h-16'}
          `}
        />
        <div 
          className={`absolute rounded-full transition-all duration-[4000ms] ease-in-out bg-teal-400 flex items-center justify-center text-white font-black
            ${phase === 'In' ? 'w-24 h-24' : phase === 'Hold' ? 'w-24 h-24' : 'w-12 h-12'}
          `}
        >
          {counter}
        </div>
      </div>
      
      <p className="mt-6 text-lg font-black uppercase tracking-widest text-teal-700 animate-pulse">
        Breathe {phase}
      </p>
      <p className="text-[10px] text-gray-400 font-bold uppercase mt-1">Follow the circle</p>
    </div>
  );
};

export default BreathingTool;
