import React, { useEffect, useRef } from 'react';

interface ConfettiPiece {
  x: number;
  y: number;
  w: number;
  h: number;
  color: string;
  shape: 'rect' | 'circle' | 'star';
  vx: number;
  vy: number;
  rotation: number;
  vRot: number;
  opacity: number;
  decay: number;
}

const COLORS = [
  '#EBA41E', // marigold
  '#D97706', // marigold-deep
  '#0D9488', // peacock
  '#10B981', // emerald
  '#3B82F6', // blue
  '#8B5CF6', // purple
  '#EC4899', // pink
  '#F59E0B', // amber gold
];

export default function ConfettiCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas dimensions
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * (window.devicePixelRatio || 1);
    canvas.height = rect.height * (window.devicePixelRatio || 1);
    ctx.scale(window.devicePixelRatio || 1, window.devicePixelRatio || 1);

    const width = rect.width;
    const height = rect.height;

    // Create particles originating from center/top burst
    const particles: ConfettiPiece[] = [];
    const particleCount = 90;

    for (let i = 0; i < particleCount; i++) {
      const angle = (Math.random() * Math.PI) - Math.PI; // Spread upwards and outwards
      const speed = Math.random() * 8 + 4;
      const shapes: Array<'rect' | 'circle' | 'star'> = ['rect', 'rect', 'circle', 'star'];
      
      particles.push({
        x: width / 2 + (Math.random() * 40 - 20),
        y: height * 0.35 + (Math.random() * 30 - 15),
        w: Math.random() * 8 + 6,
        h: Math.random() * 6 + 4,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        shape: shapes[Math.floor(Math.random() * shapes.length)],
        vx: Math.cos(angle) * speed * (Math.random() > 0.5 ? 1.2 : -1.2),
        vy: (Math.sin(angle) * speed * 1.5) - 3,
        rotation: Math.random() * 360,
        vRot: (Math.random() - 0.5) * 12,
        opacity: 1,
        decay: Math.random() * 0.008 + 0.005,
      });
    }

    let animationFrameId: number;
    const gravity = 0.18;
    const friction = 0.985;

    const drawStar = (cx: number, cy: number, spikes: number, outerRadius: number, innerRadius: number, fill: string) => {
      let rot = (Math.PI / 2) * 3;
      let x = cx;
      let y = cy;
      const step = Math.PI / spikes;

      ctx.beginPath();
      ctx.moveTo(cx, cy - outerRadius);
      for (let i = 0; i < spikes; i++) {
        x = cx + Math.cos(rot) * outerRadius;
        y = cy + Math.sin(rot) * outerRadius;
        ctx.lineTo(x, y);
        rot += step;

        x = cx + Math.cos(rot) * innerRadius;
        y = cy + Math.sin(rot) * innerRadius;
        ctx.lineTo(x, y);
        rot += step;
      }
      ctx.lineTo(cx, cy - outerRadius);
      ctx.closePath();
      ctx.fillStyle = fill;
      ctx.fill();
    };

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      let activeCount = 0;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        if (p.opacity <= 0.01) continue;

        activeCount++;

        p.x += p.vx;
        p.y += p.vy;
        p.vy += gravity;
        p.vx *= friction;
        p.rotation += p.vRot;
        p.opacity -= p.decay;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.globalAlpha = Math.max(0, p.opacity);

        if (p.shape === 'circle') {
          ctx.beginPath();
          ctx.arc(0, 0, p.w / 2, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.fill();
        } else if (p.shape === 'star') {
          drawStar(0, 0, 5, p.w * 0.9, p.w * 0.45, p.color);
        } else {
          ctx.fillStyle = p.color;
          ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        }

        ctx.restore();
      }

      if (activeCount > 0) {
        animationFrameId = requestAnimationFrame(render);
      }
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="absolute inset-0 w-full h-full pointer-events-none z-20"
      aria-hidden="true"
    />
  );
}
