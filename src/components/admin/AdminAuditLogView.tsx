import React, { useState, useEffect } from 'react';
import { Shield, Search, RefreshCw, AlertCircle, CheckCircle2, User, KeyRound, Clock } from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { AuditLog } from '../../types/admin';

export const AdminAuditLogView: React.FC = () => {
  const { token } = useAdminAuth();
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [search, setSearch] = useState('');
  const [actionFilter, setActionFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  const fetchLogs = async () => {
    if (!token) return;
    try {
      setIsLoading(true);
      const res = await fetch('/api/admin/audit-logs', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setLogs(data.data || []);
      }
    } catch (e) {
      console.error('Error fetching audit logs:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [token]);

  const filteredLogs = logs.filter(log => {
    const detailsText = (log.details || log.action || log.targetName || '').toLowerCase();
    const matchesSearch = 
      log.action.toLowerCase().includes(search.toLowerCase()) ||
      log.adminName.toLowerCase().includes(search.toLowerCase()) ||
      detailsText.includes(search.toLowerCase());
    const matchesAction = actionFilter === 'all' || log.action === actionFilter;
    return matchesSearch && matchesAction;
  });

  const getSeverityBadge = (severity?: string) => {
    switch (severity) {
      case 'CRITICAL':
      case 'HIGH':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40 font-mono">CRITICAL</span>;
      case 'WARN':
      case 'MEDIUM':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 font-mono">WARN</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/40 font-mono">INFO</span>;
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
            <Shield className="w-5 h-5 text-emerald-400" />
            <span>Security & Compliance Audit Trail</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono font-bold">
              Immutable Log
            </span>
          </h2>
          <p className="text-xs text-slate-400">
            Append-only security log recording every financial override, refund, certificate issuance, and administrative action.
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
            placeholder="Search audit actions, admin actor, or details..."
            className="w-full bg-[#070D0B] border border-[#1B2F2A] rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </div>

        {/* Action Filter */}
        <div>
          <select
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
            className="w-full bg-[#070D0B] border border-[#1B2F2A] rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-emerald-500"
          >
            <option value="all">All Audit Action Types</option>
            <option value="STUDENT_OVERRIDE_PAYMENT">Financial Payment Overrides</option>
            <option value="PAYMENT_REFUNDED">Payment Refunds</option>
            <option value="CERTIFICATE_ISSUED">Certificate Issuances</option>
            <option value="BROADCAST_SENT">Communication Broadcasts</option>
            <option value="ADMIN_LOGIN">Admin Authentications</option>
          </select>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-[#0B1513] border border-[#1B2F2A] rounded-2xl overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0E1B18] text-slate-400 font-semibold border-b border-[#1B2F2A]">
              <tr>
                <th className="py-3.5 px-4">Timestamp (IST)</th>
                <th className="py-3.5 px-4">Action</th>
                <th className="py-3.5 px-4">Admin Actor & Role</th>
                <th className="py-3.5 px-4">Audit Details</th>
                <th className="py-3.5 px-4 text-right">Severity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1B2F2A] text-slate-200">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-500">
                    <RefreshCw className="w-5 h-5 animate-spin mx-auto text-emerald-400 mb-2" />
                    <span>Loading audit records...</span>
                  </td>
                </tr>
              ) : filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-500">
                    No audit records match the current filter criteria.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-[#0F1E1B] transition-colors">
                    
                    {/* Time */}
                    <td className="py-3.5 px-4 font-mono text-slate-400 shrink-0 whitespace-nowrap">
                      {new Date(log.timestamp).toLocaleString('en-IN', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit'
                      })}
                    </td>

                    {/* Action */}
                    <td className="py-3.5 px-4 font-mono font-bold text-white">
                      {log.action}
                    </td>

                    {/* Admin Actor */}
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-emerald-300">{log.adminName}</div>
                      <div className="text-[10px] text-slate-500 font-mono">
                        {log.adminRole} • IP: {log.ipAddress || '127.0.0.1'}
                      </div>
                    </td>

                    {/* Details */}
                    <td className="py-3.5 px-4 max-w-md">
                      <div className="text-slate-300 text-xs font-mono">{log.details || `${log.action} on ${log.targetName || log.targetType}`}</div>
                      {log.metadata && (
                        <pre className="text-[10px] text-slate-500 mt-1 truncate">
                          {JSON.stringify(log.metadata)}
                        </pre>
                      )}
                    </td>

                    {/* Severity */}
                    <td className="py-3.5 px-4 text-right">
                      {getSeverityBadge(log.severity)}
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
