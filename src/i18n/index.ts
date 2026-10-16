import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { translations } from '../data/translations';
import { Language } from '../types';

export const SUPPORTED_LANGUAGES: {
  code: Language;
  name: string;
  nativeName: string;
  flag: string;
  dir: 'ltr' | 'rtl';
}[] = [
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇲🇦', dir: 'rtl' },
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇬🇧', dir: 'ltr' },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷', dir: 'ltr' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸', dir: 'ltr' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪', dir: 'ltr' }
];

export const STORAGE_KEY = 'gc_user_lang_preference';

/**
 * Detects visitor's preferred language:
 * 1. Explicit user choice from localStorage
 * 2. Browser languages list (navigator.languages)
 * 3. Primary browser language (navigator.language)
 * 4. Fallback: English ('en')
 */
export function detectVisitorLanguage(): Language {
  // 1. Stored manual preference
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && (['ar', 'en', 'fr', 'es', 'de'] as Language[]).includes(saved as Language)) {
      return saved as Language;
    }
  } catch {
    // LocalStorage unavailable
  }

  // 2. Browser detection
  const navLangs: string[] = [];
  if (typeof navigator !== 'undefined') {
    if (navigator.languages && navigator.languages.length > 0) {
      navLangs.push(...navigator.languages);
    }
    if (navigator.language) {
      navLangs.push(navigator.language);
    }
  }

  for (const rawLang of navLangs) {
    const code = rawLang.toLowerCase().split('-')[0];
    if (code === 'ar') return 'ar';
    if (code === 'fr') return 'fr';
    if (code === 'es') return 'es';
    if (code === 'de') return 'de';
    if (code === 'en') return 'en';
  }

  // Fallback to English
  return 'en';
}

const resources = {
  en: { translation: translations.en },
  fr: { translation: translations.fr },
  ar: { translation: translations.ar },
  es: { translation: translations.es },
  de: { translation: translations.de }
};

const initialLang = detectVisitorLanguage();

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: initialLang,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

/**
 * Synchronizes DOM attributes with the current language
 */
export function applyLanguageToDOM(lang: Language): void {
  const isRTL = lang === 'ar';
  document.documentElement.lang = lang;
  document.documentElement.dir = isRTL ? 'rtl' : 'ltr';

  if (isRTL) {
    document.documentElement.classList.add('rtl');
  } else {
    document.documentElement.classList.remove('rtl');
  }
}

export function setLanguagePreference(lang: Language): void {
  try {
    localStorage.setItem(STORAGE_KEY, lang);
  } catch {
    // Ignore storage errors
  }
  i18n.changeLanguage(lang);
  applyLanguageToDOM(lang);
}

// Initial DOM sync
if (typeof document !== 'undefined') {
  applyLanguageToDOM(initialLang);
}

export default i18n;
