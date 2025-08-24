from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.triggers.interval import IntervalTrigger
from apscheduler.triggers.cron import CronTrigger
from app.services.news_service import NewsService
from app.services.predict_service import PredictService
import logging

logger = logging.getLogger(__name__)

scheduler = BackgroundScheduler()
predict_service = PredictService()

def init_scheduler(app):
    """Initialize the scheduler with the Flask app context"""
    
    def scheduled_news_scraping():
        with app.app_context():
            try:
                logger.info("Starting scheduled news scraping...")
                result = NewsService.scrape_and_store_news()
                if result['success']:
                    logger.info(f"Scheduled news scraping completed: {result['message']}")
                else:
                    logger.error(f"Scheduled news scraping failed: {result['message']}")
            except Exception as e:
                logger.error(f"Error in scheduled news scraping: {str(e)}")
    
    def scheduled_stock_scraping():
        with app.app_context():
            try:
                logger.info("Starting scheduled stock scraping...")
                result = predict_service.run_stock_scraping()
                if result['success']:
                    logger.info(f"Scheduled stock scraping completed: {result['message']}")
                else:
                    logger.error(f"Scheduled stock scraping failed: {result['message']}")
            except Exception as e:
                logger.error(f"Error in scheduled stock scraping: {str(e)}")
    
    def scheduled_pattern_detection():
        with app.app_context():
            try:
                logger.info("Starting scheduled pattern detection...")
                
                # Run VCP analysis
                vcp_result = predict_service.run_vcp_analysis()
                if vcp_result['success']:
                    logger.info(f"VCP analysis completed: {vcp_result['message']}")
                else:
                    logger.error(f"VCP analysis failed: {vcp_result['message']}")
                
                # Run IPO analysis
                ipo_result = predict_service.run_ipo_analysis()
                if ipo_result['success']:
                    logger.info(f"IPO analysis completed: {ipo_result['message']}")
                else:
                    logger.error(f"IPO analysis failed: {ipo_result['message']}")
                    
            except Exception as e:
                logger.error(f"Error in scheduled pattern detection: {str(e)}")
    
    # Schedule news scraping every 5 hours
    scheduler.add_job(
        func=scheduled_news_scraping,
        trigger=IntervalTrigger(hours=5),
        id='news_scraping_job',
        name='Scrape Economic Times news every 5 hours',
        replace_existing=True
    )
    
    # Schedule stock scraping daily at 4:30 PM
    scheduler.add_job(
        func=scheduled_stock_scraping,
        trigger=CronTrigger(hour=16, minute=30),  # 4:30 PM
        id='stock_scraping_job',
        name='Scrape Chartink stock data daily at 4:30 PM',
        replace_existing=True
    )
    
    # Schedule pattern detection daily at 5:30 PM
    scheduler.add_job(
        func=scheduled_pattern_detection,
        trigger=CronTrigger(hour=17, minute=30),  # 5:30 PM
        id='pattern_detection_job',
        name='Run pattern detection daily at 5:30 PM',
        replace_existing=True
    )
    
    # Start the scheduler
    if not scheduler.running:
        scheduler.start()
        logger.info("Scheduler started successfully")
    
    # Also run immediately on startup
    scheduled_news_scraping()