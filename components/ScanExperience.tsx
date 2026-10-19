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

// Pre-seeded early checkers roster to showcase social proof
const INITIAL_CHECKERS = [
  { id: 'AD-EC-001', name: 'Dr. Ramesh Chandra Verma', city: 'South Delhi', time: '12 mins ago', spot: '#01 VIP' },
  { id: 'AD-EC-002', name: 'Sunita & Ashok Kapoor', city: 'Gurugram', time: '34 mins ago', spot: '#02 VIP' },
  { id: 'AD-EC-003', name: 'Col. Virendra Saxena (Retd.)', city: 'Noida', time: '1 hour ago', spot: '#03 VIP' },
  { id: 'AD-EC-004', name: 'Meenakshi Sundaram', city: 'Bengaluru', time: '2 hours ago', spot: '#04 VIP' },
  { id: 'AD-EC-005', name: 'Rajesh & Priti Patel', city: 'Ahmedabad', time: '3 hours ago', spot: '#05 VIP' },
  { id: 'AD-EC-006', name: 'Ananya Deshmukh', city: 'Pune', time: '4 hours ago', spot: '#06 VIP' },
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
  // 'scan' -> 'step1_questions' -> 'step1_loading' -> 'step2_slides' -> 'step3_ad' -> 'step4_list' -> 'step5_form' -> 'step5_success'
  const [phase, setPhase] = useState<
    | 'scan'
    | 'step1_questions'
    | 'step1_loading'
    | 'step2_slides'
    | 'step3_ad'
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

  // Step 3: Irritating Ad state
  const [adVisible, setAdVisible] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(179); // 2m 59s

  // Step 4: Early Checkers List state
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
  const [issuedPass, setIssuedPass] = useState<{ passId: string; name: string } | null>(null);

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
        // After final slide, proceed to step 3 irritating ad!
        setPhase('step3_ad');
        setTimeout(() => setAdVisible(true), 200);
      }
    }, 4500);

    return () => clearTimeout(slideTimer);
  }, [phase, currentSlide, autoPlay]);

  // -------------------------------------------------------------
  // STEP 3: Irritating Ad Timer
  // -------------------------------------------------------------
  useEffect(() => {
    if (phase !== 'step3_ad') return;
    const interval = setInterval(() => {
      setTimerSeconds((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [phase]);

  // -------------------------------------------------------------
  // FORM SUBMISSION HANDLER (Step 5)
  // -------------------------------------------------------------
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!formData.name.trim() || !formData.email.trim()) {
      setFormError('Please provide your name and email to secure your early checker pass.');
      return;
    }

    setSubmitting(true);
    const passNumber = `AD-EC-${Math.floor(1000 + Math.random() * 9000)}`;

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
          authProvider: 'early-checker',
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
            subject: `Early Checker Pass Claimed (${formData.reason})`,
            message: formData.notes
              ? `[Reason: ${formData.reason}] Notes: ${formData.notes}`
              : `Claimed Early Checker Pass ${passNumber} for ${formData.reason}.`,
          }),
        }).catch(() => {});
      }

      setIssuedPass({ passId: passNumber, name: formData.name.trim() });
      setPhase('step5_success');
    } catch {
      setFormError('Submission failed. Please check your network and try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-[#0A1811] text-white flex flex-col justify-between selection:bg-amber-500 selection:text-black font-sans relative overflow-x-hidden">
      {/* Ambient background glow elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-emerald-600/15 rounded-full blur-[100px]" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-amber-600/15 rounded-full blur-[100px]" />
      </div>

      {/* Top micro-navigation */}
      <header className="relative z-20 w-full max-w-6xl mx-auto px-4 py-4 flex items-center justify-between border-b border-emerald-900/30">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl overflow-hidden border border-emerald-500/40 relative shadow-md">
            <Image
              src="/images/anand-dham-logo.jpg"
              alt="Anand Dham Logo"
              fill
              className="object-cover"
              priority
            />
          </div>
          <div>
            <span className="font-serif font-bold text-base tracking-wide text-white block leading-none">
              Anand Dham
            </span>
            <span className="text-[10px] uppercase tracking-widest text-amber-400 font-semibold">
              Elder Care Sanctuary
            </span>
          </div>
        </div>

        {/* Phase step indicator */}
        <div className="flex items-center gap-1.5 text-xs text-emerald-400/80 bg-emerald-950/60 px-3 py-1.5 rounded-full border border-emerald-800/40">
          <span
            className={`w-2 h-2 rounded-full ${
              phase === 'scan'
                ? 'bg-amber-400 animate-ping'
                : 'bg-emerald-400'
            }`}
          />
          <span className="font-medium text-[11px] sm:text-xs">
            {phase === 'scan' && 'Scanning Code...'}
            {phase === 'step1_questions' && 'Step 1: Perspectives'}
            {phase === 'step1_loading' && 'Step 1: Loading Sanctuary'}
            {phase === 'step2_slides' && 'Step 2: Sanctuary Experience'}
            {phase === 'step3_ad' && 'Step 3: Exclusive Pass'}
            {phase === 'step4_list' && 'Step 4: Early Checkers List'}
            {phase === 'step5_form' && 'Step 5: Reserve Pass'}
            {phase === 'step5_success' && 'VIP Pass Confirmed ✓'}
          </span>
        </div>
      </header>

      {/* Main interactive viewport container */}
      <main className="relative z-10 flex-1 flex items-center justify-center p-4 sm:p-6 w-full max-w-5xl mx-auto">
        {/* ========================================================================= */}
        {/* PHASE 0: SCAN IN PROGRESS / JUST COMPLETED                                */}
        {/* ========================================================================= */}
        {phase === 'scan' && (
          <div className="w-full max-w-md text-center py-12 px-6 bg-emerald-950/40 border border-emerald-500/20 rounded-3xl backdrop-blur-xl shadow-2xl relative overflow-hidden">
            {/* Scanner laser animation */}
            <div className="relative w-48 h-48 mx-auto mb-8 bg-black/60 rounded-2xl border-2 border-emerald-500/40 p-4 flex items-center justify-center overflow-hidden shadow-inner">
              <QrCode className="w-36 h-36 text-emerald-400/70" />

              {/* Laser line moving vertically */}
              <div
                className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent shadow-[0_0_15px_#F59E0B] transition-all duration-100 ease-linear"
                style={{ top: `${scanProgress}%` }}
              />

              {/* Viewfinder corner brackets */}
              <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-amber-400" />
              <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-amber-400" />
              <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-amber-400" />
              <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-amber-400" />
            </div>

            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold">
                {scanComplete ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Scan Verified & Profile Loaded</span>
                  </>
                ) : (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-400" />
                    <span>Reading Anand Dham Smart QR...</span>
                  </>
                )}
              </div>

              <h2 className="text-xl sm:text-2xl font-serif font-bold text-white">
                {scanComplete
                  ? 'Welcome to Anand Dham'
                  : 'Scanning Sanctuary Beacon...'}
              </h2>
              <p className="text-xs sm:text-sm text-stone-400 max-w-sm mx-auto">
                Opening your personalized discovery journey. Please hold for a
                moment.
              </p>

              {/* Skip scan button */}
              <div className="pt-4">
                <button
                  onClick={() => setPhase('step1_questions')}
                  className="text-xs text-amber-400/80 hover:text-amber-300 underline underline-offset-4 cursor-pointer"
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
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold uppercase tracking-widest mb-8 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Some Questions Changes Perspectives</span>
            </div>

            {/* Big quote mark */}
            <div className="text-emerald-500/20 font-serif text-8xl leading-none select-none mb-2">
              &ldquo;
            </div>

            {/* Rotating philosophical question */}
            <div className="min-h-[140px] flex items-center justify-center">
              <p
                className={`text-2xl sm:text-4xl md:text-5xl font-serif font-light text-[#F7F4EE] leading-snug tracking-tight max-w-2xl mx-auto transition-all duration-500 ${
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
                      ? 'w-8 bg-amber-400 shadow-[0_0_8px_#F59E0B]'
                      : 'w-2 bg-stone-700 hover:bg-stone-500'
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
                className="group relative inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-base sm:text-lg shadow-xl shadow-emerald-950/60 hover:shadow-emerald-600/30 hover:scale-105 active:scale-95 transition cursor-pointer border border-emerald-400/30"
              >
                {/* Ping glow ring around button */}
                <span className="absolute -inset-1 rounded-2xl bg-amber-400/20 blur-sm group-hover:bg-amber-400/40 transition" />

                <div className="relative w-7 h-7 rounded-lg bg-amber-400/20 text-amber-300 flex items-center justify-center border border-amber-400/40">
                  <Info className="w-4 h-4" />
                </div>
                <span className="relative">Know More</span>
                <ChevronRight className="relative w-5 h-5 text-amber-300 group-hover:translate-x-1 transition" />
              </button>

              <p className="text-xs text-stone-500 mt-3 font-medium">
                Tap above to uncover the sanctuary story
              </p>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 1 (SUB-PART): PEOPLE CLICK ON IT -> THE LOGO COMES UP + LOADING...    */}
        {/* ========================================================================= */}
        {phase === 'step1_loading' && (
          <div className="w-full max-w-md text-center py-16 px-6 bg-emerald-950/30 border border-emerald-500/20 rounded-3xl backdrop-blur-xl shadow-2xl relative">
            {/* The Logo zooms in */}
            <div className="relative w-36 h-36 mx-auto mb-6 rounded-3xl overflow-hidden border-2 border-amber-400/50 shadow-2xl shadow-amber-500/20 animate-in zoom-in-75 duration-700">
              <Image
                src="/images/anand-dham-logo.jpg"
                alt="Anand Dham Logo"
                fill
                className="object-cover"
                priority
              />
            </div>

            <h1 className="font-serif text-3xl font-bold text-white tracking-wide mb-1">
              Anand Dham
            </h1>
            <p className="text-xs uppercase tracking-widest text-amber-400 font-semibold mb-8">
              Elder Care Sanctuary
            </p>

            {/* Loading progress bar */}
            <div className="w-full max-w-xs mx-auto space-y-2">
              <div className="flex justify-between text-xs text-stone-400 font-medium">
                <span>Loading Sanctuary Profile...</span>
                <span className="font-mono text-amber-400">{loadProgress}%</span>
              </div>
              <div className="h-2 w-full bg-stone-900 rounded-full overflow-hidden border border-emerald-800/40">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 via-amber-400 to-amber-500 rounded-full shadow-[0_0_12px_#F59E0B] transition-all duration-150"
                  style={{ width: `${loadProgress}%` }}
                />
              </div>
            </div>

            <div className="flex justify-center gap-1.5 mt-6">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce" />
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-bounce [animation-delay:0.2s]" />
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce [animation-delay:0.4s]" />
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 2: SMALL PHOTO SLIDESHOW + TEXTUAL INFORMATION                       */}
        {/* ========================================================================= */}
        {phase === 'step2_slides' && (
          <div className="w-full max-w-4xl bg-emerald-950/40 border border-emerald-700/30 rounded-3xl overflow-hidden shadow-2xl backdrop-blur-md">
            <div className="grid grid-cols-1 md:grid-cols-12 min-h-[460px]">
              {/* Photo Slideshow Column (7 cols on desktop) */}
              <div className="md:col-span-7 relative min-h-[260px] sm:min-h-[340px] md:min-h-full overflow-hidden bg-black/40">
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
                      className="object-cover"
                      priority={idx === 0}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  </div>
                ))}

                {/* Tag pill atop image */}
                <div className="absolute top-4 left-4 z-20">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500 text-stone-950 shadow-md">
                    {SLIDES[currentSlide].tag}
                  </span>
                </div>

                {/* Badge at bottom of image */}
                <div className="absolute bottom-4 left-4 right-4 z-20 flex items-center justify-between">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-black/70 backdrop-blur-md text-[11px] font-semibold text-emerald-300 border border-emerald-500/30">
                    <Shield className="w-3.5 h-3.5 text-amber-400" />
                    <span>{SLIDES[currentSlide].badge}</span>
                  </div>

                  <span className="text-xs font-mono font-bold bg-black/70 px-2.5 py-1 rounded-md text-amber-300">
                    0{currentSlide + 1} / 0{SLIDES.length}
                  </span>
                </div>
              </div>

              {/* Textual Information Column (5 cols on desktop) */}
              <div className="md:col-span-5 p-6 sm:p-8 flex flex-col justify-between bg-gradient-to-br from-[#0D241A] to-[#0A1A12] border-t md:border-t-0 md:border-l border-emerald-800/30">
                <div>
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-400 mb-2">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Sanctuary Tour</span>
                  </div>

                  <h3 className="font-serif text-xl sm:text-2xl font-bold text-white leading-snug mb-3">
                    {SLIDES[currentSlide].headline}
                  </h3>

                  <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
                    {SLIDES[currentSlide].body}
                  </p>

                  {/* Highlights list */}
                  <div className="mt-5 space-y-2 pt-4 border-t border-emerald-900/50">
                    <div className="flex items-center gap-2 text-xs text-stone-300">
                      <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>Dedicated geriatric personal companion</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-stone-300">
                      <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>Regular family video calls & medical logs</span>
                    </div>
                  </div>
                </div>

                {/* Slideshow controls */}
                <div className="pt-6 mt-4 border-t border-emerald-900/40">
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
                              ? 'w-6 bg-amber-400'
                              : 'w-2 bg-stone-700'
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
                        className="p-2 rounded-xl bg-emerald-900/40 hover:bg-emerald-800/60 text-stone-300 hover:text-white transition"
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
                          className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-semibold flex items-center gap-1.5 transition"
                        >
                          Next <ChevronRight className="w-4 h-4" />
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            setPhase('step3_ad');
                            setTimeout(() => setAdVisible(true), 150);
                          }}
                          className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-bold flex items-center gap-1.5 transition shadow-md shadow-amber-500/20"
                        >
                          Continue <ChevronRight className="w-4 h-4" />
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
        {/* STEP 3: FREE SUBSCRIPTION POP UP COMES, LIKE AN IRRITATING AD             */}
        {/* ========================================================================= */}
        {phase === 'step3_ad' && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
            {/* The "Irritating Ad" container with flashing borders & urgency styling */}
            <div
              className={`relative w-full max-w-md bg-gradient-to-b from-[#1c1306] via-[#241708] to-[#120a02] border-4 border-amber-400 rounded-3xl p-6 sm:p-7 shadow-[0_0_50px_rgba(245,158,11,0.5)] text-center transition-all duration-500 transform ${
                adVisible ? 'scale-100 opacity-100' : 'scale-75 opacity-0'
              }`}
            >
              {/* Minimal Offer Badge in corner */}
              <div className="absolute -top-3.5 -left-2 rotate-[-6deg] bg-amber-500 text-stone-950 font-black text-[11px] uppercase px-3 py-1 rounded-full shadow-lg border border-amber-300 animate-pulse">
                🎁 MINIMAL OFFER
              </div>

              <div className="absolute -top-3.5 -right-2 rotate-[6deg] bg-emerald-600 text-white font-bold text-[11px] uppercase px-3 py-1 rounded-full shadow-lg border border-emerald-400">
                ✓ 100% FREE
              </div>

              {/* Fake close button ("Irritating" tiny button) */}
              <button
                onClick={() => setPhase('step4_list')}
                className="absolute top-3 right-3 text-stone-400 hover:text-white p-1 rounded-full bg-black/40 hover:bg-black/80 text-[10px] flex items-center gap-1 border border-stone-700 cursor-pointer"
                title="Skip to list"
              >
                <X className="w-3.5 h-3.5" />
              </button>

              {/* Top Announcement */}
              <div className="mt-2 mb-3">
                <span className="inline-block px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/40 text-amber-300 text-[11px] font-bold tracking-wider uppercase">
                  ⚡ TODAY&apos;S VISITOR PRIVILEGE ⚡
                </span>
              </div>

              {/* Attention Grabbing Icon */}
              <div className="relative w-16 h-16 mx-auto my-2 flex items-center justify-center">
                <div className="absolute inset-0 bg-amber-500/15 rounded-full animate-ping" />
                <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-300 text-stone-950 flex items-center justify-center shadow-lg shadow-amber-500/30">
                  <Ticket className="w-7 h-7" />
                </div>
              </div>

              {/* Minimal Offer Headline */}
              <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight leading-snug">
                Free 1-Day Sanctuary Pass
              </h3>

              <p className="text-xs text-stone-300 mt-1.5 font-normal leading-relaxed">
                A simple, minimal welcome gift for scanning our beacon today. Experience Anand Dham&apos;s peace and satvik living with <strong className="text-amber-300">zero payment</strong>.
              </p>

              {/* Countdown Timer */}
              <div className="my-3.5 py-2 px-3 rounded-xl bg-black/50 border border-amber-500/30 flex items-center justify-center gap-2.5">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-[11px] uppercase tracking-wider text-stone-400 font-semibold">
                  Complimentary Claim Window:
                </span>
                <span className="font-mono text-base font-bold text-amber-300 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-500/30">
                  {formatTimer(timerSeconds)}
                </span>
              </div>

              {/* Minimal Features bullets */}
              <div className="text-left bg-black/30 rounded-xl p-3 space-y-1.5 border border-emerald-500/20 text-xs mb-4">
                <div className="flex items-center gap-2 text-stone-200">
                  <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Free 1-Day Guided Sanctuary Tour for 2</span>
                </div>
                <div className="flex items-center gap-2 text-stone-200">
                  <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Complimentary Satvik Lunch & Herbal Tea</span>
                </div>
                <div className="flex items-center gap-2 text-stone-200">
                  <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Free Senior Physician Health Consultation</span>
                </div>
                <div className="flex items-center gap-2 text-stone-200">
                  <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>₹0 Registration Fee Waiver (Save ₹1,500)</span>
                </div>
              </div>

              {/* CLICKING THE AD GETS YOU TO THE EARLY CHECKERS LIST */}
              <button
                id="claim-free-subscription-ad-btn"
                onClick={() => setPhase('step4_list')}
                className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 text-stone-950 font-bold text-sm tracking-wide uppercase shadow-lg shadow-amber-500/30 hover:scale-[1.02] active:scale-98 transition flex items-center justify-center gap-2 cursor-pointer border border-yellow-200"
              >
                <Sparkles className="w-4 h-4 fill-stone-950" />
                <span>Claim Minimal Offer & View List</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => setPhase('step4_list')}
                className="mt-2.5 text-[11px] text-stone-400 hover:text-stone-300 underline underline-offset-2 cursor-pointer block mx-auto"
              >
                or proceed to Early Checkers List directly →
              </button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 4: YOU CLICK ON IT YOU GET TO THE EARLY CHECKERS LIST                */}
        {/* ========================================================================= */}
        {phase === 'step4_list' && (
          <div className="w-full max-w-3xl bg-[#0D241A] border border-emerald-600/30 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
            {/* Header banner */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-emerald-800/40">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold uppercase tracking-wider mb-2">
                  <Award className="w-3.5 h-3.5 text-amber-400" />
                  <span>Founding VIP Cohort</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-tight">
                  Early Checkers List
                </h2>
                <p className="text-xs sm:text-sm text-stone-300 mt-1">
                  Verified roster of families and individuals who scanned early and reserved VIP priority.
                </p>
              </div>

              {/* Spots Counter Badge */}
              <div className="bg-amber-400/10 border border-amber-400/30 rounded-2xl p-3.5 text-center shrink-0">
                <span className="text-[10px] uppercase tracking-wider text-amber-300 font-bold block">
                  Limited Spots Left
                </span>
                <span className="font-mono text-3xl font-black text-amber-400">
                  {spotsLeft} / 100
                </span>
                <span className="text-[10px] text-stone-400 block mt-0.5">
                  53 already claimed
                </span>
              </div>
            </div>

            {/* VIP Privileges for Early Checkers */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-6">
              <div className="bg-emerald-950/40 border border-emerald-800/30 rounded-xl p-3.5 text-center">
                <Ticket className="w-5 h-5 text-amber-400 mx-auto mb-1.5" />
                <h4 className="text-xs font-bold text-white">Free Day Pass</h4>
                <p className="text-[11px] text-stone-400 mt-0.5">
                  Full access & lunch for 2 guests
                </p>
              </div>
              <div className="bg-emerald-950/40 border border-emerald-800/30 rounded-xl p-3.5 text-center">
                <Shield className="w-5 h-5 text-emerald-400 mx-auto mb-1.5" />
                <h4 className="text-xs font-bold text-white">₹0 Reg. Fee</h4>
                <p className="text-[11px] text-stone-400 mt-0.5">
                  100% waiver on registration
                </p>
              </div>
              <div className="bg-emerald-950/40 border border-emerald-800/30 rounded-xl p-3.5 text-center">
                <Star className="w-5 h-5 text-amber-400 mx-auto mb-1.5" />
                <h4 className="text-xs font-bold text-white">Suite Selection</h4>
                <p className="text-[11px] text-stone-400 mt-0.5">
                  First pick of garden suites
                </p>
              </div>
            </div>

            {/* The Live Early Checkers Feed / Table */}
            <div className="bg-black/30 border border-emerald-900/40 rounded-2xl p-4 mb-6">
              <div className="flex items-center justify-between text-xs text-stone-400 font-semibold mb-3 px-1">
                <span>Recent Early Checkers</span>
                <span className="text-emerald-400 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Live Sync
                </span>
              </div>

              <div className="divide-y divide-emerald-900/30 max-h-56 overflow-y-auto pr-1">
                {INITIAL_CHECKERS.map((checker) => (
                  <div
                    key={checker.id}
                    className="py-2.5 px-2 flex items-center justify-between hover:bg-emerald-900/20 rounded-lg transition"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-full bg-emerald-800/60 text-emerald-200 text-xs font-bold flex items-center justify-center">
                        {checker.name.charAt(0)}
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-white">
                          {checker.name}
                        </div>
                        <div className="text-[10px] text-stone-400">
                          {checker.city} • {checker.time}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono font-bold bg-amber-400/10 text-amber-400 px-2 py-0.5 rounded border border-amber-400/20">
                        {checker.spot}
                      </span>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* BUTTON PROCEEDING TO SIGN UP PAGE */}
            <div className="text-center pt-2">
              <button
                id="join-early-checkers-list-btn"
                onClick={() => setPhase('step5_form')}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 text-stone-950 font-black text-base tracking-wide uppercase shadow-xl shadow-amber-500/30 hover:scale-105 active:scale-95 transition cursor-pointer"
              >
                <Sparkles className="w-5 h-5 fill-stone-950" />
                <span>Claim Minimal Offer — Go to Sign Up</span>
                <ChevronRight className="w-5 h-5" />
              </button>
              <p className="text-xs text-stone-400 mt-2">
                Takes 30 seconds • No credit card or payment required
              </p>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 5: SIGN UP PAGE WHICH HAVE THE FORM AND THEY SUBMIT                  */}
        {/* ========================================================================= */}
        {phase === 'step5_form' && (
          <div className="w-full max-w-xl bg-[#0D241A] border border-emerald-600/30 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
            <div className="text-center mb-6">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold uppercase tracking-wider mb-2">
                <Ticket className="w-3.5 h-3.5 text-amber-400" />
                <span>Step 5: Official Registration</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-tight">
                Claim Your Free 1-Day Pass
              </h2>
              <p className="text-xs sm:text-sm text-stone-300 mt-1">
                Minimal details to claim spot #{101 - spotsLeft} and confirm your complimentary sanctuary visit.
              </p>
            </div>

            {formError && (
              <div className="mb-4 p-3 rounded-xl bg-red-950/60 border border-red-500/40 text-red-200 text-xs flex items-center gap-2">
                <X className="w-4 h-4 text-red-400 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-300 mb-1.5">
                  Full Name <span className="text-amber-400">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ramesh Kumar Sharma"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-black/40 border border-emerald-800/60 text-white placeholder:text-stone-500 text-sm focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-300 mb-1.5">
                    Email Address <span className="text-amber-400">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      placeholder="e.g. ramesh@gmail.com"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-black/40 border border-emerald-800/60 text-white placeholder:text-stone-500 text-sm focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-300 mb-1.5">
                    Phone / WhatsApp Number
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      placeholder="e.g. +91 98765 43210"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-black/40 border border-emerald-800/60 text-white placeholder:text-stone-500 text-sm focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-300 mb-1.5">
                  Looking For?
                </label>
                <select
                  value={formData.reason}
                  onChange={(e) =>
                    setFormData({ ...formData, reason: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-xl bg-black/40 border border-emerald-800/60 text-white text-sm focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition"
                >
                  <option value="parents">For Elderly Parents / Relatives</option>
                  <option value="myself">For Myself & Partner (Retirement Living)</option>
                  <option value="tour">Free Sanctuary Tour & Consultation First</option>
                  <option value="general">General Inquiry & Tariff Details</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-300 mb-1.5">
                  Specific Care or Medical Preferences (Optional)
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Needs mobility support, vegetarian diet, room with garden view..."
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData({ ...formData, notes: e.target.value })
                  }
                  className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-emerald-800/60 text-white placeholder:text-stone-500 text-sm focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition"
                />
              </div>

              <div className="pt-2">
                <button
                  id="submit-early-checker-form-btn"
                  type="submit"
                  disabled={submitting}
                  className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-base tracking-wide shadow-xl shadow-emerald-950/60 hover:scale-[1.01] active:scale-98 transition flex items-center justify-center gap-2 cursor-pointer border border-emerald-400/40 disabled:opacity-50"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin text-amber-400" />
                      <span>Recording Your Registration...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-5 h-5 text-amber-300" />
                      <span>Submit & Confirm Free 1-Day Pass</span>
                    </>
                  )}
                </button>
              </div>

              <p className="text-[11px] text-stone-400 text-center">
                🔒 Your information is saved directly to the Anand Dham Admin
                Registry. No spam, ever.
              </p>
            </form>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 5 SUCCESS: VERIFIED EARLY CHECKER PASS ISSUED                        */}
        {/* ========================================================================= */}
        {phase === 'step5_success' && (
          <div className="w-full max-w-md bg-[#0D241A] border-2 border-amber-400/60 rounded-3xl p-6 sm:p-8 text-center shadow-[0_0_50px_rgba(245,158,11,0.2)]">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 text-white flex items-center justify-center mx-auto mb-4 shadow-lg shadow-emerald-900/50">
              <Check className="w-8 h-8" />
            </div>

            <span className="inline-block px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 text-xs font-bold uppercase tracking-wider mb-2">
              Registration Successful
            </span>

            <h2 className="text-2xl font-serif font-bold text-white">
              VIP Pass Confirmed!
            </h2>
            <p className="text-xs text-stone-300 mt-1 mb-6">
              Welcome to the Anand Dham family, <strong>{issuedPass?.name}</strong>.
            </p>

            {/* Digital Pass Card */}
            <div className="bg-gradient-to-br from-[#1A3326] to-[#0A1A12] border border-amber-400/40 rounded-2xl p-4 text-left relative overflow-hidden mb-6 shadow-inner">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <span className="text-[10px] text-amber-400 font-bold uppercase tracking-widest block">
                    Anand Dham VIP Pass
                  </span>
                  <span className="font-mono text-base font-bold text-white">
                    {issuedPass?.passId}
                  </span>
                </div>
                <div className="w-8 h-8 rounded-lg overflow-hidden border border-emerald-500/40 relative">
                  <Image
                    src="/images/anand-dham-logo.jpg"
                    alt="Logo"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>

              <div className="space-y-1 text-xs border-t border-emerald-900/50 pt-2 text-stone-300">
                <div className="flex justify-between">
                  <span className="text-stone-500">Holder:</span>
                  <span className="font-semibold text-white">{issuedPass?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Status:</span>
                  <span className="text-emerald-400 font-bold">✓ VERIFIED EARLY CHECKER</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Access:</span>
                  <span className="text-amber-300 font-medium">Free 1-Day Trial + Tariff Lock</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={handleExitToMain}
                className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 text-stone-950 font-bold text-sm shadow-md hover:scale-[1.02] active:scale-95 transition cursor-pointer"
              >
                <span>Enter Full Sanctuary Website</span>
                <ChevronRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => setPhase('step1_questions')}
                className="text-xs text-stone-400 hover:text-stone-200 underline underline-offset-2 block mx-auto cursor-pointer"
              >
                Replay discovery sequence
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Footer copyright */}
      <footer className="relative z-10 w-full max-w-6xl mx-auto px-4 py-4 text-center text-xs text-stone-500 border-t border-emerald-950/60">
        © {new Date().getFullYear()} Anand Dham Elder Care Sanctuary. All rights reserved.
      </footer>
    </div>
  );
}
