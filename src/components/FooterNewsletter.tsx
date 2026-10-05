import React, { useState } from 'react';
import { subscribeToGazette } from '../utils/gazetteStorage';
import { Mail, CheckCircle2, AlertCircle, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';

interface FooterNewsletterProps {
  onOpenPrivacyModal?: (tab: 'privacy' | 'cookies' | 'terms') => void;
}

export const FooterNewsletter: React.FC<FooterNewsletterProps> = ({ onOpenPrivacyModal }) => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [isExistingSubscriber, setIsExistingSubscriber] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setStatus('error');
      setMessage('Please enter your email address.');
      return;
    }

    setStatus('loading');

    // Simulate subtle atelier encryption / validation delay
    setTimeout(() => {
      const result = subscribeToGazette(email, 'footer_newsletter');
      if (result.success) {
        setStatus('success');
        setMessage(result.message);
        setIsExistingSubscriber(!!result.isExisting);
        setEmail('');
      } else {
        setStatus('error');
        setMessage(result.message);
      }
    }, 450);
  };

  return (
    <div className="border-b border-white/10 pb-12 mb-12">
      <div className="relative overflow-hidden rounded-xs bg-[#10191D]/70 border border-white/10 p-6 sm:p-8 lg:p-10 backdrop-blur-sm">
        {/* Subtle decorative gold light flare */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#ECE5DA]/[0.03] rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Editorial Headline & Brief */}
          <div className="lg:col-span-6 space-y-2.5 text-left">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-xs bg-white/[0.04] border border-white/10 text-[10px] font-mono uppercase tracking-[0.24em] text-[#ECE5DA]">
              <Sparkles className="w-3 h-3 text-[#ECE5DA]" />
              <span>The Vault Gazette • Private Dispatches</span>
            </div>

            <h3 className="text-xl sm:text-2xl font-display text-white font-light tracking-wide">
              Curated Diamond Intel &amp; Atelier Bench Notes
            </h3>

            <p className="text-xs text-[#E2E8F0]/70 font-light leading-relaxed max-w-xl">
              Receive discreet quarterly briefings on rare rough stone allocations, Birmingham Jewellery
              Quarter workshop notes, and bespoke engagement guides. Strictly editorial; zero marketing noise.
            </p>
          </div>

          {/* Discreet Newsletter Signup Form */}
          <div className="lg:col-span-6">
            {status === 'success' ? (
              <div className="p-5 rounded-xs bg-emerald-950/30 border border-emerald-500/30 flex items-start gap-3.5 animate-fadeIn">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="text-xs font-mono uppercase tracking-wider text-emerald-300 font-semibold">
                    {isExistingSubscriber ? 'Subscription Active' : 'Private Dispatch Confirmed'}
                  </p>
                  <p className="text-xs text-[#E2E8F0]/80 font-light leading-relaxed">
                    {message} You will receive quarterly notes and unadvertised certified diamond dossiers directly.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setStatus('idle');
                      setMessage('');
                    }}
                    className="text-[10px] font-mono uppercase tracking-wider text-[#ECE5DA] hover:underline pt-2 inline-block cursor-pointer"
                  >
                    Register another address
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-2.5">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                  <div className="relative flex-1">
                    <Mail className="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (status === 'error') {
                          setStatus('idle');
                          setMessage('');
                        }
                      }}
                      placeholder="Enter your private email address..."
                      aria-label="Private email address for The Vault Gazette updates"
                      required
                      className="w-full pl-10 pr-4 py-3 min-h-[48px] bg-[#080C0E]/90 border border-white/15 focus:border-[#ECE5DA] focus:ring-1 focus:ring-[#ECE5DA]/40 text-xs font-mono text-white placeholder:text-white/30 rounded-xs transition-colors outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="min-h-[48px] px-6 py-3 bg-[#ECE5DA] hover:bg-white text-[#080C0E] text-xs font-mono font-semibold uppercase tracking-[0.16em] rounded-xs transition-all shadow-sm flex items-center justify-center gap-2 shrink-0 cursor-pointer disabled:opacity-60"
                  >
                    {status === 'loading' ? (
                      <span className="inline-block w-4 h-4 border-2 border-[#080C0E]/30 border-t-[#080C0E] rounded-full animate-spin" />
                    ) : (
                      <>
                        <span>Subscribe</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </div>

                {status === 'error' && (
                  <div className="flex items-center gap-1.5 text-rose-400 text-xs font-mono">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{message}</span>
                  </div>
                )}

                <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 text-[10px] font-mono text-[#E2E8F0]/50 pt-0.5">
                  <div className="flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-[#ECE5DA]/70" />
                    <span>UK GDPR Compliant • Strictly confidential</span>
                  </div>
                  <div>
                    <button
                      type="button"
                      onClick={() => onOpenPrivacyModal?.('privacy')}
                      className="hover:text-[#ECE5DA] underline cursor-pointer"
                    >
                      Privacy terms
                    </button>
                    <span className="mx-1">•</span>
                    <span>1-click unsubscribe anytime</span>
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
