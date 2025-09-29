// Mapbox service for enhanced mapping and search functionality
import mapboxgl from 'mapbox-gl';

// Mapbox configuration
const MAPBOX_ACCESS_TOKEN = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN || 'pk.eyJ1IjoiaGFyZGl0b3VyYSIsImEiOiJjbXZ0dGJ0Z2owMDF6MmpwZ2N6Z2N6Z2N6In0.example';

// Initialize Mapbox
mapboxgl.accessToken = MAPBOX_ACCESS_TOKEN;

export interface MapboxPlace {
  id: string;
  text: string;
  place_name: string;
  center: [number, number];
  bbox?: [number, number, number, number];
  context?: Array<{
    id: string;
    text: string;
    wikidata?: string;
    short_code?: string;
  }>;
  properties?: {
    category?: string;
    landmark?: boolean;
    address?: string;
    tel?: string;
    website?: string;
  };
}

export interface MapboxSearchResult {
  type: string;
  features: MapboxPlace[];
  attribution: string;
}

export interface MapboxDirections {
  routes: Array<{
    geometry: {
      coordinates: [number, number][];
    };
    duration: number;
    distance: number;
    legs: Array<{
      summary: string;
      duration: number;
      distance: number;
    }>;
  }>;
  waypoints: Array<{
    name: string;
    location: [number, number];
  }>;
}

class MapboxService {
  private baseUrl = 'https://api.mapbox.com';

  // Search for places using Mapbox Geocoding API
  async searchPlaces(
    query: string,
    proximity?: [number, number],
    bbox?: [number, number, number, number],
    types?: string[],
    limit: number = 10
  ): Promise<MapboxPlace[]> {
    try {
      const params = new URLSearchParams({
        access_token: MAPBOX_ACCESS_TOKEN,
        limit: limit.toString(),
        types: types ? types.join(',') : 'poi,place,locality,neighborhood,address',
        country: 'IN', // India
        language: 'en'
      });

      if (proximity) {
        params.append('proximity', `${proximity[0]},${proximity[1]}`);
      }

      if (bbox) {
        params.append('bbox', bbox.join(','));
      }

      const response = await fetch(
        `${this.baseUrl}/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?${params}`
      );

      if (!response.ok) {
        throw new Error(`Mapbox API error: ${response.statusText}`);
      }

      const data: MapboxSearchResult = await response.json();
      return data.features || [];
    } catch (error) {
      console.error('Error searching places with Mapbox:', error);
      return [];
    }
  }

  // Search for places near a location
  async searchNearby(
    location: [number, number],
    radius: number = 5000,
    types?: string[],
    limit: number = 10
  ): Promise<MapboxPlace[]> {
    try {
      const params = new URLSearchParams({
        access_token: MAPBOX_ACCESS_TOKEN,
        limit: limit.toString(),
        types: types ? types.join(',') : 'poi,place',
        proximity: `${location[0]},${location[1]}`,
        country: 'IN',
        language: 'en'
      });

      const response = await fetch(
        `${this.baseUrl}/geocoding/v5/mapbox.places/nearby.json?${params}`
      );

      if (!response.ok) {
        throw new Error(`Mapbox API error: ${response.statusText}`);
      }

      const data: MapboxSearchResult = await response.json();
      return data.features || [];
    } catch (error) {
      console.error('Error searching nearby places with Mapbox:', error);
      return [];
    }
  }

  // Get directions between two points
  async getDirections(
    start: [number, number],
    end: [number, number],
    profile: 'driving' | 'walking' | 'cycling' = 'driving'
  ): Promise<MapboxDirections | null> {
    try {
      const params = new URLSearchParams({
        access_token: MAPBOX_ACCESS_TOKEN,
        geometries: 'geojson',
        overview: 'full',
        steps: 'true'
      });

      const response = await fetch(
        `${this.baseUrl}/directions/v5/mapbox/${profile}/${start[0]},${start[1]};${end[0]},${end[1]}?${params}`
      );

      if (!response.ok) {
        throw new Error(`Mapbox Directions API error: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error getting directions with Mapbox:', error);
      return null;
    }
  }

  // Get place details by ID
  async getPlaceDetails(placeId: string): Promise<MapboxPlace | null> {
    try {
      const params = new URLSearchParams({
        access_token: MAPBOX_ACCESS_TOKEN,
        types: 'poi,place,locality,neighborhood,address',
        country: 'IN',
        language: 'en'
      });

      const response = await fetch(
        `${this.baseUrl}/geocoding/v5/mapbox.places/${encodeURIComponent(placeId)}.json?${params}`
      );

      if (!response.ok) {
        throw new Error(`Mapbox API error: ${response.statusText}`);
      }

      const data: MapboxSearchResult = await response.json();
      return data.features[0] || null;
    } catch (error) {
      console.error('Error getting place details with Mapbox:', error);
      return null;
    }
  }

  // Search for tourist attractions in Sikkim
  async searchTouristAttractions(
    query: string = 'tourist attractions',
    location: [number, number] = [88.6065, 27.3389], // Sikkim coordinates
    radius: number = 50000
  ): Promise<MapboxPlace[]> {
    try {
      const params = new URLSearchParams({
        access_token: MAPBOX_ACCESS_TOKEN,
        limit: '20',
        types: 'poi',
        proximity: `${location[0]},${location[1]}`,
        country: 'IN',
        language: 'en'
      });

      const response = await fetch(
        `${this.baseUrl}/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?${params}`
      );

      if (!response.ok) {
        throw new Error(`Mapbox API error: ${response.statusText}`);
      }

      const data: MapboxSearchResult = await response.json();
      
      // Filter results to be within Sikkim region
      const sikkimBbox: [number, number, number, number] = [88.0, 27.0, 89.0, 28.0];
      return data.features.filter(place => {
        const [lng, lat] = place.center;
        return lng >= sikkimBbox[0] && lng <= sikkimBbox[2] && 
               lat >= sikkimBbox[1] && lat <= sikkimBbox[3];
      });
    } catch (error) {
      console.error('Error searching tourist attractions with Mapbox:', error);
      return [];
    }
  }

  // Search for restaurants in Sikkim
  async searchRestaurants(
    location: [number, number] = [88.6065, 27.3389],
    radius: number = 50000
  ): Promise<MapboxPlace[]> {
    return this.searchNearby(location, radius, ['poi'], 15);
  }

  // Search for hotels in Sikkim
  async searchHotels(
    location: [number, number] = [88.6065, 27.3389],
    radius: number = 50000
  ): Promise<MapboxPlace[]> {
    return this.searchNearby(location, radius, ['poi'], 15);
  }
}

export const mapboxService = new MapboxService();
export default mapboxService;