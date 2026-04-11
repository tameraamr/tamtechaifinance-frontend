/**
 * @fileoverview Mock API layer for the TamtechAI Finance portfolio demo.
 *
 * Wraps all mock data in delayed promises to preserve the platform's
 * loading states, skeleton loaders, and animations. Each function
 * simulates realistic network latency.
 *
 * @author Tamer — TamtechAI Finance
 * @version 2.0.0 — Portfolio Demo Mode
 */

import {
  MOCK_USER,
  MOCK_TRADES,
  MOCK_JOURNAL_STATS,
  MOCK_HEATMAP_DATA,
  MOCK_NVDA_REPORT,
  MOCK_CALENDAR_EVENTS,
  MOCK_DASHBOARD_HISTORY,
  MOCK_PORTFOLIO,
  MOCK_ARTICLE,
  MOCK_ARTICLES_LIST,
  MOCK_RECENT_ANALYSES,
  MOCK_STOCK_QUOTES,
  MOCK_TICKER_LIST,
  MOCK_RANDOM_TICKERS,
  MOCK_EXCHANGE_RATES,
} from "./mockData";

/** Simulate network latency with a configurable delay */
const delay = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Centralized mock API — replaces all backend fetch() calls.
 *
 * Each method returns a Promise that resolves after a realistic
 * delay, keeping skeleton loaders and loading animations intact.
 */
export const mockApi = {
  // ── Auth & User ───────────────────────────────────────────

  /** Returns the mock Pro user profile */
  getUserMe: async () => {
    await delay(300);
    return MOCK_USER;
  },

  /** Returns mock user profile (same as getUserMe for dashboard) */
  getUserProfile: async () => {
    await delay(300);
    return MOCK_USER;
  },

  // ── Trading Journal ───────────────────────────────────────

  /** Returns precomputed journal statistics */
  getJournalStats: async () => {
    await delay(500);
    return MOCK_JOURNAL_STATS;
  },

  /** Returns all 12 mock trades */
  getJournalTrades: async () => {
    await delay(700);
    return MOCK_TRADES;
  },

  /** Simulates creating a new trade (no-op in demo mode) */
  createTrade: async (_data: unknown) => {
    await delay(600);
    return { id: 99, message: "Demo mode — trade recorded locally" };
  },

  /** Simulates updating a trade (no-op in demo mode) */
  updateTrade: async (_id: number, _data: unknown) => {
    await delay(500);
    return { success: true, message: "Demo mode — trade updated locally" };
  },

  /** Simulates deleting a trade (no-op in demo mode) */
  deleteTrade: async (_id: number) => {
    await delay(400);
    return { success: true };
  },

  /** Returns public stats for journal sharing */
  getPublicJournalStats: async (_userId: string) => {
    await delay(600);
    return {
      ...MOCK_JOURNAL_STATS,
      user_name: MOCK_USER.first_name,
    };
  },

  // ── Market Data ───────────────────────────────────────────

  /** Returns 55 assets grouped by category for the Master Universe Heatmap */
  getHeatmapData: async () => {
    await delay(600);
    // Transform flat array into grouped format expected by MasterUniverseHeatmap
    const stocks = MOCK_HEATMAP_DATA.filter(d => d.asset_type === "stock").map(d => ({ s: d.ticker, p: d.price, c: d.change_p, t: "stock", n: d.name, sec: d.sector, mc: d.market_cap }));
    const crypto = MOCK_HEATMAP_DATA.filter(d => d.asset_type === "crypto").map(d => ({ s: d.ticker, p: d.price, c: d.change_p, t: "crypto", n: d.name }));
    const commodities = MOCK_HEATMAP_DATA.filter(d => d.asset_type === "commodity").map(d => ({ s: d.ticker, p: d.price, c: d.change_p, t: "commodities", n: d.name }));
    const forex = MOCK_HEATMAP_DATA.filter(d => d.asset_type === "forex").map(d => ({ s: d.ticker, p: d.price, c: d.change_p, t: "forex", n: d.name }));
    return { stocks, crypto, commodities, forex, last_updated: new Date().toISOString(), cache_status: "complete" };
  },

  /** Returns a price quote for a specific ticker */
  getStockQuote: async (ticker: string) => {
    await delay(300);
    const upper = ticker.toUpperCase();
    const quote = MOCK_STOCK_QUOTES[upper];
    if (quote) return { price: quote.price, name: quote.name, change_p: quote.change_p };
    return { price: 100.0 + Math.random() * 50, name: ticker.toUpperCase(), change_p: (Math.random() * 6 - 3) };
  },

  // ── AI Analysis ───────────────────────────────────────────

  /** Returns the full NVDA analysis report (or generates a mock for any ticker) */
  getAnalysisReport: async (ticker: string) => {
    await delay(1200);
    if (ticker.toUpperCase() === "NVDA") {
      return MOCK_NVDA_REPORT;
    }
    // For any other ticker, return NVDA report with ticker swapped
    const quote = MOCK_STOCK_QUOTES[ticker.toUpperCase()];
    return {
      ...MOCK_NVDA_REPORT,
      ticker: ticker.toUpperCase(),
      company_name: quote?.name || `${ticker.toUpperCase()} Inc.`,
      data: {
        ...MOCK_NVDA_REPORT.data,
        companyName: quote?.name || `${ticker.toUpperCase()} Inc.`,
        price: quote?.price || 150.0,
        currentPrice: quote?.price || 150.0,
        regularMarketPrice: quote?.price || 150.0,
      },
    };
  },

  /** Returns recent analyses for the ticker marquee */
  getRecentAnalyses: async () => {
    await delay(400);
    return MOCK_RECENT_ANALYSES;
  },

  /** Returns dashboard analysis history */
  getDashboardHistory: async () => {
    await delay(500);
    return { history: MOCK_DASHBOARD_HISTORY };
  },

  /** Returns a cached analysis for viewing from dashboard */
  getDashboardAnalysis: async (ticker: string) => {
    await delay(600);
    const quote = MOCK_STOCK_QUOTES[ticker.toUpperCase()];
    return {
      ...MOCK_NVDA_REPORT,
      ticker: ticker.toUpperCase(),
      company_name: quote?.name || ticker.toUpperCase(),
      data: {
        ...MOCK_NVDA_REPORT.data,
        companyName: quote?.name || ticker.toUpperCase(),
        price: quote?.price || 150.0,
        currentPrice: quote?.price || 150.0,
        regularMarketPrice: quote?.price || 150.0,
      },
    };
  },

  // ── Search ────────────────────────────────────────────────

  /** Returns ticker search suggestions filtered by query */
  searchTicker: async (query: string) => {
    await delay(250);
    const q = query.toUpperCase();
    return MOCK_TICKER_LIST.filter(
      (t) => t.symbol.includes(q) || t.name.toUpperCase().includes(q)
    ).slice(0, 8);
  },

  // ── Random Ticker ─────────────────────────────────────────

  /** Returns a random ticker for the Stock Picker Roulette */
  getRandomTicker: async () => {
    await delay(400);
    const pick =
      MOCK_RANDOM_TICKERS[
        Math.floor(Math.random() * MOCK_RANDOM_TICKERS.length)
      ];
    return pick;
  },

  // ── Calendar ──────────────────────────────────────────────

  /** Returns upcoming economic events */
  getCalendarEvents: async () => {
    await delay(500);
    return MOCK_CALENDAR_EVENTS;
  },

  // ── Portfolio ─────────────────────────────────────────────

  /** Returns portfolio holdings */
  getPortfolio: async () => {
    await delay(500);
    return MOCK_PORTFOLIO;
  },

  /** Simulates adding a portfolio holding (no-op) */
  addHolding: async (_data: unknown) => {
    await delay(400);
    return { success: true, message: "Demo mode — holding not saved" };
  },

  /** Simulates deleting a portfolio holding (no-op) */
  deleteHolding: async (_id: number) => {
    await delay(400);
    return { success: true };
  },

  /** Returns static exchange rates */
  getExchangeRates: async () => {
    await delay(200);
    return { rates: MOCK_EXCHANGE_RATES };
  },

  // ── Articles / CMS ────────────────────────────────────────

  /** Returns the featured article */
  getFeaturedArticle: async () => {
    await delay(300);
    return MOCK_ARTICLE;
  },

  /** Returns list of all articles */
  getArticles: async () => {
    await delay(400);
    return MOCK_ARTICLES_LIST;
  },

  /** Returns a single article by slug */
  getArticleBySlug: async (slug: string) => {
    await delay(400);
    return MOCK_ARTICLES_LIST.find((a) => a.slug === slug) || MOCK_ARTICLE;
  },

  // ── Contact ───────────────────────────────────────────────

  /** Simulates sending a contact form (no-op) */
  sendContactForm: async (_data: unknown) => {
    await delay(800);
    return { success: true, message: "Demo mode — message not sent" };
  },

  // ── Misc ──────────────────────────────────────────────────

  /** Simulates license verification (no-op, always success) */
  verifyLicense: async (_key: string) => {
    await delay(600);
    return { valid: true, credits: 999, message: "Demo license activated" };
  },

  /** Simulates image upload (no-op) */
  uploadImage: async (_formData: unknown) => {
    await delay(500);
    return { url: null, message: "Demo mode — image not uploaded" };
  },
};

export default mockApi;
