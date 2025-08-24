import { useState, useEffect, useCallback } from 'react';
import { newsService, NewsItem } from '../services/newsService';

export const useNews = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const fetchNews = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const newsData = await newsService.fetchLiveNews();
      setNews(newsData);
      setLastUpdated(new Date());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch news');
      console.error('Error in useNews hook:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshNews = useCallback(() => {
    fetchNews();
  }, [fetchNews]);

  // Initial fetch
  useEffect(() => {
    fetchNews();
  }, [fetchNews]);

  // Auto-refresh every 5 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      fetchNews();
    }, 5 * 60 * 1000); // 5 minutes

    return () => clearInterval(interval);
  }, [fetchNews]);

  return {
    news,
    loading,
    error,
    lastUpdated,
    refreshNews,
    refetch: fetchNews
  };
};
