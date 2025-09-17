import React from 'react';
import { Facebook, Twitter, Instagram, Youtube, Globe, MapPin, Mail, Phone } from 'lucide-react';
import { motion } from 'framer-motion';

const Footer = () => {
  return (
    <footer className="bg-gray-900 dark:bg-black border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Brand Section */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">M</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Monastery360</h3>
                  <p className="text-xs text-gray-400">Digital Heritage Platform</p>
                </div>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed mb-6">
                Preserving Sikkim's sacred monastery heritage through cutting-edge digital technology 
                and immersive virtual experiences.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Facebook className="h-5 w-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Twitter className="h-5 w-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Instagram className="h-5 w-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Youtube className="h-5 w-5" />
                </a>
              </div>
            </motion.div>
          </div>

          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h4 className="text-white font-semibold mb-6">Contact Information</h4>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <MapPin className="h-5 w-5 text-orange-500" />
                <div>
                  <p className="text-white font-medium">Location</p>
                  <p className="text-gray-400 text-sm">Gangtok, Sikkim, India</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-orange-500" />
                <div>
                  <p className="text-white font-medium">Email</p>
                  <p className="text-gray-400 text-sm">heritage@monastery360.org</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-orange-500" />
                <div>
                  <p className="text-white font-medium">Phone</p>
                  <p className="text-gray-400 text-sm">+91 3592 XXX XXX</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom Section */}
        <motion.div
          className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="flex items-center space-x-4 mb-4 md:mb-0">
            <Globe className="h-4 w-4 text-gray-400" />
            <span className="text-gray-400 text-sm">
              © 2024 Monastery360. Preserving heritage for future generations.
            </span>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;