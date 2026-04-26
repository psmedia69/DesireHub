import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ModelCategory } from '@/src/types';

interface DynamicAtmosphereProps {
  category: ModelCategory | "All";
}

const CATEGORY_COLORS: Record<string, string[]> = {
  All: ['#d4af37', '#b8860b', '#1a1a2e'],
  DESI: ['#8b0000', '#ff4d4d', '#2c0000'],
  Latina: ['#e67e22', '#f39c12', '#211000'],
  White: ['#2980b9', '#3498db', '#0c1a2e'],
  Arab: ['#27ae60', '#2ecc71', '#0a210f'],
  Asian: ['#8e44ad', '#9b59b6', '#210a2e'],
};

export default function DynamicAtmosphere({ category }: DynamicAtmosphereProps) {
  const colors = useMemo(() => CATEGORY_COLORS[category] || CATEGORY_COLORS.All, [category]);

  return (
    <div className="dynamic-bg-container">
      <AnimatePresence mode="wait">
        <motion.div
          key={category}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 2 }}
          className="relative w-full h-full"
        >
          {/* Deep Ambient Base */}
          <div className="absolute inset-0 bg-[#020205]" />

          {/* Main Glow 1 (Top Left) */}
          <motion.div
            animate={{
              x: ['-10%', '5%', '-10%'],
              y: ['-5%', '10%', '-5%'],
              scale: [1, 1.2, 1],
            }}
            transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
            className="dynamic-bg-blob top-[-20%] left-[-20%]"
            style={{ 
              backgroundColor: colors[0],
              opacity: 0.06
            }}
          />
          
          {/* Main Glow 2 (Bottom Right) */}
          <motion.div
            animate={{
              x: ['10%', '-5%', '10%'],
              y: ['5%', '-10%', '5%'],
              scale: [1.2, 1, 1.2],
            }}
            transition={{ duration: 35, repeat: Infinity, ease: 'linear' }}
            className="dynamic-bg-blob bottom-[-20%] right-[-20%]"
            style={{ 
              backgroundColor: colors[1],
              opacity: 0.045
            }}
          />

          {/* Secondary Glow (Center) */}
          <motion.div
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.015, 0.035, 0.015]
            }}
            transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[100vw] h-[100vw] rounded-full filter blur-[200px] mix-blend-screen"
            style={{ 
              backgroundColor: colors[2]
            }}
          />
        </motion.div>
      </AnimatePresence>
      <div className="noise" />
    </div>
  );
}
