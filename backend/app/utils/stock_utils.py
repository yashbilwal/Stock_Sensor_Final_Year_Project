import re
from typing import Dict, Any, Optional
import yfinance as yf

def validate_stock_symbol(symbol: str) -> bool:
    """Validate if the stock symbol is valid"""
    if not symbol or not isinstance(symbol, str):
        return False
    
    # Remove common suffixes and clean symbol
    clean_symbol = re.sub(r'\.(NS|BSE|NSE)$', '', symbol.upper())
    
    # Basic validation - should be alphanumeric and 2-10 characters
    if not re.match(r'^[A-Z0-9]{2,10}$', clean_symbol):
        return False
    
    return True

def format_currency(value: Any) -> str:
    """Format currency values"""
    if value == 'N/A' or value is None:
        return 'N/A'
    
    try:
        if isinstance(value, str):
            value = float(value)
        
        if value >= 1e12:
            return f"₹{value/1e12:.2f}T"
        elif value >= 1e9:
            return f"₹{value/1e9:.2f}B"
        elif value >= 1e6:
            return f"₹{value/1e6:.2f}M"
        elif value >= 1e3:
            return f"₹{value/1e3:.2f}K"
        else:
            return f"₹{value:.2f}"
    except:
        return str(value)

def format_percentage(value: Any) -> str:
    """Format percentage values"""
    if value == 'N/A' or value is None:
        return 'N/A'
    
    try:
        if isinstance(value, str):
            value = float(value)
        return f"{value:.2f}%"
    except:
        return str(value)

def get_stock_info(symbol: str) -> Optional[Dict[str, Any]]:
    """Get basic stock information"""
    try:
        nse_symbol = f"{symbol.upper()}.NS"
        stock = yf.Ticker(nse_symbol)
        info = stock.info
        
        if not info or 'regularMarketPrice' not in info:
            return None
        
        return {
            'symbol': symbol.upper(),
            'name': info.get('longName', symbol.upper()),
            'sector': info.get('sector', 'N/A'),
            'current_price': info.get('regularMarketPrice', 'N/A'),
            'market_cap': info.get('marketCap', 'N/A'),
            'pe_ratio': info.get('trailingPE', 'N/A'),
            'volume': info.get('volume', 'N/A')
        }
    except Exception:
        return None

def calculate_valuation_rating(pe_ratio: float, sector_pe: float) -> str:
    """Calculate valuation rating based on P/E ratio"""
    if pe_ratio == 'N/A' or sector_pe == 'N/A':
        return 'N/A'
    
    try:
        pe_ratio = float(pe_ratio)
        sector_pe = float(sector_pe)
        
        if pe_ratio < sector_pe * 0.8:
            return 'Undervalued'
        elif pe_ratio > sector_pe * 1.2:
            return 'Overvalued'
        else:
            return 'Fairly Valued'
    except:
        return 'N/A'

def get_technical_signal(rsi: float, macd_histogram: float) -> str:
    """Get technical trading signal"""
    if rsi == 'N/A' or macd_histogram == 'N/A':
        return 'Neutral'
    
    try:
        rsi = float(rsi)
        macd_histogram = float(macd_histogram)
        
        # Simple signal logic
        if rsi < 30 and macd_histogram > 0:
            return 'Strong Buy'
        elif rsi < 40 and macd_histogram > 0:
            return 'Buy'
        elif rsi > 70 and macd_histogram < 0:
            return 'Strong Sell'
        elif rsi > 60 and macd_histogram < 0:
            return 'Sell'
        else:
            return 'Hold'
    except:
        return 'Neutral'

def sanitize_stock_data(data: Dict[str, Any]) -> Dict[str, Any]:
    """Sanitize stock data for JSON serialization"""
    def sanitize_value(value):
        if isinstance(value, (int, float, str, bool, type(None))):
            return value
        elif isinstance(value, dict):
            return {k: sanitize_value(v) for k, v in value.items()}
        elif isinstance(value, list):
            return [sanitize_value(v) for v in value]
        else:
            return str(value)
    
    return sanitize_value(data)

def get_cache_key(symbol: str, analysis_type: str = 'full') -> str:
    """Generate cache key for stock analysis"""
    return f"stock_analysis:{symbol.upper()}:{analysis_type}"

def parse_shareholding_data(text: str) -> Dict[str, float]:
    """Parse shareholding pattern from text"""
    import re
    
    patterns = {
        'promoter': r'promoter[s]?\s*:?\s*(\d+\.?\d*)%?',
        'institutions': r'institution[s]?\s*:?\s*(\d+\.?\d*)%?',
        'retail': r'retail\s*:?\s*(\d+\.?\d*)%?',
        'public': r'public\s*:?\s*(\d+\.?\d*)%?',
        'others': r'other[s]?\s*:?\s*(\d+\.?\d*)%?'
    }
    
    result = {}
    for key, pattern in patterns.items():
        match = re.search(pattern, text, re.IGNORECASE)
        if match:
            try:
                result[key] = float(match.group(1))
            except:
                pass
    
    return result
