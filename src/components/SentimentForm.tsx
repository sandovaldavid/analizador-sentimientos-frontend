import { useState } from 'react';
import NoteIcon from './icons/NoteIcon';

interface SentimentFormProps {
  onSubmit: (text: string) => Promise<void>;
  isLoading?: boolean;
}

export default function SentimentForm({
  onSubmit,
  isLoading = false,
}: SentimentFormProps) {
  const [text, setText] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (!text.trim()) {
      setError('Por favor ingresa un comentario');
      return;
    }

    if (text.trim().length < 3) {
      setError('El comentario debe tener al menos 3 caracteres');
      return;
    }

    try {
      await onSubmit(text);
      setText('');
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Error al analizar el comentario'
      );
    }
  };

  return (
    <div className="card p-6 animate-slide-up">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-lg bg-linear-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white">
          <NoteIcon size={24} />
        </div>
        <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-50">
          Analiza un Comentario
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="sentiment-text"
            className="block text-base font-semibold text-neutral-700 dark:text-neutral-300 mb-2"
          >
            Ingresa tu comentario
          </label>
          <textarea
            id="sentiment-text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Escribe aquí el comentario que deseas analizar..."
            disabled={isLoading}
            rows={5}
            className="input-base focus:ring-primary-500/20 dark:focus:ring-primary-500/30"
          />
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-2">
            {text.length} caracteres
          </p>
        </div>

        {error && (
          <div className="p-3 bg-error-100 dark:bg-error-900/40 border border-error-300 dark:border-error-700 rounded-lg animate-slide-down">
            <p className="text-error-800 dark:text-error-200 text-sm font-medium">
              ⚠️ {error}
            </p>
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading || !text.trim()}
          className={`w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed ${
            isLoading ? 'flex items-center justify-center gap-2' : ''
          }`}
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
              Analizando...
            </>
          ) : (
            'Analizar Sentimiento'
          )}
        </button>
      </form>
    </div>
  );
}
