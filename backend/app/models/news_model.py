from datetime import datetime
from app.extensions import mongo
import logging

logger = logging.getLogger(__name__)

class NewsModel:
    @staticmethod
    def get_collection():
        try:
            if mongo.db is None:
                logger.error("MongoDB connection not established")
                return None
            return mongo.db.news
        except Exception as e:
            logger.error(f"Error getting MongoDB collection: {str(e)}")
            return None
    
    @staticmethod
    def clear_all_news():
        """Clear all news from the collection"""
        try:
            collection = NewsModel.get_collection()
            if not collection:
                logger.error("Cannot clear news: Collection not available")
                return False
            collection.delete_many({})
            logger.info("All news cleared successfully")
            return True
        except Exception as e:
            logger.error(f"Error clearing news: {str(e)}")
            return False
    
    @staticmethod
    def insert_news(news_list):
        """Insert multiple news items into the collection"""
        try:
            if not news_list:
                logger.warning("No news items to insert")
                return False
            
            collection = NewsModel.get_collection()
            if not collection:
                logger.error("Cannot insert news: Collection not available")
                return False
            
            # Add timestamp to each news item
            for news in news_list:
                news['created_at'] = datetime.utcnow()
                news['scraped_at'] = datetime.utcnow()
            
            result = collection.insert_many(news_list)
            logger.info(f"Successfully inserted {len(result.inserted_ids)} news items")
            return True
            
        except Exception as e:
            logger.error(f"Error inserting news: {str(e)}")
            return False
    
    @staticmethod
    def get_all_news():
        """Get all news items sorted by creation date (newest first)"""
        try:
            collection = NewsModel.get_collection()
            if not collection:
                logger.error("Cannot get news: Collection not available")
                return []
            return list(collection.find({}, {'_id': 0}).sort('created_at', -1))
        except Exception as e:
            logger.error(f"Error getting all news: {str(e)}")
            return []
    
    @staticmethod
    def get_latest_news(limit=5):
        """Get latest news items"""
        try:
            collection = NewsModel.get_collection()
            if not collection:
                logger.error("Cannot get latest news: Collection not available")
                return []
            return list(collection.find({}, {'_id': 0}).sort('created_at', -1).limit(limit))
        except Exception as e:
            logger.error(f"Error getting latest news: {str(e)}")
            return []