"use client";

import { Stock, useWatchlist, useToggleWatchlist } from "@/hooks/useStocks";
import { ArrowDown, ArrowUp, Minus, Star, Filter, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import StockDetailModal from "./StockDetailModal";

interface StocksTableProps {
    stocks: Stock[];
    isLoading: boolean;
    onSort: (key: string) => void;
    sortConfig: { key: string; direction: "asc" | "desc" };
    simpleMode?: boolean;
    onFilter?: (key: string, value: string | null) => void;
    activeFilters?: Record<string, string>;
}

export default function StocksTable({ stocks, isLoading, onSort, sortConfig, simpleMode = false, onFilter, activeFilters = {} }: StocksTableProps) {
    const [selectedStock, setSelectedStock] = useState<Stock | null>(null);
    const [displayCount, setDisplayCount] = useState(50);
    const [openFilter, setOpenFilter] = useState<string | null>(null);

    const { data: watchlist } = useWatchlist();
    const { mutate: toggleWatchlist } = useToggleWatchlist();

    const isInWatchlist = (symbol: string) => {
        return watchlist?.some(s => s.symbol === symbol);
    };

    const handleToggleWatchlist = (symbol: string) => {
        const action = isInWatchlist(symbol) ? "remove" : "add";
        toggleWatchlist({ symbol, action });
    };

    const handleLoadMore = () => {
        setDisplayCount(prev => prev + 50);
    };

    const displayedStocks = stocks.slice(0, displayCount);

    const FilterDropdown = ({ columnKey, options }: { columnKey: string, options: { label: string, value: string }[] }) => {
        if (openFilter !== columnKey) return null;
        return (
            <div className="absolute top-full right-0 mt-2 w-48 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-50">
                <div className="p-2 space-y-1">
                    <button
                        className={cn("w-full text-left px-3 py-2 rounded hover:bg-gray-700 text-sm", !activeFilters[columnKey] && "bg-blue-900/30 text-blue-400")}
                        onClick={() => {
                            onFilter?.(columnKey, null);
                            setOpenFilter(null);
                        }}
                    >
                        All
                    </button>
                    {options.map(opt => (
                        <button
                            key={opt.value}
                            className={cn("w-full text-left px-3 py-2 rounded hover:bg-gray-700 text-sm", activeFilters[columnKey] === opt.value && "bg-blue-900/30 text-blue-400")}
                            onClick={() => {
                                onFilter?.(columnKey, opt.value);
                                setOpenFilter(null);
                            }}
                        >
                            {opt.label}
                        </button>
                    ))}
                </div>
            </div>
        );
    };

    if (isLoading) {
        return <div className="text-center py-20 text-gray-500">Loading market data...</div>;
    }

    return (
        <>
            <div className="overflow-x-auto rounded-lg border border-gray-800 bg-gray-900/50 min-h-[600px]">
                <table className="w-full text-sm text-left relative">
                    <thead className="text-xs text-gray-400 uppercase bg-gray-800/50 sticky top-0 z-20 backdrop-blur-sm">
                        <tr>
                            {!simpleMode && (
                                <th
                                    className={cn("px-4 py-3 cursor-pointer transition-colors hover:bg-gray-800", sortConfig.key === "rank" ? "text-blue-400" : "text-gray-400 hover:text-white")}
                                    onClick={() => onSort("rank")}
                                >
                                    <div className="flex items-center gap-1">
                                        Rank
                                        {sortConfig.key === "rank" && (sortConfig.direction === "asc" ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />)}
                                    </div>
                                </th>
                            )}
                            <th className="px-4 py-3">Symbol</th>
                            <th
                                className={cn("px-4 py-3 cursor-pointer transition-colors hover:bg-gray-800", sortConfig.key === "current_price" ? "text-blue-400" : "text-gray-400 hover:text-white")}
                                onClick={() => onSort("current_price")}
                            >
                                <div className="flex items-center gap-1">
                                    Price
                                    {sortConfig.key === "current_price" && (sortConfig.direction === "asc" ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />)}
                                </div>
                            </th>
                            {!simpleMode && (
                                <th
                                    className={cn("px-4 py-3 cursor-pointer transition-colors hover:bg-gray-800", sortConfig.key === "current_change_pct" ? "text-blue-400" : "text-gray-400 hover:text-white")}
                                    onClick={() => onSort("current_change_pct")}
                                >
                                    <div className="flex items-center gap-1">
                                        Change % (Current)
                                        {sortConfig.key === "current_change_pct" && (sortConfig.direction === "asc" ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />)}
                                    </div>
                                </th>
                            )}
                            {!simpleMode && (
                                <>
                                    <th
                                        className={cn("px-4 py-3 text-xs cursor-pointer transition-colors hover:bg-gray-800", sortConfig.key === "day_1_change_pct" ? "text-blue-400" : "text-gray-500 hover:text-white")}
                                        onClick={() => onSort("day_1_change_pct")}
                                    >
                                        <div className="flex items-center gap-1">
                                            Day 1 % (P)
                                            {sortConfig.key === "day_1_change_pct" && (sortConfig.direction === "asc" ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />)}
                                        </div>
                                    </th>
                                    <th
                                        className={cn("px-4 py-3 text-xs cursor-pointer transition-colors hover:bg-gray-800", sortConfig.key === "day_2_change_pct" ? "text-blue-400" : "text-gray-500 hover:text-white")}
                                        onClick={() => onSort("day_2_change_pct")}
                                    >
                                        <div className="flex items-center gap-1">
                                            Day 2 % (P)
                                            {sortConfig.key === "day_2_change_pct" && (sortConfig.direction === "asc" ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />)}
                                        </div>
                                    </th>
                                    <th
                                        className={cn("px-4 py-3 text-xs cursor-pointer transition-colors hover:bg-gray-800", sortConfig.key === "day_3_change_pct" ? "text-blue-400" : "text-gray-500 hover:text-white")}
                                        onClick={() => onSort("day_3_change_pct")}
                                    >
                                        <div className="flex items-center gap-1">
                                            Day 3 % (P)
                                            {sortConfig.key === "day_3_change_pct" && (sortConfig.direction === "asc" ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />)}
                                        </div>
                                    </th>
                                </>
                            )}
                            <th
                                className={cn("px-4 py-3 cursor-pointer transition-colors hover:bg-gray-800", sortConfig.key === "avg_3_day_change_pct" ? "text-blue-400" : "text-gray-400 hover:text-white")}
                                onClick={() => onSort("avg_3_day_change_pct")}
                            >
                                <div className="flex items-center gap-1">
                                    3-Day Avg %
                                    {sortConfig.key === "avg_3_day_change_pct" && (sortConfig.direction === "asc" ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />)}
                                </div>
                            </th>
                            {!simpleMode && (
                                <>
                                    <th className="px-4 py-3 relative">
                                        <div className="flex items-center justify-between gap-2">
                                            <span>Indicators</span>
                                            <div className="flex gap-1">
                                                <button
                                                    onClick={() => setOpenFilter(openFilter === "macd_status" ? null : "macd_status")}
                                                    className={cn("p-1 rounded hover:bg-gray-700", activeFilters["macd_status"] ? "text-blue-400" : "text-gray-500")}
                                                    title="Filter MACD"
                                                >
                                                    <span className="text-[10px] font-bold">M</span>
                                                    <Filter className="w-3 h-3 inline ml-0.5" />
                                                </button>
                                                <button
                                                    onClick={() => setOpenFilter(openFilter === "rsi_zone" ? null : "rsi_zone")}
                                                    className={cn("p-1 rounded hover:bg-gray-700", activeFilters["rsi_zone"] ? "text-blue-400" : "text-gray-500")}
                                                    title="Filter RSI"
                                                >
                                                    <span className="text-[10px] font-bold">R</span>
                                                    <Filter className="w-3 h-3 inline ml-0.5" />
                                                </button>
                                            </div>
                                        </div>
                                        <FilterDropdown
                                            columnKey="macd_status"
                                            options={[
                                                { label: "Above Zero (Bullish)", value: "above_zero" },
                                                { label: "Below Zero (Bearish)", value: "below_zero" },
                                                { label: "Near Zero (Neutral)", value: "near_zero" },
                                            ]}
                                        />
                                        <FilterDropdown
                                            columnKey="rsi_zone"
                                            options={[
                                                { label: "Overbought (>70)", value: "overbought" },
                                                { label: "Oversold (<30)", value: "oversold" },
                                                { label: "Neutral (30-70)", value: "neutral" },
                                            ]}
                                        />
                                    </th>
                                    <th className="px-4 py-3 relative">
                                        <div className="flex items-center justify-between gap-2">
                                            <span
                                                className={cn("cursor-pointer transition-colors hover:text-white", sortConfig.key === "buyer_strength_score" ? "text-blue-400" : "text-gray-400")}
                                                onClick={() => onSort("buyer_strength_score")}
                                            >
                                                Strength
                                            </span>
                                            <button
                                                onClick={() => setOpenFilter(openFilter === "strength" ? null : "strength")}
                                                className={cn("p-1 rounded hover:bg-gray-700", activeFilters["strength"] ? "text-blue-400" : "text-gray-500")}
                                            >
                                                <Filter className="w-3 h-3" />
                                            </button>
                                        </div>
                                        <FilterDropdown
                                            columnKey="strength"
                                            options={[
                                                { label: "Buyers Dominating", value: "buyers" },
                                                { label: "Sellers Dominating", value: "sellers" },
                                                { label: "Balanced", value: "balanced" },
                                            ]}
                                        />
                                    </th>
                                    <th className="px-4 py-3 text-right">Action</th>
                                </>
                            )}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800">
                        {displayedStocks.map((stock) => (
                            <tr
                                key={stock.symbol}
                                className="hover:bg-gray-800/50 transition-colors group cursor-pointer"
                                onClick={() => setSelectedStock(stock)}
                            >
                                {!simpleMode && <td className="px-4 py-3 font-medium text-gray-300">#{stock.rank}</td>}
                                <td className="px-4 py-3">
                                    <div className="font-bold text-white">{stock.symbol}</div>
                                    <div className="text-xs text-gray-500">{stock.name || stock.symbol}</div>
                                </td>
                                <td className="px-4 py-3 font-mono text-white">₹{stock.current_price.toFixed(2)}</td>
                                {!simpleMode && (
                                    <td className={cn("px-4 py-3 font-medium",
                                        stock.current_change_pct > 0 ? "text-green-500" : stock.current_change_pct < 0 ? "text-red-500" : "text-gray-400"
                                    )}>
                                        <div className="flex items-center gap-1">
                                            {stock.current_change_pct > 0 ? <ArrowUp className="w-3 h-3" /> : stock.current_change_pct < 0 ? <ArrowDown className="w-3 h-3" /> : <Minus className="w-3 h-3" />}
                                            {stock.current_change_pct.toFixed(2)}%
                                        </div>
                                    </td>
                                )}
                                {!simpleMode && (
                                    <>
                                        <td className={cn("px-4 py-3 text-xs", stock.history.day_1_change_pct > 0 ? "text-green-500" : "text-red-500")}>
                                            <div className="flex items-center gap-1">
                                                {stock.history.day_1_change_pct > 0 ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                                                {stock.history.day_1_change_pct.toFixed(2)}%
                                            </div>
                                        </td>
                                        <td className={cn("px-4 py-3 text-xs", stock.history.day_2_change_pct > 0 ? "text-green-500" : "text-red-500")}>
                                            <div className="flex items-center gap-1">
                                                {stock.history.day_2_change_pct > 0 ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                                                {stock.history.day_2_change_pct.toFixed(2)}%
                                            </div>
                                        </td>
                                        <td className={cn("px-4 py-3 text-xs", stock.history.day_3_change_pct > 0 ? "text-green-500" : "text-red-500")}>
                                            <div className="flex items-center gap-1">
                                                {stock.history.day_3_change_pct > 0 ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                                                {stock.history.day_3_change_pct.toFixed(2)}%
                                            </div>
                                        </td>
                                    </>
                                )}
                                <td className={cn("px-4 py-3 font-medium",
                                    Math.abs(stock.history.avg_3_day_change_pct) < 0.01 ? "text-blue-400" :
                                        stock.history.avg_3_day_change_pct > 0 ? "text-green-400" : "text-red-400"
                                )}>
                                    <div className="flex items-center gap-1">
                                        {stock.history.avg_3_day_change_pct > 0 ? <ArrowUp className="w-3 h-3" /> : stock.history.avg_3_day_change_pct < 0 ? <ArrowDown className="w-3 h-3" /> : <Minus className="w-3 h-3" />}
                                        {stock.history.avg_3_day_change_pct.toFixed(2)}%
                                    </div>
                                </td>
                                {!simpleMode && (
                                    <>
                                        <td className="px-4 py-3">
                                            <div className="flex flex-col gap-1 text-xs">
                                                <span className={cn(
                                                    stock.indicators.macd_status === "above_zero" ? "text-green-500" :
                                                        stock.indicators.macd_status === "below_zero" ? "text-red-500" : "text-gray-400"
                                                )}>
                                                    MACD: {stock.indicators.macd_status.replace("_", " ")}
                                                </span>
                                                <span className={cn(
                                                    stock.indicators.rsi_status === "overbought" ? "text-red-400" :
                                                        stock.indicators.rsi_status === "oversold" ? "text-green-400" : "text-gray-400"
                                                )}>
                                                    RSI: {stock.indicators.rsi_status} ({stock.indicators.rsi_value?.toFixed(0)})
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="w-24 h-2 bg-gray-700 rounded-full overflow-hidden flex">
                                                <div className="bg-green-500 h-full" style={{ width: `${stock.indicators.buyer_strength_score}%` }} />
                                                <div className="bg-red-500 h-full" style={{ width: `${stock.indicators.seller_strength_score}%` }} />
                                            </div>
                                            <div className="text-xs mt-1 text-gray-400 capitalize">{stock.indicators.strength_label}</div>
                                        </td>
                                        <td className="px-4 py-3 text-right">

                                            <button
                                                className="p-2 hover:bg-gray-700 rounded-full transition-colors text-gray-400 hover:text-yellow-500"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleToggleWatchlist(stock.symbol);
                                                }}
                                            >
                                                <Star className={cn("w-4 h-4", isInWatchlist(stock.symbol) ? "fill-yellow-500 text-yellow-500" : "")} />
                                            </button>
                                        </td>
                                    </>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {!simpleMode && stocks.length > displayCount && (
                <div className="mt-4 flex justify-center">
                    <button
                        onClick={handleLoadMore}
                        className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full text-sm font-medium transition-colors"
                    >
                        Load More Stocks
                    </button>
                </div>
            )}

            <StockDetailModal
                stock={selectedStock}
                onClose={() => setSelectedStock(null)}
            />
        </>
    );
}
