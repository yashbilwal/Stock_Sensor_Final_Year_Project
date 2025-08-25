from flask import Blueprint, request, jsonify
from flask_cors import cross_origin
from app.services.stock_analysis_service import StockAnalysisService
from app.models.stock_analysis_model import StockAnalysisResponse
import logging

stock_bp = Blueprint('stock', __name__)

@stock_bp.route('/analyze', methods=['POST', 'OPTIONS'])
@cross_origin()
def analyze_stock():
    """Analyze a stock and return comprehensive report"""
    try:
        # Handle OPTIONS request for CORS preflight
        if request.method == 'OPTIONS':
            return jsonify({'status': 'ok'}), 200
            
        data = request.get_json()
        if not data or 'symbol' not in data:
            return jsonify({
                'success': False,
                'error': 'Stock symbol is required'
            }), 400
        
        symbol = data['symbol'].strip().upper()
        if not symbol:
            return jsonify({
                'success': False,
                'error': 'Stock symbol cannot be empty'
            }), 400
        
        # Check for cached analysis first (within last 1 hour)
        cached_response = StockAnalysisService.get_cached_analysis(symbol)
        if cached_response:
            return jsonify(cached_response.to_dict()), 200
        
        # Generate new analysis
        response = StockAnalysisService.generate_stock_report(symbol)
        return jsonify(response.to_dict()), 200 if response.success else 500
        
    except Exception as e:
        logging.error(f"Error in stock analysis: {str(e)}")
        return jsonify({
            'success': False,
            'error': f'Internal server error occurred: {str(e)}'
        }), 500

@stock_bp.route('/analyze/<symbol>', methods=['GET', 'OPTIONS'])
@cross_origin()
def get_stock_analysis(symbol):
    """Get stock analysis by symbol"""
    try:
        # Handle OPTIONS request for CORS preflight
        if request.method == 'OPTIONS':
            return jsonify({'status': 'ok'}), 200
            
        symbol = symbol.strip().upper()
        if not symbol:
            return jsonify({
                'success': False,
                'error': 'Stock symbol cannot be empty'
            }), 400
        
        # Check for cached analysis
        cached_response = StockAnalysisService.get_cached_analysis(symbol)
        if cached_response:
            return jsonify(cached_response.to_dict()), 200
        
        # Generate new analysis
        response = StockAnalysisService.generate_stock_report(symbol)
        return jsonify(response.to_dict()), 200 if response.success else 500
        
    except Exception as e:
        logging.error(f"Error in stock analysis: {str(e)}")
        return jsonify({
            'success': False,
            'error': f'Internal server error occurred: {str(e)}'
        }), 500

@stock_bp.route('/search', methods=['POST'])
def search_stocks():
    """Search for stocks by symbol or name"""
    try:
        data = request.get_json()
        if not data or 'query' not in data:
            return jsonify({
                'success': False,
                'error': 'Search query is required'
            }), 400
        
        query = data['query'].strip()
        if not query:
            return jsonify({
                'success': False,
                'error': 'Search query cannot be empty'
            }), 400
        
        # This is a placeholder - you can implement actual stock search logic
        # For now, return a simple response
        return jsonify({
            'success': True,
            'data': {
                'query': query,
                'results': [
                    {'symbol': 'TCS', 'name': 'Tata Consultancy Services Limited'},
                    {'symbol': 'RELIANCE', 'name': 'Reliance Industries Limited'},
                    {'symbol': 'INFY', 'name': 'Infosys Limited'},
                    {'symbol': 'HDFC', 'name': 'HDFC Bank Limited'},
                    {'symbol': 'ITC', 'name': 'ITC Limited'}
                ]
            }
        }), 200
        
    except Exception as e:
        logging.error(f"Error in stock search: {str(e)}")
        return jsonify({
            'success': False,
            'error': 'Internal server error occurred'
        }), 500

@stock_bp.route('/popular', methods=['GET'])
def get_popular_stocks():
    """Get list of popular stocks"""
    try:
        popular_stocks = [
            {'symbol': 'TCS', 'name': 'Tata Consultancy Services Limited', 'sector': 'Technology'},
            {'symbol': 'RELIANCE', 'name': 'Reliance Industries Limited', 'sector': 'Oil & Gas'},
            {'symbol': 'INFY', 'name': 'Infosys Limited', 'sector': 'Technology'},
            {'symbol': 'HDFC', 'name': 'HDFC Bank Limited', 'sector': 'Banks'},
            {'symbol': 'ITC', 'name': 'ITC Limited', 'sector': 'FMCG'},
            {'symbol': 'ICICIBANK', 'name': 'ICICI Bank Limited', 'sector': 'Banks'},
            {'symbol': 'HINDUNILVR', 'name': 'Hindustan Unilever Limited', 'sector': 'FMCG'},
            {'symbol': 'SBIN', 'name': 'State Bank of India', 'sector': 'Banks'},
            {'symbol': 'BHARTIARTL', 'name': 'Bharti Airtel Limited', 'sector': 'Telecom'},
            {'symbol': 'AXISBANK', 'name': 'Axis Bank Limited', 'sector': 'Banks'}
        ]
        
        return jsonify({
            'success': True,
            'data': popular_stocks
        }), 200
        
    except Exception as e:
        logging.error(f"Error getting popular stocks: {str(e)}")
        return jsonify({
            'success': False,
            'error': 'Internal server error occurred'
        }), 500

@stock_bp.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint for stock service"""
    return jsonify({
        'success': True,
        'message': 'Stock analysis service is running',
        'status': 'healthy'
    }), 200
