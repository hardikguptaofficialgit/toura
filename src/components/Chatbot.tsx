import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, Rocket, Book, Sun, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const App = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, text: "Namaste! I'm your monastery heritage assistant. How can I help you explore Sikkim's sacred monasteries today?", isBot: true }
  ]);
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const newMessage = { id: Date.now(), text: inputText, isBot: false };
    setMessages(prev => [...prev, newMessage]);
    const userMessage = inputText;
    setInputText('');

    try {
      const response = await fetch("http://localhost:5000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: userMessage }),
      });

      const data = await response.json();

      const botMessage = {
        id: Date.now() + 1,
        text: data.reply || "Sorry, I couldn't process that.",
        isBot: true,
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      const botMessage = {
        id: Date.now() + 1,
        text: "⚠️ Unable to reach Monk AI server. Is the backend running?",
        isBot: true,
      };
      setMessages(prev => [...prev, botMessage]);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const quickQuestions = [
    { text: "What is the oldest monastery in Sikkim?", icon: <Book className="h-4 w-4" /> },
    { text: "Tell me about Rumtek Monastery", icon: <Rocket className="h-4 w-4" /> },
    { text: "How can I plan a spiritual tour?", icon: <Sun className="h-4 w-4" /> },
    { text: "What kind of ancient artifacts can I see?", icon: <Sparkles className="h-4 w-4" /> }
  ];

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-950 text-gray-100 p-4 font-sans">
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 50, scale: 0.8 }}
              transition={{ type: "spring", stiffness: 120, damping: 14 }}
              className="w-full h-full max-w-4xl max-h-[80vh] mx-auto my-auto rounded-3xl backdrop-blur-md bg-gray-900/70 border border-orange-500/30 shadow-2xl shadow-orange-500/10 flex flex-col overflow-hidden"
            >
              {/* Header */}
              <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-4 border-b border-orange-500/20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-orange-500/20 text-orange-400 flex items-center justify-center">
                      <Bot className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-orange-400 text-lg tracking-wide">Welcome to Monk AI</h3>
                      <p className="text-xs text-gray-400 opacity-90">Your Sikkim travel guide</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 text-gray-400 hover:text-orange-400 transition-colors duration-200"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>
  
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
                  >
                    <div
                      className={`max-w-[75%] p-3 text-sm relative break-words 
                        ${message.isBot 
                          ? 'bg-gray-800 text-gray-100 rounded-2xl rounded-bl-none border border-orange-500/30 shadow-md shadow-orange-500/20' 
                          : 'bg-orange-600 text-white rounded-2xl rounded-br-none shadow-md shadow-orange-500/40'
                        }`}
                    >
                      {message.text}
                    </div>
                  </motion.div>
                ))}
                
                {/* Quick Questions */}
                {messages.length === 1 && (
                  <div className="space-y-3 mt-4">
                    <p className="text-xs text-orange-400 text-center tracking-widest font-quicksand font-bold">QUICK ACTIONS</p>
                    {quickQuestions.map((question, index) => (
                      <motion.button
                        key={index}
                        onClick={() => {
                          setInputText(question.text);
                          handleSendMessage();
                        }}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0, transition: { duration: 0.3, delay: 0.1 * index } }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="w-full p-3 text-base bg-gray-800/50 hover:bg-gray-700/50 rounded-lg text-left transition-colors duration-200 border border-gray-700/50 hover:border-orange-500/40 focus:outline-none focus:ring-2 focus:ring-orange-500 font-quicksand flex items-center space-x-2"
                      >
                        {question.icon}
                        <span>{question.text}</span>
                      </motion.button>
                    ))}
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
  
              {/* Input */}
              <div className="flex-none p-4 border-t border-orange-500/20 bg-gray-900/70">
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask a question..."
                    className="flex-1 p-3 bg-gray-800 border border-gray-700 rounded-lg text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors"
                  />
                  <motion.button
                    onClick={handleSendMessage}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-3 bg-orange-600 text-white rounded-lg hover:bg-orange-500 transition-colors shadow-lg shadow-orange-500/30"
                  >
                    <Send className="h-5 w-5" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
  
        {/* Chat Button */}
        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          className={`
            w-16 h-16 bg-gradient-to-br from-orange-600 to-orange-500 text-white rounded-full shadow-2xl shadow-orange-500/40 
            flex items-center justify-center border-2 border-orange-400
            fixed bottom-4 right-6
          `}
          animate={{ scale: isOpen ? 1.1 : 1, rotate: isOpen ? 90 : 0 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          transition={{ type: "spring", stiffness: 150, damping: 25 }}
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={isOpen ? "x" : "chat"}
              initial={{ opacity: 0, rotate: -90, scale: 0.5 }}
              animate={{ opacity: 1, rotate: 0, scale: 1 }}
              exit={{ opacity: 0, rotate: 90, scale: 0.5 }}
              transition={{ duration: 0.2 }}
            >
              {isOpen ? <X className="h-8 w-8" /> : <MessageCircle className="h-8 w-8" />}
            </motion.div>
          </AnimatePresence>
        </motion.button>
      </div>
    </div>
  );
};

export default App;
