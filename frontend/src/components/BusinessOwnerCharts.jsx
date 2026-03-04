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
  const [aiInsights, setAiInsights] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState(null);

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

  const fetchAiInsights = async () => {
    setAiLoading(true);
    setAiError(null);
    try {
      const token = await user.getIdToken();
      const res = await fetch('http://localhost:3001/api/ai-analytics/predict', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (res.ok) {
        const data = await res.json();
        setAiInsights(data);
      } else {
        const err = await res.json();
        setAiError(err.error || 'Failed to generate insights');
      }
    } catch (err) {
      setAiError('Failed to connect to AI analytics service');
    } finally {
      setAiLoading(false);
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

      {/* AI Predictive Analytics */}
      <div className="bg-gradient-to-br from-purple-900/20 to-blue-900/20 shadow rounded-lg p-6 border border-purple-500/30">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-medium text-white flex items-center gap-2">
              <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              AI Predictive Analytics
            </h3>
            <p className="text-sm text-gray-400">Powered by Claude AI</p>
          </div>
          <button
            onClick={fetchAiInsights}
            disabled={aiLoading}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {aiLoading ? (
              <>
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                </svg>
                Analyzing...
              </>
            ) : (
              'Generate Insights'
            )}
          </button>
        </div>

        {aiError && (
          <div className="p-3 bg-red-900/30 border border-red-500/30 rounded-lg text-red-300 text-sm mb-4">
            {aiError}
          </div>
        )}

        {!aiInsights && !aiLoading && !aiError && (
          <div className="text-center py-8 text-gray-400">
            <svg className="mx-auto h-12 w-12 mb-3 text-purple-400/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            <p>Click "Generate Insights" to get AI-powered analysis of your business data.</p>
          </div>
        )}

        {aiInsights && (
          <div className="space-y-4">
            {aiInsights.insights?.demandForecast && (
              <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                <h4 className="text-blue-400 font-medium text-sm mb-1">Demand Forecast</h4>
                <p className="text-gray-300 text-sm">{aiInsights.insights.demandForecast}</p>
              </div>
            )}
            {aiInsights.insights?.performanceInsights && (
              <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                <h4 className="text-green-400 font-medium text-sm mb-1">Performance Insights</h4>
                <p className="text-gray-300 text-sm">{aiInsights.insights.performanceInsights}</p>
              </div>
            )}
            {aiInsights.insights?.revenueOptimization && (
              <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                <h4 className="text-yellow-400 font-medium text-sm mb-1">Revenue Optimization</h4>
                <p className="text-gray-300 text-sm">{aiInsights.insights.revenueOptimization}</p>
              </div>
            )}
            {aiInsights.insights?.riskAlerts && (
              <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                <h4 className="text-red-400 font-medium text-sm mb-1">Risk Alerts</h4>
                <p className="text-gray-300 text-sm">{aiInsights.insights.riskAlerts}</p>
              </div>
            )}
            {aiInsights.insights?.driverUtilization && (
              <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                <h4 className="text-purple-400 font-medium text-sm mb-1">Driver Utilization</h4>
                <p className="text-gray-300 text-sm">{aiInsights.insights.driverUtilization}</p>
              </div>
            )}
            {aiInsights.insights?.recommendations && Array.isArray(aiInsights.insights.recommendations) && (
              <div className="p-4 bg-gray-800/50 rounded-lg border border-purple-500/30">
                <h4 className="text-purple-400 font-medium text-sm mb-2">Actionable Recommendations</h4>
                <ul className="space-y-1">
                  {aiInsights.insights.recommendations.map((rec, i) => (
                    <li key={i} className="text-gray-300 text-sm flex items-start gap-2">
                      <span className="text-purple-400 font-bold">{i + 1}.</span>
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {aiInsights.insights?.raw && (
              <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                <h4 className="text-gray-400 font-medium text-sm mb-1">AI Analysis</h4>
                <p className="text-gray-300 text-sm whitespace-pre-wrap">{aiInsights.insights.raw}</p>
              </div>
            )}
            {aiInsights.generatedAt && (
              <p className="text-xs text-gray-500 text-right">
                Generated: {new Date(aiInsights.generatedAt).toLocaleString()}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default BusinessOwnerCharts;
