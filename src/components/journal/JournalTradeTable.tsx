'use client';

import React, { useState, useMemo } from 'react';
import { Search, Filter, ChevronDown, ChevronUp, Download, Keyboard, X } from 'lucide-react';

interface Trade {
    id: number;
    pair_ticker: string;
    asset_type: string;
    order_type: string;
    entry_price: number;
    exit_price?: number;
    lot_size: number;
    profit_loss_usd?: number;
    profit_loss_pips?: number;
    risk_reward_ratio: number;
    status: string;
    result?: string;
    entry_time: string;
    exit_time?: string;
    strategy?: string;
    trading_session?: string;
    notes?: string;
    stop_loss?: number;
    take_profit?: number;
    market_trend?: string;
    account_size_at_entry?: number;
    tags?: string;
    checklist?: string;
    image_url?: string;
}

type SortKey = 'pair_ticker' | 'entry_time' | 'profit_loss_usd' | 'risk_reward_ratio' | 'lot_size' | 'status';
type SortDir = 'asc' | 'desc';

interface Props {
    trades: Trade[];
    onEdit: (trade: Trade) => void;
    onDelete: (tradeId: number) => void;
    onExportCSV: (trades: Trade[]) => void;
}

export default function JournalTradeTable({ trades, onEdit, onDelete, onExportCSV }: Props) {
    // Filters
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState<'all' | 'open' | 'closed'>('all');
    const [filterResult, setFilterResult] = useState<'all' | 'win' | 'loss'>('all');
    const [showAdvanced, setShowAdvanced] = useState(false);

    // Advanced filters
    const [dateFrom, setDateFrom] = useState('');
    const [dateTo, setDateTo] = useState('');
    const [selectedAssetTypes, setSelectedAssetTypes] = useState<string[]>([]);
    const [selectedSessions, setSelectedSessions] = useState<string[]>([]);
    const [selectedTrends, setSelectedTrends] = useState<string[]>([]);
    const [selectedStrategies, setSelectedStrategies] = useState<string[]>([]);
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [minPL, setMinPL] = useState('');
    const [maxPL, setMaxPL] = useState('');
    const [minRR, setMinRR] = useState('');
    const [maxRR, setMaxRR] = useState('');

    // Sort
    const [sortKey, setSortKey] = useState<SortKey>('entry_time');
    const [sortDir, setSortDir] = useState<SortDir>('desc');

    const [showShortcuts, setShowShortcuts] = useState(false);

    // Derived data
    const allStrategies = useMemo(() => Array.from(new Set(trades.map(t => t.strategy).filter(Boolean))) as string[], [trades]);
    const allTags = useMemo(() => {
        const tags = new Set<string>();
        trades.forEach(t => {
            if (t.tags) t.tags.split(',').forEach(tag => { const trimmed = tag.trim(); if (trimmed) tags.add(trimmed); });
        });
        return Array.from(tags);
    }, [trades]);

    const filteredTrades = useMemo(() => {
        let result = [...trades];

        // Basic filters
        if (searchQuery) result = result.filter(t => t.pair_ticker.toLowerCase().includes(searchQuery.toLowerCase()));
        if (filterStatus !== 'all') result = result.filter(t => t.status === filterStatus);
        if (filterResult === 'win') result = result.filter(t => t.status === 'closed' && (t.profit_loss_usd || 0) > 0);
        if (filterResult === 'loss') result = result.filter(t => t.status === 'closed' && (t.profit_loss_usd || 0) < 0);

        // Advanced filters
        if (dateFrom) result = result.filter(t => t.entry_time >= dateFrom);
        if (dateTo) result = result.filter(t => t.entry_time <= dateTo + 'T23:59:59');
        if (selectedAssetTypes.length) result = result.filter(t => selectedAssetTypes.includes(t.asset_type));
        if (selectedSessions.length) result = result.filter(t => t.trading_session && selectedSessions.includes(t.trading_session));
        if (selectedTrends.length) result = result.filter(t => t.market_trend && selectedTrends.includes(t.market_trend));
        if (selectedStrategies.length) result = result.filter(t => t.strategy && selectedStrategies.includes(t.strategy));
        if (selectedTags.length) result = result.filter(t => {
            if (!t.tags) return false;
            const tradeTags = t.tags.split(',').map(tag => tag.trim());
            return selectedTags.some(st => tradeTags.includes(st));
        });
        if (minPL) result = result.filter(t => (t.profit_loss_usd || 0) >= parseFloat(minPL));
        if (maxPL) result = result.filter(t => (t.profit_loss_usd || 0) <= parseFloat(maxPL));
        if (minRR) result = result.filter(t => t.risk_reward_ratio >= parseFloat(minRR));
        if (maxRR) result = result.filter(t => t.risk_reward_ratio <= parseFloat(maxRR));

        // Sort
        result.sort((a, b) => {
            let aVal: any, bVal: any;
            switch (sortKey) {
                case 'pair_ticker': aVal = a.pair_ticker; bVal = b.pair_ticker; break;
                case 'entry_time': aVal = a.entry_time; bVal = b.entry_time; break;
                case 'profit_loss_usd': aVal = a.profit_loss_usd || 0; bVal = b.profit_loss_usd || 0; break;
                case 'risk_reward_ratio': aVal = a.risk_reward_ratio; bVal = b.risk_reward_ratio; break;
                case 'lot_size': aVal = a.lot_size; bVal = b.lot_size; break;
                case 'status': aVal = a.status; bVal = b.status; break;
                default: aVal = a.entry_time; bVal = b.entry_time;
            }
            if (typeof aVal === 'string') return sortDir === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
            return sortDir === 'asc' ? aVal - bVal : bVal - aVal;
        });

        return result;
    }, [trades, searchQuery, filterStatus, filterResult, dateFrom, dateTo, selectedAssetTypes, selectedSessions, selectedTrends, selectedStrategies, selectedTags, minPL, maxPL, minRR, maxRR, sortKey, sortDir]);

    const handleSort = (key: SortKey) => {
        if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
        else { setSortKey(key); setSortDir('desc'); }
    };

    const SortIcon = ({ col }: { col: SortKey }) => {
        if (sortKey !== col) return <ChevronDown className="w-3 h-3 opacity-30" />;
        return sortDir === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />;
    };

    const clearAdvancedFilters = () => {
        setDateFrom(''); setDateTo(''); setSelectedTags([]); setSelectedStrategies([]);
        setSelectedSessions([]); setSelectedTrends([]); setSelectedAssetTypes([]);
        setMinPL(''); setMaxPL(''); setMinRR(''); setMaxRR('');
    };

    const toggleCheckbox = (arr: string[], setArr: React.Dispatch<React.SetStateAction<string[]>>, val: string) => {
        setArr(arr.includes(val) ? arr.filter(v => v !== val) : [...arr, val]);
    };

    return (
        <div className="space-y-3">
            {/* Filter bar */}
            <div className="bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-xl p-3">
                <div className="flex flex-wrap gap-3 items-center">
                    <div className="flex items-center gap-2 flex-1 min-w-[200px]">
                        <Search className="w-4 h-4 text-[var(--text-tertiary)]" />
                        <input type="text" placeholder="Search pairs..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                            className="bg-transparent border-none text-sm text-[var(--text-primary)] placeholder-[var(--text-tertiary)] focus:outline-none w-full" />
                    </div>

                    <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value as any)}
                        className="bg-[var(--bg-primary)] border border-[var(--border-primary)] rounded-lg px-3 py-1.5 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--border-hover)]">
                        <option value="all">All Status</option><option value="open">Open</option><option value="closed">Closed</option>
                    </select>

                    <select value={filterResult} onChange={(e) => setFilterResult(e.target.value as any)}
                        className="bg-[var(--bg-primary)] border border-[var(--border-primary)] rounded-lg px-3 py-1.5 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--border-hover)]">
                        <option value="all">All Results</option><option value="win">Wins</option><option value="loss">Losses</option>
                    </select>

                    <button onClick={() => setShowAdvanced(!showAdvanced)}
                        className="flex items-center gap-1.5 bg-[var(--bg-primary)] border border-[var(--border-primary)] rounded-lg px-3 py-1.5 text-sm text-[var(--text-secondary)] hover:border-[var(--border-hover)] transition-colors">
                        <Filter className="w-3.5 h-3.5" /> Filters {showAdvanced ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </button>

                    <button onClick={() => onExportCSV(filteredTrades)}
                        className="flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-lg px-3 py-1.5 text-sm text-emerald-400 hover:bg-emerald-500/20 transition-colors">
                        <Download className="w-3.5 h-3.5" /> Export
                    </button>

                    <span className="text-xs text-[var(--text-tertiary)] ml-auto">{filteredTrades.length} trades</span>
                </div>

                {/* Advanced filters */}
                {showAdvanced && (
                    <div className="border-t border-[var(--border-primary)] pt-3 mt-3 space-y-3">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            <div><label className="text-xs text-[var(--text-tertiary)] mb-1 block">From</label>
                                <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} className="w-full bg-[var(--bg-primary)] border border-[var(--border-primary)] rounded-lg px-2 py-1.5 text-sm text-[var(--text-primary)] focus:outline-none" /></div>
                            <div><label className="text-xs text-[var(--text-tertiary)] mb-1 block">To</label>
                                <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} className="w-full bg-[var(--bg-primary)] border border-[var(--border-primary)] rounded-lg px-2 py-1.5 text-sm text-[var(--text-primary)] focus:outline-none" /></div>
                            <div><label className="text-xs text-[var(--text-tertiary)] mb-1 block">Min P&L</label>
                                <input type="number" placeholder="-1000" value={minPL} onChange={(e) => setMinPL(e.target.value)} className="w-full bg-[var(--bg-primary)] border border-[var(--border-primary)] rounded-lg px-2 py-1.5 text-sm text-[var(--text-primary)] placeholder-[var(--text-tertiary)] focus:outline-none" /></div>
                            <div><label className="text-xs text-[var(--text-tertiary)] mb-1 block">Max P&L</label>
                                <input type="number" placeholder="1000" value={maxPL} onChange={(e) => setMaxPL(e.target.value)} className="w-full bg-[var(--bg-primary)] border border-[var(--border-primary)] rounded-lg px-2 py-1.5 text-sm text-[var(--text-primary)] placeholder-[var(--text-tertiary)] focus:outline-none" /></div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            <div><label className="text-xs text-[var(--text-tertiary)] mb-1 block">Min R:R</label>
                                <input type="number" step="0.1" placeholder="1.0" value={minRR} onChange={(e) => setMinRR(e.target.value)} className="w-full bg-[var(--bg-primary)] border border-[var(--border-primary)] rounded-lg px-2 py-1.5 text-sm text-[var(--text-primary)] placeholder-[var(--text-tertiary)] focus:outline-none" /></div>
                            <div><label className="text-xs text-[var(--text-tertiary)] mb-1 block">Max R:R</label>
                                <input type="number" step="0.1" placeholder="5.0" value={maxRR} onChange={(e) => setMaxRR(e.target.value)} className="w-full bg-[var(--bg-primary)] border border-[var(--border-primary)] rounded-lg px-2 py-1.5 text-sm text-[var(--text-primary)] placeholder-[var(--text-tertiary)] focus:outline-none" /></div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                            {/* Asset Types */}
                            <div><label className="text-xs text-[var(--text-tertiary)] mb-1.5 block">Asset Types</label>
                                <div className="space-y-1">{['Forex', 'Crypto', 'Stocks', 'Commodities', 'Indices'].map(type => (
                                    <label key={type} className="flex items-center gap-2 text-xs text-[var(--text-secondary)] cursor-pointer">
                                        <input type="checkbox" checked={selectedAssetTypes.includes(type)} onChange={() => toggleCheckbox(selectedAssetTypes, setSelectedAssetTypes, type)} className="rounded border-[var(--border-primary)] w-3.5 h-3.5" />{type}
                                    </label>))}</div></div>

                            {/* Sessions */}
                            <div><label className="text-xs text-[var(--text-tertiary)] mb-1.5 block">Sessions</label>
                                <div className="space-y-1">{['London', 'New York', 'Tokyo', 'Sydney', 'Asia'].map(s => (
                                    <label key={s} className="flex items-center gap-2 text-xs text-[var(--text-secondary)] cursor-pointer">
                                        <input type="checkbox" checked={selectedSessions.includes(s)} onChange={() => toggleCheckbox(selectedSessions, setSelectedSessions, s)} className="rounded border-[var(--border-primary)] w-3.5 h-3.5" />{s}
                                    </label>))}</div></div>

                            {/* Trends */}
                            <div><label className="text-xs text-[var(--text-tertiary)] mb-1.5 block">Trends</label>
                                <div className="space-y-1">{['Bullish', 'Bearish', 'Sideways', 'Volatile'].map(t => (
                                    <label key={t} className="flex items-center gap-2 text-xs text-[var(--text-secondary)] cursor-pointer">
                                        <input type="checkbox" checked={selectedTrends.includes(t)} onChange={() => toggleCheckbox(selectedTrends, setSelectedTrends, t)} className="rounded border-[var(--border-primary)] w-3.5 h-3.5" />{t}
                                    </label>))}</div></div>

                            {/* Strategies */}
                            <div><label className="text-xs text-[var(--text-tertiary)] mb-1.5 block">Strategies</label>
                                <div className="space-y-1 max-h-24 overflow-y-auto">{allStrategies.map(s => (
                                    <label key={s} className="flex items-center gap-2 text-xs text-[var(--text-secondary)] cursor-pointer">
                                        <input type="checkbox" checked={selectedStrategies.includes(s)} onChange={() => toggleCheckbox(selectedStrategies, setSelectedStrategies, s)} className="rounded border-[var(--border-primary)] w-3.5 h-3.5" />{s}
                                    </label>))}</div></div>

                            {/* Tags */}
                            <div><label className="text-xs text-[var(--text-tertiary)] mb-1.5 block">Tags</label>
                                <div className="flex flex-wrap gap-1">{allTags.map(tag => (
                                    <button key={tag} onClick={() => toggleCheckbox(selectedTags, setSelectedTags, tag)}
                                        className={`px-2 py-0.5 rounded-full text-xs transition-colors ${selectedTags.includes(tag) ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' : 'bg-[var(--bg-primary)] text-[var(--text-tertiary)] border border-[var(--border-primary)] hover:border-[var(--border-hover)]'}`}>
                                        {tag}</button>))}</div></div>
                        </div>

                        <div className="flex justify-end">
                            <button onClick={clearAdvancedFilters} className="text-xs text-[var(--text-tertiary)] hover:text-[var(--text-primary)] underline transition-colors">Clear all filters</button>
                        </div>
                    </div>
                )}
            </div>

            {/* Table */}
            <div className="bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-[var(--bg-primary)] border-b border-[var(--border-primary)]">
                            <tr>
                                <th className="px-3 py-2.5 text-left text-xs font-medium text-[var(--text-tertiary)] uppercase tracking-wider">#</th>
                                <th className="px-3 py-2.5 text-left text-xs font-medium text-[var(--text-tertiary)] uppercase tracking-wider cursor-pointer select-none" onClick={() => handleSort('pair_ticker')}>
                                    <span className="flex items-center gap-1">Pair <SortIcon col="pair_ticker" /></span></th>
                                <th className="px-3 py-2.5 text-left text-xs font-medium text-[var(--text-tertiary)] uppercase tracking-wider">Type</th>
                                <th className="px-3 py-2.5 text-left text-xs font-medium text-[var(--text-tertiary)] uppercase tracking-wider cursor-pointer select-none" onClick={() => handleSort('entry_time')}>
                                    <span className="flex items-center gap-1">Date <SortIcon col="entry_time" /></span></th>
                                <th className="px-3 py-2.5 text-left text-xs font-medium text-[var(--text-tertiary)] uppercase tracking-wider">Entry</th>
                                <th className="px-3 py-2.5 text-left text-xs font-medium text-[var(--text-tertiary)] uppercase tracking-wider">Exit</th>
                                <th className="px-3 py-2.5 text-left text-xs font-medium text-[var(--text-tertiary)] uppercase tracking-wider cursor-pointer select-none" onClick={() => handleSort('profit_loss_usd')}>
                                    <span className="flex items-center gap-1">P/L <SortIcon col="profit_loss_usd" /></span></th>
                                <th className="px-3 py-2.5 text-left text-xs font-medium text-[var(--text-tertiary)] uppercase tracking-wider">Pips</th>
                                <th className="px-3 py-2.5 text-left text-xs font-medium text-[var(--text-tertiary)] uppercase tracking-wider cursor-pointer select-none" onClick={() => handleSort('risk_reward_ratio')}>
                                    <span className="flex items-center gap-1">R:R <SortIcon col="risk_reward_ratio" /></span></th>
                                <th className="px-3 py-2.5 text-left text-xs font-medium text-[var(--text-tertiary)] uppercase tracking-wider">Strategy</th>
                                <th className="px-3 py-2.5 text-left text-xs font-medium text-[var(--text-tertiary)] uppercase tracking-wider">Trend</th>
                                <th className="px-3 py-2.5 text-left text-xs font-medium text-[var(--text-tertiary)] uppercase tracking-wider">Notes</th>
                                <th className="px-3 py-2.5 text-left text-xs font-medium text-[var(--text-tertiary)] uppercase tracking-wider cursor-pointer select-none" onClick={() => handleSort('status')}>
                                    <span className="flex items-center gap-1">Status <SortIcon col="status" /></span></th>
                                <th className="px-3 py-2.5 text-left text-xs font-medium text-[var(--text-tertiary)] uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--border-primary)]">
                            {filteredTrades.map((trade, index) => (
                                <tr key={trade.id} className="hover:bg-[var(--bg-primary)] transition-colors">
                                    <td className="px-3 py-2.5 whitespace-nowrap text-xs text-[var(--text-tertiary)] font-mono">#{filteredTrades.length - index}</td>
                                    <td className="px-3 py-2.5 whitespace-nowrap">
                                        <div className="font-semibold text-sm text-[var(--text-primary)]">{trade.pair_ticker}</div>
                                        <div className="text-xs text-[var(--text-tertiary)]">{trade.asset_type}</div>
                                    </td>
                                    <td className="px-3 py-2.5 whitespace-nowrap">
                                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${trade.order_type === 'Buy' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                                            {trade.order_type}
                                        </span>
                                    </td>
                                    <td className="px-3 py-2.5 whitespace-nowrap text-xs text-[var(--text-secondary)]">
                                        {trade.entry_time ? new Date(trade.entry_time).toLocaleDateString() : '-'}
                                    </td>
                                    <td className="px-3 py-2.5 whitespace-nowrap text-sm text-[var(--text-secondary)] font-mono">
                                        {trade.entry_price ? trade.entry_price.toFixed(5) : '-'}
                                    </td>
                                    <td className="px-3 py-2.5 whitespace-nowrap text-sm text-[var(--text-secondary)] font-mono">
                                        {trade.exit_price ? trade.exit_price.toFixed(5) : '-'}
                                    </td>
                                    <td className="px-3 py-2.5 whitespace-nowrap">
                                        {trade.profit_loss_usd != null && (
                                            <span className={`text-sm font-semibold ${trade.profit_loss_usd > 0 ? 'text-emerald-400' : trade.profit_loss_usd < 0 ? 'text-red-400' : 'text-[var(--text-tertiary)]'}`}>
                                                {trade.profit_loss_usd > 0 ? '+' : ''}${trade.profit_loss_usd.toFixed(2)}
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-3 py-2.5 whitespace-nowrap">
                                        {trade.profit_loss_pips != null && (
                                            <span className={`text-sm ${trade.profit_loss_pips > 0 ? 'text-emerald-400' : trade.profit_loss_pips < 0 ? 'text-red-400' : 'text-[var(--text-tertiary)]'}`}>
                                                {trade.profit_loss_pips > 0 ? '+' : ''}{trade.profit_loss_pips.toFixed(1)}
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-3 py-2.5 whitespace-nowrap text-sm text-[var(--text-secondary)]">
                                        {trade.risk_reward_ratio ? `1:${trade.risk_reward_ratio.toFixed(1)}` : '-'}
                                    </td>
                                    <td className="px-3 py-2.5 whitespace-nowrap text-sm text-[var(--text-secondary)]">
                                        {trade.strategy || '-'}
                                    </td>
                                    <td className="px-3 py-2.5 whitespace-nowrap">
                                        {trade.market_trend && (
                                            <span className={`px-2 py-0.5 rounded text-xs font-medium ${trade.market_trend === 'Bullish' ? 'bg-green-500/10 text-green-400' :
                                                trade.market_trend === 'Bearish' ? 'bg-red-500/10 text-red-400' : 'bg-gray-500/10 text-gray-400'
                                                }`}>
                                                {trade.market_trend}
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-3 py-2.5 whitespace-nowrap text-sm text-[var(--text-secondary)] max-w-[150px] truncate" title={trade.notes?.replace(/<[^>]*>/g, '') || ''}>
                                        {trade.notes ? trade.notes.replace(/<[^>]*>/g, '').substring(0, 20) + (trade.notes.length > 20 ? '...' : '') : '-'}
                                    </td>
                                    <td className="px-3 py-2.5 whitespace-nowrap">
                                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${trade.status === 'open' ? 'bg-blue-500/10 text-blue-400' :
                                            (trade.profit_loss_usd || 0) > 0 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'
                                            }`}>
                                            {trade.status === 'open' ? 'OPEN' : (trade.profit_loss_usd || 0) > 0 ? 'WIN' : 'LOSS'}
                                        </span>
                                    </td>
                                    <td className="px-3 py-2.5 whitespace-nowrap">
                                        <div className="flex gap-1.5">
                                            <button onClick={() => onEdit(trade)} className="text-[var(--text-tertiary)] hover:text-blue-400 transition-colors p-1" title="Edit">
                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                                            </button>
                                            <button onClick={() => onDelete(trade.id)} className="text-[var(--text-tertiary)] hover:text-red-400 transition-colors p-1" title="Delete">
                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filteredTrades.length === 0 && (
                                <tr><td colSpan={14} className="px-3 py-12 text-center text-sm text-[var(--text-tertiary)]">No trades match your filters</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
