import { motion } from 'framer-motion';
import { ReactNode } from 'react';
import { useScrollReveal } from '../../hooks/useScrollReveal';
import { fadeInUp, fadeInLeft, fadeInRight, scaleIn } from '../../lib/animations';

interface SectionRevealProps {
  children: ReactNode;
  id?: string;
  className?: string;
  direction?: 'up' | 'left' | 'right' | 'scale';
  delay?: number;
  once?: boolean;
}

export function SectionReveal({ 
  children, 
  id,
  className = '', 
  direction = 'up',
  delay = 0,
  once = true
}: SectionRevealProps) {
  const { ref, controls } = useScrollReveal(once, "-10%");

  let variants = fadeInUp;
  if (direction === 'left') variants = fadeInLeft;
  if (direction === 'right') variants = fadeInRight;
  if (direction === 'scale') variants = scaleIn;

  // Add delay if provided
  const customVariants = {
    hidden: variants.hidden,
    visible: {
      ...variants.visible,
      transition: {
        ...(variants.visible as any).transition,
        delay
      }
    }
  };

  return (
    <motion.section
      id={id}
      ref={ref as any}
      initial="hidden"
      animate={controls}
      variants={customVariants}
      className={className}
    >
      {children}
    </motion.section>
  );
}
