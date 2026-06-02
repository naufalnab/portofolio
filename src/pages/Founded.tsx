import { PageTransition } from '../components/layout/PageTransition';
import { SectionReveal } from '../components/ui/SectionReveal';
import { TextReveal } from '../components/ui/TextReveal';
import { TiltCard } from '../components/ui/TiltCard';
import { StaggerList, StaggerItem } from '../components/ui/StaggerList';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './Founded.css';

export function Founded() {
  const [showAllCerts, setShowAllCerts] = useState(false);

  return (
    <PageTransition title="Didirikan — Naufal Nabila">
      {/* HEADER SECTION */}
      <section className="page-header">
        <div className="container">
          <SectionReveal direction="up">
            <h1 className="page-title">
              <TextReveal text="Saya Tidak Hanya Membuat Sistem untuk Klien — Saya Juga Membangun Produk Saya Sendiri." />
            </h1>
            <p className="page-subtitle">
              Selain membantu klien, saya juga membangun dan menjalankan platform saya sendiri. Dari sini saya belajar langsung tentang retensi pengguna, infrastruktur, konten, otomasi, pembayaran, dan manajemen produk di dunia nyata.
            </p>
          </SectionReveal>
        </div>
      </section>

      {/* PLATFORMS */}
      <section className="platforms-section" id="platforms">
        <div className="container">
          <div className="platforms-grid">

            <TiltCard className="platform-card" maxRotation={3}>
              <div className="platform-header">
                <div className="platform-logo pb">PB</div>
                <div className="platform-status">
                  <span className="status-dot"></span> Aktif Beroperasi
                </div>
              </div>
              <div className="platform-content">
                <h3>Pembelajar Belajar</h3>
                <p className="platform-url"><a href="https://pembelajarbelajar.com" target="_blank" rel="noopener">pembelajarbelajar.com</a></p>
                <p className="platform-desc">
                  Platform e-learning bertenaga AI dengan terjemahan otomatis, dubbing
                  video (4 bahasa), dan penerbitan konten. Dibangun untuk menyederhanakan
                  distribusi pendidikan untuk audiens global.
                </p>
                <div className="platform-metrics">
                  <div className="metric">
                    <span className="metric-val">4</span>
                    <span className="metric-label">Bahasa Didukung</span>
                  </div>
                  <div className="metric">
                    <span className="metric-val">100%</span>
                    <span className="metric-label">Video AI</span>
                  </div>
                </div>
              </div>
            </TiltCard>

            <TiltCard className="platform-card" maxRotation={3}>
              <div className="platform-header">
                <div className="platform-logo am">AM</div>
                <div className="platform-status">
                  <span className="status-dot"></span> Aktif Beroperasi
                </div>
              </div>
              <div className="platform-content">
                <h3>Al Muta'allim</h3>
                <p className="platform-url"><a href="https://almutaalim.com" target="_blank" rel="noopener">almutaalim.com</a></p>
                <p className="platform-desc">
                  Platform pendidikan khusus yang dirancang untuk kajian keislaman dengan
                  pembelajaran terstruktur, pelacakan kemajuan otomatis, dan sertifikasi.
                </p>
                <div className="platform-metrics">
                  <div className="metric">
                    <span className="metric-val">LMS</span>
                    <span className="metric-label">Sistem Berbasis Moodle</span>
                  </div>
                </div>
              </div>
            </TiltCard>

            <TiltCard className="platform-card" maxRotation={3}>
              <div className="platform-header">
                <div className="platform-logo bs">BS</div>
                <div className="platform-status">
                  <span className="status-dot"></span> Aktif Beroperasi
                </div>
              </div>
              <div className="platform-content">
                <h3>Belajar Sekejap</h3>
                <p className="platform-url"><a href="https://belajarsekejap.com" target="_blank" rel="noopener">belajarsekejap.com</a></p>
                <p className="platform-desc">
                  Micro-learning platform yang memberikan konten edukasi berukuran kecil.
                  Dioptimalkan untuk konsumsi cepat di perangkat seluler dengan sistem yang
                  sangat responsif.
                </p>
              </div>
            </TiltCard>

            <TiltCard className="platform-card" maxRotation={3}>
              <div className="platform-header">
                <div className="platform-logo tl">TL</div>
                <div className="platform-status">
                  <span className="status-dot"></span> Aktif Beroperasi
                </div>
              </div>
              <div className="platform-content">
                <h3>The Learning Learner</h3>
                <p className="platform-url"><a href="https://thelearninglearner.com" target="_blank" rel="noopener">thelearninglearner.com</a></p>
                <p className="platform-desc">
                  Jaringan pendidikan global yang berfokus pada sumber daya pengembangan profesional
                  serta artikel wawasan tentang teknologi dan pembelajaran.
                </p>
              </div>
            </TiltCard>

          </div>
        </div>
      </section>

      {/* BACKGROUND & SKILLS */}
      <section className="background-section" id="background">
        <div className="container">
          <div className="bg-grid">

            {/* Timeline */}
            <SectionReveal direction="left" className="bg-col">
              <span className="section-eyebrow">Perjalanan</span>
              <h2 className="section-title">Lintasan Karier</h2>

              <div className="timeline">
                <div className="timeline-item">
                  <div className="timeline-dot"></div>
                  <div className="timeline-date">2021 — Sekarang</div>
                  <div className="timeline-role">Independen Developer &amp; Founder</div>
                  <div className="timeline-desc">
                    Mendirikan beberapa platform EdTech sambil berkonsultasi untuk klien B2B,
                    mengimplementasikan ERP, dan membangun alur kerja otomasi berbasis AI.
                  </div>
                </div>
                <div className="timeline-item">
                  <div className="timeline-dot"></div>
                  <div className="timeline-date">2022 — 2023</div>
                  <div className="timeline-role">Mobile Developer</div>
                  <div className="timeline-desc">
                    Membangun aplikasi lintas platform menggunakan Flutter dan Dart untuk
                    manajemen layanan lapangan dan pelaporan data offline-first.
                  </div>
                </div>
                <div className="timeline-item">
                  <div className="timeline-dot"></div>
                  <div className="timeline-date">2019 — 2021</div>
                  <div className="timeline-role">Full-Stack Engineer</div>
                  <div className="timeline-desc">
                    Mengembangkan aplikasi web dengan PHP, JavaScript, dan kerangka kerja modern.
                    Memfokuskan diri pada sistem basis data dan panel admin kustom.
                  </div>
                </div>
              </div>
            </SectionReveal>

            {/* Certifications */}
            <SectionReveal direction="right" className="bg-col">
              <span className="section-eyebrow">Kredensial</span>
              <h2 className="section-title">Sertifikasi Industri</h2>

              <div className="cert-list">

                <div className="cert-item">
                  <div className="cert-info">
                    <div className="cert-name">Back-End Application Development</div>
                    <div className="cert-meta">Dicoding Indonesia<span className="dot">·</span>Mei 2025</div>
                  </div>
                  <a href="https://www.linkedin.com/in/naufal-nabila-8b2931143/details/featured/1749557457713/single-media-viewer/?profileId=ACoAACLX2sYBaayoKXpcBXkeLOe55XyyyRPrJ2g" target="_blank" rel="noopener" className="cert-link">Lihat →</a>
                </div>

                <div className="cert-item">
                  <div className="cert-info">
                    <div className="cert-name">Node.js Beginner Course</div>
                    <div className="cert-meta">Dicoding Indonesia<span className="dot">·</span>Apr 2025</div>
                  </div>
                  <a href="https://www.dicoding.com/certificates/6RPNG0DOGP2M" target="_blank" rel="noopener" className="cert-link">Lihat →</a>
                </div>

                <div className="cert-item">
                  <div className="cert-info">
                    <div className="cert-name">AWS Cloud Practitioner</div>
                    <div className="cert-meta">Dicoding Indonesia<span className="dot">·</span>Apr 2025</div>
                  </div>
                  <a href="https://www.dicoding.com/certificates/0LZ0G8V74P65" target="_blank" rel="noopener" className="cert-link">Lihat →</a>
                </div>

                <AnimatePresence>
                  {showAllCerts && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      style={{ overflow: 'hidden' }}
                    >
                      <div className="cert-item">
                        <div className="cert-info">
                          <div className="cert-name">Blockchain Foundations</div>
                          <div className="cert-meta">LinkedIn Learning<span className="dot">·</span>Mar 2025</div>
                        </div>
                        <a href="#" target="_blank" rel="noopener" className="cert-link">Lihat →</a>
                      </div>
                      <div className="cert-item">
                        <div className="cert-info">
                          <div className="cert-name">Dart Programming Language</div>
                          <div className="cert-meta">Dicoding Indonesia<span className="dot">·</span>2023</div>
                        </div>
                        <a href="https://www.dicoding.com/certificates/QLZ9Q6KD7Z5D" target="_blank" rel="noopener" className="cert-link">Lihat →</a>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <button
                  className="cert-toggle"
                  onClick={() => setShowAllCerts(!showAllCerts)}
                >
                  <span>{showAllCerts ? 'Tampilkan Lebih Sedikit' : 'Lihat semua sertifikasi'}</span>
                  <span>{showAllCerts ? '↑' : '↓'}</span>
                </button>
              </div>
            </SectionReveal>

          </div>
        </div>
      </section>
    </PageTransition>
  );
}
