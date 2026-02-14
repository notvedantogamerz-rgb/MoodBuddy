
import React from 'react';
import { FeedbackRating, FeedbackEntry } from '../types';

interface FeedbackToolProps {
  entries: FeedbackEntry[];
  onAdd: (rating: FeedbackRating) => void;
  disabled?: boolean;
}

const FeedbackTool: React.FC<FeedbackToolProps> = ({ entries, onAdd, disabled }) => {
  const stats = entries.reduce((acc, curr) => {
    acc[curr.rating] = (acc[curr.rating] || 0) + 1;
    return acc;
  }, { good: 0, neutral: 0, bad: 0 } as Record<FeedbackRating, number>);

  const total = entries.length;

  return (
    <div className="bg-white/60 backdrop-blur-md rounded-2xl p-5 border border-white/80 shadow-sm">
      <h3 className="text-xs font-black uppercase tracking-widest text-indigo-500 mb-4">App Feedback</h3>
      
      <div className="grid grid-cols-3 gap-3 mb-6">
        <button
          onClick={() => onAdd('good')}
          disabled={disabled}
          className="flex flex-col items-center gap-1 p-3 rounded-xl bg-green-50 hover:bg-green-100 border border-green-100 transition-all group disabled:opacity-50"
        >
          <span className="text-2xl group-hover:scale-125 transition-transform">😊</span>
          <span className="text-[10px] font-black uppercase text-green-600">Good</span>
        </button>
        <button
          onClick={() => onAdd('neutral')}
          disabled={disabled}
          className="flex flex-col items-center gap-1 p-3 rounded-xl bg-yellow-50 hover:bg-yellow-100 border border-yellow-100 transition-all group disabled:opacity-50"
        >
          <span className="text-2xl group-hover:scale-125 transition-transform">😐</span>
          <span className="text-[10px] font-black uppercase text-yellow-600">Okay</span>
        </button>
        <button
          onClick={() => onAdd('bad')}
          disabled={disabled}
          className="flex flex-col items-center gap-1 p-3 rounded-xl bg-red-50 hover:bg-red-100 border border-red-100 transition-all group disabled:opacity-50"
        >
          <span className="text-2xl group-hover:scale-125 transition-transform">😞</span>
          <span className="text-[10px] font-black uppercase text-red-600">Bad</span>
        </button>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h4 className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Community Pulse</h4>
          <span className="text-[9px] font-bold text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">{total} total</span>
        </div>

        <div className="space-y-2">
          {(['good', 'neutral', 'bad'] as FeedbackRating[]).map((r) => (
            <div key={r} className="relative h-4 bg-gray-100 rounded-full overflow-hidden">
              <div 
                className={`absolute left-0 top-0 h-full transition-all duration-500 ${
                  r === 'good' ? 'bg-green-400' : r === 'neutral' ? 'bg-yellow-400' : 'bg-red-400'
                }`}
                style={{ width: total > 0 ? `${(stats[r] / total) * 100}%` : '0%' }}
              />
              <div className="absolute inset-0 flex items-center justify-between px-2">
                <span className="text-[8px] font-black uppercase text-gray-600 mix-blend-multiply">
                  {r === 'good' ? '😊 Good' : r === 'neutral' ? '😐 Neutral' : '😞 Bad'}
                </span>
                <span className="text-[8px] font-black text-gray-600 mix-blend-multiply">{stats[r]}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="pt-2 border-t border-white/40">
           <p className="text-[9px] font-bold text-gray-400 italic text-center">
             Buddy learns from your feedback to become a better friend!
           </p>
        </div>
      </div>
    </div>
  );
};

export default FeedbackTool;
