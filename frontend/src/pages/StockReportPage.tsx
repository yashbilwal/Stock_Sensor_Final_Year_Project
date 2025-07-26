import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, TrendingUp, TrendingDown, PieChart, BarChart3, Calendar, Target, Shield, AlertTriangle } from 'lucide-react';

interface StockData {
  symbol: string;
  name: string;
  sector: string;
  price: number;
  change: number;
  changePercent: number;
  marketCap: string;
  peRatio: number;
  sectorPE: number;
  dividendYield: number;
  week52High: number;
  week52Low: number;
  volume: string;
  prediction: {
    setup: 'VCP' | 'IPO Base' | 'None';
    targetReturn: string;
    timeline: string;
    confidence: number;
    supportLevel: number;
    resistanceLevel: number;
  };
  fundamentals: {
    revenue: { current: string; growth: string };
    netProfit: { current: string; growth: string };
    roe: number;
    debt: string;
  };
  shareholding: {
    promoter: number;
    institutions: number;
    retail: number;
    others: number;
  };
}

const StockReportPage: React.FC = () => {
  const { symbol } = useParams<{ symbol: string }>();
  const [activeTab, setActiveTab] = useState<'overview' | 'technical' | 'fundamentals' | 'financials'>('overview');
  const [loading, setLoading] = useState(true);

  // Mock data - in real app, this would come from API
  const [stockData] = useState<StockData>({
    symbol: symbol || 'TCS',
    name: 'Tata Consultancy Services',
    sector: 'Information Technology',
    price: 3420.50,
    change: 45.30,
    changePercent: 1.34,
    marketCap: '₹12.45 Lakh Cr',
    peRatio: 28.5,
    sectorPE: 25.2,
    dividendYield: 1.8,
    week52High: 3850.00,
    week52Low: 2890.00,
    volume: '2.45 Cr',
    prediction: {
      setup: 'VCP',
      targetReturn: '7-9%',
      timeline: '5-8 days',
      confidence: 85,
      supportLevel: 3350,
      resistanceLevel: 3650
    },
    fundamentals: {
      revenue: { current: '₹1,95,867 Cr', growth: '+8.5%' },
      netProfit: { current: '₹38,327 Cr', growth: '+12.3%' },
      roe: 45.2,
      debt: '₹2,450 Cr'
    },
    shareholding: {
      promoter: 72.2,
      institutions: 18.5,
      retail: 7.8,
      others: 1.5
    }
  });

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: TrendingUp },
    { id: 'technical', label: 'Technical', icon: BarChart3 },
    { id: 'fundamentals', label: 'Fundamentals', icon: PieChart },
    { id: 'financials', label: 'Financials', icon: Calendar }
  ];

  return (
    <div className="min-h-screen bg-neutral-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <div className="mb-6">
          <Link
            to="/"
            className="inline-flex items-center space-x-2 text-neutral-600 hover:text-primary-600 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Home</span>
          </Link>
        </div>

        {/* Stock Header */}
        <div className="bg-white rounded-2xl border border-neutral-200 p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="space-y-2">
              <div className="flex items-center space-x-3">
                <h1 className="text-3xl font-bold text-neutral-900">{stockData.symbol}</h1>
                <span className="px-3 py-1 bg-neutral-100 text-neutral-700 text-sm rounded-full">
                  {stockData.sector}
                </span>
              </div>
              <p className="text-neutral-600">{stockData.name}</p>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-8">
              <div className="text-right">
                <div className="text-3xl font-bold text-neutral-900">₹{stockData.price.toLocaleString()}</div>
                <div className={`flex items-center space-x-1 ${stockData.change >= 0 ? 'text-success-600' : 'text-error-600'}`}>
                  {stockData.change >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                  <span className="font-medium">
                    ₹{Math.abs(stockData.change)} ({stockData.changePercent >= 0 ? '+' : ''}{stockData.changePercent}%)
                  </span>
                </div>
              </div>

              {stockData.prediction.setup !== 'None' && (
                <div className="p-4 bg-gradient-to-r from-primary-50 to-secondary-50 rounded-xl border border-primary-200">
                  <div className="flex items-center space-x-2 mb-2">
                    <Target className="h-5 w-5 text-primary-600" />
                    <span className="font-semibold text-primary-700">{stockData.prediction.setup} Setup Detected</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-neutral-600">Target Return:</span>
                      <div className="font-medium text-success-600">{stockData.prediction.targetReturn}</div>
                    </div>
                    <div>
                      <span className="text-neutral-600">Timeline:</span>
                      <div className="font-medium text-primary-600">{stockData.prediction.timeline}</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl border border-neutral-200 mb-8">
          <div className="border-b border-neutral-200">
            <nav className="flex space-x-8 px-6">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center space-x-2 py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300'
                  }`}
                >
                  <tab.icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'overview' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                  {/* Price Chart Placeholder */}
                  <div className="bg-neutral-50 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-neutral-900 mb-4">Price Movement</h3>
                    <div className="h-64 bg-white rounded-lg border-2 border-dashed border-neutral-300 flex items-center justify-center">
                      <div className="text-center text-neutral-500">
                        <BarChart3 className="h-12 w-12 mx-auto mb-2" />
                        <p>Interactive price chart would go here</p>
                      </div>
                    </div>
                  </div>

                  {/* Key Metrics */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="p-4 bg-neutral-50 rounded-xl">
                      <div className="text-sm text-neutral-600">Market Cap</div>
                      <div className="text-lg font-semibold text-neutral-900">{stockData.marketCap}</div>
                    </div>
                    <div className="p-4 bg-neutral-50 rounded-xl">
                      <div className="text-sm text-neutral-600">P/E Ratio</div>
                      <div className="text-lg font-semibold text-neutral-900">{stockData.peRatio}</div>
                    </div>
                    <div className="p-4 bg-neutral-50 rounded-xl">
                      <div className="text-sm text-neutral-600">52W High</div>
                      <div className="text-lg font-semibold text-neutral-900">₹{stockData.week52High}</div>
                    </div>
                    <div className="p-4 bg-neutral-50 rounded-xl">
                      <div className="text-sm text-neutral-600">52W Low</div>
                      <div className="text-lg font-semibold text-neutral-900">₹{stockData.week52Low}</div>
                    </div>
                  </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                  {/* AI Prediction */}
                  {stockData.prediction.setup !== 'None' && (
                    <div className="p-4 bg-gradient-to-br from-primary-50 to-secondary-50 rounded-xl border border-primary-200">
                      <h3 className="text-lg font-semibold text-primary-700 mb-3">AI Prediction</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-neutral-600">Setup:</span>
                          <span className="font-medium text-primary-600">{stockData.prediction.setup}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-neutral-600">Confidence:</span>
                          <span className="font-medium text-success-600">{stockData.prediction.confidence}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-neutral-600">Support:</span>
                          <span className="font-medium">₹{stockData.prediction.supportLevel}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-neutral-600">Resistance:</span>
                          <span className="font-medium">₹{stockData.prediction.resistanceLevel}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Risk Warning */}
                  <div className="p-4 bg-warning-50 rounded-xl border border-warning-200">
                    <div className="flex items-center space-x-2 mb-2">
                      <AlertTriangle className="h-5 w-5 text-warning-600" />
                      <h3 className="font-semibold text-warning-700">Risk Disclaimer</h3>
                    </div>
                    <p className="text-sm text-warning-700">
                      All predictions are based on technical analysis and market trends. 
                      Past performance doesn't guarantee future results. Please invest responsibly.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'technical' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="p-6 bg-neutral-50 rounded-xl">
                    <h3 className="text-lg font-semibold text-neutral-900 mb-4">Support & Resistance</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-neutral-600">Resistance Level</span>
                        <span className="font-semibold text-error-600">₹{stockData.prediction.resistanceLevel}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-neutral-600">Current Price</span>
                        <span className="font-semibold text-neutral-900">₹{stockData.price}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-neutral-600">Support Level</span>
                        <span className="font-semibold text-success-600">₹{stockData.prediction.supportLevel}</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 bg-neutral-50 rounded-xl">
                    <h3 className="text-lg font-semibold text-neutral-900 mb-4">Technical Indicators</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-neutral-600">RSI (14)</span>
                        <span className="font-semibold text-primary-600">58.4</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-neutral-600">MACD</span>
                        <span className="font-semibold text-success-600">Bullish</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-neutral-600">Volume Trend</span>
                        <span className="font-semibold text-secondary-600">Above Average</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'fundamentals' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="p-6 bg-neutral-50 rounded-xl">
                    <h3 className="text-lg font-semibold text-neutral-900 mb-4">Key Ratios</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-neutral-600">P/E Ratio</span>
                        <span className="font-semibold text-neutral-900">{stockData.peRatio}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-neutral-600">Sector P/E</span>
                        <span className="font-semibold text-neutral-600">{stockData.sectorPE}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-neutral-600">ROE</span>
                        <span className="font-semibold text-success-600">{stockData.fundamentals.roe}%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-neutral-600">Dividend Yield</span>
                        <span className="font-semibold text-primary-600">{stockData.dividendYield}%</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 bg-neutral-50 rounded-xl">
                    <h3 className="text-lg font-semibold text-neutral-900 mb-4">Shareholding Pattern</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-neutral-600">Promoter</span>
                        <span className="font-semibold text-primary-600">{stockData.shareholding.promoter}%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-neutral-600">Institutions</span>
                        <span className="font-semibold text-secondary-600">{stockData.shareholding.institutions}%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-neutral-600">Retail</span>
                        <span className="font-semibold text-accent-600">{stockData.shareholding.retail}%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-neutral-600">Others</span>
                        <span className="font-semibold text-neutral-600">{stockData.shareholding.others}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'financials' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="p-6 bg-neutral-50 rounded-xl">
                    <h3 className="text-lg font-semibold text-neutral-900 mb-4">Revenue & Profit</h3>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-neutral-600">Revenue (TTM)</span>
                          <span className="font-semibold text-success-600">{stockData.fundamentals.revenue.growth}</span>
                        </div>
                        <div className="text-xl font-bold text-neutral-900">{stockData.fundamentals.revenue.current}</div>
                      </div>
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-neutral-600">Net Profit (TTM)</span>
                          <span className="font-semibold text-success-600">{stockData.fundamentals.netProfit.growth}</span>
                        </div>
                        <div className="text-xl font-bold text-neutral-900">{stockData.fundamentals.netProfit.current}</div>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 bg-neutral-50 rounded-xl">
                    <h3 className="text-lg font-semibold text-neutral-900 mb-4">Balance Sheet</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-neutral-600">Total Debt</span>
                        <span className="font-semibold text-neutral-900">{stockData.fundamentals.debt}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-neutral-600">Debt/Equity</span>
                        <span className="font-semibold text-success-600">0.08</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-neutral-600">Current Ratio</span>
                        <span className="font-semibold text-primary-600">2.4</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StockReportPage;