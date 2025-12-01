import asyncio
from app.services.stocks import refresh_market_data

if __name__ == "__main__":
    print("Running manual refresh...")
    asyncio.run(refresh_market_data())
