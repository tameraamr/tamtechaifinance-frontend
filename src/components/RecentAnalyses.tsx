"use client";

interface RecentAnalysesProps {
  recentAnalyses: any[];
  lang: string;
  setTicker: (ticker: string) => void;
  handleAnalyze: (ticker: string) => void;
}

export default function RecentAnalyses({ recentAnalyses, lang, setTicker, handleAnalyze }: RecentAnalysesProps) {
  // 1. تأكد أن المكون يقرأ البيانات حتى لو كانت فارغة للحظات
  if (!recentAnalyses || recentAnalyses.length === 0) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 mb-12 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-sm md:text-xl font-black text-white flex items-center gap-2 uppercase tracking-tighter">
          <span className="w-1.5 h-5 bg-blue-500 rounded-full"></span>
          {lang === 'ar' ? 'أحدث التحليلات' : 'Recent Analyses'}
        </h2>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Live Feed</span>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-4">
        {recentAnalyses.map((item, index) => (
          <button
            key={index}
            onClick={() => {
              setTicker(item.ticker);
              handleAnalyze(item.ticker); // نمرر الـ ticker مباشرة للدالة
            }}
            className="bg-slate-900/40 border border-slate-800 p-3 md:p-4 rounded-2xl hover:border-blue-500/50 transition-all group text-left relative overflow-hidden active:scale-95"
          >
            <div className="flex justify-between items-start mb-2">
              <span className="text-sm md:text-lg font-black text-white group-hover:text-blue-400 transition-colors font-mono">{item.ticker}</span>
              {/* تعديل: استخدمنا created_at ليتوافق مع الباك-إند */}
              <span className="text-[9px] font-bold text-slate-600 uppercase">
                {item.created_at ? new Date(item.created_at).toLocaleDateString() : 'Recent'}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <div className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-tighter ${
                item.verdict?.includes('BUY') ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                item.verdict?.includes('SELL') ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
              }`}>
                {item.verdict || 'ANALYZED'}
              </div>
            </div>
            <div className="absolute -right-2 -bottom-2 w-12 h-12 bg-blue-500/5 rounded-full blur-2xl group-hover:bg-blue-500/10 transition-all"></div>
          </button>
        ))}
      </div>
    </div>
  );
}