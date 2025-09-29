import React from 'react';
import { motion } from 'framer-motion';
import { Phone, X, AlertTriangle } from 'lucide-react';

interface MobileRequiredNotificationProps {
  isVisible: boolean;
  onClose: () => void;
  onOpenProfile: () => void;
}

const MobileRequiredNotification: React.FC<MobileRequiredNotificationProps> = ({
  isVisible,
  onClose,
  onOpenProfile
}) => {
  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      transition={{ type: "spring", damping: 25, stiffness: 300 }}
      className="fixed top-20 left-1/2 transform -translate-x-1/2 z-[140] w-full max-w-md px-4"
    >
      <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-xl shadow-2xl p-4">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <AlertTriangle className="h-6 w-6 text-white" />
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="text-white font-semibold text-sm">
              Mobile Number Required
            </h3>
            <p className="text-white/90 text-xs mt-1">
              Please add your mobile number to complete your profile and access all features.
            </p>
            
            <div className="flex space-x-2 mt-3">
              <button
                onClick={onOpenProfile}
                className="flex items-center space-x-1 px-3 py-1.5 bg-white text-orange-600 rounded-lg text-xs font-medium hover:bg-gray-100 transition-colors duration-200"
              >
                <Phone className="h-3 w-3" />
                <span>Add Mobile</span>
              </button>
              
              <button
                onClick={onClose}
                className="px-3 py-1.5 bg-white/20 text-white rounded-lg text-xs font-medium hover:bg-white/30 transition-colors duration-200"
              >
                Later
              </button>
            </div>
          </div>
          
          <button
            onClick={onClose}
            className="flex-shrink-0 p-1 hover:bg-white/20 rounded-full transition-colors duration-200"
          >
            <X className="h-4 w-4 text-white" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default MobileRequiredNotification; 