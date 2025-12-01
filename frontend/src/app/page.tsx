"use client";

import { useState } from "react";
import StocksTable from "@/components/StocksTable";
import FiltersPanel from "@/components/FiltersPanel";
import { useStocks } from "@/hooks/useStocks";

export default function Home() {
  const [filters, setFilters] = useState<any>({});
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({});
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: "asc" | "desc" }>({ key: "avg_3_day_change_pct", direction: "desc" });

  // Merge sort and active header filters into main filters for API
  const queryFilters = {
    ...filters,
    ...activeFilters,
    sort_by: sortConfig.key,
    sort_dir: sortConfig.direction,
  };

  const { data: stocks, isLoading, error } = useStocks(queryFilters);

  const handleSort = (key: string) => {
    setSortConfig((current) => ({
      key,
      direction: current.key === key && current.direction === "desc" ? "asc" : "desc",
    }));
  };

  const handleHeaderFilter = (key: string, value: string | null) => {
    setActiveFilters(prev => {
      const next = { ...prev };
      if (value === null) {
        delete next[key];
      } else {
        next[key] = value;
      }
      return next;
    });
  };

  const handleReset = () => {
    setFilters({});
    setActiveFilters({});
    setSortConfig({ key: "avg_3_day_change_pct", direction: "desc" });
  };

  return (
    <div className="flex flex-col md:flex-row gap-6">
      <FiltersPanel filters={filters} setFilters={setFilters} onReset={handleReset} />

      <div className="flex-1 min-w-0">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">F&O Stocks Analysis</h1>
          <div className="text-sm text-gray-400">
            {stocks?.length || 0} stocks found
          </div>
        </div>

        {error ? (
          <div className="p-4 bg-red-900/50 border border-red-800 rounded-lg text-red-200">
            Error loading data: {(error as Error).message}. Ensure backend is running on port 8000.
          </div>
        ) : (
          <StocksTable
            stocks={stocks || []}
            isLoading={isLoading}
            onSort={handleSort}
            sortConfig={sortConfig}
            onFilter={handleHeaderFilter}
            activeFilters={activeFilters}
          />
        )}
      </div>
    </div>
  );
}
