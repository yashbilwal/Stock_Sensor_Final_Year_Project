import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, TrendingUp, User, LogIn, Sparkles } from 'lucide-react';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const scrollToPredictedStocks = () => {
    if (location.pathname !== '/') {
      // If not on home page, navigate to home first
      window.location.href = '/#predicted-stocks';
    } else {
      // If on home page, scroll to section
      const element = document.getElementById('predicted-stocks');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
    setIsMenuOpen(false);
  };

  const navItems = [
    { path: '/', label: 'Home', type: 'link' },
    { path: '#predicted-stocks', label: 'Predicted Stocks', type: 'scroll', action: scrollToPredictedStocks },
    { path: '/about', label: 'About', type: 'link' },
    { path: '/contact', label: 'Contact Us', type: 'link' },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-galaxy-900/95 backdrop-blur-xl border-b border-galaxy-700/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="relative">
              <div className="absolute -inset-1 bg-cosmic-gradient rounded-lg blur opacity-25 group-hover:opacity-50 transition duration-300"></div>
              <div className="relative p-2 bg-galaxy-800 rounded-lg group-hover:bg-galaxy-700 transition-colors">
                <TrendingUp className="h-6 w-6 text-cosmic-cyan" />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-xl font-bold text-white group-hover:text-cosmic-cyan transition-colors">
                Stock Sensing
              </span>
              <Sparkles className="h-4 w-4 text-cosmic-purple animate-pulse" />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              item.type === 'link' ? (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive(item.path)
                      ? 'text-cosmic-cyan bg-galaxy-800 shadow-lg'
                      : 'text-galaxy-300 hover:text-white hover:bg-galaxy-800/50'
                  }`}
                >
                  {item.label}
                </Link>
              ) : (
                <button
                  key={item.path}
                  onClick={item.action}
                  className="px-4 py-2 rounded-lg text-sm font-medium text-galaxy-300 hover:text-white hover:bg-galaxy-800/50 transition-all"
                >
                  {item.label}
                </button>
              )
            ))}
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              to="/login"
              className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-galaxy-300 hover:text-white transition-colors"
            >
              <LogIn className="h-4 w-4" />
              <span>Sign In</span>
            </Link>
            <Link
              to="/signup"
              className="group relative flex items-center space-x-2 px-6 py-2 bg-gradient-to-r from-cosmic-purple to-cosmic-pink text-white rounded-lg hover:from-cosmic-pink hover:to-cosmic-purple transition-all transform hover:scale-105 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-cosmic-purple/20 to-cosmic-pink/20 animate-pulse"></div>
              <User className="relative h-4 w-4" />
              <span className="relative">Sign Up</span>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-lg text-galaxy-300 hover:text-white hover:bg-galaxy-800/50 transition-colors"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-galaxy-700/50 py-4 space-y-2 bg-galaxy-900/95 backdrop-blur-xl">
            {navItems.map((item) => (
              item.type === 'link' ? (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`block px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                    isActive(item.path)
                      ? 'text-cosmic-cyan bg-galaxy-800'
                      : 'text-galaxy-300 hover:text-white hover:bg-galaxy-800/50'
                  }`}
                >
                  {item.label}
                </Link>
              ) : (
                <button
                  key={item.path}
                  onClick={item.action}
                  className="block w-full text-left px-4 py-3 rounded-lg text-sm font-medium text-galaxy-300 hover:text-white hover:bg-galaxy-800/50 transition-all"
                >
                  {item.label}
                </button>
              )
            ))}
            <div className="pt-4 border-t border-galaxy-700/50 space-y-2">
              <Link
                to="/login"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center space-x-2 px-4 py-3 text-sm font-medium text-galaxy-300 hover:text-white transition-colors"
              >
                <LogIn className="h-4 w-4" />
                <span>Sign In</span>
              </Link>
              <Link
                to="/signup"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center space-x-2 px-4 py-3 bg-gradient-to-r from-cosmic-purple to-cosmic-pink text-white rounded-lg hover:from-cosmic-pink hover:to-cosmic-purple transition-all"
              >
                <User className="h-4 w-4" />
                <span>Sign Up</span>
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;