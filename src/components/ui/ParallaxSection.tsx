import { useRef, ReactNode } from 'react';
import { motion } from 'framer-motion';
import { useElementParallax } from '../../hooks/useParallax';

interface ParallaxSectionProps {
  children: ReactNode;
  className?: string;
  distance?: number;
  bgImageUrl?: string;
}

export function ParallaxSection({ 
  children, 
  className = '', 
  distance = 100,
  bgImageUrl
}: ParallaxSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { y } = useElementParallax(ref, distance);

  return (
    <div 
      ref={ref} 
      className={`relative overflow-hidden ${className}`}
      style={{ position: 'relative' }}
    >
      {/* Background layer with parallax */}
      <motion.div
        style={{
          position: 'absolute',
          top: -distance,
          left: 0,
          right: 0,
          bottom: -distance,
          y,
          backgroundImage: bgImageUrl ? `url(${bgImageUrl})` : 'none',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          zIndex: 0
        }}
      />
      
      {/* Content layer */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        {children}
      </div>
    </div>
  );
}
