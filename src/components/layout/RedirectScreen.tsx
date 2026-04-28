import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldCheck, ChevronRight, Lock, Globe, Loader2 } from 'lucide-react';
import { ModelProfile } from '../../types';
import { cn } from '../../lib/utils';
import { sanitizeImageUrl, isVideoUrl } from '../../lib/imageUtils';

interface RedirectScreenProps {
  model: ModelProfile | null;
  isOpen: boolean;
  onComplete: () => void;
  onCancel: () => void;
  duration?: number;
}

export default function RedirectScreen({ model, isOpen, onComplete, onCancel, duration = 3000 }: RedirectScreenProps) {
  const [progress, setProgress] = useState(0);
  const [count, setCount] = useState(Math.ceil(duration / 1000));
  const onCompleteRef = React.useRef(onComplete);

  // Keep onCompleteRef in sync
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    if (!isOpen) {
      setProgress(0);
      setCount(Math.ceil(duration / 1000));
      return;
    }

    // Reset values when opening
    setProgress(0);
    setCount(Math.ceil(duration / 1000));

    const interval = 50;
    const step = (interval / duration) * 100;

    const progressTimer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressTimer);
          return 100;
        }
        return prev + step;
      });
    }, interval);

    const countTimer = setInterval(() => {
      setCount(prev => {
        if (prev <= 1) {
          clearInterval(countTimer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    const completionTimer = setTimeout(() => {
      onCompleteRef.current();
    }, duration);

    return () => {
      clearInterval(progressTimer);
      clearInterval(countTimer);
      clearTimeout(completionTimer);
    };
  }, [isOpen, duration]);

  if (!model) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center overflow-hidden">
          {/* Deep Black Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/95"
          />

          {/* Golden Grid Overlay */}
          <div className="absolute inset-0 opacity-10 pointer-events-none" 
               style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #bf953f 1px, transparent 0)', backgroundSize: '40px 40px' }} 
          />

          {/* Content Container */}
          <div className="relative w-full max-w-2xl px-6">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.2 }}
              className="space-y-12"
            >
              {/* Security Header */}
              <div className="flex flex-col items-center gap-6">
                <div className="relative">
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                    className={cn(
                      "absolute -inset-4 border border-dashed rounded-full",
                      model.featured ? "border-blue-500/30" : "border-gold/30"
                    )}
                  />
                  <div className={cn(
                    "w-20 h-20 rounded-full border flex items-center justify-center relative z-10 transition-colors",
                    model.featured 
                      ? "bg-blue-600/10 border-blue-500 shadow-[0_0_20px_rgba(37,99,235,0.22)]" 
                      : "bg-gold/10 border-gold shadow-[0_0_20px_rgba(212,175,55,0.22)]"
                  )}>
                    <ShieldCheck className={cn("w-10 h-10", model.featured ? "text-blue-500" : "text-gold")} />
                  </div>
                </div>
                
                <div className="text-center space-y-2">
                  <div className={cn("flex items-center justify-center gap-3", model.featured ? "text-blue-500" : "text-gold")}>
                    <span className={cn("h-px w-10", model.featured ? "bg-blue-500/20" : "bg-gold/20")} />
                    <span className="text-[10px] font-black uppercase tracking-[0.5em]">Secure Gateway</span>
                    <span className={cn("h-px w-10", model.featured ? "bg-blue-500/20" : "bg-gold/20")} />
                  </div>
                  <h1 className="text-3xl font-black text-white uppercase italic tracking-tight">Verifying Link</h1>
                </div>
              </div>

              {/* Transfer Visual */}
                <div className="flex items-center justify-between gap-8 py-8 px-10 bg-white/5 border border-white/10 rounded-[32px] relative overflow-hidden group">
                  {/* Connecting Lines */}
                  <div className="absolute top-1/2 left-0 right-0 h-px bg-white/5 -translate-y-1/2" />
                  <motion.div 
                    initial={{ left: "0%" }}
                    animate={{ left: "100%" }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className={cn(
                      "absolute top-1/2 w-32 h-px -translate-y-1/2 blur-sm",
                      model.featured 
                        ? "bg-linear-to-r from-transparent via-blue-500 to-transparent" 
                        : "bg-linear-to-r from-transparent via-gold to-transparent"
                    )}
                  />
  
                  <div className="flex flex-col items-center gap-3 relative z-10">
                    <div className={cn(
                      "w-16 h-16 rounded-2xl border flex items-center justify-center shadow-2xl transition-colors",
                      model.featured ? "bg-blue-600/10 border-blue-500" : "bg-gold/10 border-gold"
                    )}>
                      <Globe className={cn("w-8 h-8", model.featured ? "text-blue-500" : "text-gold")} />
                    </div>
                    <span className="text-[9px] font-black text-white/40 uppercase tracking-widest">Main Directory</span>
                  </div>
  
                  <div className="flex flex-col items-center gap-2 relative z-10">
                    <motion.div 
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                      className={cn(
                        "text-4xl font-black font-mono italic transition-colors",
                        model.featured ? "text-blue-500" : "text-gold"
                      )}
                    >
                      {count}s
                    </motion.div>
                    <Loader2 className={cn("w-4 h-4 animate-spin", model.featured ? "text-blue-500" : "text-gold")} />
                  </div>
  
                  <div className="flex flex-col items-center gap-3 relative z-10">
                    <div className="w-16 h-16 rounded-2xl overflow-hidden border border-white/20">
                      {isVideoUrl(sanitizeImageUrl(model.thumbnail)) ? (
                        <video 
                          src={sanitizeImageUrl(model.thumbnail)} 
                          autoPlay 
                          loop 
                          muted 
                          playsInline 
                          className="w-full h-full object-cover" 
                        />
                      ) : (
                        <img 
                          src={sanitizeImageUrl(model.thumbnail)} 
                          alt={model.name} 
                          className="w-full h-full object-cover" 
                          referrerPolicy="no-referrer" 
                        />
                      )}
                    </div>
                    <span className={cn("text-[9px] font-black uppercase tracking-widest", model.featured ? "text-blue-500" : "text-gold")}>{model.name}</span>
                  </div>
                </div>

              {/* Progress & Disclaimer */}
                <div className="space-y-6">
                  {/* Visitor Count Social Proof */}
                  <div className="flex flex-col items-center">
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ type: "spring", stiffness: 200 }}
                      className="px-6 py-2.5 bg-linear-to-r from-orange-600/20 via-red-600/20 to-orange-600/20 border border-red-500/30 rounded-2xl flex items-center gap-3 backdrop-blur-sm shadow-[0_0_20px_rgba(239,68,68,0.1)] group cursor-default"
                    >
                      <motion.span 
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className="text-lg"
                      >
                        🔥
                      </motion.span>
                      <div className="flex flex-col items-start leading-none gap-0.5">
                        <span className="text-white font-black text-[11px] sm:text-xs uppercase tracking-[0.1em]">
                          {Math.floor((model.views || 0) * 0.2 + (model.clicks || 0) * 1.5 + 242).toLocaleString()} Users
                        </span>
                        <span className="text-white/60 font-medium text-[9px] uppercase tracking-widest">
                          unlocked this profile till yet
                        </span>
                      </div>
                    </motion.div>
                  </div>

                  <div className="space-y-3">
                  <div className="flex justify-between items-end">
                    <span className="text-[9px] font-black text-white/30 uppercase tracking-[0.2em]">Establishing Connection...</span>
                    <span className={cn("text-[10px] font-black font-mono", model.featured ? "text-blue-500" : "text-gold")}>{Math.round(progress)}%</span>
                  </div>
                  <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden border border-white/10">
                    <motion.div 
                      initial={{ width: "0%" }}
                      animate={{ width: `${progress}%` }}
                      className={cn(
                        "h-full",
                        model.featured 
                          ? "bg-linear-to-r from-blue-700 via-blue-500 to-blue-400" 
                          : "bg-linear-to-r from-gold-dark via-gold to-gold-light"
                      )}
                    />
                  </div>
                </div>

                <div className="flex flex-col items-center gap-6">
                  <div className="flex items-center gap-8 text-[9px] font-black uppercase tracking-[0.2em] text-white/20">
                    <div className="flex items-center gap-2">
                      <Lock className="w-3 h-3" /> Encrypted
                    </div>
                    <div className="flex items-center gap-2">
                      <Globe className="w-3 h-3" /> External
                    </div>
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-3 h-3" /> Verified
                    </div>
                  </div>

                  <button 
                    onClick={onComplete}
                    className={cn(
                      "w-full py-4 font-black uppercase tracking-[0.2em] rounded-2xl transition-all flex items-center justify-center gap-3 group",
                      model.featured 
                        ? "bg-blue-600 hover:bg-blue-500 text-white shadow-[0_10px_30px_rgba(37,99,235,0.3)]" 
                        : "bg-gold hover:bg-gold-light text-black shadow-[0_10px_30px_rgba(212,175,55,0.3)]"
                    )}
                  >
                    Proceed Now
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>

                  <button 
                    onClick={onCancel}
                    className="text-[10px] font-black text-white/40 hover:text-white uppercase tracking-[0.3em] transition-colors flex items-center gap-2 group"
                  >
                    <XIcon className="w-3 h-3 group-hover:rotate-90 transition-transform" />
                    Cancel Redirection
                  </button>
                </div>
              </div>

              <div className="pt-10 text-center">
                <p className="text-[9px] font-medium text-white/20 uppercase tracking-[0.2em] leading-relaxed max-w-sm mx-auto">
                  You are being redirected to a third-party platform. 
                  Please ensure you follow their safety protocols.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M18 6L6 18M6 6l12 12" />
    </svg>
  );
}
