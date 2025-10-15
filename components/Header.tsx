
import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="p-4 bg-gray-900/80 backdrop-blur-sm border-b border-gray-700/50 shadow-lg text-center">
      <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
        Astra
      </h1>
      <p className="text-sm text-gray-400">Your Multi-Purpose AI Assistant</p>
    </header>
  );
};
