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
  DollarSign, PieChart, AlertTriangle, Lock, Sparkles
} from 'lucide-react';

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
  const { user, credits, isLoggedIn } = useAuth();
  const { t } = useTranslation();
  
  const [holdings, setHoldings] = useState<Holding[]>([]);
  const [summary, setSummary] = useState<PortfolioSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [auditResult, setAuditResult] = useState<any>(null);
  const [auditLoading, setAuditLoading] = useState(false);
  
  // Add form state
  const [newTicker, setNewTicker] = useState('');
  const [newQuantity, setNewQuantity] = useState('');
  const [newAvgPrice, setNewAvgPrice] = useState('');
  
  // Edit ticker state
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editTicker, setEditTicker] = useState('');
  
  useEffect(() => {
    if (isLoggedIn) {
      fetchPortfolio();
    }
  }, [isLoggedIn]);
  
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
      toast.error(error.message || 'Failed to add stock to portfolio', { id: loadingToast });
    }
  };
  
  const deleteHolding = async (holdingId: number, ticker: string) => {
    if (!confirm(`Remove ${ticker} from your portfolio?`)) return;
    
    const loadingToast = toast.loading(`Removing ${ticker}...`);
    
    try {
      const response = await fetch(`/api/portfolio/${holdingId}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Failed to delete holding');
      }
      
      toast.success(`✅ ${ticker} removed from portfolio`, { id: loadingToast });
      fetchPortfolio();
    } catch (error: any) {
      console.error('Error deleting holding:', error);
      toast.error(error.message || 'Failed to remove stock', { id: loadingToast });
    }
  };
  
  const runAIAudit = async () => {
    if (!user || credits < 5) {
      toast.error('You need 5 credits to run an AI Portfolio Audit. Visit Pricing to buy credits!', { duration: 5000 });
      return;
    }
    
    if (!confirm('Run AI Portfolio Audit for 5 credits?')) return;
    
    const loadingToast = toast.loading('🤖 AI analyzing your portfolio...');
    
    try {
      setAuditLoading(true);
      const response = await fetch('/api/portfolio/audit', {
        method: 'POST',
        credentials: 'include'
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Audit failed');
      }
      
      const data = await response.json();
      setAuditResult(data.audit);
      toast.success(`✅ Portfolio audit complete! Health Score: ${data.audit.portfolio_health_score}/100`, { id: loadingToast, duration: 5000 });
      
      // Refresh user credits
      window.location.reload();
    } catch (error: any) {
      console.error('Error running audit:', error);
      toast.error(error.message || 'Failed to run portfolio audit', { id: loadingToast });
    } finally {
      setAuditLoading(false);
    }
  };
  
  const updateTicker = async (holdingId: number, oldTicker: string, newTicker: string) => {
    const loadingToast = toast.loading(`Updating ${oldTicker} to ${newTicker}...`);
    
    try {
      // Delete old holding
      await fetch(`/api/portfolio/${holdingId}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      
      // Get the holding details to preserve quantity and avg_buy_price
      const holding = holdings.find(h => h.id === holdingId);
      if (!holding) throw new Error('Holding not found');
      
      // Add new holding with updated ticker
      const response = await fetch('/api/portfolio/add', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
          ticker: newTicker,
          quantity: holding.quantity.toString(),
          ...(holding.avg_buy_price && { avg_buy_price: holding.avg_buy_price.toString() })
        })
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Failed to update ticker');
      }
      
      toast.success(`✅ Updated to ${newTicker}`, { id: loadingToast });
      setEditingId(null);
      setEditTicker('');
      fetchPortfolio();
    } catch (error: any) {
      console.error('Error updating ticker:', error);
      toast.error(error.message || 'Failed to update ticker', { id: loadingToast });
    }
  };
  
  const getSuggestedTickers = (baseTicker: string) => {
    const exchanges = [
      { suffix: '.AS', name: 'Amsterdam' },
      { suffix: '.DE', name: 'XETRA/Germany' },
      { suffix: '.L', name: 'London' },
      { suffix: '.PA', name: 'Paris' },
      { suffix: '.SW', name: 'Switzerland' },
      { suffix: '.MI', name: 'Milan' },
      { suffix: '.BR', name: 'Brussels' },
      { suffix: '.LS', name: 'Lisbon' },
      { suffix: '.MC', name: 'Madrid' },
      { suffix: '.VI', name: 'Vienna' }
    ];
    return exchanges.map(ex => ({ ticker: `${baseTicker}${ex.suffix}`, exchange: ex.name }));
  };
  
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
      
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-black text-white mb-2">📊 Portfolio Tracker</h1>
          <p className="text-slate-400">Track your investments with live P&L calculations</p>
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
              <div className="text-3xl font-bold text-white">${summary.total_value.toFixed(2)}</div>
            </div>
            
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 rounded-xl p-6">
              <div className="text-slate-400 text-sm mb-1">Total Cost</div>
              <div className="text-3xl font-bold text-white">${summary.total_cost.toFixed(2)}</div>
            </div>
            
            <div className={`bg-gradient-to-br ${summary.total_pnl >= 0 ? 'from-green-900/50' : 'from-red-900/50'} to-slate-900 border ${summary.total_pnl >= 0 ? 'border-green-500/30' : 'border-red-500/30'} rounded-xl p-6`}>
              <div className="text-slate-400 text-sm mb-1">Total P&L</div>
              <div className={`text-3xl font-bold ${summary.total_pnl >= 0 ? 'text-green-400' : 'text-red-400'} flex items-center gap-2`}>
                {summary.total_pnl >= 0 ? <TrendingUp className="w-6 h-6" /> : <TrendingDown className="w-6 h-6" />}
                ${Math.abs(summary.total_pnl).toFixed(2)}
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
        
        {/* AI Audit CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 border border-purple-500/50 rounded-xl p-6 mb-6"
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
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
              onClick={runAIAudit}
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
                <>Processing...</>
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
        
        {/* Holdings Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-slate-900 border border-slate-800 rounded-xl p-6 mb-6"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white">Holdings</h2>
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg font-semibold text-white flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Add Stock
            </button>
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
                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
                  />
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
              
              {/* Exchange Suffix Suggestions */}
              {newTicker && newTicker.length > 0 && !newTicker.includes('.') && (
                <div className="bg-slate-900/50 rounded-lg p-3 border border-blue-500/30">
                  <div className="text-xs text-blue-400 mb-2">
                    💡 Can't find "{newTicker}"? Try adding an exchange suffix:
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {getSuggestedTickers(newTicker).map((suggestion) => (
                      <button
                        key={suggestion.ticker}
                        onClick={() => setNewTicker(suggestion.ticker)}
                        className="text-xs bg-blue-600/80 hover:bg-blue-500 text-white px-3 py-1.5 rounded transition-colors"
                        title={`${suggestion.exchange} exchange`}
                      >
                        {suggestion.ticker}
                        <span className="text-blue-200 ml-1">({suggestion.exchange})</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
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
                    <th className="text-left py-3 px-4 text-slate-400 font-semibold">Avg Price</th>
                    <th className="text-left py-3 px-4 text-slate-400 font-semibold">Current Price</th>
                    <th className="text-left py-3 px-4 text-slate-400 font-semibold">Market Value</th>
                    <th className="text-left py-3 px-4 text-slate-400 font-semibold">P&L</th>
                    <th className="text-right py-3 px-4 text-slate-400 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {holdings.map((holding) => (
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
                              <div className="text-xs text-yellow-400 mb-2">💡 Try these exchange suffixes:</div>
                              <div className="flex flex-wrap gap-2 mb-3">
                                {getSuggestedTickers(holding.ticker).map((suggestion) => (
                                  <button
                                    key={suggestion.ticker}
                                    onClick={() => updateTicker(holding.id, holding.ticker, suggestion.ticker)}
                                    className="text-xs bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 rounded transition-colors"
                                    title={suggestion.exchange}
                                  >
                                    {suggestion.ticker}
                                  </button>
                                ))}
                              </div>
                              <div className="text-xs text-slate-400 mb-2">Or enter custom ticker:</div>
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
                      <td className="py-4 px-4 text-white">${holding.avg_buy_price?.toFixed(2) || 'N/A'}</td>
                      <td className="py-4 px-4 text-white">
                        {holding.price_error ? (
                          <span className="text-yellow-400">Price Error</span>
                        ) : (
                          `$${holding.current_price.toFixed(2)}`
                        )}
                      </td>
                      <td className="py-4 px-4 text-white font-semibold">
                        {holding.price_error ? (
                          <span className="text-yellow-400">N/A</span>
                        ) : (
                          `$${holding.market_value.toFixed(2)}`
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
                            {holding.pnl >= 0 ? '+' : ''}${holding.pnl.toFixed(2)}
                            <div className="text-sm">({holding.pnl_percent >= 0 ? '+' : ''}{holding.pnl_percent.toFixed(2)}%)</div>
                          </div>
                        )}
                      </td>
                      <td className="py-4 px-4 text-right">
                        <button
                          onClick={() => deleteHolding(holding.id, holding.ticker)}
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
      </main>
      
      <Footer />
    </div>
  );
}
