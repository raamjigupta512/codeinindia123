-- ==============================================================================
-- CodeInIndia Production PostgreSQL / Supabase Relational Database Schema
-- Normalized schema for 100,000+ Students, Multi-Course Enrollments, Payments & CRM
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. STUDENTS TABLE
CREATE TABLE IF NOT EXISTS students (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id VARCHAR(32) UNIQUE NOT NULL, -- CI-2026-000001
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    mobile VARCHAR(20) NOT NULL,
    email_normalized VARCHAR(255) NOT NULL,
    mobile_normalized VARCHAR(20) NOT NULL,
    city VARCHAR(100),
    state VARCHAR(100),
    country VARCHAR(100) DEFAULT 'India',
    college VARCHAR(255),
    course_background VARCHAR(255),
    terms_accepted BOOLEAN DEFAULT TRUE,
    privacy_policy_accepted BOOLEAN DEFAULT TRUE,
    email_marketing_consent BOOLEAN DEFAULT TRUE,
    whatsapp_marketing_consent BOOLEAN DEFAULT TRUE,
    consent_timestamp TIMESTAMPTZ DEFAULT NOW(),
    status VARCHAR(30) DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'graduated', 'inactive')),
    last_login_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Unique indexes on normalized contact info for duplicate prevention
CREATE UNIQUE INDEX IF NOT EXISTS idx_students_email_norm ON students(email_normalized);
CREATE UNIQUE INDEX IF NOT EXISTS idx_students_mobile_norm ON students(mobile_normalized);
CREATE INDEX IF NOT EXISTS idx_students_student_id ON students(student_id);
CREATE INDEX IF NOT EXISTS idx_students_created_at ON students(created_at DESC);

-- 2. COURSES CATALOG TABLE (Database-Driven)
CREATE TABLE IF NOT EXISTS courses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_code VARCHAR(50) UNIQUE NOT NULL, -- MASTERCLASS, WEB-999, APP-999, COHORT-4W
    course_name VARCHAR(255) NOT NULL,
    course_type VARCHAR(50) NOT NULL CHECK (course_type IN ('masterclass', 'workshop', 'cohort', 'bootcamp')),
    description TEXT,
    duration VARCHAR(100) NOT NULL,
    price NUMERIC(10,2) NOT NULL DEFAULT 0,
    launch_price NUMERIC(10,2),
    currency VARCHAR(10) DEFAULT 'INR',
    status VARCHAR(30) DEFAULT 'active' CHECK (status IN ('active', 'upcoming', 'archived')),
    max_capacity INT DEFAULT 500,
    recording_url TEXT,
    whatsapp_group_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_courses_code ON courses(course_code);
CREATE INDEX IF NOT EXISTS idx_courses_status ON courses(status);

-- 3. ENROLLMENTS TABLE (One Student -> Many Course Enrollments)
CREATE TABLE IF NOT EXISTS enrollments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    course_id UUID NOT NULL REFERENCES courses(id) ON DELETE RESTRICT,
    enrollment_status VARCHAR(30) NOT NULL DEFAULT 'registered' 
        CHECK (enrollment_status IN ('registered', 'payment_pending', 'paid', 'active', 'cancelled', 'completed', 'refunded')),
    payment_status VARCHAR(30) NOT NULL DEFAULT 'pending' 
        CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded', 'free')),
    amount_paid NUMERIC(10,2) DEFAULT 0,
    currency VARCHAR(10) DEFAULT 'INR',
    enrollment_date TIMESTAMPTZ DEFAULT NOW(),
    course_start_date TIMESTAMPTZ,
    course_end_date TIMESTAMPTZ,
    payment_id VARCHAR(100),
    razorpay_order_id VARCHAR(100),
    razorpay_payment_id VARCHAR(100),
    razorpay_payment_link_id VARCHAR(100),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(student_id, course_id)
);

CREATE INDEX IF NOT EXISTS idx_enrollments_student_id ON enrollments(student_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_course_id ON enrollments(course_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_status ON enrollments(enrollment_status);
CREATE INDEX IF NOT EXISTS idx_enrollments_payment_status ON enrollments(payment_status);

-- 4. PAYMENTS TRANSACTIONS LEDGER TABLE
CREATE TABLE IF NOT EXISTS payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    enrollment_id UUID REFERENCES enrollments(id) ON DELETE SET NULL,
    provider VARCHAR(50) DEFAULT 'razorpay',
    provider_order_id VARCHAR(100),
    provider_payment_id VARCHAR(100) UNIQUE,
    provider_payment_link_id VARCHAR(100),
    amount NUMERIC(10,2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'INR',
    status VARCHAR(30) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'failed', 'refunded')),
    payment_method VARCHAR(100) DEFAULT 'UPI / Card',
    payment_date TIMESTAMPTZ,
    failure_reason TEXT,
    signature VARCHAR(255),
    is_test BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_payments_student_id ON payments(student_id);
CREATE INDEX IF NOT EXISTS idx_payments_provider_payment_id ON payments(provider_payment_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);
CREATE INDEX IF NOT EXISTS idx_payments_created_at ON payments(created_at DESC);

-- 5. MASTERCLASSES TABLE
CREATE TABLE IF NOT EXISTS masterclasses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    date DATE NOT NULL,
    start_time VARCHAR(50) NOT NULL,
    end_time VARCHAR(50) NOT NULL,
    trainer VARCHAR(100) DEFAULT 'Harsh Vardhan',
    meeting_link TEXT,
    recording_link TEXT,
    whatsapp_group_link TEXT,
    status VARCHAR(30) DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'live', 'completed', 'cancelled')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. MASTERCLASS REGISTRATIONS & ATTENDANCE TABLE
CREATE TABLE IF NOT EXISTS masterclass_registrations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    masterclass_id UUID NOT NULL REFERENCES masterclasses(id) ON DELETE CASCADE,
    registration_status VARCHAR(30) DEFAULT 'registered',
    registered_at TIMESTAMPTZ DEFAULT NOW(),
    attendance_status VARCHAR(30) DEFAULT 'registered' CHECK (attendance_status IN ('registered', 'attended', 'absent', 'unknown')),
    attended_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(student_id, masterclass_id)
);

CREATE INDEX IF NOT EXISTS idx_mc_reg_student ON masterclass_registrations(student_id);
CREATE INDEX IF NOT EXISTS idx_mc_reg_class ON masterclass_registrations(masterclass_id);
CREATE INDEX IF NOT EXISTS idx_mc_reg_attendance ON masterclass_registrations(attendance_status);

-- 7. WHATSAPP CHANNEL ENGAGEMENT TABLE
CREATE TABLE IF NOT EXISTS whatsapp (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    whatsapp_opt_in BOOLEAN DEFAULT TRUE,
    whatsapp_channel_url VARCHAR(255) DEFAULT 'https://whatsapp.com/channel/0029VbDYRr50gcfQYB4x650C',
    whatsapp_cta_shown BOOLEAN DEFAULT FALSE,
    whatsapp_cta_shown_at TIMESTAMPTZ,
    whatsapp_cta_clicked BOOLEAN DEFAULT FALSE,
    whatsapp_cta_clicked_at TIMESTAMPTZ,
    whatsapp_invite_sent BOOLEAN DEFAULT TRUE,
    whatsapp_invite_sent_at TIMESTAMPTZ DEFAULT NOW(),
    whatsapp_joined VARCHAR(30) DEFAULT 'unknown' CHECK (whatsapp_joined IN ('unknown', 'joined', 'left', 'unverified')),
    whatsapp_joined_at TIMESTAMPTZ,
    whatsapp_group_name VARCHAR(150),
    whatsapp_group_id VARCHAR(100),
    invitation_clicks INT DEFAULT 0,
    last_clicked_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(student_id)
);

CREATE INDEX IF NOT EXISTS idx_whatsapp_student ON whatsapp(student_id);
CREATE INDEX IF NOT EXISTS idx_whatsapp_cta_clicked ON whatsapp(whatsapp_cta_clicked);
CREATE INDEX IF NOT EXISTS idx_whatsapp_status ON whatsapp(whatsapp_joined);

-- 8. FEEDBACK & REVIEWS TABLE
CREATE TABLE IF NOT EXISTS feedback (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    masterclass_id UUID REFERENCES masterclasses(id) ON DELETE SET NULL,
    enrollment_id UUID REFERENCES enrollments(id) ON DELETE SET NULL,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    original_feedback TEXT NOT NULL,
    ai_generated_review TEXT,
    final_approved_review TEXT,
    review_consent BOOLEAN DEFAULT FALSE,
    public_display_approved BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_feedback_student ON feedback(student_id);
CREATE INDEX IF NOT EXISTS idx_feedback_rating ON feedback(rating);

-- 9. CERTIFICATES TABLE
CREATE TABLE IF NOT EXISTS certificates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    course_id UUID NOT NULL REFERENCES courses(id) ON DELETE RESTRICT,
    certificate_number VARCHAR(100) UNIQUE NOT NULL, -- CERT-CI-2026-0001
    certificate_status VARCHAR(30) DEFAULT 'pending' CHECK (certificate_status IN ('pending', 'eligible', 'issued', 'revoked')),
    issued_at TIMESTAMPTZ,
    certificate_url TEXT,
    skills TEXT[] DEFAULT ARRAY['Full-Stack Engineering', 'Next.js', 'React', 'Node.js', 'AI Assisted Software Building'],
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_cert_student ON certificates(student_id);
CREATE INDEX IF NOT EXISTS idx_cert_number ON certificates(certificate_number);

-- 10. MARKETING ATTRIBUTION TABLE
CREATE TABLE IF NOT EXISTS marketing_attribution (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    source VARCHAR(100) DEFAULT 'direct', -- google, instagram, youtube, facebook, whatsapp, referral, organic, direct
    medium VARCHAR(100),
    campaign VARCHAR(150),
    term VARCHAR(150),
    content VARCHAR(150),
    referral_code VARCHAR(100),
    landing_page TEXT,
    first_touch_source VARCHAR(100),
    last_touch_source VARCHAR(100),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_mktg_student ON marketing_attribution(student_id);
CREATE INDEX IF NOT EXISTS idx_mktg_source ON marketing_attribution(source);
CREATE INDEX IF NOT EXISTS idx_mktg_campaign ON marketing_attribution(campaign);

-- 11. COURSE PROGRESS (LMS) TABLE
CREATE TABLE IF NOT EXISTS course_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    course_id UUID NOT NULL REFERENCES courses(id) ON DELETE RESTRICT,
    enrollment_id UUID NOT NULL REFERENCES enrollments(id) ON DELETE CASCADE,
    progress_percentage NUMERIC(5,2) DEFAULT 0,
    lessons_completed INT DEFAULT 0,
    projects_completed INT DEFAULT 0,
    last_activity_at TIMESTAMPTZ DEFAULT NOW(),
    completion_status VARCHAR(30) DEFAULT 'in_progress' CHECK (completion_status IN ('not_started', 'in_progress', 'completed')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(student_id, course_id)
);

CREATE INDEX IF NOT EXISTS idx_progress_student ON course_progress(student_id);
CREATE INDEX IF NOT EXISTS idx_progress_course ON course_progress(course_id);

-- 12. AUDIT LOGS TABLE
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    admin_id VARCHAR(100),
    admin_name VARCHAR(150),
    admin_email VARCHAR(150),
    admin_role VARCHAR(50),
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50) NOT NULL,
    entity_id VARCHAR(100),
    old_value TEXT,
    new_value TEXT,
    ip_address VARCHAR(50),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_audit_entity ON audit_logs(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_audit_created ON audit_logs(created_at DESC);

-- 13. SYSTEM SETTINGS TABLE
CREATE TABLE IF NOT EXISTS system_settings (
    key VARCHAR(100) PRIMARY KEY,
    value JSONB NOT NULL,
    description TEXT,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- INITIAL SEED COURSES
-- ==============================================================================
INSERT INTO courses (course_code, course_name, course_type, description, duration, price, launch_price, status, recording_url, whatsapp_group_url)
VALUES
    (
        'MASTERCLASS',
        'Free Live AI Coding & App Building Masterclass',
        'masterclass',
        'Learn to build and ship modern software with AI pair-programming without traditional syntax memorization.',
        '2 Hours Live',
        0,
        0,
        'active',
        'https://codeinindia.in/recordings/masterclass',
        'https://chat.whatsapp.com/codeinindia-masterclass'
    ),
    (
        'WEB-999',
        '1-Day Dynamic Website Workshop',
        'workshop',
        'Build and deploy dynamic websites with AI during one intensive full day. Includes custom domains, CMS and forms.',
        '1 Full Day (Saturday 10 AM - 6 PM)',
        999,
        999,
        'active',
        'https://codeinindia.in/recordings/web-999',
        'https://chat.whatsapp.com/codeinindia-web999'
    ),
    (
        'APP-999',
        '2-Weekend Android App Cohort',
        'cohort',
        'Build real Android applications with AI across two weekends. Idea to working APK on your phone.',
        '2 Weekends (4 Live Sessions)',
        999,
        999,
        'active',
        'https://codeinindia.in/recordings/app-999',
        'https://chat.whatsapp.com/codeinindia-app999'
    ),
    (
        'COHORT-4W',
        'Full-Stack 4-Week Live Cohort (Hindi + English)',
        'cohort',
        'Master Next.js 15, PostgreSQL, Razorpay Micro-SaaS billing & Flutter Mobile apps with live mentor code reviews.',
        '4 Weeks (Weekends Live)',
        9999,
        4999,
        'active',
        'https://codeinindia.in/recordings/cohort-4w',
        'https://chat.whatsapp.com/codeinindia-cohort'
    )
ON CONFLICT (course_code) DO UPDATE 
SET course_name = EXCLUDED.course_name,
    price = EXCLUDED.price,
    description = EXCLUDED.description,
    duration = EXCLUDED.duration;

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_progress ENABLE ROW LEVEL SECURITY;

-- Anonymous public can read courses
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view active courses" ON courses FOR SELECT USING (status = 'active');

-- Service role / authenticated admin has full access
CREATE POLICY "Admin full access students" ON students USING (auth.role() = 'service_role');
CREATE POLICY "Admin full access enrollments" ON enrollments USING (auth.role() = 'service_role');
CREATE POLICY "Admin full access payments" ON payments USING (auth.role() = 'service_role');
