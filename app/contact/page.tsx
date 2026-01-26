"use client";
import React, { useState, useEffect } from 'react';
import { Mail, MessageSquare, Send, ArrowLeft, Clock, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import { useTranslation } from '../../src/context/TranslationContext';
import LanguageSelector from '../../src/components/LanguageSelector';

export default function ContactPage() {
  const { t, isRTL } = useTranslation();

  useEffect(() => {
    document.title = "Contact Us | Get Support - Tamtech Finance";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Need help with AI stock analysis? Contact Tamtech Finance support team. Fast response within 24 hours. Email us at tamtecht@gmail.com');
    }
    
    // Add canonical tag
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', 'https://tamtech-finance.com/contact');
  }, []);

  const handleEmailSend = () => {
    const subject = encodeURIComponent("Support Inquiry: TamtechAI Pro");
    const body = encodeURIComponent("Hello TamtechAI Team,\n\nI am contacting you regarding...");
    window.location.href = `mailto:tamtecht@gmail.com?subject=${subject}&body=${body}`;
  };

  return (
    <div className={`min-h-screen bg-[#0b1121] text-slate-200 pb-20 ${isRTL ? 'font-arabic' : ''}`} dir={isRTL ? "rtl" : "ltr"}>
      {/* Header */}
      <div className="max-w-7xl mx-auto px-6 pt-10 mb-12 flex items-center justify-between">
        <Link href="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-white transition-all group">
          <ArrowLeft className={`w-4 h-4 transition-transform ${isRTL ? 'rotate-180 group-hover:translate-x-1' : 'group-hover:-translate-x-1'}`} /> 
          <span className="text-sm font-bold uppercase tracking-widest">{t.backToHome}</span>
        </Link>
        <LanguageSelector />
      </div>

      <main className="max-w-5xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
          
          {/* الجانب الأيسر: معلومات التواصل */}
          <div>
            <h1 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight">
              {t.contactWeAreHere} <br /> 
              <span className="text-blue-500">{t.contactToHelpYou}</span>
            </h1>
            <p className="text-slate-400 text-lg mb-12 leading-relaxed">
              {t.contactSubtitle}
            </p>

            <div className="space-y-8">
              <div className="flex gap-5 items-start">
                <div className="p-4 bg-blue-600/10 rounded-2xl text-blue-500 shadow-lg shadow-blue-600/5">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-lg">{t.emailLabel}</h4>
                  <p className="text-slate-400">{t.contactEmailDesc}</p>
                </div>
              </div>

              <div className="flex gap-5 items-start">
                <div className="p-4 bg-purple-600/10 rounded-2xl text-purple-500 shadow-lg shadow-purple-600/5">
                  <Clock className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-lg">{t.responseTime}</h4>
                  <p className="text-slate-400">{t.responseTimeDesc}</p>
                </div>
              </div>
            </div>
          </div>

          {/* الجانب الأيمن: بطاقة الإرسال */}
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-[2rem] blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
            <div className="relative bg-slate-900 border border-slate-800 p-10 rounded-[2rem] shadow-2xl">
              <h3 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
                <MessageSquare className="w-6 h-6 text-blue-500" />
                {t.sendMessage}
              </h3>
              
              <div className="space-y-5">
                <p className="text-slate-400 text-sm italic mb-6">
                  {t.openMailApp}
                </p>

                <button 
                  onClick={handleEmailSend}
                  className="w-full bg-blue-600 hover:bg-blue-500 py-5 rounded-2xl font-black text-white flex items-center justify-center gap-3 transition-all transform active:scale-95 shadow-xl shadow-blue-600/20"
                >
                  <Send className="w-5 h-5" />
                  {t.sendEmail}
                </button>

                <div className="pt-6 flex items-center justify-center gap-2 text-slate-600">
                  <ShieldCheck className="w-4 h-4 text-green-500" />
                  <span className="text-[10px] uppercase font-bold tracking-widest">{t.contactSecureChannel}</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}