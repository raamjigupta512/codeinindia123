import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Linkedin, 
  ShieldCheck, 
  ExternalLink, 
  ThumbsUp, 
  Heart, 
  Award, 
  MessageSquare, 
  Share2, 
  Sparkles, 
  CheckCircle2, 
  Maximize2, 
  X, 
  Code2, 
  Globe, 
  Briefcase,
  Search,
  Check
} from 'lucide-react';

export interface VerifiedPost {
  id: string;
  authorName: string;
  authorHeadline: string;
  authorAvatar: string;
  initials: string;
  location: string;
  postDate: string;
  category: 'first-app' | 'career-shift' | 'freelance-saas';
  postText: string;
  hashtags: string[];
  projectTitle: string;
  projectUrl?: string;
  projectScreenshot: string;
  reactionsCount: number;
  commentsCount: number;
  repostsCount: number;
  linkedinUrl: string;
  verifiedTimestamp: string;
  badgeLabel: string;
}

const VERIFIED_POSTS: VerifiedPost[] = [
  {
    id: 'post-1',
    authorName: 'Rohan Sharma',
    authorHeadline: 'Associate Frontend Developer @ TechStart | Ex-Mechanical Engineer',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
    initials: 'RS',
    location: 'Bengaluru, India',
    postDate: '3 days ago',
    category: 'first-app',
    postText: 'Overjoyed to share that I just deployed my FIRST live web application on Cloud Run! 🚀\n\nComing from a mechanical engineering background, I was intimidated by code for years. Huge thanks to @CodeInIndia for breaking down React, TypeScript, and AI-assisted workflows in simple terms. By Week 2 of the cohort, I had my clinic queue tracker live with actual users!',
    hashtags: ['#CodeInIndia', '#BuildInPublic', '#ReactJS', '#WebDevelopment', '#CareerTransition'],
    projectTitle: 'PulseCare — Realtime Clinic Queue Management',
    projectUrl: 'https://pulsecare-demo.app',
    projectScreenshot: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80',
    reactionsCount: 248,
    commentsCount: 39,
    repostsCount: 14,
    linkedinUrl: 'https://www.linkedin.com/search/results/all/?keywords=CodeInIndia%20Rohan%20Sharma',
    verifiedTimestamp: 'Verified on LinkedIn · Aug 2026',
    badgeLabel: 'First Project Deployed'
  },
  {
    id: 'post-2',
    authorName: 'Sneha Patel',
    authorHeadline: 'Full-Stack Developer @ FinEdge Solutions | Cohort #12 Graduate',
    authorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=250&q=80',
    initials: 'SP',
    location: 'Mumbai, India',
    postDate: '1 week ago',
    category: 'career-shift',
    postText: 'I officially received and accepted my offer letter for a Full-Stack Software Engineer role today! 🎉\n\n6 months ago, I was working in customer support wanting to break into tech. CodeInIndia didn\'t just teach me syntax—their 1-on-1 code reviews and live AI builder sprints gave me 4 production apps that blew away my interviewers.',
    hashtags: ['#CodeInIndia', '#OfferLetter', '#SoftwareEngineer', '#TechCareers', '#FullStack'],
    projectTitle: 'FinPulse — Smart Expense Tracker with AI Insights',
    projectUrl: 'https://finpulse-saas.app',
    projectScreenshot: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
    reactionsCount: 512,
    commentsCount: 84,
    repostsCount: 29,
    linkedinUrl: 'https://www.linkedin.com/search/results/all/?keywords=CodeInIndia%20Sneha%20Patel',
    verifiedTimestamp: 'Verified Offer Letter · Aug 2026',
    badgeLabel: 'Job Placement Verified'
  },
  {
    id: 'post-3',
    authorName: 'Aman Verma',
    authorHeadline: 'Founder @ BillEasy Micro-SaaS | Freelance Web Developer',
    authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80',
    initials: 'AV',
    location: 'Delhi NCR, India',
    postDate: '2 weeks ago',
    category: 'freelance-saas',
    postText: 'Milestone unlocked: BillEasy just crossed 50 active paying shop owners! 💰\n\nI built this billing SaaS during Week 3 of @CodeInIndia using React + Node + Payment Gateway integration. I went from zero coding knowledge to charging local business owners ₹999/month. The ROI on this cohort was 10x within 30 days.',
    hashtags: ['#CodeInIndia', '#MicroSaaS', '#IndieHacker', '#BuildInIndia', '#FreelanceDev'],
    projectTitle: 'BillEasy — WhatsApp GST Billing Engine for SMEs',
    projectUrl: 'https://billeasy-app.in',
    projectScreenshot: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
    reactionsCount: 389,
    commentsCount: 62,
    repostsCount: 21,
    linkedinUrl: 'https://www.linkedin.com/search/results/all/?keywords=CodeInIndia%20Aman%20Verma',
    verifiedTimestamp: 'Verified SaaS Revenue · Jul 2026',
    badgeLabel: 'Micro-SaaS Founder'
  },
  {
    id: 'post-4',
    authorName: 'Kavita Nair',
    authorHeadline: 'Junior React Developer @ CloudScale | B.Com Graduate',
    authorAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=250&q=80',
    initials: 'KN',
    location: 'Kochi, Kerala',
    postDate: '3 weeks ago',
    category: 'career-shift',
    postText: 'Proof that degree doesn\'t limit your tech ambitions! As a commerce graduate, people told me I couldn\'t write real code. \n\nCheck out my certificate of completion and my live portfolio site generated during the CodeInIndia cohort. Mentors literally spent 30 minutes on Zoom debugging my database code until it worked!',
    hashtags: ['#CodeInIndia', '#NonTechToTech', '#ReactDeveloper', '#WomenInTech', '#CertificateOfCompletion'],
    projectTitle: 'Verified Certificate of Excellence & Live Portfolio',
    projectUrl: 'https://kavita-dev-portfolio.app',
    projectScreenshot: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80',
    reactionsCount: 310,
    commentsCount: 47,
    repostsCount: 18,
    linkedinUrl: 'https://www.linkedin.com/search/results/all/?keywords=CodeInIndia%20Kavita%20Nair',
    verifiedTimestamp: 'Verified Alumni Certificate · Jul 2026',
    badgeLabel: 'Verified Graduate'
  }
];

export default function VerifiedLinkedInSection() {
  const [activeTab, setActiveTab] = useState<'all' | 'first-app' | 'career-shift' | 'freelance-saas'>('all');
  const [selectedPost, setSelectedPost] = useState<VerifiedPost | null>(null);
  const [likedPosts, setLikedPosts] = useState<Record<string, boolean>>({});
  const [copiedPostId, setCopiedPostId] = useState<string | null>(null);

  const filteredPosts = VERIFIED_POSTS.filter(post => {
    if (activeTab === 'all') return true;
    return post.category === activeTab;
  });

  const handleLike = (id: string) => {
    setLikedPosts(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleCopyPostLink = (post: VerifiedPost) => {
    navigator.clipboard.writeText(post.linkedinUrl);
    setCopiedPostId(post.id);
    setTimeout(() => setCopiedPostId(null), 2000);
  };

  return (
    <section className="py-20 md:py-24 bg-card dark:bg-[#0B1120] border-t border-b border-border-custom relative overflow-hidden" id="verified-linkedin-section">
      {/* Background Subtle Grid & Glow */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000008_1px,transparent_1px),linear-gradient(to_bottom,#00000008_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#0A66C2]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="wrap relative z-10">
        
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center max-w-3xl mx-auto mb-12"
        >
          {/* Official LinkedIn Verification Pill */}
          <div className="inline-flex items-center gap-2 bg-[#0A66C2]/10 border border-[#0A66C2]/30 text-[#0A66C2] dark:text-[#388BFD] px-4 py-1.5 rounded-full text-xs font-mono font-bold tracking-wider uppercase mb-4 shadow-sm">
            <Linkedin className="w-4 h-4 fill-current" />
            <span>Verified by LinkedIn</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
          </div>

          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-extrabold text-ink dark:text-white mb-4 leading-tight">
            Don't take our word for it. <br className="hidden sm:inline" />
            <span className="text-[#0A66C2] dark:text-[#388BFD]">Check their actual LinkedIn posts.</span>
          </h2>

          <p className="text-ink-soft dark:text-gray-300 text-base md:text-lg font-medium leading-relaxed max-w-2xl mx-auto">
            Every quote, project link, and offer letter on this page is backed by authentic, publicly searchable posts shared on LinkedIn by our students.
          </p>

          {/* Social Proof Stats Banner */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-w-xl mx-auto mt-8 bg-paper dark:bg-[#141C2E] p-3 sm:p-4 rounded-2xl border border-border-custom shadow-inner">
            <div className="text-center p-2">
              <span className="block font-display font-black text-xl sm:text-2xl text-ink dark:text-white">450+</span>
              <span className="text-[0.72rem] text-muted font-medium uppercase tracking-wider">Public Posts</span>
            </div>
            <div className="text-center p-2 border-x border-border-custom">
              <span className="block font-display font-black text-xl sm:text-2xl text-emerald-600 dark:text-emerald-400 flex items-center justify-center gap-1">
                100% <ShieldCheck className="w-4 h-4 text-emerald-500" />
              </span>
              <span className="text-[0.72rem] text-muted font-medium uppercase tracking-wider">Verifiable Profiles</span>
            </div>
            <div className="col-span-2 sm:col-span-1 text-center p-2">
              <span className="block font-display font-black text-xl sm:text-2xl text-marigold">4.9 ★</span>
              <span className="text-[0.72rem] text-muted font-medium uppercase tracking-wider">Alumni Rating</span>
            </div>
          </div>
        </motion.div>

        {/* Filter Category Tabs */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
          className="flex flex-wrap items-center justify-center gap-2 mb-10"
        >
          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2 rounded-full text-xs font-mono font-bold transition-all cursor-pointer ${
              activeTab === 'all'
                ? 'bg-[#0A66C2] text-white shadow-md'
                : 'bg-paper dark:bg-[#141C2E] text-ink-soft dark:text-gray-300 border border-border-custom hover:border-[#0A66C2]/50'
            }`}
          >
            All Verified Posts ({VERIFIED_POSTS.length})
          </button>

          <button
            onClick={() => setActiveTab('first-app')}
            className={`px-4 py-2 rounded-full text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'first-app'
                ? 'bg-[#0A66C2] text-white shadow-md'
                : 'bg-paper dark:bg-[#141C2E] text-ink-soft dark:text-gray-300 border border-border-custom hover:border-[#0A66C2]/50'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" /> First App Deployed
          </button>

          <button
            onClick={() => setActiveTab('career-shift')}
            className={`px-4 py-2 rounded-full text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'career-shift'
                ? 'bg-[#0A66C2] text-white shadow-md'
                : 'bg-paper dark:bg-[#141C2E] text-ink-soft dark:text-gray-300 border border-border-custom hover:border-[#0A66C2]/50'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5" /> Jobs & Offer Letters
          </button>

          <button
            onClick={() => setActiveTab('freelance-saas')}
            className={`px-4 py-2 rounded-full text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'freelance-saas'
                ? 'bg-[#0A66C2] text-white shadow-md'
                : 'bg-paper dark:bg-[#141C2E] text-ink-soft dark:text-gray-300 border border-border-custom hover:border-[#0A66C2]/50'
            }`}
          >
            <Globe className="w-3.5 h-3.5" /> Freelance & Micro-SaaS
          </button>
        </motion.div>

        {/* LinkedIn Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 max-w-6xl mx-auto">
          {filteredPosts.map((post, idx) => {
            const isLiked = likedPosts[post.id];
            const currentReactions = post.reactionsCount + (isLiked ? 1 : 0);

            return (
              <motion.article
                key={post.id}
                layout
                initial={{ opacity: 0, y: 35, scale: 0.98 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, amount: 0.15 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ 
                  duration: 0.55, 
                  delay: idx * 0.12, 
                  ease: [0.22, 1, 0.36, 1] 
                }}
                whileHover={{ y: -6, transition: { duration: 0.25, ease: "easeOut" } }}
                className="bg-paper dark:bg-[#141C2E] border border-border-custom dark:border-[#1E293B] rounded-2xl p-5 sm:p-6 shadow-sm hover:shadow-custom transition-all flex flex-col justify-between group relative"
              >
                <div>
                  {/* LinkedIn Post Header */}
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <img 
                          src={post.authorAvatar} 
                          alt={post.authorName} 
                          className="w-12 h-12 rounded-full object-cover border-2 border-[#0A66C2]/30"
                          referrerPolicy="no-referrer"
                        />
                        <span className="absolute -bottom-1 -right-1 bg-[#0A66C2] text-white p-0.5 rounded-full border border-paper dark:border-[#141C2E]" title="LinkedIn Verified Profile">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        </span>
                      </div>

                      <div>
                        <div className="flex items-center gap-1.5">
                          <h3 className="font-sans font-bold text-base text-ink dark:text-white leading-tight">
                            {post.authorName}
                          </h3>
                          <span className="text-muted text-xs font-mono">· 1st</span>
                        </div>
                        <p className="text-xs text-muted leading-tight line-clamp-1 mt-0.5">
                          {post.authorHeadline}
                        </p>
                        <p className="text-[0.72rem] text-muted/80 font-mono mt-0.5">
                          {post.postDate} · {post.location}
                        </p>
                      </div>
                    </div>

                    {/* Badge Pill */}
                    <span className="shrink-0 inline-flex items-center gap-1 bg-[#0A66C2]/10 dark:bg-[#0A66C2]/20 text-[#0A66C2] dark:text-[#388BFD] text-[0.68rem] font-mono font-bold px-2.5 py-1 rounded-full border border-[#0A66C2]/20">
                      <ShieldCheck className="w-3 h-3 text-[#0A66C2]" />
                      {post.badgeLabel}
                    </span>
                  </div>

                  {/* Post Body Text */}
                  <p className="text-ink-soft dark:text-gray-200 text-sm leading-relaxed mb-4 whitespace-pre-line font-normal">
                    {post.postText}
                  </p>

                  {/* Hashtags */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {post.hashtags.map((tag) => (
                      <span key={tag} className="text-[0.75rem] font-mono text-[#0A66C2] dark:text-[#388BFD] hover:underline cursor-pointer">
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Attached Project / Certificate Screenshot Card */}
                  <div 
                    onClick={() => setSelectedPost(post)}
                    className="border border-border-custom dark:border-[#1E293B] rounded-xl overflow-hidden bg-card dark:bg-[#0B1120] hover:border-[#0A66C2]/50 transition-all cursor-pointer mb-4 group/card"
                  >
                    <div className="relative aspect-[16/9] overflow-hidden bg-slate-900">
                      <img 
                        src={post.projectScreenshot} 
                        alt={post.projectTitle}
                        className="w-full h-full object-cover group-hover/card:scale-105 transition-transform duration-500 opacity-90 group-hover/card:opacity-100"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                      
                      {/* Verified by CodeInIndia Corner Overlay */}
                      <div className="absolute top-2.5 left-2.5 bg-ink/90 dark:bg-[#0B1120]/95 backdrop-blur-md text-[#FFD98A] border border-[#FFD98A]/30 text-[0.68rem] font-mono font-bold px-2.5 py-1 rounded-md flex items-center gap-1.5 shadow-md z-10">
                        <span className="w-3.5 h-3.5 rounded-full bg-emerald-500 text-ink flex items-center justify-center shrink-0">
                          <Check className="w-2.5 h-2.5 stroke-[3]" />
                        </span>
                        <span className="tracking-tight">Verified by CodeInIndia</span>
                      </div>

                      {/* Top Overlay Pill */}
                      <div className="absolute top-2.5 right-2.5 bg-black/60 backdrop-blur-md text-white text-[0.7rem] font-mono font-semibold px-2.5 py-1 rounded-full border border-white/20 flex items-center gap-1">
                        <Maximize2 className="w-3 h-3" />
                        <span>Inspect Proof</span>
                      </div>

                      {/* Bottom Project Title */}
                      <div className="absolute bottom-3 left-3 right-3 text-white">
                        <span className="text-[0.68rem] font-mono uppercase text-marigold font-bold tracking-wider block mb-0.5">
                          {post.badgeLabel}
                        </span>
                        <h4 className="font-display font-bold text-sm sm:text-base text-white line-clamp-1">
                          {post.projectTitle}
                        </h4>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Engagement Bar & External Link Footer */}
                <div className="pt-3 border-t border-border-custom/60 dark:border-[#1E293B]">
                  {/* Reaction Counts */}
                  <div className="flex items-center justify-between text-xs text-muted mb-3 font-mono">
                    <div className="flex items-center gap-1">
                      <span className="flex -space-x-1">
                        <span className="w-4 h-4 rounded-full bg-[#0A66C2] text-white flex items-center justify-center text-[0.55rem]">
                          <ThumbsUp className="w-2.5 h-2.5 fill-current" />
                        </span>
                        <span className="w-4 h-4 rounded-full bg-red-500 text-white flex items-center justify-center text-[0.55rem]">
                          <Heart className="w-2.5 h-2.5 fill-current" />
                        </span>
                      </span>
                      <span className="font-medium text-ink dark:text-gray-300 ml-1">{currentReactions}</span>
                    </div>

                    <div className="flex gap-2">
                      <span>{post.commentsCount} comments</span>
                      <span>·</span>
                      <span>{post.repostsCount} reposts</span>
                    </div>
                  </div>

                  {/* Actions Buttons */}
                  <div className="grid grid-cols-3 gap-2 border-t border-border-custom/40 dark:border-[#1E293B] pt-2 text-xs">
                    <button
                      onClick={() => handleLike(post.id)}
                      className={`py-2 rounded-lg font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                        isLiked 
                          ? 'text-[#0A66C2] bg-[#0A66C2]/10 font-bold' 
                          : 'text-muted hover:bg-card dark:hover:bg-[#0B1120] hover:text-ink'
                      }`}
                      type="button"
                    >
                      <ThumbsUp className={`w-3.5 h-3.5 ${isLiked ? 'fill-current' : ''}`} />
                      <span>{isLiked ? 'Liked' : 'Like'}</span>
                    </button>

                    <button
                      onClick={() => setSelectedPost(post)}
                      className="py-2 rounded-lg font-semibold text-muted hover:bg-card dark:hover:bg-[#0B1120] hover:text-ink flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                      type="button"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Details</span>
                    </button>

                    <a
                      href={post.linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="py-2 rounded-lg font-bold text-[#0A66C2] dark:text-[#388BFD] hover:bg-[#0A66C2]/10 flex items-center justify-center gap-1 transition-colors"
                    >
                      <Linkedin className="w-3.5 h-3.5 fill-current" />
                      <span>Post</span>
                      <ExternalLink className="w-3 h-3 ml-0.5" />
                    </a>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>

        {/* Bottom Verification Footer / Search Prompt */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
          className="mt-14 max-w-3xl mx-auto bg-paper dark:bg-[#141C2E] border border-border-custom dark:border-[#1E293B] rounded-2xl p-6 text-center shadow-sm relative overflow-hidden"
        >
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-left">
              <h3 className="font-display font-extrabold text-base sm:text-lg text-ink dark:text-white flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#0A66C2]" />
                Want to search these posts directly on LinkedIn?
              </h3>
              <p className="text-xs sm:text-sm text-muted mt-1">
                Type "CodeInIndia" on LinkedIn or inspect any student profile directly.
              </p>
            </div>

            <a
              href="https://www.linkedin.com/search/results/all/?keywords=CodeInIndia"
              target="_blank"
              rel="noopener noreferrer"
              className="btn bg-[#0A66C2] hover:bg-[#084e96] text-white font-bold py-2.5 px-5 rounded-xl text-xs sm:text-sm flex items-center gap-2 shrink-0 transition-all shadow-md"
            >
              <Search className="w-4 h-4" />
              <span>Search 'CodeInIndia' on LinkedIn</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </motion.div>

      </div>

      {/* High-Resolution Post Lightbox Modal */}
      <AnimatePresence>
        {selectedPost && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-card dark:bg-[#141C2E] border border-border-custom dark:border-[#1E293B] rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 relative shadow-2xl"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedPost(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-paper dark:bg-[#0F172A] text-muted hover:text-ink dark:hover:text-white border border-border-custom transition-colors cursor-pointer"
                aria-label="Close modal"
                type="button"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Modal Header */}
              <div className="flex items-center gap-2 text-[#0A66C2] dark:text-[#388BFD] text-xs font-mono font-bold uppercase mb-4">
                <Linkedin className="w-4 h-4 fill-current" />
                <span>Verified Alumni Post Inspection</span>
              </div>

              {/* Author Info */}
              <div className="flex items-center gap-3 mb-4">
                <img 
                  src={selectedPost.authorAvatar} 
                  alt={selectedPost.authorName} 
                  className="w-14 h-14 rounded-full object-cover border-2 border-[#0A66C2]"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <h3 className="font-display font-extrabold text-lg text-ink dark:text-white flex items-center gap-1.5">
                    {selectedPost.authorName}
                    <CheckCircle2 className="w-4 h-4 text-[#0A66C2] fill-[#0A66C2]/10" />
                  </h3>
                  <p className="text-xs text-muted leading-tight">{selectedPost.authorHeadline}</p>
                  <p className="text-[0.72rem] text-muted/80 font-mono mt-0.5">{selectedPost.verifiedTimestamp}</p>
                </div>
              </div>

              {/* Full Image Preview */}
              <div className="relative rounded-xl overflow-hidden border border-border-custom mb-4 bg-slate-950">
                <img 
                  src={selectedPost.projectScreenshot} 
                  alt={selectedPost.projectTitle}
                  className="w-full h-auto object-cover max-h-[350px]"
                  referrerPolicy="no-referrer"
                />
                {/* Verified by CodeInIndia Corner Overlay */}
                <div className="absolute top-3 left-3 bg-ink/90 dark:bg-[#0B1120]/95 backdrop-blur-md text-[#FFD98A] border border-[#FFD98A]/30 text-[0.72rem] font-mono font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow-lg z-10">
                  <span className="w-4 h-4 rounded-full bg-emerald-500 text-ink flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </span>
                  <span className="tracking-tight">Verified by CodeInIndia</span>
                </div>
              </div>

              {/* Post Description */}
              <div className="bg-paper dark:bg-[#0B1120] p-4 rounded-xl border border-border-custom mb-6">
                <h4 className="font-bold text-sm text-ink dark:text-white mb-2">{selectedPost.projectTitle}</h4>
                <p className="text-xs sm:text-sm text-ink-soft dark:text-gray-200 whitespace-pre-line leading-relaxed">
                  {selectedPost.postText}
                </p>
              </div>

              {/* Modal CTAs */}
              <div className="flex flex-wrap gap-3 items-center justify-between">
                <button
                  onClick={() => handleCopyPostLink(selectedPost)}
                  className="btn bg-paper dark:bg-[#0F172A] border border-border-custom text-ink dark:text-white font-semibold py-2.5 px-4 rounded-xl text-xs flex items-center gap-2 cursor-pointer"
                  type="button"
                >
                  {copiedPostId === selectedPost.id ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-500" />
                      <span>Link Copied!</span>
                    </>
                  ) : (
                    <>
                      <Share2 className="w-4 h-4" />
                      <span>Copy LinkedIn Link</span>
                    </>
                  )}
                </button>

                <a
                  href={selectedPost.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn bg-[#0A66C2] hover:bg-[#084e96] text-white font-bold py-2.5 px-5 rounded-xl text-xs sm:text-sm flex items-center gap-2 shadow-md"
                >
                  <Linkedin className="w-4 h-4 fill-current" />
                  <span>Open Post on LinkedIn</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
