"use client";
import { useState, useEffect, Suspense, FormEvent, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  TrendingUp, TrendingDown, DollarSign, PieChart, ShieldCheck, Target,
  CheckCircle, XCircle, BarChart3, Search, Zap, AlertTriangle, Trophy, Lightbulb, Lock, Star, LogOut, User, Calendar, Brain, HelpCircle, Activity, Twitter, Linkedin, Send, Download, Dices, ArrowRight, Newspaper
} from "lucide-react";
import { motion } from "framer-motion";
import toast from 'react-hot-toast';

// Import components
import MarketDashboard from '../src/components/MarketDashboard';
import NewsAnalysis from '../src/components/NewsAnalysis';
import ComparisonBattle from '../src/components/ComparisonBattle';
import Forecasts from '../src/components/Forecasts';
import RecentAnalyses from '../src/components/RecentAnalyses';
import Navbar from '../src/components/Navbar';
import Footer from '../src/components/Footer';
import { useAuth } from '../src/context/AuthContext';
import { useTranslation } from '../src/context/TranslationContext';

// 🔥 Use relative path to leverage Vercel rewrite (makes cookies first-party)
const BASE_URL = typeof window !== 'undefined' ? '/api' : 'https://tamtechaifinance-backend-production.up.railway.app';

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
  const { user, credits, isLoggedIn, isLoading: authLoading, login, logout, updateCredits, refreshUserData } = useAuth();
  const { lang, setLang, t, isRTL } = useTranslation();
  const [sectors, setSectors] = useState<Sector[]>([]);
  const [guestTrials, setGuestTrials] = useState(3);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);
  const [authMode, setAuthMode] = useState("signup");
  const [ticker, setTicker] = useState("");
  const [suggestions, setSuggestions] = useState<{ symbol: string, name: string }[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [userTyping, setUserTyping] = useState(false);
  const [marketPulse, setMarketPulse] = useState<any[]>([]);
  const [timeRange, setTimeRange] = useState("1Y");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [progressMessageIndex, setProgressMessageIndex] = useState(0);
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [country, setCountry] = useState("");
  const [address, setAddress] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [licenseKey, setLicenseKey] = useState("");
  const [authError, setAuthError] = useState("");
  const [showCompareModal, setShowCompareModal] = useState(false);
  const [compareTickers, setCompareTickers] = useState({ t1: "", t2: "" });
  const [compareResult, setCompareResult] = useState<any>(null);
  const [loadingCompare, setLoadingCompare] = useState(false);
  const [compareError, setCompareError] = useState<string | null>(null);

  const [randomTicker, setRandomTicker] = useState<string | null>(null);
  const [loadingRandom, setLoadingRandom] = useState(false);
  const [pickerResult, setPickerResult] = useState<{ ticker: string; name?: string; price?: number | null } | null>(null);
  const [pickerLoading, setPickerLoading] = useState(false);
  const [newsSearch, setNewsSearch] = useState("");

  const [recentAnalyses, setRecentAnalyses] = useState<any[]>([]);
  const [isSubmittingAuth, setIsSubmittingAuth] = useState(false);
  const [displaySymbol, setDisplaySymbol] = useState("????");
  const [displayName, setDisplayName] = useState("");
  const [displayPrice, setDisplayPrice] = useState<number | undefined>();
  const [spinnerRolling, setSpinnerRolling] = useState(false);
  const [selectedSpinnerTicker, setSelectedSpinnerTicker] = useState<string | null>(null);
  const rollerRef = useRef<NodeJS.Timeout | null>(null);

  // دالة لجلب التحليلات الأخيرة من الباك-إند
  const fetchRecentAnalyses = async () => {
    try {
      const res = await fetch(`${BASE_URL}/recent-analyses`);
      const data = await res.json();
      setRecentAnalyses(data);
    } catch (err) {
      console.error("Error fetching recent analyses:", err);
    }
  };

  const [sentiment, setSentiment] = useState({ sentiment: "Neutral", score: 50 });

  const fetchMarketDashboardData = async () => {
    try {
      // نستخدم BASE_URL المعرف عندك مسبقاً لضمان عمله لايف ولوكال
      const [sentRes, sectRes] = await Promise.all([
        fetch(`${BASE_URL}/market-sentiment`),
        fetch(`${BASE_URL}/market-sectors`)
      ]);

      if (sentRes.ok) setSentiment(await sentRes.json());
      if (sectRes.ok) setSectors(await sectRes.json());
    } catch (err) {
      console.log("Dashboard sync waiting for connection...");
    }
  };

  // تحديث الـ useEffect ليعمل عند فتح الصفحة أو عند أي تحليل جديد
  useEffect(() => {
    fetchMarketDashboardData();
  }, [recentAnalyses]);


  // Hook 1: جلب بيانات المستخدم والنبض العلوي
  useEffect(() => {
    const savedGuest = localStorage.getItem("guest_trials");
    if (savedGuest) setGuestTrials(parseInt(savedGuest));
    else localStorage.setItem("guest_trials", "3");

    fetchRecentAnalyses();

    const fetchPulse = async () => {
      try {
        const res = await fetch(`${BASE_URL}/market-pulse`);
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) setMarketPulse(data);
      } catch (err) { console.log("Pulse error"); }
    };
    fetchPulse();
    const interval = setInterval(fetchPulse, 60000);
    
    // SEO: Set page metadata and canonical
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
    
    return () => clearInterval(interval);
  }, []);

  // ✅ هذا هو الكود الصحيح والوحيد للاقتراحات
  useEffect(() => {
    const getSuggestions = async () => {
      // 1. إذا النص قصير جداً، لا تبحث وأخفِ القائمة
      if (!ticker || ticker.length < 2) {
        setSuggestions([]);
        setShowSuggestions(false);
        return;
      }

      // 2. إذا كان النظام مشغولاً بالتحليل أو المستخدم لا يكتب، لا تقم بالبحث
      if (loading || analysisComplete || !userTyping) return;

      try {
        const response = await fetch(`${BASE_URL}/search-ticker/${ticker}`);
        if (response.ok) {
          const data = await response.json();
          setSuggestions(data);
          setShowSuggestions(true);
        }
      } catch (error) { console.error("Search error:", error); }
    };

    // نستخدم Delay بسيط (100ms) عشان نظهر الاقتراحات أسرع
    const timer = setTimeout(getSuggestions, 100);
    return () => clearTimeout(timer);
  }, [ticker, loading, analysisComplete]); // أضفنا analysisComplete للمصفوفة

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

  const handleAuth = async () => {
    setIsSubmittingAuth(true); // 👈 تفعيل التحميل
    setAuthError(""); // تنظيف الأخطاء السابقة
    
    // Validate Terms acceptance for signup
    if (authMode === "signup" && !acceptTerms) {
      setAuthError("You must accept the Terms of Service and Privacy Policy to register.");
      setIsSubmittingAuth(false);
      return;
    }
    
    const url = authMode === "login" ? `${BASE_URL}/token` : `${BASE_URL}/register`;

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
        credentials: 'include' // 🔥 Send/receive httpOnly cookies
      });

      // 👇 التعديل الجوهري: التحقق من نوع الاستجابة قبل محاولة قراءة JSON
      const contentType = res.headers.get("content-type");
      let data;

      if (contentType && contentType.indexOf("application/json") !== -1) {
        data = await res.json();
      } else {
        // إذا لم يكن JSON (مثلاً صفحة خطأ HTML من السيرفر)، نقرأه كنص لنعرف السبب
        const text = await res.text();
        throw new Error(`Server Error (${res.status}): Please try again later.`);
      }

      // معالجة الأخطاء القادمة من الباك-إند (400, 401, 422)
      if (!res.ok) {
        if (data.detail) {
          // حالة أخطاء التحقق (Validation Errors)
          if (Array.isArray(data.detail)) {
            const messages = data.detail.map((err: any) => err.msg).join(" & ");
            setAuthError(messages);
          }
          // حالة الأخطاء المنطقية العادية
          else {
            setAuthError(data.detail);
          }
        } else {
          setAuthError("Unknown error occurred.");
        }
        return;
      }

      // ✅ النجاح
      if (authMode === "login") {
        // البيانات الآن تأتي جاهزة من السيرفر داخل data.user و data.credits
        // Token is now in httpOnly cookie, no need to pass it
        await login(data.user, data.credits); 
        setShowAuthModal(false);
      } else {
        // Registration successful - auto login and show verification banner
        setAuthError("");
        
        // Auto-login the newly registered user
        try {
          const loginResponse = await fetch(`${BASE_URL}/login`, {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            credentials: "include",
            body: new URLSearchParams({
              username: email,
              password: password
            })
          });
          
          if (loginResponse.ok) {
            const loginData = await loginResponse.json();
            await login(loginData.user, loginData.credits);
            toast.success("✅ Account created! Please check your email to verify your account.", {
              duration: 7000,
              icon: "📧"
            });
            setShowAuthModal(false);
          } else {
            const errorData = await loginResponse.json();
            console.error("Auto-login failed:", errorData);
            toast.success("✅ Account created! Please log in to continue.", {
              duration: 5000
            });
            setShowAuthModal(false);
            // Switch to login mode so user can log in
            setAuthMode("login");
            setTimeout(() => setShowAuthModal(true), 1000);
          }
        } catch (error) {
          console.error("Auto-login error:", error);
          toast.success("✅ Account created! Please log in and verify your email.", {
            duration: 5000
          });
          setShowAuthModal(false);
        }
      }

    } catch (err: any) {
      console.error("Auth Error:", err);
      // عرض السبب الحقيقي إذا كان متاحاً، وإلا عرض الرسالة العامة
      // سيظهر الآن خطأ "Failed to fetch" فقط إذا كانت المشكلة في الشبكة/CORS فعلاً
      setAuthError(err.message || "Cannot connect to server. Check your connection.");
    } finally { setIsSubmittingAuth(false); // 👈 إيقاف التحميل في كل الحالات
  }
  };

  const fetchRandomStock = async () => {
    setLoadingRandom(true);
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
      const tickerSymbol = data?.ticker || data?.symbol;

      let companyName: string | undefined;
      let lastPrice: number | null | undefined;

      try {
        const quoteRes = await fetch(`https://query1.finance.yahoo.com/v7/finance/quote?symbols=${tickerSymbol}`);
        if (quoteRes.ok) {
          const quoteData = await quoteRes.json();
          const q = quoteData?.quoteResponse?.result?.[0];
          if (q) {
            companyName = q.longName || q.shortName;
            lastPrice = typeof q.regularMarketPrice === 'number' ? q.regularMarketPrice : null;
          }
        }
      } catch (err) {
        console.warn("Quote fetch fallback", err);
      }

      setPickerResult({ ticker: tickerSymbol, name: companyName, price: lastPrice });
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
      
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      }
      
      const data = await res.json();
      console.log('🎲 V2 Random:', data.ticker, 'Version:', data.version);
      
      if (!data.ticker) {
        throw new Error('No ticker returned from server');
      }

      // Wait before stopping animation
      await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 1000));
      
      // Stop animation and set results
      if (rollerRef.current) clearInterval(rollerRef.current);
      setDisplaySymbol(data.ticker);
      setSelectedSpinnerTicker(data.ticker);

      // Fetch price from Yahoo Finance (happens in background)
      fetch(`https://query1.finance.yahoo.com/v7/finance/quote?symbols=${data.ticker}`)
        .then((r) => r.json())
        .then((q) => {
          const quote = q.quoteResponse?.result?.[0];
          if (quote) {
            setDisplayName(quote.longName || quote.shortName || "");
            setDisplayPrice(quote.regularMarketPrice);
          }
        })
        .catch(() => {});
      
      // Set rolling to false last to ensure proper state update
      setSpinnerRolling(false);
    } catch (err) {
      if (rollerRef.current) clearInterval(rollerRef.current);
      setSpinnerRolling(false);
      console.error('Random stock fetch error:', err);
      toast.error("Failed to pick a stock. Please try again.", {
        duration: 3000
      });
    }
  };

  const handleSpinnerAnalyze = async () => {
    if (!selectedSpinnerTicker) return;

    if (!isLoggedIn && guestTrials <= 0) {
      setAuthMode("signup");
      setShowAuthModal(true);
      return;
    }

    setLoading(true);
    setAuthError("");

    try {
      const res = await fetch(`${BASE_URL}/analyze/${selectedSpinnerTicker}`, { 
        credentials: 'include' // 🔒 httpOnly cookie sent automatically
      });

      if (res.status === 403) {
        const errorData = await res.json();
        console.log('Spinner 403 Error:', errorData);
        // Check if it's an email verification error
        if (errorData.detail && errorData.detail.includes("verify your email")) {
          // User is logged in but not verified
          toast.error("📧 Please verify your email first! Check your inbox.", {
            duration: 5000,
            icon: "⚠️"
          });
          setLoading(false);
          return;
        }
        // Otherwise it's IP exhaustion
        setAuthMode("signup");
        setShowAuthModal(true);
        setLoading(false);
        return;
      }

      if (res.status === 402) {
        setShowPaywall(true);
        setLoading(false);
        return;
      }

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.detail || "Stock not found");
      }

      const data = await res.json();
      sessionStorage.setItem("analysis_result", JSON.stringify(data));
      sessionStorage.setItem("analysis_ticker", selectedSpinnerTicker);
      setResult(data);
      setAnalysisComplete(true);

      if (isLoggedIn) {
        updateCredits(data.credits_left);
      } else {
        const ng = guestTrials - 1;
        setGuestTrials(ng);
        localStorage.setItem("guest_trials", ng.toString());
      }
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

  const handleAnalyze = async (overrideTicker?: string) => {
    const targetTicker = overrideTicker || ticker;
    if (!targetTicker) return;

    // Prevent double-calls while loading
    if (loading) return;

    setLoading(true);
    setAuthError("");
    setShowSuggestions(false);
    setUserTyping(false);
    setResult(null);
    setAnalysisComplete(false);

    // 1. فحص الرصيد محلياً للمسجلين
    if (isLoggedIn && credits <= 0) { setShowPaywall(true); setLoading(false); return; }

    // 2. فحص أولي للزوار (بناءً على المتصفح)
    if (!isLoggedIn && guestTrials <= 0) { setAuthMode("signup"); setShowAuthModal(true); setLoading(false); return; }

    try {
      const res = await fetch(`${BASE_URL}/analyze/${targetTicker}?lang=${lang}`, { 
        credentials: 'include' // 🔒 httpOnly cookie sent automatically
      });

      // 👇 التعديل الجديد: التعامل مع حظر الـ IP القادم من السيرفر
      if (res.status === 403) {
        const errorData = await res.json();
        console.log('403 Error received:', errorData);
        // Check if it's an email verification error
        if (errorData.detail && errorData.detail.includes("verify your email")) {
          // User is logged in but not verified - banner is already showing
          console.log('Email verification required - showing toast');
          toast.error("📧 Please verify your email first! Check your inbox.", {
            duration: 5000,
            icon: "⚠️"
          });
          setLoading(false);
          return;
        }
        // Otherwise it's IP exhaustion for guests
        console.log('Guest IP exhausted - showing auth modal');
        setAuthMode("signup");
        setShowAuthModal(true);
        setLoading(false);
        return;
      }

      if (res.status === 402) { setShowPaywall(true); return; }

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.detail || "Stock not found");
      }

      const data = await res.json();
      setResult(data);

      // Save to sessionStorage for confirmation step
      sessionStorage.setItem('analysis_result', JSON.stringify(data));
      sessionStorage.setItem('analysis_ticker', targetTicker);

      setAnalysisComplete(true);

      if (isLoggedIn) {
        updateCredits(data.credits_left);
      } else {
        // تحديث عداد المتصفح المحلي
        const ng = guestTrials - 1;
        setGuestTrials(ng);
        localStorage.setItem("guest_trials", ng.toString());
      }

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

  const handleCompare = async () => {
    if (!compareTickers.t1 || !compareTickers.t2) return;

    setCompareError(null);
    setAuthError("");

    setLoadingCompare(true);
    try {
      const res = await fetch(`${BASE_URL}/analyze-compare/${compareTickers.t1}/${compareTickers.t2}?lang=${lang}`, {
        credentials: 'include' // 🔒 httpOnly cookie sent automatically
      });

      // 👇 التعديل الجديد: إذا استنفد الزائر محاولات الـ IP (403)
      if (res.status === 403) {
        const errorData = await res.json();
        // Check if it's an email verification error
        if (errorData.detail && errorData.detail.includes("verify your email")) {
          setShowCompareModal(false);
          toast.error("📧 Please verify your email first! Check your inbox.", {
            duration: 5000,
            icon: "⚠️"
          });
          setLoadingCompare(false);
          return;
        }
        // Otherwise it's IP exhaustion
        setShowCompareModal(false); // إغلاق نافذة المقارنة
        setAuthMode("signup");      // تحويل لنمط التسجيل
        setShowAuthModal(true);     // إظهار شاشة التسجيل
        setLoadingCompare(false);
        return;
      }

      if (res.status === 402) {
        setCompareError("Insufficient credits. You need 2 credits for this battle.");
        return;
      }

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.detail || "Comparison failed");
      }

      const data = await res.json();
      setCompareResult(data);
      if (isLoggedIn) updateCredits(data.credits_left);

    } catch (err: any) {
      setCompareError(err.message || "Something went wrong. Check tickers.");
    } finally {
      setLoadingCompare(false);
    }
  };
  const handleRedeem = async () => {
    setAuthError("");
    if (!licenseKey.trim()) return;

    try {
      const res = await fetch(`${BASE_URL}/verify-license`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: 'include', // 🔒 httpOnly cookie sent automatically
        body: JSON.stringify({ license_key: licenseKey.trim() }),
      });
      const data = await res.json();
      if (data.valid) {
        updateCredits(data.credits);
        setShowPaywall(false);
        setLicenseKey("");
        alert(`🎉 Success! Balance: ${data.credits}`);
      } else {
        setAuthError(data.message);
      }
    } catch {
      setAuthError("Error connecting to server");
    }
  };

  return (
    <div dir={isRTL ? "rtl" : "ltr"} className={`min-h-screen bg-[#0b1121] text-slate-100 font-sans selection:bg-blue-500/30 overflow-x-hidden ${isRTL ? 'font-arabic' : ''}`}>
      <Suspense fallback={null}>
        <SearchParamsHandler setShowAuthModal={setShowAuthModal} setShowPaywall={setShowPaywall} />
      </Suspense>
      
      <Navbar guestTrials={guestTrials} setShowAuthModal={setShowAuthModal} setAuthMode={setAuthMode} />

      {/* الحاوية المتحركة المحدثة */}
      <div className="flex overflow-hidden relative ml-4 flex-1 items-center h-full">
        {/* استخدام motion.div يضمن سلاسة 60 إطار في الثانية حتى على الموبايلات الضعيفة */}
        <motion.div
          className="flex gap-12 items-center whitespace-nowrap py-1"
          animate={{ x: ["0%", "-50%"] }}
          transition={{
            ease: "linear",
            duration: 25,
            repeat: Infinity
          }}
        >
          {marketPulse.length > 0 ? (
            [...marketPulse, ...marketPulse].map((index, i) => (
              <div key={i} className="flex items-center gap-2 px-4 shrink-0">
                <span className="text-[10px] font-bold text-slate-500 uppercase">{index.name}</span>
                <span className="text-[11px] font-mono font-bold text-slate-200">{index.price}</span>
                <span className={`text-[9px] font-bold ${index.up ? 'text-emerald-500' : 'text-red-500'}`}>
                  {index.change}
                </span>
              </div>
            ))
          ) : (
            <span className="text-[10px] text-slate-600 animate-pulse font-bold tracking-widest uppercase px-4">
              {t.loadingMarketData}
            </span>
          )}
        </motion.div>
      </div>

      <main className="max-w-7xl mx-auto px-4 md:px-6 py-4 md:py-6 relative">
        {/* Compact AI Analyzer - Top Section */}
        <div id="main-analyzer" className="relative z-20 overflow-visible bg-gradient-to-br from-slate-900 via-slate-900 to-blue-900/20 border border-slate-800 rounded-2xl p-4 md:p-6 shadow-2xl mb-6">
          <div className="absolute -left-16 -top-16 w-48 h-48 bg-blue-600/10 blur-3xl" aria-hidden="true" />
          <div className="absolute -right-16 bottom-0 w-48 h-48 bg-emerald-500/10 blur-3xl" aria-hidden="true" />

          <div className="relative z-10 flex flex-col items-center text-center mb-4">
            <p className="text-xs uppercase tracking-[0.25em] text-blue-300 font-bold">⚡ {t.primaryEngine}</p>
            <h2 className="text-lg md:text-2xl font-black text-white mt-1">{t.aiStockAnalyzer}</h2>
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
                <button onClick={fetchRandomStock} className="bg-slate-800/80 border-l border-slate-700 px-3 flex items-center justify-center hover:bg-slate-700 transition-all self-stretch">
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
        </div>

        {/* Financial Tool Suite - Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-10">
          {/* News Terminal Card - Coming Soon */}
          <motion.div
            whileHover={{ y: -6, scale: 1.01, boxShadow: "0 20px 50px -25px rgba(59,130,246,0.45)" }}
            className="relative overflow-hidden bg-gradient-to-br from-blue-900/30 via-slate-900 to-[#0f172a] border border-blue-500/30 rounded-2xl p-5 flex flex-col gap-3 shadow-xl opacity-50 pointer-events-none"
          >
            <div className="absolute -right-10 -top-10 w-32 h-32 bg-blue-600/10 blur-3xl" aria-hidden="true" />
            <div className="absolute -left-10 -bottom-10 w-28 h-28 bg-blue-500/5 blur-2xl" aria-hidden="true" />
            
            <div className="flex items-center justify-between relative z-10">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-blue-300 font-bold">📰 {t.newsDesk}</p>
                <h3 className="text-xl font-black text-white mt-1">{t.newsTerminal}</h3>
                <p className="text-xs text-blue-200 font-semibold mt-1">{t.realTimeMarketSignals}</p>
              </div>
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600/30 to-blue-400/10 border border-blue-400/40 flex items-center justify-center shadow-lg">
                <Newspaper className="text-blue-100" size={24} />
              </div>
            </div>
            
            <p className="text-slate-200 text-sm leading-relaxed">{t.marketMoversDesc}</p>
            
            <div className="grid grid-cols-2 gap-2 text-[11px] font-semibold">
              <span className="bg-blue-600/25 border border-blue-400/50 rounded-lg px-2.5 py-1.5 text-center text-blue-100 hover:bg-blue-600/35 transition">📊 {t.fedUpdatesLabel}</span>
              <span className="bg-emerald-600/25 border border-emerald-400/50 rounded-lg px-2.5 py-1.5 text-center text-emerald-100 hover:bg-emerald-600/35 transition">💰 {t.earningsLabel}</span>
              <span className="bg-purple-600/25 border border-purple-400/50 rounded-lg px-2.5 py-1.5 text-center text-purple-100 hover:bg-purple-600/35 transition">🤝 {t.mnaDealsLabel}</span>
              <span className="bg-orange-600/25 border border-orange-400/50 rounded-lg px-2.5 py-1.5 text-center text-orange-100 hover:bg-orange-600/35 transition">🎯 NVDA, AAPL</span>
            </div>
            
            <button disabled className="inline-flex items-center justify-center gap-2 bg-slate-700 text-slate-400 font-bold px-4 py-2.5 rounded-xl text-sm shadow-lg mt-auto cursor-not-allowed">
              {t.launchTerminal} <ArrowRight size={16} />
            </button>
          </motion.div>

          {/* Random Stock Picker Card */}
          <motion.div
            whileHover={{ y: -6, scale: 1.02, boxShadow: "0 25px 60px -25px rgba(168,85,247,0.55)" }}
            className="relative overflow-hidden bg-gradient-to-br from-purple-900/40 via-slate-900 to-blue-900/30 border border-purple-500/40 ring-1 ring-purple-500/20 rounded-2xl p-5 flex flex-col gap-3 shadow-2xl"
          >
            <div className="absolute -right-12 -bottom-12 w-40 h-40 bg-purple-500/10 blur-3xl" aria-hidden="true" />
            <div className="absolute -left-10 -top-14 w-28 h-28 bg-blue-500/10 blur-3xl" aria-hidden="true" />
            
            {/* Spinner Display */}
            {spinnerRolling || selectedSpinnerTicker ? (
              <div className="relative z-10 text-center">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-slate-400 text-xs uppercase tracking-widest animate-pulse">🎰 {t.spinning}</p>
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
                {displayName && <p className="text-slate-300 text-sm font-semibold mb-1">🏢 {displayName}</p>}
                {displayPrice && <p className="text-emerald-400 text-xl font-bold">💵 ${displayPrice.toFixed(2)}</p>}
              </div>
            ) : (
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-purple-200 font-bold">🎰 {t.instantPick}</p>
                    <h3 className="text-xl font-black text-white mt-1">{t.stockSpinner}</h3>
                    <p className="text-xs text-purple-200 font-semibold mt-1">{t.luckyDipAnalysis}</p>
                  </div>
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-600/40 to-blue-600/20 border border-purple-400/50 flex items-center justify-center shadow-lg shadow-purple-900/30">
                    <span className="text-3xl animate-spin">🎲</span>
                  </div>
                </div>
                <p className="text-slate-100 text-sm leading-relaxed mb-3">{t.spinWheelDesc}</p>
                <div className="grid grid-cols-2 gap-2 text-[11px] font-semibold">
                  <span className="bg-purple-600/25 border border-purple-400/50 rounded-lg px-2.5 py-1.5 text-center text-purple-100 hover:bg-purple-600/35 transition">⚡ MSFT</span>
                  <span className="bg-blue-600/25 border border-blue-400/50 rounded-lg px-2.5 py-1.5 text-center text-blue-100 hover:bg-blue-600/35 transition">🚀 AMZN</span>
                  <span className="bg-emerald-600/25 border border-emerald-400/50 rounded-lg px-2.5 py-1.5 text-center text-emerald-100 hover:bg-emerald-600/35 transition">📈 TSLA</span>
                  <span className="bg-orange-600/25 border border-orange-400/50 rounded-lg px-2.5 py-1.5 text-center text-orange-100 hover:bg-orange-600/35 transition">💎 AAPL</span>
                </div>
              </div>
            )}

            {/* Spin Button */}
            <button
              onClick={spinTicker}
              disabled={spinnerRolling}
              className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-bold px-4 py-2.5 rounded-xl text-sm transition shadow-lg shadow-purple-900/30 disabled:opacity-70 relative z-10"
            >
              <span className="text-lg">🎰</span>
              {spinnerRolling ? t.spinning : t.spinAgain}
            </button>

            {/* Action Buttons */}
            {selectedSpinnerTicker && !spinnerRolling && (
              <div className="flex gap-2 relative z-10">
                <button onClick={() => handleSpinnerAnalyze()} disabled={loading} className="flex-1 bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold py-2 rounded-lg transition disabled:opacity-60">
                  📊 Analyze (1C)
                </button>
                <button onClick={() => router.push(`/news?ticker=${selectedSpinnerTicker}`)} className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-bold py-2 rounded-lg transition">
                  📰 News
                </button>
                <button onClick={() => setSelectedSpinnerTicker(null)} className="bg-slate-700 hover:bg-slate-600 text-slate-300 font-bold py-2 px-3 rounded-lg transition" title="Hide options">
                  ✕
                </button>
              </div>
            )}
          </motion.div>

          {/* Stock Battle Card */}
          <motion.div
            whileHover={{ y: -6, scale: 1.01, boxShadow: "0 20px 50px -25px rgba(16,185,129,0.45)" }}
            className="relative overflow-hidden bg-gradient-to-br from-emerald-900/30 via-slate-900 to-[#0f172a] border border-emerald-500/30 rounded-2xl p-5 flex flex-col gap-3 shadow-xl"
          >
            <div className="absolute -left-12 -bottom-12 w-32 h-32 bg-emerald-500/10 blur-3xl" aria-hidden="true" />
            <div className="absolute -right-10 -top-10 w-28 h-28 bg-emerald-500/5 blur-2xl" aria-hidden="true" />
            
            <div className="flex items-center justify-between relative z-10">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-emerald-300 font-bold">⚔️ {t.battleArena}</p>
                <h3 className="text-xl font-black text-white mt-1">{t.stockBattle}</h3>
                <p className="text-xs text-emerald-200 font-semibold mt-1">{t.headToHeadVerdict}</p>
              </div>
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-600/30 to-emerald-400/10 border border-emerald-400/40 flex items-center justify-center shadow-lg">
                <TrendingUp className="text-emerald-100" size={24} />
              </div>
            </div>
            
            <p className="text-slate-200 text-sm leading-relaxed">{t.battleDesc}</p>
            
            <div className="grid grid-cols-2 gap-2 text-[11px] font-semibold">
              <span className="bg-emerald-600/25 border border-emerald-400/50 rounded-lg px-2.5 py-1.5 text-center text-emerald-100 hover:bg-emerald-600/35 transition">⚡ TSLA vs F</span>
              <span className="bg-blue-600/25 border border-blue-400/50 rounded-lg px-2.5 py-1.5 text-center text-blue-100 hover:bg-blue-600/35 transition">📊 Momentum</span>
              <span className="bg-red-600/25 border border-red-400/50 rounded-lg px-2.5 py-1.5 text-center text-red-100 hover:bg-red-600/35 transition">⚠️ Risk Notes</span>
              <span className="bg-purple-600/25 border border-purple-400/50 rounded-lg px-2.5 py-1.5 text-center text-purple-100 hover:bg-purple-600/35 transition">✅ AI Verdict</span>
            </div>
            
            <button
              onClick={() => setShowCompareModal(true)}
              className="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-4 py-2.5 rounded-xl text-sm transition shadow-lg shadow-emerald-900/30"
            >
              <span className="text-lg">⚔️</span>
              Launch Battle <ArrowRight size={16} />
            </button>
          </motion.div>
        </div>

        {/* 👇 Recent Analyses👇 */}
        <RecentAnalyses
          recentAnalyses={recentAnalyses}
          lang={lang}
          setTicker={setTicker}
          handleAnalyze={handleAnalyze}
        />
        {/* X Recent Analyses X */}

        {/* 👇 radar sentiment icon 👇 */}
        <MarketDashboard sentiment={sentiment} sectors={sectors} lang={lang} t={t} />
        {/* finish radar sentiment icon  */}


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
            <div className="bg-[#0f172a] border border-slate-700 p-6 md:p-8 rounded-3xl max-w-lg w-full relative shadow-2xl">
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
            <div className="bg-[#0f172a] border border-slate-700 p-6 md:p-8 rounded-3xl max-w-lg w-full relative shadow-2xl overflow-y-auto max-h-[90vh] custom-scrollbar">

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

        {showPaywall && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in">
            <div className="bg-slate-900 border border-slate-700 p-8 rounded-3xl max-w-md w-full text-center relative shadow-2xl">
              <div className="bg-slate-800 p-4 rounded-full w-16 h-16 md:w-20 md:h-20 flex items-center justify-center mx-auto mb-6 border border-slate-700">
                <Lock className="w-6 h-6 md:w-8 md:h-8 text-yellow-400" />
              </div>

              <h2 className="text-xl md:text-3xl font-bold mb-2 text-white">{t.paywallTitle}</h2>
              <p className="text-slate-400 mb-8 text-xs md:text-sm">{t.paywallDesc}</p>

              <a href="https://tamtechfinance.gumroad.com/l/tool" className="gumroad-button block w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-3 md:py-4 rounded-xl mb-6 text-sm md:text-base cursor-pointer hover:from-blue-500 hover:to-purple-500 transition-all">
                {t.upgradeBtn}
              </a>

              <div className="flex flex-col gap-2"> {/* غيرنا التنسيق ليكون أفضل للموبايل */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder={t.inputKey}
                    className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                    value={licenseKey}
                    onChange={(e) => setLicenseKey(e.target.value)}
                  />
                  <button
                    onClick={handleRedeem}
                    className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-4 py-2 rounded-lg text-xs cursor-pointer active:scale-95 transition-all"
                  >
                    {t.redeemBtn}
                  </button>
                </div>

                {/* 👇 هذا هو السطر السحري لعرض الخطأ في الموبايل */}
                {authError && (
                  <p className="text-red-500 text-[10px] md:text-xs mt-1 animate-pulse text-left">
                    ⚠️ {authError}
                  </p>
                )}
              </div>

              <button onClick={() => setShowPaywall(false)} className="mt-6 text-[10px] md:text-xs text-slate-500 hover:text-slate-300 cursor-pointer">
                Close
              </button>
            </div>
          </div>
        )}

        <ComparisonBattle
          showCompareModal={showCompareModal}
          setShowCompareModal={setShowCompareModal}
          compareTickers={compareTickers}
          setCompareTickers={setCompareTickers}
          compareResult={compareResult}
          loadingCompare={loadingCompare}
          compareError={compareError}
          handleCompare={handleCompare}
          isLoggedIn={isLoggedIn}
          setAuthMode={setAuthMode}
          setShowAuthModal={setShowAuthModal}
        />

      </main>

      <Footer />
    </div>
  );
}
