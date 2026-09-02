import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, CreditCard, ShieldCheck, AlertCircle, Loader2, Lock, ArrowRight } from 'lucide-react';
import { openRazorpayCheckout, RazorpayVerificationResponse } from '../utils/razorpay';
import PaymentSuccessModal, { PaymentSuccessData } from './PaymentSuccessModal';
import { savePaymentToFirestore } from '../lib/firebase';

interface RazorpayPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultPlan?: {
    name: string;
    amount: number;
    description: string;
  };
  initialCustomer?: {
    name: string;
    email: string;
    phone: string;
  };
  onPaymentVerified?: (data: RazorpayVerificationResponse) => void;
}

const AVAILABLE_PLANS = [
  {
    id: 'website-workshop',
    name: '1-Day Dynamic Website Workshop',
    amount: 999,
    originalAmount: 999,
    description: '1 full day intensive: Build and ship 5 real dynamic websites with AI',
    badge: 'MOST POPULAR'
  },
  {
    id: 'android-cohort',
    name: '2 Weekend Android App Cohort',
    amount: 999,
    originalAmount: 999,
    description: '2 live weekend sessions: Build real Android apps with AI — idea to working app',
    badge: 'NEW'
  },
  {
    id: 'test',
    name: 'Razorpay Test Checkout',
    amount: 1, // Minimum ₹1 (100 paise)
    originalAmount: 1,
    description: 'Quick ₹1 test transaction to test Razorpay test mode payment flow & signature verification',
    badge: 'TEST MODE'
  }
];

export default function RazorpayPaymentModal({
  isOpen,
  onClose,
  defaultPlan,
  initialCustomer,
  onPaymentVerified
}: RazorpayPaymentModalProps) {
  const [selectedPlanId, setSelectedPlanId] = useState(
    defaultPlan
      ? (AVAILABLE_PLANS.find(p => p.name === defaultPlan.name || p.id === (defaultPlan as any).id || p.amount === defaultPlan.amount)?.id || 'website-workshop')
      : 'website-workshop'
  );

  const [formData, setFormData] = useState({
    name: initialCustomer?.name || '',
    email: initialCustomer?.email || '',
    phone: initialCustomer?.phone || ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [paymentSuccessData, setPaymentSuccessData] = useState<PaymentSuccessData | null>(null);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  useEffect(() => {
    if (initialCustomer) {
      setFormData({
        name: initialCustomer.name || '',
        email: initialCustomer.email || '',
        phone: initialCustomer.phone || ''
      });
    }
  }, [initialCustomer]);

  useEffect(() => {
    if (defaultPlan) {
      const match = AVAILABLE_PLANS.find(p => p.name === defaultPlan.name || p.id === (defaultPlan as any).id || p.amount === defaultPlan.amount);
      if (match) setSelectedPlanId(match.id);
    }
  }, [defaultPlan]);

  const currentPlan = AVAILABLE_PLANS.find(p => p.id === selectedPlanId) || AVAILABLE_PLANS[0];

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'Full name is required';
    if (!formData.phone.trim()) {
      newErrors.phone = 'Mobile number is required';
    } else if (!/^\d{10}$/.test(formData.phone.replace(/[\s-+]/g, ''))) {
      newErrors.phone = 'Please enter a valid 10-digit mobile number';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = 'Please enter a valid email format';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePayClick = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!validate()) return;

    setIsLoading(true);

    await openRazorpayCheckout({
      amountInRupees: currentPlan.amount,
      planName: currentPlan.name,
      customerName: formData.name.trim(),
      customerEmail: formData.email.trim(),
      customerPhone: formData.phone.trim(),
      onSuccess: (verifyResponse) => {
        setIsLoading(false);
        const successData: PaymentSuccessData = {
          payment_id: verifyResponse.payment_id,
          order_id: verifyResponse.order_id,
          amount: currentPlan.amount,
          currency: 'INR',
          planName: currentPlan.name,
          customerName: formData.name.trim(),
          customerEmail: formData.email.trim(),
          customerPhone: formData.phone.trim(),
          verifiedAt: new Date().toISOString(),
          record: verifyResponse.record
        };

        setPaymentSuccessData(successData);
        setIsSuccessModalOpen(true);

        // Persist payment to Firebase Firestore
        if (verifyResponse.payment_id) {
          savePaymentToFirestore(verifyResponse.payment_id, {
            paymentId: verifyResponse.payment_id,
            orderId: verifyResponse.order_id,
            amount: currentPlan.amount,
            currency: 'INR',
            email: formData.email.trim(),
            phone: formData.phone.trim(),
            name: formData.name.trim(),
            status: 'SUCCESS',
            createdAt: new Date().toISOString()
          }).catch(err => {
            console.warn('Firestore payment save notice:', err);
          });
        }

        if (onPaymentVerified) {
          onPaymentVerified(verifyResponse);
        }
      },
      onError: (err) => {
        setIsLoading(false);
        setErrorMessage(err);
      },
      onDismiss: () => {
        setIsLoading(false);
      }
    });
  };

  const handleCloseAll = () => {
    setIsSuccessModalOpen(false);
    setPaymentSuccessData(null);
    setErrorMessage(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="bg-card border border-peacock/40 rounded-3xl w-full max-w-xl shadow-2xl overflow-hidden relative max-h-[92vh] flex flex-col text-ink dark:text-white"
          id="razorpay-checkout-modal"
        >
          {/* Header */}
          <div className="p-5 sm:p-6 bg-gradient-to-r from-peacock/15 via-peacock/5 to-transparent border-b border-border-custom flex items-center justify-between flex-none">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-peacock text-white flex items-center justify-center shadow-md">
                <CreditCard className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-display font-bold text-lg text-ink dark:text-white">
                    Razorpay Standard Checkout
                  </h3>
                  <span className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-mono text-[0.68rem] font-bold px-2 py-0.5 rounded border border-emerald-500/30">
                    TEST MODE
                  </span>
                </div>
                <p className="text-xs text-muted">
                  100% Secure 256-Bit SSL Encrypted Payment Gateway
                </p>
              </div>
            </div>

            <button 
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-paper dark:bg-[#141B2D] border border-border-custom flex items-center justify-center text-muted hover:text-ink dark:hover:text-white transition-colors cursor-pointer"
              id="close-razorpay-modal-btn"
              aria-label="Close modal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Modal Content */}
          <div className="p-5 sm:p-6 overflow-y-auto flex-1 font-sans">
            <form onSubmit={handlePayClick} className="space-y-5" noValidate>
              {/* Plan Selector */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-muted mb-2.5">
                  1. Select Cohort Plan / Test Amount
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {AVAILABLE_PLANS.map((plan) => {
                    const isSelected = selectedPlanId === plan.id;
                    return (
                      <button
                        key={plan.id}
                        type="button"
                        onClick={() => setSelectedPlanId(plan.id)}
                        className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer relative ${
                          isSelected 
                            ? 'border-peacock bg-peacock/10 shadow-sm ring-1 ring-peacock' 
                            : 'border-border-custom bg-paper dark:bg-[#141B2D] hover:border-peacock/40'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between gap-1 mb-1">
                            <span className="font-display font-bold text-xs text-ink dark:text-white line-clamp-1">
                              {plan.name}
                            </span>
                            <span className={`text-[0.62rem] font-mono font-bold px-1.5 py-0.5 rounded ${
                              plan.id === 'test' 
                                ? 'bg-amber-500/20 text-amber-700 dark:text-amber-300' 
                                : 'bg-peacock/20 text-peacock'
                            }`}>
                              {plan.badge}
                            </span>
                          </div>
                          <div className="font-display font-extrabold text-lg text-ink dark:text-white">
                            ₹{plan.amount.toLocaleString('en-IN')}
                            {plan.originalAmount > plan.amount && (
                              <s className="text-xs text-muted font-normal ml-1.5">
                                ₹{plan.originalAmount.toLocaleString('en-IN')}
                              </s>
                            )}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Student Details */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-muted mb-2.5">
                  2. Student Information
                </label>
                <div className="space-y-3">
                  <div>
                    <input
                      type="text"
                      placeholder="Full Name (e.g. Rahul Verma)"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      disabled={isLoading}
                      className={`w-full px-3.5 py-2.5 rounded-xl border text-sm bg-paper dark:bg-[#141B2D] focus:outline-none ${
                        errors.name ? 'border-red-500 ring-1 ring-red-500/20' : 'border-border-custom focus:border-peacock'
                      }`}
                    />
                    {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <input
                        type="email"
                        placeholder="Email ID (e.g. rahul@example.com)"
                        value={formData.email}
                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                        disabled={isLoading}
                        className={`w-full px-3.5 py-2.5 rounded-xl border text-sm bg-paper dark:bg-[#141B2D] focus:outline-none ${
                          errors.email ? 'border-red-500 ring-1 ring-red-500/20' : 'border-border-custom focus:border-peacock'
                        }`}
                      />
                      {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                    </div>

                    <div>
                      <input
                        type="tel"
                        placeholder="10-digit Mobile Number"
                        value={formData.phone}
                        onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                        disabled={isLoading}
                        className={`w-full px-3.5 py-2.5 rounded-xl border text-sm bg-paper dark:bg-[#141B2D] focus:outline-none ${
                          errors.phone ? 'border-red-500 ring-1 ring-red-500/20' : 'border-border-custom focus:border-peacock'
                        }`}
                      />
                      {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                    </div>
                  </div>
                </div>
              </div>

              {/* Error message banner */}
              {errorMessage && (
                <motion.div 
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 text-xs flex items-start gap-2.5"
                >
                  <AlertCircle className="w-4 h-4 flex-none mt-0.5" />
                  <div className="flex-1">
                    <strong className="block font-bold">Payment Error</strong>
                    <span>{errorMessage}</span>
                  </div>
                </motion.div>
              )}

              {/* Order Summary & Pay Button */}
              <div className="pt-2 border-t border-border-custom">
                <div className="flex items-center justify-between mb-3 text-sm">
                  <span className="text-muted">Total Payable Amount:</span>
                  <div className="text-right">
                    <span className="font-display text-2xl font-extrabold text-ink dark:text-white">
                      ₹{currentPlan.amount.toLocaleString('en-IN')}
                    </span>
                    <span className="text-[0.7rem] text-muted block">GST & Payment Gateway charges included</span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="btn btn-primary w-full py-4 text-center justify-center flex items-center gap-2.5 font-bold text-base shadow-lg cursor-pointer disabled:opacity-70"
                  id="razorpay-checkout-submit-btn"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Opening Razorpay Checkout...</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4" />
                      <span>Pay ₹{currentPlan.amount.toLocaleString('en-IN')} with Razorpay</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                <div className="mt-3 flex items-center justify-center gap-4 text-[0.75rem] text-muted">
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                    256-Bit SSL Encryption
                  </span>
                  <span>•</span>
                  <span>UPI, Cards, NetBanking, Wallets</span>
                  <span>•</span>
                  <span className="font-mono text-peacock font-semibold">Test Mode Active</span>
                </div>
              </div>
            </form>
          </div>
        </motion.div>
      </div>

      {/* Reusable Payment Success Feedback Modal */}
      <PaymentSuccessModal
        isOpen={isSuccessModalOpen}
        onClose={handleCloseAll}
        data={paymentSuccessData}
        onDone={handleCloseAll}
      />
    </>
  );
}

