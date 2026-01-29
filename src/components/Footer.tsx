"use client";
import Link from "next/link";
import { BarChart3, Twitter, Linkedin, Send, ShieldCheck } from "lucide-react";
import { useTranslation } from "../context/TranslationContext";

export default function Footer() {
  const { t } = useTranslation();
  
  return (
    <footer className="bg-[#0b1121] border-t border-slate-800 pt-12 pb-8 w-full">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12 mb-8 text-left">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 className="text-blue-500 w-6 h-6" />
              <span className="font-bold text-xl text-white">
                TamtechAI <span className="text-blue-500">Pro</span>
              </span>
            </div>
            <p className="text-slate-400 text-sm mb-6 leading-relaxed">
              {t.footerDescription}
            </p>
            <div className="flex gap-4">
              <a href="#" className="p-2 bg-slate-800 rounded-lg hover:text-blue-400 transition-all">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="p-2 bg-slate-800 rounded-lg hover:text-blue-600 transition-all">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="https://t.me/tamtechAi" target="_blank" rel="noopener noreferrer" className="p-2 bg-slate-800 rounded-lg hover:text-blue-400 transition-all">
                <Send className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6 text-sm uppercase tracking-wider">{t.footerPlatform}</h4>
            <ul className="space-y-4 text-sm text-slate-400">
              <li><Link href="/" className="hover:text-blue-500">{t.home}</Link></li>
              <li><Link href="/about" className="hover:text-blue-500">{t.about}</Link></li>
              <li><Link href="/pricing" className="hover:text-blue-500">{t.pricing}</Link></li>
              <li><Link href="/contact" className="hover:text-blue-500">{t.contact}</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6 text-sm uppercase tracking-wider">{t.footerLegal}</h4>
            <ul className="space-y-4 text-sm text-slate-400">
              <li><Link href="/terms" className="hover:text-blue-500">{t.termsOfService}</Link></li>
              <li><Link href="/privacy" className="hover:text-blue-500">{t.privacyPolicy}</Link></li>
              <li><Link href="/risk" className="text-red-400 hover:text-red-500 font-medium">{t.footerRiskDisclosure}</Link></li>
            </ul>
          </div>

          <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl shadow-inner">
            <h4 className="text-white font-bold mb-2 text-sm flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-green-500" />
              {t.footerEnterpriseGrade}
            </h4>
            <p className="text-slate-500 text-[11px] leading-relaxed">
              {t.footerEncryptionDesc}
            </p>
          </div>
        </div>

        <div className="border-t border-slate-800/50 pt-8 mt-8 text-center">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 px-4">
            <div className="text-slate-600 text-[10px] font-mono tracking-widest uppercase">
              {t.footerCopyright}
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-500/5 border border-green-500/20">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                <span className="text-[10px] font-bold text-green-500 uppercase tracking-tighter">
                  {t.footerSystemStatus}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
