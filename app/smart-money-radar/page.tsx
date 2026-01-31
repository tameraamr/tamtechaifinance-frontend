"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, BarChart3, ArrowLeft, RefreshCw } from 'lucide-react';
import Navbar from '../../src/components/Navbar';
import Footer from '../../src/components/Footer';
import WhaleTracker from '../../src/components/WhaleTracker';
import { useAuth } from '../../src/context/AuthContext';
import { useTranslation } from '../../src/context/TranslationContext';

export default function SmartMoneyRadar() {
  const { isLoggedIn, credits } = useAuth();
  const { t, lang } = useTranslation();
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      // Trigger whale activity check
      await fetch('/api/check-whale-activity', { method: 'POST' });
      // Wait a moment for processing
      setTimeout(() => setRefreshing(false), 2000);
    } catch (error) {
      console.error('Refresh failed:', error);
      setRefreshing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 md:px-6 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <BarChart3 className="w-8 h-8 text-blue-400" />
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
              {t.smartMoneyRadar}
            </h1>
          </div>
          <p className="text-slate-300 text-lg max-w-2xl mx-auto">
            Track institutional whale activity across 230+ stocks. Monitor volume spikes and large transactions in real-time.
          </p>
        </motion.div>

        {/* Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-col sm:flex-row gap-4 justify-between items-center mb-8"
        >
          <Link
            href="/"
            className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>

          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-2 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/50 hover:border-blue-400/70 px-4 py-2 rounded-lg transition-all duration-300 text-blue-300 hover:text-blue-200 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            {refreshing ? 'Scanning...' : 'Refresh Data'}
          </button>
        </motion.div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Full Whale Feed */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="lg:col-span-2"
          >
            <div className="bg-slate-800/30 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6">
              <WhaleTracker limit={50} showHeader={false} showViewAll={false} lang={lang} />
            </div>
          </motion.div>

          {/* Right Column - Stats & Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="space-y-6"
          >
            {/* Detection Criteria */}
            <div className="bg-slate-800/30 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-400" />
                Detection Criteria
              </h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-400 rounded-full mt-2"></div>
                  <div>
                    <p className="text-slate-300 font-medium">Volume Spike</p>
                    <p className="text-slate-400 text-sm">Trading volume 200% above 30-day average</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-purple-400 rounded-full mt-2"></div>
                  <div>
                    <p className="text-slate-300 font-medium">Large Transaction</p>
                    <p className="text-slate-400 text-sm">Single transaction exceeding $1M (when available)</p>
                  </div>
                </div>
              </div>
            </div>

            {/* AI Insights */}
            <div className="bg-slate-800/30 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-purple-400" />
                AI Analysis
              </h3>
              <p className="text-slate-300 text-sm leading-relaxed">
                Each alert includes AI-powered interpretation of the whale activity, helping you understand potential market impact and trading implications.
              </p>
            </div>

            {/* Coverage */}
            <div className="bg-slate-800/30 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-white mb-4">Coverage</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Stocks Monitored:</span>
                  <span className="text-white font-medium">230+</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Update Frequency:</span>
                  <span className="text-white font-medium">5 minutes</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Data Source:</span>
                  <span className="text-white font-medium">Yahoo Finance</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}