"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import AddTradeModal from '@/src/components/AddTradeModal';
import Link from 'next/link';
import Navbar from '@/src/components/Navbar';
import Footer from '@/src/components/Footer';
import { XCircle, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://tamtechaifinance-backend-production.up.railway.app';

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
      const res = await fetch(`${API_BASE}/journal/trades?limit=50`, {
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
                <div className="flex justify-center">
                  <button
                    onClick={() => {
                      setShowAuthModal(true);
                      setAuthMode("login");
                    }}
                    className="px-8 py-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 rounded-lg font-bold text-lg shadow-xl shadow-amber-500/30 transition-all hover:scale-105"
                  >
                    Start Free
                  </button>
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
              <div className="text-center py-20">
                <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-400">Loading your journal...</p>
              </div>
            ) : stats ? (
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
              <div className="text-center py-20">
                <p className="text-gray-400">Failed to load journal data. Please refresh.</p>
              </div>
            )}
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
    </>
  );
}
