import React, { useState, useEffect } from 'react';
import { 
  AlertTriangle, 
  ShieldAlert, 
  Trash2, 
  RotateCcw, 
  X, 
  CheckCircle2, 
  AlertCircle,
  HelpCircle,
  Lock,
  ArrowRight
} from 'lucide-react';

export type ConfirmationVariant = 'danger' | 'warning' | 'info';

export interface ItemDetail {
  label: string;
  value: string | React.ReactNode;
}

export interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (data?: { reason?: string }) => void | Promise<void>;
  title: string;
  description: string | React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  variant?: ConfirmationVariant;
  icon?: 'trash' | 'refund' | 'alert' | 'warning' | 'revoke' | 'lock';
  isLoading?: boolean;
  loadingText?: string;
  requireTypedConfirmation?: string;
  requireReason?: boolean;
  reasonLabel?: string;
  reasonPlaceholder?: string;
  consequences?: string[];
  itemDetails?: ItemDetail[];
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = 'Confirm Action',
  cancelText = 'Cancel',
  variant = 'danger',
  icon,
  isLoading = false,
  loadingText = 'Processing...',
  requireTypedConfirmation,
  requireReason = false,
  reasonLabel = 'Reason for this action (Required)',
  reasonPlaceholder = 'Please explain the reason for auditing and compliance...',
  consequences = [],
  itemDetails = []
}) => {
  const [typedInput, setTypedInput] = useState('');
  const [reasonInput, setReasonInput] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Reset form inputs whenever modal opens or closes
  useEffect(() => {
    if (isOpen) {
      setTypedInput('');
      setReasonInput('');
      setErrorMsg(null);
    }
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen && !isLoading) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isLoading, onClose]);

  if (!isOpen) return null;

  const isTypeCheckPassed = !requireTypedConfirmation || 
    typedInput.trim().toUpperCase() === requireTypedConfirmation.trim().toUpperCase();

  const isReasonPassed = !requireReason || reasonInput.trim().length >= 3;

  const isSubmitDisabled = isLoading || !isTypeCheckPassed || !isReasonPassed;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (requireTypedConfirmation && !isTypeCheckPassed) {
      setErrorMsg(`Please type "${requireTypedConfirmation}" to confirm`);
      return;
    }
    if (requireReason && !isReasonPassed) {
      setErrorMsg('Please provide a valid reason (at least 3 characters)');
      return;
    }

    try {
      setErrorMsg(null);
      await onConfirm({ reason: reasonInput.trim() });
    } catch (err: any) {
      setErrorMsg(err?.message || 'An error occurred while executing this action.');
    }
  };

  // Color schemas based on variant
  const getThemeStyles = () => {
    switch (variant) {
      case 'danger':
        return {
          border: 'border-rose-500/40',
          headerBg: 'bg-rose-950/40',
          iconBg: 'bg-rose-500/20 text-rose-400 border-rose-500/30',
          confirmBtn: 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-900/30',
          accentText: 'text-rose-400',
          bulletColor: 'bg-rose-400',
          focusRing: 'focus:border-rose-500 focus:ring-rose-500/20'
        };
      case 'warning':
        return {
          border: 'border-amber-500/40',
          headerBg: 'bg-amber-950/40',
          iconBg: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
          confirmBtn: 'bg-amber-600 hover:bg-amber-500 text-white shadow-amber-900/30',
          accentText: 'text-amber-400',
          bulletColor: 'bg-amber-400',
          focusRing: 'focus:border-amber-500 focus:ring-amber-500/20'
        };
      case 'info':
      default:
        return {
          border: 'border-emerald-500/40',
          headerBg: 'bg-emerald-950/40',
          iconBg: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
          confirmBtn: 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-900/30',
          accentText: 'text-emerald-400',
          bulletColor: 'bg-emerald-400',
          focusRing: 'focus:border-emerald-500 focus:ring-emerald-500/20'
        };
    }
  };

  const theme = getThemeStyles();

  const renderIcon = () => {
    if (icon === 'trash') return <Trash2 className="w-5 h-5" />;
    if (icon === 'refund') return <RotateCcw className="w-5 h-5" />;
    if (icon === 'revoke') return <ShieldAlert className="w-5 h-5" />;
    if (icon === 'lock') return <Lock className="w-5 h-5" />;
    if (icon === 'warning') return <AlertTriangle className="w-5 h-5" />;
    if (variant === 'danger') return <ShieldAlert className="w-5 h-5" />;
    if (variant === 'warning') return <AlertTriangle className="w-5 h-5" />;
    return <AlertCircle className="w-5 h-5" />;
  };

  return (
    <div 
      id="confirmation-modal-backdrop"
      className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isLoading) onClose();
      }}
    >
      <div 
        id="confirmation-modal-container"
        className={`bg-[#0B1513] border ${theme.border} rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col my-auto transition-all`}
      >
        {/* Header */}
        <div className={`p-5 ${theme.headerBg} border-b border-[#1B2F2A] flex items-start justify-between gap-3`}>
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl border ${theme.iconBg} shrink-0`}>
              {renderIcon()}
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">{title}</h3>
              <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400">
                High-Stakes Admin Authorization Required
              </span>
            </div>
          </div>
          <button
            id="close-confirmation-modal-btn"
            type="button"
            disabled={isLoading}
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-[#152522] transition-colors disabled:opacity-50 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          
          {/* Main Description */}
          <div className="text-slate-300 leading-relaxed text-sm">
            {description}
          </div>

          {/* Item details if present */}
          {itemDetails.length > 0 && (
            <div className="p-3.5 rounded-xl bg-[#070D0B] border border-[#1B2F2A] space-y-2">
              <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold mb-1">
                Target Record Overview
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {itemDetails.map((item, idx) => (
                  <div key={idx} className="flex flex-col">
                    <span className="text-slate-500 text-[11px]">{item.label}</span>
                    <span className="text-slate-200 font-semibold truncate">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Consequences / Risk List */}
          {consequences.length > 0 && (
            <div className="p-3.5 rounded-xl bg-[#140B0E] border border-rose-950 text-slate-300 space-y-2">
              <div className="text-[11px] font-bold text-rose-400 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                <span>Immediate Effects & Consequences</span>
              </div>
              <ul className="space-y-1.5 text-xs text-slate-300 pl-1">
                {consequences.map((c, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className={`w-1.5 h-1.5 rounded-full ${theme.bulletColor} mt-1.5 shrink-0`} />
                    <span>{c}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Mandatory Reason Input */}
          {requireReason && (
            <div className="space-y-1.5 pt-1">
              <label htmlFor="confirmation-reason-input" className="block font-semibold text-slate-300 text-xs flex items-center justify-between">
                <span>{reasonLabel}</span>
                <span className="text-[10px] text-amber-400 font-normal">Audit Logged</span>
              </label>
              <textarea
                id="confirmation-reason-input"
                rows={2}
                value={reasonInput}
                onChange={(e) => setReasonInput(e.target.value)}
                placeholder={reasonPlaceholder}
                disabled={isLoading}
                required
                className="w-full bg-[#070D0B] border border-[#1B2F2A] rounded-xl p-3 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-rose-500 disabled:opacity-50"
              />
            </div>
          )}

          {/* Typed Confirmation Safeguard */}
          {requireTypedConfirmation && (
            <div className="p-3.5 rounded-xl bg-[#0F1E1B] border border-[#1B2F2A] space-y-2">
              <label htmlFor="confirmation-type-check-input" className="block text-xs font-semibold text-slate-300">
                To confirm, type <strong className="text-white font-mono bg-[#070D0B] px-1.5 py-0.5 rounded border border-[#1B2F2A]">{requireTypedConfirmation}</strong> below:
              </label>
              <input
                id="confirmation-type-check-input"
                type="text"
                value={typedInput}
                onChange={(e) => setTypedInput(e.target.value)}
                placeholder={requireTypedConfirmation}
                disabled={isLoading}
                className="w-full bg-[#070D0B] border border-[#1B2F2A] rounded-xl px-3 py-2 text-xs font-mono text-white placeholder:text-slate-600 focus:outline-none focus:border-rose-500 disabled:opacity-50"
              />
            </div>
          )}

          {/* Error Message */}
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#1B2F2A]">
            <button
              id="cancel-confirmation-btn"
              type="button"
              disabled={isLoading}
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-[#152522] hover:bg-[#1C322E] text-slate-300 text-xs font-semibold transition-colors cursor-pointer disabled:opacity-50"
            >
              {cancelText}
            </button>
            <button
              id="confirm-high-stakes-action-btn"
              type="submit"
              disabled={isSubmitDisabled}
              className={`px-5 py-2.5 rounded-xl ${theme.confirmBtn} text-xs font-bold transition-all shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed`}
            >
              {isLoading ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>{loadingText}</span>
                </>
              ) : (
                <>
                  <span>{confirmText}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
