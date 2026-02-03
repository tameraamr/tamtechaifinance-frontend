"use client";
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../src/context/AuthContext';
import { useTranslation } from '../../src/context/TranslationContext';
import Navbar from '../../src/components/Navbar';
import Footer from '../../src/components/Footer';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import {
  TrendingUp, TrendingDown, Plus, Trash2, Edit2, X, Check,
  DollarSign, PieChart, BarChart3, LineChart as LineChartIcon,
  AlertTriangle, Search, ArrowLeft, Activity, Target,
  Clock, Calendar, Percent, Award, Zap, RefreshCw, Download,
  ChevronDown, ChevronUp, Eye, EyeOff, ExternalLink, Info
} from 'lucide-react';
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip,
  CartesianGrid, PieChart as RechartsPieChart, Pie, Cell,
  AreaChart, Area, BarChart, Bar, Legend
} from 'recharts';

interface Holding {
  id: number;
  symbol: string;
  current_price: number;
  change_p: number;
  shares: number;
  avg_buy_price: number | null;
  sector: string | null;
}

export default function PortfolioPage() {
  const { user, isPro } = useAuth();
  const { t } = useTranslation();
  const router = useRouter();

  // Portfolio State
  const [holdings, setHoldings] = useState<Holding[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  // UI State
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'holdings' | 'analytics'>('overview');
  const [timeframe, setTimeframe] = useState<'1D' | '1W' | '1M' | '3M' | '1Y' | 'ALL'>('1M');
  const [hideBalances, setHideBalances] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    ticker: '',
    shares: '',
    avgPrice: ''
  });

  // Analytics State
  const [totalValue, setTotalValue] = useState(0);
  const [totalCost, setTotalCost] = useState(0);
  const [totalPnL, setTotalPnL] = useState(0);
  const [totalPnLPercent, setTotalPnLPercent] = useState(0);
  const [dayChange, setDayChange] = useState(0);
  const [dayChangePercent, setDayChangePercent] = useState(0);
  const [sectorData, setSectorData] = useState<any[]>([]);
  const [riskMetrics, setRiskMetrics] = useState({
    sharpeRatio: 0,
    volatility: 0,
    beta: 0,
    maxDrawdown: 0,
    diversificationScore: 0
  });

  // Currency
  const [currency, setCurrency] = useState('USD');
  const [exchangeRates, setExchangeRates] = useState<{ [key: string]: number }>({ USD: 1 });

  // Check Pro Access
  useEffect(() => {
    if (!isPro && user) {
      toast.error("🔒 Portfolio is a PRO-only feature. Upgrade to unlock!", {
        duration: 5000,
        icon: "💎"
      });
      setTimeout(() => router.push('/pricing'), 1500);
    }
  }, [isPro, user, router]);

  // Fetch Portfolio Data
  const fetchPortfolio = useCallback(async () => {
    if (!user || !isPro) return;

    try {
      setLoading(true);
      const response = await fetch('/api/portfolio', {
        credentials: 'include',
        cache: 'no-store',
        headers: { 'Cache-Control': 'no-cache' }
      });

      if (!response.ok) throw new Error('Failed to fetch portfolio');

      const data = await response.json();
      setHoldings(Array.isArray(data) ? data : []);
      setLastUpdate(new Date());
      calculateMetrics(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching portfolio:', error);
      toast.error('Failed to load portfolio data');
    } finally {
      setLoading(false);
    }
  }, [user, isPro]);

  // Auto-refresh every 30 seconds
  useEffect(() => {
    fetchPortfolio();
    const interval = setInterval(() => {
      setRefreshing(true);
      fetchPortfolio().then(() => setRefreshing(false));
    }, 30000);
    return () => clearInterval(interval);
  }, [fetchPortfolio]);

  // Fetch Exchange Rates
  useEffect(() => {
    const fetchRates = async () => {
      try {
        const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
        const data = await response.json();
        setExchangeRates(data.rates);
      } catch (error) {
        console.error('Failed to fetch exchange rates');
      }
    };
    fetchRates();
  }, []);

  // Calculate All Metrics
  const calculateMetrics = (data: Holding[]) => {
    let value = 0;
    let cost = 0;
    let dayChangeVal = 0;
    const sectorMap: { [key: string]: number } = {};

    data.forEach(holding => {
      const currentVal = holding.current_price * holding.shares;
      const costBasis = (holding.avg_buy_price || holding.current_price) * holding.shares;
      const changeVal = (holding.change_p / 100) * currentVal;

      value += currentVal;
      cost += costBasis;
      dayChangeVal += changeVal;

      // Sector allocation
      const sector = holding.sector || 'Other';
      sectorMap[sector] = (sectorMap[sector] || 0) + currentVal;
    });

    setTotalValue(value);
    setTotalCost(cost);
    setTotalPnL(value - cost);
    setTotalPnLPercent(cost > 0 ? ((value - cost) / cost) * 100 : 0);
    setDayChange(dayChangeVal);
    setDayChangePercent(value > 0 ? (dayChangeVal / value) * 100 : 0);

    // Sector distribution
    const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16'];
    const sectors = Object.entries(sectorMap)
      .map(([name, val], i) => ({
        name,
        value: val,
        percent: value > 0 ? (val / value) * 100 : 0,
        color: colors[i % colors.length]
      }))
      .sort((a, b) => b.value - a.value);
    setSectorData(sectors);

    // Risk metrics (simplified calculations)
    const volatility = data.reduce((sum, h) => sum + Math.abs(h.change_p), 0) / (data.length || 1);
    const diversificationScore = Math.min(100, (sectors.length / 8) * 100);
    
    setRiskMetrics({
      sharpeRatio: totalPnLPercent > 0 ? totalPnLPercent / (volatility || 1) : 0,
      volatility: volatility,
      beta: 1.0,
      maxDrawdown: Math.min(...data.map(h => h.change_p)),
      diversificationScore: diversificationScore
    });
  };

  // Add/Edit Holding
  const handleSubmit = async () => {
    if (!formData.ticker || !formData.shares) {
      toast.error('Please fill in all required fields');
      return;
    }

    const loadingToast = toast.loading(editingId ? 'Updating holding...' : 'Adding holding...');

    try {
      const endpoint = editingId ? `/api/portfolio/${editingId}` : '/api/portfolio/add';
      const method = editingId ? 'PUT' : 'POST';

      const response = await fetch(endpoint, {
        method,
        credentials: 'include',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          ticker: formData.ticker.toUpperCase(),
          quantity: formData.shares,
          ...(formData.avgPrice && { avg_buy_price: formData.avgPrice })
        })
      });

      if (!response.ok) throw new Error('Failed to save holding');

      toast.success(editingId ? 'Holding updated!' : 'Holding added!', { id: loadingToast });
      setShowAddModal(false);
      setEditingId(null);
      setFormData({ ticker: '', shares: '', avgPrice: '' });
      fetchPortfolio();
    } catch (error) {
      toast.error('Failed to save holding', { id: loadingToast });
    }
  };

  // Delete Holding
  const handleDelete = async (id: number, symbol: string) => {
    if (!confirm(`Delete ${symbol} from portfolio?`)) return;

    const loadingToast = toast.loading('Deleting...');
    try {
      const response = await fetch(`/api/portfolio/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (!response.ok) throw new Error('Failed to delete');

      toast.success('Holding deleted!', { id: loadingToast });
      fetchPortfolio();
    } catch (error) {
      toast.error('Failed to delete holding', { id: loadingToast });
    }
  };

  // Format Currency
  const formatCurrency = (amount: number) => {
    if (hideBalances) return '••••••';
    const converted = amount * (exchangeRates[currency] || 1);
    const symbols: { [key: string]: string } = {
      USD: '$', EUR: '€', GBP: '£', JPY: '¥', CAD: 'C$', AUD: 'A$'
    };
    return `${symbols[currency] || '$'}${converted.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  // Format Percent
  const formatPercent = (value: number) => {
    const sign = value >= 0 ? '+' : '';
    return `${sign}${value.toFixed(2)}%`;
  };

  // Loading State
  if (!user || !isPro) {
    return (
      <div className="min-h-screen bg-slate-950">
        <Navbar />
        <div className="flex items-center justify-center h-[calc(100vh-200px)]">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-400">Loading portfolio...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950">
        <Navbar />
        <div className="flex items-center justify-center h-[calc(100vh-200px)]">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-400">Loading your portfolio...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <Navbar />

      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button & Title */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push('/')}
              className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Dashboard</span>
            </button>
            <div className="h-6 w-px bg-slate-700"></div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <BarChart3 className="w-8 h-8 text-blue-500" />
              Portfolio
              <span className="text-sm font-normal text-slate-400 bg-blue-500/10 px-3 py-1 rounded-full">💎 PRO</span>
            </h1>
          </div>

          <div className="flex items-center gap-3">
            {/* Hide Balances Toggle */}
            <button
              onClick={() => setHideBalances(!hideBalances)}
              className="p-2 rounded-lg bg-slate-800/50 hover:bg-slate-700 transition-colors"
              title={hideBalances ? 'Show balances' : 'Hide balances'}
            >
              {hideBalances ? <Eye className="w-5 h-5 text-slate-400" /> : <EyeOff className="w-5 h-5 text-slate-400" />}
            </button>

            {/* Currency Selector */}
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="px-4 py-2 rounded-lg bg-slate-800/50 border border-slate-700 text-white focus:outline-none focus:border-blue-500"
            >
              <option value="USD">USD $</option>
              <option value="EUR">EUR €</option>
              <option value="GBP">GBP £</option>
              <option value="JPY">JPY ¥</option>
              <option value="CAD">CAD</option>
              <option value="AUD">AUD</option>
            </select>

            {/* Refresh Button */}
            <button
              onClick={() => {
                setRefreshing(true);
                fetchPortfolio().then(() => setRefreshing(false));
              }}
              className={`p-2 rounded-lg bg-slate-800/50 hover:bg-slate-700 transition-colors ${refreshing ? 'animate-spin' : ''}`}
              disabled={refreshing}
            >
              <RefreshCw className="w-5 h-5 text-slate-400" />
            </button>

            {/* Add Holding Button */}
            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white rounded-lg font-semibold flex items-center gap-2 transition-all shadow-lg shadow-blue-500/25"
            >
              <Plus className="w-5 h-5" />
              Add Holding
            </button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* Total Value */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 backdrop-blur-sm border border-blue-500/20 rounded-2xl p-6 relative overflow-hidden group hover:border-blue-500/40 transition-all"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full -mr-16 -mt-16"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-2">
                <p className="text-slate-400 text-sm font-medium">Total Value</p>
                <DollarSign className="w-5 h-5 text-blue-400" />
              </div>
              <h3 className="text-3xl font-bold text-white mb-1">{formatCurrency(totalValue)}</h3>
              <p className="text-xs text-slate-500">Updated {lastUpdate.toLocaleTimeString()}</p>
            </div>
          </motion.div>

          {/* Total P&L */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className={`bg-gradient-to-br ${totalPnL >= 0 ? 'from-green-500/10 to-emerald-500/10 border-green-500/20' : 'from-red-500/10 to-rose-500/10 border-red-500/20'} backdrop-blur-sm border rounded-2xl p-6 relative overflow-hidden group hover:border-opacity-40 transition-all`}
          >
            <div className={`absolute top-0 right-0 w-32 h-32 ${totalPnL >= 0 ? 'bg-green-500/5' : 'bg-red-500/5'} rounded-full -mr-16 -mt-16`}></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-2">
                <p className="text-slate-400 text-sm font-medium">Total P&L</p>
                {totalPnL >= 0 ? <TrendingUp className="w-5 h-5 text-green-400" /> : <TrendingDown className="w-5 h-5 text-red-400" />}
              </div>
              <h3 className={`text-3xl font-bold mb-1 ${totalPnL >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {formatCurrency(totalPnL)}
              </h3>
              <p className={`text-sm font-semibold ${totalPnL >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {formatPercent(totalPnLPercent)}
              </p>
            </div>
          </motion.div>

          {/* Day Change */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className={`bg-gradient-to-br ${dayChange >= 0 ? 'from-green-500/10 to-teal-500/10 border-green-500/20' : 'from-red-500/10 to-orange-500/10 border-red-500/20'} backdrop-blur-sm border rounded-2xl p-6 relative overflow-hidden group hover:border-opacity-40 transition-all`}
          >
            <div className={`absolute top-0 right-0 w-32 h-32 ${dayChange >= 0 ? 'bg-green-500/5' : 'bg-red-500/5'} rounded-full -mr-16 -mt-16`}></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-2">
                <p className="text-slate-400 text-sm font-medium">Today's Change</p>
                <Activity className="w-5 h-5 text-slate-400" />
              </div>
              <h3 className={`text-3xl font-bold mb-1 ${dayChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {formatCurrency(dayChange)}
              </h3>
              <p className={`text-sm font-semibold ${dayChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {formatPercent(dayChangePercent)}
              </p>
            </div>
          </motion.div>

          {/* Holdings Count */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 backdrop-blur-sm border border-purple-500/20 rounded-2xl p-6 relative overflow-hidden group hover:border-purple-500/40 transition-all"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full -mr-16 -mt-16"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-2">
                <p className="text-slate-400 text-sm font-medium">Holdings</p>
                <PieChart className="w-5 h-5 text-purple-400" />
              </div>
              <h3 className="text-3xl font-bold text-white mb-1">{holdings.length}</h3>
              <p className="text-xs text-slate-500">Diversification: {riskMetrics.diversificationScore.toFixed(0)}%</p>
            </div>
          </motion.div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-slate-800">
          {(['overview', 'holdings', 'analytics'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 font-semibold capitalize transition-all ${
                activeTab === tab
                  ? 'text-blue-400 border-b-2 border-blue-400'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Performance Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-slate-800/30 backdrop-blur-sm border border-slate-700 rounded-2xl p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <LineChartIcon className="w-6 h-6 text-blue-400" />
                  Portfolio Performance
                </h2>
                <div className="flex gap-2">
                  {(['1D', '1W', '1M', '3M', '1Y', 'ALL'] as const).map((tf) => (
                    <button
                      key={tf}
                      onClick={() => setTimeframe(tf)}
                      className={`px-3 py-1 rounded-lg text-sm font-semibold transition-all ${
                        timeframe === tf
                          ? 'bg-blue-500 text-white'
                          : 'bg-slate-700/50 text-slate-400 hover:bg-slate-700'
                      }`}
                    >
                      {tf}
                    </button>
                  ))}
                </div>
              </div>

              {holdings.length > 0 ? (
                <ResponsiveContainer width="100%" height={350}>
                  <AreaChart
                    data={holdings.map((h, i) => ({
                      name: h.symbol,
                      value: h.current_price * h.shares,
                      pnl: ((h.current_price - (h.avg_buy_price || h.current_price)) * h.shares)
                    }))}
                  >
                    <defs>
                      <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
                    <XAxis dataKey="name" stroke="#94a3b8" />
                    <YAxis stroke="#94a3b8" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1e293b',
                        border: '1px solid #334155',
                        borderRadius: '8px',
                        color: '#fff'
                      }}
                      formatter={(value: any) => formatCurrency(value)}
                    />
                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke="#3b82f6"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#colorValue)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[350px] flex items-center justify-center text-slate-500">
                  <div className="text-center">
                    <BarChart3 className="w-16 h-16 mx-auto mb-4 opacity-20" />
                    <p>Add holdings to see performance chart</p>
                  </div>
                </div>
              )}
            </motion.div>

            {/* Sector Allocation & Risk Metrics */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-slate-800/30 backdrop-blur-sm border border-slate-700 rounded-2xl p-6"
              >
                <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-6">
                  <PieChart className="w-6 h-6 text-purple-400" />
                  Sector Allocation
                </h2>

                {sectorData.length > 0 ? (
                  <>
                    <ResponsiveContainer width="100%" height={250}>
                      <RechartsPieChart>
                        <Pie
                          data={sectorData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={90}
                          paddingAngle={2}
                          dataKey="value"
                        >
                          {sectorData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            backgroundColor: '#1e293b',
                            border: '1px solid #334155',
                            borderRadius: '8px',
                            color: '#fff'
                          }}
                          formatter={(value: any) => formatCurrency(value)}
                        />
                      </RechartsPieChart>
                    </ResponsiveContainer>

                    <div className="space-y-2 mt-4">
                      {sectorData.map((sector, idx) => (
                        <div key={idx} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: sector.color }}></div>
                            <span className="text-sm text-slate-300">{sector.name}</span>
                          </div>
                          <span className="text-sm font-semibold text-white">{sector.percent.toFixed(1)}%</span>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="h-[250px] flex items-center justify-center text-slate-500">
                    <p>No sector data available</p>
                  </div>
                )}
              </motion.div>

              {/* Risk Metrics */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-slate-800/30 backdrop-blur-sm border border-slate-700 rounded-2xl p-6"
              >
                <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-6">
                  <AlertTriangle className="w-6 h-6 text-yellow-400" />
                  Risk Metrics
                </h2>

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-slate-400">Volatility</p>
                      <p className="text-2xl font-bold text-white">{riskMetrics.volatility.toFixed(2)}%</p>
                    </div>
                    <Info className="w-5 h-5 text-slate-500" />
                  </div>

                  <div className="h-px bg-slate-700"></div>

                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-slate-400">Sharpe Ratio</p>
                      <p className="text-2xl font-bold text-white">{riskMetrics.sharpeRatio.toFixed(2)}</p>
                    </div>
                    <Info className="w-5 h-5 text-slate-500" />
                  </div>

                  <div className="h-px bg-slate-700"></div>

                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-slate-400">Beta</p>
                      <p className="text-2xl font-bold text-white">{riskMetrics.beta.toFixed(2)}</p>
                    </div>
                    <Info className="w-5 h-5 text-slate-500" />
                  </div>

                  <div className="h-px bg-slate-700"></div>

                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-slate-400">Max Drawdown</p>
                      <p className="text-2xl font-bold text-red-400">{riskMetrics.maxDrawdown.toFixed(2)}%</p>
                    </div>
                    <Info className="w-5 h-5 text-slate-500" />
                  </div>

                  <div className="h-px bg-slate-700"></div>

                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-slate-400">Diversification Score</p>
                      <p className="text-2xl font-bold text-green-400">{riskMetrics.diversificationScore.toFixed(0)}/100</p>
                    </div>
                    <Info className="w-5 h-5 text-slate-500" />
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        )}

        {/* Holdings Tab */}
        {activeTab === 'holdings' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-800/30 backdrop-blur-sm border border-slate-700 rounded-2xl p-6"
          >
            <h2 className="text-xl font-bold text-white mb-6">Your Holdings</h2>

            {holdings.length > 0 ? (
              <div className="space-y-3">
                {holdings.map((holding, idx) => {
                  const currentValue = holding.current_price * holding.shares;
                  const costBasis = (holding.avg_buy_price || holding.current_price) * holding.shares;
                  const pnl = currentValue - costBasis;
                  const pnlPercent = costBasis > 0 ? (pnl / costBasis) * 100 : 0;

                  return (
                    <motion.div
                      key={holding.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="bg-slate-700/30 border border-slate-600 rounded-xl p-4 hover:border-blue-500/50 transition-all group"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-bold text-white">{holding.symbol}</h3>
                            <span className="text-xs px-2 py-1 bg-blue-500/20 text-blue-300 rounded-full">
                              {holding.sector || 'N/A'}
                            </span>
                            <span className={`flex items-center gap-1 text-sm font-semibold ${holding.change_p >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                              {holding.change_p >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                              {formatPercent(holding.change_p)}
                            </span>
                          </div>

                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <p className="text-slate-400">Shares</p>
                              <p className="font-semibold text-white">{holding.shares.toLocaleString()}</p>
                            </div>
                            <div>
                              <p className="text-slate-400">Current Price</p>
                              <p className="font-semibold text-white">${holding.current_price.toFixed(2)}</p>
                            </div>
                            <div>
                              <p className="text-slate-400">Market Value</p>
                              <p className="font-semibold text-white">{formatCurrency(currentValue)}</p>
                            </div>
                            <div>
                              <p className="text-slate-400">P&L</p>
                              <p className={`font-semibold ${pnl >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                {formatCurrency(pnl)} ({formatPercent(pnlPercent)})
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 ml-4 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => {
                              setEditingId(holding.id);
                              setFormData({
                                ticker: holding.symbol,
                                shares: holding.shares.toString(),
                                avgPrice: holding.avg_buy_price?.toString() || ''
                              });
                              setShowAddModal(true);
                            }}
                            className="p-2 bg-blue-500/20 hover:bg-blue-500/30 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Edit2 className="w-4 h-4 text-blue-400" />
                          </button>
                          <button
                            onClick={() => handleDelete(holding.id, holding.symbol)}
                            className="p-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4 text-red-400" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-20">
                <BarChart3 className="w-20 h-20 mx-auto mb-4 text-slate-600" />
                <h3 className="text-xl font-bold text-white mb-2">No Holdings Yet</h3>
                <p className="text-slate-400 mb-6">Start building your portfolio by adding your first holding</p>
                <button
                  onClick={() => setShowAddModal(true)}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white rounded-lg font-semibold inline-flex items-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  Add First Holding
                </button>
              </div>
            )}
          </motion.div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-slate-800/30 backdrop-blur-sm border border-slate-700 rounded-2xl p-6"
            >
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <Award className="w-6 h-6 text-yellow-400" />
                Top Performers
              </h2>

              {holdings.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Top Gainer */}
                  {holdings.reduce((max, h) => (h.change_p > max.change_p ? h : max), holdings[0]) && (
                    <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-xl p-6">
                      <div className="flex items-center gap-2 mb-4">
                        <TrendingUp className="w-6 h-6 text-green-400" />
                        <h3 className="text-lg font-bold text-white">Top Gainer</h3>
                      </div>
                      {(() => {
                        const top = holdings.reduce((max, h) => (h.change_p > max.change_p ? h : max), holdings[0]);
                        return (
                          <>
                            <p className="text-3xl font-bold text-green-400 mb-2">{top.symbol}</p>
                            <p className="text-2xl font-semibold text-green-400">{formatPercent(top.change_p)}</p>
                            <p className="text-sm text-slate-400 mt-2">Current: ${top.current_price.toFixed(2)}</p>
                          </>
                        );
                      })()}
                    </div>
                  )}

                  {/* Top Loser */}
                  {holdings.reduce((min, h) => (h.change_p < min.change_p ? h : min), holdings[0]) && (
                    <div className="bg-gradient-to-br from-red-500/10 to-rose-500/10 border border-red-500/20 rounded-xl p-6">
                      <div className="flex items-center gap-2 mb-4">
                        <TrendingDown className="w-6 h-6 text-red-400" />
                        <h3 className="text-lg font-bold text-white">Top Loser</h3>
                      </div>
                      {(() => {
                        const bottom = holdings.reduce((min, h) => (h.change_p < min.change_p ? h : min), holdings[0]);
                        return (
                          <>
                            <p className="text-3xl font-bold text-red-400 mb-2">{bottom.symbol}</p>
                            <p className="text-2xl font-semibold text-red-400">{formatPercent(bottom.change_p)}</p>
                            <p className="text-sm text-slate-400 mt-2">Current: ${bottom.current_price.toFixed(2)}</p>
                          </>
                        );
                      })()}
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-center text-slate-500 py-10">No performance data available</p>
              )}
            </motion.div>

            {/* Holdings Distribution */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-slate-800/30 backdrop-blur-sm border border-slate-700 rounded-2xl p-6"
            >
              <h2 className="text-xl font-bold text-white mb-6">Holdings Distribution</h2>

              {holdings.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={holdings.map(h => ({
                    symbol: h.symbol,
                    value: h.current_price * h.shares,
                    percent: ((h.current_price * h.shares) / totalValue) * 100
                  }))}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
                    <XAxis dataKey="symbol" stroke="#94a3b8" />
                    <YAxis stroke="#94a3b8" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1e293b',
                        border: '1px solid #334155',
                        borderRadius: '8px',
                        color: '#fff'
                      }}
                      formatter={(value: any, name?: string) => {
                        if (name === 'value') return formatCurrency(value);
                        if (name === 'percent') return `${value.toFixed(1)}%`;
                        return value;
                      }}
                    />
                    <Bar dataKey="value" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[300px] flex items-center justify-center text-slate-500">
                  <p>Add holdings to see distribution</p>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => {
              setShowAddModal(false);
              setEditingId(null);
              setFormData({ ticker: '', shares: '', avgPrice: '' });
            }}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-slate-800 rounded-2xl p-6 max-w-md w-full border border-slate-700"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">
                  {editingId ? 'Edit Holding' : 'Add Holding'}
                </h2>
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingId(null);
                    setFormData({ ticker: '', shares: '', avgPrice: '' });
                  }}
                  className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Ticker Symbol *
                  </label>
                  <input
                    type="text"
                    value={formData.ticker}
                    onChange={(e) => setFormData({ ...formData, ticker: e.target.value.toUpperCase() })}
                    placeholder="e.g., AAPL"
                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
                    disabled={!!editingId}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Number of Shares *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.shares}
                    onChange={(e) => setFormData({ ...formData, shares: e.target.value })}
                    placeholder="e.g., 10"
                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Average Buy Price (optional)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.avgPrice}
                    onChange={(e) => setFormData({ ...formData, avgPrice: e.target.value })}
                    placeholder="e.g., 150.00"
                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => {
                      setShowAddModal(false);
                      setEditingId(null);
                      setFormData({ ticker: '', shares: '', avgPrice: '' });
                    }}
                    className="flex-1 px-4 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-semibold transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmit}
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white rounded-lg font-semibold transition-all shadow-lg shadow-blue-500/25"
                  >
                    {editingId ? 'Update' : 'Add'} Holding
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}
