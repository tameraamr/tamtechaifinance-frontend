"use client";
import { useState } from 'react';
import { Mail, RefreshCw, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const BASE_URL = typeof window !== 'undefined' ? '/api' : 'https://tamtechaifinance-backend-production.up.railway.app';

export default function VerificationBanner() {
  const { user, isLoggedIn, isVerified } = useAuth();
  const [isResending, setIsResending] = useState(false);
  const [resent, setResent] = useState(false);

  // Only show banner if user is logged in but not verified
  if (!isLoggedIn || isVerified) {
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
    <div className="bg-gradient-to-r from-amber-600/20 to-orange-600/20 border border-amber-500/30 rounded-xl p-6 mb-6">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-full bg-amber-500/20 flex items-center justify-center flex-shrink-0">
          <Mail className="w-6 h-6 text-amber-400" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-bold text-amber-400 mb-2">
            📧 Email Verification Required
          </h3>
          <p className="text-slate-300 text-sm mb-4">
            You need to verify your email address <strong className="text-white">{user?.email}</strong> to use the AI Stock Analyzer.
            <br />
            Check your inbox for a verification link we sent you during registration.
          </p>

          {!resent ? (
            <button
              onClick={handleResend}
              disabled={isResending}
              className="inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isResending ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Mail className="w-4 h-4" />
                  Resend Verification Email
                </>
              )}
            </button>
          ) : (
            <div className="inline-flex items-center gap-2 text-green-400 font-semibold">
              <CheckCircle className="w-5 h-5" />
              Email sent! Check your inbox.
            </div>
          )}

          <p className="text-xs text-slate-400 mt-3">
            💡 Tip: Check your spam folder if you don't see the email within a few minutes.
          </p>
        </div>
      </div>
    </div>
  );
}
