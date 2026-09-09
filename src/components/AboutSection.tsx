import React, { useRef } from 'react';
import { Send, MessageCircle, Sparkles } from 'lucide-react';
import { motion, useScroll, useTransform, useReducedMotion } from 'motion/react';

interface AboutSectionProps {
  onOpenConsultation?: () => void;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ onOpenConsultation }) => {
  const sectionRef = useRef<HTMLElement>(null);
  const shouldReduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start']
  });

  const ambientY = useTransform(scrollYProgress, [0, 1], ['-20%', '20%']);

  const fadeInUpVariants = {
    hidden: shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] }
    }
  };

  const processCards = [
    {
      icon: '💎',
      title: 'Our Live Vault Stock',
      desc: 'We carry a hand-picked collection of loose diamond stock right here in our UK studio vault. If a stone in our current collection matches what you’re searching for, it was meant to be. Simply ask us, and we will send over an unedited, high-definition video.',
    },
    {
      icon: '📸',
      title: 'Send Us Your Inspo Pictures',
      desc: 'We know stunning ring designs pop up on your feed and you forward them to your friends, so why not send them to us? Share your favourite screenshots or Pinterest boards, and we’ll map out how to build it for significantly less.',
    },
    {
      icon: '🛠️',
      title: 'Master Assembly',
      desc: 'Hand-finished, cast in solid gold, and set locally by master craftsmen in Birmingham’s historic Jewellery Quarter.',
    },
  ];

  return (
    <section
      id="about"
      ref={sectionRef}
      className="py-20 md:py-28 bg-transparent text-[#E2E8F0] relative overflow-hidden"
    >
      {/* Background ambient light halo */}
      <motion.div
        style={{ y: shouldReduceMotion ? 0 : ambientY }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] bg-[#ECE5DA]/5 rounded-full blur-3xl pointer-events-none -z-10"
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Header & Subhead in Floating Glass Panel */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          variants={fadeInUpVariants}
          className="text-center max-w-3xl mx-auto mb-16 p-8 sm:p-10 rounded-2xl bg-black/40 backdrop-blur-md border border-white/10 shadow-2xl"
        >
          <span className="text-xs font-mono tracking-[0.25em] text-[#ECE5DA]/70 uppercase block mb-3">
            Our Studio Philosophy
          </span>
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-display text-[#FFFFFF] font-light tracking-[0.12em] mb-6 leading-tight">
            Diamonds are formed under pressure, buying them shouldn't be.
          </h2>
          <div className="w-16 h-0.5 bg-[#ECE5DA]/40 mx-auto mb-8" />
          
          <div className="space-y-4 text-sm sm:text-base text-[#E2E8F0]/85 font-light leading-relaxed">
            <p>
              At <strong className="font-normal text-white">Brindley Diamonds</strong>, our goal is simple: to help you acquire your absolute dream piece whether it’s a high carat engagement ring, a classic tennis bracelet, or a bespoke solitaire necklace.
            </p>
            <p>
              We operate a zero pressure consultation studio. We don't believe in aggressive sales scripts, pushy retail environments. Truly understanding your exact needs, personal taste, and vision is what we pride ourselves on.
            </p>
          </div>
        </motion.div>

        {/* How We Create Together Cards */}
        <div className="mt-16 mb-20">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            variants={fadeInUpVariants}
            className="text-center mb-12"
          >
            <span className="text-[10px] font-mono tracking-[0.3em] text-[#ECE5DA]/60 uppercase block mb-2">
              Bespoke Process
            </span>
            <h3 className="text-2xl sm:text-3xl font-display text-white font-light tracking-wide uppercase">
              How We Create Together
            </h3>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {processCards.map((card, idx) => (
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
                className="card-slate p-8 bg-black/40 backdrop-blur-md border border-white/10 rounded-xl flex flex-col justify-between hover:border-[#ECE5DA]/40 transition-all duration-300 shadow-xl"
              >
                <div>
                  <div className="text-3xl mb-4 text-[#ECE5DA] transition-transform duration-300 group-hover:scale-110">
                    {card.icon}
                  </div>
                  <h4 className="font-display text-lg text-white font-normal mb-3 tracking-wide">
                    {card.title}
                  </h4>
                  <p className="text-xs sm:text-sm text-[#E2E8F0]/70 leading-relaxed font-light">
                    {card.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* CTA Banner */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          variants={fadeInUpVariants}
          className="card-slate p-8 sm:p-12 bg-black/50 backdrop-blur-lg border border-[#ECE5DA]/30 text-center rounded-2xl max-w-3xl mx-auto shadow-2xl relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-48 h-48 bg-[#ECE5DA]/5 rounded-full blur-2xl pointer-events-none" />
          
          <h3 className="text-xl sm:text-3xl font-display text-white font-light tracking-wide mb-3 uppercase">
            Ready to Explore Your Options?
          </h3>
          <p className="text-xs sm:text-sm text-[#E2E8F0]/80 font-light max-w-lg mx-auto mb-8 leading-relaxed">
            Connect directly with our studio team. No pressure, no obligation, just real guidance on creating your perfect piece.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="https://instagram.com/brindleydiamonds"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-solid w-full sm:w-auto min-w-[210px] justify-center"
            >
              <Send className="w-3.5 h-3.5" />
              DM us on Instagram
            </a>
            <a
              href="https://wa.me/447721391972"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-ghost w-full sm:w-auto min-w-[210px] justify-center"
            >
              <MessageCircle className="w-3.5 h-3.5 text-[#25D366]" />
              Chat on WhatsApp
            </a>
            {onOpenConsultation && (
              <button
                onClick={onOpenConsultation}
                className="btn-ghost w-full sm:w-auto min-w-[210px] justify-center border-[#ECE5DA]/40 text-[#ECE5DA] hover:border-[#ECE5DA]"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#ECE5DA]" />
                Book Consultation
              </button>
            )}
          </div>
        </motion.div>

      </div>
    </section>
  );
};
