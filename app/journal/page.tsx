"use client";

import React, { useState, useEffect, useMemo, Fragment } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import AddTradeModal from '@/src/components/AddTradeModal';
import RichTextEditor from '@/src/components/RichTextEditor';
import Link from 'next/link';
import Navbar from '@/src/components/Navbar';
import Footer from '@/src/components/Footer';
import Image from 'next/image';
import { 
  XCircle, AlertTriangle, TrendingUp, TrendingDown, Target, Award,
  Calendar, Clock, DollarSign, Zap, BarChart3, PieChart, Activity,
  Filter, Download, Share2, Trophy, Star, Flame, Crown, Medal,
  Brain, Eye, ChevronDown, ChevronUp, Search, Settings, Bell,
  LineChart, ArrowUp, ArrowDown, Sparkles, Rocket, Shield, X, FileText, Tag, Plus, CheckSquare,
  Keyboard, Image as ImageIcon, GripVertical, Heart, Lightbulb, UserPlus, Calculator
} from 'lucide-react';
import toast from 'react-hot-toast';
import ReactECharts from 'echarts-for-react';
import * as echarts from 'echarts';
import { format, startOfWeek, endOfWeek, eachDayOfInterval, parseISO } from 'date-fns';

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

const STRATEGY_TEMPLATES = [
  {
    name: 'Breakout Trade',
    strategy: 'Breakout',
    notes: '<p><strong>Setup:</strong> Identified key resistance level with increasing volume</p><p><strong>Entry:</strong> Entered on breakout above resistance with confirmation</p><p><strong>Risk Management:</strong> Stop loss below recent swing low</p>'
  },
  {
    name: 'Reversal Trade',
    strategy: 'Reversal',
    notes: '<p><strong>Setup:</strong> Overbought/oversold conditions with divergence</p><p><strong>Entry:</strong> Entered on reversal candlestick pattern</p><p><strong>Risk Management:</strong> Stop loss above recent high</p>'
  },
  {
    name: 'Trend Following',
    strategy: 'Trend Following',
    notes: '<p><strong>Setup:</strong> Strong trending market with pullbacks</p><p><strong>Entry:</strong> Entered on pullback to trend line/support</p><p><strong>Risk Management:</strong> Stop loss below trend line</p>'
  },
  {
    name: 'Scalping',
    strategy: 'Scalping',
    notes: '<p><strong>Setup:</strong> High volatility, tight spreads</p><p><strong>Entry:</strong> Quick entries on 1-2 pip movements</p><p><strong>Risk Management:</strong> 1:1 risk-reward, quick exits</p>'
  }
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
  tags?: string;
  checklist?: string;
  image_url?: string;
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
  const [particles, setParticles] = useState<Array<{x: number, y: number, duration: number}>>([]);

  useEffect(() => {
    // Generate particles only on client-side to avoid hydration mismatch
    const newParticles = [...Array(50)].map(() => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      duration: Math.random() * 20 + 10
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {particles.map((particle, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-amber-500/30 rounded-full"
          initial={{
            x: particle.x,
            y: particle.y,
          }}
          animate={{
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
          }}
          transition={{
            duration: particle.duration,
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
  
  // Edit modal state
  const [editActiveSection, setEditActiveSection] = useState('basics');
  const [editShowTemplates, setEditShowTemplates] = useState(false);
  const [editNewTag, setEditNewTag] = useState('');
  const [editFormData, setEditFormData] = useState({
    pair_ticker: '',
    asset_type: 'forex',
    market_trend: 'Bullish',
    trading_session: 'London',
    strategy: '',
    order_type: 'Buy',
    lot_size: 0.01,
    entry_price: 0,
    stop_loss: 0,
    take_profit: 0,
    exit_price: null as number | null,
    entry_time: new Date().toISOString().slice(0, 16),
    exit_time: null as string | null,
    account_size_at_entry: 1000,
    risk_reward_ratio: 0,
    notes: '',
    tags: [] as string[],
    checklist: [] as { id: string; text: string; completed: boolean }[],
    image_url: '',
    status: 'open'
  });
  
  // 🚀 Epic new features state
  const [activeView, setActiveView] = useState<'dashboard' | 'analytics' | 'trades'>('dashboard');
  const [filterStatus, setFilterStatus] = useState<'all' | 'open' | 'closed'>('all');
  const [filterResult, setFilterResult] = useState<'all' | 'win' | 'loss'>('all');
  const [expandedTradeId, setExpandedTradeId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAchievements, setShowAchievements] = useState(false);
  const [selectedTimeframe, setSelectedTimeframe] = useState<'day' | 'week' | 'month' | 'all'>('week');
  
  // Advanced filters state
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedStrategies, setSelectedStrategies] = useState<string[]>([]);
  const [selectedSessions, setSelectedSessions] = useState<string[]>([]);
  const [selectedTrends, setSelectedTrends] = useState<string[]>([]);
  const [selectedAssetTypes, setSelectedAssetTypes] = useState<string[]>([]);
  const [minPL, setMinPL] = useState('');
  const [maxPL, setMaxPL] = useState('');
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const tradesPerPage = 20;
  const [minRR, setMinRR] = useState('');
  const [maxRR, setMaxRR] = useState('');
  const [showKeyboardShortcuts, setShowKeyboardShortcuts] = useState(false);
  
  // Button action states
  const [showExportModal, setShowExportModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showAIStrategyModal, setShowAIStrategyModal] = useState(false);
  
  // Initialize edit form data from selected trade
  const initializeEditForm = (trade: Trade) => {
    setEditFormData({
      pair_ticker: trade.pair_ticker,
      asset_type: trade.asset_type,
      market_trend: 'Bullish', // Default, could be enhanced later
      trading_session: trade.trading_session || 'London',
      strategy: trade.strategy || '',
      order_type: trade.order_type,
      lot_size: trade.lot_size,
      entry_price: trade.entry_price || 0,
      stop_loss: 0, // Default, could be enhanced later
      take_profit: 0, // Default, could be enhanced later
      exit_price: trade.exit_price || null,
      entry_time: new Date().toISOString().slice(0, 16), // Default, could be enhanced later
      exit_time: null, // Default, could be enhanced later
      account_size_at_entry: 1000, // Default, could be enhanced later
      risk_reward_ratio: trade.risk_reward_ratio,
      notes: '', // Will be populated from trade data if available
      tags: trade.tags ? trade.tags.split(',').filter(tag => tag.trim()) : [],
      checklist: trade.checklist ? JSON.parse(trade.checklist) : [],
      image_url: trade.image_url || '',
      status: trade.status
    });
    setEditActiveSection('basics');
    setEditShowTemplates(false);
    setEditNewTag('');
  };

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

  // Keyboard shortcuts for power users
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Only handle shortcuts when not typing in inputs
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
        return;
      }

      if (event.ctrlKey || event.metaKey) {
        switch (event.key.toLowerCase()) {
          case 'n':
            event.preventDefault();
            handleNewTradeClick();
            break;
          case 's':
            event.preventDefault();
            // Save functionality - could be used in edit modal
            if (showEditModal) {
              // Trigger save in edit modal
              const saveButton = document.querySelector('[data-edit-save]') as HTMLButtonElement;
              saveButton?.click();
            }
            break;
          case '/':
            event.preventDefault();
            // Focus search input
            const searchInput = document.querySelector('input[placeholder*="Search"]') as HTMLInputElement;
            searchInput?.focus();
            break;
        }
      }

      // Other shortcuts
      if (event.key === 'Escape') {
        if (showAddTrade) setShowAddTrade(false);
        if (showEditModal) setShowEditModal(false);
        if (showDeleteConfirm) setShowDeleteConfirm(false);
        if (showPremiumModal) setShowPremiumModal(false);
        if (showAuthModal) setShowAuthModal(false);
        if (showKeyboardShortcuts) setShowKeyboardShortcuts(false);
      }
    };

    const handleClickOutside = (event: MouseEvent) => {
      if (showKeyboardShortcuts && !(event.target as Element).closest('.keyboard-shortcuts')) {
        setShowKeyboardShortcuts(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showAddTrade, showEditModal, showDeleteConfirm, showPremiumModal, showAuthModal, showKeyboardShortcuts]);

  const checkAuth = async () => {
    try {
      const res = await fetch(`/api/users/me`, {
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

    const url = authMode === "login" ? `/api/token` : `/api/register`;

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
          const loginResponse = await fetch(`/api/login`, {
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
      const res = await fetch(`/api/journal/stats`, {
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
        console.error(`Stats fetch failed with status ${res.status}: /api/journal/stats`);
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  const fetchTrades = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/journal/trades?limit=1000`, {
        credentials: 'include'
      });
      if (res.ok) {
        const data = await res.json();
        setTrades(data);
      } else {
        console.error(`Trades fetch failed with status ${res.status}: /api/journal/trades`);
      }
    } catch (error) {
      console.error('Failed to fetch trades:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTrade = async (tradeId: number) => {
    try {
      const res = await fetch(`/api/journal/trades/${tradeId}`, {
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
      const res = await fetch(`/api/journal/trades/${selectedTrade.id}`, {
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

  // 🎯 BUTTON ACTION HANDLERS
  const handleExportReport = () => {
    setShowExportModal(true);
    toast.success('📊 Generating PDF report...');
    
    // Simulate PDF generation
    setTimeout(() => {
      const data = {
        stats: stats,
        trades: trades.slice(0, 10), // First 10 trades for demo
        date: new Date().toLocaleDateString()
      };
      
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `trading-report-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast.success('✅ Report downloaded successfully!');
      setShowExportModal(false);
    }, 2000);
  };

  const handleShareDashboard = () => {
    setShowShareModal(true);
    
    const shareUrl = `${window.location.origin}/journal?shared=true&user=${userId}`;
    const shareText = `Check out my trading analytics dashboard! 📊\n\nStats: ${stats?.total_trades || 0} trades, ${(stats?.win_rate || 0).toFixed(1)}% win rate, $${(stats?.net_profit_usd || 0).toFixed(2)} P&L`;
    
    if (navigator.share) {
      navigator.share({
        title: 'My Trading Analytics',
        text: shareText,
        url: shareUrl
      }).catch(() => {
        // Fallback to clipboard
        navigator.clipboard.writeText(`${shareText}\n\n${shareUrl}`);
        toast.success('📋 Link copied to clipboard!');
      });
    } else {
      navigator.clipboard.writeText(`${shareText}\n\n${shareUrl}`);
      toast.success('📋 Link copied to clipboard!');
    }
    
    setShowShareModal(false);
  };

  const handleAIStrategy = () => {
    setShowAIStrategyModal(true);
    
    const recommendations = [];
    
    if ((stats?.win_rate || 0) < 50) {
      recommendations.push("Focus on improving entry timing and risk management");
    }
    
    if ((advancedMetrics?.maxDrawdown || 0) > Math.abs(stats?.net_profit_usd || 0) * 0.3) {
      recommendations.push("Reduce position sizes to limit drawdown");
    }
    
    if ((advancedMetrics?.maxLossStreak || 0) > 3) {
      recommendations.push("Work on cutting losses early to avoid long losing streaks");
    }
    
    if (recommendations.length === 0) {
      recommendations.push("Your strategy is performing well! Consider scaling up successful approaches.");
    }
    
    toast.success(`🤖 AI Strategy: ${recommendations[0]}`);
    setShowAIStrategyModal(false);
  };

  // 🔍 Filtered trades with advanced filters
  const filteredTrades = useMemo(() => {
    return trades.filter(trade => {
      // Basic filters
      if (filterStatus !== 'all' && trade.status !== filterStatus) return false;
      if (filterResult !== 'all') {
        if (filterResult === 'win' && (trade.profit_loss_usd || 0) <= 0) return false;
        if (filterResult === 'loss' && (trade.profit_loss_usd || 0) >= 0) return false;
      }
      if (searchQuery && !trade.pair_ticker.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      
      // Date range filter
      if (dateFrom) {
        const tradeDate = new Date(trade.entry_time);
        const fromDate = new Date(dateFrom);
        if (tradeDate < fromDate) return false;
      }
      if (dateTo) {
        const tradeDate = new Date(trade.entry_time);
        const toDate = new Date(dateTo);
        toDate.setHours(23, 59, 59, 999); // End of day
        if (tradeDate > toDate) return false;
      }
      
      // Tags filter
      if (selectedTags.length > 0) {
        const tradeTags = trade.tags ? trade.tags.split(',').map(t => t.trim()) : [];
        if (!selectedTags.some(tag => tradeTags.includes(tag))) return false;
      }
      
      // Strategy filter
      if (selectedStrategies.length > 0 && !selectedStrategies.includes(trade.strategy || '')) return false;
      
      // Trading session filter
      if (selectedSessions.length > 0 && !selectedSessions.includes(trade.trading_session || '')) return false;
      
      // Market trend filter
      if (selectedTrends.length > 0 && !selectedTrends.includes(trade.market_trend || '')) return false;
      
      // Asset type filter
      if (selectedAssetTypes.length > 0 && !selectedAssetTypes.includes(trade.asset_type)) return false;
      
      // P&L range filter
      if (minPL && (trade.profit_loss_usd || 0) < parseFloat(minPL)) return false;
      if (maxPL && (trade.profit_loss_usd || 0) > parseFloat(maxPL)) return false;
      
      // Risk/Reward range filter
      if (minRR && trade.risk_reward_ratio < parseFloat(minRR)) return false;
      if (maxRR && trade.risk_reward_ratio > parseFloat(maxRR)) return false;
      
      return true;
    });
  }, [trades, filterStatus, filterResult, searchQuery, dateFrom, dateTo, selectedTags, selectedStrategies, selectedSessions, selectedTrends, selectedAssetTypes, minPL, maxPL, minRR, maxRR]);

  // Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filteredTrades.length]);

  // Demo data for non-logged-in users
  const demoTrades = [
    { id: 1, pair: 'EURUSD', type: 'Buy', entry: '1.08745', exit: '1.09230', pips: '+48.5', pl: '+$485', rr: '1:3.2', status: 'win', strategy: 'Trend Following', session: 'London' },
    { id: 2, pair: 'XAUUSD', type: 'Sell', entry: '2684.20', exit: '2668.90', pips: '+153.0', pl: '+$1,530', rr: '1:4.1', status: 'win', strategy: 'Breakout', session: 'New York' },
    { id: 3, pair: 'GBPUSD', type: 'Buy', entry: '1.26380', exit: '1.26720', pips: '+34.0', pl: '+$340', rr: '1:2.8', status: 'win', strategy: 'Support Bounce', session: 'London' },
    { id: 4, pair: 'NAS100', type: 'Sell', entry: '18452', exit: '18328', pips: '-124', pl: '-$124', rr: '1:2.5', status: 'loss', strategy: 'Reversal', session: 'New York' },
    { id: 5, pair: 'USDJPY', type: 'Buy', entry: '157.840', exit: '158.120', pips: '+28.0', pl: '+$280', rr: '1:3.5', status: 'win', strategy: 'Range Trade', session: 'Tokyo' },
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
              className="mb-6"
            >
              <Link 
                href="/" 
                className="inline-flex items-center gap-2 text-xs text-gray-400 hover:text-amber-400 transition-colors mb-3"
              >
                ← Back to Home
              </Link>
              
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <div>
                  <h1 className="text-2xl md:text-3xl font-black mb-1">
                    <span className="bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600 bg-clip-text text-transparent">
                      Your Trading Empire
                    </span>
                  </h1>
                  <p className="text-gray-400 text-sm flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-amber-500" />
                    {unlockedAchievements}/{totalAchievements} Achievements Unlocked
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setShowAchievements(true)}
                    className="px-3 py-2 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 rounded-lg text-sm font-semibold shadow-lg shadow-purple-500/30 transition-all hover:scale-105 flex items-center gap-2"
                  >
                    <Star className="w-4 h-4" />
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
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                    activeView === 'analytics'
                      ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-lg'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <BarChart3 className="w-4 h-4" />
                    Analytics
                  </div>
                </button>
                <button
                  onClick={() => setActiveView('trades')}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                    activeView === 'trades'
                      ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-lg'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <LineChart className="w-4 h-4" />
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
                    className="group relative bg-gradient-to-br from-emerald-500/10 via-black to-black backdrop-blur-sm border border-emerald-500/30 rounded-xl p-4 hover:border-emerald-500/60 transition-all hover:scale-105 overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl group-hover:bg-emerald-500/20 transition-all"></div>
                    <div className="relative">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-gray-400 text-xs font-medium">Net Profit</span>
                        <DollarSign className="w-5 h-5 text-emerald-400" />
                      </div>
                      <div className={`text-2xl font-bold mb-1 ${
                        (stats.net_profit_usd || 0) >= 0 ? 'text-emerald-400' : 'text-red-400'
                      }`}>
                        ${Math.abs(stats.net_profit_usd || 0).toFixed(2)}
                      </div>
                      <div className="text-gray-500 text-xs flex items-center gap-1">
                        {(stats.total_pips || 0) >= 0 ? (
                          <ArrowUp className="w-3 h-3 text-emerald-400" />
                        ) : (
                          <ArrowDown className="w-3 h-3 text-red-400" />
                        )}
                        {Math.abs(stats.total_pips || 0).toFixed(1)} pips
                      </div>
                    </div>
                  </motion.div>

                  {/* Win Rate Card */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className="group relative bg-gradient-to-br from-amber-500/10 via-black to-black backdrop-blur-sm border border-amber-500/30 rounded-xl p-4 hover:border-amber-500/60 transition-all hover:scale-105 overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/10 rounded-full blur-2xl group-hover:bg-amber-500/20 transition-all"></div>
                    <div className="relative">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-gray-400 text-xs font-medium">Win Rate</span>
                        <Target className="w-5 h-5 text-amber-400" />
                      </div>
                      <div className="text-2xl font-bold text-amber-400 mb-1">
                        {(stats.win_rate || 0).toFixed(1)}%
                      </div>
                      <div className="text-gray-500 text-xs">
                        {stats.wins}W / {stats.losses}L
                      </div>
                    </div>
                  </motion.div>

                  {/* Total Trades Card */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 }}
                    className="group relative bg-gradient-to-br from-blue-500/10 via-black to-black backdrop-blur-sm border border-blue-500/30 rounded-xl p-4 hover:border-blue-500/60 transition-all hover:scale-105 overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl group-hover:bg-blue-500/20 transition-all"></div>
                    <div className="relative">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-gray-400 text-xs font-medium">Total Trades</span>
                        <BarChart3 className="w-5 h-5 text-blue-400" />
                      </div>
                      <div className="text-2xl font-bold text-blue-400 mb-1">
                        {stats.total_trades}
                      </div>
                      <div className="text-gray-500 text-xs">
                        {stats.open_trades} open • {stats.closed_trades} closed
                      </div>
                    </div>
                  </motion.div>

                  {/* Profit Factor Card */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 }}
                    className="group relative bg-gradient-to-br from-purple-500/10 via-black to-black backdrop-blur-sm border border-purple-500/30 rounded-xl p-4 hover:border-purple-500/60 transition-all hover:scale-105 overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/10 rounded-full blur-2xl group-hover:bg-purple-500/20 transition-all"></div>
                    <div className="relative">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-gray-400 text-xs font-medium">Profit Factor</span>
                        <Flame className="w-5 h-5 text-purple-400" />
                      </div>
                      <div className="text-2xl font-bold text-purple-400 mb-1">
                        {(stats.profit_factor || 0).toFixed(2)}
                      </div>
                      <div className="text-gray-500 text-xs">
                        {(stats.profit_factor || 0) >= 2 ? 'Excellent' : (stats.profit_factor || 0) >= 1.5 ? 'Good' : 'Needs Work'}
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
                        {(advancedMetrics.sharpeRatio || 0).toFixed(2)}
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
                        ${(advancedMetrics.maxDrawdown || 0).toFixed(2)}
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
                        ${(advancedMetrics.expectancy || 0).toFixed(2)}
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
                      <ReactECharts
                        option={{
                          backgroundColor: 'transparent',
                          grid: {
                            left: '3%',
                            right: '4%',
                            bottom: '3%',
                            containLabel: true
                          },
                          xAxis: {
                            type: 'category',
                            data: profitCurveData.map(d => d.date),
                            axisLine: { lineStyle: { color: '#666' } },
                            axisLabel: { color: '#666' }
                          },
                          yAxis: {
                            type: 'value',
                            axisLine: { lineStyle: { color: '#666' } },
                            axisLabel: { color: '#666' }
                          },
                          series: [{
                            data: profitCurveData.map(d => d.profit),
                            type: 'line',
                            smooth: true,
                            symbol: 'none',
                            lineStyle: { color: '#f59e0b', width: 3 },
                            areaStyle: {
                              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                                { offset: 0, color: 'rgba(245, 158, 11, 0.3)' },
                                { offset: 1, color: 'rgba(245, 158, 11, 0)' }
                              ])
                            }
                          }],
                          tooltip: {
                            trigger: 'axis',
                            backgroundColor: '#1f2937',
                            borderColor: '#f59e0b',
                            borderRadius: 8,
                            textStyle: { color: '#fff' }
                          }
                        }}
                        style={{ height: '300px', width: '100%' }}
                      />
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
                      <ReactECharts
                        option={{
                          backgroundColor: 'transparent',
                          grid: {
                            left: '3%',
                            right: '4%',
                            bottom: '3%',
                            containLabel: true
                          },
                          xAxis: {
                            type: 'category',
                            data: performanceByPair.map(d => d.pair),
                            axisLine: { lineStyle: { color: '#666' } },
                            axisLabel: { color: '#666' }
                          },
                          yAxis: {
                            type: 'value',
                            axisLine: { lineStyle: { color: '#666' } },
                            axisLabel: { color: '#666' }
                          },
                          series: [{
                            data: performanceByPair.map(d => d.profit),
                            type: 'bar',
                            itemStyle: { color: '#3b82f6' },
                            barWidth: '60%'
                          }],
                          tooltip: {
                            trigger: 'axis',
                            backgroundColor: '#1f2937',
                            borderColor: '#3b82f6',
                            borderRadius: 8,
                            textStyle: { color: '#fff' }
                          }
                        }}
                        style={{ height: '300px', width: '100%' }}
                      />
                    </motion.div>
                  </div>
                )}

                {/* � All Trades Table */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4"
                >
                  <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-amber-500" />
                    All Trades
                  </h3>
                  
                  {/* Filters Bar */}
                  <div className="mb-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4">
                    <div className="flex flex-wrap gap-4 items-center mb-4">
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

                      <button
                        onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                        className="flex items-center gap-2 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/30 rounded-lg px-4 py-2 text-amber-400 hover:text-amber-300 transition-all"
                      >
                        <Filter className="w-4 h-4" />
                        Advanced Filters
                        {showAdvancedFilters ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>

                      <button
                        onClick={() => {
                          // Export filtered trades to CSV
                          const headers = ['ID', 'Pair', 'Asset Type', 'Order Type', 'Entry Price', 'Exit Price', 'Lot Size', 'P&L USD', 'P&L Pips', 'R:R', 'Status', 'Entry Time', 'Exit Time', 'Strategy', 'Session', 'Trend', 'Tags', 'Notes'];
                          const csvContent = [
                            headers.join(','),
                            ...filteredTrades.map(trade => [
                              trade.id,
                              `"${trade.pair_ticker}"`,
                              `"${trade.asset_type}"`,
                              `"${trade.order_type}"`,
                              trade.entry_price || '',
                              trade.exit_price || '',
                              trade.lot_size,
                              trade.profit_loss_usd || '',
                              trade.profit_loss_pips || '',
                              trade.risk_reward_ratio,
                              `"${trade.status}"`,
                              `"${trade.entry_time}"`,
                              `"${trade.exit_time || ''}"`,
                              `"${trade.strategy || ''}"`,
                              `"${trade.trading_session || ''}"`,
                              `"${trade.market_trend || ''}"`,
                              `"${trade.tags || ''}"`,
                              `"${trade.notes || ''}"`
                            ].join(','))
                          ].join('\n');
                          
                          const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
                          const link = document.createElement('a');
                          const url = URL.createObjectURL(blob);
                          link.setAttribute('href', url);
                          link.setAttribute('download', `trades_export_${new Date().toISOString().split('T')[0]}.csv`);
                          link.style.visibility = 'hidden';
                          document.body.appendChild(link);
                          link.click();
                          document.body.removeChild(link);
                          
                          toast.success('Trades exported successfully!');
                        }}
                        className="flex items-center gap-2 bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/30 rounded-lg px-4 py-2 text-emerald-400 hover:text-emerald-300 transition-all"
                      >
                        <Download className="w-4 h-4" />
                        Export CSV
                      </button>

                      <div className="relative">
                        <button
                          onClick={() => setShowKeyboardShortcuts(!showKeyboardShortcuts)}
                          className="flex items-center gap-2 bg-gray-500/20 hover:bg-gray-500/30 border border-gray-500/30 rounded-lg px-3 py-2 text-gray-400 hover:text-gray-300 transition-all"
                          title="Keyboard Shortcuts"
                        >
                          <Keyboard className="w-4 h-4" />
                        </button>
                        
                        {showKeyboardShortcuts && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="absolute right-0 top-12 bg-black/90 backdrop-blur-sm border border-white/20 rounded-lg p-4 z-50 min-w-64 keyboard-shortcuts"
                          >
                            <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
                              <Keyboard className="w-4 h-4" />
                              Keyboard Shortcuts
                            </h4>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span className="text-gray-400">New Trade</span>
                                <kbd className="bg-white/10 px-2 py-1 rounded text-xs">Ctrl+N</kbd>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-400">Save Changes</span>
                                <kbd className="bg-white/10 px-2 py-1 rounded text-xs">Ctrl+S</kbd>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-400">Focus Search</span>
                                <kbd className="bg-white/10 px-2 py-1 rounded text-xs">Ctrl+/</kbd>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-400">Close Modals</span>
                                <kbd className="bg-white/10 px-2 py-1 rounded text-xs">Esc</kbd>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </div>

                      <div className="ml-auto text-gray-400">
                        {filteredTrades.length} trades
                      </div>
                    </div>

                    {/* Advanced Filters */}
                    {showAdvancedFilters && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="border-t border-white/10 pt-4 mt-4 space-y-4"
                      >
                        {/* Date Range */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm text-gray-400 mb-1">From Date</label>
                            <input
                              type="date"
                              value={dateFrom}
                              onChange={(e) => setDateFrom(e.target.value)}
                              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:border-amber-500 focus:outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-sm text-gray-400 mb-1">To Date</label>
                            <input
                              type="date"
                              value={dateTo}
                              onChange={(e) => setDateTo(e.target.value)}
                              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:border-amber-500 focus:outline-none"
                            />
                          </div>
                        </div>

                        {/* P&L Range */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm text-gray-400 mb-1">Min P&L ($)</label>
                            <input
                              type="number"
                              placeholder="-1000"
                              value={minPL}
                              onChange={(e) => setMinPL(e.target.value)}
                              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:border-amber-500 focus:outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-sm text-gray-400 mb-1">Max P&L ($)</label>
                            <input
                              type="number"
                              placeholder="1000"
                              value={maxPL}
                              onChange={(e) => setMaxPL(e.target.value)}
                              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:border-amber-500 focus:outline-none"
                            />
                          </div>
                        </div>

                        {/* Risk/Reward Range */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm text-gray-400 mb-1">Min R:R</label>
                            <input
                              type="number"
                              step="0.1"
                              placeholder="1.0"
                              value={minRR}
                              onChange={(e) => setMinRR(e.target.value)}
                              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:border-amber-500 focus:outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-sm text-gray-400 mb-1">Max R:R</label>
                            <input
                              type="number"
                              step="0.1"
                              placeholder="5.0"
                              value={maxRR}
                              onChange={(e) => setMaxRR(e.target.value)}
                              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:border-amber-500 focus:outline-none"
                            />
                          </div>
                        </div>

                        {/* Multi-select filters */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                          {/* Asset Types */}
                          <div>
                            <label className="block text-sm text-gray-400 mb-2">Asset Types</label>
                            <div className="space-y-1">
                              {['Forex', 'Crypto', 'Stocks', 'Commodities', 'Indices'].map(type => (
                                <label key={type} className="flex items-center gap-2 text-sm">
                                  <input
                                    type="checkbox"
                                    checked={selectedAssetTypes.includes(type)}
                                    onChange={(e) => {
                                      if (e.target.checked) {
                                        setSelectedAssetTypes([...selectedAssetTypes, type]);
                                      } else {
                                        setSelectedAssetTypes(selectedAssetTypes.filter(t => t !== type));
                                      }
                                    }}
                                    className="rounded border-white/20 text-amber-500 focus:ring-amber-500"
                                  />
                                  {type}
                                </label>
                              ))}
                            </div>
                          </div>

                          {/* Trading Sessions */}
                          <div>
                            <label className="block text-sm text-gray-400 mb-2">Sessions</label>
                            <div className="space-y-1">
                              {['London', 'New York', 'Tokyo', 'Sydney', 'Asia'].map(session => (
                                <label key={session} className="flex items-center gap-2 text-sm">
                                  <input
                                    type="checkbox"
                                    checked={selectedSessions.includes(session)}
                                    onChange={(e) => {
                                      if (e.target.checked) {
                                        setSelectedSessions([...selectedSessions, session]);
                                      } else {
                                        setSelectedSessions(selectedSessions.filter(s => s !== session));
                                      }
                                    }}
                                    className="rounded border-white/20 text-amber-500 focus:ring-amber-500"
                                  />
                                  {session}
                                </label>
                              ))}
                            </div>
                          </div>

                          {/* Market Trends */}
                          <div>
                            <label className="block text-sm text-gray-400 mb-2">Trends</label>
                            <div className="space-y-1">
                              {['Bullish', 'Bearish', 'Sideways', 'Volatile'].map(trend => (
                                <label key={trend} className="flex items-center gap-2 text-sm">
                                  <input
                                    type="checkbox"
                                    checked={selectedTrends.includes(trend)}
                                    onChange={(e) => {
                                      if (e.target.checked) {
                                        setSelectedTrends([...selectedTrends, trend]);
                                      } else {
                                        setSelectedTrends(selectedTrends.filter(t => t !== trend));
                                      }
                                    }}
                                    className="rounded border-white/20 text-amber-500 focus:ring-amber-500"
                                  />
                                  {trend}
                                </label>
                              ))}
                            </div>
                          </div>

                          {/* Strategies - Dynamic from trades */}
                          <div>
                            <label className="block text-sm text-gray-400 mb-2">Strategies</label>
                            <div className="space-y-1 max-h-32 overflow-y-auto">
                              {Array.from(new Set(trades.map(t => t.strategy).filter(Boolean))).map(strategy => (
                                <label key={strategy} className="flex items-center gap-2 text-sm">
                                  <input
                                    type="checkbox"
                                    checked={selectedStrategies.includes(strategy!)}
                                    onChange={(e) => {
                                      if (e.target.checked) {
                                        setSelectedStrategies([...selectedStrategies, strategy!]);
                                      } else {
                                        setSelectedStrategies(selectedStrategies.filter(s => s !== strategy));
                                      }
                                    }}
                                    className="rounded border-white/20 text-amber-500 focus:ring-amber-500"
                                  />
                                  {strategy}
                                </label>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Tags - Dynamic from trades */}
                        <div>
                          <label className="block text-sm text-gray-400 mb-2">Tags</label>
                          <div className="flex flex-wrap gap-2">
                            {Array.from(new Set(trades.flatMap(t => t.tags ? t.tags.split(',').map(tag => tag.trim()) : []))).map(tag => (
                              <button
                                key={tag}
                                onClick={() => {
                                  if (selectedTags.includes(tag)) {
                                    setSelectedTags(selectedTags.filter(t => t !== tag));
                                  } else {
                                    setSelectedTags([...selectedTags, tag]);
                                  }
                                }}
                                className={`px-3 py-1 rounded-full text-sm transition-all ${
                                  selectedTags.includes(tag)
                                    ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                                    : 'bg-white/5 text-gray-400 border border-white/10 hover:border-amber-500/30'
                                }`}
                              >
                                {tag}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Clear Filters */}
                        <div className="flex justify-end">
                          <button
                            onClick={() => {
                              setDateFrom('');
                              setDateTo('');
                              setSelectedTags([]);
                              setSelectedStrategies([]);
                              setSelectedSessions([]);
                              setSelectedTrends([]);
                              setSelectedAssetTypes([]);
                              setMinPL('');
                              setMaxPL('');
                              setMinRR('');
                              setMaxRR('');
                            }}
                            className="text-gray-400 hover:text-white transition-colors text-sm underline"
                          >
                            Clear all advanced filters
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </div>
                  
                  {/* Trade Cards Grid */}
                  <div className="grid grid-cols-5 gap-2">
                    {(() => {
                      // Calculate pagination
                      const totalPages = Math.ceil(filteredTrades.length / tradesPerPage);
                      const startIndex = (currentPage - 1) * tradesPerPage;
                      const endIndex = startIndex + tradesPerPage;
                      const currentTrades = filteredTrades.slice(startIndex, endIndex);
                      
                      return currentTrades.map((trade, index) => {
                        const isWin = (trade.profit_loss_usd || 0) > 0;
                        const isLoss = (trade.profit_loss_usd || 0) < 0;
                        const isOpen = trade.status === 'open';
                        
                        return (
                          <motion.div
                            key={trade.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className={`relative group bg-white/5 backdrop-blur-sm border rounded-lg overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl cursor-pointer ${
                              isWin 
                                ? 'border-emerald-500/30 hover:border-emerald-400/50 bg-gradient-to-br from-emerald-500/5 to-transparent' 
                                : isLoss 
                                ? 'border-red-500/30 hover:border-red-400/50 bg-gradient-to-br from-red-500/5 to-transparent'
                                : 'border-blue-500/30 hover:border-blue-400/50 bg-gradient-to-br from-blue-500/5 to-transparent'
                            }`}
                            onClick={() => {
                              setSelectedTrade(trade);
                              initializeEditForm(trade);
                              setShowEditModal(true);
                            }}
                            onContextMenu={(e) => {
                              e.preventDefault();
                              setTradeToDelete(trade.id);
                              setShowDeleteConfirm(true);
                            }}
                          >
                            {/* Action Buttons - Appear on Hover */}
                            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10 flex gap-1">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedTrade(trade);
                                  initializeEditForm(trade);
                                  setShowEditModal(true);
                                }}
                                className="bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 hover:text-amber-300 p-1.5 rounded-md transition-all"
                                title="Edit Trade"
                              >
                                <Settings className="w-3 h-3" />
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setTradeToDelete(trade.id);
                                  setShowDeleteConfirm(true);
                                }}
                                className="bg-red-500/20 hover:bg-red-500/30 text-red-400 hover:text-red-300 p-1.5 rounded-md transition-all"
                                title="Delete Trade"
                              >
                                <XCircle className="w-3 h-3" />
                              </button>
                            </div>
                          >
                            {/* Card Header */}
                            <div className={`px-3 py-2 border-b ${
                              isWin ? 'border-emerald-500/20 bg-emerald-500/10' : 
                              isLoss ? 'border-red-500/20 bg-red-500/10' :
                              'border-blue-500/20 bg-blue-500/10'
                            }`}>
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-1">
                                  <span className="text-xs font-mono text-gray-400">#{filteredTrades.length - (startIndex + index)}</span>
                                  <span className={`px-1.5 py-0.5 rounded text-xs font-semibold ${
                                    trade.order_type === 'Buy' 
                                      ? 'bg-emerald-500/20 text-emerald-400' 
                                      : 'bg-red-500/20 text-red-400'
                                  }`}>
                                    {trade.order_type}
                                  </span>
                                </div>
                                <span className={`px-1.5 py-0.5 rounded text-xs font-semibold ${
                                  isOpen 
                                    ? 'bg-blue-500/20 text-blue-400' 
                                    : isWin 
                                    ? 'bg-emerald-500/20 text-emerald-400'
                                    : 'bg-red-500/20 text-red-400'
                                }`}>
                                  {isOpen ? 'OPEN' : isWin ? 'WIN' : 'LOSS'}
                                </span>
                              </div>
                            </div>

                            {/* Card Content */}
                            <div className="p-3 space-y-2">
                              {/* Pair and Asset Type */}
                              <div>
                                <div className="font-bold text-white text-sm">{trade.pair_ticker}</div>
                                <div className="text-xs text-gray-400">{trade.asset_type}</div>
                              </div>

                              {/* P/L and Pips */}
                              <div className="flex items-center justify-between">
                                <div>
                                  <div className="text-xs text-gray-400">P/L</div>
                                  <div className={`font-bold text-sm ${
                                    isWin ? 'text-emerald-400' : isLoss ? 'text-red-400' : 'text-blue-400'
                                  }`}>
                                    {trade.profit_loss_usd !== null && trade.profit_loss_usd !== undefined 
                                      ? `${trade.profit_loss_usd >= 0 ? '+' : ''}$${trade.profit_loss_usd.toFixed(2)}`
                                      : '-'
                                    }
                                  </div>
                                </div>
                                <div className="text-right">
                                  <div className="text-xs text-gray-400">Pips</div>
                                  <div className={`font-semibold text-sm ${
                                    (trade.profit_loss_pips || 0) >= 0 ? 'text-emerald-400' : 'text-red-400'
                                  }`}>
                                    {trade.profit_loss_pips !== null && trade.profit_loss_pips !== undefined 
                                      ? `${trade.profit_loss_pips >= 0 ? '+' : ''}${trade.profit_loss_pips.toFixed(1)}`
                                      : '-'
                                    }
                                  </div>
                                </div>
                              </div>

                              {/* Mini Screenshot */}
                              <div className="aspect-video bg-black/20 rounded border border-white/10 overflow-hidden">
                                {trade.image_url ? (
                                  <div className="relative w-full h-full cursor-pointer" onClick={(e) => {
                                    e.stopPropagation();
                                    window.open(trade.image_url, '_blank');
                                  }}>
                                    <Image 
                                      src={trade.image_url} 
                                      alt="Trade screenshot"
                                      fill
                                      className="object-cover"
                                    />
                                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                      <Eye className="w-4 h-4 text-white" />
                                    </div>
                                  </div>
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center">
                                    <ImageIcon className="w-6 h-6 text-gray-500" />
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Hover Details Tooltip */}
                            <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-50">
                              <div className="bg-black/95 backdrop-blur-sm border border-white/20 rounded-lg p-4 shadow-2xl min-w-72 max-w-xs">
                                <div className="space-y-3 text-sm">
                                  <div className="text-center border-b border-white/10 pb-2 mb-3">
                                    <div className="font-bold text-white text-base">{trade.pair_ticker}</div>
                                    <div className="text-xs text-gray-400">{trade.asset_type} • {trade.order_type}</div>
                                  </div>
                                  
                                  <div className="grid grid-cols-2 gap-3">
                                    <div>
                                      <span className="text-gray-400 text-xs block">Entry Price</span>
                                      <span className="text-white font-mono text-sm">{trade.entry_price ? trade.entry_price.toFixed(5) : '-'}</span>
                                    </div>
                                    <div>
                                      <span className="text-gray-400 text-xs block">Exit Price</span>
                                      <span className="text-white font-mono text-sm">{trade.exit_price ? trade.exit_price.toFixed(5) : '-'}</span>
                                    </div>
                                    <div>
                                      <span className="text-gray-400 text-xs block">Lot Size</span>
                                      <span className="text-white text-sm">{trade.lot_size || '-'}</span>
                                    </div>
                                    <div>
                                      <span className="text-gray-400 text-xs block">Risk:Reward</span>
                                      <span className="text-white text-sm">{trade.risk_reward_ratio ? `1:${trade.risk_reward_ratio.toFixed(1)}` : '-'}</span>
                                    </div>
                                  </div>

                                  <div className="border-t border-white/10 pt-3 space-y-2">
                                    <div className="flex justify-between">
                                      <span className="text-gray-400">Date:</span>
                                      <span className="text-white text-sm">{format(new Date(trade.entry_time), 'MMM dd, yyyy HH:mm')}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-gray-400">Session:</span>
                                      <span className="text-white text-sm">{trade.trading_session || '-'}</span>
                                    </div>
                                    {trade.strategy && (
                                      <div className="flex justify-between">
                                        <span className="text-gray-400">Strategy:</span>
                                        <span className="text-white text-sm">{trade.strategy}</span>
                                      </div>
                                    )}
                                    {trade.market_trend && (
                                      <div className="flex justify-between">
                                        <span className="text-gray-400">Trend:</span>
                                        <span className="text-white text-sm">{trade.market_trend}</span>
                                      </div>
                                    )}
                                    {trade.tags && (
                                      <div className="flex justify-between">
                                        <span className="text-gray-400">Tags:</span>
                                        <span className="text-white text-sm">{trade.tags}</span>
                                      </div>
                                    )}
                                  </div>

                                  {trade.notes && (
                                    <div className="border-t border-white/10 pt-3">
                                      <span className="text-gray-400 block mb-2 text-xs">Notes:</span>
                                      <span className="text-white text-sm leading-relaxed">{trade.notes}</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        );
                      });
                    })()}
                  </div>

                  {/* Pagination Controls */}
                  {filteredTrades.length > tradesPerPage && (
                    <div className="flex items-center justify-center mt-8 space-x-2">
                      <button
                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                        disabled={currentPage === 1}
                        className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/20 rounded-lg text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                      >
                        <ChevronUp className="w-4 h-4 rotate-[-90deg]" />
                      </button>
                      
                      <div className="flex items-center space-x-1">
                        {Array.from({ length: Math.ceil(filteredTrades.length / tradesPerPage) }, (_, i) => i + 1)
                          .filter(page => {
                            const totalPages = Math.ceil(filteredTrades.length / tradesPerPage);
                            // Show first page, last page, current page, and pages around current
                            return page === 1 || 
                                   page === totalPages || 
                                   (page >= currentPage - 1 && page <= currentPage + 1);
                          })
                          .map((page, index, array) => (
                            <React.Fragment key={page}>
                              {index > 0 && array[index - 1] !== page - 1 && (
                                <span className="px-2 text-gray-500">...</span>
                              )}
                              <button
                                onClick={() => setCurrentPage(page)}
                                className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                                  currentPage === page
                                    ? 'bg-amber-500 text-black'
                                    : 'bg-white/5 hover:bg-white/10 border border-white/20 text-white'
                                }`}
                              >
                                {page}
                              </button>
                            </React.Fragment>
                          ))}
                      </div>
                      
                      <button
                        onClick={() => setCurrentPage(prev => Math.min(Math.ceil(filteredTrades.length / tradesPerPage), prev + 1))}
                        disabled={currentPage === Math.ceil(filteredTrades.length / tradesPerPage)}
                        className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/20 rounded-lg text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                      >
                        <ChevronUp className="w-4 h-4 rotate-90" />
                      </button>
                    </div>
                  )}
                </motion.div>
              </motion.div>
            )}

            {/* � ANALYTICS VIEW - The Ultimate Trading Intelligence Platform */}
            {activeView === 'analytics' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
                className="space-y-8"
              >
                {/* 🎯 HERO ANALYTICS DASHBOARD */}
                <motion.div
                  initial={{ opacity: 0, y: -30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="relative overflow-hidden bg-gradient-to-br from-slate-900/50 via-black to-slate-900/50 backdrop-blur-xl border border-white/10 rounded-3xl p-8"
                >
                  {/* Animated Background */}
                  <div className="absolute inset-0 bg-gradient-to-r from-amber-500/5 via-transparent to-blue-500/5 animate-pulse"></div>
                  <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl animate-pulse"></div>
                  <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>

                  <div className="relative z-10">
                    {/* Header */}
                    <div className="text-center mb-8">
                      <motion.h2
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-4xl md:text-5xl font-black bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-600 bg-clip-text text-transparent mb-4"
                      >
                        🧠 AI Trading Intelligence
                      </motion.h2>
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="text-xl text-gray-300 max-w-3xl mx-auto"
                      >
                        Beyond Notion. Beyond Excel. The most advanced trading analytics platform ever created.
                        Powered by AI, driven by data, designed for mastery.
                      </motion.p>
                    </div>

                    {/* Key Metrics Hero Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                      {/* Net P&L with AI Insight */}
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.4 }}
                        className="group relative bg-gradient-to-br from-emerald-500/20 via-black to-emerald-500/10 backdrop-blur-xl border border-emerald-500/30 rounded-2xl p-6 hover:border-emerald-500/60 transition-all hover:scale-105 hover:shadow-2xl hover:shadow-emerald-500/20"
                      >
                        <div className="absolute top-0 right-0 w-20 h-20 bg-emerald-500/20 rounded-full blur-xl group-hover:bg-emerald-500/30 transition-all"></div>
                        <div className="relative">
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-sm font-semibold text-emerald-300">Net P&L</span>
                            <div className="flex items-center gap-1">
                              <Brain className="w-4 h-4 text-emerald-400" />
                              <span className="text-xs text-emerald-400">AI</span>
                            </div>
                          </div>
                          <div className={`text-3xl font-black mb-2 ${stats.net_profit_usd >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                            ${Math.abs(stats.net_profit_usd || 0).toLocaleString()}
                          </div>
                          <div className="text-xs text-gray-400 mb-2">
                            {stats.net_profit_usd >= 0 ? '📈 Profitable' : '📉 Needs Work'}
                          </div>
                          <div className="text-xs text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-full">
                            💡 AI: {stats.net_profit_usd >= 0 ? 'Great start! Keep it up.' : 'Focus on risk management.'}
                          </div>
                        </div>
                      </motion.div>

                      {/* Win Rate with Performance Indicator */}
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.5 }}
                        className="group relative bg-gradient-to-br from-amber-500/20 via-black to-amber-500/10 backdrop-blur-xl border border-amber-500/30 rounded-2xl p-6 hover:border-amber-500/60 transition-all hover:scale-105 hover:shadow-2xl hover:shadow-amber-500/20"
                      >
                        <div className="absolute top-0 right-0 w-20 h-20 bg-amber-500/20 rounded-full blur-xl group-hover:bg-amber-500/30 transition-all"></div>
                        <div className="relative">
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-sm font-semibold text-amber-300">Win Rate</span>
                            <Target className="w-5 h-5 text-amber-400" />
                          </div>
                          <div className="text-3xl font-black text-amber-400 mb-2">
                            {stats.win_rate?.toFixed(1)}%
                          </div>
                          <div className="w-full bg-gray-700 rounded-full h-2 mb-2">
                            <div
                              className="bg-gradient-to-r from-amber-500 to-yellow-500 h-2 rounded-full transition-all duration-1000"
                              style={{ width: `${Math.min(stats.win_rate || 0, 100)}%` }}
                            ></div>
                          </div>
                          <div className="text-xs text-amber-400 bg-amber-500/10 px-2 py-1 rounded-full">
                            🎯 {stats.win_rate >= 60 ? 'Elite Level' : stats.win_rate >= 50 ? 'Good' : 'Needs Improvement'}
                          </div>
                        </div>
                      </motion.div>

                      {/* Risk Score with AI Analysis */}
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.6 }}
                        className="group relative bg-gradient-to-br from-red-500/20 via-black to-red-500/10 backdrop-blur-xl border border-red-500/30 rounded-2xl p-6 hover:border-red-500/60 transition-all hover:scale-105 hover:shadow-2xl hover:shadow-red-500/20"
                      >
                        <div className="absolute top-0 right-0 w-20 h-20 bg-red-500/20 rounded-full blur-xl group-hover:bg-red-500/30 transition-all"></div>
                        <div className="relative">
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-sm font-semibold text-red-300">Risk Score</span>
                            <Shield className="w-5 h-5 text-red-400" />
                          </div>
                          <div className="text-3xl font-black text-red-400 mb-2">
                            {Math.min(Math.round((advancedMetrics?.maxDrawdown || 0) / (stats.net_profit_usd || 1) * 100), 100)}%
                          </div>
                          <div className="text-xs text-gray-400 mb-2">
                            Max Drawdown: ${(advancedMetrics?.maxDrawdown || 0).toFixed(0)}
                          </div>
                          <div className="text-xs text-red-400 bg-red-500/10 px-2 py-1 rounded-full">
                            ⚠️ {Math.min(Math.round((advancedMetrics?.maxDrawdown || 0) / (stats.net_profit_usd || 1) * 100), 100) <= 20 ? 'Low Risk' : 'High Risk'}
                          </div>
                        </div>
                      </motion.div>

                      {/* AI Confidence Score */}
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.7 }}
                        className="group relative bg-gradient-to-br from-purple-500/20 via-black to-purple-500/10 backdrop-blur-xl border border-purple-500/30 rounded-2xl p-6 hover:border-purple-500/60 transition-all hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/20"
                      >
                        <div className="absolute top-0 right-0 w-20 h-20 bg-purple-500/20 rounded-full blur-xl group-hover:bg-purple-500/30 transition-all"></div>
                        <div className="relative">
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-sm font-semibold text-purple-300">AI Confidence</span>
                            <Brain className="w-5 h-5 text-purple-400" />
                          </div>
                          <div className="text-3xl font-black text-purple-400 mb-2">
                            {Math.min(Math.round((stats.total_trades || 0) / 10 * 10), 100)}%
                          </div>
                          <div className="text-xs text-gray-400 mb-2">
                            Based on {stats.total_trades} trades
                          </div>
                          <div className="text-xs text-purple-400 bg-purple-500/10 px-2 py-1 rounded-full">
                            🤖 {stats.total_trades >= 100 ? 'High Confidence' : 'Building Data'}
                          </div>
                        </div>
                      </motion.div>
                    </div>

                    {/* AI Insights Bar */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.8 }}
                      className="bg-gradient-to-r from-amber-500/10 via-blue-500/10 to-purple-500/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6"
                    >
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-10 h-10 bg-gradient-to-r from-amber-500 to-purple-500 rounded-full flex items-center justify-center">
                          <Sparkles className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-white">AI Trading Insights</h3>
                          <p className="text-sm text-gray-400">Real-time analysis powered by advanced algorithms</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-black/30 rounded-xl p-4">
                          <div className="text-sm text-amber-400 font-semibold mb-1">🎯 Best Performing Pair</div>
                          <div className="text-lg font-bold text-white">
                            {performanceByPair.length > 0 ? performanceByPair[0]?.pair : 'N/A'}
                          </div>
                          <div className="text-xs text-gray-400">
                            {performanceByPair.length > 0 ? `$${performanceByPair[0]?.profit?.toFixed(2)}` : ''}
                          </div>
                        </div>

                        <div className="bg-black/30 rounded-xl p-4">
                          <div className="text-sm text-blue-400 font-semibold mb-1">⏰ Best Trading Session</div>
                          <div className="text-lg font-bold text-white">
                            {performanceBySession.length > 0 ? performanceBySession[0]?.session : 'N/A'}
                          </div>
                          <div className="text-xs text-gray-400">
                            {performanceBySession.length > 0 ? `${performanceBySession[0]?.winRate?.toFixed(1)}% WR` : ''}
                          </div>
                        </div>

                        <div className="bg-black/30 rounded-xl p-4">
                          <div className="text-sm text-purple-400 font-semibold mb-1">📈 Improvement Area</div>
                          <div className="text-lg font-bold text-white">
                            {stats.win_rate < 50 ? 'Win Rate' : (advancedMetrics?.maxDrawdown ?? 0) > Math.abs(stats.net_profit_usd) * 0.3 ? 'Risk Management' : 'Strategy'}
                          </div>
                          <div className="text-xs text-gray-400">
                            Focus on this to improve
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </motion.div>

                {/* 🧩 INTERACTIVE DASHBOARD BUILDER */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8"
                >
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-2xl font-bold text-white mb-2">🎨 Custom Dashboard</h3>
                      <p className="text-gray-400">View your trading analytics and performance metrics</p>
                    </div>
                  </div>

                  {/* Dashboard Grid */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                    {/* Risk Heatmap Widget */}
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.3 }}
                      className="bg-gradient-to-br from-red-500/10 to-black backdrop-blur-xl border border-red-500/20 rounded-2xl p-6 hover:border-red-500/40 transition-all hover:scale-105 group"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-lg font-bold text-red-300 flex items-center gap-2">
                          <Zap className="w-5 h-5" />
                          Risk Heatmap
                        </h4>
                        <GripVertical className="w-5 h-5 text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity cursor-move" />
                      </div>

                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-400">Max Drawdown</span>
                          <span className="text-sm font-semibold text-red-400">
                            ${(advancedMetrics?.maxDrawdown || 0).toFixed(2)}
                          </span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-red-500 to-red-600 h-2 rounded-full"
                            style={{ width: `${Math.min((advancedMetrics?.maxDrawdown || 0) / 1000 * 100, 100)}%` }}
                          ></div>
                        </div>

                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-400">Risk/Reward Ratio</span>
                          <span className="text-sm font-semibold text-amber-400">
                            1:{((advancedMetrics?.avgWin || 0) / (Math.abs(advancedMetrics?.avgLoss || 1))).toFixed(2)}
                          </span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-amber-500 to-yellow-500 h-2 rounded-full"
                            style={{ width: `${Math.min(((advancedMetrics?.avgWin || 0) / (Math.abs(advancedMetrics?.avgLoss || 1))) * 20, 100)}%` }}
                          ></div>
                        </div>
                      </div>

                      <div className="mt-4 p-3 bg-red-500/10 rounded-xl">
                        <div className="text-xs text-red-400 font-semibold">⚠️ Risk Assessment</div>
                        <div className="text-sm text-gray-300 mt-1">
                          {(advancedMetrics?.maxDrawdown || 0) > 500 ? 'High risk - Consider reducing position sizes' : 'Risk levels acceptable'}
                        </div>
                      </div>
                    </motion.div>

                    {/* Performance Timeline Widget */}
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.4 }}
                      className="bg-gradient-to-br from-emerald-500/10 to-black backdrop-blur-xl border border-emerald-500/20 rounded-2xl p-6 hover:border-emerald-500/40 transition-all hover:scale-105 group"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-lg font-bold text-emerald-300 flex items-center gap-2">
                          <TrendingUp className="w-5 h-5" />
                          Performance Timeline
                        </h4>
                        <GripVertical className="w-5 h-5 text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity cursor-move" />
                      </div>

                      <div className="space-y-4">
                        {/* Milestones */}
                        <div className="space-y-3">
                          <div className="flex items-center gap-3">
                            <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                            <div className="flex-1">
                              <div className="text-sm font-semibold text-white">First Profit</div>
                              <div className="text-xs text-gray-400">Started your journey</div>
                            </div>
                            <div className="text-xs text-emerald-400">✅</div>
                          </div>

                          <div className={`flex items-center gap-3 ${stats.total_trades >= 10 ? '' : 'opacity-50'}`}>
                            <div className={`w-3 h-3 rounded-full ${stats.total_trades >= 10 ? 'bg-amber-500' : 'bg-gray-600'}`}></div>
                            <div className="flex-1">
                              <div className="text-sm font-semibold text-white">10 Trades</div>
                              <div className="text-xs text-gray-400">Building experience</div>
                            </div>
                            <div className="text-xs text-amber-400">{stats.total_trades >= 10 ? '✅' : '🔄'}</div>
                          </div>

                          <div className={`flex items-center gap-3 ${stats.win_rate >= 50 ? '' : 'opacity-50'}`}>
                            <div className={`w-3 h-3 rounded-full ${stats.win_rate >= 50 ? 'bg-purple-500' : 'bg-gray-600'}`}></div>
                            <div className="flex-1">
                              <div className="text-sm font-semibold text-white">50% Win Rate</div>
                              <div className="text-xs text-gray-400">Consistent profitability</div>
                            </div>
                            <div className="text-xs text-purple-400">{stats.win_rate >= 50 ? '✅' : '🔄'}</div>
                          </div>

                          <div className={`flex items-center gap-3 ${stats.net_profit_usd >= 1000 ? '' : 'opacity-50'}`}>
                            <div className={`w-3 h-3 rounded-full ${stats.net_profit_usd >= 1000 ? 'bg-blue-500' : 'bg-gray-600'}`}></div>
                            <div className="flex-1">
                              <div className="text-sm font-semibold text-white">$1K Profit</div>
                              <div className="text-xs text-gray-400">Financial milestone</div>
                            </div>
                            <div className="text-xs text-blue-400">{stats.net_profit_usd >= 1000 ? '✅' : '🔄'}</div>
                          </div>
                        </div>
                      </div>
                    </motion.div>

                    {/* AI Strategy Recommendations Widget */}
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.5 }}
                      className="bg-gradient-to-br from-purple-500/10 to-black backdrop-blur-xl border border-purple-500/20 rounded-2xl p-6 hover:border-purple-500/40 transition-all hover:scale-105 group"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-lg font-bold text-purple-300 flex items-center gap-2">
                          <Brain className="w-5 h-5" />
                          AI Recommendations
                        </h4>
                        <GripVertical className="w-5 h-5 text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity cursor-move" />
                      </div>

                      <div className="space-y-4">
                        <div className="p-3 bg-purple-500/10 rounded-xl border border-purple-500/20">
                          <div className="text-sm font-semibold text-purple-300 mb-1">🎯 Focus Strategy</div>
                          <div className="text-sm text-gray-300">
                            {stats.win_rate < 50 ? 'Improve entry timing and risk management' :
                             (advancedMetrics?.maxDrawdown ?? 0) > Math.abs(stats.net_profit_usd) * 0.3 ? 'Reduce position sizes during losses' :
                             'Scale up successful strategies'}
                          </div>
                        </div>

                        <div className="p-3 bg-amber-500/10 rounded-xl border border-amber-500/20">
                          <div className="text-sm font-semibold text-amber-300 mb-1">⏰ Best Trading Time</div>
                          <div className="text-sm text-gray-300">
                            {performanceBySession.length > 0 ? `${performanceBySession[0]?.session} session (${performanceBySession[0]?.winRate?.toFixed(1)}% win rate)` : 'Collect more data'}
                          </div>
                        </div>

                        <div className="p-3 bg-blue-500/10 rounded-xl border border-blue-500/20">
                          <div className="text-sm font-semibold text-blue-300 mb-1">💡 Next Goal</div>
                          <div className="text-sm text-gray-300">
                            {stats.total_trades < 50 ? `Complete ${50 - stats.total_trades} more trades for better analysis` :
                             stats.win_rate < 60 ? 'Reach 60% win rate' :
                             'Maintain consistency and scale profits'}
                          </div>
                        </div>
                      </div>
                    </motion.div>

                    {/* Correlation Matrix Widget */}
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.6 }}
                      className="bg-gradient-to-br from-blue-500/10 to-black backdrop-blur-xl border border-blue-500/20 rounded-2xl p-6 hover:border-blue-500/40 transition-all hover:scale-105 group lg:col-span-2"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-lg font-bold text-blue-300 flex items-center gap-2">
                          <BarChart3 className="w-5 h-5" />
                          Market Correlation Analysis
                        </h4>
                        <GripVertical className="w-5 h-5 text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity cursor-move" />
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {performanceByPair.slice(0, 8).map((pair, index) => (
                          <motion.div
                            key={pair.pair}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.1 * index }}
                            className="bg-black/30 rounded-xl p-4 text-center hover:bg-black/50 transition-all"
                          >
                            <div className="text-sm font-semibold text-white mb-1">{pair.pair}</div>
                            <div className={`text-lg font-bold ${pair.profit >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                              ${pair.profit?.toFixed(0)}
                            </div>
                            <div className="text-xs text-gray-400">
                              {pair.profit >= 0 ? '↗️ Bullish' : '↘️ Bearish'}
                            </div>
                          </motion.div>
                        ))}
                      </div>

                      <div className="mt-4 p-3 bg-blue-500/10 rounded-xl">
                        <div className="text-xs text-blue-400 font-semibold">📊 Correlation Insights</div>
                        <div className="text-sm text-gray-300 mt-1">
                          {performanceByPair.filter(p => p.profit > 0).length > performanceByPair.filter(p => p.profit < 0).length ?
                           'Majority of pairs showing positive performance' :
                           'Mixed performance across pairs - diversify strategy'}
                        </div>
                      </div>
                    </motion.div>

                    {/* Psychological Analysis Widget */}
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.7 }}
                      className="bg-gradient-to-br from-amber-500/10 to-black backdrop-blur-xl border border-amber-500/20 rounded-2xl p-6 hover:border-amber-500/40 transition-all hover:scale-105 group"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-lg font-bold text-amber-300 flex items-center gap-2">
                          <Heart className="w-5 h-5" />
                          Trading Psychology
                        </h4>
                        <GripVertical className="w-5 h-5 text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity cursor-move" />
                      </div>

                      <div className="space-y-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-amber-400 mb-1">
                            {advancedMetrics?.maxLossStreak ? Math.min(advancedMetrics.maxLossStreak * 10, 100) : 0}%
                          </div>
                          <div className="text-xs text-gray-400">Mental Resilience Score</div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-400">Discipline</span>
                            <span className="text-amber-400">{stats.total_trades >= 50 ? 'High' : 'Building'}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-400">Patience</span>
                            <span className="text-amber-400">{(advancedMetrics?.maxLossStreak ?? 0) <= 3 ? 'Excellent' : 'Needs Work'}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-400">Confidence</span>
                            <span className="text-amber-400">{stats.win_rate >= 50 ? 'Strong' : 'Developing'}</span>
                          </div>
                        </div>

                        <div className="p-3 bg-amber-500/10 rounded-xl">
                          <div className="text-xs text-amber-400 font-semibold">💭 Psychological Tip</div>
                          <div className="text-sm text-gray-300 mt-1">
                            {(advancedMetrics?.maxLossStreak ?? 0) > 5 ? 'Work on cutting losses early' :
                             stats.win_rate < 40 ? 'Focus on quality over quantity' :
                             'Maintain your winning mindset'}
                          </div>
                        </div>
                      </div>
                    </motion.div>

                    {/* Achievement System Widget */}
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.8 }}
                      className="bg-gradient-to-br from-purple-500/10 to-black backdrop-blur-xl border border-purple-500/20 rounded-2xl p-6 hover:border-purple-500/40 transition-all hover:scale-105 group"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-lg font-bold text-purple-300 flex items-center gap-2">
                          <Trophy className="w-5 h-5" />
                          Achievements
                        </h4>
                        <GripVertical className="w-5 h-5 text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity cursor-move" />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className={`p-3 rounded-xl text-center ${stats.total_trades >= 1 ? 'bg-emerald-500/20 border border-emerald-500/30' : 'bg-gray-700/30'}`}>
                          <div className="text-lg mb-1">🎯</div>
                          <div className="text-xs font-semibold text-white">First Trade</div>
                          <div className="text-xs text-gray-400">{stats.total_trades >= 1 ? 'Unlocked' : 'Locked'}</div>
                        </div>

                        <div className={`p-3 rounded-xl text-center ${stats.total_trades >= 10 ? 'bg-amber-500/20 border border-amber-500/30' : 'bg-gray-700/30'}`}>
                          <div className="text-lg mb-1">🔥</div>
                          <div className="text-xs font-semibold text-white">10 Trades</div>
                          <div className="text-xs text-gray-400">{stats.total_trades >= 10 ? 'Unlocked' : 'Locked'}</div>
                        </div>

                        <div className={`p-3 rounded-xl text-center ${stats.win_rate >= 50 ? 'bg-blue-500/20 border border-blue-500/30' : 'bg-gray-700/30'}`}>
                          <div className="text-lg mb-1">🏆</div>
                          <div className="text-xs font-semibold text-white">50% Win Rate</div>
                          <div className="text-xs text-gray-400">{stats.win_rate >= 50 ? 'Unlocked' : 'Locked'}</div>
                        </div>

                        <div className={`p-3 rounded-xl text-center ${stats.net_profit_usd >= 100 ? 'bg-purple-500/20 border border-purple-500/30' : 'bg-gray-700/30'}`}>
                          <div className="text-lg mb-1">💰</div>
                          <div className="text-xs font-semibold text-white">$100 Profit</div>
                          <div className="text-xs text-gray-400">{stats.net_profit_usd >= 100 ? 'Unlocked' : 'Locked'}</div>
                        </div>
                      </div>

                      <div className="mt-4 text-center">
                        <div className="text-sm text-gray-400">
                          {Math.round((stats.total_trades >= 1 ? 1 : 0) +
                                     (stats.total_trades >= 10 ? 1 : 0) +
                                     (stats.win_rate >= 50 ? 1 : 0) +
                                     (stats.net_profit_usd >= 100 ? 1 : 0))}/4 Achievements
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </motion.div>

                {/* 🤖 AI INSIGHTS ENGINE */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-gradient-to-br from-slate-900/50 to-black backdrop-blur-xl border border-white/10 rounded-3xl p-8"
                >
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center">
                      <Brain className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-white">AI Insights Engine</h3>
                      <p className="text-gray-400">Advanced pattern recognition and predictive analytics</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Pattern Recognition */}
                    <div className="space-y-4">
                      <h4 className="text-lg font-semibold text-purple-300 mb-4">🔍 Pattern Recognition</h4>

                      <div className="bg-black/30 rounded-2xl p-6">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-8 h-8 bg-emerald-500/20 rounded-full flex items-center justify-center">
                            <TrendingUp className="w-4 h-4 text-emerald-400" />
                          </div>
                          <div>
                            <div className="text-sm font-semibold text-emerald-300">Winning Pattern Detected</div>
                            <div className="text-xs text-gray-400">Based on your last 10 trades</div>
                          </div>
                        </div>
                        <div className="text-sm text-gray-300 mb-3">
                          You perform best when trading {performanceBySession.length > 0 ? performanceBySession[0]?.session.toLowerCase() : 'specific sessions'} sessions with proper risk management.
                        </div>
                        <div className="flex gap-2">
                          <span className="px-2 py-1 bg-emerald-500/20 text-emerald-300 text-xs rounded-full">+{performanceBySession[0]?.winRate?.toFixed(1)}% WR</span>
                          <span className="px-2 py-1 bg-blue-500/20 text-blue-300 text-xs rounded-full">Consistent</span>
                        </div>
                      </div>

                      <div className="bg-black/30 rounded-2xl p-6">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-8 h-8 bg-amber-500/20 rounded-full flex items-center justify-center">
                            <AlertTriangle className="w-4 h-4 text-amber-400" />
                          </div>
                          <div>
                            <div className="text-sm font-semibold text-amber-300">Risk Alert</div>
                            <div className="text-xs text-gray-400">Potential issue detected</div>
                          </div>
                        </div>
                        <div className="text-sm text-gray-300 mb-3">
                          {(advancedMetrics?.maxLossStreak ?? 0) > 3 ? `You've had ${advancedMetrics?.maxLossStreak ?? 0} consecutive losses. Consider taking a break.` :
                           (advancedMetrics?.maxDrawdown ?? 0) > Math.abs(stats.net_profit_usd) * 0.5 ? 'Your drawdown is getting high. Reduce position sizes.' :
                           'Your risk management looks good. Keep it up!'}
                        </div>
                        <div className="flex gap-2">
                          <span className="px-2 py-1 bg-amber-500/20 text-amber-300 text-xs rounded-full">Monitor</span>
                          <span className="px-2 py-1 bg-red-500/20 text-red-300 text-xs rounded-full">High Priority</span>
                        </div>
                      </div>
                    </div>

                    {/* Predictive Analytics */}
                    <div className="space-y-4">
                      <h4 className="text-lg font-semibold text-blue-300 mb-4">🔮 Predictive Analytics</h4>

                      <div className="bg-black/30 rounded-2xl p-6">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center">
                            <Target className="w-4 h-4 text-blue-400" />
                          </div>
                          <div>
                            <div className="text-sm font-semibold text-blue-300">Next Month Projection</div>
                            <div className="text-xs text-gray-400">Based on current performance</div>
                          </div>
                        </div>
                        <div className="text-sm text-gray-300 mb-3">
                          If you maintain current performance, you could achieve ${(stats.net_profit_usd * 1.2).toFixed(2)} by next month.
                        </div>
                        <div className="flex gap-2">
                          <span className="px-2 py-1 bg-blue-500/20 text-blue-300 text-xs rounded-full">+20% Growth</span>
                          <span className="px-2 py-1 bg-emerald-500/20 text-emerald-300 text-xs rounded-full">Realistic</span>
                        </div>
                      </div>

                      <div className="bg-black/30 rounded-2xl p-6">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-8 h-8 bg-purple-500/20 rounded-full flex items-center justify-center">
                            <Lightbulb className="w-4 h-4 text-purple-400" />
                          </div>
                          <div>
                            <div className="text-sm font-semibold text-purple-300">Strategy Recommendation</div>
                            <div className="text-xs text-gray-400">AI-powered suggestion</div>
                          </div>
                        </div>
                        <div className="text-sm text-gray-300 mb-3">
                          {stats.win_rate < 50 ? 'Focus on improving your entry criteria. Consider paper trading new strategies.' :
                           (advancedMetrics?.maxDrawdown ?? 0) > Math.abs(stats.net_profit_usd) * 0.3 ? 'Implement stricter stop-loss rules to protect profits.' :
                           'Your strategy is working well. Consider scaling up your position sizes gradually.'}
                        </div>
                        <div className="flex gap-2">
                          <span className="px-2 py-1 bg-purple-500/20 text-purple-300 text-xs rounded-full">AI Suggested</span>
                          <span className="px-2 py-1 bg-amber-500/20 text-amber-300 text-xs rounded-full">High Impact</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* 📊 ADVANCED CHARTS & VISUALIZATIONS */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="grid grid-cols-1 xl:grid-cols-2 gap-8"
                >
                  {/* Enhanced Profit Curve */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                    className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8"
                  >
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                        <TrendingUp className="w-7 h-7 text-emerald-400" />
                        Enhanced Profit Curve
                      </h3>
                      <div className="flex gap-2">
                        <button className="p-2 bg-emerald-500/20 hover:bg-emerald-500/30 rounded-xl transition-all">
                          <BarChart3 className="w-4 h-4 text-emerald-400" />
                        </button>
                        <button className="p-2 bg-blue-500/20 hover:bg-blue-500/30 rounded-xl transition-all">
                          <LineChart className="w-4 h-4 text-blue-400" />
                        </button>
                      </div>
                    </div>

                    {profitCurveData.length > 0 ? (
                      <ReactECharts
                        option={{
                          backgroundColor: 'transparent',
                          grid: {
                            left: '5%',
                            right: '5%',
                            bottom: '10%',
                            top: '10%',
                            containLabel: true
                          },
                          tooltip: {
                            trigger: 'axis',
                            backgroundColor: 'rgba(17, 24, 39, 0.95)',
                            borderColor: '#10b981',
                            borderRadius: 16,
                            textStyle: { color: '#f9fafb', fontSize: 14 },
                            axisPointer: {
                              type: 'cross',
                              lineStyle: { color: '#6b7280', width: 1 }
                            },
                            formatter: (params: any) => {
                              const param = params[0];
                              return `<div style="font-weight: 600; color: #10b981; margin-bottom: 8px;">${param.name}</div>
                                <div style="display: flex; align-items: center; gap: 8px;">
                                  <div style="width: 8px; height: 8px; background: #10b981; border-radius: 50%;"></div>
                                  <span style="color: #d1d5db;">Profit:</span>
                                  <span style="color: #f9fafb; font-weight: 600;">$${param.value.toLocaleString()}</span>
                                </div>`;
                            }
                          },
                          xAxis: {
                            type: 'category',
                            data: profitCurveData.map(d => d.date),
                            axisLine: {
                              lineStyle: { color: '#374151', width: 2 }
                            },
                            axisLabel: {
                              color: '#9ca3af',
                              fontSize: 12,
                              fontWeight: '500'
                            },
                            axisTick: { show: false }
                          },
                          yAxis: {
                            type: 'value',
                            axisLine: {
                              lineStyle: { color: '#374151', width: 2 }
                            },
                            axisLabel: {
                              color: '#9ca3af',
                              fontSize: 12,
                              formatter: (value: any) => `$${value.toLocaleString()}`
                            },
                            splitLine: {
                              lineStyle: { color: '#1f2937', type: 'dashed' }
                            }
                          },
                          series: [{
                            data: profitCurveData.map(d => d.profit),
                            type: 'line',
                            smooth: true,
                            symbol: 'none',
                            lineStyle: {
                              color: '#10b981',
                              width: 4,
                              shadowColor: 'rgba(16, 185, 129, 0.5)',
                              shadowBlur: 10
                            },
                            areaStyle: {
                              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                                { offset: 0, color: 'rgba(16, 185, 129, 0.3)' },
                                { offset: 1, color: 'rgba(16, 185, 129, 0.05)' }
                              ])
                            }
                          }],
                          animationDuration: 2000,
                          animationEasing: 'cubicOut'
                        }}
                        style={{ height: '400px', width: '100%' }}
                      />
                    ) : (
                      <div className="h-64 flex items-center justify-center">
                        <div className="text-center">
                          <BarChart3 className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                          <p className="text-gray-400">No profit curve data available</p>
                        </div>
                      </div>
                    )}
                  </motion.div>

                  {/* Multi-Dimensional Performance Analysis */}
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 }}
                    className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8"
                  >
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                        <PieChart className="w-7 h-7 text-purple-400" />
                        Performance Matrix
                      </h3>
                      <div className="flex gap-2">
                        <button className="p-2 bg-purple-500/20 hover:bg-purple-500/30 rounded-xl transition-all">
                          <PieChart className="w-4 h-4 text-purple-400" />
                        </button>
                        <button className="p-2 bg-amber-500/20 hover:bg-amber-500/30 rounded-xl transition-all">
                          <BarChart3 className="w-4 h-4 text-amber-400" />
                        </button>
                      </div>
                    </div>

                    {performanceByPair.length > 0 ? (
                      <ReactECharts
                        option={{
                          backgroundColor: 'transparent',
                          tooltip: {
                            trigger: 'item',
                            backgroundColor: 'rgba(17, 24, 39, 0.95)',
                            borderColor: '#8b5cf6',
                            borderRadius: 16,
                            textStyle: { color: '#f9fafb', fontSize: 14 },
                            formatter: (params: any) => `
                              <div style="font-weight: 600; color: #8b5cf6; margin-bottom: 8px;">${params.name}</div>
                              <div style="display: flex; align-items: center; gap: 8px;">
                                <div style="width: 8px; height: 8px; background: ${params.color}; border-radius: 50%;"></div>
                                <span style="color: #d1d5db;">Profit:</span>
                                <span style="color: #f9fafb; font-weight: 600;">$${params.value.toLocaleString()}</span>
                              </div>
                              <div style="color: #9ca3af; font-size: 12px; margin-top: 4px;">${((params.value / performanceByPair.reduce((sum, p) => sum + Math.abs(p.profit), 0)) * 100).toFixed(1)}% of total</div>
                            `
                          },
                          legend: {
                            orient: 'vertical',
                            left: 'right',
                            top: 'center',
                            textStyle: {
                              color: '#9ca3af',
                              fontSize: 12
                            },
                            itemWidth: 12,
                            itemHeight: 12,
                            itemGap: 8
                          },
                          series: [{
                            name: 'Performance by Pair',
                            type: 'pie',
                            radius: ['40%', '70%'],
                            center: ['35%', '50%'],
                            avoidLabelOverlap: false,
                            emphasis: {
                              itemStyle: {
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                              }
                            },
                            label: {
                              show: false
                            },
                            labelLine: {
                              show: false
                            },
                            data: performanceByPair.slice(0, 8).map((pair, index) => ({
                              value: Math.abs(pair.profit),
                              name: pair.pair,
                              itemStyle: {
                                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                                  { offset: 0, color: pair.profit >= 0 ?
                                    ['#10b981', '#059669', '#047857', '#065f46'][index % 4] :
                                    ['#ef4444', '#dc2626', '#b91c1c', '#991b1b'][index % 4]
                                  },
                                  { offset: 1, color: pair.profit >= 0 ?
                                    ['#34d399', '#10b981', '#059669', '#047857'][index % 4] :
                                    ['#f87171', '#ef4444', '#dc2626', '#b91c1c'][index % 4]
                                  }
                                ]),
                                borderWidth: 2,
                                borderColor: '#1f2937',
                                shadowColor: 'rgba(0,0,0,0.3)',
                                shadowBlur: 5
                              }
                            }))
                          }],
                          animationDuration: 2000,
                          animationEasing: 'cubicOut'
                        }}
                        style={{ height: '400px', width: '100%' }}
                      />
                    ) : (
                      <div className="h-64 flex items-center justify-center">
                        <div className="text-center">
                          <PieChart className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                          <p className="text-gray-400">No performance data available</p>
                        </div>
                      </div>
                    )}
                  </motion.div>
                </motion.div>

                {/* 🎯 QUICK ACTIONS & EXPORT */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="bg-gradient-to-r from-amber-500/10 via-purple-500/10 to-blue-500/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8"
                >
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold text-white mb-2">🚀 Quick Actions</h3>
                    <p className="text-gray-400">Export, share, and take action on your insights</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 p-6 rounded-2xl text-white font-semibold transition-all shadow-lg shadow-emerald-500/25 flex flex-col items-center gap-3"
                      onClick={handleExportReport}
                    >
                      <Download className="w-8 h-8" />
                      <span>Export PDF Report</span>
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 p-6 rounded-2xl text-white font-semibold transition-all shadow-lg shadow-blue-500/25 flex flex-col items-center gap-3"
                      onClick={handleShareDashboard}
                    >
                      <Share2 className="w-8 h-8" />
                      <span>Share Dashboard</span>
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 p-6 rounded-2xl text-white font-semibold transition-all shadow-lg shadow-purple-500/25 flex flex-col items-center gap-3"
                      onClick={handleAIStrategy}
                    >
                      <Target className="w-8 h-8" />
                      <span>AI Strategy</span>
                    </motion.button>
                  </div>
                </motion.div>
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
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-3 mb-3">
                  <div className="flex flex-wrap gap-4 items-center mb-4">
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

                    <button
                      onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                      className="flex items-center gap-2 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/30 rounded-lg px-4 py-2 text-amber-400 hover:text-amber-300 transition-all"
                    >
                      <Filter className="w-4 h-4" />
                      Advanced Filters
                      {showAdvancedFilters ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>

                    <button
                      onClick={() => {
                        // Export filtered trades to CSV
                        const headers = ['ID', 'Pair', 'Asset Type', 'Order Type', 'Entry Price', 'Exit Price', 'Lot Size', 'P&L USD', 'P&L Pips', 'R:R', 'Status', 'Entry Time', 'Exit Time', 'Strategy', 'Session', 'Trend', 'Tags', 'Notes'];
                        const csvContent = [
                          headers.join(','),
                          ...filteredTrades.map(trade => [
                            trade.id,
                            `"${trade.pair_ticker}"`,
                            `"${trade.asset_type}"`,
                            `"${trade.order_type}"`,
                            trade.entry_price || '',
                            trade.exit_price || '',
                            trade.lot_size,
                            trade.profit_loss_usd || '',
                            trade.profit_loss_pips || '',
                            trade.risk_reward_ratio,
                            `"${trade.status}"`,
                            `"${trade.entry_time}"`,
                            `"${trade.exit_time || ''}"`,
                            `"${trade.strategy || ''}"`,
                            `"${trade.trading_session || ''}"`,
                            `"${trade.market_trend || ''}"`,
                            `"${trade.tags || ''}"`,
                            `"${trade.notes || ''}"`
                          ].join(','))
                        ].join('\n');
                        
                        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
                        const link = document.createElement('a');
                        const url = URL.createObjectURL(blob);
                        link.setAttribute('href', url);
                        link.setAttribute('download', `trades_export_${new Date().toISOString().split('T')[0]}.csv`);
                        link.style.visibility = 'hidden';
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                        
                        toast.success('Trades exported successfully!');
                      }}
                      className="flex items-center gap-2 bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/30 rounded-lg px-4 py-2 text-emerald-400 hover:text-emerald-300 transition-all"
                    >
                      <Download className="w-4 h-4" />
                      Export CSV
                    </button>

                    <div className="relative">
                      <button
                        onClick={() => setShowKeyboardShortcuts(!showKeyboardShortcuts)}
                        className="flex items-center gap-2 bg-gray-500/20 hover:bg-gray-500/30 border border-gray-500/30 rounded-lg px-3 py-2 text-gray-400 hover:text-gray-300 transition-all"
                        title="Keyboard Shortcuts"
                      >
                        <Keyboard className="w-4 h-4" />
                      </button>
                      
                      {showKeyboardShortcuts && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="absolute right-0 top-12 bg-black/90 backdrop-blur-sm border border-white/20 rounded-lg p-4 z-50 min-w-64 keyboard-shortcuts"
                        >
                          <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
                            <Keyboard className="w-4 h-4" />
                            Keyboard Shortcuts
                          </h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-400">New Trade</span>
                              <kbd className="bg-white/10 px-2 py-1 rounded text-xs">Ctrl+N</kbd>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400">Save Changes</span>
                              <kbd className="bg-white/10 px-2 py-1 rounded text-xs">Ctrl+S</kbd>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400">Focus Search</span>
                              <kbd className="bg-white/10 px-2 py-1 rounded text-xs">Ctrl+/</kbd>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400">Close Modals</span>
                              <kbd className="bg-white/10 px-2 py-1 rounded text-xs">Esc</kbd>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </div>

                    <div className="ml-auto text-gray-400">
                      {filteredTrades.length} trades
                    </div>
                  </div>

                  {/* Advanced Filters */}
                  {showAdvancedFilters && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="border-t border-white/10 pt-4 mt-4 space-y-4"
                    >
                      {/* Date Range */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm text-gray-400 mb-1">From Date</label>
                          <input
                            type="date"
                            value={dateFrom}
                            onChange={(e) => setDateFrom(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:border-amber-500 focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-gray-400 mb-1">To Date</label>
                          <input
                            type="date"
                            value={dateTo}
                            onChange={(e) => setDateTo(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:border-amber-500 focus:outline-none"
                          />
                        </div>
                      </div>

                      {/* P&L Range */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm text-gray-400 mb-1">Min P&L ($)</label>
                          <input
                            type="number"
                            placeholder="-1000"
                            value={minPL}
                            onChange={(e) => setMinPL(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:border-amber-500 focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-gray-400 mb-1">Max P&L ($)</label>
                          <input
                            type="number"
                            placeholder="1000"
                            value={maxPL}
                            onChange={(e) => setMaxPL(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:border-amber-500 focus:outline-none"
                          />
                        </div>
                      </div>

                      {/* Risk/Reward Range */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm text-gray-400 mb-1">Min R:R</label>
                          <input
                            type="number"
                            step="0.1"
                            placeholder="1.0"
                            value={minRR}
                            onChange={(e) => setMinRR(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:border-amber-500 focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-gray-400 mb-1">Max R:R</label>
                          <input
                            type="number"
                            step="0.1"
                            placeholder="5.0"
                            value={maxRR}
                            onChange={(e) => setMaxRR(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:border-amber-500 focus:outline-none"
                          />
                        </div>
                      </div>

                      {/* Multi-select filters */}
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {/* Asset Types */}
                        <div>
                          <label className="block text-sm text-gray-400 mb-2">Asset Types</label>
                          <div className="space-y-1">
                            {['Forex', 'Crypto', 'Stocks', 'Commodities', 'Indices'].map(type => (
                              <label key={type} className="flex items-center gap-2 text-sm">
                                <input
                                  type="checkbox"
                                  checked={selectedAssetTypes.includes(type)}
                                  onChange={(e) => {
                                    if (e.target.checked) {
                                      setSelectedAssetTypes([...selectedAssetTypes, type]);
                                    } else {
                                      setSelectedAssetTypes(selectedAssetTypes.filter(t => t !== type));
                                    }
                                  }}
                                  className="rounded border-white/20 text-amber-500 focus:ring-amber-500"
                                />
                                {type}
                              </label>
                            ))}
                          </div>
                        </div>

                        {/* Trading Sessions */}
                        <div>
                          <label className="block text-sm text-gray-400 mb-2">Sessions</label>
                          <div className="space-y-1">
                            {['London', 'New York', 'Tokyo', 'Sydney', 'Asia'].map(session => (
                              <label key={session} className="flex items-center gap-2 text-sm">
                                <input
                                  type="checkbox"
                                  checked={selectedSessions.includes(session)}
                                  onChange={(e) => {
                                    if (e.target.checked) {
                                      setSelectedSessions([...selectedSessions, session]);
                                    } else {
                                      setSelectedSessions(selectedSessions.filter(s => s !== session));
                                    }
                                  }}
                                  className="rounded border-white/20 text-amber-500 focus:ring-amber-500"
                                />
                                {session}
                              </label>
                            ))}
                          </div>
                        </div>

                        {/* Market Trends */}
                        <div>
                          <label className="block text-sm text-gray-400 mb-2">Trends</label>
                          <div className="space-y-1">
                            {['Bullish', 'Bearish', 'Sideways', 'Volatile'].map(trend => (
                              <label key={trend} className="flex items-center gap-2 text-sm">
                                <input
                                  type="checkbox"
                                  checked={selectedTrends.includes(trend)}
                                  onChange={(e) => {
                                    if (e.target.checked) {
                                      setSelectedTrends([...selectedTrends, trend]);
                                    } else {
                                      setSelectedTrends(selectedTrends.filter(t => t !== trend));
                                    }
                                  }}
                                  className="rounded border-white/20 text-amber-500 focus:ring-amber-500"
                                />
                                {trend}
                              </label>
                            ))}
                          </div>
                        </div>

                        {/* Strategies - Dynamic from trades */}
                        <div>
                          <label className="block text-sm text-gray-400 mb-2">Strategies</label>
                          <div className="space-y-1 max-h-32 overflow-y-auto">
                            {Array.from(new Set(trades.map(t => t.strategy).filter(Boolean))).map(strategy => (
                              <label key={strategy} className="flex items-center gap-2 text-sm">
                                <input
                                  type="checkbox"
                                  checked={selectedStrategies.includes(strategy!)}
                                  onChange={(e) => {
                                    if (e.target.checked) {
                                      setSelectedStrategies([...selectedStrategies, strategy!]);
                                    } else {
                                      setSelectedStrategies(selectedStrategies.filter(s => s !== strategy));
                                    }
                                  }}
                                  className="rounded border-white/20 text-amber-500 focus:ring-amber-500"
                                />
                                {strategy}
                              </label>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Tags - Dynamic from trades */}
                      <div>
                        <label className="block text-sm text-gray-400 mb-2">Tags</label>
                        <div className="flex flex-wrap gap-2">
                          {Array.from(new Set(trades.flatMap(t => t.tags ? t.tags.split(',').map(tag => tag.trim()) : []))).map(tag => (
                            <button
                              key={tag}
                              onClick={() => {
                                if (selectedTags.includes(tag)) {
                                  setSelectedTags(selectedTags.filter(t => t !== tag));
                                } else {
                                  setSelectedTags([...selectedTags, tag]);
                                }
                              }}
                              className={`px-3 py-1 rounded-full text-sm transition-all ${
                                selectedTags.includes(tag)
                                  ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                                  : 'bg-white/5 text-gray-400 border border-white/10 hover:border-amber-500/30'
                              }`}
                            >
                              {tag}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Clear Filters */}
                      <div className="flex justify-end">
                        <button
                          onClick={() => {
                            setDateFrom('');
                            setDateTo('');
                            setSelectedTags([]);
                            setSelectedStrategies([]);
                            setSelectedSessions([]);
                            setSelectedTrends([]);
                            setSelectedAssetTypes([]);
                            setMinPL('');
                            setMaxPL('');
                            setMinRR('');
                            setMaxRR('');
                          }}
                          className="text-gray-400 hover:text-white transition-colors text-sm underline"
                        >
                          Clear all advanced filters
                        </button>
                      </div>
                    </motion.div>
                  )}
                </div>

                {/* Trades Table */}
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gradient-to-r from-white/10 to-white/5 border-b border-white/10">
                        <tr>
                          <th className="px-3 py-2 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">#</th>
                          <th className="px-3 py-2 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Pair</th>
                          <th className="px-3 py-2 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Type</th>
                          <th className="px-3 py-2 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Entry</th>
                          <th className="px-3 py-2 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Exit</th>
                          <th className="px-3 py-2 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">P/L</th>
                          <th className="px-3 py-2 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Pips</th>
                          <th className="px-3 py-2 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">R:R</th>
                          <th className="px-3 py-2 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Status</th>
                          <th className="px-3 py-2 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Actions</th>
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
                            <td className="px-3 py-2 whitespace-nowrap">
                              <div className="text-gray-500 font-mono text-sm">#{filteredTrades.length - index}</div>
                            </td>
                            <td className="px-3 py-2 whitespace-nowrap">
                              <div className="font-bold text-white">{trade.pair_ticker}</div>
                              <div className="text-xs text-gray-500">{trade.asset_type}</div>
                            </td>
                            <td className="px-3 py-2 whitespace-nowrap">
                              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                trade.order_type === 'Buy' 
                                  ? 'bg-emerald-500/20 text-emerald-400' 
                                  : 'bg-red-500/20 text-red-400'
                              }`}>
                                {trade.order_type}
                              </span>
                            </td>
                            <td className="px-3 py-2 whitespace-nowrap text-gray-300">
                              {trade.entry_price ? trade.entry_price.toFixed(5) : '-'}
                            </td>
                            <td className="px-3 py-2 whitespace-nowrap text-gray-300">
                              {trade.exit_price ? trade.exit_price.toFixed(5) : '-'}
                            </td>
                            <td className="px-3 py-2 whitespace-nowrap">
                              {trade.profit_loss_usd !== undefined && trade.profit_loss_usd !== null && (
                                <span className={`font-bold ${
                                  trade.profit_loss_usd > 0 ? 'text-emerald-400' : 'text-red-400'
                                }`}>
                                  {trade.profit_loss_usd > 0 ? '+' : ''}${trade.profit_loss_usd.toFixed(2)}
                                </span>
                              )}
                            </td>
                            <td className="px-3 py-2 whitespace-nowrap">
                              {trade.profit_loss_pips !== undefined && trade.profit_loss_pips !== null && (
                                <span className={`font-semibold ${
                                  trade.profit_loss_pips > 0 ? 'text-emerald-400' : 'text-red-400'
                                }`}>
                                  {trade.profit_loss_pips > 0 ? '+' : ''}{trade.profit_loss_pips.toFixed(1)}
                                </span>
                              )}
                            </td>
                            <td className="px-3 py-2 whitespace-nowrap text-gray-300">
                              {trade.risk_reward_ratio ? `1:${trade.risk_reward_ratio.toFixed(1)}` : '-'}
                            </td>

                            <td className="px-3 py-2 whitespace-nowrap">
                              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                trade.status === 'open' 
                                  ? 'bg-blue-500/20 text-blue-400' 
                                  : (trade.profit_loss_usd || 0) > 0 
                                  ? 'bg-emerald-500/20 text-emerald-400'
                                  : 'bg-red-500/20 text-red-400'
                              }`}>
                                {trade.status === 'open' ? 'OPEN' : (trade.profit_loss_usd || 0) > 0 ? 'WIN' : 'LOSS'}
                              </span>
                            </td>
                            <td className="px-3 py-2 whitespace-nowrap">
                              <div className="flex gap-2">
                                <button
                                  onClick={() => {
                                    setSelectedTrade(trade);
                                    initializeEditForm(trade);
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

            {/* Demo Section - Professional Trading Examples */}
            <section className="bg-gradient-to-br from-slate-900/50 to-gray-900/30 rounded-2xl p-8 border border-amber-500/20 backdrop-blur-sm">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold mb-3 bg-gradient-to-r from-amber-400 to-yellow-500 bg-clip-text text-transparent">
                  Real Trading Performance
                </h2>
                <p className="text-gray-400 max-w-2xl mx-auto">
                  See how professional traders track their performance across multiple asset classes with precision and insight.
                </p>
              </div>

              <div className="bg-gray-900/60 backdrop-blur-xl rounded-xl border border-gray-700/50 overflow-hidden shadow-2xl">
                <div className="px-6 py-4 bg-gradient-to-r from-amber-500/10 to-transparent border-b border-gray-700/50">
                  <h3 className="text-lg font-semibold text-amber-400 flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    Sample Trading History
                  </h3>
                  <p className="text-sm text-gray-400">5 recent trades from a professional trader's journal</p>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-800/70">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">Asset</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">Type</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">Entry/Exit</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">Pips</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">P&L</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">R:R</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">Strategy</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">Result</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700/50">
                      {demoTrades.map((trade) => (
                        <tr key={trade.id} className="hover:bg-gray-800/40 transition-colors">
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <div className="font-semibold text-amber-400">{trade.pair}</div>
                              <span className="text-xs px-2 py-1 bg-gray-700/50 rounded text-gray-300">{trade.session}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                              trade.type === 'Buy' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'
                            }`}>
                              {trade.type}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm">
                            <div className="text-gray-300">{trade.entry}</div>
                            <div className="text-gray-500 text-xs">→ {trade.exit}</div>
                          </td>
                          <td className="px-4 py-3">
                            <span className={`font-mono text-sm ${trade.pips.startsWith('+') ? 'text-emerald-400' : 'text-red-400'}`}>
                              {trade.pips}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <span className={`font-semibold ${trade.pl.startsWith('+') ? 'text-emerald-400' : 'text-red-400'}`}>
                              {trade.pl}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm text-blue-400 font-mono">
                            {trade.rr}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-300">
                            {trade.strategy}
                          </td>
                          <td className="px-4 py-3">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                              trade.status === 'win' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'
                            }`}>
                              {trade.status.toUpperCase()}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="px-6 py-4 bg-gray-800/30 border-t border-gray-700/50">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-4">
                      <span className="text-gray-400">Win Rate:</span>
                      <span className="text-emerald-400 font-semibold">80%</span>
                      <span className="text-gray-400">Profit Factor:</span>
                      <span className="text-blue-400 font-semibold">2.8</span>
                      <span className="text-gray-400">Total P&L:</span>
                      <span className="text-emerald-400 font-semibold">+$2,511</span>
                    </div>
                    <div className="text-gray-500 text-xs">
                      Last updated: 2 hours ago
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Features Section - Compact Professional Design */}
            <section className="py-16">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600 bg-clip-text text-transparent">
                  Why Professional Traders Choose TamtechAI
                </h2>
                <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                  Built by traders, for traders. Eliminate guesswork with data-driven insights.
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="group bg-gradient-to-br from-emerald-500/10 via-gray-900/50 to-gray-900/80 backdrop-blur-xl border border-emerald-500/20 rounded-2xl p-6 hover:border-emerald-500/40 transition-all hover:scale-105 hover:shadow-2xl hover:shadow-emerald-500/10"
                >
                  <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center mb-4 group-hover:bg-emerald-500/30 transition-colors">
                    <Calculator className="w-6 h-6 text-emerald-400" />
                  </div>
                  <h3 className="text-lg font-bold text-emerald-300 mb-2">Auto-Calculations</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    Precision calculations for Forex (5 decimals), Gold (2 decimals), and Indices. No manual math required.
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="group bg-gradient-to-br from-blue-500/10 via-gray-900/50 to-gray-900/80 backdrop-blur-xl border border-blue-500/20 rounded-2xl p-6 hover:border-blue-500/40 transition-all hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/10"
                >
                  <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center mb-4 group-hover:bg-blue-500/30 transition-colors">
                    <Brain className="w-6 h-6 text-blue-400" />
                  </div>
                  <h3 className="text-lg font-bold text-blue-300 mb-2">AI Insights</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    Pattern recognition and performance analysis powered by advanced algorithms.
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="group bg-gradient-to-br from-purple-500/10 via-gray-900/50 to-gray-900/80 backdrop-blur-xl border border-purple-500/20 rounded-2xl p-6 hover:border-purple-500/40 transition-all hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/10"
                >
                  <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center mb-4 group-hover:bg-purple-500/30 transition-colors">
                    <TrendingUp className="w-6 h-6 text-purple-400" />
                  </div>
                  <h3 className="text-lg font-bold text-purple-300 mb-2">Performance Analytics</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    Win rates, profit factors, drawdown analysis, and session-based performance tracking.
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="group bg-gradient-to-br from-amber-500/10 via-gray-900/50 to-gray-900/80 backdrop-blur-xl border border-amber-500/20 rounded-2xl p-6 hover:border-amber-500/40 transition-all hover:scale-105 hover:shadow-2xl hover:shadow-amber-500/10"
                >
                  <div className="w-12 h-12 bg-amber-500/20 rounded-xl flex items-center justify-center mb-4 group-hover:bg-amber-500/30 transition-colors">
                    <Trophy className="w-6 h-6 text-amber-400" />
                  </div>
                  <h3 className="text-lg font-bold text-amber-300 mb-2">Gamification</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    Unlock achievements and milestones as you build your trading mastery.
                  </p>
                </motion.div>
              </div>
            </section>

            {/* How It Works - Compact Timeline */}
            <section className="py-16">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-4">Get Started in Minutes</h2>
                <p className="text-gray-400">Four simple steps to transform your trading</p>
              </div>

              <div className="max-w-4xl mx-auto">
                <div className="grid md:grid-cols-4 gap-8">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-center group"
                  >
                    <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-yellow-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform shadow-lg shadow-amber-500/25">
                      <UserPlus className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-lg font-bold mb-2 text-amber-400">1. Create Account</h3>
                    <p className="text-gray-400 text-sm">Free signup in 30 seconds</p>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-center group"
                  >
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform shadow-lg shadow-blue-500/25">
                      <Plus className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-lg font-bold mb-2 text-blue-400">2. Log Your Trade</h3>
                    <p className="text-gray-400 text-sm">Pair, entry, exit, lot size</p>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-center group"
                  >
                    <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-green-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform shadow-lg shadow-emerald-500/25">
                      <Zap className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-lg font-bold mb-2 text-emerald-400">3. Auto-Calculate</h3>
                    <p className="text-gray-400 text-sm">Pips, R:R, risk % done instantly</p>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="text-center group"
                  >
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform shadow-lg shadow-purple-500/25">
                      <Target className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-lg font-bold mb-2 text-purple-400">4. Analyze & Improve</h3>
                    <p className="text-gray-400 text-sm">Get AI insights, track progress</p>
                  </motion.div>
                </div>

                {/* Progress indicator */}
                <div className="mt-12 flex justify-center">
                  <div className="flex items-center gap-2 bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-full px-6 py-3">
                    <Clock className="w-4 h-4 text-amber-400" />
                    <span className="text-sm text-gray-300">Average setup time: <span className="text-amber-400 font-semibold">3 minutes</span></span>
                  </div>
                </div>
              </div>
            </section>

            {/* Professional Content Section */}
            <section className="py-16">
              <div className="max-w-5xl mx-auto">
                <div className="text-center mb-12">
                  <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600 bg-clip-text text-transparent">
                    Master Your Trading Psychology with Data-Driven Insights
                  </h2>
                  <p className="text-xl text-gray-400">
                    Transform emotional trading into systematic excellence
                  </p>
                </div>

                <div className="grid lg:grid-cols-2 gap-12 items-center">
                  <div className="space-y-6">
                    <div className="bg-gradient-to-br from-slate-900/50 to-gray-900/30 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 bg-amber-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Target className="w-5 h-5 text-amber-400" />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-amber-300 mb-2">Precision Calculations</h3>
                          <p className="text-gray-300 leading-relaxed">
                            Professional traders understand that consistency comes from meticulous record-keeping. TamtechAI automatically calculates pips, risk-reward ratios, and profit/loss with precision across all asset classes.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-slate-900/50 to-gray-900/30 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Brain className="w-5 h-5 text-blue-400" />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-blue-300 mb-2">AI-Powered Analysis</h3>
                          <p className="text-gray-300 leading-relaxed">
                            Unlike basic spreadsheets, our AI identifies patterns in your trading behavior, suggests improvements, and helps you optimize your strategy across different market sessions.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-slate-900/50 to-gray-900/30 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                          <TrendingUp className="w-5 h-5 text-emerald-400" />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-emerald-300 mb-2">Performance Mastery</h3>
                          <p className="text-gray-300 leading-relaxed">
                            Track your progress with professional metrics: Sharpe ratio, maximum drawdown, expectancy, and win rates. Know exactly when and how you perform best.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-gray-900/60 to-slate-900/40 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-8">
                    <h3 className="text-2xl font-bold text-center mb-6 text-amber-400">Trading Performance Dashboard</h3>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center p-3 bg-gray-800/50 rounded-lg">
                        <span className="text-gray-400">Win Rate</span>
                        <span className="text-emerald-400 font-bold text-lg">73.2%</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-gray-800/50 rounded-lg">
                        <span className="text-gray-400">Profit Factor</span>
                        <span className="text-blue-400 font-bold text-lg">2.8</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-gray-800/50 rounded-lg">
                        <span className="text-gray-400">Max Drawdown</span>
                        <span className="text-red-400 font-bold text-lg">12.4%</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-gray-800/50 rounded-lg">
                        <span className="text-gray-400">Total Trades</span>
                        <span className="text-purple-400 font-bold text-lg">247</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-gray-800/50 rounded-lg">
                        <span className="text-gray-400">Best Trading Session</span>
                        <span className="text-amber-400 font-bold text-lg">London Open</span>
                      </div>
                    </div>
                    <div className="mt-6 p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                      <p className="text-amber-300 text-sm text-center font-semibold">
                        📈 Average monthly return: +8.3%
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Final CTA - Professional & Compelling */}
            <section className="py-16">
              <div className="max-w-4xl mx-auto text-center">
                <div className="bg-gradient-to-br from-amber-500/10 via-yellow-500/5 to-amber-500/10 backdrop-blur-xl border border-amber-500/30 rounded-3xl p-12 shadow-2xl shadow-amber-500/10">
                  <div className="mb-8">
                    <h2 className="text-5xl font-bold mb-4 bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500 bg-clip-text text-transparent">
                      Ready to Transform Your Trading?
                    </h2>
                    <p className="text-xl text-gray-300 mb-6 max-w-2xl mx-auto">
                      Join thousands of professional traders who have eliminated guesswork and built consistent profitability with data-driven insights.
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
                    <button
                      onClick={() => {
                        setShowAuthModal(true);
                        setAuthMode("signup");
                      }}
                      className="group px-10 py-5 bg-gradient-to-r from-amber-500 via-amber-600 to-yellow-600 hover:from-amber-600 hover:via-amber-700 hover:to-yellow-700 rounded-2xl font-bold text-xl shadow-2xl shadow-amber-500/50 transition-all hover:scale-110 hover:shadow-amber-500/70 flex items-center gap-3"
                    >
                      <Rocket className="w-7 h-7 group-hover:animate-bounce" />
                      Start Free Today
                      <span className="text-sm opacity-90">(No Credit Card)</span>
                    </button>

                    <button
                      onClick={() => {
                        setShowAuthModal(true);
                        setAuthMode("login");
                      }}
                      className="px-10 py-5 bg-white/10 backdrop-blur-sm border-2 border-amber-500/40 hover:border-amber-500 rounded-2xl font-bold text-xl transition-all hover:scale-105 hover:bg-white/20"
                    >
                      Sign In to Dashboard
                    </button>
                  </div>

                  <div className="grid md:grid-cols-3 gap-6 text-center">
                    <div className="bg-black/20 rounded-xl p-4">
                      <div className="text-2xl font-bold text-emerald-400 mb-1">10,000+</div>
                      <div className="text-sm text-gray-400">Active Traders</div>
                    </div>
                    <div className="bg-black/20 rounded-xl p-4">
                      <div className="text-2xl font-bold text-blue-400 mb-1">$2.3M+</div>
                      <div className="text-sm text-gray-400">Profits Tracked</div>
                    </div>
                    <div className="bg-black/20 rounded-xl p-4">
                      <div className="text-2xl font-bold text-purple-400 mb-1">99.9%</div>
                      <div className="text-sm text-gray-400">Uptime</div>
                    </div>
                  </div>

                  <div className="mt-8 pt-8 border-t border-amber-500/20">
                    <p className="text-amber-300/80 text-sm">
                      ⚡ Setup takes 3 minutes • Free forever • No hidden fees • Cancel anytime
                    </p>
                  </div>
                </div>
              </div>
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

      {/* Achievements Modal */}
      <AnimatePresence>
        {showAchievements && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowAchievements(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gray-900 border border-amber-500/30 rounded-2xl p-8 max-w-4xl w-full max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-amber-400 to-yellow-500 bg-clip-text text-transparent">
                  🏆 Your Achievements
                </h2>
                <button
                  onClick={() => setShowAchievements(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  ✕
                </button>
              </div>

              <div className="mb-6 p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-300">Overall Progress</span>
                  <span className="text-amber-400 font-bold">{unlockedAchievements}/{totalAchievements}</span>
                </div>
                <div className="w-full bg-gray-800 rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-amber-500 to-yellow-500 h-3 rounded-full transition-all"
                    style={{ width: `${(unlockedAchievements / totalAchievements) * 100}%` }}
                  ></div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                {achievements.map((achievement, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`p-6 rounded-xl border-2 transition-all ${
                      achievement.unlocked
                        ? 'bg-gradient-to-br from-amber-500/20 to-yellow-500/20 border-amber-500/50'
                        : 'bg-gray-800/50 border-gray-700 grayscale'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className="text-4xl">{achievement.icon}</div>
                      <div className="flex-1">
                        <h3 className={`font-bold text-lg mb-1 ${
                          achievement.unlocked ? 'text-amber-400' : 'text-gray-500'
                        }`}>
                          {achievement.title}
                        </h3>
                        <p className="text-sm text-gray-400 mb-3">{achievement.description}</p>
                        
                        {achievement.unlocked ? (
                          <div className="flex items-center gap-2 text-emerald-400 text-sm font-semibold">
                            <span>✓</span> Unlocked!
                          </div>
                        ) : (
                          <div>
                            <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                              <span>Progress</span>
                              <span>{achievement.progress || 0}/{achievement.target || 0}</span>
                            </div>
                            <div className="w-full bg-gray-700 rounded-full h-2">
                              <div 
                                className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all"
                                style={{ width: `${((achievement.progress || 0) / (achievement.target || 1)) * 100}%` }}
                              ></div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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
                      const res = await fetch(`/api/journal/trades/${tradeToDelete}`, {
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
              className="bg-gradient-to-br from-gray-900 to-gray-800 border border-amber-500/30 rounded-xl max-w-4xl w-full p-6 my-8 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-amber-400">Edit Trade</h3>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="text-gray-400 hover:text-gray-300 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Tab Navigation */}
              <div className="flex gap-2 mb-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-1 w-fit">
                {[
                  { id: 'basics', label: 'Basics', icon: Target },
                  { id: 'strategy', label: 'Strategy', icon: TrendingUp },
                  { id: 'risk', label: 'Risk Mgmt', icon: FileText },
                  { id: 'notes', label: 'Notes', icon: FileText },
                  { id: 'screenshots', label: 'Screenshots', icon: ImageIcon }
                ].map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    onClick={() => setEditActiveSection(id)}
                    className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 ${
                      editActiveSection === id
                        ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-lg'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {label}
                  </button>
                ))}
              </div>

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
                  notes: editFormData.notes,
                  tags: editFormData.tags.join(','),
                  checklist: JSON.stringify(editFormData.checklist),
                  market_trend: editFormData.market_trend,
                  entry_time: editFormData.entry_time,
                  exit_time: editFormData.exit_time,
                  account_size_at_entry: editFormData.account_size_at_entry,
                  stop_loss: editFormData.stop_loss,
                  take_profit: editFormData.take_profit,
                  image_url: editFormData.image_url
                };

                try {
                  const res = await fetch(`/api/journal/trades/${selectedTrade.id}`, {
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
              }} className="space-y-6">

                {/* Basics Tab */}
                {editActiveSection === 'basics' && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-4"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs text-gray-400 mb-1 block">Asset Type</label>
                        <select 
                          name="asset_type" 
                          value={editFormData.asset_type}
                          onChange={(e) => setEditFormData({...editFormData, asset_type: e.target.value})}
                          className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:border-amber-500 focus:outline-none"
                        >
                          <option value="forex">Forex</option>
                          <option value="gold">Gold</option>
                          <option value="indices">Indices</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="text-xs text-gray-400 mb-1 block">Pair/Ticker</label>
                        <input 
                          name="pair_ticker" 
                          value={editFormData.pair_ticker}
                          onChange={(e) => setEditFormData({...editFormData, pair_ticker: e.target.value})}
                          required 
                          className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:border-amber-500 focus:outline-none" 
                        />
                      </div>

                      <div>
                        <label className="text-xs text-gray-400 mb-1 block">Order Type</label>
                        <select 
                          name="order_type" 
                          value={editFormData.order_type}
                          onChange={(e) => setEditFormData({...editFormData, order_type: e.target.value})}
                          className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:border-amber-500 focus:outline-none"
                        >
                          <option value="Buy">Buy</option>
                          <option value="Sell">Sell</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-xs text-gray-400 mb-1 block">Market Trend</label>
                        <select 
                          value={editFormData.market_trend}
                          onChange={(e) => setEditFormData({...editFormData, market_trend: e.target.value})}
                          className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:border-amber-500 focus:outline-none"
                        >
                          <option value="Bullish">Bullish</option>
                          <option value="Bearish">Bearish</option>
                          <option value="Sideways">Sideways</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-xs text-gray-400 mb-1 block">Entry Price</label>
                        <input 
                          name="entry_price" 
                          type="number" 
                          step="any" 
                          value={editFormData.entry_price}
                          onChange={(e) => setEditFormData({...editFormData, entry_price: parseFloat(e.target.value) || 0})}
                          required 
                          className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:border-amber-500 focus:outline-none" 
                        />
                      </div>

                      <div>
                        <label className="text-xs text-gray-400 mb-1 block">Exit Price</label>
                        <input 
                          name="exit_price" 
                          type="number" 
                          step="any" 
                          value={editFormData.exit_price || ''}
                          onChange={(e) => setEditFormData({...editFormData, exit_price: e.target.value ? parseFloat(e.target.value) : null})}
                          className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:border-amber-500 focus:outline-none" 
                        />
                      </div>

                      <div>
                        <label className="text-xs text-gray-400 mb-1 block">Lot Size</label>
                        <input 
                          name="lot_size" 
                          type="number" 
                          step="0.01" 
                          value={editFormData.lot_size}
                          onChange={(e) => setEditFormData({...editFormData, lot_size: parseFloat(e.target.value) || 0})}
                          required 
                          className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:border-amber-500 focus:outline-none" 
                        />
                      </div>

                      <div>
                        <label className="text-xs text-gray-400 mb-1 block">Risk:Reward Ratio</label>
                        <input 
                          name="risk_reward_ratio" 
                          type="number" 
                          step="0.1" 
                          value={editFormData.risk_reward_ratio}
                          onChange={(e) => setEditFormData({...editFormData, risk_reward_ratio: parseFloat(e.target.value) || 0})}
                          required 
                          className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:border-amber-500 focus:outline-none" 
                        />
                      </div>

                      <div>
                        <label className="text-xs text-gray-400 mb-1 block">Trading Session</label>
                        <select 
                          name="trading_session" 
                          value={editFormData.trading_session}
                          onChange={(e) => setEditFormData({...editFormData, trading_session: e.target.value})}
                          className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:border-amber-500 focus:outline-none"
                        >
                          <option value="">Select Session</option>
                          <option value="London">London</option>
                          <option value="New York">New York</option>
                          <option value="Tokyo">Tokyo</option>
                          <option value="Sydney">Sydney</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-xs text-gray-400 mb-1 block">Status</label>
                        <select 
                          name="status" 
                          value={editFormData.status}
                          onChange={(e) => setEditFormData({...editFormData, status: e.target.value})}
                          className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:border-amber-500 focus:outline-none"
                        >
                          <option value="open">Open</option>
                          <option value="closed">Closed</option>
                        </select>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Strategy Tab */}
                {editActiveSection === 'strategy' && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-4"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs text-gray-400 mb-1 block">Strategy</label>
                        <input 
                          name="strategy" 
                          value={editFormData.strategy}
                          onChange={(e) => setEditFormData({...editFormData, strategy: e.target.value})}
                          className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:border-amber-500 focus:outline-none" 
                        />
                      </div>

                      <div>
                        <label className="text-xs text-gray-400 mb-1 block">Account Size at Entry</label>
                        <input 
                          type="number" 
                          step="0.01" 
                          value={editFormData.account_size_at_entry}
                          onChange={(e) => setEditFormData({...editFormData, account_size_at_entry: parseFloat(e.target.value) || 0})}
                          className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:border-amber-500 focus:outline-none" 
                        />
                      </div>

                      <div>
                        <label className="text-xs text-gray-400 mb-1 block">Entry Time</label>
                        <input 
                          type="datetime-local" 
                          value={editFormData.entry_time}
                          onChange={(e) => setEditFormData({...editFormData, entry_time: e.target.value})}
                          className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:border-amber-500 focus:outline-none" 
                        />
                      </div>

                      <div>
                        <label className="text-xs text-gray-400 mb-1 block">Exit Time</label>
                        <input 
                          type="datetime-local" 
                          value={editFormData.exit_time || ''}
                          onChange={(e) => setEditFormData({...editFormData, exit_time: e.target.value || null})}
                          className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:border-amber-500 focus:outline-none" 
                        />
                      </div>
                    </div>

                    {/* Strategy Templates */}
                    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-sm font-semibold text-gray-300 flex items-center gap-2">
                          <Target className="w-4 h-4" />
                          Strategy Templates
                        </h4>
                        <button
                          type="button"
                          onClick={() => setEditShowTemplates(!editShowTemplates)}
                          className="text-xs text-amber-400 hover:text-amber-300"
                        >
                          {editShowTemplates ? 'Hide' : 'Show'} Templates
                        </button>
                      </div>
                      
                      {editShowTemplates && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {STRATEGY_TEMPLATES.map((template, index) => (
                            <button
                              key={index}
                              type="button"
                              onClick={() => {
                                setEditFormData({
                                  ...editFormData,
                                  strategy: template.strategy,
                                  notes: template.notes
                                });
                              }}
                              className="text-left bg-gray-800/50 border border-gray-700 rounded-lg p-3 hover:border-amber-500/50 transition-all"
                            >
                              <div className="font-semibold text-amber-400 text-sm mb-1">{template.name}</div>
                              <div className="text-xs text-gray-400">{template.strategy}</div>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}

                {/* Risk Management Tab */}
                {editActiveSection === 'risk' && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-4"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs text-gray-400 mb-1 block">Stop Loss</label>
                        <input 
                          type="number" 
                          step="any" 
                          value={editFormData.stop_loss}
                          onChange={(e) => setEditFormData({...editFormData, stop_loss: parseFloat(e.target.value) || 0})}
                          className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:border-amber-500 focus:outline-none" 
                        />
                      </div>

                      <div>
                        <label className="text-xs text-gray-400 mb-1 block">Take Profit</label>
                        <input 
                          type="number" 
                          step="any" 
                          value={editFormData.take_profit}
                          onChange={(e) => setEditFormData({...editFormData, take_profit: parseFloat(e.target.value) || 0})}
                          className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:border-amber-500 focus:outline-none" 
                        />
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4">
                      <h4 className="text-sm font-semibold text-gray-300 flex items-center gap-2 mb-3">
                        <Tag className="w-4 h-4" />
                        Tags
                      </h4>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {editFormData.tags.map((tag, index) => (
                          <span key={index} className="bg-amber-500/20 text-amber-400 px-2 py-1 rounded-full text-xs flex items-center gap-1">
                            {tag}
                            <button
                              type="button"
                              onClick={() => {
                                const newTags = editFormData.tags.filter((_, i) => i !== index);
                                setEditFormData({...editFormData, tags: newTags});
                              }}
                              className="hover:text-red-400"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </span>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={editNewTag}
                          onChange={(e) => setEditNewTag(e.target.value)}
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              if (editNewTag.trim()) {
                                setEditFormData({
                                  ...editFormData,
                                  tags: [...editFormData.tags, editNewTag.trim()]
                                });
                                setEditNewTag('');
                              }
                            }
                          }}
                          placeholder="Add tag..."
                          className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:border-amber-500 focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            if (editNewTag.trim()) {
                              setEditFormData({
                                ...editFormData,
                                tags: [...editFormData.tags, editNewTag.trim()]
                              });
                              setEditNewTag('');
                            }
                          }}
                          className="bg-amber-500 hover:bg-amber-600 text-white px-3 py-2 rounded-lg text-sm font-semibold transition-all"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Pre-Trade Checklist */}
                    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4">
                      <h4 className="text-sm font-semibold text-gray-300 flex items-center gap-2 mb-3">
                        <CheckSquare className="w-4 h-4" />
                        Pre-Trade Checklist
                      </h4>
                      <div className="space-y-2">
                        {editFormData.checklist.map((item, index) => (
                          <div key={item.id} className="flex items-center gap-3">
                            <input
                              type="checkbox"
                              checked={item.completed}
                              onChange={(e) => {
                                const newChecklist = [...editFormData.checklist];
                                newChecklist[index].completed = e.target.checked;
                                setEditFormData({...editFormData, checklist: newChecklist});
                              }}
                              className="w-4 h-4 text-amber-500 bg-gray-800 border-gray-700 rounded focus:ring-amber-500"
                            />
                            <input
                              type="text"
                              value={item.text}
                              onChange={(e) => {
                                const newChecklist = [...editFormData.checklist];
                                newChecklist[index].text = e.target.value;
                                setEditFormData({...editFormData, checklist: newChecklist});
                              }}
                              className="flex-1 bg-transparent border-none text-sm text-white focus:outline-none"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                const newChecklist = editFormData.checklist.filter((_, i) => i !== index);
                                setEditFormData({...editFormData, checklist: newChecklist});
                              }}
                              className="text-red-400 hover:text-red-300"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={() => {
                            const newChecklist = [...editFormData.checklist, {
                              id: Date.now().toString(),
                              text: 'New checklist item',
                              completed: false
                            }];
                            setEditFormData({...editFormData, checklist: newChecklist});
                          }}
                          className="text-amber-400 hover:text-amber-300 text-sm flex items-center gap-1"
                        >
                          <Plus className="w-4 h-4" />
                          Add Item
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Notes Tab */}
                {editActiveSection === 'notes' && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-4"
                  >
                    <div>
                      <label className="text-xs text-gray-400 mb-2 block">Trade Notes</label>
                      <RichTextEditor
                        value={editFormData.notes}
                        onChange={(value) => setEditFormData({...editFormData, notes: value})}
                        placeholder="Add detailed notes about this trade..."
                      />
                    </div>
                  </motion.div>
                )}

                {/* Screenshots Tab */}
                {editActiveSection === 'screenshots' && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-4"
                  >
                    <div>
                      <label className="text-xs text-gray-400 mb-2 block">Trade Screenshot</label>
                      <div className="space-y-4">
                        <div className="border-2 border-dashed border-gray-600 rounded-lg p-4 text-center hover:border-amber-500/50 transition-colors">
                          <ImageIcon className="w-6 h-6 text-gray-400 mx-auto mb-2" />
                          <p className="text-gray-400 text-sm mb-2">Upload a new screenshot</p>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={async (e) => {
                              const file = e.target.files?.[0];
                              if (!file) return;

                              // Check file size (5MB limit for base64 storage)
                              if (file.size > 5 * 1024 * 1024) {
                                toast.error('File too large. Maximum size is 5MB.');
                                return;
                              }

                              try {
                                const formDataUpload = new FormData();
                                formDataUpload.append('file', file);

                                const response = await fetch(`/api/journal/upload-image`, {
                                  method: 'POST',
                                  body: formDataUpload,
                                  credentials: 'include'
                                });

                                if (!response.ok) {
                                  const errorData = await response.json();
                                  throw new Error(errorData.detail || 'Upload failed');
                                }

                                const result = await response.json();
                                setEditFormData({...editFormData, image_url: result.image_url});
                                toast.success('Image uploaded successfully');
                              } catch (err) {
                                toast.error(err instanceof Error ? err.message : 'Upload failed');
                              }
                            }}
                            className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-amber-600 file:text-white hover:file:bg-amber-500 file:cursor-pointer"
                          />
                          <p className="text-xs text-gray-500 mt-2">Supported formats: PNG, JPG, JPEG, GIF, WebP (max 5MB)</p>
                        </div>
                        
                        {editFormData.image_url && (
                          <div className="bg-gray-800/30 rounded-lg p-4 border border-gray-700/50">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="text-sm font-medium text-white">Current Screenshot</h4>
                              <button
                                onClick={() => setEditFormData({...editFormData, image_url: ''})}
                                className="text-red-400 hover:text-red-300 text-xs"
                              >
                                Remove
                              </button>
                            </div>
                            <img
                              src={editFormData.image_url}
                              alt="Trade screenshot"
                              className="w-full max-h-64 object-contain rounded-lg border border-gray-600"
                              onError={(e) => {
                                e.currentTarget.style.display = 'none';
                                toast.error('Failed to load image');
                              }}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}

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
                    data-edit-save
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
