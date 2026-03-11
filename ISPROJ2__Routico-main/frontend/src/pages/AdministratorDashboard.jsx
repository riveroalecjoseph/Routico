import { useEffect, useState } from 'react';
import { useAuth } from '../auth/AuthContext';
import { useToast } from '../components/Toast';
import AdministratorBillingCharts from '../components/AdministratorBillingCharts';
import AdministratorCharts from '../components/AdministratorCharts';
import AdministratorIssues from '../components/AdministratorIssues';
import AdministratorPaymentReview from '../components/AdministratorPaymentReview';
import AdministratorRoleManagement from '../components/AdministratorRoleManagement';
import AdministratorAuditLogs from '../components/AdministratorAuditLogs';
import AdministratorUserManagement from '../components/AdministratorUserManagement';
import Footer from '../components/Footer';
import Header from '../components/Header';

const AdministratorDashboard = () => {
  const { user, getToken } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    pendingApprovals: 0,
    activeBusinesses: 0,
    suspendedBusinesses: 0,
    totalApprovedBusinesses: 0,
    totalRevenue: 0,
    totalDrivers: 0
  });

  const [pendingUsers, setPendingUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = getToken();
      // Fetch dashboard statistics
      const statsResponse = await fetch('http://localhost:3001/api/auth/dashboard-stats', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        setStats(statsData);
      } else {
        throw new Error('Failed to fetch dashboard statistics');
      }

      // Fetch pending users
      const pendingResponse = await fetch('http://localhost:3001/api/auth/pending-users', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (pendingResponse.ok) {
        const pendingData = await pendingResponse.json();
        setPendingUsers(pendingData);
      } else {
        // Don't throw error for pending users, just use empty array
        setPendingUsers([]);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError('Failed to load dashboard data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleApproveUser = async (userId) => {
    try {
      const token = getToken();
      const response = await fetch(`http://localhost:3001/api/auth/user/${userId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          account_status: 'approved',
          active_status: 'active'
        })
      });

      if (response.ok) {
        // Update local state
        setPendingUsers(prev => prev.filter(user => user.user_id !== userId));
        setStats(prev => ({ ...prev, pendingApprovals: prev.pendingApprovals - 1, activeBusinesses: prev.activeBusinesses + 1 }));
        toast.success('User approved successfully!');
      } else {
        const errorData = await response.json();
        toast.error(`Error approving user: ${errorData.error}`);
      }
    } catch (error) {
      console.error('Error approving user:', error);
      toast.error('Error approving user. Please try again.');
    }
  };

  const handleRejectUser = async (userId) => {
    try {
      const token = getToken();
      const response = await fetch(`http://localhost:3001/api/auth/user/${userId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          account_status: 'rejected'
        })
      });

      if (response.ok) {
        // Update local state
        setPendingUsers(prev => prev.filter(user => user.user_id !== userId));
        setStats(prev => ({ ...prev, pendingApprovals: prev.pendingApprovals - 1 }));
        toast.success('User rejected successfully!');
      } else {
        const errorData = await response.json();
        toast.error(`Error rejecting user: ${errorData.error}`);
      }
    } catch (error) {
      console.error('Error rejecting user:', error);
    }
  };

  const handleViewDocument = async (userId, userName) => {
    try {
      const token = getToken();
      const response = await fetch(`http://localhost:3001/api/auth/document/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        // Create blob from response
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);

        // Create temporary link and trigger download
        const link = document.createElement('a');
        link.href = url;
        link.download = `${userName.replace(/\s+/g, '_')}_company_document.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      } else {
        const errorData = await response.json();
        toast.error(`Error downloading document: ${errorData.error}`);
      }
    } catch (error) {
      console.error('Error downloading document:', error);
      toast.error('Error downloading document. Please try again.');
    }
  };

  const menuItems = [
    { id: 'overview', label: 'Overview', icon: 'home' },
    { id: 'analytics', label: 'Analytics & Charts', icon: 'chart' },
    { id: 'users', label: 'User Management', icon: 'users' },
    { id: 'billing', label: 'Billing Management', icon: 'credit-card' },
    { id: 'issues', label: 'Issues', icon: 'alert' },
    { id: 'roles', label: 'Role Management', icon: 'shield' },
    { id: 'audit', label: 'Audit Logs', icon: 'clipboard' },
    { id: 'settings', label: 'System Settings', icon: 'settings' }
  ];

  const sidebarSections = [
    { label: 'General', items: ['overview'] },
    { label: 'Management', items: ['users', 'roles'] },
    { label: 'Finance', items: ['billing', 'analytics'] },
    { label: 'System', items: ['issues', 'audit', 'settings'] }
  ];

  const getIcon = (iconType) => {
    switch (iconType) {
      case 'home':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
        );
      case 'chart':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        );
      case 'users':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        );
      case 'credit-card':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
          </svg>
        );
      case 'alert':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        );
      case 'shield':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        );
      case 'clipboard':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
          </svg>
        );
      case 'settings':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        );
      default:
        return null;
    }
  };

  const StatCard = ({ title, value, icon, color }) => (
    <div className="bg-[#111827] border border-gray-800/60 rounded-2xl p-5 transition-all duration-300 hover:border-gray-700/80">
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center flex-shrink-0`}>
          {icon}
        </div>
        <div className="min-w-0">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide truncate">{title}</p>
          <p className="text-2xl font-bold text-white mt-0.5">{value}</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex bg-[#0a0f1a]">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-[#0c1222] transition-all duration-300 ease-in-out flex flex-col sticky top-0 h-screen overflow-hidden border-r border-gray-800/40`}>
        {/* Sidebar Header - Logo */}
        <div className="flex items-center gap-3 px-4 py-5 border-b border-gray-800/40 flex-shrink-0">
          <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          {sidebarOpen && (
            <div>
              <h2 className="text-base font-bold text-white leading-tight">Routico</h2>
              <p className="text-[10px] text-gray-500 font-medium tracking-wide">Admin Portal</p>
            </div>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="ml-auto text-gray-500 hover:text-gray-300 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Navigation Menu - Grouped */}
        <nav className="flex-1 px-3 py-2 overflow-y-auto">
          {sidebarOpen ? (
            sidebarSections.map((section) => (
              <div key={section.label}>
                <p className="text-[10px] font-semibold tracking-widest text-gray-600 uppercase px-4 mb-2 mt-6">
                  {section.label}
                </p>
                <div className="space-y-1">
                  {section.items.map((itemId) => {
                    const item = menuItems.find(m => m.id === itemId);
                    if (!item) return null;
                    const isActive = activeTab === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => setActiveTab(item.id)}
                        className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-all duration-200 ${
                          isActive
                            ? 'bg-blue-600/15 text-blue-400 border-r-2 border-blue-400'
                            : 'text-gray-400 hover:bg-white/5 hover:text-gray-200'
                        }`}
                      >
                        <span className="flex-shrink-0 w-5 h-5">
                          {getIcon(item.icon)}
                        </span>
                        <span className="font-medium">{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))
          ) : (
            <div className="space-y-1 mt-4">
              {menuItems.map((item) => {
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center justify-center px-2 py-2.5 rounded-lg transition-all duration-200 ${
                      isActive
                        ? 'bg-blue-600/15 text-blue-400 border-r-2 border-blue-400'
                        : 'text-gray-400 hover:bg-white/5 hover:text-gray-200'
                    }`}
                    title={item.label}
                  >
                    <span className="w-6 h-6">
                      {getIcon(item.icon)}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </nav>

        {/* User Info at Bottom */}
        <div className="p-4 border-t border-gray-800/40 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 p-[2px] flex-shrink-0">
              <div className="w-full h-full bg-[#0c1222] rounded-full flex items-center justify-center">
                <span className="text-sm font-semibold text-blue-400">
                  {user?.email?.charAt(0).toUpperCase()}
                </span>
              </div>
            </div>
            {sidebarOpen && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">
                  {user?.email}
                </p>
                <p className="text-xs text-gray-500">Administrator</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-screen bg-[#0a0f1a]">
        {/* Header */}
        <Header />

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6 lg:p-8">
            {/* Page Header */}
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-white">
                {menuItems.find(item => item.id === activeTab)?.label || 'Administrator Dashboard'}
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Welcome back, {user?.email}! Manage the Routico platform and business owners.
              </p>
            </div>

            {/* Tab Content */}
            {activeTab === 'overview' && (
              <>
                {/* Error Display */}
                {error && (
                  <div className="bg-red-900/30 border border-red-800/50 rounded-xl p-4 mb-6">
                    <div className="flex items-center gap-3">
                      <svg className="h-5 w-5 text-red-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                      <div>
                        <h3 className="text-sm font-medium text-red-300">Error</h3>
                        <p className="text-sm text-red-400/80 mt-0.5">{error}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Stats Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
                  <StatCard
                    title="Total Users"
                    value={stats.totalUsers}
                    color="bg-blue-500/15"
                    icon={
                      <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    }
                  />
                  <StatCard
                    title="Pending Approvals"
                    value={stats.pendingApprovals}
                    color="bg-yellow-500/15"
                    icon={
                      <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    }
                  />
                  <StatCard
                    title="Active Businesses"
                    value={stats.activeBusinesses}
                    color="bg-green-500/15"
                    icon={
                      <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    }
                  />
                  <StatCard
                    title="Suspended Accounts"
                    value={stats.suspendedBusinesses}
                    color="bg-red-500/15"
                    icon={
                      <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728" />
                      </svg>
                    }
                  />
                  <StatCard
                    title="Platform Revenue"
                    value={`₱${stats.totalRevenue.toLocaleString()}`}
                    color="bg-purple-500/15"
                    icon={
                      <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    }
                  />
                </div>

                {/* Main Content Grid - Two column layout */}
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                  {/* Pending Approvals - Left 2/3 */}
                  <div className="xl:col-span-2">
                    <div className="bg-[#111827] border border-gray-800/60 rounded-2xl">
                      <div className="px-6 py-5">
                        <div className="flex items-center justify-between mb-5">
                          <h3 className="text-base font-semibold text-white">
                            Pending Business Owner Approvals
                          </h3>
                          <button
                            onClick={() => setActiveTab('users')}
                            className="text-xs font-medium text-blue-400 hover:text-blue-300 transition-colors"
                          >
                            View all
                          </button>
                        </div>
                        <div className="space-y-3">
                          {pendingUsers.length === 0 && (
                            <p className="text-sm text-gray-500 text-center py-8">No pending approvals</p>
                          )}
                          {pendingUsers.map((pendingUser) => (
                            <div key={pendingUser.user_id} className="flex items-center justify-between py-3 px-4 rounded-xl bg-[#0c1222]/60 border border-gray-800/30">
                              <div className="flex items-center gap-3">
                                <div className="h-10 w-10 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full flex items-center justify-center border border-gray-700/50">
                                  <span className="text-sm font-semibold text-blue-400">
                                    {pendingUser.full_name.charAt(0)}
                                  </span>
                                </div>
                                <div className="min-w-0">
                                  <p className="text-sm font-medium text-white truncate">
                                    {pendingUser.full_name}
                                  </p>
                                  <p className="text-xs text-gray-500 truncate">
                                    {pendingUser.email} &middot; {pendingUser.phone}
                                  </p>
                                  <p className="text-[10px] text-gray-600">
                                    Submitted: {new Date(pendingUser.created_at).toLocaleDateString()}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2 flex-shrink-0 ml-4">
                                <button
                                  onClick={() => handleApproveUser(pendingUser.user_id)}
                                  className="inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-lg bg-green-600/20 text-green-400 border border-green-500/30 hover:bg-green-600/30 transition-colors"
                                >
                                  Approve
                                </button>
                                <button
                                  onClick={() => handleRejectUser(pendingUser.user_id)}
                                  className="inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-lg bg-red-600/20 text-red-400 border border-red-500/30 hover:bg-red-600/30 transition-colors"
                                >
                                  Reject
                                </button>
                                <button
                                  onClick={() => handleViewDocument(pendingUser.user_id, pendingUser.full_name)}
                                  className="inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-lg bg-[#1a2235] text-gray-400 border border-gray-700/40 hover:bg-[#1e2a3f] transition-colors"
                                >
                                  View Doc
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right column - Admin Actions + System Status */}
                  <div className="xl:col-span-1 space-y-6">
                    {/* Admin Actions */}
                    <div className="bg-[#111827] border border-gray-800/60 rounded-2xl">
                      <div className="px-6 py-5">
                        <h3 className="text-base font-semibold text-white mb-4">
                          Admin Actions
                        </h3>
                        <div className="space-y-2">
                          <button
                            onClick={() => setActiveTab('users')}
                            className="w-full flex items-center gap-3 px-4 py-3 bg-[#1a2235] border border-gray-700/40 rounded-xl hover:bg-[#1e2a3f] transition-colors text-left"
                          >
                            <svg className="w-4 h-4 text-blue-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            <span className="text-sm font-medium text-gray-300">Manage Users</span>
                          </button>
                          <button
                            onClick={() => setActiveTab('users')}
                            className="w-full flex items-center gap-3 px-4 py-3 bg-[#1a2235] border border-gray-700/40 rounded-xl hover:bg-[#1e2a3f] transition-colors text-left"
                          >
                            <svg className="w-4 h-4 text-yellow-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="text-sm font-medium text-gray-300">Review Applications</span>
                          </button>
                          <button
                            onClick={() => setActiveTab('analytics')}
                            className="w-full flex items-center gap-3 px-4 py-3 bg-[#1a2235] border border-gray-700/40 rounded-xl hover:bg-[#1e2a3f] transition-colors text-left"
                          >
                            <svg className="w-4 h-4 text-green-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                            <span className="text-sm font-medium text-gray-300">Platform Analytics</span>
                          </button>
                          <button
                            onClick={() => setActiveTab('settings')}
                            className="w-full flex items-center gap-3 px-4 py-3 bg-[#1a2235] border border-gray-700/40 rounded-xl hover:bg-[#1e2a3f] transition-colors text-left"
                          >
                            <svg className="w-4 h-4 text-purple-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <span className="text-sm font-medium text-gray-300">System Settings</span>
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* System Status */}
                    <div className="bg-[#111827] border border-gray-800/60 rounded-2xl">
                      <div className="px-6 py-5">
                        <h3 className="text-base font-semibold text-white mb-4">
                          System Status
                        </h3>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-400">Server Status</span>
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-green-500/15 text-green-400 border border-green-500/30">
                              Online
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-400">Database</span>
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-green-500/15 text-green-400 border border-green-500/30">
                              Connected
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-400">Firebase</span>
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-green-500/15 text-green-400 border border-green-500/30">
                              Active
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Analytics Tab */}
            {activeTab === 'analytics' && (
              <div className="space-y-6">
                <AdministratorCharts stats={stats} loading={loading} error={error} />
                <AdministratorBillingCharts />
              </div>
            )}

            {/* User Management Tab */}
            {activeTab === 'users' && (
              <AdministratorUserManagement />
            )}

            {/* Billing Management Tab */}
            {activeTab === 'billing' && (
              <div className="space-y-6">
                <AdministratorBillingCharts />
                <AdministratorPaymentReview />
              </div>
            )}

            {/* Issues Tab */}
            {activeTab === 'issues' && (
              <AdministratorIssues />
            )}

            {/* Role Management Tab */}
            {activeTab === 'roles' && (
              <AdministratorRoleManagement />
            )}

            {/* Audit Logs Tab */}
            {activeTab === 'audit' && (
              <AdministratorAuditLogs />
            )}

            {/* System Settings Tab */}
            {activeTab === 'settings' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-white">System Settings</h2>
                <p className="text-gray-400">Configure platform-wide settings and preferences.</p>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* General Settings */}
                  <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
                    <h3 className="text-lg font-medium text-white mb-4">General</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Platform Name</label>
                        <input type="text" defaultValue="Routico" className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Support Email</label>
                        <input type="email" defaultValue="support@routico.com" className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Default Currency</label>
                        <select className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                          <option value="PHP">PHP (₱)</option>
                          <option value="USD">USD ($)</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Billing Settings */}
                  <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
                    <h3 className="text-lg font-medium text-white mb-4">Billing</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Monthly Base Fee</label>
                        <input type="number" defaultValue="2000" className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Per Delivery Fee</label>
                        <input type="number" defaultValue="10" className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Payment Due Days</label>
                        <input type="number" defaultValue="30" className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                      </div>
                    </div>
                  </div>

                  {/* Notification Settings */}
                  <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
                    <h3 className="text-lg font-medium text-white mb-4">Notifications</h3>
                    <div className="space-y-4">
                      {[
                        { label: 'New user registration alerts', defaultChecked: true },
                        { label: 'Payment received notifications', defaultChecked: true },
                        { label: 'Overdue payment reminders', defaultChecked: true },
                        { label: 'System error alerts', defaultChecked: false },
                      ].map((item) => (
                        <div key={item.label} className="flex items-center justify-between">
                          <span className="text-sm text-gray-300">{item.label}</span>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" defaultChecked={item.defaultChecked} className="sr-only peer" />
                            <div className="w-9 h-5 bg-gray-600 rounded-full peer peer-checked:bg-blue-600 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all"></div>
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Security Settings */}
                  <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
                    <h3 className="text-lg font-medium text-white mb-4">Security</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Session Timeout (minutes)</label>
                        <input type="number" defaultValue="60" className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Minimum Password Length</label>
                        <input type="number" defaultValue="6" className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-300">Auto-suspend on missed payments</span>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" defaultChecked={true} className="sr-only peer" />
                          <div className="w-9 h-5 bg-gray-600 rounded-full peer peer-checked:bg-blue-600 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all"></div>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button className="px-6 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors">
                    Save Settings
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdministratorDashboard;
