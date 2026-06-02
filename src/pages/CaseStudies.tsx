import { PageTransition } from '../components/layout/PageTransition';
import { SectionReveal } from '../components/ui/SectionReveal';
import { TextReveal } from '../components/ui/TextReveal';
import { GlassCard } from '../components/ui/GlassCard';
import { StaggerList, StaggerItem } from '../components/ui/StaggerList';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './CaseStudies.css';

export function CaseStudies() {
  const [showAllClients, setShowAllClients] = useState(false);

  return (
    <PageTransition title="Studi Kasus — Naufal Nabila">
      {/* HEADER SECTION */}
      <section className="page-header">
        <div className="container">
          <SectionReveal direction="up">
            <h1 className="page-title">
              <TextReveal text="Studi Kasus: Sistem di Dunia Nyata." />
            </h1>
            <p className="page-subtitle">
              Intip bagaimana saya membantu perusahaan berkembang melebihi proses manual mereka.
              Sistem ini memproses data nyata, mengotomatisasi pekerjaan berjam-jam, dan menumbuhkan
              bisnis setiap hari.
            </p>
          </SectionReveal>
        </div>
      </section>

      {/* FEATURED PROJECTS */}
      <section className="featured-projects" id="featured">
        <div className="container">
          <div className="projects-grid">
            
            <SectionReveal direction="up" className="project-card">
              <div className="project-content">
                <span className="project-category">Otomasi Alur Kerja AI</span>
                <h3>Sistem Pembuatan Video Multi-Bahasa</h3>
                <p>
                  Mengembangkan pipeline AI komprehensif untuk merek EdTech untuk
                  secara otomatis menerjemahkan, men-dubbing, dan mempublikasikan konten pendidikan ke
                  dalam 4 bahasa. Mengurangi waktu produksi sebesar 80% dan memungkinkan
                  jangkauan audiens global.
                </p>
                <div className="project-tags">
                  <span>n8n</span>
                  <span>Vertex AI</span>
                  <span>SvelteKit</span>
                  <span>Drizzle ORM</span>
                </div>
              </div>
            </SectionReveal>

            <SectionReveal direction="up" delay={0.2} className="project-card">
              <div className="project-content">
                <span className="project-category">Implementasi ERP</span>
                <h3>Digitalisasi Rantai Pasok Manufaktur</h3>
                <p>
                  Mengimplementasikan Odoo ERP khusus untuk produsen suku cadang otomotif.
                  Sistem ini menggantikan 12 spreadsheet berbeda, memberikan visibilitas real-time ke
                  tingkat inventaris, dan mengotomatiskan proses persetujuan pengadaan.
                </p>
                <div className="project-tags">
                  <span>Odoo</span>
                  <span>PostgreSQL</span>
                  <span>Python</span>
                  <span>XML</span>
                </div>
              </div>
            </SectionReveal>

            <SectionReveal direction="up" delay={0.4} className="project-card">
              <div className="project-content">
                <span className="project-category">Pengembangan Mobile</span>
                <h3>Aplikasi Teknisi Lapangan Offline-First</h3>
                <p>
                  Membangun aplikasi seluler Flutter lintas platform untuk tim layanan lapangan yang
                  beroperasi di area dengan konektivitas rendah. Aplikasi ini menyinkronkan data tugas
                  saat offline dan secara otomatis menyelesaikan rekonsiliasi setelah online,
                  menghilangkan 15 jam entry data manual setiap minggu.
                </p>
                <div className="project-tags">
                  <span>Flutter</span>
                  <span>Dart</span>
                  <span>Firebase</span>
                  <span>SQLite</span>
                </div>
              </div>
            </SectionReveal>

          </div>
        </div>
      </section>

      {/* ALL CLIENTS GRID */}
      <section className="all-clients" id="clients">
        <div className="container">
          <SectionReveal direction="up">
            <span className="section-eyebrow">Daftar Klien</span>
            <h2 className="section-title">Dipercaya oleh bisnis yang sedang berkembang.</h2>
          </SectionReveal>

          <StaggerList className="clients-grid" once={true} fast={true}>
            
            {/* Initial visible clients */}
            <StaggerItem className="client-wrapper">
              <GlassCard className="client-card">
                <div className="client-monogram">TS</div>
                <div className="client-info">
                  <div className="client-industry">Telekomunikasi & IT</div>
                  <div className="client-name">Telkom Sigma</div>
                  <div className="client-desc">Sistem manajemen layanan TI perusahaan dan solusi data center.</div>
                </div>
              </GlassCard>
            </StaggerItem>

            <StaggerItem className="client-wrapper">
              <GlassCard className="client-card">
                <div className="client-monogram">YMP</div>
                <div className="client-info">
                  <div className="client-industry">Manufaktur Otomotif</div>
                  <div className="client-name">Yamaha Motor Parts</div>
                  <div className="client-desc">Optimalisasi sistem ERP dan modul kustom pelacakan rantai pasok.</div>
                </div>
              </GlassCard>
            </StaggerItem>

            <StaggerItem className="client-wrapper">
              <GlassCard className="client-card">
                <div className="client-monogram">SCI</div>
                <div className="client-info">
                  <div className="client-industry">Sertifikasi & Inspeksi</div>
                  <div className="client-name">PT. SUCOFINDO</div>
                  <div className="client-desc">Sistem portal web terpadu untuk pelaporan dan manajemen klien.</div>
                </div>
              </GlassCard>
            </StaggerItem>

            <StaggerItem className="client-wrapper">
              <GlassCard className="client-card">
                <div className="client-monogram">ADK</div>
                <div className="client-info">
                  <div className="client-industry">Konstruksi</div>
                  <div className="client-name">PT Adhi Karya</div>
                  <div className="client-desc">Sistem manajemen proyek dan pelacakan material untuk operasional skala besar.</div>
                </div>
              </GlassCard>
            </StaggerItem>

            <StaggerItem className="client-wrapper">
              <GlassCard className="client-card">
                <div className="client-monogram">NJD</div>
                <div className="client-info">
                  <div className="client-industry">Konstruksi & Kelautan</div>
                  <div className="client-name">PT Naska Jala Dewa</div>
                  <div className="client-desc">Platform otomasi manajemen proyek dan pelaporan klien komprehensif.</div>
                </div>
              </GlassCard>
            </StaggerItem>

            <StaggerItem className="client-wrapper">
              <GlassCard className="client-card">
                <div className="client-monogram">KSI</div>
                <div className="client-info">
                  <div className="client-industry">Fintech Syariah</div>
                  <div className="client-name">PT Kripto Syariah Indonesia</div>
                  <div className="client-desc">Platform perdagangan aman dengan integrasi data blockchain real-time.</div>
                </div>
              </GlassCard>
            </StaggerItem>

            {/* Expandable content via AnimatePresence */}
            <AnimatePresence>
              {showAllClients && (
                <>
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="client-wrapper"
                  >
                    <GlassCard className="client-card">
                      <div className="client-monogram">MP</div>
                      <div className="client-info">
                        <div className="client-industry">Farmasi</div>
                        <div className="client-name">PT Mahakam Beta Farma</div>
                        <div className="client-desc">Sistem manajemen kepatuhan operasional dan visibilitas distribusi inventaris.</div>
                      </div>
                    </GlassCard>
                  </motion.div>
                  
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="client-wrapper"
                  >
                    <GlassCard className="client-card">
                      <div className="client-monogram">AJ</div>
                      <div className="client-info">
                        <div className="client-industry">Otomotif</div>
                        <div className="client-name">PT Armada International Motor</div>
                        <div className="client-desc">Implementasi ERP untuk manajemen dealer dengan CRM canggih dan analitik penjualan.</div>
                      </div>
                    </GlassCard>
                  </motion.div>
                  
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="client-wrapper"
                  >
                    <GlassCard className="client-card">
                      <div className="client-monogram">AB</div>
                      <div className="client-info">
                        <div className="client-industry">Logistik</div>
                        <div className="client-name">PT Asia Bandar Alam</div>
                        <div className="client-desc">Solusi logistik dan pergudangan dengan pelacakan real-time dan kemampuan pelaporan otomatis.</div>
                      </div>
                    </GlassCard>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </StaggerList>

          <div style={{ textAlign: 'center', marginTop: '3rem' }}>
            <button 
              className="btn btn-ghost"
              onClick={() => setShowAllClients(!showAllClients)}
            >
              {showAllClients ? 'Tampilkan Lebih Sedikit' : 'Lihat Semua Klien'}
            </button>
          </div>
        </div>
      </section>
    </PageTransition>
  );
}
