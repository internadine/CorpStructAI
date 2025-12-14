import React, { useState, useEffect, useRef } from 'react';
import { StructureData } from '../types';
import ReactMarkdown from 'react-markdown';
import { chatCompletion } from '../services/openrouterService';

interface ChatInterfaceProps {
  structureData: StructureData;
  isOpen: boolean;
  onClose: () => void;
}

interface Message {
  role: 'user' | 'model';
  text: string;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ structureData, isOpen, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: 'Hallo! Ich bin Ihr Assistent für Steuer- und Rechtsfragen zu Ihrer Firmenstruktur. Wie kann ich helfen?' }
  ]);
  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [windowSize, setWindowSize] = useState({ width: 480, height: 700 });
  const [isResizing, setIsResizing] = useState(false);
  const resizeRef = useRef<{ startX: number; startY: number; startWidth: number; startHeight: number } | null>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

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
      const systemInstruction = `
Du bist ein erfahrener deutscher Wirtschaftsanwalt und Steuerberater.
Dein Mandant zeigt dir folgende Firmenstruktur (JSON Format):
${JSON.stringify(structureData)}

Deine Aufgabe ist es, Fragen zu dieser Struktur zu beantworten, Risiken aufzuzeigen (z.B. verdeckte Gewinnausschüttung, Organschaft, Haftung) und Optimierungen vorzuschlagen.
Antworte präzise, professionell, aber verständlich auf Deutsch.
Beziehe dich konkret auf die Namen der Firmen und Personen in der Struktur.
      `.trim();

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

      setMessages(prev => [...prev, { role: 'model', text: responseText }]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'model', text: 'Entschuldigung, es gab einen Fehler bei der Verarbeitung Ihrer Anfrage.' }]);
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
      <div className="glass-dark p-4 text-white flex justify-between items-center flex-shrink-0 rounded-t-3xl border-b border-white/20">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <h3 className="font-semibold text-sm">Steuer- & Rechts-Chat</h3>
        </div>
        <button onClick={onClose} className="text-slate-400 hover:text-white">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-5 space-y-5">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] rounded-2xl p-4 shadow-lg ${
              msg.role === 'user' 
                ? 'glass border border-blue-400/50 bg-blue-600/40 text-white rounded-br-none backdrop-blur-xl' 
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
              Analysiere Struktur...
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <form onSubmit={handleSend} className="p-3 border-t border-white/20 flex-shrink-0">
        <div className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Stellen Sie eine rechtliche Frage..."
            className="w-full pl-4 pr-10 py-3 glass border border-white/30 rounded-xl text-sm text-slate-900 focus:ring-2 focus:ring-white/50 outline-none backdrop-blur-xl"
          />
          <button 
            type="submit" 
            disabled={!input.trim() || isThinking}
            className="absolute right-2 top-2 p-1 text-blue-600 hover:bg-blue-100 rounded-full disabled:opacity-50"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9-2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
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

export default ChatInterface;