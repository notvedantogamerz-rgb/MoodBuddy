
import React from 'react';
import { AvatarConfig, UserProgress } from '../types';

interface AvatarCustomizerProps {
  config: AvatarConfig;
  onChange: (config: AvatarConfig) => void;
  progress: UserProgress;
}

const COLORS = [
  { name: 'Classic', value: '#FFD95B' },
  { name: 'Mint', value: '#A7F3D0' },
  { name: 'Sky', value: '#BAE6FD' },
  { name: 'Lavender', value: '#E9D5FF' },
  { name: 'Rose', value: '#FECDD3' }
];

const ACCESSORIES: Array<{ id: AvatarConfig['accessory'], label: string, icon: string }> = [
  { id: 'none', label: 'None', icon: '❌' },
  { id: 'glasses', label: 'Cool', icon: '🕶️' },
  { id: 'hat', label: 'Party', icon: '🥳' },
  { id: 'bow', label: 'Fancy', icon: '🎀' }
];

const AvatarCustomizer: React.FC<AvatarCustomizerProps> = ({ config, onChange, progress }) => {
  return (
    <div className="space-y-4">
      {/* Star Guide Section */}
      <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl p-5 border border-yellow-100 shadow-sm">
        <h3 className="text-xs font-black uppercase tracking-widest text-yellow-600 mb-3 flex items-center gap-2">
          ⭐ Earn Friendship Stars
        </h3>
        <p className="text-[10px] text-gray-500 font-bold uppercase mb-4 leading-relaxed">
          Help Buddy grow by completing these daily goals! Each one earns you a star.
        </p>
        
        <div className="space-y-2">
          <div className={`flex items-center gap-3 p-2 rounded-xl border transition-all ${progress.completedToday.mood ? 'bg-green-50 border-green-200' : 'bg-white/50 border-gray-100'}`}>
            <span className="text-lg">{progress.completedToday.mood ? '✅' : '🌈'}</span>
            <div>
              <p className={`text-[10px] font-black uppercase ${progress.completedToday.mood ? 'text-green-700' : 'text-gray-600'}`}>Mood Check-In</p>
              <p className="text-[8px] text-gray-400 font-bold uppercase">Tell Buddy how you feel</p>
            </div>
          </div>

          <div className={`flex items-center gap-3 p-2 rounded-xl border transition-all ${progress.completedToday.breathing ? 'bg-green-50 border-green-200' : 'bg-white/50 border-gray-100'}`}>
            <span className="text-lg">{progress.completedToday.breathing ? '✅' : '🧘'}</span>
            <div>
              <p className={`text-[10px] font-black uppercase ${progress.completedToday.breathing ? 'text-green-700' : 'text-gray-600'}`}>Zen Moment</p>
              <p className="text-[8px] text-gray-400 font-bold uppercase">Try a breathing exercise</p>
            </div>
          </div>

          <div className={`flex items-center gap-3 p-2 rounded-xl border transition-all ${progress.completedToday.gratitude ? 'bg-green-50 border-green-200' : 'bg-white/50 border-gray-100'}`}>
            <span className="text-lg">{progress.completedToday.gratitude ? '✅' : '📝'}</span>
            <div>
              <p className={`text-[10px] font-black uppercase ${progress.completedToday.gratitude ? 'text-green-700' : 'text-gray-600'}`}>3 Good Things</p>
              <p className="text-[8px] text-gray-400 font-bold uppercase">Write in your journal</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white/60 backdrop-blur-md rounded-2xl p-5 border border-white/80 shadow-sm space-y-6">
        <div>
          <h3 className="text-xs font-black uppercase tracking-widest text-indigo-500 mb-4">Buddy's Color</h3>
          <div className="flex flex-wrap gap-3">
            {COLORS.map((c) => (
              <button
                key={c.value}
                onClick={() => onChange({ ...config, bodyColor: c.value })}
                className={`w-10 h-10 rounded-full border-4 transition-all ${config.bodyColor === c.value ? 'border-indigo-500 scale-110' : 'border-white'}`}
                style={{ backgroundColor: c.value }}
                title={c.name}
              />
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-xs font-black uppercase tracking-widest text-indigo-500 mb-4">Accessories</h3>
          <div className="grid grid-cols-2 gap-2">
            {ACCESSORIES.map((a) => (
              <button
                key={a.id}
                onClick={() => onChange({ ...config, accessory: a.id })}
                className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all ${config.accessory === a.id ? 'bg-indigo-50 border-indigo-400' : 'bg-white border-transparent'}`}
              >
                <span className="text-xl">{a.icon}</span>
                <span className="text-[10px] font-black uppercase text-gray-600">{a.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AvatarCustomizer;
