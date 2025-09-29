import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mic, 
  MicOff, 
  X, 
  Loader2
} from 'lucide-react';
// Theme removed; default to light mode
import { ElevenLabsService } from '../services/elevenLabsService';
import { defaultVoiceAssistantConfig } from '../config/voiceAssistant';

interface VoiceAssistantProps {
  isOpen: boolean;
  onClose: () => void;
  onSearchQuery?: (query: string) => void;
}

interface ConversationMessage {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  isProcessing?: boolean;
}

interface VoiceState {
  isListening: boolean;
  isSpeaking: boolean;
  isProcessing: boolean;
  hasPermission: boolean;
  isConnected: boolean;
  elevenLabsReady: boolean;
}

const VoiceAssistant: React.FC<VoiceAssistantProps> = ({ 
  isOpen, 
  onClose, 
  onSearchQuery 
}) => {
  const isDarkMode = false;
  
  // Core state
  const [voiceState, setVoiceState] = useState<VoiceState>({
    isListening: false,
    isSpeaking: false,
    isProcessing: false,
    hasPermission: false,
    isConnected: true,
    elevenLabsReady: false
  });
  
  const [conversation, setConversation] = useState<ConversationMessage[]>([
    {
      id: '1',
      text: "Namaste! I'm MonkAI, your intelligent Sikkim travel guide. I'm always listening and ready to help you explore this beautiful state. What would you like to know?",
      isUser: false,
      timestamp: new Date()
    }
  ]);
  
  const [currentTranscript, setCurrentTranscript] = useState('');
  
  // Refs
  const recognitionRef = useRef<any>(null);
  const synthesisRef = useRef<SpeechSynthesisUtterance | null>(null);
  const conversationEndRef = useRef<HTMLDivElement>(null);
  const elevenLabsRef = useRef<ElevenLabsService | null>(null);
  
  // Initialize speech recognition and ElevenLabs
  useEffect(() => {
    if (!isOpen) return;
    
    // Initialize ElevenLabs service
    const initElevenLabs = async () => {
      try {
        const config = {
          apiKey: defaultVoiceAssistantConfig.elevenLabs.apiKey,
          voiceId: defaultVoiceAssistantConfig.elevenLabs.voiceId,
          modelId: defaultVoiceAssistantConfig.elevenLabs.modelId,
          agentId: defaultVoiceAssistantConfig.elevenLabs.agentId,
          voiceSettings: defaultVoiceAssistantConfig.elevenLabs.voiceSettings
        };
        
        console.log('Initializing ElevenLabs with config:', {
          apiKey: config.apiKey ? '***' + config.apiKey.slice(-4) : 'Not set',
          voiceId: config.voiceId,
          modelId: config.modelId,
          agentId: config.agentId || 'Not set'
        });
        
        elevenLabsRef.current = new ElevenLabsService(config);
        await elevenLabsRef.current.initialize();
        console.log('ElevenLabs initialized successfully');
        setVoiceState(prev => ({ ...prev, elevenLabsReady: true }));
      } catch (error) {
        console.warn('ElevenLabs initialization failed, falling back to browser TTS:', error);
      }
    };
    
    initElevenLabs();
    
    const initSpeechRecognition = () => {
      if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        recognitionRef.current = new SpeechRecognition();
        
        recognitionRef.current.continuous = true;
        recognitionRef.current.interimResults = true;
        recognitionRef.current.lang = 'en-US';
        recognitionRef.current.maxAlternatives = 1;
        
        recognitionRef.current.onstart = () => {
          setVoiceState(prev => ({ ...prev, isListening: true }));
        };
        
        recognitionRef.current.onresult = (event: any) => {
          let finalTranscript = '';
          let interimTranscript = '';
          
          for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
              finalTranscript += transcript;
            } else {
              interimTranscript += transcript;
            }
          }
          
          setCurrentTranscript(interimTranscript);
          
          if (finalTranscript) {
            handleUserInput(finalTranscript.trim());
            setCurrentTranscript('');
          }
        };
        
        recognitionRef.current.onerror = (event: any) => {
          console.error('Speech recognition error:', event.error);
          setVoiceState(prev => ({ ...prev, isListening: false }));
        };
        
        recognitionRef.current.onend = () => {
          setVoiceState(prev => ({ ...prev, isListening: false }));
          // Restart listening automatically for continuous mode
          if (voiceState.hasPermission) {
            setTimeout(() => {
              if (recognitionRef.current && !voiceState.isSpeaking) {
                recognitionRef.current.start();
              }
            }, 100);
          }
        };
        
        // Check microphone permission
        navigator.mediaDevices.getUserMedia({ audio: true })
          .then(() => {
            setVoiceState(prev => ({ ...prev, hasPermission: true }));
            // Auto-start listening when permission is granted
            setTimeout(() => {
              if (recognitionRef.current) {
                recognitionRef.current.start();
              }
            }, 500);
          })
          .catch(() => {
            setVoiceState(prev => ({ ...prev, hasPermission: false }));
          });
      } else {
        console.warn('Speech recognition not supported');
      }
    };
    
    initSpeechRecognition();
    
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (synthesisRef.current) {
        speechSynthesis.cancel();
      }
      if (elevenLabsRef.current) {
        elevenLabsRef.current.destroy();
      }
    };
  }, [isOpen]);
  
  // Auto-scroll to bottom of conversation
  useEffect(() => {
    conversationEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation]);
  
  // Handle user input (voice or text)
  const handleUserInput = useCallback(async (input: string) => {
    if (!input.trim()) return;
    
    // Add user message to conversation
    const userMessage: ConversationMessage = {
      id: Date.now().toString(),
      text: input,
      isUser: true,
      timestamp: new Date()
    };
    
    setConversation(prev => [...prev, userMessage]);
    setVoiceState(prev => ({ ...prev, isProcessing: true }));
    
    try {
      // Call the backend API
      const response = await fetch('http://localhost:5000/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: input })
      });
      
      const data = await response.json();
      const botResponse = data.reply || "I'm sorry, I couldn't process that request.";
      
      // Add bot response to conversation
      const botMessage: ConversationMessage = {
        id: (Date.now() + 1).toString(),
        text: botResponse,
        isUser: false,
        timestamp: new Date()
      };
      
      setConversation(prev => [...prev, botMessage]);
      
      // Speak the response
      await speakText(botResponse);
      
      // If this looks like a search query, trigger search
      if (onSearchQuery && (input.toLowerCase().includes('find') || 
          input.toLowerCase().includes('search') || 
          input.toLowerCase().includes('where'))) {
        onSearchQuery(input);
      }
      
    } catch (error) {
      console.error('Error calling backend:', error);
      const errorMessage: ConversationMessage = {
        id: (Date.now() + 1).toString(),
        text: "I'm having trouble connecting to my knowledge base. Please try again.",
        isUser: false,
        timestamp: new Date()
      };
      setConversation(prev => [...prev, errorMessage]);
    } finally {
      setVoiceState(prev => ({ ...prev, isProcessing: false }));
    }
  }, [onSearchQuery]);
  
  // Enhanced text-to-speech function with ElevenLabs
  const speakText = useCallback(async (text: string) => {
    // Stop any current speech
    if (elevenLabsRef.current) {
      elevenLabsRef.current.stopAudio();
    }
    speechSynthesis.cancel();
    
    
    setVoiceState(prev => ({ ...prev, isSpeaking: true }));
    
    try {
      // Try ElevenLabs first
      if (elevenLabsRef.current) {
        await elevenLabsRef.current.speakText(text, () => {
          setVoiceState(prev => ({ ...prev, isSpeaking: false }));
        });
        return;
      }
    } catch (error) {
      console.warn('ElevenLabs failed, falling back to browser TTS:', error);
    }
    
    // Fallback to browser TTS
    const utterance = new SpeechSynthesisUtterance(text);
    const volume = 0.9;
    utterance.volume = volume;
    utterance.rate = 0.9;
    utterance.pitch = 1;
    
    utterance.onstart = () => {
      setVoiceState(prev => ({ ...prev, isSpeaking: true }));
    };
    
    utterance.onend = () => {
      setVoiceState(prev => ({ ...prev, isSpeaking: false }));
    };
    
    utterance.onerror = () => {
      setVoiceState(prev => ({ ...prev, isSpeaking: false }));
    };
    
    synthesisRef.current = utterance;
    speechSynthesis.speak(utterance);
  }, []);
  
  // Toggle listening
  const toggleListening = () => {
    if (!recognitionRef.current) return;
    
    if (voiceState.isListening) {
      recognitionRef.current.stop();
    } else {
      recognitionRef.current.start();
    }
  };
  
  
  if (!isOpen) return null;
  
  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Backdrop */}
        <motion.div
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        />
        
        {/* Modal */}
        <motion.div
          className={`relative w-full h-full max-w-4xl mx-4 my-4 rounded-2xl shadow-2xl overflow-hidden ${
            isDarkMode 
              ? 'bg-gray-900' 
              : 'bg-white'
          }`}
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6">
            <div className="flex items-center gap-4">
              {/* MonkAI Logo */}
              <div className="flex items-center gap-3">
                <img 
                  src="/images/monkai.png" 
                  alt="MonkAI" 
                  className="w-12 h-12 rounded-full"
                />
                <div>
                  <h2 className={`text-2xl font-bold ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    MonkAI
                  </h2>
                  <p className={`text-sm ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    Your Sikkim Travel Guide
                  </p>
                </div>
              </div>
              
              {/* Status */}
              {voiceState.isProcessing && (
                <div className="flex items-center gap-2 text-orange-500">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-sm">Thinking...</span>
                </div>
              )}
            </div>
            
            <button
              onClick={onClose}
              className={`p-2 rounded-lg transition-colors ${
                isDarkMode 
                  ? 'hover:bg-gray-800 text-gray-300' 
                  : 'hover:bg-gray-100 text-gray-600'
              }`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          {/* Conversation Area */}
          <div className="flex-1 h-[calc(100vh-180px)] overflow-y-auto p-6">
            <div className="space-y-6">
              {conversation.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[85%] rounded-2xl px-6 py-4 ${
                    message.isUser
                      ? isDarkMode 
                        ? 'bg-orange-600 text-white' 
                        : 'bg-orange-500 text-white'
                      : isDarkMode 
                        ? 'bg-gray-800 text-gray-100' 
                        : 'bg-gray-100 text-gray-900'
                  }`}>
                    <p className="text-base leading-relaxed">{message.text}</p>
                  </div>
                </motion.div>
              ))}
              
              {/* Current transcript */}
              {currentTranscript && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-end"
                >
                  <div className={`max-w-[85%] rounded-2xl px-6 py-4 ${
                    isDarkMode ? 'bg-gray-800/50 text-gray-300' : 'bg-gray-100/50 text-gray-600'
                  }`}>
                    <p className="text-base italic">{currentTranscript}</p>
                  </div>
                </motion.div>
              )}
              
              <div ref={conversationEndRef} />
            </div>
          </div>
          
          {/* Input Area */}
          <div className="p-6">
            {/* Voice Input Mode */}
            <div className="flex items-center justify-center">
              <button
                onClick={toggleListening}
                disabled={!voiceState.hasPermission || voiceState.isProcessing}
                className={`w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300 ${
                  voiceState.isListening
                    ? 'bg-orange-500 text-white animate-pulse shadow-lg shadow-orange-500/50 scale-110'
                    : voiceState.hasPermission
                      ? 'bg-orange-500 text-white hover:bg-orange-600 shadow-lg hover:shadow-xl hover:scale-105'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {voiceState.isListening ? (
                  <MicOff className="w-8 h-8" />
                ) : (
                  <Mic className="w-8 h-8" />
                )}
              </button>
            </div>
            
            {/* Status Text */}
            <div className="text-center mt-4">
              <p className={`text-sm ${
                isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                {voiceState.isListening 
                  ? 'Listening...' 
                  : voiceState.isProcessing 
                    ? 'Processing...' 
                    : 'Click to speak'
                }
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default VoiceAssistant;