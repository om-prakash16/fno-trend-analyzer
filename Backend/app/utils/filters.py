from typing import List, Optional
from app.schemas import StockResponse

def apply_filters(
    stocks: List[StockResponse],
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
) -> List[StockResponse]:
    
    # Create a shallow copy to avoid modifying the cache in-place
    filtered = list(stocks)
    
    # 1. Search
    if search:
        search_lower = search.lower()
        filtered = [s for s in filtered if search_lower in s.symbol.lower() or (s.name and search_lower in s.name.lower())]
        
    # 2. Sector
    if sector:
        filtered = [s for s in filtered if s.sector == sector]
        
    # 3. Price
    if min_price is not None:
        filtered = [s for s in filtered if s.current_price >= min_price]
    if max_price is not None:
        filtered = [s for s in filtered if s.current_price <= max_price]
        
    # 4. Volume
    if min_volume is not None:
        filtered = [s for s in filtered if s.volume >= min_volume]
    if max_volume is not None:
        filtered = [s for s in filtered if s.volume <= max_volume]
        
    # 5. Change %
    if min_change_pct is not None:
        filtered = [s for s in filtered if s.current_change_pct >= min_change_pct]
    if max_change_pct is not None:
        filtered = [s for s in filtered if s.current_change_pct <= max_change_pct]
        
    # 6. Avg 3-Day Change %
    if min_avg_3day_pct is not None:
        filtered = [s for s in filtered if s.history.avg_3_day_change_pct >= min_avg_3day_pct]
    if max_avg_3day_pct is not None:
        filtered = [s for s in filtered if s.history.avg_3_day_change_pct <= max_avg_3day_pct]
        
    # 7. Volatility
    if min_volatility is not None:
        filtered = [s for s in filtered if s.history.volatility_3_day >= min_volatility]
    if max_volatility is not None:
        filtered = [s for s in filtered if s.history.volatility_3_day <= max_volatility]
        
    # 8. Rank
    if max_rank is not None:
        filtered = [s for s in filtered if s.rank <= max_rank]
        
    # 9. Flags
    if constant_only:
        filtered = [s for s in filtered if s.flags.is_constant_price]
    if gainers_only:
        filtered = [s for s in filtered if s.flags.is_gainer_today]
    if losers_only:
        filtered = [s for s in filtered if s.flags.is_loser_today]
    if high_volume_only:
        filtered = [s for s in filtered if s.flags.is_high_volume]
        
    # 10. Indicators (New Logic)
    if macd_status:
        # Supports comma-separated values e.g. "above_zero,near_zero"
        statuses = macd_status.split(',')
        filtered = [s for s in filtered if s.indicators.macd_status in statuses]
        
    if rsi_zone:
        zones = rsi_zone.split(',')
        filtered = [s for s in filtered if s.indicators.rsi_status in zones]
        
    if strength:
        strengths = strength.split(',')
        filtered = [s for s in filtered if s.indicators.strength_label.lower().split(' ')[0] in strengths] 
        # Note: strength_label might be "Buyers Dominating", we match "buyers"

    # 11. Sorting
    if sort_by:
        reverse = sort_dir == "desc"
        
        def get_sort_key(s: StockResponse):
            if sort_by == "rank": return s.rank
            if sort_by == "symbol": return s.symbol
            if sort_by == "price": return s.current_price
            if sort_by == "change": return s.current_change_pct
            if sort_by == "volume": return s.volume
            if sort_by == "avg_3day": return s.history.avg_3_day_change_pct
            if sort_by == "volatility": return s.history.volatility_3_day
            if sort_by == "rsi": return s.indicators.rsi_value or 0
            if sort_by == "strength": return s.indicators.buyer_strength_score
            return s.rank
            
        filtered.sort(key=get_sort_key, reverse=reverse)
        
    return filtered
