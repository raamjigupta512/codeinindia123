import React, { useState, useEffect } from 'react';
import { Share2, Plus, Users, DollarSign, Award, RefreshCw, Copy, Check } from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { ReferralCode } from '../../types/admin';

export const AdminReferralsView: React.FC = () => {
  const { token, hasRole } = useAdminAuth();
  const [referrals, setReferrals] = useState<ReferralCode[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // New Code Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [code, setCode] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [ownerEmail, setOwnerEmail] = useState('');
  const [discountPercent, setDiscountPercent] = useState(10);
  const [commissionPercent, setCommissionPercent] = useState(15);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchReferrals = async () => {
    if (!token) return;
    try {
      setIsLoading(true);
      const res = await fetch('/api/admin/referrals', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setReferrals(data.data || []);
      }
    } catch (e) {
      console.error('Error fetching referrals:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReferrals();
  }, [token]);

  const handleCopy = (referralCode: string) => {
    navigator.clipboard.writeText(`https://codeinindia.com/?ref=${referralCode}`);
    setCopiedCode(referralCode);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleCreateReferral = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !code.trim()) return;

    try {
      setIsSubmitting(true);
      const res = await fetch('/api/admin/referrals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          code: code.trim().toUpperCase(),
          ownerName: ownerName.trim(),
          ownerEmail: ownerEmail.trim(),
          discountPercent,
          commissionPercent
        })
      });
      const data = await res.json();
      if (data.success) {
        setIsModalOpen(false);
        setCode('');
        setOwnerName('');
        setOwnerEmail('');
        fetchReferrals();
      }
    } catch (e) {
      console.error('Error creating referral:', e);
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
            <span>Student & Campus Ambassador Referrals</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono font-bold">
              {referrals.length} Active Codes
            </span>
          </h2>
          <p className="text-xs text-slate-400">
            Track student referral codes, discount privileges, and ambassador commission payouts.
          </p>
        </div>

        {hasRole(['SUPER_ADMIN', 'ADMIN']) && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white text-xs font-bold transition-all shadow-lg flex items-center gap-2 cursor-pointer self-start"
          >
            <Plus className="w-4 h-4" />
            <span>Generate Referral Code</span>
          </button>
        )}
      </div>

      {/* Referral Table */}
      <div className="bg-[#0B1513] border border-[#1B2F2A] rounded-2xl overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0E1B18] text-slate-400 font-semibold border-b border-[#1B2F2A]">
              <tr>
                <th className="py-3.5 px-4">Referral Code</th>
                <th className="py-3.5 px-4">Ambassador Owner</th>
                <th className="py-3.5 px-4">Discount / Comm.</th>
                <th className="py-3.5 px-4">Conversions</th>
                <th className="py-3.5 px-4">Revenue Generated</th>
                <th className="py-3.5 px-4 text-right">Commission Due</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1B2F2A] text-slate-200">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500">
                    <RefreshCw className="w-5 h-5 animate-spin mx-auto text-emerald-400 mb-2" />
                    <span>Loading referral codes...</span>
                  </td>
                </tr>
              ) : referrals.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500">
                    No referral codes generated yet.
                  </td>
                </tr>
              ) : (
                referrals.map((ref) => (
                  <tr key={ref.id} className="hover:bg-[#0F1E1B] transition-colors">
                    
                    {/* Code */}
                    <td className="py-3.5 px-4 font-mono font-bold text-emerald-400">
                      <div className="flex items-center gap-2">
                        <span>{ref.code}</span>
                        <button
                          onClick={() => handleCopy(ref.code)}
                          className="p-1 rounded hover:bg-[#152522] text-slate-400 hover:text-white"
                          title="Copy shareable link"
                        >
                          {copiedCode === ref.code ? (
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </td>

                    {/* Owner */}
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-white">{ref.ownerName}</div>
                      <div className="text-[11px] text-slate-400">{ref.ownerEmail}</div>
                    </td>

                    {/* Rates */}
                    <td className="py-3.5 px-4">
                      <div className="text-slate-300 font-semibold">{ref.discountPercent}% Student Discount</div>
                      <div className="text-[10px] text-emerald-400">{ref.commissionPercent}% Commission</div>
                    </td>

                    {/* Uses */}
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-white">{ref.usesCount}</span>
                      <span className="text-slate-500 text-[10px] ml-1">students</span>
                    </td>

                    {/* Revenue */}
                    <td className="py-3.5 px-4 font-bold text-white">
                      ₹{ref.revenueGenerated.toLocaleString('en-IN')}
                    </td>

                    {/* Commission */}
                    <td className="py-3.5 px-4 text-right font-black text-emerald-400">
                      ₹{((ref.revenueGenerated * (ref.commissionPercent || 0)) / 100).toLocaleString('en-IN')}
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-[#0B1513] border border-[#1B2F2A] rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-[#1B2F2A]">
              <h3 className="text-sm font-bold text-white">Create Ambassador Referral Code</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleCreateReferral} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Coupon Code (Uppercase)</label>
                <input
                  type="text"
                  required
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  placeholder="e.g. CAMPUS_IITKGP_10"
                  className="w-full bg-[#070D0B] border border-[#1B2F2A] rounded-xl px-3 py-2 text-xs text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Ambassador Full Name</label>
                <input
                  type="text"
                  required
                  value={ownerName}
                  onChange={(e) => setOwnerName(e.target.value)}
                  placeholder="e.g. Rohan Sharma"
                  className="w-full bg-[#070D0B] border border-[#1B2F2A] rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Ambassador Email</label>
                <input
                  type="email"
                  required
                  value={ownerEmail}
                  onChange={(e) => setOwnerEmail(e.target.value)}
                  placeholder="rohan@campus.in"
                  className="w-full bg-[#070D0B] border border-[#1B2F2A] rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Discount %</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={discountPercent}
                    onChange={(e) => setDiscountPercent(Number(e.target.value))}
                    className="w-full bg-[#070D0B] border border-[#1B2F2A] rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Commission %</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={commissionPercent}
                    onChange={(e) => setCommissionPercent(Number(e.target.value))}
                    className="w-full bg-[#070D0B] border border-[#1B2F2A] rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3 py-1.5 rounded-lg bg-[#152522] text-xs font-semibold text-slate-300 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all disabled:opacity-50 cursor-pointer"
                >
                  {isSubmitting ? 'Creating...' : 'Activate Referral Code'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
