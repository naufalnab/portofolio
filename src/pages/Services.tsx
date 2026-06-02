import { PageTransition } from '../components/layout/PageTransition';
import { SectionReveal } from '../components/ui/SectionReveal';
import { TextReveal } from '../components/ui/TextReveal';
import { TiltCard } from '../components/ui/TiltCard';
import { StaggerList, StaggerItem } from '../components/ui/StaggerList';
import './Services.css';

export function Services() {
  return (
    <PageTransition title="Layanan — Naufal Nabila">
      {/* HEADER SECTION */}
      <section className="page-header">
        <div className="container">
          <SectionReveal direction="up">
            <h1 className="page-title">
              <TextReveal text="Sistem yang Dibangun untuk Bekerja Sebagaimana Tim Anda Bekerja." />
            </h1>
            <p className="page-subtitle">
              Sistem perangkat lunak yang hebat tidak terasa seperti perangkat lunak. Sistem itu terasa seperti perpanjangan dari otak tim Anda. Inilah bagaimana saya membangunnya.
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
                <li>Temukan tugas berulang dan hambatan manual</li>
                <li>Kenali data yang berserakan dan pekerjaan ganda</li>
                <li>Dengarkan tim yang menjalani workflow itu</li>
                <li>Identifikasi apa yang sebenarnya menghambat pertumbuhan</li>
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
                <li>Ubah proses menjadi peran dan workflow</li>
                <li>Rancang model data dan integrasinya</li>
                <li>Putuskan apa yang diotomasi dan apa yang tetap ditangani manusia</li>
                <li>Rencanakan untuk skala, kasus tepi, dan serah terima</li>
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
              <h3>Jadikan Operasional</h3>
              <ul>
                <li>Luncurkan dashboard, portal, dan panel admin</li>
                <li>Sambungkan asisten AI dan laporan otomatis</li>
                <li>Latih tim dan dokumentasikan sistemnya</li>
                <li>Iterasi berdasarkan apa yang benar-benar mereka pakai</li>
              </ul>
              <div className="process-deliverables">
                <div className="process-deliverables-label">Hasil</div>
                <div className="process-deliverables-tags">
                  <span>Dokumentasi</span>
                  <span>Serah terima</span>
                  <span>Iterasi</span>
                  <span>Pelatihan tim</span>
                </div>
              </div>
            </StaggerItem>

          </StaggerList>
        </div>
      </section>
    </PageTransition>
  );
}
