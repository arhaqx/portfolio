export interface KnowledgeChunk {
  id: string;
  title: string;
  category: "profile" | "experience" | "education" | "projects" | "skills" | "contact" | "organization";
  url?: string;
  keywords: string[];
  content: string;
}

export const KNOWLEDGE_BASE: KnowledgeChunk[] = [
  {
    id: "profile_summary",
    title: "Profil & Biodata Lengkap Muhammad Arinal Haq",
    category: "profile",
    url: "/about",
    keywords: [
      "nama", "profil", "biodata", "siapa", "arinal", "haq", "arhaq", "about", 
      "lokasi", "domisili", "semarang", "role", "ipk", "kuliah", "ambisi", "filosofi"
    ],
    content: `Profil Resmi Muhammad Arinal Haq:
- Nama Lengkap: Muhammad Arinal Haq (biasa dipanggil Arinal, username github: arhaqx).
- Lokasi & Domisili: Semarang, Jawa Tengah, Indonesia.
- Kontak Langsung: WhatsApp 082141658305 (+62 821-4165-8305) | Email: arxhaq@gmail.com.
- Profil LinkedIn: https://linkedin.com/in/muhammad-arinal-2451a63a5 | GitHub: https://github.com/arhaqx | Website Resmi: https://arhaq.dev.
- Latar Belakang: Lulusan S1 Teknik Informatika dari Universitas Dian Nuswantoro (UDINUS) Semarang (angkatan 2021-2026, IPK 3.2) serta alumni resmi Dicoding Fullstack Web Developer Bootcamp.
- Dedikasi & Ambisi: Berdedikasi tinggi membangun aplikasi web modern yang responsif, berkinerja tinggi, dan berskala besar (scalable), serta mengeksplorasi sistem Autonomous AI Agents dan infrastruktur cloud modern (Microsoft Azure, Vercel).
- Pengalaman Inti: Membawa pengalaman magang selama 6 bulan di Diskominfo Kota Semarang dalam optimasi portal web sekolah, rekam jejak kolaborasi tim solid (seperti proyek akhir "HealSpace"), serta pengalaman kepemimpinan organisasi selama 3+ tahun.`
  },
  {
    id: "work_experience_diskominfo",
    title: "Pengalaman Kerja Magang: Diskominfo Kota Semarang",
    category: "experience",
    url: "/about",
    keywords: [
      "pengalaman", "kerja", "magang", "internship", "diskominfo", "kota semarang", 
      "sekolah", "portal web", "bug fixing", "optimasi", "laravel", "php"
    ],
    content: `Pengalaman Magang di Dinas Komunikasi, Informatika, Statistik dan Persandian (Diskominfo) Kota Semarang:
- Posisi: Full Stack Web Developer Intern
- Periode: Maret 2024 – Oktober 2024 (6 Bulan Penuh)
- Tanggung Jawab & Kontribusi:
  1. Mengembangkan fitur-fitur baru serta melakukan pemeliharaan sistem (maintenance) secara rutin pada berbagai portal web sekolah negeri dan kedinasan di lingkup Kota Semarang.
  2. Melakukan bug fixing intensif pada antarmuka dan backend berbasis PHP/Laravel.
  3. Melakukan optimasi performa website dan perbaikan integrasi basis data guna menjamin kelancaran operasional layanan publik dan akses informasi bagi masyarakat dan pihak sekolah.
  4. Bekerja sama erat dengan tim teknis Diskominfo dalam mematuhi standar keamanan informasi dan kelayakan portal pemerintahan.`
  },
  {
    id: "work_experience_hermes",
    title: "Pengalaman & Proyek AI: Hermes Autonomous Agent on Azure Cloud",
    category: "experience",
    url: "/projects/hermes-autonomous-agent-azure",
    keywords: [
      "hermes", "ai agent", "cloud", "azure", "vm", "9router", "proxy", "token", 
      "prompt caching", "telegram", "cronjob", "automation", "engineer"
    ],
    content: `Pengalaman AI Systems & Cloud Automation: Proyek Hermes Autonomous Agent:
- Posisi: AI Systems & Cloud Engineer (Independent Project)
- Periode: 2026 – Sekarang
- Deskripsi & Arsitektur:
  1. Merancang dan mendeploy asisten AI otonom pribadi 24/7 di atas infrastruktur cloud Microsoft Azure Virtual Machine (Ubuntu 24.04 LTS, tipe B2ats v2).
  2. Sistem terintegrasi dengan Telegram Bot Client multi-topic (termasuk topik khusus remote development dan pemantauan website arhaq.dev).
  3. Mengimplementasikan AI Gateway menggunakan 9Router Proxy dengan mekanisme smart caching dan model failover (Gemini 3.8 Flash, OpenCode, MiMo).
  4. Berhasil memangkas biaya komputasi hingga menghemat 85% token (setara 2.46 juta token) melalui teknik prompt caching agresif.
  5. Menjalankan cronjob scheduler otomatis untuk pemantauan server dan agregasi data berkala.`
  },
  {
    id: "project_healspace",
    title: "Proyek Akhir Dicoding: HealSpace (Platform Self-Check Kesehatan Mental)",
    category: "projects",
    url: "/projects/healspace-self-check-platform",
    keywords: [
      "healspace", "mental health", "kesehatan mental", "dicoding", "proyek akhir", 
      "capstone", "react", "django", "dass-21", "skrining", "konseling", "psikolog"
    ],
    content: `Proyek HealSpace (Platform Self-Check Kesehatan Mental):
- Website Aktif: https://healspace.my.id
- Peran Arinal: Full Stack Web Developer (Kolaborasi Tim Proyek Akhir Dicoding Bootcamp)
- Periode: April 2026 – Mei 2026
- Gambaran Proyek: Platform web kesehatan mental komprehensif yang dirancang untuk membantu masyarakat melakukan skrining awal mandiri dan mendapatkan akses konseling yang aman dan terpercaya.
- Arsitektur & Teknologi:
  - Frontend: React (Vite), TailwindCSS, responsive state management.
  - Backend: Django REST Framework (Python), PostgreSQL, autentikasi aman JWT.
- Fitur Utama:
  1. Skrining Mandiri Berstandar (Tes DASS-21) untuk mendeteksi tingkat stres, kecemasan, dan depresi dengan kalkulasi skor otomatis.
  2. Tombol Bantuan Darurat (Emergency Help Button) yang menghubungkan pengguna secara langsung ke hotline krisis 119 dan layanan darurat WhatsApp.
  3. Sistem Pemesanan Janji Temu Konseling dengan psikolog dan dashboard catatan konseling terenkripsi.
- Prioritas Pengembangan: Optimalisasi arsitektur kode guna memastikan skalabilitas tinggi dan waktu respon API yang cepat.`
  },
  {
    id: "project_parkir_worthfind",
    title: "Proyek Sistem Informasi Lahan Parkir PT Worthfind Travel Goods Jepara",
    category: "projects",
    url: "/projects/sistem-informasi-parkir-pt-worthfind",
    keywords: [
      "parkir", "worthfind", "jepara", "lahan parkir", "kendaraan", "karyawan", 
      "nextjs", "django", "pos", "barcode", "kapasitas"
    ],
    content: `Proyek Sistem Informasi Lahan Parkir PT Worthfind Travel Goods Jepara:
- Peran Arinal: Full Stack Web Developer
- Periode: Juli 2026 – Agustus 2026
- Gambaran Proyek: Sistem informasi internal berbasis web untuk mendigitalisasi pencatatan, monitoring, dan manajemen data volume kendaraan parkir karyawan di lingkungan industri pabrik PT Worthfind secara efisien.
- Fitur Utama:
  1. Pencatatan keluar-masuk kendaraan secara real-time dengan barcode scanner plat nomor karyawan.
  2. Monitoring kapasitas lahan parkir secara live guna menghindari kelebihan muatan.
  3. Dashboard pelaporan rekapitulasi volume kendaraan harian dan bulanan untuk audit keamanan pabrik.
- Tech Stack: Next.js (App Router), Django REST Framework, PostgreSQL, TailwindCSS.`
  },
  {
    id: "project_vinty_coffee",
    title: "Proyek Landing Page & Menu Digital Vinty Coffee & Space Jepara",
    category: "projects",
    url: "/projects",
    keywords: [
      "vinty", "coffee", "kafe", "jepara", "landing page", "menu digital", "frontend", "katalog"
    ],
    content: `Proyek Web Vinty Coffee & Space Jepara:
- Peran Arinal: Frontend Web Developer
- Periode: Februari 2026
- Gambaran Proyek: Merancang dan mengembangkan antarmuka website landing page yang responsif dan modern untuk Vinty Coffee & Space di Jepara.
- Fitur Utama:
  1. Tampilan profil bisnis dan suasana kafe yang interaktif dan estetik.
  2. Katalog menu makanan dan minuman digital yang memudahkan pengunjung melihat daftar menu langsung dari smartphone.
  3. Optimasi SEO lokal dan integrasi peta lokasi kafe guna meningkatkan presensi online dan kunjungan pelanggan.`
  },
  {
    id: "project_poliklinik_udinus",
    title: "Proyek Sistem Informasi Poliklinik Kampus UDINUS",
    category: "projects",
    url: "/projects/poliklinik-kampus-udinus",
    keywords: [
      "poliklinik", "udinus", "bimbingan karir", "kesehatan", "antrean", "rekam medis", 
      "laravel", "php", "bootstrap", "dokter", "mahasiswa"
    ],
    content: `Proyek Sistem Informasi Poliklinik Kampus UDINUS (Bimbingan Karir UDINUS):
- Peran Arinal: Full Stack Web Developer & UI/UX Designer
- Periode: Februari 2024
- Gambaran Proyek: Mendigitalisasi alur pelayanan kesehatan pada klinik kampus Universitas Dian Nuswantoro untuk memudahkan akses informasi bagi ribuan mahasiswa dan staf.
- Fitur Utama:
  1. Perancangan UI/UX yang ramah pengguna dan pengembangan frontend responsif.
  2. Pendaftaran antrean poliklinik secara online untuk mengurangi penumpukan fisik di ruang tunggu klinik.
  3. Manajemen jadwal praktek dokter dan pencatatan rekam medis digital sederhana.
- Tech Stack: Laravel (PHP), MySQL, Blade Templating, Bootstrap, arsitektur MVC.`
  },
  {
    id: "education_and_certifications",
    title: "Pendidikan, Bootcamp, & Sertifikasi Resmi",
    category: "education",
    url: "/learning",
    keywords: [
      "pendidikan", "kuliah", "kampus", "udinus", "ipk", "skripsi", "dicoding", 
      "dbs", "aws", "sertifikat", "lsp", "kompetensi", "bootcamp"
    ],
    content: `Riwayat Pendidikan & Sertifikasi Resmi Muhammad Arinal Haq:
1. Universitas Dian Nuswantoro (UDINUS) Semarang (2021 – 2026):
   - Gelar: Sarjana Komputer (S1 Teknik Informatika)
   - IPK: 3.2 / 4.0
   - Fokus: Rekayasa perangkat lunak, sistem basis data relasional, dan implementasi kecerdasan buatan.
2. Dicoding Fullstack Web Developer Bootcamp (2026):
   - Sertifikat: Dicoding Fullstack Web Developer (Dicoding Academy) — 2026
   - Kompetensi: Penguasaan komprehensif arsitektur front-end (React) dan back-end (Node.js/Django), RESTful API, dan web security.
3. Sertifikat Kompetensi LSP (Lembaga Sertifikasi Profesi) (2024):
   - Penerbit: LSP Nasional Indonesia — 2024
   - Membuktikan kompetensi standar industri di bidang rekayasa perangkat lunak dan pemrograman web.
4. DBS Foundation Coding Camp 2026 (Alumni Track):
   - Status: Selesai 100% lebih awal (1 bulan sebelum tenggat waktu resmi). Berpeluang besar lolos ke tahap inkubasi lanjutan berkat rekam jejak lulusan Dicoding dan penyelesaian kelas kilat.
5. AWS AI Academy 2026:
   - Status: Sedang berjalan aktif, mendalami arsitektur komputasi awan AWS, machine learning pipeline, dan enterprise generative AI.`
  },
  {
    id: "organization_and_leadership",
    title: "Pengalaman Organisasi & Kepemimpinan (3+ Tahun)",
    category: "organization",
    url: "/about",
    keywords: [
      "organisasi", "kepemimpinan", "leadership", "hmti", "himpunan", "litbang", 
      "semnasti", "ukm musik", "creative director", "soft skills", "teamwork"
    ],
    content: `Pengalaman Organisasi & Rekam Jejak Kepemimpinan 3+ Tahun:
1. Himpunan Mahasiswa Teknik Informatika (HMTI UDINUS):
   - Posisi: Pengurus Litbang (Penelitian & Pengembangan) (Agustus 2023 – Desember 2023, 5 Bulan)
   - Kontribusi:
     * Mengelola survei dan kuesioner aspirasi mahasiswa untuk mengevaluasi efektivitas program kerja himpunan.
     * Menganalisis data survei sebagai dasar rekomendasi perbaikan kegiatan kemahasiswaan.
     * Terlibat aktif dalam kepanitiaan event besar SEMNASTI (Seminar Nasional Teknologi Informasi) UDINUS.
2. UKM Musik Universitas Dian Nuswantoro:
   - Posisi: Creative Director / Ketua Tim Kreatif (Oktober 2022 – Juli 2023, 10 Bulan)
   - Kontribusi:
     * Merancang konsep besar (*big idea*) untuk seluruh aspek pencitraan visual, publikasi, tata panggung, dan arah musikal khas pertunjukan UKM Musik.
     * Memimpin, mengarahkan, dan membimbing anggota divisi kreatif dalam eksekusi acara musik kampus.
3. Dampak Pengembangan Diri:
   Pengalaman organisasi ini mengasah kemampuan komunikasi antar divisi, kerja sama tim lintas disiplin, pemecahan masalah (problem solving), manajemen waktu, dan kepemimpinan adaptif dalam situasi bertekanan tinggi.`
  },
  {
    id: "technical_and_soft_skills",
    title: "Keahlian Teknis (Hard Skills) & Soft Skills",
    category: "skills",
    url: "/about",
    keywords: [
      "hard skill", "soft skill", "keahlian", "teknologi", "stack", "bahasa", 
      "react", "nextjs", "laravel", "python", "typescript", "azure", "docker", "problem solving"
    ],
    content: `Daftar Lengkap Keahlian Muhammad Arinal Haq:
1. Hard Skills (Teknis):
   - Bahasa Pemrograman: TypeScript, JavaScript (ES6+), Python, PHP.
   - Front-End Frameworks: React 19, Next.js 16 (App Router, Server Components, SSR/SSG), Blade.
   - Styling & UI: Once UI Design System, SCSS Modules, CSS Variables, TailwindCSS, Bootstrap.
   - Back-End Frameworks: Node.js, Express.js, Django, Django REST Framework, Laravel.
   - Basis Data (Databases): PostgreSQL, MySQL.
   - Cloud & DevOps: Microsoft Azure (VMs, Networking, NSG, SSH Tunneling), Vercel, Linux System Administration (Ubuntu 24.04 LTS, Bash, Cronjobs, Systemd).
   - AI & Generative Tech: Autonomous AI Agents (Tool calling, memory management), Semantic RAG Architecture, AI Gateways (9Router Proxy, prompt caching), Google Gemini API, OpenAI API.
2. Soft Skills:
   - Problem Solving & Debugging Berpikir Kritis
   - Teamwork & Kolaborasi Lintas Fungsi
   - Komunikasi Efektif & Presentasi Teknis
   - Kemauan Belajar Sangat Tinggi (Fast Learner terbukti lewat DBS Camp & AWS Academy)
   - Manajemen Waktu & Prioritas Proyek
   - Kepemimpinan & Manajemen Tim Kreatif.`
  },
  {
    id: "faq_career_and_hiring",
    title: "Status Ketersediaan Karir, Preferensi Kerja, & FAQ Rekrutmen",
    category: "contact",
    url: "/about",
    keywords: [
      "rekrut", "hire", "kerja", "karir", "status", "lowongan", "full-time", 
      "freelance", "kontrak", "remote", "hybrid", "onsite", "gaji", "interview"
    ],
    content: `Informasi Ketersediaan & FAQ Rekrutmen Muhammad Arinal Haq:
- Ketersediaan Peran: Terbuka untuk tawaran posisi:
  1. Full Stack Web Developer (React/Next.js + Node.js/Django/Laravel)
  2. Frontend Developer (React, Next.js, TypeScript, TailwindCSS)
  3. Backend Developer (Python Django, Node.js, PHP Laravel, PostgreSQL/MySQL)
  4. AI Systems / Cloud Engineer (AI Agent development, LLM integration, Cloud VM orchestration)
- Jenis Pekerjaan: Terbuka untuk Full-Time, Kontrak, Project-based, maupun Freelance.
- Lokasi Kerja: Terbuka untuk Remote (seluruh dunia/Indonesia), Hybrid, atau On-site di wilayah Semarang dan kota-kota besar lainnya.
- Keunggulan Utama Arinal:
  * Pengalaman nyata 6 bulan di instansi pemerintahan (Diskominfo).
  * Lulusan resmi bootcamp bergengsi (Dicoding) dan universitas terakreditasi (UDINUS).
  * Terbiasa bekerja dengan teknologi modern terkini (Next.js 16, React 19, Azure, AI Agentic RAG).
  * Memiliki soft skills kepemimpinan dan komunikasi yang terbukti dari rekam jejak organisasi 3+ tahun.
- Kontak Cepat:
  * WhatsApp: +62 821-4165-8305 (https://wa.me/6282141658305)
  * Email: arxhaq@gmail.com
  * LinkedIn: https://linkedin.com/in/muhammad-arinal-2451a63a5`
  }
];
