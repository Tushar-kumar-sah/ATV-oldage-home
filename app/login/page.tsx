'use client';

import React, { useState, Suspense } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
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
    <div className="min-h-screen bg-[#FAF7F0] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      {/* Top back link */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md mb-4 px-4">
        <Link
          href="/"
          className="inline-flex items-center text-sm font-semibold text-[#064E3B] hover:text-emerald-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-1.5" />
          Back to Public Website
        </Link>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#064E3B] to-[#047857] flex items-center justify-center text-white shadow-lg shadow-emerald-950/20">
            <HeartHandshake className="w-8 h-8 text-amber-300" />
          </div>
        </div>
        <h2 className="mt-4 text-center text-3xl font-serif font-bold text-[#064E3B] tracking-tight">
          Staff & Admin Portal
        </h2>
        <p className="mt-2 text-center text-xs text-stone-600">
          Anand Dham Senior Sanctuary Management & EHR System
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-white py-8 px-6 shadow-xl shadow-emerald-950/5 rounded-3xl sm:px-10 border border-stone-200">
          {/* Active Session Notification (If already logged in) */}
          {status === 'authenticated' && session?.user && (
            <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-stone-900 flex flex-col gap-2">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                <div className="text-xs">
                  <span className="font-bold text-emerald-900">Active session:</span> {session.user.name} ({session.user.email})
                </div>
              </div>
              <button
                type="button"
                onClick={() => window.location.href = callbackUrl || '/admin/dashboard'}
                className="w-full py-2.5 px-3 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1.5 shadow-sm"
              >
                <span>Open Admin Dashboard Directly →</span>
              </button>
            </div>
          )}

          {/* Success Status Banner */}
          {loginSuccess && (
            <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 flex items-center space-x-3 animate-in fade-in zoom-in-95 duration-200">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <div>
                <div className="font-bold text-xs">Credentials Verified!</div>
                <div className="text-[11px] text-emerald-700">Connecting session and opening Sanctuary Dashboard...</div>
              </div>
            </div>
          )}

          {/* INSTANT ONE-CLICK ADMIN ACCESS BUTTON */}
          <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-emerald-800 to-emerald-950 text-white shadow-md border border-emerald-700/60">
            <div className="flex items-center space-x-2 mb-1.5">
              <ShieldCheck className="w-4 h-4 text-amber-300" />
              <span className="text-xs font-bold uppercase tracking-wider text-amber-200">
                Guaranteed One-Click Entry
              </span>
            </div>
            <p className="text-[11px] text-emerald-100 mb-3 leading-relaxed">
              Instantly authenticate as Super Administrator with pre-verified root session.
            </p>
            <button
              type="button"
              onClick={handleInstantOneClick}
              disabled={loading || loginSuccess}
              className="w-full py-2.5 px-4 bg-amber-400 hover:bg-amber-300 text-emerald-950 rounded-xl font-bold text-xs shadow-sm transition-all flex items-center justify-center space-x-2 disabled:opacity-60 cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-emerald-950" />
                  <span>Connecting Admin Session...</span>
                </>
              ) : loginSuccess ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-950" />
                  <span>Opening Dashboard...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-emerald-900" />
                  <span>Enter Admin Panel Directly →</span>
                </>
              )}
            </button>
          </div>

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-stone-200"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-white px-3 text-stone-400 font-medium">Or enter credentials</span>
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
                className="self-end text-[11px] font-bold text-emerald-800 hover:text-emerald-950 bg-emerald-100/80 px-2.5 py-1 rounded-lg border border-emerald-300 transition-colors"
              >
                Reset to Admin & Enter Directly →
              </button>
            </div>
          )}

          {/* Credentials Form */}
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <div className="flex items-center justify-between mb-1">
                <label htmlFor="email" className="block text-xs font-bold text-stone-800">
                  Email Address or Username
                </label>
                <button
                  type="button"
                  onClick={fillAdminCredentials}
                  className="text-[10px] text-emerald-700 font-bold hover:underline"
                >
                  Autofill Admin
                </button>
              </div>
              <div className="relative rounded-md shadow-xs">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-4 w-4 text-stone-400" />
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
                  className="block w-full pl-9 pr-3 py-2.5 border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-xs text-stone-900 bg-[#FAF8F5] disabled:opacity-60"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-xs font-bold text-stone-800 mb-1">
                Password
              </label>
              <div className="relative rounded-md shadow-xs">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 text-stone-400" />
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
                  className="block w-full pl-9 pr-10 py-2.5 border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-xs text-stone-900 bg-[#FAF8F5] disabled:opacity-60"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-stone-400 hover:text-stone-600"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading || loginSuccess}
                className="w-full flex items-center justify-center py-3 px-4 border border-transparent rounded-xl shadow-md text-xs font-bold text-white bg-gradient-to-r from-[#064E3B] to-[#047857] hover:from-[#052E16] hover:to-[#064E3B] focus:outline-hidden focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all disabled:opacity-60 cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2 text-white" />
                    <span>Authenticating Secure Session...</span>
                  </>
                ) : loginSuccess ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 mr-2 text-amber-300" />
                    <span>Session Active • Launching...</span>
                  </>
                ) : (
                  <span>Sign In with Credentials</span>
                )}
              </button>
            </div>
          </form>

          {/* Seed credentials hint */}
          <div className="mt-6 pt-5 border-t border-stone-100 text-center">
            <p className="text-[11px] text-stone-500 leading-relaxed">
              Default Super Admin credentials: <br />
              <button
                type="button"
                onClick={fillAdminCredentials}
                className="font-mono text-emerald-800 font-bold hover:underline bg-emerald-50 px-1.5 py-0.5 rounded text-[11px]"
              >
                admin@ananddham.org
              </button>{' '}
              /{' '}
              <span className="font-mono text-emerald-800 font-bold bg-emerald-50 px-1.5 py-0.5 rounded text-[11px]">
                AdminSecurePass123!
              </span>
            </p>
            <p className="mt-2 text-[10px] text-stone-400">
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
        <div className="min-h-screen bg-[#FAF7F0] flex items-center justify-center text-sm font-medium text-emerald-800">
          Loading login portal...
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
