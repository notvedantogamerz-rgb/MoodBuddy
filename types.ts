
export type Mood = 
  | 'Happy' 
  | 'Sad' 
  | 'Angry' 
  | 'Anxious' 
  | 'Bored' 
  | 'Excited' 
  | 'Calm' 
  | 'Lonely' 
  | 'Confused' 
  | 'Tired' 
  | 'Scared' 
  | 'Silly' 
  | 'Grateful' 
  | 'Proud' 
  | 'Shy';

export type FeedbackRating = 'good' | 'neutral' | 'bad';

export interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export interface MoodEntry {
  id: string;
  mood: Mood;
  timestamp: Date;
}

export interface GratitudeEntry {
  id: string;
  items: string[];
  timestamp: Date;
}

export interface FeedbackEntry {
  id: string;
  rating: FeedbackRating;
  timestamp: Date;
  isCommunity?: boolean;
}

export interface Activity {
  title: string;
  description: string;
  type: 'creative' | 'physical' | 'mental';
}

export interface MoodConfig {
  color: string;
  bgColor: string;
  gradient: string;
}

export interface AvatarConfig {
  bodyColor: string;
  accessory: 'none' | 'glasses' | 'hat' | 'bow';
}

export interface UserProgress {
  stars: number;
  streak: number;
  lastVisit: string;
  completedToday: {
    mood: boolean;
    breathing: boolean;
    gratitude: boolean;
  };
}
