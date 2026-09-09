import React, { useState } from 'react';
import { Ruler, Sparkles, MessageCircle, HelpCircle, Check, Info, ShieldCheck } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';

interface SizeData {
  uk: string;
  us: string;
  eu: string;
  diameter: string;
  circumference: string;
}

const SIZE_CHART: SizeData[] = [
  { uk: 'H', us: '4.0', eu: '47', diameter: '14.9 mm', circumference: '46.8 mm' },
  { uk: 'I', us: '4.5', eu: '48', diameter: '15.3 mm', circumference: '48.0 mm' },
  { uk: 'J', us: '4.75', eu: '49', diameter: '15.5 mm', circumference: '48.7 mm' },
  { uk: 'K', us: '5.25', eu: '50', diameter: '15.9 mm', circumference: '50.0 mm' },
  { uk: 'L', us: '5.75', eu: '51', diameter: '16.3 mm', circumference: '51.2 mm' },
  { uk: 'M', us: '6.25', eu: '52', diameter: '16.7 mm', circumference: '52.5 mm' },
  { uk: 'N', us: '6.75', eu: '54', diameter: '17.1 mm', circumference: '53.8 mm' },
  { uk: 'O', us: '7.25', eu: '55', diameter: '17.5 mm', circumference: '55.1 mm' },
  { uk: 'P', us: '7.75', eu: '56', diameter: '17.9 mm', circumference: '56.3 mm' },
  { uk: 'Q', us: '8.25', eu: '58', diameter: '18.3 mm', circumference: '57.6 mm' },
  { uk: 'R', us: '8.75', eu: '59', diameter: '18.8 mm', circumference: '58.9 mm' },
  { uk: 'S', us: '9.25', eu: '60', diameter: '19.2 mm', circumference: '60.2 mm' },
];

export const RingSizingGuide: React.FC = () => {
  const [selectedUkSize, setSelectedUkSize] = useState<string>('L');
  const shouldReduceMotion = useReducedMotion();

  const activeSize = SIZE_CHART.find((s) => s.uk === selectedUkSize) || SIZE_CHART[4];

  const headerVariants = {
    hidden: shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
    },
  };

  return (
    <section
      id="sizing"
      className="py-20 md:py-28 text-[#E2E8F0] relative overflow-hidden border-t border-white/5"
    >
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-gradient-to-tr from-[#ECE5DA]/5 via-transparent to-transparent rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header in Floating Glass Panel */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          variants={headerVariants}
          className="text-center max-w-3xl mx-auto mb-16 p-8 sm:p-10 rounded-2xl bg-black/40 backdrop-blur-md border border-white/10 shadow-2xl"
        >
          <div className="inline-flex items-center gap-2 mb-3">
            <Ruler className="w-4 h-4 text-[#ECE5DA]" />
            <span className="text-xs font-mono tracking-[0.25em] text-[#ECE5DA] uppercase">
              Precision Atelier Standards
            </span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-display text-[#FFFFFF] font-light uppercase tracking-[0.14em] mb-4">
            Ring Sizing Intelligence
          </h2>

          <div className="w-16 h-0.5 bg-[#ECE5DA]/40 mx-auto mb-6" />

          <p className="text-xs sm:text-sm text-[#E2E8F0]/75 leading-relaxed font-light">
            Finding the ideal fit for a surprise proposal is easier than you think. Use our interactive conversion matrix, secret sizing methods, and complimentary resizing guarantee.
          </p>
        </motion.div>

        {/* 2-Column Layout: Interactive Converter + Secret Sizing Protocol */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Interactive Size Explorer */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            variants={headerVariants}
            className="lg:col-span-7 card-glass p-6 sm:p-8 bg-black/40 backdrop-blur-md border border-white/10 rounded-xl shadow-2xl"
          >
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
              <div>
                <h3 className="font-display text-xl text-white font-light tracking-wide">
                  International Size Matrix
                </h3>
                <p className="text-[11px] font-mono text-[#E2E8F0]/60 mt-1">
                  Select a standard UK letter to calculate exact millimetre metrics
                </p>
              </div>
              <span className="text-xs font-mono px-3 py-1 bg-[#ECE5DA]/10 border border-[#ECE5DA]/30 text-[#ECE5DA] rounded-xs">
                UK / US / EU
              </span>
            </div>

            {/* UK Letter Selector Chips */}
            <div className="mb-8">
              <label className="block text-[10px] font-mono uppercase tracking-widest text-[#ECE5DA] mb-3">
                Select UK Standard Size:
              </label>
              <div className="grid grid-cols-6 sm:grid-cols-12 gap-1.5">
                {SIZE_CHART.map((size) => (
                  <button
                    key={size.uk}
                    onClick={() => setSelectedUkSize(size.uk)}
                    className={`py-2 text-xs font-mono font-medium rounded-xs border transition-all cursor-pointer ${
                      selectedUkSize === size.uk
                        ? 'bg-[#ECE5DA] text-[#10191D] border-[#ECE5DA] shadow-md scale-105'
                        : 'bg-[#10191D]/80 text-[#E2E8F0]/70 border-white/10 hover:border-[#ECE5DA]/40 hover:text-white'
                    }`}
                  >
                    {size.uk}
                  </button>
                ))}
              </div>
            </div>

            {/* Detailed Metric Showcase Card */}
            <div className="p-6 rounded-xs bg-[#10191D]/90 border border-[#ECE5DA]/30 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
              <div className="p-3 bg-white/[0.02] border border-white/5 rounded-xs">
                <span className="block text-[9px] font-mono uppercase tracking-wider text-[#ECE5DA]/70 mb-1">
                  UK / AU Size
                </span>
                <span className="text-xl font-serif-luxury text-white font-medium">
                  {activeSize.uk}
                </span>
              </div>
              <div className="p-3 bg-white/[0.02] border border-white/5 rounded-xs">
                <span className="block text-[9px] font-mono uppercase tracking-wider text-[#ECE5DA]/70 mb-1">
                  US / Canada
                </span>
                <span className="text-xl font-serif-luxury text-[#ECE5DA] font-medium">
                  {activeSize.us}
                </span>
              </div>
              <div className="p-3 bg-white/[0.02] border border-white/5 rounded-xs">
                <span className="block text-[9px] font-mono uppercase tracking-wider text-[#ECE5DA]/70 mb-1">
                  Inside Diameter
                </span>
                <span className="text-base font-mono text-white font-medium">
                  {activeSize.diameter}
                </span>
              </div>
              <div className="p-3 bg-white/[0.02] border border-white/5 rounded-xs">
                <span className="block text-[9px] font-mono uppercase tracking-wider text-[#ECE5DA]/70 mb-1">
                  Circumference
                </span>
                <span className="text-base font-mono text-[#ECE5DA] font-medium">
                  {activeSize.circumference}
                </span>
              </div>
            </div>

            {/* Complimentary Resizing Guarantee */}
            <div className="mt-6 pt-6 border-t border-white/10 flex items-start gap-3 text-xs text-[#E2E8F0]/70 font-light">
              <ShieldCheck className="w-5 h-5 text-[#ECE5DA] shrink-0 mt-0.5" />
              <p>
                <strong className="text-white font-medium">Complimentary First Resize:</strong> Every bespoke Brindley engagement ring includes one complimentary resizing within 90 days of proposal, ensuring total peace of mind.
              </p>
            </div>
          </motion.div>

          {/* Right Column: Secret Sizing Methods for Surprise Proposals */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            variants={headerVariants}
            className="lg:col-span-5 space-y-4"
          >
            <div className="card-slate p-6 bg-black/40 backdrop-blur-md border border-white/10 rounded-xl shadow-xl">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-4 h-4 text-[#ECE5DA]" />
                <h4 className="font-display text-base text-white tracking-wide">
                  Secret Proposal Sizing Tips
                </h4>
              </div>

              <ul className="space-y-3.5 text-xs text-[#E2E8F0]/75 font-light">
                <li className="flex items-start gap-2.5">
                  <Check className="w-3.5 h-3.5 text-[#ECE5DA] shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-white">Borrow an Existing Ring:</strong> Take a ring she wears on her ring or middle finger, place it on paper, and trace the inside rim with a fine mechanical pencil.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="w-3.5 h-3.5 text-[#ECE5DA] shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-white">The Soap Impression:</strong> Gently press an existing ring into a soft bar of soap or take a high-resolution photo next to a £1 coin for CAD scaling.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="w-3.5 h-3.5 text-[#ECE5DA] shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-white">Average Benchmark:</strong> The average UK women's ring size is <strong className="text-[#ECE5DA]">L to N</strong> (US 5.75 to 6.75). When in doubt, sizing slightly larger is easier to adjust down.
                  </span>
                </li>
              </ul>
            </div>

            {/* WhatsApp Sizer Request */}
            <div className="p-6 rounded-xl bg-black/40 backdrop-blur-md border border-[#ECE5DA]/30 flex flex-col justify-between gap-4 shadow-xl">
              <div>
                <span className="text-[10px] font-mono uppercase text-[#ECE5DA] tracking-widest block mb-1">
                  Complimentary Ring Sizer Kit
                </span>
                <p className="text-xs text-[#E2E8F0]/80 font-light leading-relaxed">
                  We can dispatch a discreet physical multi-sizer gauge in unbranded packaging directly to your private address.
                </p>
              </div>

              <a
                href="https://wa.me/447721391972?text=Hello%20Brindley%20Diamonds,%20could%20you%20please%20send%20a%20complimentary%20ring%20sizer%20kit?"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-solid btn-glow py-2.5 px-4 text-[10px] tracking-widest uppercase flex items-center justify-center gap-2 cursor-pointer"
              >
                <MessageCircle className="w-3.5 h-3.5 text-[#10191D]" />
                <span>Request Discreet Sizer Kit</span>
              </a>
            </div>
          </motion.div>

        </div>

      </div>
    </section>
  );
};
