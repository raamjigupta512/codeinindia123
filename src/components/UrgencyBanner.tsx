import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Clock, Flame, Sparkles, Zap, Calendar } from 'lucide-react';
import { getUpcomingBatchSchedule, BatchSchedule } from '../lib/schedule';

interface UrgencyBannerProps {
  /**
   * Custom threshold in hours before batch kickoff to trigger visibility.
   * Defaults to 48 hours.
   */
  thresholdHours?: number;
  /**
   * Optional custom target date override.
   * If omitted, dynamically tracks the upcoming batch date from schedule.
   */
  customTargetDate?: Date;
  /**
   * For testing or admin preview override to force-render the banner.
   */
  forceVisible?: boolean;
  /**
   * Optional CSS class names for container styling adjustments.
   */
  className?: string;
}

interface TimeRemaining {
  totalMs: number;
  hours: number;
  minutes: number;
  seconds: number;
  formattedHours: string;
  formattedMinutes: string;
  formattedSeconds: string;
  isUrgent: boolean;
  isLiveOrPassed: boolean;
}

export default function UrgencyBanner({
  thresholdHours = 48,
  customTargetDate,
  forceVisible = false,
  className = '',
}: UrgencyBannerProps) {
  const [schedule, setSchedule] = useState<BatchSchedule>(() => getUpcomingBatchSchedule());
  const [timeRemaining, setTimeRemaining] = useState<TimeRemaining>(() => {
    const target = customTargetDate || schedule.nearestBatch;
    const diff = target.getTime() - Date.now();
    const thresholdMs = thresholdHours * 60 * 60 * 1000;
    const pad = (n: number) => String(Math.max(0, n)).padStart(2, '0');

    const totalSec = Math.max(0, Math.floor(diff / 1000));
    const h = Math.floor(totalSec / 3600);
    const m = Math.floor((totalSec % 3600) / 60);
    const s = totalSec % 60;

    return {
      totalMs: diff,
      hours: h,
      minutes: m,
      seconds: s,
      formattedHours: pad(h),
      formattedMinutes: pad(m),
      formattedSeconds: pad(s),
      isUrgent: diff > 0 && diff <= thresholdMs,
      isLiveOrPassed: diff <= 0,
    };
  });

  useEffect(() => {
    const updateCountdown = () => {
      const currentSched = getUpcomingBatchSchedule();
      setSchedule(currentSched);
      const target = customTargetDate || currentSched.nearestBatch;
      const diff = target.getTime() - Date.now();
      const thresholdMs = thresholdHours * 60 * 60 * 1000;
      const pad = (n: number) => String(Math.max(0, n)).padStart(2, '0');

      const totalSec = Math.max(0, Math.floor(diff / 1000));
      const h = Math.floor(totalSec / 3600);
      const m = Math.floor((totalSec % 3600) / 60);
      const s = totalSec % 60;

      setTimeRemaining({
        totalMs: diff,
        hours: h,
        minutes: m,
        seconds: s,
        formattedHours: pad(h),
        formattedMinutes: pad(m),
        formattedSeconds: pad(s),
        isUrgent: diff > 0 && diff <= thresholdMs,
        isLiveOrPassed: diff <= 0,
      });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, [thresholdHours, customTargetDate]);

  const isVisible = forceVisible || timeRemaining.isUrgent || (forceVisible && timeRemaining.isLiveOrPassed);

  if (!isVisible) {
    return null;
  }

  const batchDateString = schedule.nearestBatchFormatted;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -12, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -10, scale: 0.98 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className={`mb-4 overflow-hidden rounded-2xl border border-amber-500/30 bg-gradient-to-r from-amber-500/10 via-rose-500/10 to-amber-500/15 p-3.5 sm:p-4 text-ink dark:text-white shadow-sm backdrop-blur-md relative ${className}`}
        id="urgency-banner"
        role="alert"
        aria-live="polite"
      >
        {/* Subtle Ambient Pulse Background Effect */}
        <div className="absolute -right-6 -top-6 w-24 h-24 bg-amber-500/15 rounded-full blur-xl pointer-events-none" />
        <div className="absolute -left-6 -bottom-6 w-24 h-24 bg-rose-500/15 rounded-full blur-xl pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Left info column: Icon + Badge + Copy */}
          <div className="flex items-start gap-2.5 min-w-0">
            <div className="relative flex-none mt-0.5">
              <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-rose-500 text-white shadow-xs">
                <Flame className="w-4 h-4 animate-pulse" />
              </span>
              <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500"></span>
              </span>
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="font-display font-extrabold text-xs sm:text-sm text-ink dark:text-white tracking-tight flex items-center gap-1">
                  <span>Batch Starts Soon</span>
                  <Sparkles className="w-3 h-3 text-amber-500 inline" />
                </span>
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-amber-500/20 text-amber-700 dark:text-amber-300 font-mono text-[0.65rem] font-bold uppercase tracking-wider border border-amber-500/30">
                  <Zap className="w-2.5 h-2.5 text-amber-500" />
                  &lt; 48h Left
                </span>
              </div>

              <p className="text-[0.78rem] text-muted dark:text-gray-300 mt-0.5 leading-snug truncate sm:whitespace-normal">
                Kickoff: <strong className="text-ink dark:text-white font-medium">{batchDateString}</strong> · Seats closing
              </p>
            </div>
          </div>

          {/* Right column: Live Real-time Digits Countdown */}
          <div className="flex items-center justify-between sm:justify-end gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-amber-500/20 flex-none">
            <div className="flex items-center gap-1.5 text-ink dark:text-white font-mono" id="urgency-banner-timer">
              {/* Hours Block */}
              <div className="flex flex-col items-center bg-card/80 dark:bg-[#11192E]/90 border border-amber-500/30 rounded-lg px-2 py-1 min-w-[38px] shadow-xs">
                <span className="text-xs sm:text-sm font-bold leading-none text-amber-600 dark:text-amber-400">
                  {timeRemaining.formattedHours}
                </span>
                <span className="text-[0.55rem] text-muted dark:text-gray-400 font-sans uppercase font-bold mt-0.5">
                  hrs
                </span>
              </div>

              <span className="font-bold text-amber-500 text-xs sm:text-sm animate-pulse">:</span>

              {/* Minutes Block */}
              <div className="flex flex-col items-center bg-card/80 dark:bg-[#11192E]/90 border border-amber-500/30 rounded-lg px-2 py-1 min-w-[38px] shadow-xs">
                <span className="text-xs sm:text-sm font-bold leading-none text-amber-600 dark:text-amber-400">
                  {timeRemaining.formattedMinutes}
                </span>
                <span className="text-[0.55rem] text-muted dark:text-gray-400 font-sans uppercase font-bold mt-0.5">
                  min
                </span>
              </div>

              <span className="font-bold text-amber-500 text-xs sm:text-sm animate-pulse">:</span>

              {/* Seconds Block */}
              <div className="flex flex-col items-center bg-card/80 dark:bg-[#11192E]/90 border border-amber-500/30 rounded-lg px-2 py-1 min-w-[38px] shadow-xs">
                <span className="text-xs sm:text-sm font-bold leading-none text-rose-600 dark:text-rose-400">
                  {timeRemaining.formattedSeconds}
                </span>
                <span className="text-[0.55rem] text-muted dark:text-gray-400 font-sans uppercase font-bold mt-0.5">
                  sec
                </span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
