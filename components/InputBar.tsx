
import React, { useState, useRef } from 'react';

interface InputBarProps {
  onSend: (prompt: string, image?: { mimeType: string; data: string }) => void;
  disabled: boolean;
}

const fileToGenerativePart = async (file: File): Promise<{ mimeType: string; data: string }> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const base64Data = (event.target?.result as string).split(',')[1];
      resolve({
        mimeType: file.type,
        data: base64Data,
      });
    };
    reader.readAsDataURL(file);
  });
};

export const InputBar: React.FC<InputBarProps> = ({ onSend, disabled }) => {
  const [prompt, setPrompt] = useState('');
  const [image, setImage] = useState<{ file: File; dataUrl: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSend = async () => {
    if (disabled || (!prompt && !image)) return;
    
    let imagePart;
    if (image) {
        imagePart = await fileToGenerativePart(image.file);
    }
    
    onSend(prompt, imagePart);
    setPrompt('');
    setImage(null);
    if(fileInputRef.current) {
        fileInputRef.current.value = "";
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const dataUrl = URL.createObjectURL(file);
      setImage({ file, dataUrl });
    }
  };
  
  const handleRemoveImage = () => {
    setImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
        {image && (
             <div className="relative w-24 h-24 mb-2 p-1 border border-gray-600 rounded-md">
                <img src={image.dataUrl} alt="Preview" className="w-full h-full object-cover rounded"/>
                <button onClick={handleRemoveImage} className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold hover:bg-red-700">
                    X
                </button>
            </div>
        )}
      <div className="flex items-center bg-gray-800 rounded-full p-2 shadow-inner">
        <button 
          onClick={() => fileInputRef.current?.click()}
          className="p-2 text-gray-400 hover:text-white transition-colors"
          aria-label="Attach Image"
          disabled={disabled}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </button>
        <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
        
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask Astra..."
          className="flex-1 bg-transparent text-gray-100 placeholder-gray-500 outline-none resize-none px-4"
          rows={1}
          disabled={disabled}
        />
        
        <button
          onClick={handleSend}
          disabled={disabled || (!prompt.trim() && !image)}
          className="p-2 rounded-full bg-indigo-600 text-white hover:bg-indigo-500 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
          aria-label="Send Message"
        >
            {disabled ? (
                <svg className="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
            ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
            )}
        </button>
      </div>
    </div>
  );
};
