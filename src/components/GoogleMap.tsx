import React, { useEffect, useRef } from 'react';
import { Loader } from '@googlemaps/js-api-loader';

// Declare google maps types
declare const google: any;

interface GoogleMapProps {
  center?: { lat: number; lng: number };
  zoom?: number;
  markers?: Array<{ lat: number; lng: number; title: string }>;
  className?: string;
}

const GoogleMap: React.FC<GoogleMapProps> = ({
  center = { lat: 20.5937, lng: 78.9629 }, // India center
  zoom = 5,
  markers = [],
  className = "w-full h-64 rounded-2xl"
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);

  useEffect(() => {
    const initMap = async () => {
      const loader = new Loader({
        apiKey: 'YOUR_GOOGLE_MAPS_API_KEY', // Replace with actual API key
        version: 'weekly',
      });

      try {
        await loader.load();
        
        if (mapRef.current && !mapInstanceRef.current) {
          mapInstanceRef.current = new google.maps.Map(mapRef.current, {
            center,
            zoom,
            styles: [
              {
                featureType: 'all',
                elementType: 'geometry.fill',
                stylers: [{ color: '#f5f5f5' }]
              },
              {
                featureType: 'water',
                elementType: 'geometry',
                stylers: [{ color: '#e9e9e9' }]
              }
            ]
          });

          // Add markers
          markers.forEach(marker => {
            new google.maps.Marker({
              position: { lat: marker.lat, lng: marker.lng },
              map: mapInstanceRef.current,
              title: marker.title,
            });
          });
        }
      } catch (error) {
        console.log('Google Maps failed to load:', error);
        // Show placeholder when API key is not available
        if (mapRef.current) {
          mapRef.current.innerHTML = `
            <div class="w-full h-full bg-gray-200 dark:bg-gray-800 rounded-2xl flex items-center justify-center">
              <div class="text-center">
                <div class="text-gray-500 dark:text-gray-400 mb-2">🗺️</div>
                <p class="text-gray-600 dark:text-gray-300 text-sm">Interactive Map</p>
                <p class="text-gray-500 dark:text-gray-400 text-xs">Google Maps integration ready</p>
              </div>
            </div>
          `;
        }
      }
    };

    initMap();
  }, [center, zoom, markers]);

  return <div ref={mapRef} className={className} />;
};

export default GoogleMap;