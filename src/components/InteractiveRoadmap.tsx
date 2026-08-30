import React, { useState, useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronRight, 
  Terminal, 
  Cpu, 
  Database, 
  Rocket, 
  BookOpen, 
  Laptop, 
  Zap, 
  Flame, 
  CheckCircle2, 
  Sparkles,
  Award
} from 'lucide-react';

interface RoadmapStep {
  id: string;
  num: number;
  title: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Elite';
  duration: string;
  description: string;
  tools: string[];
  skills: string[];
  project: string;
  badgeColor: string;
  icon: React.ReactNode;
}

const ROADMAP_STEPS: RoadmapStep[] = [
  {
    id: 'step-1',
    num: 1,
    title: 'Foundations & Fast Deploys',
    level: 'Beginner',
    duration: 'Week 1',
    description: 'Break the syntax barrier. Learn command-line terminals, git pipelines, and core modern layout elements. By day three, you will have a live, responsive web page running on a public production URL.',
    tools: ['Vite', 'HTML5', 'Tailwind CSS', 'Git & GitHub'],
    skills: ['Command Line Navigation', 'Static Deployment', 'Modern Typography & Fluid Grids', 'Source Control Branching'],
    project: 'Personal Developer Landing Page (Live on GitHub Pages)',
    badgeColor: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20',
    icon: <Terminal className="w-5 h-5 text-emerald-500" />
  },
  {
    id: 'step-2',
    num: 2,
    title: 'Interactive Frontend & React',
    level: 'Intermediate',
    duration: 'Week 2',
    description: 'Learn component-driven architecture. Master React hooks, dynamic local state, state synchronization, and micro-interactions. You will learn to build responsive client-side UI dashboards with fluid custom charts.',
    tools: ['React 19', 'Lucide React', 'Recharts & D3', 'Framer Motion'],
    skills: ['Component Tree Modularization', 'Event Driven Architecture', 'Responsive Layout Adjustments', 'Interactive Data Visualizations'],
    project: 'Dynamic Analytics Dashboard (Fully Client-Driven)',
    badgeColor: 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20',
    icon: <Laptop className="w-5 h-5 text-blue-500" />
  },
  {
    id: 'step-3',
    num: 3,
    title: 'Custom Servers & Smart APIs',
    level: 'Advanced',
    duration: 'Week 3',
    description: 'Transition from single-page client apps to robust full-stack software. Write Express API servers in TypeScript, proxy private credentials, and implement lazy client-side initializers to securely access advanced models like Gemini.',
    tools: ['Node.js', 'Express', 'TypeScript', '@google/genai SDK'],
    skills: ['Proxy Architecture', 'Secure API Routing', 'Async Call Handler Pools', 'Environment Variable Security'],
    project: 'AI-Powered Meeting notes & Summarization Platform',
    badgeColor: 'bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/20',
    icon: <Cpu className="w-5 h-5 text-rose-500" />
  },
  {
    id: 'step-4',
    num: 4,
    title: 'Enterprise Data & Multi-User Auth',
    level: 'Advanced',
    duration: 'Week 4',
    description: 'Incorporate databases and security rules. Set up persistent cloud databases (Firestore/PostgreSQL) and Multi-User Authentication. Implement complex schemas, read-write validations, and cloud storage triggers.',
    tools: ['Firebase/Firestore', 'Cloud SQL (PostgreSQL)', 'Auth Triggers', 'Drizzle ORM'],
    skills: ['Durable Cloud Schema Design', 'Firebase Security Rule-checking', 'Relational DB Transactions', 'Auth Session State Lifecycle'],
    project: 'Database-backed SaaS Multi-Tenant Platform',
    badgeColor: 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20',
    icon: <Database className="w-5 h-5 text-amber-500" />
  },
  {
    id: 'step-5',
    num: 5,
    title: 'Shipping Real Products',
    level: 'Elite',
    duration: 'Beyond',
    description: 'The ultimate target: transition from learner to absolute shipper. Build production bundles, optimize build sizes, package into Docker containers, deploy to Google Cloud Run, and execute public product launches.',
    tools: ['Docker', 'Google Cloud Run', 'Vercel/Netlify', 'Production Bundler optimization'],
    skills: ['Production-ready Build Bundling', 'Containerized App Deployments', 'Custom Domains & SSL Setup', 'Product Launch Paradigms'],
    project: 'Sovereign Production Launch on Public Web',
    badgeColor: 'bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/20',
    icon: <Rocket className="w-5 h-5 text-purple-500" />
  }
];

export default function InteractiveRoadmap() {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  
  const [dimensions, setDimensions] = useState({ width: 800, height: 260 });
  const [activeStep, setActiveStep] = useState<RoadmapStep>(ROADMAP_STEPS[1]); // default to week 2
  const [hoveredStep, setHoveredStep] = useState<RoadmapStep | null>(null);

  // ResizeObserver to ensure container responsive sizing as per core guidelines
  useEffect(() => {
    if (!containerRef.current) return;

    const updateDimensions = () => {
      if (containerRef.current) {
        const width = containerRef.current.clientWidth;
        // Adjust height dynamically: taller on mobile, moderate on desktop
        const height = width < 640 ? 180 : 250;
        setDimensions({ width, height });
      }
    };

    // Initial run
    updateDimensions();

    const resizeObserver = new ResizeObserver(() => {
      // Small debounce-like or immediate execution
      updateDimensions();
    });

    resizeObserver.observe(containerRef.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  // Compute positions
  const getCoordinates = () => {
    const { width, height } = dimensions;
    const paddingLeft = width < 640 ? 40 : 80;
    const paddingRight = width < 640 ? 40 : 80;
    const stepCount = ROADMAP_STEPS.length;
    const stepWidth = (width - paddingLeft - paddingRight) / (stepCount - 1);
    
    return ROADMAP_STEPS.map((step, idx) => {
      const x = paddingLeft + idx * stepWidth;
      // Winding curve logic: alternating vertical positions
      // step 1 (idx 0): normal, step 2 (idx 1): lower, step 3 (idx 2): higher, etc.
      const amplitude = height * 0.16;
      let y = height / 2;
      if (idx === 1) y = height / 2 + amplitude;
      if (idx === 3) y = height / 2 + amplitude;
      if (idx === 2) y = height / 2 - amplitude;
      if (idx === 0) y = height / 2 - amplitude * 0.4;
      if (idx === 4) y = height / 2 - amplitude * 0.4;

      return {
        ...step,
        x,
        y
      };
    });
  };

  const stepsWithCoords = getCoordinates();

  // Draw smooth path connecting steps using D3 curve generators
  const lineGenerator = d3.line<{ x: number; y: number }>()
    .x(d => d.x)
    .y(d => d.y)
    .curve(d3.curveCatmullRom.alpha(0.5));

  const pathData = lineGenerator(stepsWithCoords) || '';

  return (
    <div className="mt-16 bg-white dark:bg-[#141B2D] border border-border-custom dark:border-[#222C44] rounded-custom p-6 md:p-8 relative overflow-hidden transition-all duration-300">
      {/* Decorative vector background */}
      <div className="absolute top-[-200px] left-[-200px] w-96 h-96 rounded-full bg-peacock/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-200px] right-[-200px] w-96 h-96 rounded-full bg-marigold/5 blur-3xl pointer-events-none" />

      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <span className="font-mono text-xs text-peacock font-semibold tracking-wider uppercase flex items-center gap-1.5 mb-1">
            <Sparkles className="w-3.5 h-3.5 text-marigold" />
            Interactive Career Map
          </span>
          <h3 className="font-display text-2xl md:text-3xl font-extrabold text-ink dark:text-white">
            Your Growth Blueprint
          </h3>
          <p className="text-muted text-sm max-w-xl mt-1.5">
            Hover or click nodes on our responsive D3 curriculum roadmap to see how you build, deploy, and scale.
          </p>
        </div>

        {/* Level Legend indicator */}
        <div className="flex items-center gap-3 bg-paper dark:bg-[#1C263F] border border-border-custom dark:border-[#2E3C66] px-3.5 py-1.5 rounded-xl self-start md:self-auto select-none">
          <span className="font-mono text-[0.72rem] text-muted dark:text-[#8A93B5] font-semibold">LEGEND:</span>
          <div className="flex items-center gap-2.5">
            <span className="flex items-center gap-1 font-sans text-[0.72rem] font-bold text-emerald-500">
              <span className="w-2 h-2 rounded-full bg-emerald-500" /> Beg
            </span>
            <span className="flex items-center gap-1 font-sans text-[0.72rem] font-bold text-blue-500">
              <span className="w-2 h-2 rounded-full bg-blue-500" /> Int
            </span>
            <span className="flex items-center gap-1 font-sans text-[0.72rem] font-bold text-rose-500">
              <span className="w-2 h-2 rounded-full bg-rose-500" /> Adv
            </span>
            <span className="flex items-center gap-1 font-sans text-[0.72rem] font-bold text-purple-500">
              <span className="w-2 h-2 rounded-full bg-purple-500" /> Elite
            </span>
          </div>
        </div>
      </div>

      {/* Canvas / Stage Winding Path Container */}
      <div 
        ref={containerRef} 
        className="w-full relative select-none rounded-2xl bg-paper/50 dark:bg-[#12182C]/30 border border-border-custom/50 dark:border-[#222C44]/50 py-4 mb-8 flex items-center justify-center overflow-x-auto min-h-[190px] md:min-h-[260px]"
        id="d3-roadmap-stage"
      >
        <svg 
          ref={svgRef}
          width={dimensions.width} 
          height={dimensions.height}
          className="overflow-visible absolute inset-0 pointer-events-auto"
        >
          {/* SVG Definitions for Gradients and Glow Filters */}
          <defs>
            <linearGradient id="roadmap-line-grad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#10B981" />  {/* emerald */}
              <stop offset="25%" stopColor="#3B82F6" /> {/* blue */}
              <stop offset="50%" stopColor="#F43F5E" /> {/* rose */}
              <stop offset="75%" stopColor="#F59E0B" /> {/* marigold */}
              <stop offset="100%" stopColor="#A855F7" /> {/* purple */}
            </linearGradient>

            <filter id="svg-glowing-effect" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Background Connecting Wave line (D3 generated path) */}
          <path
            d={pathData}
            fill="none"
            stroke="url(#roadmap-line-grad)"
            strokeWidth="4"
            strokeLinecap="round"
            className="opacity-70"
            style={{ strokeDasharray: '6, 6' }}
          />

          {/* Animated Glow Line tracing the path */}
          <path
            d={pathData}
            fill="none"
            stroke="url(#roadmap-line-grad)"
            strokeWidth="3.5"
            strokeLinecap="round"
            className="opacity-90 transition-all duration-500"
            style={{
              strokeDasharray: '12, 18',
              animation: 'dash-flow 16s linear infinite'
            }}
          />

          {/* Render individual node markers dynamically */}
          {stepsWithCoords.map((step) => {
            const isSelected = activeStep.id === step.id;
            const isHovered = hoveredStep?.id === step.id;
            
            // Assign color based on step level
            let nodeColor = '#3B82F6'; // Default blue
            if (step.level === 'Beginner') nodeColor = '#10B981';
            if (step.level === 'Advanced') nodeColor = '#F43F5E';
            if (step.level === 'Elite') nodeColor = '#A855F7';

            return (
              <g 
                key={step.id}
                transform={`translate(${step.x}, ${step.y})`}
                className="cursor-pointer group"
                onClick={() => setActiveStep(step)}
                onMouseEnter={() => setHoveredStep(step)}
                onMouseLeave={() => setHoveredStep(null)}
              >
                {/* Outermost pulsing ring */}
                <circle
                  r={isSelected || isHovered ? 24 : 16}
                  fill={nodeColor}
                  fillOpacity="0.08"
                  className="transition-all duration-300"
                />

                {/* Glowing ring if active/hovered */}
                {(isSelected || isHovered) && (
                  <circle
                    r={20}
                    fill="none"
                    stroke={nodeColor}
                    strokeWidth="2"
                    strokeOpacity="0.6"
                    className="animate-ping"
                    style={{ animationDuration: '2s' }}
                  />
                )}

                {/* Middle border circle */}
                <circle
                  r={isSelected ? 16 : 13}
                  fill={isSelected ? nodeColor : '#FFFFFF'}
                  stroke={nodeColor}
                  strokeWidth={isSelected ? 2 : 2.5}
                  className="transition-all duration-300 dark:fill-[#141B2D]"
                />

                {/* Center dot */}
                <circle
                  r={isSelected ? 6 : 4}
                  fill={isSelected ? '#FFFFFF' : nodeColor}
                  className="transition-all duration-300 dark:fill-[#141B2D]"
                />

                {/* Number text above node */}
                <text
                  y={-24}
                  textAnchor="middle"
                  className="font-mono text-[0.68rem] font-bold fill-muted select-none pointer-events-none"
                >
                  {step.duration}
                </text>

                {/* Short label below node */}
                <text
                  y={26}
                  textAnchor="middle"
                  className="font-sans text-[0.72rem] font-extrabold fill-ink dark:fill-white select-none pointer-events-none tracking-wide"
                >
                  {step.level}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Global style for line dashboard flow */}
        <style>{`
          @keyframes dash-flow {
            to {
              stroke-dashoffset: -300;
            }
          }
        `}</style>
      </div>

      {/* Bento grid style detailed card of the selected step */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeStep.id}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.3 }}
          className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6"
        >
          {/* Main Info Card */}
          <div className="bg-paper dark:bg-[#1A233C] border border-border-custom dark:border-[#2C3D66] rounded-2xl p-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white dark:bg-[#12182C] border border-border-custom dark:border-[#2C3D66] flex items-center justify-center shadow-sm">
                    {activeStep.icon}
                  </div>
                  <div>
                    <span className="font-mono text-[0.7rem] font-bold text-peacock uppercase tracking-wide">
                      Stage {activeStep.num} — {activeStep.duration}
                    </span>
                    <h4 className="font-display text-lg md:text-xl font-bold text-ink dark:text-white">
                      {activeStep.title}
                    </h4>
                  </div>
                </div>

                <span className={`px-2.5 py-1 rounded-md text-xs font-mono font-bold border ${activeStep.badgeColor}`}>
                  {activeStep.level} Level
                </span>
              </div>

              <p className="text-muted dark:text-[#B9C1DC] text-sm md:text-[0.94rem] leading-relaxed">
                {activeStep.description}
              </p>

              {/* Core Skills Gained */}
              <div className="space-y-2 pt-2">
                <span className="font-mono text-[0.68rem] font-bold uppercase text-muted tracking-wide block">
                  Practical Capabilities Gained:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {activeStep.skills.map((skill, sIdx) => (
                    <div key={sIdx} className="flex items-start gap-2 text-xs text-ink dark:text-[#D1D6E6]">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-none mt-0.5" />
                      <span>{skill}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Shipped project callout */}
            <div className="mt-6 pt-5 border-t border-border-custom/80 dark:border-[#2C3D66]/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#5BE3A8] animate-pulse" />
                <span className="font-sans text-xs text-muted dark:text-[#8A93B5]">
                  What you ship in this module:
                </span>
              </div>
              <span className="font-mono text-xs font-bold text-peacock bg-peacock/10 py-1.5 px-3 rounded-lg border border-peacock/20 text-right">
                🚀 {activeStep.project}
              </span>
            </div>
          </div>

          {/* Right Card: Tools & Technologies Stack */}
          <div className="bg-[#12182C] text-[#EDEFF8] rounded-2xl p-6 border border-[#233052] flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center gap-2 border-b border-[#233052] pb-3">
                <Flame className="w-4 h-4 text-marigold animate-pulse" />
                <span className="font-mono text-xs font-bold text-white uppercase tracking-wider">
                  Technology Stack
                </span>
              </div>

              <p className="text-[#8A93B5] text-[0.78rem] leading-relaxed">
                You will write original code with your own hands using the industry-proven technical ecosystem below. No mock buttons or dry lectures.
              </p>

              <div className="flex flex-wrap gap-2 pt-2">
                {activeStep.tools.map((tool) => (
                  <span 
                    key={tool}
                    className="bg-[#19223D] border border-[#2D3C66] text-white font-mono text-[0.7rem] px-2.5 py-1.5 rounded-lg flex items-center gap-1.5"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-marigold" />
                    <span>{tool}</span>
                  </span>
                ))}
              </div>
            </div>

            {/* Quick interactive prompt */}
            <div className="pt-6 border-t border-[#233052] flex items-center justify-between gap-2 mt-6">
              <span className="text-[0.7rem] text-[#8A93B5] font-semibold flex items-center gap-1">
                <BookOpen className="w-3.5 h-3.5" />
                Next Step
              </span>
              <button 
                onClick={() => {
                  const nextIdx = (activeStep.num) % ROADMAP_STEPS.length;
                  setActiveStep(ROADMAP_STEPS[nextIdx]);
                }}
                className="text-xs font-bold text-marigold hover:text-white flex items-center gap-1 transition-colors uppercase font-mono cursor-pointer"
                type="button"
              >
                <span>Details</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
