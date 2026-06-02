import { useScroll, useTransform, MotionValue } from 'framer-motion';

export function useParallax(distance: number = 50): { y: MotionValue<number> } {
  const { scrollY } = useScroll();
  // Simply map scroll from 0 to 1000px to move element from 0 to -distance
  const y = useTransform(scrollY, [0, 1000], [0, -distance]);
  return { y };
}

export function useElementParallax(
  ref: React.RefObject<HTMLElement | null>,
  distance: number = 50
): { y: MotionValue<number> } {
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });
  
  const y = useTransform(scrollYProgress, [0, 1], [-distance, distance]);
  
  return { y };
}
