import React, { memo } from 'react';
import { ModelProfile } from '../../types';
import { motion } from 'motion/react';
import { Flame, TrendingUp, Star, Send } from 'lucide-react';
import { cn } from '../../lib/utils';
import { sanitizeImageUrl, isVideoUrl } from '../../lib/imageUtils';

interface TrendingSectionProps {
  models: ModelProfile[];
  onCardClick?: (model: ModelProfile) => void;
  viewMode?: string;
}

const TrendingSection = ({ models, onCardClick, viewMode }: TrendingSectionProps) => {
  // We use the pre-calculated heatScore from Supabase mapping
  const sortedModels = React.useMemo(() => [...models]
    .sort((a, b) => (b.heatScore || 0) - (a.heatScore || 0))
    .slice(0, 10), [models]);

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
            <div className="absolute inset-0 bg-pink-600 blur-md opacity-20 animate-pulse-slow" />
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-black border border-pink-500/30">
              <TrendingUp className="w-5 h-5 text-pink-400" />
            </div>
          </div>
          <div>
            <h2 className="text-white text-base font-black uppercase tracking-[0.4em] leading-none">Trending Now</h2>
            <div className="flex items-center gap-2 mt-1.5">
              <div className="h-[2px] w-12 bg-linear-to-r from-pink-500 to-transparent rounded-full" />
              <span className="text-[10px] font-bold text-pink-400/60 uppercase tracking-widest">Top Performance</span>
            </div>
          </div>
        </div>

        {/* Social Links - Only Telegram as requested */}
        {viewMode !== "Phone" && (
          <div className="flex items-center gap-3 ml-auto z-20">
            <div className="relative rounded-2xl overflow-hidden group flex-shrink-0 border border-gold/30 shadow-[0_0_20px_rgba(212,175,55,0.1)]">
              <div className={cn(
                "relative bg-black/90 flex items-center h-full backdrop-blur-md px-6 py-3 gap-6"
              )}>
                <a href="https://t.me/+fiYQGTL55EdkMDI1" target="_blank" rel="noopener noreferrer" className="text-white/40 hover:text-gold transition-all hover:scale-125 active:scale-90 relative z-10 flex items-center gap-2 group" title="Telegram">
                  <Send className="w-5 h-5 text-gold" />
                  <span className="text-[10px] font-black uppercase tracking-[0.2em]">Join Community</span>
                </a>
              </div>
            </div>
          </div>
        )}
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
          style={{ willChange: 'transform' }}
          transition={{ 
            x: {
              repeat: Infinity,
              repeatType: "loop",
              duration: 35, // Slower for smoothness
              ease: "linear",
            },
          }}
          className="flex gap-4 pointer-events-none"
        >
          {/* Loop structure: Original + Copy */}
          {[...sortedModels, ...sortedModels, ...sortedModels].map((model, idx) => (
            <div
              key={`trending-${model.id}-${idx}`}
              className="flex-none w-36 group h-fit transition-transform hover:-translate-y-1 hover:scale-105"
            >
              <div className="relative aspect-[4/5] rounded-xl overflow-hidden border border-white/10 glass-premium group-hover:border-pink-500/50 transition-all duration-500 shadow-md transform-gpu">
                <div className="absolute inset-0 bg-linear-to-t from-black via-transparent to-transparent opacity-80 z-10" />
                
                {isVideoUrl(sanitizeImageUrl(model.thumbnail)) ? (
                  <motion.video 
                    src={sanitizeImageUrl(model.thumbnail)} 
                    autoPlay 
                    loop 
                    muted 
                    playsInline 
                    initial={{ scale: 1.15, filter: "blur(3px) grayscale(10%)" }}
                    animate={{ scale: 1.0, filter: "blur(3px) grayscale(10%)" }}
                    whileHover={{ filter: "blur(0px) grayscale(0%)" }}
                    transition={{ 
                      scale: {
                        duration: 8, 
                        repeat: Infinity, 
                        repeatType: "reverse",
                        ease: "easeInOut"
                      },
                      filter: { duration: 0.5 }
                    }}
                    className="w-full h-full object-cover" 
                  />
                ) : (
                  <motion.img 
                    src={sanitizeImageUrl(model.thumbnail)} 
                    alt={model.name} 
                    loading="lazy"
                    initial={{ filter: "blur(3px) grayscale(10%)" }}
                    whileHover={{ filter: "blur(0px) grayscale(0%)" }}
                    className="w-full h-full object-cover transition-all duration-700"
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
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default memo(TrendingSection);
