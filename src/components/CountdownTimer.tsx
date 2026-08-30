import { useEffect, useState } from 'react';
import { getUpcomingBatchSchedule } from '../lib/schedule';

export default function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState({
    days: '--',
    hours: '--',
    minutes: '--',
    seconds: '--',
    isLive: false,
  });

  useEffect(() => {
    const calculateTime = () => {
      const schedule = getUpcomingBatchSchedule();
      const targetTime = schedule.nearestBatch.getTime();
      const difference = targetTime - Date.now();

      if (difference <= 0) {
        setTimeLeft({
          days: '00',
          hours: '00',
          minutes: '00',
          seconds: '00',
          isLive: true,
        });
        return;
      }

      const d = Math.floor(difference / (1000 * 60 * 60 * 24));
      const h = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const m = Math.floor((difference / (1000 * 60)) % 60);
      const s = Math.floor((difference / 1000) % 60);

      const pad = (num: number) => String(num).padStart(2, '0');

      setTimeLeft({
        days: pad(d),
        hours: pad(h),
        minutes: pad(m),
        seconds: pad(s),
        isLive: false,
      });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);

    return () => clearInterval(interval);
  }, []);

  if (timeLeft.isLive) {
    return (
      <div className="flex bg-terminal/40 text-white rounded-custom-sm py-4 px-6 items-center justify-center gap-3 border border-terminal-line font-display min-w-[200px]" id="countdown-live">
        <span className="w-3 h-3 rounded-full bg-[#5BE3A8] animate-pulse-fast"></span>
        <strong className="text-xl font-bold uppercase tracking-wide">BATCH IS LIVE</strong>
      </div>
    );
  }

  const units = [
    { label: 'Days', value: timeLeft.days, id: 'timer-days' },
    { label: 'Hrs', value: timeLeft.hours, id: 'timer-hours' },
    { label: 'Min', value: timeLeft.minutes, id: 'timer-minutes' },
    { label: 'Sec', value: timeLeft.seconds, id: 'timer-seconds' },
  ];

  return (
    <div className="flex gap-3 md:gap-3.5" id="countdown-timer" aria-label="Countdown to cohort start">
      {units.map((unit) => (
        <div 
          key={unit.label} 
          id={unit.id}
          className="bg-terminal text-white rounded-custom-sm p-3.5 md:p-4.5 text-center min-w-[70px] md:min-w-[80px] border border-terminal-line shadow-md transition-all hover:border-marigold/40"
        >
          <strong className="block font-display text-xl md:text-2xl font-extrabold leading-tight tracking-tight text-white">
            {unit.value}
          </strong>
          <span className="font-mono text-[0.66rem] tracking-wider text-[#8A93B5] uppercase block mt-1">
            {unit.label}
          </span>
        </div>
      ))}
    </div>
  );
}
