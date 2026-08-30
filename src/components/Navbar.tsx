import React, { useState, useEffect } from 'react';
import { Menu, X, Sun, Moon } from 'lucide-react';
import { motion, AnimatePresence, useScroll, useSpring } from 'motion/react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme');
      if (saved === 'dark' || saved === 'light') return saved;
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'light';
  });

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const navLinks = [
    { label: "What you'll build", href: "#build" },
    { label: "Curriculum", href: "#curriculum" },
    { label: "Outcomes", href: "#student-outcomes-sec" },
    { label: "Pricing", href: "#pricing" },
    { label: "FAQ", href: "#faq" },
  ];

  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setIsOpen(false);
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-paper/85 backdrop-blur-md border-b border-border-custom">
      {/* Fixed thin scroll progress bar at the very top of the page */}
      <motion.div 
        className="fixed top-0 left-0 right-0 h-[3px] sm:h-[3.5px] bg-gradient-to-r from-marigold via-[#F59E0B] to-peacock origin-left z-[9999] pointer-events-none shadow-[0_1px_8px_rgba(235,164,30,0.45)]"
        style={{ scaleX }}
        id="scroll-progress-bar"
      />
      <div className="wrap flex items-center justify-between h-[70px]">
        {/* Left Section: Brand Logo + Primary Navigation Links */}
        <div className="flex items-center gap-7 lg:gap-9 xl:gap-11">
          {/* Logo */}
          <a 
            href="#top" 
            onClick={(e) => handleScroll(e, '#top')}
            className="font-display font-extrabold text-[1.32rem] no-underline flex items-center gap-2.5 text-ink group shrink-0"
            aria-label="CodeInIndia home"
            id="nav-logo"
          >
            <span className="w-3 h-3 rounded-[3px] bg-gradient-to-br from-marigold to-marigold-deep transform rotate-45 transition-transform duration-300 group-hover:rotate-[135deg]"></span>
            <span>Code<em className="not-italic text-marigold-deep">In</em>India</span>
          </a>

          {/* Desktop Primary Navigation Links */}
          <ul className="hidden lg:flex items-center gap-5 xl:gap-6 list-none m-0 p-0">
            {navLinks.map((link) => (
              <li key={link.href} className="flex items-center">
                <a 
                  href={link.href}
                  onClick={(e) => handleScroll(e, link.href)}
                  className="no-underline font-medium text-[0.92rem] text-ink-soft hover:text-ink transition-colors whitespace-nowrap"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Right Section: Desktop Action Items & CTA */}
        <div className="hidden md:flex items-center gap-3 lg:gap-4">
          {/* Theme Toggle Desktop */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-ink-soft/10 text-ink-soft hover:text-ink transition-colors cursor-pointer flex items-center justify-center border-none bg-transparent overflow-hidden"
            aria-label={theme === 'dark' ? "Switch to light mode" : "Switch to dark mode"}
            title={theme === 'dark' ? "Switch to light mode" : "Switch to dark mode"}
            type="button"
            id="theme-toggle-desktop"
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={theme}
                initial={{ y: -8, opacity: 0, rotate: -45 }}
                animate={{ y: 0, opacity: 1, rotate: 0 }}
                exit={{ y: 8, opacity: 0, rotate: 45 }}
                transition={{ duration: 0.18 }}
                className="flex items-center justify-center"
              >
                {theme === 'dark' ? (
                  <Sun className="w-5 h-5 text-marigold fill-marigold/10" />
                ) : (
                  <Moon className="w-5 h-5 text-ink-soft" />
                )}
              </motion.div>
            </AnimatePresence>
          </button>

          {/* Reserve My Seat Primary CTA */}
          <a 
            href="#register"
            onClick={(e) => handleScroll(e, '#register')}
            className="btn btn-primary px-[18px] lg:px-[22px] py-[9px] lg:py-[10px] text-[0.88rem] lg:text-[0.92rem] whitespace-nowrap"
            id="nav-reserve-seat-btn"
          >
            Reserve my seat
          </a>
        </div>

        {/* Mobile Hamburger Block & Theme Toggle */}
        <div className="flex items-center gap-2 md:hidden">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-ink-soft/10 text-ink-soft hover:text-ink transition-colors cursor-pointer flex items-center justify-center border-none bg-transparent overflow-hidden"
            aria-label={theme === 'dark' ? "Switch to light mode" : "Switch to dark mode"}
            title={theme === 'dark' ? "Switch to light mode" : "Switch to dark mode"}
            type="button"
            id="theme-toggle-mobile"
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={theme}
                initial={{ y: -8, opacity: 0, rotate: -45 }}
                animate={{ y: 0, opacity: 1, rotate: 0 }}
                exit={{ y: 8, opacity: 0, rotate: 45 }}
                transition={{ duration: 0.18 }}
                className="flex items-center justify-center"
              >
                {theme === 'dark' ? (
                  <Sun className="w-5 h-5 text-marigold fill-marigold/10" />
                ) : (
                  <Moon className="w-5 h-5 text-ink" />
                )}
              </motion.div>
            </AnimatePresence>
          </button>
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="bg-none border-none p-2 cursor-pointer text-ink hover:text-marigold transition-colors"
            aria-label={isOpen ? "Close menu" : "Open menu"}
            aria-expanded={isOpen}
            id="hamburger-btn"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="md:hidden bg-paper border-b border-border-custom overflow-hidden"
          >
            <ul className="flex flex-col gap-4 px-6 py-6 list-none items-stretch text-center">
              {navLinks.map((link) => (
                <li key={link.href} className="border-b border-border-custom/40 pb-3">
                  <a 
                    href={link.href}
                    onClick={(e) => handleScroll(e, link.href)}
                    className="no-underline font-medium text-[1.05rem] text-ink-soft hover:text-ink block"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
              <li className="pt-2">
                <a 
                  href="#register"
                  onClick={(e) => handleScroll(e, '#register')}
                  className="btn btn-primary w-full text-center"
                >
                  Reserve my seat
                </a>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
