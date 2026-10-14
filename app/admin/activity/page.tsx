'use client';

import React, { useState, useEffect } from 'react';
import {
  History,
  Search,
  ChevronLeft,
  ChevronRight,
  Shield,
  Activity,
  User,
  Users,
  BedDouble,
  MessageSquare,
  ClipboardList,
  Lock,
} from 'lucide-react';

interface LogItem {
  _id: string;
  userName: string;
  userEmail: string;
  userRole: string;
  action: string;
  entityType: string;
  entityId?: string;
  details: string;
  ipAddress?: string;
  userAgent?: string;
  createdAt: string;
}

export default function ActivityLogPage() {
  const [logs, setLogs] = useState<LogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [entityFilter, setEntityFilter] = useState('all');

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (entityFilter !== 'all') params.set('entityType', entityFilter);
      params.set('page', String(page));
      params.set('limit', '20');

      const res = await fetch(`/api/activity?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setLogs(data.logs || []);
        setTotalPages(data.pagination?.totalPages || 1);
        setTotalCount(data.pagination?.total || 0);
      }
    } catch (err) {
      console.error('Failed to load activity logs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [search, entityFilter, page]);

  const getEntityIcon = (type: string) => {
    switch (type) {
      case 'Resident':
        return <Users className="w-3.5 h-3.5 text-sage-600" />;
      case 'Room':
        return <BedDouble className="w-3.5 h-3.5 text-terracotta-600" />;
      case 'User':
        return <Shield className="w-3.5 h-3.5 text-blue-600" />;
      case 'Inquiry':
        return <MessageSquare className="w-3.5 h-3.5 text-amber-600" />;
      case 'Visitor':
        return <ClipboardList className="w-3.5 h-3.5 text-emerald-600" />;
      case 'Auth':
        return <Lock className="w-3.5 h-3.5 text-purple-600" />;
      default:
        return <Activity className="w-3.5 h-3.5 text-zinc-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-sage-900 flex items-center gap-2">
            <History className="w-6 h-6 text-terracotta-500" />
            <span>Immutable Activity Audit Trail</span>
          </h1>
          <p className="text-xs text-sage-600">
            Cryptographic and timestamped logging of staff logins, sensitive ID views, and resident record edits
          </p>
        </div>
        <span className="text-xs px-3 py-1 bg-sage-100 text-sage-800 rounded-full font-semibold border border-sage-200">
          Total {totalCount} events logged
        </span>
      </div>

      {/* Search and Filter */}
      <div className="bg-white p-4 rounded-2xl border border-sage-200 shadow-xs flex flex-wrap items-center gap-3 text-xs">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-sage-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by user, action, details..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full pl-9 pr-3 py-2 border border-sage-200 rounded-xl bg-cream-50/50"
          />
        </div>

        <div>
          <select
            value={entityFilter}
            onChange={(e) => {
              setEntityFilter(e.target.value);
              setPage(1);
            }}
            className="py-2 px-3 border border-sage-200 rounded-xl bg-cream-50/50 font-medium text-sage-800"
          >
            <option value="all">All Modules</option>
            <option value="Resident">Resident Records</option>
            <option value="Room">Rooms & Beds</option>
            <option value="Visitor">Visitor Log</option>
            <option value="Inquiry">Inquiries</option>
            <option value="User">User Management</option>
            <option value="Auth">Authentication / Logins</option>
          </select>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-white rounded-2xl border border-sage-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-sage-800">
            <thead className="bg-sage-50 text-[11px] font-bold text-sage-700 uppercase tracking-wider border-b border-sage-200">
              <tr>
                <th className="py-3.5 px-4">Timestamp</th>
                <th className="py-3.5 px-4">Operator / User</th>
                <th className="py-3.5 px-4">Action</th>
                <th className="py-3.5 px-4">Module</th>
                <th className="py-3.5 px-4">Event Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sage-100 text-xs">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-sage-500">
                    <div className="w-8 h-8 border-3 border-sage-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                    Retrieving audit trail...
                  </td>
                </tr>
              ) : logs.length > 0 ? (
                logs.map((log) => (
                  <tr key={log._id} className="hover:bg-cream-50/60 transition-colors">
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="font-mono text-sage-900 font-medium">
                        {new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                      </div>
                      <div className="text-[11px] text-sage-500">
                        {new Date(log.createdAt).toLocaleDateString('en-GB')}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="font-bold text-sage-900 block">{log.userName}</span>
                      <span className="text-[11px] text-sage-500 font-mono">
                        {log.userEmail} ({log.userRole})
                      </span>
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full font-mono text-[10px] font-bold ${
                          log.action.includes('DELETE')
                            ? 'bg-red-100 text-red-800'
                            : log.action.includes('DECRYPT')
                            ? 'bg-amber-100 text-amber-800 border border-amber-300'
                            : log.action.includes('CREATE') || log.action.includes('APPROVE')
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-sage-100 text-sage-800'
                        }`}
                      >
                        {log.action}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-cream-100 border border-cream-200 text-sage-800 font-medium text-[11px]">
                        {getEntityIcon(log.entityType)}
                        <span>{log.entityType}</span>
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-sage-700 leading-relaxed max-w-md">
                      {log.details}
                      {log.ipAddress && log.ipAddress !== '127.0.0.1' && (
                        <span className="block text-[10px] text-sage-400 font-mono">
                          IP: {log.ipAddress}
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-sage-500">
                    No activity logs recorded.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="py-3.5 px-6 border-t border-sage-200 flex items-center justify-between text-xs text-sage-600">
            <span>
              Page <span className="font-semibold text-sage-900">{page}</span> of{' '}
              <span className="font-semibold text-sage-900">{totalPages}</span>
            </span>

            <div className="flex items-center space-x-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="p-1.5 rounded-lg border border-sage-200 disabled:opacity-40 hover:bg-sage-50"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="p-1.5 rounded-lg border border-sage-200 disabled:opacity-40 hover:bg-sage-50"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
