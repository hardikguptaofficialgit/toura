import { useEffect, useState } from 'react';
import { ArrowRight, MapPin, Calendar, Mountain, TreePine, Snowflake, Wind, Sun, Cloud, Camera } from 'lucide-react';
import { motion } from 'framer-motion';
// Theme removed; default to light mode
import VRViewer from './VRViewer';
import { VRService, VRPanorama } from '../services/vrService';
import OpenMap from './OpenMap';

const PopularDestinations = () => {
  const isDarkMode = false;
  const [isVRViewerOpen, setIsVRViewerOpen] = useState(false);
  const [selectedMonastery, setSelectedMonastery] = useState<any>(null);
  const [, setSelectedPanorama] = useState<VRPanorama | null>(null);
  const [activeCategory, setActiveCategory] = useState<'hotels'|'restaurants'|'sights'>('hotels');
  const [nearby, setNearby] = useState<any[]>([]);
  const [isLoadingNearby, setIsLoadingNearby] = useState(false);

  const OPENTRIPMAP_API_KEY = (import.meta as any).env?.VITE_OPENTRIPMAP_API_KEY as string | undefined;

  const kindsByCategory: Record<'hotels'|'restaurants'|'sights', string> = {
    hotels: 'accomodations',
    restaurants: 'restaurants',
    sights: 'interesting_places'
  };

  const fetchNearby = async (center: { lat: number; lng: number }, cat: 'hotels'|'restaurants'|'sights') => {
    if (!OPENTRIPMAP_API_KEY) return;
    setIsLoadingNearby(true);
    try {
      const url = new URL('https://api.opentripmap.com/0.1/en/places/radius');
      url.searchParams.set('radius', '4000');
      url.searchParams.set('lon', String(center.lng));
      url.searchParams.set('lat', String(center.lat));
      url.searchParams.set('kinds', kindsByCategory[cat]);
      url.searchParams.set('format', 'json');
      url.searchParams.set('limit', '50');
      url.searchParams.set('apikey', OPENTRIPMAP_API_KEY);
      const res = await fetch(url.toString());
      const data = await res.json();
      const items = Array.isArray(data) ? data : [];
      setNearby(items.map((p: any) => ({
        id: p.xid || `${p.lon},${p.lat}`,
        name: p.name || 'Unnamed',
        dist: p.dist,
        point: { lat: p.point?.lat, lng: p.point?.lon },
      })).filter((i: any) => i.point?.lat && i.point?.lng));
    } catch (e) {
      setNearby([]);
    } finally {
      setIsLoadingNearby(false);
    }
  };

  useEffect(() => {
    if (selectedMonastery) {
      fetchNearby(selectedMonastery.coordinates, activeCategory);
    }
  }, [selectedMonastery, activeCategory]);

  // Floating nature icons for background animation
  const FloatingNatureIcons = () => {
    const icons = [
      { Icon: Mountain, delay: 0, position: { top: '15%', left: '8%' } },
      { Icon: TreePine, delay: 1.5, position: { top: '25%', right: '12%' } },
      { Icon: Snowflake, delay: 3, position: { top: '70%', left: '10%' } },
      { Icon: Wind, delay: 4.5, position: { top: '60%', right: '15%' } },
      { Icon: Sun, delay: 6, position: { top: '40%', left: '5%' } },
      { Icon: Cloud, delay: 7.5, position: { top: '80%', right: '8%' } },
      { Icon: Mountain, delay: 9, position: { top: '10%', right: '5%' } },
      { Icon: TreePine, delay: 10.5, position: { top: '85%', left: '15%' } },
    ];

    return (
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {icons.map(({ Icon, delay, position }, index) => (
          <motion.div
            key={index}
            className="absolute"
            style={position}
            initial={{ opacity: 0, scale: 0, rotate: -90 }}
            animate={{ 
              opacity: [0, 0.15, 0.25, 0.15, 0],
              scale: [0, 0.6, 1, 0.6, 0],
              rotate: [0, 180, 360],
              y: [0, -10, 0, 10, 0],
              x: [0, -5, 0, 5, 0]
            }}
            transition={{
              duration: 15,
              delay: delay,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <Icon 
              className={`h-6 w-6 ${
                isDarkMode 
                  ? 'text-blue-400/20' 
                  : 'text-blue-600/25'
              }`} 
            />
          </motion.div>
        ))}
      </div>
    );
  };

  const monasteries = [
    {
    id: 1,
    name: 'Rumtek Monastery',
    image: 'https://static.toiimg.com/photo/msid-56621729,width-96,height-65.cms',
    location: 'East Sikkim',
    description: 'The largest monastery in Sikkim, known for its golden stupa and rich Tibetan architecture.',
    established: '1966',
    tradition: 'Kagyu',
    coordinates: { lat: 27.2855, lng: 88.5804 },
    hasVR: true
  },
  {
    id: 2,
    name: 'Pemayangtse Monastery',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRNiTeOc_4Qeu5YVoTu7EvxHCmrjSwxTL-ZuQ&s',
    location: 'West Sikkim',
    description: 'One of the oldest monasteries with stunning mountain views and intricate wood carvings.',
    established: '1705',
    tradition: 'Nyingma',
    coordinates: { lat: 27.2500, lng: 88.2000 },
    hasVR: true
  },
  {
    id: 3,
    name: 'Tashiding Monastery',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQOQwYQgykgzUNqZlLvJbG9OdGPriuwB3cSag&s',
    location: 'West Sikkim',
    description: 'Sacred monastery atop a conical hill between two rivers, offering spiritual serenity.',
    established: '1641',
    tradition: 'Nyingma',
    coordinates: { lat: 27.2000, lng: 88.1500 },
    hasVR: false
  },
  {
    id: 4,
    name: 'Enchey Monastery',
    image: 'https://static.toiimg.com/photo/msid-56621729,width-96,height-65.cms',
    location: 'East Sikkim',
    description: 'Beautiful monastery with panoramic views of Gangtok and the surrounding valleys.',
    established: '1909',
    tradition: 'Nyingma',
    coordinates: { lat: 27.3314, lng: 88.6138 },
    hasVR: true
  },
  {
    id: 5,
    name: 'Dubdi Monastery',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRNiTeOc_4Qeu5YVoTu7EvxHCmrjSwxTL-ZuQ&s',
    location: 'West Sikkim',
    description: 'The oldest monastery in Sikkim, also known as Yuksom Monastery, steeped in history.',
    established: '1701',
    tradition: 'Nyingma',
    coordinates: { lat: 27.1800, lng: 88.1000 },
    hasVR: false
  },
  {
    id: 6,
    name: 'Phensang Monastery',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQOQwYQgykgzUNqZlLvJbG9OdGPriuwB3cSag&s',
    location: 'North Sikkim',
    description: 'Ancient monastery nestled in the Himalayan foothills with breathtaking mountain vistas.',
    established: '1721',
    tradition: 'Gelug',
    coordinates: { lat: 27.4000, lng: 88.5000 },
    hasVR: false
  }
  
  ];

  const handleVRExperience = async (monastery: any) => {
    try {
      // Load available panoramas
      const panoramas = await VRService.loadPanoramas();
      
      // Prefer monastery-specific pano if present
      const specific = await VRService.getMonasteryPanoramaIfAvailable(
        monastery.name,
        monastery.coordinates
      );
      if (specific) {
        setSelectedPanorama(specific);
        setSelectedMonastery(monastery);
        setIsVRViewerOpen(true);
        return;
      }

      // Find panoramas near this monastery
      const nearbyPanoramas = VRService.getPanoramasByLocation(
        monastery.coordinates.lat,
        monastery.coordinates.lng,
        0.5 // 0.5 degree radius
      );

      if (nearbyPanoramas.length > 0) {
        setSelectedPanorama(nearbyPanoramas[0]);
        setSelectedMonastery(monastery);
        setIsVRViewerOpen(true);
      } else {
        // Fallback to first available panorama
        setSelectedPanorama(panoramas[0]);
        setSelectedMonastery(monastery);
        setIsVRViewerOpen(true);
      }
    } catch (error) {
      console.error('Failed to load VR experience:', error);
      alert('Failed to load VR experience. Please try again.');
    }
  };

  const handleCloseVR = () => {
    setIsVRViewerOpen(false);
    setSelectedMonastery(null);
    setSelectedPanorama(null);
  };

  return (
    <section id="monasteries" className="relative py-24 bg-gray-50 dark:bg-gray-900 overflow-hidden">
      {/* Floating Background Animations */}
      <FloatingNatureIcons />
      
      {/* Gradient Background Overlay */}
      <motion.div
        className="absolute inset-0 opacity-30"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 0.3 }}
        transition={{ duration: 2 }}
        viewport={{ once: true }}
        style={{
          background: isDarkMode
            ? 'radial-gradient(circle at 20% 50%, rgba(59, 130, 246, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(147, 51, 234, 0.1) 0%, transparent 50%)'
            : 'radial-gradient(circle at 20% 50%, rgba(59, 130, 246, 0.05) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(147, 51, 234, 0.05) 0%, transparent 50%)'
        }}
      />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Sacred Monasteries
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Discover Sikkim's ancient spiritual centers through immersive digital experiences
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {monasteries.map((monastery, index) => (
            <motion.div
              key={monastery.id}
              className="group bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-200 dark:border-gray-700 overflow-hidden"
              style={{
                clipPath: 'polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 0 100%)'
              }}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <div className="relative h-64 overflow-hidden">
                <img
                  src={monastery.image}
                  alt={monastery.name}
                  className="w-full h-full object-cover transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                
                {/* Tradition Badge */}
                <div className="absolute top-4 right-4 bg-black/70 backdrop-blur-sm text-white text-sm px-3 py-1 font-medium">
                  {monastery.tradition}
                </div>
                
                {/* VR Badge */}
                {monastery.hasVR && (
                  <div className="absolute top-4 left-4 bg-orange-500/90 backdrop-blur-sm text-white text-sm px-3 py-1 font-medium flex items-center gap-1">
                    <Camera className="w-3 h-3" />
                    <span>VR</span>
                  </div>
                )}
                
                <div className="absolute bottom-4 left-4 text-white">
                  <h3 className="text-xl font-bold mb-1">{monastery.name}</h3>
                  <div className="flex items-center text-sm opacity-90">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span>{monastery.location}</span>
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm mb-3">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span>Established {monastery.established}</span>
                </div>
                
                <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                  {monastery.description}
                </p>
                
                <button 
                  onClick={() => handleVRExperience(monastery)}
                  className={`inline-flex items-center font-semibold transition-colors group ${
                    monastery.hasVR 
                      ? 'text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300' 
                      : 'text-gray-400 dark:text-gray-500 cursor-not-allowed'
                  }`}
                  disabled={!monastery.hasVR}
                >
                  <Camera className="mr-2 h-4 w-4" />
                  <span>{monastery.hasVR ? 'Explore Virtual Tour' : 'VR Coming Soon'}</span>
                  {monastery.hasVR && <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />}
                </button>

                {/* Nearby places controls */}
                <div className="mt-4 flex flex-wrap gap-2">
                  {(['hotels','restaurants','sights'] as const).map((cat) => (
                    <button
                      key={cat}
                      onClick={() => { setSelectedMonastery(monastery); setActiveCategory(cat); }}
                      className={`px-3 py-1.5 rounded-full border text-sm ${selectedMonastery?.id===monastery.id && activeCategory===cat ? 'bg-orange-600 text-white border-orange-600' : 'bg-white text-gray-700 border-gray-200 hover:bg-orange-50'}`}
                    >
                      {cat.charAt(0).toUpperCase()+cat.slice(1)} nearby
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Nearby places map + list (OpenStreetMap) */}
        {selectedMonastery && (
          <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <OpenMap
                className="w-full h-[420px] rounded-2xl border border-gray-200"
                center={selectedMonastery.coordinates}
                zoom={13}
                markers={nearby.map(p => ({ id: p.id, position: p.point, title: p.name }))}
              />
            </div>
            <div className="bg-white rounded-2xl border border-gray-200 p-4 max-h-[420px] overflow-y-auto">
              <div className="font-semibold mb-2 text-gray-900">Nearby {activeCategory} around {selectedMonastery.name}</div>
              {isLoadingNearby ? (
                <div className="text-sm text-gray-600">Loading…</div>
              ) : nearby.length === 0 ? (
                <div className="text-sm text-gray-600">No results found.</div>
              ) : (
                <ul className="space-y-2">
                  {nearby.slice(0, 30).map((p) => (
                    <li key={p.id} className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50">
                      <div className="text-sm font-medium text-gray-900 truncate">{p.name}</div>
                      {typeof p.dist === 'number' && (
                        <div className="text-xs text-gray-500">{Math.round(p.dist)} m away</div>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}

        <div className="text-center mt-12">
          <button className="inline-flex items-center px-8 py-3 bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white font-semibold rounded-lg hover:border-blue-500 dark:hover:border-blue-400 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-300">
            <span>View All Monasteries</span>
            <ArrowRight className="ml-2 h-5 w-5" />
          </button>
        </div>
      </div>

      {/* VR Viewer Modal */}
      {selectedMonastery && (
        <VRViewer
          isOpen={isVRViewerOpen}
          onClose={handleCloseVR}
          place={{
            name: selectedMonastery.name,
            coordinates: selectedMonastery.coordinates,
            description: selectedMonastery.description
          }}
        />
      )}
    </section>
  );
};

export default PopularDestinations;