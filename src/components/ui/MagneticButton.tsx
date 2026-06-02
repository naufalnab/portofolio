import { motion } from 'framer-motion';
import { ReactNode } from 'react';
import { useMagneticCursor } from '../../hooks/useMagneticCursor';

interface MagneticButtonProps {
  children: ReactNode;
  href?: string;
  className?: string;
  onClick?: () => void;
  strength?: number;
  primary?: boolean;
}

export function MagneticButton({ 
  children, 
  href, 
  className = '', 
  onClick, 
  strength = 0.5,
  primary = false
}: MagneticButtonProps) {
  const { ref, x, y } = useMagneticCursor(strength);

  const baseClass = `btn ${primary ? 'btn-primary' : 'btn-ghost'} ${className}`;
  
  const content = (
    <motion.span 
      style={{ x, y }} 
      className="inline-block"
      transition={{ type: 'spring', stiffness: 150, damping: 15 }}
    >
      {children}
    </motion.span>
  );

  if (href) {
    return (
      <motion.a 
        ref={ref as any}
        href={href} 
        className={baseClass}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        style={{ display: 'inline-flex', justifyContent: 'center', alignItems: 'center' }}
      >
        {content}
      </motion.a>
    );
  }

  return (
    <motion.button 
      ref={ref as any}
      onClick={onClick} 
      className={baseClass}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      style={{ display: 'inline-flex', justifyContent: 'center', alignItems: 'center' }}
    >
      {content}
    </motion.button>
  );
}
