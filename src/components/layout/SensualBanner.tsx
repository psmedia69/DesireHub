import React from 'react';
import { motion } from 'motion/react';
import { ShieldAlert } from 'lucide-react';
import { cn } from '../../lib/utils';

interface SensualBannerProps {
  viewMode: 'Web' | 'Tab' | 'Phone';
}

export default function SensualBanner({ viewMode }: SensualBannerProps) {
  return (
    <section className="relative py-20 px-4 overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-linear-to-b from-transparent via-gold/5 to-transparent pointer-events-none" />
      
      <div className="max-w-4xl mx-auto text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col items-center gap-6"
        >
          {/* Subtle Indicator */}
          <div className="flex items-center gap-2 px-4 py-1.5 rounded-full border border-gold/20 bg-gold/5 backdrop-blur-sm">
            <ShieldAlert className="w-3 h-3 text-gold animate-pulse" />
            <span className="text-[10px] font-black tracking-[0.3em] text-gold uppercase">Limited Time Exposure</span>
          </div>

          <h2 className={cn(
            "font-cinzel font-bold text-white tracking-tighter leading-tight max-w-2xl",
            viewMode === 'Phone' ? "text-3xl" : "text-5xl md:text-6xl"
          )}>
            Access <span className="text-gold-gradient italic">Hidden</span> Profiles
          </h2>

          <div className="relative">
            <motion.p 
              animate={{ 
                opacity: [0.9, 1, 0.9],
                textShadow: [
                  "0 0 10px rgba(212,175,55,0.2)",
                  "0 0 20px rgba(212,175,55,0.4)",
                  "0 0 10px rgba(212,175,55,0.2)"
                ]
              }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className={cn(
                "font-serif text-gold font-medium tracking-wide brightness-110 uppercase text-[0.9em]",
                viewMode === 'Phone' ? "text-lg" : "text-xl md:text-2xl"
              )}
            >
              All are free! Click below each post.
            </motion.p>
            {/* Animated Underline */}
            <motion.div 
              initial={{ width: 0 }}
              whileInView={{ width: '100%' }}
              viewport={{ once: true }}
              transition={{ duration: 1.5, delay: 0.5 }}
              className="absolute -bottom-2 left-0 h-px bg-linear-to-r from-transparent via-gold/40 to-transparent"
            />
          </div>


        </motion.div>
      </div>

      {/* Floating Sparkles for Atmosphere */}
      <div className="absolute top-1/2 left-1/4 w-1 h-1 bg-gold rounded-full animate-pulse opacity-20" />
      <div className="absolute bottom-1/4 right-1/4 w-1.5 h-1.5 bg-gold rounded-full animate-pulse delay-700 opacity-20" />
    </section>
  );
}
