import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar, X, ArrowRight, Sparkles, Clock, Users } from 'lucide-react';
import { getUpcomingBatchSchedule } from '../lib/schedule';

interface BatchStartDateToastProps {
  /** Delay in milliseconds before scroll triggers notification (defaults to 30000ms = 30s) */
  timeThresholdMs?: number;
}

export default function BatchStartDateToast({ timeThresholdMs = 30000 }: BatchStartDateToastProps) {
  const [hasElapsed30s, setHasElapsed30s] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [schedule, setSchedule] = useState(getUpcomingBatchSchedule());

  useEffect(() => {
    // Check if previously dismissed in this session
    if (typeof window !== 'undefined') {
      const dismissed = sessionStorage.getItem('batch_announcement_toast_dismissed');
      if (dismissed === 'true') {
        setIsDismissed(true);
      }
    }

    // Refresh schedule timestamp
    setSchedule(getUpcomingBatchSchedule());

    // 30 seconds timer
    const timer = setTimeout(() => {
      setHasElapsed30s(true);
    }, timeThresholdMs);

    // Scroll listener
    const handleScroll = () => {
      // Trigger once user has scrolled at least 80px
      if (window.scrollY > 80) {
        setHasScrolled(true);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // In case user is already scrolled when 30s timer hits
    if (window.scrollY > 80) {
      setHasScrolled(true);
    }

    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [timeThresholdMs]);

  const handleDismiss = (e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    setIsDismissed(true);
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('batch_announcement_toast_dismissed', 'true');
    }
  };

  const handleScrollToRegister = (e: React.MouseEvent) => {
    e.preventDefault();
    handleDismiss();
    const registerSec = document.getElementById('register');
    if (registerSec) {
      registerSec.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const isVisible = hasElapsed30s && hasScrolled && !isDismissed;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="batch-start-date-toast"
          initial={{ opacity: 0, y: 30, scale: 0.94 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.94 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="fixed bottom-20 left-3 right-3 sm:right-auto sm:left-6 md:bottom-7 md:left-7 z-40 max-w-sm sm:max-w-md w-auto"
          role="status"
          aria-live="polite"
          id="batch-start-date-toast"
        >
          <div className="bg-card/95 dark:bg-[#141C2E]/95 backdrop-blur-md text-ink dark:text-white border border-peacock/30 dark:border-peacock/40 rounded-2xl p-4 sm:p-4.5 shadow-2xl shadow-peacock/10 relative overflow-hidden group">
            
            {/* Subtle Top Accent Gradient Line */}
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-peacock via-marigold to-emerald-500" />

            {/* Close / Dismiss Button */}
            <button
              type="button"
              onClick={handleDismiss}
              className="absolute top-3 right-3 text-muted hover:text-ink dark:hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
              aria-label="Dismiss notification"
              title="Dismiss notification"
              id="dismiss-batch-toast-btn"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-start gap-3.5 pr-5">
              {/* Animated Calendar Badge Icon */}
              <div className="relative flex-none mt-0.5">
                <div className="w-10 h-10 rounded-xl bg-peacock/10 dark:bg-peacock/20 border border-peacock/30 text-peacock flex items-center justify-center">
                  <Calendar className="w-5 h-5" />
                </div>
                <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-emerald-500 border-2 border-card animate-pulse" />
              </div>

              {/* Toast Details */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="bg-peacock/10 text-peacock dark:text-peacock-light text-[0.68rem] font-mono font-bold px-2 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-marigold" /> Next Live Batch
                  </span>
                  <span className="text-[0.7rem] text-muted font-medium flex items-center gap-1">
                    <Clock className="w-3 h-3 text-muted" /> 7:00 PM IST
                  </span>
                </div>

                <h4 className="font-display text-sm sm:text-[0.95rem] font-extrabold text-ink dark:text-white leading-tight">
                  Admissions Open for {schedule.nearestBatchFormatted}
                </h4>

                <p className="text-muted text-[0.78rem] sm:text-xs mt-1 leading-snug">
                  Live cohort starts in <strong className="text-ink dark:text-gray-200 font-semibold">{schedule.isNearestFriday ? 'Friday' : 'Tuesday'} evening</strong>. Only 4 live seats remaining for this week's cohort.
                </p>

                {/* Quick Action Button */}
                <div className="mt-3 flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={handleScrollToRegister}
                    className="btn btn-primary py-1.5 px-3.5 text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer"
                    id="toast-reserve-seat-btn"
                  >
                    <span>Reserve Seat</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={handleDismiss}
                    className="text-[0.72rem] text-muted hover:text-ink dark:hover:text-gray-300 font-medium px-2 py-1 transition-colors cursor-pointer"
                  >
                    Maybe later
                  </button>
                </div>

              </div>
            </div>

          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
