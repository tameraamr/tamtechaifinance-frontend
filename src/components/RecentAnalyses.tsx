"use client";
import { useEffect, useState } from 'react';
import { History, Sparkles } from 'lucide-react';

interface RecentAnalysesProps {
  recentAnalyses: any[];
  lang: string;
  setTicker: (ticker: string) => void;
  handleAnalyze: (ticker: string) => void;
}

export default function RecentAnalyses({ recentAnalyses, lang, setTicker, handleAnalyze }: RecentAnalysesProps) {
  const [displayData, setDisplayData] = useState<any[]>([]);

  // Load cached data immediately on mount
  useEffect(() => {
    const cachedData = localStorage.getItem('recent_analyses_cache');
    if (cachedData) {
      setDisplayData(JSON.parse(cachedData));
    }
  }, []);

  // Update when new data arrives from backend
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
          {lang === 'ar' ? 'محدث حديثاً:' : 'Recently Updated:'}
        </span>
      </div>

      <div className="flex flex-wrap justify-center gap-2">
        {displayData.slice(0, 8).map((item, index) => (
          <button
            key={index}
            onClick={() => {
              setTicker(item.ticker);
              handleAnalyze(item.ticker);
            }}
            className="group relative flex items-center gap-2 bg-gradient-to-br from-slate-900/60 to-slate-800/40 border border-slate-700/50 hover:border-blue-500/50 hover:shadow-[0_0_20px_rgba(59,130,246,0.15)] px-3 py-1.5 rounded-full transition-all active:scale-95 overflow-hidden cursor-pointer"
          >
            {/* Fresh indicator glow */}
            {item.is_fresh && (
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 via-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            )}
            
            <span className="relative text-[11px] font-black text-slate-300 group-hover:text-blue-400 transition-colors uppercase font-mono">
              {item.ticker}
            </span>
            
            {/* Verdict indicator dot */}
            <div className={`relative w-1.5 h-1.5 rounded-full ${
                item.verdict?.includes('BUY') ? 'bg-emerald-500 shadow-[0_0_5px_rgba(16,185,129,0.5)]' :
                item.verdict?.includes('SELL') ? 'bg-red-500 shadow-[0_0_5px_rgba(239,68,68,0.5)]' :
                'bg-yellow-500 shadow-[0_0_5px_rgba(245,158,11,0.5)]'
              }`} 
            />
            
            {/* Fresh sparkle badge - show if analyzed within last 5 minutes */}
            {item.is_fresh && (
              <Sparkles className="relative w-3 h-3 text-emerald-400 animate-pulse" />
            )}
            
            {/* Age indicator - show minutes ago */}
            <span className="relative text-[9px] text-slate-500 font-mono">
              {item.age_minutes < 60 ? `${item.age_minutes}m` : item.time}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}