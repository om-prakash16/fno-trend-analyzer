from apscheduler.schedulers.asyncio import AsyncIOScheduler
from app.services.stocks import fetch_stock_data
from app.config import settings
from app.services.cache import cache
import asyncio
from datetime import datetime

scheduler = AsyncIOScheduler()

async def update_market_data():
    print(f"[{datetime.now()}] Starting background market data update for {len(settings.ALL_NSE_SYMBOLS)} stocks...")
    try:
        # Fetch data for all symbols
        # We use a longer cache TTL for the background job to ensure it persists until next run
        # But here we are *populating* the cache.
        
        # We might want to batch this if it's too large, but yfinance handles lists well.
        # Let's try fetching all at once.
        stocks = await fetch_stock_data(settings.ALL_NSE_SYMBOLS, include_chart=False, force_update=True)
        
        # The fetch_stock_data function already sets the cache!
        # But it sets it with a specific key based on the list of symbols passed.
        # We need to make sure the API endpoints look for *this* cache key or we need to store individual items?
        
        # Current fetch_stock_data implementation caches the *entire list* under one key.
        # This is fine for "Get All" but not for "Get One".
        # However, get_stock_detail fetches fresh data anyway.
        
        # For the "Movers" and "All Stocks" table, we need this bulk data.
        # The key used in fetch_stock_data is f"stocks_data_{len(symbols)}_{include_chart}"
        # So if we call it with ALL_NSE_SYMBOLS, it will cache it under that key.
        
        # We should also probably cache individual stocks for quick lookup? 
        # For now, let's just ensure the bulk list is fresh.
        
        print(f"[{datetime.now()}] Market data update complete. Fetched {len(stocks)} stocks.")
        
    except Exception as e:
        print(f"[{datetime.now()}] Error in background update: {e}")

def start_scheduler():
    # Run immediately on startup
    scheduler.add_job(update_market_data, 'interval', seconds=60, id='market_update', next_run_time=datetime.now())
    scheduler.start()
