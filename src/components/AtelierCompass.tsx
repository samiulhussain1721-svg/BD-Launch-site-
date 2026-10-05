import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useSpring, useReducedMotion, AnimatePresence } from 'motion/react';
import { Compass, Sparkles, Check, ChevronRight, X, ArrowUpRight } from 'lucide-react';

export interface JourneyStage {
  id: string;
  phase: string;
  name: string;
  sectionId: string;
  bearing: number; // in degrees (0 - 360)
  scrollRange: [number, number]; // approximate scroll progress [start, end]
  description: string;
  detail: string;
}

export const JOURNEY_STAGES: JourneyStage[] = [
  {
    id: 'origin',
    phase: 'Phase I',
    name: 'Philosophy & Provenance',
    sectionId: 'about',
    bearing: 30,
    scrollRange: [0, 0.18],
    description: 'Bespoke design philosophy, ethics, and assay hallmarking.',
    detail: 'Zero high-street retail markup, 100% direct atelier provenance in Birmingham Jewellery Quarter.',
  },
  {
    id: 'casting',
    phase: 'Phase II',
    name: 'Mounts & Goldsmithing',
    sectionId: 'rings',
    bearing: 100,
    scrollRange: [0.18, 0.38],
    description: 'Hand-assembled platinum and 18ct gold ring mounts.',
    detail: 'Precision talon prongs, secure collets, and micro-pavé set under 40x microscope inspection.',
  },
  {
    id: 'gemmology',
    phase: 'Phase III',
    name: 'Dual IGI & GIA Grading',
    sectionId: 'certs',
    bearing: 165,
    scrollRange: [0.38, 0.54],
    description: 'Strict colour curation and laboratory verification.',
    detail: 'Exclusively E colour or higher, eye-clean clarity, with unique microscopic laser inscriptions.',
  },
  {
    id: 'ergonomics',
    phase: 'Phase IV',
    name: 'Ring Sizing & Comfort Fit',
    sectionId: 'sizing',
    bearing: 235,
    scrollRange: [0.54, 0.68],
    description: 'Anatomical inner-court calibration and knuckle profile.',
    detail: 'Precision British standard sizing ensuring all-day wearing comfort and balance.',
  },
  {
    id: 'archive',
    phase: 'Phase V',
    name: 'The Vault Gazette Archive',
    sectionId: 'gazette',
    bearing: 300,
    scrollRange: [0.68, 0.85],
    description: 'Technical diamond education and transparency journals.',
    detail: 'Unfiltered gemstone guides dissecting pavilion angles, light leakages, and market insights.',
  },
  {
    id: 'commission',
    phase: 'Phase VI',
    name: 'Private Consultation Suite',
    sectionId: 'hub',
    bearing: 360,
    scrollRange: [0.85, 1.0],
    description: 'Direct consultation with master bench goldsmiths.',
    detail: 'Final ring inspection, hallmarking certificates, and complimentary insured worldwide delivery.',
  },
];

interface AtelierCompassProps {
  onNavigateSection?: (sectionId: string) => void;
  className?: string;
  variant?: 'compact' | 'full';
}

export const AtelierCompass: React.FC<AtelierCompassProps> = ({
  onNavigateSection,
  className = '',
  variant = 'full',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentProgress, setCurrentProgress] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  // Scroll Progress binding
  const { scrollYProgress } = useScroll();

  // Map 0 -> 1 progress to a full 360-degree rotation
  const rawRotation = useTransform(scrollYProgress, [0, 1], [0, 360]);

  // Spring animation for smooth magnetic needle inertia
  const springRotation = useSpring(rawRotation, {
    stiffness: 75,
    damping: 18,
    mass: 0.65,
    restDelta: 0.001,
  });

  // Track scroll progress to highlight current active stage
  useEffect(() => {
    const unsubscribe = scrollYProgress.on('change', (latest) => {
      setCurrentProgress(latest);
    });
    return () => unsubscribe();
  }, [scrollYProgress]);

  // Find active journey stage
  const currentStageIndex = Math.min(
    JOURNEY_STAGES.length - 1,
    Math.max(
      0,
      JOURNEY_STAGES.findIndex(
        (stage) => currentProgress >= stage.scrollRange[0] && currentProgress <= stage.scrollRange[1]
      ) === -1
        ? currentProgress > 0.85
          ? JOURNEY_STAGES.length - 1
          : 0
        : JOURNEY_STAGES.findIndex(
            (stage) => currentProgress >= stage.scrollRange[0] && currentProgress <= stage.scrollRange[1]
          )
    )
  );

  const activeStage = JOURNEY_STAGES[currentStageIndex];
  const currentBearing = Math.round(currentProgress * 360) % 360;

  // Close dropdown on outside click or escape key
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside, { passive: true });
      document.addEventListener('keydown', handleKeyDown);
      if (typeof window !== 'undefined' && window.innerWidth < 640) {
        document.body.style.overflow = 'hidden';
      }
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
      if (typeof window !== 'undefined') {
        document.body.style.overflow = '';
      }
    };
  }, [isOpen]);

  const handleStageClick = (stage: JourneyStage) => {
    setIsOpen(false);
    if (typeof window !== 'undefined') {
      document.body.style.overflow = '';
    }
    if (onNavigateSection) {
      onNavigateSection(stage.sectionId);
    } else {
      const el = document.getElementById(stage.sectionId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <div ref={dropdownRef} className={`relative inline-flex items-center ${className}`}>
      {/* Compass Interactive Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="group relative flex items-center justify-center gap-1.5 sm:gap-2 py-1.5 px-2 sm:py-1 sm:px-2 rounded-xs bg-[#10191D]/80 hover:bg-[#10191D] border border-white/10 hover:border-[#ECE5DA]/40 transition-all duration-300 cursor-pointer shadow-xs focus:outline-hidden min-h-[36px] sm:min-h-0"
        aria-label="Atelier production journey compass"
        aria-expanded={isOpen}
      >
        {/* Needle Dial Container */}
        <div className="relative w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-gradient-to-b from-[#1C282E] to-[#0D1518] p-0.5 border border-[#ECE5DA]/30 shadow-inner flex items-center justify-center shrink-0">
          
          {/* Dial Background Graduations / Tick Marks */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none text-[#ECE5DA]/25"
            viewBox="0 0 40 40"
          >
            {/* 12 Outer graduation ticks */}
            {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
              <line
                key={deg}
                x1="20"
                y1="3"
                x2="20"
                y2={deg % 90 === 0 ? "7" : "5"}
                stroke="currentColor"
                strokeWidth={deg % 90 === 0 ? "1.5" : "0.75"}
                transform={`rotate(${deg} 20 20)`}
                className={deg % 90 === 0 ? 'text-[#ECE5DA]/70' : 'text-[#ECE5DA]/25'}
              />
            ))}
            {/* Cardinal Dots */}
            <circle cx="20" cy="5" r="0.75" fill="#ECE5DA" />
            <circle cx="35" cy="20" r="0.5" fill="#ECE5DA" opacity="0.6" />
            <circle cx="20" cy="35" r="0.5" fill="#ECE5DA" opacity="0.6" />
            <circle cx="5" cy="20" r="0.5" fill="#ECE5DA" opacity="0.6" />
          </svg>

          {/* Rotating Spring Compass Needle */}
          <motion.div
            style={{
              rotate: shouldReduceMotion ? `${currentBearing}deg` : springRotation,
            }}
            className="relative w-full h-full flex items-center justify-center pointer-events-none"
          >
            {/* Faceted North Needle (Gold Champagne) */}
            <div className="absolute top-[3px] w-0 h-0 border-l-[2px] border-l-transparent border-r-[2px] border-r-transparent border-b-[9px] border-b-[#ECE5DA] drop-shadow-[0_0_2px_rgba(236,229,218,0.6)]" />

            {/* Faceted South Needle (Muted Slate Titanium) */}
            <div className="absolute bottom-[3px] w-0 h-0 border-l-[2px] border-l-transparent border-r-[2px] border-r-transparent border-t-[9px] border-t-[#64748B] opacity-70" />

            {/* Central Jewel Pivot */}
            <div className="relative z-10 w-2 h-2 rounded-full bg-[#10191D] border border-[#ECE5DA] flex items-center justify-center shadow-xs">
              <div className="w-0.5 h-0.5 rounded-full bg-[#ECE5DA] animate-pulse" />
            </div>
          </motion.div>

          {/* Ambient Glow on Hover */}
          <div className="absolute inset-0 rounded-full bg-[#ECE5DA]/10 opacity-0 group-hover:opacity-100 transition-opacity blur-xs pointer-events-none" />
        </div>

        {/* Dynamic Journey Phase Chip & Degree Bearing */}
        {variant === 'full' && (
          <div className="hidden xl:flex flex-col text-left leading-none tracking-normal">
            <div className="flex items-center gap-1.5">
              <span className="font-mono text-[8px] font-medium tracking-[0.16em] uppercase text-[#ECE5DA]">
                {activeStage.phase}
              </span>
              <span className="text-[7.5px] font-mono text-[#E2E8F0]/40">
                {currentBearing}&deg;
              </span>
            </div>
            <span className="text-[8.5px] font-serif-luxury italic text-[#E2E8F0]/80 tracking-wide truncate max-w-[105px]">
              {activeStage.name}
            </span>
          </div>
        )}

        {/* Small chevron hint for interactivity */}
        <ChevronRight
          className={`w-3 h-3 text-[#ECE5DA]/50 transition-transform duration-200 hidden sm:block ${
            isOpen ? 'rotate-90 text-[#ECE5DA]' : 'group-hover:translate-x-0.5'
          }`}
        />
      </button>

      {/* Spring Animated Journey Menu Popover */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Mobile Full-Screen Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-[#080C0E]/80 backdrop-blur-xs z-40 sm:hidden"
            />

            <motion.div
              initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 12, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 8, scale: 0.97 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="fixed inset-x-3 top-16 max-h-[82vh] sm:max-h-none sm:top-full sm:left-auto sm:right-0 sm:absolute sm:inset-x-auto mt-2 sm:mt-2.5 w-auto sm:w-[360px] bg-[#10191D]/98 backdrop-blur-2xl border border-[#ECE5DA]/30 rounded-xs shadow-2xl p-4 sm:p-4.5 z-50 overflow-hidden font-sans text-left flex flex-col"
            >
              {/* Popover Header */}
              <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-3 shrink-0">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-xs bg-[#ECE5DA]/10 border border-[#ECE5DA]/20">
                    <Compass className="w-3.5 h-3.5 text-[#ECE5DA]" />
                  </div>
                  <div>
                    <h4 className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-[#ECE5DA] font-semibold">
                      The Atelier Journey
                    </h4>
                    <p className="text-[9px] text-[#E2E8F0]/60 font-mono tracking-wider">
                      Bearing: {currentBearing}&deg; • {Math.round(currentProgress * 100)}% Complete
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-[#E2E8F0]/50 hover:text-white p-1.5 rounded-xs hover:bg-white/5 transition-colors cursor-pointer"
                  aria-label="Close journey guide"
                >
                  <X className="w-4 h-4 sm:w-3.5 sm:h-3.5" />
                </button>
              </div>

              {/* Journey Stages List */}
              <div className="space-y-1.5 flex-1 min-h-0 max-h-[min(380px,58vh)] sm:max-h-[340px] overflow-y-auto pr-1 custom-scrollbar">
                {JOURNEY_STAGES.map((stage, idx) => {
                  const isCurrent = idx === currentStageIndex;
                  const isPast = currentProgress > stage.scrollRange[1];

                  return (
                    <button
                      key={stage.id}
                      onClick={() => handleStageClick(stage)}
                      className={`w-full group text-left p-2.5 rounded-xs transition-all duration-200 border cursor-pointer flex items-start gap-2.5 ${
                        isCurrent
                          ? 'bg-[#1C282E] border-[#ECE5DA]/50 shadow-sm'
                          : 'bg-white/[0.02] hover:bg-white/[0.05] border-transparent hover:border-white/10'
                      }`}
                    >
                      {/* Bearing Dial Badge */}
                      <div className="flex flex-col items-center shrink-0 mt-0.5">
                        <div
                          className={`w-5 h-5 rounded-full flex items-center justify-center text-[8px] font-mono border ${
                            isCurrent
                              ? 'bg-[#ECE5DA] text-[#10191D] border-[#ECE5DA] font-bold shadow-[0_0_8px_rgba(236,229,218,0.4)]'
                              : isPast
                              ? 'bg-white/10 text-[#ECE5DA] border-[#ECE5DA]/40'
                              : 'bg-white/5 text-[#E2E8F0]/40 border-white/10'
                          }`}
                        >
                          {isPast ? <Check className="w-2.5 h-2.5" /> : idx + 1}
                        </div>
                        <span className="text-[7.5px] font-mono text-[#E2E8F0]/40 mt-1">
                          {stage.bearing}&deg;
                        </span>
                      </div>

                      {/* Stage Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1 mb-0.5">
                          <span
                            className={`font-mono text-[9px] uppercase tracking-wider ${
                              isCurrent
                                ? 'text-[#ECE5DA] font-semibold'
                                : 'text-[#E2E8F0]/80 group-hover:text-white'
                            }`}
                          >
                            {stage.name}
                          </span>
                          <ArrowUpRight
                            className={`w-3 h-3 transition-transform ${
                              isCurrent
                                ? 'text-[#ECE5DA] translate-x-0.5 -translate-y-0.5'
                                : 'text-white/20 group-hover:text-white/70 group-hover:translate-x-0.5 group-hover:-translate-y-0.5'
                            }`}
                          />
                        </div>
                        <p className="text-[10px] text-[#E2E8F0]/70 line-clamp-1 leading-snug">
                          {stage.description}
                        </p>
                        {isCurrent && (
                          <p className="text-[9px] text-[#ECE5DA]/80 font-serif-luxury italic mt-1 border-t border-white/5 pt-1">
                            Current benchmark: {stage.detail}
                          </p>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Footer Summary */}
              <div className="mt-3 pt-2.5 border-t border-white/10 flex items-center justify-between text-[8.5px] font-mono text-[#E2E8F0]/50 shrink-0">
                <span className="flex items-center gap-1">
                  <Sparkles className="w-2.5 h-2.5 text-[#ECE5DA]" />
                  Rotates with atelier scroll
                </span>
                <span className="text-[#ECE5DA]/80">
                  Quarter Hallmarked
                </span>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
