import React from 'react';
import { Helmet } from 'react-helmet-async';

export interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  canonical?: string;
  ogImage?: string;
  ogType?: string;
  ogImageWidth?: number;
  ogImageHeight?: number;
  ogImageAlt?: string;
  structuredData?: object;
  language?: 'ko' | 'en';
  noIndex?: boolean;
}

const defaultTitle = 'AdmitAI Korea | 미국 대학 입학 AI | AI for College Admissions';
const defaultDescription = 'AI로 미국 대학 입학을 준비하세요. Personalized essay analysis and feedback for Korean students applying to US colleges. Free trial available.';
const defaultKeywords = '미국 대학 입학 AI, 한국 학생 미국 대학 에세이, AI for college admissions, Korean students US college essays, college admissions AI';
const defaultOgImage = '/og-image.jpg';
const defaultCanonical = 'https://admitai.kr';
const defaultLanguage = 'ko';

const defaultStructuredData = {
  "@context": "https://schema.org",
  "@type": "EducationalService",
  "name": "AdmitAI Korea",
  "description": defaultDescription,
  "url": "https://admitai.kr",
  "logo": "https://admitai.kr/logo.png",
  "sameAs": [
    "https://www.facebook.com/admitaikorea",
    "https://www.instagram.com/admitaikorea",
    "https://www.youtube.com/channel/admitaikorea"
  ],
  "serviceType": "College Admissions AI",
  "areaServed": {
    "@type": "Country",
    "name": "South Korea"
  },
  "targetAudience": {
    "@type": "Audience",
    "audienceType": "Korean students applying to US colleges"
  },
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD",
    "description": "Free trial available"
  },
  "provider": {
    "@type": "Organization",
    "name": "AdmitAI Korea",
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "KR"
    }
  }
};

const SEOHead: React.FC<SEOHeadProps> = ({
  title,
  description,
  keywords,
  canonical,
  ogImage,
  ogType = 'website',
  ogImageWidth = 1200,
  ogImageHeight = 630,
  ogImageAlt,
  structuredData,
  language = defaultLanguage,
  noIndex = false,
}) => {
  const finalTitle = title || defaultTitle;
  const finalDescription = description || defaultDescription;
  const finalKeywords = keywords || defaultKeywords;
  const finalCanonical = canonical || defaultCanonical;
  const finalOgImage = ogImage || defaultOgImage;
  const finalStructuredData = structuredData || defaultStructuredData;

  return (
    <Helmet>
      {/* Viewport */}
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      {/* Primary Meta Tags */}
      <title>{finalTitle}</title>
      <meta name="description" content={finalDescription} />
      <meta name="keywords" content={finalKeywords} />
      <meta name="author" content="AdmitAI Korea" />
      <link rel="canonical" href={finalCanonical} />
      <html lang={language} />
      {noIndex ? (
        <meta name="robots" content="noindex, nofollow" />
      ) : (
        <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
      )}

      {/* Open Graph Meta Tags */}
      <meta property="og:title" content={finalTitle} />
      <meta property="og:description" content={finalDescription} />
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={finalCanonical} />
      <meta property="og:image" content={finalOgImage.startsWith('http') ? finalOgImage : `https://admitai.kr${finalOgImage}`} />
      {ogImageAlt && <meta property="og:image:alt" content={ogImageAlt} />}
      <meta property="og:image:width" content={String(ogImageWidth)} />
      <meta property="og:image:height" content={String(ogImageHeight)} />
      <meta property="og:locale" content={language === 'ko' ? 'ko_KR' : 'en_US'} />
      <meta property="og:locale:alternate" content={language === 'ko' ? 'en_US' : 'ko_KR'} />
      <meta property="og:site_name" content="AdmitAI Korea" />

      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={finalTitle} />
      <meta name="twitter:description" content={finalDescription} />
      <meta name="twitter:image" content={finalOgImage.startsWith('http') ? finalOgImage : `https://admitai.kr${finalOgImage}`} />
      <meta name="twitter:site" content="@admitaikorea" />

      {/* Multilingual SEO (disabled until routed i18n exists) */}

      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(finalStructuredData)}
      </script>
    </Helmet>
  );
};

export default SEOHead; 