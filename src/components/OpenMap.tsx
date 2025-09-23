import React, { useEffect, useRef } from 'react';
// Lightweight Leaflet map using OpenStreetMap tiles
// Assumes leaflet is installed (or you can load via CDN as fallback)

type LatLng = { lat: number; lng: number };

interface MapMarker { id: string; position: LatLng; title?: string }

interface Props {
  center: LatLng;
  zoom?: number;
  markers?: MapMarker[];
  path?: LatLng[];
  className?: string;
  onMapClick?: (position: LatLng) => void;
  onMarkerDrag?: (id: string, position: LatLng) => void;
}

declare const L: any;

const OpenMap: React.FC<Props> = ({ center, zoom = 12, markers = [], path = [], className = 'w-full h-80 rounded-2xl', onMapClick, onMarkerDrag }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const instanceRef = useRef<any>(null);
  const layerRef = useRef<any>(null);
  const pathRef = useRef<any>(null);
  const markerRefs = useRef<Record<string, any>>({});

  useEffect(() => {
    let cleanup: (() => void) | undefined;
    const init = async () => {
      // Load Leaflet via CDN if not present
      if (typeof (window as any).L === 'undefined') {
        const css = document.createElement('link');
        css.rel = 'stylesheet';
        css.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        document.head.appendChild(css);
        const script = document.createElement('script');
        script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
        document.body.appendChild(script);
        await new Promise(res => { script.onload = res; });
      }

      const Lref: any = (window as any).L;
      if (!mapRef.current) return;
      const map = Lref.map(mapRef.current).setView([center.lat, center.lng], zoom);
      instanceRef.current = map;
      Lref.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(map);

      layerRef.current = Lref.layerGroup().addTo(map);
      pathRef.current = Lref.polyline([], { color: '#ea580c', weight: 4, opacity: 0.8 }).addTo(map);

      if (onMapClick) {
        map.on('click', (e: any) => {
          const p = { lat: e.latlng.lat, lng: e.latlng.lng };
          onMapClick(p);
        });
      }

      cleanup = () => { map.remove(); };
    };
    init();
    return () => { if (cleanup) cleanup(); };
  }, []);

  // Update markers & path
  useEffect(() => {
    const map = instanceRef.current;
    const Lref: any = (window as any).L;
    if (!map || !Lref || !layerRef.current) return;
    layerRef.current.clearLayers();
    markerRefs.current = {};

    markers.forEach(m => {
      const marker = Lref.marker([m.position.lat, m.position.lng], { draggable: !!onMarkerDrag, title: m.title || '' });
      if (onMarkerDrag) {
        marker.on('dragend', (e: any) => {
          const { lat, lng } = e.target.getLatLng();
          onMarkerDrag(m.id, { lat, lng });
        });
      }
      marker.addTo(layerRef.current);
      markerRefs.current[m.id] = marker;
    });

    if (pathRef.current) {
      pathRef.current.setLatLngs(path.map(p => [p.lat, p.lng]));
    }
  }, [markers, path, onMarkerDrag]);

  return <div ref={mapRef} className={className} />;
};

export default OpenMap;


