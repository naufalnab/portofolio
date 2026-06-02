import { PageTransition } from '../components/layout/PageTransition';
import { SectionReveal } from '../components/ui/SectionReveal';
import { TextReveal } from '../components/ui/TextReveal';
import { GlassCard } from '../components/ui/GlassCard';
import { TiltCard } from '../components/ui/TiltCard';
import { StaggerList, StaggerItem } from '../components/ui/StaggerList';
import { MagneticButton } from '../components/ui/MagneticButton';
import './LayananKhusus.css';

export function LayananVideoAI() {
  return (
    <PageTransition title="Jasa Pembuatan Video AI — Naufal Nabila">
      {/* HEADER SECTION */}
      <section className="page-header service-header">
        <div className="container">
          <SectionReveal direction="up" className="service-header-content">
            <span className="section-eyebrow">Layanan Khusus</span>
            <h1 className="page-title">
              <TextReveal text="Produksi Konten Tanpa Batas dengan AI." />
            </h1>
            <p className="page-subtitle">
              Sistem produksi video bertenaga AI yang otomatis. Hasilkan ribuan konten edukasi, pemasaran, atau hiburan dalam berbagai bahasa tanpa perlu sewa studio atau talent.
            </p>
            <div className="service-cta">
              <MagneticButton href="https://wa.me/6282328591004" primary={true}>Lihat Demo</MagneticButton>
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
                <span className="why-icon">🌍</span>
                <h3>Multi-Bahasa Otomatis</h3>
                <p>Terjemahkan dan dubbing video Anda ke bahasa Inggris, Arab, Mandarin, atau bahasa lainnya secara otomatis dengan suara AI yang natural.</p>
              </TiltCard>
            </SectionReveal>

            <SectionReveal direction="up" delay={0.2}>
              <TiltCard className="why-card">
                <span className="why-icon">⚡</span>
                <h3>Skala Produksi Massal</h3>
                <p>Berhenti membuat video satu per satu. Dengan pipeline AI, Anda bisa memproduksi puluhan video per hari berdasarkan teks atau artikel.</p>
              </TiltCard>
            </SectionReveal>

            <SectionReveal direction="up" delay={0.3}>
              <TiltCard className="why-card">
                <span className="why-icon">💰</span>
                <h3>Potong Biaya Studio</h3>
                <p>Tidak perlu menyewa kamera, lighting, atau talent. Avatar AI kami dapat berbicara dengan ekspresi natural kapan saja Anda butuhkan.</p>
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
                  <h3>Starter Video AI</h3>
                  <div className="price">Rp 3.500.000</div>
                  <p className="pricing-desc">Cocok untuk mencoba konten AI di media sosial.</p>
                </div>
                <ul className="pricing-features">
                  <li>Pembuatan 10 Video Pendek (Shorts/Reels/TikTok)</li>
                  <li>Script Generation dengan AI</li>
                  <li>Avatar AI Standar (Bukan Custom)</li>
                  <li>Suara AI Natural (Bahasa Indonesia)</li>
                  <li>Revisi Minor 1x per Video</li>
                </ul>
                <MagneticButton className="w-full" href="https://wa.me/6282328591004?text=Halo%20Naufal,%20saya%20tertarik%20dengan%20paket%20Starter%20Video%20AI">
                  Pilih Starter
                </MagneticButton>
              </GlassCard>
            </StaggerItem>

            <StaggerItem>
              <GlassCard className="pricing-card featured pulse-border">
                <div className="pricing-badge">Populer</div>
                <div className="pricing-header">
                  <h3>Edu / Marketing Scale</h3>
                  <div className="price">Rp 12.000.000</div>
                  <p className="pricing-desc">Paket lengkap untuk kreator edukasi atau brand yang butuh skala.</p>
                </div>
                <ul className="pricing-features">
                  <li>Pembuatan 50 Video Pendek atau 15 Video Panjang</li>
                  <li>Full Pipeline (Script &rarr; Video)</li>
                  <li>Kloning Suara Pribadi (Optional)</li>
                  <li>Opsi Multi-Bahasa (ID + 1 Bahasa Asing)</li>
                  <li>Caption Dinamis Otomatis</li>
                </ul>
                <MagneticButton primary={true} className="w-full" href="https://wa.me/6282328591004?text=Halo%20Naufal,%20saya%20tertarik%20dengan%20paket%20Edu%20Scale%20Video%20AI">
                  Pilih Edu Scale
                </MagneticButton>
              </GlassCard>
            </StaggerItem>

            <StaggerItem>
              <GlassCard className="pricing-card">
                <div className="pricing-header">
                  <h3>Enterprise Pipeline Setup</h3>
                  <div className="price">Mulai Rp 35Jt</div>
                  <p className="pricing-desc">Membangun in-house AI video generator untuk tim Anda.</p>
                </div>
                <ul className="pricing-features">
                  <li>Setup Infrastruktur (n8n, API, dll.)</li>
                  <li>Sistem Input Teks/Artikel &rarr; Output Video</li>
                  <li>Custom Avatar Studio Setup</li>
                  <li>Otomatisasi Publikasi (YouTube/TikTok)</li>
                  <li>Pelatihan Tim (Handover)</li>
                </ul>
                <MagneticButton className="w-full" href="https://wa.me/6282328591004?text=Halo%20Naufal,%20saya%20ingin%20konsultasi%20Enterprise%20Video%20AI%20Pipeline">
                  Konsultasi Enterprise
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
                <summary className="faq-q">Apakah suara AI terdengar seperti robot?</summary>
                <div className="faq-a">Tidak. Kami menggunakan model TTS (Text-to-Speech) generasi terbaru (seperti ElevenLabs atau OpenAI) yang menangkap intonasi, pernapasan, dan emosi manusia dengan sangat realistis.</div>
              </details>
              <details className="faq-item">
                <summary className="faq-q">Apakah saya bisa membuat AI avatar menggunakan wajah saya sendiri?</summary>
                <div className="faq-a">Ya! Untuk paket Enterprise atau dengan biaya tambahan di paket Edu Scale, kami dapat melakukan training model untuk mengkloning wajah dan suara Anda, sehingga AI Anda yang bekerja membuat konten.</div>
              </details>
              <details className="faq-item">
                <summary className="faq-q">Apakah video AI aman dari copyright YouTube?</summary>
                <div className="faq-a">Ya. Semua aset yang dihasilkan oleh AI (suara, visual) bebas dari klaim hak cipta standar, dan script yang dibuat dipastikan orisinal.</div>
              </details>
              <details className="faq-item">
                <summary className="faq-q">Apakah ada batasan panjang video?</summary>
                <div className="faq-a">Paket Starter maksimal 60 detik per video. Paket Edu Scale bisa digunakan untuk video durasi panjang (hingga 10-15 menit per video).</div>
              </details>
            </div>
          </SectionReveal>
        </div>
      </section>
    </PageTransition>
  );
}
