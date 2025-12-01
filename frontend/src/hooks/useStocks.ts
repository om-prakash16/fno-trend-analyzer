import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

// Types
export interface ChartDataPoint {
    date: string;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
    macd?: number;
    signal?: number;
    hist?: number;
    rsi?: number;
    ema_20?: number;
    ema_50?: number;
}

export interface Stock {
    symbol: string;
    name?: string;
    sector?: string;
    current_price: number;
    previous_close: number;
    current_change_abs: number;
    current_change_pct: number;
    day_high: number;
    day_low: number;
    volume: number;
    market_cap?: number;
    last_updated: string;
    rank: number;
    history: {
        day_1_change_pct: number;
        day_2_change_pct: number;
        day_3_change_pct: number;
        avg_3_day_change_pct: number;
        volatility_3_day: number;
    };
    indicators: {
        macd_line?: number;
        signal_line?: number;
        macd_histogram?: number;
        macd_status: string; // above_zero, below_zero, near_zero
        rsi_value?: number;
        rsi_status: string; // overbought, oversold, neutral
        sma_20?: number;
        sma_50?: number;
        ema_20?: number;
        ema_50?: number;
        trend: string;
        buyer_strength_score: number;
        seller_strength_score: number;
        strength_label: string; // buyers, sellers, balanced
    };
    flags: {
        is_constant_price: boolean;
        is_gainer_today: boolean;
        is_loser_today: boolean;
        is_high_volume: boolean;
        is_breakout_candidate: boolean;
    };
    chart_data?: ChartDataPoint[];
}

const API_URL = "http://localhost:8000/api/v1";

export function useStocks(filters: any) {
    return useQuery({
        queryKey: ["stocks", "fno", filters],
        queryFn: async () => {
            const params = new URLSearchParams();
            Object.entries(filters).forEach(([key, value]) => {
                if (value !== undefined && value !== null && value !== "") {
                    params.append(key, String(value));
                }
            });

            const url = `${API_URL}/stocks/fno`;
            const { data } = await axios.get<Stock[]>(url, { params });
            return data;
        },
        refetchInterval: 15000, // 15 seconds to reduce load
        staleTime: 10000, // Consider data fresh for 10 seconds
    });
}

export function useStockDetail(symbol: string | null) {
    return useQuery({
        queryKey: ["stock", symbol],
        queryFn: async () => {
            if (!symbol) return null;
            const { data } = await axios.get<Stock>(`${API_URL}/stocks/${symbol}`);
            return data;
        },
        enabled: !!symbol,
        refetchInterval: 15000,
    });
}

export function useWatchlist() {
    return useQuery({
        queryKey: ["watchlist"],
        queryFn: async () => {
            const { data } = await axios.get<Stock[]>(`${API_URL}/watchlist`);
            return data;
        },
        refetchInterval: 5000,
    });
}

export function useToggleWatchlist() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ symbol, action }: { symbol: string; action: "add" | "remove" }) => {
            const { data } = await axios.post(`${API_URL}/watchlist/`, { symbol, action });
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["watchlist"] });
        },
    });
}

export function useGainers3Day() {
    return useQuery({
        queryKey: ["stocks", "gainers-3day"],
        queryFn: async () => {
            const { data } = await axios.get<Stock[]>(`${API_URL}/stocks/gainers-3day`);
            return data;
        },
        refetchInterval: 15000,
    });
}

export function useLosers3Day() {
    return useQuery({
        queryKey: ["stocks", "losers-3day"],
        queryFn: async () => {
            const { data } = await axios.get<Stock[]>(`${API_URL}/stocks/losers-3day`);
            return data;
        },
        refetchInterval: 15000,
    });
}
