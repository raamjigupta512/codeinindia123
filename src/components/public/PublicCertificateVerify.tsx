import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Award, ShieldCheck, CheckCircle2, Calendar, BookOpen, User, ArrowLeft, Download, Sparkles, XCircle, MapPin, QrCode } from 'lucide-react';
import QRCode from 'qrcode';
import { Certificate } from '../../types/admin';
import ShareCertificateModal from '../ShareCertificateModal';

interface PublicCertificateVerifyProps {
  certificateId?: string;
  onNavigateHome: () => void;
}

export const PublicCertificateVerify: React.FC<PublicCertificateVerifyProps> = ({
  certificateId = 'CII-PART-2026-894210',
  onNavigateHome
}) => {
  const [searchId, setSearchId] = useState(certificateId);
  const [certificate, setCertificate] = useState<Certificate | null>(null);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [isRevoked, setIsRevoked] = useState(false);

  const verifyCertificate = async (idToVerify: string) => {
    try {
      setIsLoading(true);
      setSearched(true);
      const res = await fetch(`/api/verify-certificate/${encodeURIComponent(idToVerify.trim())}`);
      const data = await res.json();
      
      if (data.success && data.certificate) {
        setCertificate(data.certificate);
        setIsRevoked(data.revoked || data.certificate.status === 'REVOKED' || data.certificate.status === 'REJECTED');
        
        // Generate QR Code
        try {
          const qr = await QRCode.toDataURL(window.location.href, {
            width: 140,
            margin: 1,
            color: { dark: '#0F172A', light: '#FFFFFF' }
          });
          setQrCodeUrl(qr);
        } catch (e) {
          console.error(e);
        }
      } else {
        setCertificate(null);
        setIsRevoked(false);
      }
    } catch (e) {
      console.error('Error verifying certificate:', e);
      setCertificate(null);
      setIsRevoked(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (certificateId) {
      setSearchId(certificateId);
      verifyCertificate(certificateId);
    }
  }, [certificateId]);

  const isParticipation = certificate?.type === 'PARTICIPATION' || certificate?.id?.startsWith('CII-PART');

  return (
    <div className="min-h-screen bg-[#070D12] text-slate-100 p-4 sm:p-8 flex flex-col items-center justify-center relative overflow-hidden antialiased">
      
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-3xl space-y-6 relative z-10">
        
        {/* Top Back Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={onNavigateHome}
            className="text-xs text-slate-400 hover:text-blue-400 flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to CodeInIndia Home</span>
          </button>
          <span className="text-xs font-mono text-blue-400 font-bold">Official Credential Verification Registry</span>
        </div>

        {/* Search Box */}
        <div className="bg-[#0D1721] border border-[#1E2E3E] rounded-2xl p-5 shadow-xl space-y-3">
          <h1 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-400" />
            <span>Verify CodeInIndia Certificate</span>
          </h1>
          <p className="text-xs text-slate-400">
            Enter the unique Certificate ID to verify cryptographic authenticity, student name, and workshop or cohort credentials.
          </p>

          <form 
            onSubmit={(e) => {
              e.preventDefault();
              verifyCertificate(searchId);
            }} 
            className="flex gap-2 pt-2"
          >
            <input
              type="text"
              required
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              placeholder="e.g. CII-PART-2026-894210 or CERT-CI-2026-0001"
              className="flex-1 bg-[#080E14] border border-[#223548] rounded-xl px-4 py-2.5 text-xs text-amber-300 font-mono focus:outline-none focus:border-blue-500"
            />
            <button
              type="submit"
              disabled={isLoading}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold transition-all shadow cursor-pointer disabled:opacity-50"
            >
              {isLoading ? 'Verifying...' : 'Verify Certificate'}
            </button>
          </form>
        </div>

        {/* Certificate Display Result */}
        <AnimatePresence mode="wait">
          {certificate ? (
            <motion.div 
              key={certificate.id}
              initial={{ opacity: 0, y: 32, scale: 0.96 }}
              animate={{ 
                opacity: 1, 
                y: 0, 
                scale: 1,
                boxShadow: isRevoked 
                  ? [
                      "0 0 0px rgba(244, 63, 94, 0)",
                      "0 0 40px rgba(244, 63, 94, 0.4)",
                      "0 10px 25px rgba(244, 63, 94, 0.15)"
                    ]
                  : [
                      "0 0 0px rgba(245, 158, 11, 0)",
                      "0 0 50px rgba(245, 158, 11, 0.45)",
                      "0 15px 30px rgba(245, 158, 11, 0.2)"
                    ]
              }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 220, damping: 22 }}
              className={`bg-[#0D1721] border-2 ${isRevoked ? 'border-rose-500/50' : 'border-amber-500/50'} rounded-3xl p-6 sm:p-10 shadow-2xl space-y-6 relative overflow-hidden`}
            >
              {/* Shimmer sweep */}
              <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: '200%' }}
                transition={{ duration: 1.4, ease: 'easeInOut' }}
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12 pointer-events-none"
              />
              
              {/* Header Badge */}
              <div className="flex items-center justify-between border-b border-[#1E2E3E] pb-6">
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-2xl ${isRevoked ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'}`}>
                    {isRevoked ? <XCircle className="w-6 h-6" /> : <ShieldCheck className="w-6 h-6" />}
                  </div>
                  <div>
                    <div className={`text-xs font-bold tracking-wider uppercase ${isRevoked ? 'text-rose-400' : 'text-emerald-400'}`}>
                      {isRevoked ? 'REVOKED CREDENTIAL' : 'AUTHENTIC & VERIFIED CREDENTIAL ✓'}
                    </div>
                    <div className="text-xs text-slate-400">CodeInIndia National Tech Accreditation</div>
                  </div>
                </div>

                <div className="text-right font-mono">
                  <span className="text-[10px] text-slate-400 block">Certificate ID</span>
                  <span className="text-xs font-bold text-amber-400">{certificate.id}</span>
                </div>
              </div>

              {/* Main Content */}
              <div className="text-center space-y-4 py-4">
                <div className="text-xs text-slate-400 uppercase tracking-widest font-mono">
                  {isParticipation ? 'Certificate of Participation' : 'Certificate of Completion'}
                </div>
                <h2 className="text-2xl sm:text-4xl font-serif font-black text-white tracking-tight">
                  {certificate.participantName || certificate.studentName}
                </h2>
                <div className="text-xs text-slate-300 max-w-lg mx-auto leading-relaxed">
                  {isParticipation ? (
                    <>
                      for active participation and successful completion of the live hands-on engineering workshop:
                    </>
                  ) : (
                    <>
                      has successfully completed all curriculum milestones, live coding assessments, and capstone software projects for:
                    </>
                  )}
                </div>
                
                <div className="inline-block px-5 py-2.5 rounded-2xl bg-[#132230] border border-amber-500/30 text-sm sm:text-base font-bold text-amber-300">
                  {certificate.workshopName || certificate.courseName}
                </div>

                {certificate.city && (
                  <div className="text-xs text-slate-400 flex items-center justify-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-blue-400" />
                    <span>Location: <strong>{certificate.city}</strong></span>
                  </div>
                )}
              </div>

              {/* Footer Metadata */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-[#1E2E3E] text-xs">
                <div className="p-3 rounded-xl bg-[#080E14] border border-[#1E2E3E]">
                  <span className="text-slate-500 text-[10px] block">Credential Type</span>
                  <span className="font-mono font-bold text-slate-200">
                    {isParticipation ? 'Participation' : 'Full-Stack Completion'}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-[#080E14] border border-[#1E2E3E]">
                  <span className="text-slate-500 text-[10px] block">Workshop / Issue Date</span>
                  <span className="font-bold text-slate-200">
                    {certificate.workshopDate || new Date(certificate.issueDate || certificate.issuedAt || Date.now()).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-[#080E14] border border-[#1E2E3E]">
                  <span className="text-slate-500 text-[10px] block">Verification Status</span>
                  <span className={`font-bold flex items-center gap-1 ${isRevoked ? 'text-rose-400' : 'text-emerald-400'}`}>
                    {isRevoked ? <XCircle className="w-3.5 h-3.5" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                    <span>{isRevoked ? 'Revoked' : 'Active Record'}</span>
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-[#080E14] border border-[#1E2E3E] flex items-center justify-center">
                  {qrCodeUrl ? (
                    <img src={qrCodeUrl} alt="QR Code" className="w-12 h-12 rounded bg-white p-0.5" />
                  ) : (
                    <QrCode className="w-8 h-8 text-slate-500" />
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center gap-3 pt-4 border-t border-[#1E2E3E]">
                {!isRevoked && (
                  <ShareCertificateModal
                    certId={certificate.id}
                    recipientName={certificate.participantName || certificate.studentName || ''}
                    title={certificate.workshopName || certificate.courseName || 'Engineering Program'}
                    certType={isParticipation ? 'participation' : 'completion'}
                    buttonVariant="toolbar"
                  />
                )}

                <button
                  onClick={() => window.print()}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#162432] hover:bg-blue-600 text-slate-200 hover:text-white text-xs font-semibold transition-colors cursor-pointer border border-[#223548]"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Print / Save Summary</span>
                </button>
              </div>

            </motion.div>
          ) : searched && !isLoading ? (
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-[#0D1721] border border-rose-600/40 rounded-2xl p-8 text-center space-y-2"
            >
              <div className="text-rose-400 font-bold text-sm">Certificate Record Not Found</div>
              <p className="text-xs text-slate-400">
                No certificate with ID <strong>{searchId}</strong> was found in the official registry. Please check for typos.
              </p>
            </motion.div>
          ) : null}
        </AnimatePresence>

      </div>
    </div>
  );
};
