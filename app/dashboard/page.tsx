"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  TrendingUp, TrendingDown, RefreshCw, Eye, Clock, 
  AlertTriangle, CheckCircle, XCircle, Zap, BarChart3, 
  User, CreditCard, ShieldCheck, ShieldAlert, Calendar,
  ArrowLeft, Activity, Brain, ChevronDown
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import toast from 'react-hot-toast';
import Navbar from "../../src/components/Navbar";
import Footer from "../../src/components/Footer";
import { useAuth } from "../../src/context/AuthContext";
import { useTranslation } from "../../src/context/TranslationContext";

const BASE_URL = typeof window !== 'undefined' ? '/api' : 'https://tamtechaifinance-backend-production.up.railway.app';

interface AnalysisItem {
  id: number;
  ticker: string;
  company_name: string;
  last_price: number;
  verdict: string;
  confidence_score: number;
  created_at: string;
  is_expired: boolean;
  hours_ago: number;
}

interface RefreshConfirmModalProps {
  ticker: string;
  onConfirm: () => void;
  onCancel: () => void;
}

function RefreshConfirmModal({ ticker, onConfirm, onCancel }: RefreshConfirmModalProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onCancel}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-gradient-to-br from-slate-900 via-slate-900 to-blue-900/20 border border-slate-700 rounded-2xl p-6 max-w-md w-full shadow-2xl"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600/30 to-blue-400/10 border border-blue-400/40 flex items-center justify-center">
            <Zap className="text-blue-400" size={24} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Instant Refresh</h3>
            <p className="text-slate-400 text-sm">Real-time AI Analysis</p>
          </div>
        </div>

        <div className="bg-blue-900/20 border border-blue-500/30 rounded-xl p-4 mb-4">
          <p className="text-slate-200 text-sm mb-2">
            Get a fresh AI analysis for <span className="font-bold text-blue-400">{ticker}</span> with:
          </p>
          <ul className="space-y-1 text-xs text-slate-300">
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-400" />
              Latest market price & fundamentals
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-400" />
              AI-powered financial analysis
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-400" />
              Updated verdict & confidence score
            </li>
          </ul>
        </div>

        <div className="bg-orange-900/20 border border-orange-500/30 rounded-xl p-3 mb-6">
          <p className="text-orange-200 text-sm flex items-center gap-2">
            <CreditCard className="w-4 h-4" />
            <span>This will deduct <strong>1 credit</strong> from your account</span>
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 bg-slate-700 hover:bg-slate-600 text-slate-200 font-bold py-3 rounded-xl transition"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-bold py-3 rounded-xl transition flex items-center justify-center gap-2"
          >
            <Zap size={16} />
            Refresh Now
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

function SkeletonLoader() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-slate-900/50 border border-slate-800 rounded-xl p-4 animate-pulse">
          <div className="flex items-center justify-between mb-3">
            <div className="h-6 w-20 bg-slate-700 rounded"></div>
            <div className="h-4 w-24 bg-slate-700 rounded"></div>
          </div>
          <div className="h-4 w-full bg-slate-700 rounded mb-2"></div>
          <div className="flex gap-2 mt-4">
            <div className="h-10 flex-1 bg-slate-700 rounded-lg"></div>
            <div className="h-10 flex-1 bg-slate-700 rounded-lg"></div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function DashboardPage() {
  const router = useRouter();
  const { user, credits, isLoggedIn, isVerified, updateCredits } = useAuth();
  const { t } = useTranslation();
  
  const [history, setHistory] = useState<AnalysisItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshingTicker, setRefreshingTicker] = useState<string | null>(null);
  const [showRefreshModal, setShowRefreshModal] = useState(false);
  const [selectedTicker, setSelectedTicker] = useState<string | null>(null);

  // Fetch analysis history
  useEffect(() => {
    if (!isLoggedIn) {
      router.push('/');
      return;
    }
    
    if (!isVerified) {
      toast.error("📧 Please verify your email to access your dashboard", { duration: 5000 });
      router.push('/');
      return;
    }

    fetchHistory();
  }, [isLoggedIn, isVerified]);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${BASE_URL}/dashboard/history`, {
        credentials: 'include',
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.detail || "Failed to load history");
      }

      const data = await res.json();
      setHistory(data.history || []);
    } catch (err: any) {
      console.error("History fetch error:", err);
      toast.error(err.message || "Failed to load analysis history");
    } finally {
      setLoading(false);
    }
  };

  const handleView = (ticker: string, isExpired: boolean) => {
    if (isExpired) {
      toast.error("⏰ This report has expired. Use Instant Refresh to get the latest analysis.", {
        duration: 4000,
        icon: "🔒"
      });
      return;
    }
    
    router.push(`/analysis/${ticker}`);
  };

  const handleRefreshClick = (ticker: string) => {
    setSelectedTicker(ticker);
    setShowRefreshModal(true);
  };

  const handleConfirmRefresh = async () => {
    if (!selectedTicker) return;

    setShowRefreshModal(false);
    setRefreshingTicker(selectedTicker);

    try {
      const res = await fetch(`${BASE_URL}/analyze/${selectedTicker}?force_refresh=true`, {
        credentials: 'include',
      });

      if (res.status === 402) {
        toast.error("❌ No credits left! Please purchase more credits.", { duration: 5000 });
        return;
      }

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.detail || "Refresh failed");
      }

      const data = await res.json();
      
      // Update credits
      if (data.credits_left !== undefined) {
        updateCredits(data.credits_left);
      }

      toast.success(`✅ ${selectedTicker} analysis refreshed successfully!`, { duration: 3000 });
      
      // Navigate to the updated analysis
      router.push(`/analysis/${selectedTicker}`);
      
      // Refresh the history list
      await fetchHistory();
      
    } catch (err: any) {
      console.error("Refresh error:", err);
      toast.error(err.message || "Failed to refresh analysis");
    } finally {
      setRefreshingTicker(null);
      setSelectedTicker(null);
    }
  };

  const getVerdictColor = (verdict: string) => {
    const v = verdict.toUpperCase();
    if (v.includes('BUY') || v.includes('STRONG BUY')) return 'text-green-400';
    if (v.includes('SELL') || v.includes('STRONG SELL')) return 'text-red-400';
    return 'text-yellow-400';
  };

  const getVerdictBg = (verdict: string) => {
    const v = verdict.toUpperCase();
    if (v.includes('BUY') || v.includes('STRONG BUY')) return 'bg-green-500/20 border-green-500/50';
    if (v.includes('SELL') || v.includes('STRONG SELL')) return 'bg-red-500/20 border-red-500/50';
    return 'bg-yellow-500/20 border-yellow-500/50';
  };

  if (!isLoggedIn) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#0b1121] text-white">
      <Navbar guestTrials={0} />
      
      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors group mb-4">
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </Link>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-3xl md:text-4xl font-black text-white mb-2">
              Your Dashboard
            </h1>
            <p className="text-slate-400">Track your AI stock analysis history</p>
          </motion.div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {/* Credits Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="bg-gradient-to-br from-blue-900/40 via-slate-900 to-blue-900/20 border border-blue-500/30 rounded-2xl p-6 shadow-xl"
          >
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-slate-400 text-sm uppercase tracking-wide font-bold">Available Credits</p>
                <p className="text-4xl font-black text-blue-400 mt-1">{credits}</p>
              </div>
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600/30 to-blue-400/10 border border-blue-400/40 flex items-center justify-center">
                <CreditCard className="text-blue-400" size={28} />
              </div>
            </div>
            <Link 
              href="/pricing"
              className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 text-sm font-bold transition"
            >
              Get More Credits →
            </Link>
          </motion.div>

          {/* Account Status Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className={`bg-gradient-to-br ${isVerified ? 'from-green-900/40 via-slate-900 to-green-900/20 border-green-500/30' : 'from-orange-900/40 via-slate-900 to-orange-900/20 border-orange-500/30'} border rounded-2xl p-6 shadow-xl`}
          >
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-slate-400 text-sm uppercase tracking-wide font-bold">Account Status</p>
                <p className={`text-xl font-black mt-1 ${isVerified ? 'text-green-400' : 'text-orange-400'}`}>
                  {isVerified ? 'Verified' : 'Unverified'}
                </p>
              </div>
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${isVerified ? 'from-green-600/30 to-green-400/10 border-green-400/40' : 'from-orange-600/30 to-orange-400/10 border-orange-400/40'} border flex items-center justify-center`}>
                {isVerified ? <ShieldCheck className="text-green-400" size={28} /> : <ShieldAlert className="text-orange-400" size={28} />}
              </div>
            </div>
            <p className="text-slate-300 text-sm">
              {user?.email}
            </p>
          </motion.div>
        </div>

        {/* Analysis History */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="bg-gradient-to-br from-slate-900 via-slate-900 to-purple-900/20 border border-slate-800 rounded-2xl p-6 shadow-2xl"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-black text-white">Analysis History</h2>
              <p className="text-slate-400 text-sm">Reports expire after 24 hours</p>
            </div>
            <button
              onClick={fetchHistory}
              disabled={loading}
              className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition disabled:opacity-50"
              title="Refresh history"
            >
              <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>

          {loading ? (
            <SkeletonLoader />
          ) : history.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-600/30 to-purple-400/10 border border-purple-400/40 flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="text-purple-400" size={36} />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">No Analysis Yet</h3>
              <p className="text-slate-400 mb-6 max-w-md mx-auto">
                Start your first AI-powered stock analysis to build your portfolio insights
              </p>
              <Link
                href="/#main-analyzer"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-bold py-3 px-6 rounded-xl transition shadow-lg"
              >
                <Brain size={20} />
                Start First Analysis
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Desktop Table */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-800">
                      <th className="text-left text-slate-400 text-xs uppercase tracking-wide font-bold py-3 px-4">Ticker</th>
                      <th className="text-left text-slate-400 text-xs uppercase tracking-wide font-bold py-3 px-4">Company</th>
                      <th className="text-left text-slate-400 text-xs uppercase tracking-wide font-bold py-3 px-4">Price</th>
                      <th className="text-left text-slate-400 text-xs uppercase tracking-wide font-bold py-3 px-4">Verdict</th>
                      <th className="text-left text-slate-400 text-xs uppercase tracking-wide font-bold py-3 px-4">Updated</th>
                      <th className="text-right text-slate-400 text-xs uppercase tracking-wide font-bold py-3 px-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {history.map((item) => (
                      <tr key={item.id} className="border-b border-slate-800/50 hover:bg-slate-800/30 transition">
                        <td className="py-4 px-4">
                          <span className="font-bold text-blue-400 text-lg font-mono">{item.ticker}</span>
                        </td>
                        <td className="py-4 px-4">
                          <span className="text-slate-300 text-sm">{item.company_name}</span>
                        </td>
                        <td className="py-4 px-4">
                          <span className="text-emerald-400 font-bold text-sm">${item.last_price.toFixed(2)}</span>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            <span className={`px-3 py-1 rounded-lg border text-xs font-bold ${getVerdictBg(item.verdict)} ${getVerdictColor(item.verdict)}`}>
                              {item.verdict}
                            </span>
                            <span className="text-slate-400 text-xs">{item.confidence_score}%</span>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-1.5 text-slate-400 text-xs">
                            <Clock size={14} />
                            {item.is_expired ? (
                              <span className="text-red-400 font-bold">Expired</span>
                            ) : (
                              <span>{item.hours_ago}h ago</span>
                            )}
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleView(item.ticker, item.is_expired)}
                              disabled={item.is_expired}
                              className={`px-4 py-2 rounded-lg font-bold text-sm transition flex items-center gap-2 ${
                                item.is_expired
                                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                                  : 'bg-blue-600 hover:bg-blue-500 text-white'
                              }`}
                            >
                              <Eye size={16} />
                              {item.is_expired ? 'Expired' : 'View'}
                            </button>
                            <button
                              onClick={() => handleRefreshClick(item.ticker)}
                              disabled={refreshingTicker === item.ticker}
                              className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white rounded-lg font-bold text-sm transition flex items-center gap-2 disabled:opacity-50"
                              title="Capture latest market moves (Costs 1 Credit)"
                            >
                              {refreshingTicker === item.ticker ? (
                                <>
                                  <RefreshCw size={16} className="animate-spin" />
                                  Refreshing...
                                </>
                              ) : (
                                <>
                                  <Zap size={16} />
                                  Refresh
                                </>
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
              <div className="md:hidden space-y-3">
                {history.map((item) => (
                  <div key={item.id} className="bg-slate-900/50 border border-slate-800 rounded-xl p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-bold text-blue-400 text-xl font-mono">{item.ticker}</span>
                          {item.is_expired && (
                            <span className="px-2 py-0.5 bg-red-500/20 border border-red-500/50 rounded text-red-400 text-xs font-bold">
                              EXPIRED
                            </span>
                          )}
                        </div>
                        <p className="text-slate-400 text-xs">{item.company_name}</p>
                      </div>
                      <span className="text-emerald-400 font-bold">${item.last_price.toFixed(2)}</span>
                    </div>

                    <div className="flex items-center justify-between mb-3 pb-3 border-b border-slate-800">
                      <div className="flex items-center gap-2">
                        <span className={`px-2.5 py-1 rounded-lg border text-xs font-bold ${getVerdictBg(item.verdict)} ${getVerdictColor(item.verdict)}`}>
                          {item.verdict}
                        </span>
                        <span className="text-slate-400 text-xs">{item.confidence_score}%</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-400 text-xs">
                        <Clock size={14} />
                        <span>{item.is_expired ? 'Expired' : `${item.hours_ago}h ago`}</span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleView(item.ticker, item.is_expired)}
                        disabled={item.is_expired}
                        className={`flex-1 py-2.5 rounded-lg font-bold text-sm transition flex items-center justify-center gap-2 ${
                          item.is_expired
                            ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                            : 'bg-blue-600 hover:bg-blue-500 text-white'
                        }`}
                      >
                        <Eye size={16} />
                        {item.is_expired ? 'Expired' : 'View'}
                      </button>
                      <button
                        onClick={() => handleRefreshClick(item.ticker)}
                        disabled={refreshingTicker === item.ticker}
                        className="flex-1 py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white rounded-lg font-bold text-sm transition flex items-center justify-center gap-2 disabled:opacity-50"
                      >
                        {refreshingTicker === item.ticker ? (
                          <>
                            <RefreshCw size={16} className="animate-spin" />
                            Refreshing...
                          </>
                        ) : (
                          <>
                            <Zap size={16} />
                            Refresh
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </main>

      <Footer />

      {/* Refresh Confirmation Modal */}
      <AnimatePresence>
        {showRefreshModal && selectedTicker && (
          <RefreshConfirmModal
            ticker={selectedTicker}
            onConfirm={handleConfirmRefresh}
            onCancel={() => {
              setShowRefreshModal(false);
              setSelectedTicker(null);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
