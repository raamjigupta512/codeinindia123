import React, { useState, useEffect } from 'react';
import { Rocket, Clock, ShieldCheck, Zap, ArrowRight, Sparkles } from 'lucide-react';
import { getUpcomingBatchSchedule, BatchSchedule } from '../lib/schedule';

export default function TimeToShipCounter() {
  const [schedule, setSchedule] = useState<BatchSchedule>(() => getUpcomingBatchSchedule());
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    totalSeconds: 0,
    shipDateFormatted: ''
  });

  useEffect(() => {
    const updateCountdown = () => {
      const currentSched = getUpcomingBatchSchedule();
      setSchedule(currentSched);

      // Average student ships 1st project 48 hours after batch start
      const batchStartDate = currentSched.nearestBatch.getTime();
      const shipTargetTime = batchStartDate + (48 * 60 * 60 * 1000); // +48 Hours
      const now = Date.now();

      const diff = Math.max(0, shipTargetTime - now);
      const totalSeconds = Math.floor(diff / 1000);

      const days = Math.floor(totalSeconds / (3600 * 24));
      const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;

      const shipDateObj = new Date(shipTargetTime);
      const shipDateFormatted = new Intl.DateTimeFormat('en-IN', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
        hour: 'numeric',
        minute: '2-digit'
      }).format(shipDateObj);

      setTimeLeft({
        days,
        hours,
        minutes,
        seconds,
        totalSeconds,
        shipDateFormatted
      });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatDigit = (num: number) => String(num).padStart(2, '0');

  return (
    <div className="bg-card dark:bg-[#141C2E] border border-peacock/25 dark:border-peacock/30 rounded-xl sm:rounded-2xl p-3.5 sm:p-5 md:p-6 shadow-custom relative overflow-hidden my-3.5 sm:my-5">
      {/* Background Subtle Accent */}
      <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-peacock/10 rounded-full blur-2xl pointer-events-none" />

      {/* Header Label */}
      <div className="flex items-center justify-between gap-2 mb-2 sm:mb-3">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-7 h-7 sm:w-8 h-8 rounded-lg bg-peacock/10 text-peacock flex items-center justify-center shrink-0">
            <Rocket className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </div>
          <div className="min-w-0">
            <h4 className="font-display font-extrabold text-xs sm:text-sm md:text-base text-ink dark:text-white flex items-center gap-1.5 truncate">
              <span>Time to Ship First App</span>
              <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[0.62rem] sm:text-[0.68rem] font-mono font-bold bg-marigold/20 text-ink dark:text-marigold border border-marigold/30 shrink-0">
                <Zap className="w-2.5 h-2.5 text-amber-500 fill-amber-500" /> 48h Sprint
              </span>
            </h4>
            <p className="text-[0.68rem] sm:text-xs text-muted truncate">
              Live deployment target for next batch ({schedule.combinedShortDates})
            </p>
          </div>
        </div>

        <span className="shrink-0 text-[0.65rem] sm:text-[0.72rem] font-mono font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full border border-emerald-500/20 flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
          <span className="hidden xs:inline">Live</span> Countdown
        </span>
      </div>

      {/* Digits Grid */}
      <div className="grid grid-cols-4 gap-1.5 sm:gap-2.5 md:gap-3 my-2 sm:my-3.5">
        <div className="bg-paper dark:bg-[#0F172A] border border-border-custom dark:border-[#1E293B] rounded-lg sm:rounded-xl py-1.5 sm:py-2.5 px-1 text-center shadow-inner">
          <span className="block font-mono font-black text-xl sm:text-2xl md:text-3xl text-peacock leading-none mb-0.5">
            {formatDigit(timeLeft.days)}
          </span>
          <span className="text-[0.62rem] sm:text-[0.68rem] font-mono uppercase text-muted font-medium tracking-wider">
            Days
          </span>
        </div>

        <div className="bg-paper dark:bg-[#0F172A] border border-border-custom dark:border-[#1E293B] rounded-lg sm:rounded-xl py-1.5 sm:py-2.5 px-1 text-center shadow-inner">
          <span className="block font-mono font-black text-xl sm:text-2xl md:text-3xl text-peacock leading-none mb-0.5">
            {formatDigit(timeLeft.hours)}
          </span>
          <span className="text-[0.62rem] sm:text-[0.68rem] font-mono uppercase text-muted font-medium tracking-wider">
            Hours
          </span>
        </div>

        <div className="bg-paper dark:bg-[#0F172A] border border-border-custom dark:border-[#1E293B] rounded-lg sm:rounded-xl py-1.5 sm:py-2.5 px-1 text-center shadow-inner">
          <span className="block font-mono font-black text-xl sm:text-2xl md:text-3xl text-peacock leading-none mb-0.5">
            {formatDigit(timeLeft.minutes)}
          </span>
          <span className="text-[0.62rem] sm:text-[0.68rem] font-mono uppercase text-muted font-medium tracking-wider">
            Mins
          </span>
        </div>

        <div className="bg-paper dark:bg-[#0F172A] border border-border-custom dark:border-[#1E293B] rounded-lg sm:rounded-xl py-1.5 sm:py-2.5 px-1 text-center shadow-inner">
          <span className="block font-mono font-black text-xl sm:text-2xl md:text-3xl text-peacock leading-none mb-0.5">
            {formatDigit(timeLeft.seconds)}
          </span>
          <span className="text-[0.62rem] sm:text-[0.68rem] font-mono uppercase text-muted font-medium tracking-wider">
            Secs
          </span>
        </div>
      </div>

      {/* Footer Milestone Row */}
      <div className="pt-2 border-t border-border-custom/50 dark:border-[#1E293B] flex flex-row items-center justify-between gap-1.5 text-[0.68rem] sm:text-xs text-muted">
        <span className="flex items-center gap-1 truncate">
          <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-peacock shrink-0" />
          <span className="hidden sm:inline">Target Deployment:</span>
          <strong className="text-ink dark:text-white font-mono">{timeLeft.shipDateFormatted}</strong>
        </span>
        <span className="font-medium text-ink-soft dark:text-gray-300 flex items-center gap-1 shrink-0">
          <Sparkles className="w-3 h-3 text-marigold shrink-0" /> 
          <span className="hidden xs:inline">100% Student</span> Success Rate
        </span>
      </div>
    </div>
  );
}
