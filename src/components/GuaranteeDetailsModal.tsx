import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldCheck, X, CheckCircle2, Clock, RefreshCw, Mail, MessageCircle, HelpCircle, AlertCircle } from 'lucide-react';
import { getWhatsappNumber } from '../lib/whatsapp';

interface GuaranteeDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function GuaranteeDetailsModal({ isOpen, onClose }: GuaranteeDetailsModalProps) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/75 backdrop-blur-sm overflow-y-auto"
        id="guarantee-details-modal-backdrop"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="bg-card dark:bg-[#0E1726] border border-border-custom dark:border-[#202E4E] rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl relative my-8"
          id="guarantee-details-modal"
        >
          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full text-muted hover:text-ink dark:hover:text-white bg-paper/80 dark:bg-[#18233D] hover:bg-paper transition-colors cursor-pointer"
            aria-label="Close Modal"
            id="close-guarantee-modal-btn"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header */}
          <div className="flex items-start gap-4 mb-6 pr-8">
            <div className="w-13 h-13 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-peacock/20 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center flex-none">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 font-mono text-[0.72rem] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider mb-1">
                Risk-Free Protection
              </div>
              <h3 className="font-display text-2xl font-extrabold text-ink dark:text-white">
                100% Money-Back Guarantee
              </h3>
              <p className="text-xs sm:text-sm text-muted mt-1">
                Zero-risk enrollment policy for all paid tracks & cohorts.
              </p>
            </div>
          </div>

          {/* Core Promise Card */}
          <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-2xl p-4 sm:p-5 mb-6">
            <p className="text-sm text-ink-soft dark:text-slate-200 leading-relaxed font-medium">
              We stand 100% behind the quality of our hands-on curriculum. Attend the first live session, build along with the instructor, and if you feel this program isn't the right fit for your coding journey, we will issue a full 100% refund — <strong className="text-emerald-700 dark:text-emerald-300">no questions asked</strong>.
            </p>
          </div>

          {/* Key Guarantee Pillars */}
          <div className="space-y-4 mb-6">
            <h4 className="font-display text-xs font-bold text-ink dark:text-white uppercase tracking-wider">
              Guarantee Terms & Claim Process
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="bg-paper dark:bg-[#141F36] border border-border-custom dark:border-[#202E4E] p-3.5 rounded-xl">
                <div className="flex items-center gap-2 mb-1.5 text-peacock dark:text-emerald-400 font-semibold text-xs">
                  <Clock className="w-4 h-4" />
                  <span>Timeline</span>
                </div>
                <p className="text-xs text-muted leading-relaxed">
                  Request within <strong>24 hours</strong> of the first live class or batch kickoff date.
                </p>
              </div>

              <div className="bg-paper dark:bg-[#141F36] border border-border-custom dark:border-[#202E4E] p-3.5 rounded-xl">
                <div className="flex items-center gap-2 mb-1.5 text-peacock dark:text-emerald-400 font-semibold text-xs">
                  <RefreshCw className="w-4 h-4" />
                  <span>Settlement Window</span>
                </div>
                <p className="text-xs text-muted leading-relaxed">
                  Processed automatically via Razorpay back to your original source (UPI/Card) in <strong>2-4 business days</strong>.
                </p>
              </div>
            </div>

            <ul className="space-y-2.5 text-xs text-ink-soft dark:text-slate-300">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-none mt-0.5" />
                <span><strong>No interrogations:</strong> Simply state that you'd like a refund; no long forms or proof required.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-none mt-0.5" />
                <span><strong>Full 100% Reversal:</strong> All course fees and platform taxes are refunded with zero processing deduction.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-none mt-0.5" />
                <span><strong>Keep Prep Resources:</strong> You can keep all preliminary code templates and starter repositories with our compliments.</span>
              </li>
            </ul>
          </div>

          {/* Simple 2-Step Refund Process */}
          <div className="bg-paper/80 dark:bg-[#111B30] border border-border-custom dark:border-[#202E4E] rounded-2xl p-4 mb-6">
            <h5 className="font-display text-xs font-bold text-ink dark:text-white mb-2 flex items-center gap-1.5">
              <HelpCircle className="w-3.5 h-3.5 text-peacock" />
              How to claim your refund:
            </h5>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <a
                href={`https://wa.me/${getWhatsappNumber()}?text=Hi%2C%20I%20would%20like%20to%20request%20a%20refund%20under%20the%20100%25%20Money-Back%20Guarantee.`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 p-2.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-semibold transition-colors"
                id="modal-wa-refund-link"
              >
                <MessageCircle className="w-4 h-4 text-emerald-500" />
                <span>Claim via WhatsApp</span>
              </a>
              <a
                href="mailto:refunds@codeinindia.in?subject=Refund%20Request%20-%20100%25%20Money-Back%20Guarantee"
                className="flex items-center gap-2 p-2.5 rounded-xl bg-peacock/10 hover:bg-peacock/20 text-peacock font-semibold transition-colors"
                id="modal-email-refund-link"
              >
                <Mail className="w-4 h-4 text-peacock" />
                <span>Email refunds@codeinindia.in</span>
              </a>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-3 pt-2 border-t border-border-custom dark:border-[#202E4E]">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-primary px-6 py-2.5 text-xs font-bold cursor-pointer"
              id="got-it-guarantee-btn"
            >
              Got it, thanks!
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
