import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface GradientTextProps {
  children: ReactNode;
  className?: string;
  animate?: boolean;
}

export function GradientText({ children, className = '', animate = true }: GradientTextProps) {
  return (
    <motion.span 
      className={`accent ${animate ? 'animate-gradient' : ''} ${className}`}
      style={{ 
        display: 'inline-block',
        background: 'var(--gradient)',
        WebkitBackgroundClip: 'text',
        backgroundClip: 'text',
        color: 'transparent',
      }}
    >
      {children}
    </motion.span>
  );
}
