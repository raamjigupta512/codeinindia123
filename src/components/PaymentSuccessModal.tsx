import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  CheckCircle2, 
  ShieldCheck, 
  Copy, 
  Check, 
  Download, 
  Users, 
  Calendar, 
  X, 
  CreditCard, 
  ArrowRight,
  ExternalLink,
  Sparkles
} from 'lucide-react';
import FramerMotionConfetti from './FramerMotionConfetti';
import { getWhatsappGroupUrl } from '../lib/whatsapp';
import { generatePaymentReceiptPDF } from '../utils/paymentReceiptPdf';
import WhatsAppJoinModal from './WhatsAppJoinModal';

export interface PaymentSuccessData {
  payment_id?: string;
  order_id?: string;
  amount?: number; // in Rupees or Paise (handled safely)
  currency?: string;
  planName?: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  verifiedAt?: string;
  signature?: string;
  record?: any;
}

interface PaymentSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: PaymentSuccessData | null;
  onDone?: () => void;
}

export default function PaymentSuccessModal({
  isOpen,
  onClose,
  data,
  onDone
}: PaymentSuccessModalProps) {
  const [copiedField, setCopiedField] = useState<'payment' | 'order' | null>(null);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [isWhatsAppModalOpen, setIsWhatsAppModalOpen] = useState(false);

  if (!isOpen || !data) return null;

  // Extract and normalize values
  const paymentId = data.payment_id || data.record?.paymentId || 'pay_verified_test';
  const orderId = data.order_id || data.record?.orderId || 'order_verified_test';
  
  // Safe amount calculation: if > 10000 and matches standard paise representation, convert
  let amountInRupees = data.amount || 0;
  if (data.record?.amount) {
    amountInRupees = data.record.amount > 1000 ? data.record.amount / 100 : data.record.amount;
  } else if (data.amount && data.amount >= 100 && Number.isInteger(data.amount) && (data.amount === 499900 || data.amount === 299900 || data.amount === 100)) {
    amountInRupees = data.amount / 100;
  }

  const customerName = data.customerName || data.record?.customerName || 'Student';
  const customerEmail = data.customerEmail || data.record?.customerEmail || '';
  const customerPhone = data.customerPhone || data.record?.customerPhone || '';
  const planName = data.planName || data.record?.planName || 'CodeInIndia Live Cohort';
  const verifiedAt = data.verifiedAt || data.record?.verifiedAt || new Date().toISOString();

  const handleCopy = (text: string, type: 'payment' | 'order') => {
    navigator.clipboard.writeText(text);
    setCopiedField(type);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleDownloadReceipt = () => {
    setIsGeneratingPdf(true);
    try {
      generatePaymentReceiptPDF({
        paymentId,
        orderId,
        amount: amountInRupees,
        currency: 'INR',
        planName,
        customerName,
        customerEmail,
        customerPhone,
        verifiedAt,
        signature: data.signature || data.record?.signature
      });
    } catch (err) {
      console.error('Failed to generate receipt PDF:', err);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  // Google Calendar Event Link
  const calendarEventTitle = encodeURIComponent(`CodeInIndia Cohort Onboarding: ${planName}`);
  const calendarEventDetails = encodeURIComponent(`Welcome to ${planName}! Live onboarding session starts. Check your WhatsApp group for the Google Meet link.`);
  const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${calendarEventTitle}&details=${calendarEventDetails}&dates=20260825T133000Z/20260825T153000Z`;

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-md overflow-y-auto animate-[fadeIn_0.2s_ease-out]">
      <motion.div 
        initial={{ opacity: 0, scale: 0.92, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 20 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="bg-card dark:bg-[#0F172A] border border-emerald-500/40 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden relative max-h-[92vh] flex flex-col text-ink dark:text-white"
        id="payment-success-modal"
      >
        {/* Full-width Framer Motion Confetti & Ambient Particles */}
        <FramerMotionConfetti particleCount={50} originY={24} ambientCount={16} />

        {/* Top Banner with Close */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-emerald-500/20 via-peacock/15 to-transparent border-b border-border-custom dark:border-[#1E293B] flex items-center justify-between flex-none relative z-10">
          <div className="flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </span>
            <div>
              <span className="font-mono text-[0.68rem] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider block">
                Razorpay Cryptographic Signature Match
              </span>
              <h3 className="font-display font-extrabold text-sm sm:text-base text-ink dark:text-white">
                Payment Verification Successful
              </h3>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-paper dark:bg-[#1E293B] border border-border-custom dark:border-[#334155] flex items-center justify-center text-muted hover:text-ink dark:hover:text-white transition-colors cursor-pointer"
            id="close-payment-success-btn"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 font-sans space-y-5 relative z-10">
          {/* Main Success Hero */}
          <div className="text-center pt-1">
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', damping: 12, stiffness: 200, delay: 0.1 }}
              className="w-16 h-16 rounded-full bg-emerald-500/15 border-2 border-emerald-500/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto mb-3 shadow-inner ring-8 ring-emerald-500/5"
            >
              <CheckCircle2 className="w-9 h-9 text-emerald-500" />
            </motion.div>

            <h2 className="font-display text-2xl font-extrabold text-ink dark:text-white mb-1">
              Enrollment Confirmed!
            </h2>
            <p className="text-muted text-xs sm:text-sm max-w-sm mx-auto">
              Welcome aboard, <strong className="text-ink dark:text-white">{customerName}</strong>! Your seat for <strong className="text-peacock">{planName}</strong> has been secured and logged in the database.
            </p>
          </div>

          {/* Digital Receipt Box */}
          <div className="bg-paper dark:bg-[#1E293B]/60 border border-border-custom dark:border-[#334155] rounded-2xl p-4 sm:p-5 text-xs space-y-2.5 shadow-xs font-sans">
            <div className="flex items-center justify-between pb-2 border-b border-border-custom/60 dark:border-[#334155]">
              <div className="flex items-center gap-1.5 font-bold text-ink dark:text-white text-xs">
                <CreditCard className="w-3.5 h-3.5 text-peacock" />
                <span>Payment Summary</span>
              </div>
              <span className="font-mono text-[0.68rem] font-extrabold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded-full flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                HMAC-SHA256 VERIFIED
              </span>
            </div>

            {/* Payment ID with copy */}
            <div className="flex justify-between items-center py-1">
              <span className="text-muted">Payment ID:</span>
              <div className="flex items-center gap-1.5">
                <span className="font-mono font-bold text-peacock text-[0.78rem] bg-peacock/10 px-1.5 py-0.5 rounded">
                  {paymentId}
                </span>
                <button
                  type="button"
                  onClick={() => handleCopy(paymentId, 'payment')}
                  className="p-1 text-muted hover:text-ink dark:hover:text-white rounded hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer"
                  title="Copy Payment ID"
                >
                  {copiedField === 'payment' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {/* Order ID with copy */}
            <div className="flex justify-between items-center py-1">
              <span className="text-muted">Order ID:</span>
              <div className="flex items-center gap-1.5">
                <span className="font-mono font-semibold text-ink dark:text-white text-[0.75rem]">
                  {orderId}
                </span>
                <button
                  type="button"
                  onClick={() => handleCopy(orderId, 'order')}
                  className="p-1 text-muted hover:text-ink dark:hover:text-white rounded hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer"
                  title="Copy Order ID"
                >
                  {copiedField === 'order' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {/* Track / Plan */}
            <div className="flex justify-between items-center py-1">
              <span className="text-muted">Selected Plan:</span>
              <span className="font-bold text-ink dark:text-white">{planName}</span>
            </div>

            {/* Total Paid */}
            <div className="flex justify-between items-center pt-2 border-t border-border-custom/60 dark:border-[#334155]">
              <span className="font-bold text-ink dark:text-white">Total Amount Paid:</span>
              <span className="font-display font-extrabold text-base text-emerald-600 dark:text-emerald-400">
                ₹{amountInRupees.toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          {/* Action Step 1: Join WhatsApp Batch */}
          <div className="space-y-2">
            <label className="block text-[0.72rem] font-bold uppercase tracking-wider text-muted">
              Next Steps for Enrolled Cohort Members
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {/* WhatsApp Community Button */}
              <button
                type="button"
                onClick={() => setIsWhatsAppModalOpen(true)}
                className="p-3 rounded-xl border border-emerald-500/40 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 flex items-center gap-2.5 transition-all text-xs font-bold shadow-xs cursor-pointer group text-left"
                id="join-whatsapp-success-btn"
              >
                <div className="w-7 h-7 rounded-lg bg-emerald-500 text-white flex items-center justify-center flex-none">
                  <Users className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="truncate">Join Batch WhatsApp</div>
                  <div className="text-[0.65rem] font-normal text-muted truncate">Official Student Lounge</div>
                </div>
                <ExternalLink className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100 flex-none" />
              </button>

              {/* Add to Calendar */}
              <a
                href={googleCalendarUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-xl border border-peacock/40 bg-peacock/10 hover:bg-peacock/20 text-peacock dark:text-teal-300 flex items-center gap-2.5 transition-all text-xs font-bold shadow-xs cursor-pointer group"
                id="add-calendar-success-btn"
              >
                <div className="w-7 h-7 rounded-lg bg-peacock text-white flex items-center justify-center flex-none">
                  <Calendar className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="truncate">Add to Calendar</div>
                  <div className="text-[0.65rem] font-normal text-muted truncate">Google Meet Schedule</div>
                </div>
                <ExternalLink className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100 flex-none" />
              </a>
            </div>
          </div>

          {/* Action Step 2: Open Student Dashboard */}
          <button
            type="button"
            onClick={() => {
              onClose();
              window.location.hash = '#dashboard';
            }}
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md"
            id="open-student-dashboard-success-btn"
          >
            <span>Go to My Student Dashboard & Curriculum</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          {/* Action Step 3: Download PDF Receipt */}
          <button
            type="button"
            onClick={handleDownloadReceipt}
            disabled={isGeneratingPdf}
            className="w-full py-2.5 px-4 rounded-xl border border-border-custom dark:border-[#334155] bg-paper dark:bg-[#1E293B] hover:border-peacock/50 text-ink dark:text-white font-semibold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs disabled:opacity-50"
            id="download-receipt-pdf-btn"
          >
            <Download className="w-3.5 h-3.5 text-peacock" />
            <span>{isGeneratingPdf ? 'Generating PDF Receipt...' : 'Download Official PDF Receipt & Invoice'}</span>
          </button>
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 border-t border-border-custom dark:border-[#1E293B] bg-paper dark:bg-[#1E293B]/40 flex items-center justify-between gap-3 flex-none relative z-10">
          <span className="text-[0.72rem] text-muted flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-peacock" />
            Live Batch Orientation details sent to email
          </span>

          <button
            type="button"
            onClick={() => {
              if (onDone) onDone();
              onClose();
            }}
            className="btn btn-primary text-xs py-2 px-5 font-bold cursor-pointer"
            id="payment-success-done-btn"
          >
            Done
          </button>
        </div>

        <WhatsAppJoinModal 
          isOpen={isWhatsAppModalOpen} 
          onClose={() => setIsWhatsAppModalOpen(false)} 
        />
      </motion.div>
    </div>
  );
}
