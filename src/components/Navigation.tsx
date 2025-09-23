import React, { useState } from "react";
import { Globe, MapPin, Star, User } from "lucide-react";
import { motion } from "framer-motion";
import TripsModal from "./TripsModal";

// Define the shape of a navigation item for type safety
interface NavItem {
  label: string;
  icon: React.ComponentType<any>;
  href: string;
}

// Reusable Nav Button (all styled same)
const NavButton: React.FC<NavItem & { onClick?: () => void }> = ({ label, icon: Icon, href, onClick }) => {
  return (
    <a
      href={href}
      onClick={(e)=>{ if (onClick) { e.preventDefault(); onClick(); } }}
      className="
        flex items-center px-5 py-2 rounded-full font-semibold text-base lg:text-lg
        bg-gradient-to-r from-orange-500 to-orange-600 text-white
        shadow-lg shadow-orange-500/25
        transition-colors duration-300
      "
    >
      <Icon className="h-5 w-5 mr-2 lg:h-6 lg:w-6 lg:mr-3" />
      <span>{label}</span>
    </a>
  );
};

// Sign In Button
const SignInButton: React.FC = () => {
  return (
    <div className="relative p-0.5 rounded-full bg-gradient-to-r from-orange-500 via-orange-600 to-orange-500 shadow-lg hover:shadow-xl transition-shadow duration-300">
      <a
        href="#"
        className="
          flex items-center px-6 py-3 rounded-full font-bold text-base lg:text-lg
          bg-white text-orange-600
          hover:bg-gradient-to-r hover:from-orange-500 hover:to-orange-600 hover:text-white
          transition-colors duration-300 relative overflow-hidden group
        "
      >
        <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-orange-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full"></div>
        <User className="h-5 w-5 mr-2 relative z-10" />
        <span className="relative z-10">Sign in</span>
      </a>
    </div>
  );
};

// Main Navigation Component
const Navigation: React.FC = () => {
  const [tripsOpen, setTripsOpen] = useState(false);
  const navItems: NavItem[] = [
    { label: "Discover", icon: MapPin, href: "#" },
    { label: "Trips", icon: Globe, href: "#" },
    { label: "Reviews", icon: Star, href: "#" },
  ];

  return (
    <>
    <nav
      className="
        fixed top-8 left-1/2 transform -translate-x-1/2 w-full max-w-6xl z-50
        px-4 sm:px-6 lg:px-8
      "
    >
      <div
        className="
          relative p-0.5 rounded-[3rem] transition-shadow duration-300
          bg-gradient-to-r from-orange-500 via-orange-600 to-orange-500
          shadow-2xl hover:shadow-3xl shadow-orange-500/15 hover:shadow-orange-500/25
        "
      >
        <div
          className="
            flex items-center justify-between p-3 lg:p-4 rounded-[3rem] 
            transition-colors duration-300 backdrop-blur-xl
            bg-white/95 text-gray-800
          "
        >
          {/* Centered Logo */}
          <a href="/" className="flex items-center space-x-3">
          <motion.img
  src="/images/logo.svg"
  alt="Toura Logo"
  className="h-8 w-8 lg:h-8 lg:w-8"
  animate={{ rotate: 360 }}
  transition={{ repeat: Infinity, duration: 10, ease: "linear" }}
/>


<span className="text-2xl font-extrabold tracking-tight">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-orange-600 to-orange-500 drop-shadow-sm">
                Toura
              </span>
            </span>
          </a>

          {/* Navigation Links */}
          <div className="hidden md:flex space-x-3 lg:space-x-5">
            {navItems.map((item) => (
              <NavButton
                key={item.label}
                {...item}
                onClick={item.label === 'Trips' ? () => setTripsOpen(true) : undefined}
              />
            ))}
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-4">
            {/* Currency Selector */}
            <div className="relative p-0.5 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 opacity-70 hover:opacity-100 transition-opacity duration-300">
              <button
                className="flex items-center px-4 py-2 rounded-full font-semibold text-lg transition-colors duration-300
                  bg-white text-gray-700 hover:text-orange-600 relative overflow-hidden group
                "
              >
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-orange-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full"></div>
                <Globe className="h-6 w-6 mr-2 relative z-10" />
                <span className="relative z-10">INR</span>
              </button>
            </div>

            {/* Sign In */}
            <SignInButton />
          </div>
        </div>
      </div>
    </nav>
    <TripsModal open={tripsOpen} onClose={() => setTripsOpen(false)} onOpenTrip={(key)=>{ setTripsOpen(false); }} />
    </>
  );
};

export default Navigation;
