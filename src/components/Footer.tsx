"use client";
import Link from "next/link";
import { BarChart3, Twitter, Linkedin, Send, ShieldCheck } from "lucide-react";
import { useTranslation } from "../context/TranslationContext";

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="border-t border-[var(--border-primary)] pt-12 pb-8 w-full" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12 mb-8 text-left">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 className="w-6 h-6" style={{ color: 'var(--accent-primary)' }} />
              <span className="font-bold text-xl" style={{ color: 'var(--text-primary)' }}>
                TamtechAI <span style={{ color: 'var(--accent-primary)' }}>Pro</span>
              </span>
            </div>
            <p className="text-sm mb-6 leading-relaxed" style={{ color: 'var(--text-muted)' }}>
              {t.footerDescription}
            </p>
            <div className="flex gap-4">
              <a href="#" className="p-2 rounded-lg transition-all" style={{ backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-secondary)' }} onMouseEnter={(e) => e.currentTarget.style.color = 'var(--accent-primary)'} onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}>
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="p-2 rounded-lg transition-all" style={{ backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-secondary)' }} onMouseEnter={(e) => e.currentTarget.style.color = 'var(--accent-primary)'} onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}>
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="https://t.me/tamtechAi" target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg transition-all" style={{ backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-secondary)' }} onMouseEnter={(e) => e.currentTarget.style.color = 'var(--accent-primary)'} onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}>
                <Send className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-bold mb-6 text-sm uppercase tracking-wider" style={{ color: 'var(--text-primary)' }}>{t.footerPlatform}</h4>
            <ul className="space-y-4 text-sm" style={{ color: 'var(--text-muted)' }}>
              <li><Link href="/" className="transition-colors" onMouseEnter={(e) => e.currentTarget.style.color = 'var(--accent-primary)'} onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}>{t.home}</Link></li>
              <li><Link href="/about" className="transition-colors" onMouseEnter={(e) => e.currentTarget.style.color = 'var(--accent-primary)'} onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}>{t.about}</Link></li>
              <li><Link href="/pricing" className="transition-colors" onMouseEnter={(e) => e.currentTarget.style.color = 'var(--accent-primary)'} onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}>{t.pricing}</Link></li>
              <li><Link href="/contact" className="transition-colors" onMouseEnter={(e) => e.currentTarget.style.color = 'var(--accent-primary)'} onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}>{t.contact}</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-6 text-sm uppercase tracking-wider" style={{ color: 'var(--text-primary)' }}>{t.footerLegal}</h4>
            <ul className="space-y-4 text-sm" style={{ color: 'var(--text-muted)' }}>
              <li><Link href="/terms" className="transition-colors" onMouseEnter={(e) => e.currentTarget.style.color = 'var(--accent-primary)'} onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}>{t.termsOfService}</Link></li>
              <li><Link href="/privacy" className="transition-colors" onMouseEnter={(e) => e.currentTarget.style.color = 'var(--accent-primary)'} onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}>{t.privacyPolicy}</Link></li>
              <li><Link href="/risk" className="text-red-400 hover:text-red-500 font-medium">{t.footerRiskDisclosure}</Link></li>
            </ul>
          </div>

          <div className="p-5 rounded-xl border" style={{ backgroundColor: 'var(--bg-tertiary)', borderColor: 'var(--border-primary)' }}>
            <h4 className="font-semibold mb-2 text-sm flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
              <ShieldCheck className="w-4 h-4" style={{ color: 'var(--accent-primary)' }} />
              {t.footerEnterpriseGrade}
            </h4>
            <p className="text-[11px] leading-relaxed" style={{ color: 'var(--text-muted)' }}>
              {t.footerEncryptionDesc}
            </p>
          </div>
        </div>

        <div className="border-t pt-8 mt-8 text-center" style={{ borderColor: 'var(--border-primary)' }}>
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 px-4">
            <div className="text-[10px] font-mono tracking-wider uppercase" style={{ color: 'var(--text-muted)' }}>
              {t.footerCopyright}
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full" style={{ backgroundColor: 'rgba(34,197,94,0.05)', border: '1px solid rgba(34,197,94,0.15)' }}>
                <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                <span className="text-[10px] font-semibold text-green-500/80 uppercase tracking-tight">
                  {t.footerSystemStatus}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
