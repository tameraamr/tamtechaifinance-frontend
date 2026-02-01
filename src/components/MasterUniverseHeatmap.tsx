"use client";
import { useState, useEffect, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  TrendingUp,
  TrendingDown,
  Activity,
  Zap,
  DollarSign,
  Coins,
  BarChart3,
  Globe,
  Bitcoin,
  Gem,
  PiggyBank,
  Banknote,
  Landmark,
  Fuel,
  Wheat,
  Factory,
  Building2,
  Zap as Electricity,
  Phone,
  Shirt,
  Beef,
  Coffee,
  Citrus,
  Sun
} from "lucide-react";
import { useTranslation } from '../context/TranslationContext';

interface MasterUniverseHeatmapProps {
  lang: string;
  t: Record<string, any>;
}

interface HeatmapItem {
  s: string;  // symbol (was ticker)
  p: number;  // price
  c: number;  // change_percent
  t: string;  // type (was asset_type)
  n?: string; // name (company/asset name)
  sec?: string; // sector
  mc?: number; // market cap
}

interface HeatmapData {
  stocks: HeatmapItem[];
  crypto: HeatmapItem[];
  commodities: HeatmapItem[];
  forex: HeatmapItem[];
  last_updated: string;
  cache_status?: string;  // 'complete' or 'partial'
}

// Professional asset icon mapping
const getAssetIcon = (symbol: string, assetType: string, assetName?: string) => {
  // Crypto icons
  if (assetType === 'crypto') {
    switch (symbol.toLowerCase()) {
      case 'btc': case 'btcusd': return <Bitcoin className="w-3 h-3" />;
      case 'eth': case 'ethusd': return <Zap className="w-3 h-3" />;
      case 'bnb': case 'bnbusd': return <Coins className="w-3 h-3" />;
      case 'ada': case 'adausd': return <Gem className="w-3 h-3" />;
      case 'sol': case 'solusd': return <Sun className="w-3 h-3" />;
      default: return <Coins className="w-3 h-3" />;
    }
  }

  // Commodities
  if (assetType === 'commodities') {
    switch (symbol.toLowerCase()) {
      case 'gc=f': case 'si=f': return <Gem className="w-3 h-3" />; // Gold/Silver
      case 'cl=f': return <Fuel className="w-3 h-3" />; // Oil
      case 'ng=f': return <Electricity className="w-3 h-3" />; // Natural Gas
      case 'zc=f': case 'zw=f': case 'zs=f': return <Wheat className="w-3 h-3" />; // Corn/Wheat/Soy
      case 'cc=f': case 'kc=f': return <Coffee className="w-3 h-3" />; // Cocoa/Coffee
      case 'sb=f': return <Citrus className="w-3 h-3" />; // Sugar
      default: return <Gem className="w-3 h-3" />;
    }
  }

  // Forex icons (currency pairs)
  if (assetType === 'forex') {
    return <Banknote className="w-3 h-3" />;
  }

  // Stock icons (major indices and sectors)
  if (symbol === 'SPY' || symbol === 'QQQ' || symbol === 'IWM' || symbol === 'VTI') return <BarChart3 className="w-3 h-3" />;
  if (symbol === 'XLK') return <Zap className="w-3 h-3" />; // Technology
  if (symbol === 'XLE') return <Fuel className="w-3 h-3" />; // Energy
  if (symbol === 'XLF') return <Landmark className="w-3 h-3" />; // Financials
  if (symbol === 'XLV') return <Activity className="w-3 h-3" />; // Healthcare
  if (symbol === 'XLY') return <Shirt className="w-3 h-3" />; // Consumer Disc
  if (symbol === 'XLI') return <Factory className="w-3 h-3" />; // Industrials
  if (symbol === 'XLB') return <Wheat className="w-3 h-3" />; // Materials
  if (symbol === 'XLRE') return <Building2 className="w-3 h-3" />; // Real Estate
  if (symbol === 'XLU') return <Electricity className="w-3 h-3" />; // Utilities
  if (symbol === 'XLC') return <Phone className="w-3 h-3" />; // Communication
  if (symbol === 'XLP') return <Beef className="w-3 h-3" />; // Consumer Staples

  // Default stock icon
  return <BarChart3 className="w-3 h-3" />;
};

// Generate a simple sparkline SVG path for the tooltip
const generateSparkline = (change: number) => {
  const isPositive = change > 0;
  const points = isPositive
    ? "M0,20 L4,16 L8,12 L12,8 L16,4 L20,2"
    : "M0,2 L4,4 L8,8 L12,12 L16,16 L20,20";
  return points;
};

// 🚀 MEMOIZED HEATMAP CARD - Optimized for performance
const HeatmapCard = memo(({ item, index, assetType }: { item: HeatmapItem; index: number; assetType: string }) => {
  // Pre-compute values to avoid recalculation
  const symbol = item.s;
  const price = item.p;
  const change = item.c;
  const isPositive = change > 0;
  const isNegative = change < 0;
  const name = item.n;
  const sector = item.sec;
  const marketCap = item.mc;

  // Pre-compute colors and styles with ULTRA DRAMATIC glassmorphism and advanced gradients
  const changeColor = isPositive ? 'text-emerald-200 drop-shadow-[0_0_8px_rgba(16,185,129,0.6)]' : isNegative ? 'text-rose-200 drop-shadow-[0_0_8px_rgba(239,68,68,0.6)]' : 'text-slate-400';
  const absChange = Math.abs(change);
  let cardStyle = 'bg-gradient-to-br from-slate-500/15 via-slate-600/10 to-slate-700/5 border border-slate-400/30 backdrop-blur-md shadow-lg shadow-slate-900/50';
  if (absChange >= 5) cardStyle = isPositive ? 'bg-gradient-to-br from-emerald-500/30 via-green-600/20 to-emerald-700/10 border border-emerald-300/50 backdrop-blur-md shadow-lg shadow-emerald-500/20 ring-1 ring-emerald-400/30' : 'bg-gradient-to-br from-rose-500/30 via-red-600/20 to-rose-700/10 border border-rose-300/50 backdrop-blur-md shadow-lg shadow-rose-500/20 ring-1 ring-rose-400/30';
  else if (absChange >= 2) cardStyle = isPositive ? 'bg-gradient-to-br from-emerald-400/25 via-green-500/15 to-emerald-600/8 border border-emerald-400/40 backdrop-blur-md shadow-lg shadow-emerald-500/15' : 'bg-gradient-to-br from-rose-400/25 via-red-500/15 to-rose-600/8 border border-rose-400/40 backdrop-blur-md shadow-lg shadow-rose-500/15';
  else if (absChange >= 1) cardStyle = isPositive ? 'bg-gradient-to-br from-emerald-300/20 via-green-400/10 to-emerald-500/5 border border-emerald-300/30 backdrop-blur-md shadow-lg shadow-emerald-500/10' : 'bg-gradient-to-br from-rose-300/20 via-red-400/10 to-rose-500/5 border border-rose-300/30 backdrop-blur-md shadow-lg shadow-rose-500/10';

  // Format price based on asset type
  const formatPrice = (price: number, assetType: string) => {
    if (assetType === 'crypto') return `$${price.toFixed(2)}`;
    if (assetType === 'forex') return price.toFixed(4);
    if (assetType === 'commodities') return `$${price.toFixed(2)}`;
    return `$${price.toLocaleString()}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.01, type: "spring", stiffness: 300, damping: 20 }}
      className={`relative p-3 rounded-xl border transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-slate-400/20 cursor-pointer group ${cardStyle}`}
      style={{
        contain: 'layout style paint',
        boxShadow: isPositive && absChange >= 5 ? '0 0 20px rgba(16, 185, 129, 0.3), 0 0 40px rgba(16, 185, 129, 0.1)' :
                  isNegative && absChange >= 5 ? '0 0 20px rgba(239, 68, 68, 0.3), 0 0 40px rgba(239, 68, 68, 0.1)' : undefined
      }}
    >
      {/* Tooltip: show name, sector, market cap if available, no extra API calls */}
      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-3 px-4 py-3 bg-slate-900/95 backdrop-blur-lg border border-slate-500/60 rounded-xl shadow-2xl opacity-0 group-hover:opacity-100 group-focus:opacity-100 group-active:opacity-100 transition-all duration-300 pointer-events-auto z-20 whitespace-nowrap ring-1 ring-white/10 min-w-[200px]">
        <div className="flex items-center gap-2 mb-2">
          {getAssetIcon(symbol, assetType)}
          <div className="text-sm font-mono font-bold text-white">{symbol}</div>
        </div>
        {name && <div className="text-xs text-slate-300 mb-1">{name}</div>}
        {sector && <div className="text-xs text-blue-300 mb-1">Sector: {sector}</div>}
        {typeof marketCap === 'number' && <div className="text-xs text-emerald-300 mb-1">Mkt Cap: ${marketCap.toLocaleString()}</div>}
        <div className="text-lg font-mono font-semibold text-slate-200 mb-1">{formatPrice(price, assetType)}</div>
        <div className={`text-sm font-mono font-bold mb-2 ${changeColor}`}>
          {change >= 0 ? '↗' : '↘'} {change >= 0 ? '+' : ''}{change.toFixed(2)}%
        </div>
        {/* Enhanced animated sparkline */}
        <div className="relative">
          <svg width="80" height="24" className="overflow-visible">
            <defs>
              <linearGradient id={`gradient-${symbol}`} x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor={isPositive ? '#10b981' : '#ef4444'} stopOpacity="0.8" />
                <stop offset="50%" stopColor={isPositive ? '#34d399' : '#f87171'} stopOpacity="1" />
                <stop offset="100%" stopColor={isPositive ? '#6ee7b7' : '#fca5a5'} stopOpacity="0.8" />
              </linearGradient>
            </defs>
            <path
              d={generateSparkline(change)}
              stroke={`url(#gradient-${symbol})`}
              strokeWidth="2"
              fill="none"
              className="drop-shadow-lg"
              style={{
                filter: 'drop-shadow(0 0 4px rgba(255,255,255,0.3))',
                animation: 'sparklinePulse 2s ease-in-out infinite'
              }}
            />
            {/* Animated dot at the end */}
            <circle
              cx="76"
              cy={change >= 0 ? "4" : "20"}
              r="3"
              fill={isPositive ? '#10b981' : '#ef4444'}
              className="animate-pulse"
              style={{
                filter: 'drop-shadow(0 0 6px rgba(255,255,255,0.5))'
              }}
            />
          </svg>
        </div>
      </div>

      {/* FLATTENED DOM: Minimal nesting with enhanced layout */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className={`p-1 rounded-lg ${isPositive && absChange >= 5 ? 'bg-emerald-500/20' : isNegative && absChange >= 5 ? 'bg-rose-500/20' : 'bg-slate-600/20'}`}>
            {getAssetIcon(symbol, assetType)}
          </div>
          <div className="text-sm font-bold text-white truncate font-mono tracking-wide">{symbol}</div>
        </div>
        {/* Mini indicator for large changes */}
        {absChange >= 5 && (
          <div className={`px-1.5 py-0.5 rounded text-xs font-mono font-bold ${isPositive ? 'bg-emerald-500/30 text-emerald-200' : 'bg-rose-500/30 text-rose-200'}`}>
            HOT
          </div>
        )}
      </div>
      <div className="text-lg font-semibold text-white font-mono mb-1 tracking-wide">{formatPrice(price, assetType)}</div>
      <div className={`text-sm font-bold flex items-center justify-center gap-1 font-mono ${changeColor}`}>
        {isPositive && <TrendingUp className="w-4 h-4" />}
        {isNegative && <TrendingDown className="w-4 h-4" />}
        <span className="font-black">{change >= 0 ? '+' : ''}{change.toFixed(2)}%</span>
      </div>
    </motion.div>
  );
});

HeatmapCard.displayName = 'HeatmapCard';

const assetClassConfig = {
  stocks: {
    icon: BarChart3,
    color: "blue",
    label: "Stocks",
    gradient: "from-blue-500/20 to-blue-600/20",
    borderColor: "border-blue-500/30"
  },
  crypto: {
    icon: Coins,
    color: "orange",
    label: "Crypto",
    gradient: "from-orange-500/20 to-orange-600/20",
    borderColor: "border-orange-500/30"
  },
  commodities: {
    icon: Activity,
    color: "green",
    label: "Commodities",
    gradient: "from-green-500/20 to-green-600/20",
    borderColor: "border-green-500/30"
  },
  forex: {
    icon: DollarSign,
    color: "purple",
    label: "Forex",
    gradient: "from-purple-500/20 to-purple-600/20",
    borderColor: "border-purple-500/30"
  }
};

export default function MasterUniverseHeatmap({ lang, t }: MasterUniverseHeatmapProps) {
  const [heatmapData, setHeatmapData] = useState<HeatmapData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedAssetClass, setSelectedAssetClass] = useState<string>("stocks");

  const fetchHeatmapData = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/master-universe-heatmap');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setHeatmapData(data);
    } catch (err) {
      console.error('Failed to fetch heatmap data:', err);
      setError(err instanceof Error ? err.message : 'Failed to load market data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHeatmapData();

    // Refresh every 5 minutes
    const interval = setInterval(fetchHeatmapData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const formatPrice = (price: number, assetType: string) => {
    if (assetType === 'crypto') {
      return `$${price.toFixed(2)}`;
    } else if (assetType === 'forex') {
      return price.toFixed(4);
    } else if (assetType === 'commodities') {
      return `$${price.toFixed(2)}`;
    } else {
      return `$${price.toLocaleString()}`;
    }
  };

  const formatChange = (change: number) => {
    const sign = change >= 0 ? '+' : '';
    return `${sign}${change.toFixed(2)}%`;
  };

  const getChangeColor = (change: number) => {
    if (change > 0) return 'text-green-400';
    if (change < 0) return 'text-red-400';
    return 'text-slate-400';
  };

  const getHeatmapColor = (change: number) => {
    const absChange = Math.abs(change);
    if (absChange >= 5) return change > 0 ? 'bg-green-500/20 border-green-500/40' : 'bg-red-500/20 border-red-500/40';
    if (absChange >= 2) return change > 0 ? 'bg-green-400/15 border-green-400/30' : 'bg-red-400/15 border-red-400/30';
    if (absChange >= 1) return change > 0 ? 'bg-green-300/10 border-green-300/20' : 'bg-red-300/10 border-red-300/20';
    return 'bg-slate-500/10 border-slate-500/20';
  };

  if (loading && !heatmapData) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 mb-8"
      >
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <span className="ml-3 text-slate-400">Loading Master Universe...</span>
        </div>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-slate-900/50 backdrop-blur-sm border border-red-500/30 rounded-2xl p-6 mb-8"
      >
        <div className="flex items-center justify-center py-12 text-red-400">
          <Activity className="w-6 h-6 mr-2" />
          Failed to load market data: {error}
        </div>
      </motion.div>
    );
  }

  const currentData = heatmapData?.[selectedAssetClass as keyof HeatmapData] as HeatmapItem[] || [];
  const config = assetClassConfig[selectedAssetClass as keyof typeof assetClassConfig];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 mb-8"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 p-3 rounded-xl border border-blue-500/30">
            <Globe className="w-6 h-6 text-blue-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">🌍 Master Universe Heatmap</h2>
            <p className="text-slate-400 text-sm">100+ assets across global markets</p>
          </div>
        </div>

        {heatmapData?.last_updated && (
          <div className="text-xs text-slate-500">
            Updated: {new Date(heatmapData.last_updated).toLocaleTimeString()}
          </div>
        )}
      </div>

      {/* Asset Class Selector */}
      <div className="flex flex-wrap gap-2 mb-6">
        {Object.entries(assetClassConfig).map(([key, config]) => {
          const Icon = config.icon;
          const isSelected = selectedAssetClass === key;
          const count = heatmapData?.[key as keyof HeatmapData]?.length || 0;

          return (
            <button
              key={key}
              onClick={() => setSelectedAssetClass(key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                isSelected
                  ? `bg-gradient-to-r ${config.gradient} border ${config.borderColor} text-${config.color}-400`
                  : 'bg-slate-800/50 border border-slate-700/50 text-slate-400 hover:bg-slate-800/70'
              }`}
            >
              <Icon className="w-4 h-4" />
              {config.label}
              <span className="bg-slate-700/50 px-2 py-0.5 rounded text-xs">
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Heatmap Grid - Optimized with memoized cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2" style={{ contain: 'layout' }}>
        {currentData.slice(0, 30).map((item, index) => (
          <HeatmapCard
            key={item.s}
            item={item}
            index={index}
            assetType={selectedAssetClass}
          />
        ))}
      </div>

      {/* Show more indicator */}
      {currentData.length > 30 && (
        <div className="text-center mt-4 text-slate-500 text-sm">
          +{currentData.length - 30} more assets...
        </div>
      )}

      {/* Legend */}
      <div className="flex flex-wrap justify-center gap-4 mt-6 text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-500/20 border border-green-500/40 rounded"></div>
          <span>Strong Bullish (≥5%)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-400/15 border border-green-400/30 rounded"></div>
          <span>Bullish (2-5%)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-red-500/20 border border-red-500/40 rounded"></div>
          <span>Strong Bearish (≤-5%)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-red-400/15 border border-red-400/30 rounded"></div>
          <span>Bearish (-2% to -5%)</span>
        </div>
      </div>
    </motion.div>
  );
}