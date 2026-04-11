/**
 * @page TradingJournal
 * @description Full-featured trading journal with analytics, achievements, and
 * trade management. In demo mode, loads from mock data with simulated latency.
 *
 * Features: Trade table/cards, equity curve, session/pair performance,
 * SWOT analytics, streak tracking, CSV export, keyboard shortcuts.
 *
 * @author Tamer — TamtechAI Finance
 * @version 2.0.0 — Portfolio Demo Mode
 */
"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import AddTradeModal from '@/src/components/AddTradeModal';
import Navbar from '@/src/components/Navbar';
import Footer from '@/src/components/Footer';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import { Plus, Trophy, Share2, Download, Brain, X, Keyboard } from 'lucide-react';

import JournalStatCards from '@/src/components/journal/JournalStatCards';
import JournalTradeTable from '@/src/components/journal/JournalTradeTable';
import JournalHero from '@/src/components/journal/JournalHero';
import JournalTradeCards from '@/src/components/journal/JournalTradeCards';
import JournalDashboardWidgets from '@/src/components/journal/JournalDashboardWidgets';
import {
  EquityCurve, PairPerformanceChart, WinLossPie, SessionChart,
  RiskRadar, DailyPLChart, DrawdownChart, StrategyComparison
} from '@/src/components/journal/JournalCharts';
import { mockApi } from '@/src/lib/mockApi';

/* ─── Interfaces ─── */
interface JournalStats {
  total_trades: number; open_trades: number; closed_trades: number;
  wins: number; losses: number; breakeven: number; win_rate: number;
  total_pips: number; total_profit_usd: number; net_profit_usd: number;
  profit_factor: number; average_win_pips: number; average_loss_pips: number;
  largest_win_usd: number; largest_loss_usd: number; trades_remaining_free: number;
}

interface Trade {
  id: number; pair_ticker: string; asset_type: string; order_type: string;
  entry_price: number; exit_price?: number; lot_size: number;
  profit_loss_usd?: number; profit_loss_pips?: number; risk_reward_ratio: number;
  status: string; result?: string; entry_time: string; exit_time?: string;
  strategy?: string; trading_session?: string; notes?: string;
  stop_loss?: number; take_profit?: number; market_trend?: string;
  account_size_at_entry?: number; tags?: string; checklist?: string; image_url?: string;
}

interface Achievement {
  id: string; title: string; description: string; icon: string;
  unlocked: boolean; progress?: number; target?: number;
}

export default function TradingJournal() {
  const router = useRouter();
  const [stats, setStats] = useState<JournalStats | null>(null);
  const [trades, setTrades] = useState<Trade[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddTrade, setShowAddTrade] = useState(false);
  const [selectedTrade, setSelectedTrade] = useState<Trade | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [tradeToDelete, setTradeToDelete] = useState<number | null>(null);
  const [activeView, setActiveView] = useState<'dashboard' | 'analytics' | 'trades'>('dashboard');
  const [showAchievements, setShowAchievements] = useState(false);
  const [showKeyboardShortcuts, setShowKeyboardShortcuts] = useState(false);

  // Demo mode: always logged in as Pro
  const isLoggedIn = true;
  const isPro = true;
  const userId = 1;

  /* ═══════ DATA LOADING (Mock API) ═══════ */
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [statsData, tradesData] = await Promise.all([
        mockApi.getJournalStats(),
        mockApi.getJournalTrades(),
      ]);
      setStats(statsData as JournalStats);
      setTrades(tradesData as unknown as Trade[]);
    } catch (error) {
      console.error('Failed to load journal data:', error);
    } finally {
      setLoading(false);
    }
  };

  /** Demo mode: trade creation/edit/delete show toast notification */
  const handleDeleteTrade = async (tradeId: number) => {
    toast("🔒 Demo Mode — Delete disabled", { icon: "ℹ️", duration: 2000 });
    setShowDeleteConfirm(false);
    setTradeToDelete(null);
  };

  const handleEditTrade = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    toast("🔒 Demo Mode — Edit disabled", { icon: "ℹ️", duration: 2000 });
    setShowEditModal(false);
    setSelectedTrade(null);
  };

  /* ═══════ ANALYTICS ═══════ */
  const advancedMetrics = useMemo(() => {
    if (!trades.length) return null;
    const closed = trades.filter(t => t.status === 'closed' && t.profit_loss_usd !== undefined);
    if (!closed.length) return null;
    const returns = closed.map(t => t.profit_loss_usd || 0);
    const avgReturn = returns.reduce((a, b) => a + b, 0) / returns.length;
    const variance = returns.reduce((sum, r) => sum + Math.pow(r - avgReturn, 2), 0) / returns.length;
    const stdDev = Math.sqrt(variance);
    const sharpeRatio = stdDev !== 0 ? (avgReturn / stdDev) : 0;
    let peak = 0, maxDrawdown = 0, currentBalance = 0;
    closed.forEach(t => { currentBalance += t.profit_loss_usd || 0; if (currentBalance > peak) peak = currentBalance; const dd = peak - currentBalance; if (dd > maxDrawdown) maxDrawdown = dd; });
    const winningTrades = closed.filter(t => (t.profit_loss_usd || 0) > 0);
    const losingTrades = closed.filter(t => (t.profit_loss_usd || 0) < 0);
    const avgWin = winningTrades.length > 0 ? winningTrades.reduce((s, t) => s + (t.profit_loss_usd || 0), 0) / winningTrades.length : 0;
    const avgLoss = losingTrades.length > 0 ? Math.abs(losingTrades.reduce((s, t) => s + (t.profit_loss_usd || 0), 0) / losingTrades.length) : 0;
    const winRate = winningTrades.length / closed.length;
    const expectancy = (winRate * avgWin) - ((1 - winRate) * avgLoss);
    let currentStreak = 0, maxWinStreak = 0, maxLossStreak = 0, lastResult = '';
    closed.forEach(t => {
      const isWin = (t.profit_loss_usd || 0) > 0;
      if ((isWin && lastResult === 'win') || (!isWin && lastResult === 'loss')) currentStreak++; else currentStreak = 1;
      if (isWin && currentStreak > maxWinStreak) maxWinStreak = currentStreak;
      if (!isWin && currentStreak > maxLossStreak) maxLossStreak = currentStreak;
      lastResult = isWin ? 'win' : 'loss';
    });
    return { sharpeRatio, maxDrawdown, expectancy, maxWinStreak, maxLossStreak, avgWin, avgLoss };
  }, [trades]);

  const profitCurveData = useMemo(() => {
    const closed = trades.filter(t => t.status === 'closed').sort((a, b) => new Date(a.exit_time || a.entry_time).getTime() - new Date(b.exit_time || b.entry_time).getTime());
    let cum = 0;
    return closed.map(t => { cum += t.profit_loss_usd || 0; return { date: format(new Date(t.exit_time || t.entry_time), 'MMM dd'), profit: parseFloat(cum.toFixed(2)), trade: t.pair_ticker }; });
  }, [trades]);

  const performanceByPair = useMemo(() => {
    const ps: Record<string, { profit: number; trades: number }> = {};
    trades.filter(t => t.status === 'closed').forEach(t => { if (!ps[t.pair_ticker]) ps[t.pair_ticker] = { profit: 0, trades: 0 }; ps[t.pair_ticker].profit += t.profit_loss_usd || 0; ps[t.pair_ticker].trades += 1; });
    return Object.entries(ps).map(([pair, d]) => ({ pair, profit: parseFloat(d.profit.toFixed(2)), trades: d.trades })).sort((a, b) => b.profit - a.profit).slice(0, 10);
  }, [trades]);

  const performanceBySession = useMemo(() => {
    const ss: Record<string, { wins: number; losses: number; profit: number }> = { 'London': { wins: 0, losses: 0, profit: 0 }, 'New York': { wins: 0, losses: 0, profit: 0 }, 'Tokyo': { wins: 0, losses: 0, profit: 0 }, 'Sydney': { wins: 0, losses: 0, profit: 0 } };
    trades.filter(t => t.status === 'closed' && t.trading_session).forEach(t => { const s = t.trading_session || 'Unknown'; if (ss[s]) { const p = t.profit_loss_usd || 0; if (p > 0) ss[s].wins++; else if (p < 0) ss[s].losses++; ss[s].profit += p; } });
    return Object.entries(ss).map(([session, d]) => ({ session, winRate: d.wins + d.losses > 0 ? (d.wins / (d.wins + d.losses) * 100) : 0, profit: parseFloat(d.profit.toFixed(2)), total: d.wins + d.losses }));
  }, [trades]);

  /* ═══════ ACHIEVEMENTS ═══════ */
  const achievements = useMemo((): Achievement[] => {
    const tt = stats?.total_trades || 0, wr = stats?.win_rate || 0, np = stats?.net_profit_usd || 0;
    return [
      { id: 'first_trade', title: 'First Steps', description: 'Log your first trade', icon: '🎯', unlocked: tt >= 1, progress: Math.min(tt, 1), target: 1 },
      { id: 'ten_trades', title: 'Getting Started', description: 'Complete 10 trades', icon: '📊', unlocked: tt >= 10, progress: tt, target: 10 },
      { id: 'fifty_trades', title: 'Experienced', description: 'Complete 50 trades', icon: '⭐', unlocked: tt >= 50, progress: tt, target: 50 },
      { id: 'hundred_trades', title: 'Veteran', description: 'Complete 100 trades', icon: '🏆', unlocked: tt >= 100, progress: tt, target: 100 },
      { id: 'profitable', title: 'In The Green', description: 'Reach +$1,000 net profit', icon: '💰', unlocked: np >= 1000, progress: np, target: 1000 },
      { id: 'high_winrate', title: 'Sharpshooter', description: 'Achieve 70% win rate', icon: '🎯', unlocked: wr >= 70, progress: wr, target: 70 },
      { id: 'big_winner', title: 'Big Win', description: 'Win $500 on a single trade', icon: '💎', unlocked: (stats?.largest_win_usd || 0) >= 500, progress: stats?.largest_win_usd || 0, target: 500 },
      { id: 'consistent', title: 'Consistency King', description: 'Win 5 trades in a row', icon: '👑', unlocked: (advancedMetrics?.maxWinStreak || 0) >= 5, progress: advancedMetrics?.maxWinStreak || 0, target: 5 },
    ];
  }, [stats, advancedMetrics]);

  /* ═══════ ACTIONS ═══════ */
  const handleExportCSV = (tradesToExport: Trade[]) => {
    const headers = ['Pair', 'Type', 'Entry', 'Exit', 'Lot', 'P/L USD', 'P/L Pips', 'R:R', 'Status', 'Strategy', 'Session', 'Entry Time', 'Exit Time'];
    const rows = tradesToExport.map(t => [t.pair_ticker, t.order_type, t.entry_price, t.exit_price || '', t.lot_size, t.profit_loss_usd || '', t.profit_loss_pips || '', t.risk_reward_ratio, t.status, t.strategy || '', t.trading_session || '', t.entry_time, t.exit_time || ''].join(','));
    const csv = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = `trades-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url);
    toast.success('CSV exported!');
  };

  const handleShareDashboard = () => {
    const shareText = `Check out my trading analytics! ${stats?.total_trades || 0} trades, ${(stats?.win_rate || 0).toFixed(1)}% win rate, $${(stats?.net_profit_usd || 0).toFixed(2)} P&L`;
    navigator.clipboard.writeText(shareText);
    toast.success('Stats copied to clipboard!');
  };

  /* ═══════ KEYBOARD SHORTCUTS ═══════ */
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.ctrlKey || e.metaKey) {
        if (e.key.toLowerCase() === 'n') { e.preventDefault(); setShowAddTrade(true); }
        if (e.key === '/') { e.preventDefault(); (document.querySelector('input[placeholder*="Search"]') as HTMLInputElement)?.focus(); }
      }
      if (e.key === 'Escape') { setShowAddTrade(false); setShowEditModal(false); setShowDeleteConfirm(false); setShowKeyboardShortcuts(false); setShowAchievements(false); }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const openEditModal = (trade: Trade) => {
    setSelectedTrade(trade);
    setShowEditModal(true);
  };

  const confirmDelete = (tradeId: number) => { setTradeToDelete(tradeId); setShowDeleteConfirm(true); };

  const unlockedCount = achievements.filter(a => a.unlocked).length;

  /* ═══════════════════════════════════════════════
     RENDER
     ═══════════════════════════════════════════════ */
  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)]">
      <Navbar />

      <main className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6">
        {/* Logged-in content (always in demo) */}
        {loading ? (
          <div className="flex items-center justify-center py-32">
            <div className="w-8 h-8 border-2 border-[var(--text-tertiary)] border-t-emerald-400 rounded-full animate-spin" />
          </div>
        ) : stats ? (
          <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-[var(--text-primary)]">Trading Journal</h1>
                <p className="text-sm text-[var(--text-tertiary)] mt-0.5">
                  {stats.total_trades} trades · {stats.win_rate.toFixed(1)}% win rate
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button onClick={() => setShowKeyboardShortcuts(true)} className="p-2 text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors hidden sm:block" title="Keyboard shortcuts">
                  <Keyboard className="w-4 h-4" />
                </button>
                <button onClick={() => setShowAchievements(true)} className="flex items-center gap-1.5 px-3 py-1.5 bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-lg text-sm text-[var(--text-secondary)] hover:border-[var(--border-hover)] transition-colors">
                  <Trophy className="w-4 h-4 text-amber-400" /> <span className="hidden sm:inline">{unlockedCount}/{achievements.length}</span>
                </button>
                <button onClick={handleShareDashboard} className="flex items-center gap-1.5 px-3 py-1.5 bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-lg text-sm text-[var(--text-secondary)] hover:border-[var(--border-hover)] transition-colors">
                  <Share2 className="w-4 h-4" /> <span className="hidden sm:inline">Share</span>
                </button>
                <button onClick={() => setShowAddTrade(true)} className="flex items-center gap-1.5 px-3 sm:px-4 py-1.5 bg-emerald-500 hover:bg-emerald-600 rounded-lg text-sm font-medium text-white transition-colors">
                  <Plus className="w-4 h-4" /> <span className="hidden sm:inline">New Trade</span>
                </button>
              </div>
            </div>

            {/* View tabs */}
            <div className="flex gap-1 bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-lg p-1 w-fit overflow-x-auto">
              {(['dashboard', 'analytics', 'trades'] as const).map(v => (
                <button key={v} onClick={() => setActiveView(v)}
                  className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${activeView === v ? 'bg-[var(--bg-primary)] text-[var(--text-primary)] shadow-sm' : 'text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]'}`}>
                  {v.charAt(0).toUpperCase() + v.slice(1)}
                </button>
              ))}
            </div>

            {/* DASHBOARD VIEW */}
            {activeView === 'dashboard' && (
              <div className="space-y-6">
                <JournalStatCards stats={stats} metrics={advancedMetrics} />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                  <ChartCard title="Equity Curve"><EquityCurve data={profitCurveData} /></ChartCard>
                  <ChartCard title="Performance by Pair"><PairPerformanceChart data={performanceByPair} /></ChartCard>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                  <ChartCard title="Win/Loss Distribution"><WinLossPie wins={stats.wins} losses={stats.losses} breakeven={stats.breakeven} /></ChartCard>
                  <ChartCard title="Session Performance"><SessionChart data={performanceBySession} /></ChartCard>
                  <ChartCard title="Risk Profile"><RiskRadar metrics={advancedMetrics} stats={{ win_rate: stats.win_rate, profit_factor: stats.profit_factor }} /></ChartCard>
                </div>
                <ChartCard title="Strategy Comparison"><StrategyComparison trades={trades} /></ChartCard>
                <JournalDashboardWidgets trades={trades} stats={stats} metrics={advancedMetrics} />
                <JournalTradeCards trades={trades} onEdit={openEditModal} onDelete={confirmDelete} />
              </div>
            )}

            {/* ANALYTICS VIEW */}
            {activeView === 'analytics' && (
              <div className="space-y-6">
                <JournalStatCards stats={stats} metrics={advancedMetrics} />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                  <ChartCard title="Equity Curve"><EquityCurve data={profitCurveData} /></ChartCard>
                  <ChartCard title="Daily P&L"><DailyPLChart trades={trades} /></ChartCard>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                  <ChartCard title="Drawdown"><DrawdownChart trades={trades} /></ChartCard>
                  <ChartCard title="Risk Radar"><RiskRadar metrics={advancedMetrics} stats={{ win_rate: stats.win_rate, profit_factor: stats.profit_factor }} /></ChartCard>
                </div>
                <ChartCard title="Strategy Comparison"><StrategyComparison trades={trades} /></ChartCard>
                <JournalDashboardWidgets trades={trades} stats={stats} metrics={advancedMetrics} />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                  <ChartCard title="Performance by Pair"><PairPerformanceChart data={performanceByPair} /></ChartCard>
                  <ChartCard title="Session Performance"><SessionChart data={performanceBySession} /></ChartCard>
                </div>
              </div>
            )}

            {/* TRADES VIEW */}
            {activeView === 'trades' && (
              <JournalTradeTable trades={trades} onEdit={openEditModal} onDelete={confirmDelete} onExportCSV={handleExportCSV} />
            )}
          </div>
        ) : (
          <div className="text-center py-20 text-[var(--text-tertiary)]">
            <p className="text-lg mb-4">Welcome! Start by adding your first trade.</p>
            <button onClick={() => setShowAddTrade(true)} className="px-6 py-2 bg-emerald-500 hover:bg-emerald-600 rounded-lg text-white font-medium transition-colors">
              <Plus className="w-4 h-4 inline mr-2" />Add First Trade
            </button>
          </div>
        )}
      </main>

      {/* ═══════ MODALS ═══════ */}
      {showAddTrade && <AddTradeModal isOpen={showAddTrade} onClose={() => setShowAddTrade(false)} onSuccess={() => { toast("🔒 Demo Mode — Trade logged!", { icon: "✅", duration: 2000 }); setShowAddTrade(false); }} />}

      {/* Delete Confirm */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-xl p-6 max-w-sm w-full">
            <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">Delete Trade</h3>
            <p className="text-sm text-[var(--text-secondary)] mb-6">This action cannot be undone. Are you sure?</p>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setShowDeleteConfirm(false)} className="px-4 py-2 bg-[var(--bg-primary)] border border-[var(--border-primary)] rounded-lg text-sm text-[var(--text-secondary)] hover:border-[var(--border-hover)] transition-colors">Cancel</button>
              <button onClick={() => tradeToDelete && handleDeleteTrade(tradeToDelete)} className="px-4 py-2 bg-red-500 hover:bg-red-600 rounded-lg text-sm text-white font-medium transition-colors">Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && selectedTrade && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-xl p-6 max-w-lg w-full max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-[var(--text-primary)]">Edit Trade</h3>
              <button onClick={() => setShowEditModal(false)} className="text-[var(--text-tertiary)] hover:text-[var(--text-primary)]"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleEditTrade} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div><label className="text-xs text-[var(--text-tertiary)] mb-1 block">Pair/Ticker</label><input name="pair_ticker" defaultValue={selectedTrade.pair_ticker} className="w-full bg-[var(--bg-primary)] border border-[var(--border-primary)] rounded-lg px-3 py-2 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--border-hover)]" required /></div>
                <div><label className="text-xs text-[var(--text-tertiary)] mb-1 block">Asset Type</label><select name="asset_type" defaultValue={selectedTrade.asset_type} className="w-full bg-[var(--bg-primary)] border border-[var(--border-primary)] rounded-lg px-3 py-2 text-sm text-[var(--text-primary)] focus:outline-none"><option value="forex">Forex</option><option value="crypto">Crypto</option><option value="stocks">Stocks</option><option value="commodities">Commodities</option><option value="indices">Indices</option></select></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="text-xs text-[var(--text-tertiary)] mb-1 block">Order Type</label><select name="order_type" defaultValue={selectedTrade.order_type} className="w-full bg-[var(--bg-primary)] border border-[var(--border-primary)] rounded-lg px-3 py-2 text-sm text-[var(--text-primary)] focus:outline-none"><option value="Buy">Buy</option><option value="Sell">Sell</option></select></div>
                <div><label className="text-xs text-[var(--text-tertiary)] mb-1 block">Lot Size</label><input name="lot_size" type="number" step="0.01" defaultValue={selectedTrade.lot_size} className="w-full bg-[var(--bg-primary)] border border-[var(--border-primary)] rounded-lg px-3 py-2 text-sm text-[var(--text-primary)] focus:outline-none" required /></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="text-xs text-[var(--text-tertiary)] mb-1 block">Entry Price</label><input name="entry_price" type="number" step="any" defaultValue={selectedTrade.entry_price} className="w-full bg-[var(--bg-primary)] border border-[var(--border-primary)] rounded-lg px-3 py-2 text-sm text-[var(--text-primary)] focus:outline-none" required /></div>
                <div><label className="text-xs text-[var(--text-tertiary)] mb-1 block">Exit Price</label><input name="exit_price" type="number" step="any" defaultValue={selectedTrade.exit_price || ''} className="w-full bg-[var(--bg-primary)] border border-[var(--border-primary)] rounded-lg px-3 py-2 text-sm text-[var(--text-primary)] focus:outline-none" /></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="text-xs text-[var(--text-tertiary)] mb-1 block">R:R Ratio</label><input name="risk_reward_ratio" type="number" step="0.1" defaultValue={selectedTrade.risk_reward_ratio} className="w-full bg-[var(--bg-primary)] border border-[var(--border-primary)] rounded-lg px-3 py-2 text-sm text-[var(--text-primary)] focus:outline-none" required /></div>
                <div><label className="text-xs text-[var(--text-tertiary)] mb-1 block">Status</label><select name="status" defaultValue={selectedTrade.status} className="w-full bg-[var(--bg-primary)] border border-[var(--border-primary)] rounded-lg px-3 py-2 text-sm text-[var(--text-primary)] focus:outline-none"><option value="open">Open</option><option value="closed">Closed</option></select></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="text-xs text-[var(--text-tertiary)] mb-1 block">Strategy</label><input name="strategy" defaultValue={selectedTrade.strategy || ''} className="w-full bg-[var(--bg-primary)] border border-[var(--border-primary)] rounded-lg px-3 py-2 text-sm text-[var(--text-primary)] focus:outline-none" /></div>
                <div><label className="text-xs text-[var(--text-tertiary)] mb-1 block">Session</label><select name="trading_session" defaultValue={selectedTrade.trading_session || ''} className="w-full bg-[var(--bg-primary)] border border-[var(--border-primary)] rounded-lg px-3 py-2 text-sm text-[var(--text-primary)] focus:outline-none"><option value="">—</option><option value="London">London</option><option value="New York">New York</option><option value="Tokyo">Tokyo</option><option value="Sydney">Sydney</option><option value="Asia">Asia</option></select></div>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowEditModal(false)} className="px-4 py-2 bg-[var(--bg-primary)] border border-[var(--border-primary)] rounded-lg text-sm text-[var(--text-secondary)]">Cancel</button>
                <button type="submit" data-edit-save className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 rounded-lg text-sm text-white font-medium transition-colors">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Achievements Modal */}
      {showAchievements && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-xl p-6 max-w-lg w-full max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-[var(--text-primary)]">Achievements ({unlockedCount}/{achievements.length})</h3>
              <button onClick={() => setShowAchievements(false)} className="text-[var(--text-tertiary)] hover:text-[var(--text-primary)]"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-3">
              {achievements.map(a => (
                <div key={a.id} className={`flex items-center gap-3 p-3 rounded-lg border ${a.unlocked ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-[var(--bg-primary)] border-[var(--border-primary)] opacity-60'}`}>
                  <span className="text-2xl">{a.icon}</span>
                  <div className="flex-1">
                    <div className="font-medium text-sm text-[var(--text-primary)]">{a.title}</div>
                    <div className="text-xs text-[var(--text-tertiary)]">{a.description}</div>
                    {a.target && <div className="mt-1 h-1.5 bg-[var(--bg-primary)] rounded-full overflow-hidden"><div className="h-full bg-emerald-400 rounded-full transition-all" style={{ width: `${Math.min(((a.progress || 0) / a.target) * 100, 100)}%` }} /></div>}
                  </div>
                  {a.unlocked && <span className="text-xs text-emerald-400 font-medium">Unlocked</span>}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Keyboard Shortcuts */}
      {showKeyboardShortcuts && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="keyboard-shortcuts bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-xl p-6 max-w-sm w-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-[var(--text-primary)]">Keyboard Shortcuts</h3>
              <button onClick={() => setShowKeyboardShortcuts(false)} className="text-[var(--text-tertiary)] hover:text-[var(--text-primary)]"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-2 text-sm">
              {[['Ctrl + N', 'New trade'], ['Ctrl + /', 'Focus search'], ['Esc', 'Close modals']].map(([key, desc]) => (
                <div key={key} className="flex items-center justify-between">
                  <span className="text-[var(--text-secondary)]">{desc}</span>
                  <kbd className="px-2 py-0.5 bg-[var(--bg-primary)] border border-[var(--border-primary)] rounded text-xs text-[var(--text-tertiary)] font-mono">{key}</kbd>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

/** Reusable chart card wrapper */
function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-xl p-4">
      <h3 className="text-sm font-medium text-[var(--text-secondary)] mb-3">{title}</h3>
      {children}
    </div>
  );
}
