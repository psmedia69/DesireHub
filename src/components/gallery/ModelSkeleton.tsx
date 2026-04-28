import React from 'react';
import { motion } from 'motion/react';

export default function ModelSkeleton() {
  return (
    <div className="aspect-[4/5] glass-premium rounded-[32px] overflow-hidden border border-white/10 relative group">
      {/* Animated shimmer overlay */}
      <div className="absolute inset-0 z-10 overflow-hidden">
        <motion.div 
          animate={{ x: ['-100%', '100%'] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          className="w-full h-full bg-linear-to-r from-transparent via-white/5 to-transparent"
        />
      </div>

      {/* Image placeholder */}
      <div className="w-full h-full bg-white/5" />

      {/* Content skeleton */}
      <div className="absolute bottom-0 inset-x-0 p-4 space-y-3 bg-linear-to-t from-black/80 to-transparent">
        <div className="flex items-center justify-between">
          <div className="w-24 h-5 bg-white/10 rounded-lg animate-pulse" />
          <div className="w-12 h-4 bg-gold/10 rounded-full animate-pulse" />
        </div>
        <div className="space-y-2">
          <div className="w-3/4 h-3 bg-white/5 rounded animate-pulse" />
          <div className="w-full h-10 bg-white/10 rounded-2xl animate-pulse" />
        </div>
      </div>
    </div>
  );
}
