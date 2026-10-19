'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  ChevronRight,
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
} from 'lucide-react';

const QUESTIONS = [
  'When did you last hug your parents and truly stay?',
  'Does loneliness quietly visit them when you leave?',
  'Are they getting the dignity and joy they truly deserve?',
  'What if ageing could feel safe, warm, and celebrated?',
];

const SLIDES = [
  {
    src: '/images/about-garden-walk.jpg',
    tag: 'Morning Serenity',
    headline: 'Where every sunrise is greeted with calm, care, and community.',
    body: 'Expansive botanical garden trails, morning yoga, and gentle walks with compassionate companions — every day is purposeful.',
  },
  {
    src: '/images/hero-senior-living.jpg',
    tag: 'Warmth & Dignity',
    headline: 'A place your parents will call home — and mean it.',
    body: 'Round-the-clock nursing, personalised medical care, and deeply human kindness in every interaction.',
  },
  {
    src: '/images/senior-physio-wellness.jpg',
    tag: 'Health & Wellness',
    headline: 'Restoring mobility, strength, and the joy of movement.',
    body: 'Expert geriatric physiotherapists and restorative chair yoga ensure every resident feels their best every single day.',
  },
  {
    src: '/images/senior-room-suite.jpg',
    tag: 'Premium Living Suites',
    headline: 'Private sanctuaries designed for comfort and safety.',
    body: 'Orthopedic beds, in-room emergency response, air conditioning, and serene views — every detail considered.',
  },
  {
    src: '/images/senior-dining-hall.jpg',
    tag: 'Nourishing Every Day',
    headline: 'Doctor-curated satvik meals, shared with warmth.',
    body: 'Our hygiene-certified pure vegetarian kitchen crafts nutritious, flavourful meals tailored to each resident health needs.',
  },
];

export default function DiscoverPage() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);

  // Step 1
  const [qIndex, setQIndex] = useState(0);
  const [qVisible, setQVisible] = useState(true);
  const [knowMoreVisible, setKnowMoreVisible] = useState(false);

  // Step 2
  const [loadProgress, setLoadProgress] = useState(0);

  // Step 3
  const [slide, setSlide] = useState(0);
  const [slideIn, setSlideIn] = useState(true);

  // Step 4
  const [adVisible, setAdVisible] = useState(false);

  // Step 5
  const [formData, setFormData] = useState({ name: '', email: '', phone: '' });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formError, setFormError] = useState('');

  // Step 1 — know more button appears after 2s
  useEffect(() => {
    if (step !== 1) return;
    const t = setTimeout(() => setKnowMoreVisible(true), 2000);
    return () => clearTimeout(t);
  }, [step]);

  // Step 1 — cycle questions every 4s
  useEffect(() => {
    if (step !== 1) return;
    const interval = setInterval(() => {
      setQVisible(false);
      setTimeout(() => {
        setQIndex((p) => (p + 1) % QUESTIONS.length);
        setQVisible(true);
      }, 600);
    }, 4000);
    return () => clearInterval(interval);
  }, [step]);

  // Step 2 — fake loading bar
  useEffect(() => {
    if (step !== 2) return;
    setLoadProgress(0);
    const interval = setInterval(() => {
      setLoadProgress((prev) => {
        const next = prev + Math.floor(Math.random() * 8) + 3;
        if (next >= 100) {
          clearInterval(interval);
          setTimeout(() => setStep(3), 400);
          return 100;
        }
        return next;
      });
    }, 70);
    return () => clearInterval(interval);
  }, [step]);

  // Step 3 — auto-advance slides
  useEffect(() => {
    if (step !== 3) return;
    if (slide < SLIDES.length - 1) {
      const t = setTimeout(() => {
        setSlideIn(false);
        setTimeout(() => { setSlide((p) => p + 1); setSlideIn(true); }, 500);
      }, 4500);
      return () => clearTimeout(t);
    } else {
      const t = setTimeout(() => { setStep(4); setTimeout(() => setAdVisible(true), 200); }, 4500);
      return () => clearTimeout(t);
    }
  }, [step, slide]);

  const goToAd = () => { setStep(4); setTimeout(() => setAdVisible(true), 200); };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    if (!formData.name.trim() || !formData.email.trim()) {
      setFormError('Please enter your name and email to join the early list.');
      return;
    }
    setSubmitting(true);
    try {
      await fetch('/api/registered-users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim() || '',
          password: '',
          authProvider: 'early-access',
          action: 'register',
        }),
      });
      setSubmitted(true);
    } catch {
      setFormError('Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0D1F17', color: 'white', overflow: 'hidden' }}>

      {/* ══ STEP 1 — Questions + Know More ══ */}
      {step === 1 && (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px', textAlign: 'center', position: 'relative' }}>
          {/* Ambient blobs */}
          <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
            <div style={{ position: 'absolute', top: '25%', left: '25%', width: '320px', height: '320px', backgroundColor: 'rgba(4,120,87,0.15)', borderRadius: '50%', filter: 'blur(80px)' }} />
            <div style={{ position: 'absolute', bottom: '25%', right: '25%', width: '384px', height: '384px', backgroundColor: 'rgba(180,83,9,0.1)', borderRadius: '50%', filter: 'blur(80px)' }} />
          </div>

          {/* Quote mark */}
          <div style={{ position: 'relative', marginBottom: '24px' }}>
            <span style={{ fontSize: '96px', fontFamily: 'Georgia, serif', color: 'rgba(4,120,87,0.3)', lineHeight: 1 }}>&ldquo;</span>
          </div>

          {/* Question */}
          <div style={{ position: 'relative', maxWidth: '720px' }}>
            <p style={{
              fontSize: 'clamp(22px, 4vw, 44px)',
              fontFamily: 'Georgia, serif',
              fontWeight: 300,
              lineHeight: 1.35,
              color: '#F5F0E8',
              opacity: qVisible ? 1 : 0,
              transform: qVisible ? 'translateY(0)' : 'translateY(12px)',
              transition: 'opacity 0.6s ease, transform 0.6s ease',
            }}>
              {QUESTIONS[qIndex]}
            </p>
          </div>

          {/* Tagline */}
          <div style={{ position: 'relative', marginTop: '24px' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.2em', color: 'rgba(52,211,153,0.7)' }}>
              Some Questions Change Perspectives
            </span>
          </div>

          {/* Progress dots */}
          <div style={{ display: 'flex', gap: '8px', marginTop: '20px', position: 'relative' }}>
            {QUESTIONS.map((_, i) => (
              <div key={i} style={{
                height: '4px', borderRadius: '2px',
                width: i === qIndex ? '28px' : '8px',
                backgroundColor: i === qIndex ? '#F59E0B' : 'rgba(255,255,255,0.2)',
                transition: 'all 0.7s ease',
              }} />
            ))}
          </div>

          {/* Know More button */}
          <div style={{
            position: 'relative', marginTop: '56px',
            opacity: knowMoreVisible ? 1 : 0,
            transform: knowMoreVisible ? 'scale(1) translateY(0)' : 'scale(0.85) translateY(16px)',
            transition: 'opacity 0.7s ease, transform 0.7s cubic-bezier(0.175,0.885,0.32,1.275)',
          }}>
            <button
              id="discover-know-more-btn"
              onClick={() => { setKnowMoreVisible(false); setTimeout(() => setStep(2), 300); }}
              style={{
                display: 'flex', alignItems: 'center', gap: '12px',
                padding: '16px 40px', borderRadius: '16px',
                background: 'linear-gradient(135deg, #065F46, #047857)',
                boxShadow: '0 0 40px rgba(4,120,87,0.4), 0 4px 24px rgba(0,0,0,0.3)',
                border: 'none', cursor: 'pointer', color: 'white', fontWeight: 700, fontSize: '16px',
              }}
            >
              <Info style={{ width: '20px', height: '20px', color: '#FCD34D' }} />
              <span>Know More</span>
              <ChevronRight style={{ width: '20px', height: '20px', color: '#FCD34D' }} />
            </button>
          </div>

          {/* Skip */}
          <button
            onClick={() => router.push('/')}
            style={{ position: 'relative', marginTop: '28px', fontSize: '12px', color: 'rgba(255,255,255,0.3)', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}
          >
            Skip intro → Go to main site
          </button>
        </div>
      )}

      {/* ══ STEP 2 — Logo Loading ══ */}
      {step === 2 && (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px', textAlign: 'center', position: 'relative' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(4,120,87,0.18) 0%, transparent 70%)' }} />

          {/* Logo */}
          <div style={{
            position: 'relative', width: '180px', height: '180px',
            borderRadius: '24px', overflow: 'hidden', marginBottom: '32px',
            boxShadow: '0 25px 60px rgba(0,0,0,0.5)',
            animation: 'logoZoom 0.8s cubic-bezier(0.175,0.885,0.32,1.275) forwards',
          }}>
            <Image src="/images/anand-dham-logo.jpg" alt="Anand Dham" fill style={{ objectFit: 'cover' }} priority />
          </div>

          <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '48px', fontWeight: 700, color: 'white', marginBottom: '8px', animation: 'fadeSlideUp 0.6s 0.3s both ease' }}>
            Anand Dham
          </h1>
          <p style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.2em', color: '#FBBF24', marginBottom: '48px', animation: 'fadeSlideUp 0.6s 0.5s both ease' }}>
            Elder Care Sanctuary
          </p>

          {/* Loading bar */}
          <div style={{ width: '280px', animation: 'fadeSlideUp 0.6s 0.7s both ease' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'rgba(255,255,255,0.5)', marginBottom: '8px' }}>
              <span>Loading sanctuary…</span>
              <span style={{ fontFamily: 'monospace' }}>{Math.min(loadProgress, 100)}%</span>
            </div>
            <div style={{ height: '6px', borderRadius: '3px', backgroundColor: 'rgba(255,255,255,0.1)', overflow: 'hidden' }}>
              <div style={{
                height: '100%', borderRadius: '3px',
                width: `${Math.min(loadProgress, 100)}%`,
                background: 'linear-gradient(90deg, #065F46, #F59E0B)',
                boxShadow: '0 0 12px rgba(245,158,11,0.6)',
                transition: 'width 0.15s ease',
              }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '20px' }}>
              {[0, 1, 2].map((i) => (
                <div key={i} style={{
                  width: '8px', height: '8px', borderRadius: '50%',
                  backgroundColor: 'rgba(52,211,153,0.6)',
                  animation: `bounceDot 1.2s ${i * 0.2}s infinite`,
                }} />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ══ STEP 3 — Photo Slideshow ══ */}
      {step === 3 && (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', flexDirection: 'row', minHeight: '100vh', flexWrap: 'wrap' }}>
            {/* Left photo */}
            <div style={{ position: 'relative', flex: '1 1 400px', minHeight: '45vh', overflow: 'hidden' }}>
              {SLIDES.map((s, i) => (
                <div key={i} style={{
                  position: 'absolute', inset: 0,
                  opacity: i === slide && slideIn ? 1 : 0,
                  zIndex: i === slide ? 10 : 0,
                  transition: 'opacity 0.7s ease',
                }}>
                  <Image src={s.src} alt={s.tag} fill style={{ objectFit: 'cover' }} priority={i === 0} />
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(0,0,0,0.2), rgba(0,0,0,0.05))' }} />
                </div>
              ))}
              {/* Progress dots */}
              <div style={{ position: 'absolute', top: '24px', left: '24px', zIndex: 20, display: 'flex', gap: '6px' }}>
                {SLIDES.map((_, i) => (
                  <div key={i} style={{
                    height: '4px', borderRadius: '2px',
                    width: i === slide ? '28px' : '8px',
                    backgroundColor: i === slide ? '#F59E0B' : 'rgba(255,255,255,0.35)',
                    transition: 'all 0.5s ease',
                  }} />
                ))}
              </div>
              {/* Tag */}
              <div style={{ position: 'absolute', bottom: '24px', left: '24px', zIndex: 20 }}>
                <span style={{
                  padding: '4px 12px', borderRadius: '999px', fontSize: '12px', fontWeight: 700,
                  backgroundColor: '#F59E0B', color: 'white',
                  opacity: slideIn ? 1 : 0, transform: slideIn ? 'translateY(0)' : 'translateY(8px)',
                  transition: 'all 0.5s ease', display: 'inline-block',
                }}>
                  {SLIDES[slide].tag}
                </span>
              </div>
            </div>

            {/* Right text */}
            <div style={{
              flex: '1 1 380px', display: 'flex', flexDirection: 'column', justifyContent: 'center',
              padding: '48px 48px', background: 'linear-gradient(135deg, #0D1F17 0%, #0A1A12 100%)',
            }}>
              {/* Logo */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '40px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '12px', overflow: 'hidden', border: '2px solid rgba(4,120,87,0.5)' }}>
                  <Image src="/images/anand-dham-logo.jpg" alt="Anand Dham" width={40} height={40} style={{ objectFit: 'cover' }} />
                </div>
                <div>
                  <span style={{ display: 'block', fontFamily: 'Georgia, serif', fontWeight: 700, color: 'white', fontSize: '15px' }}>Anand Dham</span>
                  <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.2em', color: '#FBBF24' }}>Elder Care Sanctuary</span>
                </div>
              </div>

              {/* Slide number */}
              <div style={{ fontSize: '12px', fontFamily: 'monospace', color: 'rgba(255,255,255,0.3)', marginBottom: '16px' }}>
                {String(slide + 1).padStart(2, '0')} / {String(SLIDES.length).padStart(2, '0')}
              </div>

              {/* Headline */}
              <h2 style={{
                fontFamily: 'Georgia, serif', fontSize: 'clamp(22px, 3vw, 38px)',
                fontWeight: 700, lineHeight: 1.3, color: '#F5F0E8', marginBottom: '20px',
                opacity: slideIn ? 1 : 0, transform: slideIn ? 'translateY(0)' : 'translateY(16px)',
                transition: 'all 0.6s ease',
              }}>
                {SLIDES[slide].headline}
              </h2>

              {/* Body */}
              <p style={{
                fontSize: '15px', color: 'rgba(255,255,255,0.6)', lineHeight: 1.7, maxWidth: '360px',
                opacity: slideIn ? 1 : 0, transform: slideIn ? 'translateY(0)' : 'translateY(12px)',
                transition: 'all 0.6s 0.1s ease',
              }}>
                {SLIDES[slide].body}
              </p>

              {/* Progress bar */}
              <div style={{ marginTop: '36px', height: '2px', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '1px', overflow: 'hidden', maxWidth: '360px' }}>
                <div key={slide} style={{
                  height: '100%', backgroundColor: '#F59E0B', borderRadius: '1px',
                  animation: 'progressBarAnim 4.5s linear forwards', transformOrigin: 'left',
                }} />
              </div>

              {/* Stats */}
              <div style={{ display: 'flex', gap: '32px', marginTop: '36px' }}>
                {[
                  { Icon: Users, label: '100+ Residents', sub: 'Living in harmony' },
                  { Icon: Heart, label: '15+ Years', sub: 'Of compassionate care' },
                  { Icon: Shield, label: '24/7 Nursing', sub: 'Always on duty' },
                ].map(({ Icon, label, sub }, i) => (
                  <div key={i} style={{ display: 'flex', flexDirection: 'column' }}>
                    <Icon style={{ width: '16px', height: '16px', color: '#34D399', marginBottom: '4px' }} />
                    <span style={{ fontSize: '12px', fontWeight: 700, color: 'rgba(255,255,255,0.9)' }}>{label}</span>
                    <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)' }}>{sub}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={goToAd}
                style={{ marginTop: '36px', fontSize: '12px', color: 'rgba(255,255,255,0.3)', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline', alignSelf: 'flex-start' }}
              >
                Skip slideshow →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══ STEP 4 — Ad Pop-up ══ */}
      {step === 4 && (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', backgroundColor: 'rgba(0,0,0,0.7)' }}>
          {/* Blurred bg */}
          <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
            <Image src={SLIDES[SLIDES.length - 1].src} alt="bg" fill style={{ objectFit: 'cover', filter: 'blur(12px)', transform: 'scale(1.05)', opacity: 0.25 }} />
          </div>

          {/* Card */}
          <div style={{
            position: 'relative', zIndex: 10, width: '100%', maxWidth: '380px', margin: '16px',
            borderRadius: '24px', overflow: 'hidden',
            background: 'linear-gradient(145deg, #0D2D1F, #0A1F15)',
            border: '1px solid rgba(4,120,87,0.4)',
            boxShadow: '0 25px 80px rgba(0,0,0,0.7)',
            opacity: adVisible ? 1 : 0,
            transform: adVisible ? 'scale(1) translateY(0)' : 'scale(0.8) translateY(30px)',
            transition: 'all 0.5s cubic-bezier(0.175,0.885,0.32,1.275)',
          }}>
            {/* Close */}
            <button
              id="discover-ad-close-btn"
              onClick={() => { setAdVisible(false); setTimeout(() => router.push('/'), 300); }}
              style={{ position: 'absolute', top: '16px', right: '16px', zIndex: 20, width: '28px', height: '28px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.1)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.7)' }}
            >
              <X style={{ width: '16px', height: '16px' }} />
            </button>

            {/* Top bar */}
            <div style={{ height: '4px', background: 'linear-gradient(90deg, #065F46, #F59E0B, #065F46)' }} />

            {/* Early Access badge */}
            <div style={{ position: 'absolute', top: '16px', left: '16px', zIndex: 20 }}>
              <span style={{ padding: '2px 8px', borderRadius: '4px', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', backgroundColor: 'rgba(245,158,11,0.15)', color: '#FBBF24', border: '1px solid rgba(245,158,11,0.3)' }}>
                Early Access
              </span>
            </div>

            <div style={{ paddingTop: '48px', padding: '48px 28px 32px', textAlign: 'center' }}>
              {/* Bell icon */}
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
                <div style={{ position: 'relative' }}>
                  <div style={{ width: '64px', height: '64px', borderRadius: '16px', backgroundColor: 'rgba(4,120,87,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Bell style={{ width: '32px', height: '32px', color: '#FBBF24' }} />
                  </div>
                  <div style={{ position: 'absolute', top: '-4px', right: '-4px', width: '20px', height: '20px', borderRadius: '50%', backgroundColor: '#EF4444', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ fontSize: '10px', fontWeight: 700, color: 'white' }}>!</span>
                  </div>
                </div>
              </div>

              <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '22px', fontWeight: 700, color: 'white', marginBottom: '8px' }}>
                🎉 Limited Early Access!
              </h3>
              <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.6)', marginBottom: '4px' }}>
                Join our <strong style={{ color: '#FBBF24' }}>Early Checkers List</strong> and get:
              </p>

              <ul style={{ textAlign: 'left', margin: '16px 0', padding: 0, listStyle: 'none' }}>
                {[
                  'Free sanctuary tour before public launch',
                  'Priority admission & room selection',
                  'Exclusive founding family discount',
                  'Monthly wellness newsletter',
                ].map((b, i) => (
                  <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '13px', color: 'rgba(255,255,255,0.75)', marginBottom: '8px' }}>
                    <Check style={{ width: '14px', height: '14px', color: '#34D399', flexShrink: 0, marginTop: '2px' }} />
                    {b}
                  </li>
                ))}
              </ul>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '12px', color: 'rgba(255,255,255,0.4)', marginBottom: '20px' }}>
                <Clock style={{ width: '14px', height: '14px' }} />
                <span>Only <strong style={{ color: '#FBBF24' }}>47</strong> spots remaining</span>
              </div>

              {/* CTA */}
              <button
                id="discover-ad-cta-btn"
                onClick={() => { setAdVisible(false); setTimeout(() => setStep(5), 300); }}
                style={{
                  width: '100%', padding: '14px', borderRadius: '16px',
                  background: 'linear-gradient(135deg, #F59E0B, #D97706)',
                  boxShadow: '0 4px 24px rgba(245,158,11,0.4)',
                  border: 'none', cursor: 'pointer', color: 'white', fontWeight: 700, fontSize: '14px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                }}
              >
                <Sparkles style={{ width: '16px', height: '16px' }} />
                Yes! Get My Free Spot
                <ArrowRight style={{ width: '16px', height: '16px' }} />
              </button>

              <button
                onClick={() => { setAdVisible(false); setTimeout(() => router.push('/'), 300); }}
                style={{ marginTop: '12px', fontSize: '12px', color: 'rgba(255,255,255,0.25)', background: 'none', border: 'none', cursor: 'pointer', width: '100%' }}
              >
                No thanks, I&apos;ll miss out
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══ STEP 5 — Sign-Up Page ══ */}
      {step === 5 && (
        <div style={{ minHeight: '100vh', display: 'flex', flexWrap: 'wrap' }}>
          {/* Left panel (desktop) */}
          <div style={{
            flex: '1 1 380px', minHeight: '100%',
            background: 'linear-gradient(145deg, #052E16 0%, #064E3B 50%, #065F46 100%)',
            padding: '48px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
            position: 'relative', overflow: 'hidden',
          }}>
            <div style={{ position: 'absolute', inset: 0, opacity: 0.04, backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }} />

            <div style={{ position: 'relative' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '48px' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '16px', overflow: 'hidden', border: '2px solid rgba(4,120,87,0.5)' }}>
                  <Image src="/images/anand-dham-logo.jpg" alt="Anand Dham" width={48} height={48} style={{ objectFit: 'cover' }} />
                </div>
                <div>
                  <span style={{ display: 'block', fontFamily: 'Georgia, serif', fontWeight: 700, color: 'white', fontSize: '18px' }}>Anand Dham</span>
                  <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.2em', color: '#FBBF24' }}>Elder Care Sanctuary</span>
                </div>
              </div>

              <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(24px, 3vw, 36px)', fontWeight: 700, color: 'white', lineHeight: 1.3, marginBottom: '16px' }}>
                Be the First to Experience Something Extraordinary.
              </h2>
              <p style={{ fontSize: '14px', color: 'rgba(210,240,225,0.7)', lineHeight: 1.7 }}>
                Our Early Checkers List gives you first access to Anand Dham&apos;s world-class elder care — before we open to the public.
              </p>
            </div>

            <div style={{ position: 'relative' }}>
              {[
                { Icon: Star, title: 'Priority Admission', desc: 'Choose your preferred room & care plan first' },
                { Icon: Heart, title: 'Founding Family Perks', desc: 'Exclusive rates locked for early members' },
                { Icon: Shield, title: 'Free Sanctuary Tour', desc: 'Visit before anyone else does' },
              ].map(({ Icon, title, desc }) => (
                <div key={title} style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '16px', padding: '16px', border: '1px solid rgba(255,255,255,0.1)', marginBottom: '12px' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '10px', backgroundColor: 'rgba(4,120,87,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Icon style={{ width: '18px', height: '18px', color: '#FCD34D' }} />
                  </div>
                  <div>
                    <p style={{ fontSize: '14px', fontWeight: 700, color: 'white', margin: 0 }}>{title}</p>
                    <p style={{ fontSize: '12px', color: 'rgba(167,243,208,0.6)', margin: '4px 0 0' }}>{desc}</p>
                  </div>
                </div>
              ))}

              <div style={{ display: 'flex', alignItems: 'center', gap: '24px', paddingTop: '24px', borderTop: '1px solid rgba(255,255,255,0.1)', marginTop: '8px' }}>
                {[['47', 'Spots left'], ['253', 'Signed up'], ['Free', 'No payment']].map(([val, label]) => (
                  <div key={label}>
                    <span style={{ fontFamily: 'Georgia, serif', fontSize: '24px', fontWeight: 700, color: '#FCD34D' }}>{val}</span>
                    <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', margin: '2px 0 0' }}>{label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right form */}
          <div style={{
            flex: '1 1 400px', display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '48px 32px', background: 'linear-gradient(135deg, #0D1F17, #0A1A12)',
          }}>
            <div style={{ width: '100%', maxWidth: '440px' }}>
              {!submitted ? (
                <>
                  <div style={{ marginBottom: '32px' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '4px 12px', borderRadius: '999px', backgroundColor: 'rgba(245,158,11,0.12)', border: '1px solid rgba(245,158,11,0.3)', marginBottom: '16px' }}>
                      <Sparkles style={{ width: '14px', height: '14px', color: '#FBBF24' }} />
                      <span style={{ fontSize: '11px', fontWeight: 700, color: '#FBBF24', textTransform: 'uppercase', letterSpacing: '0.15em' }}>Early Checkers List</span>
                    </div>
                    <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(24px, 3vw, 32px)', fontWeight: 700, color: 'white', marginBottom: '12px' }}>
                      Reserve Your Spot — It&apos;s Free
                    </h1>
                    <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.5)', lineHeight: 1.7 }}>
                      Enter your details below. We&apos;ll reach out within 24 hours to schedule your exclusive private tour.
                    </p>
                  </div>

                  <form id="discover-signup-form" onSubmit={handleFormSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {[
                      { id: 'discover-signup-name', label: 'Your Full Name *', type: 'text', placeholder: 'e.g. Priya Sharma', key: 'name', required: true },
                      { id: 'discover-signup-email', label: 'Email Address *', type: 'email', placeholder: 'your@email.com', key: 'email', required: true },
                      { id: 'discover-signup-phone', label: 'Phone / WhatsApp (optional)', type: 'tel', placeholder: '+91 98765 43210', key: 'phone', required: false },
                    ].map(({ id, label, type, placeholder, key, required }) => (
                      <div key={key}>
                        <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.55)', marginBottom: '8px' }}>
                          {label}
                        </label>
                        <input
                          id={id}
                          type={type}
                          required={required}
                          placeholder={placeholder}
                          value={(formData as any)[key]}
                          onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
                          style={{
                            width: '100%', padding: '14px 16px', borderRadius: '16px',
                            fontSize: '14px', color: 'white',
                            backgroundColor: 'rgba(255,255,255,0.06)',
                            border: '1px solid rgba(255,255,255,0.12)',
                            outline: 'none', boxSizing: 'border-box',
                          }}
                          onFocus={(e) => { e.target.style.borderColor = 'rgba(4,120,87,0.8)'; e.target.style.boxShadow = '0 0 0 3px rgba(4,120,87,0.15)'; }}
                          onBlur={(e) => { e.target.style.borderColor = 'rgba(255,255,255,0.12)'; e.target.style.boxShadow = 'none'; }}
                        />
                      </div>
                    ))}

                    <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)', lineHeight: 1.6 }}>
                      By submitting, you agree to be contacted by Anand Dham care coordinators. No spam — ever.
                    </p>

                    {formError && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 16px', borderRadius: '12px', backgroundColor: 'rgba(153,27,27,0.3)', border: '1px solid rgba(153,27,27,0.5)', fontSize: '13px', color: '#FCA5A5' }}>
                        <X style={{ width: '14px', height: '14px', flexShrink: 0 }} />
                        {formError}
                      </div>
                    )}

                    <button
                      id="discover-signup-submit"
                      type="submit"
                      disabled={submitting}
                      style={{
                        width: '100%', padding: '16px', borderRadius: '16px',
                        background: 'linear-gradient(135deg, #065F46, #047857)',
                        boxShadow: '0 4px 24px rgba(4,120,87,0.4)',
                        border: 'none', cursor: 'pointer', color: 'white', fontWeight: 700, fontSize: '14px',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                        opacity: submitting ? 0.6 : 1,
                      }}
                    >
                      {submitting ? (
                        <><Loader2 style={{ width: '16px', height: '16px', animation: 'spinIcon 1s linear infinite' }} /> Reserving your spot…</>
                      ) : (
                        <><Sparkles style={{ width: '16px', height: '16px', color: '#FCD34D' }} /> Reserve My Free Spot <ArrowRight style={{ width: '16px', height: '16px' }} /></>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => router.push('/')}
                      style={{ width: '100%', padding: '14px', borderRadius: '16px', fontSize: '14px', fontWeight: 600, color: 'rgba(255,255,255,0.4)', backgroundColor: 'transparent', border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer' }}
                    >
                      Explore full website instead
                    </button>
                  </form>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px', marginTop: '32px', paddingTop: '24px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                    {[
                      [Shield, '100% secure'],
                      [Heart, 'No spam'],
                      [Check, 'Free forever'],
                    ].map(([Icon, label], i) => (
                      <React.Fragment key={i}>
                        {i > 0 && <div style={{ width: '1px', height: '16px', backgroundColor: 'rgba(255,255,255,0.1)' }} />}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'rgba(255,255,255,0.35)' }}>
                          {React.createElement(Icon as React.ElementType, { style: { width: '14px', height: '14px' } })}
                          <span>{label as string}</span>
                        </div>
                      </React.Fragment>
                    ))}
                  </div>
                </>
              ) : (
                <div style={{ textAlign: 'center', padding: '32px 0' }}>
                  {/* Success circle */}
                  <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '32px' }}>
                    <div style={{ position: 'relative', width: '96px', height: '96px', borderRadius: '50%', background: 'linear-gradient(135deg, #065F46, #047857)', boxShadow: '0 0 50px rgba(4,120,87,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Check style={{ width: '48px', height: '48px', color: 'white' }} />
                    </div>
                  </div>

                  <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '32px', fontWeight: 700, color: 'white', marginBottom: '12px' }}>
                    You&apos;re on the list! 🎉
                  </h2>
                  <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.6)', lineHeight: 1.7, marginBottom: '8px' }}>
                    Welcome, <strong style={{ color: '#FBBF24' }}>{formData.name.split(' ')[0]}</strong>!
                  </p>
                  <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', lineHeight: 1.7, marginBottom: '36px' }}>
                    Our care coordinator will contact you at <strong style={{ color: 'rgba(255,255,255,0.7)' }}>{formData.email}</strong> within 24 hours.
                  </p>

                  <div style={{ backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '20px', marginBottom: '32px', textAlign: 'left' }}>
                    {[
                      'Free private sanctuary tour booked',
                      'Priority room selection access granted',
                      'Founding family discount applied',
                      'Monthly wellness updates activated',
                    ].map((item) => (
                      <div key={item} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', color: 'rgba(255,255,255,0.7)', marginBottom: '10px' }}>
                        <div style={{ width: '18px', height: '18px', borderRadius: '50%', backgroundColor: 'rgba(4,120,87,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <Check style={{ width: '11px', height: '11px', color: '#34D399' }} />
                        </div>
                        {item}
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => router.push('/')}
                    style={{
                      padding: '14px 32px', borderRadius: '16px',
                      background: 'linear-gradient(135deg, #F59E0B, #D97706)',
                      border: 'none', cursor: 'pointer', color: 'white', fontWeight: 700, fontSize: '14px',
                      display: 'inline-flex', alignItems: 'center', gap: '8px',
                      boxShadow: '0 4px 20px rgba(245,158,11,0.3)',
                    }}
                  >
                    Explore Anand Dham <ArrowRight style={{ width: '16px', height: '16px' }} />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Global keyframes */}
      <style>{`
        @keyframes logoZoom {
          from { opacity: 0; transform: scale(0.5) rotate(-5deg); }
          to   { opacity: 1; transform: scale(1) rotate(0deg); }
        }
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes bounceDot {
          0%, 80%, 100% { transform: scale(0.7); opacity: 0.5; }
          40% { transform: scale(1); opacity: 1; }
        }
        @keyframes progressBarAnim {
          from { transform: scaleX(0); }
          to   { transform: scaleX(1); }
        }
        @keyframes spinIcon {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
