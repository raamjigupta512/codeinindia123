import React, { useState } from 'react';
import { 
  Settings, 
  ShieldCheck, 
  KeyRound, 
  Webhook, 
  Copy, 
  Check, 
  Users, 
  Plus, 
  AlertCircle, 
  Sparkles,
  Server,
  CreditCard,
  RefreshCw,
  ExternalLink
} from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';

export const AdminSettingsView: React.FC = () => {
  const { currentAdmin, hasRole, token } = useAdminAuth();
  const [copiedWebhook, setCopiedWebhook] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulateSuccess, setSimulateSuccess] = useState<string | null>(null);

  // New admin state
  const [isAddAdminOpen, setIsAddAdminOpen] = useState(false);
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [newAdminName, setNewAdminName] = useState('');
  const [newAdminRole, setNewAdminRole] = useState<'ADMIN' | 'OPERATIONS' | 'SUPPORT'>('OPERATIONS');
  const [isCreatingAdmin, setIsCreatingAdmin] = useState(false);

  const webhookUrl = `${window.location.origin}/api/razorpay-webhook`;

  const handleCopyWebhook = () => {
    navigator.clipboard.writeText(webhookUrl);
    setCopiedWebhook(true);
    setTimeout(() => setCopiedWebhook(false), 2000);
  };

  const handleSimulateWebhook = async () => {
    try {
      setIsSimulating(true);
      setSimulateSuccess(null);
      
      const res = await fetch('/api/admin/simulate-webhook', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          studentName: 'Aarav Singhania',
          studentEmail: `aarav.test.${Date.now().toString().slice(-4)}@example.com`,
          studentMobile: '9876543210',
          courseId: 'crs-cohort-4w',
          courseName: 'Full-Stack 4-Week Live Cohort',
          amount: 4999,
          city: 'Bengaluru',
          state: 'Karnataka'
        })
      });

      const data = await res.json();
      if (data.success) {
        setSimulateSuccess(`Successfully simulated Razorpay payment webhook! Issued Enrollment ID: ${data.enrollmentId}`);
      }
    } catch (e) {
      console.error('Error simulating webhook:', e);
    } finally {
      setIsSimulating(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div>
        <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
          <Settings className="w-5 h-5 text-emerald-400" />
          <span>Gateway Configuration & Operational Settings</span>
        </h2>
        <p className="text-xs text-slate-400">
          Manage payment gateway keys, webhook endpoints, and role-based staff access permissions.
        </p>
      </div>

      {simulateSuccess && (
        <div className="p-4 rounded-xl bg-emerald-950/70 border border-emerald-500 text-emerald-200 text-xs flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{simulateSuccess}</span>
        </div>
      )}

      {/* Razorpay Gateway Health & Webhooks */}
      <div className="bg-[#0B1513] border border-[#1B2F2A] rounded-2xl p-6 shadow-lg space-y-6">
        <div className="flex items-center justify-between border-b border-[#1B2F2A] pb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <CreditCard className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Razorpay Payment Gateway Infrastructure</h3>
              <p className="text-xs text-slate-400">Webhook-First Cryptographic Verification</p>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Gateway Ready</span>
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Key ID Status */}
          <div className="p-4 rounded-xl bg-[#0F1E1B] border border-[#1B2F2A] space-y-2">
            <div className="text-xs font-semibold text-slate-400">Razorpay Key ID</div>
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs text-white">rzp_live_••••••••••••••</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono">ACTIVE</span>
            </div>
          </div>

          {/* Key Secret Status */}
          <div className="p-4 rounded-xl bg-[#0F1E1B] border border-[#1B2F2A] space-y-2">
            <div className="text-xs font-semibold text-slate-400">Webhook Secret & Signature Verification</div>
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs text-white">HMAC-SHA256 Secret Injected</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono">PROTECTED</span>
            </div>
          </div>

        </div>

        {/* Webhook Endpoint URL */}
        <div className="p-4 rounded-xl bg-[#070D0B] border border-[#1B2F2A] space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Webhook className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-bold text-white">Production Razorpay Webhook Endpoint</span>
            </div>
            <span className="text-[11px] text-slate-400">Paste in Razorpay Dashboard → Webhooks</span>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={webhookUrl}
              className="flex-1 bg-[#0B1513] border border-[#1B2F2A] rounded-xl px-4 py-2.5 text-xs text-emerald-300 font-mono select-all"
            />
            <button
              onClick={handleCopyWebhook}
              className="px-4 py-2.5 rounded-xl bg-[#152522] hover:bg-emerald-600 hover:text-white text-slate-200 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
            >
              {copiedWebhook ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span>{copiedWebhook ? 'Copied' : 'Copy URL'}</span>
            </button>
          </div>

          <div className="text-[11px] text-slate-400 flex flex-wrap gap-2 pt-1">
            <span className="text-slate-500">Subscribed Events:</span>
            <span className="px-1.5 py-0.5 rounded bg-[#152522] text-slate-300 font-mono">payment.captured</span>
            <span className="px-1.5 py-0.5 rounded bg-[#152522] text-slate-300 font-mono">order.paid</span>
            <span className="px-1.5 py-0.5 rounded bg-[#152522] text-slate-300 font-mono">payment.failed</span>
            <span className="px-1.5 py-0.5 rounded bg-[#152522] text-slate-300 font-mono">refund.created</span>
          </div>
        </div>

        {/* Test Webhook Simulator */}
        <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>Simulate Real Gateway Webhook</span>
            </h4>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Fires a cryptographic webhook event to verify payment capture, lead conversion, and enrollment ID generation.
            </p>
          </div>

          <button
            onClick={handleSimulateWebhook}
            disabled={isSimulating}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow cursor-pointer disabled:opacity-50 shrink-0 flex items-center gap-2"
          >
            {isSimulating ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Simulating...</span>
              </>
            ) : (
              <span>Simulate Gateway Capture</span>
            )}
          </button>
        </div>

      </div>

      {/* Staff Accounts & RBAC Roles */}
      <div className="bg-[#0B1513] border border-[#1B2F2A] rounded-2xl p-6 shadow-lg space-y-4">
        <div className="flex items-center justify-between border-b border-[#1B2F2A] pb-3">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Users className="w-4 h-4 text-emerald-400" />
              <span>Operations Staff & Role Permissions</span>
            </h3>
            <p className="text-xs text-slate-400">Strict separation of duties and security controls</p>
          </div>
        </div>

        <div className="divide-y divide-[#1B2F2A]">
          <div className="py-3 flex items-center justify-between text-xs">
            <div>
              <div className="font-bold text-white">Harsh Vardhan (You)</div>
              <div className="text-[11px] text-slate-400">admin@codeinindia.in</div>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
              SUPER ADMIN
            </span>
          </div>

          <div className="py-3 flex items-center justify-between text-xs">
            <div>
              <div className="font-bold text-white">Priya Sharma</div>
              <div className="text-[11px] text-slate-400">operations@codeinindia.in</div>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/40">
              OPERATIONS
            </span>
          </div>

          <div className="py-3 flex items-center justify-between text-xs">
            <div>
              <div className="font-bold text-white">Support Desk Desk</div>
              <div className="text-[11px] text-slate-400">support@codeinindia.in</div>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
              SUPPORT DESK
            </span>
          </div>
        </div>
      </div>

    </div>
  );
};
