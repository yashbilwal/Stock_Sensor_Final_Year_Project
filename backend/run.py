# run.py
from app import create_app
from app.tasks.scheduler import init_scheduler
import logging
import os

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

app = create_app()

# Initialize scheduler with the app instance
try:
    init_scheduler(app)
    logger.info("Backend initialized successfully with scheduler")
except Exception as e:
    logger.error(f"Error initializing scheduler: {str(e)}")

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    logger.info(f"Starting Stock Sensor Backend on port {port}...")
    app.run(host="0.0.0.0", port=port, debug=False)