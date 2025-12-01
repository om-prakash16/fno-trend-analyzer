from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.routes import stocks, watchlist
from app.services.stocks import start_background_tasks
from contextlib import asynccontextmanager

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    # Startup
    try:
        import asyncio
        from app.services.stocks import refresh_market_data
        asyncio.create_task(refresh_market_data())
        print("Background task started", flush=True)
    except Exception as e:
        print(f"Failed to start background task: {e}", flush=True)
    yield
    # Shutdown (if needed)

app = FastAPI(title="NSE Stock Analyzer", lifespan=lifespan)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routes
app.include_router(stocks.router, prefix="/api/v1")
app.include_router(watchlist.router, prefix="/api/v1")

@app.get("/")
async def root():
    return {"message": "NSE Stock Analyzer API is running"}