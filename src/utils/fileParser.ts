/**
 * Utility functions for parsing JSON and CSV files
 */

export interface ParsedComment {
  text: string;
  source?: string;
}

export interface FileParseResult {
  comments: ParsedComment[];
  totalCount: number;
  error?: string;
}

/**
 * Detects common column names that might contain comments
 */
const COMMENT_COLUMN_NAMES = [
  'comment',
  'comments',
  'text',
  'mensaje',
  'mensajes',
  'review',
  'reviews',
  'feedback',
  'content',
  'contenido',
  'description',
  'descripción',
  'body',
  'message',
];

/**
 * Parses a JSON file and extracts comments
 */
export function parseJsonFile(content: string): FileParseResult {
  try {
    const data = JSON.parse(content);

    if (!Array.isArray(data)) {
      return {
        comments: [],
        totalCount: 0,
        error: 'El JSON debe contener un array de objetos',
      };
    }

    const comments: ParsedComment[] = [];

    for (const item of data) {
      if (typeof item === 'string') {
        // Si los items son strings directamente
        if (item.trim().length > 0) {
          comments.push({ text: item.trim() });
        }
      } else if (typeof item === 'object' && item !== null) {
        // Buscar la primera propiedad que contenga texto de comentario
        const commentText = findCommentInObject(item);
        if (commentText) {
          comments.push({ text: commentText.trim() });
        }
      }
    }

    if (comments.length === 0) {
      return {
        comments: [],
        totalCount: 0,
        error: 'No se encontraron comentarios válidos en el archivo JSON',
      };
    }

    return {
      comments,
      totalCount: comments.length,
    };
  } catch (error) {
    return {
      comments: [],
      totalCount: 0,
      error: `Error al parsear JSON: ${error instanceof Error ? error.message : 'Error desconocido'}`,
    };
  }
}

/**
 * Parses a CSV file and extracts comments
 */
export function parseCsvFile(content: string): FileParseResult {
  try {
    const lines = content
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line.length > 0);

    if (lines.length === 0) {
      return {
        comments: [],
        totalCount: 0,
        error: 'El archivo CSV está vacío',
      };
    }

    // Parsear encabezado
    const headers = parseCSVLine(lines[0]);
    const commentColumnIndex = findCommentColumnIndex(headers);

    if (commentColumnIndex === -1) {
      return {
        comments: [],
        totalCount: 0,
        error: `No se encontró columna de comentarios. Esperado uno de: ${COMMENT_COLUMN_NAMES.join(', ')}`,
      };
    }

    const comments: ParsedComment[] = [];

    // Parsear filas de datos
    for (let i = 1; i < lines.length; i++) {
      const row = parseCSVLine(lines[i]);
      if (row.length > commentColumnIndex) {
        const text = row[commentColumnIndex].trim();
        if (text.length > 0) {
          comments.push({ text });
        }
      }
    }

    if (comments.length === 0) {
      return {
        comments: [],
        totalCount: 0,
        error: 'No se encontraron comentarios válidos en el archivo CSV',
      };
    }

    return {
      comments,
      totalCount: comments.length,
    };
  } catch (error) {
    return {
      comments: [],
      totalCount: 0,
      error: `Error al parsear CSV: ${error instanceof Error ? error.message : 'Error desconocido'}`,
    };
  }
}

/**
 * Parsea una línea CSV manejando valores entre comillas
 */
function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    const nextChar = line[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }

  result.push(current);
  return result;
}

/**
 * Encuentra el índice de la columna de comentarios en los encabezados CSV
 */
function findCommentColumnIndex(headers: string[]): number {
  for (let i = 0; i < headers.length; i++) {
    const header = headers[i].toLowerCase().trim();
    if (COMMENT_COLUMN_NAMES.includes(header)) {
      return i;
    }
  }
  return -1;
}

/**
 * Encuentra texto de comentario en un objeto buscando nombres de propiedades comunes
 */
function findCommentInObject(obj: Record<string, unknown>): string | null {
  for (const key of COMMENT_COLUMN_NAMES) {
    if (key in obj && typeof obj[key] === 'string') {
      return obj[key];
    }
  }

  // Fallback: obtener primera propiedad string
  for (const key in obj) {
    if (typeof obj[key] === 'string' && obj[key].length > 0) {
      return obj[key];
    }
  }

  return null;
}

/**
 * Valida si el tipo de archivo es soportado (JSON o CSV)
 */
export function isValidFileType(file: File): boolean {
  const fileName = file.name.toLowerCase();
  return fileName.endsWith('.json') || fileName.endsWith('.csv');
}

/**
 * Parser de archivo principal - detecta el tipo de archivo y parsea en consecuencia
 */
export function parseFile(file: File): Promise<FileParseResult> {
  return new Promise((resolve) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      const content = event.target?.result as string;
      const fileName = file.name.toLowerCase();

      if (fileName.endsWith('.json')) {
        resolve(parseJsonFile(content));
      } else if (fileName.endsWith('.csv')) {
        resolve(parseCsvFile(content));
      } else {
        resolve({
          comments: [],
          totalCount: 0,
          error: 'Formato de archivo no soportado. Solo se aceptan JSON y CSV.',
        });
      }
    };

    reader.onerror = () => {
      resolve({
        comments: [],
        totalCount: 0,
        error: 'Error al leer el archivo',
      });
    };

    reader.readAsText(file);
  });
}
