import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
// استيراد مكتبة التحليلات
import { GoogleAnalytics } from '@next/third-parties/google';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  // SEO الأساسي
  title: "Tamtech Finance | AI-Powered Stock Analysis & Insights",
  description: "Get institutional-grade market intelligence and financial health scores powered by advanced AI. Master the stock market with Tamtech Finance.",
  keywords: ["Stock Analysis", "AI Finance", "Market Intelligence", "Investment Tool", "Tamtech Finance", "Financial Analysis AI"],
  
  // الأيقونة
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },

  // كود التحقق من جوجل سيرتش كونسول (من الملف الذي رفعته)
  verification: {
    google: "google7c0ae22a0cf47c58", 
  },

  // لظهور الرابط بشكل احترافي عند المشاركة (Social Media)
  openGraph: {
    title: "Tamtech Finance | Professional AI Stock Analysis",
    description: "Deep financial insights and stock health scores in seconds.",
    url: "https://tamtech-finance.com",
    siteName: "Tamtech Finance",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "Tamtech Finance Preview",
      },
    ],
    locale: "en_US",
    type: "website",
  },

  // تويتر (X)
  twitter: {
    card: "summary_large_image",
    title: "Tamtech Finance | AI Stock Analysis",
    description: "Institutional-grade market intelligence powered by AI.",
    images: ["/logo.png"],
  },

  // إعدادات إضافية لجوجل
  robots: {
    index: true,
    follow: true,
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        {/* إضافة تتبع جوجل هنا */}
        <GoogleAnalytics gaId="G-6DD71GL8SC" />
      </body>
    </html>
  );
}