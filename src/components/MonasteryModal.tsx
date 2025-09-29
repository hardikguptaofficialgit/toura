import React, { useEffect, useMemo, useState } from 'react';
import { X, MapPin, Clock, Ticket, Info, Star, Phone, Mail, Globe, Hotel, Utensils, Calendar, ChevronLeft, ChevronRight, Heart, Plus, Sparkles, ListPlus, Trash2, ArrowUp, ArrowDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import GoogleMap from './GoogleMap';
import OpenMap from './OpenMap';
import VRViewer from './VRViewer';
import { useAuth } from '../contexts/AuthContext';
import { TripStorageService, type Trip, type TripStop } from '../services/tripStorage';

export interface MonasteryInfo {
  id: string;
  name: string;
  location: string;
  history: string;
  timings: string;
  entryFee: string;
  contact?: { phone?: string; email?: string; website?: string };
  photos: string[];
  reviews: Array<{ user: string; rating: number; comment: string; date: string }>;
  amenities?: string[];
  events?: Array<{ title: string; date: string; description: string }>; 
  nearby: {
    hotels: Array<{ id: string; name: string; rating: number; pricePerNight: string; distance: string; amenities: string[] }>; 
    restaurants: Array<{ id: string; name: string; cuisine: string; priceRange: string; rating: number; distance: string }>; 
    attractions: Array<{ id: string; name: string; distance: string }>; 
  };
  mapEmbedUrl?: string;
  virtualTourUrl?: string;
}

interface Props {
  open: boolean;
  onClose: () => void;
  monastery: MonasteryInfo | null;
  onAddToPlan?: (type: 'monastery' | 'hotel' | 'restaurant', id: string) => void;
  onBook?: (type: 'hotel' | 'restaurant' | 'ticket', id?: string) => void;
}

const MonasteryModal: React.FC<Props> = ({ open, onClose, monastery, onAddToPlan, onBook }) => {
  const [currentPhotoIdx, setCurrentPhotoIdx] = useState(0);
  const [activeTab, setActiveTab] = useState<'Hotels' | 'Restaurants' | 'Reviews' | 'Photos' | 'Map' | 'Plan'>('Photos');
  const [aiPrompt, setAiPrompt] = useState('2-day trip focused on culture and food');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiItinerary, setAiItinerary] = useState<string>('');
  const [vrOpen, setVrOpen] = useState(false);
  const { user } = useAuth();
  const [bookingStatus, setBookingStatus] = useState<'idle'|'booking'|'booked'|'error'>('idle');
  const [bookingMessage, setBookingMessage] = useState<string>('');
  const [activeNearby, setActiveNearby] = useState<'hotels'|'restaurants'|'sights'>('hotels');
  const [nearby, setNearby] = useState<any[]>([]);
  const [nearbyLoading, setNearbyLoading] = useState(false);
  const [center, setCenter] = useState<{ lat: number; lng: number }>({ lat: 27.3389, lng: 88.6065 });

  const OPENTRIPMAP_API_KEY = (import.meta as any).env?.VITE_OPENTRIPMAP_API_KEY as string | undefined;

  const kindsByCategory: Record<'hotels'|'restaurants'|'sights', string> = {
    hotels: 'accomodations',
    restaurants: 'restaurants',
    sights: 'interesting_places'
  };

  // Resolve a reasonable center for the monastery
  useEffect(() => {
    if (!open || !monastery) return;

    // Try to infer from any nearby attraction coordinates provided
    const guessFromNearby = monastery.nearby?.attractions?.[0] as any;
    if (guessFromNearby && typeof guessFromNearby.lat === 'number' && typeof guessFromNearby.lng === 'number') {
      setCenter({ lat: guessFromNearby.lat, lng: guessFromNearby.lng });
      return;
    }

    // Fallback to Nominatim geocoding by name + location
    (async () => {
      try {
        const q = encodeURIComponent(`${monastery.name} ${monastery.location || ''} Sikkim`);
        const res = await fetch(`https://nominatim.openstreetmap.org/search?q=${q}&format=json&limit=1`);
        const data = await res.json();
        if (Array.isArray(data) && data[0]) {
          setCenter({ lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) });
        } else {
          setCenter({ lat: 27.3389, lng: 88.6065 });
        }
      } catch {
        setCenter({ lat: 27.3389, lng: 88.6065 });
      }
    })();
  }, [open, monastery]);

  // Fetch nearby places from OpenTripMap
  const fetchNearby = async (category: 'hotels'|'restaurants'|'sights') => {
    if (!OPENTRIPMAP_API_KEY) { setNearby([]); return; }
    setNearbyLoading(true);
    try {
      const url = new URL('https://api.opentripmap.com/0.1/en/places/radius');
      url.searchParams.set('radius', '4000');
      url.searchParams.set('lon', String(center.lng));
      url.searchParams.set('lat', String(center.lat));
      url.searchParams.set('kinds', kindsByCategory[category]);
      url.searchParams.set('format', 'json');
      url.searchParams.set('limit', '50');
      url.searchParams.set('apikey', OPENTRIPMAP_API_KEY);
      const res = await fetch(url.toString());
      const data = await res.json();
      const items = Array.isArray(data) ? data : [];
      setNearby(items.map((p: any) => ({
        id: p.xid || `${p.lon},${p.lat}`,
        name: p.name || 'Unnamed',
        dist: p.dist,
        point: { lat: p.point?.lat, lng: p.point?.lon },
      })).filter((i: any) => i.point?.lat && i.point?.lng));
    } catch {
      setNearby([]);
    } finally {
      setNearbyLoading(false);
    }
  };

  useEffect(() => {
    if (!open || !monastery) return;
    fetchNearby(activeNearby);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [center, activeNearby]);

  // Manual Itinerary (localStorage)
  type ItineraryStop = { id: string; type: 'monastery'|'hotel'|'restaurant'|'note'; name: string; time?: string; notes?: string };
  type ItineraryDay = { id: string; title: string; date?: string; stops: ItineraryStop[] };
  const [days, setDays] = useState<ItineraryDay[]>([]);
  const [selectedDayId, setSelectedDayId] = useState<string>('');
  const storageKey = useMemo(()=> monastery ? `trip_${monastery.id}` : 'trip_', [monastery?.id]);

  useEffect(()=>{
    if (!open || !monastery) return;
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) {
        const parsed = JSON.parse(raw) as ItineraryDay[];
        setDays(parsed);
        setSelectedDayId(parsed[0]?.id || '');
      } else {
        const initial: ItineraryDay[] = [{ id: 'day1', title: 'Day 1', stops: [{ id: monastery.id, type: 'monastery', name: monastery.name }] }];
        setDays(initial);
        setSelectedDayId('day1');
        localStorage.setItem(storageKey, JSON.stringify(initial));
      }
    } catch {}
  }, [open, storageKey, monastery]);

  useEffect(()=>{
    if (!monastery || !days.length) return;
    try { localStorage.setItem(storageKey, JSON.stringify(days)); } catch {}
  }, [days, storageKey, monastery]);

  const currentDayIndex = days.findIndex(d => d.id === selectedDayId);
  const currentDay = currentDayIndex >= 0 ? days[currentDayIndex] : undefined;
  const totalStops = useMemo(()=> days.reduce((acc, d)=> acc + d.stops.length, 0), [days]);
  const currentDayStopsWithCoords = useMemo(()=> (currentDay?.stops||[]).filter(s => (s as any).lat && (s as any).lng) as any[], [currentDay]);
  const mapCenterForCurrentDay = useMemo(()=> {
    if (currentDayStopsWithCoords.length > 0) {
      return { lat: currentDayStopsWithCoords[0].lat as number, lng: currentDayStopsWithCoords[0].lng as number };
    }
    return { lat: 27.3389, lng: 88.6065 };
  }, [currentDayStopsWithCoords]);
  const clearDay = () => {
    if (!currentDay) return;
    const updated = [...days];
    updated[currentDayIndex] = { ...currentDay, stops: [] };
    setDays(updated);
  };

  const addDay = () => {
    const newId = `day${days.length + 1}`;
    const next = [...days, { id: newId, title: `Day ${days.length + 1}`, stops: [] }];
    setDays(next);
    setSelectedDayId(newId);
  };
  const renameDay = (id: string, title: string) => setDays(prev => prev.map(d => d.id === id ? { ...d, title } : d));
  const addToPlan = (type: 'monastery'|'hotel'|'restaurant'|'note', id: string, name: string) => {
    if (!currentDay) return;
    const stop: ItineraryStop = { id: `${type}-${id}-${Date.now()}`, type, name };
    const updated = [...days];
    updated[currentDayIndex] = { ...currentDay, stops: [...currentDay.stops, stop] };
    setDays(updated);
    setActiveTab('Plan');
  };
  const updateStop = (stopId: string, patch: Partial<ItineraryStop>) => {
    if (!currentDay) return;
    const updatedStops = currentDay.stops.map(s => s.id === stopId ? { ...s, ...patch } : s);
    const updated = [...days];
    updated[currentDayIndex] = { ...currentDay, stops: updatedStops };
    setDays(updated);
  };
  const moveStop = (stopId: string, dir: -1|1) => {
    if (!currentDay) return;
    const idx = currentDay.stops.findIndex(s => s.id === stopId);
    if (idx < 0) return;
    const newIdx = idx + dir;
    if (newIdx < 0 || newIdx >= currentDay.stops.length) return;
    const arr = [...currentDay.stops];
    const [item] = arr.splice(idx, 1);
    arr.splice(newIdx, 0, item);
    const updated = [...days];
    updated[currentDayIndex] = { ...currentDay, stops: arr };
    setDays(updated);
  };
  const removeStop = (stopId: string) => {
    if (!currentDay) return;
    const updated = [...days];
    updated[currentDayIndex] = { ...currentDay, stops: currentDay.stops.filter(s => s.id !== stopId) };
    setDays(updated);
  };

  if (!open || !monastery) return null;

  const photoCount = monastery.photos?.length || 0;
  const nextPhoto = () => setCurrentPhotoIdx((prev) => (prev + 1) % Math.max(photoCount, 1));
  const prevPhoto = () => setCurrentPhotoIdx((prev) => (prev - 1 + Math.max(photoCount, 1)) % Math.max(photoCount, 1));

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/50" onClick={onClose} />

          {/* Panel */}
          <motion.div
            className="absolute inset-4 md:inset-8 bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 160, damping: 20 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 bg-white/90">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full overflow-hidden border border-orange-200">
                  <img src={monastery.photos?.[0] || '/images/monkai.jpg'} alt={monastery.name} className="h-full w-full object-cover" />
                </div>
                <div>
                  <h2 className="text-lg md:text-xl font-semibold text-gray-900">{monastery.name}</h2>
                  <div className="flex items-center text-gray-600 text-sm">
                    <MapPin className="h-4 w-4 mr-1" /> {monastery.location}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => (onAddToPlan ? onAddToPlan('monastery', monastery.id) : addToPlan('monastery', monastery.id, monastery.name))} className="px-3 py-2 rounded-lg border border-orange-200 text-orange-600 hover:bg-orange-50 transition-colors flex items-center text-sm">
                  <Plus className="h-4 w-4 mr-1" /> Add to Plan
                </button>
                <button onClick={() => setVrOpen(true)} className="px-3 py-2 rounded-lg bg-white text-orange-600 border border-orange-300 hover:bg-orange-50 transition-colors text-sm flex items-center">
                    Virtually Experience
                </button>
                <button disabled={bookingStatus==='booking' || bookingStatus==='booked'} onClick={async () => {
                  setBookingStatus('booking');
                  setBookingMessage('');
                  try {
                    const userId = user?.uid || 'guest';
                    const trips = await TripStorageService.getUserTrips(userId);
                    let bookingTrip = trips.find(t => t.name === 'My Bookings' && t.userId === userId);
                    if (!bookingTrip) {
                      const newTripId = await TripStorageService.createTrip({
                        name: 'My Bookings',
                        destination: monastery.location || 'Sikkim',
                        description: 'Tickets and reservations booked via Toura',
                        startDate: new Date().toISOString().slice(0,10),
                        endDate: new Date().toISOString().slice(0,10),
                        duration: 1,
                        stops: [],
                        isPublic: false,
                        userId,
                        tags: ['bookings'],
                        status: 'planned'
                      });
                      bookingTrip = (await TripStorageService.getTrip(newTripId)) as Trip;
                    }
                    const stop: Omit<TripStop,'id'> = {
                      name: `Entrance Ticket - ${monastery.name}`,
                      type: 'activity',
                      description: `Booked tickets for ${monastery.name}. Auto-confirmed.`,
                      location: { name: monastery.location || monastery.name },
                      estimatedDuration: '3 hours',
                      category: 'Ticket',
                      importance: 'high',
                      price: '₹200',
                      notes: 'Show this confirmation at entry.'
                    };
                    await TripStorageService.addStopToTrip(bookingTrip.id, stop);
                    setBookingStatus('booked');
                    setBookingMessage('Tickets booked! Added to My Bookings.');
                  } catch (e:any) {
                    setBookingStatus('error');
                    setBookingMessage('Failed to save booking.');
                  }
                  onBook?.('ticket');
                }} className={`px-3 py-2 rounded-lg transition-colors text-sm flex items-center ${bookingStatus==='booked' ? 'bg-green-600 text-white' : 'bg-orange-600 text-white hover:bg-orange-500'}`}>
                  <Ticket className="h-4 w-4 mr-1" /> Book Tickets
                </button>
                <button onClick={onClose} className="ml-2 p-2 rounded-full border border-gray-200 hover:bg-gray-100">
                  <X className="h-5 w-5 text-gray-700" />
                </button>
              </div>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto">
              {/* Booking confirmation */}
              {bookingStatus!=='idle' && (
                <div className={`mx-5 mt-4 rounded-lg border p-3 text-sm ${bookingStatus==='booked' ? 'border-green-200 bg-green-50 text-green-700' : bookingStatus==='error' ? 'border-red-200 bg-red-50 text-red-700' : 'border-orange-200 bg-orange-50 text-orange-700'}`}>
                  {bookingMessage || (bookingStatus==='booking' ? 'Booking tickets…' : '')}
                </div>
              )}

              {/* Hero Gallery */}
              <div className="relative h-64 md:h-80 bg-gray-100">
                {photoCount > 0 && (
                  <img src={monastery.photos[currentPhotoIdx]} alt={`${monastery.name} photo ${currentPhotoIdx + 1}`} className="absolute inset-0 w-full h-full object-cover" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                <button onClick={prevPhoto} className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-700 rounded-full p-2 shadow">
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button onClick={nextPhoto} className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-700 rounded-full p-2 shadow">
                  <ChevronRight className="h-5 w-5" />
                </button>
                {/* VR CTA over carousel */}
                <button
                  onClick={() => setVrOpen(true)}
                  className="absolute right-4 bottom-4 px-4 py-2 rounded-full bg-orange-600 text-white shadow-lg hover:bg-orange-500 transition-colors"
                >
                  Virtually experience this
                </button>
                {/* Dots */}
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                  {Array.from({ length: Math.max(photoCount, 1) }).map((_, i) => (
                    <span key={i} className={`h-1.5 w-4 rounded-full ${i === currentPhotoIdx ? 'bg-white' : 'bg-white/60'}`} />
                  ))}
                </div>
              </div>

              {/* Tabs */}
              <div className="max-w-7xl mx-auto px-5 pt-6">
                <div className="flex flex-wrap gap-2">
                  {(['Photos','Hotels','Restaurants','Reviews','Map','Plan'] as const).map(tab => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`px-4 py-2 rounded-full border ${activeTab===tab ? 'bg-orange-600 text-white border-orange-600' : 'bg-white text-gray-700 border-gray-200 hover:bg-orange-50'}`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tab Panels + Details column */}
              <div className="max-w-7xl mx-auto px-5 py-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left: Details */}
                <div className="lg:col-span-2 space-y-6">
                  <section className="p-5 rounded-2xl border border-gray-200 bg-white">
                    <h3 className="text-lg font-semibold mb-3 flex items-center"><Info className="h-5 w-5 text-orange-600 mr-2" /> About</h3>
                    <p className="text-gray-700 leading-relaxed">{monastery.history}</p>
                    <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm text-gray-700">
                      <div className="flex items-center"><Clock className="h-4 w-4 mr-2 text-gray-500" /> {monastery.timings}</div>
                      <div className="flex items-center"><Ticket className="h-4 w-4 mr-2 text-gray-500" /> Entry: {monastery.entryFee}</div>
                      <div className="flex items-center"><Star className="h-4 w-4 mr-2 text-yellow-500" /> Avg Rating: {(monastery.reviews.reduce((a, r) => a + r.rating, 0) / Math.max(monastery.reviews.length, 1)).toFixed(1)}</div>
                    </div>
                  </section>

                  {activeTab === 'Reviews' && (
                    <section className="p-5 rounded-2xl border border-gray-200 bg-white">
                      <h3 className="text-lg font-semibold mb-4 flex items-center"><Star className="h-5 w-5 text-yellow-500 mr-2" /> Reviews & Comments</h3>
                      <div className="space-y-4">
                        {monastery.reviews.map((r, idx) => (
                          <div key={idx} className="p-4 rounded-xl border border-gray-200 bg-white/70">
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-medium text-gray-900">{r.user}</span>
                              <span className="text-sm text-gray-500">{r.date}</span>
                            </div>
                            <div className="flex items-center text-yellow-500 mb-1">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <Star key={i} className={`h-4 w-4 ${i < r.rating ? '' : 'text-gray-300'}`} fill={i < r.rating ? '#f59e0b' : 'transparent'} />
                              ))}
                            </div>
                            <p className="text-gray-700 text-sm">{r.comment}</p>
                          </div>
                        ))}
                      </div>
                    </section>
                  )}

                  {activeTab === 'Photos' && (
                    <section className="p-5 rounded-2xl border border-gray-200 bg-white">
                      <h3 className="text-lg font-semibold mb-4">Photos</h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {(monastery.photos?.length ? monastery.photos : [monastery.photos?.[0]]).filter(Boolean).map((p, i) => (
                          <img key={i} src={p as string} alt={`photo-${i}`} className="w-full h-40 object-cover rounded-xl" />
                        ))}
                      </div>
                    </section>
                  )}

                  {activeTab === 'Map' && (
                    <section className="p-5 rounded-2xl border border-gray-200 bg-white space-y-3">
                      <h3 className="text-lg font-semibold">Map & Nearby Attractions</h3>
                      <OpenMap
                        className="w-full h-96 rounded-2xl"
                        center={{ lat: 27.3389, lng: 88.6065 }}
                        zoom={11}
                        markers={days.flatMap(d => d.stops.filter(s=> (s as any).lat && (s as any).lng).map(s=>({ id:s.id, position:{ lat:(s as any).lat, lng:(s as any).lng }, title:s.name })))}
                        path={days.flatMap(d => d.stops.filter(s=> (s as any).lat && (s as any).lng).map(s=>({ lat:(s as any).lat, lng:(s as any).lng })))}
                        onMapClick={(pos)=>{
                          // Add a note stop at clicked position
                          const name = `Stop ${days.reduce((acc,d)=>acc+d.stops.length,0)+1}`;
                          const stop: any = { id:`note-${Date.now()}`, type:'note', name, lat: pos.lat, lng: pos.lng };
                          if (days.length === 0) return;
                          const idx = days.findIndex(d=>d.id===selectedDayId);
                          if (idx < 0) return;
                          const updated = [...days];
                          updated[idx] = { ...days[idx], stops:[...days[idx].stops, stop] };
                          setDays(updated);
                        }}
                        onMarkerDrag={(id, pos)=>{
                          const idx = days.findIndex(d=>d.id===selectedDayId);
                          if (idx < 0) return;
                          const updated = [...days];
                          updated[idx] = { ...days[idx], stops: days[idx].stops.map(s => s.id===id ? ({ ...s, lat: pos.lat, lng: pos.lng } as any) : s) };
                          setDays(updated);
                        }}
                      />
                      <div className="text-xs text-gray-600">Tip: Click on the map to add a custom stop; drag existing markers to adjust. Autosaves locally.</div>
                    </section>
                  )}

                  {activeTab === 'Plan' && (
                    <section className="p-5 rounded-2xl border border-gray-200 bg-white space-y-4">
                      <h3 className="text-lg font-semibold mb-2 flex items-center"><ListPlus className="h-5 w-5 text-orange-600 mr-2" /> Trip Planner</h3>
                      <div className="text-sm text-gray-700">Build your plan by days. Add stops, reorder, and personalize your itinerary. AI can draft a plan for you.</div>

                      {/* Stats */}
                      <div className="flex flex-wrap gap-3 text-sm">
                        <div className="px-3 py-1 rounded-full border border-orange-200 text-orange-700">Days: {days.length}</div>
                        <div className="px-3 py-1 rounded-full border border-orange-200 text-orange-700">Current day stops: {currentDay?.stops.length || 0}</div>
                        <div className="px-3 py-1 rounded-full border border-orange-200 text-orange-700">Total stops: {totalStops}</div>
                      </div>

                      <div className="flex flex-wrap gap-2 items-center">
                        {days.map(d => (
                          <button key={d.id} onClick={()=>setSelectedDayId(d.id)} className={`px-3 py-1.5 rounded-full border ${selectedDayId===d.id ? 'bg-orange-600 text-white border-orange-600' : 'bg-white text-gray-700 border-gray-200 hover:bg-orange-50'}`}>{d.title}</button>
                        ))}
                        <button onClick={addDay} className="px-3 py-1.5 rounded-full border border-orange-300 text-orange-600 hover:bg-orange-50">+ Add Day</button>
                      </div>

                      {currentDay && (
                        <div className="space-y-3">
                          <div className="flex gap-2 items-center">
                            <input value={currentDay.title} onChange={e=>renameDay(currentDay.id, e.target.value)} className="px-3 py-2 rounded-lg border border-gray-300" />
                            <button onClick={clearDay} className="px-3 py-2 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 text-sm">Clear day</button>
                          </div>

                          {/* Mini Map for current day */}
                          <OpenMap
                            className="w-full h-64 rounded-xl"
                            center={mapCenterForCurrentDay}
                            zoom={12}
                            markers={currentDayStopsWithCoords.map((s, i) => ({ id: s.id, position: { lat: s.lat, lng: s.lng }, title: `${i+1}. ${s.name}` }))}
                            path={currentDayStopsWithCoords.map((s) => ({ lat: s.lat, lng: s.lng }))}
                            onMapClick={(pos)=>{
                              const name = `Stop ${currentDay.stops.length + 1}`;
                              const stop: any = { id:`note-${Date.now()}`, type:'note', name, lat: pos.lat, lng: pos.lng };
                              const updated = [...days];
                              updated[currentDayIndex] = { ...currentDay, stops:[...currentDay.stops, stop] };
                              setDays(updated);
                            }}
                            onMarkerDrag={(id, pos)=>{
                              const updated = [...days];
                              updated[currentDayIndex] = { ...currentDay, stops: currentDay.stops.map(s => s.id===id ? ({ ...s, lat: pos.lat, lng: pos.lng } as any) : s) };
                              setDays(updated);
                            }}
                          />
                          <div className="space-y-2">
                            {currentDay.stops.map((s) => (
                              <div key={s.id} className="p-3 border border-gray-200 rounded-xl flex items-start gap-3">
                                <div className="text-xs px-2 py-1 rounded-full bg-orange-50 text-orange-700 border border-orange-200 capitalize">{s.type}</div>
                                <div className="flex-1">
                                  <div className="font-medium text-gray-900">{s.name}</div>
                                  <div className="flex flex-wrap gap-2 mt-2">
                                    <input placeholder="Time" value={s.time||''} onChange={e=>updateStop(s.id,{ time:e.target.value })} className="px-2 py-1 rounded border border-gray-300 text-sm" />
                                    <input placeholder="Notes" value={s.notes||''} onChange={e=>updateStop(s.id,{ notes:e.target.value })} className="flex-1 min-w-[180px] px-2 py-1 rounded border border-gray-300 text-sm" />
                                  </div>
                                </div>
                                <div className="flex flex-col gap-1">
                                  <button onClick={()=>moveStop(s.id,-1)} className="p-1 rounded border border-gray-200 hover:bg-gray-50" title="Move up"><ArrowUp className="h-4 w-4"/></button>
                                  <button onClick={()=>moveStop(s.id,1)} className="p-1 rounded border border-gray-200 hover:bg-gray-50" title="Move down"><ArrowDown className="h-4 w-4"/></button>
                                  <button onClick={()=>removeStop(s.id)} className="p-1 rounded border border-gray-200 hover:bg-gray-50" title="Remove"><Trash2 className="h-4 w-4 text-red-500"/></button>
                                </div>
                              </div>
                            ))}
                          </div>

                          <div className="flex flex-wrap gap-2 items-center">
                            <button onClick={()=>addToPlan('note', `note-${Date.now()}`, 'Custom Note')} className="px-3 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 text-sm">Add note</button>
                          </div>

                          <div className="pt-3 border-t border-gray-200 space-y-2">
                            <div className="font-medium flex items-center gap-2"><Sparkles className="h-4 w-4 text-orange-600"/> AI Itinerary Assist</div>
                            <div className="flex items-center gap-2">
                              <input value={aiPrompt} onChange={e=>setAiPrompt(e.target.value)} placeholder="e.g. 3-day spiritual tour with scenic hikes" className="flex-1 px-3 py-2 rounded-lg border border-gray-300" />
                              <button onClick={async ()=>{
                                try { setAiLoading(true); setAiItinerary('');
                                  const res = await fetch('https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key='+(import.meta.env.VITE_GEMINI_API_KEY||''),{
                                    method:'POST', headers:{ 'Content-Type':'application/json' },
                                    body: JSON.stringify({ contents:[{ parts:[{ text:`Create a detailed Sikkim trip itinerary starting at ${monastery.name}. Preferences: ${aiPrompt}. Include daily plan, timings, and suggestions for hotels and restaurants near the monastery.` }]}] })
                                  });
                                  const data = await res.json();
                                  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || 'Unable to generate itinerary right now.';
                                  setAiItinerary(text);
                                } finally { setAiLoading(false); }
                              }} className="px-4 py-2 rounded-lg bg-orange-600 text-white hover:bg-orange-500">Generate</button>
                            </div>
                            <div className="min-h-[120px] p-3 rounded-lg bg-orange-50 border border-orange-200 text-sm whitespace-pre-wrap">{aiLoading? 'Generating itinerary...' : (aiItinerary || 'Your AI-generated itinerary will appear here.')}</div>
                          </div>
                        </div>
                      )}
                    </section>
                  )}
                </div>

                {/* Right: Booking and Contact */}
                <aside className="space-y-6">
                  {/* Hotels */}
                  {(activeTab === 'Hotels') && (
                  <section className="p-5 rounded-2xl border border-gray-200 bg-white">
                    <h3 className="text-lg font-semibold mb-3 flex items-center"><Hotel className="h-5 w-5 text-blue-600 mr-2" /> Nearby Hotels</h3>
                    <div className="mb-3 text-sm text-gray-600">Powered by OpenStreetMap + OpenTripMap</div>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                      <div className="lg:col-span-2">
                        <OpenMap
                          className="w-full h-72 rounded-xl border border-gray-200"
                          center={center}
                          zoom={13}
                          markers={nearby.map(p => ({ id: p.id, position: p.point, title: p.name }))}
                        />
                          </div>
                      <div className="max-h-72 overflow-y-auto border border-gray-200 rounded-xl p-3">
                        {nearbyLoading ? (
                          <div className="text-sm text-gray-600">Loading nearby hotels…</div>
                        ) : nearby.length === 0 ? (
                          <div className="text-sm text-gray-600">No results found.</div>
                        ) : (
                          <ul className="space-y-2">
                            {nearby.slice(0,30).map((h) => (
                              <li key={h.id} className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50">
                                <div className="text-sm font-medium text-gray-900 truncate">{h.name}</div>
                                {typeof h.dist === 'number' && (
                                  <div className="text-xs text-gray-500">{Math.round(h.dist)} m away</div>
                                )}
                              </li>
                            ))}
                          </ul>
                        )}
                          </div>
                    </div>
                  </section>
                  )}

                  {/* Restaurants */}
                  {(activeTab === 'Restaurants') && (
                  <section className="p-5 rounded-2xl border border-gray-200 bg-white">
                    <h3 className="text-lg font-semibold mb-3 flex items-center"><Utensils className="h-5 w-5 text-green-600 mr-2" /> Nearby Restaurants</h3>
                    <div className="mb-3 text-sm text-gray-600">Powered by OpenStreetMap + OpenTripMap</div>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                      <div className="lg:col-span-2">
                        <OpenMap
                          className="w-full h-72 rounded-xl border border-gray-200"
                          center={center}
                          zoom={13}
                          markers={nearby.map(p => ({ id: p.id, position: p.point, title: p.name }))}
                        />
                          </div>
                      <div className="max-h-72 overflow-y-auto border border-gray-200 rounded-xl p-3">
                        {nearbyLoading ? (
                          <div className="text-sm text-gray-600">Loading nearby restaurants…</div>
                        ) : nearby.length === 0 ? (
                          <div className="text-sm text-gray-600">No results found.</div>
                        ) : (
                          <ul className="space-y-2">
                            {nearby.slice(0,30).map((r) => (
                              <li key={r.id} className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50">
                                <div className="text-sm font-medium text-gray-900 truncate">{r.name}</div>
                                {typeof r.dist === 'number' && (
                                  <div className="text-xs text-gray-500">{Math.round(r.dist)} m away</div>
                                )}
                              </li>
                            ))}
                          </ul>
                        )}
                          </div>
                    </div>
                  </section>
                  )}

                  {/* Contact and Events */}
                  <section className="p-5 rounded-2xl border border-gray-200 bg-white space-y-3">
                    <h3 className="text-lg font-semibold flex items-center"><Info className="h-5 w-5 text-gray-600 mr-2" /> Info</h3>
                    <div className="text-sm text-gray-700 space-y-1">
                      {monastery.contact?.phone && <div className="flex items-center"><Phone className="h-4 w-4 mr-2" /> {monastery.contact.phone}</div>}
                      {monastery.contact?.email && <div className="flex items-center"><Mail className="h-4 w-4 mr-2" /> {monastery.contact.email}</div>}
                      {monastery.contact?.website && (
                        <a href={monastery.contact.website} target="_blank" rel="noreferrer" className="flex items-center text-blue-600 hover:text-blue-700">
                          <Globe className="h-4 w-4 mr-2" /> Website
                        </a>
                      )}
                    </div>
                    {monastery.events && monastery.events.length > 0 && (
                      <div className="pt-3 border-t border-gray-200">
                        <div className="font-medium text-gray-900 mb-2 flex items-center"><Calendar className="h-4 w-4 mr-2" /> Upcoming Events</div>
                        <div className="space-y-2">
                          {monastery.events.map((e, idx) => (
                            <div key={idx} className="text-sm text-gray-700">
                              <div className="font-medium">{e.title}</div>
                              <div className="text-gray-500">{e.date}</div>
                              <div className="text-gray-600">{e.description}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </section>
                </aside>
              </div>

              {/* Map */}
              <div className="px-5 pb-6">
                <div className="max-w-7xl mx-auto rounded-2xl overflow-hidden border border-gray-200">
                  {monastery.mapEmbedUrl ? (
                    <iframe title="map" src={monastery.mapEmbedUrl} className="w-full h-80" loading="lazy"></iframe>
                  ) : (
                    <div className="w-full h-80 bg-gray-100 flex items-center justify-center text-gray-500">Map preview coming soon</div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
          {/* Fullscreen VR Viewer */}
          <VRViewer
            isOpen={vrOpen}
            onClose={() => setVrOpen(false)}
            place={{
              name: monastery.name,
              coordinates: { lat: 27.3389, lng: 88.6065 },
              description: monastery.history
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MonasteryModal;


