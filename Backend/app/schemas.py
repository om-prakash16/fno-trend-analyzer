from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class StockBase(BaseModel):
    symbol: str
    name: Optional[str] = None
    sector: Optional[str] = None
    current_price: float
    previous_close: float
    current_change_abs: float
    current_change_pct: float
    day_high: float
    day_low: float
    volume: int
    market_cap: Optional[int] = None
    last_updated: datetime

class StockHistory(BaseModel):
    day_1_change_pct: float
    day_2_change_pct: float
    day_3_change_pct: float
    avg_3_day_change_pct: float
    volatility_3_day: float

class Indicators(BaseModel):
    macd_line: Optional[float] = None
    signal_line: Optional[float] = None
    macd_histogram: Optional[float] = None
    macd_status: str  # above_zero, below_zero, near_zero
    
    rsi_value: Optional[float] = None
    rsi_status: str # overbought, oversold, neutral
    
    sma_20: Optional[float] = None
    sma_50: Optional[float] = None
    ema_20: Optional[float] = None
    ema_50: Optional[float] = None
    trend: str # uptrend, downtrend, sideways
    
    buyer_strength_score: int
    seller_strength_score: int
    strength_label: str # buyers, sellers, balanced

class StockFlags(BaseModel):
    is_constant_price: bool
    is_gainer_today: bool
    is_loser_today: bool
    is_high_volume: bool
    is_breakout_candidate: bool

class ChartDataPoint(BaseModel):
    date: str
    open: float
    high: float
    low: float
    close: float
    volume: int
    macd: Optional[float] = None
    signal: Optional[float] = None
    hist: Optional[float] = None
    rsi: Optional[float] = None
    ema_20: Optional[float] = None
    ema_50: Optional[float] = None

class StockResponse(StockBase):
    rank: int
    history: StockHistory
    indicators: Indicators
    flags: StockFlags
    chart_data: List[ChartDataPoint] = []

class WatchlistAdd(BaseModel):
    symbol: str
    action: str # add, remove

class WatchlistResponse(BaseModel):
    watchlist: List[StockResponse]
