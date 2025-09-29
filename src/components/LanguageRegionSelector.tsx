import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, MapPin, ChevronDown, Check } from 'lucide-react';
import ModalCloseButton from './ModalCloseButton';
import { useLanguage } from '../contexts/LanguageContext';
import { Language, Region } from '../services/languageService';

interface LanguageRegionSelectorProps {
  isOpen: boolean;
  onClose: () => void;
}

const LanguageRegionSelector: React.FC<LanguageRegionSelectorProps> = ({ isOpen, onClose }) => {
  const { 
    currentLanguage, 
    currentRegion, 
    setLanguage, 
    setRegion, 
    getLanguage, 
    getRegion, 
    getSupportedLanguages, 
    getAllRegions,
    getRegionsByLanguage 
  } = useLanguage();

  const [activeTab, setActiveTab] = useState<'language' | 'region'>('language');
  const [searchQuery, setSearchQuery] = useState('');

  const currentLanguageData = getLanguage(currentLanguage);
  const currentRegionData = getRegion(currentRegion);
  const supportedLanguages = getSupportedLanguages();
  const allRegions = getAllRegions();
  const filteredRegions = getRegionsByLanguage(currentLanguage);

  const handleLanguageSelect = (languageCode: string) => {
    setLanguage(languageCode);
    onClose();
  };

  const handleRegionSelect = (regionCode: string) => {
    setRegion(regionCode);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[400] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-orange-50 to-amber-50">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Globe className="h-6 w-6 text-orange-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Language & Region</h2>
              <p className="text-sm text-gray-600">Choose your preferred language and region</p>
            </div>
          </div>
          <ModalCloseButton onClick={onClose} />
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('language')}
            className={`flex-1 flex items-center justify-center space-x-2 px-6 py-4 font-medium transition-colors ${
              activeTab === 'language'
                ? 'text-orange-600 border-b-2 border-orange-600 bg-orange-50'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            <Globe className="h-4 w-4" />
            <span>Language</span>
          </button>
          <button
            onClick={() => setActiveTab('region')}
            className={`flex-1 flex items-center justify-center space-x-2 px-6 py-4 font-medium transition-colors ${
              activeTab === 'region'
                ? 'text-orange-600 border-b-2 border-orange-600 bg-orange-50'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            <MapPin className="h-4 w-4" />
            <span>Region</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 max-h-96 overflow-y-auto">
          {activeTab === 'language' && (
            <div className="space-y-4">
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Select Language</h3>
                <p className="text-sm text-gray-600">Choose your preferred language for the interface</p>
              </div>

              <div className="space-y-2">
                {supportedLanguages.map((language) => (
                  <button
                    key={language.code}
                    onClick={() => handleLanguageSelect(language.code)}
                    className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all duration-200 ${
                      currentLanguage === language.code
                        ? 'border-orange-500 bg-orange-50 shadow-md'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center space-x-4">
                      <span className="text-2xl">{language.flag}</span>
                      <div className="text-left">
                        <p className="font-medium text-gray-900">{language.name}</p>
                        <p className="text-sm text-gray-600">{language.nativeName}</p>
                      </div>
                    </div>
                    {currentLanguage === language.code && (
                      <div className="p-1 bg-orange-500 rounded-full">
                        <Check className="h-4 w-4 text-white" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'region' && (
            <div className="space-y-4">
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Select Region</h3>
                <p className="text-sm text-gray-600">Choose your preferred region in Sikkim</p>
              </div>

              {/* Search */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search regions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
                <MapPin className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
              </div>

              <div className="space-y-2">
                {filteredRegions
                  .filter(region => 
                    region.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    region.nativeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    region.district.toLowerCase().includes(searchQuery.toLowerCase())
                  )
                  .map((region) => (
                    <button
                      key={region.code}
                      onClick={() => handleRegionSelect(region.code)}
                      className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all duration-200 ${
                        currentRegion === region.code
                          ? 'border-orange-500 bg-orange-50 shadow-md'
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center space-x-4">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <MapPin className="h-5 w-5 text-blue-600" />
                        </div>
                        <div className="text-left">
                          <p className="font-medium text-gray-900">{region.name}</p>
                          <p className="text-sm text-gray-600">{region.nativeName}</p>
                          <p className="text-xs text-gray-500">{region.district}</p>
                          <p className="text-xs text-gray-500 mt-1">{region.description}</p>
                        </div>
                      </div>
                      {currentRegion === region.code && (
                        <div className="p-1 bg-orange-500 rounded-full">
                          <Check className="h-4 w-4 text-white" />
                        </div>
                      )}
                    </button>
                  ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              <p>Current: {currentLanguageData?.name} • {currentRegionData?.name}</p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={onClose}
                className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default LanguageRegionSelector;