// Enhanced API service for OpenTripMap and Google Places integration
import { intentDetectionService, type IntentResult } from './intentDetection';
import { mapboxService, type MapboxPlace } from './mapboxService';

const OPENTRIPMAP_API_KEY = import.meta.env.VITE_OPENTRIPMAP_API_KEY || 'your_opentripmap_api_key';
const GOOGLE_PLACES_API_KEY = import.meta.env.VITE_GOOGLE_PLACES_API_KEY || 'your_google_places_api_key';

// Enhanced Types
export interface Place {
  id: string;
  name: string;
  category: string;
  subcategory?: string;
  rating?: number;
  reviews?: number;
  price?: string;
  priceLevel?: number;
  image?: string;
  images?: string[];
  address: string;
  distance?: string;
  description: string;
  tags: string[];
  coordinates: { lat: number; lng: number };
  features: string[];
  openingHours?: string[];
  contact?: {
    phone?: string;
    website?: string;
    email?: string;
  };
  photos?: string[];
  bookingUrl?: string;
  nearbyPlaces?: Place[];
  isOpen?: boolean;
  businessStatus?: 'OPERATIONAL' | 'CLOSED_TEMPORARILY' | 'CLOSED_PERMANENTLY';
}

export interface SearchFilters {
  category?: string[];
  subcategory?: string[];
  priceLevel?: number[];
  rating?: number;
  distance?: number;
  openNow?: boolean;
  sortBy?: 'relevance' | 'rating' | 'distance' | 'price';
  limit?: number;
}

export interface SearchResult {
  places: Place[];
  totalCount: number;
  hasMore: boolean;
  nextPageToken?: string;
  searchMeta: {
    query: string;
    category: string;
    location: string;
    filters: SearchFilters;
    intent: IntentResult;
  };
}

export interface OpenTripMapPlace {
  xid: string;
  name: string;
  dist: number;
  rate: number;
  wikidata?: string;
  kinds: string;
  point: {
    lon: number;
    lat: number;
  };
}

export interface OpenTripMapDetails {
  xid: string;
  name: string;
  address: {
    road?: string;
    city?: string;
    state?: string;
    country?: string;
    postcode?: string;
  };
  rate: number;
  kinds: string;
  sources: {
    geometry: string;
    attributes: string[];
  };
  bbox: {
    lon_min: number;
    lon_max: number;
    lat_min: number;
    lat_max: number;
  };
  point: {
    lon: number;
    lat: number;
  };
  image?: string;
  preview?: {
    source: string;
    height: number;
    width: number;
  };
  wikipedia?: string;
  wikipedia_extracts?: {
    title: string;
    text: string;
    html: string;
  };
}

// OpenTripMap API Service
class OpenTripMapService {
  private baseUrl = 'https://api.opentripmap.com/0.1/en/places';

  async searchByRadius(
    lat: number,
    lon: number,
    radius: number = 10000,
    categories?: string,
    limit: number = 20
  ): Promise<OpenTripMapPlace[]> {
    try {
      const params = new URLSearchParams({
        apikey: OPENTRIPMAP_API_KEY,
        radius: radius.toString(),
        lon: lon.toString(),
        lat: lat.toString(),
        limit: limit.toString(),
        format: 'json'
      });

      if (categories) {
        params.append('kinds', categories);
      }

      const response = await fetch(`${this.baseUrl}/radius?${params}`);
      
      if (!response.ok) {
        throw new Error(`OpenTripMap API error: ${response.statusText}`);
      }

      const data = await response.json();
      return data.features || data || [];
    } catch (error) {
      console.error('Error fetching places from OpenTripMap:', error);
      return [];
    }
  }

  async getPlaceDetails(xid: string): Promise<OpenTripMapDetails | null> {
    try {
      const response = await fetch(
        `${this.baseUrl}/xid/${xid}?apikey=${OPENTRIPMAP_API_KEY}`
      );
      
      if (!response.ok) {
        throw new Error(`OpenTripMap API error: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching place details from OpenTripMap:', error);
      return null;
    }
  }

  async searchByBbox(
    lon_min: number,
    lat_min: number,
    lon_max: number,
    lat_max: number,
    categories?: string,
    limit: number = 50
  ): Promise<OpenTripMapPlace[]> {
    try {
      const params = new URLSearchParams({
        apikey: OPENTRIPMAP_API_KEY,
        lon_min: lon_min.toString(),
        lat_min: lat_min.toString(),
        lon_max: lon_max.toString(),
        lat_max: lat_max.toString(),
        limit: limit.toString(),
        format: 'json'
      });

      if (categories) {
        params.append('kinds', categories);
      }

      const response = await fetch(`${this.baseUrl}/bbox?${params}`);
      
      if (!response.ok) {
        throw new Error(`OpenTripMap API error: ${response.statusText}`);
      }

      const data = await response.json();
      return data.features || data || [];
    } catch (error) {
      console.error('Error fetching places by bbox from OpenTripMap:', error);
      return [];
    }
  }
}

// Google Places API Service
class GooglePlacesService {
  private baseUrl = 'https://maps.googleapis.com/maps/api/place';

  async textSearch(
    query: string,
    location?: { lat: number; lng: number },
    radius?: number,
    type?: string
  ): Promise<any[]> {
    try {
      // For now, return empty array to avoid CORS issues
      // In production, this should be handled by a backend proxy
      console.log('Google Places API call disabled due to CORS restrictions');
      return [];
      
      // Original implementation (commented out due to CORS):
      /*
      const params = new URLSearchParams({
        query,
        key: GOOGLE_PLACES_API_KEY
      });

      if (location) {
        params.append('location', `${location.lat},${location.lng}`);
      }

      if (radius) {
        params.append('radius', radius.toString());
      }

      if (type) {
        params.append('type', type);
      }

      const response = await fetch(`${this.baseUrl}/textsearch/json?${params}`);
      
      if (!response.ok) {
        throw new Error(`Google Places API error: ${response.statusText}`);
      }

      const data = await response.json();
      return data.results || [];
      */
    } catch (error) {
      console.error('Error fetching places from Google Places:', error);
      return [];
    }
  }

  async nearbySearch(
    location: { lat: number; lng: number },
    radius: number = 5000,
    type?: string,
    keyword?: string
  ): Promise<any[]> {
    try {
      // For now, return empty array to avoid CORS issues
      // In production, this should be handled by a backend proxy
      console.log('Google Places API call disabled due to CORS restrictions');
      return [];
      
      // Original implementation (commented out due to CORS):
      /*
      const params = new URLSearchParams({
        location: `${location.lat},${location.lng}`,
        radius: radius.toString(),
        key: GOOGLE_PLACES_API_KEY
      });

      if (type) {
        params.append('type', type);
      }

      if (keyword) {
        params.append('keyword', keyword);
      }

      const response = await fetch(`${this.baseUrl}/nearbysearch/json?${params}`);
      
      if (!response.ok) {
        throw new Error(`Google Places API error: ${response.statusText}`);
      }

      const data = await response.json();
      return data.results || [];
      */
    } catch (error) {
      console.error('Error fetching nearby places from Google Places:', error);
      return [];
    }
  }

  async getPlaceDetails(placeId: string): Promise<any | null> {
    try {
      const params = new URLSearchParams({
        place_id: placeId,
        key: GOOGLE_PLACES_API_KEY,
        fields: 'name,rating,reviews,formatted_address,geometry,photos,opening_hours,formatted_phone_number,website,price_level'
      });

      const response = await fetch(`${this.baseUrl}/details/json?${params}`);
      
      if (!response.ok) {
        throw new Error(`Google Places API error: ${response.statusText}`);
      }

      const data = await response.json();
      return data.result || null;
    } catch (error) {
      console.error('Error fetching place details from Google Places:', error);
      return null;
    }
  }

  async getPlacePhotos(photoReference: string, maxWidth: number = 400): Promise<string> {
    return `${this.baseUrl}/photo?maxwidth=${maxWidth}&photo_reference=${photoReference}&key=${GOOGLE_PLACES_API_KEY}`;
  }
}

// Enhanced Search Service with Intent Detection
class SearchService {
  private openTripMap = new OpenTripMapService();
  private googlePlaces = new GooglePlacesService();

  // Sikkim's approximate center coordinates
  private sikkimCenter = { lat: 27.3389, lng: 88.6065 };

  async intelligentSearch(
    query: string,
    filters: SearchFilters = {},
    location?: { lat: number; lng: number }
  ): Promise<SearchResult> {
    // Use intent detection to determine category dynamically
    const intentResult = await intentDetectionService.detectIntent(query);
    
    const searchLocation = location || this.sikkimCenter;
    const category = intentResult.category;
    
    try {
      const places = await this.searchPlacesByCategory(
        query,
        category,
        intentResult,
        filters,
        searchLocation
      );

      return {
        places: this.applyFiltersAndSort(places, filters),
        totalCount: places.length,
        hasMore: places.length >= (filters.limit || 20),
        searchMeta: {
          query,
          category,
          location: intentResult.location || 'Sikkim',
          filters,
          intent: intentResult
        }
      };
    } catch (error) {
      console.error('Error in intelligent search:', error);
      return {
        places: [],
        totalCount: 0,
        hasMore: false,
        searchMeta: {
          query,
          category,
          location: intentResult.location || 'Sikkim',
          filters,
          intent: intentResult
        }
      };
    }
  }

  // New method for category-specific searching using Mapbox
  private async searchPlacesByCategory(
    query: string,
    category: string,
    intentResult: IntentResult,
    filters: SearchFilters,
    location: { lat: number; lng: number }
  ): Promise<Place[]> {
    const categoryMappings = this.getCategoryMappings();
    const mapping = categoryMappings[category as keyof typeof categoryMappings];
    
    if (!mapping) {
      // Default to attractions if category not found
      return this.searchPlaces(query, 'attractions', [], location);
    }

    try {
      // Use Mapbox for enhanced search capabilities
      const mapboxResults = await mapboxService.searchPlaces(
        `${query} ${category} Sikkim`,
        [location.lng, location.lat], // Mapbox uses [lng, lat] format
        undefined,
        mapping.mapboxTypes,
        20
      );

      // Also search OpenTripMap for additional data
      const openTripMapResults = await this.openTripMap.searchByRadius(
        location.lat,
        location.lng,
        50000,
        mapping.openTripMapKinds,
        20
      );

      // Combine and normalize results
      return this.combineMapboxResults(
        mapboxResults,
        openTripMapResults,
        category,
        intentResult.subcategories
      );
    } catch (error) {
      console.error('Error in Mapbox search:', error);
      // Fallback to OpenTripMap only
      const openTripMapResults = await this.openTripMap.searchByRadius(
        location.lat,
        location.lng,
        50000,
        mapping.openTripMapKinds,
        20
      );
      return this.normalizeOpenTripMapResults(openTripMapResults, category);
    }
  }

  private getCategoryMappings() {
    return {
      hotels: {
        googleType: 'lodging',
        openTripMapKinds: 'accomodations',
        mapboxTypes: ['poi']
      },
      restaurants: {
        googleType: 'restaurant',
        openTripMapKinds: 'foods',
        mapboxTypes: ['poi']
      },
      attractions: {
        googleType: 'tourist_attraction',
        openTripMapKinds: 'natural,cultural,historic,architecture,amusements',
        mapboxTypes: ['poi']
      },
      monasteries: {
        googleType: 'place_of_worship',
        openTripMapKinds: 'religion,historic',
        mapboxTypes: ['poi']
      },
      local_cuisine: {
        googleType: 'restaurant',
        openTripMapKinds: 'foods',
        mapboxTypes: ['poi']
      },
      nightlife: {
        googleType: 'night_club',
        openTripMapKinds: 'entertainment',
        mapboxTypes: ['poi']
      },
      essentials: {
        googleType: 'establishment',
        openTripMapKinds: 'shops,banks',
        mapboxTypes: ['poi']
      },
      hidden_gems: {
        googleType: 'tourist_attraction',
        openTripMapKinds: 'natural,cultural,historic',
        mapboxTypes: ['poi']
      },
      outdoors: {
        googleType: 'park',
        openTripMapKinds: 'natural,sport',
        mapboxTypes: ['poi']
      },
      family_friendly: {
        googleType: 'amusement_park',
        openTripMapKinds: 'amusements',
        mapboxTypes: ['poi']
      }
    };
  }

  private applyFiltersAndSort(places: Place[], filters: SearchFilters): Place[] {
    let filteredPlaces = [...places];

    // Apply filters
    if (filters.rating) {
      filteredPlaces = filteredPlaces.filter(place => 
        (place.rating || 0) >= filters.rating!
      );
    }

    if (filters.priceLevel && filters.priceLevel.length > 0) {
      filteredPlaces = filteredPlaces.filter(place =>
        place.priceLevel ? filters.priceLevel!.includes(place.priceLevel) : true
      );
    }

    if (filters.openNow) {
      filteredPlaces = filteredPlaces.filter(place => place.isOpen === true);
    }

    if (filters.subcategory && filters.subcategory.length > 0) {
      filteredPlaces = filteredPlaces.filter(place =>
        filters.subcategory!.some(subcat => 
          place.subcategory === subcat || place.tags.includes(subcat)
        )
      );
    }

    // Apply sorting
    if (filters.sortBy) {
      switch (filters.sortBy) {
        case 'rating':
          filteredPlaces.sort((a, b) => (b.rating || 0) - (a.rating || 0));
          break;
        case 'distance':
          // Distance sorting would need actual distance calculation
          break;
        case 'price':
          filteredPlaces.sort((a, b) => (a.priceLevel || 0) - (b.priceLevel || 0));
          break;
        default:
          // Keep relevance order (default from APIs)
          break;
      }
    }

    // Apply limit
    if (filters.limit) {
      filteredPlaces = filteredPlaces.slice(0, filters.limit);
    }

    return filteredPlaces;
  }

  // Legacy method for backward compatibility
  async searchPlaces(
    query: string,
    category: 'hotels' | 'restaurants' | 'attractions' | 'monasteries' | string,
    filters: string[] = [],
    location?: { lat: number; lng: number }
  ): Promise<Place[]> {
    const searchLocation = location || this.sikkimCenter;
    
    try {
      // Map categories to search parameters
      const categoryMappings = this.getCategoryMappings();
      const mapping = categoryMappings[category as keyof typeof categoryMappings];
      
      // Search both APIs in parallel
      const [googleResults, openTripMapResults] = await Promise.all([
        this.googlePlaces.textSearch(
          `${query} ${category} Sikkim`,
          searchLocation,
          50000,
          mapping.googleType
        ),
        this.openTripMap.searchByRadius(
          searchLocation.lat,
          searchLocation.lng,
          50000,
          mapping.openTripMapKinds,
          20
        )
      ]);

      // Combine and normalize results
      const combinedResults = await this.combineResults(
        googleResults,
        openTripMapResults,
        category,
        filters
      );

      return combinedResults.slice(0, 20); // Limit to 20 results
    } catch (error) {
      console.error('Error in searchPlaces:', error);
      return [];
    }
  }

  private async combineResults(
    googleResults: any[],
    openTripMapResults: OpenTripMapPlace[],
    category: string,
    filters: string[]
  ): Promise<Place[]> {
    const places: Place[] = [];

    // Process Google Places results
    for (const result of googleResults) {
      const place: Place = {
        id: `google_${result.place_id}`,
        name: result.name,
        category: this.getCategoryFromTypes(result.types, category),
        rating: result.rating,
        reviews: result.user_ratings_total,
        price: this.getPriceRange(result.price_level),
        image: result.photos?.[0] 
          ? `https://maps.googleapis.com/maps/api/place/photo?photoreference=${result.photos[0].photo_reference}&maxwidth=400&key=${GOOGLE_PLACES_API_KEY}`
          : this.getDefaultImage(category),
        address: result.formatted_address || result.vicinity,
        description: `Popular ${category.slice(0, -1)} in Sikkim`,
        tags: this.extractTags(result.types, filters),
        coordinates: {
          lat: result.geometry.location.lat,
          lng: result.geometry.location.lng
        },
        features: this.extractFeatures(result, category)
      };

      if (this.matchesFilters(place, filters)) {
        places.push(place);
      }
    }

    // Process OpenTripMap results
    for (const result of openTripMapResults) {
      // Get detailed information
      const details = await this.openTripMap.getPlaceDetails(result.xid);
      
      if (details) {
        const place: Place = {
          id: `otm_${result.xid}`,
          name: details.name || result.name,
          category: this.getCategoryFromKinds(result.kinds, category),
          rating: result.rate / 2, // Convert to 5-star scale
          image: details.preview?.source || details.image || this.getDefaultImage(category),
          address: this.formatAddress(details.address),
          description: details.wikipedia_extracts?.text?.substring(0, 200) + '...' || 
                      `Interesting ${category.slice(0, -1)} in Sikkim`,
          tags: this.extractTagsFromKinds(result.kinds, filters),
          coordinates: {
            lat: result.point.lat,
            lng: result.point.lon
          },
          features: this.extractFeaturesFromKinds(result.kinds, category)
        };

        if (this.matchesFilters(place, filters)) {
          places.push(place);
        }
      }
    }

    // Remove duplicates and sort by rating
    const uniquePlaces = this.removeDuplicates(places);
    return uniquePlaces.sort((a, b) => (b.rating || 0) - (a.rating || 0));
  }

  // New method to combine Mapbox and OpenTripMap results
  private async combineMapboxResults(
    mapboxResults: MapboxPlace[],
    openTripMapResults: OpenTripMapPlace[],
    category: string,
    filters: string[]
  ): Promise<Place[]> {
    const places: Place[] = [];

    // Process Mapbox results
    for (const result of mapboxResults) {
      const place: Place = {
        id: `mapbox_${result.id}`,
        name: result.text,
        category: this.getCategoryFromMapboxContext(result.context, category),
        rating: 4.0, // Default rating for Mapbox results
        image: this.getDefaultImage(category),
        address: result.place_name,
        description: `Discover this ${category.slice(0, -1)} in Sikkim`,
        tags: this.extractTagsFromMapboxContext(result.context, filters),
        coordinates: {
          lat: result.center[1],
          lng: result.center[0]
        },
        features: this.extractFeaturesFromMapbox(result, category)
      };

      if (this.matchesFilters(place, filters)) {
        places.push(place);
      }
    }

    // Process OpenTripMap results
    for (const result of openTripMapResults) {
      const details = await this.openTripMap.getPlaceDetails(result.xid);
      
      if (details) {
        const place: Place = {
          id: `otm_${result.xid}`,
          name: details.name || result.name,
          category: this.getCategoryFromKinds(result.kinds, category),
          rating: result.rate / 2,
          image: details.preview?.source || details.image || this.getDefaultImage(category),
          address: this.formatAddress(details.address),
          description: details.wikipedia_extracts?.text?.substring(0, 200) + '...' || 
                      `Interesting ${category.slice(0, -1)} in Sikkim`,
          tags: this.extractTagsFromKinds(result.kinds, filters),
          coordinates: {
            lat: result.point.lat,
            lng: result.point.lon
          },
          features: this.extractFeaturesFromKinds(result.kinds, category)
        };

        if (this.matchesFilters(place, filters)) {
          places.push(place);
        }
      }
    }

    // Remove duplicates and sort by rating
    const uniquePlaces = this.removeDuplicates(places);
    return uniquePlaces.sort((a, b) => (b.rating || 0) - (a.rating || 0));
  }

  // Helper methods for Mapbox results
  private getCategoryFromMapboxContext(context: any[], category: string): string {
    if (!context) return category.charAt(0).toUpperCase() + category.slice(1, -1);
    
    for (const ctx of context) {
      if (ctx.id.includes('poi')) return 'Point of Interest';
      if (ctx.id.includes('place')) return 'Place';
    }
    
    return category.charAt(0).toUpperCase() + category.slice(1, -1);
  }

  private extractTagsFromMapboxContext(context: any[], filters: string[]): string[] {
    if (!context) return [];
    
    const tags: string[] = [];
    for (const ctx of context) {
      if (ctx.text && !tags.includes(ctx.text)) {
        tags.push(ctx.text);
      }
    }
    
    return tags.slice(0, 5); // Limit to 5 tags
  }

  private extractFeaturesFromMapbox(result: MapboxPlace, category: string): string[] {
    const features: string[] = [];
    
    if (result.properties?.category) {
      features.push(result.properties.category);
    }
    
    if (result.properties?.landmark) {
      features.push('Landmark');
    }
    
    // Add category-specific features
    if (category === 'hotels') {
      features.push('Accommodation');
    } else if (category === 'restaurants') {
      features.push('Dining');
    } else if (category === 'attractions') {
      features.push('Tourist Attraction');
    }
    
    return features;
  }

  // Fallback method for OpenTripMap only
  private async normalizeOpenTripMapResults(
    openTripMapResults: OpenTripMapPlace[],
    category: string
  ): Promise<Place[]> {
    const places: Place[] = [];

    for (const result of openTripMapResults) {
      const details = await this.openTripMap.getPlaceDetails(result.xid);
      
      if (details) {
        const place: Place = {
          id: `otm_${result.xid}`,
          name: details.name || result.name,
          category: this.getCategoryFromKinds(result.kinds, category),
          rating: result.rate / 2,
          image: details.preview?.source || details.image || this.getDefaultImage(category),
          address: this.formatAddress(details.address),
          description: details.wikipedia_extracts?.text?.substring(0, 200) + '...' || 
                      `Interesting ${category.slice(0, -1)} in Sikkim`,
          tags: this.extractTagsFromKinds(result.kinds, []),
          coordinates: {
            lat: result.point.lat,
            lng: result.point.lon
          },
          features: this.extractFeaturesFromKinds(result.kinds, category)
        };

        places.push(place);
      }
    }

    return places.sort((a, b) => (b.rating || 0) - (a.rating || 0));
  }

  private getCategoryFromTypes(types: string[], category: string): string {
    const categoryMap: Record<string, string> = {
      'lodging': 'Hotel',
      'restaurant': 'Restaurant',
      'tourist_attraction': 'Attraction',
      'place_of_worship': 'Monastery'
    };

    for (const type of types) {
      if (categoryMap[type]) {
        return categoryMap[type];
      }
    }

    return category.charAt(0).toUpperCase() + category.slice(1, -1);
  }

  private getCategoryFromKinds(kinds: string, category: string): string {
    if (kinds.includes('religion')) return 'Monastery';
    if (kinds.includes('accomodations')) return 'Hotel';
    if (kinds.includes('foods')) return 'Restaurant';
    if (kinds.includes('natural')) return 'Natural Attraction';
    if (kinds.includes('cultural')) return 'Cultural Site';
    if (kinds.includes('historic')) return 'Historic Site';
    
    return category.charAt(0).toUpperCase() + category.slice(1, -1);
  }

  private getPriceRange(priceLevel?: number): string {
    if (!priceLevel) return '';
    
    const ranges = ['$', '$$', '$$$', '$$$$', '$$$$$'];
    return ranges[priceLevel - 1] || '';
  }

  private getDefaultImage(category: string): string {
    const defaultImages = {
      hotels: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400',
      restaurants: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400',
      attractions: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400',
      monasteries: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=400'
    };
    
    return defaultImages[category as keyof typeof defaultImages] || defaultImages.attractions;
  }

  private extractTags(types: string[], filters: string[]): string[] {
    const tags = types.slice(0, 3);
    return [...tags, ...filters];
  }

  private extractTagsFromKinds(kinds: string, filters: string[]): string[] {
    const kindArray = kinds.split(',').slice(0, 3);
    return [...kindArray, ...filters];
  }

  private extractFeatures(result: any, category: string): string[] {
    const features = ['Popular'];
    
    if (result.opening_hours?.open_now) features.push('Open Now');
    if (result.photos?.length > 0) features.push('Photos Available');
    if (category === 'monasteries') features.push('VR Tour');
    
    return features;
  }

  private extractFeaturesFromKinds(kinds: string, category: string): string[] {
    const features = [];
    
    if (kinds.includes('historic')) features.push('Historic');
    if (kinds.includes('cultural')) features.push('Cultural');
    if (kinds.includes('natural')) features.push('Natural');
    if (category === 'monasteries') features.push('VR Tour');
    
    return features;
  }

  private formatAddress(address: any): string {
    if (!address) return 'Sikkim, India';
    
    const parts = [
      address.road,
      address.city || address.state,
      'Sikkim'
    ].filter(Boolean);
    
    return parts.join(', ');
  }

  private matchesFilters(place: Place, filters: string[]): boolean {
    if (filters.length === 0) return true;
    
    const placeTags = [...place.tags, place.category.toLowerCase()];
    return filters.some(filter => 
      placeTags.some(tag => tag.toLowerCase().includes(filter.toLowerCase()))
    );
  }

  private removeDuplicates(places: Place[]): Place[] {
    const seen = new Set();
    return places.filter(place => {
      const key = place.name.toLowerCase() + place.coordinates.lat + place.coordinates.lng;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }

  // Get nearby places for recommendations
  async getNearbyPlaces(
    centerLocation: { lat: number; lng: number },
    category?: string,
    radius: number = 5000
  ): Promise<Place[]> {
    try {
      const [googleResults, openTripMapResults] = await Promise.all([
        this.googlePlaces.nearbySearch(centerLocation, radius, category),
        this.openTripMap.searchByRadius(
          centerLocation.lat,
          centerLocation.lng,
          radius,
          undefined,
          10
        )
      ]);

      return this.combineResults(googleResults, openTripMapResults, category || 'attractions', []);
    } catch (error) {
      console.error('Error getting nearby places:', error);
      return [];
    }
  }
}

export const searchService = new SearchService();
export const openTripMapService = new OpenTripMapService();
export const googlePlacesService = new GooglePlacesService(); 