import React, { useState, useEffect } from 'react';
import { 
  CreditCard, 
  Search, 
  ShieldCheck, 
  AlertCircle, 
  ChevronLeft, 
  ChevronRight, 
  RefreshCw, 
  Eye, 
  RotateCcw, 
  CheckCircle2, 
  XCircle,
  FileText,
  Clock,
  ExternalLink,
  ShieldAlert
} from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { AdminPaymentRecord } from '../../types/admin';
import { ConfirmationModal } from './ConfirmationModal';

export const AdminPaymentsView: React.FC = () => {
  const { token, viewMode, hasRole } = useAdminAuth();
  const [payments, setPayments] = useState<AdminPaymentRecord[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Detail Drawer
  const [selectedPayment, setSelectedPayment] = useState<AdminPaymentRecord | null>(null);

  // Refund Modal State
  const [isRefundModalOpen, setIsRefundModalOpen] = useState(false);
  const [refundReason, setRefundReason] = useState('');
  const [refundAmountInput, setRefundAmountInput] = useState<number>(0);
  const [isProcessingRefund, setIsProcessingRefund] = useState(false);

  const fetchPayments = async () => {
    if (!token) return;
    try {
      setIsLoading(true);
      const params = new URLSearchParams({
        search,
        status: statusFilter,
        mode: viewMode,
        page: String(page),
        limit: '20'
      });

      const res = await fetch(`/api/admin/payments?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setPayments(data.data || []);
        setTotalPages(data.totalPages || 1);
        setTotalCount(data.total || 0);
      }
    } catch (e) {
      console.error('Error fetching payments:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, [token, search, statusFilter, viewMode, page]);

  const handleOpenRefund = (payment: AdminPaymentRecord) => {
    setSelectedPayment(payment);
    setRefundAmountInput(payment.amount);
    setRefundReason('');
    setIsRefundModalOpen(true);
  };

  const handleProcessRefund = async (e?: React.FormEvent | { reason?: string }) => {
    if (e && 'preventDefault' in e && typeof e.preventDefault === 'function') {
      e.preventDefault();
    }
    if (!selectedPayment || !token) return;
    const effectiveReason = (
      (e && 'reason' in e && typeof e.reason === 'string' ? e.reason : undefined) || 
      refundReason || ''
    ).trim();
    if (!effectiveReason) {
      alert('Mandatory refund reason must be provided');
      return;
    }

    try {
      setIsProcessingRefund(true);
      const res = await fetch(`/api/admin/payments/${selectedPayment.id}/refund`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          reason: effectiveReason,
          refundAmount: refundAmountInput || selectedPayment.amount
        })
      });
      const resData = await res.json();
      if (resData.success) {
        setIsRefundModalOpen(false);
        setSelectedPayment(null);
        fetchPayments();
      } else {
        alert(resData.error || 'Failed to process refund');
      }
    } catch (err: any) {
      console.error('Error processing refund:', err);
      alert(err.message || 'Failed to process refund');
    } finally {
      setIsProcessingRefund(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
            <span>Payment Transactions & Gateway Ledger</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono font-bold">
              {totalCount} Transactions
            </span>
          </h2>
          <p className="text-xs text-slate-400">
            Immutable transaction records verified via HMAC-SHA256 signatures & Razorpay Webhooks.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[#0B1513] border border-[#1B2F2A] rounded-2xl p-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by Payment ID, Order ID, customer email..."
            className="w-full bg-[#070D0B] border border-[#1B2F2A] rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </div>

        {/* Status Filter */}
        <div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full bg-[#070D0B] border border-[#1B2F2A] rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-emerald-500"
          >
            <option value="all">All Payment Statuses</option>
            <option value="PAID">PAID (Verified)</option>
            <option value="PENDING">PENDING</option>
            <option value="FAILED">FAILED</option>
            <option value="REFUNDED">REFUNDED</option>
          </select>
        </div>
      </div>

      {/* Payments Table */}
      <div className="bg-[#0B1513] border border-[#1B2F2A] rounded-2xl overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0E1B18] text-slate-400 font-semibold border-b border-[#1B2F2A]">
              <tr>
                <th className="py-3.5 px-4">Payment ID & Order</th>
                <th className="py-3.5 px-4">Customer Details</th>
                <th className="py-3.5 px-4">Course / Product</th>
                <th className="py-3.5 px-4">Amount</th>
                <th className="py-3.5 px-4">Status & Gateway</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1B2F2A] text-slate-200">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500">
                    <RefreshCw className="w-5 h-5 animate-spin mx-auto text-emerald-400 mb-2" />
                    <span>Loading payment ledger...</span>
                  </td>
                </tr>
              ) : payments.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500">
                    No payment records match the current filters.
                  </td>
                </tr>
              ) : (
                payments.map((pay) => (
                  <tr key={pay.id} className="hover:bg-[#0F1E1B] transition-colors">
                    
                    {/* Payment & Order ID */}
                    <td className="py-3.5 px-4 font-mono">
                      <div className="font-bold text-white flex items-center gap-1.5">
                        <span>{pay.id}</span>
                        {pay.isTest && (
                          <span className="text-[9px] px-1 py-0.2 rounded bg-amber-500/20 text-amber-300">TEST</span>
                        )}
                      </div>
                      <div className="text-[10px] text-slate-500 mt-0.5">
                        Order: {pay.orderId}
                      </div>
                    </td>

                    {/* Customer */}
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-white">{pay.studentName}</div>
                      <div className="text-[11px] text-slate-400">{pay.studentEmail} • {pay.studentMobile}</div>
                    </td>

                    {/* Course */}
                    <td className="py-3.5 px-4">
                      <div className="text-slate-300 font-medium truncate max-w-[180px]">
                        {pay.courseName}
                      </div>
                      <div className="text-[10px] text-slate-500">
                        {new Date(pay.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </td>

                    {/* Amount */}
                    <td className="py-3.5 px-4">
                      <div className="font-black text-sm text-emerald-400">
                        ₹{pay.amount.toLocaleString('en-IN')}
                      </div>
                      <div className="text-[10px] text-slate-500">{pay.paymentMethod || 'Razorpay'}</div>
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4">
                      {pay.status === 'PAID' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>PAID</span>
                        </span>
                      ) : pay.status === 'FAILED' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                          <XCircle className="w-3 h-3" />
                          <span>FAILED</span>
                        </span>
                      ) : pay.status === 'REFUNDED' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                          <RotateCcw className="w-3 h-3" />
                          <span>REFUNDED</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                          <Clock className="w-3 h-3" />
                          <span>PENDING</span>
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedPayment(pay)}
                          className="px-2.5 py-1.5 rounded-lg bg-[#152522] hover:bg-emerald-600 hover:text-white text-slate-300 text-xs font-semibold transition-all cursor-pointer flex items-center gap-1"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Audit Lifecycle</span>
                        </button>

                        {pay.status === 'PAID' && hasRole(['SUPER_ADMIN']) && (
                          <button
                            onClick={() => handleOpenRefund(pay)}
                            className="p-1.5 rounded-lg bg-rose-950/40 hover:bg-rose-600 text-rose-300 hover:text-white transition-all cursor-pointer"
                            title="Process Gateway Refund"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
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

      {/* Audit Lifecycle Drawer / Modal */}
      {selectedPayment && !isRefundModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-[#0B1513] border border-[#1B2F2A] rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-5">
            
            <div className="flex items-center justify-between pb-3 border-b border-[#1B2F2A]">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-emerald-400" />
                  <span>Transaction Lifecycle Audit</span>
                </h3>
                <span className="font-mono text-[11px] text-slate-400">{selectedPayment.id}</span>
              </div>
              <button onClick={() => setSelectedPayment(null)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            {/* Snapshot */}
            <div className="p-3.5 rounded-xl bg-[#0F1E1B] border border-[#1B2F2A] grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-slate-400 text-[11px]">Customer:</span>
                <div className="font-bold text-white">{selectedPayment.studentName}</div>
              </div>
              <div>
                <span className="text-slate-400 text-[11px]">Amount Captured:</span>
                <div className="font-bold text-emerald-400">₹{selectedPayment.amount.toLocaleString('en-IN')}</div>
              </div>
              <div>
                <span className="text-slate-400 text-[11px]">Order ID:</span>
                <div className="font-mono text-slate-300">{selectedPayment.orderId}</div>
              </div>
              <div>
                <span className="text-slate-400 text-[11px]">Payment Method:</span>
                <div className="text-slate-300">{selectedPayment.paymentMethod}</div>
              </div>
            </div>

            {/* Lifecycle Timeline Steps */}
            <div>
              <div className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">Verification Step Sequence</div>
              <div className="space-y-2.5">
                {selectedPayment.lifecycle && selectedPayment.lifecycle.length > 0 ? (
                  selectedPayment.lifecycle.map((step, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-[#070D0B] border border-[#1B2F2A] flex items-start gap-3">
                      <div className="p-1 rounded bg-emerald-500/10 text-emerald-400 shrink-0 mt-0.5">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between text-[11px]">
                          <span className="font-bold text-slate-200">{step.stage.replace('_', ' ')}</span>
                          <span className="text-slate-500">{new Date(step.timestamp).toLocaleTimeString('en-IN')}</span>
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5">{step.details}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-3 rounded-xl bg-[#070D0B] text-xs text-slate-400">
                    Standard HMAC-SHA256 signature verified upon callback.
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedPayment(null)}
                className="px-4 py-2 rounded-xl bg-[#152522] hover:bg-[#1C322E] text-xs font-semibold text-slate-200"
              >
                Close Audit View
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Refund Confirmation Modal (Super Admin Only) */}
      {isRefundModalOpen && selectedPayment && (
        <div className="fixed inset-0 z-60 bg-black/90 flex items-center justify-center p-4">
          <div className="bg-[#0B1513] border border-rose-600/50 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-2 text-rose-400">
              <ShieldAlert className="w-5 h-5" />
              <h3 className="text-sm font-bold text-white">Process Gateway Refund</h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Initiate a verified refund of <strong>₹{selectedPayment.amount.toLocaleString('en-IN')}</strong> for <strong>{selectedPayment.studentName}</strong>. This will revoke the active enrollment status and record a permanent audit entry.
            </p>
            <form onSubmit={handleProcessRefund} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Reason for Refund (Mandatory)
                </label>
                <textarea
                  required
                  rows={3}
                  value={refundReason}
                  onChange={(e) => setRefundReason(e.target.value)}
                  placeholder="e.g. Student requested cancellation within the 24-hour guarantee policy..."
                  className="w-full bg-[#070D0B] border border-[#1B2F2A] rounded-xl p-3 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-rose-500"
                ></textarea>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsRefundModalOpen(false)}
                  className="px-3 py-2 rounded-xl bg-[#152522] text-slate-300 text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isProcessingRefund}
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-all cursor-pointer disabled:opacity-50"
                >
                  {isProcessingRefund ? 'Authorizing Refund...' : 'Confirm & Process Refund'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
