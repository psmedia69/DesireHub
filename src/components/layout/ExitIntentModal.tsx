import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { AlertCircle, ArrowRight, X } from "lucide-react";

interface ExitIntentModalProps {
  onContinue: () => void;
}

export default function ExitIntentModal({ onContinue }: ExitIntentModalProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [hasShown, setHasShown] = useState(false);

  useEffect(() => {
    const handleMouseLeave = (e: MouseEvent) => {
      if (hasShown) return;
      
      // Check if mouse left through the top of the viewport (indicating tab close)
      if (e.clientY <= 0) {
        setIsVisible(true);
        setHasShown(true);
      }
    };

    document.addEventListener("mouseleave", handleMouseLeave);
    return () => document.removeEventListener("mouseleave", handleMouseLeave);
  }, [hasShown]);

  return (
    <AnimatePresence>
      {isVisible && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="w-full max-w-lg glass-premium rounded-[3rem] border border-gold/50 p-10 text-center relative overflow-hidden shadow-[0_50px_150px_rgba(0,0,0,1)]"
          >
            <div className="absolute inset-0 bg-gold/10 blur-[100px] -z-10" />
            
            <button 
              onClick={() => setIsVisible(false)}
              className="absolute top-8 right-8 text-white/40 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="w-20 h-20 bg-red-500/20 border border-red-500/40 rounded-full flex items-center justify-center mx-auto mb-8">
              <AlertCircle className="w-10 h-10 text-red-500 animate-pulse" />
            </div>

            <h2 className="text-white text-3xl font-black uppercase tracking-tight leading-tight mb-4">
              Wait! You’re one step away from unlocking everything.
            </h2>
            
            <p className="text-white/60 text-lg mb-10 font-medium max-w-sm mx-auto">
              Don't miss out on verified content and daily exclusive updates.
            </p>

            <div className="flex flex-col gap-4">
              <motion.button
                onClick={() => {
                  onContinue();
                  setIsVisible(false);
                }}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-gold text-black py-6 rounded-2xl font-black text-base uppercase tracking-[0.3em] flex items-center justify-center gap-4 shadow-[0_20px_50px_rgba(212,175,55,0.4)]"
              >
                Continue Now
                <ArrowRight className="w-6 h-6" />
              </motion.button>
              
              <button 
                onClick={() => setIsVisible(false)}
                className="text-[11px] font-black uppercase tracking-[0.2em] text-white/30 hover:text-white/60 transition-colors mt-2"
              >
                No thanks, I'll miss out
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
