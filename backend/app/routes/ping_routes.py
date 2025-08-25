from flask import Blueprint, jsonify
from app.extensions import mongo
import logging

logger = logging.getLogger(__name__)
ping_bp = Blueprint('ping', __name__)

@ping_bp.route('/ping', methods=['GET'])
def ping():
    """Basic health check endpoint"""
    return jsonify({
        'status': 'success',
        'message': 'pong',
        'timestamp': '2025-08-25'
    })

@ping_bp.route('/health', methods=['GET'])
def health_check():
    """Comprehensive health check including database"""
    try:
        # Test MongoDB connection
        if mongo.db:
            # Try to list collections to test connection
            collections = mongo.db.list_collection_names()
            db_status = 'connected'
            db_info = f'Database accessible with {len(collections)} collections'
        else:
            db_status = 'disconnected'
            db_info = 'MongoDB connection not established'
        
        return jsonify({
            'status': 'success',
            'service': 'Stock Sensor Backend',
            'database': {
                'status': db_status,
                'info': db_info
            },
            'timestamp': '2025-08-25'
        })
        
    except Exception as e:
        logger.error(f"Health check failed: {str(e)}")
        return jsonify({
            'status': 'error',
            'service': 'Stock Sensor Backend',
            'database': {
                'status': 'error',
                'info': f'Database error: {str(e)}'
            },
            'timestamp': '2025-08-25'
        }), 500
