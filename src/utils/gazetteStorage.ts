import { GazetteArticle } from '../types';
import { INITIAL_GAZETTE_ARTICLES } from '../data/gazetteArticles';

const STORAGE_KEY = 'brindley_gazette_articles_v1';
const ADMIN_AUTH_KEY = 'brindley_gazette_admin_auth';

export const slugify = (text: string): string => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
};

export const calculateReadTime = (content: string): string => {
  const wordsPerMinute = 200;
  const wordCount = content.trim().split(/\s+/).length;
  const minutes = Math.ceil(wordCount / wordsPerMinute);
  return `${Math.max(1, minutes)} min read`;
};

export const getGazetteArticles = (): GazetteArticle[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_GAZETTE_ARTICLES));
      return INITIAL_GAZETTE_ARTICLES;
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_GAZETTE_ARTICLES));
      return INITIAL_GAZETTE_ARTICLES;
    }
    return parsed;
  } catch (err) {
    console.error('Error reading Gazette articles from localStorage', err);
    return INITIAL_GAZETTE_ARTICLES;
  }
};

export const getArticleBySlug = (slug: string): GazetteArticle | undefined => {
  const articles = getGazetteArticles();
  return articles.find((a) => a.slug === slug || a.id === slug);
};

export const saveGazetteArticle = (article: GazetteArticle): GazetteArticle => {
  const articles = getGazetteArticles();
  const existingIndex = articles.findIndex((a) => a.id === article.id || a.slug === article.slug);

  const updatedArticle: GazetteArticle = {
    ...article,
    slug: article.slug ? slugify(article.slug) : slugify(article.title),
    readTime: article.readTime || calculateReadTime(article.content),
    updatedAt: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
  };

  let newArticles: GazetteArticle[];
  if (existingIndex >= 0) {
    newArticles = [...articles];
    newArticles[existingIndex] = updatedArticle;
  } else {
    newArticles = [updatedArticle, ...articles];
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(newArticles));
  window.dispatchEvent(new CustomEvent('gazette_updated', { detail: { article: updatedArticle } }));
  return updatedArticle;
};

export const deleteGazetteArticle = (id: string): void => {
  const articles = getGazetteArticles();
  const filtered = articles.filter((a) => a.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  window.dispatchEvent(new CustomEvent('gazette_updated'));
};

export const resetGazetteArticles = (): GazetteArticle[] => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_GAZETTE_ARTICLES));
  window.dispatchEvent(new CustomEvent('gazette_updated'));
  return INITIAL_GAZETTE_ARTICLES;
};

// Admin authentication helpers
export const checkAdminAuth = (): boolean => {
  return localStorage.getItem(ADMIN_AUTH_KEY) === 'true';
};

export const setAdminAuth = (auth: boolean): void => {
  if (auth) {
    localStorage.setItem(ADMIN_AUTH_KEY, 'true');
  } else {
    localStorage.removeItem(ADMIN_AUTH_KEY);
  }
};

export const verifyAdminPasscode = (code: string): boolean => {
  // Support default PIN or password
  const validCodes = ['1721', 'brindley2026', 'admin', 'vault2026'];
  return validCodes.includes(code.trim().toLowerCase());
};
