import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SendHorizontal } from 'lucide-react';
import ModalCloseButton from './ModalCloseButton';
// Theme removed; default to light mode
import { startNewChat, appendToChat } from '../services/chatbot';

interface ChatMessage {
  id: number;
  text: string;
  isBot: boolean;
}

const Chatbot: React.FC = () => {
  const isDarkMode = false;
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: 1, text: "Hi! I'm Monk AI. How can I help plan your Sikkim journey today?", isBot: true }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [showWaving, setShowWaving] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Show waving animation when page loads
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowWaving(true);
      setTimeout(() => setShowWaving(false), 2000);
    }, 3000); // Show waving after 3 seconds

    return () => clearTimeout(timer);
  }, []);

  const pushAssistant = (text: string) => {
    setMessages(prev => [...prev, { id: Date.now() + Math.random(), text, isBot: true }]);
  };

  const sendToBackend = async (text: string) => {
    setIsLoading(true);
    setError(null);
    try {
      if (!sessionId) {
        const res = await startNewChat(text);
        setSessionId(res.id);
        const lastAssistant = [...res.history].reverse().find(h => h.type === 'assistant');
        if (lastAssistant?.message) pushAssistant(lastAssistant.message);
      } else {
        const res = await appendToChat(sessionId, text);
        const lastAssistant = [...res.history].reverse().find(h => h.type === 'assistant');
        if (lastAssistant?.message) pushAssistant(lastAssistant.message);
      }
    } catch (e: any) {
      setError(e.message || 'Failed to reach assistant');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = () => {
    if (!inputText.trim() || isLoading) return;
    const text = inputText.trim();
    setInputText('');
    setMessages(prev => [...prev, { id: Date.now(), text, isBot: false }]);
    sendToBackend(text);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  // Modernized theme classes
  const panelBg = isDarkMode ? 'bg-gray-950/90' : 'bg-white/90';
  const borderColor = isDarkMode ? 'border-gray-800' : 'border-gray-200';
  const textMuted = isDarkMode ? 'text-gray-400' : 'text-gray-500';

  const quickQuestions = [
    { text: 'Best places to stay in Gangtok?' },
    { text: 'Show top monasteries to visit' },
    { text: 'Plan a 3-day itinerary' },
    { text: 'Local food to try?' }
  ];

  // Friendly nudge bubble state
  const [showNudge, setShowNudge] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => setShowNudge(false), 7000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative font-quicksand">
      {/* Friendly nudge bubble - only when closed */}
      {!isOpen && showNudge && (
        <div className={`fixed bottom-24 right-6 z-[1200] px-4 py-3 rounded-xl shadow-lg border ${isDarkMode ? 'bg-gray-900/95 border-gray-800 text-gray-100' : 'bg-white/95 border-gray-200 text-gray-800'}`}>
          <div className="text-sm font-medium">Hey! Have any questions?</div>
          <div className={`absolute -bottom-2 right-6 w-3 h-3 rotate-45 ${isDarkMode ? 'bg-gray-900/95 border-r border-b border-gray-800' : 'bg-white/95 border-r border-b border-gray-200'}`}></div>
        </div>
      )}

      {/* Floating trigger - show only when closed; pure monkai icon with waving animation */}
      {!isOpen && (
        <motion.button
          onClick={() => { setIsOpen(true); setShowNudge(false); }}
          className="fixed bottom-6 right-6 z-[1200] p-0 bg-transparent border-0 outline-none"
          aria-label="Open Monk AI Chat"
          animate={showWaving ? {
            rotate: [0, -10, 10, -10, 10, 0],
            scale: [1, 1.1, 1]
          } : {}}
          transition={{
            duration: 0.5,
            ease: "easeInOut"
          }}
        >
          <img 
            src="/images/monkai.png" 
            alt="Monk AI" 
            className="w-16 h-16 object-cover rounded-full shadow-lg hover:shadow-xl transition-shadow duration-300" 
          />
          {showWaving && (
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs px-2 py-1 rounded-full font-bold"
            >
              👋 Hey!
            </motion.div>
          )}
        </motion.button>
      )}

      {/* Right-side drawer covering half screen when open */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className={`fixed z-[1200] right-0 bottom-6 h-[60vh] md:h-[62vh] w-full md:w-1/2 lg:w-1/3 ${panelBg} backdrop-blur-3xl border-l ${borderColor} flex flex-col rounded-l-2xl md:rounded-l-3xl shadow-2xl font-quicksand overflow-hidden`}
          >
            {/* Header */}
            <div className={`flex-none p-4 md:p-6 border-b ${borderColor} bg-transparent`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-full overflow-hidden shadow-md">
                    <img src="/images/monkai.png" alt="Monk AI" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h3 className="font-bold text-orange-500 text-lg md:text-xl tracking-wide">Monk AI</h3>
                    <p className={`text-xs md:text-sm ${textMuted}`}>Your travel partner</p>
                  </div>
                </div>
                <ModalCloseButton onClick={() => setIsOpen(false)} />
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 custom-scrollbar">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
                >
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                    className={`max-w-[80%] p-3 text-sm md:text-base rounded-2xl relative break-words shadow-sm
                      ${message.isBot
                        ? `${isDarkMode ? 'bg-gray-800 text-gray-200' : 'bg-gray-100 text-gray-900'} rounded-bl-sm`
                        : 'bg-gradient-to-br from-orange-500 to-orange-400 text-white rounded-br-sm'
                      }`}
                  >
                    {message.text}
                  </motion.div>
                </div>
              ))}

              {isLoading && (
                <div className="text-xs text-center text-orange-500">Thinking…</div>
              )}

              {error && (
                <div className="text-xs text-center text-red-500">{error}</div>
              )}

              {/* Quick Questions */}
              {messages.length === 1 && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.3 }}
                  className="mt-8 space-y-3"
                >
                  <p className={`text-xs text-center tracking-widest font-bold ${isDarkMode ? 'text-orange-400' : 'text-orange-600'}`}>QUICK ACTIONS</p>
                  {quickQuestions.map((q, index) => (
                    <motion.button
                      key={q.text}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 + index * 0.1, duration: 0.2 }}
                      onClick={() => {
                        if (isLoading) return;
                        setMessages(prev => [...prev, { id: Date.now(), text: q.text, isBot: false }]);
                        sendToBackend(q.text);
                      }}
                      className={`w-full p-3 text-sm rounded-xl text-left transition-colors duration-200 border focus:outline-none focus:ring-2 focus:ring-orange-500 font-quicksand
                        ${isDarkMode ? 'bg-gray-800/60 hover:bg-gray-700/60 border-gray-700/60 text-gray-200' : 'bg-white hover:bg-gray-50 border-gray-200 text-gray-800'}`}
                    >
                      {q.text}
                    </motion.button>
                  ))}
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className={`flex-none p-4 md:p-6 border-t ${borderColor} bg-transparent`}>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="Ask Monk AI..."
                  className={`flex-1 p-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 transition-colors
                    ${isDarkMode ? 'bg-gray-800 border-gray-700 text-gray-100 placeholder-gray-500' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'}`}
                />
                <motion.button
                  onClick={handleSendMessage}
                  disabled={!inputText.trim() || isLoading}
                  className={`p-3 rounded-xl transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed
                    ${isDarkMode ? 'bg-orange-500 text-white hover:bg-orange-400' : 'bg-orange-500 text-white hover:bg-orange-400'}`}
                  whileTap={{ scale: 0.95 }}
                >
                  <SendHorizontal size={20} />
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Chatbot;