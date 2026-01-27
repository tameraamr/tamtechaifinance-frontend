"use client";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Search, Zap, AlertTriangle, XCircle, ArrowLeft, ChevronDown, Brain, TrendingUp, Shield, Lightbulb, Target, BarChart3, PieChart, Activity, DollarSign, Dices, CheckCircle } from "lucide-react";
import { useAuth } from "../../src/context/AuthContext";
import { useTranslation } from "../../src/context/TranslationContext";
import Navbar from "../../src/components/Navbar";
import Footer from "../../src/components/Footer";
import toast from 'react-hot-toast';
import { motion } from "framer-motion";

const BASE_URL = typeof window !== 'undefined' ? '/api' : 'https://tamtechaifinance-backend-production.up.railway.app';

export default function StockAnalyzerPage() {
  const router = useRouter();
  const { credits, isLoggedIn, updateCredits } = useAuth();
  const { t, lang } = useTranslation();
  const [ticker, setTicker] = useState("");
  const [suggestions, setSuggestions] = useState<{ symbol: string, name: string }[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);

  // SEO: Set page metadata
  useEffect(() => {
    document.title = "Stock Analyzer | AI-Powered Stock Analysis Tool - Tamtech Finance";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Analyze any stock instantly with our advanced AI engine. Get comprehensive financial health scores, risk assessments, and investment insights for free.');
    }
    
    // Add canonical tag
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', 'https://tamtech-finance.com/stock-analyzer');
  }, []);
  const [guestTrials, setGuestTrials] = useState(3);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authError, setAuthError] = useState("");
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);
  const [userTyping, setUserTyping] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const savedGuest = localStorage.getItem("guest_trials");
    if (savedGuest) setGuestTrials(parseInt(savedGuest));
    else localStorage.setItem("guest_trials", "3");
  }, []);

  // Auto-suggestions when typing
  useEffect(() => {
    const getSuggestions = async () => {
      if (!ticker || ticker.length < 2) {
        setSuggestions([]);
        setShowSuggestions(false);
        return;
      }

      // Only show suggestions if user is actively typing, not after analysis
      if (loading || !userTyping) return;

      try {
        const response = await fetch(`${BASE_URL}/search-ticker/${ticker}`);
        if (response.ok) {
          const data = await response.json();
          setSuggestions(data);
          setShowSuggestions(true);
        }
      } catch (error) { 
        console.error("Search error:", error); 
      }
    };

    const timer = setTimeout(getSuggestions, 100);
    return () => clearTimeout(timer);
  }, [ticker, loading, userTyping]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const closeSuggestions = () => setShowSuggestions(false);
    window.addEventListener('click', closeSuggestions);
    return () => window.removeEventListener('click', closeSuggestions);
  }, []);

  const fetchRandomStock = async () => {
    try {
      // ✅ NEW ENDPOINT V2 - GUARANTEED FRESH
      const res = await fetch(`${BASE_URL}/get-random-ticker-v2?bust=${Date.now()}_${Math.random()}`, {
        cache: 'no-store',
        next: { revalidate: 0 },
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      });
      const data = await res.json();
      console.log('🎲 V2 Random:', data.ticker, 'Version:', data.version);
      if (data.ticker) {
        setTicker(data.ticker);
        setUserTyping(false);
        setShowSuggestions(false);
        toast.success(`Random pick: ${data.ticker}`, { icon: '🎲' });
        // Don't auto-analyze - let user click analyze button to prevent bypassing verification
      }
    } catch {
      toast.error("Error fetching random stock");
    }
  };

  const handleAnalyze = async (overrideTicker?: string) => {
    const targetTicker = overrideTicker || ticker;
    
    console.log('🔍 handleAnalyze called with:', targetTicker, 'loading:', loading);
    
    if (!targetTicker.trim()) {
      toast.error("Please enter a stock ticker");
      return;
    }

    // Prevent double-calls while loading
    if (loading) {
      console.log('⚠️ Already loading, returning');
      return;
    }

    console.log('✅ Starting analysis...');
    setLoading(true);
    setAuthError("");
    setShowSuggestions(false);
    setUserTyping(false);

    // Check credits locally for logged-in users
    if (isLoggedIn && credits <= 0) {
      router.push("/?paywall=true");
      setLoading(false);
      return;
    }

    // Check guest trials
    if (!isLoggedIn && guestTrials <= 0) {
      setShowAuthModal(true);
      setLoading(false);
      return;
    }

    try {
      // Add timeout to prevent indefinite hanging (60 seconds for AI generation)
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 60000);
      
      const res = await fetch(`${BASE_URL}/analyze/${targetTicker}?lang=${lang}`, { 
        credentials: 'include', // 🔒 httpOnly cookie sent automatically
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);

      // Check for email verification or IP-based guest trial limit (403)
      if (res.status === 403) {
        const errorData = await res.json();
        if (errorData.detail && errorData.detail.includes("verify your email")) {
          // User is logged in but not verified
          toast.error("📧 Please verify your email first! Check your inbox.", {
            duration: 5000,
            icon: "⚠️"
          });
        } else {
          // Guest IP exhausted
          setShowAuthModal(true);
        }
        setLoading(false);
        return;
      }

      if (res.status === 402) {
        router.push("/?paywall=true");
        setLoading(false);
        return;
      }

      if (!res.ok) {
        let errorMessage = "Analysis failed";
        try {
          const error = await res.json();
          errorMessage = error.detail || errorMessage;
        } catch {
          // Response is not JSON (likely HTML error page)
          const text = await res.text();
          errorMessage = text.substring(0, 100) || `Server error (${res.status})`;
        }
        throw new Error(errorMessage);
      }

      let data;
      try {
        data = await res.json();
      } catch (jsonError) {
        throw new Error("Invalid response from server. Please try again.");
      }
      
      // Save to BOTH localStorage AND sessionStorage for navigation (with language)
      localStorage.setItem("analysis_result", JSON.stringify(data));
      localStorage.setItem("analysis_ticker", targetTicker);
      localStorage.setItem("analysis_lang", lang);
      sessionStorage.setItem("analysis_result", JSON.stringify(data));
      sessionStorage.setItem("analysis_ticker", targetTicker);
      sessionStorage.setItem("analysis_lang", lang);

      // Update credits/trials
      if (isLoggedIn) {
        updateCredits(data.credits_left);
      } else {
        const ng = guestTrials - 1;
        setGuestTrials(ng);
        localStorage.setItem("guest_trials", ng.toString());
      }

      // Navigate to results page
      router.push(`/analysis/${targetTicker}`);
    } catch (err: any) {
      // Handle abort/timeout errors
      if (err.name === 'AbortError') {
        setAuthError("Request timed out. The server is taking too long to respond.");
        toast.error("Request timed out. Please try again.");
      } else {
        setAuthError(err.message);
        toast.error(err.message || "Analysis failed");
      }
    } finally {
      setLoading(false);
    }
  };

  const faqItems = [
    {
      question: t.faq1Q,
      answer: t.faq1A
    },
    {
      question: t.faq2Q,
      answer: t.faq2A
    },
    {
      question: t.faq3Q,
      answer: t.faq3A
    },
    {
      question: t.faq4Q,
      answer: t.faq4A
    },
    {
      question: t.faq5Q,
      answer: t.faq5A
    }
  ];

  return (
    <div className="min-h-screen bg-[#0b1121] text-slate-100 font-sans selection:bg-blue-500/30 overflow-x-hidden flex flex-col">
      <Navbar guestTrials={guestTrials} />

      <main className="flex-1 w-full">
        {/* Top Back Button */}
        <div className="w-full px-4 pt-4 pb-0">
          <div className="max-w-6xl mx-auto">
            <Link href="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors group">
              <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
              {t.backToHome}
            </Link>
          </div>
        </div>

        {/* Main Analyzer Tool Section - MOVED UP */}
        <section className="w-full px-4 py-4 md:py-6 bg-gradient-to-b from-slate-900/50 to-[#0b1121]">
          <div className="max-w-6xl mx-auto">
            {/* Analyzer Display - Exact copy from homepage */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="max-w-3xl mx-auto mb-6">
              <div className="relative bg-gradient-to-br from-slate-900 via-slate-900 to-blue-900/20 border border-slate-800 rounded-2xl p-4 md:p-6 shadow-2xl">
                <div className="absolute -left-16 -top-16 w-48 h-48 bg-blue-600/10 blur-3xl" aria-hidden="true" />
                <div className="absolute -right-16 bottom-0 w-48 h-48 bg-emerald-500/10 blur-3xl" aria-hidden="true" />

                <div className="relative z-10 flex flex-col items-center text-center mb-4">
                  <p className="text-xs uppercase tracking-[0.25em] text-blue-300 font-bold">⚡ {t.primaryEngine}</p>
                  <h2 className="text-lg md:text-2xl font-black text-white mt-1">{t.aiStockAnalyzer}</h2>
                </div>

                <div className="flex flex-col items-center w-full max-w-2xl mx-auto px-2 relative z-10">
                  {authError && (
                    <div className="w-full mb-3 bg-red-500/10 border border-red-500/50 p-3 rounded-lg flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="text-red-500 w-4 h-4 shrink-0" />
                        <span className="text-red-200 text-xs font-bold">{authError}</span>
                      </div>
                      <button onClick={() => setAuthError("")} className="text-red-400 hover:text-white p-1">
                        <XCircle className="w-4 h-4" />
                      </button>
                    </div>
                  )}

                  <div className="w-full relative">
                    {/* 💳 Credit Warning Badge */}
                    <div className="mb-3 bg-amber-500/10 border border-amber-500/30 rounded-lg p-2.5 flex items-center gap-2">
                      <div className="bg-amber-500/20 rounded-full p-1.5">
                        <Zap className="w-3.5 h-3.5 text-amber-400" />
                      </div>
                      <span className="text-amber-200 text-xs font-semibold">
                        {isLoggedIn 
                          ? `Each analysis costs 1 credit • You have ${credits} ${credits === 1 ? 'credit' : 'credits'} remaining`
                          : `Free trial: ${guestTrials} ${guestTrials === 1 ? 'analysis' : 'analyses'} left • Register for more`
                        }
                      </span>
                    </div>

                    <div className="flex items-center bg-slate-950/70 border border-slate-800 rounded-xl overflow-hidden shadow-lg focus-within:border-blue-500/50 transition-all">
                      <input
                        id="ticker-input"
                        name="ticker"
                        type="text"
                        placeholder={t.searchPlaceholder}
                        className="w-full bg-transparent p-3 text-sm outline-none uppercase font-mono text-white"
                        value={ticker}
                        onChange={(e) => {
                          setTicker(e.target.value.toUpperCase());
                          setUserTyping(true);
                        }}
                        onFocus={() => ticker.length >= 2 && setShowSuggestions(true)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handleAnalyze();
                          }
                        }}
                      />
                      <button onClick={() => handleAnalyze()} disabled={loading} className="bg-blue-600 hover:bg-blue-500 px-4 md:px-5 font-black text-xs disabled:opacity-50 transition-colors shrink-0 self-stretch flex items-center justify-center text-white">
                        {loading ? "..." : t.analyze}
                      </button>
                      <button onClick={fetchRandomStock} className="bg-slate-800/80 border-l border-slate-700 px-3 flex items-center justify-center hover:bg-slate-700 transition-all self-stretch" title={t.getRandomStock}>
                        <Dices className="w-5 h-5 text-purple-400" />
                      </button>
                    </div>

                    {showSuggestions && suggestions.length > 0 && (
                      <div className="absolute left-0 right-0 mt-2 bg-[#0f172a] border border-slate-700 rounded-xl shadow-2xl overflow-hidden z-[9999] max-h-[240px] overflow-y-auto custom-scrollbar ring-1 ring-white/10">
                        {suggestions.map((s, i) => (
                          <button
                            key={i}
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              setTicker(s.symbol);
                              setShowSuggestions(false);
                              handleAnalyze(s.symbol);
                            }}
                            className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-blue-600/20 border-b border-slate-800/50 last:border-0 transition-all group/item text-left text-sm"
                          >
                            <div className="flex flex-col items-start">
                              <span className="text-blue-400 font-bold">{s.symbol}</span>
                              <span className="text-slate-500 text-[10px] truncate max-w-[200px]">{s.name}</span>
                            </div>
                            <Search size={12} className="text-slate-600 group-hover/item:text-blue-500" />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Loading State - Premium AI Analysis Animation */}
                {loading && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="mt-4"
                  >
                    <div className="bg-gradient-to-br from-blue-900/40 via-purple-900/40 to-blue-900/40 border-2 border-blue-500/30 rounded-2xl p-6 text-center relative overflow-hidden">
                      {/* Animated background gradient */}
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-blue-600/10 animate-pulse" />
                      
                      {/* Floating particles effect */}
                      <div className="absolute inset-0 overflow-hidden">
                        {[...Array(15)].map((_, i) => (
                          <div
                            key={i}
                            className="absolute w-1 h-1 bg-blue-400/30 rounded-full animate-float"
                            style={{
                              left: `${Math.random() * 100}%`,
                              top: `${Math.random() * 100}%`,
                              animationDelay: `${Math.random() * 3}s`,
                              animationDuration: `${3 + Math.random() * 4}s`
                            }}
                          />
                        ))}
                      </div>

                      <div className="relative z-10">
                        {/* Main spinner */}
                        <div className="flex justify-center mb-4">
                          <div className="relative">
                            <div className="w-16 h-16 border-4 border-blue-500/20 rounded-full"></div>
                            <div className="absolute top-0 left-0 w-16 h-16 border-4 border-transparent border-t-blue-500 rounded-full animate-spin"></div>
                            <div className="absolute top-2 left-2 w-12 h-12 border-4 border-transparent border-t-purple-500 rounded-full animate-spin-slow"></div>
                            <Brain className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 text-blue-400 animate-pulse" />
                          </div>
                        </div>

                        {/* Loading text */}
                        <h3 className="text-xl font-bold text-white mb-2">
                          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                            AI Analysis in Progress
                          </span>
                        </h3>
                        <p className="text-slate-300 text-xs mb-3">
                          {ticker ? `Analyzing ${ticker} with advanced AI algorithms...` : 'Running deep analysis...'}
                        </p>

                        {/* Progress steps */}
                        <div className="space-y-1.5 max-w-md mx-auto">
                          <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                            className="flex items-center gap-2 text-left text-xs"
                          >
                            <CheckCircle className="w-4 h-4 text-green-400 shrink-0" />
                            <span className="text-slate-300">Fetching real-time market data</span>
                          </motion.div>
                          <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.6 }}
                            className="flex items-center gap-2 text-left text-xs"
                          >
                            <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin shrink-0"></div>
                            <span className="text-slate-300">Running AI financial models</span>
                          </motion.div>
                          <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 1.0 }}
                            className="flex items-center gap-2 text-left text-xs opacity-50"
                          >
                            <div className="w-4 h-4 border-2 border-slate-600 rounded-full shrink-0"></div>
                            <span className="text-slate-400">Generating comprehensive report</span>
                          </motion.div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Small Hero Section - MOVED BELOW TOOL */}
        <section className="w-full px-4 py-4 md:py-6 border-b border-slate-800 bg-slate-900/20">
          <div className="max-w-6xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <h1 className="text-2xl md:text-3xl font-bold text-white mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400">
                {t.aiPoweredStockTool}
              </h1>
              <p className="text-slate-400 text-sm md:text-base max-w-2xl">
                {t.aiToolDescription}
              </p>
            </motion.div>
          </div>
        </section>

        {/* What's Included Section */}
        <section className="w-full px-4 py-16 border-b border-slate-800 bg-slate-900/30">
          <div className="max-w-6xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }}>
              <h2 className="text-3xl md:text-4xl font-black text-white mb-8 text-center">{t.whatsIncludedTitle}</h2>
              <p className="text-slate-300 text-lg mb-12 max-w-3xl mx-auto text-center">
                {t.whatsIncludedDesc}
              </p>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  {
                    icon: <Activity className="w-10 h-10 text-blue-400" />,
                    title: t.feature14Metrics,
                    desc: t.feature14MetricsDesc
                  },
                  {
                    icon: <BarChart3 className="w-10 h-10 text-purple-400" />,
                    title: t.featureRadarScore,
                    desc: t.featureRadarScoreDesc
                  },
                  {
                    icon: <Target className="w-10 h-10 text-green-400" />,
                    title: t.featureBusinessDNA,
                    desc: t.featureBusinessDNADesc
                  },
                  {
                    icon: <Shield className="w-10 h-10 text-cyan-400" />,
                    title: t.featureFinancialHealth,
                    desc: t.featureFinancialHealthDesc
                  },
                  {
                    icon: <DollarSign className="w-10 h-10 text-yellow-400" />,
                    title: t.featureValuation,
                    desc: t.featureValuationDesc
                  },
                  {
                    icon: <TrendingUp className="w-10 h-10 text-orange-400" />,
                    title: t.featureNewsSentiment,
                    desc: t.featureNewsSentimentDesc
                  },
                  {
                    icon: <PieChart className="w-10 h-10 text-pink-400" />,
                    title: t.featureSWOTMatrix,
                    desc: t.featureSWOTMatrixDesc
                  },
                  {
                    icon: <Brain className="w-10 h-10 text-indigo-400" />,
                    title: t.featureBullBear,
                    desc: t.featureBullBearDesc
                  },
                  {
                    icon: <Lightbulb className="w-10 h-10 text-emerald-400" />,
                    title: t.featureAIVerdict,
                    desc: t.featureAIVerdictDesc
                  }
                ].map((item, idx) => (
                  <motion.div key={idx} whileHover={{ y: -6 }} className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 hover:border-blue-500/30 transition group">
                    <div className="mb-4 p-3 bg-slate-900 rounded-xl w-fit group-hover:bg-slate-800 transition">{item.icon}</div>
                    <h3 className="text-lg font-bold text-white mb-3">{item.title}</h3>
                    <p className="text-slate-300 text-sm leading-relaxed">{item.desc}</p>
                  </motion.div>
                ))}
              </div>

              <div className="mt-12 text-center">
                <div className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-900/30 to-purple-900/30 border border-blue-500/30 rounded-2xl px-6 py-4">
                  <Zap className="w-6 h-6 text-yellow-400 fill-yellow-400/20" />
                  <p className="text-white font-bold">{t.professionalPdfExport}</p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="w-full px-4 py-16 border-b border-slate-800">
          <div className="max-w-6xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }}>
              <h2 className="text-3xl md:text-4xl font-black text-white mb-8 text-center">{t.howAnalysisWorksTitle}</h2>
              
              <div className="grid md:grid-cols-4 gap-6">
                {[
                  { num: "1", title: t.howStep1Title, desc: t.howStep1Desc },
                  { num: "2", title: t.howStep2Title, desc: t.howStep2Desc },
                  { num: "3", title: t.howStep3Title, desc: t.howStep3Desc },
                  { num: "4", title: t.howStep4Title, desc: t.howStep4Desc }
                ].map((step, idx) => (
                  <div key={idx} className="relative bg-slate-800/50 border border-slate-700 rounded-2xl p-6 hover:border-blue-500/30 transition">
                    <div className="text-4xl font-black text-blue-400 mb-4">{step.num}</div>
                    <h3 className="text-white font-bold text-lg mb-2">{step.title}</h3>
                    <p className="text-slate-400 text-sm">{step.desc}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Why Use AI Analysis Section */}
        <section className="w-full px-4 py-16 border-b border-slate-800 bg-slate-900/30">
          <div className="max-w-6xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }}>
              <h2 className="text-3xl md:text-4xl font-black text-white mb-8 text-center">{t.whyUseAITitle}</h2>
              
              <div className="grid md:grid-cols-3 gap-8">
                {[
                  {
                    icon: <Brain className="w-12 h-12 text-blue-400" />,
                    title: t.whyAI1Title,
                    desc: t.whyAI1Desc
                  },
                  {
                    icon: <Shield className="w-12 h-12 text-green-400" />,
                    title: t.whyAI2Title,
                    desc: t.whyAI2Desc
                  },
                  {
                    icon: <TrendingUp className="w-12 h-12 text-purple-400" />,
                    title: t.whyAI3Title,
                    desc: t.whyAI3Desc
                  }
                ].map((item, idx) => (
                  <motion.div key={idx} whileHover={{ y: -6 }} className="bg-slate-800/50 border border-slate-700 rounded-2xl p-8 hover:border-blue-500/30 transition group">
                    <div className="mb-4 p-4 bg-slate-900 rounded-xl w-fit group-hover:bg-slate-800 transition">{item.icon}</div>
                    <h3 className="text-xl font-bold text-white mb-4">{item.title}</h3>
                    <p className="text-slate-300 leading-relaxed">{item.desc}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="w-full px-4 py-16 border-b border-slate-800">
          <div className="max-w-4xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }}>
              <h2 className="text-3xl md:text-4xl font-black text-white mb-12 text-center">{t.frequentlyAskedQuestions}</h2>
              
              <div className="space-y-4">
                {faqItems.map((item, idx) => (
                  <motion.div
                    key={idx}
                    initial={false}
                    className="bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden hover:border-blue-500/30 transition"
                  >
                    <button
                      onClick={() => setExpandedFAQ(expandedFAQ === idx ? null : idx)}
                      className="w-full px-6 py-4 flex items-center justify-between hover:bg-slate-700/30 transition"
                    >
                      <h3 className="text-left font-bold text-white text-lg">{item.question}</h3>
                      <motion.div animate={{ rotate: expandedFAQ === idx ? 180 : 0 }} transition={{ duration: 0.3 }}>
                        <ChevronDown className="w-5 h-5 text-slate-400" />
                      </motion.div>
                    </button>
                    
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: expandedFAQ === idx ? "auto" : 0, opacity: expandedFAQ === idx ? 1 : 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 py-4 bg-slate-900/50 border-t border-slate-700">
                        <p className="text-slate-300 leading-relaxed">{item.answer}</p>
                      </div>
                    </motion.div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Risk Warning Section */}
        <section className="w-full px-4 py-16 border-b border-slate-800 bg-slate-900/30">
          <div className="max-w-6xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }}>
              <div className="bg-gradient-to-br from-orange-900/30 to-red-900/20 border border-orange-500/30 rounded-2xl p-8">
                <div className="flex items-start gap-4">
                  <Shield className="w-8 h-8 text-orange-400 flex-shrink-0 mt-1" />
                  <div>
                    <h2 className="text-2xl font-black text-white mb-4">{t.riskWarningTitle}</h2>
                    <p className="text-slate-300 mb-4">{t.riskWarningP1}</p>
                    <p className="text-slate-300 mb-4">{t.riskWarningP2}</p>
                    <p className="text-slate-400 text-sm">{t.riskWarningDisclaimer}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full px-4 py-16 bg-gradient-to-r from-blue-900/30 via-slate-900/50 to-purple-900/30">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }}>
              <h2 className="text-2xl md:text-3xl font-black text-white mb-6">{t.readyToAnalyzeTitle}</h2>
              <p className="text-slate-300 text-lg mb-8">{t.readyToAnalyzeDesc}</p>
              <a href="#" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold px-8 py-4 rounded-xl transition shadow-lg shadow-blue-900/30">
                <Search size={20} />
                {t.backToAnalyzer}
              </a>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
