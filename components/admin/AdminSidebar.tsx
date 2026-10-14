'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import {
  Users,
  LayoutDashboard,
  BedDouble,
  UserCheck,
  ClipboardList,
  MessageSquare,
  ShieldAlert,
  History,
  LogOut,
  HeartHandshake,
  ExternalLink,
  ChevronRight,
  X,
} from 'lucide-react';

interface NavItem {
  name: string;
  href: string;
  icon: React.ElementType;
  superAdminOnly?: boolean;
  badge?: string;
}

interface AdminSidebarProps {
  mobileOpen?: boolean;
  onClose?: () => void;
}

export default function AdminSidebar({ mobileOpen = false, onClose }: AdminSidebarProps) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const isSuperAdmin = session?.user?.role === 'super_admin';

  const navItems: NavItem[] = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Residents', href: '/admin/residents', icon: Users },
    { name: 'Rooms & Beds', href: '/admin/rooms', icon: BedDouble },
    { name: 'Staff Directory', href: '/admin/staff', icon: UserCheck },
    { name: 'Visitor Log', href: '/admin/visitors', icon: ClipboardList },
    { name: 'Inquiries', href: '/admin/inquiries', icon: MessageSquare },
    {
      name: 'Users & Approvals',
      href: '/admin/users',
      icon: ShieldAlert,
      superAdminOnly: true,
      badge: 'Admin',
    },
    {
      name: 'Tracked Users',
      href: '/admin/registered-users',
      icon: UserCheck,
      superAdminOnly: true,
      badge: 'Public',
    },
    {
      name: 'Activity Audit Log',
      href: '/admin/activity',
      icon: History,
      superAdminOnly: true,
      badge: 'Admin',
    },
  ];

  const handleNavClick = () => {
    if (onClose) onClose();
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-[#052E16] text-emerald-100">
      {/* Brand Header */}
      <div className="p-5 sm:p-6 border-b border-emerald-900/80 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-600 flex items-center justify-center text-white shadow-md shadow-amber-950/20 shrink-0">
            <HeartHandshake className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-serif font-bold text-lg text-white leading-tight">Anand Dham</h1>
            <p className="text-xs text-amber-300 font-semibold tracking-wide">Sanctuary Portal</p>
          </div>
        </div>

        {/* Close Button on Mobile Drawer */}
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="md:hidden p-1.5 rounded-lg text-emerald-300 hover:text-white hover:bg-emerald-900 transition-colors"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-5 space-y-1.5 overflow-y-auto">
        <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-emerald-400">
          Core Operations
        </div>
        {navItems.map((item) => {
          if (item.superAdminOnly && !isSuperAdmin) {
            return null;
          }

          const isActive =
            pathname === item.href || (item.href !== '/admin/dashboard' && pathname.startsWith(item.href));
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={handleNavClick}
              className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-emerald-900 text-white shadow-xs font-bold border border-emerald-700/50'
                  : 'text-emerald-200/80 hover:bg-emerald-900/50 hover:text-white'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Icon
                  className={`w-4 h-4 ${
                    isActive ? 'text-amber-400' : 'text-emerald-400/80'
                  }`}
                />
                <span>{item.name}</span>
              </div>
              {item.badge && (
                <span className="text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}

        <div className="pt-5 px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-emerald-400">
          Public Website
        </div>
        <Link
          href="/"
          target="_blank"
          onClick={handleNavClick}
          className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs text-emerald-300 hover:bg-emerald-900/50 hover:text-white transition-colors"
        >
          <div className="flex items-center space-x-3">
            <ExternalLink className="w-4 h-4 text-emerald-400" />
            <span>Visit Home Page</span>
          </div>
          <ChevronRight className="w-3.5 h-3.5 text-emerald-600" />
        </Link>
      </nav>

      {/* User Status & Sign Out */}
      <div className="p-4 border-t border-emerald-900/80 bg-[#042411]">
        <div className="flex items-center space-x-3 mb-3">
          <div className="w-9 h-9 rounded-full bg-emerald-800 border border-emerald-700 flex items-center justify-center font-bold text-white text-sm shrink-0">
            {session?.user?.name ? session.user.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-white truncate">{session?.user?.name || 'Staff User'}</p>
            <p className="text-xs text-emerald-300 truncate capitalize">
              {session?.user?.role === 'super_admin' ? (
                <span className="text-amber-300 font-medium">Super Administrator</span>
              ) : (
                'Staff Member'
              )}
            </p>
          </div>
        </div>

        <button
          onClick={() => signOut({ callbackUrl: '/login' })}
          className="w-full flex items-center justify-center space-x-2 px-3 py-2 text-xs font-semibold rounded-xl text-emerald-200 bg-emerald-900/80 hover:bg-red-950/80 hover:text-red-200 hover:border-red-800/60 border border-emerald-800 transition-colors"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out Safely</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* 1. Permanent Desktop Sidebar */}
      <aside className="hidden md:flex md:w-64 md:shrink-0 flex-col min-h-screen border-r border-emerald-950">
        {sidebarContent}
      </aside>

      {/* 2. Mobile Backdrop Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs md:hidden animate-in fade-in duration-200"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* 3. Mobile Slide-in Drawer */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 md:hidden transform transition-transform duration-300 ease-in-out shadow-2xl ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {sidebarContent}
      </aside>
    </>
  );
}
