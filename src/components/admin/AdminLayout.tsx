import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  UserCheck, 
  CreditCard, 
  Calendar, 
  BookOpen, 
  BarChart3, 
  Share2, 
  Award, 
  MessageSquare, 
  ShieldAlert, 
  Settings, 
  LogOut, 
  ChevronLeft, 
  ChevronRight, 
  Search, 
  Bell, 
  ExternalLink,
  Shield,
  Layers,
  Sparkles,
  RefreshCw,
  CheckCircle2,
  Menu,
  X
} from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { AdminRole } from '../../types/admin';

export type AdminTab = 
  | 'overview' 
  | 'students' 
  | 'leads' 
  | 'payments' 
  | 'workshops' 
  | 'courses' 
  | 'analytics' 
  | 'referrals' 
  | 'certificates' 
  | 'communications' 
  | 'audit' 
  | 'settings';

interface AdminLayoutProps {
  activeTab: AdminTab;
  setActiveTab: (tab: AdminTab) => void;
  children: React.ReactNode;
  onNavigatePublic: () => void;
  onRefreshData?: () => void;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  activeTab,
  setActiveTab,
  children,
  onNavigatePublic,
  onRefreshData
}) => {
  const { admin, logout, viewMode, setViewMode, hasRole } = useAdminAuth();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const navItems: Array<{ id: AdminTab; label: string; icon: React.FC<any>; badge?: string; roles?: AdminRole[] }> = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'students', label: 'Paid Students', icon: UserCheck, badge: 'Active' },
    { id: 'leads', label: 'Leads & Pipeline', icon: Users },
    { id: 'payments', label: 'Payment Ledger', icon: CreditCard },
    { id: 'workshops', label: 'Live Workshops', icon: Calendar },
    { id: 'courses', label: 'Course Catalog', icon: BookOpen },
    { id: 'analytics', label: 'Attribution & ROI', icon: BarChart3 },
    { id: 'referrals', label: 'Referral Engine', icon: Share2 },
    { id: 'certificates', label: 'Certificates', icon: Award },
    { id: 'communications', label: 'Message Center', icon: MessageSquare },
    { id: 'audit', label: 'Audit Security Log', icon: ShieldAlert, roles: ['SUPER_ADMIN', 'ADMIN'] },
    { id: 'settings', label: 'Gateway & Team', icon: Settings }
  ];

  const handleRefresh = async () => {
    setIsRefreshing(true);
    if (onRefreshData) {
      await onRefreshData();
    }
    setTimeout(() => setIsRefreshing(false), 600);
  };

  const getRoleBadge = (role?: AdminRole) => {
    switch (role) {
      case 'SUPER_ADMIN':
        return <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-500/30">Super Admin</span>;
      case 'ADMIN':
        return <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-blue-950/80 text-blue-300 border border-blue-500/30">Operations Admin</span>;
      case 'SUPPORT':
        return <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-amber-950/80 text-amber-300 border border-amber-500/30">Support Desk</span>;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#070D0B] text-slate-100 flex flex-col antialiased selection:bg-emerald-500/30 selection:text-emerald-200">
      
      {/* Top Warning Banner for Sandbox / Test Mode */}
      {viewMode === 'test' && (
        <div className="bg-amber-950/90 border-b border-amber-600/40 text-amber-200 text-xs py-1.5 px-4 text-center font-medium flex items-center justify-center gap-2 sticky top-0 z-50 backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
          <span><strong>SANDBOX TEST MODE ACTIVE:</strong> Displaying simulated test payments and staging leads. Switch to Live mode for production ledger.</span>
          <button 
            onClick={() => setViewMode('live')}
            className="underline hover:text-white font-semibold ml-2 cursor-pointer"
          >
            Switch to Live Mode
          </button>
        </div>
      )}

      <div className="flex-1 flex overflow-hidden">
        
        {/* Desktop Sidebar */}
        <aside 
          className={`hidden md:flex flex-col bg-[#0B1513] border-r border-[#1B2F2A] transition-all duration-300 z-30 ${
            collapsed ? 'w-20' : 'w-64'
          }`}
        >
          {/* Logo & Brand Header */}
          <div className="h-16 px-4 flex items-center justify-between border-b border-[#1B2F2A]">
            {!collapsed && (
              <div className="flex items-center gap-2.5 overflow-hidden">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-900/40 shrink-0">
                  <Shield className="w-4 h-4 text-white" />
                </div>
                <div className="truncate">
                  <div className="font-bold text-sm text-white tracking-tight flex items-center gap-1.5">
                    CodeInIndia <span className="text-[10px] px-1.5 py-0.2 font-mono uppercase rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">Admin</span>
                  </div>
                  <div className="text-[11px] text-slate-400 truncate">Operations & Student Suite</div>
                </div>
              </div>
            )}

            {collapsed && (
              <div className="mx-auto w-8 h-8 rounded-lg bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-900/40">
                <Shield className="w-4 h-4 text-white" />
              </div>
            )}

            <button 
              onClick={() => setCollapsed(!collapsed)}
              className="p-1.5 rounded-md text-slate-400 hover:text-white hover:bg-[#152522] cursor-pointer transition-colors"
              title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 px-2.5 py-4 space-y-1 overflow-y-auto custom-scrollbar">
            {navItems.map((item) => {
              if (item.roles && !hasRole(item.roles)) {
                return null;
              }
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-all group cursor-pointer ${
                    isActive
                      ? 'bg-emerald-600/20 text-emerald-300 border border-emerald-500/40 font-semibold shadow-inner'
                      : 'text-slate-300 hover:text-white hover:bg-[#13221E]'
                  }`}
                  title={collapsed ? item.label : undefined}
                >
                  <Icon className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-110 ${isActive ? 'text-emerald-400' : 'text-slate-400 group-hover:text-emerald-300'}`} />
                  {!collapsed && (
                    <span className="truncate flex-1 text-left">{item.label}</span>
                  )}
                  {!collapsed && item.badge && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Bottom Admin User Status Card */}
          <div className="p-3 border-t border-[#1B2F2A] bg-[#0A1311]">
            {!collapsed ? (
              <div className="flex items-center gap-3">
                <img 
                  src={admin?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80"} 
                  alt={admin?.name || "Admin"} 
                  className="w-9 h-9 rounded-full border border-emerald-500/40 object-cover shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-semibold text-white truncate">{admin?.name || 'Administrator'}</div>
                  <div className="mt-0.5">{getRoleBadge(admin?.role)}</div>
                </div>
                <button
                  onClick={logout}
                  className="p-1.5 rounded-md text-slate-400 hover:text-rose-400 hover:bg-rose-950/30 transition-colors cursor-pointer"
                  title="Sign out of Admin Portal"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2">
                <img 
                  src={admin?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80"} 
                  alt={admin?.name || "Admin"} 
                  className="w-8 h-8 rounded-full border border-emerald-500/40 object-cover"
                />
                <button
                  onClick={logout}
                  className="p-1 rounded text-slate-400 hover:text-rose-400 cursor-pointer"
                  title="Log out"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        </aside>

        {/* Mobile Header & Drawer */}
        <div className="md:hidden fixed top-0 left-0 right-0 h-14 bg-[#0B1513] border-b border-[#1B2F2A] px-4 flex items-center justify-between z-40">
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-300 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <span className="font-bold text-sm text-white">CodeInIndia Admin</span>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={onNavigatePublic}
              className="text-xs text-emerald-400 flex items-center gap-1 hover:underline"
            >
              <span>Public Site</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Mobile Slide-out Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden fixed inset-0 top-14 bg-[#070D0B]/95 z-40 p-4 overflow-y-auto space-y-2">
            {navItems.map((item) => {
              if (item.roles && !hasRole(item.roles)) return null;
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium ${
                    activeTab === item.id 
                      ? 'bg-emerald-600/20 text-emerald-300 border border-emerald-500/40' 
                      : 'text-slate-300 hover:bg-[#13221E]'
                  }`}
                >
                  <Icon className="w-5 h-5 text-emerald-400" />
                  <span>{item.label}</span>
                </button>
              );
            })}
            <div className="pt-4 mt-4 border-t border-[#1B2F2A]">
              <button
                onClick={logout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-rose-400 hover:bg-rose-950/30"
              >
                <LogOut className="w-5 h-5" />
                <span>Log Out</span>
              </button>
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col min-w-0 bg-[#070D0B] overflow-y-auto pt-14 md:pt-0">
          
          {/* Top Bar / Header */}
          <header className="h-16 px-6 border-b border-[#1B2F2A] bg-[#0A1311]/80 backdrop-blur-md flex items-center justify-between gap-4 sticky top-0 z-20">
            {/* Left: Current Section Title & Breadcrumb */}
            <div className="flex items-center gap-3 min-w-0">
              <h1 className="text-base font-bold text-white tracking-tight capitalize truncate">
                {navItems.find(n => n.id === activeTab)?.label || 'Dashboard'}
              </h1>
              <span className="hidden sm:inline-block w-1.5 h-1.5 rounded-full bg-slate-600"></span>
              <span className="hidden sm:inline-block text-xs text-slate-400">
                CodeInIndia Enterprise Operations
              </span>
            </div>

            {/* Right Controls: Mode Toggle, Refresh, Public Site Link */}
            <div className="flex items-center gap-3 shrink-0">
              {/* Data Mode Switcher: ALL vs LIVE vs TEST */}
              <div className="hidden sm:flex items-center bg-[#0F1E1B] p-0.5 rounded-lg border border-[#1B2F2A] text-xs">
                <button
                  onClick={() => setViewMode('all')}
                  className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                    viewMode === 'all' 
                      ? 'bg-emerald-600 text-white font-semibold shadow' 
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  All Data
                </button>
                <button
                  onClick={() => setViewMode('live')}
                  className={`px-2.5 py-1 rounded-md transition-all cursor-pointer flex items-center gap-1.5 ${
                    viewMode === 'live' 
                      ? 'bg-teal-600 text-white font-semibold shadow' 
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  <span>Live Only</span>
                </button>
                <button
                  onClick={() => setViewMode('test')}
                  className={`px-2.5 py-1 rounded-md transition-all cursor-pointer flex items-center gap-1.5 ${
                    viewMode === 'test' 
                      ? 'bg-amber-600 text-white font-semibold shadow' 
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                  <span>Sandbox</span>
                </button>
              </div>

              {/* Refresh Button */}
              <button
                onClick={handleRefresh}
                className="p-2 rounded-lg bg-[#0F1E1B] border border-[#1B2F2A] text-slate-300 hover:text-emerald-400 hover:border-emerald-500/40 transition-all cursor-pointer"
                title="Refresh Live Data"
              >
                <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-emerald-400' : ''}`} />
              </button>

              {/* Public Website Button */}
              <button
                onClick={onNavigatePublic}
                className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0F1E1B] border border-[#1B2F2A] text-xs font-medium text-slate-300 hover:text-white hover:border-emerald-500/40 transition-all cursor-pointer"
              >
                <span>View Public Site</span>
                <ExternalLink className="w-3.5 h-3.5 text-emerald-400" />
              </button>
            </div>
          </header>

          {/* Page Body View Container */}
          <div className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
            {children}
          </div>

        </main>
      </div>
    </div>
  );
};
