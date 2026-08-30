import { useEffect, useState } from 'react';
import { Play } from 'lucide-react';

interface TerminalLine {
  html: string;
  delay: number;
}

const LINES: TerminalLine[] = [
  { html: '<span class="text-marigold font-bold">you@codeinindia</span> $ npx create-next-app chaiwala-saas', delay: 800 },
  { html: '<span class="text-[#8A93B5]/70">✔ Project scaffolded in 12s</span>', delay: 1000 },
  { html: '<span class="text-marigold font-bold">you@codeinindia</span> $ ai "add booking form + Razorpay + admin panel"', delay: 1100 },
  { html: '<span class="text-[#8A93B5]/70">⠸ Generating 14 files…</span>', delay: 1200 },
  { html: '<span class="text-[#5BE3A8] font-semibold">✔ Booking form wired to database</span>', delay: 500 },
  { html: '<span class="text-[#5BE3A8] font-semibold">✔ Razorpay checkout added (test mode)</span>', delay: 500 },
  { html: '<span class="text-[#5BE3A8] font-semibold">✔ Admin dashboard at /admin</span>', delay: 700 },
  { html: '<span class="text-marigold font-bold">you@codeinindia</span> $ deploy', delay: 900 },
  { html: '<span class="text-[#8A93B5]/70">⠹ Building… uploading… assigning domain…</span>', delay: 1500 },
  { html: '<span class="text-[#5BE3A8] font-semibold">✔ Deployed — https://chaiwala-saas.in</span>', delay: 500 }
];

export default function TerminalReplay() {
  const [displayedLines, setDisplayedLines] = useState<string[]>([]);
  const [showLiveBadge, setShowLiveBadge] = useState(false);

  useEffect(() => {
    let active = true;
    let timeouts: NodeJS.Timeout[] = [];

    const runReplay = () => {
      if (!active) return;
      setDisplayedLines([]);
      setShowLiveBadge(false);

      let accumulatedTime = 200;

      LINES.forEach((line, index) => {
        const timeout = setTimeout(() => {
          if (!active) return;
          setDisplayedLines(prev => [...prev, line.html]);

          // When the last line is displayed, reveal the "LIVE" badge shortly after
          if (index === LINES.length - 1) {
            const badgeTimeout = setTimeout(() => {
              if (active) setShowLiveBadge(true);
            }, 500);
            timeouts.push(badgeTimeout);

            // Restart loop after showing the final result for a bit
            const restartTimeout = setTimeout(() => {
              if (active) runReplay();
            }, 7000);
            timeouts.push(restartTimeout);
          }
        }, accumulatedTime);

        timeouts.push(timeout);
        accumulatedTime += line.delay;
      });
    };

    runReplay();

    return () => {
      active = false;
      timeouts.forEach(clearTimeout);
    };
  }, []);

  return (
    <div className="w-full">
      <div className="bg-terminal rounded-custom shadow-custom overflow-hidden border border-terminal-line relative min-h-[360px]" id="terminal-emulator">
        {/* Top title bar */}
        <div className="flex items-center gap-2 px-4 py-3 border-b border-terminal-line bg-terminal/50">
          <i className="w-2.5 h-2.5 rounded-full bg-[#FF5F57] inline-block"></i>
          <i className="w-2.5 h-2.5 rounded-full bg-[#FEBC2E] inline-block"></i>
          <i className="w-2.5 h-2.5 rounded-full bg-[#28C840] inline-block"></i>
          <span className="font-mono text-[0.72rem] text-[#8A93B5] ml-2">codeinindia — you, week 1</span>
        </div>

        {/* Content body */}
        <div className="p-5 md:p-6 font-mono text-[0.82rem] leading-[1.85] text-[#C9D2F0] min-h-[280px] flex flex-col gap-1.5 overflow-x-auto">
          {displayedLines.map((html, idx) => (
            <div 
              key={idx} 
              className="whitespace-pre-wrap animate-[fadeIn_0.3s_ease-out_forwards]"
              dangerouslySetInnerHTML={{ __html: html }}
            />
          ))}
          
          {/* Flashing typing cursor */}
          {!showLiveBadge && (
            <span className="inline-block w-2 h-4 bg-marigold/80 ml-1 animate-[pulse_1s_infinite]"></span>
          )}
        </div>

        {/* Live deploying popup badge */}
        <div 
          className={`absolute bottom-4 right-4 bg-peacock text-white font-mono text-[0.72rem] font-bold px-3.5 py-2 rounded-full flex items-center gap-2 shadow-lg transition-all duration-500 ease-out ${
            showLiveBadge ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-1 pointer-events-none'
          }`}
          id="terminal-live-badge"
        >
          <span className="w-2 h-2 rounded-full bg-[#5BE3A8] animate-pulse-fast"></span>
          <span>LIVE at chaiwala-saas.in</span>
        </div>
      </div>
    </div>
  );
}
