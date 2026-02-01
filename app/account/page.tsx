"use client";
import { useState } from 'react';
import { useAuth } from '@/src/context/AuthContext';
import { useRouter } from 'next/navigation';
import { Crown, CreditCard, Key, User, Mail, Calendar, CheckCircle, XCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AccountPage() {
  const { user, credits, isPro, subscriptionExpiry, isLoggedIn, isLoading, verifyGumroadLicense } = useAuth();
  const router = useRouter();
  const [licenseKey, setLicenseKey] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  // Redirect if not logged in
  if (!isLoading && !isLoggedIn) {
    router.push('/');
    return null;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const handleVerifyLicense = async () => {
    if (!licenseKey.trim()) {
      toast.error('Please enter your license key');
      return;
    }

    setIsVerifying(true);
    const success = await verifyGumroadLicense(licenseKey);
    setIsVerifying(false);

    if (success) {
      setLicenseKey('');
    }
  };

  const getExpiryStatus = () => {
    if (!subscriptionExpiry) return null;
    
    const expiry = new Date(subscriptionExpiry);
    const now = new Date();
    const daysRemaining = Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    if (daysRemaining > 30) {
      return <span className="text-green-400">Active ({daysRemaining} days remaining)</span>;
    } else if (daysRemaining > 0) {
      return <span className="text-yellow-400">Expiring soon ({daysRemaining} days remaining)</span>;
    } else {
      return <span className="text-red-400">Expired</span>;
    }
  };

  return (
    <div className="min-h-screen pt-20 pb-12 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-[var(--text-primary)] mb-2">
            Account Settings
          </h1>
          <p className="text-[var(--text-muted)]">
            Manage your subscription and account details
          </p>
        </div>

        {/* Pro Status Card */}
        <div className={`border-2 rounded-xl p-6 ${
          isPro 
            ? 'bg-gradient-to-br from-yellow-600/20 to-amber-600/20 border-yellow-500/50' 
            : 'bg-[var(--bg-secondary)] border-[var(--border-primary)]'
        }`}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className={`p-3 rounded-lg ${
                isPro ? 'bg-yellow-500/20' : 'bg-gray-500/20'
              }`}>
                <Crown className={`w-6 h-6 ${
                  isPro ? 'text-yellow-400' : 'text-gray-400'
                }`} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-[var(--text-primary)]">
                  {isPro ? 'Pro Subscription' : 'Free Plan'}
                </h2>
                <p className="text-sm text-[var(--text-muted)]">
                  {isPro ? 'Unlimited access to all features' : 'Upgrade to unlock premium features'}
                </p>
              </div>
            </div>
            {isPro ? (
              <CheckCircle className="w-8 h-8 text-green-400" />
            ) : (
              <XCircle className="w-8 h-8 text-gray-400" />
            )}
          </div>

          {isPro && subscriptionExpiry && (
            <div className="flex items-center gap-2 text-sm text-[var(--text-muted)] mt-4 pt-4 border-t border-[var(--border-primary)]">
              <Calendar className="w-4 h-4" />
              <span>Status: {getExpiryStatus()}</span>
            </div>
          )}
        </div>

        {/* Credits Card */}
        <div className="bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-blue-500/20 rounded-lg">
              <CreditCard className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-[var(--text-primary)]">Credits Balance</h2>
              <p className="text-sm text-[var(--text-muted)]">
                {isPro ? 'Pro users have unlimited analyses' : 'Use credits for stock analyses'}
              </p>
            </div>
          </div>
          <div className="text-3xl font-bold text-[var(--text-primary)]">
            {isPro ? '∞' : credits} 💎
          </div>
          {!isPro && credits === 0 && (
            <button
              onClick={() => router.push('/pricing')}
              className="mt-4 w-full px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
            >
              Buy Credits
            </button>
          )}
        </div>

        {/* Activate License Key Card */}
        {!isPro && (
          <div className="bg-gradient-to-br from-purple-600/20 to-blue-600/20 border-2 border-purple-500/50 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-purple-500/20 rounded-lg">
                <Key className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-[var(--text-primary)]">
                  Activate Pro License
                </h2>
                <p className="text-sm text-[var(--text-muted)]">
                  Enter your Gumroad license key to activate Pro subscription
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <input
                type="text"
                value={licenseKey}
                onChange={(e) => setLicenseKey(e.target.value)}
                placeholder="Enter your license key (e.g., XXXXXXXX-XXXXXXXX-XXXXXXXX-XXXXXXXX)"
                className="w-full px-4 py-3 bg-[var(--bg-tertiary)] border border-[var(--border-primary)] rounded-lg text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-purple-500"
                disabled={isVerifying}
              />
              <button
                onClick={handleVerifyLicense}
                disabled={isVerifying || !licenseKey.trim()}
                className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isVerifying ? 'Verifying...' : 'Activate License'}
              </button>
            </div>

            <div className="mt-4 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
              <p className="text-sm text-blue-300">
                💡 <strong>Don't have a license key?</strong> Visit the{' '}
                <button
                  onClick={() => router.push('/pricing')}
                  className="underline hover:text-blue-200"
                >
                  pricing page
                </button>{' '}
                to purchase Pro subscription.
              </p>
            </div>
          </div>
        )}

        {/* User Info Card */}
        <div className="bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-green-500/20 rounded-lg">
              <User className="w-6 h-6 text-green-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-[var(--text-primary)]">Account Information</h2>
              <p className="text-sm text-[var(--text-muted)]">Your personal details</p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2 text-[var(--text-muted)]">
              <Mail className="w-4 h-4" />
              <span className="text-sm">{user?.email}</span>
            </div>
            {user?.first_name && (
              <div className="text-[var(--text-muted)]">
                <span className="text-sm">
                  {user.first_name} {user.last_name || ''}
                </span>
              </div>
            )}
            {user?.country && (
              <div className="text-[var(--text-muted)]">
                <span className="text-sm">📍 {user.country}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
