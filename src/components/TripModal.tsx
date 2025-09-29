import React, { useState, useEffect } from 'react';
import { X, MapPin, Calendar, Users, Globe, Sparkles, Plus, Search, Filter, Save, Edit3, Trash2, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Trip, TripStop } from '../services/tripStorage';
import { GeocodingService, Location } from '../services/geocoding';
import { OpenTripMapService, Attraction } from '../services/opentripmap';
import { AITripGeneratorService, AIRequest } from '../services/aiTripGenerator';
import TripMap from './TripMap';
import ManualTripForm from './ManualTripForm';
import AITripForm from './AITripForm';
import TripStopsList from './TripStopsList';

interface TripModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingTrip?: Trip | null;
}

type CreationMode = 'manual' | 'ai' | 'view';

const TripModal: React.FC<TripModalProps> = ({ isOpen, onClose, editingTrip }) => {
  const { user } = useAuth();
  const [mode, setMode] = useState<CreationMode>('manual');
  const [isLoading, setIsLoading] = useState(false);
  const [currentTrip, setCurrentTrip] = useState<Partial<Trip>>({
    name: '',
    destination: '',
    description: '',
    startDate: '',
    endDate: '',
    duration: 1,
    stops: [],
    isPublic: false,
    status: 'draft',
    tags: [],
    userId: user?.uid || ''
  });

  // Debug current trip state
  useEffect(() => {
    console.log('Current trip state:', currentTrip);
  }, [currentTrip]);

  // Initialize trip data when editing
  useEffect(() => {
    if (editingTrip) {
      setCurrentTrip(editingTrip);
      setMode('view');
    } else {
      setCurrentTrip({
        name: '',
        destination: '',
        description: '',
        startDate: '',
        endDate: '',
        duration: 1,
        stops: [],
        isPublic: false,
        status: 'draft',
        tags: [],
        userId: user?.uid || ''
      });
      setMode('manual');
    }
  }, [editingTrip, user]);

  const handleSaveTrip = async () => {
    if (!user) {
      console.log('No user found');
      return;
    }

    console.log('Saving trip:', currentTrip);
    setIsLoading(true);
    
    try {
      // Import TripStorageService dynamically to avoid circular imports
      const { TripStorageService } = await import('../services/tripStorage');
      
      if (editingTrip) {
        console.log('Updating existing trip:', editingTrip.id);
        await TripStorageService.updateTrip(editingTrip.id, currentTrip as Trip);
      } else {
        console.log('Creating new trip');
        const tripId = await TripStorageService.createTrip(currentTrip as Omit<Trip, 'id' | 'createdAt' | 'updatedAt'>);
        console.log('Trip created with ID:', tripId);
      }
      
      console.log('Trip saved successfully');
      onClose();
    } catch (error) {
      console.error('Error saving trip:', error);
      alert('Failed to save trip. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteTrip = async () => {
    if (!editingTrip || !confirm('Are you sure you want to delete this trip?')) return;

    setIsLoading(true);
    try {
      const { TripStorageService } = await import('../services/tripStorage');
      await TripStorageService.deleteTrip(editingTrip.id);
      onClose();
    } catch (error) {
      console.error('Error deleting trip:', error);
      alert('Failed to delete trip. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddStop = (stop: Omit<TripStop, 'id'>) => {
    const newStop: TripStop = {
      ...stop,
      id: `stop_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    };
    
    setCurrentTrip(prev => ({
      ...prev,
      stops: [...(prev.stops || []), newStop]
    }));
  };

  const handleUpdateStop = (stopId: string, updates: Partial<TripStop>) => {
    setCurrentTrip(prev => ({
      ...prev,
      stops: prev.stops?.map(stop => 
        stop.id === stopId ? { ...stop, ...updates } : stop
      ) || []
    }));
  };

  const handleRemoveStop = (stopId: string) => {
    setCurrentTrip(prev => ({
      ...prev,
      stops: prev.stops?.filter(stop => stop.id !== stopId) || []
    }));
  };

  const handleTripUpdate = (updates: Partial<Trip>) => {
    setCurrentTrip(prev => ({ ...prev, ...updates }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[15000] flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full h-full max-w-7xl mx-4 my-4 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Globe className="h-6 w-6 text-orange-600" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {editingTrip ? 'Edit Trip' : 'Create New Trip'}
              </h2>
            </div>
            
            {!editingTrip && (
              <div className="flex items-center space-x-2 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
                <button
                  onClick={() => setMode('manual')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    mode === 'manual'
                      ? 'bg-white dark:bg-gray-700 text-orange-600 shadow-sm'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  <Plus className="h-4 w-4 inline mr-2" />
                  Manual
                </button>
                <button
                  onClick={() => setMode('ai')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    mode === 'ai'
                      ? 'bg-white dark:bg-gray-700 text-orange-600 shadow-sm'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  <Sparkles className="h-4 w-4 inline mr-2" />
                  AI Assistant
                </button>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-2">
            {editingTrip && (
              <>
                <button
                  onClick={() => setMode(mode === 'view' ? 'manual' : 'view')}
                  className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  {mode === 'view' ? <Edit3 className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
                <button
                  onClick={handleDeleteTrip}
                  disabled={isLoading}
                  className="p-2 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors disabled:opacity-50"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </>
            )}
            
            <button
              onClick={onClose}
              className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-1 min-h-0">
          {/* Left Panel - Form */}
          <div className="w-1/2 border-r border-gray-200 dark:border-gray-700 overflow-y-auto">
            <div className="p-6">
              {mode === 'manual' && (
                <ManualTripForm
                  trip={currentTrip}
                  onTripUpdate={handleTripUpdate}
                  onAddStop={handleAddStop}
                />
              )}
              
              {mode === 'ai' && (
                <AITripForm
                  trip={currentTrip}
                  onTripUpdate={handleTripUpdate}
                  onTripGenerated={(generatedTrip) => {
                    setCurrentTrip(generatedTrip);
                    setMode('manual'); // Switch to manual mode to allow editing
                  }}
                />
              )}
              
              {mode === 'view' && editingTrip && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      Trip Details
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Trip Name
                        </label>
                        <p className="text-gray-900 dark:text-white">{editingTrip.name}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Destination
                        </label>
                        <p className="text-gray-900 dark:text-white">{editingTrip.destination}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Description
                        </label>
                        <p className="text-gray-900 dark:text-white">{editingTrip.description}</p>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Start Date
                          </label>
                          <p className="text-gray-900 dark:text-white">{editingTrip.startDate}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            End Date
                          </label>
                          <p className="text-gray-900 dark:text-white">{editingTrip.endDate}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Panel - Map and Stops */}
          <div className="w-1/2 flex flex-col min-h-0">
            {/* Map */}
            <div className="h-1/3 min-h-[200px] border-b border-gray-200 dark:border-gray-700">
              <TripMap
                stops={currentTrip.stops || []}
                onStopSelect={(stop) => {
                  // Handle stop selection if needed
                }}
              />
            </div>

            {/* Stops List */}
            <div className="h-2/3 min-h-[400px] overflow-y-auto">
              <TripStopsList
                stops={currentTrip.stops || []}
                onUpdateStop={handleUpdateStop}
                onRemoveStop={handleRemoveStop}
                mode={mode}
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex-shrink-0 flex items-center justify-between p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
              <MapPin className="h-4 w-4" />
              <span>{currentTrip.stops?.length || 0} stops</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
              <Calendar className="h-4 w-4" />
              <span>{currentTrip.duration || 1} days</span>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                // Fill with test data if empty
                if (!currentTrip.name || !currentTrip.destination) {
                  setCurrentTrip(prev => ({
                    ...prev,
                    name: prev.name || 'Test Trip',
                    destination: prev.destination || 'Gangtok, Sikkim'
                  }));
                } else {
                  handleSaveTrip();
                }
              }}
              disabled={isLoading}
              className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              <span>{editingTrip ? 'Update Trip' : 'Save Trip'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TripModal;