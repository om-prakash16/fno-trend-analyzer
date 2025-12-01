# FNO Trend Analyzer

A robust and high-performance backend system designed for analyzing National Stock Exchange (NSE) data, with a specific focus on Futures and Options (F&O) stocks. Built with **FastAPI**, this application provides real-time data fetching, technical analysis, and watchlist management capabilities.

## 🚀 Features

- **Real-time Data Analysis**: Fetches and processes live market data using `yfinance` and `nselib`.
- **F&O Focus**: Specialized tools for analyzing Futures and Options stocks.
- **Watchlist Management**: Create and manage custom watchlists to track favorite stocks.
- **Background Synchronization**: Automated background tasks to keep market data fresh and up-to-date.
- **RESTful API**: Clean and documented API endpoints for easy frontend integration.
- **Scalable Architecture**: Built on FastAPI for high performance and async capabilities.

## 🛠️ Tech Stack

- **Language**: Python 3.8+
- **Framework**: [FastAPI](https://fastapi.tiangolo.com/)
- **Data Processing**: Pandas, NumPy
- **Market Data**: yfinance, nselib
- **Task Scheduling**: APScheduler (Background tasks)

## 📂 Project Structure

```
├── Backend/
│   ├── app/
│   │   ├── main.py          # Application entry point
│   │   ├── routes/          # API route definitions
│   │   ├── services/        # Business logic and data services
│   │   └── config.py        # Configuration settings
│   ├── requirements.txt     # Python dependencies
│   └── ...
├── fetch_symbols.py         # Utility to fetch NSE symbols
└── verify_backend.py        # Script to verify backend functionality
```

## ⚡ Getting Started

### Prerequisites

- Python 3.8 or higher installed.
- Git installed.

### Installation

1.  **Clone the repository**

    ```bash
    git clone <repository-url>
    cd nse-stock-analyzer
    ```

2.  **Set up a Virtual Environment**

    ```bash
    python -m venv .venv
    # Windows
    .venv\Scripts\activate
    # macOS/Linux
    source .venv/bin/activate
    ```

3.  **Install Dependencies**

    ```bash
    pip install -r Backend/requirements.txt
    ```

### Running the Application

1.  Navigate to the `Backend` directory:

    ```bash
    cd Backend
    ```

2.  Start the server using Uvicorn:

    ```bash
    uvicorn app.main:app --reload
    ```

3.  The API will be available at `http://localhost:8000`.

## 📖 API Documentation

Once the application is running, you can access the interactive API documentation:

- **Swagger UI**: [http://localhost:8000/docs](http://localhost:8000/docs)
- **ReDoc**: [http://localhost:8000/redoc](http://localhost:8000/redoc)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.
