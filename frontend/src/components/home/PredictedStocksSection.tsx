import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, Filter, ArrowRight, Target, Calendar, Sparkles, Star } from 'lucide-react';

interface Stock {
  symbol: string;
  name: string;
  price: number;
  setup: 'VCP' | 'IPO Base';
  sector: string;
  targetReturn: string;
  timeline: string;
  confidence: number;
}

const PredictedStocksSection: React.FC = () => {
  const [selectedFilter, setSelectedFilter] = useState<'All' | 'VCP' | 'IPO Base'>('All');
  const [selectedSector, setSelectedSector] = useState<string>('All');

  const mockStocks: Stock[] = [
    {
      symbol: 'TCS',
      name: 'Tata Consultancy Services',
      price: 3420.50,
      setup: 'VCP',
      sector: 'IT',
      targetReturn: '7-9%',
      timeline: '5-8 days',
      confidence: 85
    },
    {
      symbol: 'INFY',
      name: 'Infosys Limited',
      price: 1456.30,
      setup: 'IPO Base',
      sector: 'IT',
      targetReturn: '6-8%',
      timeline: '7-10 days',
      confidence: 78
    },
    {
      symbol: 'RELIANCE',
      name: 'Reliance Industries',
      price: 2678.90,
      setup: 'VCP',
      sector: 'Energy',
      targetReturn: '8-10%',
      timeline: '5-7 days',
      confidence: 92
    },
    {
      symbol: 'HDFC',
      name: 'HDFC Bank',
      price: 1623.45,
      setup: 'VCP',
      sector: 'Banking',
      targetReturn: '5-7%',
      timeline: '6-9 days',
      confidence: 81
    },
    {
      symbol: 'WIPRO',
      name: 'Wipro Limited',
      price: 432.80,
      setup: 'IPO Base',
      sector: 'IT',
      targetReturn: '6-9%',
      timeline: '8-12 days',
      confidence: 73
    },
    {
      symbol: 'BHARTIARTL',
      name: 'Bharti Airtel',
      price: 912.30,
      setup: 'VCP',
      sector: 'Telecom',
      targetReturn: '5-8%',
      timeline: '7-10 days',
      confidence: 88
    }
  ];

  const sectors = ['All', 'IT', 'Banking', 'Energy', 'Pharma', 'Auto', 'Telecom'];

  const filteredStocks = mockStocks.filter(stock => {
    const setupMatch = selectedFilter === 'All' || stock.setup === selectedFilter;
    const sectorMatch = selectedSector === 'All' || stock.sector === selectedSector;
    return setupMatch && sectorMatch;
  });

  return (
    <section id="predicted-stocks" className="relative py-20 bg-galaxy-950 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-32 left-24 animate-twinkle">
          <Star className="h-3 w-3 text-cosmic-purple opacity-40" fill="currentColor" />
        </div>
        <div className="absolute top-48 right-32 animate-twinkle" style={{ animationDelay: '1s' }}>
          <Star className="h-4 w-4 text-cosmic-cyan opacity-30" fill="currentColor" />
        </div>
        <div className="absolute bottom-40 left-40 animate-twinkle" style={{ animationDelay: '2s' }}>
          <Star className="h-2 w-2 text-cosmic-pink opacity-60" fill="currentColor" />
        </div>
        <div className="absolute top-60 right-16 animate-twinkle" style={{ animationDelay: '0.5s' }}>
          <Star className="h-5 w-5 text-cosmic-blue opacity-20" fill="currentColor" />
        </div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
        <div className="text-center space-y-6 mb-12">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Target className="h-6 w-6 text-cosmic-purple animate-pulse" />
            <span className="text-cosmic-cyan font-semibold tracking-wide">AI PREDICTIONS</span>
            <Target className="h-6 w-6 text-cosmic-pink animate-pulse" />
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold text-white">
            Predicted Stocks
            <span className="block bg-gradient-to-r from-cosmic-purple via-cosmic-cyan to-cosmic-pink bg-clip-text text-transparent">
              (VCP & IPO Base)
            </span>
          </h2>
          
          <p className="text-xl text-galaxy-300 max-w-3xl mx-auto leading-relaxed">
            AI-identified opportunities with strong technical setups and high probability returns.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-6 mb-12 justify-center">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Filter className="h-5 w-5 text-cosmic-cyan" />
              <span className="text-sm font-medium text-galaxy-300">Setup:</span>
            </div>
            <div className="flex space-x-2">
              {(['All', 'VCP', 'IPO Base'] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setSelectedFilter(filter)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    selectedFilter === filter
                      ? 'bg-gradient-to-r from-cosmic-purple to-cosmic-pink text-white shadow-lg'
                      : 'bg-galaxy-800/50 text-galaxy-300 hover:bg-galaxy-700/50 hover:text-white'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium text-galaxy-300">Sector:</span>
            <select
              value={selectedSector}
              onChange={(e) => setSelectedSector(e.target.value)}
              className="px-4 py-2 bg-galaxy-800/50 border border-galaxy-600/50 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-cosmic-purple focus:border-cosmic-purple transition-all"
            >
              {sectors.map((sector) => (
                <option key={sector} value={sector} className="bg-galaxy-800">
                  {sector}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Stock Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredStocks.map((stock, index) => (
            <div
              key={stock.symbol}
              className="group relative"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Glow Effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-cosmic-purple/20 via-cosmic-cyan/20 to-cosmic-pink/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-1000"></div>
              
              {/* Card */}
              <div className="relative bg-galaxy-800/50 backdrop-blur-sm border border-galaxy-700/50 rounded-2xl p-6 hover:bg-galaxy-700/50 transition-all duration-300 animate-slide-up">
                <div className="space-y-6">
                  {/* Header */}
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <h3 className="text-xl font-bold text-white">{stock.symbol}</h3>
                        <Star className="h-4 w-4 text-cosmic-purple opacity-0 group-hover:opacity-100 transition-opacity animate-pulse" fill="currentColor" />
                      </div>
                      <p className="text-sm text-galaxy-300">{stock.name}</p>
                      <span className="inline-block px-3 py-1 bg-galaxy-700/50 text-galaxy-300 text-xs rounded-full border border-galaxy-600/30">
                        {stock.sector}
                      </span>
                    </div>
                    <div className="text-right space-y-2">
                      <div className="text-2xl font-bold text-white">₹{stock.price.toLocaleString()}</div>
                      <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                        stock.setup === 'VCP' 
                          ? 'bg-cosmic-purple/20 text-cosmic-purple border border-cosmic-purple/30' 
                          : 'bg-cosmic-cyan/20 text-cosmic-cyan border border-cosmic-cyan/30'
                      }`}>
                        {stock.setup}
                      </div>
                    </div>
                  </div>

                  {/* Metrics */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-3 bg-galaxy-700/30 rounded-lg border border-galaxy-600/30">
                      <div className="flex items-center justify-center mb-1">
                        <Target className="h-4 w-4 text-success-500 mr-1" />
                        <span className="text-xs text-galaxy-400">Target</span>
                      </div>
                      <div className="font-semibold text-success-400">{stock.targetReturn}</div>
                    </div>
                    <div className="text-center p-3 bg-galaxy-700/30 rounded-lg border border-galaxy-600/30">
                      <div className="flex items-center justify-center mb-1">
                        <Calendar className="h-4 w-4 text-cosmic-cyan mr-1" />
                        <span className="text-xs text-galaxy-400">Timeline</span>
                      </div>
                      <div className="font-semibold text-cosmic-cyan">{stock.timeline}</div>
                    </div>
                    <div className="text-center p-3 bg-galaxy-700/30 rounded-lg border border-galaxy-600/30">
                      <div className="flex items-center justify-center mb-1">
                        <TrendingUp className="h-4 w-4 text-cosmic-purple mr-1" />
                        <span className="text-xs text-galaxy-400">Confidence</span>
                      </div>
                      <div className="font-semibold text-cosmic-purple">{stock.confidence}%</div>
                    </div>
                  </div>

                  {/* Confidence Bar */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-galaxy-400">Confidence Level</span>
                      <span className="font-medium text-white">{stock.confidence}%</span>
                    </div>
                    <div className="w-full bg-galaxy-700 rounded-full h-2 overflow-hidden">
                      <div 
                        className={`h-2 rounded-full transition-all duration-1000 ${
                          stock.confidence >= 80 ? 'bg-gradient-to-r from-success-500 to-success-400' :
                          stock.confidence >= 60 ? 'bg-gradient-to-r from-warning-500 to-warning-400' : 
                          'bg-gradient-to-r from-error-500 to-error-400'
                        }`}
                        style={{ width: `${stock.confidence}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Action Button */}
                  <Link
                    to={`/stock/${stock.symbol}`}
                    className="group/btn relative w-full flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-cosmic-purple to-cosmic-pink text-white rounded-xl hover:from-cosmic-pink hover:to-cosmic-purple transition-all transform hover:scale-105 overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-cosmic-purple/20 to-cosmic-pink/20 animate-pulse"></div>
                    <span className="relative font-medium">View Report</span>
                    <ArrowRight className="relative h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PredictedStocksSection;