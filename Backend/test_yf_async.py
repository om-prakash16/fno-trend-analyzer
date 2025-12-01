import yfinance as yf
import pandas as pd
import asyncio
import time

async def test_download():
    print("Testing async yfinance download...")
    symbols = ["RELIANCE.NS", "TCS.NS", "INFY.NS", "HDFCBANK.NS", "ICICIBANK.NS"] * 10 # 50 symbols
    
    print(f"Downloading {len(symbols)} symbols...")
    start = time.time()
    try:
        # replicate the app's call exactly
        data = await asyncio.to_thread(yf.download, symbols, period="3mo", group_by='ticker', threads=True, progress=False)
        duration = time.time() - start
        print(f"Download complete in {duration:.2f}s")
        print(data.head())
        if data.empty:
            print("Data is empty!")
        else:
            print("Data fetched successfully.")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    asyncio.run(test_download())
