'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { UserPlus, Bell, Shield, Sparkles } from 'lucide-react';

export default function AdminHeader() {
  const { data: session } = useSession();
  const [stats, setStats] = useState<{ pendingApprovals: number; newInquiries: number } | null>(null);

  useEffect(() => {
    async function fetchAlerts() {
      try {
        const res = await fetch('/api/dashboard/stats');
        if (res.ok) {
          const data = await res.json();
          setStats({
            pendingApprovals: data.stats?.pendingApprovals || 0,
            newInquiries: data.stats?.newInquiries || 0,
          });
        }
      } catch (e) {
        // Silent fail
      }
    }
    fetchAlerts();
  }, []);

  const isSuperAdmin = session?.user?.role === 'super_admin';

  return (
    <header className="h-16 bg-white border-b border-sage-200 px-6 flex items-center justify-between sticky top-0 z-30 shadow-xs">
      {/* Left: Role and Organization status */}
      <div className="flex items-center space-x-3">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-sage-100 text-sage-800 border border-sage-200">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          System Live
        </span>
        {isSuperAdmin && (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-terracotta-100 text-terracotta-800 border border-terracotta-200">
            <Shield className="w-3.5 h-3.5" />
            Super Admin Mode
          </span>
        )}
      </div>

      {/* Right: Alerts & Primary Action */}
      <div className="flex items-center space-x-4">
        {/* Pending Approvals Notice for Super Admin */}
        {isSuperAdmin && stats && stats.pendingApprovals > 0 && (
          <Link
            href="/admin/users"
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-amber-50 text-amber-800 border border-amber-300 hover:bg-amber-100 transition-colors"
          >
            <Bell className="w-3.5 h-3.5 text-amber-600 animate-bounce" />
            <span>{stats.pendingApprovals} Pending Approval{stats.pendingApprovals > 1 ? 's' : ''}</span>
          </Link>
        )}

        {/* New Inquiries Notice */}
        {stats && stats.newInquiries > 0 && (
          <Link
            href="/admin/inquiries"
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-sage-100 text-sage-800 border border-sage-300 hover:bg-sage-200 transition-colors"
          >
            <span>{stats.newInquiries} New Inquir{stats.newInquiries > 1 ? 'ies' : 'y'}</span>
          </Link>
        )}

        {/* Primary Action: Admit Resident */}
        <Link
          href="/admin/residents/new"
          className="flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-semibold text-white bg-sage-600 hover:bg-sage-700 shadow-sm transition-all focus:ring-2 focus:ring-sage-500"
        >
          <UserPlus className="w-4 h-4" />
          <span>+ Admit Resident</span>
        </Link>
      </div>
    </header>
  );
}
