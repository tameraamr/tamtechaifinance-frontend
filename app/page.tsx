"use client";
import { useState, useEffect, Suspense, FormEvent, useRef, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  TrendingUp, TrendingDown, DollarSign, BookOpen, PieChart, ShieldCheck, Target,
  CheckCircle, XCircle, BarChart3, Search, Zap, AlertTriangle, Trophy, Lightbulb, Lock, Star, LogOut, User, Calendar, Brain, HelpCircle, Activity, Twitter, Linkedin, Send, Download, Dices, ArrowRight, Newspaper, Timer
} from "lucide-react";
import { motion } from "framer-motion";
import toast from 'react-hot-toast';

// Import components
// Dynamic Imports for Code Splitting
import dynamic from 'next/dynamic';

const NewsAnalysis = dynamic(() => import('../src/components/NewsAnalysis'), {
  loading: () => <div className="h-96 w-full animate-pulse bg-slate-800/50 rounded-xl" />,
  ssr: false
});
const Forecasts = dynamic(() => import('../src/components/Forecasts'), {
  loading: () => <div className="h-64 w-full animate-pulse bg-slate-800/50 rounded-xl" />,
  ssr: false
});
const RecentAnalyses = dynamic(() => import('../src/components/RecentAnalyses'), {
  loading: () => <div className="h-20 w-full animate-pulse bg-slate-800/50 rounded-xl" />
});
const RegretMachine = dynamic(() => import('../src/components/RegretMachine'), {
  loading: () => <div className="h-64 w-full animate-pulse bg-slate-800/50 rounded-xl" />,
  ssr: false
});
const MasterUniverseHeatmap = dynamic(() => import('../src/components/MasterUniverseHeatmap'), {
  loading: () => <div className="h-96 w-full animate-pulse bg-slate-800/50 rounded-xl" />,
  ssr: false
});

import ArticleOfTheDay from '../src/components/ArticleOfTheDay';
import Navbar from '../src/components/Navbar';
import Footer from '../src/components/Footer';
import UpgradeModal from '../src/components/UpgradeModal';
import { useAuth } from '../src/context/AuthContext';
import { useTranslation } from '../src/context/TranslationContext';
import { useDebounce } from '../src/hooks/useDebounce';

// 🔒 Portfolio Demo Mode — all data served from mock layer
import { mockApi } from '../src/lib/mockApi';
const BASE_URL = '/api'; // Retained for type compatibility, unused in demo mode

// Component to handle search params with Suspense
function SearchParamsHandler({ setShowAuthModal, setShowPaywall }: { setShowAuthModal: (show: boolean) => void, setShowPaywall: (show: boolean) => void }) {
  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams) {
      const auth = searchParams.get('auth');
      const paywall = searchParams.get('paywall');
      if (auth === 'true') {
        setShowAuthModal(true);
      } else if (paywall === 'true') {
        setShowPaywall(true);
      }
    }
  }, [searchParams, setShowAuthModal, setShowPaywall]);

  return null;
}

const progressMessages = [
  "Gathering real-time market data...",
  "AI is processing technical indicators and sentiment...",
  "Generating SWOT analysis and bull/bear cases...",
  "Finalizing your comprehensive report... almost there!"
];

const countriesList = [
  // North America
  { code: "US", name: "United States" },
  { code: "CA", name: "Canada" },
  { code: "MX", name: "Mexico" },

  // Europe
  { code: "GB", name: "United Kingdom" },
  { code: "DE", name: "Germany" },
  { code: "FR", name: "France" },
  { code: "IT", name: "Italy" },
  { code: "ES", name: "Spain" },
  { code: "NL", name: "Netherlands" },
  { code: "BE", name: "Belgium" },
  { code: "CH", name: "Switzerland" },
  { code: "SE", name: "Sweden" },
  { code: "NO", name: "Norway" },
  { code: "DK", name: "Denmark" },
  { code: "FI", name: "Finland" },
  { code: "PL", name: "Poland" },
  { code: "AT", name: "Austria" },
  { code: "IE", name: "Ireland" },
  { code: "PT", name: "Portugal" },
  { code: "GR", name: "Greece" },
  { code: "CZ", name: "Czech Republic" },
  { code: "RO", name: "Romania" },
  { code: "HU", name: "Hungary" },
  { code: "UA", name: "Ukraine" },
  { code: "RU", name: "Russia" },
  { code: "TR", name: "Turkey" },

  // Middle East & North Africa
  { code: "SA", name: "Saudi Arabia" },
  { code: "AE", name: "United Arab Emirates" },
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

  // Asia-Pacific
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

  // South America
  { code: "BR", name: "Brazil" },
  { code: "AR", name: "Argentina" },
  { code: "CL", name: "Chile" },
  { code: "CO", name: "Colombia" },
  { code: "PE", name: "Peru" },
  { code: "VE", name: "Venezuela" },
  { code: "EC", name: "Ecuador" },

  // Africa
  { code: "ZA", name: "South Africa" },
  { code: "NG", name: "Nigeria" },
  { code: "KE", name: "Kenya" },
  { code: "ET", name: "Ethiopia" },
  { code: "GH", name: "Ghana" },

  // Other
  { code: "OTHER", name: "Other" }
];


interface Sector {
  name: string;
  change: string;
  positive: boolean;
}



export default function Home() {
  const { user, credits, isLoggedIn, isLoading: authLoading, login, logout, updateCredits, refreshUserData, isPro } = useAuth();
  const { lang, setLang, t, isRTL } = useTranslation();
  const [sectors, setSectors] = useState<Sector[]>([]);
  const [guestTrials, setGuestTrials] = useState(3);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);
  const [authMode, setAuthMode] = useState("signup");
  const [ticker, setTicker] = useState<string>("");
  const [suggestions, setSuggestions] = useState<{ symbol: string; name: string }[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [userTyping, setUserTyping] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [modalTrigger, setModalTrigger] = useState<'credits' | 'portfolio' | 'pdf' | 'feature'>('feature');

  const [randomTicker, setRandomTicker] = useState<string | null>(null);
  const [loadingRandom, setLoadingRandom] = useState<boolean>(false);
  const [pickerResult, setPickerResult] = useState<{ ticker: string; name?: string; price?: number | null } | null>(null);
  const [pickerLoading, setPickerLoading] = useState<boolean>(false);
  const [newsSearch, setNewsSearch] = useState<string>("");

  const [recentAnalyses, setRecentAnalyses] = useState<any[]>([]);
  const [isSubmittingAuth, setIsSubmittingAuth] = useState<boolean>(false);
  const [displaySymbol, setDisplaySymbol] = useState<string>("????");
  const [displayName, setDisplayName] = useState<string>("");
  const [displayPrice, setDisplayPrice] = useState<number | undefined>(undefined);
  const [spinnerRolling, setSpinnerRolling] = useState<boolean>(false);
  const [selectedSpinnerTicker, setSelectedSpinnerTicker] = useState<string | null>(null);
  const rollerRef = useRef<NodeJS.Timeout | null>(null);

  // --- ADDED STATE FOR MISSING VARIABLES ---
  // TEST TEST TAMER
  const [loading, setLoading] = useState<boolean>(false);
  const [analysisComplete, setAnalysisComplete] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [country, setCountry] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [licenseKey, setLicenseKey] = useState<string>("");
  const [result, setResult] = useState<any | null>(undefined);
  const [acceptTerms, setAcceptTerms] = useState<boolean>(false);
  const [progressMessageIndex, setProgressMessageIndex] = useState<number>(0);
  const router = useRouter();

  // Event Timer State
  const [nextEvent, setNextEvent] = useState<{ name: string; date_time: string; importance: string; ai_impact_note: string } | null>(null);
  const [countdown, setCountdown] = useState<string>("00:00:00");

  // Fetch recent analyses from mock data layer
  const fetchRecentAnalyses = useCallback(async () => {
    try {
      const data = await mockApi.getRecentAnalyses();
      setRecentAnalyses(data);
    } catch (err) {
      console.error("Error fetching recent analyses:", err);
    }
  }, []);

  // Removed market sentiment feature - endpoint deprecated


  // تحديث الـ useEffect ليعمل عند فتح الصفحة أو عند أي تحليل جديد - with dependency array fix
  useEffect(() => {
    // Market dashboard data fetch removed
  }, [recentAnalyses]);


  // Hook 1: جلب بيانات المستخدم والنبض العلوي - Optimized with proper cleanup
  useEffect(() => {
    const savedGuest = localStorage.getItem("guest_trials");
    if (savedGuest) setGuestTrials(parseInt(savedGuest));
    else localStorage.setItem("guest_trials", "3");

    fetchRecentAnalyses();

    // SEO: Set page metadata and canonical (only runs once)
    if (typeof document !== 'undefined') {
      document.title = "Tamtech Finance | AI-Powered Stock Analysis & Insights";
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute('content', 'Get institutional-grade market intelligence and financial health scores powered by advanced AI. Master the stock market with Tamtech Finance.');
      }

      // Add canonical tag
      let canonical = document.querySelector('link[rel="canonical"]');
      if (!canonical) {
        canonical = document.createElement('link');
        canonical.setAttribute('rel', 'canonical');
        document.head.appendChild(canonical);
      }
      canonical.setAttribute('href', 'https://tamtech-finance.com');
    }

    // Fetch next event for timer
    fetchNextEvent();
  }, [fetchRecentAnalyses]); // Added dependency

  // Fetch next calendar event
  const fetchNextEvent = async () => {
    try {
      const events = await mockApi.getCalendarEvents();
      if (events && events.length > 0) {
        setNextEvent(events[0] as any);
      }
    } catch (error) {
      console.error('Failed to fetch next event:', error);
    }
  };

  // Update countdown every second
  useEffect(() => {
    if (!nextEvent) return;

    const updateCountdown = () => {
      const now = new Date().getTime();
      // Parse the date_time as UTC (add 'Z' if not present to ensure UTC interpretation)
      const dateTimeStr = nextEvent.date_time.endsWith('Z') ? nextEvent.date_time : nextEvent.date_time + 'Z';
      const eventTime = new Date(dateTimeStr).getTime();
      const distance = eventTime - now;

      if (distance > 0) {
        // Calculate total hours, minutes, seconds
        const totalHours = Math.floor(distance / (1000 * 60 * 60));
        const hours = totalHours;
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        setCountdown(
          `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
        );
      } else {
        setCountdown("00:00:00");
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [nextEvent]);

  // ✅ Debounced ticker search - Optimized to prevent excessive API calls
  const debouncedTicker = useDebounce(ticker, 300); // 300ms debounce

  useEffect(() => {
    const getSuggestions = async () => {
      // 1. إذا النص قصير جداً، لا تبحث وأخفِ القائمة
      if (!debouncedTicker || debouncedTicker.length < 2) {
        setSuggestions([]);
        setShowSuggestions(false);
        return;
      }

      // 2. إذا كان النظام مشغولاً بالتحليل أو المستخدم لا يكتب، لا تقم بالبحث
      if (loading || analysisComplete || !userTyping) return;

      try {
        const data = await mockApi.searchTicker(debouncedTicker);
        setSuggestions(data as any);
        setShowSuggestions(true);
      } catch (error) { console.error("Search error:", error); }
    };

    getSuggestions();
  }, [debouncedTicker, loading, analysisComplete, userTyping]); // Proper dependencies

  // Hook 3: إغلاق القائمة عند الضغط في أي مكان خارج المربع
  useEffect(() => {
    const closeSuggestions = () => setShowSuggestions(false);
    window.addEventListener('click', closeSuggestions);
    return () => window.removeEventListener('click', closeSuggestions);
  }, []);

  // Dynamic progress messages during loading
  useEffect(() => {
    if (!loading) {
      setProgressMessageIndex(0);
      return;
    }

    const interval = setInterval(() => {
      setProgressMessageIndex(prev => (prev + 1) % progressMessages.length);
    }, 15000); // Change every 15 seconds

    return () => clearInterval(interval);
  }, [loading]);

  // REMOVED: Auto-redirect useEffect - now using manual confirmation

  /** Demo mode: auth is bypassed — shows toast notification */
  const handleAuth = async () => {
    toast("🔒 Portfolio Demo Mode — Authentication disabled", { icon: "ℹ️", duration: 3000 });
    setShowAuthModal(false);
    setIsSubmittingAuth(false);
  };

  const fetchRandomStock = async () => {
    setLoadingRandom(true);
    try {
      const data = await mockApi.getRandomTicker();
      setRandomTicker(data.ticker);
    } catch {
      setAuthError("Error fetching suggestion");
    } finally {
      setLoadingRandom(false);
    }
  };

  const handleServiceRandomPick = async () => {
    setPickerLoading(true);
    try {
      const data = await mockApi.getRandomTicker();
      const tickerSymbol = data.ticker;
      const quote = await mockApi.getStockQuote(tickerSymbol);
      setPickerResult({ ticker: tickerSymbol, name: quote.name, price: quote.price });
    } catch (err) {
      toast.error("Could not pick a stock. Try again.");
    } finally {
      setPickerLoading(false);
    }
  };

  const handleServiceAnalyze = (tickerSymbol: string) => {
    setTicker(tickerSymbol);
    handleAnalyze(tickerSymbol);
  };

  const handleNewsQuickSearch = (e: FormEvent) => {
    e.preventDefault();
    if (!newsSearch.trim()) return;
    router.push(`/news?ticker=${newsSearch.trim().toUpperCase()}`);
  };

  const spinTicker = async () => {
    setSpinnerRolling(true);
    setDisplayName("");
    setDisplayPrice(undefined);

    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    rollerRef.current = setInterval(() => {
      const random = Array.from({ length: 4 }, () => letters[Math.floor(Math.random() * letters.length)]).join("");
      setDisplaySymbol(random);
    }, 85);

    try {
      const data = await mockApi.getRandomTicker();

      // Wait before stopping animation
      await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 1000));

      if (rollerRef.current) clearInterval(rollerRef.current);
      setDisplaySymbol(data.ticker);
      setSelectedSpinnerTicker(data.ticker);

      // Fetch price from mock
      const quote = await mockApi.getStockQuote(data.ticker);
      setDisplayName(quote.name || "");
      setDisplayPrice(quote.price);

      setSpinnerRolling(false);
    } catch (err) {
      if (rollerRef.current) clearInterval(rollerRef.current);
      setSpinnerRolling(false);
      toast.error("Failed to pick a stock. Please try again.", { duration: 3000 });
    }
  };

  /** Demo mode: analyze a stock using mock data */
  const handleSpinnerAnalyze = async () => {
    if (!selectedSpinnerTicker) return;

    setLoading(true);
    setAuthError("");

    try {
      const data = await mockApi.getAnalysisReport(selectedSpinnerTicker);
      sessionStorage.setItem("analysis_result", JSON.stringify(data));
      sessionStorage.setItem("analysis_ticker", selectedSpinnerTicker);
      setResult(data);
      setAnalysisComplete(true);
    } catch (err: any) {
      setAuthError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const confirmRandomAnalysis = () => {
    if (randomTicker) {
      setTicker(randomTicker);
      const tickerToAnalyze = randomTicker;
      setRandomTicker(null); // Close modal first
      setTimeout(() => handleAnalyze(tickerToAnalyze), 100);
    }
  };

  /** Demo mode: stock analysis via mock data */
  const handleAnalyze = async (overrideTicker?: string) => {
    const targetTicker = overrideTicker || ticker;
    if (!targetTicker) return;
    if (loading) return;

    setLoading(true);
    setAuthError("");
    setShowSuggestions(false);
    setUserTyping(false);
    setResult(null);
    setAnalysisComplete(false);

    try {
      const data = await mockApi.getAnalysisReport(targetTicker);
      setResult(data);

      sessionStorage.setItem('analysis_result', JSON.stringify(data));
      sessionStorage.setItem('analysis_ticker', targetTicker);

      setAnalysisComplete(true);
    } catch (err: any) {
      setAuthError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleViewReport = () => {
    // Verify sessionStorage data exists before navigation
    const storedResult = sessionStorage.getItem('analysis_result');
    const storedTicker = sessionStorage.getItem('analysis_ticker');

    console.log('Preparing data for navigation to:', storedTicker);

    if (storedResult && storedTicker) {
      // Transfer from sessionStorage to localStorage for the analysis page
      localStorage.setItem('analysis_result', storedResult);
      localStorage.setItem('analysis_ticker', storedTicker);

      // Reset state
      setAnalysisComplete(false);
      setResult(null);

      // Navigation will be handled by Link component
    } else {
      // Data not found, show error
      setAuthError("Analysis data not found. Please try analyzing again.");
      setAnalysisComplete(false);
    }
  };

  const handleRedeem = async () => {
    setAuthError("");
    if (!licenseKey.trim()) return;

    try {
      // Demo Mode Validation
      await new Promise(resolve => setTimeout(resolve, 800));
      const data = await mockApi.verifyLicense(licenseKey.trim());
      
      if (data.valid) {
        updateCredits(data.credits);
        setShowPaywall(false);
        setLicenseKey("");
        alert(`🎉 Success! License activated for Portfolio Demo Mode.`);
      } else {
        setAuthError(data.message || "Invalid license");
      }
    } catch {
      setAuthError("Error connecting to server");
    }
  };

  return (
    <div dir={isRTL ? "rtl" : "ltr"} className={`min-h-screen bg-gradient-to-b from-[#0b1121] via-[#070b14] to-[#0b1121] text-[var(--text-primary)] font-sans selection:bg-[var(--accent-primary)]/30 overflow-x-hidden transition-all duration-300 ${isRTL ? 'font-arabic' : ''}`}>
      <Suspense fallback={null}>
        <SearchParamsHandler setShowAuthModal={setShowAuthModal} setShowPaywall={setShowPaywall} />
      </Suspense>

      <Navbar guestTrials={guestTrials} setShowAuthModal={setShowAuthModal} setAuthMode={setAuthMode} />

      {/* 👇 Compact Trading Journal Showcase - Horizontal & Professional 👇 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="mb-8"
      >
        <motion.div
          whileHover={{ y: -2 }}
          onClick={() => router.push('/journal')}
          className="relative overflow-hidden bg-[var(--bg-secondary)] border border-[var(--border-primary)] border-l-4 border-l-amber-500/60 rounded-xl p-6 shadow-lg cursor-pointer hover:border-[var(--border-secondary)] transition-all duration-200 mx-4 md:mx-6 mt-6"
        >

          <div className="relative z-10 flex items-center justify-between gap-6">
            {/* Left side - Title and description */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-600/30 to-yellow-600/10 border border-amber-400/40 flex items-center justify-center">
                  <BarChart3 className="text-amber-100" size={20} />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.15em] text-amber-400/80 font-semibold">Trading Journal</p>
                  <h3 className="text-lg font-bold text-[var(--text-primary)]">Master Every Trade</h3>
                </div>
              </div>
              <p className="text-xs text-amber-200/80 font-medium">Track, analyze & improve your trading performance</p>
            </div>

            {/* Center - Key stats */}
            <div className="hidden md:flex items-center gap-6">
              <div className="text-center">
                <p className="text-xs text-slate-400 mb-1">Total Trades</p>
                <p className="text-xl font-black text-white">76</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-slate-400 mb-1">Win Rate</p>
                <p className="text-xl font-black text-emerald-400">55%</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-slate-400 mb-1">Net Profit</p>
                <p className="text-xl font-black text-amber-400">+$140</p>
              </div>
            </div>

            {/* Right side - CTA */}
            <div className="flex-shrink-0">
              <div className="bg-amber-700 hover:bg-amber-600 text-white font-semibold px-5 py-2.5 rounded-lg text-sm transition-all flex items-center gap-2 shadow-sm hover:shadow-md cursor-pointer">
                <BarChart3 className="w-4 h-4" />
                Open Journal
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
      {/* X Compact Trading Journal Showcase X */}

      <main className="max-w-7xl mx-auto px-4 md:px-6 py-4 md:py-6 relative">
        {/* Grid layout: Article on left, Analyzer in center */}
        <div className="grid grid-cols-1 lg:grid-cols-[350px_1fr] gap-6 mb-6">
          {/* Article of the Day - Left Column (Desktop only) */}
          <div className="hidden lg:block">
            <ArticleOfTheDay />
          </div>

          {/* Compact AI Analyzer - Center Column */}
          <div id="main-analyzer" className="relative z-20 overflow-visible bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-xl p-4 md:p-6 shadow-lg">

            <div className="relative z-10 flex flex-col items-center text-center mb-4">
              <p className="text-xs uppercase tracking-[0.2em] text-[var(--accent-primary)]/80 font-semibold">{t.primaryEngine}</p>
              <h2 className="text-lg md:text-2xl font-bold text-[var(--text-primary)] mt-1">{t.aiStockAnalyzer}</h2>
            </div>

            <div className="flex flex-col items-center w-full max-w-2xl mx-auto px-2 relative z-10">
              {authError && !showAuthModal && !showPaywall && (
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
                <div className="flex items-center bg-slate-950/70 border border-slate-800 rounded-xl overflow-hidden shadow-lg focus-within:border-blue-500/50 transition-all">
                  <input
                    id="ticker-input"
                    name="ticker"
                    type="text"
                    placeholder={t.searchPlaceholder}
                    className="w-full bg-transparent p-3 text-sm outline-none uppercase font-mono text-white"
                    value={ticker}
                    autoComplete="disabled-by-admin"
                    autoCorrect="off"
                    spellCheck="false"
                    autoCapitalize="off"
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
                  <button onClick={() => handleAnalyze()} disabled={loading} className="bg-blue-600 hover:bg-blue-500 px-4 md:px-5 font-semibold text-xs disabled:opacity-50 transition-all shrink-0 self-stretch flex items-center justify-center text-white rounded-r-xl">
                    {loading ? "..." : t.analyze}
                  </button>
                  <button onClick={fetchRandomStock} aria-label="Random Stock Picker" className="bg-slate-800/80 border-l border-slate-700 px-3 flex items-center justify-center hover:bg-slate-700 transition-all self-stretch">
                    <Dices className="w-5 h-5 text-purple-400" />
                  </button>
                </div>

                {/* 👇 Recent Analyses - Right Under Search Bar 👇 */}
                <div className="mt-4">
                  <Suspense fallback={<div className="h-24 w-full animate-pulse bg-slate-800/50 rounded-xl" />}>
                    <RecentAnalyses
                      recentAnalyses={recentAnalyses}
                      lang={lang}
                      setTicker={setTicker}
                      handleAnalyze={handleAnalyze}
                    />
                  </Suspense>
                </div>
                {/* X Recent Analyses X */}

                {showSuggestions && suggestions.length > 0 && (
                  <div className="absolute left-0 right-0 mt-2 rounded-xl shadow-2xl overflow-hidden z-[9999] max-h-[240px] overflow-y-auto custom-scrollbar ring-1 ring-white/10" style={{
                    backgroundColor: 'var(--card-bg)',
                    border: '1px solid var(--border-primary)'
                  }}>
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

              {/* Loading State - Premium AI Analysis Animation */}
              {loading && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  className="w-full mt-4"
                >
                  <div className="bg-gradient-to-br from-blue-900/40 via-purple-900/40 to-blue-900/40 border-2 border-blue-500/30 rounded-2xl p-6 text-center relative overflow-hidden">
                    {/* Animated background gradient */}
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-blue-600/10 animate-pulse" />

                    {/* Floating particles effect */}
                    <div className="absolute inset-0 overflow-hidden">
                      {[...Array(5)].map((_, i) => (
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
          </div> {/* End of analyzer column */}
        </div> {/* End of 2-column grid */}

        {/* Article of the Day - Mobile only */}
        <div className="lg:hidden mb-6">
          <ArticleOfTheDay />
        </div>

        {/* Financial Tool Suite - Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-10 items-start">
          {/* Random Stock Picker Card */}
          <motion.div
            whileHover={{ y: -2 }}
            className="relative overflow-hidden bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-xl p-5 flex flex-col gap-3 shadow-lg"
          >

            {/* Spinner Display */}
            {spinnerRolling || selectedSpinnerTicker ? (
              <div className="relative z-10 text-center">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-slate-400 text-xs uppercase tracking-widest animate-pulse">{t.spinning}</p>
                  {!spinnerRolling && selectedSpinnerTicker && (
                    <button
                      onClick={() => {
                        setSelectedSpinnerTicker(null);
                        setDisplaySymbol("????");
                        setDisplayName("");
                        setDisplayPrice(undefined);
                      }}
                      className="text-slate-400 hover:text-white hover:bg-slate-800 p-1.5 rounded-lg transition"
                      title="Reset"
                    >
                      <XCircle className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <div className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-blue-400 to-purple-400 font-mono mb-3 animate-bounce">
                  {displaySymbol}
                </div>
                {displayName && <p className="text-slate-300 text-sm font-semibold mb-1">{displayName}</p>}
                {displayPrice && <p className="text-emerald-400 text-xl font-bold">${displayPrice.toFixed(2)}</p>}
              </div>
            ) : (
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-xs uppercase tracking-[0.15em] text-purple-300/80 font-semibold">{t.instantPick}</p>
                    <h3 className="text-xl font-bold text-[var(--text-primary)] mt-1">{t.stockSpinner}</h3>
                    <p className="text-xs text-purple-200 font-semibold mt-1">{t.luckyDipAnalysis}</p>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-purple-600/15 border border-purple-400/30 flex items-center justify-center">
                    <Dices className="text-purple-100" size={24} />
                  </div>
                </div>
                <p className="text-slate-100 text-sm leading-relaxed mb-3">{t.spinWheelDesc}</p>
                <div className="grid grid-cols-2 gap-2 text-[11px] font-semibold">
                  <span className="bg-purple-600/25 border border-purple-400/50 rounded-lg px-2.5 py-1.5 text-center text-purple-100 hover:bg-purple-600/35 transition">MSFT</span>
                  <span className="bg-blue-600/25 border border-blue-400/50 rounded-lg px-2.5 py-1.5 text-center text-blue-100 hover:bg-blue-600/35 transition">AMZN</span>
                  <span className="bg-emerald-600/25 border border-emerald-400/50 rounded-lg px-2.5 py-1.5 text-center text-emerald-100 hover:bg-emerald-600/35 transition">TSLA</span>
                  <span className="bg-orange-600/25 border border-orange-400/50 rounded-lg px-2.5 py-1.5 text-center text-orange-100 hover:bg-orange-600/35 transition">AAPL</span>
                </div>
              </div>
            )}

            {/* Spin Button */}
            <button
              onClick={spinTicker}
              disabled={spinnerRolling}
              className="inline-flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-500 text-white font-semibold px-4 py-2.5 rounded-lg text-sm transition shadow-sm disabled:opacity-70 relative z-10"
            >
              <Dices className="text-white" size={16} />
              {spinnerRolling ? t.spinning : t.spinAgain}
            </button>

            {/* Action Buttons */}
            {selectedSpinnerTicker && !spinnerRolling && (
              <div className="flex gap-2 relative z-10">
                <button onClick={() => handleSpinnerAnalyze()} disabled={loading} className="flex-1 bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold py-2 rounded-lg transition disabled:opacity-60">
                  {t.analyze} (1C)
                </button>
                <button onClick={() => router.push(`/calendar`)} className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-bold py-2 rounded-lg transition">
                  {t.calendar}
                </button>
                <button onClick={() => setSelectedSpinnerTicker(null)} className="bg-slate-700 hover:bg-slate-600 text-slate-300 font-bold py-2 px-3 rounded-lg transition" title="Hide options">
                  ✕
                </button>
              </div>
            )}
          </motion.div>

          {/* Global Event Timer Card - The Pulse */}
          <motion.div
            whileHover={{ y: -2 }}
            className="relative overflow-hidden bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-xl p-6 flex flex-col gap-4 shadow-lg"
          >

            {/* Terminal-style header */}
            <div className="flex items-center justify-between relative z-10">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-cyan-400" />
                <div>
                  <p className="text-xs uppercase tracking-[0.15em] text-cyan-300/80 font-semibold">{t.commandCenter}</p>
                  <h3 className="text-lg font-bold text-[var(--text-primary)] mt-0.5">{t.globalEventTimer}</h3>
                </div>
              </div>
              <div className="w-10 h-10 rounded-xl bg-cyan-600/15 border border-cyan-400/25 flex items-center justify-center">
                <Timer className="text-cyan-100" size={20} />
              </div>
            </div>

            {/* Live Countdown with Impact Indicator */}
            <div className="text-center relative z-10 space-y-3">
              <div className="flex items-center justify-center gap-2 mb-2">
                <span className="text-xs text-slate-400 uppercase tracking-wide">{t.nextEvent}</span>
                {nextEvent && (
                  <div className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide ${nextEvent.importance === 'High' ? 'bg-red-500/20 text-red-300 border border-red-500/30' :
                    nextEvent.importance === 'Medium' ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30' :
                      'bg-green-500/20 text-green-300 border border-green-500/30'
                    }`}>
                    {nextEvent.importance === 'High' ? t.highImpact : nextEvent.importance === 'Medium' ? t.mediumImpact : t.lowImpact}
                  </div>
                )}
              </div>

              <div className="text-4xl font-mono font-bold text-cyan-300 mb-2 font-black tracking-wider">
                {countdown}
              </div>

              <div className="space-y-1">
                <p className="text-slate-200 text-sm font-semibold leading-tight">
                  {nextEvent ? nextEvent.name : "Loading..."}
                </p>
                {nextEvent && (
                  <p className="text-slate-400 text-xs">
                    {nextEvent.ai_impact_note}
                  </p>
                )}
              </div>
            </div>

            <Link href="/calendar" className="inline-flex items-center justify-center gap-2 bg-cyan-700 hover:bg-cyan-600 text-white font-semibold px-5 py-2.5 rounded-lg text-sm transition-all duration-200 relative z-10">
              <Calendar className="w-4 h-4" />
              {t.viewFullCalendar}
            </Link>
          </motion.div>


          {/* 👇 Compact Regret Machine - Added to Grid 👇 */}
          <Suspense fallback={<div className="h-full w-full animate-pulse bg-slate-800/50 rounded-xl" />}>
            <RegretMachine lang={lang} compact={true} />
          </Suspense>
          {/* X Compact Regret Machine X */}
        </div> {/* End of 3-card grid */}

        {/* 👇 Regret Machine REMOVED from here 👇 */}

        {/* 👇 Master Universe Heatmap 👇 */}
        <Suspense fallback={<div className="h-96 w-full animate-pulse bg-slate-800/50 rounded-xl mb-8" />}>
          <MasterUniverseHeatmap
            lang={lang}
            t={t}
          />
        </Suspense>
        {/* X Master Universe Heatmap X */}

        {/* 👇 Portfolio Teaser - High-End Advertisement 👇 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative mb-6 overflow-hidden"
        >
          {/* Shimmer Effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-yellow-400/10 to-transparent -translate-x-full animate-shimmer opacity-0" style={{ animation: 'shimmer 3s infinite' }} />

          {/* Glassmorphism Card */}
          <div className="relative bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-xl p-8 shadow-lg overflow-hidden">

            {/* PRO FEATURE Banner */}
            <div className="relative z-20 mb-6">
              <div className="bg-amber-500/10 border border-amber-400/25 rounded-xl p-3 backdrop-blur-sm">
                <div className="flex items-center justify-center gap-2">
                  <span className="text-amber-300/80 font-semibold text-xs uppercase tracking-wide">
                    PRO EXCLUSIVE: Advanced Portfolio Analytics
                  </span>
                </div>
              </div>
            </div>

            {/* Pro Status Badge */}
            {!user?.is_pro && (
              <div className="absolute top-4 right-4 z-30">
                <div className="bg-[var(--bg-tertiary)] border border-amber-500/20 rounded-lg px-3 py-1.5">
                  <span className="text-xs text-amber-400 font-semibold flex items-center gap-1.5">
                    PRO Feature
                  </span>
                </div>
              </div>
            )}

            {/* Fully Visible Content */}
            <div className="relative z-10">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-xs uppercase tracking-[0.15em] text-blue-300/80 font-semibold">Portfolio Tracker</p>
                  <h3 className="text-2xl font-bold text-[var(--text-primary)] mt-1">Professional Portfolio</h3>
                  <p className="text-xs text-blue-200 font-semibold mt-1">Real-time tracking & analytics</p>
                </div>
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600/30 to-purple-600/10 border border-blue-400/40 flex items-center justify-center shadow-lg">
                  <PieChart className="text-blue-100" size={28} />
                </div>
              </div>

              {/* Balance */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6 mb-6"
              >
                <div className="text-center">
                  <p className="text-sm text-slate-400 mb-1">Total Balance</p>
                  <p className="text-3xl font-black text-white">$25,430.00</p>
                  <div className="flex items-center justify-center gap-2 mt-2">
                    <TrendingUp className="w-4 h-4 text-green-400" />
                    <span className="text-green-400 font-semibold text-sm">+12.5% this month</span>
                  </div>
                </div>
              </motion.div>

              {/* Holdings */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                viewport={{ once: true }}
                className="mb-6"
              >
                <h4 className="text-lg font-bold text-white mb-4">Top Holdings</h4>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  {[
                    { symbol: 'AAPL', name: 'Apple Inc.', change: '+2.3%' },
                    { symbol: 'NVDA', name: 'NVIDIA', change: '+5.7%' },
                    { symbol: 'TSLA', name: 'Tesla', change: '-1.2%' },
                    { symbol: 'BTC', name: 'Bitcoin', change: '+8.9%' },
                    { symbol: 'MSFT', name: 'Microsoft', change: '+1.8%' }
                  ].map((holding, index) => (
                    <motion.div
                      key={holding.symbol}
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      viewport={{ once: true }}
                      className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-3 text-center hover:bg-slate-800/70 transition-all"
                    >
                      <p className="font-bold text-white text-sm">{holding.symbol}</p>
                      <p className="text-xs text-slate-400 truncate">{holding.name}</p>
                      <p className={`text-xs font-semibold mt-1 ${holding.change.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
                        {holding.change}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Sparkline Chart */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true }}
                className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6 mb-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-bold text-white">Performance</h4>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-green-400 font-semibold text-sm">Live</span>
                  </div>
                </div>
                {/* Animated Sparkline */}
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                  viewport={{ once: true }}
                  className="h-20 flex items-end justify-between gap-1"
                >
                  {[20, 25, 22, 30, 28, 35, 32, 40, 38, 45, 42, 50, 48, 55, 52, 60, 58, 65, 62, 70].map((height, i) => (
                    <motion.div
                      key={i}
                      initial={{ height: 0 }}
                      whileInView={{ height: `${height}%` }}
                      transition={{ duration: 0.5, delay: i * 0.05 }}
                      viewport={{ once: true }}
                      className="bg-gradient-to-t from-green-500 to-green-400 rounded-sm flex-1 min-w-[2px] hover:from-green-400 hover:to-green-300 transition-all"
                    />
                  ))}
                </motion.div>
                <div className="flex justify-between text-xs text-slate-400 mt-2">
                  <span>1M ago</span>
                  <span className="text-green-400 font-semibold">+12.5%</span>
                  <span>Now</span>
                </div>
              </motion.div>

              {/* Features */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                viewport={{ once: true }}
                className="mb-6"
              >
                <h4 className="text-lg font-bold text-white mb-4">Premium Features</h4>
                <div className="space-y-3">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.4 }}
                    viewport={{ once: true }}
                    className="flex items-center gap-3"
                  >
                    <CheckCircle className="w-5 h-5 text-green-400 shrink-0" />
                    <span className="text-slate-300 text-sm">Real-Time Tracking: Instant updates via SWR (No-refresh needed)</span>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.5 }}
                    viewport={{ once: true }}
                    className="flex items-center gap-3"
                  >
                    <CheckCircle className="w-5 h-5 text-green-400 shrink-0" />
                    <span className="text-slate-300 text-sm">Alpha Market Insights: Direct connection to MarketWatchtower data</span>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.6 }}
                    viewport={{ once: true }}
                    className="flex items-center gap-3"
                  >
                    <CheckCircle className="w-5 h-5 text-green-400 shrink-0" />
                    <span className="text-slate-300 text-sm">Smart 5-Asset View: Specialized focus on your core investments</span>
                  </motion.div>
                </div>
              </motion.div>
            </div>

            {/* CTA Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              viewport={{ once: true }}
              className="relative z-30 mt-6 pt-6 border-t border-slate-700/50"
            >
              <div className="text-center">
                <Link
                  href={user?.is_pro ? "/portfolio" : "/pricing"}
                  className="bg-amber-600 hover:bg-amber-500 text-white font-semibold px-6 py-2.5 rounded-lg text-sm transition-all mb-4 inline-block flex items-center gap-2 w-fit mx-auto"
                >
                  {user?.is_pro ? (
                    <>
                      <PieChart className="w-4 h-4" />
                      Open Portfolio Dashboard
                    </>
                  ) : (
                    <>
                      PRO — Upgrade to PRO — $9.99/mo
                    </>
                  )}
                </Link>
              </div>
            </motion.div>
          </div>
        </motion.div>
        {/* X Portfolio Teaser - High-End Advertisement X */}


        {/* --- الصق الكود هنا --- */}
        {randomTicker && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in">
            <div className="bg-slate-900 border border-purple-500/30 p-8 rounded-3xl max-w-sm w-full text-center relative shadow-2xl">
              <div className="bg-purple-900/20 p-4 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6 border border-purple-500/30">
                <Zap className="w-8 h-8 text-purple-400" />
              </div>
              <h2 className="text-2xl font-bold mb-2 text-white">{t.randomTitle}</h2>
              <p className="text-slate-400 mb-6 text-sm">{t.randomDesc} <span className="font-bold text-white text-lg block mt-2 font-mono bg-slate-800 py-1 rounded border border-slate-700">{randomTicker}</span></p>
              <div className="flex gap-3">
                <button onClick={confirmRandomAnalysis} className="flex-1 bg-purple-600 hover:bg-purple-500 text-white font-bold py-3 rounded-xl transition">{t.analyze}</button>
                <button onClick={() => setRandomTicker(null)} className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold py-3 rounded-xl transition">{t.cancel}</button>
              </div>
            </div>
          </div>
        )}

        {/* 👇 Analysis Complete - Show Confirmation Modal 👇 */}
        {analysisComplete && !loading && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
            <div className="p-6 md:p-8 rounded-3xl max-w-lg w-full relative shadow-2xl" style={{
              backgroundColor: 'var(--card-bg)',
              border: '1px solid var(--border-primary)'
            }}>
              <button onClick={() => setAnalysisComplete(false)} className="absolute top-5 right-5 text-slate-500 hover:text-white transition-colors">
                <XCircle className="w-6 h-6" />
              </button>

              <div className="text-center">
                <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-emerald-400" />
                </div>
                <h3 className="text-lg md:text-xl font-black text-white mb-2">
                  {lang === 'ar' ? "اكتمل التحليل!" : "Analysis Complete!"}
                </h3>
                <p className="text-slate-400 text-xs md:text-sm mb-6 leading-relaxed">
                  {lang === 'ar' ? "تم إكمال تحليل السهم بنجاح. هل تريد عرض التقرير الآن؟" :
                    "Your stock analysis is ready. Would you like to view the detailed report now?"}
                </p>
                <Link
                  href={`/analysis/${sessionStorage.getItem('analysis_ticker') || ''}`}
                  onClick={handleViewReport}
                  className="bg-emerald-600 hover:bg-emerald-500 px-8 py-3 font-black text-sm transition-colors text-white rounded-lg w-full text-center block"
                >
                  {lang === 'ar' ? "عرض التقرير الآن" : "View Report Now"}
                </Link>
              </div>
            </div>
          </div>
        )}

        {!result && !loading && !analysisComplete && (
          <div className="flex flex-col items-center justify-center mt-4 md:mt-8 animate-in fade-in duration-700">

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 w-full max-w-5xl px-2">
              <div className="bg-slate-900/50 border border-slate-800 p-4 md:p-6 rounded-2xl hover:border-blue-500/30 transition group">
                <div className="bg-blue-900/20 p-2 md:p-3 rounded-lg w-fit mb-3 md:mb-4"><Brain className="w-5 h-5 md:w-6 md:h-6 text-blue-400" /></div>
                <h3 className="text-base md:text-lg font-bold text-slate-200 mb-2">{t.feat1Title}</h3>
                <p className="text-xs md:text-sm text-slate-400 leading-relaxed">{t.feat1Desc}</p>
              </div>
              <div className="bg-slate-900/50 border border-slate-800 p-4 md:p-6 rounded-2xl hover:border-purple-500/30 transition group">
                <div className="bg-purple-900/20 p-2 md:p-3 rounded-lg w-fit mb-3 md:mb-4"><TrendingUp className="w-5 h-5 md:w-6 md:h-6 text-purple-400" /></div>
                <h3 className="text-base md:text-lg font-bold text-slate-200 mb-2">{t.feat2Title}</h3>
                <p className="text-xs md:text-sm text-slate-400 leading-relaxed">{t.feat2Desc}</p>
              </div>
              <div className="bg-slate-900/50 border border-slate-800 p-4 md:p-6 rounded-2xl hover:border-emerald-500/30 transition group">
                <div className="bg-emerald-900/20 p-2 md:p-3 rounded-lg w-fit mb-3 md:mb-4"><ShieldCheck className="w-5 h-5 md:w-6 md:h-6 text-emerald-400" /></div>
                <h3 className="text-base md:text-lg font-bold text-slate-200 mb-2">{t.feat3Title}</h3>
                <p className="text-xs md:text-sm text-slate-400 leading-relaxed">{t.feat3Desc}</p>
              </div>
            </div>
          </div>
        )}

        {showAuthModal && (
          // 👇 التعديل الأول: خلفية أخف (black/60) و Blur أنعم (backdrop-blur-sm)
          // وأضفنا z-[60] لضمان أنها فوق كل شيء
          <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">

            {/* 👇 التعديل الثاني: المربع نفسه بتصميم أنظف */}
            <div className="p-6 md:p-8 rounded-3xl max-w-lg w-full relative shadow-2xl overflow-y-auto max-h-[90vh] custom-scrollbar" style={{
              backgroundColor: 'var(--card-bg)',
              border: '1px solid var(--border-primary)'
            }}>

              <button onClick={() => setShowAuthModal(false)} className="absolute top-5 right-5 text-slate-500 hover:text-white transition-colors"><XCircle className="w-6 h-6" /></button>

              <div className="text-center mb-6">
                {/* 👇 نصوص بسيطة وعملية */}
                <h2 className="text-2xl font-bold text-white mb-2">
                  {authMode === "login" ? "Login" : "Create Account"}
                </h2>
                <p className="text-slate-400 text-sm">
                  {authMode === "signup" ? "Sign up to access advanced AI analysis tools." : "Enter your credentials to access your dashboard."}
                </p>
              </div>

              {/* صندوق الخطأ الأحمر */}
              {authError && <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-lg text-xs font-bold mb-5 text-center flex items-center justify-center gap-2"><AlertTriangle size={16} /> {authError}</div>}

              <div className="space-y-4">
                {/* حقول التسجيل (نفس المنطق السابق لكن بتنسيق أنظف) */}
                {authMode === "signup" && (
                  <>
                    <div className="grid grid-cols-2 gap-3 animate-in slide-in-from-bottom-2">
                      <div>
                        <label className="text-[10px] uppercase font-bold text-slate-500 ml-1 block mb-1">First Name <span className="text-red-500">*</span></label>
                        <input type="text" className="w-full bg-slate-900 border border-slate-700 focus:border-blue-500 rounded-lg p-3 text-sm text-white outline-none transition-all" value={firstName} onChange={e => setFirstName(e.target.value)} />
                      </div>
                      <div>
                        <label className="text-[10px] uppercase font-bold text-slate-500 ml-1 block mb-1">Last Name <span className="text-red-500">*</span></label>
                        <input type="text" className="w-full bg-slate-900 border border-slate-700 focus:border-blue-500 rounded-lg p-3 text-sm text-white outline-none transition-all" value={lastName} onChange={e => setLastName(e.target.value)} />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 animate-in slide-in-from-bottom-3">
                      <div>
                        <label className="text-[10px] uppercase font-bold text-slate-500 ml-1 block mb-1">Country <span className="text-red-500">*</span></label>
                        <select
                          className="w-full bg-slate-900 border border-slate-700 focus:border-blue-500 rounded-lg p-3 text-sm text-white outline-none transition-all appearance-none cursor-pointer"
                          value={country}
                          onChange={e => setCountry(e.target.value)}
                        >
                          <option value="" disabled>{lang === 'ar' ? 'اختر الدولة' : 'Select Country'}</option>
                          {/* ربط القائمة بالكود */}
                          {countriesList.map((c) => (
                            <option key={c.code} value={c.code}>
                              {c.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="text-[10px] uppercase font-bold text-slate-500 ml-1 block mb-1">Address</label>
                        <input type="text" className="w-full bg-slate-900 border border-slate-700 focus:border-blue-500 rounded-lg p-3 text-sm text-white outline-none transition-all" value={address} onChange={e => setAddress(e.target.value)} />
                      </div>
                    </div>

                    <div className="animate-in slide-in-from-bottom-4">
                      <label className="text-[10px] uppercase font-bold text-slate-500 ml-1 block mb-1">Phone <span className="text-red-500">*</span></label>
                      <input type="tel" className="w-full bg-slate-900 border border-slate-700 focus:border-blue-500 rounded-lg p-3 text-sm text-white outline-none transition-all" value={phone} onChange={e => setPhone(e.target.value)} />
                    </div>
                  </>
                )}

                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-500 ml-1 block mb-1">Email <span className="text-red-500">*</span></label>
                  <input type="email" className="w-full bg-slate-900 border border-slate-700 focus:border-blue-500 rounded-lg p-3 text-sm text-white outline-none transition-all" value={email} onChange={e => setEmail(e.target.value)} />
                </div>

                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-500 ml-1 block mb-1">Password <span className="text-red-500">*</span></label>
                  <input type="password" className="w-full bg-slate-900 border border-slate-700 focus:border-blue-500 rounded-lg p-3 text-sm text-white outline-none transition-all" value={password} onChange={e => setPassword(e.target.value)} />
                </div>

                {/* Terms & Conditions Checkbox - Only for Signup */}
                {authMode === "signup" && (
                  <div className="flex items-start gap-3 p-4 bg-slate-900/50 border border-slate-700 rounded-lg animate-in slide-in-from-bottom-5">
                    <input
                      type="checkbox"
                      id="acceptTerms"
                      checked={acceptTerms}
                      onChange={(e) => setAcceptTerms(e.target.checked)}
                      className="mt-0.5 w-4 h-4 rounded border-slate-600 bg-slate-800 text-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-0 cursor-pointer"
                    />
                    <label htmlFor="acceptTerms" className="text-xs text-slate-300 leading-relaxed cursor-pointer">
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
                  disabled={isSubmittingAuth} // يمنع الضغط المتكرر أثناء إرسال البيانات
                  className="w-full bg-blue-600 hover:bg-blue-500 py-3 rounded-lg font-bold text-sm text-white transition-all mt-4 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSubmittingAuth ? (
                    <>
                      {/* 🔄 دائرة التحميل المتحركة */}
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>{authMode === "login" ? "Logging in..." : "Creating Account..."}</span>
                    </>
                  ) : (
                    // النص الذي يظهر في الحالة العادية
                    authMode === "login" ? "Login" : "Register"
                  )}
                </button>

                <div className="text-center pt-2">
                  <button onClick={() => { setAuthMode(authMode === "login" ? "signup" : "login"); setAuthError(""); }} className="text-xs text-slate-400 hover:text-white transition-colors">
                    {authMode === "login" ? "Don't have an account? Sign up" : "Already have an account? Login"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Old paywall removed - using UpgradeModal instead */}

        <UpgradeModal
          isOpen={showUpgradeModal}
          onClose={() => setShowUpgradeModal(false)}
          trigger={modalTrigger}
        />

      </main>

      <Footer />
    </div>
  );
}
