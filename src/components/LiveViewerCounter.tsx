import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Users, Eye, TrendingUp } from 'lucide-react';

interface LiveViewerCounterProps {
  variant?: 'pill' | 'badge' | 'card';
  className?: string;
}

export default function LiveViewerCounter({ variant = 'pill', className = '' }: LiveViewerCounterProps) {
  // Realistic base number of live concurrent viewers
  const [viewerCount, setViewerCount] = useState(() => {
    // Generate initial count between 42 and 58
    return Math.floor(Math.random() * 16) + 43;
  });
  
  const [trend, setTrend] = useState<'up' | 'down' | 'neutral'>('up');
  const [isPulsing, setIsPulsing] = useState(false);

  useEffect(() => {
    // Periodically fluctuate viewer count organically
    const interval = setInterval(() => {
      setViewerCount((prev) => {
        // Delta between -2 and +3, weighted towards growth
        const deltas = [-2, -1, 1, 1, 2, 2, 3];
        const delta = deltas[Math.floor(Math.random() * deltas.length)];
        let nextCount = prev + delta;

        // Keep within a realistic 38 - 68 range
        if (nextCount < 38) nextCount = 38 + Math.floor(Math.random() * 5);
        if (nextCount > 68) nextCount = 68 - Math.floor(Math.random() * 5);

        setTrend(delta >= 0 ? 'up' : 'down');
        setIsPulsing(true);
        setTimeout(() => setIsPulsing(false), 1200);

        return nextCount;
      });
    }, 5500 + Math.random() * 3000);

    return () => clearInterval(interval);
  }, []);

  if (variant === 'card') {
    return (
      <div 
        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-500/10 dark:bg-emerald-950/40 border border-emerald-500/30 text-ink dark:text-emerald-300 text-xs shadow-xs ${className}`}
        id="hero-live-counter-card"
      >
        <span className="relative flex h-2.5 w-2.5 shrink-0">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
        </span>
        <Users className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
        <div className="flex items-center gap-1 font-mono">
          <AnimatePresence mode="popLayout">
            <motion.span
              key={viewerCount}
              initial={{ y: -8, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 8, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="font-bold text-emerald-700 dark:text-emerald-300"
            >
              {viewerCount}
            </motion.span>
          </AnimatePresence>
          <span className="text-muted text-[0.72rem] font-sans font-medium">students viewing now</span>
        </div>
      </div>
    );
  }

  // Default 'pill' variant for hero badge rows
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className={`inline-flex items-center gap-1.5 sm:gap-2 py-1 sm:py-1.5 px-2.5 sm:px-3.5 rounded-full border border-emerald-500/30 dark:border-emerald-500/40 bg-emerald-500/10 dark:bg-emerald-950/30 text-ink dark:text-emerald-200 font-mono text-[0.7rem] sm:text-[0.74rem] shadow-xs backdrop-blur-xs select-none transition-all ${
        isPulsing ? 'ring-2 ring-emerald-500/30' : ''
      } ${className}`}
      id="hero-live-counter-pill"
      title="Live concurrent visitors actively exploring courses on CodeInIndia"
    >
      {/* Live animated pulsing radar dot */}
      <span className="relative flex h-2 w-2 shrink-0">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
      </span>

      <Users className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />

      {/* Number with smooth entry animation */}
      <div className="flex items-center gap-1">
        <span className="font-extrabold text-emerald-700 dark:text-emerald-300 inline-flex overflow-hidden">
          <AnimatePresence mode="popLayout">
            <motion.span
              key={viewerCount}
              initial={{ y: -7, opacity: 0, scale: 0.8 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 7, opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              className="inline-block"
            >
              {viewerCount}
            </motion.span>
          </AnimatePresence>
        </span>
        <span className="text-ink-soft dark:text-gray-300 font-medium">
          students viewing now
        </span>
      </div>

      {/* Trend indicator */}
      {trend === 'up' && (
        <TrendingUp className="w-2.5 h-2.5 text-emerald-500 dark:text-emerald-400 shrink-0 hidden xs:inline opacity-80" />
      )}
    </motion.div>
  );
}
