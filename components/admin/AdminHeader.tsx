'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { UserPlus, Bell, Shield, Menu } from 'lucide-react';

interface AdminHeaderProps {
  onMenuToggle?: () => void;
}

export default function AdminHeader({ onMenuToggle }: AdminHeaderProps) {
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
    <header className="h-16 bg-white border-b border-[#352A25]/15 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30 shadow-2xs">
      {/* Left: Mobile Hamburger & Live status */}
      <div className="flex items-center space-x-2 sm:space-x-3">
        {onMenuToggle && (
          <button
            type="button"
            onClick={onMenuToggle}
            className="md:hidden p-2 rounded-xl text-[#352A25] hover:text-[#A47750] hover:bg-black/5 transition-colors"
            aria-label="Open navigation sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}

        <span className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-full text-[11px] sm:text-xs font-semibold bg-[#78836A]/10 text-[#78836A] border border-[#78836A]/30">
          <span className="w-2 h-2 rounded-full bg-[#78836A] animate-pulse"></span>
          <span>Live Operations</span>
        </span>

        {isSuperAdmin && (
          <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#A47750]/10 text-[#A47750] border border-[#A47750]/30">
            <Shield className="w-3.5 h-3.5 text-[#A47750]" />
            <span>Super Admin</span>
          </span>
        )}
      </div>

      {/* Right: Alerts & Primary Action */}
      <div className="flex items-center space-x-2 sm:space-x-3">
        {/* Pending Approvals Notice for Super Admin */}
        {isSuperAdmin && stats && stats.pendingApprovals > 0 && (
          <Link
            href="/admin/users"
            className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-[#A47750]/10 text-[#A47750] border border-[#A47750]/30 hover:bg-[#A47750]/20 transition-colors"
          >
            <Bell className="w-3.5 h-3.5 text-[#A47750] animate-bounce" />
            <span>{stats.pendingApprovals} Pending</span>
          </Link>
        )}

        {/* New Inquiries Notice */}
        {stats && stats.newInquiries > 0 && (
          <Link
            href="/admin/inquiries"
            className="flex items-center space-x-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-semibold bg-[#78836A]/10 text-[#78836A] border border-[#78836A]/30 hover:bg-[#78836A]/20 transition-colors"
          >
            <span className="w-2 h-2 rounded-full bg-[#A47750] inline-block"></span>
            <span>{stats.newInquiries} <span className="hidden xs:inline">New Queries</span></span>
          </Link>
        )}

        {/* Primary Action: Admit Resident */}
        <Link
          href="/admin/residents/new"
          className="flex items-center space-x-1.5 px-3 sm:px-4 py-2 rounded-xl text-xs font-bold text-[#F7F2EA] bg-[#352A25] hover:bg-[#A47750] shadow-xs transition-all"
        >
          <UserPlus className="w-3.5 h-3.5" />
          <span>+ <span className="hidden sm:inline">Admit </span>Resident</span>
        </Link>
      </div>
    </header>
  );
}
