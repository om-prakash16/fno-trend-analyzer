"use client";

import { useState } from "react";
import StocksTable from "@/components/StocksTable";
import FiltersPanel from "@/components/FiltersPanel";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Stock } from "@/hooks/useStocks";

const API_URL = "http://localhost:8000/api/v1";

export default function Nifty100Page() {
    const [filters, setFilters] = useState<any>({});
    const [sortConfig, setSortConfig] = useState<{ key: string; direction: "asc" | "desc" }>({ key: "rank", direction: "asc" });

    const queryFilters = {
        ...filters,
        sort_by: sortConfig.key,
        sort_dir: sortConfig.direction,
    };

    const { data: stocks, isLoading, error } = useQuery({
        queryKey: ["stocks_nifty100", queryFilters],
        queryFn: async () => {
            const params = new URLSearchParams();
            Object.entries(queryFilters).forEach(([key, value]) => {
                if (value !== undefined && value !== null && value !== "") {
                    params.append(key, String(value));
                }
            });

            const { data } = await axios.get<Stock[]>(`${API_URL}/stocks/nifty100`, { params });
            return data;
        },
        refetchInterval: 5000,
    });

    const handleSort = (key: string) => {
        setSortConfig((current) => ({
            key,
            direction: current.key === key && current.direction === "asc" ? "desc" : "asc",
        }));
    };

    return (
        <div className="flex flex-col md:flex-row gap-6">
            <FiltersPanel filters={filters} setFilters={setFilters} />

            <div className="flex-1 min-w-0">
                <div className="mb-4 flex items-center justify-between">
                    <h1 className="text-2xl font-bold text-white">NIFTY 100 Analysis</h1>
                    <div className="text-sm text-gray-400">
                        {stocks?.length || 0} stocks found
                    </div>
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
        </div>
    );
}
