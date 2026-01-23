"use client";
import { useEffect, useState } from 'react';
import { History } from 'lucide-react';

interface RecentAnalysesProps {
  recentAnalyses: any[];
  lang: string;
  setTicker: (ticker: string) => void;
  handleAnalyze: (ticker: string) => void;
}

export default function RecentAnalyses({ recentAnalyses, lang, setTicker, handleAnalyze }: RecentAnalysesProps) {
  const [displayData, setDisplayData] = useState<any[]>([]);

  // 1. عند تحميل الصفحة: اقرأ من الـ localStorage فوراً لتجنب الـ 3 ثواني تأخير
  useEffect(() => {
    const cachedData = localStorage.getItem('recent_analyses_cache');
    if (cachedData) {
      setDisplayData(JSON.parse(cachedData));
    }
  }, []);

  // 2. عندما تصل بيانات الباك-أند: حدث الواجهة واحفظ النسخة الجديدة في الكاش
  useEffect(() => {
    if (recentAnalyses && recentAnalyses.length > 0) {
      setDisplayData(recentAnalyses);
      localStorage.setItem('recent_analyses_cache', JSON.stringify(recentAnalyses));
    }
  }, [recentAnalyses]);

  if (displayData.length === 0) return null;

  return (
    <div className="mt-0.1 flex flex-wrap items-center justify-center gap-2 px-4 animate-in fade-in duration-500">
      <div className="flex items-center gap-1.5 mr-2">
        <History className="w-3 h-3 text-slate-500" />
        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
          {lang === 'ar' ? 'الأخيرة:' : 'Recent:'}
        </span>
      </div>

      <div className="flex flex-wrap justify-center gap-2">
        {displayData.slice(0, 5).map((item, index) => (
          <button
            key={index}
            onClick={() => {
              setTicker(item.ticker);
              handleAnalyze(item.ticker);
            }}
            className="group flex items-center gap-2 bg-slate-900/40 border border-slate-800 hover:border-blue-500/50 px-3 py-1 rounded-full transition-all active:scale-95"
          >
            <span className="text-[11px] font-black text-slate-300 group-hover:text-blue-400 transition-colors uppercase font-mono">
              {item.ticker}
            </span>
            <div className={`w-1.5 h-1.5 rounded-full ${
                item.verdict?.includes('BUY') ? 'bg-emerald-500 shadow-[0_0_5px_rgba(16,185,129,0.5)]' :
                item.verdict?.includes('SELL') ? 'bg-red-500 shadow-[0_0_5px_rgba(239,68,68,0.5)]' :
                'bg-yellow-500 shadow-[0_0_5px_rgba(245,158,11,0.5)]'
              }`} 
            />
          </button>
        ))}
      </div>
    </div>
  );
}