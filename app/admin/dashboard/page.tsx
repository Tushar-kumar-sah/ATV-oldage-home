'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import {
  Users,
  BedDouble,
  MessageSquare,
  Cake,
  UserCheck,
  ShieldAlert,
  ArrowRight,
  TrendingUp,
  AlertCircle,
  Calendar,
  Sparkles,
  ClipboardList,
} from 'lucide-react';

interface DashboardData {
  stats: {
    totalResidents: number;
    activeResidents: number;
    onLeaveResidents: number;
    dischargedResidents: number;
    totalRooms: number;
    totalBeds: number;
    occupiedBeds: number;
    availableBeds: number;
    occupancyRate: number;
    newInquiries: number;
    pendingApprovals: number;
    activeStaff: number;
    genderBreakdown: {
      male: number;
      female: number;
      other: number;
    };
  };
  recentAdmissions: Array<{
    _id: string;
    fullName: string;
    admissionNumber: string;
    admissionDate: string;
    roomNumber: string;
    status: string;
    gender: string;
    age: number;
    photoUrl?: string;
  }>;
  upcomingBirthdays: Array<{
    _id: string;
    fullName: string;
    roomNumber: string;
    dateOfBirth: string;
    turningAge: number;
    daysRemaining: number;
    photoUrl?: string;
  }>;
}

export default function AdminDashboardPage() {
  const { data: session } = useSession();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      try {
        const res = await fetch('/api/dashboard/stats');
        if (res.ok) {
          const json = await res.json();
          setData(json);
        }
      } catch (err) {
        console.error('Error fetching dashboard stats:', err);
      } finally {
        setLoading(false);
      }
    }
    loadDashboard();
  }, []);

  const isSuperAdmin = session?.user?.role === 'super_admin';

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-sage-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-sage-600 text-sm font-medium">Loading sanctuary dashboard...</p>
        </div>
      </div>
    );
  }

  const stats = data?.stats;

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-sage-800 to-sage-700 rounded-2xl p-6 md:p-8 text-cream-50 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-6 border border-sage-600/40">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-sage-900/60 text-terracotta-300 border border-sage-600/50 mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Senior Care Operations Portal</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-serif font-bold text-white tracking-tight">
            Welcome back, {session?.user?.name || 'Care Team'}
          </h1>
          <p className="mt-1 text-sm text-sage-200 max-w-xl">
            Providing compassionate, secure, and dignified care for our elderly residents. Here is today&apos;s sanctuary summary.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/admin/residents/new"
            className="px-4 py-2.5 rounded-xl font-semibold text-sm bg-terracotta-500 hover:bg-terracotta-600 text-white shadow-sm transition-all"
          >
            + Admit Resident
          </Link>
          <Link
            href="/admin/visitors"
            className="px-4 py-2.5 rounded-xl font-medium text-sm bg-sage-900/80 hover:bg-sage-900 text-cream-100 border border-sage-600/60 transition-all flex items-center space-x-1.5"
          >
            <ClipboardList className="w-4 h-4 text-terracotta-400" />
            <span>Visitor Entry</span>
          </Link>
        </div>
      </div>

      {/* Super Admin Alert: Pending Approvals */}
      {isSuperAdmin && stats && stats.pendingApprovals > 0 && (
        <div className="rounded-xl bg-amber-50 border border-amber-300 p-4 shadow-xs flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <ShieldAlert className="w-6 h-6 text-amber-600 shrink-0" />
            <div>
              <h4 className="text-sm font-bold text-amber-900">
                {stats.pendingApprovals} Staff Member{stats.pendingApprovals > 1 ? 's' : ''} Awaiting Approval
              </h4>
              <p className="text-xs text-amber-700">
                New Google signups are waiting for your verification to access the dashboard.
              </p>
            </div>
          </div>
          <Link
            href="/admin/users"
            className="px-3.5 py-1.5 text-xs font-semibold bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors shrink-0"
          >
            Review & Approve
          </Link>
        </div>
      )}

      {/* Primary Key Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Residents */}
        <div className="bg-white rounded-2xl p-6 border border-sage-200 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-sage-500">
              Active Residents
            </span>
            <div className="w-10 h-10 rounded-xl bg-sage-100 text-sage-700 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline space-x-2">
            <span className="text-3xl font-bold font-serif text-sage-900">
              {stats?.activeResidents ?? 0}
            </span>
            <span className="text-xs text-sage-500">
              of {stats?.totalResidents ?? 0} registered
            </span>
          </div>
          <div className="mt-4 pt-3 border-t border-sage-100 flex items-center justify-between text-xs text-sage-600">
            <span>{stats?.onLeaveResidents ?? 0} On Leave</span>
            <Link
              href="/admin/residents"
              className="text-terracotta-600 font-semibold hover:underline inline-flex items-center"
            >
              View directory <ArrowRight className="w-3 h-3 ml-1" />
            </Link>
          </div>
        </div>

        {/* Room & Bed Availability */}
        <div className="bg-white rounded-2xl p-6 border border-sage-200 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-sage-500">
              Available Beds
            </span>
            <div className="w-10 h-10 rounded-xl bg-cream-200 text-terracotta-600 flex items-center justify-center">
              <BedDouble className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline space-x-2">
            <span className="text-3xl font-bold font-serif text-terracotta-600">
              {stats?.availableBeds ?? 0}
            </span>
            <span className="text-xs text-sage-500">
              vacant / {stats?.totalBeds ?? 0} total
            </span>
          </div>
          <div className="mt-4 pt-3 border-t border-sage-100 flex items-center justify-between text-xs text-sage-600">
            <span>{stats?.occupancyRate ?? 0}% Occupancy</span>
            <Link
              href="/admin/rooms"
              className="text-terracotta-600 font-semibold hover:underline inline-flex items-center"
            >
              Rooms layout <ArrowRight className="w-3 h-3 ml-1" />
            </Link>
          </div>
        </div>

        {/* New Inquiries */}
        <div className="bg-white rounded-2xl p-6 border border-sage-200 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-sage-500">
              New Inquiries
            </span>
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
              <MessageSquare className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline space-x-2">
            <span className="text-3xl font-bold font-serif text-sage-900">
              {stats?.newInquiries ?? 0}
            </span>
            <span className="text-xs text-sage-500">pending response</span>
          </div>
          <div className="mt-4 pt-3 border-t border-sage-100 flex items-center justify-between text-xs text-sage-600">
            <span>Website leads</span>
            <Link
              href="/admin/inquiries"
              className="text-terracotta-600 font-semibold hover:underline inline-flex items-center"
            >
              Check messages <ArrowRight className="w-3 h-3 ml-1" />
            </Link>
          </div>
        </div>

        {/* Care Staff on Duty */}
        <div className="bg-white rounded-2xl p-6 border border-sage-200 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-sage-500">
              Care Staff
            </span>
            <div className="w-10 h-10 rounded-xl bg-sage-100 text-sage-700 flex items-center justify-center">
              <UserCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline space-x-2">
            <span className="text-3xl font-bold font-serif text-sage-900">
              {stats?.activeStaff ?? 0}
            </span>
            <span className="text-xs text-sage-500">active roster</span>
          </div>
          <div className="mt-4 pt-3 border-t border-sage-100 flex items-center justify-between text-xs text-sage-600">
            <span>24/7 coverage</span>
            <Link
              href="/admin/staff"
              className="text-terracotta-600 font-semibold hover:underline inline-flex items-center"
            >
              View shifts <ArrowRight className="w-3 h-3 ml-1" />
            </Link>
          </div>
        </div>
      </div>

      {/* Middle Section: Occupancy Gauge & Upcoming Birthdays */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Occupancy and Demographics */}
        <div className="bg-white rounded-2xl p-6 border border-sage-200 shadow-xs lg:col-span-1 flex flex-col justify-between">
          <div>
            <h3 className="text-base font-serif font-bold text-sage-900 mb-1">
              Sanctuary Occupancy
            </h3>
            <p className="text-xs text-sage-500 mb-5">
              Live capacity breakdown across all floors
            </p>

            {/* Occupancy Bar */}
            <div className="space-y-2 mb-6">
              <div className="flex justify-between text-xs font-semibold text-sage-800">
                <span>Occupied Beds ({stats?.occupiedBeds ?? 0})</span>
                <span>{stats?.occupancyRate ?? 0}%</span>
              </div>
              <div className="w-full bg-sage-100 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-sage-600 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, stats?.occupancyRate ?? 0)}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-[11px] text-sage-500">
                <span>Available: {stats?.availableBeds ?? 0} beds</span>
                <span>Total: {stats?.totalBeds ?? 0} beds</span>
              </div>
            </div>

            {/* Gender Demographics */}
            <h4 className="text-xs font-bold uppercase tracking-wider text-sage-600 mb-3">
              Resident Demographics
            </h4>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-cream-100 p-3 rounded-xl border border-cream-300">
                <span className="text-sage-600 block">Male Elders</span>
                <span className="text-lg font-bold text-sage-900">
                  {stats?.genderBreakdown?.male ?? 0}
                </span>
              </div>
              <div className="bg-cream-100 p-3 rounded-xl border border-cream-300">
                <span className="text-sage-600 block">Female Elders</span>
                <span className="text-lg font-bold text-sage-900">
                  {stats?.genderBreakdown?.female ?? 0}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-sage-100">
            <Link
              href="/admin/rooms"
              className="text-xs font-semibold text-sage-700 hover:text-sage-900 flex items-center justify-between"
            >
              <span>Manage room allocations & bed availability</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Upcoming Birthdays Card */}
        <div className="bg-white rounded-2xl p-6 border border-sage-200 shadow-xs lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-serif font-bold text-sage-900 flex items-center gap-2">
                <Cake className="w-5 h-5 text-terracotta-500" />
                <span>Upcoming Birthdays (Next 30 Days)</span>
              </h3>
              <p className="text-xs text-sage-500">
                Celebrate milestones and organize special moments for our beloved elders
              </p>
            </div>
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-terracotta-100 text-terracotta-800">
              {data?.upcomingBirthdays?.length ?? 0} upcoming
            </span>
          </div>

          {data?.upcomingBirthdays && data.upcomingBirthdays.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {data.upcomingBirthdays.map((b) => (
                <div
                  key={b._id}
                  className="flex items-center space-x-3 p-3.5 rounded-xl border border-sage-100 hover:border-terracotta-300 hover:bg-cream-50 transition-colors"
                >
                  <div className="w-11 h-11 rounded-full bg-cream-200 border border-cream-300 flex items-center justify-center font-bold text-sage-800 shrink-0 text-sm">
                    {b.fullName.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/admin/residents/${b._id}`}
                      className="text-sm font-semibold text-sage-900 hover:text-terracotta-600 truncate block"
                    >
                      {b.fullName}
                    </Link>
                    <p className="text-xs text-sage-500">
                      Room {b.roomNumber || 'N/A'} • Turning{' '}
                      <span className="font-semibold text-sage-700">{b.turningAge}</span>
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <span
                      className={`inline-block px-2 py-0.5 rounded-full text-[11px] font-bold ${
                        b.daysRemaining === 0
                          ? 'bg-red-100 text-red-700 animate-pulse'
                          : b.daysRemaining <= 7
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-sage-100 text-sage-800'
                      }`}
                    >
                      {b.daysRemaining === 0 ? 'Today! 🎉' : `In ${b.daysRemaining} days`}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 bg-cream-50 rounded-xl border border-dashed border-sage-200">
              <Calendar className="w-8 h-8 text-sage-400 mx-auto mb-2" />
              <p className="text-sm font-medium text-sage-600">
                No resident birthdays in the next 30 days.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Section: Recent Admissions Table */}
      <div className="bg-white rounded-2xl p-6 border border-sage-200 shadow-xs">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-base font-serif font-bold text-sage-900">
              Recent Admissions
            </h3>
            <p className="text-xs text-sage-500">
              Latest elderly residents welcomed into Anand Dham
            </p>
          </div>
          <Link
            href="/admin/residents"
            className="text-xs font-semibold text-terracotta-600 hover:text-terracotta-700 flex items-center space-x-1"
          >
            <span>View All Residents</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-sage-800">
            <thead className="bg-sage-50 text-xs font-semibold text-sage-700 uppercase border-y border-sage-200">
              <tr>
                <th className="py-3 px-4">Resident</th>
                <th className="py-3 px-4">Admission No</th>
                <th className="py-3 px-4">Age / Gender</th>
                <th className="py-3 px-4">Room</th>
                <th className="py-3 px-4">Admitted On</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sage-100">
              {data?.recentAdmissions && data.recentAdmissions.length > 0 ? (
                data.recentAdmissions.map((r) => (
                  <tr key={r._id} className="hover:bg-cream-50/70 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-9 h-9 rounded-full bg-cream-200 border border-cream-300 flex items-center justify-center font-bold text-sage-800 text-xs shrink-0">
                          {r.fullName.slice(0, 2).toUpperCase()}
                        </div>
                        <span className="font-semibold text-sage-900">{r.fullName}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-xs text-sage-600">
                      {r.admissionNumber}
                    </td>
                    <td className="py-3.5 px-4 text-xs">
                      {r.age} yrs • {r.gender}
                    </td>
                    <td className="py-3.5 px-4 text-xs font-medium">
                      {r.roomNumber ? `Room ${r.roomNumber}` : 'Unassigned'}
                    </td>
                    <td className="py-3.5 px-4 text-xs text-sage-600">
                      {new Date(r.admissionDate).toLocaleDateString('en-GB')}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                          r.status === 'Active'
                            ? 'bg-emerald-100 text-emerald-800'
                            : r.status === 'On Leave'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-zinc-100 text-zinc-700'
                        }`}
                      >
                        {r.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Link
                        href={`/admin/residents/${r._id}`}
                        className="text-xs font-medium text-sage-700 hover:text-sage-900 bg-sage-100 hover:bg-sage-200 px-3 py-1.5 rounded-lg transition-colors"
                      >
                        View Profile
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-sm text-sage-500">
                    No resident records found. Click &quot;+ Admit Resident&quot; to add your first senior resident.
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
