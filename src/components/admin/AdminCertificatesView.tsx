import React, { useState, useEffect } from 'react';
import { Award, ShieldCheck, Search, ExternalLink, RefreshCw, XCircle, CheckCircle2 } from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { Certificate } from '../../types/admin';

export const AdminCertificatesView: React.FC = () => {
  const { token, hasRole } = useAdminAuth();
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const fetchCertificates = async () => {
    if (!token) return;
    try {
      setIsLoading(true);
      const res = await fetch('/api/admin/certificates', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setCertificates(data.data || []);
      }
    } catch (e) {
      console.error('Error fetching certificates:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCertificates();
  }, [token]);

  const filteredCerts = certificates.filter(c => 
    c.studentName.toLowerCase().includes(search.toLowerCase()) ||
    c.id.toLowerCase().includes(search.toLowerCase()) ||
    c.enrollmentId.toLowerCase().includes(search.toLowerCase()) ||
    c.courseName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
            <span>Verified Credentials & Certificates Registry</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono font-bold">
              {certificates.length} Issued
            </span>
          </h2>
          <p className="text-xs text-slate-400">
            Tamper-proof completion certificates issued to paid students who completed 100% of curriculum milestones.
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="bg-[#0B1513] border border-[#1B2F2A] rounded-2xl p-4">
        <div className="relative max-w-md">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search certificate ID, student name, or enrollment ID..."
            className="w-full bg-[#070D0B] border border-[#1B2F2A] rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </div>
      </div>

      {/* Certificates Table */}
      <div className="bg-[#0B1513] border border-[#1B2F2A] rounded-2xl overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0E1B18] text-slate-400 font-semibold border-b border-[#1B2F2A]">
              <tr>
                <th className="py-3.5 px-4">Certificate ID</th>
                <th className="py-3.5 px-4">Student & Enrollment</th>
                <th className="py-3.5 px-4">Course Track</th>
                <th className="py-3.5 px-4">Issued Date</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Verification</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1B2F2A] text-slate-200">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500">
                    <RefreshCw className="w-5 h-5 animate-spin mx-auto text-emerald-400 mb-2" />
                    <span>Loading certificate records...</span>
                  </td>
                </tr>
              ) : filteredCerts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500">
                    No issued certificates match your search query.
                  </td>
                </tr>
              ) : (
                filteredCerts.map((cert) => (
                  <tr key={cert.id} className="hover:bg-[#0F1E1B] transition-colors">
                    
                    {/* ID */}
                    <td className="py-3.5 px-4 font-mono font-bold text-emerald-400">
                      <div className="flex items-center gap-1.5">
                        <Award className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>{cert.id}</span>
                      </div>
                    </td>

                    {/* Student */}
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-white">{cert.studentName}</div>
                      <div className="text-[11px] text-slate-400 font-mono">
                        Enrollment: {cert.enrollmentId}
                      </div>
                    </td>

                    {/* Course */}
                    <td className="py-3.5 px-4">
                      <div className="text-slate-300 font-medium">{cert.courseName}</div>
                      <div className="text-[10px] text-slate-500">Milestone Grade: 100% Complete</div>
                    </td>

                    {/* Date */}
                    <td className="py-3.5 px-4 text-slate-400">
                      {new Date(cert.issueDate || cert.issuedAt || Date.now()).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4">
                      {cert.status === 'VALID' || cert.status === 'ACTIVE' ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>VALID</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                          <XCircle className="w-3 h-3" />
                          <span>REVOKED</span>
                        </span>
                      )}
                    </td>

                    {/* Public Verify Link */}
                    <td className="py-3.5 px-4 text-right">
                      <a
                        href={cert.credentialUrl || cert.verificationUrl || `#verify/${cert.id}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#152522] hover:bg-emerald-600 hover:text-white text-slate-300 text-xs font-semibold transition-all"
                      >
                        <span>Verify Credential</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
