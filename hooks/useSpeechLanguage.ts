import { useState, useEffect, useCallback } from 'react';

// Supported languages for speech recognition
export const SUPPORTED_LANGUAGES = [
  { code: 'en-US', name: 'English (US)', nativeName: 'English' },
  { code: 'en-GB', name: 'English (UK)', nativeName: 'English' },
  { code: 'de-DE', name: 'German', nativeName: 'Deutsch' },
  { code: 'fr-FR', name: 'French', nativeName: 'Français' },
  { code: 'es-ES', name: 'Spanish', nativeName: 'Español' },
  { code: 'it-IT', name: 'Italian', nativeName: 'Italiano' },
  { code: 'pt-PT', name: 'Portuguese', nativeName: 'Português' },
  { code: 'nl-NL', name: 'Dutch', nativeName: 'Nederlands' },
  { code: 'pl-PL', name: 'Polish', nativeName: 'Polski' },
  { code: 'ru-RU', name: 'Russian', nativeName: 'Русский' },
  { code: 'ja-JP', name: 'Japanese', nativeName: '日本語' },
  { code: 'zh-CN', name: 'Chinese (Simplified)', nativeName: '中文' },
] as const;

export type LanguageCode = typeof SUPPORTED_LANGUAGES[number]['code'];

const STORAGE_KEY = 'speechRecognitionLanguage';

// Detect browser language and find best match
const detectBrowserLanguage = (): LanguageCode => {
  if (typeof window === 'undefined') return 'en-US';
  
  const browserLang = navigator.language || (navigator as any).userLanguage || 'en-US';
  
  // Try exact match first
  const exactMatch = SUPPORTED_LANGUAGES.find(lang => lang.code === browserLang);
  if (exactMatch) return exactMatch.code;
  
  // Try language code match (e.g., 'de' matches 'de-DE')
  const langCode = browserLang.split('-')[0];
  const langMatch = SUPPORTED_LANGUAGES.find(lang => lang.code.startsWith(langCode));
  if (langMatch) return langMatch.code;
  
  // Default to English
  return 'en-US';
};

// Load language from localStorage or detect from browser
const getInitialLanguage = (): LanguageCode => {
  if (typeof window === 'undefined') return 'en-US';
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      // Validate that stored language is still supported
      const isValid = SUPPORTED_LANGUAGES.some(lang => lang.code === stored);
      if (isValid) return stored as LanguageCode;
    }
  } catch (e) {
    console.error('Error loading language preference:', e);
  }
  
  // Fallback to browser language detection
  return detectBrowserLanguage();
};

export function useSpeechLanguage() {
  const [language, setLanguageState] = useState<LanguageCode>(() => getInitialLanguage());

  // Load language on mount
  useEffect(() => {
    const initialLang = getInitialLanguage();
    setLanguageState(initialLang);
  }, []);

  // Save language preference
  const setLanguage = useCallback((lang: LanguageCode) => {
    try {
      localStorage.setItem(STORAGE_KEY, lang);
      setLanguageState(lang);
    } catch (e) {
      console.error('Error saving language preference:', e);
    }
  }, []);

  // Get current language info
  const languageInfo = SUPPORTED_LANGUAGES.find(lang => lang.code === language) || SUPPORTED_LANGUAGES[0];

  return {
    language,
    setLanguage,
    languageInfo,
    supportedLanguages: SUPPORTED_LANGUAGES,
  };
}
