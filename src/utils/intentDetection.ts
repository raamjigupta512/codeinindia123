export interface PersonaIntent {
  id: string;
  badge: string;
  eyebrow: string;
  subheading: string;
  highlightTag: string;
  description: string;
  recommendedFocus: string;
  ctaText: string;
}

export const PERSONA_INTENTS: Record<string, PersonaIntent> = {
  default: {
    id: 'default',
    badge: 'Open to All Builders',
    eyebrow: 'Zero prerequisites needed',
    subheading: 'Learn to build dynamic websites, SaaS platforms and mobile apps with AI-assisted coding — live, step by step, in a language you think in. By the end of week one, your first project is on the internet.',
    highlightTag: 'Live Interactive Cohort',
    description: 'For aspiring builders, developers, and creators ready to ship real production software.',
    recommendedFocus: 'Web Apps, SaaS & Mobile Deployment',
    ctaText: 'Reserve my seat'
  },
  career_changer: {
    id: 'career_changer',
    badge: 'For Career Changers & Tech Transitioners',
    eyebrow: 'Fast-Track Career Switch to AI & Web Dev',
    subheading: 'Transition into high-paying software and AI product roles without spending years on syntax theory. Build live, verifiable web apps and portfolio proof that hiring managers can test immediately.',
    highlightTag: 'Industry-Ready Portfolio',
    description: 'Designed specifically for working professionals shifting into software engineering and modern AI development.',
    recommendedFocus: 'Full-Stack Web, Express DB & Production SaaS',
    ctaText: 'Launch your tech career'
  },
  student_builder: {
    id: 'student_builder',
    badge: 'For Student Builders & College Devs',
    eyebrow: 'Stand Out in Campus Placements & Internships',
    subheading: 'Skip outdated college theory and generic clones. Build 3 production-grade applications with modern AI tools, deploy them live, and gain an unfair advantage for top tech internships and job offers.',
    highlightTag: 'Internship & Placement Edge',
    description: 'Perfect for college students building proof of work that beats traditional CS resumes.',
    recommendedFocus: 'Live Web Products, REST APIs & Mobile Apps',
    ctaText: 'Build student portfolio'
  },
  founder: {
    id: 'founder',
    badge: 'For Startup Founders & Solopreneurs',
    eyebrow: 'Ship Your MVP Without Expensive Dev Agencies',
    subheading: 'Turn your startup ideas into revenue-generating SaaS products and customer-facing apps in days. Master AI-assisted coding to build, iterate, and deploy your business features at 10x speed.',
    highlightTag: 'Rapid MVP Execution',
    description: 'Engineered for founders and entrepreneurs who want to build and own their product roadmap.',
    recommendedFocus: 'Micro-SaaS, Payment Flows & Database Architecture',
    ctaText: 'Build your startup MVP'
  },
  freelancer: {
    id: 'freelancer',
    badge: 'For Freelancers & Agency Builders',
    eyebrow: 'Charge Higher Rates with Custom Web & AI Apps',
    subheading: 'Upgrade your freelance offerings beyond static templates. Deliver full-stack web applications, AI automations, and custom client dashboards that command premium retainer contracts.',
    highlightTag: 'High-Ticket Client Deliverables',
    description: 'For freelancers looking to scale their income by delivering complex full-stack web & mobile apps.',
    recommendedFocus: 'Full-Stack Apps, Client Portals & WhatsApp Automations',
    ctaText: 'Upgrade client services'
  },
  non_tech: {
    id: 'non_tech',
    badge: 'For First-Time Builders (No-Code/Non-Tech)',
    eyebrow: 'No Computer Science Degree Required',
    subheading: 'You do not need prior programming background to create software anymore. Learn to command AI coding tools step-by-step in clear Hindi + English, turning your everyday ideas into live working applications.',
    highlightTag: 'Beginner-Friendly AI Workflows',
    description: 'Built for non-technical creators taking their first step into software creation with modern AI.',
    recommendedFocus: 'Prompt-Driven Development & 1-Click Hosting',
    ctaText: 'Start building from scratch'
  }
};

/**
 * Detects user intent by checking URL parameters (UTM tags, intent, role, persona, ref)
 */
export function detectUserIntent(): { intent: PersonaIntent; detectedParam: string | null } {
  if (typeof window === 'undefined') {
    return { intent: PERSONA_INTENTS.default, detectedParam: null };
  }

  try {
    const params = new URLSearchParams(window.location.search);
    
    // Check various URL query parameters commonly used in marketing campaigns
    const candidateKeys = [
      'intent',
      'persona',
      'role',
      'audience',
      'utm_campaign',
      'utm_content',
      'utm_source',
      'utm_term',
      'ref'
    ];

    for (const key of candidateKeys) {
      const val = params.get(key)?.toLowerCase().trim();
      if (!val) continue;

      // Career changer patterns
      if (
        val.includes('career') || 
        val.includes('switch') || 
        val.includes('job') || 
        val.includes('hiring') || 
        val.includes('transition') || 
        val.includes('working_pro') ||
        val.includes('professional')
      ) {
        return { intent: PERSONA_INTENTS.career_changer, detectedParam: `${key}=${val}` };
      }

      // Student patterns
      if (
        val.includes('student') || 
        val.includes('college') || 
        val.includes('campus') || 
        val.includes('placement') || 
        val.includes('intern') || 
        val.includes('university') ||
        val.includes('grad')
      ) {
        return { intent: PERSONA_INTENTS.student_builder, detectedParam: `${key}=${val}` };
      }

      // Founder / Solopreneur patterns
      if (
        val.includes('founder') || 
        val.includes('startup') || 
        val.includes('saas') || 
        val.includes('mvp') || 
        val.includes('entrepreneur') || 
        val.includes('builder') ||
        val.includes('business')
      ) {
        return { intent: PERSONA_INTENTS.founder, detectedParam: `${key}=${val}` };
      }

      // Freelancer patterns
      if (
        val.includes('freelance') || 
        val.includes('agency') || 
        val.includes('client') || 
        val.includes('upwork') || 
        val.includes('fiverr') || 
        val.includes('contractor')
      ) {
        return { intent: PERSONA_INTENTS.freelancer, detectedParam: `${key}=${val}` };
      }

      // Non-tech / Beginner patterns
      if (
        val.includes('non-tech') || 
        val.includes('nontech') || 
        val.includes('beginner') || 
        val.includes('nocode') || 
        val.includes('no-code') || 
        val.includes('first-time') ||
        val.includes('zero')
      ) {
        return { intent: PERSONA_INTENTS.non_tech, detectedParam: `${key}=${val}` };
      }
    }
  } catch {
    // Graceful fallback on error
  }

  return { intent: PERSONA_INTENTS.default, detectedParam: null };
}
