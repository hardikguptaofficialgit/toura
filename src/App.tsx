import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LanguageProvider } from './contexts/LanguageContext';
import Hero from './components/Hero';
import PopularDestinations from './components/PopularDestinations';
import TrendingHotels from './components/TrendingHotels';
import PopularRestaurants from './components/PopularRestaurants';
import ThingsToDo from './components/ThingsToDo';
import TravelStories from './components/TravelStories';
import Chatbot from './components/Chatbot';
import MobileRequiredNotification from './components/MobileRequiredNotification';
import { X, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Main App Content Component (inside AuthProvider)
const AppContent: React.FC = () => {
  const { user, userData } = useAuth();
  const [showMobileNotification, setShowMobileNotification] = useState(false);
  const [sosOpen, setSosOpen] = useState(false);

  const sosContacts = [
    { name: 'Police', number: '100' },
    { name: 'Ambulance', number: '102' },
    { name: 'Fire', number: '101' },
    { name: 'Tourist Helpline', number: '1800-345-6789' },
  ];

  // Check if user needs to add mobile number
  useEffect(() => {
    if (user && userData && !userData.phoneNumber) {
      const hasSeenNotification = localStorage.getItem(`mobile-notification-${user.uid}`);
      if (!hasSeenNotification) {
        setShowMobileNotification(true);
      }
    } else {
      setShowMobileNotification(false);
    }
  }, [user, userData]);

  const handleCloseMobileNotification = () => {
    setShowMobileNotification(false);
    if (user) {
      localStorage.setItem(`mobile-notification-${user.uid}`, 'seen');
    }
  };

  const handleOpenProfileFromNotification = () => {
    setShowMobileNotification(false);
    console.log('Profile would open here - functionality can be added later');
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black transition-colors duration-300 relative">
      <Hero />
      <PopularDestinations />
      <TrendingHotels />
      <PopularRestaurants />
      <ThingsToDo />
      <TravelStories />
      <Chatbot />

      {/* SOS Floating Button */}
      <button
        onClick={() => setSosOpen(true)}
        className="fixed bottom-5 left-5 z-50 flex items-center justify-center w-14 h-14 bg-red-600 hover:bg-red-700 text-white rounded-full shadow-lg border-2 border-white"
        title="SOS"
      >
        <AlertCircle className="w-6 h-6" />
      </button>

      {/* SOS Modal */}
      <AnimatePresence>
        {sosOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-3xl max-w-md w-full p-6 relative shadow-2xl"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 150, damping: 20 }}
            >
              <button
                onClick={() => setSosOpen(false)}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100"
              >
                <X className="w-5 h-5 text-gray-700" />
              </button>

              <h2 className="text-xl font-bold text-red-600 mb-4 flex items-center gap-2">
                <AlertCircle className="w-6 h-6" /> SOS Contacts
              </h2>
              <div className="flex flex-col gap-3">
                {sosContacts.map(contact => (
                  <a
                    key={contact.number}
                    href={`tel:${contact.number}`}
                    className="flex justify-between items-center px-4 py-3 rounded-lg border border-gray-200 hover:bg-red-50 transition"
                  >
                    <span className="font-medium text-gray-900">{contact.name}</span>
                    <span className="text-gray-600">{contact.number}</span>
                  </a>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Required Notification */}
      <MobileRequiredNotification
        isVisible={showMobileNotification}
        onClose={handleCloseMobileNotification}
        onOpenProfile={handleOpenProfileFromNotification}
      />
    </div>
  );
};

function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;
