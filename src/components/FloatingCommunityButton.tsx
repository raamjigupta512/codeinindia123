import React from 'react';
import { motion } from 'motion/react';
import { Users, Sparkles } from 'lucide-react';
import { getWhatsappChannelUrl } from '../lib/whatsapp';

export default function FloatingCommunityButton() {
  const channelUrl = getWhatsappChannelUrl();

  return (
    <motion.a
      href={channelUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Join Official WhatsApp Community"
      id="floating-join-community-btn"
      className="fixed bottom-23 right-24 z-40 flex items-center gap-2 bg-gradient-to-r from-[#128C7E] to-[#25D366] hover:from-[#0F7A6E] hover:to-[#20BA5A] text-white px-3.5 py-2 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 group cursor-pointer border border-white/20 select-none"
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ 
        scale: 1, 
        opacity: 1,
      }}
      whileHover={{ scale: 1.06 }}
      whileTap={{ scale: 0.95 }}
    >
      {/* Gentle ambient pulsing beacon */}
      <span className="relative flex h-2.5 w-2.5">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white"></span>
      </span>

      {/* WhatsApp SVG Icon */}
      <svg 
        width="18" 
        height="18" 
        viewBox="0 0 24 24" 
        fill="#ffffff" 
        className="w-4.5 h-4.5 flex-none"
      >
        <path d="M12 2a10 10 0 00-8.6 15.1L2 22l5-1.3A10 10 0 1012 2zm0 18.2a8.2 8.2 0 01-4.2-1.1l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1112 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1-.2.2-.6.8-.8 1-.1.2-.3.2-.5.1a6.7 6.7 0 01-3.3-2.9c-.3-.4 0-.5.2-.7l.4-.5c.1-.2.1-.3 0-.5l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.5.1-.7.3-.2.3-.9.9-.9 2.2s.9 2.5 1.1 2.7c.1.2 1.9 2.9 4.6 4 .6.3 1.1.4 1.5.6.6.2 1.2.2 1.6.1.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.2-.3-.2-.5-.3z"/>
      </svg>

      {/* Button Text */}
      <span className="font-display font-bold text-xs tracking-wide whitespace-nowrap drop-shadow-xs">
        Join Community
      </span>

      {/* Sparkle subtle icon */}
      <Sparkles className="w-3.5 h-3.5 text-amber-200 group-hover:rotate-12 transition-transform" />
    </motion.a>
  );
}
