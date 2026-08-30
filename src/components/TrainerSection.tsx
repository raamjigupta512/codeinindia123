import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Briefcase, 
  GraduationCap, 
  Award, 
  Cpu, 
  Sparkles, 
  Code2, 
  Quote, 
  BookOpen, 
  MessageSquare,
  ShieldCheck,
  CheckCircle2,
  ChevronRight,
  Terminal,
  Server
} from 'lucide-react';

import trainerImg from '../assets/images/trainer_portrait_manav_1783769967610.jpg';

interface TrainerTab {
  id: string;
  label: string;
  icon: React.ReactNode;
}

export default function TrainerSection() {
  const [activeTab, setActiveTab] = useState<'journey' | 'industry' | 'philosophy' | 'tech'>('journey');

  const stats = [
    { value: '20+ Yrs', label: 'Industry Veteran', description: 'Systems & AI design' },
    { value: 'Top 50', label: 'Global Company', description: 'AI Solutions Architect' },
    { value: '1,200+', label: 'Students Guided', description: 'To developer roles' },
    { value: '100%', label: 'Hands-on Code', description: 'No dry theoretical slides' }
  ];

  const tabs: TrainerTab[] = [
    { id: 'journey', label: 'His Journey', icon: <GraduationCap className="w-4 h-4" /> },
    { id: 'industry', label: 'AI & Enterprise Work', icon: <Cpu className="w-4 h-4" /> },
    { id: 'philosophy', label: 'Teaching Philosophy', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'tech', label: 'Trainer Tech Stack', icon: <Code2 className="w-4 h-4" /> }
  ];

  return (
    <section id="trainer-profile" className="py-20 md:py-24 bg-ink text-white relative overflow-hidden">
      {/* Visual background accents */}
      <div className="absolute top-[-300px] right-[-300px] w-[800px] h-[800px] rounded-full bg-gradient-to-br from-marigold/10 to-transparent pointer-events-none blur-3xl" />
      <div className="absolute bottom-[-300px] left-[-300px] w-[800px] h-[800px] rounded-full bg-gradient-to-br from-peacock/10 to-transparent pointer-events-none blur-3xl" />

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

      <div className="wrap relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="eyebrow-line text-marigold" style={{ color: 'var(--color-marigold)' }}>Meet Your Mentor</span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-extrabold text-white mb-4 mt-1 leading-tight">
            Know the Trainer
          </h2>
          <p className="text-[#B9C1DC] text-[1.05rem] leading-relaxed">
            Learn directly from an active industry practitioner designing next-generation systems at a global scale.
          </p>
        </div>

        {/* Master Row Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-12 lg:gap-16 items-start">
          
          {/* LEFT COLUMN: Trainer Card & Quote */}
          <div className="space-y-6 lg:sticky lg:top-24">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="bg-[#19223D] border border-[#2D3C66] rounded-3xl p-5 shadow-2xl relative group overflow-hidden"
            >
              {/* Profile Image with subtle outline */}
              <div className="aspect-square w-full rounded-2xl overflow-hidden relative border border-[#3E528B] bg-slate-900 mb-6 select-none">
                <img 
                  src={trainerImg} 
                  alt="Manav - AI Architect & Trainer" 
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transform scale-100 group-hover:scale-103 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/10 to-transparent opacity-60" />
                
                {/* Active Role tag on image overlay */}
                <span className="absolute bottom-4 left-4 bg-marigold text-ink font-mono text-[0.68rem] font-bold px-3 py-1.5 rounded-md shadow-lg flex items-center gap-1.5 border border-marigold/20">
                  <span className="w-2 h-2 rounded-full bg-ink animate-ping" />
                  <span>ACTIVE ARCHITECT</span>
                </span>
              </div>

              {/* Bio Highlights */}
              <div className="space-y-1.5 text-center lg:text-left">
                <h3 className="font-display text-2xl font-black text-white flex items-center justify-center lg:justify-start gap-2">
                  <span>Manav</span>
                  <Sparkles className="w-5 h-5 text-marigold" />
                </h3>
                <p className="text-marigold font-semibold text-sm">AI Solution Architect & Lead Instructor</p>
                <p className="text-[#8A93B5] text-[0.8rem] leading-relaxed pt-2 border-t border-[#233052] mt-3">
                  Designing enterprise AI systems by day; empowering the next generation of engineers by weekend.
                </p>
              </div>
            </motion.div>

            {/* Quick Quote Card */}
            <div className="bg-[#121A31] border border-[#233052] rounded-2xl p-6 relative">
              <Quote className="w-10 h-10 text-[#2C3E75] absolute top-4 right-4 pointer-events-none" />
              <p className="text-[#B9C1DC] text-xs italic leading-relaxed relative z-10">
                "The technology landscape of 2026 demands creators, not consumers. Tutorial-hell teaches you syntax; we teach you the collaborative, AI-augmented product engineering mindset that high-growth tech firms actively pay premium salaries for."
              </p>
              <div className="mt-3.5 flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-marigold" />
                <span className="font-mono text-[0.68rem] font-bold text-white/60 uppercase tracking-wide">Trainer Credo</span>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Interactive Tabs Content */}
          <div className="space-y-10">
            {/* Tabs Navigation */}
            <div className="flex flex-wrap gap-2 border-b border-[#233052] pb-4 select-none">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer border ${
                    activeTab === tab.id
                      ? 'bg-marigold text-ink border-marigold font-black shadow-lg shadow-marigold/10'
                      : 'bg-[#151D35] text-[#8A93B5] hover:text-[#EDEFF8] border-transparent hover:border-[#2D3C66]'
                  }`}
                  type="button"
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>

            {/* Tab Body Contents */}
            <div className="min-h-[280px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-6"
                >
                  {/* TAB 1: JOURNEY */}
                  {activeTab === 'journey' && (
                    <div className="space-y-6">
                      <div className="space-y-3">
                        <h4 className="font-display text-xl font-bold text-white flex items-center gap-2">
                          <span className="text-marigold">01.</span> From Core Software Engineer to AI Leader
                        </h4>
                        <p className="text-[#B9C1DC] text-[0.98rem] leading-relaxed">
                          Over a stellar career spanning more than two decades, Manav has built complex backend systems, highly-scaled cloud deployments, and sophisticated machine learning pipelines. He didn't learn system design from textbooks — he lived through the architecture shifts from monoliths to microservices, and now to sovereign generative models.
                        </p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                        <div className="p-4 bg-[#141B30] border border-[#233052] rounded-xl flex gap-3">
                          <Briefcase className="w-5 h-5 text-marigold flex-none mt-1" />
                          <div>
                            <h5 className="font-bold text-xs uppercase tracking-wider text-white">Active Architecture</h5>
                            <p className="text-[#8A93B5] text-[0.82rem] mt-1 leading-relaxed">
                              He works with multi-billion parameter LLMs, pipeline scaling, and cognitive routing agents daily.
                            </p>
                          </div>
                        </div>

                        <div className="p-4 bg-[#141B30] border border-[#233052] rounded-xl flex gap-3">
                          <GraduationCap className="w-5 h-5 text-marigold flex-none mt-1" />
                          <div>
                            <h5 className="font-bold text-xs uppercase tracking-wider text-white">Pragmatic Pedagogy</h5>
                            <p className="text-[#8A93B5] text-[0.82rem] mt-1 leading-relaxed">
                              Over 1,200 students successfully trained and transition-mapped into full-stack and web engineering.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* TAB 2: INDUSTRY WORK */}
                  {activeTab === 'industry' && (
                    <div className="space-y-6">
                      <div className="space-y-3">
                        <h4 className="font-display text-xl font-bold text-white flex items-center gap-2">
                          <span className="text-marigold">02.</span> AI Solution Architecture in 2026
                        </h4>
                        <p className="text-[#B9C1DC] text-[0.98rem] leading-relaxed">
                          By day, Manav designs and delivers mission-critical AI integrations for a global giant ranked in the top 50 worldwide. His technical portfolio focuses on highly available APIs, low-latency LLM agent networks, semantic searching paradigms, and database migrations.
                        </p>
                      </div>

                      {/* Achievements items */}
                      <div className="space-y-3">
                        <div className="flex gap-3 items-start p-3 bg-[#111728]/80 border border-[#233052] rounded-xl">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-1 flex-none" />
                          <span className="text-xs text-[#B9C1DC] leading-relaxed">
                            <strong>Multi-agent AI Frameworks</strong>: Designed complex cognitive loops coordinating multiple model nodes with custom tooling schemas.
                          </span>
                        </div>
                        <div className="flex gap-3 items-start p-3 bg-[#111728]/80 border border-[#233052] rounded-xl">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-1 flex-none" />
                          <span className="text-xs text-[#B9C1DC] leading-relaxed">
                            <strong>Global Cloud Architecture</strong>: Engineered robust deployments serving millions of requests across multiple geographical regions.
                          </span>
                        </div>
                        <div className="flex gap-3 items-start p-3 bg-[#111728]/80 border border-[#233052] rounded-xl">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-1 flex-none" />
                          <span className="text-xs text-[#B9C1DC] leading-relaxed">
                            <strong>Next-Gen Database Tuning</strong>: Optimized highly performant SQL and Vector Database architectures for enterprise search operations.
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* TAB 3: PHILOSOPHY */}
                  {activeTab === 'philosophy' && (
                    <div className="space-y-6">
                      <div className="space-y-3">
                        <h4 className="font-display text-xl font-bold text-white flex items-center gap-2">
                          <span className="text-marigold">03.</span> Teaching the Modern, AI-Augmented Workflow
                        </h4>
                        <p className="text-[#B9C1DC] text-[0.98rem] leading-relaxed">
                          "Traditional bootcamps are broken. They forbid you from using AI assistants, pretending we still live in 2012. In the real industry, elite developers write code collaboratively with agents. I teach you how to write code 10x faster using LLM design frameworks while retaining absolute control over your typescript structures and database schema architectures."
                        </p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="p-3.5 bg-[#141B30] border border-[#233052] rounded-xl text-center">
                          <Terminal className="w-5 h-5 text-marigold mx-auto mb-2" />
                          <h6 className="font-bold text-xs text-white">Realistic Terminals</h6>
                          <p className="text-[#8A93B5] text-[0.74rem] mt-1">Learn to write and deploy absolute real shell code, not visual play blocks.</p>
                        </div>
                        <div className="p-3.5 bg-[#141B30] border border-[#233052] rounded-xl text-center">
                          <Server className="w-5 h-5 text-marigold mx-auto mb-2" />
                          <h6 className="font-bold text-xs text-white">Full-Stack Truths</h6>
                          <p className="text-[#8A93B5] text-[0.74rem] mt-1">Deploy client frontends paired to real cloud backends with proper DB connections.</p>
                        </div>
                        <div className="p-3.5 bg-[#141B30] border border-[#233052] rounded-xl text-center">
                          <ShieldCheck className="w-5 h-5 text-marigold mx-auto mb-2" />
                          <h6 className="font-bold text-xs text-white">Career Alignment</h6>
                          <p className="text-[#8A93B5] text-[0.74rem] mt-1">Direct mock technical interviews tailored to current hiring parameters.</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* TAB 4: TECH STACK */}
                  {activeTab === 'tech' && (
                    <div className="space-y-6">
                      <div className="space-y-3">
                        <h4 className="font-display text-xl font-bold text-white flex items-center gap-2">
                          <span className="text-marigold">04.</span> Real Technologies Covered Under His Watch
                        </h4>
                        <p className="text-[#B9C1DC] text-[0.98rem] leading-relaxed">
                          You won't just learn basic CSS. You will build and deploy real applications utilizing the following full enterprise technology suite:
                        </p>
                      </div>

                      {/* Tech stack badges container */}
                      <div className="flex flex-wrap gap-2">
                        {[
                          'Next.js 15 & React 19',
                          'Node.js & Express API Servers',
                          'PostgreSQL & Cloud SQL databases',
                          'Prisma & Drizzle ORM schemas',
                          'Tailwind CSS & Modern Design Systems',
                          'Google Gemini Models SDK (@google/genai)',
                          'TypeScript Type-Safety Pipelines',
                          'Vite & Production Bundle optimization',
                          'Git Version Control & Branch Workflows',
                          'Docker & Modern Containerisation'
                        ].map((tech) => (
                          <span 
                            key={tech} 
                            className="bg-[#19223D] border border-[#2D3C66] text-white font-mono text-xs px-3.5 py-1.5 rounded-lg flex items-center gap-2"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-marigold" />
                            <span>{tech}</span>
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Bottom stats row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-10 border-t border-[#233052]">
              {stats.map((stat) => (
                <div key={stat.label} className="space-y-1 bg-[#141B30]/50 p-4 border border-[#233052]/50 rounded-xl">
                  <div className="font-display text-2xl md:text-3xl font-extrabold text-marigold leading-none">
                    {stat.value}
                  </div>
                  <div className="text-xs font-bold text-white uppercase tracking-wider">{stat.label}</div>
                  <div className="text-[0.74rem] text-[#8A93B5]">{stat.description}</div>
                </div>
              ))}
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
