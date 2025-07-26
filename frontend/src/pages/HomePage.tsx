import React from 'react';
import HeroSection from '../components/home/HeroSection';
import PredictedStocksSection from '../components/home/PredictedStocksSection';
import LiveNewsSection from '../components/home/LiveNewsSection';
import FeaturesSection from '../components/home/FeaturesSection';

const HomePage: React.FC = () => {
  return (
    <div className="animate-fade-in">
      <HeroSection />
      <FeaturesSection />
      <PredictedStocksSection />
      <LiveNewsSection />
    </div>
  );
};

export default HomePage;