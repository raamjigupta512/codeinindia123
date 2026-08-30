import React, { useState } from 'react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { AdminLayout, AdminTab } from './AdminLayout';
import { AdminLogin } from './AdminLogin';
import { AdminDashboardOverview } from './AdminDashboardOverview';
import { AdminStudentsView } from './AdminStudentsView';
import { AdminLeadsView } from './AdminLeadsView';
import { AdminPaymentsView } from './AdminPaymentsView';
import { AdminWorkshopsView } from './AdminWorkshopsView';
import { AdminCoursesView } from './AdminCoursesView';
import { AdminAnalyticsView } from './AdminAnalyticsView';
import { AdminReferralsView } from './AdminReferralsView';
import { AdminCertificatesView } from './AdminCertificatesView';
import { AdminCommunicationsView } from './AdminCommunicationsView';
import { AdminAuditLogView } from './AdminAuditLogView';
import { AdminSettingsView } from './AdminSettingsView';

interface AdminDashboardProps {
  onNavigatePublic: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigatePublic }) => {
  const { isAuthenticated, isLoading } = useAdminAuth();
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#070D0B] text-slate-100 flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <div className="text-xs text-slate-400 font-mono">Authenticating Secure Admin Session...</div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AdminLogin onNavigatePublic={onNavigatePublic} />;
  }

  return (
    <AdminLayout
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      onNavigatePublic={onNavigatePublic}
    >
      {activeTab === 'overview' && (
        <AdminDashboardOverview onNavigateTab={setActiveTab} />
      )}
      {activeTab === 'students' && <AdminStudentsView />}
      {activeTab === 'leads' && <AdminLeadsView />}
      {activeTab === 'payments' && <AdminPaymentsView />}
      {activeTab === 'workshops' && <AdminWorkshopsView />}
      {activeTab === 'courses' && <AdminCoursesView />}
      {activeTab === 'analytics' && <AdminAnalyticsView />}
      {activeTab === 'referrals' && <AdminReferralsView />}
      {activeTab === 'certificates' && <AdminCertificatesView />}
      {activeTab === 'communications' && <AdminCommunicationsView />}
      {activeTab === 'audit' && <AdminAuditLogView />}
      {activeTab === 'settings' && <AdminSettingsView />}
    </AdminLayout>
  );
};
