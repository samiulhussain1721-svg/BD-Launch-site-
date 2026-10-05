/**
 * Resolves static asset paths against Vite's base URL (e.g. '/BD-Launch-site-/')
 * ensuring assets load reliably in development, preview, and GitHub Pages production.
 *
 * Fully idempotent: calling getAssetUrl multiple times on the same path will never
 * create duplicate base prefixes.
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

  const base = import.meta.env.BASE_URL || '/';
  const cleanBase = base.endsWith('/') ? base : `${base}/`;

  // If path already starts with cleanBase or base, return it directly
  if (path.startsWith(cleanBase)) {
    return path;
  }
  if (path.startsWith(base)) {
    return path;
  }

  // Also check if path has leading slash matching base without leading slash
  const baseWithoutSlash = base.replace(/^\/+|\/+$/g, '');
  if (baseWithoutSlash && path.includes(baseWithoutSlash)) {
    // Avoid double prefixing if path already includes the subpath
    const normalized = path.startsWith('/') ? path : `/${path}`;
    if (normalized.startsWith(`/${baseWithoutSlash}/`)) {
      return normalized;
    }
  }

  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  return `${cleanBase}${cleanPath}`;
}
