
import React from 'react';
import { Message, MessagePart } from '../types';

// Simple markdown-to-html for code blocks
const renderText = (text: string) => {
    const parts = text.split(/(\`\`\`[\s\S]*?\`\`\`)/g);
    return parts.map((part, index) => {
        if (part.startsWith('```')) {
            const code = part.replace(/```/g, '').trim();
            const language = code.split('\n')[0];
            const codeContent = code.substring(code.indexOf('\n') + 1);
            return (
                <pre key={index} className="bg-gray-900/80 rounded-md p-4 my-2 overflow-x-auto text-sm text-white">
                  <div className="text-xs text-gray-400 mb-2">{language}</div>
                  <code>{codeContent}</code>
                </pre>
            );
        }
        return <span key={index}>{part.split('\n').map((line, i) => <p key={i}>{line}</p>)}</span>;
    });
};

const AstraSignature: React.FC = () => (
    <p className="text-xs text-gray-500 mt-4 pt-2 border-t border-gray-700/50">✨ Built by Pragyan</p>
);

export const ChatMessage: React.FC<{ message: Message }> = ({ message }) => {
  const isUser = message.role === 'user';
  const isLastPartSignature = (part: MessagePart, index: number, arr: MessagePart[]) =>
    index === arr.length - 1 && part.text?.includes("✨ Built by Pragyan");

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`rounded-lg px-4 py-3 max-w-2xl shadow-md ${
          isUser ? 'bg-indigo-600 text-white' : 'bg-gray-800 text-gray-200'
        }`}
      >
        {message.parts.map((part, index) => (
          <div key={index}>
            {part.text && (
              <div className="prose prose-invert prose-sm max-w-none break-words">
                {renderText(part.text)}
              </div>
            )}
            {part.image && (
              <img src={part.image} alt="User upload" className="mt-2 rounded-lg max-w-full h-auto" />
            )}
          </div>
        ))}
         {!isUser && message.parts.some(p => p.text) && !message.parts.some((p, i, a) => isLastPartSignature(p, i, a)) && (
            <AstraSignature />
        )}
      </div>
    </div>
  );
};
