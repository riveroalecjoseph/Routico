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

const BusinessOwnerCharts = ({ stats, loading, error }) => {
  // Monthly Performance Bar Chart
  const monthlyPerformanceData = {
    labels: ['Orders', 'Deliveries', 'Revenue (₱)'],
    datasets: [
      {
        label: 'Current Month',
        data: [stats.totalOrders, stats.completedDeliveries, stats.monthlyRevenue],
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)', // Blue
          'rgba(34, 197, 94, 0.8)',  // Green
          'rgba(168, 85, 247, 0.8)', // Purple
        ],
        borderColor: [
          'rgba(59, 130, 246, 1)',
          'rgba(34, 197, 94, 1)',
          'rgba(168, 85, 247, 1)',
        ],
        borderWidth: 2,
      },
    ],
  };

  const monthlyPerformanceOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Monthly Performance Overview',
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
            if (context.label === 'Revenue (₱)') {
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
              return '₱' + (value / 1000).toFixed(0) + 'k';
            }
            return value;
          },
        },
      },
    },
  };

  // Revenue Breakdown Doughnut Chart
  const revenueBreakdownData = {
    labels: ['Base Fee (₱2,000)', 'Delivery Fees'],
    datasets: [
      {
        data: [2000, stats.monthlyRevenue - 2000],
        backgroundColor: [
          'rgba(34, 197, 94, 0.8)',  // Green for base fee
          'rgba(59, 130, 246, 0.8)', // Blue for delivery fees
        ],
        borderColor: [
          'rgba(34, 197, 94, 1)',
          'rgba(59, 130, 246, 1)',
        ],
        borderWidth: 2,
      },
    ],
  };

  const revenueBreakdownOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
      },
      title: {
        display: true,
        text: 'Revenue Breakdown',
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
            return `${label}: ₱${value.toLocaleString()}`;
          },
        },
      },
    },
  };

  // Weekly Trend Line Chart (mock data for demonstration)
  const weeklyTrendData = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    datasets: [
      {
        label: 'Orders',
        data: [Math.floor(stats.totalOrders * 0.2), Math.floor(stats.totalOrders * 0.3), Math.floor(stats.totalOrders * 0.25), Math.floor(stats.totalOrders * 0.25)],
        borderColor: 'rgba(59, 130, 246, 1)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        fill: true,
      },
      {
        label: 'Revenue (₱)',
        data: [Math.floor(stats.monthlyRevenue * 0.2), Math.floor(stats.monthlyRevenue * 0.3), Math.floor(stats.monthlyRevenue * 0.25), Math.floor(stats.monthlyRevenue * 0.25)],
        borderColor: 'rgba(168, 85, 247, 1)',
        backgroundColor: 'rgba(168, 85, 247, 0.1)',
        tension: 0.4,
        fill: true,
        yAxisID: 'y1',
      },
    ],
  };

  const weeklyTrendOptions = {
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
        text: 'Weekly Performance Trend',
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
          text: 'Orders',
        },
      },
      y1: {
        type: 'linear',
        display: true,
        position: 'right',
        title: {
          display: true,
          text: 'Revenue (₱)',
        },
        grid: {
          drawOnChartArea: false,
        },
        ticks: {
          callback: function(value) {
            return '₱' + (value / 1000).toFixed(0) + 'k';
          },
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
      {/* Monthly Performance Overview */}
      <div className="bg-gray-800 shadow rounded-lg p-6 border border-gray-700">
        <div className="mb-4">
          <h3 className="text-lg font-medium text-white">Monthly Performance Overview</h3>
          <p className="text-sm text-gray-300">Current month's key performance indicators</p>
        </div>
        <div className="h-64">
          <Bar data={monthlyPerformanceData} options={monthlyPerformanceOptions} />
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Breakdown */}
        <div className="bg-gray-800 shadow rounded-lg p-6 border border-gray-700">
          <div className="mb-4">
            <h3 className="text-lg font-medium text-white">Revenue Breakdown</h3>
            <p className="text-sm text-gray-300">Monthly fee vs delivery fees</p>
          </div>
          <div className="h-64">
            <Doughnut data={revenueBreakdownData} options={revenueBreakdownOptions} />
          </div>
        </div>

        {/* Weekly Trend */}
        <div className="bg-gray-800 shadow rounded-lg p-6 border border-gray-700">
          <div className="mb-4">
            <h3 className="text-lg font-medium text-white">Weekly Performance Trend</h3>
            <p className="text-sm text-gray-300">Orders and revenue over the month</p>
          </div>
          <div className="h-64">
            <Line data={weeklyTrendData} options={weeklyTrendOptions} />
          </div>
        </div>
      </div>

      {/* Key Metrics Summary */}
      <div className="bg-gray-800 shadow rounded-lg p-6 border border-gray-700">
        <div className="mb-4">
          <h3 className="text-lg font-medium text-white">Key Metrics Summary</h3>
          <p className="text-sm text-gray-300">Important business metrics at a glance</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{stats.totalOrders}</div>
            <div className="text-sm text-gray-300">Total Orders</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{stats.completedDeliveries}</div>
            <div className="text-sm text-gray-300">Completed Deliveries</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">₱{stats.monthlyRevenue.toLocaleString()}</div>
            <div className="text-sm text-gray-300">Monthly Revenue</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600">
              ₱{stats.completedDeliveries > 0 ? (stats.monthlyRevenue / stats.completedDeliveries).toFixed(0) : 0}
            </div>
            <div className="text-sm text-gray-300">Avg. Revenue per Delivery</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessOwnerCharts;
