import React, { useState } from 'react';
import { MapPin, Clock, Star, Edit3, Trash2, Plus, Filter, Search, Phone, Globe, DollarSign, Calendar } from 'lucide-react';
import { TripStop } from '../services/tripStorage';
import ResizablePanel from './ResizablePanel';

interface TripStopsListProps {
  stops: TripStop[];
  onUpdateStop: (stopId: string, updates: Partial<TripStop>) => void;
  onRemoveStop: (stopId: string) => void;
  mode: 'manual' | 'ai' | 'view';
}

const TripStopsList: React.FC<TripStopsListProps> = ({ 
  stops, 
  onUpdateStop, 
  onRemoveStop, 
  mode 
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterImportance, setFilterImportance] = useState<string>('all');
  const [editingStop, setEditingStop] = useState<string | null>(null);

  const stopTypes = [
    { value: 'all', label: 'All Types' },
    { value: 'attraction', label: 'Attractions' },
    { value: 'restaurant', label: 'Restaurants' },
    { value: 'hotel', label: 'Hotels' },
    { value: 'activity', label: 'Activities' }
  ];

  const importanceLevels = [
    { value: 'all', label: 'All Levels' },
    { value: 'high', label: 'High Priority' },
    { value: 'medium', label: 'Medium Priority' },
    { value: 'low', label: 'Low Priority' }
  ];

  const filteredStops = stops.filter(stop => {
    const matchesSearch = stop.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         stop.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         stop.location.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesType = filterType === 'all' || stop.type === filterType;
    const matchesImportance = filterImportance === 'all' || stop.importance === filterImportance;
    
    return matchesSearch && matchesType && matchesImportance;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'attraction':
        return '🏛️';
      case 'restaurant':
        return '🍽️';
      case 'hotel':
        return '🏨';
      case 'activity':
        return '🎯';
      default:
        return '📍';
    }
  };

  const getImportanceColor = (importance: string) => {
    switch (importance) {
      case 'high':
        return 'text-red-600 bg-red-100 dark:bg-red-900 dark:text-red-300';
      case 'medium':
        return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900 dark:text-yellow-300';
      case 'low':
        return 'text-green-600 bg-green-100 dark:bg-green-900 dark:text-green-300';
      default:
        return 'text-gray-600 bg-gray-100 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const handleStopUpdate = (stopId: string, field: keyof TripStop, value: any) => {
    onUpdateStop(stopId, { [field]: value });
  };

  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Modal Header */}
      <div className="flex-shrink-0 p-3 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-orange-50 to-orange-100 dark:from-gray-800 dark:to-gray-700">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h3 className="text-sm font-bold text-gray-900 dark:text-white">
              Trip Stops
            </h3>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              {filteredStops.length} of {stops.length} stops
            </p>
          </div>
          {mode !== 'view' && (
            <button className="flex items-center space-x-1 px-2 py-1 bg-orange-600 text-white rounded text-xs font-medium">
              <Plus className="h-3 w-3" />
              <span>Add</span>
            </button>
          )}
        </div>

        {/* Search and Filters */}
        <div className="space-y-2">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-3 w-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search stops..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-7 pr-2 py-1.5 border border-gray-300 dark:border-gray-600 rounded focus:ring-1 focus:ring-orange-500 focus:border-transparent dark:bg-gray-800 dark:text-white text-xs"
            />
          </div>

          <div className="flex space-x-2">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="flex-1 px-2 py-1.5 border border-gray-300 dark:border-gray-600 rounded focus:ring-1 focus:ring-orange-500 focus:border-transparent dark:bg-gray-800 dark:text-white text-xs"
            >
              {stopTypes.map(type => (
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </select>
            
            <select
              value={filterImportance}
              onChange={(e) => setFilterImportance(e.target.value)}
              className="flex-1 px-2 py-1.5 border border-gray-300 dark:border-gray-600 rounded focus:ring-1 focus:ring-orange-500 focus:border-transparent dark:bg-gray-800 dark:text-white text-xs"
            >
              {importanceLevels.map(level => (
                <option key={level.value} value={level.value}>{level.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Modal Content - Stops List */}
      <div className="flex-1 overflow-y-auto min-h-0 bg-gray-50 dark:bg-gray-900">
        {filteredStops.length === 0 ? (
          <div className="p-4 text-center">
            <MapPin className="h-8 w-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {stops.length === 0 ? 'No stops added yet' : 'No stops match your filters'}
            </p>
            {mode !== 'view' && stops.length === 0 && (
              <p className="text-xs text-gray-400 mt-1">
                Add stops to build your itinerary
              </p>
            )}
          </div>
        ) : (
          <div className="p-2 space-y-2">
            {filteredStops.map((stop, index) => (
              <div
                key={stop.id}
                className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded p-3 hover:shadow-md transition-all duration-200 hover:border-orange-300 dark:hover:border-orange-600 shadow-sm"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-sm">{getTypeIcon(stop.type)}</span>
                      <div className="flex-1">
                        <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
                          {stop.name}
                        </h4>
                        <span className={`inline-block px-2 py-0.5 text-xs font-medium rounded ${getImportanceColor(stop.importance)}`}>
                          {stop.importance}
                        </span>
                      </div>
                    </div>
                    
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">
                      {stop.description}
                    </p>
                    
                    <div className="flex flex-wrap items-center gap-1 text-xs text-gray-600 dark:text-gray-400 mb-2">
                      <div className="flex items-center space-x-1 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                        <MapPin className="h-3 w-3 text-orange-500" />
                        <span>{stop.location.name}</span>
                      </div>
                      <div className="flex items-center space-x-1 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                        <Clock className="h-3 w-3 text-blue-500" />
                        <span>{stop.estimatedDuration}</span>
                      </div>
                      {stop.rating && (
                        <div className="flex items-center space-x-1 bg-yellow-100 dark:bg-yellow-900/30 px-2 py-1 rounded">
                          <Star className="h-3 w-3 text-yellow-500" />
                          <span>{stop.rating}</span>
                        </div>
                      )}
                      <span className="px-2 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 rounded text-xs">
                        {stop.category}
                      </span>
                    </div>

                    {/* Additional stop details - compact */}
                    {(stop.openingHours || stop.price || stop.phone || stop.website) && (
                      <div className="flex flex-wrap gap-1 text-xs text-gray-500 dark:text-gray-400">
                        {stop.openingHours && (
                          <div className="flex items-center space-x-1 bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded">
                            <Calendar className="h-2.5 w-2.5" />
                            <span>{stop.openingHours}</span>
                          </div>
                        )}
                        {stop.price && (
                          <div className="flex items-center space-x-1 bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded">
                            <DollarSign className="h-2.5 w-2.5" />
                            <span>{stop.price}</span>
                          </div>
                        )}
                        {stop.phone && (
                          <div className="flex items-center space-x-1 bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded">
                            <Phone className="h-2.5 w-2.5" />
                            <span>{stop.phone}</span>
                          </div>
                        )}
                        {stop.website && (
                          <div className="flex items-center space-x-1 bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded">
                            <Globe className="h-2.5 w-2.5" />
                            <a href={stop.website} target="_blank" rel="noopener noreferrer" className="text-orange-500 hover:text-orange-600">
                              Website
                            </a>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Notes section - compact */}
                    {stop.notes && (
                      <div className="mt-1 p-1.5 bg-orange-50 dark:bg-orange-900/20 rounded text-xs text-orange-800 dark:text-orange-200">
                        <strong>Notes:</strong> {stop.notes}
                      </div>
                    )}

                    {/* Editable fields for manual mode */}
                    {mode === 'manual' && editingStop === stop.id && (
                      <div className="mt-3 space-y-2">
                        <input
                          type="text"
                          value={stop.name}
                          onChange={(e) => handleStopUpdate(stop.id, 'name', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded text-sm dark:bg-gray-700 dark:text-white"
                          placeholder="Stop name"
                        />
                        <textarea
                          value={stop.description}
                          onChange={(e) => handleStopUpdate(stop.id, 'description', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded text-sm dark:bg-gray-700 dark:text-white resize-none"
                          placeholder="Description"
                          rows={2}
                        />
                        <div className="flex space-x-2">
                          <select
                            value={stop.type}
                            onChange={(e) => handleStopUpdate(stop.id, 'type', e.target.value)}
                            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded text-sm dark:bg-gray-700 dark:text-white"
                          >
                            <option value="attraction">Attraction</option>
                            <option value="restaurant">Restaurant</option>
                            <option value="hotel">Hotel</option>
                            <option value="activity">Activity</option>
                          </select>
                          <select
                            value={stop.importance}
                            onChange={(e) => handleStopUpdate(stop.id, 'importance', e.target.value)}
                            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded text-sm dark:bg-gray-700 dark:text-white"
                          >
                            <option value="high">High</option>
                            <option value="medium">Medium</option>
                            <option value="low">Low</option>
                          </select>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  {mode !== 'view' && (
                    <div className="flex items-center space-x-1 ml-2">
                      <button
                        onClick={() => setEditingStop(editingStop === stop.id ? null : stop.id)}
                        className="p-1 text-gray-400 hover:text-orange-600 dark:hover:text-orange-400 transition-colors"
                        title="Edit stop"
                      >
                        <Edit3 className="h-3 w-3" />
                      </button>
                      <button
                        onClick={() => onRemoveStop(stop.id)}
                        className="p-1 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                        title="Remove stop"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TripStopsList;