// OpenTripMap API service for attractions and points of interest
export interface Attraction {
  xid: string;
  name: string;
  dist: number;
  rate: string;
  osm: string;
  wikidata: string;
  kinds: string;
  point: {
    lon: number;
    lat: number;
  };
  bbox?: {
    east: number;
    north: number;
    south: number;
    west: number;
  };
}

export interface AttractionDetails {
  xid: string;
  name: string;
  address: {
    city?: string;
    state?: string;
    country?: string;
    country_code?: string;
    postcode?: string;
    road?: string;
    house_number?: string;
  };
  rate: string;
  osm: string;
  wikidata: string;
  kinds: string;
  sources: {
    geometry: string;
    attributes: string[];
  };
  otm: string;
  wikipedia?: string;
  image?: string;
  preview?: {
    source: string;
    height: number;
    width: number;
  };
  wikipedia_extracts?: {
    title: string;
    text: string;
    html: string;
  };
  point: {
    lon: number;
    lat: number;
  };
  bbox?: {
    east: number;
    north: number;
    south: number;
    west: number;
  };
}

export class OpenTripMapService {
  private static readonly API_KEY = import.meta.env.VITE_OPENTRIPMAP_API_KEY || '';
  private static readonly BASE_URL = 'https://api.opentripmap.com/0.1/en/places';

  // Search for attractions near a location
  static async searchAttractions(
    lat: number,
    lon: number,
    radius: number = 1000,
    kinds?: string,
    limit: number = 20
  ): Promise<Attraction[]> {
    try {
      let url = `${this.BASE_URL}/radius?` +
        `radius=${radius}&` +
        `lon=${lon}&` +
        `lat=${lat}&` +
        `limit=${limit}&` +
        `apikey=${this.API_KEY}`;

      if (kinds) {
        url += `&kinds=${encodeURIComponent(kinds)}`;
      }

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`OpenTripMap API error: ${response.status}`);
      }

      const data = await response.json();
      return data.features || [];
    } catch (error) {
      console.error('OpenTripMap search error:', error);
      // Return empty array if API fails
      return [];
    }
  }

  // Get detailed information about a specific attraction
  static async getAttractionDetails(xid: string): Promise<AttractionDetails | null> {
    try {
      const response = await fetch(
        `${this.BASE_URL}/xid/${xid}?apikey=${this.API_KEY}`
      );

      if (!response.ok) {
        throw new Error(`OpenTripMap details API error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('OpenTripMap details error:', error);
      return null;
    }
  }

  // Search attractions by name
  static async searchAttractionsByName(
    query: string,
    limit: number = 20
  ): Promise<Attraction[]> {
    try {
      const response = await fetch(
        `${this.BASE_URL}/geoname?` +
        `name=${encodeURIComponent(query)}&` +
        `limit=${limit}&` +
        `apikey=${this.API_KEY}`
      );

      if (!response.ok) {
        throw new Error(`OpenTripMap geoname API error: ${response.status}`);
      }

      const data = await response.json();
      return data.features || [];
    } catch (error) {
      console.error('OpenTripMap geoname search error:', error);
      return [];
    }
  }

  // Get attractions by category
  static async getAttractionsByCategory(
    lat: number,
    lon: number,
    category: string,
    radius: number = 2000,
    limit: number = 20
  ): Promise<Attraction[]> {
    const categoryMap: { [key: string]: string } = {
      'restaurants': 'restaurants',
      'hotels': 'accomodations',
      'attractions': 'interesting_places',
      'museums': 'cultural',
      'parks': 'natural',
      'shopping': 'shops',
      'nightlife': 'amusements'
    };

    const kinds = categoryMap[category] || 'interesting_places';
    return this.searchAttractions(lat, lon, radius, kinds, limit);
  }

  // Get popular attraction categories
  static getAttractionCategories(): { [key: string]: string } {
    return {
      'restaurants': 'Restaurants & Dining',
      'hotels': 'Hotels & Accommodations',
      'attractions': 'Tourist Attractions',
      'museums': 'Museums & Culture',
      'parks': 'Parks & Nature',
      'shopping': 'Shopping',
      'nightlife': 'Nightlife & Entertainment'
    };
  }
}