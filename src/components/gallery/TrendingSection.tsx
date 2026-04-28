import React from 'react';
import { ModelProfile } from '../../types';
import { motion } from 'motion/react';
import { Flame, TrendingUp, Star, Instagram, Twitter, Facebook } from 'lucide-react';
import { cn } from '../../lib/utils';
import { sanitizeImageUrl, isVideoUrl } from '../../lib/imageUtils';

interface TrendingSectionProps {
  models: ModelProfile[];
  onCardClick?: (model: ModelProfile) => void;
  viewMode?: string;
}

export default function TrendingSection({ models, onCardClick, viewMode }: TrendingSectionProps) {
  // We use the pre-calculated heatScore from Supabase mapping
  const sortedModels = [...models]
    .sort((a, b) => (b.heatScore || 0) - (a.heatScore || 0))
    .slice(0, 10);

  if (sortedModels.length === 0) return null;

  // Each card is 192px (w-48) + 24px gap = 216px total per item
  const marqueeWidth = sortedModels.length * 216;

  return (
    <div className="w-full mb-16 relative">
      <div className={cn(
        "flex flex-wrap sm:flex-nowrap items-center gap-4 mb-8 px-2 justify-between",
        viewMode === "Tab" && "sm:flex-row flex-col"
      )}>
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="absolute inset-0 bg-pink-600 blur-md opacity-40 animate-pulse" />
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-black border border-pink-500/30">
              <TrendingUp className="w-5 h-5 text-pink-400" />
            </div>
          </div>
          <div>
            <h2 className="text-white text-base font-black uppercase tracking-[0.4em] leading-none">Trending Now</h2>
            <div className="flex items-center gap-2 mt-1.5">
              <div className="h-[2px] w-12 bg-linear-to-r from-pink-500 to-transparent rounded-full shadow-[0_0_15px_rgba(236,72,153,0.8)]" />
              <span className="text-[10px] font-bold text-pink-400/60 uppercase tracking-widest">Top Performance</span>
            </div>
          </div>
        </div>

        {/* Social Links - Reoccupying space after TG button removal */}
        <div className="flex items-center gap-3 ml-auto z-20">
          <div className="relative rounded-2xl overflow-hidden group flex-shrink-0 border border-gold/30 shadow-[0_0_20px_rgba(212,175,55,0.1)]">
            <div className={cn(
              "relative bg-black/90 flex items-center h-full backdrop-blur-md",
              viewMode === "Phone" ? "px-6 py-4 gap-8" : "px-6 py-3 gap-6"
            )}>
              <a href="https://www.instagram.com/desirefactoryhub/" target="_blank" rel="noopener noreferrer" className="text-white/40 hover:text-gold transition-all hover:scale-125 active:scale-90 relative z-10" title="Instagram">
                <Instagram className={cn(viewMode === "Phone" ? "w-6 h-6" : "w-5 h-5")} />
              </a>
              <a href="https://www.reddit.com/user/Virtual_Dream_6074/" target="_blank" rel="noopener noreferrer" className="text-white/40 hover:text-[#FF4500] transition-all hover:scale-125 active:scale-90 relative z-10" title="Reddit">
                <svg viewBox="0 0 24 24" fill="currentColor" className={cn(viewMode === "Phone" ? "w-6 h-6" : "w-5 h-5")}><path d="M22 11.5c0-1.38-1.12-2.5-2.5-2.5-.72 0-1.37.31-1.83.8-1.46-1.07-3.44-1.76-5.63-1.84l1.2-5.65 3.93.84c.05 1.25 1.09 2.25 2.36 2.25 1.31 0 2.37-1.06 2.37-2.37C21.9 4.22 20.84 3.16 19.53 3.16c-1.05 0-1.95.69-2.26 1.63L12.8 3.82c-.17-.04-.34.07-.38.24L11.08 10.3c-2.2.06-4.18.75-5.65 1.83-.45-.49-1.1-.8-1.83-.8-1.38 0-2.5 1.12-2.5 2.5 0 .91.5 1.7 1.22 2.14-.04.22-.06.45-.06.69 0 3.59 4.39 6.5 9.8 6.5s9.8-2.91 9.8-6.5c0-.24-.02-.47-.06-.69.72-.44 1.22-1.23 1.22-2.14zM9 14.5c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5-.67 1.5-1.5 1.5S9 15.33 9 14.5zm7 3.5c-1.36.91-3.16 1.15-4 1.15-.84 0-2.64-.24-4-1.15-.22-.15-.28-.45-.13-.67.15-.22.45-.28.67-.13 1.1.74 2.55.95 3.46.95.91 0 2.36-.21 3.46-.95.22-.15.52-.09.67.13.15.22.09.52-.13.67zM15 16c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/></svg>
              </a>
              <a href="https://x.com/Ps2022_24" target="_blank" rel="noopener noreferrer" className="text-white/40 hover:text-white transition-all hover:scale-125 active:scale-90 relative z-10" title="X (Twitter)">
                <Twitter className={cn(viewMode === "Phone" ? "w-6 h-6" : "w-5 h-5")} />
              </a>
              <a href="https://www.facebook.com/profile.php?id=61580298511422" target="_blank" rel="noopener noreferrer" className="text-white/40 hover:text-[#1877F2] transition-all hover:scale-125 active:scale-90 relative z-10" title="Facebook">
                <Facebook className={cn(viewMode === "Phone" ? "w-6 h-6" : "w-5 h-5")} />
              </a>
            </div>
          </div>
        </div>
      </div>

      <div 
        className="w-full relative overflow-hidden group/marquee py-4"
        style={{
          maskImage: 'linear-gradient(to right, transparent, black 15%, black 85%, transparent)',
          WebkitMaskImage: 'linear-gradient(to right, transparent, black 15%, black 85%, transparent)'
        }}
      >
        <motion.div 
          animate={{ x: [0, -marqueeWidth] }}
          transition={{ 
            x: {
              repeat: Infinity,
              repeatType: "loop",
              duration: 25,
              ease: "linear",
            },
          }}
          className="flex gap-4 pointer-events-none"
        >
          {/* Loop structure: Original + Copy */}
          {[...sortedModels, ...sortedModels].map((model, idx) => (
            <motion.div
              key={`${model.id}-${idx}`}
              whileHover={{ 
                y: -3, 
                scale: 1.02,
                transition: { duration: 0.2 }
              }}
              className="flex-none w-36 group cursor-pointer pointer-events-auto h-fit"
              onClick={() => {
                onCardClick?.(model);
              }}
            >
              <div className="relative aspect-[4/5] rounded-xl overflow-hidden border border-white/10 glass-premium group-hover:border-pink-500/50 transition-all duration-500 shadow-md">
                <div className="absolute inset-0 bg-linear-to-t from-black via-transparent to-transparent opacity-80 z-10" />
                
                {isVideoUrl(sanitizeImageUrl(model.thumbnail)) ? (
                  <video 
                    src={sanitizeImageUrl(model.thumbnail)} 
                    autoPlay 
                    loop 
                    muted 
                    playsInline 
                    className="w-full h-full object-cover grayscale-[10%] group-hover:grayscale-0 transition-all duration-700" 
                  />
                ) : (
                  <img 
                    src={sanitizeImageUrl(model.thumbnail)} 
                    alt={model.name} 
                    className="w-full h-full object-cover grayscale-[10%] group-hover:grayscale-0 transition-all duration-700"
                    referrerPolicy="no-referrer"
                  />
                )}

                <div className="absolute top-2 left-2 z-20 px-1.5 py-0.5 rounded bg-black/80 border border-white/10 text-[7px] font-black font-mono text-pink-400 flex items-center gap-1">
                  <Star className="w-2 h-2 fill-pink-400 stroke-pink-400" />
                  #{idx % 10 + 1}
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-3 z-20">
                  <h3 className="text-white text-[10px] font-black uppercase tracking-widest truncate">{model.name}</h3>
                  <div className="flex items-center gap-1 mt-0.5">
                    <TrendingUp className="w-2.5 h-2.5 text-pink-400" />
                    <span className="text-[7px] font-bold text-white/50 uppercase tracking-tighter">
                      {model.views?.toLocaleString() || 0}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
