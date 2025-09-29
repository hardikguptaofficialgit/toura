export interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
  googleTranslateCode: string;
  isRTL: boolean;
}

export interface Region {
  code: string;
  name: string;
  nativeName: string;
  district: string;
  coordinates: { lat: number; lng: number };
  description: string;
  languages: string[]; // Language codes spoken in this region
}

export const supportedLanguages: Language[] = [
  {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    flag: '🇺🇸',
    googleTranslateCode: 'en',
    isRTL: false
  },
  {
    code: 'hi',
    name: 'Hindi',
    nativeName: 'हिन्दी',
    flag: '🇮🇳',
    googleTranslateCode: 'hi',
    isRTL: false
  },
  {
    code: 'ne',
    name: 'Nepali',
    nativeName: 'नेपाली',
    flag: '🇳🇵',
    googleTranslateCode: 'ne',
    isRTL: false
  },
  {
    code: 'bo',
    name: 'Tibetan',
    nativeName: 'བོད་ཡིག',
    flag: '🏔️',
    googleTranslateCode: 'bo',
    isRTL: false
  },
  {
    code: 'lep',
    name: 'Lepcha',
    nativeName: 'ᰛᰩᰵᰛᰧᰵᰶ',
    flag: '🌿',
    googleTranslateCode: 'lep', // Note: Google Translate may not support Lepcha directly
    isRTL: false
  }
];

export const sikkimRegions: Region[] = [
  {
    code: 'gangtok',
    name: 'Gangtok',
    nativeName: 'गंगटोक',
    district: 'East Sikkim',
    coordinates: { lat: 27.3389, lng: 88.6065 },
    description: 'Capital city of Sikkim, known for monasteries and mountain views',
    languages: ['en', 'hi', 'ne', 'bo']
  },
  {
    code: 'pelling',
    name: 'Pelling',
    nativeName: 'पेलिंग',
    district: 'West Sikkim',
    coordinates: { lat: 27.3389, lng: 88.6065 },
    description: 'Scenic hill station with views of Kanchenjunga',
    languages: ['en', 'hi', 'ne', 'bo']
  },
  {
    code: 'namchi',
    name: 'Namchi',
    nativeName: 'नामची',
    district: 'South Sikkim',
    coordinates: { lat: 27.1644, lng: 88.3614 },
    description: 'Cultural center with monasteries and temples',
    languages: ['en', 'hi', 'ne', 'bo', 'lep']
  },
  {
    code: 'lachung',
    name: 'Lachung',
    nativeName: 'लाचुंग',
    district: 'North Sikkim',
    coordinates: { lat: 27.7167, lng: 88.7167 },
    description: 'High altitude village near Tibetan border',
    languages: ['en', 'hi', 'ne', 'bo']
  },
  {
    code: 'yumthang',
    name: 'Yumthang Valley',
    nativeName: 'युमथांग घाटी',
    district: 'North Sikkim',
    coordinates: { lat: 27.7500, lng: 88.7500 },
    description: 'Valley of Flowers, known for rhododendrons',
    languages: ['en', 'hi', 'ne', 'bo']
  },
  {
    code: 'ravangla',
    name: 'Ravangla',
    nativeName: 'रवांगला',
    district: 'South Sikkim',
    coordinates: { lat: 27.3000, lng: 88.3500 },
    description: 'Buddhist pilgrimage site with monasteries',
    languages: ['en', 'hi', 'ne', 'bo', 'lep']
  },
  {
    code: 'zingkari',
    name: 'Zingkari',
    nativeName: 'जिंगकरी',
    district: 'West Sikkim',
    coordinates: { lat: 27.2500, lng: 88.2000 },
    description: 'Traditional Lepcha village',
    languages: ['en', 'hi', 'ne', 'lep']
  },
  {
    code: 'lachung',
    name: 'Lachung',
    nativeName: 'लाचुंग',
    district: 'North Sikkim',
    coordinates: { lat: 27.7167, lng: 88.7167 },
    description: 'Gateway to Yumthang Valley',
    languages: ['en', 'hi', 'ne', 'bo']
  }
];

export class LanguageService {
  private static currentLanguage: string = 'en';
  private static currentRegion: string = 'gangtok';
  private static googleTranslateLoaded: boolean = false;

  // Initialize Google Translate
  static initializeGoogleTranslate(): void {
    if (this.googleTranslateLoaded) return;

    // Create Google Translate script
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    script.async = true;
    document.head.appendChild(script);

    // Define the callback function
    (window as any).googleTranslateElementInit = () => {
      if ((window as any).google && (window as any).google.translate) {
        new (window as any).google.translate.TranslateElement({
          pageLanguage: 'en',
          includedLanguages: 'en,hi,ne,bo,lep',
          layout: (window as any).google.translate.TranslateElement.InlineLayout.SIMPLE,
          autoDisplay: false,
          multilanguagePage: true
        }, 'google_translate_element');
        this.googleTranslateLoaded = true;
      }
    };
  }

  // Set current language
  static setLanguage(languageCode: string): void {
    this.currentLanguage = languageCode;
    localStorage.setItem('toura-language', languageCode);
    
    // Update Google Translate
    if (this.googleTranslateLoaded && (window as any).google && (window as any).google.translate) {
      const selectElement = document.querySelector('.goog-te-combo');
      if (selectElement) {
        (selectElement as HTMLSelectElement).value = languageCode;
        (selectElement as HTMLSelectElement).dispatchEvent(new Event('change'));
      }
    }
  }

  // Get current language
  static getCurrentLanguage(): string {
    return this.currentLanguage;
  }

  // Set current region
  static setRegion(regionCode: string): void {
    this.currentRegion = regionCode;
    localStorage.setItem('toura-region', regionCode);
  }

  // Get current region
  static getCurrentRegion(): string {
    return this.currentRegion;
  }

  // Get language by code
  static getLanguageByCode(code: string): Language | undefined {
    return supportedLanguages.find(lang => lang.code === code);
  }

  // Get region by code
  static getRegionByCode(code: string): Region | undefined {
    return sikkimRegions.find(region => region.code === code);
  }

  // Get all supported languages
  static getSupportedLanguages(): Language[] {
    return supportedLanguages;
  }

  // Get all regions
  static getAllRegions(): Region[] {
    return sikkimRegions;
  }

  // Get regions by language
  static getRegionsByLanguage(languageCode: string): Region[] {
    return sikkimRegions.filter(region => region.languages.includes(languageCode));
  }

  // Initialize from localStorage
  static initializeFromStorage(): void {
    const savedLanguage = localStorage.getItem('toura-language');
    const savedRegion = localStorage.getItem('toura-region');
    
    if (savedLanguage && supportedLanguages.find(lang => lang.code === savedLanguage)) {
      this.currentLanguage = savedLanguage;
    }
    
    if (savedRegion && sikkimRegions.find(region => region.code === savedRegion)) {
      this.currentRegion = savedRegion;
    }
  }

  // Hide Google Translate widget
  static hideGoogleTranslateWidget(): void {
    const style = document.createElement('style');
    style.textContent = `
      .goog-te-banner-frame {
        display: none !important;
      }
      .goog-te-gadget {
        display: none !important;
      }
      .goog-te-combo {
        display: none !important;
      }
      .skiptranslate {
        display: none !important;
      }
      body {
        top: 0 !important;
      }
      #google_translate_element {
        display: none !important;
      }
    `;
    document.head.appendChild(style);
  }

  // Show Google Translate widget (for debugging)
  static showGoogleTranslateWidget(): void {
    const style = document.querySelector('style[data-google-translate]');
    if (style) {
      style.remove();
    }
  }

  // Translate text using Google Translate API
  static async translateText(text: string, targetLanguage: string): Promise<string> {
    try {
      // This would typically use Google Translate API
      // For now, we'll return the original text
      return text;
    } catch (error) {
      console.error('Translation error:', error);
      return text;
    }
  }

  // Get translated content for a specific language
  static getTranslatedContent(key: string, language: string = this.currentLanguage): string {
    const translations: Record<string, Record<string, string>> = {
      'welcome': {
        'en': 'Welcome to Toura',
        'hi': 'तौरा में आपका स्वागत है',
        'ne': 'तौरामा स्वागत छ',
        'bo': 'ཏོ་ར་ལ་བཀྲ་ཤིས་བདེ་ལེགས།',
        'lep': 'तौरा ले स्वागत छ'
      },
      'discover': {
        'en': 'Discover',
        'hi': 'खोजें',
        'ne': 'खोज्नुहोस्',
        'bo': 'རྙེད་པ།',
        'lep': 'खोज'
      },
      'trips': {
        'en': 'Trips',
        'hi': 'यात्राएं',
        'ne': 'यात्राहरू',
        'bo': 'ལམ་ཁ།',
        'lep': 'यात्रा'
      },
      'reviews': {
        'en': 'Reviews',
        'hi': 'समीक्षाएं',
        'ne': 'समीक्षाहरू',
        'bo': 'དཔྱད་ཞིབ།',
        'lep': 'समीक्षा'
      },
      'search_placeholder': {
        'en': 'Search for places, monasteries, restaurants...',
        'hi': 'स्थान, मठ, रेस्तरां खोजें...',
        'ne': 'स्थान, मठ, रेस्टुरेन्ट खोज्नुहोस्...',
        'bo': 'ས་ཆ་དང་དགོན་པ། ཟས་ཁང་། བཙལ་ཞིབ།',
        'lep': 'स्थान, मठ, रेस्टुरेन्ट खोज'
      }
    };

    return translations[key]?.[language] || translations[key]?.['en'] || key;
  }
}