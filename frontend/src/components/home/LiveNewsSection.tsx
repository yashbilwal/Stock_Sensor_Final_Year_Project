import React, { useState } from 'react';
import { Clock, TrendingUp, TrendingDown, Minus, ExternalLink, Sparkles, Star, RefreshCw, AlertCircle } from 'lucide-react';
import { useNews } from '../../hooks/useNews';
import { NewsItem } from '../../services/newsService';

const LiveNewsSection: React.FC = () => {
  const [selectedSentiment, setSelectedSentiment] = useState<'All' | 'Positive' | 'Negative' | 'Neutral'>('All');
  
  // Use the custom hook to fetch real news data
  const { news, loading, error, lastUpdated, refreshNews } = useNews();

  // Filter news based on selected sentiment
  const filteredNews = news.filter(newsItem => 
    selectedSentiment === 'All' || newsItem.sentiment === selectedSentiment
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

  const formatLastUpdated = (date: Date) => {
    return `Last updated: ${date.toLocaleTimeString()}`;
  };

  // Loading state
  if (loading && news.length === 0) {
    return (
      <section className="relative py-20 bg-galaxy-900 overflow-hidden">
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

          <div className="flex justify-center items-center py-20">
            <div className="flex items-center space-x-3 text-cosmic-cyan">
              <RefreshCw className="h-6 w-6 animate-spin" />
              <span className="text-lg">Loading latest news...</span>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Error state
  if (error && news.length === 0) {
    return (
      <section className="relative py-20 bg-galaxy-900 overflow-hidden">
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

          <div className="flex justify-center items-center py-20">
            <div className="flex flex-col items-center space-y-4 text-error-400">
              <AlertCircle className="h-12 w-12" />
              <div className="text-center">
                <p className="text-lg font-medium">Failed to load news</p>
                <p className="text-sm text-galaxy-400">{error}</p>
                <button 
                  onClick={refreshNews}
                  className="mt-4 px-6 py-2 bg-cosmic-purple hover:bg-cosmic-pink text-white rounded-lg transition-colors"
                >
                  Try Again
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

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

          {/* Last Updated and Refresh */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-sm text-galaxy-400">
              <Clock className="h-4 w-4" />
              <span>{formatLastUpdated(lastUpdated)}</span>
            </div>
            <button
              onClick={refreshNews}
              disabled={loading}
              className="flex items-center space-x-2 px-3 py-2 text-sm text-cosmic-cyan hover:text-cosmic-purple transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {/* News Items */}
        <div className="space-y-6">
          {filteredNews.length > 0 ? (
            filteredNews.map((newsItem, index) => (
              <div
                key={newsItem.id}
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
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getSentimentColor(newsItem.sentiment)}`}>
                          {getSentimentIcon(newsItem.sentiment)}
                          <span className="ml-1">{newsItem.sentiment}</span>
                        </span>
                        <span className="text-sm font-medium text-cosmic-cyan">{newsItem.source}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-galaxy-400">
                        <Clock className="h-4 w-4" />
                        <span>{newsItem.timestamp}</span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="space-y-3">
                      <h3 className="text-lg font-semibold text-white leading-tight group-hover:text-cosmic-cyan transition-colors">
                        {newsItem.headline}
                      </h3>
                      <p className="text-galaxy-300 leading-relaxed group-hover:text-galaxy-200 transition-colors">
                        {newsItem.summary}
                      </p>
                    </div>

                    {/* Action */}
                    <div className="flex justify-end">
                      <a
                        href={newsItem.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center space-x-2 text-sm text-cosmic-cyan hover:text-cosmic-purple transition-colors group/link"
                      >
                        <span>Read more</span>
                        <ExternalLink className="h-3 w-3 group-hover/link:translate-x-1 transition-transform" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-20">
              <div className="flex flex-col items-center space-y-4 text-galaxy-400">
                <AlertCircle className="h-12 w-12" />
                <p className="text-lg">No news available</p>
                <p className="text-sm">Try changing the sentiment filter or refresh the page</p>
              </div>
            </div>
          )}
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