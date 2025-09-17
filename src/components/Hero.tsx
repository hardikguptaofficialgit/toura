import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, Hotel, Utensils, Plane, Mountain, Camera, Compass, Backpack, TreePine } from 'lucide-react';
import { motion, useAnimation, AnimatePresence } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import Silk from './Silk';
import Navigation from './Navigation';

const Hero: React.FC = () => {
  const { isDarkMode } = useTheme();
  const floatingControls = useAnimation();
  const sikkimRef = useRef<HTMLSpanElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showContent, setShowContent] = useState(false);
  
  // Carousel state
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  // Beautiful Sikkim images for carousel
  const carouselImages = [
    {
      url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRw_0Gxzc86vLR36zYCag9LOETHPXPpqDwAew&s",
      alt: "Sikkim Landscape 1"
    },
    {
      url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRw_0Gxzc86vLR36zYCag9LOETHPXPpqDwAew&s",
      alt: "Sikkim Landscape 2"
    },
    {
      url: "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/01/1d/36/30/sikkim-villages.jpg?w=1600&h=600&s=1",
      alt: "Sikkim Village"
    },
    {
      url: "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/18/88/cd/16/the-buddha-fall-in-rollep.jpg?w=1400&h=-1&s=1",
      alt: "Buddha Fall in Rollep"
    }
  ];
  
  
  const animatedPrefixes = [
   "Explore Monasteries in" ,
    "Where to in",
    "Great Stays in",
    "Do Something Fun in", 
    "Find Places to Eat in",
    "Find the Best Flight to",
    "Explore Rental Places in"
  ];

  // Search suggestions data
  const searchSuggestions = [
    { icon: Hotel, text: "Book luxury hotels in Gangtok", category: "Hotels" },
    { icon: Mountain, text: "Visit Rumtek Monastery today", category: "Attractions" },
    { icon: Utensils, text: "Find best momos in Sikkim", category: "Food" },
    { icon: MapPin, text: "Explore Pelling's mountain views", category: "Destinations" },
    { icon: Hotel, text: "Reserve spa resorts in Sikkim", category: "Hotels" },
    { icon: Mountain, text: "Book Tsomgo Lake tour", category: "Tours" },
    { icon: Plane, text: "Get flights to Pakyong Airport", category: "Travel" },
    { icon: Utensils, text: "Try authentic Sikkimese thali", category: "Food" },
    { icon: MapPin, text: "Plan Yuksom trekking adventure", category: "Adventure" },
    { icon: Hotel, text: "Book homestays in North Sikkim", category: "Stays" },
    { icon: Mountain, text: "Visit Pemayangtse Monastery", category: "Spiritual" },
    { icon: Utensils, text: "Order Gundruk and Sinki", category: "Local Food" },
  ];

  // Dynamic placeholders based on current prefix
  const placeholderTexts: Record<string, string[]> = {
    "Explore Monasteries in": ["Visit Rumtek Monastery", "Book Pemayangtse tour", "Explore Enchey Monastery"],
    "Where to in": ["Plan Gangtok trip", "Explore Pelling views", "Book Yuksom trek", "Visit Lachen valley"],
    "Great Stays in": ["Book luxury hotel in Gangtok", "Reserve mountain resort", "Find cozy homestay"],
    "Do Something Fun in": ["Book paragliding adventure", "Plan river rafting", "Ride Gangtok cable car"],
    "Find Places to Eat in": ["Try authentic momos", "Order Sikkimese thali", "Find local dal-bhat"],
    "Find the Best Flight to": ["Book flight to Pakyong", "Get Bagdogra tickets", "Find cheap flights"],
    "Explore Rental Places in": ["Book mountain hotels", "Find eco-friendly stays", "Reserve luxury resorts"]
  };

  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [currentPlaceholder, setCurrentPlaceholder] = useState('');
  const [placeholderIndex, setPlaceholderIndex] = useState(0);

  // Simple page loading animation
  useEffect(() => {
    const loadingTimer = setTimeout(() => {
      setIsLoading(false);
      setTimeout(() => {
        setShowContent(true);
      }, 800);
    }, 3000);

    return () => clearTimeout(loadingTimer);
  }, []);

  // Smooth auto-play functionality with blur effect
  useEffect(() => {
    if (!showContent) return;
    
    const interval = setInterval(() => {
      // Start blur transition
      setIsTransitioning(true);
      
      // Change image after blur effect starts
      setTimeout(() => {
        setCurrentImageIndex((prev) => (prev + 1) % carouselImages.length);
        
        // Remove blur after image changes
        setTimeout(() => {
          setIsTransitioning(false);
        }, 200);
      }, 200);
    }, 4000); // Change image every 4 seconds

    return () => clearInterval(interval);
  }, [showContent, carouselImages.length]);



  // Animate placeholders
  useEffect(() => {
    if (!showContent) return;
    
    const currentPrefix = animatedPrefixes[currentTextIndex];
    const placeholders = placeholderTexts[currentPrefix] || ["Destination"];
    
    const placeholderInterval = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % placeholders.length);
    }, 2000);

    return () => clearInterval(placeholderInterval);
  }, [currentTextIndex, showContent]);

  // Update placeholder text
  useEffect(() => {
    if (!showContent) return;
    
    const currentPrefix = animatedPrefixes[currentTextIndex];
    const placeholders = placeholderTexts[currentPrefix] || ["Destination"];
    setCurrentPlaceholder(placeholders[placeholderIndex]);
  }, [currentTextIndex, placeholderIndex, showContent]);

  useEffect(() => {
    if (!showContent) return;
    
    const interval = setInterval(() => {
      setIsVisible(false);
      setTimeout(() => {
        setCurrentTextIndex((prev) => (prev + 1) % animatedPrefixes.length);
        setIsVisible(true);
      }, 300);
    }, 3000);

    return () => clearInterval(interval);
  }, [animatedPrefixes.length, showContent]);

  // Animation effects
  useEffect(() => {
    if (!showContent) return;

    // Floating elements animation
    const animateFloating = async () => {
      floatingControls.start({
        y: [0, -20, 0],
        rotate: [0, 5, -5, 0],
        transition: {
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut"
        }
      });
    };

    animateFloating();
  }, [floatingControls, showContent]);

  // Filter suggestions based on search query
  const filteredSuggestions = searchSuggestions.filter(suggestion =>
    suggestion.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
    suggestion.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setShowSuggestions(e.target.value.length > 0);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setSearchQuery(suggestion);
    setShowSuggestions(false);
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      console.log('Searching for:', searchQuery);
      // Here you would implement your search logic
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };
  
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden transition-colors duration-300">
      
      {/* Enhanced Loading Animation */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              className="relative w-full h-full"
              initial={{ scale: 1 }}
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 4, ease: "easeInOut", repeat: Infinity }}
            >
              <motion.img
                src="https://images.unsplash.com/photo-1544735716-392fe2489ffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
                alt="Sikkim Loading"
                className="w-full h-full object-cover"
                initial={{ scale: 1.2, filter: "brightness(0.7)" }}
                animate={{ scale: 1, filter: "brightness(0.8)" }}
                transition={{ duration: 4, ease: "easeOut" }}
              />
              
              {/* Enhanced Gradient Overlay */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/50"
                initial={{ opacity: 0.5 }}
                animate={{ opacity: [0.5, 0.8, 0.5] }}
                transition={{ duration: 4, repeat: Infinity }}
              />
              
              {/* Dramatic Text Animation */}
              <motion.div
                className="absolute inset-0 flex items-center justify-center"
                initial={{ opacity: 0, y: 100 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 1.2, ease: "easeOut" }}
              >
                <div className="text-center">
                  {/* Main Title with Enhanced Visibility */}
                  <motion.h1
                    className="text-6xl md:text-8xl lg:text-9xl font-bold text-white mb-6 tracking-wide"
                    style={{
                      textShadow: "0 0 30px rgba(255,255,255,0.8), 0 0 60px rgba(255,255,255,0.4), 0 4px 20px rgba(0,0,0,0.8)"
                    }}
                    animate={{
                      textShadow: [
                        "0 0 30px rgba(255,255,255,0.8), 0 0 60px rgba(255,255,255,0.4), 0 4px 20px rgba(0,0,0,0.8)",
                        "0 0 40px rgba(255,255,255,1), 0 0 80px rgba(255,255,255,0.6), 0 4px 20px rgba(0,0,0,0.8)",
                        "0 0 30px rgba(255,255,255,0.8), 0 0 60px rgba(255,255,255,0.4), 0 4px 20px rgba(0,0,0,0.8)"
                      ],
                      scale: [1, 1.02, 1]
                    }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  >
                    SIKKIM
                  </motion.h1>
                  
                  {/* Enhanced Subtitle */}
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1, duration: 1 }}
                    className="relative"
                  >
                    <motion.p
                      className="text-2xl md:text-3xl text-white/90 font-light tracking-wider"
                      style={{
                        textShadow: "0 2px 10px rgba(0,0,0,0.8)"
                      }}
                      animate={{
                        opacity: [0.9, 1, 0.9]
                      }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    >
                      Discover the Hidden Paradise
                    </motion.p>
                    
                    {/* Animated Underline */}
                    <motion.div
                      className="h-1 bg-gradient-to-r from-transparent via-white to-transparent mt-4 mx-auto"
                      initial={{ width: 0 }}
                      animate={{ width: "300px" }}
                      transition={{ delay: 1.5, duration: 1.5, ease: "easeOut" }}
                    />
                  </motion.div>
                  

                </div>
              </motion.div>
            </motion.div>
            
            {/* Collapse Animation */}
            <motion.div
              className="absolute inset-0 bg-black"
              initial={{ scale: 0, borderRadius: "50%" }}
              animate={!isLoading ? { scale: 15, borderRadius: "0%" } : {}}
              transition={{ delay: 0.5, duration: 1.5, ease: "easeInOut" }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <AnimatePresence>
        {showContent && (
          <motion.div
            className="w-full h-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            {/* Navigation */}
            <Navigation />
            
            {/* Background Images Overlay */}
            <div className="absolute inset-0 w-full h-full">
              {/* Monastery Background */}
              <div className="absolute inset-0 opacity-20">
                <img 
                  src="https://images.unsplash.com/photo-1544735716-392fe2489ffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80" 
                  alt="Sikkim Monastery" 
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Monk Silhouette */}
              <div className="absolute top-20 right-20 opacity-30">
                <img 
                  src="https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" 
                  alt="Buddhist Monk" 
                  className="w-32 h-32 rounded-full object-cover"
                />
              </div>
              
              {/* Prayer Flags */}
              <div className="absolute top-10 left-10 opacity-40">
                <img 
                  src="https://images.unsplash.com/photo-1544735716-392fe2489ffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80" 
                  alt="Prayer Flags" 
                  className="w-24 h-16 object-cover rounded-lg"
                />
              </div>
            </div>
            
            {/* Silk Background Animation - Full Coverage */}
            <div className="absolute inset-0 w-full h-full">
              <Silk
                speed={5}
                scale={1}
                color={isDarkMode ? "#A855F7" : "#e35717"}
                noiseIntensity={1.5}
                rotation={0}
              />
            </div>

            {/* Floating Travel Icons */}
            <motion.div
              className="absolute top-32 left-20 z-15 pointer-events-none"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ 
                opacity: 1, 
                scale: 1,
                y: [0, -20, 0],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ 
                delay: 0.5, 
                duration: 0.8,
                y: { duration: 6, repeat: Infinity, ease: "easeInOut" },
                rotate: { duration: 6, repeat: Infinity, ease: "easeInOut" }
              }}
            >
              <Mountain className="w-8 h-8 text-white/70 drop-shadow-lg" />
            </motion.div>

            <motion.div
              className="absolute top-40 right-32 z-15 pointer-events-none"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ 
                opacity: 1, 
                scale: 1,
                y: [0, -20, 0],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ 
                delay: 0.7, 
                duration: 0.8,
                y: { duration: 6, repeat: Infinity, ease: "easeInOut", delay: 2 },
                rotate: { duration: 6, repeat: Infinity, ease: "easeInOut", delay: 2 }
              }}
            >
              <Camera className="w-7 h-7 text-white/60 drop-shadow-lg" />
            </motion.div>

            <motion.div
              className="absolute bottom-32 left-32 z-15 pointer-events-none"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ 
                opacity: 1, 
                scale: 1,
                y: [0, -20, 0],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ 
                delay: 0.9, 
                duration: 0.8,
                y: { duration: 6, repeat: Infinity, ease: "easeInOut", delay: 4 },
                rotate: { duration: 6, repeat: Infinity, ease: "easeInOut", delay: 4 }
              }}
            >
              <Compass className="w-6 h-6 text-white/65 drop-shadow-lg" />
            </motion.div>

            <motion.div
              className="absolute top-60 left-40 z-15 pointer-events-none"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ 
                opacity: 1, 
                scale: 1,
                y: [0, -20, 0],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ 
                delay: 1.1, 
                duration: 0.8,
                y: { duration: 6, repeat: Infinity, ease: "easeInOut", delay: 3 },
                rotate: { duration: 6, repeat: Infinity, ease: "easeInOut", delay: 3 }
              }}
            >
              <Backpack className="w-6 h-6 text-white/55 drop-shadow-lg" />
            </motion.div>

            <motion.div
              className="absolute bottom-40 right-40 z-15 pointer-events-none"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ 
                opacity: 1, 
                scale: 1,
                y: [0, -20, 0],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ 
                delay: 1.3, 
                duration: 0.8,
                y: { duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 },
                rotate: { duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }
              }}
            >
              <TreePine className="w-7 h-7 text-white/60 drop-shadow-lg" />
            </motion.div>
            
            {/* Content */}
            <div className="relative z-10 max-w-4xl mx-auto px-6 lg:px-8 text-center">
              <div className="space-y-12">
                
                {/* Animated Text with Fixed Sikkim */}
                <motion.div 
  className="space-y-4" 
  initial={{ y: 50, opacity: 0 }} 
  animate={{ y: 0, opacity: 1 }} 
  transition={{ duration: 1, delay: 0.5 }}
>
  <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold">
    <motion.span 
      className={`block transition-all duration-300 ${
        isVisible 
          ? 'opacity-100 transform translate-y-0' 
          : 'opacity-0 transform translate-y-4'
      } text-white`}
      animate={{
        textShadow: [
          "0 0 10px rgba(255,255,255,0.3)",
          "0 0 20px rgba(255,255,255,0.5)",
          "0 0 10px rgba(255,255,255,0.3)"
        ]
      }}
      transition={{
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    >
      {animatedPrefixes[currentTextIndex]}
    </motion.span>

    <motion.span 
  ref={sikkimRef}
  className="block text-white relative"
  animate={{
    textShadow: [
      "0 0 15px rgba(255,255,255,0.4)",
      "0 0 25px rgba(255,255,255,0.6)",
      "0 0 15px rgba(255,255,255,0.4)"
    ]
  }}
  transition={{
    duration: 4,
    repeat: Infinity,
    ease: "easeInOut",
    delay: 1
  }}
>
  {/* Smooth Carousel Container - Clean & Minimalist */}
  <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[40%] h-[90%] -z-10 rounded-2xl overflow-hidden shadow-2xl">
  {/* Smooth Cycling Images */}
  <div className="relative w-full h-full">
       <img
        src={carouselImages[currentImageIndex].url}
        alt={carouselImages[currentImageIndex].alt}
        className={`absolute inset-0 w-full h-full object-cover opacity-70 transition-all duration-200 ease-in-out ${
          isTransitioning ? 'blur-md scale-105' : 'blur-0 scale-100'
        }`}
      />
      
      {/* Subtle Gradient Overlay for text visibility */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20"></div>
    </div>
  </div>

  {/* Text in front */}
  Sikkim
</motion.span>

  </h1>
</motion.div>
   {/* Enhanced Search Box with Suggestions */}
                <motion.div 
                  className="mx-auto w-[600px] relative"
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 1, delay: 1 }}
                >
                  <div className={`flex items-center px-6 py-4 rounded-full shadow-2xl backdrop-blur-lg border transition-colors duration-300 h-16 w-full ${
                      isDarkMode 
                        ? 'bg-black/90 border-gray-700' 
                        : 'bg-black/90 border-gray-700'
                    }`}>
                    <Search className={`h-6 w-6 mr-4 flex-shrink-0 ${isDarkMode ? 'text-gray-400' : 'text-gray-400'}`} />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={handleSearchChange}
                      onKeyPress={handleKeyPress}
                      onFocus={() => setShowSuggestions(searchQuery.length > 0)}
                      onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                      placeholder={currentPlaceholder}
                      className={`flex-1 text-lg bg-transparent outline-none min-w-0 transition-all duration-500 ease-out placeholder:transition-all placeholder:duration-500 focus:scale-[1.02] ${
                        isDarkMode ? 'text-white placeholder-gray-500 focus:placeholder-gray-400' : 'text-white placeholder-gray-500 focus:placeholder-gray-400'
                      }`}
                    />
                    <button 
                      onClick={handleSearch}
                      className="ml-4 px-6 py-2 bg-white text-black font-semibold rounded-full transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5 hover:bg-gray-100 w-24 flex-shrink-0"
                    >
                      Search
                    </button>
                  </div>

                  {/* Search Suggestions Dropdown */}
                  <div className={`absolute top-full mt-2 w-full rounded-xl shadow-2xl backdrop-blur-lg border z-50 overflow-hidden transition-all duration-700 ease-out transform ${
                    showSuggestions 
                      ? 'opacity-100 translate-y-0 scale-100 max-h-80 animate-in slide-in-from-top-4 fade-in' 
                      : 'opacity-0 -translate-y-6 scale-90 max-h-0 animate-out slide-out-to-top-4 fade-out'
                  } ${
                    isDarkMode 
                      ? 'bg-black/95 border-gray-700 shadow-blue-500/10' 
                      : 'bg-white/95 border-gray-200 shadow-blue-500/10'
                  }`}
                  style={{
                    animationDuration: '600ms',
                    animationTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)'
                  }}>
                    <div className="max-h-80 overflow-y-auto">
                      {filteredSuggestions.length > 0 ? (
                        <div className="p-2">
                          {filteredSuggestions.slice(0, 8).map((suggestion, index) => {
                            const IconComponent = suggestion.icon;
                            return (
                              <div
                                key={`${suggestion.text}-${index}`}
                                onClick={() => handleSuggestionClick(suggestion.text)}
                                className={`flex items-center px-4 py-3 rounded-lg cursor-pointer group relative overflow-hidden transition-all duration-500 ease-out transform hover:scale-[1.03] hover:shadow-xl hover:-translate-y-1 ${
                                  isDarkMode 
                                    ? 'hover:bg-gradient-to-r hover:from-gray-800/90 hover:via-gray-700/80 hover:to-gray-800/90 text-white border border-transparent hover:border-blue-500/30' 
                                    : 'hover:bg-gradient-to-r hover:from-gray-50 hover:via-white hover:to-gray-50 text-gray-900 border border-transparent hover:border-blue-500/20 hover:shadow-blue-500/10'
                                }`}
                                style={{
                                  animationDelay: `${index * 80}ms`,
                                  animationDuration: '600ms',
                                  animationFillMode: 'both',
                                  transform: showSuggestions ? 'translateX(0)' : 'translateX(-100%)',
                                  transition: `all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) ${index * 80}ms`
                                }}
                              >
                                {/* Animated Background Glow */}
                                <div className={`absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-500 transform scale-50 group-hover:scale-100 ${
                                  isDarkMode ? 'bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-blue-600/10' : 'bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-blue-500/5'
                                }`}></div>
                                
                                {/* Icon with Enhanced Animation */}
                                <div className="relative z-10">
                                  <div className="relative">
                                    <IconComponent className={`h-5 w-5 mr-3 transition-all duration-500 ease-out group-hover:scale-125 group-hover:rotate-12 group-hover:-translate-y-1 ${
                                      isDarkMode ? 'text-blue-400 group-hover:text-blue-300 group-hover:drop-shadow-lg' : 'text-blue-600 group-hover:text-blue-500 group-hover:drop-shadow-lg'
                                    }`} 
                                    style={{
                                      filter: 'drop-shadow(0 0 8px rgba(59, 130, 246, 0.3))'
                                    }} />
                                    {/* Pulsing Ring Animation */}
                                    <div className={`absolute inset-0 rounded-full transition-all duration-500 transform scale-0 group-hover:scale-[300%] opacity-0 group-hover:opacity-30 ${
                                      isDarkMode ? 'bg-blue-400' : 'bg-blue-500'
                                    }`}></div>
                                    <div className={`absolute inset-0 rounded-full transition-all duration-700 transform scale-0 group-hover:scale-[400%] opacity-0 group-hover:opacity-20 ${
                                      isDarkMode ? 'bg-purple-400' : 'bg-purple-500'
                                    }`} style={{ animationDelay: '100ms' }}></div>
                                  </div>
                                </div>
                                
                                {/* Text Content with Slide Animation */}
                                <div className="flex-1 overflow-hidden relative z-10">
                                  <div className={`font-medium transition-all duration-500 ease-out group-hover:translate-x-2 group-hover:-translate-y-0.5 ${
                                    isDarkMode ? 'text-white group-hover:text-blue-100' : 'text-gray-900 group-hover:text-blue-900'
                                  }`}>
                                    {suggestion.text.split(' ').map((word, wordIndex) => (
                                      <span 
                                        key={wordIndex}
                                        className="inline-block transition-all duration-300 ease-out group-hover:animate-pulse"
                                        style={{
                                          animationDelay: `${wordIndex * 50}ms`,
                                          transform: 'translateY(0)'
                                        }}
                                      >
                                        {word}{' '}
                                      </span>
                                    ))}
                                  </div>
                                  <div className={`text-sm transition-all duration-500 ease-out group-hover:translate-x-2 group-hover:translate-y-0.5 ${
                                    isDarkMode ? 'text-gray-400 group-hover:text-blue-300' : 'text-gray-500 group-hover:text-blue-600'
                                  }`}>
                                    {suggestion.category}
                                  </div>
                                </div>
                                
                                {/* Animated Arrow */}
                                <div className={`relative z-10 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-x-4 group-hover:translate-x-0 ${
                                  isDarkMode ? 'text-blue-400' : 'text-blue-600'
                                }`}>
                                  <div className="relative">
                                    <span className="text-lg animate-bounce">→</span>
                                    <div className={`absolute inset-0 animate-ping ${
                                      isDarkMode ? 'text-blue-300' : 'text-blue-500'
                                    }`}>→</div>
                                  </div>
                                </div>
                                
                                {/* Shimmer Effect */}
                                <div className="absolute inset-0 -skew-x-12 translate-x-full group-hover:translate-x-[-200%] transition-transform duration-1000 ease-out bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <div className={`px-4 py-8 text-center transition-all duration-500 animate-in fade-in slide-in-from-bottom-4 ${
                          isDarkMode ? 'text-gray-400' : 'text-gray-500'
                        }`}>
                          <div className="relative">
                            <Search className="h-8 w-8 mx-auto mb-2 opacity-50 animate-spin" 
                              style={{ animationDuration: '3s' }} />
                            <div className="absolute inset-0 h-8 w-8 mx-auto mb-2 animate-ping opacity-25">
                              <Search className="h-8 w-8" />
                            </div>
                          </div>
                          <p className="animate-pulse">No suggestions found</p>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>

              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Hero;