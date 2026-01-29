"use client";
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  TrendingUp, TrendingDown, DollarSign, BarChart3, 
  ArrowLeft, Share2, Download, Target,
  AlertTriangle, Brain, Activity
} from 'lucide-react';
import Navbar from '../../../src/components/Navbar';
import Footer from '../../../src/components/Footer';
import { useTranslation } from '../../../src/context/TranslationContext';

interface StockAnalysisPageProps {
  ticker: string;
  initialData: any;
}

export default function StockAnalysisPage({ ticker, initialData }: StockAnalysisPageProps) {
  const { t } = useTranslation();
  const router = useRouter();
  
  const [data] = useState(initialData);
  const analysis = data.analysis;
  const stockData = data.data;
  const isTeaser = data.is_teaser || false;
  
  // Determine verdict styling
  const getVerdictStyle = (verdict: string) => {
    if (isTeaser || verdict === '🔒 LOCKED') {
      return {
        bg: 'bg-gradient-to-r from-purple-600 to-pink-600',
        text: 'text-purple-400',
        icon: <Target className="w-6 h-6" />
      };
    }
    
    switch (verdict) {
      case 'BUY':
        return {
          bg: 'bg-gradient-to-r from-green-600 to-emerald-500',
          text: 'text-green-400',
          icon: <TrendingUp className="w-6 h-6" />
        };
      case 'SELL':
        return {
          bg: 'bg-gradient-to-r from-red-600 to-rose-500',
          text: 'text-red-400',
          icon: <TrendingDown className="w-6 h-6" />
        };
      default:
        return {
          bg: 'bg-gradient-to-r from-yellow-600 to-amber-500',
          text: 'text-yellow-400',
          icon: <Activity className="w-6 h-6" />
        };
    }
  };
  
  const verdictStyle = getVerdictStyle(analysis.verdict);
  
  // Share functionality
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${ticker} Stock Analysis - ${analysis.verdict}`,
          text: analysis.summary_one_line,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Share cancelled');
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 mb-6 transition-colors touch-manipulation"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </button>
        
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-slate-900 via-slate-900 to-blue-900/20 border border-slate-800 rounded-2xl p-6 md:p-8 mb-6"
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl md:text-4xl font-black text-white">{ticker}</h1>
                <span className={`px-4 py-1 rounded-full text-sm font-bold ${verdictStyle.bg} text-white flex items-center gap-2`}>
                  {verdictStyle.icon}
                  {analysis.verdict}
                </span>
              </div>
              <p className="text-xl text-slate-300">{stockData?.companyName || ticker}</p>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={handleShare}
                className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors"
              >
                <Share2 className="w-4 h-4" />
                Share
              </button>
              <button
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors"
                onClick={() => window.print()}
              >
                <Download className="w-4 h-4" />
                Export PDF
              </button>
            </div>
          </div>
          
          {/* Key Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-slate-800/50 rounded-lg p-4">
              <div className="text-slate-400 text-sm mb-1">Current Price</div>
              <div className="text-2xl font-bold text-white">
                ${stockData?.price?.toFixed(2) || 'N/A'}
              </div>
            </div>
            
            {/* BLURRED CONFIDENCE SCORE in teaser mode */}
            <div className={`bg-slate-800/50 rounded-lg p-4 ${isTeaser ? 'relative' : ''}`}>
              <div className="text-slate-400 text-sm mb-1">Confidence Score</div>
              <div className={`text-2xl font-bold ${verdictStyle.text} ${isTeaser ? 'blur-sm select-none' : ''}`}>
                {isTeaser ? '85%' : `${analysis.confidence_score}%`}
              </div>
              {isTeaser && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xs font-bold text-purple-400">🔒 LOCKED</span>
                </div>
              )}
            </div>
            
            {/* BLURRED INTRINSIC VALUE in teaser mode */}
            <div className={`bg-slate-800/50 rounded-lg p-4 ${isTeaser ? 'relative' : ''}`}>
              <div className="text-slate-400 text-sm mb-1">Intrinsic Value</div>
              <div className={`text-2xl font-bold text-white ${isTeaser ? 'blur-sm select-none' : ''}`}>
                {isTeaser ? '$120.50' : `$${analysis.intrinsic_value || 'N/A'}`}
              </div>
              {isTeaser && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xs font-bold text-purple-400">🔒 LOCKED</span>
                </div>
              )}
            </div>
            
            <div className="bg-slate-800/50 rounded-lg p-4">
              <div className="text-slate-400 text-sm mb-1">Cache Age</div>
              <div className="text-2xl font-bold text-white">
                {stockData?.cacheAge || 'Live'}
              </div>
            </div>
          </div>
          
          {/* UNLOCK CTA for Teaser Mode */}
          {isTeaser && (
            <div className="mt-6 bg-gradient-to-r from-purple-900/50 to-pink-900/50 border border-purple-500/50 rounded-xl p-6">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">🔒 Unlock Full Analysis</h3>
                  <p className="text-slate-300">
                    {analysis.unlock_message || 'Sign in and use 1 credit to see AI verdict, intrinsic value, SWOT analysis, and all premium insights.'}
                  </p>
                </div>
                <div className="flex gap-3 shrink-0">
                  <Link
                    href="/pricing"
                    className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-lg font-bold text-white transition-all"
                  >
                    Buy Credits
                  </Link>
                  <Link
                    href={`/stock-analyzer?ticker=${ticker}`}
                    className="px-6 py-3 bg-slate-700 hover:bg-slate-600 rounded-lg font-bold text-white transition-all"
                  >
                    Analyze Now
                  </Link>
                </div>
              </div>
            </div>
          )}
        </motion.div>
        
        {/* AI Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-blue-900/20 to-slate-900 border border-blue-500/30 rounded-2xl p-6 md:p-8 mb-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <Brain className="w-6 h-6 text-blue-400" />
            <h2 className="text-2xl font-bold text-white">AI Executive Summary</h2>
          </div>
          <p className="text-lg text-slate-200 leading-relaxed">
            {analysis.summary_one_line}
          </p>
        </motion.div>
        
        {/* Analysis Chapters */}
        <div className="space-y-6">
          {/* Chapter 1: Business DNA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-slate-900 via-slate-900 to-purple-900/20 border border-slate-800 rounded-2xl p-6 md:p-8"
          >
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <Target className="w-6 h-6 text-purple-400" />
              The Business DNA
            </h2>
            <div className="prose prose-invert max-w-none">
              <p className="text-slate-200 whitespace-pre-wrap leading-relaxed">
                {analysis.chapter_1_the_business}
              </p>
            </div>
          </motion.div>
          
          {/* Chapter 2: Financial Health */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-br from-slate-900 via-slate-900 to-green-900/20 border border-slate-800 rounded-2xl p-6 md:p-8"
          >
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <DollarSign className="w-6 h-6 text-green-400" />
              Financial Health
            </h2>
            <div className="prose prose-invert max-w-none">
              <p className="text-slate-200 whitespace-pre-wrap leading-relaxed">
                {analysis.chapter_2_financials}
              </p>
            </div>
          </motion.div>
          
          {/* Chapter 3: Valuation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-gradient-to-br from-slate-900 via-slate-900 to-amber-900/20 border border-slate-800 rounded-2xl p-6 md:p-8"
          >
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <BarChart3 className="w-6 h-6 text-amber-400" />
              Valuation Analysis
            </h2>
            <div className="prose prose-invert max-w-none">
              <p className="text-slate-200 whitespace-pre-wrap leading-relaxed">
                {analysis.chapter_3_valuation}
              </p>
            </div>
          </motion.div>
          
          {/* Risks & Catalysts */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-gradient-to-br from-slate-900 via-slate-900 to-red-900/20 border border-slate-800 rounded-2xl p-6 md:p-8"
          >
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <AlertTriangle className="w-6 h-6 text-red-400" />
              Risks & Catalysts
            </h2>
            <div className="prose prose-invert max-w-none">
              <p className="text-slate-200 whitespace-pre-wrap leading-relaxed">
                {analysis.chapter_4_risks_and_catalysts}
              </p>
            </div>
          </motion.div>
        </div>
        
        {/* Final Verdict */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className={`${verdictStyle.bg} rounded-2xl p-6 md:p-8 mt-6 text-white`}
        >
          <div className="flex items-center gap-3 mb-4">
            {verdictStyle.icon}
            <h2 className="text-2xl font-bold">Final Verdict: {analysis.verdict}</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <div className="text-sm opacity-90 mb-1">Confidence Score</div>
              <div className="text-3xl font-black">{analysis.confidence_score}%</div>
            </div>
            <div>
              <div className="text-sm opacity-90 mb-1">Intrinsic Value</div>
              <div className="text-3xl font-black">${analysis.intrinsic_value || 'N/A'}</div>
            </div>
          </div>
        </motion.div>
        
        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 mt-8 text-center text-white"
        >
          <h3 className="text-2xl font-bold mb-4">Want More AI-Powered Analysis?</h3>
          <p className="text-lg mb-6">Get unlimited stock analyses, portfolio tracking, and real-time alerts</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/pricing"
              className="px-8 py-3 bg-white text-blue-600 font-bold rounded-lg hover:bg-slate-100 transition-colors"
            >
              View Pricing Plans
            </Link>
            <Link
              href="/"
              className="px-8 py-3 bg-blue-700 hover:bg-blue-800 font-bold rounded-lg transition-colors"
            >
              Analyze Another Stock
            </Link>
          </div>
        </motion.div>
        
        {/* Disclaimer */}
        <div className="text-center text-slate-500 text-sm mt-8 pb-8">
          <p>
            This analysis is generated by AI and should not be considered financial advice.
            Always conduct your own research and consult with a qualified financial advisor
            before making investment decisions.
          </p>
          <p className="mt-2">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
