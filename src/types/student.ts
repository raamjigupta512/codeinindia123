export interface StudentProjectRepo {
  id: string;
  studentId: string;
  enrollmentId: string;
  title: string;
  phase: string;
  repoUrl: string;
  liveUrl?: string;
  techStack: string[];
  submittedAt: string;
  status: 'COMPLETED' | 'IN_PROGRESS' | 'SUBMITTED' | 'UNDER_REVIEW' | 'APPROVED' | 'NEEDS_REVISION';
  score?: number; // out of 10
  mentorFeedback?: string;
  mentorName?: string;
  reviewedAt?: string;
}

export interface StudentLiveSession {
  id: string;
  title: string;
  courseId: string;
  phase: string;
  date: string; // ISO date string e.g. "2026-02-21"
  time: string; // e.g. "08:00 PM - 10:00 PM IST"
  instructor: string;
  instructorRole: string;
  instructorAvatar: string;
  meetUrl: string;
  isUpcoming: boolean;
  isLiveNow?: boolean;
  recordingUrl?: string;
  recordingDuration?: string;
  prerequisites: string[];
  agenda: string[];
  resources: { name: string; url: string; type: 'code' | 'doc' | 'slides' }[];
}

export interface StudentModuleItem {
  id: string;
  weekNo: number;
  phase: string;
  title: string;
  description: string;
  deliverable: string;
  isCompleted: boolean;
  lessons: {
    id: string;
    title: string;
    duration: string;
    isDone: boolean;
    videoUrl?: string;
  }[];
  starterCodeUrl?: string;
  solutionCodeUrl?: string;
  cheatsheetUrl?: string;
}

export interface EnrolledStudentProfile {
  id: string;
  enrollmentId: string;
  fullName: string;
  email: string;
  mobile: string;
  courseId: string;
  courseName: string;
  batchName: string;
  enrollmentDate: string;
  progressPercent: number;
  completedModulesCount: number;
  totalModulesCount: number;
  attendanceStreak: number;
  certificateId?: string;
  certificateStatus?: 'NONE' | 'ELIGIBLE' | 'ISSUED';
  certificateUrl?: string;
  avatarUrl?: string;
  discordJoined?: boolean;
  whatsappJoined?: boolean;
}
