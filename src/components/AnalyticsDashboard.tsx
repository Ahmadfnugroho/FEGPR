import React, { useState, useEffect } from 'react';
import { useAnalytics } from '../hooks/useAnalytics';

interface AnalyticsDashboardProps {
  isOpen: boolean;
  onClose: () => void;
}

const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ isOpen, onClose }) => {
  const { getAnalyticsData, clearAnalyticsData } = useAnalytics();
  const [data, setData] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'events' | 'sessions' | 'performance'>('overview');

  useEffect(() => {
    if (isOpen) {
      const analyticsData = getAnalyticsData();
      setData(analyticsData);
    }
  }, [isOpen, getAnalyticsData]);

  const refreshData = () => {
    const analyticsData = getAnalyticsData();
    setData(analyticsData);
  };

  const handleClearData = () => {
    if (confirm('Are you sure you want to clear all analytics data?')) {
      clearAnalyticsData();
      refreshData();
    }
  };

  const formatDuration = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}m ${seconds}s`;
  };

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp).toLocaleString('id-ID');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-6xl h-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">📊 Analytics Dashboard</h2>
          <div className="flex items-center space-x-3">
            <button
              onClick={refreshData}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              🔄 Refresh
            </button>
            <button
              onClick={handleClearData}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              🗑️ Clear Data
            </button>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
            >
              ×
            </button>
          </div>
        </div>

        <div className="flex h-full">
          {/* Sidebar */}
          <div className="w-64 bg-gray-50 border-r border-gray-200 overflow-y-auto">
            <nav className="p-4 space-y-2">
              {[
                { id: 'overview', label: 'Overview', icon: '📈' },
                { id: 'events', label: 'Events', icon: '🎯' },
                { id: 'sessions', label: 'Sessions', icon: '👥' },
                { id: 'performance', label: 'Performance', icon: '⚡' }
              ].map(({ id, label, icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id as any)}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                    activeTab === id
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {icon} {label}
                </button>
              ))}
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-6">
              {/* Overview Tab */}
              {activeTab === 'overview' && data && (
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-gray-900">Overview</h3>
                  
                  {/* Summary Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h4 className="text-sm font-medium text-blue-800">Total Events</h4>
                      <p className="text-2xl font-bold text-blue-600">{data.summary.totalEvents}</p>
                    </div>
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <h4 className="text-sm font-medium text-green-800">Total Sessions</h4>
                      <p className="text-2xl font-bold text-green-600">{data.summary.totalSessions}</p>
                    </div>
                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                      <h4 className="text-sm font-medium text-purple-800">Avg Session Duration</h4>
                      <p className="text-2xl font-bold text-purple-600">
                        {formatDuration(data.summary.avgSessionDuration)}
                      </p>
                    </div>
                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                      <h4 className="text-sm font-medium text-orange-800">Current Session</h4>
                      <p className="text-sm font-bold text-orange-600">
                        {data.currentSession ? 'Active' : 'None'}
                      </p>
                    </div>
                  </div>

                  {/* Current Session Info */}
                  {data.currentSession && (
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                      <h4 className="text-lg font-semibold text-gray-900 mb-3">Current Session</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="font-medium text-gray-600">Session ID:</span>
                          <p className="text-gray-900 font-mono">{data.currentSession.sessionId}</p>
                        </div>
                        <div>
                          <span className="font-medium text-gray-600">Device:</span>
                          <p className="text-gray-900 capitalize">{data.currentSession.device}</p>
                        </div>
                        <div>
                          <span className="font-medium text-gray-600">Page Views:</span>
                          <p className="text-gray-900">{data.currentSession.pageViews}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Recent Events */}
                  <div className="bg-white border border-gray-200 rounded-lg">
                    <div className="px-4 py-3 border-b border-gray-200">
                      <h4 className="text-lg font-semibold text-gray-900">Recent Events</h4>
                    </div>
                    <div className="p-4">
                      {data.events.slice(-5).reverse().map((event: any, index: number) => (
                        <div key={index} className="flex items-center space-x-3 py-2 border-b border-gray-100 last:border-b-0">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <div className="flex-1">
                            <span className="font-medium text-gray-900">{event.name}</span>
                            <span className="text-gray-500 text-sm ml-2">
                              {formatTimestamp(event.timestamp)}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Events Tab */}
              {activeTab === 'events' && data && (
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-gray-900">All Events</h3>
                  
                  <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Event</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Page</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Parameters</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Timestamp</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {data.events.slice().reverse().map((event: any, index: number) => (
                            <tr key={index} className="hover:bg-gray-50">
                              <td className="px-4 py-3 text-sm font-medium text-gray-900">
                                {event.name}
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-600">
                                {event.page || '-'}
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-600">
                                <details className="cursor-pointer">
                                  <summary className="text-blue-600 hover:text-blue-800">
                                    View params
                                  </summary>
                                  <pre className="mt-2 text-xs bg-gray-100 p-2 rounded overflow-x-auto">
                                    {JSON.stringify(event.parameters, null, 2)}
                                  </pre>
                                </details>
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-600">
                                {formatTimestamp(event.timestamp)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* Sessions Tab */}
              {activeTab === 'sessions' && data && (
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-gray-900">Sessions</h3>
                  
                  <div className="grid grid-cols-1 gap-4">
                    {data.sessions.slice().reverse().map((session: any, index: number) => (
                      <div key={index} className="bg-white border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-start mb-3">
                          <h4 className="font-medium text-gray-900 font-mono">{session.sessionId}</h4>
                          <span className="text-sm text-gray-500">
                            {formatTimestamp(session.startTime)}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-sm">
                          <div>
                            <span className="text-gray-600">Duration:</span>
                            <p className="font-medium">{formatDuration(session.duration)}</p>
                          </div>
                          <div>
                            <span className="text-gray-600">Page Views:</span>
                            <p className="font-medium">{session.pageViews}</p>
                          </div>
                          <div>
                            <span className="text-gray-600">Events:</span>
                            <p className="font-medium">{session.events?.length || 0}</p>
                          </div>
                          <div>
                            <span className="text-gray-600">Device:</span>
                            <p className="font-medium capitalize">{session.device}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Performance Tab */}
              {activeTab === 'performance' && data && (
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-gray-900">Performance Metrics</h3>
                  
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-4">Performance Events</h4>
                    {data.events.filter((e: any) => e.name === 'performance_metrics').map((event: any, index: number) => (
                      <div key={index} className="mb-4 p-3 bg-gray-50 rounded-lg">
                        <div className="text-sm text-gray-600 mb-2">
                          {formatTimestamp(event.timestamp)} - {event.page}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="text-gray-600">Page Load:</span>
                            <p className="font-medium">{Math.round(event.parameters.pageLoadTime)}ms</p>
                          </div>
                          <div>
                            <span className="text-gray-600">TTFB:</span>
                            <p className="font-medium">{Math.round(event.parameters.timeToFirstByte)}ms</p>
                          </div>
                          <div>
                            <span className="text-gray-600">FCP:</span>
                            <p className="font-medium">{Math.round(event.parameters.firstContentfulPaint)}ms</p>
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    {data.events.filter((e: any) => e.name === 'performance_metrics').length === 0 && (
                      <p className="text-gray-500 text-center py-4">No performance data available</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
