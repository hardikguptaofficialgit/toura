// Geocoding service using OpenStreetMap Nominatim API
export interface Location {
  lat: number;
  lon: number;
  display_name: string;
  place_id: string;
  type: string;
  importance: number;
}

export interface GeocodingResult {
  place_id: string;
  licence: string;
  osm_type: string;
  osm_id: string;
  lat: string;
  lon: string;
  display_name: string;
  boundingbox: string[];
  class: string;
  type: string;
  importance: number;
  icon?: string;
}

export class GeocodingService {
  private static readonly NOMINATIM_BASE_URL = 'https://nominatim.openstreetmap.org';

  // Search for locations by query
  static async searchLocations(query: string, limit: number = 10): Promise<Location[]> {
    try {
      const response = await fetch(
        `${this.NOMINATIM_BASE_URL}/search?` +
        `q=${encodeURIComponent(query)}&` +
        `format=json&` +
        `limit=${limit}&` +
        `addressdetails=1&` +
        `extratags=1&` +
        `namedetails=1`
      );

      if (!response.ok) {
        throw new Error(`Geocoding API error: ${response.status}`);
      }

      const results: GeocodingResult[] = await response.json();
      
      return results.map(result => ({
        lat: parseFloat(result.lat),
        lon: parseFloat(result.lon),
        display_name: result.display_name,
        place_id: result.place_id,
        type: result.type,
        importance: result.importance
      }));
    } catch (error) {
      console.error('Geocoding search error:', error);
      throw new Error('Failed to search locations');
    }
  }

  // Reverse geocoding - get location details from coordinates
  static async reverseGeocode(lat: number, lon: number): Promise<Location | null> {
    try {
      const response = await fetch(
        `${this.NOMINATIM_BASE_URL}/reverse?` +
        `lat=${lat}&` +
        `lon=${lon}&` +
        `format=json&` +
        `addressdetails=1&` +
        `extratags=1&` +
        `namedetails=1`
      );

      if (!response.ok) {
        throw new Error(`Reverse geocoding API error: ${response.status}`);
      }

      const result = await response.json();
      
      if (!result || !result.lat || !result.lon) {
        return null;
      }

      return {
        lat: parseFloat(result.lat),
        lon: parseFloat(result.lon),
        display_name: result.display_name,
        place_id: result.place_id,
        type: result.type || 'unknown',
        importance: result.importance || 0
      };
    } catch (error) {
      console.error('Reverse geocoding error:', error);
      return null;
    }
  }

  // Get detailed information about a place
  static async getPlaceDetails(placeId: string): Promise<any> {
    try {
      const response = await fetch(
        `${this.NOMINATIM_BASE_URL}/details?` +
        `place_id=${placeId}&` +
        `format=json&` +
        `addressdetails=1&` +
        `extratags=1&` +
        `namedetails=1&` +
        `linkedplaces=1`
      );

      if (!response.ok) {
        throw new Error(`Place details API error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Place details error:', error);
      throw new Error('Failed to get place details');
    }
  }
}