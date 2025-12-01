from fastapi import APIRouter, Query, HTTPException, BackgroundTasks
from typing import List, Optional
from app.schemas import StockResponse
from app.services.stocks import get_fno_data, get_stock_detail
from app.config import settings
from app.utils.filters import apply_filters

router = APIRouter(prefix="/stocks", tags=["stocks"])

@router.get("/fno", response_model=List[StockResponse])
async def get_fno_stocks(
    search: Optional[str] = None,
    sector: Optional[str] = None,
    min_price: Optional[float] = None,
    max_price: Optional[float] = None,
    min_volume: Optional[int] = None,
    max_volume: Optional[int] = None,
    min_change_pct: Optional[float] = None,
    max_change_pct: Optional[float] = None,
    min_avg_3day_pct: Optional[float] = None,
    max_avg_3day_pct: Optional[float] = None,
    min_volatility: Optional[float] = None,
    max_volatility: Optional[float] = None,
    max_rank: Optional[int] = None,
    constant_only: bool = False,
    gainers_only: bool = False,
    losers_only: bool = False,
    high_volume_only: bool = False,
    macd_status: Optional[str] = None,
    rsi_zone: Optional[str] = None,
    strength: Optional[str] = None,
    sort_by: Optional[str] = None,
    sort_dir: str = "asc"
):
    # Instant fetch from cache
    stocks = await get_fno_data()
    
    # Apply filters in-memory (fast)
    filtered_stocks = apply_filters(
        stocks,
        search=search,
        sector=sector,
        min_price=min_price,
        max_price=max_price,
        min_volume=min_volume,
        max_volume=max_volume,
        min_change_pct=min_change_pct,
        max_change_pct=max_change_pct,
        min_avg_3day_pct=min_avg_3day_pct,
        max_avg_3day_pct=max_avg_3day_pct,
        min_volatility=min_volatility,
        max_volatility=max_volatility,
        max_rank=max_rank,
        constant_only=constant_only,
        gainers_only=gainers_only,
        losers_only=losers_only,
        high_volume_only=high_volume_only,
        macd_status=macd_status,
        rsi_zone=rsi_zone,
        strength=strength,
        sort_by=sort_by,
        sort_dir=sort_dir
    )
    
    # Ensure default sort is by Rank (Stability) if no sort specified
    if not sort_by:
        filtered_stocks.sort(key=lambda x: x.rank)
        
    return filtered_stocks

@router.get("/gainers-3day", response_model=List[StockResponse])
async def get_gainers_3day(limit: int = 20):
    stocks = await get_fno_data()
    # Sort by avg_3_day_change_pct descending
    sorted_stocks = sorted(stocks, key=lambda x: x.history.avg_3_day_change_pct, reverse=True)
    return sorted_stocks[:limit]

@router.get("/losers-3day", response_model=List[StockResponse])
async def get_losers_3day(limit: int = 20):
    stocks = await get_fno_data()
    # Sort by avg_3_day_change_pct ascending
    sorted_stocks = sorted(stocks, key=lambda x: x.history.avg_3_day_change_pct)
    return sorted_stocks[:limit]

@router.get("/{symbol}", response_model=StockResponse)
async def get_stock(symbol: str):
    stock = await get_stock_detail(symbol)
    if not stock:
        raise HTTPException(status_code=404, detail="Stock not found")
    return stock
