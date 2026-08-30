import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Award, 
  Sparkles, 
  CheckCircle2, 
  Download, 
  Share2, 
  ShieldCheck, 
  QrCode, 
  User, 
  FileText,
  Copy,
  Check
} from 'lucide-react';

export default function CertificatePreview() {
  const [studentName, setStudentName] = useState('Aarav Sharma');
  const [track, setTrack] = useState('Full-Stack Software Engineering');
  const [copied, setCopied] = useState(false);

  const certId = `CII-2026-${Math.abs(
    studentName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 108)
  ).toString().padStart(6, '0')}`;

  const currentDate = new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  const handlePrint = () => {
    window.print();
  };

  const handleCopyVerification = () => {
    const verifyUrl = `https://codeinindia.in/verify/${certId}`;
    navigator.clipboard.writeText(verifyUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="py-20 md:py-24 bg-card border-t border-border-custom relative overflow-hidden" id="certificate-preview">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="wrap relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="eyebrow-line">Verified Credentials</span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-extrabold text-ink dark:text-white mb-4 mt-1">
            Earn Your Verified Certificate
          </h2>
          <p className="text-muted text-sm md:text-base leading-relaxed">
            Type your name below to instantly generate a live preview of the verifiable credential you will receive upon completing CodeInIndia.
          </p>
        </div>

        {/* Input & Customization Panel */}
        <div className="max-w-xl mx-auto mb-10 bg-paper dark:bg-[#141B2D] border border-border-custom dark:border-[#222C44] rounded-2xl p-5 md:p-6 shadow-sm">
          <div className="space-y-4">
            <div>
              <label htmlFor="student-name-input" className="block text-xs font-mono font-bold uppercase text-muted dark:text-[#8A93B5] mb-2 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-peacock" />
                Enter Student Full Name:
              </label>
              <input
                id="student-name-input"
                type="text"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                placeholder="e.g. Aarav Sharma"
                maxLength={36}
                className="w-full bg-card dark:bg-[#1C263F] border border-border-custom dark:border-[#2E3C66] rounded-xl px-4 py-2.5 text-ink dark:text-white font-medium text-base focus:outline-none focus:border-peacock focus:ring-2 focus:ring-peacock/20 transition-all"
              />
            </div>

            <div>
              <label htmlFor="track-select" className="block text-xs font-mono font-bold uppercase text-muted dark:text-[#8A93B5] mb-2 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-marigold" />
                Specialization Track:
              </label>
              <select
                id="track-select"
                value={track}
                onChange={(e) => setTrack(e.target.value)}
                className="w-full bg-card dark:bg-[#1C263F] border border-border-custom dark:border-[#2E3C66] rounded-xl px-4 py-2.5 text-ink dark:text-white font-medium text-sm focus:outline-none focus:border-peacock focus:ring-2 focus:ring-peacock/20 transition-all cursor-pointer"
              >
                <option value="Full-Stack Software Engineering">Full-Stack Software Engineering</option>
                <option value="React & Node.js Production Systems">React & Node.js Production Systems</option>
                <option value="Sovereign AI App Development">Sovereign AI App Development</option>
              </select>
            </div>
          </div>
        </div>

        {/* Certificate Rendering Container */}
        <div className="max-w-4xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="print:shadow-none print:m-0 print:border-none print:p-0"
          >
            {/* Certificate Outer Frame with Gold Foil Styling */}
            <div className="bg-gradient-to-br from-amber-200 via-amber-400 to-amber-600 dark:from-amber-500/40 dark:via-amber-600/30 dark:to-amber-700/40 p-2.5 sm:p-4 rounded-3xl shadow-xl relative overflow-hidden select-none">
              
              {/* Inner White Parchment Paper Canvas */}
              <div className="bg-white dark:bg-[#0D121F] border-2 border-amber-300 dark:border-amber-500/40 rounded-2xl p-6 sm:p-10 md:p-12 text-center relative overflow-hidden text-slate-800 dark:text-slate-100">
                
                {/* Background Watermark Crest */}
                <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] dark:opacity-[0.04] pointer-events-none">
                  <Award className="w-96 h-96 text-amber-900 dark:text-amber-100" />
                </div>

                {/* Corner Ornamental Flourishes */}
                <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-amber-500/60" />
                <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-amber-500/60" />
                <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-amber-500/60" />
                <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-amber-500/60" />

                {/* Header Crest Logo */}
                <div className="flex flex-col items-center justify-center mb-4">
                  <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-600 dark:text-amber-400 mb-3 shadow-inner">
                    <Award className="w-8 h-8" />
                  </div>
                  <span className="font-mono text-xs font-extrabold uppercase tracking-[0.25em] text-amber-700 dark:text-amber-400">
                    CODE IN INDIA · ACADEMY
                  </span>
                </div>

                {/* Main Title */}
                <h3 className="font-display text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white uppercase mb-2">
                  Certificate of Completion
                </h3>
                <p className="font-mono text-[0.7rem] sm:text-xs text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-6">
                  VERIFIED CREDENTIAL OF TECHNICAL MASTERY
                </p>

                {/* Recipient Text */}
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-serif italic mb-2">
                  This official document certifies that
                </p>

                {/* Dynamic Student Name */}
                <div className="my-3 py-2 border-b-2 border-amber-400/40 max-w-md mx-auto">
                  <span className="font-serif text-2xl sm:text-4xl md:text-5xl font-bold text-slate-900 dark:text-amber-300 tracking-wide block capitalize min-h-[1.3em]">
                    {studentName.trim() || 'Your Name Here'}
                  </span>
                </div>

                {/* Course Completion Details */}
                <p className="max-w-xl mx-auto text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed my-5 font-sans">
                  has successfully completed <strong>4 weeks of intensive software engineering</strong>, demonstrating full-stack proficiency in <strong>{track}</strong>, React 19 architecture, Express backend design, and production deployment on Google Cloud.
                </p>

                {/* Credential ID & Date Bar */}
                <div className="flex flex-wrap items-center justify-center gap-4 my-6 py-2 px-4 bg-amber-500/5 dark:bg-amber-500/10 rounded-xl max-w-md mx-auto border border-amber-500/20 text-xs font-mono">
                  <span className="text-slate-600 dark:text-slate-300">
                    Issue Date: <strong className="text-slate-900 dark:text-white">{currentDate}</strong>
                  </span>
                  <span className="text-amber-600 dark:text-amber-400 font-bold">|</span>
                  <span className="text-slate-600 dark:text-slate-300">
                    Credential ID: <strong className="text-amber-700 dark:text-amber-300">{certId}</strong>
                  </span>
                </div>

                {/* Signatures & Seal Row */}
                <div className="grid grid-cols-2 sm:grid-cols-3 items-end gap-6 pt-6 border-t border-slate-200 dark:border-slate-800 max-w-2xl mx-auto mt-8">
                  {/* Instructor Signature */}
                  <div className="text-center">
                    <div className="font-serif italic text-lg sm:text-xl font-bold text-amber-800 dark:text-amber-300 mb-1 tracking-wider">
                      S. Mukherjee
                    </div>
                    <div className="h-0.5 w-24 bg-slate-300 dark:bg-slate-700 mx-auto mb-1" />
                    <span className="block font-mono text-[0.65rem] text-slate-500 dark:text-slate-400 uppercase font-semibold">
                      Lead Instructor
                    </span>
                  </div>

                  {/* Official Gold Seal Badge (Center on sm+) */}
                  <div className="col-span-2 sm:col-span-1 flex flex-col items-center justify-center order-first sm:order-none mb-4 sm:mb-0">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 p-1 shadow-md flex items-center justify-center text-white">
                      <div className="w-full h-full rounded-full border border-dashed border-white/80 flex flex-col items-center justify-center text-center p-1 bg-amber-600">
                        <ShieldCheck className="w-6 h-6 text-white mb-0.5" />
                        <span className="font-mono text-[0.5rem] font-bold tracking-tighter uppercase leading-none">
                          OFFICIAL
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Program Director Signature */}
                  <div className="text-center">
                    <div className="font-serif italic text-lg sm:text-xl font-bold text-amber-800 dark:text-amber-300 mb-1 tracking-wider">
                      A. Verma
                    </div>
                    <div className="h-0.5 w-24 bg-slate-300 dark:bg-slate-700 mx-auto mb-1" />
                    <span className="block font-mono text-[0.65rem] text-slate-500 dark:text-slate-400 uppercase font-semibold">
                      Program Director
                    </span>
                  </div>
                </div>

              </div>
            </div>
          </motion.div>

          {/* Action Bar: Download Print & Share */}
          <div className="mt-6 flex flex-wrap items-center justify-between gap-4 bg-paper dark:bg-[#141B2D] border border-border-custom dark:border-[#222C44] rounded-2xl p-4 sm:p-5">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-none" />
              <span className="text-xs sm:text-sm font-medium text-ink dark:text-white">
                Verifiable on <strong className="font-mono text-peacock">codeinindia.in/verify</strong> with unique hash.
              </span>
            </div>

            <div className="flex items-center gap-3 ml-auto">
              <button
                type="button"
                onClick={handleCopyVerification}
                className="btn btn-secondary text-xs font-mono font-semibold py-2 px-3.5 rounded-xl border border-border-custom flex items-center gap-1.5 cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-muted" />
                    <span>Copy Verification URL</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handlePrint}
                className="btn btn-primary text-xs font-mono font-bold py-2 px-4 rounded-xl flex items-center gap-1.5 shadow-sm cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Print / Save PDF</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
