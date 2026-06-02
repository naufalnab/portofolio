import { ReactNode } from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';

interface GlassCardProps extends HTMLMotionProps<"div"> {
  children: ReactNode;
  className?: string;
  hoverEffect?: boolean;
}

export function GlassCard({ 
  children, 
  className = '', 
  hoverEffect = true,
  ...props 
}: GlassCardProps) {
  
  const baseStyle = {
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
    borderRadius: 'var(--radius)',
  };

  return (
    <motion.div
      className={`glass-card ${className}`}
      style={baseStyle}
      whileHover={hoverEffect ? { 
        y: -5,
        borderColor: 'var(--border-strong)',
        boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
      } : {}}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      {...props}
    >
      {children}
    </motion.div>
  );
}
