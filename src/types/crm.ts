// ==============================================================================
// CodeInIndia CRM & Relational Data Models
// ==============================================================================

export type StudentStatus = 'active' | 'suspended' | 'graduated' | 'inactive';
export type CourseType = 'masterclass' | 'workshop' | 'cohort' | 'bootcamp';
export type EnrollmentStatus = 'registered' | 'payment_pending' | 'paid' | 'active' | 'cancelled' | 'completed' | 'refunded';
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded' | 'free';
export type AttendanceStatus = 'registered' | 'attended' | 'absent' | 'unknown';
export type WhatsAppJoinedStatus = 'unknown' | 'joined' | 'left' | 'unverified';
export type CertificateStatus = 'pending' | 'eligible' | 'issued' | 'revoked';

// Normalized Student Entity
export interface DbStudent {
  id: string; // UUID
  student_id: string; // CI-2026-000001
  first_name: string;
  last_name: string;
  email: string;
  mobile: string;
  email_normalized: string;
  mobile_normalized: string;
  city?: string;
  state?: string;
  country?: string;
  college?: string;
  course_background?: string;
  terms_accepted: boolean;
  privacy_policy_accepted: boolean;
  email_marketing_consent: boolean;
  whatsapp_marketing_consent: boolean;
  consent_timestamp?: string;
  status: StudentStatus;
  last_login_at?: string;
  created_at: string;
  updated_at: string;
}

// Course Catalog Entity
export interface DbCourse {
  id: string;
  course_code: string; // MASTERCLASS, WEB-999, APP-999, COHORT-4W
  course_name: string;
  course_type: CourseType;
  description: string;
  duration: string;
  price: number;
  launch_price?: number;
  currency: string;
  status: 'active' | 'upcoming' | 'archived';
  max_capacity?: number;
  recording_url?: string;
  whatsapp_group_url?: string;
  created_at: string;
  updated_at: string;
}

// Enrollment (One Student -> Many Course Enrollments)
export interface DbEnrollment {
  id: string;
  student_id: string;
  course_id: string;
  enrollment_status: EnrollmentStatus;
  payment_status: PaymentStatus;
  amount_paid: number;
  currency: string;
  enrollment_date: string;
  course_start_date?: string;
  course_end_date?: string;
  payment_id?: string;
  razorpay_order_id?: string;
  razorpay_payment_id?: string;
  razorpay_payment_link_id?: string;
  created_at: string;
  updated_at: string;
  // Joined Course data (optional)
  course?: DbCourse;
}

// Payment Transaction Ledger
export interface DbPayment {
  id: string;
  student_id: string;
  enrollment_id?: string;
  provider: 'razorpay' | 'manual' | 'free';
  provider_order_id?: string;
  provider_payment_id: string;
  provider_payment_link_id?: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  payment_method: string;
  payment_date?: string;
  failure_reason?: string;
  signature?: string;
  is_test: boolean;
  created_at: string;
  updated_at: string;
  // Joined data (optional)
  student_name?: string;
  student_email?: string;
  course_name?: string;
}

// Masterclass Entity
export interface DbMasterclass {
  id: string;
  title: string;
  description: string;
  date: string;
  start_time: string;
  end_time: string;
  trainer: string;
  meeting_link: string;
  recording_link?: string;
  whatsapp_group_link?: string;
  status: 'upcoming' | 'live' | 'completed' | 'cancelled';
  created_at: string;
}

// Masterclass Registration & Attendance
export interface DbMasterclassRegistration {
  id: string;
  student_id: string;
  masterclass_id: string;
  registration_status: string;
  registered_at: string;
  attendance_status: AttendanceStatus;
  attended_at?: string;
  created_at: string;
  masterclass?: DbMasterclass;
}

// WhatsApp Channel Opt-In & Engagement Tracking
export interface DbWhatsApp {
  id: string;
  student_id: string;
  whatsapp_opt_in: boolean;
  whatsapp_channel_url: string;
  whatsapp_cta_shown: boolean;
  whatsapp_cta_shown_at?: string;
  whatsapp_cta_clicked: boolean;
  whatsapp_cta_clicked_at?: string;
  whatsapp_invite_sent: boolean;
  whatsapp_invite_sent_at?: string;
  whatsapp_joined: WhatsAppJoinedStatus;
  whatsapp_joined_at?: string;
  whatsapp_group_name?: string;
  whatsapp_group_id?: string;
  invitation_clicks: number;
  last_clicked_at?: string;
  created_at: string;
  updated_at: string;
}

// Feedback & Student Reviews
export interface DbFeedback {
  id: string;
  student_id: string;
  masterclass_id?: string;
  enrollment_id?: string;
  rating: number; // 1-5
  original_feedback: string;
  ai_generated_review?: string;
  final_approved_review?: string;
  review_consent: boolean;
  public_display_approved: boolean;
  created_at: string;
  updated_at: string;
  student?: {
    first_name: string;
    last_name: string;
    city?: string;
    college?: string;
  };
}

// Certificate
export interface DbCertificate {
  id: string;
  student_id: string;
  course_id: string;
  certificate_number: string;
  certificate_status: CertificateStatus;
  issued_at?: string;
  certificate_url?: string;
  skills: string[];
  created_at: string;
  student?: {
    first_name: string;
    last_name: string;
    email: string;
    student_id: string;
  };
  course?: {
    course_name: string;
    course_code: string;
  };
}

// Marketing Attribution
export interface DbMarketingAttribution {
  id: string;
  student_id: string;
  source: string;
  medium?: string;
  campaign?: string;
  term?: string;
  content?: string;
  referral_code?: string;
  landing_page?: string;
  first_touch_source?: string;
  last_touch_source?: string;
  created_at: string;
}

// Course Progress
export interface DbCourseProgress {
  id: string;
  student_id: string;
  course_id: string;
  enrollment_id: string;
  progress_percentage: number;
  lessons_completed: number;
  projects_completed: number;
  last_activity_at: string;
  completion_status: 'not_started' | 'in_progress' | 'completed';
  created_at: string;
  updated_at: string;
}

// Audit Log
export interface DbAuditLog {
  id: string;
  admin_id?: string;
  admin_name?: string;
  admin_email?: string;
  admin_role?: string;
  action: string;
  entity_type: string;
  entity_id?: string;
  old_value?: string;
  new_value?: string;
  ip_address?: string;
  created_at: string;
}

// Comprehensive 360° Student Full Record
export interface StudentFullProfile {
  student: DbStudent;
  enrollments: (DbEnrollment & { course: DbCourse; progress?: DbCourseProgress })[];
  payments: DbPayment[];
  masterclassRegistrations: (DbMasterclassRegistration & { masterclass: DbMasterclass })[];
  whatsapp?: DbWhatsApp;
  feedback?: DbFeedback[];
  certificates: (DbCertificate & { course?: DbCourse })[];
  attribution?: DbMarketingAttribution;
  activityTimeline: Array<{
    id: string;
    type: 'REGISTRATION' | 'ENROLLMENT' | 'PAYMENT' | 'WHATSAPP' | 'MASTERCLASS' | 'ATTENDANCE' | 'FEEDBACK' | 'CERTIFICATE' | 'NOTE';
    title: string;
    description: string;
    timestamp: string;
    meta?: any;
  }>;
}

// Registration Form DTO
export interface StudentRegistrationDto {
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  courseCode: 'MASTERCLASS' | 'WEB-999' | 'APP-999' | 'COHORT-4W';
  city?: string;
  state?: string;
  college?: string;
  courseBackground?: string;
  termsAccepted: boolean;
  privacyPolicyAccepted: boolean;
  whatsappOptIn: boolean;
  emailMarketingOptIn: boolean;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmTerm?: string;
  utmContent?: string;
  referralCode?: string;
}

// CRM KPI Summary Metrics
export interface CrmOverviewMetrics {
  totalStudents: number;
  newStudentsToday: number;
  newStudentsThisWeek: number;
  paidStudents: number;
  totalRevenue: number;
  course999Revenue: number;
  websiteWorkshopEnrollments: number;
  androidCohortEnrollments: number;
  cohort4wEnrollments: number;
  masterclassRegistrations: number;
  masterclassAttended: number;
  masterclassAttendanceRate: number;
  whatsappOptInCount: number;
  whatsappOptInRate: number;
  averageFeedbackRating: number;
  feedbackSubmissionsCount: number;
  conversionFunnel: {
    landingViews: number;
    masterclassRegistrations: number;
    masterclassAttended: number;
    whatsappJoined: number;
    paidOfferClicked: number;
    paidOrdersCreated: number;
    paidVerifiedSuccess: number;
  };
}
