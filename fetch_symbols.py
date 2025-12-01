import nselib
from nselib import capital_market
import pandas as pd

def get_all_nse_symbols():
    try:
        # Fetch equity list
        print("Fetching equity list from NSE...")
        df = capital_market.equity_list()
        
        # Filter for active stocks if needed, but usually this list is all listed
        # We need the 'SYMBOL' column
        symbols = df['SYMBOL'].tolist()
        
        # Append .NS for yfinance
        yf_symbols = [f"{sym}.NS" for sym in symbols]
        
        print(f"Found {len(yf_symbols)} symbols.")
        
        # Save to a file or print first 10
        print("First 10 symbols:", yf_symbols[:10])
        
        return yf_symbols
    except Exception as e:
        print(f"Error: {e}")
        return []

if __name__ == "__main__":
    get_all_nse_symbols()
