import yfinance as yf
import pandas as pd

print("Testing yfinance Ticker.history...")
try:
    ticker = yf.Ticker("RELIANCE.NS")
    data = ticker.history(period="5d")
    print("Download complete.")
    print(data.head())
    if data.empty:
        print("Data is empty!")
    else:
        print("Data fetched successfully.")
except Exception as e:
    print(f"Error: {e}")
