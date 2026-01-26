"use client";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Zap, AlertTriangle, XCircle, ArrowLeft, ChevronDown, CheckCircle, TrendingUp, Shield, Lightbulb, Brain } from "lucide-react";
import { useAuth } from "../../src/context/AuthContext";
import { useTranslation } from "../../src/context/TranslationContext";
import Navbar from "../../src/components/Navbar";
import Footer from "../../src/components/Footer";
import toast from 'react-hot-toast';
import { motion } from "framer-motion";

const BASE_URL = "https://tamtechaifinance-backend-production.up.railway.app";

export default function RandomPickerPage() {
  const router = useRouter();
  const { credits, isLoggedIn, logout, updateCredits } = useAuth();
  const { t } = useTranslation();
  const [displaySymbol, setDisplaySymbol] = useState("????");
  const [displayName, setDisplayName] = useState("");
  const [displayPrice, setDisplayPrice] = useState<number | undefined>();
  const [rolling, setRolling] = useState(false);
  const [selectedTicker, setSelectedTicker] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [guestTrials, setGuestTrials] = useState(3);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authError, setAuthError] = useState("");
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);
  const rollerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const savedGuest = localStorage.getItem("guest_trials");
    if (savedGuest) setGuestTrials(parseInt(savedGuest));
    else localStorage.setItem("guest_trials", "3");
    
    // SEO: Set page metadata
    document.title = "Random Stock Picker | Discover New Investment Opportunities - Tamtech Finance";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Discover random stocks with AI analysis. Explore new investment opportunities and get instant stock health scores with our random stock picker tool.');
    }
    
    // Add canonical tag
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', 'https://tamtech-finance.com/random-picker');
  }, []);

  const spinTicker = async () => {
    setRolling(true);
    setDisplayName("");
    setDisplayPrice(undefined);

    // Slot machine style ticker roll
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    rollerRef.current = setInterval(() => {
      const random = Array.from({ length: 4 }, () => letters[Math.floor(Math.random() * letters.length)]).join("");
      setDisplaySymbol(random);
    }, 85);

    try {
      // ✅ NEW ENDPOINT V2 - GUARANTEED FRESH
      const res = await fetch(`${BASE_URL}/get-random-ticker-v2?bust=${Date.now()}_${Math.random()}`, {
        cache: 'no-store',
        next: { revalidate: 0 },
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      });
      const data = await res.json();
      console.log('🎲 V2 Random:', data.ticker, 'Version:', data.version);

      // Wait before stopping animation
      await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 1000));
      
      // Stop animation and set results
      if (rollerRef.current) clearInterval(rollerRef.current);
      setDisplaySymbol(data.ticker);
      setSelectedTicker(data.ticker);

      // Fetch price from Yahoo Finance (happens in background)
      fetch(`https://query1.finance.yahoo.com/v7/finance/quote?symbols=${data.ticker}`)
        .then((r) => r.json())
        .then((q) => {
          const quote = q.quoteResponse?.result?.[0];
          if (quote) {
            setDisplayName(quote.longName || quote.shortName || "");
            setDisplayPrice(quote.regularMarketPrice);
          }
        })
        .catch(() => {});
      
      // Set rolling to false last to ensure proper state update
      setRolling(false);
    } catch (err) {
      if (rollerRef.current) clearInterval(rollerRef.current);
      setRolling(false);
      toast.error("Failed to pick a stock");
    }
  };

  const handleAnalyze = async () => {
    if (!selectedTicker) return;

    // Check guest limit
    if (!isLoggedIn && guestTrials <= 0) {
      setShowAuthModal(true);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/analyze/${selectedTicker}`, { 
        credentials: 'include' // 🔒 httpOnly cookie sent automatically
      });

      if (res.status === 403) {
        setShowAuthModal(true);
        setLoading(false);
        return;
      }

      if (res.status === 402) {
        router.push("/?paywall=true");
        return;
      }

      if (!res.ok) {
        const error = await res.json();
        toast.error(error.detail || "Analysis failed");
        return;
      }

      const data = await res.json();
      sessionStorage.setItem("analysis_result", JSON.stringify(data));
      sessionStorage.setItem("analysis_ticker", selectedTicker);

      if (isLoggedIn) {
        updateCredits(data.credits_left);
      } else {
        const ng = guestTrials - 1;
        setGuestTrials(ng);
        localStorage.setItem("guest_trials", ng.toString());
      }

      router.push(`/analysis/${selectedTicker}`);
    } catch (err) {
      toast.error("Error connecting to server");
    } finally {
      setLoading(false);
    }
  };

  const faqItems = [
    {
      question: t.randomPickerFAQ1Q,
      answer: t.randomPickerFAQ1A
    },
    {
      question: t.randomPickerFAQ2Q,
      answer: t.randomPickerFAQ2A
    },
    {
      question: t.randomPickerFAQ3Q,
      answer: t.randomPickerFAQ3A
    },
    {
      question: t.randomPickerFAQ4Q,
      answer: t.randomPickerFAQ4A
    }
  ];

  return (
    <div className="min-h-screen bg-[#0b1121] text-slate-100 font-sans selection:bg-blue-500/30 overflow-x-hidden flex flex-col">
      <Navbar guestTrials={guestTrials} />

      <main className="flex-1 w-full">
        {/* Top Back Button */}
        <div className="w-full px-4 pt-4 pb-0">
          <div className="max-w-6xl mx-auto">
            <Link href="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors group">
              <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
              Back to Home
            </Link>
          </div>
        </div>

        {/* Main Tool Section - MOVED UP */}
        <section className="w-full px-4 py-0 md:py-2 bg-gradient-to-b from-slate-900/50 to-[#0b1121]">
          <div className="max-w-6xl mx-auto">
            {authError && !showAuthModal && (
              <div className="mb-6 max-w-2xl mx-auto bg-red-500/10 border border-red-500/50 p-4 rounded-xl flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="text-red-500 w-5 h-5" />
                  <span className="text-red-200 text-sm font-bold">{authError}</span>
                </div>
                <button onClick={() => setAuthError("")} className="text-red-400 hover:text-white">
                  <XCircle className="w-5 h-5" />
                </button>
              </div>
            )}

            {/* Slot Machine Display */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="max-w-2xl mx-auto mb-6">
              <div className="relative bg-gradient-to-br from-slate-900 via-slate-900 to-blue-900/20 border border-slate-800 rounded-3xl p-8 shadow-2xl">
                <div className="absolute -left-24 -top-24 w-64 h-64 bg-blue-600/10 blur-3xl" aria-hidden="true" />
                <div className="absolute -right-24 bottom-0 w-72 h-72 bg-purple-500/10 blur-3xl" aria-hidden="true" />

                <div className="relative z-10">
                  {/* Ticker Display */}
                  <div className="bg-slate-950/80 border border-purple-500/30 rounded-2xl p-6 mb-6 text-center relative">
                    {selectedTicker && !rolling && (
                      <button
                        onClick={() => {
                          setSelectedTicker(null);
                          setDisplaySymbol("????");
                          setDisplayName("");
                          setDisplayPrice(undefined);
                        }}
                        className="absolute top-4 right-4 text-slate-400 hover:text-white hover:bg-slate-800 p-2 rounded-lg transition"
                        title="Reset"
                      >
                        <XCircle className="w-5 h-5" />
                      </button>
                    )}
                    <p className="text-slate-500 text-xs uppercase tracking-widest mb-2">{t.yourTicker}</p>
                    <div className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400 font-mono mb-4">
                      {displaySymbol}
                    </div>
                    {displayName && <p className="text-slate-300 text-lg font-semibold mb-2">{displayName}</p>}
                    {displayPrice && <p className="text-emerald-400 text-2xl font-bold">${displayPrice.toFixed(2)}</p>}
                  </div>

                  {/* Spin Button */}
                  <button
                    onClick={spinTicker}
                    disabled={rolling}
                    className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-bold py-4 rounded-xl text-lg transition disabled:opacity-60 flex items-center justify-center gap-2 shadow-lg shadow-purple-900/30"
                  >
                    <Zap size={20} />
                    {rolling ? t.spinning : t.spinAgain}
                  </button>
                </div>
              </div>
            </motion.div>

            {/* Action Buttons */}
            {selectedTicker && !rolling && (
              <div className="max-w-2xl mx-auto flex gap-4">
                <button
                  onClick={handleAnalyze}
                  disabled={loading}
                  className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl transition disabled:opacity-60"
                >
                  {loading ? t.analyzing : t.analyzeOneCredit}
                </button>
                <button
                  onClick={() => router.push(`/news?ticker=${selectedTicker}`)}
                  className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold py-3 rounded-xl transition"
                >
                  {t.seeNews}
                </button>
                <button
                  onClick={() => setSelectedTicker(null)}
                  className="bg-slate-700 hover:bg-slate-600 text-slate-300 font-bold py-3 px-6 rounded-xl transition"
                  title={t.hideOptions}
                >
                  ✕
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Small Hero Section - MOVED BELOW TOOL */}
        <section className="w-full px-4 py-4 md:py-6 border-b border-slate-800 bg-slate-900/20">
          <div className="max-w-6xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <h1 className="text-2xl md:text-3xl font-bold text-white mb-2 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400">
                {t.randomPickerTitle}
              </h1>
              <p className="text-slate-400 text-sm md:text-base max-w-2xl">
                {t.randomPickerDesc}
              </p>
            </motion.div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="w-full px-4 py-16 border-b border-slate-800 bg-slate-900/30">
          <div className="max-w-6xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }}>
              <h2 className="text-3xl md:text-4xl font-black text-white mb-8 text-center">{t.howItWorksTitle}</h2>
              <p className="text-slate-300 text-lg mb-8 max-w-3xl mx-auto text-center">
                {t.howItWorksDesc}
              </p>
              
              <div className="grid md:grid-cols-4 gap-6">
                {[
                  { num: "1", title: t.step1Title, desc: t.step1Desc },
                  { num: "2", title: t.step2Title, desc: t.step2Desc },
                  { num: "3", title: t.step3Title, desc: t.step3Desc },
                  { num: "4", title: t.step4Title, desc: t.step4Desc }
                ].map((step, idx) => (
                  <div key={idx} className="relative bg-slate-800/50 border border-slate-700 rounded-2xl p-6 hover:border-blue-500/30 transition">
                    <div className="text-4xl font-black text-blue-400 mb-4">{step.num}</div>
                    <h3 className="text-white font-bold text-lg mb-2">{step.title}</h3>
                    <p className="text-slate-400 text-sm">{step.desc}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Why Use Random Stock Picker Section */}
        <section className="w-full px-4 py-16 border-b border-slate-800">
          <div className="max-w-6xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }}>
              <h2 className="text-3xl md:text-4xl font-black text-white mb-8 text-center">{t.whyUseTitle}</h2>
              
              <div className="grid md:grid-cols-3 gap-8">
                {[
                  {
                    icon: <Brain className="w-12 h-12 text-blue-400" />,
                    title: t.whyUse1Title,
                    desc: t.whyUse1Desc
                  },
                  {
                    icon: <TrendingUp className="w-12 h-12 text-green-400" />,
                    title: t.whyUse2Title,
                    desc: t.whyUse2Desc
                  },
                  {
                    icon: <Lightbulb className="w-12 h-12 text-yellow-400" />,
                    title: t.whyUse3Title,
                    desc: t.whyUse3Desc
                  }
                ].map((item, idx) => (
                  <motion.div key={idx} whileHover={{ y: -6 }} className="bg-slate-800/50 border border-slate-700 rounded-2xl p-8 hover:border-blue-500/30 transition group">
                    <div className="mb-4 p-4 bg-slate-900 rounded-xl w-fit group-hover:bg-slate-800 transition">{item.icon}</div>
                    <h3 className="text-xl font-bold text-white mb-4">{item.title}</h3>
                    <p className="text-slate-300 leading-relaxed">{item.desc}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Risk Warning Section */}
        <section className="w-full px-4 py-16 border-b border-slate-800 bg-slate-900/30">
          <div className="max-w-6xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }}>
              <div className="bg-gradient-to-br from-orange-900/30 to-red-900/20 border border-orange-500/30 rounded-2xl p-8">
                <div className="flex items-start gap-4">
                  <Shield className="w-8 h-8 text-orange-400 flex-shrink-0 mt-1" />
                  <div>
                    <h2 className="text-2xl font-black text-white mb-4">{t.randomPickerDisclaimerTitle}</h2>
                    <p className="text-slate-300 mb-4">
                      {t.randomPickerDisclaimerP1}
                    </p>
                    <p className="text-slate-300 mb-4">
                      {t.randomPickerDisclaimerP2}
                    </p>
                    <p className="text-slate-400 text-sm">
                      {t.randomPickerDisclaimerP3}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="w-full px-4 py-16 border-b border-slate-800">
          <div className="max-w-4xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }}>
              <h2 className="text-3xl md:text-4xl font-black text-white mb-12 text-center">{t.randomPickerFAQTitle}</h2>
              
              <div className="space-y-4">
                {faqItems.map((item, idx) => (
                  <motion.div
                    key={idx}
                    initial={false}
                    className="bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden hover:border-blue-500/30 transition"
                  >
                    <button
                      onClick={() => setExpandedFAQ(expandedFAQ === idx ? null : idx)}
                      className="w-full px-6 py-4 flex items-center justify-between hover:bg-slate-700/30 transition"
                    >
                      <h3 className="text-left font-bold text-white text-lg">{item.question}</h3>
                      <motion.div animate={{ rotate: expandedFAQ === idx ? 180 : 0 }} transition={{ duration: 0.3 }}>
                        <ChevronDown className="w-5 h-5 text-slate-400" />
                      </motion.div>
                    </button>
                    
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: expandedFAQ === idx ? "auto" : 0, opacity: expandedFAQ === idx ? 1 : 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 py-4 bg-slate-900/50 border-t border-slate-700">
                        <p className="text-slate-300 leading-relaxed">{item.answer}</p>
                      </div>
                    </motion.div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full px-4 py-16 bg-gradient-to-r from-blue-900/30 via-slate-900/50 to-purple-900/30">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }}>
              <h2 className="text-2xl md:text-3xl font-black text-white mb-6">Ready to Discover Your Next Stock?</h2>
              <p className="text-slate-300 text-lg mb-8">Start spinning above. Pick randomly, analyze intelligently, invest wisely.</p>
              <Link href="#" className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold px-8 py-4 rounded-xl transition shadow-lg shadow-blue-900/30">
                <TrendingUp size={20} />
                Back to the Spinner
              </Link>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
