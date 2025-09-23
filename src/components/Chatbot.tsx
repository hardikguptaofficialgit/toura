import React, { useState, useRef, useEffect } from "react";
import {X, Send, Rocket, Book, Sun, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const App = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Namaste! I’m Toura, your friendly Sikkim travel companion. 🌄 From sacred monasteries to breathtaking landscapes, I’ll guide you through everything you need to explore Sikkim’s rich heritage and beauty. How can I assist you today?",
      isBot: true,
    },
  ]);
  const [inputText, setInputText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (presetText?: string) => {
    const textToSend = presetText || inputText;
    if (!textToSend.trim()) return;

    const newMessage = { id: Date.now(), text: textToSend, isBot: false };
    setMessages((prev) => [...prev, newMessage]);
    setInputText("");

    try {
      const response = await fetch("http://localhost:5000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: textToSend }),
      });

      const data = await response.json();

      const botMessage = {
        id: Date.now() + 1,
        text: data.reply || "Sorry, I couldn't process that.",
        isBot: true,
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      const botMessage = {
        id: Date.now() + 1,
        text: "⚠️ Unable to reach Monk AI server. Is the backend running?",
        isBot: true,
      };
      setMessages((prev) => [...prev, botMessage]);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  const suggestions = [
    { text: "What is the oldest monastery in Sikkim?", icon: <Book className="h-4 w-4" /> },
    { text: "Tell me about Rumtek Monastery", icon: <Rocket className="h-4 w-4" /> },
    { text: "How can I plan a spiritual tour?", icon: <Sun className="h-4 w-4" /> },
    { text: "What kind of ancient artifacts can I see?", icon: <Sparkles className="h-4 w-4" /> },
  ];

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed bottom-24 right-6 z-50 w-[380px] max-w-[90vw] h-[520px] rounded-3xl backdrop-blur-xl bg-white/80 border border-orange-200 shadow-2xl flex flex-col overflow-hidden"
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: "spring", stiffness: 120, damping: 18 }}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-orange-100/70 via-white/70 to-orange-50/70 p-4 border-b border-orange-200 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <img
                    src="/images/monkai.jpg"
                    alt="Monk AI"
                    className="w-10 h-10 rounded-full object-cover border border-orange-300 shadow-md"
                  />
                  <div>
                    <h3 className="font-semibold text-orange-600 text-lg tracking-wide">
                      Welcome to Monk AI
                    </h3>
                    <p className="text-xs text-gray-500">Your Sikkim travel guide</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 text-gray-400 hover:text-orange-600 transition-colors duration-300 rounded-full hover:bg-orange-100/50"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-transparent">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  className={`flex ${message.isBot ? "justify-start" : "justify-end"}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div
                    className={`max-w-[75%] p-3 text-sm relative break-words shadow-md
                        ${
                          message.isBot
                            ? "bg-white/90 text-gray-800 rounded-3xl rounded-bl-sm border border-orange-200"
                            : "bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-3xl rounded-br-sm"
                        }`}
                  >
                    {message.text}
                  </div>
                </motion.div>
              ))}

              {/* Suggestions */}
              {messages.length === 1 && (
                <motion.div
                  className="space-y-3 mt-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6 }}
                >
                  <p className="text-xs text-orange-500 text-center tracking-widest font-semibold">
                    SUGGESTIONS
                  </p>
                  {suggestions.map((s, index) => (
                    <motion.button
                      key={index}
                      onClick={() => handleSendMessage(s.text)}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{
                        opacity: 1,
                        y: 0,
                        transition: { duration: 0.4, delay: 0.1 * index },
                      }}
                      className="w-full p-3 text-sm bg-white/80 rounded-xl text-left border border-orange-200 flex items-center space-x-2 text-gray-700 shadow hover:bg-orange-50/80 transition-colors"
                    >
                      {s.icon}
                      <span>{s.text}</span>
                    </motion.button>
                  ))}
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="flex-none p-4 border-t border-orange-200 bg-gradient-to-r from-white/80 via-orange-50/80 to-white/80 shadow-inner">
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask a question..."
                  className="flex-1 p-3 bg-white/80 border border-orange-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-300 transition-all shadow-sm"
                />
                <motion.button
                  onClick={() => handleSendMessage()}
                  className="p-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl shadow-md hover:from-orange-600 hover:to-orange-700 transition-colors"
                  whileTap={{ scale: 0.95 }}
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
        className="w-16 h-16 bg-white/90 rounded-full shadow-lg flex items-center justify-center border border-orange-200 fixed bottom-6 right-6 z-40 overflow-hidden hover:scale-105 transition-transform duration-300"
        animate={{ scale: isOpen ? 1 : 1 }}
        whileTap={{ scale: 0.9 }}
        transition={{ type: "spring", stiffness: 150, damping: 25 }}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={isOpen ? "x" : "chat"}
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.7 }}
            transition={{ duration: 0.25 }}
            className="w-full h-full flex items-center justify-center"
          >
            {isOpen ? (
              <X className="h-8 w-8 text-orange-600" />
            ) : (
              <img
                src="/images/monkai.jpg"
                alt="Chat with Monk AI"
                className="w-full h-full object-cover rounded-full shadow"
              />
            )}
          </motion.div>
        </AnimatePresence>
      </motion.button>
    </>
  );
};

export default App;
