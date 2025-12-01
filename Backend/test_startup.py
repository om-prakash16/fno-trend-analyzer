import asyncio
from app.main import lifespan, app

async def test_startup():
    print("Testing startup...")
    async with lifespan(app):
        print("Startup successful!")
        await asyncio.sleep(2)
        print("Shutting down...")

if __name__ == "__main__":
    try:
        asyncio.run(test_startup())
    except Exception as e:
        print(f"Startup failed: {e}")
        import traceback
        traceback.print_exc()
