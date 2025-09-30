// VR Panorama Service
export interface VRPanorama {
  id: number;
  name: string;
  image: string;
  description: string;
  location: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  hotspots: VRHotspot[];
}

export interface VRHotspot {
  id: string;
  position: { x: number; y: number };
  title: string;
  description: string;
  type: 'info' | 'navigation' | 'audio';
}

export class VRService {
  private static panoramas: VRPanorama[] = [];

  private static toMonasterySlug(name: string): string {
    const lower = name.toLowerCase();
    const withoutMonastery = lower.replace(/\bmonastery\b/g, '').trim();
    const compact = withoutMonastery.replace(/[^a-z0-9]+/g, ' ').trim().replace(/\s+/g, '');
    // e.g., "Rumtek Monastery" -> "rumtek" -> "rumtekpano.jpg"
    return `${compact}pano.jpg`;
  }

  private static async imageExists(path: string): Promise<boolean> {
    try {
      const res = await fetch(path, { method: 'HEAD' });
      return res.ok;
    } catch {
      return false;
    }
  }

  static async getMonasteryPanoramaIfAvailable(
    name: string,
    coordinates?: { lat: number; lng: number }
  ): Promise<VRPanorama | null> {
    const fileName = this.toMonasterySlug(name);
    const imagePath = `/images/monasteries/${fileName}`;
    const exists = await this.imageExists(imagePath);
    if (!exists) return null;

    const idBase = Math.abs(
      Array.from(`${name}-${imagePath}`).reduce((acc, ch) => acc + ch.charCodeAt(0), 0)
    );
    return {
      id: idBase,
      name: `${name} - 360° View`,
      image: imagePath,
      description: `Immersive 360° view of ${name}.`,
      location: name,
      coordinates: coordinates || { lat: 27.3314, lng: 88.6138 },
      hotspots: []
    };
  }

  static async loadPanoramas(): Promise<VRPanorama[]> {
    if (this.panoramas.length === 0) {
      try {
        const response = await fetch('/src/data/vrPanoramas.json');
        this.panoramas = await response.json();
      } catch (error) {
        console.error('Failed to load VR panoramas:', error);
        // Fallback to default panoramas
        this.panoramas = this.getDefaultPanoramas();
      }
    }
    return this.panoramas;
  }

  static getPanoramaById(id: number): VRPanorama | undefined {
    return this.panoramas.find(p => p.id === id);
  }

  static getPanoramasByLocation(lat: number, lng: number, radius: number = 0.1): VRPanorama[] {
    return this.panoramas.filter(panorama => {
      const distance = this.calculateDistance(
        lat, lng, 
        panorama.coordinates.lat, panorama.coordinates.lng
      );
      return distance <= radius;
    });
  }

  static getRandomPanorama(): VRPanorama {
    const randomIndex = Math.floor(Math.random() * this.panoramas.length);
    return this.panoramas[randomIndex];
  }

  private static calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }

  private static getDefaultPanoramas(): VRPanorama[] {
    return [
      {
        id: 1,
        name: "Rumtek Monastery - Main Prayer Hall",
        image: "/images/pano1.avif",
        description: "Experience the grandeur of Rumtek Monastery's main prayer hall.",
        location: "Rumtek, Sikkim",
        coordinates: { lat: 27.2855, lng: 88.5804 },
        hotspots: [
          {
            id: "1",
            position: { x: 30, y: 40 },
            title: "Golden Buddha Statue",
            description: "The magnificent golden Buddha statue, the centerpiece of the prayer hall.",
            type: "info"
          }
        ]
      },
      {
        id: 2,
        name: "Pemayangtse Monastery - Courtyard View",
        image: "/images/pano2.avif",
        description: "Take in the peaceful courtyard of Pemayangtse Monastery.",
        location: "Pemayangtse, Sikkim",
        coordinates: { lat: 27.2500, lng: 88.2000 },
        hotspots: [
          {
            id: "1",
            position: { x: 25, y: 30 },
            title: "Kanchenjunga View",
            description: "Breathtaking view of the third highest mountain in the world.",
            type: "info"
          }
        ]
      },
      {
        id: 3,
        name: "Gangtok Cityscape - MG Marg View",
        image: "/images/pano3.avif",
        description: "Experience the vibrant heart of Gangtok from MG Marg.",
        location: "Gangtok, Sikkim",
        coordinates: { lat: 27.3314, lng: 88.6138 },
        hotspots: [
          {
            id: "1",
            position: { x: 40, y: 25 },
            title: "MG Marg Street",
            description: "The pedestrian-only main street of Gangtok.",
            type: "info"
          }
        ]
      }
    ];
  }
}