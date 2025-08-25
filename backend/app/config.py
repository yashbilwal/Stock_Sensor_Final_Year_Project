import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    SECRET_KEY = os.getenv("SECRET_KEY", "supersecretkey")
    MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017/stocksensor")
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "jwtsecret")
    
    # Production settings
    DEBUG = os.getenv("DEBUG", "False").lower() == "true"
    TESTING = False
    
    # CORS settings for production
    CORS_ORIGINS = os.getenv("CORS_ORIGINS", "https://stocksensor.vercel.app").split(",")