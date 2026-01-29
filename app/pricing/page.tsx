"use client";
import React from 'react';
import { Check, Zap, ShieldCheck, Key, ShoppingCart, ArrowLeft, Star } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useTranslation } from '../../src/context/TranslationContext';
import LanguageSelector from '../../src/components/LanguageSelector';

export default function PricingPage() {
  const { t, isRTL } = useTranslation();
  const router = useRouter();
  
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
        <button onClick={() => router.back()} className="inline-flex items-center gap-2 text-slate-500 hover:text-white transition-all group touch-manipulation">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> 
          <span className="text-sm font-bold uppercase tracking-widest">{t.backToDashboard}</span>
        </button>
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

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          
          {/* 10 Credits Package */}
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-[2rem] blur opacity-20 hover:opacity-40 transition duration-1000"></div>
            
            <div className="relative bg-slate-900 border border-slate-800 p-8 rounded-[2rem] shadow-2xl h-full flex flex-col">
              <div className="mb-6">
                <h3 className="text-xl font-black text-white">Starter Pack</h3>
                <p className="text-slate-500 text-xs mt-1 uppercase tracking-widest font-bold">10 Credits</p>
              </div>

              <div className="mb-6">
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-black text-white">$4.99</span>
                </div>
                <p className="text-slate-400 mt-3 text-sm leading-relaxed">
                  Perfect for trying out our AI-powered analysis
                </p>
              </div>

              <ul className="space-y-3 mb-8 flex-grow">
                {[
                  "10 AI Stock Analyses",
                  "Stock Battle Mode",
                  "Professional PDF Exports",
                  "Intrinsic Value Calculations",
                  "Instant License Delivery"
                ].map((feature, i) => (
                  <li key={i} className="flex items-center gap-3 text-slate-300">
                    <div className="bg-blue-500/20 p-1 rounded-full">
                      <Check className="w-3 h-3 text-blue-400" />
                    </div>
                    <span className="text-sm font-medium">{feature}</span>
                  </li>
                ))}
              </ul>

              <a 
                href="https://tamtechfinance.gumroad.com/l/tool?variant=Starter%20Pack%20(10%20Credits)" 
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-blue-600 hover:bg-blue-500 py-4 rounded-2xl font-black text-white flex items-center justify-center gap-3 transition-all transform hover:scale-[1.02] shadow-xl shadow-blue-600/20 group"
              >
                <ShoppingCart className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                Buy Now - $4.99
              </a>
            </div>
          </div>

          {/* 50 Credits Package - Popular */}
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-yellow-600 to-orange-500 rounded-[2rem] blur opacity-30 hover:opacity-50 transition duration-1000"></div>
            
            <div className="relative bg-slate-900 border-2 border-yellow-500/50 p-8 rounded-[2rem] shadow-2xl h-full flex flex-col">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-2xl font-black text-white flex items-center gap-2">
                    <Star className="w-6 h-6 text-yellow-500 fill-yellow-500" />
                    Pro Pack
                  </h3>
                  <p className="text-slate-500 text-xs mt-1 uppercase tracking-widest font-bold">50 Credits</p>
                </div>
                <div className="bg-yellow-600/20 text-yellow-400 px-3 py-1 rounded-full text-xs font-black uppercase">
                  Best Value
                </div>
              </div>

              <div className="mb-6">
                <div className="flex items-baseline gap-2">
                  <span className="text-6xl font-black text-white">$9.99</span>
                </div>
                <p className="text-green-400 text-sm font-bold mt-2">Save 50%! ($0.20 per analysis)</p>
                <p className="text-slate-400 mt-3 text-sm leading-relaxed">
                  Maximum value for serious investors
                </p>
              </div>

              <ul className="space-y-3 mb-8 flex-grow">
                {[
                  "50 AI Stock Analyses",
                  "Stock Battle Mode",
                  "Professional PDF Exports",
                  "Intrinsic Value Calculations",
                  "Instant License Delivery",
                  "Priority AI Processing",
                  "No Expiration Date"
                ].map((feature, i) => (
                  <li key={i} className="flex items-center gap-3 text-slate-300">
                    <div className="bg-yellow-500/20 p-1 rounded-full">
                      <Check className="w-3 h-3 text-yellow-400" />
                    </div>
                    <span className="text-sm font-medium">{feature}</span>
                  </li>
                ))}
              </ul>

              <a 
                href="https://tamtechfinance.gumroad.com/l/tool?variant=Trader's%20Choice%20(50%20Credits)" 
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-500 hover:to-orange-500 py-5 rounded-2xl font-black text-white flex items-center justify-center gap-3 transition-all transform hover:scale-[1.02] shadow-xl shadow-yellow-600/20 group"
              >
                <ShoppingCart className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                Buy Now - $9.99
              </a>
            </div>
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

        {/* Already have a key link */}
        <div className="mt-12 text-center">
          <p className="text-slate-400 mb-4">
            Already have a license key?
            <Link
              href="/dashboard"
              className="text-blue-400 hover:text-blue-300 font-bold ml-2 transition-colors"
            >
              Activate it on your Dashboard →
            </Link>
          </p>
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