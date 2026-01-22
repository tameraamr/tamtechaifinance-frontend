"use client";
import { Activity, TrendingUp, TrendingDown } from "lucide-react";

interface NewsItem {
  headline: string;
  url?: string;
  time: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  impact_score?: number;
}

interface NewsAnalysisProps {
  newsAnalysis: NewsItem[];
  formatNewsDate: (dateString: string) => string;
  lang: string;
}

export default function NewsAnalysis({ newsAnalysis, formatNewsDate, lang }: NewsAnalysisProps) {
  if (!newsAnalysis) return null;

  return (
    <div className="mt-8 space-y-4 animate-in fade-in slide-in-from-bottom-5 duration-1000">
      <div className="flex items-center justify-center gap-2 mb-6">
        <div className="h-px w-8 bg-slate-800"></div>
        <h3 className="font-black text-slate-500 text-[10px] uppercase tracking-[0.3em] flex items-center gap-2">
          <Activity className="w-3 h-3 text-blue-500" /> Market Pulse
        </h3>
        <div className="h-px w-8 bg-slate-800"></div>
      </div>

      <div className="space-y-3">
        {newsAnalysis.map((news, i) => (
          <a
            key={i}
            href={news.url || "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="block bg-slate-900/40 border border-slate-800/50 p-4 rounded-2xl hover:border-blue-500/40 hover:bg-slate-900/60 transition-all group cursor-pointer"
          >
            <div className="flex justify-between items-start mb-2 gap-3">
              <p className="text-slate-300 text-[11px] font-bold leading-relaxed group-hover:text-blue-400 transition-colors line-clamp-2 flex-1 text-left">
                {news.headline}
              </p>
              <span className="text-[9px] text-slate-500 font-medium ml-2 whitespace-nowrap">
                {formatNewsDate(news.time)}
              </span>
            </div>

            <div className="flex items-center justify-between mt-3">
              <div className="flex items-center">
                {news.sentiment === 'positive' ? (
                  <span className="flex items-center gap-1 text-[9px] font-black text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full uppercase">
                    <TrendingUp size={10} /> Bullish
                  </span>
                ) : news.sentiment === 'negative' ? (
                  <span className="flex items-center gap-1 text-[9px] font-black text-red-400 bg-red-500/10 px-2 py-0.5 rounded-full uppercase">
                    <TrendingDown size={10} /> Bearish
                  </span>
                ) : (
                  <span className="text-[9px] font-black text-slate-500 bg-slate-500/10 px-2 py-0.5 rounded-full uppercase">
                    Neutral
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                 <div className="w-12 h-1 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${news.sentiment === 'positive' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : news.sentiment === 'negative' ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]' : 'bg-slate-500'}`}
                      style={{ width: `${(news.impact_score || 5) * 10}%` }}
                    ></div>
                 </div>
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}