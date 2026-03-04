import React, { useEffect, useState } from 'react';
import { useAuth } from '../auth/AuthContext';
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

const BusinessOwnerCharts = ({ stats, loading: parentLoading, error: parentError }) => {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) fetchAnalytics();
  }, [user]);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const token = await user.getIdToken();
      const res = await fetch('http://localhost:3001/api/orders/analytics/summary', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setAnalytics(data);
      }
    } catch (err) {
      console.error('Failed to fetch analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  // Monthly Performance Bar Chart — real data from API
  const monthLabels = analytics?.monthly?.map(m => {
    const [year, month] = m.month.split('-');
    return new Date(year, month - 1).toLocaleString('default', { month: 'short', year: '2-digit' });
  }) || [];

  const monthlyPerformanceData = {
    labels: monthLabels.length > 0 ? monthLabels : ['No Data'],
    datasets: [
      {
        label: 'Orders',
        data: analytics?.monthly?.map(m => m.order_count) || [0],
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 2,
      },
      {
        label: 'Completed',
        data: analytics?.monthly?.map(m => m.completed) || [0],
        backgroundColor: 'rgba(34, 197, 94, 0.8)',
        borderColor: 'rgba(34, 197, 94, 1)',
        borderWidth: 2,
      },
    ],
  };

  const monthlyPerformanceOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top', labels: { color: '#d1d5db' } },
      title: { display: true, text: 'Monthly Orders (Last 6 Months)', font: { size: 16, weight: 'bold' }, color: '#f3f4f6' },
    },
    scales: {
      y: { beginAtZero: true, ticks: { color: '#9ca3af' }, grid: { color: '#374151' } },
      x: { ticks: { color: '#9ca3af' }, grid: { color: '#374151' } },
    },
  };

  // Revenue Trend Line Chart
  const revenueTrendData = {
    labels: monthLabels.length > 0 ? monthLabels : ['No Data'],
    datasets: [
      {
        label: 'Revenue (₱)',
        data: analytics?.monthly?.map(m => parseFloat(m.revenue)) || [0],
        borderColor: 'rgba(168, 85, 247, 1)',
        backgroundColor: 'rgba(168, 85, 247, 0.1)',
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const revenueTrendOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top', labels: { color: '#d1d5db' } },
      title: { display: true, text: 'Revenue Trend', font: { size: 16, weight: 'bold' }, color: '#f3f4f6' },
      tooltip: {
        callbacks: {
          label: (ctx) => `Revenue: ₱${ctx.parsed.y.toLocaleString()}`,
        },
      },
    },
    scales: {
      y: { beginAtZero: true, ticks: { color: '#9ca3af', callback: v => `₱${v.toLocaleString()}` }, grid: { color: '#374151' } },
      x: { ticks: { color: '#9ca3af' }, grid: { color: '#374151' } },
    },
  };

  // Order Status Doughnut Chart
  const statusLabels = analytics?.statusCounts ? Object.keys(analytics.statusCounts) : ['No Data'];
  const statusValues = analytics?.statusCounts ? Object.values(analytics.statusCounts) : [0];
  const statusColorMap = {
    pending: 'rgba(234, 179, 8, 0.8)',
    assigned: 'rgba(59, 130, 246, 0.8)',
    in_transit: 'rgba(168, 85, 247, 0.8)',
    delivered: 'rgba(20, 184, 166, 0.8)',
    completed: 'rgba(34, 197, 94, 0.8)',
    cancelled: 'rgba(239, 68, 68, 0.8)',
  };

  const statusDoughnutData = {
    labels: statusLabels.map(s => s.replace('_', ' ')),
    datasets: [{
      data: statusValues,
      backgroundColor: statusLabels.map(s => statusColorMap[s] || 'rgba(107, 114, 128, 0.8)'),
      borderWidth: 2,
      borderColor: '#1f2937',
    }],
  };

  const statusDoughnutOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'bottom', labels: { color: '#d1d5db' } },
      title: { display: true, text: 'Order Status Breakdown', font: { size: 16, weight: 'bold' }, color: '#f3f4f6' },
    },
  };

  // Top Customers
  const topCustomers = analytics?.topCustomers || [];

  // Loading skeleton
  if (loading || parentLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="bg-gray-800 shadow rounded-lg p-6 border border-gray-700">
              <div className="animate-pulse">
                <div className="h-6 bg-gray-700 rounded w-3/4 mb-4"></div>
                <div className="h-64 bg-gray-700 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Key Metrics Summary */}
      <div className="bg-gray-800 shadow rounded-lg p-6 border border-gray-700">
        <div className="mb-4">
          <h3 className="text-lg font-medium text-white">Key Metrics Summary</h3>
          <p className="text-sm text-gray-400">Business metrics at a glance</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-400">{stats.totalOrders}</div>
            <div className="text-sm text-gray-400">Total Orders</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-400">{stats.completedDeliveries}</div>
            <div className="text-sm text-gray-400">Completed Deliveries</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-400">
              ₱{analytics?.monthly?.reduce((sum, m) => sum + parseFloat(m.revenue), 0).toLocaleString() || '0'}
            </div>
            <div className="text-sm text-gray-400">Total Revenue (6 mo)</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-400">{stats.activeDrivers}</div>
            <div className="text-sm text-gray-400">Active Drivers</div>
          </div>
        </div>
      </div>

      {/* Monthly Orders Bar Chart */}
      <div className="bg-gray-800 shadow rounded-lg p-6 border border-gray-700">
        <div className="h-72">
          <Bar data={monthlyPerformanceData} options={monthlyPerformanceOptions} />
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Order Status Breakdown */}
        <div className="bg-gray-800 shadow rounded-lg p-6 border border-gray-700">
          <div className="h-72">
            <Doughnut data={statusDoughnutData} options={statusDoughnutOptions} />
          </div>
        </div>

        {/* Revenue Trend */}
        <div className="bg-gray-800 shadow rounded-lg p-6 border border-gray-700">
          <div className="h-72">
            <Line data={revenueTrendData} options={revenueTrendOptions} />
          </div>
        </div>
      </div>

      {/* Top Customers Table */}
      {topCustomers.length > 0 && (
        <div className="bg-gray-800 shadow rounded-lg p-6 border border-gray-700">
          <div className="mb-4">
            <h3 className="text-lg font-medium text-white">Top Customers</h3>
            <p className="text-sm text-gray-400">Customers ranked by order count</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-400 uppercase border-b border-gray-700">
                <tr>
                  <th className="py-3 px-4">#</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Orders</th>
                  <th className="py-3 px-4">Total Revenue</th>
                </tr>
              </thead>
              <tbody>
                {topCustomers.map((c, i) => (
                  <tr key={i} className="border-b border-gray-700/50 hover:bg-gray-700/30">
                    <td className="py-3 px-4 text-gray-400">{i + 1}</td>
                    <td className="py-3 px-4 text-white font-medium">{c.company_name || 'Unknown'}</td>
                    <td className="py-3 px-4 text-gray-300">{c.order_count}</td>
                    <td className="py-3 px-4 text-green-400">₱{parseFloat(c.total_revenue).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default BusinessOwnerCharts;
