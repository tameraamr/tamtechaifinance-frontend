"use client";
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from '../context/TranslationContext';

interface WhaleAlert {
  id: number;
  ticker: string;
  alert_type: string;
  volume: number | null;
  avg_volume_30d: number | null;
  volume_ratio: number | null;
  transaction_value: number | null;
  direction: string | null;
  ai_insight: string | null;
  created_at: string;
}

interface WhaleTrackerProps {
  limit?: number;
  showHeader?: boolean;
  showViewAll?: boolean;
  lang: string;
}

export default function WhaleTracker({ limit = 5, showHeader = true, showViewAll = true, lang }: WhaleTrackerProps) {
  const { t } = useTranslation();
  const [alerts, setAlerts] = useState<WhaleAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchWhaleAlerts();
    
    // Refresh every 5 minutes
    const interval = setInterval(fetchWhaleAlerts, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const fetchWhaleAlerts = async () => {
    try {
      const response = await fetch(`/api/whale-alerts?limit=${limit}`);
      if (response.ok) {
        const data = await response.json();
        setAlerts(data.alerts || []);
      } else {
        setError('Failed to fetch whale alerts');
      }
    } catch (err) {
      setError('Network error');
      console.error('Whale alerts fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    return date.toLocaleDateString();
  };

  const getDirectionIcon = (direction: string | null) => {
    if (direction === 'buy') return '🟢';
    if (direction === 'sell') return '🔴';
    return '🐳';
  };

  if (loading) {
    return (
      <div className="space-y-3">
        {showHeader && (
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              🐳 {t.liveWhaleFeed}
            </h3>
          </div>
        )}
        {[...Array(limit)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-xl p-4">
              <div className="h-4 bg-slate-700 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-slate-700 rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-900/20 border border-red-500/30 rounded-xl p-4">
        <p className="text-red-300 text-sm">⚠️ {error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {showHeader && (
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            🐳 {t.liveWhaleFeed}
          </h3>
          {showViewAll && (
            <a
              href="/smart-money-radar"
              className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
            >
              {t.viewAllAlerts} →
            </a>
          )}
        </div>
      )}

      {alerts.length === 0 ? (
        <div className="bg-slate-800/30 backdrop-blur-xl border border-slate-700/30 rounded-xl p-6 text-center">
          <p className="text-slate-400">🐳 No whale activity detected recently</p>
        </div>
      ) : (
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {alerts.map((alert, index) => (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-gradient-to-br from-slate-900/80 via-slate-800/60 to-slate-900/80 backdrop-blur-xl border border-slate-700/50 rounded-xl p-4 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
              onClick={() => window.location.href = `/stock-analyzer?ticker=${alert.ticker}`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{getDirectionIcon(alert.direction)}</span>
                  <div>
                    <h4 className="font-bold text-white text-sm">{alert.ticker}</h4>
                    <p className="text-xs text-slate-400">{formatTime(alert.created_at)}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-400 capitalize">
                    {alert.alert_type.replace('_', ' ')}
                  </p>
                  {alert.volume_ratio && (
                    <p className="text-xs font-bold text-blue-400">
                      {alert.volume_ratio.toFixed(1)}x avg
                    </p>
                  )}
                </div>
              </div>

              {alert.ai_insight && (
                <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-3 mt-3">
                  <p className="text-xs text-blue-200 font-medium">
                    💡 {(t.whaleAlertTemplates as any)[alert.ai_insight]?.replace('{ticker}', alert.ticker).replace('${value}', alert.transaction_value ? `$${alert.transaction_value.toLocaleString()}` : '') || alert.ai_insight}
                  </p>
                </div>
              )}

              {/* CTA Button */}
              <div className="mt-3 pt-3 border-t border-slate-700/50">
                <p className="text-xs text-green-400 font-medium hover:text-green-300 transition-colors">
                  {t.analyzeNow.replace('{ticker}', alert.ticker)}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}