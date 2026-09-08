import React from 'react';
import { Logo } from './Logo';
import { BookOpen, Lock } from 'lucide-react';

interface FooterProps {
  onNavigateToGazette?: () => void;
  onOpenAdmin?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigateToGazette, onOpenAdmin }) => {
  return (
    <footer className="py-12 bg-[#080C0E]/90 backdrop-blur-md border-t border-white/10 text-[#E2E8F0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
        <div>
          <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
            <Logo size="sm" showText={true} variant="gold" />
          </div>
          <p className="text-[11px] font-mono uppercase tracking-[0.18em] text-[#E2E8F0]/60 mt-2">
            Birmingham Jewellery Quarter, United Kingdom • Sourced Directly • Bespoke Fine Jewellery
          </p>
        </div>

        <div className="flex flex-col items-center md:items-end text-[10px] font-mono text-[#E2E8F0]/50 uppercase tracking-widest space-y-2">
          <div className="flex items-center gap-4 text-[#ECE5DA]/80">
            <a
              href="#gazette"
              onClick={(e) => {
                if (onNavigateToGazette) {
                  e.preventDefault();
                  onNavigateToGazette();
                }
              }}
              className="hover:text-white transition-colors flex items-center gap-1"
            >
              <BookOpen className="w-3 h-3 text-[#ECE5DA]" />
              <span>The Vault Gazette</span>
            </a>
            <span>•</span>
            <button
              onClick={onOpenAdmin}
              className="hover:text-white transition-colors flex items-center gap-1 cursor-pointer"
            >
              <Lock className="w-2.5 h-2.5 text-[#ECE5DA]" />
              <span>Publisher CMS</span>
            </button>
          </div>
          <p>&copy; {new Date().getFullYear()} BRINDLEY DIAMONDS LTD. ALL RIGHTS RESERVED.</p>
          <p className="text-[#ECE5DA]/70">DESIGNED &amp; CRAFTED EXCLUSIVELY IN BIRMINGHAM ATELIER.</p>
        </div>
      </div>
    </footer>
  );
};


