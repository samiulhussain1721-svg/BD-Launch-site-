import React, { useEffect, useState } from 'react';
import { GazetteArticle } from '../types';
import { setDocumentSEO, resetDocumentSEO } from '../utils/seo';
import { GazetteMarkdownRenderer } from './GazetteMarkdownRenderer';
import {
  ArrowLeft,
  Clock,
  Calendar,
  Share2,
  Check,
  MessageCircle,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Gem
} from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';

interface GazetteArticleViewProps {
  article: GazetteArticle;
  allArticles: GazetteArticle[];
  onBack: () => void;
  onSelectArticle: (article: GazetteArticle) => void;
  onOpenConsultation: () => void;
}

export const GazetteArticleView: React.FC<GazetteArticleViewProps> = ({
  article,
  allArticles,
  onBack,
  onSelectArticle,
  onOpenConsultation,
}) => {
  const [copied, setCopied] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    // Only scroll to top when changing article
    window.scrollTo({ top: 0, behavior: 'instant' });

    // Update dynamic SEO & Schema
    setDocumentSEO({
      title: article.title,
      description: article.metaDescription || article.excerpt,
      image: article.coverImage,
      article: article,
      url: `${window.location.origin}/#gazette/${article.slug}`
    });

    return () => {
      resetDocumentSEO();
    };
  }, [article.id, article.slug]);

  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/#gazette/${article.slug}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: article.title,
          text: article.excerpt,
          url: shareUrl,
        });
        return;
      } catch (err) {
        // Fallback to clipboard
      }
    }

    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  // Other recommended articles
  const otherArticles = allArticles
    .filter((a) => a.id !== article.id && a.status === 'published')
    .slice(0, 2);

  const whatsappMessage = `Hello Brindley Diamonds, I was reading your Gazette editorial "${article.title}" and would love to consult with a Private Client Advisor regarding a bespoke piece.`;

  return (
    <motion.article
      initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 16 }}
      animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="min-h-screen py-12 md:py-20 text-[#E2E8F0]"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Navigation & Header Actions */}
        <div className="flex items-center justify-between gap-4 mb-8 pb-4 border-b border-white/10">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#ECE5DA]/80 hover:text-[#ECE5DA] transition-colors cursor-pointer group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Return to The Gazette</span>
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={handleShare}
              className="px-3 py-1.5 rounded-xs border border-white/15 hover:border-[#ECE5DA] text-xs font-mono tracking-wider text-[#E2E8F0]/70 hover:text-[#ECE5DA] transition-all flex items-center gap-1.5 cursor-pointer bg-[#10191D]/80"
              title="Share article link"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400 text-[11px]">Link Copied</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5" />
                  <span className="text-[11px]">Share</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Article Header */}
        <header className="mb-10 text-left">
          {/* Category Chip & Read Time */}
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="px-3 py-1 text-[10px] font-mono uppercase tracking-[0.2em] bg-[#ECE5DA]/10 text-[#ECE5DA] border border-[#ECE5DA]/30 rounded-xs">
              {article.category}
            </span>
            <div className="flex items-center gap-1.5 text-xs font-mono text-[#E2E8F0]/50">
              <Clock className="w-3.5 h-3.5" />
              <span>{article.readTime}</span>
            </div>
            <span className="text-white/15">•</span>
            <div className="flex items-center gap-1.5 text-xs font-mono text-[#E2E8F0]/50">
              <Calendar className="w-3.5 h-3.5" />
              <span>{article.publishedAt}</span>
            </div>
          </div>

          {/* Headline */}
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-display text-[#FFFFFF] font-light leading-tight tracking-[0.04em] mb-6">
            {article.title}
          </h1>

          {/* Standfirst / Excerpt */}
          <p className="text-base sm:text-lg text-[#E2E8F0]/75 font-light leading-relaxed border-l-2 border-[#ECE5DA]/50 pl-4 sm:pl-6 italic font-serif">
            {article.excerpt}
          </p>

          {/* Author Metadata bar */}
          <div className="flex items-center gap-3 mt-6 pt-6 border-t border-white/10 text-xs font-mono text-[#E2E8F0]/60">
            <div className="w-8 h-8 rounded-full bg-[#10191D] border border-[#ECE5DA]/30 flex items-center justify-center text-[#ECE5DA]">
              <Gem className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[#FFFFFF] font-medium">{article.author}</div>
              <div className="text-[10px] text-[#E2E8F0]/40 uppercase tracking-wider">Birmingham Jewellery Quarter Atelier</div>
            </div>
          </div>
        </header>

        {/* High-Resolution Hero Image */}
        <div className="relative mb-12 rounded-xs overflow-hidden border border-white/10 bg-[#10191D] shadow-2xl">
          <img
            src={article.coverImage}
            alt={article.title}
            className="w-full h-[320px] sm:h-[450px] object-cover object-center img-luxury-zoom"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#172227]/80 via-transparent to-transparent pointer-events-none" />
          <div className="absolute bottom-3 right-3 px-2.5 py-1 bg-[#10191D]/80 backdrop-blur-xs border border-white/10 rounded-xs text-[9px] font-mono text-[#ECE5DA]/80 uppercase tracking-widest">
            Brindley Diamonds Archive
          </div>
        </div>

        {/* Main Article Content */}
        <div className="bg-[#172227]/90 backdrop-blur-md rounded-xs border border-white/10 p-6 sm:p-10 lg:p-12 mb-14 shadow-xl">
          <GazetteMarkdownRenderer content={article.content} />
        </div>

        {/* Dedicated Bottom WhatsApp & Consultation CTA */}
        <section className="my-16 bg-gradient-to-br from-[#10191D] to-[#172227] border border-[#ECE5DA]/30 rounded-xs p-8 sm:p-12 text-center relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#ECE5DA]/5 rounded-full blur-3xl pointer-events-none" />
          
          <div className="w-12 h-12 rounded-full bg-[#ECE5DA]/10 border border-[#ECE5DA]/30 text-[#ECE5DA] flex items-center justify-center mx-auto mb-5">
            <Sparkles className="w-6 h-6" />
          </div>

          <span className="text-[10px] font-mono tracking-[0.28em] text-[#ECE5DA] uppercase block mb-2 font-medium">
            Private Client Commission
          </span>

          <h3 className="text-2xl sm:text-3xl font-display text-[#FFFFFF] font-light tracking-wide mb-4 max-w-xl mx-auto">
            Have a bespoke design in mind?
          </h3>

          <p className="text-sm text-[#E2E8F0]/70 max-w-lg mx-auto font-light leading-relaxed mb-8">
            Chat with our Private Client Advisor on WhatsApp to source certified loose diamonds, refine 3D CAD sketches, or discuss your engagement ring timeline.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
            <a
              href={`https://wa.me/447721391972?text=${encodeURIComponent(whatsappMessage)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto btn-solid py-3.5 px-6 text-xs font-mono uppercase tracking-[0.18em] flex items-center justify-center gap-2.5 cursor-pointer shadow-lg"
            >
              <MessageCircle className="w-4 h-4 text-[#25D366]" />
              <span>Chat on WhatsApp</span>
            </a>

            <button
              onClick={onOpenConsultation}
              className="w-full sm:w-auto btn-ghost py-3.5 px-6 text-xs font-mono uppercase tracking-[0.18em] flex items-center justify-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#ECE5DA]" />
              <span>Book Consultation</span>
            </button>
          </div>

          <div className="mt-6 flex items-center justify-center gap-2 text-[10px] font-mono text-[#E2E8F0]/40 uppercase tracking-widest">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Birmingham Atelier • Bespoke Private Consultation</span>
          </div>
        </section>

        {/* Recommended Further Reading */}
        {otherArticles.length > 0 && (
          <div className="pt-10 border-t border-white/10">
            <div className="flex items-center justify-between mb-6">
              <h4 className="font-display text-xl text-[#FFFFFF] font-light tracking-wider uppercase">
                Further From The Gazette
              </h4>
              <button
                onClick={onBack}
                className="text-xs font-mono text-[#ECE5DA] hover:underline uppercase tracking-wider flex items-center gap-1 cursor-pointer"
              >
                <span>View All Articles</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {otherArticles.map((item) => (
                <div
                  key={item.id}
                  onClick={() => onSelectArticle(item)}
                  className="card-slate p-5 cursor-pointer group hover:border-[#ECE5DA]/50 transition-all flex flex-col justify-between bg-[#10191D]/90"
                >
                  <div className="flex gap-4">
                    <img
                      src={item.coverImage}
                      alt={item.title}
                      className="w-24 h-24 rounded-xs object-cover shrink-0 img-luxury-zoom"
                      referrerPolicy="no-referrer"
                    />
                    <div>
                      <span className="text-[9px] font-mono uppercase tracking-widest text-[#ECE5DA]/70 block mb-1">
                        {item.category}
                      </span>
                      <h5 className="text-sm font-display text-[#FFFFFF] group-hover:text-[#ECE5DA] transition-colors line-clamp-2 leading-snug">
                        {item.title}
                      </h5>
                      <span className="text-[10px] font-mono text-[#E2E8F0]/40 mt-2 block">
                        {item.readTime}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </motion.article>
  );
};
