'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { TrendingUp, TrendingDown, PieChart, Calendar, Target, DollarSign, Sparkles, Trophy } from 'lucide-react';
import { motion } from 'framer-motion';

interface PublicStats {
  username: string;
  total_trades: number;
  win_rate: number;
  profit_factor: number;
  total_profit_loss: number;
  best_session: string;
  best_session_win_rate: number;
  trading_since: string;
  total_wins: number;
  total_losses: number;
  best_asset_type: string;
}

export default function PublicJournalPage() {
  const params = useParams();
  const userId = params.userId as string;
  const [stats, setStats] = useState<PublicStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPublicStats = async () => {
      try {
        const res = await fetch(`/api/journal/public-stats/${userId}`);
        if (!res.ok) {
          if (res.status === 404) {
            setError('Journal not found or sharing is disabled');
          } else {
            setError('Failed to load journal stats');
          }
          return;
        }
        const data = await res.json();
        setStats(data);
      } catch (err) {
        setError('Failed to load journal stats');
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchPublicStats();
    }
  }, [userId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-4 border-amber-500 border-t-transparent rounded-full mx-auto mb-4"
          />
          <p className="text-gray-400">Loading trading stats...</p>
        </div>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">📊</div>
          <h1 className="text-2xl font-bold text-white mb-2">Journal Not Available</h1>
          <p className="text-gray-400">{error}</p>
        </div>
      </div>
    );
  }

  const isProfit = stats.total_profit_loss >= 0;

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-900/20 via-black to-black"></div>
      
      {/* Grid overlay */}
      <div className="fixed inset-0 bg-[linear-gradient(rgba(251,191,36,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(251,191,36,0.03)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_80%)]"></div>

      <div className="relative z-10 py-12 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 rounded-full px-4 py-2 mb-4">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span className="text-amber-400 font-bold text-sm">PUBLIC JOURNAL</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black mb-3">
              <span className="bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600 bg-clip-text text-transparent">
                {stats.username}'s
              </span>
              <br/>
              <span className="text-white">Trading Performance</span>
            </h1>
            <p className="text-gray-400 flex items-center justify-center gap-2">
              <Calendar className="w-4 h-4" />
              Trading since {new Date(stats.trading_since).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </p>
          </motion.div>

          {/* Key Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {/* Total Trades */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="group relative bg-gradient-to-br from-blue-500/10 via-black to-black backdrop-blur-sm border border-blue-500/30 rounded-2xl p-6 hover:border-blue-500/60 transition-all hover:scale-105 overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl group-hover:bg-blue-500/20 transition-all"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-gray-400 text-sm font-medium">Total Trades</span>
                  <PieChart className="w-8 h-8 text-blue-400" />
                </div>
                <p className="text-4xl font-black text-blue-400 mb-2">{stats.total_trades}</p>
              </div>
            </motion.div>

            {/* Win Rate */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="group relative bg-gradient-to-br from-emerald-500/10 via-black to-black backdrop-blur-sm border border-emerald-500/30 rounded-2xl p-6 hover:border-emerald-500/60 transition-all hover:scale-105 overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl group-hover:bg-emerald-500/20 transition-all"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-gray-400 text-sm font-medium">Win Rate</span>
                  <Target className="w-8 h-8 text-emerald-400" />
                </div>
                <p className="text-4xl font-black text-emerald-400 mb-2">{(stats.win_rate || 0).toFixed(1)}%</p>
                <p className="text-sm text-gray-500">{stats.total_wins}W / {stats.total_losses}L</p>
              </div>
            </motion.div>

            {/* Profit Factor */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="group relative bg-gradient-to-br from-purple-500/10 via-black to-black backdrop-blur-sm border border-purple-500/30 rounded-2xl p-6 hover:border-purple-500/60 transition-all hover:scale-105 overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl group-hover:bg-purple-500/20 transition-all"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-gray-400 text-sm font-medium">Profit Factor</span>
                  <TrendingUp className="w-8 h-8 text-purple-400" />
                </div>
                <p className="text-4xl font-black text-purple-400">{(stats.profit_factor || 0).toFixed(2)}</p>
              </div>
            </motion.div>

            {/* Total P&L */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
              className={`group relative bg-gradient-to-br ${isProfit ? 'from-emerald-500/10' : 'from-red-500/10'} via-black to-black backdrop-blur-sm border ${isProfit ? 'border-emerald-500/30 hover:border-emerald-500/60' : 'border-red-500/30 hover:border-red-500/60'} rounded-2xl p-6 transition-all hover:scale-105 overflow-hidden`}
            >
              <div className={`absolute top-0 right-0 w-32 h-32 ${isProfit ? 'bg-emerald-500/10 group-hover:bg-emerald-500/20' : 'bg-red-500/10 group-hover:bg-red-500/20'} rounded-full blur-3xl transition-all`}></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-gray-400 text-sm font-medium">Total P&L</span>
                  <DollarSign className={`w-8 h-8 ${isProfit ? 'text-emerald-400' : 'text-red-400'}`} />
                </div>
                <p className={`text-4xl font-black ${isProfit ? 'text-emerald-400' : 'text-red-400'}`}>
                  {isProfit ? '+' : ''}${Math.abs(stats.total_profit_loss).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
              </div>
            </motion.div>

            {/* Best Session */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
              className="group relative bg-gradient-to-br from-amber-500/10 via-black to-black backdrop-blur-sm border border-amber-500/30 rounded-2xl p-6 hover:border-amber-500/60 transition-all hover:scale-105 overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl group-hover:bg-amber-500/20 transition-all"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-gray-400 text-sm font-medium">Best Session</span>
                  <Calendar className="w-8 h-8 text-amber-400" />
                </div>
                <p className="text-2xl font-black text-white">{stats.best_session}</p>
                <p className="text-sm text-amber-400 mt-2">{(stats.best_session_win_rate || 0).toFixed(1)}% win rate</p>
              </div>
            </motion.div>

            {/* Best Asset */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 }}
              className="group relative bg-gradient-to-br from-cyan-500/10 via-black to-black backdrop-blur-sm border border-cyan-500/30 rounded-2xl p-6 hover:border-cyan-500/60 transition-all hover:scale-105 overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-3xl group-hover:bg-cyan-500/20 transition-all"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-gray-400 text-sm font-medium">Best Asset Type</span>
                  <Trophy className="w-8 h-8 text-cyan-400" />
                </div>
                <p className="text-2xl font-black text-white capitalize">{stats.best_asset_type || 'N/A'}</p>
              </div>
            </motion.div>
          </div>

          {/* Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="text-center mt-12 pt-8 border-t border-white/10"
          >
            <p className="text-gray-500 text-sm mb-4">
              Powered by <span className="text-amber-400 font-bold">TamtechAI Finance Tool</span>
            </p>
            <a
              href="/"
              className="inline-block bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-500 hover:to-yellow-500 text-white font-bold px-6 py-3 rounded-xl transition-all shadow-lg shadow-amber-500/30 hover:scale-105"
            >
              Start Your Own Trading Journal
            </a>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
