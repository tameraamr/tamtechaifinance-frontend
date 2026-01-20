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
    searchPlaceholder: "Enter Ticker...",
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
    heroTitle: "Institutional Market Intelligence",
    heroSubtitle: "Generative AI for deep financial analysis.",
    feat1Title: "Valuation", feat1Desc: "Intrinsic value calculation.",
    feat2Title: "Forecasting", feat2Desc: "1-5 year price outlook.",
    feat3Title: "SWOT", feat3Desc: "Detailed risk breakdown.",
    metricsTitle: "Financial Metrics",
    download: "Download Report",
    disclaimerTitle: "Disclaimer",
    disclaimerText: "TamtechAI is an AI tool, not a financial advisor. All data is for informational purposes.",
    reportTitle: "Investment Analysis Report",
    randomBtn: "Inspire Me",
    randomTitle: "AI Choice",
    randomDesc: "AI suggests this stock. Analyze?",
    cancel: "Cancel",
    tooltips: {
        pe: "P/E Ratio", peg: "PEG Ratio", pb: "P/B Ratio", ps: "P/S Ratio", beta: "Beta", 
        div: "Div Yield", roe: "ROE", margin: "Margin", debt: "Debt/Eq", curr: "Current Ratio"
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
    registerDesc: "أنشئ حساباً الآن لشراء الرصيد.",
    paywallTitle: "نفذ رصيدك",
    paywallDesc: "اشترِ مفتاح Pro للحصول على 50 تحليل.",
    searchPlaceholder: "أدخل الرمز...",
    scan: "جاري الفحص...",
    analyze: "حلل الآن",
    verdict: "حكم الذكاء الاصطناعي",
    confidence: "الثقة",
    analyst: "توصية المحللين",
    targetPrice: "السعر المستهدف",
    low: "أدنى", high: "أعلى", trend: "الاتجاه", radar: "الرادار", swot: "SWOT", bull: "إيجابيات", bear: "سلبيات",
    forecasts: "توقعات مستقبلية", oneYear: "توقع سنة", fiveYears: "توقع 5 سنوات",
    pe: "مكرر الربحية", mcap: "القيمة السوقية", growth: "النمو", debt: "الديون",
    strengths: "ن. قوة", weaknesses: "ن. ضعف", opportunities: "فرص", threats: "تهديدات",
    upgradeBtn: "شراء رصيد ($5)", redeemBtn: "تفعيل", inputKey: "كود التفعيل...", haveKey: "لديك كود؟",
    heroTitle: "ذكاء مالي بمستوى المؤسسات",
    heroSubtitle: "ذكاء اصطناعي لفك شفرة الميزانيات.",
    feat1Title: "تقييم عميق", feat1Desc: "حساب القيمة الجوهرية.",
    feat2Title: "توقعات", feat2Desc: "توقعات أسعار 1-5 سنوات.",
    feat3Title: "تحليل SWOT", feat3Desc: "تفصيل شامل للمخاطر.",
    metricsTitle: "المؤشرات المالية",
    download: "تحميل التقرير",
    disclaimerTitle: "إخلاء مسؤولية",
    disclaimerText: "TamtechAI أداة تحليل وليست مستشاراً مالياً.",
    reportTitle: "تقرير التحليل الاستثماري",
    randomBtn: "ألهمني",
    randomTitle: "اقتراح الذكاء الاصطناعي",
    randomDesc: "هل تريد تحليل هذا السهم؟",
    cancel: "إلغاء",
    tooltips: {
        pe: "مكرر الربحية", peg: "نسبة PEG", pb: "P/B", ps: "P/S", beta: "بيتا", 
        div: "عائد التوزيعات", roe: "ROE", margin: "هامش الربح", debt: "الديون", curr: "النسبة الحالية"
    }
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
  
  // حالة الخطأ المحسنة
  const [errorMsg, setErrorMsg] = useState("");

  const [randomTicker, setRandomTicker] = useState<string | null>(null);
  const [loadingRandom, setLoadingRandom] = useState(false);

  useEffect(() => {
    const savedGuest = localStorage.getItem("guest_trials");
    if (savedGuest) setGuestTrials(parseInt(savedGuest));
    else localStorage.setItem("guest_trials", "3");
    const savedToken = localStorage.getItem("access_token");
    if (savedToken) { setToken(savedToken); fetchUserData(savedToken); }
  }, []);

  // وظيفة لمسح الخطأ تلقائياً
  useEffect(() => {
    if (errorMsg) {
      const timer = setTimeout(() => setErrorMsg(""), 4000);
      return () => clearTimeout(timer);
    }
  }, [errorMsg]);

  const fetchUserData = async (currentToken: string) => {
    try {
      const res = await fetch(`${BASE_URL}/users/me`, { headers: { Authorization: `Bearer ${currentToken}` } });
      if (res.ok) { const data = await res.json(); setCredits(data.credits); setUserEmail(data.email); setShowAuthModal(false); } 
      else { logout(); }
    } catch { logout(); }
  };

  const handleAuth = async () => {
    setErrorMsg("");
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
        setErrorMsg(msg || "Error occurred"); 
        return; 
      }
      if (authMode === "login") { 
        localStorage.setItem("access_token", data.access_token); 
        setToken(data.access_token); 
        fetchUserData(data.access_token); 
      } 
      else { 
        alert("✅ Account created! Login now."); 
        setAuthMode("login"); 
      }
    } catch { setErrorMsg("Server Connection Error"); }
  };

  const logout = () => { localStorage.removeItem("access_token"); setToken(null); setUserEmail(""); setResult(null); };

  const fetchRandomStock = async () => {
      setLoadingRandom(true);
      try {
          const res = await fetch(`${BASE_URL}/suggest-stock`);
          const data = await res.json();
          setRandomTicker(data.ticker); 
      } catch {
          setErrorMsg("Error fetching suggestion");
      } finally {
          setLoadingRandom(false);
      }
  };

  const confirmRandomAnalysis = () => {
      if (randomTicker) {
          setTicker(randomTicker);
          setRandomTicker(null);
          setTimeout(() => handleAnalyze(randomTicker), 100);
      }
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
    } catch (err: any) { setErrorMsg(err.message); } finally { setLoading(false); }
  };

  const handleRedeem = async () => {
    setErrorMsg("");
    try {
      const res = await fetch(`${BASE_URL}/verify-license`, {
        method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ license_key: licenseKey.trim() }),
      });
      const data = await res.json();
      if (data.valid) { setCredits(data.credits); setShowPaywall(false); setLicenseKey(""); alert(`🎉 Success! Balance: ${data.credits}`); } 
      else { setErrorMsg(data.message); }
    } catch { setErrorMsg("Verification Error"); }
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
    } catch { setErrorMsg("PDF Generation Failed"); }
  };

  const formatNumber = (num: any) => num > 1e9 ? (num/1e9).toFixed(1)+"B" : num > 1e6 ? (num/1e6).toFixed(1)+"M" : num?.toLocaleString();
  const getVerdictColor = (v: string) => v?.includes("BUY") ? "text-emerald-400 border-emerald-500/50" : v?.includes("SELL") ? "text-red-400 border-red-500/50" : "text-yellow-400 border-yellow-500/50";
  const calculateRangePos = (c: number, l: number, h: number) => Math.min(Math.max(((c-l)/(h-l))*100, 0), 100);

  return (
    <div dir={isRTL ? "rtl" : "ltr"} className={`min-h-screen bg-[#0b1121] text-slate-100 font-sans selection:bg-blue-500/30 ${isRTL ? 'font-arabic' : ''}`}>
      
      {/* ⚠️ Toast Error Message - سيظهر في كل الشاشات */}
      {errorMsg && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] bg-red-600 text-white px-6 py-3 rounded-2xl shadow-2xl font-bold flex items-center gap-2 animate-in slide-in-from-bottom-5">
          <AlertTriangle className="w-5 h-5" /> {errorMsg}
        </div>
      )}

      <nav className="border-b border-slate-800 bg-[#0b1121]/80 backdrop-blur-xl sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BarChart3 className="text-blue-500 w-5 h-5" />
            <span className="font-bold text-lg">TamtechAI</span>
          </div>
          
          <div className="flex items-center gap-2">
            {/* الكريدت - تم إظهارها في كل الشاشات بشكل محسّن */}
            {token ? (
              <div className="flex items-center gap-1.5 bg-blue-500/10 border border-blue-500/20 px-2 py-1 rounded-full">
                <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                <span className="text-[10px] font-black">{credits}</span>
              </div>
            ) : (
              <div className="flex items-center gap-1 bg-slate-800 px-2 py-1 rounded-full">
                <User className="w-3 h-3 text-slate-400" />
                <span className="text-[10px] font-bold text-slate-400">{guestTrials}</span>
              </div>
            )}

            <div className="flex bg-slate-900 border border-slate-800 rounded-full p-0.5">
              {['en', 'ar'].map((l) => (<button key={l} onClick={() => setLang(l)} className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${lang === l ? 'bg-blue-600' : 'text-slate-500'}`}>{l}</button>))}
            </div>

            {token ? (
              <button onClick={logout} className="p-1.5 text-slate-500 hover:text-red-400"><LogOut className="w-4 h-4"/></button>
            ) : (
              <button onClick={() => { setAuthMode("login"); setShowAuthModal(true); }} className="text-[10px] font-bold bg-blue-600 px-3 py-1.5 rounded-lg">Login</button>
            )}
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-center mb-10">
          <div className="flex gap-2 w-full max-w-lg">
            <div className="flex-1 flex items-center bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden focus-within:border-blue-500 transition">
              <input type="text" placeholder={t.searchPlaceholder} className="w-full bg-transparent p-4 text-sm outline-none font-mono uppercase" value={ticker} onChange={(e) => setTicker(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleAnalyze()} />
              <button onClick={() => handleAnalyze()} disabled={loading} className="bg-blue-600 px-4 md:px-8 py-4 font-bold text-sm disabled:opacity-50">{loading ? "..." : t.analyze}</button>
            </div>
            <button onClick={fetchRandomStock} disabled={loadingRandom} className="bg-slate-800 p-4 rounded-2xl hover:bg-slate-700 transition">
               {loadingRandom ? <div className="animate-spin w-5 h-5 border-2 border-blue-500 rounded-full border-t-transparent"></div> : <Dices className="w-5 h-5 text-purple-400" />}
            </button>
          </div>
        </div>

        {/* Auth Modal */}
        {showAuthModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 animate-in fade-in">
            <div className="bg-slate-950 border border-slate-800 p-8 rounded-[32px] max-w-sm w-full relative">
              <button onClick={() => setShowAuthModal(false)} className="absolute top-6 right-6 text-slate-600"><XCircle className="w-6 h-6"/></button>
              <h2 className="text-2xl font-bold text-center mb-8">{authMode === "login" ? t.loginBtn : t.signupBtn}</h2>
              <div className="space-y-4">
                <input type="email" placeholder={t.email} className="w-full bg-slate-900 border border-slate-800 rounded-xl p-4 text-sm" value={email} onChange={e=>setEmail(e.target.value)} />
                <input type="password" placeholder={t.pass} className="w-full bg-slate-900 border border-slate-800 rounded-xl p-4 text-sm" value={password} onChange={e=>setPassword(e.target.value)} />
                <button onClick={handleAuth} className="w-full bg-blue-600 py-4 rounded-xl font-bold active:scale-95 transition">Go</button>
                <button onClick={() => setAuthMode(authMode==="login"?"signup":"login")} className="w-full text-xs text-slate-500">{authMode==="login" ? t.switchSign : t.switchLog}</button>
              </div>
            </div>
          </div>
        )}

        {/* Paywall */}
        {showPaywall && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4">
            <div className="bg-slate-950 border border-slate-800 p-8 rounded-[32px] max-w-sm w-full text-center">
              <div className="bg-blue-500/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6"><Lock className="w-6 h-6 text-blue-500" /></div>
              <h2 className="text-2xl font-bold mb-2">{t.paywallTitle}</h2>
              <p className="text-slate-500 text-sm mb-8">{t.paywallDesc}</p>
              <a href="https://tamtechfinance.gumroad.com/l/tool" target="_blank" className="block w-full bg-white text-black font-bold py-4 rounded-xl mb-6">Upgrade Now</a>
              <div className="flex gap-2">
                <input type="text" placeholder="..." className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 text-xs" value={licenseKey} onChange={(e) => setLicenseKey(e.target.value)} />
                <button onClick={handleRedeem} className="bg-slate-800 px-4 py-2 rounded-xl text-xs font-bold">Redeem</button>
              </div>
              <button onClick={()=>setShowPaywall(false)} className="mt-6 text-[10px] text-slate-600 uppercase font-black">Close</button>
            </div>
          </div>
        )}

        {/* Results */}
        {result && !loading && (
            <div className="space-y-6 pb-20 animate-in fade-in slide-in-from-bottom-4">
               {/* نفس كود عرض النتائج السابق مع تحسين التجاوب */}
               <div id="report-content" className="space-y-6">
                 <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 md:p-10">
                    <div className="flex justify-between items-start mb-6">
                       <div>
                         <h1 className="text-3xl md:text-5xl font-black mb-2">{result.data.companyName}</h1>
                         <p className="text-blue-500 font-mono font-bold">{result.ticker}</p>
                       </div>
                       <div className="text-right">
                         <div className="text-2xl md:text-4xl font-mono font-bold">${result.data.price?.toFixed(2)}</div>
                         <div className={`mt-2 text-xs font-bold px-3 py-1 rounded-full border ${getVerdictColor(result.analysis.verdict)}`}>{result.analysis.verdict}</div>
                       </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      <div className="bg-slate-800/30 p-6 rounded-2xl">
                         <h3 className="text-xs font-black text-slate-500 uppercase mb-4 tracking-widest">Business Analysis</h3>
                         <p className="text-sm text-slate-300 leading-relaxed">{result.analysis.chapter_1_the_business}</p>
                      </div>
                      <div className="bg-slate-800/30 p-6 rounded-2xl">
                         <h3 className="text-xs font-black text-slate-500 uppercase mb-4 tracking-widest">Financials</h3>
                         <p className="text-sm text-slate-300 leading-relaxed">{result.analysis.chapter_2_financials}</p>
                      </div>
                      <div className="bg-slate-800/30 p-6 rounded-2xl">
                         <h3 className="text-xs font-black text-slate-500 uppercase mb-4 tracking-widest">Valuation</h3>
                         <p className="text-sm text-slate-300 leading-relaxed">{result.analysis.chapter_3_valuation}</p>
                      </div>
                    </div>
                 </div>
               </div>
               <button onClick={handleDownloadPDF} className="w-full bg-slate-800 py-4 rounded-2xl font-bold flex items-center justify-center gap-2"><Download className="w-4 h-4"/> Download Report</button>
            </div>
        )}

        {!result && !loading && (
          <div className="text-center py-20">
             <h1 className="text-4xl md:text-6xl font-black mb-6 bg-gradient-to-b from-white to-slate-500 bg-clip-text text-transparent">Market IQ Redefined.</h1>
             <p className="text-slate-500 max-w-xl mx-auto text-sm md:text-lg">Institutional-grade AI for decoding markets in seconds.</p>
          </div>
        )}
        
        {loading && <div className="flex justify-center py-20"><div className="animate-spin w-10 h-10 border-4 border-blue-600 rounded-full border-t-transparent"></div></div>}
      </main>
    </div>
  );
}