"use client";

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import AddTradeModal from '@/src/components/AddTradeModal';
import Link from 'next/link';
import Navbar from '@/src/components/Navbar';
import Footer from '@/src/components/Footer';
import { 
  XCircle, AlertTriangle, TrendingUp, TrendingDown, Target, Award,
  Calendar, Clock, DollarSign, Zap, BarChart3, PieChart, Activity,
  Filter, Download, Share2, Trophy, Star, Flame, Crown, Medal,
  Brain, Eye, ChevronDown, ChevronUp, Search, Settings, Bell,
  LineChart, ArrowUp, ArrowDown, Sparkles, Rocket, Shield
} from 'lucide-react';
import toast from 'react-hot-toast';
import { 
  LineChart as RechartsLine, 
  Line, 
  AreaChart, 
  Area, 
  BarChart,
  Bar,
  PieChart as RechartsPie,
  Pie,
  Cell,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';
import { format, startOfWeek, endOfWeek, eachDayOfInterval, parseISO } from 'date-fns';

const API_BASE = typeof window !== 'undefined' ? '/api' : 'https://tamtechaifinance-backend-production.up.railway.app';

const countriesList = [
  { code: "US", name: "United States" },
  { code: "CA", name: "Canada" },
  { code: "GB", name: "United Kingdom" },
  { code: "DE", name: "Germany" },
  { code: "FR", name: "France" },
  { code: "IT", name: "Italy" },
  { code: "ES", name: "Spain" },
  { code: "NL", name: "Netherlands" },
  { code: "BE", name: "Belgium" },
  { code: "SE", name: "Sweden" },
  { code: "NO", name: "Norway" },
  { code: "DK", name: "Denmark" },
  { code: "FI", name: "Finland" },
  { code: "PL", name: "Poland" },
  { code: "CH", name: "Switzerland" },
  { code: "AT", name: "Austria" },
  { code: "GR", name: "Greece" },
  { code: "PT", name: "Portugal" },
  { code: "IE", name: "Ireland" },
  { code: "CZ", name: "Czech Republic" },
  { code: "RO", name: "Romania" },
  { code: "HU", name: "Hungary" },
  { code: "BG", name: "Bulgaria" },
  { code: "TR", name: "Turkey" },
  { code: "AE", name: "United Arab Emirates" },
  { code: "SA", name: "Saudi Arabia" },
  { code: "QA", name: "Qatar" },
  { code: "KW", name: "Kuwait" },
  { code: "BH", name: "Bahrain" },
  { code: "OM", name: "Oman" },
  { code: "JO", name: "Jordan" },
  { code: "LB", name: "Lebanon" },
  { code: "EG", name: "Egypt" },
  { code: "MA", name: "Morocco" },
  { code: "DZ", name: "Algeria" },
  { code: "TN", name: "Tunisia" },
  { code: "LY", name: "Libya" },
  { code: "IQ", name: "Iraq" },
  { code: "SY", name: "Syria" },
  { code: "PS", name: "Palestine" },
  { code: "IL", name: "Israel" },
  { code: "IR", name: "Iran" },
  { code: "CN", name: "China" },
  { code: "JP", name: "Japan" },
  { code: "IN", name: "India" },
  { code: "KR", name: "South Korea" },
  { code: "SG", name: "Singapore" },
  { code: "HK", name: "Hong Kong" },
  { code: "TW", name: "Taiwan" },
  { code: "MY", name: "Malaysia" },
  { code: "TH", name: "Thailand" },
  { code: "ID", name: "Indonesia" },
  { code: "PH", name: "Philippines" },
  { code: "VN", name: "Vietnam" },
  { code: "PK", name: "Pakistan" },
  { code: "BD", name: "Bangladesh" },
  { code: "AU", name: "Australia" },
  { code: "NZ", name: "New Zealand" },
  { code: "BR", name: "Brazil" },
  { code: "AR", name: "Argentina" },
  { code: "CL", name: "Chile" },
  { code: "CO", name: "Colombia" },
  { code: "PE", name: "Peru" },
  { code: "VE", name: "Venezuela" },
  { code: "EC", name: "Ecuador" },
  { code: "ZA", name: "South Africa" },
  { code: "NG", name: "Nigeria" },
  { code: "KE", name: "Kenya" },
  { code: "ET", name: "Ethiopia" },
  { code: "GH", name: "Ghana" },
  { code: "OTHER", name: "Other" }
];

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
  notes?: string;
  stop_loss?: number;
  take_profit?: number;
  market_trend?: string;
  account_size_at_entry?: number;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  progress?: number;
  target?: number;
}

// 🌟 Legendary Particle Background Effect
const ParticleBackground = () => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {[...Array(50)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-amber-500/30 rounded-full"
          initial={{
            x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1920),
            y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1080),
          }}
          animate={{
            x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1920),
            y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1080),
          }}
          transition={{
            duration: Math.random() * 20 + 10,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      ))}
    </div>
  );
};

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
  
  // 🚀 Epic new features state
  const [activeView, setActiveView] = useState<'dashboard' | 'analytics' | 'trades'>('dashboard');
  const [filterStatus, setFilterStatus] = useState<'all' | 'open' | 'closed'>('all');
  const [filterResult, setFilterResult] = useState<'all' | 'win' | 'loss'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAchievements, setShowAchievements] = useState(false);
  const [selectedTimeframe, setSelectedTimeframe] = useState<'day' | 'week' | 'month' | 'all'>('week');

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

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const res = await fetch(`${API_BASE}/users/me`, {
        credentials: 'include' // httpOnly cookie sent automatically
      });
      
      if (res.ok) {
        const data = await res.json();
        setIsLoggedIn(true);
        setIsPro(data.is_pro === 1);
        setUserId(data.id);
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
      setShowAuthModal(true);
      setAuthMode("login");
      return;
    }

    if (!isPro && stats && stats.total_trades >= 10) {
      setShowPremiumModal(true);
      return;
    }

    setShowAddTrade(true);
  };

  const handleAuth = async () => {
    setIsSubmittingAuth(true);
    setAuthError("");

    if (authMode === "signup" && !acceptTerms) {
      setAuthError("You must accept the Terms of Service and Privacy Policy to register.");
      setIsSubmittingAuth(false);
      return;
    }

    const url = authMode === "login" ? `${API_BASE}/token` : `${API_BASE}/register`;

    let body, headers: any = {};

    if (authMode === "login") {
      const formData = new URLSearchParams();
      formData.append('username', email);
      formData.append('password', password);
      body = formData;
      headers = { "Content-Type": "application/x-www-form-urlencoded" };
    } else {
      body = JSON.stringify({
        email,
        password,
        first_name: firstName,
        last_name: lastName,
        phone_number: phone,
        country: country,
        address: address || null
      });
      headers = { "Content-Type": "application/json" };
    }

    try {
      const res = await fetch(url, {
        method: "POST",
        headers,
        body,
        credentials: 'include'
      });

      const contentType = res.headers.get("content-type");
      let data;

      if (contentType && contentType.indexOf("application/json") !== -1) {
        data = await res.json();
      } else {
        throw new Error(`Server Error (${res.status}): Please try again later.`);
      }

      if (!res.ok) {
        if (data.detail) {
          if (Array.isArray(data.detail)) {
            const messages = data.detail.map((err: any) => err.msg).join(" & ");
            setAuthError(messages);
          } else {
            setAuthError(data.detail);
          }
        } else {
          setAuthError("Unknown error occurred.");
        }
        return;
      }

      if (authMode === "login") {
        setShowAuthModal(false);
        await checkAuth();
        window.location.reload(); // Force full reload to update Navbar
      } else {
        setAuthError("");
        try {
          const loginResponse = await fetch(`${API_BASE}/login`, {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            credentials: "include",
            body: new URLSearchParams({
              username: email,
              password: password
            })
          });

          if (loginResponse.ok) {
            toast.success("✅ Account created! Please check your email to verify your account.", {
              duration: 7000,
              icon: "📧"
            });
            setShowAuthModal(false);
            await checkAuth();
            window.location.reload(); // Force full reload to update Navbar
          } else {
            toast.success("✅ Account created! Please log in to continue.", {
              duration: 5000
            });
            setShowAuthModal(false);
            setAuthMode("login");
            setTimeout(() => setShowAuthModal(true), 1000);
          }
        } catch (error) {
          toast.success("✅ Account created! Please log in and verify your email.", {
            duration: 5000
          });
          setShowAuthModal(false);
        }
      }

    } catch (err: any) {
      console.error("Auth Error:", err);
      setAuthError(err.message || "Cannot connect to server. Check your connection.");
    } finally {
      setIsSubmittingAuth(false);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await fetch(`${API_BASE}/journal/stats`, {
        credentials: 'include'
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
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/journal/trades?limit=1000`, {
        credentials: 'include'
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

  const handleDeleteTrade = async (tradeId: number) => {
    try {
      const res = await fetch(`${API_BASE}/journal/trades/${tradeId}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (res.ok) {
        toast.success('🗑️ Trade deleted successfully');
        setShowDeleteConfirm(false);
        setTradeToDelete(null);
        fetchStats();
        fetchTrades();
      } else {
        const data = await res.json();
        toast.error(data.detail || 'Failed to delete trade');
      }
    } catch (error) {
      console.error('Failed to delete trade:', error);
      toast.error('Failed to delete trade');
    }
  };

  const handleEditTrade = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedTrade) return;

    const formData = new FormData(e.currentTarget);
    const updatedTrade = {
      pair_ticker: formData.get('pair_ticker') as string,
      asset_type: formData.get('asset_type') as string,
      order_type: formData.get('order_type') as string,
      entry_price: parseFloat(formData.get('entry_price') as string),
      exit_price: formData.get('exit_price') ? parseFloat(formData.get('exit_price') as string) : null,
      lot_size: parseFloat(formData.get('lot_size') as string),
      risk_reward_ratio: parseFloat(formData.get('risk_reward_ratio') as string),
      strategy: formData.get('strategy') as string || null,
      trading_session: formData.get('trading_session') as string || null,
      status: formData.get('status') as string,
    };

    try {
      const res = await fetch(`${API_BASE}/journal/trades/${selectedTrade.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(updatedTrade)
      });

      if (res.ok) {
        toast.success('✅ Trade updated successfully');
        setShowEditModal(false);
        setSelectedTrade(null);
        fetchStats();
        fetchTrades();
      } else {
        const data = await res.json();
        toast.error(data.detail || 'Failed to update trade');
      }
    } catch (error) {
      console.error('Failed to update trade:', error);
      toast.error('Failed to update trade');
    }
  };

  // 🧠 LEGENDARY ADVANCED ANALYTICS
  const advancedMetrics = useMemo(() => {
    if (!trades.length) return null;

    const closedTrades = trades.filter(t => t.status === 'closed' && t.profit_loss_usd !== undefined);
    
    if (!closedTrades.length) return null;

    // Calculate Sharpe Ratio (simplified)
    const returns = closedTrades.map(t => t.profit_loss_usd || 0);
    const avgReturn = returns.reduce((a, b) => a + b, 0) / returns.length;
    const variance = returns.reduce((sum, r) => sum + Math.pow(r - avgReturn, 2), 0) / returns.length;
    const stdDev = Math.sqrt(variance);
    const sharpeRatio = stdDev !== 0 ? (avgReturn / stdDev) : 0;

    // Calculate Max Drawdown
    let peak = 0;
    let maxDrawdown = 0;
    let currentBalance = 0;
    
    closedTrades.forEach(trade => {
      currentBalance += trade.profit_loss_usd || 0;
      if (currentBalance > peak) peak = currentBalance;
      const drawdown = peak - currentBalance;
      if (drawdown > maxDrawdown) maxDrawdown = drawdown;
    });

    // Calculate Expectancy
    const winningTrades = closedTrades.filter(t => (t.profit_loss_usd || 0) > 0);
    const losingTrades = closedTrades.filter(t => (t.profit_loss_usd || 0) < 0);
    
    const avgWin = winningTrades.length > 0 
      ? winningTrades.reduce((sum, t) => sum + (t.profit_loss_usd || 0), 0) / winningTrades.length 
      : 0;
    const avgLoss = losingTrades.length > 0
      ? Math.abs(losingTrades.reduce((sum, t) => sum + (t.profit_loss_usd || 0), 0) / losingTrades.length)
      : 0;
    
    const winRate = winningTrades.length / closedTrades.length;
    const expectancy = (winRate * avgWin) - ((1 - winRate) * avgLoss);

    // Win/Loss Streaks
    let currentStreak = 0;
    let maxWinStreak = 0;
    let maxLossStreak = 0;
    let lastResult = '';

    closedTrades.forEach(trade => {
      const isWin = (trade.profit_loss_usd || 0) > 0;
      
      if (isWin && lastResult === 'win') {
        currentStreak++;
      } else if (!isWin && lastResult === 'loss') {
        currentStreak++;
      } else {
        currentStreak = 1;
      }

      if (isWin && currentStreak > maxWinStreak) maxWinStreak = currentStreak;
      if (!isWin && currentStreak > maxLossStreak) maxLossStreak = currentStreak;

      lastResult = isWin ? 'win' : 'loss';
    });

    return {
      sharpeRatio,
      maxDrawdown,
      expectancy,
      maxWinStreak,
      maxLossStreak,
      avgWin,
      avgLoss
    };
  }, [trades]);

  // 📊 Chart Data Calculations
  const profitCurveData = useMemo(() => {
    const closedTrades = trades.filter(t => t.status === 'closed').sort((a, b) => 
      new Date(a.exit_time || a.entry_time).getTime() - new Date(b.exit_time || b.entry_time).getTime()
    );

    let cumulative = 0;
    return closedTrades.map(trade => {
      cumulative += trade.profit_loss_usd || 0;
      return {
        date: format(new Date(trade.exit_time || trade.entry_time), 'MMM dd'),
        profit: parseFloat(cumulative.toFixed(2)),
        trade: trade.pair_ticker
      };
    });
  }, [trades]);

  const performanceByPair = useMemo(() => {
    const pairStats: { [key: string]: { profit: number, trades: number } } = {};
    
    trades.filter(t => t.status === 'closed').forEach(trade => {
      if (!pairStats[trade.pair_ticker]) {
        pairStats[trade.pair_ticker] = { profit: 0, trades: 0 };
      }
      pairStats[trade.pair_ticker].profit += trade.profit_loss_usd || 0;
      pairStats[trade.pair_ticker].trades += 1;
    });

    return Object.entries(pairStats)
      .map(([pair, data]) => ({
        pair,
        profit: parseFloat(data.profit.toFixed(2)),
        trades: data.trades
      }))
      .sort((a, b) => b.profit - a.profit)
      .slice(0, 10);
  }, [trades]);

  const performanceBySession = useMemo(() => {
    const sessionStats: { [key: string]: { wins: number, losses: number, profit: number } } = {
      'London': { wins: 0, losses: 0, profit: 0 },
      'New York': { wins: 0, losses: 0, profit: 0 },
      'Tokyo': { wins: 0, losses: 0, profit: 0 },
      'Sydney': { wins: 0, losses: 0, profit: 0 }
    };

    trades.filter(t => t.status === 'closed' && t.trading_session).forEach(trade => {
      const session = trade.trading_session || 'Unknown';
      if (sessionStats[session]) {
        const profit = trade.profit_loss_usd || 0;
        if (profit > 0) sessionStats[session].wins++;
        else if (profit < 0) sessionStats[session].losses++;
        sessionStats[session].profit += profit;
      }
    });

    return Object.entries(sessionStats).map(([session, data]) => ({
      session,
      winRate: data.wins + data.losses > 0 ? (data.wins / (data.wins + data.losses) * 100) : 0,
      profit: parseFloat(data.profit.toFixed(2)),
      total: data.wins + data.losses
    }));
  }, [trades]);

  const winLossDistribution = useMemo(() => {
    const distribution = trades.filter(t => t.status === 'closed' && t.profit_loss_usd !== undefined)
      .map(t => ({
        range: t.profit_loss_usd! > 0 
          ? `+$${Math.floor(Math.abs(t.profit_loss_usd!) / 50) * 50}` 
          : `-$${Math.floor(Math.abs(t.profit_loss_usd!) / 50) * 50}`,
        value: t.profit_loss_usd!,
        count: 1
      }))
      .reduce((acc, curr) => {
        const existing = acc.find(item => item.range === curr.range);
        if (existing) {
          existing.count++;
        } else {
          acc.push({ ...curr });
        }
        return acc;
      }, [] as any[])
      .sort((a, b) => parseFloat(a.range.replace(/[^0-9.-]/g, '')) - parseFloat(b.range.replace(/[^0-9.-]/g, '')));

    return distribution;
  }, [trades]);

  // 🏆 ACHIEVEMENTS SYSTEM
  const achievements = useMemo((): Achievement[] => {
    const totalTrades = stats?.total_trades || 0;
    const winRate = stats?.win_rate || 0;
    const netProfit = stats?.net_profit_usd || 0;

    return [
      {
        id: 'first_trade',
        title: 'First Steps',
        description: 'Log your first trade',
        icon: '🎯',
        unlocked: totalTrades >= 1,
        progress: Math.min(totalTrades, 1),
        target: 1
      },
      {
        id: 'ten_trades',
        title: 'Getting Started',
        description: 'Complete 10 trades',
        icon: '📊',
        unlocked: totalTrades >= 10,
        progress: totalTrades,
        target: 10
      },
      {
        id: 'fifty_trades',
        title: 'Experienced Trader',
        description: 'Complete 50 trades',
        icon: '⭐',
        unlocked: totalTrades >= 50,
        progress: totalTrades,
        target: 50
      },
      {
        id: 'hundred_trades',
        title: 'Veteran',
        description: 'Complete 100 trades',
        icon: '🏆',
        unlocked: totalTrades >= 100,
        progress: totalTrades,
        target: 100
      },
      {
        id: 'profitable',
        title: 'In The Green',
        description: 'Reach +$1,000 net profit',
        icon: '💰',
        unlocked: netProfit >= 1000,
        progress: netProfit,
        target: 1000
      },
      {
        id: 'high_winrate',
        title: 'Sharpshooter',
        description: 'Achieve 70% win rate',
        icon: '🎯',
        unlocked: winRate >= 70,
        progress: winRate,
        target: 70
      },
      {
        id: 'big_winner',
        title: 'Big Win',
        description: 'Win $500 on a single trade',
        icon: '💎',
        unlocked: (stats?.largest_win_usd || 0) >= 500,
        progress: stats?.largest_win_usd || 0,
        target: 500
      },
      {
        id: 'consistent',
        title: 'Consistency King',
        description: 'Win 5 trades in a row',
        icon: '👑',
        unlocked: advancedMetrics?.maxWinStreak ? advancedMetrics.maxWinStreak >= 5 : false,
        progress: advancedMetrics?.maxWinStreak || 0,
        target: 5
      }
    ];
  }, [stats, advancedMetrics]);

  const unlockedAchievements = achievements.filter(a => a.unlocked).length;
  const totalAchievements = achievements.length;

  // 🔍 Filtered trades
  const filteredTrades = useMemo(() => {
    return trades.filter(trade => {
      if (filterStatus !== 'all' && trade.status !== filterStatus) return false;
      if (filterResult !== 'all') {
        if (filterResult === 'win' && (trade.profit_loss_usd || 0) <= 0) return false;
        if (filterResult === 'loss' && (trade.profit_loss_usd || 0) >= 0) return false;
      }
      if (searchQuery && !trade.pair_ticker.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      return true;
    });
  }, [trades, filterStatus, filterResult, searchQuery]);

  // Demo data for non-logged-in users
  const demoTrades = [
    { id: 1, pair: 'XAUUSD', type: 'Buy', entry: '2650.50', exit: '2665.00', pips: '+14.5', pl: '+$145', rr: '1:2.6', status: 'win' },
    { id: 2, pair: 'EURUSD', type: 'Sell', entry: '1.08450', exit: '1.08320', pips: '+13.0', pl: '+$130', rr: '1:2.1', status: 'win' },
    { id: 3, pair: 'NAS100', type: 'Buy', entry: '18250', exit: '18190', pips: '-60', pl: '-$60', rr: '1:3.0', status: 'loss' },
  ];

  return (
    <div>
      <div className="min-h-screen bg-black text-white relative overflow-hidden">
        {/* 🌌 Animated Background */}
        <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-900/20 via-black to-black"></div>
        <ParticleBackground />
        
        {/* 🌐 Grid overlay */}
        <div className="fixed inset-0 bg-[linear-gradient(rgba(251,191,36,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(251,191,36,0.03)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_80%)]"></div>

        {/* Content */}
        <div className="relative z-10">
          <Navbar />

          {/* 🚀 EPIC Hero Section for non-logged-in users */}
          {!isLoggedIn && (
            <div className="border-b border-amber-500/10">
              <div className="max-w-7xl mx-auto px-4 py-20 sm:px-6 lg:px-8 text-center">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                >
                  <div className="flex justify-center mb-6">
                    <div className="relative">
                      <Sparkles className="w-20 h-20 text-amber-500 animate-pulse" />
                      <motion.div
                        className="absolute inset-0"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                      >
                        <Trophy className="w-20 h-20 text-amber-400/30" />
                      </motion.div>
                    </div>
                  </div>
                  
                  <h1 className="text-5xl md:text-7xl font-black mb-6">
                    <span className="bg-gradient-to-r from-amber-200 via-amber-400 to-yellow-600 bg-clip-text text-transparent">
                      The Ultimate
                    </span>
                    <br />
                    <span className="text-white">Trading Journal</span>
                  </h1>
                  
                  <p className="text-xl md:text-2xl text-gray-300 mb-4 max-w-4xl mx-auto font-light">
                    🚀 AI-Powered Analytics • 📊 Real-Time Charts • 🏆 Achievement System
                  </p>
                  
                  <p className="text-lg text-amber-400/80 mb-8 max-w-3xl mx-auto">
                    Track every trade with military precision. Advanced metrics, beautiful visualizations, 
                    and insights that actually make you a better trader.
                  </p>

                  <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
                    <button
                      onClick={() => {
                        setShowAuthModal(true);
                        setAuthMode("signup");
                      }}
                      className="group px-8 py-5 bg-gradient-to-r from-amber-500 via-amber-600 to-yellow-600 hover:from-amber-600 hover:via-amber-700 hover:to-yellow-700 rounded-xl font-bold text-xl shadow-2xl shadow-amber-500/50 transition-all hover:scale-110 hover:shadow-amber-500/70 flex items-center gap-3"
                    >
                      <Rocket className="w-6 h-6 group-hover:animate-bounce" />
                      Start Free Today
                    </button>
                    <button
                      onClick={() => {
                        setShowAuthModal(true);
                        setAuthMode("login");
                      }}
                      className="px-8 py-5 bg-white/5 backdrop-blur-sm border-2 border-amber-500/30 hover:border-amber-500 rounded-xl font-bold text-xl transition-all hover:scale-105 hover:bg-white/10"
                    >
                      Sign In
                    </button>
                  </div>

                  {/* Feature Highlights */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="bg-gradient-to-br from-amber-500/10 to-transparent backdrop-blur-sm border border-amber-500/20 rounded-2xl p-6 hover:border-amber-500/40 transition-all hover:scale-105"
                    >
                      <Brain className="w-12 h-12 text-amber-400 mb-4 mx-auto" />
                      <h3 className="text-xl font-bold mb-2">AI Insights</h3>
                      <p className="text-gray-400">Get intelligent pattern recognition and performance suggestions</p>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="bg-gradient-to-br from-blue-500/10 to-transparent backdrop-blur-sm border border-blue-500/20 rounded-2xl p-6 hover:border-blue-500/40 transition-all hover:scale-105"
                    >
                      <BarChart3 className="w-12 h-12 text-blue-400 mb-4 mx-auto" />
                      <h3 className="text-xl font-bold mb-2">Advanced Analytics</h3>
                      <p className="text-gray-400">Sharpe ratio, drawdown, expectancy, and more pro metrics</p>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                      className="bg-gradient-to-br from-purple-500/10 to-transparent backdrop-blur-sm border border-purple-500/20 rounded-2xl p-6 hover:border-purple-500/40 transition-all hover:scale-105"
                    >
                      <Trophy className="w-12 h-12 text-purple-400 mb-4 mx-auto" />
                      <h3 className="text-xl font-bold mb-2">Gamification</h3>
                      <p className="text-gray-400">Unlock achievements and track your trading journey</p>
                    </motion.div>
                  </div>
                </motion.div>
              </div>
            </div>
          )}

      {/* Stats Dashboard */}
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {isLoggedIn ? (
          <>
            {loading ? (
              <div className="flex items-center justify-center min-h-[60vh]">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-16 h-16 border-4 border-amber-500 border-t-transparent rounded-full"
                />
              </div>
            ) : stats ? (
          <>
            {/* 💪 EPIC Dashboard Header */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <Link 
                href="/" 
                className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-amber-400 transition-colors mb-4"
              >
                ← Back to Home
              </Link>
              
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h1 className="text-4xl md:text-5xl font-black mb-2">
                    <span className="bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600 bg-clip-text text-transparent">
                      Your Trading Empire
                    </span>
                  </h1>
                  <p className="text-gray-400 flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-amber-500" />
                    {unlockedAchievements}/{totalAchievements} Achievements Unlocked
                  </p>
                </div>

                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => setShowAchievements(true)}
                    className="px-4 py-3 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 rounded-xl font-semibold shadow-lg shadow-purple-500/30 transition-all hover:scale-105 flex items-center gap-2"
                  >
                    <Star className="w-5 h-5" />
                    Achievements
                  </button>
                  
                  <button
                    onClick={() => {
                      if (!userId) {
                        toast.error('Please log in to share your journal');
                        return;
                      }
                      const shareUrl = `${window.location.origin}/journal/share/${userId}`;
                      navigator.clipboard.writeText(shareUrl);
                      toast.success('🔗 Share link copied!', {
                        icon: '🚀',
                        style: {
                          background: '#1f2937',
                          color: '#fff',
                          border: '1px solid #f59e0b'
                        }
                      });
                    }}
                    className="px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-xl font-semibold shadow-lg shadow-blue-500/30 transition-all hover:scale-105 flex items-center gap-2"
                  >
                    <Share2 className="w-5 h-5" />
                    Share
                  </button>

                  <button
                    onClick={handleNewTradeClick}
                    className="px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 rounded-xl font-bold shadow-lg shadow-amber-500/30 transition-all hover:scale-105 flex items-center gap-2"
                  >
                    <Zap className="w-5 h-5" />
                    New Trade
                  </button>
                </div>
              </div>
            </motion.div>

            {/* 🎯 View Tabs */}
            <div className="mb-8">
              <div className="flex gap-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-1 w-fit">
                <button
                  onClick={() => setActiveView('dashboard')}
                  className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                    activeView === 'dashboard'
                      ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-lg'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Activity className="w-5 h-5" />
                    Dashboard
                  </div>
                </button>
                <button
                  onClick={() => setActiveView('analytics')}
                  className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                    activeView === 'analytics'
                      ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-lg'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    Analytics
                  </div>
                </button>
                <button
                  onClick={() => setActiveView('trades')}
                  className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                    activeView === 'trades'
                      ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-lg'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <LineChart className="w-5 h-5" />
                    All Trades
                  </div>
                </button>
              </div>
            </div>

            {/* 🌟 DASHBOARD VIEW - Conditional rendering based on activeView */}
            {activeView === 'dashboard' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                {/* 💎 Primary Stats Grid - EPIC DESIGN */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  {/* Net Profit Card */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 }}
                    className="group relative bg-gradient-to-br from-emerald-500/10 via-black to-black backdrop-blur-sm border border-emerald-500/30 rounded-2xl p-6 hover:border-emerald-500/60 transition-all hover:scale-105 overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl group-hover:bg-emerald-500/20 transition-all"></div>
                    <div className="relative">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-gray-400 text-sm font-medium">Net Profit</span>
                        <DollarSign className="w-8 h-8 text-emerald-400" />
                      </div>
                      <div className={`text-4xl font-black mb-2 ${
                        stats.net_profit_usd >= 0 ? 'text-emerald-400' : 'text-red-400'
                      }`}>
                        ${Math.abs(stats.net_profit_usd).toFixed(2)}
                      </div>
                      <div className="text-gray-500 text-sm flex items-center gap-1">
                        {stats.total_pips >= 0 ? (
                          <ArrowUp className="w-4 h-4 text-emerald-400" />
                        ) : (
                          <ArrowDown className="w-4 h-4 text-red-400" />
                        )}
                        {Math.abs(stats.total_pips).toFixed(1)} pips
                      </div>
                    </div>
                  </motion.div>

                  {/* Win Rate Card */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className="group relative bg-gradient-to-br from-amber-500/10 via-black to-black backdrop-blur-sm border border-amber-500/30 rounded-2xl p-6 hover:border-amber-500/60 transition-all hover:scale-105 overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl group-hover:bg-amber-500/20 transition-all"></div>
                    <div className="relative">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-gray-400 text-sm font-medium">Win Rate</span>
                        <Target className="w-8 h-8 text-amber-400" />
                      </div>
                      <div className="text-4xl font-black text-amber-400 mb-2">
                        {stats.win_rate.toFixed(1)}%
                      </div>
                      <div className="text-gray-500 text-sm">
                        {stats.wins}W / {stats.losses}L
                      </div>
                    </div>
                  </motion.div>

                  {/* Total Trades Card */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 }}
                    className="group relative bg-gradient-to-br from-blue-500/10 via-black to-black backdrop-blur-sm border border-blue-500/30 rounded-2xl p-6 hover:border-blue-500/60 transition-all hover:scale-105 overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl group-hover:bg-blue-500/20 transition-all"></div>
                    <div className="relative">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-gray-400 text-sm font-medium">Total Trades</span>
                        <BarChart3 className="w-8 h-8 text-blue-400" />
                      </div>
                      <div className="text-4xl font-black text-blue-400 mb-2">
                        {stats.total_trades}
                      </div>
                      <div className="text-gray-500 text-sm">
                        {stats.open_trades} open • {stats.closed_trades} closed
                      </div>
                    </div>
                  </motion.div>

                  {/* Profit Factor Card */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 }}
                    className="group relative bg-gradient-to-br from-purple-500/10 via-black to-black backdrop-blur-sm border border-purple-500/30 rounded-2xl p-6 hover:border-purple-500/60 transition-all hover:scale-105 overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl group-hover:bg-purple-500/20 transition-all"></div>
                    <div className="relative">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-gray-400 text-sm font-medium">Profit Factor</span>
                        <Flame className="w-8 h-8 text-purple-400" />
                      </div>
                      <div className="text-4xl font-black text-purple-400 mb-2">
                        {stats.profit_factor.toFixed(2)}
                      </div>
                      <div className="text-gray-500 text-sm">
                        {stats.profit_factor >= 2 ? 'Excellent' : stats.profit_factor >= 1.5 ? 'Good' : 'Needs Work'}
                      </div>
                    </div>
                  </motion.div>
                </div>

                {/* 🎯 Secondary Advanced Metrics */}
                {advancedMetrics && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                      className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 hover:border-amber-500/30 transition-all"
                    >
                      <div className="text-gray-400 text-xs mb-1">Sharpe Ratio</div>
                      <div className="text-2xl font-bold text-white">
                        {advancedMetrics.sharpeRatio.toFixed(2)}
                      </div>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 }}
                      className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 hover:border-red-500/30 transition-all"
                    >
                      <div className="text-gray-400 text-xs mb-1">Max Drawdown</div>
                      <div className="text-2xl font-bold text-red-400">
                        ${advancedMetrics.maxDrawdown.toFixed(2)}
                      </div>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.7 }}
                      className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 hover:border-emerald-500/30 transition-all"
                    >
                      <div className="text-gray-400 text-xs mb-1">Expectancy</div>
                      <div className="text-2xl font-bold text-emerald-400">
                        ${advancedMetrics.expectancy.toFixed(2)}
                      </div>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.8 }}
                      className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 hover:border-amber-500/30 transition-all"
                    >
                      <div className="text-gray-400 text-xs mb-1">Max Win Streak</div>
                      <div className="text-2xl font-bold text-amber-400 flex items-center gap-2">
                        <Flame className="w-6 h-6" />
                        {advancedMetrics.maxWinStreak}
                      </div>
                    </motion.div>
                  </div>
                )}

                {/* 📊 Interactive Charts */}
                {profitCurveData.length > 0 && (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    {/* Profit Curve Chart */}
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 }}
                      className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6"
                    >
                      <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                        <TrendingUp className="w-6 h-6 text-amber-500" />
                        Profit Curve
                      </h3>
                      <ResponsiveContainer width="100%" height={300}>
                        <AreaChart data={profitCurveData}>
                          <defs>
                            <linearGradient id="profitGradient" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
                              <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                          <XAxis dataKey="date" stroke="#666" />
                          <YAxis stroke="#666" />
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: '#1f2937', 
                              border: '1px solid #f59e0b',
                              borderRadius: '8px'
                            }} 
                          />
                          <Area 
                            type="monotone" 
                            dataKey="profit" 
                            stroke="#f59e0b" 
                            strokeWidth={3}
                            fill="url(#profitGradient)" 
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </motion.div>

                    {/* Performance by Pair Chart */}
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 }}
                      className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6"
                    >
                      <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                        <PieChart className="w-6 h-6 text-blue-500" />
                        Top Pairs
                      </h3>
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={performanceByPair}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                          <XAxis dataKey="pair" stroke="#666" />
                          <YAxis stroke="#666" />
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: '#1f2937', 
                              border: '1px solid #3b82f6',
                              borderRadius: '8px'
                            }} 
                          />
                          <Bar dataKey="profit" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </motion.div>
                  </div>
                )}

                {/* 🔥 Recent Trades Timeline */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6"
                >
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <Clock className="w-6 h-6 text-amber-500" />
                    Recent Trades
                  </h3>
                  <div className="space-y-3">
                    {trades.slice(0, 5).map((trade, index) => (
                      <motion.div
                        key={trade.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.6 + index * 0.1 }}
                        className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10 hover:border-amber-500/30 transition-all"
                      >
                        <div className="flex items-center gap-4">
                          <div className={`w-2 h-2 rounded-full ${
                            trade.status === 'open' ? 'bg-blue-500' : 
                            (trade.profit_loss_usd || 0) > 0 ? 'bg-emerald-500' : 'bg-red-500'
                          }`}></div>
                          <div>
                            <div className="font-bold text-white">{trade.pair_ticker}</div>
                            <div className="text-sm text-gray-400">
                              {trade.order_type} • {format(new Date(trade.entry_time), 'MMM dd, HH:mm')}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          {trade.status === 'closed' && (
                            <div className={`font-bold ${
                              (trade.profit_loss_usd || 0) > 0 ? 'text-emerald-400' : 'text-red-400'
                            }`}>
                              {(trade.profit_loss_usd || 0) > 0 ? '+' : ''}${trade.profit_loss_usd?.toFixed(2)}
                            </div>
                          )}
                          <div className="text-sm text-gray-400">{trade.status}</div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </motion.div>
            )}

            {/* 📊 ANALYTICS VIEW - Advanced Metrics & Charts */}
            {activeView === 'analytics' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="space-y-6"
              >
                {/* Performance by Session */}
                {performanceBySession.some(s => s.total > 0) && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6"
                  >
                    <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                      <Clock className="w-7 h-7 text-amber-500" />
                      Performance by Trading Session
                    </h3>
                    <ResponsiveContainer width="100%" height={350}>
                      <BarChart data={performanceBySession}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                        <XAxis dataKey="session" stroke="#666" />
                        <YAxis stroke="#666" />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: '#1f2937', 
                            border: '1px solid #f59e0b',
                            borderRadius: '8px'
                          }} 
                        />
                        <Legend />
                        <Bar dataKey="profit" fill="#f59e0b" name="Profit ($)" radius={[8, 8, 0, 0]} />
                        <Bar dataKey="winRate" fill="#10b981" name="Win Rate (%)" radius={[8, 8, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </motion.div>
                )}

                {/* Win/Loss Distribution */}
                {winLossDistribution.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6"
                  >
                    <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                      <BarChart3 className="w-7 h-7 text-blue-500" />
                      Win/Loss Distribution
                    </h3>
                    <ResponsiveContainer width="100%" height={350}>
                      <BarChart data={winLossDistribution}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                        <XAxis dataKey="range" stroke="#666" />
                        <YAxis stroke="#666" />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: '#1f2937', 
                            border: '1px solid #3b82f6',
                            borderRadius: '8px'
                          }} 
                        />
                        <Bar dataKey="count" fill="#3b82f6" radius={[8, 8, 0, 0]}>
                          {winLossDistribution.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.value > 0 ? '#10b981' : '#ef4444'} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </motion.div>
                )}

                {/* Advanced Metrics Grid */}
                {advancedMetrics && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.2 }}
                      className="bg-gradient-to-br from-emerald-500/10 to-transparent backdrop-blur-sm border border-emerald-500/30 rounded-2xl p-6"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-lg font-semibold text-gray-300">Avg Win</h4>
                        <TrendingUp className="w-6 h-6 text-emerald-400" />
                      </div>
                      <div className="text-3xl font-black text-emerald-400">
                        ${advancedMetrics.avgWin.toFixed(2)}
                      </div>
                      <div className="text-sm text-gray-500 mt-2">
                        {stats.average_win_pips.toFixed(1)} pips avg
                      </div>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.3 }}
                      className="bg-gradient-to-br from-red-500/10 to-transparent backdrop-blur-sm border border-red-500/30 rounded-2xl p-6"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-lg font-semibold text-gray-300">Avg Loss</h4>
                        <TrendingDown className="w-6 h-6 text-red-400" />
                      </div>
                      <div className="text-3xl font-black text-red-400">
                        ${advancedMetrics.avgLoss.toFixed(2)}
                      </div>
                      <div className="text-sm text-gray-500 mt-2">
                        {Math.abs(stats.average_loss_pips).toFixed(1)} pips avg
                      </div>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.4 }}
                      className="bg-gradient-to-br from-amber-500/10 to-transparent backdrop-blur-sm border border-amber-500/30 rounded-2xl p-6"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-lg font-semibold text-gray-300">Max Loss Streak</h4>
                        <AlertTriangle className="w-6 h-6 text-amber-400" />
                      </div>
                      <div className="text-3xl font-black text-amber-400">
                        {advancedMetrics.maxLossStreak}
                      </div>
                      <div className="text-sm text-gray-500 mt-2">
                        Consecutive losses
                      </div>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.5 }}
                      className="bg-gradient-to-br from-purple-500/10 to-transparent backdrop-blur-sm border border-purple-500/30 rounded-2xl p-6"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-lg font-semibold text-gray-300">Largest Win</h4>
                        <Trophy className="w-6 h-6 text-purple-400" />
                      </div>
                      <div className="text-3xl font-black text-purple-400">
                        ${stats.largest_win_usd.toFixed(2)}
                      </div>
                      <div className="text-sm text-gray-500 mt-2">
                        Best single trade
                      </div>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.6 }}
                      className="bg-gradient-to-br from-orange-500/10 to-transparent backdrop-blur-sm border border-orange-500/30 rounded-2xl p-6"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-lg font-semibold text-gray-300">Largest Loss</h4>
                        <XCircle className="w-6 h-6 text-orange-400" />
                      </div>
                      <div className="text-3xl font-black text-orange-400">
                        ${Math.abs(stats.largest_loss_usd).toFixed(2)}
                      </div>
                      <div className="text-sm text-gray-500 mt-2">
                        Worst single trade
                      </div>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.7 }}
                      className="bg-gradient-to-br from-blue-500/10 to-transparent backdrop-blur-sm border border-blue-500/30 rounded-2xl p-6"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-lg font-semibold text-gray-300">Risk/Reward</h4>
                        <Shield className="w-6 h-6 text-blue-400" />
                      </div>
                      <div className="text-3xl font-black text-blue-400">
                        1:{(advancedMetrics.avgWin / advancedMetrics.avgLoss).toFixed(2)}
                      </div>
                      <div className="text-sm text-gray-500 mt-2">
                        Average R:R ratio
                      </div>
                    </motion.div>
                  </div>
                )}
              </motion.div>
            )}

            {/* 📋 ALL TRADES VIEW - Complete Table with Filters */}
            {activeView === 'trades' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                {/* Filters */}
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 mb-6">
                  <div className="flex flex-wrap gap-4 items-center">
                    <div className="flex items-center gap-2">
                      <Search className="w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search pairs..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:border-amber-500 focus:outline-none"
                      />
                    </div>

                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value as any)}
                      className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-amber-500 focus:outline-none"
                    >
                      <option value="all">All Status</option>
                      <option value="open">Open</option>
                      <option value="closed">Closed</option>
                    </select>

                    <select
                      value={filterResult}
                      onChange={(e) => setFilterResult(e.target.value as any)}
                      className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-amber-500 focus:outline-none"
                    >
                      <option value="all">All Results</option>
                      <option value="win">Wins</option>
                      <option value="loss">Losses</option>
                    </select>

                    <div className="ml-auto text-gray-400">
                      {filteredTrades.length} trades
                    </div>
                  </div>
                </div>

                {/* Trades Table */}
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-white/5 border-b border-white/10">
                        <tr>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Pair</th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Type</th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Entry</th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Exit</th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">P/L</th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Pips</th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">R:R</th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Status</th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/10">
                        {filteredTrades.map((trade, index) => (
                          <motion.tr
                            key={trade.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="hover:bg-white/5 transition-all"
                          >
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="font-bold text-white">{trade.pair_ticker}</div>
                              <div className="text-xs text-gray-500">{trade.asset_type}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                trade.order_type === 'Buy' 
                                  ? 'bg-emerald-500/20 text-emerald-400' 
                                  : 'bg-red-500/20 text-red-400'
                              }`}>
                                {trade.order_type}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-gray-300">
                              {trade.entry_price.toFixed(5)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-gray-300">
                              {trade.exit_price ? trade.exit_price.toFixed(5) : '-'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {trade.profit_loss_usd !== undefined && (
                                <span className={`font-bold ${
                                  trade.profit_loss_usd > 0 ? 'text-emerald-400' : 'text-red-400'
                                }`}>
                                  {trade.profit_loss_usd > 0 ? '+' : ''}${trade.profit_loss_usd.toFixed(2)}
                                </span>
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {trade.profit_loss_pips !== undefined && (
                                <span className={`font-semibold ${
                                  trade.profit_loss_pips > 0 ? 'text-emerald-400' : 'text-red-400'
                                }`}>
                                  {trade.profit_loss_pips > 0 ? '+' : ''}{trade.profit_loss_pips.toFixed(1)}
                                </span>
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-gray-300">
                              1:{trade.risk_reward_ratio.toFixed(1)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                trade.status === 'open' 
                                  ? 'bg-blue-500/20 text-blue-400' 
                                  : 'bg-gray-500/20 text-gray-400'
                              }`}>
                                {trade.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex gap-2">
                                <button
                                  onClick={() => {
                                    setSelectedTrade(trade);
                                    setShowEditModal(true);
                                  }}
                                  className="text-amber-400 hover:text-amber-300 transition-colors"
                                >
                                  <Settings className="w-5 h-5" />
                                </button>
                                <button
                                  onClick={() => {
                                    setTradeToDelete(trade.id);
                                    setShowDeleteConfirm(true);
                                  }}
                                  className="text-red-400 hover:text-red-300 transition-colors"
                                >
                                  <XCircle className="w-5 h-5" />
                                </button>
                              </div>
                            </td>
                          </motion.tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </motion.div>
            )}

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

          </>
        ) : (
          <div className="text-center py-20">
            <p className="text-gray-400">Failed to load journal data. Please refresh.</p>
          </div>
        )}
          </>
        ) : (
          /* Marketing content for non-logged-in users */
          <div className="space-y-16">
            {/* Back to Home Button for Non-Logged-In Users */}
            <div className="mb-6">
              <Link 
                href="/" 
                className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-amber-400 transition-colors"
              >
                ← Back to Home
              </Link>
            </div>

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
                onClick={() => {
                  setShowAuthModal(true);
                  setAuthMode("login");
                }}
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

        {showAuthModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowAuthModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-slate-900 rounded-2xl p-6 max-w-sm w-full border border-slate-700 relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button onClick={() => setShowAuthModal(false)} className="absolute top-5 right-5 text-slate-500 hover:text-white transition-colors"><XCircle className="w-6 h-6" /></button>

              <div className="text-center mb-5">
                <h2 className="text-xl font-bold text-white mb-1">
                  {authMode === "login" ? "Login" : "Create Account"}
                </h2>
                <p className="text-slate-400 text-xs">
                  {authMode === "signup" ? "Sign up to access your trading journal." : "Enter your credentials to access your dashboard."}
                </p>
              </div>

              {authError && <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-2 rounded-lg text-xs font-bold mb-4 text-center flex items-center justify-center gap-2"><AlertTriangle size={14} /> {authError}</div>}

              <div className="space-y-3">
                {authMode === "signup" && (
                  <>
                    <div className="grid grid-cols-2 gap-2 animate-in slide-in-from-bottom-2">
                      <div>
                        <label className="text-[9px] uppercase font-bold text-slate-500 ml-1 block mb-1">First Name <span className="text-red-500">*</span></label>
                        <input type="text" className="w-full bg-slate-900 border border-slate-700 focus:border-blue-500 rounded-lg p-2 text-sm text-white outline-none transition-all" value={firstName} onChange={e => setFirstName(e.target.value)} />
                      </div>
                      <div>
                        <label className="text-[9px] uppercase font-bold text-slate-500 ml-1 block mb-1">Last Name <span className="text-red-500">*</span></label>
                        <input type="text" className="w-full bg-slate-900 border border-slate-700 focus:border-blue-500 rounded-lg p-2 text-sm text-white outline-none transition-all" value={lastName} onChange={e => setLastName(e.target.value)} />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 animate-in slide-in-from-bottom-3">
                      <div>
                        <label className="text-[9px] uppercase font-bold text-slate-500 ml-1 block mb-1">Country <span className="text-red-500">*</span></label>
                        <select
                          className="w-full bg-slate-900 border border-slate-700 focus:border-blue-500 rounded-lg p-2 text-sm text-white outline-none transition-all appearance-none cursor-pointer"
                          value={country}
                          onChange={e => setCountry(e.target.value)}
                        >
                          <option value="" disabled>Select Country</option>
                          {countriesList.map((c) => (
                            <option key={c.code} value={c.code}>
                              {c.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="text-[9px] uppercase font-bold text-slate-500 ml-1 block mb-1">Address</label>
                        <input type="text" className="w-full bg-slate-900 border border-slate-700 focus:border-blue-500 rounded-lg p-2 text-sm text-white outline-none transition-all" value={address} onChange={e => setAddress(e.target.value)} />
                      </div>
                    </div>

                    <div className="animate-in slide-in-from-bottom-4">
                      <label className="text-[9px] uppercase font-bold text-slate-500 ml-1 block mb-1">Phone <span className="text-red-500">*</span></label>
                      <input type="tel" className="w-full bg-slate-900 border border-slate-700 focus:border-blue-500 rounded-lg p-2 text-sm text-white outline-none transition-all" value={phone} onChange={e => setPhone(e.target.value)} />
                    </div>
                  </>
                )}

                <div>
                  <label className="text-[9px] uppercase font-bold text-slate-500 ml-1 block mb-1">Email <span className="text-red-500">*</span></label>
                  <input type="email" className="w-full bg-slate-900 border border-slate-700 focus:border-blue-500 rounded-lg p-2 text-sm text-white outline-none transition-all" value={email} onChange={e => setEmail(e.target.value)} />
                </div>

                <div>
                  <label className="text-[9px] uppercase font-bold text-slate-500 ml-1 block mb-1">Password <span className="text-red-500">*</span></label>
                  <input type="password" className="w-full bg-slate-900 border border-slate-700 focus:border-blue-500 rounded-lg p-2 text-sm text-white outline-none transition-all" value={password} onChange={e => setPassword(e.target.value)} />
                </div>

                {authMode === "signup" && (
                  <div className="flex items-start gap-2 p-3 bg-slate-900/50 border border-slate-700 rounded-lg animate-in slide-in-from-bottom-5">
                    <input
                      type="checkbox"
                      id="acceptTerms"
                      checked={acceptTerms}
                      onChange={(e) => setAcceptTerms(e.target.checked)}
                      className="mt-0.5 w-3.5 h-3.5 rounded border-slate-600 bg-slate-800 text-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-0 cursor-pointer"
                    />
                    <label htmlFor="acceptTerms" className="text-[11px] text-slate-300 leading-relaxed cursor-pointer">
                      I agree to the{" "}
                      <Link href="/terms" target="_blank" className="text-blue-400 hover:text-blue-300 underline font-semibold">
                        Terms of Service
                      </Link>
                      {" "}and{" "}
                      <Link href="/privacy" target="_blank" className="text-blue-400 hover:text-blue-300 underline font-semibold">
                        Privacy Policy
                      </Link>
                    </label>
                  </div>
                )}

                <button
                  onClick={handleAuth}
                  disabled={isSubmittingAuth}
                  className="w-full bg-blue-600 hover:bg-blue-500 py-2.5 rounded-lg font-bold text-sm text-white transition-all mt-3 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSubmittingAuth ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>{authMode === "login" ? "Logging in..." : "Creating Account..."}</span>
                    </>
                  ) : (
                    authMode === "login" ? "Login" : "Register"
                  )}
                </button>

                <div className="text-center pt-2">
                  <button onClick={() => { setAuthMode(authMode === "login" ? "signup" : "login"); setAuthError(""); }} className="text-xs text-slate-400 hover:text-white transition-colors">
                    {authMode === "login" ? "Don't have an account? Sign up" : "Already have an account? Login"}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteConfirm && tradeToDelete !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowDeleteConfirm(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gradient-to-br from-gray-900 to-gray-800 border border-red-500/30 rounded-xl max-w-md w-full p-6"
            >
              <h3 className="text-xl font-bold text-white mb-4">Delete Trade?</h3>
              <p className="text-gray-300 mb-6">
                Are you sure you want to delete this trade? This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-2.5 rounded-lg font-semibold transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={async () => {
                    try {
                      const res = await fetch(`${API_BASE}/journal/trades/${tradeToDelete}`, {
                        method: 'DELETE',
                        credentials: 'include',
                      });
                      if (!res.ok) throw new Error('Failed to delete trade');
                      
                      toast.success('Trade deleted successfully');
                      setShowDeleteConfirm(false);
                      setTradeToDelete(null);
                      fetchTrades();
                      fetchStats();
                    } catch (error) {
                      console.error('Error deleting trade:', error);
                      toast.error('Failed to delete trade');
                    }
                  }}
                  className="flex-1 bg-red-600 hover:bg-red-500 text-white py-2.5 rounded-lg font-semibold transition-all"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Trade Modal */}
      <AnimatePresence>
        {showEditModal && selectedTrade && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto"
            onClick={() => setShowEditModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gradient-to-br from-gray-900 to-gray-800 border border-amber-500/30 rounded-xl max-w-2xl w-full p-6 my-8"
            >
              <h3 className="text-2xl font-bold text-amber-400 mb-6">Edit Trade</h3>
              
              <form onSubmit={async (e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const data = {
                  asset_type: formData.get('asset_type'),
                  pair_ticker: formData.get('pair_ticker'),
                  order_type: formData.get('order_type'),
                  entry_price: parseFloat(formData.get('entry_price') as string),
                  exit_price: formData.get('exit_price') ? parseFloat(formData.get('exit_price') as string) : null,
                  lot_size: parseFloat(formData.get('lot_size') as string),
                  risk_reward_ratio: parseFloat(formData.get('risk_reward_ratio') as string),
                  strategy: formData.get('strategy') || null,
                  trading_session: formData.get('trading_session') || null,
                  status: formData.get('status'),
                };

                try {
                  const res = await fetch(`${API_BASE}/journal/trades/${selectedTrade.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                    body: JSON.stringify(data),
                  });
                  
                  if (!res.ok) throw new Error('Failed to update trade');
                  
                  toast.success('Trade updated successfully');
                  setShowEditModal(false);
                  setSelectedTrade(null);
                  fetchTrades();
                  fetchStats();
                } catch (error) {
                  console.error('Error updating trade:', error);
                  toast.error('Failed to update trade');
                }
              }} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-gray-400 mb-1 block">Asset Type</label>
                    <select name="asset_type" defaultValue={selectedTrade.asset_type} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white">
                      <option value="forex">Forex</option>
                      <option value="gold">Gold</option>
                      <option value="indices">Indices</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="text-xs text-gray-400 mb-1 block">Pair/Ticker</label>
                    <input name="pair_ticker" defaultValue={selectedTrade.pair_ticker} required className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white" />
                  </div>

                  <div>
                    <label className="text-xs text-gray-400 mb-1 block">Order Type</label>
                    <select name="order_type" defaultValue={selectedTrade.order_type} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white">
                      <option value="Buy">Buy</option>
                      <option value="Sell">Sell</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs text-gray-400 mb-1 block">Entry Price</label>
                    <input name="entry_price" type="number" step="any" defaultValue={selectedTrade.entry_price} required className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white" />
                  </div>

                  <div>
                    <label className="text-xs text-gray-400 mb-1 block">Exit Price</label>
                    <input name="exit_price" type="number" step="any" defaultValue={selectedTrade.exit_price || ''} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white" />
                  </div>

                  <div>
                    <label className="text-xs text-gray-400 mb-1 block">Lot Size</label>
                    <input name="lot_size" type="number" step="0.01" defaultValue={selectedTrade.lot_size} required className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white" />
                  </div>

                  <div>
                    <label className="text-xs text-gray-400 mb-1 block">Risk:Reward Ratio</label>
                    <input name="risk_reward_ratio" type="number" step="0.1" defaultValue={selectedTrade.risk_reward_ratio} required className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white" />
                  </div>

                  <div>
                    <label className="text-xs text-gray-400 mb-1 block">Strategy</label>
                    <input name="strategy" defaultValue={selectedTrade.strategy || ''} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white" />
                  </div>

                  <div>
                    <label className="text-xs text-gray-400 mb-1 block">Trading Session</label>
                    <select name="trading_session" defaultValue={selectedTrade.trading_session || ''} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white">
                      <option value="">Select Session</option>
                      <option value="London">London</option>
                      <option value="New York">New York</option>
                      <option value="Tokyo">Tokyo</option>
                      <option value="Sydney">Sydney</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs text-gray-400 mb-1 block">Status</label>
                    <select name="status" defaultValue={selectedTrade.status} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white">
                      <option value="open">Open</option>
                      <option value="closed">Closed</option>
                    </select>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowEditModal(false)}
                    className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-2.5 rounded-lg font-semibold transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-amber-600 hover:bg-amber-500 text-white py-2.5 rounded-lg font-semibold transition-all"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
