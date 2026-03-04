import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar, Line, Doughnut } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const AdministratorCharts = ({ stats, loading, error }) => {
  // Debug logging
  console.log('AdministratorCharts - stats:', stats);
  console.log('AdministratorCharts - loading:', loading);
  console.log('AdministratorCharts - error:', error);

  // Platform Overview Bar Chart
  const platformOverviewData = {
    labels: ['Total Users', 'Pending Approvals', 'Active Businesses', 'Platform Revenue (₱)'],
    datasets: [
      {
        label: 'Current Count',
        data: [
          stats.totalUsers, 
          stats.pendingApprovals, 
          stats.activeBusinesses, 
          stats.totalRevenue
        ],
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',  // Blue for users
          'rgba(251, 191, 36, 0.8)',  // Yellow for pending
          'rgba(34, 197, 94, 0.8)',   // Green for active
          'rgba(168, 85, 247, 0.8)',  // Purple for revenue
        ],
        borderColor: [
          'rgba(59, 130, 246, 1)',
          'rgba(251, 191, 36, 1)',
          'rgba(34, 197, 94, 1)',
          'rgba(168, 85, 247, 1)',
        ],
        borderWidth: 2,
      },
    ],
  };

  const platformOverviewOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Platform Overview',
        font: {
          size: 16,
          weight: 'bold',
        },
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.dataset.label || '';
            const value = context.parsed.y;
            if (context.label === 'Platform Revenue (₱)') {
              return `${label}: ₱${value.toLocaleString()}`;
            }
            return `${label}: ${value}`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            if (value >= 1000) {
              return (value / 1000).toFixed(0) + 'k';
            }
            return value;
          },
        },
      },
    },
  };

  // User Status Distribution Doughnut Chart
  const userStatusData = {
    labels: ['Active Businesses', 'Pending Approvals', 'Inactive Accounts'],
    datasets: [
      {
        data: [
          stats.activeBusinesses,
          stats.pendingApprovals,
          stats.totalUsers - stats.activeBusinesses - stats.pendingApprovals
        ],
        backgroundColor: [
          'rgba(34, 197, 94, 0.8)',   // Green for active
          'rgba(251, 191, 36, 0.8)',  // Yellow for pending
          'rgba(239, 68, 68, 0.8)',   // Red for inactive
        ],
        borderColor: [
          'rgba(34, 197, 94, 1)',
          'rgba(251, 191, 36, 1)',
          'rgba(239, 68, 68, 1)',
        ],
        borderWidth: 2,
      },
    ],
  };

  const userStatusOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
      },
      title: {
        display: true,
        text: 'User Account Status Distribution',
        font: {
          size: 16,
          weight: 'bold',
        },
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.label;
            const value = context.parsed;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return `${label}: ${value} (${percentage}%)`;
          },
        },
      },
    },
  };

  // Revenue Trend Line Chart (mock data for demonstration)
  const revenueTrendData = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    datasets: [
      {
        label: 'Weekly Revenue (₱)',
        data: [
          Math.floor(stats.totalRevenue * 0.2), 
          Math.floor(stats.totalRevenue * 0.3), 
          Math.floor(stats.totalRevenue * 0.25), 
          Math.floor(stats.totalRevenue * 0.25)
        ],
        borderColor: 'rgba(168, 85, 247, 1)',
        backgroundColor: 'rgba(168, 85, 247, 0.1)',
        tension: 0.4,
        fill: true,
      },
      {
        label: 'Active Businesses',
        data: [
          Math.floor(stats.activeBusinesses * 0.9),
          Math.floor(stats.activeBusinesses * 0.95),
          Math.floor(stats.activeBusinesses * 0.98),
          stats.activeBusinesses
        ],
        borderColor: 'rgba(34, 197, 94, 1)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        tension: 0.4,
        fill: true,
        yAxisID: 'y1',
      },
    ],
  };

  const revenueTrendOptions = {
    responsive: true,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Revenue & Business Growth Trend',
        font: {
          size: 16,
          weight: 'bold',
        },
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.dataset.label || '';
            const value = context.parsed.y;
            if (label.includes('Revenue')) {
              return `${label}: ₱${value.toLocaleString()}`;
            }
            return `${label}: ${value}`;
          },
        },
      },
    },
    scales: {
      x: {
        display: true,
        title: {
          display: true,
          text: 'Weeks',
        },
      },
      y: {
        type: 'linear',
        display: true,
        position: 'left',
        title: {
          display: true,
          text: 'Revenue (₱)',
        },
        ticks: {
          callback: function(value) {
            return '₱' + (value / 1000).toFixed(0) + 'k';
          },
        },
      },
      y1: {
        type: 'linear',
        display: true,
        position: 'right',
        title: {
          display: true,
          text: 'Active Businesses',
        },
        grid: {
          drawOnChartArea: false,
        },
      },
    },
  };

  // Loading skeleton
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-gray-800 shadow rounded-lg p-6 border border-gray-700">
            <div className="animate-pulse">
              <div className="h-6 bg-gray-700 rounded w-3/4 mb-4"></div>
              <div className="h-64 bg-gray-700 rounded"></div>
            </div>
          </div>
          <div className="bg-gray-800 shadow rounded-lg p-6 border border-gray-700">
            <div className="animate-pulse">
              <div className="h-6 bg-gray-700 rounded w-3/4 mb-4"></div>
              <div className="h-64 bg-gray-700 rounded"></div>
            </div>
          </div>
        </div>
        <div className="bg-gray-800 shadow rounded-lg p-6 border border-gray-700">
          <div className="animate-pulse">
            <div className="h-6 bg-gray-700 rounded w-3/4 mb-4"></div>
            <div className="h-64 bg-gray-700 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Error Loading Charts</h3>
            <div className="mt-2 text-sm text-red-700">
              <p>{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Platform Overview */}
      <div className="bg-gray-800 shadow rounded-lg p-6 border border-gray-700">
        <div className="mb-4">
          <h3 className="text-lg font-medium text-white">Platform Overview</h3>
          <p className="text-sm text-gray-300">Key platform metrics and statistics</p>
        </div>
        <div className="h-64">
          <Bar data={platformOverviewData} options={platformOverviewOptions} />
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Status Distribution */}
        <div className="bg-gray-800 shadow rounded-lg p-6 border border-gray-700">
          <div className="mb-4">
            <h3 className="text-lg font-medium text-white">User Account Status</h3>
            <p className="text-sm text-gray-300">Distribution of user account statuses</p>
          </div>
          <div className="h-64">
            <Doughnut data={userStatusData} options={userStatusOptions} />
          </div>
        </div>

        {/* Revenue Trend */}
        <div className="bg-gray-800 shadow rounded-lg p-6 border border-gray-700">
          <div className="mb-4">
            <h3 className="text-lg font-medium text-white">Revenue & Business Growth</h3>
            <p className="text-sm text-gray-300">Weekly revenue and business growth trends</p>
          </div>
          <div className="h-64">
            <Line data={revenueTrendData} options={revenueTrendOptions} />
          </div>
        </div>
      </div>

      {/* Key Metrics Summary */}
      <div className="bg-gray-800 shadow rounded-lg p-6 border border-gray-700">
        <div className="mb-4">
          <h3 className="text-lg font-medium text-white">Platform Key Metrics</h3>
          <p className="text-sm text-gray-300">Important platform metrics at a glance</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{stats.totalUsers}</div>
            <div className="text-sm text-gray-300">Total Users</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600">{stats.pendingApprovals}</div>
            <div className="text-sm text-gray-300">Pending Approvals</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{stats.activeBusinesses}</div>
            <div className="text-sm text-gray-300">Active Businesses</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">₱{stats.totalRevenue.toLocaleString()}</div>
            <div className="text-sm text-gray-300">Platform Revenue</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdministratorCharts;
