import { useState } from 'react';
import Scene from './components/Scene';
import { analyzeArticle } from './api';
import { WordData } from './types';
import './App.css';

const SAMPLE_URLS = [
  'https://www.bbc.com/news/technology',
  'https://www.theguardian.com/technology',
  'https://techcrunch.com',
];

function App() {
  const [url, setUrl] = useState('');
  const [words, setWords] = useState<WordData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!url.trim()) {
      setError('Please enter a URL');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await analyzeArticle(url);
      setWords(response.words);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to analyze article');
      setWords([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSampleClick = (sampleUrl: string) => {
    setUrl(sampleUrl);
  };

  return (
    <div className="app">
      <div className="controls">
        <div className="input-group">
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Enter article URL..."
            className="url-input"
            onKeyPress={(e) => e.key === 'Enter' && handleAnalyze()}
            disabled={loading}
          />
          <button
            onClick={handleAnalyze}
            disabled={loading}
            className="analyze-button"
          >
            {loading ? 'Analyzing...' : 'Analyze'}
          </button>
        </div>

        <div className="sample-urls">
          <span className="sample-label">Sample URLs:</span>
          {SAMPLE_URLS.map((sampleUrl, index) => (
            <button
              key={index}
              onClick={() => handleSampleClick(sampleUrl)}
              className="sample-button"
              disabled={loading}
            >
              {sampleUrl}
            </button>
          ))}
        </div>

        {error && <div className="error">{error}</div>}
      </div>

      <div className="canvas-container">
        <Scene words={words} />
        {words.length === 0 && !loading && (
          <div className="placeholder">
            <h2>3D Word Cloud Visualization</h2>
            <p>Enter a URL above to analyze an article and generate a word cloud</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
