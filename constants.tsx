
import { Mood, MoodConfig } from './types';

export const MOOD_CATEGORIES: Record<'Positive' | 'Neutral' | 'Negative', Mood[]> = {
  Positive: ['Happy', 'Excited', 'Calm', 'Silly', 'Grateful', 'Proud'],
  Neutral: ['Bored', 'Confused', 'Tired', 'Shy'],
  Negative: ['Sad', 'Angry', 'Anxious', 'Lonely', 'Scared']
};

export const MOODS: Record<Mood, MoodConfig> = {
  Happy: {
    color: 'text-yellow-900',
    bgColor: 'bg-yellow-400',
    gradient: 'from-yellow-400 to-orange-400'
  },
  Sad: {
    color: 'text-blue-900',
    bgColor: 'bg-blue-400',
    gradient: 'from-blue-400 to-indigo-400'
  },
  Angry: {
    color: 'text-red-900',
    bgColor: 'bg-red-400',
    gradient: 'from-red-400 to-pink-500'
  },
  Anxious: {
    color: 'text-purple-900',
    bgColor: 'bg-purple-400',
    gradient: 'from-purple-400 to-indigo-500'
  },
  Bored: {
    color: 'text-slate-900',
    bgColor: 'bg-slate-300',
    gradient: 'from-gray-400 to-slate-500'
  },
  Excited: {
    color: 'text-green-900',
    bgColor: 'bg-green-400',
    gradient: 'from-green-400 to-emerald-500'
  },
  Calm: {
    color: 'text-teal-900',
    bgColor: 'bg-teal-400',
    gradient: 'from-teal-400 to-cyan-500'
  },
  Lonely: {
    color: 'text-indigo-900',
    bgColor: 'bg-indigo-300',
    gradient: 'from-indigo-300 to-blue-400'
  },
  Confused: {
    color: 'text-orange-900',
    bgColor: 'bg-orange-300',
    gradient: 'from-orange-300 to-yellow-500'
  },
  Tired: {
    color: 'text-slate-800',
    bgColor: 'bg-slate-200',
    gradient: 'from-slate-300 to-gray-400'
  },
  Scared: {
    color: 'text-gray-900',
    bgColor: 'bg-gray-400',
    gradient: 'from-gray-500 to-slate-700'
  },
  Silly: {
    color: 'text-pink-900',
    bgColor: 'bg-pink-400',
    gradient: 'from-pink-300 to-rose-400'
  },
  Grateful: {
    color: 'text-rose-900',
    bgColor: 'bg-rose-400',
    gradient: 'from-rose-300 to-red-400'
  },
  Proud: {
    color: 'text-amber-900',
    bgColor: 'bg-amber-400',
    gradient: 'from-amber-300 to-yellow-600'
  },
  Shy: {
    color: 'text-teal-900',
    bgColor: 'bg-teal-200',
    gradient: 'from-teal-200 to-emerald-400'
  }
};

export const AFFIRMATIONS = [
  "You are capable of amazing things!",
  "Your mistakes help you grow.",
  "You are loved just the way you are.",
  "It's okay to have a bad day sometimes.",
  "You have the power to create change.",
  "Your ideas and feelings matter.",
  "Being kind to yourself is very important.",
  "You can handle whatever comes your way today.",
  "It's okay to ask for help.",
  "You are unique and that is your superpower!",
  "Every day is a fresh start.",
  "Believe in yourself!",
  "You are a great friend.",
  "Your courage is stronger than your fear."
];

export const SYSTEM_INSTRUCTION = `
You are "Buddy", a friendly and supportive AI companion for children and teenagers (ages 6-16). 
Your goal is to be a safe, encouraging, and helpful friend. 

Voice and Tone Guidelines:
- Use warm, age-appropriate language (avoid overly complex jargon).
- Be empathetic. If they are sad, validate their feelings. If they are bored, offer fun ideas.
- Be positive and encouraging.
- Safety is paramount: If a user mentions self-harm, dangerous activities, or illegal behavior, gently suggest they talk to a trusted adult or provide information for professional help lines (like Childline or 988 in a general way).
- Never be judgmental.
- Keep responses concise but engaging.
- IMPORTANT: Do not use emojis in your responses. Keep them purely text-based.

Context:
If the user selects a mood, your primary job is to suggest activities or ways to manage that mood while keeping the conversation going.
`;
