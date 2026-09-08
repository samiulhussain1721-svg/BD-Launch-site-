import React, { useRef } from 'react';
import { Send, MessageCircle, Sparkles, ArrowDown, ShieldCheck, Ruler } from 'lucide-react';
import { Logo } from './Logo';
import { motion, useScroll, useTransform, useReducedMotion } from 'motion/react';

interface HeroProps {
  onOpenConsultation: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenConsultation }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  const backgroundGlowY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const monogramY = useTransform(scrollYProgress, [0, 1], ['0%', '18%']);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.85], [1, 0.15]);

  // Cinematic staggered reveal animation sequence (duration: 1.2s, ease: [0.16, 1, 0.3, 1])
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.18,
        delayChildren: 0.1,
      },
    },
  };

  const cinematicItemVariants = {
    hidden: shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 32 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 1.2,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  return (
    <section
      id="hero-section"
      ref={containerRef}
      className="relative pt-16 pb-24 md:pt-28 md:pb-36 overflow-hidden text-[#E2E8F0] min-h-[92vh] flex items-center justify-center bg-transparent"
    >
      {/* Ambient Parallax Radial Refraction Glow */}
      <motion.div
        style={{
          y: shouldReduceMotion ? 0 : backgroundGlowY,
        }}
        className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[620px] h-[620px] bg-gradient-to-tr from-[#ECE5DA]/10 via-[#2dd4bf]/5 to-transparent rounded-full blur-3xl pointer-events-none -z-10"
      />

      <motion.div
        style={{
          opacity: shouldReduceMotion ? 1 : contentOpacity,
        }}
        className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10"
      >
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center"
        >
          {/* Eyebrow Atelier Badge */}
          <motion.div
            variants={cinematicItemVariants}
            className="mb-8 inline-flex items-center gap-2 px-4 py-1.5 rounded-xs bg-white/[0.04] backdrop-blur-md border border-white/10 text-[10px] font-mono tracking-[0.25em] text-[#ECE5DA] uppercase shadow-md"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#ECE5DA] animate-pulse" />
            <span>Birmingham Jewellery Quarter • Bespoke Atelier</span>
          </motion.div>

          {/* Prominent Monogram Mark with subtle refraction halo */}
          <motion.div
            variants={cinematicItemVariants}
            style={{ y: shouldReduceMotion ? 0 : monogramY }}
            className="mb-8 flex justify-center"
          >
            <div className="relative group cursor-pointer">
              <Logo size="xl" variant="gold" showText={false} />
              <div className="absolute inset-0 rounded-full bg-[#ECE5DA]/15 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
            </div>
          </motion.div>

          {/* Primary Headline */}
          <motion.h1
            variants={cinematicItemVariants}
            className="text-3xl sm:text-5xl lg:text-6xl font-serif-luxury font-light text-[#FFFFFF] tracking-[0.06em] max-w-4xl mx-auto mb-6 leading-[1.18]"
          >
            Diamonds are formed under pressure.{' '}
            <span className="italic text-[#ECE5DA] font-normal block sm:inline">
              Buying them shouldn't be.
            </span>
          </motion.h1>

          {/* Subhead */}
          <motion.p
            variants={cinematicItemVariants}
            className="text-base sm:text-xl text-[#E2E8F0]/90 max-w-2xl mx-auto leading-relaxed mb-4 font-light font-display tracking-wide"
          >
            Your Dream Jewellery, Brought to Life Without Pressure.
          </motion.p>

          {/* Secondary atelier note */}
          <motion.p
            variants={cinematicItemVariants}
            className="text-[11px] sm:text-xs font-mono text-[#E2E8F0]/60 tracking-[0.12em] sm:tracking-[0.16em] uppercase mb-12 max-w-xl mx-auto leading-relaxed"
          >
            <span className="inline">Master-cut IGI Certified Diamonds</span>
            <span className="mx-2 text-white/30 hidden sm:inline">&bull;</span>
            <span className="block sm:inline my-1 sm:my-0">Birmingham Jewellery Quarter</span>
            <span className="mx-2 text-white/30 hidden sm:inline">&bull;</span>
            <span className="block sm:inline whitespace-nowrap text-[#ECE5DA]/80 sm:text-inherit">100% Bespoke Craftsmanship</span>
          </motion.p>

          {/* Micro-Glow Action Buttons */}
          <motion.div
            variants={cinematicItemVariants}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-2xl mx-auto mb-16 w-full sm:w-auto"
          >
            <a
              href="https://wa.me/447721391972"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-solid btn-glow w-full sm:w-auto min-w-[220px] justify-center shadow-xl group cursor-pointer"
            >
              <MessageCircle className="w-4 h-4 text-[#25D366] transition-transform group-hover:scale-110" />
              <span>Chat on WhatsApp</span>
            </a>

            <a
              href="https://instagram.com/brindleydiamonds"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-ghost btn-glow w-full sm:w-auto min-w-[220px] justify-center group cursor-pointer border-white/20 hover:border-[#ECE5DA]"
            >
              <Send className="w-3.5 h-3.5 text-[#ECE5DA] transition-transform group-hover:translate-x-0.5" />
              <span>DM on Instagram</span>
            </a>

            <button
              onClick={onOpenConsultation}
              className="btn-ghost btn-glow w-full sm:w-auto min-w-[220px] justify-center border-[#ECE5DA]/40 text-[#ECE5DA] hover:border-[#ECE5DA] hover:text-white cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#ECE5DA]" />
              <span>Book Consultation</span>
            </button>
          </motion.div>

          {/* Workshop Metrics & Sizing Quick Link */}
          <motion.div
            variants={cinematicItemVariants}
            className="w-full grid grid-cols-1 sm:grid-cols-4 gap-3 sm:gap-4 max-w-3xl mx-auto text-center font-mono text-[9px] sm:text-[10px] uppercase tracking-[0.18em] text-[#E2E8F0]/50 border-t border-b border-white/10 py-6 backdrop-blur-xs bg-white/[0.01] rounded-xs"
          >
            <div className="px-2 py-1">
              <span className="block text-[#ECE5DA] text-xs sm:text-sm font-semibold mb-0.5">
                IGI Certified
              </span>
              <span>100% Authenticated</span>
            </div>
            <div className="px-2 py-1 border-t sm:border-t-0 sm:border-l border-white/10">
              <span className="block text-white text-xs sm:text-sm font-semibold mb-0.5">
                Birmingham
              </span>
              <span>Jewellery Quarter</span>
            </div>
            <div className="px-2 py-1 border-t sm:border-t-0 sm:border-l border-white/10">
              <span className="block text-[#ECE5DA] text-xs sm:text-sm font-semibold mb-0.5">
                Direct Atelier
              </span>
              <span>Bespoke Commission</span>
            </div>
            <div className="px-2 py-1 border-t sm:border-t-0 sm:border-l border-white/10 flex flex-col justify-center items-center">
              <a
                href="#sizing"
                className="text-[#ECE5DA] hover:underline flex items-center gap-1 text-[10px] font-medium"
              >
                <Ruler className="w-3 h-3 text-[#ECE5DA]" />
                <span>Ring Size Guide</span>
              </a>
              <span className="text-[9px] text-[#E2E8F0]/40">UK &amp; US Standards</span>
            </div>
          </motion.div>

          {/* Scroll Down Prompt */}
          <motion.div
            variants={cinematicItemVariants}
            className="mt-12 text-[#E2E8F0]/40 hover:text-[#ECE5DA] transition-colors flex flex-col items-center gap-2 cursor-pointer"
            onClick={() => {
              const el = document.getElementById('about');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            <span className="text-[9px] font-mono uppercase tracking-[0.24em]">
              Explore Atelier
            </span>
            <ArrowDown className="w-3.5 h-3.5 animate-bounce text-[#ECE5DA]/60" />
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
};
