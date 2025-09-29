import { Clock, Users, Camera, Mountain, Eye, Compass, ArrowRight, Activity, Target, Zap, Waves, Wind, Star } from 'lucide-react';
import { motion } from 'framer-motion';
// Theme removed; default to light mode

const MonasteryActivities = () => {
  const isDarkMode = false;

  // Floating activity icons for background animation
  const FloatingActivityIcons = () => {
    const icons = [
      { Icon: Activity, delay: 0.8, position: { top: '12%', left: '9%' } },
      { Icon: Target, delay: 2.3, position: { top: '20%', right: '11%' } },
      { Icon: Zap, delay: 3.8, position: { top: '78%', left: '7%' } },
      { Icon: Waves, delay: 5.3, position: { top: '65%', right: '13%' } },
      { Icon: Wind, delay: 6.8, position: { top: '45%', left: '5%' } },
      { Icon: Star, delay: 8.3, position: { top: '82%', right: '9%' } },
      { Icon: Activity, delay: 9.8, position: { top: '8%', right: '7%' } },
      { Icon: Target, delay: 11.3, position: { top: '88%', left: '13%' } },
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
              opacity: [0, 0.18, 0.3, 0.18, 0],
              scale: [0, 0.9, 1.3, 0.9, 0],
              rotate: [0, 270, 540],
              y: [0, -18, 0, 18, 0],
              x: [0, -10, 0, 10, 0]
            }}
            transition={{
              duration: 22,
              delay: delay,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <Icon 
              className={`h-7 w-7 ${
                isDarkMode 
                  ? 'text-green-400/25' 
                  : 'text-green-600/30'
              }`} 
            />
          </motion.div>
        ))}
      </div>
    );
  };

  const activities = [
    {
      id: 1,
      title: '360° Virtual Tour',
      location: 'Rumtek Monastery',
      image: 'https://images.pexels.com/photos/2166553/pexels-photo-2166553.jpeg?auto=compress&cs=tinysrgb&w=800',
      duration: '30 minutes',
      participants: 'Unlimited',
      category: 'Virtual Reality',
      icon: Eye,
      description: 'Immersive 360-degree exploration of sacred halls and prayer rooms with interactive elements.'
    },
    {
      id: 2,
      title: 'Architectural Heritage Walk',
      location: 'Pemayangtse Monastery',
      image: 'https://images.pexels.com/photos/3571551/pexels-photo-3571551.jpeg?auto=compress&cs=tinysrgb&w=800',
      duration: '2 hours',
      participants: 'Max 15',
      category: 'Architecture',
      icon: Camera,
      description: 'Guided tour exploring traditional Tibetan Buddhist architecture and construction techniques.'
    },
    {
      id: 3,
      title: 'Mountain Monastery Trek',
      location: 'Tashiding Monastery',
      image: 'https://images.pexels.com/photos/5580900/pexels-photo-5580900.jpeg?auto=compress&cs=tinysrgb&w=800',
      duration: '4 hours',
      participants: 'Max 12',
      category: 'Adventure',
      icon: Mountain,
      description: 'Scenic trek to hilltop monastery with panoramic valley views and cultural insights.'
    },
    {
      id: 4,
      title: 'Cultural Documentation',
      location: 'Enchey Monastery',
      image: 'https://images.pexels.com/photos/1659438/pexels-photo-1659438.jpeg?auto=compress&cs=tinysrgb&w=800',
      duration: 'Full day',
      participants: 'Max 8',
      category: 'Research',
      icon: Compass,
      description: 'Help document and preserve monastery artifacts and traditions for future generations.'
    },
    {
      id: 5,
      title: 'Digital Archive Exploration',
      location: 'Dubdi Monastery',
      image: 'https://images.pexels.com/photos/8347501/pexels-photo-8347501.jpeg?auto=compress&cs=tinysrgb&w=800',
      duration: '1.5 hours',
      participants: 'Unlimited',
      category: 'Education',
      icon: Eye,
      description: 'Explore digitized manuscripts and historical artifacts through our online platform.'
    },
    {
      id: 6,
      title: 'Monastery Photography Tour',
      location: 'Phensang Monastery',
      image: 'https://images.pexels.com/photos/962464/pexels-photo-962464.jpeg?auto=compress&cs=tinysrgb&w=800',
      duration: '3 hours',
      participants: 'Max 10',
      category: 'Photography',
      icon: Camera,
      description: 'Capture the beauty of ancient monasteries with professional photography guidance.'
    }
  ];

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Virtual Reality': return 'bg-blue-600';
      case 'Architecture': return 'bg-purple-600';
      case 'Adventure': return 'bg-green-600';
      case 'Research': return 'bg-orange-600';
      case 'Education': return 'bg-indigo-600';
      case 'Photography': return 'bg-pink-600';
      default: return 'bg-gray-600';
    }
  };

  return (
    <section id="activities" className="relative py-24 bg-white dark:bg-black overflow-hidden">
      {/* Floating Background Animations */}
      <FloatingActivityIcons />
      
      {/* Gradient Background Overlay */}
      <motion.div
        className="absolute inset-0 opacity-18"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 0.18 }}
        transition={{ duration: 3.5 }}
        viewport={{ once: true }}
        style={{
          background: isDarkMode
            ? 'radial-gradient(circle at 40% 20%, rgba(34, 197, 94, 0.12) 0%, transparent 50%), radial-gradient(circle at 60% 80%, rgba(59, 130, 246, 0.1) 0%, transparent 50%)'
            : 'radial-gradient(circle at 40% 20%, rgba(34, 197, 94, 0.06) 0%, transparent 50%), radial-gradient(circle at 60% 80%, rgba(59, 130, 246, 0.05) 0%, transparent 50%)'
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
            Exploration Activities
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Discover monasteries through various interactive and immersive experiences
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {activities.map((activity, index) => {
            const IconComponent = activity.icon;
            return (
              <motion.div
                key={activity.id}
                className="group bg-white dark:bg-gray-900 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-200 dark:border-gray-800 overflow-hidden"
                style={{
                  clipPath: 'polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 0 100%)'
                }}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={activity.image}
                    alt={activity.title}
                    className="w-full h-full object-cover transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  
                  {/* Category Badge */}
                  <div className={`absolute top-4 right-4 ${getCategoryColor(activity.category)} text-white text-sm px-3 py-1 font-medium rounded`}>
                    {activity.category}
                  </div>

                  {/* Icon */}
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm p-3 rounded-full">
                    <IconComponent className="h-6 w-6 text-gray-800" />
                  </div>
                  
                  <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="text-xl font-bold mb-1">{activity.title}</h3>
                    <p className="text-sm opacity-90">{activity.location}</p>
                  </div>
                </div>
                
                <div className="p-6">
                  <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                    {activity.description}
                  </p>

                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="flex items-center text-gray-500 dark:text-gray-400">
                      <Clock className="h-4 w-4 mr-2" />
                      <span className="text-sm">{activity.duration}</span>
                    </div>
                    <div className="flex items-center text-gray-500 dark:text-gray-400">
                      <Users className="h-4 w-4 mr-2" />
                      <span className="text-sm">{activity.participants}</span>
                    </div>
                  </div>

                  <button className="inline-flex items-center text-blue-600 dark:text-blue-400 font-semibold hover:text-blue-700 dark:hover:text-blue-300 transition-colors group w-full justify-center">
                    <span>Start Activity</span>
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>

        <div className="text-center mt-12">
          <button className="inline-flex items-center px-8 py-3 bg-gray-50 dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white font-semibold rounded-lg hover:border-blue-500 dark:hover:border-blue-400 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-300">
            <span>View All Activities</span>
            <ArrowRight className="ml-2 h-5 w-5" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default MonasteryActivities;