import { useSEO } from '../hooks/useSEO';

interface SEOProps {
  title?: string;
  description?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  canonicalUrl?: string;
  keywords?: string;
  children?: React.ReactNode;
}

export const SEO: React.FC<SEOProps> = ({
  title,
  description,
  ogTitle,
  ogDescription,
  ogImage,
  canonicalUrl,
  keywords,
  children,
}) => {
  useSEO({
    title,
    description,
    ogTitle,
    ogDescription,
    ogImage,
    canonicalUrl,
    keywords,
  });

  return <>{children}</>;
};

export default SEO;
