"use client";
import React from 'react';
import { Check, Zap, ShieldCheck, Key, ShoppingCart, ArrowLeft, Star } from 'lucide-react';
import Link from 'next/link';
import { useEffect } from 'react';
import { useTranslation } from '../../src/context/TranslationContext';
import LanguageSelector from '../../src/components/LanguageSelector';

export default function PricingPage() {
  const { t, isRTL } = useTranslation();
  
  useEffect(() => {
    document.title = "Pricing | Affordable AI Stock Analysis Credits - Tamtech Finance";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Get unlimited access to AI-powered stock analysis. Flexible credit packages starting at $9. Try 3 analyses free. No subscription required.');
    }
    
    // Add canonical tag
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', 'https://tamtech-finance.com/pricing');
  }, []);
  return (
    <div className="min-h-screen bg-[#0b1121] text-slate-200 pb-20 selection:bg-blue-500/30" dir={isRTL ? "rtl" : "ltr"}>
      {/* Navigation Header */}
      <div className="max-w-7xl mx-auto px-6 pt-10 mb-12 flex items-center justify-between">
        <Link href="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-white transition-all group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> 
          <span className="text-sm font-bold uppercase tracking-widest">{t.backToDashboard}</span>
        </Link>
        <LanguageSelector />
      </div>

      <main className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-black text-white mb-6">
            {t.pricingTitle}
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            {t.pricingSubtitle}
          </p>
        </div>

        {/* Featured License Card */}
        <div className="relative max-w-lg mx-auto">
          {/* Background Glow Effect */}
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-[2rem] blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
          
          <div className="relative bg-slate-900 border border-slate-800 p-10 rounded-[2rem] shadow-2xl">
            <div className="flex justify-between items-start mb-8">
              <div>
                <h3 className="text-2xl font-black text-white flex items-center gap-2">
                  <Star className="w-6 h-6 text-yellow-500 fill-yellow-500" />
                  {t.fullAnalysisPack}
                </h3>
                <p className="text-slate-500 text-sm mt-1 uppercase tracking-widest font-bold">{t.officialLicense}</p>
              </div>
              <div className="bg-blue-600/10 text-blue-500 px-4 py-1 rounded-full text-xs font-black uppercase">
                {t.instantDelivery}
              </div>
            </div>

            <div className="mb-8">
              <div className="flex items-baseline gap-2">
                <span className="text-6xl font-black text-white">{t.fiftyCredits}</span>
                <span className="text-xl font-bold text-slate-400">{t.creditsLabel}</span>
              </div>
              <p className="text-slate-400 mt-4 leading-relaxed">
                {t.unlockProfessional}
              </p>
            </div>

            <ul className="space-y-4 mb-10">
              {[
                t.feature_instantDelivery,
                t.feature_securedBy,
                t.feature_pdfAccess,
                t.feature_noExpiration,
                t.feature_priorityAI
              ].map((feature, i) => (
                <li key={i} className="flex items-center gap-3 text-slate-300">
                  <div className="bg-blue-500/20 p-1 rounded-full">
                    <Check className="w-3 h-3 text-blue-400" />
                  </div>
                  <span className="text-sm font-medium">{feature}</span>
                </li>
              ))}
            </ul>

            {/* Gumroad Action Button */}
            <a 
              href="https://tamtechfinance.gumroad.com/l/tool" 
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-blue-600 hover:bg-blue-500 py-5 rounded-2xl font-black text-white flex items-center justify-center gap-3 transition-all transform hover:scale-[1.02] shadow-xl shadow-blue-600/20 group"
            >
              <ShoppingCart className="w-5 h-5 group-hover:rotate-12 transition-transform" />
              {t.buyNowGumroad}
            </a>
          </div>
        </div>

        {/* How it works Section */}
        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center p-6">
            <div className="bg-slate-900 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-slate-800 shadow-lg">
              <ShoppingCart className="text-blue-500 w-8 h-8" />
            </div>
            <h4 className="font-bold text-white mb-2">{t.purchase}</h4>
            <p className="text-sm text-slate-500 leading-relaxed italic">{t.purchaseDesc}</p>
          </div>
          <div className="text-center p-6">
            <div className="bg-slate-900 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-slate-800 shadow-lg">
              <Key className="text-blue-500 w-8 h-8" />
            </div>
            <h4 className="font-bold text-white mb-2">{t.getKey}</h4>
            <p className="text-sm text-slate-500 leading-relaxed italic">{t.getKeyDesc}</p>
          </div>
          <div className="text-center p-6">
            <div className="bg-slate-900 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-slate-800 shadow-lg">
              <Zap className="text-blue-500 w-8 h-8" />
            </div>
            <h4 className="font-bold text-white mb-2">{t.redeem}</h4>
            <p className="text-sm text-slate-500 leading-relaxed italic">{t.redeemDesc}</p>
          </div>
        </div>

        {/* Security Trust Badge */}
        <div className="mt-20 flex flex-col items-center gap-4 py-8 border-t border-slate-800/50">
          <div className="flex items-center gap-2 text-slate-500">
            <ShieldCheck className="w-5 h-5 text-green-500" />
            <span className="text-sm font-bold uppercase tracking-tighter">{t.securedTransactions}</span>
          </div>
        </div>
      </main>
    </div>
  );
}