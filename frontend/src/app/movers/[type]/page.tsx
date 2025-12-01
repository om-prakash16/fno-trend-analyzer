"use client";

import { useGainers3Day, useLosers3Day } from "@/hooks/useStocks";
import StocksTable from "@/components/StocksTable";
import { useState } from "react";
import { useParams } from "next/navigation";

export default function MoversPage() {
    const params = useParams();
    const type = params.type as string; // 'gainers' or 'losers'

    const [sortConfig, setSortConfig] = useState<{ key: string; direction: "asc" | "desc" }>({
        key: "avg_3_day_change_pct",
        direction: type === "gainers" ? "desc" : "asc",
    });

    // We use the specific hooks which already sort by default, but we allow client-side sorting too
    const { data: gainers, isLoading: loadingGainers, error: errorGainers } = useGainers3Day();
    const { data: losers, isLoading: loadingLosers, error: errorLosers } = useLosers3Day();

    const stocks = type === "gainers" ? gainers : losers;
    const isLoading = type === "gainers" ? loadingGainers : loadingLosers;
    const error = type === "gainers" ? errorGainers : errorLosers;

    const handleSort = (key: string) => {
        setSortConfig((current) => ({
            key,
            direction: current.key === key && current.direction === "desc" ? "asc" : "desc",
        }));
    };

    const title = type === "gainers" ? "Top 3-Day Gainers" : "Top 3-Day Losers";

    return (
        <main className="container mx-auto px-4 py-8">
            <div className="flex flex-col gap-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold text-white">{title}</h1>
                    <button
                        onClick={() => setSortConfig({
                            key: "avg_3_day_change_pct",
                            direction: type === "gainers" ? "desc" : "asc",
                        })}
                        className="px-3 py-1.5 text-xs font-medium text-red-400 bg-red-500/10 border border-red-500/20 rounded hover:bg-red-500/20 transition-colors"
                    >
                        Reset Sort
                    </button>
                </div>

                {error ? (
                    <div className="p-4 bg-red-900/50 border border-red-800 rounded-lg text-red-200">
                        Error loading data: {(error as Error).message}. Ensure backend is running.
                    </div>
                ) : (
                    <StocksTable
                        stocks={stocks || []}
                        isLoading={isLoading}
                        onSort={handleSort}
                        sortConfig={sortConfig}
                    />
                )}
            </div>
        </main>
    );
}
