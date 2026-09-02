import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { 
  Star, 
  Check, 
  Clock, 
  MessageCircle, 
  ArrowRight, 
  Award, 
  Code, 
  Database, 
  CreditCard, 
  Smartphone, 
  Sparkles, 
  ChevronRight,
  BookOpen,
  User,
  Users,
  ShieldCheck,
  Send,
  Copy,
  Linkedin,
  Layers,
  Cpu,
  ChevronDown,
  FileDown,
  Download,
  FileText,
  QrCode,
  Share2
} from 'lucide-react';
import QRCode from 'qrcode';
import Navbar from './components/Navbar';
import TerminalReplay from './components/TerminalReplay';
import CountdownTimer from './components/CountdownTimer';
import FaqAccordion from './components/FaqAccordion';
import RegisterForm from './components/RegisterForm';
import SalaryGrowthChart from './components/SalaryGrowthChart';
import StudentShowcase from './components/StudentShowcase';
import MentorChatWidget from './components/MentorChatWidget';
import TrainerSection from './components/TrainerSection';
import InteractiveRoadmap from './components/InteractiveRoadmap';
import SkillsAcquiredChart from './components/SkillsAcquiredChart';
import CurriculumProgressBar from './components/CurriculumProgressBar';
import CertificatePreview from './components/CertificatePreview';
import ParticipationCertificateSection from './components/ParticipationCertificateSection';
import StudentOutcomes from './components/StudentOutcomes';
import BackToTop from './components/BackToTop';
import TimeToShipCounter from './components/TimeToShipCounter';
import LiveViewerCounter from './components/LiveViewerCounter';
import VerifiedLinkedInSection from './components/VerifiedLinkedInSection';
import TestimonialVideoPlayer from './components/TestimonialVideoPlayer';
import BatchStartDateToast from './components/BatchStartDateToast';
import GuaranteeAlertToast from './components/GuaranteeAlertToast';
import RazorpayPaymentModal from './components/RazorpayPaymentModal';
import GuaranteeDetailsModal from './components/GuaranteeDetailsModal';
import StudentDashboard from './components/StudentDashboard';
import FloatingCommunityButton from './components/FloatingCommunityButton';
import { AdminAuthProvider } from './context/AdminAuthContext';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { PublicCertificateVerify } from './components/public/PublicCertificateVerify';
import { generateCurriculumPDF } from './utils/syllabusPdf';
import { 
  BUILD_CARDS, 
  CURRICULUM_WEEKS, 
  AUDIENCE_CARDS, 
  TESTIMONIALS 
} from './types';
import { getWhatsappNumber } from './lib/whatsapp';
import { getUpcomingBatchSchedule } from './lib/schedule';
import { injectOpenGraphMeta } from './lib/meta';
import { detectUserIntent, PERSONA_INTENTS, PersonaIntent } from './utils/intentDetection';

export default function App() {
  const [copied, setCopied] = useState(false);
  const inviteUrl = "https://codeinindia.in/?ref=invite";
  const [inviteQrCode, setInviteQrCode] = useState<string>('');
  const [isGeneratingQr, setIsGeneratingQr] = useState<boolean>(true);
  const [seatsLeft, setSeatsLeft] = useState(14);

  // App Route: 'public' | 'admin' | 'verify' | 'dashboard'
  const [route, setRoute] = useState<'public' | 'admin' | 'verify' | 'dashboard'>(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.toLowerCase();
      const path = window.location.pathname.toLowerCase();
      if (hash.startsWith('#admin') || path.startsWith('/admin')) return 'admin';
      if (hash.startsWith('#verify') || path.startsWith('/verify')) return 'verify';
      if (hash.startsWith('#dashboard') || hash.startsWith('#portal') || path.startsWith('/dashboard')) return 'dashboard';
    }
    return 'public';
  });

  const [verifyCertId, setVerifyCertId] = useState<string>('CERT-2026-8921');

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.toLowerCase();
      const path = window.location.pathname.toLowerCase();
      if (hash.startsWith('#admin') || path.startsWith('/admin')) {
        setRoute('admin');
      } else if (hash.startsWith('#verify') || path.startsWith('/verify')) {
        const parts = hash.split('/');
        if (parts[1]) setVerifyCertId(parts[1]);
        setRoute('verify');
      } else if (hash.startsWith('#dashboard') || hash.startsWith('#portal') || path.startsWith('/dashboard')) {
        setRoute('dashboard');
      } else {
        setRoute('public');
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Razorpay Checkout Modal State
  const [isRazorpayModalOpen, setIsRazorpayModalOpen] = useState(false);
  const [isGuaranteeModalOpen, setIsGuaranteeModalOpen] = useState(false);
  const [selectedRazorpayPlan, setSelectedRazorpayPlan] = useState<{
    name: string;
    amount: number;
    description: string;
  } | undefined>(undefined);

  const handleOpenRazorpay = (plan?: { name: string; amount: number; description: string }) => {
    setSelectedRazorpayPlan(plan);
    setIsRazorpayModalOpen(true);
  };

  // Dynamic calendar schedule calculation for upcoming Tuesday & Friday
  const [batchSchedule, setBatchSchedule] = useState(() => getUpcomingBatchSchedule());
  const [localShortDate, setLocalShortDate] = useState("");
  const curriculumTimelineRef = useRef<HTMLDivElement>(null);

  // Dynamic Intent & UTM State
  const [currentIntent, setCurrentIntent] = useState<PersonaIntent>(PERSONA_INTENTS.default);
  const [detectedParam, setDetectedParam] = useState<string | null>(null);
  const [isIntentSelectorOpen, setIsIntentSelectorOpen] = useState(false);

  useEffect(() => {
    try {
      const { intent, detectedParam } = detectUserIntent();
      setCurrentIntent(intent);
      setDetectedParam(detectedParam);
    } catch (e) {
      console.error("Error detecting user intent", e);
    }
  }, []);

  useEffect(() => {
    try {
      const sched = getUpcomingBatchSchedule();
      setBatchSchedule(sched);
      setLocalShortDate(sched.combinedShortDates);
      // Dynamically inject & sync Open Graph meta tags into document head
      injectOpenGraphMeta({ schedule: sched });
    } catch (e) {
      console.error("Error calculating batch schedule", e);
    }
  }, []);

  useEffect(() => {
    // Occasional simulated seat purchase to create a live sense of urgency
    const interval = setInterval(() => {
      setSeatsLeft((prev) => {
        if (prev <= 4) {
          // Keep it at a low but non-zero number to allow registrations
          return 4;
        }
        // 40% chance of dropping a seat every 15 seconds
        if (Math.random() > 0.6) {
          return prev - 1;
        }
        return prev;
      });
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Generate high-resolution QR code for in-person mobile sharing
    QRCode.toDataURL(inviteUrl, {
      width: 320,
      margin: 2,
      color: {
        dark: '#0F172A',
        light: '#FFFFFF',
      },
      errorCorrectionLevel: 'M',
    })
      .then((url) => {
        setInviteQrCode(url);
        setIsGeneratingQr(false);
      })
      .catch((err) => {
        console.error('Failed to generate invite QR code', err);
        setIsGeneratingQr(false);
      });
  }, [inviteUrl]);

  const handleCopyInvite = () => {
    navigator.clipboard.writeText(inviteUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadInviteQr = () => {
    if (!inviteQrCode) return;
    const a = document.createElement('a');
    a.href = inviteQrCode;
    a.download = 'CodeInIndia-Invite-QR.png';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleScrollToRegister = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const element = document.querySelector('#register');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleScrollToCurriculum = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const element = document.querySelector('#curriculum');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (route === 'verify') {
    return (
      <PublicCertificateVerify
        certificateId={verifyCertId}
        onNavigateHome={() => {
          window.location.hash = '';
          setRoute('public');
        }}
      />
    );
  }

  if (route === 'dashboard') {
    return (
      <StudentDashboard
        onBackToHome={() => {
          window.location.hash = '';
          setRoute('public');
        }}
        onOpenCertificateVerify={(certId) => {
          setVerifyCertId(certId);
          window.location.hash = `#verify/${certId}`;
          setRoute('verify');
        }}
      />
    );
  }

  if (route === 'admin') {
    return (
      <AdminAuthProvider>
        <AdminDashboard
          onNavigatePublic={() => {
            window.location.hash = '';
            setRoute('public');
          }}
        />
      </AdminAuthProvider>
    );
  }

  return (
    <AdminAuthProvider>
      <div className="min-h-screen bg-paper text-ink selection:bg-marigold/30 overflow-x-hidden" id="app-root">
        {/* Accessible Skip to Content Link */}
        <a 
          href="#main-content" 
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-marigold focus:text-ink focus:font-bold focus:rounded-md focus:shadow-lg focus:outline-none"
        >
          Skip to main content
        </a>

        {/* ============ NAVIGATION ============ */}
        <Navbar />

        {/* ============ MAIN CONTENT CONTAINER ============ */}
        <main id="main-content">
          {/* ============ HERO SECTION ============ */}
          <header className="hero relative overflow-hidden py-8 sm:py-14 md:py-20 lg:py-24" id="top">
        {/* Aesthetic background glow effect */}
        <div className="absolute top-[-220px] right-[-180px] w-[560px] h-[560px] rounded-full bg-gradient-to-br from-marigold/10 to-transparent pointer-events-none blur-3xl" />
        
        <div className="wrap hero-grid grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-8 sm:gap-12 lg:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            {/* Badge rows & Live Social Proof */}
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-3.5 sm:mb-5" id="hero-badge-row">
              <span className="pill font-mono text-[0.7rem] sm:text-[0.74rem] font-semibold py-1 sm:py-1.5 px-2.5 sm:px-3.5 rounded-full border border-ink bg-ink text-[#FFD98A] flex items-center gap-1.5 shadow-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-[#5BE3A8] animate-pulse-fast"></span>
                Next Batch — {batchSchedule.nearestBatchFormatted}
              </span>

              {/* Live Active Viewers Counter */}
              <LiveViewerCounter />

              <span className="pill font-mono text-[0.7rem] sm:text-[0.74rem] font-medium py-1 sm:py-1.5 px-2.5 sm:px-3.5 rounded-full border border-border-custom bg-card text-ink-soft">
                Hindi + English
              </span>
              <span className="pill font-mono text-[0.7rem] sm:text-[0.74rem] font-medium py-1 sm:py-1.5 px-2.5 sm:px-3.5 rounded-full border border-border-custom bg-card text-ink-soft">
                Live on Zoom
              </span>
            </div>

            {/* Display heading */}
            <h1 className="font-display text-3xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.15] sm:leading-[1.1] tracking-tight mb-3.5 sm:mb-6 text-ink">
              Stop watching tutorials.<br />
              <span className="relative inline-block mt-1">
                <span className="relative z-10">Start shipping</span>
                <span className="absolute left-[-2%] bottom-[6%] w-[104%] h-[32%] bg-marigold/35 rounded-sm z-0"></span>
              </span> real products.
            </h1>

            {/* Dynamic Subtext description tailored to inferred intent / UTM */}
            <motion.div
              key={currentIntent.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
              className="mb-3 sm:mb-5 max-w-[540px]"
            >
              <p className="text-ink-soft text-base sm:text-lg md:text-xl font-normal leading-normal sm:leading-relaxed">
                {currentIntent.subheading}
              </p>
              {currentIntent.id !== 'default' && (
                <div className="mt-2.5 flex items-center gap-2 text-xs font-mono text-peacock font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-peacock" />
                  <span>Curated Focus: {currentIntent.recommendedFocus}</span>
                </div>
              )}
            </motion.div>

            {/* Dynamic Time to Ship Counter */}
            <TimeToShipCounter />

            {/* Action CTAs */}
            <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3.5 items-stretch sm:items-center mb-3 sm:mb-5">
              <a 
                href="#register" 
                onClick={handleScrollToRegister}
                className="btn btn-primary text-base sm:text-[1.02rem] py-3.5 sm:py-4 px-6 text-center justify-center shadow-md font-bold"
                id="hero-primary-cta"
              >
                {currentIntent.ctaText}
              </a>
              <a 
                href="#curriculum" 
                onClick={handleScrollToCurriculum}
                className="btn btn-ghost text-sm sm:text-[1.02rem] py-2.5 sm:py-3.5 justify-center group"
                id="hero-secondary-cta"
              >
                <span>See the curriculum</span>
                <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </a>
            </div>

            {/* Pricing notes */}
            <p className="text-[0.78rem] sm:text-[0.9rem] text-muted mb-4 sm:mb-7 font-normal">
              Reserve your seat now · Limited spots available · Certificate + recording included
            </p>

            {/* Stats list */}
            <div className="grid grid-cols-3 gap-3 sm:gap-6 pt-3.5 sm:pt-6 border-t border-border-custom/50 max-w-[480px]">
              <div>
                <strong className="block font-display text-xl sm:text-2xl font-bold text-ink leading-tight">1,200+</strong>
                <span className="text-[0.7rem] sm:text-xs text-ink-soft font-medium">builders trained</span>
              </div>
              <div>
                <strong className="block font-display text-xl sm:text-2xl font-bold text-ink leading-tight flex items-center gap-1">
                  4.8 <Star className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-marigold text-marigold" />
                </strong>
                <span className="text-[0.7rem] sm:text-xs text-ink-soft font-medium">average rating</span>
              </div>
              <div>
                <strong className="block font-display text-xl sm:text-2xl font-bold text-ink leading-tight">3 hrs</strong>
                <span className="text-[0.7rem] sm:text-xs text-ink-soft font-medium">live session</span>
              </div>
            </div>
          </motion.div>

          {/* Right Column (Terminal Sign) */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            className="flex flex-col items-center justify-center w-full"
          >
            <TerminalReplay />
            <p className="text-center font-sans text-[0.84rem] text-muted mt-4 select-none">
              This is a replay of what students ship in their first week.
            </p>
          </motion.div>
        </div>
      </header>

      {/* ============ TRUST STRIP ============ */}
      <section className="bg-ink text-[#EDEFF8] py-6 border-y border-border-custom/10 overflow-hidden" id="trust-strip-sec">
        <div className="wrap flex flex-wrap justify-between gap-y-4 gap-x-6 text-[0.92rem] font-medium">
          {[
            {
              id: 'trust-item-beginner',
              icon: Star,
              iconColor: 'text-marigold fill-marigold',
              haloColor: 'bg-marigold/20',
              text: 'Beginner friendly — zero coding needed',
            },
            {
              id: 'trust-item-cert',
              icon: Award,
              iconColor: 'text-[#5BE3A8]',
              haloColor: 'bg-[#5BE3A8]/20',
              text: 'Certificate of completion',
            },
            {
              id: 'trust-item-access',
              icon: Clock,
              iconColor: 'text-marigold',
              haloColor: 'bg-marigold/20',
              text: 'Lifetime access to recordings',
            },
            {
              id: 'trust-item-support',
              icon: MessageCircle,
              iconColor: 'text-[#5BE3A8]',
              haloColor: 'bg-[#5BE3A8]/20',
              text: 'WhatsApp community support',
            },
          ].map((item, idx) => {
            const IconComponent = item.icon;
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-20px' }}
                transition={{ duration: 0.5, delay: idx * 0.1, ease: 'easeOut' }}
                className="flex items-center gap-2.5 group cursor-default"
                id={item.id}
              >
                <div className="relative flex items-center justify-center flex-none">
                  {/* Subtle blooming pulse halo behind icon on viewport entry */}
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    whileInView={{ 
                      scale: [0.8, 1.6, 1], 
                      opacity: [0, 0.9, 0.45] 
                    }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 0.85,
                      delay: idx * 0.12 + 0.08,
                      ease: "easeOut"
                    }}
                    className={`absolute inset-0 -m-1.5 rounded-full ${item.haloColor} blur-[2px] pointer-events-none`}
                  />

                  {/* Micro-interaction animation on viewport entry & hover */}
                  <motion.div
                    initial={{ scale: 0.7, rotate: -10 }}
                    whileInView={{ 
                      scale: [0.7, 1.35, 0.92, 1.12, 1],
                      rotate: [-10, 8, -4, 2, 0]
                    }}
                    viewport={{ once: true }}
                    whileHover={{ 
                      scale: 1.25, 
                      rotate: [0, -8, 8, 0],
                      transition: { duration: 0.35, ease: "easeInOut" } 
                    }}
                    transition={{ 
                      duration: 0.8, 
                      delay: idx * 0.12,
                      ease: [0.34, 1.56, 0.64, 1] 
                    }}
                    className="relative z-10 flex items-center justify-center"
                  >
                    <IconComponent className={`w-4 h-4 ${item.iconColor} transition-transform duration-200`} />
                  </motion.div>
                </div>

                <span className="group-hover:text-white transition-colors duration-200">
                  {item.text}
                </span>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ============ WHAT YOU'LL BUILD SECTION ============ */}
      <section id="build" className="py-20 md:py-24">
        <div className="wrap">
          <motion.div 
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="text-center max-w-2xl mx-auto mb-14"
          >
            <span className="eyebrow-line">Portfolio, not certificates</span>
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-extrabold text-ink mb-4 leading-tight mt-1">
              Three real products. Built by you.
            </h2>
            <p className="text-muted text-[1.08rem] leading-relaxed">
              Every class ends with something live on the internet — a link you can send to a client, an employer, or your first customer.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[22px] mt-11" id="build-cards-grid">
            {BUILD_CARDS.map((card, idx) => (
              <motion.article 
                key={card.id}
                initial={{ opacity: 0, y: 40, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, amount: 0.15 }}
                whileHover={{ y: -8, transition: { duration: 0.25, ease: "easeOut" } }}
                transition={{ duration: 0.65, delay: idx * 0.15, ease: [0.16, 1, 0.3, 1] }}
                className="bg-card border border-border-custom rounded-custom p-6 sm:p-7 transition-shadow duration-300 hover:shadow-custom flex flex-col justify-between group cursor-default relative overflow-hidden"
              >
                <div>
                  {/* Dynamic Device Mockup Representation */}
                  <div className="h-[135px] rounded-custom-sm mb-6 flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-[#EEF0F8] to-[#E2E6F2] dark:from-[#172033] dark:to-[#0F172A] border border-border-custom/30 group-hover:border-peacock/30 transition-colors">
                    {card.type === 'web' && (
                      <div className="w-full h-full relative group-hover:scale-[1.03] transition-transform duration-500" aria-hidden="true">
                        <div className="absolute top-[14px] left-[14px] right-[14px] bg-white dark:bg-slate-700/80 rounded-md shadow-sm h-4"></div>
                        <div className="absolute top-[42px] left-[14px] w-[56%] h-[52px] bg-white dark:bg-slate-700/80 rounded-md shadow-sm"></div>
                        <div className="absolute top-[42px] right-[14px] w-[32%] h-[52px] bg-marigold rounded-md shadow-sm"></div>
                        <div className="absolute top-[104px] left-[14px] right-[14px] h-[12px] bg-white dark:bg-slate-700/80 rounded-md shadow-sm"></div>
                      </div>
                    )}

                    {card.type === 'saas' && (
                      <div className="w-full h-full relative group-hover:scale-[1.03] transition-transform duration-500" aria-hidden="true">
                        <div className="absolute top-[14px] left-[14px] w-[26%] bottom-[14px] bg-white dark:bg-slate-700/80 rounded-md shadow-sm"></div>
                        <div className="absolute top-[14px] left-[calc(26%+26px)] right-[14px] h-[34px] bg-white dark:bg-slate-700/80 rounded-md shadow-sm"></div>
                        <div className="absolute top-[60px] left-[calc(26%+26px)] w-[30%] h-[56px] bg-peacock rounded-md shadow-sm"></div>
                        <div className="absolute top-[60px] left-[calc(26%+26px+30%+12px)] right-[14px] h-[56px] bg-white dark:bg-slate-700/80 rounded-md shadow-sm"></div>
                      </div>
                    )}

                    {card.type === 'app' && (
                      <div className="w-full h-full flex items-center justify-center relative group-hover:scale-[1.04] transition-transform duration-500" aria-hidden="true">
                        <div className="w-16 h-28 bg-white dark:bg-slate-800 rounded-xl shadow-md border border-border-custom/20 relative overflow-hidden">
                          <div className="absolute top-2.5 left-2.5 right-2.5 h-8 bg-marigold rounded-[7px]"></div>
                          <div className="absolute top-12 left-2.5 right-2.5 bottom-2 bg-[#EEF0F8] dark:bg-slate-700/60 rounded-[7px]"></div>
                        </div>
                      </div>
                    )}

                    {/* Subtle Tech Stack Hover Badge overlay */}
                    <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                      <span className="text-[0.62rem] font-mono font-bold bg-ink/80 text-white px-2 py-0.5 rounded-md backdrop-blur-xs flex items-center gap-1 shadow-sm">
                        <Cpu className="w-2.5 h-2.5 text-marigold" /> Stack specs
                      </span>
                    </div>
                  </div>

                  <h3 className="font-display text-xl font-bold text-ink mb-2 group-hover:text-peacock transition-colors flex items-center justify-between">
                    <span>{card.title}</span>
                  </h3>
                  <p className="text-muted text-[0.94rem] leading-relaxed mb-3">{card.description}</p>
                </div>

                <div className="mt-auto">
                  {/* Default Tag Row */}
                  <div className="flex flex-wrap gap-1.5 pt-2 mb-2">
                    {card.tags.map(tag => (
                      <span key={tag} className="font-mono text-[0.72rem] font-semibold text-peacock bg-peacock/10 py-1 px-2.5 rounded-full border border-peacock/20">
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Expandable Tech Stack Details Drawer with smooth CSS/motion transition */}
                  <div className="mt-2 pt-3 border-t border-border-custom/60">
                    <div className="flex items-center justify-between text-xs text-muted mb-2 select-none">
                      <span className="font-mono font-bold text-[0.7rem] uppercase tracking-wider text-ink-soft dark:text-gray-300 flex items-center gap-1.5">
                        <Layers className="w-3.5 h-3.5 text-peacock" />
                        <span>Technology Stack</span>
                      </span>
                      <span className="text-[0.68rem] font-mono text-peacock font-semibold group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
                        <span>Details</span>
                        <ChevronDown className="w-3 h-3 group-hover:rotate-180 transition-transform duration-300" />
                      </span>
                    </div>

                    {/* Tech items pill grid with micro hover reveal */}
                    <div className="grid grid-cols-1 gap-1.5 max-h-0 sm:max-h-16 group-hover:max-h-48 overflow-hidden transition-all duration-500 ease-in-out opacity-75 group-hover:opacity-100">
                      <div className="flex flex-wrap gap-1 pt-1">
                        {card.techStack?.map(tech => (
                          <span 
                            key={tech.name}
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[0.68rem] font-mono bg-paper dark:bg-[#1E293B] border border-border-custom/70 text-ink dark:text-gray-200"
                            title={`${tech.category}: ${tech.name}`}
                          >
                            <span className="w-1 h-1 rounded-full bg-peacock" />
                            <strong className="font-semibold">{tech.name}</strong>
                            <span className="text-[0.6rem] text-muted">({tech.category})</span>
                          </span>
                        ))}
                      </div>
                      <p className="text-[0.72rem] text-muted italic pt-1 border-t border-border-custom/30 mt-1">
                        ✨ <span className="font-semibold text-ink-soft dark:text-gray-300">Deliverable:</span> {card.deliverables}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* ============ CURRICULUM SECTION ============ */}
      <section id="curriculum" className="py-20 md:py-24 bg-card border-y border-border-custom">
        <div className="wrap">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
            <div className="max-w-2xl">
              <span className="eyebrow-line">4 weeks, 4 launches</span>
              <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-extrabold text-ink mb-4 mt-1">
                The curriculum is a shipping schedule.
              </h2>
              <p className="text-muted text-[1.08rem] leading-relaxed">
                Weeks are numbered because each one depends on the last — and each one ends with a deploy.
              </p>
            </div>

            {/* Download Syllabus PDF Button */}
            <div className="flex-none">
              <button
                type="button"
                onClick={() => generateCurriculumPDF()}
                className="btn btn-outline border-peacock/40 text-peacock hover:bg-peacock hover:text-white px-5 py-3 rounded-xl font-bold flex items-center gap-2.5 shadow-xs transition-all cursor-pointer group"
                id="download-syllabus-header-btn"
                title="Download 4-Week Curriculum & Roadmap as a PDF document"
              >
                <FileDown className="w-4 h-4 text-marigold-deep group-hover:text-white transition-colors" />
                <span className="text-sm">Download Syllabus (PDF)</span>
              </button>
            </div>
          </div>

          {/* Progress bar below curriculum timeline headers */}
          <CurriculumProgressBar timelineRef={curriculumTimelineRef} />

          <div ref={curriculumTimelineRef} className="mt-8 flex flex-col" id="curriculum-timeline">
            {CURRICULUM_WEEKS.map((week, idx) => {
              const getSkillBadgeColor = (level: 'Beginner' | 'Intermediate' | 'Advanced') => {
                switch (level) {
                  case 'Beginner':
                    return 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20';
                  case 'Intermediate':
                    return 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border border-blue-500/20';
                  case 'Advanced':
                    return 'bg-rose-500/10 text-rose-700 dark:text-rose-400 border border-rose-500/20';
                  default:
                    return 'bg-muted/10 text-muted border border-muted/20';
                }
              };

              return (
                <motion.div 
                  key={week.weekNo}
                  id={`curriculum-week-${week.weekNo}`}
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className="grid grid-cols-1 md:grid-cols-[110px_1fr] gap-4 md:gap-7 py-8 border-b border-border-custom last:border-b-0 scroll-mt-24"
                >
                  <div className="flex flex-col md:text-left">
                    <span className="font-display font-extrabold text-xl text-marigold-deep">Week {week.weekNo}</span>
                    <span className="font-mono text-[0.72rem] text-muted tracking-wider uppercase mt-1 md:mt-2">
                      {week.phase}
                    </span>
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-2.5 mb-2">
                      <h3 className="font-display text-xl md:text-2xl font-bold text-ink leading-tight">{week.title}</h3>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[0.68rem] font-mono font-semibold tracking-wide border ${getSkillBadgeColor(week.skillLevel)}`}>
                        {week.skillLevel}
                      </span>
                    </div>
                    <p className="text-muted text-[0.97rem] max-w-3xl leading-relaxed mb-4">{week.description}</p>
                    <div className="flex items-center gap-2 text-[0.86rem] font-semibold text-peacock font-sans">
                      <ArrowRight className="w-4 h-4 text-marigold-deep flex-none" />
                      <span>You ship: {week.shipProject}</span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Download Full Syllabus Banner Card */}
          <div className="mt-8 p-5 sm:p-6 bg-paper/80 border border-peacock/20 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-peacock/10 text-peacock flex items-center justify-center flex-none">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-display font-bold text-ink text-base">
                  Need the offline syllabus for review or employer sponsorship?
                </h4>
                <p className="text-xs text-muted">
                  Get the complete 4-week module breakdown, tech stack checklists, and project rubrics in PDF format.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => generateCurriculumPDF()}
              className="btn btn-primary px-5 py-2.5 text-xs sm:text-sm font-bold flex items-center gap-2 flex-none cursor-pointer shadow-sm"
              id="download-syllabus-banner-btn"
            >
              <Download className="w-4 h-4" />
              <span>Download Syllabus (PDF)</span>
            </button>
          </div>

          {/* ============ INTERACTIVE ROADMAP VISUALIZATION ============ */}
          <InteractiveRoadmap />

          {/* ============ SKILLS ACQUIRED PROGRESS VISUALIZATION ============ */}
          <SkillsAcquiredChart />
        </div>
      </section>

      {/* ============ STUDENT SHOWCASE SECTION ============ */}
      <StudentShowcase />

      {/* ============ VERIFIED CERTIFICATE PREVIEW SECTION ============ */}
      <CertificatePreview />

      {/* ============ PARTICIPATION CERTIFICATE REQUEST & VERIFICATION SECTION ============ */}
      <ParticipationCertificateSection />

      {/* ============ STUDENT OUTCOMES & PLACEMENT BAR CHART ============ */}
      <StudentOutcomes />

      {/* ============ AUDIENCE SECTION ============ */}
      <section className="py-20 md:py-24 bg-paper" id="audience-sec">
        <div className="wrap">
          <motion.div 
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="text-center max-w-2xl mx-auto mb-14"
          >
            <span className="eyebrow-line">Who this is for</span>
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-extrabold text-ink mb-4 mt-1">
              Built for people who want to build.
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[18px]">
            {AUDIENCE_CARDS.map((aud, idx) => {
              const isMatched = 
                (currentIntent.id === 'student_builder' && aud.title.toLowerCase().includes('student')) ||
                (currentIntent.id === 'career_changer' && aud.title.toLowerCase().includes('working')) ||
                (currentIntent.id === 'founder' && aud.title.toLowerCase().includes('founder')) ||
                ((currentIntent.id === 'freelancer' || currentIntent.id === 'non_tech') && aud.title.toLowerCase().includes('business'));

              return (
                <motion.div
                  key={aud.title}
                  initial={{ opacity: 0, y: 35, scale: 0.94 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true, amount: 0.2 }}
                  whileHover={{ y: -6, scale: 1.02, transition: { duration: 0.2, ease: "easeOut" } }}
                  transition={{ duration: 0.55, delay: idx * 0.12, ease: [0.22, 1, 0.36, 1] }}
                  className={`bg-card rounded-custom-sm p-6 flex flex-col justify-between hover:border-peacock/40 hover:shadow-custom transition-all group cursor-default relative overflow-hidden ${
                    isMatched 
                      ? 'border-2 border-peacock dark:border-peacock shadow-md ring-2 ring-peacock/20' 
                      : 'border border-border-custom'
                  }`}
                >
                  {isMatched && (
                    <div className="absolute top-2 right-2 bg-peacock text-white text-[0.62rem] font-mono font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
                      <Sparkles className="w-2.5 h-2.5" />
                      <span>Your Inferred Track</span>
                    </div>
                  )}
                  <div>
                    <motion.span 
                      className="text-3xl inline-block mb-4 select-none"
                      whileHover={{ scale: 1.25, rotate: [0, -10, 10, 0], transition: { duration: 0.3 } }}
                    >
                      {aud.emoji}
                    </motion.span>
                    <b className={`block font-display text-[1.02rem] font-bold mb-1.5 transition-colors ${
                      isMatched ? 'text-peacock' : 'text-ink group-hover:text-peacock'
                    }`}>{aud.title}</b>
                    <span className="text-[0.88rem] text-muted leading-relaxed block">{aud.description}</span>
                  </div>
                </motion.div>
              );
            })}
          </div>

          <SalaryGrowthChart />
        </div>
      </section>

      {/* ============ MEET THE TRAINER SECTION ============ */}
      <TrainerSection />

      {/* ============ TESTIMONIALS SECTION ============ */}
      <section className="py-20 md:py-24 bg-paper" id="testimonials-sec">
        <div className="wrap">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="eyebrow-line">Student results</span>
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-extrabold text-ink mb-4 mt-1">
              They started exactly where you are.
            </h2>
          </div>

          {/* Video Player Showcase */}
          <TestimonialVideoPlayer />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[22px]">
            {TESTIMONIALS.map((test, idx) => (
              <motion.article 
                key={test.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.15 }}
                className="bg-card border border-border-custom rounded-custom p-6.5 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow"
              >
                <div>
                  {/* Five stars */}
                  <div className="flex gap-0.5 text-marigold mb-4" aria-label="5 stars rating">
                    {[...Array(test.stars)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current text-marigold" />
                    ))}
                  </div>
                  <p className="text-ink-soft text-[0.95rem] italic leading-relaxed mb-6 font-medium">
                    "{test.quote}"
                  </p>
                </div>

                <div className="flex items-center gap-3.5 border-t border-border-custom/40 pt-4 mt-auto">
                  <div className="w-[42px] h-[42px] rounded-full bg-peacock text-white flex items-center justify-center font-display font-bold text-sm select-none">
                    {test.initials}
                  </div>
                  <div>
                    <b className="block font-sans text-[0.92rem] text-ink font-bold leading-tight">{test.name}</b>
                    <span className="text-[0.8rem] text-muted block mt-0.5">
                      {test.location} · {test.project}
                    </span>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>

          {/* 100% Money-Back Guarantee Visual Badge on Testimonials */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-8 p-4 sm:p-5 rounded-2xl bg-emerald-500/8 dark:bg-emerald-500/10 border border-emerald-500/25 flex flex-col sm:flex-row items-center justify-between gap-4 max-w-4xl mx-auto text-center sm:text-left"
            id="testimonials-guarantee-badge"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center flex-none">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-display font-bold text-sm text-ink dark:text-white flex items-center gap-1.5 justify-center sm:justify-start">
                  <span>100% Money-Back Guarantee on All Tracks</span>
                  <span className="bg-emerald-500 text-white font-mono text-[0.62rem] px-1.5 py-0.5 rounded uppercase font-extrabold tracking-wide">
                    Risk-Free
                  </span>
                </h4>
                <p className="text-xs text-muted mt-0.5">
                  Attend the first live class. If you don't find it remarkably valuable, request a 100% immediate refund — zero risk.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsGuaranteeModalOpen(true)}
              className="btn btn-ghost text-xs font-bold text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/10 whitespace-nowrap cursor-pointer flex-none px-4 py-2"
              id="testimonials-view-guarantee-btn"
            >
              Read Guarantee Terms →
            </button>
          </motion.div>

          {/* Copyable Invite link & In-Person QR Code widget */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-16 max-w-3xl mx-auto bg-card border border-border-custom rounded-custom p-6 sm:p-8 text-left relative overflow-hidden shadow-sm hover:shadow-custom-sm transition-all"
            id="invite-share-card"
          >
            {/* Subtle background glow */}
            <div className="absolute -top-10 -right-10 w-44 h-44 bg-marigold/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-10 -left-10 w-44 h-44 bg-peacock/10 rounded-full blur-3xl pointer-events-none" />
            
            <div className="relative z-10">
              <div className="text-center sm:text-left mb-6">
                <span className="inline-flex items-center gap-1.5 bg-marigold/10 text-marigold-deep dark:text-marigold font-mono text-[0.72rem] font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-2.5">
                  <Users className="w-3.5 h-3.5 animate-pulse" /> Invite Friends & Colleagues
                </span>
                <h3 className="font-display text-xl sm:text-2xl font-extrabold text-ink mb-1.5">Know someone who wants to learn coding?</h3>
                <p className="text-muted text-[0.92rem] leading-relaxed max-w-xl">
                  Share CodeInIndia with friends, classmates, or colleagues so they can reserve their seats in the next live batch!
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                {/* Left Side: Copy link & Social Share buttons */}
                <div className="md:col-span-7 flex flex-col gap-3.5">
                  <div>
                    <label className="block text-xs font-semibold text-ink-soft mb-1.5">
                      Direct Invite Link
                    </label>
                    <div className="bg-paper border border-border-custom px-3.5 py-2.5 rounded-custom-sm font-mono text-xs text-ink-soft select-all flex items-center justify-between overflow-x-auto whitespace-nowrap min-h-[42px] scrollbar-none shadow-2xs">
                      <span>{inviteUrl}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2.5 pt-1">
                    <button
                      onClick={handleCopyInvite}
                      className="btn btn-primary font-semibold py-2.5 px-4 flex items-center justify-center gap-2 text-xs sm:text-sm cursor-pointer whitespace-nowrap flex-1"
                      id="copy-invite-link-btn"
                      type="button"
                    >
                      {copied ? (
                        <>
                          <Check className="w-4 h-4 text-white" />
                          <span>Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4 text-white" />
                          <span>Copy Link</span>
                        </>
                      )}
                    </button>
                    
                    <a
                      href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`Hey! Check out CodeInIndia — live hands-on coding cohort to build dynamic websites, SaaS & apps: ${inviteUrl}`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn bg-[#25D366] hover:bg-[#1EBE5D] text-white hover:text-white font-semibold py-2.5 px-4 flex items-center justify-center gap-2 text-xs sm:text-sm cursor-pointer whitespace-nowrap transition-all hover:shadow-md flex-1"
                      id="share-whatsapp-btn"
                    >
                      <MessageCircle className="w-4 h-4 text-white fill-current" />
                      <span>WhatsApp</span>
                    </a>

                    <a
                      href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(inviteUrl)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn bg-[#0077b5] hover:bg-[#006297] text-white hover:text-white font-semibold py-2.5 px-4 flex items-center justify-center gap-2 text-xs sm:text-sm cursor-pointer whitespace-nowrap transition-all hover:shadow-md flex-1 sm:flex-none"
                      id="share-linkedin-btn"
                    >
                      <Linkedin className="w-4 h-4 text-white fill-current" />
                      <span>LinkedIn</span>
                    </a>
                  </div>

                  <p className="text-[0.78rem] text-muted flex items-center gap-1.5 pt-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 flex-none" />
                    <span>Free seat reservation with instant orientation details.</span>
                  </p>
                </div>

                {/* Right Side: Dynamically Generated In-Person QR Code */}
                <div className="md:col-span-5 flex flex-col items-center justify-center p-4 rounded-2xl bg-paper/80 dark:bg-[#0B1120]/80 border border-border-custom text-center shadow-2xs relative group">
                  <div className="flex items-center gap-1.5 mb-2.5 text-ink-soft">
                    <QrCode className="w-3.5 h-3.5 text-marigold-deep dark:text-marigold" />
                    <span className="font-mono text-[0.72rem] font-bold uppercase tracking-wider text-ink">
                      In-Person Mobile Scan
                    </span>
                  </div>

                  {/* QR Code Container */}
                  <div className="relative p-2.5 bg-white rounded-xl shadow-xs border border-slate-200/80 transition-transform group-hover:scale-102">
                    {isGeneratingQr || !inviteQrCode ? (
                      <div className="w-36 h-36 flex items-center justify-center bg-slate-100 rounded-lg animate-pulse text-muted text-xs">
                        Generating QR...
                      </div>
                    ) : (
                      <img
                        src={inviteQrCode}
                        alt="Dynamic QR Code for CodeInIndia Invite"
                        className="w-36 h-36 rounded-lg block"
                        id="invite-qr-code-img"
                        loading="lazy"
                      />
                    )}
                  </div>

                  <p className="text-[0.72rem] text-muted mt-2.5 leading-tight max-w-[200px]">
                    Scan with camera or Google Lens to open invite link directly on phone
                  </p>

                  {inviteQrCode && (
                    <button
                      type="button"
                      onClick={handleDownloadInviteQr}
                      className="mt-2 text-[0.72rem] font-semibold text-peacock hover:text-peacock/80 dark:text-cyan-400 flex items-center gap-1 cursor-pointer transition-colors py-1 px-2.5 rounded-md hover:bg-paper"
                      id="download-invite-qr-btn"
                    >
                      <Download className="w-3 h-3" />
                      <span>Download QR</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ============ VERIFIED BY LINKEDIN SECTION ============ */}
      <VerifiedLinkedInSection />

      {/* ============ COUNTDOWN BAND SECTION ============ */}
      <section className="py-10 md:py-14" id="countdown-banner">
        <div className="wrap">
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-marigold to-marigold-deep rounded-[22px] py-10 px-8 md:px-12 flex flex-wrap justify-between items-center gap-8 shadow-lg text-ink"
          >
            <div className="max-w-md">
              <h3 className="font-display text-2xl md:text-3xl font-extrabold text-ink leading-tight">
                Next Live Batch Starts {batchSchedule.nearestBatchFormatted}
              </h3>
              <p className="text-[0.94rem] text-ink/75 font-medium mt-2 leading-relaxed">
                Seats are capped so every student gets doubt-solving time. {seatsLeft} of 200 left.
              </p>
            </div>

            {/* Live interactive countdown timer */}
            <CountdownTimer />

            <div>
              <a 
                href="#register" 
                onClick={handleScrollToRegister}
                className="btn btn-dark w-full sm:w-auto px-8 py-4.5 rounded-full font-bold shadow-md hover:bg-ink/90 transition-colors"
                id="countdown-band-cta"
              >
                Reserve my seat
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ============ PRICING & SEAT RESERVATION SECTION ============ */}
      <section id="pricing" className="py-20 md:py-24 bg-card border-y border-border-custom scroll-mt-16">
        <div className="wrap">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="eyebrow-line">Cohort & Workshop Tracks</span>
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-extrabold text-ink mb-4 mt-1">
              Choose Your AI Building Path.
            </h2>
            <p className="text-muted text-[1.05rem] leading-relaxed mb-5">
              From a free beginner masterclass to live intensive website & mobile app builder sprints. Build with AI and ship real products.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <div className="inline-flex items-center gap-2 bg-peacock/10 border border-peacock/30 px-3.5 py-1.5 rounded-full text-xs font-semibold text-peacock">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>Razorpay Standard Checkout & Instant HMAC Signature Verification active</span>
                <button 
                  onClick={() => handleOpenRazorpay({
                    name: 'Razorpay Test Checkout',
                    amount: 1,
                    description: 'Quick ₹1 test transaction to test Razorpay test mode payment flow & signature verification'
                  })}
                  className="underline hover:text-ink font-bold ml-1 cursor-pointer"
                  id="qa-test-razorpay-btn"
                >
                  Test ₹1 Checkout →
                </button>
              </div>

              <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 px-3.5 py-1.5 rounded-full text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>100% Money-Back Guarantee · 24-hr Policy</span>
                <button
                  type="button"
                  onClick={() => setIsGuaranteeModalOpen(true)}
                  className="underline hover:text-ink dark:hover:text-white font-bold ml-1 cursor-pointer"
                  id="pricing-guarantee-terms-btn"
                >
                  Read Policy →
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto mt-11 items-stretch">
            {/* CARD 1: FREE LIVE MASTERCLASS */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="bg-paper/60 border border-border-custom rounded-custom p-7 sm:p-8 flex flex-col justify-between relative shadow-sm hover:shadow-md transition-all hover:border-peacock/40 group"
              id="card-free-masterclass"
            >
              <div>
                {/* Badge */}
                <div className="flex items-center justify-between gap-2 mb-4">
                  <span className="bg-peacock/10 text-peacock font-mono text-[0.7rem] font-bold py-1 px-3 rounded-full uppercase tracking-wider border border-peacock/25 flex items-center gap-1.5">
                    <Sparkles className="w-3 h-3 text-peacock" />
                    <span>START HERE</span>
                  </span>
                  <span className="text-[0.72rem] font-mono text-muted flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Live Session
                  </span>
                </div>

                <h3 className="font-display text-2xl font-bold text-ink mb-2">Live AI Masterclass</h3>
                <p className="text-muted text-[0.92rem] leading-relaxed mb-6">
                  One live session to discover how you can build real websites and apps using AI — even without traditional coding.
                </p>

                <div className="mb-6 p-4 rounded-2xl bg-card border border-border-custom/80">
                  <div className="font-display text-4xl font-black text-peacock mb-1 flex items-baseline gap-2">
                    FREE
                  </div>
                  <p className="text-xs text-muted font-medium">Reserve your seat at no cost</p>
                </div>

                <div className="border-t border-border-custom/50 pt-5 mb-8">
                  <p className="text-xs font-bold uppercase tracking-wider text-muted font-mono mb-3.5">
                    What's Included:
                  </p>
                  <ul className="flex flex-col gap-3 text-[0.9rem] text-ink-soft" id="masterclass-benefits-list">
                    <li className="flex gap-2.5 items-start">
                      <Check className="w-4.5 h-4.5 text-peacock flex-none mt-0.5" />
                      <span>Live hands-on AI building session</span>
                    </li>
                    <li className="flex gap-2.5 items-start">
                      <Check className="w-4.5 h-4.5 text-peacock flex-none mt-0.5" />
                      <span>See a real dynamic website built with AI</span>
                    </li>
                    <li className="flex gap-2.5 items-start">
                      <Check className="w-4.5 h-4.5 text-peacock flex-none mt-0.5" />
                      <span>Learn the AI tools and workflow</span>
                    </li>
                    <li className="flex gap-2.5 items-start">
                      <Check className="w-4.5 h-4.5 text-peacock flex-none mt-0.5" />
                      <span className="font-semibold text-ink">Beginner friendly — no coding experience required</span>
                    </li>
                    <li className="flex gap-2.5 items-start">
                      <Check className="w-4.5 h-4.5 text-peacock flex-none mt-0.5" />
                      <span>Recording access</span>
                    </li>
                    <li className="flex gap-2.5 items-start">
                      <Check className="w-4.5 h-4.5 text-peacock flex-none mt-0.5" />
                      <span>Certificate of participation</span>
                    </li>
                    <li className="flex gap-2.5 items-start">
                      <Check className="w-4.5 h-4.5 text-peacock flex-none mt-0.5" />
                      <span>Official WhatsApp community access</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <a 
                  href="#register" 
                  onClick={handleScrollToRegister}
                  className="btn btn-primary w-full py-3.5 text-center justify-center font-bold text-sm flex items-center gap-2 shadow-sm cursor-pointer"
                  id="masterclass-primary-cta"
                >
                  <span>Reserve My Free Seat</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
                <p className="text-center text-[0.76rem] text-muted flex items-center justify-center gap-1.5 font-medium pt-1">
                  <Clock className="w-3.5 h-3.5 text-amber-500" />
                  <span>Limited seats available</span>
                </p>
              </div>
            </motion.div>

            {/* CARD 2: DYNAMIC WEBSITE BUILDER WORKSHOP (MOST POPULAR / PRIMARY CONVERSION) */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-card border-2 border-marigold dark:border-marigold/90 rounded-custom p-7 sm:p-8 flex flex-col justify-between relative shadow-xl hover:shadow-2xl transition-all ring-1 ring-marigold/20 lg:-translate-y-2.5 group"
              id="card-website-workshop"
            >
              {/* Floating Most Popular Badge */}
              <div className="absolute top-[-13px] left-1/2 -translate-x-1/2 sm:left-8 sm:translate-x-0 bg-marigold text-ink font-mono text-[0.7rem] font-black py-1 px-4 rounded-full uppercase tracking-wider shadow-md flex items-center gap-1.5 select-none z-10 border border-ink/20">
                <Sparkles className="w-3 h-3 fill-ink text-ink" />
                <span>MOST POPULAR</span>
              </div>

              <div>
                <div className="flex items-center justify-between gap-2 mb-2 mt-2">
                  <span className="text-[0.7rem] font-mono font-bold uppercase tracking-wider text-marigold-deep dark:text-marigold bg-marigold/15 px-2.5 py-0.5 rounded-md">
                    1 FULL-DAY INTENSIVE
                  </span>
                  <span className="text-[0.7rem] font-mono text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                    Build & Deploy Live
                  </span>
                </div>

                <h3 className="font-display text-2xl font-extrabold text-ink mb-1.5">
                  1-Day Dynamic Website Workshop
                </h3>
                <p className="text-muted text-[0.92rem] leading-relaxed mb-5 font-normal">
                  One full intensive day. Build and ship 5 real websites with AI.
                </p>

                {/* Outcome Highlight Box */}
                <div className="mb-5 p-4 rounded-2xl bg-gradient-to-br from-marigold/15 via-paper to-peacock/10 border border-marigold/40 text-center relative overflow-hidden shadow-xs">
                  <div className="text-[0.68rem] font-mono font-extrabold uppercase tracking-widest text-marigold-deep dark:text-marigold mb-1">
                    WHAT YOU'LL SHIP
                  </div>
                  <div className="font-display text-3xl sm:text-4xl font-black text-ink tracking-tight mb-1">
                    5 LIVE WEBSITES
                  </div>
                  <div className="text-[0.72rem] font-mono font-bold text-ink-soft bg-paper/90 dark:bg-[#141B2D]/90 py-1 px-2.5 rounded-lg border border-border-custom inline-block mb-2 shadow-2xs">
                    1 FULL DAY • HANDS-ON • BUILD + DEPLOY
                  </div>

                  {/* Mini Visual Process */}
                  <div className="flex items-center justify-center gap-1.5 text-[0.68rem] font-mono font-semibold text-muted pt-1 border-t border-border-custom/40">
                    <span className="text-ink font-bold">Learn</span>
                    <span>→</span>
                    <span className="text-ink font-bold">Build</span>
                    <span>→</span>
                    <span className="text-ink font-bold">Deploy</span>
                    <span>→</span>
                    <span className="text-peacock font-bold">Repeat</span>
                  </div>
                  <p className="text-[0.72rem] text-muted font-medium mt-1">
                    5 websites shipped in one intensive day
                  </p>
                </div>

                <div className="border-t border-border-custom/50 pt-5 mb-7">
                  <p className="text-xs font-bold uppercase tracking-wider text-muted font-mono mb-3.5">
                    Workshop Benefits & Deliverables:
                  </p>
                  <ul className="flex flex-col gap-2.5 text-[0.88rem] text-ink-soft" id="website-workshop-benefits-list">
                    <li className="flex gap-2.5 items-start">
                      <Check className="w-4.5 h-4.5 text-marigold-deep dark:text-marigold flex-none mt-0.5" />
                      <span className="font-semibold text-ink">1 full day of live website building</span>
                    </li>
                    <li className="flex gap-2.5 items-start">
                      <Check className="w-4.5 h-4.5 text-marigold-deep dark:text-marigold flex-none mt-0.5" />
                      <span className="font-semibold text-ink">Build 5 real dynamic websites</span>
                    </li>
                    <li className="flex gap-2.5 items-start">
                      <Check className="w-4.5 h-4.5 text-marigold-deep dark:text-marigold flex-none mt-0.5" />
                      <span>Learn AI-powered website development</span>
                    </li>
                    <li className="flex gap-2.5 items-start">
                      <Check className="w-4.5 h-4.5 text-marigold-deep dark:text-marigold flex-none mt-0.5" />
                      <span>Build responsive production-ready websites</span>
                    </li>
                    <li className="flex gap-2.5 items-start">
                      <Check className="w-4.5 h-4.5 text-marigold-deep dark:text-marigold flex-none mt-0.5" />
                      <span>Learn database and dynamic functionality</span>
                    </li>
                    <li className="flex gap-2.5 items-start">
                      <Check className="w-4.5 h-4.5 text-marigold-deep dark:text-marigold flex-none mt-0.5" />
                      <span>Deploy websites live during the workshop</span>
                    </li>
                    <li className="flex gap-2.5 items-start">
                      <Check className="w-4.5 h-4.5 text-marigold-deep dark:text-marigold flex-none mt-0.5" />
                      <span>Recording link provided after the session</span>
                    </li>
                    <li className="flex gap-2.5 items-start">
                      <Check className="w-4.5 h-4.5 text-marigold-deep dark:text-marigold flex-none mt-0.5" />
                      <span>Rewatch the complete workshop recording</span>
                    </li>
                    <li className="flex gap-2.5 items-start">
                      <Check className="w-4.5 h-4.5 text-marigold-deep dark:text-marigold flex-none mt-0.5" />
                      <span>Certificate of workshop completion</span>
                    </li>
                    <li className="flex gap-2.5 items-start">
                      <Check className="w-4.5 h-4.5 text-marigold-deep dark:text-marigold flex-none mt-0.5" />
                      <span>AI tools + prompts used during the workshop</span>
                    </li>
                    <li className="flex gap-2.5 items-start">
                      <Check className="w-4.5 h-4.5 text-marigold-deep dark:text-marigold flex-none mt-0.5" />
                      <span className="font-medium text-ink">Beginner friendly</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <a 
                  href="#register" 
                  onClick={handleScrollToRegister}
                  className="btn btn-primary w-full py-3.5 text-center justify-center font-bold text-sm flex items-center gap-2 shadow-sm cursor-pointer"
                  id="website-workshop-reserve-btn"
                >
                  <span>Reserve Seat & Pay Later</span>
                  <ArrowRight className="w-4 h-4" />
                </a>

                <p className="text-center text-[0.74rem] text-muted flex items-center justify-center gap-1.5 font-medium pt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                  <span>Limited workshop seats</span>
                </p>
              </div>
            </motion.div>

            {/* CARD 3: ANDROID APP BUILDER WEEKEND COHORT */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-card border border-border-custom rounded-custom p-7 sm:p-8 flex flex-col justify-between relative shadow-sm hover:shadow-md transition-all hover:border-peacock/40 group"
              id="card-android-cohort"
            >
              <div>
                {/* Badge */}
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 font-mono text-[0.7rem] font-bold py-1 px-3 rounded-full uppercase tracking-wider border border-emerald-500/25 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-emerald-500" />
                    <span>NEW</span>
                  </span>
                  <span className="text-[0.7rem] font-mono text-muted flex items-center gap-1">
                    <Smartphone className="w-3.5 h-3.5 text-peacock" />
                    <span>Android Native + AI</span>
                  </span>
                </div>

                <h3 className="font-display text-2xl font-bold text-ink mb-1.5 mt-2">
                  2 Weekend Android App Cohort
                </h3>
                <p className="text-muted text-[0.92rem] leading-relaxed mb-5">
                  Build real Android apps with AI — from idea to working app.
                </p>

                {/* Outcome Highlight Box */}
                <div className="mb-5 p-4 rounded-2xl bg-peacock/5 border border-peacock/25 text-center relative overflow-hidden shadow-xs">
                  <div className="text-[0.68rem] font-mono font-extrabold uppercase tracking-widest text-peacock mb-1">
                    COHORT OUTCOME
                  </div>
                  <div className="font-display text-2xl sm:text-3xl font-extrabold text-ink tracking-tight mb-1">
                    BUILD REAL ANDROID APPS
                  </div>
                  <div className="text-[0.72rem] font-mono font-bold text-peacock bg-peacock/10 py-1 px-2.5 rounded-lg border border-peacock/20 inline-block mb-2">
                    2 WEEKENDS • BUILD • TEST • SHIP
                  </div>

                  {/* Mini Process */}
                  <div className="flex items-center justify-center gap-1 text-[0.65rem] font-mono font-semibold text-muted pt-1 border-t border-border-custom/40">
                    <span className="text-ink font-bold">Idea</span>
                    <span>→</span>
                    <span className="text-ink font-bold">AI</span>
                    <span>→</span>
                    <span className="text-ink font-bold">Android App</span>
                    <span>→</span>
                    <span className="text-ink font-bold">Test</span>
                    <span>→</span>
                    <span className="text-peacock font-bold">Ship</span>
                  </div>
                </div>

                <div className="border-t border-border-custom/50 pt-5 mb-7">
                  <p className="text-xs font-bold uppercase tracking-wider text-muted font-mono mb-3.5">
                    Cohort Benefits & Curriculum:
                  </p>
                  <ul className="flex flex-col gap-2.5 text-[0.88rem] text-ink-soft" id="android-cohort-benefits-list">
                    <li className="flex gap-2.5 items-start">
                      <Check className="w-4.5 h-4.5 text-peacock flex-none mt-0.5" />
                      <span className="font-semibold text-ink">2 live weekend sessions</span>
                    </li>
                    <li className="flex gap-2.5 items-start">
                      <Check className="w-4.5 h-4.5 text-peacock flex-none mt-0.5" />
                      <span className="font-semibold text-ink">Build Android apps using AI</span>
                    </li>
                    <li className="flex gap-2.5 items-start">
                      <Check className="w-4.5 h-4.5 text-peacock flex-none mt-0.5" />
                      <span>Build multiple real app projects</span>
                    </li>
                    <li className="flex gap-2.5 items-start">
                      <Check className="w-4.5 h-4.5 text-peacock flex-none mt-0.5" />
                      <span>Learn AI-assisted app development</span>
                    </li>
                    <li className="flex gap-2.5 items-start">
                      <Check className="w-4.5 h-4.5 text-peacock flex-none mt-0.5" />
                      <span>Create functional app interfaces</span>
                    </li>
                    <li className="flex gap-2.5 items-start">
                      <Check className="w-4.5 h-4.5 text-peacock flex-none mt-0.5" />
                      <span>Connect apps with databases/APIs</span>
                    </li>
                    <li className="flex gap-2.5 items-start">
                      <Check className="w-4.5 h-4.5 text-peacock flex-none mt-0.5" />
                      <span>Learn app testing and deployment workflow</span>
                    </li>
                    <li className="flex gap-2.5 items-start">
                      <Check className="w-4.5 h-4.5 text-peacock flex-none mt-0.5" />
                      <span>Android app publishing walkthrough</span>
                    </li>
                    <li className="flex gap-2.5 items-start">
                      <Check className="w-4.5 h-4.5 text-peacock flex-none mt-0.5" />
                      <span>Complete session recordings</span>
                    </li>
                    <li className="flex gap-2.5 items-start">
                      <Check className="w-4.5 h-4.5 text-peacock flex-none mt-0.5" />
                      <span>Certificate of completion</span>
                    </li>
                    <li className="flex gap-2.5 items-start">
                      <Check className="w-4.5 h-4.5 text-peacock flex-none mt-0.5" />
                      <span className="font-medium text-ink">Beginner friendly</span>
                    </li>
                    <li className="flex gap-2.5 items-start">
                      <Check className="w-4.5 h-4.5 text-peacock flex-none mt-0.5" />
                      <span>AI prompts and tools included</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <a 
                  href="#register" 
                  onClick={handleScrollToRegister}
                  className="btn btn-primary w-full py-3.5 text-center justify-center font-bold text-sm flex items-center gap-2 shadow-sm cursor-pointer"
                  id="android-cohort-reserve-btn"
                >
                  <span>Reserve Seat & Join WhatsApp</span>
                  <ArrowRight className="w-4 h-4" />
                </a>

                <p className="text-center text-[0.74rem] text-muted flex items-center justify-center gap-1.5 font-medium pt-0.5">
                  <Clock className="w-3.5 h-3.5 text-amber-500" />
                  <span>Limited batch seats</span>
                </p>
              </div>
            </motion.div>
          </div>

          {/* Pricing Guarantee Bottom Reassurance Banner */}
          <div className="mt-12 max-w-4xl mx-auto p-5 rounded-2xl bg-paper/60 border border-border-custom flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center flex-none">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <p className="text-xs text-muted leading-relaxed">
                <strong className="text-ink dark:text-white font-semibold">100% Risk-Free Commitment:</strong> Attend Day 1 / Session 1. If you're not satisfied with the teaching or projects, get a prompt 100% refund.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsGuaranteeModalOpen(true)}
              className="text-xs font-bold text-emerald-700 dark:text-emerald-400 hover:underline flex-none whitespace-nowrap cursor-pointer"
              id="pricing-banner-read-terms-btn"
            >
              Guarantee FAQ & Terms →
            </button>
          </div>
        </div>
      </section>

      {/* ============ FAQ SECTION ============ */}
      <section id="faq" className="py-20 md:py-24 bg-paper">
        <div className="wrap">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="eyebrow-line">Questions</span>
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-extrabold text-ink mb-4 mt-1">
              Everything people ask before joining.
            </h2>
          </div>

          <FaqAccordion />
        </div>
      </section>

      {/* ============ REGISTER SECTION ============ */}
      <section id="register" className="py-14 md:py-20 bg-paper">
        <div className="wrap">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-card border border-border-custom rounded-3xl p-8 md:p-14 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start shadow-sm"
          >
            <div>
              <span className="eyebrow-line">Reserve your seat</span>
              <h2 className="font-display text-3xl md:text-4xl font-extrabold text-ink mb-6 mt-1 leading-tight">
                Your first project goes live with the {batchSchedule.isNearestFriday ? batchSchedule.shortFridayFormatted : batchSchedule.shortTuesdayFormatted} batch.
              </h2>
              
              <ul className="flex flex-col gap-4 mt-6 text-[0.97rem] text-ink-soft">
                <li className="flex gap-3 items-start">
                  <span className="w-5 h-5 rounded-full bg-peacock/10 text-peacock flex items-center justify-center text-xs font-extrabold mt-0.5 flex-none">✓</span>
                  <span>Instant seat reservation & WhatsApp group link</span>
                </li>
                <li className="flex gap-3 items-start">
                  <span className="w-5 h-5 rounded-full bg-peacock/10 text-peacock flex items-center justify-center text-xs font-extrabold mt-0.5 flex-none">✓</span>
                  <span>Zoom link + prep checklist sent immediately</span>
                </li>
                <li className="flex gap-3 items-start">
                  <span className="w-5 h-5 rounded-full bg-peacock/10 text-peacock flex items-center justify-center text-xs font-extrabold mt-0.5 flex-none">✓</span>
                  <span>Direct access to live sessions and community</span>
                </li>
                <li className="flex gap-3 items-start">
                  <span className="w-5 h-5 rounded-full bg-peacock/10 text-peacock flex items-center justify-center text-xs font-extrabold mt-0.5 flex-none">✓</span>
                  <span>Batch capped at 200 — {seatsLeft} seats left</span>
                </li>
              </ul>
            </div>

            {/* Dynamic, validated React Register Form */}
            <div className="w-full bg-paper/30 border border-border-custom/50 rounded-2xl p-4 sm:p-6 lg:p-8">
              {seatsLeft < 20 && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-700 dark:text-rose-400 flex items-start gap-3"
                  id="almost-full-banner"
                >
                  <span className="relative flex h-3 w-3 mt-1.5 flex-none">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500"></span>
                  </span>
                  <div>
                    <div className="font-display font-bold text-sm text-rose-800 dark:text-rose-300 flex items-center gap-1.5 flex-wrap">
                      <span>ALMOST FULL: Only {seatsLeft} seats left!</span>
                      <span className="bg-rose-500 text-white font-mono text-[0.62rem] px-1.5 py-0.5 rounded uppercase font-extrabold tracking-wide">
                        Urgent
                      </span>
                    </div>
                    <p className="text-xs text-rose-700/80 dark:text-rose-400/80 mt-1 leading-relaxed">
                      Due to 1-on-1 mentor reviews and live doubt solving, we strictly limit batch size. Complete your registration below to guarantee your spot.
                    </p>
                  </div>
                </motion.div>
              )}
              <RegisterForm />
            </div>
          </motion.div>
        </div>
      </section>
      </main>

      {/* ============ FOOTER SECTION ============ */}
      <footer className="bg-ink text-[#8A93B5] pt-14 pb-24 md:pb-12 border-t border-[#233052]" id="app-footer">
        <div className="wrap">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 pb-10 border-b border-[#232C4A]">
            <div>
              <a 
                href="#top" 
                onClick={(e) => {
                  e.preventDefault();
                  document.querySelector('#top')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="font-display font-extrabold text-[1.32rem] no-underline flex items-center gap-2.5 text-white"
                id="footer-logo"
              >
                <span className="w-3 h-3 rounded-[3px] bg-gradient-to-br from-marigold to-marigold-deep transform rotate-45"></span>
                <span>Code<em className="not-italic text-marigold-deep">In</em>India</span>
              </a>
              <p className="text-sm text-[#8A93B5]/80 mt-4 leading-relaxed max-w-[280px]">
                Live classes that turn beginners into builders — dynamic websites, SaaS products and apps, taught in Hindi + English.
              </p>
              
              {/* Footer 100% Money-Back Guarantee Trust Badge */}
              <div 
                onClick={() => setIsGuaranteeModalOpen(true)}
                className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-xs font-semibold cursor-pointer hover:bg-emerald-500/15 transition-colors"
                id="footer-guarantee-badge"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-400 flex-none" />
                <span>100% Money-Back Guarantee</span>
              </div>
            </div>

            <div>
              <h4 className="font-display text-white text-[0.92rem] font-bold mb-4 uppercase tracking-wider">Course</h4>
              <ul className="flex flex-col gap-2.5 text-sm">
                <li>
                  <a href="#build" onClick={(e) => { e.preventDefault(); document.querySelector('#build')?.scrollIntoView({ behavior: 'smooth' }); }} className="hover:text-white transition-colors">
                    What you'll build
                  </a>
                </li>
                <li>
                  <a href="#curriculum" onClick={(e) => { e.preventDefault(); document.querySelector('#curriculum')?.scrollIntoView({ behavior: 'smooth' }); }} className="hover:text-white transition-colors">
                    Curriculum
                  </a>
                </li>
                <li>
                  <a href="#pricing" onClick={(e) => { e.preventDefault(); document.querySelector('#pricing')?.scrollIntoView({ behavior: 'smooth' }); }} className="hover:text-white transition-colors">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#faq" onClick={(e) => { e.preventDefault(); document.querySelector('#faq')?.scrollIntoView({ behavior: 'smooth' }); }} className="hover:text-white transition-colors">
                    FAQ
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-display text-white text-[0.92rem] font-bold mb-4 uppercase tracking-wider">Contact</h4>
              <ul className="flex flex-col gap-2.5 text-sm">
                <li>
                  <a href="mailto:hello@codeinindia.in" className="hover:text-white transition-colors">
                    hello@codeinindia.in
                  </a>
                </li>
                <li>
                  <a href={`https://wa.me/${getWhatsappNumber()}`} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                    WhatsApp us
                  </a>
                </li>
                <li>
                  <a href="#register" onClick={handleScrollToRegister} className="hover:text-white transition-colors">
                    Reserve a seat
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-display text-white text-[0.92rem] font-bold mb-4 uppercase tracking-wider">Legal & Trust</h4>
              <ul className="flex flex-col gap-2.5 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Terms of use</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy policy</a></li>
                <li>
                  <button 
                    type="button"
                    onClick={() => setIsGuaranteeModalOpen(true)}
                    className="hover:text-white transition-colors text-left flex items-center gap-1.5 cursor-pointer text-emerald-400"
                    id="footer-refund-policy-btn"
                  >
                    <span>100% Refund Policy</span>
                    <span className="text-[0.65rem] bg-emerald-500/20 text-emerald-300 font-mono px-1 py-0.2 rounded font-bold">24H</span>
                  </button>
                </li>
              </ul>
            </div>
          </div>

          <div className="flex flex-wrap justify-between items-center gap-4 pt-6 text-[0.82rem] text-[#8A93B5]/60 font-medium font-sans">
            <span>© 2026 CodeInIndia. Made with ☕ in Delhi.</span>
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => setIsGuaranteeModalOpen(true)}
                className="hover:text-emerald-400 transition-colors flex items-center gap-1 text-xs cursor-pointer"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>100% Money-Back Guarantee Verified</span>
              </button>
              <span>codeinindia.in</span>
            </div>
          </div>
        </div>
      </footer>

      {/* ============ FLOATING JOIN COMMUNITY BUTTON ============ */}
      <FloatingCommunityButton />

      {/* ============ FLOATING WHATSAPP BUTTON ============ */}
      <a 
        className="fixed bottom-6 right-24 z-40 w-14 h-14 rounded-full bg-[#25D366] flex items-center justify-center shadow-lg hover:scale-105 transition-transform cursor-pointer"
        href={`https://wa.me/${getWhatsappNumber()}?text=Hi!%20I%20want%20to%20know%20more%20about%20CodeInIndia%20classes.`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        id="floating-wa-btn"
      >
        <svg width="28" height="28" viewBox="0 0 24 24" fill="#ffffff" className="w-7 h-7 flex-none">
          <path d="M12 2a10 10 0 00-8.6 15.1L2 22l5-1.3A10 10 0 1012 2zm0 18.2a8.2 8.2 0 01-4.2-1.1l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1112 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1-.2.2-.6.8-.8 1-.1.2-.3.2-.5.1a6.7 6.7 0 01-3.3-2.9c-.3-.4 0-.5.2-.7l.4-.5c.1-.2.1-.3 0-.5l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.5.1-.7.3-.2.3-.9.9-.9 2.2s.9 2.5 1.1 2.7c.1.2 1.9 2.9 4.6 4 .6.3 1.1.4 1.5.6.6.2 1.2.2 1.6.1.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.2-.3-.2-.5-.3z"/>
        </svg>
      </a>

      {/* ============ FLOATING MENTOR CHAT WIDGET ============ */}
      <MentorChatWidget />

      {/* ============ BATCH START DATE TOAST NOTIFICATION (Appears on scroll after 30s) ============ */}
      <BatchStartDateToast />

      {/* ============ MONEY-BACK GUARANTEE PERSISTENT SCROLL ALERT TOAST ============ */}
      <GuaranteeAlertToast
        onOpenGuaranteeModal={() => setIsGuaranteeModalOpen(true)}
      />

      {/* ============ BACK TO TOP BUTTON ============ */}
      <BackToTop />

      {/* ============ STICKY MOBILE CTA BANNER ============ */}
      <div 
        className="fixed bottom-0 left-0 right-0 z-40 bg-ink py-3 px-5 flex md:hidden items-center justify-between gap-4 border-t border-[#233052] shadow-[0_-4px_16px_rgba(23,30,51,0.15)]"
        id="sticky-mobile-cta-banner"
      >
        <span className="text-white text-[0.85rem] font-bold">
          Batch starts {localShortDate} · Reserve Seat
        </span>
        <a 
          className="btn btn-primary px-5 py-2.5 text-xs font-extrabold shadow-sm"
          href="#register"
          onClick={handleScrollToRegister}
        >
          Reserve seat
        </a>
      </div>

      {/* ============ GUARANTEE DETAILS MODAL ============ */}
      <GuaranteeDetailsModal
        isOpen={isGuaranteeModalOpen}
        onClose={() => setIsGuaranteeModalOpen(false)}
      />

      {/* ============ RAZORPAY PAYMENT MODAL WITH SUCCESS FEEDBACK ============ */}
      <RazorpayPaymentModal
        isOpen={isRazorpayModalOpen}
        onClose={() => setIsRazorpayModalOpen(false)}
        defaultPlan={selectedRazorpayPlan}
      />
    </div>
    </AdminAuthProvider>
  );
}
