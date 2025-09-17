import React from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import Hero from './components/Hero';
import PopularDestinations from './components/PopularDestinations';
import TrendingHotels from './components/TrendingHotels';
import PopularRestaurants from './components/PopularRestaurants';
import ThingsToDo from './components/ThingsToDo';
import TravelStories from './components/TravelStories';
import Footer from './components/Footer';
import Chatbot from './components/Chatbot';
import ThemeToggle from './components/ThemeToggle';

function App() {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-white dark:bg-black transition-colors duration-300">
        <Hero />
        <PopularDestinations />
        <TrendingHotels />
        <PopularRestaurants />
        <ThingsToDo />
        <TravelStories />
        <Footer />
        <Chatbot />
        <ThemeToggle />
      </div>
    </ThemeProvider>
  );
}

export default App;