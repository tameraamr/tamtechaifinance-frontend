"use client";
import { Activity } from "lucide-react";

interface Sector {
  name: string;
  change: string;
  positive: boolean;
}

interface MarketDashboardProps {
  sentiment: { sentiment: string; score: number };
  sectors: Sector[];
  lang: string;
  t: any;
}

export default function MarketDashboard({ sentiment, sectors, lang, t }: MarketDashboardProps) {
  return (
    <div className="w-full max-w-6xl mx-auto px-4 mt-12 pb-12 relative z-10">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch font-sans">

        {/* المربع اليسار: رادار المشاعر */}
        <div className="relative group min-h-[380px]">
          <div className={`absolute -inset-1 rounded-[2.5rem] blur-2xl opacity-20 animate-pulse transition-all duration-1000 ${sentiment.score > 55 ? 'bg-emerald-500' : 'bg-red-500'}`}></div>
          <div className="relative bg-[#020617]/90 border border-slate-800/80 p-8 rounded-[2.5rem] shadow-2xl backdrop-blur-3xl overflow-hidden h-full flex flex-col justify-between border-t-slate-700/50">
            <div className="flex justify-between items-start">
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <div className={`w-2.5 h-2.5 rounded-full animate-ping ${sentiment.score > 55 ? 'bg-emerald-500' : 'bg-red-500'}`}></div>
                  <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] italic">Intelligence Feed</h3>
                </div>
                <h2 className={`text-4xl font-black italic tracking-tighter ${sentiment.score > 55 ? 'text-emerald-400' : 'text-red-400'}`}>
                   {lang === 'ar' ? (sentiment.score > 75 ? 'طمع مفرط' : sentiment.score > 55 ? 'تفاؤل' : sentiment.score < 25 ? 'خوف شديد' : sentiment.score < 45 ? 'حذر' : 'حياد') : sentiment.sentiment}
                </h2>
              </div>
              <div className="text-right">
                 <div className="text-5xl font-mono font-black text-white tracking-tighter drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]">{sentiment.score}%</div>
                 <div className="text-[9px] font-bold text-slate-600 uppercase tracking-widest mt-2">Sentiment Score</div>
              </div>
            </div>
            <div className="my-10 relative">
              <div className="relative h-6 bg-slate-950 rounded-full border border-slate-800/50 p-1.5 shadow-inner">
                <div className={`h-full rounded-full transition-all duration-[2500ms] cubic-bezier(0.34, 1.56, 0.64, 1) relative shadow-[0_0_25px_rgba(0,0,0,0.5)] ${sentiment.score > 55 ? 'bg-gradient-to-r from-emerald-600 to-emerald-400' : 'bg-gradient-to-r from-red-600 to-red-400'}`} style={{ width: `${sentiment.score}%` }}>
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-7 h-7 bg-white rounded-full shadow-[0_0_20px_#fff] border-[7px] border-current scale-110"></div>
                </div>
              </div>
              <div className="flex justify-between mt-4 text-[9px] font-black uppercase text-slate-600 tracking-[0.2em] px-2">
                <span>Panic</span><span>Neutral</span><span>Greed</span>
              </div>
            </div>
          </div>
        </div>

        {/* المربع اليمين: تدفق القطاعات */}
        <div className="relative bg-[#020617]/90 border border-slate-800/80 p-8 rounded-[2.5rem] shadow-2xl backdrop-blur-3xl flex flex-col min-h-[380px] border-t-slate-700/50">
          <div className="flex items-center justify-between mb-8 border-b border-slate-800/50 pb-4">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse"></div>
              <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] italic">Sector Dynamics</h3>
            </div>
            <div className="text-[8px] font-black text-slate-700 uppercase tracking-widest">Real-time Stream</div>
          </div>
          <div className="space-y-4 flex-1">
            {sectors.length > 0 ? sectors.map((s, i) => (
              <div key={i} className="flex justify-between items-center p-5 bg-slate-900/30 rounded-[1.5rem] border border-slate-800/40 hover:border-blue-500/30 transition-all hover:bg-slate-900/50 group">
                <span className="text-sm font-black text-slate-300 uppercase tracking-tight group-hover:text-white transition-colors">{s.name}</span>
                <div className="flex items-center gap-5">
                  <span className={`text-sm font-mono font-black ${s.positive ? 'text-emerald-400' : 'text-red-400'}`}>{s.change}</span>
                  <div className={`w-1.5 h-7 rounded-full ${s.positive ? 'bg-emerald-500' : 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.3)]'}`}></div>
                </div>
              </div>
            )) : (
              <div className="flex flex-col items-center justify-center h-full gap-4 opacity-30 grayscale">
                <Activity className="w-10 h-10 animate-spin text-slate-500" />
                <span className="text-[10px] font-black uppercase tracking-[0.3em]">Connecting to Market Data...</span>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}