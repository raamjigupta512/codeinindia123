import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Filter, Share2, RefreshCw, ArrowUpRight, DollarSign, Target } from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';

export const AdminAnalyticsView: React.FC = () => {
  const { token } = useAdminAuth();
  const [analytics, setAnalytics] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAnalytics = async () => {
    if (!token) return;
    try {
      setIsLoading(true);
      const res = await fetch('/api/admin/analytics', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setAnalytics(data);
      }
    } catch (e) {
      console.error('Error fetching analytics:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [token]);

  if (isLoading && !analytics) {
    return (
      <div className="py-16 text-center text-slate-500">
        <RefreshCw className="w-6 h-6 animate-spin mx-auto text-emerald-400 mb-2" />
        <span className="text-xs">Computing Marketing Attribution & Funnel Metrics...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div>
        <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
          <span>Marketing Attribution & Revenue Funnel</span>
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono font-bold">
            Live Attribution
          </span>
        </h2>
        <p className="text-xs text-slate-400">
          Trace campaign performance across Instagram, YouTube, Google Ads, and Referral Ambassadors.
        </p>
      </div>

      {/* Top High-level Financial Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-[#0B1513] border border-[#1B2F2A] shadow-lg">
          <span className="text-xs font-medium text-slate-400">Net Captured Revenue</span>
          <div className="text-2xl font-black text-emerald-400 mt-1">
            ₹{(analytics?.totalNetRevenue || 0).toLocaleString('en-IN')}
          </div>
          <span className="text-[10px] text-slate-500">After all completed orders</span>
        </div>

        <div className="p-4 rounded-2xl bg-[#0B1513] border border-[#1B2F2A] shadow-lg">
          <span className="text-xs font-medium text-slate-400">Average Order Value (AOV)</span>
          <div className="text-2xl font-black text-teal-300 mt-1">
            ₹{(analytics?.avgOrderValue || 0).toLocaleString('en-IN')}
          </div>
          <span className="text-[10px] text-slate-500">Per enrolled cohort student</span>
        </div>

        <div className="p-4 rounded-2xl bg-[#0B1513] border border-[#1B2F2A] shadow-lg">
          <span className="text-xs font-medium text-slate-400">End-to-End Visitor Conversion</span>
          <div className="text-2xl font-black text-purple-300 mt-1">
            2.94%
          </div>
          <span className="text-[10px] text-slate-500">High-intent developer traffic</span>
        </div>
      </div>

      {/* Channel Attribution Breakdown Table */}
      <div className="bg-[#0B1513] border border-[#1B2F2A] rounded-2xl overflow-hidden shadow-lg">
        <div className="p-4 bg-[#0E1B18] border-b border-[#1B2F2A] flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white">Campaign & Traffic Source ROI</h3>
            <p className="text-[11px] text-slate-400">UTM-tagged leads converted into paid students</p>
          </div>
          <span className="text-xs font-mono text-emerald-400">Multi-Touch</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0A1311] text-slate-400 font-semibold border-b border-[#1B2F2A]">
              <tr>
                <th className="py-3 px-4">Marketing Channel</th>
                <th className="py-3 px-4">Inquiries / Leads</th>
                <th className="py-3 px-4">Paid Conversions</th>
                <th className="py-3 px-4">Conversion %</th>
                <th className="py-3 px-4 text-right">Attributed Revenue</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1B2F2A] text-slate-200">
              {analytics?.attribution?.map((ch: any, idx: number) => (
                <tr key={idx} className="hover:bg-[#0F1E1B] transition-colors">
                  <td className="py-3.5 px-4 font-bold text-white flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                    <span>{ch.channel}</span>
                  </td>
                  <td className="py-3.5 px-4">{ch.leads} leads</td>
                  <td className="py-3.5 px-4 font-semibold text-emerald-400">{ch.paidStudents} students</td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 font-mono">
                      {ch.conversionRate}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right font-black text-white">
                    ₹{ch.revenue.toLocaleString('en-IN')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Conversion Funnel Visualizer */}
      <div className="bg-[#0B1513] border border-[#1B2F2A] rounded-2xl p-5 shadow-lg space-y-4">
        <div>
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Target className="w-4 h-4 text-emerald-400" />
            <span>Full-Funnel Student Conversion Journey</span>
          </h3>
          <p className="text-[11px] text-slate-400">Step-by-step dropoff from website landing to paid verification</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-2">
          {analytics?.funnel?.map((step: any, idx: number) => (
            <div key={idx} className="p-4 rounded-xl bg-[#0F1E1B] border border-[#1B2F2A] space-y-2 relative overflow-hidden">
              <div className="text-[10px] text-slate-500 font-mono uppercase">Step {idx + 1}</div>
              <div className="text-xs font-bold text-slate-200">{step.step}</div>
              <div className="text-xl font-black text-emerald-400">{step.count.toLocaleString('en-IN')}</div>
              <div className="text-[11px] text-teal-300 font-medium">
                {step.percentage} conversion rate
              </div>
              <div className="w-full bg-[#070D0B] h-1 rounded-full overflow-hidden mt-2">
                <div 
                  className="bg-emerald-500 h-full rounded-full"
                  style={{ width: `${Math.max(10, 100 - idx * 25)}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
