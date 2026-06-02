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
              <span className="pulse-dot"></span> Menerima proyek dashboard, ERP, dan otomasi AI
            </motion.div>

            <h1 className="hero-title">
              <TextReveal text="Dari WhatsApp, Spreadsheet, dan Tugas Manual — Menjadi " as="span" />
              <GradientText>Sistem Operasional yang Rapi.</GradientText>
            </h1>

            <motion.p
              className="hero-subtitle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 1 }}
            >
              Saya membantu bisnis merapikan operasional yang masih bergantung pada WhatsApp, spreadsheet, dan proses manual menjadi dashboard, portal klien, internal tools, dan otomasi AI yang bisa dipakai tim setiap hari.
            </motion.p>
          </div>

          <SectionReveal delay={1} direction="up" className="hero-visual">
            <TiltCard className="hero-visual-card before" maxRotation={5}>
              <div className="hero-visual-label">Sebelum</div>
              <ul className="hero-visual-list">
                <li>Order masuk dari banyak chat</li>
                <li>Data klien tersebar di spreadsheet</li>
                <li>Follow-up sering lupa</li>
                <li>Laporan dibuat manual</li>
              </ul>
            </TiltCard>

            <div className="hero-visual-arrow">→</div>

            <TiltCard className="hero-visual-card after" maxRotation={5}>
              <div className="hero-visual-label">Sesudah</div>
              <ul className="hero-visual-list">
                <li>Semua data masuk ke dashboard</li>
                <li>Status pekerjaan terlihat real-time</li>
                <li>Reminder & follow-up otomatis</li>
                <li>Laporan siap tanpa rekap ulang</li>
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
              <div className="stat-label">Tahun membangun sistem digital</div>
            </div>
            <div>
              <div className="stat-num"><AnimatedCounter value={20} suffix="+" /></div>
              <div className="stat-label">Website, dashboard, aplikasi, dan otomasi selesai</div>
            </div>
            <div>
              <div className="stat-num"><AnimatedCounter value={15} suffix="+" /></div>
              <div className="stat-label">Bisnis & organisasi dilayani</div>
            </div>
            <div>
              <div className="stat-num"><AnimatedCounter value={4} /></div>
              <div className="stat-label">Platform EdTech aktif dikembangkan</div>
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
                Saya tidak mulai dari kode. Saya mulai dari memahami alur kerja, titik macet, dan kebiasaan tim — lalu membangunnya menjadi sistem yang benar-benar dipakai.
              </div>
            </SectionReveal>

            <SectionReveal direction="up" className="about-content">
              <span className="section-eyebrow">Tentang</span>
              <h2 className="section-title">
                Saya membantu owner dan tim operasional melihat, mengontrol, dan mengotomasi pekerjaan mereka dalam satu sistem.
              </h2>
              <p className="about-lead">
                Saya bekerja dengan founder dan tim yang terjebak dengan tools yang tersebar, tugas manual berulang, serah-terima yang tidak jelas, dan operasional yang terlalu bergantung pada ingatan. Tugas saya mengubah kekacauan itu menjadi dashboard, otomasi, internal tools, alur kerja AI, dan sistem operasional yang membuat bisnis lebih mudah dijalankan.
              </p>

              <div className="about-pillars">
                <div className="pillar">
                  <h4>Siapa Saya</h4>
                  <p>Founder dan engineer dengan 5+ tahun membangun aplikasi web, mobile, ERP ringan, dan otomasi AI.</p>
                </div>
                <div className="pillar">
                  <h4>Apa yang Saya Bantu</h4>
                  <p>Saya membantu bisnis merapikan proses manual menjadi dashboard, portal klien, internal tools, sistem laporan, dan workflow AI.</p>
                </div>
                <div className="pillar">
                  <h4>Bukti Kerja</h4>
                  <p>Membangun Pembelajar Belajar, Belajar Sekejap, AI Muta'allim, The Learning Learner, dan dipercaya oleh beberapa bisnis dan organisasi.</p>
                </div>
              </div>
            </SectionReveal>
          </div>
        </div>
      </ParallaxSection>

      {/* PROBLEMS SECTION */}
      <section className="problems">
        <div className="container">
          <SectionReveal direction="up">
            <span className="section-eyebrow">Masalah yang Sering Saya Temui</span>
            <h2 className="section-title">
              Apakah operasional Anda masih seperti ini?
            </h2>
          </SectionReveal>

          <div className="problems-grid">
            <SectionReveal direction="up" delay={0.1} className="problem-item">
              <div className="problem-icon">💬</div>
              <p>Data klien tersebar di WhatsApp, spreadsheet, dan catatan manual.</p>
            </SectionReveal>

            <SectionReveal direction="up" delay={0.2} className="problem-item">
              <div className="problem-icon">🔄</div>
              <p>Tim harus input data yang sama berkali-kali di berbagai sistem.</p>
            </SectionReveal>

            <SectionReveal direction="up" delay={0.3} className="problem-item">
              <div className="problem-icon">👁️</div>
              <p>Owner sulit melihat status pekerjaan secara real-time.</p>
            </SectionReveal>

            <SectionReveal direction="up" delay={0.4} className="problem-item">
              <div className="problem-icon">📋</div>
              <p>Laporan butuh waktu lama karena harus direkap manual.</p>
            </SectionReveal>

            <SectionReveal direction="up" delay={0.5} className="problem-item">
              <div className="problem-icon">⏰</div>
              <p>Approval dan follow-up sering tertunda atau kelewat.</p>
            </SectionReveal>

            <SectionReveal direction="up" delay={0.6} className="problem-item">
              <div className="problem-icon">⚙️</div>
              <p>Sistem yang ada terlalu kaku atau tidak sesuai cara tim bekerja.</p>
            </SectionReveal>

            <SectionReveal direction="up" delay={0.7} className="problem-item">
              <div className="problem-icon">🤖</div>
              <p>Ingin pakai AI, tapi belum tahu alur kerja yang aman dan berguna.</p>
            </SectionReveal>
          </div>

          <SectionReveal direction="up" delay={0.8} className="problems-cta">
            <p>Kalau masalahnya seperti ini, biasanya solusinya bukan sekadar website. Anda butuh sistem operasional yang dirancang sesuai alur kerja tim.</p>
            <MagneticButton href="/services" primary={true}>
              Lihat Solusinya
            </MagneticButton>
          </SectionReveal>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="cta-final">
        <div className="container">
          <SectionReveal direction="up" className="cta-content">
            <h2>Siap Memulai?</h2>
            <p>Mulai dari konsultasi workflow gratis atau diskusi proyek langsung.</p>
            <div className="cta-buttons">
              <MagneticButton href="mailto:hello@naufalnabila.my.id" primary={true}>
                Diskusi Proyek
              </MagneticButton>
              <MagneticButton href="/case-studies" primary={false}>
                Lihat Studi Kasus Dulu
              </MagneticButton>
            </div>
          </SectionReveal>
        </div>
      </section>
    </PageTransition>
  );
}
