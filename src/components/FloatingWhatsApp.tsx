import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { MessageCircle, Sparkles } from 'lucide-react';

interface FloatingWhatsAppProps {
  phoneNumber?: string;
  defaultMessage?: string;
}

export const FloatingWhatsApp: React.FC<FloatingWhatsAppProps> = ({
  phoneNumber = '447721391972',
  defaultMessage = 'Hello Brindley Diamonds, I would like to enquire about a bespoke piece.',
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    const handleScroll = () => {
      // Reveal once scrolled past hero (approx 350px)
      if (window.scrollY > 350) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(defaultMessage)}`;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 20, scale: 0.9 }}
          animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
          exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 15, scale: 0.9 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="fixed bottom-6 right-6 z-40 flex items-center"
        >
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-3 px-4 py-3 bg-[#10191D]/95 hover:bg-[#172227] text-[#E2E8F0] border border-[#ECE5DA]/40 hover:border-[#ECE5DA] rounded-full shadow-2xl backdrop-blur-md transition-all duration-300 animate-whatsapp-glow cursor-pointer"
            aria-label="Direct WhatsApp Consultation with Brindley Diamonds"
          >
            {/* Live pulsing indicator on icon */}
            <div className="relative flex items-center justify-center">
              <div className="w-9 h-9 rounded-full bg-[#25D366]/15 border border-[#25D366]/40 flex items-center justify-center text-[#25D366] group-hover:scale-110 transition-transform duration-300">
                <MessageCircle className="w-5 h-5 fill-[#25D366]/20 text-[#25D366]" />
              </div>
              <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-[#25D366] rounded-full border-2 border-[#10191D] animate-pulse-dot" />
            </div>

            {/* Scannable label on desktop & compact on mobile */}
            <div className="hidden sm:flex flex-col text-left pr-1">
              <span className="text-[10px] font-mono tracking-[0.2em] text-[#ECE5DA] uppercase font-semibold flex items-center gap-1">
                <span>Atelier Concierge</span>
                <Sparkles className="w-2.5 h-2.5 text-[#ECE5DA]" />
              </span>
              <span className="text-[9px] font-mono tracking-wider text-[#E2E8F0]/60 uppercase">
                Chat on WhatsApp
              </span>
            </div>
          </a>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
