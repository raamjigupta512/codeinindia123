import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize2, 
  RotateCcw, 
  CheckCircle2, 
  Sparkles, 
  ArrowRight,
  UserCheck,
  TrendingUp,
  Award,
  Video
} from 'lucide-react';

export interface StudentVideoStory {
  id: string;
  name: string;
  role: string;
  location: string;
  project: string;
  achievement: string;
  duration: string;
  videoSrc: string; // HTML5 video or canvas simulation
  thumbnailAccent: string;
  tag: string;
  quote: string;
  stats: { label: string; value: string };
}

export const STUDENT_STORIES: StudentVideoStory[] = [
  {
    id: 'priya-sharma',
    name: 'Priya Sharma',
    role: 'Commerce Grad → Full-Stack Builder',
    location: 'Jaipur, Rajasthan',
    project: 'Svasthya Clinic Booking SaaS',
    achievement: '120+ Daily Appointments Managed',
    duration: '0:48',
    videoSrc: 'https://assets.mixkit.co/videos/preview/mixkit-software-developer-working-on-code-42848-large.mp4',
    thumbnailAccent: 'from-amber-500/30 to-orange-600/30',
    tag: 'Non-Tech to Tech',
    quote: 'Never wrote a line of code before Week 1. By Week 2, my father’s clinic had a real-time patient queue running on Vercel.',
    stats: { label: 'Time to First Launch', value: '14 Days' }
  },
  {
    id: 'arjun-ranjan',
    name: 'Arjun Ranjan',
    role: 'Freelance AI Web Developer',
    location: 'Pune, Maharashtra',
    project: 'E-commerce Custom Portal for Retailers',
    achievement: '₹35,000 First Client Retainer in 3 Weeks',
    duration: '0:55',
    videoSrc: 'https://assets.mixkit.co/videos/preview/mixkit-young-man-working-on-his-laptop-in-a-coffee-shop-42878-large.mp4',
    thumbnailAccent: 'from-teal-500/30 to-emerald-600/30',
    tag: 'Freelancing Success',
    quote: 'The AI pair-programming workflow changed everything. Instead of taking 2 months for a client build, I delivered in 4 days.',
    stats: { label: 'First Freelance Deal', value: '₹35,000' }
  },
  {
    id: 'sana-mirza',
    name: 'Sana Mirza',
    role: 'Founder, TiffinBox OS',
    location: 'Lucknow, UP',
    project: 'Subscription Meal-Plan Micro-SaaS',
    achievement: '40+ Monthly Recurring Subscribers',
    duration: '0:42',
    videoSrc: 'https://assets.mixkit.co/videos/preview/mixkit-woman-working-at-home-with-her-laptop-42867-large.mp4',
    thumbnailAccent: 'from-blue-500/30 to-indigo-600/30',
    tag: 'Micro-SaaS Launch',
    quote: 'Built Razorpay recurring subscriptions, customer billing portals, and kitchen delivery dashboards right from Week 3 lessons.',
    stats: { label: 'Monthly Recurring Revenue', value: '₹48,000/mo' }
  }
];

export default function TestimonialVideoPlayer() {
  const [selectedStory, setSelectedStory] = useState<StudentVideoStory>(STUDENT_STORIES[0]);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [progress, setProgress] = useState<number>(0);
  const [currentTime, setCurrentTime] = useState<string>('0:00');
  const [hasStarted, setHasStarted] = useState<boolean>(false);
  const [videoError, setVideoError] = useState<boolean>(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);

  const handleSelectStory = (story: StudentVideoStory) => {
    setSelectedStory(story);
    setIsPlaying(true);
    setHasStarted(true);
    setProgress(0);
    setVideoError(false);
  };

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play().catch(() => {
        // Autoplay policy fallback
        setIsMuted(true);
        if (videoRef.current) videoRef.current.play();
      });
      setIsPlaying(true);
      setHasStarted(true);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const current = videoRef.current.currentTime;
    const dur = videoRef.current.duration || 1;
    setProgress((current / dur) * 100);

    const mins = Math.floor(current / 60);
    const secs = Math.floor(current % 60);
    setCurrentTime(`${mins}:${secs < 10 ? '0' : ''}${secs}`);
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!videoRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const newRatio = clickX / rect.width;
    videoRef.current.currentTime = newRatio * (videoRef.current.duration || 0);
  };

  const handleVideoEnded = () => {
    setIsPlaying(false);
    setProgress(100);
  };

  const handleFullscreen = () => {
    if (videoRef.current) {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen();
      }
    }
  };

  useEffect(() => {
    if (videoRef.current && hasStarted) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(() => {
        setIsPlaying(false);
      });
    }
  }, [selectedStory]);

  return (
    <div className="mb-14 bg-card border border-border-custom rounded-custom p-5 sm:p-7 md:p-9 shadow-custom overflow-hidden" id="student-video-stories">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-border-custom/80">
        <div>
          <span className="inline-flex items-center gap-1.5 bg-peacock/10 text-peacock font-mono text-[0.72rem] font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-2">
            <Video className="w-3.5 h-3.5 animate-pulse" /> Video Success Stories
          </span>
          <h3 className="font-display text-2xl md:text-3xl font-extrabold text-ink leading-tight">
            Watch Them Build & Ship in Real-Time
          </h3>
          <p className="text-muted text-[0.92rem] mt-1 max-w-xl">
            Hear directly from graduates who had zero background in tech and shipped their own production products in 4 weeks.
          </p>
        </div>

        {/* Story Selector Pills */}
        <div className="flex flex-wrap items-center gap-2">
          {STUDENT_STORIES.map((story) => {
            const isCurrent = selectedStory.id === story.id;
            return (
              <button
                key={story.id}
                type="button"
                onClick={() => handleSelectStory(story)}
                className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-2 border ${
                  isCurrent
                    ? 'bg-peacock text-white border-peacock shadow-sm scale-102'
                    : 'bg-paper text-ink-soft hover:text-ink border-border-custom hover:border-peacock/40'
                }`}
                id={`video-tab-${story.id}`}
              >
                <span className={`w-2 h-2 rounded-full ${isCurrent ? 'bg-white animate-ping' : 'bg-peacock'}`} />
                <span>{story.name.split(' ')[0]}</span>
                <span className="opacity-75 text-[0.7rem]">({story.duration})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Video & Story Showcase Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.55fr_1fr] gap-6 md:gap-8 items-center mt-7">
        
        {/* Modern Video Player Shell */}
        <div className="relative rounded-2xl overflow-hidden bg-black aspect-video sm:aspect-[16/9.5] border border-border-custom shadow-lg group flex items-center justify-center">
          
          <video
            ref={videoRef}
            src={selectedStory.videoSrc}
            playsInline
            muted={isMuted}
            onTimeUpdate={handleTimeUpdate}
            onEnded={handleVideoEnded}
            onError={() => setVideoError(true)}
            className="w-full h-full object-cover"
          />

          {/* Overlay when paused or initial */}
          {(!isPlaying || !hasStarted) && (
            <div 
              onClick={togglePlay}
              className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/20 flex flex-col justify-between p-5 sm:p-7 cursor-pointer transition-opacity z-10"
            >
              <div className="flex items-center justify-between">
                <span className="bg-peacock/90 text-white font-mono text-[0.72rem] font-bold px-3 py-1 rounded-full uppercase tracking-wider backdrop-blur-xs flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-marigold" />
                  {selectedStory.tag}
                </span>
                <span className="text-white/80 font-mono text-xs bg-black/50 px-2.5 py-1 rounded-lg backdrop-blur-xs">
                  {selectedStory.duration} Video Clip
                </span>
              </div>

              {/* Center Play Button */}
              <div className="self-center flex flex-col items-center gap-2 text-center">
                <motion.div 
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-peacock/90 hover:bg-peacock text-white flex items-center justify-center shadow-xl backdrop-blur-xs pl-1 border-2 border-white/30"
                >
                  <Play className="w-7 h-7 sm:w-8 sm:h-8 fill-current" />
                </motion.div>
                <span className="text-white text-xs sm:text-sm font-bold font-display drop-shadow-md">
                  Click to watch {selectedStory.name}'s story
                </span>
              </div>

              {/* Bottom Quick Snippet */}
              <div className="text-left text-white/90">
                <p className="font-display font-bold text-sm sm:text-base drop-shadow-xs line-clamp-1">
                  {selectedStory.name} · {selectedStory.project}
                </p>
                <p className="text-[0.78rem] text-white/70 drop-shadow-xs">
                  {selectedStory.achievement}
                </p>
              </div>
            </div>
          )}

          {/* Floating Controls Bar (Shows on hover or when playing) */}
          <div className={`absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-3 sm:p-4 transition-opacity z-20 ${
            isPlaying ? 'opacity-0 group-hover:opacity-100 focus-within:opacity-100' : 'opacity-100'
          }`}>
            {/* Progress Bar */}
            <div 
              onClick={handleProgressClick}
              className="w-full h-1.5 bg-white/25 hover:h-2.5 rounded-full mb-3 cursor-pointer transition-all relative overflow-hidden"
            >
              <div 
                className="h-full bg-peacock rounded-full transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-white text-xs font-mono">
              <div className="flex items-center gap-3">
                <button 
                  type="button" 
                  onClick={togglePlay}
                  className="hover:text-peacock cursor-pointer p-1 transition-colors"
                  aria-label={isPlaying ? "Pause" : "Play"}
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
                </button>

                <button 
                  type="button" 
                  onClick={toggleMute}
                  className="hover:text-peacock cursor-pointer p-1 transition-colors flex items-center gap-1.5"
                  aria-label={isMuted ? "Unmute" : "Mute"}
                >
                  {isMuted ? <VolumeX className="w-4 h-4 text-amber-400" /> : <Volume2 className="w-4 h-4" />}
                  <span className="text-[0.7rem] hidden sm:inline">{isMuted ? 'Muted' : 'Sound On'}</span>
                </button>

                <span className="text-white/70 text-[0.72rem]">
                  {currentTime} / {selectedStory.duration}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="hidden sm:inline-block text-[0.7rem] text-emerald-400 font-bold bg-emerald-500/20 px-2 py-0.5 rounded">
                  Verified Graduate
                </span>
                <button 
                  type="button"
                  onClick={handleFullscreen}
                  className="hover:text-peacock cursor-pointer p-1 transition-colors"
                  aria-label="Fullscreen"
                >
                  <Maximize2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* Story Details Card */}
        <div className="space-y-4">
          
          <div className="p-5 sm:p-6 rounded-2xl bg-paper border border-border-custom shadow-xs space-y-4">
            
            {/* Student Badge & Project */}
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="text-[0.72rem] font-mono font-bold text-peacock uppercase tracking-wider bg-peacock/10 px-2.5 py-0.5 rounded-full inline-block mb-1.5">
                  {selectedStory.tag}
                </span>
                <h4 className="font-display text-xl sm:text-2xl font-extrabold text-ink leading-tight">
                  {selectedStory.name}
                </h4>
                <p className="text-xs text-muted font-medium mt-0.5">
                  {selectedStory.role} · <span className="text-ink-soft">{selectedStory.location}</span>
                </p>
              </div>

              <div className="w-12 h-12 rounded-full bg-peacock/10 border border-peacock/20 text-peacock flex items-center justify-center flex-none font-display font-extrabold text-base">
                {selectedStory.name.split(' ').map(n => n[0]).join('')}
              </div>
            </div>

            {/* Testimonial Quote */}
            <div className="p-3.5 rounded-xl bg-card border border-border-custom/80 relative">
              <p className="text-ink-soft text-xs sm:text-[0.88rem] italic leading-relaxed font-medium">
                "{selectedStory.quote}"
              </p>
            </div>

            {/* Metric / Milestone */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              <div className="p-3 rounded-xl bg-card border border-border-custom">
                <span className="text-[0.7rem] font-mono text-muted uppercase block mb-0.5">
                  {selectedStory.stats.label}
                </span>
                <span className="font-display font-extrabold text-base sm:text-lg text-emerald-600 dark:text-emerald-400">
                  {selectedStory.stats.value}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-card border border-border-custom">
                <span className="text-[0.7rem] font-mono text-muted uppercase block mb-0.5">
                  Live Project Shipped
                </span>
                <span className="font-display font-bold text-xs sm:text-sm text-ink truncate block">
                  {selectedStory.project}
                </span>
              </div>
            </div>

            {/* Fast Action CTA */}
            <div className="pt-2">
              <a 
                href="#register" 
                className="btn btn-primary w-full py-3 text-xs sm:text-sm font-bold flex items-center justify-center gap-2 cursor-pointer shadow-sm"
              >
                <span>Build Your Project Like {selectedStory.name.split(' ')[0]}</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
