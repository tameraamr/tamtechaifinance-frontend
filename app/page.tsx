"use client";
import { useState, useEffect } from "react";
import { 
  TrendingUp, DollarSign, PieChart, ShieldCheck, Target, 
  CheckCircle, XCircle, BarChart3, Zap, AlertTriangle, Lightbulb, Lock, Star, LogOut, User, Calendar, Brain, HelpCircle, Activity, Download, Dices 
} from "lucide-react";
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from 'recharts';
import { toPng } from 'html-to-image';
import jsPDF from 'jspdf';

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
    scan: "Scanning...",
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
    scan: "جاري الفحص...",
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
        roe: "العائد على حقوق الملكية (ROE): يقيس ربحية الشركة بالنسبة حقوق المساهمين.",
        margin: "هامش الربح: النسبة المئوية للإيرادات التي تتحول لربح صافي.",
        debt: "الديون للملكية: مقياس للرافعة المالية والمخاطر.",
        curr: "النسبة الحالية: قدرة الشركة على سداد التزاماتها قصيرة الأجل."
    }
  },
  it: {
    loginTitle: "Accedi", signupTitle: "Crea Account", email: "Email", pass: "Password", loginBtn: "Accedi", signupBtn: "Iscriviti",
    switchSign: "Non hai un account? Iscriviti", switchLog: "Hai un account? Accedi", logout: "Esci", guestBadge: "Ospite", freeLeft: "Crediti",
    registerToContinue: "Registrati", registerDesc: "Crea un account per acquistare crediti.", paywallTitle: "Limite Raggiunto",
    paywallDesc: "Crediti esauriti. Passa a Pro.", searchPlaceholder: "Inserisci Ticker (es. NVDA)...", scan: "Scansione...", analyze: "Analizza",
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

export default function Home() {
  const [token, setToken] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState("");
  const [guestTrials, setGuestTrials] = useState(3);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);
  const [authMode, setAuthMode] = useState("signup");
  const [credits, setCredits] = useState(0); 
  const [ticker, setTicker] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [lang, setLang] = useState("en"); 
  const t = translations[lang] || translations.en;
  const isRTL = lang === 'ar';
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [licenseKey, setLicenseKey] = useState("");
  
  // نظام الأخطاء الجديد بدون Alert
  const [authError, setAuthError] = useState("");

  const [randomTicker, setRandomTicker] = useState<string | null>(null);
  const [loadingRandom, setLoadingRandom] = useState(false);

  useEffect(() => {
    const savedGuest = localStorage.getItem("guest_trials");
    if (savedGuest) setGuestTrials(parseInt(savedGuest));
    else localStorage.setItem("guest_trials", "3");
    const savedToken = localStorage.getItem("access_token");
    if (savedToken) { setToken(savedToken); fetchUserData(savedToken); }
  }, []);

  const fetchUserData = async (currentToken: string) => {
    try {
      const res = await fetch(`${BASE_URL}/users/me`, { headers: { Authorization: `Bearer ${currentToken}` } });
      if (res.ok) { const data = await res.json(); setCredits(data.credits); setUserEmail(data.email); setShowAuthModal(false); } 
      else { logout(); }
    } catch { logout(); }
  };

  const handleAuth = async () => {
    setAuthError("");
    const url = authMode === "login" ? `${BASE_URL}/token` : `${BASE_URL}/register`;
    let body, headers = {};
    if (authMode === "login") {
      const formData = new URLSearchParams(); formData.append('username', email); formData.append('password', password);
      body = formData; headers = { "Content-Type": "application/x-www-form-urlencoded" };
    } else {
      body = JSON.stringify({ email, password }); headers = { "Content-Type": "application/json" };
    }
    try {
      const res = await fetch(url, { method: "POST", headers, body }); const data = await res.json();
      if (!res.ok) { 
        let msg = data.detail; 
        if(Array.isArray(msg)) msg = msg.map((e:any)=>e.msg).join(" "); 
        setAuthError(msg || "Error"); 
        return; 
      }
      if (authMode === "login") { localStorage.setItem("access_token", data.access_token); setToken(data.access_token); fetchUserData(data.access_token); } 
      else { alert("✅ Account created! Login now."); setAuthMode("login"); }
    } catch { setAuthError("Connection Error"); }
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
    if (token) { if (credits <= 0) { setShowPaywall(true); return; } } 
    else { if (guestTrials <= 0) { setAuthMode("signup"); setShowAuthModal(true); return; } }
    setLoading(true);
    try {
      const headers: any = {}; if (token) headers["Authorization"] = `Bearer ${token}`;
      const res = await fetch(`${BASE_URL}/analyze/${targetTicker}?lang=${lang}`, { headers });
      if (res.status === 402) { setShowPaywall(true); setLoading(false); return; }
      if (!res.ok) throw new Error("Stock not found");
      const data = await res.json(); setResult(data);
      if (token) { setCredits(data.credits_left); } 
      else { const newGuest = guestTrials - 1; setGuestTrials(newGuest); localStorage.setItem("guest_trials", newGuest.toString()); }
    } catch (err: any) { setAuthError(err.message); } finally { setLoading(false); }
  };

  const handleRedeem = async () => {
    setAuthError("");
    try {
      const res = await fetch(`${BASE_URL}/verify-license`, {
        method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ license_key: licenseKey.trim() }),
      });
      const data = await res.json();
      if (data.valid) { setCredits(data.credits); setShowPaywall(false); setLicenseKey(""); alert(`🎉 Success! Balance: ${data.credits}`); } 
      else { setAuthError(data.message); }
    } catch { setAuthError("Error"); }
  };

  const handleDownloadPDF = async () => {
    const input = document.getElementById('report-content');
    if (!input) return;
    try {
        const dataUrl = await toPng(input, { cacheBust: true, pixelRatio: 2 });
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const imgProps = pdf.getImageProperties(dataUrl);
        const imgHeight = (imgProps.height * pdfWidth) / imgProps.width;
        pdf.addImage(dataUrl, 'PNG', 0, 0, pdfWidth, imgHeight);
        pdf.save(`${ticker}_Analysis.pdf`);
    } catch { setAuthError("PDF Failed"); }
  };

  const formatNumber = (num: any) => num > 1e9 ? (num/1e9).toFixed(2)+"B" : num > 1e6 ? (num/1e6).toFixed(2)+"M" : num?.toLocaleString();
  const getVerdictColor = (v: string) => v?.includes("BUY") ? "text-emerald-400 border-emerald-500/50 bg-emerald-500/10" : v?.includes("SELL") ? "text-red-400 border-red-500/50 bg-red-500/10" : "text-yellow-400 border-yellow-500/50 bg-yellow-500/10";
  const calculateRangePos = (c: number, l: number, h: number) => Math.min(Math.max(((c-l)/(h-l))*100, 0), 100);

  const MetricCard = ({ label, value, tooltipKey, metricKey, suffix = "" }: any) => (
      <div className="bg-slate-900/50 border border-slate-800 p-4 rounded-xl flex flex-col hover:border-blue-500/30 transition group">
          <div className="flex justify-between items-start mb-2"><span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">{label}</span><HelpCircle className="w-3 h-3 text-slate-600" /></div>
          <div className={`text-xl font-mono font-bold text-slate-200`} dir="ltr">{typeof value === 'number' ? value.toFixed(2) : value}{suffix}</div>
      </div>
  );

  return (
    <div dir={isRTL ? "rtl" : "ltr"} className={`min-h-screen bg-[#0b1121] text-slate-100 font-sans ${isRTL ? 'font-arabic' : ''}`}>
      <nav className="border-b border-slate-800 bg-[#0b1121]/80 backdrop-blur-xl sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2"><BarChart3 className="text-blue-500 w-6 h-6" /><span className="font-bold text-xl tracking-tight">TamtechAI <span className="text-blue-500">Pro</span></span></div>
          <div className="flex items-center gap-4">
            {/* 👇 إصلاح الكريدت ليظهر في الجوال */}
            {token ? (
              <div className="flex items-center gap-2 bg-slate-900 border border-slate-700 px-3 py-1 rounded-full text-[10px] md:text-xs font-bold text-slate-300">
                <Star className="w-3 h-3 text-yellow-400" /><span>{t.freeLeft}: <span className={credits > 0 ? "text-white" : "text-red-500"}>{credits}</span></span>
              </div>
            ) : (
              <div className="flex items-center gap-2 bg-slate-800 border border-slate-700 px-3 py-1 rounded-full text-[10px] md:text-xs font-bold text-slate-400"><User className="w-3 h-3"/> {t.guestBadge}: {guestTrials}</div>
            )}
            {/* 👇 رجوع اللغات الـ 3 */}
            <div className="hidden md:flex bg-slate-900 border border-slate-700 rounded-full p-1">
              {['en', 'ar', 'it'].map((l) => (<button key={l} onClick={() => setLang(l)} className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase ${lang === l ? 'bg-blue-600 text-white' : 'text-slate-400'}`}>{l}</button>))}
            </div>
            {token ? (<button onClick={logout} className="p-2 text-slate-400 hover:text-red-400"><LogOut className="w-5 h-5"/></button>) : (<button onClick={() => { setAuthMode("login"); setShowAuthModal(true); }} className="text-xs font-bold bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-600">{t.loginBtn}</button>)}
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-10 relative">
        <div className="flex justify-center mb-10">
          <div className="relative w-full max-w-xl flex gap-2">
            <div className="flex-1 flex items-center bg-slate-900 border border-slate-700 rounded-xl overflow-hidden shadow-2xl">
              <input type="text" placeholder={t.searchPlaceholder} className="w-full bg-transparent p-4 text-sm md:text-lg outline-none uppercase font-mono" value={ticker} onChange={(e) => setTicker(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleAnalyze()} />
              <button onClick={() => handleAnalyze()} disabled={loading} className="bg-blue-600 hover:bg-blue-500 px-6 py-4 font-bold disabled:opacity-50">{loading ? t.scan : t.analyze}</button>
            </div>
            <button onClick={fetchRandomStock} disabled={loadingRandom} className="bg-slate-800 border border-slate-700 p-4 rounded-xl shadow-2xl transition-all group disabled:opacity-50">
                {loadingRandom ? <div className="animate-spin h-6 w-6 border-t-2 border-purple-500 rounded-full"></div> : <Dices className="w-6 h-6 text-purple-400" />}
            </button>
          </div>
        </div>

        {/* 👇 رجوع الـ Hero Section والمميزات (الأشياء الجميلة) */}
        {!result && !loading && (
            <div className="flex flex-col items-center justify-center mt-8 animate-in fade-in duration-700">
                <h1 className="text-3xl md:text-5xl font-bold text-center text-white mb-4 tracking-tight">{t.heroTitle}</h1>
                <p className="text-slate-400 text-center max-w-2xl mb-12 text-sm md:text-lg">{t.heroSubtitle}</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl">
                    <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl hover:border-blue-500/30 transition group"><div className="bg-blue-900/20 p-3 rounded-lg w-fit mb-4"><Brain className="w-6 h-6 text-blue-400" /></div><h3 className="text-lg font-bold text-slate-200 mb-2">{t.feat1Title}</h3><p className="text-sm text-slate-400 leading-relaxed">{t.feat1Desc}</p></div>
                    <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl hover:border-purple-500/30 transition group"><div className="bg-purple-900/20 p-3 rounded-lg w-fit mb-4"><TrendingUp className="w-6 h-6 text-purple-400" /></div><h3 className="text-lg font-bold text-slate-200 mb-2">{t.feat2Title}</h3><p className="text-sm text-slate-400 leading-relaxed">{t.feat2Desc}</p></div>
                    <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl hover:border-emerald-500/30 transition group"><div className="bg-emerald-900/20 p-3 rounded-lg w-fit mb-4"><ShieldCheck className="w-6 h-6 text-emerald-400" /></div><h3 className="text-lg font-bold text-slate-200 mb-2">{t.feat3Title}</h3><p className="text-sm text-slate-400 leading-relaxed">{t.feat3Desc}</p></div>
                </div>
            </div>
        )}

        {/* 👇 الـ Auth Modal مع نظام الأخطاء الجديد */}
        {showAuthModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"><div className="bg-slate-900 border border-slate-700 p-8 rounded-3xl max-w-md w-full relative">
            <button onClick={() => setShowAuthModal(false)} className="absolute top-4 right-4 text-slate-500 hover:text-white"><XCircle className="w-6 h-6"/></button>
            <h2 className="text-2xl font-bold text-center mb-2">{authMode === "login" ? t.loginTitle : t.registerToContinue}</h2>
            {authError && <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-2 rounded text-xs mb-4 text-center">{authError}</div>}
            <div className="space-y-4">
              <input type="email" placeholder={t.email} className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-sm" value={email} onChange={e=>setEmail(e.target.value)} />
              <input type="password" placeholder={t.pass} className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-sm" value={password} onChange={e=>setPassword(e.target.value)} />
              <button onClick={handleAuth} className="w-full bg-blue-600 hover:bg-blue-500 py-3 rounded-lg font-bold">{authMode === "login" ? t.loginBtn : t.signupBtn}</button>
              <button onClick={() => setAuthMode(authMode==="login"?"signup":"login")} className="w-full text-xs text-slate-400">{authMode==="login" ? t.switchSign : t.switchLog}</button>
            </div>
          </div></div>
        )}

        {/* بقية محتوى النتائج والـ PDF يتبع هنا بنفس كودك الأصلي... */}
        {result && !loading && (
          <div id="report-content" className="animate-in fade-in slide-in-from-bottom-8 duration-700 space-y-8 pb-20 p-4 bg-[#0b1121]">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                <div className="lg:col-span-1 bg-slate-800/40 border border-slate-700/50 rounded-2xl p-6">
                    <h1 className="text-xl md:text-3xl font-bold mb-1">{result.data.companyName}</h1>
                    <div className="text-3xl md:text-5xl font-mono font-bold my-4" dir="ltr">${result.data.price?.toFixed(2)}</div>
                    <div className={`p-4 rounded-xl text-center border-2 ${getVerdictColor(result.analysis.verdict)}`}>
                      <span className="text-2xl md:text-4xl font-black block">{result.analysis.verdict}</span>
                    </div>
                </div>
                <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6 h-[400px]">
                   <ResponsiveContainer width="100%" height="100%"><AreaChart data={result.data.chart_data}><XAxis dataKey="date" hide /><YAxis hide /><Area type="monotone" dataKey="price" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.2} /></AreaChart></ResponsiveContainer>
                </div>
            </div>
            {/* ... بقية الـ SWOT والمقاطع المالية كما في كودك الأصلي ... */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
               <div className="bg-slate-800/30 p-6 rounded-2xl"><h3 className="font-bold mb-2">Business DNA</h3><p className="text-sm text-slate-400">{result.analysis.chapter_1_the_business}</p></div>
               <div className="bg-slate-800/30 p-6 rounded-2xl"><h3 className="font-bold mb-2">Financials</h3><p className="text-sm text-slate-400">{result.analysis.chapter_2_financials}</p></div>
            </div>
            <button onClick={handleDownloadPDF} className="w-full bg-slate-800 py-3 rounded-xl font-bold">Download Report PDF</button>
          </div>
        )}
        {loading && <div className="flex justify-center mt-20"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-blue-500"></div></div>}
      </main>
    </div>
  );
}