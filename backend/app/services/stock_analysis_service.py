import yfinance as yf
import pandas as pd
from alpha_vantage.timeseries import TimeSeries
from alpha_vantage.techindicators import TechIndicators
import mplfinance as mpf
import matplotlib.pyplot as plt
from datetime import datetime, timedelta
import os
import time
import threading
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.options import Options
from app.models.stock_analysis_model import StockAnalysis, StockAnalysisResponse
from app.extensions import mongo
import base64
import io

# ----------------------------
# CONFIGURATION
# ----------------------------
ALPHA_VANTAGE_API_KEY = 'LOEJV96LZZ7I03HU'

# Initialize API clients
ts = TimeSeries(key=ALPHA_VANTAGE_API_KEY, output_format='pandas', indexing_type='date')
ti = TechIndicators(key=ALPHA_VANTAGE_API_KEY, output_format='pandas', indexing_type='date')

# ----------------------------
# SECTOR P/E MAPPING
# ----------------------------
SECTOR_PE_MAPPING = {
    'Banks': 13.38,
    'Software & IT Services': 36.03,
    'Finance': 90.19,
    'Automobile & Ancillaries': 33.4,
    'Healthcare': 47.93,
    'Technology': 43.85,
    'Oil & Gas': 16.17,
    'Metals & Mining': 16.72,
    'FMCG': 66.29,
    'Capital Goods': 99.34,
    'Chemicals': 47.87,
    'Power': 17.94,
    'Telecom': 223.75,
    'Infrastructure': 27.55,
    'Insurance': 21.49,
    'Real Estate': 49.65,
    'Construction Materials': 50.11,
    'Diversified': 19.04,
    'Aviation': 42.94,
    'Retailing': 114.47,
    'Miscellaneous': 65.47,
    'Diamond  &  Jewellery': 68.49,
    'Hospitality': 61.01,
    'Consumer Durables': 62.49,
    'Consumer Defensive': 22.39,
    'Trading': 35.22,
    'Agri': 29.86,
    'Textiles': 73.45,
    'Electricals': 58.41,
    'Energy': 14.56,
    'Industrial Gases & Fuels': 18.61,
    'Alcohol': 66.36,
    'Logistics': 30.32,
    'Plastic Products': 35.24,
    'Ship Building': 53.4,
    'Media & Entertainment': 464.47,
    'Footwear': 68.79,
    'ETF': 0.0,
    'Manufacturing': 49.56,
    'Containers & Packaging': 24.15,
    'Paper': 19.32,
    'Plastics Products': 0.0,
}

class StockAnalysisService:
    
    @staticmethod
    def get_sector_pe(sector_name):
        """Get the sector P/E ratio from the mapping"""
        if sector_name in SECTOR_PE_MAPPING:
            return SECTOR_PE_MAPPING[sector_name]
        for mapped_sector, pe_value in SECTOR_PE_MAPPING.items():
            if sector_name.lower() in mapped_sector.lower() or mapped_sector.lower() in sector_name.lower():
                return pe_value
        return 'N/A'

    @staticmethod
    def calculate_pivot_points(high, low, close):
        """Calculate standard pivot points"""
        pivot = (high + low + close) / 3
        r1 = (2 * pivot) - low
        s1 = (2 * pivot) - high
        r2 = pivot + (high - low)
        s2 = pivot - (high - low)
        r3 = high + 2 * (pivot - low)
        s3 = low - 2 * (high - pivot)
        
        return {
            'Resistance 3': r3,
            'Resistance 2': r2,
            'Resistance 1': r1,
            'Pivot Point': pivot,
            'Support 1': s1,
            'Support 2': s2,
            'Support 3': s3
        }

    @staticmethod
    def calculate_rsi(data, window=14):
        """Calculate RSI using pandas"""
        delta = data['Close'].diff()
        gain = (delta.where(delta > 0, 0)).rolling(window=window).mean()
        loss = (-delta.where(delta < 0, 0)).rolling(window=window).mean()
        rs = gain / loss
        rsi = 100 - (100 / (1 + rs))
        return round(rsi.iloc[-1], 2) if not rsi.empty else 'N/A'

    @staticmethod
    def calculate_macd(data, fast=12, slow=26, signal=9):
        """Calculate MACD using pandas"""
        exp1 = data['Close'].ewm(span=fast, adjust=False).mean()
        exp2 = data['Close'].ewm(span=slow, adjust=False).mean()
        macd_line = exp1 - exp2
        signal_line = macd_line.ewm(span=signal, adjust=False).mean()
        histogram = macd_line - signal_line
        return {
            'macd_line': round(macd_line.iloc[-1], 2) if not macd_line.empty else 'N/A',
            'signal_line': round(signal_line.iloc[-1], 2) if not signal_line.empty else 'N/A',
            'histogram': round(histogram.iloc[-1], 2) if not histogram.empty else 'N/A'
        }

    @staticmethod
    def get_shareholding_pattern(symbol):
        """Scrape shareholding pattern data from Trendlyne"""
        def scrape_shareholding():
            try:
                options = Options()
                options.add_argument("--headless")
                options.add_argument("--no-sandbox")
                options.add_argument("--disable-dev-shm-usage")
                options.add_argument("--disable-gpu")
                options.add_argument("--window-size=1920,1080")
                options.add_argument("--disable-extensions")
                options.add_argument("--disable-software-rasterizer")
                options.add_argument("--disable-dev-tools")
                options.add_argument("--no-zygote")
                options.add_argument("--remote-debugging-port=0")
                options.add_argument("--log-level=3")
                options.add_experimental_option('excludeSwitches', ['enable-logging'])
                
                driver = webdriver.Chrome(options=options)
                wait = WebDriverWait(driver, 15)
                
                driver.get("https://trendlyne.com/markets-today/")
                time.sleep(3)
                
                search_box = wait.until(EC.element_to_be_clickable((By.ID, "navbar-desktop-search")))
                search_box.clear()
                search_box.send_keys(symbol)
                time.sleep(3)
                
                try:
                    first_suggestion = wait.until(EC.element_to_be_clickable(
                        (By.CSS_SELECTOR, ".name-price-container.ui-menu-item-wrapper")
                    ))
                    first_suggestion.click()
                except:
                    first_suggestion = wait.until(EC.element_to_be_clickable(
                        (By.CSS_SELECTOR, "[class*='ui-menu-item']")
                    ))
                    first_suggestion.click()
                
                time.sleep(4)
                driver.execute_script("window.scrollTo(0, document.body.scrollHeight * 0.35);")
                time.sleep(3)
                
                selectors = [
                    ".highcharts-data-label text tspan",
                    ".highcharts-data-labels text",
                    "[class*='highcharts'] tspan"
                ]
                
                shareholding_data = {}
                for selector in selectors:
                    try:
                        labels = driver.find_elements(By.CSS_SELECTOR, selector)
                        if labels:
                            for label in labels:
                                text = label.text.strip()
                                if ':' in text:
                                    key, value = text.split(':')
                                    try:
                                        shareholding_data[key.strip()] = float(value.strip())
                                    except:
                                        pass
                            if shareholding_data:
                                break
                    except:
                        continue
                
                return shareholding_data if shareholding_data else {
                    'promoter': 'N/A',
                    'institutions': 'N/A',
                    'retail': 'N/A',
                    'others': 'N/A'
                }
                
            except Exception as e:
                return {
                    'promoter': 'N/A',
                    'institutions': 'N/A',
                    'retail': 'N/A',
                    'others': 'N/A'
                }
            finally:
                try:
                    driver.quit()
                except:
                    pass
        
        # Run scraping in background thread
        result = {}
        thread = threading.Thread(target=lambda: result.update(scrape_shareholding()))
        thread.daemon = True
        thread.start()
        thread.join(timeout=20)
        
        return result if result else {
            'promoter': 'N/A',
            'institutions': 'N/A',
            'retail': 'N/A',
            'others': 'N/A'
        }

    @staticmethod
    def generate_chart_base64(hist_data, symbol, company_name):
        """Generate chart and return as base64 string"""
        try:
            # Create the plot
            fig, ax = plt.subplots(figsize=(12, 8))
            
            # Plot candlestick chart
            mpf.plot(hist_data.tail(30), type='candle', style='charles',
                    title=f'{company_name} Price Chart',
                    ylabel='Price (₹)',
                    volume=True,
                    ax=ax,
                    show_nontrading=False)
            
            # Convert plot to base64
            buffer = io.BytesIO()
            plt.savefig(buffer, format='png', dpi=100, bbox_inches='tight')
            buffer.seek(0)
            chart_base64 = base64.b64encode(buffer.getvalue()).decode()
            plt.close()
            
            return chart_base64
        except Exception as e:
            return None

    @staticmethod
    def generate_stock_report(symbol):
        """Generate complete stock analysis report"""
        try:
            # Handle symbol format - ensure it has .NS suffix for NSE
            if not symbol.endswith('.NS'):
                nse_symbol = f"{symbol.upper()}.NS"
            else:
                nse_symbol = symbol.upper()
            
            # Fetch data from Yahoo Finance
            stock = yf.Ticker(nse_symbol)
            info = stock.info
            hist = stock.history(period="1mo")
            financials = stock.financials
            balance_sheet = stock.balance_sheet
            
            if hist.empty:
                return StockAnalysisResponse(False, error="No data found for symbol")
            
            latest_data = hist.iloc[-1]
            prev_close = hist.iloc[-2]['Close'] if len(hist) > 1 else latest_data['Open']
            
            # HEADING
            sector = info.get('sector', 'N/A')
            heading = {
                'sector': sector,
                'full_name': info.get('longName', nse_symbol),
                'current_price': round(latest_data['Close'], 2),
                'change_price': round(latest_data['Close'] - prev_close, 2),
                'change_percent': round(((latest_data['Close'] - prev_close) / prev_close) * 100, 2)
            }
            
            # OVERVIEW
            overview = {
                'market_cap': info.get('marketCap', 'N/A'),
                'pe_ratio': info.get('trailingPE', 'N/A'),
                '52w_high': info.get('fiftyTwoWeekHigh', 'N/A'),
                '52w_low': info.get('fiftyTwoWeekLow', 'N/A')
            }
            
            # FUNDAMENTAL
            try:
                revenue_ttm = financials.loc['Total Revenue'].iloc[0] if 'Total Revenue' in financials.index else 'N/A'
                net_income_ttm = financials.loc['Net Income'].iloc[0] if 'Net Income' in financials.index else 'N/A'
                shareholder_equity = balance_sheet.loc['Total Equity Gross Minority Interest'].iloc[0] if 'Total Equity Gross Minority Interest' in balance_sheet.index else None
                
                if net_income_ttm != 'N/A' and shareholder_equity and shareholder_equity != 0:
                    roe = round((net_income_ttm / shareholder_equity) * 100, 2)
                else:
                    roe = info.get('returnOnEquity', 'N/A')
            except:
                revenue_ttm, net_income_ttm, roe = 'N/A', 'N/A', 'N/A'
            
            sector_pe = StockAnalysisService.get_sector_pe(sector)
            fundamental = {
                'key_ratios': {
                    'pe_ratio': info.get('trailingPE', 'N/A'),
                    'sector_pe': sector_pe,
                    'roe': roe,
                    'dividend_yield': info.get('dividendYield', 0) * 100 if info.get('dividendYield') else 'N/A'
                },
                'shareholding_pattern': StockAnalysisService.get_shareholding_pattern(symbol)
            }
            
            # FINANCIAL
            try:
                total_debt = balance_sheet.loc['Total Debt'].iloc[0] if 'Total Debt' in balance_sheet.index else 'N/A'
                total_equity = balance_sheet.loc['Total Equity Gross Minority Interest'].iloc[0] if 'Total Equity Gross Minority Interest' in balance_sheet.index else 'N/A'
                current_assets = balance_sheet.loc['Current Assets'].iloc[0] if 'Current Assets' in balance_sheet.index else 'N/A'
                current_liabilities = balance_sheet.loc['Current Liabilities'].iloc[0] if 'Current Liabilities' in balance_sheet.index else 'N/A'
                
                debt_equity = total_debt / total_equity if (total_debt != 'N/A' and total_equity != 'N/A' and total_equity != 0) else 'N/A'
                current_ratio = current_assets / current_liabilities if (current_assets != 'N/A' and current_liabilities != 'N/A' and current_liabilities != 0) else 'N/A'
            except:
                total_debt, debt_equity, current_ratio = 'N/A', 'N/A', 'N/A'
            
            financial = {
                'revenue_profit': {
                    'revenue_ttm': revenue_ttm,
                    'net_profit_ttm': net_income_ttm
                },
                'balance_sheet': {
                    'total_debt': total_debt,
                    'debt_equity': debt_equity,
                    'current_ratio': current_ratio
                }
            }
            
            # TECHNICAL INDICATORS
            try:
                latest_rsi = StockAnalysisService.calculate_rsi(hist)
                macd_values = StockAnalysisService.calculate_macd(hist)
                latest_macd = macd_values['macd_line']
                latest_macd_signal = macd_values['signal_line']
                latest_macd_hist = macd_values['histogram']
            except:
                latest_rsi, latest_macd, latest_macd_signal, latest_macd_hist = 'N/A', 'N/A', 'N/A', 'N/A'
            
            recent_high = hist['High'].max()
            recent_low = hist['Low'].min()
            recent_close = hist['Close'].iloc[-1]
            pivot_points = StockAnalysisService.calculate_pivot_points(recent_high, recent_low, recent_close)
            
            technical = {
                'support_resistance': {
                    'resistance_levels': {
                        'R1': round(pivot_points['Resistance 1'], 2),
                        'R2': round(pivot_points['Resistance 2'], 2),
                        'R3': round(pivot_points['Resistance 3'], 2)
                    },
                    'current_level': round(recent_close, 2),
                    'support_levels': {
                        'S1': round(pivot_points['Support 1'], 2),
                        'S2': round(pivot_points['Support 2'], 2),
                        'S3': round(pivot_points['Support 3'], 2)
                    }
                },
                'technical_indicators': {
                    'rsi_14': latest_rsi,
                    'macd': {
                        'macd_line': latest_macd,
                        'signal_line': latest_macd_signal,
                        'histogram': latest_macd_hist
                    },
                    'volume_trend': "Up" if latest_data['Volume'] > hist['Volume'].mean() else "Down"
                }
            }
            
            # Generate chart
            chart_base64 = StockAnalysisService.generate_chart_base64(hist, symbol, heading['full_name'])
            
            # Compile report
            report_data = {
                'symbol': nse_symbol,
                'heading': heading,
                'overview': overview,
                'fundamental': fundamental,
                'financial': financial,
                'technical': technical,
                'chart': chart_base64
            }
            
            # Save to database
            stock_analysis = StockAnalysis(symbol=symbol.upper(), data=report_data)
            mongo.db.stock_analyses.insert_one(stock_analysis.to_dict())
            
            return StockAnalysisResponse(True, data=report_data)
            
        except Exception as e:
            return StockAnalysisResponse(False, error=str(e))

    @staticmethod
    def get_cached_analysis(symbol):
        """Get cached analysis from database"""
        try:
            cached = mongo.db.stock_analyses.find_one(
                {"symbol": symbol.upper()},
                sort=[("created_at", -1)]
            )
            if cached:
                return StockAnalysisResponse(True, data=cached['data'])
            return None
        except Exception:
            return None
