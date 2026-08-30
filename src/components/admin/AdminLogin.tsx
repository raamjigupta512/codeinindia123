import React, { useState } from 'react';
import { Shield, Lock, Mail, ArrowRight, Sparkles, KeyRound, AlertCircle, CheckCircle } from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';

interface AdminLoginProps {
  onNavigatePublic: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onNavigatePublic }) => {
  const { login } = useAdminAuth();
  const [email, setEmail] = useState('admin@codeinindia.in');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const res = await login(email, password);
    if (!res.success) {
      setError(res.error || 'Authentication failed. Please check your credentials.');
    }
    setIsSubmitting(false);
  };

  const handleRolePreset = (presetEmail: string) => {
    setEmail(presetEmail);
    setPassword('admin123');
    setError(null);
  };

  return (
    <div className="min-h-screen bg-[#070D0B] text-slate-100 flex items-center justify-center p-4 relative overflow-hidden antialiased">
      
      {/* Background Decorative Gradients */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-teal-600/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-md bg-[#0B1614] border border-[#1B2F2A] rounded-2xl p-6 sm:p-8 shadow-2xl relative z-10">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex p-3 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white shadow-lg shadow-emerald-900/50 mb-4">
            <Shield className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            CodeInIndia Admin Portal
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Authorized Operations, Student & Revenue Management
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-3.5 rounded-lg bg-rose-950/50 border border-rose-600/50 text-rose-200 text-xs flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
            <div>{error}</div>
          </div>
        )}

        {/* Quick Demo Role Switcher */}
        <div className="mb-6 p-3 rounded-xl bg-[#0F1E1B] border border-[#1B2F2A]">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <KeyRound className="w-3.5 h-3.5 text-emerald-400" />
            <span>Select Demo Staff Role:</span>
          </div>
          <div className="grid grid-cols-3 gap-1.5">
            <button
              type="button"
              onClick={() => handleRolePreset('admin@codeinindia.in')}
              className={`px-2 py-1.5 rounded-lg text-[11px] font-medium border transition-all cursor-pointer truncate ${
                email === 'admin@codeinindia.in'
                  ? 'bg-emerald-600 text-white border-emerald-500 shadow'
                  : 'bg-[#152522] border-[#203933] text-slate-300 hover:text-white'
              }`}
            >
              Super Admin
            </button>
            <button
              type="button"
              onClick={() => handleRolePreset('operations@codeinindia.in')}
              className={`px-2 py-1.5 rounded-lg text-[11px] font-medium border transition-all cursor-pointer truncate ${
                email === 'operations@codeinindia.in'
                  ? 'bg-blue-600 text-white border-blue-500 shadow'
                  : 'bg-[#152522] border-[#203933] text-slate-300 hover:text-white'
              }`}
            >
              Operations
            </button>
            <button
              type="button"
              onClick={() => handleRolePreset('support@codeinindia.in')}
              className={`px-2 py-1.5 rounded-lg text-[11px] font-medium border transition-all cursor-pointer truncate ${
                email === 'support@codeinindia.in'
                  ? 'bg-amber-600 text-white border-amber-500 shadow'
                  : 'bg-[#152522] border-[#203933] text-slate-300 hover:text-white'
              }`}
            >
              Support Desk
            </button>
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Admin Work Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@codeinindia.in"
                className="w-full bg-[#070D0B] border border-[#1B2F2A] rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Security Key / Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#070D0B] border border-[#1B2F2A] rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 text-white text-xs font-bold shadow-lg shadow-emerald-950/60 hover:from-emerald-500 hover:to-teal-400 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isSubmitting ? (
              <span>Authenticating Session...</span>
            ) : (
              <>
                <span>Access Admin Console</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Footer Navigation Back to Public Site */}
        <div className="mt-8 pt-6 border-t border-[#1B2F2A] text-center">
          <button
            type="button"
            onClick={onNavigatePublic}
            className="text-xs text-slate-400 hover:text-emerald-400 transition-colors inline-flex items-center gap-1.5 cursor-pointer"
          >
            <span>← Return to Public Website (codeinindia.com)</span>
          </button>
        </div>

      </div>
    </div>
  );
};
