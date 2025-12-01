# F&O Trend Analyzer 📈

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Python](https://img.shields.io/badge/python-3.10+-blue.svg)
![FastAPI](https://img.shields.io/badge/FastAPI-0.109.0-009688.svg)
![Next.js](https://img.shields.io/badge/Next.js-14.0-black.svg)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.0-38B2AC.svg)

**F&O Trend Analyzer** is a powerful, real-time stock analysis tool designed exclusively for NSE Futures & Options (F&O) stocks. It provides traders with instant insights through stability-based ranking, real-time indicators (MACD, RSI), and strength analysis.

## 🚀 Features

-   **Real-Time Data**: Fetches live market data for all 208 F&O stocks.
-   **Stability Ranking**: Unique ranking system based on price stability (closest to 0% change).
-   **Advanced Indicators**:
    -   **MACD**: Visual status (Above Zero, Below Zero, Neutral).
    -   **RSI**: Zone detection (Overbought, Oversold, Neutral).
    -   **Strength Meter**: Visual buyer/seller dominance gauge.
-   **Smart Filtering**: Auto-filters for Gainers, Losers, High Volume, and specific indicator states.
-   **Interactive UI**: Modern, dark-themed dashboard built with Next.js and Tailwind CSS.
-   **High Performance**: Backend caching and optimized data fetching for sub-second response times.

## 📸 Screenshots

*(Add screenshots of your dashboard, stock table, and details modal here)*

## 🛠️ Tech Stack

-   **Backend**: Python, FastAPI, yfinance, Pandas, NumPy
-   **Frontend**: TypeScript, Next.js (App Router), Tailwind CSS, Lucide React
-   **State Management**: TanStack Query (React Query)
-   **Data Source**: Yahoo Finance API (via `yfinance`)

## 📂 Folder Structure

```
fno-trend-analyzer/
├── backend/                # FastAPI Backend
│   ├── app/
│   │   ├── main.py         # Application entry point
│   │   ├── config.py       # Configuration & Constants
│   │   ├── schemas.py      # Pydantic Models
│   │   ├── routes/         # API Endpoints
│   │   ├── services/       # Business Logic (Stocks, Indicators)
│   │   └── utils/          # Helper functions (Filters)
│   ├── requirements.txt    # Python dependencies
│   └── ...
├── frontend/               # Next.js Frontend
│   ├── src/
│   │   ├── app/            # App Router Pages
│   │   ├── components/     # Reusable UI Components
│   │   ├── hooks/          # Custom React Hooks
│   │   └── lib/            # Utilities
│   ├── public/             # Static Assets
│   ├── package.json        # Node dependencies
│   └── ...
├── .gitignore              # Git ignore rules
└── README.md               # Project Documentation
```

## ⚙️ Installation & Setup

### Prerequisites
-   Python 3.10+
-   Node.js 18+
-   Git

### 1. Clone the Repository

```bash
git clone git@github.com:om-prakash16/fno-trend-analyzer.git
cd fno-trend-analyzer
```

### 2. Backend Setup

Navigate to the backend directory and set up the Python environment.

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# Mac/Linux:
# source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### 3. Frontend Setup

Navigate to the frontend directory and install Node dependencies.

```bash
cd ../frontend

# Install dependencies
npm install
```

## 🏃‍♂️ Running the Application

### Start Backend Server
The backend runs on `http://localhost:8000`.

```bash
# In backend directory (with venv activated)
uvicorn app.main:app --reload --port 8000
```

### Start Frontend Server
The frontend runs on `http://localhost:3000`.

```bash
# In frontend directory
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

## 🤝 Contribution

Contributions are welcome! Please follow these steps:

1.  Fork the repository.
2.  Create a new branch (`git checkout -b feature/AmazingFeature`).
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4.  Push to the branch (`git push origin feature/AmazingFeature`).
5.  Open a Pull Request.

## 📞 Contact

**Om Prakash**
-   GitHub: [@om-prakash16](https://github.com/om-prakash16)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
