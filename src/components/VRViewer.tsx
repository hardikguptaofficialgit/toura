import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  RotateCcw, 
  ZoomIn, 
  ZoomOut, 
  Move3D, 
  Camera,
  Navigation,
  Info,
  Maximize,
  Volume2,
  VolumeX,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { VRService, VRPanorama, VRHotspot } from '../services/vrService';

interface VRViewerProps {
  isOpen: boolean;
  onClose: () => void;
  place: {
    name: string;
    coordinates: { lat: number; lng: number };
    description?: string;
    images?: string[];
  };
}

const VRViewer: React.FC<VRViewerProps> = ({ isOpen, onClose, place }) => {
  const panoramaRef = useRef<HTMLDivElement>(null);
  const [panoViewer, setPanoViewer] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [hotSpots, setHotSpots] = useState<VRHotspot[]>([]);
  const [activeHotSpot, setActiveHotSpot] = useState<VRHotspot | null>(null);
  const [isAudioEnabled, setIsAudioEnabled] = useState(false);
  const [availablePanoramas, setAvailablePanoramas] = useState<VRPanorama[]>([]);
  const [currentPanoramaIndex, setCurrentPanoramaIndex] = useState(0);
  const [currentPanorama, setCurrentPanorama] = useState<VRPanorama | null>(null);

  // Toggle global class to hide floating UI (e.g., chatbot, nav effects) while VR is open
  useEffect(() => {
    if (!isOpen) return;
    document.body.classList.add('vr-open');
    return () => { document.body.classList.remove('vr-open'); };
  }, [isOpen]);

  // Load available panoramas
  useEffect(() => {
    const loadPanoramas = async () => {
      try {
        const panoramas = await VRService.loadPanoramas();
        setAvailablePanoramas(panoramas);
        
        // Find panoramas near the current place
        const nearbyPanoramas = VRService.getPanoramasByLocation(
          place.coordinates.lat, 
          place.coordinates.lng, 
          0.5 // 0.5 degree radius
        );
        
        if (nearbyPanoramas.length > 0) {
          setCurrentPanorama(nearbyPanoramas[0]);
          setCurrentPanoramaIndex(0);
        } else {
          // Fallback to first available panorama
          setCurrentPanorama(panoramas[0]);
          setCurrentPanoramaIndex(0);
        }
      } catch (error) {
        console.error('Failed to load panoramas:', error);
        setError('Failed to load VR panoramas');
      }
    };

    if (isOpen) {
      loadPanoramas();
    }
  }, [isOpen, place.coordinates]);

  useEffect(() => {
    if (!isOpen || !panoramaRef.current || !currentPanorama) return;

    const loadPannellumAssets = async () => {
      await Promise.all([
        ensureStylesheet('pannellum-css', 'https://cdn.jsdelivr.net/npm/pannellum/build/pannellum.css'),
        ensureScript('pannellum-js', 'https://cdn.jsdelivr.net/npm/pannellum/build/pannellum.js')
      ]);
    };

    const initializeVR = async () => {
      setIsLoading(true);
      setError(null);

      try {
        await loadPannellumAssets();

        // Initialize Pannellum with local panorama
        const viewer = (window as any).pannellum.viewer('pano-viewer', {
          type: 'equirectangular',
          panorama: currentPanorama.image,
          autoLoad: true,
          compass: true,
          showZoomCtrl: false,
          showFullscreenCtrl: false,
          hotSpots: currentPanorama.hotspots.map(hotspot => ({
            pitch: hotspot.position.y - 90,
            yaw: hotspot.position.x * 3.6,
            type: 'info',
            text: hotspot.title,
            cssClass: 'custom-hotspot',
            createTooltipFunc: function(hotSpotDiv: HTMLElement) {
              hotSpotDiv.innerHTML = `
                <div class="hotspot-content">
                  <h3>${hotspot.title}</h3>
                  <p>${hotspot.description}</p>
                </div>
              `;
            }
          }))
        });
        
        setPanoViewer(viewer);
        setHotSpots(currentPanorama.hotspots);
        setIsLoading(false);
      } catch (e: any) {
        setError(e?.message || 'Failed to initialize 360° viewer.');
        setIsLoading(false);
      }
    };

    initializeVR();
  }, [isOpen, currentPanorama]);

  const ensureScript = (id: string, src: string) => {
    return new Promise<void>((resolve, reject) => {
      const existing = document.getElementById(id) as HTMLScriptElement | null;
      if (existing) {
        if ((existing as any)._loaded) return resolve();
        existing.addEventListener('load', () => resolve());
        existing.addEventListener('error', () => reject());
        return;
      }
      const script = document.createElement('script');
      script.id = id;
      script.src = src;
      script.async = true;
      script.onload = () => {
        (script as any)._loaded = true;
        resolve();
      };
      script.onerror = () => reject();
      document.head.appendChild(script);
    });
  };

  const ensureStylesheet = (id: string, href: string) => {
    return new Promise<void>((resolve) => {
      const existing = document.getElementById(id) as HTMLLinkElement | null;
      if (existing) return resolve();
      const link = document.createElement('link');
      link.id = id;
      link.rel = 'stylesheet';
      link.href = href;
      link.onload = () => resolve();
      document.head.appendChild(link);
    });
  };


  const toggleFullscreen = () => {
    if (!isFullscreen) {
      if (panoramaRef.current?.requestFullscreen) {
        panoramaRef.current.requestFullscreen();
        setIsFullscreen(true);
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  const resetView = () => {
    if (panoViewer) {
      try {
        panoViewer.setYaw(0);
        panoViewer.setPitch(0);
        panoViewer.setHfov(100);
      } catch {}
    }
  };

  const zoomIn = () => {
    if (panoViewer) {
      try {
        const current = panoViewer.getHfov();
        panoViewer.setHfov(Math.max(current - 10, 40));
      } catch {}
    }
  };

  const zoomOut = () => {
    if (panoViewer) {
      try {
        const current = panoViewer.getHfov();
        panoViewer.setHfov(Math.min(current + 10, 120));
      } catch {}
    }
  };

  const handleHotSpotClick = (hotSpot: VRHotspot) => {
    setActiveHotSpot(hotSpot);
    
    if (hotSpot.type === 'audio') {
      setIsAudioEnabled(!isAudioEnabled);
      // Here you would play/pause audio
    } else if (hotSpot.type === 'navigation') {
      // Navigate to different position
      if (panoViewer) {
        panoViewer.setPov({ 
          heading: Math.random() * 360, 
          pitch: 0 
        });
      }
    }
  };

  const switchToPanorama = (index: number) => {
    if (index >= 0 && index < availablePanoramas.length) {
      setCurrentPanoramaIndex(index);
      setCurrentPanorama(availablePanoramas[index]);
    }
  };

  const nextPanorama = () => {
    const nextIndex = (currentPanoramaIndex + 1) % availablePanoramas.length;
    switchToPanorama(nextIndex);
  };

  const prevPanorama = () => {
    const prevIndex = currentPanoramaIndex === 0 
      ? availablePanoramas.length - 1 
      : currentPanoramaIndex - 1;
    switchToPanorama(prevIndex);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black"
      >
        {/* Header */}
        <motion.div
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-black/80 to-transparent p-6"
        >
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div>
                <h2 className="text-2xl font-bold text-white">
                  {currentPanorama?.name || place.name}
                </h2>
                <p className="text-gray-300">
                  {currentPanorama?.location || 'VR Experience'}
                </p>
              </div>
              
              {/* Panorama Navigation */}
              {availablePanoramas.length > 1 && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={prevPanorama}
                    className="p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors"
                    title="Previous Panorama"
                  >
                    <ChevronLeft className="w-4 h-4 text-white" />
                  </button>
                  <span className="text-white text-sm">
                    {currentPanoramaIndex + 1} / {availablePanoramas.length}
                  </span>
                  <button
                    onClick={nextPanorama}
                    className="p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors"
                    title="Next Panorama"
                  >
                    <ChevronRight className="w-4 h-4 text-white" />
                  </button>
                </div>
              )}
            </div>
            
            <button
              onClick={onClose}
              className="p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors"
            >
              <X className="w-6 h-6 text-white" />
            </button>
          </div>
        </motion.div>

        {/* Main VR Viewer */}
        <div className="relative w-full h-full">
          <div id="pano-viewer" ref={panoramaRef} className="w-full h-full" />

          {/* Loading State */}
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="w-16 h-16 border-4 border-white/20 border-t-white rounded-full"
              />
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/80">
              <div className="text-center text-white">
                <Camera className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <h3 className="text-xl font-semibold mb-2">VR Experience Unavailable</h3>
                <p className="text-gray-300 mb-4">{error}</p>
                <button
                  onClick={onClose}
                  className="px-6 py-3 bg-orange-500 hover:bg-orange-600 rounded-lg transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          )}

          {/* HotSpots */}
          {!isLoading && !error && hotSpots.map(hotSpot => (
            <motion.button
              key={hotSpot.id}
              className="absolute z-20 w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center hover:bg-orange-600 transition-all duration-300"
              style={{
                left: `${hotSpot.position.x}%`,
                top: `${hotSpot.position.y}%`,
                transform: 'translate(-50%, -50%)'
              }}
              onClick={() => handleHotSpotClick(hotSpot)}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5 }}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
            >
              {hotSpot.type === 'info' && <Info className="w-4 h-4 text-white" />}
              {hotSpot.type === 'navigation' && <Navigation className="w-4 h-4 text-white" />}
              {hotSpot.type === 'audio' && (isAudioEnabled ? <Volume2 className="w-4 h-4 text-white" /> : <VolumeX className="w-4 h-4 text-white" />)}
            </motion.button>
          ))}

          {/* HotSpot Info Panel */}
          <AnimatePresence>
            {activeHotSpot && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="absolute bottom-32 left-6 right-6 md:left-6 md:right-auto md:w-96 bg-black/90 backdrop-blur-lg rounded-xl p-6 text-white"
              >
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-lg font-semibold">{activeHotSpot.title}</h3>
                  <button
                    onClick={() => setActiveHotSpot(null)}
                    className="p-1 hover:bg-white/20 rounded"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-gray-300">{activeHotSpot.description}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Controls */}
        <motion.div
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex items-center space-x-4 bg-black/80 backdrop-blur-lg rounded-2xl p-4"
        >
          <button
            onClick={resetView}
            className="p-3 bg-white/20 hover:bg-white/30 rounded-xl transition-colors"
            title="Reset View"
          >
            <RotateCcw className="w-5 h-5 text-white" />
          </button>
          
          <button
            onClick={zoomOut}
            className="p-3 bg-white/20 hover:bg-white/30 rounded-xl transition-colors"
            title="Zoom Out"
          >
            <ZoomOut className="w-5 h-5 text-white" />
          </button>
          
          <button
            onClick={zoomIn}
            className="p-3 bg-white/20 hover:bg-white/30 rounded-xl transition-colors"
            title="Zoom In"
          >
            <ZoomIn className="w-5 h-5 text-white" />
          </button>
          
          <button
            onClick={toggleFullscreen}
            className="p-3 bg-white/20 hover:bg-white/30 rounded-xl transition-colors"
            title="Toggle Fullscreen"
          >
            <Maximize className="w-5 h-5 text-white" />
          </button>
        </motion.div>

        {/* Instructions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="absolute top-24 right-6 bg-black/80 backdrop-blur-lg rounded-xl p-4 text-white max-w-xs"
        >
          <h4 className="font-semibold mb-2 flex items-center">
            <Move3D className="w-4 h-4 mr-2" />
            Instructions
          </h4>
          <ul className="text-sm text-gray-300 space-y-1">
            <li>• Click and drag to look around</li>
            <li>• Use mouse wheel to zoom</li>
            <li>• Click orange dots for information</li>
            <li>• Use controls at bottom for navigation</li>
          </ul>
        </motion.div>
      </motion.div>
      
      {/* Custom CSS for hotspots */}
      <style>{`
        .custom-hotspot {
          background: rgba(249, 115, 22, 0.8);
          border: 2px solid #f97316;
          border-radius: 50%;
          width: 20px;
          height: 20px;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        
        .custom-hotspot:hover {
          background: rgba(249, 115, 22, 1);
          transform: scale(1.2);
        }
        
        .hotspot-content {
          background: rgba(0, 0, 0, 0.9);
          color: white;
          padding: 12px;
          border-radius: 8px;
          max-width: 200px;
          font-size: 14px;
        }
        
        .hotspot-content h3 {
          margin: 0 0 8px 0;
          font-size: 16px;
          font-weight: bold;
          color: #f97316;
        }
        
        .hotspot-content p {
          margin: 0;
          line-height: 1.4;
        }
      `}</style>
    </AnimatePresence>
  );
};

export default VRViewer; 