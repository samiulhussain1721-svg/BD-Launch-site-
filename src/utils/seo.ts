import { GazetteArticle, Ring } from '../types';

const BASE_TITLE = 'Brindley Diamonds — Bespoke Fine Jewellery Atelier';
const DEFAULT_DESC = 'Bespoke IGI-certified diamonds and fine jewellery atelier in Birmingham Jewellery Quarter. Handcrafted engagement rings, diamond tennis bracelets, and custom commissions.';

/**
 * Updates or creates a <meta> tag with the specified attribute and content
 */
export const updateMetaTag = (attrName: 'name' | 'property', attrValue: string, content: string) => {
  let element = document.querySelector(`meta[${attrName}="${attrValue}"]`);
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attrName, attrValue);
    document.head.appendChild(element);
  }
  element.setAttribute('content', content);
};

/**
 * Removes a <meta> tag if it exists
 */
export const removeMetaTag = (attrName: 'name' | 'property', attrValue: string) => {
  const element = document.querySelector(`meta[${attrName}="${attrValue}"]`);
  if (element) {
    element.remove();
  }
};

/**
 * Sets OpenGraph and Twitter social meta tags
 */
export const setSocialMeta = (options: {
  title: string;
  description: string;
  image?: string;
  url?: string;
  type?: string;
}) => {
  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://brindleydiamonds.com';
  const url = options.url || (typeof window !== 'undefined' ? window.location.href : origin);
  const image = options.image
    ? options.image.startsWith('http')
      ? options.image
      : `${origin}${options.image.startsWith('/') ? '' : '/'}${options.image}`
    : `${origin}/images/gallery/solitaire_round_classic.png`;

  updateMetaTag('name', 'description', options.description);

  // OpenGraph Standard
  updateMetaTag('property', 'og:site_name', 'Brindley Diamonds');
  updateMetaTag('property', 'og:locale', 'en_GB');
  updateMetaTag('property', 'og:title', options.title);
  updateMetaTag('property', 'og:description', options.description);
  updateMetaTag('property', 'og:url', url);
  updateMetaTag('property', 'og:type', options.type || 'website');
  updateMetaTag('property', 'og:image', image);
  updateMetaTag('property', 'og:image:width', '1200');
  updateMetaTag('property', 'og:image:height', '630');
  updateMetaTag('property', 'og:image:alt', options.title);

  // Twitter / X
  updateMetaTag('name', 'twitter:card', 'summary_large_image');
  updateMetaTag('name', 'twitter:title', options.title);
  updateMetaTag('name', 'twitter:description', options.description);
  updateMetaTag('name', 'twitter:image', image);
};

/**
 * Sets Product-specific OpenGraph meta tags and Schema.org (JSON-LD) structured data
 */
export const setProductSEO = (ring: Ring) => {
  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://brindleydiamonds.com';
  const productUrl = `${origin}/#piece/${ring.id}`;
  const title = `${ring.title} — Bespoke Fine Jewellery | Brindley Diamonds`;
  const description = `${ring.desc} Handcrafted in Birmingham Jewellery Quarter with certified centre stone.`;
  const imageUrl = ring.img.startsWith('http')
    ? ring.img
    : `${origin}${ring.img.startsWith('/') ? '' : '/'}${ring.img}`;

  document.title = `${ring.title} | Brindley Diamonds Atelier`;

  // OpenGraph & Twitter
  setSocialMeta({
    title,
    description,
    image: imageUrl,
    url: productUrl,
    type: 'product',
  });

  // Product OpenGraph Extension Tags (supported by Pinterest, Google, Facebook)
  updateMetaTag('property', 'product:retailer_item_id', ring.id);
  updateMetaTag('property', 'product:category', ring.category || 'Fine Jewellery');
  updateMetaTag('property', 'product:condition', 'new');
  updateMetaTag('property', 'product:availability', 'in stock');
  updateMetaTag('property', 'product:price:currency', 'GBP');

  // Inject or update Product JSON-LD structured data
  const existingProductScript = document.getElementById('product-schema-ld');
  if (existingProductScript) {
    existingProductScript.remove();
  }

  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    '@id': productUrl,
    'name': ring.title,
    'description': ring.desc,
    'category': ring.category || 'Fine Jewellery',
    'image': [imageUrl],
    'brand': {
      '@type': 'Brand',
      'name': 'Brindley Diamonds',
    },
    'manufacturer': {
      '@type': 'JewelryStore',
      'name': 'Brindley Diamonds Atelier',
      'address': {
        '@type': 'PostalAddress',
        'addressLocality': 'Birmingham',
        'addressRegion': 'West Midlands',
        'addressCountry': 'GB',
      },
    },
    'material': 'Platinum 950, 18k Yellow Gold, 18k White Gold, Lab-Grown or Natural Diamonds',
    'countryOfOrigin': {
      '@type': 'Country',
      'name': 'United Kingdom',
    },
    'offers': {
      '@type': 'Offer',
      'url': productUrl,
      'priceCurrency': 'GBP',
      'price': '0',
      'priceSpecification': {
        '@type': 'PriceSpecification',
        'priceCurrency': 'GBP',
        'description': 'Bespoke commission pricing quoted upon diamond carat, colour, clarity, and mount metal selection.',
      },
      'availability': 'https://schema.org/InStock',
      'itemCondition': 'https://schema.org/NewCondition',
      'seller': {
        '@type': 'JewelryStore',
        'name': 'Brindley Diamonds',
        'url': origin,
      },
    },
    'additionalProperty': [
      {
        '@type': 'PropertyValue',
        'name': 'Certification',
        'value': 'Dual IGI & GIA Laboratory Certified',
      },
      {
        '@type': 'PropertyValue',
        'name': 'Hallmarking',
        'value': 'Birmingham Assay Office Hallmarked',
      },
      {
        '@type': 'PropertyValue',
        'name': 'Designation',
        'value': ring.tag,
      },
    ],
  };

  const script = document.createElement('script');
  script.id = 'product-schema-ld';
  script.type = 'application/ld+json';
  script.text = JSON.stringify(productSchema);
  document.head.appendChild(script);
};

/**
 * Clears Product-specific SEO tags when navigating back to general browsing
 */
export const clearProductSEO = () => {
  removeMetaTag('property', 'product:retailer_item_id');
  removeMetaTag('property', 'product:category');
  removeMetaTag('property', 'product:condition');
  removeMetaTag('property', 'product:availability');
  removeMetaTag('property', 'product:price:currency');

  const existingProductScript = document.getElementById('product-schema-ld');
  if (existingProductScript) {
    existingProductScript.remove();
  }
};

/**
 * Injects Collection Catalog Schema.org (JSON-LD) for the entire jewellery collection
 */
export const setCollectionSEO = (rings: Ring[]) => {
  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://brindleydiamonds.com';

  const existingCollectionScript = document.getElementById('collection-schema-ld');
  if (existingCollectionScript) {
    existingCollectionScript.remove();
  }

  const catalogSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    '@id': `${origin}/#rings`,
    'name': 'Brindley Diamonds Bespoke Jewellery Collection',
    'description': 'Master-crafted engagement rings, diamond tennis bracelets, eternity wedding bands, and fine jewellery created in Birmingham Jewellery Quarter.',
    'numberOfItems': rings.length,
    'itemListElement': rings.map((ring, index) => {
      const itemUrl = `${origin}/#piece/${ring.id}`;
      const imageUrl = ring.img.startsWith('http')
        ? ring.img
        : `${origin}${ring.img.startsWith('/') ? '' : '/'}${ring.img}`;

      return {
        '@type': 'ListItem',
        'position': index + 1,
        'item': {
          '@type': 'Product',
          '@id': itemUrl,
          'name': ring.title,
          'description': ring.desc,
          'image': imageUrl,
          'category': ring.category || 'Fine Jewellery',
          'brand': {
            '@type': 'Brand',
            'name': 'Brindley Diamonds',
          },
          'offers': {
            '@type': 'Offer',
            'url': itemUrl,
            'priceCurrency': 'GBP',
            'availability': 'https://schema.org/InStock',
            'itemCondition': 'https://schema.org/NewCondition',
            'seller': {
              '@type': 'JewelryStore',
              'name': 'Brindley Diamonds',
            },
          },
        },
      };
    }),
  };

  const script = document.createElement('script');
  script.id = 'collection-schema-ld';
  script.type = 'application/ld+json';
  script.text = JSON.stringify(catalogSchema);
  document.head.appendChild(script);
};

/**
 * Sets document SEO for Gazette editorial articles
 */
export const setDocumentSEO = (options: {
  title?: string;
  description?: string;
  image?: string;
  article?: GazetteArticle;
  url?: string;
}) => {
  const title = options.title ? `${options.title} | The Vault Gazette — Brindley Diamonds` : BASE_TITLE;
  const description = options.description || DEFAULT_DESC;
  const url = options.url || (typeof window !== 'undefined' ? window.location.href : 'https://brindleydiamonds.com');

  document.title = title;

  setSocialMeta({
    title,
    description,
    image: options.image,
    url,
    type: options.article ? 'article' : 'website',
  });

  // Update Article Schema Markup (JSON-LD)
  updateSchemaLD(options.article);
};

const updateSchemaLD = (article?: GazetteArticle) => {
  const existingScript = document.getElementById('gazette-schema-ld');
  if (existingScript) {
    existingScript.remove();
  }

  if (!article) return;

  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://brindleydiamonds.com';

  const schemaData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Article',
        '@id': `${origin}/#gazette/${article.slug}`,
        'headline': article.title,
        'description': article.metaDescription || article.excerpt,
        'image': article.coverImage,
        'datePublished': article.publishedAt,
        'dateModified': article.updatedAt || article.publishedAt,
        'author': {
          '@type': 'Organization',
          'name': article.author || 'Brindley Diamonds Atelier',
          'url': origin,
        },
        'publisher': {
          '@type': 'JewelryStore',
          'name': 'Brindley Diamonds',
          'logo': {
            '@type': 'ImageObject',
            'url': `${origin}/firefly.png`,
          },
        },
        'mainEntityOfPage': {
          '@type': 'WebPage',
          '@id': `${origin}/#gazette/${article.slug}`,
        },
        'keywords': article.seoKeywords?.join(', '),
      },
      {
        '@type': 'BreadcrumbList',
        'itemListElement': [
          {
            '@type': 'ListItem',
            'position': 1,
            'name': 'Home',
            'item': origin,
          },
          {
            '@type': 'ListItem',
            'position': 2,
            'name': 'The Vault Gazette',
            'item': `${origin}/#gazette`,
          },
          {
            '@type': 'ListItem',
            'position': 3,
            'name': article.title,
            'item': `${origin}/#gazette/${article.slug}`,
          },
        ],
      },
    ],
  };

  const script = document.createElement('script');
  script.id = 'gazette-schema-ld';
  script.type = 'application/ld+json';
  script.text = JSON.stringify(schemaData);
  document.head.appendChild(script);
};

/**
 * Resets document SEO to default homepage metadata
 */
export const resetDocumentSEO = () => {
  document.title = BASE_TITLE;

  clearProductSEO();

  const existingScript = document.getElementById('gazette-schema-ld');
  if (existingScript) {
    existingScript.remove();
  }

  setSocialMeta({
    title: BASE_TITLE,
    description: DEFAULT_DESC,
    image: '/images/gallery/solitaire_round_classic.png',
  });
};
