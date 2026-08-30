import React, { useState, useEffect } from 'react';
import { motion, useScroll, useSpring, useTransform } from 'motion/react';
import { Sparkles, CheckCircle2, Rocket, ArrowDown } from 'lucide-react';
import { CURRICULUM_WEEKS } from '../types';

interface CurriculumProgressBarProps {
  timelineRef: React.RefObject<HTMLDivElement | null>;
}

export default function CurriculumProgressBar({ timelineRef }: CurriculumProgressBarProps) {
  const [progressVal, setProgressVal] = useState(0);

  // Monitor scroll progress across the curriculum timeline container
  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: ["start 75%", "end 35%"]
  });

  // Smooth out progress updates using Framer Motion spring physics
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 24,
    restDelta: 0.001
  });

  // Transform spring progress to CSS percentage width string
  const progressWidth = useTransform(smoothProgress, [0, 1], ["0%", "100%"]);

  useEffect(() => {
    const unsubscribe = smoothProgress.on("change", (latest) => {
      // Clamp between 0 and 1
      const clamped = Math.max(0, Math.min(1, latest));
      setProgressVal(clamped);
    });
    return () => unsubscribe();
  }, [smoothProgress]);

  // Determine active week based on scroll progress percentage
  // Week 1: 0% - 25% | Week 2: 25% - 55% | Week 3: 55% - 85% | Week 4: 85% - 100%
  const getActiveWeekNumber = () => {
    if (progressVal >= 0.85) return 4;
    if (progressVal >= 0.55) return 3;
    if (progressVal >= 0.25) return 2;
    return 1;
  };

  const activeWeekNo = getActiveWeekNumber();
  const activeWeekObj = CURRICULUM_WEEKS.find(w => w.weekNo === activeWeekNo) || CURRICULUM_WEEKS[0];
  const percentageInt = Math.round(progressVal * 100);

  // Smooth scroll to specific week card when milestone clicked
  const handleScrollToWeek = (weekNo: number) => {
    const el = document.getElementById(`curriculum-week-${weekNo}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <div className="w-full bg-paper dark:bg-[#141B2D] border border-border-custom dark:border-[#222C44] rounded-2xl p-5 md:p-6 shadow-sm mb-8 transition-colors duration-300">
      {/* Upper Status Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
          <span className="font-mono text-xs font-bold uppercase text-ink dark:text-white tracking-wider flex items-center gap-1.5">
            Student Journey Progress
          </span>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="text-muted dark:text-[#8A93B5]">
            Current Focus:
          </span>
          <span className="font-bold text-peacock bg-peacock/10 px-2.5 py-1 rounded-md border border-peacock/20">
            Week {activeWeekObj.weekNo}: {activeWeekObj.phase}
          </span>
          <span className="font-bold text-marigold-deep bg-marigold/10 dark:bg-marigold/20 px-2.5 py-1 rounded-md border border-marigold/30 text-ink dark:text-white">
            {percentageInt}% Journey
          </span>
        </div>
      </div>

      {/* Main Track & Progress Bar */}
      <div className="relative my-6 px-2 sm:px-4">
        {/* Background Track Line */}
        <div className="h-2.5 w-full bg-border-custom/50 dark:bg-[#202B48] rounded-full overflow-hidden relative">
          {/* Animated Gradient Progress Fill */}
          <motion.div
            className="h-full bg-gradient-to-r from-emerald-500 via-blue-500 to-peacock rounded-full transition-all duration-75"
            style={{ width: progressWidth }}
          />
        </div>

        {/* Milestone Nodes Layer */}
        <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 flex justify-between px-2 sm:px-4 pointer-events-none">
          {CURRICULUM_WEEKS.map((week) => {
            const milestoneThreshold = (week.weekNo - 1) / 3; // 0, 0.33, 0.66, 1.0
            const isReached = progressVal >= (milestoneThreshold - 0.05);
            const isCurrent = activeWeekNo === week.weekNo;

            return (
              <button
                key={week.weekNo}
                type="button"
                onClick={() => handleScrollToWeek(week.weekNo)}
                className={`pointer-events-auto flex flex-col items-center group cursor-pointer focus:outline-none transition-transform active:scale-95 ${
                  isCurrent ? 'scale-110' : ''
                }`}
                title={`Jump to Week ${week.weekNo}: ${week.phase}`}
              >
                {/* Node Circle */}
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-mono font-bold border-2 transition-all duration-300 ${
                    isCurrent
                      ? 'bg-peacock text-white border-peacock shadow-md shadow-peacock/30 ring-4 ring-peacock/20'
                      : isReached
                      ? 'bg-emerald-500 text-white border-emerald-500 shadow-sm'
                      : 'bg-card dark:bg-[#1C263F] text-muted border-border-custom dark:border-[#2E3C66]'
                  }`}
                >
                  {isReached && !isCurrent ? (
                    <CheckCircle2 className="w-4 h-4 text-white" />
                  ) : (
                    <span>{week.weekNo}</span>
                  )}
                </div>

                {/* Subtitle label for Milestone Node */}
                <div className="mt-2 text-center hidden sm:block">
                  <span
                    className={`block font-mono text-[0.68rem] font-bold uppercase tracking-wider transition-colors ${
                      isCurrent
                        ? 'text-peacock'
                        : isReached
                        ? 'text-emerald-600 dark:text-emerald-400'
                        : 'text-muted'
                    }`}
                  >
                    W{week.weekNo} · {week.phase}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Footer hint / prompt */}
      <div className="flex items-center justify-between text-[0.75rem] text-muted dark:text-[#8A93B5] pt-1">
        <span className="flex items-center gap-1 font-mono">
          <Sparkles className="w-3.5 h-3.5 text-marigold" />
          Scroll to trace weekly shipping milestones
        </span>
        <span className="hidden sm:inline-flex items-center gap-1 font-mono text-[0.7rem]">
          Click any week node to jump
          <ArrowDown className="w-3 h-3 text-peacock animate-bounce" />
        </span>
      </div>
    </div>
  );
}
