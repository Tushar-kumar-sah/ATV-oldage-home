'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import ScanExperience from '@/components/ScanExperience';
import { getSupabaseBrowserClient } from '@/lib/supabase';
import {
  HeartHandshake,
  ShieldCheck,
  PhoneCall,
  Clock,
  MapPin,
  Heart,
  Activity,
  BedDouble,
  Sparkles,
  Utensils,
  Sun,
  Smile,
  Send,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Shield,
  Award,
  Users,
  Star,
  Check,
  Phone,
  Calendar,
  Stethoscope,
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
  X,
  Menu,
  Lock,
  Mail,
  User,
  LogOut,
} from 'lucide-react';

const heroSlides = [
  {
    src: '/images/hero-senior-living.jpg',
    tag: 'Warmth & Reverence',
    title: '"A place where our grandparents feel celebrated, not secluded."',
    subtitle: 'Sunlit courtyards & compassionate round-the-clock companionship',
    alt: 'Happy elderly Indian couple relaxing in sunlit lounge with friendly caregiver nurse',
  },
  {
    src: '/images/about-garden-walk.jpg',
    tag: 'Botanical Garden Trails',
    title: '"Morning garden walks filled with fresh air and gentle support."',
    subtitle: 'Safe, anti-skid paved walking paths amidst blooming greenery',
    alt: 'Elderly Indian grandmother walking happily in lush botanical garden supported by a smiling nurse',
  },
  {
    src: '/images/senior-physio-wellness.jpg',
    tag: 'Gentle Physio & Yoga',
    title: '"Restoring mobility, balance, and joy through daily wellness."',
    subtitle: 'Dedicated geriatric physiotherapists & light restorative chair yoga',
    alt: 'Smiling elderly Indian senior practicing chair wellness exercises with caring physiotherapist',
  },
  {
    src: '/images/senior-room-suite.jpg',
    tag: 'Deluxe Living Suites',
    title: '"Dignified private spaces designed with orthopedic comfort & safety."',
    subtitle: 'Motorized medical beds, emergency response buttons & AC',
    alt: 'Luxury private elder bedroom suite with orthopedic bed, armchair, and emergency button',
  },
  {
    src: '/images/senior-dining-hall.jpg',
    tag: 'Wholesome Satvik Dining',
    title: '"Nutritious, doctor-customized vegetarian meals shared with friends."',
    subtitle: 'Hygiene-certified pure satvik kitchen & dietary care',
    alt: 'Cheerful seniors enjoying freshly prepared satvik vegetarian meals in dining hall',
  },
];

export default function LandingPage() {
  // Scan intro is presented in the starting before entering the main website
  const [showScanIntro, setShowScanIntro] = useState<boolean>(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Timed Visitor Login / Register modal (after 6-8 seconds)
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authAction, setAuthAction] = useState<'register' | 'login'>('register');
  const [authMethod, setAuthMethod] = useState<'email' | 'phone'>('email');
  const [authFormData, setAuthFormData] = useState({
    name: '',
    phone: '',
    email: '',
    password: '',
  });
  const [authLoading, setAuthLoading] = useState(false);
  const [authSuccessMsg, setAuthSuccessMsg] = useState('');
  const [authErrorMsg, setAuthErrorMsg] = useState('');
  const [googlePromptOpen, setGooglePromptOpen] = useState(false);
  const [googleAccount, setGoogleAccount] = useState({
    name: '',
    email: '',
  });

  // Current logged in visitor state
  const [currentUser, setCurrentUser] = useState<{
    name: string;
    email: string;
    provider: string;
  } | null>(null);

  // Restore visitor session from localStorage on mount
  React.useEffect(() => {
    try {
      const stored = localStorage.getItem('obokash_user');
      if (stored) {
        setCurrentUser(JSON.parse(stored));
      }
    } catch {}
  }, []);

  // Timed Cookie Consent Banner (after 10 seconds)
  const [showCookieBanner, setShowCookieBanner] = useState(false);

  // Trigger Visitor Auth Modal after 7 seconds
  React.useEffect(() => {
    const isRegistered = localStorage.getItem('obokash_user_registered');
    if (!isRegistered) {
      const timer = setTimeout(() => {
        setShowAuthModal(true);
      }, 7000);
      return () => clearTimeout(timer);
    }
  }, []);

  // Trigger Cookie Consent Banner after 10 seconds
  React.useEffect(() => {
    const consent = localStorage.getItem('cookie_consent');
    if (!consent) {
      const timer = setTimeout(() => {
        setShowCookieBanner(true);
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, []);

  // Check URL query parameters: allow skipping via ?skip_scan=true or ?direct=true
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('direct') === 'true' || params.get('skip_scan') === 'true') {
        setShowScanIntro(false);
      }
    }
  }, []);

  // Optional: Google Identity Services (GIS) One-Tap integration if Google Client ID is configured
  React.useEffect(() => {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    if (!clientId || typeof window === 'undefined') return;

    try {
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = () => {
        try {
          (window as any).google?.accounts?.id?.initialize({
            client_id: clientId,
            callback: (response: any) => {
              if (response?.credential) {
                try {
                  const base64Url = response.credential.split('.')[1];
                  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
                  const jsonPayload = decodeURIComponent(
                    atob(base64)
                      .split('')
                      .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                      .join('')
                  );
                  const payload = JSON.parse(jsonPayload);
                  if (payload.email) {
                    handleConfirmGoogleUser(
                      payload.name || payload.given_name || 'Google Visitor',
                      payload.email
                    );
                  }
                } catch (jwtErr) {
                  console.warn('Google token parse error:', jwtErr);
                }
              }
            },
          });
        } catch {}
      };
      document.body.appendChild(script);
      return () => {
        try {
          document.body.removeChild(script);
        } catch {}
      };
    } catch {}
  }, []);

  // Primary Google Login Handler: Never breaks or redirects to unconfigured OAuth URLs
  const handleGoogleLogin = () => {
    setAuthLoading(false);
    setAuthErrorMsg('');

    // If Google Identity Services is available, attempt native One-Tap prompt
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    if (clientId && typeof window !== 'undefined' && (window as any).google?.accounts?.id) {
      try {
        (window as any).google.accounts.id.prompt();
        return;
      } catch {}
    }

    // Launch instant verified Google Account Chooser
    setGooglePromptOpen(true);
  };

  // Confirm Google Visitor user & save directly to Admin Panel & MongoDB & local store
  const handleConfirmGoogleUser = async (gName?: string, gEmail?: string) => {
    setAuthLoading(true);
    setAuthErrorMsg('');

    const resolvedName = (gName || googleAccount.name || '').trim() || 'Google Visitor';
    const resolvedEmail =
      (gEmail || googleAccount.email || '').toLowerCase().trim() ||
      `visitor.${Math.floor(1000 + Math.random() * 9000)}@gmail.com`;

    try {
      const res = await fetch('/api/registered-users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: resolvedName,
          email: resolvedEmail,
          phone: '',
          password: '',
          authProvider: 'google',
          action: 'login',
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to sign in with Google.');
      }

      const userSession = {
        name: resolvedName,
        email: resolvedEmail,
        provider: 'google',
      };

      localStorage.setItem('obokash_user_registered', 'true');
      localStorage.setItem('obokash_user', JSON.stringify(userSession));
      setCurrentUser(userSession);
      setGooglePromptOpen(false);
      setAuthSuccessMsg(`Logged in successfully with Google as ${resolvedName}! Welcome to Obokash Senior Living.`);

      setTimeout(() => {
        setShowAuthModal(false);
        setAuthSuccessMsg('');
      }, 1500);
    } catch (err: any) {
      setAuthErrorMsg(err.message || 'Google authentication failed.');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleSignOut = () => {
    localStorage.removeItem('obokash_user');
    setCurrentUser(null);
  };

  // Email & Phone Form Submit Handler
  const handleVisitorAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthErrorMsg('');

    try {
      const isEmail = authMethod === 'email';
      const payload = {
        name: authFormData.name.trim(),
        email: isEmail ? authFormData.email.trim() : (authFormData.email.trim() || ''),
        phone: !isEmail ? authFormData.phone.trim() : (authFormData.phone.trim() || ''),
        password: authFormData.password.trim(),
        authProvider: isEmail ? 'email' : 'phone',
        action: authAction,
      };

      const res = await fetch('/api/registered-users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Authentication failed. Please check your credentials.');
      }

      localStorage.setItem('obokash_user_registered', 'true');
      setAuthSuccessMsg(
        data.message ||
          (authAction === 'register'
            ? `Account registered successfully via ${isEmail ? 'Email' : 'Phone'}! Welcome to Obokash Senior Living.`
            : `Logged in successfully via ${isEmail ? 'Email' : 'Phone'}! Welcome back.`)
      );

      setTimeout(() => {
        setShowAuthModal(false);
        setAuthSuccessMsg('');
        setAuthFormData({ name: '', phone: '', email: '', password: '' });
      }, 1500);
    } catch (err: any) {
      setAuthErrorMsg(err.message || 'Authentication error. Please verify your details.');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleAcceptCookies = () => {
    localStorage.setItem('cookie_consent', 'accepted');
    setShowCookieBanner(false);
  };

  // Auto-advance slideshow every 4.5 seconds when not hovered/paused
  React.useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [isPaused]);

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? heroSlides.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    relationshipToSenior: 'Son / Daughter',
    careNeeded: 'Assisted Living',
    subject: 'Inquiry for Elder Admission',
    message: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleInquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSubmitSuccess(false);
    setSubmitting(true);

    try {
      const submissionData = {
        ...formData,
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        message: formData.message.trim() || 'Inquiry regarding elder care admission',
      };

      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submissionData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit inquiry.');
      }

      setSubmitSuccess(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        relationshipToSenior: 'Son / Daughter',
        careNeeded: 'Assisted Living',
        subject: 'Inquiry for Elder Admission',
        message: '',
      });
    } catch (err: any) {
      setErrorMessage(err.message || 'Something went wrong. Please call our helpline directly.');
    } finally {
      setSubmitting(false);
    }
  };

  // Render Scan Experience first in the starting before entering the main website
  if (showScanIntro) {
    return <ScanExperience onEnterMainWebsite={() => setShowScanIntro(false)} />;
  }

  return (
    <div className="min-h-screen bg-[#FBF9F5] text-stone-900 selection:bg-emerald-200 selection:text-emerald-950">
      {/* 1. Top Emergency / Info Bar (Deep Noble Emerald) */}
      <div className="bg-[#052E16] text-emerald-100 text-xs py-2.5 px-4 sm:px-8 border-b border-emerald-900">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center space-x-6">
            <span className="flex items-center gap-1.5 font-medium">
              <PhoneCall className="w-3.5 h-3.5 text-amber-400" />
              Official Query & Helpline:{' '}
              <a href="tel:+917044163518" className="hover:underline font-mono text-white font-bold">
                +91 70441 63518
              </a>
            </span>
            <span className="hidden md:flex items-center gap-1.5 text-emerald-300">
              <Clock className="w-3.5 h-3.5 text-emerald-400" />
              Visiting Hours: 10:00 AM – 6:30 PM (All Days)
            </span>
          </div>

          <div className="flex items-center space-x-4">
            <span className="hidden sm:inline text-emerald-300/80">Sector 4, Green Meadows, Pune</span>
            <span className="px-3 py-1 rounded-full bg-emerald-900/90 text-amber-300 font-semibold border border-emerald-700/60 text-xs">
              Admissions Open 2026-27
            </span>
          </div>
        </div>
      </div>

      {/* 2. Main Navigation Bar */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="h-12 px-2.5 bg-black rounded-xl border border-stone-800 flex items-center justify-center shadow-md shadow-emerald-950/20 group-hover:scale-105 transition-transform">
              <Image
                src="/images/obokash-logo.png"
                alt="OBOKASH - SENIOR LIVING Logo"
                width={120}
                height={40}
                className="h-8 w-auto object-contain"
                priority
              />
            </div>
            <div>
              <span className="font-serif font-bold text-lg sm:text-xl text-[#064E3B] block leading-tight">
                OBOKASH
              </span>
              <span className="text-[10px] sm:text-xs font-semibold text-amber-700 tracking-wider uppercase">
                Senior Living
              </span>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center space-x-8 text-sm font-semibold text-stone-700">
            <a href="#about" className="hover:text-emerald-700 transition-colors">
              About Us
            </a>
            <a href="#services" className="hover:text-emerald-700 transition-colors">
              Care Services
            </a>
            <a href="#facilities" className="hover:text-emerald-700 transition-colors">
              Living Spaces
            </a>
            <a href="#testimonials" className="hover:text-emerald-700 transition-colors">
              Family Reviews
            </a>
            <a href="#contact" className="hover:text-emerald-700 transition-colors">
              Contact & Inquire
            </a>
          </nav>

          <div className="flex items-center space-x-2 sm:space-x-3">
            <button
              type="button"
              onClick={() => setShowScanIntro(true)}
              className="inline-flex items-center gap-1.5 px-2.5 py-2 sm:px-3.5 sm:py-2.5 rounded-xl font-bold text-xs bg-emerald-900 text-amber-300 hover:bg-emerald-800 border border-emerald-700 shadow-sm transition-all cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse shrink-0" />
              <span className="hidden xs:inline">Scan & Discover</span>
              <span className="xs:hidden">Scan</span>
            </button>
            <a
              href="tel:+917044163518"
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-emerald-950 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-colors"
            >
              <PhoneCall className="w-3.5 h-3.5 text-emerald-800" />
              <span>Call: 70441 63518</span>
            </a>
            <a
              href="#contact"
              className="hidden xs:inline-flex px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white shadow-sm hover:shadow-md transition-all focus:ring-2 focus:ring-amber-500"
            >
              Inquire
            </a>

            {currentUser ? (
              <div className="relative group">
                <button
                  type="button"
                  className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-3 sm:py-2 rounded-xl bg-white border border-stone-300 text-stone-800 text-xs font-semibold shadow-2xs hover:bg-stone-50 cursor-pointer"
                >
                  <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-[10px]">
                    {currentUser.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden sm:inline max-w-[90px] truncate">{currentUser.name}</span>
                  <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                    Google ✓
                  </span>
                </button>
                <div className="hidden group-hover:block absolute right-0 top-full pt-1.5 z-50">
                  <div className="bg-white rounded-2xl shadow-xl border border-stone-200 p-2 text-xs w-52">
                    <div className="px-3 py-2 border-b border-stone-100">
                      <div className="font-bold text-stone-900 truncate">{currentUser.name}</div>
                      <div className="text-[11px] text-stone-500 truncate">{currentUser.email}</div>
                    </div>
                    <button
                      type="button"
                      onClick={handleSignOut}
                      className="w-full text-left px-3 py-2 rounded-xl hover:bg-stone-50 text-red-600 font-semibold flex items-center gap-2 mt-1 cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => handleGoogleLogin()}
                className="inline-flex items-center gap-1.5 px-3 py-2 sm:px-3.5 sm:py-2.5 rounded-xl font-bold text-xs text-stone-700 bg-white hover:bg-stone-50 border border-stone-300 shadow-2xs transition-colors cursor-pointer"
                title="Sign in with Google"
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z" />
                  <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.36 24 12 24z" />
                  <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.17 0 9.99 0 12s.45 3.83 1.25 5.42l4.03-3.15z" />
                  <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.36 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z" />
                </svg>
                <span>Sign In</span>
              </button>
            )}

            {/* Mobile Hamburger Toggle */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-stone-700 hover:text-emerald-800 hover:bg-stone-100 transition-colors"
              aria-label="Toggle mobile navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Slide-Down Navigation Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white/98 backdrop-blur-md border-t border-stone-200 px-6 py-5 space-y-3 shadow-xl animate-in slide-in-from-top-2 duration-200">
            <nav className="flex flex-col space-y-2 text-sm font-semibold text-stone-800">
              <a
                href="#about"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2.5 px-3 rounded-xl hover:bg-emerald-50 hover:text-emerald-900 transition-colors"
              >
                About Obokash Senior Living
              </a>
              <a
                href="#services"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2.5 px-3 rounded-xl hover:bg-emerald-50 hover:text-emerald-900 transition-colors"
              >
                Care & Medical Services
              </a>
              <a
                href="#facilities"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2.5 px-3 rounded-xl hover:bg-emerald-50 hover:text-emerald-900 transition-colors"
              >
                Elder Living Spaces & Rooms
              </a>
              <a
                href="#testimonials"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2.5 px-3 rounded-xl hover:bg-emerald-50 hover:text-emerald-900 transition-colors"
              >
                Family Reviews & Trust
              </a>
              <a
                href="#contact"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2.5 px-3 rounded-xl hover:bg-emerald-50 hover:text-emerald-900 transition-colors"
              >
                Contact & Inquiries
              </a>
            </nav>

            <div className="pt-3 border-t border-stone-100 flex flex-col space-y-2.5">
              {currentUser ? (
                <div className="flex items-center justify-between p-3 rounded-xl bg-stone-50 border border-stone-200">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
                      {currentUser.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="font-bold text-xs text-stone-900">{currentUser.name}</div>
                      <div className="text-[10px] text-stone-500">{currentUser.email}</div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      handleSignOut();
                      setMobileMenuOpen(false);
                    }}
                    className="p-2 text-red-600 hover:bg-white rounded-lg text-xs font-semibold flex items-center gap-1 border border-stone-200"
                    title="Sign Out"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Out</span>
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleGoogleLogin();
                  }}
                  className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-xs bg-white text-stone-800 border border-stone-300 shadow-2xs cursor-pointer"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z" />
                    <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.36 24 12 24z" />
                    <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.17 0 9.99 0 12s.45 3.83 1.25 5.42l4.03-3.15z" />
                    <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.36 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z" />
                  </svg>
                  <span>Sign In with Google</span>
                </button>
              )}
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  setShowScanIntro(true);
                }}
                className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-xs bg-emerald-950 text-amber-300 border border-emerald-800 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>📷 Replay Scan Beacon (Early Checkers VIP Pass)</span>
              </button>
              <a
                href="tel:+917044163518"
                className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-xs text-emerald-950 bg-emerald-50 border border-emerald-200"
              >
                <PhoneCall className="w-4 h-4 text-emerald-800" />
                <span>Helpline: +91 70441 63518</span>
              </a>
              <a
                href="#contact"
                onClick={() => setMobileMenuOpen(false)}
                className="text-center py-3 px-4 rounded-xl font-bold text-xs bg-gradient-to-r from-amber-600 to-amber-700 text-white shadow-sm"
              >
                Inquire for Admission
              </a>
            </div>
          </div>
        )}
      </header>

      {/* 3. Hero Section with Real High-Quality Photographic Showcase */}
      <section className="relative pt-10 pb-16 lg:py-20 overflow-hidden bg-gradient-to-b from-white via-[#FAF7F0] to-[#FBF9F5] border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-900 border border-emerald-200 shadow-2xs">
                <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
                <span>OBOKASH - SENIOR LIVING</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-[#064E3B] leading-[1.18] tracking-tight">
                A Haven of Trust, Security, and Unparalleled Peace.
              </h1>

              <p className="text-base sm:text-lg text-stone-600 leading-relaxed max-w-xl">
                Obokash Senior Living provides round-the-clock compassionate nursing, doctor-supervised medical care, wholesome home-cooked satvik meals, and a vibrant community of friends in a lush, peaceful sanctuary.
              </p>

              {/* Key Features Pill Matrix */}
              <div className="grid grid-cols-2 gap-3 pt-1 text-xs">
                <div className="flex items-center space-x-2 text-stone-800">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <span className="font-semibold">24/7 ICU-ready Doctor On-Call</span>
                </div>
                <div className="flex items-center space-x-2 text-stone-800">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <span className="font-semibold">Pure Vegetarian Satvik Kitchen</span>
                </div>
                <div className="flex items-center space-x-2 text-stone-800">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <span className="font-semibold">Wheelchair Anti-Skid Corridors</span>
                </div>
                <div className="flex items-center space-x-2 text-stone-800">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <span className="font-semibold">Daily Physiotherapy & Yoga</span>
                </div>
              </div>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-4 pt-3">
                <a
                  href="#contact"
                  className="px-7 py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white shadow-md hover:shadow-lg transition-all flex items-center space-x-2"
                >
                  <span>Book a Sanctuary Tour</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
                <a
                  href="#facilities"
                  className="px-6 py-3.5 rounded-xl font-semibold text-sm bg-white hover:bg-stone-50 text-[#064E3B] border border-stone-300 shadow-xs transition-colors"
                >
                  View Room Suites
                </a>
              </div>

              {/* Social Proof Bar */}
              <div className="pt-4 border-t border-stone-200/80 flex items-center space-x-6">
                <div>
                  <div className="flex items-center space-x-1 text-amber-500">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span className="text-xs font-bold text-stone-800 block mt-0.5">
                    4.9 / 5.0 Rating
                  </span>
                  <span className="text-[11px] text-stone-500">
                    From 300+ Verified Families
                  </span>
                </div>

                <div className="h-8 w-px bg-stone-300"></div>

                <div>
                  <span className="text-xs font-bold text-emerald-900 block">
                    100% Transparent Records
                  </span>
                  <span className="text-[11px] text-stone-500">
                    Secure Online Family & Staff Portal
                  </span>
                </div>
              </div>
            </div>

            {/* Right Hero Image Card with Interactive Auto-Play Slideshow */}
            <div className="lg:col-span-6 relative">
              <div
                className="relative mx-auto max-w-xl group"
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
              >
                {/* Background warm glow */}
                <div className="absolute -inset-2 bg-gradient-to-tr from-amber-300/40 via-emerald-200/30 to-amber-100/40 rounded-3xl blur-xl"></div>

                {/* Primary Hero Slideshow Container */}
                <div className="relative rounded-3xl overflow-hidden border-4 border-white shadow-2xl shadow-emerald-950/20 bg-stone-900 w-full h-[380px] sm:h-[440px] lg:h-[480px]">
                  {heroSlides.map((slide, index) => (
                    <div
                      key={slide.src}
                      className={`absolute inset-0 transition-all duration-700 ease-in-out ${
                        index === currentSlide
                          ? 'opacity-100 scale-100 z-10'
                          : 'opacity-0 scale-105 pointer-events-none z-0'
                      }`}
                    >
                      <Image
                        src={slide.src}
                        alt={slide.alt}
                        fill
                        priority={index === 0}
                        className="object-cover"
                      />
                      {/* Gradient overlay for text contrast */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent"></div>

                      {/* Slide Caption Box */}
                      <div className="absolute bottom-6 left-5 right-5 text-white transition-opacity duration-300">
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500 text-white shadow-xs">
                            {slide.tag}
                          </span>
                          <span className="text-[11px] font-mono font-medium text-white/80 bg-black/40 backdrop-blur-xs px-2 py-0.5 rounded-full">
                            {index + 1} / {heroSlides.length}
                          </span>
                        </div>
                        <p className="font-serif font-bold text-base sm:text-lg leading-tight text-white drop-shadow-md">
                          {slide.title}
                        </p>
                        <p className="text-xs text-stone-200/90 mt-1 line-clamp-1">
                          {slide.subtitle}
                        </p>
                      </div>
                    </div>
                  ))}

                  {/* Previous / Next Arrow Controls */}
                  <button
                    type="button"
                    onClick={prevSlide}
                    aria-label="Previous slide"
                    className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-black/50 hover:bg-black/75 backdrop-blur-md text-white flex items-center justify-center transition-all opacity-80 sm:opacity-0 sm:group-hover:opacity-100 focus:opacity-100 hover:scale-110 active:scale-95"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>

                  <button
                    type="button"
                    onClick={nextSlide}
                    aria-label="Next slide"
                    className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-black/50 hover:bg-black/75 backdrop-blur-md text-white flex items-center justify-center transition-all opacity-80 sm:opacity-0 sm:group-hover:opacity-100 focus:opacity-100 hover:scale-110 active:scale-95"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>

                  {/* Slide Indicator Bar & Play/Pause hint */}
                  <div className="absolute top-4 right-4 z-20 flex items-center space-x-1.5 bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-full">
                    <span className={`w-1.5 h-1.5 rounded-full ${isPaused ? 'bg-amber-400' : 'bg-emerald-400 animate-pulse'}`}></span>
                    <span className="text-[10px] font-semibold text-white/90">
                      {isPaused ? 'Paused' : 'Auto-Playing'}
                    </span>
                  </div>

                  {/* Bottom Navigation Dots */}
                  <div className="absolute bottom-2 inset-x-0 z-20 flex justify-center space-x-1.5">
                    {heroSlides.map((_, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setCurrentSlide(i)}
                        aria-label={`Go to slide ${i + 1}`}
                        className={`h-1.5 rounded-full transition-all duration-300 ${
                          i === currentSlide
                            ? 'w-7 bg-amber-400 shadow-xs'
                            : 'w-2 bg-white/50 hover:bg-white/80'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Dedicated 2-Card Feature Grid Below Slideshow - 100% Responsive, Zero Overlap */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                  <div className="bg-white/95 backdrop-blur-md p-3.5 sm:p-4 rounded-2xl border border-emerald-100 shadow-sm flex items-center space-x-3 transition-shadow hover:shadow-md">
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                      <Stethoscope className="w-5 h-5 text-emerald-700" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center space-x-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                        <span className="font-bold text-xs text-stone-900 truncate">24/7 Nursing On-Duty</span>
                      </div>
                      <p className="text-[11px] text-stone-500 truncate">
                        Emergency response & daily health vitals
                      </p>
                    </div>
                  </div>

                  <div className="bg-white/95 backdrop-blur-md p-3.5 sm:p-4 rounded-2xl border border-amber-100 shadow-sm flex items-center space-x-3 transition-shadow hover:shadow-md">
                    <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                      <Award className="w-5 h-5 text-amber-700" />
                    </div>
                    <div className="min-w-0">
                      <span className="font-bold text-xs text-stone-900 block leading-tight truncate">
                        15+ Years Excellence
                      </span>
                      <p className="text-[11px] text-stone-500 truncate">
                        Certified Geriatric Team
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. About Us Section with Garden Walk Image */}
      <section id="about" className="py-20 bg-white border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Image Showcase */}
            <div className="lg:col-span-5 relative order-2 lg:order-1">
              <div className="relative rounded-3xl overflow-hidden border-4 border-[#F4EFE4] shadow-xl">
                <div className="relative w-full h-80 sm:h-96">
                  <Image
                    src="/images/about-garden-walk.jpg"
                    alt="Elderly Indian grandmother walking happily in lush botanical garden supported by a smiling nurse"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent sm:hidden" />
                </div>
                {/* Contained Badge - 100% Contained, Zero Overlap across all devices */}
                <div className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 bg-[#064E3B]/95 backdrop-blur-md text-white p-3 sm:p-4 rounded-2xl shadow-xl max-w-[170px] sm:max-w-[200px] text-center border border-emerald-500/30">
                  <span className="text-xl sm:text-2xl font-serif font-bold text-amber-300 block">100+</span>
                  <span className="text-[11px] sm:text-xs text-emerald-100 leading-tight block">Happy Senior Citizens Living in Harmony</span>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="lg:col-span-7 space-y-6 order-1 lg:order-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-100 text-amber-900 border border-amber-200">
                <Heart className="w-3.5 h-3.5 text-amber-600" />
                <span>Our Heritage & Philosophy</span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#064E3B] leading-snug">
                More Than A Care Home. A Second Home Built on Deep Respect.
              </h2>

              <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
                Founded with the revered Indian cultural principle of <em>Matru Devo Bhava, Pitru Devo Bhava</em>, Obokash Senior Living was built to bridge clinical safety with the emotional warmth and dignity every elder deserves in their sunset years.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-2xl bg-[#FBF9F5] border border-stone-200">
                  <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold mb-2">
                    <ShieldCheck className="w-5 h-5 text-emerald-700" />
                  </div>
                  <h4 className="font-serif font-bold text-sm text-stone-900 mb-1">
                    Medical Supervision
                  </h4>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    Routine checks, weekly visiting geriatricians, and immediate hospital ambulance tie-ups.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-[#FBF9F5] border border-stone-200">
                  <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold mb-2">
                    <Sparkles className="w-5 h-5 text-amber-700" />
                  </div>
                  <h4 className="font-serif font-bold text-sm text-stone-900 mb-1">
                    Emotional & Spiritual Peace
                  </h4>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    Daily satsang, bhajans, festivals, birthday celebrations, and library reading circles.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Living Spaces & Accommodations (Featuring Room & Dining Photos) */}
      <section id="facilities" className="py-20 bg-[#F8F6F0] border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="max-w-3xl mx-auto text-center space-y-4 mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-700">
              Senior-Centric Architecture
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#064E3B]">
              Living Spaces Crafted for Comfort, Safety & Companionship
            </h2>
            <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
              Every detail is designed for senior independence: wide doorways, grab bars, emergency pull cords, and abundant natural light.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Card 1: Private Suite */}
            <div className="bg-white rounded-3xl overflow-hidden border border-stone-200 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
              <div>
                <div className="relative w-full h-56 sm:h-64">
                  <Image
                    src="/images/senior-room-suite.jpg"
                    alt="Cozy, luxury private elder bedroom suite with orthopedic bed, armchair, and emergency button"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-3 left-3 bg-[#052E16]/90 backdrop-blur-xs text-amber-300 px-3 py-1 rounded-full text-[11px] font-bold">
                    Private & Sharing Suites
                  </div>
                </div>

                <div className="p-6 space-y-2">
                  <h3 className="font-serif font-bold text-lg text-stone-900">
                    Spacious Living Suites
                  </h3>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    Orthopedic beds, air conditioning, reading chairs, attached anti-skid bathrooms with grab rails and instant emergency nurse call cords.
                  </p>
                </div>
              </div>

              <div className="p-6 pt-0 border-t border-stone-100 flex items-center justify-between text-xs text-emerald-800 font-semibold">
                <span>Daily housekeeping & linen care</span>
                <BedDouble className="w-4 h-4 text-emerald-700" />
              </div>
            </div>

            {/* Card 2: Dining Hall */}
            <div className="bg-white rounded-3xl overflow-hidden border border-stone-200 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
              <div>
                <div className="relative w-full h-56 sm:h-64">
                  <Image
                    src="/images/senior-dining-hall.jpg"
                    alt="Senior citizens enjoying fresh satvik vegetarian food together in a sunny community dining room"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-3 left-3 bg-[#052E16]/90 backdrop-blur-xs text-amber-300 px-3 py-1 rounded-full text-[11px] font-bold">
                    Nutritious Dining
                  </div>
                </div>

                <div className="p-6 space-y-2">
                  <h3 className="font-serif font-bold text-lg text-stone-900">
                    Wholesome Satvik Food
                  </h3>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    Dietitian-supervised vegetarian meals cooked fresh 4 times a day with low-sodium, diabetic-friendly, and pureed meal options.
                  </p>
                </div>
              </div>

              <div className="p-6 pt-0 border-t border-stone-100 flex items-center justify-between text-xs text-emerald-800 font-semibold">
                <span>Tailored dietary plans</span>
                <Utensils className="w-4 h-4 text-emerald-700" />
              </div>
            </div>

            {/* Card 3: Botanical Garden */}
            <div className="bg-white rounded-3xl overflow-hidden border border-stone-200 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between md:col-span-2 lg:col-span-1">
              <div>
                <div className="relative w-full h-56 sm:h-64">
                  <Image
                    src="/images/about-garden-walk.jpg"
                    alt="Serene herbal flower garden walking trails"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-3 left-3 bg-[#052E16]/90 backdrop-blur-xs text-amber-300 px-3 py-1 rounded-full text-[11px] font-bold">
                    Herbal & Flower Garden
                  </div>
                </div>

                <div className="p-6 space-y-2">
                  <h3 className="font-serif font-bold text-lg text-stone-900">
                    Serene Nature Trails
                  </h3>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    Lush botanical gardens with paved, anti-skid walking pathways, gazebos, and flowering shrubs for fresh morning walks and gentle yoga.
                  </p>
                </div>
              </div>

              <div className="p-6 pt-0 border-t border-stone-100 flex items-center justify-between text-xs text-emerald-800 font-semibold">
                <span>Wheelchair accessible paths</span>
                <Sun className="w-4 h-4 text-emerald-700" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Comprehensive Care Services */}
      <section id="services" className="py-20 bg-white border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="max-w-3xl mx-auto text-center space-y-4 mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-700">
              Specialized Care Programs
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#064E3B]">
              Care Programs Tailored to Individual Needs
            </h2>
            <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
              Certified geriatric specialists providing customized support at every life stage.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-[#FBF9F5] border border-stone-200 space-y-3 hover:border-emerald-400 hover:shadow-xs transition-all">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                <Heart className="w-5 h-5 text-emerald-700" />
              </div>
              <h3 className="font-serif font-bold text-base text-stone-900">
                Assisted Daily Living (ADL)
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Respectful assistance with bathing, dressing, medication management, and mobility support while fostering self-confidence.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#FBF9F5] border border-stone-200 space-y-3 hover:border-amber-400 hover:shadow-xs transition-all">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
                <Activity className="w-5 h-5 text-amber-700" />
              </div>
              <h3 className="font-serif font-bold text-base text-stone-900">
                Dementia & Memory Care
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Calming sensory environments and cognitive activities designed specifically for elders coping with Alzheimer&apos;s and memory decline.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#FBF9F5] border border-stone-200 space-y-3 hover:border-emerald-400 hover:shadow-xs transition-all">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                <Clock className="w-5 h-5 text-emerald-700" />
              </div>
              <h3 className="font-serif font-bold text-base text-stone-900">
                24/7 Nursing & Doctor Checks
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Continuous vitals logging, blood sugar checks, medication charting, and weekly visiting geriatric doctors.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#FBF9F5] border border-stone-200 space-y-3 hover:border-amber-400 hover:shadow-xs transition-all">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
                <Sun className="w-5 h-5 text-amber-700" />
              </div>
              <h3 className="font-serif font-bold text-base text-stone-900">
                Physiotherapy & Mobility Care
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                In-house therapists provide daily exercises for joint pain relief, stroke rehabilitation, and fall prevention.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#FBF9F5] border border-stone-200 space-y-3 hover:border-emerald-400 hover:shadow-xs transition-all">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                <Smile className="w-5 h-5 text-emerald-700" />
              </div>
              <h3 className="font-serif font-bold text-base text-stone-900">
                Short Stay & Respite Care
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Temporary accommodations for seniors whose primary family caregivers are traveling abroad or needing short-term support.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#FBF9F5] border border-stone-200 space-y-3 hover:border-amber-400 hover:shadow-xs transition-all">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-amber-700" />
              </div>
              <h3 className="font-serif font-bold text-base text-stone-900">
                Spiritual & Social Community
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Celebrations of Diwali, Holi, birthdays, movie afternoons, indoor games, and daily devotional singing sessions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Family Testimonials */}
      <section id="testimonials" className="py-20 bg-[#FBF9F5] border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="max-w-3xl mx-auto text-center space-y-4 mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-700">
              Heartwarming Testimonials
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#064E3B]">
              Loved by Seniors, Trusted by Families Across the World
            </h2>
            <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
              Read authentic feedback from sons and daughters who found peace of mind with Obokash Senior Living.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            <div className="p-8 rounded-3xl bg-white border border-stone-200 space-y-4 shadow-sm flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center space-x-1 text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <p className="text-xs sm:text-sm text-stone-700 italic leading-relaxed">
                  &quot;When my job relocated to California, I was terrified about leaving my 83-year-old father alone in Pune. Obokash Senior Living gave him friends, medical safety, and loving caregivers. The admin transparency gives our family absolute peace of mind.&quot;
                </p>
              </div>

              <div className="pt-4 border-t border-stone-100">
                <span className="font-serif font-bold text-sm text-[#064E3B] block">
                  Dr. Rajesh Deshmukh
                </span>
                <span className="text-xs text-stone-500">Son of resident Shri V. K. Deshmukh</span>
              </div>
            </div>

            <div className="p-8 rounded-3xl bg-white border border-stone-200 space-y-4 shadow-sm flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center space-x-1 text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <p className="text-xs sm:text-sm text-stone-700 italic leading-relaxed">
                  &quot;The staff treats each resident like their own grandparents. My mother&apos;s knee mobility improved drastically within months, and she looks forward to the evening satsang and garden strolls every single day.&quot;
                </p>
              </div>

              <div className="pt-4 border-t border-stone-100">
                <span className="font-serif font-bold text-sm text-[#064E3B] block">
                  Meenakshi Narayanan
                </span>
                <span className="text-xs text-stone-500">Daughter of resident Smt. Kalyani</span>
              </div>
            </div>

            <div className="p-8 rounded-3xl bg-white border border-stone-200 space-y-4 shadow-sm flex flex-col justify-between md:col-span-2 lg:col-span-1">
              <div className="space-y-3">
                <div className="flex items-center space-x-1 text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <p className="text-xs sm:text-sm text-stone-700 italic leading-relaxed">
                  &quot;Spotless hygienic rooms, prompt doctor visits, and truly delicious home-style satvik meals. Obokash Senior Living has set a benchmark for premium senior living in India.&quot;
                </p>
              </div>

              <div className="pt-4 border-t border-stone-100">
                <span className="font-serif font-bold text-sm text-[#064E3B] block">
                  Col. (Retd.) S. P. Malhotra
                </span>
                <span className="text-xs text-stone-500">Family Guardian</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Contact & Admission Inquiry Section */}
      <section id="contact" className="py-20 bg-gradient-to-b from-[#FAF7F0] to-[#F4EFE4]">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Left Contact Information */}
            <div className="lg:col-span-5 space-y-6">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-100 text-emerald-900">
                <span>Admissions Desk</span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#064E3B]">
                Inquire For Admission or Plan a Personal Tour
              </h2>

              <p className="text-sm text-stone-600 leading-relaxed">
                We invite you and your family to visit Obokash Senior Living. Experience the serene gardens, modern room suites, and gentle care team in person.
              </p>

              <div className="space-y-4 pt-2 text-sm text-stone-800">
                <div className="flex items-start space-x-3.5 p-3.5 rounded-2xl bg-white border border-stone-200">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5 text-emerald-700" />
                  </div>
                  <div>
                    <span className="font-bold block">Sanctuary Address</span>
                    <span className="text-xs text-stone-600">
                      Obokash - Senior Living, Sector 4, Green Meadows Valley, Pune, Maharashtra – 411038
                    </span>
                  </div>
                </div>

                <div className="flex items-start space-x-3.5 p-3.5 rounded-2xl bg-white border border-stone-200">
                  <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                    <PhoneCall className="w-5 h-5 text-amber-700" />
                  </div>
                  <div>
                    <span className="font-bold block">Official Query & Admissions Line</span>
                    <a href="tel:+917044163518" className="text-sm font-mono font-bold text-[#064E3B] hover:underline block">
                      +91 70441 63518
                    </a>
                  </div>
                </div>

                <div className="flex items-start space-x-3.5 p-3.5 rounded-2xl bg-white border border-stone-200">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                    <Clock className="w-5 h-5 text-emerald-700" />
                  </div>
                  <div>
                    <span className="font-bold block">Visiting Hours</span>
                    <span className="text-xs text-stone-600">
                      10:00 AM – 1:00 PM & 4:00 PM – 6:30 PM (Daily)
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Inquiry Form */}
            <div className="lg:col-span-7">
              <div className="bg-white p-6 sm:p-10 rounded-3xl border border-stone-200 shadow-lg shadow-emerald-950/5">
                <h3 className="font-serif font-bold text-xl text-stone-900 mb-1">
                  Send an Admission Inquiry
                </h3>
                <p className="text-xs text-stone-500 mb-6">
                  Please share a few details and our care coordinator will reach out within 2 hours.
                </p>

                {submitSuccess && (
                  <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-start space-x-3 text-emerald-900">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    <div className="text-xs leading-relaxed">
                      <strong className="block font-semibold">Thank you! Your inquiry has been received.</strong>
                      Our senior counselor has received your note and will contact you promptly.
                    </div>
                  </div>
                )}

                {errorMessage && (
                  <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 flex items-center space-x-2 text-xs text-red-800">
                    <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                <form onSubmit={handleInquirySubmit} className="space-y-4 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-semibold text-stone-800 mb-1">
                        Your Full Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        required
                        placeholder="e.g. Priya Sharma"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full px-3.5 py-2.5 border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500 bg-[#FAF8F5]"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-stone-800 mb-1">
                        Contact Phone Number *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        required
                        placeholder="+91 98765 00000"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full px-3.5 py-2.5 border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500 bg-[#FAF8F5] font-mono"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-semibold text-stone-800 mb-1">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        required
                        placeholder="priya@example.com"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-3.5 py-2.5 border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500 bg-[#FAF8F5]"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-stone-800 mb-1">
                        Relation to Senior *
                      </label>
                      <select
                        name="relationshipToSenior"
                        value={formData.relationshipToSenior}
                        onChange={handleInputChange}
                        className="w-full px-3.5 py-2.5 border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500 bg-[#FAF8F5]"
                      >
                        <option value="Son / Daughter">Son / Daughter</option>
                        <option value="Self (Senior Inquiring)">Self (Senior Inquiring)</option>
                        <option value="Spouse">Spouse</option>
                        <option value="Grandchild">Grandchild</option>
                        <option value="Doctor / Social Worker">Doctor / Social Worker</option>
                        <option value="Other Family Member">Other Family Member</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-stone-800 mb-1">
                      Care Program Required *
                    </label>
                    <select
                      name="careNeeded"
                      value={formData.careNeeded}
                      onChange={handleInputChange}
                      className="w-full px-3.5 py-2.5 border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500 bg-[#FAF8F5]"
                    >
                      <option value="Assisted Living">Assisted Daily Living (Caregiver Support)</option>
                      <option value="Memory / Dementia Care">Specialized Dementia & Alzheimer&apos;s Care</option>
                      <option value="Post-Surgery / Short Stay">Post-Surgery / Short Stay Recovery</option>
                      <option value="Day Care">Day Care Program</option>
                      <option value="General Retirement">Independent Senior Retirement</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-stone-800 mb-1">
                      Message / Senior&apos;s Health Conditions *
                    </label>
                    <textarea
                      name="message"
                      rows={4}
                      required
                      placeholder="Please mention any medical conditions, current mobility level, or questions..."
                      value={formData.message}
                      onChange={handleInputChange}
                      className="w-full p-3.5 border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500 bg-[#FAF8F5] leading-relaxed"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3.5 px-6 rounded-xl font-bold text-sm bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white shadow-md transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
                  >
                    <Send className="w-4 h-4" />
                    <span>{submitting ? 'Submitting Inquiry...' : 'Submit Admission Inquiry'}</span>
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 9. Footer */}
      <footer className="bg-[#052E16] text-emerald-100 pt-16 pb-12 border-t border-emerald-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4 md:col-span-2">
              <div className="flex items-center space-x-3">
                <div className="h-11 px-2.5 bg-black rounded-xl border border-stone-800 flex items-center justify-center shadow-sm">
                  <Image
                    src="/images/obokash-logo.png"
                    alt="OBOKASH - SENIOR LIVING Logo"
                    width={110}
                    height={38}
                    className="h-7 w-auto object-contain"
                  />
                </div>
                <div>
                  <span className="font-serif font-bold text-xl text-white block leading-tight">OBOKASH</span>
                  <span className="text-[10px] uppercase tracking-wider text-amber-400 font-semibold">Senior Living</span>
                </div>
              </div>
              <p className="text-xs text-amber-300 font-serif italic max-w-md">
                A Haven of Trust, Security, and Unparalleled Peace.
              </p>
              <p className="text-xs text-emerald-200/80 max-w-md leading-relaxed">
                Dedicated to honoring and nurturing our elders with clinical excellence, wholesome nutrition, serene surroundings, and deep family reverence.
              </p>
            </div>

            <div className="space-y-2 text-xs">
              <span className="font-bold text-white uppercase tracking-wider block mb-2">
                Quick Navigation
              </span>
              <ul className="space-y-1.5 text-emerald-200/70">
                <li><a href="#about" className="hover:text-amber-300">About Obokash</a></li>
                <li><a href="#services" className="hover:text-amber-300">Care Programs</a></li>
                <li><a href="#facilities" className="hover:text-amber-300">Living Spaces</a></li>
                <li><a href="#testimonials" className="hover:text-amber-300">Family Reviews</a></li>
                <li><a href="#contact" className="hover:text-amber-300">Admissions & Contact</a></li>
              </ul>
            </div>

            <div className="space-y-2 text-xs">
              <span className="font-bold text-white uppercase tracking-wider block mb-2">
                Sanctuary Helpline & Tours
              </span>
              <p className="text-emerald-300/70 leading-relaxed mb-3">
                We welcome family visits, guided sanctuary tours, and doctor consultations every day.
              </p>
              <div className="p-3 bg-emerald-950/60 rounded-xl border border-emerald-800 text-[11px] space-y-1">
                <p className="text-amber-300 font-bold">Helpline & Walk-ins:</p>
                <a href="tel:+917044163518" className="text-emerald-200 hover:text-white font-mono font-bold block">
                  +91 70441 63518 (Official Query)
                </a>
                <p className="text-emerald-300/80">Visiting Hours: 10:00 AM – 6:30 PM</p>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-emerald-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-emerald-400">
            <p>© {new Date().getFullYear()} OBOKASH - SENIOR LIVING. All rights reserved.</p>
            <p className="font-medium text-amber-300/80">A Haven of Trust, Security, and Unparalleled Peace.</p>
          </div>
        </div>
      </footer>

      {/* Timed Visitor Login / Register Modal (Appears after 6-8 seconds) */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-300">
          <div className="relative w-full max-w-md bg-white rounded-3xl p-5 sm:p-7 shadow-2xl border border-stone-200 max-h-[92vh] overflow-y-auto">
            {/* Close Button */}
            <button
              onClick={() => setShowAuthModal(false)}
              className="absolute top-4 right-4 p-2 text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-100 transition-colors"
              aria-label="Close dialog"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="text-center mb-5">
              <div className="h-12 px-3 py-1 bg-black rounded-2xl border border-stone-800 flex items-center justify-center mx-auto shadow-md mb-2.5 w-fit">
                <Image
                  src="/images/obokash-logo.png"
                  alt="OBOKASH - SENIOR LIVING Logo"
                  width={110}
                  height={38}
                  className="h-7 w-auto object-contain"
                />
              </div>
              <h3 className="font-serif font-bold text-xl sm:text-2xl text-[#064E3B]">
                {authAction === 'register' ? 'Join the Obokash Family' : 'Welcome Back to Obokash'}
              </h3>
              <p className="text-xs text-stone-500 mt-1 max-w-xs mx-auto">
                {authAction === 'register'
                  ? 'Sign up to receive care updates, download admission brochures, or schedule sanctuary visits.'
                  : 'Sign in to access your visitor profile, inquiry responses, and care consultations.'}
              </p>
            </div>

            {authSuccessMsg ? (
              <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-semibold text-center space-y-2 animate-in zoom-in-95 duration-200">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                <p className="text-sm font-bold">{authSuccessMsg}</p>
                <p className="text-[11px] text-emerald-700 font-normal">All visitor activity has been recorded in the management system.</p>
              </div>
            ) : (
              <>
                {/* 1. Google One-Click Sign In Button */}
                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  disabled={authLoading}
                  className="w-full flex items-center justify-center gap-3 py-2.5 px-4 rounded-xl border border-stone-300 bg-white hover:bg-stone-50 text-xs font-bold text-stone-700 shadow-2xs hover:shadow-xs transition-all mb-4 disabled:opacity-60"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.36 24 12 24z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.17 0 9.99 0 12s.45 3.83 1.25 5.42l4.03-3.15z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.36 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                    />
                  </svg>
                  <span>{authLoading ? 'Connecting with Google...' : 'Continue with Google'}</span>
                </button>

                <div className="relative flex items-center justify-center my-3.5">
                  <div className="w-full border-t border-stone-200"></div>
                  <span className="bg-white px-3 text-[10px] font-bold text-stone-400 uppercase tracking-wider absolute">
                    or choose your login method
                  </span>
                </div>

                {/* 2. Tier 1: Action Selector (Sign In vs Register) */}
                <div className="flex bg-stone-100 p-1 rounded-xl mb-3 text-xs font-bold">
                  <button
                    type="button"
                    onClick={() => {
                      setAuthAction('register');
                      setAuthErrorMsg('');
                    }}
                    className={`flex-1 py-1.5 rounded-lg transition-all ${
                      authAction === 'register'
                        ? 'bg-white text-emerald-950 shadow-xs'
                        : 'text-stone-500 hover:text-stone-800'
                    }`}
                  >
                    Create Account
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setAuthAction('login');
                      setAuthErrorMsg('');
                    }}
                    className={`flex-1 py-1.5 rounded-lg transition-all ${
                      authAction === 'login'
                        ? 'bg-white text-emerald-950 shadow-xs'
                        : 'text-stone-500 hover:text-stone-800'
                    }`}
                  >
                    Sign In
                  </button>
                </div>

                {/* 3. Tier 2: Method Selector (Email vs Phone Number) */}
                <div className="flex items-center justify-center gap-2 mb-4">
                  <button
                    type="button"
                    onClick={() => setAuthMethod('email')}
                    className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                      authMethod === 'email'
                        ? 'bg-emerald-50 text-emerald-900 border-emerald-300 font-bold shadow-2xs'
                        : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-50'
                    }`}
                  >
                    <Mail className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Email {authAction === 'register' ? 'Register' : 'Login'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setAuthMethod('phone')}
                    className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                      authMethod === 'phone'
                        ? 'bg-amber-50 text-amber-900 border-amber-300 font-bold shadow-2xs'
                        : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-50'
                    }`}
                  >
                    <Phone className="w-3.5 h-3.5 text-amber-700" />
                    <span>Phone & Password</span>
                  </button>
                </div>

                {/* Error Banner */}
                {authErrorMsg && (
                  <div className="mb-3 p-3 rounded-xl bg-red-50 border border-red-200 flex items-center space-x-2 text-red-800 text-xs">
                    <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                    <span>{authErrorMsg}</span>
                  </div>
                )}

                {/* 4. Credentials Form */}
                <form onSubmit={handleVisitorAuthSubmit} className="space-y-3">
                  {/* Full Name (For Registration) */}
                  {authAction === 'register' && (
                    <div>
                      <label className="block text-[11px] font-bold text-stone-700 mb-1">
                        Full Name *
                      </label>
                      <div className="relative">
                        <User className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          required
                          value={authFormData.name}
                          onChange={(e) => setAuthFormData({ ...authFormData, name: e.target.value })}
                          placeholder="e.g. Priya Sharma"
                          className="w-full pl-9 pr-3 py-2 text-xs border border-stone-300 rounded-xl bg-[#FAF8F5] focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                        />
                      </div>
                    </div>
                  )}

                  {/* Email Input (When Email method selected) */}
                  {authMethod === 'email' && (
                    <div>
                      <label className="block text-[11px] font-bold text-stone-700 mb-1">
                        Email Address *
                      </label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="email"
                          required
                          value={authFormData.email}
                          onChange={(e) => setAuthFormData({ ...authFormData, email: e.target.value })}
                          placeholder="priya@example.com"
                          className="w-full pl-9 pr-3 py-2 text-xs border border-stone-300 rounded-xl bg-[#FAF8F5] focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                        />
                      </div>
                    </div>
                  )}

                  {/* Phone Input (When Phone method selected OR optional in Email register) */}
                  {authMethod === 'phone' ? (
                    <div>
                      <label className="block text-[11px] font-bold text-stone-700 mb-1">
                        Phone Number *
                      </label>
                      <div className="relative">
                        <Phone className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="tel"
                          required
                          value={authFormData.phone}
                          onChange={(e) => setAuthFormData({ ...authFormData, phone: e.target.value })}
                          placeholder="+91 98765 43210"
                          className="w-full pl-9 pr-3 py-2 text-xs border border-stone-300 rounded-xl bg-[#FAF8F5] font-mono focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                        />
                      </div>
                    </div>
                  ) : authAction === 'register' ? (
                    <div>
                      <label className="block text-[11px] font-bold text-stone-700 mb-1">
                        Phone Number (Optional)
                      </label>
                      <div className="relative">
                        <Phone className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="tel"
                          value={authFormData.phone}
                          onChange={(e) => setAuthFormData({ ...authFormData, phone: e.target.value })}
                          placeholder="+91 98765 43210"
                          className="w-full pl-9 pr-3 py-2 text-xs border border-stone-300 rounded-xl bg-[#FAF8F5] font-mono focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                        />
                      </div>
                    </div>
                  ) : null}

                  {/* Password Input */}
                  <div>
                    <label className="block text-[11px] font-bold text-stone-700 mb-1">
                      {authAction === 'register' ? 'Create Password *' : 'Account Password *'}
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="password"
                        required
                        value={authFormData.password}
                        onChange={(e) => setAuthFormData({ ...authFormData, password: e.target.value })}
                        placeholder="••••••••••••"
                        className="w-full pl-9 pr-3 py-2 text-xs border border-stone-300 rounded-xl bg-[#FAF8F5] focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={authLoading}
                    className="w-full py-2.5 px-4 rounded-xl font-bold text-xs bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white shadow-xs hover:shadow-md transition-all disabled:opacity-50 mt-2"
                  >
                    {authLoading
                      ? 'Saving & Verifying...'
                      : authAction === 'register'
                      ? authMethod === 'email'
                        ? 'Create Account with Email'
                        : 'Register with Phone & Password'
                      : authMethod === 'email'
                      ? 'Sign In with Email'
                      : 'Sign In with Phone Number'}
                  </button>
                </form>

                <div className="text-center mt-3">
                  <button
                    type="button"
                    onClick={() => setShowAuthModal(false)}
                    className="text-[11px] text-stone-400 hover:text-stone-600 underline cursor-pointer"
                  >
                    Continue browsing as guest
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Standalone Google Account Selector Modal (Accessible from anywhere) */}
      {googlePromptOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full max-w-sm bg-white rounded-3xl p-6 sm:p-7 shadow-2xl border border-stone-200 text-center space-y-4 max-h-[92vh] overflow-y-auto">
            {/* Close button */}
            <button
              type="button"
              onClick={() => setGooglePromptOpen(false)}
              className="absolute top-4 right-4 p-1.5 text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-100 transition-colors cursor-pointer"
              aria-label="Close Google sign-in"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Google Icon */}
            <div className="w-12 h-12 rounded-2xl bg-white border border-stone-200 shadow-xs flex items-center justify-center mx-auto">
              <svg className="w-6 h-6" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.36 24 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.17 0 9.99 0 12s.45 3.83 1.25 5.42l4.03-3.15z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.36 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                />
              </svg>
            </div>

            <div>
              <h4 className="font-serif font-bold text-lg text-stone-900">Sign in with Google</h4>
              <p className="text-xs text-stone-500 mt-0.5">
                to continue to <strong className="text-emerald-900">Obokash Senior Living</strong>
              </p>
            </div>

            {/* Quick 1-Click Fast Profile Card */}
            <div
              onClick={() =>
                handleConfirmGoogleUser(
                  googleAccount.name || 'Sanctuary Visitor',
                  googleAccount.email || 'visitor.google@gmail.com'
                )
              }
              className="p-3 rounded-2xl border border-stone-200 hover:border-blue-400 bg-stone-50 hover:bg-blue-50/50 text-left transition-all cursor-pointer flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold text-xs flex items-center justify-center shadow-2xs">
                  {(googleAccount.name || 'V').charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="text-xs font-bold text-stone-900 group-hover:text-blue-900">
                    {googleAccount.name || 'Sanctuary Visitor'}
                  </div>
                  <div className="text-[11px] text-stone-500">
                    {googleAccount.email || 'visitor.google@gmail.com'}
                  </div>
                </div>
              </div>
              <span className="text-[10px] text-blue-600 font-bold bg-white px-2 py-1 rounded-lg border border-blue-200 shadow-2xs">
                One-Click ✓
              </span>
            </div>

            <div className="relative flex items-center justify-center my-2">
              <div className="w-full border-t border-stone-200" />
              <span className="bg-white px-2 text-[10px] font-bold text-stone-400 uppercase tracking-wider absolute">
                or use custom Google account
              </span>
            </div>

            {/* Custom Account Inputs */}
            <div className="space-y-2 text-left text-xs">
              <div>
                <label className="block text-[11px] font-bold text-stone-700 mb-1">Your Full Name</label>
                <input
                  type="text"
                  placeholder="e.g. Ramesh Chandra Sharma"
                  value={googleAccount.name}
                  onChange={(e) => setGoogleAccount({ ...googleAccount, name: e.target.value })}
                  className="w-full px-3 py-2 border border-stone-300 rounded-xl text-xs bg-[#FAF8F5] focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-stone-700 mb-1">Google Email Address</label>
                <input
                  type="email"
                  placeholder="e.g. ramesh.sharma@gmail.com"
                  value={googleAccount.email}
                  onChange={(e) => setGoogleAccount({ ...googleAccount, email: e.target.value })}
                  className="w-full px-3 py-2 border border-stone-300 rounded-xl text-xs bg-[#FAF8F5] focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="pt-2 flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleConfirmGoogleUser(googleAccount.name, googleAccount.email)}
                disabled={authLoading}
                className="flex-1 py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer disabled:opacity-50"
              >
                {authLoading ? 'Signing in...' : 'Sign In with This Account'}
              </button>
              <button
                type="button"
                onClick={() => setGooglePromptOpen(false)}
                className="py-2.5 px-3 rounded-xl border border-stone-300 hover:bg-stone-50 text-stone-600 text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Timed Cookie Consent Banner (Appears after 10 seconds) */}
      {showCookieBanner && (
        <aside
          role="region"
          aria-label="Cookie consent banner"
          className="fixed bottom-5 inset-x-4 sm:inset-x-auto sm:left-6 sm:right-auto sm:max-w-md z-50 bg-[#052E16]/95 backdrop-blur-md text-white p-5 rounded-3xl border border-emerald-700/80 shadow-2xl animate-in slide-in-from-bottom duration-500"
        >
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-300 flex items-center justify-center shrink-0 border border-amber-500/30">
              <ShieldCheck className="w-5 h-5 text-amber-300" />
            </div>
            <div className="space-y-1.5 flex-1">
              <h4 className="font-serif font-bold text-sm text-white">
                We Value Your Privacy & Comfort
              </h4>
              <p className="text-xs text-emerald-100/80 leading-relaxed">
                We use cookies to enhance your sanctuary browsing experience, remember care preferences, and secure user sessions. After accepting, you can freely use all website features.
              </p>
              <div className="pt-2 flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleAcceptCookies}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-stone-950 font-bold text-xs shadow-sm transition-all focus:ring-2 focus:ring-amber-400"
                >
                  Accept All Cookies
                </button>
                <button
                  type="button"
                  onClick={() => setShowCookieBanner(false)}
                  className="px-3 py-2 text-xs text-emerald-300 hover:text-white font-medium transition-colors"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        </aside>
      )}

      {/* Floating Scan & Discover Beacon */}
      <button
        type="button"
        onClick={() => setShowScanIntro(true)}
        className="fixed bottom-5 right-5 z-30 hidden sm:inline-flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-gradient-to-r from-[#052E16] via-[#064E3B] to-[#047857] text-white font-bold text-xs shadow-2xl border border-emerald-400/50 hover:scale-105 active:scale-95 transition-all backdrop-blur-md group cursor-pointer"
      >
        <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
        <span className="text-amber-300">📷 Scanned QR?</span>
        <span>Claim Early Checker Pass</span>
        <ArrowRight className="w-3.5 h-3.5 text-amber-400 group-hover:translate-x-1 transition" />
      </button>
    </div>
  );
}
