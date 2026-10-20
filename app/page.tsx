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
  Sprout,
  Flower2,
  Home,
  Maximize2,
  Eye,
} from 'lucide-react';

const heroSlides = [
  {
    src: '/images/obokash-hero-poster.jpg',
    tag: 'Official Sanctuary Vision',
    title: '"A haven of trust, security and unparalleled peace."',
    subtitle: '8769, SH 1, Kulpi, Chak Ramnath, West Bengal – 743351',
    alt: 'OBOKASH Senior Living official intro poster showing elderly couple sitting on a wooden bench overlooking a peaceful lake at sunset',
  },
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

const serviceSections = [
  {
    id: 'residential-living',
    category: '01 / RESIDENTIAL LIVING',
    heading: 'A Place to Call Home',
    description:
      'A thoughtfully designed living environment where comfort, privacy and belonging come together. OBOKASH aspires to offer seniors a peaceful space to embrace everyday life with independence, dignity and the warmth of a welcoming community.',
    keywords: ['Comfort', 'Independence', 'Belonging'],
    buttonText: 'Explore Living Options',
    careCategory: 'Independent Residential Living',
    subject: 'Inquiry: Residential Living Options',
    image: '/images/services/service-01-residential-living.jpg',
    alt: 'A thoughtfully designed senior living environment with warm comfort, privacy, and sunlight',
  },
  {
    id: 'assisted-living',
    category: '02 / ASSISTED LIVING',
    heading: 'Care with Dignity',
    description:
      "Every individual deserves care that respects their choices, routines and independence. Our vision for assisted living centres on compassionate personal support, thoughtful daily assistance and an approach that puts each resident's dignity first.",
    keywords: ['Respect', 'Support', 'Dignity'],
    buttonText: 'Discover Assisted Living',
    careCategory: 'Assisted Living',
    subject: 'Inquiry: Assisted Living Care',
    image: '/images/services/service-02-assisted-living.jpg',
    alt: 'Compassionate personal support and assistance putting senior resident dignity first',
  },
  {
    id: 'nutrition-dining',
    category: '03 / NUTRITION & DINING',
    heading: 'Nourishment for Life',
    description:
      'Good food brings nourishment, comfort and people together. OBOKASH aims to make dining a pleasant part of everyday life, with thoughtfully planned meals, attention to individual dietary needs and opportunities to enjoy food in good company.',
    keywords: ['Nutrition', 'Enjoyment', 'Togetherness'],
    buttonText: 'Discover Our Dining Experience',
    careCategory: 'Satvik Dining & Nutrition',
    subject: 'Inquiry: Nutrition & Dining Experience',
    image: '/images/services/service-03-nutrition-dining.jpg',
    alt: 'Nourishing, thoughtfully planned meals shared in good company with friends',
  },
  {
    id: 'healthcare-wellness',
    category: '04 / HEALTHCARE & WELLNESS',
    heading: 'Wellness, Every Day',
    description:
      'Ageing well means caring for both body and mind. OBOKASH envisions a supportive environment that encourages healthy routines and helps residents and families coordinate access to appropriate healthcare and wellness services.',
    keywords: ['Wellness', 'Reassurance', 'Support'],
    buttonText: 'Explore Wellness',
    careCategory: 'Medical & Healthcare Support',
    subject: 'Inquiry: Healthcare & Wellness Coordination',
    image: '/images/services/service-04-healthcare-wellness.jpg',
    alt: 'Supportive healthcare and wellness environment encouraging healthy routines for body and mind',
  },
  {
    id: 'community-lifestyle',
    category: '05 / COMMUNITY & LIFESTYLE',
    heading: 'Life Is Better Together',
    description:
      'A fulfilling life is shaped by connection, discovery and the freedom to enjoy what matters. From gardening and creative pursuits to cultural celebrations and shared activities, OBOKASH aims to nurture a community where friendships can flourish and every day can hold something meaningful.',
    keywords: ['Friendship', 'Joy', 'Purpose'],
    buttonText: 'Discover Community Life',
    careCategory: 'Community & Cultural Life',
    subject: 'Inquiry: Community & Lifestyle Programs',
    image: '/images/services/service-05-community-lifestyle.jpg',
    alt: 'Seniors engaging in gardening and cultural pursuits where friendships flourish and life is shared',
  },
  {
    id: 'family-connect',
    category: '06 / FAMILY CONNECT',
    heading: 'Peace of Mind for Families',
    description:
      'Choosing a senior living environment is a family decision built on trust. OBOKASH aims to encourage open communication, meaningful family involvement and thoughtful updates, helping loved ones remain connected and involved in the journey.',
    keywords: ['Trust', 'Connection', 'Reassurance'],
    buttonText: 'Connect with OBOKASH',
    careCategory: 'Family Advisory & Consult',
    subject: 'Inquiry: Family Connect & Partnership',
    image: '/images/services/service-06-family-connect.jpg',
    alt: 'Family connection built on trust, open communication, and reassurance for loved ones',
  },
];

export default function LandingPage() {
  // Scan intro is presented in the starting before entering the main website
  const [showScanIntro, setShowScanIntro] = useState<boolean>(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showPosterModal, setShowPosterModal] = useState(false);

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

  // Standalone Google Account Selector Modal State
  const [googlePromptOpen, setGooglePromptOpen] = useState(false);
  const [googleAccount, setGoogleAccount] = useState({
    name: '',
    email: '',
  });

  // Current Logged-In User state
  const [currentUser, setCurrentUser] = useState<{
    name: string;
    email?: string;
    phone?: string;
    provider?: string;
  } | null>(null);

  // Check existing session in localStorage on mount
  React.useEffect(() => {
    try {
      const stored = localStorage.getItem('obokash_user');
      if (stored) {
        setCurrentUser(JSON.parse(stored));
      }
    } catch {
      // Ignore parse error
    }
  }, []);

  // Timed Cookie Consent Banner state (after 10 seconds)
  const [showCookieBanner, setShowCookieBanner] = useState(false);

  // Timer 1: Trigger Auth Modal after 7 seconds if user not already registered/signed in
  React.useEffect(() => {
    const isRegistered = localStorage.getItem('obokash_user_registered');
    if (!isRegistered) {
      const timer = setTimeout(() => {
        setShowAuthModal(true);
      }, 7000);
      return () => clearTimeout(timer);
    }
  }, []);

  // Timer 2: Trigger Cookie Banner after 10 seconds if not already consented
  React.useEffect(() => {
    const consent = localStorage.getItem('cookie_consent');
    if (!consent) {
      const timer = setTimeout(() => {
        setShowCookieBanner(true);
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, []);

  // Check URL parameters for direct modal opens (e.g. ?login=true or ?action=register)
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('login') === 'true') {
        setAuthAction('login');
        setShowAuthModal(true);
      } else if (params.get('register') === 'true') {
        setAuthAction('register');
        setShowAuthModal(true);
      }
    }
  }, []);

  // Initialize official Google Identity Services (GSI) One Tap / OAuth
  React.useEffect(() => {
    if (typeof window === 'undefined') return;

    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    if (!clientId) return;

    if (!(window as any).google) {
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = () => {
        try {
          (window as any).google.accounts.id.initialize({
            client_id: clientId,
            callback: (response: any) => {
              try {
                if (response.credential) {
                  const base64Url = response.credential.split('.')[1];
                  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
                  const jsonPayload = decodeURIComponent(
                    atob(base64)
                      .split('')
                      .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                      .join('')
                  );
                  const payload = JSON.parse(jsonPayload);
                  handleConfirmGoogleUser(payload.name || payload.given_name || 'Google Visitor', payload.email || '');
                }
              } catch (e) {
                // Fallback to manual prompt
                setGooglePromptOpen(true);
              }
            },
            auto_select: false,
          });
        } catch {
          // Silent fallback
        }
      };
      document.body.appendChild(script);
    }
  }, []);

  // Trigger Google Login
  const handleGoogleLogin = () => {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    if ((window as any).google && (window as any).google.accounts?.id && clientId) {
      try {
        (window as any).google.accounts.id.prompt((notification: any) => {
          if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
            setGooglePromptOpen(true);
          }
        });
        return;
      } catch (err) {
        // Fall back to modal prompt
      }
    }
    setGooglePromptOpen(true);
  };

  // Confirm Google Profile & Save directly into Central System Database
  const handleConfirmGoogleUser = async (gName?: string, gEmail?: string) => {
    const resolvedName = (gName || googleAccount.name || '').trim() || 'Google Visitor';
    const resolvedEmail =
      (gEmail || googleAccount.email || '').trim() || `visitor.${Date.now()}@google-user.com`;

    setAuthLoading(true);
    setAuthErrorMsg('');

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

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSelectServiceInquiry = (careCategory: string, serviceSubject: string) => {
    setFormData((prev) => ({
      ...prev,
      careNeeded: careCategory,
      subject: serviceSubject,
    }));
  };

  const handleInquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMessage('');
    setSubmitSuccess(false);

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
    <div className="min-h-screen bg-[#F7F2EA] text-[#352A25] selection:bg-[#78836A]/20 selection:text-[#352A25]">
      {/* 1. Top Emergency / Info Bar (Espresso #352A25) */}
      <div className="bg-[#352A25] text-[#F7F2EA] text-xs py-2.5 px-4 sm:px-8 border-b border-[#352A25]/30">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center space-x-6">
            <span className="flex items-center gap-1.5 font-medium">
              <PhoneCall className="w-3.5 h-3.5 text-[#A47750]" />
              Official Query & Helpline:{' '}
              <a href="tel:+917044163518" className="hover:underline font-mono text-[#F7F2EA] font-bold">
                +91 70441 63518
              </a>
            </span>
            <span className="hidden md:flex items-center gap-1.5 text-[#F7F2EA]/80">
              <Clock className="w-3.5 h-3.5 text-[#78836A]" />
              Visiting Hours: 10:00 AM – 6:30 PM (All Days)
            </span>
          </div>

          <div className="flex items-center space-x-4">
            <span className="hidden sm:inline text-[#F7F2EA]/80">📍 8769, SH 1, Kulpi, Chak Ramnath, West Bengal – 743351</span>
            <span className="px-3 py-1 rounded-full bg-[#271E1A] text-[#A47750] font-semibold border border-[#A47750]/30 text-xs">
              Admissions Open 2026-27
            </span>
          </div>
        </div>
      </div>

      {/* 2. Main Navigation Bar (Ivory #F7F2EA / Espresso #352A25) */}
      <header className="sticky top-0 z-40 bg-[#F7F2EA]/95 backdrop-blur-md border-b border-[#352A25]/15 shadow-warm-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="h-12 px-3 bg-white rounded-xl border border-[#352A25]/15 flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
              <Image
                src="/images/obokash-logo.png"
                alt="OBOKASH - SENIOR LIVING Logo"
                width={140}
                height={58}
                className="h-9 w-auto object-contain"
                priority
              />
            </div>
            <div>
              <span className="font-serif font-bold text-lg sm:text-xl text-[#352A25] block leading-tight">
                OBOKASH
              </span>
              <span className="text-[10px] sm:text-xs font-semibold text-[#A47750] tracking-wider uppercase">
                Senior Living
              </span>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center space-x-8 text-sm font-semibold text-[#352A25]/85">
            <a href="#about" className="hover:text-[#A47750] transition-colors">
              About Us
            </a>
            <a href="#services" className="hover:text-[#A47750] transition-colors">
              Care Services
            </a>
            <a href="#facilities" className="hover:text-[#A47750] transition-colors">
              Living Spaces
            </a>
            <a href="#testimonials" className="hover:text-[#A47750] transition-colors">
              Family Reviews
            </a>
            <a href="#contact" className="hover:text-[#A47750] transition-colors">
              Contact & Inquire
            </a>
          </nav>

          <div className="flex items-center space-x-2 sm:space-x-3">
            <button
              type="button"
              onClick={() => setShowScanIntro(true)}
              className="inline-flex items-center gap-1.5 px-3 py-2 sm:px-3.5 sm:py-2.5 rounded-xl font-bold text-xs bg-[#352A25] text-[#F7F2EA] hover:bg-[#271E1A] border border-[#352A25] shadow-xs transition-all cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#A47750] animate-pulse shrink-0" />
              <span>Discover OBOKASH</span>
            </button>
            <a
              href="tel:+917044163518"
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-[#352A25] bg-white hover:bg-[#FAF6F0] border border-[#352A25]/20 shadow-xs transition-colors"
            >
              <PhoneCall className="w-3.5 h-3.5 text-[#78836A]" />
              <span>Call: 70441 63518</span>
            </a>
            <a
              href="#contact"
              className="hidden xs:inline-flex px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-[#352A25] hover:bg-[#A47750] text-[#F7F2EA] shadow-warm-sm hover:shadow-warm-md transition-all"
            >
              Register Your Interest
            </a>

            {currentUser ? (
              <div className="relative group">
                <button
                  type="button"
                  className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-3 sm:py-2 rounded-xl bg-white border border-[#352A25]/20 text-[#352A25] text-xs font-semibold shadow-2xs hover:bg-[#FAF6F0] cursor-pointer"
                >
                  <div className="w-5 h-5 rounded-full bg-[#352A25] text-[#F7F2EA] flex items-center justify-center font-bold text-[10px]">
                    {currentUser.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden sm:inline max-w-[90px] truncate">{currentUser.name}</span>
                  <span className="text-[10px] text-[#78836A] font-bold bg-[#78836A]/10 px-1.5 py-0.5 rounded border border-[#78836A]/30">
                    Google ✓
                  </span>
                </button>
                <div className="hidden group-hover:block absolute right-0 top-full pt-1.5 z-50">
                  <div className="bg-white rounded-2xl shadow-xl border border-[#352A25]/15 p-2 text-xs w-52">
                    <div className="px-3 py-2 border-b border-[#352A25]/10">
                      <div className="font-bold text-[#352A25] truncate">{currentUser.name}</div>
                      <div className="text-[11px] text-[#352A25]/60 truncate">{currentUser.email}</div>
                    </div>
                    <button
                      type="button"
                      onClick={handleSignOut}
                      className="w-full text-left px-3 py-2 rounded-xl hover:bg-[#F7F2EA] text-red-600 font-semibold flex items-center gap-2 mt-1 cursor-pointer"
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
                className="inline-flex items-center gap-1.5 px-3 py-2 sm:px-3.5 sm:py-2.5 rounded-xl font-bold text-xs text-[#352A25] bg-white hover:bg-[#FAF6F0] border border-[#352A25]/20 shadow-2xs transition-colors cursor-pointer"
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
              className="lg:hidden p-2 rounded-xl text-[#352A25] hover:text-[#A47750] hover:bg-black/5 transition-colors"
              aria-label="Toggle mobile navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Slide-Down Navigation Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-[#F7F2EA] border-t border-[#352A25]/15 px-6 py-5 space-y-3 shadow-xl animate-in slide-in-from-top-2 duration-200">
            <nav className="flex flex-col space-y-2 text-sm font-semibold text-[#352A25]">
              <a
                href="#about"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2.5 px-3 rounded-xl hover:bg-white hover:text-[#A47750] transition-colors"
              >
                About Obokash Senior Living
              </a>
              <a
                href="#services"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2.5 px-3 rounded-xl hover:bg-white hover:text-[#A47750] transition-colors"
              >
                Care & Medical Services
              </a>
              <a
                href="#facilities"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2.5 px-3 rounded-xl hover:bg-white hover:text-[#A47750] transition-colors"
              >
                Elder Living Spaces & Rooms
              </a>
              <a
                href="#testimonials"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2.5 px-3 rounded-xl hover:bg-white hover:text-[#A47750] transition-colors"
              >
                Family Reviews & Trust
              </a>
              <a
                href="#contact"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2.5 px-3 rounded-xl hover:bg-white hover:text-[#A47750] transition-colors"
              >
                Contact & Inquiries
              </a>
            </nav>

            <div className="pt-3 border-t border-[#352A25]/10 flex flex-col space-y-2.5">
              {currentUser ? (
                <div className="flex items-center justify-between p-3 rounded-xl bg-white border border-[#352A25]/15">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-[#352A25] text-[#F7F2EA] flex items-center justify-center font-bold text-xs">
                      {currentUser.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="font-bold text-xs text-[#352A25]">{currentUser.name}</div>
                      <div className="text-[10px] text-[#352A25]/60">{currentUser.email}</div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      handleSignOut();
                      setMobileMenuOpen(false);
                    }}
                    className="p-2 text-red-600 hover:bg-[#F7F2EA] rounded-lg text-xs font-semibold flex items-center gap-1 border border-[#352A25]/15"
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
                  className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-xs bg-white text-[#352A25] border border-[#352A25]/20 shadow-2xs cursor-pointer"
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
                className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-xs bg-[#352A25] text-[#F7F2EA] border border-[#352A25] cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-[#A47750]" />
                <span>📷 Replay Scan Beacon (Early Checkers VIP Pass)</span>
              </button>
              <a
                href="tel:+917044163518"
                className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-xs text-[#352A25] bg-white border border-[#352A25]/20"
              >
                <PhoneCall className="w-4 h-4 text-[#78836A]" />
                <span>Helpline: +91 70441 63518</span>
              </a>
              <a
                href="#contact"
                onClick={() => setMobileMenuOpen(false)}
                className="text-center py-3 px-4 rounded-xl font-bold text-xs bg-[#352A25] hover:bg-[#A47750] text-[#F7F2EA] shadow-warm-sm"
              >
                Register Your Interest
              </a>
            </div>
          </div>
        )}
      </header>

      {/* 3. Hero Section with Real High-Quality Photographic Showcase */}
      <section className="relative pt-10 pb-16 lg:py-20 overflow-hidden bg-[#F7F2EA] border-b border-[#352A25]/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-[#A47750]/10 text-[#A47750] border border-[#A47750]/30 shadow-2xs">
                <span className="w-2 h-2 rounded-full bg-[#A47750] animate-pulse"></span>
                <span>OBOKASH Senior Living</span>
              </div>

              <div className="space-y-2">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-[#352A25] leading-[1.18] tracking-tight">
                  A New Chapter of Life, Filled with Peace.
                </h1>
                <p className="font-serif italic text-base sm:text-lg text-[#A47750] font-medium">
                  A Haven of Trust, Security, and Unparalleled Peace.
                </p>
              </div>

              <p className="text-base text-[#352A25]/85 leading-relaxed max-w-xl">
                OBOKASH is an evolving vision for senior living, built around dignity, comfort, companionship, and peace of mind. We aspire to create a welcoming environment where seniors can embrace life with independence and belonging, while families find reassurance and trust.
              </p>

              {/* 4 Pillars Grid: A Safe Environment. A Healthier Tomorrow. A Vibrant Community. A More Fulfilling Life. */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-xs">
                <div className="flex items-start space-x-2.5 text-[#352A25] p-3 rounded-2xl bg-white border border-[#352A25]/10 shadow-2xs">
                  <div className="w-7 h-7 rounded-lg bg-[#78836A]/10 text-[#78836A] flex items-center justify-center shrink-0 mt-0.5">
                    <Home className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold block text-xs">A Safe Environment</span>
                    <span className="text-[11px] text-[#352A25]/70">Anti-skid corridors, 24/7 security & medical backup</span>
                  </div>
                </div>

                <div className="flex items-start space-x-2.5 text-[#352A25] p-3 rounded-2xl bg-white border border-[#352A25]/10 shadow-2xs">
                  <div className="w-7 h-7 rounded-lg bg-[#78836A]/10 text-[#78836A] flex items-center justify-center shrink-0 mt-0.5">
                    <Sprout className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold block text-xs">A Healthier Tomorrow</span>
                    <span className="text-[11px] text-[#352A25]/70">Physiotherapy, doctor supervision & satvik meals</span>
                  </div>
                </div>

                <div className="flex items-start space-x-2.5 text-[#352A25] p-3 rounded-2xl bg-white border border-[#352A25]/10 shadow-2xs">
                  <div className="w-7 h-7 rounded-lg bg-[#A47750]/10 text-[#A47750] flex items-center justify-center shrink-0 mt-0.5">
                    <Users className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold block text-xs">A Vibrant Community</span>
                    <span className="text-[11px] text-[#352A25]/70">Daily companionship, celebrations & garden strolls</span>
                  </div>
                </div>

                <div className="flex items-start space-x-2.5 text-[#352A25] p-3 rounded-2xl bg-white border border-[#352A25]/10 shadow-2xs">
                  <div className="w-7 h-7 rounded-lg bg-[#A47750]/10 text-[#A47750] flex items-center justify-center shrink-0 mt-0.5">
                    <Flower2 className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold block text-xs">A More Fulfilling Life</span>
                    <span className="text-[11px] text-[#352A25]/70">Dignity, serene independence & calm peace of mind</span>
                  </div>
                </div>
              </div>

              {/* Location Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs bg-white border border-[#352A25]/15 text-[#352A25] shadow-2xs">
                <MapPin className="w-4 h-4 text-[#A47750] shrink-0" />
                <span className="font-medium">8769, SH 1, Kulpi, Chak Ramnath, West Bengal – 743351</span>
              </div>

              {/* CTAs: Discover OBOKASH | Register Your Interest */}
              <div className="flex flex-wrap items-center gap-4 pt-1">
                <button
                  type="button"
                  onClick={() => setShowScanIntro(true)}
                  className="px-7 py-3.5 rounded-xl font-bold text-sm bg-[#352A25] hover:bg-[#A47750] text-[#F7F2EA] shadow-warm-md hover:scale-[1.01] active:scale-98 transition-all flex items-center space-x-2 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-[#A47750]" />
                  <span>Discover OBOKASH</span>
                </button>
                <a
                  href="#contact"
                  className="px-6 py-3.5 rounded-xl font-bold text-sm bg-white hover:bg-[#FAF6F0] text-[#352A25] border border-[#352A25]/20 shadow-xs transition-colors flex items-center space-x-2"
                >
                  <span>Register Your Interest</span>
                  <ArrowRight className="w-4 h-4 text-[#A47750]" />
                </a>
              </div>

              {/* Social Proof Bar */}
              <div className="pt-4 border-t border-[#352A25]/10 flex items-center space-x-6">
                <div>
                  <div className="flex items-center space-x-1 text-[#A47750]">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-[#A47750] text-[#A47750]" />
                    ))}
                  </div>
                  <span className="text-xs font-bold text-[#352A25] block mt-0.5">
                    4.9 / 5.0 Rating
                  </span>
                  <span className="text-[11px] text-[#352A25]/60">
                    From 300+ Verified Families
                  </span>
                </div>

                <div className="h-8 w-px bg-[#352A25]/15"></div>

                <div>
                  <span className="text-xs font-bold text-[#352A25] block">
                    100% Transparent Records
                  </span>
                  <span className="text-[11px] text-[#352A25]/60">
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
                <div className="absolute -inset-2 bg-gradient-to-tr from-[#A47750]/20 via-[#78836A]/15 to-[#F7F2EA] rounded-3xl blur-xl"></div>

                {/* Primary Hero Slideshow Container */}
                <div className="relative rounded-3xl overflow-hidden border-4 border-white shadow-warm-lg bg-stone-900 w-full h-[400px] sm:h-[460px] lg:h-[500px]">
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
                        className={
                          slide.src === '/images/obokash-hero-poster.jpg'
                            ? 'object-contain bg-[#231A16]'
                            : 'object-cover'
                        }
                      />
                      {/* Gradient overlay for text contrast */}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#352A25]/90 via-black/25 to-transparent"></div>

                      {/* Slide Caption Box */}
                      <div className="absolute bottom-6 left-5 right-5 text-white transition-opacity duration-300">
                        <div className="flex items-center justify-between mb-1.5">
                          <div className="flex items-center gap-2">
                            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#A47750] text-white shadow-xs">
                              {slide.tag}
                            </span>
                            {slide.src === '/images/obokash-hero-poster.jpg' && (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setShowPosterModal(true);
                                }}
                                className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white text-[#352A25] hover:bg-[#FAF6F0] shadow-xs cursor-pointer border border-[#352A25]/20"
                              >
                                <Maximize2 className="w-3 h-3 text-[#A47750]" />
                                <span>Full View</span>
                              </button>
                            )}
                          </div>
                          <span className="text-[11px] font-mono font-medium text-[#F7F2EA] bg-[#352A25]/80 backdrop-blur-xs px-2 py-0.5 rounded-full">
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
                    className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-black/50 hover:bg-[#352A25] backdrop-blur-md text-white flex items-center justify-center transition-all opacity-80 sm:opacity-0 sm:group-hover:opacity-100 focus:opacity-100 hover:scale-110 active:scale-95"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>

                  <button
                    type="button"
                    onClick={nextSlide}
                    aria-label="Next slide"
                    className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-black/50 hover:bg-[#352A25] backdrop-blur-md text-white flex items-center justify-center transition-all opacity-80 sm:opacity-0 sm:group-hover:opacity-100 focus:opacity-100 hover:scale-110 active:scale-95"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>

                  {/* Slide Indicator Bar & Play/Pause hint */}
                  <div className="absolute top-4 right-4 z-20 flex items-center space-x-1.5 bg-[#352A25]/75 backdrop-blur-md px-2.5 py-1 rounded-full">
                    <span className={`w-1.5 h-1.5 rounded-full ${isPaused ? 'bg-[#A47750]' : 'bg-[#78836A] animate-pulse'}`}></span>
                    <span className="text-[10px] font-semibold text-[#F7F2EA]">
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
                            ? 'w-7 bg-[#A47750] shadow-xs'
                            : 'w-2 bg-white/50 hover:bg-white/80'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Dedicated 2-Card Feature Grid Below Slideshow */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                  <div className="bg-white/95 backdrop-blur-md p-3.5 sm:p-4 rounded-2xl border border-[#352A25]/10 shadow-warm-sm flex items-center space-x-3 transition-shadow hover:shadow-warm-md">
                    <div className="w-10 h-10 rounded-xl bg-[#78836A]/10 text-[#78836A] flex items-center justify-center shrink-0">
                      <Stethoscope className="w-5 h-5 text-[#78836A]" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center space-x-1.5">
                        <span className="w-2 h-2 rounded-full bg-[#78836A] animate-pulse"></span>
                        <span className="font-bold text-xs text-[#352A25] truncate">24/7 Nursing On-Duty</span>
                      </div>
                      <p className="text-[11px] text-[#352A25]/60 truncate">
                        Emergency response & daily health vitals
                      </p>
                    </div>
                  </div>

                  <div className="bg-white/95 backdrop-blur-md p-3.5 sm:p-4 rounded-2xl border border-[#352A25]/10 shadow-warm-sm flex items-center space-x-3 transition-shadow hover:shadow-warm-md">
                    <div className="w-10 h-10 rounded-xl bg-[#A47750]/10 text-[#A47750] flex items-center justify-center shrink-0">
                      <Award className="w-5 h-5 text-[#A47750]" />
                    </div>
                    <div className="min-w-0">
                      <span className="font-bold text-xs text-[#352A25] block leading-tight truncate">
                        15+ Years Excellence
                      </span>
                      <p className="text-[11px] text-[#352A25]/60 truncate">
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
      <section id="about" className="py-20 bg-white border-b border-[#352A25]/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Image Showcase */}
            <div className="lg:col-span-5 relative order-2 lg:order-1">
              <div className="relative rounded-3xl overflow-hidden border-4 border-[#F7F2EA] shadow-warm-md">
                <div className="relative w-full h-80 sm:h-96">
                  <Image
                    src="/images/about-garden-walk.jpg"
                    alt="Elderly Indian grandmother walking happily in lush botanical garden supported by a smiling nurse"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent sm:hidden" />
                </div>
                {/* Contained Badge */}
                <div className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 bg-[#352A25]/95 backdrop-blur-md text-[#F7F2EA] p-3 sm:p-4 rounded-2xl shadow-xl max-w-[170px] sm:max-w-[200px] text-center border border-[#352A25]/30">
                  <span className="text-xl sm:text-2xl font-serif font-bold text-[#A47750] block">100+</span>
                  <span className="text-[11px] sm:text-xs text-[#F7F2EA]/90 leading-tight block">Happy Senior Citizens Living in Harmony</span>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="lg:col-span-7 space-y-6 order-1 lg:order-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#78836A]/10 text-[#78836A] border border-[#78836A]/30">
                <Heart className="w-3.5 h-3.5 text-[#78836A]" />
                <span>Our Heritage & Philosophy</span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#352A25] leading-snug">
                A Haven of Trust, Security, and Unparalleled Peace.
              </h2>

              <p className="text-[#352A25]/85 text-sm sm:text-base leading-relaxed">
                OBOKASH is an evolving vision for senior living, built around dignity, comfort, companionship, and peace of mind. We aspire to create a welcoming environment where seniors can embrace life with independence and belonging, while families find reassurance and trust.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-2xl bg-[#F7F2EA] border border-[#352A25]/10">
                  <div className="w-9 h-9 rounded-xl bg-white text-[#78836A] border border-[#352A25]/10 flex items-center justify-center font-bold mb-2">
                    <ShieldCheck className="w-5 h-5 text-[#78836A]" />
                  </div>
                  <h4 className="font-serif font-bold text-sm text-[#352A25] mb-1">
                    Medical Supervision
                  </h4>
                  <p className="text-xs text-[#352A25]/75 leading-relaxed">
                    Routine checks, weekly visiting geriatricians, and immediate hospital ambulance tie-ups.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-[#F7F2EA] border border-[#352A25]/10">
                  <div className="w-9 h-9 rounded-xl bg-white text-[#A47750] border border-[#352A25]/10 flex items-center justify-center font-bold mb-2">
                    <Sparkles className="w-5 h-5 text-[#A47750]" />
                  </div>
                  <h4 className="font-serif font-bold text-sm text-[#352A25] mb-1">
                    Emotional & Spiritual Peace
                  </h4>
                  <p className="text-xs text-[#352A25]/75 leading-relaxed">
                    Daily satsang, bhajans, festivals, birthday celebrations, and library reading circles.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Comprehensive Service Guide (The 6 Official Service Sections) */}
      <section id="services" className="py-20 lg:py-28 bg-[#F7F2EA] border-b border-[#352A25]/10 scroll-mt-20">
        <div id="facilities" className="scroll-mt-24" />
        <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-16">
          {/* Section Header */}
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-[#A47750]/10 text-[#A47750] border border-[#A47750]/30 shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-[#A47750]" />
              <span>OBOKASH Senior Living • Service Visual Guide</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-[#352A25] leading-tight">
              A Thoughtful Approach to Every Stage of Senior Life
            </h2>
            <p className="text-[#352A25]/85 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
              Our six core service sections pair dedicated, compassionate support and wholesome living with uncompromised dignity, independence, and peace of mind.
            </p>
            <p className="text-[11px] text-[#352A25]/60 italic font-medium">
              Note: OBOKASH is in development. The copy is intentionally aspirational to reflect our planned living standards and care philosophy.
            </p>
          </div>

          {/* The 6 Alternating Service Sections */}
          <div className="space-y-12 lg:space-y-16">
            {serviceSections.map((service, index) => {
              const isEven = index % 2 === 1; // 0-based: index 0 (01) is odd, index 1 (02) is even
              return (
                <div
                  key={service.id}
                  id={service.id}
                  className="bg-white rounded-3xl p-6 sm:p-10 lg:p-14 border border-[#352A25]/12 shadow-warm-md hover:shadow-warm-lg transition-all scroll-mt-24"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
                    {/* Text Column */}
                    <div className={`lg:col-span-6 space-y-5 ${isEven ? 'order-1 lg:order-2' : 'order-1'}`}>
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-bold tracking-widest uppercase bg-[#F7F2EA] border border-[#352A25]/15 text-[#A47750]">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#A47750]" />
                        <span>{service.category}</span>
                      </div>

                      <h3 className="font-serif font-bold text-2xl sm:text-3xl lg:text-4xl text-[#352A25] leading-snug">
                        {service.heading}
                      </h3>

                      <p className="text-sm sm:text-base text-[#352A25]/85 leading-relaxed">
                        {service.description}
                      </p>

                      {/* Supporting keywords with dot separator */}
                      <div className="flex flex-wrap items-center gap-2.5 text-xs sm:text-sm font-semibold text-[#78836A] pt-1">
                        {service.keywords.map((kw, kwIdx) => (
                          <React.Fragment key={kw}>
                            <span>{kw}</span>
                            {kwIdx < service.keywords.length - 1 && (
                              <span className="text-[#A47750] font-bold">•</span>
                            )}
                          </React.Fragment>
                        ))}
                      </div>

                      {/* Action Button linking to Contact with prefill */}
                      <div className="pt-3">
                        <a
                          href="#contact"
                          onClick={() => handleSelectServiceInquiry(service.careCategory, service.subject)}
                          className="inline-flex items-center gap-2 px-6 sm:px-7 py-3 sm:py-3.5 rounded-xl font-bold text-xs sm:text-sm bg-[#352A25] hover:bg-[#A47750] text-[#F7F2EA] shadow-warm-sm hover:shadow-warm-md transition-all hover:scale-[1.02] active:scale-98 cursor-pointer"
                        >
                          <span>{service.buttonText}</span>
                          <ArrowRight className="w-4 h-4 text-[#A47750]" />
                        </a>
                      </div>
                    </div>

                    {/* Square Illustration Column */}
                    <div className={`lg:col-span-6 ${isEven ? 'order-2 lg:order-1' : 'order-2'}`}>
                      <div className="relative aspect-square w-full max-w-md mx-auto rounded-3xl overflow-hidden border-4 border-[#F7F2EA] shadow-warm-md group bg-[#F7F2EA]">
                        <Image
                          src={service.image}
                          alt={service.alt}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                          sizes="(max-width: 768px) 100vw, 500px"
                        />
                        <div className="absolute inset-0 ring-1 ring-inset ring-black/5 rounded-3xl pointer-events-none" />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 7. Family Testimonials */}
      <section id="testimonials" className="py-20 bg-[#F7F2EA] border-b border-[#352A25]/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="max-w-3xl mx-auto text-center space-y-4 mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-[#A47750]">
              Heartwarming Testimonials
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#352A25]">
              Loved by Seniors, Trusted by Families Across the World
            </h2>
            <p className="text-[#352A25]/80 text-sm sm:text-base leading-relaxed">
              Read authentic feedback from sons and daughters who found peace of mind with Obokash Senior Living.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            <div className="p-8 rounded-3xl bg-white border border-[#352A25]/10 space-y-4 shadow-warm-sm hover:shadow-warm-md transition-shadow flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center space-x-1 text-[#A47750]">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-[#A47750]" />
                  ))}
                </div>
                <p className="text-xs sm:text-sm text-[#352A25]/90 italic leading-relaxed">
                  &quot;When my job relocated to California, I was terrified about leaving my 83-year-old father alone in Pune. Obokash Senior Living gave him friends, medical safety, and loving caregivers. The admin transparency gives our family absolute peace of mind.&quot;
                </p>
              </div>

              <div className="pt-4 border-t border-[#352A25]/10">
                <span className="font-serif font-bold text-sm text-[#352A25] block">
                  Dr. Rajesh Deshmukh
                </span>
                <span className="text-xs text-[#352A25]/60">Son of resident Shri V. K. Deshmukh</span>
              </div>
            </div>

            <div className="p-8 rounded-3xl bg-white border border-[#352A25]/10 space-y-4 shadow-warm-sm hover:shadow-warm-md transition-shadow flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center space-x-1 text-[#A47750]">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-[#A47750]" />
                  ))}
                </div>
                <p className="text-xs sm:text-sm text-[#352A25]/90 italic leading-relaxed">
                  &quot;The staff treats each resident like their own grandparents. My mother&apos;s knee mobility improved drastically within months, and she looks forward to the evening satsang and garden strolls every single day.&quot;
                </p>
              </div>

              <div className="pt-4 border-t border-[#352A25]/10">
                <span className="font-serif font-bold text-sm text-[#352A25] block">
                  Meenakshi Narayanan
                </span>
                <span className="text-xs text-[#352A25]/60">Daughter of resident Smt. Kalyani</span>
              </div>
            </div>

            <div className="p-8 rounded-3xl bg-white border border-[#352A25]/10 space-y-4 shadow-warm-sm hover:shadow-warm-md transition-shadow flex flex-col justify-between md:col-span-2 lg:col-span-1">
              <div className="space-y-3">
                <div className="flex items-center space-x-1 text-[#A47750]">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-[#A47750]" />
                  ))}
                </div>
                <p className="text-xs sm:text-sm text-[#352A25]/90 italic leading-relaxed">
                  &quot;Spotless hygienic rooms, prompt doctor visits, and truly delicious home-style satvik meals. Obokash Senior Living has set a benchmark for premium senior living in India.&quot;
                </p>
              </div>

              <div className="pt-4 border-t border-[#352A25]/10">
                <span className="font-serif font-bold text-sm text-[#352A25] block">
                  Col. (Retd.) S. P. Malhotra
                </span>
                <span className="text-xs text-[#352A25]/60">Family Guardian</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Contact & Admission Inquiry Section */}
      <section id="contact" className="py-20 bg-white border-b border-[#352A25]/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Left Contact Information */}
            <div className="lg:col-span-5 space-y-6">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#78836A]/10 text-[#78836A] border border-[#78836A]/30">
                <span>Admissions Desk</span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#352A25]">
                Register Your Interest
              </h2>

              <p className="text-sm text-[#352A25]/80 leading-relaxed">
                OBOKASH is an evolving vision for senior living, built around dignity, comfort, companionship, and peace of mind. We aspire to create a welcoming environment where seniors can embrace life with independence and belonging, while families find reassurance and trust.
              </p>

              <div className="space-y-4 pt-2 text-sm text-[#352A25]">
                <div className="flex items-start space-x-3.5 p-3.5 rounded-2xl bg-[#F7F2EA] border border-[#352A25]/10">
                  <div className="w-10 h-10 rounded-xl bg-white text-[#78836A] border border-[#352A25]/10 flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5 text-[#78836A]" />
                  </div>
                  <div>
                    <span className="font-bold block">Sanctuary Address</span>
                    <span className="text-xs text-[#352A25]/75 font-medium">
                      📍 8769, SH 1, Kulpi, Chak Ramnath, West Bengal – 743351.
                    </span>
                  </div>
                </div>

                <div className="flex items-start space-x-3.5 p-3.5 rounded-2xl bg-[#F7F2EA] border border-[#352A25]/10">
                  <div className="w-10 h-10 rounded-xl bg-white text-[#A47750] border border-[#352A25]/10 flex items-center justify-center shrink-0">
                    <PhoneCall className="w-5 h-5 text-[#A47750]" />
                  </div>
                  <div>
                    <span className="font-bold block">Official Query & Admissions Line</span>
                    <a href="tel:+917044163518" className="text-sm font-mono font-bold text-[#352A25] hover:text-[#A47750] hover:underline block">
                      +91 70441 63518
                    </a>
                  </div>
                </div>

                <div className="flex items-start space-x-3.5 p-3.5 rounded-2xl bg-[#F7F2EA] border border-[#352A25]/10">
                  <div className="w-10 h-10 rounded-xl bg-white text-[#78836A] border border-[#352A25]/10 flex items-center justify-center shrink-0">
                    <Clock className="w-5 h-5 text-[#78836A]" />
                  </div>
                  <div>
                    <span className="font-bold block">Visiting Hours</span>
                    <span className="text-xs text-[#352A25]/75">
                      10:00 AM – 1:00 PM & 4:00 PM – 6:30 PM (Daily)
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Inquiry Form */}
            <div className="lg:col-span-7">
              <div className="bg-[#F7F2EA] p-6 sm:p-10 rounded-3xl border border-[#352A25]/15 shadow-warm-lg">
                <h3 className="font-serif font-bold text-xl text-[#352A25] mb-1">
                  Register Your Interest
                </h3>
                <p className="text-xs text-[#352A25]/70 mb-6">
                  Please share a few details and our care coordinator will reach out promptly to answer your questions.
                </p>

                {submitSuccess && (
                  <div className="mb-6 p-4 rounded-xl bg-white border border-[#78836A]/40 flex items-start space-x-3 text-[#352A25]">
                    <CheckCircle2 className="w-5 h-5 text-[#78836A] shrink-0 mt-0.5" />
                    <div className="text-xs leading-relaxed">
                      <strong className="block font-semibold text-[#78836A]">Thank you! Your interest has been registered.</strong>
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
                      <label className="block font-semibold text-[#352A25] mb-1">
                        Your Full Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        required
                        placeholder="e.g. Priya Sharma"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full px-3.5 py-2.5 border border-[#352A25]/20 rounded-xl focus:ring-2 focus:ring-[#A47750] bg-white text-[#352A25]"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-[#352A25] mb-1">
                        Contact Phone Number *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        required
                        placeholder="+91 98765 00000"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full px-3.5 py-2.5 border border-[#352A25]/20 rounded-xl focus:ring-2 focus:ring-[#A47750] bg-white font-mono text-[#352A25]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-semibold text-[#352A25] mb-1">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        required
                        placeholder="priya@example.com"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-3.5 py-2.5 border border-[#352A25]/20 rounded-xl focus:ring-2 focus:ring-[#A47750] bg-white text-[#352A25]"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-[#352A25] mb-1">
                        Relation to Senior *
                      </label>
                      <select
                        name="relationshipToSenior"
                        value={formData.relationshipToSenior}
                        onChange={handleInputChange}
                        className="w-full px-3.5 py-2.5 border border-[#352A25]/20 rounded-xl focus:ring-2 focus:ring-[#A47750] bg-white text-[#352A25]"
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
                    <label className="block font-semibold text-[#352A25] mb-1">
                      Care Program Required *
                    </label>
                    <select
                      name="careNeeded"
                      value={formData.careNeeded}
                      onChange={handleInputChange}
                      className="w-full px-3.5 py-2.5 border border-[#352A25]/20 rounded-xl focus:ring-2 focus:ring-[#A47750] bg-white text-[#352A25]"
                    >
                      <option value="Assisted Living">Assisted Daily Living (Caregiver Support)</option>
                      <option value="Memory / Dementia Care">Specialized Dementia & Alzheimer&apos;s Care</option>
                      <option value="Post-Surgery / Short Stay">Post-Surgery / Short Stay Recovery</option>
                      <option value="Day Care">Day Care Program</option>
                      <option value="General Retirement">Independent Senior Retirement</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-[#352A25] mb-1">
                      Message / Senior&apos;s Health Conditions *
                    </label>
                    <textarea
                      name="message"
                      rows={4}
                      required
                      placeholder="Please mention any medical conditions, current mobility level, or questions..."
                      value={formData.message}
                      onChange={handleInputChange}
                      className="w-full p-3.5 border border-[#352A25]/20 rounded-xl focus:ring-2 focus:ring-[#A47750] bg-white leading-relaxed text-[#352A25]"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3.5 px-6 rounded-xl font-bold text-sm bg-[#352A25] hover:bg-[#A47750] text-[#F7F2EA] shadow-warm-md hover:scale-[1.01] active:scale-98 transition-all flex items-center justify-center space-x-2 disabled:opacity-50 cursor-pointer"
                  >
                    <Send className="w-4 h-4 text-[#F7F2EA]" />
                    <span>{submitting ? 'Registering Your Interest...' : 'Register Your Interest'}</span>
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 9. Footer (Espresso #352A25) */}
      <footer className="bg-[#352A25] text-[#F7F2EA] pt-16 pb-12 border-t border-[#352A25]">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4 md:col-span-2">
              <div className="flex items-center space-x-3">
                <div className="h-11 px-3 bg-white rounded-xl border border-[#352A25]/15 flex items-center justify-center shadow-sm">
                  <Image
                    src="/images/obokash-logo.png"
                    alt="OBOKASH - SENIOR LIVING Logo"
                    width={130}
                    height={54}
                    className="h-8 w-auto object-contain"
                  />
                </div>
                <div>
                  <span className="font-serif font-bold text-xl text-[#F7F2EA] block leading-tight">OBOKASH</span>
                  <span className="text-[10px] uppercase tracking-wider text-[#A47750] font-semibold">Senior Living</span>
                </div>
              </div>
              <p className="text-xs text-[#A47750] font-serif font-bold">
                A New Chapter of Life, Filled with Peace.
              </p>
              <p className="text-xs text-[#F7F2EA]/90 font-serif italic max-w-md">
                A Haven of Trust, Security, and Unparalleled Peace.
              </p>
              <p className="text-xs text-[#F7F2EA]/80 max-w-md leading-relaxed">
                OBOKASH is an evolving vision for senior living, built around dignity, comfort, companionship, and peace of mind. We aspire to create a welcoming environment where seniors can embrace life with independence and belonging, while families find reassurance and trust.
              </p>
              <p className="text-xs text-[#A47750] font-semibold">
                📍 8769, SH 1, Kulpi, Chak Ramnath, West Bengal – 743351.
              </p>
            </div>

            <div className="space-y-2 text-xs">
              <span className="font-bold text-[#F7F2EA] uppercase tracking-wider block mb-2">
                Quick Navigation
              </span>
              <ul className="space-y-1.5 text-[#F7F2EA]/75">
                <li><a href="#about" className="hover:text-[#A47750] transition-colors">About Obokash</a></li>
                <li><a href="#services" className="hover:text-[#A47750] transition-colors">Care Programs</a></li>
                <li><a href="#facilities" className="hover:text-[#A47750] transition-colors">Living Spaces</a></li>
                <li><a href="#testimonials" className="hover:text-[#A47750] transition-colors">Family Reviews</a></li>
                <li><a href="#contact" className="hover:text-[#A47750] transition-colors">Admissions & Contact</a></li>
              </ul>
            </div>

            <div className="space-y-2 text-xs">
              <span className="font-bold text-[#F7F2EA] uppercase tracking-wider block mb-2">
                Sanctuary Helpline & Tours
              </span>
              <p className="text-[#F7F2EA]/75 leading-relaxed mb-3">
                We welcome family visits, guided sanctuary tours, and doctor consultations every day.
              </p>
              <div className="p-3 bg-[#271E1A] rounded-xl border border-[#A47750]/30 text-[11px] space-y-1">
                <p className="text-[#A47750] font-bold">Helpline & Walk-ins:</p>
                <a href="tel:+917044163518" className="text-[#F7F2EA] hover:text-[#A47750] font-mono font-bold block transition-colors">
                  +91 70441 63518 (Official Query)
                </a>
                <p className="text-[#F7F2EA]/70">Visiting Hours: 10:00 AM – 6:30 PM</p>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-[#F7F2EA]/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#F7F2EA]/60">
            <p>© {new Date().getFullYear()} OBOKASH - SENIOR LIVING. All rights reserved.</p>
            <p className="font-medium text-[#A47750]">A Haven of Trust, Security, and Unparalleled Peace.</p>
          </div>
        </div>
      </footer>

      {/* Timed Visitor Login / Register Modal (Appears after 6-8 seconds) */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-300">
          <div className="relative w-full max-w-md bg-white rounded-3xl p-5 sm:p-7 shadow-2xl border border-[#352A25]/15 max-h-[92vh] overflow-y-auto">
            {/* Close Button */}
            <button
              onClick={() => setShowAuthModal(false)}
              className="absolute top-4 right-4 p-2 text-[#352A25]/50 hover:text-[#352A25] rounded-full hover:bg-black/5 transition-colors"
              aria-label="Close dialog"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="text-center mb-5">
              <div className="h-14 px-4 py-1.5 bg-white rounded-2xl border border-[#352A25]/15 flex items-center justify-center mx-auto shadow-xs mb-2.5 w-fit">
                <Image
                  src="/images/obokash-logo.png"
                  alt="OBOKASH - SENIOR LIVING Logo"
                  width={150}
                  height={62}
                  className="h-9 w-auto object-contain"
                />
              </div>
              <h3 className="font-serif font-bold text-xl sm:text-2xl text-[#352A25]">
                {authAction === 'register' ? 'Join the Obokash Family' : 'Welcome Back to Obokash'}
              </h3>
              <p className="text-xs text-[#352A25]/70 mt-1 max-w-xs mx-auto">
                {authAction === 'register'
                  ? 'Sign up to receive care updates, download admission brochures, or schedule sanctuary visits.'
                  : 'Sign in to access your visitor profile, inquiry responses, and care consultations.'}
              </p>
            </div>

            {authSuccessMsg ? (
              <div className="p-5 rounded-2xl bg-[#78836A]/10 border border-[#78836A]/30 text-[#352A25] text-xs font-semibold text-center space-y-2 animate-in zoom-in-95 duration-200">
                <CheckCircle2 className="w-8 h-8 text-[#78836A] mx-auto" />
                <p className="text-sm font-bold">{authSuccessMsg}</p>
                <p className="text-[11px] text-[#352A25]/70 font-normal">All visitor activity has been recorded in the management system.</p>
              </div>
            ) : (
              <>
                {/* 1. Google One-Click Sign In Button */}
                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  disabled={authLoading}
                  className="w-full flex items-center justify-center gap-3 py-2.5 px-4 rounded-xl border border-[#352A25]/20 bg-white hover:bg-[#FAF6F0] text-xs font-bold text-[#352A25] shadow-2xs hover:shadow-xs transition-all mb-4 disabled:opacity-60 cursor-pointer"
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
                  <div className="w-full border-t border-[#352A25]/10"></div>
                  <span className="bg-white px-3 text-[10px] font-bold text-[#352A25]/50 uppercase tracking-wider absolute">
                    or choose your login method
                  </span>
                </div>

                {/* 2. Tier 1: Action Selector (Sign In vs Register) */}
                <div className="flex bg-[#F7F2EA] p-1 rounded-xl mb-3 text-xs font-bold border border-[#352A25]/10">
                  <button
                    type="button"
                    onClick={() => {
                      setAuthAction('register');
                      setAuthErrorMsg('');
                    }}
                    className={`flex-1 py-1.5 rounded-lg transition-all ${
                      authAction === 'register'
                        ? 'bg-[#352A25] text-[#F7F2EA] shadow-xs'
                        : 'text-[#352A25]/70 hover:text-[#352A25]'
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
                        ? 'bg-[#352A25] text-[#F7F2EA] shadow-xs'
                        : 'text-[#352A25]/70 hover:text-[#352A25]'
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
                        ? 'bg-[#78836A]/10 text-[#78836A] border-[#78836A]/30 font-bold shadow-2xs'
                        : 'bg-white text-[#352A25]/70 border-[#352A25]/15 hover:bg-[#FAF6F0]'
                    }`}
                  >
                    <Mail className="w-3.5 h-3.5 text-[#78836A]" />
                    <span>Email {authAction === 'register' ? 'Register' : 'Login'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setAuthMethod('phone')}
                    className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                      authMethod === 'phone'
                        ? 'bg-[#A47750]/10 text-[#A47750] border-[#A47750]/30 font-bold shadow-2xs'
                        : 'bg-white text-[#352A25]/70 border-[#352A25]/15 hover:bg-[#FAF6F0]'
                    }`}
                  >
                    <Phone className="w-3.5 h-3.5 text-[#A47750]" />
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
                      <label className="block text-[11px] font-bold text-[#352A25] mb-1">
                        Full Name *
                      </label>
                      <div className="relative">
                        <User className="w-4 h-4 text-[#352A25]/40 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          required
                          value={authFormData.name}
                          onChange={(e) => setAuthFormData({ ...authFormData, name: e.target.value })}
                          placeholder="e.g. Priya Sharma"
                          className="w-full pl-9 pr-3 py-2 text-xs border border-[#352A25]/20 rounded-xl bg-[#F7F2EA] text-[#352A25] focus:outline-hidden focus:ring-2 focus:ring-[#A47750]"
                        />
                      </div>
                    </div>
                  )}

                  {/* Email Input (When Email method selected) */}
                  {authMethod === 'email' && (
                    <div>
                      <label className="block text-[11px] font-bold text-[#352A25] mb-1">
                        Email Address *
                      </label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-[#352A25]/40 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="email"
                          required
                          value={authFormData.email}
                          onChange={(e) => setAuthFormData({ ...authFormData, email: e.target.value })}
                          placeholder="priya@example.com"
                          className="w-full pl-9 pr-3 py-2 text-xs border border-[#352A25]/20 rounded-xl bg-[#F7F2EA] text-[#352A25] focus:outline-hidden focus:ring-2 focus:ring-[#A47750]"
                        />
                      </div>
                    </div>
                  )}

                  {/* Phone Input (When Phone method selected OR optional in Email register) */}
                  {authMethod === 'phone' ? (
                    <div>
                      <label className="block text-[11px] font-bold text-[#352A25] mb-1">
                        Phone Number *
                      </label>
                      <div className="relative">
                        <Phone className="w-4 h-4 text-[#352A25]/40 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="tel"
                          required
                          value={authFormData.phone}
                          onChange={(e) => setAuthFormData({ ...authFormData, phone: e.target.value })}
                          placeholder="+91 98765 43210"
                          className="w-full pl-9 pr-3 py-2 text-xs border border-[#352A25]/20 rounded-xl bg-[#F7F2EA] font-mono text-[#352A25] focus:outline-hidden focus:ring-2 focus:ring-[#A47750]"
                        />
                      </div>
                    </div>
                  ) : authAction === 'register' ? (
                    <div>
                      <label className="block text-[11px] font-bold text-[#352A25] mb-1">
                        Phone Number (Optional)
                      </label>
                      <div className="relative">
                        <Phone className="w-4 h-4 text-[#352A25]/40 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="tel"
                          value={authFormData.phone}
                          onChange={(e) => setAuthFormData({ ...authFormData, phone: e.target.value })}
                          placeholder="+91 98765 43210"
                          className="w-full pl-9 pr-3 py-2 text-xs border border-[#352A25]/20 rounded-xl bg-[#F7F2EA] font-mono text-[#352A25] focus:outline-hidden focus:ring-2 focus:ring-[#A47750]"
                        />
                      </div>
                    </div>
                  ) : null}

                  {/* Password Input */}
                  <div>
                    <label className="block text-[11px] font-bold text-[#352A25] mb-1">
                      {authAction === 'register' ? 'Create Password *' : 'Account Password *'}
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-[#352A25]/40 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="password"
                        required
                        value={authFormData.password}
                        onChange={(e) => setAuthFormData({ ...authFormData, password: e.target.value })}
                        placeholder="••••••••••••"
                        className="w-full pl-9 pr-3 py-2 text-xs border border-[#352A25]/20 rounded-xl bg-[#F7F2EA] text-[#352A25] focus:outline-hidden focus:ring-2 focus:ring-[#A47750]"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={authLoading}
                    className="w-full py-2.5 px-4 rounded-xl font-bold text-xs bg-[#352A25] hover:bg-[#A47750] text-[#F7F2EA] shadow-warm-sm transition-all disabled:opacity-50 mt-2 cursor-pointer"
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
                    className="text-[11px] text-[#352A25]/50 hover:text-[#352A25] underline cursor-pointer"
                  >
                    Continue browsing as guest
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Standalone Google Account Selector Modal */}
      {googlePromptOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full max-w-sm bg-white rounded-3xl p-6 sm:p-7 shadow-2xl border border-[#352A25]/15 text-center space-y-4 max-h-[92vh] overflow-y-auto">
            {/* Close button */}
            <button
              type="button"
              onClick={() => setGooglePromptOpen(false)}
              className="absolute top-4 right-4 p-1.5 text-[#352A25]/40 hover:text-[#352A25] rounded-full hover:bg-black/5 transition-colors cursor-pointer"
              aria-label="Close Google sign-in"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Google Icon */}
            <div className="w-12 h-12 rounded-2xl bg-white border border-[#352A25]/15 shadow-xs flex items-center justify-center mx-auto">
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
              <h4 className="font-serif font-bold text-lg text-[#352A25]">Sign in with Google</h4>
              <p className="text-xs text-[#352A25]/70 mt-0.5">
                to continue to <strong className="text-[#352A25]">Obokash Senior Living</strong>
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
              className="p-3 rounded-2xl border border-[#352A25]/15 hover:border-[#A47750] bg-[#F7F2EA] text-left transition-all cursor-pointer flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#352A25] text-[#F7F2EA] font-bold text-xs flex items-center justify-center shadow-2xs">
                  {(googleAccount.name || 'V').charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="text-xs font-bold text-[#352A25] group-hover:text-[#A47750]">
                    {googleAccount.name || 'Sanctuary Visitor'}
                  </div>
                  <div className="text-[11px] text-[#352A25]/60">
                    {googleAccount.email || 'visitor.google@gmail.com'}
                  </div>
                </div>
              </div>
              <span className="text-[10px] text-[#78836A] font-bold bg-white px-2 py-1 rounded-lg border border-[#78836A]/30 shadow-2xs">
                One-Click ✓
              </span>
            </div>

            <div className="relative flex items-center justify-center my-2">
              <div className="w-full border-t border-[#352A25]/10" />
              <span className="bg-white px-2 text-[10px] font-bold text-[#352A25]/50 uppercase tracking-wider absolute">
                or use custom Google account
              </span>
            </div>

            {/* Custom Account Inputs */}
            <div className="space-y-2 text-left text-xs">
              <div>
                <label className="block text-[11px] font-bold text-[#352A25] mb-1">Your Full Name</label>
                <input
                  type="text"
                  placeholder="e.g. Ramesh Chandra Sharma"
                  value={googleAccount.name}
                  onChange={(e) => setGoogleAccount({ ...googleAccount, name: e.target.value })}
                  className="w-full px-3 py-2 border border-[#352A25]/20 rounded-xl text-xs bg-[#F7F2EA] text-[#352A25] focus:outline-hidden focus:ring-2 focus:ring-[#A47750]"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-[#352A25] mb-1">Google Email Address</label>
                <input
                  type="email"
                  placeholder="e.g. ramesh.sharma@gmail.com"
                  value={googleAccount.email}
                  onChange={(e) => setGoogleAccount({ ...googleAccount, email: e.target.value })}
                  className="w-full px-3 py-2 border border-[#352A25]/20 rounded-xl text-xs bg-[#F7F2EA] text-[#352A25] focus:outline-hidden focus:ring-2 focus:ring-[#A47750]"
                />
              </div>
            </div>

            <div className="pt-2 flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleConfirmGoogleUser(googleAccount.name, googleAccount.email)}
                disabled={authLoading}
                className="flex-1 py-2.5 px-4 rounded-xl bg-[#352A25] hover:bg-[#A47750] text-[#F7F2EA] font-bold text-xs shadow-xs transition-colors cursor-pointer disabled:opacity-50"
              >
                {authLoading ? 'Signing in...' : 'Sign In with This Account'}
              </button>
              <button
                type="button"
                onClick={() => setGooglePromptOpen(false)}
                className="py-2.5 px-3 rounded-xl border border-[#352A25]/20 hover:bg-[#FAF6F0] text-[#352A25] text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Timed Cookie Consent Banner */}
      {showCookieBanner && (
        <aside
          role="region"
          aria-label="Cookie consent banner"
          className="fixed bottom-5 inset-x-4 sm:inset-x-auto sm:left-6 sm:right-auto sm:max-w-md z-50 bg-[#352A25] text-[#F7F2EA] p-5 rounded-3xl border border-[#A47750]/40 shadow-2xl animate-in slide-in-from-bottom duration-500"
        >
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-[#A47750]/20 text-[#A47750] flex items-center justify-center shrink-0 border border-[#A47750]/30">
              <ShieldCheck className="w-5 h-5 text-[#A47750]" />
            </div>
            <div className="space-y-1.5 flex-1">
              <h4 className="font-serif font-bold text-sm text-[#F7F2EA]">
                We Value Your Privacy & Comfort
              </h4>
              <p className="text-xs text-[#F7F2EA]/80 leading-relaxed">
                We use cookies to enhance your sanctuary browsing experience, remember care preferences, and secure user sessions. After accepting, you can freely use all website features.
              </p>
              <div className="pt-2 flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleAcceptCookies}
                  className="px-4 py-2 rounded-xl bg-[#A47750] hover:bg-[#8E623E] text-white font-bold text-xs shadow-sm transition-all cursor-pointer"
                >
                  Accept All Cookies
                </button>
                <button
                  type="button"
                  onClick={() => setShowCookieBanner(false)}
                  className="px-3 py-2 text-xs text-[#F7F2EA]/70 hover:text-white font-medium transition-colors cursor-pointer"
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
        className="fixed bottom-5 right-5 z-30 hidden sm:inline-flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-[#352A25] hover:bg-[#A47750] text-[#F7F2EA] font-bold text-xs shadow-warm-lg border border-[#A47750]/40 hover:scale-105 active:scale-95 transition-all backdrop-blur-md group cursor-pointer"
      >
        <span className="w-2.5 h-2.5 rounded-full bg-[#78836A] animate-ping" />
        <span className="text-[#A47750]">Discover OBOKASH</span>
        <span>• Register Your Interest</span>
        <ArrowRight className="w-3.5 h-3.5 text-[#A47750] group-hover:translate-x-1 transition" />
      </button>

      {/* Official Intro Poster Lightbox Modal */}
      {showPosterModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setShowPosterModal(false)}
        >
          <div
            className="relative max-w-xl w-full bg-[#F7F2EA] rounded-3xl overflow-hidden shadow-2xl border border-[#352A25]/20 p-4 sm:p-6 animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#352A25]/15 mb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#A47750] block">
                  Official Vision & Campus Poster
                </span>
                <h3 className="font-serif font-bold text-base sm:text-lg text-[#352A25]">
                  OBOKASH Senior Living
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowPosterModal(false)}
                className="p-2 rounded-xl text-[#352A25] hover:bg-[#352A25]/10 transition-colors cursor-pointer"
                aria-label="Close poster view"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="relative aspect-square w-full rounded-2xl overflow-hidden border border-[#352A25]/15 bg-white shadow-inner">
              <Image
                src="/images/obokash-hero-poster.jpg"
                alt="OBOKASH Senior Living Official Vision Poster - A New Chapter of Life, Filled with Peace."
                fill
                className="object-contain"
                priority
              />
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-4 pt-3 border-t border-[#352A25]/15 text-xs">
              <div className="text-center sm:text-left">
                <span className="font-bold text-[#352A25] block">📍 8769, SH 1, Kulpi, Chak Ramnath, West Bengal – 743351</span>
                <span className="text-[11px] text-[#352A25]/70">A Haven of Trust, Security, and Unparalleled Peace.</span>
              </div>
              <a
                href="#contact"
                onClick={() => setShowPosterModal(false)}
                className="px-4 py-2 rounded-xl font-bold bg-[#352A25] text-[#F7F2EA] hover:bg-[#A47750] transition-colors shrink-0"
              >
                Register Your Interest
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
