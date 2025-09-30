// AI Trip Generator service using Google GenAI SDK
import { GoogleGenAI } from '@google/genai';
export interface TripSuggestion {
  name: string;
  destination: string;
  description: string;
  duration: number; // in days
  stops: TripStop[];
}

export interface TripStop {
  name: string;
  type: 'attraction' | 'restaurant' | 'hotel' | 'activity';
  description: string;
  location: {
    name: string;
    lat?: number;
    lon?: number;
  };
  estimatedDuration: string; // e.g., "2 hours", "1 day"
  category: string;
  importance: 'high' | 'medium' | 'low';
}

export interface AIRequest {
  description: string;
  destination?: string;
  duration?: number;
  interests?: string[];
  budget?: 'low' | 'medium' | 'high';
  travelStyle?: 'relaxed' | 'moderate' | 'adventurous';
}

export class AITripGeneratorService {
  private static readonly GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY as string | undefined;
  private static readonly GEMINI_MODEL = 'gemini-2.5-flash';

  private static getClient(): GoogleGenAI {
    if (!this.GEMINI_API_KEY) {
      throw new Error('Gemini API key not configured. Please set VITE_GEMINI_API_KEY in your environment variables.');
    }
    return new GoogleGenAI({ apiKey: this.GEMINI_API_KEY });
  }

  // Generate trip suggestions using AI
  static async generateTripSuggestions(request: AIRequest): Promise<TripSuggestion[]> {
    const client = this.getClient();

    try {
      const prompt = this.buildPrompt(request);
      
      const result = await client.models.generateContent({
        model: this.GEMINI_MODEL,
        contents: prompt
      } as any);

      let generatedText: any = (result as any)?.text;
      if (!generatedText) {
        const maybeFunc = (result as any)?.response?.text;
        if (typeof maybeFunc === 'function') {
          try {
            generatedText = await maybeFunc.call((result as any).response);
          } catch {}
        } else {
          generatedText = (result as any)?.response?.text;
        }
      }
      if (!generatedText) {
        const candidates = (result as any)?.response?.candidates || (result as any)?.candidates;
        if (Array.isArray(candidates) && candidates.length > 0) {
          const parts = candidates[0]?.content?.parts;
          if (Array.isArray(parts) && parts.length > 0) {
            generatedText = parts.map((p: any) => p?.text).filter(Boolean).join('\n');
          }
        }
      }
      
      if (!generatedText) {
        throw new Error('No content generated from AI. The response may have been blocked by safety filters.');
      }

      return this.parseAIResponse(generatedText);
    } catch (error) {
      console.error('AI trip generation error:', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to generate trip suggestions');
    }
  }

  private static buildPrompt(request: AIRequest): string {
    const { description, destination, duration, interests, budget, travelStyle } = request;
    
    let prompt = `You are a travel planning expert. Generate a detailed trip itinerary based on the following request:

Description: ${description}
${destination ? `Destination: ${destination}` : ''}
${duration ? `Duration: ${duration} days` : ''}
${interests ? `Interests: ${interests.join(', ')}` : ''}
${budget ? `Budget: ${budget}` : ''}
${travelStyle ? `Travel Style: ${travelStyle}` : ''}

Please provide a comprehensive trip plan in the following JSON format:
{
  "name": "Trip Name",
  "destination": "Main destination city/country",
  "description": "Brief description of the trip",
  "duration": number_of_days,
  "stops": [
    {
      "name": "Stop name",
      "type": "attraction|restaurant|hotel|activity",
      "description": "What to do/see here",
      "location": {
        "name": "Location name",
        "lat": latitude_number,
        "lon": longitude_number
      },
      "estimatedDuration": "Time needed (e.g., '2 hours', '1 day')",
      "category": "Category (e.g., 'Museum', 'Park', 'Restaurant')",
      "importance": "high|medium|low"
    }
  ]
}

Requirements:
1. Include 5-15 stops depending on trip duration
2. Mix different types: attractions, restaurants, hotels, activities
3. Provide realistic coordinates for major cities/landmarks
4. Consider the travel style and budget
5. Include both must-see attractions and hidden gems
6. Provide practical duration estimates
7. Make the trip name catchy and descriptive

Generate a well-balanced itinerary that matches the user's preferences.`;

    return prompt;
  }

  private static parseAIResponse(text: string): TripSuggestion[] {
    try {
      // Try to extract JSON from the response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON found in AI response');
      }

      const parsed = JSON.parse(jsonMatch[0]);
      
      // Validate and format the response
      const suggestion: TripSuggestion = {
        name: parsed.name || 'AI Generated Trip',
        destination: parsed.destination || 'Unknown Destination',
        description: parsed.description || 'An amazing trip generated by AI',
        duration: parsed.duration || 3,
        stops: (parsed.stops || []).map((stop: any) => ({
          name: stop.name || 'Unknown Stop',
          type: stop.type || 'attraction',
          description: stop.description || 'A great place to visit',
          location: {
            name: stop.location?.name || 'Unknown Location',
            lat: stop.location?.lat,
            lon: stop.location?.lon
          },
          estimatedDuration: stop.estimatedDuration || '1 hour',
          category: stop.category || 'General',
          importance: stop.importance || 'medium'
        }))
      };

      return [suggestion];
    } catch (error) {
      console.error('Error parsing AI response:', error);
      // Return a fallback suggestion
      return [{
        name: 'AI Generated Trip',
        destination: 'Your Destination',
        description: 'An amazing trip generated by AI',
        duration: 3,
        stops: [
          {
            name: 'Sample Attraction',
            type: 'attraction',
            description: 'A must-visit location',
            location: { name: 'Sample Location' },
            estimatedDuration: '2 hours',
            category: 'Attraction',
            importance: 'high'
          }
        ]
      }];
    }
  }

  // Generate multiple trip options
  static async generateMultipleOptions(request: AIRequest): Promise<TripSuggestion[]> {
    try {
      const suggestions = await this.generateTripSuggestions(request);
      
      // For now, return the single suggestion
      // In the future, we could modify the prompt to generate multiple options
      return suggestions;
    } catch (error) {
      console.error('Error generating multiple options:', error);
      throw error;
    }
  }

  // Enhance existing trip with AI suggestions
  static async enhanceTrip(tripDescription: string, existingStops: TripStop[]): Promise<TripStop[]> {
    const client = this.getClient();

    try {
      const prompt = `You are a travel planning expert. Based on this trip description and existing stops, suggest additional stops that would complement the itinerary:

Trip Description: ${tripDescription}

Existing Stops:
${existingStops.map(stop => `- ${stop.name} (${stop.type}): ${stop.description}`).join('\n')}

Please suggest 3-5 additional stops in JSON format:
[
  {
    "name": "Stop name",
    "type": "attraction|restaurant|hotel|activity",
    "description": "What to do/see here",
    "location": {
      "name": "Location name"
    },
    "estimatedDuration": "Time needed",
    "category": "Category",
    "importance": "high|medium|low"
  }
]

Focus on:
1. Filling gaps in the itinerary
2. Adding variety to the trip
3. Considering proximity to existing stops
4. Matching the trip's theme and style`;

      const result = await client.models.generateContent({
        model: this.GEMINI_MODEL,
        contents: prompt
      } as any);

      let generatedText: any = (result as any)?.text;
      if (!generatedText) {
        const maybeFunc = (result as any)?.response?.text;
        if (typeof maybeFunc === 'function') {
          try {
            generatedText = await maybeFunc.call((result as any).response);
          } catch {}
        } else {
          generatedText = (result as any)?.response?.text;
        }
      }
      if (!generatedText) {
        const candidates = (result as any)?.response?.candidates || (result as any)?.candidates;
        if (Array.isArray(candidates) && candidates.length > 0) {
          const parts = candidates[0]?.content?.parts;
          if (Array.isArray(parts) && parts.length > 0) {
            generatedText = parts.map((p: any) => p?.text).filter(Boolean).join('\n');
          }
        }
      }
      
      if (!generatedText) {
        return [];
      }

      const jsonMatch = generatedText.match(/\[[\s\S]*\]/);
      if (!jsonMatch) {
        return [];
      }

      const parsed = JSON.parse(jsonMatch[0]);
      return parsed.map((stop: any) => ({
        name: stop.name || 'Suggested Stop',
        type: stop.type || 'attraction',
        description: stop.description || 'A great addition to your trip',
        location: {
          name: stop.location?.name || 'Unknown Location'
        },
        estimatedDuration: stop.estimatedDuration || '1 hour',
        category: stop.category || 'General',
        importance: stop.importance || 'medium'
      }));
    } catch (error) {
      console.error('Error enhancing trip:', error);
      return [];
    }
  }
}