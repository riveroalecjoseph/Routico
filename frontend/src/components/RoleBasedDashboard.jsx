import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import BusinessOwnerDashboard from '../pages/BusinessOwnerDashboard';
import AdministratorDashboard from '../pages/AdministratorDashboard';
import PendingApprovalPage from '../pages/PendingApprovalPage';
import InactiveAccountPage from '../pages/InactiveAccountPage';
import RestrictedBillingAccess from './RestrictedBillingAccess';
import Header from './Header';
import Footer from './Footer';

const RoleBasedDashboard = () => {
  const { userRole, userStatus } = useAuth();

  // Debug logging
  console.log('RoleBasedDashboard - userRole:', userRole);
  console.log('RoleBasedDashboard - userStatus:', userStatus);

  // Check if business owner account is pending approval
  if (userRole === 'business_owner' && userStatus?.account_status === 'pending') {
    console.log('Redirecting to PendingApprovalPage');
    return <PendingApprovalPage />;
  }

  // Check if business owner account is inactive
  if (userRole === 'business_owner' && userStatus?.active_status === 'inactive') {
    console.log('Redirecting to RestrictedBillingAccess');
    return <RestrictedBillingAccess />;
  }

  // Route to appropriate dashboard based on user role
  if (userRole === 'business_owner') {
    // If userStatus is not loaded yet, assume pending for new registrations
    if (!userStatus) {
      console.log('UserStatus not loaded yet, assuming pending for new registration');
      return <PendingApprovalPage />;
    }
    return <BusinessOwnerDashboard />;
  } else if (userRole === 'administrator') {
    return <AdministratorDashboard />;
  }

  // Fallback for unknown roles
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-white mb-4">Access Denied</h1>
        <p className="text-gray-300">Your role is not recognized. Please contact support.</p>
      </div>
    </div>
  );
};

export default RoleBasedDashboard;
