import { AnalyzeResponse } from './types';

const API_BASE_URL = '/api';

export const analyzeArticle = async (url: string): Promise<AnalyzeResponse> => {
  const response = await fetch(`${API_BASE_URL}/analyze`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ url }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'Failed to analyze article' }));
    throw new Error(error.detail || 'Failed to analyze article');
  }

  return response.json();
};
