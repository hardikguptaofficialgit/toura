// Favorites and sharing service
import { getUserData, updateFavorites, updateItineraries } from '../lib/localAuth';

export interface FavoritePlace {
  id: string;
  name: string;
  category: string;
  rating: number;
  image: string;
  address: string;
  coordinates: { lat: number; lng: number };
  savedAt: string;
}

export interface Itinerary {
  id: string;
  name: string;
  description: string;
  places: FavoritePlace[];
  createdAt: string;
  updatedAt: string;
  isPublic: boolean;
  duration: string; // e.g., "3 days", "1 week"
}

class FavoritesService {
  // Add place to favorites
  async addToFavorites(userId: string, place: FavoritePlace): Promise<void> {
    try {
      const user = getUserData(userId);
      const favorites = user?.favorites || [];
      const updated = [
        ...favorites,
        { ...place, savedAt: new Date().toISOString() }
      ];
      updateFavorites(userId, updated);
    } catch (error) {
      console.error('Error adding to favorites:', error);
      throw error;
    }
  }

  // Remove place from favorites
  async removeFromFavorites(userId: string, placeId: string): Promise<void> {
    try {
      const user = getUserData(userId);
      const favorites = user?.favorites || [];
      const updatedFavorites = favorites.filter((fav: FavoritePlace) => fav.id !== placeId);
      updateFavorites(userId, updatedFavorites);
    } catch (error) {
      console.error('Error removing from favorites:', error);
      throw error;
    }
  }

  // Get user's favorites
  async getFavorites(userId: string): Promise<FavoritePlace[]> {
    try {
      const user = getUserData(userId);
      return user?.favorites || [];
    } catch (error) {
      console.error('Error getting favorites:', error);
      return [];
    }
  }

  // Check if place is favorited
  async isFavorited(userId: string, placeId: string): Promise<boolean> {
    try {
      const favorites = await this.getFavorites(userId);
      return favorites.some(fav => fav.id === placeId);
    } catch (error) {
      console.error('Error checking if favorited:', error);
      return false;
    }
  }

  // Create itinerary from selected places
  async createItinerary(
    userId: string, 
    itinerary: Omit<Itinerary, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<string> {
    try {
      const itineraryId = `itinerary_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const itineraryData: Itinerary = {
        id: itineraryId,
        ...itinerary,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      const user = getUserData(userId);
      const itineraries = user?.itineraries || [];
      const updated = [...itineraries, itineraryData];
      updateItineraries(userId, updated);

      return itineraryId;
    } catch (error) {
      console.error('Error creating itinerary:', error);
      throw error;
    }
  }

  // Get user's itineraries
  async getItineraries(userId: string): Promise<Itinerary[]> {
    try {
      const user = getUserData(userId);
      return user?.itineraries || [];
    } catch (error) {
      console.error('Error getting itineraries:', error);
      return [];
    }
  }

  // Share place via Web Share API or fallback
  async sharePlace(place: FavoritePlace): Promise<void> {
    const shareData = {
      title: `${place.name} - Sikkim`,
      text: `Check out ${place.name} in Sikkim! ${place.address}`,
      url: `${window.location.origin}?place=${encodeURIComponent(place.id)}`
    };

    try {
      if (navigator.share && navigator.canShare(shareData)) {
        await navigator.share(shareData);
      } else {
        // Fallback to clipboard
        const shareText = `${shareData.title}\n${shareData.text}\n${shareData.url}`;
        await navigator.clipboard.writeText(shareText);
        
        // Show toast notification
        this.showToast('Share link copied to clipboard!');
      }
    } catch (error) {
      console.error('Error sharing place:', error);
      // Further fallback - create shareable URL
      const shareUrl = `mailto:?subject=${encodeURIComponent(shareData.title)}&body=${encodeURIComponent(shareData.text + '\n' + shareData.url)}`;
      window.open(shareUrl);
    }
  }

  // Share itinerary
  async shareItinerary(itinerary: Itinerary): Promise<void> {
    const shareData = {
      title: `${itinerary.name} - Sikkim Itinerary`,
      text: `Check out my ${itinerary.duration} Sikkim itinerary: ${itinerary.description}`,
      url: `${window.location.origin}/itinerary/${itinerary.id}`
    };

    try {
      if (navigator.share && navigator.canShare(shareData)) {
        await navigator.share(shareData);
      } else {
        const shareText = `${shareData.title}\n${shareData.text}\n${shareData.url}`;
        await navigator.clipboard.writeText(shareText);
        this.showToast('Itinerary link copied to clipboard!');
      }
    } catch (error) {
      console.error('Error sharing itinerary:', error);
      const shareUrl = `mailto:?subject=${encodeURIComponent(shareData.title)}&body=${encodeURIComponent(shareData.text + '\n' + shareData.url)}`;
      window.open(shareUrl);
    }
  }

  // Generate automatic itinerary based on preferences
  generateSmartItinerary(
    places: FavoritePlace[], 
    duration: string, 
    preferences: string[] = []
  ): Itinerary {
    // Sort places by rating and preferences
    const sortedPlaces = places.sort((a, b) => {
      // Prioritize by category preferences
      const aScore = preferences.includes(a.category.toLowerCase()) ? 10 : 0;
      const bScore = preferences.includes(b.category.toLowerCase()) ? 10 : 0;
      
      if (aScore !== bScore) return bScore - aScore;
      
      // Then by rating
      return b.rating - a.rating;
    });

    // Determine number of places based on duration
    const durationMap: Record<string, number> = {
      '1 day': 3,
      '2 days': 5,
      '3 days': 8,
      '1 week': 15,
      '2 weeks': 25
    };

    const maxPlaces = durationMap[duration] || 5;
    const selectedPlaces = sortedPlaces.slice(0, maxPlaces);

    return {
      id: '',
      name: `My ${duration} Sikkim Adventure`,
      description: `A curated ${duration} itinerary featuring the best of Sikkim`,
      places: selectedPlaces,
      createdAt: '',
      updatedAt: '',
      isPublic: false,
      duration
    };
  }

  // Show toast notification (helper method)
  private showToast(message: string): void {
    // Create toast element
    const toast = document.createElement('div');
    toast.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 transition-all duration-300';
    toast.textContent = message;
    
    document.body.appendChild(toast);
    
    // Animate in
    setTimeout(() => {
      toast.style.transform = 'translateX(0)';
      toast.style.opacity = '1';
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
      toast.style.transform = 'translateX(100%)';
      toast.style.opacity = '0';
      setTimeout(() => {
        document.body.removeChild(toast);
      }, 300);
    }, 3000);
  }
}

export const favoritesService = new FavoritesService(); 