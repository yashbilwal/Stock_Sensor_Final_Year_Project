from app.models.news_model import NewsModel
from app.utils.scraper_utils import scrape_economic_times_news
from app.utils.sentiment_utils import analyze_sentiment

class NewsService:
    @staticmethod
    def scrape_and_store_news():
        """Scrape news from Economic Times and store in database"""
        try:
            # Scrape news headlines and URLs
            news_items = scrape_economic_times_news()
            
            # Analyze sentiment for each news headline
            for news in news_items:
                sentiment = analyze_sentiment(news['headline'])
                news['sentiment'] = sentiment
            
            # Clear existing news and store new ones
            NewsModel.clear_all_news()
            NewsModel.insert_news(news_items)
            
            return {
                'success': True,
                'message': f'Successfully scraped and stored {len(news_items)} news items',
                'count': len(news_items)
            }
            
        except Exception as e:
            return {
                'success': False,
                'message': f'Failed to scrape and store news: {str(e)}'
            }
    
    @staticmethod
    def get_all_news():
        """Get all news items from database"""
        return NewsModel.get_all_news()
    
    @staticmethod
    def get_latest_news(limit=5):
        """Get latest news items from database"""
        return NewsModel.get_latest_news(limit)