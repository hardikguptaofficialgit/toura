  import React, { useState } from 'react';
  import { Sparkles, Wand2, MapPin, Calendar, Users, DollarSign, Heart, Zap } from 'lucide-react';
  import { Trip } from '../services/tripStorage';
  import { AITripGeneratorService, AIRequest, TripSuggestion } from '../services/aiTripGenerator';

  interface AITripFormProps {
    trip: Partial<Trip>;
    onTripUpdate: (updates: Partial<Trip>) => void;
    onTripGenerated: (trip: Partial<Trip>) => void;
  }

  const AITripForm: React.FC<AITripFormProps> = ({ trip, onTripUpdate, onTripGenerated }) => {
    const [aiRequest, setAiRequest] = useState<AIRequest>({
      description: '',
      destination: '',
      duration: 3,
      interests: [],
      budget: 'medium',
      travelStyle: 'moderate'
    });
    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedSuggestions, setGeneratedSuggestions] = useState<TripSuggestion[]>([]);
    const [selectedSuggestion, setSelectedSuggestion] = useState<TripSuggestion | null>(null);

    const interests = [
      'Culture & History', 'Nature & Outdoors', 'Food & Dining', 'Adventure Sports',
      'Art & Museums', 'Beaches & Relaxation', 'Nightlife', 'Shopping',
      'Photography', 'Wildlife', 'Architecture', 'Music & Festivals'
    ];

    const handleInterestToggle = (interest: string) => {
      const updatedInterests = aiRequest.interests?.includes(interest)
        ? aiRequest.interests.filter(i => i !== interest)
        : [...(aiRequest.interests || []), interest];
      
      setAiRequest(prev => ({ ...prev, interests: updatedInterests }));
    };

    const handleGenerateTrip = async () => {
      if (!aiRequest.description.trim()) {
        alert('Please provide a trip description');
        return;
      }

      setIsGenerating(true);
      try {
        const suggestions = await AITripGeneratorService.generateTripSuggestions(aiRequest);
        setGeneratedSuggestions(suggestions);
        if (suggestions.length > 0) {
          setSelectedSuggestion(suggestions[0]);
        }
      } catch (error) {
        console.error('Error generating trip:', error);
        alert('Failed to generate trip suggestions. Please try again.');
      } finally {
        setIsGenerating(false);
      }
    };

    const handleApplySuggestion = (suggestion: TripSuggestion) => {
      const generatedTrip: Partial<Trip> = {
        name: suggestion.name,
        destination: suggestion.destination,
        description: suggestion.description,
        duration: suggestion.duration,
        stops: suggestion.stops.map(stop => ({
          id: `stop_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          name: stop.name,
          type: stop.type,
          description: stop.description,
          location: {
            name: stop.location.name,
            lat: stop.location.lat,
            lon: stop.location.lon
          },
          estimatedDuration: stop.estimatedDuration,
          category: stop.category,
          importance: stop.importance
        })),
        tags: aiRequest.interests || [],
        status: 'draft'
      };

      onTripGenerated(generatedTrip);
    };

    return (
      <div className="space-y-6 pb-6">
        {/* AI Trip Generator Header */}
        <div className="text-center py-4">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <Sparkles className="h-6 w-6 text-orange-600" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              AI Trip Assistant
            </h3>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Describe your dream trip and let AI create a personalized itinerary
          </p>
        </div>

        {/* Trip Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Describe your trip *
          </label>
          <textarea
            value={aiRequest.description}
            onChange={(e) => setAiRequest(prev => ({ ...prev, description: e.target.value }))}
            placeholder="e.g., I want to explore monasteries, try local Sikkimese cuisine, and enjoy scenic landscapes for 5 days in Sikkim..."
            rows={4}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-gray-800 dark:text-white resize-none"
          />
        </div>

        {/* Destination */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Destination (optional)
          </label>
          <input
            type="text"
            value={aiRequest.destination || ''}
            onChange={(e) => setAiRequest(prev => ({ ...prev, destination: e.target.value }))}
            placeholder="e.g., Gangtok, Pelling, Tsomgo Lake..."
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
          />
        </div>

        {/* Duration */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Duration (days)
          </label>
          <input
            type="number"
            min="1"
            max="30"
            value={aiRequest.duration || 3}
            onChange={(e) => setAiRequest(prev => ({ ...prev, duration: parseInt(e.target.value) || 3 }))}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
          />
        </div>

        {/* Interests */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Your Interests
          </label>
          <div className="grid grid-cols-2 gap-2">
            {interests.map((interest) => (
              <button
                key={interest}
                onClick={() => handleInterestToggle(interest)}
                className={`p-3 text-sm rounded-lg border transition-colors ${
                  aiRequest.interests?.includes(interest)
                    ? 'bg-orange-100 dark:bg-orange-900 border-orange-500 text-orange-700 dark:text-orange-300'
                    : 'bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                {interest}
              </button>
            ))}
          </div>
        </div>

        {/* Budget and Travel Style */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Budget
            </label>
            <select
              value={aiRequest.budget || 'medium'}
              onChange={(e) => setAiRequest(prev => ({ ...prev, budget: e.target.value as 'low' | 'medium' | 'high' }))}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
            >
              <option value="low">Budget-friendly</option>
              <option value="medium">Moderate</option>
              <option value="high">Luxury</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Travel Style
            </label>
            <select
              value={aiRequest.travelStyle || 'moderate'}
              onChange={(e) => setAiRequest(prev => ({ ...prev, travelStyle: e.target.value as 'relaxed' | 'moderate' | 'adventurous' }))}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
            >
              <option value="relaxed">Relaxed</option>
              <option value="moderate">Moderate</option>
              <option value="adventurous">Adventurous</option>
            </select>
          </div>
        </div>

        {/* Generate Button */}
        <div className="pt-4">
          <button
            onClick={handleGenerateTrip}
            disabled={isGenerating || !aiRequest.description.trim()}
            className="w-full flex items-center justify-center space-x-2 px-6 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
          >
            {isGenerating ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Generating your trip...</span>
              </>
            ) : (
              <>
                <Wand2 className="h-5 w-5" />
                <span>Generate AI Trip</span>
              </>
            )}
          </button>
        </div>

        {/* Generated Suggestions */}
        {generatedSuggestions.length > 0 && (
          <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              AI Generated Trip Suggestions
            </h4>
            
            {generatedSuggestions.map((suggestion, index) => (
              <div
                key={index}
                className={`p-4 border rounded-lg mb-4 cursor-pointer transition-colors ${
                  selectedSuggestion === suggestion
                    ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20'
                    : 'border-gray-300 dark:border-gray-600 hover:border-orange-300 dark:hover:border-orange-500'
                }`}
                onClick={() => setSelectedSuggestion(suggestion)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h5 className="font-semibold text-gray-900 dark:text-white mb-1">
                      {suggestion.name}
                    </h5>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      {suggestion.destination} • {suggestion.duration} days
                    </p>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      {suggestion.description}
                    </p>
                    <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500 dark:text-gray-400">
                      <span className="flex items-center">
                        <MapPin className="h-3 w-3 mr-1" />
                        {suggestion.stops.length} stops
                      </span>
                      <span className="flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        {suggestion.duration} days
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleApplySuggestion(suggestion);
                    }}
                    className="ml-4 px-4 py-2 bg-orange-600 text-white text-sm rounded-lg hover:bg-orange-700 transition-colors"
                  >
                    Use This Trip
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  export default AITripForm;