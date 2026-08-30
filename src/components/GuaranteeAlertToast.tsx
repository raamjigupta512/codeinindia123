import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldCheck, X, ChevronRight, Sparkles, CheckCircle2 } from 'lucide-react';

interface GuaranteeAlertToastProps {
  onOpenGuaranteeModal: () => void;
}

export default function GuaranteeAlertToast({ onOpenGuaranteeModal }: GuaranteeAlertToastProps) {
  const [isInTargetSection, setIsInTargetSection] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  useEffect(() => {
    // Check if dismissed previously in session
    if (typeof window !== 'undefined') {
      const stored = sessionStorage.getItem('guarantee_toast_dismissed');
      if (stored === 'true') {
        setIsDismissed(true);
      }
    }

    const checkScrollPosition = () => {
      const pricingEl = document.getElementById('pricing');
      const registerEl = document.getElementById('register');
      const faqEl = document.getElementById('faq');

      if (!pricingEl && !registerEl) return;

      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const viewportMid = scrollY + windowHeight * 0.5;

      let inSection = false;

      if (pricingEl) {
        const pricingTop = pricingEl.offsetTop - 200;
        const pricingBottom = pricingEl.offsetTop + pricingEl.offsetHeight + 100;
        if (viewportMid >= pricingTop && viewportMid <= pricingBottom) {
          inSection = true;
        }
      }

      if (faqEl && !inSection) {
        const faqTop = faqEl.offsetTop - 100;
        const faqBottom = faqEl.offsetTop + faqEl.offsetHeight + 100;
        if (viewportMid >= faqTop && viewportMid <= faqBottom) {
          inSection = true;
        }
      }

      if (registerEl && !inSection) {
        const registerTop = registerEl.offsetTop - 200;
        const registerBottom = registerEl.offsetTop + registerEl.offsetHeight + 200;
        if (viewportMid >= registerTop && viewportMid <= registerBottom) {
          inSection = true;
        }
      }

      setIsInTargetSection(inSection);
    };

    window.addEventListener('scroll', checkScrollPosition, { passive: true });
    checkScrollPosition();

    return () => {
      window.removeEventListener('scroll', checkScrollPosition);
    };
  }, []);

  const handleDismiss = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setIsDismissed(true);
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('guarantee_toast_dismissed', 'true');
    }
  };

  const handleToggleMinimize = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setIsMinimized(!isMinimized);
  };

  const handleOpenModalClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onOpenGuaranteeModal();
  };

  const shouldShow = isInTargetSection && !isDismissed;

  return (
    <AnimatePresence>
      {shouldShow && (
        <motion.div
          key="guarantee-alert-toast"
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 30, scale: 0.95 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="fixed bottom-20 md:bottom-7 left-4 right-4 sm:left-auto sm:right-6 md:right-8 z-40 max-w-sm sm:max-w-md w-auto"
          id="guarantee-alert-toast"
          role="status"
          aria-live="polite"
        >
          {isMinimized ? (
            /* Minimized Pill State */
            <motion.div
              layoutId="guarantee-pill"
              onClick={handleToggleMinimize}
              className="bg-emerald-950/90 text-emerald-300 border border-emerald-500/50 backdrop-blur-md px-3.5 py-2 rounded-full shadow-xl flex items-center gap-2 cursor-pointer hover:bg-emerald-900 transition-colors group"
              title="Click to view 100% Money-Back Guarantee"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-400 animate-pulse" />
              <span className="text-xs font-bold font-sans">100% Risk-Free Guarantee</span>
              <ChevronRight className="w-3.5 h-3.5 text-emerald-400 group-hover:translate-x-0.5 transition-transform" />
            </motion.div>
          ) : (
            /* Expanded Alert Card State */
            <div className="bg-card/95 dark:bg-[#0B1513]/95 backdrop-blur-md text-ink dark:text-white border-2 border-emerald-500/50 rounded-2xl p-4 sm:p-4.5 shadow-2xl shadow-emerald-900/20 relative overflow-hidden group">
              
              {/* Top Accent Gradient Line */}
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-emerald-400 via-teal-400 to-peacock" />

              {/* Action Buttons: Minimize & Dismiss */}
              <div className="absolute top-3 right-3 flex items-center gap-1">
                <button
                  type="button"
                  onClick={handleToggleMinimize}
                  className="text-muted hover:text-ink dark:hover:text-white p-1 rounded-md transition-colors text-[0.7rem] font-bold px-1.5"
                  title="Minimize alert"
                  aria-label="Minimize guarantee alert"
                >
                  Min
                </button>
                <button
                  type="button"
                  onClick={handleDismiss}
                  className="text-muted hover:text-ink dark:hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
                  title="Dismiss alert"
                  aria-label="Dismiss guarantee alert"
                  id="dismiss-guarantee-toast-btn"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-start gap-3.5 pr-12">
                {/* Shield Icon with glowing ring */}
                <div className="relative flex-none mt-0.5">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shadow-inner">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-card animate-pulse" />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 text-[0.68rem] font-mono font-bold px-2 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-emerald-500" /> Risk-Free Policy
                    </span>
                    <span className="text-[0.7rem] text-muted font-medium flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-500" /> Verified
                    </span>
                  </div>

                  <h4 className="font-display text-sm sm:text-[0.95rem] font-extrabold text-ink dark:text-white leading-tight">
                    100% Money-Back Guarantee
                  </h4>

                  <p className="text-muted text-[0.78rem] sm:text-xs mt-1 leading-snug">
                    Attend Session 1. If you're not fully satisfied with the live instruction, claim a <strong className="text-emerald-700 dark:text-emerald-400 font-semibold">100% hassle-free refund</strong> within 24 hours.
                  </p>

                  {/* Actions */}
                  <div className="mt-3 flex items-center gap-2.5 flex-wrap">
                    <button
                      type="button"
                      onClick={handleOpenModalClick}
                      className="text-xs font-bold text-emerald-700 dark:text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer"
                      id="toast-view-guarantee-terms-btn"
                    >
                      <span>Read Policy & Terms</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={handleDismiss}
                      className="text-[0.72rem] text-muted hover:text-ink dark:hover:text-gray-300 font-medium px-2 py-1 transition-colors cursor-pointer"
                    >
                      Got it
                    </button>
                  </div>
                </div>
              </div>

            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
