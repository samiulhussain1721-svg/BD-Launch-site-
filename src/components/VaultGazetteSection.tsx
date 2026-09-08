import React, { useState } from 'react';
import { GazetteArticle, GazetteCategory } from '../types';
import {
  BookOpen,
  Clock,
  ArrowRight,
  Sparkles,
  Search,
  PenLine,
} from 'lucide-react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';

interface VaultGazetteSectionProps {
  articles: GazetteArticle[];
  onSelectArticle: (article: GazetteArticle) => void;
  onOpenAdmin: () => void;
}

const CATEGORIES: ('All' | GazetteCategory)[] = [
  'All',
  'Diamond Education',
  'Bespoke Stories',
  'Sizing & Guides',
  'Jewellery Quarter Notes'
];

export const VaultGazetteSection: React.FC<VaultGazetteSectionProps> = ({
  articles,
  onSelectArticle,
  onOpenAdmin,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<'All' | GazetteCategory>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const shouldReduceMotion = useReducedMotion();

  // Filter published articles
  const publishedArticles = articles.filter((a) => a.status === 'published');

  const filteredArticles = publishedArticles.filter((article) => {
    const matchesCategory = selectedCategory === 'All' || article.category === selectedCategory;
    const matchesSearch =
      searchQuery === '' ||
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const featuredArticle = publishedArticles[0];
  const gridArticles = selectedCategory === 'All' && searchQuery === '' 
    ? filteredArticles.slice(1) 
    : filteredArticles;

  const headerVariants = {
    hidden: shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] }
    }
  };

  return (
    <section id="gazette" className="py-20 md:py-28 text-[#E2E8F0] relative overflow-hidden">
      {/* Subtle ambient lighting */}
      <div className="absolute top-1/4 right-1/4 w-[450px] h-[450px] bg-gradient-to-br from-[#ECE5DA]/6 via-transparent to-transparent rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Editorial Section Header in Floating Glass Panel */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          variants={headerVariants}
          className="p-8 sm:p-10 rounded-2xl bg-black/40 backdrop-blur-md border border-white/10 shadow-2xl flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16"
        >
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-[#ECE5DA]" />
              <span className="text-[11px] font-mono tracking-[0.28em] text-[#ECE5DA]/80 uppercase font-medium">
                Atelier Journal &amp; Intelligence
              </span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-display text-[#FFFFFF] font-light uppercase tracking-[0.14em] leading-tight">
              The Vault Gazette
            </h2>
            <p className="text-xs sm:text-sm text-[#E2E8F0]/65 font-light max-w-xl mt-3 leading-relaxed">
              Curated gemmological essays, diamond valuation insights, and behind-the-scenes craft dispatches directly from our Birmingham Jewellery Quarter workshop.
            </p>
          </div>

          {/* Quick CMS Access & Search */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={onOpenAdmin}
              className="px-3.5 py-2 rounded-xs border border-white/15 hover:border-[#ECE5DA] text-[10px] font-mono tracking-[0.18em] uppercase text-[#E2E8F0]/70 hover:text-[#ECE5DA] transition-all flex items-center gap-1.5 cursor-pointer bg-black/40 hover:bg-black/60 backdrop-blur-sm"
              title="Atelier CMS Publisher Login"
            >
              <PenLine className="w-3 h-3 text-[#ECE5DA]" />
              <span>Publisher CMS</span>
            </button>
          </div>
        </motion.div>

        {/* Search & Category Filter Toolbar */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          variants={headerVariants}
          className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 mb-12"
        >
          {/* Category Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 lg:pb-0 scrollbar-none">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-2 text-[10px] sm:text-[11px] font-mono uppercase tracking-wider rounded-xs border transition-all duration-300 cursor-pointer whitespace-nowrap ${
                  selectedCategory === cat
                    ? 'bg-[#ECE5DA] text-[#172227] border-[#ECE5DA] font-semibold shadow-sm'
                    : 'bg-[#10191D]/70 text-[#E2E8F0]/70 border-white/10 hover:border-[#ECE5DA]/40 hover:text-[#ECE5DA]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full lg:w-72">
            <Search className="w-3.5 h-3.5 text-[#E2E8F0]/40 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search essays & guides..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-[#10191D]/80 border border-white/10 rounded-xs text-xs font-mono text-[#E2E8F0] placeholder:text-[#E2E8F0]/40 focus:outline-hidden focus:border-[#ECE5DA] transition-colors"
            />
          </div>
        </motion.div>

        {/* FEATURED ESSAY */}
        {selectedCategory === 'All' && searchQuery === '' && featuredArticle && (
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            variants={{
              hidden: shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 24 },
              visible: {
                opacity: 1,
                y: 0,
                transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
              }
            }}
            onClick={() => onSelectArticle(featuredArticle)}
            className="mb-14 card-slate p-0 overflow-hidden group cursor-pointer border-white/15 hover:border-[#ECE5DA]/60 transition-all duration-300 bg-black/40 backdrop-blur-md rounded-2xl shadow-2xl"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
              {/* Cover Image */}
              <div className="lg:col-span-7 relative h-72 sm:h-96 lg:h-auto overflow-hidden bg-[#172227]">
                <img
                  src={featuredArticle.coverImage}
                  alt={featuredArticle.title}
                  className="w-full h-full object-cover object-center img-luxury-zoom"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-transparent to-[#10191D]/80 pointer-events-none" />
                <div className="absolute top-4 left-4 px-3 py-1 bg-[#10191D]/90 backdrop-blur-xs border border-[#ECE5DA]/30 rounded-xs text-[9px] font-mono tracking-[0.2em] uppercase text-[#ECE5DA] flex items-center gap-1.5 shadow-md">
                  <Sparkles className="w-3 h-3 text-[#ECE5DA]" />
                  <span>Lead Editorial</span>
                </div>
              </div>

              {/* Text Info */}
              <div className="lg:col-span-5 p-6 sm:p-10 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-3 text-xs font-mono text-[#E2E8F0]/50 mb-3">
                    <span className="text-[#ECE5DA] uppercase tracking-wider">{featuredArticle.category}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {featuredArticle.readTime}
                    </span>
                  </div>

                  <h3 className="text-xl sm:text-2xl lg:text-3xl font-display text-[#FFFFFF] font-light leading-snug tracking-wide group-hover:text-[#ECE5DA] transition-colors duration-300 mb-4">
                    {featuredArticle.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-[#E2E8F0]/70 font-light leading-relaxed mb-6 line-clamp-3">
                    {featuredArticle.excerpt}
                  </p>
                </div>

                <div className="pt-6 border-t border-white/10 flex items-center justify-between">
                  <span className="text-[11px] font-mono text-[#E2E8F0]/40">
                    {featuredArticle.publishedAt}
                  </span>
                  <span className="text-xs font-mono uppercase tracking-widest text-[#ECE5DA] group-hover:translate-x-1.5 transition-transform duration-300 flex items-center gap-1.5 font-medium">
                    <span>Read Essay</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* ARTICLES GRID */}
        {filteredArticles.length === 0 ? (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={headerVariants}
            className="card-slate p-12 text-center bg-[#10191D]/70 max-w-md mx-auto"
          >
            <BookOpen className="w-8 h-8 text-[#ECE5DA]/40 mx-auto mb-3" />
            <h4 className="font-display text-lg text-white mb-2">No Articles Found</h4>
            <p className="text-xs text-[#E2E8F0]/60 mb-4">
              We couldn't find any essays matching your filter.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('All');
                setSearchQuery('');
              }}
              className="btn-ghost py-2 px-4 text-xs font-mono uppercase tracking-wider"
            >
              Reset Filters
            </button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence mode="popLayout">
              {gridArticles.map((article, idx) => (
                <motion.article
                  key={article.id}
                  layout
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.15 }}
                  variants={{
                    hidden: shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 24 },
                    visible: {
                      opacity: 1,
                      y: 0,
                      transition: {
                        duration: 0.7,
                        delay: (idx % 3) * 0.1,
                        ease: [0.16, 1, 0.3, 1],
                      },
                    },
                  }}
                  onClick={() => onSelectArticle(article)}
                  className="card-slate p-0 overflow-hidden group cursor-pointer border-white/10 hover:border-[#ECE5DA]/50 transition-all duration-300 flex flex-col justify-between bg-black/40 backdrop-blur-md rounded-xl hover:shadow-2xl"
                >
                  <div>
                    {/* Card Cover */}
                    <div className="relative h-52 overflow-hidden bg-[#172227]">
                      <img
                        src={article.coverImage}
                        alt={article.title}
                        className="w-full h-full object-cover img-luxury-zoom"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute top-3 left-3 px-2.5 py-1 bg-[#10191D]/90 backdrop-blur-xs border border-white/10 rounded-xs text-[9px] font-mono tracking-widest uppercase text-[#ECE5DA]">
                        {article.category}
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="p-6">
                      <div className="flex items-center gap-3 text-[11px] font-mono text-[#E2E8F0]/50 mb-2.5">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {article.readTime}
                        </span>
                        <span>•</span>
                        <span>{article.publishedAt}</span>
                      </div>

                      <h4 className="text-base sm:text-lg font-display text-[#FFFFFF] font-light leading-snug tracking-wide group-hover:text-[#ECE5DA] transition-colors duration-300 mb-3 line-clamp-2">
                        {article.title}
                      </h4>

                      <p className="text-xs text-[#E2E8F0]/65 font-light leading-relaxed line-clamp-3">
                        {article.excerpt}
                      </p>
                    </div>
                  </div>

                  {/* Card Footer */}
                  <div className="px-6 py-4 border-t border-white/10 bg-[#172227]/40 flex items-center justify-between">
                    <span className="text-[10px] font-mono text-[#E2E8F0]/40 uppercase tracking-wider">
                      Brindley Atelier
                    </span>
                    <span className="text-[11px] font-mono uppercase tracking-widest text-[#ECE5DA] group-hover:translate-x-1 transition-transform duration-300 flex items-center gap-1 font-medium">
                      <span>Read</span>
                      <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </motion.article>
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* Gazette Footer Signpost */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          variants={headerVariants}
          className="mt-16 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-[#E2E8F0]/50 text-center sm:text-left"
        >
          <p>
            The Vault Gazette • Published by Brindley Diamonds Atelier, Birmingham Jewellery Quarter
          </p>
          <button
            onClick={onOpenAdmin}
            className="text-[#ECE5DA]/70 hover:text-[#ECE5DA] underline uppercase tracking-wider cursor-pointer transition-colors"
          >
            Author / Staff Portal
          </button>
        </motion.div>

      </div>
    </section>
  );
};
