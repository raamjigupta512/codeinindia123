import React, { useState, useEffect } from 'react';
import { Award, ShieldCheck, CheckCircle2, Calendar, BookOpen, User, ArrowLeft, Download, Sparkles } from 'lucide-react';
import { Certificate } from '../../types/admin';

interface PublicCertificateVerifyProps {
  certificateId?: string;
  onNavigateHome: () => void;
}

export const PublicCertificateVerify: React.FC<PublicCertificateVerifyProps> = ({
  certificateId = 'CERT-2026-8921',
  onNavigateHome
}) => {
  const [searchId, setSearchId] = useState(certificateId);
  const [certificate, setCertificate] = useState<Certificate | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const verifyCertificate = async (idToVerify: string) => {
    try {
      setIsLoading(true);
      setSearched(true);
      const res = await fetch(`/api/verify-certificate/${encodeURIComponent(idToVerify.trim())}`);
      const data = await res.json();
      if (data.success && data.certificate) {
        setCertificate(data.certificate);
      } else {
        setCertificate(null);
      }
    } catch (e) {
      console.error('Error verifying certificate:', e);
      setCertificate(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (certificateId) {
      verifyCertificate(certificateId);
    }
  }, [certificateId]);

  return (
    <div className="min-h-screen bg-[#070D0B] text-slate-100 p-4 sm:p-8 flex flex-col items-center justify-center relative overflow-hidden antialiased">
      
      {/* Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-2xl space-y-6 relative z-10">
        
        {/* Top Back Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={onNavigateHome}
            className="text-xs text-slate-400 hover:text-emerald-400 flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to CodeInIndia Home</span>
          </button>
          <span className="text-xs font-mono text-emerald-400 font-bold">CodeInIndia Credential Registry</span>
        </div>

        {/* Search Box */}
        <div className="bg-[#0B1614] border border-[#1B2F2A] rounded-2xl p-5 shadow-xl space-y-3">
          <h1 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
            <Award className="w-5 h-5 text-emerald-400" />
            <span>Verify Student Course Certificate</span>
          </h1>
          <p className="text-xs text-slate-400">
            Enter the unique Certificate ID to verify cryptographic authenticity and curriculum completion.
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
              placeholder="e.g. CERT-2026-8921"
              className="flex-1 bg-[#070D0B] border border-[#1B2F2A] rounded-xl px-4 py-2.5 text-xs text-emerald-300 font-mono focus:outline-none focus:border-emerald-500"
            />
            <button
              type="submit"
              disabled={isLoading}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 text-white text-xs font-bold transition-all shadow cursor-pointer disabled:opacity-50"
            >
              {isLoading ? 'Verifying...' : 'Verify'}
            </button>
          </form>
        </div>

        {/* Certificate Display Result */}
        {certificate ? (
          <div className="bg-[#0B1614] border-2 border-emerald-500/40 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-6 relative overflow-hidden">
            
            {/* Header Badge */}
            <div className="flex items-center justify-between border-b border-[#1B2F2A] pb-6">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-xs font-bold text-emerald-400 tracking-wider uppercase">Authentic & Verified</div>
                  <div className="text-xs text-slate-400">CodeInIndia Educational Trust</div>
                </div>
              </div>

              <div className="text-right font-mono">
                <span className="text-[10px] text-slate-400 block">Certificate ID</span>
                <span className="text-xs font-bold text-white">{certificate.id}</span>
              </div>
            </div>

            {/* Main Content */}
            <div className="text-center space-y-4 py-4">
              <div className="text-xs text-slate-400 uppercase tracking-widest">This certifies that</div>
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight bg-gradient-to-r from-white via-emerald-200 to-teal-200 bg-clip-text text-transparent">
                {certificate.studentName}
              </h2>
              <div className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
                has successfully completed all rigorous curriculum milestones, live coding assessments, and capstone projects for:
              </div>
              <div className="inline-block px-4 py-2 rounded-2xl bg-emerald-950/60 border border-emerald-500/40 text-sm font-bold text-emerald-300">
                {certificate.courseName}
              </div>
            </div>

            {/* Footer Metadata */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-6 border-t border-[#1B2F2A] text-xs">
              <div className="p-3 rounded-xl bg-[#0F1E1B]">
                <span className="text-slate-500 text-[10px] block">Enrollment ID</span>
                <span className="font-mono font-bold text-slate-200">{certificate.enrollmentId}</span>
              </div>
              <div className="p-3 rounded-xl bg-[#0F1E1B]">
                <span className="text-slate-500 text-[10px] block">Issued Date</span>
                <span className="font-bold text-slate-200">
                  {new Date(certificate.issueDate || certificate.issuedAt || Date.now()).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-[#0F1E1B] col-span-2 sm:col-span-1">
                <span className="text-slate-500 text-[10px] block">Verification Status</span>
                <span className="font-bold text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Permanent Record</span>
                </span>
              </div>
            </div>

          </div>
        ) : searched && !isLoading ? (
          <div className="bg-[#0B1614] border border-rose-600/40 rounded-2xl p-8 text-center space-y-2">
            <div className="text-rose-400 font-bold text-sm">Certificate Record Not Found</div>
            <p className="text-xs text-slate-400">
              No certificate with ID <strong>{searchId}</strong> was found in the official registry. Please check for typos.
            </p>
          </div>
        ) : null}

      </div>
    </div>
  );
};
