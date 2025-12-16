import React, { useState, useEffect, useRef } from 'react';
import { generateStructureFromText } from '../services/openrouterService';
import { StructureData, ProjectType } from '../types';
import { useVoiceInput } from '../hooks/useVoiceInput';
import { useSpeechLanguage } from '../hooks/useSpeechLanguage';
import LanguageSelector from './LanguageSelector';

interface AIAssistantProps {
  currentData: StructureData;
  onStructureGenerated: (data: StructureData) => void;
  isApiKeyAvailable: boolean;
  projectType?: ProjectType;
  isOpen: boolean;
  onClose: () => void;
}

const AIAssistant: React.FC<AIAssistantProps> = ({ 
  currentData, 
  onStructureGenerated, 
  isApiKeyAvailable, 
  projectType,
  isOpen,
  onClose
}) => {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Language preference for speech recognition
  const { language: speechLanguage } = useSpeechLanguage();

  // Voice input
  const { 
    isListening, 
    transcript, 
    error: voiceError, 
    isSupported: isVoiceSupported,
    startListening, 
    stopListening 
  } = useVoiceInput({ language: speechLanguage });

  // Track the last transcript length to only append new parts
  const lastTranscriptLengthRef = useRef(0);
  
  // Sync voice transcript with prompt (append only new parts)
  useEffect(() => {
    if (transcript && isListening) {
      // If transcript length decreased, it was reset - start fresh
      if (transcript.length < lastTranscriptLengthRef.current) {
        lastTranscriptLengthRef.current = 0;
      }
      
      const newPart = transcript.slice(lastTranscriptLengthRef.current);
      if (newPart.trim()) {
        setPrompt(prev => prev ? `${prev} ${newPart}` : newPart);
      }
      lastTranscriptLengthRef.current = transcript.length;
    } else if (!isListening) {
      // Reset when stopping
      lastTranscriptLengthRef.current = 0;
    }
  }, [transcript, isListening]);

  const toggleVoiceInput = () => {
    if (isListening) {
      stopListening();
      lastTranscriptLengthRef.current = 0;
    } else {
      lastTranscriptLengthRef.current = 0;
      startListening();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      const newData = await generateStructureFromText(prompt, currentData, projectType);
      onStructureGenerated(newData);
      setPrompt('');
      onClose(); // Close modal after successful generation
    } catch (err) {
      setError("Error generating structure. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  if (!isApiKeyAvailable) {
    return (
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <div 
          className="glass-strong rounded-3xl shadow-2xl border border-white/40 p-6 max-w-2xl w-full"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-amber-800 font-semibold text-lg">AI features disabled</h3>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <p className="text-amber-700 text-sm">API_KEY environment variable missing.</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div 
        className="glass-strong rounded-3xl shadow-2xl border border-white/40 flex flex-col max-w-4xl w-full max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="glass-dark p-6 text-white flex justify-between items-center flex-shrink-0 rounded-t-3xl border-b border-white/20">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
              <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <h2 className="font-semibold text-lg">AI Architect</h2>
              <p className="text-xs text-slate-300 mt-1">
                {(() => {
                  if (projectType === ProjectType.TEAM_STRUCTURE) {
                    return 'Describe your team structure. E.g. "Create an Engineering team with Frontend and Backend subteams. Sarah is the team lead."';
                  } else if (projectType === ProjectType.PRINCE2_PROJECT || projectType === ProjectType.PSMI_PROJECT) {
                    return 'Describe your project structure. E.g. "Create a Planning stage with multiple work packages. John is the project manager."';
                  } else {
                    return 'Describe your company structure. E.g. "Create a holding Alpha that owns Beta GmbH. Max Mustermann is managing director of Alpha."';
                  }
                })()}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <form onSubmit={handleSubmit} className="h-full flex flex-col">
            <div className="flex-1 mb-4">
              {/* Voice input controls */}
              {isVoiceSupported && (
                <div className="flex items-center gap-3 mb-3">
                  <LanguageSelector compact={true} />
                  <button 
                    type="button"
                    onClick={toggleVoiceInput}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                      isListening 
                        ? 'bg-red-500 text-white animate-pulse' 
                        : 'glass border border-white/30 text-slate-700 hover:bg-white/50'
                    }`}
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                    </svg>
                    {isListening ? 'Stop Recording' : 'Voice Input'}
                  </button>
                  {isListening && (
                    <span className="text-sm text-red-600 flex items-center gap-1">
                      <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                      Listening... speak now
                    </span>
                  )}
                </div>
              )}
              {voiceError && (
                <div className="text-xs text-red-500 mb-2">{voiceError}</div>
              )}
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder={isListening ? "Speak now... your words will appear here" : "Describe your company structure in detail..."}
                className="w-full text-base p-4 glass border border-white/30 rounded-xl focus:ring-2 focus:ring-indigo-400/50 focus:border-indigo-400/50 outline-none resize-none h-full min-h-[400px] text-slate-900 backdrop-blur-xl font-sans"
                autoFocus
              />
            </div>
            
            {error && (
              <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-xl">
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading || !prompt.trim()}
              className={`w-full py-4 px-6 rounded-xl text-base font-medium transition-all flex items-center justify-center gap-3
                ${isLoading 
                  ? 'glass border border-white/20 text-slate-500 cursor-not-allowed' 
                  : 'glass border border-indigo-400/50 bg-indigo-600/60 hover:bg-indigo-600/80 text-white shadow-lg backdrop-blur-xl'
                }`}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Generating Structure...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Generate Structure
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;