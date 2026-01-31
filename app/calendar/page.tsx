"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Calendar, Clock, Star, Zap, TrendingUp, AlertTriangle, Info } from "lucide-react";
import { motion } from "framer-motion";
import Navbar from "../../src/components/Navbar";
import Footer from "../../src/components/Footer";
import { useTranslation } from '../../src/context/TranslationContext';

interface CalendarEvent {
  name: string;
  date_time: string;
  importance: 'Low' | 'Medium' | 'High';
  ai_impact_note: string;
}

export default function CalendarPage() {
  const [guestTrials, setGuestTrials] = useState(3);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();
  const router = useRouter();
  
  useEffect(() => {
    document.title = "Economic Calendar | Market Events & Analysis - Tamtech Finance";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Stay ahead of market-moving events with our AI-powered economic calendar. Track Fed meetings, CPI releases, earnings, and more with real-time impact analysis.');
    }
    
    // Add canonical tag
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', 'https://tamtech-finance.com/calendar');
    
    // Fetch calendar events
    fetchEvents();
  }, []);
  
  const fetchEvents = async () => {
    try {
      const response = await fetch('/api/calendar-events');
      const data = await response.json();
      setEvents(data.events || []);
    } catch (error) {
      console.error('Failed to fetch calendar events:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  const getImportanceColor = (importance: string) => {
    switch (importance) {
      case 'High': return 'text-red-400 bg-red-900/20 border-red-500/30';
      case 'Medium': return 'text-yellow-400 bg-yellow-900/20 border-yellow-500/30';
      case 'Low': return 'text-green-400 bg-green-900/20 border-green-500/30';
      default: return 'text-slate-400 bg-slate-900/20 border-slate-500/30';
    }
  };
  
  const getImportanceIcon = (importance: string) => {
    switch (importance) {
      case 'High': return <AlertTriangle size={16} className="text-red-400" />;
      case 'Medium': return <TrendingUp size={16} className="text-yellow-400" />;
      case 'Low': return <Info size={16} className="text-green-400" />;
      default: return <Clock size={16} className="text-slate-400" />;
    }
  };
  
  return (
    <div className="min-h-screen bg-[#0b1121] text-slate-100 font-sans selection:bg-blue-500/30 flex flex-col">
      <Navbar guestTrials={guestTrials} />

      <div className="min-h-screen bg-[#0b1121] text-slate-100 font-sans selection:bg-blue-500/30 flex flex-col px-4 py-12 flex-1">
        {/* Background effects */}
        <div className="fixed inset-0 -z-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/10 blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-600/10 blur-3xl" />
        </div>

        <div className="max-w-4xl mx-auto w-full">
          {/* Back Button */}
          <button onClick={() => router.back()} className="inline-flex items-center gap-2 mb-8 text-slate-400 hover:text-white transition-colors group touch-manipulation">
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </button>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            {/* Icon */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="mb-8 flex justify-center"
            >
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-600/30 to-blue-400/10 border-2 border-blue-500/50 flex items-center justify-center shadow-lg shadow-blue-900/30">
                <Calendar className="text-blue-300 w-12 h-12" />
              </div>
            </motion.div>

            <h1 className="text-4xl md:text-5xl font-black text-white mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-blue-300">
              Economic Calendar
            </h1>
            <p className="text-xl text-slate-300 font-semibold mb-3 flex items-center justify-center gap-2">
              <Clock size={20} className="text-blue-400" />
              Market Events & AI Impact Analysis
            </p>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Stay ahead of market-moving events with real-time economic calendar tracking. Our AI analyzes the potential impact on stocks, bonds, and commodities.
            </p>
          </motion.div>

          {/* Events Timeline */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="space-y-4"
          >
            {loading ? (
              <div className="text-center py-12">
                <div className="w-8 h-8 border-2 border-blue-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-slate-400">Loading upcoming events...</p>
              </div>
            ) : events.length === 0 ? (
              <div className="text-center py-12">
                <Calendar className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                <p className="text-slate-400">No upcoming events found</p>
              </div>
            ) : (
              events.map((event, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index, duration: 0.5 }}
                  className="relative bg-gradient-to-r from-slate-900 to-slate-900/50 border border-slate-700 rounded-xl p-6 hover:border-blue-500/30 transition-all duration-300"
                >
                  {/* Timeline line */}
                  <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500/50 to-transparent"></div>
                  
                  {/* Timeline dot */}
                  <div className="absolute left-4 top-6 w-4 h-4 rounded-full bg-blue-500 border-2 border-slate-900"></div>

                  <div className="ml-12">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-xl font-bold text-white mb-1">{event.name}</h3>
                        <div className="flex items-center gap-4 text-sm text-slate-400">
                          <span className="flex items-center gap-1">
                            <Clock size={14} />
                            {formatDateTime(event.date_time)}
                          </span>
                          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold border ${getImportanceColor(event.importance)}`}>
                            {getImportanceIcon(event.importance)}
                            {event.importance}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-blue-900/10 border border-blue-500/20 rounded-lg p-4">
                      <p className="text-slate-300 text-sm leading-relaxed">
                        <span className="text-blue-400 font-semibold">AI Impact:</span> {event.ai_impact_note}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </motion.div>

          {/* Footer Note */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="text-sm text-slate-500 mt-12 text-center flex items-center justify-center gap-1"
          >
            <Star size={14} className="text-yellow-400" />
            Events are updated regularly. Check back for the latest market calendar.
          </motion.p>
        </div>
      </div>

      <Footer />
    </div>
  );
}

