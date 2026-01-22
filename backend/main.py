from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, HttpUrl
from typing import List
import requests
from bs4 import BeautifulSoup
import re
from sklearn.feature_extraction.text import TfidfVectorizer
import numpy as np

app = FastAPI(title="3D Word Cloud API")

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class AnalyzeRequest(BaseModel):
    url: str


class WordData(BaseModel):
    word: str
    weight: float


class AnalyzeResponse(BaseModel):
    words: List[WordData]


def fetch_article_text(url: str) -> str:
    """Fetch and extract text content from a URL."""
    try:
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
        response = requests.get(url, headers=headers, timeout=10)
        response.raise_for_status()
        
        soup = BeautifulSoup(response.content, 'lxml')
        
        # Remove script and style elements
        for script in soup(["script", "style", "meta", "link"]):
            script.decompose()
        
        # Try to find main content areas
        main_content = soup.find('main') or soup.find('article') or soup.find('div', class_=re.compile('content|article|post|main'))
        
        if main_content:
            text = main_content.get_text()
        else:
            text = soup.get_text()
        
        # Clean up text
        lines = (line.strip() for line in text.splitlines())
        chunks = (phrase.strip() for line in lines for phrase in line.split("  "))
        text = ' '.join(chunk for chunk in chunks if chunk)
        
        return text
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to fetch article: {str(e)}")


def extract_topics(text: str, max_words: int = 50) -> List[WordData]:
    """Extract important words using TF-IDF."""
    if not text or len(text.strip()) < 100:
        raise HTTPException(status_code=400, detail="Insufficient text content extracted from article")
    
    # Preprocess text - split into sentences
    sentences = re.split(r'[.!?]+', text)
    sentences = [s.strip() for s in sentences if len(s.strip()) > 20]
    
    if len(sentences) < 3:
        # Fallback: treat entire text as one document
        sentences = [text]
    
    # Initialize TF-IDF vectorizer
    vectorizer = TfidfVectorizer(
        max_features=max_words * 2,
        stop_words='english',
        ngram_range=(1, 2),  # Include unigrams and bigrams
        min_df=1,
        max_df=0.95
    )
    
    try:
        tfidf_matrix = vectorizer.fit_transform(sentences)
        
        # Get feature names (words)
        feature_names = vectorizer.get_feature_names_out()
        
        # Calculate average TF-IDF scores across all documents
        mean_scores = np.mean(tfidf_matrix.toarray(), axis=0)
        
        # Create word-weight pairs
        word_weights = [
            (word, float(score))
            for word, score in zip(feature_names, mean_scores)
            if score > 0
        ]
        
        # Sort by weight and take top words
        word_weights.sort(key=lambda x: x[1], reverse=True)
        top_words = word_weights[:max_words]
        
        # Normalize weights to 0-1 range
        if top_words:
            max_weight = top_words[0][1]
            if max_weight > 0:
                normalized_words = [
                    WordData(word=word, weight=min(weight / max_weight, 1.0))
                    for word, weight in top_words
                ]
                return normalized_words
        
        # Fallback: return simple word frequency if TF-IDF fails
        words = re.findall(r'\b[a-z]{3,}\b', text.lower())
        from collections import Counter
        word_freq = Counter(words)
        common_words = {'the', 'and', 'for', 'are', 'but', 'not', 'you', 'all', 'can', 'her', 'was', 'one', 'our', 'out', 'day', 'get', 'has', 'him', 'his', 'how', 'its', 'may', 'new', 'now', 'old', 'see', 'two', 'who', 'way', 'use'}
        filtered_words = {word: count for word, count in word_freq.items() if word not in common_words}
        top_filtered = sorted(filtered_words.items(), key=lambda x: x[1], reverse=True)[:max_words]
        
        if top_filtered:
            max_freq = top_filtered[0][1]
            return [
                WordData(word=word, weight=min(count / max_freq, 1.0))
                for word, count in top_filtered
            ]
        
        return []
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to process text: {str(e)}")


@app.post("/analyze", response_model=AnalyzeResponse)
async def analyze_article(request: AnalyzeRequest):
    """Analyze an article URL and return word cloud data."""
    try:
        # Fetch article text
        text = fetch_article_text(request.url)
        
        # Extract topics/keywords
        words = extract_topics(text)
        
        if not words:
            raise HTTPException(status_code=400, detail="No meaningful words extracted from article")
        
        return AnalyzeResponse(words=words)
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")


@app.get("/health")
async def health():
    """Health check endpoint."""
    return {"status": "ok"}
