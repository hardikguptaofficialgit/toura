// Trip storage service for managing user trips using localStorage

export interface TripStop {
  id: string;
  name: string;
  type: 'attraction' | 'restaurant' | 'hotel' | 'activity';
  description: string;
  location: {
    name: string;
    lat?: number;
    lon?: number;
    address?: string;
  };
  estimatedDuration: string;
  category: string;
  importance: 'high' | 'medium' | 'low';
  rating?: number;
  price?: string;
  openingHours?: string;
  website?: string;
  phone?: string;
  notes?: string;
}

export interface Trip {
  id: string;
  name: string;
  destination: string;
  description: string;
  startDate: string;
  endDate: string;
  duration: number;
  stops: TripStop[];
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
  userId: string;
  tags: string[];
  coverImage?: string;
  totalEstimatedCost?: number;
  status: 'draft' | 'planned' | 'in_progress' | 'completed';
}

export interface TripFilter {
  status?: string;
  destination?: string;
  dateRange?: {
    start: string;
    end: string;
  };
  tags?: string[];
}

export class TripStorageService {
  private static readonly STORAGE_KEY = 'toura_trips';

  // Get all trips from localStorage
  private static getTripsFromStorage(): Trip[] {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error reading trips from storage:', error);
      return [];
    }
  }

  // Save trips to localStorage
  private static saveTripsToStorage(trips: Trip[]): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(trips));
    } catch (error) {
      console.error('Error saving trips to storage:', error);
      throw new Error('Failed to save trips');
    }
  }

  // Create a new trip
  static async createTrip(trip: Omit<Trip, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const now = new Date().toISOString();
      const tripId = `trip_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      const tripData: Trip = {
        ...trip,
        id: tripId,
        createdAt: now,
        updatedAt: now
      };

      const trips = this.getTripsFromStorage();
      trips.push(tripData);
      this.saveTripsToStorage(trips);
      
      return tripId;
    } catch (error) {
      console.error('Error creating trip:', error);
      throw new Error('Failed to create trip');
    }
  }

  // Update an existing trip
  static async updateTrip(tripId: string, updates: Partial<Trip>): Promise<void> {
    try {
      const trips = this.getTripsFromStorage();
      const tripIndex = trips.findIndex(trip => trip.id === tripId);
      
      if (tripIndex === -1) {
        throw new Error('Trip not found');
      }

      trips[tripIndex] = {
        ...trips[tripIndex],
        ...updates,
        updatedAt: new Date().toISOString()
      };

      this.saveTripsToStorage(trips);
    } catch (error) {
      console.error('Error updating trip:', error);
      throw new Error('Failed to update trip');
    }
  }

  // Delete a trip
  static async deleteTrip(tripId: string): Promise<void> {
    try {
      const trips = this.getTripsFromStorage();
      const filteredTrips = trips.filter(trip => trip.id !== tripId);
      
      if (filteredTrips.length === trips.length) {
        throw new Error('Trip not found');
      }

      this.saveTripsToStorage(filteredTrips);
    } catch (error) {
      console.error('Error deleting trip:', error);
      throw new Error('Failed to delete trip');
    }
  }

  // Get all trips for a user
  static async getUserTrips(userId: string, filter?: TripFilter): Promise<Trip[]> {
    try {
      const allTrips = this.getTripsFromStorage();
      let trips = allTrips.filter(trip => trip.userId === userId);
      
      // Sort by updatedAt descending
      trips.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

      // Apply additional filters
      if (filter) {
        trips = this.applyFilters(trips, filter);
      }

      return trips;
    } catch (error) {
      console.error('Error getting user trips:', error);
      throw new Error('Failed to get trips');
    }
  }

  // Get a specific trip by ID
  static async getTrip(tripId: string): Promise<Trip | null> {
    try {
      const trips = this.getTripsFromStorage();
      return trips.find(trip => trip.id === tripId) || null;
    } catch (error) {
      console.error('Error getting trip:', error);
      return null;
    }
  }

  // Get public trips (for discovery)
  static async getPublicTrips(limit: number = 20): Promise<Trip[]> {
    try {
      const allTrips = this.getTripsFromStorage();
      const publicTrips = allTrips
        .filter(trip => trip.isPublic)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, limit);

      return publicTrips;
    } catch (error) {
      console.error('Error getting public trips:', error);
      return [];
    }
  }

  // Search trips by destination or name
  static async searchTrips(userId: string, searchTerm: string): Promise<Trip[]> {
    try {
      const trips = await this.getUserTrips(userId);
      
      const searchLower = searchTerm.toLowerCase();
      return trips.filter(trip => 
        trip.name.toLowerCase().includes(searchLower) ||
        trip.destination.toLowerCase().includes(searchLower) ||
        trip.description.toLowerCase().includes(searchLower) ||
        trip.tags.some(tag => tag.toLowerCase().includes(searchLower))
      );
    } catch (error) {
      console.error('Error searching trips:', error);
      return [];
    }
  }

  // Add a stop to a trip
  static async addStopToTrip(tripId: string, stop: Omit<TripStop, 'id'>): Promise<void> {
    try {
      const trip = await this.getTrip(tripId);
      if (!trip) {
        throw new Error('Trip not found');
      }

      const newStop: TripStop = {
        ...stop,
        id: `stop_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      };

      const updatedStops = [...trip.stops, newStop];
      await this.updateTrip(tripId, { stops: updatedStops });
    } catch (error) {
      console.error('Error adding stop to trip:', error);
      throw new Error('Failed to add stop to trip');
    }
  }

  // Update a stop in a trip
  static async updateStopInTrip(tripId: string, stopId: string, updates: Partial<TripStop>): Promise<void> {
    try {
      const trip = await this.getTrip(tripId);
      if (!trip) {
        throw new Error('Trip not found');
      }

      const updatedStops = trip.stops.map(stop => 
        stop.id === stopId ? { ...stop, ...updates } : stop
      );

      await this.updateTrip(tripId, { stops: updatedStops });
    } catch (error) {
      console.error('Error updating stop in trip:', error);
      throw new Error('Failed to update stop in trip');
    }
  }

  // Remove a stop from a trip
  static async removeStopFromTrip(tripId: string, stopId: string): Promise<void> {
    try {
      const trip = await this.getTrip(tripId);
      if (!trip) {
        throw new Error('Trip not found');
      }

      const updatedStops = trip.stops.filter(stop => stop.id !== stopId);
      await this.updateTrip(tripId, { stops: updatedStops });
    } catch (error) {
      console.error('Error removing stop from trip:', error);
      throw new Error('Failed to remove stop from trip');
    }
  }

  // Duplicate a trip
  static async duplicateTrip(tripId: string, userId: string): Promise<string> {
    try {
      const originalTrip = await this.getTrip(tripId);
      if (!originalTrip) {
        throw new Error('Trip not found');
      }

      const duplicatedTrip: Omit<Trip, 'id' | 'createdAt' | 'updatedAt'> = {
        ...originalTrip,
        name: `${originalTrip.name} (Copy)`,
        userId,
        status: 'draft',
        isPublic: false,
        startDate: '',
        endDate: '',
        stops: originalTrip.stops.map(stop => ({
          ...stop,
          id: `stop_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        }))
      };

      return await this.createTrip(duplicatedTrip);
    } catch (error) {
      console.error('Error duplicating trip:', error);
      throw new Error('Failed to duplicate trip');
    }
  }

  // Initialize with comprehensive sample trips
  static initializeSampleTrips(userId: string): void {
    const existingTrips = this.getTripsFromStorage();
    if (existingTrips.length > 0) return; // Don't add samples if trips already exist

    this.forceInitializeSampleTrips(userId);
  }

  // Force initialize sample trips (always adds sample data)
  static forceInitializeSampleTrips(userId: string): void {
    console.log('Initializing sample trips for user:', userId);
    
    const sampleTrips: Trip[] = [
      {
        id: 'sample_trip_1',
        name: 'Sikkim Spiritual Journey',
        destination: 'Gangtok, Sikkim',
        description: 'A comprehensive 7-day spiritual and cultural journey through Sikkim\'s most sacred monasteries, breathtaking landscapes, and traditional villages.',
        startDate: '2024-03-15',
        endDate: '2024-03-21',
        duration: 7,
        stops: [
          {
            id: 'stop_1',
            name: 'Rumtek Monastery',
            type: 'attraction',
            description: 'The most important monastery in Sikkim, seat of the Karmapa lineage',
            location: { name: 'Rumtek, Sikkim', lat: 27.3389, lon: 88.6065 },
            estimatedDuration: '3 hours',
            category: 'Monastery',
            importance: 'high',
            rating: 4.8,
            openingHours: '6:00 AM - 6:00 PM',
            notes: 'Best visited during morning prayers. Photography restrictions apply.'
          },
          {
            id: 'stop_2',
            name: 'Tsomgo Lake',
            type: 'attraction',
            description: 'Sacred glacial lake at 12,400 ft with stunning mountain reflections',
            location: { name: 'Tsomgo Lake, Sikkim', lat: 27.4, lon: 88.7 },
            estimatedDuration: '4 hours',
            category: 'Lake',
            importance: 'high',
            rating: 4.9,
            notes: 'Requires permit. Best visited in morning for clear views.'
          },
          {
            id: 'stop_3',
            name: 'Enchey Monastery',
            type: 'attraction',
            description: 'Ancient monastery with beautiful murals and peaceful atmosphere',
            location: { name: 'Enchey Monastery, Gangtok', lat: 27.33, lon: 88.61 },
            estimatedDuration: '2 hours',
            category: 'Monastery',
            importance: 'high',
            rating: 4.6,
            openingHours: '6:00 AM - 6:00 PM'
          },
          {
            id: 'stop_4',
            name: 'Nathula Pass',
            type: 'attraction',
            description: 'Historic mountain pass connecting India and Tibet',
            location: { name: 'Nathula Pass, Sikkim', lat: 27.5, lon: 88.8 },
            estimatedDuration: '6 hours',
            category: 'Historic Site',
            importance: 'high',
            rating: 4.7,
            notes: 'Requires special permit. Weather dependent.'
          },
          {
            id: 'stop_5',
            name: 'MG Marg',
            type: 'activity',
            description: 'Main shopping and dining street with local handicrafts',
            location: { name: 'MG Marg, Gangtok', lat: 27.33, lon: 88.61 },
            estimatedDuration: '3 hours',
            category: 'Shopping',
            importance: 'medium',
            rating: 4.3,
            openingHours: '10:00 AM - 9:00 PM'
          }
        ],
        isPublic: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        userId,
        tags: ['spiritual', 'monastery', 'mountains', 'culture', 'nature'],
        coverImage: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800',
        totalEstimatedCost: 25000,
        status: 'planned'
      },
      {
        id: 'sample_trip_2',
        name: 'Darjeeling Heritage Trail',
        destination: 'Darjeeling, West Bengal',
        description: 'Explore the Queen of Hills with its colonial heritage, tea gardens, and panoramic mountain views.',
        startDate: '2024-04-10',
        endDate: '2024-04-16',
        duration: 6,
        stops: [
          {
            id: 'stop_6',
            name: 'Tiger Hill',
            type: 'attraction',
            description: 'Famous sunrise viewpoint with Mount Kanchenjunga views',
            location: { name: 'Tiger Hill, Darjeeling', lat: 27.0, lon: 88.3 },
            estimatedDuration: '4 hours',
            category: 'Viewpoint',
            importance: 'high',
            rating: 4.9,
            openingHours: '4:00 AM - 7:00 AM',
            notes: 'Arrive by 4:30 AM for best sunrise views'
          },
          {
            id: 'stop_7',
            name: 'Happy Valley Tea Estate',
            type: 'attraction',
            description: 'Tour a working tea plantation and learn about tea processing',
            location: { name: 'Happy Valley, Darjeeling', lat: 27.0, lon: 88.3 },
            estimatedDuration: '3 hours',
            category: 'Tea Garden',
            importance: 'high',
            rating: 4.7,
            openingHours: '8:00 AM - 5:00 PM',
            website: 'https://happyvalleyteaestate.com'
          },
          {
            id: 'stop_8',
            name: 'Darjeeling Himalayan Railway',
            type: 'activity',
            description: 'UNESCO World Heritage toy train ride through the mountains',
            location: { name: 'Darjeeling Railway Station', lat: 27.04, lon: 88.26 },
            estimatedDuration: '2 hours',
            category: 'Heritage',
            importance: 'high',
            rating: 4.8,
            price: '₹150-300',
            notes: 'Book tickets in advance. Limited seats available.'
          },
          {
            id: 'stop_9',
            name: 'Padmaja Naidu Himalayan Zoological Park',
            type: 'attraction',
            description: 'Conservation center for endangered Himalayan species',
            location: { name: 'Darjeeling Zoo', lat: 27.05, lon: 88.27 },
            estimatedDuration: '3 hours',
            category: 'Wildlife',
            importance: 'medium',
            rating: 4.5,
            openingHours: '8:30 AM - 4:30 PM',
            price: '₹50'
          }
        ],
        isPublic: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        userId,
        tags: ['heritage', 'tea', 'mountains', 'railway', 'wildlife'],
        coverImage: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800',
        totalEstimatedCost: 18000,
        status: 'draft'
      },
      {
        id: 'sample_trip_3',
        name: 'Sikkim Adventure Trek',
        destination: 'North Sikkim',
        description: 'High-altitude trekking adventure through pristine landscapes, remote villages, and breathtaking mountain vistas.',
        startDate: '2024-05-01',
        endDate: '2024-05-08',
        duration: 8,
        stops: [
          {
            id: 'stop_10',
            name: 'Gurudongmar Lake',
            type: 'attraction',
            description: 'Sacred high-altitude lake at 17,800 ft',
            location: { name: 'Gurudongmar Lake, North Sikkim', lat: 28.0, lon: 88.7 },
            estimatedDuration: '8 hours',
            category: 'Lake',
            importance: 'high',
            rating: 4.9,
            notes: 'Requires permit. Acclimatization needed. Weather dependent.'
          },
          {
            id: 'stop_11',
            name: 'Yumthang Valley',
            type: 'attraction',
            description: 'Valley of Flowers with hot springs and rhododendron forests',
            location: { name: 'Yumthang Valley, North Sikkim', lat: 27.8, lon: 88.6 },
            estimatedDuration: '6 hours',
            category: 'Nature',
            importance: 'high',
            rating: 4.8,
            notes: 'Best visited during spring (March-May) for flowers'
          },
          {
            id: 'stop_12',
            name: 'Lachung Village',
            type: 'activity',
            description: 'Traditional Sikkimese village with homestay experience',
            location: { name: 'Lachung, North Sikkim', lat: 27.7, lon: 88.5 },
            estimatedDuration: '2 days',
            category: 'Cultural',
            importance: 'high',
            rating: 4.6,
            notes: 'Experience local culture and cuisine'
          }
        ],
        isPublic: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        userId,
        tags: ['trekking', 'adventure', 'mountains', 'nature', 'culture'],
        coverImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
        totalEstimatedCost: 35000,
        status: 'draft'
      },
      {
        id: 'sample_trip_4',
        name: 'Sikkim Food & Culture Tour',
        destination: 'Gangtok & Surroundings',
        description: 'Culinary journey through Sikkim\'s traditional cuisine, local markets, and cultural experiences.',
        startDate: '2024-06-01',
        endDate: '2024-06-05',
        duration: 5,
        stops: [
          {
            id: 'stop_13',
            name: 'Local Market Tour',
            type: 'activity',
            description: 'Explore Gangtok\'s local markets for traditional ingredients',
            location: { name: 'Lal Bazaar, Gangtok', lat: 27.33, lon: 88.61 },
            estimatedDuration: '3 hours',
            category: 'Cultural',
            importance: 'high',
            rating: 4.4,
            openingHours: '6:00 AM - 8:00 PM'
          },
          {
            id: 'stop_14',
            name: 'Traditional Cooking Class',
            type: 'activity',
            description: 'Learn to cook authentic Sikkimese dishes',
            location: { name: 'Gangtok Cooking School', lat: 27.33, lon: 88.61 },
            estimatedDuration: '4 hours',
            category: 'Culinary',
            importance: 'high',
            rating: 4.7,
            price: '₹2000 per person'
          },
          {
            id: 'stop_15',
            name: 'Rumtek Monastery Cultural Tour',
            type: 'attraction',
            description: 'Deep dive into Buddhist culture and traditions',
            location: { name: 'Rumtek Monastery', lat: 27.3389, lon: 88.6065 },
            estimatedDuration: '3 hours',
            category: 'Cultural',
            importance: 'high',
            rating: 4.8
          }
        ],
        isPublic: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        userId,
        tags: ['food', 'culture', 'cooking', 'local', 'traditional'],
        coverImage: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800',
        totalEstimatedCost: 12000,
        status: 'completed'
      },
      {
        id: 'sample_trip_5',
        name: 'Monastery Circuit Tour',
        destination: 'West Sikkim',
        description: 'Spiritual journey through Sikkim\'s most sacred monasteries and meditation centers.',
        startDate: '2024-07-10',
        endDate: '2024-07-17',
        duration: 7,
        stops: [
          {
            id: 'stop_16',
            name: 'Pemayangtse Monastery',
            type: 'attraction',
            description: 'One of the oldest monasteries in Sikkim with ancient murals',
            location: { name: 'Pemayangtse Monastery, Pelling', lat: 27.3, lon: 88.2 },
            estimatedDuration: '3 hours',
            category: 'Monastery',
            importance: 'high',
            rating: 4.7,
            openingHours: '6:00 AM - 6:00 PM',
            notes: 'Ancient murals and peaceful meditation halls'
          },
          {
            id: 'stop_17',
            name: 'Sangachoeling Monastery',
            type: 'attraction',
            description: 'Historic monastery with panoramic mountain views',
            location: { name: 'Sangachoeling, Pelling', lat: 27.3, lon: 88.2 },
            estimatedDuration: '2 hours',
            category: 'Monastery',
            importance: 'high',
            rating: 4.6,
            notes: 'Steep climb but worth the views'
          },
          {
            id: 'stop_18',
            name: 'Dubdi Monastery',
            type: 'attraction',
            description: 'Oldest monastery in Sikkim with ancient scriptures',
            location: { name: 'Dubdi Monastery, Yuksom', lat: 27.4, lon: 88.2 },
            estimatedDuration: '2 hours',
            category: 'Monastery',
            importance: 'high',
            rating: 4.8,
            notes: 'Requires hiking. Ancient Buddhist texts preserved here'
          },
          {
            id: 'stop_19',
            name: 'Tashiding Monastery',
            type: 'attraction',
            description: 'Sacred monastery with holy chorten',
            location: { name: 'Tashiding, West Sikkim', lat: 27.3, lon: 88.1 },
            estimatedDuration: '2 hours',
            category: 'Monastery',
            importance: 'medium',
            rating: 4.4,
            notes: 'Peaceful location with spiritual significance'
          }
        ],
        isPublic: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        userId,
        tags: ['spiritual', 'monastery', 'meditation', 'ancient', 'peaceful'],
        coverImage: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800',
        totalEstimatedCost: 20000,
        status: 'planned'
      },
      {
        id: 'sample_trip_6',
        name: 'Darjeeling & Sikkim Combo',
        destination: 'Darjeeling & Gangtok',
        description: 'Complete experience combining Darjeeling\'s tea heritage with Sikkim\'s natural beauty.',
        startDate: '2024-08-05',
        endDate: '2024-08-15',
        duration: 10,
        stops: [
          {
            id: 'stop_20',
            name: 'Tiger Hill Sunrise',
            type: 'attraction',
            description: 'Famous sunrise viewpoint with Kanchenjunga views',
            location: { name: 'Tiger Hill, Darjeeling', lat: 27.0, lon: 88.3 },
            estimatedDuration: '4 hours',
            category: 'Viewpoint',
            importance: 'high',
            rating: 4.9,
            openingHours: '4:00 AM - 7:00 AM',
            notes: 'Arrive by 4:30 AM for best views'
          },
          {
            id: 'stop_21',
            name: 'Tea Garden Tour',
            type: 'activity',
            description: 'Comprehensive tea plantation experience',
            location: { name: 'Happy Valley Tea Estate', lat: 27.0, lon: 88.3 },
            estimatedDuration: '3 hours',
            category: 'Tea Garden',
            importance: 'high',
            rating: 4.7,
            openingHours: '8:00 AM - 5:00 PM'
          },
          {
            id: 'stop_22',
            name: 'Rumtek Monastery',
            type: 'attraction',
            description: 'Most important monastery in Sikkim',
            location: { name: 'Rumtek, Gangtok', lat: 27.34, lon: 88.61 },
            estimatedDuration: '3 hours',
            category: 'Monastery',
            importance: 'high',
            rating: 4.8,
            openingHours: '6:00 AM - 6:00 PM'
          },
          {
            id: 'stop_23',
            name: 'Tsomgo Lake',
            type: 'attraction',
            description: 'Sacred glacial lake with mountain reflections',
            location: { name: 'Tsomgo Lake, Sikkim', lat: 27.4, lon: 88.7 },
            estimatedDuration: '4 hours',
            category: 'Lake',
            importance: 'high',
            rating: 4.9,
            notes: 'Requires permit. Best visited in morning'
          }
        ],
        isPublic: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        userId,
        tags: ['combo', 'tea', 'monastery', 'mountains', 'heritage'],
        coverImage: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800',
        totalEstimatedCost: 30000,
        status: 'planned'
      }
    ];

    this.saveTripsToStorage(sampleTrips);
    console.log('Sample trips initialized successfully:', sampleTrips.length, 'trips');
  }

  // Clear all trips and reinitialize with sample data
  static resetToSampleTrips(userId: string): void {
    localStorage.removeItem(this.STORAGE_KEY);
    this.forceInitializeSampleTrips(userId);
  }

  // Apply filters to trips
  private static applyFilters(trips: Trip[], filter: TripFilter): Trip[] {
    let filteredTrips = trips;

    if (filter.status) {
      filteredTrips = filteredTrips.filter(trip => trip.status === filter.status);
    }

    if (filter.destination) {
      const destinationLower = filter.destination.toLowerCase();
      filteredTrips = filteredTrips.filter(trip => 
        trip.destination.toLowerCase().includes(destinationLower)
      );
    }

    if (filter.dateRange) {
      filteredTrips = filteredTrips.filter(trip => {
        const tripStart = new Date(trip.startDate);
        const tripEnd = new Date(trip.endDate);
        const filterStart = new Date(filter.dateRange!.start);
        const filterEnd = new Date(filter.dateRange!.end);

        return tripStart >= filterStart && tripEnd <= filterEnd;
      });
    }

    if (filter.tags && filter.tags.length > 0) {
      filteredTrips = filteredTrips.filter(trip =>
        filter.tags!.some(tag => trip.tags.includes(tag))
      );
    }

    return filteredTrips;
  }

  // Get trip statistics
  static async getTripStats(userId: string): Promise<{
    totalTrips: number;
    completedTrips: number;
    plannedTrips: number;
    totalStops: number;
    favoriteDestinations: string[];
  }> {
    try {
      const trips = await this.getUserTrips(userId);
      
      const stats = {
        totalTrips: trips.length,
        completedTrips: trips.filter(trip => trip.status === 'completed').length,
        plannedTrips: trips.filter(trip => trip.status === 'planned').length,
        totalStops: trips.reduce((sum, trip) => sum + trip.stops.length, 0),
        favoriteDestinations: this.getFavoriteDestinations(trips)
      };

      return stats;
    } catch (error) {
      console.error('Error getting trip stats:', error);
      return {
        totalTrips: 0,
        completedTrips: 0,
        plannedTrips: 0,
        totalStops: 0,
        favoriteDestinations: []
      };
    }
  }

  private static getFavoriteDestinations(trips: Trip[]): string[] {
    const destinationCount: { [key: string]: number } = {};
    
    trips.forEach(trip => {
      destinationCount[trip.destination] = (destinationCount[trip.destination] || 0) + 1;
    });

    return Object.entries(destinationCount)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([destination]) => destination);
  }
}