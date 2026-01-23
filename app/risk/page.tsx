"use client";
import React from 'react';
import { ShieldAlert, Info, Scale, AlertTriangle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function RiskDisclosure() {
  return (
    <div className="min-h-screen bg-[#0b1121] text-slate-200 font-sans pb-20">
      <div className="border-b border-slate-800 bg-[#0b1121]/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-bold">Back to Home</span>
          </Link>
          <div className="flex items-center gap-2">
            <ShieldAlert className="text-red-500 w-5 h-5" />
            <span className="font-bold text-lg">Legal Disclosure</span>
          </div>
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-6 pt-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-6 tracking-tight">
            Risk Disclosure <span className="text-red-500">&</span> Disclaimer
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed">
            Investing involves significant risk. TamtechAI Pro is for informational purposes only.
          </p>
        </div>

        <div className="space-y-8">
          <section className="bg-slate-900/40 border border-slate-800 p-8 rounded-3xl">
            <div className="flex items-center gap-3 mb-4 text-blue-500">
              <Info className="w-6 h-6" />
              <h2 className="text-xl font-bold text-white">Nature of AI Analysis</h2>
            </div>
            <p className="text-slate-400 leading-relaxed">
              AI analysis can be inaccurate and should not be the sole basis for investment decisions.
            </p>
          </section>

          <section className="bg-slate-900/40 border border-slate-800 p-8 rounded-3xl">
            <div className="flex items-center gap-3 mb-4 text-yellow-500">
              <Scale className="w-6 h-6" />
              <h2 className="text-xl font-bold text-white">Not Investment Advice</h2>
            </div>
            <p className="text-slate-400 leading-relaxed">
              We do not provide financial or tax advice. Consult a professional before investing.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}