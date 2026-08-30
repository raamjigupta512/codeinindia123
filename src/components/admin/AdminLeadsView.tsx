import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Users, 
  Phone, 
  Mail, 
  MessageSquare, 
  ExternalLink, 
  ChevronLeft, 
  ChevronRight, 
  RefreshCw, 
  Sparkles,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { Lead, FollowUpStatus } from '../../types/admin';

export const AdminLeadsView: React.FC = () => {
  const { token } = useAdminAuth();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sourceFilter, setSourceFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Note Modal
  const [activeNoteLead, setActiveNoteLead] = useState<Lead | null>(null);
  const [newNoteText, setNewNoteText] = useState('');
  const [isSavingNote, setIsSavingNote] = useState(false);

  const fetchLeads = async () => {
    if (!token) return;
    try {
      setIsLoading(true);
      const params = new URLSearchParams({
        search,
        followUpStatus: statusFilter,
        source: sourceFilter,
        page: String(page),
        limit: '20'
      });

      const res = await fetch(`/api/admin/leads?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setLeads(data.data || []);
        setTotalPages(data.totalPages || 1);
        setTotalCount(data.total || 0);
      }
    } catch (e) {
      console.error('Error fetching leads:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, [token, search, statusFilter, sourceFilter, page]);

  const handleUpdateStatus = async (leadId: string, newStatus: FollowUpStatus) => {
    if (!token) return;
    try {
      const res = await fetch(`/api/admin/leads/${leadId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ followUpStatus: newStatus })
      });
      const data = await res.json();
      if (data.success) {
        fetchLeads();
      }
    } catch (e) {
      console.error('Error updating lead status:', e);
    }
  };

  const handleSaveNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeNoteLead || !newNoteText.trim() || !token) return;

    try {
      setIsSavingNote(true);
      const res = await fetch(`/api/admin/leads/${activeNoteLead.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ note: newNoteText.trim() })
      });
      const data = await res.json();
      if (data.success) {
        setNewNoteText('');
        setActiveNoteLead(null);
        fetchLeads();
      }
    } catch (e) {
      console.error('Error saving note:', e);
    } finally {
      setIsSavingNote(false);
    }
  };

  const getStatusBadge = (status: FollowUpStatus) => {
    switch (status) {
      case 'NEW':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">NEW</span>;
      case 'CONTACTED':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">CONTACTED</span>;
      case 'WORKSHOP_REGISTERED':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-teal-500/20 text-teal-300 border border-teal-500/30">WS REGISTERED</span>;
      case 'WORKSHOP_ATTENDED':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">WS ATTENDED</span>;
      case 'OFFER_PRESENTED':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">OFFER SENT</span>;
      case 'PAYMENT_PENDING':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">PAY PENDING</span>;
      case 'CONVERTED':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-600 text-white shadow">CONVERTED (PAID)</span>;
      case 'NOT_INTERESTED':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-700 text-slate-400">NOT INTERESTED</span>;
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
            <span>Leads & Inquiries Pipeline</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 font-mono font-bold">
              {totalCount} Active Leads
            </span>
          </h2>
          <p className="text-xs text-slate-400">
            Prospects who submitted forms or attended workshops before completing payment checkout.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[#0B1513] border border-[#1B2F2A] rounded-2xl p-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search leads by name, email, phone..."
            className="w-full bg-[#070D0B] border border-[#1B2F2A] rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </div>

        {/* FollowUp Status Filter */}
        <div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full bg-[#070D0B] border border-[#1B2F2A] rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-emerald-500"
          >
            <option value="all">All Pipeline Stages</option>
            <option value="NEW">New Inquiries</option>
            <option value="CONTACTED">Contacted</option>
            <option value="WORKSHOP_REGISTERED">Workshop Registered</option>
            <option value="WORKSHOP_ATTENDED">Workshop Attended</option>
            <option value="OFFER_PRESENTED">Offer Presented</option>
            <option value="PAYMENT_PENDING">Payment Pending</option>
            <option value="CONVERTED">Converted to Paid</option>
            <option value="NOT_INTERESTED">Not Interested</option>
          </select>
        </div>

        {/* Source Filter */}
        <div>
          <select
            value={sourceFilter}
            onChange={(e) => setSourceFilter(e.target.value)}
            className="w-full bg-[#070D0B] border border-[#1B2F2A] rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-emerald-500"
          >
            <option value="all">All Marketing Sources</option>
            <option value="instagram">Instagram Ads / Reels</option>
            <option value="youtube">YouTube Masterclass</option>
            <option value="google">Google Search (CPC)</option>
            <option value="facebook">Facebook Ads</option>
            <option value="Website">Website Direct Form</option>
          </select>
        </div>
      </div>

      {/* Leads Table */}
      <div className="bg-[#0B1513] border border-[#1B2F2A] rounded-2xl overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0E1B18] text-slate-400 font-semibold border-b border-[#1B2F2A]">
              <tr>
                <th className="py-3.5 px-4">Lead Name & Source</th>
                <th className="py-3.5 px-4">Contact Info</th>
                <th className="py-3.5 px-4">Interest Track</th>
                <th className="py-3.5 px-4">Pipeline Status</th>
                <th className="py-3.5 px-4">Notes</th>
                <th className="py-3.5 px-4 text-right">Direct Outreach</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1B2F2A] text-slate-200">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500">
                    <RefreshCw className="w-5 h-5 animate-spin mx-auto text-emerald-400 mb-2" />
                    <span>Loading pipeline leads...</span>
                  </td>
                </tr>
              ) : leads.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500">
                    No leads found matching current filters.
                  </td>
                </tr>
              ) : (
                leads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-[#0F1E1B] transition-colors">
                    
                    {/* Lead Name & Source */}
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-white">{lead.name}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5 flex items-center gap-1.5">
                        <span className="px-1.5 py-0.2 rounded bg-[#152522] text-emerald-400 font-mono">
                          {lead.source}
                        </span>
                        <span>{new Date(lead.createdAt).toLocaleDateString('en-IN')}</span>
                      </div>
                    </td>

                    {/* Contact */}
                    <td className="py-3.5 px-4">
                      <div className="text-slate-300">{lead.phone}</div>
                      <div className="text-[11px] text-slate-500">{lead.email}</div>
                    </td>

                    {/* Interest */}
                    <td className="py-3.5 px-4">
                      <div className="truncate max-w-[180px] text-slate-300">
                        {lead.courseInterest}
                      </div>
                      {lead.city && (
                        <div className="text-[10px] text-slate-500">{lead.city}, {lead.state}</div>
                      )}
                    </td>

                    {/* Status Dropdown */}
                    <td className="py-3.5 px-4">
                      <select
                        value={lead.followUpStatus}
                        onChange={(e) => handleUpdateStatus(lead.id, e.target.value as FollowUpStatus)}
                        className="bg-[#070D0B] border border-[#1B2F2A] rounded-lg px-2.5 py-1 text-[11px] text-slate-200 focus:outline-none focus:border-emerald-500"
                      >
                        <option value="NEW">New</option>
                        <option value="CONTACTED">Contacted</option>
                        <option value="WORKSHOP_REGISTERED">WS Registered</option>
                        <option value="WORKSHOP_ATTENDED">WS Attended</option>
                        <option value="OFFER_PRESENTED">Offer Sent</option>
                        <option value="PAYMENT_PENDING">Payment Pending</option>
                        <option value="CONVERTED">Converted to Paid</option>
                        <option value="NOT_INTERESTED">Not Interested</option>
                      </select>
                    </td>

                    {/* Notes Trigger */}
                    <td className="py-3.5 px-4">
                      <button
                        onClick={() => setActiveNoteLead(lead)}
                        className="text-xs text-slate-400 hover:text-emerald-400 flex items-center gap-1 cursor-pointer"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>{lead.notes?.length ? `${lead.notes.length} note(s)` : '+ Add note'}</span>
                      </button>
                    </td>

                    {/* Outreach Link */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <a
                          href={`https://wa.me/91${lead.phone.replace(/\D/g, '')}?text=Hi%20${encodeURIComponent(lead.name)},%20this%20is%20Harsh%20from%20CodeInIndia.`}
                          target="_blank"
                          rel="noreferrer"
                          className="px-2.5 py-1 rounded-lg bg-emerald-600/20 hover:bg-emerald-600 text-emerald-300 hover:text-white border border-emerald-500/30 text-[11px] font-semibold transition-all flex items-center gap-1"
                        >
                          <span>WhatsApp</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-[#1B2F2A] bg-[#0E1B18] flex items-center justify-between">
            <span className="text-xs text-slate-400">
              Page {page} of {totalPages}
            </span>
            <div className="flex items-center gap-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage(page - 1)}
                className="p-1.5 rounded-lg bg-[#152522] text-slate-300 hover:text-white disabled:opacity-40 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage(page + 1)}
                className="p-1.5 rounded-lg bg-[#152522] text-slate-300 hover:text-white disabled:opacity-40 cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Note Modal */}
      {activeNoteLead && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-[#0B1513] border border-[#1B2F2A] rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white">
                Follow-up Notes: {activeNoteLead.name}
              </h3>
              <button onClick={() => setActiveNoteLead(null)} className="text-slate-400 hover:text-white">
                ✕
              </button>
            </div>

            {/* Existing notes */}
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {activeNoteLead.notes?.map((n) => (
                <div key={n.id} className="p-2.5 rounded-xl bg-[#0F1E1B] text-xs space-y-1">
                  <div className="flex justify-between text-[10px] text-slate-400">
                    <span className="font-semibold text-emerald-300">{n.adminName}</span>
                    <span>{new Date(n.timestamp).toLocaleString('en-IN')}</span>
                  </div>
                  <p className="text-slate-200">{n.text}</p>
                </div>
              ))}
            </div>

            <form onSubmit={handleSaveNote} className="space-y-3 pt-2">
              <textarea
                required
                rows={3}
                value={newNoteText}
                onChange={(e) => setNewNoteText(e.target.value)}
                placeholder="Log customer response, next callback time, or objections..."
                className="w-full bg-[#070D0B] border border-[#1B2F2A] rounded-xl p-3 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
              ></textarea>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setActiveNoteLead(null)}
                  className="px-3 py-1.5 rounded-lg bg-[#152522] text-xs font-semibold text-slate-300 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingNote}
                  className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all cursor-pointer disabled:opacity-50"
                >
                  {isSavingNote ? 'Saving...' : 'Add Note'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
