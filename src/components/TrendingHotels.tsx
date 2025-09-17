import React from 'react';
import { Eye, ArrowRight, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';

const TrendingCollections = () => {
  const collections = [
    {
      id: 1,
      name: 'Ancient Thangkas',
      period: '16th-18th Century',
      image: 'https://images.pexels.com/photos/8036743/pexels-photo-8036743.jpeg?auto=compress&cs=tinysrgb&w=800',
      items: 47,
      monastery: 'Rumtek Monastery',
      description: 'Sacred Buddhist paintings on silk and cotton depicting deities and spiritual narratives.',
      rarity: 'Rare'
    },
    {
      id: 2,
      name: 'Ritual Artifacts',
      period: '17th-19th Century',
      image: 'https://images.pexels.com/photos/6292302/pexels-photo-6292302.jpeg?auto=compress&cs=tinysrgb&w=800',
      items: 23,
      monastery: 'Pemayangtse Monastery',
      description: 'Sacred vessels, bells, and ceremonial items used in traditional Buddhist rituals.',
      rarity: 'Very Rare'
    },
    {
      id: 3,
      name: 'Manuscript Collection',
      period: '15th-17th Century',
      image: 'https://images.pexels.com/photos/4207892/pexels-photo-4207892.jpeg?auto=compress&cs=tinysrgb&w=800',
      items: 156,
      monastery: 'Tashiding Monastery',
      description: 'Buddhist texts and scriptures preserved on palm leaves and traditional paper.',
      rarity: 'Common'
    },
    {
      id: 4,
      name: 'Golden Stupas',
      period: '18th-20th Century',
      image: 'https://images.pexels.com/photos/3571551/pexels-photo-3571551.jpeg?auto=compress&cs=tinysrgb&w=800',
      items: 12,
      monastery: 'Enchey Monastery',
      description: 'Miniature golden stupas adorned with precious stones and intricate craftsmanship.',
      rarity: 'Legendary'
    }
  ];

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'Common': return 'bg-green-600';
      case 'Rare': return 'bg-blue-600';
      case 'Very Rare': return 'bg-purple-600';
      case 'Legendary': return 'bg-orange-600';
      default: return 'bg-gray-600';
    }
  };

  return (
    <section id="collections" className="py-24 bg-white dark:bg-black">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Sacred Collections
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Explore precious artifacts and treasures preserved through digital heritage
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {collections.map((collection, index) => (
            <motion.div
              key={collection.id}
              className="group bg-white dark:bg-gray-900 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-200 dark:border-gray-800 overflow-hidden"
              style={{
                clipPath: 'polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 0 100%)'
              }}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <div className="relative h-56 overflow-hidden">
                <img
                  src={collection.image}
                  alt={collection.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                
                <div className={`absolute top-4 left-4 ${getRarityColor(collection.rarity)} text-white text-xs px-3 py-1 font-medium rounded`}>
                  {collection.rarity}
                </div>
              </div>

              <div className="p-6">
                <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2">{collection.name}</h3>
                
                <div className="flex items-center text-gray-500 dark:text-gray-400 mb-3">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span className="text-sm">{collection.period}</span>
                </div>

                <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 leading-relaxed">
                  {collection.description}
                </p>

                <div className="flex items-center justify-between mb-4">
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    <span className="font-semibold text-gray-900 dark:text-white">{collection.items}</span> items
                  </div>
                  <div className="text-xs text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded">
                    {collection.monastery}
                  </div>
                </div>

                <button className="w-full inline-flex items-center justify-center text-blue-600 dark:text-blue-400 font-semibold hover:text-blue-700 dark:hover:text-blue-300 transition-colors group">
                  <Eye className="h-4 w-4 mr-2" />
                  <span>View Collection</span>
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-12">
          <button className="inline-flex items-center px-8 py-3 bg-gray-50 dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white font-semibold rounded-lg hover:border-blue-500 dark:hover:border-blue-400 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-300">
            <span>View All Collections</span>
            <ArrowRight className="ml-2 h-5 w-5" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default TrendingCollections;