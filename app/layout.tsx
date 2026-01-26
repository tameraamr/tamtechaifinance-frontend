import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from '../src/context/AuthContext';
import { TranslationProvider } from '../src/context/TranslationContext';
import { Toaster } from 'react-hot-toast';
import CookieBanner from '../src/components/CookieBanner';
import ConditionalAnalytics from '../src/components/ConditionalAnalytics';

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
    icon: "/favicon.ico",
    apple: "/favicon.png",
  },

  // كود التحقق من جوجل سيرتش كونسول (من الملف الذي رفعته)
  verification: {
    google: "google7c0ae22a0cf47c58", 
  },
  
  // Mobile Optimization
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
    userScalable: true,
  },

  // لظهور الرابط بشكل احترافي عند المشاركة (Social Media)
  openGraph: {
    title: "Tamtech Finance | Professional AI Stock Analysis",
    description: "Deep financial insights and stock health scores in seconds.",
    url: "https://tamtech-finance.com",
    siteName: "Tamtech Finance",
    images: [
      {
        url: "/favicon.png",
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
    images: ["/favicon.png"],
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
  // JSON-LD Structured Data for better Google understanding
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Tamtech Finance",
    "description": "AI-Powered Stock Analysis Platform - Get institutional-grade market intelligence and financial health scores powered by advanced AI",
    "url": "https://tamtech-finance.com",
    "applicationCategory": "FinanceApplication",
    "operatingSystem": "Web Browser",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD",
      "description": "Free trial with 3 stock analyses"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "ratingCount": "127"
    },
    "creator": {
      "@type": "Organization",
      "name": "Tamtech Finance",
      "url": "https://tamtech-finance.com"
    }
  };

  return (
    <html lang="en">
      <head>
        {/* Structured Data for Google */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          <TranslationProvider>
            {children}
            <Toaster position="top-center" reverseOrder={false} />
            <CookieBanner />
          </TranslationProvider>
        </AuthProvider>
        {/* Google Analytics loads conditionally based on consent */}
        <ConditionalAnalytics gaId="G-6DD71GL8SC" />
      </body>
    </html>
  );
}