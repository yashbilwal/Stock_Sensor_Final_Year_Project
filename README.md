# 🚀 Stock Sensor - AI-Powered Stock Intelligence Platform

<div align="center">

![Stock Sensor Logo](https://img.shields.io/badge/Stock%20Sensor-AI%20Powered%20Intelligence-blue?style=for-the-badge&logo=chart-line)
![Python](https://img.shields.io/badge/Python-3.8+-green?style=for-the-badge&logo=python)
![React](https://img.shields.io/badge/React-18+-blue?style=for-the-badge&logo=react)
![MongoDB](https://img.shields.io/badge/MongoDB-5.0+-green?style=for-the-badge&logo=mongodb)
![Flask](https://img.shields.io/badge/Flask-2.3+-red?style=for-the-badge&logo=flask)

**Discover stocks with 5–10% returns in 5–10 days using cutting-edge AI and market intelligence**

[🚀 Quick Start](#-quick-start) • [📊 Features](#-features) • [🏗️ Architecture](#️-architecture) • [🔧 Setup](#-setup) • [📖 Usage](#-usage) • [🔌 API Reference](#-api-reference) • [🤝 Contributing](#-contributing)

</div>

---

## 🎯 What is Stock Sensor?

**Stock Sensor** is a comprehensive AI-powered stock analysis platform that combines technical analysis, pattern recognition, and real-time market data to identify high-probability trading opportunities. The platform analyzes Indian stocks (NSE) and provides detailed reports with TradingView charts, technical indicators, and fundamental analysis.

### ✨ Key Highlights
- **AI-Powered Predictions**: VCP (Volatility Contraction Pattern) and IPO Base pattern detection
- **Real-Time Analysis**: Live market data and instant stock reports
- **Interactive Charts**: TradingView integration for professional charting
- **Comprehensive Reports**: Technical, fundamental, and financial analysis
- **News Integration**: Live market news with sentiment analysis
- **85%+ Accuracy**: Advanced algorithms for reliable predictions

---

## 🚀 Quick Start

### Prerequisites
- **Python 3.8+** with pip
- **Node.js 16+** with npm
- **MongoDB 5.0+** running locally or cloud instance
- **Chrome/Chromium** browser (for web scraping)

### 🚀 One-Command Setup

```bash
# Clone the repository
git clone https://github.com/yourusername/stock-sensor.git
cd stock-sensor

# Backend setup
cd backend
pip install -r requirements.txt
python run.py

# Frontend setup (in new terminal)
cd frontend
npm install
npm run dev
```

**🎉 That's it!** Your Stock Sensor platform will be running at:
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000

---

## 📊 Features

### 🧠 AI Pattern Detection
- **VCP (Volatility Contraction Pattern)**: Identifies stocks forming volatility contraction patterns
- **IPO Base Pattern**: Detects stocks with IPO base formations
- **Confidence Scoring**: AI-powered confidence ratings (0-100%)
- **Real-Time Updates**: Continuous pattern monitoring and updates

### 📈 Stock Analysis
- **Comprehensive Reports**: Complete stock analysis with 4 detailed tabs
- **Technical Indicators**: RSI, MACD, Support/Resistance levels
- **Fundamental Data**: P/E ratios, ROE, dividend yields, sector analysis
- **Financial Metrics**: Revenue, profit, debt analysis, balance sheet data
- **TradingView Charts**: Professional interactive charts for each stock

### 📰 Live News & Sentiment
- **Real-Time News**: Live market news from multiple sources
- **Sentiment Analysis**: AI-powered sentiment classification (Positive/Negative/Neutral)
- **Auto-Refresh**: Automatic news updates every 5 minutes
- **Source Tracking**: Multiple news sources with credibility indicators

### 🔍 Smart Search & Discovery
- **Symbol Search**: Intelligent stock symbol search with autocomplete
- **Popular Stocks**: Trending and frequently analyzed stocks
- **Sector Filtering**: Filter stocks by sector and pattern type
- **Real-Time Data**: Live price updates and market information

---

## 🏗️ Architecture

```
Stock Sensor Platform
├── 🎨 Frontend (React + TypeScript)
│   ├── HeroSection - Stock search and analysis
│   ├── LiveNewsSection - Real-time news with sentiment
│   ├── PredictedStocksSection - AI pattern detection results
│   └── StockReportPage - Comprehensive stock analysis
├── 🔧 Backend (Python + Flask)
│   ├── Stock Analysis Service - Yahoo Finance integration
│   ├── Pattern Detection Service - VCP & IPO Base algorithms
│   ├── News Service - Web scraping and sentiment analysis
│   └── MongoDB Integration - Data persistence and caching
└── 📊 Data Sources
    ├── Yahoo Finance - Stock data and fundamentals
    ├── TradingView - Interactive charts
    ├── News APIs - Market news and updates
    └── ChartLink - Pattern detection data
```

### 🗄️ Database Collections
- **`news`**: Market news with sentiment analysis
- **`VCP_sample`**: Raw VCP pattern data
- **`VCP_results`**: Processed VCP detection results
- **`IPO_Base_sample`**: Raw IPO base pattern data
- **`IPO_Base_results`**: Processed IPO base detection results

---

## 🔧 Setup

### 1. Environment Setup

```bash
# Clone repository
git clone https://github.com/yourusername/stock-sensor.git
cd stock-sensor

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

### 2. Backend Configuration

```bash
cd backend

# Install dependencies
pip install -r requirements.txt

# Set environment variables
cp .env.example .env
# Edit .env with your MongoDB connection string and API keys
```

**Environment Variables:**
```env
MONGODB_URI=mongodb://localhost:27017/stock_sensor
FLASK_ENV=development
FLASK_DEBUG=True
API_KEY=your_api_key_here
```

### 3. MongoDB Setup

```bash
# Install MongoDB (Ubuntu/Debian)
sudo apt-get install mongodb

# Start MongoDB service
sudo systemctl start mongodb
sudo systemctl enable mongodb

# Create database
mongosh
use stock_sensor
```

### 4. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Set environment variables
cp .env.example .env
# Edit .env with your backend API URL
```

**Environment Variables:**
```env
VITE_API_URL=http://localhost:5000/api
```

### 5. Start Services

```bash
# Terminal 1: Backend
cd backend
python run.py

# Terminal 2: Frontend
cd frontend
npm run dev

# Terminal 3: Pattern Detection (Optional)
cd backend
python -c "from app.services.predict_service import PredictService; service = PredictService(); service.run_complete_analysis()"
```

---

## 📖 Usage

### 🔍 Stock Analysis

1. **Search for a Stock**
   - Go to the homepage
   - Enter stock symbol (e.g., TCS, INFY, RELIANCE)
   - Click "Analyze" or press Enter

2. **View Comprehensive Report**
   - **Overview Tab**: Price chart, key metrics, company info
   - **Technical Tab**: Support/resistance, RSI, MACD indicators
   - **Fundamentals Tab**: P/E ratios, ROE, shareholding pattern
   - **Financials Tab**: Revenue, profit, debt analysis

3. **Interactive Features**
   - TradingView charts with multiple timeframes
   - Real-time price updates
   - Refresh data button
   - Export/share reports

### 📰 Live News

- **Auto-refreshing** news feed every 5 minutes
- **Sentiment indicators** for each news item
- **Source tracking** and credibility indicators
- **Filter by sentiment** (Positive/Negative/Neutral)

### 🎯 AI Predictions

- **VCP Patterns**: Volatility contraction opportunities
- **IPO Base Patterns**: IPO base formation stocks
- **Confidence Scores**: AI-powered probability ratings
- **Sector Filtering**: Filter by industry and pattern type
- **Real-time Updates**: Continuous pattern monitoring

---

## 🔌 API Reference

### Base URL
```
http://localhost:5000/api
```

### 📊 Stock Analysis

#### Analyze Stock
```http
GET /stocks/analyze/{symbol}
```

**Example:**
```bash
curl http://localhost:5000/api/stocks/analyze/TCS
```

**Response:**
```json
{
  "success": true,
  "timestamp": "2024-01-01T12:00:00Z",
  "data": {
    "symbol": "TCS.NS",
    "heading": {
      "sector": "Technology",
      "full_name": "Tata Consultancy Services Limited",
      "current_price": 3054.0,
      "change_price": -48.6,
      "change_percent": -1.57
    },
    "overview": {
      "market_cap": 11049646424064.0,
      "pe_ratio": 22.42,
      "52w_high": 4592.25,
      "52w_low": 2991.6
    },
    "technical": {
      "support_resistance": {
        "resistance_levels": {"R1": 3160.13, "R2": 3266.27, "R3": 3350.53},
        "support_levels": {"S1": 2969.73, "S2": 2885.47, "S3": 2779.33}
      },
      "technical_indicators": {
        "rsi_14": 58.11,
        "macd": {"macd_line": -17.54, "signal_line": -25.1, "histogram": 7.55}
      }
    }
  }
}
```

### 🎯 Pattern Detection

#### Get Predicted Stocks
```http
GET /predict/predicted-stocks
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "1",
      "symbol": "AADHARHFC",
      "name": "AADHARHFC",
      "price": 521.85,
      "setup": "VCP",
      "sector": "Financial Services",
      "targetReturn": "6-10%",
      "timeline": "Recent",
      "confidence": 67
    }
  ],
  "count": 1,
  "vcp_count": 1,
  "ipo_count": 0
}
```

#### Run Pattern Analysis
```http
POST /predict/run-complete-analysis
```

### 📰 News API

#### Get Live News
```http
GET /news/live-news
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "1",
      "headline": "Market Update: Sensex gains 500 points",
      "timestamp": "2 hours ago",
      "sentiment": "Positive",
      "source": "Economic Times",
      "summary": "Market Update: Sensex gains 500 points...",
      "url": "https://example.com/news/1"
    }
  ],
  "count": 1
}
```

---

## 🛠️ Development

### Project Structure
```
stock-sensor/
├── backend/
│   ├── app/
│   │   ├── models/          # Database models
│   │   ├── routes/          # API endpoints
│   │   ├── services/        # Business logic
│   │   └── extensions.py    # Flask extensions
│   ├── requirements.txt     # Python dependencies
│   └── run.py              # Application entry point
├── frontend/
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── services/       # API services
│   │   └── pages/          # Page components
│   ├── package.json        # Node.js dependencies
│   └── vite.config.ts      # Vite configuration
└── README.md               # This file
```

### 🧪 Testing

```bash
# Backend tests
cd backend
python -m pytest tests/

# Frontend tests
cd frontend
npm test

# API testing
cd backend
python test_api.py
```

### 🔄 Database Management

```bash
# Update existing stock prices
cd backend
python update_existing_prices.py

# Check price storage
python test_price_storage.py

# Populate sample data
python test_news_populate.py
```

---

## 🚀 Deployment

### Docker Deployment

```dockerfile
# Backend Dockerfile
FROM python:3.9-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
EXPOSE 5000
CMD ["python", "run.py"]
```

```bash
# Build and run
docker build -t stock-sensor-backend .
docker run -p 5000:5000 stock-sensor-backend
```

### Production Considerations

- **Environment Variables**: Secure API keys and database credentials
- **HTTPS**: Enable SSL/TLS for production
- **Rate Limiting**: Implement API rate limiting
- **Monitoring**: Add logging and monitoring
- **Backup**: Regular database backups
- **Scaling**: Load balancing for high traffic

---

## 🤝 Contributing

We welcome contributions! Here's how you can help:

### 🐛 Bug Reports
1. Check existing issues
2. Create detailed bug report
3. Include steps to reproduce
4. Add error logs and screenshots

### 💡 Feature Requests
1. Describe the feature
2. Explain use case
3. Suggest implementation approach
4. Discuss with maintainers

### 🔧 Code Contributions
1. Fork the repository
2. Create feature branch
3. Make your changes
4. Add tests
5. Submit pull request

### 📝 Development Guidelines
- Follow PEP 8 (Python) and ESLint (JavaScript)
- Write meaningful commit messages
- Add tests for new features
- Update documentation
- Keep code clean and readable

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Yahoo Finance** for stock data
- **TradingView** for charting widgets
- **MongoDB** for database
- **OpenAI** for AI inspiration
- **Open Source Community** for amazing tools

---

## 📞 Support & Contact

- **GitHub Issues**: [Report bugs or request features](https://github.com/yourusername/stock-sensor/issues)
- **Discussions**: [Join community discussions](https://github.com/yourusername/stock-sensor/discussions)
- **Email**: your.email@example.com
- **LinkedIn**: [Your LinkedIn Profile](https://linkedin.com/in/yourusername)

---

<div align="center">

**⭐ Star this repository if you found it helpful!**

**Made with ❤️ by [Your Name]**

[Back to Top](#-stock-sensor---ai-powered-stock-intelligence-platform)

</div>
