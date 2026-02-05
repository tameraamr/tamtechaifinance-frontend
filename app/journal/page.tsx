"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import AddTradeModal from '@/src/components/AddTradeModal';
import Link from 'next/link';
import Navbar from '@/src/components/Navbar';
import Footer from '@/src/components/Footer';

interface JournalStats {
  total_trades: number;
  open_trades: number;
  closed_trades: number;
  wins: number;
  losses: number;
  breakeven: number;
  win_rate: number;
  total_pips: number;
  total_profit_usd: number;
  net_profit_usd: number;
  profit_factor: number;
  average_win_pips: number;
  average_loss_pips: number;
  largest_win_usd: number;
  largest_loss_usd: number;
  trades_remaining_free: number;
}

interface Trade {
  id: number;
  pair_ticker: string;
  asset_type: string;
  order_type: string;
  entry_price: number;
  exit_price?: number;
  lot_size: number;
  profit_loss_usd?: number;
  profit_loss_pips?: number;
  risk_reward_ratio: number;
  status: string;
  result?: string;
  entry_time: string;
  exit_time?: string;
  strategy?: string;
  trading_session?: string;
}

export default function TradingJournal() {
  const router = useRouter();
  const [stats, setStats] = useState<JournalStats | null>(null);
  const [trades, setTrades] = useState<Trade[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddTrade, setShowAddTrade] = useState(false);
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isPro, setIsPro] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://tamtech-ai.onrender.com';

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = Cookies.get('access_token');
    if (!token) {
      setIsLoggedIn(false);
      setLoading(false);
      return;
    }

    setIsLoggedIn(true);
    try {
      const res = await fetch(`${API_BASE}/users/me`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setIsPro(data.is_pro === 1);
        fetchStats();
        fetchTrades();
      } else {
        setIsLoggedIn(false);
        setLoading(false);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      setIsLoggedIn(false);
      setLoading(false);
    }
  };

  const handleNewTradeClick = () => {
    if (!isLoggedIn) {
      setShowLoginModal(true);
      return;
    }

    if (!isPro && stats && stats.total_trades >= 10) {
      setShowPremiumModal(true);
      return;
    }

    setShowAddTrade(true);
  };

  const fetchStats = async () => {
    const token = Cookies.get('access_token');
    try {
      const res = await fetch(`${API_BASE}/journal/stats`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setStats(data);
        
        // Show premium modal if user hit 10-trade limit
        if (!isPro && data.trades_remaining_free === 0 && data.total_trades === 10) {
          setShowPremiumModal(true);
        }
      } else {
        console.error(`Stats fetch failed with status ${res.status}: ${API_BASE}/journal/stats`);
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  const fetchTrades = async () => {
    const token = Cookies.get('access_token');
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/journal/trades?limit=50`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setTrades(data);
      } else {
        console.error(`Trades fetch failed with status ${res.status}: ${API_BASE}/journal/trades`);
      }
    } catch (error) {
      console.error('Failed to fetch trades:', error);
    } finally {
      setLoading(false);
    }
  };

  // Demo data for non-logged-in users
  const demoTrades = [
    { id: 1, pair: 'XAUUSD', type: 'Buy', entry: '2650.50', exit: '2665.00', pips: '+14.5', pl: '+$145', rr: '1:2.6', status: 'win' },
    { id: 2, pair: 'EURUSD', type: 'Sell', entry: '1.08450', exit: '1.08320', pips: '+13.0', pl: '+$130', rr: '1:2.1', status: 'win' },
    { id: 3, pair: 'NAS100', type: 'Buy', entry: '18250', exit: '18190', pips: '-60', pl: '-$60', rr: '1:3.0', status: 'loss' },
  ];

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black text-white">
        {/* Homepage Navbar */}
        <Navbar />

        {/* Hero Section for non-logged-in users */}
        {!isLoggedIn && (
          <div className="border-b border-amber-500/10">
            <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8 text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600 bg-clip-text text-transparent mb-4">
                  Professional Trading Journal
                </h1>
                <p className="text-lg text-gray-400 mb-3 max-w-3xl mx-auto">
                  Track every Forex, Gold (XAUUSD), and Indices trade with military precision. 
                  Automatic pip calculations, R:R ratios, and AI-powered trade analysis.
                </p>
                <p className="text-base text-gray-500 mb-6">
                  Join thousands of traders mastering their craft with TamtechAI's intelligent journal system.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    onClick={() => setShowLoginModal(true)}
                    className="px-8 py-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 rounded-lg font-bold text-lg shadow-xl shadow-amber-500/30 transition-all hover:scale-105"
                  >
                    Start Free - 10 Trades
                  </button>
                  <button
                    onClick={() => router.push('/pricing')}
                    className="px-8 py-4 bg-gray-800 hover:bg-gray-700 rounded-lg font-semibold transition-all"
                  >
                    View PRO Features
                  </button>
                </div>
              </motion.div>
            </div>
          </div>
        )}

      {/* Stats Dashboard */}
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {isLoggedIn && stats ? (
          <>
            {/* Dashboard Header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-amber-400 to-yellow-500 bg-clip-text text-transparent">
                  Your Trading Journal
                </h2>
                <p className="text-gray-400 mt-1">Track every pip, master every trade</p>
              </div>
              <button
                onClick={handleNewTradeClick}
                className="px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 rounded-lg font-semibold shadow-lg shadow-amber-500/30 transition-all hover:scale-105"
              >
                + New Trade
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Net Profit Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-6 border border-amber-500/20 shadow-xl"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-400 text-sm">Net Profit</span>
                <span className="text-2xl">💰</span>
              </div>
              <div className={`text-3xl font-bold ${stats.net_profit_usd >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                ${stats.net_profit_usd.toFixed(2)}
              </div>
              <div className="text-gray-500 text-sm mt-1">
                {stats.total_pips >= 0 ? '+' : ''}{stats.total_pips.toFixed(1)} pips
              </div>
            </motion.div>

            {/* Win Rate Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-6 border border-amber-500/20 shadow-xl"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-400 text-sm">Win Rate</span>
                <span className="text-2xl">🎯</span>
              </div>
              <div className="text-3xl font-bold text-amber-400">
                {stats.win_rate.toFixed(1)}%
              </div>
              <div className="text-gray-500 text-sm mt-1">
                {stats.wins}W / {stats.losses}L / {stats.breakeven}BE
              </div>
            </motion.div>

            {/* Profit Factor Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-6 border border-amber-500/20 shadow-xl"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-400 text-sm">Profit Factor</span>
                <span className="text-2xl">📊</span>
              </div>
              <div className={`text-3xl font-bold ${stats.profit_factor >= 1.5 ? 'text-emerald-400' : stats.profit_factor >= 1 ? 'text-amber-400' : 'text-red-400'}`}>
                {stats.profit_factor.toFixed(2)}
              </div>
              <div className="text-gray-500 text-sm mt-1">
                {stats.closed_trades} closed trades
              </div>
            </motion.div>
          </div>

          {/* Free Tier Notice */}
          {!isPro && stats.trades_remaining_free > 0 && (
            <div className="mb-6 p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg">
              <p className="text-amber-400 text-sm">
                ⚡ {stats.trades_remaining_free} free trades remaining. 
                <button onClick={() => setShowPremiumModal(true)} className="ml-2 underline hover:text-amber-300">
                  Upgrade to PRO
                </button> for unlimited access.
              </p>
            </div>
          )}

          {/* Trades Table */}
          <div className="bg-gray-900/50 backdrop-blur-xl rounded-xl border border-gray-800 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-800/50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Pair</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Type</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Entry</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Exit</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Pips</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">P&L</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">R:R</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {loading ? (
                    <tr>
                      <td colSpan={8} className="px-6 py-12 text-center text-gray-500">
                        Loading trades...
                      </td>
                    </tr>
                  ) : trades.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="px-6 py-12 text-center text-gray-500">
                        No trades yet. Start logging your journey! 📈
                      </td>
                    </tr>
                  ) : (
                    trades.map((trade) => (
                      <motion.tr
                        key={trade.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="hover:bg-gray-800/30 transition-colors cursor-pointer"
                        onClick={() => router.push(`/journal/${trade.id}`)}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="font-medium text-amber-400">{trade.pair_ticker}</div>
                          <div className="text-xs text-gray-500">{trade.asset_type}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 rounded text-xs font-semibold ${
                            trade.order_type === 'Buy' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
                          }`}>
                            {trade.order_type}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                          {trade.entry_price.toFixed(trade.asset_type === 'forex' && trade.pair_ticker.includes('JPY') ? 3 : 5)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                          {trade.exit_price ? trade.exit_price.toFixed(trade.asset_type === 'forex' && trade.pair_ticker.includes('JPY') ? 3 : 5) : '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {trade.profit_loss_pips !== null && trade.profit_loss_pips !== undefined ? (
                            <span className={trade.profit_loss_pips >= 0 ? 'text-emerald-400' : 'text-red-400'}>
                              {trade.profit_loss_pips >= 0 ? '+' : ''}{trade.profit_loss_pips.toFixed(1)}
                            </span>
                          ) : (
                            <span className="text-gray-500">-</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {trade.profit_loss_usd !== null && trade.profit_loss_usd !== undefined ? (
                            <span className={`font-semibold ${trade.profit_loss_usd >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                              ${trade.profit_loss_usd >= 0 ? '+' : ''}{trade.profit_loss_usd.toFixed(2)}
                            </span>
                          ) : (
                            <span className="text-gray-500">-</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                          1:{trade.risk_reward_ratio.toFixed(1)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 rounded text-xs font-semibold ${
                            trade.status === 'open' ? 'bg-amber-500/20 text-amber-400' : 
                            trade.result === 'win' ? 'bg-emerald-500/20 text-emerald-400' :
                            trade.result === 'loss' ? 'bg-red-500/20 text-red-400' :
                            'bg-gray-500/20 text-gray-400'
                          }`}>
                            {trade.status === 'open' ? 'Open' : trade.result}
                          </span>
                        </td>
                      </motion.tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
          </>
        ) : (
          /* Marketing content for non-logged-in users */
          <div className="space-y-16">
            {/* Demo Section - MOVED UP */}
            <section className="bg-gray-900/30 rounded-2xl p-8 border border-amber-500/20">
              <h2 className="text-2xl font-bold text-center mb-4">
                See It In Action
              </h2>
              <p className="text-gray-400 text-center mb-6">
                This is what your trading journal looks like. Clean, professional, and data-driven.
              </p>

              <div className="bg-gray-900/50 backdrop-blur-xl rounded-xl border border-gray-800 overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-800/50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase">Pair</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase">Type</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase">Entry</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase">Exit</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase">Pips</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase">P&L</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase">R:R</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase">Result</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800">
                    {demoTrades.map((trade) => (
                      <tr key={trade.id} className="hover:bg-gray-800/30">
                        <td className="px-6 py-4">
                          <div className="font-medium text-amber-400">{trade.pair}</div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded text-xs font-semibold ${
                            trade.type === 'Buy' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
                          }`}>
                            {trade.type}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-300">{trade.entry}</td>
                        <td className="px-6 py-4 text-sm text-gray-300">{trade.exit}</td>
                        <td className="px-6 py-4">
                          <span className={trade.pips.startsWith('+') ? 'text-emerald-400' : 'text-red-400'}>
                            {trade.pips}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`font-semibold ${trade.pl.startsWith('+') ? 'text-emerald-400' : 'text-red-400'}`}>
                            {trade.pl}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-300">{trade.rr}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded text-xs font-semibold ${
                            trade.status === 'win' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
                          }`}>
                            {trade.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* Features Section */}
            <section>
              <h2 className="text-3xl font-bold text-center mb-12">
                Why TamtechAI Trading Journal?
              </h2>
              <div className="grid md:grid-cols-3 gap-8">
                <div className="bg-gray-900/50 p-8 rounded-xl border border-gray-800">
                  <div className="text-4xl mb-4">🎯</div>
                  <h3 className="text-xl font-bold text-amber-400 mb-3">Automatic Calculations</h3>
                  <p className="text-gray-400">
                    No manual math! We automatically calculate pips, R:R ratios, risk %, and P&L for Forex (5 decimals), 
                    Gold (2 decimals), and Indices.
                  </p>
                </div>

                <div className="bg-gray-900/50 p-8 rounded-xl border border-gray-800">
                  <div className="text-4xl mb-4">🤖</div>
                  <h3 className="text-xl font-bold text-amber-400 mb-3">AI Trade Scoring</h3>
                  <p className="text-gray-400">
                    Gemini AI analyzes your trades and provides actionable feedback. 
                    Learn from wins and losses with intelligent insights.
                  </p>
                </div>

                <div className="bg-gray-900/50 p-8 rounded-xl border border-gray-800">
                  <div className="text-4xl mb-4">📊</div>
                  <h3 className="text-xl font-bold text-amber-400 mb-3">Performance Analytics</h3>
                  <p className="text-gray-400">
                    Track win rates, profit factors, and session-based performance. 
                    Identify your edge across different market conditions.
                  </p>
                </div>
              </div>
            </section>

            {/* How It Works */}
            <section>
              <h2 className="text-3xl font-bold text-center mb-12">
                How It Works
              </h2>
              <div className="grid md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-5xl mb-4">1️⃣</div>
                  <h3 className="text-lg font-bold mb-2">Create Account</h3>
                  <p className="text-gray-400 text-sm">Sign up free in 30 seconds</p>
                </div>
                <div className="text-center">
                  <div className="text-5xl mb-4">2️⃣</div>
                  <h3 className="text-lg font-bold mb-2">Log Your Trade</h3>
                  <p className="text-gray-400 text-sm">Enter pair, entry, SL, TP, lot size</p>
                </div>
                <div className="text-center">
                  <div className="text-5xl mb-4">3️⃣</div>
                  <h3 className="text-lg font-bold mb-2">Auto-Calculate</h3>
                  <p className="text-gray-400 text-sm">Pips, R:R, risk %, P&L done instantly</p>
                </div>
                <div className="text-center">
                  <div className="text-5xl mb-4">4️⃣</div>
                  <h3 className="text-lg font-bold mb-2">Review & Improve</h3>
                  <p className="text-gray-400 text-sm">Analyze stats, get AI feedback, grow</p>
                </div>
              </div>
            </section>

            {/* SEO Content Section */}
            <section className="max-w-4xl mx-auto space-y-6 text-gray-300">
              <h2 className="text-2xl font-bold text-white mb-6">Master Your Trading Psychology with Data-Driven Insights</h2>
              
              <p className="leading-relaxed">
                Professional traders understand that consistency comes from meticulous record-keeping. TamtechAI's Trading Journal transforms your trade data into actionable insights, helping you identify patterns, eliminate emotional trading, and build a systematic approach to the markets. Whether you're trading Forex pairs like EUR/USD and GBP/JPY, precious metals like Gold (XAUUSD), or major indices like NAS100 and S&P 500, our platform automatically calculates your performance metrics in real-time.
              </p>

              <p className="leading-relaxed">
                Unlike manual spreadsheets or basic trading logs, our AI-powered journal understands the nuances of different asset classes. Forex trades are calculated with 5-decimal precision (3 decimals for JPY pairs), Gold with 2-decimal accuracy, and indices with 1-point increments. This ensures your pip calculations, risk-reward ratios, and profit/loss tracking are always 100% accurate, saving you hours of manual calculations and eliminating costly errors.
              </p>

              <p className="leading-relaxed">
                The integration of Gemini AI takes your trading analysis to the next level. Each trade can be reviewed by our AI engine, which examines your entry timing, exit strategy, risk management, and market conditions. You'll receive personalized feedback on what you did right, what could be improved, and how to replicate your winning strategies while avoiding past mistakes. This is like having a professional trading mentor available 24/7.
              </p>

              <p className="leading-relaxed">
                Track your progress across different trading sessions (London, New York, Asian, Sydney) and discover when you perform best. Are your London session trades more profitable? Do you overtrade during New York volatility? Our analytics reveal these patterns, helping you optimize your trading schedule and focus on your highest-probability setups. Build discipline, improve consistency, and grow your account with confidence.
              </p>
            </section>

            {/* CTA */}
            <section className="text-center bg-gradient-to-br from-amber-500/10 to-yellow-500/10 rounded-2xl p-12 border border-amber-500/30">
              <h2 className="text-4xl font-bold mb-4">
                Ready to Master Your Trades?
              </h2>
              <p className="text-xl text-gray-400 mb-8">
                Join professional traders using TamtechAI to track, analyze, and improve their trading performance.
              </p>
              <button
                onClick={() => setShowLoginModal(true)}
                className="px-12 py-5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 rounded-lg font-bold text-xl shadow-2xl shadow-amber-500/50 transition-all hover:scale-105"
              >
                Start Free - No Credit Card Required
              </button>
            </section>
          </div>
        )}
      </div>

      {/* Homepage Footer */}
      <Footer />
    </div>

      {/* Modals */}
      <AddTradeModal
        isOpen={showAddTrade}
        onClose={() => setShowAddTrade(false)}
        onSuccess={() => {
          fetchStats();
          fetchTrades();
        }}
      />

      {/* Premium Modal */}
      <AnimatePresence>
        {showPremiumModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowPremiumModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gradient-to-br from-amber-500 via-yellow-500 to-amber-600 rounded-2xl p-1 max-w-lg w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-gray-900 rounded-xl p-8">
                <div className="text-center">
                  <div className="text-6xl mb-4">👑</div>
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-amber-400 to-yellow-500 bg-clip-text text-transparent mb-4">
                    Upgrade to PRO
                  </h2>
                  <p className="text-gray-400 mb-6">
                    You've logged 10 trades! Unlock unlimited potential with PRO.
                  </p>
                  <div className="space-y-3 mb-8 text-left">
                    <div className="flex items-start gap-3">
                      <span className="text-emerald-400 text-xl">✓</span>
                      <div>
                        <div className="font-semibold text-white">Unlimited Trade Logs</div>
                        <div className="text-sm text-gray-400">Never lose track of your progress</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="text-emerald-400 text-xl">✓</span>
                      <div>
                        <div className="font-semibold text-white">AI Trade Scoring</div>
                        <div className="text-sm text-gray-400">Gemini AI analyzes every trade</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="text-emerald-400 text-xl">✓</span>
                      <div>
                        <div className="font-semibold text-white">Weekly Performance Review</div>
                        <div className="text-sm text-gray-400">Session-based analytics every weekend</div>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => router.push('/pricing')}
                    className="w-full py-4 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 rounded-lg font-bold text-lg shadow-2xl shadow-amber-500/50 transition-all hover:scale-105"
                  >
                    Upgrade Now
                  </button>
                  <button
                    onClick={() => setShowPremiumModal(false)}
                    className="mt-4 text-gray-500 hover:text-gray-300 text-sm"
                  >
                    Maybe later
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {showLoginModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowLoginModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="bg-gray-900 rounded-2xl p-8 max-w-md w-full border border-amber-500/20"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center">
                <div className="text-5xl mb-4">🔐</div>
                <h3 className="text-2xl font-bold mb-4">Login Required</h3>
                <p className="text-gray-400 mb-8">
                  Create a free account to start logging your trades and track your performance.
                </p>
                <button
                  onClick={() => router.push('/')}
                  className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 rounded-lg font-semibold shadow-lg shadow-amber-500/30 transition-all hover:scale-105 mb-4"
                >
                  Go to Login
                </button>
                <button
                  onClick={() => setShowLoginModal(false)}
                  className="text-gray-500 hover:text-gray-300 text-sm"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
