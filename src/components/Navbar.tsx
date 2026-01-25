"use client";
import Link from "next/link";
import { BarChart3, LogOut, User, Star } from "lucide-react";
import { useAuth } from "../context/AuthContext";

interface NavbarProps {
  lang: string;
  setLang: (lang: string) => void;
  guestTrials: number;
}

export default function Navbar({ lang, setLang, guestTrials }: NavbarProps) {
  const { token, credits, logout } = useAuth();

  return (
    <nav className="border-b border-slate-800 bg-[#0b1121]/80 backdrop-blur-xl sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-4 md:gap-12">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <BarChart3 className="text-blue-500 w-5 h-5 md:w-6 md:h-6" />
            <span className="font-bold text-lg md:text-xl tracking-tight">
              TamtechAI <span className="text-blue-500">Pro</span>
            </span>
          </Link>
          
          <div className="flex items-center gap-2 md:gap-3 border-l border-slate-700 pl-3 md:pl-8">
            <Link href="/stock-analyzer" className="text-[10px] md:text-xs font-bold bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-blue-600/50 px-2.5 md:px-4 py-1.5 md:py-2 rounded-lg transition-all duration-300 text-slate-300 hover:text-blue-300">
              Analyzer
            </Link>
            <Link href="/random-picker" className="text-[10px] md:text-xs font-bold bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-blue-600/50 px-2.5 md:px-4 py-1.5 md:py-2 rounded-lg transition-all duration-300 text-slate-300 hover:text-blue-300">
              Random Picker
            </Link>
            <Link href="/news" className="text-[10px] md:text-xs font-bold bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-blue-600/50 px-2.5 md:px-4 py-1.5 md:py-2 rounded-lg transition-all duration-300 text-slate-300 hover:text-blue-300">
              News
            </Link>
          </div>
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          {token ? (
            <div className="flex items-center gap-1 bg-slate-900 border border-slate-700 px-2 py-1 rounded-full text-[10px] md:text-xs font-bold text-slate-300">
              <Star className="w-3 h-3 text-yellow-400" />
              <span>{credits}</span>
            </div>
          ) : (
            <div className="flex items-center gap-1 bg-slate-800 border border-slate-700 px-2 py-1 rounded-full text-[10px] md:text-xs font-bold text-slate-400">
              <User className="w-3 h-3" />
              <span>{guestTrials}</span>
            </div>
          )}

          <div className="flex bg-slate-900 border border-slate-700 rounded-full p-0.5 md:p-1">
            {['en', 'ar', 'it'].map((l) => (
              <button 
                key={l} 
                onClick={() => setLang(l)} 
                className={`px-2 md:px-4 py-1 rounded-full text-[10px] md:text-xs font-bold uppercase ${lang === l ? 'bg-blue-600 text-white' : 'text-slate-400'}`}
              >
                {l}
              </button>
            ))}
          </div>

          {token ? (
            <button onClick={logout} className="p-1 md:p-2 text-slate-400 hover:text-red-400">
              <LogOut className="w-4 h-4 md:w-5 md:h-5" />
            </button>
          ) : null}
        </div>
      </div>
    </nav>
  );
}
