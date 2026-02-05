"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import Cookies from 'js-cookie';

interface AddTradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AddTradeModal({ isOpen, onClose, onSuccess }: AddTradeModalProps) {
  const [formData, setFormData] = useState({
    pair_ticker: '',
    asset_type: 'forex',
    market_trend: 'Bullish',
    trading_session: 'London',
    strategy: '',
    order_type: 'Buy',
    lot_size: 0.01,
    entry_price: 0,
    stop_loss: 0,
    take_profit: 0,
    exit_price: null as number | null,
    entry_time: new Date().toISOString().slice(0, 16),
    exit_time: null as string | null,
    account_size_at_entry: 1000,
    notes: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const API_BASE = typeof window !== 'undefined' ? '/api' : 'https://tamtechaifinance-backend-production.up.railway.app';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const payload = {
        ...formData,
        entry_time: new Date(formData.entry_time).toISOString(),
        exit_time: formData.exit_time ? new Date(formData.exit_time).toISOString() : null,
        exit_price: formData.exit_price || null
      };

      const res = await fetch(`${API_BASE}/journal/trades`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.detail || 'Failed to create trade');
      }

      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-gray-900 rounded-2xl p-4 sm:p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto border border-amber-500/20"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold bg-gradient-to-r from-amber-400 to-yellow-500 bg-clip-text text-transparent">
            Log New Trade
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-2xl"
          >
            ×
          </button>
        </div>

        {error && (
          <div className="mb-3 p-2 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          {/* Asset Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">
                Pair/Ticker *
              </label>
              <input
                type="text"
                required
                value={formData.pair_ticker}
                onChange={(e) => setFormData({ ...formData, pair_ticker: e.target.value.toUpperCase() })}
                placeholder="XAUUSD, NAS100, EURUSD"
                className="w-full px-3 py-2 text-sm bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">
                Asset Type *
              </label>
              <select
                required
                value={formData.asset_type}
                onChange={(e) => setFormData({ ...formData, asset_type: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-amber-500"
              >
                <option value="forex">Forex</option>
                <option value="gold">Gold (XAUUSD)</option>
                <option value="indices">Indices</option>
              </select>
            </div>
          </div>

          {/* Market Context */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">
                Trend
              </label>
              <select
                value={formData.market_trend}
                onChange={(e) => setFormData({ ...formData, market_trend: e.target.value })}
                className="w-full px-2 py-2 text-sm bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-amber-500"
              >
                <option value="Bullish">Bullish</option>
                <option value="Bearish">Bearish</option>
                <option value="Ranging">Ranging</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">
                Trading Session
              </label>
              <select
                value={formData.trading_session}
                onChange={(e) => setFormData({ ...formData, trading_session: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-amber-500"
              >
                <option value="Asia">Asia</option>
                <option value="London">London</option>
                <option value="NY">New York</option>
                <option value="Sydney">Sydney</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">
                Strategy
              </label>
              <input
                type="text"
                value={formData.strategy}
                onChange={(e) => setFormData({ ...formData, strategy: e.target.value })}
                placeholder="Breakout, Reversal, etc."
                className="w-full px-3 py-2 text-sm bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* Order Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">
                Order Type *
              </label>
              <select
                required
                value={formData.order_type}
                onChange={(e) => setFormData({ ...formData, order_type: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-amber-500"
              >
                <option value="Buy">Buy</option>
                <option value="Sell">Sell</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">
                Lot Size *
              </label>
              <input
                type="number"
                step="0.01"
                required
                value={formData.lot_size}
                onChange={(e) => setFormData({ ...formData, lot_size: parseFloat(e.target.value) })}
                placeholder="0.01, 0.1, 1.0"
                className="w-full px-3 py-2 text-sm bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-amber-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                Standard: 1.0 | Mini: 0.1 | Micro: 0.01
              </p>
            </div>
          </div>

          {/* Price Levels */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">
                Entry Price *
              </label>
              <input
                type="number"
                step="0.00001"
                required
                value={formData.entry_price || ''}
                onChange={(e) => setFormData({ ...formData, entry_price: parseFloat(e.target.value) })}
                className="w-full px-3 py-2 text-sm bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">
                Stop Loss *
              </label>
              <input
                type="number"
                step="0.00001"
                required
                value={formData.stop_loss || ''}
                onChange={(e) => setFormData({ ...formData, stop_loss: parseFloat(e.target.value) })}
                className="w-full px-3 py-2 text-sm bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">
                Take Profit *
              </label>
              <input
                type="number"
                step="0.00001"
                required
                value={formData.take_profit || ''}
                onChange={(e) => setFormData({ ...formData, take_profit: parseFloat(e.target.value) })}
                className="w-full px-3 py-2 text-sm bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* Exit Details (Optional) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">
                Exit Price (if closed)
              </label>
              <input
                type="number"
                step="0.00001"
                value={formData.exit_price || ''}
                onChange={(e) => setFormData({ ...formData, exit_price: e.target.value ? parseFloat(e.target.value) : null })}
                className="w-full px-3 py-2 text-sm bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">
                Exit Time (if closed)
              </label>
              <input
                type="datetime-local"
                value={formData.exit_time || ''}
                onChange={(e) => setFormData({ ...formData, exit_time: e.target.value || null })}
                className="w-full px-3 py-2 text-sm bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* Account & Timing */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">
                Account Size *
              </label>
              <input
                type="number"
                step="0.01"
                required
                value={formData.account_size_at_entry}
                onChange={(e) => setFormData({ ...formData, account_size_at_entry: parseFloat(e.target.value) })}
                className="w-full px-3 py-2 text-sm bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">
                Entry Time *
              </label>
              <input
                type="datetime-local"
                required
                value={formData.entry_time}
                onChange={(e) => setFormData({ ...formData, entry_time: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1">
              Trade Notes
            </label>
            <textarea
              rows={3}
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Entry reasons, market conditions, emotional state..."
              className="w-full px-3 py-2 text-sm bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-amber-500 resize-none"
            />
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 rounded-lg font-semibold shadow-lg shadow-amber-500/30 transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Logging Trade...' : 'Log Trade'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
