import React, { useState, useEffect } from 'react';
import { 
  DollarSign, 
  Users, 
  UserCheck, 
  Calendar, 
  Award, 
  Clock, 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownRight,
  ShieldCheck,
  CreditCard,
  AlertTriangle,
  ChevronRight,
  Sparkles,
  RefreshCw,
  Eye,
  MessageCircle,
  ExternalLink
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { AdminPaymentRecord, Lead, DashboardMetrics } from '../../types/admin';

interface AdminDashboardOverviewProps {
  onNavigateTab: (tab: any) => void;
  onSelectStudent?: (studentId: string) => void;
}

export const AdminDashboardOverview: React.FC<AdminDashboardOverviewProps> = ({
  onNavigateTab,
  onSelectStudent
}) => {
  const { token, viewMode } = useAdminAuth();
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [trendDays, setTrendDays] = useState<any[]>([]);
  const [courseBreakdown, setCourseBreakdown] = useState<any[]>([]);
  const [recentPayments, setRecentPayments] = useState<AdminPaymentRecord[]>([]);
  const [recentLeads, setRecentLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchMetrics = async () => {
    if (!token) return;
    try {
      setIsLoading(true);
      const res = await fetch(`/api/admin/metrics?mode=${viewMode}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setMetrics(data.metrics);
        setTrendDays(data.trendDays || []);
        setCourseBreakdown(data.courseBreakdown || []);
        setRecentPayments(data.recentPayments || []);
        setRecentLeads(data.recentLeads || []);
      }
    } catch (err) {
      console.error('Error fetching dashboard metrics:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
  }, [token, viewMode]);

  const COLORS = ['#10B981', '#06B6D4', '#6366F1', '#F59E0B'];

  if (isLoading && !metrics) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3 text-slate-400">
          <RefreshCw className="w-6 h-6 animate-spin text-emerald-400" />
          <span className="text-xs">Loading Live Operation Metrics...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Verified Revenue */}
        <div className="bg-[#0B1513] border border-[#1B2F2A] rounded-2xl p-5 relative overflow-hidden group hover:border-emerald-500/40 transition-all shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Total Gross Revenue</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-white tracking-tight">
              ₹{(metrics?.totalRevenue || 0).toLocaleString('en-IN')}
            </div>
            <div className="flex items-center gap-2 mt-1 text-[11px] text-emerald-400">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>₹{(metrics?.todayRevenue || 0).toLocaleString('en-IN')} today</span>
              <span className="text-slate-500">•</span>
              <span className="text-slate-400">Verified gateway capture</span>
            </div>
          </div>
          <div className="absolute right-0 bottom-0 translate-x-4 translate-y-4 w-24 h-24 bg-emerald-500/5 rounded-full blur-xl pointer-events-none"></div>
        </div>

        {/* Paid Verified Students */}
        <div className="bg-[#0B1513] border border-[#1B2F2A] rounded-2xl p-5 relative overflow-hidden group hover:border-teal-500/40 transition-all shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Paid Active Students</span>
            <div className="p-2 rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/20">
              <UserCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-white tracking-tight">
              {metrics?.totalPaidStudents || 0}
            </div>
            <div className="flex items-center gap-1.5 mt-1 text-[11px] text-teal-400">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Enrollment IDs Issued</span>
              <span className="text-slate-500">•</span>
              <span className="text-slate-400">100% Verified</span>
            </div>
          </div>
        </div>

        {/* Leads in Pipeline */}
        <div className="bg-[#0B1513] border border-[#1B2F2A] rounded-2xl p-5 relative overflow-hidden group hover:border-blue-500/40 transition-all shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Unpaid Leads Pipeline</span>
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-white tracking-tight">
              {metrics?.totalUnpaidLeads || 0}
            </div>
            <div className="flex items-center gap-1.5 mt-1 text-[11px] text-blue-400">
              <span>{metrics?.workshopRegistrations || 0} Workshop Registrations</span>
            </div>
          </div>
        </div>

        {/* Avg Completion Rate */}
        <div className="bg-[#0B1513] border border-[#1B2F2A] rounded-2xl p-5 relative overflow-hidden group hover:border-amber-500/40 transition-all shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Avg Course Completion</span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-white tracking-tight">
              {metrics?.courseCompletionRate || 0}%
            </div>
            <div className="flex items-center gap-1.5 mt-1 text-[11px] text-amber-400">
              <Sparkles className="w-3.5 h-3.5" />
              <span>High student engagement</span>
            </div>
          </div>
        </div>

      </div>

      {/* Charts Section: 7-Day Revenue & Registration Trend */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Revenue Growth Trend Area Chart */}
        <div className="lg:col-span-2 bg-[#0B1513] border border-[#1B2F2A] rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-white">Daily Revenue Trend (INR)</h2>
              <p className="text-[11px] text-slate-400">Verified Razorpay payment transactions</p>
            </div>
            <button 
              onClick={() => onNavigateTab('payments')}
              className="text-xs text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>Ledger View</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendDays} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1B2F2A" vertical={false} />
                <XAxis dataKey="date" stroke="#64748B" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748B" fontSize={11} tickLine={false} tickFormatter={(v) => `₹${v / 1000}k`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#070D0B', borderColor: '#1B2F2A', borderRadius: '12px', fontSize: '12px' }}
                  formatter={(value: any) => [`₹${Number(value).toLocaleString('en-IN')}`, 'Revenue']}
                />
                <Area type="monotone" dataKey="revenue" stroke="#10B981" strokeWidth={2.5} fillOpacity={1} fill="url(#revenueGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Course Revenue Share */}
        <div className="bg-[#0B1513] border border-[#1B2F2A] rounded-2xl p-5 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-sm font-bold text-white">Course Revenue Share</h2>
              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono">Live</span>
            </div>
            <p className="text-[11px] text-slate-400 mb-4">Distribution by cohort track</p>

            <div className="space-y-3">
              {courseBreakdown.map((course, idx) => (
                <div key={course.id} className="p-2.5 rounded-xl bg-[#0F1E1B] border border-[#1B2F2A]">
                  <div className="flex items-center justify-between text-xs font-semibold text-white mb-1">
                    <span className="truncate pr-2">{course.name}</span>
                    <span className="text-emerald-400 shrink-0">₹{course.revenue.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-slate-400">
                    <span>{course.studentsCount} Enrolled Students</span>
                    <span>{metrics?.totalRevenue ? `${((course.revenue / metrics.totalRevenue) * 100).toFixed(0)}% share` : '0%'}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-[#1B2F2A] mt-4">
            <button
              onClick={() => onNavigateTab('courses')}
              className="w-full py-2 rounded-xl bg-[#152522] hover:bg-[#1C322E] text-xs font-semibold text-slate-200 text-center transition-all cursor-pointer"
            >
              Manage Course Pricing & Syllabus →
            </button>
          </div>
        </div>

      </div>

      {/* Two Columns: Recent Verified Payments vs Recent Leads */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Recent Verified Payments */}
        <div className="bg-[#0B1513] border border-[#1B2F2A] rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <span>Recent Gateway Transactions</span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              </h2>
              <p className="text-[11px] text-slate-400">Cryptographically confirmed payments</p>
            </div>
            <button
              onClick={() => onNavigateTab('payments')}
              className="text-xs text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>View All ({metrics?.totalPaidStudents || 0})</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-[#1B2F2A] overflow-hidden">
            {recentPayments.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-500">No payment records found.</div>
            ) : (
              recentPayments.map((p) => (
                <div key={p.id} className="py-3 flex items-center justify-between gap-3 group">
                  <div className="min-w-0">
                    <div className="text-xs font-semibold text-white truncate flex items-center gap-2">
                      <span>{p.studentName}</span>
                      {p.isTest && (
                        <span className="text-[9px] px-1 py-0.2 rounded bg-amber-500/20 text-amber-300 font-mono">TEST</span>
                      )}
                    </div>
                    <div className="text-[11px] text-slate-400 truncate">
                      {p.courseName} • <span className="font-mono text-slate-500">{p.id}</span>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="text-xs font-bold text-emerald-400">
                      ₹{p.amount.toLocaleString('en-IN')}
                    </div>
                    <div className="text-[10px] text-slate-500">
                      {new Date(p.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Unpaid Leads */}
        <div className="bg-[#0B1513] border border-[#1B2F2A] rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <span>Recent Form Inquiries & Leads</span>
                <span className="text-xs px-2 py-0.2 rounded-full bg-blue-500/20 text-blue-300 font-mono">Unpaid</span>
              </h2>
              <p className="text-[11px] text-slate-400">Students registered before gateway checkout</p>
            </div>
            <button
              onClick={() => onNavigateTab('leads')}
              className="text-xs text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>View All Pipeline</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-[#1B2F2A]">
            {recentLeads.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-500">No leads recorded yet.</div>
            ) : (
              recentLeads.map((lead) => (
                <div key={lead.id} className="py-3 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <div className="text-xs font-semibold text-white truncate flex items-center gap-2">
                      <span>{lead.name}</span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#152522] text-slate-400 font-mono">{lead.source}</span>
                    </div>
                    <div className="text-[11px] text-slate-400 truncate">
                      {lead.email} • {lead.phone}
                    </div>
                  </div>

                  <div className="shrink-0 text-right">
                    <span className="inline-block px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      {lead.followUpStatus.replace('_', ' ')}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
