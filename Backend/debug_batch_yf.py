import yfinance as yf
import pandas as pd
import numpy as np

def calculate_macd(prices, slow=26, fast=12, signal=9):
    exp1 = prices.ewm(span=fast, adjust=False).mean()
    exp2 = prices.ewm(span=slow, adjust=False).mean()
    macd = exp1 - exp2
    signal_line = macd.ewm(span=signal, adjust=False).mean()
    hist = macd - signal_line
    return macd, signal_line, hist

print("Testing processing logic...")
tickers = ["RELIANCE.NS", "TCS.NS"]
try:
    data = yf.download(tickers, period="3mo", group_by='ticker', threads=True, progress=False)
    
    for symbol in tickers:
        if symbol in data.columns.levels[0]:
            hist_data = data[symbol].dropna()
            print(f"\nProcessing {symbol}...")
            print("Type of hist_data:", type(hist_data))
            print("Columns:", hist_data.columns)
            
            closes = hist_data['Close']
            print("Type of closes:", type(closes))
            
            current_price = closes.iloc[-1]
            print("Current Price:", current_price)
            
            macd, sig, hist = calculate_macd(closes)
            print("MACD calculated.")
            
except Exception as e:
    print(f"Error: {e}")
    import traceback
    traceback.print_exc()
