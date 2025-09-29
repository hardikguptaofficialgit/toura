// Browser-compatible Intent Detection Service using lightweight pattern matching
// Replaces node-nlp to avoid Node.js compatibility issues in browser

export interface IntentResult {
  category: string;
  confidence: number;
  entities: Array<{
    entity: string;
    utteranceText: string;
    sourceText: string;
    start: number;
    end: number;
  }>;
  sentiment: {
    score: number;
    comparative: number;
    vote: 'positive' | 'negative' | 'neutral';
  };
  subcategories: string[];
  location?: string;
}

export interface CategoryMapping {
  hotels: string[];
  restaurants: string[];
  attractions: string[];
  monasteries: string[];
  local_cuisine: string[];
  nightlife: string[];
  essentials: string[];
  hidden_gems: string[];
  outdoors: string[];
  family_friendly: string[];
}

interface CategoryPattern {
  keywords: string[];
  phrases: string[];
  weight: number;
}

class IntentDetectionService {
  private categoryPatterns: Record<string, CategoryPattern> = {
    hotels: {
      keywords: ['hotel', 'accommodation', 'stay', 'room', 'lodge', 'resort', 'booking', 'guest', 'homestay', 'lodging'],
      phrases: [
        'where to stay', 'place to stay', 'book a room', 'find hotels', 'accommodation in',
        'luxury stay', 'budget hotel', 'mountain resort', 'spa resort', 'business hotel'
      ],
      weight: 1.0
    },
    restaurants: {
      keywords: ['restaurant', 'food', 'eat', 'dining', 'meal', 'breakfast', 'lunch', 'dinner', 'cafe', 'eatery'],
      phrases: [
        'where to eat', 'food places', 'best restaurants', 'dining options', 'good food',
        'local food', 'fine dining', 'casual dining', 'street food', 'food court'
      ],
      weight: 1.0
    },
    monasteries: {
      keywords: ['monastery', 'temple', 'buddhist', 'spiritual', 'religious', 'meditation', 'gompa', 'sacred'],
      phrases: [
        'religious places', 'spiritual sites', 'buddhist temples', 'meditation centers',
        'monastery tour', 'spiritual retreat', 'prayer halls', 'sacred places'
      ],
      weight: 1.0
    },
    attractions: {
      keywords: ['attraction', 'tourist', 'visit', 'sightseeing', 'places', 'scenic', 'viewpoint', 'landmark'],
      phrases: [
        'places to visit', 'tourist attractions', 'things to see', 'sightseeing spots',
        'must visit', 'famous places', 'scenic spots', 'points of interest'
      ],
      weight: 1.0
    },
    local_cuisine: {
      keywords: ['traditional', 'local', 'authentic', 'sikkimese', 'momos', 'thali', 'gundruk', 'sinki'],
      phrases: [
        'traditional food', 'local cuisine', 'authentic dishes', 'sikkimese food',
        'local specialties', 'traditional recipes', 'ethnic food', 'cultural food'
      ],
      weight: 1.0
    },
    nightlife: {
      keywords: ['nightlife', 'bar', 'club', 'pub', 'evening', 'night', 'cocktail', 'party'],
      phrases: [
        'nightlife options', 'bars and clubs', 'evening entertainment', 'night spots',
        'late night', 'party places', 'cocktail bars', 'live music'
      ],
      weight: 1.0
    },
    essentials: {
      keywords: ['atm', 'bank', 'hospital', 'pharmacy', 'medical', 'emergency', 'petrol', 'grocery'],
      phrases: [
        'essential services', 'medical facilities', 'banking services', 'emergency services',
        'pharmacy near', 'hospital nearby', 'fuel station', 'grocery store'
      ],
      weight: 1.0
    },
    hidden_gems: {
      keywords: ['hidden', 'secret', 'offbeat', 'unexplored', 'lesser', 'unknown', 'undiscovered'],
      phrases: [
        'hidden places', 'secret spots', 'off the beaten path', 'unexplored areas',
        'lesser known', 'hidden gems', 'local secrets', 'undiscovered places'
      ],
      weight: 1.0
    },
    outdoors: {
      keywords: ['trek', 'hiking', 'adventure', 'outdoor', 'camping', 'nature', 'wildlife', 'safari'],
      phrases: [
        'outdoor activities', 'adventure sports', 'nature activities', 'hiking trails',
        'trekking routes', 'camping sites', 'wildlife viewing', 'nature walks'
      ],
      weight: 1.0
    },
    family_friendly: {
      keywords: ['family', 'kids', 'children', 'child', 'playground', 'park', 'fun', 'safe'],
      phrases: [
        'family places', 'kid friendly', 'family activities', 'children activities',
        'family fun', 'safe for kids', 'family entertainment', 'playground areas'
      ],
      weight: 1.0
    }
  };

  private locationPatterns = [
    'gangtok', 'pelling', 'yuksom', 'lachen', 'lachung', 'namchi', 'ravangla',
    'sikkim', 'north sikkim', 'south sikkim', 'east sikkim', 'west sikkim',
    'rumtek', 'tsomgo', 'nathula', 'gurudongmar', 'yumthang'
  ];

  private positiveWords = [
    'good', 'great', 'excellent', 'amazing', 'wonderful', 'fantastic', 'awesome',
    'best', 'top', 'beautiful', 'lovely', 'perfect', 'incredible', 'outstanding'
  ];

  private negativeWords = [
    'bad', 'terrible', 'awful', 'horrible', 'worst', 'poor', 'disappointing',
    'disgusting', 'unpleasant', 'annoying', 'frustrating', 'overpriced'
  ];

  async detectIntent(query: string): Promise<IntentResult> {
    const queryLower = query.toLowerCase();
    const words = queryLower.split(/\s+/);
    
    // Calculate scores for each category
    const categoryScores: Record<string, number> = {};
    
    for (const [category, pattern] of Object.entries(this.categoryPatterns)) {
      let score = 0;
      
      // Keyword matching
      for (const keyword of pattern.keywords) {
        if (queryLower.includes(keyword)) {
          score += pattern.weight;
        }
      }
      
      // Phrase matching
      for (const phrase of pattern.phrases) {
        if (queryLower.includes(phrase)) {
          score += pattern.weight * 1.5; // Phrases get higher weight
        }
      }
      
      // Word proximity scoring
      const categoryWords = [...pattern.keywords, ...pattern.phrases.join(' ').split(' ')];
      for (const word of words) {
        if (categoryWords.some(cw => cw.includes(word) || word.includes(cw))) {
          score += 0.5;
        }
      }
      
      categoryScores[category] = score;
    }
    
    // Find the category with highest score
    const bestCategory = Object.keys(categoryScores).reduce((a, b) =>
      categoryScores[a] > categoryScores[b] ? a : b
    );
    
    const confidence = Math.min(categoryScores[bestCategory] / 3, 1); // Normalize to 0-1
    
    // Extract entities
    const entities = this.extractEntities(query);
    
    // Analyze sentiment
    const sentiment = this.analyzeSentiment(query);
    
    // Extract subcategories
    const subcategories = this.extractSubcategories(query, bestCategory);
    
    // Extract location
    const location = this.extractLocation(query);
    
    return {
      category: confidence > 0.3 ? bestCategory : 'attractions', // Default to attractions if low confidence
      confidence,
      entities,
      sentiment,
      subcategories,
      location
    };
  }

  private extractEntities(query: string): IntentResult['entities'] {
    const entities: IntentResult['entities'] = [];
    const queryLower = query.toLowerCase();
    
    // Extract location entities
    for (const location of this.locationPatterns) {
      const index = queryLower.indexOf(location);
      if (index !== -1) {
        entities.push({
          entity: 'location',
          utteranceText: location,
          sourceText: location,
          start: index,
          end: index + location.length
        });
      }
    }
    
    // Extract number entities (prices, ratings, etc.)
    const numberRegex = /\b\d+(\.\d+)?\b/g;
    let match;
    while ((match = numberRegex.exec(query)) !== null) {
      entities.push({
        entity: 'number',
        utteranceText: match[0],
        sourceText: match[0],
        start: match.index,
        end: match.index + match[0].length
      });
    }
    
    return entities;
  }

  private analyzeSentiment(query: string): IntentResult['sentiment'] {
    const words = query.toLowerCase().split(/\s+/);
    let positiveScore = 0;
    let negativeScore = 0;
    let totalWords = words.length;
    
    for (const word of words) {
      if (this.positiveWords.some(pw => word.includes(pw) || pw.includes(word))) {
        positiveScore++;
      }
      if (this.negativeWords.some(nw => word.includes(nw) || nw.includes(word))) {
        negativeScore++;
      }
    }
    
    const score = (positiveScore - negativeScore) / totalWords;
    const comparative = score;
    
    let vote: 'positive' | 'negative' | 'neutral';
    if (score > 0.1) vote = 'positive';
    else if (score < -0.1) vote = 'negative';
    else vote = 'neutral';
    
    return {
      score: Math.max(-1, Math.min(1, score)),
      comparative,
      vote
    };
  }

  private extractSubcategories(query: string, category: string): string[] {
    const queryLower = query.toLowerCase();
    const subcategories: string[] = [];
    
    const subcategoryMappings: Record<string, Record<string, string[]>> = {
      hotels: {
        luxury: ['luxury', 'premium', 'deluxe', 'high-end', 'upscale', '5 star', 'expensive'],
        budget: ['budget', 'cheap', 'affordable', 'economical', 'low-cost', 'backpacker'],
        family: ['family', 'kids', 'children', 'child-friendly'],
        business: ['business', 'conference', 'meeting', 'corporate'],
        romantic: ['romantic', 'honeymoon', 'couple', 'intimate'],
        eco: ['eco', 'sustainable', 'green', 'environment-friendly']
      },
      restaurants: {
        fine_dining: ['fine', 'upscale', 'elegant', 'premium', 'luxury', 'expensive'],
        casual: ['casual', 'family', 'relaxed', 'informal'],
        street_food: ['street', 'local', 'authentic', 'traditional', 'cheap'],
        vegetarian: ['vegetarian', 'vegan', 'plant-based', 'veggie'],
        international: ['chinese', 'italian', 'continental', 'multicuisine', 'foreign']
      },
      attractions: {
        nature: ['nature', 'natural', 'scenic', 'lake', 'waterfall', 'mountain', 'valley'],
        cultural: ['cultural', 'heritage', 'traditional', 'historical', 'ancient'],
        adventure: ['adventure', 'thrill', 'extreme', 'exciting', 'adrenaline'],
        photography: ['photo', 'photography', 'instagram', 'scenic', 'beautiful']
      }
    };
    
    if (subcategoryMappings[category]) {
      Object.entries(subcategoryMappings[category]).forEach(([subcat, keywords]) => {
        if (keywords.some(keyword => queryLower.includes(keyword))) {
          subcategories.push(subcat);
        }
      });
    }
    
    return subcategories;
  }

  private extractLocation(query: string): string | undefined {
    const queryLower = query.toLowerCase();
    
    // Try to find location with prepositions
    const locationPatterns = [
      /(?:in|at|near|around|from)\s+([a-zA-Z\s]+?)(?:\s|$|,|\?|!)/i,
    ];
    
    for (const pattern of locationPatterns) {
      const match = query.match(pattern);
      if (match && match[1]) {
        const location = match[1].trim();
        // Check if it's a known location
        if (this.locationPatterns.some(loc => 
          location.toLowerCase().includes(loc) || loc.includes(location.toLowerCase())
        )) {
          return location;
        }
      }
    }
    
    // Direct location matching
    for (const location of this.locationPatterns) {
      if (queryLower.includes(location)) {
        return location;
      }
    }
    
    return 'Sikkim'; // Default location
  }

  // Get category mappings for API calls
  getCategoryMappings(): CategoryMapping {
    return {
      hotels: ['lodging', 'accommodation', 'hotel', 'resort', 'homestay'],
      restaurants: ['restaurant', 'food', 'dining', 'cafe', 'eatery'],
      attractions: ['tourist_attraction', 'point_of_interest', 'museum', 'park'],
      monasteries: ['place_of_worship', 'religious', 'spiritual', 'monastery'],
      local_cuisine: ['restaurant', 'food', 'local_food', 'traditional_food'],
      nightlife: ['night_club', 'bar', 'entertainment', 'nightlife'],
      essentials: ['hospital', 'pharmacy', 'bank', 'atm', 'gas_station'],
      hidden_gems: ['tourist_attraction', 'natural_feature', 'point_of_interest'],
      outdoors: ['park', 'natural_feature', 'camping_ground', 'hiking_area'],
      family_friendly: ['amusement_park', 'zoo', 'aquarium', 'park', 'family_fun']
    };
  }
}

export const intentDetectionService = new IntentDetectionService(); 