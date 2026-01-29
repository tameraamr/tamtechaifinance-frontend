"use client";
import { useState, useEffect, memo } from "react";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Activity, Zap, DollarSign, Coins, BarChart3, Globe } from "lucide-react";
import { useTranslation } from '../context/TranslationContext';

interface HeatmapItem {
  s: string;  // symbol (was ticker)
  p: number;  // price
  c: number;  // change_percent
  t: string;  // type (was asset_type)
}

interface HeatmapData {
  stocks: HeatmapItem[];
  crypto: HeatmapItem[];
  commodities: HeatmapItem[];
  forex: HeatmapItem[];
  last_updated: string;
}

interface MasterUniverseHeatmapProps {
  lang: string;
  t: any;
}

// 🚀 MEMOIZED HEATMAP CARD - Optimized for performance
const HeatmapCard = memo(({ item, index, assetType }: { item: HeatmapItem; index: number; assetType: string }) => {
  // Pre-compute values to avoid recalculation
  const symbol = item.s;
  const price = item.p;
  const change = item.c;
  const isPositive = change > 0;
  const isNegative = change < 0;

  // Pre-compute colors and styles
  const changeColor = isPositive ? 'text-green-400' : isNegative ? 'text-red-400' : 'text-slate-400';
  const absChange = Math.abs(change);
  let cardStyle = 'bg-slate-500/10 border-slate-500/20';
  if (absChange >= 5) cardStyle = isPositive ? 'bg-green-500/20 border-green-500/40' : 'bg-red-500/20 border-red-500/40';
  else if (absChange >= 2) cardStyle = isPositive ? 'bg-green-400/15 border-green-400/30' : 'bg-red-400/15 border-red-400/30';
  else if (absChange >= 1) cardStyle = isPositive ? 'bg-green-300/10 border-green-300/20' : 'bg-red-300/10 border-red-300/20';

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
      transition={{ delay: index * 0.01 }} // Faster animation
      className={`relative p-2 rounded-lg border transition-all hover:scale-105 cursor-pointer ${cardStyle}`}
      style={{ contain: 'layout style paint' }} // 🚀 CSS Containment for faster rendering
      title={`${symbol} - ${change >= 0 ? '+' : ''}${change.toFixed(2)}%`}
    >
      {/* FLATTENED DOM: Minimal nesting */}
      <div className="text-xs font-bold text-white truncate">{symbol}</div>
      <div className="text-sm font-semibold text-white">{formatPrice(price, assetType)}</div>
      <div className={`text-xs font-bold flex items-center gap-1 ${changeColor}`}>
        {isPositive && <TrendingUp className="w-3 h-3" />}
        {isNegative && <TrendingDown className="w-3 h-3" />}
        {change >= 0 ? '+' : ''}{change.toFixed(2)}%
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