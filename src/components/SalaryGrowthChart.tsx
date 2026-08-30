import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { TrendingUp, Zap, Sparkles, HelpCircle } from 'lucide-react';

const data = [
  { year: 'Year 1', traditional: 4.5, ai: 6.5, diff: 2.0 },
  { year: 'Year 2', traditional: 6.0, ai: 9.5, diff: 3.5 },
  { year: 'Year 3', traditional: 8.0, ai: 14.0, diff: 6.0 },
  { year: 'Year 4', traditional: 10.5, ai: 19.5, diff: 9.0 },
  { year: 'Year 5', traditional: 13.0, ai: 26.0, diff: 13.0 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const aiVal = payload[0]?.value || 0;
    const tradVal = payload[1]?.value || 0;
    const premium = tradVal > 0 ? Math.round(((aiVal - tradVal) / tradVal) * 100) : 0;

    return (
      <div className="bg-card border border-border-custom p-4 rounded-custom-sm shadow-custom-sm font-sans text-xs min-w-[200px] backdrop-blur-sm bg-card/95">
        <p className="font-display font-extrabold text-ink text-sm mb-2 border-b border-border-custom/55 pb-1">{label} Projection</p>
        <div className="space-y-1.5">
          <p className="text-peacock font-semibold flex items-center justify-between gap-4">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-peacock" />
              AI-Assisted Dev:
            </span>
            <span className="font-mono font-bold">₹{aiVal.toFixed(1)} LPA</span>
          </p>
          <p className="text-muted font-medium flex items-center justify-between gap-4">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-400 dark:bg-slate-500" />
              Traditional Dev:
            </span>
            <span className="font-mono font-bold">₹{tradVal.toFixed(1)} LPA</span>
          </p>
        </div>
        <div className="mt-3 pt-2 border-t border-border-custom/55 flex items-center justify-between text-[0.72rem]">
          <span className="text-marigold-deep dark:text-marigold font-bold flex items-center gap-1">
            <Zap className="w-3 h-3 text-marigold" /> Premium:
          </span>
          <span className="text-emerald-600 dark:text-emerald-400 font-bold font-mono">
            +{premium}% Salary Gain
          </span>
        </div>
      </div>
    );
  }
  return null;
};

export default function SalaryGrowthChart() {
  const [activeMetric, setActiveMetric] = useState<'lpa' | 'pct'>('lpa');

  // Year 5 Difference in LPA
  const finalPremiumPercent = Math.round(((26 - 13) / 13) * 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6 }}
      className="mt-16 bg-card border border-border-custom rounded-custom p-6 md:p-10 shadow-sm"
      id="salary-growth-chart-card"
    >
      <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1.9fr] gap-8 lg:gap-12 items-center">
        {/* Descriptive Left Panel */}
        <div>
          <span className="inline-flex items-center gap-1.5 bg-peacock/10 text-peacock font-mono text-[0.72rem] font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-4">
            <TrendingUp className="w-3.5 h-3.5" /> Career Economics
          </span>
          <h3 className="font-display text-2xl md:text-3xl font-extrabold text-ink leading-tight mb-4">
            The AI-Assisted Multiplier Effect
          </h3>
          <p className="text-muted text-[0.95rem] leading-relaxed mb-5">
            Traditional junior developers struggle in today's market because they rely on slow, manual learning of outdated stacks. 
          </p>
          <p className="text-muted text-[0.95rem] leading-relaxed mb-6">
            By learning how to leverage AI pair-programming, databases, and quick deployments, our graduates perform like <strong className="text-ink font-semibold">mid-level engineers</strong> from Day 1, command higher salaries, and advance twice as fast.
          </p>

          <div className="space-y-4 border-t border-border-custom pt-5" id="growth-highlights">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-peacock/10 flex items-center justify-center text-peacock flex-none mt-0.5">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
              <div>
                <h4 className="font-sans font-bold text-ink text-sm">₹26 Lakhs Projected Year-5 LPA</h4>
                <p className="text-muted text-xs leading-normal">Fast-tracked to senior roles via highly leverageable AI workflows.</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-marigold/10 flex items-center justify-center text-marigold-deep dark:text-marigold flex-none mt-0.5">
                <Zap className="w-3.5 h-3.5" />
              </div>
              <div>
                <h4 className="font-sans font-bold text-ink text-sm">+{finalPremiumPercent}% Year-5 Premium</h4>
                <p className="text-muted text-xs leading-normal">Double the earning trajectory of an average manual boilerplate developer.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Recharts Graphical Right Panel */}
        <div className="bg-paper/50 border border-border-custom rounded-custom-sm p-4 sm:p-6" id="chart-panel">
          <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
            <div>
              <p className="font-sans font-bold text-ink text-xs uppercase tracking-wider font-mono text-muted">Projected Salary Growth</p>
              <h4 className="font-display text-lg font-bold text-ink">5-Year Compensation Trajectory</h4>
            </div>
            
            <div className="flex items-center gap-1.5 bg-paper border border-border-custom rounded-full p-1 select-none text-xs">
              <span className="font-sans font-semibold px-2.5 py-1 text-[0.72rem] text-muted">Figures in ₹ Lakhs Per Annum (LPA)</span>
            </div>
          </div>

          <div className="w-full h-[280px] sm:h-[340px] relative">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={data}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <defs>
                  {/* AI-Assisted Gradient */}
                  <linearGradient id="colorAi" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-peacock)" stopOpacity={0.25}/>
                    <stop offset="95%" stopColor="var(--color-peacock)" stopOpacity={0.0}/>
                  </linearGradient>
                  {/* Traditional Gradient */}
                  <linearGradient id="colorTrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#94A3B8" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="#94A3B8" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>

                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border-custom)" />
                
                <XAxis 
                  dataKey="year" 
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
                  style={{ fontSize: '11px', fontFamily: 'var(--font-mono)' }}
                  tickFormatter={(val) => `₹${val}L`}
                />
                
                <Tooltip content={<CustomTooltip />} />
                
                <Area 
                  type="monotone" 
                  dataKey="ai" 
                  name="AI-Assisted Dev"
                  stroke="var(--color-peacock)" 
                  strokeWidth={3} 
                  fillOpacity={1} 
                  fill="url(#colorAi)" 
                  activeDot={{ r: 6, strokeWidth: 0, fill: "var(--color-peacock)" }}
                />
                
                <Area 
                  type="monotone" 
                  dataKey="traditional" 
                  name="Traditional Dev"
                  stroke="#94A3B8" 
                  strokeWidth={2} 
                  strokeDasharray="4 4"
                  fillOpacity={1} 
                  fill="url(#colorTrad)" 
                  activeDot={{ r: 5, strokeWidth: 0, fill: "#64748B" }}
                />

                <Legend 
                  verticalAlign="bottom" 
                  height={36} 
                  iconType="circle"
                  iconSize={8}
                  style={{ fontSize: '11px', fontFamily: 'var(--font-sans)', fontWeight: 500 }}
                  wrapperStyle={{ paddingTop: '20px' }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <p className="text-center text-[0.72rem] text-muted mt-2 font-mono flex items-center justify-center gap-1">
            <HelpCircle className="w-3.5 h-3.5" /> Hover over the points to compare real-world premium metrics.
          </p>
        </div>
      </div>
    </motion.div>
  );
}
