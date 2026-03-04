import { useEffect, useState } from 'react';
import { useAuth } from '../auth/AuthContext';

const AdministratorUserManagement = () => {
  const { user, getToken, isAdmin } = useAuth();
  const [activeView, setActiveView] = useState('pending');
  const [pendingUsers, setPendingUsers] = useState([]);
  const [activeUsers, setActiveUsers] = useState([]);
  const [suspendedUsers, setSuspendedUsers] = useState([]);
  const [userPaymentStatus, setUserPaymentStatus] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showDocumentModal, setShowDocumentModal] = useState(false);
  const [documentUrl, setDocumentUrl] = useState('');
  const [showSuspendModal, setShowSuspendModal] = useState(false);
  const [suspendReason, setSuspendReason] = useState('');

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = getToken();

      // Fetch pending users
      const pendingResponse = await fetch('http://localhost:3001/api/auth/pending-users', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (pendingResponse.ok) {
        const pendingData = await pendingResponse.json();
        setPendingUsers(pendingData);
      }

      // Fetch active users
      const activeResponse = await fetch('http://localhost:3001/api/auth/users', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (activeResponse.ok) {
        const activeData = await activeResponse.json();
        
        // Separate users into different categories
        const businessOwners = activeData.filter(user => user.role === 'business_owner' && user.account_status === 'approved');
        const activeUsersList = businessOwners.filter(user => user.active_status === 'active');
        const suspendedUsersList = businessOwners.filter(user => user.active_status === 'inactive');
        
        setActiveUsers(activeUsersList);
        setSuspendedUsers(suspendedUsersList);
        
        // Fetch payment status for all business owners
        const paymentStatusPromises = businessOwners.map(async (businessUser) => {
          const paymentStatus = await getPaymentStatus(businessUser.user_id);
          return { userId: businessUser.user_id, ...paymentStatus };
        });
        
        const paymentStatuses = await Promise.all(paymentStatusPromises);
        const paymentStatusMap = {};
        paymentStatuses.forEach(status => {
          paymentStatusMap[status.userId] = status;
        });
        setUserPaymentStatus(paymentStatusMap);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      setError('Failed to fetch user data. Please try again.');
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
        setPendingUsers(prev => prev.filter(user => user.user_id !== userId));
        await fetchUserData(); // Refresh data
        alert('User approved successfully!');
      } else {
        const errorData = await response.json();
        alert(`Error approving user: ${errorData.error}`);
      }
    } catch (error) {
      console.error('Error approving user:', error);
      alert('Error approving user. Please try again.');
    }
  };

  const handleRejectUser = async (userId) => {
    if (!confirm('Are you sure you want to reject this user? This action cannot be undone.')) {
      return;
    }

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
        setPendingUsers(prev => prev.filter(user => user.user_id !== userId));
        await fetchUserData(); // Refresh data
        alert('User rejected successfully!');
      } else {
        const errorData = await response.json();
        alert(`Error rejecting user: ${errorData.error}`);
      }
    } catch (error) {
      console.error('Error rejecting user:', error);
      alert('Error rejecting user. Please try again.');
    }
  };

  const handleSuspendUser = async (userId, reason) => {
    try {
      const token = getToken();
      const response = await fetch(`http://localhost:3001/api/auth/user/${userId}/suspend`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          reason: reason
        })
      });

      if (response.ok) {
        await fetchUserData(); // Refresh data
        alert('User account suspended successfully!');
        setShowSuspendModal(false);
        setSuspendReason('');
        setSelectedUser(null);
      } else {
        const errorData = await response.json();
        alert(`Error suspending user: ${errorData.error}`);
      }
    } catch (error) {
      console.error('Error suspending user:', error);
      alert('Error suspending user. Please try again.');
    }
  };

  const handleReactivateUser = async (userId) => {
    if (!confirm('Are you sure you want to reactivate this user account?')) {
      return;
    }

    try {
      const token = getToken();
      const response = await fetch(`http://localhost:3001/api/auth/user/${userId}/reactivate`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        await fetchUserData(); // Refresh data
        alert('User account reactivated successfully!');
      } else {
        const errorData = await response.json();
        alert(`Error reactivating user: ${errorData.error}`);
      }
    } catch (error) {
      console.error('Error reactivating user:', error);
      alert('Error reactivating user. Please try again.');
    }
  };

  const handleViewDocument = async (userId, userName) => {
    try {
      const token = getToken();
      const response = await fetch(`http://localhost:3001/api/auth/document/${userId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        
        // Open document in new tab
        window.open(url, '_blank');
        
        // Clean up URL after a delay
        setTimeout(() => window.URL.revokeObjectURL(url), 1000);
      } else {
        const errorData = await response.json();
        alert(`Error loading document: ${errorData.error}`);
      }
    } catch (error) {
      console.error('Error loading document:', error);
      alert('Error loading document. Please try again.');
    }
  };

  const getPaymentStatus = async (userId) => {
    try {
      const token = getToken();
      const response = await fetch(`http://localhost:3001/api/auth/user/${userId}/payment-status`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        return data;
      }
      return { status: 'unknown', amount: 0 };
    } catch (error) {
      console.error('Error fetching payment status:', error);
      return { status: 'unknown', amount: 0 };
    }
  };

  const UserCard = ({ user, isPending = false }) => {
    const paymentStatus = userPaymentStatus[user.user_id];
    
    return (
      <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 hover:border-gray-600 transition-colors">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex-shrink-0">
              <div className="h-12 w-12 bg-gray-700 rounded-full flex items-center justify-center">
                <span className="text-lg font-medium text-white">
                  {user.full_name.charAt(0)}
                </span>
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-medium text-white truncate">
                {user.full_name}
              </h3>
              <p className="text-sm text-gray-400 truncate">
                {user.email}
              </p>
              <p className="text-sm text-gray-400">
                {user.phone}
              </p>
              <div className="mt-2 flex items-center space-x-4">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  user.account_status === 'approved' ? 'bg-green-900 text-green-200' :
                  user.account_status === 'pending' ? 'bg-yellow-900 text-yellow-200' :
                  'bg-red-900 text-red-200'
                }`}>
                  {user.account_status}
                </span>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  user.active_status === 'active' ? 'bg-blue-900 text-blue-200' : 'bg-gray-700 text-gray-300'
                }`}>
                  {user.active_status}
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Registered: {new Date(user.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>
          
          <div className="flex flex-col space-y-2">
            {isPending ? (
              <>
                <button
                  onClick={() => handleApproveUser(user.user_id)}
                  className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded text-white bg-green-600 hover:bg-green-700 transition-colors"
                >
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Approve
                </button>
                <button
                  onClick={() => handleRejectUser(user.user_id)}
                  className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded text-white bg-red-600 hover:bg-red-700 transition-colors"
                >
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Reject
                </button>
              </>
            ) : (
              <div className="text-right">
                <div className="text-sm text-gray-400 mb-1">Payment Status</div>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  paymentStatus?.status === 'paid' ? 'bg-green-900 text-green-200' :
                  paymentStatus?.status === 'unpaid' ? 'bg-red-900 text-red-200' :
                  'bg-yellow-900 text-yellow-200'
                }`}>
                  {paymentStatus?.status === 'paid' ? 'Paid' :
                   paymentStatus?.status === 'unpaid' ? 'Unpaid' :
                   paymentStatus?.status === 'pending' ? 'Pending' :
                   'Unknown'}
                </span>
                {paymentStatus?.amount > 0 && (
                  <div className="text-xs text-gray-400 mt-1">
                    ₱{paymentStatus.amount.toLocaleString()}
                  </div>
                )}
                
                {/* Account Management Buttons */}
                <div className="mt-3 space-y-2">
                  {user.active_status === 'active' ? (
                    <button
                      onClick={() => {
                        setSelectedUser(user);
                        setShowSuspendModal(true);
                      }}
                      className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded text-white bg-red-600 hover:bg-red-700 transition-colors"
                    >
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728" />
                      </svg>
                      Suspend
                    </button>
                  ) : (
                    <button
                      onClick={() => handleReactivateUser(user.user_id)}
                      className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded text-white bg-green-600 hover:bg-green-700 transition-colors"
                    >
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Reactivate
                    </button>
                  )}
                </div>
              </div>
            )}
            
            <button
              onClick={() => handleViewDocument(user.user_id, user.full_name)}
              className="inline-flex items-center px-3 py-1 border border-gray-600 text-sm font-medium rounded text-gray-300 bg-gray-700 hover:bg-gray-600 transition-colors"
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              View Document
            </button>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-700 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-700 rounded w-1/2 mb-4"></div>
          <div className="h-4 bg-gray-700 rounded w-2/3"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">User Management</h2>
        <button
          onClick={fetchUserData}
          disabled={loading}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          <svg className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          {loading ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View Toggle */}
      <div className="flex space-x-1 bg-gray-800 p-1 rounded-lg">
        <button
          onClick={() => setActiveView('pending')}
          className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors ${
            activeView === 'pending'
              ? 'bg-blue-600 text-white'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          Pending Approvals ({pendingUsers.length})
        </button>
        <button
          onClick={() => setActiveView('active')}
          className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors ${
            activeView === 'active'
              ? 'bg-green-600 text-white'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          Active Accounts ({activeUsers.length})
        </button>
        <button
          onClick={() => setActiveView('suspended')}
          className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors ${
            activeView === 'suspended'
              ? 'bg-red-600 text-white'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          Suspended Accounts ({suspendedUsers.length})
        </button>
      </div>

      {/* Content */}
      {activeView === 'pending' && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-white">Pending Business Owner Approvals</h3>
          {pendingUsers.length === 0 ? (
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-white">No pending approvals</h3>
              <p className="mt-1 text-sm text-gray-400">All business owner applications have been reviewed.</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {pendingUsers.map((pendingUser) => (
                <UserCard key={pendingUser.user_id} user={pendingUser} isPending={true} />
              ))}
            </div>
          )}
        </div>
      )}

      {activeView === 'active' && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-white">Active Business Accounts</h3>
          {activeUsers.length === 0 ? (
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-white">No active business accounts</h3>
              <p className="mt-1 text-sm text-gray-400">No business owners have been approved yet.</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {activeUsers.map((activeUser) => (
                <UserCard key={activeUser.user_id} user={activeUser} isPending={false} />
              ))}
            </div>
          )}
        </div>
      )}

      {activeView === 'suspended' && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-white">Suspended Business Accounts</h3>
          {suspendedUsers.length === 0 ? (
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-white">No suspended accounts</h3>
              <p className="mt-1 text-sm text-gray-400">All business accounts are currently active.</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {suspendedUsers.map((suspendedUser) => (
                <UserCard key={suspendedUser.user_id} user={suspendedUser} isPending={false} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Suspension Modal */}
      {showSuspendModal && selectedUser && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-gray-800">
            <div className="mt-3">
              <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div className="mt-2 px-7 py-3">
                <h3 className="text-lg font-medium text-white text-center">
                  Suspend Account
                </h3>
                <div className="mt-2 px-7 py-3">
                  <p className="text-sm text-gray-300 text-center">
                    Are you sure you want to suspend <strong>{selectedUser.full_name}</strong>'s account?
                  </p>
                  <p className="text-sm text-gray-400 text-center mt-2">
                    This will restrict their dashboard access and they will see an inactive account message.
                  </p>
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Reason for suspension:
                  </label>
                  <textarea
                    value={suspendReason}
                    onChange={(e) => setSuspendReason(e.target.value)}
                    placeholder="Enter reason for suspension (e.g., Late payment, Violation of terms, etc.)"
                    className="w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    rows={3}
                    required
                  />
                </div>
              </div>
              <div className="flex justify-center space-x-4 px-4 py-3">
                <button
                  onClick={() => {
                    setShowSuspendModal(false);
                    setSuspendReason('');
                    setSelectedUser(null);
                  }}
                  className="px-4 py-2 bg-gray-600 text-white text-base font-medium rounded-md shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleSuspendUser(selectedUser.user_id, suspendReason)}
                  disabled={!suspendReason.trim()}
                  className="px-4 py-2 bg-red-600 text-white text-base font-medium rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Suspend Account
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdministratorUserManagement;
