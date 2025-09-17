import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { motion } from 'framer-motion';

const ThemeToggle = () => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <motion.button
      onClick={toggleTheme}
      className="fixed bottom-6 left-6 z-50 p-3 rounded-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl hover:border-orange-500 dark:hover:border-orange-500 transition-all duration-300"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        initial={false}
        animate={{ rotate: isDarkMode ? 180 : 0 }}
        transition={{ duration: 0.3 }}
      >
        {isDarkMode ? (
          <Moon className="h-6 w-6 text-orange-500" />
        ) : (
          <Sun className="h-6 w-6 text-orange-500" />
        )}
      </motion.div>
    </motion.button>
  );
};

export default ThemeToggle;