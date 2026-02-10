'use client';

import React from 'react';
import ReactECharts from 'echarts-for-react';
import * as echarts from 'echarts';

/* ─── Types ─── */
interface ProfitCurvePoint { date: string; profit: number; trade: string; }
interface PairPerformance { pair: string; profit: number; trades: number; }
interface SessionPerformance { session: string; winRate: number; profit: number; total: number; }
interface AdvancedMetrics {
    sharpeRatio: number; maxDrawdown: number; expectancy: number;
    maxWinStreak: number; maxLossStreak: number; avgWin: number; avgLoss: number;
}

const THEME = {
    bg: 'transparent',
    grid: 'rgba(255,255,255,0.04)',
    text: 'rgba(255,255,255,0.45)',
    textLight: 'rgba(255,255,255,0.7)',
    border: 'rgba(255,255,255,0.08)',
    green: '#10b981',
    red: '#ef4444',
    blue: '#3b82f6',
    purple: '#8b5cf6',
    amber: '#f59e0b',
    cyan: '#06b6d4',
};

const tooltipStyle = {
    backgroundColor: 'rgba(15,15,20,0.95)',
    borderColor: 'rgba(255,255,255,0.1)',
    borderWidth: 1,
    textStyle: { color: '#fff', fontSize: 12 },
    padding: [8, 12],
};

/* ═══════════ 1. EQUITY CURVE ═══════════ */
export function EquityCurve({ data }: { data: ProfitCurvePoint[] }) {
    if (!data.length) return <Empty label="Add trades to see your equity curve" />;
    const isUp = data[data.length - 1]?.profit >= 0;
    const color = isUp ? THEME.green : THEME.red;

    return (
        <ReactECharts style={{ height: 340 }} option={{
            backgroundColor: THEME.bg,
            grid: { top: 30, right: 16, bottom: 30, left: 55, containLabel: false },
            xAxis: { type: 'category', data: data.map(d => d.date), axisLine: { show: false }, axisTick: { show: false }, axisLabel: { color: THEME.text, fontSize: 10 }, splitLine: { show: false } },
            yAxis: { type: 'value', axisLine: { show: false }, axisTick: { show: false }, axisLabel: { color: THEME.text, fontSize: 10, formatter: (v: number) => `$${v}` }, splitLine: { lineStyle: { color: THEME.grid } } },
            tooltip: { ...tooltipStyle, trigger: 'axis', formatter: (p: any) => { const d = p[0]; return `<div style="font-weight:600">${d.axisValue}</div><div style="color:${color};margin-top:2px">P&L: $${d.value?.toLocaleString()}</div>`; } },
            series: [{
                data: data.map(d => d.profit), type: 'line', smooth: true, symbol: 'none', showSymbol: false,
                lineStyle: { color, width: 2.5 },
                areaStyle: { color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{ offset: 0, color: color + '30' }, { offset: 1, color: color + '05' }]) },
                emphasis: { disabled: true },
            }],
        }} />
    );
}

/* ═══════════ 2. PERFORMANCE BY PAIR ═══════════ */
export function PairPerformanceChart({ data }: { data: PairPerformance[] }) {
    if (!data.length) return <Empty label="No pair data yet" />;
    return (
        <ReactECharts style={{ height: 340 }} option={{
            backgroundColor: THEME.bg,
            grid: { top: 20, right: 16, bottom: 30, left: 55, containLabel: false },
            xAxis: { type: 'category', data: data.map(d => d.pair), axisLine: { show: false }, axisTick: { show: false }, axisLabel: { color: THEME.text, fontSize: 10, rotate: data.length > 6 ? 30 : 0 } },
            yAxis: { type: 'value', axisLine: { show: false }, axisTick: { show: false }, axisLabel: { color: THEME.text, fontSize: 10, formatter: (v: number) => `$${v}` }, splitLine: { lineStyle: { color: THEME.grid } } },
            tooltip: { ...tooltipStyle, trigger: 'axis', formatter: (p: any) => { const d = p[0]; return `<div style="font-weight:600">${d.axisValue}</div><div style="color:${d.value >= 0 ? THEME.green : THEME.red};margin-top:2px">$${d.value?.toFixed(2)}</div>`; } },
            series: [{ data: data.map(d => ({ value: d.profit, itemStyle: { color: d.profit >= 0 ? THEME.green : THEME.red, borderRadius: [4, 4, 0, 0] } })), type: 'bar', barMaxWidth: 36 }],
        }} />
    );
}

/* ═══════════ 3. WIN/LOSS DONUT ═══════════ */
export function WinLossPie({ wins, losses, breakeven }: { wins: number; losses: number; breakeven: number }) {
    const total = wins + losses + breakeven;
    if (!total) return <Empty label="No trade results yet" />;
    const data = [
        { name: 'Wins', value: wins, itemStyle: { color: THEME.green } },
        { name: 'Losses', value: losses, itemStyle: { color: THEME.red } },
        ...(breakeven > 0 ? [{ name: 'Breakeven', value: breakeven, itemStyle: { color: '#6b7280' } }] : []),
    ].filter(d => d.value > 0);

    return (
        <ReactECharts style={{ height: 280 }} option={{
            backgroundColor: THEME.bg,
            tooltip: { ...tooltipStyle, formatter: (p: any) => `<div style="font-weight:600">${p.name}</div><div>${p.value} trades (${((p.value / total) * 100).toFixed(1)}%)</div>` },
            legend: { bottom: 0, textStyle: { color: THEME.textLight, fontSize: 11 }, itemWidth: 10, itemHeight: 10 },
            series: [{
                type: 'pie', radius: ['48%', '72%'], center: ['50%', '45%'],
                data, label: {
                    show: true, position: 'center', formatter: `{a|${wins}W / ${losses}L}\n{b|${total} total}`,
                    rich: { a: { fontSize: 16, fontWeight: 'bold', color: '#fff', lineHeight: 26 }, b: { fontSize: 11, color: THEME.text, lineHeight: 20 } }
                },
                itemStyle: { borderColor: 'rgba(0,0,0,0.3)', borderWidth: 2 }, emphasis: { scale: true, scaleSize: 4 },
            }],
        }} />
    );
}

/* ═══════════ 4. SESSION PERFORMANCE ═══════════ */
export function SessionChart({ data }: { data: SessionPerformance[] }) {
    const filtered = data.filter(d => d.total > 0);
    if (!filtered.length) return <Empty label="Log trades with sessions to see performance" />;
    return (
        <ReactECharts style={{ height: 240 }} option={{
            backgroundColor: THEME.bg,
            grid: { top: 10, right: 30, bottom: 10, left: 10, containLabel: true },
            xAxis: { type: 'value', max: 100, axisLine: { show: false }, axisTick: { show: false }, axisLabel: { color: THEME.text, fontSize: 10, formatter: '{value}%' }, splitLine: { lineStyle: { color: THEME.grid } } },
            yAxis: { type: 'category', data: filtered.map(d => d.session), axisLine: { show: false }, axisTick: { show: false }, axisLabel: { color: THEME.textLight, fontSize: 11 } },
            tooltip: { ...tooltipStyle, formatter: (p: any) => `<div style="font-weight:600">${p.name}</div><div>Win Rate: ${p.value.toFixed(1)}%</div>` },
            series: [{ type: 'bar', data: filtered.map(d => ({ value: d.winRate, itemStyle: { color: d.winRate >= 50 ? THEME.green : d.winRate >= 30 ? THEME.amber : THEME.red, borderRadius: [0, 4, 4, 0] } })), barMaxWidth: 22 }],
        }} />
    );
}

/* ═══════════ 5. RISK RADAR ═══════════ */
export function RiskRadar({ metrics, stats }: { metrics: AdvancedMetrics | null; stats: { win_rate: number; profit_factor: number } }) {
    if (!metrics) return <Empty label="Need more trades for risk analysis" />;
    const indicators = [
        { name: 'Sharpe', max: 100 }, { name: 'Win Rate', max: 100 }, { name: 'P. Factor', max: 100 },
        { name: 'Expectancy', max: 100 }, { name: 'Win Streak', max: 100 }, { name: 'Discipline', max: 100 },
    ];
    const values = [
        Math.min(Math.max(metrics.sharpeRatio * 33 + 50, 0), 100), stats.win_rate,
        Math.min(stats.profit_factor * 20, 100), Math.min(Math.max(metrics.expectancy + 50, 0), 100),
        Math.min(metrics.maxWinStreak * 10, 100), Math.max(100 - metrics.maxLossStreak * 15, 0),
    ];
    return (
        <ReactECharts style={{ height: 300 }} option={{
            backgroundColor: THEME.bg,
            radar: { indicator: indicators, axisName: { color: THEME.textLight, fontSize: 10 }, splitArea: { areaStyle: { color: ['rgba(255,255,255,0.02)', 'rgba(255,255,255,0.04)'] } }, splitLine: { lineStyle: { color: THEME.grid } }, axisLine: { lineStyle: { color: THEME.grid } } },
            tooltip: { ...tooltipStyle },
            series: [{ type: 'radar', data: [{ value: values, name: 'Performance', areaStyle: { color: THEME.purple + '25' }, lineStyle: { color: THEME.purple, width: 2 }, symbol: 'circle', symbolSize: 5, itemStyle: { color: THEME.purple } }] }],
        }} />
    );
}

/* ═══════════ 6. DAILY P&L ═══════════ */
export function DailyPLChart({ trades }: { trades: Array<{ exit_time?: string; entry_time: string; profit_loss_usd?: number; status: string }> }) {
    const closed = trades.filter(t => t.status === 'closed' && t.profit_loss_usd !== undefined);
    if (!closed.length) return <Empty label="No daily P&L data" />;
    const byDay: Record<string, number> = {};
    closed.forEach(t => { const d = (t.exit_time || t.entry_time).split('T')[0]; byDay[d] = (byDay[d] || 0) + (t.profit_loss_usd || 0); });
    const entries = Object.entries(byDay).sort(([a], [b]) => a.localeCompare(b)).slice(-30);

    return (
        <ReactECharts style={{ height: 300 }} option={{
            backgroundColor: THEME.bg,
            grid: { top: 20, right: 16, bottom: 30, left: 55 },
            xAxis: { type: 'category', data: entries.map(([d]) => d.slice(5)), axisLine: { show: false }, axisTick: { show: false }, axisLabel: { color: THEME.text, fontSize: 9 } },
            yAxis: { type: 'value', axisLine: { show: false }, axisTick: { show: false }, axisLabel: { color: THEME.text, fontSize: 10, formatter: (v: number) => `$${v}` }, splitLine: { lineStyle: { color: THEME.grid } } },
            tooltip: { ...tooltipStyle, trigger: 'axis' },
            series: [{ type: 'bar', data: entries.map(([, v]) => ({ value: parseFloat(v.toFixed(2)), itemStyle: { color: v >= 0 ? THEME.green : THEME.red, borderRadius: [3, 3, 0, 0] } })), barMaxWidth: 18 }],
        }} />
    );
}

/* ═══════════ 7. DRAWDOWN ═══════════ */
export function DrawdownChart({ trades }: { trades: Array<{ exit_time?: string; entry_time: string; profit_loss_usd?: number; status: string }> }) {
    const closed = trades.filter(t => t.status === 'closed' && t.profit_loss_usd !== undefined)
        .sort((a, b) => new Date(a.exit_time || a.entry_time).getTime() - new Date(b.exit_time || b.entry_time).getTime());
    if (!closed.length) return <Empty label="No drawdown data" />;
    let peak = 0, bal = 0;
    const data = closed.map((t, i) => { bal += t.profit_loss_usd || 0; if (bal > peak) peak = bal; const dd = peak > 0 ? ((peak - bal) / peak) * 100 : 0; return { trade: `#${i + 1}`, dd: -parseFloat(dd.toFixed(2)) }; });

    return (
        <ReactECharts style={{ height: 240 }} option={{
            backgroundColor: THEME.bg,
            grid: { top: 15, right: 16, bottom: 30, left: 55 },
            xAxis: { type: 'category', data: data.map(d => d.trade), axisLine: { show: false }, axisTick: { show: false }, axisLabel: { color: THEME.text, fontSize: 9 } },
            yAxis: { type: 'value', axisLine: { show: false }, axisTick: { show: false }, axisLabel: { color: THEME.text, fontSize: 10, formatter: (v: number) => `${v}%` }, splitLine: { lineStyle: { color: THEME.grid } } },
            tooltip: { ...tooltipStyle, trigger: 'axis', formatter: (p: any) => `Drawdown: ${Math.abs(p[0]?.value || 0).toFixed(2)}%` },
            series: [{
                type: 'line', data: data.map(d => d.dd), smooth: true, symbol: 'none',
                lineStyle: { color: THEME.red, width: 2 },
                areaStyle: { color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{ offset: 0, color: THEME.red + '05' }, { offset: 1, color: THEME.red + '30' }]) },
            }],
        }} />
    );
}

/* ═══════════ 8. STRATEGY COMPARISON ═══════════ */
export function StrategyComparison({ trades }: { trades: Array<{ strategy?: string; profit_loss_usd?: number; status: string }> }) {
    const closed = trades.filter(t => t.status === 'closed' && t.strategy);
    if (!closed.length) return <Empty label="Log trades with strategies to compare" />;
    const strats: Record<string, { wins: number; losses: number; profit: number }> = {};
    closed.forEach(t => {
        const s = t.strategy || 'Unknown';
        if (!strats[s]) strats[s] = { wins: 0, losses: 0, profit: 0 };
        if ((t.profit_loss_usd || 0) > 0) strats[s].wins++; else strats[s].losses++;
        strats[s].profit += t.profit_loss_usd || 0;
    });
    const entries = Object.entries(strats).sort(([, a], [, b]) => b.profit - a.profit).slice(0, 8);
    const names = entries.map(([n]) => n);
    const profits = entries.map(([, d]) => parseFloat(d.profit.toFixed(2)));
    const winRates = entries.map(([, d]) => { const t = d.wins + d.losses; return t > 0 ? parseFloat(((d.wins / t) * 100).toFixed(1)) : 0; });

    return (
        <ReactECharts style={{ height: 300 }} option={{
            backgroundColor: THEME.bg,
            grid: { top: 30, right: 50, bottom: 30, left: 55 },
            legend: { top: 0, textStyle: { color: THEME.textLight, fontSize: 10 }, itemWidth: 10, itemHeight: 10 },
            xAxis: { type: 'category', data: names, axisLine: { show: false }, axisTick: { show: false }, axisLabel: { color: THEME.text, fontSize: 10 } },
            yAxis: [
                { type: 'value', name: 'P&L', nameTextStyle: { color: THEME.text, fontSize: 10 }, axisLine: { show: false }, axisTick: { show: false }, axisLabel: { color: THEME.text, fontSize: 10, formatter: (v: number) => `$${v}` }, splitLine: { lineStyle: { color: THEME.grid } } },
                { type: 'value', name: 'Win %', nameTextStyle: { color: THEME.text, fontSize: 10 }, max: 100, axisLine: { show: false }, axisTick: { show: false }, axisLabel: { color: THEME.text, fontSize: 10, formatter: '{value}%' }, splitLine: { show: false } },
            ],
            tooltip: { ...tooltipStyle, trigger: 'axis' },
            series: [
                { name: 'Profit', type: 'bar', yAxisIndex: 0, data: profits.map(v => ({ value: v, itemStyle: { color: v >= 0 ? THEME.green : THEME.red, borderRadius: [3, 3, 0, 0] } })), barMaxWidth: 28 },
                { name: 'Win Rate', type: 'line', yAxisIndex: 1, data: winRates, lineStyle: { color: THEME.cyan, width: 2 }, symbol: 'circle', symbolSize: 6, itemStyle: { color: THEME.cyan } },
            ],
        }} />
    );
}

/* ─── Empty ─── */
function Empty({ label }: { label: string }) {
    return <div className="h-48 flex items-center justify-center"><p className="text-[var(--text-tertiary)] text-sm">{label}</p></div>;
}
