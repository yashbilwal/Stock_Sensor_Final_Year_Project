import yfinance as yf
import pandas as pd
import numpy as np
try:
    import talib
    TALIB_AVAILABLE = True
except ImportError:
    TALIB_AVAILABLE = False
    print("Warning: TA-Lib not available. Some technical indicators will be disabled.")
from datetime import datetime, timedelta
import warnings
import os
from dotenv import load_dotenv
from pymongo import MongoClient
import logging
from app.models.predict_model import VCPPattern, IPOBasePattern
from app.utils.scraper_utils import ChartinkScraper

warnings.filterwarnings('ignore')
load_dotenv()

logger = logging.getLogger(__name__)

# MongoDB Connection
MONGO_URI = os.getenv("MONGO_URI")
client = MongoClient(MONGO_URI)
db = client["stocksensor"]

# Collections
VCP_sample = db["VCP_sample"]
IPO_Base_sample = db["IPO_Base_sample"]
VCP_results = db["VCP_results"]
IPO_Base_results = db["IPO_Base_results"]


class VCPDetector:
    def __init__(self):
        self.min_contraction_percentage = 15  # Minimum contraction required
        self.min_volume_contraction = 20     # Minimum volume contraction
        self.min_pattern_length = 20         # Minimum days for pattern
        self.max_pattern_length = 65         # Maximum days for pattern

    def get_stock_data(self, symbol, period='6mo'):
        """Fetch stock data"""
        try:
            if not symbol.endswith(('.NS', '.BO')):
                symbol += '.NS'

            stock = yf.Ticker(symbol)
            df = stock.history(period=period)

            if df.empty:
                return None

            # Technical indicators - only if talib is available
            if TALIB_AVAILABLE:
                df['SMA_20'] = talib.SMA(df['Close'], timeperiod=20)
                df['SMA_50'] = talib.SMA(df['Close'], timeperiod=50)
                df['RSI'] = talib.RSI(df['Close'], timeperiod=14)
                df['ATR'] = talib.ATR(df['High'], df['Low'], df['Close'], timeperiod=14)
            else:
                # Fallback calculations without talib
                df['SMA_20'] = df['Close'].rolling(window=20).mean()
                df['SMA_50'] = df['Close'].rolling(window=50).mean()
                # Simple RSI calculation
                delta = df['Close'].diff()
                gain = (delta.where(delta > 0, 0)).rolling(window=14).mean()
                loss = (-delta.where(delta < 0, 0)).rolling(window=14).mean()
                rs = gain / loss
                df['RSI'] = 100 - (100 / (1 + rs))
                # Simple ATR calculation
                high_low = df['High'] - df['Low']
                high_close = np.abs(df['High'] - df['Close'].shift())
                low_close = np.abs(df['Low'] - df['Close'].shift())
                ranges = pd.concat([high_low, high_close, low_close], axis=1)
                true_range = np.max(ranges, axis=1)
                df['ATR'] = true_range.rolling(window=14).mean()

            return df
        except Exception:
            return None

    def calculate_price_contraction(self, highs, lows):
        if len(highs) < 2:
            return 0
        initial_range = highs[0] - lows[0]
        final_range = highs[-1] - lows[-1]
        if initial_range == 0:
            return 0
        return ((initial_range - final_range) / initial_range) * 100

    def calculate_volume_contraction(self, volumes):
        if len(volumes) < 2:
            return 0
        initial_volume = np.mean(volumes[:3])
        final_volume = np.mean(volumes[-3:])
        if initial_volume == 0:
            return 0
        return ((initial_volume - final_volume) / initial_volume) * 100

    def find_swing_highs_lows(self, df, window=5):
        highs, lows, dates = [], [], []
        for i in range(window, len(df) - window):
            current_high = df['High'].iloc[i]
            current_low = df['Low'].iloc[i]
            if current_high == df['High'].iloc[i-window:i+window+1].max():
                highs.append(current_high)
                dates.append(df.index[i])
            if current_low == df['Low'].iloc[i-window:i+window+1].min():
                lows.append(current_low)
        return highs, lows, dates

    def detect_vcp_pattern(self, df):
        if df is None or len(df) < 30:
            return False, 0

        recent_df = df.tail(90)
        highs, lows, dates = self.find_swing_highs_lows(recent_df)

        if len(highs) < 3 or len(lows) < 3:
            return False, 0

        price_contraction = self.calculate_price_contraction(highs[-3:], lows[-3:])
        volume_contraction = self.calculate_volume_contraction(recent_df['Volume'].values[-20:])

        current_price = recent_df['Close'].iloc[-1]
        sma_20 = recent_df['SMA_20'].iloc[-1]
        sma_50 = recent_df['SMA_50'].iloc[-1]

        price_above_sma50 = current_price > sma_50
        atr_contraction = (recent_df['ATR'].iloc[-1] / recent_df['ATR'].iloc[-20] - 1) * 100

        conditions = [
            price_contraction >= self.min_contraction_percentage,
            volume_contraction >= self.min_volume_contraction,
            price_above_sma50,
            atr_contraction < -10,
            recent_df['RSI'].iloc[-1] > 40,
            len(recent_df) >= self.min_pattern_length
        ]

        if all(conditions):
            confidence = min(100, int((price_contraction + volume_contraction) / 2))
            return True, confidence
        else:
            return False, 0


class IPOPatternDetector:
    def __init__(self):
        self.max_weeks_post_ipo = 12
        self.min_base_weeks = 3
        self.max_base_weeks = 12
        self.max_depth_percent = 25
        self.volume_surge_threshold = 1.4

        # Predefined IPO dates (extendable)
        self.ipo_dates = {
            'ZOMATO': '2021-07-23',
            'PAYTM': '2021-11-18',
            'NYKAA': '2021-11-10',
            'LICI': '2022-05-17',
            'MOTHERSON': '2022-05-09',
            'LATENTVIEW': '2021-11-23',
            'DEEPAKNTR': '2021-08-23',
            'BAJAJ-ENERGY': '2021-10-11',
            'ROLEXRINGS': '2022-02-16',
            'TARC': '2021-10-11'
        }

    def get_ipo_date(self, symbol):
        """Fetch IPO date from predefined list"""
        symbol_clean = symbol.replace('.NS', '').replace('.BO', '').upper()
        return pd.to_datetime(self.ipo_dates.get(symbol_clean)) if symbol_clean in self.ipo_dates else None

    def get_stock_data(self, symbol):
        """Fetch stock data with fallback NSE/BO"""
        try:
            symbols_to_try = [f"{symbol}.NS", f"{symbol}.BO"]
            end_date = datetime.now()
            start_date = end_date - timedelta(days=400)

            for sym in symbols_to_try:
                stock = yf.download(sym, start=start_date, end=end_date, progress=False)
                if not stock.empty and len(stock) > 30:
                    return stock
            return None
        except Exception:
            return None

    def calculate_technical_indicators(self, df):
        """Add indicators safely"""
        df = df.copy()
        df['SMA_20'] = df['Close'].rolling(window=20, min_periods=1).mean()
        df['SMA_50'] = df['Close'].rolling(window=50, min_periods=1).mean()
        df['Volume_MA'] = df['Volume'].rolling(window=20, min_periods=1).mean()

        volume_ma = df['Volume_MA'].values
        volume = df['Volume'].values
        ratio = np.array([volume[i] / volume_ma[i] if volume_ma[i] > 0 else 1.0 for i in range(len(volume))])
        df['Volume_Ratio'] = ratio

        df['Daily_Return'] = df['Close'].pct_change()
        df['Volatility'] = df['Daily_Return'].rolling(window=10, min_periods=1).std()

        return df.dropna()

    def detect_breakout(self, df, ipo_high):
        try:
            if len(df) < 5 or ipo_high <= 0:
                return False, False
            recent_data = df.tail(5)
            current_price = df['Close'].iloc[-1]
            price_crossed = any(recent_data['High'] > ipo_high)
            volume_surge = False
            if price_crossed:
                breakout_days = recent_data[recent_data['High'] > ipo_high * 0.99]
                if len(breakout_days) > 0:
                    volume_surge = any(breakout_days['Volume_Ratio'] > self.volume_surge_threshold)
            breakout_occurred = price_crossed and volume_surge
            near_breakout = current_price >= ipo_high * 0.98
            return breakout_occurred, near_breakout
        except:
            return False, False

    def detect_ipo_base_pattern(self, df, symbol):
        """Core IPO base detection"""
        if df is None or len(df) < 40:
            return False, 0

        ipo_date = self.get_ipo_date(symbol)
        if ipo_date is None:
            return False, 0

        post_ipo_data = df[df.index >= ipo_date]
        if len(post_ipo_data) < 20:
            return False, 0

        weeks_since_ipo = (datetime.now().date() - ipo_date.date()).days // 7
        if weeks_since_ipo > self.max_weeks_post_ipo:
            return False, 0

        ipo_high = post_ipo_data['High'].max()
        ipo_high_date = post_ipo_data['High'].idxmax()
        post_high_data = post_ipo_data[post_ipo_data.index >= ipo_high_date]
        if len(post_high_data) < 15:
            return False, 0

        consolidation_weeks = len(post_high_data) // 5
        if not (self.min_base_weeks <= consolidation_weeks <= self.max_base_weeks):
            return False, 0

        depth_percent = ((ipo_high - post_high_data['Low'].min()) / ipo_high) * 100
        if depth_percent > self.max_depth_percent:
            return False, 0

        breakout, near_breakout = self.detect_breakout(df, ipo_high)

        confidence = 0
        if 1 <= weeks_since_ipo <= 12: confidence += 20
        if self.min_base_weeks <= consolidation_weeks <= self.max_base_weeks: confidence += 20
        if depth_percent <= self.max_depth_percent: confidence += 20
        if breakout: confidence += 30
        elif near_breakout: confidence += 15

        confidence = min(confidence, 100)
        return (confidence >= 70), confidence


class PredictService:
    def __init__(self):
        self.vcp_detector = VCPDetector()
        self.ipo_detector = IPOPatternDetector()

    def run_stock_scraping(self):
        """Run Chartink stock scraping"""
        try:
            logger.info("Starting Chartink stock scraping...")
            scraper = ChartinkScraper()
            scraper.run_scraping()
            logger.info("Chartink stock scraping completed successfully")
            return {"success": True, "message": "Stock scraping completed"}
        except Exception as e:
            logger.error(f"Error in stock scraping: {str(e)}")
            return {"success": False, "message": f"Stock scraping failed: {str(e)}"}

    def run_vcp_analysis(self):
        """Run VCP pattern analysis"""
        try:
            logger.info("Starting VCP pattern analysis...")
            
            symbols = VCP_sample.distinct("symbol")
            if not symbols:
                logger.warning("No stocks found in VCP_sample collection")
                return {"success": False, "message": "No stocks found for VCP analysis"}

            detected_count = 0
            for symbol in symbols:
                try:
                    df = self.vcp_detector.get_stock_data(symbol)
                    if df is None:
                        continue

                    detected, confidence = self.vcp_detector.detect_vcp_pattern(df)

                    if detected:
                        # Get stock info from Yahoo Finance
                        stock = yf.Ticker(symbol + ".NS" if not symbol.endswith(('.NS', '.BO')) else symbol)
                        info = stock.info
                        stock_name = info.get("longName", symbol)
                        sector = info.get("sector", "Unknown")
                        
                        # Get current price from VCP_sample collection
                        sample_data = VCP_sample.find_one({"symbol": symbol})
                        current_price = sample_data.get("price", 0) if sample_data else 0

                        VCP_results.update_one(
                            {"symbol": symbol},
                            {"$set": {
                                "is_detected": "Yes",
                                "symbol": symbol,
                                "stock_name": stock_name,
                                "sector": sector,
                                "confidence": f"{confidence}%",
                                "current_price": current_price,
                                "timestamp": datetime.now()
                            }},
                            upsert=True
                        )
                        detected_count += 1
                        logger.info(f"VCP Pattern detected for {symbol} - {confidence}% confidence, Price: ₹{current_price}")

                except Exception as e:
                    logger.error(f"Error analyzing VCP for {symbol}: {e}")
                    continue

            logger.info(f"VCP analysis completed. Detected {detected_count} patterns.")
            return {"success": True, "message": f"VCP analysis completed. Detected {detected_count} patterns."}

        except Exception as e:
            logger.error(f"Error in VCP analysis: {str(e)}")
            return {"success": False, "message": f"VCP analysis failed: {str(e)}"}

    def run_ipo_analysis(self):
        """Run IPO Base pattern analysis"""
        try:
            logger.info("Starting IPO Base pattern analysis...")
            
            symbols = IPO_Base_sample.distinct("symbol")
            if not symbols:
                logger.warning("No stocks found in IPO_Base_sample collection")
                return {"success": False, "message": "No stocks found for IPO analysis"}

            detected_count = 0
            for symbol in symbols:
                try:
                    df = self.ipo_detector.get_stock_data(symbol)
                    if df is None:
                        continue

                    df = self.ipo_detector.calculate_technical_indicators(df)
                    detected, confidence = self.ipo_detector.detect_ipo_base_pattern(df, symbol)

                    if detected:
                        # Get stock info from Yahoo Finance
                        stock = yf.Ticker(symbol + ".NS" if not symbol.endswith(('.NS', '.BO')) else symbol)
                        info = stock.info
                        stock_name = info.get("longName", symbol)
                        sector = info.get("sector", "Unknown")
                        
                        # Get current price from IPO_Base_sample collection
                        sample_data = IPO_Base_sample.find_one({"symbol": symbol})
                        current_price = sample_data.get("price", 0) if sample_data else 0

                        IPO_Base_results.update_one(
                            {"symbol": symbol},
                            {"$set": {
                                "is_detected": "Yes",
                                "symbol": symbol,
                                "stock_name": stock_name,
                                "sector": sector,
                                "confidence": f"{confidence}%",
                                "current_price": current_price,
                                "timestamp": datetime.now()
                            }},
                            upsert=True
                        )
                        detected_count += 1
                        logger.info(f"IPO Base Pattern detected for {symbol} - {confidence}% confidence, Price: ₹{current_price}")

                except Exception as e:
                    logger.error(f"Error analyzing IPO Base for {symbol}: {e}")
                    continue

            logger.info(f"IPO Base analysis completed. Detected {detected_count} patterns.")
            return {"success": True, "message": f"IPO Base analysis completed. Detected {detected_count} patterns."}

        except Exception as e:
            logger.error(f"Error in IPO Base analysis: {str(e)}")
            return {"success": False, "message": f"IPO Base analysis failed: {str(e)}"}

    def get_vcp_results(self):
        """Get VCP pattern detection results"""
        try:
            results = list(VCP_results.find({"is_detected": "Yes"}))
            return {"success": True, "data": results}
        except Exception as e:
            logger.error(f"Error fetching VCP results: {str(e)}")
            return {"success": False, "message": f"Error fetching VCP results: {str(e)}"}

    def get_ipo_results(self):
        """Get IPO Base pattern detection results"""
        try:
            results = list(IPO_Base_results.find({"is_detected": "Yes"}))
            return {"success": True, "data": results}
        except Exception as e:
            logger.error(f"Error fetching IPO results: {str(e)}")
            return {"success": False, "message": f"Error fetching IPO results: {str(e)}"}

    def get_scraped_stocks(self):
        """Get scraped stock data"""
        try:
            vcp_stocks = list(VCP_sample.find())
            ipo_stocks = list(IPO_Base_sample.find())
            return {
                "success": True, 
                "data": {
                    "vcp_stocks": vcp_stocks,
                    "ipo_stocks": ipo_stocks
                }
            }
        except Exception as e:
            logger.error(f"Error fetching scraped stocks: {str(e)}")
            return {"success": False, "message": f"Error fetching scraped stocks: {str(e)}"}
