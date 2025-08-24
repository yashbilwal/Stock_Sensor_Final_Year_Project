from flask import Blueprint, jsonify
from app.services.news_service import NewsService

news_bp = Blueprint('news', __name__)

@news_bp.route('/live-news', methods=['GET'])
def get_live_news():
    """Get live news for the frontend LiveNewsSection"""
    try:
        # Get all news items sorted by creation date (newest first)
        news_items = NewsService.get_all_news()
        
        # Transform the data to match frontend expectations
        transformed_news = []
        for news in news_items:
            # Calculate time ago from created_at
            from datetime import datetime
            import pytz
            
            if 'created_at' in news:
                # Convert UTC to local time and calculate time ago
                utc_time = news['created_at']
                if isinstance(utc_time, str):
                    utc_time = datetime.fromisoformat(utc_time.replace('Z', '+00:00'))
                
                # Calculate time difference
                now = datetime.now(pytz.UTC)
                time_diff = now - utc_time.replace(tzinfo=pytz.UTC)
                
                if time_diff.days > 0:
                    time_ago = f"{time_diff.days} days ago"
                elif time_diff.seconds > 3600:
                    hours = time_diff.seconds // 3600
                    time_ago = f"{hours} hours ago"
                elif time_diff.seconds > 60:
                    minutes = time_diff.seconds // 60
                    time_ago = f"{minutes} minutes ago"
                else:
                    time_ago = "Just now"
            else:
                time_ago = "Unknown"
            
            # Transform sentiment to match frontend expectations
            sentiment = news.get('sentiment', 'neutral').capitalize()
            if sentiment.lower() == 'neutral':
                sentiment = 'Neutral'
            
            transformed_news.append({
                'id': str(news.get('_id', len(transformed_news) + 1)),
                'headline': news.get('headline', ''),
                'timestamp': time_ago,
                'sentiment': sentiment,
                'source': news.get('source', 'Unknown'),
                'summary': news.get('headline', '')[:100] + '...' if len(news.get('headline', '')) > 100 else news.get('headline', ''),
                'url': news.get('url', '#')
            })
        
        return jsonify({
            'success': True,
            'data': transformed_news,
            'count': len(transformed_news)
        }), 200
        
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Failed to fetch live news: {str(e)}'
        }), 500

@news_bp.route('/hot-news', methods=['GET'])
def get_hot_news():
    """Get all hot news with sentiment analysis"""
    try:
        news_items = NewsService.get_all_news()
        return jsonify({
            'success': True,
            'data': news_items,
            'count': len(news_items)
        }), 200
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Failed to fetch news: {str(e)}'
        }), 500

@news_bp.route('/latest-news', methods=['GET'])
def get_latest_news():
    """Get latest news items (limited to 5)"""
    try:
        news_items = NewsService.get_latest_news()
        return jsonify({
            'success': True,
            'data': news_items,
            'count': len(news_items)
        }), 200
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Failed to fetch latest news: {str(e)}'
        }), 500