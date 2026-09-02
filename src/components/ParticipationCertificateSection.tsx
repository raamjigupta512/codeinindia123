import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Award, 
  CheckCircle2, 
  Download, 
  Mail, 
  Share2, 
  ShieldCheck, 
  Sparkles, 
  AlertCircle, 
  QrCode, 
  Copy, 
  Check, 
  RefreshCw, 
  Calendar, 
  MapPin, 
  Phone, 
  User, 
  ExternalLink,
  Printer
} from 'lucide-react';
import QRCode from 'qrcode';
import ShareCertificateModal from './ShareCertificateModal';

interface GeneratedCert {
  id: string;
  fullName: string;
  email: string;
  mobile: string;
  workshopName: string;
  workshopDate: string;
  city: string;
  issueDate: string;
  status: string;
  qrCodeUrl?: string;
}

const POPULAR_WORKSHOPS = [
  "Free Live AI Coding & App Building Masterclass",
  "1-Day Dynamic Website Workshop (5 Dynamic Websites)",
  "Weekend 2-Day Micro-SaaS Sprint",
  "Full-Stack AI Software Engineering Workshop",
  "Zero to Live App in 90 Minutes Masterclass",
  "AI Prompt Engineering & Autonomous Agents Workshop"
];

export default function ParticipationCertificateSection() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [workshopName, setWorkshopName] = useState(POPULAR_WORKSHOPS[0]);
  const [customWorkshop, setCustomWorkshop] = useState('');
  const [workshopDate, setWorkshopDate] = useState(() => {
    const today = new Date().toISOString().split('T')[0];
    return today;
  });
  const [city, setCity] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [sameAsMobile, setSameAsMobile] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  // Status state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [generatedCert, setGeneratedCert] = useState<GeneratedCert | null>(null);
  
  // Email sending state
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [emailSentSuccess, setEmailSentSuccess] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Quick Verification state on form
  const [verifyInputId, setVerifyInputId] = useState('');
  const [verifyResult, setVerifyResult] = useState<any>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifyError, setVerifyError] = useState<string | null>(null);

  const handleSameAsMobileChange = (checked: boolean) => {
    setSameAsMobile(checked);
    if (checked && mobile) {
      setWhatsappNumber(mobile);
    }
  };

  const handleMobileChange = (val: string) => {
    setMobile(val);
    if (sameAsMobile) {
      setWhatsappNumber(val);
    }
  };

  const effectiveWorkshop = workshopName === 'OTHER' ? customWorkshop : workshopName;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Validation
    if (!fullName.trim()) {
      setErrorMessage("Please enter your Full Name as it should appear on the certificate.");
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorMessage("Please enter a valid Email Address.");
      return;
    }
    if (!mobile.trim() || mobile.trim().length < 10) {
      setErrorMessage("Please enter a valid 10-digit Mobile Number.");
      return;
    }
    if (!effectiveWorkshop.trim()) {
      setErrorMessage("Please select or enter the Workshop Name.");
      return;
    }
    if (!workshopDate) {
      setErrorMessage("Please select the Workshop Date.");
      return;
    }
    if (!city.trim()) {
      setErrorMessage("Please enter your City.");
      return;
    }
    if (!whatsappNumber.trim()) {
      setErrorMessage("Please enter your WhatsApp Number.");
      return;
    }
    if (!confirmed) {
      setErrorMessage("Please confirm that the information provided is correct.");
      return;
    }

    try {
      setIsSubmitting(true);

      const res = await fetch('/api/certificates/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: fullName.trim(),
          email: email.trim().toLowerCase(),
          mobile: mobile.trim(),
          workshopName: effectiveWorkshop.trim(),
          workshopDate,
          city: city.trim(),
          whatsappNumber: whatsappNumber.trim(),
          confirmed
        })
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to generate certificate. Please try again.");
      }

      const cert = data.certificate;
      
      // Generate QR Code for the certificate verification URL
      const verifyUrl = `${window.location.origin}/#verify/${cert.id}`;
      let qrDataUrl = '';
      try {
        qrDataUrl = await QRCode.toDataURL(verifyUrl, {
          width: 160,
          margin: 1,
          color: { dark: '#0F172A', light: '#FFFFFF' }
        });
      } catch (qrErr) {
        console.error('QR code generation error:', qrErr);
      }

      setGeneratedCert({
        id: cert.id,
        fullName: cert.participantName || cert.studentName || fullName,
        email: cert.studentEmail || email,
        mobile: cert.mobile || mobile,
        workshopName: cert.workshopName || effectiveWorkshop,
        workshopDate: cert.workshopDate || workshopDate,
        city: cert.city || city,
        issueDate: cert.issueDate || new Date().toISOString(),
        status: cert.status || 'ACTIVE',
        qrCodeUrl: qrDataUrl
      });

    } catch (err: any) {
      console.error("Certificate generation error:", err);
      setErrorMessage(err.message || "An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSendEmail = async () => {
    if (!generatedCert) return;
    try {
      setIsSendingEmail(true);
      const res = await fetch(`/api/certificates/${generatedCert.id}/send-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: generatedCert.email })
      });
      const data = await res.json();
      if (data.success) {
        setEmailSentSuccess(true);
        setTimeout(() => setEmailSentSuccess(false), 5000);
      }
    } catch (e) {
      console.error("Error sending email:", e);
    } finally {
      setIsSendingEmail(false);
    }
  };

  const handlePrintCertificate = () => {
    window.print();
  };

  const handleCopyLink = () => {
    if (!generatedCert) return;
    const url = `${window.location.origin}/#verify/${generatedCert.id}`;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleQuickVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!verifyInputId.trim()) return;

    try {
      setIsVerifying(true);
      setVerifyError(null);
      setVerifyResult(null);

      const res = await fetch(`/api/public/verify-certificate/${encodeURIComponent(verifyInputId.trim())}`);
      const data = await res.json();

      if (!res.ok || !data.success) {
        setVerifyError(data.error || "Certificate not found. Please check the Certificate ID.");
      } else {
        setVerifyResult(data.certificate);
      }
    } catch (err) {
      setVerifyError("Failed to verify certificate. Please try again.");
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <section className="py-20 md:py-28 bg-[#090F14] text-white relative overflow-hidden border-t border-[#1C2C38]" id="certificates">
      {/* Decorative background gradients */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="wrap relative z-10 max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-mono font-bold uppercase tracking-wider mb-4">
            <Award className="w-3.5 h-3.5" />
            <span>Official Accreditation Registry</span>
          </div>

          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-4">
            🎓 Get Your CodeinIndia Participation Certificate
          </h2>

          <p className="text-slate-300 text-sm sm:text-base md:text-lg leading-relaxed">
            Attended our AI Workshop? Submit your details and get your official CodeinIndia Participation Certificate.
          </p>
        </div>

        {/* Dynamic State: Form OR Generated Certificate */}
        {!generatedCert ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Col: Request Form */}
            <div className="lg:col-span-7 bg-[#0E1720] border border-[#1E2E3E] rounded-3xl p-6 sm:p-8 shadow-2xl">
              <div className="flex items-center justify-between pb-6 mb-6 border-b border-[#1E2E3E]">
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span>Certificate Request Form</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Fill in your workshop details to issue your tamper-proof credential.
                  </p>
                </div>
                <span className="text-[11px] font-mono font-bold text-amber-400 bg-amber-400/10 px-2.5 py-1 rounded-lg border border-amber-400/20">
                  Instant Issuance
                </span>
              </div>

              {errorMessage && (
                <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                
                {/* Full Name */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Full Name <span className="text-amber-400">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Aarav Sharma"
                      className="w-full bg-[#080E14] border border-[#223548] focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-slate-500 transition-colors"
                      id="cert-form-fullname"
                    />
                  </div>
                  <span className="text-[10px] text-slate-500 mt-1 block">
                    This exact name will be engraved onto your official certificate.
                  </span>
                </div>

                {/* Email Address & Mobile Number in 2 Cols */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Email Address <span className="text-amber-400">*</span>
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="aarav@example.com"
                        className="w-full bg-[#080E14] border border-[#223548] focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-slate-500 transition-colors"
                        id="cert-form-email"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Mobile Number <span className="text-amber-400">*</span>
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="tel"
                        required
                        value={mobile}
                        onChange={(e) => handleMobileChange(e.target.value)}
                        placeholder="9876543210"
                        maxLength={15}
                        className="w-full bg-[#080E14] border border-[#223548] focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-slate-500 transition-colors"
                        id="cert-form-mobile"
                      />
                    </div>
                  </div>
                </div>

                {/* Workshop Name */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Workshop Name <span className="text-amber-400">*</span>
                  </label>
                  <select
                    value={workshopName}
                    onChange={(e) => setWorkshopName(e.target.value)}
                    className="w-full bg-[#080E14] border border-[#223548] focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-xl px-3.5 py-2.5 text-sm text-white transition-colors cursor-pointer"
                    id="cert-form-workshop"
                  >
                    {POPULAR_WORKSHOPS.map((w) => (
                      <option key={w} value={w}>{w}</option>
                    ))}
                    <option value="OTHER">Other Workshop (Specify Below)</option>
                  </select>

                  {workshopName === 'OTHER' && (
                    <input
                      type="text"
                      required
                      value={customWorkshop}
                      onChange={(e) => setCustomWorkshop(e.target.value)}
                      placeholder="Enter custom workshop title"
                      className="mt-2 w-full bg-[#080E14] border border-[#223548] focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-xl px-4 py-2 text-sm text-white placeholder:text-slate-500"
                    />
                  )}
                </div>

                {/* Workshop Date & City in 2 Cols */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Workshop Date <span className="text-amber-400">*</span>
                    </label>
                    <div className="relative">
                      <Calendar className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        type="date"
                        required
                        value={workshopDate}
                        onChange={(e) => setWorkshopDate(e.target.value)}
                        className="w-full bg-[#080E14] border border-[#223548] focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-slate-500 transition-colors"
                        id="cert-form-date"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      City <span className="text-amber-400">*</span>
                    </label>
                    <div className="relative">
                      <MapPin className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="e.g. Bengaluru / Delhi"
                        className="w-full bg-[#080E14] border border-[#223548] focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-slate-500 transition-colors"
                        id="cert-form-city"
                      />
                    </div>
                  </div>
                </div>

                {/* WhatsApp Number */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-semibold text-slate-300">
                      WhatsApp Number <span className="text-amber-400">*</span>
                    </label>
                    <label className="inline-flex items-center gap-1.5 text-[11px] text-blue-400 cursor-pointer hover:underline">
                      <input
                        type="checkbox"
                        checked={sameAsMobile}
                        onChange={(e) => handleSameAsMobileChange(e.target.checked)}
                        className="rounded border-slate-700 bg-slate-900 text-blue-500 focus:ring-0"
                      />
                      <span>Same as Mobile</span>
                    </label>
                  </div>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      required
                      value={whatsappNumber}
                      onChange={(e) => setWhatsappNumber(e.target.value)}
                      placeholder="9876543210"
                      maxLength={15}
                      className="w-full bg-[#080E14] border border-[#223548] focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-slate-500 transition-colors"
                      id="cert-form-whatsapp"
                    />
                  </div>
                </div>

                {/* Confirmation Checkbox */}
                <div className="pt-2">
                  <label className="flex items-start gap-3 p-3.5 rounded-xl bg-[#080E14] border border-[#223548] cursor-pointer hover:border-blue-500/50 transition-colors">
                    <input
                      type="checkbox"
                      required
                      checked={confirmed}
                      onChange={(e) => setConfirmed(e.target.checked)}
                      className="w-4 h-4 mt-0.5 rounded border-slate-700 bg-slate-900 text-blue-500 focus:ring-0 cursor-pointer"
                      id="cert-form-confirm-checkbox"
                    />
                    <span className="text-xs text-slate-300 font-medium leading-relaxed select-none">
                      I confirm that the information provided above is correct and matches my workshop registration.
                    </span>
                  </label>
                </div>

                {/* Primary CTA Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  id="cert-form-submit-btn"
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Generating Verified Certificate...</span>
                    </>
                  ) : (
                    <>
                      <span>🎓 Get My Participation Certificate</span>
                    </>
                  )}
                </button>

              </form>
            </div>

            {/* Right Col: Benefits & Live Verification Tool */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* Value Proposition Box */}
              <div className="bg-[#0E1720] border border-[#1E2E3E] rounded-3xl p-6 sm:p-7 shadow-xl">
                <h4 className="text-base font-bold text-white mb-3 flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-400" />
                  <span>Why CodeInIndia Credentials?</span>
                </h4>
                
                <ul className="space-y-3.5 text-xs text-slate-300">
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span><strong>Unique Cryptographic Hash:</strong> Each certificate receives a verifiable unique identifier stored on public ledger.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span><strong>LinkedIn & Resume Ready:</strong> Share your credentials with prospective recruiters, hackathons, and colleges.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span><strong>Free Instant Verification:</strong> Anyone can verify your certificate authenticity at codeinindia.in/verify.</span>
                  </li>
                </ul>
              </div>

              {/* Quick Verification Search Box */}
              <div className="bg-[#0E1720] border border-[#1E2E3E] rounded-3xl p-6 sm:p-7 shadow-xl">
                <h4 className="text-base font-bold text-white mb-2 flex items-center gap-2">
                  <QrCode className="w-5 h-5 text-blue-400" />
                  <span>Verify Existing Certificate</span>
                </h4>
                <p className="text-xs text-slate-400 mb-4">
                  Recruiters and institutions can verify any CodeInIndia certificate instantly.
                </p>

                <form onSubmit={handleQuickVerify} className="space-y-3">
                  <div className="relative">
                    <input
                      type="text"
                      value={verifyInputId}
                      onChange={(e) => setVerifyInputId(e.target.value)}
                      placeholder="e.g. CII-PART-2026-894210"
                      className="w-full bg-[#080E14] border border-[#223548] focus:border-blue-500 rounded-xl px-4 py-2.5 text-xs font-mono text-white placeholder:text-slate-500"
                      id="quick-verify-input"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isVerifying || !verifyInputId.trim()}
                    className="w-full py-2.5 px-4 rounded-xl bg-[#182635] hover:bg-blue-600 hover:text-white text-slate-200 text-xs font-bold transition-all cursor-pointer disabled:opacity-50"
                    id="quick-verify-btn"
                  >
                    {isVerifying ? 'Searching registry...' : 'Verify Certificate Now'}
                  </button>
                </form>

                {/* Verification Result Toast inside Box */}
                <AnimatePresence>
                  {verifyResult && (
                    <motion.div 
                      key={`verify-${verifyResult.id}`}
                      initial={{ opacity: 0, y: 15, scale: 0.96 }}
                      animate={{ 
                        opacity: 1, 
                        y: 0, 
                        scale: 1,
                        boxShadow: [
                          "0 0 0px rgba(16, 185, 129, 0)",
                          "0 0 25px rgba(16, 185, 129, 0.4)",
                          "0 0 10px rgba(16, 185, 129, 0.15)"
                        ]
                      }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.5, ease: "easeOut" }}
                      className="mt-4 p-4 rounded-2xl bg-emerald-500/10 border-2 border-emerald-500/40 text-xs relative overflow-hidden"
                    >
                      {/* Shimmer line */}
                      <motion.div
                        initial={{ x: '-100%' }}
                        animate={{ x: '200%' }}
                        transition={{ duration: 1, ease: 'easeInOut' }}
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-emerald-400/20 to-transparent skew-x-12 pointer-events-none"
                      />

                      <div className="flex items-center gap-2 text-emerald-400 font-bold mb-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>Certificate Verified ✓</span>
                      </div>
                      <div className="space-y-1 text-slate-300 font-mono text-[11px]">
                        <div><strong>Participant:</strong> {verifyResult.participantName || verifyResult.studentName}</div>
                        <div><strong>Workshop:</strong> {verifyResult.workshopName || verifyResult.courseName}</div>
                        <div><strong>Date:</strong> {verifyResult.workshopDate || verifyResult.issueDate?.split('T')[0]}</div>
                        <div><strong>Certificate ID:</strong> {verifyResult.id}</div>
                        <div><strong>Status:</strong> <span className="text-emerald-400 font-bold">{verifyResult.status}</span></div>
                      </div>
                      <a
                        href={`#verify/${verifyResult.id}`}
                        className="mt-3 inline-flex items-center gap-1 text-[11px] font-bold text-blue-400 hover:text-blue-300 hover:underline"
                      >
                        <span>View Full Public Credential</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </motion.div>
                  )}
                </AnimatePresence>

                {verifyError && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2"
                  >
                    <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                    <span>{verifyError}</span>
                  </motion.div>
                )}
              </div>

            </div>

          </div>
        ) : (
          /* SUCCESS STATE: Generated Certificate View with Slide-in & Glowing Aura */
          <motion.div
            key={generatedCert.id}
            initial={{ opacity: 0, y: 35 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="space-y-8"
          >
            {/* Success Banner */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1, duration: 0.4 }}
              className="p-4 sm:p-5 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-center max-w-3xl mx-auto shadow-lg"
            >
              <div className="flex items-center justify-center gap-2 text-emerald-300 font-bold text-base sm:text-lg mb-1">
                <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                <span>Congratulations! Your participation certificate has been generated successfully.</span>
              </div>
              <p className="text-xs text-emerald-200/80">
                Official Credential ID: <strong className="font-mono text-white">{generatedCert.id}</strong> · Ready for Download & Verification.
              </p>
            </motion.div>

            {/* Certificate Frame Display with Slide-in and Animated Glow */}
            <div className="max-w-4xl mx-auto relative">
              
              {/* Golden Ambient Glowing Halo */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ 
                  opacity: [0.7, 1, 0.6, 0.8],
                  scale: [0.98, 1.02, 1, 1.01]
                }}
                transition={{ duration: 2, ease: "easeInOut" }}
                className="absolute -inset-3 bg-gradient-to-r from-amber-400/40 via-amber-500/50 to-amber-300/40 rounded-[2.5rem] blur-xl pointer-events-none z-0"
              />

              {/* Outer Navy/Gold Border */}
              <motion.div 
                id="certificate-print-area"
                initial={{ opacity: 0, y: 40, scale: 0.94 }}
                animate={{ 
                  opacity: 1, 
                  y: 0, 
                  scale: 1,
                  boxShadow: [
                    "0 10px 30px -10px rgba(245, 158, 11, 0.2)",
                    "0 0 55px 10px rgba(245, 158, 11, 0.5)",
                    "0 15px 35px -5px rgba(245, 158, 11, 0.3)"
                  ]
                }}
                transition={{ 
                  type: 'spring',
                  stiffness: 200,
                  damping: 22,
                  delay: 0.15
                }}
                className="bg-gradient-to-br from-amber-300 via-amber-500 to-amber-700 p-3 sm:p-5 rounded-3xl shadow-2xl relative overflow-hidden z-10"
              >
                {/* Light shimmer sweep animation */}
                <motion.div
                  initial={{ x: '-100%' }}
                  animate={{ x: '200%' }}
                  transition={{ duration: 1.4, ease: "easeInOut", delay: 0.3 }}
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12 pointer-events-none z-20"
                />

                {/* Inner White/Parchment Card */}
                <div className="bg-white text-slate-900 border-2 border-amber-300 rounded-2xl p-6 sm:p-10 md:p-12 text-center relative overflow-hidden shadow-inner">
                  
                  {/* Subtle Background Watermark Logo */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-[0.04] pointer-events-none">
                    <Award className="w-96 h-96 text-amber-900" />
                  </div>

                  {/* Corner Ornaments */}
                  <div className="absolute top-4 left-4 w-10 h-10 border-t-2 border-l-2 border-amber-500" />
                  <div className="absolute top-4 right-4 w-10 h-10 border-t-2 border-r-2 border-amber-500" />
                  <div className="absolute bottom-4 left-4 w-10 h-10 border-b-2 border-l-2 border-amber-500" />
                  <div className="absolute bottom-4 right-4 w-10 h-10 border-b-2 border-r-2 border-amber-500" />

                  {/* Top Header Logo */}
                  <div className="flex flex-col items-center justify-center mb-4">
                    <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-600 mb-2 shadow-sm">
                      <Award className="w-8 h-8" />
                    </div>
                    <div className="font-display font-extrabold text-xl tracking-tight text-slate-900">
                      Code<span className="text-amber-600">In</span>India
                    </div>
                    <span className="font-mono text-[10px] font-extrabold uppercase tracking-[0.25em] text-amber-800 mt-0.5">
                      NATIONAL AI EDUCATION INITIATIVE
                    </span>
                  </div>

                  {/* Certificate Title */}
                  <h3 className="font-display text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-950 uppercase mt-2 mb-1">
                    Certificate of Participation
                  </h3>
                  <p className="font-mono text-xs text-amber-800 uppercase tracking-widest font-semibold mb-5">
                    OFFICIAL WORKSHOP ACCREDITATION
                  </p>

                  <p className="text-sm font-serif italic text-slate-600 mb-2">
                    This is proudly presented to
                  </p>

                  {/* Participant Full Name */}
                  <div className="my-2 py-1 border-b-2 border-amber-400 max-w-lg mx-auto">
                    <span className="font-serif text-3xl sm:text-5xl font-bold text-slate-900 tracking-wide block capitalize min-h-[1.2em]">
                      {generatedCert.fullName}
                    </span>
                  </div>

                  {/* Workshop Details Paragraph */}
                  <p className="max-w-2xl mx-auto text-xs sm:text-sm text-slate-700 leading-relaxed my-5 font-sans">
                    for active participation and successful completion of the live hands-on engineering workshop on{' '}
                    <strong className="text-slate-950 font-bold">"{generatedCert.workshopName}"</strong> held on{' '}
                    <strong className="text-slate-950 font-bold">{new Date(generatedCert.workshopDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</strong> in{' '}
                    <strong className="text-slate-950 font-bold">{generatedCert.city}</strong>.
                  </p>

                  {/* ID & Date Bar */}
                  <div className="flex flex-wrap items-center justify-center gap-4 my-5 py-2 px-5 bg-amber-50 rounded-xl max-w-md mx-auto border border-amber-200 text-xs font-mono text-slate-700">
                    <span>Date: <strong className="text-slate-900">{new Date(generatedCert.issueDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}</strong></span>
                    <span className="text-amber-500 font-bold">|</span>
                    <span>Certificate ID: <strong className="text-amber-800 font-bold">{generatedCert.id}</strong></span>
                  </div>

                  {/* Footer Signatures and QR Code */}
                  <div className="grid grid-cols-3 items-end gap-4 pt-6 border-t border-slate-200 max-w-2xl mx-auto mt-6">
                    
                    {/* Founder / Mentor Signature */}
                    <div className="text-center">
                      <div className="font-serif italic text-lg sm:text-xl font-bold text-amber-900 mb-1">
                        Harsh Vardhan
                      </div>
                      <div className="h-0.5 w-24 bg-slate-400 mx-auto mb-1" />
                      <span className="block font-mono text-[10px] text-slate-600 uppercase font-semibold">
                        Lead Mentor & Founder
                      </span>
                    </div>

                    {/* Center Seal / QR Code */}
                    <div className="flex flex-col items-center justify-center">
                      {generatedCert.qrCodeUrl ? (
                        <div className="p-1 bg-white border border-slate-300 rounded-lg shadow-sm">
                          <img 
                            src={generatedCert.qrCodeUrl} 
                            alt="Certificate Verification QR Code" 
                            className="w-16 h-16"
                          />
                        </div>
                      ) : (
                        <div className="w-16 h-16 rounded-full bg-amber-600 flex items-center justify-center text-white shadow-md">
                          <ShieldCheck className="w-8 h-8" />
                        </div>
                      )}
                      <span className="font-mono text-[9px] text-slate-500 mt-1 uppercase font-bold tracking-tight">
                        Scan to Verify
                      </span>
                    </div>

                    {/* Program Director Signature */}
                    <div className="text-center">
                      <div className="font-serif italic text-lg sm:text-xl font-bold text-amber-900 mb-1">
                        S. Mukherjee
                      </div>
                      <div className="h-0.5 w-24 bg-slate-400 mx-auto mb-1" />
                      <span className="block font-mono text-[10px] text-slate-600 uppercase font-semibold">
                        Academic Director
                      </span>
                    </div>

                  </div>

                </div>
              </motion.div>
            </div>

            {/* Action Buttons Toolbar */}
            <div className="max-w-4xl mx-auto bg-[#0E1720] border border-[#1E2E3E] rounded-2xl p-5 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-none" />
                <span className="text-xs sm:text-sm text-slate-300">
                  Credential permanently registered on <strong className="text-blue-400 font-mono">codeinindia.in/verify/{generatedCert.id}</strong>
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                
                {/* Social Share Modal Button (LinkedIn, Twitter, WhatsApp) */}
                <ShareCertificateModal
                  certId={generatedCert.id}
                  recipientName={generatedCert.fullName}
                  title={generatedCert.workshopName}
                  certType="participation"
                  buttonVariant="toolbar"
                />

                {/* Copy Link Button */}
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="py-2.5 px-4 rounded-xl bg-[#16222F] hover:bg-[#1E2E3E] text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer border border-[#223548]"
                  id="cert-copy-link-btn"
                >
                  {copiedLink ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Copied URL!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-slate-400" />
                      <span>Copy Verification Link</span>
                    </>
                  )}
                </button>

                {/* Send to Email Button */}
                <button
                  type="button"
                  onClick={handleSendEmail}
                  disabled={isSendingEmail}
                  className="py-2.5 px-4 rounded-xl bg-[#16222F] hover:bg-blue-600 hover:text-white text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer border border-[#223548] disabled:opacity-50"
                  id="cert-send-email-btn"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>{isSendingEmail ? 'Dispatching...' : emailSentSuccess ? 'Email Dispatched ✓' : 'Send Certificate to Email'}</span>
                </button>

                {/* Download / Print Certificate Button */}
                <button
                  type="button"
                  onClick={handlePrintCertificate}
                  className="py-2.5 px-5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold flex items-center gap-2 shadow-md transition-all cursor-pointer"
                  id="cert-download-btn"
                >
                  <Download className="w-4 h-4" />
                  <span>Download / Print Certificate</span>
                </button>

                {/* Request Another */}
                <button
                  type="button"
                  onClick={() => {
                    setGeneratedCert(null);
                    setFullName('');
                  }}
                  className="text-xs text-slate-400 hover:text-white underline pl-2"
                >
                  Request Another
                </button>

              </div>
            </div>

          </motion.div>
        )}

      </div>
    </section>
  );
}
