import React from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, Linkedin, Twitter, Youtube, Mail, Phone, MapPin, Sparkles, Star } from 'lucide-react';

const Footer: React.FC = () => {
  const scrollToPredictedStocks = () => {
    const element = document.getElementById('predicted-stocks');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="relative bg-galaxy-950 text-white overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 animate-twinkle">
          <Star className="h-3 w-3 text-cosmic-purple opacity-40" fill="currentColor" />
        </div>
        <div className="absolute top-20 right-20 animate-twinkle" style={{ animationDelay: '1s' }}>
          <Star className="h-2 w-2 text-cosmic-cyan opacity-60" fill="currentColor" />
        </div>
        <div className="absolute bottom-20 left-32 animate-twinkle" style={{ animationDelay: '2s' }}>
          <Star className="h-4 w-4 text-cosmic-pink opacity-30" fill="currentColor" />
        </div>
        <div className="absolute top-32 left-1/3 animate-twinkle" style={{ animationDelay: '0.5s' }}>
          <Star className="h-2 w-2 text-cosmic-blue opacity-50" fill="currentColor" />
        </div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="absolute -inset-1 bg-cosmic-gradient rounded-lg blur opacity-25"></div>
                <div className="relative p-2 bg-galaxy-800 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-cosmic-cyan" />
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-xl font-bold">Stock Sensing</span>
                <Sparkles className="h-4 w-4 text-cosmic-purple animate-pulse" />
              </div>
            </div>
            <p className="text-galaxy-400 text-sm leading-relaxed">
              AI-powered stock predictions with comprehensive market analysis. 
              Discover stocks with potential 5-10% returns in 5-10 days using advanced algorithms.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="group relative p-2 bg-galaxy-800/50 rounded-lg hover:bg-galaxy-700 transition-colors">
                <div className="absolute -inset-1 bg-cosmic-gradient rounded-lg blur opacity-0 group-hover:opacity-25 transition duration-300"></div>
                <Linkedin className="relative h-5 w-5 text-galaxy-400 group-hover:text-cosmic-cyan transition-colors" />
              </a>
              <a href="#" className="group relative p-2 bg-galaxy-800/50 rounded-lg hover:bg-galaxy-700 transition-colors">
                <div className="absolute -inset-1 bg-cosmic-gradient rounded-lg blur opacity-0 group-hover:opacity-25 transition duration-300"></div>
                <Twitter className="relative h-5 w-5 text-galaxy-400 group-hover:text-cosmic-purple transition-colors" />
              </a>
              <a href="#" className="group relative p-2 bg-galaxy-800/50 rounded-lg hover:bg-galaxy-700 transition-colors">
                <div className="absolute -inset-1 bg-cosmic-gradient rounded-lg blur opacity-0 group-hover:opacity-25 transition duration-300"></div>
                <Youtube className="relative h-5 w-5 text-galaxy-400 group-hover:text-cosmic-pink transition-colors" />
              </a>
            </div>
          </div>

          {/* About Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-cosmic-cyan">About</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link to="/about" className="text-galaxy-400 hover:text-white transition-colors hover:translate-x-1 transform inline-block">
                  Our Story
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-galaxy-400 hover:text-white transition-colors hover:translate-x-1 transform inline-block">
                  How It Works
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-galaxy-400 hover:text-white transition-colors hover:translate-x-1 transform inline-block">
                  Methodology
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-galaxy-400 hover:text-white transition-colors hover:translate-x-1 transform inline-block">
                  Success Stories
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-cosmic-purple">Resources</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <button 
                  onClick={scrollToPredictedStocks}
                  className="text-galaxy-400 hover:text-white transition-colors text-left hover:translate-x-1 transform inline-block"
                >
                  Stock Predictions
                </button>
              </li>
              <li>
                <a href="#" className="text-galaxy-400 hover:text-white transition-colors hover:translate-x-1 transform inline-block">
                  Market Insights
                </a>
              </li>
              <li>
                <a href="#" className="text-galaxy-400 hover:text-white transition-colors hover:translate-x-1 transform inline-block">
                  Trading Guide
                </a>
              </li>
              <li>
                <a href="#" className="text-galaxy-400 hover:text-white transition-colors hover:translate-x-1 transform inline-block">
                  Risk Management
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-cosmic-pink">Contact</h3>
            <div className="space-y-4 text-sm">
              <div className="flex items-center space-x-3 group">
                <div className="p-2 bg-galaxy-800/50 rounded-lg group-hover:bg-galaxy-700 transition-colors">
                  <Mail className="h-4 w-4 text-cosmic-cyan" />
                </div>
                <span className="text-galaxy-400 group-hover:text-white transition-colors">support@stocksensing.com</span>
              </div>
              <div className="flex items-center space-x-3 group">
                <div className="p-2 bg-galaxy-800/50 rounded-lg group-hover:bg-galaxy-700 transition-colors">
                  <Phone className="h-4 w-4 text-cosmic-purple" />
                </div>
                <span className="text-galaxy-400 group-hover:text-white transition-colors">+91 98765 43210</span>
              </div>
              <div className="flex items-center space-x-3 group">
                <div className="p-2 bg-galaxy-800/50 rounded-lg group-hover:bg-galaxy-700 transition-colors">
                  <MapPin className="h-4 w-4 text-cosmic-pink" />
                </div>
                <span className="text-galaxy-400 group-hover:text-white transition-colors">Mumbai, India</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-galaxy-800 mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center">
          <div className="text-sm text-galaxy-400">
            © 2025 Stock Sensing. All rights reserved.
          </div>
          <div className="flex space-x-6 mt-4 sm:mt-0">
            <Link to="#" className="text-sm text-galaxy-400 hover:text-white transition-colors">
              Terms of Service
            </Link>
            <Link to="#" className="text-sm text-galaxy-400 hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link to="#" className="text-sm text-galaxy-400 hover:text-white transition-colors">
              Disclaimer
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;