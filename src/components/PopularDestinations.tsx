import React from 'react';
import { ArrowRight, MapPin, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';

const PopularDestinations = () => {
  const monasteries = [
    {
      id: 1,
      name: 'Rumtek Monastery',
      image: 'https://images.pexels.com/photos/2166553/pexels-photo-2166553.jpeg?auto=compress&cs=tinysrgb&w=800',
      location: 'East Sikkim',
      description: 'The largest monastery in Sikkim, known for its golden stupa and rich Tibetan architecture.',
      established: '1966',
      tradition: 'Kagyu'
    },
    {
      id: 2,
      name: 'Pemayangtse Monastery',
      image: 'https://images.pexels.com/photos/3571551/pexels-photo-3571551.jpeg?auto=compress&cs=tinysrgb&w=800',
      location: 'West Sikkim',
      description: 'One of the oldest monasteries with stunning mountain views and intricate wood carvings.',
      established: '1705',
      tradition: 'Nyingma'
    },
    {
      id: 3,
      name: 'Tashiding Monastery',
      image: 'https://images.pexels.com/photos/5580900/pexels-photo-5580900.jpeg?auto=compress&cs=tinysrgb&w=800',
      location: 'West Sikkim',
      description: 'Sacred monastery atop a conical hill between two rivers, offering spiritual serenity.',
      established: '1641',
      tradition: 'Nyingma'
    },
    {
      id: 4,
      name: 'Enchey Monastery',
      image: 'https://images.pexels.com/photos/1659438/pexels-photo-1659438.jpeg?auto=compress&cs=tinysrgb&w=800',
      location: 'East Sikkim',
      description: 'Beautiful monastery with panoramic views of Gangtok and the surrounding valleys.',
      established: '1909',
      tradition: 'Nyingma'
    },
    {
      id: 5,
      name: 'Dubdi Monastery',
      image: 'https://images.pexels.com/photos/8347501/pexels-photo-8347501.jpeg?auto=compress&cs=tinysrgb&w=800',
      location: 'West Sikkim',
      description: 'The oldest monastery in Sikkim, also known as Yuksom Monastery, steeped in history.',
      established: '1701',
      tradition: 'Nyingma'
    },
    {
      id: 6,
      name: 'Phensang Monastery',
      image: 'https://images.pexels.com/photos/962464/pexels-photo-962464.jpeg?auto=compress&cs=tinysrgb&w=800',
      location: 'North Sikkim',
      description: 'Ancient monastery nestled in the Himalayan foothills with breathtaking mountain vistas.',
      established: '1721',
      tradition: 'Gelug'
    }
  ];

  return (
    <section id="monasteries" className="py-24 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
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
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                
                {/* Tradition Badge */}
                <div className="absolute top-4 right-4 bg-black/70 backdrop-blur-sm text-white text-sm px-3 py-1 font-medium">
                  {monastery.tradition}
                </div>
                
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
                
                <button className="inline-flex items-center text-blue-600 dark:text-blue-400 font-semibold hover:text-blue-700 dark:hover:text-blue-300 transition-colors group">
                  <span>Explore Virtual Tour</span>
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-12">
          <button className="inline-flex items-center px-8 py-3 bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white font-semibold rounded-lg hover:border-blue-500 dark:hover:border-blue-400 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-300">
            <span>View All Monasteries</span>
            <ArrowRight className="ml-2 h-5 w-5" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default PopularDestinations;