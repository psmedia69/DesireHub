import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, Share2, Copy, Check, Megaphone, Zap, Users } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { toast } from 'sonner';

export default function PromotionBanner() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className="w-full mb-12"
      >
        <div className="relative group overflow-hidden rounded-[2.5rem] border border-gold/20 bg-linear-to-br from-black via-black/90 to-blue-900/20 p-8 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
          {/* Animated Background Pulse */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-gold/5 blur-[100px] animate-pulse pointer-events-none" />
          
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex flex-col gap-4 max-w-xl text-center md:text-left pt-2">
              
              <h2 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tighter leading-tight italic">
                Want to expand our <span className="text-gold">Desire</span> community?
              </h2>
              
              <p className="text-white/60 text-sm leading-relaxed max-w-lg">
                Promote our Telegram channel and this webpage to your network. The more we grow, the more premium content we unlock. Join the elite squad today!
              </p>

              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mt-2">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-[9px] font-bold text-white/50 uppercase tracking-widest">
                  <Megaphone className="w-3 h-3 text-gold" />
                  <span>Daily Updates</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
              {/* Telegram Official Button */}
              <motion.a
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                href="https://t.me/+fiYQGTL55EdkMDI1"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-500 text-white font-black uppercase tracking-widest text-[11px] px-8 py-5 rounded-2xl w-full sm:w-auto shadow-[0_15px_30px_rgba(37,99,235,0.4)] transition-all group/tg"
              >
                <Send className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                Join Main TG
              </motion.a>
            </div>
          </div>

          {/* Close button */}
          <button 
            onClick={() => setIsVisible(false)}
            className="absolute top-6 right-6 text-white/20 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

function X({ className }: { className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
    </svg>
  );
}
