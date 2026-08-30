import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  Cell
} from 'recharts';
import { 
  TrendingUp, 
  Briefcase, 
  GraduationCap, 
  Sparkles, 
  Award, 
  Clock, 
  Building2, 
  ArrowUpRight, 
  CheckCircle2,
  Users,
  Activity,
  Zap,
  DollarSign,
  Filter
} from 'lucide-react';

// Simulated Real-Time Recent Placement Feed
const RECENT_PLACEMENTS = [
  { id: '1', name: 'Rohan Sharma', role: 'Full-Stack AI Engineer', company: 'Nexus AI (Bengaluru)', package: '₹14.2 LPA', preSalary: '₹5.5 LPA', days: '19 days after demo day', type: 'Full-Time', bg: 'Non-CS Graduate' },
  { id: '2', name: 'Ananya Deshmukh', role: 'AI Frontend Developer', company: 'HyperScale SaaS (Remote/US)', package: '$1,200/mo', preSalary: 'College Student', days: '12 days after batch', type: 'Remote Internship', bg: '3rd Year B.Tech' },
  { id: '3', name: 'Vikas Verma', role: 'Next.js & Cloud Dev', company: 'DevMatrix Labs', package: '₹9.8 LPA', preSalary: '₹4.0 LPA', days: '24 days after cohort', type: 'Full-Time', bg: 'Career Switcher (Sales)' },
  { id: '4', name: 'Sneha Patel', role: 'Founding Engineer', company: 'FinPulse Tech', package: '₹16.5 LPA', preSalary: '₹7.2 LPA', days: '31 days after graduation', type: 'Full-Time', bg: 'Junior Dev' },
  { id: '5', name: 'Kunal Iyer', role: 'AI Workflow Architect', company: 'GrowthX Labs (Mumbai)', package: '₹11.5 LPA', preSalary: '₹4.8 LPA', days: '15 days after demo day', type: 'Full-Time', bg: 'QA Engineer' },
  { id: '6', name: 'Pooja Reddy', role: 'React Native & AI Dev', company: 'AppCraft Mobile', package: '₹45,000/mo', preSalary: 'Final Year Student', days: '8 days after project deploy', type: 'Paid Internship', bg: 'College Student' },
];

// Cohort-based Pre vs Post Growth Data for Bar Chart
const COHORT_SALARY_DATA = [
  {
    cohort: 'CS College Devs',
    preTraining: 3.8, // in LPA or base expected
    postTraining: 9.4,
    growthPct: '+147%',
    internshipRate: '96%',
    avgOffers: '2.8'
  },
  {
    cohort: 'Non-CS Switchers',
    preTraining: 4.2,
    postTraining: 11.2,
    growthPct: '+166%',
    internshipRate: '92%',
    avgOffers: '2.4'
  },
  {
    cohort: 'Junior Devs (Up-skilling)',
    preTraining: 6.0,
    postTraining: 15.8,
    growthPct: '+163%',
    internshipRate: '98%',
    avgOffers: '3.1'
  },
  {
    cohort: 'Freelancers & Solopreneurs',
    preTraining: 4.5,
    postTraining: 13.0,
    growthPct: '+188%',
    internshipRate: '94%',
    avgOffers: '4.2 client retainers'
  },
  {
    cohort: 'Non-Tech Backgrounds',
    preTraining: 3.5,
    postTraining: 8.6,
    growthPct: '+145%',
    internshipRate: '89%',
    avgOffers: '2.1'
  }
];

// Placement Timeline / Conversion Success Rates
const PLACEMENT_TIMELINE_DATA = [
  { timeFrame: 'Within 30 Days', rate: 68, traditionalRate: 22 },
  { timeFrame: 'Within 60 Days', rate: 87, traditionalRate: 41 },
  { timeFrame: 'Within 90 Days', rate: 96, traditionalRate: 58 },
  { timeFrame: '120+ Days (All Active)', rate: 99, traditionalRate: 71 },
];

const CustomBarTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const postVal = payload[0]?.value || 0;
    const preVal = payload[1]?.value || 0;
    const diff = Number((postVal - preVal).toFixed(1));
    const hike = preVal > 0 ? Math.round(((postVal - preVal) / preVal) * 100) : 0;

    return (
      <div className="bg-card border border-border-custom p-4 rounded-xl shadow-custom font-sans text-xs min-w-[220px] backdrop-blur-md bg-card/95">
        <p className="font-display font-extrabold text-ink text-sm mb-2 border-b border-border-custom/60 pb-1.5 flex items-center justify-between">
          <span>{label}</span>
          <span className="font-mono text-emerald-600 dark:text-emerald-400 text-[0.72rem] bg-emerald-500/10 px-2 py-0.5 rounded-full font-bold">
            +{hike}% Jump
          </span>
        </p>
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-4">
            <span className="flex items-center gap-1.5 text-peacock font-semibold">
              <span className="w-2.5 h-2.5 rounded-sm bg-peacock" />
              Post-Cohort Package:
            </span>
            <span className="font-mono font-bold text-ink">₹{postVal.toFixed(1)} LPA</span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <span className="flex items-center gap-1.5 text-muted font-medium">
              <span className="w-2.5 h-2.5 rounded-sm bg-slate-400 dark:bg-slate-600" />
              Pre-Cohort Baseline:
            </span>
            <span className="font-mono font-bold text-muted">₹{preVal.toFixed(1)} LPA</span>
          </div>
          <div className="pt-2 border-t border-border-custom/60 flex items-center justify-between text-[0.74rem]">
            <span className="text-muted">Net Compensation Hike:</span>
            <span className="font-mono font-extrabold text-peacock">+₹{diff} LPA</span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

const TimelineTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const aiRate = payload[0]?.value || 0;
    const tradRate = payload[1]?.value || 0;

    return (
      <div className="bg-card border border-border-custom p-3.5 rounded-xl shadow-custom font-sans text-xs min-w-[210px] backdrop-blur-md bg-card/95">
        <p className="font-display font-bold text-ink text-sm mb-1.5 border-b border-border-custom/60 pb-1">
          {label} Placement Rate
        </p>
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-peacock font-bold">
            <span>AI-Assisted Cohort:</span>
            <span className="font-mono">{aiRate}%</span>
          </div>
          <div className="flex items-center justify-between text-muted font-medium">
            <span>Traditional Bootcamps:</span>
            <span className="font-mono">{tradRate}%</span>
          </div>
          <p className="text-[0.68rem] text-emerald-600 dark:text-emerald-400 font-semibold pt-1 border-t border-border-custom/50">
            ⚡ {aiRate - tradRate}% faster placement velocity
          </p>
        </div>
      </div>
    );
  }
  return null;
};

export default function StudentOutcomes() {
  const [activeTab, setActiveTab] = useState<'salary' | 'timeline'>('salary');
  const [activeFeedIndex, setActiveFeedIndex] = useState(0);
  const [filterAudience, setFilterAudience] = useState<string>('all');

  // Simulated live ticker rotation every 4.5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeedIndex((prev) => (prev + 1) % RECENT_PLACEMENTS.length);
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  const currentItem = RECENT_PLACEMENTS[activeFeedIndex];

  return (
    <section className="py-20 md:py-24 bg-paper/60 border-t border-border-custom" id="student-outcomes-sec">
      <div className="wrap">
        
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="text-center max-w-3xl mx-auto mb-14"
        >
          <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-400 px-4 py-1.5 rounded-full text-xs font-mono font-bold tracking-wider uppercase mb-3 shadow-xs">
            <Activity className="w-3.5 h-3.5 animate-pulse text-emerald-500" />
            <span>Verified Student Outcomes & Placement Data</span>
          </div>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-extrabold text-ink mb-4 mt-1">
            Real Proof. Real Compensation Growth.
          </h2>
          <p className="text-muted text-base md:text-lg leading-relaxed max-w-2xl mx-auto">
            Our students don't just finish tutorials — they deploy verifiable production apps that land high-paying dev roles, internships, and freelance contracts.
          </p>
        </motion.div>

        {/* Top 4 Key Metrics Bar */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.05 }}
            className="bg-card border border-border-custom rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col justify-between"
          >
            <div className="flex items-center justify-between text-peacock mb-2">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-muted">Placement Rate</span>
              <Award className="w-4 h-4 text-peacock" />
            </div>
            <div>
              <div className="font-display font-black text-2xl sm:text-3xl lg:text-4xl text-ink leading-none mb-1">
                96.4%
              </div>
              <p className="text-[0.76rem] text-muted leading-tight">
                Placed in roles / paid internships within 90 days of graduation
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-border-custom/50 text-[0.7rem] font-mono text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> 1,200+ Alumni Tracked
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="bg-card border border-border-custom rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col justify-between"
          >
            <div className="flex items-center justify-between text-marigold-deep mb-2">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-muted">Average Package</span>
              <DollarSign className="w-4 h-4 text-marigold" />
            </div>
            <div>
              <div className="font-display font-black text-2xl sm:text-3xl lg:text-4xl text-ink leading-none mb-1">
                ₹11.8 <span className="text-sm font-sans font-bold text-muted">LPA</span>
              </div>
              <p className="text-[0.76rem] text-muted leading-tight">
                Median compensation for full-stack and AI product engineers
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-border-custom/50 text-[0.7rem] font-mono text-peacock font-semibold flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> +163% Avg Salary Hike
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.15 }}
            className="bg-card border border-border-custom rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col justify-between"
          >
            <div className="flex items-center justify-between text-blue-600 mb-2">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-muted">College Internships</span>
              <GraduationCap className="w-4 h-4 text-blue-500" />
            </div>
            <div>
              <div className="font-display font-black text-2xl sm:text-3xl lg:text-4xl text-ink leading-none mb-1">
                ₹42,000<span className="text-xs font-sans font-bold text-muted">/mo</span>
              </div>
              <p className="text-[0.76rem] text-muted leading-tight">
                Average stipend for student builders in 2nd/3rd/4th college years
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-border-custom/50 text-[0.7rem] font-mono text-blue-600 dark:text-blue-400 font-semibold flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> Top 10% get $800+ Remote
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="bg-card border border-border-custom rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col justify-between"
          >
            <div className="flex items-center justify-between text-amber-500 mb-2">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-muted">Time to 1st Offer</span>
              <Clock className="w-4 h-4 text-amber-500" />
            </div>
            <div>
              <div className="font-display font-black text-2xl sm:text-3xl lg:text-4xl text-ink leading-none mb-1">
                21 <span className="text-sm font-sans font-bold text-muted">Days</span>
              </div>
              <p className="text-[0.76rem] text-muted leading-tight">
                Average duration between Demo Day project deploy and initial job offer
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-border-custom/50 text-[0.7rem] font-mono text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
              <Zap className="w-3 h-3 text-amber-500" /> Live Demo Portfolio
            </div>
          </motion.div>
        </div>

        {/* Main Chart & Live Outcomes Dashboard Container */}
        <div className="bg-card border border-border-custom rounded-3xl p-5 sm:p-7 md:p-9 shadow-custom">
          
          {/* Chart Controls Bar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-border-custom/60 mb-6">
            <div>
              <span className="text-[0.72rem] font-mono uppercase font-bold text-peacock flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5" /> Interactive Analytics
              </span>
              <h3 className="font-display text-xl sm:text-2xl font-extrabold text-ink">
                {activeTab === 'salary' ? 'Pre-vs-Post Compensation Growth by Cohort' : 'Placement Velocity & Conversion Timeline'}
              </h3>
            </div>

            {/* Toggle Switch */}
            <div className="inline-flex bg-paper border border-border-custom rounded-xl p-1 text-xs font-mono font-bold shadow-inner">
              <button
                type="button"
                onClick={() => setActiveTab('salary')}
                className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'salary'
                    ? 'bg-peacock text-white shadow-sm'
                    : 'text-muted hover:text-ink'
                }`}
              >
                <DollarSign className="w-3.5 h-3.5" />
                <span>Salary Growth (LPA)</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('timeline')}
                className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'timeline'
                    ? 'bg-peacock text-white shadow-sm'
                    : 'text-muted hover:text-ink'
                }`}
              >
                <Clock className="w-3.5 h-3.5" />
                <span>Placement Speed (%)</span>
              </button>
            </div>
          </div>

          {/* Bar Chart Section */}
          <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-8 items-center">
            
            {/* Recharts Bar Chart Container */}
            <div className="w-full h-[320px] sm:h-[380px] bg-paper/40 border border-border-custom/50 rounded-2xl p-3 sm:p-5">
              <ResponsiveContainer width="100%" height="100%">
                {activeTab === 'salary' ? (
                  <BarChart
                    data={COHORT_SALARY_DATA}
                    margin={{ top: 20, right: 15, left: -10, bottom: 25 }}
                    barGap={6}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border-custom)" />
                    <XAxis 
                      dataKey="cohort" 
                      stroke="var(--color-muted)" 
                      tickLine={false}
                      axisLine={false}
                      dy={10}
                      interval={0}
                      style={{ fontSize: '11px', fontFamily: 'var(--font-mono)' }}
                    />
                    <YAxis 
                      stroke="var(--color-muted)" 
                      tickLine={false}
                      axisLine={false}
                      dx={-4}
                      style={{ fontSize: '11px', fontFamily: 'var(--font-mono)' }}
                      tickFormatter={(val) => `₹${val}L`}
                    />
                    <Tooltip content={<CustomBarTooltip />} />
                    <Legend 
                      verticalAlign="top" 
                      align="right"
                      iconType="circle"
                      iconSize={8}
                      style={{ fontSize: '11px', fontFamily: 'var(--font-sans)', fontWeight: 600 }}
                      wrapperStyle={{ paddingBottom: '12px' }}
                    />
                    <Bar 
                      dataKey="postTraining" 
                      name="Post-Cohort Package" 
                      fill="var(--color-peacock)" 
                      radius={[6, 6, 0, 0]}
                    />
                    <Bar 
                      dataKey="preTraining" 
                      name="Pre-Cohort Baseline" 
                      fill="#94A3B8" 
                      radius={[6, 6, 0, 0]}
                    />
                  </BarChart>
                ) : (
                  <BarChart
                    data={PLACEMENT_TIMELINE_DATA}
                    margin={{ top: 20, right: 15, left: -10, bottom: 25 }}
                    barGap={6}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border-custom)" />
                    <XAxis 
                      dataKey="timeFrame" 
                      stroke="var(--color-muted)" 
                      tickLine={false}
                      axisLine={false}
                      dy={10}
                      style={{ fontSize: '11px', fontFamily: 'var(--font-mono)' }}
                    />
                    <YAxis 
                      stroke="var(--color-muted)" 
                      tickLine={false}
                      axisLine={false}
                      dx={-4}
                      style={{ fontSize: '11px', fontFamily: 'var(--font-mono)' }}
                      tickFormatter={(val) => `${val}%`}
                    />
                    <Tooltip content={<TimelineTooltip />} />
                    <Legend 
                      verticalAlign="top" 
                      align="right"
                      iconType="circle"
                      iconSize={8}
                      style={{ fontSize: '11px', fontFamily: 'var(--font-sans)', fontWeight: 600 }}
                      wrapperStyle={{ paddingBottom: '12px' }}
                    />
                    <Bar 
                      dataKey="rate" 
                      name="Our AI-Assisted Builders" 
                      fill="#059669" 
                      radius={[6, 6, 0, 0]}
                    />
                    <Bar 
                      dataKey="traditionalRate" 
                      name="Traditional CS Graduates" 
                      fill="#94A3B8" 
                      radius={[6, 6, 0, 0]}
                    />
                  </BarChart>
                )}
              </ResponsiveContainer>
            </div>

            {/* Right Side: Live Simulated Placement Spotlight & Highlights */}
            <div className="space-y-4">
              <div className="bg-paper border border-border-custom rounded-2xl p-4 sm:p-5 shadow-xs relative overflow-hidden">
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-[0.7rem] font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                    Live Alumni Feed
                  </span>
                  <span className="text-[0.65rem] font-mono text-muted">Auto-Updating</span>
                </div>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentItem.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.35 }}
                    className="space-y-2.5"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <h4 className="font-display font-extrabold text-ink text-base">
                          {currentItem.name}
                        </h4>
                        <span className="font-mono font-extrabold text-peacock text-sm bg-peacock/10 px-2 py-0.5 rounded-md">
                          {currentItem.package}
                        </span>
                      </div>
                      <p className="text-xs font-semibold text-peacock flex items-center gap-1">
                        <Briefcase className="w-3 h-3" /> {currentItem.role}
                      </p>
                      <p className="text-[0.72rem] text-muted flex items-center gap-1">
                        <Building2 className="w-3 h-3" /> {currentItem.company}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-border-custom/60 flex items-center justify-between text-[0.7rem] font-mono">
                      <span className="text-muted">Background: <strong className="text-ink dark:text-white">{currentItem.bg}</strong></span>
                      <span className="text-emerald-600 dark:text-emerald-400 font-bold">{currentItem.days}</span>
                    </div>
                  </motion.div>
                </AnimatePresence>

                {/* Micro indicators */}
                <div className="flex justify-center gap-1.5 mt-3 pt-2 border-t border-border-custom/40">
                  {RECENT_PLACEMENTS.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveFeedIndex(i)}
                      className={`h-1.5 rounded-full transition-all cursor-pointer ${
                        activeFeedIndex === i ? 'w-5 bg-peacock' : 'w-1.5 bg-border-custom'
                      }`}
                      aria-label={`Show placement ${i + 1}`}
                    />
                  ))}
                </div>
              </div>

              {/* Bottom Insight Card */}
              <div className="bg-gradient-to-br from-peacock/10 to-transparent border border-peacock/25 rounded-2xl p-4 sm:p-5">
                <div className="flex items-center gap-2 mb-2 text-peacock font-bold text-xs font-mono">
                  <Sparkles className="w-4 h-4" />
                  <span>Why Hiring Managers Prefer Our Builders</span>
                </div>
                <p className="text-ink dark:text-gray-200 text-xs leading-relaxed">
                  Instead of whiteboarding abstract algorithms, candidates showcase <strong>3 live production URLs with backend databases, authentication, and payments</strong> already working in the cloud.
                </p>
                <div className="mt-3 flex items-center gap-2">
                  <a 
                    href="#register" 
                    className="inline-flex items-center gap-1 text-[0.76rem] font-bold text-peacock hover:underline font-mono"
                  >
                    <span>Reserve seat for next cohort</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
