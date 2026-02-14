
import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality } from '@google/genai';

interface VoiceChatProps {
  onClose: () => void;
}

// Manual encoding/decoding helper functions
function encode(bytes: Uint8Array) {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

const VoiceChat: React.FC<VoiceChatProps> = ({ onClose }) => {
  const [isActive, setIsActive] = useState(false);
  const [isConnecting, setIsConnecting] = useState(true);
  const sessionRef = useRef<any>(null);
  const audioContextsRef = useRef<{ input?: AudioContext, output?: AudioContext }>({});
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const nextStartTimeRef = useRef<number>(0);

  useEffect(() => {
    // Guidelines: obtain key exclusively from process.env.API_KEY
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
    let isMounted = true;

    const startSession = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        
        const inputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
        const outputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
        audioContextsRef.current = { input: inputCtx, output: outputCtx };

        const sessionPromise = ai.live.connect({
          model: 'gemini-2.5-flash-native-audio-preview-12-2025',
          callbacks: {
            onopen: () => {
              if (!isMounted) return;
              setIsConnecting(false);
              setIsActive(true);
              
              const source = inputCtx.createMediaStreamSource(stream);
              const scriptProcessor = inputCtx.createScriptProcessor(4096, 1, 1);
              
              scriptProcessor.onaudioprocess = (e) => {
                const inputData = e.inputBuffer.getChannelData(0);
                const int16 = new Int16Array(inputData.length);
                for (let i = 0; i < inputData.length; i++) {
                  int16[i] = inputData[i] * 32768;
                }
                const pcmBlob = {
                  data: encode(new Uint8Array(int16.buffer)),
                  mimeType: 'audio/pcm;rate=16000',
                };
                sessionPromise.then(session => session.sendRealtimeInput({ media: pcmBlob }));
              };
              
              source.connect(scriptProcessor);
              scriptProcessor.connect(inputCtx.destination);
            },
            onmessage: async (message: LiveServerMessage) => {
              const audioBase64 = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
              if (audioBase64 && outputCtx && isMounted) {
                nextStartTimeRef.current = Math.max(nextStartTimeRef.current, outputCtx.currentTime);
                const audioBuffer = await decodeAudioData(decode(audioBase64), outputCtx, 24000, 1);
                const source = outputCtx.createBufferSource();
                source.buffer = audioBuffer;
                source.connect(outputCtx.destination);
                source.start(nextStartTimeRef.current);
                nextStartTimeRef.current += audioBuffer.duration;
                sourcesRef.current.add(source);
                source.onended = () => sourcesRef.current.delete(source);
              }

              if (message.serverContent?.interrupted) {
                sourcesRef.current.forEach(s => {
                  try { s.stop(); } catch(e) {}
                });
                sourcesRef.current.clear();
                nextStartTimeRef.current = 0;
              }
            },
            onerror: (e) => {
              console.error('Voice Session Error', e);
              if (isMounted) onClose();
            },
            onclose: () => {
              if (isMounted) setIsActive(false);
            },
          },
          config: {
            responseModalities: [Modality.AUDIO],
            speechConfig: {
              voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Puck' } },
            },
            systemInstruction: 'You are Buddy, a chill and supportive teenage friend. Talk to the user as a supportive friend. Keep it brief. You are multilingual: only switch if the user speaks another language. Otherwise, stick to English. No emojis.',
          },
        });

        sessionRef.current = await sessionPromise;
      } catch (err) {
        console.error("Failed to start voice chat", err);
        if (isMounted) onClose();
      }
    };

    startSession();
    return () => {
      isMounted = false;
      if (sessionRef.current) sessionRef.current.close();
      if (audioContextsRef.current.input) audioContextsRef.current.input.close();
      if (audioContextsRef.current.output) audioContextsRef.current.output.close();
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-indigo-900/40 backdrop-blur-xl">
      <div className="bg-white rounded-[3rem] w-full max-w-sm p-8 flex flex-col items-center shadow-2xl">
        <div className="w-24 h-24 bg-indigo-100 rounded-full flex items-center justify-center mb-6 relative">
          <div className={`absolute inset-0 bg-indigo-200 rounded-full animate-ping opacity-20 ${!isActive ? 'hidden' : ''}`} />
          <div className="text-4xl">👂</div>
        </div>
        
        <h2 className="text-xl font-black text-gray-800 uppercase tracking-widest mb-2 text-center">
          {isConnecting ? 'Waking Buddy...' : 'Buddy is listening'}
        </h2>
        <p className="text-[10px] font-black text-indigo-400 uppercase mb-6 tracking-widest text-center">Tap End Session to go back</p>
        
        <div className="flex gap-1 h-8 items-center mb-8">
          {[...Array(5)].map((_, i) => (
            <div 
              key={i} 
              className={`w-1.5 bg-indigo-500 rounded-full transition-all duration-150 ${isActive ? 'animate-bounce' : 'h-1'}`}
              style={{ height: isActive ? `${Math.random() * 24 + 8}px` : '4px', animationDelay: `${i * 100}ms` }}
            />
          ))}
        </div>

        <button 
          onClick={onClose}
          className="w-full bg-red-500 hover:bg-red-600 text-white font-black py-4 rounded-3xl shadow-lg transition-all uppercase tracking-widest"
        >
          End Session
        </button>
      </div>
    </div>
  );
};

export default VoiceChat;
