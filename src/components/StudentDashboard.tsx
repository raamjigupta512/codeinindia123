import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  GraduationCap,
  CheckCircle2,
  Clock,
  Video,
  Github,
  ExternalLink,
  Plus,
  Award,
  Calendar,
  Layers,
  Sparkles,
  ArrowLeft,
  Search,
  MessageCircle,
  FileCode2,
  ChevronRight,
  BookOpen,
  Send,
  Download,
  AlertCircle,
  ShieldCheck,
  Flame,
  Check,
  Code2,
  Laptop,
  Copy,
  FolderGit2
} from 'lucide-react';
import { StudentProjectRepo, StudentLiveSession, StudentModuleItem, EnrolledStudentProfile } from '../types/student';
import { CURRICULUM_WEEKS } from '../types';

interface StudentDashboardProps {
  onBackToHome: () => void;
  onOpenCertificateVerify?: (certId: string) => void;
}

const DEFAULT_MODULES: StudentModuleItem[] = [
  {
    id: 'mod-1',
    weekNo: 1,
    phase: 'FOUNDATIONS',
    title: 'Think in Code, Build with AI & Live Domain Launch',
    description: 'Mastering AI pair-coding, prompt architecture, HTML/CSS layout systems, and deploying your personal brand on a real custom domain.',
    deliverable: 'Personal developer site live on custom Vercel/Cloudflare DNS',
    isCompleted: true,
    starterCodeUrl: 'https://github.com/codeinindia/week1-starter-foundations',
    cheatsheetUrl: '#',
    lessons: [
      { id: 'l1-1', title: 'How Modern Web Architecture Works (DNS, HTTP & DOM)', duration: '45m', isDone: true },
      { id: 'l1-2', title: 'AI Prompt Engineering for Production TypeScript', duration: '60m', isDone: true },
      { id: 'l1-3', title: 'Tailwind CSS Grid & Responsive Typography Systems', duration: '50m', isDone: true },
      { id: 'l1-4', title: 'Git, GitHub Workflows & Continuous Deployment', duration: '40m', isDone: true }
    ]
  },
  {
    id: 'mod-2',
    weekNo: 2,
    phase: 'FULL_STACK',
    title: 'Dynamic Web Platforms with Next.js 15 & PostgreSQL',
    description: 'Building server-rendered React applications, client/server boundaries, relational database schemas with Drizzle ORM, and secure session authentication.',
    deliverable: 'Dynamic multi-user platform with database persistence',
    isCompleted: true,
    starterCodeUrl: 'https://github.com/codeinindia/week2-nextjs-postgres-starter',
    cheatsheetUrl: '#',
    lessons: [
      { id: 'l2-1', title: 'Next.js App Router, Server Components & Server Actions', duration: '65m', isDone: true },
      { id: 'l2-2', title: 'Relational Database Modeling with PostgreSQL & Drizzle', duration: '75m', isDone: true },
      { id: 'l2-3', title: 'User Authentication, JWT Tokens & Role-Based Access Control', duration: '55m', isDone: true },
      { id: 'l2-4', title: 'Building Dynamic Admin Dashboards & Filter Queries', duration: '60m', isDone: true }
    ]
  },
  {
    id: 'mod-3',
    weekNo: 3,
    phase: 'MICRO_SAAS',
    title: 'Micro-SaaS Billing, Razorpay Gateways & Webhook Architecture',
    description: 'Integrating live payment checkouts, HMAC SHA256 signature verification, recurring subscriptions, and production webhook handling.',
    deliverable: 'Monetized Micro-SaaS charging real INR payments',
    isCompleted: true,
    starterCodeUrl: 'https://github.com/codeinindia/week3-razorpay-saas-starter',
    cheatsheetUrl: '#',
    lessons: [
      { id: 'l3-1', title: 'Payment Gateways & The Razorpay Orders API Workflow', duration: '60m', isDone: true },
      { id: 'l3-2', title: 'Cryptographic Signature Verification & Webhook Handlers', duration: '70m', isDone: true },
      { id: 'l3-3', title: 'Automated Invoice Generation & Customer Receipts', duration: '45m', isDone: true },
      { id: 'l3-4', title: 'Handling Edge Cases: Failed Charges, Idempotency & Retries', duration: '50m', isDone: true }
    ]
  },
  {
    id: 'mod-4',
    weekNo: 4,
    phase: 'MOBILE_LAUNCH',
    title: 'Mobile Apps (Flutter/PWA), AI Workflows & Zero-to-1 Launch Playbook',
    description: 'Shipping Android & iOS compatible apps from a unified codebase, integrating Google GenAI SDK agents, and executing the distribution playbook.',
    deliverable: 'Deployable mobile application & final capstone defense',
    isCompleted: false,
    starterCodeUrl: 'https://github.com/codeinindia/week4-flutter-ai-starter',
    cheatsheetUrl: '#',
    lessons: [
      { id: 'l4-1', title: 'Cross-Platform Mobile Foundations with Flutter & Capacitor', duration: '65m', isDone: true },
      { id: 'l4-2', title: 'Building Autonomous AI Workflows with Google GenAI SDK', duration: '80m', isDone: false },
      { id: 'l4-3', title: 'App Store & Play Store Packaging, Push Alerts & Offline Sync', duration: '60m', isDone: false },
      { id: 'l4-4', title: 'Capstone Defense, Resume Engineering & Tech Interview Prep', duration: '90m', isDone: false }
    ]
  }
];

export default function StudentDashboard({ onBackToHome, onOpenCertificateVerify }: StudentDashboardProps) {
  const [activeTab, setActiveTab] = useState<'progress' | 'sessions' | 'projects' | 'certificate'>('progress');
  const [student, setStudent] = useState<EnrolledStudentProfile | null>(null);
  const [projects, setProjects] = useState<StudentProjectRepo[]>([]);
  const [sessions, setSessions] = useState<StudentLiveSession[]>([]);
  const [modules, setModules] = useState<StudentModuleItem[]>(DEFAULT_MODULES);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedEnrollment, setCopiedEnrollment] = useState(false);
  const [projectFilter, setProjectFilter] = useState<'ALL' | 'COMPLETED' | 'IN_PROGRESS'>('ALL');

  // Submit Project Modal State
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [submitTitle, setSubmitTitle] = useState('');
  const [submitPhase, setSubmitPhase] = useState('Week 4: Mobile & Capstone Sprint');
  const [submitRepoUrl, setSubmitRepoUrl] = useState('');
  const [submitLiveUrl, setSubmitLiveUrl] = useState('');
  const [submitTechStack, setSubmitTechStack] = useState('React, TypeScript, Tailwind, Google GenAI SDK');
  const [submitNotes, setSubmitNotes] = useState('');
  const [isSubmittingProject, setIsSubmittingProject] = useState(false);
  const [submitSuccessMsg, setSubmitSuccessMsg] = useState('');

  // Fetch student profile, projects, and sessions
  const fetchStudentData = async (query?: string) => {
    try {
      setIsLoading(true);
      const qParam = query ? `?q=${encodeURIComponent(query)}` : '';
      
      const [profileRes, projRes, sessRes] = await Promise.all([
        fetch(`/api/student/profile${qParam}`),
        fetch(`/api/student/projects`),
        fetch(`/api/student/sessions`)
      ]);

      const profileData = await profileRes.json();
      const projData = await projRes.json();
      const sessData = await sessRes.json();

      if (profileData.success && profileData.student) {
        setStudent(profileData.student);
      }

      if (projData.success && projData.projects) {
        setProjects(projData.projects);
      }

      if (sessData.success && sessData.sessions) {
        setSessions(sessData.sessions);
      }
    } catch (err) {
      console.error('Failed to load student dashboard data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStudentData();
  }, []);

  const handleCopyEnrollment = () => {
    if (!student) return;
    navigator.clipboard.writeText(student.enrollmentId);
    setCopiedEnrollment(true);
    setTimeout(() => setCopiedEnrollment(false), 2000);
  };

  const handleToggleLesson = (moduleId: string, lessonId: string) => {
    setModules(prev =>
      prev.map(mod => {
        if (mod.id !== moduleId) return mod;
        const updatedLessons = mod.lessons.map(l =>
          l.id === lessonId ? { ...l, isDone: !l.isDone } : l
        );
        const allDone = updatedLessons.every(l => l.isDone);
        return { ...mod, lessons: updatedLessons, isCompleted: allDone };
      })
    );
  };

  const handleSubmitProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!submitTitle.trim() || !submitRepoUrl.trim()) return;

    try {
      setIsSubmittingProject(true);
      const res = await fetch('/api/student/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: submitTitle,
          phase: submitPhase,
          repoUrl: submitRepoUrl,
          liveUrl: submitLiveUrl,
          techStack: submitTechStack.split(',').map(s => s.trim()),
          notes: submitNotes,
          studentId: student?.id,
          enrollmentId: student?.enrollmentId
        })
      });

      const data = await res.json();
      if (data.success && data.project) {
        setProjects(prev => [data.project, ...prev]);
        setSubmitSuccessMsg('Project repository submitted for mentor review! 🎉');
        setTimeout(() => {
          setIsSubmitModalOpen(false);
          setSubmitSuccessMsg('');
          setSubmitTitle('');
          setSubmitRepoUrl('');
          setSubmitLiveUrl('');
          setSubmitNotes('');
        }, 1500);
      }
    } catch (err) {
      console.error('Failed to submit project:', err);
    } finally {
      setIsSubmittingProject(false);
    }
  };

  // Calculate live statistics
  const totalLessons = modules.reduce((acc, m) => acc + m.lessons.length, 0);
  const completedLessons = modules.reduce((acc, m) => acc + m.lessons.filter(l => l.isDone).length, 0);
  const liveProgressPercent = Math.round((completedLessons / totalLessons) * 100);

  const completedProjectsCount = projects.filter(p => p.status === 'APPROVED' || p.status === 'COMPLETED').length;
  const inProgressProjectsCount = projects.filter(p => p.status !== 'APPROVED' && p.status !== 'COMPLETED').length;

  const filteredProjects = projects.filter(p => {
    const isCompleted = p.status === 'APPROVED' || p.status === 'COMPLETED';
    if (projectFilter === 'COMPLETED') return isCompleted;
    if (projectFilter === 'IN_PROGRESS') return !isCompleted;
    return true;
  });

  return (
    <div className="min-h-screen bg-[#070D0B] text-slate-100 font-sans selection:bg-emerald-500 selection:text-black pb-20">
      
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-40 bg-[#070D0B]/90 backdrop-blur-md border-b border-[#152522]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
          
          {/* Brand & Back Button */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onBackToHome}
              className="p-2 rounded-xl bg-[#0F1C18] hover:bg-[#152522] border border-[#1B2F2A] text-slate-300 hover:text-white transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-semibold"
              id="dash-back-to-home-btn"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Back to Site</span>
            </button>

            <div className="h-5 w-[1px] bg-[#152522]" />

            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-[3px] bg-gradient-to-br from-emerald-400 to-teal-500 rotate-45" />
              <span className="font-display font-extrabold text-base tracking-tight text-white">
                Code<span className="text-emerald-400">In</span>India
              </span>
              <span className="text-[0.65rem] font-mono font-bold uppercase tracking-wider bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full ml-1 flex items-center gap-1">
                <GraduationCap className="w-3 h-3 text-emerald-400" /> Student Portal
              </span>
            </div>
          </div>

          {/* Quick Enrolled Student Switcher / Lookup */}
          <div className="flex items-center gap-2.5">
            <div className="relative hidden md:block w-64">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                placeholder="Search Enrollment ID or Email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && fetchStudentData(searchQuery)}
                className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-[#0F1C18] border border-[#1B2F2A] text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500/50"
              />
            </div>

            {/* Switch Demo Profiles */}
            <div className="flex items-center gap-1 bg-[#0F1C18] p-1 rounded-xl border border-[#1B2F2A]">
              <button
                type="button"
                onClick={() => fetchStudentData('CI-2026-000001')}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  student?.enrollmentId === 'CI-2026-000001'
                    ? 'bg-emerald-500 text-black font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="View Aarav Sharma Profile (75% Progress)"
              >
                Aarav
              </button>
              <button
                type="button"
                onClick={() => fetchStudentData('CI-2026-000002')}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  student?.enrollmentId === 'CI-2026-000002'
                    ? 'bg-emerald-500 text-black font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="View Priya Patel Profile (100% Progress & Certificate)"
              >
                Priya (Grad)
              </button>
            </div>

            {/* WhatsApp Community Direct Link */}
            <a
              href="https://chat.whatsapp.com/demo-cohort-link"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-300 transition-colors flex items-center gap-1.5 text-xs font-bold"
              title="Join WhatsApp Cohort Lounge"
            >
              <MessageCircle className="w-4 h-4 text-emerald-400" />
              <span className="hidden lg:inline">Cohort Chat</span>
            </a>
          </div>

        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        
        {/* Student Profile Hero Header */}
        {student && (
          <div className="relative rounded-3xl bg-gradient-to-b from-[#0F1C18] to-[#0B1513] border border-[#1B2F2A] p-6 sm:p-8 overflow-hidden shadow-2xl">
            {/* Background Glow */}
            <div className="absolute -right-16 -top-16 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-start sm:items-center gap-4.5">
                <div className="relative flex-none">
                  <img
                    src={student.avatarUrl || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80"}
                    alt={student.fullName}
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-emerald-500/50 shadow-lg"
                  />
                  <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-[#0B1513] flex items-center justify-center text-black font-bold text-[0.6rem]">
                    ✓
                  </span>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                      {student.fullName}
                    </h1>
                    <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Verified Enrolled
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-400 font-medium">
                    {student.courseName} • <span className="text-emerald-400 font-semibold">{student.batchName}</span>
                  </p>

                  <div className="flex items-center gap-2 text-xs text-slate-500 pt-1 flex-wrap font-mono">
                    <span className="text-slate-400">Enrollment ID:</span>
                    <button
                      type="button"
                      onClick={handleCopyEnrollment}
                      className="bg-[#152522] hover:bg-[#1C332D] text-emerald-300 px-2 py-0.5 rounded-md font-bold text-[0.75rem] flex items-center gap-1 transition-colors cursor-pointer border border-[#1B2F2A]"
                      title="Copy Enrollment ID"
                    >
                      <span>{student.enrollmentId}</span>
                      {copiedEnrollment ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    </button>
                    <span>•</span>
                    <span>{student.email}</span>
                  </div>
                </div>
              </div>

              {/* Quick Action Buttons */}
              <div className="flex items-center gap-3 flex-wrap">
                <button
                  type="button"
                  onClick={() => setIsSubmitModalOpen(true)}
                  className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs flex items-center gap-2 shadow-lg shadow-emerald-950 transition-all cursor-pointer"
                  id="dash-submit-project-top-btn"
                >
                  <Plus className="w-4 h-4" />
                  <span>Submit Project Repo</span>
                </button>

                {student.certificateStatus === 'ISSUED' && student.certificateId && (
                  <button
                    type="button"
                    onClick={() => {
                      if (onOpenCertificateVerify) {
                        onOpenCertificateVerify(student.certificateId!);
                      } else {
                        window.location.hash = `#verify/${student.certificateId}`;
                      }
                    }}
                    className="px-3.5 py-2.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-300 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Award className="w-4 h-4 text-emerald-400" />
                    <span>View Certificate</span>
                  </button>
                )}
              </div>
            </div>

            {/* Quick Metrics Ribbon (Bento) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 mt-6 pt-6 border-t border-[#1B2F2A]">
              
              {/* Progress Metric */}
              <div className="bg-[#070D0B]/80 rounded-2xl p-3.5 border border-[#152522]">
                <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                  <span>Overall Progress</span>
                  <span className="text-emerald-400 font-mono font-bold">{liveProgressPercent}%</span>
                </div>
                <div className="h-2 w-full bg-[#152522] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-500"
                    style={{ width: `${liveProgressPercent}%` }}
                  />
                </div>
                <p className="text-[0.7rem] text-slate-500 mt-1.5">
                  {completedLessons} of {totalLessons} lessons completed
                </p>
              </div>

              {/* Modules Completed */}
              <div className="bg-[#070D0B]/80 rounded-2xl p-3.5 border border-[#152522]">
                <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
                  <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Modules Completed</span>
                </div>
                <div className="text-lg font-bold text-white font-mono">
                  {modules.filter(m => m.isCompleted).length} <span className="text-xs text-slate-500 font-normal">/ {modules.length} Weeks</span>
                </div>
                <p className="text-[0.7rem] text-emerald-400/80 mt-0.5">
                  Phase 4 Capstone In Progress
                </p>
              </div>

              {/* Live Attendance Streak */}
              <div className="bg-[#070D0B]/80 rounded-2xl p-3.5 border border-[#152522]">
                <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
                  <Flame className="w-3.5 h-3.5 text-amber-400" />
                  <span>Attendance Streak</span>
                </div>
                <div className="text-lg font-bold text-white font-mono flex items-center gap-1">
                  <span>8 Live Classes</span>
                  <span className="text-xs text-amber-400 font-bold">🔥</span>
                </div>
                <p className="text-[0.7rem] text-slate-500 mt-0.5">
                  100% On-Time Attendance Rate
                </p>
              </div>

              {/* Repositories Submitted */}
              <div className="bg-[#070D0B]/80 rounded-2xl p-3.5 border border-[#152522]">
                <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
                  <FolderGit2 className="w-3.5 h-3.5 text-teal-400" />
                  <span>Project Repos</span>
                </div>
                <div className="text-lg font-bold text-white font-mono">
                  {projects.length} <span className="text-xs text-slate-500 font-normal">Shipped</span>
                </div>
                <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                  <span className="text-[0.65rem] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                    {completedProjectsCount} Completed
                  </span>
                  <span className="text-[0.65rem] font-mono font-bold text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">
                    {inProgressProjectsCount} In-Progress
                  </span>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* Dashboard Tab Bar */}
        <div className="flex items-center gap-2 border-b border-[#1B2F2A] pb-3 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab('progress')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
              activeTab === 'progress'
                ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/40 shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-[#0F1C18]'
            }`}
            id="tab-btn-progress"
          >
            <Layers className="w-4 h-4" />
            <span>Curriculum & Lessons</span>
            <span className="text-[0.65rem] font-mono px-1.5 py-0.2 rounded-full bg-[#152522] text-slate-300">
              {completedLessons}/{totalLessons}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('sessions')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
              activeTab === 'sessions'
                ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/40 shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-[#0F1C18]'
            }`}
            id="tab-btn-sessions"
          >
            <Video className="w-4 h-4" />
            <span>Upcoming Live Classes</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('projects')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
              activeTab === 'projects'
                ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/40 shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-[#0F1C18]'
            }`}
            id="tab-btn-projects"
          >
            <Github className="w-4 h-4" />
            <span>Project Repositories</span>
            <span className="text-[0.65rem] font-mono px-1.5 py-0.2 rounded-full bg-[#152522] text-slate-300">
              {projects.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('certificate')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
              activeTab === 'certificate'
                ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/40 shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-[#0F1C18]'
            }`}
            id="tab-btn-certificate"
          >
            <Award className="w-4 h-4" />
            <span>Certificate Status</span>
            {student?.certificateStatus === 'ISSUED' && (
              <span className="text-[0.65rem] bg-emerald-500 text-black px-1.5 py-0.2 rounded font-extrabold">
                ISSUED
              </span>
            )}
          </button>
        </div>

        {/* TAB 1: CURRICULUM & PERSONAL PROGRESS TRACKER */}
        {activeTab === 'progress' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-white tracking-tight flex items-center gap-2">
                  <span>Weekly Curriculum & Hands-On Deliverables</span>
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Click on lessons to mark them completed or access starter templates and source code.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">Total Completion:</span>
                <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/15 px-2.5 py-1 rounded-lg border border-emerald-500/30">
                  {liveProgressPercent}% Finished
                </span>
              </div>
            </div>

            {/* Modules Accordion Cards */}
            <div className="space-y-4">
              {modules.map((mod) => (
                <div
                  key={mod.id}
                  className={`rounded-2xl border transition-all ${
                    mod.isCompleted
                      ? 'bg-[#0B1513] border-emerald-500/30'
                      : 'bg-[#09110F] border-[#1B2F2A]'
                  } p-5 sm:p-6 space-y-4`}
                >
                  {/* Module Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-start gap-3.5">
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center flex-none font-mono font-bold text-xs ${
                          mod.isCompleted
                            ? 'bg-emerald-500 text-black shadow-md shadow-emerald-950'
                            : 'bg-[#152522] text-slate-300 border border-[#1B2F2A]'
                        }`}
                      >
                        W{mod.weekNo}
                      </div>

                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-[0.65rem] font-mono font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md">
                            {mod.phase}
                          </span>
                          {mod.isCompleted ? (
                            <span className="text-[0.65rem] font-bold text-emerald-300 flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Milestone Shipped
                            </span>
                          ) : (
                            <span className="text-[0.65rem] font-bold text-amber-400 flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5" /> In Progress
                            </span>
                          )}
                        </div>
                        <h3 className="text-sm sm:text-base font-bold text-white mt-1">
                          {mod.title}
                        </h3>
                      </div>
                    </div>

                    {/* Resources */}
                    {mod.starterCodeUrl && (
                      <a
                        href={mod.starterCodeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="self-start sm:self-auto px-3 py-1.5 rounded-xl bg-[#152522] hover:bg-[#1E3630] text-slate-300 hover:text-white border border-[#1B2F2A] text-xs font-semibold flex items-center gap-1.5 transition-colors"
                      >
                        <Github className="w-3.5 h-3.5" />
                        <span>Starter Code</span>
                        <ExternalLink className="w-3 h-3 text-slate-500" />
                      </a>
                    )}
                  </div>

                  <p className="text-xs text-slate-400 leading-relaxed">
                    {mod.description}
                  </p>

                  {/* Shipped Deliverable Badge */}
                  <div className="bg-[#070D0B] rounded-xl p-3 border border-[#152522] flex items-center justify-between gap-2 flex-wrap text-xs">
                    <div className="flex items-center gap-2">
                      <Laptop className="w-4 h-4 text-emerald-400 flex-none" />
                      <span className="text-slate-400 font-medium">Deliverable to Ship:</span>
                      <strong className="text-white font-semibold">{mod.deliverable}</strong>
                    </div>
                  </div>

                  {/* Interactive Lessons Checklist */}
                  <div className="space-y-2 pt-2">
                    <h4 className="text-[0.75rem] font-bold uppercase tracking-wider text-slate-400 font-mono">
                      Module Lessons & Code Alongs
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {mod.lessons.map((lesson) => (
                        <div
                          key={lesson.id}
                          onClick={() => handleToggleLesson(mod.id, lesson.id)}
                          className={`p-3 rounded-xl border flex items-center justify-between gap-3 cursor-pointer transition-all ${
                            lesson.isDone
                              ? 'bg-emerald-950/20 border-emerald-500/30 text-white'
                              : 'bg-[#070D0B] border-[#152522] text-slate-400 hover:border-slate-600'
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div
                              className={`w-5 h-5 rounded-md flex items-center justify-center flex-none border transition-colors ${
                                lesson.isDone
                                  ? 'bg-emerald-500 border-emerald-400 text-black'
                                  : 'border-slate-600 bg-transparent'
                              }`}
                            >
                              {lesson.isDone && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                            </div>
                            <span className={`text-xs font-medium truncate ${lesson.isDone ? 'text-slate-200' : 'text-slate-400'}`}>
                              {lesson.title}
                            </span>
                          </div>

                          <span className="text-[0.7rem] font-mono text-slate-500 flex-none">
                            {lesson.duration}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: UPCOMING LIVE SESSIONS & MASTERCLASSES */}
        {activeTab === 'sessions' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white tracking-tight flex items-center gap-2">
                <span>Live Interactive Classes & Code Sprints</span>
                <span className="text-xs bg-emerald-500/20 text-emerald-300 font-mono px-2 py-0.5 rounded-full font-bold">
                  IST Timezone
                </span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Join live sessions with the lead mentor, submit your questions, and participate in code reviews.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {sessions.map((sess) => (
                <div
                  key={sess.id}
                  className={`rounded-3xl border p-6 space-y-4 relative overflow-hidden ${
                    sess.isUpcoming
                      ? 'bg-gradient-to-b from-[#0F1C18] to-[#09110F] border-emerald-500/40 shadow-xl'
                      : 'bg-[#09110F] border-[#1B2F2A]'
                  }`}
                >
                  {sess.isUpcoming && (
                    <div className="absolute top-0 right-0 bg-emerald-500 text-black text-[0.65rem] font-extrabold font-mono px-3 py-1 rounded-bl-xl uppercase tracking-wider flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-black animate-ping" /> Next Up
                    </div>
                  )}

                  {/* Time & Phase Badge */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                      <Calendar className="w-3 h-3" /> {sess.date}
                    </span>
                    <span className="text-xs font-mono text-slate-300 bg-[#152522] px-2.5 py-0.5 rounded-full flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" /> {sess.time}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white leading-snug">
                    {sess.title}
                  </h3>

                  {/* Instructor Bio Card */}
                  <div className="flex items-center gap-3 bg-[#070D0B] p-3 rounded-2xl border border-[#152522]">
                    <img
                      src={sess.instructorAvatar}
                      alt={sess.instructor}
                      className="w-10 h-10 rounded-xl object-cover border border-emerald-500/30"
                    />
                    <div>
                      <h4 className="text-xs font-bold text-white">{sess.instructor}</h4>
                      <p className="text-[0.7rem] text-slate-400">{sess.instructorRole}</p>
                    </div>
                  </div>

                  {/* Agenda */}
                  <div className="space-y-1.5 text-xs text-slate-300">
                    <span className="font-bold text-slate-400 uppercase tracking-wider text-[0.7rem] font-mono">
                      Session Agenda:
                    </span>
                    <ul className="space-y-1 pl-1">
                      {sess.agenda.map((ag, i) => (
                        <li key={i} className="flex items-start gap-2 text-slate-300 text-xs">
                          <span className="text-emerald-400 text-xs font-bold">›</span>
                          <span>{ag}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Session Prerequisites */}
                  {sess.prerequisites.length > 0 && (
                    <div className="bg-[#070D0B] p-3 rounded-xl border border-[#152522] space-y-1">
                      <span className="text-[0.7rem] font-bold text-amber-400 font-mono flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" /> Prerequisites:
                      </span>
                      <ul className="text-xs text-slate-400 space-y-0.5 pl-1">
                        {sess.prerequisites.map((req, i) => (
                          <li key={i} className="flex items-center gap-1.5">
                            <span className="w-1 h-1 rounded-full bg-slate-500" />
                            <span>{req}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="pt-2 flex items-center gap-3 flex-wrap">
                    {sess.isUpcoming ? (
                      <a
                        href={sess.meetUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs flex items-center gap-2 transition-all shadow-md shadow-emerald-950"
                      >
                        <Video className="w-4 h-4" />
                        <span>Join Live Classroom (Google Meet)</span>
                      </a>
                    ) : (
                      <a
                        href={sess.recordingUrl || '#'}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 rounded-xl bg-[#152522] hover:bg-[#1F3832] text-emerald-300 font-bold text-xs flex items-center gap-1.5 transition-colors border border-[#1B2F2A]"
                      >
                        <Video className="w-3.5 h-3.5" />
                        <span>Watch Replay ({sess.recordingDuration || '2h'})</span>
                      </a>
                    )}
                  </div>

                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: SUBMITTED PROJECT REPOSITORIES */}
        {activeTab === 'projects' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-white tracking-tight flex items-center gap-2">
                  <span>Submitted Project Repositories & Capstones</span>
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Direct GitHub repository submissions, live URL deployments, and mentor code review feedback.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsSubmitModalOpen(true)}
                className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs flex items-center gap-2 shadow-lg shadow-emerald-950 transition-all cursor-pointer self-start sm:self-auto"
                id="dash-submit-project-tab-btn"
              >
                <Plus className="w-4 h-4" />
                <span>Submit New Repo</span>
              </button>
            </div>

            {/* Status Filter Chips */}
            <div className="flex items-center gap-2 flex-wrap">
              <button
                type="button"
                onClick={() => setProjectFilter('ALL')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold font-mono transition-all cursor-pointer flex items-center gap-2 ${
                  projectFilter === 'ALL'
                    ? 'bg-slate-200 text-black shadow-md'
                    : 'bg-[#0B1513] text-slate-400 hover:text-white border border-[#1B2F2A]'
                }`}
                id="filter-projects-all"
              >
                <span>All Projects</span>
                <span className={`px-1.5 py-0.2 rounded-full text-[0.65rem] font-bold ${
                  projectFilter === 'ALL' ? 'bg-black/20 text-black' : 'bg-[#152522] text-slate-400'
                }`}>
                  {projects.length}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setProjectFilter('COMPLETED')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold font-mono transition-all cursor-pointer flex items-center gap-2 ${
                  projectFilter === 'COMPLETED'
                    ? 'bg-emerald-500 text-black shadow-md font-extrabold'
                    : 'bg-[#0B1513] text-emerald-400/80 hover:text-emerald-300 border border-[#1B2F2A]'
                }`}
                id="filter-projects-completed"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Completed</span>
                <span className={`px-1.5 py-0.2 rounded-full text-[0.65rem] font-bold ${
                  projectFilter === 'COMPLETED' ? 'bg-black/20 text-black' : 'bg-emerald-500/20 text-emerald-300'
                }`}>
                  {completedProjectsCount}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setProjectFilter('IN_PROGRESS')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold font-mono transition-all cursor-pointer flex items-center gap-2 ${
                  projectFilter === 'IN_PROGRESS'
                    ? 'bg-amber-400 text-black shadow-md font-extrabold'
                    : 'bg-[#0B1513] text-amber-400/80 hover:text-amber-300 border border-[#1B2F2A]'
                }`}
                id="filter-projects-in-progress"
              >
                <span className="w-2 h-2 rounded-full bg-current animate-pulse" />
                <span>In-Progress</span>
                <span className={`px-1.5 py-0.2 rounded-full text-[0.65rem] font-bold ${
                  projectFilter === 'IN_PROGRESS' ? 'bg-black/20 text-black' : 'bg-amber-500/20 text-amber-300'
                }`}>
                  {inProgressProjectsCount}
                </span>
              </button>
            </div>

            {/* Repos Grid */}
            {filteredProjects.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                {filteredProjects.map((proj) => {
                  const isCompleted = proj.status === 'APPROVED' || proj.status === 'COMPLETED';

                  return (
                    <div
                      key={proj.id}
                      className="rounded-3xl bg-[#0B1513] border border-[#1B2F2A] p-6 space-y-4 hover:border-emerald-500/40 transition-colors shadow-lg relative"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="space-y-1">
                          <span className="text-[0.65rem] font-mono font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                            {proj.phase}
                          </span>
                          <h3 className="text-base font-bold text-white mt-1">
                            {proj.title}
                          </h3>
                        </div>

                        {/* Prominent Completed / In-Progress Badges */}
                        <div className="flex-none">
                          {isCompleted ? (
                            <div className="flex items-center gap-1.5">
                              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-mono font-bold shadow-sm">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                                <span>Completed</span>
                              </span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-1.5">
                              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-mono font-bold shadow-sm">
                                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                                <span>In-Progress</span>
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Review Stage Status Tag */}
                      <div className="flex items-center gap-2 flex-wrap text-xs">
                        {isCompleted ? (
                          <span className="text-[0.7rem] font-mono text-emerald-400 bg-[#070D0B] px-2.5 py-0.5 rounded-md border border-emerald-500/20 flex items-center gap-1">
                            <ShieldCheck className="w-3 h-3 text-emerald-400" />
                            <span>Code Review Passed</span>
                            {proj.score && (
                              <span className="font-bold text-emerald-300 ml-1">
                                • {proj.score}/10
                              </span>
                            )}
                          </span>
                        ) : (
                          <span className="text-[0.7rem] font-mono text-amber-300 bg-[#070D0B] px-2.5 py-0.5 rounded-md border border-amber-500/20 flex items-center gap-1">
                            <Clock className="w-3 h-3 text-amber-400" />
                            <span>
                              {proj.status === 'NEEDS_REVISION'
                                ? 'Changes Requested by Mentor'
                                : 'Awaiting Mentor Review & Score'}
                            </span>
                          </span>
                        )}
                      </div>

                      {/* Links */}
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <a
                          href={proj.repoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 rounded-xl bg-[#152522] hover:bg-[#1C332D] text-slate-200 border border-[#1B2F2A] text-xs font-semibold flex items-center gap-1.5 transition-colors"
                        >
                          <Github className="w-4 h-4 text-white" />
                          <span>GitHub Repo</span>
                          <ExternalLink className="w-3 h-3 text-slate-500" />
                        </a>

                        {proj.liveUrl && (
                          <a
                            href={proj.liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                            <span>Live Demo</span>
                          </a>
                        )}
                      </div>

                      {/* Tech Stack Tags */}
                      <div className="flex items-center gap-1.5 flex-wrap pt-1">
                        {proj.techStack.map((tech, i) => (
                          <span
                            key={i}
                            className="text-[0.7rem] bg-[#070D0B] text-slate-400 px-2 py-0.5 rounded-md border border-[#152522]"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>

                      {/* Mentor Review Feedback Box */}
                      {proj.mentorFeedback && (
                        <div className="bg-[#070D0B] rounded-2xl p-3.5 border border-[#152522] space-y-1.5">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-bold text-slate-300 flex items-center gap-1">
                              <Code2 className="w-3.5 h-3.5 text-emerald-400" />
                              <span>Mentor Feedback ({proj.mentorName || 'Lead Mentor'})</span>
                            </span>
                            {proj.score && (
                              <span className="font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                                Score: {proj.score}/10
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-400 leading-relaxed italic">
                            "{proj.mentorFeedback}"
                          </p>
                        </div>
                      )}

                      <div className="text-[0.7rem] text-slate-500 font-mono">
                        Submitted on: {new Date(proj.submittedAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </div>

                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="rounded-3xl bg-[#0B1513] border border-[#1B2F2A] p-12 text-center space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-[#152522] border border-[#1B2F2A] flex items-center justify-center mx-auto text-slate-400">
                  <FolderGit2 className="w-6 h-6 text-slate-400" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-white">No projects found for this filter</h3>
                  <p className="text-xs text-slate-400">
                    {projectFilter === 'COMPLETED'
                      ? 'You have no completed projects yet. Complete and get mentor approval on your submissions.'
                      : 'No in-progress projects currently under review.'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setProjectFilter('ALL')}
                  className="px-4 py-2 rounded-xl bg-[#152522] hover:bg-[#1B2F2A] text-slate-300 text-xs font-mono font-bold transition-colors cursor-pointer"
                >
                  View All Projects
                </button>
              </div>
            )}
          </div>
        )}

        {/* TAB 4: CERTIFICATE & CREDENTIALS */}
        {activeTab === 'certificate' && student && (
          <div className="space-y-6">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                Course Completion Certificate & Proof of Competency
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Verifiable cryptographic credential issued upon completing all 4 milestone projects.
              </p>
            </div>

            <div className="rounded-3xl bg-[#0B1513] border border-[#1B2F2A] p-6 sm:p-8 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                    <Award className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">
                      {student.courseName}
                    </h3>
                    <p className="text-xs text-slate-400">
                      Issued to: <strong>{student.fullName}</strong> • Enrollment ID: <strong>{student.enrollmentId}</strong>
                    </p>
                  </div>
                </div>

                <div>
                  {student.certificateStatus === 'ISSUED' ? (
                    <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                      ✓ Certificate Issued
                    </span>
                  ) : (
                    <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
                      Eligible upon 80% completion ({liveProgressPercent}% now)
                    </span>
                  )}
                </div>
              </div>

              {/* Certificate Verification Banner */}
              <div className="bg-[#070D0B] rounded-2xl p-5 border border-[#152522] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="text-xs font-bold text-white flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>Public Verification Link</span>
                  </div>
                  <p className="text-xs text-slate-400 font-mono">
                    Credential ID: {student.certificateId || 'CERT-CI-2026-0001'}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    const certId = student.certificateId || 'CERT-CI-2026-0001';
                    if (onOpenCertificateVerify) {
                      onOpenCertificateVerify(certId);
                    } else {
                      window.location.hash = `#verify/${certId}`;
                    }
                  }}
                  className="px-4 py-2 rounded-xl bg-emerald-500 text-black font-bold text-xs flex items-center gap-1.5 cursor-pointer hover:bg-emerald-400 transition-colors"
                >
                  <span>Open Public Verification Page</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>
          </div>
        )}

      </main>

      {/* SUBMIT PROJECT REPOSITORY MODAL */}
      {isSubmitModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0B1513] border border-emerald-500/40 rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl space-y-4">
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-emerald-400">
                <Github className="w-5 h-5" />
                <h3 className="text-base font-bold text-white">Submit Project Repository</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsSubmitModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-300">
              Submit your GitHub repository link and hosted demo URL for mentor review and grading.
            </p>

            {submitSuccessMsg ? (
              <div className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500 text-emerald-300 text-xs font-bold text-center">
                {submitSuccessMsg}
              </div>
            ) : (
              <form onSubmit={handleSubmitProject} className="space-y-3.5 text-xs">
                
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Project Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. AI Customer Assistant & Next.js Dashboard"
                    value={submitTitle}
                    onChange={(e) => setSubmitTitle(e.target.value)}
                    className="w-full bg-[#070D0B] border border-[#1B2F2A] rounded-xl p-2.5 text-white placeholder:text-slate-600 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Curriculum Milestone / Phase
                  </label>
                  <select
                    value={submitPhase}
                    onChange={(e) => setSubmitPhase(e.target.value)}
                    className="w-full bg-[#070D0B] border border-[#1B2F2A] rounded-xl p-2.5 text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Week 1: Foundations & Personal Ship">Week 1: Foundations & Personal Ship</option>
                    <option value="Week 2: Next.js 15 & PostgreSQL Dynamic Site">Week 2: Next.js 15 & PostgreSQL Dynamic Site</option>
                    <option value="Week 3: Micro-SaaS & Razorpay Subscriptions">Week 3: Micro-SaaS & Razorpay Subscriptions</option>
                    <option value="Week 4: Mobile & Capstone Sprint">Week 4: Mobile & Capstone Sprint</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    GitHub Repository URL *
                  </label>
                  <input
                    type="url"
                    required
                    placeholder="https://github.com/your-username/your-repo-name"
                    value={submitRepoUrl}
                    onChange={(e) => setSubmitRepoUrl(e.target.value)}
                    className="w-full bg-[#070D0B] border border-[#1B2F2A] rounded-xl p-2.5 text-white placeholder:text-slate-600 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Live Demo URL (Optional)
                  </label>
                  <input
                    type="url"
                    placeholder="https://your-project.vercel.app"
                    value={submitLiveUrl}
                    onChange={(e) => setSubmitLiveUrl(e.target.value)}
                    className="w-full bg-[#070D0B] border border-[#1B2F2A] rounded-xl p-2.5 text-white placeholder:text-slate-600 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Tech Stack (Comma Separated)
                  </label>
                  <input
                    type="text"
                    placeholder="Next.js, TypeScript, Tailwind CSS, PostgreSQL"
                    value={submitTechStack}
                    onChange={(e) => setSubmitTechStack(e.target.value)}
                    className="w-full bg-[#070D0B] border border-[#1B2F2A] rounded-xl p-2.5 text-white placeholder:text-slate-600 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Notes for Mentor / Highlights
                  </label>
                  <textarea
                    rows={2}
                    placeholder="What feature are you most proud of? Any challenges solved?"
                    value={submitNotes}
                    onChange={(e) => setSubmitNotes(e.target.value)}
                    className="w-full bg-[#070D0B] border border-[#1B2F2A] rounded-xl p-2.5 text-white placeholder:text-slate-600 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsSubmitModalOpen(false)}
                    className="px-4 py-2 rounded-xl bg-[#152522] text-slate-300 font-semibold hover:bg-[#1E3630] cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmittingProject}
                    className="px-5 py-2 rounded-xl bg-emerald-500 text-black font-bold hover:bg-emerald-400 transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    {isSubmittingProject ? (
                      <>
                        <span className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                        <span>Submitting...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        <span>Submit for Review</span>
                      </>
                    )}
                  </button>
                </div>

              </form>
            )}

          </div>
        </div>
      )}

    </div>
  );
}
