import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, TrendingUp, BarChart3, PieChart, ArrowRight, Star, Sparkles, Zap, Target } from 'lucide-react';

const HeroSection: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const navigate = useNavigate();

  const mockStocks = ['TCS', 'INFY', 'RELIANCE', 'HDFC', 'ICICI', 'SBI', 'WIPRO', 'BHARTIARTL', 'MARUTI', 'HDFCBANK'];

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.length > 0) {
      const filtered = mockStocks.filter(stock => 
        stock.toLowerCase().includes(query.toLowerCase())
      );
      setSuggestions(filtered.slice(0, 5));
    } else {
      setSuggestions([]);
    }
  };

  const handleStockSelect = (stock: string) => {
    setSearchQuery(stock);
    setSuggestions([]);
    navigate(`/stock/${stock}`);
  };

  const handleAnalyze = () => {
    if (searchQuery.trim()) {
      navigate(`/stock/${searchQuery.trim().toUpperCase()}`);
    }
  };

  return (
    <section className="relative bg-gradient-to-br from-galaxy-950 via-galaxy-900 to-galaxy-800 text-white overflow-hidden min-h-screen flex items-center">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        {/* Floating Particles */}
        <div className="absolute top-20 left-20 animate-twinkle">
          <div className="w-2 h-2 bg-cosmic-purple rounded-full opacity-60"></div>
        </div>
        <div className="absolute top-40 right-32 animate-twinkle" style={{ animationDelay: '1s' }}>
          <div className="w-1 h-1 bg-cosmic-cyan rounded-full opacity-80"></div>
        </div>
        <div className="absolute bottom-32 left-16 animate-twinkle" style={{ animationDelay: '2s' }}>
          <div className="w-3 h-3 bg-cosmic-pink rounded-full opacity-40"></div>
        </div>
        <div className="absolute top-60 left-1/3 animate-twinkle" style={{ animationDelay: '0.5s' }}>
          <div className="w-1 h-1 bg-cosmic-blue rounded-full opacity-90"></div>
        </div>
        <div className="absolute bottom-20 right-20 animate-twinkle" style={{ animationDelay: '1.5s' }}>
          <div className="w-4 h-4 bg-cosmic-purple rounded-full opacity-30"></div>
        </div>

        {/* Floating Chart Icons */}
        <div className="absolute top-32 left-32 animate-float opacity-10">
          <TrendingUp className="h-32 w-32 text-cosmic-purple" />
        </div>
        <div className="absolute top-48 right-24 animate-float opacity-10" style={{ animationDelay: '2s' }}>
          <BarChart3 className="h-28 w-28 text-cosmic-cyan" />
        </div>
        <div className="absolute bottom-40 left-48 animate-float opacity-10" style={{ animationDelay: '4s' }}>
          <PieChart className="h-36 w-36 text-cosmic-blue" />
        </div>

        {/* Gradient Overlays */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-cosmic-purple/5 via-transparent to-cosmic-cyan/5"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent via-cosmic-pink/5 to-transparent"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32 z-10">
        <div className="text-center space-y-12">
          {/* Main Heading */}
          <div className="space-y-8">
            <div className="flex items-center justify-center space-x-3 mb-6">
              <div className="p-2 bg-cosmic-purple/20 rounded-full animate-pulse">
                <Zap className="h-6 w-6 text-cosmic-purple" />
              </div>
              <span className="text-cosmic-cyan font-bold text-xl tracking-wider uppercase">AI-Powered Predictions</span>
              <div className="p-2 bg-cosmic-pink/20 rounded-full animate-pulse">
                <Target className="h-6 w-6 text-cosmic-pink" />
              </div>
            </div>
            
            <h1 className="text-6xl md:text-8xl font-black leading-tight">
              <span className="block text-white drop-shadow-2xl">Smart Stock</span>
              <span className="block bg-gradient-to-r from-cosmic-purple via-cosmic-cyan to-cosmic-pink bg-clip-text text-transparent animate-glow drop-shadow-2xl">
                Intelligence
              </span>
            </h1>
            
            <p className="text-2xl md:text-3xl text-galaxy-200 max-w-5xl mx-auto leading-relaxed font-light">
              Discover stocks with <span className="text-cosmic-cyan font-bold text-3xl">5–10% returns</span> in 
              <span className="text-cosmic-purple font-bold text-3xl"> 5–10 days</span> using cutting-edge AI and market intelligence.
            </p>
          </div>

          {/* Search Section */}
          <div className="max-w-3xl mx-auto space-y-8">
            <div className="relative group">
              <div className="absolute -inset-2 bg-gradient-to-r from-cosmic-purple via-cosmic-cyan to-cosmic-pink rounded-3xl blur-lg opacity-30 group-hover:opacity-50 transition duration-1000 animate-pulse"></div>
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-cosmic-purple/20 via-cosmic-cyan/20 to-cosmic-pink/20 rounded-2xl blur"></div>
                <div className="relative bg-galaxy-800/80 backdrop-blur-xl border border-galaxy-600/50 rounded-2xl p-2">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 pl-4">
                      <Search className="h-7 w-7 text-cosmic-cyan" />
                    </div>
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => handleSearch(e.target.value)}
                      placeholder="Enter stock symbol (e.g., TCS, INFY, RELIANCE)"
                      className="flex-1 px-6 py-6 text-xl bg-transparent text-white placeholder-galaxy-400 focus:outline-none"
                    />
                    <button
                      onClick={handleAnalyze}
                      className="flex-shrink-0 mr-2 px-8 py-4 bg-gradient-to-r from-cosmic-purple to-cosmic-pink text-white font-bold rounded-xl hover:from-cosmic-pink hover:to-cosmic-purple transition-all transform hover:scale-105 flex items-center space-x-2"
                    >
                      <span className="text-lg">Analyze</span>
                      <ArrowRight className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Auto-suggestions */}
              {suggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-4 bg-galaxy-800/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-galaxy-600/50 z-20 animate-slide-up overflow-hidden">
                  {suggestions.map((stock, index) => (
                    <button
                      key={stock}
                      onClick={() => handleStockSelect(stock)}
                      className="w-full px-8 py-5 text-left text-white hover:bg-galaxy-700/50 transition-colors flex items-center justify-between group border-b border-galaxy-700/30 last:border-b-0"
                    >
                      <span className="font-semibold text-lg">{stock}</span>
                      <ArrowRight className="h-5 w-5 text-cosmic-cyan opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Enhanced Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-6xl mx-auto pt-20">
            {[
              { number: '500+', label: 'Stocks Analyzed', icon: BarChart3, color: 'cosmic-purple', bg: 'from-cosmic-purple/20 to-cosmic-purple/5' },
              { number: '85%', label: 'Accuracy Rate', icon: TrendingUp, color: 'cosmic-cyan', bg: 'from-cosmic-cyan/20 to-cosmic-cyan/5' },
              { number: '10K+', label: 'Active Users', icon: Star, color: 'cosmic-pink', bg: 'from-cosmic-pink/20 to-cosmic-pink/5' },
              { number: '24/7', label: 'Market Monitoring', icon: Sparkles, color: 'cosmic-blue', bg: 'from-cosmic-blue/20 to-cosmic-blue/5' }
            ].map((stat, index) => (
              <div key={index} className="group relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-cosmic-purple/20 to-cosmic-cyan/20 rounded-3xl blur opacity-0 group-hover:opacity-100 transition duration-1000"></div>
                <div className={`relative bg-gradient-to-br ${stat.bg} backdrop-blur-sm border border-galaxy-600/30 rounded-2xl p-8 hover:bg-galaxy-700/40 transition-all transform hover:scale-105`}>
                  <div className="flex items-center justify-center mb-4">
                    <div className={`p-3 bg-${stat.color}/20 rounded-xl`}>
                      <stat.icon className={`h-8 w-8 text-${stat.color}`} />
                    </div>
                  </div>
                  <div className={`text-4xl font-black text-${stat.color} mb-3`}>{stat.number}</div>
                  <div className="text-sm text-galaxy-300 font-medium">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Call to Action */}
          <div className="pt-12">
            <div className="inline-flex items-center space-x-4 px-8 py-4 bg-galaxy-800/50 backdrop-blur-sm text-cosmic-cyan rounded-2xl text-lg border border-galaxy-700/50">
              <div className="w-3 h-3 bg-cosmic-cyan rounded-full animate-pulse"></div>
              <span className="font-semibold">Live market analysis powered by advanced AI algorithms</span>
              <Sparkles className="h-5 w-5 animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;