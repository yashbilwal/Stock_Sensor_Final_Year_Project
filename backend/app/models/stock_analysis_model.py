from datetime import datetime
from typing import Dict, Any, Optional

class StockAnalysis:
    def __init__(self, symbol: str, data: Dict[str, Any]):
        self.symbol = symbol
        self.data = data
        self.created_at = datetime.utcnow()
    
    def to_dict(self) -> Dict[str, Any]:
        """Convert the stock analysis to a dictionary for MongoDB storage"""
        return {
            "symbol": self.symbol,
            "data": self.data,
            "created_at": self.created_at,
            "updated_at": datetime.utcnow()
        }
    
    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> 'StockAnalysis':
        """Create a StockAnalysis instance from a dictionary"""
        return cls(
            symbol=data.get("symbol"),
            data=data.get("data", {})
        )

class StockAnalysisResponse:
    def __init__(self, success: bool, data: Optional[Dict[str, Any]] = None, error: Optional[str] = None):
        self.success = success
        self.data = data
        self.error = error
    
    def to_dict(self) -> Dict[str, Any]:
        """Convert response to dictionary for JSON serialization"""
        response = {
            "success": self.success,
            "timestamp": datetime.utcnow().isoformat()
        }
        
        if self.data:
            response["data"] = self.data
        
        if self.error:
            response["error"] = self.error
            
        return response
