
import React from 'react';

interface FunToolsProps {
  onAction: (prompt: string) => void;
  disabled?: boolean;
}

const FunTools: React.FC<FunToolsProps> = ({ onAction, disabled }) => {
  return (
    <div className="bg-white/60 backdrop-blur-md rounded-2xl p-5 border border-white/80 shadow-sm space-y-4">
      <h3 className="text-xs font-black uppercase tracking-widest text-orange-500 mb-4">Buddy's Fun Box</h3>
      
      <button
        onClick={() => onAction("Tell me a funny, kid-friendly joke!")}
        disabled={disabled}
        className="w-full flex items-center gap-4 p-4 rounded-2xl bg-orange-50 hover:bg-orange-100 border border-orange-100 transition-all group disabled:opacity-50"
      >
        <span className="text-3xl group-hover:rotate-12 transition-transform">😂</span>
        <div className="text-left">
          <p className="text-sm font-black text-orange-700 uppercase">Tell me a Joke</p>
          <p className="text-[9px] text-orange-400 font-bold uppercase">Laughter is the best medicine!</p>
        </div>
      </button>

      <button
        onClick={() => onAction("Give me a fun riddle to solve!")}
        disabled={disabled}
        className="w-full flex items-center gap-4 p-4 rounded-2xl bg-blue-50 hover:bg-blue-100 border border-blue-100 transition-all group disabled:opacity-50"
      >
        <span className="text-3xl group-hover:scale-110 transition-transform">🧠</span>
        <div className="text-left">
          <p className="text-sm font-black text-blue-700 uppercase">Riddle Me This</p>
          <p className="text-[9px] text-blue-400 font-bold uppercase">Stretch your brain!</p>
        </div>
      </button>

      <div className="p-3 bg-white/40 rounded-xl border border-dashed border-gray-200">
        <p className="text-[9px] font-black text-gray-400 uppercase text-center leading-relaxed">
          Asking for a joke or riddle will earn Buddy's appreciation!
        </p>
      </div>
    </div>
  );
};

export default FunTools;
