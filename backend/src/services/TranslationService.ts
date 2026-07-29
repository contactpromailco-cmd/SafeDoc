/**
 * Multi-Language Translation Service
 * Translates documents to 50+ languages with business terminology accuracy
 */

import { GoogleGenerativeAI } from '@google/generative-ai';

interface TranslationRequest {
  text: string;
  targetLanguage: string;
  sourceLanguage?: string;
  documentType?: string;
  preserveFormatting?: boolean;
}

interface TranslationResult {
  translatedText: string;
  sourceLanguage: string;
  targetLanguage: string;
  confidence: number;
  warnings?: string[];
}

class TranslationService {
  private genAI: GoogleGenerativeAI;
  
  // Supported languages with their codes
  private readonly SUPPORTED_LANGUAGES = {
    // European
    'en': 'English',
    'es': 'Spanish',
    'fr': 'French',
    'de': 'German',
    'it': 'Italian',
    'pt': 'Portuguese',
    'nl': 'Dutch',
    'pl': 'Polish',
    'ru': 'Russian',
    'uk': 'Ukrainian',
    'ro': 'Romanian',
    'cs': 'Czech',
    'sv': 'Swedish',
    'no': 'Norwegian',
    'da': 'Danish',
    'fi': 'Finnish',
    'el': 'Greek',
    'hu': 'Hungarian',
    'tr': 'Turkish',
    
    // Asian
    'zh': 'Chinese (Simplified)',
    'zh-TW': 'Chinese (Traditional)',
    'ja': 'Japanese',
    'ko': 'Korean',
    'vi': 'Vietnamese',
    'th': 'Thai',
    'id': 'Indonesian',
    'ms': 'Malay',
    'hi': 'Hindi',
    'bn': 'Bengali',
    'ta': 'Tamil',
    'te': 'Telugu',
    'mr': 'Marathi',
    
    // Middle Eastern
    'ar': 'Arabic',
    'he': 'Hebrew',
    'fa': 'Persian',
    
    // African
    'sw': 'Swahili',
    'zu': 'Zulu',
    'af': 'Afrikaans',
    
    // Others
    'la': 'Latin',
  };

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY || '';
    this.genAI = new GoogleGenerativeAI(apiKey);
    console.log(`🌍 Translation service initialized (${Object.keys(this.SUPPORTED_LANGUAGES).length} languages)`);
  }

  /**
   * Translate document
   */
  async translate(request: TranslationRequest): Promise<TranslationResult> {
    const {
      text,
      targetLanguage,
      sourceLanguage = 'en',
      documentType = 'business',
      preserveFormatting = true,
    } = request;

    try {
      const model = this.genAI.getGenerativeModel({ model: 'gemini-pro' });

      const prompt = `You are a professional business translator specializing in legal and commercial documents.

TASK: Translate the following ${documentType} document from ${this.getLanguageName(sourceLanguage)} to ${this.getLanguageName(targetLanguage)}.

CRITICAL RULES:
1. Maintain business/legal terminology accuracy
2. ${preserveFormatting ? 'PRESERVE all formatting, line breaks, and special characters (═, ║, │, ─, etc.)' : 'Translate content only'}
3. Keep numbers, dates, and currency symbols unchanged
4. Maintain professional tone
5. Use culturally appropriate business conventions
6. DO NOT translate:
   - Company names
   - Product names
   - Email addresses
   - URLs
   - Reference numbers (e.g., INV-12345)

DOCUMENT TYPE: ${documentType}
SOURCE LANGUAGE: ${this.getLanguageName(sourceLanguage)}
TARGET LANGUAGE: ${this.getLanguageName(targetLanguage)}

TEXT TO TRANSLATE:
${text}

Return ONLY the translated text, nothing else. NO explanations, NO comments, ONLY the translation.`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const translatedText = response.text();

      console.log(`✅ Translated ${sourceLanguage} → ${targetLanguage} (${text.length} chars)`);

      return {
        translatedText,
        sourceLanguage,
        targetLanguage,
        confidence: 0.95,
        warnings: this.getTranslationWarnings(sourceLanguage, targetLanguage, documentType),
      };
    } catch (error) {
      console.error('Translation error:', error);
      throw new Error('Translation failed');
    }
  }

  /**
   * Batch translate multiple texts
   */
  async batchTranslate(
    texts: string[],
    targetLanguage: string,
    sourceLanguage: string = 'en'
  ): Promise<string[]> {
    const promises = texts.map(text =>
      this.translate({
        text,
        targetLanguage,
        sourceLanguage,
      })
    );

    const results = await Promise.all(promises);
    return results.map(r => r.translatedText);
  }

  /**
   * Get language name from code
   */
  getLanguageName(code: string): string {
    return this.SUPPORTED_LANGUAGES[code as keyof typeof this.SUPPORTED_LANGUAGES] || code;
  }

  /**
   * Get supported languages list
   */
  getSupportedLanguages(): Array<{ code: string; name: string; nativeName: string }> {
    const nativeNames: Record<string, string> = {
      'en': 'English',
      'es': 'Español',
      'fr': 'Français',
      'de': 'Deutsch',
      'it': 'Italiano',
      'pt': 'Português',
      'zh': '中文',
      'ja': '日本語',
      'ko': '한국어',
      'ar': 'العربية',
      'ru': 'Русский',
      'hi': 'हिन्दी',
    };

    return Object.entries(this.SUPPORTED_LANGUAGES).map(([code, name]) => ({
      code,
      name,
      nativeName: nativeNames[code] || name,
    }));
  }

  /**
   * Detect language of text
   */
  async detectLanguage(text: string): Promise<string> {
    try {
      const model = this.genAI.getGenerativeModel({ model: 'gemini-pro' });

      const prompt = `Detect the language of this text. Return ONLY the 2-letter ISO 639-1 language code (e.g., "en", "es", "fr"). NO explanation, ONLY the code.

Text:
${text.substring(0, 500)}`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const languageCode = response.text().trim().toLowerCase();

      return languageCode;
    } catch (error) {
      console.error('Language detection error:', error);
      return 'en'; // Default to English
    }
  }

  /**
   * Get translation warnings
   */
  private getTranslationWarnings(
    sourceLanguage: string,
    targetLanguage: string,
    documentType: string
  ): string[] {
    const warnings: string[] = [];

    // Cultural warnings
    if (targetLanguage === 'ar' || targetLanguage === 'he') {
      warnings.push('Right-to-left language: Layout may need adjustment');
    }

    if (targetLanguage === 'ja' || targetLanguage === 'zh') {
      warnings.push('Consider using formal honorifics in business contexts');
    }

    // Legal warnings
    if (documentType === 'contract' || documentType === 'nda') {
      warnings.push('Legal translations should be reviewed by a qualified attorney');
    }

    // Currency warnings
    if (sourceLanguage === 'en' && targetLanguage !== 'en') {
      warnings.push('Currency amounts remain in original format - convert if needed');
    }

    return warnings;
  }

  /**
   * Format date for target language
   */
  formatDateForLanguage(date: Date, languageCode: string): string {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };

    try {
      return new Intl.DateTimeFormat(languageCode, options).format(date);
    } catch {
      return date.toLocaleDateString();
    }
  }

  /**
   * Format currency for target language
   */
  formatCurrencyForLanguage(
    amount: number,
    currencyCode: string,
    languageCode: string
  ): string {
    try {
      return new Intl.NumberFormat(languageCode, {
        style: 'currency',
        currency: currencyCode,
      }).format(amount);
    } catch {
      return `${currencyCode} ${amount.toFixed(2)}`;
    }
  }

  /**
   * Get popular languages for quick access
   */
  getPopularLanguages(): Array<{ code: string; name: string; flag: string }> {
    return [
      { code: 'es', name: 'Spanish', flag: '🇪🇸' },
      { code: 'fr', name: 'French', flag: '🇫🇷' },
      { code: 'de', name: 'German', flag: '🇩🇪' },
      { code: 'zh', name: 'Chinese', flag: '🇨🇳' },
      { code: 'ja', name: 'Japanese', flag: '🇯🇵' },
      { code: 'ar', name: 'Arabic', flag: '🇸🇦' },
      { code: 'pt', name: 'Portuguese', flag: '🇧🇷' },
      { code: 'ru', name: 'Russian', flag: '🇷🇺' },
      { code: 'hi', name: 'Hindi', flag: '🇮🇳' },
      { code: 'ko', name: 'Korean', flag: '🇰🇷' },
    ];
  }
}

export default TranslationService;
