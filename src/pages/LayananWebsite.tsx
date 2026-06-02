import { PageTransition } from '../components/layout/PageTransition';
import { SectionReveal } from '../components/ui/SectionReveal';
import { TextReveal } from '../components/ui/TextReveal';
import { GlassCard } from '../components/ui/GlassCard';
import { TiltCard } from '../components/ui/TiltCard';
import { StaggerList, StaggerItem } from '../components/ui/StaggerList';
import { MagneticButton } from '../components/ui/MagneticButton';
import './LayananKhusus.css'; // Shared CSS for specific services

export function LayananWebsite() {
  return (
    <PageTransition title="Jasa Pembuatan Website — Naufal Nabila">
      {/* HEADER SECTION */}
      <section className="page-header service-header">
        <div className="container">
          <SectionReveal direction="up" className="service-header-content">
            <span className="section-eyebrow">Layanan Khusus</span>
            <h1 className="page-title">
              <TextReveal text="Website yang Bekerja Sekeras Anda." />
            </h1>
            <p className="page-subtitle">
              Situs web Anda bukanlah brosur. Ia adalah ujung tombak digital Anda. Ia harus memuat
              dengan instan, mengkonversi pengunjung, dan tidak pernah rusak.
            </p>
            <div className="service-cta">
              <MagneticButton href="https://wa.me/6282328591004" primary={true}>Konsultasi Gratis</MagneticButton>
            </div>
          </SectionReveal>
        </div>
      </section>

      {/* WHY ME */}
      <section className="service-why" id="why">
        <div className="container">
          <div className="why-grid">
            
            <SectionReveal direction="up" delay={0.1}>
              <TiltCard className="why-card">
                <span className="why-icon">⚡</span>
                <h3>Cepat Seketika</h3>
                <p>Pengguna meninggalkan situs yang lambat. Saya merancang arsitektur web modern yang memuat dalam milidetik dan terasa instan.</p>
              </TiltCard>
            </SectionReveal>

            <SectionReveal direction="up" delay={0.2}>
              <TiltCard className="why-card">
                <span className="why-icon">🛡️</span>
                <h3>Arsitektur Aman</h3>
                <p>Dari sertifikat SSL hingga sanitasi data, situs Anda dibangun untuk menahan ancaman dan lalu lintas yang tiba-tiba melonjak.</p>
              </TiltCard>
            </SectionReveal>

            <SectionReveal direction="up" delay={0.3}>
              <TiltCard className="why-card">
                <span className="why-icon">📱</span>
                <h3>Responsive Sempurna</h3>
                <p>Sebagian besar pengguna Anda menggunakan perangkat seluler. Situs web saya dirancang dan diuji pada semua ukuran layar untuk piksel sempurna.</p>
              </TiltCard>
            </SectionReveal>

          </div>
        </div>
      </section>

      {/* PRICING */}
      <section className="service-pricing" id="pricing">
        <div className="container">
          <SectionReveal direction="up" className="text-center">
            <span className="section-eyebrow">Paket Layanan</span>
            <h2 className="section-title">Harga Transparan. Tanpa Kejutan.</h2>
          </SectionReveal>

          <StaggerList className="pricing-grid" once={true}>
            
            <StaggerItem>
              <GlassCard className="pricing-card">
                <div className="pricing-header">
                  <h3>Basic</h3>
                  <div className="price">Rp 2.500.000</div>
                  <p className="pricing-desc">Untuk landing page cepat & profil perusahaan.</p>
                </div>
                <ul className="pricing-features">
                  <li>Custom Design (1-3 Halaman)</li>
                  <li>Responsive Design</li>
                  <li>On-Page SEO Dasar</li>
                  <li>WhatsApp Integration</li>
                  <li>Waktu pengerjaan 1 minggu</li>
                </ul>
                <MagneticButton className="w-full" href="https://wa.me/6282328591004?text=Halo%20Naufal,%20saya%20tertarik%20dengan%20paket%20Website%20Basic">
                  Pilih Basic
                </MagneticButton>
              </GlassCard>
            </StaggerItem>

            <StaggerItem>
              <GlassCard className="pricing-card featured pulse-border">
                <div className="pricing-badge">Populer</div>
                <div className="pricing-header">
                  <h3>Pro</h3>
                  <div className="price">Rp 6.500.000</div>
                  <p className="pricing-desc">Dengan CMS (Sistem Manajemen Konten) dan analitik lengkap.</p>
                </div>
                <ul className="pricing-features">
                  <li>Custom Design (S/d 10 Halaman)</li>
                  <li>CMS (Bisa Update Sendiri)</li>
                  <li>Advanced SEO Setup</li>
                  <li>Analytics Dashboard</li>
                  <li>Google Indexing Guarantee</li>
                </ul>
                <MagneticButton primary={true} className="w-full" href="https://wa.me/6282328591004?text=Halo%20Naufal,%20saya%20tertarik%20dengan%20paket%20Website%20Pro">
                  Pilih Pro
                </MagneticButton>
              </GlassCard>
            </StaggerItem>

            <StaggerItem>
              <GlassCard className="pricing-card">
                <div className="pricing-header">
                  <h3>Custom</h3>
                  <div className="price">Mulai Rp 15Jt</div>
                  <p className="pricing-desc">Platform khusus: e-commerce, portal, SaaS, atau web apps.</p>
                </div>
                <ul className="pricing-features">
                  <li>Sistem Database Kustom</li>
                  <li>Integrasi API Pihak Ketiga</li>
                  <li>Otentikasi Pengguna</li>
                  <li>Payment Gateway</li>
                  <li>Arsitektur Cloud (AWS/GCP)</li>
                </ul>
                <MagneticButton className="w-full" href="https://wa.me/6282328591004?text=Halo%20Naufal,%20saya%20tertarik%20dengan%20paket%20Website%20Custom">
                  Konsultasi Custom
                </MagneticButton>
              </GlassCard>
            </StaggerItem>

          </StaggerList>
        </div>
      </section>

      {/* FAQ */}
      <section className="faq-section" id="faq">
        <div className="container">
          <SectionReveal direction="up" className="faq-wrapper">
            <h2 className="section-title">Pertanyaan Umum</h2>
            
            <div className="faq-list">
              <details className="faq-item">
                <summary className="faq-q">Berapa lama proses pengerjaan?</summary>
                <div className="faq-a">Basic 1 minggu, Pro 2-3 minggu, Custom mulai 4 minggu tergantung scope.</div>
              </details>
              <details className="faq-item">
                <summary className="faq-q">Apakah saya dapat source code?</summary>
                <div className="faq-a">Ya. Semua source code, akses domain, dan akses hosting menjadi milik Anda penuh.</div>
              </details>
              <details className="faq-item">
                <summary className="faq-q">Bagaimana sistem revisinya?</summary>
                <div className="faq-a">Revisi terbatas sesuai paket. Revisi major di luar scope dihitung terpisah dengan kuotasi transparan sebelum dieksekusi.</div>
              </details>
              <details className="faq-item">
                <summary className="faq-q">Apakah bisa update sendiri setelah jadi?</summary>
                <div className="faq-a">Paket Pro dan Custom dilengkapi CMS. Paket Basic landing page biasanya update via permintaan kecil.</div>
              </details>
            </div>
          </SectionReveal>
        </div>
      </section>
    </PageTransition>
  );
}
