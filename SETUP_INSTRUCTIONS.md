# Toura - Complete Setup Instructions

## Overview
Toura is now a comprehensive travel discovery platform for Sikkim with TripAdvisor-like functionality including:

- **Tabbed Navigation**: Hotels, Restaurants, Things to Do, Monasteries
- **Advanced Search**: Google Places Autocomplete integration
- **Smart Filters**: Category-specific filtering system
- **API Integration**: OpenTripMap and Google Places APIs
- **Interactive Maps**: Leaflet with clustered markers
- **VR Experiences**: 360° views for monasteries and attractions
- **User Features**: Favorites, sharing, and smart recommendations
- **Immersive UI**: Modern animations and responsive design

## Required API Keys

### 1. OpenTripMap API
1. Visit [OpenTripMap Developer Portal](https://opentripmap.io/docs)
2. Register for a free account
3. Get your API key from the dashboard
4. Free tier: 1000 requests/day

### 2. Google Places API
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable these APIs:
   - Places API
   - Maps JavaScript API
   - Street View Static API
   - Geocoding API
4. Create credentials (API Key)
5. Set restrictions for security

### 3. Google Maps API
- Same as above, used for VR experiences and Street View

## Environment Setup

### 1. Create Environment File
Create a `.env` file in the root directory:

```env
# OpenTripMap API
VITE_OPENTRIPMAP_API_KEY=your_opentripmap_api_key_here

# Google APIs
VITE_GOOGLE_PLACES_API_KEY=your_google_places_api_key_here
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here

# Firebase (existing)
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
VITE_FIREBASE_APP_ID=your_firebase_app_id
```

### 2. Update Google Maps Script
In `index.html`, replace `YOUR_GOOGLE_MAPS_API_KEY` with your actual API key:

```html
<script async defer src="https://maps.googleapis.com/maps/api/js?key=YOUR_ACTUAL_API_KEY&libraries=places,streetview"></script>
```

### 3. Install Dependencies
The required packages have been added:

```bash
npm install leaflet leaflet.markercluster @types/leaflet @types/leaflet.markercluster
```

## New Features Implemented

### 1. Tabbed Search Interface (`src/components/TabbedSearchInterface.tsx`)
- **Four main tabs**: Hotels, Restaurants, Things to Do, Monasteries
- **Advanced filtering** with category-specific options
- **Real-time search** with API integration
- **Loading states** and error handling
- **Responsive design** for all devices

### 2. API Integration (`src/services/api.ts`)
- **OpenTripMap integration** for POI data and descriptions
- **Google Places integration** for ratings, reviews, and photos
- **Combined search results** with deduplication
- **Error handling** with fallback to mock data
- **Rate limiting** and performance optimization

### 3. VR Viewer (`src/components/VRViewer.tsx`)
- **Google Street View Panorama** integration
- **360° immersive experiences** for monasteries
- **Interactive hotspots** with information panels
- **Custom controls** for navigation and zoom
- **Fallback to static images** when Street View unavailable

### 4. Interactive Map (`src/components/InteractiveMap.tsx`)
- **Leaflet map** with multiple tile layers
- **Marker clustering** for dense regions
- **Custom markers** for different categories
- **Place details popup** with full information
- **Map style switching** (Standard, Satellite, Terrain)

### 5. Favorites & Sharing (`src/services/favorites.ts`)
- **Save places** to user favorites in Firebase
- **Share functionality** with Web Share API
- **Itinerary generation** from selected places
- **Smart recommendations** based on user preferences
- **Social sharing** with deep links

### 6. Smart Recommendations (`src/services/recommendations.ts`)
- **Nearby places** based on current location
- **Similar places** using machine learning algorithms
- **Complementary suggestions** (e.g., restaurants near monasteries)
- **Popular destinations** with high ratings
- **Personalized recommendations** based on user history

## Usage Instructions

### 1. Basic Search
1. Select a tab (Hotels, Restaurants, Things to Do, Monasteries)
2. Type your search query in the search box
3. Apply filters using the filter button
4. View results with ratings, photos, and details

### 2. VR Experience
1. Look for places with "VR Tour" feature badge
2. Click the eye icon on the place card
3. Enjoy 360° immersive experience
4. Click orange hotspots for information
5. Use controls for navigation and zoom

### 3. Map Integration
1. Click the map icon on any place card
2. View all search results on interactive map
3. Click markers to see place details
4. Switch between map styles
5. Use clustering for better performance

### 4. Favorites & Sharing
1. Click heart icon to save places
2. Access favorites from user profile
3. Share places using share button
4. Generate itineraries from saved places
5. Get smart recommendations

## Performance Optimization

### 1. API Optimization
- **Request caching** to reduce API calls
- **Parallel requests** for better performance
- **Fallback mechanisms** for reliability
- **Rate limiting** to stay within quotas

### 2. Map Performance
- **Marker clustering** for large datasets
- **Lazy loading** of map resources
- **Efficient re-rendering** on search updates
- **Memory management** for long sessions

### 3. Image Optimization
- **Progressive loading** for place images
- **WebP format** where supported
- **Responsive images** for different screen sizes
- **Placeholder images** while loading

## Troubleshooting

### Common Issues

1. **API Key Errors**
   - Check if all API keys are correctly set in `.env`
   - Verify API restrictions in Google Cloud Console
   - Ensure billing is enabled for Google APIs

2. **Map Not Loading**
   - Check Google Maps script in `index.html`
   - Verify Maps JavaScript API is enabled
   - Check browser console for errors

3. **VR Viewer Issues**
   - Street View may not be available for all locations
   - Check if location has Street View coverage
   - Fallback images will be shown automatically

4. **Search Not Working**
   - Verify OpenTripMap and Google Places APIs are enabled
   - Check network connectivity
   - Review browser console for API errors

### Performance Issues

1. **Slow Loading**
   - Check internet connection
   - Verify API response times
   - Consider reducing search radius

2. **Memory Usage**
   - Clear favorites and search history
   - Restart browser if necessary
   - Check for memory leaks in browser dev tools

## Development Notes

### File Structure
```
src/
├── components/
│   ├── TabbedSearchInterface.tsx    # Main search interface
│   ├── VRViewer.tsx                 # VR experience component
│   ├── InteractiveMap.tsx           # Map integration
│   └── ...
├── services/
│   ├── api.ts                       # API integration
│   ├── favorites.ts                 # Favorites & sharing
│   └── recommendations.ts           # Smart recommendations
├── types/
│   └── google-maps.d.ts            # Google Maps types
└── ...
```

### Key Technologies
- **React 18** with TypeScript
- **Framer Motion** for animations
- **Tailwind CSS** for styling
- **Firebase** for backend services
- **Leaflet** for interactive maps
- **Google Maps APIs** for places and street view
- **OpenTripMap API** for POI data

## Next Steps

1. **Testing**: Test all features with real API keys
2. **Optimization**: Monitor API usage and optimize requests
3. **Content**: Add more detailed place descriptions
4. **Features**: Consider adding user reviews and ratings
5. **Analytics**: Track user interactions and popular searches

## Support

For any issues or questions:
1. Check browser console for errors
2. Verify all API keys are correctly configured
3. Ensure all required APIs are enabled
4. Test with different search queries and locations

The application now provides a comprehensive TripAdvisor-like experience for discovering Sikkim with modern features like VR experiences, interactive maps, and intelligent recommendations! 