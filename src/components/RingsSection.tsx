import React, { useState } from 'react';
import { Ring, JewelleryCategory } from '../types';
import { Sparkles, ArrowRight, MessageCircle, Play } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import { Logo } from './Logo';
import { getProductWhatsAppUrl, INSERT_PHONE } from '../config/atelier';

interface RingsSectionProps {
  rings: Ring[];
  onOpenConsultation: () => void;
  onSelectRing?: (ring: Ring) => void;
}

interface DiamondCutInfo {
  id: string;
  name: string;
  subtitle: string;
  ratio: string;
  fireRating: string;
  image: string;
  description: string;
  bestFor: string;
  recommendedCarats: string;
}

const CORE_DIAMOND_CUTS: DiamondCutInfo[] = [
  {
    id: 'oval',
    name: 'Oval Cut',
    subtitle: 'Elongated Brilliance',
    ratio: '1.35 – 1.45 Ratio',
    fireRating: 'Exceptional Scintillation',
    image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=85',
    description: 'An elegant cut offering a flattering, lengthening effect on the finger with surface spread that optimises carat presentation.',
    bestFor: 'Modern solitaires & pavé shoulders',
    recommendedCarats: '1.50ct – 3.00ct',
  },
  {
    id: 'cushion',
    name: 'Cushion Cut',
    subtitle: 'Pillow Contour',
    ratio: '1.00 – 1.15 Ratio',
    fireRating: 'Deep Antique Sparkle',
    image: 'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&w=800&q=85',
    description: 'Softened rounded corners reminiscent of vintage heirloom stones, combining rich historical charm with precision facet performance.',
    bestFor: 'Vintage halos, three-stone trilogies & platinum settings',
    recommendedCarats: '1.75ct – 3.50ct',
  },
  {
    id: 'round',
    name: 'Round Brilliant',
    subtitle: '57-Facet Optical Fire',
    ratio: '1.00 : 1.00 Symmetry',
    fireRating: 'Maximum Optical Dispersion',
    image: 'https://images.unsplash.com/photo-1543294001-f7cbfe92237e?auto=format&fit=crop&w=800&q=85',
    description: 'The mathematical peak of light refraction. Cut with exacting angles to return 100% of entering light back to the eye in vivid spectral flashes.',
    bestFor: 'Six-prong cathedral mounts & timeless minimalist bands',
    recommendedCarats: '1.00ct – 2.50ct',
  },
  {
    id: 'fancy-yellow',
    name: 'Fancy Yellow',
    subtitle: 'Canary Radiance',
    ratio: 'Radiant / Cushion Cut',
    fireRating: 'Intense Warm Fire',
    image: 'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?auto=format&fit=crop&w=800&q=85',
    description: 'Distinctive fancy coloured diamonds with natural golden sunshine warmth, paired masterfully with 18k yellow gold prongs.',
    bestFor: 'Bespoke two-tone yellow gold & platinum commissions',
    recommendedCarats: '2.00ct – 4.00ct',
  },
];

type CategoryFilter = 'All' | JewelleryCategory | 'Diamond Cuts';

const CATEGORY_TABS: { id: CategoryFilter; label: string }[] = [
  { id: 'All', label: 'All Pieces' },
  { id: 'Engagement Rings', label: 'Engagement Rings' },
  { id: 'Bracelets', label: 'Bracelets' },
  { id: 'Necklaces', label: 'Necklaces' },
  { id: 'Wedding Rings', label: 'Wedding Rings' },
  { id: 'Earrings', label: 'Earrings' },
  { id: 'Diamond Cuts', label: 'Diamond Cuts' },
];

export const RingsSection: React.FC<RingsSectionProps> = ({
  rings,
  onOpenConsultation,
  onSelectRing,
}) => {
  const [selectedFilter, setSelectedFilter] = useState<CategoryFilter>('All');
  const shouldReduceMotion = useReducedMotion();

  const handleCardClick = (ring: Ring) => {
    if (onSelectRing) {
      onSelectRing(ring);
    } else {
      onOpenConsultation();
    }
  };

  const headerVariants = {
    hidden: shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
    },
  };

  // Filter rings based on selection
  const filteredRings = selectedFilter === 'All'
    ? rings
    : rings.filter((r) => r.category === selectedFilter);

  return (
    <section id="rings" className="py-20 md:py-32 text-[#E2E8F0] relative overflow-hidden">
      {/* Ambient background glow accent */}
      <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] bg-gradient-to-br from-[#ECE5DA]/5 via-[#172227]/0 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          variants={headerVariants}
          className="text-center max-w-3xl mx-auto mb-10"
        >
          <div className="flex justify-center mb-3">
            <Logo size="md" />
          </div>
          <div className="inline-flex items-center gap-2 mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-[#ECE5DA]" />
            <span className="text-xs font-mono tracking-[0.25em] text-[#ECE5DA] uppercase">
              Birmingham Jewellery Quarter Atelier
            </span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-display text-[#FFFFFF] font-light uppercase tracking-[0.14em] mb-4">
            Atelier Fine Jewellery
          </h2>

          <div className="w-16 h-0.5 bg-[#ECE5DA]/40 mx-auto mb-6" />

          <p className="text-xs sm:text-sm text-[#E2E8F0]/70 leading-relaxed font-light">
            We craft bespoke engagement rings, bracelets, necklaces, wedding rings, and earrings. Every diamond is accompanied by an official IGI certification dossier and tailored to your design brief.
          </p>

          {/* Category Navigation Pills */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-1.5 p-1 rounded-xs bg-[#10191D]/90 backdrop-blur-md border border-white/10 max-w-4xl mx-auto">
            {CATEGORY_TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedFilter(tab.id)}
                className={`px-3.5 sm:px-4 py-2 text-[10px] sm:text-[11px] font-mono tracking-widest uppercase transition-all duration-300 rounded-xs cursor-pointer whitespace-nowrap ${
                  selectedFilter === tab.id
                    ? 'bg-[#ECE5DA] text-[#10191D] font-semibold shadow-md'
                    : 'text-[#E2E8F0]/65 hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* VIEW 1: JEWELLERY PIECES GRID (When NOT in Diamond Cuts mode) */}
        {selectedFilter !== 'Diamond Cuts' && (
          <motion.div
            key={selectedFilter}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {filteredRings.map((piece, idx) => (
              <motion.div
                key={piece.id}
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
                      delay: (idx % 4) * 0.1,
                      ease: [0.16, 1, 0.3, 1],
                    },
                  },
                }}
                className="card-glass group relative overflow-hidden flex flex-col justify-between cursor-pointer border-white/10 hover:border-[#ECE5DA]/50 bg-white/[0.02]"
                onClick={() => handleCardClick(piece)}
              >
                <div>
                  <div className="relative h-64 overflow-hidden bg-[#10191D]">
                    <img
                      src={piece.img}
                      alt={piece.title}
                      className="w-full h-full object-cover img-luxury-zoom filter contrast-105 group-hover:scale-108 transition-transform duration-700 ease-out"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#10191D] via-transparent to-transparent pointer-events-none" />

                    <div className="absolute top-3 left-3 flex items-center gap-1.5 pointer-events-none">
                      <span className="px-2.5 py-1 bg-[#10191D]/85 backdrop-blur-xs border border-white/10 text-[9px] font-mono tracking-widest uppercase text-[#ECE5DA] rounded-xs shadow-md">
                        {piece.tag}
                      </span>
                      {piece.category && (
                        <span className="px-2 py-0.5 bg-black/60 backdrop-blur-xs border border-white/10 text-[8px] font-mono uppercase tracking-wider text-white/60 rounded-xs">
                          {piece.category}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="text-xl font-display text-white font-light tracking-wide mb-2 group-hover:text-[#ECE5DA] transition-colors">
                      {piece.title}
                    </h3>
                    <p className="text-xs text-[#E2E8F0]/70 font-light leading-relaxed mb-4">
                      {piece.desc}
                    </p>
                  </div>
                </div>

                <div className="px-4 py-3 bg-[#10191D]/90 border-t border-white/10 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2">
                  <a
                    href={getProductWhatsAppUrl(piece.title)}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="flex-1 min-h-[48px] px-3 py-2 bg-white/[0.04] hover:bg-[#ECE5DA] hover:text-[#10191D] border border-white/10 hover:border-[#ECE5DA] text-[9.5px] font-mono font-semibold uppercase tracking-wider text-[#ECE5DA] rounded-xs flex items-center justify-center gap-1.5 transition-all shadow-sm"
                    title={`View 4K video and specs for ${piece.title}`}
                  >
                    <MessageCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>See 4K Video &amp; Specs</span>
                  </a>
                  <button
                    type="button"
                    onClick={() => handleCardClick(piece)}
                    className="min-h-[48px] px-3 py-2 border border-white/10 hover:border-[#ECE5DA]/50 text-[9.5px] font-mono uppercase tracking-wider text-white/80 hover:text-white rounded-xs flex items-center justify-center gap-1 transition-colors cursor-pointer"
                  >
                    <span>Reserve Allocation</span>
                    <ArrowRight className="w-3 h-3 text-[#ECE5DA] shrink-0" />
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* VIEW 2: DIAMOND CUTS GUIDE */}
        {selectedFilter === 'Diamond Cuts' && (
          <motion.div
            key="diamond-cuts-grid"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {CORE_DIAMOND_CUTS.map((cut, idx) => (
              <motion.div
                key={cut.id}
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
                      delay: idx * 0.1,
                      ease: [0.16, 1, 0.3, 1],
                    },
                  },
                }}
                className="card-glass group relative overflow-hidden flex flex-col justify-between cursor-pointer border-white/10 hover:border-[#ECE5DA]/50 bg-white/[0.02] backdrop-blur-md"
                onClick={onOpenConsultation}
              >
                <div>
                  <div className="relative h-64 overflow-hidden bg-[#10191D]">
                    <img
                      src={cut.image}
                      alt={cut.name}
                      className="w-full h-full object-cover img-luxury-zoom filter contrast-105 brightness-95 group-hover:scale-108 transition-transform duration-700 ease-out"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#10191D] via-transparent to-black/20 pointer-events-none" />

                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
                      <span className="px-2.5 py-1 bg-[#10191D]/85 backdrop-blur-xs border border-white/10 text-[9px] font-mono tracking-widest uppercase text-[#ECE5DA] rounded-xs shadow-md">
                        {cut.ratio}
                      </span>
                      <span className="px-2 py-0.5 bg-black/60 backdrop-blur-xs border border-[#ECE5DA]/30 text-[9px] font-mono text-[#ECE5DA] rounded-xs flex items-center gap-1">
                        <Sparkles className="w-2.5 h-2.5 text-[#ECE5DA]" />
                        <span>IGI</span>
                      </span>
                    </div>

                    <div className="absolute inset-0 bg-radial from-[#ECE5DA]/15 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                  </div>

                  <div className="p-6">
                    <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#ECE5DA] mb-1 font-medium">
                      {cut.subtitle}
                    </div>
                    <h3 className="text-xl font-display text-white font-light tracking-wide mb-3 group-hover:text-[#ECE5DA] transition-colors">
                      {cut.name}
                    </h3>
                    <p className="text-xs text-[#E2E8F0]/70 font-light leading-relaxed mb-4">
                      {cut.description}
                    </p>

                    <div className="pt-3 border-t border-white/10 space-y-2 text-[10px] font-mono text-[#E2E8F0]/60">
                      <div className="flex items-center justify-between">
                        <span className="text-[#ECE5DA]/80">Optics:</span>
                        <span className="text-white/80">{cut.fireRating}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-[#ECE5DA]/80">Carat Range:</span>
                        <span className="text-white/80">{cut.recommendedCarats}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="px-4 py-3 bg-[#10191D]/90 border-t border-white/10 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2">
                  <a
                    href={getProductWhatsAppUrl(`${cut.name} (${cut.recommendedCarats})`)}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="flex-1 min-h-[48px] px-3 py-2 bg-[#ECE5DA] text-[#10191D] hover:bg-white text-[9.5px] font-mono font-semibold uppercase tracking-wider rounded-xs flex items-center justify-center gap-1.5 transition-all shadow-sm"
                  >
                    <MessageCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>Enquire on Stone</span>
                  </a>
                  <button
                    type="button"
                    onClick={onOpenConsultation}
                    className="min-h-[48px] px-3 py-2 border border-white/10 hover:border-[#ECE5DA]/50 text-[9.5px] font-mono uppercase tracking-wider text-white/80 hover:text-white rounded-xs flex items-center justify-center gap-1 transition-colors cursor-pointer"
                  >
                    <span>Dossier</span>
                    <ArrowRight className="w-3 h-3 text-[#ECE5DA] shrink-0" />
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Dedicated WhatsApp / Sizing Assistance Banner */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          variants={headerVariants}
          className="mt-16 p-8 rounded-xs border border-white/10 bg-white/[0.02] backdrop-blur-md flex flex-col lg:flex-row items-center justify-between gap-6"
        >
          <div className="flex flex-col sm:flex-row items-center gap-4 text-center lg:text-left">
            <div className="shrink-0 p-2 rounded-full border border-[#ECE5DA]/20 bg-[#10191D]/80 shadow-[0_0_20px_rgba(236,229,218,0.08)]">
              <Logo size="md" />
            </div>
            <div>
              <span className="text-xs font-mono uppercase text-[#ECE5DA] tracking-widest block mb-1">
                Bespoke Jewellery Quarter Commissions
              </span>
              <p className="text-xs sm:text-sm text-[#E2E8F0]/75 font-light max-w-2xl">
                Looking for engagement rings, tennis bracelets, necklaces, wedding rings, or earrings? Send us reference photos, sketches, or ideas for a tailored CAD consultation.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
            <a
              href={`https://wa.me/${INSERT_PHONE}?text=Hi%20Brindley%20Diamonds%2C%20I%20would%20like%20to%20inquire%20about%20a%20private%20bespoke%20commission.`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-solid btn-glow min-h-[48px] py-3 px-6 text-[10px] tracking-widest uppercase flex items-center gap-2 cursor-pointer shadow-lg"
            >
              <MessageCircle className="w-3.5 h-3.5 text-[#10191D]" />
              <span>Direct Atelier Line</span>
            </a>
            <button
              onClick={onOpenConsultation}
              className="btn-ghost min-h-[48px] py-3 px-5 text-[10px] tracking-widest uppercase text-[#ECE5DA] hover:text-white cursor-pointer"
            >
              Reserve Allocation
            </button>
          </div>
        </motion.div>

      </div>
    </section>
  );
};
