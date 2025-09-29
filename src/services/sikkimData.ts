// Comprehensive Sikkim Places Data
export interface PlaceDetail {
  id: string;
  name: string;
  category: string;
  subcategory: string;
  rating: number;
  reviewCount: number;
  description: string;
  shortDescription: string;
  images: string[];
  location: {
    address: string;
    coordinates: { lat: number; lng: number };
    city: string;
    state: string;
  };
  details: {
    timings?: string;
    entryFee?: string;
    bestTimeToVisit: string;
    duration: string;
    difficulty?: string;
    amenities: string[];
  };
  highlights: string[];
  tips: string[];
  nearbyPlaces: string[];
  tags: string[];
  isOpen?: boolean;
  contact?: {
    phone?: string;
    website?: string;
    email?: string;
  };
}

export const sikkimPlaces: PlaceDetail[] = [
  {
    id: "nathula-pass",
    name: "Nathula Pass",
    category: "attractions",
    subcategory: "Historic Sites",
    rating: 4.7,
    reviewCount: 2055,
    description: "Nathula Pass is a mountain pass in the Himalayas in East Sikkim district. It connects the Indian state of Sikkim with China's Tibet Autonomous Region. The pass, at 4,310 m (14,140 ft) above mean sea level, forms a part of an offshoot of the ancient Silk Road. Nathula means 'listening ears' and is one of the three open trading border posts between China and India.",
    shortDescription: "Historic mountain pass connecting India and Tibet at 14,140 ft altitude",
    images: [
      "https://images.unsplash.com/photo-1544735716-392fe2489ffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
    ],
    location: {
      address: "Nathula Pass, East Sikkim, Sikkim 737132",
      coordinates: { lat: 27.3908, lng: 88.8475 },
      city: "Gangtok",
      state: "Sikkim"
    },
    details: {
      timings: "9:00 AM - 3:00 PM (Wed, Thu, Sat, Sun only)",
      entryFee: "₹200 per person",
      bestTimeToVisit: "May to October",
      duration: "Full day trip",
      difficulty: "Moderate (high altitude)",
      amenities: ["Parking", "Restrooms", "Food stalls", "Military checkpoint"]
    },
    highlights: [
      "Indo-China border crossing point",
      "Part of ancient Silk Route",
      "Breathtaking Himalayan views",
      "High altitude experience at 14,140 ft",
      "Historical significance"
    ],
    tips: [
      "Carry valid ID proof (mandatory)",
      "Book permits in advance",
      "Dress warmly - very cold at high altitude",
      "Avoid if you have breathing problems",
      "Photography restrictions near border"
    ],
    nearbyPlaces: ["Tsomgo Lake", "Baba Harbhajan Singh Temple", "Kupup Lake"],
    tags: ["border", "historic", "mountain pass", "silk route", "high altitude"],
    isOpen: true,
    contact: {
      phone: "+91-3592-202033"
    }
  },
  {
    id: "mg-marg",
    name: "MG Marg",
    category: "attractions",
    subcategory: "Neighbourhoods",
    rating: 4.4,
    reviewCount: 1397,
    description: "MG Marg (Mahatma Gandhi Marg) is the heart of Gangtok, the capital city of Sikkim. This pedestrian-only shopping street is a vibrant hub of activity, lined with shops, restaurants, cafes, and cultural centers. The street transforms beautifully in the evening with stunning lights and becomes a perfect place for leisurely walks, shopping, and experiencing local culture.",
    shortDescription: "Vibrant pedestrian shopping street in the heart of Gangtok",
    images: [
      "https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
      "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
      "https://images.unsplash.com/photo-1551632811-561732d1e306?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
    ],
    location: {
      address: "MG Marg, Gangtok, Sikkim 737101",
      coordinates: { lat: 27.3314, lng: 88.6138 },
      city: "Gangtok",
      state: "Sikkim"
    },
    details: {
      timings: "24/7 (shops open 10:00 AM - 9:00 PM)",
      entryFee: "Free",
      bestTimeToVisit: "Year round, evenings are best",
      duration: "2-3 hours",
      amenities: ["Free WiFi", "ATMs", "Restrooms", "Seating areas", "Street food"]
    },
    highlights: [
      "Pedestrian-only zone",
      "Beautiful evening lighting",
      "Shopping and dining hub",
      "Cultural events and festivals",
      "Street performances"
    ],
    tips: [
      "Visit in the evening for best experience",
      "Try local street food",
      "Perfect for souvenir shopping",
      "Free WiFi available",
      "Great for photography"
    ],
    nearbyPlaces: ["Ganesh Tok", "Hanuman Tok", "Enchey Monastery"],
    tags: ["shopping", "nightlife", "food", "culture", "pedestrian zone"],
    isOpen: true
  },
  {
    id: "gurudongmar-lake",
    name: "Gurudongmar Lake",
    category: "attractions",
    subcategory: "Bodies of Water",
    rating: 4.9,
    reviewCount: 559,
    description: "Gurudongmar Lake is one of the highest lakes in the world, situated at an altitude of 17,800 feet in North Sikkim. The lake is considered sacred by both Buddhists and Sikhs. Named after Guru Padmasambhava (Guru Rinpoche), the founder of Tibetan Buddhism, this pristine alpine lake offers breathtaking views of snow-capped mountains and crystal-clear reflections.",
    shortDescription: "Sacred high-altitude lake at 17,800 ft with pristine alpine beauty",
    images: [
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
      "https://images.unsplash.com/photo-1544735716-392fe2489ffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
    ],
    location: {
      address: "Gurudongmar Lake, North Sikkim, Sikkim 737120",
      coordinates: { lat: 28.0301, lng: 88.5122 },
      city: "Lachen",
      state: "Sikkim"
    },
    details: {
      timings: "6:00 AM - 4:00 PM",
      entryFee: "₹50 per person + vehicle charges",
      bestTimeToVisit: "May to October",
      duration: "2-3 days (including travel)",
      difficulty: "Challenging (very high altitude)",
      amenities: ["Basic restrooms", "Prayer flags area", "View points"]
    },
    highlights: [
      "One of the highest lakes in the world",
      "Sacred to Buddhists and Sikhs",
      "Crystal clear reflections",
      "Surrounded by snow-capped peaks",
      "Unique high-altitude ecosystem"
    ],
    tips: [
      "Acclimatize properly before visiting",
      "Carry oxygen cylinders if needed",
      "Dress in multiple layers",
      "Stay hydrated",
      "Respect religious sentiments"
    ],
    nearbyPlaces: ["Yumthang Valley", "Lachen Village", "Chopta Valley"],
    tags: ["sacred lake", "high altitude", "pristine", "buddhist", "sikh"],
    isOpen: true
  },
  {
    id: "yumthang-valley",
    name: "Yumthang Valley",
    category: "attractions",
    subcategory: "Valleys",
    rating: 4.5,
    reviewCount: 761,
    description: "Known as the 'Valley of Flowers', Yumthang Valley is a nature lover's paradise located in North Sikkim at an altitude of 11,693 feet. The valley is famous for its hot springs, yaks, grazing pastures, and surrounding snow-capped mountains. During spring (April-May), the valley blooms with rhododendrons and other alpine flowers, creating a spectacular carpet of colors.",
    shortDescription: "Valley of Flowers with hot springs and alpine meadows at 11,693 ft",
    images: [
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
      "https://images.unsplash.com/photo-1544735716-392fe2489ffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
    ],
    location: {
      address: "Yumthang Valley, North Sikkim, Sikkim 737120",
      coordinates: { lat: 27.8137, lng: 88.7105 },
      city: "Lachung",
      state: "Sikkim"
    },
    details: {
      timings: "Sunrise to Sunset",
      entryFee: "₹30 per person",
      bestTimeToVisit: "April to June, September to November",
      duration: "2-3 days (including travel)",
      difficulty: "Moderate to challenging",
      amenities: ["Hot springs", "Basic restrooms", "Tea stalls", "Camping area"]
    },
    highlights: [
      "Valley of Flowers",
      "Natural hot springs",
      "Rhododendron blooms in spring",
      "Yak grazing pastures",
      "Snow-capped mountain views"
    ],
    tips: [
      "Visit during rhododendron season (April-May)",
      "Try the natural hot springs",
      "Carry warm clothes",
      "Book accommodation in advance",
      "Respect the fragile ecosystem"
    ],
    nearbyPlaces: ["Zero Point", "Lachung Village", "Gurudongmar Lake"],
    tags: ["valley of flowers", "hot springs", "rhododendrons", "alpine", "nature"],
    isOpen: true
  },
  {
    id: "zero-point",
    name: "Yume Samdong (Zero Point)",
    category: "attractions",
    subcategory: "Mountains",
    rating: 4.6,
    reviewCount: 620,
    description: "Yume Samdong, locally known as Zero Point, is situated at an altitude of 15,300 feet in North Sikkim. It's the last point that civilians can visit towards the Indo-China border. The area offers spectacular views of snow-covered peaks, glacial terrain, and the dramatic landscape of the high Himalayas. The journey to Zero Point is as thrilling as the destination itself.",
    shortDescription: "Last civilian point near Indo-China border at 15,300 ft altitude",
    images: [
      "https://images.unsplash.com/photo-1544735716-392fe2489ffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
    ],
    location: {
      address: "Yume Samdong, North Sikkim, Sikkim 737120",
      coordinates: { lat: 27.8833, lng: 88.7167 },
      city: "Lachung",
      state: "Sikkim"
    },
    details: {
      timings: "7:00 AM - 3:00 PM",
      entryFee: "₹50 per person + vehicle charges",
      bestTimeToVisit: "May to October",
      duration: "Full day trip from Lachung",
      difficulty: "Challenging (very high altitude)",
      amenities: ["View points", "Basic facilities", "Border checkpoint"]
    },
    highlights: [
      "Last civilian point near border",
      "Spectacular Himalayan views",
      "Glacial landscape",
      "High altitude adventure",
      "Crystal clear mountain air"
    ],
    tips: [
      "Start early from Lachung",
      "Carry warm clothes and gloves",
      "Take altitude sickness precautions",
      "Carry food and water",
      "Don't venture beyond marked areas"
    ],
    nearbyPlaces: ["Yumthang Valley", "Lachung Monastery", "Chopta Valley"],
    tags: ["border area", "high altitude", "glacial", "adventure", "mountains"],
    isOpen: true
  },
  {
    id: "buddha-park-ravangla",
    name: "Buddha Park, Ravangla",
    category: "attractions",
    subcategory: "Religious Sites",
    rating: 4.7,
    reviewCount: 563,
    description: "Buddha Park in Ravangla, South Sikkim, is home to a magnificent 130-foot tall statue of Buddha Shakyamuni, one of the tallest Buddha statues in India. Set amidst the serene hills with panoramic views of the Himalayas including Kanchenjunga, the park spreads across 6.5 acres and features beautiful gardens, meditation halls, and peaceful walking paths.",
    shortDescription: "Majestic 130-foot Buddha statue with panoramic Himalayan views",
    images: [
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
      "https://images.unsplash.com/photo-1544735716-392fe2489ffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
    ],
    location: {
      address: "Buddha Park, Ravangla, South Sikkim, Sikkim 737139",
      coordinates: { lat: 27.2797, lng: 88.3919 },
      city: "Ravangla",
      state: "Sikkim"
    },
    details: {
      timings: "6:00 AM - 6:00 PM",
      entryFee: "₹10 per person",
      bestTimeToVisit: "March to June, September to December",
      duration: "2-3 hours",
      amenities: ["Meditation hall", "Gardens", "Parking", "Cafeteria", "Souvenir shop"]
    },
    highlights: [
      "130-foot tall Buddha statue",
      "Panoramic Himalayan views",
      "Beautiful landscaped gardens",
      "Meditation and prayer halls",
      "Peaceful spiritual atmosphere"
    ],
    tips: [
      "Visit during clear weather for mountain views",
      "Carry a light jacket",
      "Perfect for meditation and photography",
      "Respect the religious atmosphere",
      "Don't miss the sunset views"
    ],
    nearbyPlaces: ["Rayong Sunrise Point", "Maenam Wildlife Sanctuary", "Borong Hot Springs"],
    tags: ["buddha statue", "religious", "meditation", "gardens", "panoramic views"],
    isOpen: true,
    contact: {
      phone: "+91-3595-234567"
    }
  },
  {
    id: "baba-harbhajan-singh-temple",
    name: "Baba Harbhajan Singh Memorial Temple",
    category: "attractions",
    subcategory: "Religious Sites",
    rating: 4.3,
    reviewCount: 1325,
    description: "Baba Harbhajan Singh Memorial Temple is a unique shrine dedicated to an Indian Army soldier who died in 1968 near the Indo-China border. Located at an altitude of 13,123 feet, the temple has become a place of reverence where people believe Baba's spirit protects the soldiers and grants wishes to devotees. The Indian Army maintains the temple and conducts regular prayers.",
    shortDescription: "Sacred shrine dedicated to an Indian Army soldier at 13,123 ft",
    images: [
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
      "https://images.unsplash.com/photo-1544735716-392fe2489ffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
    ],
    location: {
      address: "Baba Mandir, East Sikkim, Sikkim 737132",
      coordinates: { lat: 27.3731, lng: 88.8397 },
      city: "Gangtok",
      state: "Sikkim"
    },
    details: {
      timings: "6:00 AM - 6:00 PM",
      entryFee: "Free",
      bestTimeToVisit: "May to October",
      duration: "1-2 hours",
      amenities: ["Prayer hall", "Restrooms", "Parking", "Army canteen"]
    },
    highlights: [
      "Unique military shrine",
      "Spiritual significance for soldiers",
      "High altitude temple",
      "Maintained by Indian Army",
      "Beautiful mountain surroundings"
    ],
    tips: [
      "Respect the military significance",
      "Carry warm clothes",
      "Photography may be restricted",
      "Listen to the inspiring story",
      "Combine with Tsomgo Lake visit"
    ],
    nearbyPlaces: ["Tsomgo Lake", "Nathula Pass", "Kupup Lake"],
    tags: ["military shrine", "spiritual", "army temple", "high altitude", "unique"],
    isOpen: true
  },
  {
    id: "hanuman-tok",
    name: "Hanuman Tok",
    category: "attractions",
    subcategory: "Religious Sites",
    rating: 4.4,
    reviewCount: 1043,
    description: "Hanuman Tok is a temple dedicated to Lord Hanuman, perched at an altitude of 7,200 feet, about 11 km from Gangtok. The temple offers breathtaking panoramic views of the surrounding valleys and the majestic Kanchenjunga peak. It's believed that wishes made here with a pure heart are fulfilled. The temple is also a popular spot for sunrise and sunset viewing.",
    shortDescription: "Hilltop Hanuman temple with panoramic valley and Kanchenjunga views",
    images: [
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
      "https://images.unsplash.com/photo-1544735716-392fe2489ffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
    ],
    location: {
      address: "Hanuman Tok, East Sikkim, Sikkim 737135",
      coordinates: { lat: 27.3583, lng: 88.6297 },
      city: "Gangtok",
      state: "Sikkim"
    },
    details: {
      timings: "5:00 AM - 7:00 PM",
      entryFee: "Free",
      bestTimeToVisit: "Year round",
      duration: "1-2 hours",
      amenities: ["Prayer hall", "View point", "Parking", "Small shop"]
    },
    highlights: [
      "Kanchenjunga peak views",
      "Sunrise and sunset point",
      "Peaceful hilltop location",
      "Wish-fulfilling temple",
      "Photography spot"
    ],
    tips: [
      "Visit early morning for sunrise",
      "Carry a camera for mountain views",
      "Combine with Ganesh Tok visit",
      "Dress modestly in temple",
      "Evening visits offer sunset views"
    ],
    nearbyPlaces: ["Ganesh Tok", "Himalayan Zoological Park", "MG Marg"],
    tags: ["hanuman temple", "mountain views", "sunrise point", "religious", "photography"],
    isOpen: true
  },
  {
    id: "tsomgo-lake",
    name: "Tsomgo Lake (Changu Lake)",
    category: "attractions",
    subcategory: "Bodies of Water",
    rating: 4.5,
    reviewCount: 1856,
    description: "Tsomgo Lake, also known as Changu Lake, is a glacial lake located at an altitude of 12,313 feet, about 40 km from Gangtok. The lake is considered sacred by the local people and is surrounded by steep mountains. The lake's water changes colors throughout the year and often remains frozen during winter months. It's a popular destination for its natural beauty and yak rides.",
    shortDescription: "Sacred glacial lake at 12,313 ft with color-changing waters",
    images: [
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
      "https://images.unsplash.com/photo-1544735716-392fe2489ffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
    ],
    location: {
      address: "Tsomgo Lake, East Sikkim, Sikkim 737132",
      coordinates: { lat: 27.3639, lng: 88.7581 },
      city: "Gangtok",
      state: "Sikkim"
    },
    details: {
      timings: "8:00 AM - 4:00 PM",
      entryFee: "₹50 per person + vehicle charges",
      bestTimeToVisit: "May to October",
      duration: "Half day trip",
      difficulty: "Easy to moderate",
      amenities: ["Parking", "Food stalls", "Yak rides", "Souvenir shops", "Restrooms"]
    },
    highlights: [
      "Sacred glacial lake",
      "Color-changing waters",
      "Yak rides available",
      "Snow-capped mountain views",
      "High altitude experience"
    ],
    tips: [
      "Carry warm clothes",
      "Try yak rides",
      "Respect local customs",
      "Photography is allowed",
      "Can be combined with Nathula Pass"
    ],
    nearbyPlaces: ["Nathula Pass", "Baba Harbhajan Singh Temple", "Kupup Lake"],
    tags: ["glacial lake", "sacred", "yak rides", "high altitude", "color changing"],
    isOpen: true
  }
];

// Category mappings for filtering
export const categoryMappings = {
  "essentials": ["nathula-pass", "mg-marg", "gurudongmar-lake", "yumthang-valley", "buddha-park-ravangla"],
  "family-friendly": ["mg-marg", "buddha-park-ravangla", "hanuman-tok", "tsomgo-lake"],
  "hidden-gems": ["zero-point", "baba-harbhajan-singh-temple", "gurudongmar-lake"],
  "religious": ["buddha-park-ravangla", "hanuman-tok", "baba-harbhajan-singh-temple"],
  "outdoors": ["yumthang-valley", "zero-point", "gurudongmar-lake", "tsomgo-lake", "nathula-pass"],
  "history": ["nathula-pass", "baba-harbhajan-singh-temple"],
  "nature": ["gurudongmar-lake", "yumthang-valley", "zero-point", "tsomgo-lake"],
  "adventure": ["nathula-pass", "zero-point", "gurudongmar-lake", "yumthang-valley"]
};

// Function to get places by category
export const getPlacesByCategory = (category: string): PlaceDetail[] => {
  const placeIds = categoryMappings[category as keyof typeof categoryMappings] || [];
  return placeIds.map(id => sikkimPlaces.find(place => place.id === id)).filter(Boolean) as PlaceDetail[];
};

// Function to get place by ID
export const getPlaceById = (id: string): PlaceDetail | undefined => {
  return sikkimPlaces.find(place => place.id === id);
};

// Function to search places
export const searchPlaces = (query: string): PlaceDetail[] => {
  const lowercaseQuery = query.toLowerCase();
  return sikkimPlaces.filter(place => 
    place.name.toLowerCase().includes(lowercaseQuery) ||
    place.description.toLowerCase().includes(lowercaseQuery) ||
    place.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery)) ||
    place.category.toLowerCase().includes(lowercaseQuery)
  );
};

export default sikkimPlaces; 