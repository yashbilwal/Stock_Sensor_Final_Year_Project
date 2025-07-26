import React, { useState, useEffect } from 'react';
import { Clock, TrendingUp, TrendingDown, Minus, ExternalLink, Sparkles, Star } from 'lucide-react';

interface NewsItem {
  id: string;
  headline: string;
  timestamp: string;
  sentiment: 'Positive' | 'Negative' | 'Neutral';
  source: string;
  summary: string;
  url: string;
}

const LiveNewsSection: React.FC = () => {
  const [selectedSentiment, setSelectedSentiment] = useState<'All' | 'Positive' | 'Negative' | 'Neutral'>('All');
  const [refreshTime, setRefreshTime] = useState<string>('');

  const mockNews: NewsItem[] = [
    {
      id: '1',
      headline: 'TCS Reports Strong Q3 Results, Revenue Up 8.5% YoY',
      timestamp: '2 hours ago',
      sentiment: 'Positive',
      source: 'MoneyControl',
      summary: 'Tata Consultancy Services announced robust quarterly results with significant revenue growth and improved margins.',
      url: '#'
    },
    {
      id: '2',
      headline: 'RBI Maintains Repo Rate at 6.5%, Inflation Concerns Persist',
      timestamp: '3 hours ago',
      sentiment: 'Neutral',
      source: 'Economic Times',
      summary: 'Reserve Bank of India keeps interest rates unchanged while monitoring inflation trends.',
      url: '#'
    },
    {
      id: '3',
      headline: 'Reliance Industries Faces Regulatory Scrutiny Over Telecom Merger',
      timestamp: '4 hours ago',
      sentiment: 'Negative',
      source: 'Business Standard',
      summary: 'Regulatory authorities raising questions about the proposed telecom sector consolidation.',
      url: '#'
    },
    {
      id: '4',
      headline: 'HDFC Bank Launches New Digital Banking Platform for SMEs',
      timestamp: '5 hours ago',
      sentiment: 'Positive',
      source: 'LiveMint',
      summary: 'Major private bank introduces comprehensive digital solutions targeting small and medium enterprises.',
      url: '#'
    },
    {
      id: '5',
      headline: 'IT Sector Outlook Remains Cautious Amid Global Slowdown',
      timestamp: '6 hours ago',
      sentiment: 'Negative',
      source: 'CNBC TV18',
      summary: 'Industry experts express concerns about demand weakness in key international markets.',
      url: '#'
    }
  ];

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setRefreshTime(`Last updated: ${now.toLocaleTimeString()}`);
    };
    
    updateTime();
    const interval = setInterval(updateTime, 30000); // Update every 30 seconds
    
    return () => clearInterval(interval);
  }, []);

  const filteredNews = mockNews.filter(news => 
    selectedSentiment === 'All' || news.sentiment === selectedSentiment
  );

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'Positive':
        return <TrendingUp className="h-4 w-4 text-success-400" />;
      case 'Negative':
        return <TrendingDown className="h-4 w-4 text-error-400" />;
      default:
        return <Minus className="h-4 w-4 text-galaxy-400" />;
    }
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'Positive':
        return 'bg-success-500/20 text-success-400 border-success-500/30';
      case 'Negative':
        return 'bg-error-500/20 text-error-400 border-error-500/30';
      default:
        return 'bg-galaxy-700/50 text-galaxy-300 border-galaxy-600/30';
    }
  };

  return (
    <section className="relative py-20 bg-galaxy-900 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-24 left-32 animate-twinkle">
          <Star className="h-3 w-3 text-cosmic-purple opacity-40" fill="currentColor" />
        </div>
        <div className="absolute top-48 right-24 animate-twinkle" style={{ animationDelay: '1s' }}>
          <Star className="h-4 w-4 text-cosmic-cyan opacity-30" fill="currentColor" />
        </div>
        <div className="absolute bottom-32 left-20 animate-twinkle" style={{ animationDelay: '2s' }}>
          <Star className="h-2 w-2 text-cosmic-pink opacity-60" fill="currentColor" />
        </div>
        <div className="absolute top-60 right-40 animate-twinkle" style={{ animationDelay: '0.5s' }}>
          <Star className="h-5 w-5 text-cosmic-blue opacity-20" fill="currentColor" />
        </div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
        <div className="text-center space-y-6 mb-12">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Sparkles className="h-6 w-6 text-cosmic-purple animate-pulse" />
            <span className="text-cosmic-cyan font-semibold tracking-wide">LIVE UPDATES</span>
            <Sparkles className="h-6 w-6 text-cosmic-pink animate-pulse" />
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold text-white">
            Hot News &
            <span className="block bg-gradient-to-r from-cosmic-purple via-cosmic-cyan to-cosmic-pink bg-clip-text text-transparent">
              Sentiment
            </span>
          </h2>
          
          <p className="text-xl text-galaxy-300 max-w-3xl mx-auto leading-relaxed">
            Stay updated with real-time market news and AI-powered sentiment analysis.
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 space-y-4 sm:space-y-0">
          {/* Sentiment Filters */}
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium text-galaxy-300">Filter by sentiment:</span>
            <div className="flex space-x-2">
              {(['All', 'Positive', 'Negative', 'Neutral'] as const).map((sentiment) => (
                <button
                  key={sentiment}
                  onClick={() => setSelectedSentiment(sentiment)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    selectedSentiment === sentiment
                      ? 'bg-gradient-to-r from-cosmic-purple to-cosmic-pink text-white shadow-lg'
                      : 'bg-galaxy-800/50 text-galaxy-300 hover:bg-galaxy-700/50 hover:text-white'
                  }`}
                >
                  {sentiment}
                </button>
              ))}
            </div>
          </div>

          {/* Last Updated */}
          <div className="flex items-center space-x-2 text-sm text-galaxy-400">
            <Clock className="h-4 w-4" />
            <span>{refreshTime}</span>
          </div>
        </div>

        {/* News Items */}
        <div className="space-y-6">
          {filteredNews.map((news, index) => (
            <div
              key={news.id}
              className="group relative"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Glow Effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-cosmic-purple/10 via-cosmic-cyan/10 to-cosmic-pink/10 rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-1000"></div>
              
              {/* Card */}
              <div className="relative bg-galaxy-800/50 backdrop-blur-sm border border-galaxy-700/50 rounded-2xl p-6 hover:bg-galaxy-700/50 transition-all duration-300 animate-slide-up">
                <div className="space-y-4">
                  {/* Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
                    <div className="flex items-center space-x-3">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getSentimentColor(news.sentiment)}`}>
                        {getSentimentIcon(news.sentiment)}
                        <span className="ml-1">{news.sentiment}</span>
                      </span>
                      <span className="text-sm font-medium text-cosmic-cyan">{news.source}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-galaxy-400">
                      <Clock className="h-4 w-4" />
                      <span>{news.timestamp}</span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-white leading-tight group-hover:text-cosmic-cyan transition-colors">
                      {news.headline}
                    </h3>
                    <p className="text-galaxy-300 leading-relaxed group-hover:text-galaxy-200 transition-colors">
                      {news.summary}
                    </p>
                  </div>

                  {/* Action */}
                  <div className="flex justify-end">
                    <a
                      href={news.url}
                      className="inline-flex items-center space-x-2 text-sm text-cosmic-cyan hover:text-cosmic-purple transition-colors group/link"
                    >
                      <span>Read more</span>
                      <ExternalLink className="h-3 w-3 group-hover/link:translate-x-1 transition-transform" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Auto-refresh Notice */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center space-x-3 px-6 py-3 bg-galaxy-800/50 backdrop-blur-sm text-cosmic-cyan rounded-xl text-sm border border-galaxy-700/50">
            <div className="w-2 h-2 bg-cosmic-cyan rounded-full animate-pulse"></div>
            <span>News updates automatically every 5 minutes</span>
            <Sparkles className="h-4 w-4 animate-pulse" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default LiveNewsSection;