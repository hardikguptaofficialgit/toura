import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Search, Calendar, MapPin, Eye, Edit3, Trash2, Copy, Globe, X, RefreshCw } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Trip, TripStorageService } from '../services/tripStorage';
import TripModal from './TripModal';

interface TripManagementProps {
  isOpen: boolean;
  onClose: () => void;
}

const TripManagement: React.FC<TripManagementProps> = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const [trips, setTrips] = useState<Trip[]>([]);
  const [filteredTrips, setFilteredTrips] = useState<Trip[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
  const [showTripModal, setShowTripModal] = useState(false);
  const [editingTrip, setEditingTrip] = useState<Trip | null>(null);

  // Memoize the loadTrips function to prevent infinite loop
  const loadTrips = useCallback(async () => {
    if (!user) return; // Exit if no user is available

    setIsLoading(true);
    try {
      const userTrips = await TripStorageService.getUserTrips(user.uid);
      setTrips(userTrips);
    } catch (error) {
      console.error('Error loading trips:', error);
    } finally {
      setIsLoading(false);
    }
  }, [user]); // Only depend on user, not isLoading

  // Load user trips on component mount or when modal opens
  useEffect(() => {
    if (user && isOpen) {
      // Always initialize sample trips for demo purposes
      TripStorageService.forceInitializeSampleTrips(user.uid);
      loadTrips();
    }
  }, [user, isOpen]); // Removed loadTrips from dependencies to prevent infinite loop

  // Filter trips based on search and status
  useEffect(() => {
    let filtered = trips;

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(trip =>
        trip.name.toLowerCase().includes(query) ||
        trip.destination.toLowerCase().includes(query) ||
        trip.description.toLowerCase().includes(query) ||
        trip.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(trip => trip.status === statusFilter);
    }

    setFilteredTrips(filtered);
  }, [trips, searchQuery, statusFilter]);

  const handleCreateTrip = () => {
    setEditingTrip(null);
    setShowTripModal(true);
  };

  const handleEditTrip = (trip: Trip) => {
    setEditingTrip(trip);
    setShowTripModal(true);
  };

  const handleViewTrip = (trip: Trip) => {
    setSelectedTrip(trip);
    setShowTripModal(true);
  };

  const handleDeleteTrip = async (trip: Trip) => {
    if (!confirm(`Are you sure you want to delete "${trip.name}"?`)) return;

    try {
      await TripStorageService.deleteTrip(trip.id);
      await loadTrips();
    } catch (error) {
      console.error('Error deleting trip:', error);
      alert('Failed to delete trip. Please try again.');
    }
  };

  const handleDuplicateTrip = async (trip: Trip) => {
    if (!user) return;

    try {
      await TripStorageService.duplicateTrip(trip.id, user.uid);
      await loadTrips();
    } catch (error) {
      console.error('Error duplicating trip:', error);
      alert('Failed to duplicate trip. Please try again.');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600';
      case 'planned':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-300 border border-orange-200 dark:border-orange-700';
      case 'in_progress':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300 border border-yellow-200 dark:border-yellow-700';
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300 border border-green-200 dark:border-green-700';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600';
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleDateString();
  };

  // Reset loading state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setIsLoading(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[15000] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-6xl max-h-[90vh] bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 md:p-6 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Globe className="h-6 w-6 text-orange-600" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                My Trips
              </h2>
            </div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {trips.length} trips
            </span>
          </div>

          <div className="flex items-center space-x-2 md:space-x-3">
            <button
              onClick={async () => {
                if (user) {
                  TripStorageService.resetToSampleTrips(user.uid);
                  await loadTrips();
                }
              }}
              className="flex items-center space-x-1 md:space-x-2 px-2 md:px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-xs md:text-sm"
              title="Reset to sample trips"
            >
              <RefreshCw className="h-3 w-3 md:h-4 md:w-4" />
              <span className="hidden sm:inline">Reset</span>
            </button>
            <button
              onClick={handleCreateTrip}
              className="flex items-center space-x-1 md:space-x-2 px-3 md:px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-xs md:text-sm"
            >
              <Plus className="h-3 w-3 md:h-4 md:w-4" />
              <span className="hidden sm:inline">New Trip</span>
              <span className="sm:hidden">New</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              <X className="h-5 w-5 md:h-6 md:w-6" />
            </button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="p-4 md:p-6 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search trips..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-gray-800 dark:text-white sm:w-auto w-full"
            >
              <option value="all">All Status</option>
              <option value="draft">Draft</option>
              <option value="planned">Planned</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 min-h-0 custom-scrollbar">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-8 h-8 border-2 border-orange-600 border-t-transparent rounded-full animate-spin" />
              <span className="ml-3 text-gray-600 dark:text-gray-400">Loading trips...</span>
            </div>
          ) : filteredTrips.length === 0 ? (
            <div className="text-center py-12">
              <Globe className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                {trips.length === 0 ? 'No trips yet' : 'No trips match your search'}
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6">
                {trips.length === 0 
                  ? 'Create your first trip to get started with planning your adventures.'
                  : 'Try adjusting your search or filter criteria.'
                }
              </p>
              {trips.length === 0 && (
                <button
                  onClick={handleCreateTrip}
                  className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                >
                  Create Your First Trip
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
              {filteredTrips.map((trip) => (
                <div
                  key={trip.id}
                  className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 md:p-6 hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer group relative overflow-hidden hover:border-orange-300 dark:hover:border-orange-600"
                >
                  {/* Gradient Background Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-orange-50/50 to-orange-100/30 dark:from-orange-900/20 dark:to-orange-800/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  {/* Trip Header */}
                  <div className="flex items-start justify-between mb-4 relative z-10">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors duration-300">
                        {trip.name}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
                        <MapPin className="h-3 w-3 mr-1 text-orange-500" />
                        {trip.destination}
                      </p>
                    </div>
                    <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(trip.status)} shadow-sm`}>
                      {trip.status.replace('_', ' ')}
                    </span>
                  </div>

                  {/* Trip Description */}
                  <p className="text-sm text-gray-700 dark:text-gray-300 mb-4 line-clamp-2 relative z-10">
                    {trip.description}
                  </p>

                  {/* Trip Stats */}
                  <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400 mb-4 relative z-10">
                    <div className="flex items-center space-x-1 bg-orange-50 dark:bg-orange-900/30 px-2 py-1 rounded-full">
                      <MapPin className="h-3 w-3 text-orange-500" />
                      <span className="font-medium">{trip.stops.length} stops</span>
                    </div>
                    <div className="flex items-center space-x-1 bg-orange-50 dark:bg-orange-900/30 px-2 py-1 rounded-full">
                      <Calendar className="h-3 w-3 text-orange-500" />
                      <span className="font-medium">{trip.duration} days</span>
                    </div>
                    <div className="flex items-center space-x-1 bg-blue-50 dark:bg-blue-900/30 px-2 py-1 rounded-full">
                      <Calendar className="h-3 w-3 text-blue-500" />
                      <span className="font-medium">{formatDate(trip.startDate)}</span>
                    </div>
                  </div>

                  {/* Tags */}
                  {trip.tags && trip.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4 relative z-10">
                      {trip.tags.slice(0, 3).map((tag, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-gradient-to-r from-orange-100 to-orange-200 dark:from-orange-900/50 dark:to-orange-800/50 text-orange-800 dark:text-orange-200 text-xs font-medium rounded-full border border-orange-200 dark:border-orange-700"
                        >
                          {tag}
                        </span>
                      ))}
                      {trip.tags.length > 3 && (
                        <span className="px-3 py-1 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 text-gray-600 dark:text-gray-400 text-xs font-medium rounded-full border border-gray-200 dark:border-gray-600">
                          +{trip.tags.length - 3}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center justify-between relative z-10">
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => handleViewTrip(trip)}
                        className="p-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-200 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg"
                        title="View trip"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleEditTrip(trip)}
                        className="p-2 text-gray-400 hover:text-orange-600 dark:hover:text-orange-400 transition-all duration-200 hover:bg-orange-50 dark:hover:bg-orange-900/30 rounded-lg"
                        title="Edit trip"
                      >
                        <Edit3 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDuplicateTrip(trip)}
                        className="p-2 text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-all duration-200 hover:bg-green-50 dark:hover:bg-green-900/30 rounded-lg"
                        title="Duplicate trip"
                      >
                        <Copy className="h-4 w-4" />
                      </button>
                    </div>
                    <button
                      onClick={() => handleDeleteTrip(trip)}
                      className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-all duration-200 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg"
                      title="Delete trip"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Trip Modal */}
      <TripModal
        isOpen={showTripModal}
        onClose={() => {
          setShowTripModal(false);
          setEditingTrip(null);
          setSelectedTrip(null);
          loadTrips(); // Reload trips after modal closes
        }}
        editingTrip={editingTrip || selectedTrip}
      />
    </div>
  );
};

export default TripManagement;