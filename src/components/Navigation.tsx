import React, { useState } from 'react';
import { Globe, MapPin, Star, User, LogOut } from 'lucide-react';
// Theme removed; default to light mode
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import TripManagement from './TripManagement';
import ReviewsModal from './ReviewsModal';
import LanguageRegionSelector from './LanguageRegionSelector';

// Define the shape of a navigation item for type safety and clarity
interface NavItem {
  label: string;
  icon: React.ComponentType<any>;
  isActive?: boolean;
  href: string;
  onClick?: () => void;
}

// A reusable component for rendering individual navigation buttons
const NavButton: React.FC<NavItem> = ({ label, icon: Icon, isActive, href, onClick }) => {
  const isDarkMode = false;
  
  const baseClasses = `
    flex items-center px-5 py-2 rounded-full font-semibold transition-all
    duration-300 text-base lg:text-lg relative overflow-hidden
  `;
  
  const activeClasses = `
    bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg
   
    ${isDarkMode ? 'shadow-orange-500/30' : 'shadow-orange-500/25'}
  `;
  
  const inactiveClasses = `
    bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg
   
    ${isDarkMode ? 'shadow-orange-500/30' : 'shadow-orange-500/25'}
  `;

  const handleClick = (e: React.MouseEvent) => {
    if (onClick) {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <a href={href} onClick={handleClick} className={`${baseClasses} ${isActive ? activeClasses : inactiveClasses}`}>
      <Icon className="h-5 w-5 mr-2 lg:h-6 lg:w-6 lg:mr-3 relative z-10" />
      <span className="relative z-10">{label}</span>
    </a>
  );
};

// User profile component when signed in
const UserProfile: React.FC<{ user: any; userData: any; onSignOut: () => void }> = ({ user, userData, onSignOut }) => {
  const [showDropdown, setShowDropdown] = useState(false);

  const getUserAvatar = () => {
    // Check if user has a photoURL from Google/Firebase Auth
    if (user.photoURL && user.photoURL.startsWith('http')) {
      return user.photoURL;
    }
    // Check if user has a custom avatar in Firestore
    if (userData?.photoURL && userData.photoURL.startsWith('http')) {
      return userData.photoURL;
    }
    // No avatar found, return null to show User icon
    return null;
  };

  const avatar = getUserAvatar();

  return (
    <div className="relative">
      {/* User Avatar - Clickable */}
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="relative p-0.5 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-orange-300 focus:ring-offset-2"
        title="User Profile"
      >
        <div className="bg-white rounded-full p-0.5 relative">
          {avatar ? (
            <img 
              src={avatar} 
              alt={user.displayName || 'User'} 
              className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center shadow-sm border-2 border-white">
              <User className="h-5 w-5 text-white" />
            </div>
          )}
          {/* Online indicator */}
          <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
        </div>
      </button>

      {/* Dropdown Menu */}
      {showDropdown && (
        <div className="absolute right-0 top-full mt-3 w-72 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200/50 z-[150] py-3 overflow-hidden animate-in slide-in-from-top-2 duration-200">
          {/* User Info */}
          <div className="px-5 py-4 border-b border-gray-100/50">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center shadow-lg border-2 border-white">
                {avatar ? (
                  <img 
                    src={avatar} 
                    alt={user.displayName || 'User'} 
                    className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
                  />
                ) : (
                  <User className="h-6 w-6 text-white" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-base font-semibold text-gray-900 truncate">
                  {user.displayName || user.email?.split('@')[0] || 'User'}
                </p>
                <p className="text-sm text-gray-500 truncate">
                  {user.email}
                </p>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="py-2">
            <button
              onClick={() => {
                setShowDropdown(false);
                onSignOut();
              }}
              className="w-full flex items-center px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors duration-200 rounded-lg mx-2"
            >
              <LogOut className="h-4 w-4 mr-3 text-red-500" />
              Sign Out
            </button>
          </div>
        </div>
      )}

      {/* Backdrop to close dropdown */}
      {showDropdown && (
        <div 
          className="fixed inset-0 z-[140]" 
          onClick={() => setShowDropdown(false)}
        />
      )}
    </div>
  );
};

// Language/Region selector component
const LanguageRegionButton: React.FC<{ onClick: () => void }> = ({ onClick }) => {
  const { getLanguage } = useLanguage();
  const currentLanguage = getLanguage('en'); // This would be dynamic
  
  return (
    <button
      onClick={onClick}
      className="flex items-center px-3 py-2 rounded-full border border-orange-500 bg-white shadow-sm hover:shadow-md transition-all duration-300"
    >
      <Globe className="h-4 w-4 text-gray-600 mr-2" />
      <span className="text-sm font-semibold text-gray-700">
        {currentLanguage?.flag} {currentLanguage?.code.toUpperCase()}
      </span>
    </button>
  );
};

// A redesigned, eye-catching component for the Sign In button
const SignInButton: React.FC<{ onSignInClick: () => void }> = ({ onSignInClick }) => {
  return (
    <div className="relative p-0.5 rounded-full bg-gradient-to-r from-orange-500 via-orange-600 to-orange-500 shadow-lg hover:shadow-xl transition-all duration-300">
      <button
        onClick={onSignInClick}
        className="
          flex items-center px-6 py-3 rounded-full font-bold text-base lg:text-lg
          bg-white text-orange-600
          hover:bg-gradient-to-r hover:from-orange-500 hover:to-orange-600 hover:text-white
          transition-all duration-300
          relative overflow-hidden group
        "
      >
        <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-orange-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full"></div>
        <User className="h-5 w-5 mr-2 relative z-10" />
        <span className="relative z-10">Sign in</span>
      </button>
    </div>
  );
};

// The main Navigation component
interface NavigationProps {
  onSignInClick: () => void;
}

const Navigation: React.FC<NavigationProps> = ({ onSignInClick }) => {
  const isDarkMode = false;
  const { user, userData, signOut } = useAuth();
  const { translate } = useLanguage();
  const [activeTab, setActiveTab] = useState<'discover' | 'trips' | 'reviews'>('discover');
  const [showTripManagement, setShowTripManagement] = useState(false);
  const [showReviewsModal, setShowReviewsModal] = useState(false);
  const [showLanguageSelector, setShowLanguageSelector] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut();
      console.log('User signed out');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  // Define the navigation items in a clear, structured way
  const navItems: NavItem[] = [
    { 
      label: translate('discover'), 
      icon: MapPin, 
      isActive: activeTab === 'discover', 
      href: '#', 
      onClick: () => setActiveTab('discover') 
    },
    { 
      label: translate('trips'), 
      icon: Globe, 
      isActive: activeTab === 'trips', 
      href: '#', 
      onClick: () => {
        setActiveTab('trips');
        setShowTripManagement(true);
      } 
    },
    { 
      label: translate('reviews'), 
      icon: Star, 
      isActive: activeTab === 'reviews', 
      href: '#', 
      onClick: () => {
        setActiveTab('reviews');
        setShowReviewsModal(true);
      } 
    },
  ];

  const containerClasses = `
    fixed top-8 left-1/2 transform -translate-x-1/2 w-full max-w-5xl z-[110]
    px-4 sm:px-6 lg:px-8
  `;
  
  // Updated to use white background with gradient border
  const contentWrapperClasses = `
    relative p-0.5 rounded-[3rem] transition-all duration-300
    bg-gradient-to-r from-orange-500 via-orange-600 to-orange-500
    shadow-2xl hover:shadow-3xl
    ${isDarkMode 
      ? 'shadow-orange-500/20 hover:shadow-orange-500/30' 
      : 'shadow-orange-500/15 hover:shadow-orange-500/25'
    }
  `;

  const innerContentClasses = `
    relative flex items-center justify-between p-3 lg:p-4 rounded-[3rem] 
    transition-all duration-300 backdrop-blur-xl
    bg-white/95 text-gray-800
  `;

  return (
    <>
  <nav className={`${containerClasses} vr-open:hidden`}>
  <div className={contentWrapperClasses}>
    <div className={innerContentClasses}>

      {/* Left group: Logo */}
      <div className="flex items-center mr-4">
        <a
          href="/"
          className="flex items-center gap-2 select-none"
        >
          <div className="flex rounded-full px-4 py-2 gap-2 animate-[tiltRotate_6s_linear_infinite]">
          <img
  src="/images/logo.svg"
  alt="Toura logo"
  className="w-8 h-8 object-contain transform rotate-45 translate-y-1"
/>

            <span className="font-bold text-2xl lg:text-3xl">Toura</span>
          </div>
<span className="sr-only text-4xl font-bold">Toura</span>
        </a>
      </div>

      {/* Middle group: Discover, Trips, Reviews */}
      <div className="hidden md:flex space-x-6 ml-8"> 
        <NavButton {...navItems[0]} /> {/* Discover */}
        <NavButton {...navItems[1]} /> {/* Trips */}
        <NavButton {...navItems[2]} /> {/* Reviews */}
      </div>

      {/* Right group: Language/Region selector and Auth/Profile */}
      <div className="flex items-center ml-3 space-x-3"> 
        <LanguageRegionButton onClick={() => setShowLanguageSelector(true)} />
        {user ? (
          <UserProfile
            user={user}
            userData={userData}
            onSignOut={handleSignOut}
          />
        ) : (
          <SignInButton onSignInClick={onSignInClick} />
        )}
      </div>

    </div>
  </div>
</nav>


    {/* Trip Management */}
    <TripManagement
      isOpen={showTripManagement}
      onClose={() => setShowTripManagement(false)}
    />

    {/* Reviews Modal */}
    <ReviewsModal
      isOpen={showReviewsModal}
      onClose={() => setShowReviewsModal(false)}
    />

    {/* Language/Region Selector */}
    <LanguageRegionSelector
      isOpen={showLanguageSelector}
      onClose={() => setShowLanguageSelector(false)}
    />
    </>
  );
};

export default Navigation;