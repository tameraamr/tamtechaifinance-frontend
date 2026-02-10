'use client';

import React, { useMemo } from 'react';
import {
    Flame, Calendar, Clock, TrendingUp, TrendingDown, Zap,
    Target, BarChart3, Activity, ArrowUpRight, ArrowDownRight,
    Trophy, AlertTriangle, Percent, DollarSign, Timer
} from 'lucide-react';

/* ─── Trade type ─── */
interface Trade {
    id: number; pair_ticker: string; asset_type: string; order_type: string;
    entry_price: number; exit_price?: number; lot_size: number;
    profit_loss_usd?: number; profit_loss_pips?: number; risk_reward_ratio: number;
    status: string; result?: string; entry_time: string; exit_time?: string;
    strategy?: string; trading_session?: string; notes?: string;
    stop_loss?: number; take_profit?: number; market_trend?: string;
    account_size_at_entry?: number; tags?: string; image_url?: string;
}
interface AdvancedMetrics {
    sharpeRatio: number; maxDrawdown: number; expectancy: number;
    maxWinStreak: number; maxLossStreak: number; avgWin: number; avgLoss: number;
}
interface JournalStats {
    total_trades: number; open_trades: number; closed_trades: number;
    wins: number; losses: number; breakeven: number; win_rate: number;
    total_pips: number; total_profit_usd: number; net_profit_usd: number;
    profit_factor: number; average_win_pips: number; average_loss_pips: number;
    largest_win_usd: number; largest_loss_usd: number; trades_remaining_free: number;
}

interface Props {
    trades: Trade[];
    stats: JournalStats;
    metrics: AdvancedMetrics | null;
}

/* ─── Helper functions ─── */
const fmt = (v: number, d = 2) => v.toFixed(d);
const fmtUsd = (v: number) => `${v >= 0 ? '+' : ''}$${Math.abs(v).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const pct = (v: number) => `${v.toFixed(1)}%`;

export default function JournalDashboardWidgets({ trades, stats, metrics }: Props) {
    const closed = useMemo(() => trades.filter(t => t.status === 'closed'), [trades]);

    /* ── 1. Calendar Heatmap Data ── */
    const calendarData = useMemo(() => {
        const map: Record<string, { pl: number; count: number }> = {};
        closed.forEach(t => {
            const d = (t.exit_time || t.entry_time).split('T')[0];
            if (!map[d]) map[d] = { pl: 0, count: 0 };
            map[d].pl += t.profit_loss_usd || 0;
            map[d].count++;
        });
        return map;
    }, [closed]);

    /* ── 2. Streak Tracking ── */
    const streaks = useMemo(() => {
        let current = 0, best = 0, worst = 0, curLoss = 0;
        const sorted = [...closed].sort((a, b) => new Date(a.exit_time || a.entry_time).getTime() - new Date(b.exit_time || b.entry_time).getTime());
        sorted.forEach(t => {
            if ((t.profit_loss_usd || 0) > 0) { current++; curLoss = 0; if (current > best) best = current; }
            else { curLoss++; current = 0; if (curLoss > worst) worst = curLoss; }
        });
        return { currentWin: current, bestWin: best, worstLoss: worst, currentType: current > 0 ? 'win' : 'loss' };
    }, [closed]);

    /* ── 3. Best/Worst Trading Day ── */
    const bestWorstDay = useMemo(() => {
        const byDay: Record<string, number> = {};
        closed.forEach(t => {
            const d = (t.exit_time || t.entry_time).split('T')[0];
            byDay[d] = (byDay[d] || 0) + (t.profit_loss_usd || 0);
        });
        const entries = Object.entries(byDay);
        if (!entries.length) return { best: { date: '-', pl: 0 }, worst: { date: '-', pl: 0 } };
        const best = entries.reduce((a, b) => b[1] > a[1] ? b : a);
        const worst = entries.reduce((a, b) => b[1] < a[1] ? b : a);
        return { best: { date: best[0], pl: best[1] }, worst: { date: worst[0], pl: worst[1] } };
    }, [closed]);

    /* ── 4. Monthly Breakdown ── */
    const monthlyData = useMemo(() => {
        const map: Record<string, { pl: number; wins: number; losses: number; trades: number }> = {};
        closed.forEach(t => {
            const m = (t.exit_time || t.entry_time).slice(0, 7);
            if (!map[m]) map[m] = { pl: 0, wins: 0, losses: 0, trades: 0 };
            map[m].pl += t.profit_loss_usd || 0;
            map[m].trades++;
            if ((t.profit_loss_usd || 0) > 0) map[m].wins++; else map[m].losses++;
        });
        return Object.entries(map).sort(([a], [b]) => b.localeCompare(a)).slice(0, 6);
    }, [closed]);

    /* ── 5. Win Rate by Day of Week ── */
    const dayOfWeekData = useMemo(() => {
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const map: Record<string, { wins: number; total: number; pl: number }> = {};
        days.forEach(d => map[d] = { wins: 0, total: 0, pl: 0 });
        closed.forEach(t => {
            const d = days[new Date(t.exit_time || t.entry_time).getDay()];
            map[d].total++;
            map[d].pl += t.profit_loss_usd || 0;
            if ((t.profit_loss_usd || 0) > 0) map[d].wins++;
        });
        return days.map(d => ({ day: d, ...map[d], winRate: map[d].total > 0 ? (map[d].wins / map[d].total) * 100 : 0 }));
    }, [closed]);

    /* ── 6. Trade Duration Analysis ── */
    const durationStats = useMemo(() => {
        const durations = closed.filter(t => t.exit_time).map(t => {
            const ms = new Date(t.exit_time!).getTime() - new Date(t.entry_time).getTime();
            return { mins: ms / 60000, pl: t.profit_loss_usd || 0 };
        });
        if (!durations.length) return { avg: 0, shortest: 0, longest: 0, bestDuration: 0 };
        const avg = durations.reduce((s, d) => s + d.mins, 0) / durations.length;
        const shortest = Math.min(...durations.map(d => d.mins));
        const longest = Math.max(...durations.map(d => d.mins));
        // Find which duration bucket is most profitable
        const wins = durations.filter(d => d.pl > 0);
        const bestDuration = wins.length ? wins.reduce((s, d) => s + d.mins, 0) / wins.length : 0;
        return { avg, shortest, longest, bestDuration };
    }, [closed]);

    /* ── 7. Hourly Activity ── */
    const hourlyData = useMemo(() => {
        const map: Record<number, { count: number; pl: number }> = {};
        for (let i = 0; i < 24; i++) map[i] = { count: 0, pl: 0 };
        closed.forEach(t => {
            const h = new Date(t.entry_time).getHours();
            map[h].count++;
            map[h].pl += t.profit_loss_usd || 0;
        });
        return Object.entries(map).map(([h, d]) => ({ hour: parseInt(h), ...d }));
    }, [closed]);

    /* ── 8. Risk Metrics ── */
    const riskMetrics = useMemo(() => {
        const rrs = closed.filter(t => t.risk_reward_ratio > 0).map(t => t.risk_reward_ratio);
        const avgRR = rrs.length ? rrs.reduce((s, v) => s + v, 0) / rrs.length : 0;
        const lots = closed.map(t => t.lot_size);
        const avgLot = lots.length ? lots.reduce((s, v) => s + v, 0) / lots.length : 0;
        const maxLot = lots.length ? Math.max(...lots) : 0;
        // Consecutive loss calculation
        return { avgRR, avgLot, maxLot, recovery: metrics?.maxDrawdown || 0 };
    }, [closed, metrics]);

    /* ── 9. Order Type Win Rates ── */
    const orderTypeStats = useMemo(() => {
        const buys = closed.filter(t => t.order_type === 'Buy');
        const sells = closed.filter(t => t.order_type === 'Sell');
        const buyWins = buys.filter(t => (t.profit_loss_usd || 0) > 0).length;
        const sellWins = sells.filter(t => (t.profit_loss_usd || 0) > 0).length;
        return {
            buyWinRate: buys.length ? (buyWins / buys.length) * 100 : 0,
            sellWinRate: sells.length ? (sellWins / sells.length) * 100 : 0,
            buyPL: buys.reduce((s, t) => s + (t.profit_loss_usd || 0), 0),
            sellPL: sells.reduce((s, t) => s + (t.profit_loss_usd || 0), 0),
            buyCount: buys.length, sellCount: sells.length
        };
    }, [closed]);

    /* ── 10. Asset Type Breakdown ── */
    const assetStats = useMemo(() => {
        const map: Record<string, { wins: number; total: number; pl: number }> = {};
        closed.forEach(t => {
            const a = t.asset_type || 'other';
            if (!map[a]) map[a] = { wins: 0, total: 0, pl: 0 };
            map[a].total++;
            map[a].pl += t.profit_loss_usd || 0;
            if ((t.profit_loss_usd || 0) > 0) map[a].wins++;
        });
        return Object.entries(map).sort(([, a], [, b]) => b.pl - a.pl);
    }, [closed]);

    /* ── 11. Top 5 / Bottom 5 trades ── */
    const topTrades = useMemo(() => {
        const sorted = [...closed].filter(t => t.profit_loss_usd != null).sort((a, b) => (b.profit_loss_usd || 0) - (a.profit_loss_usd || 0));
        return { top5: sorted.slice(0, 5), bottom5: sorted.slice(-5).reverse() };
    }, [closed]);

    /* ── 12. Rolling Performance (7d, 30d) ── */
    const rollingPerf = useMemo(() => {
        const now = Date.now();
        const d7 = closed.filter(t => now - new Date(t.exit_time || t.entry_time).getTime() < 7 * 86400000);
        const d30 = closed.filter(t => now - new Date(t.exit_time || t.entry_time).getTime() < 30 * 86400000);
        const calc = (arr: Trade[]) => {
            const pl = arr.reduce((s, t) => s + (t.profit_loss_usd || 0), 0);
            const wins = arr.filter(t => (t.profit_loss_usd || 0) > 0).length;
            return { pl, trades: arr.length, winRate: arr.length ? (wins / arr.length) * 100 : 0 };
        };
        return { d7: calc(d7), d30: calc(d30) };
    }, [closed]);

    /* ── 13. Market Trend Performance ── */
    const trendPerf = useMemo(() => {
        const map: Record<string, { wins: number; total: number; pl: number }> = {};
        closed.forEach(t => {
            const trend = t.market_trend || 'Unknown';
            if (!map[trend]) map[trend] = { wins: 0, total: 0, pl: 0 };
            map[trend].total++;
            map[trend].pl += t.profit_loss_usd || 0;
            if ((t.profit_loss_usd || 0) > 0) map[trend].wins++;
        });
        return Object.entries(map).sort(([, a], [, b]) => b.pl - a.pl);
    }, [closed]);

    /* ── 14. Consistency Score ── */
    const consistency = useMemo(() => {
        if (!closed.length) return 0;
        const winRate = stats.win_rate / 100;
        const pf = Math.min(stats.profit_factor, 3) / 3;
        const streakScore = Math.min(streaks.bestWin, 10) / 10;
        const tradeCount = Math.min(closed.length, 100) / 100;
        return ((winRate * 30) + (pf * 30) + (streakScore * 20) + (tradeCount * 20));
    }, [closed, stats, streaks]);

    /* ── 15. PnL Distribution ── */
    const pnlDistribution = useMemo(() => {
        const pnls = closed.map(t => t.profit_loss_usd || 0).filter(v => v !== 0);
        if (!pnls.length) return [];
        const min = Math.min(...pnls);
        const max = Math.max(...pnls);
        const range = max - min || 1;
        const buckets = 8;
        const size = range / buckets;
        const dist = Array.from({ length: buckets }, (_, i) => ({
            range: `${(min + i * size).toFixed(0)}`,
            count: 0,
            from: min + i * size,
            to: min + (i + 1) * size
        }));
        pnls.forEach(v => {
            const idx = Math.min(Math.floor((v - min) / size), buckets - 1);
            dist[idx].count++;
        });
        return dist;
    }, [closed]);

    const formatDuration = (mins: number) => {
        if (mins < 60) return `${mins.toFixed(0)}m`;
        if (mins < 1440) return `${(mins / 60).toFixed(1)}h`;
        return `${(mins / 1440).toFixed(1)}d`;
    };

    // Calendar: get last 90 days 
    const last90 = useMemo(() => {
        const days: { date: string; pl: number; count: number }[] = [];
        const now = new Date();
        for (let i = 89; i >= 0; i--) {
            const d = new Date(now); d.setDate(d.getDate() - i);
            const ds = d.toISOString().split('T')[0];
            const entry = calendarData[ds];
            days.push({ date: ds, pl: entry?.pl || 0, count: entry?.count || 0 });
        }
        return days;
    }, [calendarData]);

    // Peak hourly activity
    const peakHour = useMemo(() => {
        const best = hourlyData.reduce((a, b) => b.count > a.count ? b : a, hourlyData[0]);
        return best;
    }, [hourlyData]);

    return (
        <div className="space-y-3 sm:space-y-4">

            {/* ━━━ ROW 1: Rolling Performance + Consistency ━━━ */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 sm:gap-3">
                {/* 7-Day Performance */}
                <Widget>
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-medium text-[var(--text-tertiary)] uppercase tracking-wider">Last 7 Days</span>
                        <Zap className="w-4 h-4 text-amber-400" />
                    </div>
                    <div className={`text-2xl font-bold ${rollingPerf.d7.pl >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>{fmtUsd(rollingPerf.d7.pl)}</div>
                    <div className="flex gap-3 mt-1 text-xs text-[var(--text-tertiary)]">
                        <span>{rollingPerf.d7.trades} trades</span>
                        <span>{pct(rollingPerf.d7.winRate)} WR</span>
                    </div>
                </Widget>

                {/* 30-Day Performance */}
                <Widget>
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-medium text-[var(--text-tertiary)] uppercase tracking-wider">Last 30 Days</span>
                        <Activity className="w-4 h-4 text-blue-400" />
                    </div>
                    <div className={`text-2xl font-bold ${rollingPerf.d30.pl >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>{fmtUsd(rollingPerf.d30.pl)}</div>
                    <div className="flex gap-3 mt-1 text-xs text-[var(--text-tertiary)]">
                        <span>{rollingPerf.d30.trades} trades</span>
                        <span>{pct(rollingPerf.d30.winRate)} WR</span>
                    </div>
                </Widget>

                {/* Consistency Score */}
                <Widget>
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-medium text-[var(--text-tertiary)] uppercase tracking-wider">Consistency Score</span>
                        <Target className="w-4 h-4 text-purple-400" />
                    </div>
                    <div className="flex items-end gap-2">
                        <span className={`text-3xl font-bold ${consistency >= 60 ? 'text-emerald-400' : consistency >= 35 ? 'text-amber-400' : 'text-red-400'}`}>{consistency.toFixed(0)}</span>
                        <span className="text-sm text-[var(--text-tertiary)] mb-1">/100</span>
                    </div>
                    <div className="w-full bg-[var(--bg-primary)] rounded-full h-1.5 mt-2">
                        <div className={`h-1.5 rounded-full transition-all ${consistency >= 60 ? 'bg-emerald-400' : consistency >= 35 ? 'bg-amber-400' : 'bg-red-400'}`} style={{ width: `${consistency}%` }} />
                    </div>
                </Widget>
            </div>

            {/* ━━━ ROW 2: Streak + Best/Worst Day ━━━ */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
                {/* Current Streak */}
                <Widget>
                    <div className="flex items-center gap-2 mb-1">
                        <Flame className={`w-4 h-4 ${streaks.currentType === 'win' ? 'text-emerald-400' : 'text-red-400'}`} />
                        <span className="text-xs text-[var(--text-tertiary)]">Current Streak</span>
                    </div>
                    <div className={`text-2xl font-bold ${streaks.currentType === 'win' ? 'text-emerald-400' : 'text-red-400'}`}>
                        {streaks.currentWin > 0 ? `${streaks.currentWin}W` : `${streaks.worstLoss}L`}
                    </div>
                </Widget>

                {/* Best Streak */}
                <Widget>
                    <div className="flex items-center gap-2 mb-1">
                        <Trophy className="w-4 h-4 text-amber-400" />
                        <span className="text-xs text-[var(--text-tertiary)]">Best Win Streak</span>
                    </div>
                    <div className="text-2xl font-bold text-amber-400">{streaks.bestWin}</div>
                </Widget>

                {/* Best Day */}
                <Widget>
                    <div className="flex items-center gap-2 mb-1">
                        <ArrowUpRight className="w-4 h-4 text-emerald-400" />
                        <span className="text-xs text-[var(--text-tertiary)]">Best Day</span>
                    </div>
                    <div className="text-lg font-bold text-emerald-400">{fmtUsd(bestWorstDay.best.pl)}</div>
                    <div className="text-[10px] text-[var(--text-tertiary)]">{bestWorstDay.best.date}</div>
                </Widget>

                {/* Worst Day */}
                <Widget>
                    <div className="flex items-center gap-2 mb-1">
                        <ArrowDownRight className="w-4 h-4 text-red-400" />
                        <span className="text-xs text-[var(--text-tertiary)]">Worst Day</span>
                    </div>
                    <div className="text-lg font-bold text-red-400">{fmtUsd(bestWorstDay.worst.pl)}</div>
                    <div className="text-[10px] text-[var(--text-tertiary)]">{bestWorstDay.worst.date}</div>
                </Widget>
            </div>

            {/* ━━━ ROW 3: Calendar Heatmap (90 days) ━━━ */}
            <WidgetLg title="Trading Activity — Last 90 Days" icon={<Calendar className="w-4 h-4 text-blue-400" />}>
                <div className="flex flex-wrap gap-[2px] sm:gap-[3px]">
                    {last90.map(d => {
                        const intensity = d.count === 0 ? 'bg-[var(--bg-primary)]' :
                            d.pl > 50 ? 'bg-emerald-500' : d.pl > 0 ? 'bg-emerald-500/50' :
                                d.pl < -50 ? 'bg-red-500' : d.pl < 0 ? 'bg-red-500/50' : 'bg-gray-500/30';
                        return (
                            <div key={d.date} className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-[2px] ${intensity} cursor-pointer transition-transform hover:scale-150`}
                                title={`${d.date}: ${d.count} trades, ${fmtUsd(d.pl)}`} />
                        );
                    })}
                </div>
                <div className="flex items-center gap-1.5 mt-2 text-[10px] text-[var(--text-tertiary)]">
                    <span>Less</span>
                    <div className="w-2.5 h-2.5 rounded-[2px] bg-red-500" /> <div className="w-2.5 h-2.5 rounded-[2px] bg-red-500/50" />
                    <div className="w-2.5 h-2.5 rounded-[2px] bg-[var(--bg-primary)]" />
                    <div className="w-2.5 h-2.5 rounded-[2px] bg-emerald-500/50" /> <div className="w-2.5 h-2.5 rounded-[2px] bg-emerald-500" />
                    <span>More</span>
                </div>
            </WidgetLg>

            {/* ━━━ ROW 4: Long/Short + Duration + Hourly ━━━ */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 sm:gap-3">
                {/* Buy vs Sell Performance */}
                <Widget>
                    <span className="text-xs font-medium text-[var(--text-tertiary)] uppercase tracking-wider mb-2 block">Long vs Short</span>
                    <div className="space-y-2">
                        <div>
                            <div className="flex justify-between text-xs mb-0.5">
                                <span className="text-emerald-400">LONG ({orderTypeStats.buyCount})</span>
                                <span className="text-[var(--text-secondary)]">{pct(orderTypeStats.buyWinRate)} WR</span>
                            </div>
                            <div className="w-full bg-[var(--bg-primary)] rounded-full h-1.5">
                                <div className="h-1.5 rounded-full bg-emerald-400 transition-all" style={{ width: `${orderTypeStats.buyWinRate}%` }} />
                            </div>
                            <div className={`text-xs mt-0.5 ${orderTypeStats.buyPL >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>{fmtUsd(orderTypeStats.buyPL)}</div>
                        </div>
                        <div>
                            <div className="flex justify-between text-xs mb-0.5">
                                <span className="text-red-400">SHORT ({orderTypeStats.sellCount})</span>
                                <span className="text-[var(--text-secondary)]">{pct(orderTypeStats.sellWinRate)} WR</span>
                            </div>
                            <div className="w-full bg-[var(--bg-primary)] rounded-full h-1.5">
                                <div className="h-1.5 rounded-full bg-red-400 transition-all" style={{ width: `${orderTypeStats.sellWinRate}%` }} />
                            </div>
                            <div className={`text-xs mt-0.5 ${orderTypeStats.sellPL >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>{fmtUsd(orderTypeStats.sellPL)}</div>
                        </div>
                    </div>
                </Widget>

                {/* Trade Duration */}
                <Widget>
                    <span className="text-xs font-medium text-[var(--text-tertiary)] uppercase tracking-wider mb-2 block">Trade Duration</span>
                    <div className="grid grid-cols-2 gap-2">
                        <MiniStat label="Average" value={formatDuration(durationStats.avg)} />
                        <MiniStat label="Shortest" value={formatDuration(durationStats.shortest)} />
                        <MiniStat label="Longest" value={formatDuration(durationStats.longest)} />
                        <MiniStat label="Best (Wins)" value={formatDuration(durationStats.bestDuration)} color="text-emerald-400" />
                    </div>
                </Widget>

                {/* Peak Trading Time */}
                <Widget>
                    <span className="text-xs font-medium text-[var(--text-tertiary)] uppercase tracking-wider mb-2 block">Peak Activity</span>
                    <div className="text-center">
                        <div className="text-3xl font-bold text-blue-400">{peakHour?.hour?.toString().padStart(2, '0')}:00</div>
                        <div className="text-xs text-[var(--text-tertiary)] mt-1">{peakHour?.count || 0} trades at this hour</div>
                        <div className={`text-sm font-medium mt-1 ${(peakHour?.pl || 0) >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>{fmtUsd(peakHour?.pl || 0)} total</div>
                    </div>
                </Widget>
            </div>

            {/* ━━━ ROW 5: Day of Week Performance ━━━ */}
            <WidgetLg title="Performance by Day of Week" icon={<Calendar className="w-4 h-4 text-purple-400" />}>
                <div className="grid grid-cols-7 gap-1 sm:gap-2">
                    {dayOfWeekData.map(d => (
                        <div key={d.day} className="text-center">
                            <div className="text-[10px] text-[var(--text-tertiary)] mb-1">{d.day}</div>
                            <div className="relative">
                                <div className={`h-12 sm:h-16 rounded-md flex items-end justify-center ${d.total === 0 ? 'bg-[var(--bg-primary)]' : d.winRate >= 50 ? 'bg-emerald-500/15' : 'bg-red-500/15'}`}>
                                    <div className={`w-full rounded-md ${d.winRate >= 50 ? 'bg-emerald-500/40' : 'bg-red-500/40'}`}
                                        style={{ height: `${d.total > 0 ? Math.max(d.winRate, 10) : 0}%` }} />
                                </div>
                            </div>
                            <div className="text-[10px] font-medium mt-1">
                                <span className={d.winRate >= 50 ? 'text-emerald-400' : d.total > 0 ? 'text-red-400' : 'text-[var(--text-tertiary)]'}>{d.total > 0 ? pct(d.winRate) : '—'}</span>
                            </div>
                            <div className={`text-[9px] ${d.pl >= 0 ? 'text-emerald-400/70' : 'text-red-400/70'}`}>{d.total > 0 ? fmtUsd(d.pl) : ''}</div>
                        </div>
                    ))}
                </div>
            </WidgetLg>

            {/* ━━━ ROW 6: Monthly Breakdown + Asset Type ━━━ */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 sm:gap-3">
                {/* Monthly Performance */}
                <WidgetLg title="Monthly Performance" icon={<BarChart3 className="w-4 h-4 text-cyan-400" />}>
                    {monthlyData.length === 0 ? (
                        <div className="text-sm text-[var(--text-tertiary)] py-4 text-center">No monthly data yet</div>
                    ) : (
                        <div className="space-y-2">
                            {monthlyData.map(([month, d]) => (
                                <div key={month} className="flex items-center gap-2 sm:gap-3">
                                    <span className="text-[10px] sm:text-xs text-[var(--text-secondary)] w-14 sm:w-16 shrink-0">{month}</span>
                                    <div className="flex-1 flex items-center gap-2">
                                        <div className="flex-1 bg-[var(--bg-primary)] rounded-full h-2 relative overflow-hidden">
                                            <div className={`h-2 rounded-full ${d.pl >= 0 ? 'bg-emerald-500' : 'bg-red-500'}`}
                                                style={{ width: `${Math.min(Math.abs(d.pl) / (Math.max(...monthlyData.map(([, x]) => Math.abs(x.pl))) || 1) * 100, 100)}%` }} />
                                        </div>
                                        <span className={`text-[10px] sm:text-xs font-mono w-16 sm:w-20 text-right ${d.pl >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>{fmtUsd(d.pl)}</span>
                                    </div>
                                    <span className="text-[10px] text-[var(--text-tertiary)] w-12 text-right">{d.trades} tr</span>
                                </div>
                            ))}
                        </div>
                    )}
                </WidgetLg>

                {/* Asset Type Breakdown */}
                <WidgetLg title="Performance by Asset Type" icon={<TrendingUp className="w-4 h-4 text-amber-400" />}>
                    {assetStats.length === 0 ? (
                        <div className="text-sm text-[var(--text-tertiary)] py-4 text-center">No asset data yet</div>
                    ) : (
                        <div className="space-y-2">
                            {assetStats.map(([asset, d]) => (
                                <div key={asset} className="flex items-center gap-2 sm:gap-3 bg-[var(--bg-primary)] rounded-lg px-2 sm:px-3 py-2">
                                    <span className="text-xs font-medium text-[var(--text-primary)] capitalize w-16 shrink-0">{asset}</span>
                                    <div className="flex-1 text-xs text-[var(--text-tertiary)]">{d.total} trades</div>
                                    <span className={`text-xs font-medium ${d.total > 0 ? ((d.wins / d.total) * 100 >= 50 ? 'text-emerald-400' : 'text-red-400') : 'text-[var(--text-tertiary)]'}`}>
                                        {d.total > 0 ? pct((d.wins / d.total) * 100) : '—'} WR
                                    </span>
                                    <span className={`text-xs font-mono ${d.pl >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>{fmtUsd(d.pl)}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </WidgetLg>
            </div>

            {/* ━━━ ROW 7: Risk Metrics + Market Trend ━━━ */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
                <Widget>
                    <div className="flex items-center gap-2 mb-1">
                        <AlertTriangle className="w-4 h-4 text-amber-400" />
                        <span className="text-xs text-[var(--text-tertiary)]">Avg R:R</span>
                    </div>
                    <div className="text-2xl font-bold text-[var(--text-primary)]">1:{fmt(riskMetrics.avgRR, 1)}</div>
                </Widget>
                <Widget>
                    <div className="flex items-center gap-2 mb-1">
                        <DollarSign className="w-4 h-4 text-blue-400" />
                        <span className="text-xs text-[var(--text-tertiary)]">Avg Position</span>
                    </div>
                    <div className="text-2xl font-bold text-[var(--text-primary)]">{fmt(riskMetrics.avgLot, 2)}</div>
                    <div className="text-[10px] text-[var(--text-tertiary)]">Max: {fmt(riskMetrics.maxLot, 2)}</div>
                </Widget>
                <Widget>
                    <div className="flex items-center gap-2 mb-1">
                        <Percent className="w-4 h-4 text-emerald-400" />
                        <span className="text-xs text-[var(--text-tertiary)]">Max Drawdown</span>
                    </div>
                    <div className="text-2xl font-bold text-red-400">{pct(riskMetrics.recovery)}</div>
                </Widget>
                <Widget>
                    <div className="flex items-center gap-2 mb-1">
                        <Timer className="w-4 h-4 text-cyan-400" />
                        <span className="text-xs text-[var(--text-tertiary)]">Expectancy</span>
                    </div>
                    <div className={`text-2xl font-bold ${(metrics?.expectancy || 0) >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>${fmt(metrics?.expectancy || 0)}</div>
                </Widget>
            </div>

            {/* ━━━ ROW 8: P&L Distribution Histogram ━━━ */}
            {pnlDistribution.length > 0 && (
                <WidgetLg title="P&L Distribution" icon={<BarChart3 className="w-4 h-4 text-indigo-400" />}>
                    <div className="flex items-end gap-1 h-24">
                        {pnlDistribution.map((bucket, i) => {
                            const maxCount = Math.max(...pnlDistribution.map(b => b.count));
                            const height = maxCount > 0 ? (bucket.count / maxCount) * 100 : 0;
                            const isNeg = bucket.from < 0 && bucket.to <= 0;
                            return (
                                <div key={i} className="flex-1 flex flex-col items-center justify-end h-full">
                                    <div className="text-[8px] text-[var(--text-tertiary)] mb-0.5">{bucket.count}</div>
                                    <div className={`w-full rounded-t ${isNeg ? 'bg-red-500/60' : 'bg-emerald-500/60'}`}
                                        style={{ height: `${Math.max(height, 2)}%` }} />
                                    <div className="text-[8px] text-[var(--text-tertiary)] mt-0.5">${bucket.range}</div>
                                </div>
                            );
                        })}
                    </div>
                </WidgetLg>
            )}

            {/* ━━━ ROW 9: Market Trend Performance ━━━ */}
            {trendPerf.length > 0 && (
                <WidgetLg title="Performance by Market Trend" icon={<TrendingUp className="w-4 h-4 text-emerald-400" />}>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        {trendPerf.map(([trend, d]) => (
                            <div key={trend} className="bg-[var(--bg-primary)] rounded-lg px-3 py-2 text-center">
                                <div className="text-xs text-[var(--text-tertiary)] capitalize">{trend}</div>
                                <div className={`text-sm font-bold mt-0.5 ${d.pl >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>{fmtUsd(d.pl)}</div>
                                <div className="text-[10px] text-[var(--text-tertiary)]">{d.total > 0 ? pct((d.wins / d.total) * 100) : '—'} WR · {d.total} trades</div>
                            </div>
                        ))}
                    </div>
                </WidgetLg>
            )}

            {/* ━━━ ROW 10: Top & Bottom Trades ━━━ */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 sm:gap-3">
                <WidgetLg title="Top 5 Trades" icon={<Trophy className="w-4 h-4 text-amber-400" />}>
                    <div className="space-y-1.5">
                        {topTrades.top5.map((t, i) => (
                            <div key={t.id} className="flex items-center gap-2 bg-[var(--bg-primary)] rounded-md px-2.5 py-1.5">
                                <span className="w-5 text-center text-xs font-bold text-amber-400">#{i + 1}</span>
                                <span className="text-xs font-medium text-[var(--text-primary)] flex-1">{t.pair_ticker}</span>
                                <span className="text-[10px] text-[var(--text-tertiary)]">{t.strategy || ''}</span>
                                <span className="text-xs font-bold text-emerald-400">{fmtUsd(t.profit_loss_usd || 0)}</span>
                            </div>
                        ))}
                    </div>
                </WidgetLg>

                <WidgetLg title="Bottom 5 Trades" icon={<AlertTriangle className="w-4 h-4 text-red-400" />}>
                    <div className="space-y-1.5">
                        {topTrades.bottom5.map((t, i) => (
                            <div key={t.id} className="flex items-center gap-2 bg-[var(--bg-primary)] rounded-md px-2.5 py-1.5">
                                <span className="w-5 text-center text-xs font-bold text-red-400">#{i + 1}</span>
                                <span className="text-xs font-medium text-[var(--text-primary)] flex-1">{t.pair_ticker}</span>
                                <span className="text-[10px] text-[var(--text-tertiary)]">{t.strategy || ''}</span>
                                <span className="text-xs font-bold text-red-400">{fmtUsd(t.profit_loss_usd || 0)}</span>
                            </div>
                        ))}
                    </div>
                </WidgetLg>
            </div>

            {/* ━━━ ROW 11: Hourly Heatmap ━━━ */}
            <WidgetLg title="Trading Activity by Hour" icon={<Clock className="w-4 h-4 text-cyan-400" />}>
                <div className="flex items-end gap-[1px] sm:gap-[2px] h-16 sm:h-20">
                    {hourlyData.map(h => {
                        const maxCount = Math.max(...hourlyData.map(x => x.count));
                        const height = maxCount > 0 ? (h.count / maxCount) * 100 : 0;
                        return (
                            <div key={h.hour} className="flex-1 flex flex-col items-center justify-end h-full group">
                                <div className="text-[7px] text-[var(--text-tertiary)] opacity-0 group-hover:opacity-100 transition-opacity">{h.count}</div>
                                <div className={`w-full rounded-t transition-all group-hover:opacity-100 ${h.pl >= 0 ? 'bg-emerald-500/50 group-hover:bg-emerald-500' : 'bg-red-500/50 group-hover:bg-red-500'}`}
                                    style={{ height: `${Math.max(height, 2)}%`, opacity: 0.4 + (height / 100) * 0.6 }}
                                    title={`${h.hour}:00 — ${h.count} trades, ${fmtUsd(h.pl)}`} />
                                {h.hour % 3 === 0 && <div className="text-[8px] text-[var(--text-tertiary)] mt-0.5">{h.hour}</div>}
                            </div>
                        );
                    })}
                </div>
            </WidgetLg>

        </div>
    );
}

/* ─── Widget Primitives ─── */
function Widget({ children }: { children: React.ReactNode }) {
    return (
        <div className="bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-xl p-3 hover:border-[var(--border-hover)] transition-colors">
            {children}
        </div>
    );
}

function WidgetLg({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
    return (
        <div className="bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-xl p-3 sm:p-4 hover:border-[var(--border-hover)] transition-colors">
            <div className="flex items-center gap-2 mb-3">
                {icon}
                <h3 className="text-sm font-medium text-[var(--text-secondary)]">{title}</h3>
            </div>
            {children}
        </div>
    );
}

function MiniStat({ label, value, color }: { label: string; value: string; color?: string }) {
    return (
        <div className="bg-[var(--bg-primary)] rounded-md px-2 py-1.5">
            <div className="text-[10px] text-[var(--text-tertiary)]">{label}</div>
            <div className={`text-sm font-bold ${color || 'text-[var(--text-primary)]'}`}>{value}</div>
        </div>
    );
}
