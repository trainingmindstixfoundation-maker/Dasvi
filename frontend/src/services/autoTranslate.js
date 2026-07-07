import { csvTranslations } from './csvTranslations';

// In-memory cache for fast repeated translations
const translationCache = {
  hi: {},
  mr: {}
};

/**
 * Automatically translates English text into the target language ('hi' or 'mr')
 * using local technical dictionaries first, followed by free public APIs.
 */
export const autoTranslateText = async (text, targetLang) => {
  if (!text || typeof text !== 'string' || !text.trim()) return '';
  const cleanText = text.trim();

  // 1. Check in-memory cache
  if (translationCache[targetLang]?.[cleanText]) {
    return translationCache[targetLang][cleanText];
  }

  // 2. Check exact match in csvTranslations dictionary
  if (csvTranslations[targetLang] && csvTranslations[targetLang][cleanText]) {
    const res = csvTranslations[targetLang][cleanText];
    translationCache[targetLang][cleanText] = res;
    return res;
  }

  // 3. Check case-insensitive exact match in csvTranslations
  if (csvTranslations[targetLang]) {
    const lower = cleanText.toLowerCase();
    const foundKey = Object.keys(csvTranslations[targetLang]).find(k => k.toLowerCase() === lower);
    if (foundKey) {
      const res = csvTranslations[targetLang][foundKey];
      translationCache[targetLang][cleanText] = res;
      return res;
    }
  }

  // 4. Fallback to free public translation API (MyMemory API first for CORS reliability)
  try {
    const myMemoryUrl = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(cleanText)}&langpair=en|${targetLang}`;
    const response = await fetch(myMemoryUrl);
    if (response.ok) {
      const data = await response.json();
      if (data && data.responseData && data.responseData.translatedText) {
        let translated = data.responseData.translatedText;
        if (!translated.includes("MYMEMORY WARNING") && !translated.includes("QUERY LIMIT")) {
          translationCache[targetLang][cleanText] = translated;
          return translated;
        }
      }
    }
  } catch (err) {
    console.warn(`MyMemory translation failed for ${targetLang}:`, err);
  }

  // 5. Fallback to Google Translate public endpoint
  try {
    const gtUrl = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${targetLang}&dt=t&q=${encodeURIComponent(cleanText)}`;
    const response = await fetch(gtUrl);
    if (response.ok) {
      const data = await response.json();
      if (data && data[0] && Array.isArray(data[0])) {
        const translated = data[0].map(item => item[0]).join('');
        if (translated) {
          translationCache[targetLang][cleanText] = translated;
          return translated;
        }
      }
    }
  } catch (err) {
    console.warn(`Google Translate failed for ${targetLang}:`, err);
  }

  // 6. Word-by-word dictionary fallback
  if (csvTranslations[targetLang]) {
    const words = cleanText.split(' ');
    const translatedWords = words.map(w => {
      const cleanW = w.replace(/[.,/#!$%^&*;:{}=-_`~()]/g, "");
      return csvTranslations[targetLang][cleanW] || csvTranslations[targetLang][w] || w;
    });
    return translatedWords.join(' ');
  }

  return cleanText;
};

/**
 * Translates text into both Marathi and Hindi simultaneously.
 * Returns { mr: string, hi: string }
 */
export const autoTranslateFields = async (text) => {
  if (!text || typeof text !== 'string' || !text.trim()) {
    return { mr: '', hi: '' };
  }
  const [mr, hi] = await Promise.all([
    autoTranslateText(text, 'mr'),
    autoTranslateText(text, 'hi')
  ]);
  return { mr, hi };
};
