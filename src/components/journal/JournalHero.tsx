'use client';

import React from 'react';
import Link from 'next/link';
import { BarChart3, Brain, TrendingUp, Trophy, Target, Zap, UserPlus, Plus, Clock } from 'lucide-react';

const demoTrades = [
    { id: 1, pair: 'EUR/USD', type: 'Buy', entry: '1.09230', exit: '1.09560', pips: '+33', pl: '+$330', rr: '1:3.2', strategy: 'Breakout', session: 'London', status: 'win' },
    { id: 2, pair: 'GBP/JPY', type: 'Sell', entry: '188.450', exit: '187.890', pips: '+56', pl: '+$560', rr: '1:2.8', strategy: 'Reversal', session: 'NY', status: 'win' },
    { id: 3, pair: 'XAU/USD', type: 'Buy', entry: '2024.50', exit: '2031.80', pips: '+73', pl: '+$1,460', rr: '1:4.1', strategy: 'Trend', session: 'London', status: 'win' },
    { id: 4, pair: 'USD/CAD', type: 'Sell', entry: '1.36150', exit: '1.36380', pips: '-23', pl: '-$230', rr: '1:1.5', strategy: 'Scalp', session: 'NY', status: 'loss' },
    { id: 5, pair: 'AUD/USD', type: 'Buy', entry: '0.64920', exit: '0.65310', pips: '+39', pl: '+$390', rr: '1:3.0', strategy: 'Trend', session: 'Sydney', status: 'win' },
];

interface Props {
    onLogin: () => void;
    onSignup: () => void;
}

export default function JournalHero({ onLogin, onSignup }: Props) {
    return (
        <div className="space-y-12 pb-16">
            {/* Back link */}
            <div>
                <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors">
                    ← Back to Home
                </Link>
            </div>

            {/* Hero */}
            <div className="text-center max-w-3xl mx-auto">
                <h1 className="text-4xl md:text-5xl font-bold text-[var(--text-primary)] mb-4">
                    Professional Trading Journal
                </h1>
                <p className="text-lg text-[var(--text-secondary)] mb-8 max-w-2xl mx-auto">
                    Track every trade, analyze your performance, and improve consistently with data-driven insights and AI-powered recommendations.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <button onClick={onSignup} className="px-8 py-3 bg-emerald-500 hover:bg-emerald-600 rounded-lg font-semibold text-white transition-colors">
                        Start Free Today
                    </button>
                    <button onClick={onLogin} className="px-8 py-3 bg-[var(--bg-secondary)] border border-[var(--border-primary)] hover:border-[var(--border-hover)] rounded-lg font-semibold text-[var(--text-primary)] transition-colors">
                        Sign In
                    </button>
                </div>
            </div>

            {/* Demo table */}
            <div className="bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-xl overflow-hidden">
                <div className="px-4 py-3 border-b border-[var(--border-primary)]">
                    <h3 className="text-sm font-semibold text-[var(--text-primary)] flex items-center gap-2">
                        <BarChart3 className="w-4 h-4 text-emerald-400" /> Sample Trading History
                    </h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-[var(--bg-primary)]">
                            <tr>
                                {['Asset', 'Type', 'Entry/Exit', 'Pips', 'P&L', 'R:R', 'Strategy', 'Result'].map(h => (
                                    <th key={h} className="px-3 py-2 text-left text-xs font-medium text-[var(--text-tertiary)] uppercase tracking-wider">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--border-primary)]">
                            {demoTrades.map(trade => (
                                <tr key={trade.id} className="hover:bg-[var(--bg-primary)] transition-colors">
                                    <td className="px-3 py-2.5">
                                        <span className="font-semibold text-sm text-[var(--text-primary)]">{trade.pair}</span>
                                        <span className="text-xs text-[var(--text-tertiary)] ml-2">{trade.session}</span>
                                    </td>
                                    <td className="px-3 py-2.5">
                                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${trade.type === 'Buy' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>{trade.type}</span>
                                    </td>
                                    <td className="px-3 py-2.5 text-xs text-[var(--text-secondary)] font-mono">{trade.entry} → {trade.exit}</td>
                                    <td className="px-3 py-2.5"><span className={`text-sm font-mono ${trade.pips.startsWith('+') ? 'text-emerald-400' : 'text-red-400'}`}>{trade.pips}</span></td>
                                    <td className="px-3 py-2.5"><span className={`text-sm font-semibold ${trade.pl.startsWith('+') ? 'text-emerald-400' : 'text-red-400'}`}>{trade.pl}</span></td>
                                    <td className="px-3 py-2.5 text-sm text-blue-400 font-mono">{trade.rr}</td>
                                    <td className="px-3 py-2.5 text-sm text-[var(--text-secondary)]">{trade.strategy}</td>
                                    <td className="px-3 py-2.5">
                                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${trade.status === 'win' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                                            {trade.status.toUpperCase()}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="px-4 py-2.5 border-t border-[var(--border-primary)] flex items-center gap-4 text-xs text-[var(--text-tertiary)]">
                    <span>Win Rate: <span className="text-emerald-400 font-medium">80%</span></span>
                    <span>Profit Factor: <span className="text-blue-400 font-medium">2.8</span></span>
                    <span>Total P&L: <span className="text-emerald-400 font-medium">+$2,510</span></span>
                </div>
            </div>

            {/* Features */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { icon: Target, title: 'Auto-Calculations', desc: 'Precision for Forex, Gold, Indices', color: 'emerald' },
                    { icon: Brain, title: 'AI Insights', desc: 'Pattern recognition and alerts', color: 'blue' },
                    { icon: TrendingUp, title: 'Performance Analytics', desc: 'Sharpe, drawdown, session analysis', color: 'purple' },
                    { icon: Trophy, title: 'Gamification', desc: 'Achievements and milestones', color: 'amber' },
                ].map(f => {
                    const Icon = f.icon;
                    return (
                        <div key={f.title} className="bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-xl p-5 hover:border-[var(--border-hover)] transition-colors">
                            <Icon className={`w-5 h-5 text-${f.color}-400 mb-3`} />
                            <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-1">{f.title}</h3>
                            <p className="text-xs text-[var(--text-tertiary)]">{f.desc}</p>
                        </div>
                    );
                })}
            </div>

            {/* How it works */}
            <div className="text-center">
                <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-6">Get Started in Minutes</h2>
                <div className="grid md:grid-cols-4 gap-6 max-w-3xl mx-auto">
                    {[
                        { icon: UserPlus, title: '1. Create Account', desc: 'Free signup in 30 seconds', color: 'emerald' },
                        { icon: Plus, title: '2. Log Your Trade', desc: 'Pair, entry, exit, lot size', color: 'blue' },
                        { icon: Zap, title: '3. Auto-Calculate', desc: 'Pips, R:R, risk instantly', color: 'amber' },
                        { icon: Target, title: '4. Analyze & Improve', desc: 'AI insights, track progress', color: 'purple' },
                    ].map(s => {
                        const Icon = s.icon;
                        return (
                            <div key={s.title} className="text-center">
                                <div className={`w-10 h-10 bg-${s.color}-500/10 rounded-lg flex items-center justify-center mx-auto mb-3`}>
                                    <Icon className={`w-5 h-5 text-${s.color}-400`} />
                                </div>
                                <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-1">{s.title}</h3>
                                <p className="text-xs text-[var(--text-tertiary)]">{s.desc}</p>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* CTA */}
            <div className="text-center max-w-2xl mx-auto bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-xl p-8">
                <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-3">Ready to Transform Your Trading?</h2>
                <p className="text-[var(--text-secondary)] mb-6 text-sm">Join thousands of traders who have built consistent profitability with data-driven insights.</p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <button onClick={onSignup} className="px-8 py-3 bg-emerald-500 hover:bg-emerald-600 rounded-lg font-semibold text-white transition-colors">
                        Start Free Today
                    </button>
                    <button onClick={onLogin} className="px-8 py-3 bg-[var(--bg-primary)] border border-[var(--border-primary)] hover:border-[var(--border-hover)] rounded-lg font-semibold text-[var(--text-primary)] transition-colors">
                        Sign In to Dashboard
                    </button>
                </div>
                <div className="grid grid-cols-3 gap-4 mt-6 text-center">
                    <div><span className="text-lg font-bold text-emerald-400">10,000+</span><div className="text-xs text-[var(--text-tertiary)]">Active Traders</div></div>
                    <div><span className="text-lg font-bold text-blue-400">$2.3M+</span><div className="text-xs text-[var(--text-tertiary)]">Profits Tracked</div></div>
                    <div><span className="text-lg font-bold text-purple-400">99.9%</span><div className="text-xs text-[var(--text-tertiary)]">Uptime</div></div>
                </div>
            </div>
        </div>
    );
}
