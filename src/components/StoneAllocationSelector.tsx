import React, { useState } from 'react';
import { Sparkles, MessageCircle, Check, ArrowRight, ShieldCheck, Gem } from 'lucide-react';
import { getAllocationWhatsAppUrl } from '../config/atelier';

interface StoneAllocationSelectorProps {
  onOpenConsultation?: () => void;
}

const SILHOUETTES = [
  { id: 'Round Brilliant', label: 'Round Brilliant', desc: '57-Facet Optical Fire', ratio: '1.00 : 1.00' },
  { id: 'Oval', label: 'Oval Cut', desc: 'Elongated Brilliance', ratio: '1.35 – 1.45' },
  { id: 'Emerald', label: 'Emerald Cut', desc: 'Hall of Mirrors Step Cut', ratio: '1.40 – 1.50' },
  { id: 'Radiant', label: 'Radiant Cut', desc: 'Crushed Ice Brilliance', ratio: '1.15 – 1.30' },
  { id: 'Pear', label: 'Pear Cut', desc: 'Graceful Teardrop Silhouette', ratio: '1.50 – 1.65' },
];

const SETTINGS = [
  { id: 'Platinum Classic Solitaire', label: 'Platinum Classic Solitaire', desc: 'Heavyweight hand-finished mount' },
  { id: 'Antwerp Hidden Halo', label: 'Antwerp Hidden Halo', desc: 'Discreet under-gallery pavé diamonds' },
  { id: '18k Yellow Gold Pavé', label: '18k Yellow Gold Pavé', desc: 'Micro-set shoulders in warm gold' },
  { id: 'Bespoke Commission', label: 'Bespoke Commission', desc: 'Custom CAD design tailored from scratch' },
];

const CARAT_TIERS = [
  { id: '1.50ct–2.00ct', label: '1.50ct – 2.00ct', tier: 'Editorial Classic' },
  { id: '2.50ct–3.00ct', label: '2.50ct – 3.00ct', tier: 'Master Allocation' },
  { id: '3.50ct+ Bespoke', label: '3.50ct+ Bespoke', tier: 'Private Collector Tier' },
];

export const StoneAllocationSelector: React.FC<StoneAllocationSelectorProps> = ({
  onOpenConsultation,
}) => {
  const [selectedSilhouette, setSelectedSilhouette] = useState(SILHOUETTES[1].id); // Default Oval
  const [selectedSetting, setSelectedSetting] = useState(SETTINGS[0].id); // Default Platinum Solitaire
  const [selectedCarat, setSelectedCarat] = useState(CARAT_TIERS[1].id); // Default 2.50ct - 3.00ct

  const whatsappUrl = getAllocationWhatsAppUrl(selectedSilhouette, selectedSetting, selectedCarat);

  return (
    <div id="allocation-selector" className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 mb-16">
      <div className="card-glass border border-white/10 p-6 sm:p-8 lg:p-10 rounded-xs bg-[#0F161A]/85 backdrop-blur-xl relative overflow-hidden shadow-2xl">
        {/* Subtle Luxury Corner Accent */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-radial from-[#ECE5DA]/10 to-transparent pointer-events-none" />

        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 border-b border-white/10 pb-6 mb-8">
          <div>
            <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.25em] text-[#ECE5DA] mb-2 font-medium">
              <Gem className="w-3.5 h-3.5 text-[#ECE5DA]" />
              <span>Multi-Step Concierge Builder</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-display text-white font-light tracking-wide">
              Stone Allocation Selector
            </h2>
            <p className="text-xs sm:text-sm text-[#E2E8F0]/70 font-light mt-1.5 max-w-2xl">
              Configure your bespoke stone requirements. We verify current Jewellery Quarter vault allocations, certify grading via IGI, and share 4K macro video files directly.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start lg:self-auto px-3 py-1.5 rounded-xs bg-white/[0.04] border border-white/10 text-[10px] font-mono text-[#ECE5DA]/90">
            <ShieldCheck className="w-3.5 h-3.5 text-[#ECE5DA]" />
            <span>Birmingham Jewellery Quarter Stock</span>
          </div>
        </div>

        {/* 3-Step Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* STEP 1: SILHOUETTE / CUT */}
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-[#ECE5DA] font-semibold">
                Step 1: Silhouette / Cut
              </span>
              <span className="text-[9px] font-mono text-white/40">5 Cuts Available</span>
            </div>

            <div className="space-y-2">
              {SILHOUETTES.map((s) => {
                const isSelected = selectedSilhouette === s.id;
                return (
                  <button
                    type="button"
                    key={s.id}
                    onClick={() => setSelectedSilhouette(s.id)}
                    className={`w-full min-h-[48px] p-3 text-left rounded-xs border transition-all duration-300 flex items-center justify-between group cursor-pointer ${
                      isSelected
                        ? 'bg-[#ECE5DA] text-[#10191D] border-[#ECE5DA] shadow-md'
                        : 'bg-white/[0.02] text-[#E2E8F0] border-white/10 hover:border-[#ECE5DA]/40 hover:bg-white/[0.04]'
                    }`}
                  >
                    <div className="min-w-0 pr-2">
                      <div className="text-xs font-medium tracking-wide flex items-center gap-2">
                        <span>{s.label}</span>
                        <span className={`text-[9px] font-mono uppercase tracking-wider ${isSelected ? 'text-[#10191D]/70' : 'text-white/40'}`}>
                          {s.ratio}
                        </span>
                      </div>
                      <div className={`text-[10px] font-light mt-0.5 truncate ${isSelected ? 'text-[#10191D]/80' : 'text-[#E2E8F0]/60'}`}>
                        {s.desc}
                      </div>
                    </div>
                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 border ${
                        isSelected
                          ? 'border-[#10191D] bg-[#10191D] text-[#ECE5DA]'
                          : 'border-white/20 text-transparent'
                      }`}
                    >
                      <Check className="w-3 h-3" />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* STEP 2: BESPOKE SETTING */}
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-[#ECE5DA] font-semibold">
                Step 2: Bespoke Setting
              </span>
              <span className="text-[9px] font-mono text-white/40">Hallmarked Mounts</span>
            </div>

            <div className="space-y-2">
              {SETTINGS.map((set) => {
                const isSelected = selectedSetting === set.id;
                return (
                  <button
                    type="button"
                    key={set.id}
                    onClick={() => setSelectedSetting(set.id)}
                    className={`w-full min-h-[48px] p-3 text-left rounded-xs border transition-all duration-300 flex items-center justify-between group cursor-pointer ${
                      isSelected
                        ? 'bg-[#ECE5DA] text-[#10191D] border-[#ECE5DA] shadow-md'
                        : 'bg-white/[0.02] text-[#E2E8F0] border-white/10 hover:border-[#ECE5DA]/40 hover:bg-white/[0.04]'
                    }`}
                  >
                    <div className="min-w-0 pr-2">
                      <div className="text-xs font-medium tracking-wide">
                        {set.label}
                      </div>
                      <div className={`text-[10px] font-light mt-0.5 truncate ${isSelected ? 'text-[#10191D]/80' : 'text-[#E2E8F0]/60'}`}>
                        {set.desc}
                      </div>
                    </div>
                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 border ${
                        isSelected
                          ? 'border-[#10191D] bg-[#10191D] text-[#ECE5DA]'
                          : 'border-white/20 text-transparent'
                      }`}
                    >
                      <Check className="w-3 h-3" />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* STEP 3: CARAT / TIER */}
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-[#ECE5DA] font-semibold">
                Step 3: Carat / Tier
              </span>
              <span className="text-[9px] font-mono text-white/40">IGI Certified D-F</span>
            </div>

            <div className="space-y-2">
              {CARAT_TIERS.map((tier) => {
                const isSelected = selectedCarat === tier.id;
                return (
                  <button
                    type="button"
                    key={tier.id}
                    onClick={() => setSelectedCarat(tier.id)}
                    className={`w-full min-h-[48px] p-3.5 text-left rounded-xs border transition-all duration-300 flex items-center justify-between group cursor-pointer ${
                      isSelected
                        ? 'bg-[#ECE5DA] text-[#10191D] border-[#ECE5DA] shadow-md'
                        : 'bg-white/[0.02] text-[#E2E8F0] border-white/10 hover:border-[#ECE5DA]/40 hover:bg-white/[0.04]'
                    }`}
                  >
                    <div className="min-w-0 pr-2">
                      <div className="text-xs font-medium tracking-wide">
                        {tier.label}
                      </div>
                      <div className={`text-[10px] font-mono uppercase tracking-wider mt-0.5 ${isSelected ? 'text-[#10191D]/75' : 'text-[#ECE5DA]/80'}`}>
                        {tier.tier}
                      </div>
                    </div>
                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 border ${
                        isSelected
                          ? 'border-[#10191D] bg-[#10191D] text-[#ECE5DA]'
                          : 'border-white/20 text-transparent'
                      }`}
                    >
                      <Check className="w-3 h-3" />
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Live Spec Summary Card */}
            <div className="p-3.5 rounded-xs bg-black/40 border border-white/10 text-xs font-mono space-y-1 mt-4">
              <div className="text-[10px] text-white/40 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                <span>Current Configuration</span>
                <span className="text-[#ECE5DA]">Live Spec</span>
              </div>
              <div className="text-white/80 flex items-center justify-between text-[11px]">
                <span className="text-[#ECE5DA]/70">Cut:</span>
                <span className="font-semibold">{selectedSilhouette}</span>
              </div>
              <div className="text-white/80 flex items-center justify-between text-[11px]">
                <span className="text-[#ECE5DA]/70">Mount:</span>
                <span className="font-semibold truncate max-w-[180px] text-right">{selectedSetting}</span>
              </div>
              <div className="text-white/80 flex items-center justify-between text-[11px]">
                <span className="text-[#ECE5DA]/70">Carat:</span>
                <span className="font-semibold">{selectedCarat}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Handoff Banner & CTA */}
        <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-[#E2E8F0]/70 font-light text-center sm:text-left">
            <span className="text-[#ECE5DA] font-mono font-medium block sm:inline">
              Instant Atelier Review:
            </span>{' '}
            Our diamond team inspects rough facet tables &amp; returns 4K macro video captures with IGI dossiers.
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto shrink-0">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-solid btn-glow w-full sm:w-auto min-h-[48px] py-3.5 px-6 text-[10.5px] font-mono font-semibold uppercase tracking-[0.16em] flex items-center justify-center gap-2.5 cursor-pointer shadow-xl text-center"
            >
              <MessageCircle className="w-4 h-4 text-[#10191D]" />
              <span>Send Specification to Concierge via WhatsApp</span>
            </a>

            {onOpenConsultation && (
              <button
                type="button"
                onClick={onOpenConsultation}
                className="btn-ghost min-h-[48px] py-3.5 px-5 text-[10px] font-mono uppercase tracking-[0.16em] text-[#ECE5DA] hover:text-white border-white/15 hover:border-[#ECE5DA] w-full sm:w-auto flex items-center justify-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#ECE5DA]" />
                <span>Book Atelier Consultation</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
