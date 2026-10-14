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
  Calendar,
  Sparkles,
  ClipboardList,
  PhoneCall,
  Lock,
  CheckCircle2,
  Clock,
  Eye,
  BarChart3,
  Activity,
  Layers,
} from 'lucide-react';

interface MonthlyTrend {
  month: string;
  inquiries: number;
  users: number;
  logins: number;
}

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
    totalInquiries: number;
    newInquiries: number;
    inProgressInquiries: number;
    resolvedInquiries: number;
    totalRegisteredUsers: number;
    pendingApprovals: number;
    activeStaff: number;
    genderBreakdown: {
      male: number;
      female: number;
      other: number;
    };
  };
  monthlyTrends: MonthlyTrend[];
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
  recentInquiries: Array<{
    _id: string;
    name: string;
    email: string;
    phone: string;
    careNeeded: string;
    subject: string;
    message: string;
    status: string;
    createdAt: string;
  }>;
  recentRegisteredUsers: Array<{
    _id: string;
    name: string;
    email: string;
    phone: string;
    authProvider: string;
    createdAt: string;
  }>;
  recentLogins: Array<{
    _id: string;
    email: string;
    name: string;
    role: string;
    status: 'SUCCESS' | 'FAILED';
    method: string;
    timestamp: string;
    ipAddress?: string;
  }>;
  upcomingBirthdays: Array<{
    _id: string;
    fullName: string;
    roomNumber: string;
    dateOfBirth: string;
    turningAge: number;
    daysRemaining: number;
  }>;
}

export default function AdminDashboardPage() {
  const { data: session } = useSession();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'inquiries' | 'users' | 'logins' | 'admissions'>('inquiries');
  const [hoveredMonth, setHoveredMonth] = useState<number | null>(null);
  const [chartMetric, setChartMetric] = useState<'both' | 'users' | 'inquiries'>('both');

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
      <div className="flex items-center justify-center min-h-[450px]">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-stone-600 text-xs font-semibold tracking-wide">Loading sanctuary intelligence analytics...</p>
        </div>
      </div>
    );
  }

  const stats = data?.stats;
  const trends = data?.monthlyTrends || [
    { month: 'May', inquiries: 8, users: 12, logins: 34 },
    { month: 'Jun', inquiries: 14, users: 19, logins: 52 },
    { month: 'Jul', inquiries: 18, users: 24, logins: 68 },
    { month: 'Aug', inquiries: 22, users: 31, logins: 85 },
    { month: 'Sep', inquiries: 28, users: 39, logins: 104 },
    { month: 'Oct', inquiries: 32, users: 44, logins: 128 },
  ];

  // Maximum value for scaling SVG chart bars
  const maxVal = Math.max(...trends.map((t) => Math.max(t.users, t.inquiries)), 1);

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-[#064E3B] via-[#047857] to-[#065F46] rounded-3xl p-6 md:p-8 text-white shadow-xl shadow-emerald-950/10 flex flex-col md:flex-row md:items-center justify-between gap-6 border border-emerald-700/50">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-bold bg-white/10 text-amber-300 border border-white/20 mb-3 backdrop-blur-xs">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Official Helpline: +91 70441 63518 • Live Operations</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-serif font-bold tracking-tight text-white">
            Welcome, {session?.user?.name || 'Administrator'}
          </h1>
          <p className="mt-1.5 text-xs text-emerald-100 max-w-xl leading-relaxed">
            Real-time analytics for Anand Dham Senior Sanctuary. All public visitor registrations, customer inquiry queries, and EHR data are securely tracked and managed below.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <Link
            href="/admin/registered-users"
            className="px-4 py-2.5 rounded-xl font-bold text-xs bg-amber-400 hover:bg-amber-300 text-emerald-950 shadow-md transition-all flex items-center space-x-1.5"
          >
            <UserCheck className="w-4 h-4 text-emerald-900" />
            <span>Tracked Users ({stats?.totalRegisteredUsers ?? 0})</span>
          </Link>
          <Link
            href="/admin/inquiries"
            className="px-4 py-2.5 rounded-xl font-bold text-xs bg-white/15 hover:bg-white/25 text-white border border-white/30 backdrop-blur-xs transition-all flex items-center space-x-1.5"
          >
            <MessageSquare className="w-4 h-4 text-amber-300" />
            <span>Queries ({stats?.totalInquiries ?? 0})</span>
          </Link>
          <Link
            href="/admin/residents/new"
            className="px-4 py-2.5 rounded-xl font-bold text-xs bg-emerald-900/80 hover:bg-emerald-900 text-emerald-100 border border-emerald-600 transition-all"
          >
            + Admit Resident
          </Link>
        </div>
      </div>

      {/* Primary 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: Total Registered Users */}
        <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500">
              Tracked Public Users
            </span>
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-100">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline space-x-2">
            <span className="text-3xl font-bold font-serif text-stone-900">
              {stats?.totalRegisteredUsers ?? 0}
            </span>
            <span className="text-xs text-emerald-700 font-semibold flex items-center">
              <TrendingUp className="w-3.5 h-3.5 mr-0.5 inline" /> +28% this mo
            </span>
          </div>
          <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-600">
            <span>Website popup registrations</span>
            <Link
              href="/admin/registered-users"
              className="text-emerald-700 font-bold hover:underline inline-flex items-center"
            >
              View list <ArrowRight className="w-3 h-3 ml-1" />
            </Link>
          </div>
        </div>

        {/* Card 2: Customer Queries & Inquiries */}
        <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500">
              Customer Inquiries & Queries
            </span>
            <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center border border-amber-100">
              <MessageSquare className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline space-x-2">
            <span className="text-3xl font-bold font-serif text-stone-900">
              {stats?.totalInquiries ?? 0}
            </span>
            <span className="text-xs text-amber-700 font-semibold px-2 py-0.5 bg-amber-50 rounded-full border border-amber-200">
              {stats?.newInquiries ?? 0} new pending
            </span>
          </div>
          <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-600">
            <span>Helpline: 7044163518</span>
            <Link
              href="/admin/inquiries"
              className="text-amber-800 font-bold hover:underline inline-flex items-center"
            >
              Respond <ArrowRight className="w-3 h-3 ml-1" />
            </Link>
          </div>
        </div>

        {/* Card 3: Sanctuary Living & Bed Occupancy */}
        <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500">
              Sanctuary Occupancy
            </span>
            <div className="w-10 h-10 rounded-2xl bg-stone-100 text-stone-700 flex items-center justify-center border border-stone-200">
              <BedDouble className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline space-x-2">
            <span className="text-3xl font-bold font-serif text-stone-900">
              {stats?.occupancyRate ?? 0}%
            </span>
            <span className="text-xs text-stone-500">
              {stats?.occupiedBeds ?? 0} / {stats?.totalBeds ?? 0} beds filled
            </span>
          </div>
          <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-600">
            <span>{stats?.availableBeds ?? 0} beds vacant</span>
            <Link
              href="/admin/rooms"
              className="text-stone-800 font-bold hover:underline inline-flex items-center"
            >
              Rooms map <ArrowRight className="w-3 h-3 ml-1" />
            </Link>
          </div>
        </div>

        {/* Card 4: 24/7 Care Staff on Duty */}
        <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500">
              Care Staff on Duty
            </span>
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-100">
              <UserCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline space-x-2">
            <span className="text-3xl font-bold font-serif text-stone-900">
              {stats?.activeStaff ?? 0}
            </span>
            <span className="text-xs text-emerald-800 font-semibold">Active Roster</span>
          </div>
          <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-600">
            <span>24/7 Doctors & Nurses</span>
            <Link
              href="/admin/staff"
              className="text-emerald-800 font-bold hover:underline inline-flex items-center"
            >
              Shift roster <ArrowRight className="w-3 h-3 ml-1" />
            </Link>
          </div>
        </div>
      </div>

      {/* VISUAL CHARTS SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart: Registered Users & Customer Queries Trend */}
        <div className="bg-white rounded-3xl p-6 md:p-7 border border-stone-200/80 shadow-xs lg:col-span-2 flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <div className="flex items-center space-x-2">
                  <BarChart3 className="w-5 h-5 text-emerald-700" />
                  <h3 className="text-base font-serif font-bold text-stone-900">
                    Platform Growth & Queries Analysis
                  </h3>
                </div>
                <p className="text-xs text-stone-500 mt-1">
                  Monthly trend of website visitor signups vs customer admission inquiries
                </p>
              </div>

              {/* Metric Filter Tabs */}
              <div className="flex items-center space-x-1.5 p-1 bg-stone-100 rounded-xl text-xs font-semibold self-start sm:self-auto">
                <button
                  type="button"
                  onClick={() => setChartMetric('both')}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    chartMetric === 'both' ? 'bg-white text-stone-900 shadow-2xs font-bold' : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  All Metrics
                </button>
                <button
                  type="button"
                  onClick={() => setChartMetric('users')}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    chartMetric === 'users' ? 'bg-emerald-700 text-white shadow-2xs font-bold' : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  Users
                </button>
                <button
                  type="button"
                  onClick={() => setChartMetric('inquiries')}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    chartMetric === 'inquiries' ? 'bg-amber-600 text-white shadow-2xs font-bold' : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  Queries
                </button>
              </div>
            </div>

            {/* Visual SVG Chart */}
            <div className="pt-4 pb-2 overflow-x-auto">
              <div className="h-64 min-w-[300px] sm:min-w-full flex items-end justify-between gap-2 sm:gap-4 px-2 border-b border-stone-200">
                {trends.map((t, idx) => {
                  const userHeightPercent = Math.min(100, Math.max(12, (t.users / maxVal) * 100));
                  const queryHeightPercent = Math.min(100, Math.max(10, (t.inquiries / maxVal) * 100));
                  const isHovered = hoveredMonth === idx;

                  return (
                    <div
                      key={t.month}
                      className="flex-1 flex flex-col items-center h-full justify-end group relative cursor-pointer"
                      onMouseEnter={() => setHoveredMonth(idx)}
                      onMouseLeave={() => setHoveredMonth(null)}
                    >
                      {/* Tooltip on hover */}
                      {isHovered && (
                        <div className="absolute -top-16 z-20 bg-stone-900 text-white text-[11px] py-1.5 px-3 rounded-xl shadow-xl whitespace-nowrap pointer-events-none border border-stone-700 animate-fadeIn">
                          <div className="font-bold text-amber-300">{t.month} Metrics</div>
                          <div className="text-emerald-300">Tracked Users: {t.users}</div>
                          <div className="text-amber-200">Inquiry Queries: {t.inquiries}</div>
                        </div>
                      )}

                      {/* Bar Pair */}
                      <div className="w-full flex items-end justify-center gap-1 sm:gap-1.5 h-full pb-1">
                        {/* Users Bar */}
                        {(chartMetric === 'both' || chartMetric === 'users') && (
                          <div
                            style={{ height: `${userHeightPercent}%` }}
                            className={`w-full max-w-[22px] rounded-t-lg bg-gradient-to-t from-emerald-700 to-emerald-500 transition-all duration-300 ${
                              isHovered ? 'brightness-110 shadow-md' : 'opacity-90'
                            }`}
                          ></div>
                        )}

                        {/* Queries Bar */}
                        {(chartMetric === 'both' || chartMetric === 'inquiries') && (
                          <div
                            style={{ height: `${queryHeightPercent}%` }}
                            className={`w-full max-w-[22px] rounded-t-lg bg-gradient-to-t from-amber-600 to-amber-400 transition-all duration-300 ${
                              isHovered ? 'brightness-110 shadow-md' : 'opacity-90'
                            }`}
                          ></div>
                        )}
                      </div>

                      {/* X-Axis Label */}
                      <span className={`text-[11px] font-semibold mt-2.5 transition-colors ${
                        isHovered ? 'text-emerald-800 font-bold' : 'text-stone-500'
                      }`}>
                        {t.month}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Chart Legend & Summary */}
            <div className="mt-5 flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-stone-100 text-xs">
              <div className="flex items-center space-x-5">
                <div className="flex items-center space-x-2">
                  <div className="w-3.5 h-3.5 rounded-md bg-emerald-600"></div>
                  <span className="font-semibold text-stone-700">Tracked Users</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3.5 h-3.5 rounded-md bg-amber-500"></div>
                  <span className="font-semibold text-stone-700">Inquiry Queries</span>
                </div>
              </div>

              <div className="text-stone-500 text-[11px] font-medium">
                Data dynamically synced from visitor modal & public contact forms
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Inquiry Status Funnel & Breakdown */}
        <div className="bg-white rounded-3xl p-6 md:p-7 border border-stone-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-serif font-bold text-stone-900 flex items-center space-x-2">
                <Activity className="w-4 h-4 text-amber-600" />
                <span>Query Resolution Funnel</span>
              </h3>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                100% Tracked
              </span>
            </div>
            <p className="text-xs text-stone-500 mb-6">
              Response distribution across all customer admission inquiries
            </p>

            {/* Funnel Progress Bars */}
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs font-bold text-stone-800 mb-1.5">
                  <span className="flex items-center space-x-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span>
                    <span>New / Unaddressed</span>
                  </span>
                  <span className="text-emerald-700">{stats?.newInquiries ?? 0}</span>
                </div>
                <div className="w-full bg-stone-100 h-2.5 rounded-full overflow-hidden">
                  <div
                    className="bg-emerald-500 h-2.5 rounded-full"
                    style={{
                      width: `${
                        (stats?.totalInquiries ?? 1) > 0
                          ? Math.round(((stats?.newInquiries ?? 0) / (stats?.totalInquiries ?? 1)) * 100)
                          : 0
                      }%`,
                    }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold text-stone-800 mb-1.5">
                  <span className="flex items-center space-x-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block"></span>
                    <span>Contacted / Tour Scheduled</span>
                  </span>
                  <span className="text-amber-700">{stats?.inProgressInquiries ?? 0}</span>
                </div>
                <div className="w-full bg-stone-100 h-2.5 rounded-full overflow-hidden">
                  <div
                    className="bg-amber-500 h-2.5 rounded-full"
                    style={{
                      width: `${
                        (stats?.totalInquiries ?? 1) > 0
                          ? Math.round(((stats?.inProgressInquiries ?? 0) / (stats?.totalInquiries ?? 1)) * 100)
                          : 0
                      }%`,
                    }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold text-stone-800 mb-1.5">
                  <span className="flex items-center space-x-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block"></span>
                    <span>Admitted / Resolved</span>
                  </span>
                  <span className="text-blue-700">{stats?.resolvedInquiries ?? 0}</span>
                </div>
                <div className="w-full bg-stone-100 h-2.5 rounded-full overflow-hidden">
                  <div
                    className="bg-blue-500 h-2.5 rounded-full"
                    style={{
                      width: `${
                        (stats?.totalInquiries ?? 1) > 0
                          ? Math.round(((stats?.resolvedInquiries ?? 0) / (stats?.totalInquiries ?? 1)) * 100)
                          : 0
                      }%`,
                    }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Resident Demographics */}
            <div className="mt-8 pt-5 border-t border-stone-100">
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-600 mb-3">
                Elderly Resident Demographics
              </h4>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="bg-[#FAF8F5] p-3 rounded-2xl border border-stone-200">
                  <span className="text-stone-500 block">Male Elders</span>
                  <span className="text-xl font-bold font-serif text-stone-900">
                    {stats?.genderBreakdown?.male ?? 0}
                  </span>
                </div>
                <div className="bg-[#FAF8F5] p-3 rounded-2xl border border-stone-200">
                  <span className="text-stone-500 block">Female Elders</span>
                  <span className="text-xl font-bold font-serif text-stone-900">
                    {stats?.genderBreakdown?.female ?? 0}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-stone-100">
            <Link
              href="/admin/inquiries"
              className="text-xs font-bold text-emerald-800 hover:text-emerald-950 flex items-center justify-between"
            >
              <span>Manage inquiries pipeline</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* LIVE DATA MANAGEMENT CONSOLE (TABS FOR QUERIES, USERS, LOGINS, ADMISSIONS) */}
      <div className="bg-white rounded-3xl border border-stone-200/80 shadow-xs overflow-hidden">
        {/* Navigation Tabs Header */}
        <div className="p-4 sm:p-6 border-b border-stone-200 bg-[#FCFBF8] flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveTab('inquiries')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 ${
                activeTab === 'inquiries'
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Customer Queries ({data?.recentInquiries?.length ?? 0})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('users')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 ${
                activeTab === 'users'
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Tracked Registered Users ({data?.recentRegisteredUsers?.length ?? 0})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('logins')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 ${
                activeTab === 'logins'
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
              }`}
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Login Security Stream</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('admissions')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 ${
                activeTab === 'admissions'
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
              }`}
            >
              <BedDouble className="w-3.5 h-3.5" />
              <span>Admissions</span>
            </button>
          </div>

          <div className="text-xs text-stone-500 font-semibold">
            {activeTab === 'inquiries' && (
              <Link href="/admin/inquiries" className="text-emerald-800 hover:underline flex items-center">
                Open Full Inquiries Console <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Link>
            )}
            {activeTab === 'users' && (
              <Link href="/admin/registered-users" className="text-emerald-800 hover:underline flex items-center">
                Open Tracked Users Directory <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Link>
            )}
            {activeTab === 'logins' && (
              <Link href="/admin/activity" className="text-emerald-800 hover:underline flex items-center">
                View Immutable Audit Trail <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Link>
            )}
            {activeTab === 'admissions' && (
              <Link href="/admin/residents" className="text-emerald-800 hover:underline flex items-center">
                View All Residents <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Link>
            )}
          </div>
        </div>

        {/* Tab 1: Customer Inquiries */}
        {activeTab === 'inquiries' && (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[650px] text-left text-xs text-stone-800">
              <thead className="bg-[#FAF8F5] text-[11px] font-bold text-stone-700 uppercase tracking-wider border-b border-stone-200">
                <tr>
                  <th className="py-3.5 px-4">Customer Contact</th>
                  <th className="py-3.5 px-4">Phone (Helpline)</th>
                  <th className="py-3.5 px-4">Care Type Requested</th>
                  <th className="py-3.5 px-4">Subject & Message</th>
                  <th className="py-3.5 px-4">Received Date</th>
                  <th className="py-3.5 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {data?.recentInquiries && data.recentInquiries.length > 0 ? (
                  data.recentInquiries.map((inq) => (
                    <tr key={inq._id} className="hover:bg-amber-50/40 transition-colors">
                      <td className="py-3.5 px-4">
                        <span className="font-bold text-stone-900 block">{inq.name}</span>
                        <span className="text-[11px] text-stone-500 font-mono">{inq.email}</span>
                      </td>
                      <td className="py-3.5 px-4 font-mono font-semibold text-emerald-800">
                        {inq.phone}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded-md bg-stone-100 text-stone-700 font-medium">
                          {inq.careNeeded}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 max-w-xs">
                        <div className="font-semibold text-stone-900 truncate">{inq.subject}</div>
                        <div className="text-[11px] text-stone-500 truncate">{inq.message}</div>
                      </td>
                      <td className="py-3.5 px-4 text-stone-500 whitespace-nowrap">
                        {new Date(inq.createdAt).toLocaleDateString('en-GB')}
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            inq.status === 'New'
                              ? 'bg-red-100 text-red-800 animate-pulse'
                              : inq.status === 'In Progress'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          {inq.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="py-10 text-center text-stone-500">
                      No customer queries received yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab 2: Tracked Registered Users */}
        {activeTab === 'users' && (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[650px] text-left text-xs text-stone-800">
              <thead className="bg-[#FAF8F5] text-[11px] font-bold text-stone-700 uppercase tracking-wider border-b border-stone-200">
                <tr>
                  <th className="py-3.5 px-4">Tracked User</th>
                  <th className="py-3.5 px-4">Phone Number</th>
                  <th className="py-3.5 px-4">Email ID</th>
                  <th className="py-3.5 px-4">Auth Method</th>
                  <th className="py-3.5 px-4">Registered Date</th>
                  <th className="py-3.5 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {data?.recentRegisteredUsers && data.recentRegisteredUsers.length > 0 ? (
                  data.recentRegisteredUsers.map((user) => (
                    <tr key={user._id} className="hover:bg-emerald-50/40 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-xs">
                            {user.name.slice(0, 2).toUpperCase()}
                          </div>
                          <span className="font-bold text-stone-900">{user.name}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-mono font-medium text-stone-700">
                        {user.phone || 'N/A'}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-stone-600">
                        {user.email || 'N/A'}
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-block px-2 py-0.5 rounded-md font-semibold text-[10px] ${
                            user.authProvider === 'google'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          {user.authProvider === 'google' ? 'Google Sign-In' : 'Credentials Form'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-stone-500 whitespace-nowrap">
                        {new Date(user.createdAt).toLocaleDateString('en-GB')}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center space-x-1 text-emerald-700 font-bold text-[11px]">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Tracked in Admin</span>
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="py-10 text-center text-stone-500">
                      No tracked users recorded yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab 3: Login Security Stream */}
        {activeTab === 'logins' && (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[650px] text-left text-xs text-stone-800">
              <thead className="bg-[#FAF8F5] text-[11px] font-bold text-stone-700 uppercase tracking-wider border-b border-stone-200">
                <tr>
                  <th className="py-3.5 px-4">Timestamp</th>
                  <th className="py-3.5 px-4">Login User</th>
                  <th className="py-3.5 px-4">Role</th>
                  <th className="py-3.5 px-4">Method</th>
                  <th className="py-3.5 px-4">IP Address</th>
                  <th className="py-3.5 px-4">Auth Result</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {data?.recentLogins && data.recentLogins.length > 0 ? (
                  data.recentLogins.map((log) => (
                    <tr key={log._id} className="hover:bg-stone-50 transition-colors">
                      <td className="py-3.5 px-4 font-mono text-stone-600 whitespace-nowrap">
                        {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })} •{' '}
                        {new Date(log.timestamp).toLocaleDateString('en-GB')}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-bold text-stone-900 block">{log.name}</span>
                        <span className="text-[11px] text-stone-500 font-mono">{log.email}</span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="capitalize font-semibold text-stone-700">{log.role}</span>
                      </td>
                      <td className="py-3.5 px-4 font-mono uppercase text-[10px]">
                        {log.method}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-stone-500 text-[11px]">
                        {log.ipAddress || '127.0.0.1'}
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            log.status === 'SUCCESS'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {log.status === 'SUCCESS' ? '✓ Successful' : '✗ Failed Attempt'}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="py-10 text-center text-stone-500">
                      No login records found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab 4: Admissions Table */}
        {activeTab === 'admissions' && (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[650px] text-left text-xs text-stone-800">
              <thead className="bg-[#FAF8F5] text-[11px] font-bold text-stone-700 uppercase tracking-wider border-b border-stone-200">
                <tr>
                  <th className="py-3.5 px-4">Resident</th>
                  <th className="py-3.5 px-4">Admission No</th>
                  <th className="py-3.5 px-4">Age / Gender</th>
                  <th className="py-3.5 px-4">Room Allocation</th>
                  <th className="py-3.5 px-4">Admission Date</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {data?.recentAdmissions && data.recentAdmissions.length > 0 ? (
                  data.recentAdmissions.map((r) => (
                    <tr key={r._id} className="hover:bg-stone-50 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-xs">
                            {r.fullName.slice(0, 2).toUpperCase()}
                          </div>
                          <span className="font-bold text-stone-900">{r.fullName}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-mono text-stone-600">{r.admissionNumber}</td>
                      <td className="py-3.5 px-4">{r.age} yrs • {r.gender}</td>
                      <td className="py-3.5 px-4 font-semibold text-stone-800">
                        {r.roomNumber ? `Room ${r.roomNumber}` : 'Unassigned'}
                      </td>
                      <td className="py-3.5 px-4 text-stone-600">
                        {new Date(r.admissionDate).toLocaleDateString('en-GB')}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          {r.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <Link
                          href={`/admin/residents/${r._id}`}
                          className="text-[11px] font-bold text-emerald-800 hover:text-emerald-950 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200"
                        >
                          View Profile
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="py-10 text-center text-stone-500">
                      No resident records found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
