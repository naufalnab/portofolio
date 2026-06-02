import { motion } from 'framer-motion';
import { useScrollReveal } from '../../hooks/useScrollReveal';

import { ElementType } from 'react';

interface TextRevealProps {
  text: string;
  className?: string;
  delay?: number;
  as?: ElementType;
}

export function TextReveal({ text, className = '', delay = 0, as: Component = 'span' }: TextRevealProps) {
  const { ref, controls } = useScrollReveal();
  
  // Split text into words
  const words = text.split(' ');

  const container = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { staggerChildren: 0.12, delayChildren: delay * i },
    }),
  };

  const child = {
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        damping: 12,
        stiffness: 100,
      },
    },
    hidden: {
      opacity: 0,
      y: 20,
      transition: {
        type: 'spring',
        damping: 12,
        stiffness: 100,
      },
    },
  };

  const MotionComponent = motion(Component as any);

  return (
    <MotionComponent
      ref={ref}
      className={className}
      variants={container}
      initial="hidden"
      animate={controls}
      style={{ display: 'inline-flex', flexWrap: 'wrap', gap: '0.25em' }}
    >
      {words.map((word, index) => (
        <motion.span variants={child as any} key={index}>
          {word}
        </motion.span>
      ))}
    </MotionComponent>
  );
}
