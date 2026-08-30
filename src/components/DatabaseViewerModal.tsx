import React, { useState, useEffect } from 'react';
import { Database, Search, RefreshCw, Trash2, Edit2, Download, Check, X, Shield, CreditCard, ShieldCheck } from 'lucide-react';

export interface RegistrationRecord {
  id: string;
  name: string;
  phone: string;
  email: string;
  track?: string;
  status: string;
  source?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentRecord {
  paymentId: string;
  orderId: string;
  amount: number;
  currency: string;
  status: string;
  planName?: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  verifiedAt: string;
  signature?: string;
  createdAt?: string;
}

interface DatabaseViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'registrations' | 'payments';
}

export default function DatabaseViewerModal({ isOpen, onClose, defaultTab = 'registrations' }: DatabaseViewerModalProps) {
  const [activeTab, setActiveTab] = useState<'registrations' | 'payments'>(defaultTab);
  const [records, setRecords] = useState<RegistrationRecord[]>([]);
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingRecord, setEditingRecord] = useState<RegistrationRecord | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const fetchRecords = async () => {
    setLoading(true);
    try {
      const [regRes, payRes] = await Promise.all([
        fetch('/api/registrations'),
        fetch('/api/payments')
      ]);

      const regJson = await regRes.json();
      if (regJson.success && Array.isArray(regJson.data)) {
        setRecords(regJson.data);
      }

      const payJson = await payRes.json();
      if (payJson.success && Array.isArray(payJson.data)) {
        setPayments(payJson.data);
      }
    } catch (err) {
      console.error("Failed to load records from backend DB:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      setActiveTab(defaultTab);
      fetchRecords();
    }
  }, [isOpen, defaultTab]);

  const handleDelete = async (id: string) => {
    if (!confirm(`Are you sure you want to delete record ${id} from the database?`)) return;
    
    try {
      const res = await fetch(`/api/registrations/${id}`, {
        method: 'DELETE',
      });
      const json = await res.json();
      if (json.success) {
        setStatusMessage(`Record ${id} deleted successfully`);
        fetchRecords();
        setTimeout(() => setStatusMessage(null), 3000);
      }
    } catch (err) {
      console.error("Failed to delete record:", err);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRecord) return;

    try {
      const res = await fetch(`/api/registrations/${editingRecord.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingRecord),
      });
      const json = await res.json();
      if (json.success) {
        setStatusMessage(`Record ${editingRecord.id} updated in database`);
        setEditingRecord(null);
        fetchRecords();
        setTimeout(() => setStatusMessage(null), 3000);
      }
    } catch (err) {
      console.error("Failed to update record:", err);
    }
  };

  const exportCSV = () => {
    if (activeTab === 'registrations') {
      if (!records.length) return;
      const headers = ["ID", "Name", "Phone", "Email", "Track", "Status", "CreatedAt", "UpdatedAt"];
      const rows = records.map(r => [
        r.id,
        `"${r.name.replace(/"/g, '""')}"`,
        `"${r.phone}"`,
        `"${r.email}"`,
        `"${r.track || ''}"`,
        r.status,
        r.createdAt,
        r.updatedAt
      ]);

      const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `codeinindia_registrations_${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      if (!payments.length) return;
      const headers = ["PaymentID", "OrderID", "Amount", "Currency", "Status", "PlanName", "CustomerName", "CustomerEmail", "CustomerPhone", "VerifiedAt"];
      const rows = payments.map(p => [
        p.paymentId,
        p.orderId,
        (p.amount / 100).toFixed(2),
        p.currency,
        p.status,
        `"${p.planName || ''}"`,
        `"${p.customerName || ''}"`,
        `"${p.customerEmail || ''}"`,
        `"${p.customerPhone || ''}"`,
        p.verifiedAt
      ]);

      const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `codeinindia_payments_${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  if (!isOpen) return null;

  const filteredRecords = records.filter(r => 
    r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.phone.includes(searchQuery) ||
    r.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredPayments = payments.filter(p =>
    (p.paymentId || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (p.orderId || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (p.customerName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (p.customerEmail || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (p.planName || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-card dark:bg-[#0F172A] border border-border-custom dark:border-[#1E293B] rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-[scaleUp_0.2s_ease-out]">
        
        {/* Header */}
        <div className="p-5 border-b border-border-custom dark:border-[#1E293B] flex items-center justify-between bg-paper dark:bg-[#1E293B]/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-peacock/10 text-peacock flex items-center justify-center font-bold">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-extrabold text-lg text-ink dark:text-white flex items-center gap-2">
                Backend Database Store
              </h3>
              <p className="text-xs text-muted">
                Persistent JSON store · Registrations ({records.length}) · Razorpay Payments ({payments.length})
              </p>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="p-2 rounded-xl text-muted hover:text-ink dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="px-5 pt-3 pb-0 bg-paper dark:bg-[#1E293B]/30 border-b border-border-custom dark:border-[#1E293B] flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('registrations')}
            className={`pb-2.5 px-3 text-xs font-bold border-b-2 flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'registrations'
                ? 'border-peacock text-peacock'
                : 'border-transparent text-muted hover:text-ink dark:hover:text-white'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>Registrations Table ({records.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('payments')}
            className={`pb-2.5 px-3 text-xs font-bold border-b-2 flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'payments'
                ? 'border-peacock text-peacock'
                : 'border-transparent text-muted hover:text-ink dark:hover:text-white'
            }`}
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span>Razorpay Payments ({payments.length})</span>
          </button>
        </div>

        {/* Toolbar */}
        <div className="p-4 border-b border-border-custom dark:border-[#1E293B] flex flex-wrap gap-3 items-center justify-between bg-card">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-4 h-4 text-muted absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={activeTab === 'registrations' ? "Search registrations by name, email, phone, ID..." : "Search payments by Payment ID, Order ID, student..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-border-custom bg-paper dark:bg-[#1E293B] text-ink dark:text-white focus:outline-none focus:border-peacock"
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={fetchRecords}
              disabled={loading}
              className="btn btn-secondary text-xs py-2 px-3 flex items-center gap-1.5 cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh DB</span>
            </button>

            <button
              onClick={exportCSV}
              disabled={activeTab === 'registrations' ? !records.length : !payments.length}
              className="btn btn-primary text-xs py-2 px-3 flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {statusMessage && (
          <div className="bg-emerald-500/10 border-b border-emerald-500/20 text-emerald-600 dark:text-emerald-400 px-4 py-2 text-xs font-semibold flex items-center gap-2">
            <Check className="w-4 h-4" />
            <span>{statusMessage}</span>
          </div>
        )}

        {/* Content Table */}
        <div className="flex-1 overflow-auto p-4">
          {activeTab === 'registrations' ? (
            editingRecord ? (
              <form onSubmit={handleUpdate} className="bg-paper dark:bg-[#1E293B] p-5 rounded-xl border border-border-custom space-y-4 max-w-lg mx-auto">
                <h4 className="font-bold text-sm text-ink dark:text-white flex items-center justify-between">
                  <span>Edit Database Record: {editingRecord.id}</span>
                  <button type="button" onClick={() => setEditingRecord(null)} className="text-xs text-muted hover:underline">Cancel</button>
                </h4>

                <div>
                  <label className="block text-xs font-semibold text-muted mb-1">Full Name</label>
                  <input
                    type="text"
                    value={editingRecord.name}
                    onChange={e => setEditingRecord({ ...editingRecord, name: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-border-custom bg-card text-ink dark:text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-muted mb-1">Mobile Number</label>
                  <input
                    type="text"
                    value={editingRecord.phone}
                    onChange={e => setEditingRecord({ ...editingRecord, phone: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-border-custom bg-card text-ink dark:text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-muted mb-1">Email ID</label>
                  <input
                    type="email"
                    value={editingRecord.email}
                    onChange={e => setEditingRecord({ ...editingRecord, email: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-border-custom bg-card text-ink dark:text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-muted mb-1">Specialization Track</label>
                  <input
                    type="text"
                    value={editingRecord.track || ''}
                    onChange={e => setEditingRecord({ ...editingRecord, track: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-border-custom bg-card text-ink dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-muted mb-1">Status</label>
                  <select
                    value={editingRecord.status}
                    onChange={e => setEditingRecord({ ...editingRecord, status: e.target.value as any })}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-border-custom bg-card text-ink dark:text-white"
                  >
                    <option value="Confirmed">Confirmed</option>
                    <option value="Attended">Attended</option>
                    <option value="Contacted">Contacted</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button type="button" onClick={() => setEditingRecord(null)} className="btn btn-ghost text-xs py-2 px-3">
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary text-xs py-2 px-4">
                    Save Changes to DB
                  </button>
                </div>
              </form>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-border-custom dark:border-[#1E293B] text-muted font-mono uppercase text-[0.7rem] bg-paper dark:bg-[#1E293B]/30">
                      <th className="py-2.5 px-3">Record ID</th>
                      <th className="py-2.5 px-3">Full Name</th>
                      <th className="py-2.5 px-3">Mobile Number</th>
                      <th className="py-2.5 px-3">Email ID</th>
                      <th className="py-2.5 px-3">Status</th>
                      <th className="py-2.5 px-3">Created At</th>
                      <th className="py-2.5 px-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border-custom dark:divide-[#1E293B]">
                    {filteredRecords.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="text-center py-8 text-muted">
                          No database records found.
                        </td>
                      </tr>
                    ) : (
                      filteredRecords.map((r) => (
                        <tr key={r.id} className="hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                          <td className="py-2.5 px-3 font-mono font-bold text-peacock">{r.id}</td>
                          <td className="py-2.5 px-3 font-semibold text-ink dark:text-white">{r.name}</td>
                          <td className="py-2.5 px-3 font-mono text-muted">{r.phone}</td>
                          <td className="py-2.5 px-3 text-muted">{r.email}</td>
                          <td className="py-2.5 px-3">
                            <span className="px-2 py-0.5 rounded-full text-[0.68rem] font-mono font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                              {r.status}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 font-mono text-[0.68rem] text-muted">
                            {new Date(r.createdAt).toLocaleString()}
                          </td>
                          <td className="py-2.5 px-3 text-right space-x-1">
                            <button
                              onClick={() => setEditingRecord(r)}
                              className="p-1.5 rounded text-muted hover:text-peacock hover:bg-peacock/10 transition-colors cursor-pointer"
                              title="Edit Record"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDelete(r.id)}
                              className="p-1.5 rounded text-muted hover:text-red-500 hover:bg-red-500/10 transition-colors cursor-pointer"
                              title="Delete Record"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-border-custom dark:border-[#1E293B] text-muted font-mono uppercase text-[0.7rem] bg-paper dark:bg-[#1E293B]/30">
                    <th className="py-2.5 px-3">Payment ID</th>
                    <th className="py-2.5 px-3">Order ID</th>
                    <th className="py-2.5 px-3">Student / Customer</th>
                    <th className="py-2.5 px-3">Plan</th>
                    <th className="py-2.5 px-3">Amount</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3">Verified At</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-custom dark:divide-[#1E293B]">
                  {filteredPayments.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="text-center py-8 text-muted">
                        No verified Razorpay payments recorded yet. Make a payment via the checkout modal to see it verified here.
                      </td>
                    </tr>
                  ) : (
                    filteredPayments.map((p) => (
                      <tr key={p.paymentId} className="hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                        <td className="py-2.5 px-3 font-mono font-bold text-peacock">{p.paymentId}</td>
                        <td className="py-2.5 px-3 font-mono text-muted text-[0.7rem]">{p.orderId}</td>
                        <td className="py-2.5 px-3 font-semibold text-ink dark:text-white">
                          <div>{p.customerName || 'Anonymous Student'}</div>
                          <div className="text-[0.7rem] text-muted font-normal">{p.customerEmail}</div>
                        </td>
                        <td className="py-2.5 px-3 text-muted">{p.planName}</td>
                        <td className="py-2.5 px-3 font-mono font-bold text-ink dark:text-white">
                          ₹{(p.amount / 100).toLocaleString('en-IN')}
                        </td>
                        <td className="py-2.5 px-3">
                          <span className="px-2 py-0.5 rounded-full text-[0.68rem] font-mono font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center gap-1 w-fit">
                            <ShieldCheck className="w-3 h-3 text-emerald-500" />
                            VERIFIED
                          </span>
                        </td>
                        <td className="py-2.5 px-3 font-mono text-[0.68rem] text-muted">
                          {new Date(p.verifiedAt).toLocaleString()}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border-custom dark:border-[#1E293B] bg-paper dark:bg-[#1E293B]/50 flex items-center justify-between text-xs text-muted">
          <span className="flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-emerald-500" />
            Backend HMAC-SHA256 signature verification active on <code className="font-mono text-ink dark:text-white">/api/verify-payment</code>
          </span>
          <button onClick={onClose} className="btn btn-secondary text-xs py-1.5 px-3">
            Close
          </button>
        </div>

      </div>
    </div>
  );
}

