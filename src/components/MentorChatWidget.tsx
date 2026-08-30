import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  MessageSquare, 
  X, 
  Send, 
  User, 
  Calendar, 
  Clock, 
  Check, 
  Sparkles, 
  ChevronRight, 
  HelpCircle,
  Phone,
  ShieldCheck
} from 'lucide-react';
import { getUpcomingBatchSchedule } from '../lib/schedule';

interface Message {
  id: string;
  sender: 'mentor' | 'user';
  text: string;
  timestamp: Date;
  isBooking?: boolean;
}

const QUICK_QUESTIONS = [
  { id: 'schedule', label: '🗓️ Book 1-on-1 Free Call' },
  { id: 'prereqs', label: '💻 Who is this course for?' },
  { id: 'duration', label: '⏳ Timing & Duration' }
];

const AVAILABLE_DAYS = [
  { dateStr: 'Today', date: new Date() },
  { dateStr: 'Tomorrow', date: new Date(Date.now() + 86400000) },
  { dateStr: 'Day after', date: new Date(Date.now() + 172800000) }
];

const TIME_SLOTS = [
  '11:00 AM - 11:30 AM',
  '02:30 PM - 03:00 PM',
  '04:00 PM - 04:30 PM',
  '06:30 PM - 07:00 PM'
];

export default function MentorChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [hasUnread, setHasUnread] = useState(true);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  // Booking states
  const [bookingStep, setBookingStep] = useState<'idle' | 'selecting_day' | 'selecting_time' | 'entering_details' | 'confirmed'>('idle');
  const [selectedDay, setSelectedDay] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [bookingName, setBookingName] = useState('');
  const [bookingPhone, setBookingPhone] = useState('');
  const [bookingEmail, setBookingEmail] = useState('');

  const chatEndRef = useRef<HTMLDivElement>(null);

  // Initial welcome message
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          id: 'welcome',
          sender: 'mentor',
          text: "Hi there! 👋 I'm Rohan, Senior Mentor here at CodeInIndia. I've helped over 500+ students transition into high-paying web developer roles.",
          timestamp: new Date()
        },
        {
          id: 'welcome-2',
          sender: 'mentor',
          text: "Are you looking to accelerate your engineering career? Ask me anything, or click below to schedule a quick 1-on-1 counseling call with me!",
          timestamp: new Date()
        }
      ]);
    }
  }, [messages]);

  // Scroll to bottom on new messages
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping, bookingStep]);

  // Handle open/close
  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setHasUnread(false);
    }
  };

  // Automated Mentor Responses
  const simulateMentorResponse = (userText: string) => {
    setIsTyping(true);
    
    // Determine answer based on keywords
    let responseText = "That's a great question! Our comprehensive syllabus is designed exactly to help you learn standard production practices. Would you like to hop on a quick 1-on-1 call so we can map out a custom study plan for you?";
    const cleanText = userText.toLowerCase();

    if (cleanText.includes('prereq') || cleanText.includes('who') || cleanText.includes('background') || cleanText.includes('eligibility')) {
      responseText = "No coding background is required! We start from absolute scratch with Web Foundations (HTML/CSS) in Week 1, then scale up to advanced React architectures. Anyone with high dedication can master it.";
    } else if (cleanText.includes('time') || cleanText.includes('duration') || cleanText.includes('when') || cleanText.includes('long') || cleanText.includes('schedule')) {
      const sched = getUpcomingBatchSchedule();
      responseText = `Our cohort runs live sessions every upcoming Tuesday and Friday evening at 5:00 PM! Next upcoming sessions: ${sched.shortTuesdayFormatted} & ${sched.shortFridayFormatted}. Plus, you get lifetime access to recordings, mock terminals, and structured Slack forums.`;
    } else if (cleanText.includes('placement') || cleanText.includes('job') || cleanText.includes('salary') || cleanText.includes('hire') || cleanText.includes('hiring')) {
      responseText = "Yes! We provide complete portfolio-building reviews, automated resume polishing, and direct referrals to top tech startups. 94% of our past students secure developer roles within 6 months of finishing.";
    } else if (cleanText.includes('fee') || cleanText.includes('price') || cleanText.includes('cost') || cleanText.includes('discount')) {
      responseText = "Seat reservation for the Live AI Masterclass is 100% free! For our intensive workshops — the 1-Day Dynamic Website Workshop (Build 5 Websites in 1 Day) and the 2 Weekend Android App Cohort — you can reserve your seat and pay later. Simply choose your track to join our official community!";
    }

    setTimeout(() => {
      setIsTyping(false);
      setMessages(prev => [
        ...prev,
        {
          id: `reply-${Date.now()}`,
          sender: 'mentor',
          text: responseText,
          timestamp: new Date()
        }
      ]);
    }, 1800);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userText = inputValue;
    setMessages(prev => [
      ...prev,
      {
        id: `user-${Date.now()}`,
        sender: 'user',
        text: userText,
        timestamp: new Date()
      }
    ]);
    setInputValue('');

    simulateMentorResponse(userText);
  };

  const handleQuickQuestion = (id: string, label: string) => {
    // Add user message
    setMessages(prev => [
      ...prev,
      {
        id: `quick-${id}-${Date.now()}`,
        sender: 'user',
        text: label,
        timestamp: new Date()
      }
    ]);

    if (id === 'schedule') {
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        setBookingStep('selecting_day');
        setMessages(prev => [
          ...prev,
          {
            id: `book-prompt-${Date.now()}`,
            sender: 'mentor',
            text: "Let's schedule your 1-on-1 counseling session! Please pick a day that works best for you:",
            timestamp: new Date(),
            isBooking: true
          }
        ]);
      }, 800);
    } else if (id === 'prereqs') {
      simulateMentorResponse('who is this course for');
    } else if (id === 'duration') {
      simulateMentorResponse('timing & duration');
    }
  };

  const selectDay = (day: string) => {
    setSelectedDay(day);
    setBookingStep('selecting_time');
  };

  const selectTime = (time: string) => {
    setSelectedTime(time);
    setBookingStep('entering_details');
  };

  const submitBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingName.trim() || !bookingPhone.trim()) return;

    setBookingStep('confirmed');
    
    // Add confirmation messages to the chat flow
    setTimeout(() => {
      setMessages(prev => [
        ...prev,
        {
          id: `confirm-msg-${Date.now()}`,
          sender: 'mentor',
          text: `🎉 Perfect! Your 1-on-1 call with me is successfully booked.\n\n📅 Date: ${selectedDay}\n🕒 Time: ${selectedTime}\n👤 Student: ${bookingName}\n📞 Phone: ${bookingPhone}\n\nI'll call you on this number directly. Looking forward to our discussion!`,
          timestamp: new Date()
        }
      ]);
    }, 500);
  };

  const resetBooking = () => {
    setBookingStep('idle');
    setSelectedDay('');
    setSelectedTime('');
    setBookingName('');
    setBookingPhone('');
    setBookingEmail('');
  };

  return (
    <div className="fixed bottom-6 right-6 z-40 font-sans" id="mentor-chat-widget-root">
      {/* 1. CHAT TOGGLE BUTTON */}
      <motion.button
        onClick={toggleChat}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`w-14 h-14 rounded-full flex items-center justify-center shadow-2xl relative cursor-pointer z-50 border transition-all ${
          isOpen 
            ? 'bg-ink border-border-custom text-white' 
            : 'bg-peacock border-peacock/20 text-white hover:shadow-peacock/20'
        }`}
        id="mentor-chat-toggle"
        aria-label="Toggle Mentor Counseling Chat"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X className="w-6 h-6 stroke-[2.5]" />
            </motion.div>
          ) : (
            <motion.div
              key="chat"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="relative"
            >
              <MessageSquare className="w-6 h-6 stroke-[2.5]" />
              
              {/* Pulsing notification badge */}
              {hasUnread && (
                <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-marigold-deep border-2 border-peacock rounded-full flex items-center justify-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping absolute" />
                </span>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Popover Attention Grabber */}
      {hasUnread && !isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 10, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 1.5, type: 'spring' }}
          className="absolute bottom-16 right-0 bg-card border border-border-custom rounded-2xl p-3.5 shadow-xl w-[210px] select-none pointer-events-none"
        >
          <div className="flex gap-2 items-center">
            <div className="w-7 h-7 rounded-full bg-peacock/10 text-peacock flex items-center justify-center font-display font-extrabold text-[0.68rem]">
              R
            </div>
            <div className="leading-tight">
              <p className="text-[0.65rem] text-muted font-bold uppercase tracking-wider">Online Mentor</p>
              <p className="text-xs font-extrabold text-ink">Have any questions? 👋</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* 2. CHAT PANEL WINDOW */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 25, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="absolute bottom-18 right-0 w-[360px] sm:w-[380px] h-[550px] bg-card border border-border-custom rounded-2xl shadow-2xl flex flex-col overflow-hidden z-40"
            id="mentor-chat-panel"
          >
            {/* Header */}
            <div className="p-4 bg-paper border-b border-border-custom/50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-peacock/10 border border-peacock/20 text-peacock font-display font-extrabold flex items-center justify-center text-sm">
                    RM
                  </div>
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-card rounded-full" />
                </div>
                <div>
                  <h4 className="font-display font-black text-[0.92rem] text-ink flex items-center gap-1 leading-none">
                    <span>Rohan Mehta</span>
                    <Sparkles className="w-3.5 h-3.5 text-marigold-deep dark:text-marigold" />
                  </h4>
                  <span className="text-[0.72rem] text-muted font-medium inline-block mt-0.5">Senior Career Counselor</span>
                </div>
              </div>
              
              <div className="flex items-center gap-1.5 text-[0.65rem] font-mono bg-emerald-500/5 text-emerald-700 dark:text-emerald-400 border border-emerald-500/10 px-2 py-0.5 rounded-full uppercase tracking-wider font-bold">
                <span>Active</span>
              </div>
            </div>

            {/* Messages Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin bg-paper/20">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[85%] rounded-2xl p-3.5 text-[0.84rem] leading-relaxed shadow-sm ${
                    msg.sender === 'user'
                      ? 'bg-peacock text-white rounded-tr-none'
                      : 'bg-card border border-border-custom/80 text-ink-soft rounded-tl-none'
                  }`}>
                    {/* Preserve linebreaks */}
                    <div className="whitespace-pre-line">{msg.text}</div>
                    <span className={`block text-[0.62rem] mt-1.5 text-right ${
                      msg.sender === 'user' ? 'text-white/70' : 'text-muted'
                    }`}>
                      {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              ))}

              {/* Dynamic Interactive Scheduler Embed */}
              {bookingStep !== 'idle' && (
                <div className="bg-card border-2 border-peacock/20 rounded-xl p-4 space-y-3.5 shadow-sm animate-[fadeIn_0.3s_ease-out_forwards]">
                  <div className="flex items-center gap-1.5 border-b border-border-custom/50 pb-2 mb-2">
                    <Calendar className="w-4 h-4 text-peacock" />
                    <span className="text-xs font-bold text-ink uppercase tracking-wider">Consultation Scheduler</span>
                  </div>

                  {/* Step A: Selecting Day */}
                  {bookingStep === 'selecting_day' && (
                    <div className="space-y-2">
                      <p className="text-[0.78rem] text-muted">Select a convenient day for your mentor call:</p>
                      <div className="grid grid-cols-3 gap-2">
                        {AVAILABLE_DAYS.map((dayObj, i) => {
                          const name = dayObj.dateStr;
                          const dateLabel = dayObj.date.toLocaleDateString([], { month: 'short', day: 'numeric' });
                          return (
                            <button
                              key={i}
                              onClick={() => selectDay(`${name} (${dateLabel})`)}
                              className="p-2 border border-border-custom hover:border-peacock/60 bg-paper hover:bg-peacock/5 rounded-lg text-center transition-all cursor-pointer"
                              type="button"
                            >
                              <span className="block text-[0.8rem] font-bold text-ink">{name}</span>
                              <span className="block text-[0.68rem] text-muted mt-0.5">{dateLabel}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Step B: Selecting Time */}
                  {bookingStep === 'selecting_time' && (
                    <div className="space-y-2">
                      <p className="text-[0.78rem] text-muted">Pick an available afternoon or evening slot:</p>
                      <div className="grid grid-cols-2 gap-2">
                        {TIME_SLOTS.map((slot) => (
                          <button
                            key={slot}
                            onClick={() => selectTime(slot)}
                            className="p-2 border border-border-custom hover:border-peacock/60 bg-paper hover:bg-peacock/5 rounded-lg text-center text-[0.75rem] font-medium text-ink transition-all cursor-pointer"
                            type="button"
                          >
                            {slot}
                          </button>
                        ))}
                      </div>
                      <button
                        onClick={() => setBookingStep('selecting_day')}
                        className="text-[0.72rem] text-peacock hover:underline mt-2 block font-semibold cursor-pointer"
                      >
                        ← Back to days
                      </button>
                    </div>
                  )}

                  {/* Step C: Entering Contact Details */}
                  {bookingStep === 'entering_details' && (
                    <form onSubmit={submitBooking} className="space-y-3">
                      <p className="text-[0.78rem] text-muted leading-relaxed">
                        Excellent! Booking for <strong className="text-ink">{selectedDay}</strong> at <strong className="text-ink">{selectedTime}</strong>. Provide your contact details below:
                      </p>
                      
                      <div className="space-y-2">
                        <input
                          type="text"
                          required
                          placeholder="Your full name"
                          className="w-full px-3 py-2 border border-border-custom rounded-lg text-xs bg-paper text-ink focus:outline-none focus:border-peacock"
                          value={bookingName}
                          onChange={(e) => setBookingName(e.target.value)}
                        />
                        <input
                          type="tel"
                          required
                          placeholder="WhatsApp / Phone Number"
                          className="w-full px-3 py-2 border border-border-custom rounded-lg text-xs bg-paper text-ink focus:outline-none focus:border-peacock"
                          value={bookingPhone}
                          onChange={(e) => setBookingPhone(e.target.value)}
                        />
                        <input
                          type="email"
                          placeholder="Email address (Optional)"
                          className="w-full px-3 py-2 border border-border-custom rounded-lg text-xs bg-paper text-ink focus:outline-none focus:border-peacock"
                          value={bookingEmail}
                          onChange={(e) => setBookingEmail(e.target.value)}
                        />
                      </div>

                      <div className="flex gap-2 pt-1.5">
                        <button
                          type="submit"
                          className="btn btn-primary flex-1 py-2 text-xs font-bold cursor-pointer"
                        >
                          Confirm Call Reservation
                        </button>
                        <button
                          type="button"
                          onClick={() => setBookingStep('selecting_time')}
                          className="btn btn-ghost px-3 border border-border-custom hover:border-ink/20 text-xs cursor-pointer"
                        >
                          Back
                        </button>
                      </div>
                    </form>
                  )}

                  {/* Step D: Confirmed */}
                  {bookingStep === 'confirmed' && (
                    <div className="text-center py-2 space-y-2">
                      <div className="w-9 h-9 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 flex items-center justify-center mx-auto mb-1">
                        <Check className="w-5 h-5 stroke-[2.5]" />
                      </div>
                      <h5 className="font-display font-extrabold text-ink text-sm">Slot Confirmed!</h5>
                      <p className="text-[0.74rem] text-muted leading-relaxed">
                        Your counselor session ticket has been logged. Rohan will call you on your mobile.
                      </p>
                      <button
                        onClick={resetBooking}
                        className="text-[0.72rem] text-peacock hover:underline font-bold cursor-pointer"
                      >
                        Book Another Session
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Typing indicator */}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-card border border-border-custom/80 rounded-2xl p-3.5 rounded-tl-none">
                    <div className="flex items-center gap-1.5 py-1">
                      <span className="w-2 h-2 rounded-full bg-muted animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-2 h-2 rounded-full bg-muted animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-2 h-2 rounded-full bg-muted animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}

              <div ref={chatEndRef} />
            </div>

            {/* Quick action triggers footer */}
            {bookingStep === 'idle' && (
              <div className="p-3 border-t border-border-custom/40 bg-paper/50 flex flex-wrap gap-1.5">
                {QUICK_QUESTIONS.map((q) => (
                  <button
                    key={q.id}
                    onClick={() => handleQuickQuestion(q.id, q.label)}
                    className="text-[0.7rem] font-bold text-ink-soft bg-card border border-border-custom/80 hover:border-peacock hover:text-peacock px-2.5 py-1.5 rounded-full transition-all cursor-pointer shadow-sm flex items-center gap-1"
                    type="button"
                  >
                    <span>{q.label}</span>
                  </button>
                ))}
              </div>
            )}

            {/* Free text input box */}
            <div className="p-4 bg-card border-t border-border-custom/60">
              <form onSubmit={handleSendMessage} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Ask a question about the syllabus..."
                  className="flex-1 px-3.5 py-2.5 border border-border-custom/80 rounded-xl text-xs bg-paper text-ink placeholder-muted focus:outline-none focus:border-peacock"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                />
                <button
                  type="submit"
                  className="bg-peacock hover:bg-peacock/90 text-white p-2.5 rounded-xl flex items-center justify-center transition-colors cursor-pointer"
                  aria-label="Send message"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
              <div className="flex items-center justify-center gap-1 mt-2 text-[0.6rem] text-muted">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Mentors typically reply within 5 minutes.</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
