import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import StockAnalysisPage from './StockAnalysisPage';

const BASE_URL = 'https://tamtechaifinance-backend-production.up.railway.app';

// Generate static paths for top 270 tickers
export async function generateStaticParams() {
  // Popular tickers that should be pre-rendered at build time
  const topTickers = [
    "AAPL", "MSFT", "NVDA", "GOOGL", "AMZN", "META", "TSLA", "BRK.B", "V", "JNJ",
    "WMT", "JPM", "MA", "PG", "UNH", "HD", "CVX", "MRK", "ABBV", "KO",
    "PEP", "COST", "AVGO", "LLY", "ORCL", "ADBE", "CRM", "CSCO", "ACN", "AMD",
    "INTC", "IBM", "TXN", "QCOM", "NOW", "AMAT", "MU", "NFLX", "DIS", "CMCSA",
    "XOM", "BAC", "WFC", "GS", "MS", "SPGI", "BLK", "C", "AXP", "SCHW"
  ];
  
  return topTickers.map((ticker) => ({
    ticker: ticker.toUpperCase(),
  }));
}

// Generate metadata for SEO
export async function generateMetadata({ params }: { params: Promise<{ ticker: string }> }): Promise<Metadata> {
  const { ticker: tickerParam } = await params;
  const ticker = tickerParam.toUpperCase();
  
  try {
    // Fetch cached analysis data for metadata  
    const response = await fetch(`${BASE_URL}/stocks/${ticker}?lang=en`, {
      next: { revalidate: 3600 } // Cache for 1 hour
    });
    
    if (!response.ok) {
      return {
        title: `${ticker} Stock Analysis 2026 - AI-Powered Insights | Tamtech Finance`,
        description: `Comprehensive AI analysis for ${ticker} stock. Get buy/sell recommendations, intrinsic value, financial health scores, and investment insights.`,
        alternates: {
          canonical: `https://tamtech-finance.com/stocks/${ticker}`,
        },
        keywords: `${ticker} stock, ${ticker} analysis, ${ticker} prediction, ${ticker} buy or sell, stock analysis, AI prediction`,
      };
    }
    
    const data = await response.json();
    const analysis = data.analysis;
    const stockData = data.data;
    
    // Dynamic SEO title with verdict
    const title = `${ticker} Analysis: ${analysis.verdict} (${analysis.confidence_score}% Confidence) | Tamtech Finance`;
    const description = analysis.summary_one_line || `AI analysis of ${stockData?.companyName || ticker}. Verdict: ${analysis.verdict} with ${analysis.confidence_score}% confidence. Intrinsic value: $${analysis.intrinsic_value || 'N/A'}.`;
    
    return {
      title,
      description,
      keywords: [
        `${ticker} stock analysis 2026`,
        `${ticker} buy or sell`,
        `${ticker} price prediction`,
        `${ticker} intrinsic value`,
        `${ticker} AI analysis`,
        `${ticker} investment`,
        `${stockData?.companyName} stock`,
        `${stockData?.companyName} analysis`,
        'AI stock prediction',
        'stock analysis tool'
      ].join(', '),
      authors: [{ name: 'Tamtech Finance AI' }],
      openGraph: {
        title,
        description,
        type: 'article',
        url: `https://tamtech-finance.com/stocks/${ticker}`,
        siteName: 'Tamtech Finance',
        images: [
          {
            url: `https://tamtech-finance.com/api/og/${ticker}`,
            width: 1200,
            height: 630,
            alt: `${ticker} Stock Analysis - ${analysis.verdict}`,
          },
        ],
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: [`https://tamtech-finance.com/api/og/${ticker}`],
      },
      alternates: {
        canonical: `https://tamtech-finance.com/stocks/${ticker}`,
        languages: {
          'en-US': `https://tamtech-finance.com/stocks/${ticker}`,
        },
      },
      robots: {
        index: true,
        follow: true,
        nocache: false,
        googleBot: {
          index: true,
          follow: true,
          'max-video-preview': -1,
          'max-image-preview': 'large',
          'max-snippet': -1,
        },
      },
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: `${ticker} Stock Analysis - Tamtech Finance`,
      description: `AI-powered analysis for ${ticker} stock. Real-time financial insights and investment recommendations.`,
      alternates: {
        canonical: `https://tamtech-finance.com/stocks/${ticker}`,
      },
    };
  }
}

// Main page component - Server Component with ISR
export default async function StockPage({ params }: { params: Promise<{ ticker: string }> }) {
  const { ticker: tickerParam } = await params;
  const ticker = tickerParam.toUpperCase();
  
  try {
    // Fetch TEASER analysis data from public endpoint (no auth required)
    const response = await fetch(`${BASE_URL}/stocks/${ticker}?lang=en`, {
      next: { revalidate: 86400 }, // ISR: Revalidate every 24 hours
      headers: {
        'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=172800'
      }
    });
    
    if (!response.ok) {
      // No cached data exists - show landing page
      return (
        <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-white flex items-center justify-center p-4">
          <div className="max-w-2xl w-full text-center space-y-6">
            <h1 className="text-4xl font-bold">{ticker} Stock Analysis</h1>
            <p className="text-xl text-slate-300">
              No analysis available yet. Be the first to analyze {ticker}!
            </p>
            <a
              href={`/stock-analyzer?ticker=${ticker}`}
              className="inline-block px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg font-semibold text-lg hover:from-purple-700 hover:to-pink-700 transition-all"
            >
              Analyze {ticker} Now
            </a>
          </div>
        </div>
      );
    }
    
    const data = await response.json();
    const analysis = data.analysis;
    const stockData = data.data;
    
    // Generate JSON-LD structured data for rich snippets
    const jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'FinancialProduct',
      name: `${ticker} Stock Analysis`,
      description: analysis.summary_one_line || `AI-powered analysis for ${stockData?.companyName || ticker}`,
      category: 'Stock Analysis',
      provider: {
        '@type': 'Organization',
        name: 'Tamtech Finance',
        url: 'https://tamtech-finance.com',
      },
      offers: {
        '@type': 'Offer',
        price: stockData?.price || 0,
        priceCurrency: stockData?.currency || 'USD',
      },
    };
    
    return (
      <>
        {/* Structured Data for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        
        {/* Client Component with TEASER mode */}
        <StockAnalysisPage 
          ticker={ticker}
          initialData={data}
        />
      </>
    );
  } catch (error) {
    console.error('Error loading stock page:', error);
    notFound();
  }
}

// Enable ISR (Incremental Static Regeneration)
export const revalidate = 3600; // 1 hour (temporary for testing)
export const dynamic = 'force-dynamic'; // Force dynamic rendering for now
export const dynamicParams = true; // Allow on-demand generation for unlisted tickers
