import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Camera, Play, Info } from 'lucide-react';
import VRViewer from './VRViewer';
import VRPanoramaSelector from './VRPanoramaSelector';
import { VRPanorama } from '../services/vrService';

const VRTestPage: React.FC = () => {
  const [isVRViewerOpen, setIsVRViewerOpen] = useState(false);
  const [isSelectorOpen, setIsSelectorOpen] = useState(false);
  const [selectedPanorama, setSelectedPanorama] = useState<VRPanorama | null>(null);

  const handleSelectPanorama = (panorama: VRPanorama) => {
    setSelectedPanorama(panorama);
    setIsSelectorOpen(false);
    setIsVRViewerOpen(true);
  };

  const handleCloseVR = () => {
    setIsVRViewerOpen(false);
    setSelectedPanorama(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 p-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Sikkim VR Experience
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Explore Sikkim's monasteries and landscapes in immersive 360° virtual reality
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-2xl p-8 shadow-lg"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center">
                <Camera className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">360° Panoramas</h2>
                <p className="text-gray-600">High-quality panoramic images</p>
              </div>
            </div>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-center gap-3">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <span>Rumtek Monastery - Prayer Hall</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <span>Pemayangtse Monastery - Courtyard</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <span>Gangtok - MG Marg Street View</span>
              </li>
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-2xl p-8 shadow-lg"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center">
                <Info className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Interactive Hotspots</h2>
                <p className="text-gray-600">Click to learn more</p>
              </div>
            </div>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-center gap-3">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <span>Historical information</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <span>Cultural insights</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <span>Navigation points</span>
              </li>
            </ul>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <button
            onClick={() => setIsSelectorOpen(true)}
            className="inline-flex items-center gap-3 bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-colors shadow-lg hover:shadow-xl"
          >
            <Play className="w-6 h-6" />
            Start VR Experience
          </button>
          
          <p className="text-gray-600 mt-4">
            Click to choose from available 360° panoramas
          </p>
        </motion.div>
      </div>

      {/* VR Components */}
      <VRPanoramaSelector
        isOpen={isSelectorOpen}
        onClose={() => setIsSelectorOpen(false)}
        onSelectPanorama={handleSelectPanorama}
      />

      {selectedPanorama && (
        <VRViewer
          isOpen={isVRViewerOpen}
          onClose={handleCloseVR}
          place={{
            name: selectedPanorama.name,
            coordinates: selectedPanorama.coordinates,
            description: selectedPanorama.description
          }}
        />
      )}
    </div>
  );
};

export default VRTestPage;