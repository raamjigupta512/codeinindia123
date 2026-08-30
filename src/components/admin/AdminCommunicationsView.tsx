import React, { useState, useEffect } from 'react';
import { Send, MessageSquare, Mail, Users, CheckCircle2, Clock, Sparkles, RefreshCw, AlertCircle } from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { BroadcastMessage } from '../../types/admin';

export const AdminCommunicationsView: React.FC = () => {
  const { token, hasRole } = useAdminAuth();
  const [broadcasts, setBroadcasts] = useState<BroadcastMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Broadcast Form
  const [channel, setChannel] = useState<'WHATSAPP' | 'EMAIL' | 'SMS'>('WHATSAPP');
  const [targetAudience, setTargetAudience] = useState<'ALL_PAID' | 'COURSE_COHORT' | 'ALL_LEADS' | 'WORKSHOP_ATTENDEES'>('ALL_PAID');
  const [subject, setSubject] = useState('Important: Live Cohort Orientation Zoom Link for Saturday');
  const [message, setMessage] = useState('Hey {{name}}, welcome to CodeInIndia! Your official Enrollment ID is {{enrollment_id}}. The live cohort orientation kicks off Saturday at 8:00 PM IST.');
  const [isSending, setIsSending] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fetchBroadcasts = async () => {
    if (!token) return;
    try {
      setIsLoading(true);
      setErrorMsg(null);
      const res = await fetch('/api/admin/broadcasts', {
        headers: { 
          'Accept': 'application/json',
          Authorization: `Bearer ${token}` 
        }
      });
      if (!res.ok) {
        throw new Error(`Server returned ${res.status}: ${res.statusText}`);
      }
      const data = await res.json();
      if (data.success) {
        setBroadcasts(data.data || []);
      } else {
        throw new Error(data.error || 'Failed to load broadcasts');
      }
    } catch (e: any) {
      console.error('Error fetching broadcasts:', e);
      setErrorMsg(e.message || 'Error connecting to broadcasts service');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBroadcasts();
  }, [token]);

  const handleSendBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !message.trim()) return;

    try {
      setIsSending(true);
      setSuccessMsg(null);
      setErrorMsg(null);
      const res = await fetch('/api/admin/broadcasts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          channel,
          targetAudience,
          subject,
          message
        })
      });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ error: `Server error ${res.status}` }));
        throw new Error(errorData.error || `Failed with status ${res.status}`);
      }
      const data = await res.json();
      if (data.success) {
        setSuccessMsg(`Broadcast dispatched successfully to ${data.recipientCount} recipients.`);
        fetchBroadcasts();
      }
    } catch (e: any) {
      console.error('Error sending broadcast:', e);
      setErrorMsg(e.message || 'Failed to dispatch broadcast');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div>
        <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
          <span>Student Announcements & Automated Broadcasts</span>
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono font-bold">
            WhatsApp / Email
          </span>
        </h2>
        <p className="text-xs text-slate-400">
          Send cohort session links, onboarding checklists, and workshop reminders to targeted student segments.
        </p>
      </div>

      {successMsg && (
        <div className="p-3.5 rounded-xl bg-emerald-950/60 border border-emerald-500/50 text-emerald-200 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-3.5 rounded-xl bg-rose-950/60 border border-rose-500/50 text-rose-200 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Broadcast Composer */}
      {hasRole(['SUPER_ADMIN', 'ADMIN', 'OPERATIONS']) && (
        <div className="bg-[#0B1513] border border-[#1B2F2A] rounded-2xl p-5 shadow-lg space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#1B2F2A]">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Send className="w-4 h-4 text-emerald-400" />
              <span>Compose Automated Segment Broadcast</span>
            </h3>
            <span className="text-xs text-slate-400">Dynamic template interpolation enabled</span>
          </div>

          <form onSubmit={handleSendBroadcast} className="space-y-4">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Channel */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Dispatch Channel</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setChannel('WHATSAPP')}
                    className={`py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                      channel === 'WHATSAPP' 
                        ? 'bg-emerald-600 border-emerald-500 text-white shadow' 
                        : 'bg-[#0F1E1B] border-[#1B2F2A] text-slate-400'
                    }`}
                  >
                    WhatsApp
                  </button>
                  <button
                    type="button"
                    onClick={() => setChannel('EMAIL')}
                    className={`py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                      channel === 'EMAIL' 
                        ? 'bg-blue-600 border-blue-500 text-white shadow' 
                        : 'bg-[#0F1E1B] border-[#1B2F2A] text-slate-400'
                    }`}
                  >
                    Email
                  </button>
                  <button
                    type="button"
                    onClick={() => setChannel('SMS')}
                    className={`py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                      channel === 'SMS' 
                        ? 'bg-purple-600 border-purple-500 text-white shadow' 
                        : 'bg-[#0F1E1B] border-[#1B2F2A] text-slate-400'
                    }`}
                  >
                    SMS
                  </button>
                </div>
              </div>

              {/* Target Audience */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Target Recipient Segment</label>
                <select
                  value={targetAudience}
                  onChange={(e: any) => setTargetAudience(e.target.value)}
                  className="w-full bg-[#070D0B] border border-[#1B2F2A] rounded-xl px-3 py-2 text-xs text-white"
                >
                  <option value="ALL_PAID">All Paid Active Students (Enrolled)</option>
                  <option value="COURSE_COHORT">4-Week Live Cohort Students Only</option>
                  <option value="WORKSHOP_ATTENDEES">Registered Workshop Attendees</option>
                  <option value="ALL_LEADS">All Unpaid Leads in Pipeline</option>
                </select>
              </div>
            </div>

            {/* Subject (for Email) */}
            {channel === 'EMAIL' && (
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Email Subject Line</label>
                <input
                  type="text"
                  required
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full bg-[#070D0B] border border-[#1B2F2A] rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>
            )}

            {/* Message Body */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-xs font-semibold text-slate-300">Message Body</label>
                <span className="text-[11px] text-slate-400 font-mono">
                  Supported tags: {'{{name}}'}, {'{{enrollment_id}}'}, {'{{course_name}}'}
                </span>
              </div>
              <textarea
                required
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full bg-[#070D0B] border border-[#1B2F2A] rounded-xl p-3 text-xs text-white font-mono"
              ></textarea>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSending}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white text-xs font-bold transition-all shadow-lg flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                <span>{isSending ? 'Dispatching Broadcast...' : 'Dispatch Broadcast Now'}</span>
              </button>
            </div>

          </form>
        </div>
      )}

      {/* Broadcast History */}
      <div className="bg-[#0B1513] border border-[#1B2F2A] rounded-2xl overflow-hidden shadow-lg">
        <div className="p-4 bg-[#0E1B18] border-b border-[#1B2F2A]">
          <h3 className="text-sm font-bold text-white">Broadcast Delivery History</h3>
          <p className="text-[11px] text-slate-400">Past communications dispatched via Gateway Webhooks & APIs</p>
        </div>

        <div className="divide-y divide-[#1B2F2A]">
          {isLoading ? (
            <div className="py-8 text-center text-xs text-slate-500">Loading broadcast history...</div>
          ) : broadcasts.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-500">No broadcasts sent yet.</div>
          ) : (
            broadcasts.map((b) => (
              <div key={b.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-[#0F1E1B] transition-colors">
                <div className="space-y-1 max-w-2xl">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 font-mono">
                      {b.channel}
                    </span>
                    <span className="font-semibold text-white">{b.subject || b.targetAudience}</span>
                  </div>
                  <p className="text-xs text-slate-300 font-mono line-clamp-1">{b.message}</p>
                  <div className="text-[10px] text-slate-500 flex items-center gap-2">
                    <span>Target: {b.targetAudience}</span>
                    <span>•</span>
                    <span>Dispatched by {b.adminName}</span>
                    <span>•</span>
                    <span>{new Date(b.sentAt).toLocaleString('en-IN')}</span>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold bg-teal-500/20 text-teal-300 border border-teal-500/30">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>{b.recipientCount} Delivered</span>
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

    </div>
  );
};
