
import React, { useState } from 'react';
import { GratitudeEntry } from '../types';

interface GratitudeJournalProps {
  entries: GratitudeEntry[];
  onAdd: (items: string[]) => void;
}

const GratitudeJournal: React.FC<GratitudeJournalProps> = ({ entries, onAdd }) => {
  const [items, setItems] = useState(['', '', '']);
  const [isSaved, setIsSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (items.some(i => i.trim())) {
      onAdd(items.filter(i => i.trim()));
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
      setItems(['', '', '']);
    }
  };

  return (
    <div className="bg-white/60 backdrop-blur-md rounded-2xl p-5 border border-white/80 shadow-sm">
      <h3 className="text-xs font-black uppercase tracking-widest text-rose-600 mb-4">3 Good Things</h3>
      
      {isSaved ? (
        <div className="py-8 text-center animate-bounce">
          <p className="text-sm font-black text-rose-700 uppercase">Awesome job!</p>
          <p className="text-[10px] text-gray-500 font-black uppercase mt-1">Buddy is proud of you</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-3">
          {items.map((item, idx) => (
            <input
              key={idx}
              value={item}
              onChange={(e) => {
                const newItems = [...items];
                newItems[idx] = e.target.value;
                setItems(newItems);
              }}
              placeholder={`Good thing #${idx + 1}...`}
              className="w-full px-4 py-2 rounded-xl bg-white border border-rose-100 focus:border-rose-400 focus:outline-none text-sm font-bold text-gray-900 placeholder:text-gray-500 transition-all shadow-sm"
            />
          ))}
          <button 
            type="submit"
            className="w-full bg-rose-500 hover:bg-rose-600 text-white font-black py-2 rounded-xl shadow-md transition-all uppercase text-xs tracking-widest"
          >
            Save Today's Wins
          </button>
        </form>
      )}

      {entries.length > 0 && (
        <div className="mt-4 pt-4 border-t border-rose-100">
           <p className="text-[10px] font-black text-rose-700 uppercase mb-2 tracking-widest">Recent Gratitude</p>
           <div className="max-h-24 overflow-y-auto no-scrollbar space-y-2">
             {entries.slice(0, 3).map((e) => (
               <div key={e.id} className="text-[11px] text-gray-800 font-medium bg-white/40 p-2 rounded-lg italic border border-rose-50">
                 {e.items.join(' • ')}
               </div>
             ))}
           </div>
        </div>
      )}
    </div>
  );
};

export default GratitudeJournal;
