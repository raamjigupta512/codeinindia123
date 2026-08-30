import React, { useState, useEffect } from 'react';
import { Calendar, Users, DollarSign, Plus, CheckCircle2, Clock, Video, RefreshCw, ExternalLink } from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { Workshop } from '../../types/admin';

export const AdminWorkshopsView: React.FC = () => {
  const { token, hasRole } = useAdminAuth();
  const [workshops, setWorkshops] = useState<Workshop[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // New Workshop Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('08:00 PM - 10:00 PM IST');
  const [host, setHost] = useState('Harsh Vardhan (Ex-Founding Engineer)');
  const [meetingLink, setMeetingLink] = useState('https://meet.google.com/cii-live-session');
  const [maxSeats, setMaxSeats] = useState(1000);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchWorkshops = async () => {
    if (!token) return;
    try {
      setIsLoading(true);
      const res = await fetch('/api/admin/workshops', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setWorkshops(data.data || []);
      }
    } catch (e) {
      console.error('Error fetching workshops:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkshops();
  }, [token]);

  const handleCreateWorkshop = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !title.trim()) return;

    try {
      setIsSubmitting(true);
      const res = await fetch('/api/admin/workshops', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          title,
          date,
          time,
          host,
          meetingLink,
          maxSeats,
          registrationDeadline: new Date(date).toISOString()
        })
      });
      const data = await res.json();
      if (data.success) {
        setIsModalOpen(false);
        setTitle('');
        fetchWorkshops();
      }
    } catch (e) {
      console.error('Error creating workshop:', e);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
            <span>Live Masterclasses & Workshops Scheduler</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono font-bold">
              {workshops.length} Scheduled
            </span>
          </h2>
          <p className="text-xs text-slate-400">
            Manage upcoming Zoom/Meet webinars, attendee attendance tracking, and paid cohort conversion rates.
          </p>
        </div>

        {hasRole(['SUPER_ADMIN', 'ADMIN']) && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white text-xs font-bold transition-all shadow-lg flex items-center gap-2 cursor-pointer self-start"
          >
            <Plus className="w-4 h-4" />
            <span>Schedule New Workshop</span>
          </button>
        )}
      </div>

      {/* Workshop Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {isLoading ? (
          <div className="col-span-full py-12 text-center text-slate-500">
            <RefreshCw className="w-5 h-5 animate-spin mx-auto text-emerald-400 mb-2" />
            <span>Loading scheduled sessions...</span>
          </div>
        ) : workshops.map((ws) => (
          <div key={ws.id} className="bg-[#0B1513] border border-[#1B2F2A] rounded-2xl p-5 shadow-lg flex flex-col justify-between space-y-4 hover:border-emerald-500/40 transition-all">
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  ws.status === 'OPEN' 
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' 
                    : 'bg-slate-800 text-slate-400'
                }`}>
                  {ws.status}
                </span>
                <span className="font-mono text-[10px] text-slate-500">{ws.id}</span>
              </div>

              <h3 className="text-sm font-bold text-white tracking-tight leading-snug">{ws.title}</h3>
              
              <div className="mt-3 space-y-1.5 text-xs text-slate-400">
                <div className="flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{ws.date} • {ws.time}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-3.5 h-3.5 text-teal-400" />
                  <span>Host: {ws.host}</span>
                </div>
              </div>
            </div>

            {/* Metrics */}
            <div className="pt-3 border-t border-[#1B2F2A] grid grid-cols-3 gap-2 text-center bg-[#070D0B] p-2.5 rounded-xl">
              <div>
                <span className="text-[10px] text-slate-500 block">Registrations</span>
                <span className="font-bold text-xs text-white">{ws.registrationsCount}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block">Conversions</span>
                <span className="font-bold text-xs text-emerald-400">{ws.paidConversionsCount} Paid</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block">Conv. Rate</span>
                <span className="font-bold text-xs text-teal-300">
                  {ws.registrationsCount > 0 ? `${((ws.paidConversionsCount / ws.registrationsCount) * 100).toFixed(1)}%` : '0%'}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <a
                href={ws.meetingLink}
                target="_blank"
                rel="noreferrer"
                className="text-emerald-400 hover:underline flex items-center gap-1 text-[11px]"
              >
                <Video className="w-3.5 h-3.5" />
                <span>Join Link</span>
                <ExternalLink className="w-2.5 h-2.5" />
              </a>
              <span className="text-slate-400 font-medium">Max {ws.maxSeats} Seats</span>
            </div>
          </div>
        ))}
      </div>

      {/* Schedule Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-[#0B1513] border border-[#1B2F2A] rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-[#1B2F2A]">
              <h3 className="text-sm font-bold text-white">Schedule Masterclass / Workshop</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleCreateWorkshop} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Session Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Free 2-Hour Live SaaS App Building Masterclass"
                  className="w-full bg-[#070D0B] border border-[#1B2F2A] rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Session Date</label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-[#070D0B] border border-[#1B2F2A] rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Time (IST)</label>
                  <input
                    type="text"
                    required
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full bg-[#070D0B] border border-[#1B2F2A] rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Host / Trainer</label>
                <input
                  type="text"
                  required
                  value={host}
                  onChange={(e) => setHost(e.target.value)}
                  className="w-full bg-[#070D0B] border border-[#1B2F2A] rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Meeting Link (Meet/Zoom)</label>
                <input
                  type="url"
                  required
                  value={meetingLink}
                  onChange={(e) => setMeetingLink(e.target.value)}
                  className="w-full bg-[#070D0B] border border-[#1B2F2A] rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3 py-1.5 rounded-lg bg-[#152522] text-xs font-semibold text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all disabled:opacity-50"
                >
                  {isSubmitting ? 'Creating...' : 'Schedule Workshop'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
