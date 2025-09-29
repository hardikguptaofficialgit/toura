// Pexels API service for getting contextually relevant images
const PEXELS_API_KEY = import.meta.env.VITE_PEXELS_API_KEY || 'your_pexels_api_key_here';

export interface PexelsPhoto {
  id: number;
  width: number;
  height: number;
  url: string;
  photographer: string;
  photographer_url: string;
  photographer_id: number;
  avg_color: string;
  src: {
    original: string;
    large2x: string;
    large: string;
    medium: string;
    small: string;
    portrait: string;
    landscape: string;
    tiny: string;
  };
  liked: boolean;
  alt: string;
}

export interface PexelsResponse {
  page: number;
  per_page: number;
  photos: PexelsPhoto[];
  total_results: number;
  next_page: string;
}

class PexelsService {
  private baseUrl = 'https://api.pexels.com/v1';

  // Search for images based on query
  async searchImages(query: string, perPage: number = 10): Promise<PexelsPhoto[]> {
    try {
      const response = await fetch(`${this.baseUrl}/search?query=${encodeURIComponent(query)}&per_page=${perPage}`, {
        headers: {
          'Authorization': PEXELS_API_KEY
        }
      });

      if (!response.ok) {
        throw new Error(`Pexels API error: ${response.statusText}`);
      }

      const data: PexelsResponse = await response.json();
      return data.photos || [];
    } catch (error) {
      console.error('Error fetching images from Pexels:', error);
      return [];
    }
  }

  // Get curated images
  async getCuratedImages(perPage: number = 10): Promise<PexelsPhoto[]> {
    try {
      const response = await fetch(`${this.baseUrl}/curated?per_page=${perPage}`, {
        headers: {
          'Authorization': PEXELS_API_KEY
        }
      });

      if (!response.ok) {
        throw new Error(`Pexels API error: ${response.statusText}`);
      }

      const data: PexelsResponse = await response.json();
      return data.photos || [];
    } catch (error) {
      console.error('Error fetching curated images from Pexels:', error);
      return [];
    }
  }

  // Get contextually relevant images for Sikkim tourism
  async getSikkimImages(): Promise<{ [key: string]: PexelsPhoto[] }> {
    const imageCategories = {
      monasteries: await this.searchImages('Buddhist monastery Sikkim India', 8),
      mountains: await this.searchImages('Himalayan mountains Sikkim', 8),
      lakes: await this.searchImages('mountain lake Sikkim', 8),
      tea_gardens: await this.searchImages('tea garden Darjeeling', 8),
      local_food: await this.searchImages('Indian momos thukpa food', 8),
      sunrise: await this.searchImages('sunrise mountain view', 8),
      temples: await this.searchImages('Buddhist temple India', 8),
      nature: await this.searchImages('Sikkim nature landscape', 8)
    };

    return imageCategories;
  }

  // Get fallback images if Pexels fails
  getFallbackImages(): { [key: string]: string[] } {
    return {
      monasteries: [
        'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop&q=80',
        'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop&q=80',
        'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop&q=80',
        'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&h=600&fit=crop&q=80'
      ],
      mountains: [
        'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop&q=80',
        'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&h=600&fit=crop&q=80',
        'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop&q=80',
        'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop&q=80'
      ],
      lakes: [
        'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop&q=80',
        'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&h=600&fit=crop&q=80',
        'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop&q=80',
        'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop&q=80'
      ],
      tea_gardens: [
        'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop&q=80',
        'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop&q=80',
        'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop&q=80',
        'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&h=600&fit=crop&q=80'
      ],
      local_food: [
        'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=800&h=600&fit=crop&q=80',
        'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&h=600&fit=crop&q=80',
        'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop&q=80',
        'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop&q=80'
      ],
      sunrise: [
        'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop&q=80',
        'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop&q=80',
        'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&h=600&fit=crop&q=80',
        'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop&q=80'
      ],
      temples: [
        'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop&q=80',
        'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop&q=80',
        'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop&q=80',
        'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&h=600&fit=crop&q=80'
      ],
      nature: [
        'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&h=600&fit=crop&q=80',
        'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop&q=80',
        'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop&q=80',
        'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop&q=80'
      ]
    };
  }
}

export const pexelsService = new PexelsService();
export default pexelsService;