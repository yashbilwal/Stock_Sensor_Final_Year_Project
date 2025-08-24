from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from app.extensions import mongo

def create_app():
    app = Flask(__name__)
    app.config.from_object("app.config.Config")

    # Set defaults if not provided
    app.config.setdefault("MONGO_URI", "mongodb://localhost:27017/stocksensor")
    app.config.setdefault("JWT_SECRET_KEY", "jwtsecret")

    # Init extensions
    CORS(app)
    mongo.init_app(app)
    JWTManager(app)

    # Register routes
    try:
        from app.routes import register_routes
        register_routes(app)
    except Exception:
        from app.routes.auth_routes import auth_bp
        from app.routes.news_routes import news_bp
        from app.routes.ping_routes import ping_bp
        from app.routes.stock_routes import stock_bp
        from app.routes.predict_routes import predict_bp
        
        app.register_blueprint(auth_bp, url_prefix="/api/auth")
        app.register_blueprint(news_bp, url_prefix="/api/news")
        app.register_blueprint(ping_bp, url_prefix="/api")
        app.register_blueprint(stock_bp, url_prefix="/api/stocks")
        app.register_blueprint(predict_bp, url_prefix="/api/predict")

    return app