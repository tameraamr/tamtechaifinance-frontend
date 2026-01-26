"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { ArrowLeft, Newspaper, Clock, Star, Zap } from "lucide-react";
import { motion } from "framer-motion";
import Navbar from "../../src/components/Navbar";
import Footer from "../../src/components/Footer";
import { useTranslation } from '../../src/context/TranslationContext';

export default function NewsPage() {
  const [guestTrials, setGuestTrials] = useState(3);
  const { t } = useTranslation();
  
  useEffect(() => {
    document.title = "Market News & Analysis | Real-time Financial Insights - Tamtech Finance";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Stay updated with AI-curated market news, stock analysis, and financial insights. Real-time coverage of major market movements and trends.');
    }
    
    // Add canonical tag
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', 'https://tamtech-finance.com/news');
  }, []);
  
  return (
    <div className="min-h-screen bg-[#0b1121] text-slate-100 font-sans selection:bg-blue-500/30 flex flex-col">
      <Navbar guestTrials={guestTrials} />

      <div className="min-h-screen bg-[#0b1121] text-slate-100 font-sans selection:bg-blue-500/30 flex flex-col items-center justify-center px-4 py-12 flex-1">
        {/* Background effects */}
        <div className="fixed inset-0 -z-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/10 blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-600/10 blur-3xl" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mx-auto text-center"
        >
          {/* Back Button */}
          <Link href="/" className="inline-flex items-center gap-2 mb-12 text-slate-400 hover:text-white transition-colors group">
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </Link>

          {/* Icon */}
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="mb-8 flex justify-center"
          >
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-600/30 to-blue-400/10 border-2 border-blue-500/50 flex items-center justify-center shadow-lg shadow-blue-900/30">
              <Newspaper className="text-blue-300 w-12 h-12" />
            </div>
          </motion.div>

          {/* Main Content */}
          <div className="mb-12">
            <h1 className="text-4xl md:text-5xl font-black text-white mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-blue-300">
              News Terminal
            </h1>
            <p className="text-xl text-slate-300 font-semibold mb-3 flex items-center justify-center gap-2">
              <Clock size={20} className="text-blue-400" />
              Coming Soon
            </p>
            <p className="text-slate-400 max-w-lg mx-auto mb-8">
              We're working on something special. Real-time market news, earnings alerts, Fed updates, and M&A deals all in one powerful terminal.
            </p>
          </div>

          {/* Feature Preview */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12"
          >
            {[
              { icon: "📊", title: "Fed Updates", desc: "Real-time monetary policy changes" },
              { icon: "💰", title: "Earnings", desc: "Surprise earnings & guidance shifts" },
              { icon: "🤝", title: "M&A Deals", desc: "Merger & acquisition announcements" },
              { icon: "🎯", title: "Watchlist", desc: "Track your favorite tickers" },
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 + i * 0.1, duration: 0.5 }}
                className="relative overflow-hidden bg-gradient-to-br from-slate-900 to-slate-900/50 border border-slate-700 rounded-xl p-4 hover:border-blue-500/50 transition-all duration-300 group"
              >
                <div className="absolute inset-0 bg-blue-600/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative z-10">
                  <div className="text-3xl mb-2">{feature.icon}</div>
                  <h3 className="font-bold text-white mb-1">{feature.title}</h3>
                  <p className="text-sm text-slate-400">{feature.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* CTA Section */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 blur-xl rounded-2xl" />
            <div className="relative bg-gradient-to-br from-slate-900 to-slate-900/50 border border-blue-500/30 rounded-2xl p-8 text-center">
              <p className="text-slate-300 mb-6">
                Be the first to know when News Terminal launches. Stay tuned for market-moving insights!
              </p>
              <Link href="/" className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-bold px-8 py-3 rounded-xl transition-all duration-300 shadow-lg shadow-blue-900/30 group">
                <Zap size={18} className="group-hover:scale-110 transition-transform" />
                Back to Tools
              </Link>
            </div>
          </motion.div>

          {/* Footer Note */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="text-sm text-slate-500 mt-12 flex items-center justify-center gap-1"
          >
            <Star size={14} className="text-yellow-400" />
            Check back soon for updates
          </motion.p>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
}

