'use client';

import React from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Clock, ShieldAlert, RefreshCw, LogOut, HeartHandshake } from 'lucide-react';

export default function PendingApprovalPage() {
  const { data: session } = useSession();
  const router = useRouter();

  const handleRefresh = () => {
    window.location.href = '/admin/dashboard';
  };

  return (
    <div className="min-h-screen bg-cream-100 flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-2xl p-8 shadow-md border border-sage-200 text-center">
        <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4 border border-amber-200">
          <Clock className="w-8 h-8 text-amber-600 animate-spin-slow" />
        </div>

        <h1 className="text-2xl font-serif font-bold text-sage-900 mb-2">
          Account Pending Approval
        </h1>

        <p className="text-sm text-sage-600 mb-6 leading-relaxed">
          Welcome, <span className="font-semibold text-sage-800">{session?.user?.name || 'Caregiver'}</span>! Your Google account (
          <span className="font-medium text-sage-700">{session?.user?.email}</span>) has been safely registered in our directory.
        </p>

        <div className="bg-sage-50 rounded-xl p-4 border border-sage-200 text-left text-xs text-sage-700 mb-6 space-y-2">
          <div className="flex items-start gap-2">
            <ShieldAlert className="w-4 h-4 text-terracotta-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-sage-900">Security Access Policy:</span>
              <p className="mt-0.5">
                To protect our senior residents&apos; personal and medical data, all new Google sign-ups require manual verification and role assignment by the Super Administrator.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <button
            onClick={handleRefresh}
            className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl font-semibold text-sm bg-sage-700 text-white hover:bg-sage-800 shadow-sm transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Check Approval Status</span>
          </button>

          <button
            onClick={() => signOut({ callbackUrl: '/login' })}
            className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl font-medium text-sm bg-sage-100 text-sage-700 hover:bg-sage-200 border border-sage-200 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>

        <div className="mt-8 pt-4 border-t border-sage-100 flex items-center justify-center space-x-2 text-xs text-sage-400">
          <HeartHandshake className="w-4 h-4 text-terracotta-500" />
          <span>OBOKASH - SENIOR LIVING</span>
        </div>
      </div>
    </div>
  );
}
