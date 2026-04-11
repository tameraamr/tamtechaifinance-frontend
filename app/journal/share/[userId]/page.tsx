'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { TrendingUp, TrendingDown, PieChart, Calendar, Target, DollarSign, Sparkles, Trophy, Award, BarChart3, Activity } from 'lucide-react';
import { motion } from 'framer-motion';
import ReactECharts from 'echarts-for-react';
import * as echarts from 'echarts';
import { mockApi } from '../../../../src/lib/mockApi';

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
        const data = await mockApi.getPublicJournalStats(userId);
        if (!data) {
          setError('Journal not found or sharing is disabled');
          return;
        }
        
        // Ensure data matches PublicStats format (map user_name to username if needed)
        const formattedData = {
          ...data,
          username: (data as any).user_name || (data as any).username || 'Demo User'
        };
        
        setStats(formattedData as any);
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
          <p className="text-gray-400">Loading trading profile...</p>
        </div>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">📊</div>
          <h1 className="text-2xl font-bold text-white mb-2">Profile Not Available</h1>
          <p className="text-gray-400">{error}</p>
        </div>
      </div>
    );
  }

  const isProfit = stats.total_profit_loss >= 0;

  // Win/Loss Distribution Data
  const winLossData = [
    { name: 'Wins', value: stats.total_wins, color: '#10b981' },
    { name: 'Losses', value: stats.total_losses, color: '#ef4444' }
  ];

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Professional Background */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-900/20 via-black to-black"></div>
      <div className="fixed inset-0 bg-[linear-gradient(rgba(251,191,36,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(251,191,36,0.03)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_80%)]"></div>

      <div className="relative z-10 py-4 px-4">
        <div className="max-w-5xl mx-auto">
          {/* Compact Professional Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-4"
          >
            <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 rounded-full px-4 py-2 mb-4">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span className="text-amber-400 font-bold text-xs">PROFESSIONAL TRADING PROFILE</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-black mb-2">
              <span className="bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600 bg-clip-text text-transparent">
                {stats.username}
              </span>
            </h1>
            <p className="text-sm text-gray-300 mb-1">Elite Trading Performance</p>
            <p className="text-gray-400 text-sm flex items-center justify-center gap-2">
              <Calendar className="w-4 h-4" />
              Professional Trader since {new Date(stats.trading_since).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </p>
          </motion.div>

          {/* Key Performance Metrics */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-6"
          >
            <h2 className="text-2xl font-bold text-center mb-4 text-white">Performance Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Total Trades */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                className="group relative bg-gradient-to-br from-blue-500/10 via-black to-black backdrop-blur-sm border border-blue-500/30 rounded-2xl p-4 hover:border-blue-500/60 transition-all hover:scale-105 overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl group-hover:bg-blue-500/20 transition-all"></div>
                <div className="relative">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-gray-400 text-sm font-medium">Total Trades</span>
                    <PieChart className="w-8 h-8 text-blue-400" />
                  </div>
                  <p className="text-3xl font-black text-blue-400 mb-2">{stats.total_trades.toLocaleString()}</p>
                  <p className="text-sm text-gray-500">Executed Transactions</p>
                </div>
              </motion.div>

              {/* Win Rate */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
                className="group relative bg-gradient-to-br from-emerald-500/10 via-black to-black backdrop-blur-sm border border-emerald-500/30 rounded-2xl p-4 hover:border-emerald-500/60 transition-all hover:scale-105 overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl group-hover:bg-emerald-500/20 transition-all"></div>
                <div className="relative">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-gray-400 text-sm font-medium">Win Rate</span>
                    <Target className="w-8 h-8 text-emerald-400" />
                  </div>
                  <p className="text-3xl font-black text-emerald-400 mb-2">{(stats.win_rate || 0).toFixed(1)}%</p>
                  <p className="text-sm text-gray-500">{stats.total_wins} Wins / {stats.total_losses} Losses</p>
                </div>
              </motion.div>

              {/* Profit Factor */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}
                className="group relative bg-gradient-to-br from-purple-500/10 via-black to-black backdrop-blur-sm border border-purple-500/30 rounded-2xl p-4 hover:border-purple-500/60 transition-all hover:scale-105 overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl group-hover:bg-purple-500/20 transition-all"></div>
                <div className="relative">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-gray-400 text-sm font-medium">Profit Factor</span>
                    <TrendingUp className="w-8 h-8 text-purple-400" />
                  </div>
                  <p className="text-3xl font-black text-purple-400 mb-2">{(stats.profit_factor || 0).toFixed(2)}</p>
                  <p className="text-sm text-gray-500">Risk-Reward Ratio</p>
                </div>
              </motion.div>

              {/* Total P&L */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 }}
                className={`group relative bg-gradient-to-br ${isProfit ? 'from-emerald-500/10' : 'from-red-500/10'} via-black to-black backdrop-blur-sm border ${isProfit ? 'border-emerald-500/30 hover:border-emerald-500/60' : 'border-red-500/30 hover:border-red-500/60'} rounded-2xl p-4 transition-all hover:scale-105 overflow-hidden`}
              >
                <div className={`absolute top-0 right-0 w-32 h-32 ${isProfit ? 'bg-emerald-500/10 group-hover:bg-emerald-500/20' : 'bg-red-500/10 group-hover:bg-red-500/20'} rounded-full blur-3xl transition-all`}></div>
                <div className="relative">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-gray-400 text-sm font-medium">Total P&L</span>
                    <DollarSign className={`w-8 h-8 ${isProfit ? 'text-emerald-400' : 'text-red-400'}`} />
                  </div>
                  <p className={`text-3xl font-black ${isProfit ? 'text-emerald-400' : 'text-red-400'} mb-2`}>
                    {isProfit ? '+' : '-'}${Math.abs(stats.total_profit_loss).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                  <p className="text-sm text-gray-500">Net Performance</p>
                </div>
              </motion.div>

              {/* Best Session */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.7 }}
                className="group relative bg-gradient-to-br from-amber-500/10 via-black to-black backdrop-blur-sm border border-amber-500/30 rounded-2xl p-4 hover:border-amber-500/60 transition-all hover:scale-105 overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl group-hover:bg-amber-500/20 transition-all"></div>
                <div className="relative">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-gray-400 text-sm font-medium">Best Session</span>
                    <Calendar className="w-8 h-8 text-amber-400" />
                  </div>
                  <p className="text-2xl font-black text-white mb-2">{stats.best_session}</p>
                  <p className="text-sm text-amber-400">{(stats.best_session_win_rate || 0).toFixed(1)}% Win Rate</p>
                </div>
              </motion.div>

              {/* Best Asset */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8 }}
                className="group relative bg-gradient-to-br from-cyan-500/10 via-black to-black backdrop-blur-sm border border-cyan-500/30 rounded-2xl p-4 hover:border-cyan-500/60 transition-all hover:scale-105 overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-3xl group-hover:bg-cyan-500/20 transition-all"></div>
                <div className="relative">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-gray-400 text-sm font-medium">Top Performing Asset</span>
                    <Trophy className="w-8 h-8 text-cyan-400" />
                  </div>
                  <p className="text-2xl font-black text-white mb-2 capitalize">{stats.best_asset_type || 'N/A'}</p>
                  <p className="text-sm text-gray-500">Highest Success Rate</p>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Professional Analytics */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="mb-6"
          >
            <h2 className="text-2xl font-bold text-center mb-4 text-white">Trading Analytics</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Win/Loss Distribution Chart */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.0 }}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4"
              >
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <BarChart3 className="w-6 h-6 text-blue-500" />
                  Win/Loss Distribution
                </h3>
                <ReactECharts
                  option={{
                    backgroundColor: 'transparent',
                    tooltip: {
                      trigger: 'item',
                      backgroundColor: 'rgba(17, 24, 39, 0.95)',
                      borderColor: '#374151',
                      borderWidth: 1,
                      borderRadius: 12,
                      textStyle: { color: '#f9fafb', fontSize: 13 },
                      formatter: function(params: any) {
                        return `<div style="font-weight: 600; color: #f59e0b;">${params.name}</div>
                          <div style="color: #f9fafb;">${params.value} trades (${params.percent}%)</div>`;
                      }
                    },
                    legend: {
                      orient: 'vertical',
                      left: 'right',
                      textStyle: { color: '#9ca3af', fontSize: 12 },
                      itemWidth: 12,
                      itemHeight: 12,
                      itemGap: 15
                    },
                    series: [{
                      name: 'Trades',
                      type: 'pie',
                      radius: ['40%', '70%'],
                      center: ['35%', '50%'],
                      avoidLabelOverlap: false,
                      itemStyle: {
                        borderRadius: 8,
                        borderColor: '#000',
                        borderWidth: 2,
                        shadowColor: 'rgba(0,0,0,0.3)',
                        shadowBlur: 10,
                        shadowOffsetX: 3,
                        shadowOffsetY: 3
                      },
                      label: {
                        show: false
                      },
                      emphasis: {
                        itemStyle: {
                          shadowBlur: 20,
                          shadowOffsetX: 5,
                          shadowOffsetY: 5
                        }
                      },
                      labelLine: {
                        show: false
                      },
                      data: winLossData.map(item => ({
                        value: item.value,
                        name: item.name,
                        itemStyle: { color: item.color }
                      }))
                    }],
                    animationDuration: 1000,
                    animationEasing: 'cubicOut'
                  }}
                  style={{ height: '250px', width: '100%' }}
                />
              </motion.div>

              {/* Performance Summary */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.1 }}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4"
              >
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Activity className="w-6 h-6 text-emerald-500" />
                  Performance Summary
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-emerald-500/10 rounded-lg">
                    <span className="text-gray-300">Successful Trades</span>
                    <span className="text-emerald-400 font-bold">{stats.total_wins}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-red-500/10 rounded-lg">
                    <span className="text-gray-300">Unsuccessful Trades</span>
                    <span className="text-red-400 font-bold">{stats.total_losses}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-amber-500/10 rounded-lg">
                    <span className="text-gray-300">Win Rate</span>
                    <span className="text-amber-400 font-bold">{(stats.win_rate || 0).toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-purple-500/10 rounded-lg">
                    <span className="text-gray-300">Profit Factor</span>
                    <span className="text-purple-400 font-bold">{(stats.profit_factor || 0).toFixed(2)}</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Professional Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="text-center mt-8 pt-4 border-t border-white/10"
          >
            <div className="mb-4">
              <Award className="w-12 h-12 text-amber-400 mx-auto mb-4" />
              <p className="text-gray-300 text-lg mb-2">Professional Trading Excellence</p>
              <p className="text-gray-500">Powered by advanced analytics and proven strategies</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a
                href="/"
                className="inline-block bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-500 hover:to-yellow-500 text-white font-bold px-6 py-3 rounded-xl transition-all shadow-lg shadow-amber-500/30 hover:scale-105"
              >
                Start Your Trading Journey
              </a>
              <a
                href="/pricing"
                className="inline-block bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold px-6 py-3 rounded-xl transition-all hover:scale-105"
              >
                View Premium Features
              </a>
            </div>
            <p className="text-gray-600 text-sm mt-4">
              © 2026 TamtechAI Finance Tool. Professional trading tools for serious traders.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
