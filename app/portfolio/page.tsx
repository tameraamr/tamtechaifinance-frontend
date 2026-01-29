
"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../src/context/AuthContext';
import { useTranslation } from '../../src/context/TranslationContext';
import Navbar from '../../src/components/Navbar';
import Footer from '../../src/components/Footer';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import {
  TrendingUp, TrendingDown, Plus, Trash2, 
  DollarSign, PieChart, AlertTriangle, Lock, Search, Trophy, Award, ArrowLeft
} from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, PieChart as RechartsPieChart, Pie, Cell, AreaChart, Area, BarChart, Bar } from 'recharts';





// Debounce hook
const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
};

interface Holding {
  id: number;
  symbol: string;
  current_price: number;
  change_p: number;
  shares: number;
  avg_buy_price: number | null;
  sector: string | null;
}
interface PortfolioSummary {
  total_value: number;
  total_cost: number;
  total_pnl: number;
  total_pnl_percent: number;
  holdings_count: number;
}

export default function PortfolioPage() {
  const { user, credits, isLoggedIn } = useAuth();
  const { t } = useTranslation();
  const router = useRouter();

  // Paywall: Require 20+ credits for portfolio access
  if (!isLoggedIn || credits <= 20) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <Navbar />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md mx-auto text-center p-8 bg-slate-800 rounded-xl border border-slate-700"
        >
          <Lock className="w-16 h-16 text-yellow-400 mx-auto mb-6" />
          <h1 className="text-2xl font-bold text-white mb-4">
            Professional Portfolio Tracker
          </h1>
          <p className="text-slate-300 mb-6">
            Unlock your Professional Portfolio Tracker with advanced analytics, live charts, and performance insights.
          </p>
          <div className="bg-slate-700 rounded-lg p-4 mb-6">
            <p className="text-yellow-400 font-semibold">Requires 20+ credits</p>
            <p className="text-slate-400 text-sm">Current balance: {credits} credits</p>
          </div>
          <button
            onClick={() => window.location.href = '/pricing'}
            className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-bold py-3 px-8 rounded-lg transition-all duration-200 transform hover:scale-105"
          >
            Upgrade Now
          </button>
        </motion.div>
        <Footer />
      </div>
    );
  }

  // Rest of the portfolio page for premium users...
  const [holdings, setHoldings] = useState<Holding[]>([]);
  const [summary, setSummary] = useState<PortfolioSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);

  // Handler functions must be defined before any JSX usage

  const deleteHolding = async (id: number, ticker: string) => {
    const loadingToast = toast.loading(`Deleting ${ticker} from portfolio...`);
    try {
      const response = await fetch(`/api/portfolio/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Failed to delete holding');
      }
      toast.success(`✅ ${ticker} removed from portfolio`, { id: loadingToast });
      // Refresh portfolio
      fetchPortfolio();
    } catch (error: any) {
      console.error('Error deleting holding:', error);
      toast.error((error as Error).message || 'Failed to delete stock from portfolio', { id: loadingToast });
    }
  };

  const updateTicker = async (id: number, oldTicker: string, newTicker: string) => {
    const loadingToast = toast.loading(`Updating ${oldTicker} to ${newTicker}...`);
    try {
      const response = await fetch(`/api/portfolio/${id}`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
          ticker: newTicker.toUpperCase()
        })
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Failed to update ticker');
      }
      toast.success(`✅ Updated ${oldTicker} to ${newTicker}`, { id: loadingToast });
      // Refresh portfolio
      fetchPortfolio();
    } catch (error: any) {
      console.error('Error updating ticker:', error);
      toast.error((error as Error).message || 'Failed to update ticker', { id: loadingToast });
    }
  };
  
  // Add form state
  const [newTicker, setNewTicker] = useState('');
  const [newQuantity, setNewQuantity] = useState('');
  const [newAvgPrice, setNewAvgPrice] = useState('');
  const [suggestions, setSuggestions] = useState<{ symbol: string, name: string }[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  // Edit ticker state
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editTicker, setEditTicker] = useState('');
  
  // Confirmation state
  const [confirmDelete, setConfirmDelete] = useState<{id: number, ticker: string} | null>(null);
  
  // Currency selection
  const [currency, setCurrency] = useState('USD');
  const [exchangeRates, setExchangeRates] = useState<{[key: string]: number}>({ USD: 1 });
  
  // Sorting state
  const [sortBy, setSortBy] = useState<'value' | 'change' | 'symbol'>('value');
  
  const debouncedTicker = useDebounce(newTicker, 300);
  
  // Sector data for pie chart
  const [sectorData, setSectorData] = useState<{name: string, value: number, percentage: number, color: string}[]>([]);
  
  // Market winners/losers data
  const [marketData, setMarketData] = useState<{winners: any[], losers: any[], timestamp?: string} | null>(null);
  
  // KPI values
  const [totalBalance, setTotalBalance] = useState(0);
  const [totalPnLPercent, setTotalPnLPercent] = useState(0);
  const [total24hChange, setTotal24hChange] = useState(0);
  
  useEffect(() => {
    if (isLoggedIn) {
      fetchPortfolio();
      fetchMarketData();
      // Welcome toast
      if (user) {
        toast.success(`Welcome back! You have ${credits} credits`, { duration: 4000, icon: '👋' });
      }
    }
  }, [isLoggedIn]);
  
  // Fetch exchange rates
  useEffect(() => {
    const fetchRates = async () => {
      try {
        const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
        const data = await response.json();
        setExchangeRates(data.rates);
      } catch (error) {
        console.error('Failed to fetch exchange rates:', error);
        // Fallback rates if API fails
        setExchangeRates({
          USD: 1,
          EUR: 0.92,
          GBP: 0.79,
          JPY: 149.50,
          CAD: 1.35,
          AUD: 1.52,
          CHF: 0.87,
          CNY: 7.24,
          INR: 83.12
        });
      }
    };
    fetchRates();
  }, []);
  
  // Autocomplete for ticker
  useEffect(() => {
    const getSuggestions = async () => {
      if (!debouncedTicker || debouncedTicker.length < 2) {
        setSuggestions([]);
        setShowSuggestions(false);
        return;
      }

      try {
        const response = await fetch(`/api/search-ticker/${debouncedTicker}`);
        if (response.ok) {
          const data = await response.json();
          setSuggestions(data);
          setShowSuggestions(true);
        }
      } catch (error) {
        console.error('Search error:', error);
      }
    };

    getSuggestions();
  }, [debouncedTicker]);
  
  // Close suggestions on outside click
  useEffect(() => {
    const closeSuggestions = () => setShowSuggestions(false);
    window.addEventListener('click', closeSuggestions);
    return () => window.removeEventListener('click', closeSuggestions);
  }, []);
  
  const fetchPortfolio = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/portfolio', {
        credentials: 'include'
      });
      
      if (!response.ok) throw new Error('Failed to fetch portfolio');
      
      const data = await response.json();
      // Backend now returns array directly, not wrapped in object
      setHoldings(data);
      setSummary(null); // No summary in new format
      calculateSectorData(data);
      calculateKPIs(data);
    } catch (error) {
      console.error('Error fetching portfolio:', error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate sector distribution for pie chart
  const calculateSectorData = (holdings: Holding[]) => {
    const sectorMap: {[key: string]: number} = {};
    let totalValue = 0;

    holdings.forEach(holding => {
      // Calculate market value from current_price * shares
      const marketValue = (holding.current_price || 0) * (holding.shares || 0);
      if (marketValue > 0) {
        const sector = holding.sector || 'Unknown';
        sectorMap[sector] = (sectorMap[sector] || 0) + marketValue;
        totalValue += marketValue;
      }
    });

    const colors = [
      '#8884d8', '#82ca9d', '#ffc658', '#ff7c7c', '#8dd1e1',
      '#d084d0', '#ffb347', '#87ceeb', '#dda0dd', '#98fb98'
    ];

    const sectorData = Object.entries(sectorMap)
      .map(([name, value], index) => ({
        name,
        value,
        percentage: totalValue > 0 ? (value / totalValue * 100) : 0,
        color: colors[index % colors.length]
      }))
      .sort((a, b) => b.value - a.value);

    setSectorData(sectorData);
  };

  // Calculate KPI values
  const calculateKPIs = (holdings: Holding[]) => {
    let totalValue = 0;
    let totalCost = 0;
    let total24hChangeValue = 0;

    holdings.forEach(holding => {
      const currentPrice = holding.current_price || 0;
      const shares = holding.shares || 0;
      const avgBuyPrice = holding.avg_buy_price || currentPrice; // Fallback to current price if no buy price
      const changePercent = holding.change_p || 0;

      const currentValue = currentPrice * shares;
      const costBasis = avgBuyPrice * shares;
      const change24hValue = (changePercent / 100) * currentValue;

      totalValue += currentValue;
      totalCost += costBasis;
      total24hChangeValue += change24hValue;
    });

    setTotalBalance(totalValue);
    
    // Calculate total P&L %
    const totalPnL = totalValue - totalCost;
    const totalPnLPercentValue = totalCost > 0 ? (totalPnL / totalCost) * 100 : 0;
    setTotalPnLPercent(totalPnLPercentValue);
    
    setTotal24hChange(total24hChangeValue);
  };

  // Fetch market winners/losers data
  const fetchMarketData = async () => {
    try {
      const response = await fetch('/api/market-winners-losers');
      if (response.ok) {
        const data = await response.json();
        setMarketData(data);
      }
    } catch (error) {
      console.error('Error fetching market data:', error);
    }
  };
  
  const addHolding = async () => {
    if (!newTicker || !newQuantity) {
      toast.error('Please enter ticker and quantity');
      return;
    }
    const loadingToast = toast.loading(`Adding ${newTicker.toUpperCase()} to portfolio...`);
    try {
      const response = await fetch('/api/portfolio/add', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
          ticker: newTicker.toUpperCase(),
          quantity: newQuantity,
          ...(newAvgPrice && { avg_buy_price: newAvgPrice })
        })
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Failed to add holding');
      }
      const data = await response.json();
      toast.success(`✅ ${newTicker.toUpperCase()} added to portfolio`, { id: loadingToast });
      // Optimistic update: add holding immediately to state
      const newHolding: Holding = {
        id: Date.now(), // temp id, will be replaced on fetch
        symbol: newTicker.toUpperCase(),
        current_price: 0,
        change_p: 0,
        shares: parseFloat(newQuantity),
        avg_buy_price: newAvgPrice ? parseFloat(newAvgPrice) : null,
        sector: null
      };
      setHoldings(prev => [...prev, newHolding]);
      // Reset form
      setNewTicker('');
      setNewQuantity('');
      setNewAvgPrice('');
      setShowAddForm(false);
      // Refresh portfolio to get real data
      fetchPortfolio();
    } catch (error: any) {
      console.error('Error adding holding:', error);
      toast.error((error as Error).message || 'Failed to add stock to portfolio', { id: loadingToast });
    }
  };
  
  const convertCurrency = (amountUSD: number) => {
    const rate = exchangeRates[currency] || 1;
    return amountUSD * rate;
  };
  
  const getStockCurrency = (ticker: string): string => {
    // Detect currency based on exchange suffix
    if (ticker.includes('.AS') || ticker.includes('.DE') || ticker.includes('.PA') || ticker.includes('.MI') || ticker.includes('.BR') || ticker.includes('.LS') || ticker.includes('.MC') || ticker.includes('.VI')) return 'EUR';
    if (ticker.includes('.L')) return 'GBP';
    if (ticker.includes('.SW')) return 'CHF';
    if (ticker.includes('.T')) return 'JPY';
    if (ticker.includes('.TO')) return 'CAD';
    if (ticker.includes('.AX')) return 'AUD';
    return 'USD'; // Default to USD for US stocks
  };
  
  const formatPrice = (amountUSD: number) => {
    const converted = convertCurrency(amountUSD);
    const symbols: {[key: string]: string} = {
      USD: '$', EUR: '€', GBP: '£', JPY: '¥', CAD: 'C$', 
      AUD: 'A$', CHF: 'CHF', CNY: '¥', INR: '₹'
    };
    const symbol = symbols[currency] || currency + ' ';
    return `${symbol}${converted.toFixed(2)}`;
  };
  
  const formatStockPrice = (price: number, ticker: string) => {
    const stockCurrency = getStockCurrency(ticker);
    const symbols: {[key: string]: string} = {
      USD: '$', EUR: '€', GBP: '£', JPY: '¥', CAD: 'C$', 
      AUD: 'A$', CHF: 'CHF', CNY: '¥', INR: '₹'
    };
    const symbol = symbols[stockCurrency] || stockCurrency + ' ';
    return { formatted: `${symbol}${price.toFixed(2)}`, currency: stockCurrency };
  };
  
  const sortedHoldings = [...holdings].sort((a, b) => {
    if (sortBy === 'value') return (b.current_price * b.shares) - (a.current_price * a.shares);
    if (sortBy === 'change') return b.change_p - a.change_p;
    return a.symbol.localeCompare(b.symbol);
  });

  // Prepare data for portfolio value graph
  const graphData = holdings.map(h => ({
    name: h.symbol,
    value: (h.current_price || 0) * (h.shares || 0)
  }));

  // Calculate top performers based on change percentage
  const topWinner = holdings.length > 0 ? holdings.reduce((prev, current) => 
    (prev.change_p > current.change_p) ? prev : current
  ) : null;
  const topLoser = holdings.length > 0 ? holdings.reduce((prev, current) => 
    (prev.change_p < current.change_p) ? prev : current
  ) : null;
  
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
        <Navbar />
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Portfolio Tracker</h1>
          <p className="text-xl text-slate-300 mb-8">Please log in to access your portfolio</p>
          <a href="/pricing" className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg font-semibold text-white">
            Sign Up / Log In
          </a>
        </div>
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      <Navbar />

      {/* Back Button */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-4">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-4 touch-manipulation"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>
      </div>

      {/* Sector Distribution Pie Chart */}
        {sectorData.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12 }}
            className="mb-8 bg-slate-900 border border-purple-500/30 rounded-xl p-6"
          >
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <PieChart className="w-6 h-6 text-purple-400" />
              Sector Distribution
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="flex justify-center">
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsPieChart>
                    <Pie
                      data={sectorData}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, value }) => {
                        const total = sectorData.reduce((sum, item) => sum + item.value, 0);
                        const percentage = total > 0 ? (value / total * 100) : 0;
                        return `${name}: ${percentage.toFixed(1)}%`;
                      }}
                    >
                      {sectorData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value: number | undefined) => value ? [formatPrice(value), 'Value'] : ['N/A', 'Value']}
                      labelStyle={{ color: '#000' }}
                      contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569', borderRadius: '8px' }}
                    />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-white mb-3">Sector Breakdown</h3>
                {sectorData.map((sector, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-slate-800/50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: sector.color }}
                      ></div>
                      <span className="text-slate-200 text-sm">{sector.name}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-white font-medium">{formatPrice(sector.value)}</div>
                      <div className="text-slate-400 text-xs">{sector.percentage.toFixed(1)}%</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}


        {/* KPI Summary Cards */}
        {holdings.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
          >
            {/* Total Balance */}
            <div className="bg-gradient-to-br from-blue-900/30 to-slate-900 border border-blue-500/30 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-2">
                <DollarSign className="w-6 h-6 text-blue-400" />
                <div className="text-slate-400 text-sm">Total Balance</div>
              </div>
              <div className="text-2xl font-bold text-white">
                {formatPrice(totalBalance)}
              </div>
            </div>

            {/* Total P&L % */}
            <div className={`border rounded-xl p-6 ${
              totalPnLPercent >= 0
                ? 'bg-gradient-to-br from-green-900/30 to-slate-900 border-green-500/30'
                : 'bg-gradient-to-br from-red-900/30 to-slate-900 border-red-500/30'
            }`}>
              <div className="flex items-center gap-3 mb-2">
                {totalPnLPercent >= 0 ? (
                  <TrendingUp className="w-6 h-6 text-green-400" />
                ) : (
                  <TrendingDown className="w-6 h-6 text-red-400" />
                )}
                <div className="text-slate-400 text-sm">Total P&L</div>
              </div>
              <div className={`text-2xl font-bold ${
                totalPnLPercent >= 0 ? 'text-green-400' : 'text-red-400'
              }`}>
                {totalPnLPercent >= 0 ? '+' : ''}{totalPnLPercent.toFixed(2)}%
              </div>
            </div>

            {/* 24h Change */}
            <div className={`border rounded-xl p-6 ${
              total24hChange >= 0
                ? 'bg-gradient-to-br from-green-900/30 to-slate-900 border-green-500/30'
                : 'bg-gradient-to-br from-red-900/30 to-slate-900 border-red-500/30'
            }`}>
              <div className="flex items-center gap-3 mb-2">
                {total24hChange >= 0 ? (
                  <TrendingUp className="w-6 h-6 text-green-400" />
                ) : (
                  <TrendingDown className="w-6 h-6 text-red-400" />
                )}
                <div className="text-slate-400 text-sm">24h Change</div>
              </div>
              <div className={`text-2xl font-bold ${
                total24hChange >= 0 ? 'text-green-400' : 'text-red-400'
              }`}>
                {total24hChange >= 0 ? '+' : ''}{formatPrice(total24hChange)}
              </div>
            </div>
          </motion.div>
        )}

        {/* Portfolio Value Graph - moved below summary cards */}
        {holdings.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="mb-8 bg-slate-900 border border-blue-500/30 rounded-xl p-6"
          >
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <PieChart className="w-6 h-6 text-blue-400" />
              Portfolio Value by Ticker
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={graphData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} />
                <Tooltip 
                  contentStyle={{ background: '#1e293b', color: '#fff', border: '1px solid #a78bfa' }}
                  formatter={(value: number | undefined) => value ? [formatPrice(value), 'Value'] : ['N/A', 'Value']}
                />
                <Bar dataKey="value" fill="#a78bfa" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        )}
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-black text-white mb-2">📊 Portfolio Tracker</h1>
          <p className="text-slate-400">Track your investments with live P&L calculations</p>
        </motion.div>
        
        {/* Currency Selector */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-4 flex justify-end"
        >
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-2 flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-slate-400" />
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="bg-slate-700 text-white px-3 py-1.5 rounded border border-slate-600 focus:outline-none focus:border-blue-500 cursor-pointer"
            >
              <option value="USD">🇺🇸 USD</option>
              <option value="EUR">🇪🇺 EUR</option>
              <option value="GBP">🇬🇧 GBP</option>
              <option value="JPY">🇯🇵 JPY</option>
              <option value="CAD">🇨🇦 CAD</option>
              <option value="AUD">🇦🇺 AUD</option>
              <option value="CHF">🇨🇭 CHF</option>
              <option value="CNY">🇨🇳 CNY</option>
              <option value="INR">🇮🇳 INR</option>
            </select>
          </div>
        </motion.div>
        
        {/* Top Winner & Loser */}
        {holdings.length > 0 && (topWinner || topLoser) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6"
          >
            {topWinner && (
              <div className="bg-gradient-to-br from-green-900/30 to-slate-900 border border-green-500/30 rounded-xl p-5 flex items-center gap-4">
                <div className="bg-green-600/20 p-3 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-green-400" />
                </div>
                <div className="flex-1">
                  <div className="text-slate-400 text-xs mb-1">🏆 Top Performer</div>
                  <div className="font-bold text-white text-lg">{topWinner.symbol}</div>
                  <div className="text-green-400 font-semibold">+{topWinner.change_p.toFixed(2)}%</div>
                </div>
              </div>
            )}
            {topLoser && (
              <div className="bg-gradient-to-br from-red-900/30 to-slate-900 border border-red-500/30 rounded-xl p-5 flex items-center gap-4">
                <div className="bg-red-600/20 p-3 rounded-lg">
                  <TrendingDown className="w-6 h-6 text-red-400" />
                </div>
                <div className="flex-1">
                  <div className="text-slate-400 text-xs mb-1">📉 Needs Attention</div>
                  <div className="font-bold text-white text-lg">{topLoser.symbol}</div>
                  <div className="text-red-400 font-semibold">{topLoser.change_p.toFixed(2)}%</div>
                </div>
              </div>
            )}
          </motion.div>
        )}
        {/* Delete Confirmation Modal */}
        {confirmDelete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setConfirmDelete(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-slate-900 border border-red-500/30 rounded-xl p-6 max-w-md w-full"
            >
              <h3 className="text-xl font-bold text-white mb-3">Remove {confirmDelete.ticker}?</h3>
              <p className="text-slate-300 mb-6">Are you sure you want to remove {confirmDelete.ticker} from your portfolio?</p>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    deleteHolding(confirmDelete.id, confirmDelete.ticker);
                    setConfirmDelete(null);
                  }}
                  className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-500 rounded-lg font-semibold text-white transition-all"
                >
                  Remove
                </button>
                <button
                  onClick={() => setConfirmDelete(null)}
                  className="flex-1 px-4 py-2.5 bg-slate-700 hover:bg-slate-600 rounded-lg font-semibold text-white transition-all"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
        
        {/* Holdings Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-slate-900 border border-slate-800 rounded-xl p-6 mb-6"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white">Holdings</h2>
            <div className="flex items-center gap-3">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'value' | 'change' | 'symbol')}
                className="px-3 py-2 bg-slate-800 text-white border border-slate-700 rounded-lg text-sm focus:outline-none focus:border-blue-500"
              >
                <option value="value">💰 Sort by Value</option>
                <option value="change">📈 Sort by Change %</option>
                <option value="symbol">🔍 Sort by Symbol</option>
              </select>
              <button
                onClick={() => setShowAddForm(!showAddForm)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg font-semibold text-white flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Add Stock
              </button>
            </div>
          </div>
          
          {/* Add Form */}
          {showAddForm && (
            <div className="bg-slate-800 rounded-lg p-4 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-3">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Ticker (e.g., AAPL)"
                    value={newTicker}
                    autoComplete="disabled-by-admin"
                    autoCorrect="off"
                    spellCheck="false"
                    autoCapitalize="off"
                    onChange={(e) => setNewTicker(e.target.value.toUpperCase())}
                    onFocus={() => newTicker.length >= 2 && setShowSuggestions(true)}
                    onClick={(e) => e.stopPropagation()}
                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
                  />
                  
                  {/* Autocomplete Suggestions */}
                  {showSuggestions && suggestions.length > 0 && (
                    <div className="absolute left-0 right-0 mt-2 bg-slate-800 border border-slate-700 rounded-lg shadow-2xl overflow-hidden z-50 max-h-60 overflow-y-auto">
                      {suggestions.map((s, i) => (
                        <button
                          key={i}
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setNewTicker(s.symbol);
                            setShowSuggestions(false);
                          }}
                          className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-blue-600/20 border-b border-slate-700 last:border-0 transition-all text-left"
                        >
                          <div className="flex flex-col items-start">
                            <span className="text-blue-400 font-bold text-sm">{s.symbol}</span>
                            <span className="text-slate-400 text-xs truncate max-w-[200px]">{s.name}</span>
                          </div>
                          <Search size={12} className="text-slate-600" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <input
                  type="number"
                  placeholder="Quantity"
                  value={newQuantity}
                  onChange={(e) => setNewQuantity(e.target.value)}
                  className="px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
                />
                <input
                  type="number"
                  step="0.01"
                  placeholder="Avg Buy Price (optional)"
                  value={newAvgPrice}
                  onChange={(e) => setNewAvgPrice(e.target.value)}
                  className="px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
                />
                <button
                  onClick={addHolding}
                  className="px-4 py-2 bg-green-600 hover:bg-green-500 rounded-lg font-semibold text-white"
                >
                  Add to Portfolio
                </button>
              </div>
              
              {/* European ETF Guide */}
              <div className="mt-3 bg-blue-900/20 border border-blue-500/30 rounded-lg p-3">
                <div className="text-xs font-semibold text-blue-400 mb-2">📌 Popular European ETFs (for Revolut users):</div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs">
                  <div>
                    <span className="text-slate-400">VWCE (World):</span>
                    <button onClick={() => setNewTicker('VWCE.AS')} className="ml-2 text-blue-400 hover:text-blue-300 underline">VWCE.AS</button>
                  </div>
                  <div>
                    <span className="text-slate-400">S&P 500:</span>
                    <button onClick={() => setNewTicker('CSPX.L')} className="ml-2 text-blue-400 hover:text-blue-300 underline">CSPX.L</button>
                    <span className="text-slate-500"> or</span>
                    <button onClick={() => setNewTicker('VUSA.L')} className="ml-1 text-blue-400 hover:text-blue-300 underline">VUSA.L</button>
                  </div>
                  <div>
                    <span className="text-slate-400">Nasdaq-100:</span>
                    <button onClick={() => setNewTicker('EQQQ.L')} className="ml-2 text-blue-400 hover:text-blue-300 underline">EQQQ.L</button>
                    <span className="text-slate-500"> or</span>
                    <button onClick={() => setNewTicker('NQSE.DE')} className="ml-1 text-blue-400 hover:text-blue-300 underline">NQSE.DE</button>
                  </div>
                  <div>
                    <span className="text-slate-400">MSCI USA:</span>
                    <button onClick={() => setNewTicker('VUSA.AS')} className="ml-2 text-blue-400 hover:text-blue-300 underline">VUSA.AS</button>
                  </div>
                  <div>
                    <span className="text-slate-400">Emerging Markets:</span>
                    <button onClick={() => setNewTicker('VFEM.AS')} className="ml-2 text-blue-400 hover:text-blue-300 underline">VFEM.AS</button>
                  </div>
                  <div>
                    <span className="text-slate-400">Europe:</span>
                    <button onClick={() => setNewTicker('VEUR.AS')} className="ml-2 text-blue-400 hover:text-blue-300 underline">VEUR.AS</button>
                  </div>
                </div>
                <div className="text-xs text-slate-500 mt-2">
                  💡 Can't find your ETF? Try: YourTicker.AS (Amsterdam), .DE (Germany), .L (London), .PA (Paris)
                </div>
              </div>
            </div>
          )}
          
          {/* Table */}
          {loading ? (
            <div className="text-center py-12 text-slate-400">Loading portfolio...</div>
          ) : holdings.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <PieChart className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p className="text-xl">Your portfolio is empty</p>
              <p className="text-sm mt-2">Click "Add Stock" to start tracking your investments</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-700">
                    <th className="text-left py-3 px-4 text-slate-400 font-semibold">Symbol</th>
                    <th className="text-left py-3 px-4 text-slate-400 font-semibold">Shares</th>
                    <th className="text-left py-3 px-4 text-slate-400 font-semibold">Current Price</th>
                    <th className="text-left py-3 px-4 text-slate-400 font-semibold">Change %</th>
                    <th className="text-left py-3 px-4 text-slate-400 font-semibold">Sector</th>
                    <th className="text-right py-3 px-4 text-slate-400 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {holdings.map((holding) => (
                    <tr key={holding.symbol} className="border-b border-slate-800 hover:bg-slate-800/50">
                      <td className="py-4 px-4">
                        <div className="font-bold text-white">
                          {holding.symbol}
                        </div>
                      </td>
                      <td className="py-4 px-4 text-white">
                        {holding.shares?.toFixed(2)}
                      </td>
                      <td className="py-4 px-4 text-white">
                        ${holding.current_price?.toFixed(2) || '0.00'}
                      </td>
                      <td className="py-4 px-4">
                        <span className={`font-semibold ${holding.change_p >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {holding.change_p >= 0 ? '+' : ''}{holding.change_p?.toFixed(2) || '0.00'}%
                        </span>
                      </td>
                      <td className="py-4 px-4 text-white">
                        {holding.sector || 'Unknown'}
                      </td>
                      <td className="py-4 px-4 text-right">
                        <button
                          onClick={() => setConfirmDelete({id: holding.id, ticker: holding.symbol})}
                          className="p-2 text-red-400 hover:bg-red-900/20 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>
        
      {/* End of main content */}
      

      <Footer />
    </div>
  );
}
