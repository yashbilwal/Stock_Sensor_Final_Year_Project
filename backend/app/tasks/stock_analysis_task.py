from celery import Celery
from app.services.stock_analysis_service import StockAnalysisService
from app.models.stock_analysis_model import StockAnalysis
from app.extensions import mongo
import logging

# Initialize Celery
celery = Celery('stock_analysis', broker='redis://localhost:6379/0')

@celery.task(bind=True)
def analyze_stock_task(self, symbol):
    """Background task to analyze stock"""
    try:
        self.update_state(state='PROGRESS', meta={'status': 'Starting analysis...'})
        
        # Generate stock report
        response = StockAnalysisService.generate_stock_report(symbol)
        
        if response.success:
            self.update_state(state='SUCCESS', meta={'status': 'Analysis completed'})
            return {
                'success': True,
                'symbol': symbol,
                'data': response.data
            }
        else:
            self.update_state(state='FAILURE', meta={'status': 'Analysis failed'})
            return {
                'success': False,
                'symbol': symbol,
                'error': response.error
            }
            
    except Exception as e:
        logging.error(f"Error in stock analysis task: {str(e)}")
        self.update_state(state='FAILURE', meta={'status': 'Task failed'})
        return {
            'success': False,
            'symbol': symbol,
            'error': str(e)
        }

@celery.task
def cleanup_old_analyses():
    """Clean up old stock analyses from database"""
    try:
        from datetime import datetime, timedelta
        
        # Remove analyses older than 24 hours
        cutoff_time = datetime.utcnow() - timedelta(hours=24)
        
        result = mongo.db.stock_analyses.delete_many({
            "created_at": {"$lt": cutoff_time}
        })
        
        logging.info(f"Cleaned up {result.deleted_count} old stock analyses")
        return result.deleted_count
        
    except Exception as e:
        logging.error(f"Error cleaning up old analyses: {str(e)}")
        return 0

@celery.task
def update_popular_stocks():
    """Update analysis for popular stocks"""
    try:
        popular_symbols = ['TCS', 'RELIANCE', 'INFY', 'HDFC', 'ITC']
        
        for symbol in popular_symbols:
            try:
                StockAnalysisService.generate_stock_report(symbol)
                logging.info(f"Updated analysis for {symbol}")
            except Exception as e:
                logging.error(f"Failed to update {symbol}: {str(e)}")
                
        return len(popular_symbols)
        
    except Exception as e:
        logging.error(f"Error updating popular stocks: {str(e)}")
        return 0
