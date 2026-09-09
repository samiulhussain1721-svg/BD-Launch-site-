import React from 'react';
import { MessageCircle, Send } from 'lucide-react';
import { getHeroWhatsAppUrl, openInstagramDM, ATELIER_INSTAGRAM_DM_WEB } from '../config/atelier';

export const MobileStickyActionDock: React.FC = () => {
  const whatsappUrl = getHeroWhatsAppUrl();

  return (
    <aside
      aria-label="Mobile Concierge Actions"
      className="flex md:hidden fixed bottom-0 left-0 right-0 z-[999] px-3 pt-2.5 pb-[max(12px,env(safe-area-inset-bottom))] items-center justify-between gap-2.5 border-t border-white/[0.12] bg-[#0F0F0F]/75 backdrop-blur-[12px] shadow-[0_-8px_32px_rgba(0,0,0,0.6)]"
      style={{
        WebkitBackdropFilter: 'blur(12px)',
      }}
    >
      {/* Primary: Direct Atelier Line (WhatsApp) */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex-1 min-h-[48px] px-3 py-2 rounded-xs bg-[#ECE5DA] text-[#10191D] hover:bg-white font-mono text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.16em] flex items-center justify-center gap-2 transition-transform active:scale-[0.98] shadow-md touch-manipulation cursor-pointer"
        aria-label="Direct Atelier Line via WhatsApp"
      >
        <MessageCircle className="w-4 h-4 text-[#10191D] shrink-0" />
        <span className="truncate">Direct Atelier Line</span>
      </a>

      {/* Secondary: Private DM (Instagram Deep Link) */}
      <a
        href={ATELIER_INSTAGRAM_DM_WEB}
        onClick={openInstagramDM}
        className="flex-1 min-h-[48px] px-3 py-2 rounded-xs bg-white/[0.06] hover:bg-white/[0.12] border border-white/15 text-[#E2E8F0] font-mono text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.16em] flex items-center justify-center gap-2 transition-colors active:scale-[0.98] touch-manipulation cursor-pointer"
        aria-label="Private DM via Instagram"
      >
        <Send className="w-3.5 h-3.5 text-[#ECE5DA] shrink-0" />
        <span className="truncate">Private DM</span>
      </a>
    </aside>
  );
};
