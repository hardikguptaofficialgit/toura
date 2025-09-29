// Smart recommendations service

import { searchService } from './api';
import { FavoritePlace } from './favorites';

export interface Recommendation {
  place: any;
  score: number;
  reason: string;
  type: 'nearby' | 'similar' | 'complementary' | 'popular';
}

class RecommendationsService {
  // Get nearby places for a given location
  async getNearbyRecommendations(
    centerPlace: any,
    radius: number = 5000,
    limit: number = 10
  ): Promise<Recommendation[]> {
    try {
      const nearbyPlaces = await searchService.getNearbyPlaces(
        centerPlace.coordinates,
        undefined,
        radius
      );

      return nearbyPlaces
        .filter(place => place.id !== centerPlace.id)
        .slice(0, limit)
        .map(place => ({
          place,
          score: this.calculateProximityScore(centerPlace, place),
          reason: `${this.getDistanceString(centerPlace.coordinates, place.coordinates)} from ${centerPlace.name}`,
          type: 'nearby' as const
        }));
    } catch (error) {
      console.error('Error getting nearby recommendations:', error);
      return [];
    }
  }

  // Get similar places based on category and features
  async getSimilarRecommendations(
    referencePlace: any,
    userFavorites: FavoritePlace[] = [],
    limit: number = 5
  ): Promise<Recommendation[]> {
    try {
      // Search for places in the same category
      const similarPlaces = await searchService.searchPlaces(
        referencePlace.category,
        this.getCategoryFromPlace(referencePlace),
        referencePlace.tags.slice(0, 2) // Use first 2 tags as filters
      );

      return similarPlaces
        .filter(place => {
          // Exclude the reference place and already favorited places
          return place.id !== referencePlace.id && 
                 !userFavorites.some(fav => fav.id === place.id);
        })
        .slice(0, limit)
        .map(place => ({
          place,
          score: this.calculateSimilarityScore(referencePlace, place),
          reason: this.getSimilarityReason(referencePlace, place),
          type: 'similar' as const
        }));
    } catch (error) {
      console.error('Error getting similar recommendations:', error);
      return [];
    }
  }

  // Get complementary recommendations (e.g., if user likes monasteries, suggest nearby restaurants)
  async getComplementaryRecommendations(
    userFavorites: FavoritePlace[],
    limit: number = 8
  ): Promise<Recommendation[]> {
    if (userFavorites.length === 0) return [];

    try {
      const recommendations: Recommendation[] = [];
      
      // Analyze user preferences
      const preferences = this.analyzeUserPreferences(userFavorites);
      
      // Get complementary categories
      const complementaryCategories = this.getComplementaryCategories(preferences.topCategories);
      
      // Search for places in complementary categories near user's favorite locations
      for (const category of complementaryCategories) {
        const avgLocation = this.calculateCenterPoint(userFavorites.map(fav => fav.coordinates));
        
        const places = await searchService.searchPlaces(
          category,
          this.mapCategoryToSearchType(category),
          []
        );

        const filteredPlaces = places
          .filter(place => !userFavorites.some(fav => fav.id === place.id))
          .slice(0, Math.ceil(limit / complementaryCategories.length));

        const categoryRecommendations = filteredPlaces.map(place => ({
          place,
          score: this.calculateComplementaryScore(place, preferences),
          reason: this.getComplementaryReason(category, preferences),
          type: 'complementary' as const
        }));

        recommendations.push(...categoryRecommendations);
      }

      return recommendations
        .sort((a, b) => b.score - a.score)
        .slice(0, limit);
    } catch (error) {
      console.error('Error getting complementary recommendations:', error);
      return [];
    }
  }

  // Get popular places recommendations
  async getPopularRecommendations(
    userFavorites: FavoritePlace[] = [],
    limit: number = 6
  ): Promise<Recommendation[]> {
    try {
      const categories = ['hotels', 'restaurants', 'attractions', 'monasteries'] as const;
      const recommendations: Recommendation[] = [];

      for (const category of categories) {
        const places = await searchService.searchPlaces('', category, []);
        
        const topPlaces = places
          .filter(place => !userFavorites.some(fav => fav.id === place.id))
          .sort((a, b) => (b.rating || 0) - (a.rating || 0))
          .slice(0, Math.ceil(limit / categories.length));

        const categoryRecommendations = topPlaces.map(place => ({
          place,
          score: (place.rating || 0) * 10 + (place.reviews || 0) / 100,
          reason: `Top-rated ${category.slice(0, -1)} in Sikkim`,
          type: 'popular' as const
        }));

        recommendations.push(...categoryRecommendations);
      }

      return recommendations
        .sort((a, b) => b.score - a.score)
        .slice(0, limit);
    } catch (error) {
      console.error('Error getting popular recommendations:', error);
      return [];
    }
  }

  // Generate comprehensive recommendations for a user
  async getPersonalizedRecommendations(
    userFavorites: FavoritePlace[],
    currentLocation?: { lat: number; lng: number },
    limit: number = 20
  ): Promise<{
    nearby: Recommendation[];
    similar: Recommendation[];
    complementary: Recommendation[];
    popular: Recommendation[];
  }> {
    const [nearby, similar, complementary, popular] = await Promise.all([
      currentLocation && userFavorites.length > 0
        ? this.getNearbyRecommendations(
            userFavorites[userFavorites.length - 1], // Use last favorited place
            10000,
            Math.ceil(limit * 0.3)
          )
        : Promise.resolve([]),
      userFavorites.length > 0
        ? this.getSimilarRecommendations(
            userFavorites[0], // Use first favorited place as reference
            userFavorites,
            Math.ceil(limit * 0.25)
          )
        : Promise.resolve([]),
      this.getComplementaryRecommendations(
        userFavorites,
        Math.ceil(limit * 0.3)
      ),
      this.getPopularRecommendations(
        userFavorites,
        Math.ceil(limit * 0.15)
      )
    ]);

    return { nearby, similar, complementary, popular };
  }

  // Helper methods
  private calculateProximityScore(place1: any, place2: any): number {
    const distance = this.calculateDistance(place1.coordinates, place2.coordinates);
    const maxDistance = 50; // km
    const proximityScore = Math.max(0, (maxDistance - distance) / maxDistance) * 100;
    const ratingBonus = (place2.rating || 0) * 10;
    return proximityScore + ratingBonus;
  }

  private calculateSimilarityScore(reference: any, candidate: any): number {
    let score = 0;
    
    // Category match
    if (reference.category === candidate.category) score += 50;
    
    // Tag overlap
    const sharedTags = reference.tags.filter((tag: string) => 
      candidate.tags.includes(tag)
    ).length;
    score += sharedTags * 10;
    
    // Rating similarity
    const ratingDiff = Math.abs((reference.rating || 0) - (candidate.rating || 0));
    score += Math.max(0, (5 - ratingDiff) * 5);
    
    // Review count (popularity indicator)
    score += Math.min((candidate.reviews || 0) / 100, 20);
    
    return score;
  }

  private calculateComplementaryScore(place: any, preferences: any): number {
    let score = (place.rating || 0) * 10;
    
    // Boost score for places that complement user's preferences
    if (preferences.preferredTimes && place.features) {
      const timeMatches = preferences.preferredTimes.some((time: string) =>
        place.features.some((feature: string) => feature.toLowerCase().includes(time))
      );
      if (timeMatches) score += 20;
    }
    
    return score;
  }

  private analyzeUserPreferences(favorites: FavoritePlace[]) {
    const categories = favorites.map(fav => fav.category);
    const categoryCount = categories.reduce((acc, cat) => {
      acc[cat] = (acc[cat] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const topCategories = Object.entries(categoryCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([category]) => category);
    
    const avgRating = favorites.reduce((sum, fav) => sum + fav.rating, 0) / favorites.length;
    
    return {
      topCategories,
      avgRating,
      totalFavorites: favorites.length,
      preferredTimes: this.extractPreferredTimes(favorites)
    };
  }

  private getComplementaryCategories(userTopCategories: string[]): string[] {
    const complementaryMap: Record<string, string[]> = {
      'Monastery': ['Restaurant', 'Hotel'],
      'Hotel': ['Restaurant', 'Attraction'],
      'Restaurant': ['Attraction', 'Monastery'],
      'Attraction': ['Restaurant', 'Hotel']
    };
    
    const complementary = new Set<string>();
    userTopCategories.forEach(category => {
      complementaryMap[category]?.forEach(comp => complementary.add(comp));
    });
    
    return Array.from(complementary);
  }

  private getSimilarityReason(reference: any, candidate: any): string {
    if (reference.category === candidate.category) {
      return `Similar to ${reference.name} - same category`;
    }
    
    const sharedTags = reference.tags.filter((tag: string) => 
      candidate.tags.includes(tag)
    );
    
    if (sharedTags.length > 0) {
      return `Similar features: ${sharedTags.join(', ')}`;
    }
    
    return `Highly rated ${candidate.category.toLowerCase()}`;
  }

  private getComplementaryReason(category: string, preferences: any): string {
    const reasons = {
      'Restaurant': 'Great dining option for your monastery visits',
      'Hotel': 'Perfect accommodation for your travels',
      'Attraction': 'Exciting places to explore',
      'Monastery': 'Spiritual sites you might enjoy'
    };
    
    return reasons[category as keyof typeof reasons] || `Popular ${category.toLowerCase()}`;
  }

  private getCategoryFromPlace(place: any): 'hotels' | 'restaurants' | 'attractions' | 'monasteries' {
    const categoryMap: Record<string, any> = {
      'Hotel': 'hotels',
      'Restaurant': 'restaurants',
      'Attraction': 'attractions',
      'Monastery': 'monasteries'
    };
    
    return categoryMap[place.category] || 'attractions';
  }

  private mapCategoryToSearchType(category: string): 'hotels' | 'restaurants' | 'attractions' | 'monasteries' {
    const map: Record<string, any> = {
      'Hotel': 'hotels',
      'Restaurant': 'restaurants',
      'Attraction': 'attractions',
      'Monastery': 'monasteries'
    };
    
    return map[category] || 'attractions';
  }

  private calculateDistance(coord1: { lat: number; lng: number }, coord2: { lat: number; lng: number }): number {
    const R = 6371; // Earth's radius in km
    const dLat = this.deg2rad(coord2.lat - coord1.lat);
    const dLon = this.deg2rad(coord2.lng - coord1.lng);
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(this.deg2rad(coord1.lat)) * Math.cos(this.deg2rad(coord2.lat)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }

  private deg2rad(deg: number): number {
    return deg * (Math.PI/180);
  }

  private getDistanceString(coord1: { lat: number; lng: number }, coord2: { lat: number; lng: number }): string {
    const distance = this.calculateDistance(coord1, coord2);
    return distance < 1 ? `${Math.round(distance * 1000)}m` : `${distance.toFixed(1)}km`;
  }

  private calculateCenterPoint(coordinates: { lat: number; lng: number }[]): { lat: number; lng: number } {
    const avgLat = coordinates.reduce((sum, coord) => sum + coord.lat, 0) / coordinates.length;
    const avgLng = coordinates.reduce((sum, coord) => sum + coord.lng, 0) / coordinates.length;
    return { lat: avgLat, lng: avgLng };
  }

  private extractPreferredTimes(favorites: FavoritePlace[]): string[] {
    // This could be enhanced with actual time preferences from user data
    return ['morning', 'afternoon', 'evening'];
  }
}

export const recommendationsService = new RecommendationsService(); 