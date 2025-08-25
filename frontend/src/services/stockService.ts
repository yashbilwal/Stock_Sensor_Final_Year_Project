export interface StockAnalysisData {
  symbol: string;
  heading: {
    sector: string;
    full_name: string;
    current_price: number;
    change_price: number;
    change_percent: number;
  };
  overview: {
    market_cap: number | string;
    pe_ratio: number | string;
    '52w_high': number | string;
    '52w_low': number | string;
  };
  fundamental: {
    key_ratios: {
      pe_ratio: number | string;
      sector_pe: number | string;
      roe: number | string;
      dividend_yield: number | string;
    };
    shareholding_pattern: {
      promoter: string;
      institutions: string;
      retail: string;
      others: string;
    };
  };
  technical: {
    support_resistance: {
      resistance_levels: {
        R1: number;
        R2: number;
        R3: number;
      };
      current_level: number;
      support_levels: {
        S1: number;
        S2: number;
        S3: number;
      };
    };
    technical_indicators: {
      rsi_14: number;
      macd: {
        macd_line: number;
        signal_line: number;
        histogram: number;
      };
      volume_trend: string;
    };
  };
  financial: {
    revenue_profit: {
      revenue_ttm: number;
      net_profit_ttm: number;
    };
    balance_sheet: {
      total_debt: number;
      debt_equity: number;
      current_ratio: number;
    };
  };
  chart?: string; // Base64 encoded chart image
}

export interface StockAnalysisResponse {
  success: boolean;
  timestamp: string;
  data: StockAnalysisData;
  error?: string;
}

class StockService {
  private baseURL: string;

  constructor() {
    // Use environment variable or default to Render backend
    this.baseURL = import.meta.env.VITE_API_URL || 'https://stock-sensor-backend.onrender.com/api';
  }

  async analyzeStock(symbol: string): Promise<StockAnalysisData> {
    try {
      // Ensure symbol has .NS suffix for NSE stocks
      const nseSymbol = symbol.endsWith('.NS') ? symbol : `${symbol}.NS`;
      
      const response = await fetch(`${this.baseURL}/stocks/analyze/${nseSymbol}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data: StockAnalysisResponse = await response.json();
      
      if (data.success) {
        return data.data;
      } else {
        throw new Error(data.error || 'Failed to analyze stock');
      }
    } catch (error) {
      console.error('Error analyzing stock:', error);
      throw error;
    }
  }

  async searchStocks(query: string): Promise<string[]> {
    try {
      const response = await fetch(`${this.baseURL}/stocks/search`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        return data.data || [];
      } else {
        throw new Error(data.error || 'Failed to search stocks');
      }
    } catch (error) {
      console.error('Error searching stocks:', error);
      return [];
    }
  }

  async getPopularStocks(): Promise<string[]> {
    try {
      const response = await fetch(`${this.baseURL}/stocks/popular`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        return data.data || [];
      } else {
        throw new Error(data.error || 'Failed to get popular stocks');
      }
    } catch (error) {
      console.error('Error getting popular stocks:', error);
      return [];
    }
  }
}

export const stockService = new StockService();
export default stockService;
