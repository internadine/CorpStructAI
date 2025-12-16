import React, { useState, useEffect, useRef } from 'react';
import { StructureData, ProjectType } from '../types';
import ReactMarkdown from 'react-markdown';
import { chatCompletion, getBusinessConsultantSystemInstruction } from '../services/openrouterService';
import { useVoiceInput } from '../hooks/useVoiceInput';
import { useAuth } from './Auth/AuthProvider';
import { saveConversation, extractMemories, getMemoryContext } from '../services/memoryService';

interface BusinessConsultantChatProps {
  structureData: StructureData;
  isOpen: boolean;
  onClose: () => void;
  projectType?: ProjectType;
  country?: string;
  projectId?: string;
}

interface Message {
  role: 'user' | 'model';
  text: string;
}

const BusinessConsultantChat: React.FC<BusinessConsultantChatProps> = ({ structureData, isOpen, onClose, projectType, country, projectId }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: 'Hello! I am your Business Consultant. I analyze your company structure and identify business opportunities, synergies, and growth potential. How can I help you?' }
  ]);
  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [windowSize, setWindowSize] = useState({ width: 480, height: 700 });
  const [isResizing, setIsResizing] = useState(false);
  const resizeRef = useRef<{ startX: number; startY: number; startWidth: number; startHeight: number } | null>(null);
  const [memoryContext, setMemoryContext] = useState<string>('');

  // Voice input
  const { 
    isListening, 
    transcript, 
    error: voiceError, 
    isSupported: isVoiceSupported,
    startListening, 
    stopListening 
  } = useVoiceInput({ language: 'en-US' });

  // Sync voice transcript with input
  useEffect(() => {
    if (transcript) {
      setInput(transcript);
    }
  }, [transcript]);

  const toggleVoiceInput = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  // Load memories when component opens or projectId changes
  useEffect(() => {
    const loadMemories = async () => {
      if (!user || !projectId || !isOpen) {
        setMemoryContext('');
        return;
      }

      try {
        const context = await getMemoryContext(user.uid, projectId);
        setMemoryContext(context);
      } catch (error) {
        console.error('Error loading memories:', error);
        setMemoryContext('');
      }
    };

    loadMemories();
  }, [user, projectId, isOpen]);

  // Handle window resize
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing || !resizeRef.current) return;
      
      const deltaX = e.clientX - resizeRef.current.startX;
      const deltaY = e.clientY - resizeRef.current.startY;
      
      setWindowSize({
        width: Math.max(400, Math.min(1200, resizeRef.current.startWidth + deltaX)),
        height: Math.max(400, Math.min(900, resizeRef.current.startHeight + deltaY))
      });
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      resizeRef.current = null;
    };

    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isResizing]);

  const handleResizeStart = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
    resizeRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      startWidth: windowSize.width,
      startHeight: windowSize.height
    };
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isThinking) return;

    const userMsg = input;
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInput('');
    setIsThinking(true);

    try {
      // Create comprehensive context with all company details
      const companyDetails = structureData.companies.map(company => {
        const companyPeople = structureData.people.filter(p => p.companyId === company.id);
        return {
          name: company.name,
          type: company.type,
          businessJustification: company.businessJustification,
          financialResources: company.financialResources,
          companyResources: company.companyResources,
          people: companyPeople,
          parentIds: company.parentIds,
          parentOwnership: company.parentOwnership
        };
      });

      const systemInstruction = getBusinessConsultantSystemInstruction(companyDetails, projectType, country, memoryContext);

      // Convert messages to OpenRouter format (skip initial greeting)
      const chatMessages = messages.slice(1).map(m => ({
        role: m.role === 'model' ? 'assistant' : m.role,
        content: m.text
      }));

      // Add current user message
      chatMessages.push({
        role: 'user',
        content: userMsg
      });

      const responseText = await chatCompletion(chatMessages, systemInstruction);

      const updatedMessages = [...messages, { role: 'user' as const, text: userMsg }, { role: 'model' as const, text: responseText }];
      setMessages(updatedMessages);

      // Save conversation and extract memories asynchronously (don't block UI)
      if (user && projectId) {
        try {
          const conversationId = await saveConversation(user.uid, projectId, 'business', updatedMessages);
          // Trigger memory extraction in background
          extractMemories(user.uid, projectId, conversationId, structureData).catch(err => {
            console.error('Error extracting memories:', err);
          });
          // Reload memory context to include newly extracted memories
          const newContext = await getMemoryContext(user.uid, projectId);
          setMemoryContext(newContext);
        } catch (error) {
          console.error('Error saving conversation:', error);
        }
      }
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'model', text: 'Sorry, there was an error processing your request.' }]);
    } finally {
      setIsThinking(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed bottom-4 right-4 glass-strong rounded-3xl shadow-2xl border border-white/40 flex flex-col z-50 overflow-hidden font-sans"
      style={{ width: `${windowSize.width}px`, height: `${windowSize.height}px` }}
    >
      {/* Header */}
      <div className="glass-dark p-4 text-white flex justify-between items-center flex-shrink-0 rounded-t-3xl border-b border-white/20 bg-gradient-to-r from-emerald-700/80 to-emerald-600/80 backdrop-blur-xl">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-emerald-300 rounded-full animate-pulse"></div>
          <h3 className="font-semibold text-sm">Business Consultant</h3>
        </div>
        <button onClick={onClose} className="text-emerald-200 hover:text-white">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* AI Disclaimer Banner */}
      <div className="px-4 py-2 bg-amber-100/80 border-b border-amber-200/50 flex-shrink-0">
        <div className="flex items-start gap-2">
          <svg className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <p className="text-xs text-amber-800 leading-relaxed">
            <strong>Important:</strong> AI responses may contain errors. Always verify business advice with qualified professionals before making decisions.
          </p>
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-5 space-y-5">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] rounded-2xl p-4 shadow-lg ${
              msg.role === 'user' 
                ? 'glass border border-emerald-400/50 bg-emerald-600/40 text-white rounded-br-none backdrop-blur-xl' 
                : 'glass border border-white/30 text-slate-800 rounded-bl-none backdrop-blur-xl'
            }`}>
              {msg.role === 'model' ? (
                <div className="prose prose-sm max-w-none text-slate-700 leading-relaxed">
                  <ReactMarkdown
                    components={{
                      p: ({ children }) => <p className="mb-3 last:mb-0 text-sm leading-6">{children}</p>,
                      strong: ({ children }) => <strong className="font-semibold text-slate-900">{children}</strong>,
                      ul: ({ children }) => <ul className="list-disc list-inside mb-3 space-y-1 ml-2">{children}</ul>,
                      ol: ({ children }) => <ol className="list-decimal list-inside mb-3 space-y-1 ml-2">{children}</ol>,
                      li: ({ children }) => <li className="text-sm leading-6">{children}</li>,
                      h1: ({ children }) => <h1 className="text-base font-bold mb-2 mt-4 first:mt-0 text-slate-900">{children}</h1>,
                      h2: ({ children }) => <h2 className="text-sm font-bold mb-2 mt-3 first:mt-0 text-slate-900">{children}</h2>,
                      h3: ({ children }) => <h3 className="text-sm font-semibold mb-1 mt-2 first:mt-0 text-slate-800">{children}</h3>,
                      code: ({ children }) => <code className="bg-slate-100 px-1.5 py-0.5 rounded text-xs font-mono text-slate-800">{children}</code>,
                    }}
                  >
                    {msg.text}
                  </ReactMarkdown>
                </div>
              ) : (
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>
              )}
            </div>
          </div>
        ))}
        {isThinking && (
          <div className="flex justify-start">
            <div className="glass border border-white/30 text-slate-700 rounded-xl p-3 text-xs italic backdrop-blur-xl">
              Analyzing structure and business opportunities...
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <form onSubmit={handleSend} className="p-3 border-t border-white/20 flex-shrink-0">
        {/* Voice error message */}
        {voiceError && (
          <div className="text-xs text-red-500 mb-2 px-1">{voiceError}</div>
        )}
        {/* Listening indicator */}
        {isListening && (
          <div className="text-xs text-emerald-600 mb-2 px-1 flex items-center gap-1">
            <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
            Listening...
          </div>
        )}
        <div className="relative flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={isListening ? "Speak now..." : "Ask about business opportunities, synergies, strategies..."}
            className="w-full pl-4 pr-20 py-3 glass border border-white/30 rounded-xl text-sm text-slate-900 focus:ring-2 focus:ring-white/50 outline-none backdrop-blur-xl"
          />
          <div className="absolute right-2 top-2 flex items-center gap-1">
            {/* Microphone button */}
            {isVoiceSupported && (
              <button 
                type="button"
                onClick={toggleVoiceInput}
                className={`p-1 rounded-full transition-colors ${
                  isListening 
                    ? 'text-red-500 bg-red-100 animate-pulse' 
                    : 'text-slate-500 hover:bg-slate-100'
                }`}
                title={isListening ? "Stop recording" : "Start voice input"}
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
              </button>
            )}
            {/* Send button */}
            <button 
              type="submit" 
              disabled={!input.trim() || isThinking}
              className="p-1.5 text-white bg-emerald-500 hover:bg-emerald-600 rounded-full disabled:opacity-40 disabled:bg-slate-300 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
              </svg>
            </button>
          </div>
        </div>
      </form>

      {/* Resize Handle */}
      <div
        onMouseDown={handleResizeStart}
        className="absolute bottom-0 right-0 w-6 h-6 cursor-nwse-resize bg-slate-200 hover:bg-slate-300 transition-colors"
        style={{
          clipPath: 'polygon(100% 0, 0 100%, 100% 100%)'
        }}
      >
        <div className="absolute bottom-0.5 right-0.5 w-3 h-3">
          <svg viewBox="0 0 12 12" className="w-full h-full text-slate-500">
            <path d="M12 12L0 0M12 8L4 0M8 12L0 4" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
          </svg>
        </div>
      </div>
    </div>
  );
};

export default BusinessConsultantChat;

