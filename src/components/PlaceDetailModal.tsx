import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Star,
  MapPin,
  Clock,
  Phone,
  Globe,
  Camera,
  Heart,
  Share2,
  Navigation,
  Calendar,
  Users,
  Info,
  Shield,
  Thermometer,
  Mountain,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { PlaceDetail } from '../services/sikkimData';
import VRViewer from './VRViewer';

interface PlaceDetailModalProps {
  isOpen: boolean;
  place: PlaceDetail | null;
  onClose: () => void;
}

const PlaceDetailModal: React.FC<PlaceDetailModalProps> = ({ isOpen, place, onClose }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<'overview' | 'details' | 'reviews' | 'photos'>('overview');
  const [isFavorite, setIsFavorite] = useState(false);
  const [isPhotoViewerOpen, setIsPhotoViewerOpen] = useState(false);
  const [photoViewerIndex, setPhotoViewerIndex] = useState(0);
  const [isVRViewerOpen, setIsVRViewerOpen] = useState(false);

  if (!place) return null;

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % place.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + place.images.length) % place.images.length);
  };

  const openPhotoViewerAt = (index: number) => {
    setPhotoViewerIndex(index);
    setIsPhotoViewerOpen(true);
  };

  const renderStarRating = (rating: number) => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-5 w-5 ${
              star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
            }`}
          />
        ))}
        <span className="ml-2 text-lg font-semibold">{rating}</span>
        <span className="text-gray-600">({place.reviewCount.toLocaleString()} reviews)</span>
      </div>
    );
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] bg-black/50 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="h-full w-full bg-white dark:bg-gray-900 overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="relative h-80 bg-gray-900 overflow-hidden">
              {/* Image Carousel */}
              <div className="relative h-full">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={currentImageIndex}
                    src={place.images[currentImageIndex]}
                    alt={place.name}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className="w-full h-full object-cover cursor-zoom-in"
                    onClick={() => openPhotoViewerAt(currentImageIndex)}
                  />
                </AnimatePresence>

                {/* Image Navigation */}
                {place.images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 p-3 rounded-full bg-black/50 text-white hover:bg-black/70 transition-all duration-300"
                    >
                      <ChevronLeft className="h-6 w-6" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 p-3 rounded-full bg-black/50 text-white hover:bg-black/70 transition-all duration-300"
                    >
                      <ChevronRight className="h-6 w-6" />
                    </button>
                  </>
                )}

                {/* Thumbnails Strip */}
                {place.images.length > 1 && (
                  <div className="absolute bottom-3 left-6 right-6">
                    <div className="flex gap-2 overflow-x-auto scrollbar-hide">
                      {place.images.map((thumb, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentImageIndex(index)}
                          className={`relative h-12 w-16 rounded-md overflow-hidden ring-2 transition ${index === currentImageIndex ? 'ring-white' : 'ring-transparent hover:ring-white/50'}`}
                          aria-label={`View image ${index + 1}`}
                        >
                          <img src={thumb} alt="thumbnail" className="h-full w-full object-cover" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Header Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30" />

                {/* Close Button */}
                <button
                  onClick={onClose}
                  className="absolute top-6 right-6 p-3 rounded-full bg-black/50 text-white hover:bg-black/70 transition-all duration-300"
                >
                  <X className="h-6 w-6" />
                </button>

                {/* Action Buttons */}
                <div className="absolute top-6 left-6 flex space-x-3">
                  <button
                    onClick={() => setIsFavorite(!isFavorite)}
                    className={`p-3 rounded-full transition-all duration-300 ${
                      isFavorite
                        ? 'bg-red-500 text-white'
                        : 'bg-black/50 text-white hover:bg-black/70'
                    }`}
                  >
                    <Heart className={`h-6 w-6 ${isFavorite ? 'fill-current' : ''}`} />
                  </button>
                  <button className="p-3 rounded-full bg-black/50 text-white hover:bg-black/70 transition-all duration-300">
                    <Share2 className="h-6 w-6" />
                  </button>
                  <button className="p-3 rounded-full bg-black/50 text-white hover:bg-black/70 transition-all duration-300" onClick={() => openPhotoViewerAt(currentImageIndex)}>
                    <Camera className="h-6 w-6" />
                  </button>
                </div>

                {/* Place Info Overlay */}
                <div className="absolute bottom-6 left-6 right-6 text-white">
                  <div className="mb-3">
                    <span className="inline-block px-3 py-1 bg-orange-500 text-white text-sm font-medium rounded-full">
                      {place.subcategory}
                    </span>
                  </div>
                  <h1 className="text-4xl font-bold mb-3">{place.name}</h1>
                  <div className="flex items-center space-x-4 mb-3">
                    {renderStarRating(place.rating)}
                  </div>
                  <div className="flex items-center text-white/90">
                    <MapPin className="h-5 w-5 mr-2" />
                    <span>{place.location.address}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto">
              {/* Tab Navigation */}
              <div className="sticky top-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 z-10">
                <div className="max-w-6xl mx-auto px-6">
                  <div className="flex space-x-8">
                    {[
                      { id: 'overview', label: 'Overview', icon: Info },
                      { id: 'details', label: 'Details', icon: MapPin },
                      { id: 'reviews', label: 'Reviews', icon: Star },
                      { id: 'photos', label: 'Photos', icon: Camera }
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`flex items-center space-x-2 py-4 px-2 border-b-2 transition-all duration-300 ${
                          activeTab === tab.id
                            ? 'border-orange-500 text-orange-500'
                            : 'border-transparent text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
                        }`}
                      >
                        <tab.icon className="h-5 w-5" />
                        <span className="font-medium">{tab.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Tab Content */}
              <div className="max-w-6xl mx-auto px-6 py-8">
                <AnimatePresence mode="wait">
                  {activeTab === 'overview' && (
                    <motion.div
                      key="overview"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-8"
                    >
                      {/* Description */}
                      <div>
                        <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">About</h2>
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg">
                          {place.description}
                        </p>
                      </div>

                      {/* Quick Info */}
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl">
                          <div className="flex items-center space-x-3 mb-3">
                            <Clock className="h-6 w-6 text-orange-500" />
                            <h3 className="font-semibold text-gray-900 dark:text-white">Duration</h3>
                          </div>
                          <p className="text-gray-700 dark:text-gray-300">{place.details.duration}</p>
                        </div>

                        <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl">
                          <div className="flex items-center space-x-3 mb-3">
                            <Calendar className="h-6 w-6 text-orange-500" />
                            <h3 className="font-semibold text-gray-900 dark:text-white">Best Time</h3>
                          </div>
                          <p className="text-gray-700 dark:text-gray-300">{place.details.bestTimeToVisit}</p>
                        </div>

                        {place.details.difficulty && (
                          <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl">
                            <div className="flex items-center space-x-3 mb-3">
                              <Mountain className="h-6 w-6 text-orange-500" />
                              <h3 className="font-semibold text-gray-900 dark:text-white">Difficulty</h3>
                            </div>
                            <p className="text-gray-700 dark:text-gray-300">{place.details.difficulty}</p>
                          </div>
                        )}
                      </div>

                      {/* Highlights */}
                      <div>
                        <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Highlights</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {place.highlights.map((highlight, index) => (
                            <div key={index} className="flex items-center space-x-3">
                              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                              <span className="text-gray-700 dark:text-gray-300">{highlight}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Tips */}
                      <div>
                        <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Tips</h2>
                        <div className="space-y-3">
                          {place.tips.map((tip, index) => (
                            <div key={index} className="flex items-start space-x-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                              <Shield className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                              <span className="text-gray-700 dark:text-gray-300">{tip}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {activeTab === 'details' && (
                    <motion.div
                      key="details"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-8"
                    >
                      {/* Timing & Entry */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                          <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Timings</h3>
                          <div className="space-y-3">
                            <div className="flex items-center space-x-3">
                              <Clock className="h-5 w-5 text-gray-500" />
                              <span className="text-gray-700 dark:text-gray-300">{place.details.timings}</span>
                            </div>
                          </div>
                        </div>

                        <div>
                          <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Entry Fee</h3>
                          <div className="space-y-3">
                            <div className="flex items-center space-x-3">
                              <Users className="h-5 w-5 text-gray-500" />
                              <span className="text-gray-700 dark:text-gray-300">{place.details.entryFee}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Amenities */}
                      <div>
                        <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Amenities</h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                          {place.details.amenities.map((amenity, index) => (
                            <div key={index} className="flex items-center space-x-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                              <span className="text-sm text-gray-700 dark:text-gray-300">{amenity}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Contact Information */}
                      {place.contact && (
                        <div>
                          <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Contact</h3>
                          <div className="space-y-3">
                            {place.contact.phone && (
                              <div className="flex items-center space-x-3">
                                <Phone className="h-5 w-5 text-gray-500" />
                                <span className="text-gray-700 dark:text-gray-300">{place.contact.phone}</span>
                              </div>
                            )}
                            {place.contact.website && (
                              <div className="flex items-center space-x-3">
                                <Globe className="h-5 w-5 text-gray-500" />
                                <a href={place.contact.website} className="text-blue-600 hover:text-blue-700">
                                  {place.contact.website}
                                </a>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Location */}
                      <div>
                        <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Location</h3>
                        <div className="space-y-3">
                          <div className="flex items-center space-x-3">
                            <MapPin className="h-5 w-5 text-gray-500" />
                            <span className="text-gray-700 dark:text-gray-300">{place.location.address}</span>
                          </div>
                          <div className="flex items-center space-x-3">
                            <Navigation className="h-5 w-5 text-gray-500" />
                            <span className="text-gray-700 dark:text-gray-300">
                              {place.location.coordinates.lat}, {place.location.coordinates.lng}
                            </span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {activeTab === 'reviews' && (
                    <motion.div
                      key="reviews"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-8"
                    >
                      <div className="text-center">
                        <div className="text-6xl font-bold text-gray-900 dark:text-white mb-2">{place.rating}</div>
                        <div className="flex justify-center mb-2">{renderStarRating(place.rating)}</div>
                        <p className="text-gray-600 dark:text-gray-400">Based on {place.reviewCount.toLocaleString()} reviews</p>
                      </div>
                      
                      {/* Placeholder for reviews */}
                      <div className="text-center py-12">
                        <p className="text-gray-500 dark:text-gray-400">Detailed reviews coming soon...</p>
                      </div>
                    </motion.div>
                  )}

                  {activeTab === 'photos' && (
                    <motion.div
                      key="photos"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-8"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {place.images.map((image, index) => (
                          <button
                            key={index}
                            className="relative aspect-square overflow-hidden rounded-xl group"
                            onClick={() => openPhotoViewerAt(index)}
                            aria-label={`Open photo ${index + 1}`}
                          >
                            <img
                              src={image}
                              alt={`${place.name} - Photo ${index + 1}`}
                              className="w-full h-full object-cover transition-transform duration-300"
                            />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition" />
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Bottom Action Bar */}
            <div className="sticky bottom-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 p-6">
              <div className="max-w-6xl mx-auto flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {place.details.entryFee}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">per person</div>
                </div>
                <div className="flex space-x-4">
                  <button
                    className="px-8 py-3 bg-gray-900 text-white rounded-xl font-semibold hover:bg-black transition-all duration-300"
                    onClick={() => setIsVRViewerOpen(true)}
                  >
                    Virtually Experience this
                  </button>
                  <button className="px-8 py-3 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition-all duration-300">
                    Add to Trip
                  </button>
                  <button className="px-8 py-3 bg-orange-500 text-white rounded-xl font-semibold hover:bg-orange-600 transition-all duration-300">
                    Book Now
                  </button>
                </div>
              </div>
            </div>

            {/* Fullscreen Photo Viewer */}
            <AnimatePresence>
              {isPhotoViewerOpen && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 z-[10000] bg-black/90 flex items-center justify-center"
                >
                  <button
                    className="absolute top-6 right-6 p-3 rounded-full bg-white/10 text-white hover:bg-white/20"
                    onClick={() => setIsPhotoViewerOpen(false)}
                    aria-label="Close photo viewer"
                  >
                    <X className="h-6 w-6" />
                  </button>
                  {place.images.length > 1 && (
                    <>
                      <button onClick={() => setPhotoViewerIndex((photoViewerIndex - 1 + place.images.length) % place.images.length)} className="absolute left-6 p-3 rounded-full bg-white/10 text-white hover:bg-white/20">
                        <ChevronLeft className="h-6 w-6" />
                      </button>
                      <button onClick={() => setPhotoViewerIndex((photoViewerIndex + 1) % place.images.length)} className="absolute right-6 p-3 rounded-full bg-white/10 text-white hover:bg-white/20">
                        <ChevronRight className="h-6 w-6" />
                      </button>
                    </>
                  )}
                  <motion.img
                    key={photoViewerIndex}
                    src={place.images[photoViewerIndex]}
                    alt={`${place.name} - Fullscreen Photo`}
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.2 }}
                    className="max-h-[85vh] max-w-[90vw] object-contain"
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {/* VR Viewer */}
            <VRViewer
              isOpen={isVRViewerOpen}
              onClose={() => setIsVRViewerOpen(false)}
              place={{
                name: place.name,
                coordinates: place.location.coordinates,
                description: place.description,
                images: place.images,
              }}
            />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default PlaceDetailModal; 