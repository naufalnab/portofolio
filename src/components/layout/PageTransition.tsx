import { motion } from 'framer-motion';
import { ReactNode } from 'react';
import { pageTransition } from '../../lib/animations';
import { Helmet } from 'react-helmet-async';

interface PageTransitionProps {
  children: ReactNode;
  className?: string;
  title?: string;
  description?: string;
}

export function PageTransition({ 
  children, 
  className = '',
  title = 'Naufal Nabila — Portfolio',
  description = 'Portfolio of Naufal Nabila'
}: PageTransitionProps) {
  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
      </Helmet>
      <motion.main
        initial="initial"
        animate="animate"
        exit="exit"
        variants={pageTransition}
        className={className}
        style={{ width: '100%', display: 'flex', flexDirection: 'column', flex: 1 }}
      >
        {children}
      </motion.main>
    </>
  );
}
