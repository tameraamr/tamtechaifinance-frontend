"use client";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Search, Zap, AlertTriangle, XCircle, ArrowLeft, ChevronDown, Brain, TrendingUp, Shield, Lightbulb, Target, BarChart3, PieChart, Activity, DollarSign, Dices } from "lucide-react";
import { useAuth } from "../../src/context/AuthContext";
import Navbar from "../../src/components/Navbar";
import Footer from "../../src/components/Footer";
import toast from 'react-hot-toast';
import { motion } from "framer-motion";

const BASE_URL = "https://tamtechaifinance-backend-production.up.railway.app";

export default function StockAnalyzerPage() {
  const router = useRouter();
  const { token, credits, updateCredits } = useAuth();
  const [ticker, setTicker] = useState("");
  const [suggestions, setSuggestions] = useState<{ symbol: string, name: string }[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);

  // SEO: Set page metadata
  useEffect(() => {
    document.title = "Stock Analyzer | AI-Powered Stock Analysis Tool - Tamtech Finance";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Analyze any stock instantly with our advanced AI engine. Get comprehensive financial health scores, risk assessments, and investment insights for free.');
    }
  }, []);
  const [guestTrials, setGuestTrials] = useState(3);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authError, setAuthError] = useState("");
  const [lang, setLang] = useState("en");
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);
  const [userTyping, setUserTyping] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const savedGuest = localStorage.getItem("guest_trials");
    if (savedGuest) setGuestTrials(parseInt(savedGuest));
    else localStorage.setItem("guest_trials", "3");
  }, []);

  // Auto-suggestions when typing
  useEffect(() => {
    const getSuggestions = async () => {
      if (!ticker || ticker.length < 2) {
        setSuggestions([]);
        setShowSuggestions(false);
        return;
      }

      // Only show suggestions if user is actively typing, not after analysis
      if (loading || !userTyping) return;

      try {
        const response = await fetch(`${BASE_URL}/search-ticker/${ticker}`);
        if (response.ok) {
          const data = await response.json();
          setSuggestions(data);
          setShowSuggestions(true);
        }
      } catch (error) { 
        console.error("Search error:", error); 
      }
    };

    const timer = setTimeout(getSuggestions, 100);
    return () => clearTimeout(timer);
  }, [ticker, loading, userTyping]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const closeSuggestions = () => setShowSuggestions(false);
    window.addEventListener('click', closeSuggestions);
    return () => window.removeEventListener('click', closeSuggestions);
  }, []);

  const fetchRandomStock = async () => {
    try {
      const res = await fetch(`${BASE_URL}/suggest-stock`);
      const data = await res.json();
      if (data.ticker) {
        setTicker(data.ticker);
        toast.success(`Random pick: ${data.ticker}`, { icon: '🎲' });
      }
    } catch {
      toast.error("Error fetching random stock");
    }
  };

  const handleAnalyze = async (overrideTicker?: string) => {
    const targetTicker = overrideTicker || ticker;
    
    console.log('🔍 handleAnalyze called with:', targetTicker, 'loading:', loading);
    
    if (!targetTicker.trim()) {
      toast.error("Please enter a stock ticker");
      return;
    }

    // Prevent double-calls while loading
    if (loading) {
      console.log('⚠️ Already loading, returning');
      return;
    }

    console.log('✅ Starting analysis...');
    setLoading(true);
    setAuthError("");
    setShowSuggestions(false);
    setUserTyping(false);

    // Check credits locally for logged-in users
    if (token && credits <= 0) {
      router.push("/?paywall=true");
      setLoading(false);
      return;
    }

    // Check guest trials
    if (!token && guestTrials <= 0) {
      setShowAuthModal(true);
      setLoading(false);
      return;
    }

    try {
      const headers: any = { Authorization: token ? `Bearer ${token}` : "" };
      const res = await fetch(`${BASE_URL}/analyze/${targetTicker}?lang=${lang}`, { headers });

      // IP-based guest trial limit (server-side)
      if (res.status === 403) {
        setShowAuthModal(true);
        setLoading(false);
        return;
      }

      if (res.status === 402) {
        router.push("/?paywall=true");
        setLoading(false);
        return;
      }

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.detail || "Analysis failed");
      }

      const data = await res.json();
      
      // Save to BOTH localStorage AND sessionStorage for navigation
      localStorage.setItem("analysis_result", JSON.stringify(data));
      localStorage.setItem("analysis_ticker", targetTicker);
      sessionStorage.setItem("analysis_result", JSON.stringify(data));
      sessionStorage.setItem("analysis_ticker", targetTicker);

      // Update credits/trials
      if (token) {
        updateCredits(data.credits_left);
      } else {
        const ng = guestTrials - 1;
        setGuestTrials(ng);
        localStorage.setItem("guest_trials", ng.toString());
      }

      // Navigate to results page
      router.push(`/analysis/${targetTicker}`);
    } catch (err: any) {
      setAuthError(err.message);
      toast.error(err.message || "Analysis failed");
    } finally {
      setLoading(false);
    }
  };

  const faqItems = [
    {
      question: "What's included in the AI stock analysis report?",
      answer: "Our comprehensive report includes: Real-time stock pricing, 14 key financial metrics (P/E, PEG, ROE, Debt/Equity, etc.), AI Radar chart scoring 6 categories, Business DNA analysis, Financial Health assessment, Valuation Analysis, News Sentiment with real headlines, Complete SWOT Analysis, Bull & Bear case scenarios, Price Forecasts, and professional PDF export."
    },
    {
      question: "How accurate are the AI predictions?",
      answer: "Our AI analyzes millions of data points including technical indicators, financial metrics, news sentiment, and historical patterns. While no prediction can guarantee future results, our model achieves 73% directional accuracy on 30-day forecasts. Always use this as one tool in your investment research, not the sole decision factor."
    },
    {
      question: "How much does analysis cost?",
      answer: "Guests get 3 free analyses to try the platform. Registered users pay 1 credit per analysis. Credits start at $0.99 each with bulk discounts available. Each analysis is comprehensive and includes all sections: metrics, AI insights, news, SWOT, and downloadable PDF report."
    },
    {
      question: "Can I export and share the analysis?",
      answer: "Yes! Every analysis includes a professional PDF export button. The report is beautifully formatted with your company branding, all charts, metrics, and AI insights. Perfect for sharing with colleagues, clients, or keeping for your investment records."
    },
    {
      question: "Which stocks can I analyze?",
      answer: "Our platform covers 5,000+ stocks across major exchanges including NYSE, NASDAQ, S&P 500, and more. We support US equities, major ETFs, and index funds. If a ticker is tradable on major US exchanges, we can analyze it with real-time data."
    }
  ];

  return (
    <div className="min-h-screen bg-[#0b1121] text-slate-100 font-sans selection:bg-blue-500/30 overflow-x-hidden flex flex-col">
      <Navbar lang={lang} setLang={setLang} guestTrials={guestTrials} />

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

        {/* Main Analyzer Tool Section - MOVED UP */}
        <section className="w-full px-4 py-4 md:py-6 bg-gradient-to-b from-slate-900/50 to-[#0b1121]">
          <div className="max-w-6xl mx-auto">
            {/* Analyzer Display - Exact copy from homepage */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="max-w-3xl mx-auto mb-6">
              <div className="relative bg-gradient-to-br from-slate-900 via-slate-900 to-blue-900/20 border border-slate-800 rounded-2xl p-4 md:p-6 shadow-2xl">
                <div className="absolute -left-16 -top-16 w-48 h-48 bg-blue-600/10 blur-3xl" aria-hidden="true" />
                <div className="absolute -right-16 bottom-0 w-48 h-48 bg-emerald-500/10 blur-3xl" aria-hidden="true" />

                <div className="relative z-10 flex flex-col items-center text-center mb-4">
                  <p className="text-xs uppercase tracking-[0.25em] text-blue-300 font-bold">⚡ Primary Engine</p>
                  <h2 className="text-lg md:text-2xl font-black text-white mt-1">AI Stock Analyzer</h2>
                </div>

                <div className="flex flex-col items-center w-full max-w-2xl mx-auto px-2 relative z-10">
                  {authError && (
                    <div className="w-full mb-3 bg-red-500/10 border border-red-500/50 p-3 rounded-lg flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="text-red-500 w-4 h-4 shrink-0" />
                        <span className="text-red-200 text-xs font-bold">{authError}</span>
                      </div>
                      <button onClick={() => setAuthError("")} className="text-red-400 hover:text-white p-1">
                        <XCircle className="w-4 h-4" />
                      </button>
                    </div>
                  )}

                  <div className="w-full relative">
                    <div className="flex items-center bg-slate-950/70 border border-slate-800 rounded-xl overflow-hidden shadow-lg focus-within:border-blue-500/50 transition-all">
                      <input
                        id="ticker-input"
                        name="ticker"
                        type="text"
                        placeholder="Enter Ticker (e.g. NVDA)..."
                        className="w-full bg-transparent p-3 text-sm outline-none uppercase font-mono text-white"
                        value={ticker}
                        onChange={(e) => {
                          setTicker(e.target.value.toUpperCase());
                          setUserTyping(true);
                        }}
                        onFocus={() => ticker.length >= 2 && setShowSuggestions(true)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handleAnalyze();
                          }
                        }}
                      />
                      <button onClick={() => handleAnalyze()} disabled={loading} className="bg-blue-600 hover:bg-blue-500 px-4 md:px-5 font-black text-xs disabled:opacity-50 transition-colors shrink-0 self-stretch flex items-center justify-center text-white">
                        {loading ? "..." : "Analyze"}
                      </button>
                      <button onClick={fetchRandomStock} className="bg-slate-800/80 border-l border-slate-700 px-3 flex items-center justify-center hover:bg-slate-700 transition-all self-stretch">
                        <Dices className="w-5 h-5 text-purple-400" />
                      </button>
                    </div>

                    {showSuggestions && suggestions.length > 0 && (
                      <div className="absolute left-0 right-0 mt-2 bg-[#0f172a] border border-slate-700 rounded-xl shadow-2xl overflow-hidden z-[9999] max-h-[240px] overflow-y-auto custom-scrollbar ring-1 ring-white/10">
                        {suggestions.map((s, i) => (
                          <button
                            key={i}
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              setTicker(s.symbol);
                              setShowSuggestions(false);
                              handleAnalyze(s.symbol);
                            }}
                            className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-blue-600/20 border-b border-slate-800/50 last:border-0 transition-all group/item text-left text-sm"
                          >
                            <div className="flex flex-col items-start">
                              <span className="text-blue-400 font-bold">{s.symbol}</span>
                              <span className="text-slate-500 text-[10px] truncate max-w-[200px]">{s.name}</span>
                            </div>
                            <Search size={12} className="text-slate-600 group-hover/item:text-blue-500" />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Loading State */}
                {loading && (
                  <div className="text-center py-4 mt-4">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                    <p className="text-slate-400 text-sm mt-2">Running deep analysis...</p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Small Hero Section - MOVED BELOW TOOL */}
        <section className="w-full px-4 py-4 md:py-6 border-b border-slate-800 bg-slate-900/20">
          <div className="max-w-6xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <h1 className="text-2xl md:text-3xl font-bold text-white mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400">
                AI-Powered Stock Analysis Tool
              </h1>
              <p className="text-slate-400 text-sm md:text-base max-w-2xl">
                Get institutional-grade stock analysis in seconds. Our AI reviews financials, news, technicals, and market sentiment to deliver comprehensive investment insights.
              </p>
            </motion.div>
          </div>
        </section>

        {/* What's Included Section */}
        <section className="w-full px-4 py-16 border-b border-slate-800 bg-slate-900/30">
          <div className="max-w-6xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }}>
              <h2 className="text-3xl md:text-4xl font-black text-white mb-8 text-center">What's Included in Every Analysis</h2>
              <p className="text-slate-300 text-lg mb-12 max-w-3xl mx-auto text-center">
                Each 1-credit analysis delivers a comprehensive report with institutional-grade data and AI-powered insights
              </p>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  {
                    icon: <Activity className="w-10 h-10 text-blue-400" />,
                    title: "14 Key Financial Metrics",
                    desc: "P/E Ratio, PEG, Price/Sales, Price/Book, EPS, Profit Margin, Operating Margin, ROE, Dividend Yield, Beta, Debt/Equity, Current Ratio, Revenue Growth, Market Cap"
                  },
                  {
                    icon: <BarChart3 className="w-10 h-10 text-purple-400" />,
                    title: "AI Radar Score",
                    desc: "Visual radar chart scoring the stock across 6 critical categories: Valuation, Growth, Profitability, Financial Health, Momentum, and Sentiment"
                  },
                  {
                    icon: <Target className="w-10 h-10 text-green-400" />,
                    title: "Business DNA Analysis",
                    desc: "AI-generated narrative explaining the company's core business model, competitive advantages, revenue streams, and market positioning"
                  },
                  {
                    icon: <Shield className="w-10 h-10 text-cyan-400" />,
                    title: "Financial Health Check",
                    desc: "Deep dive into balance sheet strength, cash flow sustainability, debt levels, and financial stability metrics with AI commentary"
                  },
                  {
                    icon: <DollarSign className="w-10 h-10 text-yellow-400" />,
                    title: "Valuation Assessment",
                    desc: "AI evaluation of whether the stock is overvalued, undervalued, or fairly priced based on multiples, peer comparison, and growth prospects"
                  },
                  {
                    icon: <TrendingUp className="w-10 h-10 text-orange-400" />,
                    title: "News Sentiment Analysis",
                    desc: "Real-time analysis of latest news headlines with sentiment scoring (Bullish/Bearish/Neutral) and clickable links to source articles"
                  },
                  {
                    icon: <PieChart className="w-10 h-10 text-pink-400" />,
                    title: "Complete SWOT Matrix",
                    desc: "Strengths, Weaknesses, Opportunities, and Threats identified and explained by our AI based on company data and market conditions"
                  },
                  {
                    icon: <Brain className="w-10 h-10 text-indigo-400" />,
                    title: "Bull & Bear Cases",
                    desc: "Detailed bull case (reasons to buy) and bear case (reasons to sell) scenarios with specific data points supporting each argument"
                  },
                  {
                    icon: <Lightbulb className="w-10 h-10 text-emerald-400" />,
                    title: "AI Verdict & Forecasts",
                    desc: "Clear BUY/HOLD/SELL recommendation with confidence level, plus price forecasts for 7-day, 30-day, and 90-day timeframes"
                  }
                ].map((item, idx) => (
                  <motion.div key={idx} whileHover={{ y: -6 }} className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 hover:border-blue-500/30 transition group">
                    <div className="mb-4 p-3 bg-slate-900 rounded-xl w-fit group-hover:bg-slate-800 transition">{item.icon}</div>
                    <h3 className="text-lg font-bold text-white mb-3">{item.title}</h3>
                    <p className="text-slate-300 text-sm leading-relaxed">{item.desc}</p>
                  </motion.div>
                ))}
              </div>

              <div className="mt-12 text-center">
                <div className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-900/30 to-purple-900/30 border border-blue-500/30 rounded-2xl px-6 py-4">
                  <Zap className="w-6 h-6 text-yellow-400 fill-yellow-400/20" />
                  <p className="text-white font-bold">Plus: Professional PDF Export with all charts, metrics, and analysis</p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="w-full px-4 py-16 border-b border-slate-800">
          <div className="max-w-6xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }}>
              <h2 className="text-3xl md:text-4xl font-black text-white mb-8 text-center">How Our AI Analysis Works</h2>
              
              <div className="grid md:grid-cols-4 gap-6">
                {[
                  { num: "1", title: "Enter Ticker", desc: "Type any stock symbol from NYSE, NASDAQ, or S&P 500" },
                  { num: "2", title: "AI Processing", desc: "Our AI scans 50+ data sources: financials, news, technicals, sentiment" },
                  { num: "3", title: "Generate Report", desc: "Comprehensive analysis compiled in 15-30 seconds with all sections" },
                  { num: "4", title: "Export & Act", desc: "Download professional PDF or use insights to make informed decisions" }
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

        {/* Why Use AI Analysis Section */}
        <section className="w-full px-4 py-16 border-b border-slate-800 bg-slate-900/30">
          <div className="max-w-6xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }}>
              <h2 className="text-3xl md:text-4xl font-black text-white mb-8 text-center">Why Traders Use AI Stock Analysis</h2>
              
              <div className="grid md:grid-cols-3 gap-8">
                {[
                  {
                    icon: <Brain className="w-12 h-12 text-blue-400" />,
                    title: "Speed & Efficiency",
                    desc: "What takes human analysts hours or days, our AI completes in seconds. Get comprehensive insights instantly instead of manually researching financials, news, and charts across multiple platforms."
                  },
                  {
                    icon: <Shield className="w-12 h-12 text-green-400" />,
                    title: "Remove Emotional Bias",
                    desc: "AI doesn't fall in love with stocks or panic sell. Get objective, data-driven analysis free from confirmation bias, FOMO, or fear. Make decisions based on facts, not feelings."
                  },
                  {
                    icon: <TrendingUp className="w-12 h-12 text-purple-400" />,
                    title: "Institutional-Grade Data",
                    desc: "Access the same quality analysis that hedge funds and institutions use, but at a fraction of the cost. Our AI processes millions of data points to find hidden opportunities and risks."
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

        {/* FAQ Section */}
        <section className="w-full px-4 py-16 border-b border-slate-800">
          <div className="max-w-4xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }}>
              <h2 className="text-3xl md:text-4xl font-black text-white mb-12 text-center">Frequently Asked Questions</h2>
              
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

        {/* Risk Warning Section */}
        <section className="w-full px-4 py-16 border-b border-slate-800 bg-slate-900/30">
          <div className="max-w-6xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }}>
              <div className="bg-gradient-to-br from-orange-900/30 to-red-900/20 border border-orange-500/30 rounded-2xl p-8">
                <div className="flex items-start gap-4">
                  <Shield className="w-8 h-8 text-orange-400 flex-shrink-0 mt-1" />
                  <div>
                    <h2 className="text-2xl font-black text-white mb-4">Important: AI Analysis Is a Tool, Not Financial Advice</h2>
                    <p className="text-slate-300 mb-4">
                      Our AI stock analysis is designed to <strong>enhance your research process</strong>, not replace it. While our models achieve 73% directional accuracy on 30-day forecasts, <strong>no prediction can guarantee future results</strong>. Markets are inherently unpredictable and influenced by countless variables.
                    </p>
                    <p className="text-slate-300 mb-4">
                      <strong>Best Practice:</strong> Use our analysis as <strong>one data point</strong> in your decision-making process. Review the SWOT analysis, bull/bear cases, and financial metrics to understand the full picture. Combine our insights with your own research, risk tolerance, and investment goals.
                    </p>
                    <p className="text-slate-400 text-sm">
                      <strong>Disclaimer:</strong> This tool is for educational and informational purposes only. TamtechAI is not a licensed financial advisor or broker. Always consult with a qualified financial professional before making investment decisions. Past performance does not guarantee future results. All investments carry risk of loss.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full px-4 py-16 bg-gradient-to-r from-blue-900/30 via-slate-900/50 to-purple-900/30">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }}>
              <h2 className="text-2xl md:text-3xl font-black text-white mb-6">Ready to Analyze Your Next Stock?</h2>
              <p className="text-slate-300 text-lg mb-8">Get instant AI-powered insights. Analyze smarter, invest wiser.</p>
              <a href="#" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold px-8 py-4 rounded-xl transition shadow-lg shadow-blue-900/30">
                <Search size={20} />
                Back to Analyzer
              </a>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
