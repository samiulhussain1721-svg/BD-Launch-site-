import React, { useState, useEffect, useRef } from 'react';
import { GazetteArticle, GazetteCategory, GazetteSubscriber } from '../types';
import {
  saveGazetteArticle,
  deleteGazetteArticle,
  resetGazetteArticles,
  slugify,
  calculateReadTime,
  verifyAdminPasscode,
  checkAdminAuth,
  setAdminAuth,
  getGazetteSubscribers,
  removeGazetteSubscriber,
  exportSubscribersToCSV
} from '../utils/gazetteStorage';
import { GazetteMarkdownRenderer } from './GazetteMarkdownRenderer';
import {
  X,
  Lock,
  Unlock,
  KeyRound,
  Plus,
  Edit3,
  Trash2,
  Eye,
  Save,
  Send,
  Upload,
  Image as ImageIcon,
  HelpCircle,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  FileText,
  Search,
  ExternalLink,
  Bold,
  Italic,
  Heading2,
  Heading3,
  Quote,
  List,
  Sparkles,
  Users,
  Download,
  Mail
} from 'lucide-react';

interface VaultAdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  articles: GazetteArticle[];
  onArticlePublished?: (article: GazetteArticle) => void;
}

const CATEGORIES: GazetteCategory[] = [
  'Diamond Education',
  'Bespoke Stories',
  'Sizing & Guides',
  'Jewellery Quarter Notes'
];

export const VaultAdminModal: React.FC<VaultAdminModalProps> = ({
  isOpen,
  onClose,
  articles,
  onArticlePublished
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [authError, setAuthError] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Active view in Admin: 'list' | 'editor' | 'subscribers'
  const [currentView, setCurrentView] = useState<'list' | 'editor' | 'subscribers'>('list');
  const [editorMode, setEditorMode] = useState<'write' | 'preview'>('write');

  // Subscribers state
  const [subscribers, setSubscribers] = useState<GazetteSubscriber[]>([]);
  const [subscriberSearch, setSubscriberSearch] = useState('');

  // Form Fields
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [isSlugManual, setIsSlugManual] = useState(false);
  const [category, setCategory] = useState<GazetteCategory>('Diamond Education');
  const [author, setAuthor] = useState('Brindley Atelier Editorial');
  const [readTime, setReadTime] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [seoKeywordInput, setSeoKeywordInput] = useState('');
  const [seoKeywords, setSeoKeywords] = useState<string[]>([]);
  const [content, setContent] = useState('');
  const [status, setStatus] = useState<'published' | 'draft'>('published');
  const [notification, setNotification] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isOpen) {
      setIsAuthenticated(checkAdminAuth());
      setSubscribers(getGazetteSubscribers());
    }
  }, [isOpen]);

  // Listen for subscriber additions/deletions in real-time
  useEffect(() => {
    const handleSubUpdate = () => {
      setSubscribers(getGazetteSubscribers());
    };
    window.addEventListener('gazette_subscriber_added', handleSubUpdate);
    window.addEventListener('gazette_subscribers_updated', handleSubUpdate);
    return () => {
      window.removeEventListener('gazette_subscriber_added', handleSubUpdate);
      window.removeEventListener('gazette_subscribers_updated', handleSubUpdate);
    };
  }, []);

  const handleExportCSV = () => {
    const csv = exportSubscribersToCSV();
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const dateStr = new Date().toISOString().split('T')[0];
    link.setAttribute('href', url);
    link.setAttribute('download', `brindley_gazette_subscribers_${dateStr}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showNotification('Subscriber list exported as CSV successfully.');
  };

  const handleRemoveSubscriber = (id: string, email: string) => {
    if (window.confirm(`Remove ${email} from The Vault Gazette subscriber list?`)) {
      removeGazetteSubscriber(id);
      setSubscribers(getGazetteSubscribers());
      showNotification(`Subscriber ${email} removed.`);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (verifyAdminPasscode(passcode)) {
      setIsAuthenticated(true);
      setAuthError(false);
      if (rememberMe) {
        setAdminAuth(true);
      }
    } else {
      setAuthError(true);
    }
  };

  const handleLogout = () => {
    setAdminAuth(false);
    setIsAuthenticated(false);
    setPasscode('');
    setCurrentView('list');
  };

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleCreateNew = () => {
    setEditingId(null);
    setTitle('');
    setSlug('');
    setIsSlugManual(false);
    setCategory('Diamond Education');
    setAuthor('Brindley Atelier Editorial');
    setReadTime('3 min read');
    setCoverImage('https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1200&q=85');
    setMetaDescription('');
    setSeoKeywords(['lab diamond UK', 'bespoke engagement ring', 'Birmingham jewellery']);
    setContent(`## Introduction

Begin your bespoke article here. Discuss diamond quality, craftsmanship, or sizing nuances.

> "A great quote adds authority and editorial elegance to the post."

### Key Details
* **Point One:** Clear, certified advice.
* **Point Two:** Direct atelier insight.
`);
    setStatus('published');
    setCurrentView('editor');
    setEditorMode('write');
  };

  const handleEditArticle = (art: GazetteArticle) => {
    setEditingId(art.id);
    setTitle(art.title);
    setSlug(art.slug);
    setIsSlugManual(true);
    setCategory(art.category);
    setAuthor(art.author);
    setReadTime(art.readTime);
    setCoverImage(art.coverImage);
    setMetaDescription(art.metaDescription || art.excerpt);
    setSeoKeywords(art.seoKeywords || []);
    setContent(art.content);
    setStatus(art.status);
    setCurrentView('editor');
    setEditorMode('write');
  };

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!isSlugManual) {
      setSlug(slugify(val));
    }
    if (!readTime) {
      setReadTime(calculateReadTime(content));
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (loadEvt) => {
      if (loadEvt.target?.result) {
        setCoverImage(loadEvt.target.result as string);
        showNotification('Cover image uploaded successfully');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleAddKeyword = () => {
    if (!seoKeywordInput.trim()) return;
    if (!seoKeywords.includes(seoKeywordInput.trim())) {
      setSeoKeywords([...seoKeywords, seoKeywordInput.trim()]);
    }
    setSeoKeywordInput('');
  };

  const handleRemoveKeyword = (kw: string) => {
    setSeoKeywords(seoKeywords.filter((k) => k !== kw));
  };

  // Quick Markdown toolbar insert
  const insertMarkdown = (syntaxStart: string, syntaxEnd: string = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const currentText = textarea.value;
    const selectedText = currentText.substring(start, end) || 'text';

    const replacement = `${syntaxStart}${selectedText}${syntaxEnd}`;
    const newText = currentText.substring(0, start) + replacement + currentText.substring(end);

    setContent(newText);
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + syntaxStart.length, start + syntaxStart.length + selectedText.length);
    }, 50);
  };

  const handleSave = (targetStatus: 'published' | 'draft') => {
    if (!title.trim()) {
      alert('Please provide an article title.');
      return;
    }

    const calculatedSlug = slug.trim() ? slugify(slug) : slugify(title);
    const calculatedExcerpt = metaDescription.trim() 
      ? metaDescription 
      : content.replace(/[#*`>|_-]/g, '').slice(0, 160) + '...';

    const articleToSave: GazetteArticle = {
      id: editingId || `art-${Date.now()}`,
      slug: calculatedSlug,
      title: title.trim(),
      excerpt: calculatedExcerpt,
      category,
      coverImage: coverImage.trim() || 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1200&q=85',
      publishedAt: editingId ? (articles.find(a => a.id === editingId)?.publishedAt || 'Today') : new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
      readTime: readTime.trim() || calculateReadTime(content),
      author: author.trim() || 'Brindley Atelier Editorial',
      status: targetStatus,
      metaDescription: metaDescription.trim() || calculatedExcerpt,
      seoKeywords: seoKeywords.length > 0 ? seoKeywords : ['diamond', 'bespoke jewellery'],
      content: content.trim()
    };

    saveGazetteArticle(articleToSave);
    showNotification(targetStatus === 'published' ? 'Article published live!' : 'Draft saved.');
    if (onArticlePublished) onArticlePublished(articleToSave);
    setCurrentView('list');
  };

  const handleDelete = (id: string, artTitle: string) => {
    if (window.confirm(`Are you sure you want to delete "${artTitle}"?`)) {
      deleteGazetteArticle(id);
      showNotification('Article deleted.');
    }
  };

  const handleResetDefaults = () => {
    if (window.confirm('Reset all Gazette essays to the 3 original launch articles? Any custom modifications will be refreshed.')) {
      resetGazetteArticles();
      showNotification('Reset to launch articles complete.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl bg-[#10191D] border border-white/15 rounded-xs shadow-2xl text-[#E2E8F0] my-8 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Modal Top Bar */}
        <div className="px-6 py-4 bg-[#172227] border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-xs bg-[#ECE5DA]/10 border border-[#ECE5DA]/30 flex items-center justify-center text-[#ECE5DA]">
              <Lock className="w-3.5 h-3.5" />
            </div>
            <div>
              <h3 className="font-mono text-xs uppercase tracking-[0.2em] text-[#ECE5DA] font-semibold">
                The Vault Gazette — Editorial CMS
              </h3>
              <p className="text-[10px] font-mono text-[#E2E8F0]/50 uppercase tracking-widest">
                Brindley Atelier Publishing Engine
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {isAuthenticated && (
              <button
                onClick={handleLogout}
                className="px-2.5 py-1 text-[10px] font-mono text-[#E2E8F0]/60 hover:text-rose-400 uppercase tracking-wider border border-white/10 hover:border-rose-400/40 rounded-xs transition-colors cursor-pointer"
              >
                Sign Out
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 text-[#E2E8F0]/60 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Notification Banner */}
        {notification && (
          <div className="px-6 py-2 bg-emerald-500/20 border-b border-emerald-500/30 text-emerald-300 text-xs font-mono flex items-center gap-2 animate-in slide-in-from-top duration-200">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{notification}</span>
          </div>
        )}

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto grow">
          {!isAuthenticated ? (
            /* PIN / PASSWORD GATE */
            <div className="max-w-md mx-auto py-12 text-center">
              <div className="w-14 h-14 rounded-full bg-[#ECE5DA]/10 border border-[#ECE5DA]/30 text-[#ECE5DA] flex items-center justify-center mx-auto mb-4">
                <KeyRound className="w-6 h-6" />
              </div>

              <h4 className="text-xl font-display text-white mb-2 uppercase tracking-wider">
                Staff Authentication Required
              </h4>
              <p className="text-xs font-mono text-[#E2E8F0]/60 mb-6">
                Enter your Atelier Master PIN or password to draft, edit, and publish articles live to The Vault Gazette.
              </p>

              <form onSubmit={handleLogin} className="space-y-4">
                <div className="relative">
                  <input
                    type="password"
                    autoFocus
                    placeholder="Enter Master Passcode"
                    value={passcode}
                    onChange={(e) => {
                      setPasscode(e.target.value);
                      setAuthError(false);
                    }}
                    className={`w-full text-center tracking-[0.3em] font-mono text-base px-4 py-3 bg-[#172227] border rounded-xs focus:outline-hidden ${
                      authError
                        ? 'border-rose-500 text-rose-300'
                        : 'border-white/15 focus:border-[#ECE5DA] text-white'
                    }`}
                  />
                </div>

                {authError && (
                  <p className="text-xs font-mono text-rose-400 flex items-center justify-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>Incorrect passcode. Access denied.</span>
                  </p>
                )}

                <div className="flex items-center justify-center gap-2 text-xs font-mono text-[#E2E8F0]/60">
                  <input
                    type="checkbox"
                    id="remember"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="accent-[#ECE5DA] cursor-pointer"
                  />
                  <label htmlFor="remember" className="cursor-pointer">
                    Remember this device
                  </label>
                </div>

                <button
                  type="submit"
                  className="w-full btn-solid py-3 text-xs font-mono uppercase tracking-[0.2em] flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Unlock className="w-4 h-4" />
                  <span>Access CMS Workspace</span>
                </button>
              </form>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Primary CMS Navigation: Articles vs Subscribers */}
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setCurrentView('list')}
                    className={`px-3 py-1.5 rounded-xs text-xs font-mono uppercase tracking-wider transition-colors flex items-center gap-2 cursor-pointer ${
                      currentView === 'list' || currentView === 'editor'
                        ? 'bg-[#ECE5DA] text-[#080C0E] font-semibold'
                        : 'text-white/60 hover:text-white hover:bg-white/5 border border-white/10'
                    }`}
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Articles ({articles.length})</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setCurrentView('subscribers')}
                    className={`px-3 py-1.5 rounded-xs text-xs font-mono uppercase tracking-wider transition-colors flex items-center gap-2 cursor-pointer ${
                      currentView === 'subscribers'
                        ? 'bg-[#ECE5DA] text-[#080C0E] font-semibold'
                        : 'text-white/60 hover:text-white hover:bg-white/5 border border-white/10'
                    }`}
                  >
                    <Users className="w-3.5 h-3.5" />
                    <span>Subscribers ({subscribers.length})</span>
                  </button>
                </div>

                {currentView === 'subscribers' && subscribers.length > 0 && (
                  <button
                    type="button"
                    onClick={handleExportCSV}
                    className="px-3 py-1.5 rounded-xs bg-[#ECE5DA] hover:bg-white text-[#080C0E] text-xs font-mono uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-sm cursor-pointer font-semibold"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Export CSV</span>
                  </button>
                )}
              </div>

              {currentView === 'subscribers' ? (
                /* SUBSCRIBERS VIEW */
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
                    <div>
                      <h4 className="text-lg font-display text-white uppercase tracking-wider">
                        The Vault Gazette — Private Subscribers
                      </h4>
                      <p className="text-xs font-mono text-[#E2E8F0]/60">
                        Client email subscriptions received from the footer newsletter and editorial dispatches.
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="relative w-full sm:w-64">
                        <Search className="w-3.5 h-3.5 text-white/40 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <input
                          type="text"
                          value={subscriberSearch}
                          onChange={(e) => setSubscriberSearch(e.target.value)}
                          placeholder="Search email..."
                          className="w-full pl-9 pr-3 py-1.5 bg-[#172227] border border-white/15 focus:border-[#ECE5DA] rounded-xs text-xs font-mono text-white placeholder:text-white/30 outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Summary Metric Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="p-4 rounded-xs bg-[#172227]/70 border border-white/10">
                      <div className="text-[10px] font-mono uppercase tracking-wider text-[#ECE5DA]/70 mb-1">
                        Active Subscriptions
                      </div>
                      <div className="text-2xl font-display text-white">
                        {subscribers.filter((s) => s.status === 'active').length}
                      </div>
                    </div>
                    <div className="p-4 rounded-xs bg-[#172227]/70 border border-white/10">
                      <div className="text-[10px] font-mono uppercase tracking-wider text-[#ECE5DA]/70 mb-1">
                        Primary Source Channel
                      </div>
                      <div className="text-sm font-mono text-white/90">
                        Footer Dispatch Form
                      </div>
                    </div>
                    <div className="p-4 rounded-xs bg-[#172227]/70 border border-white/10">
                      <div className="text-[10px] font-mono uppercase tracking-wider text-[#ECE5DA]/70 mb-1">
                        Compliance Protocol
                      </div>
                      <div className="text-sm font-mono text-emerald-400">
                        UK GDPR Consent Logged
                      </div>
                    </div>
                  </div>

                  {/* Subscribers Table */}
                  <div className="border border-white/10 rounded-xs overflow-hidden bg-[#172227]/70">
                    {subscribers.length === 0 ? (
                      <div className="py-16 px-4 text-center space-y-3">
                        <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto text-[#ECE5DA]">
                          <Mail className="w-5 h-5" />
                        </div>
                        <h5 className="text-base font-display text-white">No Registered Subscribers Yet</h5>
                        <p className="text-xs font-mono text-[#E2E8F0]/60 max-w-md mx-auto leading-relaxed">
                          When visitors enter their email address into the footer newsletter form, their details are immediately captured, timestamped, and stored here.
                        </p>
                      </div>
                    ) : (
                      <div className="divide-y divide-white/10">
                        <div className="hidden sm:grid sm:grid-cols-12 px-5 py-3 text-[10px] font-mono uppercase tracking-wider text-[#ECE5DA]/70 bg-white/[0.02]">
                          <div className="col-span-5">Subscriber Email</div>
                          <div className="col-span-3">Registered At</div>
                          <div className="col-span-2">Source</div>
                          <div className="col-span-1">Status</div>
                          <div className="col-span-1 text-right">Action</div>
                        </div>

                        {subscribers
                          .filter((s) => s.email.toLowerCase().includes(subscriberSearch.toLowerCase()))
                          .map((sub) => (
                            <div
                              key={sub.id}
                              className="p-4 sm:px-5 sm:py-3.5 flex flex-col sm:grid sm:grid-cols-12 items-start sm:items-center gap-2 sm:gap-4 hover:bg-white/5 transition-colors"
                            >
                              <div className="sm:col-span-5 flex items-center gap-2">
                                <Mail className="w-3.5 h-3.5 text-[#ECE5DA]/70 shrink-0" />
                                <span className="text-xs font-mono text-white font-medium break-all">
                                  {sub.email}
                                </span>
                              </div>

                              <div className="sm:col-span-3 text-[11px] font-mono text-[#E2E8F0]/60">
                                {new Date(sub.subscribedAt).toLocaleString('en-GB', {
                                  day: 'numeric',
                                  month: 'short',
                                  year: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </div>

                              <div className="sm:col-span-2">
                                <span className="px-2 py-0.5 text-[9px] font-mono uppercase tracking-wider bg-white/5 border border-white/10 rounded-xs text-[#E2E8F0]/80">
                                  {sub.source.replace('_', ' ')}
                                </span>
                              </div>

                              <div className="sm:col-span-1">
                                <span className="px-2 py-0.5 text-[9px] font-mono uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-xs">
                                  {sub.status}
                                </span>
                              </div>

                              <div className="sm:col-span-1 flex items-center justify-end w-full sm:w-auto">
                                <button
                                  type="button"
                                  onClick={() => handleRemoveSubscriber(sub.id, sub.email)}
                                  className="p-1.5 text-white/40 hover:text-rose-400 transition-colors cursor-pointer"
                                  title="Remove subscriber"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          ))}
                      </div>
                    )}
                  </div>
                </div>
              ) : currentView === 'list' ? (
            /* ARTICLES LIST VIEW */
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
                <div>
                  <h4 className="text-lg font-display text-white uppercase tracking-wider">
                    Published Gazette Catalogue
                  </h4>
                  <p className="text-xs font-mono text-[#E2E8F0]/60">
                    Manage live editorials, drafts, and SEO meta descriptors.
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={handleResetDefaults}
                    className="px-3 py-2 rounded-xs border border-white/10 hover:border-amber-400/50 text-[11px] font-mono uppercase tracking-wider text-[#E2E8F0]/70 hover:text-amber-300 transition-colors flex items-center gap-1.5 cursor-pointer"
                    title="Restore pre-loaded launch articles"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset Defaults</span>
                  </button>

                  <button
                    onClick={handleCreateNew}
                    className="btn-solid py-2 px-4 text-xs font-mono uppercase tracking-wider flex items-center gap-1.5 cursor-pointer shadow-md"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Draft New Article</span>
                  </button>
                </div>
              </div>

              {/* Articles Table */}
              <div className="border border-white/10 rounded-xs overflow-hidden bg-[#172227]/70">
                <div className="divide-y divide-white/10">
                  {articles.map((art) => (
                    <div
                      key={art.id}
                      className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-white/5 transition-colors"
                    >
                      <div className="flex items-start gap-4">
                        <img
                          src={art.coverImage}
                          alt={art.title}
                          className="w-16 h-16 rounded-xs object-cover shrink-0 border border-white/10"
                          referrerPolicy="no-referrer"
                        />
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="px-2 py-0.5 text-[9px] font-mono uppercase tracking-widest bg-[#ECE5DA]/10 text-[#ECE5DA] border border-[#ECE5DA]/20 rounded-xs">
                              {art.category}
                            </span>
                            <span className={`px-2 py-0.5 text-[9px] font-mono uppercase tracking-widest rounded-xs ${
                              art.status === 'published' 
                                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                                : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            }`}>
                              {art.status}
                            </span>
                          </div>

                          <h5 className="text-sm font-display text-white font-medium line-clamp-1">
                            {art.title}
                          </h5>

                          <div className="flex items-center gap-3 text-[11px] font-mono text-[#E2E8F0]/40 mt-1">
                            <span>Slug: /{art.slug}</span>
                            <span>•</span>
                            <span>{art.readTime}</span>
                            <span>•</span>
                            <span>{art.publishedAt}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                        <button
                          onClick={() => handleEditArticle(art)}
                          className="p-2 rounded-xs bg-[#10191D] border border-white/15 hover:border-[#ECE5DA] text-[#ECE5DA] text-xs font-mono transition-colors flex items-center gap-1.5 cursor-pointer"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => handleDelete(art.id, art.title)}
                          className="p-2 rounded-xs bg-[#10191D] border border-white/15 hover:border-rose-500/50 text-[#E2E8F0]/60 hover:text-rose-400 text-xs font-mono transition-colors cursor-pointer"
                          title="Delete article"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            /* POST EDITOR FORM */
            <div className="space-y-6">
              {/* Editor Top Switcher */}
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <button
                  type="button"
                  onClick={() => setCurrentView('list')}
                  className="text-xs font-mono uppercase tracking-wider text-[#ECE5DA]/80 hover:text-[#ECE5DA] flex items-center gap-1.5 cursor-pointer"
                >
                  <span>← Back to Catalogue</span>
                </button>

                <div className="flex items-center gap-2">
                  <div className="flex rounded-xs border border-white/15 bg-[#172227] p-0.5">
                    <button
                      type="button"
                      onClick={() => setEditorMode('write')}
                      className={`px-3 py-1 text-xs font-mono uppercase tracking-wider rounded-xs transition-colors cursor-pointer ${
                        editorMode === 'write' ? 'bg-[#ECE5DA] text-[#172227] font-semibold' : 'text-[#E2E8F0]/70 hover:text-white'
                      }`}
                    >
                      Write
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditorMode('preview')}
                      className={`px-3 py-1 text-xs font-mono uppercase tracking-wider rounded-xs transition-colors cursor-pointer ${
                        editorMode === 'preview' ? 'bg-[#ECE5DA] text-[#172227] font-semibold' : 'text-[#E2E8F0]/70 hover:text-white'
                      }`}
                    >
                      Live Preview
                    </button>
                  </div>
                </div>
              </div>

              {editorMode === 'write' ? (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  {/* Left Main Form Column */}
                  <div className="lg:col-span-8 space-y-5">
                    {/* Title */}
                    <div>
                      <label className="text-[11px] font-mono tracking-[0.18em] text-[#ECE5DA] uppercase block mb-1.5 font-semibold">
                        Article Title *
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Why E-Colour & VS Clarity Are the True Sweet Spot..."
                        value={title}
                        onChange={(e) => handleTitleChange(e.target.value)}
                        className="w-full px-4 py-3 bg-[#172227] border border-white/15 rounded-xs text-sm sm:text-base font-display text-white focus:outline-hidden focus:border-[#ECE5DA]"
                      />
                    </div>

                    {/* Slug */}
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="text-[10px] font-mono tracking-[0.18em] text-[#E2E8F0]/70 uppercase font-semibold">
                          URL Slug
                        </label>
                        <button
                          type="button"
                          onClick={() => {
                            setIsSlugManual(false);
                            setSlug(slugify(title));
                          }}
                          className="text-[10px] font-mono text-[#ECE5DA] underline uppercase cursor-pointer"
                        >
                          Auto-generate from title
                        </button>
                      </div>
                      <div className="flex items-center bg-[#172227] border border-white/15 rounded-xs px-3 text-xs font-mono text-[#E2E8F0]/60">
                        <span className="text-[#ECE5DA]/50 select-none">/gazette/</span>
                        <input
                          type="text"
                          value={slug}
                          onChange={(e) => {
                            setIsSlugManual(true);
                            setSlug(e.target.value);
                          }}
                          className="w-full py-2.5 px-1 bg-transparent text-[#E2E8F0] focus:outline-hidden"
                        />
                      </div>
                    </div>

                    {/* Markdown Body with Luxury Toolbar */}
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="text-[11px] font-mono tracking-[0.18em] text-[#ECE5DA] uppercase font-semibold">
                          Editorial Body (Markdown Supported) *
                        </label>
                        <span className="text-[10px] font-mono text-[#E2E8F0]/50">
                          {calculateReadTime(content)}
                        </span>
                      </div>

                      {/* Markdown Toolbar */}
                      <div className="flex flex-wrap items-center gap-1.5 p-2 bg-[#172227] border border-b-0 border-white/15 rounded-t-xs">
                        <button
                          type="button"
                          onClick={() => insertMarkdown('**', '**')}
                          className="p-1.5 hover:bg-white/10 text-[#E2E8F0] rounded-xs cursor-pointer text-xs"
                          title="Bold"
                        >
                          <Bold className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => insertMarkdown('*', '*')}
                          className="p-1.5 hover:bg-white/10 text-[#E2E8F0] rounded-xs cursor-pointer text-xs"
                          title="Italic"
                        >
                          <Italic className="w-3.5 h-3.5" />
                        </button>
                        <span className="text-white/20">|</span>
                        <button
                          type="button"
                          onClick={() => insertMarkdown('## ')}
                          className="p-1.5 hover:bg-white/10 text-[#E2E8F0] rounded-xs cursor-pointer text-xs font-mono"
                          title="Heading 2"
                        >
                          <Heading2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => insertMarkdown('### ')}
                          className="p-1.5 hover:bg-white/10 text-[#E2E8F0] rounded-xs cursor-pointer text-xs font-mono"
                          title="Heading 3"
                        >
                          <Heading3 className="w-3.5 h-3.5" />
                        </button>
                        <span className="text-white/20">|</span>
                        <button
                          type="button"
                          onClick={() => insertMarkdown('> ')}
                          className="p-1.5 hover:bg-white/10 text-[#E2E8F0] rounded-xs cursor-pointer text-xs"
                          title="Pull Quote"
                        >
                          <Quote className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => insertMarkdown('* ')}
                          className="p-1.5 hover:bg-white/10 text-[#E2E8F0] rounded-xs cursor-pointer text-xs"
                          title="Bullet list"
                        >
                          <List className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => insertMarkdown('\n---\n')}
                          className="px-2 py-1 hover:bg-white/10 text-[#E2E8F0] rounded-xs cursor-pointer text-[10px] font-mono"
                          title="Divider"
                        >
                          --- Divider
                        </button>
                      </div>

                      <textarea
                        ref={textareaRef}
                        rows={14}
                        placeholder="Write in British English with markdown formatting..."
                        value={content}
                        onChange={(e) => {
                          setContent(e.target.value);
                          setReadTime(calculateReadTime(e.target.value));
                        }}
                        className="w-full px-4 py-3 bg-[#172227] border border-white/15 rounded-b-xs text-xs sm:text-sm font-mono text-[#E2E8F0] focus:outline-hidden focus:border-[#ECE5DA] leading-relaxed"
                      />
                    </div>
                  </div>

                  {/* Right Sidebar Metadata Column */}
                  <div className="lg:col-span-4 space-y-5 bg-[#172227]/60 p-5 rounded-xs border border-white/10">
                    <h5 className="font-mono text-xs uppercase tracking-widest text-[#ECE5DA] font-semibold border-b border-white/10 pb-2">
                      Publishing Parameters
                    </h5>

                    {/* Category */}
                    <div>
                      <label className="text-[10px] font-mono tracking-[0.18em] text-[#E2E8F0]/70 uppercase block mb-1 font-semibold">
                        Editorial Category
                      </label>
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value as GazetteCategory)}
                        className="w-full bg-[#10191D] border border-white/15 rounded-xs px-3 py-2.5 text-xs font-mono text-white focus:outline-hidden focus:border-[#ECE5DA]"
                      >
                        {CATEGORIES.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Author & Read Time */}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-[10px] font-mono tracking-[0.18em] text-[#E2E8F0]/70 uppercase block mb-1">
                          Author Byline
                        </label>
                        <input
                          type="text"
                          value={author}
                          onChange={(e) => setAuthor(e.target.value)}
                          className="w-full bg-[#10191D] border border-white/15 rounded-xs px-3 py-2 text-xs font-mono text-white focus:outline-hidden"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-mono tracking-[0.18em] text-[#E2E8F0]/70 uppercase block mb-1">
                          Read Time
                        </label>
                        <input
                          type="text"
                          value={readTime}
                          onChange={(e) => setReadTime(e.target.value)}
                          className="w-full bg-[#10191D] border border-white/15 rounded-xs px-3 py-2 text-xs font-mono text-white focus:outline-hidden"
                        />
                      </div>
                    </div>

                    {/* Cover Image URL & Upload */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-[10px] font-mono tracking-[0.18em] text-[#E2E8F0]/70 uppercase font-semibold">
                          Cover Image
                        </label>
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="text-[10px] font-mono text-[#ECE5DA] hover:underline uppercase flex items-center gap-1 cursor-pointer"
                        >
                          <Upload className="w-2.5 h-2.5" />
                          <span>Upload File</span>
                        </button>
                      </div>

                      <input
                        type="file"
                        ref={fileInputRef}
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />

                      <input
                        type="text"
                        placeholder="Image URL (https://...)"
                        value={coverImage}
                        onChange={(e) => setCoverImage(e.target.value)}
                        className="w-full bg-[#10191D] border border-white/15 rounded-xs px-3 py-2 text-xs font-mono text-white mb-2 focus:outline-hidden"
                      />

                      {coverImage && (
                        <div className="relative h-28 rounded-xs overflow-hidden border border-white/15 bg-black">
                          <img
                            src={coverImage}
                            alt="Cover preview"
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                      )}
                    </div>

                    {/* Meta Description (SEO Excerpt) */}
                    <div>
                      <label className="text-[10px] font-mono tracking-[0.18em] text-[#E2E8F0]/70 uppercase block mb-1 font-semibold">
                        Meta Description &amp; Excerpt (SEO)
                      </label>
                      <textarea
                        rows={3}
                        placeholder="Summarise in 1-2 compelling sentences for Google search and social previews..."
                        value={metaDescription}
                        onChange={(e) => setMetaDescription(e.target.value)}
                        className="w-full bg-[#10191D] border border-white/15 rounded-xs px-3 py-2 text-xs font-mono text-white focus:outline-hidden"
                      />
                      <span className="text-[9px] font-mono text-[#E2E8F0]/40">
                        {metaDescription.length} characters (140-160 recommended)
                      </span>
                    </div>

                    {/* SEO Focus Keywords */}
                    <div>
                      <label className="text-[10px] font-mono tracking-[0.18em] text-[#E2E8F0]/70 uppercase block mb-1 font-semibold">
                        SEO Focus Keywords
                      </label>
                      <div className="flex gap-1.5 mb-2">
                        <input
                          type="text"
                          placeholder="e.g. lab diamond UK"
                          value={seoKeywordInput}
                          onChange={(e) => setSeoKeywordInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleAddKeyword();
                            }
                          }}
                          className="grow bg-[#10191D] border border-white/15 rounded-xs px-3 py-1.5 text-xs font-mono text-white focus:outline-hidden"
                        />
                        <button
                          type="button"
                          onClick={handleAddKeyword}
                          className="px-3 py-1 bg-[#ECE5DA]/10 hover:bg-[#ECE5DA]/20 text-[#ECE5DA] border border-[#ECE5DA]/30 rounded-xs text-xs font-mono cursor-pointer"
                        >
                          Add
                        </button>
                      </div>

                      <div className="flex flex-wrap gap-1.5">
                        {seoKeywords.map((kw) => (
                          <span
                            key={kw}
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-xs bg-[#10191D] border border-white/10 text-[10px] font-mono text-[#ECE5DA]"
                          >
                            <span>{kw}</span>
                            <button
                              type="button"
                              onClick={() => handleRemoveKeyword(kw)}
                              className="text-white/40 hover:text-rose-400"
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="pt-4 border-t border-white/10 space-y-2.5">
                      <button
                        type="button"
                        onClick={() => handleSave('published')}
                        className="w-full btn-solid py-3 text-xs font-mono uppercase tracking-[0.2em] flex items-center justify-center gap-2 cursor-pointer shadow-lg"
                      >
                        <Send className="w-4 h-4" />
                        <span>Publish Live</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleSave('draft')}
                        className="w-full btn-ghost py-2.5 text-xs font-mono uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <Save className="w-3.5 h-3.5" />
                        <span>Save as Draft</span>
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                /* LIVE PREVIEW SCREEN */
                <div className="p-6 bg-[#172227] rounded-xs border border-white/15 max-w-3xl mx-auto">
                  <div className="mb-6">
                    <span className="px-3 py-1 text-[10px] font-mono uppercase tracking-[0.2em] bg-[#ECE5DA]/10 text-[#ECE5DA] border border-[#ECE5DA]/30 rounded-xs">
                      {category}
                    </span>
                    <h2 className="text-2xl sm:text-4xl font-display text-white mt-4 mb-4">
                      {title || 'Untitled Article Preview'}
                    </h2>
                    <p className="text-base text-[#E2E8F0]/70 italic border-l-2 border-[#ECE5DA] pl-4 font-serif">
                      {metaDescription || 'No excerpt summary provided yet.'}
                    </p>
                  </div>

                  {coverImage && (
                    <div className="mb-8 rounded-xs overflow-hidden border border-white/10">
                      <img
                        src={coverImage}
                        alt="Preview"
                        className="w-full h-64 object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  )}

                  <GazetteMarkdownRenderer content={content} />
                </div>
              )}
            </div>
            )}
          </div>
          )}
        </div>
      </div>
    </div>
  );
};
