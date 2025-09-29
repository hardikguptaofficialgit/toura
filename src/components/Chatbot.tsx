import React, { useState, useRef, useEffect } from 'react';
import { SendHorizontal, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import ModalCloseButton from './ModalCloseButton';
// Theme removed; default to light mode
import { startNewChat, appendToChat } from '../services/chatbot';

const App = () => {
  const isDarkMode = false;
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, text: "Hi! I'm Monk AI. How can I help plan your Sikkim journey today? 🏞️", isBot: true }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    // This effect ensures we scroll when messages or the loading state changes
    scrollToBottom();
  }, [messages, isLoading]);

  // Unified function for handling the suggestion click and regular send
  const handleSendMessage = async (customText?: string) => {
    const messageToSend = customText || inputText;

    if (!messageToSend.trim() || isLoading) return;

    // 1. Add user message to state
    const newMessage = { id: Date.now(), text: messageToSend, isBot: false };
    setMessages(prev => [...prev, newMessage]);
    
    // 2. Clear input and start loading
    setInputText('');
    setIsLoading(true);
    setError(null);

    try {
      if (!sessionId) {
        // Start a new chat session
        const res = await startNewChat(messageToSend);
        setSessionId(res.id);
        const lastAssistant = [...res.history].reverse().find(h => h.type === 'assistant');
        // More engaging fallback reply
        const reply = lastAssistant?.message?.trim() || "That's a great first step! I've started your Sikkim plan. What's next?";
        setMessages(prev => [...prev, { id: Date.now() + 1, text: reply, isBot: true }]);
      } else {
        // Append to existing chat session
        const res = await appendToChat(sessionId, messageToSend);
        const lastAssistant = [...res.history].reverse().find(h => h.type === 'assistant');
        // More engaging fallback reply
        const reply = lastAssistant?.message?.trim() || "Understood! I'm adding that to your itinerary. Anything else I can clarify?";
        setMessages(prev => [...prev, { id: Date.now() + 1, text: reply, isBot: true }]);
      }
    } catch (error) {
      // Local fallback response
      const fallback = "Oops! 😔 I'm offline right now, but here are quick ideas: **Gangtok**: MG Marg, Tashi View Point. **Monasteries**: Rumtek, Ranka. **Lakes**: Tsomgo. Try asking me for a 3-day plan later!";
      setMessages(prev => [...prev, { id: Date.now() + 1, text: fallback, isBot: true }]);
      setError(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  // Modernized theme classes
  const panelBg = isDarkMode ? 'bg-gray-950/90' : 'bg-white/95';
  const borderColor = isDarkMode ? 'border-gray-800' : 'border-gray-200';
  const textMuted = isDarkMode ? 'text-gray-400' : 'text-gray-500';

  const quickQuestions = [
    { text: 'Best places to stay in Gangtok?' },
    { text: 'Show top monasteries to visit' },
    { text: 'Plan a 3-day itinerary' },
    { text: 'Local food to try?' }
  ];

  // Logic for Quick Action click (new and improved)
  const handleQuickQuestionClick = (text: string) => {
    if (isLoading) return;
    // We don't setInputText, we directly call handleSendMessage with the text
    // This prevents the flicker of text in the input box and directly sends it.
    handleSendMessage(text);
  };


  return (
    <div className="relative font-quicksand">
      {/* Friendly nudge bubble - always visible when closed */}
      {!isOpen && (
        <div className={`fixed bottom-24 right-6 z-[1200] px-4 py-3 rounded-xl shadow-lg border ${isDarkMode ? 'bg-gray-900/95 border-gray-800 text-gray-100' : 'bg-white/95 border-gray-200 text-gray-800'}`}>
          <div className="text-sm font-medium">Hey! Have any questions about Sikkim?</div>
          <div className={`absolute -bottom-2 right-6 w-3 h-3 rotate-45 ${isDarkMode ? 'bg-gray-900/95 border-r border-b border-gray-800' : 'bg-white/95 border-r border-b border-gray-200'}`}></div>
        </div>
      )}

      {/* Floating trigger - show only when closed */}
      {!isOpen && (
        <motion.button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-[1200] p-0 bg-transparent border-0 outline-none vr-open:hidden"
          aria-label="Open Monk AI Chat"
        >
          <img 
            src="/images/monkai.png" 
            alt="Monk AI" 
            className="w-16 h-16 object-cover rounded-full shadow-xl hover:shadow-2xl transition-shadow duration-300 ring-4 ring-orange-500/50" 
          />
        </motion.button>
      )}

      {/* Right-side drawer covering half screen when open - MORE COMPACT HEIGHT */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            // ADJUSTED HEIGHT: h-[65vh] for more compact feel
            className={`fixed z-[1200] right-6 bottom-6 h-[65vh] md:h-[70vh] w-[90vw] sm:w-[400px] ${panelBg} backdrop-blur-3xl border ${borderColor} flex flex-col rounded-xl md:rounded-2xl shadow-2xl font-quicksand overflow-hidden`}
          >
            {/* Header - SLIGHTLY MORE COMPACT PADDING */}
            <div className={`flex-none p-4 border-b ${borderColor} bg-transparent`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-9 h-9 md:w-10 md:h-10 rounded-full overflow-hidden shadow-md">
                    <img src="/images/monkai.png" alt="Monk AI" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    {/* SLIGHTLY SMALLER FONT */}
                    <h3 className="font-bold text-orange-500 text-lg tracking-wide">Monk AI</h3>
                    <p className={`text-xs ${textMuted}`}>Your Sikkim travel partner</p>
                  </div>
                </div>
                <ModalCloseButton onClick={() => setIsOpen(false)} />
              </div>
            </div>

            {/* Messages - SLIGHTLY MORE COMPACT PADDING */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
                >
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                    className={`max-w-[85%] p-3 text-sm rounded-xl relative break-words shadow-md
                      ${message.isBot
                        ? `${isDarkMode ? 'bg-gray-800 text-gray-200' : 'bg-gray-100 text-gray-900'} rounded-bl-sm`
                        : 'bg-gradient-to-br from-orange-500 to-orange-400 text-white rounded-br-sm'
                      }`}
                  >
                    {/* Use ReactMarkdown for bot replies */}
                    {message.isBot ? (
                      <ReactMarkdown 
                        components={{
                          p: ({children}) => <p className="mb-1">{children}</p>, // Ensure spacing in markdown
                          ul: ({children}) => <ul className="list-disc list-inside ml-4">{children}</ul>,
                          li: ({children}) => <li className="mb-1">{children}</li>,
                          strong: ({children}) => <strong className="font-semibold text-orange-300">{children}</strong>
                        }}
                      >{message.text}</ReactMarkdown>
                    ) : (
                      message.text
                    )}
                  </motion.div>
                </div>
              ))}

              {/* Loading Indicator */}
              {isLoading && (
                <div className="flex justify-start">
                    <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'} p-3 text-sm rounded-2xl rounded-bl-sm shadow-sm`}>
                        <Loader2 size={16} className="animate-spin text-orange-500 inline-block mr-2" />
                        <span className={`${textMuted}`}>Monk AI is thinking...</span>
                    </div>
                </div>
              )}

              {error && (
                <div className="text-xs text-center text-red-500">{error}</div>
              )}

              {/* Quick Questions - APPEAR ONLY ON INITIAL MESSAGE */}
              {messages.length === 1 && !isLoading && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.3 }}
                  className="mt-6 space-y-2 pt-4"
                >
                  <p className={`text-xs text-center tracking-widest font-bold ${isDarkMode ? 'text-orange-400' : 'text-orange-600'}`}>QUICK START</p>
                  <div className='grid grid-cols-2 gap-2'>
                    {quickQuestions.map((q, index) => (
                      <motion.button
                        key={q.text}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.6 + index * 0.1, duration: 0.2 }}
                        // UPDATED CLICK HANDLER: Calls handleQuickQuestionClick which now sends the message
                        onClick={() => handleQuickQuestionClick(q.text)}
                        className={`w-full p-2 text-xs rounded-lg text-center transition-colors duration-200 border focus:outline-none focus:ring-2 focus:ring-orange-500 font-medium
                          ${isDarkMode ? 'bg-gray-800/60 hover:bg-gray-700/60 border-gray-700 text-gray-200' : 'bg-white hover:bg-gray-50 border-gray-200 text-gray-800'}`}
                      >
                        {q.text}
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input - SLIGHTLY MORE COMPACT PADDING */}
            <div className={`flex-none p-4 border-t ${borderColor} bg-transparent`}>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder={isLoading ? "Please wait for a response..." : "Ask Monk AI about Sikkim..."}
                  disabled={isLoading}
                  className={`flex-1 p-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 transition-colors
                    ${isDarkMode ? 'bg-gray-800 border-gray-700 text-gray-100 placeholder-gray-500' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'}`}
                />
                <motion.button
                  onClick={() => handleSendMessage()}
                  disabled={!inputText.trim() || isLoading}
                  className={`p-3 rounded-xl transition-colors duration-200 
                    ${!inputText.trim() || isLoading ? 'opacity-50 cursor-not-allowed bg-orange-500' : 'bg-orange-500 text-white hover:bg-orange-400'}`}
                  whileTap={!inputText.trim() || isLoading ? {} : { scale: 0.95 }}
                >
                  {/* Show spinner when loading, otherwise show send icon */}
                  {isLoading ? <Loader2 size={20} className="animate-spin" /> : <SendHorizontal size={20} />}
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default App;