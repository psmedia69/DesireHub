import React from 'react';
import { motion } from 'motion/react';
import { ModelProfile } from '@/src/types';
import { isVideoUrl } from '@/src/lib/imageUtils';
import { Star, ArrowRight, Play } from 'lucide-react';

interface FeaturedHeroProps {
  model: ModelProfile;
  onRedirect?: (model: ModelProfile, url: string) => void;
}

export default function FeaturedHero({ model, onRedirect }: FeaturedHeroProps) {
  const handleUnlock = (e: React.MouseEvent) => {
    if (onRedirect && model.socials?.instagram) {
      onRedirect(model, model.socials.instagram);
    } else if (model.socials?.instagram) {
      window.open(model.socials.instagram, '_blank');
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1 }}
      className="relative w-full min-h-[500px] md:h-[600px] mb-20 rounded-[40px] overflow-hidden group shadow-[0_30px_100px_-20px_rgba(0,0,0,0.8)] border border-white/5"
    >
      {/* Background Image with Cinematic Effects */}
      <div className="absolute inset-0">
        {isVideoUrl(model.thumbnail) ? (
          <video
            src={model.thumbnail}
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover transition-transform duration-[4s] ease-out group-hover:scale-110"
          />
        ) : (
          <img 
            src={model.thumbnail} 
            alt={model.name}
            className="w-full h-full object-cover transition-transform duration-[4s] ease-out group-hover:scale-110"
            referrerPolicy="no-referrer"
          />
        )}
        {/* Gradient Overlays */}
        <div className="absolute inset-0 bg-linear-to-r from-black via-black/60 to-transparent" />
        <div className="absolute inset-0 bg-linear-to-t from-black via-transparent to-black/20" />
      </div>

      {/* Content Layer */}
      <div className="relative h-full flex flex-col justify-center px-8 md:px-20 py-12 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="flex flex-wrap items-center gap-4 mb-8"
        >
          <div className="px-5 py-2 bg-gold rounded-full flex items-center gap-2 text-black font-black text-[10px] uppercase tracking-[0.2em] shadow-[0_0_30px_rgba(212,175,55,0.4)]">
            <Star className="w-3 h-3 fill-current" />
            Pick of the Week
          </div>
          <div className="px-4 py-2 bg-black/40 border border-white/20 rounded-full text-white/70 text-[9px] font-bold uppercase tracking-widest">
            Elite Member Status
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="text-6xl sm:text-7xl md:text-9xl font-cinzel font-bold text-white mb-8 tracking-tighter leading-[0.9]"
        >
          {model.name}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5, delay: 1 }}
          className="text-white/60 text-lg md:text-xl mb-12 max-w-2xl leading-relaxed italic font-serif"
        >
          Step into the exclusive world of {model.name}. Now trending at the pinnacle of the Elite directory with unrivaled engagement.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 1.3 }}
          className="flex flex-col sm:flex-row items-start sm:items-center gap-8"
        >
          <button 
            onClick={handleUnlock}
            className="group/btn relative px-10 py-5 overflow-hidden rounded-full shadow-2xl transition-all"
          >
            <div className="absolute inset-0 bg-white group-hover/btn:bg-gold transition-colors duration-500" />
            <span className="relative flex items-center gap-3 text-black font-black text-xs uppercase tracking-[0.2em] whitespace-nowrap">
              Unlock Premium Access
              <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
            </span>
          </button>
          
          <button className="flex items-center gap-4 text-white/80 font-bold text-xs uppercase tracking-[0.2em] hover:text-white transition-colors group/play">
            <div className="w-14 h-14 rounded-full border border-white/20 flex items-center justify-center transition-all group-hover/play:border-gold/50 group-hover/play:bg-white/5 shadow-2xl">
              <Play className="w-4 h-4 fill-white" />
            </div>
            Preview Reels
          </button>
        </motion.div>
      </div>

      {/* Stats Dashboard in Hero */}
      <div className="absolute bottom-12 right-8 md:right-20 hidden lg:flex gap-16">
        <div className="flex flex-col gap-1">
          <span className="text-[9px] uppercase tracking-widest font-bold text-white/30">Global Clicks</span>
          <span className="text-4xl font-cinzel text-gold font-bold">{model.clicks?.toLocaleString()}+</span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-[9px] uppercase tracking-widest font-bold text-white/30">Directory Status</span>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#00ff80] shadow-[0_0_10px_#00ff80]" />
            <span className="text-2xl font-cinzel text-white/80 font-bold">Verified</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
