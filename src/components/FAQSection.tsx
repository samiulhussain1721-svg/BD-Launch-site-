import React, { useState } from 'react';
import { ChevronDown, Sparkles } from 'lucide-react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';

interface FAQItem {
  question: string;
  answer: string;
}

const FAQS: FAQItem[] = [
  {
    question: 'How does Brindley Diamonds offer significantly lower pricing without compromising quality?',
    answer: 'Traditional high-street jewellers carry huge overheads: premium retail store leases, armed security, extensive showroom staff, and multiple layers of middlemen distributors. We cut out all physical showrooms and secondary distributors. We source directly from top-tier IGI-certified diamond cutters and craft every ring to order in our Birmingham Jewellery Quarter workshop. Every penny you spend goes directly into diamond carat, colour, clarity, and precious metal weight, not our rent.',
  },
  {
    question: 'Are all Brindley diamonds genuine, certified, and authenticated?',
    answer: 'Absolutely. Every centre diamond we source is independently graded and certified by the International Gemological Institute (IGI), the global benchmark in diamond authentication. Each diamond comes with an official digital and physical certificate verifying its 4Cs, and features a micro-laser inscription on its girdle matching the unique certificate number, verifiable under 10x magnification.',
  },
  {
    question: 'Can I design a completely bespoke ring from a Pinterest picture or sketch?',
    answer: 'Yes, this is our signature speciality. Over 80% of our clients come to us with screenshots from Instagram, Pinterest boards, or hand-drawn sketches. Our CAD designers will translate your inspiration into a precision 3D render, source matching diamond options for your approval via 4K video, and custom cast the setting in your chosen metal (18k Yellow/White/Rose Gold or 950 Platinum).',
  },
  {
    question: 'How long does a bespoke engagement ring take to craft?',
    answer: 'Our standard bespoke timeline is 2 to 4 weeks from stone approval to delivery. If you have an urgent proposal timeline, please inform our team during your consultation; we can frequently accommodate expedited creation within 10 to 14 working days.',
  },
  {
    question: 'How do consultations work if you do not have a public showroom?',
    answer: 'We provide private, 1-on-1 digital consultations via WhatsApp, Instagram DM, or video call. You will work directly with our lead diamond specialists. We send unedited macro videos of diamond stock, custom CAD renders of your design, and real-time quotes. If you are based in the UK, bespoke arrangements can also be scheduled for private viewing in the Birmingham Jewellery Quarter.',
  },
];

export const FAQSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const shouldReduceMotion = useReducedMotion();

  const toggleIndex = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  const headerVariants = {
    hidden: shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] }
    }
  };

  return (
    <section id="faq" className="py-20 md:py-28 bg-transparent text-[#E2E8F0] relative overflow-hidden">
      {/* Subtle ambient glow */}
      <div className="absolute top-1/3 right-1/3 w-[450px] h-[450px] bg-[#ECE5DA]/4 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header in Floating Glass Panel */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          variants={headerVariants}
          className="text-center mb-16 p-8 sm:p-10 rounded-2xl bg-black/40 backdrop-blur-md border border-white/10 shadow-2xl"
        >
          <span className="text-xs font-mono tracking-[0.25em] text-[#ECE5DA]/70 uppercase block mb-2">
            Clarity &amp; Transparency
          </span>
          <h2 className="text-3xl sm:text-5xl font-display text-[#FFFFFF] font-light uppercase tracking-[0.16em] mb-4">
            Frequently Asked
          </h2>
          <div className="w-12 h-0.5 bg-[#ECE5DA]/40 mx-auto mb-6" />
          <p className="text-sm text-[#E2E8F0]/70 leading-relaxed font-light max-w-xl mx-auto">
            Everything you need to know about our sourcing, bespoke atelier process, and IGI diamond certifications.
          </p>
        </motion.div>

        {/* FAQ Accordion List */}
        <div className="space-y-4">
          {FAQS.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <motion.div
                key={faq.question}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.15 }}
                variants={{
                  hidden: shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 20 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: {
                      duration: 0.6,
                      delay: idx * 0.08,
                      ease: [0.16, 1, 0.3, 1],
                    },
                  },
                }}
                className={`card-slate transition-all duration-300 rounded-xl overflow-hidden backdrop-blur-md ${
                  isOpen ? 'border-[#ECE5DA]/50 bg-black/50 shadow-2xl' : 'border-white/10 bg-black/35 hover:border-white/25'
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggleIndex(idx)}
                  className="w-full p-6 sm:p-7 text-left flex items-center justify-between gap-4 cursor-pointer"
                  aria-expanded={isOpen}
                >
                  <span className="font-display text-base sm:text-lg text-[#FFFFFF] font-normal leading-snug tracking-wide">
                    {faq.question}
                  </span>
                  <div
                    className={`w-8 h-8 rounded-full border border-white/10 flex items-center justify-center shrink-0 transition-transform duration-400 ease-out ${
                      isOpen ? 'rotate-180 bg-[#ECE5DA]/10 border-[#ECE5DA]/40 text-[#ECE5DA]' : 'text-[#E2E8F0]/60'
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 sm:px-7 pb-6 pt-0 border-t border-white/5">
                        <p className="text-xs sm:text-sm text-[#E2E8F0]/80 font-light leading-relaxed pt-4">
                          {faq.answer}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

        {/* Still have questions banner */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          variants={headerVariants}
          className="mt-14 p-6 text-center border border-white/10 rounded-xs bg-[#10191D]/60 flex flex-col sm:flex-row items-center justify-between gap-4"
        >
          <div className="text-left">
            <span className="text-xs font-mono uppercase text-[#ECE5DA] tracking-wider font-medium flex items-center gap-1.5 mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              Have a specific question about carat, colour, or cut?
            </span>
            <p className="text-[11px] text-[#E2E8F0]/60 font-mono">
              Our gemmologists respond directly on WhatsApp within the hour.
            </p>
          </div>

          <a
            href="https://wa.me/447721391972?text=Hello%20Brindley%20Diamonds,%20I%20have%20a%20question%20regarding%20diamond%20specs"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-solid py-2.5 px-5 text-[10px] tracking-widest shrink-0"
          >
            Ask on WhatsApp
          </a>
        </motion.div>

      </div>
    </section>
  );
};
