import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ExternalLink, 
  Github, 
  Eye, 
  User, 
  MapPin, 
  Sparkles, 
  Calendar,
  X,
  Laptop,
  CheckCircle2,
  Code2
} from 'lucide-react';

import saasDashboardImg from '../assets/images/student_saas_dashboard_1783612521159.jpg';
import flowchartCanvasImg from '../assets/images/student_flowchart_canvas_1783612536457.jpg';
import devTerminalImg from '../assets/images/student_dev_terminal_1783612551687.jpg';
import travelMobileImg from '../assets/images/student_travel_mobile_1783612563975.jpg';
import aiChatbotImg from '../assets/images/student_ai_chatbot_1783612582366.jpg';
import habitTrackerImg from '../assets/images/student_habit_tracker_1783612597311.jpg';

interface StudentProject {
  id: string;
  title: string;
  creator: string;
  location: string;
  week: number;
  tags: string[];
  image: string;
  description: string;
  techStack: string[];
  creatorInitial: string;
  highlights: string[];
}

const PROJECTS: StudentProject[] = [
  {
    id: "saas-analytics",
    title: "SaaS Analytics Engine",
    creator: "Rohan Sharma",
    location: "Delhi",
    week: 3,
    tags: ["SaaS", "Recharts", "Auth"],
    image: saasDashboardImg,
    description: "A gorgeous, fully-responsive SaaS dashboard tracking real-time user behavior, pageviews, and revenue analytics with visual bento grids.",
    techStack: ["Next.js", "PostgreSQL", "Drizzle ORM", "Recharts"],
    creatorInitial: "R",
    highlights: ["Live chart interactions", "CSV data export capabilities", "JWT session authentication"]
  },
  {
    id: "flowchart-canvas",
    title: "SketchBoard AI",
    creator: "Priya Patel",
    location: "Mumbai",
    week: 2,
    tags: ["Canvas", "Interactive", "AI Tool"],
    image: flowchartCanvasImg,
    description: "An infinite collaborative whiteboard flowchart builder utilizing standard HTML5 Canvas, pathfinding connector lines, and AI layout suggestions.",
    techStack: ["React", "HTML5 Canvas", "Tailwind CSS", "Gemini API"],
    creatorInitial: "P",
    highlights: ["Infinite panning and zoom grid", "Interactive node drag-and-drop", "Real-time layout saving"]
  },
  {
    id: "dev-terminal",
    title: "DevSpace Sandbox",
    creator: "Kabir Mehta",
    location: "Bangalore",
    week: 1,
    tags: ["Terminal", "Web Sandbox", "UI"],
    image: devTerminalImg,
    description: "An interactive, fully-functional web-based developer portfolio framing a real mock Linux shell with responsive developer command execution.",
    techStack: ["Vite", "TypeScript", "Tailwind CSS", "Web Terminals"],
    creatorInitial: "K",
    highlights: ["Mock terminal filesystem with 15+ commands", "Live system stats visualization", "Beautiful retro styling theme"]
  },
  {
    id: "travel-mobile",
    title: "Ghumo India Guide",
    creator: "Ananya Sen",
    location: "Kolkata",
    week: 4,
    tags: ["Mobile", "PWA", "Travel"],
    image: travelMobileImg,
    description: "A localized curation platform and installable travel guide for finding hidden aesthetic cafes, historic spots, and curated itineraries.",
    techStack: ["Flutter Web", "Firebase Firestore", "Google Maps Platform"],
    creatorInitial: "A",
    highlights: ["Offline caching capabilities", "Interactive map markers integration", "One-click installable PWA badge"]
  },
  {
    id: "ai-companion",
    title: "Mitra AI Chatbot",
    creator: "Vikram Aditya",
    location: "Pune",
    week: 3,
    tags: ["AI Chat", "UX", "Responsive"],
    image: aiChatbotImg,
    description: "A beautiful personalized conversational web companion featuring auto-generated category tags and secure local chat persistence.",
    techStack: ["React", "Express.js", "Google GenAI SDK", "Tailwind CSS"],
    creatorInitial: "V",
    highlights: ["Custom system instructions settings", "Animated message bubble transitions", "Export to PDF feature"]
  },
  {
    id: "habit-tracker",
    title: "StreakStar Habits",
    creator: "Sneha Reddy",
    location: "Hyderabad",
    week: 2,
    tags: ["SaaS", "Gamified", "Database"],
    image: habitTrackerImg,
    description: "A highly visual productivity habit tracker displaying custom streak heatmaps, colorful reward animations, and daily goal checklists.",
    techStack: ["Next.js", "Supabase", "Tailwind CSS", "Framer Motion"],
    creatorInitial: "S",
    highlights: ["GitHub-style contributions grid", "Custom sound effects on completion", "Dynamic progression level badge"]
  }
];

export default function StudentShowcase() {
  const [selectedProject, setSelectedProject] = useState<StudentProject | null>(null);

  return (
    <section id="showcase" className="py-20 md:py-24 bg-paper relative overflow-hidden border-t border-border-custom">
      {/* Background glow accents */}
      <div className="absolute top-[-250px] left-[-200px] w-[600px] h-[600px] rounded-full bg-gradient-to-br from-peacock/5 to-transparent pointer-events-none blur-3xl" />
      <div className="absolute bottom-[-250px] right-[-200px] w-[600px] h-[600px] rounded-full bg-gradient-to-br from-marigold/5 to-transparent pointer-events-none blur-3xl" />

      <div className="wrap">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="eyebrow-line">Proof in action</span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-extrabold text-ink mb-4 mt-1 leading-tight">
            Student Showcase
          </h2>
          <p className="text-muted text-[1.08rem] leading-relaxed">
            See the actual production-ready websites and apps designed, built, and shipped live by past students of our cohort.
          </p>
        </div>

        {/* Project Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" id="student-projects-grid">
          {PROJECTS.map((project, idx) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="group bg-card border border-border-custom rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:border-peacock/30 transition-all duration-300 flex flex-col justify-between"
              id={`project-card-${project.id}`}
            >
              <div>
                {/* Image Container with Hover Effects */}
                <div className="relative aspect-[4/3] overflow-hidden bg-muted select-none border-b border-border-custom/50">
                  <img
                    src={project.image}
                    alt={project.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transform scale-100 group-hover:scale-105 transition-transform duration-500 ease-out"
                  />
                  
                  {/* Subtle Top-Right Week Badge */}
                  <div className="absolute top-3.5 right-3.5 z-10 font-mono text-[0.68rem] font-bold bg-ink text-white/95 px-2.5 py-1 rounded-md shadow-sm border border-white/10 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-marigold-deep dark:text-marigold" />
                    <span>Week {project.week}</span>
                  </div>

                  {/* Elegant Dark Overlay with Call to Actions on Hover */}
                  <div className="absolute inset-0 bg-ink/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
                    <button
                      onClick={() => setSelectedProject(project)}
                      className="bg-white hover:bg-marigold text-ink hover:text-ink font-semibold py-2.5 px-4.5 rounded-full text-xs flex items-center gap-1.5 shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 cursor-pointer"
                      type="button"
                    >
                      <Eye className="w-4 h-4" />
                      <span>Inspect Project</span>
                    </button>
                  </div>
                </div>

                {/* Info block */}
                <div className="p-6">
                  {/* Title & Creator */}
                  <div className="flex items-start justify-between gap-2.5 mb-2.5">
                    <h3 className="font-display font-extrabold text-lg text-ink group-hover:text-peacock transition-colors leading-snug">
                      {project.title}
                    </h3>
                  </div>

                  <p className="text-muted text-[0.88rem] leading-relaxed mb-5 line-clamp-2">
                    {project.description}
                  </p>

                  {/* Creator Identity */}
                  <div className="flex items-center gap-2.5 border-t border-border-custom/40 pt-4 mb-4">
                    <div className="w-[30px] h-[30px] rounded-full bg-peacock/10 text-peacock font-display font-bold text-xs flex items-center justify-center select-none">
                      {project.creatorInitial}
                    </div>
                    <div className="text-[0.82rem] leading-none">
                      <span className="block font-bold text-ink">{project.creator}</span>
                      <span className="text-muted inline-flex items-center gap-0.5 mt-1">
                        <MapPin className="w-3 h-3 flex-none" /> {project.location}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tag Footer */}
              <div className="px-6 pb-6 pt-0 flex flex-wrap gap-1.5 mt-auto">
                {project.tags.map(tag => (
                  <span 
                    key={tag}
                    className="font-mono text-[0.66rem] font-bold text-peacock bg-peacock/5 border border-peacock/10 py-0.5 px-2.5 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Interactive Project Inspector Modal */}
      <AnimatePresence>
        {selectedProject && (
          <div className="fixed inset-0 z-50 overflow-y-auto" id="project-inspector-modal">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProject(null)}
              className="fixed inset-0 bg-ink/80 backdrop-blur-md"
            />

            {/* Modal Container */}
            <div className="flex min-h-full items-center justify-center p-4 sm:p-6 md:p-10 relative z-10">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 15 }}
                transition={{ type: "spring", duration: 0.5 }}
                className="w-full max-w-4xl bg-card border border-border-custom rounded-2xl overflow-hidden shadow-2xl relative"
              >
                {/* Close Button */}
                <button
                  onClick={() => setSelectedProject(null)}
                  className="absolute top-4 right-4 z-20 bg-ink/70 hover:bg-ink text-white/80 hover:text-white p-2 rounded-full transition-all cursor-pointer shadow"
                  type="button"
                >
                  <X className="w-4 h-4" />
                </button>

                {/* Grid Layout inside Modal */}
                <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr]">
                  {/* Left Column: Live Mockup Frame */}
                  <div className="bg-muted p-5 sm:p-8 flex flex-col justify-center border-b lg:border-b-0 lg:border-r border-border-custom">
                    {/* Browser Shell Mockup */}
                    <div className="bg-[#1E2030] rounded-xl shadow-xl border border-white/5 overflow-hidden w-full max-w-md mx-auto">
                      {/* Browser Header */}
                      <div className="bg-[#141522] px-4 py-3 flex items-center justify-between border-b border-white/5 select-none">
                        <div className="flex gap-1.5">
                          <span className="w-3 h-3 rounded-full bg-rose-500/80"></span>
                          <span className="w-3 h-3 rounded-full bg-amber-500/80"></span>
                          <span className="w-3 h-3 rounded-full bg-emerald-500/80"></span>
                        </div>
                        <div className="bg-[#1C1D2F] text-white/55 font-mono text-[0.64rem] px-3 py-1 rounded-md w-[200px] text-center truncate flex items-center justify-center gap-1 border border-white/5">
                          <Laptop className="w-3 h-3" />
                          <span>{selectedProject.id}.codeinindia.dev</span>
                        </div>
                        <div className="w-10"></div>
                      </div>

                      {/* Browser Content Screenshot */}
                      <div className="relative aspect-[4/3] overflow-hidden">
                        <img
                          src={selectedProject.image}
                          alt={selectedProject.title}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                        {/* Simulation Success Badge overlay */}
                        <div className="absolute inset-0 bg-ink/10 flex items-end p-4">
                          <div className="bg-emerald-500 text-white font-sans text-[0.72rem] font-bold py-1 px-2.5 rounded-full shadow border border-emerald-400 flex items-center gap-1 animate-bounce">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Live Shipped Link Sandbox</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="text-center mt-4">
                      <span className="text-xs text-muted font-mono">
                        Week {selectedProject.week} Deliverable Portfolio Mockup
                      </span>
                    </div>
                  </div>

                  {/* Right Column: Content Details */}
                  <div className="p-6 sm:p-8 flex flex-col justify-between">
                    <div>
                      {/* Category Badge & Week */}
                      <div className="flex items-center gap-2 mb-4">
                        <span className="bg-peacock/10 text-peacock font-mono text-[0.7rem] font-bold py-1 px-3 rounded-full uppercase tracking-wider">
                          Week {selectedProject.week} Build
                        </span>
                        <span className="text-muted text-xs font-medium flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-marigold-deep dark:text-marigold" />
                          <span>Delivered July 2026</span>
                        </span>
                      </div>

                      {/* Project Title */}
                      <h3 className="font-display font-extrabold text-2xl text-ink mb-3 leading-tight">
                        {selectedProject.title}
                      </h3>

                      {/* Creator Info */}
                      <div className="flex items-center gap-2.5 mb-5 bg-paper/60 border border-border-custom rounded-xl p-3">
                        <div className="w-[34px] h-[34px] rounded-full bg-peacock text-white font-display font-bold text-sm flex items-center justify-center select-none">
                          {selectedProject.creatorInitial}
                        </div>
                        <div className="text-[0.84rem] leading-none">
                          <span className="block font-bold text-ink">{selectedProject.creator}</span>
                          <span className="text-muted inline-flex items-center gap-0.5 mt-1.5 font-medium">
                            <MapPin className="w-3 h-3 flex-none text-muted" /> {selectedProject.location}
                          </span>
                        </div>
                      </div>

                      {/* Project Description */}
                      <p className="text-ink-soft text-[0.93rem] leading-relaxed mb-6">
                        {selectedProject.description}
                      </p>

                      {/* Key Highlights */}
                      <div className="space-y-2.5 mb-6">
                        <h4 className="font-sans font-extrabold text-xs text-ink uppercase tracking-wide flex items-center gap-1">
                          <Sparkles className="w-3.5 h-3.5 text-marigold-deep dark:text-marigold" /> Key Features Implemented
                        </h4>
                        <ul className="space-y-2">
                          {selectedProject.highlights.map((highlight, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-xs text-muted leading-relaxed">
                              <span className="text-peacock font-bold mt-0.5">✓</span>
                              <span>{highlight}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Technical Stack */}
                      <div className="space-y-2.5">
                        <h4 className="font-sans font-extrabold text-xs text-ink uppercase tracking-wide flex items-center gap-1">
                          <Code2 className="w-3.5 h-3.5 text-peacock" /> Technology Stack
                        </h4>
                        <div className="flex flex-wrap gap-1.5">
                          {selectedProject.techStack.map(tech => (
                            <span 
                              key={tech} 
                              className="font-mono text-[0.72rem] font-semibold text-ink-soft bg-paper border border-border-custom py-1 px-3 rounded"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Bottom CTA Actions */}
                    <div className="pt-8 border-t border-border-custom/50 flex flex-col sm:flex-row gap-3 mt-6">
                      <a
                        href="#register"
                        onClick={() => {
                          setSelectedProject(null);
                          document.getElementById('register')?.scrollIntoView({ behavior: 'smooth' });
                        }}
                        className="btn btn-primary py-3 px-5 text-center flex items-center justify-center gap-2 text-xs font-extrabold cursor-pointer flex-1"
                      >
                        <span>Learn to build this</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
