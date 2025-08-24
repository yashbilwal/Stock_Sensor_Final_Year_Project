from datetime import datetime
from app.extensions import mongo

class NewsModel:
    @staticmethod
    def get_collection():
        return mongo.db.news
    
    @staticmethod
    def clear_all_news():
        """Clear all news from the collection"""
        collection = NewsModel.get_collection()
        collection.delete_many({})
    
    @staticmethod
    def insert_news(news_list):
        """Insert multiple news items into the collection"""
        if not news_list:
            return
        
        collection = NewsModel.get_collection()
        
        # Add timestamp to each news item
        for news in news_list:
            news['created_at'] = datetime.utcnow()
            news['scraped_at'] = datetime.utcnow()
        
        collection.insert_many(news_list)
    
    @staticmethod
    def get_all_news():
        """Get all news items sorted by creation date (newest first)"""
        collection = NewsModel.get_collection()
        return list(collection.find({}, {'_id': 0}).sort('created_at', -1))
    
    @staticmethod
    def get_latest_news(limit=5):
        """Get latest news items"""
        collection = NewsModel.get_collection()
        return list(collection.find({}, {'_id': 0}).sort('created_at', -1).limit(limit))