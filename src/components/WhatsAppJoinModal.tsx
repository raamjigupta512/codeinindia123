import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Check, Copy, ExternalLink, QrCode, Smartphone, Monitor, ShieldCheck, Users, Sparkles } from 'lucide-react';
import QRCode from 'qrcode';
import { getWhatsappChannelUrl } from '../lib/whatsapp';

interface WhatsAppJoinModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  channelUrl?: string;
}

export default function WhatsAppJoinModal({
  isOpen,
  onClose,
  title = "Join CodeInIndia Official WhatsApp",
  subtitle = "Stay connected with batchmates, receive session links, and access live mentor support.",
  channelUrl
}: WhatsAppJoinModalProps) {
  const targetUrl = channelUrl || getWhatsappChannelUrl();
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [isGenerating, setIsGenerating] = useState(true);

  useEffect(() => {
    if (!isOpen) return;

    // Generate high-resolution QR code
    QRCode.toDataURL(targetUrl, {
      width: 320,
      margin: 2,
      color: {
        dark: '#0F172A',
        light: '#FFFFFF'
      },
      errorCorrectionLevel: 'M'
    })
      .then((url) => {
        setQrCodeDataUrl(url);
        setIsGenerating(false);
      })
      .catch((err) => {
        console.error("Failed to generate QR code", err);
        setIsGenerating(false);
      });
  }, [isOpen, targetUrl]);

  // Handle ESC key to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handleCopy = async () => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(targetUrl);
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = targetUrl;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        textArea.remove();
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error("Failed to copy URL:", err);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div 
          className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
          role="dialog"
          aria-modal="true"
          aria-labelledby="whatsapp-modal-title"
          id="whatsapp-join-modal-overlay"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/65 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.93, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 12 }}
            transition={{ type: "spring", damping: 26, stiffness: 340 }}
            className="relative w-full max-w-md bg-card dark:bg-[#0F172A] border border-border-custom dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden z-10 my-auto"
            id="whatsapp-join-modal-content"
          >
            {/* Header with gradient subtle bar */}
            <div className="h-1.5 w-full bg-gradient-to-r from-emerald-500 via-[#25D366] to-teal-400" />

            {/* Modal Body */}
            <div className="p-5 sm:p-6">
              {/* Close Button & Header Info */}
              <div className="flex items-start justify-between gap-3 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-[#25D366]/15 text-[#25D366] flex items-center justify-center flex-none border border-[#25D366]/30 shadow-inner">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 
                      id="whatsapp-modal-title" 
                      className="font-display font-extrabold text-base sm:text-lg text-ink dark:text-white leading-tight flex items-center gap-1.5"
                    >
                      <span>{title}</span>
                    </h3>
                    <div className="flex items-center gap-1.5 text-[0.72rem] text-emerald-600 dark:text-emerald-400 font-medium mt-0.5">
                      <span className="w-2 h-2 rounded-full bg-[#25D366] animate-pulse"></span>
                      <span>Official Channel • Instant Access</span>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={onClose}
                  className="w-8 h-8 rounded-full bg-paper/80 dark:bg-slate-800 hover:bg-paper dark:hover:bg-slate-700 text-muted hover:text-ink dark:hover:text-white flex items-center justify-center transition-colors cursor-pointer border border-border-custom dark:border-slate-700 flex-none"
                  aria-label="Close modal"
                  id="whatsapp-modal-close-btn"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <p className="text-xs text-muted leading-relaxed mb-5">
                {subtitle}
              </p>

              {/* Main Dual Action Container */}
              <div className="space-y-4">
                
                {/* 1. MOBILE QR CODE SCANNER SECTION */}
                <div className="p-4 rounded-2xl bg-paper/70 dark:bg-[#151E32] border border-border-custom dark:border-slate-800 text-center">
                  <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-ink dark:text-white mb-3">
                    <Smartphone className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span>Scan with Mobile Phone</span>
                  </div>

                  {/* QR Code Frame */}
                  <div className="relative inline-block p-3 bg-white rounded-2xl border-2 border-emerald-500/30 shadow-md">
                    {/* Corner Accent Brackets */}
                    <div className="absolute top-1.5 left-1.5 w-3 h-3 border-t-2 border-l-2 border-emerald-500 rounded-tl-sm pointer-events-none" />
                    <div className="absolute top-1.5 right-1.5 w-3 h-3 border-t-2 border-r-2 border-emerald-500 rounded-tr-sm pointer-events-none" />
                    <div className="absolute bottom-1.5 left-1.5 w-3 h-3 border-b-2 border-l-2 border-emerald-500 rounded-bl-sm pointer-events-none" />
                    <div className="absolute bottom-1.5 right-1.5 w-3 h-3 border-b-2 border-r-2 border-emerald-500 rounded-br-sm pointer-events-none" />

                    {isGenerating ? (
                      <div className="w-44 h-44 sm:w-48 sm:h-48 flex flex-col items-center justify-center gap-2 text-muted text-xs">
                        <QrCode className="w-8 h-8 animate-pulse text-emerald-500" />
                        <span>Generating QR...</span>
                      </div>
                    ) : (
                      <img 
                        src={qrCodeDataUrl} 
                        alt="WhatsApp Channel QR Code" 
                        className="w-44 h-44 sm:w-48 sm:h-48 rounded-lg select-none"
                      />
                    )}
                  </div>

                  <p className="text-[0.72rem] text-muted mt-2.5 flex items-center justify-center gap-1">
                    <Sparkles className="w-3 h-3 text-marigold" />
                    <span>Point your mobile camera or WhatsApp scanner to open</span>
                  </p>
                </div>

                {/* 2. DESKTOP DIRECT JOIN & COPY LINK SECTION */}
                <div className="space-y-2">
                  <div className="flex items-center gap-1 text-[0.75rem] font-bold text-ink dark:text-slate-200">
                    <Monitor className="w-3.5 h-3.5 text-peacock" />
                    <span>On Desktop or Browser?</span>
                  </div>

                  {/* Direct Join Link Button */}
                  <a
                    href={targetUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary w-full py-3.5 px-4 text-center justify-center flex items-center gap-2.5 text-white bg-[#25D366] hover:bg-[#20bd5a] shadow-md hover:shadow-emerald-500/20 cursor-pointer font-bold border-none text-sm rounded-xl transition-all"
                    id="whatsapp-direct-join-btn"
                  >
                    <span>Open WhatsApp Directly</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>

                  {/* Copy Link Input Bar */}
                  <div className="flex items-center gap-1.5 p-1.5 rounded-xl bg-paper dark:bg-[#151E32] border border-border-custom dark:border-slate-800">
                    <div className="flex-1 px-2.5 font-mono text-[0.72rem] text-muted truncate select-all">
                      {targetUrl}
                    </div>
                    <button
                      type="button"
                      onClick={handleCopy}
                      className={`py-1.5 px-3 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer flex-none ${
                        copied 
                          ? 'bg-emerald-500 text-white' 
                          : 'bg-card dark:bg-slate-800 hover:bg-peacock/10 text-ink dark:text-white border border-border-custom dark:border-slate-700'
                      }`}
                      id="whatsapp-copy-link-btn"
                    >
                      {copied ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy Link</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Verified Notice Footer */}
              <div className="mt-4 pt-3 border-t border-border-custom/50 dark:border-slate-800 flex items-center justify-between text-[0.7rem] text-muted">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Official Verified Channel</span>
                </span>
                <span className="font-mono">100% Free Access</span>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
