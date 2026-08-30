import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { 
  AdminUser, 
  Student, 
  Lead, 
  AdminPaymentRecord, 
  Workshop, 
  Course, 
  Certificate, 
  Referral, 
  AuditLog, 
  CommunicationLog,
  BroadcastMessage,
  AdminRole,
  DashboardMetrics 
} from '../src/types/admin';

const DATA_DIR = path.join(process.cwd(), 'data');

const FILES = {
  ADMINS: path.join(DATA_DIR, 'admins.json'),
  STUDENTS: path.join(DATA_DIR, 'students.json'),
  LEADS: path.join(DATA_DIR, 'leads.json'),
  PAYMENTS: path.join(DATA_DIR, 'payments_v2.json'),
  WORKSHOPS: path.join(DATA_DIR, 'workshops.json'),
  COURSES: path.join(DATA_DIR, 'courses.json'),
  CERTIFICATES: path.join(DATA_DIR, 'certificates.json'),
  REFERRALS: path.join(DATA_DIR, 'referrals.json'),
  AUDIT_LOGS: path.join(DATA_DIR, 'audit_logs.json'),
  COMMUNICATIONS: path.join(DATA_DIR, 'communications.json'),
  BROADCASTS: path.join(DATA_DIR, 'broadcasts.json'),
  PROJECTS: path.join(DATA_DIR, 'student_projects.json'),
  CONFIG: path.join(DATA_DIR, 'config.json'),
  SESSIONS: path.join(DATA_DIR, 'sessions.json'),
  IDEMPOTENCY: path.join(DATA_DIR, 'idempotency.json')
};

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function readJson<T>(filePath: string, fallback: T): T {
  ensureDataDir();
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify(fallback, null, 2), 'utf-8');
    return fallback;
  }
  try {
    const raw = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(raw) as T;
  } catch (err) {
    console.error(`Error reading JSON from ${filePath}:`, err);
    return fallback;
  }
}

function writeJson<T>(filePath: string, data: T) {
  ensureDataDir();
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
}

// ------------------- INITIAL SEED DATA -------------------

const INITIAL_ADMINS: (AdminUser & { passwordHash: string })[] = [
  {
    id: 'ADM-001',
    name: 'Harsh Vardhan (Lead)',
    email: 'admin@codeinindia.in',
    role: 'SUPER_ADMIN',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
    status: 'ACTIVE',
    createdAt: '2026-01-01T00:00:00.000Z',
    lastLoginAt: new Date().toISOString(),
    passwordHash: 'admin123' // default demo password
  },
  {
    id: 'ADM-002',
    name: 'Ananya Sharma (Operations)',
    email: 'operations@codeinindia.in',
    role: 'ADMIN',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80',
    status: 'ACTIVE',
    createdAt: '2026-01-15T00:00:00.000Z',
    lastLoginAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    passwordHash: 'admin123'
  },
  {
    id: 'ADM-003',
    name: 'Rohan Verma (Support)',
    email: 'support@codeinindia.in',
    role: 'SUPPORT',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
    status: 'ACTIVE',
    createdAt: '2026-02-01T00:00:00.000Z',
    lastLoginAt: new Date(Date.now() - 3600000 * 12).toISOString(),
    passwordHash: 'admin123'
  }
];

const INITIAL_COURSES: Course[] = [
  {
    id: 'crs-cohort-4w',
    name: 'Full-Stack 4-Week Live Cohort (Hindi + English)',
    description: 'Build Dynamic Websites, Micro-SaaS with Razorpay payments & Flutter/PWA Mobile Apps with AI pair-coding.',
    regularPrice: 9999,
    launchPrice: 4999,
    duration: '4 Weeks (Weekends Live)',
    status: 'ACTIVE',
    modulesCount: 4,
    enrolledCount: 142,
    completionRate: 84.5,
    modules: [
      { id: 'm1', title: 'Week 1: Think in Code, Build with AI & Personal Domain Ship', lessonsCount: 6, durationHours: 8 },
      { id: 'm2', title: 'Week 2: Full-Stack Dynamic Sites with Next.js, Auth & PostgreSQL', lessonsCount: 8, durationHours: 10 },
      { id: 'm3', title: 'Week 3: Micro-SaaS Platforms, Razorpay Webhooks & Subscriptions', lessonsCount: 8, durationHours: 10 },
      { id: 'm4', title: 'Week 4: Flutter Mobile Apps, PWA Packaging & Zero-to-1 Launch Playbook', lessonsCount: 6, durationHours: 8 }
    ]
  },
  {
    id: 'crs-workshop-2d',
    name: '2-Day Live Weekend Builder Workshop',
    description: 'Fast-paced intensive sprint building full-stack web applications with modern AI tooling.',
    regularPrice: 4999,
    launchPrice: 2999,
    duration: '2 Days (Sat-Sun)',
    status: 'ACTIVE',
    modulesCount: 2,
    enrolledCount: 310,
    completionRate: 91.2,
    modules: [
      { id: 'wm1', title: 'Day 1: AI Prompt Engineering for Full-Stack Architecture', lessonsCount: 4, durationHours: 6 },
      { id: 'wm2', title: 'Day 2: Shipping a Live Functional App on Custom Domain', lessonsCount: 4, durationHours: 6 }
    ]
  },
  {
    id: 'crs-free-masterclass',
    name: 'Free 2-Hour AI Coding Masterclass',
    description: 'Introductory hands-on session on building software without traditional syntax memorization.',
    regularPrice: 999,
    launchPrice: 0,
    duration: '2 Hours Live',
    status: 'ACTIVE',
    modulesCount: 1,
    enrolledCount: 2450,
    completionRate: 72.8,
    modules: [
      { id: 'f1', title: 'Session: Building Your First Web App in 60 Minutes', lessonsCount: 2, durationHours: 2 }
    ]
  }
];

const INITIAL_WORKSHOPS: Workshop[] = [
  {
    id: 'WS-2026-FEB-B1',
    title: 'Free Live AI Coding & App Building Masterclass',
    date: '2026-02-20',
    time: '08:00 PM - 10:00 PM IST',
    host: 'Harsh Vardhan (Ex-Founding Engineer)',
    meetingLink: 'https://meet.google.com/cii-live-session',
    registrationDeadline: '2026-02-20T18:00:00.000Z',
    maxSeats: 1500,
    status: 'OPEN',
    registrationsCount: 842,
    attendedCount: 0,
    paidConversionsCount: 64,
    revenue: 319936
  },
  {
    id: 'WS-2026-FEB-B2',
    title: 'Weekend 2-Day Micro-SaaS Sprint',
    date: '2026-02-22',
    time: '11:00 AM - 05:00 PM IST',
    host: 'Harsh Vardhan & Senior Mentors',
    meetingLink: 'https://meet.google.com/cii-saas-sprint',
    registrationDeadline: '2026-02-21T23:59:59.000Z',
    maxSeats: 200,
    status: 'OPEN',
    registrationsCount: 168,
    attendedCount: 0,
    paidConversionsCount: 42,
    revenue: 125958
  },
  {
    id: 'WS-2026-JAN-COMPLETED',
    title: 'Zero to Live App in 90 Minutes (Batch Jan 2026)',
    date: '2026-01-25',
    time: '08:00 PM - 09:30 PM IST',
    host: 'Harsh Vardhan',
    meetingLink: 'https://meet.google.com/cii-jan-archived',
    registrationDeadline: '2026-01-25T17:00:00.000Z',
    maxSeats: 1000,
    status: 'COMPLETED',
    registrationsCount: 1240,
    attendedCount: 780,
    paidConversionsCount: 147,
    revenue: 734853
  }
];

// Seed initial verified students with strict Enrollment IDs (CI-2026-XXXXXX)
const INITIAL_STUDENTS: Student[] = [
  {
    id: 'STU-2026-00101',
    enrollmentId: 'CI-2026-000001',
    fullName: 'Aarav Sharma',
    email: 'aarav.sharma@example.com',
    mobile: '9876543210',
    city: 'Bengaluru',
    state: 'Karnataka',
    country: 'India',
    registrationDate: '2026-02-01T10:14:00.000Z',
    courseId: 'crs-cohort-4w',
    courseName: 'Full-Stack 4-Week Live Cohort (Hindi + English)',
    paymentStatus: 'PAID',
    paymentAmount: 4999,
    paymentDate: '2026-02-01T10:15:30.000Z',
    paymentMethod: 'UPI (Google Pay)',
    orderId: 'order_Nx8Y29s8192a01',
    paymentId: 'pay_Nx8Z91823901a1',
    enrollmentStatus: 'ACTIVE',
    courseProgress: 75,
    modulesCompleted: 3,
    totalModules: 4,
    lastLoginAt: '2026-02-16T14:20:00.000Z',
    lastActivityAt: '2026-02-16T15:10:00.000Z',
    source: 'Instagram Ad',
    campaign: 'cii_insta_feb_launch',
    utmSource: 'instagram',
    utmMedium: 'paid_social',
    utmCampaign: 'launch_cohort_2026',
    referralCode: 'CI-AARAV-101',
    certificateId: undefined,
    certificateStatus: 'ELIGIBLE',
    isTest: false,
    notes: [
      {
        id: 'n1',
        adminName: 'Harsh Vardhan (Lead)',
        adminRole: 'SUPER_ADMIN',
        text: 'Aarav completed Week 3 SaaS project ahead of schedule. Excellent student.',
        timestamp: '2026-02-14T11:00:00.000Z'
      }
    ],
    activityTimeline: [
      {
        id: 'act-1',
        type: 'REGISTRATION',
        title: 'Registered for Cohort Track',
        description: 'Lead submitted through Instagram campaign landing page.',
        timestamp: '2026-02-01T10:14:00.000Z'
      },
      {
        id: 'act-2',
        type: 'PAYMENT',
        title: 'Payment Verified via Razorpay',
        description: 'HMAC-SHA256 signature verified. ₹4,999 captured via UPI.',
        timestamp: '2026-02-01T10:15:30.000Z'
      },
      {
        id: 'act-3',
        type: 'ENROLLMENT',
        title: 'Enrollment ID Generated',
        description: 'Assigned unique ID: CI-2026-000001. Course portal unlocked.',
        timestamp: '2026-02-01T10:15:32.000Z'
      },
      {
        id: 'act-4',
        type: 'MODULE_COMPLETE',
        title: 'Completed Week 3 SaaS Micro-Platform',
        description: 'Successfully deployed SaaS with Razorpay webhook on personal domain.',
        timestamp: '2026-02-15T18:00:00.000Z'
      }
    ],
    createdAt: '2026-02-01T10:14:00.000Z',
    updatedAt: '2026-02-16T15:10:00.000Z'
  },
  {
    id: 'STU-2026-00102',
    enrollmentId: 'CI-2026-000002',
    fullName: 'Priya Patel',
    email: 'priya.p@example.com',
    mobile: '9123456789',
    city: 'Ahmedabad',
    state: 'Gujarat',
    country: 'India',
    registrationDate: '2026-02-03T11:20:00.000Z',
    courseId: 'crs-cohort-4w',
    courseName: 'Full-Stack 4-Week Live Cohort (Hindi + English)',
    paymentStatus: 'PAID',
    paymentAmount: 4999,
    paymentDate: '2026-02-03T11:22:15.000Z',
    paymentMethod: 'Credit Card (HDFC Visa)',
    orderId: 'order_Px9102938102a2',
    paymentId: 'pay_Px9281920192a2',
    enrollmentStatus: 'COMPLETED',
    courseProgress: 100,
    modulesCompleted: 4,
    totalModules: 4,
    lastLoginAt: '2026-02-15T09:00:00.000Z',
    lastActivityAt: '2026-02-15T11:30:00.000Z',
    source: 'YouTube Masterclass',
    campaign: 'youtube_live_stream_jan',
    utmSource: 'youtube',
    utmMedium: 'organic_video',
    referralCode: 'CI-PRIYA-102',
    certificateId: 'CERT-CI-2026-0001',
    certificateStatus: 'ISSUED',
    certificateIssuedAt: '2026-02-15T12:00:00.000Z',
    isTest: false,
    notes: [],
    activityTimeline: [
      {
        id: 'act-10',
        type: 'REGISTRATION',
        title: 'Lead Registered',
        description: 'Captured via YouTube Masterclass stream link.',
        timestamp: '2026-02-03T11:20:00.000Z'
      },
      {
        id: 'act-11',
        type: 'PAYMENT',
        title: 'Payment Verified',
        description: 'Captured ₹4,999 via HDFC Credit Card.',
        timestamp: '2026-02-03T11:22:15.000Z'
      },
      {
        id: 'act-12',
        type: 'CERTIFICATE',
        title: 'Certificate Issued',
        description: 'Completed 100% course requirements. Credential CERT-CI-2026-0001 published.',
        timestamp: '2026-02-15T12:00:00.000Z'
      }
    ],
    createdAt: '2026-02-03T11:20:00.000Z',
    updatedAt: '2026-02-15T12:00:00.000Z'
  },
  {
    id: 'STU-2026-00103',
    enrollmentId: 'CI-2026-000003',
    fullName: 'Rohan Mehra',
    email: 'rohan.mehra@example.com',
    mobile: '9822334455',
    city: 'Pune',
    state: 'Maharashtra',
    country: 'India',
    registrationDate: '2026-02-05T14:10:00.000Z',
    courseId: 'crs-workshop-2d',
    courseName: '2-Day Live Weekend Builder Workshop',
    paymentStatus: 'PAID',
    paymentAmount: 2999,
    paymentDate: '2026-02-05T14:12:00.000Z',
    paymentMethod: 'NetBanking (ICICI)',
    orderId: 'order_Rx182910283a03',
    paymentId: 'pay_Rx192830192a03',
    enrollmentStatus: 'ACTIVE',
    courseProgress: 50,
    modulesCompleted: 1,
    totalModules: 2,
    lastLoginAt: '2026-02-14T10:00:00.000Z',
    source: 'Google Search',
    utmSource: 'google',
    utmMedium: 'cpc',
    utmCampaign: 'search_ai_coding_india',
    isTest: false,
    notes: [],
    activityTimeline: [],
    createdAt: '2026-02-05T14:10:00.000Z',
    updatedAt: '2026-02-14T10:00:00.000Z'
  },
  {
    id: 'STU-2026-00104',
    enrollmentId: 'CI-2026-000004',
    fullName: 'Sana Malik',
    email: 'sana.malik@example.com',
    mobile: '9765432109',
    city: 'Lucknow',
    state: 'Uttar Pradesh',
    country: 'India',
    registrationDate: '2026-02-08T09:00:00.000Z',
    courseId: 'crs-cohort-4w',
    courseName: 'Full-Stack 4-Week Live Cohort (Hindi + English)',
    paymentStatus: 'PAID',
    paymentAmount: 4999,
    paymentDate: '2026-02-08T09:02:10.000Z',
    paymentMethod: 'UPI (Paytm)',
    orderId: 'order_Sx781928371a04',
    paymentId: 'pay_Sx792837182a04',
    enrollmentStatus: 'ACTIVE',
    courseProgress: 15,
    modulesCompleted: 0,
    totalModules: 4,
    lastLoginAt: '2026-02-09T09:00:00.000Z', // 7 days inactive => At Risk student!
    source: 'Referral',
    referralCode: 'CI-AARAV-101',
    isTest: false,
    notes: [
      {
        id: 'n2',
        adminName: 'Rohan Verma (Support)',
        adminRole: 'SUPPORT',
        text: 'Followed up on WhatsApp regarding Week 2 submission. Student had university exams.',
        timestamp: '2026-02-14T16:00:00.000Z'
      }
    ],
    activityTimeline: [],
    createdAt: '2026-02-08T09:00:00.000Z',
    updatedAt: '2026-02-14T16:00:00.000Z'
  },
  {
    id: 'STU-2026-TEST-001',
    enrollmentId: 'CI-TEST-000001',
    fullName: 'Vikram QA Tester',
    email: 'vikram.tester@qa.internal',
    mobile: '9999900001',
    city: 'Delhi',
    state: 'Delhi',
    country: 'India',
    registrationDate: '2026-02-16T12:00:00.000Z',
    courseId: 'crs-cohort-4w',
    courseName: 'Full-Stack 4-Week Live Cohort (Hindi + English)',
    paymentStatus: 'PAID',
    paymentAmount: 1,
    paymentDate: '2026-02-16T12:01:00.000Z',
    paymentMethod: 'Razorpay Test Card',
    orderId: 'order_test_99182390',
    paymentId: 'pay_test_99182391',
    enrollmentStatus: 'ACTIVE',
    courseProgress: 25,
    modulesCompleted: 1,
    totalModules: 4,
    source: 'Direct Test Checkout',
    isTest: true,
    notes: [],
    activityTimeline: [],
    createdAt: '2026-02-16T12:00:00.000Z',
    updatedAt: '2026-02-16T12:01:00.000Z'
  }
];

// Seed initial unpaid leads (people who registered but haven't paid yet)
const INITIAL_LEADS: Lead[] = [
  {
    id: 'LEAD-2026-0001',
    name: 'Kavya Nair',
    email: 'kavya.nair@example.com',
    phone: '9845112233',
    city: 'Kochi',
    state: 'Kerala',
    workshopId: 'WS-2026-FEB-B1',
    courseInterest: 'Full-Stack 4-Week Live Cohort',
    utmSource: 'instagram',
    utmMedium: 'reels',
    utmCampaign: 'insta_viral_demo_jan',
    source: 'Instagram',
    paymentStatus: 'PENDING',
    followUpStatus: 'WORKSHOP_REGISTERED',
    notes: [
      {
        id: 'ln1',
        adminName: 'Ananya Sharma (Operations)',
        adminRole: 'ADMIN',
        text: 'Registered for upcoming Tuesday batch masterclass. WhatsApp invite delivered.',
        timestamp: '2026-02-15T14:30:00.000Z'
      }
    ],
    createdAt: '2026-02-15T14:28:00.000Z',
    updatedAt: '2026-02-15T14:30:00.000Z'
  },
  {
    id: 'LEAD-2026-0002',
    name: 'Aditya Gupta',
    email: 'aditya.g@example.com',
    phone: '9811223344',
    city: 'Jaipur',
    state: 'Rajasthan',
    workshopId: 'WS-2026-FEB-B1',
    courseInterest: '2-Day Live Weekend Builder Workshop',
    utmSource: 'youtube',
    utmMedium: 'sponsored',
    utmCampaign: 'coder_pathshala_collab',
    source: 'YouTube',
    paymentStatus: 'NOT_STARTED',
    followUpStatus: 'OFFER_PRESENTED',
    notes: [],
    createdAt: '2026-02-16T08:10:00.000Z',
    updatedAt: '2026-02-16T08:10:00.000Z'
  },
  {
    id: 'LEAD-2026-0003',
    name: 'Tanvi Deshmukh',
    email: 'tanvi.d@example.com',
    phone: '9922334455',
    city: 'Nagpur',
    state: 'Maharashtra',
    workshopId: 'WS-2026-FEB-B2',
    courseInterest: 'Full-Stack 4-Week Live Cohort',
    utmSource: 'google',
    utmMedium: 'organic',
    source: 'Google Search',
    paymentStatus: 'NOT_STARTED',
    followUpStatus: 'NEW',
    notes: [],
    createdAt: '2026-02-16T11:45:00.000Z',
    updatedAt: '2026-02-16T11:45:00.000Z'
  },
  {
    id: 'LEAD-2026-0004',
    name: 'Manish Pandey',
    email: 'manish.p@example.com',
    phone: '9711002233',
    city: 'Varanasi',
    state: 'Uttar Pradesh',
    courseInterest: 'Full-Stack 4-Week Live Cohort',
    utmSource: 'facebook',
    utmMedium: 'paid_ad',
    source: 'Facebook',
    paymentStatus: 'FAILED',
    followUpStatus: 'PAYMENT_PENDING',
    notes: [
      {
        id: 'ln2',
        adminName: 'Rohan Verma (Support)',
        adminRole: 'SUPPORT',
        text: 'Payment failed at bank gateway. Sent retry link on WhatsApp.',
        timestamp: '2026-02-16T15:00:00.000Z'
      }
    ],
    createdAt: '2026-02-16T14:40:00.000Z',
    updatedAt: '2026-02-16T15:00:00.000Z'
  }
];

// Seed initial payments ledger
const INITIAL_PAYMENTS: AdminPaymentRecord[] = [
  {
    id: 'pay_Nx8Z91823901a1',
    orderId: 'order_Nx8Y29s8192a01',
    studentId: 'STU-2026-00101',
    studentName: 'Aarav Sharma',
    studentEmail: 'aarav.sharma@example.com',
    studentMobile: '9876543210',
    courseId: 'crs-cohort-4w',
    courseName: 'Full-Stack 4-Week Live Cohort',
    amount: 4999,
    currency: 'INR',
    status: 'PAID',
    paymentMethod: 'UPI',
    gateway: 'Razorpay',
    isTest: false,
    verifiedAt: '2026-02-01T10:15:30.000Z',
    createdAt: '2026-02-01T10:14:10.000Z',
    lifecycle: [
      { stage: 'ORDER_CREATED', timestamp: '2026-02-01T10:14:10.000Z', details: 'Order generated on backend for ₹4,999', status: 'SUCCESS' },
      { stage: 'CHECKOUT_OPENED', timestamp: '2026-02-01T10:14:20.000Z', details: 'Razorpay Standard Modal opened', status: 'SUCCESS' },
      { stage: 'PAYMENT_CAPTURED', timestamp: '2026-02-01T10:15:28.000Z', details: 'Payment captured by Razorpay Gateway via UPI', status: 'SUCCESS' },
      { stage: 'SIGNATURE_VERIFIED', timestamp: '2026-02-01T10:15:30.000Z', details: 'HMAC-SHA256 signature verified server-side', status: 'SUCCESS' },
      { stage: 'ENROLLMENT_GENERATED', timestamp: '2026-02-01T10:15:32.000Z', details: 'Generated unique Enrollment ID: CI-2026-000001', status: 'SUCCESS' }
    ]
  },
  {
    id: 'pay_Px9281920192a2',
    orderId: 'order_Px9102938102a2',
    studentId: 'STU-2026-00102',
    studentName: 'Priya Patel',
    studentEmail: 'priya.p@example.com',
    studentMobile: '9123456789',
    courseId: 'crs-cohort-4w',
    courseName: 'Full-Stack 4-Week Live Cohort',
    amount: 4999,
    currency: 'INR',
    status: 'PAID',
    paymentMethod: 'Credit Card',
    gateway: 'Razorpay',
    isTest: false,
    verifiedAt: '2026-02-03T11:22:15.000Z',
    createdAt: '2026-02-03T11:21:00.000Z',
    lifecycle: [
      { stage: 'ORDER_CREATED', timestamp: '2026-02-03T11:21:00.000Z', details: 'Order created', status: 'SUCCESS' },
      { stage: 'SIGNATURE_VERIFIED', timestamp: '2026-02-03T11:22:15.000Z', details: 'HMAC-SHA256 signature verified', status: 'SUCCESS' },
      { stage: 'ENROLLMENT_GENERATED', timestamp: '2026-02-03T11:22:16.000Z', details: 'Assigned Enrollment ID: CI-2026-000002', status: 'SUCCESS' }
    ]
  },
  {
    id: 'pay_Rx192830192a03',
    orderId: 'order_Rx182910283a03',
    studentId: 'STU-2026-00103',
    studentName: 'Rohan Mehra',
    studentEmail: 'rohan.mehra@example.com',
    studentMobile: '9822334455',
    courseId: 'crs-workshop-2d',
    courseName: '2-Day Live Weekend Builder Workshop',
    amount: 2999,
    currency: 'INR',
    status: 'PAID',
    paymentMethod: 'NetBanking',
    gateway: 'Razorpay',
    isTest: false,
    verifiedAt: '2026-02-05T14:12:00.000Z',
    createdAt: '2026-02-05T14:11:00.000Z',
    lifecycle: []
  },
  {
    id: 'pay_Sx792837182a04',
    orderId: 'order_Sx781928371a04',
    studentId: 'STU-2026-00104',
    studentName: 'Sana Malik',
    studentEmail: 'sana.malik@example.com',
    studentMobile: '9765432109',
    courseId: 'crs-cohort-4w',
    courseName: 'Full-Stack 4-Week Live Cohort',
    amount: 4999,
    currency: 'INR',
    status: 'PAID',
    paymentMethod: 'UPI',
    gateway: 'Razorpay',
    isTest: false,
    verifiedAt: '2026-02-08T09:02:10.000Z',
    createdAt: '2026-02-08T09:01:00.000Z',
    lifecycle: []
  },
  {
    id: 'pay_fail_991823a99',
    orderId: 'order_fail_991823',
    studentName: 'Manish Pandey',
    studentEmail: 'manish.p@example.com',
    studentMobile: '9711002233',
    courseId: 'crs-cohort-4w',
    courseName: 'Full-Stack 4-Week Live Cohort',
    amount: 4999,
    currency: 'INR',
    status: 'FAILED',
    paymentMethod: 'UPI',
    gateway: 'Razorpay',
    isTest: false,
    createdAt: '2026-02-16T14:40:00.000Z',
    errorReason: 'Payment declined by issuer bank (insufficient balance or auth timeout)',
    lifecycle: [
      { stage: 'ORDER_CREATED', timestamp: '2026-02-16T14:39:00.000Z', details: 'Order created', status: 'SUCCESS' },
      { stage: 'PAYMENT_CAPTURED', timestamp: '2026-02-16T14:40:00.000Z', details: 'Failed at bank gateway', status: 'FAILED' }
    ]
  },
  {
    id: 'pay_test_99182391',
    orderId: 'order_test_99182390',
    studentId: 'STU-2026-TEST-001',
    studentName: 'Vikram QA Tester',
    studentEmail: 'vikram.tester@qa.internal',
    studentMobile: '9999900001',
    courseId: 'crs-cohort-4w',
    courseName: 'Full-Stack 4-Week Live Cohort',
    amount: 1,
    currency: 'INR',
    status: 'PAID',
    paymentMethod: 'Test Card',
    gateway: 'Razorpay (Test Mode)',
    isTest: true,
    verifiedAt: '2026-02-16T12:01:00.000Z',
    createdAt: '2026-02-16T12:00:30.000Z',
    lifecycle: []
  }
];

const INITIAL_CERTIFICATES: Certificate[] = [
  {
    id: 'CERT-CI-2026-0001',
    studentId: 'STU-2026-00102',
    studentName: 'Priya Patel',
    studentEmail: 'priya.p@example.com',
    enrollmentId: 'CI-2026-000002',
    courseId: 'crs-cohort-4w',
    courseName: 'Full-Stack 4-Week Live Cohort (Hindi + English)',
    issueDate: '2026-02-15T12:00:00.000Z',
    status: 'ACTIVE',
    credentialUrl: 'https://codeinindia.com/verify/CERT-CI-2026-0001',
    skills: ['Next.js 15', 'React 19', 'PostgreSQL', 'Razorpay Webhooks', 'TypeScript', 'Flutter Mobile']
  }
];

const INITIAL_REFERRALS: Referral[] = [
  {
    id: 'ref-1',
    code: 'CI-AARAV-101',
    studentId: 'STU-2026-00101',
    studentName: 'Aarav Sharma',
    studentEmail: 'aarav.sharma@example.com',
    clicks: 142,
    leads: 28,
    paidConversions: 4,
    revenueGenerated: 19996,
    commissionStatus: 'PENDING_REVIEW'
  },
  {
    id: 'ref-2',
    code: 'CI-PRIYA-102',
    studentId: 'STU-2026-00102',
    studentName: 'Priya Patel',
    studentEmail: 'priya.p@example.com',
    clicks: 89,
    leads: 14,
    paidConversions: 2,
    revenueGenerated: 9998,
    commissionStatus: 'APPROVED'
  }
];

const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'AUD-001',
    timestamp: '2026-02-01T10:15:32.000Z',
    adminName: 'SYSTEM (Payment Webhook Engine)',
    adminEmail: 'webhook@codeinindia.in',
    adminRole: 'SUPER_ADMIN',
    action: 'VERIFIED_ENROLLMENT_GENERATED',
    targetType: 'STUDENT',
    targetId: 'STU-2026-00101',
    targetName: 'Aarav Sharma',
    previousValue: 'LEAD / UNPAID',
    newValue: 'PAID / ACTIVE (Enrollment: CI-2026-000001)',
    ipAddress: '10.0.0.1'
  },
  {
    id: 'AUD-002',
    timestamp: '2026-02-15T12:00:00.000Z',
    adminName: 'Harsh Vardhan (Lead)',
    adminEmail: 'admin@codeinindia.in',
    adminRole: 'SUPER_ADMIN',
    action: 'CERTIFICATE_ISSUED',
    targetType: 'CERTIFICATE',
    targetId: 'CERT-CI-2026-0001',
    targetName: 'Priya Patel',
    previousValue: 'ELIGIBLE',
    newValue: 'ISSUED',
    ipAddress: '103.21.144.12'
  }
];

const INITIAL_COMMUNICATIONS: CommunicationLog[] = [
  {
    id: 'comm-1',
    recipientType: 'STUDENT',
    recipientEmail: 'aarav.sharma@example.com',
    recipientPhone: '9876543210',
    channel: 'WHATSAPP',
    templateId: 'tpl_welcome_paid_cohort',
    subject: 'Welcome to CodeInIndia Cohort! Your Enrollment ID: CI-2026-000001',
    status: 'DELIVERED',
    sentAt: '2026-02-01T10:15:35.000Z',
    adminName: 'SYSTEM_AUTOMATION'
  },
  {
    id: 'comm-2',
    recipientType: 'LEAD',
    recipientEmail: 'kavya.nair@example.com',
    recipientPhone: '9845112233',
    channel: 'EMAIL',
    templateId: 'tpl_workshop_reminder_24h',
    subject: 'Reminder: Live Workshop starts tomorrow at 8:00 PM IST',
    status: 'DELIVERED',
    sentAt: '2026-02-16T10:00:00.000Z',
    adminName: 'SYSTEM_AUTOMATION'
  }
];

const INITIAL_BROADCASTS: BroadcastMessage[] = [
  {
    id: 'bc-1',
    subject: 'Important: Live Cohort Orientation Zoom Link for Saturday',
    message: 'Hey {{name}}, welcome to CodeInIndia! Your official Enrollment ID is {{enrollment_id}}. The live cohort orientation kicks off Saturday at 8:00 PM IST.',
    targetAudience: 'ALL_PAID',
    channel: 'WHATSAPP',
    sentAt: '2026-02-15T14:30:00.000Z',
    status: 'SENT',
    recipientCount: 240,
    adminName: 'Super Admin'
  },
  {
    id: 'bc-2',
    subject: 'Reminder: 1-Day Dynamic Website Workshop Starts in 2 Hours',
    message: 'Hi {{name}}, your live builder sprint for 5 Dynamic Websites begins today! Check your registered email for Zoom + GitHub starter templates.',
    targetAudience: 'WORKSHOP_ATTENDEES',
    channel: 'EMAIL',
    sentAt: '2026-02-10T16:00:00.000Z',
    status: 'SENT',
    recipientCount: 512,
    adminName: 'Operations Lead'
  }
];

const INITIAL_PROJECTS = [
  {
    id: 'PRJ-2026-001',
    studentId: 'STU-2026-00101',
    enrollmentId: 'CI-2026-000001',
    title: 'Developer Cloud Portfolio & Custom Domain Ship',
    phase: 'Week 1: Foundations & Personal Ship',
    repoUrl: 'https://github.com/aarav-dev/cii-nextjs-portfolio',
    liveUrl: 'https://aarav-developer.vercel.app',
    techStack: ['Next.js 15', 'Tailwind CSS', 'Vercel DNS', 'TypeScript'],
    submittedAt: '2026-02-04T18:30:00.000Z',
    status: 'APPROVED',
    score: 9.8,
    mentorFeedback: 'Outstanding lighthouse score (99/100) and smooth entrance animations. Clean responsive typography.',
    mentorName: 'Harsh Vardhan',
    reviewedAt: '2026-02-05T10:15:00.000Z'
  },
  {
    id: 'PRJ-2026-002',
    studentId: 'STU-2026-00101',
    enrollmentId: 'CI-2026-000001',
    title: 'PayFlow Micro-SaaS: Razorpay Subscriptions & Webhook Ledger',
    phase: 'Week 3: Micro-SaaS & Payments',
    repoUrl: 'https://github.com/aarav-dev/payflow-micro-saas',
    liveUrl: 'https://payflow-saas.vercel.app',
    techStack: ['React', 'Node.js', 'Express', 'Razorpay SDK', 'PostgreSQL'],
    submittedAt: '2026-02-14T20:45:00.000Z',
    status: 'APPROVED',
    score: 9.6,
    mentorFeedback: 'HMAC SHA256 signature verification is bulletproof. Handled idempotent webhook retries accurately.',
    mentorName: 'Harsh Vardhan',
    reviewedAt: '2026-02-15T14:20:00.000Z'
  },
  {
    id: 'PRJ-2026-003',
    studentId: 'STU-2026-00101',
    enrollmentId: 'CI-2026-000001',
    title: 'AI Code Reviewer & Flutter PWA Companion',
    phase: 'Week 4: Mobile & Capstone Sprint',
    repoUrl: 'https://github.com/aarav-dev/ai-code-reviewer-pwa',
    liveUrl: 'https://ai-code-reviewer.vercel.app',
    techStack: ['Flutter / PWA', 'Google GenAI SDK', 'Tailwind', 'Capacitor'],
    submittedAt: '2026-02-17T11:00:00.000Z',
    status: 'UNDER_REVIEW',
    mentorName: 'Senior Code Reviewer'
  }
];

// ------------------- STORE MANAGER -------------------

export class AdminStore {
  // Admins
  static getAdmins() {
    return readJson(FILES.ADMINS, INITIAL_ADMINS);
  }

  static saveAdmins(data: any[]) {
    writeJson(FILES.ADMINS, data);
  }

  // Students
  static getStudents(): Student[] {
    return readJson(FILES.STUDENTS, INITIAL_STUDENTS);
  }

  static saveStudents(data: Student[]) {
    writeJson(FILES.STUDENTS, data);
  }

  // Leads
  static getLeads(): Lead[] {
    return readJson(FILES.LEADS, INITIAL_LEADS);
  }

  static saveLeads(data: Lead[]) {
    writeJson(FILES.LEADS, data);
  }

  // Payments
  static getPayments(): AdminPaymentRecord[] {
    return readJson(FILES.PAYMENTS, INITIAL_PAYMENTS);
  }

  static savePayments(data: AdminPaymentRecord[]) {
    writeJson(FILES.PAYMENTS, data);
  }

  // Workshops
  static getWorkshops(): Workshop[] {
    return readJson(FILES.WORKSHOPS, INITIAL_WORKSHOPS);
  }

  static saveWorkshops(data: Workshop[]) {
    writeJson(FILES.WORKSHOPS, data);
  }

  // Courses
  static getCourses(): Course[] {
    return readJson(FILES.COURSES, INITIAL_COURSES);
  }

  static saveCourses(data: Course[]) {
    writeJson(FILES.COURSES, data);
  }

  // Certificates
  static getCertificates(): Certificate[] {
    return readJson(FILES.CERTIFICATES, INITIAL_CERTIFICATES);
  }

  static saveCertificates(data: Certificate[]) {
    writeJson(FILES.CERTIFICATES, data);
  }

  // Referrals
  static getReferrals(): Referral[] {
    return readJson(FILES.REFERRALS, INITIAL_REFERRALS);
  }

  static saveReferrals(data: Referral[]) {
    writeJson(FILES.REFERRALS, data);
  }

  // Audit Logs
  static getAuditLogs(): AuditLog[] {
    return readJson(FILES.AUDIT_LOGS, INITIAL_AUDIT_LOGS);
  }

  static addAuditLog(log: Omit<AuditLog, 'id' | 'timestamp'>) {
    const logs = this.getAuditLogs();
    const newLog: AuditLog = {
      id: `AUD-${Date.now().toString().slice(-6)}`,
      timestamp: new Date().toISOString(),
      ...log
    };
    logs.unshift(newLog);
    writeJson(FILES.AUDIT_LOGS, logs);
    return newLog;
  }

  // Communications & Broadcasts
  static getCommunications(): CommunicationLog[] {
    return readJson(FILES.COMMUNICATIONS, INITIAL_COMMUNICATIONS);
  }

  static logCommunication(comm: Omit<CommunicationLog, 'id' | 'sentAt'>) {
    const comms = this.getCommunications();
    const newComm: CommunicationLog = {
      id: `comm-${Date.now().toString().slice(-6)}`,
      sentAt: new Date().toISOString(),
      ...comm
    };
    comms.unshift(newComm);
    writeJson(FILES.COMMUNICATIONS, comms);
    return newComm;
  }

  static getBroadcasts(): BroadcastMessage[] {
    return readJson(FILES.BROADCASTS, INITIAL_BROADCASTS);
  }

  static logBroadcast(broadcast: Omit<BroadcastMessage, 'id' | 'sentAt'>) {
    const broadcasts = this.getBroadcasts();
    const newBroadcast: BroadcastMessage = {
      id: `bc-${Date.now().toString().slice(-6)}`,
      sentAt: new Date().toISOString(),
      status: 'SENT',
      ...broadcast
    };
    broadcasts.unshift(newBroadcast);
    writeJson(FILES.BROADCASTS, broadcasts);
    return newBroadcast;
  }

  // Student Projects
  static getStudentProjects(studentIdOrEnrollment?: string) {
    const projects = readJson(FILES.PROJECTS, INITIAL_PROJECTS);
    if (!studentIdOrEnrollment) return projects;
    const query = studentIdOrEnrollment.trim().toLowerCase();
    return projects.filter(
      (p: any) =>
        (p.studentId && p.studentId.toLowerCase() === query) ||
        (p.enrollmentId && p.enrollmentId.toLowerCase() === query)
    );
  }

  static saveStudentProjects(data: any[]) {
    writeJson(FILES.PROJECTS, data);
  }

  static addStudentProject(project: any) {
    const projects = readJson(FILES.PROJECTS, INITIAL_PROJECTS);
    const newProject = {
      id: `PRJ-2026-${Date.now().toString().slice(-4)}`,
      submittedAt: new Date().toISOString(),
      status: 'UNDER_REVIEW',
      ...project
    };
    projects.unshift(newProject);
    writeJson(FILES.PROJECTS, projects);
    return newProject;
  }

  // Sessions
  static getSessions(): Record<string, { admin: AdminUser; expiresAt: string }> {
    return readJson(FILES.SESSIONS, {});
  }

  static createSession(admin: AdminUser): string {
    const sessions = this.getSessions();
    const token = `ci_adm_${crypto.randomBytes(24).toString('hex')}`;
    const expiresAt = new Date(Date.now() + 8 * 3600 * 1000).toISOString(); // 8 hours
    sessions[token] = { admin, expiresAt };
    writeJson(FILES.SESSIONS, sessions);
    return token;
  }

  static validateSession(token: string): AdminUser | null {
    if (!token) return null;
    const sessions = this.getSessions();
    const sess = sessions[token];
    if (!sess) return null;
    if (new Date(sess.expiresAt).getTime() < Date.now()) {
      delete sessions[token];
      writeJson(FILES.SESSIONS, sessions);
      return null;
    }
    return sess.admin;
  }

  static removeSession(token: string) {
    const sessions = this.getSessions();
    delete sessions[token];
    writeJson(FILES.SESSIONS, sessions);
  }

  // Idempotency Tracking for Webhooks & Payments
  static isEventProcessed(eventId: string): boolean {
    const processed = readJson<string[]>(FILES.IDEMPOTENCY, []);
    return processed.includes(eventId);
  }

  static markEventProcessed(eventId: string) {
    const processed = readJson<string[]>(FILES.IDEMPOTENCY, []);
    if (!processed.includes(eventId)) {
      processed.push(eventId);
      writeJson(FILES.IDEMPOTENCY, processed);
    }
  }

  // Generate Unique Sequential Enrollment ID: CI-2026-000001
  static generateNextEnrollmentId(isTest = false): string {
    const students = this.getStudents();
    const prefix = isTest ? 'CI-TEST-' : 'CI-2026-';
    const existingNumbers = students
      .map(s => s.enrollmentId)
      .filter((id): id is string => Boolean(id && id.startsWith(prefix)))
      .map(id => {
        const numPart = id.replace(prefix, '');
        return parseInt(numPart, 10);
      })
      .filter(n => !isNaN(n));

    const maxNum = existingNumbers.length > 0 ? Math.max(...existingNumbers) : 0;
    const nextNum = maxNum + 1;
    return `${prefix}${nextNum.toString().padStart(6, '0')}`;
  }

  // Core Business Rule: Convert Verified Payment into Paid Student Record
  static processPaidEnrollment(params: {
    orderId: string;
    paymentId: string;
    amountInRupees: number;
    planName: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    paymentMethod?: string;
    isTest?: boolean;
    signature?: string;
    utmSource?: string;
    utmMedium?: string;
    utmCampaign?: string;
  }) {
    const {
      orderId,
      paymentId,
      amountInRupees,
      planName,
      customerName,
      customerEmail,
      customerPhone,
      paymentMethod = 'UPI / Card',
      isTest = false,
      signature = '',
      utmSource,
      utmMedium,
      utmCampaign
    } = params;

    const cleanEmail = customerEmail.trim().toLowerCase();
    const cleanPhone = customerPhone.trim().replace(/\D/g, '');

    // Idempotency: Check if this paymentId was already handled
    const payments = this.getPayments();
    const existingPayment = payments.find(p => p.id === paymentId);

    if (existingPayment && existingPayment.status === 'PAID') {
      return {
        alreadyProcessed: true,
        payment: existingPayment,
        student: this.getStudents().find(s => s.paymentId === paymentId || s.email.toLowerCase() === cleanEmail)
      };
    }

    // 1. Generate unique Enrollment ID
    const enrollmentId = this.generateNextEnrollmentId(isTest);
    const nowIso = new Date().toISOString();

    // 2. Create or Update Payment record
    const newPayment: AdminPaymentRecord = {
      id: paymentId,
      orderId,
      signature,
      studentName: customerName.trim(),
      studentEmail: cleanEmail,
      studentMobile: cleanPhone,
      courseId: amountInRupees >= 4000 ? 'crs-cohort-4w' : 'crs-workshop-2d',
      courseName: planName,
      amount: amountInRupees,
      currency: 'INR',
      status: 'PAID',
      paymentMethod,
      gateway: isTest ? 'Razorpay (Test Mode)' : 'Razorpay',
      isTest,
      verifiedAt: nowIso,
      createdAt: nowIso,
      lifecycle: [
        { stage: 'ORDER_CREATED', timestamp: nowIso, details: `Order created for ₹${amountInRupees}`, status: 'SUCCESS' },
        { stage: 'PAYMENT_CAPTURED', timestamp: nowIso, details: `Captured via ${paymentMethod}`, status: 'SUCCESS' },
        { stage: 'SIGNATURE_VERIFIED', timestamp: nowIso, details: 'Server HMAC-SHA256 verified successfully', status: 'SUCCESS' },
        { stage: 'ENROLLMENT_GENERATED', timestamp: nowIso, details: `Assigned Enrollment ID: ${enrollmentId}`, status: 'SUCCESS' }
      ]
    };

    const existingPayIdx = payments.findIndex(p => p.id === paymentId || p.orderId === orderId);
    if (existingPayIdx >= 0) {
      payments[existingPayIdx] = { ...payments[existingPayIdx], ...newPayment };
    } else {
      payments.unshift(newPayment);
    }
    this.savePayments(payments);

    // 3. Upsert Student Record (authoritative PAID enrollment)
    const students = this.getStudents();
    const existingStudentIdx = students.findIndex(s => s.email.toLowerCase() === cleanEmail);

    let savedStudent: Student;

    if (existingStudentIdx >= 0) {
      // Update existing lead or student
      const existing = students[existingStudentIdx];
      students[existingStudentIdx] = {
        ...existing,
        enrollmentId: existing.enrollmentId || enrollmentId,
        fullName: customerName.trim() || existing.fullName,
        mobile: cleanPhone || existing.mobile,
        courseName: planName,
        paymentStatus: 'PAID',
        paymentAmount: amountInRupees,
        paymentDate: nowIso,
        paymentMethod,
        orderId,
        paymentId,
        enrollmentStatus: 'ACTIVE',
        isTest,
        updatedAt: nowIso,
        activityTimeline: [
          {
            id: `act-${Date.now()}`,
            type: 'PAYMENT',
            title: 'Payment Confirmed & Verified',
            description: `Payment ID: ${paymentId} verified. Upgraded to Active Paid Student.`,
            timestamp: nowIso
          },
          ...(existing.activityTimeline || [])
        ]
      };
      savedStudent = students[existingStudentIdx];
    } else {
      // Create new student
      savedStudent = {
        id: `STU-2026-${Math.floor(100000 + Math.random() * 900000)}`,
        enrollmentId,
        fullName: customerName.trim(),
        email: cleanEmail,
        mobile: cleanPhone,
        city: 'Online Cohort',
        state: 'India',
        country: 'India',
        registrationDate: nowIso,
        courseId: amountInRupees >= 4000 ? 'crs-cohort-4w' : 'crs-workshop-2d',
        courseName: planName,
        paymentStatus: 'PAID',
        paymentAmount: amountInRupees,
        paymentDate: nowIso,
        paymentMethod,
        orderId,
        paymentId,
        enrollmentStatus: 'ACTIVE',
        courseProgress: 0,
        modulesCompleted: 0,
        totalModules: 4,
        source: utmSource ? `Campaign (${utmSource})` : 'Website Direct',
        utmSource,
        utmMedium,
        utmCampaign,
        referralCode: `CI-${customerName.trim().split(' ')[0].toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`,
        certificateStatus: 'NONE',
        isTest,
        notes: [],
        activityTimeline: [
          {
            id: `act-reg-${Date.now()}`,
            type: 'REGISTRATION',
            title: 'Registered on CodeInIndia Platform',
            description: 'Customer initiated enrollment.',
            timestamp: nowIso
          },
          {
            id: `act-pay-${Date.now()}`,
            type: 'PAYMENT',
            title: 'Payment Verified (Razorpay HMAC-SHA256)',
            description: `Captured ₹${amountInRupees.toLocaleString('en-IN')} via ${paymentMethod}.`,
            timestamp: nowIso
          },
          {
            id: `act-enr-${Date.now()}`,
            type: 'ENROLLMENT',
            title: 'Enrollment ID Activated',
            description: `Assigned unique Enrollment ID: ${enrollmentId}`,
            timestamp: nowIso
          }
        ],
        createdAt: nowIso,
        updatedAt: nowIso
      };
      students.unshift(savedStudent);
    }
    this.saveStudents(students);

    // 4. Mark Lead as Converted (if exists in leads collection)
    const leads = this.getLeads();
    const leadIdx = leads.findIndex(l => l.email.toLowerCase() === cleanEmail);
    if (leadIdx >= 0) {
      leads[leadIdx].paymentStatus = 'PAID';
      leads[leadIdx].followUpStatus = 'CONVERTED';
      leads[leadIdx].convertedToStudentId = savedStudent.id;
      leads[leadIdx].updatedAt = nowIso;
      this.saveLeads(leads);
    }

    // 5. Create Audit Log
    this.addAuditLog({
      adminName: 'SYSTEM (Payment Verification Engine)',
      adminEmail: 'webhook@codeinindia.in',
      adminRole: 'SUPER_ADMIN',
      action: 'PAYMENT_VERIFIED_AND_ENROLLED',
      targetType: 'STUDENT',
      targetId: savedStudent.id,
      targetName: savedStudent.fullName,
      previousValue: 'UNPAID / LEAD',
      newValue: `PAID (Enrollment: ${enrollmentId}, Amount: ₹${amountInRupees})`,
      ipAddress: 'SERVER_GATEWAY'
    });

    // 6. Log Communication Trigger
    this.logCommunication({
      recipientType: 'STUDENT',
      recipientEmail: cleanEmail,
      recipientPhone: cleanPhone,
      channel: 'WHATSAPP',
      templateId: 'tpl_welcome_paid_cohort',
      subject: `CodeInIndia Enrollment Confirmed: ${enrollmentId}`,
      status: 'DELIVERED',
      adminName: 'AUTOMATION_ENGINE'
    });

    return {
      alreadyProcessed: false,
      payment: newPayment,
      student: savedStudent
    };
  }
}
