import yfinance as yf
import pandas as pd
import numpy as np
import asyncio
import time
import traceback
from datetime import datetime
from typing import List, Dict, Any, Optional
from concurrent.futures import ThreadPoolExecutor
from app.config import settings
from app.schemas import StockResponse, StockHistory, Indicators, StockFlags, ChartDataPoint
from app.services.indicators import (
    calculate_macd, calculate_rsi, calculate_ema, calculate_sma,
    get_macd_status, get_rsi_status, get_trend, calculate_strength
)

# --- Global In-Memory Cache ---
CACHE = {
    "fno": {"data": [], "updated": 0},
    "last_refresh": None
}

# --- Helper Functions ---

def get_safe_value(val, default=None):
    if pd.isna(val):
        return default
    return val

def get_dummy_history() -> StockHistory:
    return StockHistory(
        day_1_change_pct=0.0,
        day_2_change_pct=0.0,
        day_3_change_pct=0.0,
        avg_3_day_change_pct=0.0,
        volatility_3_day=0.0
    )

def get_dummy_indicators() -> Indicators:
    return Indicators(
        macd_status="neutral",
        rsi_status="neutral",
        trend="neutral",
        buyer_strength_score=50,
        seller_strength_score=50,
        strength_label="Loading..."
    )

def get_dummy_flags() -> StockFlags:
    return StockFlags(
        is_constant_price=False,
        is_gainer_today=False,
        is_loser_today=False,
        is_high_volume=False,
        is_breakout_candidate=False
    )

def create_stock_response_from_fast_info(symbol: str, info: Dict) -> StockResponse:
    """
    Creates a StockResponse with just fast_info and dummy history/indicators.
    """
    current_price = info.get('lastPrice', 0.0)
    prev_close = info.get('previousClose', 0.0)
    
    current_change_abs = current_price - prev_close
    current_change_pct = (current_change_abs / prev_close * 100) if prev_close else 0.0
    
    return StockResponse(
        symbol=symbol,
        name=symbol,
        sector=settings.SECTOR_MAPPING.get(symbol, "Unknown"),
        current_price=round(current_price, 2),
        previous_close=round(prev_close, 2),
        current_change_abs=round(current_change_abs, 2),
        current_change_pct=round(current_change_pct, 2),
        day_high=round(info.get('dayHigh', 0.0), 2),
        day_low=round(info.get('dayLow', 0.0), 2),
        volume=int(info.get('volume', 0)),
        market_cap=info.get('marketCap'),
        last_updated=datetime.now(),
        rank=0,
        history=get_dummy_history(),
        indicators=get_dummy_indicators(),
        flags=get_dummy_flags(),
        chart_data=[]
    )

def process_stock_data(symbol: str, hist_data: pd.DataFrame, info: Dict) -> Optional[StockResponse]:
    try:
        if hist_data.empty or len(hist_data) < 5:
            # Fallback to fast info only if history fails
            return create_stock_response_from_fast_info(symbol, info)

        # Extract OHLCV
        closes = hist_data['Close']
        highs = hist_data['High']
        lows = hist_data['Low']
        volumes = hist_data['Volume']
        opens = hist_data['Open']

        current_price = closes.iloc[-1]
        prev_close = closes.iloc[-2]
        
        # Calculate Changes
        current_change_abs = current_price - prev_close
        current_change_pct = (current_change_abs / prev_close) * 100

        day_1_change = ((closes.iloc[-1] - closes.iloc[-2]) / closes.iloc[-2]) * 100
        day_2_change = ((closes.iloc[-2] - closes.iloc[-3]) / closes.iloc[-3]) * 100
        day_3_change = ((closes.iloc[-3] - closes.iloc[-4]) / closes.iloc[-4]) * 100
        
        avg_3_day_change_pct = (day_1_change + day_2_change + day_3_change) / 3
        volatility_3_day = np.std([day_1_change, day_2_change, day_3_change])

        # Indicators
        macd, signal, hist = calculate_macd(closes)
        rsi = calculate_rsi(closes)
        sma_20 = calculate_sma(closes, 20)
        sma_50 = calculate_sma(closes, 50)
        ema_20 = calculate_ema(closes, 20)
        ema_50 = calculate_ema(closes, 50)

        # Status & Strength
        macd_status = get_macd_status(macd.iloc[-1], signal.iloc[-1], hist.iloc[-1])
        rsi_status = get_rsi_status(rsi.iloc[-1])
        trend = get_trend(current_price, ema_20.iloc[-1], ema_50.iloc[-1])
        
        avg_volume = volumes.mean()
        buyer_score, seller_score, strength_label = calculate_strength(
            hist.iloc[-1], rsi.iloc[-1], volumes.iloc[-1], avg_volume, current_price, ema_20.iloc[-1],
            closes.iloc[-1], highs.iloc[-1], lows.iloc[-1]
        )

        # Flags
        is_constant = abs(avg_3_day_change_pct) < 0.0001
        is_gainer = current_change_pct > 0
        is_loser = current_change_pct < 0
        is_high_vol = volumes.iloc[-1] > (avg_volume * 1.5)
        is_breakout = (current_price > highs.iloc[-20:].max()) and is_high_vol

        # Chart Data (Last 60 points or available)
        chart_data = []
        chart_slice = hist_data.tail(60)
        
        for idx, row in chart_slice.iterrows():
            date_str = idx.strftime("%Y-%m-%d") if isinstance(idx, pd.Timestamp) else str(idx)
            
            def get_val(series, i):
                try:
                    val = series.loc[i]
                    return get_safe_value(val)
                except:
                    return None

            chart_data.append(ChartDataPoint(
                date=date_str,
                open=round(row['Open'], 2),
                high=round(row['High'], 2),
                low=round(row['Low'], 2),
                close=round(row['Close'], 2),
                volume=int(row['Volume']),
                macd=get_val(macd, idx),
                signal=get_val(signal, idx),
                hist=get_val(hist, idx),
                rsi=get_val(rsi, idx),
                ema_20=get_val(ema_20, idx),
                ema_50=get_val(ema_50, idx)
            ))

        def get_last(series):
            return round(series.iloc[-1], 2) if not pd.isna(series.iloc[-1]) else None

        return StockResponse(
            symbol=symbol,
            name=symbol,
            sector=settings.SECTOR_MAPPING.get(symbol, "Unknown"),
            current_price=round(current_price, 2),
            previous_close=round(prev_close, 2),
            current_change_abs=round(current_change_abs, 2),
            current_change_pct=round(current_change_pct, 2),
            day_high=round(info.get('dayHigh', highs.iloc[-1]), 2),
            day_low=round(info.get('dayLow', lows.iloc[-1]), 2),
            volume=int(info.get('volume', volumes.iloc[-1])),
            market_cap=info.get('marketCap'),
            last_updated=datetime.now(),
            rank=0, # Will be set later
            history=StockHistory(
                day_1_change_pct=round(day_1_change, 2),
                day_2_change_pct=round(day_2_change, 2),
                day_3_change_pct=round(day_3_change, 2),
                avg_3_day_change_pct=round(avg_3_day_change_pct, 2),
                volatility_3_day=round(volatility_3_day, 2)
            ),
            indicators=Indicators(
                macd_line=get_last(macd),
                signal_line=get_last(signal),
                macd_histogram=get_last(hist),
                macd_status=macd_status,
                rsi_value=get_last(rsi),
                rsi_status=rsi_status,
                sma_20=get_last(sma_20),
                sma_50=get_last(sma_50),
                ema_20=get_last(ema_20),
                ema_50=get_last(ema_50),
                trend=trend,
                buyer_strength_score=buyer_score,
                seller_strength_score=seller_score,
                strength_label=strength_label
            ),
            flags=StockFlags(
                is_constant_price=is_constant,
                is_gainer_today=is_gainer,
                is_loser_today=is_loser,
                is_high_volume=is_high_vol,
                is_breakout_candidate=is_breakout
            ),
            chart_data=chart_data
        )
    except Exception as e:
        # traceback.print_exc()
        print(f"Error processing {symbol}: {e}")
        return None

def fetch_fast_info(symbol: str) -> Dict:
    try:
        ticker = yf.Ticker(symbol)
        info = ticker.fast_info
        return {
            'symbol': symbol,
            'lastPrice': info.last_price,
            'previousClose': info.previous_close,
            'dayHigh': info.day_high,
            'dayLow': info.day_low,
            'volume': info.last_volume,
            'marketCap': info.market_cap
        }
    except Exception:
        return {'symbol': symbol}

def update_cache(stock_list: List[StockResponse]):
    """Helper to update the global cache with a list of stocks."""
    # Sort by absolute change pct (Stability Ranking)
    # Rank 1 = closest to 0
    
    # Sort
    stock_list.sort(key=lambda x: abs(x.history.avg_3_day_change_pct))
    
    # Assign Ranks
    for i, stock in enumerate(stock_list):
        stock.rank = i + 1
        
    print(f"DEBUG: update_cache sorted {len(stock_list)} stocks. Top 3: {[s.symbol for s in stock_list[:3]]}")
    CACHE["fno"] = {"data": stock_list, "updated": time.time()}
    CACHE["last_refresh"] = datetime.now()

async def fetch_stock_history(symbol: str) -> Optional[pd.DataFrame]:
    try:
        # Use history() for single stock to avoid bulk download issues
        ticker = yf.Ticker(symbol)
        # Random delay to avoid 429
        await asyncio.sleep(0.1) 
        hist = await asyncio.to_thread(ticker.history, period="3mo")
        return hist
    except Exception as e:
        print(f"Error fetching {symbol}: {e}")
        return None

async def refresh_market_data():
    """
    Main background task to refresh data.
    Uses BATCHED fetching (yf.download) for speed, but in chunks to avoid rate limits.
    """
    while True:
        try:
            print(f"[{datetime.now()}] Starting F&O market data refresh...", flush=True)
            
            # 1. Define Symbols (Only F&O)
            all_symbols_ordered = settings.FNO_SYMBOLS
            print(f"[{datetime.now()}] Target symbols: {len(all_symbols_ordered)}", flush=True)
            
            processed_stocks = []
            
            # Process in small batches to update cache incrementally
            BATCH_SIZE = 50 
            
            for i in range(0, len(all_symbols_ordered), BATCH_SIZE):
                batch_symbols = all_symbols_ordered[i:i+BATCH_SIZE]
                print(f"Fetching batch {i}-{i+BATCH_SIZE} ({len(batch_symbols)} symbols)...", flush=True)
                
                try:
                    # Bulk download for the batch
                    # group_by='ticker' ensures we get a DataFrame with MultiIndex columns (Ticker, OHLC)
                    batch_data = await asyncio.to_thread(
                        yf.download, 
                        tickers=batch_symbols, 
                        period="3mo", 
                        group_by='ticker', 
                        threads=True, 
                        progress=False
                    )
                    
                    # Process the batch
                    batch_results = []
                    
                    if not batch_data.empty:
                        # yfinance returns different structures depending on 1 vs many tickers
                        # If multiple tickers, columns are MultiIndex: (Ticker, PriceType)
                        # If 1 ticker, columns are just PriceType
                        
                        is_multi = isinstance(batch_data.columns, pd.MultiIndex)
                        
                        for symbol in batch_symbols:
                            try:
                                stock_df = None
                                if is_multi:
                                    # Extract dataframe for this symbol
                                    # Check if symbol is in top level columns
                                    if symbol in batch_data.columns.levels[0]:
                                        stock_df = batch_data[symbol].dropna()
                                else:
                                    # Handle single ticker case if batch size was 1 or only 1 succeeded
                                    if len(batch_symbols) == 1 and symbol == batch_symbols[0]:
                                        stock_df = batch_data.dropna()
                                    else:
                                        # If it's not multi-index and not a single-symbol batch,
                                        # it's ambiguous, so skip.
                                        continue
                                
                                if stock_df is not None and not stock_df.empty:
                                    # Ensure it's a DataFrame
                                    if not isinstance(stock_df, pd.DataFrame):
                                        # print(f"Skipping {symbol}: Expected DataFrame, got {type(stock_df)}", flush=True)
                                        continue

                                    # Try processing
                                    try:
                                        stock = process_stock_data(symbol, stock_df, {})
                                        if stock:
                                            batch_results.append(stock)
                                    except Exception as e:
                                        traceback.print_exc()
                                        print(f"Error processing {symbol}: {e}", flush=True)
                            except Exception as e:
                                print(f"Error extracting {symbol} from batch: {e}", flush=True)
                                continue
                    
                    if batch_results:
                        processed_stocks.extend(batch_results)
                        
                        # Incremental Cache Update
                        current_all = CACHE["fno"]["data"]
                        stock_map = {s.symbol: s for s in current_all}
                        for s in batch_results:
                            stock_map[s.symbol] = s
                        
                        new_list = list(stock_map.values())
                        update_cache(new_list)
                        print(f"Batch {i} processed. Cache size: {len(new_list)}", flush=True)
                    
                    # Sleep to avoid rate limits
                    await asyncio.sleep(2.0) 
                    
                except Exception as e:
                    print(f"Error fetching batch {i}: {e}", flush=True)
                    await asyncio.sleep(5.0) # Longer sleep on error
            
            print(f"[{datetime.now()}] Refresh complete. Total: {len(processed_stocks)}", flush=True)
            await asyncio.sleep(60) # Wait longer before next full cycle

        except Exception as e:
            print(f"Error in refresh loop: {e}", flush=True)
            await asyncio.sleep(20)

# --- Public Accessors (Instant) ---

async def get_fno_data() -> List[StockResponse]:
    return CACHE["fno"]["data"]

async def get_stock_detail(symbol: str) -> Optional[StockResponse]:
    # Look in "fno" cache
    for stock in CACHE["fno"]["data"]:
        if stock.symbol == symbol:
            return stock
    return None

async def get_stocks_by_symbols(symbols: List[str]) -> List[StockResponse]:
    result = []
    target_symbols = set(symbols)
    for stock in CACHE["fno"]["data"]:
        if stock.symbol in target_symbols:
            result.append(stock)
    return result

# --- Initialization ---
def start_background_tasks():
    loop = asyncio.get_event_loop()
    loop.create_task(refresh_market_data())
