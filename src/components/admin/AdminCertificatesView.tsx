import React, { useState, useEffect } from 'react';
import { 
  Award, 
  ShieldCheck, 
  Search, 
  ExternalLink, 
  RefreshCw, 
  XCircle, 
  CheckCircle2, 
  Mail, 
  Plus, 
  Filter, 
  Download, 
  AlertCircle, 
  Trash2, 
  Clock, 
  Check, 
  Eye, 
  X,
  FileCheck,
  Building
} from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { Certificate, ParticipationCertificateRequest } from '../../types/admin';

export const AdminCertificatesView: React.FC = () => {
  const { token, hasRole } = useAdminAuth();
  const [activeTab, setActiveTab] = useState<'REQUESTS' | 'CERTIFICATES' | 'MANUAL_ISSUE'>('REQUESTS');
  
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [requests, setRequests] = useState<ParticipationCertificateRequest[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [isLoading, setIsLoading] = useState(true);
  const [actionSuccessMessage, setActionSuccessMessage] = useState<string | null>(null);
  const [actionErrorMessage, setActionErrorMessage] = useState<string | null>(null);

  // Rejection modal state
  const [rejectingRequestId, setRejectingRequestId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('Attendance not verified during live workshop.');

  // Revocation modal state
  const [revokingCertId, setRevokingCertId] = useState<string | null>(null);
  const [revokeReason, setRevokeReason] = useState('Duplicate entry or revoked by administrator.');

  // Manual Generation form state
  const [manualName, setManualName] = useState('');
  const [manualEmail, setManualEmail] = useState('');
  const [manualMobile, setManualMobile] = useState('');
  const [manualWorkshop, setManualWorkshop] = useState('Free Live AI Coding & App Building Masterclass');
  const [manualDate, setManualDate] = useState(new Date().toISOString().split('T')[0]);
  const [manualCity, setManualCity] = useState('Online');
  const [isGeneratingManual, setIsGeneratingManual] = useState(false);

  // Preview Modal
  const [previewCert, setPreviewCert] = useState<Certificate | null>(null);

  const fetchAllData = async () => {
    if (!token) return;
    try {
      setIsLoading(true);
      const [certRes, reqRes] = await Promise.all([
        fetch('/api/admin/certificates', { headers: { Authorization: `Bearer ${token}` } }),
        fetch('/api/admin/certificates/requests', { headers: { Authorization: `Bearer ${token}` } })
      ]);

      const certData = await certRes.json();
      const reqData = await reqRes.json();

      if (certData.success) {
        setCertificates(certData.data || []);
      }
      if (reqData.success) {
        setRequests(reqData.data || []);
      }
    } catch (e) {
      console.error('Error fetching certificate data:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, [token]);

  const showToast = (msg: string, isError = false) => {
    if (isError) {
      setActionErrorMessage(msg);
      setTimeout(() => setActionErrorMessage(null), 4000);
    } else {
      setActionSuccessMessage(msg);
      setTimeout(() => setActionSuccessMessage(null), 4000);
    }
  };

  const handleApproveRequest = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/certificates/requests/${id}/approve`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (data.success) {
        showToast(`Request ${id} approved successfully!`);
        fetchAllData();
      } else {
        showToast(data.error || 'Failed to approve request', true);
      }
    } catch (err: any) {
      showToast(err.message, true);
    }
  };

  const handleRejectRequest = async () => {
    if (!rejectingRequestId) return;
    try {
      const res = await fetch(`/api/admin/certificates/requests/${rejectingRequestId}/reject`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ reason: rejectReason })
      });
      const data = await res.json();
      if (data.success) {
        showToast(`Request ${rejectingRequestId} rejected.`);
        setRejectingRequestId(null);
        fetchAllData();
      } else {
        showToast(data.error || 'Failed to reject request', true);
      }
    } catch (err: any) {
      showToast(err.message, true);
    }
  };

  const handleRevokeCertificate = async () => {
    if (!revokingCertId) return;
    try {
      const res = await fetch(`/api/admin/certificates/${revokingCertId}/revoke`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ reason: revokeReason })
      });
      const data = await res.json();
      if (data.success) {
        showToast(`Certificate ${revokingCertId} revoked successfully.`);
        setRevokingCertId(null);
        fetchAllData();
      } else {
        showToast(data.error || 'Failed to revoke certificate', true);
      }
    } catch (err: any) {
      showToast(err.message, true);
    }
  };

  const handleResendEmail = async (certId: string) => {
    try {
      const res = await fetch(`/api/admin/certificates/${certId}/resend-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (data.success) {
        showToast(`Certificate email resent successfully for ${certId}`);
        fetchAllData();
      } else {
        showToast(data.error || 'Failed to resend email', true);
      }
    } catch (err: any) {
      showToast(err.message, true);
    }
  };

  const handleManualGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualName || !manualEmail) {
      showToast("Name and Email are required", true);
      return;
    }

    try {
      setIsGeneratingManual(true);
      const res = await fetch('/api/admin/certificates/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          fullName: manualName,
          email: manualEmail,
          mobile: manualMobile || '9999999999',
          workshopName: manualWorkshop,
          workshopDate: manualDate,
          city: manualCity
        })
      });

      const data = await res.json();
      if (data.success) {
        showToast(`Certificate ${data.certificate.id} generated successfully!`);
        setManualName('');
        setManualEmail('');
        setManualMobile('');
        setActiveTab('CERTIFICATES');
        fetchAllData();
      } else {
        showToast(data.error || 'Failed to generate certificate', true);
      }
    } catch (err: any) {
      showToast(err.message, true);
    } finally {
      setIsGeneratingManual(false);
    }
  };

  // Filtered lists
  const filteredRequests = requests.filter(r => {
    const matchesSearch = 
      r.fullName.toLowerCase().includes(search.toLowerCase()) ||
      r.email.toLowerCase().includes(search.toLowerCase()) ||
      r.mobile.includes(search) ||
      r.certificateId.toLowerCase().includes(search.toLowerCase()) ||
      r.workshopName.toLowerCase().includes(search.toLowerCase());
    
    const matchesStatus = statusFilter === 'ALL' || r.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const filteredCerts = certificates.filter(c => {
    const matchesSearch = 
      (c.participantName || c.studentName || '').toLowerCase().includes(search.toLowerCase()) ||
      c.id.toLowerCase().includes(search.toLowerCase()) ||
      (c.studentEmail || '').toLowerCase().includes(search.toLowerCase()) ||
      (c.workshopName || c.courseName || '').toLowerCase().includes(search.toLowerCase()) ||
      (c.enrollmentId || '').toLowerCase().includes(search.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || c.status === statusFilter;
    const matchesType = typeFilter === 'ALL' || c.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  return (
    <div className="space-y-6">
      
      {/* Toast Notifications */}
      {actionSuccessMessage && (
        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{actionSuccessMessage}</span>
          </div>
          <button onClick={() => setActionSuccessMessage(null)} className="text-emerald-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {actionErrorMessage && (
        <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{actionErrorMessage}</span>
          </div>
          <button onClick={() => setActionErrorMessage(null)} className="text-rose-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header & Metric Badges */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Award className="w-6 h-6 text-amber-400" />
            <span>Certificates & Accreditation Management</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Oversee workshop participation requests, verify submissions, and manage official certificate registry.
          </p>
        </div>

        {/* Action Tabs */}
        <div className="flex items-center gap-2 bg-[#0B1513] p-1 rounded-xl border border-[#1B2F2A]">
          <button
            onClick={() => setActiveTab('REQUESTS')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'REQUESTS' 
                ? 'bg-emerald-600 text-white shadow' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Requests ({requests.length})
          </button>
          <button
            onClick={() => setActiveTab('CERTIFICATES')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'CERTIFICATES' 
                ? 'bg-emerald-600 text-white shadow' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            All Certificates ({certificates.length})
          </button>
          <button
            onClick={() => setActiveTab('MANUAL_ISSUE')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-all ${
              activeTab === 'MANUAL_ISSUE' 
                ? 'bg-amber-600 text-white shadow' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Manual Issue</span>
          </button>
        </div>
      </div>

      {/* Search & Filters (Shown on Requests & Certificates Tabs) */}
      {activeTab !== 'MANUAL_ISSUE' && (
        <div className="bg-[#0B1513] border border-[#1B2F2A] rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by participant name, email, workshop, or Certificate ID..."
              className="w-full bg-[#070D0B] border border-[#1B2F2A] rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Status Filter */}
            <div className="flex items-center gap-1 text-xs text-slate-400">
              <Filter className="w-3.5 h-3.5" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-[#070D0B] border border-[#1B2F2A] rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none cursor-pointer"
              >
                <option value="ALL">All Statuses</option>
                <option value="GENERATED">Generated</option>
                <option value="ACTIVE">Active / Valid</option>
                <option value="APPROVED">Approved</option>
                <option value="REJECTED">Rejected</option>
                <option value="REVOKED">Revoked</option>
              </select>
            </div>

            {/* Type Filter for Certificates Tab */}
            {activeTab === 'CERTIFICATES' && (
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="bg-[#070D0B] border border-[#1B2F2A] rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none cursor-pointer"
              >
                <option value="ALL">All Types</option>
                <option value="PARTICIPATION">Workshop Participation</option>
                <option value="COMPLETION">Cohort Completion</option>
              </select>
            )}

            <button
              onClick={fetchAllData}
              className="p-2 rounded-lg bg-[#142320] text-slate-400 hover:text-white transition-colors"
              title="Refresh Data"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>

        </div>
      )}

      {/* TAB 1: PARTICIPATION REQUESTS */}
      {activeTab === 'REQUESTS' && (
        <div className="bg-[#0B1513] border border-[#1B2F2A] rounded-2xl overflow-hidden shadow-lg">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#0E1B18] text-slate-400 font-semibold border-b border-[#1B2F2A]">
                <tr>
                  <th className="py-3.5 px-4">Participant Details</th>
                  <th className="py-3.5 px-4">Workshop & Date</th>
                  <th className="py-3.5 px-4">Certificate ID</th>
                  <th className="py-3.5 px-4">Email Status</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1B2F2A] text-slate-200">
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-500">
                      <RefreshCw className="w-5 h-5 animate-spin mx-auto text-emerald-400 mb-2" />
                      <span>Loading participation certificate requests...</span>
                    </td>
                  </tr>
                ) : filteredRequests.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-500">
                      No certificate requests found matching your query.
                    </td>
                  </tr>
                ) : (
                  filteredRequests.map((req) => (
                    <tr key={req.id} className="hover:bg-[#0F1E1B] transition-colors">
                      
                      {/* Participant */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-white text-sm">{req.fullName}</div>
                        <div className="text-slate-400">{req.email}</div>
                        <div className="text-[11px] text-slate-500 font-mono">
                          Mobile: {req.mobile} · WA: {req.whatsappNumber} ({req.city})
                        </div>
                      </td>

                      {/* Workshop */}
                      <td className="py-3.5 px-4">
                        <div className="text-slate-200 font-medium">{req.workshopName}</div>
                        <div className="text-[11px] text-emerald-400 font-mono">
                          Held: {new Date(req.workshopDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </div>
                      </td>

                      {/* Certificate ID */}
                      <td className="py-3.5 px-4 font-mono font-bold text-amber-400">
                        <div className="flex items-center gap-1">
                          <Award className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                          <span>{req.certificateId}</span>
                        </div>
                      </td>

                      {/* Email Status */}
                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center gap-1 text-[11px] font-mono text-slate-300">
                          <Mail className="w-3 h-3 text-blue-400" />
                          <span>{req.emailDeliveryStatus || 'SENT'}</span>
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        {req.status === 'REJECTED' ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                            <XCircle className="w-3 h-3" />
                            <span>REJECTED</span>
                          </span>
                        ) : req.status === 'REVOKED' ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-500/20 text-slate-300 border border-slate-500/30">
                            <AlertCircle className="w-3 h-3" />
                            <span>REVOKED</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>{req.status || 'GENERATED'}</span>
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          
                          {/* Resend Email */}
                          <button
                            onClick={() => handleResendEmail(req.certificateId)}
                            className="p-1.5 rounded-lg bg-[#152522] hover:bg-blue-600 text-slate-300 hover:text-white transition-colors"
                            title="Resend Certificate Email"
                          >
                            <Mail className="w-3.5 h-3.5" />
                          </button>

                          {/* Verify Link */}
                          <a
                            href={`#verify/${req.certificateId}`}
                            target="_blank"
                            rel="noreferrer"
                            className="p-1.5 rounded-lg bg-[#152522] hover:bg-emerald-600 text-slate-300 hover:text-white transition-colors"
                            title="View Public Credential"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>

                          {/* Approve (if rejected/pending) */}
                          {req.status === 'REJECTED' && (
                            <button
                              onClick={() => handleApproveRequest(req.id)}
                              className="px-2 py-1 rounded-lg bg-emerald-600/30 hover:bg-emerald-600 text-emerald-300 hover:text-white text-[10px] font-bold transition-colors"
                            >
                              Approve
                            </button>
                          )}

                          {/* Reject / Revoke Button */}
                          {req.status !== 'REJECTED' && req.status !== 'REVOKED' && (
                            <button
                              onClick={() => setRejectingRequestId(req.id)}
                              className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-600 text-rose-400 hover:text-white transition-colors"
                              title="Reject Request"
                            >
                              <XCircle className="w-3.5 h-3.5" />
                            </button>
                          )}

                        </div>
                      </td>

                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: ALL CERTIFICATES REGISTRY */}
      {activeTab === 'CERTIFICATES' && (
        <div className="bg-[#0B1513] border border-[#1B2F2A] rounded-2xl overflow-hidden shadow-lg">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#0E1B18] text-slate-400 font-semibold border-b border-[#1B2F2A]">
                <tr>
                  <th className="py-3.5 px-4">Certificate ID & Type</th>
                  <th className="py-3.5 px-4">Participant / Student</th>
                  <th className="py-3.5 px-4">Workshop / Course</th>
                  <th className="py-3.5 px-4">Issued Date</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1B2F2A] text-slate-200">
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-500">
                      <RefreshCw className="w-5 h-5 animate-spin mx-auto text-emerald-400 mb-2" />
                      <span>Loading certificate ledger...</span>
                    </td>
                  </tr>
                ) : filteredCerts.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-500">
                      No certificates match your query.
                    </td>
                  </tr>
                ) : (
                  filteredCerts.map((cert) => (
                    <tr key={cert.id} className="hover:bg-[#0F1E1B] transition-colors">
                      
                      {/* ID & Type */}
                      <td className="py-3.5 px-4 font-mono">
                        <div className="font-bold text-amber-400 flex items-center gap-1.5">
                          <Award className="w-4 h-4 text-amber-400 shrink-0" />
                          <span>{cert.id}</span>
                        </div>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#142621] text-emerald-300 font-semibold uppercase">
                          {cert.type || (cert.id.startsWith('CII-PART') ? 'PARTICIPATION' : 'COMPLETION')}
                        </span>
                      </td>

                      {/* Participant */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-white">{cert.participantName || cert.studentName}</div>
                        <div className="text-slate-400">{cert.studentEmail || cert.mobile}</div>
                        {cert.city && <div className="text-[10px] text-slate-500">{cert.city}</div>}
                      </td>

                      {/* Workshop / Course */}
                      <td className="py-3.5 px-4">
                        <div className="text-slate-200 font-medium">{cert.workshopName || cert.courseName}</div>
                        <div className="text-[10px] text-slate-500">
                          {cert.workshopDate ? `Workshop Date: ${cert.workshopDate}` : `Enrollment: ${cert.enrollmentId || 'N/A'}`}
                        </div>
                      </td>

                      {/* Issued Date */}
                      <td className="py-3.5 px-4 text-slate-400">
                        {new Date(cert.issueDate || cert.issuedAt || Date.now()).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        {cert.status === 'REVOKED' || cert.status === 'REJECTED' ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                            <XCircle className="w-3 h-3" />
                            <span>REVOKED</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>ACTIVE</span>
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          
                          {/* Resend Email */}
                          <button
                            onClick={() => handleResendEmail(cert.id)}
                            className="p-1.5 rounded-lg bg-[#152522] hover:bg-blue-600 text-slate-300 hover:text-white transition-colors"
                            title="Resend Email"
                          >
                            <Mail className="w-3.5 h-3.5" />
                          </button>

                          {/* Verify */}
                          <a
                            href={cert.credentialUrl || cert.verificationUrl || `#verify/${cert.id}`}
                            target="_blank"
                            rel="noreferrer"
                            className="p-1.5 rounded-lg bg-[#152522] hover:bg-emerald-600 text-slate-300 hover:text-white transition-colors"
                            title="View Public Credential"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>

                          {/* Revoke (Super Admin / Admin) */}
                          {cert.status !== 'REVOKED' && (
                            <button
                              onClick={() => setRevokingCertId(cert.id)}
                              className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-600 text-rose-400 hover:text-white transition-colors"
                              title="Revoke Certificate"
                            >
                              <XCircle className="w-3.5 h-3.5" />
                            </button>
                          )}

                        </div>
                      </td>

                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: MANUAL CERTIFICATE GENERATOR */}
      {activeTab === 'MANUAL_ISSUE' && (
        <div className="max-w-2xl bg-[#0B1513] border border-[#1B2F2A] rounded-2xl p-6 sm:p-8 shadow-xl">
          <div className="flex items-center gap-2 mb-6 pb-4 border-b border-[#1B2F2A]">
            <Award className="w-5 h-5 text-amber-400" />
            <div>
              <h3 className="text-base font-bold text-white">Issue Certificate Manually</h3>
              <p className="text-xs text-slate-400">Instantly generate and register a verified certificate for any participant.</p>
            </div>
          </div>

          <form onSubmit={handleManualGenerate} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Participant Full Name *</label>
              <input
                type="text"
                required
                value={manualName}
                onChange={(e) => setManualName(e.target.value)}
                placeholder="e.g. Priya Sharma"
                className="w-full bg-[#070D0B] border border-[#1B2F2A] rounded-xl px-3.5 py-2 text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  value={manualEmail}
                  onChange={(e) => setManualEmail(e.target.value)}
                  placeholder="priya@example.com"
                  className="w-full bg-[#070D0B] border border-[#1B2F2A] rounded-xl px-3.5 py-2 text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Mobile Number</label>
                <input
                  type="tel"
                  value={manualMobile}
                  onChange={(e) => setManualMobile(e.target.value)}
                  placeholder="9876543210"
                  className="w-full bg-[#070D0B] border border-[#1B2F2A] rounded-xl px-3.5 py-2 text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Workshop / Course Name *</label>
              <input
                type="text"
                required
                value={manualWorkshop}
                onChange={(e) => setManualWorkshop(e.target.value)}
                className="w-full bg-[#070D0B] border border-[#1B2F2A] rounded-xl px-3.5 py-2 text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Workshop Date</label>
                <input
                  type="date"
                  value={manualDate}
                  onChange={(e) => setManualDate(e.target.value)}
                  className="w-full bg-[#070D0B] border border-[#1B2F2A] rounded-xl px-3.5 py-2 text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">City / Location</label>
                <input
                  type="text"
                  value={manualCity}
                  onChange={(e) => setManualCity(e.target.value)}
                  placeholder="e.g. Bengaluru / Online"
                  className="w-full bg-[#070D0B] border border-[#1B2F2A] rounded-xl px-3.5 py-2 text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isGeneratingManual}
                className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer disabled:opacity-50"
              >
                {isGeneratingManual ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Generating Official Certificate...</span>
                  </>
                ) : (
                  <>
                    <Award className="w-3.5 h-3.5" />
                    <span>Generate & Register Certificate</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* REJECT REQUEST MODAL */}
      {rejectingRequestId && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-[#0D1815] border border-[#1B2F2A] rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <h3 className="text-base font-bold text-white flex items-center gap-2 mb-2">
              <XCircle className="w-5 h-5 text-rose-400" />
              <span>Reject Certificate Request</span>
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Please specify the reason for rejecting request <strong>{rejectingRequestId}</strong>:
            </p>

            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              rows={3}
              className="w-full bg-[#070D0B] border border-[#1B2F2A] rounded-xl p-3 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-rose-500 mb-4"
              placeholder="e.g. Unverified workshop attendance"
            />

            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setRejectingRequestId(null)}
                className="px-4 py-2 rounded-xl bg-[#152522] text-slate-300 text-xs font-semibold hover:bg-[#1B2F2A]"
              >
                Cancel
              </button>
              <button
                onClick={handleRejectRequest}
                className="px-4 py-2 rounded-xl bg-rose-600 text-white text-xs font-bold hover:bg-rose-500"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}

      {/* REVOKE CERTIFICATE MODAL */}
      {revokingCertId && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-[#0D1815] border border-[#1B2F2A] rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <h3 className="text-base font-bold text-white flex items-center gap-2 mb-2">
              <AlertCircle className="w-5 h-5 text-rose-400" />
              <span>Revoke Verified Certificate</span>
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              This will permanently flag Certificate <strong>{revokingCertId}</strong> as REVOKED on the public verification registry.
            </p>

            <textarea
              value={revokeReason}
              onChange={(e) => setRevokeReason(e.target.value)}
              rows={3}
              className="w-full bg-[#070D0B] border border-[#1B2F2A] rounded-xl p-3 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-rose-500 mb-4"
              placeholder="Reason for revocation"
            />

            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setRevokingCertId(null)}
                className="px-4 py-2 rounded-xl bg-[#152522] text-slate-300 text-xs font-semibold hover:bg-[#1B2F2A]"
              >
                Cancel
              </button>
              <button
                onClick={handleRevokeCertificate}
                className="px-4 py-2 rounded-xl bg-rose-600 text-white text-xs font-bold hover:bg-rose-500"
              >
                Confirm Revocation
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
