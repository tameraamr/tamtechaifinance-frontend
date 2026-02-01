"use client";
import { useState } from 'react';
import { X, Star, Zap, TrendingUp, FileText, Crown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  trigger?: 'credits' | 'portfolio' | 'pdf' | 'feature';
}

export default function UpgradeModal({ isOpen, onClose, trigger = 'credits' }: UpgradeModalProps) {
  const { verifyGumroadLicense, isPro, credits } = useAuth();
  const [showLicenseInput, setShowLicenseInput] = useState(false);
  const [licenseKey, setLicenseKey] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  if (!isOpen) return null;

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
      setShowLicenseInput(false);
      onClose();
    }
  };

  const getTriggerMessage = () => {
    switch (trigger) {
      case 'portfolio':
        return {
          title: '🔒 Portfolio Access - Pro Only',
          subtitle: 'Track unlimited stocks and monitor your portfolio performance in real-time'
        };
      case 'pdf':
        return {
          title: '📄 PDF Export - Pro Only',
          subtitle: 'Download professional PDF reports of your stock analyses'
        };
      case 'feature':
        return {
          title: '✨ Premium Feature',
          subtitle: 'Upgrade to Pro to unlock this feature'
        };
      default:
        return {
          title: '💎 Out of Credits',
          subtitle: 'Choose your preferred option to continue analyzing stocks'
        };
    }
  };

  const { title, subtitle } = getTriggerMessage();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="relative p-6 border-b border-[var(--border-primary)]">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-lg hover:bg-[var(--bg-tertiary)] transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
          <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-2">{title}</h2>
          <p className="text-sm text-[var(--text-muted)]">{subtitle}</p>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Pro Subscription Option */}
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-yellow-600 to-amber-600 rounded-xl blur opacity-30 group-hover:opacity-50 transition-opacity"></div>
            <div className="relative bg-gradient-to-br from-yellow-600/20 to-amber-600/20 border-2 border-yellow-500/50 rounded-xl p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-yellow-500/20 rounded-lg">
                    <Crown className="w-6 h-6 text-yellow-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-yellow-300 flex items-center gap-2">
                      TamtechAI Pro
                      <span className="text-xs bg-yellow-500/30 px-2 py-1 rounded-full">RECOMMENDED</span>
                    </h3>
                    <p className="text-sm text-yellow-200/70">Best value - Unlimited everything</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-yellow-300">$10</div>
                  <div className="text-xs text-yellow-200/70">/month</div>
                </div>
              </div>

              {/* Pro Features */}
              <ul className="space-y-2 mb-6">
                <li className="flex items-center gap-2 text-sm text-yellow-100">
                  <Zap className="w-4 h-4 text-yellow-400" />
                  <span><strong>Unlimited</strong> stock analyses</span>
                </li>
                <li className="flex items-center gap-2 text-sm text-yellow-100">
                  <TrendingUp className="w-4 h-4 text-yellow-400" />
                  <span><strong>Unlimited</strong> stock battles</span>
                </li>
                <li className="flex items-center gap-2 text-sm text-yellow-100">
                  <Star className="w-4 h-4 text-yellow-400" />
                  <span><strong>Full Portfolio</strong> tracking</span>
                </li>
                <li className="flex items-center gap-2 text-sm text-yellow-100">
                  <FileText className="w-4 h-4 text-yellow-400" />
                  <span><strong>PDF Export</strong> for all reports</span>
                </li>
                <li className="flex items-center gap-2 text-sm text-yellow-100">
                  <Zap className="w-4 h-4 text-yellow-400" />
                  <span><strong>Clickable Competitors</strong> in reports</span>
                </li>
                <li className="flex items-center gap-2 text-sm text-yellow-100">
                  <Crown className="w-4 h-4 text-yellow-400" />
                  <span><strong>Priority Support</strong></span>
                </li>
              </ul>

              {/* CTA Button */}
              {!showLicenseInput ? (
                <div className="space-y-3">
                  <a
                    href="https://tamtechfinance.gumroad.com/l/membership"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full bg-gradient-to-r from-yellow-600 to-amber-600 hover:from-yellow-500 hover:to-amber-500 text-white font-bold py-4 px-6 rounded-lg transition-all duration-300 text-center shadow-lg hover:shadow-xl"
                  >
                    🚀 Get Pro Now - $10/month
                  </a>
                  <button
                    onClick={() => setShowLicenseInput(true)}
                    className="w-full text-sm text-yellow-300 hover:text-yellow-200 transition-colors"
                  >
                    Already have a license key? Click to activate
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <input
                    type="text"
                    value={licenseKey}
                    onChange={(e) => setLicenseKey(e.target.value)}
                    placeholder="Enter your Gumroad license key"
                    className="w-full px-4 py-3 bg-[var(--bg-primary)] border border-[var(--border-primary)] rounded-lg text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-yellow-500/50"
                    disabled={isVerifying}
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={handleVerifyLicense}
                      disabled={isVerifying}
                      className="flex-1 bg-gradient-to-r from-yellow-600 to-amber-600 hover:from-yellow-500 hover:to-amber-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-lg transition-all duration-300"
                    >
                      {isVerifying ? 'Verifying...' : 'Activate License'}
                    </button>
                    <button
                      onClick={() => {
                        setShowLicenseInput(false);
                        setLicenseKey('');
                      }}
                      className="px-4 py-3 border border-[var(--border-primary)] rounded-lg hover:bg-[var(--bg-tertiary)] transition-colors"
                      disabled={isVerifying}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[var(--border-primary)]"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-[var(--bg-secondary)] text-[var(--text-muted)]">or</span>
            </div>
          </div>

          {/* Buy Credits Option */}
          <div className="border border-[var(--border-primary)] rounded-xl p-6 hover:border-[var(--accent-primary)]/50 transition-colors">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[var(--accent-primary)]/20 rounded-lg">
                  <Star className="w-6 h-6 text-[var(--accent-primary)]" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[var(--text-primary)]">10 Credits</h3>
                  <p className="text-sm text-[var(--text-muted)]">One-time purchase</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-[var(--text-primary)]">$5</div>
                <div className="text-xs text-[var(--text-muted)]">one-time</div>
              </div>
            </div>

            <ul className="space-y-2 mb-4 text-sm text-[var(--text-secondary)]">
              <li>• 10 stock analyses</li>
              <li>• Valid for 6 months</li>
              <li>• No monthly commitment</li>
            </ul>

            <a
              href="#"
              className="block w-full bg-[var(--accent-primary)] hover:bg-[var(--accent-primary)]/80 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 text-center"
            >
              Buy 10 Credits - $5
            </a>
          </div>

          {/* Current Balance */}
          {!isPro && credits > 0 && (
            <div className="text-center text-sm text-[var(--text-muted)]">
              You currently have <span className="font-bold text-[var(--accent-primary)]">{credits}</span> credits
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
