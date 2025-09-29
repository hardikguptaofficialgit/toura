import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, MapPin, Star, Phone, Globe, Filter, Grid, List, Map, 
  Heart, Share2, Camera, ChevronDown,
  Utensils, Hotel, Mountain, TreePine, Coffee, Shield,
  BookOpen, Award, Users, Calendar, Route, Eye
} from 'lucide-react';
import ModalCloseButton from './ModalCloseButton';
// Theme removed; default to light mode
// import { useLanguage } from '../contexts/LanguageContext';
import type { Place, SearchResult, SearchFilters } from '../services/api';
import { MonasteryService, MonasteryHeritage } from '../services/monasteryData';
import MonasteryDetailsModal from './MonasteryDetailsModal';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  searchResult: SearchResult | null;
  isLoading: boolean;
  onFilterChange: (filters: SearchFilters) => void;
  onPlaceSelect: (place: Place) => void;
  onMapToggle: () => void;
  showMap: boolean;
}

const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  searchResult,
  isLoading,
  onFilterChange,
  onPlaceSelect,
  onMapToggle,
  showMap
}) => {
  const isDarkMode = false;
  // Language still available, but translation not used here currently
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({});
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [selectedMonastery, setSelectedMonastery] = useState<MonasteryHeritage | null>(null);
  const [showMonasteryDetails, setShowMonasteryDetails] = useState(false);

  // Debounce notifying parent when filters change to avoid rapid re-renders/searches
  useEffect(() => {
    if (!searchResult) return;
    const handle = setTimeout(() => {
      onFilterChange(filters);
    }, 300);
    return () => clearTimeout(handle);
  }, [filters, searchResult, onFilterChange]);

  const handleFilterChange = (newFilters: Partial<SearchFilters>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
  };

  const toggleFavorite = (placeId: string) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(placeId)) {
      newFavorites.delete(placeId);
    } else {
      newFavorites.add(placeId);
    }
    setFavorites(newFavorites);
  };

  const isMonastery = (place: Place): boolean => {
    return place.category === 'monasteries' || 
           place.name.toLowerCase().includes('monastery') ||
           place.name.toLowerCase().includes('gompa') ||
           place.name.toLowerCase().includes('temple');
  };

  const getMonasteryDetails = (place: Place): MonasteryHeritage | null => {
    if (!isMonastery(place)) return null;
    
    const monastery = MonasteryService.searchMonasteries(place.name).find((m: MonasteryHeritage) => 
      m.name.toLowerCase().includes(place.name.toLowerCase()) ||
      place.name.toLowerCase().includes(m.name.toLowerCase())
    );
    
    return monastery || null;
  };

  const handleMonasteryClick = (place: Place) => {
    const monastery = getMonasteryDetails(place);
    if (monastery) {
      setSelectedMonastery(monastery);
      setShowMonasteryDetails(true);
    } else {
      onPlaceSelect(place);
    }
  };

  const getCategoryIcon = (category: string) => {
    const iconMap: Record<string, any> = {
      hotels: Hotel,
      restaurants: Utensils,
      attractions: Mountain,
      monasteries: TreePine,
      local_cuisine: Coffee,
      nightlife: Star,
      essentials: Shield,
      hidden_gems: Camera,
      outdoors: Mountain,
      family_friendly: Heart
    };
    return iconMap[category] || MapPin;
  };

  const getPriceDisplay = (priceLevel?: number) => {
    if (!priceLevel) return null;
    return '₹'.repeat(priceLevel);
  };

  const renderRating = (rating?: number) => {
    if (!rating) return null;
    
    return (
      <div className="flex items-center space-x-1">
        <div className="flex">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={`h-4 w-4 ${
                star <= rating
                  ? 'text-yellow-400 fill-current'
                  : 'text-gray-300'
              }`}
            />
          ))}
        </div>
        <span className="text-sm font-medium">{rating.toFixed(1)}</span>
      </div>
    );
  };

  const FilterPanel = () => (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: 'auto', opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      className={`border-b p-4 ${isDarkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50'}`}
    >
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            Minimum Rating
          </label>
          <select
            value={filters.rating || ''}
            onChange={(e) => handleFilterChange({ rating: e.target.value ? parseFloat(e.target.value) : undefined })}
            className={`w-full p-2 rounded border ${
              isDarkMode 
                ? 'bg-gray-700 border-gray-600 text-white' 
                : 'bg-white border-gray-300 text-gray-900'
            }`}
          >
            <option value="">Any Rating</option>
            <option value="4.5">4.5+ Stars</option>
            <option value="4.0">4.0+ Stars</option>
            <option value="3.5">3.5+ Stars</option>
            <option value="3.0">3.0+ Stars</option>
          </select>
        </div>

        <div>
          <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            Price Range
          </label>
          <select
            value={filters.priceLevel?.join(',') || ''}
            onChange={(e) => handleFilterChange({ 
              priceLevel: e.target.value ? e.target.value.split(',').map(Number) : undefined 
            })}
            className={`w-full p-2 rounded border ${
              isDarkMode 
                ? 'bg-gray-700 border-gray-600 text-white' 
                : 'bg-white border-gray-300 text-gray-900'
            }`}
          >
            <option value="">Any Price</option>
            <option value="1">₹ - Budget</option>
            <option value="2">₹₹ - Moderate</option>
            <option value="3">₹₹₹ - Expensive</option>
            <option value="4">₹₹₹₹ - Luxury</option>
          </select>
        </div>

        <div>
          <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            Sort By
          </label>
          <select
            value={filters.sortBy || 'relevance'}
            onChange={(e) => handleFilterChange({ sortBy: e.target.value as SearchFilters['sortBy'] })}
            className={`w-full p-2 rounded border ${
              isDarkMode 
                ? 'bg-gray-700 border-gray-600 text-white' 
                : 'bg-white border-gray-300 text-gray-900'
            }`}
          >
            <option value="relevance">Relevance</option>
            <option value="rating">Highest Rated</option>
            <option value="distance">Distance</option>
            <option value="price">Price</option>
          </select>
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="openNow"
            checked={filters.openNow || false}
            onChange={(e) => handleFilterChange({ openNow: e.target.checked })}
            className="rounded border-gray-300"
          />
          <label htmlFor="openNow" className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            Open Now
          </label>
        </div>
      </div>
    </motion.div>
  );

  const PlaceCard = ({ place, index }: { place: Place; index: number }) => {
    const CategoryIcon = getCategoryIcon(place.category);
    const monastery = getMonasteryDetails(place);
    const isMonasteryPlace = isMonastery(place);
    
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
        className={`rounded-lg border overflow-hidden transition-all duration-300 hover:shadow-lg cursor-pointer ${
          isDarkMode 
            ? 'bg-gray-800 border-gray-700 hover:border-gray-600' 
            : 'bg-white border-gray-200 hover:border-gray-300'
        } ${isMonasteryPlace ? 'ring-2 ring-orange-200' : ''}`}
        onClick={() => isMonasteryPlace ? handleMonasteryClick(place) : onPlaceSelect(place)}
      >
        <div className="relative h-48 overflow-hidden">
          <img
            src={place.image || '/api/placeholder/400/200'}
            alt={place.name}
            className="w-full h-full object-cover transition-transform duration-500"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/api/placeholder/400/200';
            }}
          />
          
          <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-sm text-white px-2 py-1 rounded text-xs font-medium flex items-center space-x-1">
            <CategoryIcon className="h-3 w-3" />
            <span className="capitalize">{place.category.replace('_', ' ')}</span>
          </div>

          {isMonasteryPlace && monastery && (
            <div className="absolute top-3 right-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white px-2 py-1 rounded text-xs font-medium flex items-center space-x-1">
              <Award className="h-3 w-3" />
              <span>{monastery.heritageStatus}</span>
            </div>
          )}

          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleFavorite(place.id);
            }}
            className="absolute top-3 right-3 p-2 bg-black/50 backdrop-blur-sm rounded-full transition-colors hover:bg-black/70"
          >
            <Heart 
              className={`h-4 w-4 ${
                favorites.has(place.id) 
                  ? 'text-red-500 fill-current' 
                  : 'text-white'
              }`} 
            />
          </button>

          {place.priceLevel && (
            <div className="absolute bottom-3 left-3 bg-orange-500 text-white px-2 py-1 rounded text-sm font-medium">
              {getPriceDisplay(place.priceLevel)}
            </div>
          )}
        </div>

        <div className="p-4">
          <div className="flex items-start justify-between mb-2">
            <h3 className={`font-semibold text-lg line-clamp-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              {place.name}
            </h3>
            <button
              onClick={(e) => {
                e.stopPropagation();
              }}
              className={`p-1 rounded hover:bg-gray-100 ${isDarkMode ? 'hover:bg-gray-700' : ''}`}
            >
              <Share2 className="h-4 w-4" />
            </button>
          </div>

          {place.rating && (
            <div className="mb-2">
              {renderRating(place.rating)}
              {place.reviews && (
                <span className={`text-sm ml-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  ({place.reviews} reviews)
                </span>
              )}
            </div>
          )}

          <div className={`flex items-center text-sm mb-3 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
            <span className="line-clamp-1">{place.address}</span>
          </div>

          <p className={`text-sm mb-3 line-clamp-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            {place.description}
          </p>

          {isMonasteryPlace && monastery && (
            <div className="mb-3 space-y-2">
              <div className="flex items-center space-x-4 text-xs text-gray-600">
                <div className="flex items-center">
                  <Users className="h-3 w-3 mr-1" />
                  <span>{monastery.monkCount} monks</span>
                </div>
                <div className="flex items-center">
                  <BookOpen className="h-3 w-3 mr-1" />
                  <span>{monastery.manuscripts.length} manuscripts</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="h-3 w-3 mr-1" />
                  <span>{monastery.festivals.length} festivals</span>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded">
                  {monastery.lineage}
                </span>
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                  {monastery.architecturalStyle}
                </span>
              </div>
            </div>
          )}

          {place.features.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {place.features.slice(0, 3).map((feature, idx) => (
                <span
                  key={idx}
                  className={`px-2 py-1 rounded-full text-xs ${
                    isDarkMode 
                      ? 'bg-gray-700 text-gray-300' 
                      : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  {feature}
                </span>
              ))}
              {place.features.length > 3 && (
                <span className={`px-2 py-1 rounded-full text-xs ${
                  isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'
                }`}>
                  +{place.features.length - 3} more
                </span>
              )}
            </div>
          )}

          <div className="flex space-x-2">
            {isMonasteryPlace && monastery ? (
              <>
                <button className="flex items-center space-x-1 px-3 py-1 bg-orange-500 text-white rounded text-sm hover:bg-orange-600 transition-colors">
                  <Eye className="h-3 w-3" />
                  <span>Read Details</span>
                </button>
                <button className="flex items-center space-x-1 px-3 py-1 bg-purple-500 text-white rounded text-sm hover:bg-purple-600 transition-colors">
                  <BookOpen className="h-3 w-3" />
                  <span>Manuscripts</span>
                </button>
                <button className="flex items-center space-x-1 px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600 transition-colors">
                  <Route className="h-3 w-3" />
                  <span>Routes</span>
                </button>
              </>
            ) : (
              <>
                {place.contact?.phone && (
                  <button className="flex items-center space-x-1 px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 transition-colors">
                    <Phone className="h-3 w-3" />
                    <span>Call</span>
                  </button>
                )}
                {place.contact?.website && (
                  <button className="flex items-center space-x-1 px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600 transition-colors">
                    <Globe className="h-3 w-3" />
                    <span>Website</span>
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </motion.div>
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[300] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-2xl w-full max-w-7xl h-[95vh] flex flex-col overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-orange-50 to-amber-50">
          <div className="flex items-center space-x-4">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Search className="h-6 w-6 text-orange-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {searchResult?.searchMeta.query || 'Search Results'}
              </h2>
              <p className="text-gray-600">
                {searchResult ? `${searchResult.totalCount} places found` : 'Searching...'}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={onMapToggle}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                showMap
                  ? 'bg-orange-500 text-white'
                  : isDarkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <Map className="h-4 w-4" />
              <span>Map</span>
            </button>
            <ModalCloseButton onClick={onClose} />
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-colors ${
                isDarkMode 
                  ? 'border-gray-600 hover:bg-gray-700 text-white' 
                  : 'border-gray-300 hover:bg-gray-50 text-gray-700'
              } ${showFilters ? 'bg-orange-500 text-white border-orange-500' : ''}`}
            >
              <Filter className="h-4 w-4" />
              <span>Filters</span>
              <ChevronDown className={`h-4 w-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </button>

            <div className="flex border rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 ${
                  viewMode === 'grid'
                    ? 'bg-orange-500 text-white'
                    : isDarkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <Grid className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 ${
                  viewMode === 'list'
                    ? 'bg-orange-500 text-white'
                    : isDarkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Filters */}
        <AnimatePresence>
          {showFilters && <FilterPanel />}
        </AnimatePresence>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="h-8 w-8 border-2 border-orange-500 border-t-transparent rounded-full mx-auto mb-4"
                />
                <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                  Searching...
                </p>
              </div>
            </div>
          ) : !searchResult || searchResult.places.length === 0 ? (
            <div className="text-center py-12">
              <MapPin className={`h-16 w-16 mx-auto mb-4 ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`} />
              <h3 className={`text-xl font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                No places found
              </h3>
              <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                Try adjusting your search criteria or explore different categories.
              </p>
            </div>
          ) : (
            <div className={`grid gap-4 ${
              viewMode === 'grid' 
                ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
                : 'grid-cols-1'
            }`}>
              {searchResult.places.map((place, index) => (
                <PlaceCard key={place.id} place={place} index={index} />
              ))}
            </div>
          )}

          {searchResult?.hasMore && (
            <div className="text-center mt-8">
              <button className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors">
                Load More Places
              </button>
            </div>
          )}
        </div>
      </motion.div>

      {/* Monastery Details Modal */}
      {selectedMonastery && (
        <MonasteryDetailsModal
          monastery={selectedMonastery}
          isOpen={showMonasteryDetails}
          onClose={() => {
            setShowMonasteryDetails(false);
            setSelectedMonastery(null);
          }}
        />
      )}
    </div>
  );
};

export default SearchModal;