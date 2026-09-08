import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { AboutSection } from './components/AboutSection';
import { RingsSection } from './components/RingsSection';
import { Certifications } from './components/Certifications';
import { RingSizingGuide } from './components/RingSizingGuide';
import { VaultGazetteSection } from './components/VaultGazetteSection';
import { GazetteArticleView } from './components/GazetteArticleView';
import { VaultAdminModal } from './components/VaultAdminModal';
import { ConsultationSection } from './components/ConsultationSection';
import { FAQSection } from './components/FAQSection';
import { Footer } from './components/Footer';
import { ConsultationModal } from './components/ConsultationModal';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';
import { ScrollDiamondBracelet } from './components/ScrollDiamondBracelet';
import { Ring, GazetteArticle } from './types';
import { RINGS_DATA } from './data/rings';
import { getGazetteArticles, getArticleBySlug } from './utils/gazetteStorage';

export default function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRing, setSelectedRing] = useState<Ring | null>(null);

  // The Vault Gazette state
  const [articles, setArticles] = useState<GazetteArticle[]>([]);
  const [selectedArticle, setSelectedArticle] = useState<GazetteArticle | null>(null);
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  // Load articles & handle routing
  useEffect(() => {
    const loadedArticles = getGazetteArticles();
    setArticles(loadedArticles);

    // Check URL hash / pathname on initial load
    const handleUrlRouting = () => {
      const hash = window.location.hash;
      const path = window.location.pathname;

      if (path.endsWith('/vault-admin') || path.endsWith('/vault-admin/') || hash === '#vault-admin' || hash === '#gazette-admin') {
        setIsAdminOpen(true);
      } else if (hash.startsWith('#gazette/') || hash.startsWith('#article/')) {
        const slug = hash.replace(/^#(gazette|article)\//, '');
        const targetArticle = getArticleBySlug(slug);
        if (targetArticle) {
          setSelectedArticle(targetArticle);
        }
      } else if (hash === '#gazette') {
        setSelectedArticle(null);
        setTimeout(() => {
          document.getElementById('gazette')?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      } else if (hash === '#sizing') {
        setSelectedArticle(null);
        setTimeout(() => {
          document.getElementById('sizing')?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      } else if (hash && hash.startsWith('#') && hash.length > 1) {
        setSelectedArticle(null);
        const sectionId = hash.slice(1);
        setTimeout(() => {
          const el = document.getElementById(sectionId);
          if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
          }
        }, 100);
      }
    };

    handleUrlRouting();

    // Listen for hash changes
    window.addEventListener('hashchange', handleUrlRouting);

    // Listen for storage updates from CMS
    const handleGazetteUpdate = () => {
      const updated = getGazetteArticles();
      setArticles(updated);
      setSelectedArticle((current) => {
        if (!current) return null;
        return updated.find((a) => a.id === current.id || a.slug === current.slug) || current;
      });
    };

    window.addEventListener('gazette_updated', handleGazetteUpdate);

    return () => {
      window.removeEventListener('hashchange', handleUrlRouting);
      window.removeEventListener('gazette_updated', handleGazetteUpdate);
    };
  }, []);

  const handleOpenConsultation = () => {
    setSelectedRing(null);
    setIsModalOpen(true);
  };

  const handleSelectRing = (ring: Ring) => {
    setSelectedRing(ring);
    setIsModalOpen(true);
  };

  const handleSelectArticle = (article: GazetteArticle) => {
    setSelectedArticle(article);
    window.location.hash = `gazette/${article.slug}`;
  };

  const handleBackToGazette = () => {
    setSelectedArticle(null);
    window.location.hash = 'gazette';
    setTimeout(() => {
      document.getElementById('gazette')?.scrollIntoView({ behavior: 'smooth' });
    }, 50);
  };

  const handleNavigateHome = () => {
    setSelectedArticle(null);
    window.location.hash = '';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateToGazette = () => {
    setSelectedArticle(null);
    window.location.hash = 'gazette';
    setTimeout(() => {
      document.getElementById('gazette')?.scrollIntoView({ behavior: 'smooth' });
    }, 50);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#080C0E] text-[#E2E8F0] selection:bg-[#ECE5DA] selection:text-[#172227] relative">
      {/* 1. Continuous Scroll-Driven Diamond Bracelet Animation Viewport (Fixed z-index: 0) */}
      <ScrollDiamondBracelet />

      {/* 2. Main Content Foreground Container with floating glassmorphic depth */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Sticky Glassmorphic Header */}
        <Header
          onOpenConsultation={handleOpenConsultation}
          onNavigateHome={handleNavigateHome}
          onNavigateToGazette={handleNavigateToGazette}
        />

        {/* Main Content Area */}
        <main className="grow">
          {selectedArticle ? (
            /* Full-page Gazette Editorial Reader */
            <GazetteArticleView
              article={selectedArticle}
              allArticles={articles}
              onBack={handleBackToGazette}
              onSelectArticle={handleSelectArticle}
              onOpenConsultation={handleOpenConsultation}
            />
          ) : (
            /* Default Home View with all Atelier sections */
            <>
              {/* Cinematic Hero Section with Staggered 1.2s Reveal */}
              <Hero onOpenConsultation={handleOpenConsultation} />

              {/* Studio Philosophy & Bespoke Process */}
              <AboutSection onOpenConsultation={handleOpenConsultation} />

              {/* Diamond Showcase Cards & Signature Rings */}
              <RingsSection
                rings={RINGS_DATA}
                onSelectRing={handleSelectRing}
                onOpenConsultation={handleOpenConsultation}
              />

              {/* IGI Certification Standards */}
              <Certifications />

              {/* Ring Sizing Intelligence & Guide */}
              <RingSizingGuide />

              {/* The Vault Gazette Editorial Section */}
              <VaultGazetteSection
                articles={articles}
                onSelectArticle={handleSelectArticle}
                onOpenAdmin={() => setIsAdminOpen(true)}
              />

              {/* Consultation & Bespoke Enquiry Form */}
              <ConsultationSection />

              {/* FAQ Accordion */}
              <FAQSection />
            </>
          )}
        </main>

        {/* Footer */}
        <Footer
          onNavigateToGazette={handleNavigateToGazette}
          onOpenAdmin={() => setIsAdminOpen(true)}
        />
      </div>

      {/* Floating Sticky WhatsApp Consultation Button */}
      <FloatingWhatsApp />

      {/* Interactive Private Brief Modal */}
      <ConsultationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        selectedRing={selectedRing}
        selectedPost={null}
      />

      {/* The Vault Gazette CMS Admin Modal */}
      <VaultAdminModal
        isOpen={isAdminOpen}
        onClose={() => {
          setIsAdminOpen(false);
          if (window.location.hash === '#vault-admin' || window.location.hash === '#gazette-admin') {
            window.location.hash = '';
          }
        }}
        articles={articles}
        onArticlePublished={() => {
          setArticles(getGazetteArticles());
        }}
      />
    </div>
  );
}
