import { useState } from 'react';
import { FAQ_ITEMS } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { Plus } from 'lucide-react';

export default function FaqAccordion() {
  const [openId, setOpenId] = useState<number | null>(null);

  const toggleFaq = (id: number) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <div className="max-w-[760px] mx-auto mt-11" id="faq-accordion-group">
      {FAQ_ITEMS.map((faq) => {
        const isOpen = openId === faq.id;
        return (
          <div 
            key={faq.id} 
            className="bg-card border border-border-custom rounded-custom-sm mb-3.5 overflow-hidden transition-all duration-200 hover:border-ink/20 hover:shadow-custom-sm"
          >
            <button
              onClick={() => toggleFaq(faq.id)}
              className="w-full bg-none border-none p-5 md:p-6 flex justify-between items-center gap-4 cursor-pointer font-sans text-base font-semibold text-ink text-left focus:outline-none focus:ring-2 focus:ring-marigold rounded-custom-sm"
              aria-expanded={isOpen}
              id={`faq-btn-${faq.id}`}
            >
              <span className="font-sans font-semibold text-ink select-none">{faq.question}</span>
              <span 
                className={`flex-none text-marigold-deep transition-transform duration-300 ease-out flex items-center justify-center`}
                style={{ transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)' }}
              >
                <Plus className="w-5 h-5" />
              </span>
            </button>

            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25, ease: "easeInOut" }}
                >
                  <div className="px-5 pb-5 md:px-6 md:pb-6 text-muted text-[0.95rem] leading-relaxed border-t border-border-custom/30 pt-3">
                    {faq.answer}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
