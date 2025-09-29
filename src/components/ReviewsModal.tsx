import React, { useState, useEffect } from 'react';
import { Star, MapPin, Camera, MessageSquare, Lightbulb, Heart, Share2, Edit3, Trash2 } from 'lucide-react';
import ModalCloseButton from './ModalCloseButton';
import { pexelsService } from '../services/pexelsService';

interface Review {
  id: string;
  title: string;
  content: string;
  rating: number;
  location: string;
  date: string;
  photos: string[];
  likes: number;
  isLiked: boolean;
}

interface Tip {
  id: string;
  title: string;
  content: string;
  category: string;
  location: string;
  date: string;
  likes: number;
  isLiked: boolean;
}

interface Photo {
  id: string;
  url: string;
  caption: string;
  location: string;
  date: string;
  likes: number;
  isLiked: boolean;
}

interface ReviewsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ReviewsModal: React.FC<ReviewsModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'reviews' | 'tips' | 'photos'>('reviews');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [tips, setTips] = useState<Tip[]>([]);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Form states
  const [newReview, setNewReview] = useState({
    title: '',
    content: '',
    rating: 5,
    location: '',
    photos: [] as string[]
  });
  const [newTip, setNewTip] = useState({
    title: '',
    content: '',
    category: 'General',
    location: ''
  });
  const [newPhoto, setNewPhoto] = useState({
    caption: '',
    location: '',
    url: ''
  });

  // Load data from localStorage on component mount
  useEffect(() => {
    if (isOpen && !isLoading) {
      loadData();
    }
  }, [isOpen]); // Only depend on isOpen, not loadData

  const loadData = async () => {
    if (isLoading) return; // Prevent multiple simultaneous calls
    
    setIsLoading(true);
    try {
      // Load reviews
      const savedReviews = localStorage.getItem('toura-reviews');
      if (savedReviews) {
        setReviews(JSON.parse(savedReviews));
      } else {
        // Get contextually relevant images from Pexels
        let pexelsImages: { [key: string]: any[] } = {};
        try {
          pexelsImages = await pexelsService.getSikkimImages();
        } catch (error) {
          console.log('Using fallback images');
          pexelsImages = pexelsService.getFallbackImages();
        }

      // Initialize with pre-added reviews using Pexels images
      const sampleReviews: Review[] = [
        {
          id: '1',
          title: 'Rumtek Monastery',
          content: 'One of the largest monasteries in Sikkim with magnificent inside view. The terrace gives a breathtaking view of Gangtok with superb architecture.',
          rating: 5,
          location: 'Rumtek Monastery, Gangtok',
          date: '2024-01-15',
          photos: pexelsImages.monasteries?.slice(0, 2).map(photo => photo.src?.medium || photo) || [],
          likes: 24,
          isLiked: false
        },
        {
          id: '2',
          title: 'Yumthang Valley',
          content: 'Mind blowing view from 11600ft altitude. Snow blankets in winter; rhododendron bloom in spring. Truly paradise.',
          rating: 5,
          location: 'Yumthang Valley, North Sikkim',
          date: '2024-01-20',
          photos: pexelsImages.mountains?.slice(0, 2).map(photo => photo.src?.medium || photo) || [],
          likes: 31,
          isLiked: true
        },
        {
          id: '3',
          title: 'Zero Point',
          content: 'Zero Point — overpriced, touristy, small patch of snow, selfie crowds.',
          rating: 3,
          location: 'Zero Point, Yumthang Valley',
          date: '2024-01-18',
          photos: pexelsImages.mountains?.slice(0, 1).map(photo => photo.src?.medium || photo) || [],
          likes: 8,
          isLiked: false
        },
        {
          id: '4',
          title: 'Buddha Park',
          content: 'Huge golden Buddha, peaceful environment, panoramic mountain views.',
          rating: 4,
          location: 'Buddha Park, Ravangla',
          date: '2024-01-22',
          photos: pexelsImages.temples?.slice(0, 2).map(photo => photo.src?.medium || photo) || [],
          likes: 19,
          isLiked: true
        },
        {
          id: '5',
          title: 'Pemayangtse Monastery',
          content: 'One of the oldest monasteries in Sikkim, serene surroundings, ancient wall paintings.',
          rating: 5,
          location: 'Pemayangtse Monastery, Pelling',
          date: '2024-01-25',
          photos: pexelsImages.monasteries?.slice(0, 1).map(photo => photo.src?.medium || photo) || [],
          likes: 27,
          isLiked: false
        },
        {
          id: '6',
          title: 'Gurudongmar Lake',
          content: 'Sacred high-altitude lake at 17,800 ft. The crystal clear water and mountain backdrop is absolutely breathtaking.',
          rating: 5,
          location: 'Gurudongmar Lake, North Sikkim',
          date: '2024-01-28',
          photos: pexelsImages.lakes?.slice(0, 2).map(photo => photo.src?.medium || photo) || [],
          likes: 35,
          isLiked: true
        },
        {
          id: '7',
          title: 'Darjeeling Himalayan Railway',
          content: 'UNESCO World Heritage toy train ride through the mountains. The journey offers spectacular views and is a must-do experience.',
          rating: 4,
          location: 'Darjeeling Railway Station',
          date: '2024-01-30',
          photos: pexelsImages.sunrise?.slice(0, 1).map(photo => photo.src?.medium || photo) || [],
          likes: 23,
          isLiked: false
        },
        {
          id: '8',
          title: 'Local Food Experience',
          content: 'Tried authentic Sikkimese cuisine including momos, thukpa, and gundruk. The flavors were incredible and the hospitality was warm.',
          rating: 4,
          location: 'Local Restaurant, Gangtok',
          date: '2024-02-02',
          photos: pexelsImages.local_food?.slice(0, 2).map(photo => photo.src?.medium || photo) || [],
          likes: 18,
          isLiked: true
        }
      ];
      setReviews(sampleReviews);
      localStorage.setItem('toura-reviews', JSON.stringify(sampleReviews));
    }

    // Load tips
    const savedTips = localStorage.getItem('toura-tips');
    if (savedTips) {
      setTips(JSON.parse(savedTips));
    } else {
      const sampleTips: Tip[] = [
        {
          id: '1',
          title: 'Best Time to Visit Sikkim',
          content: 'The best time to visit Sikkim is from March to May and September to November. Avoid monsoon season (June-August) due to heavy rainfall and landslides.',
          category: 'Travel',
          location: 'Sikkim',
          date: '2024-01-20',
          likes: 15,
          isLiked: false
        },
        {
          id: '2',
          title: 'Local Food Recommendations',
          content: 'Must try: Momos, Thukpa, Gundruk, and Chhurpi. Visit local markets for authentic flavors and reasonable prices.',
          category: 'Food',
          location: 'Gangtok',
          date: '2024-01-18',
          likes: 22,
          isLiked: true
        },
        {
          id: '3',
          title: 'Monastery Visit Etiquette',
          content: 'When visiting monasteries, dress modestly, remove shoes before entering, and maintain silence. Photography is usually not allowed inside prayer halls.',
          category: 'Culture',
          location: 'Sikkim Monasteries',
          date: '2024-01-22',
          likes: 18,
          isLiked: false
        },
        {
          id: '4',
          title: 'Permit Requirements',
          content: 'For Nathula Pass, Gurudongmar Lake, and other restricted areas, you need special permits. Apply through registered tour operators at least 24 hours in advance.',
          category: 'Travel',
          location: 'North Sikkim',
          date: '2024-01-25',
          likes: 28,
          isLiked: true
        }
      ];
      setTips(sampleTips);
      localStorage.setItem('toura-tips', JSON.stringify(sampleTips));
    }

     // Load photos
     const savedPhotos = localStorage.getItem('toura-photos');
     if (savedPhotos) {
       setPhotos(JSON.parse(savedPhotos));
     } else {
       // Create comprehensive Sikkim photos from Pexels images
       const samplePhotos: Photo[] = [
         {
           id: '1',
           url: pexelsImages.sunrise?.[0]?.src?.medium || pexelsImages.mountains?.[0]?.src?.medium || 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop&q=80',
           caption: 'Breathtaking sunrise over Kanchenjunga from Tiger Hill',
           location: 'Tiger Hill, Darjeeling',
           date: '2024-01-25',
           likes: 45,
           isLiked: true
         },
         {
           id: '2',
           url: pexelsImages.monasteries?.[0]?.src?.medium || pexelsImages.temples?.[0]?.src?.medium || 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop&q=80',
           caption: 'Morning prayers at Rumtek Monastery - the seat of Karmapa',
           location: 'Rumtek Monastery, Gangtok',
           date: '2024-01-20',
           likes: 38,
           isLiked: false
         },
         {
           id: '3',
           url: pexelsImages.lakes?.[0]?.src?.medium || pexelsImages.nature?.[0]?.src?.medium || 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop&q=80',
           caption: 'Sacred Tsomgo Lake reflecting the Himalayan peaks',
           location: 'Tsomgo Lake, Sikkim',
           date: '2024-01-18',
           likes: 52,
           isLiked: true
         },
         {
           id: '4',
           url: pexelsImages.tea_gardens?.[0]?.src?.medium || pexelsImages.nature?.[1]?.src?.medium || 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop&q=80',
           caption: 'Rolling tea gardens of Darjeeling with mountain backdrop',
           location: 'Happy Valley Tea Estate, Darjeeling',
           date: '2024-01-15',
           likes: 29,
           isLiked: false
         },
         {
           id: '5',
           url: pexelsImages.local_food?.[0]?.src?.medium || pexelsImages.local_food?.[1]?.src?.medium || 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=800&h=600&fit=crop&q=80',
           caption: 'Authentic Sikkimese momos and thukpa at local eatery',
           location: 'Local Restaurant, Gangtok',
           date: '2024-01-12',
           likes: 23,
           isLiked: true
         },
         {
           id: '6',
           url: pexelsImages.mountains?.[1]?.src?.medium || pexelsImages.nature?.[2]?.src?.medium || 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&h=600&fit=crop&q=80',
           caption: 'Trekking trail to Gurudongmar Lake at 17,800 ft',
           location: 'North Sikkim',
           date: '2024-01-08',
           likes: 41,
           isLiked: false
         },
         {
           id: '7',
           url: pexelsImages.temples?.[1]?.src?.medium || pexelsImages.monasteries?.[1]?.src?.medium || 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop&q=80',
           caption: 'Golden Buddha statue at Buddha Park, Ravangla',
           location: 'Buddha Park, Ravangla',
           date: '2024-01-05',
           likes: 34,
           isLiked: true
         },
         {
           id: '8',
           url: pexelsImages.monasteries?.[2]?.src?.medium || pexelsImages.temples?.[2]?.src?.medium || 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop&q=80',
           caption: 'Ancient architecture of Pemayangtse Monastery',
           location: 'Pemayangtse Monastery, Pelling',
           date: '2024-01-02',
           likes: 28,
           isLiked: false
         },
         {
           id: '9',
           url: pexelsImages.lakes?.[1]?.src?.medium || pexelsImages.nature?.[3]?.src?.medium || 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop&q=80',
           caption: 'Yumthang Valley - Valley of Flowers in full bloom',
           location: 'Yumthang Valley, North Sikkim',
           date: '2024-01-30',
           likes: 47,
           isLiked: true
         },
         {
           id: '10',
           url: pexelsImages.mountains?.[2]?.src?.medium || pexelsImages.nature?.[4]?.src?.medium || 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&h=600&fit=crop&q=80',
           caption: 'Nathula Pass - Indo-China border at 14,140 ft',
           location: 'Nathula Pass, Sikkim',
           date: '2024-01-28',
           likes: 39,
           isLiked: false
         },
         {
           id: '11',
           url: pexelsImages.monasteries?.[3]?.src?.medium || pexelsImages.temples?.[3]?.src?.medium || 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop&q=80',
           caption: 'Enchey Monastery - peaceful retreat in Gangtok',
           location: 'Enchey Monastery, Gangtok',
           date: '2024-01-26',
           likes: 31,
           isLiked: true
         },
         {
           id: '12',
           url: pexelsImages.local_food?.[2]?.src?.medium || pexelsImages.local_food?.[3]?.src?.medium || 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=800&h=600&fit=crop&q=80',
           caption: 'Traditional Sikkimese cuisine - Gundruk and Chhurpi',
           location: 'Local Kitchen, Gangtok',
           date: '2024-01-24',
           likes: 26,
           isLiked: false
         },
         {
           id: '13',
           url: pexelsImages.sunrise?.[1]?.src?.medium || pexelsImages.mountains?.[3]?.src?.medium || 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop&q=80',
           caption: 'Golden hour at Kanchenjunga National Park',
           location: 'Kanchenjunga National Park, Sikkim',
           date: '2024-01-22',
           likes: 44,
           isLiked: true
         },
         {
           id: '14',
           url: pexelsImages.tea_gardens?.[1]?.src?.medium || pexelsImages.nature?.[5]?.src?.medium || 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop&q=80',
           caption: 'Tea plucking in the misty hills of Darjeeling',
           location: 'Darjeeling Tea Gardens',
           date: '2024-01-20',
           likes: 33,
           isLiked: false
         },
         {
           id: '15',
           url: pexelsImages.lakes?.[2]?.src?.medium || pexelsImages.nature?.[6]?.src?.medium || 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop&q=80',
           caption: 'Crystal clear waters of Gurudongmar Lake',
           location: 'Gurudongmar Lake, North Sikkim',
           date: '2024-01-18',
           likes: 51,
           isLiked: true
         }
       ];
       setPhotos(samplePhotos);
       localStorage.setItem('toura-photos', JSON.stringify(samplePhotos));
     }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveReviews = (newReviews: Review[]) => {
    setReviews(newReviews);
    localStorage.setItem('toura-reviews', JSON.stringify(newReviews));
  };

  const saveTips = (newTips: Tip[]) => {
    setTips(newTips);
    localStorage.setItem('toura-tips', JSON.stringify(newTips));
  };

  const savePhotos = (newPhotos: Photo[]) => {
    setPhotos(newPhotos);
    localStorage.setItem('toura-photos', JSON.stringify(newPhotos));
  };

  const handleCreateReview = () => {
    if (!newReview.title || !newReview.content) return;

    const review: Review = {
      id: Date.now().toString(),
      ...newReview,
      date: new Date().toISOString().split('T')[0],
      likes: 0,
      isLiked: false
    };

    const updatedReviews = [review, ...reviews];
    saveReviews(updatedReviews);
    setNewReview({ title: '', content: '', rating: 5, location: '', photos: [] });
    setShowCreateForm(false);
  };

  const handleCreateTip = () => {
    if (!newTip.title || !newTip.content) return;

    const tip: Tip = {
      id: Date.now().toString(),
      ...newTip,
      date: new Date().toISOString().split('T')[0],
      likes: 0,
      isLiked: false
    };

    const updatedTips = [tip, ...tips];
    saveTips(updatedTips);
    setNewTip({ title: '', content: '', category: 'General', location: '' });
    setShowCreateForm(false);
  };

  const handleCreatePhoto = () => {
    if (!newPhoto.caption || !newPhoto.url) return;

    const photo: Photo = {
      id: Date.now().toString(),
      ...newPhoto,
      date: new Date().toISOString().split('T')[0],
      likes: 0,
      isLiked: false
    };

    const updatedPhotos = [photo, ...photos];
    savePhotos(updatedPhotos);
    setNewPhoto({ caption: '', location: '', url: '' });
    setShowCreateForm(false);
  };

  const toggleLike = (type: 'review' | 'tip' | 'photo', id: string) => {
    if (type === 'review') {
      const updatedReviews = reviews.map(review =>
        review.id === id
          ? { ...review, isLiked: !review.isLiked, likes: review.isLiked ? review.likes - 1 : review.likes + 1 }
          : review
      );
      saveReviews(updatedReviews);
    } else if (type === 'tip') {
      const updatedTips = tips.map(tip =>
        tip.id === id
          ? { ...tip, isLiked: !tip.isLiked, likes: tip.isLiked ? tip.likes - 1 : tip.likes + 1 }
          : tip
      );
      saveTips(updatedTips);
    } else if (type === 'photo') {
      const updatedPhotos = photos.map(photo =>
        photo.id === id
          ? { ...photo, isLiked: !photo.isLiked, likes: photo.isLiked ? photo.likes - 1 : photo.likes + 1 }
          : photo
      );
      savePhotos(updatedPhotos);
    }
  };

  const deleteItem = (type: 'review' | 'tip' | 'photo', id: string) => {
    if (type === 'review') {
      const updatedReviews = reviews.filter(review => review.id !== id);
      saveReviews(updatedReviews);
    } else if (type === 'tip') {
      const updatedTips = tips.filter(tip => tip.id !== id);
      saveTips(updatedTips);
    } else if (type === 'photo') {
      const updatedPhotos = photos.filter(photo => photo.id !== id);
      savePhotos(updatedPhotos);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-6xl h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-4">
            <h2 className="text-2xl font-bold text-gray-900">Reviews & Tips</h2>
            <div className="flex space-x-1">
              <button
                onClick={() => setActiveTab('reviews')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === 'reviews' ? 'bg-orange-500 text-white' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Reviews
              </button>
              <button
                onClick={() => setActiveTab('tips')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === 'tips' ? 'bg-orange-500 text-white' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Tips
              </button>
              <button
                onClick={() => setActiveTab('photos')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === 'photos' ? 'bg-orange-500 text-white' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Photos
              </button>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowCreateForm(true)}
              className="px-4 py-2 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 transition-colors"
            >
              Create New
            </button>
            <ModalCloseButton onClick={onClose} />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'reviews' && (
            <div className="space-y-6">
              {reviews.map((review) => (
                <div key={review.id} className="bg-gray-50 rounded-xl p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{review.title}</h3>
                      <div className="flex items-center space-x-4 mb-3">
                        <div className="flex items-center space-x-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                            />
                          ))}
                        </div>
                        <div className="flex items-center text-gray-600">
                          <MapPin className="h-4 w-4 mr-1" />
                          <span className="text-sm">{review.location}</span>
                        </div>
                        <span className="text-sm text-gray-500">{review.date}</span>
                      </div>
                      <p className="text-gray-700 mb-4">{review.content}</p>
                      {review.photos.length > 0 && (
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-4">
                          {review.photos.map((photo, index) => (
                            <img
                              key={index}
                              src={photo}
                              alt={`Review photo ${index + 1}`}
                              className="w-full h-24 object-cover rounded-lg"
                            />
                          ))}
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => deleteItem('review', review.id)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => toggleLike('review', review.id)}
                      className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                        review.isLiked ? 'bg-red-50 text-red-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      <Heart className={`h-4 w-4 ${review.isLiked ? 'fill-current' : ''}`} />
                      <span>{review.likes}</span>
                    </button>
                    <button className="flex items-center space-x-2 px-3 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors">
                      <Share2 className="h-4 w-4" />
                      <span>Share</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'tips' && (
            <div className="space-y-6">
              {tips.map((tip) => (
                <div key={tip.id} className="bg-gray-50 rounded-xl p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{tip.title}</h3>
                        <span className="px-2 py-1 bg-orange-100 text-orange-600 text-xs font-medium rounded">
                          {tip.category}
                        </span>
                      </div>
                      <div className="flex items-center space-x-4 mb-3">
                        <div className="flex items-center text-gray-600">
                          <MapPin className="h-4 w-4 mr-1" />
                          <span className="text-sm">{tip.location}</span>
                        </div>
                        <span className="text-sm text-gray-500">{tip.date}</span>
                      </div>
                      <p className="text-gray-700">{tip.content}</p>
                    </div>
                    <button
                      onClick={() => deleteItem('tip', tip.id)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => toggleLike('tip', tip.id)}
                      className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                        tip.isLiked ? 'bg-red-50 text-red-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      <Heart className={`h-4 w-4 ${tip.isLiked ? 'fill-current' : ''}`} />
                      <span>{tip.likes}</span>
                    </button>
                    <button className="flex items-center space-x-2 px-3 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors">
                      <Share2 className="h-4 w-4" />
                      <span>Share</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'photos' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {photos.map((photo) => (
                <div key={photo.id} className="bg-gray-50 rounded-xl overflow-hidden">
                  <img
                    src={photo.url}
                    alt={photo.caption}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <p className="text-gray-900 font-medium mb-2">{photo.caption}</p>
                    <div className="flex items-center space-x-4 mb-3">
                      <div className="flex items-center text-gray-600">
                        <MapPin className="h-4 w-4 mr-1" />
                        <span className="text-sm">{photo.location}</span>
                      </div>
                      <span className="text-sm text-gray-500">{photo.date}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <button
                        onClick={() => toggleLike('photo', photo.id)}
                        className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                          photo.isLiked ? 'bg-red-50 text-red-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        <Heart className={`h-4 w-4 ${photo.isLiked ? 'fill-current' : ''}`} />
                        <span>{photo.likes}</span>
                      </button>
                      <button
                        onClick={() => deleteItem('photo', photo.id)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Create Form Modal */}
        {showCreateForm && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[300] flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold">
                    Create New {activeTab === 'reviews' ? 'Review' : activeTab === 'tips' ? 'Tip' : 'Photo'}
                  </h3>
                  <ModalCloseButton onClick={() => setShowCreateForm(false)} />
                </div>
              </div>

              <div className="p-6">
                {activeTab === 'reviews' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                      <input
                        type="text"
                        value={newReview.title}
                        onChange={(e) => setNewReview({ ...newReview, title: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        placeholder="Enter review title"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                      <div className="flex space-x-1">
                        {[...Array(5)].map((_, i) => (
                          <button
                            key={i}
                            onClick={() => setNewReview({ ...newReview, rating: i + 1 })}
                            className="p-1"
                          >
                            <Star
                              className={`h-6 w-6 ${i < newReview.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                      <input
                        type="text"
                        value={newReview.location}
                        onChange={(e) => setNewReview({ ...newReview, location: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        placeholder="Enter location"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
                      <textarea
                        value={newReview.content}
                        onChange={(e) => setNewReview({ ...newReview, content: e.target.value })}
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        placeholder="Write your review..."
                      />
                    </div>
                    <button
                      onClick={handleCreateReview}
                      className="w-full bg-orange-500 text-white py-3 rounded-lg font-medium hover:bg-orange-600 transition-colors"
                    >
                      Create Review
                    </button>
                  </div>
                )}

                {activeTab === 'tips' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                      <input
                        type="text"
                        value={newTip.title}
                        onChange={(e) => setNewTip({ ...newTip, title: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        placeholder="Enter tip title"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                      <select
                        value={newTip.category}
                        onChange={(e) => setNewTip({ ...newTip, category: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      >
                        <option value="General">General</option>
                        <option value="Travel">Travel</option>
                        <option value="Food">Food</option>
                        <option value="Accommodation">Accommodation</option>
                        <option value="Activities">Activities</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                      <input
                        type="text"
                        value={newTip.location}
                        onChange={(e) => setNewTip({ ...newTip, location: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        placeholder="Enter location"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
                      <textarea
                        value={newTip.content}
                        onChange={(e) => setNewTip({ ...newTip, content: e.target.value })}
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        placeholder="Share your tip..."
                      />
                    </div>
                    <button
                      onClick={handleCreateTip}
                      className="w-full bg-orange-500 text-white py-3 rounded-lg font-medium hover:bg-orange-600 transition-colors"
                    >
                      Share Tip
                    </button>
                  </div>
                )}

                {activeTab === 'photos' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Photo URL</label>
                      <input
                        type="url"
                        value={newPhoto.url}
                        onChange={(e) => setNewPhoto({ ...newPhoto, url: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        placeholder="Enter photo URL"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Caption</label>
                      <input
                        type="text"
                        value={newPhoto.caption}
                        onChange={(e) => setNewPhoto({ ...newPhoto, caption: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        placeholder="Enter photo caption"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                      <input
                        type="text"
                        value={newPhoto.location}
                        onChange={(e) => setNewPhoto({ ...newPhoto, location: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        placeholder="Enter location"
                      />
                    </div>
                    <button
                      onClick={handleCreatePhoto}
                      className="w-full bg-orange-500 text-white py-3 rounded-lg font-medium hover:bg-orange-600 transition-colors"
                    >
                      Post Photo
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewsModal;
