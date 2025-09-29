export interface MonasteryManuscript {
  id: string;
  title: string;
  language: string;
  period: string;
  description: string;
  excerpt: string;
  digitizedUrl?: string;
  significance: string;
  category: 'scripture' | 'philosophy' | 'history' | 'medicine' | 'astronomy';
}

export interface MonasteryFestival {
  id: string;
  name: string;
  date: string;
  description: string;
  significance: string;
  activities: string[];
  duration: string;
  specialRituals: string[];
}

export interface SpiritualRoute {
  id: string;
  name: string;
  description: string;
  duration: string;
  difficulty: 'easy' | 'moderate' | 'challenging';
  monasteries: string[];
  highlights: string[];
  bestTime: string;
  distance: string;
}

export interface MonasteryHeritage {
  id: string;
  name: string;
  location: string;
  coordinates: { lat: number; lng: number };
  established: string;
  lineage: string;
  architecturalStyle: string;
  heritageStatus: 'UNESCO' | 'National' | 'State' | 'Local';
  conservationStatus: 'Excellent' | 'Good' | 'Fair' | 'Poor';
  timings: {
    opening: string;
    closing: string;
    specialDays: string[];
  };
  entryFees: {
    adults: number;
    children: number;
    students: number;
    foreigners: number;
  };
  history: string;
  culturalSignificance: string;
  architecturalDetails: string;
  currentAbbot: string;
  monkCount: number;
  manuscripts: MonasteryManuscript[];
  festivals: MonasteryFestival[];
  nearbyMonasteries: string[];
  spiritualRoutes: string[];
  conservationEfforts: string[];
  visitingGuidelines: string[];
  photographyRules: string[];
  dressCode: string[];
  specialFeatures: string[];
  contactInfo: {
    phone?: string;
    email?: string;
    website?: string;
  };
  images: string[];
  virtualTour?: string;
}

export const monasteryDatabase: MonasteryHeritage[] = [
  {
    id: 'rumtek-monastery',
    name: 'Rumtek Monastery',
    location: 'Rumtek, Gangtok, Sikkim',
    coordinates: { lat: 27.3389, lng: 88.6065 },
    established: '1960s',
    lineage: 'Karma Kagyu',
    architecturalStyle: 'Tibetan Buddhist',
    heritageStatus: 'National',
    conservationStatus: 'Excellent',
    timings: {
      opening: '6:00 AM',
      closing: '6:00 PM',
      specialDays: ['Full Moon Days', 'Religious Festivals']
    },
    entryFees: {
      adults: 50,
      children: 25,
      students: 30,
      foreigners: 200
    },
    history: 'Rumtek Monastery, also known as the Dharma Chakra Centre, is the largest monastery in Sikkim. It was built in the 1960s as the seat of the Karmapa, the head of the Karma Kagyu school of Tibetan Buddhism. The monastery houses precious relics and serves as a major center for Buddhist learning.',
    culturalSignificance: 'Rumtek is considered one of the most important monasteries outside Tibet. It serves as the seat of the Karmapa and is a major pilgrimage destination for Buddhists worldwide. The monastery plays a crucial role in preserving Tibetan Buddhist culture and teachings.',
    architecturalDetails: 'The monastery features traditional Tibetan architecture with intricate murals, golden roofs, and prayer wheels. The main prayer hall can accommodate over 1000 monks and features elaborate thangka paintings and statues.',
    currentAbbot: 'His Holiness the 17th Karmapa',
    monkCount: 150,
    manuscripts: [
      {
        id: 'rumtek-1',
        title: 'The Life of Milarepa',
        language: 'Tibetan',
        period: '11th Century',
        description: 'Biography of the great Tibetan yogi Milarepa',
        excerpt: 'In the snow mountains of Tibet, there lived a yogi who achieved enlightenment in one lifetime...',
        significance: 'One of the most important texts in Tibetan Buddhism, teaching the path of meditation and enlightenment.',
        category: 'philosophy'
      },
      {
        id: 'rumtek-2',
        title: 'The Heart Sutra Commentary',
        language: 'Sanskrit-Tibetan',
        period: '8th Century',
        description: 'Detailed commentary on the Heart Sutra by various masters',
        excerpt: 'Form is emptiness, emptiness is form...',
        significance: 'Core teaching of Mahayana Buddhism on the nature of reality.',
        category: 'scripture'
      }
    ],
    festivals: [
      {
        id: 'rumtek-losar',
        name: 'Losar (Tibetan New Year)',
        date: 'February-March',
        description: 'Tibetan New Year celebration with traditional rituals and prayers',
        significance: 'Most important festival marking the beginning of the Tibetan calendar year',
        activities: ['Prayer ceremonies', 'Mask dances', 'Traditional music', 'Feast preparation'],
        duration: '15 days',
        specialRituals: ['Butter lamp offerings', 'Prayer flag raising', 'Monk debates']
      },
      {
        id: 'rumtek-saga-dawa',
        name: 'Saga Dawa',
        date: 'May-June',
        description: 'Celebration of Buddha\'s birth, enlightenment, and parinirvana',
        significance: 'Triple celebration of the most important events in Buddha\'s life',
        activities: ['Circumambulation', 'Prayer ceremonies', 'Merit-making activities'],
        duration: '1 month',
        specialRituals: ['Prostration', 'Prayer wheel turning', 'Alms giving']
      }
    ],
    nearbyMonasteries: ['Enchey Monastery', 'Pemayangtse Monastery', 'Tashiding Monastery'],
    spiritualRoutes: ['Gangtok Monastery Circuit', 'Sikkim Pilgrimage Trail'],
    conservationEfforts: [
      'Regular restoration of murals and paintings',
      'Digital preservation of manuscripts',
      'Monk training in conservation techniques',
      'International collaboration for heritage preservation'
    ],
    visitingGuidelines: [
      'Remove shoes before entering prayer halls',
      'Maintain silence during prayer sessions',
      'Do not point feet towards Buddha statues',
      'Ask permission before taking photographs'
    ],
    photographyRules: [
      'Photography allowed in outer courtyards only',
      'No photography in main prayer hall',
      'Respectful distance from monks during prayers',
      'No flash photography'
    ],
    dressCode: [
      'Modest clothing required',
      'Cover shoulders and knees',
      'Remove hats and shoes',
      'No revealing clothing'
    ],
    specialFeatures: [
      'Golden stupa containing relics',
      'Extensive library of Buddhist texts',
      'Traditional thangka painting school',
      'Monk debate sessions open to public'
    ],
    contactInfo: {
      phone: '+91-3592-XXXXXX',
      email: 'info@rumtekmonastery.org'
    },
    images: [
      '/images/monasteries/rumtek1.png',
      '/images/monasteries/rumtek2.png',
      '/images/monasteries/rumtek3.png'
    ],
    virtualTour: 'https://rumtek-monastery-tour.com'
  },
  {
    id: 'enchey-monastery',
    name: 'Enchey Monastery',
    location: 'Gangtok, Sikkim',
    coordinates: { lat: 27.3389, lng: 88.6065 },
    established: '1909',
    lineage: 'Nyingma',
    architecturalStyle: 'Traditional Sikkimese',
    heritageStatus: 'State',
    conservationStatus: 'Good',
    timings: {
      opening: '5:00 AM',
      closing: '7:00 PM',
      specialDays: ['Full Moon Days', 'Religious Festivals']
    },
    entryFees: {
      adults: 30,
      children: 15,
      students: 20,
      foreigners: 100
    },
    history: 'Enchey Monastery was built in 1909 and belongs to the Nyingma school of Tibetan Buddhism. The monastery is known for its annual Chaam (mask dance) festival and houses important Buddhist texts and artifacts.',
    culturalSignificance: 'Enchey Monastery is one of the most important monasteries in Sikkim and plays a vital role in preserving Nyingma traditions. It is particularly known for its annual Chaam festival which attracts thousands of devotees.',
    architecturalDetails: 'The monastery features traditional Sikkimese architecture with colorful murals, prayer wheels, and a beautiful garden. The main prayer hall contains ancient thangkas and statues.',
    currentAbbot: 'Lama Tashi',
    monkCount: 45,
    manuscripts: [
      {
        id: 'enchey-1',
        title: 'The Tibetan Book of the Dead',
        language: 'Tibetan',
        period: '8th Century',
        description: 'Guide for the deceased through the bardo states',
        excerpt: 'O nobly born, listen carefully...',
        significance: 'Essential text for understanding Tibetan Buddhist views on death and rebirth.',
        category: 'philosophy'
      }
    ],
    festivals: [
      {
        id: 'enchey-chaam',
        name: 'Chaam Festival',
        date: 'December-January',
        description: 'Traditional mask dance festival',
        significance: 'Celebration of Buddhist teachings through dance and music',
        activities: ['Mask dances', 'Traditional music', 'Prayer ceremonies'],
        duration: '3 days',
        specialRituals: ['Mask dance performances', 'Blessing ceremonies', 'Community feasts']
      }
    ],
    nearbyMonasteries: ['Rumtek Monastery', 'Pemayangtse Monastery'],
    spiritualRoutes: ['Gangtok Monastery Circuit'],
    conservationEfforts: [
      'Regular maintenance of traditional architecture',
      'Preservation of ancient texts',
      'Training of young monks in traditional arts'
    ],
    visitingGuidelines: [
      'Respectful behavior required',
      'No loud conversations',
      'Follow dress code guidelines'
    ],
    photographyRules: [
      'Photography allowed in designated areas',
      'No photography during prayer sessions'
    ],
    dressCode: [
      'Modest clothing',
      'Remove shoes in prayer halls'
    ],
    specialFeatures: [
      'Annual Chaam festival',
      'Traditional mask dance performances',
      'Ancient thangka collection'
    ],
    contactInfo: {
      phone: '+91-3592-XXXXXX'
    },
    images: [
      '/images/monasteries/enchey1.png',
      '/images/monasteries/enchey2.png'
    ]
  },
  {
    id: 'pemayangtse-monastery',
    name: 'Pemayangtse Monastery',
    location: 'Pelling, West Sikkim',
    coordinates: { lat: 27.3389, lng: 88.6065 },
    established: '1705',
    lineage: 'Nyingma',
    architecturalStyle: 'Traditional Tibetan',
    heritageStatus: 'National',
    conservationStatus: 'Excellent',
    timings: {
      opening: '6:00 AM',
      closing: '6:00 PM',
      specialDays: ['Full Moon Days', 'Religious Festivals']
    },
    entryFees: {
      adults: 40,
      children: 20,
      students: 25,
      foreigners: 150
    },
    history: 'Pemayangtse Monastery, founded in 1705, is one of the oldest and most important monasteries in Sikkim. It belongs to the Nyingma school and is known for its ancient architecture and religious significance.',
    culturalSignificance: 'Pemayangtse Monastery is considered one of the most sacred monasteries in Sikkim. It houses ancient Buddhist texts and serves as an important center for Buddhist learning and practice.',
    architecturalDetails: 'The monastery features traditional Tibetan architecture with intricate wood carvings, colorful murals, and ancient statues. The main prayer hall contains rare Buddhist artifacts and texts.',
    currentAbbot: 'Lama Tenzin',
    monkCount: 80,
    manuscripts: [
      {
        id: 'pemayangtse-1',
        title: 'The Great Perfection Teachings',
        language: 'Tibetan',
        period: '8th Century',
        description: 'Core teachings of Dzogchen practice',
        excerpt: 'The nature of mind is like space...',
        significance: 'Fundamental text for understanding Dzogchen meditation practice.',
        category: 'philosophy'
      }
    ],
    festivals: [
      {
        id: 'pemayangtse-losar',
        name: 'Losar Festival',
        date: 'February-March',
        description: 'Tibetan New Year celebration',
        significance: 'Celebration of the new year with traditional rituals',
        activities: ['Prayer ceremonies', 'Traditional dances', 'Community feasts'],
        duration: '7 days',
        specialRituals: ['Butter sculpture offerings', 'Prayer flag ceremonies']
      }
    ],
    nearbyMonasteries: ['Rumtek Monastery', 'Enchey Monastery', 'Tashiding Monastery'],
    spiritualRoutes: ['West Sikkim Monastery Trail', 'Sikkim Pilgrimage Circuit'],
    conservationEfforts: [
      'UNESCO World Heritage Site nomination',
      'International conservation partnerships',
      'Digital archiving of manuscripts',
      'Traditional building techniques preservation'
    ],
    visitingGuidelines: [
      'Advance booking recommended',
      'Guided tours available',
      'Respectful behavior required'
    ],
    photographyRules: [
      'Photography allowed with permission',
      'No flash photography',
      'Respectful distance from religious objects'
    ],
    dressCode: [
      'Traditional or modest clothing',
      'Remove shoes in prayer halls',
      'Cover head during prayers'
    ],
    specialFeatures: [
      'Ancient Buddhist texts collection',
      'Traditional thangka painting school',
      'Monk debate sessions',
      'Heritage architecture'
    ],
    contactInfo: {
      phone: '+91-3592-XXXXXX',
      email: 'info@pemayangtse.org'
    },
    images: [
      '/images/monasteries/pemayangtse1.png',
      '/images/monasteries/pemayangtse2.png',
      '/images/monasteries/pemayangtse3.png'
    ]
  }
];

export const spiritualRoutes: SpiritualRoute[] = [
  {
    id: 'gangtok-circuit',
    name: 'Gangtok Monastery Circuit',
    description: 'A spiritual journey through the major monasteries around Gangtok',
    duration: '2-3 days',
    difficulty: 'easy',
    monasteries: ['Rumtek Monastery', 'Enchey Monastery'],
    highlights: [
      'Rumtek Monastery - Seat of the Karmapa',
      'Enchey Monastery - Traditional Nyingma center',
      'Beautiful mountain views',
      'Traditional prayer ceremonies'
    ],
    bestTime: 'March to May, September to November',
    distance: '50 km'
  },
  {
    id: 'west-sikkim-trail',
    name: 'West Sikkim Monastery Trail',
    description: 'Explore the ancient monasteries of West Sikkim',
    duration: '4-5 days',
    difficulty: 'moderate',
    monasteries: ['Pemayangtse Monastery', 'Tashiding Monastery'],
    highlights: [
      'Pemayangtse Monastery - Ancient Nyingma center',
      'Tashiding Monastery - Sacred pilgrimage site',
      'Kanchenjunga views',
      'Traditional village life'
    ],
    bestTime: 'October to April',
    distance: '120 km'
  },
  {
    id: 'sikkim-pilgrimage',
    name: 'Sikkim Pilgrimage Circuit',
    description: 'Complete pilgrimage through all major monasteries of Sikkim',
    duration: '7-10 days',
    difficulty: 'challenging',
    monasteries: ['Rumtek Monastery', 'Enchey Monastery', 'Pemayangtse Monastery', 'Tashiding Monastery'],
    highlights: [
      'All major monasteries of Sikkim',
      'Spiritual transformation journey',
      'Cultural immersion',
      'Mountain trekking experience'
    ],
    bestTime: 'March to May, September to November',
    distance: '300 km'
  }
];

export class MonasteryService {
  static getAllMonasteries(): MonasteryHeritage[] {
    return monasteryDatabase;
  }

  static getMonasteryById(id: string): MonasteryHeritage | undefined {
    return monasteryDatabase.find(monastery => monastery.id === id);
  }

  static searchMonasteries(query: string): MonasteryHeritage[] {
    const searchTerm = query.toLowerCase();
    return monasteryDatabase.filter(monastery =>
      monastery.name.toLowerCase().includes(searchTerm) ||
      monastery.location.toLowerCase().includes(searchTerm) ||
      monastery.lineage.toLowerCase().includes(searchTerm) ||
      monastery.architecturalStyle.toLowerCase().includes(searchTerm)
    );
  }

  static getMonasteriesByLineage(lineage: string): MonasteryHeritage[] {
    return monasteryDatabase.filter(monastery => 
      monastery.lineage.toLowerCase().includes(lineage.toLowerCase())
    );
  }

  static getMonasteriesByHeritageStatus(status: string): MonasteryHeritage[] {
    return monasteryDatabase.filter(monastery => monastery.heritageStatus === status);
  }

  static getSpiritualRoutes(): SpiritualRoute[] {
    return spiritualRoutes;
  }

  static getRouteById(id: string): SpiritualRoute | undefined {
    return spiritualRoutes.find(route => route.id === id);
  }

  static getManuscriptsByMonastery(monasteryId: string): MonasteryManuscript[] {
    const monastery = this.getMonasteryById(monasteryId);
    return monastery?.manuscripts || [];
  }

  static getFestivalsByMonastery(monasteryId: string): MonasteryFestival[] {
    const monastery = this.getMonasteryById(monasteryId);
    return monastery?.festivals || [];
  }
}