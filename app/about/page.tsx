"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Lightbulb, TrendingUp, ShieldCheck, Cpu, UserCheck, Menu, X } from 'lucide-react';
import { useEffect } from 'react';

export default function AboutUsPage() {
  const isRTL = false;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    document.title = "About Us | AI-Powered Financial Intelligence - Tamtech Finance";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Learn about Tamtech Finance\'s mission to democratize institutional-grade market intelligence through advanced AI technology. Empowering investors worldwide.');
    }
    
    // Add canonical tag
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', 'https://tamtech-finance.com/about');
  }, []);

  return (
    <div className="min-h-screen bg-[#0b1121] text-slate-200 font-sans pb-20">
      {/* Header */}
      <div className="border-b border-slate-800 bg-[#0b1121]/95 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="h-16 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors flex-shrink-0">
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm font-bold hidden sm:inline">Back to Home</span>
              <span className="text-sm font-bold sm:hidden">Back</span>
            </Link>
            <div className="flex items-center gap-2">
              <Lightbulb className="text-blue-500 w-5 h-5" />
              <span className="font-bold text-base md:text-lg">About Us</span>
            </div>
            
            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-400 hover:text-white transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            
            {/* Desktop Links */}
            <div className="hidden md:flex items-center gap-3">
              <Link href="/" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">
                Home
              </Link>
            </div>
          </div>

          {/* Mobile Menu Dropdown */}
          {mobileMenuOpen && (
            <div className="md:hidden border-t border-slate-800 py-3 space-y-2">
              <Link 
                href="/" 
                onClick={() => setMobileMenuOpen(false)}
                className="block text-sm font-medium bg-slate-900 hover:bg-slate-800 border border-slate-700 px-4 py-2.5 rounded-lg transition-all text-slate-300"
              >
                🏠 Home
              </Link>
            </div>
          )}
        </div>
      </div>
      {/* End Header */}

      <main className="max-w-7xl mx-auto px-6 pt-16">
        {/* Hero Section - A compelling story */}
        <section className="text-center mb-24 relative overflow-hidden rounded-3xl p-16 md:p-24 bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 shadow-xl">
          <div className="absolute inset-0 bg-pattern opacity-5 pointer-events-none z-0"></div>
          <div className="relative z-10">
            <h1 className="text-5xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-400 mb-8 leading-tight animate-gradient">
              {isRTL ? "مستقبل الاستثمار بين يديك" : "Empowering Your Investment Journey"}
            </h1>
            <p className="text-slate-300 text-xl max-w-4xl mx-auto leading-relaxed mb-10">
              {isRTL 
                ? "في TamtechAI Pro، نؤمن بأن الوصول إلى البيانات المالية الدقيقة والتحليلات العميقة يجب أن يكون متاحاً للجميع. نحن هنا لنسخر قوة الذكاء الاصطناعي لتزويدك بالرؤى التي تحتاجها لاتخاذ قرارات استثمارية أكثر ذكاءً وثقة."
                : "At TamtechAI Pro, we believe that access to precise financial data and deep analytical insights should be available to everyone. We harness the power of AI to equip you with the foresight needed for smarter, more confident investment decisions."}
            </p>
            <Link href="/" className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-base font-bold rounded-full shadow-sm text-white bg-blue-600 hover:bg-blue-700 transition-all transform hover:scale-105">
              {isRTL ? "ابدأ التحليل الآن" : "Start Your Analysis"}
            </Link>
          </div>
        </section>

        {/* Our Vision Section */}
        <section className="mb-24">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1">
              <h2 className="text-4xl font-bold text-white mb-6">
                {isRTL ? "رؤيتنا: دقة مدعومة بالذكاء الاصطناعي" : "Our Vision: Precision Powered by AI"}
              </h2>
              <p className="text-slate-400 leading-relaxed text-lg mb-6">
                {isRTL 
                  ? "منذ البداية، كان هدفنا واضحاً: إعادة تعريف طريقة تفاعل المستثمرين مع الأسواق المالية. نحن نبني جسراً بين تعقيدات البيانات ووضوح الرؤى، مستخدمين أحدث نماذج الذكاء الاصطناعي لتحليل كميات هائلة من المعلومات بسرعة ودقة لا يمكن أن يضاهيها التحليل البشري وحده."
                  : "From the outset, our goal has been clear: to redefine how investors interact with financial markets. We are building a bridge between data complexity and insightful clarity, utilizing cutting-edge AI models to process vast amounts of information with speed and accuracy unmatched by human analysis alone."}
              </p>
              <ul className="space-y-3 text-slate-300 text-base">
                <li className="flex items-start gap-3"><TrendingUp className="w-5 h-5 text-teal-400 mt-1 flex-shrink-0" /> {isRTL ? "تحليلات فورية ومدعومة بالبيانات." : "Real-time, data-driven analytics."}</li>
                <li className="flex items-start gap-3"><Cpu className="w-5 h-5 text-purple-400 mt-1 flex-shrink-0" /> {isRTL ? "نظام ذكاء اصطناعي يتعلم ويتطور باستمرار." : "Continuously learning and evolving AI."}</li>
                <li className="flex items-start gap-3"><UserCheck className="w-5 h-5 text-orange-400 mt-1 flex-shrink-0" /> {isRTL ? "تمكين المستثمر الفردي والمؤسسي." : "Empowering both individual and institutional investors."}</li>
              </ul>
            </div>
            <div className="order-1 md:order-2 flex justify-center items-center">
              {/* Placeholder for an image or animated graphic */}
              <div className="bg-slate-800 p-8 rounded-full shadow-lg border border-slate-700 flex items-center justify-center w-64 h-64 md:w-80 md:h-80 relative">
                <Cpu className="w-32 h-32 text-blue-500 opacity-20 absolute animate-pulse" />
                <TrendingUp className="w-24 h-24 text-teal-400 opacity-40 animate-bounce-slow" />
                <Lightbulb className="w-16 h-16 text-yellow-400 opacity-60 absolute animate-ping-slow" style={{ animationDelay: '2s' }} />
              </div>
            </div>
          </div>
        </section>

        {/* Our Values Section */}
        <section className="mb-24">
          <h2 className="text-4xl font-bold text-center text-white mb-16">
            {isRTL ? "قيمنا الأساسية" : "Our Core Values"}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* Value 1 */}
            <div className="bg-slate-900/40 border border-slate-800 p-8 rounded-3xl text-center shadow-lg">
              <Lightbulb className="w-12 h-12 text-blue-500 mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-white mb-4">Innovation</h3>
              <p className="text-slate-400 leading-relaxed">
                {isRTL ? "نسعى باستمرار لتطوير حلول جديدة ودمج أحدث تقنيات الذكاء الاصطناعي لتقديم أدوات استثمارية متطورة." : "Continuously seeking new solutions and integrating the latest AI technologies to offer advanced investment tools."}
              </p>
            </div>
            {/* Value 2 */}
            <div className="bg-slate-900/40 border border-slate-800 p-8 rounded-3xl text-center shadow-lg">
              <ShieldCheck className="w-12 h-12 text-green-500 mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-white mb-4">Integrity</h3>
              <p className="text-slate-400 leading-relaxed">
                {isRTL ? "الشفافية والصدق هما أساس تعاملنا مع بيانات السوق ومع مستخدمينا، مع الالتزام بأعلى معايير الأمان." : "Transparency and honesty are the cornerstones of our interaction with market data and our users, upholding the highest security standards."}
              </p>
            </div>
            {/* Value 3 */}
            <div className="bg-slate-900/40 border border-slate-800 p-8 rounded-3xl text-center shadow-lg">
              <UserCheck className="w-12 h-12 text-purple-500 mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-white mb-4">Empowerment</h3>
              <p className="text-slate-400 leading-relaxed">
                {isRTL ? "مهمتنا هي تمكين المستثمرين من جميع المستويات بالمعرفة والأدوات اللازمة لاتخاذ قرارات مستنيرة." : "Our mission is to empower investors of all levels with the knowledge and tools needed to make informed decisions."}
              </p>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="text-center bg-blue-600/20 border border-blue-600/40 p-12 rounded-3xl shadow-inner mb-16">
            <h2 className="text-4xl font-bold text-white mb-6">
                {isRTL ? "هل أنت مستعد لمستقبل الاستثمار؟" : "Ready to Transform Your Trading?"}
            </h2>
            <Link href="/" className="inline-flex items-center justify-center px-10 py-4 border border-transparent text-base font-bold rounded-full shadow-sm text-blue-600 bg-white hover:bg-slate-100 transition-all transform hover:scale-105">
              {isRTL ? "ابدأ رحلتك مع TamtechAI Pro" : "Join TamtechAI Pro Today"}
            </Link>
        </section>
      </main>

      {/* إذا كان لديك مكون Footer عام، استورده هنا */}
      {/* <Footer /> */}
    </div>
  );
}