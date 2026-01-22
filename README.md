# 3D Word Cloud Visualization

An interactive web application that visualizes topics from news articles as a 3D word cloud using React Three Fiber and FastAPI.

## Features

- **Frontend**: React + TypeScript + React Three Fiber for immersive 3D visualization
- **Backend**: Python + FastAPI for article crawling and topic modeling
- **Interactive**: Rotate, zoom, and explore word clouds in 3D space
- **Topic Modeling**: Uses TF-IDF to extract important keywords and topics

## Project Structure

```
.
├── frontend/          # React TypeScript frontend
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── App.tsx        # Main app component
│   │   └── api.ts         # API client
│   └── package.json
├── backend/           # Python FastAPI backend
│   ├── main.py           # FastAPI application
│   └── requirements.txt  # Python dependencies
├── setup.sh          # Setup script for macOS
└── README.md         # This file
```

## Prerequisites

- **Node.js** (v18 or higher)
- **Python 3** (v3.8 or higher)
- **macOS** (for the setup script)

## Quick Start

### Option 1: Using the Setup Script (macOS)

Simply run the setup script from the project root:

```bash
chmod +x setup.sh
./setup.sh
```

This will:
1. Install all frontend dependencies
2. Create a Python virtual environment
3. Install all backend dependencies
4. Start both servers concurrently

The frontend will be available at `http://localhost:3000` and the backend API at `http://localhost:8000`.

### Option 2: Manual Setup

#### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

#### Backend Setup

```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

## Usage

1. Open the application in your browser at `http://localhost:3000`
2. Enter a news article URL in the input field (or click one of the sample URLs)
3. Click "Analyze" to fetch and process the article
4. Explore the 3D word cloud by:
   - Clicking and dragging to rotate
   - Scrolling to zoom
   - Observing word sizes and colors based on importance

## Libraries Used

### Frontend
- **React** (^18.2.0) - UI framework
- **TypeScript** (^5.2.0) - Type safety
- **React Three Fiber** (^8.15.0) - React renderer for Three.js
- **@react-three/drei** (^9.88.0) - Useful helpers for React Three Fiber
- **Three.js** (^0.158.0) - 3D graphics library
- **Vite** (^5.0.0) - Build tool and dev server

### Backend
- **FastAPI** (^0.104.1) - Modern Python web framework
- **Uvicorn** (^0.24.0) - ASGI server
- **BeautifulSoup4** (^4.12.2) - HTML parsing and web scraping
- **scikit-learn** (^1.3.2) - Machine learning library (TF-IDF)
- **requests** (^2.31.0) - HTTP library
- **numpy** (^1.26.2) - Numerical computing

## API Endpoints

### POST /api/analyze

Analyzes an article URL and returns word cloud data.

**Request:**
```json
{
  "url": "https://example.com/article"
}
```

**Response:**
```json
{
  "words": [
    {
      "word": "technology",
      "weight": 0.95
    },
    {
      "word": "innovation",
      "weight": 0.82
    }
  ]
}
```

### GET /api/health

Health check endpoint.

## How It Works

1. **Article Crawling**: The backend fetches the article URL using `requests` and parses HTML with `BeautifulSoup`
2. **Text Extraction**: Main content is extracted by identifying article containers or falling back to body text
3. **Topic Modeling**: TF-IDF (Term Frequency-Inverse Document Frequency) is used to identify important keywords
4. **Visualization**: Words are positioned in 3D space using a golden angle spiral distribution, with size and color based on importance
5. **Interactivity**: Users can rotate and zoom the word cloud using mouse controls

## Notes

- The article crawler is basic and may not work perfectly with all websites
- Some websites may block automated requests
- The word cloud displays up to 50 most important words by default
- Words are filtered to remove common stop words

## Development

To modify the frontend, edit files in `frontend/src/`. The dev server will hot-reload changes.

To modify the backend, edit `backend/main.py`. The server will auto-reload on changes.

## License

This project is created for demonstration purposes.
