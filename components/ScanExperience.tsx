'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ChevronRight,
  ChevronLeft,
  X,
  Sparkles,
  Heart,
  Info,
  Bell,
  ArrowRight,
  Check,
  Loader2,
  Star,
  Users,
  Shield,
  Clock,
  QrCode,
  Flame,
  Award,
  Zap,
  Ticket,
  Calendar,
  Phone,
  Mail,
  User,
  HeartHandshake,
  CheckCircle2,
} from 'lucide-react';

const QUESTIONS = [
  'When did you last sit with your parents without checking your watch?',
  'Does a quiet house feel too heavy for them when you leave?',
  'Are they getting the medical security and laughter they deserve?',
  'What if ageing felt like a celebration, surrounded by dignity & peers?',
];

const SLIDES = [
  {
    src: '/images/obokash-hero-poster.jpg',
    tag: 'Official Sanctuary Vision',
    headline: 'A New Chapter of Life, Filled with Peace.',
    body: 'OBOKASH is being envisioned as a warm and welcoming space for seniors — where they can live with dignity, companionship and comfort, while families find peace of mind.',
    badge: 'Kulpi, West Bengal',
  },
  {
    src: '/images/about-garden-walk.jpg',
    tag: 'Botanical Sanctuary',
    headline: 'Where every sunrise brings serenity, fresh air, and companionship.',
    body: 'Safe anti-skid botanical walking paths, morning yoga, and gentle walks supported by compassionate caregivers. No elder walks alone.',
    badge: '100% Anti-Skid Pathways',
  },
  {
    src: '/images/hero-senior-living.jpg',
    tag: 'Warmth & Reverence',
    headline: 'A dignified sanctuary where your parents feel celebrated, not secluded.',
    body: 'Round-the-clock trained geriatric nurses, personalized medical attention, and deeply human reverence in every interaction.',
    badge: '24/7 ICU & Doctor Backup',
  },
  {
    src: '/images/senior-physio-wellness.jpg',
    tag: 'Daily Health & Movement',
    headline: 'Restoring mobility, strength, and the simple joy of daily movement.',
    body: 'Dedicated geriatric physiotherapists, daily chair yoga, and cognitive wellness games ensure every resident stays agile and active.',
    badge: 'Daily Geriatric Therapy',
  },
  {
    src: '/images/senior-room-suite.jpg',
    tag: 'Deluxe Private Suites',
    headline: 'Private sanctuaries thoughtfully designed for comfort and safety.',
    body: 'Motorized orthopedic beds, in-room emergency response systems, central climate control, and serene courtyard views.',
    badge: 'Emergency Response In Every Room',
  },
  {
    src: '/images/senior-dining-hall.jpg',
    tag: 'Pure Satvik Dining',
    headline: 'Doctor-curated nutritious vegetarian meals, shared with friends.',
    body: 'Hygiene-certified pure satvik kitchen crafting wholesome, flavourful meals tailored to diabetic, renal, and dietary preferences.',
    badge: 'Doctor-Curated Satvik Kitchen',
  },
];

// Pre-seeded early applicants roster to showcase social proof
const INITIAL_APPLICANTS = [
  { id: 'OB-EA-001', name: 'Dr. Ramesh Chandra Verma', city: 'South Delhi', time: '12 mins ago', spot: '#01 Early Applicant' },
  { id: 'OB-EA-002', name: 'Sunita & Ashok Kapoor', city: 'Gurugram', time: '34 mins ago', spot: '#02 Early Applicant' },
  { id: 'OB-EA-003', name: 'Col. Virendra Saxena (Retd.)', city: 'Noida', time: '1 hour ago', spot: '#03 Early Applicant' },
  { id: 'OB-EA-004', name: 'Meenakshi Sundaram', city: 'Bengaluru', time: '2 hours ago', spot: '#04 Early Applicant' },
  { id: 'OB-EA-005', name: 'Rajesh & Priti Patel', city: 'Ahmedabad', time: '3 hours ago', spot: '#05 Early Applicant' },
  { id: 'OB-EA-006', name: 'Ananya Sengupta', city: 'Kolkata', time: '4 hours ago', spot: '#06 Early Applicant' },
];

interface ScanExperienceProps {
  onEnterMainWebsite?: () => void;
}

export default function ScanExperience({ onEnterMainWebsite }: ScanExperienceProps = {}) {
  const router = useRouter();

  const handleExitToMain = () => {
    if (onEnterMainWebsite) {
      onEnterMainWebsite();
    } else {
      router.push('/');
    }
  };

  // Navigation state:
  // 'scan' -> 'step1_questions' -> 'step1_loading' -> 'step2_slides' -> 'step4_list' -> 'step5_form' -> 'step5_success'
  const [phase, setPhase] = useState<
    | 'scan'
    | 'step1_questions'
    | 'step1_loading'
    | 'step2_slides'
    | 'step4_list'
    | 'step5_form'
    | 'step5_success'
  >('scan');

  // Scanner state
  const [scanProgress, setScanProgress] = useState(0);
  const [scanComplete, setScanComplete] = useState(false);

  // Step 1: Questions state
  const [qIndex, setQIndex] = useState(0);
  const [qVisible, setQVisible] = useState(true);
  const [knowMoreVisible, setKnowMoreVisible] = useState(false);

  // Step 1: Loading state
  const [loadProgress, setLoadProgress] = useState(0);

  // Step 2: Slideshow state
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slideFade, setSlideFade] = useState(true);
  const [autoPlay, setAutoPlay] = useState(true);

  // Step 4: Early Applicants List state
  const [spotsLeft] = useState(47);

  // Step 5: Sign Up Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    reason: 'parents',
    notes: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [issuedApplication, setIssuedApplication] = useState<{ applicationId: string; name: string } | null>(null);

  // -------------------------------------------------------------
  // SCAN PHASE: Auto-run scanner animation
  // -------------------------------------------------------------
  useEffect(() => {
    if (phase !== 'scan') return;
    const interval = setInterval(() => {
      setScanProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setScanComplete(true);
          setTimeout(() => {
            setPhase('step1_questions');
          }, 1000);
          return 100;
        }
        return prev + 12;
      });
    }, 120);
    return () => clearInterval(interval);
  }, [phase]);

  // -------------------------------------------------------------
  // STEP 1: Questions cycling & Know More popup button
  // -------------------------------------------------------------
  useEffect(() => {
    if (phase !== 'step1_questions') return;

    // "Know more" icon pops up after 1.8 seconds
    const btnTimer = setTimeout(() => {
      setKnowMoreVisible(true);
    }, 1800);

    // Questions cycle smoothly
    const qInterval = setInterval(() => {
      setQVisible(false);
      setTimeout(() => {
        setQIndex((prev) => (prev + 1) % QUESTIONS.length);
        setQVisible(true);
      }, 500);
    }, 3800);

    return () => {
      clearTimeout(btnTimer);
      clearInterval(qInterval);
    };
  }, [phase]);

  // -------------------------------------------------------------
  // STEP 1 LOADING: Logo comes up with loading progress
  // -------------------------------------------------------------
  useEffect(() => {
    if (phase !== 'step1_loading') return;
    setLoadProgress(0);

    const loadInterval = setInterval(() => {
      setLoadProgress((prev) => {
        const next = prev + Math.floor(Math.random() * 9) + 4;
        if (next >= 100) {
          clearInterval(loadInterval);
          setTimeout(() => {
            setPhase('step2_slides');
          }, 450);
          return 100;
        }
        return next;
      });
    }, 70);

    return () => clearInterval(loadInterval);
  }, [phase]);

  // -------------------------------------------------------------
  // STEP 2: Slideshow auto-advance & timing
  // -------------------------------------------------------------
  useEffect(() => {
    if (phase !== 'step2_slides' || !autoPlay) return;

    const slideTimer = setTimeout(() => {
      if (currentSlide < SLIDES.length - 1) {
        setSlideFade(false);
        setTimeout(() => {
          setCurrentSlide((prev) => prev + 1);
          setSlideFade(true);
        }, 400);
      } else {
        // After final slide, proceed directly to Early Applicants List
        setPhase('step4_list');
      }
    }, 4500);

    return () => clearTimeout(slideTimer);
  }, [phase, currentSlide, autoPlay]);

  // -------------------------------------------------------------
  // FORM SUBMISSION HANDLER (Step 4)
  // -------------------------------------------------------------
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!formData.name.trim() || !formData.email.trim()) {
      setFormError('Please provide your name and email to submit your early application.');
      return;
    }

    setSubmitting(true);
    const appNumber = `OB-EA-${Math.floor(1000 + Math.random() * 9000)}`;

    try {
      // 1. Save user to central registered users registry (Admin Panel)
      await fetch('/api/registered-users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim() || '',
          password: '',
          authProvider: 'early-applicant',
          action: 'register',
        }),
      });

      // 2. Also record an inquiry entry with their requirements
      if (formData.notes || formData.phone) {
        await fetch('/api/inquiries', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: formData.name.trim(),
            email: formData.email.trim(),
            phone: formData.phone.trim() || '',
            subject: `Early Application Received (${formData.reason})`,
            message: formData.notes
              ? `[Reason: ${formData.reason}] Notes: ${formData.notes}`
              : `Submitted early application ${appNumber} for ${formData.reason}.`,
          }),
        }).catch(() => {});
      }

      setIssuedApplication({ applicationId: appNumber, name: formData.name.trim() });
      setPhase('step5_success');
    } catch {
      setFormError('Submission failed. Please check your network and try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F2EA] text-[#352A25] flex flex-col justify-between selection:bg-[#78836A]/20 selection:text-[#352A25] font-sans relative overflow-x-hidden">
      {/* Ambient background glow elements in Warm Clay & Sage */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#78836A]/10 rounded-full blur-[100px]" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-[#A47750]/10 rounded-full blur-[100px]" />
      </div>

      {/* Top micro-navigation */}
      <header className="relative z-20 w-full max-w-6xl mx-auto px-4 py-4 flex items-center justify-between border-b border-[#352A25]/15">
        <div className="flex items-center gap-2.5">
          <div className="h-10 px-2.5 rounded-xl overflow-hidden border border-[#352A25]/15 relative shadow-xs bg-white flex items-center justify-center">
            <Image
              src="/images/obokash-logo.png"
              alt="OBOKASH - SENIOR LIVING Logo"
              width={120}
              height={50}
              className="h-8 w-auto object-contain"
              priority
            />
          </div>
          <div>
            <span className="font-serif font-bold text-base tracking-wide text-[#352A25] block leading-none">
              OBOKASH
            </span>
            <span className="text-[10px] uppercase tracking-widest text-[#A47750] font-semibold">
              Senior Living
            </span>
          </div>
        </div>

        {/* Phase step indicator */}
        <div className="flex items-center gap-1.5 text-xs text-[#352A25] bg-white px-3 py-1.5 rounded-full border border-[#78836A]/30 shadow-xs">
          <span
            className={`w-2 h-2 rounded-full ${
              phase === 'scan'
                ? 'bg-[#A47750] animate-ping'
                : 'bg-[#78836A]'
            }`}
          />
          <span className="font-semibold text-[11px] sm:text-xs">
            {phase === 'scan' && 'Scanning Code...'}
            {phase === 'step1_questions' && 'Step 1: Perspectives'}
            {phase === 'step1_loading' && 'Step 1: Loading Sanctuary'}
            {phase === 'step2_slides' && 'Step 2: Sanctuary Experience'}
            {phase === 'step4_list' && 'Step 3: Early Applicants List'}
            {phase === 'step5_form' && 'Step 4: Be an Early Applicant'}
            {phase === 'step5_success' && 'Application Confirmed ✓'}
          </span>
        </div>
      </header>

      {/* Main interactive viewport container */}
      <main className="relative z-10 flex-1 flex items-center justify-center p-4 sm:p-6 w-full max-w-5xl mx-auto">
        {/* ========================================================================= */}
        {/* PHASE 0: SCAN IN PROGRESS / JUST COMPLETED                                */}
        {/* ========================================================================= */}
        {phase === 'scan' && (
          <div className="w-full max-w-md text-center py-12 px-6 bg-white border border-[#352A25]/15 rounded-3xl shadow-warm-lg relative overflow-hidden">
            {/* Scanner laser animation */}
            <div className="relative w-48 h-48 mx-auto mb-8 bg-[#F7F2EA] rounded-2xl border-2 border-[#352A25]/20 p-4 flex items-center justify-center overflow-hidden shadow-inner">
              <QrCode className="w-36 h-36 text-[#352A25]/75" />

              {/* Laser line moving vertically */}
              <div
                className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#78836A] to-transparent shadow-[0_0_12px_#78836A] transition-all duration-100 ease-linear"
                style={{ top: `${scanProgress}%` }}
              />

              {/* Viewfinder corner brackets in Warm Clay */}
              <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-[#A47750]" />
              <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-[#A47750]" />
              <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-[#A47750]" />
              <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-[#A47750]" />
            </div>

            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#78836A]/10 border border-[#78836A]/30 text-[#78836A] text-xs font-semibold">
                {scanComplete ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#78836A]" />
                    <span>Scan Verified & Profile Loaded</span>
                  </>
                ) : (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-[#A47750]" />
                    <span>Reading Obokash Smart QR...</span>
                  </>
                )}
              </div>

              <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#352A25]">
                {scanComplete
                  ? 'Welcome to OBOKASH - SENIOR LIVING'
                  : 'Scanning Sanctuary Beacon...'}
              </h2>
              <p className="text-xs sm:text-sm text-[#352A25]/80 max-w-sm mx-auto">
                Opening your personalized discovery journey. Please hold for a
                moment.
              </p>

              {/* Skip scan button */}
              <div className="pt-4">
                <button
                  onClick={() => setPhase('step1_questions')}
                  className="text-xs text-[#A47750] hover:text-[#8E623E] font-medium underline underline-offset-4 cursor-pointer"
                >
                  Scan done? Proceed directly →
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 1: "Some Questions Changes Perspectives" STAYS + KNOW MORE ICON POPS UP */}
        {/* ========================================================================= */}
        {phase === 'step1_questions' && (
          <div className="w-full max-w-3xl text-center py-12 px-4 sm:px-8 relative">
            {/* Tagline that STAYS prominently */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#A47750]/10 border border-[#A47750]/30 text-[#A47750] text-xs font-bold uppercase tracking-widest mb-8 shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-[#A47750]" />
              <span>Some Questions Changes Perspectives</span>
            </div>

            {/* Big quote mark */}
            <div className="text-[#78836A]/20 font-serif text-8xl leading-none select-none mb-2">
              &ldquo;
            </div>

            {/* Rotating philosophical question */}
            <div className="min-h-[140px] flex items-center justify-center">
              <p
                className={`text-2xl sm:text-4xl md:text-5xl font-serif font-light text-[#352A25] leading-snug tracking-tight max-w-2xl mx-auto transition-all duration-500 ${
                  qVisible
                    ? 'opacity-100 translate-y-0 scale-100'
                    : 'opacity-0 translate-y-4 scale-95'
                }`}
              >
                {QUESTIONS[qIndex]}
              </p>
            </div>

            {/* Subtle question cycle indicators */}
            <div className="flex justify-center items-center gap-2 mt-8 mb-10">
              {QUESTIONS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setQIndex(i)}
                  className={`h-1.5 rounded-full transition-all duration-500 ${
                    i === qIndex
                      ? 'w-8 bg-[#A47750] shadow-xs'
                      : 'w-2 bg-[#352A25]/20 hover:bg-[#352A25]/40'
                  }`}
                  aria-label={`Go to question ${i + 1}`}
                />
              ))}
            </div>

            {/* THE "KNOW MORE" ICON / BUTTON THAT POPS UP */}
            <div
              className={`transition-all duration-700 transform ${
                knowMoreVisible
                  ? 'opacity-100 translate-y-0 scale-100'
                  : 'opacity-0 translate-y-8 scale-75 pointer-events-none'
              }`}
            >
              <button
                id="know-more-trigger-btn"
                onClick={() => setPhase('step1_loading')}
                className="group relative inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-[#352A25] hover:bg-[#271E1A] text-[#F7F2EA] font-bold text-base sm:text-lg shadow-warm-lg hover:scale-105 active:scale-95 transition cursor-pointer border border-[#352A25]"
              >
                {/* Ping glow ring around button */}
                <span className="absolute -inset-1 rounded-2xl bg-[#A47750]/20 blur-sm group-hover:bg-[#A47750]/40 transition" />

                <div className="relative w-7 h-7 rounded-lg bg-[#A47750] text-white flex items-center justify-center">
                  <Info className="w-4 h-4" />
                </div>
                <span className="relative">Know More</span>
                <ChevronRight className="relative w-5 h-5 text-[#A47750] group-hover:translate-x-1 transition" />
              </button>

              <p className="text-xs text-[#352A25]/70 mt-3 font-medium">
                Tap above to uncover the sanctuary story
              </p>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 1 (SUB-PART): PEOPLE CLICK ON IT -> THE LOGO COMES UP + LOADING...    */}
        {/* ========================================================================= */}
        {phase === 'step1_loading' && (
          <div className="w-full max-w-md text-center py-16 px-6 bg-white border border-[#352A25]/15 rounded-3xl shadow-warm-lg relative">
            {/* The Logo zooms in */}
            <div className="relative w-72 sm:w-80 h-32 mx-auto mb-6 rounded-2xl overflow-hidden border-2 border-[#A47750]/50 shadow-md bg-white animate-in zoom-in-75 duration-700 flex items-center justify-center p-3">
              <Image
                src="/images/obokash-logo.png"
                alt="OBOKASH - SENIOR LIVING Logo"
                fill
                className="object-contain p-2"
                priority
              />
            </div>

            <span className="text-[11px] font-bold tracking-widest uppercase text-[#A47750] block mb-1">
              OBOKASH Senior Living
            </span>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#352A25] tracking-wide mb-1">
              A New Chapter of Life, Filled with Peace.
            </h1>
            <p className="text-xs sm:text-sm text-[#A47750] font-medium italic max-w-sm mx-auto mb-2 leading-relaxed font-serif">
              A Haven of Trust, Security, and Unparalleled Peace.
            </p>
            <p className="text-[11px] text-[#352A25]/70 max-w-md mx-auto mb-6">
              📍 8769, SH 1, Kulpi, Chak Ramnath, West Bengal – 743351.
            </p>

            {/* Loading progress bar */}
            <div className="w-full max-w-xs mx-auto space-y-2">
              <div className="flex justify-between text-xs text-[#352A25]/70 font-medium">
                <span>Loading Sanctuary Profile...</span>
                <span className="font-mono text-[#A47750] font-bold">{loadProgress}%</span>
              </div>
              <div className="h-2 w-full bg-[#F7F2EA] rounded-full overflow-hidden border border-[#352A25]/15">
                <div
                  className="h-full bg-gradient-to-r from-[#78836A] via-[#A47750] to-[#352A25] rounded-full transition-all duration-150"
                  style={{ width: `${loadProgress}%` }}
                />
              </div>
            </div>

            <div className="flex justify-center gap-1.5 mt-6">
              <span className="w-2 h-2 rounded-full bg-[#78836A] animate-bounce" />
              <span className="w-2 h-2 rounded-full bg-[#A47750] animate-bounce [animation-delay:0.2s]" />
              <span className="w-2 h-2 rounded-full bg-[#352A25] animate-bounce [animation-delay:0.4s]" />
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 2: SMALL PHOTO SLIDESHOW + TEXTUAL INFORMATION                       */}
        {/* ========================================================================= */}
        {phase === 'step2_slides' && (
          <div className="w-full max-w-4xl bg-white border border-[#352A25]/15 rounded-3xl overflow-hidden shadow-warm-lg">
            <div className="grid grid-cols-1 md:grid-cols-12 min-h-[460px]">
              {/* Photo Slideshow Column (7 cols on desktop) */}
              <div className="md:col-span-7 relative min-h-[260px] sm:min-h-[340px] md:min-h-full overflow-hidden bg-stone-900">
                {SLIDES.map((s, idx) => (
                  <div
                    key={idx}
                    className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                      idx === currentSlide && slideFade
                        ? 'opacity-100 z-10'
                        : 'opacity-0 z-0 pointer-events-none'
                    }`}
                  >
                    <Image
                      src={s.src}
                      alt={s.headline}
                      fill
                      className={
                        s.src === '/images/obokash-hero-poster.jpg'
                          ? 'object-contain bg-[#2A211D]'
                          : 'object-cover'
                      }
                      priority={idx === 0}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#352A25]/80 via-transparent to-transparent" />
                  </div>
                ))}

                {/* Tag pill atop image */}
                <div className="absolute top-4 left-4 z-20">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#A47750] text-white shadow-md">
                    {SLIDES[currentSlide].tag}
                  </span>
                </div>

                {/* Badge at bottom of image */}
                <div className="absolute bottom-4 left-4 right-4 z-20 flex items-center justify-between">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#352A25]/90 backdrop-blur-md text-[11px] font-semibold text-[#F7F2EA] border border-[#352A25]/30">
                    <Shield className="w-3.5 h-3.5 text-[#78836A]" />
                    <span>{SLIDES[currentSlide].badge}</span>
                  </div>

                  <span className="text-xs font-mono font-bold bg-[#352A25]/90 px-2.5 py-1 rounded-md text-[#F7F2EA]">
                    0{currentSlide + 1} / 0{SLIDES.length}
                  </span>
                </div>
              </div>

              {/* Textual Information Column (5 cols on desktop) */}
              <div className="md:col-span-5 p-6 sm:p-8 flex flex-col justify-between bg-[#F7F2EA] border-t md:border-t-0 md:border-l border-[#352A25]/10">
                <div>
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#A47750] mb-2">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Sanctuary Tour</span>
                  </div>

                  <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#352A25] leading-snug mb-3">
                    {SLIDES[currentSlide].headline}
                  </h3>

                  <p className="text-xs sm:text-sm text-[#352A25]/85 leading-relaxed">
                    {SLIDES[currentSlide].body}
                  </p>

                  {/* Highlights list */}
                  <div className="mt-5 space-y-2 pt-4 border-t border-[#352A25]/10">
                    <div className="flex items-center gap-2 text-xs text-[#352A25]/85">
                      <Check className="w-3.5 h-3.5 text-[#78836A] shrink-0" />
                      <span>Dedicated geriatric personal companion</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-[#352A25]/85">
                      <Check className="w-3.5 h-3.5 text-[#78836A] shrink-0" />
                      <span>Regular family video calls & medical logs</span>
                    </div>
                  </div>
                </div>

                {/* Slideshow controls */}
                <div className="pt-6 mt-4 border-t border-[#352A25]/10">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex gap-1.5">
                      {SLIDES.map((_, i) => (
                        <button
                          key={i}
                          onClick={() => {
                            setAutoPlay(false);
                            setCurrentSlide(i);
                          }}
                          className={`h-1.5 rounded-full transition-all ${
                            i === currentSlide
                              ? 'w-6 bg-[#A47750]'
                              : 'w-2 bg-[#352A25]/20'
                          }`}
                          aria-label={`Slide ${i + 1}`}
                        />
                      ))}
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setAutoPlay(false);
                          setCurrentSlide((prev) =>
                            prev > 0 ? prev - 1 : SLIDES.length - 1
                          );
                        }}
                        className="p-2 rounded-xl bg-white hover:bg-[#FAF6F0] text-[#352A25] border border-[#352A25]/20 transition"
                        aria-label="Previous Slide"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>

                      {currentSlide < SLIDES.length - 1 ? (
                        <button
                          onClick={() => {
                            setAutoPlay(false);
                            setCurrentSlide((prev) => prev + 1);
                          }}
                          className="px-4 py-2 rounded-xl bg-[#352A25] hover:bg-[#271E1A] text-[#F7F2EA] text-xs font-semibold flex items-center gap-1.5 transition"
                        >
                          Next <ChevronRight className="w-4 h-4" />
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            setPhase('step4_list');
                          }}
                          className="px-4 py-2 rounded-xl bg-[#352A25] hover:bg-[#A47750] text-[#F7F2EA] text-xs font-bold flex items-center gap-1.5 transition shadow-warm-sm"
                        >
                          Continue to Early Applicants <ChevronRight className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 4: YOU CLICK ON IT YOU GET TO THE EARLY APPLICANTS LIST              */}
        {/* ========================================================================= */}
        {phase === 'step4_list' && (
          <div className="w-full max-w-3xl bg-white border border-[#352A25]/15 rounded-3xl p-6 sm:p-8 shadow-warm-lg">
            {/* Header banner */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-[#352A25]/15">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#A47750]/10 border border-[#A47750]/30 text-[#A47750] text-xs font-bold uppercase tracking-wider mb-2">
                  <Award className="w-3.5 h-3.5 text-[#A47750]" />
                  <span>Early Applicant Priority</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#352A25] tracking-tight">
                  Early Applicants List
                </h2>
                <p className="text-xs sm:text-sm text-[#352A25]/75 mt-1">
                  Verified roster of families and individuals who registered early to secure priority admission.
                </p>
              </div>

              {/* Spots Counter Badge */}
              <div className="bg-[#F7F2EA] border border-[#A47750]/30 rounded-2xl p-3.5 text-center shrink-0">
                <span className="text-[10px] uppercase tracking-wider text-[#A47750] font-bold block">
                  Limited Spots Left
                </span>
                <span className="font-mono text-3xl font-black text-[#A47750]">
                  {spotsLeft} / 100
                </span>
                <span className="text-[10px] text-[#352A25]/60 block mt-0.5">
                  53 already claimed
                </span>
              </div>
            </div>

            {/* Privileges for Early Applicants */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-6">
              <div className="bg-[#F7F2EA] border border-[#352A25]/10 rounded-xl p-3.5 text-center">
                <Ticket className="w-5 h-5 text-[#A47750] mx-auto mb-1.5" />
                <h4 className="text-xs font-bold text-[#352A25]">Complimentary Visit</h4>
                <p className="text-[11px] text-[#352A25]/75 mt-0.5">
                  Campus tour & consultation for 2 guests
                </p>
              </div>
              <div className="bg-[#F7F2EA] border border-[#352A25]/10 rounded-xl p-3.5 text-center">
                <Shield className="w-5 h-5 text-[#78836A] mx-auto mb-1.5" />
                <h4 className="text-xs font-bold text-[#352A25]">₹0 Application Fee</h4>
                <p className="text-[11px] text-[#352A25]/75 mt-0.5">
                  100% waiver on initial registration
                </p>
              </div>
              <div className="bg-[#F7F2EA] border border-[#352A25]/10 rounded-xl p-3.5 text-center">
                <Star className="w-5 h-5 text-[#A47750] mx-auto mb-1.5" />
                <h4 className="text-xs font-bold text-[#352A25]">Priority Suite Choice</h4>
                <p className="text-[11px] text-[#352A25]/75 mt-0.5">
                  First pick of premier garden suites
                </p>
              </div>
            </div>

            {/* The Live Early Applicants Feed / Table */}
            <div className="bg-[#F7F2EA] border border-[#352A25]/15 rounded-2xl p-4 mb-6">
              <div className="flex items-center justify-between text-xs text-[#352A25]/70 font-semibold mb-3 px-1">
                <span>Recent Early Applicants</span>
                <span className="text-[#78836A] flex items-center gap-1 font-medium">
                  <span className="w-2 h-2 rounded-full bg-[#78836A] animate-pulse" />
                  Live Sync
                </span>
              </div>

              <div className="divide-y divide-[#352A25]/10 max-h-56 overflow-y-auto pr-1">
                {INITIAL_APPLICANTS.map((applicant) => (
                  <div
                    key={applicant.id}
                    className="py-2.5 px-2 flex items-center justify-between hover:bg-white/80 rounded-lg transition"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-full bg-[#78836A] text-white text-xs font-bold flex items-center justify-center">
                        {applicant.name.charAt(0)}
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-[#352A25]">
                          {applicant.name}
                        </div>
                        <div className="text-[10px] text-[#352A25]/60">
                          {applicant.city} • {applicant.time}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono font-bold bg-[#A47750]/15 text-[#A47750] px-2 py-0.5 rounded border border-[#A47750]/30">
                        {applicant.spot}
                      </span>
                      <Check className="w-3.5 h-3.5 text-[#78836A]" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* BUTTON PROCEEDING TO SIGN UP PAGE */}
            <div className="text-center pt-2">
              <button
                id="join-early-applicants-list-btn"
                onClick={() => setPhase('step5_form')}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-[#352A25] hover:bg-[#A47750] text-[#F7F2EA] font-black text-base tracking-wide uppercase shadow-warm-md hover:scale-105 active:scale-95 transition cursor-pointer"
              >
                <Sparkles className="w-5 h-5 text-[#A47750]" />
                <span>Be an Early Applicant</span>
                <ChevronRight className="w-5 h-5 text-[#F7F2EA]" />
              </button>
              <p className="text-xs text-[#352A25]/60 mt-2">
                Takes 30 seconds • No credit card or payment required
              </p>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 5: SIGN UP PAGE WHICH HAVE THE FORM AND THEY SUBMIT                  */}
        {/* ========================================================================= */}
        {phase === 'step5_form' && (
          <div className="w-full max-w-xl bg-white border border-[#352A25]/15 rounded-3xl p-6 sm:p-8 shadow-warm-lg">
            <div className="text-center mb-6">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#78836A]/10 border border-[#78836A]/30 text-[#78836A] text-xs font-bold uppercase tracking-wider mb-2">
                <Sparkles className="w-3.5 h-3.5 text-[#78836A]" />
                <span>Step 4: Early Application</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#352A25] tracking-tight">
                Be an Early Applicant
              </h2>
              <p className="text-xs sm:text-sm text-[#352A25]/75 mt-1 leading-relaxed max-w-md mx-auto">
                OBOKASH is an evolving vision for senior living, built around dignity, comfort, companionship, and peace of mind. Provide your details below.
              </p>
              <p className="text-[11px] text-[#A47750] font-semibold mt-1">
                📍 8769, SH 1, Kulpi, Chak Ramnath, West Bengal – 743351.
              </p>
            </div>

            {formError && (
              <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-300 text-red-800 text-xs flex items-center gap-2">
                <X className="w-4 h-4 text-red-600 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#352A25] mb-1.5">
                  Full Name <span className="text-[#A47750]">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-[#352A25]/50 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ramesh Kumar Sharma"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#F7F2EA] border border-[#352A25]/20 text-[#352A25] placeholder:text-[#352A25]/40 text-sm focus:outline-none focus:border-[#A47750] focus:ring-1 focus:ring-[#A47750] transition"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#352A25] mb-1.5">
                    Email Address <span className="text-[#A47750]">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-[#352A25]/50 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      placeholder="e.g. ramesh@gmail.com"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#F7F2EA] border border-[#352A25]/20 text-[#352A25] placeholder:text-[#352A25]/40 text-sm focus:outline-none focus:border-[#A47750] focus:ring-1 focus:ring-[#A47750] transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#352A25] mb-1.5">
                    Phone / WhatsApp Number
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-[#352A25]/50 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      placeholder="e.g. +91 98765 43210"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#F7F2EA] border border-[#352A25]/20 text-[#352A25] placeholder:text-[#352A25]/40 text-sm focus:outline-none focus:border-[#A47750] focus:ring-1 focus:ring-[#A47750] transition"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#352A25] mb-1.5">
                  Looking For?
                </label>
                <select
                  value={formData.reason}
                  onChange={(e) =>
                    setFormData({ ...formData, reason: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-xl bg-[#F7F2EA] border border-[#352A25]/20 text-[#352A25] text-sm focus:outline-none focus:border-[#A47750] focus:ring-1 focus:ring-[#A47750] transition"
                >
                  <option value="parents">For Elderly Parents / Relatives</option>
                  <option value="myself">For Myself & Partner (Retirement Living)</option>
                  <option value="tour">Free Sanctuary Tour & Consultation First</option>
                  <option value="general">General Inquiry & Tariff Details</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#352A25] mb-1.5">
                  Specific Care or Medical Preferences (Optional)
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Needs mobility support, vegetarian diet, room with garden view..."
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData({ ...formData, notes: e.target.value })
                  }
                  className="w-full px-4 py-2.5 rounded-xl bg-[#F7F2EA] border border-[#352A25]/20 text-[#352A25] placeholder:text-[#352A25]/40 text-sm focus:outline-none focus:border-[#A47750] focus:ring-1 focus:ring-[#A47750] transition"
                />
              </div>

              <div className="pt-2">
                <button
                  id="submit-early-applicant-form-btn"
                  type="submit"
                  disabled={submitting}
                  className="w-full py-4 px-6 rounded-2xl bg-[#352A25] hover:bg-[#A47750] text-[#F7F2EA] font-bold text-base tracking-wide shadow-warm-md hover:scale-[1.01] active:scale-98 transition flex items-center justify-center gap-2 cursor-pointer border border-[#352A25] disabled:opacity-50"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin text-[#F7F2EA]" />
                      <span>Submitting Your Application...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-5 h-5 text-[#F7F2EA]" />
                      <span>Be an Early Applicant — Submit Application</span>
                    </>
                  )}
                </button>
              </div>

              <p className="text-[11px] text-[#352A25]/60 text-center">
                🔒 Your information is saved directly to the Obokash Admin
                Database.
              </p>
            </form>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 5 SUCCESS: VERIFIED EARLY APPLICANT CONFIRMATION                     */}
        {/* ========================================================================= */}
        {phase === 'step5_success' && (
          <div className="w-full max-w-md bg-white border-2 border-[#A47750] rounded-3xl p-6 sm:p-8 text-center shadow-warm-lg">
            <div className="w-16 h-16 rounded-2xl bg-[#78836A] text-white flex items-center justify-center mx-auto mb-4 shadow-sm">
              <Check className="w-8 h-8" />
            </div>

            <span className="inline-block px-3 py-1 rounded-full bg-[#78836A]/10 border border-[#78836A]/30 text-[#78836A] text-xs font-bold uppercase tracking-wider mb-2">
              Registration Successful
            </span>

            <h2 className="text-2xl font-serif font-bold text-[#352A25]">
              Early Application Confirmed!
            </h2>
            <p className="text-xs text-[#352A25]/80 mt-1 mb-6">
              Welcome to the Obokash Senior Living family, <strong>{issuedApplication?.name}</strong>.
            </p>

            {/* Digital Application Card */}
            <div className="bg-[#F7F2EA] border border-[#A47750]/50 rounded-2xl p-4 text-left relative overflow-hidden mb-6 shadow-inner">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <span className="text-[10px] text-[#A47750] font-bold uppercase tracking-widest block">
                    OBOKASH Early Applicant
                  </span>
                  <span className="font-mono text-base font-bold text-[#352A25]">
                    {issuedApplication?.applicationId}
                  </span>
                </div>
                <div className="w-14 h-8 rounded-lg overflow-hidden border border-[#352A25]/15 relative bg-white flex items-center justify-center p-1">
                  <Image
                    src="/images/obokash-logo.png"
                    alt="OBOKASH Logo"
                    fill
                    className="object-contain p-0.5"
                  />
                </div>
              </div>

              <div className="space-y-1 text-xs border-t border-[#352A25]/10 pt-2 text-[#352A25]">
                <div className="flex justify-between">
                  <span className="text-[#352A25]/60">Applicant:</span>
                  <span className="font-semibold text-[#352A25]">{issuedApplication?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#352A25]/60">Status:</span>
                  <span className="text-[#78836A] font-bold">✓ VERIFIED EARLY APPLICANT</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#352A25]/60">Privilege:</span>
                  <span className="text-[#A47750] font-medium">Complimentary Visit + Priority Allocation</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={handleExitToMain}
                className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-[#352A25] hover:bg-[#A47750] text-[#F7F2EA] font-bold text-sm shadow-warm-md hover:scale-[1.02] active:scale-95 transition cursor-pointer"
              >
                <span>Discover OBOKASH — Enter Sanctuary Website</span>
                <ChevronRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => setPhase('step1_questions')}
                className="text-xs text-[#352A25]/60 hover:text-[#352A25] underline underline-offset-2 block mx-auto cursor-pointer"
              >
                Replay discovery sequence
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Footer copyright */}
      <footer className="relative z-10 w-full max-w-6xl mx-auto px-4 py-4 text-center text-xs text-[#352A25]/60 border-t border-[#352A25]/15">
        © {new Date().getFullYear()} OBOKASH - SENIOR LIVING. All rights reserved.
      </footer>
    </div>
  );
}
