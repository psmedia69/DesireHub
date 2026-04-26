import React from 'react';
import { ModelProfile } from '../../types';
import { motion } from 'motion/react';
import { Flame, TrendingUp, Star, Instagram, Twitter, Facebook } from 'lucide-react';

interface TrendingSectionProps {
  models: ModelProfile[];
  onCardClick?: (model: ModelProfile) => void;
}

export default function TrendingSection({ models, onCardClick }: TrendingSectionProps) {
  // We use the pre-calculated heatScore from Supabase mapping
  const sortedModels = [...models]
    .sort((a, b) => (b.heatScore || 0) - (a.heatScore || 0))
    .slice(0, 10);

  if (sortedModels.length === 0) return null;

  // Each card is 192px (w-48) + 24px gap = 216px total per item
  const marqueeWidth = sortedModels.length * 216;

  return (
    <div className="w-full mb-16 relative">
      <div className="flex flex-wrap sm:flex-nowrap items-center gap-4 mb-8 px-2 justify-between">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="absolute inset-0 bg-gold blur-md opacity-40 animate-pulse" />
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-black border border-gold/30">
              <Flame className="w-5 h-5 text-gold" />
            </div>
          </div>
          <div>
            <h2 className="text-white text-base font-black uppercase tracking-[0.4em] leading-none">Trending Now</h2>
            <div className="flex items-center gap-2 mt-1.5">
              <div className="h-[2px] w-12 bg-linear-to-r from-gold to-transparent rounded-full shadow-[0_0_15px_rgba(212,175,55,0.8)]" />
              <span className="text-[10px] font-bold text-gold/60 uppercase tracking-widest">Top Performance</span>
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
              <div className="relative aspect-[4/5] rounded-xl overflow-hidden border border-white/10 glass-premium group-hover:border-gold/50 transition-all duration-500 shadow-md">
                <div className="absolute inset-0 bg-linear-to-t from-black via-transparent to-transparent opacity-80 z-10" />
                
                <img 
                  src={model.thumbnail} 
                  alt={model.name} 
                  className="w-full h-full object-cover grayscale-[10%] group-hover:grayscale-0 transition-all duration-700"
                  referrerPolicy="no-referrer"
                />

                <div className="absolute top-2 left-2 z-20 px-1.5 py-0.5 rounded bg-black/80 border border-white/10 text-[7px] font-black font-mono text-gold flex items-center gap-1">
                  <Star className="w-2 h-2 fill-gold stroke-gold" />
                  #{idx % 10 + 1}
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-3 z-20">
                  <h3 className="text-white text-[10px] font-black uppercase tracking-widest truncate">{model.name}</h3>
                  <div className="flex items-center gap-1 mt-0.5">
                    <TrendingUp className="w-2.5 h-2.5 text-gold" />
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
