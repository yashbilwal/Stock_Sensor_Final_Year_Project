import { useState, useEffect, useCallback } from 'react';
import { predictedStocksService, PredictedStock } from '../services/predictedStocksService';

export const usePredictedStocks = () => {
  const [stocks, setStocks] = useState<PredictedStock[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const fetchStocks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const stocksData = await predictedStocksService.fetchPredictedStocks();
      setStocks(stocksData);
      setLastUpdated(new Date());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch predicted stocks');
      console.error('Error in usePredictedStocks hook:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshStocks = useCallback(() => {
    fetchStocks();
  }, [fetchStocks]);

  // Initial fetch
  useEffect(() => {
    fetchStocks();
  }, [fetchStocks]);

  // Auto-refresh every 10 minutes (patterns don't change as frequently as news)
  useEffect(() => {
    const interval = setInterval(() => {
      fetchStocks();
    }, 10 * 60 * 1000); // 10 minutes

    return () => clearInterval(interval);
  }, [fetchStocks]);

  return {
    stocks,
    loading,
    error,
    lastUpdated,
    refreshStocks,
    refetch: fetchStocks
  };
};
