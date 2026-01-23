"use client";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  TrendingUp, TrendingDown, DollarSign, PieChart, ShieldCheck, Target,
  CheckCircle, XCircle, BarChart3, Search, Zap, AlertTriangle, Trophy, Lightbulb, Lock, Star, LogOut, User, Calendar, Brain, HelpCircle, Activity, Twitter, Linkedin, Send, Download, Dices
} from "lucide-react";
import { motion } from "framer-motion";
import toast from 'react-hot-toast';

// Import components
import MarketDashboard from '../src/components/MarketDashboard';
import NewsAnalysis from '../src/components/NewsAnalysis';
import ComparisonBattle from '../src/components/ComparisonBattle';
import Forecasts from '../src/components/Forecasts';
import RecentAnalyses from '../src/components/RecentAnalyses';
import { useAuth } from '../src/context/AuthContext';

const BASE_URL = "https://tamtechaifinance-backend-production.up.railway.app";

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

const translations: any = {
  en: {
    loginTitle: "Login to Continue",
    signupTitle: "Create Account to Purchase",
    email: "Email Address",
    pass: "Password (Min 8 chars, 1 number)",
    loginBtn: "Login",
    signupBtn: "Sign Up",
    switchSign: "No account? Register",
    switchLog: "Have an account? Login",
    logout: "Logout",
    guestBadge: "Guest Mode",
    freeLeft: "Credits",
    registerToContinue: "Register to Continue",
    registerDesc: "You've used your 3 guest scans. Create an account to purchase credits.",
    paywallTitle: "Limit Reached",
    paywallDesc: "You have 0 credits. Purchase a Pro Key to unlock 50 deep scans.",
    searchPlaceholder: "Enter Ticker (e.g. NVDA)...",
    scan: "Running deep analysis... This might take a moment to ensure institutional accuracy.",
    analyze: "Analyze",
    verdict: "AI Verdict",
    confidence: "Confidence",
    analyst: "Analyst",
    targetPrice: "Target Price",
    low: "Low", high: "High", trend: "Trend", radar: "Radar", swot: "SWOT", bull: "Bull", bear: "Bear",
    forecasts: "AI Forecasts", oneYear: "1 Year Outlook", fiveYears: "5 Years Outlook",
    pe: "P/E Ratio", mcap: "Market Cap", growth: "Rev Growth", debt: "Debt/Eq",
    strengths: "Strengths", weaknesses: "Weaknesses", opportunities: "Opportunities", threats: "Threats",
    upgradeBtn: "Buy Pro Key ($5)", redeemBtn: "Redeem", inputKey: "License Key...", haveKey: "HAVE A KEY?",
    heroTitle: "Institutional-Grade Market Intelligence",
    heroSubtitle: "Harness the power of generative AI to decode balance sheets, valuations, and market sentiment in seconds.",
    feat1Title: "Deep Dive Valuation", feat1Desc: "Intrinsic value calculation vs market price.",
    feat2Title: "Predictive Forecasting", feat2Desc: "1-5 year price outlook based on macro trends.",
    feat3Title: "Risk & Moat Analysis", feat3Desc: "Detailed SWOT and competitive advantage breakdown.",
    metricsTitle: "Advanced Financial Metrics",
    download: "Download Report",
    disclaimerTitle: "Disclaimer",
    disclaimerText: "TamtechAI is an AI-powered analytical tool, not a financial advisor. All data and analysis are for informational purposes only. Investments carry risks.",
    reportTitle: "Investment Analysis Report",
    randomBtn: "Inspire Me",
    randomTitle: "AI Investment Pick",
    randomDesc: "Our AI brain suggests this high-potential stock. Use 1 credit to analyze:",
    cancel: "Cancel",
    tooltips: {
      pe: "Price-to-Earnings Ratio: Measures current share price relative to per-share earnings.",
      peg: "PEG Ratio: P/E ratio adjusted for growth. Under 1.0 is considered undervalued.",
      pb: "Price-to-Book: Valuation ratio comparing market cap to book value.",
      ps: "Price-to-Sales: Valuation ratio comparing stock price to revenues.",
      beta: "Beta: Measures volatility vs the market (1.0). High beta means high risk.",
      div: "Dividend Yield: Annual dividend payments relative to price.",
      roe: "Return on Equity: Measures profitability relative to shareholder equity.",
      margin: "Profit Margin: Percentage of revenue that turns into profit.",
      debt: "Debt-to-Equity: Measure of financial leverage/risk.",
      curr: "Current Ratio: Ability to pay short-term obligations."
    }
  },
  ar: {
    loginTitle: "سجل دخولك للمتابعة",
    signupTitle: "أنشئ حساباً للشراء",
    email: "البريد الإلكتروني",
    pass: "كلمة المرور",
    loginBtn: "دخول",
    signupBtn: "تسجيل",
    switchSign: "ليس لديك حساب؟ سجل الآن",
    switchLog: "لديك حساب؟ سجل دخول",
    logout: "خروج",
    guestBadge: "زائر",
    freeLeft: "رصيد",
    registerToContinue: "سجل حسابك للمتابعة",
    registerDesc: "لقد استهلكت 3 محاولات تجريبية. أنشئ حساباً الآن لشراء الرصيد.",
    paywallTitle: "نفذ رصيدك",
    paywallDesc: "رصيدك الحالي 0. اشترِ مفتاح Pro للحصول على 50 تحليل.",
    searchPlaceholder: "أدخل رمز السهم (مثلاً: NVDA)...",
    scan: " جاري التحليل العميق... قد يستغرق ذلك بضع ثوانٍ لضمان أدق النتائج",
    analyze: "حلل الآن",
    verdict: "حكم الذكاء الاصطناعي",
    confidence: "نسبة الثقة",
    analyst: "توصية المحللين",
    targetPrice: "السعر المستهدف",
    low: "أدنى", high: "أعلى", trend: "الاتجاه", radar: "الرادار", swot: "SWOT", bull: "إيجابيات", bear: "سلبيات",
    forecasts: "توقعات مستقبلية", oneYear: "توقع سنة", fiveYears: "توقع 5 سنوات",
    pe: "مكرر الربحية", mcap: "القيمة السوقية", growth: "النمو", debt: "الديون",
    strengths: "ن. قوة", weaknesses: "ن. ضعف", opportunities: "فرص", threats: "تهديدات",
    upgradeBtn: "شراء رصيد ($5)", redeemBtn: "تفعيل", inputKey: "كود التفعيل...", haveKey: "لديك كود؟",
    heroTitle: "ذكاء سوقي بمستوى المؤسسات المالية",
    heroSubtitle: "استخدم قوة الذكاء الاصطناعي لفك شفرة الميزانيات العمومية والتقييمات.",
    feat1Title: "تقييم عميق", feat1Desc: "حساب القيمة الجوهرية.",
    feat2Title: "تنبؤات مستقبلية", feat2Desc: "توقعات لأسعار 1-5 سنوات.",
    feat3Title: "تحليل المخاطر", feat3Desc: "تفصيل شامل لنقاط القوة والضعش.",
    metricsTitle: "المؤشرات المالية المتقدمة",
    download: "تحميل التقرير",
    disclaimerTitle: "إخلاء مسؤولية",
    disclaimerText: "منصة TamtechAI هي أداة تحليل مدعومة بالذكاء الاصطناعي وليست مستشاراً مالياً. جميع البيانات هي لأغراض تعليمية فقط. الاستثمار ينطوي على مخاطر.",
    reportTitle: "تقرير التحليل الاستثماري",
    randomBtn: "ألهمني",
    randomTitle: "اقتراح الذكاء الاصطناعي",
    randomDesc: "عقلنا الاصطناعي يقترح هذا السهم الواعد. هل تريد استهلاك 1 رصيد لتحليل:",
    cancel: "إلغاء",
    tooltips: {
      pe: "مكرر الربحية (P/E): يقيس سعر السهم الحالي بالنسبة لربحيته.",
      peg: "نسبة PEG: مكرر الربحية معدلاً للنمو. أقل من 1.0 يعتبر رخيصاً.",
      pb: "السعر للقيمة الدفترية (P/B): يقارن القيمة السوقية بالقيمة الدفترية.",
      ps: "السعر للمبيعات (P/S): يقيم سعر السهم بالنسبة للإيرادات.",
      beta: "بيتا (Beta): مقياس للتذبذب مقارنة بالسوق. أعلى من 1 يعني مخاطرة أعلى.",
      div: "عائد التوزيعات: النسبة المئوية للأرباح الموزعة سنوياً.",
      roe: "العائد على حقوق الملكية (ROE): يقيس ربحية الشركة بالنسبة لحقوق المساهمين.",
      margin: "هامش الربح: النسبة المئوية للإيرادات التي تتحول لربح صافي.",
      debt: "الديون للملكية: مقياس للرافعة المالية والمخاطر.",
      curr: "النسبة الحالية: قدرة الشركة على سداد التزاماتها قصيرة الأجل."
    }
  },
  it: {
    loginTitle: "Accedi", signupTitle: "Crea Account", email: "Email", pass: "Password", loginBtn: "Accedi", signupBtn: "Iscriviti",
    switchSign: "Non hai un account? Iscriviti", switchLog: "Hai un account? Accedi", logout: "Esci", guestBadge: "Ospite", freeLeft: "Crediti",
    registerToContinue: "Registrati", registerDesc: "Crea un account per acquistare crediti.", paywallTitle: "Limite Raggiunto",
    paywallDesc: "Crediti esauriti. Passa a Pro.", searchPlaceholder: "Inserisci Ticker (es. NVDA)...", scan: "Analisi profonda in corso... Potrebbe volerci un momento per garantire la massima precisione.", analyze: "Analizza",
    verdict: "Verdetto IA", confidence: "Fiducia", analyst: "Analista", targetPrice: "Prezzo Target", low: "Min", high: "Max", trend: "Trend", radar: "Radar", swot: "SWOT", bull: "Rialzista", bear: "Ribassista",
    forecasts: "Previsioni IA", oneYear: "1 Anno", fiveYears: "5 Anni", pe: "P/E", mcap: "Cap. Mercato", growth: "Crescita", debt: "Debito",
    strengths: "Punti di Forza", weaknesses: "Debolezze", opportunities: "Opportunità", threats: "Minacce", upgradeBtn: "Ottieni Chiave ($5)", redeemBtn: "Riscatta", inputKey: "Codice...", haveKey: "HAI UN CODICE?",
    heroTitle: "Intelligenza di Mercato", heroSubtitle: "Analisi finanziaria con IA.", feat1Title: "Valutazione", feat1Desc: "Valore intrinseco vs mercato.",
    feat2Title: "Previsioni", feat2Desc: "Outlook prezzi 1-5 anni.", feat3Title: "Rischi", feat3Desc: "Analisi SWOT dettagliata.", metricsTitle: "Metriche Finanziarie",
    download: "Scarica Report", disclaimerTitle: "Disclaimer", disclaimerText: "TamtechAI è uno strumento di analisi basato su IA, non un consulente finanziario. Dati a solo scopo informativo.",
    reportTitle: "Rapporto di Analisi Finanziaria", randomBtn: "Ispirami", randomTitle: "Scelta IA", randomDesc: "La nostra IA suggerisce questo titolo. Vuoi usare 1 credito?", cancel: "Annulla",
    tooltips: { pe: "P/E Ratio", peg: "PEG Ratio", pb: "P/B Ratio", ps: "P/S Ratio", beta: "Beta", div: "Dividend Yield", roe: "ROE", margin: "Margine", debt: "Debito", curr: "Current Ratio" }
  }
};

const progressMessages = [
  "Gathering real-time market data...",
  "AI is processing technical indicators and sentiment...",
  "Generating SWOT analysis and bull/bear cases...",
  "Finalizing your comprehensive report... almost there!"
];

const countriesList = [
  // الدول العربية
  { code: "JO", name: "Jordan / الأردن" },
  { code: "SA", name: "Saudi Arabia / السعودية" },
  { code: "AE", name: "UAE / الإمارات" },
  { code: "EG", name: "Egypt / مصر" },
  { code: "PS", name: "Palestine / فلسطين" },
  { code: "KW", name: "Kuwait / الكويت" },
  { code: "QA", name: "Qatar / قطر" },
  { code: "BH", name: "Bahrain / البحرين" },
  { code: "OM", name: "Oman / عمان" },
  { code: "LB", name: "Lebanon / لبنان" },
  { code: "SY", name: "Syria / سوريا" },
  { code: "IQ", name: "Iraq / العراق" },
  { code: "MA", name: "Morocco / المغرب" },
  { code: "DZ", name: "Algeria / الجزائر" },
  { code: "TN", name: "Tunisia / تونس" },
  { code: "LY", name: "Libya / ليبيا" },
  // أهم دول العالم
  { code: "US", name: "USA / أمريكا" },
  { code: "UK", name: "UK / بريطانيا" },
  { code: "IT", name: "Italy / إيطاليا" },
  { code: "DE", name: "Germany / ألمانيا" },
  { code: "FR", name: "France / فرنسا" },
  { code: "ES", name: "Spain / إسبانيا" },
  { code: "TR", name: "Turkey / تركيا" },
  { code: "CA", name: "Canada / كندا" },
  { code: "AU", name: "Australia / أستراليا" },
  { code: "CH", name: "Switzerland / سويسرا" },
  { code: "SE", name: "Sweden / السويد" },
  { code: "NL", name: "Netherlands / هولندا" },
  { code: "RU", name: "Russia / روسيا" },
  { code: "CN", name: "China / الصين" },
  { code: "JP", name: "Japan / اليابان" },
  { code: "BR", name: "Brazil / البرازيل" }
];


interface Sector {
  name: string;
  change: string;
  positive: boolean;
}



export default function Home() {
  const { user, token, credits, isLoggedIn, isLoading: authLoading, login, logout, updateCredits, refreshUserData } = useAuth();
  const [sectors, setSectors] = useState<Sector[]>([]);
  const [guestTrials, setGuestTrials] = useState(3);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);
  const [authMode, setAuthMode] = useState("signup");
  const [ticker, setTicker] = useState("");
  const [suggestions, setSuggestions] = useState<{ symbol: string, name: string }[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [marketPulse, setMarketPulse] = useState<any[]>([]);
  const [timeRange, setTimeRange] = useState("1Y");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [progressMessageIndex, setProgressMessageIndex] = useState(0);
  const [lang, setLang] = useState("en");
  const t = translations[lang] || translations.en;
  const isRTL = lang === 'ar';
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [country, setCountry] = useState("");
  const [address, setAddress] = useState("");
  const [licenseKey, setLicenseKey] = useState("");
  const [authError, setAuthError] = useState("");
  const [showCompareModal, setShowCompareModal] = useState(false);
  const [compareTickers, setCompareTickers] = useState({ t1: "", t2: "" });
  const [compareResult, setCompareResult] = useState<any>(null);
  const [loadingCompare, setLoadingCompare] = useState(false);
  const [compareError, setCompareError] = useState<string | null>(null);

  const [randomTicker, setRandomTicker] = useState<string | null>(null);
  const [loadingRandom, setLoadingRandom] = useState(false);

  const [recentAnalyses, setRecentAnalyses] = useState<any[]>([]);
  const [isSubmittingAuth, setIsSubmittingAuth] = useState(false);

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

      // 2. إذا كان النظام مشغولاً بالتحليل، لا تقم بالبحث الآن
      if (loading) return;

      try {
        const response = await fetch(`${BASE_URL}/search-ticker/${ticker}`);
        if (response.ok) {
          const data = await response.json();
          setSuggestions(data);
          setShowSuggestions(true);
        }
      } catch (error) { console.error("Search error:", error); }
    };

    // نستخدم Delay بسيط (300ms) عشان ما نضغط السيرفر مع كل حرف
    const timer = setTimeout(getSuggestions, 300);
    return () => clearTimeout(timer);
  }, [ticker, loading]); // أضفنا loading للمصفوفة

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
      const res = await fetch(url, { method: "POST", headers, body });

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
  // لا داعي للتخمين أو القيم الافتراضية
       login(data.access_token, data.user, data.credits); 
  
        setShowAuthModal(false);
        toast.success(`Welcome back, ${data.user.first_name || 'User'}! 💰 Balance: ${data.credits} credits`, {
          duration: 5000,
          icon: '🚀',
          style: {
           borderRadius: '12px',
          background: '#1e293b',
           color: '#fff',
           border: '1px solid #334155',
          fontSize: '14px',
          fontWeight: 'bold',
      },
    });
      } else {
        alert("✅ Account created successfully! Please login.");
        setAuthMode("login");
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
      const res = await fetch(`${BASE_URL}/suggest-stock`);
      const data = await res.json();
      setRandomTicker(data.ticker);
    } catch {
      setAuthError("Error fetching suggestion");
    } finally {
      setLoadingRandom(false);
    }
  };

  const confirmRandomAnalysis = () => {
    if (randomTicker) { setTicker(randomTicker); setRandomTicker(null); setTimeout(() => handleAnalyze(randomTicker), 100); }
  };

  const handleAnalyze = async (overrideTicker?: string) => {
    const targetTicker = overrideTicker || ticker;
    if (!targetTicker) return;

    setLoading(true);
    setAuthError("");
    setShowSuggestions(false);
    setResult(null);
    setAnalysisComplete(false);

    // 1. فحص الرصيد محلياً للمسجلين
    if (token && credits <= 0) { setShowPaywall(true); setLoading(false); return; }

    // 2. فحص أولي للزوار (بناءً على المتصفح)
    if (!token && guestTrials <= 0) { setAuthMode("signup"); setShowAuthModal(true); setLoading(false); return; }

    try {
      const headers: any = { "Authorization": token ? `Bearer ${token}` : "" };
      const res = await fetch(`${BASE_URL}/analyze/${targetTicker}?lang=${lang}`, { headers });

      // 👇 التعديل الجديد: التعامل مع حظر الـ IP القادم من السيرفر
      if (res.status === 403) {
        // إذا أرجع السيرفر 403، فهذا يعني أن IP الجهاز استهلك محاولاته حتى لو تلاعب بالمتصفح
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

      if (token) {
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
        headers: { "Authorization": token ? `Bearer ${token}` : "" }
      });

      // 👇 التعديل الجديد: إذا استنفد الزائر محاولات الـ IP (403)
      if (res.status === 403) {
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
      if (token) updateCredits(data.credits_left);

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
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
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
    <div dir={isRTL ? "rtl" : "ltr"} className={`min-h-screen bg-[#0b1121] text-slate-100 font-sans selection:bg-blue-500/30 ${isRTL ? 'font-arabic' : ''}`}>
      <Suspense fallback={null}>
        <SearchParamsHandler setShowAuthModal={setShowAuthModal} setShowPaywall={setShowPaywall} />
      </Suspense>
      <nav className="border-b border-slate-800 bg-[#0b1121]/80 backdrop-blur-xl sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2"><BarChart3 className="text-blue-500 w-6 h-6" /><span className="font-bold text-xl tracking-tight">TamtechAI <span className="text-blue-500">Pro</span></span></div>

          <div className="flex items-center gap-2 md:gap-4">
{/* 👇 التعديل هنا: إذا كان جاري التحميل، نعرض دائرة تحميل صغيرة بدلاً من البيانات الخاطئة */}
  {authLoading ? (
    <div className="w-20 h-8 bg-slate-800/50 rounded-full animate-pulse"></div>
  ) : token ? (
              <div className="flex items-center gap-1 bg-slate-900 border border-slate-700 px-2 py-1 rounded-full text-[10px] md:text-xs font-bold text-slate-300">
                <Star className="w-3 h-3 text-yellow-400" />
                <span>{credits}</span>
              </div>
            ) : (
              <div className="flex items-center gap-1 bg-slate-800 border border-slate-700 px-2 py-1 rounded-full text-[10px] md:text-xs font-bold text-slate-400">
                <User className="w-3 h-3" />
                <span>{guestTrials}</span>
              </div>
            )}

            {/* أزرار اللغة تظهر في الهاتف */}
            <div className="flex bg-slate-900 border border-slate-700 rounded-full p-0.5 md:p-1">
              {['en', 'ar', 'it'].map((l) => (
                <button key={l} onClick={() => setLang(l)} className={`px-2 md:px-4 py-1 rounded-full text-[10px] md:text-xs font-bold uppercase ${lang === l ? 'bg-blue-600 text-white' : 'text-slate-400'}`}>
                  {l}
                </button>
              ))}
            </div>

            {token ? (
              <button onClick={logout} className="p-1 md:p-2 text-slate-400 hover:text-red-400"><LogOut className="w-4 h-4 md:w-5 md:h-5" /></button>
            ) : (
              <button onClick={() => { setAuthMode("login"); setShowAuthModal(true); }} className="text-[10px] md:text-xs font-bold bg-slate-800 px-2 md:px-3 py-1 md:py-1.5 rounded-lg border border-slate-600">
                {t.loginBtn}
              </button>
            )}
          </div>
        </div>
      </nav>

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
              Loading Global Market Data...
            </span>
          )}
        </motion.div>
      </div>

      <main className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-10 relative">
        {/* حاوية العنوان المحدثة بمقاسات أصغر */}
        <div className="flex flex-col items-center text-center mb-6 md:mb-8">
          <h1 className="text-xl md:text-4xl font-black text-white mb-2 tracking-tighter max-w-3xl leading-none">
            {t.heroTitle}
          </h1>
          <p className="text-slate-400 max-w-xl text-[10px] md:text-sm px-4 mx-auto leading-tight opacity-80">
            {t.heroSubtitle}
          </p>
        </div>

        {/* مربع البحث والباتل مود بمساحة أصغر قليلًا */}
        <div className="flex flex-col items-center w-full max-w-lg mx-auto px-4 relative z-50 mb-8">
          {/* كود البحث والباتل مود الخاص بك... */}
        </div>

        {/* الآن ستظهر التحليلات الأخيرة والمميزات مباشرة تحتهم */}

        <div className="flex flex-col items-center mb-10 w-full max-w-xl mx-auto px-4 relative z-50">
          {/* 👇👇👇 بداية كود عرض الخطأ الجديد 👇👇👇 */}
          {authError && !showAuthModal && !showPaywall && (
            <div className="w-full mb-4 bg-red-500/10 border border-red-500/50 p-4 rounded-xl flex items-center justify-between gap-3 animate-in fade-in slide-in-from-top-2 shadow-lg backdrop-blur-md">
              <div className="flex items-center gap-3">
                <AlertTriangle className="text-red-500 w-5 h-5 shrink-0" />
                <span className="text-red-200 text-xs md:text-sm font-bold">{authError}</span>
              </div>
              <button
                onClick={() => setAuthError("")}
                className="text-red-400 hover:text-white transition-colors p-1 hover:bg-red-500/20 rounded-lg"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>
          )}
          {/* 👆👆👆 نهاية كود عرض الخطأ 👆👆👆 */}
          


          <div className="flex gap-2 w-full mb-4 relative z-50">
            <div className="flex-1 relative group">
              <div className="flex items-center bg-slate-900 border border-slate-700 rounded-xl overflow-hidden shadow-2xl focus-within:border-blue-500/50 transition-all">
                <input
                  id="ticker-input"
                  name="ticker"
                  type="text"
                  placeholder={t.searchPlaceholder}
                  className="w-full bg-transparent p-4 text-sm md:text-lg outline-none uppercase font-mono text-white"
                  value={ticker}
                  onChange={(e) => setTicker(e.target.value.toUpperCase())}
                  onFocus={() => ticker.length >= 2 && setShowSuggestions(true)}
                  onKeyDown={(e) => e.key === "Enter" && handleAnalyze()}
                />
                <button onClick={() => handleAnalyze()} disabled={loading} className="bg-blue-600 hover:bg-blue-500 px-6 font-black text-xs disabled:opacity-50 transition-colors shrink-0 self-stretch flex items-center justify-center text-white">
                  {loading ? "..." : t.analyze}
                </button>
              </div>

              {/* قائمة الاقتراحات المنسدلة المحسنة */}
              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-[#0f172a] border border-slate-700 rounded-2xl shadow-2xl overflow-hidden z-[100] max-h-[300px] overflow-y-auto custom-scrollbar ring-1 ring-white/10">
                  {suggestions.map((s, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        setTicker(s.symbol);
                        setShowSuggestions(false); // ✅ مهم: إخفاء القائمة فوراً
                        handleAnalyze(s.symbol);   // ✅ مهم: بدء التحليل فوراً
                      }}
                      className="w-full flex items-center justify-between px-5 py-3 hover:bg-blue-600/20 border-b border-slate-800/50 last:border-0 transition-all group/item text-left"
                    >
                      <div className="flex flex-col items-start text-left">
                        <span className="text-blue-400 font-black text-sm">{s.symbol}</span>
                        <span className="text-slate-500 text-[10px] font-bold truncate max-w-[200px] uppercase text-left">{s.name}</span>
                      </div>
                      <Search size={14} className="text-slate-600 group-hover/item:text-blue-500 transition-colors" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button onClick={fetchRandomStock} className="bg-slate-800 border border-slate-700 p-4 rounded-xl hover:bg-slate-700 transition-all shrink-0 h-[58px] md:h-[62px]">
              <Dices className="w-6 h-6 text-purple-400" />
            </button>
          </div>



          {/* 👇 Battle Mode Button 👇 */}


          <button onClick={() => setShowCompareModal(true)} className="w-full bg-gradient-to-r from-slate-900 to-slate-800 border border-slate-700 p-4 rounded-2xl flex items-center justify-between group hover:border-emerald-500/50 transition-all active:scale-[0.98] shadow-xl">
            <div className="flex items-center gap-3">
              <TrendingUp className="w-5 h-5 text-emerald-400" />
              <div className="text-left">
                <span className="block text-xs font-black text-white uppercase tracking-tighter italic">Stock Battle Mode</span>
                <span className="block text-[9px] text-slate-500 font-bold uppercase tracking-widest">Compare Two Giants</span>
              </div>
            </div>
            <div className="bg-slate-950 px-3 py-1 rounded-full border border-emerald-500/30 text-[10px] font-black text-emerald-400">BATTLE</div>
          </button>
        </div>
        {/* 👇 Recent Analyses👇 */}
        <RecentAnalyses
          recentAnalyses={recentAnalyses}
          lang={lang}
          setTicker={setTicker}
          handleAnalyze={handleAnalyze}
        />
        {/* X Recent Analyses X */}

        {/* 👇 Loading Animation 👇 */}
        {loading && !result && (
          <div className="flex flex-col items-center mt-20 gap-4 animate-in fade-in">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            <div className="w-full max-w-xs bg-slate-800 rounded-full h-2 overflow-hidden">
              <div className="h-full bg-gradient-to-r from-blue-500 to-emerald-500 animate-pulse" style={{width: `${((progressMessageIndex + 1) / progressMessages.length) * 100}%`}}></div>
            </div>
            <p className="text-blue-400 text-xs md:text-sm font-bold animate-pulse text-center px-6 max-w-md leading-relaxed">
              {ticker ? progressMessages[progressMessageIndex].replace('${ticker}', ticker.toUpperCase()) : progressMessages[progressMessageIndex]}
            </p>
          </div>
        )}


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

              <a href="https://tamtechfinance.gumroad.com/l/tool" target="_blank" className="block w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-3 md:py-4 rounded-xl mb-6 text-sm md:text-base cursor-pointer">
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
          token={token}
          setAuthMode={setAuthMode}
          setShowAuthModal={setShowAuthModal}
          lang={lang}
          t={t}
        />

        {/* Footer Component */}
<footer className="bg-[#0b1121] border-t border-slate-800 pt-16 pb-8 mt-20">
  <div className="max-w-7xl mx-auto px-6">
    <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12 text-left">
      
      {/* العمود الأول: الهوية */}
      <div className="col-span-1 md:col-span-1">
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 className="text-blue-500 w-6 h-6" />
          <span className="font-bold text-xl text-white">TamtechAI <span className="text-blue-500">Pro</span></span>
        </div>
        <p className="text-slate-400 text-sm mb-6 leading-relaxed">
          {isRTL ? "منصة رائدة لتحليل الأسهم باستخدام أحدث تقنيات الذكاء الاصطناعي." : "Leading stock analysis platform powered by advanced AI technology."}
        </p>
        <div className="flex gap-4">
          <a href="#" className="p-2 bg-slate-800 rounded-lg hover:text-blue-400 transition-all"><Twitter className="w-5 h-5" /></a>
          <a href="#" className="p-2 bg-slate-800 rounded-lg hover:text-blue-600 transition-all"><Linkedin className="w-5 h-5" /></a>
          <a href="#" className="p-2 bg-slate-800 rounded-lg hover:text-blue-400 transition-all"><Send className="w-5 h-5" /></a>
        </div>
      </div>

      {/* العمود الثاني: المنصة - صفحات مهمة */}
      <div>
        <h4 className="text-white font-bold mb-6 text-sm uppercase tracking-wider">{isRTL ? "المنصة" : "Platform"}</h4>
        <ul className="space-y-4 text-sm text-slate-400">
          <li><Link href="/about" className="hover:text-blue-500">{isRTL ? "من نحن" : "About Us"}</Link></li>
          <li><Link href="/pricing" className="hover:text-blue-500">{isRTL ? "الخطط والأسعار" : "Pricing Plans"}</Link></li>
          <li><Link href="/contact" className="hover:text-blue-500">{isRTL ? "اتصل بنا" : "Contact Support"}</Link></li>
        </ul>
      </div>

      {/* العمود الثالث: القانونية - التي أنشأناها */}
      <div>
        <h4 className="text-white font-bold mb-6 text-sm uppercase tracking-wider">{isRTL ? "قانوني" : "Legal"}</h4>
        <ul className="space-y-4 text-sm text-slate-400">
          <li><Link href="/terms" className="hover:text-blue-500">{isRTL ? "الشروط والأحكام" : "Terms of Service"}</Link></li>
          <li><Link href="/privacy" className="hover:text-blue-500">{isRTL ? "الخصوصية" : "Privacy Policy"}</Link></li>
          <li><Link href="/risk" className="text-red-400 hover:text-red-500 font-medium">{isRTL ? "تحذير المخاطر" : "Risk Disclosure"}</Link></li>
        </ul>
      </div>

      {/* العمود الرابع: بطاقة الثقة */}
      <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl shadow-inner">
        <h4 className="text-white font-bold mb-2 text-sm flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-green-500" />
          Enterprise Grade
        </h4>
        <p className="text-slate-500 text-[11px] leading-relaxed">
          {isRTL ? "تشفير بيانات بمستوى بنكي عالمي لضمان حماية خصوصيتك المالية." : "Bank-grade encryption to ensure your financial privacy is fully protected."}
        </p>
      </div>
    </div>

{/* إخلاء المسؤولية المالي الاحترافي والصارم */}
    <div className="border-t border-slate-800/50 pt-12 mt-12 text-center">
      <div className="max-w-4xl mx-auto mb-10 p-6 rounded-2xl bg-slate-900/30 border border-red-900/20 backdrop-blur-sm">
        <div className="flex items-center justify-center gap-2 mb-4 text-red-500/80">
          <AlertTriangle className="w-4 h-4" />
          <span className="text-[11px] font-black uppercase tracking-[0.2em]">
            {isRTL ? "تحذير قانوني صارم" : "Strict Legal Disclaimer"}
          </span>
        </div>
        
        <p className="text-slate-500 text-[11px] md:text-[12px] leading-relaxed italic text-justify md:text-center px-4">
          {isRTL 
            ? "يعد استخدام TamtechAI Pro إقراراً بأنك تدرك تماماً أن جميع التحليلات والبيانات والتقارير الصادرة هي نتاج خوارزميات ذكاء اصطناعي لأغراض معلوماتية وبحثية فقط. لا تشكل هذه البيانات بأي حال من الأحوال نصيحة استثمارية، مالية، أو قانونية. ينطوي الاستثمار في الأسواق المالية على مخاطر جوهرية قد تؤدي لفقدان رأس المال بالكامل. نحن لا نتحمل أدنى مسؤولية عن أي قرارات استثمارية تُتخذ بناءً على هذه التقارير." 
            : "The use of TamtechAI Pro constitutes an acknowledgment that all generated analyses and reports are the product of AI algorithms for informational and research purposes only. This information does not, under any circumstances, constitute financial, investment, or legal advice. Trading in financial markets involves substantial risk, including the potential loss of all invested principal. TamtechAI Pro and its affiliates are not liable for any financial losses or decisions made based on the provided data."}
        </p>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-between gap-6 px-4">
        <div className="text-slate-600 text-[10px] font-mono tracking-widest uppercase">
          © 2026 TamtechAI Pro <span className="mx-2">|</span> 
          {isRTL ? "جميع الحقوق محفوظة" : "All Rights Reserved"}
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-500/5 border border-green-500/20">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
            <span className="text-[10px] font-bold text-green-500 uppercase tracking-tighter">
              System: Operational
            </span>
          </div>
          <div className="text-slate-700 text-[10px] font-bold uppercase tracking-tighter">
            v2.4.0-Stable
          </div>
        </div>
      </div>
    </div>
  </div>
</footer>
      </main>
    </div>
  );
}
