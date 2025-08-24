from datetime import datetime
from typing import Dict, Any, Optional

class VCPPattern:
    """Model for VCP (Volatility Contraction Pattern) detection results"""
    
    def __init__(self, symbol: str, stock_name: str, sector: str, 
                 confidence: int, timestamp: datetime, is_detected: bool = True):
        self.symbol = symbol
        self.stock_name = stock_name
        self.sector = sector
        self.confidence = confidence
        self.timestamp = timestamp
        self.is_detected = is_detected
    
    def to_dict(self) -> Dict[str, Any]:
        return {
            "symbol": self.symbol,
            "stock_name": self.stock_name,
            "sector": self.sector,
            "confidence": f"{self.confidence}%",
            "timestamp": self.timestamp,
            "is_detected": "Yes" if self.is_detected else "No"
        }

class IPOBasePattern:
    """Model for IPO Base Pattern detection results"""
    
    def __init__(self, symbol: str, stock_name: str, sector: str, 
                 confidence: int, timestamp: datetime, is_detected: bool = True):
        self.symbol = symbol
        self.stock_name = stock_name
        self.sector = sector
        self.confidence = confidence
        self.timestamp = timestamp
        self.is_detected = is_detected
    
    def to_dict(self) -> Dict[str, Any]:
        return {
            "symbol": self.symbol,
            "stock_name": self.stock_name,
            "sector": self.sector,
            "confidence": f"{self.confidence}%",
            "timestamp": self.timestamp,
            "is_detected": "Yes" if self.is_detected else "No"
        }

class ScrapedStock:
    """Model for scraped stock data"""
    
    def __init__(self, stock_name: str, symbol: str, percent_change: float, 
                 price: float, source: str, scraped_at: float):
        self.stock_name = stock_name
        self.symbol = symbol
        self.percent_change = percent_change
        self.price = price
        self.source = source
        self.scraped_at = scraped_at
    
    def to_dict(self) -> Dict[str, Any]:
        return {
            "stock_name": self.stock_name,
            "symbol": self.symbol,
            "percent_change": self.percent_change,
            "price": self.price,
            "source": self.source,
            "scraped_at": self.scraped_at
        }
