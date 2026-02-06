'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { TrendingUp, TrendingDown, PieChart, Calendar, Target, DollarSign } from 'lucide-react';

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
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-amber-400 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading trading stats...</p>
        </div>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
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
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-block bg-gradient-to-r from-amber-500/20 to-yellow-600/20 border border-amber-400/40 rounded-full px-6 py-2 mb-4">
            <span className="text-amber-400 font-bold text-sm">📊 PUBLIC JOURNAL</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-3">
            {stats.username}'s Trading Performance
          </h1>
          <p className="text-gray-400">Trading since {new Date(stats.trading_since).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Total Trades */}
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6 backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-blue-500/20 p-3 rounded-xl">
                <PieChart className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="text-gray-400 font-semibold">Total Trades</h3>
            </div>
            <p className="text-4xl font-black text-white">{stats.total_trades}</p>
          </div>

          {/* Win Rate */}
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6 backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-green-500/20 p-3 rounded-xl">
                <Target className="w-6 h-6 text-green-400" />
              </div>
              <h3 className="text-gray-400 font-semibold">Win Rate</h3>
            </div>
            <p className="text-4xl font-black text-green-400">{stats.win_rate.toFixed(1)}%</p>
            <p className="text-sm text-gray-500 mt-2">{stats.total_wins}W / {stats.total_losses}L</p>
          </div>

          {/* Profit Factor */}
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6 backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-purple-500/20 p-3 rounded-xl">
                <TrendingUp className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="text-gray-400 font-semibold">Profit Factor</h3>
            </div>
            <p className="text-4xl font-black text-purple-400">{stats.profit_factor.toFixed(2)}</p>
          </div>

          {/* Total P&L */}
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6 backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className={`${isProfit ? 'bg-green-500/20' : 'bg-red-500/20'} p-3 rounded-xl`}>
                <DollarSign className={`w-6 h-6 ${isProfit ? 'text-green-400' : 'text-red-400'}`} />
              </div>
              <h3 className="text-gray-400 font-semibold">Total P&L</h3>
            </div>
            <p className={`text-4xl font-black ${isProfit ? 'text-green-400' : 'text-red-400'}`}>
              {isProfit ? '+' : ''}{stats.total_profit_loss >= 0 ? '$' : '-$'}{Math.abs(stats.total_profit_loss).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </div>

          {/* Best Session */}
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6 backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-amber-500/20 p-3 rounded-xl">
                <Calendar className="w-6 h-6 text-amber-400" />
              </div>
              <h3 className="text-gray-400 font-semibold">Best Session</h3>
            </div>
            <p className="text-2xl font-black text-white">{stats.best_session}</p>
            <p className="text-sm text-amber-400 mt-2">{stats.best_session_win_rate.toFixed(1)}% win rate</p>
          </div>

          {/* Best Asset */}
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6 backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-cyan-500/20 p-3 rounded-xl">
                <TrendingUp className="w-6 h-6 text-cyan-400" />
              </div>
              <h3 className="text-gray-400 font-semibold">Best Asset Type</h3>
            </div>
            <p className="text-2xl font-black text-white capitalize">{stats.best_asset_type || 'N/A'}</p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 pt-8 border-t border-slate-800">
          <p className="text-gray-500 text-sm mb-4">
            Powered by <span className="text-amber-400 font-bold">TamtechAI Finance Tool</span>
          </p>
          <a
            href="/"
            className="inline-block bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-500 hover:to-yellow-500 text-white font-bold px-6 py-3 rounded-xl transition-all shadow-lg shadow-amber-500/30"
          >
            Start Your Own Trading Journal
          </a>
        </div>
      </div>
    </div>
  );
}
