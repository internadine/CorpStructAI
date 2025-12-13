import React, { useState } from 'react';
import { generateStructureFromText } from '../services/geminiService';
import { StructureData } from '../types';

interface AIAssistantProps {
  currentData: StructureData;
  onStructureGenerated: (data: StructureData) => void;
  isApiKeyAvailable: boolean;
}

const AIAssistant: React.FC<AIAssistantProps> = ({ currentData, onStructureGenerated, isApiKeyAvailable }) => {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      const newData = await generateStructureFromText(prompt, currentData);
      onStructureGenerated(newData);
      setPrompt('');
    } catch (err) {
      setError("Fehler beim Generieren der Struktur. Bitte versuchen Sie es erneut.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isApiKeyAvailable) {
    return (
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
        <h3 className="text-amber-800 font-semibold text-sm mb-1">KI-Funktionen deaktiviert</h3>
        <p className="text-amber-700 text-xs">API_KEY Umgebungsvariable fehlt.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-indigo-100 p-4 mb-6">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center">
          <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <h2 className="font-semibold text-slate-800">KI Architekt</h2>
      </div>
      
      <p className="text-xs text-slate-500 mb-3">
        Beschreiben Sie Ihre Firmenstruktur. Z.B. "Erstelle eine Holding Alpha, die Beta GmbH besitzt. Max Mustermann ist Geschäftsführer der Alpha."
      </p>

      <form onSubmit={handleSubmit}>
        <div className="relative">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Struktur beschreiben..."
            className="w-full text-sm p-3 pr-10 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none resize-none h-24 bg-white text-slate-900"
          />
        </div>
        
        {error && <p className="text-red-500 text-xs mt-2">{error}</p>}

        <button
          type="submit"
          disabled={isLoading || !prompt.trim()}
          className={`mt-3 w-full py-2 px-4 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2
            ${isLoading 
              ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
              : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-200'
            }`}
        >
          {isLoading ? (
            <>
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Denkt nach...
            </>
          ) : (
            'Struktur Generieren'
          )}
        </button>
      </form>
    </div>
  );
};

export default AIAssistant;