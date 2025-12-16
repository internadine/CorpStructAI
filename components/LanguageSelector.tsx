import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useSpeechLanguage, LanguageCode } from '../hooks/useSpeechLanguage';

interface LanguageSelectorProps {
  className?: string;
  compact?: boolean;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ className = '', compact = false }) => {
  const { language, setLanguage, languageInfo, supportedLanguages } = useSpeechLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [dropdownPosition, setDropdownPosition] = useState<{ top: number; left: number } | null>(null);

  // Calculate dropdown position when opening
  useEffect(() => {
    if (isOpen && buttonRef.current) {
      const buttonRect = buttonRef.current.getBoundingClientRect();
      const dropdownWidth = 256; // w-64 (256px)
      const spacing = 8; // mt-2 (8px)
      
      // Calculate left position (right-aligned with button)
      let left = buttonRect.right + window.scrollX - dropdownWidth;
      
      // Ensure dropdown doesn't go off-screen on the left
      if (left < window.scrollX) {
        left = buttonRect.left + window.scrollX;
      }
      
      // Ensure dropdown doesn't go off-screen on the right
      const maxLeft = window.scrollX + window.innerWidth - dropdownWidth;
      if (left > maxLeft) {
        left = maxLeft;
      }
      
      setDropdownPosition({
        top: buttonRect.bottom + window.scrollY + spacing,
        left: left,
      });
    } else {
      setDropdownPosition(null);
    }
  }, [isOpen]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        buttonRef.current && 
        !buttonRef.current.contains(target) &&
        dropdownRef.current && 
        !dropdownRef.current.contains(target)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      // Use setTimeout to avoid immediate closing
      setTimeout(() => {
        document.addEventListener('mousedown', handleClickOutside);
      }, 0);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  const handleLanguageChange = (langCode: LanguageCode) => {
    setLanguage(langCode);
    setIsOpen(false);
  };

  // Render dropdown content
  const renderDropdown = () => {
    if (!isOpen || !dropdownPosition) return null;

    const dropdownContent = (
      <div
        ref={dropdownRef}
        className="fixed w-64 bg-white border border-slate-300 rounded-lg shadow-2xl z-[9999] max-h-80 overflow-y-auto"
        style={{
          top: `${dropdownPosition.top}px`,
          left: `${dropdownPosition.left}px`,
        }}
      >
        <div className="p-2 border-b border-slate-200 bg-slate-50">
          <p className="text-xs font-medium text-slate-600 px-2">Select language for voice input</p>
        </div>
        <div className="py-1">
          {supportedLanguages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleLanguageChange(lang.code)}
              type="button"
              className={`w-full px-4 py-2.5 text-left hover:bg-slate-50 transition-colors ${
                language === lang.code ? 'bg-blue-50 text-blue-700 font-medium border-l-3 border-blue-500' : 'text-slate-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="font-medium">{lang.nativeName}</span>
                  <span className="text-xs text-slate-500 mt-0.5">{lang.name}</span>
                </div>
                {language === lang.code && (
                  <svg className="w-4 h-4 text-blue-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>
    );

    // Use portal to render outside the component tree
    return typeof document !== 'undefined' 
      ? createPortal(dropdownContent, document.body)
      : null;
  };

  if (compact) {
    return (
      <>
        <div className={`relative ${className}`}>
          <button
            ref={buttonRef}
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs text-white/90 hover:text-white hover:bg-white/20 rounded-lg transition-all cursor-pointer border border-white/20 hover:border-white/40"
            title={`Current language: ${languageInfo.name} - Click to change`}
            type="button"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
            </svg>
            <span className="font-semibold">{languageInfo.code.split('-')[0].toUpperCase()}</span>
            <svg 
              className={`w-3 h-3 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
        {renderDropdown()}
      </>
    );
  }

  return (
    <>
      <div className={`relative ${className}`}>
        <button
          ref={buttonRef}
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 rounded-lg transition-colors border border-slate-200"
          title={`Current language: ${languageInfo.name}`}
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
          </svg>
          <span className="font-medium">{languageInfo.nativeName}</span>
          <svg className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>
      {isOpen && dropdownPosition && (
        createPortal(
          <div
            ref={dropdownRef}
            className="fixed w-64 bg-white border border-slate-200 rounded-lg shadow-xl z-[9999] max-h-80 overflow-y-auto"
            style={{
              top: `${dropdownPosition.top}px`,
              left: `${dropdownPosition.left}px`,
            }}
          >
            <div className="p-2 border-b border-slate-200">
              <p className="text-xs text-slate-500 px-2">Select language for voice input</p>
            </div>
            {supportedLanguages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleLanguageChange(lang.code)}
                className={`w-full px-3 py-2.5 text-left hover:bg-slate-50 transition-colors ${
                  language === lang.code ? 'bg-blue-50 text-blue-700 font-medium' : 'text-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">{lang.nativeName}</div>
                    <div className="text-xs text-slate-500">{lang.name}</div>
                  </div>
                  {language === lang.code && (
                    <svg className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
              </button>
            ))}
          </div>,
          document.body
        )
      )}
    </>
  );
};

export default LanguageSelector;
