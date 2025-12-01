"use client";

import { Search, X } from "lucide-react";

interface FiltersPanelProps {
    filters: any;
    setFilters: (filters: any) => void;
    onReset?: () => void;
}

export default function FiltersPanel({ filters, setFilters, onReset }: FiltersPanelProps) {
    const handleChange = (key: string, value: any) => {
        setFilters({ ...filters, [key]: value });
    };

    const clearFilters = () => {
        if (onReset) {
            onReset();
        } else {
            setFilters({});
        }
    };

    return (
        <div className="w-full md:w-64 flex-shrink-0 bg-gray-900/50 border border-gray-800 rounded-lg p-4 h-fit sticky top-24">
            <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-lg text-white">Filters</h2>
                <button
                    onClick={clearFilters}
                    className="px-3 py-1.5 text-xs font-medium text-red-400 bg-red-500/10 border border-red-500/20 rounded hover:bg-red-500/20 transition-colors"
                >
                    Reset Filters
                </button>
            </div>

            <div className="space-y-4">
                {/* Search */}
                <div>
                    <label className="text-xs text-gray-400 mb-1 block">Search</label>
                    <div className="relative">
                        <Search className="absolute left-2 top-2.5 w-4 h-4 text-gray-500" />
                        <input
                            type="text"
                            placeholder="Symbol or Name"
                            className="w-full bg-gray-800 border border-gray-700 rounded-md py-2 pl-8 pr-3 text-sm text-white focus:outline-none focus:border-blue-500"
                            value={filters.search || ""}
                            onChange={(e) => handleChange("search", e.target.value)}
                        />
                    </div>
                </div>

                {/* Sector */}
                <div>
                    <label className="text-xs text-gray-400 mb-1 block">Sector</label>
                    <select
                        className="w-full bg-gray-800 border border-gray-700 rounded-md py-2 px-3 text-sm text-white focus:outline-none focus:border-blue-500"
                        value={filters.sector || ""}
                        onChange={(e) => handleChange("sector", e.target.value)}
                    >
                        <option value="">All Sectors</option>
                        <option value="IT">IT</option>
                        <option value="Financials">Financials</option>
                        <option value="Automobile">Automobile</option>
                        <option value="Pharma">Pharma</option>
                        <option value="Energy">Energy</option>
                        <option value="Metals">Metals</option>
                        <option value="Consumer Goods">Consumer Goods</option>
                        <option value="Construction">Construction</option>
                        <option value="Telecom">Telecom</option>
                        <option value="Services">Services</option>
                    </select>
                </div>

                {/* Price Range */}
                <div>
                    <label className="text-xs text-gray-400 mb-1 block">Price Range</label>
                    <div className="flex gap-2">
                        <input
                            type="number"
                            placeholder="Min"
                            className="w-1/2 bg-gray-800 border border-gray-700 rounded-md py-2 px-2 text-sm text-white focus:outline-none focus:border-blue-500"
                            value={filters.min_price || ""}
                            onChange={(e) => handleChange("min_price", e.target.value)}
                        />
                        <input
                            type="number"
                            placeholder="Max"
                            className="w-1/2 bg-gray-800 border border-gray-700 rounded-md py-2 px-2 text-sm text-white focus:outline-none focus:border-blue-500"
                            value={filters.max_price || ""}
                            onChange={(e) => handleChange("max_price", e.target.value)}
                        />
                    </div>
                </div>

                {/* 3-Day Avg Change */}
                <div>
                    <label className="text-xs text-gray-400 mb-1 block">3-Day Avg Change %</label>
                    <div className="flex gap-2">
                        <input
                            type="number"
                            placeholder="Min %"
                            className="w-1/2 bg-gray-800 border border-gray-700 rounded-md py-2 px-2 text-sm text-white focus:outline-none focus:border-blue-500"
                            value={filters.min_avg_3day_pct || ""}
                            onChange={(e) => handleChange("min_avg_3day_pct", e.target.value)}
                        />
                        <input
                            type="number"
                            placeholder="Max %"
                            className="w-1/2 bg-gray-800 border border-gray-700 rounded-md py-2 px-2 text-sm text-white focus:outline-none focus:border-blue-500"
                            value={filters.max_avg_3day_pct || ""}
                            onChange={(e) => handleChange("max_avg_3day_pct", e.target.value)}
                        />
                    </div>
                </div>

                {/* Toggles */}
                <div className="space-y-2 pt-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            className="rounded bg-gray-800 border-gray-700 text-blue-500 focus:ring-0"
                            checked={filters.constant_only || false}
                            onChange={(e) => handleChange("constant_only", e.target.checked)}
                        />
                        <span className="text-sm text-gray-300">Constant Price Only</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            className="rounded bg-gray-800 border-gray-700 text-blue-500 focus:ring-0"
                            checked={filters.gainers_only || false}
                            onChange={(e) => handleChange("gainers_only", e.target.checked)}
                        />
                        <span className="text-sm text-gray-300">Gainers Only</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            className="rounded bg-gray-800 border-gray-700 text-blue-500 focus:ring-0"
                            checked={filters.losers_only || false}
                            onChange={(e) => handleChange("losers_only", e.target.checked)}
                        />
                        <span className="text-sm text-gray-300">Losers Only</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            className="rounded bg-gray-800 border-gray-700 text-blue-500 focus:ring-0"
                            checked={filters.high_volume_only || false}
                            onChange={(e) => handleChange("high_volume_only", e.target.checked)}
                        />
                        <span className="text-sm text-gray-300">High Volume Only</span>
                    </label>
                </div>
            </div>
        </div>
    );
}
