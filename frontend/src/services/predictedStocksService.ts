export interface PredictedStock {
  id: string;
  symbol: string;
  name: string;
  price: number;
  setup: 'VCP' | 'IPO Base';
  sector: string;
  targetReturn: string;
  timeline: string;
  confidence: number;
  original_data?: any;
}

export interface PredictedStocksResponse {
  success: boolean;
  data: PredictedStock[];
  count: number;
  vcp_count: number;
  ipo_count: number;
  message?: string;
}

class PredictedStocksService {
  private baseURL: string;

  constructor() {
    // Use environment variable or default to Render backend
    this.baseURL = import.meta.env.VITE_API_URL || 'https://stock-sensor-backend.onrender.com/api';
  }

  async triggerScrapeStocks(): Promise<{ success: boolean; message: string } | null> {
    try {
      const response = await fetch(`${this.baseURL}/predict/scrape-stocks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        const text = await response.text();
        throw new Error(`HTTP ${response.status}: ${text}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error triggering stock scraping:', error);
      return null;
    }
  }

  async triggerRunVCP(): Promise<{ success: boolean; message: string } | null> {
    try {
      const response = await fetch(`${this.baseURL}/predict/run-vcp-analysis`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        const text = await response.text();
        throw new Error(`HTTP ${response.status}: ${text}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error triggering VCP analysis:', error);
      return null;
    }
  }

  async triggerRunIPO(): Promise<{ success: boolean; message: string } | null> {
    try {
      const response = await fetch(`${this.baseURL}/predict/run-ipo-analysis`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        const text = await response.text();
        throw new Error(`HTTP ${response.status}: ${text}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error triggering IPO analysis:', error);
      return null;
    }
  }

  async fetchPredictedStocks(): Promise<PredictedStock[]> {
    try {
      const response = await fetch(`${this.baseURL}/predict/predicted-stocks`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data: PredictedStocksResponse = await response.json();
      
      if (data.success) {
        return data.data;
      } else {
        throw new Error(data.message || 'Failed to fetch predicted stocks');
      }
    } catch (error) {
      console.error('Error fetching predicted stocks:', error);
      // Return empty array on error, frontend will handle gracefully
      return [];
    }
  }

  async fetchVCPResults(): Promise<PredictedStock[]> {
    try {
      const response = await fetch(`${this.baseURL}/predict/vcp-results`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        // Transform VCP data to match frontend interface
        return data.data.map((stock: any, index: number) => {
          const confidence_str = stock.confidence || '0%';
          const confidence = parseInt(confidence_str.replace('%', '')) || 0;
          
          return {
            id: String(stock._id || index + 1),
            symbol: stock.symbol || '',
            name: stock.stock_name || '',
            price: stock.current_price || 0,  // Use current_price from database
            setup: 'VCP' as const,
            sector: stock.sector || 'Unknown',
            targetReturn: confidence >= 80 ? '8-12%' : confidence >= 60 ? '6-10%' : '4-8%',
            timeline: 'Recent',
            confidence: confidence,
            original_data: stock
          };
        });
      } else {
        throw new Error(data.message || 'Failed to fetch VCP results');
      }
    } catch (error) {
      console.error('Error fetching VCP results:', error);
      return [];
    }
  }

  async fetchIPOResults(): Promise<PredictedStock[]> {
    try {
      const response = await fetch(`${this.baseURL}/predict/ipo-results`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        // Transform IPO data to match frontend interface
        return data.data.map((stock: any, index: number) => {
          const confidence_str = stock.confidence || '0%';
          const confidence = parseInt(confidence_str.replace('%', '')) || 0;
          
          return {
            id: String(stock._id || index + 1),
            symbol: stock.symbol || '',
            name: stock.stock_name || '',
            price: stock.current_price || 0,  // Use current_price from database
            setup: 'IPO Base' as const,
            sector: stock.sector || 'Unknown',
            targetReturn: confidence >= 80 ? '8-12%' : confidence >= 60 ? '6-10%' : '4-8%',
            timeline: 'Recent',
            confidence: confidence,
            original_data: stock
          };
        });
      } else {
        throw new Error(data.message || 'Failed to fetch IPO results');
      }
    } catch (error) {
      console.error('Error fetching IPO results:', error);
      return [];
    }
  }
}

export const predictedStocksService = new PredictedStocksService();
export default predictedStocksService;
