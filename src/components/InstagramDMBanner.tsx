import React from 'react';
import { Instagram, Send, Sparkles } from 'lucide-react';
import { openInstagramDM, ATELIER_INSTAGRAM_DM_WEB } from '../config/atelier';

export const InstagramDMBanner: React.FC = () => {
  return (
    <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 my-12">
      <div className="card-glass border border-white/10 rounded-xs p-6 sm:p-8 bg-gradient-to-r from-[#10191D] via-[#152026] to-[#10191D] flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl relative overflow-hidden">
        {/* Subtle glow */}
        <div className="absolute top-0 right-1/4 w-72 h-32 bg-radial from-[#ECE5DA]/10 to-transparent pointer-events-none" />

        <div className="flex items-center gap-4 text-center md:text-left">
          <div className="w-12 h-12 rounded-full bg-[#10191D] border border-white/15 text-[#ECE5DA] flex items-center justify-center shrink-0 shadow-lg mx-auto md:mx-0">
            <Instagram className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center justify-center md:justify-start gap-1.5 text-[10px] font-mono text-[#ECE5DA] uppercase tracking-[0.2em] mb-1">
              <Sparkles className="w-3 h-3 text-[#ECE5DA]" />
              <span>Automated Direct Concierge</span>
            </div>
            <p className="text-xs sm:text-sm text-[#E2E8F0] font-light leading-relaxed max-w-2xl">
              Prefer Instagram? DM keyword <strong className="text-[#ECE5DA] font-mono font-semibold tracking-wider">ATELIER</strong> to <span className="text-white font-medium">@Brindleydiamonds</span> for immediate stone macro videos, setting catalogues, and private consultation.
            </p>
          </div>
        </div>

        <div className="shrink-0 w-full md:w-auto">
          <a
            href={ATELIER_INSTAGRAM_DM_WEB}
            onClick={openInstagramDM}
            className="btn-ghost btn-glow w-full md:w-auto min-h-[48px] py-3 px-6 text-[10.5px] font-mono font-semibold uppercase tracking-[0.18em] flex items-center justify-center gap-2.5 border-[#ECE5DA]/40 hover:border-[#ECE5DA] text-[#ECE5DA] hover:text-white transition-all cursor-pointer text-center"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Message @Brindleydiamonds</span>
          </a>
        </div>
      </div>
    </div>
  );
};
