import { useMemo, useRef, useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
} from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';
import BarChartIcon from './icons/BarChartIcon';
import NoteIcon from './icons/NoteIcon';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
);

export interface AnalysisResult {
  text: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  score: number;
  confidence?: number;
}

export interface ChartData {
  results: AnalysisResult[];
  summary?: {
    total: number;
    positive: number;
    negative: number;
    neutral: number;
    avgScore?: number;
  };
}

interface SentimentChartProps {
  data: ChartData | null;
  isLoading?: boolean;
}

export default function SentimentChart({
  data,
  isLoading = false,
}: SentimentChartProps) {
  const chartRef = useRef(null);

  // Detectar modo oscuro observando cambios en la clase del documento
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof document !== 'undefined') {
      return document.documentElement.classList.contains('dark');
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    // Crear observer para cambios en las clases del documento
    const observer = new MutationObserver(() => {
      setIsDarkMode(document.documentElement.classList.contains('dark'));
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    // También escuchar cambios de media query como fallback
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      setIsDarkMode(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);

    return () => {
      observer.disconnect();
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

  const stats = useMemo(() => {
    if (!data || !data.results || data.results.length === 0) {
      return null;
    }

    let positive = 0;
    let negative = 0;
    let neutral = 0;
    let totalScore = 0;

    data.results.forEach((result) => {
      switch (result.sentiment) {
        case 'positive':
          positive++;
          break;
        case 'negative':
          negative++;
          break;
        case 'neutral':
          neutral++;
          break;
      }
      totalScore += result.score;
    });

    const total = data.results.length;
    const avgScore = total > 0 ? totalScore / total : 0;

    return {
      total,
      positive,
      negative,
      neutral,
      avgScore,
      positivePercent: total > 0 ? (positive / total) * 100 : 0,
      negativePercent: total > 0 ? (negative / total) * 100 : 0,
      neutralPercent: total > 0 ? (neutral / total) * 100 : 0,
    };
  }, [data]);

  // Theme colors
  const chartTextColor = isDarkMode ? '#e5e7eb' : '#0f172a';
  const chartGridColor = isDarkMode ? '#374151' : '#d1d5db';

  // Pie Chart Data
  const pieChartData = useMemo(() => {
    if (!stats) return null;
    return {
      labels: [
        `Positivos (${stats.positivePercent.toFixed(1)}%)`,
        `Negativos (${stats.negativePercent.toFixed(1)}%)`,
        `Neutros (${stats.neutralPercent.toFixed(1)}%)`,
      ],
      datasets: [
        {
          label: 'Distribución Porcentual',
          data: [
            stats.positivePercent,
            stats.negativePercent,
            stats.neutralPercent,
          ],
          backgroundColor: [
            'rgba(34, 197, 94, 0.8)',
            'rgba(239, 68, 68, 0.8)',
            'rgba(234, 179, 8, 0.8)',
          ],
          borderColor: [
            'rgb(22, 163, 74)',
            'rgb(220, 38, 38)',
            'rgb(202, 138, 4)',
          ],
          borderWidth: 2,
        },
      ],
    };
  }, [stats]);

  // Bar Chart Data
  const barChartData = useMemo(() => {
    if (!stats) return null;
    return {
      labels: ['Positivos', 'Negativos', 'Neutros'],
      datasets: [
        {
          label: 'Positivos',
          data: [stats.positive, 0, 0],
          backgroundColor: 'rgba(34, 197, 94, 0.7)',
          borderColor: 'rgb(22, 163, 74)',
          borderWidth: 2,
          borderRadius: 8,
        },
        {
          label: 'Negativos',
          data: [0, stats.negative, 0],
          backgroundColor: 'rgba(239, 68, 68, 0.7)',
          borderColor: 'rgb(220, 38, 38)',
          borderWidth: 2,
          borderRadius: 8,
        },
        {
          label: 'Neutros',
          data: [0, 0, stats.neutral],
          backgroundColor: 'rgba(234, 179, 8, 0.7)',
          borderColor: 'rgb(202, 138, 4)',
          borderWidth: 2,
          borderRadius: 8,
        },
      ],
    };
  }, [stats]);

  // Common chart options
  const commonChartOptions = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          labels: {
            color: chartTextColor,
            font: {
              size: 13,
              weight: 'bold' as const,
            },
            padding: 15,
            usePointStyle: true,
          },
          position: 'top' as const,
        },
        tooltip: {
          backgroundColor: isDarkMode
            ? 'rgba(31, 41, 55, 0.9)'
            : 'rgba(255, 255, 255, 0.9)',
          titleColor: chartTextColor,
          bodyColor: chartTextColor,
          borderColor: chartGridColor,
          borderWidth: 1,
          padding: 12,
          displayColors: true,
        },
      },
    }),
    [isDarkMode, chartTextColor, chartGridColor]
  );

  // Pie chart specific options
  const pieChartOptions = useMemo(
    () => ({
      ...commonChartOptions,
      maintainAspectRatio: true,
      plugins: {
        ...commonChartOptions.plugins,
        legend: {
          ...commonChartOptions.plugins.legend,
          position: 'top' as const,
        },
        tooltip: {
          ...commonChartOptions.plugins.tooltip,
          callbacks: {
            label: function (context: { parsed: number }) {
              const value = context.parsed;
              return `${value.toFixed(1)}%`;
            },
          },
        },
      },
    }),
    [commonChartOptions]
  );

  // Bar chart specific options
  const barChartOptions = useMemo(
    () => ({
      ...commonChartOptions,
      maintainAspectRatio: false,
      indexAxis: 'x' as const,
      plugins: {
        ...commonChartOptions.plugins,
        legend: {
          display: false,
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            color: chartTextColor,
            font: {
              size: 12,
            },
            stepSize: 1,
          },
          grid: {
            color: chartGridColor,
            drawBorder: false,
          },
        },
        x: {
          ticks: {
            color: chartTextColor,
            font: {
              size: 12,
            },
          },
          grid: {
            display: false,
            drawBorder: false,
          },
        },
      },
    }),
    [commonChartOptions, chartTextColor, chartGridColor]
  );

  if (isLoading) {
    return (
      <div className="card p-8 animate-pulse">
        <div className="flex items-center justify-center h-64">
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-200 dark:border-primary-900 border-t-primary-600 dark:border-t-primary-400"></div>
            <p className="text-neutral-600 dark:text-neutral-400 font-semibold">
              Analizando sentimientos...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="card p-8 animate-fade-in">
        <h2 className="text-2xl font-bold gradient-primary-text mb-6 font-display flex items-center gap-2">
          <div className="w-10 h-10 rounded-lg bg-linear-to-br from-primary-500 to-accent-600 flex items-center justify-center text-white">
            <BarChartIcon size={30} />
          </div>
          Resultados del Análisis
        </h2>
        <div className="flex flex-col items-center justify-center h-64 p-4 bg-neutral-50 dark:bg-neutral-800/50 rounded-lg border-2 border-dashed border-neutral-300 dark:border-neutral-700">
          <svg
            className="h-12 w-12 text-neutral-400 dark:text-neutral-600 mb-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            />
          </svg>
          <p className="text-neutral-600 dark:text-neutral-400 font-semibold text-center">
            No hay datos para mostrar
          </p>
          <p className="text-neutral-500 dark:text-neutral-500 text-sm mt-1 text-center">
            Analiza un comentario o carga un archivo para ver resultados
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="card p-8 animate-fade-in">
      <h2 className="text-2xl font-bold gradient-primary-text mb-8 font-display flex items-center gap-2">
        <div className="w-10 h-10 rounded-lg bg-linear-to-br from-primary-500 to-accent-600 flex items-center justify-center text-white">
          <BarChartIcon size={30} />
        </div>
        Resultados del Análisis
      </h2>

      {/* Summary Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        {/* Total */}
        <div className="p-4 rounded-lg bg-linear-to-br from-primary-50 to-primary-100 dark:from-primary-900 dark:to-primary-800 border border-primary-200 dark:border-primary-600">
          <p className="text-xs font-semibold text-primary-800 dark:text-primary-100 uppercase tracking-wide">
            Total
          </p>
          <p className="text-2xl font-bold text-primary-700 dark:text-primary-200 mt-1">
            {stats.total}
          </p>
        </div>

        {/* Positive */}
        <div className="p-4 rounded-lg bg-linear-to-br from-success-50 to-success-100 dark:from-success-900 dark:to-success-800 border border-success-200 dark:border-success-600">
          <p className="text-xs font-semibold text-success-800 dark:text-success-100 uppercase tracking-wide">
            Positivos
          </p>
          <div className="flex items-baseline gap-2 mt-1">
            <p className="text-2xl font-bold text-success-700 dark:text-success-200">
              {stats.positive}
            </p>
            <p className="text-xs text-success-700 dark:text-success-200">
              {stats.positivePercent.toFixed(0)}%
            </p>
          </div>
        </div>

        {/* Negative */}
        <div className="p-4 rounded-lg bg-linear-to-br from-error-50 to-error-100 dark:from-error-900 dark:to-error-800 border border-error-200 dark:border-error-600">
          <p className="text-xs font-semibold text-error-800 dark:text-error-100 uppercase tracking-wide">
            Negativos
          </p>
          <div className="flex items-baseline gap-2 mt-1">
            <p className="text-2xl font-bold text-error-700 dark:text-error-200">
              {stats.negative}
            </p>
            <p className="text-xs text-error-700 dark:text-error-200">
              {stats.negativePercent.toFixed(0)}%
            </p>
          </div>
        </div>

        {/* Neutral */}
        <div className="p-4 rounded-lg bg-linear-to-br from-warning-50 to-warning-100 dark:from-warning-900 dark:to-warning-800 border border-warning-200 dark:border-warning-600">
          <p className="text-xs font-semibold text-warning-800 dark:text-warning-100 uppercase tracking-wide">
            Neutros
          </p>
          <div className="flex items-baseline gap-2 mt-1">
            <p className="text-2xl font-bold text-warning-700 dark:text-warning-200">
              {stats.neutral}
            </p>
            <p className="text-xs text-warning-700 dark:text-warning-200">
              {stats.neutralPercent.toFixed(0)}%
            </p>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        {/* Pie Chart */}
        <div className="p-6 bg-neutral-50 dark:bg-neutral-800/50 rounded-lg border border-neutral-200 dark:border-neutral-700 min-h-96 flex flex-col">
          <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-50 mb-6 font-display w-full">
            Distribución Porcentual
          </h3>
          {pieChartData && (
            <div className="flex-1 w-full flex items-center justify-center">
              <Pie
                ref={chartRef}
                data={pieChartData}
                options={pieChartOptions}
              />
            </div>
          )}
        </div>

        {/* Bar Chart */}
        <div className="p-6 bg-neutral-50 dark:bg-neutral-800/50 rounded-lg border border-neutral-200 dark:border-neutral-700 min-h-96">
          <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-50 mb-6 font-display w-full">
            Cantidad por Sentimiento
          </h3>
          {barChartData && (
            <div className="w-full h-80">
              <Bar data={barChartData} options={barChartOptions} />
            </div>
          )}
        </div>
      </div>

      {/* Average Score */}
      {stats.avgScore !== undefined && (
        <div className="p-4 bg-accent-100 dark:bg-accent-900/40 border border-accent-300 dark:border-accent-700 rounded-lg mb-8">
          <p className="text-xs font-semibold text-accent-800 dark:text-accent-200 uppercase tracking-wide mb-2">
            Score Promedio
          </p>
          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-bold text-accent-700 dark:text-accent-300">
              {stats.avgScore.toFixed(2)}
            </span>
            <span className="text-sm text-accent-700 dark:text-accent-300 font-code">
              / 1.0
            </span>
          </div>
        </div>
      )}

      {/* Results Table */}
      {data && data.results && data.results.length > 0 && (
        <div className="mt-8">
          <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-50 mb-4 font-display flex items-center gap-2">
            <NoteIcon size={22} />
            Detalles de Comentarios
          </h3>
          <div className="overflow-x-auto rounded-lg border border-neutral-200 dark:border-neutral-700">
            <table className="w-full text-sm">
              <thead className="bg-neutral-100 dark:bg-neutral-800 border-b border-neutral-300 dark:border-neutral-700">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-neutral-800 dark:text-neutral-200">
                    Comentario
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-neutral-800 dark:text-neutral-200">
                    Sentimiento
                  </th>
                  <th className="px-4 py-3 text-right font-semibold text-neutral-800 dark:text-neutral-200">
                    Score
                  </th>
                </tr>
              </thead>
              <tbody>
                {data!.results.slice(0, 10).map((result, idx) => (
                  <tr
                    key={idx}
                    className="border-b border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800/70 transition-colors"
                  >
                    <td className="px-4 py-3 text-neutral-900 dark:text-neutral-100 line-clamp-2">
                      {result.text}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                          result.sentiment === 'positive'
                            ? 'bg-success-100 dark:bg-success-900/40 text-success-800 dark:text-success-200'
                            : result.sentiment === 'negative'
                              ? 'bg-error-100 dark:bg-error-900/40 text-error-800 dark:text-error-200'
                              : 'bg-warning-100 dark:bg-warning-900/40 text-warning-800 dark:text-warning-200'
                        }`}
                      >
                        {result.sentiment === 'positive'
                          ? 'Positivo'
                          : result.sentiment === 'negative'
                            ? 'Negativo'
                            : 'Neutral'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right font-semibold text-neutral-900 dark:text-neutral-100 font-code">
                      {result.score.toFixed(3)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {data!.results.length > 10 && (
              <div className="px-4 py-3 bg-neutral-100 dark:bg-neutral-800/70 border-t border-neutral-300 dark:border-neutral-700 text-center">
                <p className="text-xs text-neutral-700 dark:text-neutral-300">
                  Mostrando 10 de {data!.results.length} resultados
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
