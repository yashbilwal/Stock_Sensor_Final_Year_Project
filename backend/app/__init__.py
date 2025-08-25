from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from app.extensions import mongo

def create_app():
    app = Flask(__name__)
    app.config.from_object("app.config.Config")

    # Set defaults if not provided
    app.config.setdefault("MONGO_URI", "mongodb://localhost:27017/stocksensor")
    app.config.setdefault("JWT_SECRET_KEY", "jwtsecret")

    # Init extensions with CORS configuration
    CORS(
        app,
        origins=app.config.get("CORS_ORIGINS", ["https://stocksensor.vercel.app"]),
        methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allow_headers=["Content-Type", "Authorization"],
        supports_credentials=True,
        resources={r"/api/*": {"origins": "https://stocksensor.vercel.app"}},
        always_send=True,  # ✅ fixed missing comma
    )

    # ---- Ensure CORS headers are always applied ----
    def add_cors_headers(response):
        try:
            allowed_origins = app.config.get("CORS_ORIGINS", ["https://stocksensor.vercel.app"])
            request_origin = request.headers.get("Origin")
            if request_origin and request_origin in allowed_origins:
                response.headers.setdefault("Access-Control-Allow-Origin", request_origin)
                response.headers.setdefault("Vary", "Origin")
                response.headers.setdefault("Access-Control-Allow-Credentials", "true")
                response.headers.setdefault(
                    "Access-Control-Allow-Headers", "Content-Type, Authorization"
                )
                response.headers.setdefault(
                    "Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS"
                )
        except Exception:
            pass
        return response

    @app.after_request
    def after_request(response):
        return add_cors_headers(response)

    # ---- Error handlers with CORS ----
    @app.errorhandler(404)
    def not_found_error(e):
        response = jsonify({"success": False, "error": "Resource not found"})
        response.status_code = 404
        return add_cors_headers(response)

    @app.errorhandler(500)
    def internal_error(e):
        response = jsonify({"success": False, "error": "Internal server error"})
        response.status_code = 500
        return add_cors_headers(response)

    # ---- Initialize MongoDB ----
    try:
        mongo.init_app(app)
        print(f"MongoDB initialized with URI: {app.config.get('MONGO_URI', 'default')}")
    except Exception as e:
        print(f"Warning: MongoDB initialization failed: {str(e)}")
        print("App will continue without database functionality")
        app.config["DB_AVAILABLE"] = False
    else:
        app.config["DB_AVAILABLE"] = True

    # ---- JWT ----
    JWTManager(app)

    # ---- Register routes ----
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
