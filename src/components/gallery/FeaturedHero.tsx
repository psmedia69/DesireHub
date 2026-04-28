import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ModelProfile } from '@/src/types';
import { isVideoUrl, sanitizeImageUrl } from '@/src/lib/imageUtils';
import { Star, ArrowRight, Play } from 'lucide-react';
import { cn } from '@/src/lib/utils';

interface FeaturedHeroProps {
  model: ModelProfile;
  onRedirect?: (model: ModelProfile, url: string) => void;
}

export default function FeaturedHero({ model, onRedirect }: FeaturedHeroProps) {
  const thumbnail = sanitizeImageUrl(model.thumbnail);
  const [showTeaser, setShowTeaser] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Smart Visibility Tracking
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.1, rootMargin: '100px' }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;
    const timer = setTimeout(() => {
      setShowTeaser(true);
    }, 4000); 
    return () => clearTimeout(timer);
  }, [isVisible]);
  
  const handleUnlock = (e: React.MouseEvent) => {
    if (onRedirect && model.socials?.instagram) {
      onRedirect(model, model.socials.instagram);
    } else if (model.socials?.instagram) {
      window.open(model.socials.instagram, '_blank');
    }
  };

  return (
    <motion.div 
      ref={containerRef}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: isVisible ? 1 : 0.8, y: 0 }}
      transition={{ duration: 1 }}
      className="relative w-full min-h-[500px] md:h-[600px] mb-20 rounded-[40px] overflow-hidden group shadow-[0_30px_100px_-20px_rgba(0,0,0,0.8)] border border-white/5 will-change-transform"
    >
      {/* Background Image with Cinematic Effects */}
      <div className="absolute inset-0 grayscale-[20%] brightness-[0.8] contrast-[1.1]">
        {isVisible && (
          isVideoUrl(thumbnail) ? (
            <motion.video
              src={thumbnail}
              autoPlay
              loop
              muted
              playsInline
              initial={{ scale: 1.15 }}
              animate={{ 
                scale: showTeaser ? 1.05 : 1.0,
                filter: showTeaser ? "blur(13.2px)" : "blur(0px)"
              }}
              transition={{ 
                scale: { duration: 4, ease: "linear" },
                filter: { duration: 1.5, ease: "easeInOut" }
              }}
              className="w-full h-full object-cover will-change-[transform,filter]"
            />
          ) : (
            <motion.img 
              src={thumbnail} 
              alt={model.name}
              initial={{ scale: 1.15 }}
              animate={{ 
                scale: showTeaser ? 1.05 : 1.0,
                filter: showTeaser ? "blur(13.2px)" : "blur(0px)"
              }}
              transition={{ 
                scale: { duration: 4, ease: "linear" },
                filter: { duration: 1.5, ease: "easeInOut" }
              }}
              className="w-full h-full object-cover will-change-[transform,filter]"
              referrerPolicy="no-referrer"
            />
          )
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
          <div className="px-5 py-2 bg-linear-to-r from-blue-700 via-blue-600 to-indigo-800 rounded-full flex items-center gap-2 text-white font-black text-[10px] uppercase tracking-[0.25em] shadow-[0_0_40px_rgba(30,64,175,0.4)] border border-white/10">
            <Star className="w-3 h-3 fill-white" />
            Admin's Pick
          </div>
          <div className="px-4 py-2 bg-white/5 backdrop-blur-[13.2px] border border-white/10 rounded-full text-white/70 text-[9px] font-black uppercase tracking-[0.2em]">
            Verified Direct
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="text-6xl sm:text-7xl md:text-9xl font-cinzel font-bold text-white mb-8 tracking-tighter leading-[0.85] text-gold-gradient"
        >
          {model.name}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5, delay: 1 }}
          className="text-white/70 text-lg md:text-2xl mb-12 max-w-2xl leading-relaxed font-serif tracking-wide italic"
        >
          Discover reaching the zenith of the global directory. An exclusive look into the most trending talent in the digital space.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 1.3 }}
          className="flex flex-col sm:flex-row items-start sm:items-center gap-8"
        >
          <button 
            onClick={handleUnlock}
            className="group/btn relative px-12 py-5 overflow-hidden rounded-2xl transition-all duration-700 shadow-2xl"
          >
            <div className="absolute inset-0 bg-linear-to-r from-blue-700 to-indigo-900 group-hover/btn:scale-110 transition-transform duration-700" />
            <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:animate-[shimmer_2.5s_infinite]" />
            <span className="relative flex items-center gap-3 text-white font-black text-xs uppercase tracking-[0.3em] whitespace-nowrap">
              Experience Now
              <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-2" />
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
