import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Camera, MapPin, Info } from 'lucide-react';
import { VRService, VRPanorama } from '../services/vrService';

interface VRPanoramaSelectorProps {
  onSelectPanorama: (panorama: VRPanorama) => void;
  isOpen: boolean;
  onClose: () => void;
}

const VRPanoramaSelector: React.FC<VRPanoramaSelectorProps> = ({ 
  onSelectPanorama, 
  isOpen, 
  onClose 
}) => {
  const [panoramas, setPanoramas] = useState<VRPanorama[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadPanoramas = async () => {
      try {
        const data = await VRService.loadPanoramas();
        setPanoramas(data);
        setIsLoading(false);
      } catch (error) {
        console.error('Failed to load panoramas:', error);
        setIsLoading(false);
      }
    };

    if (isOpen) {
      loadPanoramas();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[80vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">VR Panoramas</h2>
              <p className="text-gray-600">Choose a 360° experience to explore</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {panoramas.map((panorama) => (
                <motion.div
                  key={panorama.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-gray-50 rounded-xl overflow-hidden cursor-pointer group"
                  onClick={() => onSelectPanorama(panorama)}
                >
                  <div className="aspect-video bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center">
                    <Camera className="w-12 h-12 text-orange-500" />
                  </div>
                  
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors">
                      {panorama.name}
                    </h3>
                    
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                      <MapPin className="w-4 h-4" />
                      <span>{panorama.location}</span>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {panorama.description}
                    </p>
                    
                    <div className="flex items-center gap-2 text-xs text-orange-600">
                      <Info className="w-3 h-3" />
                      <span>{panorama.hotspots.length} hotspots</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default VRPanoramaSelector;