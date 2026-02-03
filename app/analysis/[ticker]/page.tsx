"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  TrendingUp, TrendingDown, DollarSign, PieChart, ShieldCheck, Target,
  CheckCircle, XCircle, BarChart3, Search, Zap, AlertTriangle, Trophy, Lightbulb, Lock, Star, LogOut, User, Calendar, Brain, HelpCircle, Activity, Download, Dices, ArrowLeft, Info
} from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from 'recharts';
import { toPng } from 'html-to-image';
import jsPDF from 'jspdf';
import toast from 'react-hot-toast';
// Import components
import NewsAnalysis from '../../../src/components/NewsAnalysis';
import Forecasts from '../../../src/components/Forecasts';
import UpgradeModal from '../../../src/components/UpgradeModal';
import { useAuth } from '../../../src/context/AuthContext';
import { useTranslation } from '../../../src/context/TranslationContext';

const BASE_URL = typeof window !== 'undefined' ? '/api' : 'https://tamtechaifinance-backend-production.up.railway.app';

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
  
  // If it's already a relative time (e.g., "2 hours ago", "Oct 24"), return as-is
  if (dateString.includes('ago') || dateString.includes('hour') || dateString.includes('min') || 
      (/^[A-Z][a-z]{2}\s\d{1,2}$/.test(dateString))) {
    return dateString;
  }
  
  // Try to parse as date
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString; // Invalid date, return original
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

const getVerdictColor = (v: string) => v?.includes("BUY") ? "text-[#10b981] border-[#10b981]/50 bg-[#10b981]/10" : v?.includes("SELL") ? "text-[#ef4444] border-[#ef4444]/50 bg-[#ef4444]/10" : "text-[#f59e0b] border-[#f59e0b]/50 bg-[#f59e0b]/10";

const calculateRangePos = (c: number, l: number, h: number) => Math.min(Math.max(((c-l)/(h-l))*100, 0), 100);

const analysisProgressMessages = [
  "Fetching latest market data...",
  "Analyzing technical indicators...",
  "Processing fundamental metrics...",
  "Generating AI insights...",
  "Finalizing comprehensive report..."
];

const MetricCard = ({ label, value, metricKey, tooltipKey, suffix = "" }: { label: string; value: number; metricKey: string; tooltipKey?: string; suffix?: string }) => {
  const { t } = useTranslation();
  const [showTooltip, setShowTooltip] = useState(false);
  
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

  const tooltipText = tooltipKey && t.tooltips && (t.tooltips as any)[tooltipKey] ? (t.tooltips as any)[tooltipKey] : "";

  // Handle touch events properly for mobile
  const handleTouch = (e: React.TouchEvent) => {
    e.preventDefault();
    setShowTooltip(!showTooltip);
  };

  // Close tooltip when clicking outside on mobile
  useEffect(() => {
    if (!showTooltip) return;
    
    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.tooltip-container')) {
        setShowTooltip(false);
      }
    };

    document.addEventListener('touchstart', handleClickOutside);
    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      document.removeEventListener('touchstart', handleClickOutside);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showTooltip]);

  return (
    <div className="bg-slate-800/30 border border-slate-700/30 rounded-xl p-3 md:p-4 hover:bg-slate-800/50 transition-all group">
      <div className="flex items-center justify-between mb-1">
        <div className="text-[10px] md:text-xs text-slate-500 font-bold uppercase tracking-wider">{label}</div>
        {tooltipText && (
          <div className="relative tooltip-container">
            <button
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
              onTouchStart={handleTouch}
              onClick={(e) => e.preventDefault()}
              className="text-slate-500 hover:text-blue-400 transition-colors touch-manipulation p-1 -m-1"
              aria-label="Show tooltip"
              type="button"
            >
              <Info className="w-3 h-3 md:w-4 md:h-4" />
            </button>
            {showTooltip && (
              <div 
                className="fixed md:absolute z-[9999] left-1/2 -translate-x-1/2 bottom-16 md:left-auto md:translate-x-0 md:bottom-full md:right-0 mb-2 w-[calc(100vw-2rem)] max-w-xs md:w-72 bg-slate-900 border border-slate-700 rounded-lg p-3 shadow-2xl text-xs text-slate-300 leading-relaxed"
                style={{
                  animation: 'fadeIn 0.2s ease-in-out'
                }}
              >
                {tooltipText}
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 md:left-auto md:translate-x-0 md:right-4 w-2 h-2 bg-slate-900 border-r border-b border-slate-700 transform rotate-45"></div>
              </div>
            )}
          </div>
        )}
      </div>
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

  const { credits, isLoggedIn, isLoading: authLoading, isPro } = useAuth();

  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [progressMessageIndex, setProgressMessageIndex] = useState(0);
  const [timeRange, setTimeRange] = useState('1Y');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  const handleRefreshAnalysis = async () => {
    if (isRefreshing) return;
    
    setIsRefreshing(true);
    try {
      const refreshToast = toast.loading(isRTL ? "جاري تحديث التحليل..." : "Refreshing analysis...");
      
      const res = await fetch(`${BASE_URL}/analyze/${ticker}?lang=${lang}&force_refresh=true`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.detail || 'Failed to refresh analysis');
      }

      const data = await res.json();
      
      // DEBUG: Log the returned data
      console.log('Refresh response data:', data);
      console.log('Upcoming catalysts:', data.analysis?.upcoming_catalysts);
      console.log('Competitors:', data.analysis?.competitors);
      console.log('Ownership insights:', data.analysis?.ownership_insights);
      
      // Update the result with fresh data
      setResult({...data});
      
      // Force re-render by updating refresh key
      setRefreshKey(prev => prev + 1);
      
      // Update localStorage with fresh data
      localStorage.setItem('analysis_result', JSON.stringify(data));
      localStorage.setItem('analysis_ticker', ticker);
      
      toast.success(isRTL ? "تم تحديث التحليل بنجاح!" : "Analysis refreshed successfully!", { id: refreshToast });
      
      // Update page metadata
      const companyName = data?.company_name || ticker.toUpperCase();
      document.title = `${companyName} (${ticker.toUpperCase()}) Analysis | AI Stock Report - Tamtech Finance`;
      
    } catch (error) {
      console.error('Refresh error:', error);
      toast.error(isRTL ? "فشل في تحديث التحليل" : "Failed to refresh analysis");
    } finally {
      setIsRefreshing(false);
    }
  };

  // Authentication state
  const [authChecked, setAuthChecked] = useState(false);

  const { t, lang, isRTL } = useTranslation();

  // 🔒 PREVENT CLIENT-SIDE CACHING - Force fresh data on every visit
  useEffect(() => {
    // Clear any cached analysis data when component mounts
    // This ensures users can't bypass credit charges by using browser back button
    const preventCache = () => {
      // Clear navigation cache
      if (typeof window !== 'undefined') {
        window.history.scrollRestoration = 'manual';
      }
    };
    
    preventCache();
  }, []);

  // Allow both guests and logged-in users - check happens in data loading
  useEffect(() => {
    // Wait for auth to finish loading, but allow guests
    if (authLoading) return;
    setAuthChecked(true);
  }, [authLoading]);

  // Load analysis result from localStorage or fetch from backend
  useEffect(() => {
    if (!authChecked || !ticker) return;

    const loadAnalysisResult = async () => {
      try {
        const storedResult = localStorage.getItem('analysis_result');
        const storedTicker = localStorage.getItem('analysis_ticker');

        if (storedResult && storedTicker === ticker) {
          // Use stored data from recent analysis (works for both guests and users)
          const parsedResult = JSON.parse(storedResult);
          
          // DEBUG: Log the actual structure
          console.log('📊 Analysis Result Structure:', parsedResult);
          console.log('📈 Data object:', parsedResult.data);
          console.log('🎯 Analysis object:', parsedResult.analysis);
          console.log('💰 PE Ratio paths:', {
            'data.pe_ratio': parsedResult?.data?.pe_ratio,
            'pe_ratio': parsedResult?.pe_ratio,
            'metrics.pe_ratio': parsedResult?.metrics?.pe_ratio
          });
          
          setResult(parsedResult);
          setLoading(false);
          
          // SEO: Update page metadata dynamically
          const companyName = parsedResult?.company_name || parsedResult?.data?.companyName || ticker.toUpperCase();
          document.title = `${companyName} (${ticker.toUpperCase()}) Analysis | AI Stock Report - Tamtech Finance`;
          const metaDescription = document.querySelector('meta[name="description"]');
          if (metaDescription) {
            metaDescription.setAttribute('content', `Comprehensive AI analysis for ${companyName} (${ticker.toUpperCase()}). Get financial health score, risk assessment, SWOT analysis, and investment insights.`);
          }
          
          // Add canonical tag
          let canonical = document.querySelector('link[rel="canonical"]');
          if (!canonical) {
            canonical = document.createElement('link');
            canonical.setAttribute('rel', 'canonical');
            document.head.appendChild(canonical);
          }
          canonical.setAttribute('href', `https://tamtech-finance.com/analysis/${ticker.toLowerCase()}`);

          // DON'T delete localStorage - keep it for future views
          // This allows users to view their analysis results multiple times
          // Only clear when navigating away or analyzing a new stock
        } else {
          // No stored result - redirect back to analyzer instead of refetching
          router.replace('/stock-analyzer');
          return;
        }
      } catch (err) {
        // Error - redirect to analyzer
        router.replace('/stock-analyzer');
      }
    };

    loadAnalysisResult();
  }, [authChecked, ticker, router]);

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

  // Note: We no longer clean up localStorage on unmount
  // This allows users to navigate back to analysis results

const handleDownloadPDF = async () => {
  const input = document.getElementById('report-content');
  if (!input || isGeneratingPDF) return; // صمام أمان لمنع البدء المتكرر

  // 🔥 PRO CHECK: PDF Download is Pro-only feature
  if (!isPro && isLoggedIn) {
    toast.error("📄 PDF Export is a Pro-only feature! Upgrade to download professional reports.", {
      duration: 5000,
      icon: "🔒"
    });
    setShowUpgradeModal(true);
    return;
  }

  setIsGeneratingPDF(true); // تفعيل الـ Spinner فوراً
  
  // إظهار تنبيه للمستخدم ببدء العملية
  const pdfToast = toast.loading(isRTL ? "جاري تجهيز تقريرك الاحترافي... انتظر قليلاً" : "Preparing your report... please wait");

  try {
    // إعدادات الصورة بدقة عالية
    const dataUrl = await toPng(input, { 
      cacheBust: true, 
      pixelRatio: 2,
      backgroundColor: '#0b1121' // يحافظ على لون الخلفية الداكن في الـ PDF
    });

    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const imgProps = pdf.getImageProperties(dataUrl);
    const imgHeight = (imgProps.height * pdfWidth) / imgProps.width;
    
    let heightLeft = imgHeight;
    let position = 0;

    // إضافة الصفحة الأولى
    pdf.addImage(dataUrl, 'PNG', 0, position, pdfWidth, imgHeight);
    heightLeft -= pdfHeight;

    // معالجة الصفحات المتعددة تلقائياً إذا كان التقرير طويلاً
    while (heightLeft > 0) { 
      position -= pdfHeight; 
      pdf.addPage(); 
      pdf.addImage(dataUrl, 'PNG', 0, position, pdfWidth, imgHeight); 
      heightLeft -= pdfHeight; 
    }

    pdf.save(`${ticker || "Analysis"}_TamtechAI.pdf`);
    
    // تحديث التنبيه للنجاح
    toast.success(isRTL ? "تم تحميل التقرير بنجاح! 🚀" : "Report downloaded successfully!", { id: pdfToast });

  } catch (err) {
    console.error("PDF Failed", err);
    toast.error(isRTL ? "فشل تحميل التقرير، حاول مرة أخرى" : "Failed to generate PDF", { id: pdfToast });
  } finally {
    setIsGeneratingPDF(false); // إعادة الزر لحالته الطبيعية مهما كانت النتيجة
  }
};

  const handleBack = () => {
    // Clear any temporary View Report flags/states
    sessionStorage.removeItem('analysis_result');
    sessionStorage.removeItem('analysis_ticker');
    localStorage.removeItem('analysis_result');
    localStorage.removeItem('analysis_ticker');
    
    // Navigate back to previous page (dashboard)
    router.back();
  };

  // Helper function to safely extract metric values from result object
  const getMetric = (key: string) => {
    if (!result) return null;
    
    // Try multiple paths in order of preference
    const paths = [
      result?.data?.[key],           // result.data.pe_ratio
      result?.[key],                  // result.pe_ratio
      result?.metrics?.[key],         // result.metrics.pe_ratio
      result?.analysis?.metrics?.[key] // result.analysis.metrics.pe_ratio
    ];
    
    for (const value of paths) {
      // Treat 0, null, undefined, 'N/A', and empty strings as invalid
      if (value !== null && value !== undefined && value !== 'N/A' && value !== 0 && value !== '') {
        return value;
      }
    }
    
    return null;
  };

  const getFilteredChartData = () => {
    const chartData = getMetric('chart_data') ?? getMetric('historical_data') ?? getMetric('chartData') ?? [];
    if (!chartData || !Array.isArray(chartData)) {
      console.log('⚠️ No chart data found. Available keys:', result ? Object.keys(result) : 'no result');
      return [];
    }

    const now = new Date();
    let daysBack = 365; // 1Y default

    switch (timeRange) {
      case '1W': daysBack = 7; break;
      case '1M': daysBack = 30; break;
      case '6M': daysBack = 180; break;
      case '1Y': daysBack = 365; break;
    }

    const cutoffDate = new Date(now.getTime() - daysBack * 24 * 60 * 60 * 1000);

    return chartData
      .filter((item: any) => item && item.date && new Date(item.date) >= cutoffDate)
      .map((item: any) => ({
        date: item.date,
        price: item.price || 0
      }));
  };

  // SECURITY: Enhanced loading state - ensure auth checks complete before showing any content
  if (loading || !authChecked || authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0b1121] via-[#070b14] to-[#0b1121]" style={{ color: 'var(--text-primary)' }}>
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-10">
          {/* Progress Indicator */}
          <div className="flex flex-col items-center mb-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 mb-4" style={{ borderColor: 'var(--accent-primary)' }}></div>
            <div className="w-full max-w-xs rounded-full h-2 overflow-hidden mb-4" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
              <div className="h-full animate-pulse" style={{
                background: 'linear-gradient(to right, var(--accent-primary), var(--accent-secondary))',
                width: `${((progressMessageIndex + 1) / analysisProgressMessages.length) * 100}%`
              }}></div>
            </div>
            <p className="text-sm font-bold animate-pulse text-center px-6 max-w-md leading-relaxed" style={{ color: 'var(--accent-primary)' }}>
              {analysisProgressMessages[progressMessageIndex]}
            </p>
          </div>

          {/* Header Skeleton */}
          <div className="flex justify-end mb-6">
            <div className="h-8 w-24 rounded-lg animate-pulse" style={{ backgroundColor: 'var(--bg-tertiary)' }}></div>
          </div>

          <div className="p-3 md:p-6 rounded-3xl" style={{
            backgroundColor: 'var(--bg-primary)',
            border: '1px solid var(--border-primary)'
          }}>
            {/* Report Header */}
            <div className="mb-6 pb-6 flex flex-wrap justify-between items-center gap-4" style={{ borderBottom: '1px solid var(--border-primary)' }}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg animate-pulse" style={{ backgroundColor: 'var(--bg-tertiary)' }}></div>
                <div>
                  <div className="h-6 w-32 rounded animate-pulse mb-1" style={{ backgroundColor: 'var(--bg-tertiary)' }}></div>
                  <div className="h-3 w-24 rounded animate-pulse" style={{ backgroundColor: 'var(--bg-secondary)' }}></div>
                </div>
              </div>
              <div className="text-right">
                <div className="h-6 w-16 rounded animate-pulse mb-1" style={{ backgroundColor: 'var(--bg-tertiary)' }}></div>
                <div className="h-3 w-20 rounded animate-pulse" style={{ backgroundColor: 'var(--bg-secondary)' }}></div>
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
    <div key={refreshKey} className="min-h-screen bg-gradient-to-b from-[#0b1121] via-[#070b14] to-[#0b1121]" style={{ color: 'var(--text-primary)' }}>
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-10">
        <div className="flex justify-between items-center mb-6">
          <button onClick={handleBack} className="flex items-center gap-2 px-3 md:px-4 py-2 rounded-lg text-xs md:text-sm font-bold transition" style={{
            backgroundColor: 'var(--card-bg)',
            color: 'var(--text-secondary)',
            border: '1px solid var(--border-primary)'
          }}>
            <ArrowLeft className="w-3 h-3 md:w-4 md:h-4" /> Back to Search
          </button>
          <div className="flex gap-3">
            <button
              onClick={handleRefreshAnalysis}
              disabled={isRefreshing}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs md:text-sm font-bold transition disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                backgroundColor: 'var(--accent-primary)',
                color: 'white',
                border: '1px solid var(--accent-primary)'
              }}
            >
              {isRefreshing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>{isRTL ? "جاري التحديث..." : "Refreshing..."}</span>
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4" />
                  <span>{isRTL ? "تحديث التحليل" : "Refresh Analysis"}</span>
                </>
              )}
            </button>
            <button
              onClick={handleDownloadPDF}
              disabled={isGeneratingPDF}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold transition-all disabled:opacity-70 disabled:cursor-wait shadow-lg"
              style={{
                background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
                color: 'white',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)'
              }}
            >
              {isGeneratingPDF ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>{isRTL ? "جاري التوليد..." : "Generating..."}</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>{isRTL ? "تحميل تقرير PDF" : "Download PDF Report"}</span>
                </>
              )}
            </button>
          </div>
        </div>

        <div id="report-content" className="p-3 md:p-6 rounded-3xl" style={{
          backgroundColor: 'var(--bg-primary)',
          border: '1px solid var(--border-primary)'
        }}>
          <div className="mb-6 pb-6 flex flex-wrap justify-between items-center gap-4" style={{ borderBottom: '1px solid var(--border-primary)' }}>
            <div className="flex items-center gap-3">
              <BarChart3 className="w-7 h-7 md:w-10 md:h-10" style={{ color: 'var(--accent-primary)' }} />
              <div>
                <h1 className="text-xl md:text-3xl font-black tracking-tighter" style={{ color: 'var(--text-primary)' }}>TamtechAI <span style={{ color: 'var(--accent-primary)' }}>Pro</span></h1>
                <p className="text-[10px] md:text-xs uppercase font-bold tracking-widest" style={{ color: 'var(--text-muted)' }}>{t.reportTitle}</p>
              </div>
            </div>
            <div className="text-right">
              <div className="font-mono font-black text-xl md:text-3xl" style={{ color: 'var(--text-primary)' }}>{result.ticker}</div>
              <div className="text-[10px] md:text-xs font-bold" style={{ color: 'var(--text-muted)' }}>{new Date().toLocaleDateString()}</div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 mb-8">
            <div className="lg:col-span-1 rounded-2xl p-4 md:p-8 flex flex-col justify-center" style={{
              backgroundColor: 'var(--card-bg)',
              border: '1px solid var(--border-primary)'
            }}>
              <div className="flex justify-between items-center mb-4">
                <span className="px-3 py-1 rounded-lg text-xs md:text-sm font-mono font-bold" style={{
                  backgroundColor: 'rgba(59, 130, 246, 0.1)',
                  color: 'var(--accent-primary)',
                  border: '1px solid rgba(59, 130, 246, 0.2)'
                }}>{result.ticker}</span>
                {(result?.data?.recommendationKey ?? result?.recommendationKey) !== "none" && <span className="text-[10px] uppercase font-black" style={{ color: 'var(--accent-primary)' }}>{t.analyst}: {(result?.data?.recommendationKey ?? result?.recommendationKey ?? '').replace('_', ' ')}</span>}
              </div>
              <h2 className="text-2xl md:text-4xl font-black mb-1 leading-tight" style={{ color: 'var(--text-primary)' }}>{getMetric('companyName') ?? getMetric('company_name') ?? getMetric('longName') ?? ticker}</h2>
              
              {/* 💹 LIVE PRICE */}
              <div className="flex items-baseline gap-3 my-6">
                <div className="text-4xl md:text-6xl font-mono font-black" style={{ color: 'var(--text-primary)' }} dir="ltr">
                  ${(getMetric('price') ?? getMetric('currentPrice') ?? getMetric('regularMarketPrice') ?? 0).toFixed(2)}
                </div>
                <div className="flex items-center gap-1.5 rounded-full px-2.5 py-1" style={{
                  backgroundColor: 'rgba(16, 185, 129, 0.1)',
                  border: '1px solid rgba(16, 185, 129, 0.3)'
                }}>
                  <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                  <span className="text-[9px] md:text-[10px] font-black uppercase tracking-wider" style={{ color: '#10b981' }}>LIVE</span>
                </div>
              </div>
              
              <div className="mb-8">
                <div className="flex justify-between text-[10px] md:text-xs font-bold mb-2" style={{ color: 'var(--text-muted)' }}>
                  <span>{t.low}: ${getMetric('fiftyTwoWeekLow') ?? getMetric('52WeekLow') ?? 0}</span>
                  <span>{t.high}: ${getMetric('fiftyTwoWeekHigh') ?? getMetric('52WeekHigh') ?? 0}</span>
                </div>
                <div className="w-full h-2 md:h-3 rounded-full overflow-hidden relative shadow-inner" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
                  <div className="h-full absolute transition-all duration-1000 shadow-[0_0_10px_rgba(59,130,246,0.5)]" style={{
                    background: 'linear-gradient(to right, var(--accent-primary), var(--accent-secondary))',
                    left: `${calculateRangePos(getMetric('price') ?? getMetric('currentPrice') ?? 0, getMetric('fiftyTwoWeekLow') ?? 0, getMetric('fiftyTwoWeekHigh') ?? 100) - 2}%`,
                    width: '4%'
                  }}>
                  </div>
                </div>
              </div>
              <div className={`p-6 rounded-2xl text-center border-2 shadow-2xl shadow-card-premium transition-all duration-500 ${getVerdictColor(result.analysis.verdict)}`}>
                <div className="text-[10px] md:text-xs uppercase opacity-70 mb-2 font-black tracking-[0.2em]">{t.verdict}</div>
                <span className="text-3xl md:text-5xl font-black tracking-tighter block">{result.analysis.verdict}</span>
                <div className="mt-3 text-[10px] md:text-xs font-black bg-black/20 py-1 rounded-full">{t.confidence}: {result.analysis.confidence_score}%</div>
              </div>
            </div>
            <div className="lg:col-span-2 rounded-3xl p-2 md:p-8 h-[300px] md:h-[500px] shadow-2xl shadow-card-premium" style={{
              backgroundColor: 'var(--bg-secondary)',
              border: '1px solid var(--border-primary)'
            }}>
              {/* --- بداية كود الأزرار --- */}
              <div className="flex justify-between items-center mb-6 rounded-2xl p-2" style={{
                backgroundColor: 'var(--bg-tertiary)',
                border: '1px solid var(--border-secondary)'
              }}>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: 'var(--accent-primary)' }}></div>
                  <span className="text-[10px] font-black uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Market History</span>
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
              <div className="p-2 bg-blue-500/10 rounded-xl glow-primary"><Activity className="w-5 h-5 md:w-6 md:h-6 text-[var(--accent-primary)]" /></div>
              {t.metricsTitle}
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-5">
              <MetricCard label="P/E Ratio" value={getMetric('pe_ratio') ?? getMetric('trailingPE')} metricKey="pe" tooltipKey="pe" />
              <MetricCard label="PEG Ratio" value={getMetric('peg_ratio') ?? getMetric('pegRatio')} metricKey="peg" tooltipKey="peg" />
              <MetricCard label="Price/Sales" value={getMetric('price_to_sales') ?? getMetric('priceToSalesTrailing12Months')} metricKey="ps" tooltipKey="ps" />
              <MetricCard label="Price/Book" value={getMetric('price_to_book') ?? getMetric('priceToBook')} metricKey="pb" tooltipKey="pb" />
              <MetricCard label="EPS (TTM)" value={getMetric('eps') ?? getMetric('trailingEps')} metricKey="eps" tooltipKey="pe" suffix="$" />
              <MetricCard label="Profit Margin" value={getMetric('profit_margins') ?? getMetric('profitMargins')} metricKey="margin" tooltipKey="margin" suffix="%" />
              <MetricCard label="Operating Margin" value={getMetric('operating_margins') ?? getMetric('operatingMargins')} metricKey="margin" tooltipKey="margin" suffix="%" />
              <MetricCard label="ROE" value={getMetric('return_on_equity') ?? getMetric('returnOnEquity')} metricKey="roe" tooltipKey="roe" suffix="%" />
              <MetricCard label="Dividend Yield" value={getMetric('dividend_yield') ?? getMetric('dividendYield')} metricKey="div" tooltipKey="div" suffix="%" />
              <MetricCard label="Beta" value={getMetric('beta')} metricKey="beta" tooltipKey="beta" />
              <MetricCard label="Debt/Equity" value={getMetric('debt_to_equity') ?? getMetric('debtToEquity')} metricKey="debt" tooltipKey="debt" />
              <MetricCard label="Current Ratio" value={getMetric('current_ratio') ?? getMetric('currentRatio')} metricKey="curr" tooltipKey="curr" />
              <MetricCard label="Rev Growth" value={getMetric('revenue_growth') ?? getMetric('revenueGrowth')} metricKey="margin" tooltipKey="margin" suffix="%" />
              <MetricCard label="Market Cap" value={formatNumber(getMetric('market_cap') ?? getMetric('marketCap'))} metricKey="mcap" tooltipKey="pe" />
            </div>
          </div>

          {/* Earnings and Competitors Row */}
          <div className="flex flex-col md:flex-row gap-6 md:gap-8 mb-8">
            {/* Earnings Badge Section */}
            {result.analysis.upcoming_catalysts?.next_earnings_date && (
              <div className="flex-1 bg-slate-900/50 border border-slate-800/50 rounded-3xl p-4 md:p-8 shadow-xl">
                <h3 className="text-lg md:text-2xl font-black mb-6 text-white flex items-center gap-3">
                  <div className="p-2 bg-blue-500/10 rounded-xl glow-primary"><Calendar className="w-5 h-5 md:w-6 md:h-6 text-[var(--accent-primary)]" /></div>
                  Next Earnings Date
                </h3>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5 rounded-full px-4 py-2" style={{
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    border: '1px solid rgba(59, 130, 246, 0.3)'
                  }}>
                    <Calendar className="w-4 h-4 text-blue-400" />
                    <span className="text-sm md:text-base font-black uppercase tracking-wider" style={{ color: '#3b82f6' }}>
                      {new Date(result.analysis.upcoming_catalysts.next_earnings_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Competitors Section */}
            {result.analysis.competitors && result.analysis.competitors.length > 0 && (
              <div className="flex-1 bg-slate-900/50 border border-slate-800/50 rounded-3xl p-4 md:p-8 shadow-xl">
                <h3 className="text-lg md:text-2xl font-black mb-6 text-white flex items-center gap-3">
                  <div className="p-2 bg-purple-500/10 rounded-xl"><Trophy className="w-5 h-5 md:w-6 md:h-6 text-purple-400" /></div>
                  Competitors
                </h3>
                <div className="flex flex-wrap gap-3">
                  {result.analysis.competitors.map((competitor: any, index: number) => (
                    <button
                      key={index}
                      onClick={() => router.push(`/analysis/${competitor.ticker.toLowerCase()}`)}
                      className="px-4 py-2 bg-slate-800/50 border border-slate-700/50 rounded-xl text-slate-300 hover:bg-slate-700/70 hover:border-slate-600/50 transition-all font-bold text-sm uppercase tracking-wider hover:scale-105"
                      title={competitor.strength}
                    >
                      {competitor.ticker.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <Forecasts forecasts={result.analysis.forecasts} t={t} />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-10 mb-8">
            <div className="lg:col-span-2 space-y-6 md:space-y-8">
              <div className="bg-slate-800/20 border border-blue-500/10 p-5 md:p-8 rounded-3xl hover:bg-slate-800/40 transition-all duration-500 group">
                <h3 className="text-[var(--accent-primary)] font-black mb-4 flex gap-3 text-sm md:text-xl uppercase tracking-tighter items-center">
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
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 md:p-8 h-[350px] md:h-[500px] shadow-2xl shadow-card-premium flex flex-col sticky top-24">
              <h3 className="text-center font-black text-slate-400 mb-6 flex justify-center gap-3 text-xs md:text-lg uppercase tracking-widest">
                <Zap className="w-5 h-5 text-[var(--warning-primary)] fill-[var(--warning-primary)]/20" /> {t.radar}
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
                <h4 className="text-[var(--accent-secondary)] font-black mb-4 flex gap-3 items-center text-sm md:text-xl"><Lightbulb size={24} /> {t.opportunities}</h4>
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

          {/* 📊 Data Freshness Indicator */}
          <div className="mt-12 mb-8 bg-slate-800/30 border border-slate-700/50 rounded-2xl p-4 md:p-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="bg-blue-500/10 rounded-xl p-2.5">
                  <Brain className="w-5 h-5 text-[var(--accent-secondary)]" />
                </div>
                <div>
                  <div className="text-slate-200 font-bold text-sm md:text-base">Institutional Analysis</div>
                  <div className="text-slate-500 text-xs mt-0.5">
                    {result.cache_age_hours !== undefined && result.cache_age_hours > 0 
                      ? `Analysis generated ${result.cache_age_hours.toFixed(1)} hours ago`
                      : 'Fresh analysis just generated'
                    }
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 rounded-lg px-4 py-2">
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                <span className="text-emerald-400 font-bold text-xs uppercase tracking-wider">Price: Live</span>
              </div>
            </div>
            {result.analysis.ownership_insights && (
              <div className="mt-4 pt-4 border-t border-slate-700/50">
                {result.analysis.ownership_insights.institutional_sentiment && (
                  <div className="mb-3">
                    <div className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Institutional Sentiment</div>
                    <p className="text-slate-300 text-xs md:text-sm leading-relaxed font-medium">
                      {cleanAIOutput(result.analysis.ownership_insights.institutional_sentiment)}
                    </p>
                  </div>
                )}
                {result.analysis.ownership_insights.insider_trading && (
                  <div className="mb-3">
                    <div className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Insider Trading</div>
                    <p className="text-slate-300 text-xs md:text-sm leading-relaxed font-medium">
                      {cleanAIOutput(result.analysis.ownership_insights.insider_trading)}
                    </p>
                  </div>
                )}
                {result.analysis.ownership_insights.dividend_safety && (
                  <div>
                    <div className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Dividend Safety</div>
                    <p className="text-slate-300 text-xs md:text-sm leading-relaxed font-medium">
                      {cleanAIOutput(result.analysis.ownership_insights.dividend_safety)}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          <footer className="border-t border-slate-800 mt-16 py-8 text-center">
            <h4 className="text-slate-500 text-[10px] md:text-xs font-black uppercase tracking-[0.3em] mb-4">{t.disclaimerTitle}</h4>
            <p className="text-slate-600 text-[9px] md:text-[11px] max-w-4xl mx-auto leading-relaxed px-6 font-medium italic">{t.disclaimerText}</p>
          </footer>
        </div>
      </div>

      <UpgradeModal 
        isOpen={showUpgradeModal} 
        onClose={() => setShowUpgradeModal(false)}
        trigger="pdf"
      />
    </div>
  );
}