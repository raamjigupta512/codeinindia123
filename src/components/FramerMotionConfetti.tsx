import React, { useMemo } from 'react';
import { motion } from 'motion/react';

interface Particle {
  id: number;
  type: 'circle' | 'rect' | 'star' | 'ribbon' | 'dot';
  x: number; // initial burst offset X (px)
  y: number; // initial burst offset Y (px)
  targetX: number; // final X (px)
  targetY: number; // final Y (px)
  rotate: number; // rotation degree
  targetRotate: number;
  scale: number;
  color: string;
  duration: number;
  delay: number;
  size: number;
}

interface FramerMotionConfettiProps {
  particleCount?: number;
  originY?: number; // percentage from top (0-100), default 22
  ambientCount?: number;
}

const BRAND_COLORS = [
  '#10B981', // Emerald
  '#059669', // Dark Emerald
  '#34D399', // Light Emerald
  '#0D9488', // Peacock
  '#14B8A6', // Teal
  '#EBA41E', // Marigold
  '#F59E0B', // Amber
  '#3B82F6', // Blue
  '#8B5CF6', // Violet
  '#EC4899', // Pink
];

export default function FramerMotionConfetti({
  particleCount = 42,
  originY = 22,
  ambientCount = 14
}: FramerMotionConfettiProps) {
  // Generate deterministic-looking random particles on mount
  const particles: Particle[] = useMemo(() => {
    const items: Particle[] = [];
    const types: Array<'circle' | 'rect' | 'star' | 'ribbon' | 'dot'> = [
      'circle', 'rect', 'star', 'ribbon', 'dot', 'rect', 'circle'
    ];

    for (let i = 0; i < particleCount; i++) {
      // Angle spreading outwards 360 degrees, slightly biased upwards
      const angle = (Math.PI * 2 * (i / particleCount)) + (Math.random() * 0.4 - 0.2);
      const distance = 80 + Math.random() * 160;
      const speedY = Math.random() * 40 - 20;

      const targetX = Math.cos(angle) * distance * (Math.random() * 0.6 + 0.7);
      const targetY = Math.sin(angle) * distance * (Math.random() * 0.5 + 0.6) + speedY + 40; // gravity effect

      items.push({
        id: i,
        type: types[i % types.length],
        x: (Math.random() - 0.5) * 20,
        y: (Math.random() - 0.5) * 20,
        targetX,
        targetY,
        rotate: Math.random() * 90 - 45,
        targetRotate: Math.random() * 720 - 360,
        scale: Math.random() * 0.5 + 0.6,
        color: BRAND_COLORS[i % BRAND_COLORS.length],
        duration: 1.4 + Math.random() * 0.8,
        delay: Math.random() * 0.12,
        size: 5 + Math.random() * 6
      });
    }

    return items;
  }, [particleCount]);

  // Ambient floating sparkles in the background
  const ambientSparkles = useMemo(() => {
    return Array.from({ length: ambientCount }).map((_, i) => ({
      id: i,
      x: 10 + Math.random() * 80, // %
      y: 10 + Math.random() * 80, // %
      scale: 0.5 + Math.random() * 0.7,
      color: BRAND_COLORS[i % BRAND_COLORS.length],
      duration: 2.2 + Math.random() * 2,
      delay: 0.3 + Math.random() * 1.5
    }));
  }, [ambientCount]);

  return (
    <div 
      className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden z-20"
      aria-hidden="true"
    >
      {/* 1. Subtle expanding shockwave / celebratory aura from origin */}
      <div 
        className="absolute left-1/2 -translate-x-1/2 flex items-center justify-center pointer-events-none"
        style={{ top: `${originY}%` }}
      >
        <motion.div
          initial={{ scale: 0.3, opacity: 0.8 }}
          animate={{ scale: 3.2, opacity: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="w-24 h-24 rounded-full border border-emerald-500/40 bg-emerald-500/10 absolute"
        />
        <motion.div
          initial={{ scale: 0.2, opacity: 0.9 }}
          animate={{ scale: 2.4, opacity: 0 }}
          transition={{ duration: 1.0, ease: "easeOut", delay: 0.1 }}
          className="w-20 h-20 rounded-full border border-marigold/40 bg-marigold/5 absolute"
        />
      </div>

      {/* 2. Framer Motion Burst Confetti Particles */}
      <div 
        className="absolute left-1/2 -translate-x-1/2 pointer-events-none"
        style={{ top: `${originY}%` }}
      >
        {particles.map((p) => {
          let shapeContent = null;

          if (p.type === 'circle') {
            shapeContent = (
              <div 
                className="rounded-full shadow-xs"
                style={{
                  width: `${p.size}px`,
                  height: `${p.size}px`,
                  backgroundColor: p.color
                }}
              />
            );
          } else if (p.type === 'ribbon') {
            shapeContent = (
              <div 
                className="rounded-sm shadow-xs"
                style={{
                  width: `${p.size * 2.2}px`,
                  height: `${p.size * 0.65}px`,
                  backgroundColor: p.color
                }}
              />
            );
          } else if (p.type === 'star') {
            shapeContent = (
              <svg 
                viewBox="0 0 24 24" 
                className="w-3.5 h-3.5 drop-shadow-xs" 
                style={{ fill: p.color, width: `${p.size * 1.5}px`, height: `${p.size * 1.5}px` }}
              >
                <polygon points="12,2 15,9 22,9 17,14 19,21 12,17 5,21 7,14 2,9 9,9" />
              </svg>
            );
          } else if (p.type === 'dot') {
            shapeContent = (
              <div 
                className="rounded-full shadow-xs"
                style={{
                  width: `${Math.max(3, p.size * 0.6)}px`,
                  height: `${Math.max(3, p.size * 0.6)}px`,
                  backgroundColor: p.color
                }}
              />
            );
          } else {
            // rect
            shapeContent = (
              <div 
                className="rounded-xs shadow-xs"
                style={{
                  width: `${p.size * 1.3}px`,
                  height: `${p.size * 0.8}px`,
                  backgroundColor: p.color
                }}
              />
            );
          }

          return (
            <motion.div
              key={`particle-${p.id}`}
              initial={{
                x: p.x,
                y: p.y,
                scale: 0.1,
                rotate: p.rotate,
                opacity: 1
              }}
              animate={{
                x: p.targetX,
                y: [p.y - 15, p.targetY * 0.6, p.targetY], // arc path
                scale: [0.2, p.scale * 1.2, p.scale, 0],
                rotate: p.targetRotate,
                opacity: [1, 1, 0.85, 0]
              }}
              transition={{
                duration: p.duration,
                delay: p.delay,
                ease: [0.22, 1, 0.36, 1], // natural ease out
                times: [0, 0.4, 0.8, 1]
              }}
              className="absolute left-0 top-0 origin-center"
            >
              {shapeContent}
            </motion.div>
          );
        })}
      </div>

      {/* 3. Ambient Shimmering Stars in the background */}
      {ambientSparkles.map((s) => (
        <motion.div
          key={`sparkle-${s.id}`}
          initial={{ opacity: 0, scale: 0, rotate: 0 }}
          animate={{
            opacity: [0, 0.75, 0.9, 0],
            scale: [0, s.scale, s.scale * 1.15, 0],
            rotate: [0, 90, 180],
            y: [-5, -20, -35]
          }}
          transition={{
            duration: s.duration,
            delay: s.delay,
            repeat: Infinity,
            repeatDelay: 1.2,
            ease: "easeInOut"
          }}
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
          }}
          className="absolute pointer-events-none"
        >
          <svg 
            viewBox="0 0 24 24" 
            className="w-3 h-3 drop-shadow-xs" 
            style={{ fill: s.color }}
          >
            {/* 4-point sparkle star */}
            <path d="M12 0L14.5 9.5L24 12L14.5 14.5L12 24L9.5 14.5L0 12L9.5 9.5L12 0Z" />
          </svg>
        </motion.div>
      ))}
    </div>
  );
}
