
import React from 'react';

interface WelcomeScreenProps {
  onPromptClick: (prompt: string) => void;
}

const examplePrompts = [
  { title: "Write a Poem", prompt: "Write a short poem about the stars." },
  { title: "Generate an Image", prompt: "Create an image of a majestic lion in a futuristic jungle." },
  { title: "Explain a Concept", prompt: "Explain the concept of quantum computing in simple terms." },
  { title: "Write Code", prompt: "Write a python function to calculate the factorial of a number." },
];

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onPromptClick }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full p-4 text-center">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-extrabold text-gray-100 mb-4">
          Welcome to Astra
        </h2>
        <p className="text-lg text-gray-400 mb-12">
          Your all-in-one AI for text, images, code, and reasoning. How can I assist you today?
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {examplePrompts.map((item, index) => (
            <button
              key={index}
              onClick={() => onPromptClick(item.prompt)}
              className="p-6 bg-gray-800/50 rounded-lg text-left hover:bg-gray-700/70 transition-colors duration-200 ease-in-out transform hover:-translate-y-1"
            >
              <h3 className="font-semibold text-white text-md mb-1">{item.title}</h3>
              <p className="text-gray-400 text-sm">&ldquo;{item.prompt}&rdquo;</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
