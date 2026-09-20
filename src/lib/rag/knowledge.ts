export interface KnowledgeChunk {
  id: string;
  title: string;
  category: "profile" | "experience" | "education" | "projects" | "skills" | "contact";
  url?: string;
  keywords: string[];
  content: string;
}

export const KNOWLEDGE_BASE: KnowledgeChunk[] = [
  {
    id: "profile_summary",
    title: "Profil & Biodata Muhammad Arinal Haq",
    category: "profile",
    url: "/about",
    keywords: ["nama", "profil", "biodata", "siapa", "arinal", "haq", "arhaq", "about", "lokasi", "domisili", "semarang", "role"],
    content: `Muhammad Arinal Haq (biasa dipanggil Arinal, username: arhaqx) adalah seorang Full Stack Web Developer & AI Systems Engineer yang berbasis di Semarang, Jawa Tengah, Indonesia.
Arinal adalah lulusan S1 Teknik Informatika dari Universitas Dian Nuswantoro (UDINUS) dan alumni Dicoding Fullstack Web Developer Bootcamp.
Dia berdedikasi membangun aplikasi web modern yang responsif, berkinerja tinggi, dan scalable, serta mengimplementasikan sistem Autonomous AI Agents dan arsitektur cloud (Microsoft Azure & Vercel).
Website resminya beralamat di https://arhaq.dev.`
  },
  {
    id: "work_experience",
    title: "Pengalaman Kerja & Magang",
    category: "experience",
    url: "/about",
    keywords: ["pengalaman", "kerja", "magang", "internship", "diskominfo", "hermes", "karir", "history"],
    content: `Pengalaman Kerja Muhammad Arinal Haq:
1. Hermes Autonomous Agent & Cloud Automation (2026 - Sekarang):
   Role: AI Systems & Cloud Engineer (Independent Project).
   Mengembangkan sistem asisten AI otonom pribadi 24/7 di atas infrastruktur cloud Microsoft Azure Virtual Machine (Ubuntu 24.04 LTS). Terintegrasi dengan multi-thread Telegram bot, cronjob scheduler otomatis, dan AI Gateway 9Router Proxy yang menghemat hingga 85% token (2.46 juta token) melalui teknik prompt caching.
2. Diskominfo Kota Semarang (6 Bulan):
   Role: Full Stack Web Developer Intern.
   Melakukan pemeliharaan dan optimasi portal web layanan publik Pemerintah Kota Semarang, meningkatkan performa akses portal, memperbaiki bug antarmuka, dan mengoptimalkan integrasi basis data untuk efisiensi layanan publik.`
  },
  {
    id: "education_bootcamps",
    title: "Pendidikan & Bootcamp",
    category: "education",
    url: "/learning",
    keywords: ["pendidikan", "kuliah", "kampus", "udinus", "dicoding", "dbs", "aws", "bootcamp", "sertifikat", "lulusan", "sekolah"],
    content: `Riwayat Pendidikan & Pelatihan Intensif Arinal:
1. Universitas Dian Nuswantoro (UDINUS) Semarang:
   Lulusan S1 Teknik Informatika dengan fokus keahlian rekayasa perangkat lunak, sistem basis data, dan kecerdasan buatan.
2. Dicoding Bootcamp (Fullstack Web Developer Track):
   Alumni resmi Dicoding Bootcamp dengan penguasaan arsitektur front-end dan back-end modern (React, Node.js, RESTful API).
3. DBS Foundation Coding Camp 2026 (Alumni Track):
   Status: 100% Selesai lebih awal 1 bulan sebelum batas waktu (deadline). Memiliki peluang besar lolos ke tahap inkubasi lanjutan karena rekam jejak lulusan Dicoding dan penyelesaian kelas kilat.
4. AWS AI Academy 2026:
   Status: Sedang berjalan aktif, mendalami arsitektur komputasi awan AWS, pipeline machine learning, dan implementasi Generative AI enterprise.`
  },
  {
    id: "project_hermes",
    title: "Proyek Hermes: Cloud-Native Autonomous AI Agent",
    category: "projects",
    url: "/projects/hermes-autonomous-agent-azure",
    keywords: ["hermes", "ai agent", "autonomous", "azure", "9router", "telegram", "gemini", "cloud", "cronjob"],
    content: `Proyek Hermes Agent:
- Deskripsi: Sistem autonomous AI agent yang beroperasi 24/7 di atas Microsoft Azure VM (Ubuntu 24.04 LTS, B2ats v2).
- Fitur Utama: Kontrol jarak jauh via Telegram Client multi-topic, eksekusi sandbox tool calling di server, agregasi berita otomatis terjadwal via cronjob, dan manajemen memori persisten (soul.md).
- AI Gateway & Cost Optimization: Menggunakan 9Router Proxy dengan model failover cerdas (Gemini 3.8 Flash, OpenCode, MiMo) dan prompt caching agresif yang menghemat biaya hingga ~85% (total token 2.9M).
- Tech Stack: Python 3, Microsoft Azure, 9Router Proxy, Telegram Bot API, Google Gemini API, Bash Linux.`
  },
  {
    id: "project_healspace",
    title: "Proyek HealSpace: Platform Self-Check Kesehatan Mental",
    category: "projects",
    url: "/projects/healspace-self-check-platform",
    keywords: ["healspace", "mental health", "kesehatan", "psikolog", "konsultasi", "react", "django", "screening"],
    content: `Proyek HealSpace:
- Deskripsi: Platform web kesehatan mental komprehensif yang dirancang untuk membantu pengguna melakukan skrining awal mandiri dan konsultasi psikologis terpercaya.
- Fitur Utama: Tes kesehatan mental interaktif (DASS-21), Emergency Help Button dengan tautan instan ke hotline krisis 119 & WhatsApp, sistem booking janji temu psikolog/konselor, dan dashboard rekam medis terenkripsi.
- Tech Stack: React (Vite), Django REST Framework (Python), PostgreSQL, TailwindCSS, RESTful API.`
  },
  {
    id: "project_poliklinik",
    title: "Proyek Poliklinik Kampus UDINUS",
    category: "projects",
    url: "/projects/poliklinik-kampus-udinus",
    keywords: ["poliklinik", "udinus", "antrean", "rekam medis", "laravel", "php", "klinik", "dokter", "pasien"],
    content: `Proyek Poliklinik Kampus UDINUS:
- Deskripsi: Sistem informasi manajemen layanan kesehatan dan rekam medis digital untuk klinik kampus Universitas Dian Nuswantoro.
- Fitur Utama: Pendaftaran antrean periksa online untuk mahasiswa & staf, manajemen jadwal poliklinik dokter, pencatatan rekam medis digital (riwayat diagnosa & keluhan), dan sistem cetak resep obat farmasi.
- Tech Stack: Laravel (PHP), MySQL, Blade Templating, Bootstrap, MVC Architecture.`
  },
  {
    id: "project_parkir",
    title: "Proyek Sistem Informasi Parkir PT Worthfind",
    category: "projects",
    url: "/projects/sistem-informasi-parkir-pt-worthfind",
    keywords: ["parkir", "worthfind", "kendaraan", "nextjs", "django", "log", "pos", "tiket"],
    content: `Proyek Sistem Informasi Parkir PT Worthfind:
- Deskripsi: Solusi enterprise web-based untuk pencatatan dan monitoring lalu lintas kendaraan masuk/keluar secara real-time di lingkungan industri PT Worthfind.
- Fitur Utama: Logging check-in & check-out kendaraan berbasis barcode plat nomor, kalkulasi tarif otomatis berdasarkan durasi waktu, deteksi kapasitas slot parkir live, dan pelaporan keuangan harian/bulanan.
- Tech Stack: Next.js (App Router), Django REST Framework, PostgreSQL, TailwindCSS.`
  },
  {
    id: "technical_skills",
    title: "Keahlian Teknis & Tech Stack",
    category: "skills",
    url: "/about",
    keywords: ["skill", "skills", "tech stack", "teknologi", "keahlian", "bahasa", "react", "nextjs", "laravel", "python", "typescript", "azure", "docker"],
    content: `Daftar Keahlian & Tech Stack Muhammad Arinal Haq:
1. Front-End:
   - React 19, Next.js 16 (App Router, Turbopack, SSG/SSR, API Routes)
   - TypeScript, JavaScript (Modern ES6+)
   - Once UI Design System, SCSS Modules, CSS Variables, TailwindCSS
2. Back-End:
   - Node.js, Express.js
   - Python (Django, Django REST Framework, FastAPI)
   - PHP (Laravel Framework)
   - Database: PostgreSQL, MySQL
3. Cloud, DevOps, & Linux:
   - Microsoft Azure (Virtual Machines, Network Security Groups, SSH Key Tunneling)
   - Vercel (CI/CD Deployment, Edge Network, Custom DNS Management)
   - Linux System Administration (Ubuntu 24.04 LTS, Bash, Systemd Services, Swap Management)
   - Git, GitHub (Actions, Webhooks)
4. AI, LLM, & Generative Tech:
   - Autonomous AI Agents (Tool calling, memory management, session orchestration)
   - RAG (Retrieval-Augmented Generation) Architecture
   - AI Gateway (9Router Proxy, token caching, prompt compression, model failover)
   - Google Gemini API (1.5 Flash, 2.0 Flash, text-embedding-004), OpenAI API`
  },
  {
    id: "contact_and_hiring",
    title: "Kontak & Status Ketersediaan Karir",
    category: "contact",
    url: "/about",
    keywords: ["kontak", "email", "whatsapp", "wa", "hire", "rekrut", "freelance", "linkedin", "github", "hubungi"],
    content: `Informasi Kontak & Kerjasama dengan Muhammad Arinal Haq:
- Status Karir: Terbuka untuk tawaran kerja Full-time, Kontrak, Remote, maupun Proyek Freelance di bidang Full Stack Web Development dan AI Systems Engineering.
- Website Resmi: https://arhaq.dev
- Email: arxhaq@gmail.com (mailto:arxhaq@gmail.com)
- WhatsApp: +62 821-4165-8305 (https://wa.me/6282141658305)
- LinkedIn: https://www.linkedin.com/in/muhammad-arinal-2451a63a5
- GitHub: https://github.com/arhaqx
Arinal sangat responsif melalui WhatsApp dan Email untuk diskusi peluang proyek, kolaborasi teknologi, atau interview teknis.`
  }
];
