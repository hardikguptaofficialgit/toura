import React from 'react';
import { Globe, MapPin, Star, User } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

// Define the shape of a navigation item for type safety and clarity
interface NavItem {
  label: string;
  icon: React.ComponentType<any>;
  isActive?: boolean;
  href: string;
}

// A reusable component for rendering individual navigation buttons
const NavButton: React.FC<NavItem> = ({ label, icon: Icon, isActive, href }) => {
  const { isDarkMode } = useTheme();
  
  const baseClasses = `
    flex items-center px-5 py-2 rounded-full font-semibold transition-all
    duration-300 text-base lg:text-lg relative overflow-hidden
  `;
  
  const activeClasses = `
    bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg
   
    ${isDarkMode ? 'shadow-orange-500/30' : 'shadow-orange-500/25'}
  `;
  
  const inactiveClasses = `
    text-gray-700 hover:text-orange-600 relative
    before:absolute before:inset-0 before:rounded-full 
    before:bg-gradient-to-r before:from-orange-500 before:to-orange-600 
    before:opacity-0 hover:before:opacity-10 before:transition-opacity before:duration-300
    hover:bg-orange-50/70 text-gray-700
    hover:shadow-md transform hover:scale-105
  `;

  return (
    <a href={href} className={`${baseClasses} ${isActive ? activeClasses : inactiveClasses}`}>
      <Icon className="h-5 w-5 mr-2 lg:h-6 lg:w-6 lg:mr-3 relative z-10" />
      <span className="relative z-10">{label}</span>
    </a>
  );
};

// A redesigned, eye-catching component for the Sign In button
const SignInButton: React.FC = () => {
  return (
  <div className="relative p-0.5 rounded-full bg-gradient-to-r from-orange-500 via-orange-600 to-orange-500 shadow-lg hover:shadow-xl transition-all duration-300">
  <a
    href="#"
    className="
      flex items-center px-6 py-3 rounded-full font-bold text-base lg:text-lg
      bg-white text-orange-600
      hover:bg-gradient-to-r hover:from-orange-500 hover:to-orange-600 hover:text-white
      transition-all duration-300 transform hover:scale-105
      relative overflow-hidden group
    "
  >
    <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-orange-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full"></div>
    <User className="h-5 w-5 mr-2 relative z-10" />
    <span className="relative z-10">Sign in</span>
  </a>
</div>

  );
};

// The main Navigation component
const Navigation: React.FC = () => {
  const { isDarkMode } = useTheme();

  // Define the navigation items in a clear, structured way
  const navItems: NavItem[] = [
    { label: 'Discover', icon: MapPin, isActive: true, href: '#' },
    { label: 'Trips', icon: Globe, href: '#' },
    { label: 'Reviews', icon: Star, href: '#' },
  ];

  const containerClasses = `
    fixed top-8 left-1/2 transform -translate-x-1/2 w-full max-w-5xl z-50
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
    flex items-center justify-between p-3 lg:p-4 rounded-[3rem] 
    transition-all duration-300 backdrop-blur-xl
    bg-white/95 text-gray-800
  `;

  return (
    <nav className={containerClasses}>
      <div className={contentWrapperClasses}>
        <div className={innerContentClasses}>
          
          {/* Logo and Main Navigation Links */}
          <div className="flex items-center space-x-6 lg:space-x-8">
            <a href="/" className="text-2xl font-extrabold tracking-tight">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-orange-600 to-orange-500 drop-shadow-sm">
                Toura
              </span>
            </a>
            
            <div className="hidden md:flex space-x-2 lg:space-x-4">
              {navItems.map(item => (
                <NavButton key={item.label} {...item} />
              ))}
            </div>
          </div>
          
          {/* User and Utility Section */}
          <div className="flex items-center space-x-4">
            {/* Currency Selector with gradient border */}
            <div className="relative p-0.5 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 opacity-70 hover:opacity-100 transition-opacity duration-300">
              <button 
                className="flex items-center px-4 py-2 rounded-full font-semibold text-lg transition-all duration-300
                  transform hover:scale-105 relative overflow-hidden group
                  bg-white text-gray-700 hover:text-orange-600"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-orange-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full"></div>
                <Globe className="h-6 w-6 mr-2 relative z-10" />
                <span className="relative z-10">INR</span>
              </button>
            </div>
            
            {/* Sign In Button */}
            <SignInButton />
          </div>
          
        </div>
      </div>
    </nav>
  );
};

export default Navigation;