import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { LanguageService, Language, Region } from '../services/languageService';

interface LanguageContextType {
  currentLanguage: string;
  currentRegion: string;
  setLanguage: (languageCode: string) => void;
  setRegion: (regionCode: string) => void;
  getLanguage: (code: string) => Language | undefined;
  getRegion: (code: string) => Region | undefined;
  getSupportedLanguages: () => Language[];
  getAllRegions: () => Region[];
  getRegionsByLanguage: (languageCode: string) => Region[];
  translate: (key: string, language?: string) => string;
  isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState<string>('en');
  const [currentRegion, setCurrentRegion] = useState<string>('gangtok');
  const [isRTL, setIsRTL] = useState<boolean>(false);

  // Initialize language service
  useEffect(() => {
    LanguageService.initializeFromStorage();
    LanguageService.initializeGoogleTranslate();
    LanguageService.hideGoogleTranslateWidget();
    
    setCurrentLanguage(LanguageService.getCurrentLanguage());
    setCurrentRegion(LanguageService.getCurrentRegion());
    
    const language = LanguageService.getLanguageByCode(LanguageService.getCurrentLanguage());
    setIsRTL(language?.isRTL || false);
  }, []);

  const setLanguage = (languageCode: string) => {
    LanguageService.setLanguage(languageCode);
    setCurrentLanguage(languageCode);
    
    const language = LanguageService.getLanguageByCode(languageCode);
    setIsRTL(language?.isRTL || false);
    
    // Update document direction
    document.documentElement.dir = language?.isRTL ? 'rtl' : 'ltr';
    document.documentElement.lang = languageCode;
  };

  const setRegion = (regionCode: string) => {
    LanguageService.setRegion(regionCode);
    setCurrentRegion(regionCode);
  };

  const getLanguage = (code: string): Language | undefined => {
    return LanguageService.getLanguageByCode(code);
  };

  const getRegion = (code: string): Region | undefined => {
    return LanguageService.getRegionByCode(code);
  };

  const getSupportedLanguages = (): Language[] => {
    return LanguageService.getSupportedLanguages();
  };

  const getAllRegions = (): Region[] => {
    return LanguageService.getAllRegions();
  };

  const getRegionsByLanguage = (languageCode: string): Region[] => {
    return LanguageService.getRegionsByLanguage(languageCode);
  };

  const translate = (key: string, language?: string): string => {
    return LanguageService.getTranslatedContent(key, language || currentLanguage);
  };

  const value: LanguageContextType = {
    currentLanguage,
    currentRegion,
    setLanguage,
    setRegion,
    getLanguage,
    getRegion,
    getSupportedLanguages,
    getAllRegions,
    getRegionsByLanguage,
    translate,
    isRTL
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};