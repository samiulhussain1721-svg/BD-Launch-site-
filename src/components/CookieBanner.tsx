import React, { useState, useEffect } from 'react';
import { Cookie, Shield, X, Settings } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface CookieBannerProps {
  onOpenPrivacyModal: (tab: 'privacy' | 'cookies' | 'terms') => void;
}

export const CookieBanner: React.FC<CookieBannerProps> = ({ onOpenPrivacyModal }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user has already made a cookie choice
    try {
      const consent = localStorage.getItem('bd_cookie_consent_v1');
      if (!consent) {
        // Slight delay for smooth initial load
        const timer = setTimeout(() => setIsVisible(true), 1200);
        return () => clearTimeout(timer);
      }
    } catch {
      // In case localStorage is blocked
    }
  }, []);

  const handleAcceptAll = () => {
    try {
      localStorage.setItem('bd_cookie_consent_v1', 'all');
      localStorage.setItem(
        'bd_cookie_preferences_v1',
        JSON.stringify({ necessary: true, analytics: true, marketing: true })
      );
    } catch {
      // ignore
    }
    setIsVisible(false);
  };

  const handleRejectNonEssential = () => {
    try {
      localStorage.setItem('bd_cookie_consent_v1', 'necessary_only');
      localStorage.setItem(
        'bd_cookie_preferences_v1',
        JSON.stringify({ necessary: true, analytics: false, marketing: false })
      );
    } catch {
      // ignore
    }
    setIsVisible(false);
  };

  const handleManage = () => {
    onOpenPrivacyModal('cookies');
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="fixed bottom-4 left-4 right-4 sm:left-6 sm:right-6 md:left-auto md:right-8 md:max-w-md z-40"
      >
        <div className="card-glass border border-white/15 bg-[#0C1215]/95 backdrop-blur-xl p-5 sm:p-6 shadow-2xl rounded-xs relative text-left">
          {/* Header */}
          <div className="flex items-start justify-between gap-3 mb-2.5">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-[0.18em] text-[#ECE5DA]">
              <Cookie className="w-4 h-4 text-[#ECE5DA]" />
              <span>Discretion &amp; Privacy</span>
            </div>
            <button
              onClick={handleRejectNonEssential}
              className="text-[#E2E8F0]/40 hover:text-white transition-colors cursor-pointer p-0.5"
              aria-label="Dismiss cookie notice"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <p className="text-xs text-[#E2E8F0]/75 font-light leading-relaxed mb-4">
            Under UK GDPR &amp; PECR, we operate with full discretion. We use strictly necessary cookies to manage your bespoke consultation briefs, and optional anonymised telemetry to refine our atelier guides.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-2">
            <button
              onClick={handleAcceptAll}
              className="w-full sm:flex-1 btn-solid min-h-[40px] py-2 px-3 text-[11px] font-mono uppercase tracking-wider cursor-pointer"
            >
              Accept All
            </button>
            <button
              onClick={handleRejectNonEssential}
              className="w-full sm:flex-1 btn-ghost min-h-[40px] py-2 px-3 text-[11px] font-mono uppercase tracking-wider text-[#ECE5DA] border-white/20 hover:border-white cursor-pointer"
            >
              Essential Only
            </button>
          </div>

          <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between text-[10px] font-mono text-[#E2E8F0]/50">
            <button
              onClick={handleManage}
              className="hover:text-[#ECE5DA] transition-colors flex items-center gap-1 cursor-pointer"
            >
              <Settings className="w-3 h-3 text-[#ECE5DA]" />
              <span>Manage Preferences</span>
            </button>
            <button
              onClick={() => onOpenPrivacyModal('privacy')}
              className="hover:text-white underline transition-colors cursor-pointer"
            >
              Read Privacy Notice
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
