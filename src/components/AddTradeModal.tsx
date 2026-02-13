"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Cookies from 'js-cookie';
import RichTextEditor from './RichTextEditor';
import { X, Plus, Tag, FileText, Image, CheckSquare, Clock, Target, TrendingUp } from 'lucide-react';

interface AddTradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const STRATEGY_TEMPLATES = [
  {
    name: 'Breakout Trade',
    strategy: 'Breakout',
    notes: '<p><strong>Setup:</strong> Identified key resistance level with increasing volume</p><p><strong>Entry:</strong> Entered on breakout above resistance with confirmation</p><p><strong>Risk Management:</strong> Stop loss below recent swing low</p>'
  },
  {
    name: 'Reversal Trade',
    strategy: 'Reversal',
    notes: '<p><strong>Setup:</strong> Overbought/oversold conditions with divergence</p><p><strong>Entry:</strong> Entered on reversal candlestick pattern</p><p><strong>Risk Management:</strong> Stop loss above recent high</p>'
  },
  {
    name: 'Trend Following',
    strategy: 'Trend Following',
    notes: '<p><strong>Setup:</strong> Strong trending market with pullbacks</p><p><strong>Entry:</strong> Entered on pullback to trend line/support</p><p><strong>Risk Management:</strong> Stop loss below trend line</p>'
  },
  {
    name: 'Scalping',
    strategy: 'Scalping',
    notes: '<p><strong>Setup:</strong> High volatility, tight spreads</p><p><strong>Entry:</strong> Quick entries on 1-2 pip movements</p><p><strong>Risk Management:</strong> 1:1 risk-reward, quick exits</p>'
  }
];

export default function AddTradeModal({ isOpen, onClose, onSuccess }: AddTradeModalProps) {
  const [formData, setFormData] = useState({
    pair_ticker: '',
    asset_type: 'forex',
    market_trend: 'Bullish',
    trading_session: 'London',
    strategy: '',
    order_type: 'Buy',
    account_size_at_entry: 0,
    lot_size: 0.01,
    entry_price: 0,
    stop_loss: 0,
    take_profit: 0,
    exit_price: null as number | null,
    entry_time: new Date().toISOString().slice(0, 16),
    exit_time: null as string | null,
    notes: '',
    tags: [] as string[],
    checklist: [] as { id: string; text: string; completed: boolean }[],
    image_url: ''
  });

  const [activeSection, setActiveSection] = useState('basics');
  const [showTemplates, setShowTemplates] = useState(false);
  const [newTag, setNewTag] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'Escape') {
        onClose();
      }
      if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        handleSubmit(e as any);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const payload = {
        ...formData,
        entry_time: new Date(formData.entry_time).toISOString(),
        exit_time: formData.exit_time ? new Date(formData.exit_time).toISOString() : null,
        exit_price: formData.exit_price || null,
        tags: formData.tags.join(','),
        checklist: JSON.stringify(formData.checklist)
      };

      const res = await fetch(`/api/journal/trades`, {
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

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, newTag.trim()]
      });
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(tag => tag !== tagToRemove)
    });
  };

  const addChecklistItem = () => {
    const newItem = {
      id: Date.now().toString(),
      text: '',
      completed: false
    };
    setFormData({
      ...formData,
      checklist: [...formData.checklist, newItem]
    });
  };

  const updateChecklistItem = (id: string, text: string) => {
    setFormData({
      ...formData,
      checklist: formData.checklist.map(item =>
        item.id === id ? { ...item, text } : item
      )
    });
  };

  const toggleChecklistItem = (id: string) => {
    setFormData({
      ...formData,
      checklist: formData.checklist.map(item =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    });
  };

  const removeChecklistItem = (id: string) => {
    setFormData({
      ...formData,
      checklist: formData.checklist.filter(item => item.id !== id)
    });
  };

  const applyTemplate = (template: typeof STRATEGY_TEMPLATES[0]) => {
    setFormData({
      ...formData,
      strategy: template.strategy,
      notes: template.notes
    });
    setShowTemplates(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-gray-900/95 backdrop-blur-xl border border-gray-700/50 rounded-2xl shadow-2xl w-full max-w-4xl h-[90vh] overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Add New Trade</h2>
              <p className="text-gray-400 text-sm">Record your trading activity with rich details</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 bg-gray-800 hover:bg-gray-700 rounded-lg flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4 text-gray-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col h-full">
          {/* Mobile Tab Navigation */}
          <div className="md:hidden border-b border-gray-700/50 px-4 py-3">
            <div className="flex gap-1 overflow-x-auto">
              {[
                { id: 'basics', label: 'Basics', icon: Target },
                { id: 'strategy', label: 'Strategy', icon: FileText },
                { id: 'images', label: 'Images', icon: Image },
                { id: 'tags', label: 'Tags', icon: Tag },
                { id: 'checklist', label: 'Checklist', icon: CheckSquare }
              ].map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setActiveSection(id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${activeSection === id
                    ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                    : 'text-gray-300 hover:bg-gray-700/50'
                    }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col md:flex-row flex-1 min-h-0">
            {/* Desktop Sidebar Navigation */}
            <div className="hidden md:block w-64 bg-gray-800/50 border-r border-gray-700/50 p-4 overflow-y-auto">
              <div className="space-y-2">
                {[
                  { id: 'basics', label: 'Trade Basics', icon: Target },
                  { id: 'strategy', label: 'Strategy & Notes', icon: FileText },
                  { id: 'images', label: 'Screenshots', icon: Image },
                  { id: 'tags', label: 'Tags & Labels', icon: Tag },
                  { id: 'checklist', label: 'Pre-Trade Checklist', icon: CheckSquare }
                ].map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setActiveSection(id)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${activeSection === id
                      ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      : 'text-gray-300 hover:bg-gray-700/50'
                      }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-sm font-medium">{label}</span>
                  </button>
                ))}
              </div>

              {/* Templates */}
              <div className="mt-6">
                <button
                  type="button"
                  onClick={() => setShowTemplates(!showTemplates)}
                  className="w-full flex items-center gap-2 px-3 py-2 bg-gray-700/50 hover:bg-gray-700 rounded-lg text-gray-300 text-sm font-medium transition-colors"
                >
                  <FileText className="w-4 h-4" />
                  Strategy Templates
                </button>

                {showTemplates && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-2 space-y-1"
                  >
                    {STRATEGY_TEMPLATES.map((template) => (
                      <button
                        key={template.name}
                        type="button"
                        onClick={() => applyTemplate(template)}
                        className="w-full text-left px-3 py-2 bg-gray-800/50 hover:bg-gray-700 rounded text-xs text-gray-400 hover:text-gray-300 transition-colors"
                      >
                        {template.name}
                      </button>
                    ))}
                  </motion.div>
                )}
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 p-4 md:p-6 overflow-y-auto pb-28">
              {error && (
                <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
                  {error}
                </div>
              )}













              {/* Pre-Trade Checklist */}
              {activeSection === 'basics' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Asset Pair/Ticker</label>
                      <input
                        type="text"
                        value={formData.pair_ticker}
                        onChange={(e) => setFormData({ ...formData, pair_ticker: e.target.value })}
                        className="w-full px-3 py-2 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                        placeholder="EURUSD, AAPL, BTC..."
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Asset Type</label>
                      <select
                        value={formData.asset_type}
                        onChange={(e) => setFormData({ ...formData, asset_type: e.target.value })}
                        className="w-full px-3 py-2 bg-gray-800/50 border border-gray-600 rounded-lg text-white focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                      >
                        <option value="forex">Forex</option>
                        <option value="crypto">Crypto</option>
                        <option value="stocks">Stocks</option>
                        <option value="commodities">Commodities</option>
                        <option value="indices">Indices</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Order Type</label>
                      <select
                        value={formData.order_type}
                        onChange={(e) => setFormData({ ...formData, order_type: e.target.value })}
                        className="w-full px-3 py-2 bg-gray-800/50 border border-gray-600 rounded-lg text-white focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                      >
                        <option value="Buy">Buy/Long</option>
                        <option value="Sell">Sell/Short</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Lot Size</label>
                      <input
                        type="number"
                        step="0.01"
                        value={formData.lot_size}
                        onChange={(e) => setFormData({ ...formData, lot_size: parseFloat(e.target.value) || 0 })}
                        className="w-full px-3 py-2 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                        placeholder="0.01"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Entry Price</label>
                      <input
                        type="number"
                        step="0.00001"
                        value={formData.entry_price}
                        onChange={(e) => setFormData({ ...formData, entry_price: parseFloat(e.target.value) || 0 })}
                        className="w-full px-3 py-2 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                        placeholder="1.23456"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Stop Loss</label>
                      <input
                        type="number"
                        step="0.00001"
                        value={formData.stop_loss}
                        onChange={(e) => setFormData({ ...formData, stop_loss: parseFloat(e.target.value) || 0 })}
                        className="w-full px-3 py-2 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                        placeholder="1.23000"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Take Profit</label>
                      <input
                        type="number"
                        step="0.00001"
                        value={formData.take_profit}
                        onChange={(e) => setFormData({ ...formData, take_profit: parseFloat(e.target.value) || 0 })}
                        className="w-full px-3 py-2 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                        placeholder="1.25000"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Exit Price (Optional)</label>
                      <input
                        type="number"
                        step="0.00001"
                        value={formData.exit_price || ''}
                        onChange={(e) => setFormData({ ...formData, exit_price: e.target.value ? parseFloat(e.target.value) : null })}
                        className="w-full px-3 py-2 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                        placeholder="1.24500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Entry Time</label>
                      <input
                        type="datetime-local"
                        value={formData.entry_time}
                        onChange={(e) => setFormData({ ...formData, entry_time: e.target.value })}
                        className="w-full px-3 py-2 bg-gray-800/50 border border-gray-600 rounded-lg text-white focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Exit Time (Optional)</label>
                      <input
                        type="datetime-local"
                        value={formData.exit_time || ''}
                        onChange={(e) => setFormData({ ...formData, exit_time: e.target.value || null })}
                        className="w-full px-3 py-2 bg-gray-800/50 border border-gray-600 rounded-lg text-white focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                      />
                    </div>

                  </div>

                </div>
              )}

              {/* Strategy & Notes */}
              {activeSection === 'strategy' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Strategy</label>
                      <input
                        type="text"
                        value={formData.strategy}
                        onChange={(e) => setFormData({ ...formData, strategy: e.target.value })}
                        className="w-full px-3 py-2 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                        placeholder="Breakout, Reversal..."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Market Trend</label>
                      <select
                        value={formData.market_trend}
                        onChange={(e) => setFormData({ ...formData, market_trend: e.target.value })}
                        className="w-full px-3 py-2 bg-gray-800/50 border border-gray-600 rounded-lg text-white focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                      >
                        <option value="Bullish">Bullish</option>
                        <option value="Bearish">Bearish</option>
                        <option value="Sideways">Sideways</option>
                      </select>
                    </div>
                  </div>

                  <div>

                    <label className="block text-sm font-medium text-gray-300 mb-2">Trade Notes</label>
                    <RichTextEditor
                      value={formData.notes}
                      onChange={(content) => setFormData({ ...formData, notes: content })}
                      placeholder="Document your trade setup, reasoning, and observations..."
                    />
                  </div>

                </div>
              )}

              {/* Screenshots */}
              {activeSection === 'images' && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Trade Screenshots</label>
                    <div className="space-y-4">
                      <div className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center hover:border-amber-500/50 transition-colors">
                        <Image className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-400 text-sm mb-2">Upload chart screenshots or trade images</p>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;

                            // Check file size (5MB limit for base64 storage)
                            if (file.size > 5 * 1024 * 1024) {
                              setError('File too large. Maximum size is 5MB.');
                              return;
                            }

                            setLoading(true);
                            try {
                              const formDataUpload = new FormData();
                              formDataUpload.append('file', file);

                              const response = await fetch(`/api/journal/upload-image`, {
                                method: 'POST',
                                body: formDataUpload,
                                credentials: 'include'
                              });

                              if (!response.ok) {
                                const errorData = await response.json();
                                throw new Error(errorData.detail || 'Upload failed');
                              }

                              const result = await response.json();
                              setFormData({ ...formData, image_url: result.image_url });
                              setError('');
                            } catch (err) {
                              setError(err instanceof Error ? err.message : 'Upload failed');
                            } finally {
                              setLoading(false);
                            }
                          }}
                          className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-amber-600 file:text-white hover:file:bg-amber-500 file:cursor-pointer"
                          disabled={loading}
                        />
                        <p className="text-xs text-gray-500 mt-2">Supported formats: PNG, JPG, JPEG, GIF, WebP (max 5MB)</p>
                        {loading && <p className="text-xs text-amber-400 mt-2">Uploading...</p>}
                      </div>

                      {formData.image_url && (
                        <div className="bg-gray-800/30 rounded-lg p-4 border border-gray-700/50">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="text-sm font-medium text-white">Preview</h4>
                            <button
                              onClick={() => setFormData({ ...formData, image_url: '' })}
                              className="text-red-400 hover:text-red-300 text-xs"
                            >
                              Remove
                            </button>
                          </div>
                          <img
                            src={formData.image_url}
                            alt="Trade screenshot"
                            className="w-full max-h-64 object-contain rounded-lg border border-gray-600"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                              const parent = e.currentTarget.parentElement;
                              if (parent) {
                                const errorMsg = document.createElement('p');
                                errorMsg.textContent = 'Failed to load image.';
                                errorMsg.className = 'text-red-400 text-sm';
                                parent.appendChild(errorMsg);
                              }
                            }}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Tags & Labels */}
              {activeSection === 'tags' && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Tags</label>
                    <div className="flex gap-2 mb-3">
                      <input
                        type="text"
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                        className="flex-1 px-3 py-2 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                        placeholder="Add a tag..."
                      />
                      <button
                        type="button"
                        onClick={addTag}
                        className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-black font-medium rounded-lg transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {formData.tags.map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/20 text-amber-400 rounded-full text-sm border border-amber-500/30"
                        >
                          {tag}
                          <button
                            type="button"
                            onClick={() => removeTag(tag)}
                            className="hover:text-amber-300"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Pre-Trade Checklist */}
              {activeSection === 'checklist' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-white">Pre-Trade Checklist</h3>
                    <button
                      type="button"
                      onClick={addChecklistItem}
                      className="px-3 py-1 bg-amber-500 hover:bg-amber-600 text-black text-sm font-medium rounded-lg transition-colors"
                    >
                      Add Item
                    </button>
                  </div>

                  <div className="space-y-3">
                    {formData.checklist.map((item) => (
                      <div key={item.id} className="flex items-center gap-3 p-3 bg-gray-800/30 rounded-lg border border-gray-700/50">
                        <button
                          type="button"
                          onClick={() => toggleChecklistItem(item.id)}
                          className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${item.completed
                            ? 'bg-amber-500 border-amber-500 text-black'
                            : 'border-gray-600 hover:border-amber-500'
                            }`}
                        >
                          {item.completed && <CheckSquare className="w-3 h-3" />}
                        </button>

                        <input
                          type="text"
                          value={item.text}
                          onChange={(e) => updateChecklistItem(item.id, e.target.value)}
                          className="flex-1 bg-transparent text-white placeholder-gray-500 focus:outline-none"
                          placeholder="Checklist item..."
                        />

                        <button
                          type="button"
                          onClick={() => removeChecklistItem(item.id)}
                          className="text-gray-400 hover:text-red-400 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Footer (compact) */}
            <div className="sticky bottom-0 z-50 flex items-center justify-end gap-2 p-3 border-t border-gray-700/50 bg-gray-900/80 backdrop-blur-md">
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-3 py-1 text-sm bg-gray-700 hover:bg-gray-600 text-white rounded-md transition-colors"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="px-3 py-1 text-sm bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-black rounded-md font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Saving...' : 'Save'}
                </button>
              </div>
            </div>
          </div>
        </form>
      </motion.div>
    </div >
  );
}
