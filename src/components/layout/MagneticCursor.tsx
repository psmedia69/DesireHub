import React, { useEffect, useState, useRef } from 'react';
import { motion, useSpring, useMotionValue } from 'motion/react';
import { cn } from '../../lib/utils';

export default function MagneticCursor() {
  const [hoverType, setHoverType] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 250 };
  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      
      if (!isVisible) setIsVisible(true);

      const target = e.target as HTMLElement;
      const interactive = target.closest('button, a, .group, [role="button"]');
      
      let nextType: string | null = null;
      if (interactive) {
          if (interactive.classList.contains('group/unlock')) {
              nextType = 'premium';
          } else if (interactive.classList.contains('group')) {
              nextType = 'card';
          } else {
              nextType = 'link';
          }
      }

      setHoverType(prev => prev === nextType ? prev : nextType);
    };

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, [mouseX, mouseY, isVisible]);

  if (!isVisible) return null;

  return (
    <motion.div
      className="fixed top-0 left-0 pointer-events-none z-[9999] hidden lg:block"
      style={{
        x: cursorX,
        y: cursorY,
        translateX: '-50%',
        translateY: '-50%',
      }}
    >
      <motion.div
        animate={{
          scale: hoverType ? 1.5 : 1,
          width: hoverType === 'premium' ? 80 : 32,
          height: hoverType === 'premium' ? 80 : 32,
          backgroundColor: hoverType === 'premium' ? 'rgba(212, 175, 55, 0.2)' : 'rgba(255, 255, 255, 0.1)',
          borderColor: hoverType === 'premium' ? 'rgba(212, 175, 55, 0.5)' : 'rgba(255, 255, 255, 0.2)',
        }}
        className={cn(
          "rounded-full border backdrop-blur-[2px] flex items-center justify-center transition-colors duration-300",
          hoverType && "mix-blend-difference"
        )}
      >
        {hoverType === 'premium' && (
          <motion.span 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-[8px] font-black uppercase text-gold tracking-widest text-center px-1"
          >
            Explore
          </motion.span>
        )}
      </motion.div>
      
      {/* Center dot */}
      <motion.div 
        animate={{
          scale: hoverType ? 0 : 1,
        }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-1 bg-gold rounded-full" 
      />
    </motion.div>
  );
}
