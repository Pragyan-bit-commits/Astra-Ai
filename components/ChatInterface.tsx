
import React, { useRef, useEffect } from 'react';
import { Message } from '../types';
import { ChatMessage } from './ChatMessage';
import { InputBar } from './InputBar';

interface ChatInterfaceProps {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
  onSend: (prompt: string, image?: { mimeType: string; data: string }) => void;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ messages, isLoading, error, onSend }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
        {messages.map((msg) => (
          <ChatMessage key={msg.id} message={msg} />
        ))}
        {isLoading && messages[messages.length-1].role === 'user' && (
          <div className="flex justify-start">
            <div className="bg-gray-800 rounded-lg p-3 max-w-2xl animate-pulse">
                <div className="h-4 bg-gray-700 rounded w-24"></div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      {error && <div className="p-4 text-red-400 bg-red-900/30 text-center">{error}</div>}
      <div className="p-4 bg-gray-900 border-t border-gray-700/50">
        <InputBar onSend={onSend} disabled={isLoading} />
      </div>
    </div>
  );
};
