import { PageTransition } from '../components/layout/PageTransition';
import { SectionReveal } from '../components/ui/SectionReveal';
import { TextReveal } from '../components/ui/TextReveal';
import { TiltCard } from '../components/ui/TiltCard';
import { StaggerList, StaggerItem } from '../components/ui/StaggerList';
import { MagneticButton } from '../components/ui/MagneticButton';
import './Services.css';

export function Services() {
  return (
    <PageTransition title="Layanan — Naufal Nabila">
      {/* HEADER SECTION */}
      <section className="page-header">
        <div className="container">
          <SectionReveal direction="up">
            <h1 className="page-title">
              <TextReveal text="Sistem yang Saya Bangun untuk Merapikan Operasional Bisnis Anda." />
            </h1>
            <p className="page-subtitle">
              Dari dashboard, ERP ringan, sampai workflow AI — dibangun sesuai cara tim Anda bekerja. Tidak ada software yang terasa kaku, hanya sistem yang langsung bisa dipakai.
            </p>
          </SectionReveal>
        </div>
      </section>

      {/* SERVICES LIST */}
      <section className="services-list" id="services">
        <div className="container">
          <div className="services-grid">

            <TiltCard className="service-card" maxRotation={5}>
              <span className="service-icon">🤖</span>
              <h3>Otomasi Alur Kerja AI</h3>
              <p className="service-pain">
                Tim Anda membuang 15 jam seminggu untuk memindahkan data, merangkum dokumen, atau meneruskan pesan ke platform yang berbeda.
              </p>
              <p className="service-target">
                Saya membangun agent AI (n8n, Make, Vertex AI) yang duduk di latar belakang — merangkum panggilan, menyortir tiket, atau mengisi database Anda tanpa campur tangan manusia.
              </p>
              <div className="service-stack">n8n · Vertex AI · Webhooks · OpenAI API</div>
            </TiltCard>

            <TiltCard className="service-card" maxRotation={5}>
              <span className="service-icon">📊</span>
              <h3>Sistem Manajemen Operasional & ERP</h3>
              <p className="service-pain">
                Toko atau perusahaan Anda melacak inventaris, penjualan, dan akuntansi di 5 spreadsheet dan aplikasi yang berbeda. Tidak ada yang tahu laporan mana yang terbaru.
              </p>
              <p className="service-target">
                Saya menerapkan dan mengkustomisasi Odoo ERP. Bukan instalasi default pabrik yang terasa kaku, tetapi sistem yang dibentuk secara persis sesuai dengan alur unik bisnis Anda.
              </p>
              <div className="service-stack">Odoo · PostgreSQL · Python · Custom Modules</div>
            </TiltCard>

            <TiltCard className="service-card" maxRotation={5}>
              <span className="service-icon">📱</span>
              <h3>Aplikasi Mobile untuk Tenaga Lapangan</h3>
              <p className="service-pain">
                Pekerja lapangan atau teknisi Anda menggunakan kertas atau WhatsApp untuk mencatat pekerjaan, yang berarti admin harus mengetik ulang semuanya nanti.
              </p>
              <p className="service-target">
                Saya membangun aplikasi Flutter (iOS & Android) yang berfungsi offline, disinkronkan saat ada sinyal, dan sangat mudah digunakan bahkan bagi pekerja non-teknis.
              </p>
              <div className="service-stack">Flutter · Firebase · Offline-first Sync</div>
            </TiltCard>

            <TiltCard className="service-card" maxRotation={5}>
              <span className="service-icon">💻</span>
              <h3>Portal Klien & Dashboard Khusus</h3>
              <p className="service-pain">
                Klien selalu bertanya "Bagaimana status proyek saya?" karena prosesnya ada di kepala Anda, bukan di dalam sistem.
              </p>
              <p className="service-target">
                Saya membangun portal klien khusus yang disinkronkan dengan data backend Anda, sehingga klien Anda selalu tahu apa yang terjadi tanpa Anda harus mengirim email.
              </p>
              <div className="service-stack">React · Vite · Tailwind · Supabase</div>
            </TiltCard>

            <TiltCard className="service-card" maxRotation={5}>
              <span className="service-icon">🏢</span>
              <h3>Internal Tools & SOP Management</h3>
              <p className="service-pain">
                Tim Anda mengandalkan Anda untuk setiap keputusan karena prosesnya ada di kepala Anda, bukan di dalam sistem.
              </p>
              <p className="service-target">
                Saya mendokumentasikan workflow, membangun internal tools, dan mengubah pengetahuan yang tersimpan di kepala menjadi sesuatu yang bisa dipakai tim tanpa bergantung pada Anda.
              </p>
              <div className="service-stack">Internal tools · Admin panel · SOP</div>
            </TiltCard>

            <TiltCard className="service-card" maxRotation={5}>
              <span className="service-icon">🎓</span>
              <h3>Platform Pembelajaran AI</h3>
              <p className="service-pain">
                Konten edukasi, progres siswa, dan penilaian Anda berserakan tanpa sistem yang terstruktur.
              </p>
              <p className="service-target">
                Saya membangun learning platform dengan sertifikat, pelacakan, dan konten berbantuan AI — bukan sekadar LMS generik.
              </p>
              <div className="service-stack">SvelteKit · AI Pipelines · Drizzle</div>
            </TiltCard>

          </div>
        </div>
      </section>

      {/* PROCESS */}
      <section className="process" id="process">
        <div className="container">
          <SectionReveal direction="up">
            <span className="section-eyebrow">Cara Saya Bekerja</span>
            <h2 className="section-title">Dari operasi berantakan ke sistem terstruktur.</h2>
            <p className="process-intro">Saya tidak mulai dari kode. Saya mulai dengan memetakan kekacauannya.</p>
          </SectionReveal>

          <StaggerList className="process-grid" once={true}>

            <StaggerItem className="process-step problem">
              <span className="process-step-num">01</span>
              <span className="process-step-icon">🗺️</span>
              <h3>Diagnosis Kekacauan</h3>
              <ul>
                <li>Audit alur kerja dari chat, spreadsheet, form, dan dokumen</li>
                <li>Petakan pekerjaan manual yang paling membuang waktu</li>
                <li>Temukan titik macet: approval, follow-up, input data, laporan</li>
                <li>Tentukan bagian mana yang perlu sistem, otomasi, atau SOP</li>
              </ul>
              <div className="process-deliverables">
                <div className="process-deliverables-label">Hasil</div>
                <div className="process-deliverables-tags">
                  <span>Peta workflow</span>
                  <span>Daftar hambatan</span>
                  <span>Peluang otomasi</span>
                </div>
              </div>
            </StaggerItem>

            <StaggerItem className="process-step">
              <span className="process-step-num">02</span>
              <span className="process-step-icon">📐</span>
              <h3>Bangun Sistemnya</h3>
              <ul>
                <li>Rancang database, role pengguna, status pekerjaan, dan alur approval</li>
                <li>Bangun dashboard, form, portal, atau modul ERP sesuai prioritas</li>
                <li>Sambungkan dengan WhatsApp, email, payment, spreadsheet, atau AI bila perlu</li>
                <li>Uji dengan kasus nyata dari operasional harian</li>
              </ul>
              <div className="process-deliverables">
                <div className="process-deliverables-label">Hasil</div>
                <div className="process-deliverables-tags">
                  <span>Dashboard</span>
                  <span>Workflow AI</span>
                  <span>Internal tool</span>
                  <span>Panel admin</span>
                </div>
              </div>
            </StaggerItem>

            <StaggerItem className="process-step">
              <span className="process-step-num">03</span>
              <span className="process-step-icon">🚀</span>
              <h3>Buat Sistemnya Benar-benar Dipakai</h3>
              <ul>
                <li>Luncurkan sistem ke tim secara bertahap</li>
                <li>Latih pengguna dan buat dokumentasi singkat</li>
                <li>Pantau penggunaan nyata selama masa awal</li>
                <li>Iterasi berdasarkan kebiasaan tim, bukan asumsi</li>
              </ul>
              <div className="process-deliverables">
                <div className="process-deliverables-label">Hasil</div>
                <div className="process-deliverables-tags">
                  <span>Dokumentasi</span>
                  <span>Serah terima</span>
                  <span>Pelatihan tim</span>
                  <span>Iterasi</span>
                </div>
              </div>
            </StaggerItem>

          </StaggerList>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="services-cta">
        <div className="container">
          <SectionReveal direction="up" className="cta-box">
            <h2>Siap Merapikan Operasional Anda?</h2>
            <p>Mulai dari audit workflow gratis atau konsultasi sistem langsung. Tidak ada komitmen, hanya diskusi tentang kebutuhan bisnis Anda.</p>
            <MagneticButton href="mailto:hello@naufalnabila.my.id" primary={true}>
              Mulai Konsultasi
            </MagneticButton>
          </SectionReveal>
        </div>
      </section>
    </PageTransition>
  );
}
