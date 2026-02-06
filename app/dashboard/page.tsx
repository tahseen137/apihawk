'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Endpoint {
  id: string;
  name: string;
  url: string;
  expectedStatus: number;
  checks: Check[];
}

interface Check {
  timestamp: number;
  status: number | null;
  responseTime: number | null;
  error?: string;
}

interface EndpointStats {
  uptime: number;
  avgResponseTime: number;
  lastCheck?: Check;
}

export default function Dashboard() {
  const [endpoints, setEndpoints] = useState<Endpoint[]>([]);
  const [stats, setStats] = useState<Map<string, EndpointStats>>(new Map());
  const [isLoading, setIsLoading] = useState(true);
  const [isChecking, setIsChecking] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newEndpoint, setNewEndpoint] = useState({
    name: '',
    url: '',
    expectedStatus: 200,
  });

  const fetchEndpoints = async () => {
    try {
      const res = await fetch('/api/endpoints');
      const data = await res.json();
      setEndpoints(data);
      calculateStats(data);
    } catch (error) {
      console.error('Failed to fetch endpoints:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateStats = (endpointList: Endpoint[]) => {
    const newStats = new Map<string, EndpointStats>();
    
    endpointList.forEach(endpoint => {
      const successfulChecks = endpoint.checks.filter(
        c => c.status === endpoint.expectedStatus
      ).length;
      
      const uptime = endpoint.checks.length > 0
        ? (successfulChecks / endpoint.checks.length) * 100
        : 0;
      
      const validChecks = endpoint.checks.filter(c => c.responseTime !== null);
      const avgResponseTime = validChecks.length > 0
        ? Math.round(validChecks.reduce((acc, c) => acc + (c.responseTime || 0), 0) / validChecks.length)
        : 0;
      
      const lastCheck = endpoint.checks.length > 0
        ? endpoint.checks[endpoint.checks.length - 1]
        : undefined;
      
      newStats.set(endpoint.id, { uptime, avgResponseTime, lastCheck });
    });
    
    setStats(newStats);
  };

  const addEndpoint = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const res = await fetch('/api/endpoints', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newEndpoint),
      });
      
      if (res.ok) {
        setNewEndpoint({ name: '', url: '', expectedStatus: 200 });
        setShowAddForm(false);
        await fetchEndpoints();
      }
    } catch (error) {
      console.error('Failed to add endpoint:', error);
    }
  };

  const deleteEndpoint = async (id: string) => {
    try {
      const res = await fetch(`/api/endpoints?id=${id}`, {
        method: 'DELETE',
      });
      
      if (res.ok) {
        await fetchEndpoints();
      }
    } catch (error) {
      console.error('Failed to delete endpoint:', error);
    }
  };

  const checkAllEndpoints = async () => {
    setIsChecking(true);
    try {
      await fetch('/api/check', { method: 'POST' });
      await fetchEndpoints();
    } catch (error) {
      console.error('Failed to check endpoints:', error);
    } finally {
      setIsChecking(false);
    }
  };

  useEffect(() => {
    fetchEndpoints();
    
    // Auto-check every 60 seconds
    const interval = setInterval(() => {
      checkAllEndpoints();
    }, 60000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getStatusColor = (endpoint: Endpoint, endpointStats?: EndpointStats) => {
    if (!endpointStats?.lastCheck) return 'text-gray-500';
    const isUp = endpointStats.lastCheck.status === endpoint.expectedStatus;
    return isUp ? 'text-green-500' : 'text-red-500';
  };

  const getStatusDot = (endpoint: Endpoint, endpointStats?: EndpointStats) => {
    if (!endpointStats?.lastCheck) return 'bg-gray-500';
    const isUp = endpointStats.lastCheck.status === endpoint.expectedStatus;
    return isUp ? 'bg-green-500 shadow-lg shadow-green-500/50' : 'bg-red-500 shadow-lg shadow-red-500/50';
  };

  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    
    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return date.toLocaleDateString();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="glass mx-4 mt-4 p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-red-600 to-orange-600 rounded-lg flex items-center justify-center">
              <span className="text-xl font-bold">⚡</span>
            </div>
            <span className="text-xl font-bold">APIHawk</span>
          </Link>
          <button
            onClick={checkAllEndpoints}
            disabled={isChecking}
            className="btn-secondary disabled:opacity-50"
          >
            {isChecking ? 'Checking...' : 'Check All'}
          </button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Dashboard</h1>
            <p className="text-gray-400">Monitor your API endpoints</p>
          </div>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="btn-primary"
          >
            + Add Endpoint
          </button>
        </div>

        {/* Add Endpoint Form */}
        {showAddForm && (
          <div className="glass p-6 mb-8">
            <form onSubmit={addEndpoint} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Endpoint Name</label>
                <input
                  type="text"
                  value={newEndpoint.name}
                  onChange={(e) => setNewEndpoint({ ...newEndpoint, name: e.target.value })}
                  placeholder="My API"
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">URL</label>
                <input
                  type="url"
                  value={newEndpoint.url}
                  onChange={(e) => setNewEndpoint({ ...newEndpoint, url: e.target.value })}
                  placeholder="https://api.example.com/health"
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Expected Status Code</label>
                <input
                  type="number"
                  value={newEndpoint.expectedStatus}
                  onChange={(e) => setNewEndpoint({ ...newEndpoint, expectedStatus: parseInt(e.target.value) })}
                  className="input-field"
                  required
                />
              </div>
              <div className="flex gap-3">
                <button type="submit" className="btn-primary">
                  Add Endpoint
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Endpoints Grid */}
        {endpoints.length === 0 ? (
          <div className="status-card text-center py-12">
            <div className="text-6xl mb-4">🎯</div>
            <h3 className="text-2xl font-bold mb-2">No endpoints yet</h3>
            <p className="text-gray-400 mb-6">Add your first API endpoint to start monitoring</p>
            <button onClick={() => setShowAddForm(true)} className="btn-primary">
              Add Your First Endpoint
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {endpoints.map((endpoint) => {
              const endpointStats = stats.get(endpoint.id);
              return (
                <div key={endpoint.id} className="status-card">
                  {/* Status Indicator */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${getStatusDot(endpoint, endpointStats)} animate-pulse`} />
                      <h3 className="text-xl font-bold">{endpoint.name}</h3>
                    </div>
                    <button
                      onClick={() => deleteEndpoint(endpoint.id)}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                    >
                      ✕
                    </button>
                  </div>

                  {/* URL */}
                  <p className="text-sm text-gray-400 mb-4 truncate">{endpoint.url}</p>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <div className="text-sm text-gray-400">Uptime</div>
                      <div className={`text-2xl font-bold ${getStatusColor(endpoint, endpointStats)}`}>
                        {endpointStats ? `${endpointStats.uptime.toFixed(1)}%` : 'N/A'}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-400">Avg Response</div>
                      <div className="text-2xl font-bold">
                        {endpointStats && endpointStats.avgResponseTime > 0
                          ? `${endpointStats.avgResponseTime}ms`
                          : 'N/A'}
                      </div>
                    </div>
                  </div>

                  {/* Last Check */}
                  <div className="text-sm text-gray-400 mb-4">
                    Last checked: {endpointStats?.lastCheck 
                      ? formatTimestamp(endpointStats.lastCheck.timestamp)
                      : 'Never'}
                  </div>

                  {/* Badge Code */}
                  <div className="glass p-3 rounded-lg">
                    <div className="text-xs text-gray-400 mb-1">Status Badge:</div>
                    <code className="text-xs break-all">
                      {`![Status](${typeof window !== 'undefined' ? window.location.origin : ''}/api/badge/${endpoint.id})`}
                    </code>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
