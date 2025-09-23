import React from 'react';
import { Clock, MapPin, Users, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const SpiritualExperiences = () => {
  const experiences = [
    {
      id: 1,
      name: 'Morning Meditation',
      type: 'Daily Practice',
      location: 'Rumtek Monastery',
      image: 'https://images.pexels.com/photos/3822622/pexels-photo-3822622.jpeg?auto=compress&cs=tinysrgb&w=800',
      duration: '1 hour',
      participants: 'Max 20',
      description: 'Join monks in traditional morning meditation sessions and experience inner peace through ancient Buddhist practices.',
      level: 'Beginner'
    },
    {
      id: 2,
      name: 'Thangka Painting Workshop',
      type: 'Art & Culture',
      location: 'Pemayangtse Monastery',
      image: 'https://images.pexels.com/photos/8036743/pexels-photo-8036743.jpeg?auto=compress&cs=tinysrgb&w=800',
      duration: '3 hours',
      participants: 'Max 12',
      description: 'Learn the sacred art of traditional Buddhist painting from master artisans in this immersive cultural workshop.',
      level: 'Intermediate'
    },
    {
      id: 3,
      name: 'Prayer Wheel Ceremony',
      type: 'Ritual Experience',
      location: 'Tashiding Monastery',
      image: 'https://images.pexels.com/photos/6292302/pexels-photo-6292302.jpeg?auto=compress&cs=tinysrgb&w=800',
      duration: '45 minutes',
      participants: 'Open to all',
      description: 'Participate in the traditional prayer wheel spinning ceremony and understand its spiritual significance.',
      level: 'Beginner'
    },
    {
      id: 4,
      name: 'Monastic Chanting',
      type: 'Musical Tradition',
      location: 'Enchey Monastery',
      image: 'https://images.pexels.com/photos/3571551/pexels-photo-3571551.jpeg?auto=compress&cs=tinysrgb&w=800',
      duration: '2 hours',
      participants: 'Max 15',
      description: 'Experience the profound depths of Tibetan Buddhist chanting and its meditative healing powers.',
      level: 'All Levels'
    }
  ];

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Beginner': return 'bg-green-600';
      case 'Intermediate': return 'bg-blue-600';
      case 'Advanced': return 'bg-purple-600';
      case 'All Levels': return 'bg-orange-600';
      default: return 'bg-gray-600';
    }
  };

  return (
    <section id="experiences" className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Spiritual Experiences
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Immerse yourself in authentic Buddhist practices and spiritual traditions
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {experiences.map((experience, index) => (
            <motion.div
              key={experience.id}
              className="group bg-white shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-200 overflow-hidden"
              style={{
                clipPath: 'polygon(0 0, calc(100% - 24px) 0, 100% 24px, 100% 100%, 0 100%)'
              }}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <div className="md:flex">
                <div className="md:w-1/2 relative h-64 md:h-auto overflow-hidden">
                  <img
                    src={experience.image}
                    alt={experience.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-transparent" />
                  
                  {/* Level Badge */}
                  <div className={`absolute top-4 left-4 ${getLevelColor(experience.level)} text-white text-sm px-3 py-1 font-medium rounded`}>
                    {experience.level}
                  </div>
                </div>

                <div className="md:w-1/2 p-8 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm text-blue-600 font-medium bg-blue-50 px-3 py-1 rounded">
                        {experience.type}
                      </span>
                    </div>

                    <h3 className="text-2xl font-bold text-gray-900 mb-3">{experience.name}</h3>
                    
                    <div className="flex items-center text-gray-500 mb-2">
                      <MapPin className="h-4 w-4 mr-2" />
                      <span className="text-sm">{experience.location}</span>
                    </div>

                    <p className="text-gray-600 mb-6 leading-relaxed">
                      {experience.description}
                    </p>

                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="flex items-center text-gray-500">
                        <Clock className="h-4 w-4 mr-2" />
                        <span className="text-sm">{experience.duration}</span>
                      </div>
                      <div className="flex items-center text-gray-500">
                        <Users className="h-4 w-4 mr-2" />
                        <span className="text-sm">{experience.participants}</span>
                      </div>
                    </div>
                  </div>

                  <button className="inline-flex items-center text-blue-600 font-semibold hover:text-blue-700 transition-colors group">
                    <span>Join Experience</span>
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-12">
          <button className="inline-flex items-center px-8 py-3 bg-white border-2 border-gray-300 text-gray-900 font-semibold rounded-lg hover:border-blue-500 hover:text-blue-600 transition-all duration-300">
            <span>View All Experiences</span>
            <ArrowRight className="ml-2 h-5 w-5" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default SpiritualExperiences;