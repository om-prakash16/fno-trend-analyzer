import yfinance as yf
import pandas as pd
from datetime import datetime
from app.services.indicators import calculate_macd, calculate_rsi, calculate_ema, calculate_strength

def verify_data():
    symbol = "RELIANCE.NS"
    print(f"Fetching data for {symbol}...")
    
    # Simulate the batch download used in stocks.py
    df = yf.download(tickers=[symbol], period="3mo", group_by='ticker', threads=True, progress=False)
    
    # Handle the multi-index structure if present, or single level
    if isinstance(df.columns, pd.MultiIndex):
        stock_df = df[symbol].dropna()
    else:
        stock_df = df.dropna()
        
    print(f"\nLast 3 rows of data:")
    print(stock_df.tail(3)[['Open', 'High', 'Low', 'Close', 'Volume']])
    
    last_date = stock_df.index[-1]
    print(f"\nLast Date in Data: {last_date}")
    print(f"Current System Time: {datetime.now()}")
    
    # Calculate Indicators
    closes = stock_df['Close']
    volumes = stock_df['Volume']
    
    macd, signal, hist = calculate_macd(closes)
    rsi = calculate_rsi(closes)
    ema_20 = calculate_ema(closes, 20)
    
    current_price = closes.iloc[-1]
    avg_volume = volumes.mean()
    
    print(f"\n--- Indicator Inputs for Strength (Last Row) ---")
    print(f"Price: {current_price}")
    print(f"MACD Hist: {hist.iloc[-1]}")
    print(f"RSI: {rsi.iloc[-1]}")
    print(f"Volume: {volumes.iloc[-1]}")
    print(f"Avg Volume: {avg_volume}")
    print(f"EMA 20: {ema_20.iloc[-1]}")
    
    buyer, seller, label = calculate_strength(
        hist.iloc[-1], rsi.iloc[-1], volumes.iloc[-1], avg_volume, current_price, ema_20.iloc[-1]
    )
    
    print(f"\n--- Calculated Strength ---")
    print(f"Buyer Score: {buyer}")
    print(f"Seller Score: {seller}")
    print(f"Label: {label}")

if __name__ == "__main__":
    verify_data()
