import React, { useState, useEffect, useRef } from 'react';
import { Search, Mountain, Camera, Compass, Backpack, TreePine, AudioWaveform } from 'lucide-react';
import VoiceChatModal from './VoiceChatModal';
import { motion, useAnimation, AnimatePresence } from 'framer-motion';
import Silk from './Silk';
import Navigation from './Navigation';
import MonasteryModal, { MonasteryInfo } from './MonasteryModal';
import MonasteryResultsModal from './MonasteryResultsModal';

const Hero: React.FC = () => {
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
    "Explore monasteries in",
    "Where to go in",
    "Great stays in",
    "Things to do in",
    "Places to eat in",
    "Find flights to",
    "Find stays in"
  ];

  // Monastery suggestions only
  const searchSuggestions = [
    { icon: Mountain, text: 'Rumtek Monastery', category: 'Monasteries' },
    { icon: Mountain, text: 'Pemayangtse Monastery', category: 'Monasteries' },
    { icon: Mountain, text: 'Enchey Monastery', category: 'Monasteries' },
    { icon: Mountain, text: 'Tashiding Monastery', category: 'Monasteries' },
    { icon: Mountain, text: 'Dubdi Monastery', category: 'Monasteries' },
    { icon: Mountain, text: 'Phensang Monastery', category: 'Monasteries' },
    { icon: Mountain, text: 'Ralang Monastery', category: 'Monasteries' },
    { icon: Mountain, text: 'Lingdum (Ranka) Monastery', category: 'Monasteries' },
    { icon: Mountain, text: 'Phodong Monastery', category: 'Monasteries' },
    { icon: Mountain, text: 'Sanga Choeling Monastery', category: 'Monasteries' },
    { icon: Mountain, text: 'Khecheopalri (Wishing Lake) Monastery', category: 'Monasteries' },
  ];

  // Monastery data (placeholder content)
  const monasteryData: Record<string, MonasteryInfo> = {
    'Rumtek Monastery': {
      id: 'rumtek',
      name: 'Rumtek Monastery',
      location: 'East Sikkim',
      history: 'Rumtek Monastery is one of the largest and most significant monasteries in Sikkim, known for its vibrant architecture and spiritual importance within the Karma Kagyu lineage.',
      timings: '8:00 AM - 5:00 PM',
      entryFee: '₹50 (adults), ₹20 (children) - subject to change',
      contact: { phone: '+91-3592-xxxxx', email: 'info@rumtek.org', website: 'https://example.com/rumtek' },
      photos: [
        '/images/monasteries/rumtek1.png',
        '/images/monasteries/rumtek2.png'
      ],
      virtualTourUrl: 'https://example.com/rumtek-virtual',
      reviews: [
        { user: 'Aarav', rating: 5, comment: 'Peaceful and beautiful monastery with rich heritage.', date: 'Aug 2024' },
        { user: 'Meera', rating: 4, comment: 'Great experience, serene surroundings.', date: 'Jul 2024' }
      ],
      amenities: ['Guided Tours', 'Parking', 'Restrooms', 'Photography Allowed'],
      events: [{ title: 'Annual Prayer Ceremony', date: 'Nov 10, 2025', description: 'A special prayer ceremony open to visitors.' }],
      nearby: {
        hotels: [
          { id: 'h1', name: 'Himalayan View Resort', rating: 4.4, pricePerNight: '₹4,200', distance: '2.1 km', amenities: ['WiFi', 'Breakfast', 'Mountain View'] },
          { id: 'h2', name: 'Rumtek Residency', rating: 4.0, pricePerNight: '₹3,100', distance: '1.4 km', amenities: ['WiFi', 'Parking', 'Restaurant'] }
        ],
        restaurants: [
          { id: 'r1', name: 'Monk Kitchen', cuisine: 'Tibetan', priceRange: '₹₹', rating: 4.5, distance: '900 m' },
          { id: 'r2', name: 'Gangtok Bites', cuisine: 'Indian', priceRange: '₹₹', rating: 4.1, distance: '1.1 km' }
        ],
        attractions: [
          { id: 'a1', name: 'Rumtek View Point', distance: '1.8 km', lat: 27.3226, lng: 88.6244 } as any,
          { id: 'a2', name: 'Botanical Garden', distance: '3.2 km', lat: 27.3252, lng: 88.6169 } as any
        ]
      },
      mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d28472.608...'
    },
    'Pemayangtse Monastery': {
      id: 'pemayangtse',
      name: 'Pemayangtse Monastery',
      location: 'West Sikkim',
      history: 'One of the oldest monasteries in Sikkim, famed for its exquisite woodwork and spiritual significance.',
      timings: '9:00 AM - 5:00 PM',
      entryFee: '₹50',
      photos: [
        '/images/monasteries/pemayangtse1.png',
        '/images/monasteries/pemayangtse2.png'
      ],
      virtualTourUrl: 'https://example.com/pemayangtse-virtual',
      reviews: [
        { user: 'Rohit', rating: 5, comment: 'Stunning views and architecture.', date: 'Jun 2024' },
        { user: 'Priya', rating: 4, comment: 'Peaceful ambience, well maintained museum.', date: 'May 2024' }
      ],
      nearby: { hotels: [], restaurants: [], attractions: [] }
    },
    'Enchey Monastery': {
      id: 'enchey', name: 'Enchey Monastery', location: 'Gangtok, East Sikkim',
      history: 'A 200-year-old monastery believed to be blessed by Lama Drupthob Karpo. Offers dramatic views of Kanchendzonga.',
      timings: '9:00 AM - 5:00 PM', entryFee: 'Free',
      photos: [
        '/images/monasteries/enchey1.png',
        '/images/monasteries/enchey2.png'
      ],
      reviews: [
        { user: 'Kiran', rating: 4, comment: 'Quiet, serene, and close to town.', date: 'Mar 2024' },
        { user: 'Sonia', rating: 5, comment: 'Beautiful murals and a calm courtyard.', date: 'Jan 2024' }
      ],
      nearby: { hotels: [], restaurants: [], attractions: [] }
    },
    'Tashiding Monastery': {
      id: 'tashiding', name: 'Tashiding Monastery', location: 'West Sikkim',
      history: 'One of the holiest monasteries of Nyingma sect, perched on a hill between Rangeet and Rathong rivers.',
      timings: '7:00 AM - 6:00 PM', entryFee: '₹30',
      photos: [
        '/images/monasteries/tashiding1.png',
        '/images/monasteries/tashiding2.png'
      ],
      reviews: [
        { user: 'Dev', rating: 5, comment: 'Sacred place with powerful spiritual vibe.', date: 'Apr 2024' }
      ],
      nearby: { hotels: [], restaurants: [], attractions: [] }
    },
    'Dubdi Monastery': {
      id: 'dubdi', name: 'Dubdi Monastery', location: 'Yuksom, West Sikkim',
      history: 'Founded in 1701, the oldest monastery in Sikkim; also called Yuksom Monastery.',
      timings: '9:00 AM - 5:00 PM', entryFee: '₹20',
      photos: [
        '/images/monasteries/dubdi1.png',
        '/images/monasteries/dubdi2.png'
      ],
      reviews: [
        { user: 'Arun', rating: 4, comment: 'Short hike rewards with solitude and heritage.', date: 'Oct 2024' }
      ],
      nearby: { hotels: [], restaurants: [], attractions: [] }
    },
    'Phensang Monastery': {
      id: 'phensang', name: 'Phensang Monastery', location: 'North Sikkim',
      history: 'Established in 1721, known for its annual festival before Losoong.',
      timings: '8:00 AM - 5:00 PM', entryFee: '₹20',
      photos: [
        '/images/monasteries/phensang1.png',
        '/images/monasteries/phensang2.png'
      ],
      reviews: [
        { user: 'Nima', rating: 5, comment: 'Less-crowded and authentic experience.', date: 'Dec 2024' }
      ],
      nearby: { hotels: [], restaurants: [], attractions: [] }
    },
    'Ralang Monastery': {
      id: 'ralang', name: 'Ralang Monastery', location: 'South Sikkim',
      history: 'Important Kagyu monastery famous for its sprawling complex and sacred relics.',
      timings: '8:00 AM - 5:00 PM', entryFee: '₹30',
      photos: [
        '/images/monasteries/ralang1.png',
        '/images/monasteries/ralang2.png'
      ],
      reviews: [
        { user: 'Tashi', rating: 5, comment: 'Colorful architecture and scenic surroundings.', date: 'Sep 2024' }
      ],
      nearby: { hotels: [], restaurants: [], attractions: [] }
    },
    'Lingdum (Ranka) Monastery': {
      id: 'lingdum', name: 'Lingdum (Ranka) Monastery', location: 'Near Gangtok, East Sikkim',
      history: 'Modern monastery renowned for its expansive courtyard and training of young monks.',
      timings: '8:00 AM - 5:00 PM', entryFee: '₹30',
      photos: [
        '/images/monasteries/lingdum1.png',
        '/images/monasteries/lingdum2.png'
      ],
      reviews: [
        { user: 'Alicia', rating: 4, comment: 'Great for photography; peaceful.', date: 'Aug 2024' }
      ],
      nearby: { hotels: [], restaurants: [], attractions: [] }
    },
    'Phodong Monastery': {
      id: 'phodong', name: 'Phodong Monastery', location: 'North Sikkim',
      history: 'Built in early 18th century; known for murals and masked dances during festivals.',
      timings: '8:00 AM - 5:00 PM', entryFee: '₹20',
      photos: [
        '/images/monasteries/phodong1.png',
        '/images/monasteries/phodong2.png'
      ],
      reviews: [
        { user: 'Rahul', rating: 4, comment: 'Atmospheric and historic.', date: 'Feb 2025' }
      ],
      nearby: { hotels: [], restaurants: [], attractions: [] }
    },
    'Sanga Choeling Monastery': {
      id: 'sangachoeling', name: 'Sanga Choeling Monastery', location: 'Near Pelling, West Sikkim',
      history: 'One of the oldest monasteries in Sikkim, reachable via a short forested trek.',
      timings: '8:00 AM - 5:00 PM', entryFee: '₹20',
      photos: [
        '/images/monasteries/sangachoeling1.png',
        '/images/monasteries/sangachoeling2.png'
      ],
      reviews: [
        { user: 'Ishita', rating: 5, comment: 'Sunset views are incredible!', date: 'Oct 2024' }
      ],
      nearby: { hotels: [], restaurants: [], attractions: [] }
    },
    'Khecheopalri (Wishing Lake) Monastery': {
      id: 'khecheopalri', name: 'Khecheopalri (Wishing Lake) Monastery', location: 'West Sikkim',
      history: 'Sacred lake complex with monastery; believed that not a leaf is allowed to float on the water by birds.',
      timings: '8:00 AM - 5:00 PM', entryFee: '₹20',
      photos: [
        '/images/monasteries/khecheopalri1.png',
        '/images/monasteries/khecheopalri2.png'
      ],
      reviews: [
        { user: 'Kabir', rating: 4, comment: 'Mystical experience by the lake.', date: 'Nov 2024' }
      ],
      nearby: { hotels: [], restaurants: [], attractions: [] }
    }
  };

  // Dynamic placeholders based on current prefix
  const placeholderTexts: Record<string, string[]> = {
    "Explore monasteries in": ["Rumtek Monastery", "Pemayangtse tour", "Enchey Monastery"],
    "Where to go in": ["Plan Gangtok trip", "Pelling views", "Yuksom trek", "Lachen valley"],
    "Great stays in": ["Luxury hotel in Gangtok", "Mountain resort", "Cozy homestay"],
    "Things to do in": ["Paragliding adventure", "River rafting", "Gangtok cable car"],
    "Places to eat in": ["Authentic momos", "Sikkimese thali", "Local dal-bhat"],
    "Find flights to": ["Pakyong", "Bagdogra", "Cheap flights"],
    "Find stays in": ["Mountain hotels", "Eco-friendly stays", "Luxury resorts"]
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
    suggestion.text.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setShowSuggestions(e.target.value.length > 0);
  };

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedMonastery, setSelectedMonastery] = useState<MonasteryInfo | null>(null);
  const [resultsOpen, setResultsOpen] = useState(false);
  const [voiceOpen, setVoiceOpen] = useState(false);

  const handleSuggestionClick = (suggestion: string) => {
    setSearchQuery(suggestion);
    setShowSuggestions(false);
    const data = monasteryData[suggestion];
    if (data) {
      setSelectedMonastery(data);
      setModalOpen(true);
    }
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
    <section className="relative min-h-screen flex items-center justify-center overflow-visible transition-colors duration-300">
      
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
            {/* Navigation - hidden when any modal is open */}
            {(!modalOpen && !resultsOpen) && (
              <Navigation onSignInClick={() => {}}
              />
            )}
            
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
                color={"#e35717"}
                noiseIntensity={1.5}
                rotation={0}
              />
            </div>

         

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
                  className="mx-auto w-full max-w-xl md:max-w-2xl relative"
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 1, delay: 1 }}
                >
                  <div className={`flex items-center px-4 sm:px-5 py-3 sm:py-4 rounded-full shadow-lg border h-14 sm:h-16 w-full bg-white/95 border-orange-200`}>
                    <Search className={`h-6 w-6 mr-4 flex-shrink-0 text-orange-500`} />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={handleSearchChange}
                      onKeyPress={handleKeyPress}
                      onFocus={() => setShowSuggestions(searchQuery.length > 0)}
                      onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                      placeholder={currentPlaceholder}
                      className={`flex-1 text-base sm:text-lg bg-transparent outline-none min-w-0 text-gray-900 placeholder-gray-500`}
                    />
                    <button 
                      onClick={handleSearch}
                      className="ml-3 sm:ml-4 px-4 sm:px-6 py-2 bg-orange-500 text-white font-semibold rounded-full shadow hover:bg-orange-600 transition-colors"
                    >
                      Search
                    </button>
                    <button
                      type="button"
                      aria-label="Voice search"
                      onClick={() => setVoiceOpen(true)}
                      className="ml-2 inline-flex items-center justify-center w-10 h-10 rounded-full bg-white text-orange-600 border border-orange-200 shadow hover:bg-orange-50"
                    >
                      <AudioWaveform className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Search Suggestions Dropdown */}
                  <div className={`absolute top-full mt-2 w-full rounded-xl shadow-lg border z-[200] overflow-hidden ${
                    showSuggestions ? 'opacity-100' : 'opacity-0 pointer-events-none'
                  } bg-white`}
                  style={{
                    transition: 'opacity 200ms ease'
                  }}>
                    <div className="max-h-96 overflow-y-auto overscroll-contain">
                      {filteredSuggestions.length > 0 ? (
                        <div className="p-2">
                          {filteredSuggestions.slice(0, 3).map((suggestion, index) => {
                            const IconComponent = suggestion.icon;
                            return (
                              <div
                                key={`${suggestion.text}-${index}`}
                                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-gray-900 hover:bg-orange-50`}
                                onMouseDown={() => handleSuggestionClick(suggestion.text)}
                              >
                                <IconComponent className={`h-5 w-5 text-orange-600`} />
                                <div className="flex-1 overflow-hidden">
                                  <div className={`font-medium text-gray-900`}>{suggestion.text}</div>
                                  <div className={`text-sm text-orange-600`}>Monastery</div>
                                </div>
                                <button
                                  onMouseDown={(e) => { e.stopPropagation(); handleSuggestionClick(suggestion.text); }}
                                  className="shrink-0 px-3 py-1.5 rounded-full bg-orange-600 text-white text-sm hover:bg-orange-500"
                                  aria-label={`Open ${suggestion.text}`}
                                >
                                  Go for it
                                </button>
                              </div>
                            );
                          })}
                          {filteredSuggestions.length > 3 && (
                            <button
                              onMouseDown={() => { setResultsOpen(true); setShowSuggestions(false); }}
                              className="w-full mt-1 px-4 py-2 text-center rounded-lg bg-white border border-orange-200 text-orange-600 hover:bg-orange-50"
                            >
                              See all ({filteredSuggestions.length})
                            </button>
                          )}
                        </div>
                      ) : (
                        <div className={`px-4 py-6 text-center text-gray-500`}>
                          <div className="relative">
                            <Search className="h-7 w-7 mx-auto mb-2 opacity-50" />
                          </div>
                          <p>No suggestions found</p>
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
      <MonasteryModal open={modalOpen} onClose={() => setModalOpen(false)} monastery={selectedMonastery} />
      <MonasteryResultsModal
        open={resultsOpen}
        onClose={() => setResultsOpen(false)}
        items={filteredSuggestions.map(s => ({ name: s.text }))}
        onSelect={(name) => { handleSuggestionClick(name); setResultsOpen(false); }}
      />
      <VoiceChatModal isOpen={voiceOpen} onClose={() => setVoiceOpen(false)} />
    </section>
  );
};

export default Hero;