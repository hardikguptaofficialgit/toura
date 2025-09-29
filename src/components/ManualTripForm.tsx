import React, { useState, useEffect } from 'react';
import { Plus, MapPin, Calendar, FileText, Tag, Search, X } from 'lucide-react';
import { Trip, TripStop } from '../services/tripStorage';
import { GeocodingService, Location } from '../services/geocoding';
import { OpenTripMapService, Attraction } from '../services/opentripmap';

interface ManualTripFormProps {
  trip: Partial<Trip>;
  onTripUpdate: (updates: Partial<Trip>) => void;
  onAddStop: (stop: Omit<TripStop, 'id'>) => void;
}

const ManualTripForm: React.FC<ManualTripFormProps> = ({ trip, onTripUpdate, onAddStop }) => {
  const [showLocationSearch, setShowLocationSearch] = useState(false);
  const [locationQuery, setLocationQuery] = useState('');
  const [locationResults, setLocationResults] = useState<Location[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [newTag, setNewTag] = useState('');

  // Location search
  const handleLocationSearch = async (query: string) => {
    if (query.length < 3) {
      setLocationResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const results = await GeocodingService.searchLocations(query, 5);
      setLocationResults(results);
    } catch (error) {
      console.error('Location search error:', error);
      setLocationResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (locationQuery) {
        handleLocationSearch(locationQuery);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [locationQuery]);

  const handleLocationSelect = (location: Location) => {
    onTripUpdate({ destination: location.display_name });
    setLocationQuery('');
    setLocationResults([]);
    setShowLocationSearch(false);
  };

  const handleAddTag = () => {
    if (newTag.trim() && !trip.tags?.includes(newTag.trim())) {
      onTripUpdate({ tags: [...(trip.tags || []), newTag.trim()] });
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    onTripUpdate({ tags: trip.tags?.filter(tag => tag !== tagToRemove) || [] });
  };

  const handleAddStop = () => {
    // This would open a stop creation modal or form
    // For now, we'll add a placeholder stop
    const newStop: Omit<TripStop, 'id'> = {
      name: 'New Stop',
      type: 'attraction',
      description: 'Add details about this stop',
      location: {
        name: 'Location name'
      },
      estimatedDuration: '1 hour',
      category: 'General',
      importance: 'medium'
    };
    onAddStop(newStop);
  };

  return (
    <div className="space-y-6 pb-6">
      {/* Trip Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Trip Name *
        </label>
        <input
          type="text"
          value={trip.name || ''}
          onChange={(e) => onTripUpdate({ name: e.target.value })}
          placeholder="e.g., Summer vacation in Greece"
          maxLength={80}
          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
        />
        <p className="text-xs text-gray-500 mt-1">
          {(trip.name || '').length}/80 characters
        </p>
      </div>

      {/* Destination */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Destination *
        </label>
        <div className="relative">
          <input
            type="text"
            value={trip.destination || ''}
            onChange={(e) => {
              onTripUpdate({ destination: e.target.value });
              setLocationQuery(e.target.value);
              setShowLocationSearch(true);
            }}
            placeholder="Search for a destination"
            className="w-full px-4 py-3 pl-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
          />
          <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          
          {/* Location Search Results */}
          {showLocationSearch && locationQuery && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
              {isSearching ? (
                <div className="p-4 text-center text-gray-500">
                  <div className="w-4 h-4 border-2 border-orange-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                  Searching...
                </div>
              ) : locationResults.length > 0 ? (
                locationResults.map((location) => (
                  <button
                    key={location.place_id}
                    onClick={() => handleLocationSelect(location)}
                    className="w-full px-4 py-3 text-left hover:bg-gray-100 dark:hover:bg-gray-700 border-b border-gray-200 dark:border-gray-600 last:border-b-0"
                  >
                    <div className="font-medium text-gray-900 dark:text-white">
                      {location.display_name.split(',')[0]}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {location.display_name}
                    </div>
                  </button>
                ))
              ) : (
                <div className="p-4 text-center text-gray-500">
                  No locations found
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Trip Dates */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Start Date
          </label>
          <div className="relative">
            <input
              type="date"
              value={trip.startDate || ''}
              onChange={(e) => onTripUpdate({ startDate: e.target.value })}
              className="w-full px-4 py-3 pl-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
            />
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            End Date
          </label>
          <div className="relative">
            <input
              type="date"
              value={trip.endDate || ''}
              onChange={(e) => onTripUpdate({ endDate: e.target.value })}
              className="w-full px-4 py-3 pl-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
            />
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          </div>
        </div>
      </div>

      {/* Duration */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Duration (days)
        </label>
        <input
          type="number"
          min="1"
          max="365"
          value={trip.duration || 1}
          onChange={(e) => onTripUpdate({ duration: parseInt(e.target.value) || 1 })}
          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
        />
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Description
        </label>
        <textarea
          value={trip.description || ''}
          onChange={(e) => onTripUpdate({ description: e.target.value })}
          placeholder="Brief description of your trip..."
          rows={3}
          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-gray-800 dark:text-white resize-none"
        />
      </div>

      {/* Tags */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Tags
        </label>
        <div className="space-y-3">
          <div className="flex space-x-2">
            <input
              type="text"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              placeholder="Add a tag"
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
              onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
            />
            <button
              onClick={handleAddTag}
              className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
          
          {trip.tags && trip.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {trip.tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200 text-sm rounded-full"
                >
                  <Tag className="h-3 w-3 mr-1" />
                  {tag}
                  <button
                    onClick={() => handleRemoveTag(tag)}
                    className="ml-2 hover:text-orange-600 dark:hover:text-orange-300"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Add Stop Button */}
      <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={handleAddStop}
          className="w-full flex items-center justify-center space-x-2 px-4 py-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-orange-500 hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-colors"
        >
          <Plus className="h-5 w-5 text-gray-400" />
          <span className="text-gray-600 dark:text-gray-400">Add Stop to Itinerary</span>
        </button>
      </div>
    </div>
  );
};

export default ManualTripForm;