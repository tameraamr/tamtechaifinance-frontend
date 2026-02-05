"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import AddTradeModal from '@/src/components/AddTradeModal';

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
  const [isPro, setIsPro] = useState(false);

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://tamtech-ai.onrender.com';

  useEffect(() => {
    checkAuth();
    fetchStats();
    fetchTrades();
  }, []);

  const checkAuth = async () => {
    const token = Cookies.get('access_token');
    if (!token) {
      router.push('/');
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/users/me`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setIsPro(data.is_pro === 1);
      } else {
        // Token invalid, redirect to home
        router.push('/');
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      router.push('/');
    }
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

  const handleAddTrade = () => {
    if (!isPro && stats && stats.trades_remaining_free === 0) {
      setShowPremiumModal(true);
    } else {
      setShowAddTrade(true);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black text-white">
      {/* Header */}
      <div className="border-b border-amber-500/20 bg-black/40 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600 bg-clip-text text-transparent">
                Trading Journal
              </h1>
              <p className="text-gray-400 mt-1">Track every pip, master every trade</p>
            </div>
            <button
              onClick={handleAddTrade}
              className="px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 rounded-lg font-semibold shadow-lg shadow-amber-500/30 transition-all hover:scale-105"
            >
              + New Trade
            </button>
          </div>
        </div>
      </div>

      {/* Stats Dashboard */}
      {stats && (
        <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
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
        </div>
      )}

      {/* Add Trade Modal */}
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
      </AnimatePresence>
    </div>
  );
}
