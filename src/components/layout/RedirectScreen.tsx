import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldCheck, ChevronRight, Lock, Globe, Loader2 } from 'lucide-react';
import { ModelProfile } from '../../types';

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
      onComplete();
    }, duration + 500);

    return () => {
      clearInterval(progressTimer);
      clearInterval(countTimer);
      clearTimeout(completionTimer);
    };
  }, [isOpen, onComplete, duration]);

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
            className="absolute inset-0 bg-black backdrop-blur-3xl"
          />

          {/* Golden Grid Overlay */}
          <div className="absolute inset-0 opacity-10 pointer-events-none" 
               style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #bf953f 1px, transparent 0)', backgroundSize: '40px 40px' }} 
          />

          {/* Atmospheric Glow */}
          <motion.div 
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.07, 0.14, 0.07]
            }}
            transition={{ duration: 5, repeat: Infinity }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gold/10 blur-[150px] rounded-full"
          />

          {/* Content Container */}
          <div className="relative w-full max-w-2xl px-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -30 }}
              className="space-y-12"
            >
              {/* Security Header */}
              <div className="flex flex-col items-center gap-6">
                <div className="relative">
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                    className="absolute -inset-4 border border-dashed border-gold/30 rounded-full"
                  />
                  <div className="w-20 h-20 rounded-full bg-gold/10 border border-gold flex items-center justify-center relative z-10 shadow-[0_0_20px_rgba(212,175,55,0.22)]">
                    <ShieldCheck className="w-10 h-10 text-gold" />
                  </div>
                </div>
                
                <div className="text-center space-y-2">
                  <div className="flex items-center justify-center gap-3 text-gold">
                    <span className="h-px w-10 bg-gold/20" />
                    <span className="text-[10px] font-black uppercase tracking-[0.5em]">Secure Gateway</span>
                    <span className="h-px w-10 bg-gold/20" />
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
                  className="absolute top-1/2 w-32 h-px bg-linear-to-r from-transparent via-gold to-transparent -translate-y-1/2 blur-sm"
                />

                <div className="flex flex-col items-center gap-3 relative z-10">
                  <div className="w-16 h-16 rounded-2xl bg-gold/10 border border-gold flex items-center justify-center shadow-2xl">
                    <Globe className="w-8 h-8 text-gold" />
                  </div>
                  <span className="text-[9px] font-black text-white/40 uppercase tracking-widest">Main Directory</span>
                </div>

                <div className="flex flex-col items-center gap-2 relative z-10">
                  <motion.div 
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                    className="text-4xl font-black text-gold font-mono italic"
                  >
                    {count}s
                  </motion.div>
                  <Loader2 className="w-4 h-4 text-gold animate-spin" />
                </div>

                <div className="flex flex-col items-center gap-3 relative z-10">
                  <div className="w-16 h-16 rounded-2xl overflow-hidden border border-white/20">
                    <img src={model.thumbnail} alt={model.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </div>
                  <span className="text-[9px] font-black text-gold uppercase tracking-widest">{model.name}</span>
                </div>
              </div>

              {/* Progress & Disclaimer */}
              <div className="space-y-6">
                <div className="space-y-3">
                  <div className="flex justify-between items-end">
                    <span className="text-[9px] font-black text-white/30 uppercase tracking-[0.2em]">Establishing Connection...</span>
                    <span className="text-[10px] font-black text-gold font-mono">{Math.round(progress)}%</span>
                  </div>
                  <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden border border-white/10">
                    <motion.div 
                      initial={{ width: "0%" }}
                      animate={{ width: `${progress}%` }}
                      className="h-full bg-linear-to-r from-gold-dark via-gold to-gold-light"
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
                    onClick={onCancel}
                    className="text-[10px] font-black text-white/40 hover:text-white uppercase tracking-[0.3em] transition-colors flex items-center gap-2 group"
                  >
                    <X className="w-3 h-3 group-hover:rotate-90 transition-transform" />
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

function X({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M18 6L6 18M6 6l12 12" />
    </svg>
  );
}
