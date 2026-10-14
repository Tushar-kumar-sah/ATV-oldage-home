'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import {
  ShieldAlert,
  UserCheck,
  UserX,
  Search,
  CheckCircle2,
  AlertCircle,
  X,
  Clock,
  Shield,
  Trash2,
  Mail,
  User,
} from 'lucide-react';

interface UserAccount {
  _id: string;
  name: string;
  email: string;
  role: 'super_admin' | 'staff';
  status: 'active' | 'pending' | 'rejected' | 'deactivated';
  provider: 'credentials' | 'google';
  image?: string;
  phone?: string;
  lastLogin?: string;
  createdAt: string;
}

export default function UsersAndApprovalsPage() {
  const { data: session } = useSession();
  const currentUserId = session?.user?.id;

  const [users, setUsers] = useState<UserAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [roleFilter, setRoleFilter] = useState('all');

  const [toastMessage, setToastMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (statusFilter !== 'all') params.set('status', statusFilter);
      if (roleFilter !== 'all') params.set('role', roleFilter);

      const res = await fetch(`/api/users?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setUsers(data.users || []);
      }
    } catch (err) {
      console.error('Failed to load users:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [search, statusFilter, roleFilter]);

  const handleUpdateUser = async (userId: string, role: string, status: string) => {
    try {
      const res = await fetch(`/api/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role, status }),
      });

      if (res.ok) {
        setToastMessage({
          type: 'success',
          text: `Updated user permissions to ${role} (${status}).`,
        });
        fetchUsers();
      } else {
        const err = await res.json();
        setToastMessage({ type: 'error', text: err.error });
      }
    } catch (e: any) {
      setToastMessage({ type: 'error', text: e.message });
    }
  };

  const handleDeleteUser = async (userId: string, name: string) => {
    if (!confirm(`Are you sure you want to delete the user account for ${name}?`)) return;

    try {
      const res = await fetch(`/api/users/${userId}`, { method: 'DELETE' });
      if (res.ok) {
        setToastMessage({ type: 'success', text: `User account ${name} deleted.` });
        fetchUsers();
      } else {
        const err = await res.json();
        setToastMessage({ type: 'error', text: err.error });
      }
    } catch (e: any) {
      setToastMessage({ type: 'error', text: e.message });
    }
  };

  const pendingUsers = users.filter((u) => u.status === 'pending');
  const activeUsers = users.filter((u) => u.status !== 'pending');

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {toastMessage && (
        <div
          className={`p-4 rounded-xl flex items-center justify-between border ${
            toastMessage.type === 'success'
              ? 'bg-emerald-50 text-emerald-900 border-emerald-200'
              : 'bg-red-50 text-red-900 border-red-200'
          }`}
        >
          <div className="flex items-center space-x-2 text-sm font-medium">
            {toastMessage.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-600" />
            )}
            <span>{toastMessage.text}</span>
          </div>
          <button onClick={() => setToastMessage(null)}>
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-sage-900 flex items-center gap-2">
            <Shield className="w-6 h-6 text-terracotta-500" />
            <span>Users & Access Approvals</span>
          </h1>
          <p className="text-xs text-sage-600">
            Super Administrator console to review Google OAuth signups and assign operational roles
          </p>
        </div>
      </div>

      {/* Pending Approvals Queue Banner */}
      {pendingUsers.length > 0 && (
        <div className="bg-amber-50 rounded-2xl p-6 border-2 border-amber-300 shadow-sm space-y-4">
          <div className="flex items-center space-x-3">
            <Clock className="w-6 h-6 text-amber-600 shrink-0 animate-pulse" />
            <div>
              <h2 className="text-base font-bold text-amber-950">
                {pendingUsers.length} Account{pendingUsers.length > 1 ? 's' : ''} Pending Your Verification
              </h2>
              <p className="text-xs text-amber-800">
                These users signed in via Google and are currently locked out of all patient records until you assign them a role.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {pendingUsers.map((pUser) => (
              <div
                key={pUser._id}
                className="bg-white p-4 rounded-xl border border-amber-200 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs"
              >
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-sm text-sage-900">{pUser.name}</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                      Pending Google Signup
                    </span>
                  </div>
                  <p className="text-sage-600 font-mono mt-0.5">{pUser.email}</p>
                  <p className="text-sage-400 text-[11px]">
                    Registered on: {new Date(pUser.createdAt).toLocaleString('en-GB')}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => handleUpdateUser(pUser._id, 'staff', 'active')}
                    className="px-3.5 py-2 text-xs font-semibold bg-sage-700 hover:bg-sage-800 text-white rounded-xl shadow-xs transition-colors flex items-center space-x-1"
                  >
                    <UserCheck className="w-3.5 h-3.5" />
                    <span>Approve as Staff</span>
                  </button>

                  <button
                    onClick={() => handleUpdateUser(pUser._id, 'super_admin', 'active')}
                    className="px-3.5 py-2 text-xs font-semibold bg-terracotta-500 hover:bg-terracotta-600 text-white rounded-xl shadow-xs transition-colors flex items-center space-x-1"
                  >
                    <Shield className="w-3.5 h-3.5" />
                    <span>Approve as Super Admin</span>
                  </button>

                  <button
                    onClick={() => handleUpdateUser(pUser._id, 'staff', 'rejected')}
                    className="px-3 py-2 text-xs font-semibold bg-zinc-100 hover:bg-red-100 text-zinc-700 hover:text-red-700 rounded-xl transition-colors"
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-2xl border border-sage-200 shadow-xs flex flex-wrap items-center gap-3 text-xs">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-sage-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by user name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 border border-sage-200 rounded-xl bg-cream-50/50"
          />
        </div>

        <div>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="py-2 px-3 border border-sage-200 rounded-xl bg-cream-50/50 font-medium text-sage-800"
          >
            <option value="all">All Roles</option>
            <option value="super_admin">Super Administrator</option>
            <option value="staff">Staff Member</option>
          </select>
        </div>

        <div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="py-2 px-3 border border-sage-200 rounded-xl bg-cream-50/50 font-medium text-sage-800"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="pending">Pending</option>
            <option value="deactivated">Deactivated</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* All Users Directory */}
      <div className="bg-white rounded-2xl border border-sage-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-sage-800">
            <thead className="bg-sage-50 text-[11px] font-bold text-sage-700 uppercase tracking-wider border-b border-sage-200">
              <tr>
                <th className="py-3.5 px-4">User</th>
                <th className="py-3.5 px-4">Sign-In Provider</th>
                <th className="py-3.5 px-4">Role</th>
                <th className="py-3.5 px-4">Account Status</th>
                <th className="py-3.5 px-4">Last Active</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sage-100 text-xs">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-sage-500">
                    <div className="w-8 h-8 border-3 border-sage-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                    Loading registered user list...
                  </td>
                </tr>
              ) : activeUsers.length > 0 ? (
                activeUsers.map((user) => {
                  const isCurrent = user._id === currentUserId;

                  return (
                    <tr key={user._id} className="hover:bg-cream-50/60 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-9 h-9 rounded-full bg-cream-200 border border-cream-300 flex items-center justify-center font-bold text-sage-800 text-xs shrink-0">
                            {user.name.slice(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <span className="font-bold text-sage-900 block">
                              {user.name} {isCurrent && <span className="text-[10px] text-terracotta-600">(You)</span>}
                            </span>
                            <span className="text-[11px] text-sage-500 font-mono">
                              {user.email}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="capitalize font-medium text-sage-700">
                          {user.provider}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        {isCurrent ? (
                          <span className="font-semibold text-terracotta-700">
                            Super Administrator
                          </span>
                        ) : (
                          <select
                            value={user.role}
                            onChange={(e) =>
                              handleUpdateUser(user._id, e.target.value, user.status)
                            }
                            className="py-1 px-2 border border-sage-200 rounded-lg text-xs bg-white font-medium"
                          >
                            <option value="staff">Staff Member</option>
                            <option value="super_admin">Super Administrator</option>
                          </select>
                        )}
                      </td>

                      <td className="py-3.5 px-4">
                        {isCurrent ? (
                          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                            Active
                          </span>
                        ) : (
                          <select
                            value={user.status}
                            onChange={(e) =>
                              handleUpdateUser(user._id, user.role, e.target.value)
                            }
                            className={`py-1 px-2 border rounded-lg text-xs font-semibold ${
                              user.status === 'active'
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                                : user.status === 'deactivated'
                                ? 'bg-red-50 text-red-800 border-red-300'
                                : 'bg-zinc-50 text-zinc-800 border-zinc-300'
                            }`}
                          >
                            <option value="active">Active</option>
                            <option value="deactivated">Deactivated</option>
                            <option value="rejected">Rejected</option>
                          </select>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-sage-500">
                        {user.lastLogin
                          ? new Date(user.lastLogin).toLocaleString('en-GB')
                          : 'Never logged in'}
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        {!isCurrent && (
                          <button
                            onClick={() => handleDeleteUser(user._id, user.name)}
                            title="Delete Account"
                            className="p-1.5 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-sage-500">
                    No users matching criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
