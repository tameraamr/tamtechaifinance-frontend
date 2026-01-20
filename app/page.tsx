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

export default function Home() {
  const [token, setToken] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState("");
  const [guestTrials, setGuestTrials] = useState(3);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);
  const [authMode, setAuthMode] = useState("signup");
  const [credits, setCredits] = useState(0); 
  const [ticker, setTicker] = useState("");
  const [marketPulse, setMarketPulse] = useState<any[]>([]);
  const [timeRange, setTimeRange] = useState("1Y");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [lang, setLang] = useState("en"); 
  const t = translations[lang] || translations.en;
  const isRTL = lang === 'ar';
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [licenseKey, setLicenseKey] = useState("");
  const [authError, setAuthError] = useState("");

  const [randomTicker, setRandomTicker] = useState<string | null>(null);
  const [loadingRandom, setLoadingRandom] = useState(false);

  useEffect(() => {
    // كود جلب بيانات اليوزر (خلوه زي ما هو)
    const savedGuest = localStorage.getItem("guest_trials");
    if (savedGuest) setGuestTrials(parseInt(savedGuest));
    else localStorage.setItem("guest_trials", "3");
    const savedToken = localStorage.getItem("access_token");
    if (savedToken) { setToken(savedToken); fetchUserData(savedToken); }

    // --- الدالة الجديدة لجلب أسعار الشريط الحقيقية ---
    const fetchPulse = async () => {
      try {
        const res = await fetch("https://api.binance.com/api/v3/ticker/24hr?symbols=[%22BTCUSDT%22,%22ETHUSDT%22,%22SOLUSDT%22,%22BNBUSDT%22]");
        const cryptoData = await res.json();
        const formattedData = cryptoData.map((coin: any) => ({
          name: coin.symbol.replace("USDT", ""),
          price: parseFloat(coin.lastPrice).toLocaleString(),
          change: (parseFloat(coin.priceChangePercent) >= 0 ? "+" : "") + parseFloat(coin.priceChangePercent).toFixed(2) + "%",
          up: parseFloat(coin.priceChangePercent) >= 0
        }));
        // إضافة مؤشرات السوق التقليدية (لأنها ثابتة بالليل)
        formattedData.push({ name: "GOLD", price: "2,645.20", change: "+0.12%", up: true });
        formattedData.push({ name: "S&P 500", price: "5,842.10", change: "+0.45%", up: true });
        setMarketPulse(formattedData);
      } catch (err) { console.log("Pulse fetch error"); }
    };

    fetchPulse();
    const interval = setInterval(fetchPulse, 60000); // تحديث كل دقيقة
    return () => clearInterval(interval);
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

{/* Market Pulse Strip - المربوط بالبيانات الحقيقية */}
<div className="bg-slate-950/50 border-b border-slate-800/50 py-2 overflow-hidden shadow-inner sticky top-16 z-30 backdrop-blur-md group">
  <div className="max-w-7xl mx-auto px-6 flex items-center">
    
    {/* عنوان الشريط - ثابت لا يتحرك */}
    <div className="flex items-center gap-2 border-r border-slate-800 pr-4 bg-[#0b1121] z-10">
      <span className="text-[10px] font-black text-slate-500 uppercase tracking-tighter text-slate-400">Market Pulse:</span>
      <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-bold border border-emerald-500/20 whitespace-nowrap">
        <Zap className="w-3 h-3 fill-emerald-400"/> LIVE
      </span>
    </div>

    {/* الحاوية المتحركة */}
    <div className="flex overflow-hidden relative ml-4 flex-1">
      <div className="flex gap-12 items-center animate-marquee whitespace-nowrap py-1">
        {marketPulse.length > 0 ? (
          // تكرار البيانات مرتين لضمان حركة دائرية بلا انقطاع
          [...marketPulse, ...marketPulse].map((index, i) => (
            <div key={i} className="flex items-center gap-2 px-2">
              <span className="text-[10px] font-bold text-slate-500 uppercase">{index.name}</span>
              <span className="text-[11px] font-mono font-bold text-slate-200">{index.price}</span>
              <span className={`text-[9px] font-bold ${index.up ? 'text-emerald-500' : 'text-red-500'}`}>
                {index.change}
              </span>
            </div>
          ))
        ) : (
          // تظهر هذه الرسالة فقط لثانية واحدة عند التحميل لأول مرة
          <div className="flex gap-4">
             <span className="text-[10px] text-slate-600 animate-pulse font-bold uppercase tracking-widest">
               Connecting to global markets...
             </span>
          </div>
        )}
      </div>
    </div>
  </div>
</div>

      <main className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-10 relative">
  <div className="flex justify-center mb-8 md:mb-10">
    <div className="relative w-full max-w-xl flex gap-2">
      {/* الـ Container الرئيسي شلنا منه الـ overflow-hidden والـ rounded */}
      <div className="flex-1 flex items-center bg-slate-900 border border-slate-700 rounded-xl shadow-2xl">
        <input 
          type="text" 
          placeholder={t.searchPlaceholder} 
          // أضفنا rounded-l-xl (يمين حاد، يسار دائري)
          className="w-full bg-transparent p-3 md:p-4 text-xs md:text-lg outline-none uppercase font-mono rounded-l-xl" 
          value={ticker} 
          onChange={(e) => setTicker(e.target.value)} 
          onKeyDown={(e) => e.key === "Enter" && handleAnalyze()} 
        />
        <button 
          onClick={() => handleAnalyze()} 
          disabled={loading} 
          // أضفنا rounded-r-xl (يسار حاد، يمين دائري) عشان يسكر الزاوية صح مع الـ border
          className="bg-blue-600 hover:bg-blue-500 px-4 md:px-6 py-3 md:py-4 font-bold text-xs md:text-base disabled:opacity-50 rounded-r-[11px] h-full"
        >
          {loading ? t.scan : t.analyze}
        </button>
      </div>
      <button onClick={fetchRandomStock} disabled={loadingRandom} className="bg-slate-800 border border-slate-700 p-3 md:p-4 rounded-xl shadow-2xl transition-all group disabled:opacity-50">
          {loadingRandom ? <div className="animate-spin h-5 w-5 md:h-6 md:w-6 border-t-2 border-purple-500 rounded-full"></div> : <Dices className="w-5 h-5 md:w-6 md:h-6 text-purple-400" />}
      </button>
    </div>
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
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in">
            <div className="bg-slate-900 border border-slate-700 p-6 md:p-8 rounded-3xl max-w-md w-full relative shadow-2xl">
              <button onClick={() => setShowAuthModal(false)} className="absolute top-4 right-4 text-slate-500 hover:text-white"><XCircle className="w-6 h-6"/></button>
              <h2 className="text-xl md:text-2xl font-bold text-center mb-2">{authMode === "login" ? t.loginTitle : t.registerToContinue}</h2>
              <p className="text-slate-400 text-center mb-6 text-xs md:text-sm">{authMode === "signup" ? t.registerDesc : "Welcome back!"}</p>
              {authError && <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-2 rounded text-[10px] md:text-xs mb-4 text-center">{authError}</div>}
              <div className="space-y-4">
                <input type="email" placeholder={t.email} className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-xs md:text-sm" value={email} onChange={e=>setEmail(e.target.value)} />
                <input type="password" placeholder={t.pass} className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-xs md:text-sm" value={password} onChange={e=>setPassword(e.target.value)} />
                <button onClick={handleAuth} className="w-full bg-blue-600 hover:bg-blue-500 py-3 rounded-lg font-bold text-sm md:text-base">{authMode === "login" ? t.loginBtn : t.signupBtn}</button>
                <button onClick={() => {setAuthMode(authMode==="login"?"signup":"login"); setAuthError("");}} className="w-full text-[10px] md:text-xs text-slate-400 hover:text-white">{authMode==="login" ? t.switchSign : t.switchLog}</button>
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
      </main>
    </div>
  );
}