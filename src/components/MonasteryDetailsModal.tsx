import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MapPin, Clock, Star, Phone, Globe, Camera, BookOpen, 
  Users, Calendar, Heart, Share2, ArrowRight, ChevronDown,
  ChevronUp, Scroll, Mountain, TreePine, Shield, Award,
  Calendar as CalendarIcon, Route, Book, Eye, Download
} from 'lucide-react';
import ModalCloseButton from './ModalCloseButton';
import { MonasteryHeritage, MonasteryManuscript, MonasteryFestival, SpiritualRoute } from '../services/monasteryData';

interface MonasteryDetailsModalProps {
  monastery: MonasteryHeritage;
  isOpen: boolean;
  onClose: () => void;
}

const MonasteryDetailsModal: React.FC<MonasteryDetailsModalProps> = ({ monastery, isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'manuscripts' | 'festivals' | 'routes' | 'heritage'>('overview');
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());
  const [selectedManuscript, setSelectedManuscript] = useState<MonasteryManuscript | null>(null);
  const [showManuscriptReader, setShowManuscriptReader] = useState(false);

  const toggleSection = (sectionId: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
    }
    setExpandedSections(newExpanded);
  };

  const openManuscriptReader = (manuscript: MonasteryManuscript) => {
    setSelectedManuscript(manuscript);
    setShowManuscriptReader(true);
  };

  const getHeritageStatusColor = (status: string) => {
    switch (status) {
      case 'UNESCO': return 'bg-red-100 text-red-800 border-red-200';
      case 'National': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'State': return 'bg-green-100 text-green-800 border-green-200';
      case 'Local': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getConservationStatusColor = (status: string) => {
    switch (status) {
      case 'Excellent': return 'bg-green-100 text-green-800';
      case 'Good': return 'bg-blue-100 text-blue-800';
      case 'Fair': return 'bg-yellow-100 text-yellow-800';
      case 'Poor': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[300] flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl w-full max-w-7xl h-[95vh] flex flex-col overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-orange-50 to-amber-50">
            <div className="flex-1">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">{monastery.name}</h2>
              <div className="flex items-center space-x-4 text-gray-600">
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span>{monastery.location}</span>
                </div>
                <div className="flex items-center">
                  <TreePine className="h-4 w-4 mr-1" />
                  <span>{monastery.lineage}</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span>Est. {monastery.established}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                <Heart className="h-5 w-5" />
              </button>
              <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                <Share2 className="h-5 w-5" />
              </button>
            <ModalCloseButton onClick={onClose} />
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex border-b border-gray-200 bg-white">
            {[
              { id: 'overview', label: 'Overview', icon: Eye },
              { id: 'manuscripts', label: 'Manuscripts', icon: BookOpen },
              { id: 'festivals', label: 'Festivals', icon: CalendarIcon },
              { id: 'routes', label: 'Spiritual Routes', icon: Route },
              { id: 'heritage', label: 'Heritage Details', icon: Award }
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id as any)}
                className={`flex items-center space-x-2 px-6 py-4 font-medium transition-colors ${
                  activeTab === id
                    ? 'text-orange-600 border-b-2 border-orange-600 bg-orange-50'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{label}</span>
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            {activeTab === 'overview' && (
              <div className="p-6 space-y-6">
                {/* Hero Image */}
                <div className="relative h-64 rounded-xl overflow-hidden">
                  <img
                    src={monastery.images[0] || '/api/placeholder/800/400'}
                    alt={monastery.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="text-xl font-semibold">{monastery.name}</h3>
                    <p className="text-sm opacity-90">{monastery.location}</p>
                  </div>
                </div>

                {/* Quick Info Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-blue-50 p-4 rounded-xl">
                    <div className="flex items-center space-x-3">
                      <Clock className="h-6 w-6 text-blue-600" />
                      <div>
                        <p className="font-medium text-gray-900">Visiting Hours</p>
                        <p className="text-sm text-gray-600">{monastery.timings.opening} - {monastery.timings.closing}</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-green-50 p-4 rounded-xl">
                    <div className="flex items-center space-x-3">
                      <Users className="h-6 w-6 text-green-600" />
                      <div>
                        <p className="font-medium text-gray-900">Monk Count</p>
                        <p className="text-sm text-gray-600">{monastery.monkCount} monks</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-xl">
                    <div className="flex items-center space-x-3">
                      <Award className="h-6 w-6 text-purple-600" />
                      <div>
                        <p className="font-medium text-gray-900">Heritage Status</p>
                        <p className="text-sm text-gray-600">{monastery.heritageStatus}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* History & Significance */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-gray-50 p-6 rounded-xl">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                      <Book className="h-5 w-5 mr-2 text-orange-600" />
                      History
                    </h3>
                    <p className="text-gray-700 leading-relaxed">{monastery.history}</p>
                  </div>
                  <div className="bg-gray-50 p-6 rounded-xl">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                      <Star className="h-5 w-5 mr-2 text-orange-600" />
                      Cultural Significance
                    </h3>
                    <p className="text-gray-700 leading-relaxed">{monastery.culturalSignificance}</p>
                  </div>
                </div>

                {/* Entry Fees */}
                <div className="bg-orange-50 p-6 rounded-xl">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Entry Fees</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <p className="text-sm text-gray-600">Adults</p>
                      <p className="text-lg font-semibold text-gray-900">₹{monastery.entryFees.adults}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-600">Children</p>
                      <p className="text-lg font-semibold text-gray-900">₹{monastery.entryFees.children}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-600">Students</p>
                      <p className="text-lg font-semibold text-gray-900">₹{monastery.entryFees.students}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-600">Foreigners</p>
                      <p className="text-lg font-semibold text-gray-900">₹{monastery.entryFees.foreigners}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'manuscripts' && (
              <div className="p-6">
                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Ancient Manuscripts</h3>
                  <p className="text-gray-600">Explore the sacred texts and scriptures preserved in this monastery</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {monastery.manuscripts.map((manuscript) => (
                    <div key={manuscript.id} className="bg-gradient-to-br from-amber-50 to-orange-50 p-6 rounded-xl border border-amber-200">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h4 className="text-lg font-semibold text-gray-900 mb-2">{manuscript.title}</h4>
                          <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">{manuscript.language}</span>
                            <span className="bg-green-100 text-green-800 px-2 py-1 rounded">{manuscript.period}</span>
                            <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded">{manuscript.category}</span>
                          </div>
                          <p className="text-gray-700 mb-4">{manuscript.description}</p>
                        </div>
                      </div>

                      <div className="bg-white/70 p-4 rounded-lg mb-4">
                        <h5 className="font-medium text-gray-900 mb-2">Excerpt</h5>
                        <p className="text-sm text-gray-700 italic">"{manuscript.excerpt}"</p>
                      </div>

                      <div className="bg-white/70 p-4 rounded-lg mb-4">
                        <h5 className="font-medium text-gray-900 mb-2">Significance</h5>
                        <p className="text-sm text-gray-700">{manuscript.significance}</p>
                      </div>

                      <div className="flex space-x-2">
                        <button
                          onClick={() => openManuscriptReader(manuscript)}
                          className="flex-1 bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors flex items-center justify-center space-x-2"
                        >
                          <BookOpen className="h-4 w-4" />
                          <span>Read Details</span>
                        </button>
                        {manuscript.digitizedUrl && (
                          <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center space-x-2">
                            <Download className="h-4 w-4" />
                            <span>Download</span>
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'festivals' && (
              <div className="p-6">
                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Festivals & Events</h3>
                  <p className="text-gray-600">Experience the rich cultural celebrations and religious ceremonies</p>
                </div>

                <div className="space-y-6">
                  {monastery.festivals.map((festival) => (
                    <div key={festival.id} className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-xl border border-purple-200">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h4 className="text-xl font-semibold text-gray-900 mb-2">{festival.name}</h4>
                          <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 mr-1" />
                              <span>{festival.date}</span>
                            </div>
                            <div className="flex items-center">
                              <Clock className="h-4 w-4 mr-1" />
                              <span>{festival.duration}</span>
                            </div>
                          </div>
                          <p className="text-gray-700 mb-4">{festival.description}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h5 className="font-medium text-gray-900 mb-2">Significance</h5>
                          <p className="text-sm text-gray-700">{festival.significance}</p>
                        </div>
                        <div>
                          <h5 className="font-medium text-gray-900 mb-2">Activities</h5>
                          <ul className="text-sm text-gray-700 space-y-1">
                            {festival.activities.map((activity, index) => (
                              <li key={index} className="flex items-center">
                                <ArrowRight className="h-3 w-3 mr-2 text-orange-500" />
                                {activity}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {festival.specialRituals.length > 0 && (
                        <div className="mt-4">
                          <h5 className="font-medium text-gray-900 mb-2">Special Rituals</h5>
                          <div className="flex flex-wrap gap-2">
                            {festival.specialRituals.map((ritual, index) => (
                              <span key={index} className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm">
                                {ritual}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'routes' && (
              <div className="p-6">
                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Spiritual Routes & Pilgrimage Circuits</h3>
                  <p className="text-gray-600">Discover monastery trails and pilgrimage routes</p>
                </div>

                <div className="space-y-6">
                  {monastery.spiritualRoutes.map((routeId) => {
                    // This would typically fetch route details from the service
                    const route = {
                      id: routeId,
                      name: `${monastery.name} Pilgrimage Route`,
                      description: `A spiritual journey through ${monastery.name} and nearby monasteries`,
                      duration: '2-3 days',
                      difficulty: 'moderate' as const,
                      highlights: [
                        `${monastery.name} - ${monastery.culturalSignificance.substring(0, 100)}...`,
                        'Traditional prayer ceremonies',
                        'Beautiful mountain views',
                        'Cultural immersion experience'
                      ],
                      bestTime: 'March to May, September to November',
                      distance: '50 km'
                    };

                    return (
                      <div key={route.id} className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-xl border border-green-200">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <h4 className="text-xl font-semibold text-gray-900 mb-2">{route.name}</h4>
                            <p className="text-gray-700 mb-4">{route.description}</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                              route.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
                              route.difficulty === 'moderate' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {route.difficulty}
                            </span>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                          <div className="flex items-center text-sm text-gray-600">
                            <Clock className="h-4 w-4 mr-2" />
                            <span>{route.duration}</span>
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <Route className="h-4 w-4 mr-2" />
                            <span>{route.distance}</span>
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <Calendar className="h-4 w-4 mr-2" />
                            <span>{route.bestTime}</span>
                          </div>
                        </div>

                        <div>
                          <h5 className="font-medium text-gray-900 mb-2">Highlights</h5>
                          <ul className="text-sm text-gray-700 space-y-1">
                            {route.highlights.map((highlight, index) => (
                              <li key={index} className="flex items-start">
                                <ArrowRight className="h-3 w-3 mr-2 text-orange-500 mt-1 flex-shrink-0" />
                                {highlight}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="mt-4 flex space-x-2">
                          <button className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors flex items-center space-x-2">
                            <Route className="h-4 w-4" />
                            <span>Plan Route</span>
                          </button>
                          <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center space-x-2">
                            <Share2 className="h-4 w-4" />
                            <span>Share Route</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {activeTab === 'heritage' && (
              <div className="p-6 space-y-6">
                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Heritage & Conservation Details</h3>
                  <p className="text-gray-600">Learn about the monastery's heritage status and conservation efforts</p>
                </div>

                {/* Heritage Status */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Heritage Status</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <div className="flex items-center space-x-3 mb-3">
                        <Award className="h-5 w-5 text-blue-600" />
                        <span className="font-medium text-gray-900">Heritage Level</span>
                      </div>
                      <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium border ${getHeritageStatusColor(monastery.heritageStatus)}`}>
                        {monastery.heritageStatus}
                      </span>
                    </div>
                    <div>
                      <div className="flex items-center space-x-3 mb-3">
                        <Shield className="h-5 w-5 text-green-600" />
                        <span className="font-medium text-gray-900">Conservation Status</span>
                      </div>
                      <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getConservationStatusColor(monastery.conservationStatus)}`}>
                        {monastery.conservationStatus}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Architectural Details */}
                <div className="bg-gradient-to-r from-amber-50 to-yellow-50 p-6 rounded-xl border border-amber-200">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Architectural Details</h4>
                  <p className="text-gray-700 leading-relaxed">{monastery.architecturalDetails}</p>
                </div>

                {/* Conservation Efforts */}
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-xl border border-green-200">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Conservation Efforts</h4>
                  <ul className="space-y-2">
                    {monastery.conservationEfforts.map((effort, index) => (
                      <li key={index} className="flex items-start">
                        <ArrowRight className="h-4 w-4 mr-2 text-green-600 mt-1 flex-shrink-0" />
                        <span className="text-gray-700">{effort}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Visiting Guidelines */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 p-6 rounded-xl">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Visiting Guidelines</h4>
                    <ul className="space-y-2">
                      {monastery.visitingGuidelines.map((guideline, index) => (
                        <li key={index} className="flex items-start">
                          <ArrowRight className="h-4 w-4 mr-2 text-orange-500 mt-1 flex-shrink-0" />
                          <span className="text-gray-700">{guideline}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-gray-50 p-6 rounded-xl">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Photography Rules</h4>
                    <ul className="space-y-2">
                      {monastery.photographyRules.map((rule, index) => (
                        <li key={index} className="flex items-start">
                          <Camera className="h-4 w-4 mr-2 text-blue-500 mt-1 flex-shrink-0" />
                          <span className="text-gray-700">{rule}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Manuscript Reader Modal */}
      <AnimatePresence>
        {showManuscriptReader && selectedManuscript && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[400] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-gradient-to-br from-amber-50 to-orange-100 rounded-2xl w-full max-w-4xl h-[90vh] overflow-hidden border-2 border-amber-300"
            >
              <div className="p-6 border-b border-amber-200 bg-gradient-to-r from-amber-100 to-orange-100">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">{selectedManuscript.title}</h3>
                    <p className="text-gray-600">{selectedManuscript.language} • {selectedManuscript.period}</p>
                  </div>
                  <ModalCloseButton onClick={() => setShowManuscriptReader(false)} />
                </div>
              </div>

              <div className="p-6 overflow-y-auto h-full">
                <div className="bg-white/80 p-6 rounded-xl mb-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">Description</h4>
                  <p className="text-gray-700 leading-relaxed">{selectedManuscript.description}</p>
                </div>

                <div className="bg-white/80 p-6 rounded-xl mb-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">Excerpt</h4>
                  <div className="bg-amber-50 p-4 rounded-lg border-l-4 border-amber-400">
                    <p className="text-gray-800 italic text-lg leading-relaxed">"{selectedManuscript.excerpt}"</p>
                  </div>
                </div>

                <div className="bg-white/80 p-6 rounded-xl">
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">Significance</h4>
                  <p className="text-gray-700 leading-relaxed">{selectedManuscript.significance}</p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default MonasteryDetailsModal;