import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { adminAPI } from '../services/api';
import { Navigate } from 'react-router-dom';

const STATUS_COLORS = {
  trial:   'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300',
  active:  'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300',
  expired: 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300',
};

export function AdminDashboard() {
  const { user, logout } = useAuth();

  const [stats, setStats]   = useState(null);
  const [users, setUsers]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState('');

  if (user?.role !== 'admin') return <Navigate to="/dashboard" replace />;

  const load = async () => {
    try {
      setLoading(true);
      const [s, u] = await Promise.all([adminAPI.getStats(), adminAPI.getUsers()]);
      setStats(s.data.data);
      setUsers(u.data.data.filter(u => u.role !== 'admin'));
    } catch {
      setError('Failed to load admin data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const updateStatus = async (id, status) => {
    await adminAPI.updateSubscription(id, status);
    setUsers(prev => prev.map(u => u._id === id ? { ...u, subscriptionStatus: status } : u));
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Admin Dashboard</h1>
            <p className="text-slate-500 text-sm">ELEVARE platform overview</p>
          </div>
          <button onClick={logout} className="text-sm text-slate-500 hover:text-red-500 transition-colors">
            Sign out
          </button>
        </div>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
            {[
              { label: 'Total Users',         value: stats.totalUsers,         color: 'text-indigo-600' },
              { label: 'Conversations',        value: stats.totalConversations, color: 'text-blue-600' },
              { label: 'On Trial',             value: stats.trialUsers,         color: 'text-yellow-600' },
              { label: 'Subscribed',           value: stats.activeUsers,        color: 'text-green-600' },
              { label: 'Expired',              value: stats.expiredUsers,       color: 'text-red-600' },
            ].map(s => (
              <div key={s.label} className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm text-center">
                <p className={`text-3xl font-bold ${s.color}`}>{s.value}</p>
                <p className="text-xs text-slate-500 mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        )}

        {/* Users Table */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-100 dark:border-slate-700">
            <h2 className="font-semibold text-slate-900 dark:text-white">All Users</h2>
          </div>
          {loading ? (
            <p className="p-6 text-slate-500 text-center">Loading...</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 dark:bg-slate-700/50 text-slate-500 dark:text-slate-400 text-xs uppercase">
                  <tr>
                    {['Name', 'Email', 'Joined', 'Conversations', 'Trial Days Left', 'Status', 'Actions'].map(h => (
                      <th key={h} className="px-4 py-3 text-left font-medium">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                  {users.map(u => (
                    <tr key={u._id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                      <td className="px-4 py-3 font-medium text-slate-900 dark:text-white">{u.name}</td>
                      <td className="px-4 py-3 text-slate-500">{u.email}</td>
                      <td className="px-4 py-3 text-slate-500">{new Date(u.createdAt).toLocaleDateString()}</td>
                      <td className="px-4 py-3 text-slate-500">{u.conversationCount ?? '—'}</td>
                      <td className="px-4 py-3 text-slate-500">
                        {u.subscriptionStatus === 'trial' ? (u.trialDaysLeft ?? '—') + ' days' : '—'}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[u.subscriptionStatus] || ''}`}>
                          {u.subscriptionStatus}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <select
                          value={u.subscriptionStatus}
                          onChange={e => updateStatus(u._id, e.target.value)}
                          className="text-xs border border-slate-200 dark:border-slate-600 rounded-lg px-2 py-1 bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200"
                        >
                          <option value="trial">Trial</option>
                          <option value="active">Active</option>
                          <option value="expired">Expired</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                  {users.length === 0 && (
                    <tr><td colSpan={7} className="px-4 py-8 text-center text-slate-400">No users yet.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
