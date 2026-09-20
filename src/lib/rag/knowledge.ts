export interface KnowledgeChunk {
  id: string;
  title: string;
  category: "profile" | "experience" | "education" | "projects" | "skills" | "contact" | "organization" | "interests";
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
      "lokasi", "domisili", "semarang", "role", "ipk", "kuliah", "ambisi", "filosofi",
      "fresh graduate", "mbti", "entj", "karakter", "kepribadian", "musisi"
    ],
    content: `Profil Resmi Muhammad Arinal Haq:
- Nama Lengkap: Muhammad Arinal Haq (biasa dipanggil Arinal, username github: arhaqx).
- Status Saat Ini: Fresh Graduate S1 Teknik Informatika UDINUS yang sedang aktif mencari pekerjaan (Open to Work).
- Target Karir Utama: Memprioritaskan posisi sebagai Full Stack Developer yang sesuai dengan minat dan keahlian mendalamnya.
- Lokasi & Domisili: Semarang, Jawa Tengah, Indonesia (Sangat bersedia bekerja On-site di Semarang, Jakarta, maupun kota lainnya, serta terbuka untuk opsi Remote/Hybrid).
- Kontak Resmi Utama: Email: arxhaq@gmail.com | WhatsApp: +62 821-4165-8305.
- Profil LinkedIn: https://linkedin.com/in/muhammad-arinal-2451a63a5 | GitHub: https://github.com/arhaqx | Website: https://arhaq.dev.
- Karakter Pribadi & MBTI: ENTJ (The Commander) — Tipe kepribadian yang visioner, berorientasi pada target (goal-oriented), terstruktur, logis, dan memiliki jiwa kepemimpinan alami.
- Filosofi & Etos Kerja: Arinal adalah tipe pembelajar yang belajar langsung dari lingkungan dan pengalaman nyata (experiential learner). Memiliki integritas tinggi: jika diberi kepercayaan dan tanggung jawab, Arinal akan bersungguh-sungguh memegang amanah dan menuntaskannya dengan standar terbaik.
- Sisi Kreatif: Selain berkecimpung di dunia software engineering, Arinal adalah seorang musisi (mahir piano & gitar), sound engineer, dan memiliki latar belakang desain grafis yang kuat.`
  },
  {
    id: "undergraduate_thesis",
    title: "Skripsi & Penelitian Akademik S1: Analisis Sentimen NLP IndoBERT & KNN",
    category: "education",
    url: "/learning",
    keywords: [
      "skripsi", "tugas akhir", "penelitian", "indobert", "knn", "k-nearest neighbour", 
      "analisis sentimen", "twitter", "media sosial", "x", "nlp", "machine learning", "ipk", "udinus"
    ],
    content: `Detail Skripsi & Riset Akademik S1 Muhammad Arinal Haq di UDINUS (IPK 3.2):
- Judul Skripsi: "Analisis Sentimen Media Sosial (X) Menggunakan IndoBERT Labeling dan Metode K-Nearest Neighbour"
- Bidang Kajian: Natural Language Processing (NLP), Machine Learning, Text Mining, dan Social Media Analytics.
- Ringkasan Teknis Riset:
  1. Mengatasi keterbatasan data berlabel pada bahasa Indonesia informal di media sosial X (Twitter) dengan memanfaatkan pre-trained model IndoBERT untuk automated pseudo-labeling.
  2. Mengekstraksi representasi fitur teks dan melakukan klasifikasi polaritas sentimen (positif, negatif, netral) menggunakan algoritma K-Nearest Neighbour (KNN).
  3. Membuktikan pemahaman komprehensif Arinal terhadap pipeline machine learning dari tahapan scraping, data cleaning/preprocessing teks bahasa Indonesia, feature engineering, hingga evaluasi akurasi model.`
  },
  {
    id: "faq_career_and_hiring",
    title: "Status Pencarian Kerja, Ketersediaan Karir, & Penempatan Kerja",
    category: "contact",
    url: "/about",
    keywords: [
      "rekrut", "hire", "kerja", "karir", "status", "lowongan", "full-time", 
      "fresh graduate", "internship", "magang", "on site", "onsite", "penempatan", 
      "full stack", "email", "kontak", "interview"
    ],
    content: `Informasi Ketersediaan Kerja & FAQ Rekrutmen Muhammad Arinal Haq:
- Status Karir: Fresh Graduate yang sedang aktif OPEN JOB / mencari pekerjaan.
- Posisi yang Dicari: Sangat memprioritaskan peran sebagai Full Stack Developer (React/Next.js di front-end dan Node.js/Python Django/PHP Laravel di back-end).
- Fleksibilitas Status Pekerjaan:
  * Prioritas Utama: Bekerja langsung sebagai Full-Time Developer atau Kontrak Kerja Profesional.
  * Fleksibilitas Tambahan: Karena berstatus fresh graduate, Arinal juga sangat fleksibel untuk program Internship berjenjang menuju full-time, namun prioritas terbesarnya tetap pekerjaan tetap/penuh waktu.
- Penempatan & Lokasi Kerja:
  * Sangat bersedia dan siap bekerja ON-SITE di lokasi kantor perusahaan (Semarang, Jabodetabek/Jakarta, Yogyakarta, Surabaya, maupun kota lainnya).
  * Juga sangat siap untuk model kerja Hybrid maupun Remote.
- Komitmen & Etos Kerja: "Saya adalah tipe orang yang belajar dari lingkungan dan pengalaman. Jika saya diberi tanggung jawab, saya akan bersungguh-sungguh untuk memegang amanah dan tanggung jawab tersebut."
- Cara Menghubungi:
  * Email Prioritas: arxhaq@gmail.com (sangat responsif untuk undangan interview / penawaran kerja)
  * WhatsApp: +62 821-4165-8305
  * LinkedIn: https://linkedin.com/in/muhammad-arinal-2451a63a5`
  },
  {
    id: "creative_and_music_talents",
    title: "Fakta Menarik: Musisi, Sound Engineering, & Desain Grafis",
    category: "interests",
    url: "/about",
    keywords: [
      "fakta menarik", "musisi", "musik", "piano", "gitar", "sound engineering", 
      "audio", "desain grafis", "design", "kreatif", "hobi", "seni", "alat musik"
    ],
    content: `Fakta Menarik & Keahlian Kreatif Muhammad Arinal Haq:
1. Musisi Berbakat & Multi-Instrumentalis:
   - Arinal adalah seorang musisi yang handal memainkan alat musik Piano dan Gitar.
   - Menguasai harmoni musik, progresi akor, dan aransemen lagu, yang membantunya memiliki sense estetika dan ritme kerja yang presisi.
2. Keahlian di Bidang Sound Engineering:
   - Memiliki pemahaman teknis dalam tata suara (sound engineering), audio routing, mixing, dan mastering baik untuk panggung pertunjukan langsung (live stage) maupun perekaman studio.
3. Desain Grafis & Creative Direction (Pengalaman 3 Tahun):
   - Memiliki keahlian desain grafis dan visual branding yang terasah selama 3 tahun berkiprah di Sie Kreatif UKM Musik UDINUS, di mana selama 2 tahunnya Arinal dipercaya memimpin langsung sebagai Koordinator / Creative Director.
   - Menguasai prinsip UI/UX, komposisi visual, pemilihan tipografi, tata panggung, serta media promosi digital yang membuat hasil coding webnya selalu memiliki estetika visual yang tinggi.`
  },
  {
    id: "organization_and_leadership",
    title: "Pengalaman Organisasi & Kepemimpinan (HMTI & UKM Musik 3+ Tahun)",
    category: "organization",
    url: "/about",
    keywords: [
      "organisasi", "kepemimpinan", "leadership", "hmti", "himpunan", "litbang", 
      "semnasti", "ukm musik", "creative director", "sie kreatif", "soft skills", "teamwork"
    ],
    content: `Pengalaman Organisasi & Rekam Jejak Kepemimpinan Arinal:
1. UKM Musik Universitas Dian Nuswantoro (UDINUS):
   - Pengalaman: 3 tahun aktif di Sie Kreatif, dengan 2 tahun di antaranya dipercaya memimpin langsung sebagai Koordinator / Creative Director (Oktober 2022 – Juli 2023).
   - Tanggung Jawab: Merancang konsep besar (*big idea*) visual branding, desain grafis promosi, tata panggung acara musik, arah musikalitas, serta memimpin dan membina anggota tim kreatif.
2. Himpunan Mahasiswa Teknik Informatika (HMTI UDINUS):
   - Posisi: Pengurus Divisi Litbang (Penelitian & Pengembangan) (Agustus 2023 – Desember 2023).
   - Tanggung Jawab: Mengelola kuesioner dan survei aspirasi mahasiswa untuk mengukur keberhasilan program kerja, menganalisis data, serta menjadi panitia aktif dalam Seminar Nasional Teknologi Informasi (SEMNASTI).
3. Karakter ENTJ & Soft Skills Teruji:
   - Pembelajar berbasis lingkungan dan pengalaman nyata.
   - Terbiasa memimpin tim, mengambil keputusan taktis, manajemen waktu yang ketat, dan memiliki integritas tinggi memegang amanah.`
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
  3. Melakukan optimasi performa website dan perbaikan integrasi basis data guna menjamin kelancaran operasional layanan publik.
  4. Bekerja sama erat dengan tim teknis Diskominfo dalam mematuhi standar keamanan informasi pemerintahan.`
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
  2. Terintegrasi dengan Telegram Bot Client multi-topic untuk remote development dan manajemen website arhaq.dev.
  3. Mengimplementasikan AI Gateway 9Router Proxy dengan smart prompt caching yang menghemat hingga 85% biaya token (~2.46 juta token).
  4. Menjalankan cronjob scheduler otomatis untuk pemantauan server dan agregasi data berkala.`
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
- Arsitektur: React (Vite) + TailwindCSS di front-end, Django REST Framework (Python) + PostgreSQL + JWT di back-end.
- Fitur Utama: Skrining klinis DASS-21 otomatis, Emergency Help Button terhubung ke hotline 119 & WhatsApp darurat, serta sistem booking janji temu psikolog/konselor.`
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
- Peran Arinal: Full Stack Web Developer (Juli 2026 – Agustus 2026)
- Gambaran: Digitalisasi sistem manajemen volume kendaraan parkir karyawan pabrik berbasis web.
- Fitur: Barcode scan plat nomor kendaraan, live monitoring slot kapasitas parkir, dan pelaporan rekapitulasi harian/bulanan.
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
- Peran Arinal: Frontend Web Developer (Februari 2026)
- Fitur: Desain antarmuka landing page responsif bernuansa estetik, katalog menu makanan/minuman digital interaktif, dan optimasi presensi online kafe.`
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
- Peran Arinal: Full Stack Web Developer & UI/UX Designer (Februari 2024)
- Fitur: Digitalisasi pendaftaran antrean periksa klinik kampus online, jadwal praktek dokter, dan rekam medis digital berbasis Laravel (PHP), MySQL, dan Bootstrap.`
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
   - Sarjana Komputer (S1 Teknik Informatika), IPK: 3.2 / 4.0
   - Skripsi: "Analisis Sentimen Media Sosial (X) Menggunakan IndoBERT Labeling dan Metode K-Nearest Neighbour"
2. Dicoding Fullstack Web Developer Bootcamp (2026): Sertifikat kelulusan resmi arsitektur front-end & back-end modern.
3. Sertifikat Kompetensi LSP (Lembaga Sertifikasi Profesi) (2024): Standar kompetensi industri rekayasa perangkat lunak.
4. DBS Foundation Coding Camp 2026 (Alumni Track): Selesai 100% lebih awal 1 bulan sebelum deadline.
5. AWS AI Academy 2026: Cloud architecture, machine learning, dan Generative AI.`
  },
  {
    id: "technical_and_soft_skills",
    title: "Keahlian Teknis (Hard Skills), Desain, & Soft Skills",
    category: "skills",
    url: "/about",
    keywords: [
      "hard skill", "soft skill", "keahlian", "teknologi", "stack", "bahasa", 
      "react", "nextjs", "laravel", "python", "typescript", "azure", "docker", 
      "sound engineering", "desain grafis", "mbti", "entj"
    ],
    content: `Daftar Lengkap Keahlian Muhammad Arinal Haq:
1. Hard Skills (Pengembangan Web & Software):
   - Bahasa: TypeScript, JavaScript (ES6+), Python, PHP.
   - Front-End: React 19, Next.js 16 (App Router, Server Components, SSR/SSG), Blade.
   - Back-End: Node.js, Express.js, Django, Django REST Framework, Laravel.
   - Database: PostgreSQL, MySQL.
   - Cloud & DevOps: Microsoft Azure VM, Vercel, Linux Ubuntu 24.04 LTS, Bash, Systemd, Git/GitHub.
   - AI & Data Science: Autonomous AI Agents, RAG Architecture, NLP (IndoBERT, Text Classification, KNN), 9Router Proxy.
2. Keahlian Kreatif & Multimedia:
   - Desain Grafis: Desain visual branding, poster acara, tipografi, dan komposisi UI (3 tahun di Sie Kreatif).
   - Sound Engineering: Audio mixing, live sound routing, dan tata akustik panggung.
   - Musik: Mahir memainkan alat musik Piano dan Gitar.
3. Soft Skills & Karakter (ENTJ):
   - Pembelajar dari lingkungan & pengalaman (adaptive & fast learner).
   - Integritas & Amanah: Sangat berkomitmen dan bersungguh-sungguh menuntaskan tanggung jawab.
   - Leadership alami (2 tahun memimpin Sie Kreatif UKM Musik), pemikiran analitis kritis, komunikasi lugas, dan manajemen waktu yang teruji.`
  }
];
