import React, { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

interface SuggestionModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
}

const SuggestionModal: React.FC<SuggestionModalProps> = ({ isOpen, onClose, title, subtitle, children }) => {
  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[1000] flex items-center justify-center"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-black/30 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            initial={{ y: 24, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 24, opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className="relative w-full max-w-xl mx-4 rounded-2xl bg-white shadow-2xl border border-gray-200"
            role="dialog"
            aria-modal="true"
          >
            <div className="p-6">
              <div className="flex items-start justify-between gap-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
                  {subtitle && (
                    <p className="mt-1 text-sm text-gray-500">{subtitle}</p>
                  )}
                </div>
                <button
                  onClick={onClose}
                  className="shrink-0 p-2 rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition"
                  aria-label="Close"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
                    <path d="M18 6 6 18" />
                    <path d="m6 6 12 12" />
                  </svg>
                </button>
              </div>

              <div className="mt-4">
                {children}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SuggestionModal;

