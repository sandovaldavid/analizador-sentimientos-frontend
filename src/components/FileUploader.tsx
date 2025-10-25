import { useState } from 'react';
import { parseFile, isValidFileType } from '@utils/fileParser';
import FolderIcon from './icons/FolderIcon';
import ClipboardIcon from './icons/ClipboardIcon';

interface FileUploaderProps {
  onFileParsed: (comments: string[]) => Promise<void>;
  isLoading?: boolean;
}

export default function FileUploader({
  onFileParsed,
  isLoading = false,
}: FileUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    setError(null);
    setSuccess(null);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      await processFile(files[0]);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    setSuccess(null);

    const files = e.currentTarget.files;
    if (files && files.length > 0) {
      await processFile(files[0]);
    }
  };

  const processFile = async (file: File) => {
    // Validate file type
    if (!isValidFileType(file)) {
      setError('Tipo de archivo no soportado. Solo se aceptan JSON y CSV.');
      return;
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      setError('El archivo es demasiado grande. Máximo 10MB.');
      return;
    }

    setUploading(true);

    try {
      const result = await parseFile(file);

      if (result.error) {
        setError(result.error);
        setUploading(false);
        return;
      }

      if (result.comments.length === 0) {
        setError('No se encontraron comentarios en el archivo.');
        setUploading(false);
        return;
      }

      // Extract just the text from parsed comments
      const commentTexts = result.comments.map((c) => c.text);

      setSuccess(`${result.comments.length} comentarios cargados exitosamente`);

      // Call the callback to process the comments
      await onFileParsed(commentTexts);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Error al procesar el archivo'
      );
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="card p-6 animate-slide-up animation-delay-100">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-lg bg-linear-to-br from-accent-500 to-accent-600 flex items-center justify-center text-white">
          <FolderIcon size={24} />
        </div>
        <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-50">
          Carga Múltiples Comentarios
        </h2>
      </div>

      <div className="space-y-4">
        {/* Drag and Drop Area */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 cursor-pointer ${
            isDragging
              ? 'border-accent-500 bg-accent-50 dark:bg-accent-950/30'
              : 'border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/50 hover:border-accent-400 dark:hover:border-accent-600'
          }`}
        >
          <div className="space-y-3">
            <svg
              className="mx-auto h-12 w-12 text-accent-500"
              stroke="currentColor"
              fill="none"
              viewBox="0 0 48 48"
            >
              <path
                d="M28 8H12a4 4 0 00-4 4v20a4 4 0 004 4h24a4 4 0 004-4V20m-8-12l-4-4m0 0l-4 4m4-4v12"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <div>
              <p className="text-neutral-700 dark:text-neutral-200 font-semibold">
                Arrastra archivos JSON o CSV aquí
              </p>
              <p className="text-neutral-500 dark:text-neutral-400 text-sm mt-1">
                o haz clic en el botón de abajo
              </p>
            </div>
          </div>

          <input
            type="file"
            onChange={handleFileChange}
            disabled={isLoading || uploading}
            accept=".json,.csv"
            className="hidden"
            id="file-input"
          />
        </div>

        {/* File Input Button */}
        <div className="flex gap-3">
          <label
            htmlFor="file-input"
            className={`flex-1 py-3 px-4 rounded-lg font-semibold text-white text-center cursor-pointer transition-all duration-200 ${
              isLoading || uploading
                ? 'bg-neutral-400 dark:bg-neutral-600 cursor-not-allowed opacity-50'
                : 'btn-accent active:scale-95'
            }`}
          >
            {uploading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                <span>Procesando...</span>
              </div>
            ) : (
              'Seleccionar Archivo'
            )}
          </label>
        </div>

        {/* File Format Info */}
        <div className="p-4 bg-primary-100 dark:bg-primary-900/40 border border-primary-300 dark:border-primary-700 rounded-lg">
          <p className="text-sm font-semibold text-primary-900 dark:text-primary-200 mb-2 flex items-center gap-2">
            <ClipboardIcon size={18} />
            Formatos soportados:
          </p>
          <ul className="text-sm text-primary-800 dark:text-primary-300 space-y-1 font-code">
            <li>
              <strong>JSON:</strong> Array de objetos o strings con campos como
              "comment", "text", "mensaje"
            </li>
            <li>
              <strong>CSV:</strong> Con encabezados como "comment", "text",
              "mensaje", "review"
            </li>
          </ul>
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-4 bg-error-100 dark:bg-error-900/40 border border-error-300 dark:border-error-700 rounded-lg animate-slide-down">
            <p className="text-error-800 dark:text-error-200 font-semibold flex items-center gap-2">
              <span>⚠️ Error:</span>
            </p>
            <p className="text-error-700 dark:text-error-300 text-sm mt-1">
              {error}
            </p>
          </div>
        )}

        {/* Success Message */}
        {success && !uploading && (
          <div className="p-4 bg-success-100 dark:bg-success-900/40 border border-success-300 dark:border-success-700 rounded-lg animate-slide-down">
            <p className="text-success-800 dark:text-success-200 font-semibold flex items-center gap-2">
              <span>✓</span>
              {success}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
