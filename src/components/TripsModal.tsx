import React, { useEffect, useMemo, useState } from 'react';
import { X, Search, Trash2, Copy, Download, Plus, Edit3 } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

type Stop = { id: string; name: string; type: string; time?: string; notes?: string };
type Day = { id: string; title: string; stops: Stop[] };
type StoredTrip = { key: string; name: string; days: Day[] };

interface Props {
  open: boolean;
  onClose: () => void;
  onOpenTrip?: (tripKey: string) => void;
}

const TripsModal: React.FC<Props> = ({ open, onClose, onOpenTrip }) => {
  const [query, setQuery] = useState('');
  const [trips, setTrips] = useState<StoredTrip[]>([]);
  const [editingKey, setEditingKey] = useState('');
  const [editingTitle, setEditingTitle] = useState('');
  const [editingDays, setEditingDays] = useState<Day[]>([]);
  const [selectedDayId, setSelectedDayId] = useState('');

  const loadTrips = () => {
    const found: StoredTrip[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i) || '';
      if (!key.startsWith('trip_')) continue;
      const raw = localStorage.getItem(key) || '[]';
      try {
        const days: Day[] = JSON.parse(raw);
        const name = days?.[0]?.stops?.[0]?.name || key.replace('trip_', '').replaceAll('-', ' ');
        found.push({ key, name, days });
      } catch {}
    }
    setTrips(found);
  };

  useEffect(() => {
    if (open) loadTrips();
  }, [open]);

  const filteredTrips = useMemo(() => {
    return trips.filter((t) => t.name.toLowerCase().includes(query.toLowerCase()));
  }, [trips, query]);

  const renameTrip = (key: string, newName: string) => {
    try {
      const raw = localStorage.getItem(key) || '[]';
      const days: Day[] = JSON.parse(raw);
      if (days[0]?.stops?.[0]) days[0].stops[0].name = newName;
      localStorage.setItem(key, JSON.stringify(days));
      loadTrips();
    } catch {}
  };

  const deleteTrip = (key: string) => {
    localStorage.removeItem(key);
    loadTrips();
  };

  const exportTrip = (key: string) => {
    try {
      const data = localStorage.getItem(key) || '[]';
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${key}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {}
  };

  const duplicateTrip = (key: string) => {
    try {
      const data = localStorage.getItem(key) || '[]';
      const newKey = `${key}_copy_${Date.now()}`;
      localStorage.setItem(newKey, data);
      loadTrips();
    } catch {}
  };

  if (!open) return null;

  return (
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-[120]">
          <div className="absolute inset-0 bg-black/50" onClick={onClose} />
          <motion.div className="absolute inset-4 md:inset-10 bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <div className="flex items-center gap-4">
                <h3 className="text-xl font-semibold">{editingKey ? 'Manage Trip' : 'Your Trips'}</h3>
                {!editingKey && (
                  <div className="flex items-center gap-2 border border-gray-200 rounded-full px-3 py-2 bg-white">
                    <Search className="h-5 w-5 text-gray-400" />
                    <input
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Search trips..."
                      className="outline-none text-sm"
                    />
                  </div>
                )}
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-full border border-gray-200 hover:bg-gray-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-6">
              {!editingKey && filteredTrips.length === 0 ? (
                <div className="text-center text-gray-500 py-12">No trips found. Start planning from any monastery page.</div>
              ) : !editingKey ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {filteredTrips.map((t) => (
                    <div key={t.key} className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm flex flex-col">
                      <div className="w-full h-32 bg-gray-100 overflow-hidden">
                        {t.days?.[0]?.stops?.[0]?.photo ? (
                          <img src={t.days[0].stops[0].photo} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">No photo</div>
                        )}
                      </div>
                      <div className="p-4 flex flex-col gap-2 flex-1">
                        <input
                          defaultValue={t.name}
                          onBlur={(e) => renameTrip(t.key, e.target.value)}
                          className="font-semibold text-gray-900 border-b border-gray-200 outline-none"
                        />
                        <div className="text-sm text-gray-600">
                          Days: {t.days.length} • Stops: {t.days.reduce((a, d) => a + (d.stops?.length || 0), 0)}
                        </div>
                        <div className="flex flex-wrap gap-2 mt-auto">
                          <button
                            onClick={() => onOpenTrip?.(t.key)}
                            className="flex-1 px-3 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-500 text-sm"
                          >
                            Open
                          </button>
                          <button
                            onClick={() => {
                              setEditingKey(t.key);
                              setEditingDays(t.days);
                              setEditingTitle(t.name);
                              setSelectedDayId(t.days?.[0]?.id || '');
                            }}
                            className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-gray-700 text-sm flex items-center justify-center gap-1"
                          >
                            <Edit3 className="h-4 w-4" /> Manage
                          </button>
                          <button
                            onClick={() => duplicateTrip(t.key)}
                            className="px-3 py-2 border border-gray-200 rounded-lg text-gray-700 text-sm flex items-center gap-1"
                          >
                            <Copy className="h-4 w-4" /> Duplicate
                          </button>
                          <button
                            onClick={() => exportTrip(t.key)}
                            className="px-3 py-2 border border-gray-200 rounded-lg text-gray-700 text-sm flex items-center gap-1"
                          >
                            <Download className="h-4 w-4" /> Export
                          </button>
                          <button
                            onClick={() => deleteTrip(t.key)}
                            className="px-2 py-2 border border-gray-200 rounded-lg hover:bg-red-50 ml-auto"
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                /* Editor View */
                <div className="max-w-6xl mx-auto">
                  <div className="flex items-center gap-3 mb-4">
                    <button
                      onClick={() => {
                        setEditingKey('');
                        setEditingDays([]);
                        loadTrips();
                      }}
                      className="px-3 py-2 border border-gray-200 rounded-lg hover:bg-gray-50"
                    >
                      ← Back
                    </button>
                    <input
                      value={editingTitle}
                      onChange={(e) => setEditingTitle(e.target.value)}
                      onBlur={() => renameTrip(editingKey, editingTitle)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg outline-none"
                    />
                  </div>

                  {/* Days Navigation */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {editingDays.map((d) => (
                      <button
                        key={d.id}
                        onClick={() => setSelectedDayId(d.id)}
                        className={`px-3 py-1.5 rounded-full border ${
                          selectedDayId === d.id
                            ? 'bg-orange-600 text-white border-orange-600'
                            : 'bg-white text-gray-700 border-gray-200 hover:bg-orange-50'
                        }`}
                      >
                        {d.title || d.id}
                      </button>
                    ))}
                    <button
                      onClick={() => {
                        const newDay: Day = { id: `day${editingDays.length + 1}`, title: `Day ${editingDays.length + 1}`, stops: [] };
                        const next = [...editingDays, newDay];
                        setEditingDays(next);
                        setSelectedDayId(newDay.id);
                        localStorage.setItem(editingKey, JSON.stringify(next));
                      }}
                      className="px-3 py-1.5 rounded-full border border-orange-300 text-orange-600 hover:bg-orange-50"
                    >
                      + Add Day
                    </button>
                  </div>

                  {/* Stops */}
                  {editingDays.filter((d) => d.id === selectedDayId).map((d) => (
                    <div key={d.id} className="space-y-3">
                      <input
                        value={d.title}
                        onChange={(e) => {
                          const next = editingDays.map((x) => (x.id === d.id ? { ...x, title: e.target.value } : x));
                          setEditingDays(next);
                          localStorage.setItem(editingKey, JSON.stringify(next));
                        }}
                        className="px-3 py-2 border border-gray-300 rounded-lg w-full"
                      />
                      {d.stops.map((s) => (
                        <div key={s.id} className="p-3 border border-gray-200 rounded-xl flex flex-col md:flex-row gap-3 items-start md:items-center">
                          <div className="flex gap-2 items-center flex-wrap">
                            <span className="px-2 py-1 rounded-full bg-orange-50 text-orange-700 border border-orange-200 capitalize">{s.type}</span>
                            <input
                              value={s.name}
                              onChange={(e) => {
                                const next = editingDays.map((day) =>
                                  day.id === d.id
                                    ? { ...day, stops: day.stops.map((st) => (st.id === s.id ? { ...st, name: e.target.value } : st)) }
                                    : day
                                );
                                setEditingDays(next);
                                localStorage.setItem(editingKey, JSON.stringify(next));
                              }}
                              className="font-medium text-gray-900 border-b border-gray-200 outline-none"
                            />
                          </div>
                          <div className="flex gap-2 flex-wrap flex-1">
                            <input
                              placeholder="Time"
                              value={s.time || ''}
                              onChange={(e) => {
                                const next = editingDays.map((day) =>
                                  day.id === d.id
                                    ? { ...day, stops: day.stops.map((st) => (st.id === s.id ? { ...st, time: e.target.value } : st)) }
                                    : day
                                );
                                setEditingDays(next);
                                localStorage.setItem(editingKey, JSON.stringify(next));
                              }}
                              className="px-2 py-1 border border-gray-300 rounded text-sm"
                            />
                            <input
                              placeholder="Notes"
                              value={s.notes || ''}
                              onChange={(e) => {
                                const next = editingDays.map((day) =>
                                  day.id === d.id
                                    ? { ...day, stops: day.stops.map((st) => (st.id === s.id ? { ...st, notes: e.target.value } : st)) }
                                    : day
                                );
                                setEditingDays(next);
                                localStorage.setItem(editingKey, JSON.stringify(next));
                              }}
                              className="px-2 py-1 border border-gray-300 rounded flex-1 text-sm min-w-[150px]"
                            />
                          </div>
                          <button
                            onClick={() => {
                              const next = editingDays.map((day) =>
                                day.id === d.id ? { ...day, stops: day.stops.filter((st) => st.id !== s.id) } : day
                              );
                              setEditingDays(next);
                              localStorage.setItem(editingKey, JSON.stringify(next));
                            }}
                            className="p-2 border border-gray-200 rounded-lg hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </button>
                        </div>
                      ))}
                      <button
                        onClick={() => {
                          const stop: Stop = { id: `note-${Date.now()}`, name: 'Custom Note', type: 'note' };
                          const next = editingDays.map((day) => (day.id === d.id ? { ...day, stops: [...day.stops, stop] } : day));
                          setEditingDays(next);
                          localStorage.setItem(editingKey, JSON.stringify(next));
                        }}
                        className="px-3 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 text-sm"
                      >
                        + Add Stop/Note
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default TripsModal;
