import React, { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
// Updated icons for clarity: Mic, MicOff (End Call), Volume2, VolumeX, X (Close), Loader2 (Connecting)
import { Mic, MicOff, Volume2, VolumeX, X, Loader2 } from 'lucide-react'; 
import { useConversation } from '@11labs/react';

interface VoiceChatModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const VoiceChatModal: React.FC<VoiceChatModalProps> = ({ isOpen, onClose }) => {
  // State for UI/local control
  const [hasMicPermission, setHasMicPermission] = useState(false);
  const [isMuted, setIsMuted] = useState(false); 
  const [error, setError] = useState<string | null>(null);
  const [transcript, setTranscript] = useState<string>(''); // Shows what the AI hears

  // 1. Initialize the Conversation Hook (Controlling volume via hook properties)
  const conversation = useConversation({
    // Pass local state to control the AI's output volume reliably
    volume: isMuted ? 0 : 1, 

    onConnect: () => {
      console.log('ElevenLabs Conversation Connected.');
      setError(null);
      setTranscript('AI is connected. Say something to start.');
    },
    onDisconnect: () => {
      console.log('ElevenLabs Conversation Disconnected.');
      setTranscript('Disconnected.');
    },
    // Use onMessage to display real-time user transcription (for debugging/UX)
    onMessage: (message) => {
        // 'text' type messages are the final or tentative transcriptions from the user
        if (message.type === 'text') {
            setTranscript(message.formatted.transcript);
        }
    },
    onError: (err) => {
      console.error('ElevenLabs Conversation Error:', err);
      // Provides a user-facing error message
      setError(`Connection Error: ${err.message || 'Check console for details.'}`); 
    },
  });

  // Destructure state and methods from the conversation object
  const { status, isSpeaking, isUserSpeaking, startSession, endSession } = conversation;
  
  // 2. Microphone Permission Check and Setup
  useEffect(() => {
    if (!isOpen) {
        setTranscript('');
        return;
    }

    const checkMicPermission = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        // Stop the track immediately after checking to free up the resource
        stream.getTracks().forEach(track => track.stop());
        setHasMicPermission(true);
        setError(null);
      } catch (err) {
        console.error("Microphone permission denied:", err);
        setHasMicPermission(false);
        setError('Microphone permission is required to chat. Check your browser settings.');
      }
    };

    checkMicPermission();
    document.body.classList.add('vr-open');
    return () => { document.body.classList.remove('vr-open'); };
  }, [isOpen]);

  // 3. Conversation Control Handlers
  const handleStart = async () => {
    // Prevent starting if already connecting, connected, or missing permission/agent ID
    if (!hasMicPermission || status === 'connected' || status === 'connecting' || error) return;
    
    setError(null);
    setTranscript('Connecting...');

    try {
      // NOTE: Ensure VITE_ELEVENLABS_AGENT_ID is available in your .env file
      const agentId = (import.meta as any).env?.VITE_ELEVENLABS_AGENT_ID;
      if (!agentId) {
        setError('Agent ID not configured. Check environment variables.');
        return;
      }
      
      await startSession({
        agentId: agentId,
        connectionType: 'webrtc', // WebRTC is required for low-latency voice
      });
      // The onConnect handler will update the transcript when successful

    } catch (e) {
      console.error("Failed to start session:", e);
      setError('Failed to start session. See console for details.');
      setTranscript('Failed to connect.');
    }
  };

  const handleStop = async () => {
    if (status === 'connected' || status === 'connecting') {
      try { await endSession(); } catch (e) {
        console.error("Failed to end session:", e);
      }
    }
    setIsMuted(false); // Reset mute state when ending session
    setTranscript('Disconnected.');
  };
  
  const handleClose = () => {
    handleStop();
    onClose();
  }

  // Toggle mute state. The actual volume change is handled via the 'volume' prop in useConversation.
  const toggleMute = () => {
    setIsMuted(prev => !prev);
  };
  
  // 4. Status and UI Logic
  const isConnecting = status === 'connecting';
  const isConnected = status === 'connected';
  const showPulse = isSpeaking || isUserSpeaking;

  // Primary status message for the user
  const statusMessage = useMemo(() => {
    if (error) return 'ERROR: ' + error;
    if (!hasMicPermission) return 'Microphone permission denied.';
    if (isConnecting) return 'Connecting... Please wait.';
    if (isConnected) {
      if (isSpeaking) return 'AI is Speaking...';
      if (isUserSpeaking) return 'You are Speaking (Listening)...';
      return 'Connected & Listening. Start talking now.';
    }
    return 'Tap the Microphone to Start Conversation';
  }, [status, isSpeaking, isUserSpeaking, hasMicPermission, error, isConnecting, isConnected]);

  if (!isOpen) return null;

  // 5. Render UI
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[20000] bg-black/95 backdrop-blur-sm flex flex-col items-center justify-center p-4 text-white"
      >
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-5 right-5 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
          aria-label="Close"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Status Message */}
        <p className={`text-lg font-semibold mb-6 text-center px-4 ${error ? 'text-red-400' : 'text-gray-300'}`}>
            {statusMessage}
        </p>
        
        {/* Real-time Transcription Display */}
        <div className="h-10 w-full max-w-lg text-center mb-8 overflow-hidden">
            <motion.p
                key={transcript} 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`text-xl font-medium ${isUserSpeaking ? 'text-green-400' : 'text-orange-300'}`}
            >
                {transcript || (isConnected && !isConnecting ? '...' : '')}
            </motion.p>
        </div>


        {/* Avatar + Pulse/Speaking Visualizer */}
        <motion.div
          className="relative flex items-center justify-center mb-10"
          animate={{ scale: showPulse ? 1.05 : 1 }} 
          transition={{ duration: 0.4 }}
        >
          {/* Outer Pulse/Blur Effect (AI is Active/Speaking) */}
          <div className="absolute inset-0 -z-10">
            <motion.div
              className="w-64 h-64 rounded-full bg-orange-500/20 blur-3xl"
              animate={{ opacity: isSpeaking ? [0.3, 0.6, 0.3] : 0.15 }} 
              transition={{ duration: isSpeaking ? 1.6 : 0.8, repeat: Infinity }}
            />
          </div>
          {/* Inner Ring for User Speaking (Input Visualizer) */}
          {isUserSpeaking && (
             <motion.div
                initial={{ scale: 0.95, opacity: 0.5 }}
                animate={{ scale: 1.1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0.5 }}
                transition={{ repeat: Infinity, repeatType: 'reverse', duration: 0.6 }}
                className="absolute w-48 h-48 rounded-full ring-8 ring-green-500/50"
             />
          )}

          {/* Avatar Image */}
          <img
            src="/images/monkai.png" 
            alt="Monk AI"
            className="w-44 h-44 rounded-full ring-4 ring-orange-500 object-cover shadow-2xl"
          />
        </motion.div>

        {/* Controls */}
        <div className="flex items-center gap-6">
          {/* Primary Action Button (Start/Stop) */}
          {isConnected ? (
            // Stop/End Call Button (Red)
            <button
              onClick={handleStop}
              className="w-16 h-16 rounded-full bg-red-600 text-white flex items-center justify-center shadow-xl hover:bg-red-500 transition-colors transform hover:scale-105"
              aria-label="Stop Conversation"
            >
              <MicOff className="w-7 h-7" /> {/* MicOff for end/stop */}
            </button>
          ) : (
            // Start Conversation Button (Orange)
            <button
              onClick={handleStart}
              disabled={!hasMicPermission || isConnecting || !!error}
              className="w-16 h-16 rounded-full bg-orange-600 text-white flex items-center justify-center shadow-xl disabled:opacity-50 transition-all transform hover:scale-105"
              aria-label="Start Conversation"
            >
              {isConnecting ? (
                <Loader2 className="w-7 h-7 animate-spin" /> // Loading indicator
              ) : (
                <Mic className="w-7 h-7" /> // Mic for start
              )}
            </button>
          )}

          {/* Mute/Volume Toggle Button (AI Output) */}
          <button
            onClick={toggleMute}
            disabled={!isConnected}
            className="w-14 h-14 rounded-full bg-white/10 text-white flex items-center justify-center shadow-lg hover:bg-white/20 disabled:opacity-50 transition-colors"
            aria-label="Mute AI Voice"
          >
            {isMuted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default VoiceChatModal;