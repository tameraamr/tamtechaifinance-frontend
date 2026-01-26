"use client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Shield, Database, Eye, Lock, FileText, Cookie } from "lucide-react";
import { useEffect, useState } from "react";
import Navbar from "../../src/components/Navbar";
import { useTranslation } from "../../src/context/TranslationContext";

export default function PrivacyPage() {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [guestTrials] = useState(3);

  useEffect(() => {
    document.title = "Privacy Policy | Data Protection & Security - Tamtech Finance";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Learn how Tamtech Finance protects your data. Comprehensive privacy policy covering data collection, usage, and security measures.');
    }
    
    // Add canonical tag
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', 'https://tamtech-finance.com/privacy');
  }, []);

  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-[#0b1121] text-slate-100 font-sans">
      {/* Add Navbar for language selection */}
      <Navbar guestTrials={guestTrials} />
      
      {/* Back Button */}
      <div className="border-b border-slate-800 bg-[#0b1121]/50">
        <div className="max-w-4xl mx-auto px-4 md:px-6 py-3 md:py-4">
          <Link href="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors py-2 px-1 -ml-1 touch-manipulation">
            <ArrowLeft className="w-5 h-5 md:w-4 md:h-4" />
            <span className="text-base md:text-sm font-bold">{t.backToHome}</span>
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 md:px-6 py-8 md:py-12">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Privacy Policy
          </h1>
          <p className="text-slate-400 text-lg">
            Last updated: January 27, 2026
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
                <h3 className="text-lg font-semibold text-green-400 mb-3">🔒 Enterprise-Grade Security Architecture</h3>
                <p className="text-slate-200 mb-4">
                  We have recently upgraded our authentication system to meet modern enterprise security standards. Your data is protected by multiple layers of security designed to prevent unauthorized access and cyber attacks.
                </p>
              </div>

              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span><strong>HttpOnly Secure Cookies:</strong> We use httpOnly, Secure, and SameSite cookies for authentication - these cannot be accessed by JavaScript, protecting you against XSS (Cross-Site Scripting) attacks</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span><strong>End-to-End Encryption:</strong> All data is encrypted in transit (HTTPS/TLS) and at rest on our servers</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span><strong>CSRF Protection:</strong> SameSite cookie attributes prevent Cross-Site Request Forgery attacks</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span><strong>No Sensitive Data in Client Storage:</strong> We never store authentication tokens or credit information in browser localStorage (eliminated XSS vulnerability)</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span><strong>Access Controls:</strong> Strict role-based access controls and regular security audits</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span><strong>Continuous Monitoring:</strong> Real-time security monitoring and automatic security updates</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span><strong>Data Minimization:</strong> We only collect and retain information necessary for service delivery</span>
                </li>
              </ul>
              
              <div className="mt-4 p-4 bg-green-950/30 border border-green-600/20 rounded-lg">
                <p className="text-sm text-green-200">
                  <strong>✅ OWASP Compliance:</strong> Our security measures align with OWASP Top 10 security standards and GDPR requirements.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">5. Information Sharing & Data Protection</h2>
            <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-6">
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-blue-400 mb-3">🛡️ Your Data Stays Private</h3>
                <p className="text-slate-200 mb-4">
                  <strong className="text-white">We do NOT sell, trade, rent, or share your personal information with third parties for marketing purposes.</strong> Your financial data, stock analysis history, and account information remain 100% confidential.
                </p>
              </div>

              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span><strong>Zero Data Sales:</strong> We never sell your data to advertisers, marketers, or data brokers</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span><strong>No Third-Party Marketing:</strong> Your email and contact information are never shared with external marketing platforms</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span><strong>Financial Data Protected:</strong> Stock analysis results and trading insights remain private to your account</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span><strong>Legal Compliance Only:</strong> Data may only be disclosed if legally required by court order or regulatory authority</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span><strong>Anonymous Analytics:</strong> Google Analytics data is anonymized and cannot identify individual users</span>
                </li>
              </ul>
              
              <div className="mt-4 p-4 bg-blue-950/30 border border-blue-600/20 rounded-lg">
                <p className="text-sm text-blue-200">
                  <strong>Enterprise Standards:</strong> Our data protection practices meet enterprise-grade security standards comparable to major financial institutions.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">6. Cookies and Browser Storage</h2>
            <div className="bg-purple-900/20 border border-purple-500/30 rounded-lg p-6">
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-purple-400 mb-3 flex items-center gap-2">
                  <Cookie className="w-5 h-5" />
                  How We Use Cookies and Browser Storage
                </h3>
                <p className="text-slate-200 mb-4">
                  We use cookies and browser storage to deliver a secure, personalized experience. You can control analytics cookies via our Cookie Consent Banner, but authentication cookies are essential for the platform to function.
                </p>
              </div>

              {/* Authentication Cookies - NEW SECTION */}
              <div className="mb-6 bg-green-900/20 border border-green-500/30 rounded-lg p-4">
                <h4 className="font-semibold text-green-400 mb-3 flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  🔒 Authentication Cookies (Strictly Necessary)
                </h4>
                <p className="text-slate-200 mb-3 text-sm">
                  We use <strong>httpOnly, Secure cookies</strong> to manage your login sessions and credit balance. These cookies are <strong>essential for the website to function</strong> and cannot be disabled.
                </p>
                <ul className="space-y-2 ml-4 text-sm text-slate-300">
                  <li>• <strong>Cookie Name:</strong> <code className="bg-slate-800 px-2 py-0.5 rounded text-green-400">access_token</code></li>
                  <li>• <strong>Purpose:</strong> Secure session management, user authentication, credit tracking</li>
                  <li>• <strong>Duration:</strong> 7 days (auto-renewed on activity)</li>
                  <li>• <strong>Security Features:</strong>
                    <ul className="ml-6 mt-2 space-y-1">
                      <li>✅ <strong>httpOnly:</strong> Cannot be accessed by JavaScript (XSS protection)</li>
                      <li>✅ <strong>Secure:</strong> Only transmitted over HTTPS</li>
                      <li>✅ <strong>SameSite=Lax:</strong> Prevents CSRF attacks</li>
                    </ul>
                  </li>
                  <li>• <strong>GDPR Classification:</strong> Strictly Necessary (exempt from consent under GDPR Article 6(1)(b))</li>
                </ul>
                <div className="mt-3 pt-3 border-t border-green-500/20">
                  <p className="text-xs text-slate-300">
                    <strong>Why These Cookies Are Always Active:</strong> Authentication cookies are required to identify you, maintain your login session, and track your credit balance. Without them, you would need to re-login on every page and the platform could not function.
                  </p>
                </div>
              </div>

              {/* Google Analytics Disclosure */}
              <div className="mb-6 bg-amber-900/20 border border-amber-500/30 rounded-lg p-4">
                <h4 className="font-semibold text-amber-400 mb-3">📊 Google Analytics (GA4) - Optional</h4>
                <p className="text-slate-200 mb-3 text-sm">
                  We use <strong>Google Analytics 4 (GA4)</strong> to understand how visitors use our platform and improve user experience. This is <strong>optional</strong> and you can manage your preference via the Cookie Consent Banner.
                </p>
                <ul className="space-y-2 ml-4 text-sm text-slate-300">
                  <li>• <strong>Cookie Names:</strong> _ga, _gid, _ga_6DD71GL8SC</li>
                  <li>• <strong>Purpose:</strong> Anonymous usage analytics, site performance monitoring, feature improvement</li>
                  <li>• <strong>Duration:</strong> Up to 2 years</li>
                  <li>• <strong>Third Party:</strong> Google LLC (data may be transferred to US servers under Standard Contractual Clauses)</li>
                  <li>• <strong>Your Control:</strong> Accept or reject analytics cookies via our Cookie Consent Banner</li>
                  <li>• <strong>Data Collected:</strong> Page views, session duration, device type, general location (city-level)</li>
                  <li>• <strong>No Personal Data:</strong> GA4 does NOT collect your name, email, or credit balance</li>
                </ul>
                <div className="mt-3 pt-3 border-t border-amber-500/20">
                  <p className="text-sm text-slate-300">
                    <strong>Opt-Out Options:</strong> 
                    <br />1. Reject analytics cookies in our Cookie Consent Banner
                    <br />2. Use the{" "}
                    <a 
                      href="https://tools.google.com/dlpage/gaoptout" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-300 underline"
                    >
                      Google Analytics Opt-out Browser Add-on
                    </a>
                    <br />3. Enable "Do Not Track" in your browser settings
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-white mb-2">💾 Browser Local Storage (Functional)</h4>
                  <p className="text-slate-300 text-sm mb-2">
                    We use browser localStorage for non-sensitive functional data only:
                  </p>
                  <ul className="space-y-1 ml-4 text-sm">
                    <li>• <strong>Language preference:</strong> Your selected language (localStorage: <code className="bg-slate-800 px-1 rounded">lang</code>)</li>
                    <li>• <strong>Guest trial counter:</strong> Remaining free analyses for non-logged users (localStorage: <code className="bg-slate-800 px-1 rounded">guest_trials</code>)</li>
                    <li>• <strong>Analysis cache:</strong> Temporary AI report data (localStorage/sessionStorage: <code className="bg-slate-800 px-1 rounded">analysis_result</code>)</li>
                    <li>• <strong>Cookie consent:</strong> Your analytics cookie preference (localStorage: <code className="bg-slate-800 px-1 rounded">tamtech_cookie_consent</code>)</li>
                  </ul>
                  <div className="mt-2 p-3 bg-slate-900/50 border border-slate-700/30 rounded">
                    <p className="text-xs text-slate-400">
                      <strong>⚠️ Important Security Note:</strong> We do NOT store authentication tokens, passwords, or credit card information in localStorage. All sensitive authentication data is securely stored in httpOnly cookies that JavaScript cannot access.
                    </p>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-white mb-2">🗑️ Data Retention & Deletion</h4>
                  <ul className="space-y-1 ml-4 text-sm">
                    <li>• <strong>Authentication cookies:</strong> Automatically deleted when you log out or after 7 days of inactivity</li>
                    <li>• <strong>Session data:</strong> Cleared when you close your browser</li>
                    <li>• <strong>Analytics cookies:</strong> Managed via Cookie Consent Banner (can be deleted anytime)</li>
                    <li>• <strong>localStorage items:</strong> You can clear all browser data in browser settings at any time</li>
                    <li>• <strong>Cookie consent:</strong> Stored for 1 year to remember your preference</li>
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