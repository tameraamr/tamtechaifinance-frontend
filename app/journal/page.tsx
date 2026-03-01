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

/* ─── Country list for signup ─── */
const countriesList = [
  { code: "US", name: "United States" }, { code: "CA", name: "Canada" }, { code: "GB", name: "United Kingdom" },
  { code: "DE", name: "Germany" }, { code: "FR", name: "France" }, { code: "IT", name: "Italy" },
  { code: "ES", name: "Spain" }, { code: "NL", name: "Netherlands" }, { code: "BE", name: "Belgium" },
  { code: "SE", name: "Sweden" }, { code: "NO", name: "Norway" }, { code: "DK", name: "Denmark" },
  { code: "FI", name: "Finland" }, { code: "PL", name: "Poland" }, { code: "CH", name: "Switzerland" },
  { code: "AT", name: "Austria" }, { code: "GR", name: "Greece" }, { code: "PT", name: "Portugal" },
  { code: "IE", name: "Ireland" }, { code: "CZ", name: "Czech Republic" }, { code: "RO", name: "Romania" },
  { code: "HU", name: "Hungary" }, { code: "BG", name: "Bulgaria" }, { code: "TR", name: "Turkey" },
  { code: "AE", name: "United Arab Emirates" }, { code: "SA", name: "Saudi Arabia" }, { code: "QA", name: "Qatar" },
  { code: "KW", name: "Kuwait" }, { code: "BH", name: "Bahrain" }, { code: "OM", name: "Oman" },
  { code: "JO", name: "Jordan" }, { code: "LB", name: "Lebanon" }, { code: "EG", name: "Egypt" },
  { code: "MA", name: "Morocco" }, { code: "DZ", name: "Algeria" }, { code: "TN", name: "Tunisia" },
  { code: "LY", name: "Libya" }, { code: "IQ", name: "Iraq" }, { code: "SY", name: "Syria" },
  { code: "PS", name: "Palestine" }, { code: "IL", name: "Israel" }, { code: "IR", name: "Iran" },
  { code: "CN", name: "China" }, { code: "JP", name: "Japan" }, { code: "IN", name: "India" },
  { code: "KR", name: "South Korea" }, { code: "SG", name: "Singapore" }, { code: "HK", name: "Hong Kong" },
  { code: "TW", name: "Taiwan" }, { code: "MY", name: "Malaysia" }, { code: "TH", name: "Thailand" },
  { code: "ID", name: "Indonesia" }, { code: "PH", name: "Philippines" }, { code: "VN", name: "Vietnam" },
  { code: "PK", name: "Pakistan" }, { code: "BD", name: "Bangladesh" }, { code: "AU", name: "Australia" },
  { code: "NZ", name: "New Zealand" }, { code: "BR", name: "Brazil" }, { code: "AR", name: "Argentina" },
  { code: "CL", name: "Chile" }, { code: "CO", name: "Colombia" }, { code: "PE", name: "Peru" },
  { code: "VE", name: "Venezuela" }, { code: "EC", name: "Ecuador" }, { code: "ZA", name: "South Africa" },
  { code: "NG", name: "Nigeria" }, { code: "KE", name: "Kenya" }, { code: "ET", name: "Ethiopia" },
  { code: "GH", name: "Ghana" }, { code: "OTHER", name: "Other" }
];

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
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");
  const [isPro, setIsPro] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [selectedTrade, setSelectedTrade] = useState<Trade | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [tradeToDelete, setTradeToDelete] = useState<number | null>(null);
  const [activeView, setActiveView] = useState<'dashboard' | 'analytics' | 'trades'>('dashboard');
  const [showAchievements, setShowAchievements] = useState(false);
  const [showKeyboardShortcuts, setShowKeyboardShortcuts] = useState(false);

  // Auth form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [country, setCountry] = useState("");
  const [address, setAddress] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [authError, setAuthError] = useState("");
  const [isSubmittingAuth, setIsSubmittingAuth] = useState(false);
  const [userId, setUserId] = useState<number | null>(null);

  // Edit form
  const [editFormData, setEditFormData] = useState({
    pair_ticker: '', asset_type: 'forex', order_type: 'Buy', lot_size: 0.01,
    entry_price: 0, exit_price: null as number | null, risk_reward_ratio: 0,
    strategy: '', trading_session: 'London', status: 'open'
  });

  /* ═══════ AUTH ═══════ */
  useEffect(() => { checkAuth(); }, []);

  const checkAuth = async () => {
    try {
      const res = await fetch(`/api/users/me`, { credentials: 'include' });
      if (res.ok) {
        const data = await res.json();
        setIsLoggedIn(true); setIsPro(data.is_pro === 1); setUserId(data.id);
        fetchStats(); fetchTrades();
      } else { setIsLoggedIn(false); setLoading(false); }
    } catch { setIsLoggedIn(false); setLoading(false); }
  };

  const handleNewTradeClick = () => {
    if (!isLoggedIn) { setShowAuthModal(true); setAuthMode("login"); return; }
    if (!isPro && stats && stats.total_trades >= 10) { setShowPremiumModal(true); return; }
    setShowAddTrade(true);
  };

  const handleAuth = async () => {
    setIsSubmittingAuth(true); setAuthError("");
    if (authMode === "signup" && !acceptTerms) {
      setAuthError("You must accept the Terms of Service and Privacy Policy to register.");
      setIsSubmittingAuth(false); return;
    }
    const url = authMode === "login" ? `/api/token` : `/api/register`;
    let body: any, headers: any = {};
    if (authMode === "login") {
      const formData = new URLSearchParams();
      formData.append('username', email); formData.append('password', password);
      body = formData; headers = { "Content-Type": "application/x-www-form-urlencoded" };
    } else {
      body = JSON.stringify({ email, password, first_name: firstName, last_name: lastName, phone_number: phone, country, address: address || null });
      headers = { "Content-Type": "application/json" };
    }
    try {
      const res = await fetch(url, { method: "POST", headers, body, credentials: 'include' });
      const contentType = res.headers.get("content-type");
      let data;
      if (contentType && contentType.indexOf("application/json") !== -1) { data = await res.json(); }
      else { throw new Error(`Server Error (${res.status}): Please try again later.`); }
      if (!res.ok) {
        if (data.detail) {
          if (Array.isArray(data.detail)) setAuthError(data.detail.map((err: any) => err.msg).join(" & "));
          else setAuthError(data.detail);
        } else setAuthError("Unknown error occurred.");
        return;
      }
      if (authMode === "login") {
        setShowAuthModal(false); await checkAuth(); window.location.reload();
      } else {
        try {
          const loginResponse = await fetch(`/api/login`, { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, credentials: "include", body: new URLSearchParams({ username: email, password }) });
          if (loginResponse.ok) { toast.success("Account created! Please check your email to verify."); setShowAuthModal(false); await checkAuth(); window.location.reload(); }
          else { toast.success("Account created! Please log in."); setShowAuthModal(false); setAuthMode("login"); setTimeout(() => setShowAuthModal(true), 1000); }
        } catch { toast.success("Account created! Please log in and verify your email."); setShowAuthModal(false); }
      }
    } catch (err: any) { setAuthError(err.message || "Cannot connect to server."); }
    finally { setIsSubmittingAuth(false); }
  };

  /* ═══════ DATA ═══════ */
  const fetchStats = async () => {
    try {
      const res = await fetch(`/api/journal/stats`, { credentials: 'include' });
      if (res.ok) {
        const data = await res.json(); setStats(data);
        if (!isPro && data.trades_remaining_free === 0 && data.total_trades === 10) setShowPremiumModal(true);
      }
    } catch (error) { console.error('Failed to fetch stats:', error); }
  };

  const fetchTrades = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/journal/trades?limit=1000`, { credentials: 'include' });
      if (res.ok) { const data = await res.json(); setTrades(data); }
    } catch (error) { console.error('Failed to fetch trades:', error); }
    finally { setLoading(false); }
  };

  const handleDeleteTrade = async (tradeId: number) => {
    try {
      const res = await fetch(`/api/journal/trades/${tradeId}`, { method: 'DELETE', credentials: 'include' });
      if (res.ok) { toast.success('Trade deleted'); setShowDeleteConfirm(false); setTradeToDelete(null); fetchStats(); fetchTrades(); }
      else { const data = await res.json(); toast.error(data.detail || 'Failed to delete'); }
    } catch { toast.error('Failed to delete trade'); }
  };

  const handleEditTrade = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); if (!selectedTrade) return;
    const fd = new FormData(e.currentTarget);
    const updatedTrade = {
      pair_ticker: fd.get('pair_ticker') as string, asset_type: fd.get('asset_type') as string,
      order_type: fd.get('order_type') as string, entry_price: parseFloat(fd.get('entry_price') as string),
      exit_price: fd.get('exit_price') ? parseFloat(fd.get('exit_price') as string) : null,
      lot_size: parseFloat(fd.get('lot_size') as string), risk_reward_ratio: parseFloat(fd.get('risk_reward_ratio') as string),
      strategy: fd.get('strategy') as string || null, trading_session: fd.get('trading_session') as string || null,
      status: fd.get('status') as string,
    };
    try {
      const res = await fetch(`/api/journal/trades/${selectedTrade.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, credentials: 'include', body: JSON.stringify(updatedTrade) });
      if (res.ok) { toast.success('Trade updated'); setShowEditModal(false); setSelectedTrade(null); fetchStats(); fetchTrades(); }
      else { const data = await res.json(); toast.error(data.detail || 'Failed to update'); }
    } catch { toast.error('Failed to update trade'); }
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
    const shareUrl = `${window.location.origin}/journal/share/${userId}`;
    const shareText = `Check out my trading analytics! ${stats?.total_trades || 0} trades, ${(stats?.win_rate || 0).toFixed(1)}% win rate, $${(stats?.net_profit_usd || 0).toFixed(2)} P&L`;
    if (navigator.share) { navigator.share({ title: 'My Trading Analytics', text: shareText, url: shareUrl }).catch(() => { navigator.clipboard.writeText(`${shareText}\n\n${shareUrl}`); toast.success('Link copied!'); }); }
    else { navigator.clipboard.writeText(`${shareText}\n\n${shareUrl}`); toast.success('Link copied!'); }
  };

  /* ═══════ KEYBOARD SHORTCUTS ═══════ */
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.ctrlKey || e.metaKey) {
        if (e.key.toLowerCase() === 'n') { e.preventDefault(); handleNewTradeClick(); }
        if (e.key === '/') { e.preventDefault(); (document.querySelector('input[placeholder*="Search"]') as HTMLInputElement)?.focus(); }
      }
      if (e.key === 'Escape') { setShowAddTrade(false); setShowEditModal(false); setShowDeleteConfirm(false); setShowPremiumModal(false); setShowAuthModal(false); setShowKeyboardShortcuts(false); setShowAchievements(false); }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const openEditModal = (trade: Trade) => {
    setSelectedTrade(trade);
    setEditFormData({ pair_ticker: trade.pair_ticker, asset_type: trade.asset_type, order_type: trade.order_type, lot_size: trade.lot_size, entry_price: trade.entry_price || 0, exit_price: trade.exit_price || null, risk_reward_ratio: trade.risk_reward_ratio, strategy: trade.strategy || '', trading_session: trade.trading_session || 'London', status: trade.status });
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
        {/* Non-logged-in hero */}
        {!isLoggedIn && (
          <JournalHero
            onLogin={() => { setAuthMode("login"); setShowAuthModal(true); }}
            onSignup={() => { setAuthMode("signup"); setShowAuthModal(true); }}
          />
        )}

        {/* Logged-in content */}
        {isLoggedIn && (
          <>
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
                      {!isPro && <span className="ml-2 text-amber-400">· {stats.trades_remaining_free} free trades left</span>}
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
                    <button onClick={handleNewTradeClick} className="flex items-center gap-1.5 px-3 sm:px-4 py-1.5 bg-emerald-500 hover:bg-emerald-600 rounded-lg text-sm font-medium text-white transition-colors">
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
                <button onClick={handleNewTradeClick} className="px-6 py-2 bg-emerald-500 hover:bg-emerald-600 rounded-lg text-white font-medium transition-colors">
                  <Plus className="w-4 h-4 inline mr-2" />Add First Trade
                </button>
              </div>
            )}
          </>
        )}
      </main>

      {/* ═══════ MODALS ═══════ */}
      {/* Add Trade Modal */}
      {showAddTrade && <AddTradeModal isOpen={showAddTrade} onClose={() => setShowAddTrade(false)} onSuccess={() => { fetchStats(); fetchTrades(); }} />}

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

      {/* Auth Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-[var(--text-primary)]">{authMode === 'login' ? 'Sign In' : 'Create Account'}</h3>
              <button onClick={() => setShowAuthModal(false)} className="text-[var(--text-tertiary)] hover:text-[var(--text-primary)]"><X className="w-5 h-5" /></button>
            </div>
            {authError && <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 mb-4 text-sm text-red-400">{authError}</div>}
            <div className="space-y-3">
              <div><label className="text-xs text-[var(--text-tertiary)] mb-1 block">Email</label><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-[var(--bg-primary)] border border-[var(--border-primary)] rounded-lg px-3 py-2 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--border-hover)]" /></div>
              <div><label className="text-xs text-[var(--text-tertiary)] mb-1 block">Password</label><input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-[var(--bg-primary)] border border-[var(--border-primary)] rounded-lg px-3 py-2 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--border-hover)]" /></div>
              {authMode === 'signup' && (<>
                <div className="grid grid-cols-2 gap-3">
                  <div><label className="text-xs text-[var(--text-tertiary)] mb-1 block">First Name</label><input value={firstName} onChange={(e) => setFirstName(e.target.value)} className="w-full bg-[var(--bg-primary)] border border-[var(--border-primary)] rounded-lg px-3 py-2 text-sm text-[var(--text-primary)] focus:outline-none" /></div>
                  <div><label className="text-xs text-[var(--text-tertiary)] mb-1 block">Last Name</label><input value={lastName} onChange={(e) => setLastName(e.target.value)} className="w-full bg-[var(--bg-primary)] border border-[var(--border-primary)] rounded-lg px-3 py-2 text-sm text-[var(--text-primary)] focus:outline-none" /></div>
                </div>
                <div><label className="text-xs text-[var(--text-tertiary)] mb-1 block">Phone</label><input value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full bg-[var(--bg-primary)] border border-[var(--border-primary)] rounded-lg px-3 py-2 text-sm text-[var(--text-primary)] focus:outline-none" /></div>
                <div><label className="text-xs text-[var(--text-tertiary)] mb-1 block">Country</label><select value={country} onChange={(e) => setCountry(e.target.value)} className="w-full bg-[var(--bg-primary)] border border-[var(--border-primary)] rounded-lg px-3 py-2 text-sm text-[var(--text-primary)] focus:outline-none"><option value="">Select country</option>{countriesList.map(c => <option key={c.code} value={c.code}>{c.name}</option>)}</select></div>
                <div><label className="text-xs text-[var(--text-tertiary)] mb-1 block">Address (optional)</label><input value={address} onChange={(e) => setAddress(e.target.value)} className="w-full bg-[var(--bg-primary)] border border-[var(--border-primary)] rounded-lg px-3 py-2 text-sm text-[var(--text-primary)] focus:outline-none" /></div>
                <label className="flex items-center gap-2 text-xs text-[var(--text-secondary)] cursor-pointer"><input type="checkbox" checked={acceptTerms} onChange={(e) => setAcceptTerms(e.target.checked)} className="rounded" />I accept the Terms of Service and Privacy Policy</label>
              </>)}
              <button onClick={handleAuth} disabled={isSubmittingAuth} className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 rounded-lg text-sm font-medium text-white transition-colors">{isSubmittingAuth ? 'Please wait...' : authMode === 'login' ? 'Sign In' : 'Create Account'}</button>
              <p className="text-center text-xs text-[var(--text-tertiary)]">
                {authMode === 'login' ? "Don't have an account? " : 'Already have an account? '}
                <button onClick={() => setAuthMode(authMode === 'login' ? 'signup' : 'login')} className="text-emerald-400 hover:underline">{authMode === 'login' ? 'Sign Up' : 'Sign In'}</button>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Premium Modal */}
      {showPremiumModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-xl p-6 max-w-md w-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-[var(--text-primary)]">Upgrade to Pro</h3>
              <button onClick={() => setShowPremiumModal(false)} className="text-[var(--text-tertiary)] hover:text-[var(--text-primary)]"><X className="w-5 h-5" /></button>
            </div>
            <p className="text-sm text-[var(--text-secondary)] mb-4">You have reached the 10-trade limit for free accounts. Upgrade to Pro for unlimited trades and advanced features.</p>
            <ul className="space-y-2 mb-6 text-sm text-[var(--text-secondary)]">
              <li className="flex items-center gap-2">✓ Unlimited trades</li><li className="flex items-center gap-2">✓ Advanced analytics</li>
              <li className="flex items-center gap-2">✓ AI-powered insights</li><li className="flex items-center gap-2">✓ Priority support</li>
            </ul>
            <button onClick={() => { setShowPremiumModal(false); router.push('/pricing'); }} className="w-full py-2.5 bg-amber-500 hover:bg-amber-600 rounded-lg text-sm font-medium text-white transition-colors">View Pricing</button>
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

/* ─── Chart Card wrapper ─── */
function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-xl p-4">
      <h3 className="text-sm font-medium text-[var(--text-secondary)] mb-3">{title}</h3>
      {children}
    </div>
  );
}
