
import React, { useState, useCallback } from 'react';
import { GoogleGenAI } from '@google/genai';
import { Header } from './components/Header';
import { WelcomeScreen } from './components/WelcomeScreen';
import { ChatInterface } from './components/ChatInterface';
import { Message } from './types';
import { ASTRA_SYSTEM_INSTRUCTION } from './constants';
import { getAstraResponseStream, generateImage } from './services/geminiService';

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [hasStarted, setHasStarted] = useState<boolean>(false);
  
  const ai = process.env.API_KEY ? new GoogleGenAI({ apiKey: process.env.API_KEY }) : null;

  const handleSend = useCallback(async (prompt: string, image?: { mimeType: string; data: string }) => {
    if (!ai) {
      setError("API Key not configured. Please set the API_KEY environment variable.");
      return;
    }

    setHasStarted(true);
    setIsLoading(true);
    setError(null);
    const userMessage: Message = { id: Date.now(), role: 'user', parts: [{ text: prompt }] };
    if (image) {
      userMessage.parts.push({ image: `data:${image.mimeType};base64,${image.data}` });
    }
    setMessages(prev => [...prev, userMessage]);

    try {
      const stream = await getAstraResponseStream(ai, prompt, image);
      
      let modelResponseText = "";
      const modelMessageId = Date.now() + 1;
      
      setMessages(prev => [...prev, { id: modelMessageId, role: 'model', parts: [{ text: '' }] }]);

      for await (const chunk of stream) {
        modelResponseText += chunk.text;
        setMessages(prev => prev.map(msg => 
          msg.id === modelMessageId ? { ...msg, parts: [{ text: modelResponseText + " ..." }] } : msg
        ));
      }

       setMessages(prev => prev.map(msg => 
          msg.id === modelMessageId ? { ...msg, parts: [{ text: modelResponseText }] } : msg
        ));
      
      // Image generation check
      if (modelResponseText.includes('[IMAGE PROMPT]')) {
        const imagePromptMatch = modelResponseText.match(/\[IMAGE PROMPT\]\s*([\s\S]*?)(?:\n\nCaption:|\n\n✨ Built by Pragyan|$)/);
        if (imagePromptMatch && imagePromptMatch[1]) {
          const imagePrompt = imagePromptMatch[1].trim();
          setIsLoading(true); // Keep loading for image generation
          const imageMessageId = Date.now() + 2;
          setMessages(prev => [...prev, { id: imageMessageId, role: 'model', parts: [{ text: "Generating image..." }] }]);
          
          try {
            const imageData = await generateImage(ai, imagePrompt);
            setMessages(prev => prev.map(msg => 
              msg.id === imageMessageId ? { ...msg, parts: [{ image: imageData }] } : msg
            ));
          } catch (imgError) {
             console.error("Image generation error:", imgError);
             const errorMessage = imgError instanceof Error ? imgError.message : "An unknown error occurred during image generation.";
             setMessages(prev => prev.map(msg => 
              msg.id === imageMessageId ? { ...msg, parts: [{ text: `Image generation failed: ${errorMessage}` }] } : msg
            ));
          }
        }
      }
    } catch (err) {
      console.error(err);
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred.";
      setError(`Error: ${errorMessage}`);
      setMessages(prev => [...prev, { id: Date.now() + 1, role: 'model', parts: [{ text: `Sorry, something went wrong: ${errorMessage}` }] }]);
    } finally {
      setIsLoading(false);
    }
  }, [ai]);

  if (!ai) {
     return (
        <div className="flex items-center justify-center h-screen bg-gray-900 text-red-500">
            <div className="p-8 bg-gray-800 rounded-lg shadow-xl text-center">
                <h1 className="text-2xl font-bold mb-4">Configuration Error</h1>
                <p>API Key not found. Please set the <code className="bg-gray-700 p-1 rounded">API_KEY</code> environment variable.</p>
            </div>
        </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-gray-100 font-sans">
      <Header />
      <main className="flex-1 overflow-hidden">
        {hasStarted ? (
          <ChatInterface 
            messages={messages} 
            isLoading={isLoading} 
            error={error} 
            onSend={handleSend}
          />
        ) : (
          <WelcomeScreen onPromptClick={handleSend} />
        )}
      </main>
    </div>
  );
};

export default App;
