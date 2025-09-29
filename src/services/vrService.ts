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