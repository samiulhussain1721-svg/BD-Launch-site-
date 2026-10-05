import React, { useState } from 'react';
import { X, Shield, Lock, Eye, Cookie, FileCheck, Check, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface PrivacyPolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'privacy' | 'cookies' | 'terms';
}

export const PrivacyPolicyModal: React.FC<PrivacyPolicyModalProps> = ({
  isOpen,
  onClose,
  defaultTab = 'privacy',
}) => {
  const [activeTab, setActiveTab] = useState<'privacy' | 'cookies' | 'terms'>(defaultTab);

  // Cookie preference toggles
  const [cookieConsent, setCookieConsent] = useState<{
    necessary: boolean;
    analytics: boolean;
    marketing: boolean;
  }>(() => {
    try {
      const stored = localStorage.getItem('bd_cookie_preferences_v1');
      if (stored) return JSON.parse(stored);
    } catch {
      // fallback
    }
    return { necessary: true, analytics: false, marketing: false };
  });

  const [savedNotification, setSavedNotification] = useState(false);

  const handleSaveCookiePreferences = () => {
    localStorage.setItem(
      'bd_cookie_preferences_v1',
      JSON.stringify(cookieConsent)
    );
    localStorage.setItem('bd_cookie_consent_v1', 'custom');
    setSavedNotification(true);
    setTimeout(() => setSavedNotification(false), 3000);
  };

  const handleAcceptAll = () => {
    const all = { necessary: true, analytics: true, marketing: true };
    setCookieConsent(all);
    localStorage.setItem('bd_cookie_preferences_v1', JSON.stringify(all));
    localStorage.setItem('bd_cookie_consent_v1', 'all');
    setSavedNotification(true);
    setTimeout(() => setSavedNotification(false), 3000);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-[#080C0E]/85 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 16 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-3xl bg-[#0E1519] border border-white/15 rounded-xs shadow-2xl overflow-hidden my-auto max-h-[90vh] flex flex-col z-10"
        >
          {/* Header */}
          <div className="p-5 sm:p-6 border-b border-white/10 flex items-center justify-between bg-[#10191D]/90">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#152026] border border-white/15 flex items-center justify-center text-[#ECE5DA]">
                <Shield className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] font-mono text-[#ECE5DA] uppercase tracking-[0.2em] block">
                  UK GDPR &amp; PECR Compliance
                </span>
                <h2 className="text-xl sm:text-2xl font-display text-white font-light">
                  Privacy, Cookies &amp; Data Rights
                </h2>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full border border-white/10 hover:border-white/30 text-[#E2E8F0]/70 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="flex border-b border-white/10 bg-[#0A0F12] px-4 sm:px-6 gap-2 sm:gap-4 overflow-x-auto">
            <button
              onClick={() => setActiveTab('privacy')}
              className={`py-3 px-3 text-xs font-mono uppercase tracking-wider transition-colors border-b-2 whitespace-nowrap cursor-pointer ${
                activeTab === 'privacy'
                  ? 'border-[#ECE5DA] text-white font-medium'
                  : 'border-transparent text-[#E2E8F0]/50 hover:text-[#E2E8F0]'
              }`}
            >
              <div className="flex items-center gap-2">
                <Lock className="w-3.5 h-3.5 text-[#ECE5DA]" />
                <span>Privacy Notice (GDPR)</span>
              </div>
            </button>

            <button
              onClick={() => setActiveTab('cookies')}
              className={`py-3 px-3 text-xs font-mono uppercase tracking-wider transition-colors border-b-2 whitespace-nowrap cursor-pointer ${
                activeTab === 'cookies'
                  ? 'border-[#ECE5DA] text-white font-medium'
                  : 'border-transparent text-[#E2E8F0]/50 hover:text-[#E2E8F0]'
              }`}
            >
              <div className="flex items-center gap-2">
                <Cookie className="w-3.5 h-3.5 text-[#ECE5DA]" />
                <span>Cookie Policy &amp; Controls</span>
              </div>
            </button>

            <button
              onClick={() => setActiveTab('terms')}
              className={`py-3 px-3 text-xs font-mono uppercase tracking-wider transition-colors border-b-2 whitespace-nowrap cursor-pointer ${
                activeTab === 'terms'
                  ? 'border-[#ECE5DA] text-white font-medium'
                  : 'border-transparent text-[#E2E8F0]/50 hover:text-[#E2E8F0]'
              }`}
            >
              <div className="flex items-center gap-2">
                <FileCheck className="w-3.5 h-3.5 text-[#ECE5DA]" />
                <span>Atelier Terms</span>
              </div>
            </button>
          </div>

          {/* Body Content */}
          <div className="p-5 sm:p-6 sm:px-8 overflow-y-auto space-y-6 text-xs text-[#E2E8F0]/80 font-light leading-relaxed">
            {activeTab === 'privacy' && (
              <div className="space-y-6">
                <div className="p-4 bg-[#10191D] border border-[#ECE5DA]/20 rounded-xs flex items-start gap-3">
                  <Eye className="w-4 h-4 text-[#ECE5DA] shrink-0 mt-0.5" />
                  <p className="text-[11px] text-[#ECE5DA]/90 font-mono">
                    Brindley Diamonds respects your discretion. As a private bespoke atelier, client privacy is central to our craft. We never sell, rent, or trade your personal data.
                  </p>
                </div>

                <section className="space-y-2">
                  <h3 className="text-sm font-mono uppercase tracking-widest text-[#ECE5DA] font-semibold">
                    1. Data Controller
                  </h3>
                  <p>
                    Brindley Diamonds Ltd operates as the data controller under the UK General Data Protection Regulation (UK GDPR) and the Data Protection Act 2018.
                  </p>
                  <p className="font-mono text-[11px] text-[#E2E8F0]/60">
                    Location: Birmingham Jewellery Quarter, West Midlands, United Kingdom.<br />
                    Enquiries &amp; Data Rights: <a href="mailto:info@brindleydiamonds.com" className="text-[#ECE5DA] underline">info@brindleydiamonds.com</a>
                  </p>
                </section>

                <section className="space-y-2">
                  <h3 className="text-sm font-mono uppercase tracking-widest text-[#ECE5DA] font-semibold">
                    2. Personal Data We Collect
                  </h3>
                  <ul className="list-disc pl-5 space-y-1.5 marker:text-[#ECE5DA]">
                    <li><strong>Contact Information:</strong> Name, email address, and telephone number when you submit a consultation request.</li>
                    <li><strong>Bespoke Commission Briefs:</strong> Diamond cut preferences, carat weight targets, ring size, metal choice, budget parameters, and uploaded inspiration images or CAD references.</li>
                    <li><strong>Communications:</strong> Records of correspondence conducted via WhatsApp, email, or Instagram Direct Message.</li>
                    <li><strong>Technical Telemetry:</strong> Anonymised device, browser, and navigation timestamps necessary to deliver the responsive digital showroom.</li>
                  </ul>
                </section>

                <section className="space-y-2">
                  <h3 className="text-sm font-mono uppercase tracking-widest text-[#ECE5DA] font-semibold">
                    3. Lawful Basis for Processing
                  </h3>
                  <p>
                    Under UK GDPR Article 6, we process your personal data under the following lawful bases:
                  </p>
                  <ul className="list-disc pl-5 space-y-1.5 marker:text-[#ECE5DA]">
                    <li><strong>Contract Preparation (Art. 6(1)(b)):</strong> To review your bespoke jewellery brief, evaluate loose diamond allocations, generate accurate quotations, and prepare CAD designs prior to crafting.</li>
                    <li><strong>Legitimate Interests (Art. 6(1)(f)):</strong> To maintain client bespoke records, uphold quality assurances, and prevent fraud.</li>
                    <li><strong>Explicit Consent (Art. 6(1)(a)):</strong> For optional communication updates or marketing vault allocations, which you may withdraw at any time.</li>
                  </ul>
                </section>

                <section className="space-y-2">
                  <h3 className="text-sm font-mono uppercase tracking-widest text-[#ECE5DA] font-semibold">
                    4. Data Retention &amp; Security
                  </h3>
                  <p>
                    Enquiry details and custom CAD briefs are retained only for as long as necessary to fulfill your commission and provide ongoing warranty and valuation services. All client information is stored on encrypted systems and accessed solely by authorised atelier craftsmen.
                  </p>
                </section>

                <section className="space-y-2">
                  <h3 className="text-sm font-mono uppercase tracking-widest text-[#ECE5DA] font-semibold">
                    5. Your Statutory Rights Under UK GDPR
                  </h3>
                  <p>As a data subject, you hold statutory rights including:</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <div className="p-3 bg-[#10191D] border border-white/5 rounded-xs">
                      <strong className="text-[#ECE5DA] font-mono block mb-1">Right of Access</strong>
                      <span>Request a copy of the personal data we hold about you (Subject Access Request).</span>
                    </div>
                    <div className="p-3 bg-[#10191D] border border-white/5 rounded-xs">
                      <strong className="text-[#ECE5DA] font-mono block mb-1">Right to Erasure</strong>
                      <span>Request the permanent deletion of your enquiry data ("Right to be Forgotten").</span>
                    </div>
                    <div className="p-3 bg-[#10191D] border border-white/5 rounded-xs">
                      <strong className="text-[#ECE5DA] font-mono block mb-1">Right to Rectification</strong>
                      <span>Correct any inaccurate or incomplete details in your bespoke profile.</span>
                    </div>
                    <div className="p-3 bg-[#10191D] border border-white/5 rounded-xs">
                      <strong className="text-[#ECE5DA] font-mono block mb-1">Right to Object</strong>
                      <span>Object to any processing based on legitimate interests or direct communications.</span>
                    </div>
                  </div>
                  <p className="pt-2">
                    To exercise any of these rights, email <a href="mailto:info@brindleydiamonds.com" className="text-[#ECE5DA] underline">info@brindleydiamonds.com</a>. You also have the right to lodge a complaint with the UK supervisory authority: Information Commissioner's Office (ICO) at <a href="https://ico.org.uk" target="_blank" rel="noreferrer" className="text-[#ECE5DA] underline">ico.org.uk</a>.
                  </p>
                </section>
              </div>
            )}

            {activeTab === 'cookies' && (
              <div className="space-y-6">
                <section className="space-y-2">
                  <h3 className="text-sm font-mono uppercase tracking-widest text-[#ECE5DA] font-semibold">
                    PECR &amp; Cookie Compliance
                  </h3>
                  <p>
                    Under the Privacy and Electronic Communications Regulations (PECR) and UK GDPR, we provide complete transparency regarding cookies and browser storage technologies.
                  </p>
                </section>

                {/* Preference Controls */}
                <div className="space-y-4 pt-2">
                  {/* Necessary */}
                  <div className="p-4 bg-[#10191D] border border-white/10 rounded-xs flex items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <strong className="text-white font-mono text-xs">Strictly Necessary (Functional)</strong>
                        <span className="px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[9px] font-mono uppercase rounded-xs">
                          Always Active
                        </span>
                      </div>
                      <p className="text-[11px] text-[#E2E8F0]/60 mt-1">
                        Essential for core atelier operations, such as remembering your bespoke ring consultation draft, CAD image uploads, and security tokens.
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={true}
                      disabled={true}
                      className="w-4 h-4 accent-[#ECE5DA] cursor-not-allowed opacity-75"
                    />
                  </div>

                  {/* Analytics */}
                  <div className="p-4 bg-[#10191D] border border-white/10 rounded-xs flex items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <strong className="text-white font-mono text-xs">Performance &amp; Analytics</strong>
                        <span className="text-[9px] font-mono text-[#E2E8F0]/40 uppercase">
                          Optional
                        </span>
                      </div>
                      <p className="text-[11px] text-[#E2E8F0]/60 mt-1">
                        Aggregated, anonymised traffic metrics to help us understand which diamond cuts and articles are most helpful to our clients.
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={cookieConsent.analytics}
                      onChange={(e) =>
                        setCookieConsent((prev) => ({ ...prev, analytics: e.target.checked }))
                      }
                      className="w-4 h-4 accent-[#ECE5DA] cursor-pointer"
                    />
                  </div>

                  {/* Marketing */}
                  <div className="p-4 bg-[#10191D] border border-white/10 rounded-xs flex items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <strong className="text-white font-mono text-xs">Editorial &amp; Media Embeds</strong>
                        <span className="text-[9px] font-mono text-[#E2E8F0]/40 uppercase">
                          Optional
                        </span>
                      </div>
                      <p className="text-[11px] text-[#E2E8F0]/60 mt-1">
                        Allows enriched high-definition macro video embeds and Instagram social previews within The Vault Gazette.
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={cookieConsent.marketing}
                      onChange={(e) =>
                        setCookieConsent((prev) => ({ ...prev, marketing: e.target.checked }))
                      }
                      className="w-4 h-4 accent-[#ECE5DA] cursor-pointer"
                    />
                  </div>
                </div>

                {savedNotification && (
                  <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xs text-emerald-400 text-xs font-mono flex items-center gap-2">
                    <Check className="w-4 h-4 shrink-0" />
                    <span>Your privacy and cookie preferences have been recorded.</span>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                  <button
                    onClick={handleSaveCookiePreferences}
                    className="w-full sm:w-auto btn-solid min-h-[44px] py-2.5 px-6 text-xs font-mono uppercase tracking-wider cursor-pointer"
                  >
                    Save Preferences
                  </button>
                  <button
                    onClick={handleAcceptAll}
                    className="w-full sm:w-auto btn-ghost min-h-[44px] py-2.5 px-6 text-xs font-mono uppercase tracking-wider text-[#ECE5DA] border-white/20 hover:border-[#ECE5DA] cursor-pointer"
                  >
                    Accept All Cookies
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'terms' && (
              <div className="space-y-6">
                <section className="space-y-2">
                  <h3 className="text-sm font-mono uppercase tracking-widest text-[#ECE5DA] font-semibold">
                    Bespoke Commission Terms
                  </h3>
                  <p>
                    All bespoke fine jewellery pieces from Brindley Diamonds are handcrafted exclusively upon client commission in our Birmingham Jewellery Quarter workshop.
                  </p>
                </section>

                <section className="space-y-2">
                  <h3 className="text-sm font-mono uppercase tracking-widest text-[#ECE5DA] font-semibold">
                    Certification &amp; Grading Standards
                  </h3>
                  <p>
                    Every loose diamond supplied is accompanied by official laboratory certification (IGI or GIA). Gemological reports verify 4Cs grading, optical measurements, laser-inscribed girdle numbers, and provenance.
                  </p>
                </section>

                <section className="space-y-2">
                  <h3 className="text-sm font-mono uppercase tracking-widest text-[#ECE5DA] font-semibold">
                    Consultation &amp; Quotations
                  </h3>
                  <p>
                    Initial consultations, design sketches, and diamond sourcing reviews are complimentary. Quotations are pegged to live international diamond indices and bullion rates, remaining valid for 14 calendar days from issuance.
                  </p>
                </section>

                <section className="space-y-2">
                  <h3 className="text-sm font-mono uppercase tracking-widest text-[#ECE5DA] font-semibold">
                    UK Consumer Rights for Bespoke Goods
                  </h3>
                  <p>
                    In accordance with the Consumer Contracts Regulations 2013 and Consumer Rights Act 2015, bespoke, custom-made goods personalised to client specifications are exempt from statutory 14-day cancellation rights once casting commences. Full craftsmanship warranty applies to all mounts.
                  </p>
                </section>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-white/10 bg-[#10191D]/80 flex items-center justify-between text-[11px] font-mono text-[#E2E8F0]/50">
            <span>Brindley Diamonds Ltd • Birmingham, UK</span>
            <button
              onClick={onClose}
              className="text-[#ECE5DA] hover:text-white underline cursor-pointer"
            >
              Close
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
