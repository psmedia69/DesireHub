import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldAlert, CheckCircle2, AlertCircle } from 'lucide-react';

export default function AgeVerification() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const verified = localStorage.getItem('age_verified');
    if (!verified) {
      setIsVisible(true);
      document.body.style.overflow = 'hidden';
    }
  }, []);

  const handleVerify = () => {
    localStorage.setItem('age_verified', 'true');
    setIsVisible(false);
    document.body.style.overflow = 'auto';
  };

  const handleExit = () => {
    window.location.href = 'https://www.google.com';
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/98 backdrop-blur-2xl"
          />

          {/* Animated Glows */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <motion.div 
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.07, 0.14, 0.07],
              }}
              transition={{ duration: 10, repeat: Infinity }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] bg-gold/10 blur-[150px] rounded-full"
            />
          </div>

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="relative w-full max-w-lg bg-zinc-950 border border-gold/30 rounded-[32px] p-8 md:p-12 shadow-[0_0_70px_rgba(212,175,55,0.11)] text-center overflow-hidden"
          >
            {/* Decorative Corner */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 blur-3xl -mr-16 -mt-16" />
            
            <div className="relative z-10 space-y-8">
              <div className="flex justify-center">
                <div className="w-20 h-20 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center">
                  <ShieldAlert className="w-10 h-10 text-gold" />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-center gap-2 text-gold">
                  <span className="h-px w-8 bg-gold/30" />
                  <span className="text-[10px] font-black uppercase tracking-[0.4em]">Official Verification</span>
                  <span className="h-px w-8 bg-gold/30" />
                </div>
                <h1 className="text-4xl font-black text-white uppercase italic tracking-tight">Access Restricted</h1>
                <p className="text-white/50 text-sm leading-relaxed max-w-[280px] mx-auto">
                  You must be at least <span className="text-gold font-bold">18 years of age</span> or the age of majority in your jurisdiction to enter.
                </p>
              </div>

              <div className="flex flex-col gap-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleVerify}
                  className="w-full py-5 bg-linear-to-r from-[#bf953f] via-[#fcf6ba] to-[#b38728] text-black font-black uppercase tracking-[0.2em] text-xs rounded-2xl shadow-xl shadow-gold/14 flex items-center justify-center gap-3 group transition-all"
                >
                  <CheckCircle2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  I am 18 or older
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleExit}
                  className="w-full py-5 bg-white/5 border border-white/10 hover:border-white/20 text-white/40 hover:text-white font-black uppercase tracking-[0.2em] text-xs rounded-2xl flex items-center justify-center gap-3 transition-all"
                >
                  <AlertCircle className="w-4 h-4" />
                  Exit Website
                </motion.button>
              </div>

              <div className="pt-4 border-t border-white/5">
                <p className="text-[9px] font-bold text-white/20 uppercase tracking-[0.3em] leading-loose">
                  By entering this site you agree to our<br />
                  <span className="text-white/40 cursor-pointer hover:text-gold transition-colors">Terms of Service</span> & <span className="text-white/40 cursor-pointer hover:text-gold transition-colors">Privacy Policy</span>
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
