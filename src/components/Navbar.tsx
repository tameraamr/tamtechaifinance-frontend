"use client";
import { useState } from "react";
import Link from "next/link";
import { BarChart3, LogOut, User, Star, Menu, X, LayoutDashboard } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useTranslation } from "../context/TranslationContext";
import LanguageSelector from "./LanguageSelector";

interface NavbarProps {
  guestTrials?: number;
  setShowAuthModal?: (show: boolean) => void;
  setAuthMode?: (mode: string) => void;
}

export default function Navbar({ guestTrials, setShowAuthModal, setAuthMode }: NavbarProps) {
  const { isLoggedIn, credits, logout, isLoading, isPro } = useAuth();
  const { t } = useTranslation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="border-b border-[var(--border-primary)] bg-[var(--bg-secondary)]/95 backdrop-blur-xl sticky top-0 z-50 shadow-navbar-premium">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        {/* Main Navbar */}
        <div className="h-16 flex items-center justify-between">
          {/* Left: Logo */}
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity flex-shrink-0">
            <BarChart3 className="w-5 h-5 md:w-6 md:h-6" style={{ color: 'var(--accent-primary)' }} />
            <span className="font-bold text-base md:text-xl tracking-tight">
              <span className="hidden sm:inline">TamtechAI </span>
              <span className="sm:hidden">T</span>
              <span style={{ color: 'var(--accent-primary)' }}>Pro</span>
            </span>
          </Link>

          {/* Center: Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-3 lg:gap-4">
            <Link href="/stock-analyzer" className="text-xs font-bold bg-[var(--bg-tertiary)] hover:bg-[var(--bg-accent)] border border-[var(--border-primary)] hover:border-[var(--accent-primary)]/50 px-4 py-2 rounded-lg transition-all duration-300 text-[var(--text-secondary)] hover:text-[var(--accent-primary)]">
              {t.analyzer}
            </Link>
            <Link href="/random-picker" className="text-xs font-bold bg-[var(--bg-tertiary)] hover:bg-[var(--bg-accent)] border border-[var(--border-primary)] hover:border-[var(--accent-primary)]/50 px-4 py-2 rounded-lg transition-all duration-300 text-[var(--text-secondary)] hover:text-[var(--accent-primary)]">
              {t.randomPicker}
            </Link>
            <Link href="/calendar" className="text-xs font-bold bg-[var(--bg-tertiary)] hover:bg-[var(--bg-accent)] border border-[var(--border-primary)] hover:border-[var(--accent-primary)]/50 px-4 py-2 rounded-lg transition-all duration-300 text-[var(--text-secondary)] hover:text-[var(--accent-primary)]">
              {t.calendar}
            </Link>
            <Link href="/smart-money-radar" className="text-xs font-bold bg-[var(--bg-tertiary)] hover:bg-[var(--bg-accent)] border border-[var(--border-primary)] hover:border-[var(--accent-primary)]/50 px-4 py-2 rounded-lg transition-all duration-300 text-[var(--text-secondary)] hover:text-[var(--accent-primary)]">
              {t.whaleRadar}
            </Link>
          </div>

          {/* Right: Credits, Language, User Actions */}
          <div className="flex items-center gap-2 md:gap-3">
            {/* Dashboard Button - Desktop */}
            {isLoggedIn && (
              <>
                <Link 
                  href="/dashboard" 
                  className="hidden md:flex items-center gap-1.5 bg-gradient-to-r from-purple-600/20 to-blue-600/20 hover:from-purple-600/30 hover:to-blue-600/30 border border-purple-500/50 hover:border-purple-400/70 px-3 py-1.5 rounded-lg transition-all duration-300 text-purple-300 hover:text-purple-200 text-xs font-bold"
                  title="View your dashboard"
                >
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  <span className="hidden lg:inline">Dashboard</span>
                </Link>
                
                <Link 
                  href="/portfolio" 
                  className="hidden md:flex items-center gap-1.5 bg-gradient-to-r from-green-600/20 to-emerald-600/20 hover:from-green-600/30 hover:to-emerald-600/30 border border-green-500/50 hover:border-green-400/70 px-3 py-1.5 rounded-lg transition-all duration-300 text-green-300 hover:text-green-200 text-xs font-bold"
                  title="Track your portfolio"
                >
                  <span>📊</span>
                  <span className="hidden lg:inline">Portfolio</span>
                </Link>
              </>
            )}
            
            {/* Credits/Pro Badge Display */}
            {isLoading ? (
              <div className="flex items-center gap-1 bg-[var(--bg-tertiary)] border border-[var(--border-primary)] px-2 md:px-3 py-1 md:py-1.5 rounded-full text-xs font-bold text-[var(--text-muted)]">
                <Star className="w-3 h-3 text-[var(--text-muted)] animate-pulse" />
                <span className="animate-pulse">...</span>
              </div>
            ) : isLoggedIn ? (
              isPro ? (
                <Link
                  href="/dashboard"
                  className="flex items-center gap-1.5 bg-gradient-to-r from-yellow-600/20 to-amber-600/20 border border-yellow-500/50 px-3 md:px-4 py-1 md:py-1.5 rounded-full text-xs font-bold text-yellow-300 hover:border-yellow-400/70 transition-all cursor-pointer"
                  title="Pro Subscriber - Unlimited Access"
                >
                  <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                  <span className="hidden sm:inline">PRO</span>
                  <span className="sm:hidden">P</span>
                </Link>
              ) : (
                <Link
                  href="/dashboard"
                  className="flex items-center gap-1 bg-[var(--bg-tertiary)] border border-[var(--border-primary)] px-2 md:px-3 py-1 md:py-1.5 rounded-full text-xs font-bold text-[var(--text-secondary)] hover:border-[var(--accent-primary)]/50 transition-all cursor-pointer"
                  title="View dashboard"
                >
                  <Star className="w-3 h-3 text-yellow-400" />
                  <span>{credits}</span>
                </Link>
              )
            ) : (
              <div className="flex items-center gap-1 bg-[var(--bg-tertiary)] border border-[var(--border-primary)] px-2 md:px-3 py-1 md:py-1.5 rounded-full text-xs font-bold text-[var(--text-muted)]">
                <User className="w-3 h-3" />
                <span>{guestTrials ?? 0}</span>
              </div>
            )}

            {/* Language Selector - Hidden on very small screens */}
            <LanguageSelector />

            {/* Auth Buttons - Desktop */}
            {isLoading ? (
              <div className="hidden md:flex items-center gap-1.5 bg-[var(--bg-tertiary)] border border-[var(--border-primary)] px-4 py-2 rounded-lg text-xs font-bold text-[var(--text-muted)]">
                <User className="w-3.5 h-3.5 animate-pulse" />
                <span className="animate-pulse">...</span>
              </div>
            ) : isLoggedIn ? (
              <button onClick={logout} className="hidden md:block p-2 text-[var(--text-muted)] hover:text-red-400 transition-colors" title="Logout">
                <LogOut className="w-5 h-5" />
              </button>
            ) : (
              <button
                onClick={() => { setAuthMode?.("login"); setShowAuthModal?.(true); }}
                className="hidden md:flex items-center gap-1.5 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 px-4 py-2 rounded-lg transition-all text-white text-xs font-bold"
              >
                <User className="w-3.5 h-3.5" />
                Login
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
              href="/calendar" 
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm font-bold bg-slate-900 hover:bg-slate-800 border border-slate-700 px-4 py-3 rounded-lg transition-all text-slate-300 hover:text-blue-300"
            >
              📅 {t.calendar}
            </Link>
            <Link 
              href="/smart-money-radar" 
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm font-bold bg-slate-900 hover:bg-slate-800 border border-slate-700 px-4 py-3 rounded-lg transition-all text-slate-300 hover:text-blue-300"
            >
              🐳 {t.whaleRadar}
            </Link>

            {/* Dashboard Link - Before Language Selector */}
            {isLoggedIn && (
              <>
                <Link 
                  href="/dashboard" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-sm font-bold bg-gradient-to-r from-purple-600/20 to-blue-600/20 border border-purple-500/50 px-4 py-3 rounded-lg transition-all text-purple-300 flex items-center gap-2"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  📊 Dashboard
                </Link>
                <Link 
                  href="/portfolio" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-sm font-bold bg-gradient-to-r from-green-600/20 to-emerald-600/20 border border-green-500/50 px-4 py-3 rounded-lg transition-all text-green-300 flex items-center gap-2"
                >
                  📊 Portfolio Tracker
                </Link>
              </>
            )}

            {/* Language Selector - Mobile */}
            <div className="pt-2">
              <LanguageSelector />
            </div>

            {/* Auth Buttons - Mobile */}
            {isLoading ? (
              <div className="w-full flex items-center justify-center gap-2 text-sm font-bold bg-slate-800 border border-slate-700 px-4 py-3 rounded-lg text-slate-400">
                <User className="w-4 h-4 animate-pulse" />
                <span className="animate-pulse">Loading...</span>
              </div>
            ) : isLoggedIn ? (
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
            ) : (
              <button
                onClick={() => { setAuthMode?.("login"); setShowAuthModal?.(true); setMobileMenuOpen(false); }}
                className="w-full flex items-center justify-center gap-2 text-sm font-bold bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 px-4 py-3 rounded-lg transition-all text-white"
              >
                <User className="w-4 h-4" />
                Login / Sign Up
              </button>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
