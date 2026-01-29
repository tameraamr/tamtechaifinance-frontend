"use client";
import React, { useState, useEffect } from 'react';
import { Mail, MessageSquare, Send, ArrowLeft, Clock, ShieldCheck, CheckCircle, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { useTranslation } from '../../src/context/TranslationContext';
import LanguageSelector from '../../src/components/LanguageSelector';

export default function ContactPage() {
  const { t, isRTL } = useTranslation();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitStatus('success');
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      console.error('Contact form error:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

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

              {submitStatus === 'success' && (
                <div className="mb-6 p-4 bg-green-500/10 border border-green-500/30 rounded-xl flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-green-400 font-semibold">Message sent successfully! We'll get back to you soon.</span>
                </div>
              )}

              {submitStatus === 'error' && (
                <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 text-red-500" />
                  <span className="text-red-400 font-semibold">Failed to send message. Please try again or use the email button below.</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-2">Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full bg-slate-800 border border-slate-700 focus:border-blue-500 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none transition-all"
                      placeholder="Your full name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-2">Email *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full bg-slate-800 border border-slate-700 focus:border-blue-500 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none transition-all"
                      placeholder="your.email@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">Subject *</label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-slate-800 border border-slate-700 focus:border-blue-500 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none transition-all"
                    placeholder="How can we help you?"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">Message *</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={5}
                    className="w-full bg-slate-800 border border-slate-700 focus:border-blue-500 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none transition-all resize-none"
                    placeholder="Tell us more about your inquiry..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-slate-600 py-4 rounded-2xl font-black text-white flex items-center justify-center gap-3 transition-all transform active:scale-95 shadow-xl shadow-blue-600/20 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Send Message
                    </>
                  )}
                </button>
              </form>

              <div className="mt-6 pt-6 border-t border-slate-700">
                <p className="text-slate-400 text-sm text-center mb-4">Or send us an email directly:</p>
                <button
                  onClick={handleEmailSend}
                  className="w-full bg-slate-800 hover:bg-slate-700 border border-slate-600 py-3 rounded-xl font-semibold text-slate-300 flex items-center justify-center gap-3 transition-all"
                >
                  <Mail className="w-4 h-4" />
                  Open Email Client
                </button>
              </div>

              <div className="pt-6 flex items-center justify-center gap-2 text-slate-600">
                <ShieldCheck className="w-4 h-4 text-green-500" />
                <span className="text-[10px] uppercase font-bold tracking-widest">{t.contactSecureChannel}</span>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}