from app.models.news_model import NewsModel
from app.utils.scraper_utils import scrape_economic_times_news
from app.utils.sentiment_utils import analyze_sentiment
import logging

logger = logging.getLogger(__name__)

class NewsService:
    @staticmethod
    def scrape_and_store_news():
        """Scrape news from Economic Times and store in database"""
        try:
            # Scrape news headlines and URLs
            news_items = scrape_economic_times_news()
            logger.info(f"Scraped {len(news_items)} news items")
            
            # Analyze sentiment for each news headline
            for news in news_items:
                sentiment = analyze_sentiment(news['headline'])
                news['sentiment'] = sentiment
            
            # Clear existing news and store new ones
            clear_success = NewsModel.clear_all_news()
            if not clear_success:
                logger.warning("Failed to clear existing news, but continuing...")
            
            insert_success = NewsModel.insert_news(news_items)
            if not insert_success:
                logger.error("Failed to insert news items")
                return {
                    'success': False,
                    'message': 'News scraped but failed to store in database',
                    'count': len(news_items)
                }
            
            return {
                'success': True,
                'message': f'Successfully scraped and stored {len(news_items)} news items',
                'count': len(news_items)
            }
            
        except Exception as e:
            logger.error(f"Error in scrape_and_store_news: {str(e)}")
            return {
                'success': False,
                'message': f'Failed to scrape and store news: {str(e)}'
            }
    
    @staticmethod
    def get_all_news():
        """Get all news items from database"""
        try:
            return NewsModel.get_all_news()
        except Exception as e:
            logger.error(f"Error getting all news: {str(e)}")
            return []
    
    @staticmethod
    def get_latest_news(limit=5):
        """Get latest news items from database"""
        try:
            return NewsModel.get_latest_news(limit)
        except Exception as e:
            logger.error(f"Error getting latest news: {str(e)}")
            return []