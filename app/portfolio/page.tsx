  // --- MISSING FUNCTION STUBS ---
  const runAIAudit = () => {
    // TODO: Implement AI audit logic here
    toast('AI Audit triggered (stub)', { icon: '🧠' });
  };

  const deleteHolding = (id: number, ticker: string) => {
    // TODO: Implement delete logic here
    toast(`Delete ${ticker} (stub)`, { icon: '🗑️' });
  };

  const updateTicker = (id: number, oldTicker: string, newTicker: string) => {
    // TODO: Implement update logic here
    toast(`Update ${oldTicker} to ${newTicker} (stub)`, { icon: '✏️' });
  };
"use client";
import { useState, useEffect } from 'react';
import { useAuth } from '../../src/context/AuthContext';
import { useTranslation } from '../../src/context/TranslationContext';
import Navbar from '../../src/components/Navbar';
import Footer from '../../src/components/Footer';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import {
  TrendingUp, TrendingDown, Plus, Trash2, Brain, 
  DollarSign, PieChart, AlertTriangle, Lock, Sparkles, Search
} from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

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
  ticker: string;
  company_name: string;
  quantity: number;
  avg_buy_price: number | null;
  current_price: number;
  market_value: number;
  cost_basis: number;
  pnl: number;
  pnl_percent: number;
  price_error?: boolean;
}
interface PortfolioSummary {
  total_value: number;
  total_cost: number;
  total_pnl: number;
  total_pnl_percent: number;
  holdings_count: number;
}

export default function PortfolioPage() {
    // Audit report modal state
    const [showReportModal, setShowReportModal] = useState(false);
    const [reportTimestamp, setReportTimestamp] = useState<number | null>(null);
  const { user, credits, isLoggedIn } = useAuth();
  const { t } = useTranslation();
  
  const [holdings, setHoldings] = useState<Holding[]>([]);
  const [summary, setSummary] = useState<PortfolioSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [auditResult, setAuditResult] = useState<any>(null);
  const [auditLoading, setAuditLoading] = useState(false);
  const [loadingMessageIdx, setLoadingMessageIdx] = useState(0);
  const loadingMessages = [
    '🧠 AI is analyzing sector correlations...',
    '📊 Calculating portfolio risk & volatility...',
    '🔍 Comparing your holdings with 10-year market data...',
    '✨ Generating your personalized health score...'
  ];
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (auditLoading) {
      interval = setInterval(() => {
        setLoadingMessageIdx((idx) => (idx + 1) % loadingMessages.length);
      }, 2000);
    } else {
      setLoadingMessageIdx(0);
    }
    return () => clearInterval(interval);
  }, [auditLoading]);
  
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
  const [showAuditConfirm, setShowAuditConfirm] = useState(false);
  
  // Currency selection
  const [currency, setCurrency] = useState('USD');
  const [exchangeRates, setExchangeRates] = useState<{[key: string]: number}>({ USD: 1 });
  
  // Sorting state
  const [sortBy, setSortBy] = useState<'value' | 'pnl' | 'ticker'>('value');
  
  const debouncedTicker = useDebounce(newTicker, 300);
  
  useEffect(() => {
    if (isLoggedIn) {
      fetchPortfolio();
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
      setHoldings(data.holdings);
      setSummary(data.summary);
    } catch (error) {
      console.error('Error fetching portfolio:', error);
    } finally {
      setLoading(false);
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
      // Reset form
      setNewTicker('');
      setNewQuantity('');
      setNewAvgPrice('');
      setShowAddForm(false);
      // Refresh portfolio
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
    if (sortBy === 'value') return b.market_value - a.market_value;
    if (sortBy === 'pnl') return b.pnl_percent - a.pnl_percent;
    return a.ticker.localeCompare(b.ticker);
  });

  // Prepare data for portfolio value graph
  const graphData = holdings.map(h => ({
    name: h.ticker,
    value: h.market_value
  }));
  
  const topWinner = holdings.filter(h => !h.price_error && h.pnl > 0).sort((a, b) => b.pnl_percent - a.pnl_percent)[0];
  const topLoser = holdings.filter(h => !h.price_error && h.pnl < 0).sort((a, b) => a.pnl_percent - b.pnl_percent)[0];
  
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
      {/* Open Report Button */}
      {auditResult && reportTimestamp && (Date.now() - reportTimestamp < 24 * 60 * 60 * 1000) && (
        <div className="fixed bottom-8 right-8 z-50">
          <button
            onClick={() => setShowReportModal(true)}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg font-bold text-white shadow-lg hover:scale-105 transition-all flex items-center gap-2"
          >
            <Brain className="w-5 h-5" />
            Open Report
          </button>
        </div>
      )}
      {/* Audit Report Modal */}
      {showReportModal && auditResult && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setShowReportModal(false)}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={e => e.stopPropagation()}
            className="bg-slate-900 border border-purple-500/30 rounded-xl p-8 max-w-2xl w-full overflow-y-auto max-h-[90vh]"
          >
            <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
              <Brain className="w-8 h-8 text-purple-400" />
              AI Portfolio Audit Report
            </h2>
            {/* Repeat audit results UI here */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-slate-800/50 rounded-lg p-4">
                <div className="text-slate-400 text-sm mb-1">Portfolio Health</div>
                <div className="text-3xl font-bold text-purple-400">{auditResult.portfolio_health_score}/100</div>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-4">
                <div className="text-slate-400 text-sm mb-1">Diversification</div>
                <div className="text-3xl font-bold text-blue-400">{auditResult.diversification_score}/100</div>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-4">
                <div className="text-slate-400 text-sm mb-1">Risk Level</div>
                <div className={`text-3xl font-bold ${
                  auditResult.risk_level === 'LOW' ? 'text-green-400' : 
                  auditResult.risk_level === 'MEDIUM' ? 'text-yellow-400' : 'text-red-400'
                }`}>{auditResult.risk_level}</div>
              </div>
            </div>
            <div className="bg-slate-800/50 rounded-lg p-6 mb-6">
              <h3 className="text-xl font-bold text-white mb-3">Summary</h3>
              <p className="text-slate-200">{auditResult.summary}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-slate-800/50 rounded-lg p-6">
                <h3 className="text-xl font-bold text-green-400 mb-3">✅ Strengths</h3>
                <ul className="space-y-2">
                  {auditResult.strengths.map((strength: string, i: number) => (
                    <li key={i} className="text-slate-200">• {strength}</li>
                  ))}
                </ul>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-6">
                <h3 className="text-xl font-bold text-red-400 mb-3">⚠️ Weaknesses</h3>
                <ul className="space-y-2">
                  {auditResult.weaknesses.map((weakness: string, i: number) => (
                    <li key={i} className="text-slate-200">• {weakness}</li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="bg-slate-800/50 rounded-lg p-6 mt-6">
              <h3 className="text-xl font-bold text-blue-400 mb-3">💡 Recommendations</h3>
              <ul className="space-y-2">
                {auditResult.recommendations.map((rec: string, i: number) => (
                  <li key={i} className="text-slate-200">• {rec}</li>
                ))}
              </ul>
            </div>
            <div className="flex justify-end mt-8 gap-4">
              <button
                onClick={() => setShowReportModal(false)}
                className="px-5 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg font-semibold text-white"
              >
                Close
              </button>
              <button
                onClick={() => { setShowReportModal(false); runAIAudit(); }}
                disabled={credits < 5}
                className={`px-5 py-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg font-semibold text-white flex items-center gap-2 ${credits < 5 ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 transition-all'}`}
              >
                <Sparkles className="w-4 h-4" />
                Refresh Report (5 Credits)
              </button>
            </div>
            <div className="text-xs text-slate-500 mt-4 text-right">Report expires in {Math.max(0, Math.floor((24 * 60 * 60 * 1000 - (Date.now() - reportTimestamp!)) / (60 * 60 * 1000)))}h</div>
          </motion.div>
        </motion.div>
      )}
        {/* Portfolio Value Graph */}
        {holdings.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="mb-8 bg-slate-900 border border-blue-500/30 rounded-xl p-6"
          >
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <PieChart className="w-6 h-6 text-blue-400" />
              Portfolio Value by Ticker
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={graphData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} />
                <Tooltip contentStyle={{ background: '#1e293b', color: '#fff', border: '1px solid #a78bfa' }} />
                <Line type="monotone" dataKey="value" stroke="#a78bfa" strokeWidth={3} dot={{ r: 4 }} />
              </LineChart>
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
        
        {/* Summary Cards */}
        {summary && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6"
          >
            <div className="bg-gradient-to-br from-blue-900/50 to-slate-900 border border-blue-500/30 rounded-xl p-6">
              <div className="text-slate-400 text-sm mb-1">Total Value</div>
              <div className="text-3xl font-bold text-white">{formatPrice(summary.total_value)}</div>
            </div>
            
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 rounded-xl p-6">
              <div className="text-slate-400 text-sm mb-1">Total Cost</div>
              <div className="text-3xl font-bold text-white">{formatPrice(summary.total_cost)}</div>
            </div>
            
            <div className={`bg-gradient-to-br ${summary.total_pnl >= 0 ? 'from-green-900/50' : 'from-red-900/50'} to-slate-900 border ${summary.total_pnl >= 0 ? 'border-green-500/30' : 'border-red-500/30'} rounded-xl p-6`}>
              <div className="text-slate-400 text-sm mb-1">Total P&L</div>
              <div className={`text-3xl font-bold ${summary.total_pnl >= 0 ? 'text-green-400' : 'text-red-400'} flex items-center gap-2`}>
                {summary.total_pnl >= 0 ? <TrendingUp className="w-6 h-6" /> : <TrendingDown className="w-6 h-6" />}
                {formatPrice(Math.abs(summary.total_pnl))}
              </div>
            </div>
            
            <div className={`bg-gradient-to-br ${summary.total_pnl_percent >= 0 ? 'from-green-900/50' : 'from-red-900/50'} to-slate-900 border ${summary.total_pnl_percent >= 0 ? 'border-green-500/30' : 'border-red-500/30'} rounded-xl p-6`}>
              <div className="text-slate-400 text-sm mb-1">Return %</div>
              <div className={`text-3xl font-bold ${summary.total_pnl_percent >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {summary.total_pnl_percent >= 0 ? '+' : ''}{summary.total_pnl_percent.toFixed(2)}%
              </div>
            </div>
          </motion.div>
        )}
        
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
                  <div className="text-slate-400 text-xs mb-1">\ud83c\udfc6 Top Performer</div>
                  <div className="font-bold text-white text-lg">{topWinner.ticker}</div>
                  <div className="text-green-400 font-semibold">+{topWinner.pnl_percent.toFixed(2)}%</div>
                </div>
              </div>
            )}
            {topLoser && (
              <div className="bg-gradient-to-br from-red-900/30 to-slate-900 border border-red-500/30 rounded-xl p-5 flex items-center gap-4">
                <div className="bg-red-600/20 p-3 rounded-lg">
                  <TrendingDown className="w-6 h-6 text-red-400" />
                </div>
                <div className="flex-1">
                  <div className="text-slate-400 text-xs mb-1">\ud83d\udcc9 Needs Attention</div>
                  <div className="font-bold text-white text-lg">{topLoser.ticker}</div>
                  <div className="text-red-400 font-semibold">{topLoser.pnl_percent.toFixed(2)}%</div>
                </div>
              </div>
            )}
          </motion.div>
        )}
        
        {/* AI Audit CTA + Sophisticated Loader */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 border border-purple-500/50 rounded-xl p-6 mb-6 relative"
        >
          {auditLoading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center z-50 bg-black/60 backdrop-blur-sm rounded-xl">
              {/* Circular Progress Indicator - premium animation */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.4 }}
                className="mb-6"
              >
                <svg className="animate-spin-slow h-16 w-16 text-purple-400" viewBox="0 0 50 50">
                  <circle className="opacity-20" cx="25" cy="25" r="20" stroke="#a78bfa" strokeWidth="6" fill="none" />
                  <path d="M25 5 a20 20 0 0 1 0 40" stroke="#f472b6" strokeWidth="6" fill="none" strokeLinecap="round" />
                </svg>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-lg font-semibold text-white text-center"
              >
                {loadingMessages[loadingMessageIdx]}
              </motion.div>
            </div>
          )}
          <div className={`flex flex-col md:flex-row items-center justify-between gap-4 ${auditLoading ? 'opacity-30 pointer-events-none' : ''}`}> 
            <div className="flex items-center gap-4">
              <div className="bg-purple-600/20 p-3 rounded-lg">
                <Brain className="w-8 h-8 text-purple-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  AI Portfolio Audit
                  {credits < 5 && <Lock className="w-5 h-5 text-yellow-400" />}
                </h3>
                <p className="text-slate-300">
                  {holdings.length === 0 
                    ? "Add stocks to your portfolio first" 
                    : credits >= 5 
                      ? "Get AI-powered risk analysis, correlations & health score" 
                      : "Your portfolio is tracked, but is it safe? Get a full AI Risk Audit for 5 credits."}
                </p>
              </div>
            </div>
            <button
              onClick={() => credits >= 5 ? setShowAuditConfirm(true) : window.location.href = '/pricing'}
              disabled={holdings.length === 0 || auditLoading}
              className={`px-8 py-4 rounded-lg font-bold text-white transition-all flex items-center gap-2 ${
                holdings.length === 0 || auditLoading
                  ? 'bg-slate-600 cursor-not-allowed'
                  : credits >= 5
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700'
                    : 'bg-yellow-600 hover:bg-yellow-700'
              }`}
            >
              {auditLoading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-purple-300" viewBox="0 0 24 24">
                    <circle className="opacity-20" cx="12" cy="12" r="10" stroke="#a78bfa" strokeWidth="4" fill="none" />
                    <path d="M12 2 a10 10 0 0 1 0 20" stroke="#f472b6" strokeWidth="4" fill="none" strokeLinecap="round" />
                  </svg>
                  Loading...
                </>
              ) : credits >= 5 ? (
                <>
                  <Sparkles className="w-5 h-5" />
                  Run Audit (5 Credits)
                </>
              ) : (
                <>
                  <Lock className="w-5 h-5" />
                  Buy Credits to Unlock
                </>
              )}
            </button>
          </div>
        </motion.div>
        
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
        
        {/* Audit Confirmation Modal */}
        {showAuditConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowAuditConfirm(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-slate-900 border border-purple-500/30 rounded-xl p-6 max-w-md w-full"
            >
              <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                <Brain className="w-6 h-6 text-purple-400" />
                Run AI Portfolio Audit?
              </h3>
              <p className="text-slate-300 mb-2">This will use 5 credits to analyze:</p>
              <ul className="text-sm text-slate-400 mb-6 space-y-1">
                <li>✓ Portfolio health & risk assessment</li>
                <li>✓ Diversification analysis</li>
                <li>✓ Correlation risks</li>
                <li>✓ Personalized recommendations</li>
              </ul>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowAuditConfirm(false);
                    runAIAudit();
                  }}
                  className="flex-1 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 rounded-lg font-semibold text-white transition-all flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  Run Audit (5 Credits)
                </button>
                <button
                  onClick={() => setShowAuditConfirm(false)}
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
                onChange={(e) => setSortBy(e.target.value as 'value' | 'pnl' | 'ticker')}
                className="px-3 py-2 bg-slate-800 text-white border border-slate-700 rounded-lg text-sm focus:outline-none focus:border-blue-500"
              >
                <option value="value">\ud83d\udcb0 Sort by Value</option>
                <option value="pnl">\ud83d\udcc8 Sort by Performance</option>
                <option value="ticker">\ud83d\udd24 Sort by Ticker</option>
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
                    <th className="text-left py-3 px-4 text-slate-400 font-semibold">Ticker</th>
                    <th className="text-left py-3 px-4 text-slate-400 font-semibold">Shares</th>
                    <th className="text-left py-3 px-4 text-slate-400 font-semibold">Currency</th>
                    <th className="text-left py-3 px-4 text-slate-400 font-semibold">Avg Price</th>
                    <th className="text-left py-3 px-4 text-slate-400 font-semibold">Current Price</th>
                    <th className="text-left py-3 px-4 text-slate-400 font-semibold">Market Value</th>
                    <th className="text-left py-3 px-4 text-slate-400 font-semibold">P&L</th>
                    <th className="text-right py-3 px-4 text-slate-400 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedHoldings.map((holding) => (
                    <tr key={holding.id} className="border-b border-slate-800 hover:bg-slate-800/50">
                      <td className="py-4 px-4">
                        <div>
                          <div className="font-bold text-white flex items-center gap-2">
                            {holding.ticker}
                            {holding.price_error && (
                              <span className="text-xs bg-yellow-900/50 text-yellow-400 px-2 py-1 rounded" title="Price data unavailable. Click Fix Ticker to update">
                                ⚠️ No Price
                              </span>
                            )}
                          </div>
                          <div className="text-sm text-slate-400">{holding.company_name}</div>
                          
                          {/* Edit Mode */}
                          {editingId === holding.id && holding.price_error && (
                            <div className="mt-3 bg-slate-800 rounded-lg p-3 border border-yellow-500/30">
                              <div className="text-xs text-slate-400 mb-2">Enter correct ticker symbol:</div>
                              <div className="flex gap-2">
                                <input
                                  type="text"
                                  value={editTicker}
                                  onChange={(e) => setEditTicker(e.target.value.toUpperCase())}
                                  placeholder="e.g., VWCE.AS"
                                  className="flex-1 px-3 py-1.5 bg-slate-700 border border-slate-600 rounded text-white text-sm"
                                />
                                <button
                                  onClick={() => editTicker && updateTicker(holding.id, holding.ticker, editTicker)}
                                  className="px-4 py-1.5 bg-green-600 hover:bg-green-500 rounded text-white text-sm font-semibold"
                                >
                                  Update
                                </button>
                                <button
                                  onClick={() => { setEditingId(null); setEditTicker(''); }}
                                  className="px-4 py-1.5 bg-slate-600 hover:bg-slate-500 rounded text-white text-sm"
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-4 text-white">{holding.quantity}</td>
                      <td className="py-4 px-4">
                        <span className="text-xs font-semibold text-blue-400 bg-blue-900/30 px-2 py-1 rounded">
                          {getStockCurrency(holding.ticker)}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-white">
                        {holding.avg_buy_price ? formatStockPrice(holding.avg_buy_price, holding.ticker).formatted : 'N/A'}
                      </td>
                      <td className="py-4 px-4 text-white">
                        {holding.price_error ? (
                          <span className="text-yellow-400">Price Error</span>
                        ) : (
                          formatStockPrice(holding.current_price, holding.ticker).formatted
                        )}
                      </td>
                      <td className="py-4 px-4 text-white font-semibold">
                        {holding.price_error ? (
                          <span className="text-yellow-400">N/A</span>
                        ) : (
                          formatStockPrice(holding.market_value, holding.ticker).formatted
                        )}
                      </td>
                      <td className="py-4 px-4">
                        {holding.price_error ? (
                          <button
                            onClick={() => { setEditingId(holding.id); setEditTicker(''); }}
                            className="text-sm bg-yellow-600 hover:bg-yellow-500 text-white px-3 py-1 rounded font-semibold"
                          >
                            Fix Ticker
                          </button>
                        ) : (
                          <div className={`font-semibold ${holding.pnl >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {holding.pnl >= 0 ? '+' : ''}{formatStockPrice(holding.pnl, holding.ticker).formatted}
                            <div className="text-sm">({holding.pnl_percent >= 0 ? '+' : ''}{holding.pnl_percent.toFixed(2)}%)</div>
                          </div>
                        )}
                      </td>
                      <td className="py-4 px-4 text-right">
                        <button
                          onClick={() => setConfirmDelete({id: holding.id, ticker: holding.ticker})}
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
        
        {/* Audit Results */}
        {auditResult && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="bg-gradient-to-br from-purple-900/20 to-slate-900 border border-purple-500/30 rounded-xl p-8"
          >
            <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
              <Brain className="w-8 h-8 text-purple-400" />
              AI Portfolio Audit Results
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-slate-800/50 rounded-lg p-4">
                <div className="text-slate-400 text-sm mb-1">Portfolio Health</div>
                <div className="text-3xl font-bold text-purple-400">{auditResult.portfolio_health_score}/100</div>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-4">
                <div className="text-slate-400 text-sm mb-1">Diversification</div>
                <div className="text-3xl font-bold text-blue-400">{auditResult.diversification_score}/100</div>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-4">
                <div className="text-slate-400 text-sm mb-1">Risk Level</div>
                <div className={`text-3xl font-bold ${
                  auditResult.risk_level === 'LOW' ? 'text-green-400' : 
                  auditResult.risk_level === 'MEDIUM' ? 'text-yellow-400' : 'text-red-400'
                }`}>{auditResult.risk_level}</div>
              </div>
            </div>
            
            <div className="bg-slate-800/50 rounded-lg p-6 mb-6">
              <h3 className="text-xl font-bold text-white mb-3">Summary</h3>
              <p className="text-slate-200">{auditResult.summary}</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-slate-800/50 rounded-lg p-6">
                <h3 className="text-xl font-bold text-green-400 mb-3">✅ Strengths</h3>
                <ul className="space-y-2">
                  {auditResult.strengths.map((strength: string, i: number) => (
                    <li key={i} className="text-slate-200">• {strength}</li>
                  ))}
                </ul>
              </div>
              
              <div className="bg-slate-800/50 rounded-lg p-6">
                <h3 className="text-xl font-bold text-red-400 mb-3">⚠️ Weaknesses</h3>
                <ul className="space-y-2">
                  {auditResult.weaknesses.map((weakness: string, i: number) => (
                    <li key={i} className="text-slate-200">• {weakness}</li>
                  ))}
                </ul>
              </div>
            </div>
            
            <div className="bg-slate-800/50 rounded-lg p-6 mt-6">
              <h3 className="text-xl font-bold text-blue-400 mb-3">💡 Recommendations</h3>
              <ul className="space-y-2">
                {auditResult.recommendations.map((rec: string, i: number) => (
                  <li key={i} className="text-slate-200">• {rec}</li>
                ))}
              </ul>
            </div>
          </motion.div>
        )}
      {/* End of main content */}
      
      <Footer />
    </div>
  );
}
