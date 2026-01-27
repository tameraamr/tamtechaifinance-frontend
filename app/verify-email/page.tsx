"use client";
import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, XCircle, Loader2, Mail, ArrowRight } from 'lucide-react';

const BASE_URL = typeof window !== 'undefined' ? '/api' : 'https://tamtechaifinance-backend-production.up.railway.app';

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'expired'>('loading');
  const [message, setMessage] = useState('');
  const token = searchParams.get('token');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('Invalid verification link. No token provided.');
      return;
    }

    // Call backend to verify the token
    const verifyEmail = async () => {
      try {
        const response = await fetch(`${BASE_URL}/auth/verify-email?token=${token}`, {
          credentials: 'include',
        });

        const data = await response.json();

        if (response.ok) {
          setStatus('success');
          setMessage(data.message);
          
          // Redirect to dashboard after 3 seconds
          setTimeout(() => {
            router.push('/dashboard?verified=true');
          }, 3000);
        } else if (response.status === 410) {
          // Token expired
          setStatus('expired');
          setMessage(data.detail);
        } else {
          setStatus('error');
          setMessage(data.detail || 'Verification failed');
        }
      } catch (error) {
        setStatus('error');
        setMessage('Network error. Please try again.');
      }
    };

    verifyEmail();
  }, [token, router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0b1121] via-[#1a2332] to-[#0b1121] flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* Card */}
        <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-8 shadow-2xl">
          
          {/* Loading State */}
          {status === 'loading' && (
            <div className="text-center">
              <Loader2 className="w-16 h-16 mx-auto text-blue-500 animate-spin mb-6" />
              <h1 className="text-2xl font-bold text-slate-100 mb-2">Verifying Your Email...</h1>
              <p className="text-slate-400">Please wait while we confirm your account.</p>
            </div>
          )}

          {/* Success State */}
          {status === 'success' && (
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-500/20 flex items-center justify-center">
                <CheckCircle className="w-12 h-12 text-green-500" />
              </div>
              <h1 className="text-2xl font-bold text-slate-100 mb-3">Email Verified! 🎉</h1>
              <p className="text-slate-300 mb-6">{message}</p>
              
              <div className="bg-slate-700/50 rounded-lg p-4 mb-6">
                <p className="text-sm text-slate-300">
                  ✅ Your account is now fully activated
                  <br />
                  ✅ You have <span className="text-green-400 font-semibold">3 free credits</span> to analyze stocks
                  <br />
                  ✅ Access to all AI-powered features
                </p>
              </div>

              <Link
                href="/stock-analyzer"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all"
              >
                Start Analyzing Stocks
                <ArrowRight className="w-5 h-5" />
              </Link>

              <p className="text-xs text-slate-500 mt-4">Redirecting to dashboard in 3 seconds...</p>
            </div>
          )}

          {/* Expired State */}
          {status === 'expired' && (
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-amber-500/20 flex items-center justify-center">
                <Mail className="w-12 h-12 text-amber-500" />
              </div>
              <h1 className="text-2xl font-bold text-slate-100 mb-3">Link Expired ⏰</h1>
              <p className="text-slate-300 mb-6">{message}</p>
              
              <div className="bg-slate-700/50 rounded-lg p-4 mb-6 text-left">
                <p className="text-sm text-slate-300">
                  <strong className="text-amber-400">Why did this happen?</strong>
                  <br />
                  Verification links expire after 24 hours for security reasons.
                </p>
              </div>

              <Link
                href="/?resend=true"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-600 to-orange-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-amber-700 hover:to-orange-700 transition-all"
              >
                Request New Link
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          )}

          {/* Error State */}
          {status === 'error' && (
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-red-500/20 flex items-center justify-center">
                <XCircle className="w-12 h-12 text-red-500" />
              </div>
              <h1 className="text-2xl font-bold text-slate-100 mb-3">Verification Failed ❌</h1>
              <p className="text-slate-300 mb-6">{message}</p>
              
              <div className="bg-slate-700/50 rounded-lg p-4 mb-6 text-left">
                <p className="text-sm text-slate-300">
                  <strong className="text-red-400">Common issues:</strong>
                  <br />
                  • Link was already used
                  <br />
                  • Link was copied incorrectly
                  <br />
                  • Email already verified
                </p>
              </div>

              <div className="flex gap-3">
                <Link
                  href="/"
                  className="flex-1 bg-slate-700 text-slate-100 px-4 py-3 rounded-lg font-semibold hover:bg-slate-600 transition-all text-center"
                >
                  Go Home
                </Link>
                <Link
                  href="/contact"
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all text-center"
                >
                  Contact Support
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <Link href="/" className="text-sm text-slate-400 hover:text-slate-300 transition-colors">
            ← Back to Tamtech Finance
          </Link>
        </div>
      </div>
    </div>
  );
}
