import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowUp } from 'lucide-react';

export default function BackToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const checkScrollPosition = () => {
      // Show button when scrolled past the hero section (~450px)
      const heroElement = document.getElementById('top');
      const threshold = heroElement ? heroElement.offsetHeight * 0.75 : 450;
      
      if (window.scrollY > threshold) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    // Initial check
    checkScrollPosition();

    window.addEventListener('scroll', checkScrollPosition, { passive: true });
    return () => window.removeEventListener('scroll', checkScrollPosition);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          type="button"
          onClick={scrollToTop}
          initial={{ opacity: 0, scale: 0.7, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.7, y: 15 }}
          whileHover={{ scale: 1.12, y: -3 }}
          whileTap={{ scale: 0.92 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="fixed bottom-28 right-6 sm:bottom-24 sm:right-7 z-30 w-11 h-11 rounded-full bg-card/90 dark:bg-[#141C2E]/90 text-ink dark:text-white border border-border-custom hover:border-peacock hover:text-peacock dark:hover:text-peacock shadow-lg hover:shadow-custom backdrop-blur-md flex items-center justify-center cursor-pointer transition-colors group"
          id="back-to-top-btn"
          aria-label="Back to top of page"
          title="Back to Top"
        >
          <ArrowUp className="w-5 h-5 transition-transform duration-200 group-hover:-translate-y-0.5" />
          
          {/* Subtle hover tooltip */}
          <span className="absolute right-full mr-2.5 top-1/2 -translate-y-1/2 px-2.5 py-1 bg-ink text-paper text-[0.68rem] font-mono font-bold rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none shadow-md hidden sm:block">
            Back to Top
          </span>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
