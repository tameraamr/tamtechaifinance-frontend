'use client';

import React from 'react';
import { TrendingUp, TrendingDown, BarChart3, Target, DollarSign, Activity } from 'lucide-react';

interface JournalStats {
    total_trades: number;
    open_trades: number;
    closed_trades: number;
    wins: number;
    losses: number;
    breakeven: number;
    win_rate: number;
    total_pips: number;
    total_profit_usd: number;
    net_profit_usd: number;
    profit_factor: number;
    average_win_pips: number;
    average_loss_pips: number;
    largest_win_usd: number;
    largest_loss_usd: number;
    trades_remaining_free: number;
}

interface AdvancedMetrics {
    sharpeRatio: number;
    maxDrawdown: number;
    expectancy: number;
    maxWinStreak: number;
    maxLossStreak: number;
    avgWin: number;
    avgLoss: number;
}

export default function JournalStatCards({ stats, metrics }: { stats: JournalStats; metrics: AdvancedMetrics | null }) {
    const primary = [
        {
            label: 'Net Profit',
            value: `$${stats.net_profit_usd.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
            icon: DollarSign,
            positive: stats.net_profit_usd >= 0,
            sub: `${stats.total_pips >= 0 ? '+' : ''}${stats.total_pips.toFixed(1)} pips`,
        },
        {
            label: 'Win Rate',
            value: `${stats.win_rate.toFixed(1)}%`,
            icon: Target,
            positive: stats.win_rate >= 50,
            sub: `${stats.wins}W / ${stats.losses}L`,
        },
        {
            label: 'Total Trades',
            value: stats.total_trades.toString(),
            icon: BarChart3,
            positive: true,
            sub: `${stats.open_trades} open · ${stats.closed_trades} closed`,
        },
        {
            label: 'Profit Factor',
            value: stats.profit_factor.toFixed(2),
            icon: Activity,
            positive: stats.profit_factor >= 1,
            sub: `Avg W: ${stats.average_win_pips.toFixed(1)} · L: ${stats.average_loss_pips.toFixed(1)}`,
        },
    ];

    const secondary = metrics ? [
        { label: 'Sharpe Ratio', value: metrics.sharpeRatio.toFixed(2) },
        { label: 'Max Drawdown', value: `$${metrics.maxDrawdown.toFixed(2)}` },
        { label: 'Expectancy', value: `$${metrics.expectancy.toFixed(2)}` },
        { label: 'Best Streak', value: `${metrics.maxWinStreak}W` },
        { label: 'Worst Streak', value: `${metrics.maxLossStreak}L` },
        { label: 'Avg Win', value: `$${metrics.avgWin.toFixed(2)}` },
        { label: 'Avg Loss', value: `$${metrics.avgLoss.toFixed(2)}` },
        { label: 'Largest Win', value: `$${stats.largest_win_usd.toFixed(2)}` },
    ] : [];

    return (
        <div className="space-y-4">
            {/* Primary stat cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                {primary.map((s) => {
                    const Icon = s.icon;
                    return (
                        <div key={s.label} className="bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-xl p-4 hover:border-[var(--border-hover)] transition-colors">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-xs font-medium text-[var(--text-tertiary)] uppercase tracking-wide">{s.label}</span>
                                <Icon className="w-4 h-4 text-[var(--text-tertiary)]" />
                            </div>
                            <div className={`text-xl font-bold ${s.positive ? 'text-emerald-400' : 'text-red-400'}`}>
                                {s.value}
                            </div>
                            <div className="text-xs text-[var(--text-tertiary)] mt-1">{s.sub}</div>
                        </div>
                    );
                })}
            </div>

            {/* Secondary metrics row */}
            {secondary.length > 0 && (
                <div className="flex flex-wrap gap-3">
                    {secondary.map((m) => (
                        <div key={m.label} className="bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-lg px-3 py-2 text-center min-w-[100px]">
                            <div className="text-xs text-[var(--text-tertiary)]">{m.label}</div>
                            <div className="text-sm font-semibold text-[var(--text-primary)] mt-0.5">{m.value}</div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
