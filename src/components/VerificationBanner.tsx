"use client";
import { useState, useEffect } from 'react';
import { Mail, RefreshCw, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const BASE_URL = typeof window !== 'undefined' ? '/api' : 'https://tamtechaifinance-backend-production.up.railway.app';

export default function VerificationBanner() {
  const { user, isLoggedIn, isVerified, isLoading } = useAuth();
  const [isResending, setIsResending] = useState(false);
  const [resent, setResent] = useState(false);

  // Don't show banner if:
  // 1. Auth is still loading
  // 2. User is not logged in
  // 3. User is verified
  if (isLoading || !isLoggedIn || isVerified) {
    return null;
  }

  const handleResend = async () => {
    setIsResending(true);
    try {
      const response = await fetch(`${BASE_URL}/auth/resend-verification`, {
        method: 'POST',
        credentials: 'include',
      });

      if (response.ok) {
        setResent(true);
        toast.success('✅ Verification email sent! Check your inbox.', {
          duration: 5000
        });
      } else {
        const data = await response.json();
        toast.error(data.detail || 'Failed to resend email');
      }
    } catch (error) {
      toast.error('Network error. Please try again.');
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-amber-600/95 to-orange-600/95 backdrop-blur-sm border-b border-amber-500/30 shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4 py-4">
          <div className="flex items-center gap-3 flex-1">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
              <Mail className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-semibold text-sm sm:text-base">
                📧 Email Verification Required
              </p>
              <p className="text-white/90 text-xs sm:text-sm mt-0.5">
                Check your inbox at <strong>{user?.email}</strong> and verify to start analyzing stocks!
              </p>
            </div>
          </div>

          {!resent ? (
            <button
              onClick={handleResend}
              disabled={isResending}
              className="flex-shrink-0 inline-flex items-center gap-2 bg-white hover:bg-gray-100 text-amber-700 px-4 py-2 rounded-lg font-semibold text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
            >
              {isResending ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span className="hidden sm:inline">Sending...</span>
                </>
              ) : (
                <>
                  <Mail className="w-4 h-4" />
                  <span className="hidden sm:inline">Resend Email</span>
                  <span className="sm:hidden">Resend</span>
                </>
              )}
            </button>
          ) : (
            <div className="flex-shrink-0 inline-flex items-center gap-2 text-white font-semibold text-sm bg-green-600 px-4 py-2 rounded-lg">
              <CheckCircle className="w-4 h-4" />
              <span className="hidden sm:inline">Email Sent!</span>
              <span className="sm:hidden">Sent!</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
