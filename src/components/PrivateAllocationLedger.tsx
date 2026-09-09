import React, { useState, useRef, useEffect } from 'react';
import { Lock, ShieldCheck, CheckCircle2, AlertCircle, RefreshCw, ArrowRight } from 'lucide-react';

export const PrivateAllocationLedger: React.FC = () => {
  const [fullName, setFullName] = useState('');
  const [contactInfo, setContactInfo] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const abortControllerRef = useRef<AbortController | null>(null);
  const timeoutIdRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      if (timeoutIdRef.current) {
        clearTimeout(timeoutIdRef.current);
      }
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName.trim() || !contactInfo.trim()) {
      setErrorMessage('Please enter both your name and preferred contact detail.');
      return;
    }

    // Cancel any previous out-of-order request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    setIsSubmitting(true);
    setErrorMessage(null);

    // 8-second network timeout watchdog
    timeoutIdRef.current = window.setTimeout(() => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      setIsSubmitting(false);
      setErrorMessage('Network connection timed out (8s limit). Please check your connection and retry.');
    }, 8000);

    // Simulated secure client registration with AbortSignal check
    setTimeout(() => {
      if (abortControllerRef.current?.signal.aborted) {
        return;
      }
      if (timeoutIdRef.current) {
        clearTimeout(timeoutIdRef.current);
      }

      try {
        // Save locally to simulate private client queue ledger
        const ledgerEntry = {
          name: fullName.trim(),
          contact: contactInfo.trim(),
          timestamp: new Date().toISOString(),
          status: 'PENDING_PRIVATE_ALLOCATION',
        };
        const existing = JSON.parse(localStorage.getItem('brindley_allocation_ledger') || '[]');
        existing.push(ledgerEntry);
        localStorage.setItem('brindley_allocation_ledger', JSON.stringify(existing));

        setIsSubmitting(false);
        setIsSuccess(true);
      } catch (err) {
        setIsSubmitting(false);
        setErrorMessage('Unable to register allocation request. Please retry.');
      }
    }, 1100);
  };

  const handleRetry = () => {
    setErrorMessage(null);
    setIsSubmitting(false);
  };

  return (
    <section
      id="private-ledger"
      aria-labelledby="ledger-heading"
      className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-20 relative"
    >
      <div className="card-glass border border-white/10 rounded-xs bg-[#0B1114]/90 backdrop-blur-xl p-8 sm:p-12 lg:p-16 relative overflow-hidden shadow-2xl">
        {/* Editorial Background Accents */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-radial from-[#ECE5DA]/10 to-transparent pointer-events-none" />
        <div className="absolute top-0 right-0 w-64 h-64 bg-radial from-white/[0.04] to-transparent pointer-events-none" />

        <div className="max-w-3xl mx-auto text-center relative z-10">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xs bg-white/[0.03] border border-white/10 text-[10px] font-mono text-[#ECE5DA] uppercase tracking-[0.25em] mb-6">
            <Lock className="w-3.5 h-3.5 text-[#ECE5DA]" />
            <span>Private Allocation Vault</span>
          </div>

          {/* Headline & Sub-headline */}
          <h2
            id="ledger-heading"
            className="text-2xl sm:text-4xl lg:text-5xl font-display text-white font-light tracking-wide mb-4"
          >
            The Private Allocation Ledger
          </h2>
          <p className="text-xs sm:text-sm lg:text-base text-[#E2E8F0]/70 font-light leading-relaxed mb-10 max-w-2xl mx-auto">
            Receive private allocations of Birmingham Jewellery Quarter D-Colour, VVS1 loose stone shipments and bespoke ring openings before public release.
          </p>

          {/* Form / State Handler */}
          {isSuccess ? (
            <div className="p-8 rounded-xs bg-emerald-950/30 border border-emerald-500/30 text-center animate-fadeIn">
              <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-display text-white font-medium mb-1">
                Access Request Registered
              </h3>
              <p className="text-xs text-white/70 max-w-md mx-auto mb-6">
                Thank you, {fullName}. Your ledger entry has been logged. Our senior gemmologist will reach out with the next parcel allocation dossier.
              </p>
              <button
                type="button"
                onClick={() => {
                  setIsSuccess(false);
                  setFullName('');
                  setContactInfo('');
                }}
                className="btn-ghost py-2.5 px-5 text-[10px] font-mono uppercase tracking-[0.16em] text-[#ECE5DA]"
              >
                Submit Another Specification
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 max-w-xl mx-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {/* Full Name */}
                <div className="text-left">
                  <label
                    htmlFor="ledger-name"
                    className="block text-[10px] font-mono uppercase tracking-widest text-[#ECE5DA]/80 mb-1.5"
                  >
                    Client Name
                  </label>
                  <input
                    id="ledger-name"
                    type="text"
                    required
                    disabled={isSubmitting}
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Lord / Lady / First Last"
                    className="w-full min-h-[48px] px-4 py-3 bg-[#10191D] border border-white/15 focus:border-[#ECE5DA] rounded-xs text-[#E2E8F0] placeholder:text-white/30 text-base sm:text-xs transition-colors outline-none focus-visible:ring-1 focus-visible:ring-[#ECE5DA]"
                    style={{ scrollMarginBottom: '5rem' }}
                  />
                </div>

                {/* Email / WhatsApp */}
                <div className="text-left">
                  <label
                    htmlFor="ledger-contact"
                    className="block text-[10px] font-mono uppercase tracking-widest text-[#ECE5DA]/80 mb-1.5"
                  >
                    Email or WhatsApp Number
                  </label>
                  <input
                    id="ledger-contact"
                    type="text"
                    required
                    disabled={isSubmitting}
                    value={contactInfo}
                    onChange={(e) => setContactInfo(e.target.value)}
                    placeholder="client@domain.com or +44..."
                    className="w-full min-h-[48px] px-4 py-3 bg-[#10191D] border border-white/15 focus:border-[#ECE5DA] rounded-xs text-[#E2E8F0] placeholder:text-white/30 text-base sm:text-xs transition-colors outline-none focus-visible:ring-1 focus-visible:ring-[#ECE5DA]"
                    style={{ scrollMarginBottom: '5rem' }}
                  />
                </div>
              </div>

              {/* Error Message with Retry */}
              {errorMessage && (
                <div className="p-3.5 rounded-xs bg-red-950/40 border border-red-500/40 text-red-300 text-xs flex items-center justify-between gap-3 text-left">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                    <span>{errorMessage}</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleRetry}
                    className="shrink-0 flex items-center gap-1 text-[10px] font-mono uppercase tracking-wider underline hover:text-white cursor-pointer"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Retry</span>
                  </button>
                </div>
              )}

              {/* CTA Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-solid btn-glow w-full min-h-[48px] py-3.5 px-6 text-[11px] font-mono font-semibold uppercase tracking-[0.2em] flex items-center justify-center gap-2 cursor-pointer shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all mt-4"
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Securing Allocation Registration...</span>
                  </>
                ) : (
                  <>
                    <span>Request Vault Access</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#10191D]" />
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-4 text-[10px] font-mono text-white/40 pt-2">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-[#ECE5DA]" />
                  Strict Confidentiality
                </span>
                <span>&bull;</span>
                <span>Zero Public Distribution</span>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};
