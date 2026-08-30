export interface TechStackItem {
  name: string;
  category: string;
}

export interface BuildCard {
  id: string;
  type: 'web' | 'saas' | 'app';
  title: string;
  description: string;
  tags: string[];
  techStack: TechStackItem[];
  deliverables: string;
}

export interface CurriculumWeek {
  weekNo: number;
  phase: string;
  title: string;
  description: string;
  shipProject: string;
  skillLevel: 'Beginner' | 'Intermediate' | 'Advanced';
}

export interface AudienceCard {
  emoji: string;
  title: string;
  description: string;
}

export interface Testimonial {
  initials: string;
  name: string;
  location: string;
  project: string;
  quote: string;
  stars: number;
}

export interface FaqItem {
  id: number;
  question: string;
  answer: string;
}

export const BUILD_CARDS: BuildCard[] = [
  {
    id: "dynamic-websites",
    type: "web",
    title: "Dynamic websites",
    description: "Business sites with admin panels, contact forms that actually deliver, booking systems, and content you can update without touching code.",
    tags: ["Next.js", "CMS", "Forms"],
    techStack: [
      { name: "Next.js / React", category: "Frontend" },
      { name: "Tailwind CSS", category: "Styling" },
      { name: "Sanity / Headless CMS", category: "Content" },
      { name: "Resend / Nodemailer", category: "Forms & Email" },
      { name: "Vercel / Cloudflare", category: "Deployment" }
    ],
    deliverables: "Custom client portfolio & dynamic lead generation engine"
  },
  {
    id: "saas-platforms",
    type: "saas",
    title: "SaaS platforms",
    description: "Subscription products with login, dashboards, Razorpay payments and user management — the exact stack behind products charging ₹499/month.",
    tags: ["Auth", "Payments", "Dashboards"],
    techStack: [
      { name: "React + TypeScript", category: "Frontend" },
      { name: "Node.js / Express", category: "Backend" },
      { name: "PostgreSQL / SQLite", category: "Database" },
      { name: "Razorpay / Stripe", category: "Billing" },
      { name: "JWT & OAuth2", category: "Authentication" }
    ],
    deliverables: "Recurring subscription SaaS with live billing checkout"
  },
  {
    id: "mobile-apps",
    type: "app",
    title: "Mobile apps",
    description: "Android-ready apps from a single codebase — installable, push-notification capable, and publishable to the Play Store.",
    tags: ["Flutter", "PWA", "Play Store"],
    techStack: [
      { name: "React Native / Flutter", category: "Framework" },
      { name: "Capacitor / PWA", category: "Packaging" },
      { name: "Firebase Cloud Messaging", category: "Push Alerts" },
      { name: "Local SQLite / Cache", category: "Offline Sync" },
      { name: "Google Play Console", category: "Distribution" }
    ],
    deliverables: "Deployable APK / installable PWA with push notification system"
  }
];

export const CURRICULUM_WEEKS: CurriculumWeek[] = [
  {
    weekNo: 1,
    phase: "FOUNDATIONS",
    title: "Think in code, build with AI",
    description: "How the web actually works, HTML/CSS/JS essentials, and the AI pair-coding workflow that lets you build 10× faster than tutorial-followers. You'll set up your tools and go from blank folder to a live site.",
    shipProject: "your personal site, live on a real domain",
    skillLevel: "Beginner"
  },
  {
    weekNo: 2,
    phase: "FULL-STACK",
    title: "Dynamic websites with databases",
    description: "Next.js, databases, and authentication — the difference between a brochure and a product. Forms that store data, pages that change per user, admin panels your clients will pay for.",
    shipProject: "a client-ready business site with admin panel",
    skillLevel: "Intermediate"
  },
  {
    weekNo: 3,
    phase: "SAAS",
    title: "Payments, subscriptions, dashboards",
    description: "Razorpay integration, subscription logic, usage limits and customer dashboards. We build a complete micro-SaaS together, then you adapt it to your own idea.",
    shipProject: "a working SaaS that can accept real payments",
    skillLevel: "Advanced"
  },
  {
    weekNo: 4,
    phase: "APPS + LAUNCH",
    title: "Mobile apps and getting users",
    description: "Turn your product into an installable app with Flutter and PWA techniques, then the launch playbook: domains, SEO basics, WhatsApp marketing, and landing your first paying user or client.",
    shipProject: "an installable app + your launch announcement",
    skillLevel: "Intermediate"
  }
];

export const AUDIENCE_CARDS: AudienceCard[] = [
  {
    emoji: "🎓",
    title: "Students",
    description: "Graduate with a live portfolio instead of just marks."
  },
  {
    emoji: "💼",
    title: "Working professionals",
    description: "Add a skill that pays — freelance after hours or switch careers."
  },
  {
    emoji: "🚀",
    title: "Founders & dreamers",
    description: "Build your MVP yourself instead of paying ₹3 lakh to an agency."
  },
  {
    emoji: "🏪",
    title: "Business owners",
    description: "Take your shop, coaching or service online — and own the code."
  }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    initials: "PK",
    name: "Priya K.",
    location: "Jaipur",
    project: "Clinic booking site",
    quote: "I'm a commerce graduate — never wrote code in my life. In week 2 I built a booking site for my father's clinic. Patients actually use it daily now.",
    stars: 5
  },
  {
    initials: "AR",
    name: "Arjun R.",
    location: "Pune",
    project: "Freelance developer",
    quote: "Closed my first freelance client for ₹35,000 three weeks after the cohort. The AI workflow they teach is the real cheat code — I deliver in days, not months.",
    stars: 5
  },
  {
    initials: "SM",
    name: "Sana M.",
    location: "Lucknow",
    project: "Micro-SaaS founder",
    quote: "My tiffin-service SaaS has 40 paying subscribers. I built the whole thing myself — payments, dashboard, everything — from what we covered in week 3.",
    stars: 5
  }
];

export const FAQ_ITEMS: FaqItem[] = [
  {
    id: 1,
    question: "I have zero coding background. Can I really do this?",
    answer: "Yes — the course is designed for absolute beginners. We start from how the internet works and use AI-assisted coding, which means you describe what you want in plain language and learn to shape, fix and understand the code it produces. Most of our best students started from zero."
  },
  {
    id: 2,
    question: "Is the class in Hindi or English?",
    answer: "Both — instruction is in easy Hinglish (Hindi explanation, English technical terms), so you learn the vocabulary the industry actually uses while understanding every concept comfortably."
  },
  {
    id: 3,
    question: "What do I need? Do I need a powerful laptop?",
    answer: "Any laptop from the last 6–7 years with 4GB+ RAM and an internet connection works. All tools we use are free or have free tiers. A phone is enough to attend, but you'll need a laptop to build along."
  },
  {
    id: 4,
    question: "What if I miss a live class?",
    answer: "Every session is recorded and uploaded the same day, and you keep lifetime access. Weekly doubt sessions cover anything you couldn't follow."
  },
  {
    id: 5,
    question: "Will I get a certificate?",
    answer: "Yes. The masterclass includes a participation certificate; the full cohort includes a verified completion certificate with a shareable LinkedIn badge — plus something better: live project links for your portfolio."
  },
  {
    id: 6,
    question: "Can I actually earn after this?",
    answer: "The skills — dynamic sites, SaaS with payments, apps — are exactly what Indian SMEs pay ₹20,000–₹2,00,000 for per project. Week 4 covers finding clients and pricing. We can't promise income (no honest course can), but we give you the complete toolkit our own agency work is built on."
  },
  {
    id: 7,
    question: "What's the refund policy?",
    answer: "Reserving your seat is completely free! If you opt into any paid advanced mentoring later and feel it's not for you within 24 hours of the first class, we offer a 100% full refund policy with no questions asked."
  }
];
