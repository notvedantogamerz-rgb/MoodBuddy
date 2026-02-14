
import React from 'react';
import { Message } from '../types';

interface ChatMessageProps {
  message: Message;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isBot = message.role === 'model';
  
  return (
    <div className={`flex w-full mb-4 ${isBot ? 'justify-start' : 'justify-end'}`}>
      <div className={`
        max-w-[85%] md:max-w-[70%] rounded-2xl px-4 py-3 shadow-sm
        ${isBot 
          ? 'bg-white text-gray-800 rounded-bl-none border border-gray-100' 
          : 'bg-indigo-600 text-white rounded-br-none'
        }
      `}>
        <p className="text-sm md:text-base leading-relaxed whitespace-pre-wrap">
          {message.text}
        </p>
        <div className={`text-[10px] mt-1 opacity-60 ${isBot ? 'text-gray-500' : 'text-indigo-100 text-right'}`}>
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
