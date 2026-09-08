import React from 'react';
import { Award, ShieldCheck, Gem } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';

export const Certifications: React.FC = () => {
  const shouldReduceMotion = useReducedMotion();

  const headerVariants = {
    hidden: shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] }
    }
  };

  const certCards = [
    {
      icon: <Award className="w-7 h-7" />,
      title: 'Triple Excellent Graded',
      desc: 'We only source diamonds that score "Excellent" in Cut, Symmetry, and Polish, ensuring extreme fire and light return.',
    },
    {
      icon: <ShieldCheck className="w-7 h-7" />,
      title: 'Laser Inscribed Girdle',
      desc: 'Each diamond holds a micro-laser inscription on its girdle matching its unique, searchable IGI digital passport.',
    },
    {
      icon: <Gem className="w-7 h-7" />,
      title: 'Ethically Sourced',
      desc: 'Every stone is meticulously tracked from state-of-the-art ethical cutters back to our custom workshop bench.',
    },
  ];

  return (
    <section id="certs" className="py-20 md:py-28 bg-transparent text-[#E2E8F0] relative overflow-hidden">
      {/* Subtle ambient lighting */}
      <div className="absolute top-1/2 right-1/4 w-[500px] h-[500px] bg-[#ECE5DA]/4 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Section Header in Floating Glass Panel */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          variants={headerVariants}
          className="max-w-2xl mx-auto mb-16 p-8 rounded-2xl bg-black/40 backdrop-blur-md border border-white/10 shadow-2xl"
        >
          <span className="text-xs font-mono tracking-[0.25em] text-[#ECE5DA]/70 uppercase block mb-2">
            Uncompromising Standards
          </span>
          <h2 className="text-3xl sm:text-5xl font-display text-[#FFFFFF] font-light uppercase tracking-[0.18em] mb-4">
            IGI Certified Perfection
          </h2>
          <div className="w-12 h-0.5 bg-[#ECE5DA]/40 mx-auto mb-6" />
          <p className="text-sm text-[#E2E8F0]/70 leading-relaxed font-light">
            Every single diamond hand-selected by our atelier is individually authenticated and micro-laser inscribed by the International Gemological Institute (IGI).
          </p>
        </motion.div>

        {/* 3 Column Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {certCards.map((card, idx) => (
            <motion.div
              key={card.title}
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
                    delay: idx * 0.12,
                    ease: [0.16, 1, 0.3, 1],
                  },
                },
              }}
              className="card-slate p-8 text-center flex flex-col items-center bg-black/40 backdrop-blur-md border border-white/10 rounded-xl group hover:border-[#ECE5DA]/40 transition-all duration-300 shadow-xl"
            >
              <div className="w-14 h-14 rounded-full bg-white/5 text-[#ECE5DA] flex items-center justify-center mb-6 border border-white/10 group-hover:border-[#ECE5DA]/50 group-hover:scale-105 transition-all duration-300 shadow-md">
                {card.icon}
              </div>
              <h4 className="font-display text-lg text-[#FFFFFF] font-normal uppercase tracking-wider mb-3 group-hover:text-[#ECE5DA] transition-colors">
                {card.title}
              </h4>
              <p className="text-xs text-[#E2E8F0]/60 leading-relaxed font-light">
                {card.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
