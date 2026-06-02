import { motion } from 'framer-motion';
import { ReactNode } from 'react';
import { useScrollReveal } from '../../hooks/useScrollReveal';


interface StaggerListProps {
  children: ReactNode;
  className?: string;
  once?: boolean;
  fast?: boolean;
}

export function StaggerList({ 
  children, 
  className = '',
  once = true,
  fast = false
}: StaggerListProps) {
  const { ref, controls } = useScrollReveal(once);

  const customVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: fast ? 0.05 : 0.1,
        delayChildren: fast ? 0.05 : 0.1
      }
    }
  };

  return (
    <motion.div
      ref={ref as any}
      initial="hidden"
      animate={controls}
      variants={customVariants}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Helper component for children of StaggerList
export function StaggerItem({ children, className = '' }: { children: ReactNode, className?: string }) {
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: 'spring',
        damping: 20,
        stiffness: 150
      }
    }
  };

  return (
    <motion.div variants={itemVariants as any} className={className}>
      {children}
    </motion.div>
  );
}
