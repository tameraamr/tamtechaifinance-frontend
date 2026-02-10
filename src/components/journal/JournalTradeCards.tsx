'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { TrendingUp, TrendingDown, Clock, Tag, Eye, X, ChevronLeft, ChevronRight } from 'lucide-react';

interface Trade {
    id: number; pair_ticker: string; asset_type: string; order_type: string;
    entry_price: number; exit_price?: number; lot_size: number;
    profit_loss_usd?: number; profit_loss_pips?: number; risk_reward_ratio: number;
    status: string; result?: string; entry_time: string; exit_time?: string;
    strategy?: string; trading_session?: string; notes?: string;
    stop_loss?: number; take_profit?: number; market_trend?: string;
    tags?: string; image_url?: string;
}

interface Props {
    trades: Trade[];
    onEdit: (trade: Trade) => void;
}

export default function JournalTradeCards({ trades, onEdit }: Props) {
    const [previewTrade, setPreviewTrade] = useState<Trade | null>(null);
    const [page, setPage] = useState(0);
    const perPage = 6;

    // Show most recent trades first
    const sorted = [...trades]
        .sort((a, b) => new Date(b.entry_time).getTime() - new Date(a.entry_time).getTime())
        .slice(0, 30); // Cap at 30

    const paged = sorted.slice(page * perPage, (page + 1) * perPage);
    const totalPages = Math.ceil(sorted.length / perPage);

    const isWin = (t: Trade) => t.status === 'closed' && (t.profit_loss_usd || 0) > 0;
    const isLoss = (t: Trade) => t.status === 'closed' && (t.profit_loss_usd || 0) < 0;

    return (
        <>
            <div className="space-y-3">
                <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium text-[var(--text-secondary)]">Recent Trades</h3>
                    {totalPages > 1 && (
                        <div className="flex items-center gap-2">
                            <button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0}
                                className="p-1 text-[var(--text-tertiary)] hover:text-[var(--text-primary)] disabled:opacity-30 transition-colors">
                                <ChevronLeft className="w-4 h-4" />
                            </button>
                            <span className="text-xs text-[var(--text-tertiary)]">{page + 1}/{totalPages}</span>
                            <button onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))} disabled={page >= totalPages - 1}
                                className="p-1 text-[var(--text-tertiary)] hover:text-[var(--text-primary)] disabled:opacity-30 transition-colors">
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {paged.map(trade => (
                        <div key={trade.id}
                            className="group bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-xl overflow-hidden hover:border-[var(--border-hover)] transition-all duration-200 cursor-pointer hover:shadow-lg hover:shadow-black/20"
                            onClick={() => onEdit(trade)}>

                            {/* Screenshot / Visual header */}
                            {trade.image_url ? (
                                <div className="relative h-36 bg-[var(--bg-primary)] overflow-hidden">
                                    <Image src={trade.image_url} alt={`${trade.pair_ticker} chart`} fill className="object-cover opacity-90 group-hover:opacity-100 transition-opacity" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                                    <button onClick={(e) => { e.stopPropagation(); setPreviewTrade(trade); }}
                                        className="absolute top-2 right-2 p-1.5 bg-black/50 rounded-lg text-white/70 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Eye className="w-3.5 h-3.5" />
                                    </button>
                                    {/* Overlay info */}
                                    <div className="absolute bottom-2 left-3 right-3">
                                        <div className="flex items-center justify-between">
                                            <span className="text-white font-bold text-sm">{trade.pair_ticker}</span>
                                            <span className={`text-xs font-semibold ${isWin(trade) ? 'text-emerald-400' : isLoss(trade) ? 'text-red-400' : 'text-blue-400'}`}>
                                                {trade.profit_loss_usd != null ? `${trade.profit_loss_usd > 0 ? '+' : ''}$${trade.profit_loss_usd.toFixed(2)}` : 'OPEN'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                /* No screenshot — colored header bar */
                                <div className={`h-1.5 ${isWin(trade) ? 'bg-emerald-500' : isLoss(trade) ? 'bg-red-500' : 'bg-blue-500'}`} />
                            )}

                            {/* Card body */}
                            <div className="p-3 space-y-2">
                                {/* Top row */}
                                {!trade.image_url && (
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <span className="font-semibold text-sm text-[var(--text-primary)]">{trade.pair_ticker}</span>
                                            <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${trade.order_type === 'Buy' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                                                {trade.order_type}
                                            </span>
                                        </div>
                                        <span className={`text-sm font-bold ${isWin(trade) ? 'text-emerald-400' : isLoss(trade) ? 'text-red-400' : 'text-blue-400'}`}>
                                            {trade.profit_loss_usd != null ? `${trade.profit_loss_usd > 0 ? '+' : ''}$${trade.profit_loss_usd.toFixed(2)}` : 'OPEN'}
                                        </span>
                                    </div>
                                )}

                                {/* Details grid */}
                                <div className="grid grid-cols-3 gap-1.5 text-xs">
                                    <div className="bg-[var(--bg-primary)] rounded-md px-2 py-1.5">
                                        <div className="text-[var(--text-tertiary)] text-[10px]">Entry</div>
                                        <div className="text-[var(--text-primary)] font-mono">{trade.entry_price?.toFixed(trade.entry_price > 100 ? 2 : 5)}</div>
                                    </div>
                                    <div className="bg-[var(--bg-primary)] rounded-md px-2 py-1.5">
                                        <div className="text-[var(--text-tertiary)] text-[10px]">Exit</div>
                                        <div className="text-[var(--text-primary)] font-mono">{trade.exit_price ? trade.exit_price.toFixed(trade.exit_price > 100 ? 2 : 5) : '—'}</div>
                                    </div>
                                    <div className="bg-[var(--bg-primary)] rounded-md px-2 py-1.5">
                                        <div className="text-[var(--text-tertiary)] text-[10px]">R:R</div>
                                        <div className="text-blue-400 font-mono">1:{trade.risk_reward_ratio?.toFixed(1)}</div>
                                    </div>
                                </div>

                                {/* Meta row */}
                                <div className="flex items-center justify-between text-[10px] text-[var(--text-tertiary)] pt-0.5">
                                    <div className="flex items-center gap-1.5">
                                        <Clock className="w-3 h-3" />
                                        <span>{new Date(trade.entry_time).toLocaleDateString()}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        {trade.strategy && <span className="bg-[var(--bg-primary)] px-1.5 py-0.5 rounded">{trade.strategy}</span>}
                                        {trade.trading_session && <span className="bg-[var(--bg-primary)] px-1.5 py-0.5 rounded">{trade.trading_session}</span>}
                                    </div>
                                </div>

                                {/* Tags */}
                                {trade.tags && (
                                    <div className="flex flex-wrap gap-1">
                                        {trade.tags.split(',').filter(Boolean).slice(0, 3).map(tag => (
                                            <span key={tag} className="px-1.5 py-0.5 bg-purple-500/10 text-purple-400 rounded text-[10px]">
                                                {tag.trim()}
                                            </span>
                                        ))}
                                    </div>
                                )}

                                {/* Status badge */}
                                <div className="flex items-center justify-between">
                                    <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${trade.status === 'open' ? 'bg-blue-500/10 text-blue-400' :
                                            isWin(trade) ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'
                                        }`}>
                                        {trade.status === 'open' ? 'OPEN' : isWin(trade) ? 'WIN' : 'LOSS'}
                                    </span>
                                    {trade.profit_loss_pips != null && (
                                        <span className={`text-[10px] ${(trade.profit_loss_pips || 0) > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                                            {trade.profit_loss_pips > 0 ? '+' : ''}{trade.profit_loss_pips.toFixed(1)} pips
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {sorted.length === 0 && (
                    <div className="text-center py-12 text-sm text-[var(--text-tertiary)]">
                        No trades yet. Start logging to see your trades here.
                    </div>
                )}
            </div>

            {/* Full-screen image preview */}
            {previewTrade && previewTrade.image_url && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4" onClick={() => setPreviewTrade(null)}>
                    <div className="relative max-w-4xl w-full max-h-[85vh]" onClick={e => e.stopPropagation()}>
                        <button onClick={() => setPreviewTrade(null)} className="absolute -top-10 right-0 text-white/60 hover:text-white transition-colors">
                            <X className="w-6 h-6" />
                        </button>
                        <div className="bg-[var(--bg-secondary)] rounded-xl overflow-hidden border border-[var(--border-primary)]">
                            <div className="relative w-full" style={{ height: '60vh' }}>
                                <Image src={previewTrade.image_url} alt={`${previewTrade.pair_ticker} chart`} fill className="object-contain" />
                            </div>
                            <div className="p-4 border-t border-[var(--border-primary)] flex items-center justify-between">
                                <div>
                                    <span className="font-semibold text-[var(--text-primary)]">{previewTrade.pair_ticker}</span>
                                    <span className="text-sm text-[var(--text-tertiary)] ml-2">{previewTrade.strategy}</span>
                                </div>
                                <span className={`font-bold ${isWin(previewTrade) ? 'text-emerald-400' : 'text-red-400'}`}>
                                    {previewTrade.profit_loss_usd != null ? `${previewTrade.profit_loss_usd > 0 ? '+' : ''}$${previewTrade.profit_loss_usd.toFixed(2)}` : 'OPEN'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
