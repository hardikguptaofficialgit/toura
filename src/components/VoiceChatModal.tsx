import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, Volume2, VolumeX, X } from 'lucide-react';
import { useConversation } from '@11labs/react';

interface VoiceChatModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const VoiceChatModal: React.FC<VoiceChatModalProps> = ({ isOpen, onClose }) => {
  const [hasPermission, setHasPermission] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const conversation = useConversation({
    onConnect: () => {},
    onDisconnect: () => {},
    onError: () => {},
  });

  const { status, isSpeaking } = conversation;

  useEffect(() => {
    if (!isOpen) return;
    const ensureMic = async () => {
      try {
        await navigator.mediaDevices.getUserMedia({ audio: true });
        setHasPermission(true);
      } catch {
        setHasPermission(false);
      }
    };
    ensureMic();
  }, [isOpen]);

  useEffect(() => {
    document.body.classList.toggle('vr-open', isOpen);
    return () => { document.body.classList.remove('vr-open'); };
  }, [isOpen]);

  const handleStart = async () => {
    if (!hasPermission || status === 'connected') return;
    try {
      await conversation.startSession({
        agentId: (import.meta as any).env?.VITE_ELEVENLABS_AGENT_ID,
      });
    } catch {}
  };

  const handleStop = async () => {
    try { await conversation.endSession(); } catch {}
  };

  const toggleMute = async () => {
    try {
      await conversation.setVolume({ volume: isMuted ? 1 : 0 });
      setIsMuted(!isMuted);
    } catch {}
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[20000] bg-black flex items-center justify-center"
      >
        {/* Close */}
        <button
          onClick={() => { handleStop(); onClose(); }}
          className="absolute top-5 right-5 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white"
          aria-label="Close"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Avatar + pulse */}
        <motion.div
          className="relative flex items-center justify-center"
          animate={{ scale: isSpeaking ? 1.05 : 1 }}
          transition={{ duration: 0.4 }}
        >
          <div className="absolute inset-0 -z-10">
            <motion.div
              className="w-64 h-64 rounded-full bg-orange-500/20 blur-3xl"
              animate={{ opacity: isSpeaking ? [0.3, 0.6, 0.3] : 0.25 }}
              transition={{ duration: 1.6, repeat: Infinity }}
            />
          </div>
          <img
            src="/images/monkai.png"
            alt="Monk AI"
            className="w-44 h-44 rounded-full ring-4 ring-orange-500 object-cover shadow-2xl"
          />
        </motion.div>

        {/* Controls */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-4">
          {status === 'connected' ? (
            <button
              onClick={handleStop}
              className="w-14 h-14 rounded-full bg-red-600 text-white flex items-center justify-center shadow-lg hover:bg-red-500"
              aria-label="Stop"
            >
              <MicOff className="w-6 h-6" />
            </button>
          ) : (
            <button
              onClick={handleStart}
              disabled={!hasPermission}
              className="w-14 h-14 rounded-full bg-orange-600 text-white flex items-center justify-center shadow-lg disabled:opacity-50 hover:bg-orange-500"
              aria-label="Start"
            >
              <Mic className="w-6 h-6" />
            </button>
          )}

          <button
            onClick={toggleMute}
            disabled={status !== 'connected'}
            className="w-14 h-14 rounded-full bg-white/10 text-white flex items-center justify-center shadow-lg hover:bg-white/20 disabled:opacity-50"
            aria-label="Mute"
          >
            {isMuted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default VoiceChatModal;


