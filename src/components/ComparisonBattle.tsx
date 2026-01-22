import React from "react";
import { XCircle, Zap, Trophy, Brain, TrendingUp, AlertTriangle } from "lucide-react";

// --- Types & Interfaces ---
interface StockData {
  symbol: string;
  price: number;
  pe_ratio: number;
  return_on_equity: number;
  revenue_growth: number;
  profit_margins: number;
  market_cap: number;
}

interface AnalysisResult {
  verdict: string;
  winner: string;
  comparison_summary: string;
}

interface ComparisonResult {
  stock1: StockData;
  stock2: StockData;
  analysis: AnalysisResult;
}

interface ComparisonBattleProps {
  showCompareModal: boolean;
  setShowCompareModal: (show: boolean) => void;
  compareTickers: { t1: string; t2: string };
  setCompareTickers: (tickers: { t1: string; t2: string }) => void;
  compareResult: ComparisonResult | null;
  loadingCompare: boolean;
  handleCompare: () => void;
  compareError: string | null;
  token: string | null;
  setAuthMode: (mode: string) => void;
  setShowAuthModal: (show: boolean) => void;
  lang: string;
  t: any; // Translation object passed from parent
}

// --- Helper Functions ---

/**
 * Cleans AI text output for a cleaner presentation.
 * Uses [\s\S]* for ES2018+ compatibility instead of the /s (dotAll) flag.
 */
// --- Helper Functions ---

/**
 * تحديث الدالة لتجنب مسح محتوى المذكرة الاستثمارية
 */
const cleanAIContent = (text: string) => {
  if (!text) return "";

  return text
    // 1. حذف الترويسة الافتتاحية بالكامل (من To the وحتى Executive Summary أو التقرير الفعلي)
    .replace(/To the Institutional Investment Committee[\s\S]*?(Executive Summary:|Analysis:|Introduction:)/i, "")
    
    // 2. حذف أي أسطر ترويسة متبقية (To:, From:, Subject:, etc.)
    .replace(/^(TO:|FROM:|DATE:|SUBJECT:|Headline:).*/gim, "")
    
    // 3. حذف الخاتمة الرسمية وما يتبعها حتى نهاية النص
    .replace(/Sincerely,[\s\S]*$/i, "")
    .replace(/\[Your Name\/Institutional Memo\]/gi, "")
    
    // 4. تنظيف المسافات الزائدة
    .trim();
};

const formatNumber = (num: number | undefined, suffix = "") => {
  if (num === undefined || num === null) return "N/A";
  return Number(num).toFixed(2) + suffix;
};

export default function ComparisonBattle({
  showCompareModal,
  setShowCompareModal,
  compareTickers,
  setCompareTickers,
  compareResult,
  loadingCompare,
  handleCompare,
  compareError,
  token,
  setAuthMode,
  setShowAuthModal,
  lang,
  t
}: ComparisonBattleProps) {
  
  if (!showCompareModal) return null;

  const isRTL = lang === "ar";
  const dir = isRTL ? "rtl" : "ltr";

  // Handle Close & Reset
  const handleClose = () => {
    setShowCompareModal(false);
  };

  // Handle Battle Launch
  const onLaunchBattle = () => {
    if (!token) {
      handleClose();
      setAuthMode("signup");
      setShowAuthModal(true);
      return;
    }
    handleCompare();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-2xl p-2 md:p-4 overflow-y-auto font-sans selection:bg-emerald-500/30">
      <div 
        dir={dir}
        className="bg-[#0b0f1a] border border-slate-800 w-full max-w-5xl rounded-[3rem] p-6 md:p-12 relative shadow-[0_0_100px_rgba(16,185,129,0.1)] my-auto max-h-[92vh] overflow-y-auto custom-scrollbar"
      >
        
        {/* Close Button */}
        <button 
          onClick={handleClose} 
          className={`absolute top-6 text-slate-500 hover:text-white transition-all hover:rotate-90 z-20 ${isRTL ? 'left-6' : 'right-6'}`}
        >
          <XCircle className="w-10 h-10" />
        </button>
        
        <div className="relative z-10">
          
          {/* --- Header Section --- */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-4 py-1.5 rounded-full text-emerald-500 text-[10px] font-black uppercase tracking-[0.3em] mb-4">
              <Zap className="w-3 h-3 fill-emerald-500" /> 
              {isRTL ? "محرك المعركة • 2 رصيد" : "Premium Battle Engine • 2 Credits"}
            </div>
            <h2 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter italic leading-none">
              Financial <span className="text-emerald-500">{isRTL ? "مواجهة" : "Showdown"}</span>
            </h2>
          </div>
          
          {/* --- Input Section --- */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-blue-400 mx-4 uppercase tracking-[0.2em] block">
                {isRTL ? "المتحدي (1)" : "Aggressive Challenger"}
              </label>
              <input 
                type="text" 
                placeholder="TICKER 1" 
                value={compareTickers.t1}
                className="w-full bg-slate-950 border border-slate-800 p-5 rounded-2xl outline-none uppercase font-mono text-center text-3xl text-blue-400 focus:border-blue-500 transition-all shadow-2xl focus:shadow-blue-500/20" 
                onChange={(e) => setCompareTickers({...compareTickers, t1: e.target.value.toUpperCase()})} 
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-emerald-400 mx-4 uppercase tracking-[0.2em] block">
                {isRTL ? "المدافع (2)" : "Value Defender"}
              </label>
              <input 
                type="text" 
                placeholder="TICKER 2" 
                value={compareTickers.t2}
                className="w-full bg-slate-950 border border-slate-800 p-5 rounded-2xl outline-none uppercase font-mono text-center text-3xl text-emerald-400 focus:border-emerald-500 transition-all shadow-2xl focus:shadow-emerald-500/20" 
                onChange={(e) => setCompareTickers({...compareTickers, t2: e.target.value.toUpperCase()})} 
              />
            </div>
          </div>

          <div className="space-y-4">
            {compareError && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-2xl text-center text-sm font-black animate-pulse flex items-center justify-center gap-2">
                <AlertTriangle className="w-5 h-5" /> {compareError}
              </div>
            )}

            <button 
              onClick={onLaunchBattle} 
              disabled={loadingCompare || !compareTickers.t1 || !compareTickers.t2} 
              className="w-full bg-white text-black hover:bg-emerald-500 hover:text-white py-6 rounded-2xl font-black text-xl md:text-2xl transition-all disabled:opacity-50 shadow-2xl active:scale-[0.98] uppercase tracking-tighter cursor-pointer flex items-center justify-center gap-3"
            >
              {loadingCompare ? (
                 <span className="animate-pulse">{isRTL ? "جاري استخراج البيانات..." : "Extracting Alpha..."}</span>
              ) : (
                <>
                  <TrendingUp className="w-6 h-6" />
                  {isRTL ? "ابدأ المقارنة العميقة" : "Launch Deep Comparison"}
                </>
              )}
            </button>
            
            <div className="flex justify-center items-center gap-2 opacity-60">
               <Zap className="w-3 h-3 text-emerald-500 fill-emerald-500" />
               <p className="text-center text-[10px] text-slate-500 font-black uppercase tracking-[0.2em]">
                  {isRTL ? "تحليل مدفوع: يخصم 2 رصيد" : "Premium Analysis: 2 Strategy Credits"}
               </p>
            </div>
          </div>

          {/* --- Results Section --- */}
          {compareResult && !loadingCompare && (
            <div className="mt-16 space-y-12 animate-in fade-in slide-in-from-bottom-10 duration-700 pb-10">
              
              {/* 1. Comparison Dashboard Cards (Price) */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                {/* Stock 1 */}
                <div className="bg-slate-900/50 border border-slate-800 p-8 rounded-[2rem] text-center group hover:border-blue-500/30 transition-all relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1 bg-blue-500/50"></div>
                  <span className="block text-[10px] text-slate-500 font-black uppercase mb-2 tracking-widest">{compareResult.stock1.symbol} Price</span>
                  <span className="text-4xl font-black text-blue-400 font-mono">${formatNumber(compareResult.stock1.price)}</span>
                </div>

                {/* VS Badge */}
                <div className="flex items-center justify-center p-4">
                  <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(16,185,129,0.4)] animate-pulse">
                    <Trophy className="text-black w-8 h-8" />
                  </div>
                </div>

                {/* Stock 2 */}
                <div className="bg-slate-900/50 border border-slate-800 p-8 rounded-[2rem] text-center group hover:border-emerald-500/30 transition-all relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500/50"></div>
                  <span className="block text-[10px] text-slate-500 font-black uppercase mb-2 tracking-widest">{compareResult.stock2.symbol} Price</span>
                  <span className="text-4xl font-black text-emerald-400 font-mono">${formatNumber(compareResult.stock2.price)}</span>
                </div>
              </div>

              {/* 2. Professional Metric Matrix Table */}
              <div className="bg-slate-950/50 border border-slate-800 rounded-[2.5rem] overflow-hidden backdrop-blur-md">
                <table className="w-full text-left">
                  <thead className="bg-slate-900/80 border-b border-slate-800">
                    <tr>
                      <th className={`p-6 text-slate-500 font-black uppercase text-[10px] tracking-[0.2em] ${isRTL ? 'text-right' : 'text-left'}`}>
                        {isRTL ? "المؤشرات المالية" : "Institutional Matrix"}
                      </th>
                      <th className="p-6 text-blue-400 font-black text-center text-xl bg-blue-500/5 font-mono border-l border-slate-800/50">
                        {compareResult.stock1.symbol}
                      </th>
                      <th className="p-6 text-emerald-400 font-black text-center text-xl bg-emerald-500/5 font-mono border-l border-slate-800/50">
                        {compareResult.stock2.symbol}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/50 font-mono">
                    {[
                      { label: "P/E Ratio (Valuation)", v1: compareResult.stock1.pe_ratio, v2: compareResult.stock2.pe_ratio },
                      { label: "ROE (Profitability)", v1: compareResult.stock1.return_on_equity, v2: compareResult.stock2.return_on_equity, suffix: "%" },
                      { label: "Rev Growth (YoY)", v1: compareResult.stock1.revenue_growth, v2: compareResult.stock2.revenue_growth, suffix: "%" },
                      { label: "Net Margin", v1: compareResult.stock1.profit_margins, v2: compareResult.stock2.profit_margins, suffix: "%" },
                      { label: "Market Cap", v1: (compareResult.stock1.market_cap / 1e9).toFixed(2), v2: (compareResult.stock2.market_cap / 1e9).toFixed(2), suffix: "B" }
                    ].map((row, i) => (
                      <tr key={i} className="hover:bg-white/[0.02] transition-colors">
                        <td className={`p-6 text-slate-400 font-bold text-xs uppercase tracking-widest ${isRTL ? 'text-right' : 'text-left'}`}>
                          {row.label}
                        </td>
                        <td className="p-6 text-white text-center text-lg border-l border-slate-800/50">
                          {formatNumber(Number(row.v1) || 0)}{row.suffix}
                        </td>
                        <td className="p-6 text-white text-center text-lg border-l border-slate-800/50">
                          {formatNumber(Number(row.v2) || 0)}{row.suffix}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* 3. Deep Analysis Verdict (The Big Winner) */}
              <div className="bg-gradient-to-br from-slate-900 to-[#0b0f1a] border border-slate-700/50 p-8 md:p-14 rounded-[3.5rem] shadow-2xl relative overflow-hidden">
                {/* Background decorative element */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>

                <div className="flex items-center gap-5 mb-10 border-b border-slate-800 pb-8 relative z-10">
                   <div className="w-16 h-16 bg-emerald-500 rounded-2xl flex items-center justify-center shadow-2xl shadow-emerald-500/30 rotate-3 shrink-0">
                      <Brain className="text-black w-10 h-10" />
                   </div>
                   <div>
                     <h4 className="text-white text-xl md:text-3xl font-black uppercase tracking-tighter italic">
                        {isRTL ? "الحكم النهائي" : "AI Analysis Verdict"}
                     </h4>
                     <p className="text-emerald-500 text-[10px] font-black uppercase tracking-[0.4em]">
                        {isRTL ? "أطروحة الفوز الحصرية" : "Proprietary Winning Thesis"}
                     </p>
                   </div>
                </div>

                {/* Verdict Content */}
                <div className="prose prose-invert max-w-none relative z-10">
                  <div className={`text-slate-300 leading-relaxed text-base md:text-xl font-medium whitespace-pre-wrap ${isRTL ? 'border-r-4 border-emerald-500 pr-6' : 'border-l-4 border-emerald-500 pl-6'}`}>
                    {cleanAIContent(compareResult.analysis.verdict)}
                  </div>
                    {/* --- قسم إخلاء المسؤولية القوي --- */}
<div className="mt-10 p-6 bg-red-500/5 border border-red-500/20 rounded-3xl">
  <div className="flex items-center gap-2 mb-3 text-red-500">
    <AlertTriangle className="w-5 h-5" />
    <span className="font-black uppercase text-[10px] tracking-widest">
      {isRTL ? "تحذير مخاطر وإخلاء مسؤولية" : "Risk Disclosure & Disclaimer"}
    </span>
  </div>
  <p className="text-[10px] md:text-xs text-slate-500 leading-relaxed font-medium italic">
    {isRTL ? (
      "هذا التقرير تم إنشاؤه بواسطة الذكاء الاصطناعي لأغراض تعليمية ومعلوماتية فقط، ولا يشكل نصيحة استثمارية أو دعوة للشراء أو البيع. الاستثمار في الأسواق المالية ينطوي على مخاطر عالية قد تؤدي لفقدان رأس المال. منصة TamtechAI والشركات التابعة لها لا تتحمل أي مسؤولية عن القرارات المالية المتخذة بناءً على هذا التحليل. يرجى دائماً استشارة مستشار مالي مرخص قبل اتخاذ أي قرار استثماري."
    ) : (
      "This AI-generated report is for educational and informational purposes only and does not constitute financial, investment, or legal advice. Trading and investing in financial markets involve significant risk of loss. TamtechAI and its affiliates are not responsible for any financial decisions made based on this analysis. Past performance is not indicative of future results. Always consult with a licensed financial advisor before making investment decisions."
    )}
  </p>
</div>
                </div>

                {/* Winner Footer */}
                <div className="mt-12 flex flex-col md:flex-row justify-between items-center gap-6 relative z-10">
                  <div className="bg-slate-950 border border-slate-800 px-8 py-4 rounded-full flex items-center gap-3 shadow-lg">
                    <div className="w-3 h-3 bg-emerald-500 rounded-full animate-ping"></div>
                    <span className="text-white font-black uppercase text-xs tracking-widest">
                      {isRTL ? "الفائز:" : "Winner:"} <span className="text-emerald-400">{compareResult.analysis.winner}</span>
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-600 font-bold uppercase tracking-widest flex items-center gap-2">
                    <Zap className="w-3 h-3" /> Verified Institutional Data Stream
                  </div>
                </div>
              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
}