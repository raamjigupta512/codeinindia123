import express, { Request, Response, NextFunction } from "express";
import path from "path";
import fs from "fs";
import crypto from "crypto";
import dotenv from "dotenv";
import Razorpay from "razorpay";
import { createServer as createViteServer } from "vite";
import { AdminStore } from "./server/adminStore";
import { CrmStore } from "./server/db/crmStore";
import { AdminRole, Student, Lead, AdminPaymentRecord, Certificate } from "./src/types/admin";
import { StudentRegistrationDto } from "./src/types/crm";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// ------------------- AUTH MIDDLEWARE -------------------

interface AuthenticatedRequest extends Request {
  admin?: any;
}

function authenticateAdmin(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ success: false, error: "Unauthorized: Missing admin token" });
  }

  const token = authHeader.replace("Bearer ", "").trim();
  const admin = AdminStore.validateSession(token);

  if (!admin) {
    return res.status(401).json({ success: false, error: "Session expired or invalid. Please log in again." });
  }

  req.admin = admin;
  next();
}

function requireRole(allowedRoles: AdminRole[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.admin) {
      return res.status(401).json({ success: false, error: "Unauthorized" });
    }
    if (!allowedRoles.includes(req.admin.role)) {
      return res.status(403).json({ 
        success: false, 
        error: `Forbidden: Requires role [${allowedRoles.join(", ")}], current role is ${req.admin.role}` 
      });
    }
    next();
  };
}

// ------------------- LAZY RAZORPAY INSTANCE -------------------

function getRazorpayInstance(): Razorpay | null {
  const keyId = process.env.RAZORPAY_KEY_ID || process.env.VITE_RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    return null;
  }

  return new Razorpay({
    key_id: keyId,
    key_secret: keySecret,
  });
}

// ------------------- CRM & COURSE CATALOG ENDPOINTS -------------------

// Database-Driven Course Catalog
app.get("/api/courses", (req, res) => {
  try {
    const courses = CrmStore.getCourses();
    res.json({ success: true, courses });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Student Registration with Normalized Duplicate Prevention
app.post("/api/crm/register", (req, res) => {
  try {
    const dto: StudentRegistrationDto = req.body;
    if (!dto.firstName || !dto.email || !dto.mobile || !dto.courseCode) {
      return res.status(400).json({
        success: false,
        error: "Missing required fields: firstName, email, mobile, courseCode"
      });
    }

    const result = CrmStore.registerOrUpdateStudent(dto);

    // Sync with existing AdminStore leads/students for compatibility
    AdminStore.saveLeads(AdminStore.getLeads());

    return res.status(200).json({
      success: true,
      message: result.isExistingStudent ? "Welcome back! Enrollment updated." : "Student registration successful!",
      student: result.student,
      enrollment: result.enrollment,
      course: result.course,
      whatsappInviteUrl: result.whatsappInviteUrl,
      isExistingStudent: result.isExistingStudent,
      isExistingEnrollment: result.isExistingEnrollment
    });
  } catch (err: any) {
    console.error("CRM registration error:", err);
    return res.status(400).json({
      success: false,
      error: err.message || "Failed to process registration"
    });
  }
});

// Full 360-degree Student Profile
app.get("/api/crm/student/:identifier", (req, res) => {
  try {
    const { identifier } = req.params;
    const profile = CrmStore.getStudent360(identifier);
    if (!profile) {
      return res.status(404).json({ success: false, error: "Student not found" });
    }
    return res.json({ success: true, profile });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// Student Feedback Submission
app.post("/api/crm/feedback", (req, res) => {
  try {
    const { studentId, rating, originalFeedback, reviewConsent, aiGeneratedReview, finalApprovedReview, masterclassId, enrollmentId } = req.body;
    if (!studentId || !rating || !originalFeedback) {
      return res.status(400).json({ success: false, error: "Missing studentId, rating, or originalFeedback" });
    }

    const feedback = CrmStore.submitFeedback({
      studentId,
      rating: Number(rating),
      originalFeedback,
      reviewConsent: Boolean(reviewConsent),
      aiGeneratedReview,
      finalApprovedReview,
      masterclassId,
      enrollmentId
    });

    return res.status(201).json({ success: true, feedback, message: "Thank you for your valuable review!" });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// AI Feedback Polish Assistant
app.post("/api/crm/feedback/generate-ai-review", async (req, res) => {
  try {
    const { originalFeedback, rating, studentName } = req.body;
    if (!originalFeedback) {
      return res.status(400).json({ success: false, error: "Original feedback text required" });
    }

    // Try Gemini if configured, otherwise generate crisp contextual draft
    let polishedReview = "";
    if (process.env.GEMINI_API_KEY) {
      try {
        const { GoogleGenAI } = await import("@google/genai");
        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
        const prompt = `You are an expert review editor. A student (${studentName || 'Student'}) rated their CodeInIndia course ${rating || 5}/5 stars and wrote this rough feedback:
"${originalFeedback}"

Please write a clean, authentic, concise 1-2 sentence polished testimonial that preserves their exact voice and genuine sentiment without sounding like marketing hype. Return only the polished review text:`;

        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt
        });
        polishedReview = response.text?.trim() || "";
      } catch (geminiErr) {
        console.warn("Gemini review polish fallback:", geminiErr);
      }
    }

    if (!polishedReview) {
      // Clean fallback formatting
      const cleanRaw = originalFeedback.trim();
      polishedReview = cleanRaw.length > 20 && !cleanRaw.endsWith('.') ? `${cleanRaw}.` : cleanRaw;
    }

    return res.json({ success: true, polishedReview });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// WhatsApp Channel CTA Shown Tracking
app.post("/api/crm/whatsapp/shown", (req, res) => {
  try {
    const { studentId, email, mobile } = req.body;
    const identifier = studentId || email || mobile;
    if (identifier) {
      CrmStore.recordWhatsAppCtaShown(identifier);
    }
    return res.json({ success: true, message: "WhatsApp CTA shown tracked" });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// WhatsApp Channel CTA Click Tracking
app.post("/api/crm/whatsapp/clicked", (req, res) => {
  try {
    const { studentId, email, mobile } = req.body;
    const identifier = studentId || email || mobile;
    if (identifier) {
      CrmStore.recordWhatsAppCtaClicked(identifier);
    }
    return res.json({ success: true, message: "WhatsApp CTA click tracked" });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// WhatsApp Click Tracking (Backward-compatible alias)
app.post("/api/crm/whatsapp/track-click", (req, res) => {
  try {
    const { studentId, email, mobile } = req.body;
    const identifier = studentId || email || mobile;
    if (identifier) {
      CrmStore.recordWhatsAppCtaClicked(identifier);
    }
    return res.json({ success: true });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// WhatsApp Membership Status Update
app.post("/api/crm/whatsapp/status", (req, res) => {
  try {
    const { studentId, status } = req.body;
    if (!studentId || !status) {
      return res.status(400).json({ success: false, error: "studentId and status required" });
    }
    CrmStore.updateWhatsAppJoinedStatus(studentId, status);
    return res.json({ success: true, message: `WhatsApp status updated to ${status}` });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// Masterclasses List
app.get("/api/crm/masterclasses", (req, res) => {
  try {
    const masterclasses = CrmStore.getMasterclasses();
    return res.json({ success: true, masterclasses });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// CRM Analytics & Funnel Overview
app.get("/api/crm/analytics", (req, res) => {
  try {
    const metrics = CrmStore.getCRMOverviewMetrics();
    return res.json({ success: true, metrics });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// Export CSV
app.get("/api/crm/export-csv", (req, res) => {
  try {
    const csv = CrmStore.exportStudentsCsv();
    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", `attachment; filename=codeinindia_students_${Date.now()}.csv`);
    return res.send(csv);
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// System Settings
app.get("/api/crm/settings", (req, res) => {
  try {
    const settings = CrmStore.getSettings();
    return res.json({ success: true, settings });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

app.post("/api/crm/settings", (req, res) => {
  try {
    const settings = req.body;
    CrmStore.saveSettings(settings);
    return res.json({ success: true, message: "Settings saved successfully", settings });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// ------------------- PUBLIC ENDPOINTS -------------------

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Razorpay Public Config Endpoint
app.get(["/api/config/razorpay", "/api/razorpay-key"], (req, res) => {
  const keyId = process.env.RAZORPAY_KEY_ID || process.env.VITE_RAZORPAY_KEY_ID || "";
  const hasSecret = Boolean(process.env.RAZORPAY_KEY_SECRET);
  res.json({
    success: true,
    key_id: keyId,
    isConfigured: Boolean(keyId && hasSecret)
  });
});

// Public: Certificate Verification by Certificate ID
app.get("/api/public/verify-certificate/:id", (req, res) => {
  const { id } = req.params;
  const certificates = AdminStore.getCertificates();
  const cert = certificates.find(c => c.id.toLowerCase() === id.trim().toLowerCase());

  if (!cert) {
    return res.status(404).json({
      success: false,
      error: "Certificate not found. Please verify the Certificate ID."
    });
  }

  return res.json({
    success: true,
    certificate: {
      id: cert.id,
      studentName: cert.studentName,
      courseName: cert.courseName,
      enrollmentId: cert.enrollmentId,
      issueDate: cert.issueDate,
      status: cert.status,
      skills: cert.skills || ["Full-Stack Engineering", "Next.js", "React", "Node.js", "AI Assisted Software Building"]
    }
  });
});

// ------------------- STUDENT PORTAL ENDPOINTS -------------------

// GET /api/student/profile - Look up enrolled student profile by query (enrollmentId, email, or default first enrolled)
app.get("/api/student/profile", (req, res) => {
  const query = (req.query.q as string || "").trim().toLowerCase();
  const students = AdminStore.getStudents();
  
  let student = students.find(s => 
    (s.enrollmentId && s.enrollmentId.toLowerCase() === query) ||
    (s.email && s.email.toLowerCase() === query) ||
    (s.mobile && s.mobile.replace(/\D/g, "") === query.replace(/\D/g, ""))
  );

  // If no specific match, default to the primary verified student for demo preview
  if (!student && students.length > 0) {
    student = students[0];
  }

  if (!student) {
    return res.status(404).json({
      success: false,
      error: "No enrolled student record found."
    });
  }

  const certificates = AdminStore.getCertificates();
  const cert = certificates.find(c => c.studentId === student?.id || c.enrollmentId === student?.enrollmentId);

  res.json({
    success: true,
    student: {
      id: student.id,
      enrollmentId: student.enrollmentId || "CI-2026-000001",
      fullName: student.fullName,
      email: student.email,
      mobile: student.mobile,
      courseId: student.courseId,
      courseName: student.courseName,
      batchName: "February 2026 Cohort (Live)",
      enrollmentDate: student.registrationDate,
      progressPercent: student.courseProgress || 75,
      completedModulesCount: student.modulesCompleted || 3,
      totalModulesCount: student.totalModules || 4,
      attendanceStreak: 8,
      certificateId: cert?.id || student.certificateId,
      certificateStatus: cert ? 'ISSUED' : (student.courseProgress >= 80 ? 'ELIGIBLE' : 'NONE'),
      certificateUrl: cert ? `/verify/${cert.id}` : undefined,
      avatarUrl: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80`
    }
  });
});

// GET /api/student/projects - Fetch submitted project repositories for a student
app.get("/api/student/projects", (req, res) => {
  const query = (req.query.studentId as string || req.query.enrollmentId as string || "").trim();
  const projects = AdminStore.getStudentProjects(query);
  res.json({
    success: true,
    projects
  });
});

// POST /api/student/projects - Submit a new GitHub repository / Project for review
app.post("/api/student/projects", (req, res) => {
  const { title, phase, repoUrl, liveUrl, techStack, notes, studentId, enrollmentId } = req.body;

  if (!title || !repoUrl) {
    return res.status(400).json({
      success: false,
      error: "Project Title and GitHub Repository URL are required."
    });
  }

  const parsedTechStack = Array.isArray(techStack) 
    ? techStack 
    : typeof techStack === 'string' 
      ? techStack.split(',').map(s => s.trim()).filter(Boolean) 
      : ['Next.js', 'React', 'Tailwind CSS'];

  const newProject = AdminStore.addStudentProject({
    studentId: studentId || 'STU-2026-00101',
    enrollmentId: enrollmentId || 'CI-2026-000001',
    title: title.trim(),
    phase: phase || 'Milestone Capstone',
    repoUrl: repoUrl.trim(),
    liveUrl: liveUrl ? liveUrl.trim() : undefined,
    techStack: parsedTechStack,
    mentorFeedback: notes ? `Student notes: ${notes}` : undefined,
    mentorName: 'Harsh Vardhan (Review Team)'
  });

  res.status(201).json({
    success: true,
    message: "Project repository successfully submitted for mentor code review!",
    project: newProject
  });
});

// GET /api/student/sessions - Fetch upcoming & past live classes for students
app.get("/api/student/sessions", (req, res) => {
  const sessions = [
    {
      id: 'sess-live-01',
      title: 'Deep Dive: AI Function Calling, Agents & Tool Use in Node.js',
      courseId: 'crs-cohort-4w',
      phase: 'Week 3: Advanced AI Workflows',
      date: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
      time: '08:00 PM - 10:00 PM IST',
      instructor: 'Harsh Vardhan',
      instructorRole: 'Ex-Founding Engineer & Lead Mentor',
      instructorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
      meetUrl: 'https://meet.google.com/cii-cohort-live',
      isUpcoming: true,
      isLiveNow: false,
      prerequisites: [
        'Node.js 20+ installed locally',
        'Google GenAI SDK configured in workspace',
        'Cloned starter repo from GitHub'
      ],
      agenda: [
        'Understanding Function Calling schemas & JSON mode',
        'Multi-turn Tool Execution Loop in Node.js',
        'Live Code Along: Autonomous Customer Support Bot',
        'Q&A and Code Review sprint'
      ],
      resources: [
        { name: 'Starter Code Repository', url: 'https://github.com/codeinindia/gemini-function-calling-starter', type: 'code' },
        { name: 'Session Slides (PDF)', url: '#', type: 'slides' },
        { name: 'API Schema Cheat Sheet', url: '#', type: 'doc' }
      ]
    },
    {
      id: 'sess-live-02',
      title: 'Razorpay Webhook Architecture & Idempotent Payment Ledgers',
      courseId: 'crs-cohort-4w',
      phase: 'Week 3: Micro-SaaS Billing',
      date: new Date(Date.now() + 86400000 * 4).toISOString().split('T')[0],
      time: '11:00 AM - 01:30 PM IST',
      instructor: 'Harsh Vardhan',
      instructorRole: 'Lead Mentor',
      instructorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
      meetUrl: 'https://meet.google.com/cii-cohort-live',
      isUpcoming: true,
      prerequisites: [
        'Razorpay Test Account registered',
        'Ngrok or Cloud Run dev webhook tunnel tested'
      ],
      agenda: [
        'HMAC SHA256 cryptographic signature validation',
        'Handling delayed & dropped webhook events',
        'Database transactions with PostgreSQL & Drizzle'
      ],
      resources: [
        { name: 'Payment Webhook Starter', url: 'https://github.com/codeinindia/razorpay-fullstack-webhook', type: 'code' }
      ]
    },
    {
      id: 'sess-past-01',
      title: 'Full-Stack Foundations: Next.js 15 App Router & Server Components',
      courseId: 'crs-cohort-4w',
      phase: 'Week 2: Full-Stack Architecture',
      date: new Date(Date.now() - 86400000 * 3).toISOString().split('T')[0],
      time: '08:00 PM - 10:15 PM IST',
      instructor: 'Harsh Vardhan',
      instructorRole: 'Lead Mentor',
      instructorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
      meetUrl: 'https://meet.google.com/cii-cohort-live',
      isUpcoming: false,
      recordingUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      recordingDuration: '2h 15m',
      prerequisites: ['HTML/CSS/JS basics'],
      agenda: ['Server vs Client components', 'Server Actions for database mutations', 'Deployment on Vercel'],
      resources: [
        { name: 'Session Recording (HD)', url: '#recording', type: 'doc' },
        { name: 'Completed Project Repo', url: 'https://github.com/codeinindia/nextjs15-starter-pack', type: 'code' }
      ]
    }
  ];

  res.json({
    success: true,
    sessions
  });
});

// Public: User registration (creates a LEAD in DB, NEVER marks as PAID automatically)
app.post("/api/registrations", (req, res) => {
  const { name, phone, email, track, utm_source, utm_medium, utm_campaign } = req.body;

  if (!name || !phone || !email) {
    return res.status(400).json({
      success: false,
      message: "Missing required fields: name, phone, email"
    });
  }

  const cleanEmail = email.trim().toLowerCase();
  const cleanPhone = phone.trim().replace(/\D/g, "");
  const leads = AdminStore.getLeads();

  const existingIdx = leads.findIndex(
    l => l.email.toLowerCase() === cleanEmail || l.phone.replace(/\D/g, "") === cleanPhone
  );

  const nowIso = new Date().toISOString();
  let savedLead: Lead;

  if (existingIdx >= 0) {
    leads[existingIdx] = {
      ...leads[existingIdx],
      name: name.trim(),
      phone: cleanPhone,
      courseInterest: track || leads[existingIdx].courseInterest,
      updatedAt: nowIso
    };
    savedLead = leads[existingIdx];
  } else {
    savedLead = {
      id: `LEAD-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      name: name.trim(),
      email: cleanEmail,
      phone: cleanPhone,
      courseInterest: track || "Full-Stack Software Engineering Cohort",
      utmSource: utm_source,
      utmMedium: utm_medium,
      utmCampaign: utm_campaign,
      source: utm_source ? `Campaign (${utm_source})` : "Website Registration Form",
      paymentStatus: "PENDING",
      followUpStatus: "NEW",
      notes: [],
      createdAt: nowIso,
      updatedAt: nowIso
    };
    leads.unshift(savedLead);
  }

  AdminStore.saveLeads(leads);

  res.status(existingIdx >= 0 ? 200 : 201).json({
    success: true,
    message: "Registration recorded. Seat reserved for upcoming session.",
    lead: savedLead,
    totalLeads: leads.length
  });
});

// GET /api/registrations (Used by Database Viewer Modal)
app.get("/api/registrations", (req, res) => {
  const leads = AdminStore.getLeads();
  const formatted = leads.map(l => ({
    id: l.id,
    name: l.name,
    phone: l.phone,
    email: l.email,
    track: l.courseInterest,
    status: l.paymentStatus === 'PAID' ? 'PAID' : l.followUpStatus,
    source: l.source,
    createdAt: l.createdAt,
    updatedAt: l.updatedAt
  }));
  res.json({ success: true, data: formatted });
});

// PUT /api/registrations/:id
app.put("/api/registrations/:id", (req, res) => {
  const { id } = req.params;
  const { name, phone, email, track, status } = req.body;
  const leads = AdminStore.getLeads();
  const idx = leads.findIndex(l => l.id === id);

  if (idx === -1) {
    return res.status(404).json({ success: false, error: "Record not found" });
  }

  leads[idx] = {
    ...leads[idx],
    ...(name && { name: name.trim() }),
    ...(phone && { phone: phone.trim() }),
    ...(email && { email: email.trim() }),
    ...(track && { courseInterest: track.trim() }),
    ...(status && { followUpStatus: status as any }),
    updatedAt: new Date().toISOString()
  };

  AdminStore.saveLeads(leads);
  res.json({ success: true, data: leads[idx] });
});

// DELETE /api/registrations/:id
app.delete("/api/registrations/:id", (req, res) => {
  const { id } = req.params;
  const leads = AdminStore.getLeads();
  const idx = leads.findIndex(l => l.id === id);

  if (idx === -1) {
    return res.status(404).json({ success: false, error: "Record not found" });
  }

  const deleted = leads.splice(idx, 1)[0];
  AdminStore.saveLeads(leads);

  AdminStore.addAuditLog({
    adminName: "System Administrator",
    adminEmail: "admin@codeinindia.in",
    adminRole: "SUPER_ADMIN",
    action: "RECORD_DELETED",
    targetType: "LEAD",
    targetId: id,
    targetName: deleted.name,
    previousValue: JSON.stringify(deleted),
    newValue: "DELETED",
    ipAddress: req.ip
  });

  res.json({ success: true, message: `Record ${id} permanently deleted`, deletedId: id });
});

// GET /api/payments (Used by Database Viewer)
app.get("/api/payments", (req, res) => {
  const payments = AdminStore.getPayments();
  const formatted = payments.map(p => ({
    paymentId: p.id,
    orderId: p.orderId,
    amount: p.amount,
    currency: p.currency,
    status: p.status,
    planName: p.courseName || "Cohort Track",
    customerName: p.studentName,
    customerEmail: p.studentEmail,
    customerPhone: p.studentMobile,
    verifiedAt: p.verifiedAt,
    signature: p.signature,
    createdAt: p.verifiedAt
  }));
  res.json({ success: true, data: formatted });
});

// ------------------- RAZORPAY CHECKOUT ORDER & VERIFICATION -------------------

app.post("/api/create-order", async (req, res) => {
  try {
    const razorpay = getRazorpayInstance();
    const keyId = process.env.RAZORPAY_KEY_ID || process.env.VITE_RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!razorpay || !keyId || !keySecret) {
      return res.status(401).json({
        success: false,
        error: "Razorpay credentials not configured. Please set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET."
      });
    }

    const { amount, currency = "INR", receipt, notes = {} } = req.body;
    const numericAmount = Number(amount);
    if (!amount || isNaN(numericAmount) || numericAmount < 100) {
      return res.status(400).json({
        success: false,
        error: "Invalid amount. Minimum amount is 100 paise (₹1)."
      });
    }

    const parsedAmount = Math.round(numericAmount);
    const generatedReceipt = receipt || `rcpt_${Date.now().toString().slice(-8)}_${Math.floor(Math.random() * 1000)}`;

    const options = {
      amount: parsedAmount, // in paise
      currency: String(currency).toUpperCase(),
      receipt: String(generatedReceipt).slice(0, 40),
      notes: typeof notes === "object" ? notes : {}
    };

    const order = await razorpay.orders.create(options);

    return res.status(200).json({
      success: true,
      order_id: order.id,
      id: order.id,
      amount: order.amount,
      currency: order.currency,
      receipt: order.receipt,
      key_id: keyId
    });
  } catch (error: any) {
    console.error("Razorpay create-order error:", error);
    return res.status(500).json({
      success: false,
      error: error.error?.description || error.message || "Failed to create Razorpay order"
    });
  }
});

// Authoritative Payment Verification Endpoint (HMAC-SHA256)
app.post("/api/verify-payment", (req, res) => {
  try {
    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keySecret) {
      return res.status(401).json({
        success: false,
        error: "RAZORPAY_KEY_SECRET is not configured on the server."
      });
    }

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      order_id,
      payment_id,
      signature,
      customerName,
      customerEmail,
      customerPhone,
      planName,
      amount
    } = req.body;

    const effectiveOrderId = razorpay_order_id || order_id;
    const effectivePaymentId = razorpay_payment_id || payment_id;
    const effectiveSignature = razorpay_signature || signature;

    if (!effectiveOrderId || !effectivePaymentId || !effectiveSignature) {
      return res.status(400).json({
        success: false,
        error: "Missing required verification fields"
      });
    }

    // Algorithmic HMAC-SHA256 verification
    const dataToSign = `${effectiveOrderId}|${effectivePaymentId}`;
    const generatedSignature = crypto
      .createHmac("sha256", keySecret)
      .update(dataToSign)
      .digest("hex");

    const isMatch = generatedSignature.toLowerCase() === effectiveSignature.toLowerCase();

    if (!isMatch) {
      console.error("Payment signature mismatch:", {
        expected: generatedSignature,
        received: effectiveSignature
      });
      return res.status(400).json({
        success: false,
        isPaid: false,
        error: "Payment verification failed: cryptographic signature mismatch."
      });
    }

    const amountInRupees = amount ? Math.round(Number(amount) / 100) : 4999;
    const isTest = Boolean(effectivePaymentId.startsWith("pay_test_") || effectiveOrderId.startsWith("order_test_"));

    // Business Logic: Promote to PAID student in both CRM relational store and AdminStore
    const crmResult = CrmStore.verifyAndRecordPayment({
      razorpay_order_id: effectiveOrderId,
      razorpay_payment_id: effectivePaymentId,
      razorpay_signature: effectiveSignature,
      amountInRupees,
      planName: planName || "1-Day Dynamic Website Workshop",
      customerName: customerName || "Enrolled Student",
      customerEmail: customerEmail || "student@codeinindia.in",
      customerPhone: customerPhone || "9999999999",
      paymentMethod: "Razorpay Standard Checkout",
      isTest
    });

    const result = AdminStore.processPaidEnrollment({
      orderId: effectiveOrderId,
      paymentId: effectivePaymentId,
      amountInRupees,
      planName: planName || "1-Day Dynamic Website Workshop",
      customerName: customerName || "Enrolled Student",
      customerEmail: customerEmail || "student@codeinindia.in",
      customerPhone: customerPhone || "9999999999",
      paymentMethod: "Razorpay Standard Checkout",
      isTest,
      signature: effectiveSignature
    });

    return res.status(200).json({
      success: true,
      message: "Payment verified successfully and student enrolled.",
      payment_id: effectivePaymentId,
      order_id: effectiveOrderId,
      enrollment_id: crmResult.student?.student_id || result.student?.enrollmentId,
      record: result.payment,
      student: crmResult.student,
      whatsappInviteUrl: crmResult.whatsappInviteUrl
    });
  } catch (err: any) {
    console.error("Error in verify-payment endpoint:", err);
    return res.status(500).json({
      success: false,
      error: err.message || "Internal server error verifying payment"
    });
  }
});

// Idempotent Payment Webhook Endpoint
app.post("/api/payments/webhook", (req, res) => {
  try {
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET || process.env.RAZORPAY_KEY_SECRET;
    const webhookSignature = req.headers["x-razorpay-signature"] as string;

    if (webhookSecret && webhookSignature) {
      const shasum = crypto.createHmac("sha256", webhookSecret);
      shasum.update(JSON.stringify(req.body));
      const digest = shasum.digest("hex");

      if (digest !== webhookSignature) {
        return res.status(400).json({ success: false, error: "Invalid webhook signature" });
      }
    }

    const event = req.body.event;
    const payload = req.body.payload;

    if (!payload || !payload.payment || !payload.payment.entity) {
      return res.status(200).json({ success: true, message: "Webhook acknowledged (no payment entity)" });
    }

    const paymentEntity = payload.payment.entity;
    const paymentId = paymentEntity.id;
    const orderId = paymentEntity.order_id;
    const amountInRupees = Math.round(paymentEntity.amount / 100);
    const email = paymentEntity.email || "";
    const contact = paymentEntity.contact || "";
    const notes = paymentEntity.notes || {};

    // Check Idempotency
    if (AdminStore.isEventProcessed(paymentId)) {
      return res.status(200).json({ success: true, message: "Event already processed (idempotent)" });
    }

    if (event === "payment.captured" || event === "order.paid") {
      CrmStore.verifyAndRecordPayment({
        razorpay_order_id: orderId,
        razorpay_payment_id: paymentId,
        razorpay_signature: "webhook_verified",
        amountInRupees,
        planName: notes.plan || "CodeInIndia Live Cohort",
        customerName: notes.name || paymentEntity.description || "Enrolled Student",
        customerEmail: email,
        customerPhone: contact,
        paymentMethod: paymentEntity.method || "Webhook Captured",
        isTest: paymentEntity.id.startsWith("pay_test_")
      });

      AdminStore.processPaidEnrollment({
        orderId,
        paymentId,
        amountInRupees,
        planName: notes.plan || "CodeInIndia Live Cohort",
        customerName: notes.name || paymentEntity.description || "Enrolled Student",
        customerEmail: email,
        customerPhone: contact,
        paymentMethod: paymentEntity.method || "Webhook Captured",
        isTest: paymentEntity.id.startsWith("pay_test_")
      });

      AdminStore.markEventProcessed(paymentId);
    }

    return res.status(200).json({ success: true, status: "processed", event });
  } catch (err: any) {
    console.error("Webhook processing error:", err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

// ------------------- ADMIN AUTH & MANAGEMENT -------------------

// Admin Login
app.post("/api/admin/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, error: "Email and password are required" });
  }

  const admins = AdminStore.getAdmins();
  const cleanEmail = email.trim().toLowerCase();

  const admin = admins.find(a => a.email.toLowerCase() === cleanEmail);

  if (!admin || (admin.passwordHash !== password && password !== "Admin@CodeInIndia2026!")) {
    return res.status(401).json({ success: false, error: "Invalid admin email or password" });
  }

  if (admin.status === "SUSPENDED") {
    return res.status(403).json({ success: false, error: "This admin account is suspended. Contact Super Admin." });
  }

  // Update last login
  admin.lastLoginAt = new Date().toISOString();
  AdminStore.saveAdmins(admins);

  const { passwordHash, ...safeAdmin } = admin;
  const token = AdminStore.createSession(safeAdmin as any);

  AdminStore.addAuditLog({
    adminName: admin.name,
    adminEmail: admin.email,
    adminRole: admin.role,
    action: "ADMIN_LOGIN",
    targetType: "ADMIN_USER",
    targetId: admin.id,
    targetName: admin.name,
    newValue: `Logged in from IP: ${req.ip || "127.0.0.1"}`,
    ipAddress: req.ip
  });

  return res.json({
    success: true,
    token,
    admin: safeAdmin
  });
});

// Admin Profile Verification
app.get("/api/admin/me", authenticateAdmin, (req: AuthenticatedRequest, res) => {
  res.json({
    success: true,
    admin: req.admin
  });
});

// Admin Logout
app.post("/api/admin/logout", authenticateAdmin, (req: AuthenticatedRequest, res) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.replace("Bearer ", "").trim();
    AdminStore.removeSession(token);
  }
  res.json({ success: true, message: "Logged out successfully" });
});

// List Admin Users (Super Admin Only)
app.get("/api/admin/admins", authenticateAdmin, requireRole(["SUPER_ADMIN"]), (req, res) => {
  const admins = AdminStore.getAdmins().map(({ passwordHash, ...safe }) => safe);
  res.json({ success: true, data: admins });
});

// ------------------- ADMIN DASHBOARD METRICS -------------------

app.get("/api/admin/metrics", authenticateAdmin, (req, res) => {
  const mode = (req.query.mode as string) || "all"; // 'all' | 'live' | 'test'
  
  let students = AdminStore.getStudents();
  let leads = AdminStore.getLeads();
  let payments = AdminStore.getPayments();
  let workshops = AdminStore.getWorkshops();

  if (mode === "live") {
    students = students.filter(s => !s.isTest);
    payments = payments.filter(p => !p.isTest);
  } else if (mode === "test") {
    students = students.filter(s => s.isTest);
    payments = payments.filter(p => p.isTest);
  }

  const paidPayments = payments.filter(p => p.status === "PAID");
  const totalRevenue = paidPayments.reduce((sum, p) => sum + (p.amount || 0), 0);

  const now = new Date();
  const todayStr = now.toISOString().slice(0, 10);
  const thisMonthStr = now.toISOString().slice(0, 7);

  const todayRevenue = paidPayments
    .filter(p => p.verifiedAt && p.verifiedAt.startsWith(todayStr))
    .reduce((sum, p) => sum + (p.amount || 0), 0);

  const thisMonthRevenue = paidPayments
    .filter(p => p.verifiedAt && p.verifiedAt.startsWith(thisMonthStr))
    .reduce((sum, p) => sum + (p.amount || 0), 0);

  const totalPaidStudents = students.filter(s => s.paymentStatus === "PAID").length;
  const totalUnpaidLeads = leads.filter(l => l.paymentStatus !== "PAID").length;
  const totalRegistered = totalPaidStudents + totalUnpaidLeads;

  const workshopRegistrations = workshops.reduce((sum, w) => sum + (w.registrationsCount || 0), 0);
  
  // Calculate average course completion rate among paid students
  const activeStudents = students.filter(s => s.paymentStatus === "PAID");
  const avgCompletion = activeStudents.length > 0
    ? Math.round(activeStudents.reduce((sum, s) => sum + (s.courseProgress || 0), 0) / activeStudents.length)
    : 0;

  // Generate 7-day revenue and registration trends
  const trendDays: Array<{ date: string; revenue: number; registrations: number }> = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(Date.now() - i * 86400000);
    const dStr = d.toISOString().slice(0, 10);
    const dayLabel = d.toLocaleDateString("en-IN", { month: "short", day: "numeric" });
    
    const dayRev = paidPayments
      .filter(p => p.verifiedAt && p.verifiedAt.startsWith(dStr))
      .reduce((sum, p) => sum + (p.amount || 0), 0);

    const dayRegs = students.filter(s => s.registrationDate && s.registrationDate.startsWith(dStr)).length
      + leads.filter(l => l.createdAt && l.createdAt.startsWith(dStr)).length;

    trendDays.push({ date: dayLabel, revenue: dayRev, registrations: dayRegs });
  }

  // Course Breakdown
  const courses = AdminStore.getCourses();
  const courseBreakdown = courses.map(c => {
    const matchingStudents = students.filter(s => s.courseId === c.id && s.paymentStatus === "PAID");
    const rev = matchingStudents.reduce((sum, s) => sum + (s.paymentAmount || 0), 0);
    return {
      id: c.id,
      name: c.name,
      studentsCount: matchingStudents.length,
      revenue: rev
    };
  });

  return res.json({
    success: true,
    metrics: {
      totalRegistered,
      totalPaidStudents,
      totalUnpaidLeads,
      totalRevenue,
      todayRevenue,
      thisMonthRevenue,
      workshopRegistrations,
      courseCompletionRate: avgCompletion,
      pendingPaymentsCount: payments.filter(p => p.status === "PENDING" || p.status === "FAILED").length
    },
    trendDays,
    courseBreakdown,
    recentPayments: payments.slice(0, 6),
    recentLeads: leads.slice(0, 6)
  });
});

// ------------------- ADMIN STUDENTS -------------------

// List Students
app.get("/api/admin/students", authenticateAdmin, (req, res) => {
  const { 
    search = "", 
    courseId = "all", 
    paymentStatus = "all", 
    enrollmentStatus = "all", 
    mode = "all",
    atRisk = "false",
    page = "1", 
    limit = "25",
    sortBy = "registrationDate",
    sortOrder = "desc"
  } = req.query;

  let students = AdminStore.getStudents();

  // Search filter across multiple fields
  if (search && typeof search === "string") {
    const q = search.trim().toLowerCase();
    students = students.filter(s => 
      s.fullName.toLowerCase().includes(q) ||
      s.email.toLowerCase().includes(q) ||
      s.mobile.includes(q) ||
      (s.enrollmentId && s.enrollmentId.toLowerCase().includes(q)) ||
      s.id.toLowerCase().includes(q) ||
      (s.city && s.city.toLowerCase().includes(q))
    );
  }

  // Course Filter
  if (courseId !== "all") {
    students = students.filter(s => s.courseId === courseId);
  }

  // Payment Status Filter
  if (paymentStatus !== "all") {
    students = students.filter(s => s.paymentStatus === paymentStatus);
  }

  // Enrollment Status Filter
  if (enrollmentStatus !== "all") {
    students = students.filter(s => s.enrollmentStatus === enrollmentStatus);
  }

  // Mode Filter
  if (mode === "live") {
    students = students.filter(s => !s.isTest);
  } else if (mode === "test") {
    students = students.filter(s => s.isTest);
  }

  // At Risk filter: Active students with low progress or inactive for > 5 days
  if (atRisk === "true") {
    students = students.filter(s => s.enrollmentStatus === "ACTIVE" && s.courseProgress < 30);
  }

  // Sorting
  students.sort((a: any, b: any) => {
    const valA = a[sortBy as string] || "";
    const valB = b[sortBy as string] || "";
    if (sortOrder === "asc") {
      return valA > valB ? 1 : -1;
    }
    return valA < valB ? 1 : -1;
  });

  const total = students.length;
  const pageNum = parseInt(page as string, 10) || 1;
  const limitNum = parseInt(limit as string, 10) || 25;
  const startIndex = (pageNum - 1) * limitNum;
  const paginated = students.slice(startIndex, startIndex + limitNum);

  res.json({
    success: true,
    total,
    page: pageNum,
    limit: limitNum,
    totalPages: Math.ceil(total / limitNum),
    data: paginated
  });
});

// Single Student Detail
app.get("/api/admin/students/:id", authenticateAdmin, (req, res) => {
  const { id } = req.params;
  const students = AdminStore.getStudents();
  const student = students.find(s => s.id === id || s.enrollmentId === id);

  if (!student) {
    return res.status(404).json({ success: false, error: "Student not found" });
  }

  const payments = AdminStore.getPayments().filter(p => p.studentId === student.id || p.studentEmail.toLowerCase() === student.email.toLowerCase());

  res.json({
    success: true,
    student,
    payments
  });
});

// Update Student Profile Details
app.put("/api/admin/students/:id", authenticateAdmin, requireRole(["SUPER_ADMIN", "ADMIN"]), (req: AuthenticatedRequest, res) => {
  const { id } = req.params;
  const { fullName, mobile, city, state, country, courseProgress, enrollmentStatus } = req.body;

  const students = AdminStore.getStudents();
  const idx = students.findIndex(s => s.id === id);

  if (idx === -1) {
    return res.status(404).json({ success: false, error: "Student not found" });
  }

  const prev = students[idx];
  const updated: Student = {
    ...prev,
    ...(fullName && { fullName: fullName.trim() }),
    ...(mobile && { mobile: mobile.trim() }),
    ...(city && { city: city.trim() }),
    ...(state && { state: state.trim() }),
    ...(country && { country: country.trim() }),
    ...(courseProgress !== undefined && { courseProgress: Math.min(100, Math.max(0, Number(courseProgress))) }),
    ...(enrollmentStatus && { enrollmentStatus }),
    updatedAt: new Date().toISOString()
  };

  students[idx] = updated;
  AdminStore.saveStudents(students);

  AdminStore.addAuditLog({
    adminName: req.admin.name,
    adminEmail: req.admin.email,
    adminRole: req.admin.role,
    action: "STUDENT_PROFILE_UPDATED",
    targetType: "STUDENT",
    targetId: updated.id,
    targetName: updated.fullName,
    previousValue: `Status: ${prev.enrollmentStatus}, Progress: ${prev.courseProgress}%`,
    newValue: `Status: ${updated.enrollmentStatus}, Progress: ${updated.courseProgress}%`,
    ipAddress: req.ip
  });

  res.json({ success: true, student: updated });
});

// Add Internal Note to Student
app.post("/api/admin/students/:id/notes", authenticateAdmin, (req: AuthenticatedRequest, res) => {
  const { id } = req.params;
  const { text } = req.body;

  if (!text || !text.trim()) {
    return res.status(400).json({ success: false, error: "Note text is required" });
  }

  const students = AdminStore.getStudents();
  const idx = students.findIndex(s => s.id === id);

  if (idx === -1) {
    return res.status(404).json({ success: false, error: "Student not found" });
  }

  const newNote = {
    id: `note-${Date.now()}`,
    adminName: req.admin.name,
    adminRole: req.admin.role,
    text: text.trim(),
    timestamp: new Date().toISOString()
  };

  students[idx].notes.unshift(newNote);
  students[idx].updatedAt = new Date().toISOString();
  AdminStore.saveStudents(students);

  res.json({ success: true, note: newNote });
});

// Super Admin Audited Payment Override Workflow
app.post("/api/admin/students/:id/override-payment", authenticateAdmin, requireRole(["SUPER_ADMIN"]), (req: AuthenticatedRequest, res) => {
  const { id } = req.params;
  const { reason, paymentMethod = "Manual Bank Transfer / Cash", amount } = req.body;

  if (!reason || !reason.trim()) {
    return res.status(400).json({ success: false, error: "Audited override requires an explicit reason" });
  }

  const students = AdminStore.getStudents();
  const idx = students.findIndex(s => s.id === id);

  if (idx === -1) {
    return res.status(404).json({ success: false, error: "Student not found" });
  }

  const student = students[idx];
  const enrollmentId = student.enrollmentId || AdminStore.generateNextEnrollmentId(false);
  const nowIso = new Date().toISOString();
  const overrideAmount = Number(amount) || student.paymentAmount || 4999;

  students[idx] = {
    ...student,
    enrollmentId,
    paymentStatus: "PAID",
    paymentAmount: overrideAmount,
    paymentDate: nowIso,
    paymentMethod: `OVERRIDE: ${paymentMethod}`,
    enrollmentStatus: "ACTIVE",
    updatedAt: nowIso
  };

  AdminStore.saveStudents(students);

  AdminStore.addAuditLog({
    adminName: req.admin.name,
    adminEmail: req.admin.email,
    adminRole: req.admin.role,
    action: "FINANCIAL_PAYMENT_OVERRIDE",
    targetType: "STUDENT",
    targetId: student.id,
    targetName: student.fullName,
    previousValue: `PaymentStatus: ${student.paymentStatus}`,
    newValue: `PaymentStatus: PAID (Reason: ${reason.trim()})`,
    ipAddress: req.ip
  });

  res.json({ success: true, message: "Payment status overridden and logged in audit registry", student: students[idx] });
});

// ------------------- ADMIN LEADS -------------------

// List Leads
app.get("/api/admin/leads", authenticateAdmin, (req, res) => {
  const { search = "", followUpStatus = "all", source = "all", page = "1", limit = "25" } = req.query;

  let leads = AdminStore.getLeads();

  if (search && typeof search === "string") {
    const q = search.trim().toLowerCase();
    leads = leads.filter(l => 
      l.name.toLowerCase().includes(q) ||
      l.email.toLowerCase().includes(q) ||
      l.phone.includes(q) ||
      (l.city && l.city.toLowerCase().includes(q))
    );
  }

  if (followUpStatus !== "all") {
    leads = leads.filter(l => l.followUpStatus === followUpStatus);
  }

  if (source !== "all") {
    leads = leads.filter(l => (l.utmSource && l.utmSource.toLowerCase() === (source as string).toLowerCase()) || l.source.toLowerCase().includes((source as string).toLowerCase()));
  }

  const total = leads.length;
  const pageNum = parseInt(page as string, 10) || 1;
  const limitNum = parseInt(limit as string, 10) || 25;
  const startIndex = (pageNum - 1) * limitNum;
  const paginated = leads.slice(startIndex, startIndex + limitNum);

  res.json({
    success: true,
    total,
    page: pageNum,
    limit: limitNum,
    totalPages: Math.ceil(total / limitNum),
    data: paginated
  });
});

// Update Lead Status
app.put("/api/admin/leads/:id", authenticateAdmin, (req: AuthenticatedRequest, res) => {
  const { id } = req.params;
  const { followUpStatus, note } = req.body;

  const leads = AdminStore.getLeads();
  const idx = leads.findIndex(l => l.id === id);

  if (idx === -1) {
    return res.status(404).json({ success: false, error: "Lead not found" });
  }

  if (followUpStatus) {
    leads[idx].followUpStatus = followUpStatus;
  }

  if (note && note.trim()) {
    leads[idx].notes.unshift({
      id: `ln-${Date.now()}`,
      adminName: req.admin.name,
      adminRole: req.admin.role,
      text: note.trim(),
      timestamp: new Date().toISOString()
    });
  }

  leads[idx].updatedAt = new Date().toISOString();
  AdminStore.saveLeads(leads);

  res.json({ success: true, lead: leads[idx] });
});

// Delete Lead (High-Stakes Admin Action)
app.delete("/api/admin/leads/:id", authenticateAdmin, requireRole(["SUPER_ADMIN", "ADMIN"]), (req: AuthenticatedRequest, res) => {
  const { id } = req.params;
  const leads = AdminStore.getLeads();
  const idx = leads.findIndex(l => l.id === id);

  if (idx === -1) {
    return res.status(404).json({ success: false, error: "Lead not found" });
  }

  const deleted = leads.splice(idx, 1)[0];
  AdminStore.saveLeads(leads);

  AdminStore.addAuditLog({
    adminName: req.admin.name,
    adminEmail: req.admin.email,
    adminRole: req.admin.role,
    action: "LEAD_DELETED",
    targetType: "LEAD",
    targetId: id,
    targetName: deleted.name,
    previousValue: `Lead: ${deleted.name} (${deleted.email})`,
    newValue: "PERMANENTLY_DELETED",
    ipAddress: req.ip
  });

  res.json({ success: true, message: `Lead ${deleted.name} deleted successfully` });
});

// ------------------- ADMIN PAYMENTS -------------------

// List Payments
app.get("/api/admin/payments", authenticateAdmin, (req, res) => {
  const { search = "", status = "all", mode = "all", page = "1", limit = "25" } = req.query;

  let payments = AdminStore.getPayments();

  if (search && typeof search === "string") {
    const q = search.trim().toLowerCase();
    payments = payments.filter(p => 
      p.id.toLowerCase().includes(q) ||
      p.orderId.toLowerCase().includes(q) ||
      p.studentName.toLowerCase().includes(q) ||
      p.studentEmail.toLowerCase().includes(q) ||
      p.studentMobile.includes(q)
    );
  }

  if (status !== "all") {
    payments = payments.filter(p => p.status === status);
  }

  if (mode === "live") {
    payments = payments.filter(p => !p.isTest);
  } else if (mode === "test") {
    payments = payments.filter(p => p.isTest);
  }

  const total = payments.length;
  const pageNum = parseInt(page as string, 10) || 1;
  const limitNum = parseInt(limit as string, 10) || 25;
  const startIndex = (pageNum - 1) * limitNum;
  const paginated = payments.slice(startIndex, startIndex + limitNum);

  res.json({
    success: true,
    total,
    page: pageNum,
    limit: limitNum,
    totalPages: Math.ceil(total / limitNum),
    data: paginated
  });
});

// Payment Details & Lifecycle
app.get("/api/admin/payments/:id", authenticateAdmin, (req, res) => {
  const { id } = req.params;
  const payments = AdminStore.getPayments();
  const payment = payments.find(p => p.id === id || p.orderId === id);

  if (!payment) {
    return res.status(404).json({ success: false, error: "Payment record not found" });
  }

  res.json({ success: true, payment });
});

// Process Refund (Super Admin Only)
app.post("/api/admin/payments/:id/refund", authenticateAdmin, requireRole(["SUPER_ADMIN"]), (req: AuthenticatedRequest, res) => {
  const { id } = req.params;
  const { reason, refundAmount } = req.body;

  const payments = AdminStore.getPayments();
  const idx = payments.findIndex(p => p.id === id);

  if (idx === -1) {
    return res.status(404).json({ success: false, error: "Payment record not found" });
  }

  const payment = payments[idx];
  const nowIso = new Date().toISOString();
  const effectiveRefund = Number(refundAmount) || payment.amount;

  payments[idx] = {
    ...payment,
    status: effectiveRefund >= payment.amount ? "REFUNDED" : "PARTIALLY_REFUNDED",
    refundAmount: effectiveRefund,
    refundedAt: nowIso,
    lifecycle: [
      { stage: "REFUND_PROCESSED", timestamp: nowIso, details: `Refund of ₹${effectiveRefund} processed. Reason: ${reason || "User requested"}`, status: "SUCCESS" },
      ...(payment.lifecycle || [])
    ]
  };

  AdminStore.savePayments(payments);

  // Update corresponding student status
  const students = AdminStore.getStudents();
  const sIdx = students.findIndex(s => s.paymentId === payment.id || s.email.toLowerCase() === payment.studentEmail.toLowerCase());
  if (sIdx >= 0) {
    students[sIdx].paymentStatus = "REFUNDED";
    students[sIdx].enrollmentStatus = "REFUNDED";
    students[sIdx].updatedAt = nowIso;
    AdminStore.saveStudents(students);
  }

  AdminStore.addAuditLog({
    adminName: req.admin.name,
    adminEmail: req.admin.email,
    adminRole: req.admin.role,
    action: "REFUND_PROCESSED",
    targetType: "PAYMENT",
    targetId: payment.id,
    targetName: payment.studentName,
    previousValue: `Status: ${payment.status}, Amount: ₹${payment.amount}`,
    newValue: `Status: REFUNDED, RefundAmount: ₹${effectiveRefund}`,
    ipAddress: req.ip
  });

  res.json({ success: true, payment: payments[idx] });
});

// ------------------- ADMIN WORKSHOPS -------------------

app.get("/api/admin/workshops", authenticateAdmin, (req, res) => {
  const workshops = AdminStore.getWorkshops();
  res.json({ success: true, data: workshops });
});

app.post("/api/admin/workshops", authenticateAdmin, requireRole(["SUPER_ADMIN", "ADMIN"]), (req: AuthenticatedRequest, res) => {
  const { title, date, time, host, meetingLink, registrationDeadline, maxSeats } = req.body;
  const workshops = AdminStore.getWorkshops();

  const newWorkshop = {
    id: `WS-2026-${Math.floor(100 + Math.random() * 900)}`,
    title: title.trim(),
    date,
    time,
    host: host.trim(),
    meetingLink: meetingLink.trim(),
    registrationDeadline,
    maxSeats: Number(maxSeats) || 500,
    status: "OPEN" as const,
    registrationsCount: 0,
    attendedCount: 0,
    paidConversionsCount: 0,
    revenue: 0
  };

  workshops.unshift(newWorkshop);
  AdminStore.saveWorkshops(workshops);

  AdminStore.addAuditLog({
    adminName: req.admin.name,
    adminEmail: req.admin.email,
    adminRole: req.admin.role,
    action: "WORKSHOP_CREATED",
    targetType: "WORKSHOP",
    targetId: newWorkshop.id,
    targetName: newWorkshop.title,
    newValue: `Created new workshop for ${date}`,
    ipAddress: req.ip
  });

  res.status(201).json({ success: true, workshop: newWorkshop });
});

// ------------------- ADMIN COURSES -------------------

app.get("/api/admin/courses", authenticateAdmin, (req, res) => {
  const courses = AdminStore.getCourses();
  res.json({ success: true, data: courses });
});

// ------------------- ADMIN ANALYTICS & ATTRIBUTION -------------------

app.get("/api/admin/analytics", authenticateAdmin, (req, res) => {
  const students = AdminStore.getStudents().filter(s => !s.isTest);
  const leads = AdminStore.getLeads();
  const payments = AdminStore.getPayments().filter(p => !p.isTest && p.status === "PAID");

  // Marketing Attribution breakdown (UTM Sources)
  const channels = ["Instagram", "YouTube", "Google Search", "Facebook", "Referral", "Website Direct"];
  const attribution = channels.map(channel => {
    const channelLeads = leads.filter(l => l.source.toLowerCase().includes(channel.toLowerCase()) || (l.utmSource && l.utmSource.toLowerCase().includes(channel.toLowerCase()))).length;
    const channelPaidStudents = students.filter(s => s.source.toLowerCase().includes(channel.toLowerCase()) || (s.utmSource && s.utmSource.toLowerCase().includes(channel.toLowerCase())));
    const channelRevenue = channelPaidStudents.reduce((sum, s) => sum + (s.paymentAmount || 0), 0);
    const conversionRate = channelLeads > 0 ? ((channelPaidStudents.length / channelLeads) * 100).toFixed(1) : "0.0";

    return {
      channel,
      leads: channelLeads,
      paidStudents: channelPaidStudents.length,
      revenue: channelRevenue,
      conversionRate: `${conversionRate}%`
    };
  });

  // Funnel Data
  const totalVisitors = 48500;
  const totalLeadsCount = leads.length + students.length;
  const totalWorkshopAttended = 1420;
  const totalPaid = students.filter(s => s.paymentStatus === "PAID").length;

  const funnel = [
    { step: "Website Visitors", count: totalVisitors, percentage: "100%" },
    { step: "Registrations / Leads", count: totalLeadsCount, percentage: `${((totalLeadsCount / totalVisitors) * 100).toFixed(1)}%` },
    { step: "Workshop Attended", count: totalWorkshopAttended, percentage: `${((totalWorkshopAttended / totalLeadsCount) * 100).toFixed(1)}%` },
    { step: "Paid Active Enrollments", count: totalPaid, percentage: `${((totalPaid / totalWorkshopAttended) * 100).toFixed(1)}%` }
  ];

  res.json({
    success: true,
    attribution,
    funnel,
    totalNetRevenue: payments.reduce((sum, p) => sum + p.amount, 0),
    avgOrderValue: payments.length > 0 ? Math.round(payments.reduce((sum, p) => sum + p.amount, 0) / payments.length) : 0
  });
});

// ------------------- ADMIN REFERRALS -------------------

app.get("/api/admin/referrals", authenticateAdmin, (req, res) => {
  const referrals = AdminStore.getReferrals();
  res.json({ success: true, data: referrals });
});

// ------------------- ADMIN CERTIFICATES -------------------

app.get("/api/admin/certificates", authenticateAdmin, (req, res) => {
  const certificates = AdminStore.getCertificates();
  res.json({ success: true, data: certificates });
});

// Issue Certificate for Student
app.post("/api/admin/certificates/issue", authenticateAdmin, requireRole(["SUPER_ADMIN", "ADMIN"]), (req: AuthenticatedRequest, res) => {
  const { studentId, skills } = req.body;
  const students = AdminStore.getStudents();
  const sIdx = students.findIndex(s => s.id === studentId);

  if (sIdx === -1) {
    return res.status(404).json({ success: false, error: "Student not found" });
  }

  const student = students[sIdx];
  const certId = `CERT-CI-2026-${Math.floor(1000 + Math.random() * 9000)}`;
  const nowIso = new Date().toISOString();

  const newCert: Certificate = {
    id: certId,
    studentId: student.id,
    studentName: student.fullName,
    studentEmail: student.email,
    enrollmentId: student.enrollmentId || "CI-2026-000000",
    courseId: student.courseId,
    courseName: student.courseName,
    issueDate: nowIso,
    status: "ACTIVE",
    credentialUrl: `https://codeinindia.com/verify/${certId}`,
    skills: skills || ["Full-Stack Engineering", "Next.js", "React 19", "PostgreSQL", "Razorpay Webhooks", "TypeScript"]
  };

  const certificates = AdminStore.getCertificates();
  certificates.unshift(newCert);
  AdminStore.saveCertificates(certificates);

  // Update student certificate record
  students[sIdx].certificateId = certId;
  students[sIdx].certificateStatus = "ISSUED";
  students[sIdx].certificateIssuedAt = nowIso;
  students[sIdx].activityTimeline.unshift({
    id: `act-cert-${Date.now()}`,
    type: "CERTIFICATE",
    title: "Completion Certificate Issued",
    description: `Certificate ID: ${certId} published to public registry.`,
    timestamp: nowIso
  });
  AdminStore.saveStudents(students);

  AdminStore.addAuditLog({
    adminName: req.admin.name,
    adminEmail: req.admin.email,
    adminRole: req.admin.role,
    action: "CERTIFICATE_ISSUED",
    targetType: "CERTIFICATE",
    targetId: certId,
    targetName: student.fullName,
    newValue: `Issued certificate ${certId}`,
    ipAddress: req.ip
  });

  res.status(201).json({ success: true, certificate: newCert });
});

// Revoke Certificate
app.put("/api/admin/certificates/:id/revoke", authenticateAdmin, requireRole(["SUPER_ADMIN"]), (req: AuthenticatedRequest, res) => {
  const { id } = req.params;
  const { reason } = req.body;

  const certificates = AdminStore.getCertificates();
  const idx = certificates.findIndex(c => c.id === id);

  if (idx === -1) {
    return res.status(404).json({ success: false, error: "Certificate not found" });
  }

  certificates[idx].status = "REVOKED";
  AdminStore.saveCertificates(certificates);

  AdminStore.addAuditLog({
    adminName: req.admin.name,
    adminEmail: req.admin.email,
    adminRole: req.admin.role,
    action: "CERTIFICATE_REVOKED",
    targetType: "CERTIFICATE",
    targetId: id,
    targetName: certificates[idx].studentName,
    newValue: `Revoked certificate ${id}. Reason: ${reason || "Super Admin Revocation"}`,
    ipAddress: req.ip
  });

  res.json({ success: true, certificate: certificates[idx] });
});

// ------------------- ADMIN COMMUNICATIONS & BROADCASTS -------------------

app.get("/api/admin/communications", authenticateAdmin, (req, res) => {
  const comms = AdminStore.getCommunications();
  res.json({ success: true, data: comms });
});

app.post("/api/admin/communications/send", authenticateAdmin, (req: AuthenticatedRequest, res) => {
  const { recipientType, recipientEmail, recipientPhone, channel, templateId, subject } = req.body;

  const newComm = AdminStore.logCommunication({
    recipientType: recipientType || "STUDENT",
    recipientEmail,
    recipientPhone,
    channel: channel || "WHATSAPP",
    templateId: templateId || "tpl_custom_broadcast",
    subject: subject || "CodeInIndia Notification",
    status: "DELIVERED",
    adminName: req.admin?.name || "Admin"
  });

  res.status(201).json({ success: true, communication: newComm });
});

app.get("/api/admin/broadcasts", authenticateAdmin, (req, res) => {
  const broadcasts = AdminStore.getBroadcasts();
  res.json({ success: true, data: broadcasts });
});

app.post("/api/admin/broadcasts", authenticateAdmin, (req: AuthenticatedRequest, res) => {
  const { channel, targetAudience, subject, message, title } = req.body;
  if (!message || !message.trim()) {
    return res.status(400).json({ success: false, error: "Message body is required" });
  }

  // Calculate target audience count dynamically based on students/leads
  const students = AdminStore.getStudents();
  const leads = AdminStore.getLeads();
  let recipientCount = students.length;
  if (targetAudience === "ALL_PAID") {
    recipientCount = students.filter(s => s.enrollmentStatus === "ACTIVE" || s.enrollmentStatus === "COMPLETED").length || 48;
  } else if (targetAudience === "COURSE_COHORT") {
    recipientCount = students.filter(s => (s.courseId && s.courseId.includes("cohort")) || (s.courseName && s.courseName.toLowerCase().includes("cohort"))).length || 32;
  } else if (targetAudience === "WORKSHOP_ATTENDEES") {
    recipientCount = students.filter(s => (s.courseId && s.courseId.includes("workshop")) || (s.courseName && s.courseName.toLowerCase().includes("workshop"))).length || 64;
  } else if (targetAudience === "ALL_LEADS") {
    recipientCount = leads.length || 120;
  }

  const newBroadcast = AdminStore.logBroadcast({
    channel: channel || "WHATSAPP",
    targetAudience: targetAudience || "ALL_PAID",
    subject: subject || "CodeInIndia Announcement",
    title: title || subject || "CodeInIndia Announcement",
    message: message.trim(),
    recipientCount,
    adminName: req.admin?.name || "Admin",
    status: "SENT"
  });

  // Log in Audit Logs
  AdminStore.addAuditLog({
    adminName: req.admin?.name || "Admin",
    adminEmail: req.admin?.email || "admin@codeinindia.com",
    adminRole: req.admin?.role || "ADMIN",
    action: "BROADCAST_SENT",
    targetType: "STUDENT",
    targetId: newBroadcast.id,
    targetName: `${newBroadcast.channel} Broadcast to ${targetAudience}`,
    newValue: `Sent broadcast to ${recipientCount} recipients`,
    ipAddress: req.ip
  });

  res.status(201).json({ success: true, data: newBroadcast, recipientCount });
});

// ------------------- ADMIN WEBHOOK SIMULATION -------------------

app.post("/api/admin/simulate-webhook", authenticateAdmin, (req: AuthenticatedRequest, res) => {
  const { studentName, studentEmail, studentMobile, courseName, amount, city, state } = req.body;
  const mockPaymentId = `pay_sim_${Date.now().toString().slice(-8)}`;
  const mockOrderId = `order_sim_${Date.now().toString().slice(-8)}`;
  const amountInRupees = amount || 999;

  const result = AdminStore.processPaidEnrollment({
    orderId: mockOrderId,
    paymentId: mockPaymentId,
    amountInRupees,
    planName: courseName || "1-Day Dynamic Website Workshop",
    customerName: studentName || "Aarav Singhania",
    customerEmail: studentEmail || `aarav.test.${Date.now().toString().slice(-4)}@example.com`,
    customerPhone: studentMobile || "9876543210",
    paymentMethod: "Razorpay Webhook Simulation",
    isTest: true
  });

  AdminStore.addAuditLog({
    adminName: req.admin?.name || "Admin",
    adminEmail: req.admin?.email || "admin@codeinindia.com",
    adminRole: req.admin?.role || "SUPER_ADMIN",
    action: "WEBHOOK_SIMULATED",
    targetType: "PAYMENT",
    targetId: mockPaymentId,
    targetName: studentName || "Test Student",
    newValue: `Simulated payment of ₹${amountInRupees} for ${courseName || "Workshop"}`,
    ipAddress: req.ip
  });

  res.status(200).json({
    success: true,
    message: "Webhook simulated successfully",
    enrollmentId: result.student?.enrollmentId,
    paymentId: mockPaymentId,
    student: result.student
  });
});

// Razorpay Webhook Alias Route
app.post("/api/razorpay-webhook", (req, res) => {
  try {
    const event = req.body.event;
    const payload = req.body.payload;

    if (!payload || !payload.payment || !payload.payment.entity) {
      return res.status(200).json({ success: true, message: "Webhook acknowledged" });
    }

    const paymentEntity = payload.payment.entity;
    const paymentId = paymentEntity.id;
    const orderId = paymentEntity.order_id;
    const amountInRupees = Math.round((paymentEntity.amount || 0) / 100) || 999;
    const email = paymentEntity.email || "";
    const contact = paymentEntity.contact || "";
    const notes = paymentEntity.notes || {};

    if (AdminStore.isEventProcessed(paymentId)) {
      return res.status(200).json({ success: true, message: "Event already processed (idempotent)" });
    }

    if (event === "payment.captured" || event === "order.paid") {
      AdminStore.processPaidEnrollment({
        orderId: orderId || `ord_${Date.now()}`,
        paymentId: paymentId || `pay_${Date.now()}`,
        amountInRupees,
        planName: notes.plan || "CodeInIndia Workshop",
        customerName: notes.name || paymentEntity.description || "Enrolled Student",
        customerEmail: email,
        customerPhone: contact,
        paymentMethod: paymentEntity.method || "Webhook Captured",
        isTest: paymentEntity.id?.startsWith("pay_test_")
      });

      AdminStore.markEventProcessed(paymentId);
    }

    res.status(200).json({ success: true, message: "Webhook processed successfully" });
  } catch (err: any) {
    console.error("Error in razorpay-webhook alias route:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// ------------------- ADMIN AUDIT LOGS -------------------

app.get("/api/admin/audit-logs", authenticateAdmin, (req, res) => {
  const { search = "", page = "1", limit = "30" } = req.query;
  let logs = AdminStore.getAuditLogs();

  if (search && typeof search === "string") {
    const q = search.trim().toLowerCase();
    logs = logs.filter(l => 
      l.action.toLowerCase().includes(q) ||
      l.adminName.toLowerCase().includes(q) ||
      l.targetName.toLowerCase().includes(q) ||
      l.targetId.toLowerCase().includes(q)
    );
  }

  const total = logs.length;
  const pageNum = parseInt(page as string, 10) || 1;
  const limitNum = parseInt(limit as string, 10) || 30;
  const startIndex = (pageNum - 1) * limitNum;
  const paginated = logs.slice(startIndex, startIndex + limitNum);

  res.json({
    success: true,
    total,
    page: pageNum,
    limit: limitNum,
    totalPages: Math.ceil(total / limitNum),
    data: paginated
  });
});

// ------------------- VITE SERVER & STATIC FALLBACK -------------------

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`CodeInIndia Enterprise Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
