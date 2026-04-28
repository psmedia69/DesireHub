import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Lock, ArrowRight, X } from "lucide-react";

export default function ScrollTriggerPopup() {
  const [isVisible, setIsVisible] = useState(false);
  const [hasShown, setHasShown] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (hasShown) return;

      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrolled = window.scrollY;
      const scrollPercentage = (scrolled / scrollHeight) * 100;

      if (scrollPercentage >= 40 && scrollPercentage <= 60) {
        setIsVisible(true);
        setHasShown(true);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hasShown]);

  return (
    <AnimatePresence>
      {isVisible && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="w-full max-w-md glass-premium rounded-[2.5rem] border border-gold/40 p-8 text-center relative overflow-hidden shadow-[0_30px_100px_rgba(0,0,0,0.8)]"
          >
            <div className="absolute inset-0 bg-gold/5 blur-[80px] -z-10" />
            
            <button 
              onClick={() => setIsVisible(false)}
              className="absolute top-6 right-6 text-white/40 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-16 h-16 bg-gold rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(212,175,55,0.4)]">
              <Lock className="w-8 h-8 text-black" />
            </div>

            <h2 className="text-white text-2xl font-black uppercase tracking-tight leading-tight mb-3">
              🔥 Unlock full access before it expires
            </h2>
            
            <p className="text-white/50 text-sm mb-8 font-medium">
              You're viewing a restricted version. Access our full directory through the secure channel.
            </p>

            <motion.a
              href="https://t.me/+fiYQGTL55EdkMDI1"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-gold text-black py-5 rounded-2xl font-black text-sm uppercase tracking-[0.25em] flex items-center justify-center gap-3 shadow-[0_15px_40px_rgba(212,175,55,0.3)]"
            >
              Continue Unlock Process
              <ArrowRight className="w-5 h-5" />
            </motion.a>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
