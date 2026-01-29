"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Activity, Zap, DollarSign, Coins, BarChart3, Globe } from "lucide-react";
import { useTranslation } from '../context/TranslationContext';

interface HeatmapItem {
  ticker: string;
  name: string;
  price: number;
  change_percent: number;
  market_cap?: number;
  volume?: number;
  asset_type: string;
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

      {/* Heatmap Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
        {currentData.slice(0, 30).map((item, index) => (
          <motion.div
            key={item.ticker}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.02 }}
            className={`relative p-3 rounded-xl border transition-all hover:scale-105 cursor-pointer ${getHeatmapColor(item.change_percent)}`}
            title={`${item.name} - ${formatChange(item.change_percent)}`}
          >
            {/* Ticker */}
            <div className="text-xs font-bold text-white mb-1 truncate">
              {item.ticker}
            </div>

            {/* Name */}
            <div className="text-xs text-slate-400 mb-2 truncate" style={{ fontSize: '10px' }}>
              {item.name}
            </div>

            {/* Price */}
            <div className="text-sm font-semibold text-white mb-1">
              {formatPrice(item.price, item.asset_type)}
            </div>

            {/* Change */}
            <div className={`text-xs font-bold flex items-center gap-1 ${getChangeColor(item.change_percent)}`}>
              {item.change_percent > 0 ? (
                <TrendingUp className="w-3 h-3" />
              ) : item.change_percent < 0 ? (
                <TrendingDown className="w-3 h-3" />
              ) : null}
              {formatChange(item.change_percent)}
            </div>

            {/* Market Cap for stocks/crypto */}
            {item.market_cap && item.asset_type !== 'forex' && (
              <div className="text-xs text-slate-500 mt-1">
                Cap: ${(item.market_cap / 1e9).toFixed(1)}B
              </div>
            )}
          </motion.div>
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