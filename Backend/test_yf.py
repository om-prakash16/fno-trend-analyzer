import yfinance as yf
print("yfinance imported")
try:
    t = yf.Ticker("RELIANCE.NS")
    print(f"Price: {t.fast_info.last_price}")
    print("Fetch success")
except Exception as e:
    print(f"Fetch failed: {e}")
