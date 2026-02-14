
import React from 'react';
import { Mood, MoodEntry } from '../types';
import { MOODS } from '../constants';

interface MoodInsightsProps {
  history: MoodEntry[];
}

const MoodInsights: React.FC<MoodInsightsProps> = ({ history }) => {
  // --- Daily Logic ---
  const today = new Date().toDateString();
  const todayEntries = history.filter(e => new Date(e.timestamp).toDateString() === today);
  
  const moodCountsToday = todayEntries.reduce((acc, curr) => {
    acc[curr.mood] = (acc[curr.mood] || 0) + 1;
    return acc;
  }, {} as Record<Mood, number>);

  // FIX: Cast values to number explicitly to satisfy arithmetic operation checks on line 20
  const dominantMoodToday = Object.entries(moodCountsToday).sort((a, b) => (b[1] as number) - (a[1] as number))[0]?.[0] as Mood | undefined;

  // --- Weekly Logic ---
  const getDayName = (date: Date) => date.toLocaleDateString('en-US', { weekday: 'short' });
  
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - i);
    return d;
  }).reverse();

  const weeklyStats = last7Days.map(date => {
    const dateStr = date.toDateString();
    const dayEntries = history.filter(e => new Date(e.timestamp).toDateString() === dateStr);
    const counts = dayEntries.reduce((acc, curr) => {
      acc[curr.mood] = (acc[curr.mood] || 0) + 1;
      return acc;
    }, {} as Record<Mood, number>);
    
    // FIX: Cast values to number explicitly to satisfy arithmetic operation checks on line 38
    const topMood = Object.entries(counts).sort((a, b) => (b[1] as number) - (a[1] as number))[0]?.[0] as Mood | undefined;
    
    return {
      day: getDayName(date),
      mood: topMood,
      isToday: dateStr === today
    };
  });

  return (
    <div className="flex flex-col gap-4">
      {/* Daily Section */}
      <div className="bg-white/60 backdrop-blur-md rounded-2xl p-4 border border-white/80 shadow-sm">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-xs font-black uppercase tracking-widest text-indigo-500">Today's Vibe</h3>
          <span className="text-[10px] font-bold text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
            {todayEntries.length} {todayEntries.length === 1 ? 'Check' : 'Checks'}
          </span>
        </div>
        
        {todayEntries.length > 0 ? (
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm ${dominantMoodToday ? MOODS[dominantMoodToday].bgColor : 'bg-gray-100'}`}>
               <div className={`w-6 h-6 rounded-full ${dominantMoodToday ? MOODS[dominantMoodToday].color.replace('text', 'bg') : 'bg-gray-300'}`} />
            </div>
            <div>
              <p className="text-sm font-black text-gray-700 uppercase tracking-tight">
                {dominantMoodToday ? dominantMoodToday : "Keep tracking!"}
              </p>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Dominant Feeling</p>
            </div>
          </div>
        ) : (
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest italic">No data yet</p>
        )}
      </div>

      {/* Weekly Section */}
      <div className="bg-white/60 backdrop-blur-md rounded-2xl p-4 border border-white/80 shadow-sm">
        <h3 className="text-xs font-black uppercase tracking-widest text-purple-500 mb-3">Weekly Tracker</h3>
        <div className="flex justify-between items-end gap-1.5">
          {weeklyStats.map((stat, idx) => (
            <div key={idx} className="flex flex-col items-center gap-1.5 flex-1">
              <div className={`
                w-full aspect-square rounded-lg transition-all flex items-center justify-center
                ${stat.mood ? MOODS[stat.mood].bgColor : 'bg-gray-50 border border-dashed border-gray-200'}
                ${stat.isToday ? 'ring-2 ring-purple-400 ring-offset-1' : ''}
              `}>
                {stat.mood && (
                  <div className={`w-2 h-2 rounded-full ${MOODS[stat.mood].color.replace('text', 'bg')}`} />
                )}
              </div>
              <span className={`text-[8px] font-black uppercase ${stat.isToday ? 'text-purple-600' : 'text-gray-400'}`}>
                {stat.day}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MoodInsights;
