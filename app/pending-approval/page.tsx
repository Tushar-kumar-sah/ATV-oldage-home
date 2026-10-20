'use client';

import React from 'react';
import Image from 'next/image';
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
    <div className="min-h-screen bg-[#F7F2EA] flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 shadow-warm-lg border border-[#352A25]/15 text-center">
        <div className="h-14 px-3 bg-[#F7F2EA] rounded-2xl border border-[#352A25]/15 flex items-center justify-center mx-auto mb-4 w-fit">
          <Image
            src="/images/obokash-logo.png"
            alt="OBOKASH Logo"
            width={130}
            height={54}
            className="h-8 w-auto object-contain"
            priority
          />
        </div>

        <div className="w-14 h-14 bg-[#A47750]/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-[#A47750]/30">
          <Clock className="w-7 h-7 text-[#A47750] animate-spin-slow" />
        </div>

        <h1 className="text-2xl font-serif font-bold text-[#352A25] mb-2">
          Account Pending Approval
        </h1>

        <p className="text-sm text-[#352A25]/80 mb-6 leading-relaxed">
          Welcome, <span className="font-semibold text-[#352A25]">{session?.user?.name || 'Caregiver'}</span>! Your Google account (
          <span className="font-medium text-[#A47750]">{session?.user?.email}</span>) has been safely registered in our directory.
        </p>

        <div className="bg-[#F7F2EA] rounded-2xl p-4 border border-[#78836A]/30 text-left text-xs text-[#352A25]/80 mb-6 space-y-2">
          <div className="flex items-start gap-2">
            <ShieldAlert className="w-4 h-4 text-[#A47750] shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-[#352A25]">Security Access Policy:</span>
              <p className="mt-0.5">
                To protect our senior residents&apos; personal and medical data, all new Google sign-ups require manual verification and role assignment by the Super Administrator.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <button
            onClick={handleRefresh}
            className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl font-bold text-sm bg-[#352A25] text-[#F7F2EA] hover:bg-[#A47750] shadow-sm transition-colors cursor-pointer"
          >
            <RefreshCw className="w-4 h-4 text-[#F7F2EA]" />
            <span>Check Approval Status</span>
          </button>

          <button
            onClick={() => signOut({ callbackUrl: '/login' })}
            className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl font-medium text-sm bg-[#F7F2EA] text-[#352A25] hover:bg-white border border-[#352A25]/20 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4 text-[#352A25]/60" />
            <span>Sign Out</span>
          </button>
        </div>

        <div className="mt-8 pt-4 border-t border-[#352A25]/10 flex items-center justify-center space-x-2 text-xs text-[#352A25]/60">
          <HeartHandshake className="w-4 h-4 text-[#A47750]" />
          <span>OBOKASH - SENIOR LIVING</span>
        </div>
      </div>
    </div>
  );
}
