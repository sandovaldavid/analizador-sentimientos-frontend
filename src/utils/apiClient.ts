/**
 * API Client for Sentiment Analysis Backend
 * Configured for Django REST Framework API
 *
 * Endpoints:
 * - GET /health/ - Health check
 * - POST /api/sentiment/ - Analyze single sentiment
 * - POST /api/sentiment/bulk/ - Analyze multiple sentiments
 */

export interface SentimentResponse {
  sentiment: 'Positivo' | 'Negativo' | 'Neutral';
  polarity: number;
  language: string;
  confidence?: number;
}

export interface AnalysisResult {
  text: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  score: number;
  confidence?: number;
}

export interface BatchAnalysisResult {
  results: AnalysisResult[];
  summary: {
    total: number;
    positive: number;
    negative: number;
    neutral: number;
    avgScore: number;
  };
}

interface BulkAPIResponse {
  total: number;
  processed: number;
  failed: number;
  results: Array<{
    index: number;
    comment: string;
    sentiment: 'Positivo' | 'Negativo' | 'Neutral';
    polarity: number;
    language: string;
    confidence?: number;
  }>;
}

class APIClient {
  private apiBaseURL: string;
  private healthCheckURL: string;
  private timeout: number;

  constructor(
    baseURL: string = import.meta.env.VITE_API_BASE_URL ||
      'http://localhost:8000',
    timeout: number = parseInt(import.meta.env.VITE_API_TIMEOUT || '30000', 10)
  ) {
    // baseURL should be like http://localhost:8000
    const cleanBaseURL = baseURL.replace(/\/api\/?$/, '');
    this.apiBaseURL = `${cleanBaseURL}/api`;
    this.healthCheckURL = `${cleanBaseURL}/health/`;
    this.timeout = timeout;
  }

  /**
   * Fetches with timeout support
   */
  private async fetchWithTimeout(
    url: string,
    options: RequestInit = {}
  ): Promise<Response> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  }

  /**
   * Converts sentiment values from API format to frontend format
   */
  private normalizeSentiment(
    apiSentiment: 'Positivo' | 'Negativo' | 'Neutral'
  ): 'positive' | 'negative' | 'neutral' {
    switch (apiSentiment) {
      case 'Positivo':
        return 'positive';
      case 'Negativo':
        return 'negative';
      case 'Neutral':
        return 'neutral';
      default:
        return 'neutral';
    }
  }

  /**
   * Analyzes a single text for sentiment
   * POST /api/sentiment/
   */
  async analyzeSentiment(text: string): Promise<AnalysisResult> {
    if (!text || text.trim().length === 0) {
      throw new Error('El texto no puede estar vacío');
    }

    try {
      const response = await this.fetchWithTimeout(
        `${this.apiBaseURL}/sentiment/`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ text: text.trim() }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.detail || `Error: ${response.status} ${response.statusText}`
        );
      }

      const data: SentimentResponse = await response.json();

      return {
        text: text.trim(),
        sentiment: this.normalizeSentiment(data.sentiment),
        score: data.polarity,
        confidence: data.confidence,
      };
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Error al analizar sentimiento: ${error.message}`);
      }
      throw error;
    }
  }

  /**
   * Analyzes multiple texts for sentiment (batch processing)
   * POST /api/sentiment/bulk/
   */
  async analyzeBatch(texts: string[]): Promise<BatchAnalysisResult> {
    if (!texts || texts.length === 0) {
      throw new Error('Debe proporcionar al menos un texto');
    }

    const validTexts = texts.filter((text) => text && text.trim().length > 0);

    if (validTexts.length === 0) {
      throw new Error('No hay textos válidos para analizar');
    }

    try {
      const response = await this.fetchWithTimeout(
        `${this.apiBaseURL}/sentiment/bulk/`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ comments: validTexts }),
        }
      );

      if (!response.ok) {
        // Fallback: analyze individually if batch endpoint doesn't exist
        if (response.status === 404) {
          return await this.analyzeBatchFallback(validTexts);
        }

        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.detail || `Error: ${response.status} ${response.statusText}`
        );
      }

      const data: BulkAPIResponse = await response.json();
      return this.formatBatchResult(data);
    } catch (error) {
      if (error instanceof Error && error.message.includes('404')) {
        return await this.analyzeBatchFallback(validTexts);
      }
      if (error instanceof Error) {
        throw new Error(`Error al analizar lote: ${error.message}`);
      }
      throw error;
    }
  }

  /**
   * Fallback method to analyze texts one by one if batch endpoint doesn't exist
   */
  private async analyzeBatchFallback(
    texts: string[]
  ): Promise<BatchAnalysisResult> {
    const results: AnalysisResult[] = [];

    for (const text of texts) {
      try {
        const result = await this.analyzeSentiment(text);
        results.push(result);
      } catch (error) {
        // Log error but continue with other texts
        console.error(`Error analizando texto: ${error}`);
        results.push({
          text,
          sentiment: 'neutral',
          score: 0,
          confidence: 0,
        });
      }
    }

    return this.formatBatchResult(results);
  }

  /**
   * Formats batch results with summary statistics
   */
  private formatBatchResult(
    data: BulkAPIResponse | AnalysisResult[]
  ): BatchAnalysisResult {
    // Handle both API response format and AnalysisResult array format
    let results: AnalysisResult[] = [];

    if (Array.isArray(data)) {
      results = data;
    } else {
      // API response format
      results = data.results.map((item) => ({
        text: item.comment,
        sentiment: this.normalizeSentiment(item.sentiment),
        score: item.polarity,
        confidence: item.confidence,
      }));
    }

    const summary = {
      total: results.length,
      positive: 0,
      negative: 0,
      neutral: 0,
      avgScore: 0,
    };

    let totalScore = 0;

    for (const result of results) {
      switch (result.sentiment) {
        case 'positive':
          summary.positive++;
          break;
        case 'negative':
          summary.negative++;
          break;
        case 'neutral':
          summary.neutral++;
          break;
      }
      totalScore += result.score;
    }

    summary.avgScore = results.length > 0 ? totalScore / results.length : 0;

    return {
      results,
      summary,
    };
  }

  /**
   * Health check - verifies the API is running
   * GET /health/
   */
  async healthCheck(): Promise<boolean> {
    try {
      const response = await this.fetchWithTimeout(this.healthCheckURL, {
        method: 'GET',
      });
      return response.ok;
    } catch (error) {
      console.error('API health check failed:', error);
      return false;
    }
  }
}

// Export a singleton instance
export const apiClient = new APIClient();

// Export the class for testing or custom instances
export default APIClient;
