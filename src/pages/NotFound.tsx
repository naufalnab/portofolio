import { PageTransition } from '../components/layout/PageTransition';
import { MagneticButton } from '../components/ui/MagneticButton';
import { motion } from 'framer-motion';

export function NotFound() {
  return (
    <PageTransition title="404 — Halaman Tidak Ditemukan">
      <section 
        className="not-found" 
        style={{ 
          minHeight: '70vh', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          textAlign: 'center',
          paddingTop: 'var(--nav-clearance)'
        }}
      >
        <div className="container">
          <motion.h1 
            style={{ fontSize: 'clamp(4rem, 10vw, 8rem)', fontWeight: 800, margin: 0, lineHeight: 1 }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, type: 'spring' }}
          >
            404
          </motion.h1>
          <motion.h2 
            style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--text)' }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Halaman tidak ditemukan
          </motion.h2>
          <motion.p 
            style={{ color: 'var(--text-muted)', marginBottom: '3rem' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Halaman yang Anda cari sudah dipindahkan atau tidak tersedia.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <MagneticButton href="/" primary={true}>Kembali ke Beranda</MagneticButton>
          </motion.div>
        </div>
      </section>
    </PageTransition>
  );
}
