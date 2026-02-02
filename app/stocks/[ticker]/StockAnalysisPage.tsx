"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  TrendingUp, TrendingDown, DollarSign, BarChart3, 
  ArrowLeft, Share2, Download, Target,
  AlertTriangle, Brain, Activity, Sparkles, Crown
} from 'lucide-react';
import Navbar from '../../../src/components/Navbar';
import Footer from '../../../src/components/Footer';
import UpgradeModal from '../../../src/components/UpgradeModal';
import { useTranslation } from '../../../src/context/TranslationContext';
import { useAuth } from '../../../src/context/AuthContext';

interface StockAnalysisPageProps {
  ticker: string;
  initialData: any;
}

// Popular tickers for "Related Stocks" section
const POPULAR_TICKERS = [
  "AAPL", "MSFT", "NVDA", "GOOGL", "AMZN", "META", "TSLA", "BRK.B", "V", "JNJ",
  "WMT", "JPM", "MA", "PG", "UNH", "HD", "CVX", "MRK", "ABBV", "KO",
  "PEP", "COST", "AVGO", "LLY", "ORCL", "ADBE", "CRM", "CSCO", "ACN", "AMD"
];

export default function StockAnalysisPage({ ticker, initialData }: StockAnalysisPageProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const { isLoggedIn, isPro, credits } = useAuth();
  
  const [data] = useState(initialData);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [relatedStocks, setRelatedStocks] = useState<string[]>([]);
  
  const analysis = data.analysis;
  const stockData = data.data;
  const isTeaser = data.is_teaser || false;
  
  // Generate related stocks (exclude current ticker)
  useEffect(() => {
    const related = POPULAR_TICKERS
      .filter(t => t !== ticker)
      .sort(() => Math.random() - 0.5)
      .slice(0, 6);
    setRelatedStocks(related);
  }, [ticker]);
  
  // Check if user is Pro or has credits
  const canAccessFullReport = isPro || (isLoggedIn && credits > 0);
  const shouldShowLock = isTeaser && !isPro;
  
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
  
  // Handle PDF export - Show upgrade modal for free users
  const handlePDFExport = () => {
    if (isPro) {
      // Pro users can export directly
      window.print();
    } else {
      // Free users see upgrade modal
      setShowUpgradeModal(true);
    }
  };
  
  // Handle full report access
  const handleUnlockReport = () => {
    if (!isLoggedIn) {
      router.push(`/stock-analyzer?ticker=${ticker}`);
    } else if (!isPro && credits === 0) {
      setShowUpgradeModal(true);
    } else {
      router.push(`/stock-analyzer?ticker=${ticker}`);
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0b1121] via-[#070b14] to-[#0b1121]">
      <Navbar />
      
      {/* Upgrade Modal */}
      <UpgradeModal 
        isOpen={showUpgradeModal} 
        onClose={() => setShowUpgradeModal(false)}
        trigger="pdf"
      />
      
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Back Button - Fixed routing */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 mb-6 hover:opacity-80 transition-opacity touch-manipulation"
          style={{ color: 'var(--accent-primary)' }}
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="font-semibold">Back to Home</span>
        </Link>
        
        {/* Pro Badge for Pro Users */}
        {isPro && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 text-black font-bold shadow-lg"
          >
            <Crown className="w-5 h-5" />
            <span>PRO MEMBER - UNLIMITED ACCESS</span>
          </motion.div>
        )}
        
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl p-6 md:p-8 mb-6"
          style={{
            background: isPro 
              ? 'linear-gradient(135deg, rgba(245, 158, 11, 0.15), rgba(251, 191, 36, 0.1), rgba(59, 130, 246, 0.1))'
              : 'linear-gradient(135deg, var(--bg-secondary), var(--bg-tertiary), rgba(59, 130, 246, 0.1))',
            border: isPro 
              ? '2px solid rgba(245, 158, 11, 0.5)'
              : '1px solid var(--border-primary)',
            boxShadow: isPro ? '0 0 30px rgba(245, 158, 11, 0.2)' : 'none'
          }}
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div>
              <div className="flex items-center gap-3 mb-2 flex-wrap">
                <h1 className="text-3xl md:text-4xl font-black" style={{ color: 'var(--text-primary)' }}>{ticker}</h1>
                <span 
                  className={`px-4 py-1 rounded-full text-sm font-bold text-white flex items-center gap-2`} 
                  style={{ background: shouldShowLock ? 'linear-gradient(135deg, #6b7280, #9ca3af)' : 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))' }}
                >
                  {verdictStyle.icon}
                  {shouldShowLock ? '🔒 LOCKED' : analysis.verdict}
                </span>
                {isPro && (
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-amber-500 to-yellow-500 text-black flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    PRO
                  </span>
                )}
              </div>
              <p className="text-xl" style={{ color: 'var(--text-secondary)' }}>{stockData?.companyName || ticker}</p>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={handleShare}
                className="flex items-center gap-2 px-4 py-2 rounded-lg transition-all hover:scale-105"
                style={{
                  backgroundColor: 'var(--bg-tertiary)',
                  color: 'var(--text-primary)'
                }}
              >
                <Share2 className="w-4 h-4" />
                Share
              </button>
              <button
                className="flex items-center gap-2 px-4 py-2 rounded-lg transition-all hover:scale-105"
                style={{
                  backgroundColor: isPro ? '#f59e0b' : 'var(--accent-primary)',
                  color: isPro ? '#000' : 'var(--text-primary)'
                }}
                onClick={handlePDFExport}
              >
                <Download className="w-4 h-4" />
                {isPro ? 'Export PDF' : '🔒 PDF'}
              </button>
            </div>
          </div>
          
          {/* Key Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="rounded-lg p-4" style={{ backgroundColor: 'var(--card-bg)' }}>
              <div className="text-sm mb-1" style={{ color: 'var(--text-secondary)' }}>Current Price</div>
              <div className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
                ${stockData?.price?.toFixed(2) || 'N/A'}
              </div>
            </div>
            
            {/* Confidence Score - Unlocked for Pro */}
            <div className="rounded-lg p-4 relative" style={{ backgroundColor: 'var(--card-bg)' }}>
              <div className="text-sm mb-1" style={{ color: 'var(--text-secondary)' }}>Confidence Score</div>
              <div className={`text-2xl font-bold ${shouldShowLock ? 'blur-sm select-none' : ''}`} style={{ color: isPro ? '#f59e0b' : 'var(--accent-primary)' }}>
                {shouldShowLock ? '85%' : `${analysis.confidence_score}%`}
              </div>
              {shouldShowLock && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xs font-bold" style={{ color: 'var(--accent-primary)' }}>🔒 LOCKED</span>
                </div>
              )}
              {isPro && (
                <div className="absolute top-2 right-2">
                  <Crown className="w-4 h-4 text-amber-500" />
                </div>
              )}
            </div>
            
            {/* Intrinsic Value - Unlocked for Pro */}
            <div className="rounded-lg p-4 relative" style={{ backgroundColor: 'var(--card-bg)' }}>
              <div className="text-sm mb-1" style={{ color: 'var(--text-secondary)' }}>Intrinsic Value</div>
              <div className={`text-2xl font-bold ${shouldShowLock ? 'blur-sm select-none' : ''}`} style={{ color: 'var(--text-primary)' }}>
                {shouldShowLock ? '$120.50' : `$${analysis.intrinsic_value || 'N/A'}`}
              </div>
              {shouldShowLock && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xs font-bold" style={{ color: 'var(--accent-primary)' }}>🔒 LOCKED</span>
                </div>
              )}
              {isPro && (
                <div className="absolute top-2 right-2">
                  <Crown className="w-4 h-4 text-amber-500" />
                </div>
              )}
            </div>
            
            <div className="rounded-lg p-4" style={{ backgroundColor: 'var(--card-bg)' }}>
              <div className="text-sm mb-1" style={{ color: 'var(--text-secondary)' }}>Cache Age</div>
              <div className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
                {stockData?.cacheAge || 'Live'}
              </div>
            </div>
          </div>
          
          {/* UNLOCK CTA - Only for non-Pro users viewing teaser */}
          {shouldShowLock && (
            <div className="mt-6 rounded-xl p-6" style={{
              background: isPro 
                ? 'linear-gradient(135deg, rgba(245, 158, 11, 0.2), rgba(251, 191, 36, 0.1))'
                : 'linear-gradient(135deg, rgba(168, 85, 247, 0.2), rgba(251, 146, 60, 0.1))',
              border: isPro 
                ? '1px solid rgba(245, 158, 11, 0.3)'
                : '1px solid rgba(168, 85, 247, 0.3)'
            }}>
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div>
                  <h3 className="text-xl font-bold mb-2 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                    {isLoggedIn && credits > 0 ? (
                      <>✨ Use 1 Credit to Unlock Full Analysis</>
                    ) : (
                      <>🔒 Unlock Full Analysis</>
                    )}
                  </h3>
                  <p style={{ color: 'var(--text-secondary)' }}>
                    {isLoggedIn 
                      ? (credits > 0 
                          ? `You have ${credits} credit${credits > 1 ? 's' : ''} available. Get AI verdict, intrinsic value, SWOT analysis, and all premium insights.`
                          : 'Get credits to access AI verdict, intrinsic value, SWOT analysis, and all premium insights.')
                      : 'Sign in and use 1 credit to see AI verdict, intrinsic value, SWOT analysis, and all premium insights.'}
                  </p>
                </div>
                <div className="flex gap-3 shrink-0 flex-wrap">
                  {!isLoggedIn ? (
                    <>
                      <Link
                        href="/pricing"
                        className="px-6 py-3 rounded-lg font-bold transition-all hover:scale-105"
                        style={{
                          background: 'linear-gradient(135deg, #f59e0b, #fbbf24)',
                          color: '#000'
                        }}
                      >
                        <div className="flex items-center gap-2">
                          <Crown className="w-4 h-4" />
                          Go PRO - Unlimited
                        </div>
                      </Link>
                      <button
                        onClick={handleUnlockReport}
                        className="px-6 py-3 rounded-lg font-bold transition-all hover:scale-105"
                        style={{
                          backgroundColor: 'var(--bg-tertiary)',
                          color: 'var(--text-primary)'
                        }}
                      >
                        Sign In
                      </button>
                    </>
                  ) : credits > 0 ? (
                    <button
                      onClick={handleUnlockReport}
                      className="px-6 py-3 rounded-lg font-bold transition-all hover:scale-105"
                      style={{
                        background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
                        color: 'var(--text-primary)'
                      }}
                    >
                      Use 1 Credit - Analyze Now
                    </button>
                  ) : (
                    <>
                      <Link
                        href="/pricing"
                        className="px-6 py-3 rounded-lg font-bold transition-all hover:scale-105"
                        style={{
                          background: 'linear-gradient(135deg, #f59e0b, #fbbf24)',
                          color: '#000'
                        }}
                      >
                        <div className="flex items-center gap-2">
                          <Crown className="w-4 h-4" />
                          Upgrade to PRO
                        </div>
                      </Link>
                      <button
                        onClick={() => setShowUpgradeModal(true)}
                        className="px-6 py-3 rounded-lg font-bold transition-all hover:scale-105"
                        style={{
                          backgroundColor: 'var(--bg-tertiary)',
                          color: 'var(--text-primary)'
                        }}
                      >
                        Buy Credits
                      </button>
                    </>
                  )}
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
          className="rounded-2xl p-6 md:p-8 mb-6"
          style={{
            background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1), var(--bg-secondary))',
            border: '1px solid rgba(59, 130, 246, 0.3)'
          }}
        >
          <div className="flex items-center gap-3 mb-4">
            <Brain className="w-6 h-6" style={{ color: 'var(--accent-primary)' }} />
            <h2 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>AI Executive Summary</h2>
          </div>
          <p className="text-lg leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
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
            className="rounded-2xl p-6 md:p-8"
            style={{
              background: 'linear-gradient(135deg, var(--bg-secondary), var(--bg-tertiary), rgba(168, 85, 247, 0.1))',
              border: '1px solid var(--border-primary)'
            }}
          >
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
              <Target className="w-6 h-6" style={{ color: 'var(--accent-primary)' }} />
              The Business DNA
            </h2>
            <div className="prose prose-invert max-w-none">
              <p className="whitespace-pre-wrap leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                {analysis.chapter_1_the_business}
              </p>
            </div>
          </motion.div>
          
          {/* Chapter 2: Financial Health */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="rounded-2xl p-6 md:p-8"
            style={{
              background: 'linear-gradient(135deg, var(--bg-secondary), var(--bg-tertiary), rgba(34, 197, 94, 0.1))',
              border: '1px solid var(--border-primary)'
            }}
          >
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
              <DollarSign className="w-6 h-6" style={{ color: 'var(--accent-primary)' }} />
              Financial Health
            </h2>
            <div className="prose prose-invert max-w-none">
              <p className="whitespace-pre-wrap leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                {analysis.chapter_2_financials}
              </p>
            </div>
          </motion.div>
          
          {/* Chapter 3: Valuation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="rounded-2xl p-6 md:p-8"
            style={{
              background: 'linear-gradient(135deg, var(--bg-secondary), var(--bg-tertiary), rgba(245, 158, 11, 0.1))',
              border: '1px solid var(--border-primary)'
            }}
          >
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
              <BarChart3 className="w-6 h-6" style={{ color: 'var(--accent-primary)' }} />
              Valuation Analysis
            </h2>
            <div className="prose prose-invert max-w-none">
              <p className="whitespace-pre-wrap leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                {analysis.chapter_3_valuation}
              </p>
            </div>
          </motion.div>
          
          {/* Risks & Catalysts */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="rounded-2xl p-6 md:p-8"
            style={{
              background: 'linear-gradient(135deg, var(--bg-secondary), var(--bg-tertiary), rgba(239, 68, 68, 0.1))',
              border: '1px solid var(--border-primary)'
            }}
          >
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
              <AlertTriangle className="w-6 h-6" style={{ color: '#ef4444' }} />
              Risks & Catalysts
            </h2>
            <div className="prose prose-invert max-w-none">
              <p className="whitespace-pre-wrap leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
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
          className="rounded-2xl p-6 md:p-8 mt-6"
          style={{
            background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
            color: 'var(--text-primary)'
          }}
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
          className="rounded-2xl p-8 mt-8 text-center"
          style={{
            background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
            color: 'var(--text-primary)'
          }}
        >
          <h3 className="text-2xl font-bold mb-4">Want More AI-Powered Analysis?</h3>
          <p className="text-lg mb-6">Get unlimited stock analyses, portfolio tracking, and real-time alerts</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/pricing"
              className="px-8 py-3 rounded-lg hover:bg-slate-100 transition-colors font-bold"
              style={{
                backgroundColor: 'var(--text-primary)',
                color: 'var(--accent-primary)'
              }}
            >
              View Pricing Plans
            </Link>
            <Link
              href="/"
              className="px-8 py-3 rounded-lg font-bold transition-colors"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                color: 'var(--text-primary)'
              }}
            >
              Analyze Another Stock
            </Link>
          </div>
        </motion.div>
        
        {/* Related Stocks Section for SEO & Internal Linking */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="rounded-2xl p-8 mt-8"
          style={{
            background: 'linear-gradient(135deg, var(--bg-secondary), var(--bg-tertiary))',
            border: '1px solid var(--border-primary)'
          }}
        >
          <h3 className="text-2xl font-bold mb-6 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
            <BarChart3 className="w-6 h-6" style={{ color: 'var(--accent-primary)' }} />
            Related Stock Analyses
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
            {relatedStocks.map((relatedTicker) => (
              <Link
                key={relatedTicker}
                href={`/stocks/${relatedTicker}`}
                className="group rounded-lg p-4 transition-all hover:scale-105"
                style={{
                  backgroundColor: 'var(--card-bg)',
                  border: '1px solid var(--border-primary)'
                }}
              >
                <div className="text-center">
                  <div className="text-lg font-bold group-hover:text-amber-500 transition-colors" style={{ color: 'var(--text-primary)' }}>
                    {relatedTicker}
                  </div>
                  <div className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
                    View Analysis →
                  </div>
                </div>
              </Link>
            ))}
          </div>
          <div className="text-center mt-6">
            <Link
              href="/stock-analyzer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all hover:scale-105"
              style={{
                background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
                color: 'var(--text-primary)'
              }}
            >
              <Sparkles className="w-4 h-4" />
              Analyze Any Stock
            </Link>
          </div>
        </motion.div>
        
        {/* Disclaimer */}
        <div className="text-center py-8 mt-4" style={{ color: 'var(--text-muted)' }}>
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
