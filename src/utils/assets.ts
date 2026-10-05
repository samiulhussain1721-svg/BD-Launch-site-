/**
 * Resolves static asset paths for the live custom domain (serving directly from '/').
 * Strips any legacy subfolder paths (e.g. '/BD-Launch-site-/') and ensures clean,
 * absolute public root paths (e.g. '/images/gallery/solitaire_round_classic.png').
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

  // Remove leading ./ if present
  if (clean.startsWith('./')) {
    clean = clean.slice(2);
  }

  // Return clean absolute root path
  return clean.startsWith('/') ? clean : `/${clean}`;
}
