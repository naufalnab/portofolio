import { PageTransition } from '../components/layout/PageTransition';
import { SectionReveal } from '../components/ui/SectionReveal';
import { TextReveal } from '../components/ui/TextReveal';
import { GlassCard } from '../components/ui/GlassCard';
import { StaggerList, StaggerItem } from '../components/ui/StaggerList';
import { MagneticButton } from '../components/ui/MagneticButton';
import './LayananKhusus.css';

export function Packages() {
  return (
    <PageTransition title="Paket Layanan — Naufal Nabila">
      {/* HEADER SECTION */}
      <section className="page-header service-header">
        <div className="container">
          <SectionReveal direction="up" className="service-header-content">
            <span className="section-eyebrow">Paket Lengkap</span>
            <h1 className="page-title">
              <TextReveal text="Bundel Spesial untuk Akselerasi Digital Anda." />
            </h1>
            <p className="page-subtitle">
              Butuh solusi end-to-end tanpa repot mencari vendor terpisah? Saya telah menyusun paket bundel dari website hingga operasional AI untuk mendigitalisasi bisnis Anda secara menyeluruh.
            </p>
          </SectionReveal>
        </div>
      </section>

      {/* PRICING BUNDLES */}
      <section className="service-pricing" style={{ paddingTop: '2rem' }}>
        <div className="container">
          <StaggerList className="pricing-grid" once={true}>
            
            <StaggerItem>
              <GlassCard className="pricing-card">
                <div className="pricing-header">
                  <h3>Digital Presence Bundle</h3>
                  <div className="price">Rp 8.500.000</div>
                  <p className="pricing-desc">Fondasi digital yang kuat untuk bisnis Anda.</p>
                </div>
                <ul className="pricing-features">
                  <li>Website Profil Perusahaan Profesional (Paket Pro)</li>
                  <li>Setup Google My Business & SEO Lokal</li>
                  <li>10 Video AI Pendek untuk Aset Social Media Awal</li>
                  <li>Email Profesional Custom Domain (S/d 5 Akun)</li>
                </ul>
                <MagneticButton className="w-full" href="https://wa.me/6282328591004?text=Halo%20Naufal,%20saya%20tertarik%20dengan%20Digital%20Presence%20Bundle">
                  Pilih Bundle Ini
                </MagneticButton>
              </GlassCard>
            </StaggerItem>

            <StaggerItem>
              <GlassCard className="pricing-card featured pulse-border">
                <div className="pricing-badge">Rekomendasi</div>
                <div className="pricing-header">
                  <h3>EdTech / Course Creator Bundle</h3>
                  <div className="price">Rp 25.000.000</div>
                  <p className="pricing-desc">Solusi lengkap untuk menjual course online dan edukasi.</p>
                </div>
                <ul className="pricing-features">
                  <li>Sistem LMS Custom Berbasis Web App (SvelteKit)</li>
                  <li>Gateway Pembayaran Otomatis Terintegrasi</li>
                  <li>Pembuatan 30 Video Edukasi AI (Atau Dubbing Multi-bahasa)</li>
                  <li>Otomasi Email Marketing & Sertifikat Kelulusan AI</li>
                  <li>Support Infrastruktur 3 Bulan</li>
                </ul>
                <MagneticButton primary={true} className="w-full" href="https://wa.me/6282328591004?text=Halo%20Naufal,%20saya%20tertarik%20dengan%20EdTech%20Bundle">
                  Pilih EdTech Bundle
                </MagneticButton>
              </GlassCard>
            </StaggerItem>

            <StaggerItem>
              <GlassCard className="pricing-card">
                <div className="pricing-header">
                  <h3>Full Automation Enterprise</h3>
                  <div className="price">Custom</div>
                  <p className="pricing-desc">Transformasi digital radikal dari ERP hingga AI Workflow.</p>
                </div>
                <ul className="pricing-features">
                  <li>Implementasi ERP (Odoo) Kustom Seluruh Divisi</li>
                  <li>In-house AI Video Generator Pipeline</li>
                  <li>Customer Service AI Agent (WhatsApp/Web)</li>
                  <li>Dashboard Eksekutif Real-time Analytics</li>
                  <li>Dedicated Support & SLA Maintenance</li>
                </ul>
                <MagneticButton className="w-full" href="https://wa.me/6282328591004?text=Halo%20Naufal,%20mari%20diskusikan%20Full%20Automation%20Enterprise">
                  Konsultasi Sekarang
                </MagneticButton>
              </GlassCard>
            </StaggerItem>

          </StaggerList>
        </div>
      </section>
    </PageTransition>
  );
}
