import React from 'react';
import SEOHead from './SEOHead';

type PrivateSEOProps = {
  title?: string;
  language?: 'ko' | 'en';
};

export default function PrivateSEO({ title, language = 'ko' }: PrivateSEOProps) {
  return (
    <SEOHead
      title={title}
      noIndex
      language={language}
      ogImage="/og-image.jpg"
    />
  );
}

