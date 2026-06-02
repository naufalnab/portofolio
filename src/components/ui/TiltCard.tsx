import { motion } from 'framer-motion';
import { ReactNode } from 'react';
import { useTilt3D } from '../../hooks/useTilt3D';

interface TiltCardProps {
  children: ReactNode;
  className?: string;
  maxRotation?: number;
  scaleOnHover?: number;
  style?: React.CSSProperties;
}

export function TiltCard({ 
  children, 
  className = '', 
  maxRotation = 10, 
  scaleOnHover = 1.02,
  style = {}
}: TiltCardProps) {
  const { ref, tiltProps } = useTilt3D(maxRotation, scaleOnHover);

  return (
    <motion.div
      ref={ref as any}
      {...tiltProps}
      className={`service-card ${className}`}
      style={{
        ...style,
        ...tiltProps.style,
        transformStyle: 'preserve-3d',
      }}
    >
      {/* Content wrapper to pull it towards the viewer slightly for 3D effect */}
      <motion.div style={{ transform: 'translateZ(30px)' }}>
        {children}
      </motion.div>
    </motion.div>
  );
}
