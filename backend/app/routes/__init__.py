from flask import Blueprint
from .ping_routes import ping_bp
from .auth_routes import auth_bp
from .predict_routes import predict_bp
from .news_routes import news_bp
from .stock_routes import stock_bp

def register_routes(app):
    app.register_blueprint(ping_bp, url_prefix="/api")
    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(predict_bp, url_prefix="/api/predict")
    app.register_blueprint(news_bp, url_prefix="/api/news")
    app.register_blueprint(stock_bp, url_prefix="/api/stocks")
