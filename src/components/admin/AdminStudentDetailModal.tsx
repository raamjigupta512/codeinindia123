import React, { useState } from 'react';
import { 
  X, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  CreditCard, 
  ShieldCheck, 
  Award, 
  BookOpen, 
  Clock, 
  MessageSquare, 
  Plus, 
  Send, 
  Sparkles, 
  AlertCircle,
  CheckCircle2,
  ExternalLink,
  ShieldAlert
} from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { Student } from '../../types/admin';

interface AdminStudentDetailModalProps {
  student: Student | null;
  onClose: () => void;
  onStudentUpdated: () => void;
}

export const AdminStudentDetailModal: React.FC<AdminStudentDetailModalProps> = ({
  student,
  onClose,
  onStudentUpdated
}) => {
  const { token, hasRole } = useAdminAuth();
  const [activeTab, setActiveTab] = useState<'profile' | 'progress' | 'timeline' | 'notes'>('profile');
  const [noteText, setNoteText] = useState('');
  const [isSubmittingNote, setIsSubmittingNote] = useState(false);
  const [progressInput, setProgressInput] = useState<number>(student?.courseProgress || 0);
  const [isUpdatingProgress, setIsUpdatingProgress] = useState(false);

  // Override Payment Modal state
  const [isOverrideOpen, setIsOverrideOpen] = useState(false);
  const [overrideReason, setOverrideReason] = useState('');
  const [isOverriding, setIsOverriding] = useState(false);

  if (!student) return null;

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteText.trim() || !token) return;

    try {
      setIsSubmittingNote(true);
      const res = await fetch(`/api/admin/students/${student.id}/notes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ text: noteText })
      });
      const data = await res.json();
      if (data.success) {
        setNoteText('');
        onStudentUpdated();
      }
    } catch (e) {
      console.error('Error adding note:', e);
    } finally {
      setIsSubmittingNote(false);
    }
  };

  const handleUpdateProgress = async () => {
    if (!token) return;
    try {
      setIsUpdatingProgress(true);
      const res = await fetch(`/api/admin/students/${student.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ courseProgress: progressInput })
      });
      const data = await res.json();
      if (data.success) {
        onStudentUpdated();
      }
    } catch (e) {
      console.error('Error updating progress:', e);
    } finally {
      setIsUpdatingProgress(false);
    }
  };

  const handleIssueCertificate = async () => {
    if (!token) return;
    try {
      const res = await fetch('/api/admin/certificates/issue', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ studentId: student.id })
      });
      const data = await res.json();
      if (data.success) {
        onStudentUpdated();
      }
    } catch (e) {
      console.error('Error issuing certificate:', e);
    }
  };

  const handleOverridePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!overrideReason.trim() || !token) return;

    try {
      setIsOverriding(true);
      const res = await fetch(`/api/admin/students/${student.id}/override-payment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          reason: overrideReason,
          amount: 4999
        })
      });
      const data = await res.json();
      if (data.success) {
        setIsOverrideOpen(false);
        setOverrideReason('');
        onStudentUpdated();
      }
    } catch (e) {
      console.error('Error overriding payment:', e);
    } finally {
      setIsOverriding(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#0B1513] border border-[#1B2F2A] rounded-2xl w-full max-w-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-6 border-b border-[#1B2F2A] bg-[#0E1B18] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white font-bold text-base shadow">
              {student.fullName.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white tracking-tight">{student.fullName}</h2>
                {student.enrollmentId ? (
                  <span className="px-2 py-0.5 rounded-full text-xs font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    {student.enrollmentId}
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-full text-xs font-mono font-medium bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    UNENROLLED
                  </span>
                )}
                {student.isTest && (
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-amber-500/20 text-amber-300">TEST</span>
                )}
              </div>
              <div className="text-xs text-slate-400 mt-0.5">
                {student.courseName} • ID: <span className="font-mono">{student.id}</span>
              </div>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-[#152522] cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="px-6 border-b border-[#1B2F2A] bg-[#091210] flex gap-4">
          <button
            onClick={() => setActiveTab('profile')}
            className={`py-3 text-xs font-semibold border-b-2 cursor-pointer transition-colors ${
              activeTab === 'profile'
                ? 'border-emerald-500 text-emerald-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Student 360° Profile
          </button>
          <button
            onClick={() => setActiveTab('progress')}
            className={`py-3 text-xs font-semibold border-b-2 cursor-pointer transition-colors ${
              activeTab === 'progress'
                ? 'border-emerald-500 text-emerald-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Course Progress ({student.courseProgress}%)
          </button>
          <button
            onClick={() => setActiveTab('timeline')}
            className={`py-3 text-xs font-semibold border-b-2 cursor-pointer transition-colors ${
              activeTab === 'timeline'
                ? 'border-emerald-500 text-emerald-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Activity Timeline ({student.activityTimeline?.length || 0})
          </button>
          <button
            onClick={() => setActiveTab('notes')}
            className={`py-3 text-xs font-semibold border-b-2 cursor-pointer transition-colors ${
              activeTab === 'notes'
                ? 'border-emerald-500 text-emerald-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Internal Notes ({student.notes?.length || 0})
          </button>
        </div>

        {/* Tab Contents */}
        <div className="flex-1 p-6 overflow-y-auto space-y-6">
          
          {/* TAB 1: Profile & Verified Payment */}
          {activeTab === 'profile' && (
            <div className="space-y-6">
              
              {/* Contact & Personal Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                <div className="p-4 rounded-xl bg-[#0F1E1B] border border-[#1B2F2A] space-y-3">
                  <div className="text-xs font-bold text-slate-300 uppercase tracking-wider">Contact Credentials</div>
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center gap-2 text-slate-300">
                      <Mail className="w-4 h-4 text-slate-500" />
                      <span>{student.email}</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-300">
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-slate-500" />
                        <span>{student.mobile}</span>
                      </div>
                      <a
                        href={`https://wa.me/91${student.mobile.replace(/\D/g, '')}?text=Hi%20${encodeURIComponent(student.fullName)},%20this%20is%20CodeInIndia%20team.`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[11px] text-emerald-400 hover:underline flex items-center gap-1"
                      >
                        <span>WhatsApp</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                    <div className="flex items-center gap-2 text-slate-300">
                      <MapPin className="w-4 h-4 text-slate-500" />
                      <span>{student.city}, {student.state}</span>
                    </div>
                  </div>
                </div>

                {/* Gateway Payment Verification Snapshot */}
                <div className="p-4 rounded-xl bg-[#0F1E1B] border border-[#1B2F2A] space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="text-xs font-bold text-slate-300 uppercase tracking-wider">Verified Payment</div>
                    {student.paymentStatus === 'PAID' ? (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                        GATEWAY CONFIRMED
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                        {student.paymentStatus}
                      </span>
                    )}
                  </div>

                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Amount Paid:</span>
                      <span className="font-bold text-emerald-400">₹{(student.paymentAmount || 0).toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Payment ID:</span>
                      <span className="font-mono text-slate-300">{student.paymentId || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Order ID:</span>
                      <span className="font-mono text-slate-300">{student.orderId || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Payment Method:</span>
                      <span className="text-slate-300">{student.paymentMethod || 'Razorpay Gateway'}</span>
                    </div>
                  </div>
                </div>

              </div>

              {/* Attribution & Marketing Data */}
              <div className="p-4 rounded-xl bg-[#0F1E1B] border border-[#1B2F2A] space-y-2">
                <div className="text-xs font-bold text-slate-300 uppercase tracking-wider">Source Attribution & Tracking</div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs pt-1">
                  <div>
                    <span className="text-slate-400 block text-[11px]">Source Channel</span>
                    <span className="font-semibold text-white">{student.source || 'Direct'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">UTM Medium</span>
                    <span className="font-semibold text-white">{student.utmMedium || 'None'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">UTM Campaign</span>
                    <span className="font-semibold text-white">{student.utmCampaign || 'None'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Referral Code</span>
                    <span className="font-mono text-emerald-400">{student.referralCode || 'None'}</span>
                  </div>
                </div>
              </div>

              {/* Super Admin Payment Override Section */}
              {student.paymentStatus !== 'PAID' && hasRole(['SUPER_ADMIN']) && (
                <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-600/40 space-y-3">
                  <div className="flex items-center gap-2 text-amber-300 text-xs font-bold">
                    <ShieldAlert className="w-4 h-4" />
                    <span>Super Admin Financial Override</span>
                  </div>
                  <p className="text-[11px] text-amber-200/80 leading-relaxed">
                    If this student made an offline NEFT/RTGS bank transfer or cash payment, a Super Admin can manually approve and issue an official Enrollment ID. This action is permanently audited.
                  </p>
                  <button
                    onClick={() => setIsOverrideOpen(true)}
                    className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold transition-all cursor-pointer"
                  >
                    Open Audited Payment Override
                  </button>
                </div>
              )}

            </div>
          )}

          {/* TAB 2: Course Progress & Certificate */}
          {activeTab === 'progress' && (
            <div className="space-y-6">
              
              <div className="p-5 rounded-xl bg-[#0F1E1B] border border-[#1B2F2A] space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-white">Live Cohort Milestone Progress</h3>
                    <p className="text-xs text-slate-400">Track module completion and milestone submissions</p>
                  </div>
                  <div className="text-2xl font-black text-emerald-400">
                    {student.courseProgress}%
                  </div>
                </div>

                {/* Progress Slider */}
                <div className="w-full bg-[#070D0B] rounded-full h-3 overflow-hidden border border-[#1B2F2A]">
                  <div 
                    className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-500"
                    style={{ width: `${student.courseProgress}%` }}
                  ></div>
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={progressInput}
                    onChange={(e) => setProgressInput(Number(e.target.value))}
                    className="flex-1 accent-emerald-500"
                  />
                  <button
                    onClick={handleUpdateProgress}
                    disabled={isUpdatingProgress}
                    className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all cursor-pointer disabled:opacity-50"
                  >
                    {isUpdatingProgress ? 'Saving...' : 'Update Progress'}
                  </button>
                </div>
              </div>

              {/* Certificate Issuance Block */}
              <div className="p-5 rounded-xl bg-[#0F1E1B] border border-[#1B2F2A] space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Award className="w-5 h-5 text-emerald-400" />
                    <h3 className="text-sm font-bold text-white">Course Completion Certificate</h3>
                  </div>
                  {student.certificateStatus === 'ISSUED' ? (
                    <span className="px-2 py-0.5 rounded-full text-xs font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      {student.certificateId}
                    </span>
                  ) : student.courseProgress >= 100 ? (
                    <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                      Eligible for Issuance
                    </span>
                  ) : (
                    <span className="text-xs text-slate-500">Requires 100% Progress</span>
                  )}
                </div>

                {student.certificateStatus === 'ISSUED' ? (
                  <div className="text-xs text-slate-300 flex items-center justify-between">
                    <span>Issued on {new Date(student.certificateIssuedAt || '').toLocaleDateString('en-IN')}</span>
                    <a
                      href={`/verify/${student.certificateId}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-emerald-400 hover:underline flex items-center gap-1"
                    >
                      <span>Public Verification Link</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                ) : student.courseProgress >= 100 ? (
                  <button
                    onClick={handleIssueCertificate}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white text-xs font-bold transition-all shadow cursor-pointer flex items-center gap-2"
                  >
                    <Award className="w-4 h-4" />
                    <span>Issue Verified Certificate to Student</span>
                  </button>
                ) : (
                  <p className="text-xs text-slate-400">
                    Student has completed {student.courseProgress}% of course requirements. Once 100% is reached, you can generate an official tamper-proof credential.
                  </p>
                )}
              </div>

            </div>
          )}

          {/* TAB 3: Activity Timeline */}
          {activeTab === 'timeline' && (
            <div className="space-y-4">
              <div className="space-y-3">
                {student.activityTimeline && student.activityTimeline.length > 0 ? (
                  student.activityTimeline.map((act) => (
                    <div key={act.id} className="p-3 rounded-xl bg-[#0F1E1B] border border-[#1B2F2A] flex items-start gap-3">
                      <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 shrink-0 mt-0.5">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-white">{act.title}</span>
                          <span className="text-[10px] text-slate-500">
                            {new Date(act.timestamp).toLocaleString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5">{act.description}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-8 text-center text-xs text-slate-500">No activity recorded yet.</div>
                )}
              </div>
            </div>
          )}

          {/* TAB 4: Internal Notes */}
          {activeTab === 'notes' && (
            <div className="space-y-4">
              
              {/* Add Note Form */}
              <form onSubmit={handleAddNote} className="flex gap-2">
                <input
                  type="text"
                  required
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  placeholder="Type an internal operations note about this student..."
                  className="flex-1 bg-[#070D0B] border border-[#1B2F2A] rounded-xl px-4 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
                />
                <button
                  type="submit"
                  disabled={isSubmittingNote}
                  className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Post Note</span>
                </button>
              </form>

              {/* Notes List */}
              <div className="space-y-3">
                {student.notes && student.notes.length > 0 ? (
                  student.notes.map((note) => (
                    <div key={note.id} className="p-3.5 rounded-xl bg-[#0F1E1B] border border-[#1B2F2A] space-y-1">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-semibold text-emerald-300">{note.adminName}</span>
                        <span className="text-slate-500">
                          {new Date(note.timestamp).toLocaleString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-xs text-slate-300">{note.text}</p>
                    </div>
                  ))
                ) : (
                  <div className="py-8 text-center text-xs text-slate-500">No notes written for this student yet.</div>
                )}
              </div>

            </div>
          )}

        </div>

      </div>

      {/* Override Payment Dialog */}
      {isOverrideOpen && (
        <div className="fixed inset-0 z-60 bg-black/90 flex items-center justify-center p-4">
          <div className="bg-[#0B1513] border border-amber-600/50 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-2 text-amber-400">
              <ShieldAlert className="w-5 h-5" />
              <h3 className="text-sm font-bold text-white">Confirm Financial Override</h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              You are manually enrolling <strong>{student.fullName}</strong> as a verified paid student without a direct Razorpay gateway webhook. This will generate an official Enrollment ID and log your admin identity.
            </p>
            <form onSubmit={handleOverridePayment} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Reason for Override (Required for Audit Log)
                </label>
                <textarea
                  required
                  rows={3}
                  value={overrideReason}
                  onChange={(e) => setOverrideReason(e.target.value)}
                  placeholder="e.g., Direct bank NEFT reference #UTIB00018274 verified on bank statement..."
                  className="w-full bg-[#070D0B] border border-[#1B2F2A] rounded-xl p-3 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-500"
                ></textarea>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsOverrideOpen(false)}
                  className="px-3 py-2 rounded-xl bg-[#152522] text-slate-300 text-xs font-semibold hover:bg-[#1E3430] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isOverriding}
                  className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold transition-all cursor-pointer disabled:opacity-50"
                >
                  {isOverriding ? 'Logging Override...' : 'Confirm & Authorize Enrollment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
