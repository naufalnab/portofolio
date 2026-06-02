import { motion } from 'framer-motion';
import { useCountUp } from '../../hooks/useCountUp';

interface AnimatedCounterProps {
  value: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
  className?: string;
}

export function AnimatedCounter({ 
  value, 
  suffix = '', 
  prefix = '', 
  duration = 2000,
  className = ''
}: AnimatedCounterProps) {
  const { count, ref } = useCountUp(value, duration);

  return (
    <motion.span ref={ref} className={className}>
      {prefix}{count}{suffix}
    </motion.span>
  );
}
