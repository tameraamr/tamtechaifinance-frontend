"use client";
import { useState } from "react";
import Link from "next/link";
import { BarChart3, LogOut, User, Star, Menu, X } from "lucide-react";
import { useAuth } from "../context/AuthContext";

interface NavbarProps {
  lang: string;
  setLang: (lang: string) => void;
  guestTrials: number;
}

export default function Navbar({ lang, setLang, guestTrials }: NavbarProps) {
  const { token, credits, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="border-b border-slate-800 bg-[#0b1121]/95 backdrop-blur-xl sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        {/* Main Navbar */}
        <div className="h-16 flex items-center justify-between">
          {/* Left: Logo */}
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity flex-shrink-0">
            <BarChart3 className="text-blue-500 w-5 h-5 md:w-6 md:h-6" />
            <span className="font-bold text-base md:text-xl tracking-tight">
              <span className="hidden sm:inline">TamtechAI </span>
              <span className="sm:hidden">T</span>
              <span className="text-blue-500">Pro</span>
            </span>
          </Link>

          {/* Center: Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-3 lg:gap-4">
            <Link href="/stock-analyzer" className="text-xs font-bold bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-blue-600/50 px-4 py-2 rounded-lg transition-all duration-300 text-slate-300 hover:text-blue-300">
              Analyzer
            </Link>
            <Link href="/random-picker" className="text-xs font-bold bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-blue-600/50 px-4 py-2 rounded-lg transition-all duration-300 text-slate-300 hover:text-blue-300">
              Random Picker
            </Link>
            <Link href="/news" className="text-xs font-bold bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-blue-600/50 px-4 py-2 rounded-lg transition-all duration-300 text-slate-300 hover:text-blue-300">
              News
            </Link>
          </div>

          {/* Right: Credits, Language, User Actions */}
          <div className="flex items-center gap-2 md:gap-3">
            {/* Credits Display */}
            {token ? (
              <div className="flex items-center gap-1 bg-slate-900 border border-slate-700 px-2 md:px-3 py-1 md:py-1.5 rounded-full text-xs font-bold text-slate-300">
                <Star className="w-3 h-3 text-yellow-400" />
                <span>{credits}</span>
              </div>
            ) : (
              <div className="flex items-center gap-1 bg-slate-800 border border-slate-700 px-2 md:px-3 py-1 md:py-1.5 rounded-full text-xs font-bold text-slate-400">
                <User className="w-3 h-3" />
                <span>{guestTrials}</span>
              </div>
            )}

            {/* Language Selector - Hidden on very small screens */}
            <div className="hidden sm:flex bg-slate-900 border border-slate-700 rounded-full p-0.5">
              {['en', 'ar', 'it'].map((l) => (
                <button 
                  key={l} 
                  onClick={() => setLang(l)} 
                  className={`px-2 md:px-3 py-1 rounded-full text-[10px] md:text-xs font-bold uppercase transition-all ${lang === l ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}
                >
                  {l}
                </button>
              ))}
            </div>

            {/* Logout Button - Desktop */}
            {token && (
              <button onClick={logout} className="hidden md:block p-2 text-slate-400 hover:text-red-400 transition-colors">
                <LogOut className="w-5 h-5" />
              </button>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-400 hover:text-white transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-800 py-4 space-y-3 animate-in slide-in-from-top duration-200">
            {/* Navigation Links */}
            <Link 
              href="/stock-analyzer" 
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm font-bold bg-slate-900 hover:bg-slate-800 border border-slate-700 px-4 py-3 rounded-lg transition-all text-slate-300 hover:text-blue-300"
            >
              📊 Stock Analyzer
            </Link>
            <Link 
              href="/random-picker" 
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm font-bold bg-slate-900 hover:bg-slate-800 border border-slate-700 px-4 py-3 rounded-lg transition-all text-slate-300 hover:text-blue-300"
            >
              🎲 Random Picker
            </Link>
            <Link 
              href="/news" 
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm font-bold bg-slate-900 hover:bg-slate-800 border border-slate-700 px-4 py-3 rounded-lg transition-all text-slate-300 hover:text-blue-300"
            >
              📰 News
            </Link>

            {/* Language Selector - Mobile */}
            <div className="sm:hidden flex items-center justify-center gap-2 pt-2">
              <span className="text-xs text-slate-400">Language:</span>
              <div className="flex bg-slate-900 border border-slate-700 rounded-full p-0.5">
                {['en', 'ar', 'it'].map((l) => (
                  <button 
                    key={l} 
                    onClick={() => setLang(l)} 
                    className={`px-3 py-1 rounded-full text-xs font-bold uppercase transition-all ${lang === l ? 'bg-blue-600 text-white' : 'text-slate-400'}`}
                  >
                    {l}
                  </button>
                ))}
              </div>
            </div>

            {/* Logout Button - Mobile */}
            {token && (
              <button 
                onClick={() => {
                  logout();
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-center gap-2 text-sm font-bold bg-red-900/20 hover:bg-red-900/40 border border-red-700/50 px-4 py-3 rounded-lg transition-all text-red-400"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
