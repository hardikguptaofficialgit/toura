import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, X } from 'lucide-react'; // SOS icon & close icon

const sosData = [
  {
    id: 1,
    title: 'Emergency Numbers',
    content: 'Police: 100\nAmbulance: 102\nTourist Helpline: 1363',
  },
  {
    id: 2,
    title: 'Hospital & Health',
    content: 'MG Marg Hospital, Gangtok\nCentral Hospital, Pelling\nKeep travel insurance handy',
  },
  {
    id: 3,
    title: 'Travel Safety Tips',
    content:
      '1. Avoid travelling alone at night.\n2. Carry a local SIM for connectivity.\n3. Keep a copy of your ID and permits.',
  },
  {
    id: 4,
    title: 'Weather Alerts',
    content: 'Monsoon: June-Sept (risk of landslides)\nWinter: Dec-Feb (cold & snowfall)',
  },
];

const App = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative font-quicksand min-h-screen bg-gray-50">
      {/* Floating SOS icon trigger */}
      <motion.button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 left-6 z-[1200] p-4 bg-red-600 text-white rounded-full shadow-lg hover:shadow-xl transition-shadow duration-300 flex items-center justify-center"
        aria-label="Open SOS Chat"
      >
        <AlertCircle className="w-6 h-6" />
      </motion.button>

      {/* SOS Info Panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="fixed bottom-20 left-6 z-[1100] w-72 max-h-[60vh] overflow-y-auto bg-white rounded-lg shadow-xl p-4 border border-red-600"
          >
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-lg font-semibold text-red-600">Sikkim SOS Info</h2>
              <button onClick={() => setOpen(false)}>
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>
            <div className="space-y-3 text-sm text-gray-700">
              {sosData.map((item) => (
                <div key={item.id} className="p-2 bg-red-50 rounded">
                  <h3 className="font-semibold text-red-600">{item.title}</h3>
                  <pre className="whitespace-pre-wrap">{item.content}</pre>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default App;
