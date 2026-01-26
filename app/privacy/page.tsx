"use client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Brain, Shield, Database, Cookie, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";

export default function PrivacyPage() {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    document.title = "Privacy Policy | Data Protection & Security - Tamtech Finance";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Learn how Tamtech Finance protects your data. Comprehensive privacy policy covering data collection, usage, and security measures.');
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#0b1121] text-slate-100 font-sans">
      {/* Navigation Header */}
      <nav className="border-b border-slate-800 bg-[#0b1121]/95 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="h-16 flex items-center justify-between">
            {/* Left: Back Button */}
            <button
              onClick={() => router.push('/')}
              className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors flex-shrink-0"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm font-medium hidden sm:inline">Back to Search</span>
              <span className="text-sm font-medium sm:hidden">Back</span>
            </button>

            {/* Center: Logo */}
            <div className="flex items-center gap-2">
              <Brain className="text-blue-500 w-5 h-5 md:w-6 md:h-6" />
              <span className="font-bold text-base md:text-xl tracking-tight">
                <span className="hidden sm:inline">Tamtech </span>
                <span className="sm:hidden">T</span>
                <span className="text-blue-500">AI</span>
              </span>
            </div>

            {/* Right: Navigation Links (Desktop) / Menu Toggle (Mobile) */}
            <div className="flex items-center gap-3">
              <Link href="/" className="hidden md:flex items-center gap-2 text-sm font-medium text-slate-400 hover:text-white transition-colors">
                Home
              </Link>
              <Link href="/terms" className="hidden md:flex items-center gap-2 text-sm font-medium text-slate-400 hover:text-white transition-colors">
                Terms
              </Link>
              
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
            <div className="md:hidden border-t border-slate-800 py-3 space-y-2">
              <Link 
                href="/" 
                onClick={() => setMobileMenuOpen(false)}
                className="block text-sm font-medium bg-slate-900 hover:bg-slate-800 border border-slate-700 px-4 py-2.5 rounded-lg transition-all text-slate-300"
              >
                🏠 Home
              </Link>
              <Link 
                href="/terms" 
                onClick={() => setMobileMenuOpen(false)}
                className="block text-sm font-medium bg-slate-900 hover:bg-slate-800 border border-slate-700 px-4 py-2.5 rounded-lg transition-all text-slate-300"
              >
                📋 Terms of Service
              </Link>
            </div>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 md:px-6 py-8 md:py-12">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Privacy Policy
          </h1>
          <p className="text-slate-400 text-lg">
            Last updated: January 23, 2026
          </p>
        </div>

        <div className="space-y-8 text-slate-300 leading-relaxed">
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">1. Introduction</h2>
            <p className="mb-4">
              At Tamtech Ai, we are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, and safeguard your data when you use our platform.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">2. Information We Collect</h2>
            <div className="bg-slate-900/50 border border-slate-700/50 rounded-lg p-6">
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-blue-400 mb-3 flex items-center gap-2">
                  <Database className="w-5 h-5" />
                  Account Information
                </h3>
                <ul className="space-y-2 ml-7">
                  <li>• Email address (required for account creation)</li>
                  <li>• First name and last name</li>
                  <li>• Phone number</li>
                  <li>• Country and address (optional)</li>
                </ul>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-blue-400 mb-3 flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  License Keys
                </h3>
                <ul className="space-y-2 ml-7">
                  <li>• License key codes for service activation</li>
                  <li>• Purchase transaction records</li>
                  <li>• Credit usage history</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-blue-400 mb-3 flex items-center gap-2">
                  <Cookie className="w-5 h-5" />
                  Technical Data
                </h3>
                <ul className="space-y-2 ml-7">
                  <li>• IP address for security and rate limiting</li>
                  <li>• Browser type and version</li>
                  <li>• Device information</li>
                  <li>• Usage analytics and error logs</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">3. How We Use Your Information</h2>
            <div className="bg-slate-900/50 border border-slate-700/50 rounded-lg p-6">
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span><strong>Account Management:</strong> To create and manage your user account</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span><strong>Service Delivery:</strong> To provide access to AI analysis features and license key validation</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span><strong>Security:</strong> To protect against fraud, abuse, and unauthorized access</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span><strong>Communication:</strong> To send important service updates and respond to inquiries</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span><strong>Platform Improvement:</strong> To analyze usage patterns and improve our services</span>
                </li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">4. Data Protection and Security</h2>
            <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-6">
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-green-400 mb-3">Our Commitment to Security</h3>
                <p className="text-slate-200 mb-4">
                  We implement industry-standard security measures to protect your personal information:
                </p>
              </div>

              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span><strong>Encryption:</strong> All data is encrypted in transit and at rest</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span><strong>Access Controls:</strong> Strict access controls and regular security audits</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span><strong>Regular Updates:</strong> Continuous monitoring and security updates</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span><strong>Data Minimization:</strong> We only collect and retain necessary information</span>
                </li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">5. Information Sharing</h2>
            <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-6">
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-blue-400 mb-3">We Do Not Share Your Data</h3>
                <p className="text-slate-200 mb-4">
                  <strong className="text-white">We do not sell, trade, or share your personal information with third parties.</strong> Your data remains confidential and is used solely for providing our services.
                </p>
              </div>

              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span>No sharing of financial information or analysis data</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span>No marketing or advertising partnerships</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Legal compliance only when required by law</span>
                </li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">6. Cookies and Local Storage</h2>
            <div className="bg-purple-900/20 border border-purple-500/30 rounded-lg p-6">
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-purple-400 mb-3 flex items-center gap-2">
                  <Cookie className="w-5 h-5" />
                  How We Use Cookies and Local Storage
                </h3>
                <p className="text-slate-200 mb-4">
                  We use cookies and browser local storage to enhance your experience and maintain session security:
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-white mb-2">Session Management</h4>
                  <ul className="space-y-1 ml-4 text-sm">
                    <li>• Authentication tokens for secure login</li>
                    <li>• User preferences and language settings</li>
                    <li>• Temporary analysis data during sessions</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-white mb-2">Security Features</h4>
                  <ul className="space-y-1 ml-4 text-sm">
                    <li>• Rate limiting and abuse prevention</li>
                    <li>• Guest trial usage tracking</li>
                    <li>• CSRF protection tokens</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-white mb-2">Data Retention</h4>
                  <ul className="space-y-1 ml-4 text-sm">
                    <li>• Session data is cleared when you log out</li>
                    <li>• Local storage is used for user convenience only</li>
                    <li>• You can clear cookies and local storage anytime</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">7. Data Retention</h2>
            <p className="mb-4">
              We retain your personal information only as long as necessary to provide our services and comply with legal obligations. Account data is retained while your account is active and for a reasonable period after account closure for legal and regulatory purposes.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">8. Your Rights</h2>
            <div className="bg-slate-900/50 border border-slate-700/50 rounded-lg p-6">
              <p className="mb-4">You have the following rights regarding your personal data:</p>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span><strong>Access:</strong> Request a copy of your personal data</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span><strong>Correction:</strong> Request correction of inaccurate data</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span><strong>Deletion:</strong> Request deletion of your personal data</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span><strong>Portability:</strong> Request transfer of your data</span>
                </li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">9. Children's Privacy</h2>
            <p className="mb-4">
              Our service is not intended for children under 18 years of age. We do not knowingly collect personal information from children under 18. If we become aware that we have collected personal information from a child under 18, we will take steps to delete such information.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">10. Changes to This Policy</h2>
            <p className="mb-4">
              We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date. Your continued use of our service after any changes constitutes acceptance of the updated policy.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">11. Contact Us</h2>
            <p className="mb-4">
              If you have any questions about this Privacy Policy or our data practices, please contact us through our support channels.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}