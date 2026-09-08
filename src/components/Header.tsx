import React, { useState, useEffect } from 'react';
import { Menu, X, Sparkles, MessageCircle, Ruler, BookOpen } from 'lucide-react';
import { Logo } from './Logo';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';

interface HeaderProps {
  onOpenConsultation: () => void;
  onNavigateHome?: () => void;
  onNavigateToGazette?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenConsultation,
  onNavigateHome,
  onNavigateToGazette,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY || window.pageYOffset || document.documentElement.scrollTop || 0;
      setScrolled(scrollPos > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleHomeClick = (e: React.MouseEvent) => {
    if (onNavigateHome) {
      e.preventDefault();
      onNavigateHome();
      window.location.hash = '';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSectionClick = (sectionId: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    if (onNavigateHome) {
      onNavigateHome();
    }
    window.location.hash = sectionId;
    setTimeout(() => {
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }, 60);
  };

  const handleMobileSectionClick = (sectionId: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    if (onNavigateHome) {
      onNavigateHome();
    }
    window.location.hash = sectionId;
    setTimeout(() => {
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }, 60);
  };

  const handleGazetteClick = (e: React.MouseEvent) => {
    if (onNavigateToGazette) {
      e.preventDefault();
      onNavigateToGazette();
    }
  };

  return (
    <motion.header
      initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
      className={`sticky top-0 z-40 transition-all duration-500 ${
        scrolled
          ? 'bg-[#10191D]/90 backdrop-blur-md border-b border-white/10 shadow-2xl'
          : 'bg-[#172227]/75 backdrop-blur-sm border-b border-white/5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-4 xl:px-8 h-20 flex items-center justify-between gap-2 lg:gap-3 xl:gap-6">
        
        {/* Prominent Monogram & Brand Wordmark */}
        <a
          href="#"
          onClick={handleHomeClick}
          className="flex items-center gap-2.5 xl:gap-3 group shrink-0 cursor-pointer"
          title="Brindley Diamonds Birmingham Atelier"
        >
          <div className="relative">
            <Logo size="sm" variant="gold" showText={false} />
            <div className="absolute inset-0 rounded-full bg-[#ECE5DA]/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
          </div>
          <div className="flex flex-col leading-tight">
            <span className="font-mono text-xs xl:text-sm font-medium tracking-[0.18em] xl:tracking-[0.24em] text-[#ECE5DA] uppercase block group-hover:text-white transition-colors">
              Brindley Diamonds
            </span>
            <span className="text-[8px] xl:text-[9px] font-mono tracking-widest text-[#E2E8F0]/40 uppercase mt-0.5">
              Birmingham Atelier
            </span>
          </div>
        </a>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1.5 xl:gap-4 text-[9px] xl:text-[10.5px] font-mono uppercase tracking-[0.12em] xl:tracking-[0.16em] text-[#E2E8F0]/70 mx-auto">
          <a
            href="#about"
            onClick={handleSectionClick('about')}
            className="hover:text-[#ECE5DA] transition-colors py-1 px-1.5 xl:px-2 rounded-xs hover:bg-white/[0.03]"
          >
            Philosophy
          </a>
          <span className="text-white/15">&bull;</span>
          <a
            href="#rings"
            onClick={handleSectionClick('rings')}
            className="hover:text-[#ECE5DA] transition-colors py-1 px-1.5 xl:px-2 rounded-xs hover:bg-white/[0.03]"
          >
            Fine Jewellery
          </a>
          <span className="text-white/15">&bull;</span>
          <a
            href="#certs"
            onClick={handleSectionClick('certs')}
            className="hover:text-[#ECE5DA] transition-colors py-1 px-1.5 xl:px-2 rounded-xs hover:bg-white/[0.03]"
          >
            IGI Certified
          </a>
          <span className="text-white/15">&bull;</span>
          <a
            href="#gazette"
            onClick={handleGazetteClick}
            className="hover:text-[#ECE5DA] transition-colors text-[#ECE5DA] flex items-center gap-1 py-1 px-1.5 xl:px-2 rounded-xs hover:bg-white/[0.03]"
          >
            <span>The Gazette</span>
            <span className="hidden xl:inline-block text-[8px] px-1 py-0.2 rounded-xs bg-[#ECE5DA]/15 text-[#ECE5DA] border border-[#ECE5DA]/30">
              Journal
            </span>
          </a>
          <span className="text-white/15">&bull;</span>
          <a
            href="#sizing"
            onClick={handleSectionClick('sizing')}
            className="hover:text-[#ECE5DA] transition-colors py-1 px-1.5 xl:px-2 rounded-xs hover:bg-white/[0.03] flex items-center gap-1"
          >
            <Ruler className="w-2.5 h-2.5 xl:w-3 xl:h-3 text-[#ECE5DA]/70" />
            <span>Sizing</span>
          </a>
          <span className="text-white/15">&bull;</span>
          <a
            href="#hub"
            onClick={handleSectionClick('hub')}
            className="hover:text-[#ECE5DA] transition-colors py-1 px-1.5 xl:px-2 rounded-xs hover:bg-white/[0.03]"
          >
            Consultation
          </a>
        </nav>

        {/* Right Quick Actions */}
        <div className="hidden lg:flex items-center shrink-0">
          <button
            onClick={onOpenConsultation}
            className="btn-solid btn-glow py-1.5 px-2.5 xl:py-2 xl:px-3.5 text-[8px] xl:text-[9px] font-mono tracking-[0.12em] xl:tracking-[0.16em] uppercase rounded-xs cursor-pointer flex items-center gap-1 xl:gap-1.5 whitespace-nowrap shadow-md shrink-0"
            title="Book a bespoke diamond consultation"
          >
            <Sparkles className="w-2.5 h-2.5 xl:w-3 xl:h-3 shrink-0" />
            <span className="hidden xl:inline">Book Consultation</span>
            <span className="inline xl:hidden">Book Consult</span>
          </button>
        </div>

        {/* Mobile / Tablet Menu Button */}
        <div className="flex lg:hidden items-center gap-2">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-[#E2E8F0] hover:text-[#ECE5DA] focus:outline-hidden cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="lg:hidden bg-[#10191D]/95 backdrop-blur-xl border-b border-white/10 px-6 py-6 space-y-4 font-mono text-xs uppercase tracking-widest overflow-hidden"
          >
            <a
              href="#about"
              onClick={handleMobileSectionClick('about')}
              className="block py-2 text-[#E2E8F0] hover:text-[#ECE5DA] border-b border-white/10"
            >
              Philosophy
            </a>
            <a
              href="#rings"
              onClick={handleMobileSectionClick('rings')}
              className="block py-2 text-[#E2E8F0] hover:text-[#ECE5DA] border-b border-white/10"
            >
              Diamond Cuts &amp; Rings
            </a>
            <a
              href="#certs"
              onClick={handleMobileSectionClick('certs')}
              className="block py-2 text-[#E2E8F0] hover:text-[#ECE5DA] border-b border-white/10"
            >
              IGI Certified
            </a>
            <a
              href="#gazette"
              onClick={() => {
                setMobileMenuOpen(false);
                if (onNavigateToGazette) onNavigateToGazette();
              }}
              className="block py-2 text-[#ECE5DA] hover:text-white border-b border-white/10 flex items-center justify-between"
            >
              <span>The Vault Gazette</span>
              <span className="text-[9px] px-1.5 py-0.5 rounded-xs bg-[#ECE5DA]/20 text-[#ECE5DA]">
                Editorial
              </span>
            </a>
            <a
              href="#sizing"
              onClick={handleMobileSectionClick('sizing')}
              className="block py-2 text-[#E2E8F0] hover:text-[#ECE5DA] border-b border-white/10 flex items-center gap-2"
            >
              <Ruler className="w-3.5 h-3.5 text-[#ECE5DA]" />
              <span>Ring Sizing Guide</span>
            </a>
            <a
              href="#hub"
              onClick={handleMobileSectionClick('hub')}
              className="block py-2 text-[#E2E8F0] hover:text-[#ECE5DA] border-b border-white/10"
            >
              Consultation Hub
            </a>

            <div className="pt-3 flex flex-col gap-2.5">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenConsultation();
                }}
                className="w-full btn-solid btn-glow py-3 text-xs tracking-widest uppercase flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                Book Consultation
              </button>
              <a
                href="https://wa.me/447721391972"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full btn-ghost py-2.5 text-xs tracking-widest uppercase flex items-center justify-center gap-2 text-center"
              >
                <MessageCircle className="w-3.5 h-3.5 text-[#25D366]" />
                WhatsApp Direct
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};
