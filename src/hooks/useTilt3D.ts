import { useRef } from 'react';
import { useMotionValue, useSpring, useTransform } from 'framer-motion';

export function useTilt3D(maxRotation: number = 10, scaleOnHover: number = 1.02) {
  const ref = useRef<HTMLDivElement>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const isHovered = useMotionValue(0); // 0 = false, 1 = true

  // Spring configuration for smooth returning
  const springConfig = { damping: 20, stiffness: 200, mass: 0.5 };
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);
  const springHover = useSpring(isHovered, springConfig);

  // Transform normalized mouse position (-1 to 1) to rotation degrees
  const rotateX = useTransform(springY, [-1, 1], [maxRotation, -maxRotation]);
  const rotateY = useTransform(springX, [-1, 1], [-maxRotation, maxRotation]);
  const scale = useTransform(springHover, [0, 1], [1, scaleOnHover]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    
    // Calculate mouse position relative to element center (-1 to 1)
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const mouseX = (e.clientX - centerX) / (rect.width / 2);
    const mouseY = (e.clientY - centerY) / (rect.height / 2);

    x.set(mouseX);
    y.set(mouseY);
  };

  const handleMouseEnter = () => {
    isHovered.set(1);
  };

  const handleMouseLeave = () => {
    isHovered.set(0);
    x.set(0);
    y.set(0);
  };

  return {
    ref,
    tiltProps: {
      onMouseMove: handleMouseMove,
      onMouseEnter: handleMouseEnter,
      onMouseLeave: handleMouseLeave,
      style: {
        rotateX,
        rotateY,
        scale,
        transformPerspective: 1000,
      }
    },
    x, // raw motion values in case we want to use them for inner elements (e.g. glare)
    y,
    isHovered: springHover
  };
}
