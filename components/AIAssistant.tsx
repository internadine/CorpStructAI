import React, { useState } from 'react';
import { generateStructureFromText } from '../services/openrouterService';
import { StructureData, ProjectType } from '../types';

interface AIAssistantProps {
  currentData: StructureData;
  onStructureGenerated: (data: StructureData) => void;
  isApiKeyAvailable: boolean;
  projectType?: ProjectType;
}

const AIAssistant: React.FC<AIAssistantProps> = ({ currentData, onStructureGenerated, isApiKeyAvailable, projectType }) => {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      const newData = await generateStructureFromText(prompt, currentData, projectType);
      onStructureGenerated(newData);
      setPrompt('');
    } catch (err) {
      setError("Error generating structure. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isApiKeyAvailable) {
    return (
      <div className="glass border border-amber-300/50 rounded-xl p-4 mb-6 backdrop-blur-xl">
        <h3 className="text-amber-800 font-semibold text-sm mb-1">AI features disabled</h3>
        <p className="text-amber-700 text-xs">API_KEY environment variable missing.</p>
      </div>
    );
  }

  return (
    <div className="glass border border-indigo-300/50 rounded-2xl shadow-lg p-4 mb-6 backdrop-blur-xl">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center">
          <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <h2 className="font-semibold text-slate-800">AI Architect</h2>
      </div>
      
      <p className="text-xs text-slate-800 mb-3 leading-relaxed">
        Describe your company structure. E.g. "Create a holding Alpha that owns Beta GmbH. Max Mustermann is managing director of Alpha."
      </p>

      <form onSubmit={handleSubmit}>
        <div className="relative">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe structure..."
            className="w-full text-sm p-3 pr-10 glass border border-white/30 rounded-xl focus:ring-2 focus:ring-indigo-400/50 focus:border-indigo-400/50 outline-none resize-none h-24 text-slate-900 backdrop-blur-xl"
          />
        </div>
        
        {error && <p className="text-red-500 text-xs mt-2">{error}</p>}

        <button
          type="submit"
          disabled={isLoading || !prompt.trim()}
          className={`mt-3 w-full py-2 px-4 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-2
            ${isLoading 
              ? 'glass border border-white/20 text-slate-500 cursor-not-allowed' 
              : 'glass border border-indigo-400/50 bg-indigo-600/60 hover:bg-indigo-600/80 text-white shadow-lg backdrop-blur-xl'
            }`}
        >
          {isLoading ? (
            <>
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Thinking...
            </>
          ) : (
            'Generate Structure'
          )}
        </button>
      </form>
    </div>
  );
};

export default AIAssistant;