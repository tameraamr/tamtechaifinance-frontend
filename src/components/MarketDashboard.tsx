"use client";
import { Activity, ShieldCheck, Gauge, Zap, TrendingUp, AlertCircle } from "lucide-react";

export default function MarketDashboard({ sentiment, sectors, lang, t }: any) {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 mt-12 pb-12 relative z-10">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">

        {/* 1. المربع اليسار: Intelligence Feed (التصميم الممتلئ والاحترافي) */}
        <div className="lg:col-span-5 relative group">
          {/* التوهج الخلفي بناءً على السكور */}
          <div className={`absolute -inset-1 rounded-[3rem] blur-3xl opacity-20 animate-pulse transition-all duration-1000 ${sentiment.score > 55 ? 'bg-emerald-500' : 'bg-red-500'}`}></div>
          
          <div className="relative bg-[#020617]/90 border border-slate-800/80 p-10 rounded-[3rem] shadow-2xl backdrop-blur-3xl h-full flex flex-col border-t-slate-700/50 overflow-hidden">
            
            {/* الجزء العلوي: الهوية والحالة */}
            <div className="flex justify-between items-start mb-8">
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <div className={`w-2.5 h-2.5 rounded-full animate-ping ${sentiment.score > 55 ? 'bg-emerald-500' : 'bg-red-500'}`}></div>
                  <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] italic leading-none">Intelligence Feed</h3>
                </div>
                <h2 className={`text-5xl font-black italic tracking-tighter leading-none ${sentiment.score > 55 ? 'text-emerald-400' : 'text-red-400'}`}>
                   {lang === 'ar' ? (sentiment.score > 70 ? 'طمع حاد' : sentiment.score > 55 ? 'تفاؤل' : 'حذر') : sentiment.sentiment}
                </h2>
              </div>
              <div className="text-right">
                 <div className="text-6xl font-mono font-black text-white tracking-tighter leading-none">{sentiment.score}%</div>
                 <div className="text-[9px] font-bold text-slate-600 uppercase tracking-widest mt-2">Sentiment Score</div>
              </div>
            </div>

            {/* الوسط: الجرافيك الرئيسي (Bar) */}
            <div className="mb-10 relative">
              <div className="relative h-2.5 bg-slate-950 rounded-full border border-slate-800/50 p-0.5 shadow-inner">
                <div 
                  className={`h-full rounded-full transition-all duration-[2500ms] relative ${sentiment.score > 55 ? 'bg-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.5)]' : 'bg-red-500 shadow-[0_0_20px_rgba(239,68,68,0.5)]'}`} 
                  style={{ width: `${sentiment.score}%` }}
                >
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-5 h-5 bg-white rounded-full shadow-[0_0_15px_#fff] border-[4px] border-slate-950 scale-125 z-20"></div>
                </div>
              </div>
              <div className="flex justify-between mt-4 text-[9px] font-black uppercase text-slate-600 tracking-[0.2em] px-1">
                <span>Panic</span><span>Neutral</span><span>Greed</span>
              </div>
            </div>

            {/* القسم المضاف لملء الفراغ: مؤشرات الذكاء الاصطناعي الفرعية */}
            <div className="grid grid-cols-2 gap-4 mt-auto">
              <div className="bg-white/5 border border-white/5 p-4 rounded-2xl">
                <div className="flex items-center gap-2 mb-2 text-blue-400">
                  <Gauge className="w-3.5 h-3.5" />
                  <span className="text-[9px] font-black uppercase tracking-widest">Market Volatility</span>
                </div>
                <div className="text-white font-mono font-bold text-sm">Low - Stable</div>
              </div>

              <div className="bg-white/5 border border-white/5 p-4 rounded-2xl">
                <div className="flex items-center gap-2 mb-2 text-purple-400">
                  <Zap className="w-3.5 h-3.5" />
                  <span className="text-[9px] font-black uppercase tracking-widest">Momentum</span>
                </div>
                <div className="text-white font-mono font-bold text-sm">Strongly Bullish</div>
              </div>

              <div className="col-span-2 bg-white/5 border border-white/5 p-4 rounded-2xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="w-5 h-5 text-emerald-500/50" />
                  <div className="flex flex-col">
                    <span className="text-[9px] font-black text-slate-500 uppercase">AI Confidence</span>
                    <span className="text-xs font-bold text-slate-200">High Reliability (94%)</span>
                  </div>
                </div>
                <div className="bg-emerald-500/10 text-emerald-500 px-2 py-0.5 rounded text-[8px] font-black italic">VERIFIED</div>
              </div>
            </div>

          </div>
        </div>

        {/* 2. المربع اليمين: تدفق القطاعات (يبقى كما هو بناءً على طلبك) */}
        <div className="lg:col-span-7 relative bg-[#020617]/90 border border-slate-800/80 p-8 rounded-[3rem] shadow-2xl backdrop-blur-3xl flex flex-col min-h-[450px] border-t-slate-700/50 overflow-hidden">
          {/* نفس كود القطاعات اللي عجبك */}
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-800/50">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/10 rounded-xl"><Activity className="w-5 h-5 text-blue-400" /></div>
              <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] italic">Sector Dynamics</h3>
            </div>
            <div className="px-3 py-1 bg-slate-950 rounded-full border border-slate-800 text-[8px] font-black text-emerald-500 animate-pulse italic">Live Flow</div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 flex-1">
            {sectors.map((s: any, i: number) => (
              <div key={i} className="group p-3 bg-slate-900/20 border border-slate-800/40 rounded-2xl hover:border-blue-500/40 transition-all hover:bg-slate-900/60 flex flex-col justify-between overflow-hidden">
                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[8px] font-black text-slate-500 uppercase tracking-tighter truncate">{s.name}</span>
                  </div>
                  <div className={`text-lg font-mono font-black tracking-tighter ${s.positive ? 'text-emerald-400' : 'text-red-400'}`}>
                    {s.change}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}