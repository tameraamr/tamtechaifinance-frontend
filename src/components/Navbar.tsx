"use client";
import { useState } from "react";
import Link from "next/link";
import { BarChart3, LogOut, User, Star, Menu, X, LayoutDashboard } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useTranslation } from "../context/TranslationContext";
import LanguageSelector from "./LanguageSelector";

interface NavbarProps {
  guestTrials: number;
}

export default function Navbar({ guestTrials }: NavbarProps) {
  const { isLoggedIn, credits, logout } = useAuth();
  const { t } = useTranslation();
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
              {t.analyzer}
            </Link>
            <Link href="/random-picker" className="text-xs font-bold bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-blue-600/50 px-4 py-2 rounded-lg transition-all duration-300 text-slate-300 hover:text-blue-300">
              {t.randomPicker}
            </Link>
            <Link href="/news" className="text-xs font-bold bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-blue-600/50 px-4 py-2 rounded-lg transition-all duration-300 text-slate-300 hover:text-blue-300">
              {t.news}
            </Link>
          </div>

          {/* Right: Credits, Language, User Actions */}
          <div className="flex items-center gap-2 md:gap-3">
            {/* Dashboard Button - Desktop */}
            {isLoggedIn && (
              <Link 
                href="/dashboard" 
                className="hidden md:flex items-center gap-1.5 bg-gradient-to-r from-purple-600/20 to-blue-600/20 hover:from-purple-600/30 hover:to-blue-600/30 border border-purple-500/50 hover:border-purple-400/70 px-3 py-1.5 rounded-lg transition-all duration-300 text-purple-300 hover:text-purple-200 text-xs font-bold"
                title="View your dashboard"
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                <span className="hidden lg:inline">Dashboard</span>
              </Link>
            )}
            
            {/* Credits Display */}
            {isLoggedIn ? (
              <Link
                href="/dashboard"
                className="flex items-center gap-1 bg-slate-900 border border-slate-700 px-2 md:px-3 py-1 md:py-1.5 rounded-full text-xs font-bold text-slate-300 hover:border-blue-500/50 transition-all cursor-pointer"
                title="View dashboard"
              >
                <Star className="w-3 h-3 text-yellow-400" />
                <span>{credits}</span>
              </Link>
            ) : (
              <div className="flex items-center gap-1 bg-slate-800 border border-slate-700 px-2 md:px-3 py-1 md:py-1.5 rounded-full text-xs font-bold text-slate-400">
                <User className="w-3 h-3" />
                <span>{guestTrials}</span>
              </div>
            )}

            {/* Language Selector - Hidden on very small screens */}
            <LanguageSelector />

            {/* Logout Button - Desktop */}
            {isLoggedIn && (
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
              📊 {t.analyzer}
            </Link>
            <Link 
              href="/random-picker" 
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm font-bold bg-slate-900 hover:bg-slate-800 border border-slate-700 px-4 py-3 rounded-lg transition-all text-slate-300 hover:text-blue-300"
            >
              🎲 {t.randomPicker}
            </Link>
            <Link 
              href="/news" 
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm font-bold bg-slate-900 hover:bg-slate-800 border border-slate-700 px-4 py-3 rounded-lg transition-all text-slate-300 hover:text-blue-300"
            >
              📰 {t.news}
            </Link>

            {/* Dashboard Link - Before Language Selector */}
            {isLoggedIn && (
              <Link 
                href="/dashboard" 
                onClick={() => setMobileMenuOpen(false)}
                className="block text-sm font-bold bg-gradient-to-r from-purple-600/20 to-blue-600/20 border border-purple-500/50 px-4 py-3 rounded-lg transition-all text-purple-300 flex items-center gap-2"
              >
                <LayoutDashboard className="w-4 h-4" />
                📊 Dashboard
              </Link>
            )}

            {/* Language Selector - Mobile */}
            <div className="pt-2">
              <LanguageSelector />
            </div>

            {/* Logout Button - Mobile */}
            {isLoggedIn && (
              <button 
                onClick={() => {
                  logout();
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-center gap-2 text-sm font-bold bg-red-900/20 hover:bg-red-900/40 border border-red-700/50 px-4 py-3 rounded-lg transition-all text-red-400"
              >
                <LogOut className="w-4 h-4" />
                {t.logout}
              </button>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
