import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { TripStop } from '../services/tripStorage';

// Fix for default markers in Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

interface TripMapProps {
  stops: TripStop[];
  onStopSelect?: (stop: TripStop) => void;
  center?: [number, number];
  zoom?: number;
}

const TripMap: React.FC<TripMapProps> = ({ 
  stops, 
  onStopSelect, 
  center = [27.3389, 88.6065], // Default to Sikkim, India
  zoom = 10 
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const polylineRef = useRef<L.Polyline | null>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    // Initialize map
    const map = L.map(mapRef.current).setView(center, zoom);
    mapInstanceRef.current = map;

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(map);

    return () => {
      map.remove();
    };
  }, []);

  useEffect(() => {
    if (!mapInstanceRef.current) return;

    const map = mapInstanceRef.current;

    // Clear existing markers and polyline
    markersRef.current.forEach(marker => map.removeLayer(marker));
    markersRef.current = [];
    
    if (polylineRef.current) {
      map.removeLayer(polylineRef.current);
      polylineRef.current = null;
    }

    if (stops.length === 0) return;

    // Create markers for each stop
    const validStops = stops.filter(stop => stop.location.lat && stop.location.lon);
    
    if (validStops.length === 0) return;

    const coordinates: [number, number][] = [];

    validStops.forEach((stop, index) => {
      const lat = stop.location.lat!;
      const lon = stop.location.lon!;
      coordinates.push([lat, lon]);

      // Create custom icon based on stop type
      const iconColor = getIconColor(stop.type);
      const customIcon = L.divIcon({
        className: 'custom-marker',
        html: `
          <div style="
            background-color: ${iconColor};
            width: 30px;
            height: 30px;
            border-radius: 50%;
            border: 3px solid white;
            box-shadow: 0 2px 4px rgba(0,0,0,0.3);
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: bold;
            font-size: 12px;
          ">
            ${index + 1}
          </div>
        `,
        iconSize: [30, 30],
        iconAnchor: [15, 15],
      });

      const marker = L.marker([lat, lon], { icon: customIcon }).addTo(map);
      
      // Create popup content
      const popupContent = `
        <div class="p-2 min-w-[200px]">
          <h3 class="font-semibold text-gray-900 mb-1">${stop.name}</h3>
          <p class="text-sm text-gray-600 mb-2">${stop.description}</p>
          <div class="flex items-center space-x-2 text-xs text-gray-500">
            <span class="px-2 py-1 bg-gray-100 rounded">${stop.type}</span>
            <span>${stop.estimatedDuration}</span>
          </div>
          ${stop.location.name ? `<p class="text-xs text-gray-500 mt-1">📍 ${stop.location.name}</p>` : ''}
        </div>
      `;

      marker.bindPopup(popupContent);
      
      // Add click handler
      marker.on('click', () => {
        onStopSelect?.(stop);
      });

      markersRef.current.push(marker);
    });

    // Create polyline connecting all stops
    if (coordinates.length > 1) {
      const polyline = L.polyline(coordinates, {
        color: '#f97316',
        weight: 3,
        opacity: 0.8,
        dashArray: '5, 5'
      }).addTo(map);
      
      polylineRef.current = polyline;
    }

    // Fit map to show all markers
    if (coordinates.length > 0) {
      const group = new L.featureGroup(markersRef.current);
      map.fitBounds(group.getBounds().pad(0.1));
    }

  }, [stops, onStopSelect]);

  const getIconColor = (type: string): string => {
    switch (type) {
      case 'attraction':
        return '#3b82f6'; // Blue
      case 'restaurant':
        return '#ef4444'; // Red
      case 'hotel':
        return '#10b981'; // Green
      case 'activity':
        return '#f59e0b'; // Yellow
      default:
        return '#6b7280'; // Gray
    }
  };

  return (
    <div className="relative w-full h-full">
      <div ref={mapRef} className="w-full h-full rounded-lg" />
      
      {/* Map Controls */}
      <div className="absolute top-4 right-4 z-[1000] space-y-2">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-2">
          <div className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
            Legend
          </div>
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-xs text-gray-600 dark:text-gray-400">Attractions</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span className="text-xs text-gray-600 dark:text-gray-400">Restaurants</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-xs text-gray-600 dark:text-gray-400">Hotels</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <span className="text-xs text-gray-600 dark:text-gray-400">Activities</span>
            </div>
          </div>
        </div>
      </div>

      {/* Trip Summary */}
      {stops.length > 0 && (
        <div className="absolute bottom-4 left-4 z-[1000]">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-3">
            <div className="text-sm font-medium text-gray-900 dark:text-white mb-1">
              Trip Summary
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">
              {stops.length} stops • {stops.filter(s => s.location.lat && s.location.lon).length} mapped
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TripMap;