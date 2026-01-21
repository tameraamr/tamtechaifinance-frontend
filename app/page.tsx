"use client";
import { useState, useEffect } from "react";
import { 
  TrendingUp, TrendingDown, DollarSign, PieChart, ShieldCheck, Target, 
  CheckCircle, XCircle, BarChart3, Search, Zap, AlertTriangle, Trophy, Lightbulb, Lock, Star, LogOut, User, Calendar, Brain, HelpCircle, Activity, Download, Dices 
} from "lucide-react";
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from 'recharts';
import { toPng } from 'html-to-image';
import jsPDF from 'jspdf';
import { motion } from "framer-motion";

// هذا هو "المنظف" اللي بيحذف Headline وبيقصر الأرقام
const cleanAIOutput = (text: string) => {
  if (!text) return "";
  return text
    .replace(/^Headline:\s*.+?:\s*/i, "") // بيحذف Headline واسم الشركة المتكرر
    .replace(/^Headline:\s*/i, "")        // بيحذف كلمة Headline لوحدها
    .replace(/(\d+\.\d{3,})/g, (m) => parseFloat(m).toFixed(2)); // بيقصر الأرقام الطويلة
};

const BASE_URL = "https://tamtechaifinance-backend-production.up.railway.app";

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

const formatNewsDate = (dateString: string) => {
  if (!dateString) return "";
  try {
    const date = new Date(dateString);
    // إذا كان التاريخ اليوم، يظهر الوقت فقط، وإذا كان قديماً يظهر التاريخ
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  } catch (e) {
    return dateString; // في حال فشل التحويل يرجع النص الأصلي
  }
};

export default function Home() {
  const [token, setToken] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState("");
  const [guestTrials, setGuestTrials] = useState(3);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);
  const [authMode, setAuthMode] = useState("signup");
  const [credits, setCredits] = useState(0); 
  const [ticker, setTicker] = useState("");
  const [suggestions, setSuggestions] = useState<{symbol: string, name: string}[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [marketPulse, setMarketPulse] = useState<any[]>([]);
  const [timeRange, setTimeRange] = useState("1Y");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [lang, setLang] = useState("en"); 
  const t = translations[lang] || translations.en;
  const isRTL = lang === 'ar';
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


  // Hook 1: جلب بيانات المستخدم والنبض العلوي
  useEffect(() => {
    const savedGuest = localStorage.getItem("guest_trials");
    if (savedGuest) setGuestTrials(parseInt(savedGuest));
    else localStorage.setItem("guest_trials", "3");
    const savedToken = localStorage.getItem("access_token");
    if (savedToken) { setToken(savedToken); fetchUserData(savedToken); }

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

  const fetchUserData = async (currentToken: string) => {
    try {
      const res = await fetch(`${BASE_URL}/users/me`, { headers: { Authorization: `Bearer ${currentToken}` } });
      if (res.ok) { const data = await res.json(); setCredits(data.credits); setUserEmail(data.email); setShowAuthModal(false); } 
      else { logout(); }
    } catch { logout(); }
  };

const handleAuth = async () => {
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
        localStorage.setItem("access_token", data.access_token); 
        setToken(data.access_token); 
        fetchUserData(data.access_token); 
      } else { 
        alert("✅ Account created successfully! Please login."); 
        setAuthMode("login"); 
      }

    } catch (err: any) { 
        console.error("Auth Error:", err);
        // عرض السبب الحقيقي إذا كان متاحاً، وإلا عرض الرسالة العامة
        // سيظهر الآن خطأ "Failed to fetch" فقط إذا كانت المشكلة في الشبكة/CORS فعلاً
        setAuthError(err.message || "Cannot connect to server. Check your connection."); 
    }
  };
  const logout = () => { localStorage.removeItem("access_token"); setToken(null); setUserEmail(""); setResult(null); };

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
      
      if (token) {
          setCredits(data.credits_left);
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
      if (token) setCredits(data.credits_left);
      
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
        setCredits(data.credits);
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

  const handleDownloadPDF = async () => {
    const input = document.getElementById('report-content');
    if (!input) return;
    try {
        const dataUrl = await toPng(input, { cacheBust: true, pixelRatio: 2 });
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        const imgProps = pdf.getImageProperties(dataUrl);
        const imgHeight = (imgProps.height * pdfWidth) / imgProps.width;
        let heightLeft = imgHeight;
        let position = 0;
        pdf.addImage(dataUrl, 'PNG', 0, position, pdfWidth, imgHeight);
        heightLeft -= pdfHeight;
        while (heightLeft > 0) { position -= pdfHeight; pdf.addPage(); pdf.addImage(dataUrl, 'PNG', 0, position, pdfWidth, imgHeight); heightLeft -= pdfHeight; }
        pdf.save(`${ticker || "Analysis"}_TamtechAI.pdf`);
    } catch (err) { setAuthError("PDF Failed"); }
  };

  const formatNumber = (num: any) => num > 1e9 ? (num/1e9).toFixed(2)+"B" : num > 1e6 ? (num/1e6).toFixed(2)+"M" : num?.toLocaleString();
  const getVerdictColor = (v: string) => v?.includes("BUY") ? "text-emerald-400 border-emerald-500/50 bg-emerald-500/10" : v?.includes("SELL") ? "text-red-400 border-red-500/50 bg-red-500/10" : "text-yellow-400 border-yellow-500/50 bg-yellow-500/10";
  const calculateRangePos = (c: number, l: number, h: number) => Math.min(Math.max(((c-l)/(h-l))*100, 0), 100);

  const getMetricStatus = (key: string, value: number) => {
      if(!value && value !== 0) return "text-slate-200";
      switch(key) {
          case 'peg': return value < 1 ? "text-emerald-400" : value > 2 ? "text-red-400" : "text-yellow-400";
          case 'margin': return value > 20 ? "text-emerald-400" : value < 5 ? "text-red-400" : "text-yellow-400";
          case 'debt': return value < 50 ? "text-emerald-400" : value > 100 ? "text-red-400" : "text-yellow-400";
          case 'beta': return value < 1 ? "text-emerald-400" : value > 1.5 ? "text-orange-400" : "text-yellow-400";
          case 'roe': return value > 15 ? "text-emerald-400" : value < 5 ? "text-red-400" : "text-yellow-400";
          default: return "text-slate-200";
      }
  };


// هاد الكود وظيفته يفلتر البيانات حسب الزر اللي بتكبسه
const getFilteredChartData = () => {
  if (!result || !result.data || !result.data.chart_data) return [];
  
  const allData = result.data.chart_data;
  if (timeRange === '1W') return allData.slice(-7);   // آخر 7 أيام
  if (timeRange === '1M') return allData.slice(-30);  // آخر 30 يوم
  if (timeRange === '6M') return allData.slice(-180); // آخر 180 يوم
  return allData; // الحالة العادية (سنة)
};


  const MetricCard = ({ label, value, tooltipKey, metricKey, suffix = "" }: any) => (
      <div className="bg-slate-900/50 border border-slate-800 p-4 rounded-xl flex flex-col justify-between hover:border-blue-500/30 transition group relative">
          <div className="flex justify-between items-start mb-2">
              <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">{label}</span>
              <div className="relative group/tooltip">
                  <HelpCircle className="w-3 h-3 text-slate-600 cursor-help hover:text-blue-400" />
                  <div className="absolute bottom-full right-0 mb-2 w-48 bg-slate-950 border border-slate-700 text-slate-300 text-xs p-2 rounded shadow-xl hidden group-hover/tooltip:block z-10">{t.tooltips[tooltipKey]}</div>
              </div>
          </div>
          {/* التعديل هنا: فحص إذا كانت القيمة 0 أو غير موجودة */}
          <div className={`text-xl font-mono font-bold ${getMetricStatus(metricKey, value)}`} dir="ltr">
            {(!value || value === 0 || value === "0") ? (
              <span className="text-slate-500 text-xs italic font-normal">N/A</span>
            ) : (
              <>
                {typeof value === 'number' ? value.toFixed(2) : value}
                {suffix}
              </>
            )}
          </div>
      </div>
  );

  return (
    <div dir={isRTL ? "rtl" : "ltr"} className={`min-h-screen bg-[#0b1121] text-slate-100 font-sans selection:bg-blue-500/30 ${isRTL ? 'font-arabic' : ''}`}>
      <nav className="border-b border-slate-800 bg-[#0b1121]/80 backdrop-blur-xl sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2"><BarChart3 className="text-blue-500 w-6 h-6" /><span className="font-bold text-xl tracking-tight">TamtechAI <span className="text-blue-500">Pro</span></span></div>
          
          <div className="flex items-center gap-2 md:gap-4">
            {/* التعديل هنا: الرصيد يظهر في الهاتف أيضاً */}
            {token ? (
              <div className="flex items-center gap-1 bg-slate-900 border border-slate-700 px-2 py-1 rounded-full text-[10px] md:text-xs font-bold text-slate-300">
                <Star className="w-3 h-3 text-yellow-400" />
                <span>{credits}</span>
              </div>
            ) : (
              <div className="flex items-center gap-1 bg-slate-800 border border-slate-700 px-2 py-1 rounded-full text-[10px] md:text-xs font-bold text-slate-400">
                <User className="w-3 h-3"/>
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
              <button onClick={logout} className="p-1 md:p-2 text-slate-400 hover:text-red-400"><LogOut className="w-4 h-4 md:w-5 md:h-5"/></button>
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
          type="text" 
          placeholder={t.searchPlaceholder} 
          className="w-full bg-transparent p-4 text-sm md:text-lg outline-none uppercase font-mono text-white" 
          value={ticker} 
          onChange={(e) => setTicker(e.target.value.toUpperCase())} 
          onFocus={() => ticker.length >= 2 && setShowSuggestions(true)}
          onKeyDown={(e) => e.key === "Enter" && handleAnalyze()} 
        />
        <button onClick={() => handleAnalyze()} disabled={loading} className="bg-blue-600 hover:bg-blue-500 px-6 py-4 font-black text-xs md:text-base disabled:opacity-50 transition-colors shrink-0 h-full text-white">
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

        {!result && !loading && (
            <div className="flex flex-col items-center justify-center mt-4 md:mt-8 animate-in fade-in duration-700">
                <h1 className="text-2xl md:text-5xl font-bold text-center text-white mb-4 tracking-tight px-2">{t.heroTitle}</h1>
                <p className="text-slate-400 text-center max-w-2xl mb-8 md:mb-12 text-xs md:text-lg px-4">{t.heroSubtitle}</p>
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
              
              <button onClick={() => setShowAuthModal(false)} className="absolute top-5 right-5 text-slate-500 hover:text-white transition-colors"><XCircle className="w-6 h-6"/></button>
              
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
              {authError && <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-lg text-xs font-bold mb-5 text-center flex items-center justify-center gap-2"><AlertTriangle size={16}/> {authError}</div>}
              
              <div className="space-y-4">
                {/* حقول التسجيل (نفس المنطق السابق لكن بتنسيق أنظف) */}
                {authMode === "signup" && (
                    <>
                        <div className="grid grid-cols-2 gap-3 animate-in slide-in-from-bottom-2">
                            <div>
                                <label className="text-[10px] uppercase font-bold text-slate-500 ml-1 block mb-1">First Name <span className="text-red-500">*</span></label>
                                <input type="text" className="w-full bg-slate-900 border border-slate-700 focus:border-blue-500 rounded-lg p-3 text-sm text-white outline-none transition-all" value={firstName} onChange={e=>setFirstName(e.target.value)} />
                            </div>
                            <div>
                                <label className="text-[10px] uppercase font-bold text-slate-500 ml-1 block mb-1">Last Name <span className="text-red-500">*</span></label>
                                <input type="text" className="w-full bg-slate-900 border border-slate-700 focus:border-blue-500 rounded-lg p-3 text-sm text-white outline-none transition-all" value={lastName} onChange={e=>setLastName(e.target.value)} />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3 animate-in slide-in-from-bottom-3">
                            <div>
                                <label className="text-[10px] uppercase font-bold text-slate-500 ml-1 block mb-1">Country <span className="text-red-500">*</span></label>
                                <select 
                                    className="w-full bg-slate-900 border border-slate-700 focus:border-blue-500 rounded-lg p-3 text-sm text-white outline-none transition-all appearance-none cursor-pointer"
                                    value={country} 
                                    onChange={e=>setCountry(e.target.value)}
                                >
                                    <option value="" disabled>Select</option>
                                    <option value="US">USA</option>
                                    <option value="SA">Saudi Arabia</option>
                                    <option value="AE">UAE</option>
                                    <option value="EG">Egypt</option>
                                    <option value="JO">Jordan</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-[10px] uppercase font-bold text-slate-500 ml-1 block mb-1">Address</label>
                                <input type="text" className="w-full bg-slate-900 border border-slate-700 focus:border-blue-500 rounded-lg p-3 text-sm text-white outline-none transition-all" value={address} onChange={e=>setAddress(e.target.value)} />
                            </div>
                        </div>

                        <div className="animate-in slide-in-from-bottom-4">
                             <label className="text-[10px] uppercase font-bold text-slate-500 ml-1 block mb-1">Phone <span className="text-red-500">*</span></label>
                             <input type="tel" className="w-full bg-slate-900 border border-slate-700 focus:border-blue-500 rounded-lg p-3 text-sm text-white outline-none transition-all" value={phone} onChange={e=>setPhone(e.target.value)} />
                        </div>
                    </>
                )}

                <div>
                    <label className="text-[10px] uppercase font-bold text-slate-500 ml-1 block mb-1">Email <span className="text-red-500">*</span></label>
                    <input type="email" className="w-full bg-slate-900 border border-slate-700 focus:border-blue-500 rounded-lg p-3 text-sm text-white outline-none transition-all" value={email} onChange={e=>setEmail(e.target.value)} />
                </div>
                
                <div>
                    <label className="text-[10px] uppercase font-bold text-slate-500 ml-1 block mb-1">Password <span className="text-red-500">*</span></label>
                    <input type="password" className="w-full bg-slate-900 border border-slate-700 focus:border-blue-500 rounded-lg p-3 text-sm text-white outline-none transition-all" value={password} onChange={e=>setPassword(e.target.value)} />
                </div>

                <button onClick={handleAuth} className="w-full bg-blue-600 hover:bg-blue-500 py-3 rounded-lg font-bold text-sm text-white transition-all mt-4">
                    {authMode === "login" ? "Login" : "Register"}
                </button>
                
                <div className="text-center pt-2">
                    <button onClick={() => {setAuthMode(authMode==="login"?"signup":"login"); setAuthError("");}} className="text-xs text-slate-400 hover:text-white transition-colors">
                        {authMode==="login" ? "Don't have an account? Sign up" : "Already have an account? Login"}
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

      <button onClick={()=>setShowPaywall(false)} className="mt-6 text-[10px] md:text-xs text-slate-500 hover:text-slate-300 cursor-pointer">
        Close
      </button>
    </div>
  </div>
)}

        {result && !loading && (
            <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 space-y-6 md:space-y-8 pb-20 px-1 md:px-0">
                <div className="flex justify-end">
                    <button onClick={handleDownloadPDF} className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 md:px-4 py-2 rounded-lg text-xs md:text-sm font-bold border border-slate-700 transition">
                        <Download className="w-3 h-3 md:w-4 md:h-4" /> {t.download}
                    </button>
                </div>

                <div id="report-content" className="p-3 md:p-6 bg-[#0b1121] rounded-3xl border border-slate-800/50">
                    <div className="mb-6 border-b border-slate-800 pb-6 flex flex-wrap justify-between items-center gap-4">
                        <div className="flex items-center gap-3">
                            <BarChart3 className="text-blue-500 w-7 h-7 md:w-10 md:h-10" />
                            <div>
                              <h1 className="text-xl md:text-3xl font-black text-white tracking-tighter">TamtechAI <span className="text-blue-500">Pro</span></h1>
                              <p className="text-slate-500 text-[10px] md:text-xs uppercase font-bold tracking-widest">{t.reportTitle}</p>
                            </div>
                        </div>
                        <div className="text-right">
                          <div className="text-slate-200 font-mono font-black text-xl md:text-3xl">{result.ticker}</div>
                          <div className="text-slate-500 text-[10px] md:text-xs font-bold">{new Date().toLocaleDateString()}</div>
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 mb-8">
                        <div className="lg:col-span-1 bg-slate-800/40 border border-slate-700/50 rounded-2xl p-4 md:p-8 flex flex-col justify-center">
                            <div className="flex justify-between items-center mb-4">
                              <span className="bg-blue-500/10 text-blue-400 px-3 py-1 rounded-lg text-xs md:text-sm font-mono font-bold border border-blue-500/20">{result.ticker}</span>
                              {result.data.recommendationKey!=="none" && <span className="text-[10px] uppercase font-black text-blue-500">{t.analyst}: {result.data.recommendationKey.replace('_', ' ')}</span>}
                            </div>
                            <h2 className="text-2xl md:text-4xl font-black mb-1 text-white leading-tight">{result.data.companyName}</h2>
                            <div className="text-4xl md:text-6xl font-mono font-black my-6 text-white" dir="ltr">${result.data.price?.toFixed(2)}</div>
                            <div className="mb-8">
                              <div className="flex justify-between text-[10px] md:text-xs text-slate-500 font-bold mb-2">
                                <span>{t.low}: ${result.data.fiftyTwoWeekLow}</span>
                                <span>{t.high}: ${result.data.fiftyTwoWeekHigh}</span>
                              </div>
                              <div className="w-full h-2 md:h-3 bg-slate-800 rounded-full overflow-hidden relative shadow-inner">
                                <div className="h-full bg-gradient-to-r from-blue-600 via-blue-400 to-emerald-400 absolute transition-all duration-1000 shadow-[0_0_10px_rgba(59,130,246,0.5)]" 
                                     style={{ left: `${calculateRangePos(result.data.price, result.data.fiftyTwoWeekLow, result.data.fiftyTwoWeekHigh) - 2}%`, width: '4%' }}>
                                </div>
                              </div>
                            </div>
                            <div className={`p-6 rounded-2xl text-center border-2 shadow-2xl transition-all duration-500 ${getVerdictColor(result.analysis.verdict)}`}>
                              <div className="text-[10px] md:text-xs uppercase opacity-70 mb-2 font-black tracking-[0.2em]">{t.verdict}</div>
                              <span className="text-3xl md:text-5xl font-black tracking-tighter block">{result.analysis.verdict}</span>
                              <div className="mt-3 text-[10px] md:text-xs font-black bg-black/20 py-1 rounded-full">{t.confidence}: {result.analysis.confidence_score}%</div>
                            </div>
                        </div>
                        <div className="lg:col-span-2 bg-slate-900/80 border border-slate-800 rounded-3xl p-2 md:p-8 h-[300px] md:h-[500px] shadow-2xl">
                              {/* --- بداية كود الأزرار --- */}
<div className="flex justify-between items-center mb-6 bg-slate-800/30 p-2 rounded-2xl border border-slate-700/50">
  <div className="flex items-center gap-2">
    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
    <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Market History</span>
  </div>
  <div className="flex gap-1">
    {['1W', '1M', '6M', '1Y'].map((range) => (
      <button
        key={range}
        onClick={(e) => {
          e.preventDefault();
          setTimeRange(range);
        }}
        className={`px-3 py-1.5 rounded-xl text-[10px] font-black transition-all cursor-pointer ${
          timeRange === range 
          ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/40 scale-105' 
          : 'text-slate-500 hover:bg-slate-700/50 hover:text-slate-300'
        }`}
      >
        {range}
      </button>
    ))}
  </div>
</div>
{/* --- نهاية كود الأزرار --- */}                            
                            <ResponsiveContainer width="100%" height="100%">
                              <AreaChart data={getFilteredChartData()} key={timeRange}>
                                <defs>
                                  <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
                                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                                  </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                                <XAxis dataKey="date" stroke="#475569" tick={{fontSize: 9, fontWeight: 'bold'}} tickFormatter={(str) => str.slice(5)} minTickGap={30} />
                                <YAxis stroke="#475569" tick={{fontSize: 9, fontWeight: 'bold'}} domain={['auto', 'auto']} orientation={isRTL?"right":"left"} />
                                <Tooltip contentStyle={{backgroundColor: '#0f172a', borderRadius: '12px', border: '1px solid #334155', boxShadow: '0 10px 20px rgba(0,0,0,0.5)'}} />
                                <Area type="monotone" dataKey="price" stroke="#3b82f6" strokeWidth={4} fillOpacity={1} fill="url(#colorPrice)" />
                              </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="bg-slate-900/50 border border-slate-800/50 rounded-3xl p-4 md:p-8 mb-8 shadow-xl">
                        <h3 className="text-lg md:text-2xl font-black mb-6 text-white flex items-center gap-3">
                          <div className="p-2 bg-blue-500/10 rounded-xl"><Activity className="w-5 h-5 md:w-6 md:h-6 text-blue-500" /></div> 
                          {t.metricsTitle}
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-5">
                            <MetricCard label="P/E Ratio" value={result.data.pe_ratio} metricKey="pe" tooltipKey="pe" />
                            <MetricCard label="PEG Ratio" value={result.data.peg_ratio} metricKey="peg" tooltipKey="peg" />
                            <MetricCard label="Price/Sales" value={result.data.price_to_sales} metricKey="ps" tooltipKey="ps" />
                            <MetricCard label="Price/Book" value={result.data.price_to_book} metricKey="pb" tooltipKey="pb" />
                            <MetricCard label="EPS (TTM)" value={result.data.eps} metricKey="eps" tooltipKey="pe" suffix="$" />
                            <MetricCard label="Profit Margin" value={result.data.profit_margins} metricKey="margin" tooltipKey="margin" suffix="%" />
                            <MetricCard label="Operating Margin" value={result.data.operating_margins} metricKey="margin" tooltipKey="margin" suffix="%" />
                            <MetricCard label="ROE" value={result.data.return_on_equity} metricKey="roe" tooltipKey="roe" suffix="%" />
                            <MetricCard label="Dividend Yield" value={result.data.dividend_yield} metricKey="div" tooltipKey="div" suffix="%" />
                            <MetricCard label="Beta" value={result.data.beta} metricKey="beta" tooltipKey="beta" />
                            <MetricCard label="Debt/Equity" value={result.data.debt_to_equity} metricKey="debt" tooltipKey="debt" />
                            <MetricCard label="Current Ratio" value={result.data.current_ratio} metricKey="curr" tooltipKey="curr" />
                            <MetricCard label="Rev Growth" value={result.data.revenue_growth} metricKey="margin" tooltipKey="margin" suffix="%" />
                            <MetricCard label="Market Cap" value={formatNumber(result.data.market_cap)} metricKey="mcap" tooltipKey="pe" />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 mb-8">
                        <div className="bg-blue-500/[0.03] border border-blue-500/10 p-5 md:p-8 rounded-3xl group hover:bg-blue-500/[0.05] transition-all duration-500">
                          <h4 className="text-blue-500 font-black mb-4 flex gap-3 items-center text-sm md:text-xl">
                            <Calendar className="w-5 h-5 md:w-6 md:h-6"/> {t.oneYear}
                          </h4>
                          <p className="text-slate-300 text-xs md:text-base leading-relaxed font-medium">{result.analysis.forecasts?.next_1_year}</p>
                        </div>
                        <div className="bg-purple-500/[0.03] border border-purple-500/10 p-5 md:p-8 rounded-3xl group hover:bg-purple-500/[0.05] transition-all duration-500">
                          <h4 className="text-purple-500 font-black mb-4 flex gap-3 items-center text-sm md:text-xl">
                            <TrendingUp className="w-5 h-5 md:w-6 md:h-6"/> {t.fiveYears}
                          </h4>
                          <p className="text-slate-300 text-xs md:text-base leading-relaxed font-medium">{result.analysis.forecasts?.next_5_years}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-10 mb-8">
                        <div className="lg:col-span-2 space-y-6 md:space-y-8">
                            <div className="bg-slate-800/20 border border-blue-500/10 p-5 md:p-8 rounded-3xl hover:bg-slate-800/40 transition-all duration-500 group">
                              <h3 className="text-blue-500 font-black mb-4 flex gap-3 text-sm md:text-xl uppercase tracking-tighter items-center">
                                <div className="p-2 bg-blue-500/10 rounded-lg"><Target className="w-5 h-5 md:w-6 md:h-6"/></div> 
                                Business DNA
                              </h3>
                              <p className="text-slate-300 text-xs md:text-base leading-relaxed font-medium">
  {cleanAIOutput(result.analysis.chapter_1_the_business)}
</p>
                            </div>
                            <div className="bg-slate-800/20 border border-emerald-500/10 p-5 md:p-8 rounded-3xl hover:bg-slate-800/40 transition-all duration-500 group">
                              <h3 className="text-emerald-500 font-black mb-4 flex gap-3 text-sm md:text-xl uppercase tracking-tighter items-center">
                                <div className="p-2 bg-emerald-500/10 rounded-lg"><ShieldCheck className="w-5 h-5 md:w-6 md:h-6"/></div> 
                                Financial Health
                              </h3>
                              <p className="text-slate-300 text-xs md:text-base leading-relaxed font-medium">
  {cleanAIOutput(result.analysis.chapter_2_financials)}
</p>
                            </div>
                            <div className="bg-slate-800/20 border border-purple-500/10 p-5 md:p-8 rounded-3xl hover:bg-slate-800/40 transition-all duration-500 group">
                              <h3 className="text-purple-500 font-black mb-4 flex gap-3 text-sm md:text-xl uppercase tracking-tighter items-center">
                                <div className="p-2 bg-purple-500/10 rounded-lg"><DollarSign className="w-5 h-5 md:w-6 md:h-6"/></div> 
                                Valuation Analysis
                              </h3>
                              <p className="text-slate-300 text-xs md:text-base leading-relaxed font-medium">
  {cleanAIOutput(result.analysis.chapter_3_valuation)}
</p>
                            </div>
                        </div>
                        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 md:p-8 h-[350px] md:h-[500px] shadow-2xl flex flex-col sticky top-24">
                            <h3 className="text-center font-black text-slate-400 mb-6 flex justify-center gap-3 text-xs md:text-lg uppercase tracking-widest">
                              <Zap className="w-5 h-5 text-yellow-400 fill-yellow-400/20"/> {t.radar}
                            </h3>
                            <ResponsiveContainer width="100%" height="100%">
                              <RadarChart cx="50%" cy="50%" outerRadius="60%" data={result.analysis.radar_scores}>
                                <PolarGrid stroke="#1e293b" />
                                <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 10, fontWeight: 'bold' }} />
                                <PolarRadiusAxis angle={30} domain={[0, 10]} tick={false} axisLine={false} />
                                <Radar name="Score" dataKey="A" stroke="#3b82f6" strokeWidth={3} fill="#3b82f6" fillOpacity={0.5} />
                                <Tooltip contentStyle={{backgroundColor: '#0f172a', borderRadius: '12px', border: '1px solid #334155'}} />
                              </RadarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

    {/* قسم مشاعر الأخبار المطور مع الروابط والوقت */}
{result?.analysis?.news_analysis && (
  <div className="mt-8 space-y-4 animate-in fade-in slide-in-from-bottom-5 duration-1000">
    <div className="flex items-center justify-center gap-2 mb-6">
      <div className="h-px w-8 bg-slate-800"></div>
      <h3 className="font-black text-slate-500 text-[10px] uppercase tracking-[0.3em] flex items-center gap-2">
        <Activity className="w-3 h-3 text-blue-500" /> Market Pulse
      </h3>
      <div className="h-px w-8 bg-slate-800"></div>
    </div>
    
    <div className="space-y-3">
      {result.analysis.news_analysis.map((news: any, i: number) => (
        <a 
          key={i} 
          href={news.url || "#"} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="block bg-slate-900/40 border border-slate-800/50 p-4 rounded-2xl hover:border-blue-500/40 hover:bg-slate-900/60 transition-all group cursor-pointer"
        >
          <div className="flex justify-between items-start mb-2 gap-3">
            <p className="text-slate-300 text-[11px] font-bold leading-relaxed group-hover:text-blue-400 transition-colors line-clamp-2 flex-1 text-left">
              {news.headline}
            </p>
            <span className="text-[9px] text-slate-500 font-medium ml-2 whitespace-nowrap">
  {formatNewsDate(news.time)}
</span>
          </div>

          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center">
              {news.sentiment === 'positive' ? (
                <span className="flex items-center gap-1 text-[9px] font-black text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full uppercase">
                  <TrendingUp size={10} /> Bullish
                </span>
              ) : news.sentiment === 'negative' ? (
                <span className="flex items-center gap-1 text-[9px] font-black text-red-400 bg-red-500/10 px-2 py-0.5 rounded-full uppercase">
                  <TrendingDown size={10} /> Bearish
                </span>
              ) : (
                <span className="text-[9px] font-black text-slate-500 bg-slate-500/10 px-2 py-0.5 rounded-full uppercase">
                  Neutral
                </span>
              )}
            </div>
            
            <div className="flex items-center gap-2">
               <div className="w-12 h-1 bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${news.sentiment === 'positive' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : news.sentiment === 'negative' ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]' : 'bg-slate-500'}`} 
                    style={{ width: `${(news.impact_score || 5) * 10}%` }}
                  ></div>
               </div>
            </div>
          </div>
        </a>
      ))}
    </div>
  </div>
)}

                    <div className="bg-slate-900/80 border border-slate-800/50 p-6 md:p-12 rounded-[2.5rem] mb-12 shadow-2xl">
                        <h3 className="text-2xl md:text-4xl font-black mb-10 text-center text-white tracking-tight">{t.swot}</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
                            <div className="bg-emerald-900/10 border border-emerald-500/20 p-6 md:p-8 rounded-3xl transform hover:scale-[1.02] transition-all">
                              <h4 className="text-emerald-400 font-black mb-4 flex gap-3 items-center text-sm md:text-xl"><CheckCircle size={24}/> {t.strengths}</h4>
                              <ul className="space-y-3">{result.analysis.swot_analysis.strengths.map((s:any,i:any)=><li key={i} className="text-slate-300 text-xs md:text-sm font-medium flex gap-2"><span>•</span> {s}</li>)}</ul>
                            </div>
                            <div className="bg-orange-900/10 border border-orange-500/20 p-6 md:p-8 rounded-3xl transform hover:scale-[1.02] transition-all">
                              <h4 className="text-orange-400 font-black mb-4 flex gap-3 items-center text-sm md:text-xl"><AlertTriangle size={24}/> {t.weaknesses}</h4>
                              <ul className="space-y-3">{result.analysis.swot_analysis.weaknesses.map((s:any,i:any)=><li key={i} className="text-slate-300 text-xs md:text-sm font-medium flex gap-2"><span>•</span> {s}</li>)}</ul>
                            </div>
                            <div className="bg-blue-900/10 border border-blue-500/20 p-6 md:p-8 rounded-3xl transform hover:scale-[1.02] transition-all">
                              <h4 className="text-blue-400 font-black mb-4 flex gap-3 items-center text-sm md:text-xl"><Lightbulb size={24}/> {t.opportunities}</h4>
                              <ul className="space-y-3">{result.analysis.swot_analysis.opportunities.map((s:any,i:any)=><li key={i} className="text-slate-300 text-xs md:text-sm font-medium flex gap-2"><span>•</span> {s}</li>)}</ul>
                            </div>
                            <div className="bg-red-900/10 border border-red-500/20 p-6 md:p-8 rounded-3xl transform hover:scale-[1.02] transition-all">
                              <h4 className="text-red-400 font-black mb-4 flex gap-3 items-center text-sm md:text-xl"><XCircle size={24}/> {t.threats}</h4>
                              <ul className="space-y-3">{result.analysis.swot_analysis.threats.map((s:any,i:any)=><li key={i} className="text-slate-300 text-xs md:text-sm font-medium flex gap-2"><span>•</span> {s}</li>)}</ul>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
                        <div className="bg-emerald-900/5 border border-emerald-500/10 p-6 md:p-10 rounded-3xl">
                          <h3 className="text-lg md:text-2xl font-black text-emerald-500/80 mb-6 uppercase tracking-tighter">{t.bull}</h3>
                          <ul className="space-y-4">{result.analysis.bull_case_points.map((p:any,i:any)=><li key={i} className="text-slate-400 text-xs md:text-sm font-medium leading-relaxed flex gap-3"><CheckCircle className="text-emerald-500 w-5 h-5 shrink-0" size={14}/> {p}</li>)}</ul>
                        </div>
                        <div className="bg-red-900/5 border border-red-500/10 p-6 md:p-10 rounded-3xl">
                          <h3 className="text-lg md:text-2xl font-black text-red-500/80 mb-6 uppercase tracking-tighter">{t.bear}</h3>
                          <ul className="space-y-4">{result.analysis.bear_case_points.map((p:any,i:any)=><li key={i} className="text-slate-400 text-xs md:text-sm font-medium leading-relaxed flex gap-3"><AlertTriangle className="text-red-500 w-5 h-5 shrink-0" size={14}/> {p}</li>)}</ul>
                        </div>
                    </div>

                    <footer className="border-t border-slate-800 mt-16 py-8 text-center">
                        <h4 className="text-slate-500 text-[10px] md:text-xs font-black uppercase tracking-[0.3em] mb-4">{t.disclaimerTitle}</h4>
                        <p className="text-slate-600 text-[9px] md:text-[11px] max-w-4xl mx-auto leading-relaxed px-6 font-medium italic">{t.disclaimerText}</p>
                    </footer>
                </div>
            </div>
        )}
        {loading && !result && (
  <div className="flex flex-col items-center mt-20 gap-4 animate-in fade-in">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    <p className="text-blue-400 text-xs md:text-sm font-bold animate-pulse text-center px-6 max-w-md leading-relaxed">
      {lang === 'ar' ? "الذكاء الاصطناعي يقوم الآن بفك شفرة الميزانيات العمومية والتقييمات... بضع ثوانٍ من فضلك" : 
       lang === 'it' ? "L'IA sta decodificando bilanci e valutazioni... attendere prego" :
       "AI is decoding balance sheets and valuations... this deep scan takes a moment"}
    </p>
  </div>
)}

{showCompareModal && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-2xl p-2 md:p-4 overflow-y-auto font-sans selection:bg-emerald-500/30">
    <div className="bg-[#0b0f1a] border border-slate-800 w-full max-w-5xl rounded-[3rem] p-6 md:p-12 relative shadow-[0_0_100px_rgba(16,185,129,0.1)] my-auto max-h-[92vh] overflow-y-auto custom-scrollbar">
      
      {/* Close Button */}
      <button onClick={() => {setShowCompareModal(false); setCompareResult(null);}} className="absolute top-8 right-8 text-slate-500 hover:text-white transition-all hover:rotate-90 z-20">
        <XCircle className="w-10 h-10" />
      </button>
      
      <div className="relative z-10">
        {/* Header Section */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-4 py-1.5 rounded-full text-emerald-500 text-[10px] font-black uppercase tracking-[0.3em] mb-4">
            <Zap className="w-3 h-3 fill-emerald-500" /> Premium Battle Engine • 2 Credits
          </div>
          <h2 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter italic leading-none">
            Financial <span className="text-emerald-500">Showdown</span>
          </h2>
        </div>
        
        {/* Ticker Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-blue-400 ml-4 uppercase tracking-[0.2em]">Aggressive Challenger</label>
            <input type="text" placeholder="TICKER 1" className="w-full bg-slate-950 border border-slate-800 p-5 rounded-2xl outline-none uppercase font-mono text-center text-3xl text-blue-400 focus:border-blue-500 transition-all shadow-2xl" onChange={(e)=>setCompareTickers({...compareTickers, t1: e.target.value})} />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-emerald-400 ml-4 uppercase tracking-[0.2em]">Value Defender</label>
            <input type="text" placeholder="TICKER 2" className="w-full bg-slate-950 border border-slate-800 p-5 rounded-2xl outline-none uppercase font-mono text-center text-3xl text-emerald-400 focus:border-emerald-500 transition-all shadow-2xl" onChange={(e)=>setCompareTickers({...compareTickers, t2: e.target.value})} />
          </div>
        </div>

        <div className="space-y-4">
          {compareError && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-2xl text-center text-sm font-black animate-pulse">
              ⚠️ {compareError}
            </div>
          )}

          <button 
            onClick={() => {
              if (!token) { 
                setShowCompareModal(false); 
                setAuthMode("signup");      
                setShowAuthModal(true);     
                return;
              }
              handleCompare();
            }} 
            disabled={loadingCompare} 
            className="w-full bg-white text-black hover:bg-emerald-500 hover:text-white py-6 rounded-2xl font-black text-2xl transition-all disabled:opacity-50 shadow-2xl active:scale-[0.98] uppercase tracking-tighter cursor-pointer"
          >
            {loadingCompare ? "Extracting Alpha..." : "Launch Deep Comparison"}
          </button>
          
          <div className="flex justify-center items-center gap-2">
             <Zap className="w-3 h-3 text-emerald-500 fill-emerald-500" />
             <p className="text-center text-[10px] text-slate-500 font-black uppercase tracking-[0.2em]">
                Premium Analysis: 2 Strategy Credits
             </p>
          </div>
        </div>

        {compareResult && (
          <div className="mt-16 space-y-12 animate-in fade-in slide-in-from-bottom-10 duration-700 pb-10">
            
            {/* 1. Comparison Dashboard Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-slate-900/50 border border-slate-800 p-8 rounded-[2rem] text-center group hover:border-blue-500/30 transition-all">
                <span className="block text-[10px] text-slate-500 font-black uppercase mb-2 tracking-widest">{compareResult.stock1.symbol} Price</span>
                <span className="text-4xl font-black text-blue-400 font-mono">${Number(compareResult.stock1.price).toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-center p-4">
                <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(16,185,129,0.4)]">
                  <Trophy className="text-black w-8 h-8" />
                </div>
              </div>
              <div className="bg-slate-900/50 border border-slate-800 p-8 rounded-[2rem] text-center group hover:border-emerald-500/30 transition-all">
                <span className="block text-[10px] text-slate-500 font-black uppercase mb-2 tracking-widest">{compareResult.stock2.symbol} Price</span>
                <span className="text-4xl font-black text-emerald-400 font-mono">${Number(compareResult.stock2.price).toFixed(2)}</span>
              </div>
            </div>

            {/* 2. Professional Metrics Table */}
            <div className="bg-slate-950/50 border border-slate-800 rounded-[2.5rem] overflow-hidden backdrop-blur-md">
              <table className="w-full text-left">
                <thead className="bg-slate-900/80 border-b border-slate-800">
                  <tr>
                    <th className="p-6 text-slate-500 font-black uppercase text-[10px] tracking-[0.2em]">Institutional Matrix</th>
                    <th className="p-6 text-blue-400 font-black text-center text-xl bg-blue-500/5 font-mono">{compareResult.stock1.symbol}</th>
                    <th className="p-6 text-emerald-400 font-black text-center text-xl bg-emerald-500/5 font-mono">{compareResult.stock2.symbol}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/50 font-mono">
                  {[
                    { label: "P/E Ratio (Valuation)", v1: compareResult.stock1.pe_ratio, v2: compareResult.stock2.pe_ratio },
                    { label: "ROE % (Profitability)", v1: compareResult.stock1.return_on_equity, v2: compareResult.stock2.return_on_equity, suffix: "%" },
                    { label: "Rev Growth (YoY)", v1: compareResult.stock1.revenue_growth, v2: compareResult.stock2.revenue_growth, suffix: "%" },
                    { label: "Net Margin", v1: compareResult.stock1.profit_margins, v2: compareResult.stock2.profit_margins, suffix: "%" }
                  ].map((row, i) => (
                    <tr key={i} className="hover:bg-white/[0.02] transition-colors">
                      <td className="p-6 text-slate-500 font-bold text-xs uppercase tracking-widest">{row.label}</td>
                      <td className="p-6 text-white text-center text-lg">{Number(row.v1 || 0).toFixed(2)}{row.suffix}</td>
                      <td className="p-6 text-white text-center text-lg">{Number(row.v2 || 0).toFixed(2)}{row.suffix}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* 3. Deep Analysis Verdict (The Big Winner) */}
            <div className="bg-gradient-to-br from-slate-900 to-[#0b0f1a] border border-slate-700/50 p-8 md:p-14 rounded-[3.5rem] shadow-3xl relative">
              <div className="flex items-center gap-5 mb-10 border-b border-slate-800 pb-8">
                 <div className="w-16 h-16 bg-emerald-500 rounded-2xl flex items-center justify-center shadow-2xl shadow-emerald-500/30 rotate-3">
                    <Brain className="text-black w-10 h-10" />
                 </div>
                 <div>
                   <h4 className="text-white text-3xl font-black uppercase tracking-tighter italic">AI Analysis Verdict</h4>
                   <p className="text-emerald-500 text-[10px] font-black uppercase tracking-[0.4em]">Proprietary Winning Thesis</p>
                 </div>
              </div>

              <div className="prose prose-invert max-w-none">
                <p className="text-slate-300 leading-relaxed text-lg md:text-xl font-medium italic border-l-4 border-emerald-500 pl-8 py-4 bg-emerald-500/5 rounded-r-3xl">
                  {compareResult.analysis.verdict}
                </p>
              </div>

              <div className="mt-12 flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="bg-slate-900 border border-slate-800 px-8 py-4 rounded-full flex items-center gap-3">
                  <div className="w-3 h-3 bg-emerald-500 rounded-full animate-ping"></div>
                  <span className="text-white font-black uppercase text-xs tracking-widest">Winner: {compareResult.analysis.winner}</span>
                </div>
                <div className="text-[10px] text-slate-600 font-bold uppercase tracking-widest">
                  Verified Institutional Data Stream • Gemini 2.0 Flash
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  </div>
)}


      </main>
    </div>
  );
}