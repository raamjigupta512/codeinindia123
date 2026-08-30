export type AdminRole = 'SUPER_ADMIN' | 'ADMIN' | 'SUPPORT' | 'OPERATIONS';

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
  avatar?: string;
  status: 'ACTIVE' | 'SUSPENDED';
  createdAt: string;
  lastLoginAt: string;
}

export type PaymentStatus = 
  | 'NOT_STARTED' 
  | 'PENDING' 
  | 'PAID' 
  | 'FAILED' 
  | 'REFUNDED' 
  | 'PARTIALLY_REFUNDED';

export type EnrollmentStatus = 
  | 'LEAD' 
  | 'REGISTERED' 
  | 'PAID' 
  | 'ACTIVE' 
  | 'COMPLETED' 
  | 'DROPPED' 
  | 'REFUNDED';

export type FollowUpStatus = 
  | 'NEW' 
  | 'CONTACTED' 
  | 'WORKSHOP_REGISTERED' 
  | 'WORKSHOP_ATTENDED' 
  | 'OFFER_PRESENTED' 
  | 'PAYMENT_PENDING' 
  | 'CONVERTED' 
  | 'NOT_INTERESTED';

export interface StudentNote {
  id: string;
  adminName: string;
  adminRole: AdminRole;
  text: string;
  timestamp: string;
}

export interface ActivityTimelineItem {
  id: string;
  type: 'REGISTRATION' | 'PAYMENT' | 'ENROLLMENT' | 'LOGIN' | 'COURSE_ACCESS' | 'MODULE_COMPLETE' | 'CERTIFICATE' | 'SUPPORT_NOTE' | 'STATUS_CHANGE';
  title: string;
  description: string;
  timestamp: string;
  adminName?: string;
  metadata?: Record<string, any>;
}

export interface Student {
  id: string;
  enrollmentId?: string; // Generated CI-2026-XXXXXX ONLY upon verified payment!
  fullName: string;
  email: string;
  mobile: string;
  city: string;
  state: string;
  country: string;
  registrationDate: string;
  courseId: string;
  courseName: string;
  paymentStatus: PaymentStatus;
  paymentAmount: number; // in INR
  paymentDate?: string;
  paymentMethod?: string;
  orderId?: string;
  paymentId?: string;
  enrollmentStatus: EnrollmentStatus;
  courseProgress: number; // 0 - 100
  modulesCompleted: number;
  totalModules: number;
  lastLoginAt?: string;
  lastActivityAt?: string;
  source: string;
  campaign?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  referralCode?: string;
  certificateId?: string;
  certificateStatus?: 'NONE' | 'ELIGIBLE' | 'ISSUED' | 'REVOKED';
  certificateIssuedAt?: string;
  isTest?: boolean;
  notes: StudentNote[];
  activityTimeline: ActivityTimelineItem[];
  createdAt: string;
  updatedAt: string;
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  city?: string;
  state?: string;
  workshopId?: string;
  courseInterest: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  source: string;
  paymentStatus: PaymentStatus;
  followUpStatus: FollowUpStatus;
  notes: StudentNote[];
  createdAt: string;
  updatedAt: string;
  convertedToStudentId?: string;
}

export interface PaymentLifecycleEvent {
  stage: 'ORDER_CREATED' | 'CHECKOUT_OPENED' | 'PAYMENT_CAPTURED' | 'WEBHOOK_RECEIVED' | 'SIGNATURE_VERIFIED' | 'ENROLLMENT_GENERATED' | 'REFUND_PROCESSED';
  timestamp: string;
  details: string;
  status: 'SUCCESS' | 'FAILED' | 'PENDING';
}

export interface AdminPaymentRecord {
  id: string; // Razorpay payment ID or PAY-xxx
  orderId: string;
  signature?: string;
  studentId?: string;
  studentName: string;
  studentEmail: string;
  studentMobile: string;
  courseId: string;
  courseName: string;
  amount: number; // in INR
  currency: string;
  status: PaymentStatus;
  paymentMethod: string;
  gateway: string;
  isTest: boolean;
  verifiedAt?: string;
  createdAt: string;
  refundAmount?: number;
  refundedAt?: string;
  lifecycle: PaymentLifecycleEvent[];
  errorReason?: string;
}

export interface Workshop {
  id: string;
  title: string;
  date: string;
  time: string;
  host: string;
  meetingLink: string;
  registrationDeadline: string;
  maxSeats: number;
  status: 'DRAFT' | 'OPEN' | 'FULL' | 'LIVE' | 'COMPLETED' | 'CANCELLED';
  registrationsCount: number;
  attendedCount: number;
  paidConversionsCount: number;
  revenue: number;
}

export interface CourseModule {
  id: string;
  title: string;
  lessonsCount: number;
  durationHours: number;
}

export interface Course {
  id: string;
  name: string;
  description: string;
  regularPrice: number;
  launchPrice: number;
  duration: string;
  status: 'ACTIVE' | 'UPCOMING' | 'ARCHIVED';
  modulesCount: number;
  enrolledCount: number;
  completionRate: number;
  modules: CourseModule[];
}

export interface Certificate {
  id: string; // CERT-CI-2026-XXXX
  studentId: string;
  studentName: string;
  studentEmail: string;
  enrollmentId: string;
  courseId: string;
  courseName: string;
  issueDate: string;
  issuedAt?: string; // alias for issueDate
  status: 'ACTIVE' | 'REVOKED' | 'VALID';
  credentialUrl: string;
  verificationUrl?: string; // alias for credentialUrl
  skills: string[];
}

export interface Referral {
  id: string;
  code: string; // CI-RAHUL-4821
  studentId?: string;
  studentName?: string;
  studentEmail?: string;
  ownerName?: string;
  ownerEmail?: string;
  discountPercent?: number;
  commissionPercent?: number;
  usesCount?: number;
  clicks?: number;
  leads?: number;
  paidConversions?: number;
  revenueGenerated: number;
  commissionStatus?: 'PENDING_REVIEW' | 'APPROVED' | 'PAID';
}

export type ReferralCode = Referral;

export interface AuditLog {
  id: string;
  timestamp: string;
  adminName: string;
  adminEmail: string;
  adminRole: AdminRole;
  action: string;
  targetType: 'STUDENT' | 'PAYMENT' | 'COURSE' | 'WORKSHOP' | 'CERTIFICATE' | 'ADMIN_USER' | 'SETTINGS' | 'LEAD';
  targetId: string;
  targetName: string;
  previousValue?: string;
  newValue?: string;
  ipAddress?: string;
  details?: string;
  metadata?: Record<string, any>;
  severity?: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
}

export interface BroadcastMessage {
  id: string;
  title?: string;
  subject: string;
  body?: string;
  message?: string;
  recipientFilter?: 'ALL_STUDENTS' | 'PAID_STUDENTS' | 'UNPAID_LEADS' | 'WORKSHOP_ATTENDEES' | 'COURSE_BATCH';
  targetAudience?: string;
  channel: 'EMAIL' | 'WHATSAPP' | 'SMS';
  sentAt: string;
  status?: 'DRAFT' | 'QUEUED' | 'SENT' | 'FAILED';
  recipientCount: number;
  adminName?: string;
  createdBy?: string;
  createdAt?: string;
}

export interface CommunicationLog {
  id: string;
  recipientType: 'LEAD' | 'STUDENT' | 'BATCH';
  recipientEmail: string;
  recipientPhone?: string;
  channel: 'EMAIL' | 'WHATSAPP' | 'SMS';
  templateId: string;
  subject: string;
  status: 'SENT' | 'DELIVERED' | 'FAILED';
  sentAt: string;
  adminName: string;
}

export interface DashboardMetrics {
  totalRegistered: number;
  totalPaidStudents: number;
  totalUnpaidLeads: number;
  totalRevenue: number;
  todayRevenue: number;
  thisMonthRevenue: number;
  workshopRegistrations: number;
  courseCompletionRate: number;
  pendingPaymentsCount: number;
}
