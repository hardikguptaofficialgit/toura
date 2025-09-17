import React, { useState } from 'react';
import { MessageCircle, X, Send, Bot } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, text: "Namaste! I'm your monastery heritage assistant. How can I help you explore Sikkim's sacred monasteries today?", isBot: true }
  ]);
  const [inputText, setInputText] = useState('');

  const handleSendMessage = () => {
    if (!inputText.trim()) return;

    const newMessage = { id: Date.now(), text: inputText, isBot: false };
    setMessages(prev => [...prev, newMessage]);
    const userMessage = inputText.toLowerCase();
    setInputText('');

    // Simulate bot response based on monastery-related keywords
    setTimeout(() => {
      let botResponse = '';
      
      if (userMessage.includes('rumtek') || userMessage.includes('largest')) {
        botResponse = "Rumtek Monastery is the largest monastery in Sikkim, built in 1966. It's known for its golden stupa and houses the seat of the 16th Karmapa. Would you like to take a virtual tour?";
      } else if (userMessage.includes('pemayangtse') || userMessage.includes('oldest')) {
        botResponse = "Pemayangtse Monastery, built in 1705, is one of the oldest monasteries in Sikkim. It offers stunning mountain views and features intricate wood carvings. Shall I show you the digital collection?";
      } else if (userMessage.includes('meditation') || userMessage.includes('spiritual')) {
        botResponse = "We offer various spiritual experiences including morning meditation sessions, prayer wheel ceremonies, and monastic chanting. Which spiritual practice interests you most?";
      } else if (userMessage.includes('virtual tour') || userMessage.includes('360')) {
        botResponse = "Our 360° virtual tours let you explore monastery halls, prayer rooms, and sacred artifacts in immersive detail. Which monastery would you like to visit virtually?";
      } else if (userMessage.includes('collection') || userMessage.includes('artifacts')) {
        botResponse = "Our digital collections include ancient thangkas, ritual artifacts, manuscripts, and golden stupas. Each collection has detailed historical information. What type of artifacts interest you?";
      } else if (userMessage.includes('help') || userMessage.includes('guide')) {
        botResponse = "I can help you with:\n• Virtual monastery tours\n• Sacred collections\n• Spiritual experiences\n• Historical information\n• Meditation practices\n\nWhat would you like to explore?";
      } else {
        botResponse = "That's a great question about our monastery heritage! I can help you explore virtual tours, sacred collections, spiritual experiences, or provide historical information about Sikkim's monasteries. What interests you most?";
      }

      const botMessage = { id: Date.now() + 1, text: botResponse, isBot: true };
      setMessages(prev => [...prev, botMessage]);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const quickQuestions = [
    "Tell me about Rumtek Monastery",
    "Show me virtual tours",
    "What spiritual experiences are available?",
    "View sacred collections"
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="mb-4 w-80 h-96 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-orange-500 to-red-600 p-4 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                    <Bot className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Heritage Assistant</h3>
                    <p className="text-xs opacity-90">Monastery Guide</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 hover:bg-white/20 rounded-full transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
                >
                  <div
                    className={`max-w-xs p-3 rounded-2xl text-sm ${
                      message.isBot
                        ? 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
                        : 'bg-gradient-to-r from-orange-500 to-red-600 text-white'
                    }`}
                  >
                    {message.text}
                  </div>
                </div>
              ))}
              
              {/* Quick Questions */}
              {messages.length === 1 && (
                <div className="space-y-2">
                  <p className="text-xs text-gray-500 dark:text-gray-400 text-center">Quick questions:</p>
                  {quickQuestions.map((question, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setInputText(question);
                        handleSendMessage();
                      }}
                      className="w-full p-2 text-xs bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg text-left transition-colors"
                    >
                      {question}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Input */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask about monasteries..."
                  className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                />
                <button
                  onClick={handleSendMessage}
                  className="p-2 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-lg hover:from-orange-600 hover:to-red-700 transition-colors"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {isOpen ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </motion.button>
    </div>
  );
};

export default Chatbot;