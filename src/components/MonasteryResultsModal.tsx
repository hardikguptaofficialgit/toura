import React from 'react';
import { X, Mountain } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Item {
  name: string;
}

interface Props {
  open: boolean;
  onClose: () => void;
  items: Item[];
  onSelect: (name: string) => void;
}

const MonasteryResultsModal: React.FC<Props> = ({ open, onClose, items, onSelect }) => {
  if (!open) return null;
  return (
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-[110]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <div className="absolute inset-0 bg-black/50" onClick={onClose} />
          <motion.div
            className="absolute inset-4 md:inset-10 bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 160, damping: 20 }}
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">All Monasteries</h3>
              <button onClick={onClose} className="p-2 rounded-full border border-gray-200 hover:bg-gray-100"><X className="h-5 w-5"/></button>
            </div>

            <div className="flex-1 overflow-y-auto p-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {items.map((it, idx) => (
                  <button
                    key={idx}
                    onMouseDown={() => onSelect(it.name)}
                    className="w-full p-4 border border-gray-200 rounded-2xl text-left hover:bg-orange-50 flex items-center gap-3"
                  >
                    <Mountain className="h-5 w-5 text-blue-600" />
                    <div>
                      <div className="font-semibold text-gray-900">{it.name}</div>
                      <div className="text-sm text-orange-600">Monastery</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MonasteryResultsModal;


