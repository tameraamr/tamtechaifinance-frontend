/**
 * @fileoverview Centralized mock data for the TamtechAI Finance portfolio demo.
 *
 * This file provides institutional-grade hardcoded data that replaces all
 * backend API responses. The data is designed to showcase the platform's
 * full capabilities without requiring a live server.
 *
 * @author Tamer — TamtechAI Finance
 * @version 2.0.0 — Portfolio Demo Mode
 */

// ─────────────────────────────────────────────────────────────
// MOCK USER
// ─────────────────────────────────────────────────────────────

export const MOCK_USER = {
  id: 1,
  email: "tamer@tamtech.dev",
  first_name: "Tamer",
  last_name: "Al-Tamimi",
  phone_number: "+1-555-0100",
  country: "AE",
  address: null,
  credits: 999,
  is_verified: 1,
  is_pro: 1,
  subscription_expiry: "2027-12-31T23:59:59Z",
  gumroad_license_key: "DEMO-PRO-LICENSE",
};

// ─────────────────────────────────────────────────────────────
// TRADING JOURNAL — 12 REALISTIC ENTRIES
// ─────────────────────────────────────────────────────────────

export const MOCK_TRADES = [
  {
    id: 1,
    pair_ticker: "EURUSD",
    asset_type: "forex",
    order_type: "Buy",
    entry_price: 1.0845,
    exit_price: 1.0912,
    stop_loss: 1.0810,
    take_profit: 1.0920,
    lot_size: 1.0,
    risk_reward_ratio: 2.14,
    profit_loss_usd: 670.0,
    profit_loss_pips: 67.0,
    status: "closed",
    result: "win",
    entry_time: "2026-03-15T08:30:00Z",
    exit_time: "2026-03-15T14:45:00Z",
    strategy: "London Breakout",
    trading_session: "London",
    market_trend: "Bullish",
    notes: "Clean break above resistance with high volume confirmation.",
    tags: "breakout,high-probability",
    checklist: null,
    image_url: null,
    account_size_at_entry: 10000,
  },
  {
    id: 2,
    pair_ticker: "XAUUSD",
    asset_type: "gold",
    order_type: "Buy",
    entry_price: 2312.50,
    exit_price: 2345.80,
    stop_loss: 2295.00,
    take_profit: 2350.00,
    lot_size: 0.5,
    risk_reward_ratio: 2.14,
    profit_loss_usd: 1665.0,
    profit_loss_pips: 3330.0,
    status: "closed",
    result: "win",
    entry_time: "2026-03-12T13:00:00Z",
    exit_time: "2026-03-13T09:20:00Z",
    strategy: "Trend Continuation",
    trading_session: "New York",
    market_trend: "Bullish",
    notes: "Gold rallied on dovish Fed expectations. Entered on pullback to 50 EMA.",
    tags: "trend,ema-pullback",
    checklist: null,
    image_url: null,
    account_size_at_entry: 10000,
  },
  {
    id: 3,
    pair_ticker: "GBPUSD",
    asset_type: "forex",
    order_type: "Sell",
    entry_price: 1.2680,
    exit_price: 1.2720,
    stop_loss: 1.2720,
    take_profit: 1.2600,
    lot_size: 0.5,
    risk_reward_ratio: 2.0,
    profit_loss_usd: -200.0,
    profit_loss_pips: -40.0,
    status: "closed",
    result: "loss",
    entry_time: "2026-03-10T10:15:00Z",
    exit_time: "2026-03-10T11:30:00Z",
    strategy: "London Breakout",
    trading_session: "London",
    market_trend: "Ranging",
    notes: "Fakeout — price reversed after sweeping liquidity below.",
    tags: "stop-hit,fakeout",
    checklist: null,
    image_url: null,
    account_size_at_entry: 10000,
  },
  {
    id: 4,
    pair_ticker: "NAS100",
    asset_type: "indices",
    order_type: "Buy",
    entry_price: 18250.0,
    exit_price: 18420.0,
    stop_loss: 18180.0,
    take_profit: 18450.0,
    lot_size: 1.0,
    risk_reward_ratio: 2.43,
    profit_loss_usd: 340.0,
    profit_loss_pips: 170.0,
    status: "closed",
    result: "win",
    entry_time: "2026-03-08T14:30:00Z",
    exit_time: "2026-03-08T20:00:00Z",
    strategy: "NY Session Momentum",
    trading_session: "New York",
    market_trend: "Bullish",
    notes: "Strong tech earnings drove momentum. Entered after CPI data.",
    tags: "momentum,earnings",
    checklist: null,
    image_url: null,
    account_size_at_entry: 10000,
  },
  {
    id: 5,
    pair_ticker: "USDJPY",
    asset_type: "forex",
    order_type: "Buy",
    entry_price: 151.20,
    exit_price: 152.05,
    stop_loss: 150.80,
    take_profit: 152.10,
    lot_size: 1.0,
    risk_reward_ratio: 2.25,
    profit_loss_usd: 561.0,
    profit_loss_pips: 85.0,
    status: "closed",
    result: "win",
    entry_time: "2026-03-05T02:00:00Z",
    exit_time: "2026-03-05T08:15:00Z",
    strategy: "Asian Range Break",
    trading_session: "Tokyo",
    market_trend: "Bullish",
    notes: "BOJ held rates — yen weakened as expected.",
    tags: "fundamental,boj",
    checklist: null,
    image_url: null,
    account_size_at_entry: 10000,
  },
  {
    id: 6,
    pair_ticker: "EURUSD",
    asset_type: "forex",
    order_type: "Sell",
    entry_price: 1.0920,
    exit_price: 1.0870,
    stop_loss: 1.0950,
    take_profit: 1.0860,
    lot_size: 0.5,
    risk_reward_ratio: 2.0,
    profit_loss_usd: 250.0,
    profit_loss_pips: 50.0,
    status: "closed",
    result: "win",
    entry_time: "2026-02-28T09:00:00Z",
    exit_time: "2026-02-28T15:30:00Z",
    strategy: "Supply Zone Rejection",
    trading_session: "London",
    market_trend: "Bearish",
    notes: "Rejected from weekly supply zone with engulfing candle.",
    tags: "supply-zone,reversal",
    checklist: null,
    image_url: null,
    account_size_at_entry: 10000,
  },
  {
    id: 7,
    pair_ticker: "XAUUSD",
    asset_type: "gold",
    order_type: "Sell",
    entry_price: 2298.00,
    exit_price: 2310.50,
    stop_loss: 2312.00,
    take_profit: 2270.00,
    lot_size: 0.3,
    risk_reward_ratio: 2.0,
    profit_loss_usd: -375.0,
    profit_loss_pips: -1250.0,
    status: "closed",
    result: "loss",
    entry_time: "2026-02-25T14:00:00Z",
    exit_time: "2026-02-25T16:45:00Z",
    strategy: "Counter-Trend",
    trading_session: "New York",
    market_trend: "Bullish",
    notes: "Tried to short against trend — lesson learned. Wait for confirmation.",
    tags: "counter-trend,mistake",
    checklist: null,
    image_url: null,
    account_size_at_entry: 10000,
  },
  {
    id: 8,
    pair_ticker: "US30",
    asset_type: "indices",
    order_type: "Buy",
    entry_price: 39150.0,
    exit_price: 39380.0,
    stop_loss: 39050.0,
    take_profit: 39400.0,
    lot_size: 0.5,
    risk_reward_ratio: 2.3,
    profit_loss_usd: 230.0,
    profit_loss_pips: 230.0,
    status: "closed",
    result: "win",
    entry_time: "2026-02-22T15:30:00Z",
    exit_time: "2026-02-23T10:00:00Z",
    strategy: "Trend Continuation",
    trading_session: "New York",
    market_trend: "Bullish",
    notes: "Dow breakout above 39100 psychological level.",
    tags: "breakout,trend",
    checklist: null,
    image_url: null,
    account_size_at_entry: 10000,
  },
  {
    id: 9,
    pair_ticker: "GBPUSD",
    asset_type: "forex",
    order_type: "Buy",
    entry_price: 1.2590,
    exit_price: 1.2650,
    stop_loss: 1.2560,
    take_profit: 1.2660,
    lot_size: 1.0,
    risk_reward_ratio: 2.33,
    profit_loss_usd: 600.0,
    profit_loss_pips: 60.0,
    status: "closed",
    result: "win",
    entry_time: "2026-02-19T08:00:00Z",
    exit_time: "2026-02-19T12:00:00Z",
    strategy: "London Breakout",
    trading_session: "London",
    market_trend: "Bullish",
    notes: "Strong GBP data release. Entered on engulfing pattern at support.",
    tags: "fundamental,support",
    checklist: null,
    image_url: null,
    account_size_at_entry: 10000,
  },
  {
    id: 10,
    pair_ticker: "EURUSD",
    asset_type: "forex",
    order_type: "Buy",
    entry_price: 1.0790,
    exit_price: 1.0780,
    stop_loss: 1.0770,
    take_profit: 1.0840,
    lot_size: 0.5,
    risk_reward_ratio: 2.5,
    profit_loss_usd: -50.0,
    profit_loss_pips: -10.0,
    status: "closed",
    result: "loss",
    entry_time: "2026-02-15T09:30:00Z",
    exit_time: "2026-02-15T10:45:00Z",
    strategy: "Scalp",
    trading_session: "London",
    market_trend: "Ranging",
    notes: "Tight stop got hunted in choppy market. Should have waited for NY.",
    tags: "scalp,stop-hunt",
    checklist: null,
    image_url: null,
    account_size_at_entry: 10000,
  },
  {
    id: 11,
    pair_ticker: "XAUUSD",
    asset_type: "gold",
    order_type: "Buy",
    entry_price: 2275.00,
    exit_price: 2298.00,
    stop_loss: 2260.00,
    take_profit: 2300.00,
    lot_size: 0.5,
    risk_reward_ratio: 1.67,
    profit_loss_usd: 1150.0,
    profit_loss_pips: 2300.0,
    status: "closed",
    result: "win",
    entry_time: "2026-02-12T13:00:00Z",
    exit_time: "2026-02-13T10:00:00Z",
    strategy: "Trend Continuation",
    trading_session: "New York",
    market_trend: "Bullish",
    notes: "Gold continuation after consolidation. Strong close above 2280.",
    tags: "trend,gold-bull",
    checklist: null,
    image_url: null,
    account_size_at_entry: 10000,
  },
  {
    id: 12,
    pair_ticker: "NAS100",
    asset_type: "indices",
    order_type: "Buy",
    entry_price: 18520.0,
    exit_price: null,
    stop_loss: 18400.0,
    take_profit: 18700.0,
    lot_size: 0.5,
    risk_reward_ratio: 1.5,
    profit_loss_usd: undefined,
    profit_loss_pips: undefined,
    status: "open",
    result: undefined,
    entry_time: "2026-03-18T14:00:00Z",
    exit_time: null,
    strategy: "NY Session Momentum",
    trading_session: "New York",
    market_trend: "Bullish",
    notes: "Riding the AI sector momentum. Trailing stop at 18480.",
    tags: "open,momentum",
    checklist: null,
    image_url: null,
    account_size_at_entry: 10000,
  },
];

// ─────────────────────────────────────────────────────────────
// JOURNAL STATS (precomputed from MOCK_TRADES)
// ─────────────────────────────────────────────────────────────

export const MOCK_JOURNAL_STATS = {
  total_trades: 12,
  open_trades: 1,
  closed_trades: 11,
  wins: 8,
  losses: 3,
  breakeven: 0,
  win_rate: 72.7,
  total_pips: 4992.0,
  total_profit_usd: 4841.0,
  net_profit_usd: 4841.0,
  profit_factor: 7.75,
  average_win_pips: 624.0,
  average_loss_pips: 433.3,
  largest_win_usd: 1665.0,
  largest_loss_usd: -375.0,
  trades_remaining_free: 0,
};

// ─────────────────────────────────────────────────────────────
// HEATMAP DATA — 55 ASSETS
// ─────────────────────────────────────────────────────────────

export const MOCK_HEATMAP_DATA = [
  // US Tech
  { ticker: "AAPL", name: "Apple Inc.", price: 198.45, change_p: 1.23, sector: "Technology", asset_type: "stock", market_cap: 3080000000000, volume: 52340000 },
  { ticker: "MSFT", name: "Microsoft Corp.", price: 428.50, change_p: 0.87, sector: "Technology", asset_type: "stock", market_cap: 3180000000000, volume: 21500000 },
  { ticker: "NVDA", name: "NVIDIA Corp.", price: 142.80, change_p: 3.45, sector: "Technology", asset_type: "stock", market_cap: 3500000000000, volume: 48200000 },
  { ticker: "GOOGL", name: "Alphabet Inc.", price: 178.92, change_p: -0.34, sector: "Technology", asset_type: "stock", market_cap: 2210000000000, volume: 18900000 },
  { ticker: "AMZN", name: "Amazon.com", price: 192.15, change_p: 1.56, sector: "Consumer Cyclical", asset_type: "stock", market_cap: 1990000000000, volume: 35600000 },
  { ticker: "TSLA", name: "Tesla Inc.", price: 252.30, change_p: -2.18, sector: "Consumer Cyclical", asset_type: "stock", market_cap: 802000000000, volume: 62800000 },
  { ticker: "META", name: "Meta Platforms", price: 523.40, change_p: 1.92, sector: "Technology", asset_type: "stock", market_cap: 1340000000000, volume: 15200000 },
  { ticker: "AMD", name: "AMD Inc.", price: 168.75, change_p: 2.67, sector: "Technology", asset_type: "stock", market_cap: 272000000000, volume: 42100000 },
  { ticker: "NFLX", name: "Netflix Inc.", price: 698.20, change_p: 0.45, sector: "Technology", asset_type: "stock", market_cap: 302000000000, volume: 8400000 },
  { ticker: "CRM", name: "Salesforce", price: 278.35, change_p: -0.78, sector: "Technology", asset_type: "stock", market_cap: 268000000000, volume: 5600000 },
  // US Blue Chips
  { ticker: "JPM", name: "JPMorgan Chase", price: 212.80, change_p: 0.56, sector: "Financial Services", asset_type: "stock", market_cap: 612000000000, volume: 8900000 },
  { ticker: "V", name: "Visa Inc.", price: 298.45, change_p: 0.32, sector: "Financial Services", asset_type: "stock", market_cap: 588000000000, volume: 6200000 },
  { ticker: "JNJ", name: "Johnson & Johnson", price: 158.90, change_p: -0.12, sector: "Healthcare", asset_type: "stock", market_cap: 382000000000, volume: 7100000 },
  { ticker: "UNH", name: "UnitedHealth", price: 512.30, change_p: 0.89, sector: "Healthcare", asset_type: "stock", market_cap: 472000000000, volume: 3200000 },
  { ticker: "PG", name: "Procter & Gamble", price: 168.20, change_p: 0.15, sector: "Consumer Defensive", asset_type: "stock", market_cap: 396000000000, volume: 5800000 },
  { ticker: "XOM", name: "Exxon Mobil", price: 118.45, change_p: -1.23, sector: "Energy", asset_type: "stock", market_cap: 472000000000, volume: 12300000 },
  { ticker: "HD", name: "Home Depot", price: 382.10, change_p: 0.67, sector: "Consumer Cyclical", asset_type: "stock", market_cap: 378000000000, volume: 3100000 },
  { ticker: "WMT", name: "Walmart", price: 178.30, change_p: 0.23, sector: "Consumer Defensive", asset_type: "stock", market_cap: 482000000000, volume: 7200000 },
  { ticker: "KO", name: "Coca-Cola", price: 61.80, change_p: -0.08, sector: "Consumer Defensive", asset_type: "stock", market_cap: 267000000000, volume: 12100000 },
  { ticker: "DIS", name: "Walt Disney", price: 112.45, change_p: 1.34, sector: "Communication Services", asset_type: "stock", market_cap: 205000000000, volume: 9800000 },
  { ticker: "BAC", name: "Bank of America", price: 42.80, change_p: 0.78, sector: "Financial Services", asset_type: "stock", market_cap: 332000000000, volume: 32100000 },
  { ticker: "COST", name: "Costco", price: 892.50, change_p: 0.45, sector: "Consumer Defensive", asset_type: "stock", market_cap: 396000000000, volume: 2100000 },
  { ticker: "ADBE", name: "Adobe Inc.", price: 498.30, change_p: -1.56, sector: "Technology", asset_type: "stock", market_cap: 221000000000, volume: 3400000 },
  { ticker: "INTC", name: "Intel Corp.", price: 22.15, change_p: -3.42, sector: "Technology", asset_type: "stock", market_cap: 94000000000, volume: 45600000 },
  { ticker: "NKE", name: "Nike Inc.", price: 78.90, change_p: -0.89, sector: "Consumer Cyclical", asset_type: "stock", market_cap: 118000000000, volume: 8900000 },
  // ETFs
  { ticker: "SPY", name: "S&P 500 ETF", price: 528.40, change_p: 0.65, sector: "ETF - US Equity", asset_type: "stock", market_cap: null, volume: 68000000 },
  { ticker: "QQQ", name: "Nasdaq 100 ETF", price: 454.20, change_p: 1.12, sector: "ETF - US Equity", asset_type: "stock", market_cap: null, volume: 42000000 },
  { ticker: "DIA", name: "Dow Jones ETF", price: 398.70, change_p: 0.34, sector: "ETF - US Equity", asset_type: "stock", market_cap: null, volume: 3800000 },
  { ticker: "IWM", name: "Russell 2000 ETF", price: 212.30, change_p: -0.45, sector: "ETF - US Equity", asset_type: "stock", market_cap: null, volume: 21000000 },
  // Crypto
  { ticker: "BTC-USD", name: "Bitcoin", price: 98450.00, change_p: 2.34, sector: "Cryptocurrency", asset_type: "crypto", market_cap: 1930000000000, volume: 28000000000 },
  { ticker: "ETH-USD", name: "Ethereum", price: 3850.00, change_p: 3.12, sector: "Cryptocurrency", asset_type: "crypto", market_cap: 463000000000, volume: 14500000000 },
  { ticker: "SOL-USD", name: "Solana", price: 178.50, change_p: 5.67, sector: "Cryptocurrency", asset_type: "crypto", market_cap: 82000000000, volume: 2800000000 },
  { ticker: "BNB-USD", name: "BNB", price: 612.30, change_p: 1.45, sector: "Cryptocurrency", asset_type: "crypto", market_cap: 91000000000, volume: 1200000000 },
  { ticker: "ADA-USD", name: "Cardano", price: 0.68, change_p: -1.23, sector: "Cryptocurrency", asset_type: "crypto", market_cap: 24000000000, volume: 420000000 },
  { ticker: "XRP-USD", name: "XRP", price: 0.62, change_p: 0.89, sector: "Cryptocurrency", asset_type: "crypto", market_cap: 34000000000, volume: 890000000 },
  { ticker: "DOGE-USD", name: "Dogecoin", price: 0.148, change_p: -2.45, sector: "Cryptocurrency", asset_type: "crypto", market_cap: 21000000000, volume: 680000000 },
  // Commodities
  { ticker: "GC=F", name: "Gold Futures", price: 2348.50, change_p: 0.78, sector: "Commodities", asset_type: "commodity", market_cap: null, volume: 182000 },
  { ticker: "SI=F", name: "Silver Futures", price: 28.45, change_p: 1.34, sector: "Commodities", asset_type: "commodity", market_cap: null, volume: 68000 },
  { ticker: "CL=F", name: "Crude Oil WTI", price: 78.20, change_p: -1.56, sector: "Commodities", asset_type: "commodity", market_cap: null, volume: 312000 },
  { ticker: "NG=F", name: "Natural Gas", price: 2.18, change_p: -3.12, sector: "Commodities", asset_type: "commodity", market_cap: null, volume: 145000 },
  // Forex
  { ticker: "EURUSD=X", name: "EUR/USD", price: 1.0892, change_p: 0.12, sector: "Currency", asset_type: "forex", market_cap: null, volume: null },
  { ticker: "GBPUSD=X", name: "GBP/USD", price: 1.2715, change_p: -0.08, sector: "Currency", asset_type: "forex", market_cap: null, volume: null },
  { ticker: "USDJPY=X", name: "USD/JPY", price: 151.85, change_p: 0.23, sector: "Currency", asset_type: "forex", market_cap: null, volume: null },
  { ticker: "AUDUSD=X", name: "AUD/USD", price: 0.6542, change_p: -0.34, sector: "Currency", asset_type: "forex", market_cap: null, volume: null },
  { ticker: "USDCAD=X", name: "USD/CAD", price: 1.3615, change_p: 0.15, sector: "Currency", asset_type: "forex", market_cap: null, volume: null },
  // Additional stocks
  { ticker: "AVGO", name: "Broadcom Inc.", price: 168.90, change_p: 2.12, sector: "Technology", asset_type: "stock", market_cap: 782000000000, volume: 8900000 },
  { ticker: "MCD", name: "McDonald's", price: 292.10, change_p: 0.23, sector: "Consumer Cyclical", asset_type: "stock", market_cap: 210000000000, volume: 3100000 },
  { ticker: "ABBV", name: "AbbVie Inc.", price: 178.40, change_p: -0.56, sector: "Healthcare", asset_type: "stock", market_cap: 315000000000, volume: 5200000 },
  { ticker: "PEP", name: "PepsiCo", price: 172.80, change_p: 0.34, sector: "Consumer Defensive", asset_type: "stock", market_cap: 237000000000, volume: 4300000 },
  { ticker: "MRK", name: "Merck & Co.", price: 128.90, change_p: 0.67, sector: "Healthcare", asset_type: "stock", market_cap: 326000000000, volume: 8100000 },
  { ticker: "CSCO", name: "Cisco Systems", price: 52.30, change_p: -0.23, sector: "Technology", asset_type: "stock", market_cap: 213000000000, volume: 15200000 },
  { ticker: "ACN", name: "Accenture", price: 342.50, change_p: 0.89, sector: "Technology", asset_type: "stock", market_cap: 215000000000, volume: 2100000 },
  { ticker: "QCOM", name: "Qualcomm", price: 178.20, change_p: 1.78, sector: "Technology", asset_type: "stock", market_cap: 199000000000, volume: 6800000 },
  { ticker: "TXN", name: "Texas Instruments", price: 178.60, change_p: 0.45, sector: "Technology", asset_type: "stock", market_cap: 163000000000, volume: 4500000 },
  { ticker: "BRK-B", name: "Berkshire Hathaway", price: 428.90, change_p: 0.12, sector: "Financial Services", asset_type: "stock", market_cap: 880000000000, volume: 3200000 },
];

// ─────────────────────────────────────────────────────────────
// NVDA — FULL AI ANALYSIS REPORT
// ─────────────────────────────────────────────────────────────

export const MOCK_NVDA_REPORT = {
  ticker: "NVDA",
  company_name: "NVIDIA Corporation",
  data: {
    companyName: "NVIDIA Corporation",
    price: 142.80,
    currentPrice: 142.80,
    regularMarketPrice: 142.80,
    pe_ratio: 62.5,
    peg_ratio: 1.28,
    ps_ratio: 38.2,
    pb_ratio: 48.9,
    eps: 2.28,
    beta: 1.65,
    dividend_yield: 0.02,
    profit_margin: 55.8,
    return_on_equity: 115.2,
    debt_to_equity: 0.41,
    current_ratio: 4.17,
    market_cap: "3.5T",
    fiftyTwoWeekLow: 47.32,
    fiftyTwoWeekHigh: 153.13,
    recommendationKey: "strong_buy",
    chart_data: generateChartData(),
  },
  analysis: {
    verdict: "STRONG BUY",
    confidence_score: 87,
    summary: "NVIDIA Corporation stands at the epicenter of the artificial intelligence revolution, commanding an estimated 80-90% market share in data center GPUs — the silicon backbone powering every major AI model from GPT to Gemini. With its Blackwell B200 architecture shipping to hyperscale customers including Microsoft, Google, Amazon, and Meta, the company has engineered a competitive moat that rivals anything seen in semiconductor history.",
    chapter_1: "NVIDIA's business DNA has undergone a fundamental transformation over the past three years. Once primarily known as a gaming GPU company, NVIDIA now derives over 80% of its revenue from the Data Center segment, which grew 409% year-over-year in Q4 FY2025. The company's CUDA software ecosystem, built over 17 years with 4 million+ developers, creates a lock-in effect that AMD and Intel have struggled to replicate. The Blackwell architecture represents a generational leap — offering 4x the training performance and 30x the inference performance of the previous Hopper generation. This isn't merely an incremental upgrade; it's a platform shift that reinforces NVIDIA's position as the default infrastructure provider for the AI era. Revenue concentration risk exists with hyperscalers, but their insatiable demand for compute capacity provides a multi-year growth runway.",
    chapter_2: "NVIDIA's financial health is extraordinary by any measure. Gross margins have expanded to 73.5%, reflecting the pricing power inherent in a near-monopoly position. Operating margins of 61.6% exceed most software companies, despite NVIDIA being a hardware manufacturer — a testament to the value-add of its software stack. Free cash flow generation of $27B annually funds R&D investment of $8.7B without requiring debt financing. The balance sheet carries $26B in cash against just $11.3B in long-term debt, giving NVIDIA a fortress-like financial position. Revenue growth of 122% YoY in the most recent quarter demonstrates that this is still an acceleration story, not a maturation story.",
    chapter_3: "The valuation at 62.5x trailing P/E appears elevated in isolation, but the PEG ratio of 1.28 suggests the stock is reasonably priced relative to its growth trajectory. Forward estimates project EPS growth of 40%+ over the next two years as Blackwell revenue ramps. The key risk is the 'AI Winter' scenario — a slowdown in enterprise AI spending that would compress multiples. However, current indicators suggest the opposite: hyperscaler capital expenditure guidance for 2026 is $200B+ collectively, with 60-70% directed at AI infrastructure. The sovereign AI trend, where nations build their own AI compute capacity, provides an additional demand vector. At current levels, NVIDIA offers asymmetric upside with identifiable but manageable risks.",
    swot: {
      strengths: [
        "80-90% market share in data center GPUs — near-monopoly position",
        "CUDA ecosystem with 4M+ developers creates deep software moat",
        "73.5% gross margin — best-in-class for semiconductor industry",
        "Blackwell architecture delivering 30x inference performance gains",
      ],
      weaknesses: [
        "Revenue concentration: top 4 customers represent ~40% of sales",
        "Valuation premium leaves limited margin of safety",
        "China export restrictions reduce addressable market by ~15%",
        "Supply chain dependency on TSMC for advanced node manufacturing",
      ],
      opportunities: [
        "Sovereign AI: $50B+ opportunity as nations build domestic compute",
        "Automotive/robotics: DRIVE Thor platform targeting $30B TAM",
        "Software licensing (NVIDIA AI Enterprise) — high-margin recurring revenue",
        "Edge AI inference — next frontier beyond cloud data centers",
      ],
      threats: [
        "Custom ASIC development by Google (TPU), Amazon (Trainium), Microsoft (Maia)",
        "Potential antitrust scrutiny as AI chip dominance grows",
        "Cyclical semiconductor downturn could compress valuations",
        "AMD MI300X gaining traction in inference workloads",
      ],
    },
    bull_case: "NVIDIA becomes the 'picks and shovels' company of the $10T AI economy. Blackwell drives 50%+ revenue growth through 2027 while software licensing creates a high-margin recurring revenue stream. Stock reaches $200+ within 18 months as AI capex continues to accelerate.",
    bear_case: "Enterprise AI spending slows as ROI proves harder to demonstrate. Custom ASICs capture 30%+ of inference market. Multiple compresses from 60x to 30x P/E, sending stock to $80-90 range despite continued revenue growth.",
    competitors: [
      { name: "AMD", ticker: "AMD", comparison: "MI300X competitive in inference; ~15% data center GPU share" },
      { name: "Intel", ticker: "INTC", comparison: "Gaudi 3 targets mid-range; struggles in high-end training" },
      { name: "Broadcom", ticker: "AVGO", comparison: "Custom ASIC partner for Google TPU and Meta MTIA" },
    ],
    upcoming_catalysts: [
      "Q1 FY2026 earnings — Blackwell revenue ramp update",
      "GTC 2026 — next-generation architecture reveal",
      "Sovereign AI contracts — Middle East and ASEAN deployments",
    ],
    ownership_insights: "Vanguard (8.2%), BlackRock (7.1%), and Fidelity (5.4%) are top institutional holders. CEO Jensen Huang holds ~3.5% — significant skin in the game. Insider selling has been minimal relative to stock price appreciation.",
    news: [
      { headline: "NVIDIA Blackwell B200 Ships to All Major Cloud Providers", source: "Reuters", date: "2 hours ago", sentiment: "positive", impact_score: 9 },
      { headline: "AI Data Center Spending to Exceed $200B in 2026, Analysts Say", source: "Bloomberg", date: "1 day ago", sentiment: "positive", impact_score: 8 },
      { headline: "China Develops Alternative AI Chips Amid US Export Controls", source: "Financial Times", date: "2 days ago", sentiment: "negative", impact_score: 5 },
      { headline: "NVIDIA Stock Hits All-Time High as AI Demand Surges", source: "CNBC", date: "3 days ago", sentiment: "positive", impact_score: 7 },
      { headline: "AMD MI300X Gains Market Share in Cloud Inference Workloads", source: "The Information", date: "5 days ago", sentiment: "negative", impact_score: 4 },
    ],
    radar_scores: {
      value: 35,
      growth: 95,
      profitability: 92,
      health: 88,
      momentum: 90,
    },
  },
};

// ─────────────────────────────────────────────────────────────
// CALENDAR EVENTS
// ─────────────────────────────────────────────────────────────

export const MOCK_CALENDAR_EVENTS = [
  { id: 1, name: "FOMC Interest Rate Decision", date_time: getFutureDate(3), importance: "High", ai_impact_note: "Federal Reserve expected to hold rates steady. Any hawkish surprise could strengthen USD and pressure equities." },
  { id: 2, name: "US CPI (Consumer Price Index)", date_time: getFutureDate(5), importance: "High", ai_impact_note: "Core CPI expected at 3.2% YoY. Lower-than-expected reading could trigger risk-on rally." },
  { id: 3, name: "Non-Farm Payrolls (NFP)", date_time: getFutureDate(8), importance: "High", ai_impact_note: "Consensus: 185K new jobs. Weak print may increase rate cut expectations." },
  { id: 4, name: "ECB Monetary Policy Meeting", date_time: getFutureDate(10), importance: "High", ai_impact_note: "ECB likely to signal June rate cut. EUR weakness expected on dovish forward guidance." },
  { id: 5, name: "US Retail Sales", date_time: getFutureDate(12), importance: "Medium", ai_impact_note: "Consumer spending indicator. Strong data supports soft landing narrative." },
  { id: 6, name: "BOJ Policy Decision", date_time: getFutureDate(14), importance: "Medium", ai_impact_note: "BOJ expected to maintain ultra-loose policy. USDJPY intervention risk if yen weakens further." },
  { id: 7, name: "US PMI Manufacturing", date_time: getFutureDate(17), importance: "Medium", ai_impact_note: "Manufacturing expansion above 50 would signal economic resilience." },
  { id: 8, name: "NVIDIA Q1 Earnings", date_time: getFutureDate(21), importance: "High", ai_impact_note: "Blackwell revenue ramp data will be closely watched. Could move entire AI sector." },
];

// ─────────────────────────────────────────────────────────────
// DASHBOARD HISTORY
// ─────────────────────────────────────────────────────────────

export const MOCK_DASHBOARD_HISTORY = [
  { id: 1, ticker: "NVDA", company_name: "NVIDIA Corporation", last_price: 142.80, verdict: "STRONG BUY", confidence_score: 87, created_at: getRecentDate(0), is_expired: false, hours_ago: 2 },
  { id: 2, ticker: "AAPL", company_name: "Apple Inc.", last_price: 198.45, verdict: "BUY", confidence_score: 74, created_at: getRecentDate(1), is_expired: false, hours_ago: 18 },
  { id: 3, ticker: "TSLA", company_name: "Tesla Inc.", last_price: 252.30, verdict: "HOLD", confidence_score: 52, created_at: getRecentDate(2), is_expired: false, hours_ago: 36 },
  { id: 4, ticker: "MSFT", company_name: "Microsoft Corp.", last_price: 428.50, verdict: "BUY", confidence_score: 81, created_at: getRecentDate(3), is_expired: true, hours_ago: 72 },
  { id: 5, ticker: "GOOGL", company_name: "Alphabet Inc.", last_price: 178.92, verdict: "BUY", confidence_score: 78, created_at: getRecentDate(5), is_expired: true, hours_ago: 120 },
  { id: 6, ticker: "AMZN", company_name: "Amazon.com", last_price: 192.15, verdict: "STRONG BUY", confidence_score: 85, created_at: getRecentDate(7), is_expired: true, hours_ago: 168 },
];

// ─────────────────────────────────────────────────────────────
// PORTFOLIO HOLDINGS
// ─────────────────────────────────────────────────────────────

export const MOCK_PORTFOLIO = [
  { id: 1, symbol: "NVDA", current_price: 142.80, change_p: 3.45, shares: 50, avg_buy_price: 88.50, sector: "Technology" },
  { id: 2, symbol: "AAPL", current_price: 198.45, change_p: 1.23, shares: 30, avg_buy_price: 165.20, sector: "Technology" },
  { id: 3, symbol: "MSFT", current_price: 428.50, change_p: 0.87, shares: 15, avg_buy_price: 340.00, sector: "Technology" },
  { id: 4, symbol: "GOOGL", current_price: 178.92, change_p: -0.34, shares: 25, avg_buy_price: 142.30, sector: "Technology" },
  { id: 5, symbol: "TSLA", current_price: 252.30, change_p: -2.18, shares: 20, avg_buy_price: 210.50, sector: "Consumer Cyclical" },
];

// ─────────────────────────────────────────────────────────────
// FEATURED ARTICLE
// ─────────────────────────────────────────────────────────────

export const MOCK_ARTICLE = {
  id: 1,
  slug: "nvidia-blackwell-revolution-2026",
  title: "The Blackwell Revolution: How NVIDIA Is Reshaping the AI Landscape in 2026",
  description: "An in-depth analysis of NVIDIA's Blackwell architecture and its implications for the global AI infrastructure buildout.",
  content: "The semiconductor industry stands at an inflection point. NVIDIA's Blackwell B200 GPU architecture represents not merely an incremental improvement, but a paradigm shift in how artificial intelligence workloads are processed at scale...\n\nWith 208 billion transistors fabricated on TSMC's custom 4NP process, the Blackwell GPU delivers 4x the training throughput and 30x the inference performance compared to its Hopper predecessor. This leap in efficiency is enabling a new class of AI applications that were previously computationally prohibitive.\n\nThe implications extend far beyond Silicon Valley. Sovereign nations from the UAE to Japan are investing billions in domestic AI compute capacity, creating a geopolitical dimension to the AI infrastructure buildout that few anticipated even two years ago.",
  author: "TamtechAI Research",
  hero_emoji: "🚀",
  hero_gradient: "blue,purple,pink",
  image_url: null,
  related_tickers: '["NVDA", "AMD", "AVGO", "TSM"]',
  is_featured: 1,
  published: 1,
  created_at: getRecentDate(1),
  updated_at: getRecentDate(0),
};

export const MOCK_ARTICLES_LIST = [
  MOCK_ARTICLE,
  {
    id: 2, slug: "fed-rate-outlook-2026", title: "Fed Rate Outlook: What Markets Expect for the Second Half of 2026",
    description: "Analysis of Federal Reserve monetary policy trajectory and impact on equity and bond markets.",
    content: "The Federal Reserve faces a delicate balancing act as inflation shows signs of stickiness while the labor market cools...",
    author: "TamtechAI Research", hero_emoji: "📊", hero_gradient: "green,teal,blue", image_url: null,
    related_tickers: '["SPY", "TLT", "GLD"]', is_featured: 0, published: 1, created_at: getRecentDate(3), updated_at: getRecentDate(2),
  },
  {
    id: 3, slug: "gold-2500-bull-case", title: "Gold at $2,500: The Bull Case for Precious Metals in 2026",
    description: "Why institutional investors are increasing gold allocations amid geopolitical uncertainty.",
    content: "Central bank gold purchases reached a record 1,136 tonnes in 2025, signaling a fundamental shift in reserve asset allocation...",
    author: "TamtechAI Research", hero_emoji: "🥇", hero_gradient: "yellow,amber,orange", image_url: null,
    related_tickers: '["GC=F", "GLD", "NEM", "GOLD"]', is_featured: 0, published: 1, created_at: getRecentDate(5), updated_at: getRecentDate(4),
  },
];

// ─────────────────────────────────────────────────────────────
// RECENT ANALYSES (ticker marquee on landing page)
// ─────────────────────────────────────────────────────────────

export const MOCK_RECENT_ANALYSES = [
  { ticker: "NVDA", verdict: "STRONG BUY", confidence: 87 },
  { ticker: "AAPL", verdict: "BUY", confidence: 74 },
  { ticker: "TSLA", verdict: "HOLD", confidence: 52 },
  { ticker: "MSFT", verdict: "BUY", confidence: 81 },
  { ticker: "GOOGL", verdict: "BUY", confidence: 78 },
  { ticker: "AMZN", verdict: "STRONG BUY", confidence: 85 },
  { ticker: "META", verdict: "BUY", confidence: 76 },
  { ticker: "AMD", verdict: "BUY", confidence: 72 },
];

// ─────────────────────────────────────────────────────────────
// STOCK QUOTES (for RegretMachine, Random Picker, etc.)
// ─────────────────────────────────────────────────────────────

export const MOCK_STOCK_QUOTES: Record<string, { price: number; name: string; change_p: number }> = {
  AAPL: { price: 198.45, name: "Apple Inc.", change_p: 1.23 },
  MSFT: { price: 428.50, name: "Microsoft Corp.", change_p: 0.87 },
  NVDA: { price: 142.80, name: "NVIDIA Corp.", change_p: 3.45 },
  GOOGL: { price: 178.92, name: "Alphabet Inc.", change_p: -0.34 },
  AMZN: { price: 192.15, name: "Amazon.com", change_p: 1.56 },
  TSLA: { price: 252.30, name: "Tesla Inc.", change_p: -2.18 },
  META: { price: 523.40, name: "Meta Platforms", change_p: 1.92 },
  AMD: { price: 168.75, name: "AMD Inc.", change_p: 2.67 },
  NFLX: { price: 698.20, name: "Netflix Inc.", change_p: 0.45 },
  JPM: { price: 212.80, name: "JPMorgan Chase", change_p: 0.56 },
  "BTC-USD": { price: 98450.00, name: "Bitcoin", change_p: 2.34 },
  "ETH-USD": { price: 3850.00, name: "Ethereum", change_p: 3.12 },
  "GC=F": { price: 2348.50, name: "Gold Futures", change_p: 0.78 },
};

// ─────────────────────────────────────────────────────────────
// TICKER SEARCH SUGGESTIONS
// ─────────────────────────────────────────────────────────────

export const MOCK_TICKER_LIST = [
  { symbol: "AAPL", name: "Apple Inc." },
  { symbol: "MSFT", name: "Microsoft Corporation" },
  { symbol: "NVDA", name: "NVIDIA Corporation" },
  { symbol: "GOOGL", name: "Alphabet Inc." },
  { symbol: "AMZN", name: "Amazon.com Inc." },
  { symbol: "TSLA", name: "Tesla Inc." },
  { symbol: "META", name: "Meta Platforms Inc." },
  { symbol: "AMD", name: "Advanced Micro Devices" },
  { symbol: "NFLX", name: "Netflix Inc." },
  { symbol: "CRM", name: "Salesforce Inc." },
  { symbol: "JPM", name: "JPMorgan Chase & Co." },
  { symbol: "V", name: "Visa Inc." },
  { symbol: "BRK-B", name: "Berkshire Hathaway" },
  { symbol: "UNH", name: "UnitedHealth Group" },
  { symbol: "XOM", name: "Exxon Mobil Corporation" },
  { symbol: "BTC-USD", name: "Bitcoin USD" },
  { symbol: "ETH-USD", name: "Ethereum USD" },
  { symbol: "SOL-USD", name: "Solana USD" },
  { symbol: "GC=F", name: "Gold Futures" },
  { symbol: "CL=F", name: "Crude Oil WTI" },
  { symbol: "EURUSD=X", name: "EUR/USD" },
  { symbol: "SPY", name: "SPDR S&P 500 ETF" },
  { symbol: "QQQ", name: "Invesco QQQ Trust" },
];

// ─────────────────────────────────────────────────────────────
// RANDOM TICKER POOL
// ─────────────────────────────────────────────────────────────

export const MOCK_RANDOM_TICKERS = [
  { ticker: "NVDA", name: "NVIDIA Corporation", price: 142.80, sector: "Technology" },
  { ticker: "AAPL", name: "Apple Inc.", price: 198.45, sector: "Technology" },
  { ticker: "TSLA", name: "Tesla Inc.", price: 252.30, sector: "Consumer Cyclical" },
  { ticker: "AMD", name: "AMD Inc.", price: 168.75, sector: "Technology" },
  { ticker: "MSFT", name: "Microsoft Corp.", price: 428.50, sector: "Technology" },
  { ticker: "GOOGL", name: "Alphabet Inc.", price: 178.92, sector: "Technology" },
  { ticker: "META", name: "Meta Platforms", price: 523.40, sector: "Technology" },
  { ticker: "AMZN", name: "Amazon.com", price: 192.15, sector: "Consumer Cyclical" },
  { ticker: "NFLX", name: "Netflix Inc.", price: 698.20, sector: "Technology" },
  { ticker: "JPM", name: "JPMorgan Chase", price: 212.80, sector: "Financial Services" },
];

// ─────────────────────────────────────────────────────────────
// EXCHANGE RATES (static)
// ─────────────────────────────────────────────────────────────

export const MOCK_EXCHANGE_RATES = {
  USD: 1, EUR: 0.92, GBP: 0.79, JPY: 151.85, CAD: 1.36, AUD: 1.53,
  CHF: 0.88, CNY: 7.24, INR: 83.12, SGD: 1.34, HKD: 7.82, SEK: 10.45,
};


// ─────────────────────────────────────────────────────────────
// HELPER FUNCTIONS
// ─────────────────────────────────────────────────────────────

/** Generate 250 daily OHLCV points for a stock chart */
function generateChartData(): Array<{ date: string; price: number }> {
  const data: Array<{ date: string; price: number }> = [];
  let price = 48.0; // NVDA price ~1 year ago (pre-split adjusted)
  const now = new Date();

  for (let i = 250; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);

    // Skip weekends
    if (date.getDay() === 0 || date.getDay() === 6) continue;

    // Simulate realistic price movement with upward drift
    const drift = 0.002;
    const volatility = 0.025;
    const change = drift + volatility * (Math.random() - 0.45);
    price = price * (1 + change);
    price = Math.max(price, 40);

    data.push({
      date: date.toISOString().split("T")[0],
      price: parseFloat(price.toFixed(2)),
    });
  }

  // Ensure final price matches our mock
  if (data.length > 0) {
    data[data.length - 1].price = 142.80;
  }

  return data;
}

/** Get a future date N days from now (for calendar events) */
function getFutureDate(daysAhead: number): string {
  const d = new Date();
  d.setDate(d.getDate() + daysAhead);
  d.setHours(14, 30, 0, 0);
  return d.toISOString();
}

/** Get a recent date N days ago (for history items) */
function getRecentDate(daysAgo: number): string {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString();
}
