import React from 'react';
import Hero from './components/Hero';
import PopularDestinations from './components/PopularDestinations';
import TrendingHotels from './components/TrendingHotels';
import PopularRestaurants from './components/PopularRestaurants';
import ThingsToDo from './components/ThingsToDo';
import TravelStories from './components/TravelStories';
import Footer from './components/Footer';
import Chatbot from './components/Chatbot';
 

function App() {
  return (
      <div className="min-h-screen bg-white transition-colors duration-300">
        <Hero />
        <PopularDestinations />
        <TrendingHotels />
        <PopularRestaurants />
        <ThingsToDo />
        <TravelStories />
        <Footer />
        <Chatbot />
      </div>
  );
}

export default App;