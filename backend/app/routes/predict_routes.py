from flask import Blueprint, jsonify, request
from app.services.predict_service import PredictService
import logging
from datetime import datetime
import pytz

logger = logging.getLogger(__name__)

predict_bp = Blueprint('predict', __name__)
predict_service = PredictService()

@predict_bp.route('/predicted-stocks', methods=['GET'])
def get_predicted_stocks():
    """Get combined VCP and IPO Base results for the frontend PredictedStocksSection"""
    try:
        # Get VCP results
        vcp_result = predict_service.get_vcp_results()
        ipo_result = predict_service.get_ipo_results()
        
        if not vcp_result['success'] or not ipo_result['success']:
            return jsonify({
                "success": False,
                "message": "Failed to fetch pattern results"
            }), 500
        
        # Transform VCP results
        transformed_vcp = []
        for stock in vcp_result['data']:
            # Extract confidence percentage
            confidence_str = stock.get('confidence', '0%')
            confidence = int(confidence_str.replace('%', '')) if isinstance(confidence_str, str) else 0
            
            # Calculate time ago from timestamp
            timestamp = stock.get('timestamp')
            if timestamp:
                if isinstance(timestamp, str):
                    timestamp = datetime.fromisoformat(timestamp.replace('Z', '+00:00'))
                
                # Calculate time difference
                now = datetime.now(pytz.UTC)
                time_diff = now - timestamp.replace(tzinfo=pytz.UTC)
                
                if time_diff.days > 0:
                    timeline = f"{time_diff.days} days"
                elif time_diff.seconds > 3600:
                    hours = time_diff.seconds // 3600
                    timeline = f"{hours} hours"
                elif time_diff.seconds > 60:
                    minutes = time_diff.seconds // 60
                    timeline = f"{minutes} minutes"
                else:
                    timeline = "Just now"
            else:
                timeline = "Unknown"
            
            # Calculate target return based on confidence
            if confidence >= 80:
                target_return = "8-12%"
            elif confidence >= 60:
                target_return = "6-10%"
            else:
                target_return = "4-8%"
            
            transformed_vcp.append({
                "id": str(stock.get('_id', len(transformed_vcp) + 1)),
                "symbol": stock.get('symbol', ''),
                "name": stock.get('stock_name', ''),
                "price": stock.get('current_price', 0),  # Use current_price from database
                "setup": "VCP",
                "sector": stock.get('sector', 'Unknown'),
                "targetReturn": target_return,
                "timeline": timeline,
                "confidence": confidence,
                "original_data": stock
            })
        
        # Transform IPO results
        transformed_ipo = []
        for stock in ipo_result['data']:
            # Extract confidence percentage
            confidence_str = stock.get('confidence', '0%')
            confidence = int(confidence_str.replace('%', '')) if isinstance(confidence_str, str) else 0
            
            # Calculate time ago from timestamp
            timestamp = stock.get('timestamp')
            if timestamp:
                if isinstance(timestamp, str):
                    timestamp = datetime.fromisoformat(timestamp.replace('Z', '+00:00'))
                
                # Calculate time difference
                now = datetime.now(pytz.UTC)
                time_diff = now - timestamp.replace(tzinfo=pytz.UTC)
                
                if time_diff.days > 0:
                    timeline = f"{time_diff.days} days"
                elif time_diff.seconds > 3600:
                    hours = time_diff.seconds // 3600
                    timeline = f"{hours} hours"
                elif time_diff.seconds > 60:
                    minutes = time_diff.seconds // 60
                    timeline = f"{minutes} minutes"
                else:
                    timeline = "Just now"
            else:
                timeline = "Unknown"
            
            # Calculate target return based on confidence
            if confidence >= 80:
                target_return = "8-12%"
            elif confidence >= 60:
                target_return = "6-10%"
            else:
                target_return = "4-8%"
            
            transformed_ipo.append({
                "id": str(stock.get('_id', len(transformed_ipo) + 1)),
                "symbol": stock.get('symbol', ''),
                "name": stock.get('stock_name', ''),
                "price": stock.get('current_price', 0),  # Use current_price from database
                "setup": "IPO Base",
                "sector": stock.get('sector', 'Unknown'),
                "targetReturn": target_return,
                "timeline": timeline,
                "confidence": confidence,
                "original_data": stock
            })
        
        # Combine both results
        all_stocks = transformed_vcp + transformed_ipo
        
        # Sort by confidence (highest first)
        all_stocks.sort(key=lambda x: x['confidence'], reverse=True)
        
        return jsonify({
            "success": True,
            "data": all_stocks,
            "count": len(all_stocks),
            "vcp_count": len(transformed_vcp),
            "ipo_count": len(transformed_ipo)
        }), 200
        
    except Exception as e:
        logger.error(f"Error in get_predicted_stocks endpoint: {str(e)}")
        return jsonify({
            "success": False,
            "message": f"Internal server error: {str(e)}"
        }), 500

@predict_bp.route('/scrape-stocks', methods=['POST'])
def scrape_stocks():
    """Trigger stock scraping manually"""
    try:
        result = predict_service.run_stock_scraping()
        if result['success']:
            return jsonify({"success": True, "message": result['message']}), 200
        else:
            return jsonify({"success": False, "message": result['message']}), 500
    except Exception as e:
        logger.error(f"Error in scrape_stocks endpoint: {str(e)}")
        return jsonify({"success": False, "message": f"Internal server error: {str(e)}"}), 500

@predict_bp.route('/run-vcp-analysis', methods=['POST'])
def run_vcp_analysis():
    """Trigger VCP pattern analysis manually"""
    try:
        result = predict_service.run_vcp_analysis()
        if result['success']:
            return jsonify({"success": True, "message": result['message']}), 200
        else:
            return jsonify({"success": False, "message": result['message']}), 500
    except Exception as e:
        logger.error(f"Error in run_vcp_analysis endpoint: {str(e)}")
        return jsonify({"success": False, "message": f"Internal server error: {str(e)}"}), 500

@predict_bp.route('/run-ipo-analysis', methods=['POST'])
def run_ipo_analysis():
    """Trigger IPO Base pattern analysis manually"""
    try:
        result = predict_service.run_ipo_analysis()
        if result['success']:
            return jsonify({"success": True, "message": result['message']}), 200
        else:
            return jsonify({"success": False, "message": result['message']}), 500
    except Exception as e:
        logger.error(f"Error in run_ipo_analysis endpoint: {str(e)}")
        return jsonify({"success": False, "message": f"Internal server error: {str(e)}"}), 500

@predict_bp.route('/vcp-results', methods=['GET'])
def get_vcp_results():
    """Get VCP pattern detection results"""
    try:
        result = predict_service.get_vcp_results()
        if result['success']:
            return jsonify({"success": True, "data": result['data']}), 200
        else:
            return jsonify({"success": False, "message": result['message']}), 500
    except Exception as e:
        logger.error(f"Error in get_vcp_results endpoint: {str(e)}")
        return jsonify({"success": False, "message": f"Internal server error: {str(e)}"}), 500

@predict_bp.route('/ipo-results', methods=['GET'])
def get_ipo_results():
    """Get IPO Base pattern detection results"""
    try:
        result = predict_service.get_ipo_results()
        if result['success']:
            return jsonify({"success": True, "data": result['data']}), 200
        else:
            return jsonify({"success": False, "message": result['message']}), 500
    except Exception as e:
        logger.error(f"Error in get_ipo_results endpoint: {str(e)}")
        return jsonify({"success": False, "message": f"Internal server error: {str(e)}"}), 500

@predict_bp.route('/scraped-stocks', methods=['GET'])
def get_scraped_stocks():
    """Get scraped stock data"""
    try:
        result = predict_service.get_scraped_stocks()
        if result['success']:
            return jsonify({"success": True, "data": result['data']}), 200
        else:
            return jsonify({"success": False, "message": result['message']}), 500
    except Exception as e:
        logger.error(f"Error in get_scraped_stocks endpoint: {str(e)}")
        return jsonify({"success": False, "message": f"Internal server error: {str(e)}"}), 500

@predict_bp.route('/run-complete-analysis', methods=['POST'])
def run_complete_analysis():
    """Run both VCP and IPO Base analysis"""
    try:
        # Run VCP analysis
        vcp_result = predict_service.run_vcp_analysis()
        
        # Run IPO analysis
        ipo_result = predict_service.run_ipo_analysis()
        
        return jsonify({
            "success": True,
            "vcp_analysis": vcp_result,
            "ipo_analysis": ipo_result
        }), 200
    except Exception as e:
        logger.error(f"Error in run_complete_analysis endpoint: {str(e)}")
        return jsonify({"success": False, "message": f"Internal server error: {str(e)}"}), 500

@predict_bp.route('/status', methods=['GET'])
def get_prediction_status():
    """Get status of prediction system"""
    try:
        # Get counts from collections
        vcp_sample_count = predict_service.get_scraped_stocks()['data']['vcp_stocks'].__len__() if predict_service.get_scraped_stocks()['success'] else 0
        ipo_sample_count = predict_service.get_scraped_stocks()['data']['ipo_stocks'].__len__() if predict_service.get_scraped_stocks()['success'] else 0
        vcp_results_count = predict_service.get_vcp_results()['data'].__len__() if predict_service.get_vcp_results()['success'] else 0
        ipo_results_count = predict_service.get_ipo_results()['data'].__len__() if predict_service.get_ipo_results()['success'] else 0
        
        return jsonify({
            "success": True,
            "status": {
                "vcp_sample_count": vcp_sample_count,
                "ipo_sample_count": ipo_sample_count,
                "vcp_results_count": vcp_results_count,
                "ipo_results_count": ipo_results_count
            }
        }), 200
    except Exception as e:
        logger.error(f"Error in get_prediction_status endpoint: {str(e)}")
        return jsonify({"success": False, "message": f"Internal server error: {str(e)}"}), 500
