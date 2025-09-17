import React from 'react';
import { Calendar, User, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const MonasteryStories = () => {
  const stories = [
    {
      id: 1,
      title: 'The Sacred Architecture of Rumtek Monastery',
      excerpt: 'Discover the intricate design and spiritual significance of Sikkim\'s largest monastery, featuring traditional Tibetan Buddhist architecture.',
      image: 'https://images.pexels.com/photos/2166553/pexels-photo-2166553.jpeg?auto=compress&cs=tinysrgb&w=800',
      author: 'Dr. Tenzin Norbu',
      date: 'March 15, 2024',
      readTime: '12 min read',
      category: 'Architecture & Heritage'
    },
    {
      id: 2,
      title: 'Ancient Manuscripts: Preserving Buddhist Wisdom',
      excerpt: 'Explore the digitization efforts to preserve centuries-old Buddhist texts and scriptures found in Sikkim\'s monasteries.',
      image: 'https://images.pexels.com/photos/4207892/pexels-photo-4207892.jpeg?auto=compress&cs=tinysrgb&w=800',
      author: 'Lama Pema Rinzin',
      date: 'March 10, 2024',
      readTime: '8 min read',
      category: 'Cultural Preservation'
    },
    {
      id: 3,
      title: 'The Spiritual Journey Through Meditation',
      excerpt: 'Understanding the meditation practices and spiritual traditions that have been maintained in Sikkim\'s monasteries for centuries.',
      image: 'https://images.pexels.com/photos/3822622/pexels-photo-3822622.jpeg?auto=compress&cs=tinysrgb&w=800',
      author: 'Ani Dolma',
      date: 'March 5, 2024',
      readTime: '10 min read',
      category: 'Spiritual Practice'
    }
  ];

  return (
    <section className="py-24 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Heritage Stories
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Explore the rich history and spiritual wisdom of Sikkim's monasteries through expert insights
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {stories.map((story, index) => (
            <motion.article
              key={story.id}
              className="group bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-200 dark:border-gray-700 overflow-hidden"
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
                  src={story.image}
                  alt={story.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                
                <div className="absolute top-4 left-4 bg-orange-600 text-white text-xs px-3 py-1 font-medium rounded">
                  {story.category}
                </div>
                
                <div className="absolute bottom-4 left-4 text-white">
                  <div className="flex items-center text-sm opacity-90 mb-2">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span>{story.date}</span>
                    <span className="mx-2">•</span>
                    <span>{story.readTime}</span>
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 line-clamp-2">
                  {story.title}
                </h3>
                
                <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed line-clamp-3">
                  {story.excerpt}
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-gray-500 dark:text-gray-400">
                    <User className="h-4 w-4 mr-2" />
                    <span className="text-sm">{story.author}</span>
                  </div>
                  
                  <button className="inline-flex items-center text-blue-600 dark:text-blue-400 font-semibold hover:text-blue-700 dark:hover:text-blue-300 transition-colors group">
                    <span className="text-sm">Read More</span>
                    <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </motion.article>
          ))}
        </div>

        <div className="text-center mt-12">
          <button className="inline-flex items-center px-8 py-3 bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white font-semibold rounded-lg hover:border-blue-500 dark:hover:border-blue-400 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-300">
            <span>View All Stories</span>
            <ArrowRight className="ml-2 h-5 w-5" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default MonasteryStories;