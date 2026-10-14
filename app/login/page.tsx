'use client';

import React, { useState, Suspense } from 'react';
import { signIn } from 'next-auth/react';
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
} from 'lucide-react';

function LoginForm() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/admin/dashboard';
  const urlError = searchParams.get('error');

  const [email, setEmail] = useState('admin@ananddham.org');
  const [password, setPassword] = useState('AdminSecurePass123!');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setLoading(true);

    try {
      const trimmedEmail = email.trim();
      const trimmedPassword = password.trim();

      const res = await signIn('credentials', {
        redirect: false,
        email: trimmedEmail,
        password: trimmedPassword,
      });

      if (res?.error) {
        setErrorMessage(res.error);
        setLoading(false);
      } else {
        const targetUrl =
          callbackUrl && callbackUrl !== '/login' ? callbackUrl : '/admin/dashboard';
        window.location.href = targetUrl;
      }
    } catch (err: any) {
      setErrorMessage('An unexpected error occurred. Please try again.');
      setLoading(false);
    }
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
          {/* Quick 1-click admin demo autofill button */}
          <div className="mb-6 p-3 rounded-2xl bg-emerald-50/80 border border-emerald-200/60 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <KeyRound className="w-4 h-4 text-emerald-700" />
              <span className="text-xs font-semibold text-emerald-950">Super Admin Access</span>
            </div>
            <button
              type="button"
              onClick={fillAdminCredentials}
              className="text-[11px] font-bold text-emerald-800 bg-white hover:bg-emerald-100 px-2.5 py-1 rounded-lg border border-emerald-300 transition-all flex items-center space-x-1 shadow-2xs"
            >
              <Sparkles className="w-3 h-3 text-amber-500" />
              <span>Fill Admin Credentials</span>
            </button>
          </div>

          {errorMessage && (
            <div className="mb-6 rounded-2xl bg-red-50 p-4 border border-red-200 flex items-start space-x-3 text-red-800">
              <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
              <div className="text-xs font-medium leading-relaxed">{errorMessage}</div>
            </div>
          )}

          {/* Credentials Form */}
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-xs font-bold text-stone-800">
                Email Address or Username
              </label>
              <div className="mt-1.5 relative rounded-md shadow-xs">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-4 w-4 text-stone-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="text"
                  autoComplete="username"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@ananddham.org or admin"
                  className="block w-full pl-9 pr-3 py-2.5 border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-xs text-stone-900 bg-[#FAF8F5]"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-xs font-bold text-stone-800">
                Password
              </label>
              <div className="mt-1.5 relative rounded-md shadow-xs">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 text-stone-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="block w-full pl-9 pr-10 py-2.5 border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-xs text-stone-900 bg-[#FAF8F5]"
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
                disabled={loading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-md text-xs font-bold text-white bg-gradient-to-r from-[#064E3B] to-[#047857] hover:from-[#052E16] hover:to-[#064E3B] focus:outline-hidden focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all disabled:opacity-50"
              >
                {loading ? 'Authenticating Secure Session...' : 'Sign In to Admin Dashboard'}
              </button>
            </div>
          </form>

          {/* Seed credentials hint */}
          <div className="mt-6 pt-5 border-t border-stone-100 text-center">
            <p className="text-[11px] text-stone-500 leading-relaxed">
              Super Admin credentials:{' '}
              <button
                type="button"
                onClick={fillAdminCredentials}
                className="font-mono text-emerald-800 font-bold hover:underline bg-emerald-50 px-1 py-0.5 rounded"
              >
                admin@ananddham.org
              </button>{' '}
              /{' '}
              <span className="font-mono text-emerald-800 font-bold bg-emerald-50 px-1 py-0.5 rounded">
                AdminSecurePass123!
              </span>
            </p>
            <p className="mt-2 text-[10px] text-stone-400">
              Visitors registered from public website can also sign in with their registered email/phone.
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
