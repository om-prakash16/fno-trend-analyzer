import asyncio
import sys
import os

# Add backend to path
sys.path.append(os.path.join(os.getcwd(), 'backend'))

from app.services.stocks import fetch_stock_data
from app.config import settings

async def main():
    print("Fetching NIFTY 50 data...")
    try:
        # Fetch just one symbol to test
        stocks = await fetch_stock_data(["RELIANCE.NS"], include_chart=True)
        print(f"Successfully fetched {len(stocks)} stocks")
        if stocks:
            print(f"Stock: {stocks[0].symbol}")
            print(f"Chart data points: {len(stocks[0].chart_data)}")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    asyncio.run(main())
