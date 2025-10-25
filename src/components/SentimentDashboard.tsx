import { useState, useCallback } from 'react';
import Header from './Header';
import Footer from './Footer';
import SentimentForm from './SentimentForm';
import FileUploader from './FileUploader';
import SentimentChart from './SentimentChart';
import { apiClient, type AnalysisResult } from '@utils/apiClient';

interface ChartData {
  results: AnalysisResult[];
  summary?: {
    total: number;
    positive: number;
    negative: number;
    neutral: number;
    avgScore?: number;
  };
}

export default function SentimentDashboard() {
  const [results, setResults] = useState<AnalysisResult[]>([]);
  const [chartData, setChartData] = useState<ChartData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSingleAnalysis = useCallback(
    async (text: string) => {
      setIsLoading(true);
      setError(null);

      try {
        const result = await apiClient.analyzeSentiment(text);
        const newResults = [...results, result];
        setResults(newResults);
        setChartData({
          results: newResults,
        });
      } catch (err) {
        const errorMsg =
          err instanceof Error
            ? err.message
            : 'Error al analizar el sentimiento';
        setError(errorMsg);
        console.error('Error:', err);
      } finally {
        setIsLoading(false);
      }
    },
    [results]
  );

  const handleFileParsed = useCallback(async (comments: string[]) => {
    setIsLoading(true);
    setError(null);

    try {
      if (comments.length === 0) {
        setError('No hay comentarios para analizar');
        setIsLoading(false);
        return;
      }

      const batchResult = await apiClient.analyzeBatch(comments);

      setResults(batchResult.results);
      setChartData({
        results: batchResult.results,
        summary: batchResult.summary,
      });
    } catch (err) {
      const errorMsg =
        err instanceof Error
          ? err.message
          : 'Error al analizar los comentarios';
      setError(errorMsg);
      console.error('Error:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleClearResults = useCallback(() => {
    setResults([]);
    setChartData(null);
    setError(null);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50 dark:bg-neutral-900">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="flex-1">
        <div className="container-max px-4 py-12 md:py-16">
          {/* Hero Section */}
          <div className="mb-12 text-center animate-fade-in">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-display mb-4">
              <span className="gradient-primary-text">
                Analizador de Sentimientos
              </span>
            </h1>
            <p className="text-lg md:text-xl text-neutral-600 dark:text-neutral-300 max-w-2xl mx-auto">
              Analiza comentarios individuales o carga archivos JSON/CSV para
              procesar múltiples comentarios con IA
            </p>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="mb-8 p-4 rounded-lg bg-error-100 dark:bg-error-900/40 border border-error-300 dark:border-error-700 animate-slide-down">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-semibold text-error-800 dark:text-error-200">
                    ⚠️ Error
                  </p>
                  <p className="text-error-700 dark:text-error-300 text-sm mt-1">
                    {error}
                  </p>
                </div>
                <button
                  onClick={() => setError(null)}
                  className="text-error-700 dark:text-error-300 hover:text-error-800 dark:hover:text-error-200"
                >
                  ✕
                </button>
              </div>
            </div>
          )}

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
            {/* Input Section */}
            <div className="lg:col-span-1 space-y-6 animate-slide-up animation-delay-100">
              <SentimentForm
                onSubmit={handleSingleAnalysis}
                isLoading={isLoading}
              />
              <FileUploader
                onFileParsed={handleFileParsed}
                isLoading={isLoading}
              />
            </div>

            {/* Chart Section */}
            <div className="lg:col-span-2 animate-slide-up animation-delay-200">
              <SentimentChart data={chartData} isLoading={isLoading} />
            </div>
          </div>

          {/* Results Actions */}
          {results.length > 0 && (
            <div className="mb-12 flex flex-wrap justify-center gap-4 animate-bounce-in">
              <button onClick={handleClearResults} className="btn-secondary">
                Limpiar Resultados
              </button>
              <button
                onClick={() => {
                  const dataStr = JSON.stringify(
                    {
                      timestamp: new Date().toISOString(),
                      results,
                      summary: chartData?.summary,
                    },
                    null,
                    2
                  );
                  const dataBlob = new Blob([dataStr], {
                    type: 'application/json',
                  });
                  const url = URL.createObjectURL(dataBlob);
                  const link = document.createElement('a');
                  link.href = url;
                  link.download = `sentimientos-${Date.now()}.json`;
                  link.click();
                }}
                className="btn-primary"
              >
                Descargar JSON
              </button>
            </div>
          )}

          {/* Results Summary */}
          {results.length > 0 && (
            <div className="card p-6 mb-12 animate-bounce-in animation-delay-200">
              <h3 className="text-2xl font-bold gradient-primary-text mb-4">
                Historial de Análisis ({results.length} comentarios)
              </h3>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {results.map((result, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-3 p-4 rounded-lg bg-neutral-100 dark:bg-neutral-800/60 hover:bg-neutral-200 dark:hover:bg-neutral-700/80 transition-colors border border-neutral-200 dark:border-neutral-700"
                  >
                    <div
                      className={`shrink-0 w-3 h-3 rounded-full mt-1 ${
                        result.sentiment === 'positive'
                          ? 'bg-success-600'
                          : result.sentiment === 'negative'
                            ? 'bg-error-600'
                            : 'bg-warning-600'
                      }`}
                    ></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-neutral-900 dark:text-neutral-50 text-sm truncate">
                        {result.text}
                      </p>
                      <p className="text-xs text-neutral-700 dark:text-neutral-300 mt-1 font-code">
                        {result.sentiment === 'positive'
                          ? '✓ Positivo'
                          : result.sentiment === 'negative'
                            ? '✗ Negativo'
                            : '~ Neutral'}{' '}
                        • Score:{' '}
                        {result.score !== undefined
                          ? result.score.toFixed(2)
                          : 'N/A'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
