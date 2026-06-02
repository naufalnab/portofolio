import { useEffect } from 'react';
import { useAnimation, useInView } from 'framer-motion';
import { useRef } from 'react';

export function useScrollReveal(once: boolean = true, margin: string = "-100px") {
  const ref = useRef<HTMLElement | HTMLDivElement>(null);
  const isInView = useInView(ref, { once, margin: margin as any });
  const controls = useAnimation();

  useEffect(() => {
    if (isInView) {
      controls.start('visible');
    } else if (!once) {
      controls.start('hidden');
    }
  }, [isInView, controls, once]);

  return { ref, controls };
}
