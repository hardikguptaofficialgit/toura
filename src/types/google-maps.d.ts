// Google Maps TypeScript declarations

declare global {
  interface Window {
    google: typeof google;
  }
}

declare namespace google {
  namespace maps {
    class StreetViewPanorama {
      constructor(
        container: HTMLElement,
        opts?: StreetViewPanoramaOptions
      );
      
      setPov(pov: StreetViewPov): void;
      getPov(): StreetViewPov;
      setZoom(zoom: number): void;
      getZoom(): number;
      addListener(eventName: string, handler: () => void): void;
    }

    class StreetViewService {
      getPanorama(
        request: StreetViewLocationRequest,
        callback: (data: StreetViewPanoramaData, status: StreetViewStatus) => void
      ): void;
    }

    interface StreetViewPanoramaOptions {
      position?: LatLng;
      pov?: StreetViewPov;
      zoom?: number;
      addressControl?: boolean;
      linksControl?: boolean;
      panControl?: boolean;
      zoomControl?: boolean;
      fullscreenControl?: boolean;
      motionTracking?: boolean;
      motionTrackingControl?: boolean;
    }

    interface StreetViewPov {
      heading: number;
      pitch: number;
    }

    interface StreetViewLocationRequest {
      location: LatLng | LatLngLiteral;
      radius?: number;
      source?: StreetViewSource;
    }

    interface StreetViewPanoramaData {
      location?: StreetViewLocation;
    }

    interface StreetViewLocation {
      latLng?: LatLng;
      description?: string;
      pano?: string;
    }

    enum StreetViewSource {
      DEFAULT = 'default',
      OUTDOOR = 'outdoor'
    }

    enum StreetViewStatus {
      OK = 'OK',
      UNKNOWN_ERROR = 'UNKNOWN_ERROR',
      ZERO_RESULTS = 'ZERO_RESULTS'
    }

    interface LatLng {
      lat(): number;
      lng(): number;
    }

    interface LatLngLiteral {
      lat: number;
      lng: number;
    }
  }
}

export {}; 