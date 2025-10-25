import { useEffect, useMemo } from 'react';

interface SEOConfig {
  title?: string;
  description?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  canonicalUrl?: string;
  keywords?: string;
}

const defaultConfig: SEOConfig = {
  title: 'Analizador de Sentimientos',
  description:
    'Analizador de Sentimientos - Herramienta para analizar el sentimiento de tus textos usando IA',
  ogTitle: 'Analizador de Sentimientos',
  ogDescription:
    'Analiza el sentimiento de tus textos con nuestra herramienta impulsada por IA',
  ogImage: '/og-image.webp',
  canonicalUrl: 'https://analizador-sentimientos.devsandoval.me',
  keywords:
    'analizador de sentimientos, análisis de texto, IA, procesamiento de lenguaje natural',
};

export const useSEO = (config: SEOConfig = {}) => {
  const finalConfig = useMemo(
    () => ({ ...defaultConfig, ...config }),
    [config]
  );

  useEffect(() => {
    // Actualizar título
    document.title = finalConfig.title || defaultConfig.title || '';

    // Actualizar meta description
    const descriptionMeta =
      document.querySelector('meta[name="description"]') ||
      document.createElement('meta');
    descriptionMeta.setAttribute('name', 'description');
    descriptionMeta.setAttribute('content', finalConfig.description || '');
    if (!descriptionMeta.parentElement) {
      document.head.appendChild(descriptionMeta);
    }

    // Actualizar keywords
    const keywordsMeta =
      document.querySelector('meta[name="keywords"]') ||
      document.createElement('meta');
    keywordsMeta.setAttribute('name', 'keywords');
    keywordsMeta.setAttribute('content', finalConfig.keywords || '');
    if (!keywordsMeta.parentElement) {
      document.head.appendChild(keywordsMeta);
    }

    // Actualizar Open Graph
    const updateOGMeta = (property: string, content: string) => {
      let meta = document.querySelector(`meta[property="${property}"]`);
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute('property', property);
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', content);
    };

    updateOGMeta('og:title', finalConfig.ogTitle || '');
    updateOGMeta('og:description', finalConfig.ogDescription || '');
    updateOGMeta('og:image', finalConfig.ogImage || '');

    // Actualizar URL canónica
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', finalConfig.canonicalUrl || '');
  }, [finalConfig]);
};
