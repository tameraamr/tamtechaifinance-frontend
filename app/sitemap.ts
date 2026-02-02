import { MetadataRoute } from 'next'
import fs from 'fs'
import path from 'path'

// Full ticker pool (270 stocks)
const TICKER_POOL = [
  // Technology
  "AAPL", "MSFT", "NVDA", "AVGO", "ORCL", "ADBE", "CRM", "CSCO", "ACN", "AMD",
  "INTC", "IBM", "TXN", "QCOM", "NOW", "AMAT", "MU", "LRCX", "KLAC", "SNPS",
  "CDNS", "ADSK", "ROP", "FTNT", "ANSS", "TYL", "PTC", "ZBRA", "KEYS", "GDDY",
  "INTU", "PANW", "WDAY", "TEAM", "DDOG", "SNOW", "NET", "ZS", "OKTA", "CRWD",
  
  // Healthcare
  "LLY", "UNH", "JNJ", "ABBV", "MRK", "TMO", "ABT", "DHR", "PFE", "BMY",
  "AMGN", "GILD", "CVS", "CI", "MDT", "ISRG", "REGN", "VRTX", "HUM", "BSX",
  "ELV", "ZTS", "SYK", "BDX", "EW", "IDXX", "RMD", "MTD", "DXCM", "A",
  "ALGN", "HOLX", "PODD", "IQV", "CRL",
  
  // Finance
  "BRK.B", "JPM", "V", "MA", "BAC", "WFC", "GS", "MS", "SPGI", "BLK",
  "C", "AXP", "SCHW", "PGR", "CB", "MMC", "PNC", "USB", "TFC", "COF",
  "AON", "ICE", "CME", "MCO", "AJG", "TRV", "AFL", "ALL", "MET", "AIG",
  "FIS", "FISV", "BK", "STT", "TROW",
  
  // Consumer Discretionary
  "AMZN", "TSLA", "HD", "MCD", "NKE", "SBUX", "LOW", "TJX", "BKNG", "CMG",
  "MAR", "ORLY", "AZO", "GM", "F", "ROST", "YUM", "DG", "DLTR", "EBAY",
  "POOL", "ULTA", "DPZ", "BBY", "DECK", "LVS", "MGM", "WYNN", "GRMN", "GPC",
  
  // Energy
  "XOM", "CVX", "COP", "SLB", "EOG", "MPC", "PSX", "VLO", "OXY", "WMB",
  "KMI", "HES", "HAL", "DVN", "BKR", "FANG", "MRO", "APA", "EQT", "CTRA",
  "OKE", "LNG", "TRGP", "EPD", "ET",
  
  // Industrials
  "CAT", "RTX", "UNP", "HON", "BA", "UPS", "LMT", "GE", "DE", "MMM",
  "ETN", "PH", "EMR", "ITW", "CSX", "NSC", "FDX", "WM", "CMI", "PCAR",
  "ROK", "CARR", "OTIS", "GWW", "FAST", "PAYX", "VRSK", "IEX", "DOV", "XYL",
  
  // Materials
  "LIN", "APD", "ECL", "SHW", "FCX", "NEM", "CTVA", "DD", "NUE", "DOW",
  "ALB", "VMC", "MLM", "PPG", "CF",
  
  // Real Estate
  "PLD", "AMT", "EQIX", "PSA", "WELL", "DLR", "O", "SPG", "VICI", "AVB",
  "EQR", "SBAC", "VTR", "EXR", "INVH",
  
  // Utilities
  "NEE", "DUK", "SO", "D", "AEP", "EXC", "SRE", "XEL", "WEC", "ED",
  "ES", "AWK", "DTE", "PPL", "AEE",
  
  // Communications
  "META", "GOOGL", "GOOG", "NFLX", "DIS", "CMCSA", "T", "VZ", "TMUS", "CHTR",
  "EA", "TTWO", "MTCH", "PARA", "WBD",
  
  // Consumer Staples
  "WMT", "PG", "KO", "PEP", "COST", "PM", "MO", "CL", "MDLZ", "KMB",
  "GIS", "K", "HSY", "CAG", "SJM"
];

export default function sitemap(): MetadataRoute.Sitemap {
  const currentDate = new Date();
  
  // Static pages - fix type inference
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: 'https://tamtech-finance.com',
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: 'https://tamtech-finance.com/stock-analyzer',
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: 'https://tamtech-finance.com/about',
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: 'https://tamtech-finance.com/pricing',
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: 'https://tamtech-finance.com/news',
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.7,
    },
    {
      url: 'https://tamtech-finance.com/random-picker',
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.7,
    },
    {
      url: 'https://tamtech-finance.com/risk',
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: 'https://tamtech-finance.com/contact',
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: 'https://tamtech-finance.com/privacy',
      lastModified: currentDate,
      changeFrequency: 'yearly',
      priority: 0.5,
    },
    {
      url: 'https://tamtech-finance.com/terms',
      lastModified: currentDate,
      changeFrequency: 'yearly',
      priority: 0.5,
    },
  ];
  
  // Article pages - AUTOMATICALLY GENERATED from /articles folder
  const articlePages: MetadataRoute.Sitemap = [];
  
  try {
    const articlesDir = path.join(process.cwd(), 'app', 'articles');
    
    if (fs.existsSync(articlesDir)) {
      const folders = fs.readdirSync(articlesDir, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name);
      
      // Add articles index page
      articlePages.push({
        url: 'https://tamtech-finance.com/articles',
        lastModified: currentDate,
        changeFrequency: 'weekly',
        priority: 0.8,
      });
      
      // Add each article page
      folders.forEach(slug => {
        articlePages.push({
          url: `https://tamtech-finance.com/articles/${slug}`,
          lastModified: currentDate,
          changeFrequency: 'monthly',
          priority: 0.9,
        });
      });
    }
  } catch (error) {
    console.error('Error generating article sitemap:', error);
  }
  
  // Dynamic stock pages - All 270 tickers (HIGH PRIORITY FOR SEO)
  const stockPages: MetadataRoute.Sitemap = TICKER_POOL.map((ticker) => ({
    url: `https://tamtech-finance.com/stocks/${ticker}`,
    lastModified: currentDate,
    changeFrequency: 'daily' as const,
    priority: 0.9,
  }));
  
  return [...staticPages, ...articlePages, ...stockPages];
}