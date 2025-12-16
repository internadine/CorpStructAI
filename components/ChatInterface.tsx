import React, { useState, useEffect, useRef, useCallback } from 'react';
import { StructureData } from '../types';
import ReactMarkdown from 'react-markdown';
import { chatCompletion, getTaxLegalSystemInstruction } from '../services/openrouterService';
import { useVoiceInput } from '../hooks/useVoiceInput';
import { useSpeechLanguage } from '../hooks/useSpeechLanguage';
import { useAuth } from './Auth/AuthProvider';
import { saveConversation, extractMemories, getMemoryContext } from '../services/memoryService';
import LanguageSelector from './LanguageSelector';

interface ChatInterfaceProps {
  structureData: StructureData;
  isOpen: boolean;
  onClose: () => void;
  country?: string;
  projectId?: string;
}

interface Message {
  role: 'user' | 'model';
  text: string;
  timestamp?: Date;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ structureData, isOpen, onClose, country, projectId }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: 'Hello! I am your assistant for tax and legal questions about your company structure. How can I help?', timestamp: new Date() }
  ]);
  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [windowSize, setWindowSize] = useState({ width: 480, height: 700 });
  const [isResizing, setIsResizing] = useState(false);
  const resizeRef = useRef<{ startX: number; startY: number; startWidth: number; startHeight: number } | null>(null);
  const [memoryContext, setMemoryContext] = useState<string>('');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [showExportMenu, setShowExportMenu] = useState(false);

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

  // Toggle fullscreen mode
  const toggleFullscreen = useCallback(() => {
    setIsFullscreen(prev => !prev);
  }, []);

  // Clear chat and start new conversation
  const clearChat = useCallback(() => {
    if (window.confirm('Are you sure you want to clear the chat and start a new conversation?')) {
      setMessages([
        { role: 'model', text: 'Hello! I am your assistant for tax and legal questions about your company structure. How can I help?', timestamp: new Date() }
      ]);
      setMemoryContext('');
      setInput('');
    }
  }, []);

  // Copy single message to clipboard
  const copyMessage = useCallback(async (text: string, index: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  }, []);

  // Copy entire conversation to clipboard
  const copyConversation = useCallback(async () => {
    const conversationText = messages
      .map((msg, idx) => {
        const role = msg.role === 'user' ? 'You' : 'Tax & Legal Assistant';
        const timestamp = msg.timestamp ? ` (${msg.timestamp.toLocaleString()})` : '';
        return `## ${role}${timestamp}\n\n${msg.text}`;
      })
      .join('\n\n---\n\n');
    
    const header = `# Tax & Legal Chat Conversation\n_Exported on ${new Date().toLocaleString()}_\n${country ? `_Country context: ${country}_` : ''}\n\n---\n\n`;
    
    try {
      await navigator.clipboard.writeText(header + conversationText);
      setShowExportMenu(false);
    } catch (err) {
      console.error('Failed to copy conversation:', err);
    }
  }, [messages, country]);

  // Download conversation as markdown file
  const downloadAsMarkdown = useCallback(() => {
    const conversationText = messages
      .map((msg) => {
        const role = msg.role === 'user' ? 'You' : 'Tax & Legal Assistant';
        const timestamp = msg.timestamp ? ` (${msg.timestamp.toLocaleString()})` : '';
        return `## ${role}${timestamp}\n\n${msg.text}`;
      })
      .join('\n\n---\n\n');
    
    const header = `# Tax & Legal Chat Conversation\n\n_Exported on ${new Date().toLocaleString()}_\n${country ? `\n_Country context: ${country}_` : ''}\n\n---\n\n`;
    
    const blob = new Blob([header + conversationText], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tax-legal-chat-${new Date().toISOString().split('T')[0]}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setShowExportMenu(false);
  }, [messages, country]);

  // Download conversation as text file
  const downloadAsText = useCallback(() => {
    const conversationText = messages
      .map((msg) => {
        const role = msg.role === 'user' ? 'You' : 'Tax & Legal Assistant';
        const timestamp = msg.timestamp ? ` (${msg.timestamp.toLocaleString()})` : '';
        return `${role}${timestamp}:\n\n${msg.text}`;
      })
      .join('\n\n' + '='.repeat(50) + '\n\n');
    
    const header = `Tax & Legal Chat Conversation\nExported on ${new Date().toLocaleString()}\n${country ? `Country context: ${country}` : ''}\n\n${'='.repeat(50)}\n\n`;
    
    const blob = new Blob([header + conversationText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tax-legal-chat-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setShowExportMenu(false);
  }, [messages, country]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  // Handle Escape key to exit fullscreen and close export menu
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (showExportMenu) {
          setShowExportMenu(false);
        } else if (isFullscreen) {
          setIsFullscreen(false);
        }
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen, showExportMenu]);

  // Close export menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      if (showExportMenu) {
        setShowExportMenu(false);
      }
    };
    
    if (showExportMenu) {
      // Delay to prevent immediate closing
      setTimeout(() => {
        document.addEventListener('click', handleClickOutside);
      }, 0);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [showExportMenu]);

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
    const userTimestamp = new Date();
    setMessages(prev => [...prev, { role: 'user', text: userMsg, timestamp: userTimestamp }]);
    setInput('');
    setIsThinking(true);

    try {
      const systemInstruction = getTaxLegalSystemInstruction(structureData, country, memoryContext, userMsg);

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
      const modelTimestamp = new Date();

      const updatedMessages = [...messages, { role: 'user' as const, text: userMsg, timestamp: userTimestamp }, { role: 'model' as const, text: responseText, timestamp: modelTimestamp }];
      setMessages(updatedMessages);

      // Save conversation and extract memories asynchronously (don't block UI)
      if (user && projectId) {
        try {
          const conversationId = await saveConversation(user.uid, projectId, 'legal', updatedMessages);
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

  // Fullscreen modal classes
  const containerClasses = isFullscreen
    ? "fixed inset-4 md:inset-8 lg:inset-16 glass-strong rounded-3xl shadow-2xl border border-white/40 flex flex-col z-50 overflow-hidden font-sans"
    : "fixed bottom-4 right-4 glass-strong rounded-3xl shadow-2xl border border-white/40 flex flex-col z-50 overflow-hidden font-sans";

  return (
    <>
      {/* Backdrop for fullscreen mode */}
      {isFullscreen && (
        <div 
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
          onClick={toggleFullscreen}
        />
      )}
      
      <div 
        className={containerClasses}
        style={isFullscreen ? undefined : { width: `${windowSize.width}px`, height: `${windowSize.height}px` }}
      >
        {/* Header */}
        <div className="glass-dark p-4 text-white flex justify-between items-center flex-shrink-0 rounded-t-3xl border-b border-white/20">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <h3 className="font-semibold text-sm">Tax & Legal Chat</h3>
            {country && (
              <span className="text-xs text-slate-400 bg-slate-700/50 px-2 py-0.5 rounded-full">
                {country}
              </span>
            )}
          </div>
          <div className="flex items-center gap-1">
            {/* Language Selector */}
            {isVoiceSupported && (
              <LanguageSelector compact={true} />
            )}
            {/* Export Menu Button */}
            <div className="relative">
              <button 
                onClick={() => setShowExportMenu(!showExportMenu)}
                className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                title="Export conversation"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </button>
              {/* Export Dropdown */}
              {showExportMenu && (
                <div className="absolute right-0 top-full mt-1 w-48 bg-slate-800 border border-slate-700 rounded-lg shadow-xl z-50 overflow-hidden">
                  <button 
                    onClick={copyConversation}
                    className="w-full px-3 py-2 text-left text-sm text-slate-200 hover:bg-slate-700 flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                    </svg>
                    Copy to Clipboard
                  </button>
                  <button 
                    onClick={downloadAsMarkdown}
                    className="w-full px-3 py-2 text-left text-sm text-slate-200 hover:bg-slate-700 flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Download as Markdown
                  </button>
                  <button 
                    onClick={downloadAsText}
                    className="w-full px-3 py-2 text-left text-sm text-slate-200 hover:bg-slate-700 flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Download as Text
                  </button>
                </div>
              )}
            </div>
            {/* Clear Chat Button */}
            <button 
              onClick={clearChat}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
              title="Clear chat and start new conversation"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
            {/* Fullscreen Toggle */}
            <button 
              onClick={toggleFullscreen}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
              title={isFullscreen ? "Exit fullscreen" : "Expand to fullscreen"}
            >
              {isFullscreen ? (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 9V4.5M9 9H4.5M9 9L3.75 3.75M9 15v4.5M9 15H4.5M9 15l-5.25 5.25M15 9h4.5M15 9V4.5M15 9l5.25-5.25M15 15h4.5M15 15v4.5m0-4.5l5.25 5.25" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
                </svg>
              )}
            </button>
            {/* Close Button */}
            <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

      {/* AI Disclaimer Banner */}
      <div className="px-4 py-2 bg-amber-100/80 border-b border-amber-200/50 flex-shrink-0">
        <div className="flex items-start gap-2">
          <svg className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <p className="text-xs text-amber-800 leading-relaxed">
            <strong>Important:</strong> AI responses may contain errors. Always verify information with a qualified lawyer, tax advisor, or other professional before making any decisions.
          </p>
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className={`flex-1 overflow-y-auto p-5 space-y-5 ${isFullscreen ? 'px-8 lg:px-16' : ''}`}>
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} group`}>
            <div className={`relative ${isFullscreen ? 'max-w-[70%]' : 'max-w-[85%]'} rounded-2xl p-4 shadow-lg ${
              msg.role === 'user' 
                ? 'glass border border-blue-400/50 bg-blue-600/40 text-white rounded-br-none backdrop-blur-xl' 
                : 'glass border border-white/30 text-slate-800 rounded-bl-none backdrop-blur-xl'
            }`}>
              {/* Copy button - appears on hover */}
              <button
                onClick={() => copyMessage(msg.text, idx)}
                className={`absolute ${msg.role === 'user' ? '-left-10' : '-right-10'} top-2 p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity ${
                  copiedIndex === idx 
                    ? 'bg-green-500 text-white' 
                    : 'bg-slate-200 hover:bg-slate-300 text-slate-600'
                }`}
                title={copiedIndex === idx ? 'Copied!' : 'Copy message'}
              >
                {copiedIndex === idx ? (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                )}
              </button>
              
              {msg.role === 'model' ? (
                <div className={`prose ${isFullscreen ? 'prose-base' : 'prose-sm'} max-w-none text-slate-700 leading-relaxed`}>
                  <ReactMarkdown
                    components={{
                      p: ({ children }) => <p className={`mb-3 last:mb-0 ${isFullscreen ? 'text-base' : 'text-sm'} leading-7`}>{children}</p>,
                      strong: ({ children }) => <strong className="font-semibold text-slate-900">{children}</strong>,
                      ul: ({ children }) => <ul className="list-disc list-inside mb-3 space-y-2 ml-2">{children}</ul>,
                      ol: ({ children }) => <ol className="list-decimal list-inside mb-3 space-y-2 ml-2">{children}</ol>,
                      li: ({ children }) => <li className={`${isFullscreen ? 'text-base' : 'text-sm'} leading-7`}>{children}</li>,
                      h1: ({ children }) => <h1 className={`${isFullscreen ? 'text-xl' : 'text-base'} font-bold mb-3 mt-4 first:mt-0 text-slate-900`}>{children}</h1>,
                      h2: ({ children }) => <h2 className={`${isFullscreen ? 'text-lg' : 'text-sm'} font-bold mb-2 mt-3 first:mt-0 text-slate-900`}>{children}</h2>,
                      h3: ({ children }) => <h3 className={`${isFullscreen ? 'text-base' : 'text-sm'} font-semibold mb-2 mt-2 first:mt-0 text-slate-800`}>{children}</h3>,
                      code: ({ children }) => <code className="bg-slate-100 px-1.5 py-0.5 rounded text-xs font-mono text-slate-800">{children}</code>,
                      pre: ({ children }) => <pre className="bg-slate-100 p-3 rounded-lg overflow-x-auto mb-3">{children}</pre>,
                      blockquote: ({ children }) => <blockquote className="border-l-4 border-slate-300 pl-4 italic text-slate-600 my-3">{children}</blockquote>,
                      table: ({ children }) => <div className="overflow-x-auto mb-3"><table className="min-w-full border-collapse border border-slate-300">{children}</table></div>,
                      th: ({ children }) => <th className="border border-slate-300 px-3 py-2 bg-slate-100 text-left font-semibold text-sm">{children}</th>,
                      td: ({ children }) => <td className="border border-slate-300 px-3 py-2 text-sm">{children}</td>,
                    }}
                  >
                    {msg.text}
                  </ReactMarkdown>
                </div>
              ) : (
                <p className={`${isFullscreen ? 'text-base' : 'text-sm'} leading-relaxed whitespace-pre-wrap`}>{msg.text}</p>
              )}
              
              {/* Timestamp in fullscreen mode */}
              {isFullscreen && msg.timestamp && (
                <div className={`text-xs mt-2 ${msg.role === 'user' ? 'text-blue-200' : 'text-slate-400'}`}>
                  {msg.timestamp.toLocaleTimeString()}
                </div>
              )}
            </div>
          </div>
        ))}
        {isThinking && (
          <div className="flex justify-start">
            <div className="glass border border-white/30 text-slate-700 rounded-xl p-3 text-xs italic backdrop-blur-xl">
              Analyzing structure...
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <form onSubmit={handleSend} className={`p-3 border-t border-white/20 flex-shrink-0 ${isFullscreen ? 'px-8 lg:px-16 py-4' : ''}`}>
        {/* Voice error message */}
        {voiceError && (
          <div className="text-xs text-red-500 mb-2 px-1">{voiceError}</div>
        )}
        {/* Listening indicator */}
        {isListening && (
          <div className="text-xs text-blue-600 mb-2 px-1 flex items-center gap-1">
            <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
            Listening...
          </div>
        )}
        <div className={`relative flex items-center gap-2 ${isFullscreen ? 'max-w-4xl mx-auto' : ''}`}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={isListening ? "Speak now..." : "Ask a legal question..."}
            className={`w-full pl-4 pr-20 ${isFullscreen ? 'py-4 text-base' : 'py-3 text-sm'} glass border border-white/30 rounded-xl text-slate-900 focus:ring-2 focus:ring-white/50 outline-none backdrop-blur-xl`}
          />
          <div className={`absolute right-2 ${isFullscreen ? 'top-3' : 'top-2'} flex items-center gap-1`}>
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
                <svg className={`${isFullscreen ? 'w-6 h-6' : 'w-5 h-5'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
              </button>
            )}
            {/* Send button */}
            <button 
              type="submit" 
              disabled={!input.trim() || isThinking}
              className={`${isFullscreen ? 'p-2' : 'p-1.5'} text-white bg-blue-500 hover:bg-blue-600 rounded-full disabled:opacity-40 disabled:bg-slate-300 transition-colors`}
            >
              <svg className={`${isFullscreen ? 'w-5 h-5' : 'w-4 h-4'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
              </svg>
            </button>
          </div>
        </div>
        
        {/* Keyboard hint in fullscreen */}
        {isFullscreen && (
          <div className="text-center mt-2 text-xs text-slate-400">
            Press <kbd className="px-1.5 py-0.5 bg-slate-200 rounded text-slate-600">Esc</kbd> to exit fullscreen
          </div>
        )}
      </form>

      {/* Resize Handle - only in compact mode */}
      {!isFullscreen && (
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
      )}
    </div>
    </>
  );
};

export default ChatInterface;