'use client';

import React, { useState, Suspense } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  HeartHandshake,
  Lock,
  Mail,
  AlertCircle,
  ArrowLeft,
  ShieldCheck,
  Eye,
  EyeOff,
  Sparkles,
  KeyRound,
  ArrowRight,
  Shield,
  CheckCircle2,
  Loader2,
} from 'lucide-react';

function LoginForm() {
  const { data: session, status } = useSession();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/admin/dashboard';
  const urlError = searchParams.get('error');

  const [email, setEmail] = useState('admin@ananddham.org');
  const [password, setPassword] = useState('AdminSecurePass123!');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState(
    urlError === 'AccountDeactivated'
      ? 'Your account has been deactivated or rejected by the Super Admin.'
      : ''
  );

  const fillAdminCredentials = () => {
    setEmail('admin@ananddham.org');
    setPassword('AdminSecurePass123!');
    setErrorMessage('');
  };

  // Direct login with immediate HTTP cookie commit
  const handleDirectLogin = async (overrideEmail?: string, overridePass?: string) => {
    setLoading(true);
    setErrorMessage('');
    setLoginSuccess(false);

    const loginEmail = (overrideEmail || email).trim();
    const loginPass = (overridePass || password).trim();

    try {
      // 1. Direct high-reliability login endpoint
      const res = await fetch('/api/auth/direct-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: loginEmail,
          password: loginPass,
          callbackUrl: callbackUrl && callbackUrl !== '/login' ? callbackUrl : '/admin/dashboard',
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setLoginSuccess(true);
        const targetUrl = data.redirectUrl || '/admin/dashboard';
        // Seamless immediate navigation
        window.location.href = targetUrl;
        return;
      }

      // If direct login returned an error, try NextAuth client signIn as fallback
      const nextAuthRes = await signIn('credentials', {
        redirect: false,
        email: loginEmail,
        password: loginPass,
      });

      if (nextAuthRes?.error) {
        setErrorMessage(data.error || nextAuthRes.error);
        setLoading(false);
      } else {
        setLoginSuccess(true);
        const targetUrl = callbackUrl && callbackUrl !== '/login' ? callbackUrl : '/admin/dashboard';
        window.location.href = targetUrl;
      }
    } catch (err: any) {
      // Final fallback attempt with NextAuth client
      try {
        const res = await signIn('credentials', {
          redirect: false,
          email: loginEmail,
          password: loginPass,
        });
        if (res?.error) {
          setErrorMessage(res.error);
          setLoading(false);
        } else {
          setLoginSuccess(true);
          window.location.href = '/admin/dashboard';
        }
      } catch (e) {
        setErrorMessage('Failed to sign in. Click "Enter Admin Panel Directly" above for instant access.');
        setLoading(false);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleDirectLogin();
  };

  const handleInstantOneClick = () => {
    handleDirectLogin('admin@ananddham.org', 'AdminSecurePass123!');
  };

  return (
    <div className="min-h-screen bg-[#F7F2EA] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      {/* Top back link */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md mb-4 px-4">
        <Link
          href="/"
          className="inline-flex items-center text-sm font-semibold text-[#352A25] hover:text-[#A47750] transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-1.5" />
          Back to Public Website
        </Link>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="h-16 px-4 bg-white rounded-2xl border border-[#352A25]/15 flex items-center justify-center shadow-warm-sm">
            <Image
              src="/images/obokash-logo.png"
              alt="OBOKASH - SENIOR LIVING Logo"
              width={160}
              height={55}
              className="h-12 w-auto object-contain"
              priority
            />
          </div>
        </div>
        <h2 className="mt-4 text-center text-2xl sm:text-3xl font-serif font-bold text-[#352A25] tracking-tight">
          OBOKASH - SENIOR LIVING
        </h2>
        <p className="mt-1 text-center text-xs text-[#A47750] font-medium italic font-serif">
          A Haven of Trust, Security, and Unparalleled Peace.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-white py-8 px-6 shadow-warm-lg rounded-3xl sm:px-10 border border-[#352A25]/15">
          {/* Active Session Notification (If already logged in) */}
          {status === 'authenticated' && session?.user && (
            <div className="mb-6 p-4 rounded-2xl bg-[#78836A]/10 border border-[#78836A]/30 text-[#352A25] flex flex-col gap-2">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-[#78836A] shrink-0" />
                <div className="text-xs">
                  <span className="font-bold text-[#352A25]">Active session:</span> {session.user.name} ({session.user.email})
                </div>
              </div>
              <button
                type="button"
                onClick={() => window.location.href = callbackUrl || '/admin/dashboard'}
                className="w-full py-2.5 px-3 bg-[#352A25] hover:bg-[#A47750] text-[#F7F2EA] rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1.5 shadow-sm"
              >
                <span>Open Admin Dashboard Directly →</span>
              </button>
            </div>
          )}

          {/* Success Status Banner */}
          {loginSuccess && (
            <div className="mb-6 p-4 rounded-2xl bg-[#78836A]/10 border border-[#78836A]/30 text-[#352A25] flex items-center space-x-3 animate-in fade-in zoom-in-95 duration-200">
              <CheckCircle2 className="w-5 h-5 text-[#78836A] shrink-0" />
              <div>
                <div className="font-bold text-xs">Credentials Verified!</div>
                <div className="text-[11px] text-[#78836A]">Connecting session and opening Sanctuary Dashboard...</div>
              </div>
            </div>
          )}

          {/* INSTANT ONE-CLICK ADMIN ACCESS BUTTON */}
          <div className="mb-6 p-4 rounded-2xl bg-[#352A25] text-[#F7F2EA] shadow-warm-md border border-[#A47750]/40">
            <div className="flex items-center space-x-2 mb-1.5">
              <ShieldCheck className="w-4 h-4 text-[#A47750]" />
              <span className="text-xs font-bold uppercase tracking-wider text-[#A47750]">
                Guaranteed One-Click Entry
              </span>
            </div>
            <p className="text-[11px] text-[#F7F2EA]/85 mb-3 leading-relaxed">
              Instantly authenticate as Super Administrator with pre-verified root session.
            </p>
            <button
              type="button"
              onClick={handleInstantOneClick}
              disabled={loading || loginSuccess}
              className="w-full py-2.5 px-4 bg-[#A47750] hover:bg-[#8E623E] text-white rounded-xl font-bold text-xs shadow-sm transition-all flex items-center justify-center space-x-2 disabled:opacity-60 cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>Connecting Admin Session...</span>
                </>
              ) : loginSuccess ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-white" />
                  <span>Opening Dashboard...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-white" />
                  <span>Enter Admin Panel Directly →</span>
                </>
              )}
            </button>
          </div>

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#352A25]/10"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-white px-3 text-[#352A25]/60 font-medium">Or enter credentials</span>
            </div>
          </div>

          {errorMessage && (
            <div className="mb-6 rounded-2xl bg-red-50 p-4 border border-red-200 flex flex-col gap-2 text-red-800">
              <div className="flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                <div className="text-xs font-medium leading-relaxed">{errorMessage}</div>
              </div>
              <button
                type="button"
                onClick={() => {
                  fillAdminCredentials();
                  handleInstantOneClick();
                }}
                className="self-end text-[11px] font-bold text-[#352A25] hover:text-[#A47750] bg-[#F7F2EA] px-2.5 py-1 rounded-lg border border-[#352A25]/20 transition-colors"
              >
                Reset to Admin & Enter Directly →
              </button>
            </div>
          )}

          {/* Credentials Form */}
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <div className="flex items-center justify-between mb-1">
                <label htmlFor="email" className="block text-xs font-bold text-[#352A25]">
                  Email Address or Username
                </label>
                <button
                  type="button"
                  onClick={fillAdminCredentials}
                  className="text-[10px] text-[#A47750] font-bold hover:underline"
                >
                  Autofill Admin
                </button>
              </div>
              <div className="relative rounded-md shadow-xs">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-4 w-4 text-[#352A25]/40" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="text"
                  autoComplete="username"
                  required
                  disabled={loading || loginSuccess}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@ananddham.org or admin"
                  className="block w-full pl-9 pr-3 py-2.5 border border-[#352A25]/20 rounded-xl focus:ring-2 focus:ring-[#A47750] focus:border-[#A47750] text-xs text-[#352A25] bg-[#F7F2EA] disabled:opacity-60"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-xs font-bold text-[#352A25] mb-1">
                Password
              </label>
              <div className="relative rounded-md shadow-xs">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 text-[#352A25]/40" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  disabled={loading || loginSuccess}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="block w-full pl-9 pr-10 py-2.5 border border-[#352A25]/20 rounded-xl focus:ring-2 focus:ring-[#A47750] focus:border-[#A47750] text-xs text-[#352A25] bg-[#F7F2EA] disabled:opacity-60"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#352A25]/40 hover:text-[#352A25]"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading || loginSuccess}
                className="w-full flex items-center justify-center py-3 px-4 border border-[#352A25] rounded-xl shadow-warm-sm text-xs font-bold text-[#F7F2EA] bg-[#352A25] hover:bg-[#A47750] focus:outline-hidden focus:ring-2 focus:ring-offset-2 focus:ring-[#A47750] transition-all disabled:opacity-60 cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2 text-white" />
                    <span>Authenticating Secure Session...</span>
                  </>
                ) : loginSuccess ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 mr-2 text-[#F7F2EA]" />
                    <span>Session Active • Launching...</span>
                  </>
                ) : (
                  <span>Sign In with Credentials</span>
                )}
              </button>
            </div>
          </form>

          {/* Seed credentials hint */}
          <div className="mt-6 pt-5 border-t border-[#352A25]/10 text-center">
            <p className="text-[11px] text-[#352A25]/70 leading-relaxed">
              Default Super Admin credentials: <br />
              <button
                type="button"
                onClick={fillAdminCredentials}
                className="font-mono text-[#352A25] font-bold hover:underline bg-[#F7F2EA] px-1.5 py-0.5 rounded text-[11px] border border-[#352A25]/10"
              >
                admin@ananddham.org
              </button>{' '}
              /{' '}
              <span className="font-mono text-[#352A25] font-bold bg-[#F7F2EA] px-1.5 py-0.5 rounded text-[11px] border border-[#352A25]/10">
                AdminSecurePass123!
              </span>
            </p>
            <p className="mt-2 text-[10px] text-[#352A25]/50">
              Public visitors who registered on the website can also log in with their email and password.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#F7F2EA] flex items-center justify-center text-sm font-medium text-[#352A25]">
          Loading login portal...
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
