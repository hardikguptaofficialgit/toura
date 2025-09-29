import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MapPin, 
  X, 
  Star, 
  Phone, 
  Globe, 
  Clock,
  Navigation2,
  ZoomIn,
  ZoomOut,
  Layers,
  Heart,
  Share2
} from 'lucide-react';
// Theme removed; default to light mode

// Import Leaflet dynamically to avoid SSR issues
let L: any = null;
if (typeof window !== 'undefined') {
  import('leaflet').then((leaflet) => {
    L = leaflet.default;
    
    // Import Leaflet CSS
    import('leaflet/dist/leaflet.css');
    
    // Import marker clustering
    import('leaflet.markercluster').then(() => {
      import('leaflet.markercluster/dist/MarkerCluster.css');
      import('leaflet.markercluster/dist/MarkerCluster.Default.css');
    });
  });
}

interface Place {
  id: string;
  name: string;
  category: string;
  rating?: number;
  reviews?: number;
  price?: string;
  image?: string;
  address: string;
  description: string;
  coordinates: { lat: number; lng: number };
  features: string[];
  contact?: {
    phone?: string;
    website?: string;
  };
}

interface InteractiveMapProps {
  places: Place[];
  center?: { lat: number; lng: number };
  zoom?: number;
  onPlaceSelect?: (place: Place) => void;
  className?: string;
}

const InteractiveMap: React.FC<InteractiveMapProps> = ({
  places,
  center = { lat: 27.3389, lng: 88.6065 }, // Sikkim center
  zoom = 10,
  onPlaceSelect,
  className = ''
}) => {
  const isDarkMode = false;
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);
  const markersGroup = useRef<any>(null);
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [mapStyle, setMapStyle] = useState<'standard' | 'satellite' | 'terrain'>('standard');
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  // Initialize map
  useEffect(() => {
    if (!mapRef.current || !L) return;

    if (!mapInstance.current) {
      mapInstance.current = L.map(mapRef.current, {
        center: [center.lat, center.lng],
        zoom: zoom,
        zoomControl: false,
        attributionControl: false
      });

      // Add custom attribution
      L.control.attribution({
        prefix: false
      }).addTo(mapInstance.current);

      // Add tile layer based on style
      updateMapStyle(mapStyle);

      // Add custom zoom controls
      const zoomControl = L.control.zoom({
        position: 'bottomright'
      });
      mapInstance.current.addControl(zoomControl);

      // Initialize marker cluster group
      markersGroup.current = L.markerClusterGroup({
        chunkedLoading: true,
        maxClusterRadius: 50,
        iconCreateFunction: (cluster: any) => {
          const count = cluster.getChildCount();
          let className = 'marker-cluster-small';
          
          if (count > 10) className = 'marker-cluster-medium';
          if (count > 20) className = 'marker-cluster-large';

          return L.divIcon({
            html: `<div><span>${count}</span></div>`,
            className: `marker-cluster ${className}`,
            iconSize: L.point(40, 40)
          });
        }
      });

      mapInstance.current.addLayer(markersGroup.current);
    }

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, []);

  // Update map style
  const updateMapStyle = (style: 'standard' | 'satellite' | 'terrain') => {
    if (!mapInstance.current) return;

    // Remove existing tile layers
    mapInstance.current.eachLayer((layer: any) => {
      if (layer instanceof L.TileLayer) {
        mapInstance.current.removeLayer(layer);
      }
    });

    let tileLayer;
    switch (style) {
      case 'satellite':
        tileLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
          attribution: '&copy; Esri'
        });
        break;
      case 'terrain':
        tileLayer = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; OpenTopoMap'
        });
        break;
      default:
        tileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; OpenStreetMap contributors'
        });
    }

    tileLayer.addTo(mapInstance.current);
  };

  // Update markers when places change
  useEffect(() => {
    if (!markersGroup.current || !L) return;

    // Clear existing markers
    markersGroup.current.clearLayers();

    // Add new markers
    places.forEach(place => {
      const marker = createMarker(place);
      markersGroup.current.addLayer(marker);
    });

    // Fit bounds to show all markers
    if (places.length > 0) {
      const group = new L.featureGroup(markersGroup.current.getLayers());
      mapInstance.current.fitBounds(group.getBounds().pad(0.1));
    }
  }, [places]);

  // Create custom marker
  const createMarker = (place: Place) => {
    const icon = getMarkerIcon(place.category);
    const marker = L.marker([place.coordinates.lat, place.coordinates.lng], {
      icon: L.divIcon({
        html: `
          <div class="custom-marker ${isDarkMode ? 'dark' : ''}">
            <div class="marker-icon">
              ${icon}
            </div>
            <div class="marker-pulse"></div>
          </div>
        `,
        className: 'custom-div-icon',
        iconSize: [30, 30],
        iconAnchor: [15, 15]
      })
    });

    // Add click event
    marker.on('click', () => {
      setSelectedPlace(place);
      onPlaceSelect?.(place);
    });

    return marker;
  };

  // Get marker icon based on category
  const getMarkerIcon = (category: string): string => {
    const icons: Record<string, string> = {
      'Hotel': '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M19 7h-3V6c0-1.1-.9-2-2-2s-2 .9-2 2v1H8V6c0-1.1-.9-2-2-2S4 4.9 4 6v1H3c-1.1 0-2 .9-2 2v11h2V9h16v11h2V9c0-1.1-.9-2-2-2zM6 8V6h2v2H6zm8 0V6h2v2h-2z"/></svg>',
      'Restaurant': '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8.1 13.34l2.83-2.83L3.91 3.5c-1.56 1.56-1.56 4.09 0 5.66l4.19 4.18zm6.78-1.81c1.53.71 3.68.21 5.27-1.38 1.91-1.91 2.28-4.65.81-6.12-1.46-1.46-4.2-1.1-6.12.81-1.59 1.59-2.09 3.74-1.38 5.27L3.7 19.87l1.41 1.41L12 14.41l6.88 6.88 1.41-1.41L13.41 13l1.47-1.47z"/></svg>',
      'Attraction': '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>',
      'Monastery': '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/></svg>'
    };
    
    return icons[category] || icons['Attraction'];
  };

  // Toggle favorite
  const toggleFavorite = (placeId: string) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(placeId)) {
        newFavorites.delete(placeId);
      } else {
        newFavorites.add(placeId);
      }
      return newFavorites;
    });
  };

  // Share place
  const sharePlace = async (place: Place) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: place.name,
          text: place.description,
          url: window.location.href
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback to clipboard
      navigator.clipboard.writeText(`${place.name} - ${window.location.href}`);
    }
  };

  if (!L) {
    return (
      <div className={`${className} flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-xl`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading map...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {/* Map Container */}
      <div ref={mapRef} className="w-full h-full rounded-xl overflow-hidden shadow-lg" />

      {/* Map Controls */}
      <div className="absolute top-4 left-4 z-[1000] flex flex-col space-y-2">
        {/* Style Selector */}
        <div className={`p-2 rounded-lg shadow-lg backdrop-blur-lg ${
          isDarkMode ? 'bg-black/80' : 'bg-white/90'
        }`}>
          <div className="flex space-x-1">
            {(['standard', 'satellite', 'terrain'] as const).map(style => (
              <button
                key={style}
                onClick={() => {
                  setMapStyle(style);
                  updateMapStyle(style);
                }}
                className={`px-3 py-1 text-xs rounded transition-colors ${
                  mapStyle === style
                    ? 'bg-orange-500 text-white'
                    : isDarkMode
                    ? 'text-gray-300 hover:bg-gray-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {style.charAt(0).toUpperCase() + style.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Layer Control */}
        <button
          className={`p-2 rounded-lg shadow-lg backdrop-blur-lg transition-colors ${
            isDarkMode ? 'bg-black/80 text-white hover:bg-black/90' : 'bg-white/90 text-gray-700 hover:bg-white'
          }`}
          title="Map Layers"
        >
          <Layers className="w-5 h-5" />
        </button>
      </div>

      {/* Selected Place Details */}
      <AnimatePresence>
        {selectedPlace && (
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            className="absolute bottom-4 left-4 right-4 z-[1000] max-w-md mx-auto"
          >
            <div className={`rounded-xl shadow-2xl backdrop-blur-lg overflow-hidden ${
              isDarkMode ? 'bg-black/90 border border-gray-700' : 'bg-white/95 border border-gray-200'
            }`}>
              {/* Image */}
              {selectedPlace.image && (
                <div className="relative h-48">
                  <img
                    src={selectedPlace.image}
                    alt={selectedPlace.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 right-3 flex space-x-2">
                    <button
                      onClick={() => toggleFavorite(selectedPlace.id)}
                      className={`p-2 rounded-full backdrop-blur-sm transition-colors ${
                        favorites.has(selectedPlace.id)
                          ? 'bg-red-500 text-white'
                          : 'bg-white/20 text-white hover:bg-white/30'
                      }`}
                    >
                      <Heart className="w-4 h-4" fill={favorites.has(selectedPlace.id) ? 'currentColor' : 'none'} />
                    </button>
                    <button
                      onClick={() => sharePlace(selectedPlace)}
                      className="p-2 rounded-full bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm transition-colors"
                    >
                      <Share2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* Content */}
              <div className="p-6">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <h3 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {selectedPlace.name}
                    </h3>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      {selectedPlace.category}
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedPlace(null)}
                    className={`p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Rating */}
                {selectedPlace.rating && (
                  <div className="flex items-center space-x-2 mb-3">
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className={`ml-1 font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {selectedPlace.rating}
                      </span>
                    </div>
                    {selectedPlace.reviews && (
                      <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        ({selectedPlace.reviews} reviews)
                      </span>
                    )}
                  </div>
                )}

                {/* Description */}
                <p className={`text-sm mb-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  {selectedPlace.description}
                </p>

                {/* Address */}
                <div className="flex items-start space-x-2 mb-3">
                  <MapPin className={`w-4 h-4 mt-0.5 flex-shrink-0 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                  <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {selectedPlace.address}
                  </span>
                </div>

                {/* Contact Info */}
                {selectedPlace.contact && (
                  <div className="space-y-2 mb-4">
                    {selectedPlace.contact.phone && (
                      <div className="flex items-center space-x-2">
                        <Phone className={`w-4 h-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                        <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          {selectedPlace.contact.phone}
                        </span>
                      </div>
                    )}
                    {selectedPlace.contact.website && (
                      <div className="flex items-center space-x-2">
                        <Globe className={`w-4 h-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                        <a
                          href={selectedPlace.contact.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-orange-500 hover:text-orange-600"
                        >
                          Visit Website
                        </a>
                      </div>
                    )}
                  </div>
                )}

                {/* Features */}
                {selectedPlace.features.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-4">
                    {selectedPlace.features.slice(0, 3).map(feature => (
                      <span
                        key={feature}
                        className={`px-2 py-1 text-xs rounded-lg ${
                          isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex space-x-2">
                  <button className="flex-1 py-2 px-4 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors">
                    Get Directions
                  </button>
                  <button className={`py-2 px-4 rounded-lg border transition-colors ${
                    isDarkMode 
                      ? 'border-gray-600 text-gray-400 hover:bg-gray-700' 
                      : 'border-gray-300 text-gray-500 hover:bg-gray-50'
                  }`}>
                    Call
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Custom Styles */}
      <style>{`
        .custom-marker {
          position: relative;
          width: 30px;
          height: 30px;
        }

        .marker-icon {
          width: 30px;
          height: 30px;
          background: #f97316;
          border-radius: 50% 50% 50% 0;
          transform: rotate(-45deg);
          border: 3px solid white;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
        }

        .marker-icon svg {
          width: 16px;
          height: 16px;
          color: white;
          transform: rotate(45deg);
        }

        .marker-pulse {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 30px;
          height: 30px;
          background: #f97316;
          border-radius: 50%;
          transform: translate(-50%, -50%);
          animation: pulse 2s infinite;
          opacity: 0.6;
          z-index: -1;
        }

        @keyframes pulse {
          0% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 0.6;
          }
          70% {
            transform: translate(-50%, -50%) scale(2);
            opacity: 0;
          }
          100% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 0;
          }
        }

        .marker-cluster {
          background-color: rgba(249, 115, 22, 0.8);
          border-radius: 50%;
          text-align: center;
          border: 3px solid white;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
        }

        .marker-cluster div {
          width: 34px;
          height: 34px;
          margin-left: 5px;
          margin-top: 5px;
          border-radius: 50%;
          background-color: #f97316;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .marker-cluster span {
          color: white;
          font-weight: bold;
          font-size: 12px;
        }

        .marker-cluster-small div {
          background-color: #f97316;
        }

        .marker-cluster-medium div {
          background-color: #ea580c;
        }

        .marker-cluster-large div {
          background-color: #c2410c;
        }
      `}</style>
    </div>
  );
};

export default InteractiveMap; 