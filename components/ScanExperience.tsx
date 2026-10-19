'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Heart,
  Check,
  Loader2,
  Clock,
  QrCode,
  Phone,
  Mail,
  User,
  HeartHandshake,
  CheckCircle2,
  Building,
  HelpCircle,
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

  // Simplified 3-step sequence:
  // 'scan' -> 'step1_questions' -> 'step1_loading' -> 'step2_slides' -> 'form' -> 'success'
  const [phase, setPhase] = useState<
    | 'scan'
    | 'step1_questions'
    | 'step1_loading'
    | 'step2_slides'
    | 'form'
    | 'success'
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

  // Details Form state (Core data collection to store in DB & Admin Panel)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    reason: 'parents',
    roomPreference: 'deluxe_suite',
    notes: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [submittedLead, setSubmittedLead] = useState<{ id: string; name: string; phone: string } | null>(null);

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
          }, 900);
          return 100;
        }
        return prev + 12;
      });
    }, 110);
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
        // After final slide, proceed directly to Details Form!
        setPhase('form');
      }
    }, 4500);

    return () => clearTimeout(slideTimer);
  }, [phase, currentSlide, autoPlay]);

  // -------------------------------------------------------------
  // FORM SUBMISSION HANDLER -> Database & Admin Panel
  // -------------------------------------------------------------
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!formData.name.trim() || !formData.phone.trim()) {
      setFormError('Please provide your full name and phone number.');
      return;
    }

    setSubmitting(true);
    const leadRefId = `OBK-INQ-${Math.floor(10000 + Math.random() * 90000)}`;

    try {
      // 1. Save visitor lead to registered users registry (Admin Panel -> /admin/registered-users)
      const userRes = await fetch('/api/registered-users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim() || `${formData.phone.trim().replace(/\D/g, '')}@lead.obokash.com`,
          phone: formData.phone.trim(),
          password: '',
          authProvider: 'scan-lead',
          action: 'register',
        }),
      });

      if (!userRes.ok) {
        const userErr = await userRes.json();
        console.warn('User registration note:', userErr.error);
      }

      // 2. Also record an inquiry entry with full requirements (Admin Panel -> /admin/inquiries & dashboard)
      const careLabelMap: Record<string, string> = {
        parents: 'Care for Elderly Parents / Relatives',
        myself: 'Assisted Living for Self / Partner',
        tour: 'Personal Sanctuary Visit & Tour',
        general: 'General Consultation & Admission Details',
      };

      const roomLabelMap: Record<string, string> = {
        deluxe_suite: 'Private Deluxe Suite',
        twin_sharing: 'Twin Sharing Room',
        cottage: 'Executive Garden Cottage',
        day_care: 'Day Care / Respite Stay',
      };

      const careNeeded = careLabelMap[formData.reason] || formData.reason;
      const roomPreference = roomLabelMap[formData.roomPreference] || formData.roomPreference;

      await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim() || 'inquiry@lead.obokash.com',
          phone: formData.phone.trim(),
          subject: `Visitor Registration: ${careNeeded}`,
          careNeeded: careNeeded,
          message: `Looking for: ${careNeeded}\nPreferred Accommodation: ${roomPreference}${
            formData.notes ? `\nAdditional Notes: ${formData.notes.trim()}` : ''
          }`,
        }),
      }).catch(() => {});

      setSubmittedLead({
        id: leadRefId,
        name: formData.name.trim(),
        phone: formData.phone.trim(),
      });
      setPhase('success');
    } catch {
      setFormError('Submission failed. Please check your network and try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#03150D] via-[#052316] to-[#010B07] text-white flex flex-col justify-between selection:bg-amber-400 selection:text-stone-950 relative overflow-hidden font-sans">
      {/* Subtle ambient light glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-emerald-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-amber-500/5 rounded-full blur-[160px] pointer-events-none" />

      {/* Top micro-navigation */}
      <header className="relative z-20 w-full max-w-6xl mx-auto px-4 py-4 flex items-center justify-between border-b border-emerald-900/30">
        <div className="flex items-center gap-2.5">
          <div className="h-10 px-2 rounded-xl overflow-hidden border border-emerald-500/40 relative shadow-md bg-black flex items-center justify-center">
            <Image
              src="/images/obokash-logo.png"
              alt="OBOKASH - SENIOR LIVING Logo"
              width={100}
              height={36}
              className="h-7 w-auto object-contain"
              priority
            />
          </div>
          <div>
            <span className="font-serif font-bold text-base tracking-wide text-white block leading-none">
              OBOKASH
            </span>
            <span className="text-[10px] uppercase tracking-widest text-amber-400 font-semibold">
              Senior Living
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
            {phase === 'step1_loading' && 'Loading Sanctuary...'}
            {phase === 'step2_slides' && 'Step 2: Sanctuary Experience'}
            {phase === 'form' && 'Step 3: Register Your Details'}
            {phase === 'success' && 'Details Recorded ✓'}
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

              {/* Moving laser beam */}
              <div
                className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent shadow-[0_0_15px_#F59E0B] transition-all duration-100 ease-linear pointer-events-none"
                style={{ top: `${scanProgress}%` }}
              />

              {/* Corner brackets */}
              <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-amber-400" />
              <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-amber-400" />
              <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-amber-400" />
              <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-amber-400" />
            </div>

            {/* Scan text & progress */}
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-900/60 border border-emerald-700/50 text-emerald-300 text-xs font-mono">
                {scanComplete ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Scan Verified & Profile Loaded</span>
                  </>
                ) : (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-400" />
                    <span>Reading Obokash Smart QR...</span>
                  </>
                )}
              </div>

              <h2 className="text-xl sm:text-2xl font-serif font-bold text-white">
                {scanComplete
                  ? 'Welcome to OBOKASH - SENIOR LIVING'
                  : 'Scanning Sanctuary Beacon...'}
              </h2>
              <p className="text-xs sm:text-sm text-stone-400 max-w-sm mx-auto">
                Opening your personalized discovery journey. Please hold for a
                moment.
              </p>

              {/* Quick proceed button */}
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
                  : 'opacity-0 translate-y-8 scale-90 pointer-events-none'
              }`}
            >
              <button
                id="know-more-btn"
                onClick={() => setPhase('step1_loading')}
                className="group relative inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-400 text-stone-950 font-bold text-base shadow-[0_0_35px_rgba(245,158,11,0.4)] hover:shadow-[0_0_50px_rgba(245,158,11,0.7)] hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer border border-yellow-200"
              >
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-stone-950 opacity-75" />
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-stone-950" />
                </span>

                <span className="tracking-wide uppercase font-black text-sm">
                  Know More
                </span>

                <div className="w-7 h-7 rounded-full bg-stone-950/15 flex items-center justify-center group-hover:translate-x-1 transition-transform">
                  <ChevronRight className="w-4 h-4 text-stone-950" />
                </div>
              </button>

              <p className="text-xs text-stone-400 mt-3 font-medium">
                Click to explore Obokash Senior Living
              </p>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 1 (SUB-PART): THE LOGO COMES UP + LOADING 0 -> 100%                   */}
        {/* ========================================================================= */}
        {phase === 'step1_loading' && (
          <div className="w-full max-w-md text-center py-16 px-6 bg-emerald-950/30 border border-emerald-500/20 rounded-3xl backdrop-blur-xl shadow-2xl relative">
            {/* The Logo zooms in */}
            <div className="relative w-64 sm:w-72 h-32 mx-auto mb-6 rounded-2xl overflow-hidden border-2 border-amber-400/50 shadow-2xl shadow-amber-500/20 bg-black animate-in zoom-in-75 duration-700 flex items-center justify-center p-2">
              <Image
                src="/images/obokash-logo.png"
                alt="OBOKASH - SENIOR LIVING Logo"
                fill
                className="object-contain p-2"
                priority
              />
            </div>

            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white tracking-wide mb-1">
              OBOKASH - SENIOR LIVING
            </h1>
            <p className="text-xs sm:text-sm text-amber-300 font-medium italic max-w-sm mx-auto mb-8 leading-relaxed">
              A Haven of Trust, Security, and Unparalleled Peace.
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
        {/* STEP 2: PHOTO SLIDESHOW + TEXTUAL INFORMATION                             */}
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

                    <div className="absolute bottom-4 left-4 right-4 z-20">
                      <span className="inline-block px-3 py-1 rounded-full text-[11px] font-bold bg-amber-400 text-stone-950 uppercase tracking-wider mb-1.5 shadow-md">
                        {s.badge}
                      </span>
                      <p className="text-white text-xs sm:text-sm font-medium drop-shadow">
                        Perspective {idx + 1} of {SLIDES.length}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Textual Information Column (5 cols on desktop) */}
              <div className="md:col-span-5 p-6 sm:p-8 flex flex-col justify-between bg-gradient-to-b from-[#062419] to-[#041a12]">
                <div className="space-y-4">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-emerald-500/10 border border-emerald-500/30 text-emerald-300">
                    <Heart className="w-3 h-3 text-emerald-400" />
                    <span>{SLIDES[currentSlide].tag}</span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-serif font-bold text-white leading-snug">
                    {SLIDES[currentSlide].headline}
                  </h3>

                  <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
                    {SLIDES[currentSlide].body}
                  </p>
                </div>

                {/* Controls and Direct Details Button */}
                <div className="pt-6 border-t border-emerald-900/50 space-y-4">
                  <div className="flex items-center justify-between">
                    {/* Navigation Dots */}
                    <div className="flex items-center gap-1.5">
                      {SLIDES.map((_, i) => (
                        <button
                          key={i}
                          onClick={() => {
                            setAutoPlay(false);
                            setCurrentSlide(i);
                          }}
                          className={`h-1.5 rounded-full transition-all duration-300 ${
                            i === currentSlide
                              ? 'w-6 bg-amber-400'
                              : 'w-2 bg-stone-700 hover:bg-stone-500'
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
                        className="p-2 rounded-xl bg-emerald-900/40 hover:bg-emerald-800/60 text-stone-300 hover:text-white transition cursor-pointer"
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
                          className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
                        >
                          Next <ChevronRight className="w-4 h-4" />
                        </button>
                      ) : (
                        <button
                          onClick={() => setPhase('form')}
                          className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-bold flex items-center gap-1.5 transition shadow-md shadow-amber-500/20 cursor-pointer"
                        >
                          Register Details <ChevronRight className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Immediate proceed button available on any slide */}
                  <button
                    onClick={() => setPhase('form')}
                    className="w-full py-2.5 px-4 rounded-xl bg-emerald-900/80 hover:bg-emerald-800 text-amber-300 border border-emerald-700/60 font-semibold text-xs transition flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Ready? Share Your Details Now</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 3: DETAILS FORM -> SAVES TO DATABASE & ADMIN PANEL                   */}
        {/* ========================================================================= */}
        {phase === 'form' && (
          <div className="w-full max-w-xl bg-[#0D241A] border border-emerald-600/30 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
            <div className="text-center mb-6">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold uppercase tracking-wider mb-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Visitor Registration</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-tight">
                Register Your Details
              </h2>
              <p className="text-xs sm:text-sm text-stone-300 mt-1">
                Please share your details below. Our care management desk will save your profile and contact you promptly.
              </p>
            </div>

            {formError && (
              <div className="mb-4 p-3 rounded-xl bg-red-950/80 border border-red-500/50 text-red-300 text-xs text-center">
                {formError}
              </div>
            )}

            <form onSubmit={handleFormSubmit} className="space-y-4 text-left">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-300 mb-1.5">
                  Full Name <span className="text-amber-400">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ramesh Chandra Sharma"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-black/40 border border-emerald-800/60 text-white placeholder:text-stone-500 text-sm focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-300 mb-1.5">
                    Phone / WhatsApp <span className="text-amber-400">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      required
                      placeholder="e.g. +91 98765 43210"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-black/40 border border-emerald-800/60 text-white placeholder:text-stone-500 text-sm focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-300 mb-1.5">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      placeholder="e.g. ramesh@example.com"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-black/40 border border-emerald-800/60 text-white placeholder:text-stone-500 text-sm focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-300 mb-1.5">
                    I Am Inquiring For
                  </label>
                  <select
                    value={formData.reason}
                    onChange={(e) =>
                      setFormData({ ...formData, reason: e.target.value })
                    }
                    className="w-full px-3.5 py-3 rounded-xl bg-black/40 border border-emerald-800/60 text-white text-sm focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition"
                  >
                    <option value="parents">Elderly Parents / Relatives</option>
                    <option value="myself">Self / Partner (Retirement Living)</option>
                    <option value="tour">Schedule Personal Sanctuary Visit</option>
                    <option value="general">General Consultation & Tariff</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-300 mb-1.5">
                    Preferred Living Space
                  </label>
                  <select
                    value={formData.roomPreference}
                    onChange={(e) =>
                      setFormData({ ...formData, roomPreference: e.target.value })
                    }
                    className="w-full px-3.5 py-3 rounded-xl bg-black/40 border border-emerald-800/60 text-white text-sm focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition"
                  >
                    <option value="deluxe_suite">Private Deluxe Suite</option>
                    <option value="twin_sharing">Twin Sharing Room</option>
                    <option value="cottage">Executive Garden Cottage</option>
                    <option value="day_care">Day Care / Respite Stay</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-300 mb-1.5">
                  Care Needs or Questions (Optional)
                </label>
                <textarea
                  rows={3}
                  placeholder="Tell us about mobility needs, medical conditions, dietary preferences, or questions..."
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData({ ...formData, notes: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-xl bg-black/40 border border-emerald-800/60 text-white placeholder:text-stone-500 text-sm focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition resize-none"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-base tracking-wide shadow-xl shadow-emerald-950/60 hover:scale-[1.01] active:scale-98 transition flex items-center justify-center gap-2 cursor-pointer border border-emerald-400/40 disabled:opacity-50"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin text-amber-400" />
                      <span>Saving Your Details in Database...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-5 h-5 text-amber-300" />
                      <span>Submit Details to Obokash Registry</span>
                    </>
                  )}
                </button>
              </div>

              <p className="text-[11px] text-stone-400 text-center">
                🔒 Your information is saved directly to the Obokash Admin Registry. No spam, ever.
              </p>
            </form>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SUCCESS CONFIRMATION: SAVED IN DATABASE AND SHOWN IN ADMIN PANEL          */}
        {/* ========================================================================= */}
        {phase === 'success' && (
          <div className="w-full max-w-md bg-[#0D241A] border-2 border-emerald-400/60 rounded-3xl p-6 sm:p-8 text-center shadow-[0_0_50px_rgba(16,185,129,0.2)] animate-in zoom-in-95 duration-300">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 text-white flex items-center justify-center mx-auto mb-4 shadow-lg shadow-emerald-900/50">
              <Check className="w-8 h-8" />
            </div>

            <span className="inline-block px-3 py-1 rounded-full bg-emerald-400/10 border border-emerald-400/30 text-emerald-300 text-xs font-bold uppercase tracking-wider mb-2">
              Registration Saved
            </span>

            <h2 className="text-2xl font-serif font-bold text-white">
              Details Received!
            </h2>
            <p className="text-xs text-stone-300 mt-1 mb-6">
              Thank you, <strong>{submittedLead?.name}</strong>. Your profile has been securely recorded in our database.
            </p>

            {/* Confirmation Card */}
            <div className="bg-gradient-to-br from-[#1A3326] to-[#0A1A12] border border-emerald-500/40 rounded-2xl p-4 text-left relative overflow-hidden mb-6 shadow-inner">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest block">
                    Inquiry Reference
                  </span>
                  <span className="font-mono text-base font-bold text-white">
                    {submittedLead?.id}
                  </span>
                </div>
                <div className="w-12 h-7 rounded-lg overflow-hidden border border-emerald-500/40 relative bg-black flex items-center justify-center p-1">
                  <Image
                    src="/images/obokash-logo.png"
                    alt="OBOKASH Logo"
                    fill
                    className="object-contain p-0.5"
                  />
                </div>
              </div>

              <div className="space-y-1 text-xs border-t border-emerald-900/50 pt-2 text-stone-300">
                <div className="flex justify-between">
                  <span className="text-stone-500">Name:</span>
                  <span className="font-semibold text-white">{submittedLead?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Contact:</span>
                  <span className="font-mono text-stone-200">{submittedLead?.phone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Status:</span>
                  <span className="text-emerald-400 font-bold">✓ Logged in Admin Panel</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={handleExitToMain}
                className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-bold text-sm shadow-md hover:scale-[1.02] active:scale-95 transition cursor-pointer"
              >
                <span>Enter Full Sanctuary Website</span>
                <ChevronRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => {
                  setFormData({ name: '', email: '', phone: '', reason: 'parents', roomPreference: 'deluxe_suite', notes: '' });
                  setPhase('step1_questions');
                }}
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
        © {new Date().getFullYear()} OBOKASH - SENIOR LIVING. All rights reserved.
      </footer>
    </div>
  );
}
