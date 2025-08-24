import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, TrendingUp, TrendingDown, PieChart, BarChart3, Calendar, Target, Shield, AlertTriangle, Loader2, RefreshCw } from 'lucide-react';
import { stockService, StockAnalysisData } from '../services/stockService';

const StockReportPage: React.FC = () => {
  const { symbol } = useParams<{ symbol: string }>();
  const [activeTab, setActiveTab] = useState<'overview' | 'technical' | 'fundamentals' | 'financials'>('overview');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [stockData, setStockData] = useState<StockAnalysisData | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const navigate = useNavigate();

  // Extract base symbol (remove .NS suffix if present)
  const baseSymbol = symbol?.replace(/\.NS$/, '') || '';

  const fetchStockData = async (stockSymbol: string) => {
    try {
      setLoading(true);
      setError('');
      const data = await stockService.analyzeStock(stockSymbol);
      setStockData(data);
    } catch (err: any) {
      console.error('Error fetching stock data:', err);
      setError(err.message || 'Failed to fetch stock data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    if (!symbol) return;
    setRefreshing(true);
    await fetchStockData(symbol);
    setRefreshing(false);
  };

  useEffect(() => {
    if (symbol) {
      fetchStockData(symbol);
    }
  }, [symbol]);

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary-600 mx-auto mb-4" />
          <p className="text-lg text-neutral-600">Analyzing {baseSymbol}...</p>
          <p className="text-sm text-neutral-500">This may take a few moments</p>
        </div>
      </div>
    );
  }

  if (error || !stockData) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <AlertTriangle className="h-16 w-16 text-error-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-neutral-900 mb-2">Analysis Failed</h2>
          <p className="text-neutral-600 mb-6">{error || 'Unable to fetch stock data'}</p>
          <div className="space-y-3">
            <button
              onClick={() => symbol && fetchStockData(symbol)}
              className="w-full px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              Try Again
            </button>
            <button
              onClick={() => navigate('/')}
              className="w-full px-6 py-3 bg-neutral-200 text-neutral-700 rounded-lg hover:bg-neutral-300 transition-colors"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: TrendingUp },
    { id: 'technical', label: 'Technical', icon: BarChart3 },
    { id: 'fundamentals', label: 'Fundamentals', icon: PieChart },
    { id: 'financials', label: 'Financials', icon: Calendar }
  ];

  // Helper function to format large numbers
  const formatNumber = (value: number | string): string => {
    if (typeof value === 'string') return value;
    if (value >= 1e12) return `₹${(value / 1e12).toFixed(2)} T`;
    if (value >= 1e9) return `₹${(value / 1e9).toFixed(2)} B`;
    if (value >= 1e6) return `₹${(value / 1e6).toFixed(2)} M`;
    if (value >= 1e3) return `₹${(value / 1e3).toFixed(2)} K`;
    return `₹${value.toFixed(2)}`;
  };

  // Helper function to format percentage
  const formatPercentage = (value: number): string => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
  };

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
                <h1 className="text-3xl font-bold text-neutral-900">{baseSymbol}</h1>
                <span className="px-3 py-1 bg-neutral-100 text-neutral-700 text-sm rounded-full">
                  {stockData.heading.sector}
                </span>
              </div>
              <p className="text-neutral-600">{stockData.heading.full_name}</p>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-8">
              <div className="text-right">
                <div className="text-3xl font-bold text-neutral-900">₹{stockData.heading.current_price.toLocaleString()}</div>
                <div className={`flex items-center space-x-1 ${stockData.heading.change_price >= 0 ? 'text-success-600' : 'text-error-600'}`}>
                  {stockData.heading.change_price >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                  <span className="font-medium">
                    ₹{Math.abs(stockData.heading.change_price)} ({formatPercentage(stockData.heading.change_percent)})
                  </span>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={handleRefresh}
                  disabled={refreshing}
                  className="p-2 text-neutral-500 hover:text-primary-600 transition-colors disabled:opacity-50"
                  title="Refresh data"
                >
                  <RefreshCw className={`h-5 w-5 ${refreshing ? 'animate-spin' : ''}`} />
                </button>
              </div>
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
                  {/* TradingView Chart */}
                  <div className="bg-neutral-50 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-neutral-900 mb-4">Price Chart</h3>
                    <div className="h-96 bg-white rounded-lg border border-neutral-300 overflow-hidden">
                      <iframe
                        src={`https://www.tradingview.com/widgetembed/?frameElementId=tradingview_${baseSymbol}&symbol=NSE%3A${baseSymbol}&interval=D&hidesidetoolbar=0&hidedrawingtoolbar=0&symboledit=1&saveimage=1&toolbarbg=f1f3f6&studies=%5B%5D&theme=light&style=1&timezone=exchange&withdateranges=1&showpopupbutton=1&studies_overrides=%7B%7D&overrides=%7B%7D&enabled_features=%5B%5D&disabled_features=%5B%5D&locale=en&utm_source=&utm_medium=widget&utm_campaign=chart&page-uri=`}
                        style={{ width: '100%', height: '100%', border: 'none' }}
                        title={`${baseSymbol} Chart`}
                      />
                    </div>
                  </div>

                  {/* Key Metrics */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="p-4 bg-neutral-50 rounded-xl">
                      <div className="text-sm text-neutral-600">Market Cap</div>
                      <div className="text-lg font-semibold text-neutral-900">{formatNumber(stockData.overview.market_cap)}</div>
                    </div>
                    <div className="p-4 bg-neutral-50 rounded-xl">
                      <div className="text-sm text-neutral-600">P/E Ratio</div>
                      <div className="text-lg font-semibold text-neutral-900">{stockData.overview.pe_ratio}</div>
                    </div>
                    <div className="p-4 bg-neutral-50 rounded-xl">
                      <div className="text-sm text-neutral-600">52W High</div>
                      <div className="text-lg font-semibold text-neutral-900">₹{stockData.overview['52w_high']}</div>
                    </div>
                    <div className="p-4 bg-neutral-50 rounded-xl">
                      <div className="text-sm text-neutral-600">52W Low</div>
                      <div className="text-lg font-semibold text-neutral-900">₹{stockData.overview['52w_low']}</div>
                    </div>
                  </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                  {/* Company Info */}
                  <div className="p-4 bg-gradient-to-br from-primary-50 to-secondary-50 rounded-xl border border-primary-200">
                    <h3 className="text-lg font-semibold text-primary-700 mb-3">Company Info</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-neutral-600">Symbol:</span>
                        <span className="font-medium text-primary-600">{baseSymbol}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-neutral-600">Sector:</span>
                        <span className="font-medium text-primary-600">{stockData.heading.sector}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-neutral-600">Current Price:</span>
                        <span className="font-medium">₹{stockData.heading.current_price}</span>
                      </div>
                    </div>
                  </div>

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
                        <span className="text-neutral-600">Resistance Level (R3)</span>
                        <span className="font-semibold text-error-600">₹{stockData.technical.support_resistance.resistance_levels.R3}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-neutral-600">Resistance Level (R2)</span>
                        <span className="font-semibold text-error-600">₹{stockData.technical.support_resistance.resistance_levels.R2}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-neutral-600">Resistance Level (R1)</span>
                        <span className="font-semibold text-error-600">₹{stockData.technical.support_resistance.resistance_levels.R1}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-neutral-600">Current Price</span>
                        <span className="font-semibold text-neutral-900">₹{stockData.technical.support_resistance.current_level}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-neutral-600">Support Level (S1)</span>
                        <span className="font-semibold text-success-600">₹{stockData.technical.support_resistance.support_levels.S1}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-neutral-600">Support Level (S2)</span>
                        <span className="font-semibold text-success-600">₹{stockData.technical.support_resistance.support_levels.S2}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-neutral-600">Support Level (S3)</span>
                        <span className="font-semibold text-success-600">₹{stockData.technical.support_resistance.support_levels.S3}</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 bg-neutral-50 rounded-xl">
                    <h3 className="text-lg font-semibold text-neutral-900 mb-4">Technical Indicators</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-neutral-600">RSI (14)</span>
                        <span className="font-semibold text-primary-600">{stockData.technical.technical_indicators.rsi_14.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-neutral-600">MACD Line</span>
                        <span className="font-semibold text-success-600">{stockData.technical.technical_indicators.macd.macd_line.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-neutral-600">Signal Line</span>
                        <span className="font-semibold text-secondary-600">{stockData.technical.technical_indicators.macd.signal_line.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-neutral-600">MACD Histogram</span>
                        <span className="font-semibold text-primary-600">{stockData.technical.technical_indicators.macd.histogram.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-neutral-600">Volume Trend</span>
                        <span className="font-semibold text-secondary-600">{stockData.technical.technical_indicators.volume_trend}</span>
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
                        <span className="font-semibold text-neutral-900">{stockData.fundamental.key_ratios.pe_ratio}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-neutral-600">Sector P/E</span>
                        <span className="font-semibold text-neutral-600">{stockData.fundamental.key_ratios.sector_pe}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-neutral-600">ROE</span>
                        <span className="font-semibold text-success-600">{stockData.fundamental.key_ratios.roe}%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-neutral-600">Dividend Yield</span>
                        <span className="font-semibold text-primary-600">{stockData.fundamental.key_ratios.dividend_yield}%</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 bg-neutral-50 rounded-xl">
                    <h3 className="text-lg font-semibold text-neutral-900 mb-4">Shareholding Pattern</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-neutral-600">Promoter</span>
                        <span className="font-semibold text-primary-600">{stockData.fundamental.shareholding_pattern.promoter}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-neutral-600">Institutions</span>
                        <span className="font-semibold text-secondary-600">{stockData.fundamental.shareholding_pattern.institutions}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-neutral-600">Retail</span>
                        <span className="font-semibold text-accent-600">{stockData.fundamental.shareholding_pattern.retail}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-neutral-600">Others</span>
                        <span className="font-semibold text-neutral-600">{stockData.fundamental.shareholding_pattern.others}</span>
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
                        </div>
                        <div className="text-xl font-bold text-neutral-900">{formatNumber(stockData.financial.revenue_profit.revenue_ttm)}</div>
                      </div>
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-neutral-600">Net Profit (TTM)</span>
                        </div>
                        <div className="text-xl font-bold text-neutral-900">{formatNumber(stockData.financial.revenue_profit.net_profit_ttm)}</div>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 bg-neutral-50 rounded-xl">
                    <h3 className="text-lg font-semibold text-neutral-900 mb-4">Balance Sheet</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-neutral-600">Total Debt</span>
                        <span className="font-semibold text-neutral-900">{formatNumber(stockData.financial.balance_sheet.total_debt)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-neutral-600">Debt/Equity</span>
                        <span className="font-semibold text-success-600">{stockData.financial.balance_sheet.debt_equity.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-neutral-600">Current Ratio</span>
                        <span className="font-semibold text-primary-600">{stockData.financial.balance_sheet.current_ratio.toFixed(2)}</span>
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