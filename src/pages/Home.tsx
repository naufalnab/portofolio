import { PageTransition } from '../components/layout/PageTransition';
import { SectionReveal } from '../components/ui/SectionReveal';
import { TextReveal } from '../components/ui/TextReveal';
import { GradientText } from '../components/ui/GradientText';
import { TiltCard } from '../components/ui/TiltCard';
import { AnimatedCounter } from '../components/ui/AnimatedCounter';
import { MagneticButton } from '../components/ui/MagneticButton';
import { ParallaxSection } from '../components/ui/ParallaxSection';
import { motion } from 'framer-motion';
import './Home.css';

export function Home() {
  return (
    <PageTransition title="Home — Naufal Nabila">
      {/* HERO SECTION */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <motion.div 
              className="hero-badge"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <span className="pulse-dot"></span> Tersedia untuk proyek
            </motion.div>
            
            <h1 className="hero-title">
              <TextReveal text="Membangun Sistem yang Mengubah Kekacauan menjadi " as="span" />
              <GradientText>Kejelasan.</GradientText>
            </h1>
            
            <motion.p 
              className="hero-subtitle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 1 }}
            >
              Saya Naufal Nabila. Saya merancang, merencanakan, dan membangun dashboard, portal klien, internal tools, dan alur kerja AI yang mengotomatiskan operasional Anda yang berantakan.
            </motion.p>
          </div>

          <SectionReveal delay={1} direction="up" className="hero-visual">
            <TiltCard className="hero-visual-card before" maxRotation={5}>
              <div className="hero-visual-label">Sebelum</div>
              <ul className="hero-visual-list">
                <li>Percakapan WhatsApp berserakan</li>
                <li>Spreadsheet yang berantakan</li>
                <li>Pekerjaan admin manual berulang</li>
                <li>Tindak lanjut yang terlewat</li>
              </ul>
            </TiltCard>
            
            <div className="hero-visual-arrow">→</div>
            
            <TiltCard className="hero-visual-card after" maxRotation={5}>
              <div className="hero-visual-label">Sesudah</div>
              <ul className="hero-visual-list">
                <li>Dashboard terpusat</li>
                <li>Penerimaan klien otomatis</li>
                <li>Operasional dibantu AI</li>
                <li>Alur kerja yang terukur</li>
              </ul>
            </TiltCard>
          </SectionReveal>

          <motion.div 
            className="hero-cta"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
          >
            <MagneticButton href="/case-studies" primary={false}>
              Lihat Proyek Pilihan
            </MagneticButton>
          </motion.div>

          <SectionReveal delay={1.4} direction="up" className="hero-stats">
            <div>
              <div className="stat-num"><AnimatedCounter value={5} suffix="+" /></div>
              <div className="stat-label">Tahun Pengalaman</div>
            </div>
            <div>
              <div className="stat-num"><AnimatedCounter value={20} suffix="+" /></div>
              <div className="stat-label">Proyek Selesai</div>
            </div>
            <div>
              <div className="stat-num"><AnimatedCounter value={15} suffix="+" /></div>
              <div className="stat-label">Organisasi Dilayani</div>
            </div>
            <div>
              <div className="stat-num"><AnimatedCounter value={4} /></div>
              <div className="stat-label">Platform EdTech Didirikan</div>
            </div>
          </SectionReveal>
        </div>
      </section>

      {/* ABOUT SECTION */}
      <ParallaxSection distance={50} className="about">
        <div className="container">
          <div className="about-grid">
            <SectionReveal direction="left" className="about-image-wrap">
              <motion.img 
                src="/assets/images/profile.jpeg" 
                alt="Naufal Nabila" 
                className="profile-img"
                whileHover={{ scale: 1.05 }}
                transition={{ type: 'spring', stiffness: 200, damping: 20 }}
              />
              <div className="profile-badges">
                <span className="profile-badge"><span className="icon">📍</span>Berbasis di Indonesia</span>
                <span className="profile-badge"><span className="icon">⚙️</span>Sistem AI · ERP · LMS</span>
              </div>
              <div className="about-positioning">
                Saya tidak sekadar menulis kode. Saya memetakan proses bisnis, merancang alur kerja, dan membangun sistem yang benar-benar bisa digunakan tim.
              </div>
            </SectionReveal>
            
            <SectionReveal direction="up" className="about-content">
              <span className="section-eyebrow">Tentang</span>
              <h2 className="section-title">
                Berfokus mengubah masalah bisnis yang kompleks menjadi sistem yang rapi dan cerdas.
              </h2>
              <p className="about-lead">
                Saya bekerja dengan founder dan tim yang terjebak dengan tools yang tersebar, tugas manual berulang, serah-terima yang tidak jelas, dan operasional yang terlalu bergantung pada ingatan. Tugas saya mengubah kekacauan itu menjadi dashboard, otomasi, internal tools, alur kerja AI, dan sistem operasional yang membuat bisnis lebih mudah dijalankan.
              </p>

              <div className="about-pillars">
                <div className="pillar">
                  <h4>Siapa Saya</h4>
                  <p>Seorang engineer dan founder EdTech dengan pengalaman 5+ tahun di mobile (Flutter), ERP (Odoo), dan otomasi alur kerja AI (n8n + Vertex AI). Saya menjembatani pemikiran produk dengan eksekusi teknis yang mendalam.</p>
                </div>
                <div className="pillar">
                  <h4>Apa yang Saya Lakukan</h4>
                  <p>Otomasi AI end-to-end, modul Odoo kustom, platform web microservice dengan SvelteKit, dan produk pembelajaran bertenaga AI dengan pipeline video multi-bahasa.</p>
                </div>
                <div className="pillar">
                  <h4>Bukti Karya</h4>
                  <p>Founder Pembelajar Belajar, Al Muta'allim, Belajar Sekejap, dan The Learning Learner. Dipercaya oleh Yamaha Motor Parts, Telkom Sigma, SUCOFINDO, Duniatex, PT. Adhi Karya, PT. Naska Jala Dewa, dan PT. Kripto Syariah Indonesia.</p>
                </div>
              </div>
            </SectionReveal>
          </div>
        </div>
      </ParallaxSection>
    </PageTransition>
  );
}
