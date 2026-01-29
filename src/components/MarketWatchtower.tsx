import React from 'react';
import useSWR from 'swr';
import { motion, useAnimation } from 'framer-motion';
import { Gauge, Zap, TrendingUp } from 'lucide-react';
import fetcher from './fetcher';
import { useTypewriter } from './useTypewriter';
import Sparkline from './Sparkline';

const SENTIMENT_ENDPOINT = '/api/market-sentiment';
const MOVERS_ENDPOINT = '/api/market-winners-losers';

function getSentimentPhrase(score: number): string {
  if (score < 20) return '⚠️ Extreme fear. Markets defensive.';
  if (score < 30) return 'High volatility detected. Defensive mode.';
  if (score < 45) return 'Caution: Bearish sentiment rising.';
  if (score < 55) return 'Neutral zone. Awaiting clear direction.';
  if (score < 70) return 'Optimism building. Bulls gaining ground.';
  if (score < 85) return 'Greed phase. Risk appetite high.';
  return '🚀 Euphoria: Markets in full risk-on mode.';
}

function getGaugeColor(score: number) {
  if (score < 30) return 'from-red-500 via-yellow-400 to-green-500';
  if (score < 55) return 'from-yellow-400 via-green-400 to-green-500';
  return 'from-green-400 via-green-500 to-green-400';
}

export default function MarketWatchtower() {
  // SWR for sentiment
  const { data: sentiment, isLoading: loadingSentiment } = useSWR(SENTIMENT_ENDPOINT, fetcher, { revalidateOnFocus: true });
  // SWR for movers
  const { data: movers, isLoading: loadingMovers } = useSWR(MOVERS_ENDPOINT, fetcher, { revalidateOnFocus: true });

  // Typewriter effect for AI narrative
  const score = sentiment?.score ?? 50;
  const phrases = [getSentimentPhrase(score)];
  const narrative = useTypewriter(phrases, 22, 2000);

  // Gauge animation
  const controls = useAnimation();
  React.useEffect(() => {
    controls.start({ rotate: Math.max(-90, Math.min(90, (score - 50) * 1.8)) });
  }, [score, controls]);

  // Top movers (show 3 gainers, fallback to empty)
  const topGainers = Array.isArray(movers?.gainers) ? movers.gainers.slice(0, 3) : [];

  // Responsive grid
  return (
    <section className="relative z-10 w-full max-w-7xl mx-auto px-2 md:px-6 mt-8 mb-12">
      {/* Glow background */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] h-[60vw] max-w-5xl max-h-[600px] rounded-full bg-gradient-radial from-blue-700/30 via-purple-600/20 to-transparent blur-3xl opacity-80" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
        {/* Left: Sentiment Gauge */}
        <div className="flex flex-col items-center justify-center bg-slate-900/80 border border-slate-800/60 rounded-3xl shadow-xl p-6 md:p-8 relative overflow-hidden min-h-[260px]">
          <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-40 h-24 bg-gradient-to-t from-blue-500/10 to-transparent blur-2xl" />
          <div className="mb-4 flex items-center gap-2">
            <Gauge className="w-5 h-5 text-blue-400" />
            <span className="text-xs font-black uppercase tracking-widest text-slate-400">Sentiment Gauge</span>
          </div>
          <div className="relative flex items-center justify-center w-48 h-28">
            {/* Gauge Arc */}
            <svg width="192" height="96" viewBox="0 0 192 96" className="absolute left-0 top-0">
              <defs>
                <linearGradient id="gauge-gradient" x1="0%" y1="100%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#ef4444" />
                  <stop offset="50%" stopColor="#fde047" />
                  <stop offset="100%" stopColor="#22c55e" />
                </linearGradient>
              </defs>
              <path d="M16,88 A80,80 0 0,1 176,88" stroke="url(#gauge-gradient)" strokeWidth="18" fill="none" opacity="0.95" />
            </svg>
            {/* Needle */}
            <motion.div
              animate={controls}
              initial={{ rotate: 0 }}
              className="origin-bottom absolute left-1/2 top-[60px] w-1 h-20"
              style={{ transform: 'translateX(-50%)' }}
            >
              <div className="w-1 h-20 bg-gradient-to-b from-slate-100 via-blue-400 to-blue-700 rounded-full shadow-lg" />
              <div className="w-4 h-4 rounded-full bg-blue-400 border-2 border-white absolute left-1/2 -translate-x-1/2 top-0 shadow" />
            </motion.div>
            {/* Score in center */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
              <span className="text-4xl md:text-5xl font-extrabold font-mono text-white drop-shadow-[0_0_12px_rgba(59,130,246,0.7)] animate-pulse-glow">
                {loadingSentiment ? '--' : score}
              </span>
              <span className="text-xs font-bold text-slate-400 mt-1 tracking-widest uppercase">Score</span>
            </div>
          </div>
          <div className="mt-4 text-xs text-slate-400 text-center max-w-[180px] mx-auto">
            {sentiment?.sentiment || 'Neutral'}
          </div>
        </div>

        {/* Center: AI Market Narrative */}
        <div className="flex flex-col items-center justify-center bg-slate-900/80 border border-slate-800/60 rounded-3xl shadow-xl p-6 md:p-8 relative overflow-hidden min-h-[260px]">
          <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-40 h-24 bg-gradient-to-t from-purple-500/10 to-transparent blur-2xl" />
          <div className="flex items-center gap-2 mb-4">
            <span className="relative flex items-center">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse mr-2" />
              <span className="text-xs font-black uppercase tracking-widest text-slate-400">Market Pulse</span>
            </span>
            <Zap className="w-4 h-4 text-pink-400 animate-bounce" />
          </div>
          <div className="w-full flex flex-col items-center justify-center min-h-[60px]">
            <span className="text-lg md:text-2xl font-bold text-white text-center leading-snug select-none" style={{textShadow:'0 2px 16px #6366f1cc'}}>
              {narrative}
            </span>
          </div>
        </div>

        {/* Right: Top Movers */}
        <div className="flex flex-col gap-4 items-center justify-center min-h-[260px]">
          <div className="mb-2 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-emerald-400" />
            <span className="text-xs font-black uppercase tracking-widest text-slate-400">Top Movers</span>
          </div>
          <div className="flex flex-col gap-4 w-full max-w-xs">
            {loadingMovers && (
              <div className="h-24 bg-slate-800/40 rounded-2xl animate-pulse" />
            )}
            {topGainers.map((g: any, idx: number) => (
              <div key={g.symbol} className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl shadow-lg p-4 flex items-center gap-4 glass-card relative overflow-hidden">
                <div className="flex flex-col flex-1 min-w-0">
                  <span className="text-base font-black text-white truncate">{g.symbol}</span>
                  <span className="text-xs text-slate-400 font-mono">${g.price?.toFixed(2) ?? '--'}</span>
                </div>
                <div className="w-20 h-8 flex items-center">
                  <Sparkline data={g.sparkline || []} width={64} height={24} color="#10b981" />
                </div>
              </div>
            ))}
            {!loadingMovers && topGainers.length === 0 && (
              <div className="text-xs text-slate-500 text-center py-6">No data</div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

// Animations
// Add this to your global CSS (e.g., globals.css):
// .animate-pulse-glow { animation: pulseGlow 2s infinite alternate; }
// @keyframes pulseGlow { 0% { text-shadow: 0 0 8px #3b82f6, 0 0 24px #6366f1; } 100% { text-shadow: 0 0 24px #3b82f6, 0 0 48px #6366f1; } }
