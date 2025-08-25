export interface NewsItem {
  id: string;
  headline: string;
  timestamp: string;
  sentiment: 'Positive' | 'Negative' | 'Neutral';
  source: string;
  summary: string;
  url: string;
}

export interface NewsResponse {
  success: boolean;
  data: NewsItem[];
  count: number;
  message?: string;
}

class NewsService {
  private baseURL: string;

  constructor() {
    // Use environment variable or default to Render backend
    this.baseURL = import.meta.env.VITE_API_URL || 'https://stock-sensor-backend.onrender.com/api';
  }

  async fetchLiveNews(): Promise<NewsItem[]> {
    try {
      const response = await fetch(`${this.baseURL}/news/live-news`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data: NewsResponse = await response.json();
      
      if (data.success) {
        return data.data;
      } else {
        throw new Error(data.message || 'Failed to fetch news');
      }
    } catch (error) {
      console.error('Error fetching live news:', error);
      // Return empty array on error, frontend will handle gracefully
      return [];
    }
  }

  async fetchHotNews(): Promise<NewsItem[]> {
    try {
      const response = await fetch(`${this.baseURL}/news/hot-news`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data: NewsResponse = await response.json();
      
      if (data.success) {
        return data.data;
      } else {
        throw new Error(data.message || 'Failed to fetch hot news');
      }
    } catch (error) {
      console.error('Error fetching hot news:', error);
      return [];
    }
  }

  async fetchLatestNews(limit: number = 5): Promise<NewsItem[]> {
    try {
      const response = await fetch(`${this.baseURL}/news/latest-news`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data: NewsResponse = await response.json();
      
      if (data.success) {
        return data.data.slice(0, limit);
      } else {
        throw new Error(data.message || 'Failed to fetch latest news');
      }
    } catch (error) {
      console.error('Error fetching latest news:', error);
      return [];
    }
  }
}

export const newsService = new NewsService();
export default newsService;
