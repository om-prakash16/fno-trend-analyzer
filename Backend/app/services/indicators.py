import pandas as pd
import numpy as np
from typing import Tuple

def calculate_rsi(series: pd.Series, period: int = 14) -> pd.Series:
    delta = series.diff()
    gain = (delta.where(delta > 0, 0)).rolling(window=period).mean()
    loss = (-delta.where(delta < 0, 0)).rolling(window=period).mean()
    
    rs = gain / loss
    rsi = 100 - (100 / (1 + rs))
    return rsi

def calculate_macd(series: pd.Series) -> Tuple[pd.Series, pd.Series, pd.Series]:
    exp1 = series.ewm(span=12, adjust=False).mean()
    exp2 = series.ewm(span=26, adjust=False).mean()
    macd = exp1 - exp2
    signal = macd.ewm(span=9, adjust=False).mean()
    histogram = macd - signal
    return macd, signal, histogram

def calculate_ema(series: pd.Series, span: int) -> pd.Series:
    return series.ewm(span=span, adjust=False).mean()

def calculate_sma(series: pd.Series, window: int) -> pd.Series:
    return series.rolling(window=window).mean()

def get_macd_status(macd: float, signal: float, hist: float) -> str:
    # Logic:
    # macd > signal -> above_zero (Bullish)
    # macd < signal -> below_zero (Bearish)
    # |macd - signal| < threshold -> near_zero (Neutral/Cross)
    
    threshold = 0.05
    diff = macd - signal
    
    if abs(diff) < threshold:
        return "near_zero"
    elif diff > 0:
        return "above_zero"
    else:
        return "below_zero"

def get_rsi_status(rsi: float) -> str:
    # Logic:
    # rsi > 70 -> overbought
    # rsi < 30 -> oversold
    # else -> neutral
    
    if rsi > 70:
        return "overbought"
    elif rsi < 30:
        return "oversold"
    return "neutral"

def get_trend(price: float, ema_20: float, ema_50: float) -> str:
    if price > ema_20 and ema_20 > ema_50:
        return "uptrend"
    elif price < ema_20 and ema_20 < ema_50:
        return "downtrend"
    return "sideways"

def calculate_strength(
    macd_hist: float, rsi: float, volume: int, avg_volume: int, price: float, ema_20: float,
    close: float, high: float, low: float
) -> Tuple[int, int, str]:
    # Logic:
    # - Price Momentum (Close vs EMA20)
    # - Volume Expansion (Vol > Avg Vol)
    # - Candle Position (Close vs Midpoint)
    
    buyer_score = 0
    seller_score = 0
    
    # 1. Price Momentum
    if price > ema_20:
        buyer_score += 30
    else:
        seller_score += 30
        
    # 2. MACD Momentum
    if macd_hist > 0:
        buyer_score += 20
    else:
        seller_score += 20
        
    # 3. RSI Context
    if rsi > 50:
        buyer_score += 10
    else:
        seller_score += 10
        
    # 4. Volume Confirmation
    if volume > avg_volume:
        # High volume confirms the dominant side
        if price > ema_20: buyer_score += 20
        else: seller_score += 20
        
    # 5. Candle Strength (Close relative to High/Low)
    midpoint = (high + low) / 2
    if close > midpoint:
        buyer_score += 20
    else:
        seller_score += 20
        
    # Normalize
    total = buyer_score + seller_score
    if total > 0:
        buyer_score = int((buyer_score / total) * 100)
        seller_score = int((seller_score / total) * 100)
    else:
        buyer_score = 50
        seller_score = 50
        
    # Determine Label
    if buyer_score >= 60:
        label = "buyers"
    elif seller_score >= 60:
        label = "sellers"
    else:
        label = "balanced"
    
    return buyer_score, seller_score, label
