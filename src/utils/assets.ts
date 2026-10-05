/**
 * Resolves static asset paths cleanly across local dev, custom domain, and subpaths.
 * Strips any legacy subfolder paths and resolves against the active base URL.
 */
export function getAssetUrl(path: string): string {
  if (!path) return '';
  if (
    path.startsWith('http://') ||
    path.startsWith('https://') ||
    path.startsWith('data:') ||
    path.startsWith('blob:')
  ) {
    return path;
  }

  // Strip any legacy repository / project subfolder prefix
  let clean = path;
  while (clean.startsWith('/BD-Launch-site-')) {
    clean = clean.slice('/BD-Launch-site-'.length);
  }
  while (clean.startsWith('BD-Launch-site-')) {
    clean = clean.slice('BD-Launch-site-'.length);
  }

  // Remove leading ./ or /
  if (clean.startsWith('./')) {
    clean = clean.slice(2);
  }
  if (clean.startsWith('/')) {
    clean = clean.slice(1);
  }

  // Prepend base URL safely
  const base = import.meta.env.BASE_URL || '/';
  const cleanBase = base.endsWith('/') ? base : `${base}/`;
  return `${cleanBase}${clean}`;
}

/**
 * Curated high-resolution fallback diamond imagery in the event of local caching
 * or network proxy interruptions.
 */
export const ATELIER_PIECE_FALLBACKS: Record<string, string> = {
  'solitaire-round-classic': 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1200&q=85',
  'solitaire-knife-edge': 'https://images.unsplash.com/photo-1543294001-f7cbfe92237e?auto=format&fit=crop&w=1200&q=85',
  'solitaire-oval-pave': 'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&w=1200&q=85',
  'solitaire-cushion-pave': 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1200&q=85',
  'solitaire-emerald-pave': 'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&w=1200&q=85',
  'solitaire-radiant-pave': 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1200&q=85',
  'solitaire-princess-pave': 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1200&q=85',
  'solitaire-pear-chevron': 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1200&q=85',
  'trilogy-round': 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1200&q=85',
  'trilogy-emerald': 'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&w=1200&q=85',
  'toi-et-moi': 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1200&q=85',
  'bespoke-ring': 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1200&q=85',
  'tennis-bracelet-round': 'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?auto=format&fit=crop&w=1200&q=85',
  'tennis-bracelet-oval': 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=1200&q=85',
  'tennis-bracelet-emerald': 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1200&q=85',
  'halo-oval': 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1200&q=85',
  'halo-round-cluster': 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1200&q=85',
  'fancy-yellow-trilogy': 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1200&q=85',
  'fancy-pink-solitaire': 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1200&q=85',
};

export function getPieceFallbackUrl(pieceId: string, category?: string): string {
  if (pieceId && ATELIER_PIECE_FALLBACKS[pieceId]) {
    return ATELIER_PIECE_FALLBACKS[pieceId];
  }
  if (category === 'Bracelets') {
    return 'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?auto=format&fit=crop&w=1200&q=85';
  }
  return 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1200&q=85';
}

