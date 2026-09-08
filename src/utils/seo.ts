import { GazetteArticle } from '../types';

export const setDocumentSEO = (options: {
  title?: string;
  description?: string;
  image?: string;
  article?: GazetteArticle;
  url?: string;
}) => {
  const baseTitle = 'Brindley Diamonds — Bespoke Fine Jewellery Atelier';
  const defaultDesc = 'Bespoke IGI-certified diamonds and fine jewellery atelier with interactive vault, ring configurator, and consultation brief tools.';
  
  const title = options.title ? `${options.title} | The Vault Gazette — Brindley Diamonds` : baseTitle;
  const description = options.description || defaultDesc;
  const url = options.url || window.location.href;

  document.title = title;

  // Update or create meta tags
  updateMetaTag('name', 'description', description);
  updateMetaTag('property', 'og:title', title);
  updateMetaTag('property', 'og:description', description);
  updateMetaTag('property', 'og:url', url);
  updateMetaTag('property', 'og:type', options.article ? 'article' : 'website');

  if (options.image) {
    updateMetaTag('property', 'og:image', options.image);
    updateMetaTag('name', 'twitter:image', options.image);
  }

  // Update Schema Markup (JSON-LD)
  updateSchemaLD(options.article);
};

const updateMetaTag = (attrName: 'name' | 'property', attrValue: string, content: string) => {
  let element = document.querySelector(`meta[${attrName}="${attrValue}"]`);
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attrName, attrValue);
    document.head.appendChild(element);
  }
  element.setAttribute('content', content);
};

const updateSchemaLD = (article?: GazetteArticle) => {
  const existingScript = document.getElementById('gazette-schema-ld');
  if (existingScript) {
    existingScript.remove();
  }

  if (!article) return;

  const schemaData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Article',
        '@id': `${window.location.origin}/#gazette/${article.slug}`,
        'headline': article.title,
        'description': article.metaDescription || article.excerpt,
        'image': article.coverImage,
        'datePublished': article.publishedAt,
        'dateModified': article.updatedAt || article.publishedAt,
        'author': {
          '@type': 'Organization',
          'name': article.author || 'Brindley Diamonds Atelier',
          'url': window.location.origin
        },
        'publisher': {
          '@type': 'JewelryStore',
          'name': 'Brindley Diamonds',
          'logo': {
            '@type': 'ImageObject',
            'url': `${window.location.origin}/firefly.png`
          }
        },
        'mainEntityOfPage': {
          '@type': 'WebPage',
          '@id': `${window.location.origin}/#gazette/${article.slug}`
        },
        'keywords': article.seoKeywords?.join(', ')
      },
      {
        '@type': 'BreadcrumbList',
        'itemListElement': [
          {
            '@type': 'ListItem',
            'position': 1,
            'name': 'Home',
            'item': window.location.origin
          },
          {
            '@type': 'ListItem',
            'position': 2,
            'name': 'The Vault Gazette',
            'item': `${window.location.origin}/#gazette`
          },
          {
            '@type': 'ListItem',
            'position': 3,
            'name': article.title,
            'item': `${window.location.origin}/#gazette/${article.slug}`
          }
        ]
      }
    ]
  };

  const script = document.createElement('script');
  script.id = 'gazette-schema-ld';
  script.type = 'application/ld+json';
  script.text = JSON.stringify(schemaData);
  document.head.appendChild(script);
};

export const resetDocumentSEO = () => {
  document.title = 'Brindley Diamonds — Bespoke Fine Jewellery Atelier';
  const existingScript = document.getElementById('gazette-schema-ld');
  if (existingScript) {
    existingScript.remove();
  }
};
