import { GazetteArticle, GazetteSubscriber } from '../types';
import { INITIAL_GAZETTE_ARTICLES } from '../data/gazetteArticles';

const STORAGE_KEY = 'brindley_gazette_articles_v1';
const ADMIN_AUTH_KEY = 'brindley_gazette_admin_auth';
const SUBSCRIBERS_STORAGE_KEY = 'brindley_gazette_subscribers_v1';

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

// ==========================================
// Gazette Newsletter Subscriber Management
// ==========================================

export const getGazetteSubscribers = (): GazetteSubscriber[] => {
  try {
    const raw = localStorage.getItem(SUBSCRIBERS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.error('Error reading Gazette subscribers from localStorage', err);
    return [];
  }
};

export const subscribeToGazette = (
  email: string,
  source: string = 'footer_newsletter'
): {
  success: boolean;
  message: string;
  isExisting?: boolean;
  subscriber?: GazetteSubscriber;
} => {
  const cleanEmail = email.trim().toLowerCase();
  
  // Basic UK RFC compliant regex check
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!cleanEmail || !emailRegex.test(cleanEmail)) {
    return {
      success: false,
      message: 'Please enter a valid email address.'
    };
  }

  const subscribers = getGazetteSubscribers();
  const existing = subscribers.find((s) => s.email.toLowerCase() === cleanEmail);

  if (existing) {
    return {
      success: true,
      isExisting: true,
      message: 'Your address is already registered for The Vault Gazette updates.',
      subscriber: existing
    };
  }

  const newSubscriber: GazetteSubscriber = {
    id: `sub_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    email: cleanEmail,
    subscribedAt: new Date().toISOString(),
    source,
    status: 'active'
  };

  const updated = [newSubscriber, ...subscribers];
  localStorage.setItem(SUBSCRIBERS_STORAGE_KEY, JSON.stringify(updated));
  
  // Dispatch custom event for real-time reactivity in admin panels
  window.dispatchEvent(
    new CustomEvent('gazette_subscriber_added', { detail: { subscriber: newSubscriber } })
  );

  return {
    success: true,
    isExisting: false,
    message: 'Welcome to The Vault Gazette. Your private subscription is confirmed.',
    subscriber: newSubscriber
  };
};

export const removeGazetteSubscriber = (id: string): void => {
  const subscribers = getGazetteSubscribers();
  const filtered = subscribers.filter((s) => s.id !== id);
  localStorage.setItem(SUBSCRIBERS_STORAGE_KEY, JSON.stringify(filtered));
  window.dispatchEvent(new CustomEvent('gazette_subscribers_updated'));
};

export const exportSubscribersToCSV = (): string => {
  const subscribers = getGazetteSubscribers();
  const headers = ['ID', 'Email Address', 'Date Subscribed (UTC)', 'Source Channel', 'Status'];
  const rows = subscribers.map((s) => [
    s.id,
    s.email,
    new Date(s.subscribedAt).toISOString(),
    s.source,
    s.status
  ]);
  return [headers.join(','), ...rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(','))].join('\n');
};

