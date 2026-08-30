import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  AreaChart, 
  Area, 
  BarChart,
  Bar,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis
} from 'recharts';
import { 
  TrendingUp, 
  Sparkles, 
  CheckCircle2, 
  Code2, 
  Database, 
  Zap, 
  Rocket, 
  Layers, 
  BarChart3, 
  Compass, 
  Cpu, 
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

// Weekly Growth Trajectory Data
const WEEKLY_GROWTH_DATA = [
  {
    week: 'Week 1',
    label: 'Foundations',
    frontend: 35,
    fullstack: 15,
    aiVelocity: 45,
    overallReadiness: 28,
    shipped: 'Personal Portfolio Live on Domain',
    keyCompetency: 'HTML/CSS/JS + AI Scaffolding + Git Pipelines'
  },
  {
    week: 'Week 2',
    label: 'Full-Stack & DBs',
    frontend: 68,
    fullstack: 58,
    aiVelocity: 72,
    overallReadiness: 62,
    shipped: 'Dynamic Business Site with Admin Panel',
    keyCompetency: 'Next.js + SQL/NoSQL DBs + Auth & CRUD APIs'
  },
  {
    week: 'Week 3',
    label: 'SaaS & Billing',
    frontend: 88,
    fullstack: 84,
    aiVelocity: 90,
    overallReadiness: 86,
    shipped: 'Micro-SaaS with Razorpay Subscriptions',
    keyCompetency: 'Payment Webhooks + Subscription Logic + Usage Dashboards'
  },
  {
    week: 'Week 4',
    label: 'Mobile & Launch',
    frontend: 96,
    fullstack: 95,
    aiVelocity: 98,
    overallReadiness: 96,
    shipped: 'Installable PWA/APK + Client Acquisition Playbook',
    keyCompetency: 'Flutter/PWA + Push Alerts + SEO & Client Pricing'
  }
];

// Competency Matrix (Starter vs Graduated)
const COMPETENCY_MATRIX_DATA = [
  {
    domain: 'Frontend & UI',
    dayZero: 10,
    weekTwo: 60,
    graduation: 95,
    highlight: 'From basic HTML to reactive Next.js dashboards'
  },
  {
    domain: 'Backend & DBs',
    dayZero: 5,
    weekTwo: 55,
    graduation: 92,
    highlight: 'Production APIs, schemas, queries & authentication'
  },
  {
    domain: 'AI Pair-Coding',
    dayZero: 15,
    weekTwo: 70,
    graduation: 98,
    highlight: '10× velocity using modern AI coding agents'
  },
  {
    domain: 'Billing & SaaS',
    dayZero: 0,
    weekTwo: 40,
    graduation: 94,
    highlight: 'Razorpay, webhooks, plans & user management'
  },
  {
    domain: 'Mobile & Launch',
    dayZero: 5,
    weekTwo: 35,
    graduation: 90,
    highlight: 'PWA, Android APK, custom domains & SEO'
  }
];

// Radar Versatility Data
const RADAR_SKILLS_DATA = [
  { subject: 'React & Next.js', score: 95, fullMark: 100 },
  { subject: 'Database & Auth', score: 92, fullMark: 100 },
  { subject: 'AI Pair-Coding', score: 98, fullMark: 100 },
  { subject: 'SaaS Billing', score: 94, fullMark: 100 },
  { subject: 'Mobile PWA/APK', score: 88, fullMark: 100 },
  { subject: 'Client Acquisition', score: 90, fullMark: 100 },
];

const CustomTrajectoryTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const dataObj = WEEKLY_GROWTH_DATA.find(d => d.week === label) || payload[0]?.payload;
    return (
      <div className="bg-card border border-border-custom p-4 rounded-xl shadow-custom font-sans text-xs min-w-[240px] backdrop-blur-md bg-card/95">
        <div className="border-b border-border-custom/60 pb-2 mb-2">
          <p className="font-display font-extrabold text-ink text-sm flex items-center justify-between">
            <span>{label} — {dataObj?.label}</span>
            <span className="font-mono text-emerald-600 dark:text-emerald-400 text-[0.7rem] bg-emerald-500/10 px-2 py-0.5 rounded-full font-bold">
              {dataObj?.overallReadiness}% Mastery
            </span>
          </p>
        </div>
        
        <div className="space-y-1.5 mb-2.5">
          <div className="flex justify-between items-center text-peacock font-semibold">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-peacock" />
              AI Velocity & Shipping Speed:
            </span>
            <span className="font-mono font-bold">{dataObj?.aiVelocity}%</span>
          </div>
          <div className="flex justify-between items-center text-blue-600 dark:text-blue-400 font-semibold">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-blue-500" />
              Frontend & UI Architecture:
            </span>
            <span className="font-mono font-bold">{dataObj?.frontend}%</span>
          </div>
          <div className="flex justify-between items-center text-marigold-deep dark:text-marigold font-semibold">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-marigold-deep" />
              Full-Stack, DBs & APIs:
            </span>
            <span className="font-mono font-bold">{dataObj?.fullstack}%</span>
          </div>
        </div>

        <div className="pt-2 border-t border-border-custom/50 text-[0.72rem]">
          <span className="text-muted font-medium block mb-0.5">Shipped Project:</span>
          <span className="font-bold text-ink dark:text-gray-200 flex items-center gap-1">
            <Rocket className="w-3 h-3 text-peacock flex-none" /> {dataObj?.shipped}
          </span>
        </div>
      </div>
    );
  }
  return null;
};

const CustomMatrixTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const d = payload[0]?.payload;
    return (
      <div className="bg-card border border-border-custom p-3.5 rounded-xl shadow-custom font-sans text-xs min-w-[220px] backdrop-blur-md bg-card/95">
        <p className="font-display font-extrabold text-ink text-sm mb-1.5 border-b border-border-custom/60 pb-1">
          {label}
        </p>
        <div className="space-y-1.5">
          <div className="flex justify-between items-center text-peacock font-bold">
            <span>Upon Graduation (Week 4):</span>
            <span className="font-mono">{d?.graduation}%</span>
          </div>
          <div className="flex justify-between items-center text-blue-600 dark:text-blue-400 font-semibold">
            <span>Mid-Cohort (Week 2):</span>
            <span className="font-mono">{d?.weekTwo}%</span>
          </div>
          <div className="flex justify-between items-center text-muted font-medium">
            <span>Day Zero Baseline:</span>
            <span className="font-mono">{d?.dayZero}%</span>
          </div>
        </div>
        <p className="text-[0.7rem] text-muted italic mt-2 pt-1 border-t border-border-custom/40">
          {d?.highlight}
        </p>
      </div>
    );
  }
  return null;
};

export default function SkillsAcquiredChart() {
  const [activeView, setActiveView] = useState<'trajectory' | 'matrix' | 'radar'>('trajectory');
  const [selectedWeek, setSelectedWeek] = useState<number>(4);

  const currentWeekData = WEEKLY_GROWTH_DATA[selectedWeek - 1];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6 }}
      className="mt-14 bg-card border border-border-custom rounded-custom p-6 md:p-9 shadow-sm"
      id="skills-acquired-visualization-card"
    >
      {/* Header bar with badge and view switchers */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-border-custom">
        <div>
          <span className="inline-flex items-center gap-1.5 bg-peacock/10 text-peacock font-mono text-[0.72rem] font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" /> 4-Week Skill Acceleration
          </span>
          <h3 className="font-display text-2xl md:text-3xl font-extrabold text-ink leading-tight">
            Skills Acquired & Capability Growth
          </h3>
          <p className="text-muted text-[0.92rem] mt-1 max-w-xl">
            See how our hands-on shipping schedule transforms beginners into versatile, job-ready full-stack developers in 28 days.
          </p>
        </div>

        {/* View Switcher Tabs */}
        <div className="inline-flex bg-paper border border-border-custom rounded-xl p-1 text-xs font-mono font-bold shadow-inner flex-wrap gap-1">
          <button
            type="button"
            onClick={() => setActiveView('trajectory')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
              activeView === 'trajectory'
                ? 'bg-peacock text-white shadow-sm'
                : 'text-muted hover:text-ink'
            }`}
            id="view-trajectory-btn"
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Growth Curve</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveView('matrix')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
              activeView === 'matrix'
                ? 'bg-peacock text-white shadow-sm'
                : 'text-muted hover:text-ink'
            }`}
            id="view-matrix-btn"
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Domain Matrix</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveView('radar')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
              activeView === 'radar'
                ? 'bg-peacock text-white shadow-sm'
                : 'text-muted hover:text-ink'
            }`}
            id="view-radar-btn"
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Versatility Radar</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Chart Canvas (Left) + Interactive Week Breakdown (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.8fr_1.2fr] gap-8 items-center mt-8">
        
        {/* Recharts Canvas Card */}
        <div className="bg-paper/60 border border-border-custom rounded-2xl p-4 sm:p-6" id="skills-chart-panel">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
            <div>
              <p className="font-sans font-bold text-xs uppercase tracking-wider font-mono text-muted">
                {activeView === 'trajectory' ? 'Progressive Velocity (%)' : activeView === 'matrix' ? 'Comparative Competency (0–100)' : '360° Full-Stack Profile'}
              </p>
              <h4 className="font-display text-base font-bold text-ink">
                {activeView === 'trajectory' ? 'Weekly Cumulative Mastery Curve' : activeView === 'matrix' ? 'Day 0 Baseline vs. Graduation Readiness' : 'Graduate Skillset Distribution'}
              </h4>
            </div>

            <span className="text-[0.72rem] font-mono font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
              100% Practical
            </span>
          </div>

          <div className="w-full h-[290px] sm:h-[330px] relative">
            <ResponsiveContainer width="100%" height="100%">
              {activeView === 'trajectory' ? (
                <AreaChart
                  data={WEEKLY_GROWTH_DATA}
                  margin={{ top: 15, right: 15, left: -15, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorAiVel" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--color-peacock)" stopOpacity={0.35}/>
                      <stop offset="95%" stopColor="var(--color-peacock)" stopOpacity={0.0}/>
                    </linearGradient>
                    <linearGradient id="colorFrontend" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.25}/>
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.0}/>
                    </linearGradient>
                    <linearGradient id="colorFullstack" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--color-marigold-deep)" stopOpacity={0.25}/>
                      <stop offset="95%" stopColor="var(--color-marigold-deep)" stopOpacity={0.0}/>
                    </linearGradient>
                  </defs>

                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border-custom)" />
                  
                  <XAxis 
                    dataKey="week" 
                    stroke="var(--color-muted)" 
                    tickLine={false}
                    axisLine={false}
                    dy={8}
                    style={{ fontSize: '11px', fontFamily: 'var(--font-mono)' }}
                  />
                  
                  <YAxis 
                    stroke="var(--color-muted)" 
                    tickLine={false}
                    axisLine={false}
                    dx={-4}
                    domain={[0, 100]}
                    style={{ fontSize: '11px', fontFamily: 'var(--font-mono)' }}
                    tickFormatter={(val) => `${val}%`}
                  />
                  
                  <Tooltip content={<CustomTrajectoryTooltip />} />
                  
                  <Area 
                    type="monotone" 
                    dataKey="aiVelocity" 
                    name="AI Pair-Coding Velocity"
                    stroke="var(--color-peacock)" 
                    strokeWidth={3} 
                    fillOpacity={1} 
                    fill="url(#colorAiVel)" 
                    activeDot={{ r: 6, strokeWidth: 0, fill: "var(--color-peacock)" }}
                  />
                  
                  <Area 
                    type="monotone" 
                    dataKey="frontend" 
                    name="Frontend & UI Architecture"
                    stroke="#3B82F6" 
                    strokeWidth={2.5} 
                    fillOpacity={1} 
                    fill="url(#colorFrontend)" 
                    activeDot={{ r: 5, strokeWidth: 0, fill: "#3B82F6" }}
                  />

                  <Area 
                    type="monotone" 
                    dataKey="fullstack" 
                    name="Backend, DBs & APIs"
                    stroke="var(--color-marigold-deep)" 
                    strokeWidth={2} 
                    strokeDasharray="4 4"
                    fillOpacity={1} 
                    fill="url(#colorFullstack)" 
                    activeDot={{ r: 5, strokeWidth: 0, fill: "var(--color-marigold-deep)" }}
                  />

                  <Legend 
                    verticalAlign="bottom" 
                    height={36} 
                    iconType="circle"
                    iconSize={8}
                    style={{ fontSize: '11px', fontFamily: 'var(--font-sans)', fontWeight: 600 }}
                    wrapperStyle={{ paddingTop: '16px' }}
                  />
                </AreaChart>
              ) : activeView === 'matrix' ? (
                <BarChart
                  data={COMPETENCY_MATRIX_DATA}
                  margin={{ top: 15, right: 10, left: -15, bottom: 20 }}
                  barGap={4}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border-custom)" />
                  <XAxis 
                    dataKey="domain" 
                    stroke="var(--color-muted)" 
                    tickLine={false}
                    axisLine={false}
                    dy={8}
                    style={{ fontSize: '10.5px', fontFamily: 'var(--font-mono)' }}
                  />
                  <YAxis 
                    stroke="var(--color-muted)" 
                    tickLine={false}
                    axisLine={false}
                    dx={-4}
                    domain={[0, 100]}
                    style={{ fontSize: '11px', fontFamily: 'var(--font-mono)' }}
                    tickFormatter={(val) => `${val}%`}
                  />
                  <Tooltip content={<CustomMatrixTooltip />} />
                  <Legend 
                    verticalAlign="top" 
                    align="right"
                    iconType="circle"
                    iconSize={8}
                    style={{ fontSize: '11px', fontFamily: 'var(--font-sans)', fontWeight: 600 }}
                    wrapperStyle={{ paddingBottom: '10px' }}
                  />
                  <Bar 
                    dataKey="graduation" 
                    name="Graduation Mastery (Wk 4)" 
                    fill="var(--color-peacock)" 
                    radius={[5, 5, 0, 0]}
                  />
                  <Bar 
                    dataKey="weekTwo" 
                    name="Midpoint (Wk 2)" 
                    fill="#3B82F6" 
                    radius={[5, 5, 0, 0]}
                  />
                  <Bar 
                    dataKey="dayZero" 
                    name="Day 0 (Starter)" 
                    fill="#94A3B8" 
                    radius={[5, 5, 0, 0]}
                  />
                </BarChart>
              ) : (
                <RadarChart 
                  outerRadius={105} 
                  data={RADAR_SKILLS_DATA}
                  margin={{ top: 10, right: 20, left: 20, bottom: 10 }}
                >
                  <PolarGrid stroke="var(--color-border-custom)" />
                  <PolarAngleAxis 
                    dataKey="subject" 
                    stroke="var(--color-muted)"
                    tick={{ fill: 'var(--color-ink)', fontSize: 11, fontFamily: 'var(--font-sans)', fontWeight: 600 }}
                  />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="var(--color-border-custom)" />
                  <Radar
                    name="Graduation Skill Matrix"
                    dataKey="score"
                    stroke="var(--color-peacock)"
                    fill="var(--color-peacock)"
                    fillOpacity={0.45}
                  />
                  <Tooltip />
                </RadarChart>
              )}
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right Side: Interactive Weekly Explorer */}
        <div className="space-y-4">
          
          {/* Week Selector Chips */}
          <div>
            <span className="text-xs font-mono font-bold text-muted uppercase tracking-wider block mb-2">
              Select Week To Inspect Skills:
            </span>
            <div className="grid grid-cols-4 gap-1.5">
              {[1, 2, 3, 4].map((wk) => (
                <button
                  key={wk}
                  type="button"
                  onClick={() => setSelectedWeek(wk)}
                  className={`py-2 px-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer border text-center ${
                    selectedWeek === wk
                      ? 'bg-peacock text-white border-peacock shadow-sm scale-102'
                      : 'bg-paper text-ink-soft hover:text-ink border-border-custom hover:border-peacock/40'
                  }`}
                  id={`select-week-${wk}-btn`}
                >
                  Week {wk}
                </button>
              ))}
            </div>
          </div>

          {/* Active Week Details Card */}
          <div className="bg-paper border border-border-custom rounded-2xl p-5 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[0.72rem] font-mono font-bold text-peacock bg-peacock/10 px-2.5 py-1 rounded-full flex items-center gap-1.5">
                <Code2 className="w-3.5 h-3.5" />
                {currentWeekData.label} Phase
              </span>
              <span className="text-xs font-mono font-extrabold text-emerald-600 dark:text-emerald-400">
                {currentWeekData.overallReadiness}% Readiness
              </span>
            </div>

            <h4 className="font-display font-extrabold text-ink text-base mb-1.5">
              Week {currentWeekData.week.split(' ')[1]}: {currentWeekData.keyCompetency}
            </h4>

            <p className="text-muted text-xs leading-relaxed mb-4">
              Learners transition from guided pair-programming to shipping production code with verified build pipelines.
            </p>

            {/* Micro Project Deliverable Highlight */}
            <div className="p-3.5 rounded-xl bg-card border border-border-custom/80 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-peacock font-mono">
                <Rocket className="w-4 h-4 text-marigold-deep" />
                <span>Deliverable Shipped:</span>
              </div>
              <p className="text-xs font-semibold text-ink dark:text-white leading-normal pl-6">
                {currentWeekData.shipped}
              </p>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 gap-2.5 mt-3 pt-3 border-t border-border-custom/50 text-[0.72rem] font-mono">
              <div className="flex items-center gap-1.5 text-ink-soft">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                <span>Zero Boilerplate Delay</span>
              </div>
              <div className="flex items-center gap-1.5 text-ink-soft">
                <Zap className="w-3.5 h-3.5 text-marigold" />
                <span>10× AI Fast-Tracking</span>
              </div>
            </div>
          </div>

          {/* Bottom Fast-Action Guarantee */}
          <div className="bg-gradient-to-r from-peacock/10 via-marigold/10 to-transparent border border-peacock/20 rounded-xl p-3.5 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-peacock flex-none" />
              <span className="text-xs font-medium text-ink leading-tight">
                Every week includes code reviews & live doubt resolution.
              </span>
            </div>
            <a 
              href="#register" 
              className="text-[0.75rem] font-mono font-bold text-peacock hover:underline flex items-center gap-0.5 flex-none"
            >
              <span>Join Batch</span>
              <ArrowRight className="w-3 h-3" />
            </a>
          </div>

        </div>

      </div>
    </motion.div>
  );
}
