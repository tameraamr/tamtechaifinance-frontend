"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  TrendingUp, TrendingDown, DollarSign, PieChart, ShieldCheck, Target,
  CheckCircle, XCircle, BarChart3, Search, Zap, AlertTriangle, Trophy, Lightbulb, Lock, Star, LogOut, User, Calendar, Brain, HelpCircle, Activity, Download, Dices, ArrowLeft
} from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from 'recharts';
import { toPng } from 'html-to-image';
import jsPDF from 'jspdf';

// Import components
import NewsAnalysis from '../../../src/components/NewsAnalysis';
import Forecasts from '../../../src/components/Forecasts';
import { useAuth } from '../../../src/context/AuthContext';

const BASE_URL = "https://tamtechaifinance-backend-production.up.railway.app";

// Utility functions
const cleanAIOutput = (text: string) => {
  if (!text) return "";
  return text
    .replace(/^Headline:\s*.+?:\s*/i, "") // بيحذف Headline واسم الشركة المتكرر
    .replace(/^Headline:\s*/i, "")        // بيحذف كلمة Headline لوحدها
    .replace(/(\d+\.\d{3,})/g, (m) => parseFloat(m).toFixed(2)); // بيقصر الأرقام الطويلة
};

const translations: any = {
  en: {
    download: "Download PDF",
    reportTitle: "AI Analysis Report",
    analyst: "Analyst",
    verdict: "VERDICT",
    confidence: "Confidence",
    low: "52W Low",
    high: "52W High",
    metricsTitle: "Key Metrics",
    radar: "AI Radar",
    swot: "SWOT Analysis",
    strengths: "Strengths",
    weaknesses: "Weaknesses",
    opportunities: "Opportunities",
    threats: "Threats",
    bull: "Bull Case",
    bear: "Bear Case",
    disclaimerTitle: "Important Disclaimer",
    disclaimerText: "This analysis is for informational purposes only and should not be considered as financial advice. Always consult with a qualified financial advisor before making investment decisions. Past performance does not guarantee future results."
  },
  ar: {
    download: "تحميل PDF",
    reportTitle: "تقرير التحليل الذكي",
    analyst: "المحلل",
    verdict: "الحكم",
    confidence: "الثقة",
    low: "أدنى 52 أسبوع",
    high: "أعلى 52 أسبوع",
    metricsTitle: "المؤشرات الرئيسية",
    radar: "رادار الذكاء الاصطناعي",
    swot: "تحليل SWOT",
    strengths: "نقاط القوة",
    weaknesses: "نقاط الضعف",
    opportunities: "الفرص",
    threats: "التهديدات",
    bull: "سيناريو الصعود",
    bear: "سيناريو الهبوط",
    disclaimerTitle: "إخلاء مسؤولية مهم",
    disclaimerText: "هذا التحليل لأغراض معلوماتية فقط ولا يجب اعتباره نصيحة مالية. استشر دائمًا مستشار مالي مؤهل قبل اتخاذ قرارات الاستثمار. الأداء السابق لا يضمن النتائج المستقبلية."
  },
  it: {
    download: "Scarica PDF",
    reportTitle: "Rapporto Analisi IA",
    analyst: "Analista",
    verdict: "VERDETTO",
    confidence: "Fiducia",
    low: "Min 52 Sett",
    high: "Max 52 Sett",
    metricsTitle: "Metriche Chiave",
    radar: "Radar IA",
    swot: "Analisi SWOT",
    strengths: "Punti di Forza",
    weaknesses: "Punti deboli",
    opportunities: "Opportunità",
    threats: "Minacce",
    bull: "Caso rialzista",
    bear: "Caso ribassista",
    disclaimerTitle: "Importante Disclaimer",
    disclaimerText: "Questa analisi è solo a scopo informativo e non deve essere considerata come consiglio finanziario. Consulta sempre un consulente finanziario qualificato prima di prendere decisioni di investimento. Le performance passate non garantiscono risultati futuri."
  }
};

const formatNewsDate = (dateString: string) => {
  if (!dateString) return "";
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  } catch {
    return dateString;
  }
};

const formatNumber = (num: any) => num > 1e9 ? (num/1e9).toFixed(2)+"B" : num > 1e6 ? (num/1e6).toFixed(2)+"M" : num?.toLocaleString();

const formatMetricValue = (value: any, key?: string) => {
  if (value === null || value === undefined) return "N/A";
  if (typeof value === 'string') return value; // Already formatted (like Market Cap)
  if (isNaN(value)) return "N/A";

  // For certain metrics, 0 should be treated as N/A since it's not a valid value
  const zeroIsInvalid = ['pe', 'peg', 'ps', 'pb', 'eps', 'margin', 'roe', 'beta'];
  if (value === 0 && zeroIsInvalid.includes(key || '')) return "N/A";

  return Number(value).toFixed(2);
};

const getVerdictColor = (v: string) => v?.includes("BUY") ? "text-emerald-400 border-emerald-500/50 bg-emerald-500/10" : v?.includes("SELL") ? "text-red-400 border-red-500/50 bg-red-500/10" : "text-yellow-400 border-yellow-500/50 bg-yellow-500/10";

const calculateRangePos = (c: number, l: number, h: number) => Math.min(Math.max(((c-l)/(h-l))*100, 0), 100);

const analysisProgressMessages = [
  "Fetching latest market data...",
  "Analyzing technical indicators...",
  "Processing fundamental metrics...",
  "Generating AI insights...",
  "Finalizing comprehensive report..."
];

const MetricCard = ({ label, value, metricKey, tooltipKey, suffix = "" }: any) => {
  const getMetricStatus = (key: string, value: number) => {
    // Check for invalid zeros that should be N/A
    const zeroIsInvalid = ['pe', 'peg', 'ps', 'pb', 'eps', 'margin', 'roe', 'beta'];
    if (value === 0 && zeroIsInvalid.includes(key)) return "text-slate-400";

    if(!value && value !== 0) return "text-slate-400";
    switch(key) {
        case 'peg': return value < 1 ? "text-emerald-400" : value > 2 ? "text-red-400" : "text-yellow-400";
        case 'pe': return value < 15 ? "text-emerald-400" : value > 25 ? "text-red-400" : "text-yellow-400";
        case 'ps': return value < 2 ? "text-emerald-400" : value > 5 ? "text-red-400" : "text-yellow-400";
        case 'pb': return value < 1.5 ? "text-emerald-400" : value > 3 ? "text-red-400" : "text-yellow-400";
        case 'eps': return value > 0 ? "text-emerald-400" : "text-red-400";
        case 'margin': return value > 10 ? "text-emerald-400" : value > 0 ? "text-yellow-400" : "text-red-400";
        case 'roe': return value > 15 ? "text-emerald-400" : value > 5 ? "text-yellow-400" : "text-red-400";
        case 'div': return value > 2 ? "text-emerald-400" : value > 0 ? "text-yellow-400" : "text-slate-400";
        case 'beta': return value < 1.2 ? "text-emerald-400" : value > 1.5 ? "text-red-400" : "text-yellow-400";
        case 'debt': return value < 1 ? "text-emerald-400" : value > 2 ? "text-red-400" : "text-yellow-400";
        case 'curr': return value > 1.5 ? "text-emerald-400" : value > 1 ? "text-yellow-400" : "text-red-400";
        case 'mcap': return "text-slate-200";
        default: return "text-slate-200";
    }
  };

  return (
    <div className="bg-slate-800/30 border border-slate-700/30 rounded-xl p-3 md:p-4 hover:bg-slate-800/50 transition-all group">
      <div className="text-[10px] md:text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">{label}</div>
      <div className={`text-lg md:text-xl font-mono font-bold ${getMetricStatus(metricKey, value)}`}>
        {value !== null && value !== undefined ? `${formatMetricValue(value, metricKey)}${suffix}` : "N/A"}
      </div>
    </div>
  );
};

export default function AnalysisPage() {
  const params = useParams();
  const router = useRouter();
  const ticker = params.ticker as string;

  const { token, credits, isLoggedIn, isLoading: authLoading } = useAuth();

  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [progressMessageIndex, setProgressMessageIndex] = useState(0);
  const [timeRange, setTimeRange] = useState('1Y');
  const [lang, setLang] = useState('en');

  // Authentication state
  const [authChecked, setAuthChecked] = useState(false);

  const t = translations[lang] || translations.en;
  const isRTL = lang === "ar";

  // SECURITY: Strict token check at component start - wait for AuthContext to load
  useEffect(() => {
    // Don't proceed until AuthContext has finished loading
    if (authLoading) return;

    // If no token exists after AuthContext has loaded, redirect immediately
    if (!token) {
      router.replace('/');
      return;
    }

    // Mark auth as checked
    setAuthChecked(true);
  }, [token, authLoading, router]);

  // Load analysis result from localStorage or fetch from backend
  useEffect(() => {
    if (!authChecked || !ticker) return;

    const loadAnalysisResult = async () => {
      try {
        const storedResult = localStorage.getItem('analysis_result');
        const storedTicker = localStorage.getItem('analysis_ticker');

        if (storedResult && storedTicker === ticker) {
          // Use stored data from recent analysis
          const parsedResult = JSON.parse(storedResult);
          setResult(parsedResult);
          setLoading(false);

          // Clean up both localStorage and sessionStorage after successful load
          localStorage.removeItem('analysis_result');
          localStorage.removeItem('analysis_ticker');
          sessionStorage.removeItem('analysis_result');
          sessionStorage.removeItem('analysis_ticker');
        } else {
          // No stored result - fetch from backend (shouldn't charge credits)
          setLoading(true);
          const headers: any = { "Authorization": token ? `Bearer ${token}` : "" };
          const res = await fetch(`${BASE_URL}/analyze/${ticker}?lang=en`, { headers });

          if (res.status === 402) {
            // Payment required - redirect to home
            router.replace('/');
            return;
          }

          if (!res.ok) {
            // Other error - redirect to home
            router.replace('/');
            return;
          }

          const data = await res.json();
          setResult(data);
          setLoading(false);
        }
      } catch (err) {
        // Error - redirect to home
        router.replace('/');
      }
    };

    loadAnalysisResult();
  }, [authChecked, ticker, router, token]);

  // Dynamic progress messages during loading
  useEffect(() => {
    if (!loading) {
      setProgressMessageIndex(0);
      return;
    }

    const interval = setInterval(() => {
      setProgressMessageIndex(prev => (prev + 1) % analysisProgressMessages.length);
    }, 12000); // Change every 12 seconds for analysis page

    return () => clearInterval(interval);
  }, [loading]);

  // Cleanup localStorage on component unmount if data wasn't loaded
  useEffect(() => {
    return () => {
      // Only clean up stored data if component unmounts before data was processed
      const storedResult = localStorage.getItem('analysis_result');
      const storedTicker = localStorage.getItem('analysis_ticker');
      if (storedResult && storedTicker === ticker) {
        localStorage.removeItem('analysis_result');
        localStorage.removeItem('analysis_ticker');
        sessionStorage.removeItem('analysis_result');
        sessionStorage.removeItem('analysis_ticker');
      }
    };
  }, [loading]);

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
    } catch (err) { console.error("PDF Failed", err); }
  };

  const handleBack = () => {
    // Clear any temporary View Report flags/states
    sessionStorage.removeItem('analysis_result');
    sessionStorage.removeItem('analysis_ticker');
    localStorage.removeItem('analysis_result');
    localStorage.removeItem('analysis_ticker');
    
    // Navigate back to home
    router.push('/');
  };

  const getFilteredChartData = () => {
    if (!result?.data?.chart_data) return [];

    const now = new Date();
    let daysBack = 365; // 1Y default

    switch (timeRange) {
      case '1W': daysBack = 7; break;
      case '1M': daysBack = 30; break;
      case '6M': daysBack = 180; break;
      case '1Y': daysBack = 365; break;
    }

    const cutoffDate = new Date(now.getTime() - daysBack * 24 * 60 * 60 * 1000);

    return result.data.chart_data
      .filter((item: any) => new Date(item.date) >= cutoffDate)
      .map((item: any) => ({
        date: item.date,
        price: item.price
      }));
  };

  // SECURITY: Enhanced loading state - ensure auth checks complete before showing any content
  if (loading || !authChecked || authLoading) {
    return (
      <div className="min-h-screen bg-[#0b1121] text-slate-100">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-10">
          {/* Progress Indicator */}
          <div className="flex flex-col items-center mb-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
            <div className="w-full max-w-xs bg-slate-800 rounded-full h-2 overflow-hidden mb-4">
              <div className="h-full bg-gradient-to-r from-blue-500 to-emerald-500 animate-pulse" style={{width: `${((progressMessageIndex + 1) / analysisProgressMessages.length) * 100}%`}}></div>
            </div>
            <p className="text-blue-400 text-sm font-bold animate-pulse text-center px-6 max-w-md leading-relaxed">
              {analysisProgressMessages[progressMessageIndex]}
            </p>
          </div>

          {/* Header Skeleton */}
          <div className="flex justify-end mb-6">
            <div className="h-8 w-24 bg-slate-800 rounded-lg animate-pulse"></div>
          </div>

          <div className="p-3 md:p-6 bg-[#0b1121] rounded-3xl border border-slate-800/50">
            {/* Report Header */}
            <div className="mb-6 border-b border-slate-800 pb-6 flex flex-wrap justify-between items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-slate-800 rounded-lg animate-pulse"></div>
                <div>
                  <div className="h-6 w-32 bg-slate-800 rounded animate-pulse mb-1"></div>
                  <div className="h-3 w-24 bg-slate-700 rounded animate-pulse"></div>
                </div>
              </div>
              <div className="text-right">
                <div className="h-6 w-16 bg-slate-800 rounded animate-pulse mb-1"></div>
                <div className="h-3 w-20 bg-slate-700 rounded animate-pulse"></div>
              </div>
            </div>

            {/* Price and Chart Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 mb-8">
              <div className="lg:col-span-1 bg-slate-800/40 border border-slate-700/50 rounded-2xl p-4 md:p-8">
                <div className="h-4 w-20 bg-slate-700 rounded animate-pulse mb-4"></div>
                <div className="h-12 w-24 bg-slate-800 rounded animate-pulse mb-2"></div>
                <div className="h-3 w-16 bg-slate-700 rounded animate-pulse mb-4"></div>
                <div className="space-y-2">
                  <div className="h-3 w-32 bg-slate-700 rounded animate-pulse"></div>
                  <div className="h-3 w-28 bg-slate-700 rounded animate-pulse"></div>
                </div>
              </div>
              <div className="lg:col-span-2 bg-slate-800/40 border border-slate-700/50 rounded-2xl p-4 md:p-8">
                <div className="h-4 w-24 bg-slate-700 rounded animate-pulse mb-4"></div>
                <div className="h-64 w-full bg-slate-800 rounded animate-pulse"></div>
              </div>
            </div>

            {/* Verdict Section */}
            <div className="mb-8">
              <div className="h-4 w-32 bg-slate-700 rounded animate-pulse mb-4"></div>
              <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-6">
                <div className="text-center">
                  <div className="h-8 w-24 bg-slate-800 rounded animate-pulse mx-auto mb-2"></div>
                  <div className="h-4 w-16 bg-slate-700 rounded animate-pulse mx-auto"></div>
                </div>
              </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4 mb-8">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-3">
                  <div className="h-3 w-16 bg-slate-700 rounded animate-pulse mb-2"></div>
                  <div className="h-6 w-12 bg-slate-800 rounded animate-pulse"></div>
                </div>
              ))}
            </div>

            {/* Analysis Sections */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-6">
                <div className="h-4 w-24 bg-slate-700 rounded animate-pulse mb-4"></div>
                <div className="space-y-3">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="h-3 bg-slate-700 rounded animate-pulse"></div>
                  ))}
                </div>
              </div>
              <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-6">
                <div className="h-4 w-24 bg-slate-700 rounded animate-pulse mb-4"></div>
                <div className="space-y-3">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="h-3 bg-slate-700 rounded animate-pulse"></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0b1121] text-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-400 text-lg font-bold mb-2">Error</div>
          <p className="text-slate-400">{error}</p>
          <button
            onClick={() => router.push('/')}
            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="min-h-screen bg-[#0b1121] text-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-slate-400 text-lg">No analysis data found for {ticker}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0b1121] text-slate-100">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-10">
        <div className="flex justify-between items-center mb-6">
          <button onClick={handleBack} className="flex items-center gap-2 bg-slate-800/50 hover:bg-slate-700/50 text-slate-300 px-3 md:px-4 py-2 rounded-lg text-xs md:text-sm font-bold border border-slate-600/50 transition">
            <ArrowLeft className="w-3 h-3 md:w-4 md:h-4" /> Back to Search
          </button>
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
                {result.data.recommendationKey !== "none" && <span className="text-[10px] uppercase font-black text-blue-500">{t.analyst}: {result.data.recommendationKey.replace('_', ' ')}</span>}
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
                      className={`px-3 py-1.5 rounded-xl text-[10px] font-black transition-all cursor-pointer ${timeRange === range
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
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                  <XAxis dataKey="date" stroke="#475569" tick={{ fontSize: 9, fontWeight: 'bold' }} tickFormatter={(str) => str.slice(5)} minTickGap={30} />
                  <YAxis stroke="#475569" tick={{ fontSize: 9, fontWeight: 'bold' }} domain={['auto', 'auto']} orientation={isRTL ? "right" : "left"} />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', border: '1px solid #334155', boxShadow: '0 10px 20px rgba(0,0,0,0.5)' }} />
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

          <Forecasts forecasts={result.analysis.forecasts} t={t} />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-10 mb-8">
            <div className="lg:col-span-2 space-y-6 md:space-y-8">
              <div className="bg-slate-800/20 border border-blue-500/10 p-5 md:p-8 rounded-3xl hover:bg-slate-800/40 transition-all duration-500 group">
                <h3 className="text-blue-500 font-black mb-4 flex gap-3 text-sm md:text-xl uppercase tracking-tighter items-center">
                  <div className="p-2 bg-blue-500/10 rounded-lg"><Target className="w-5 h-5 md:w-6 md:h-6" /></div>
                  Business DNA
                </h3>
                <p className="text-slate-300 text-xs md:text-base leading-relaxed font-medium">
                  {cleanAIOutput(result.analysis.chapter_1_the_business)}
                </p>
              </div>
              <div className="bg-slate-800/20 border border-emerald-500/10 p-5 md:p-8 rounded-3xl hover:bg-slate-800/40 transition-all duration-500 group">
                <h3 className="text-emerald-500 font-black mb-4 flex gap-3 text-sm md:text-xl uppercase tracking-tighter items-center">
                  <div className="p-2 bg-emerald-500/10 rounded-lg"><ShieldCheck className="w-5 h-5 md:w-6 md:h-6" /></div>
                  Financial Health
                </h3>
                <p className="text-slate-300 text-xs md:text-base leading-relaxed font-medium">
                  {cleanAIOutput(result.analysis.chapter_2_financials)}
                </p>
              </div>
              <div className="bg-slate-800/20 border border-purple-500/10 p-5 md:p-8 rounded-3xl hover:bg-slate-800/40 transition-all duration-500 group">
                <h3 className="text-purple-500 font-black mb-4 flex gap-3 text-sm md:text-xl uppercase tracking-tighter items-center">
                  <div className="p-2 bg-purple-500/10 rounded-lg"><DollarSign className="w-5 h-5 md:w-6 md:h-6" /></div>
                  Valuation Analysis
                </h3>
                <p className="text-slate-300 text-xs md:text-base leading-relaxed font-medium">
                  {cleanAIOutput(result.analysis.chapter_3_valuation)}
                </p>
              </div>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 md:p-8 h-[350px] md:h-[500px] shadow-2xl flex flex-col sticky top-24">
              <h3 className="text-center font-black text-slate-400 mb-6 flex justify-center gap-3 text-xs md:text-lg uppercase tracking-widest">
                <Zap className="w-5 h-5 text-yellow-400 fill-yellow-400/20" /> {t.radar}
              </h3>
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="60%" data={result.analysis.radar_scores}>
                  <PolarGrid stroke="#1e293b" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 10, fontWeight: 'bold' }} />
                  <PolarRadiusAxis angle={30} domain={[0, 10]} tick={false} axisLine={false} />
                  <Radar name="Score" dataKey="A" stroke="#3b82f6" strokeWidth={3} fill="#3b82f6" fillOpacity={0.5} />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', border: '1px solid #334155' }} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* قسم مشاعر الأخبار المطور مع الروابط والوقت */}
          <NewsAnalysis newsAnalysis={result?.analysis?.news_analysis} formatNewsDate={formatNewsDate} lang={lang} />

          <div className="bg-slate-900/80 border border-slate-800/50 p-6 md:p-12 rounded-[2.5rem] mb-12 shadow-2xl">
            <h3 className="text-2xl md:text-4xl font-black mb-10 text-center text-white tracking-tight">{t.swot}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
              <div className="bg-emerald-900/10 border border-emerald-500/20 p-6 md:p-8 rounded-3xl transform hover:scale-[1.02] transition-all">
                <h4 className="text-emerald-400 font-black mb-4 flex gap-3 items-center text-sm md:text-xl"><CheckCircle size={24} /> {t.strengths}</h4>
                <ul className="space-y-3">{result.analysis.swot_analysis.strengths.map((s: any, i: any) => <li key={i} className="text-slate-300 text-xs md:text-sm font-medium flex gap-2"><span>•</span> {s}</li>)}</ul>
              </div>
              <div className="bg-orange-900/10 border border-orange-500/20 p-6 md:p-8 rounded-3xl transform hover:scale-[1.02] transition-all">
                <h4 className="text-orange-400 font-black mb-4 flex gap-3 items-center text-sm md:text-xl"><AlertTriangle size={24} /> {t.weaknesses}</h4>
                <ul className="space-y-3">{result.analysis.swot_analysis.weaknesses.map((s: any, i: any) => <li key={i} className="text-slate-300 text-xs md:text-sm font-medium flex gap-2"><span>•</span> {s}</li>)}</ul>
              </div>
              <div className="bg-blue-900/10 border border-blue-500/20 p-6 md:p-8 rounded-3xl transform hover:scale-[1.02] transition-all">
                <h4 className="text-blue-400 font-black mb-4 flex gap-3 items-center text-sm md:text-xl"><Lightbulb size={24} /> {t.opportunities}</h4>
                <ul className="space-y-3">{result.analysis.swot_analysis.opportunities.map((s: any, i: any) => <li key={i} className="text-slate-300 text-xs md:text-sm font-medium flex gap-2"><span>•</span> {s}</li>)}</ul>
              </div>
              <div className="bg-red-900/10 border border-red-500/20 p-6 md:p-8 rounded-3xl transform hover:scale-[1.02] transition-all">
                <h4 className="text-red-400 font-black mb-4 flex gap-3 items-center text-sm md:text-xl"><XCircle size={24} /> {t.threats}</h4>
                <ul className="space-y-3">{result.analysis.swot_analysis.threats.map((s: any, i: any) => <li key={i} className="text-slate-300 text-xs md:text-sm font-medium flex gap-2"><span>•</span> {s}</li>)}</ul>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
            <div className="bg-emerald-900/5 border border-emerald-500/10 p-6 md:p-10 rounded-3xl">
              <h3 className="text-lg md:text-2xl font-black text-emerald-500/80 mb-6 uppercase tracking-tighter">{t.bull}</h3>
              <ul className="space-y-4">{result.analysis.bull_case_points.map((p: any, i: any) => <li key={i} className="text-slate-400 text-xs md:text-sm font-medium leading-relaxed flex gap-3"><CheckCircle className="text-emerald-500 w-5 h-5 shrink-0" size={14} /> {p}</li>)}</ul>
            </div>
            <div className="bg-red-900/5 border border-red-500/10 p-6 md:p-10 rounded-3xl">
              <h3 className="text-lg md:text-2xl font-black text-red-500/80 mb-6 uppercase tracking-tighter">{t.bear}</h3>
              <ul className="space-y-4">{result.analysis.bear_case_points.map((p: any, i: any) => <li key={i} className="text-slate-400 text-xs md:text-sm font-medium leading-relaxed flex gap-3"><AlertTriangle className="text-red-500 w-5 h-5 shrink-0" size={14} /> {p}</li>)}</ul>
            </div>
          </div>

          <footer className="border-t border-slate-800 mt-16 py-8 text-center">
            <h4 className="text-slate-500 text-[10px] md:text-xs font-black uppercase tracking-[0.3em] mb-4">{t.disclaimerTitle}</h4>
            <p className="text-slate-600 text-[9px] md:text-[11px] max-w-4xl mx-auto leading-relaxed px-6 font-medium italic">{t.disclaimerText}</p>
          </footer>
        </div>
      </div>
    </div>
  );
}