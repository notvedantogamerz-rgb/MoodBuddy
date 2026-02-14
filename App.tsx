
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Mood, Message, MoodEntry, GratitudeEntry, FeedbackEntry, FeedbackRating, AvatarConfig, UserProgress } from './types';
import { MOODS, MOOD_CATEGORIES, AFFIRMATIONS } from './constants';
import { sendMessageToGemini } from './services/geminiService';
import MoodButton from './components/MoodButton';
import ChatMessage from './components/ChatMessage';
import MoodInsights from './components/MoodInsights';
import BreathingTool from './components/BreathingTool';
import GratitudeJournal from './components/GratitudeJournal';
import VoiceChat from './components/VoiceChat';
import FeedbackTool from './components/FeedbackTool';
import MascotLogo from './components/MascotLogo';
import AvatarCustomizer from './components/AvatarCustomizer';
import FunTools from './components/FunTools';

const App: React.FC = () => {
  const [selectedMood, setSelectedMood] = useState<Mood | null>(null);
  const [moodHistory, setMoodHistory] = useState<MoodEntry[]>([]);
  const [gratitudeEntries, setGratitudeEntries] = useState<GratitudeEntry[]>([]);
  const [feedbackEntries, setFeedbackEntries] = useState<FeedbackEntry[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeTool, setActiveTool] = useState<'insights' | 'breathing' | 'gratitude' | 'buddy' | 'fun' | 'feedback'>('insights');
  const [isVoiceChatOpen, setIsVoiceChatOpen] = useState(false);
  const [isViewOnly, setIsViewOnly] = useState(false);
  const [isMoodSelectorOpen, setIsMoodSelectorOpen] = useState(false);
  
  const [avatarConfig, setAvatarConfig] = useState<AvatarConfig>({ bodyColor: '#FFD95B', accessory: 'none' });

  const [progress, setProgress] = useState<UserProgress>({
    stars: 0,
    streak: 0,
    lastVisit: new Date().toDateString(),
    completedToday: { mood: false, breathing: false, gratitude: false }
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const dailyAffirmation = useMemo(() => {
    const day = Math.floor(Date.now() / 86400000);
    return AFFIRMATIONS[day % AFFIRMATIONS.length];
  }, []);

  useEffect(() => {
    try {
      const savedMood = localStorage.getItem('moodHistory');
      if (savedMood) setMoodHistory(JSON.parse(savedMood).map((m: any) => ({ ...m, timestamp: new Date(m.timestamp) })));
      
      const savedGratitude = localStorage.getItem('gratitudeHistory');
      if (savedGratitude) setGratitudeEntries(JSON.parse(savedGratitude).map((g: any) => ({ ...g, timestamp: new Date(g.timestamp) })));

      const savedAvatar = localStorage.getItem('avatarConfig');
      if (savedAvatar) setAvatarConfig(JSON.parse(savedAvatar));

      const savedProgress = localStorage.getItem('userProgress');
      if (savedProgress) {
        const parsed = JSON.parse(savedProgress);
        const today = new Date().toDateString();
        let currentStreak = parsed.streak;
        if (parsed.lastVisit !== today) {
          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);
          if (parsed.lastVisit !== yesterday.toDateString()) currentStreak = 0;
        }
        setProgress({
          ...parsed,
          streak: currentStreak,
          lastVisit: today,
          completedToday: parsed.lastVisit === today ? parsed.completedToday : { mood: false, breathing: false, gratitude: false }
        });
      }

      const savedFeedback = localStorage.getItem('feedbackHistory');
      if (savedFeedback) setFeedbackEntries(JSON.parse(savedFeedback).map((f: any) => ({ ...f, timestamp: new Date(f.timestamp) })));

      const savedChat = localStorage.getItem('chatHistory');
      if (savedChat) {
        setMessages(JSON.parse(savedChat).map((msg: any) => ({ ...msg, timestamp: new Date(msg.timestamp) })));
      } else {
        setMessages([{
          id: 'welcome',
          role: 'model',
          text: "Hi there! I'm Buddy, your friendly mood companion. I can help you track your feelings and suggest fun things to do. How are you feeling today?",
          timestamp: new Date()
        }]);
      }
    } catch (e) {
      console.error("Error loading saved data", e);
    }
  }, []);

  useEffect(() => {
    if (!isViewOnly) {
      localStorage.setItem('moodHistory', JSON.stringify(moodHistory));
      localStorage.setItem('gratitudeHistory', JSON.stringify(gratitudeEntries));
      localStorage.setItem('feedbackHistory', JSON.stringify(feedbackEntries));
      localStorage.setItem('chatHistory', JSON.stringify(messages));
      localStorage.setItem('avatarConfig', JSON.stringify(avatarConfig));
      localStorage.setItem('userProgress', JSON.stringify(progress));
    }
  }, [moodHistory, gratitudeEntries, feedbackEntries, messages, avatarConfig, progress, isViewOnly]);

  const awardStar = (task: keyof UserProgress['completedToday']) => {
    if (progress.completedToday[task] || isViewOnly) return;
    setProgress(prev => {
      const firstTaskToday = !Object.values(prev.completedToday).some(v => v);
      return {
        ...prev,
        stars: prev.stars + 1,
        streak: firstTaskToday ? prev.streak + 1 : prev.streak,
        completedToday: { ...prev.completedToday, [task]: true }
      };
    });
  };

  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  useEffect(() => scrollToBottom(), [messages]);

  const handleSendMessage = async (text: string) => {
    if (isViewOnly || !text.trim() || isLoading) return;
    const userMessage: Message = { id: Date.now().toString(), role: 'user', text, timestamp: new Date() };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    // Send history to API
    const history = messages.map(msg => ({ role: msg.role, parts: [{ text: msg.text }] }));
    const response = await sendMessageToGemini(text, history);
    
    setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), role: 'model', text: response, timestamp: new Date() }]);
    setIsLoading(false);
  };

  const handleMoodSelect = (mood: Mood) => {
    if (isViewOnly) return;
    setSelectedMood(mood);
    setMoodHistory(prev => [{ id: Date.now().toString(), mood, timestamp: new Date() }, ...prev].slice(0, 100));
    handleSendMessage(`I'm feeling ${mood} right now. What can I do?`);
    setIsMoodSelectorOpen(false);
    awardStar('mood');
  };

  const handleAddGratitude = (items: string[]) => {
    if (isViewOnly) return;
    setGratitudeEntries(prev => [{ id: Date.now().toString(), items, timestamp: new Date() }, ...prev]);
    awardStar('gratitude');
  };

  const handleAddFeedback = (rating: FeedbackRating) => {
    if (isViewOnly) return;
    setFeedbackEntries(prev => [{ id: Date.now().toString(), rating, timestamp: new Date() }, ...prev]);
  };

  return (
    <div className="flex flex-col h-[100dvh] max-w-6xl mx-auto px-4 py-2 sm:py-4 md:py-8 overflow-hidden bg-transparent">
      {isVoiceChatOpen && !isViewOnly && <VoiceChat onClose={() => setIsVoiceChatOpen(false)} />}
      
      <header className="flex flex-row items-center justify-between mb-4 sm:mb-6 gap-2 sm:gap-4 flex-shrink-0">
        <div className="flex items-center gap-2 sm:gap-4">
          <MascotLogo config={avatarConfig} className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20" />
          <div className="text-left">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black bg-clip-text text-transparent bg-gradient-to-r from-yellow-500 via-pink-500 to-purple-600 tracking-tight leading-none">
              MoodBuddy
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-[10px] text-yellow-600 bg-yellow-100 px-2 py-0.5 rounded-full font-black flex items-center gap-1">
                ⭐ {progress.stars} Stars
              </span>
              <span className="text-[10px] text-pink-600 bg-pink-100 px-2 py-0.5 rounded-full font-black flex items-center gap-1">
                🔥 {progress.streak} Day Streak
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={() => setIsViewOnly(!isViewOnly)}
            className={`px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all border ${isViewOnly ? 'bg-red-50 border-red-200 text-red-500 shadow-inner' : 'bg-white border-gray-200 text-gray-400 hover:text-indigo-500'}`}
          >
            {isViewOnly ? 'View Only On' : 'View Mode'}
          </button>
          
          <button 
            onClick={() => !isViewOnly && setIsVoiceChatOpen(true)}
            disabled={isViewOnly}
            className={`bg-indigo-600 text-white px-4 py-2 rounded-2xl flex items-center gap-2 transition-all shadow-lg text-xs font-black uppercase tracking-widest ${isViewOnly ? 'opacity-30 grayscale cursor-not-allowed' : 'hover:bg-indigo-700'}`}
          >
            <span className="hidden sm:inline">Voice Talk</span>
            <span className="sm:hidden">Voice</span>
          </button>
        </div>
      </header>

      <div className="flex flex-col md:flex-row flex-1 gap-4 sm:gap-6 overflow-hidden min-h-0">
        <div className={`w-full md:w-[300px] lg:w-[320px] flex flex-col gap-4 flex-shrink-0 md:flex-shrink overflow-y-auto no-scrollbar pb-4 transition-opacity ${isViewOnly ? 'opacity-70 pointer-events-none' : ''}`}>
          <section className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl p-5 text-white shadow-xl relative overflow-hidden flex-shrink-0">
             <div className="absolute -right-4 -top-4 opacity-10 w-24 h-24 bg-white rounded-full" />
             <p className="text-[10px] font-black uppercase tracking-widest opacity-80 mb-1">Daily Word</p>
             <h3 className="text-sm sm:text-base font-bold leading-tight italic">"{dailyAffirmation}"</h3>
          </section>

          <div className="flex bg-white/40 p-1 rounded-2xl border border-white/60 overflow-x-auto no-scrollbar">
            {(['insights', 'breathing', 'gratitude', 'fun', 'buddy', 'feedback'] as const).map(tool => (
              <button 
                key={tool}
                onClick={() => setActiveTool(tool)}
                className={`flex-1 min-w-[50px] py-2 text-[8px] font-black uppercase tracking-widest rounded-xl transition-all ${activeTool === tool ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
              >
                {tool === 'insights' ? 'Data' : tool === 'breathing' ? 'Zen' : tool === 'gratitude' ? 'Grat' : tool === 'fun' ? 'Fun' : tool === 'buddy' ? 'Me' : 'App'}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto no-scrollbar">
            {activeTool === 'insights' && <MoodInsights history={moodHistory} />}
            {activeTool === 'breathing' && (
              <div onClick={() => awardStar('breathing')}>
                <BreathingTool />
              </div>
            )}
            {activeTool === 'gratitude' && <GratitudeJournal entries={gratitudeEntries} onAdd={handleAddGratitude} />}
            {activeTool === 'buddy' && <AvatarCustomizer config={avatarConfig} onChange={setAvatarConfig} progress={progress} />}
            {activeTool === 'fun' && <FunTools onAction={handleSendMessage} disabled={isLoading || isViewOnly} />}
            {activeTool === 'feedback' && <FeedbackTool entries={feedbackEntries} onAdd={handleAddFeedback} disabled={isViewOnly} />}
          </div>
        </div>

        <main className="flex-1 bg-white rounded-[1.5rem] sm:rounded-[2.5rem] shadow-2xl shadow-indigo-100/50 overflow-hidden flex flex-col border border-indigo-50/50 relative min-h-0">
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 space-y-4 z-10 scrollbar-hide relative">
            {isViewOnly && (
              <div className="absolute top-4 left-1/2 -translate-x-1/2 z-40 bg-white/80 backdrop-blur border border-red-100 text-red-500 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm flex items-center gap-2">
                <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                Read Only Mode
              </div>
            )}
            
            {messages.map((msg) => (
              <ChatMessage key={msg.id} message={msg} />
            ))}
            {isLoading && (
              <div className="flex justify-start mb-4 animate-pulse">
                <div className="bg-gray-100/60 rounded-2xl px-4 py-2 border border-white flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full" />
                  <span className="text-[9px] font-black text-indigo-400 uppercase tracking-widest">Buddy is thinking</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className={`bg-gray-50/80 backdrop-blur-xl border-t border-indigo-50/50 z-20 flex-shrink-0 transition-all ${isViewOnly ? 'opacity-50 pointer-events-none grayscale' : ''}`}>
            <button 
              onClick={() => !isViewOnly && setIsMoodSelectorOpen(!isMoodSelectorOpen)}
              className="w-full px-4 py-3 sm:px-6 flex items-center justify-between hover:bg-indigo-50/30 transition-colors group"
            >
               <h2 className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] group-hover:text-indigo-400 transition-colors">
                 Feeling Check-In
               </h2>
               <div className={`transform transition-transform duration-300 ${isMoodSelectorOpen ? 'rotate-180' : ''}`}>
                 <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-gray-300 group-hover:text-indigo-400">
                   <path d="M18 15l-6-6-6 6" />
                 </svg>
               </div>
            </button>

            <div className={`px-4 sm:px-6 transition-all duration-300 overflow-hidden ${isMoodSelectorOpen ? 'max-h-[500px] pb-4 opacity-100' : 'max-h-0 opacity-0'}`}>
               <div className="flex flex-col gap-3">
                 {(Object.keys(MOOD_CATEGORIES) as Array<keyof typeof MOOD_CATEGORIES>).map((category) => (
                   <div key={category} className="space-y-1">
                     <h2 className={`text-[8px] font-black uppercase tracking-[0.2em] ${category === 'Positive' ? 'text-green-600' : category === 'Neutral' ? 'text-orange-600' : 'text-red-600'}`}>
                       {category} Feels
                     </h2>
                     <div className="flex gap-2 overflow-x-auto no-scrollbar py-1">
                       {MOOD_CATEGORIES[category].map((mood) => (
                         <div key={mood} className="flex-shrink-0 min-w-[70px] sm:min-w-[85px] h-[44px]">
                           <MoodButton mood={mood} isActive={selectedMood === mood} onClick={handleMoodSelect} variant="compact" />
                         </div>
                       ))}
                     </div>
                   </div>
                 ))}
               </div>
            </div>

            <div className="p-3 sm:p-4 md:p-6 border-t border-indigo-50/30">
              <form onSubmit={(e) => { e.preventDefault(); handleSendMessage(inputValue); }} className="flex gap-2 sm:gap-4 max-w-4xl mx-auto">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder={isViewOnly ? "Inputs disabled in View Mode" : "Tell Buddy anything..."}
                  className="flex-1 px-5 py-3 sm:py-4 rounded-full bg-white border-2 border-transparent focus:border-indigo-400 focus:outline-none transition-all shadow-lg text-gray-700 font-bold text-sm"
                  disabled={isLoading || isViewOnly}
                />
                <button
                  type="submit"
                  disabled={isLoading || !inputValue.trim() || isViewOnly}
                  className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-indigo-600 text-white font-black hover:bg-indigo-700 transition-all shadow-xl flex items-center justify-center flex-shrink-0 disabled:bg-gray-300"
                >
                  GO
                </button>
              </form>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
