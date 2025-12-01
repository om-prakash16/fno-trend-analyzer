"use client";

import StocksTable from "@/components/StocksTable";
import { useWatchlist } from "@/hooks/useStocks";
import { useState } from "react";

export default function WatchlistPage() {
    const { data: stocks, isLoading } = useWatchlist();
    const [sortConfig, setSortConfig] = useState<{ key: string; direction: "asc" | "desc" }>({ key: "avg_3_day_change_pct", direction: "desc" });

    const handleSort = (key: string) => {
        setSortConfig((current) => ({
            key,
            direction: current.key === key && current.direction === "desc" ? "asc" : "desc",
        }));
    };

    // Client-side sorting for watchlist (since API returns list)
    const sortedStocks = [...(stocks || [])].sort((a, b) => {
        const aValue = (a as any)[sortConfig.key] || (a.history as any)[sortConfig.key] || 0;
        const bValue = (b as any)[sortConfig.key] || (b.history as any)[sortConfig.key] || 0;

        if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
    });

    return (
        <div>
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white">My Watchlist</h1>
                    <p className="text-gray-400">Track your favorite stocks</p>
                </div>
                <button
                    onClick={() => setSortConfig({ key: "avg_3_day_change_pct", direction: "desc" })}
                    className="px-3 py-1.5 text-xs font-medium text-red-400 bg-red-500/10 border border-red-500/20 rounded hover:bg-red-500/20 transition-colors"
                >
                    Reset Sort
                </button>
            </div>

            {stocks?.length === 0 && !isLoading ? (
                <div className="text-center py-20 text-gray-500">
                    Your watchlist is empty. Add stocks from the dashboard.
                </div>
            ) : (
                <StocksTable
                    stocks={sortedStocks}
                    isLoading={isLoading}
                    onSort={handleSort}
                    sortConfig={sortConfig}
                />
            )}
        </div>
    );
}
