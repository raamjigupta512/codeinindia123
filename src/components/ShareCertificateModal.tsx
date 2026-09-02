import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Share2, 
  Copy, 
  Check, 
  ExternalLink, 
  X, 
  Sparkles, 
  Award,
  MessageCircle
} from 'lucide-react';

interface ShareCertificateProps {
  certId: string;
  recipientName: string;
  title: string; // e.g., 'Full-Stack Software Engineering' or 'AI & Full-Stack Workshop'
  certType?: 'participation' | 'completion';
  buttonVariant?: 'primary' | 'secondary' | 'toolbar';
  className?: string;
}

export default function ShareCertificateModal({
  certId,
  recipientName,
  title,
  certType = 'completion',
  buttonVariant = 'secondary',
  className = ''
}: ShareCertificateProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedPost, setCopiedPost] = useState(false);

  // Generate full verification URL
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://codeinindia.in';
  const verifyUrl = `${baseUrl}/#verify/${certId}`;

  // Pre-filled captions for social platforms
  const isParticipation = certType === 'participation';
  
  const twitterMessage = isParticipation
    ? `🎓 Excited to share that I just earned my Certificate of Participation for the "${title}" workshop by @CodeInIndia! 🚀 Check out my verified credential:`
    : `🎉 Proud to announce that I've completed the intensive "${title}" program with @CodeInIndia! 💻 Check out my verified credential:`;

  const linkedinPost = isParticipation
    ? `🎓 Excited to share that I've successfully completed the live "${title}" workshop with CodeInIndia!\n\n` +
      `Gained hands-on experience building modern applications, full-stack architecture, and cloud deployment. Grateful to the mentors and engineering community for this opportunity! 🚀\n\n` +
      `Verify my official certificate here: ${verifyUrl}\n\n` +
      `#CodeInIndia #WebDevelopment #SoftwareEngineering #TechEducation #FullStack #DeveloperJourney`
    : `🎓 Thrilled to announce that I have successfully graduated from the intensive "${title}" cohort at CodeInIndia!\n\n` +
      `During this program, I built production-grade full-stack applications, mastered modern cloud workflows, and worked with modern frameworks.\n\n` +
      `You can view and verify my official accreditation here: ${verifyUrl}\n\n` +
      `#CodeInIndia #SoftwareEngineering #FullStackDeveloper #React #NodeJS #WebDev #TechCareers`;

  const handleShareLinkedIn = () => {
    // LinkedIn share URL with article URL
    const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(verifyUrl)}`;
    window.open(linkedinUrl, '_blank', 'noopener,noreferrer,width=650,height=650');
  };

  const handleShareTwitter = () => {
    // Twitter/X intent with text and URL
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(twitterMessage)}&url=${encodeURIComponent(verifyUrl)}&hashtags=CodeInIndia,WebDev,TechCareers`;
    window.open(twitterUrl, '_blank', 'noopener,noreferrer,width=600,height=500');
  };

  const handleShareWhatsApp = () => {
    const whatsappMsg = `${twitterMessage} ${verifyUrl}`;
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(whatsappMsg)}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(verifyUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    } catch {
      // Fallback
    }
  };

  const handleCopyFullPost = async () => {
    try {
      await navigator.clipboard.writeText(linkedinPost);
      setCopiedPost(true);
      setTimeout(() => setCopiedPost(false), 2500);
    } catch {
      // Fallback
    }
  };

  // Button styling based on variant
  const getButtonClass = () => {
    if (buttonVariant === 'primary') {
      return "py-2.5 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer";
    }
    if (buttonVariant === 'toolbar') {
      return "py-2.5 px-4 rounded-xl bg-[#16222F] hover:bg-[#1E2E3E] text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer border border-[#223548] hover:text-white";
    }
    return "btn btn-secondary text-xs font-mono font-semibold py-2 px-3.5 rounded-xl border border-border-custom flex items-center gap-1.5 cursor-pointer hover:border-blue-500/50 hover:text-blue-500 transition-colors";
  };

  return (
    <>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className={`${getButtonClass()} ${className}`}
        id={`share-cert-btn-${certId}`}
        title="Share certificate to LinkedIn or Twitter"
      >
        <Share2 className="w-3.5 h-3.5 text-blue-500" />
        <span>Share Certificate</span>
      </button>

      {/* Share Modal Dialog */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/75 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.2 }}
              className="w-full max-w-lg bg-[#0E1622] dark:bg-[#0E1622] border border-[#1E2E3E] rounded-3xl p-6 sm:p-7 text-slate-100 shadow-2xl relative overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between pb-4 border-b border-[#1E2E3E] mb-5">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400">
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                      <span>Share Your Achievement</span>
                      <Sparkles className="w-4 h-4 text-amber-400" />
                    </h3>
                    <p className="text-xs text-slate-400">
                      ID: <span className="font-mono text-amber-300 font-semibold">{certId}</span>
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-[#1A2838] transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Social Channels Direct Share */}
              <div className="space-y-4">
                <p className="text-xs text-slate-300">
                  Share directly with your network to showcase your verified engineering credential:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* LinkedIn Share Button */}
                  <button
                    type="button"
                    onClick={handleShareLinkedIn}
                    className="p-3.5 rounded-2xl bg-[#0A66C2] hover:bg-[#004182] text-white text-xs font-bold flex items-center justify-center gap-2.5 shadow-md transition-all cursor-pointer"
                  >
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.2a1.62 1.62 0 1 0 0 3.24 1.62 1.62 0 0 0 0-3.24" />
                    </svg>
                    <span>Share to LinkedIn</span>
                  </button>

                  {/* Twitter / X Share Button */}
                  <button
                    type="button"
                    onClick={handleShareTwitter}
                    className="p-3.5 rounded-2xl bg-black hover:bg-slate-900 border border-slate-700 text-white text-xs font-bold flex items-center justify-center gap-2.5 shadow-md transition-all cursor-pointer"
                  >
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                    <span>Share on X (Twitter)</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* WhatsApp Share */}
                  <button
                    type="button"
                    onClick={handleShareWhatsApp}
                    className="p-3 rounded-xl bg-[#25D366]/15 hover:bg-[#25D366]/25 border border-[#25D366]/40 text-[#25D366] text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Share on WhatsApp</span>
                  </button>

                  {/* Quick Copy Verification Link */}
                  <button
                    type="button"
                    onClick={handleCopyLink}
                    className="p-3 rounded-xl bg-[#14202C] hover:bg-[#1E2E3E] border border-[#223548] text-slate-200 text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    {copiedLink ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-400" />
                        <span className="text-emerald-400 font-bold">Link Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4 text-slate-400" />
                        <span>Copy Verify Link</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Pre-written Post Caption Box */}
                <div className="pt-3">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider font-semibold">
                      Ready-to-Post LinkedIn Caption:
                    </span>
                    <button
                      type="button"
                      onClick={handleCopyFullPost}
                      className="text-[11px] font-mono font-bold text-blue-400 hover:text-blue-300 flex items-center gap-1 cursor-pointer"
                    >
                      {copiedPost ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span className="text-emerald-400">Copied Post!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy Caption</span>
                        </>
                      )}
                    </button>
                  </div>
                  <div className="p-3 bg-[#080E14] border border-[#1E2E3E] rounded-xl text-xs text-slate-300 font-mono max-h-28 overflow-y-auto leading-relaxed select-all">
                    {linkedinPost}
                  </div>
                </div>

                {/* Direct Verification Link Preview */}
                <div className="p-2.5 rounded-xl bg-[#080E14]/70 border border-[#182635] flex items-center justify-between text-[11px] font-mono text-slate-400">
                  <span className="truncate mr-2 text-slate-300">{verifyUrl}</span>
                  <a
                    href={`#verify/${certId}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-400 hover:underline flex items-center gap-1 flex-none"
                  >
                    <span>Test Page</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
