import { About, Blog, Gallery, Home, Learning, Newsletter, Person, Social, Work } from "@/types";
import { Line, Row, Text } from "@once-ui-system/core";

const person: Person = {
  firstName: "Arinal",
  lastName: "Haq",
  name: `Muhammad Arinal Haq`,
  role: "Full Stack Web Developer",
  avatar: "/images/arinal-portrait.jpg",
  email: "arxhaq@gmail.com",
  location: "Asia/Jakarta", // Expecting the IANA time zone identifier, e.g., 'Europe/Vienna'
  languages: ["Bahasa Indonesia", "English"], // optional: Leave the array empty if you don't want to display languages
  locale: "id", // BCP 47 language tag for the HTML lang attribute, e.g., 'en', 'ja', 'zh-TW'
};

const newsletter: Newsletter = {
  display: false,
  title: <>Berlangganan Newsletter {person.firstName}</>,
  description: <>Update seputar web development, software engineering, dan teknologi.</>,
};

const social: Social = [
  // Links are automatically displayed.
  // Import new icons in /once-ui/icons.ts
  // Set essentials: true for links you want to show on the about page
  {
    name: "GitHub",
    icon: "github",
    link: "https://github.com/arhaqx",
    essential: true,
  },
  {
    name: "LinkedIn",
    icon: "linkedin",
    link: "https://linkedin.com/in/arxhaq",
    essential: true,
  },
  {
    name: "Email",
    icon: "email",
    link: `mailto:${person.email}`,
    essential: true,
  },
  {
    name: "WhatsApp",
    icon: "whatsapp",
    link: "https://wa.me/6282141658305",
    essential: true,
  },
];

const home: Home = {
  path: "/",
  image: "/images/og/home.jpg?v=2",
  label: "Home",
  title: `${person.name} – Full Stack Web Developer`,
  description: `Portofolio resmi ${person.name}, Full Stack Web Developer yang berfokus pada rekayasa aplikasi web full-stack, infrastruktur cloud, dan sistem AI otonom.`,
  headline: <>Rekayasa Aplikasi Web Full-Stack, Infrastruktur Cloud & Sistem AI Otonom</>,
  featured: {
    display: true,
    title: (
      <Row gap="12" vertical="center">
        <strong className="ml-4">Hermes Agent</strong>{" "}
        <Line background="brand-alpha-strong" vert height="20" />
        <Text marginRight="4" onBackground="brand-medium">
          Proyek Unggulan
        </Text>
      </Row>
    ),
    href: "/projects/hermes-autonomous-agent-azure",
  },
  subline: (
    <>
      Halo, saya {person.firstName}. Full-Stack Web Developer berbasis di Semarang yang membangun aplikasi web skala produksi, infrastruktur cloud, dan autonomous AI agent menggunakan <Text as="span" size="xl" weight="strong">React, Next.js, Node.js, Laravel, & Microsoft Azure</Text>.
    </>
  ),
};

const about: About = {
  path: "/about",
  label: "About",
  title: `About – ${person.name}`,
  description: `Profil dan latar belakang profesional ${person.name}, ${person.role} dari Semarang, Indonesia`,
  tableOfContent: {
    display: true,
    subItems: false,
  },
  avatar: {
    display: true,
  },
  calendar: {
    display: false,
    link: "https://cal.com",
  },
  intro: {
    display: true,
    title: "Ringkasan Profil",
    description: (
      <>
        <Text as="p" variant="body-default-l" onBackground="neutral-weak" style={{ lineHeight: "1.75" }}>
          Lulusan S1 Teknik Informatika Universitas Dian Nuswantoro (UDINUS) dengan fokus pada rekayasa perangkat lunak full-stack dan arsitektur cloud-native. Pemegang sertifikasi profesional IBM Full-Stack JavaScript Developer (Coursera) dan alumni Dicoding Fullstack Web Developer Bootcamp, dengan pengalaman membangun sistem berbasis React, Next.js, TypeScript, Node.js, Express, MongoDB, Django, dan Laravel.
        </Text>
        <Text as="p" variant="body-default-l" onBackground="neutral-weak" style={{ lineHeight: "1.75" }}>
          Berpengalaman menangani sistem produksi melalui magang 6 bulan di Diskominfo Kota Semarang serta merilis berbagai proyek industri dan independen, mulai dari pemeliharaan portal layanan publik, sistem informasi manufaktur, visualisasi lahan 3D WebGL, hingga operasional autonomous AI agent 24/7 di atas infrastruktur Microsoft Azure.
        </Text>
      </>
    ),
  },
  work: {
    display: true, // set to false to hide this section
    title: "Pengalaman Kerja & Proyek",
    tag: "PENGALAMAN & PROYEK",
    headline: <>Jejak Rekayasa & Pengalaman Produksi</>,
    description: (
      <>
        Implementasi sistem AI otonom, infrastruktur cloud, dan pengembangan aplikasi web full-stack pada instansi pemerintah maupun sektor industri.
      </>
    ),
    experiences: [
      {
        company: "Hermes Autonomous Agent & Cloud Automation",
        timeframe: "2026 – Sekarang",
        tag: "INDEPENDENT SYSTEM",
        role: "AI Systems & Cloud Engineer",
        achievements: [
          <>
            Merancang dan mengoperasikan autonomous AI agent 24/7 di atas infrastruktur Microsoft Azure (Ubuntu 24.04 LTS VM) yang terintegrasi dengan Telegram multi-topic message broker untuk eksekusi tugas jarak jauh dan penjadwalan cronjob otomatis.
          </>,
          <>
            Mengonfigurasi 9Router Proxy sebagai AI Gateway dengan mekanisme smart prompt caching yang menghemat konsumsi token hingga 85% (~2,46 juta cached input tokens) serta mendukung routing dinamis lintas model (Gemini Flash, OpenCode, MiMo).
          </>,
        ],
        images: [
          {
            src: "/images/projects/hermes/cover.jpg",
            alt: "Hermes Cloud Agent Architecture",
            width: 16,
            height: 9,
          },
        ],
      },
      {
        company: "Dinas Komunikasi, Informatika, Statistik dan Persandian Kota Semarang",
        timeframe: "Maret 2024 – Oktober 2024",
        tag: "INTERNSHIP",
        role: "Full Stack Web Developer Intern",
        achievements: [
          <>
            Menangani pemeliharaan rutin, refactoring skema basis data, dan pengembangan modul fitur baru pada jaringan portal web kedinasan serta sekolah negeri di lingkup Pemerintah Kota Semarang berbasis PHP dan Laravel.
          </>,
          <>
            Melakukan debugging sistem produksi, audit keamanan aplikasi, dan optimasi performa query backend untuk menjaga ketersediaan tinggi serta integritas data layanan publik.
          </>,
        ],
        images: [],
      },
      {
        company: "PT Worthfind Travel Goods Jepara",
        timeframe: "Juli 2026 – Agustus 2026",
        tag: "CLIENT WORK",
        role: "Full Stack Developer (Contract)",
        achievements: [
          <>
            Membangun sistem manajemen lahan parkir pabrik terintegrasi berbasis Next.js, Node.js REST API, dan PostgreSQL untuk mendigitalisasi kalkulasi retribusi dan pemantauan kapasitas slot kendaraan secara real-time.
          </>,
          <>
            Mengimplementasikan verifikasi foto bukti fisik melalui Cloudinary dengan algoritma deteksi duplikasi otomatis, dilengkapi dashboard analitik okupansi kendaraan dengan fitur ekspor laporan spreadsheet.
          </>,
        ],
        images: [
          {
            src: "/images/projects/parkir/dashboard-analitik.png",
            alt: "Dashboard Analitik Parkir PT Worthfind",
            width: 16,
            height: 9,
          },
        ],
      },
      {
        company: "HealSpace – Mental Health Self-Check Platform",
        timeframe: "April 2026 – Mei 2026",
        tag: "CAPSTONE PROJECT",
        role: "Lead Full Stack Developer",
        achievements: [
          <>
            Memimpin pengembangan platform kesehatan mental terpadu (healspace.my.id) pada proyek akhir kolaboratif Dicoding Bootcamp menggunakan React, Tailwind CSS, Django REST Framework, dan PostgreSQL.
          </>,
          <>
            Mengintegrasikan asisten AI konseling interaktif 24/7 berbasis Google Gemini API, instrumen skrining klinis DASS-21 & PHQ-9 dengan visualisasi tren emosional, serta pintasan darurat hotline 119.
          </>,
        ],
        images: [
          {
            src: "/images/projects/healspace/dashboard.png",
            alt: "HealSpace AI Mental Health Platform",
            width: 16,
            height: 9,
          },
        ],
      },
      {
        company: "Denah Master (Property Developer Visualizer)",
        timeframe: "Maret 2026 – April 2026",
        tag: "FREELANCE",
        role: "3D Front-End Developer",
        achievements: [
          <>
            Mengembangkan aplikasi visualisasi 3D WebGL interaktif untuk simulasi pembagian lahan kavling seluas 9.910 m² menggunakan Three.js dan React Three Fiber.
          </>,
          <>
            Mengimplementasikan arsitektur Dual Scene (masterplan makro dan kavling mikro), ekstrusi poligon parametrik custom, serta kalkulator valuasi tanah dinamis secara real-time.
          </>,
        ],
        images: [
          {
            src: "/images/projects/denah-master/masterplan-detail.png",
            alt: "Denah Master 3D Visualizer",
            width: 16,
            height: 9,
          },
        ],
      },
      {
        company: "Vinty Coffee & Space Jepara",
        timeframe: "Februari 2026",
        tag: "CLIENT WORK",
        role: "Frontend Web Developer",
        achievements: [
          <>
            Merancang dan merilis landing page responsif dengan katalog menu digital terintegrasi untuk memudahkan eksplorasi produk dan memperkuat presensi digital kafe.
          </>,
        ],
        images: [
          {
            src: "/images/projects/project-01/cover-03.jpg",
            alt: "Vinty Coffee & Space",
            width: 16,
            height: 9,
          },
        ],
      },
      {
        company: "Sistem Manajemen Poliklinik Terpadu – UDINUS",
        timeframe: "Februari 2024",
        tag: "ACADEMIC PROJECT",
        role: "Full Stack Web Developer & UI/UX",
        achievements: [
          <>
            Mendigitalisasi alur operasional layanan kesehatan kampus melalui aplikasi web terpadu berbasis framework Laravel dan database MySQL.
          </>,
          <>
            Membangun modul registrasi pemeriksaan pasien online, pemilihan jadwal dinamis dokter spesialis, pencatatan rekam keluhan awal, serta penerbitan nomor antrean digital otomatis.
          </>,
        ],
        images: [
          {
            src: "/images/projects/poliklinik/landing-page.png",
            alt: "Sistem Manajemen Poliklinik Terpadu",
            width: 16,
            height: 9,
          },
        ],
      },
    ],
  },
  studies: {
    display: true, // set to false to hide this section
    title: "Pendidikan & Sertifikasi",
    institutions: [
      {
        name: "Universitas Dian Nuswantoro (UDINUS)",
        description: <>S1 Teknik Informatika</>,
      },
      {
        name: "IBM Skills Network & Coursera",
        description: (
          <>
            IBM Full-Stack JavaScript Developer Professional Certificate (12 Spesialisasi Kursus, 2026) •{" "}
            <a
              href="https://coursera.org/verify/professional-cert/WIG8NPYN363B"
              target="_blank"
              rel="noopener noreferrer"
              style={{ textDecoration: "underline" }}
            >
              Verifikasi Kredensial
            </a>
          </>
        ),
      },
      {
        name: "Dicoding Academy",
        description: <>Dicoding Fullstack Web Developer Bootcamp (2026)</>,
      },
      {
        name: "Lembaga Sertifikasi Profesi (LSP)",
        description: <>Sertifikat Kompetensi Bidang Pemrograman Web / TI (2024)</>,
      },
    ],
  },
  technical: {
    display: true, // set to false to hide this section
    title: "Keahlian Teknis (Skills)",
    skills: [
      {
        title: "Frontend Development",
        description: (
          <>Pengembangan antarmuka web modern, responsif, dan interaktif dengan ekosistem React dan Next.js.</>
        ),
        tags: [
          {
            name: "React",
            icon: "react",
          },
          {
            name: "Next.js",
            icon: "nextjs",
          },
          {
            name: "TypeScript",
            icon: "typescript",
          },
          {
            name: "JavaScript",
            icon: "javascript",
          },
          {
            name: "React Native",
            icon: "react",
          },
          {
            name: "Three.js",
            icon: "threejs",
          },
          {
            name: "React Three Fiber",
          },
        ],
        images: [],
      },
      {
        title: "Backend Development",
        description: (
          <>Perancangan RESTful API, arsitektur server, manajemen database SQL & NoSQL, serta integrasi logika bisnis.</>
        ),
        tags: [
          {
            name: "Node.js",
            icon: "nodejs",
          },
          {
            name: "Express.js",
          },
          {
            name: "MongoDB / NoSQL",
          },
          {
            name: "PostgreSQL",
            icon: "postgresql",
          },
          {
            name: "Laravel",
            icon: "laravel",
          },
          {
            name: "Django",
            icon: "django",
          },
          {
            name: "PHP",
            icon: "php",
          },
          {
            name: "Python",
            icon: "python",
          },
          {
            name: "Cloudinary",
            icon: "cloudinary",
          },
        ],
        images: [],
      },
      {
        title: "Cloud, Containers & AI Agents",
        description: (
          <>Pengembangan autonomous AI agent, kontainerisasi aplikasi dengan Docker & Kubernetes, integrasi AI gateway (9Router Proxy), cloud deployment di Microsoft Azure VM, dan automasi cron / Linux.</>
        ),
        tags: [
          {
            name: "Docker",
          },
          {
            name: "Kubernetes",
          },
          {
            name: "Microservices",
          },
          {
            name: "Azure",
            icon: "azure",
          },
          {
            name: "Gemini API",
          },
          {
            name: "AI Agents",
          },
          {
            name: "9Router Proxy",
          },
          {
            name: "Ubuntu / Linux",
            icon: "ubuntu",
          },
          {
            name: "Python",
            icon: "python",
          },
        ],
        images: [],
      },
      {
        title: "Web Analytics, DevOps & CI/CD",
        description: (
          <>Pengukuran metrik dan traffic pengguna dengan Google Analytics 4 (GA4), pelacakan campaign UTM, CI/CD pipeline, OpenShift, version control Git/GitHub, dan deployment platform.</>
        ),
        tags: [
          {
            name: "Google Analytics 4",
          },
          {
            name: "UTM Campaign Tracking",
          },
          {
            name: "Git / GitHub",
            icon: "github",
          },
          {
            name: "CI/CD & DevOps",
          },
          {
            name: "Red Hat OpenShift",
          },
          {
            name: "Vercel",
          },
        ],
        images: [],
      },
      {
        title: "System Architecture & Engineering Practices",
        description: (
          <>Perancangan sistem terdistribusi, integrasi RAG & LLM pada aplikasi web, dokumentasi spesifikasi teknis, serta kepemimpinan tim teknis dan kreatif.</>
        ),
        tags: [
          {
            name: "System Design",
          },
          {
            name: "RESTful API Architecture",
          },
          {
            name: "RAG & LLM Integration",
          },
          {
            name: "Agile / Scrum",
          },
          {
            name: "Technical Documentation",
          },
          {
            name: "Team Leadership",
          },
        ],
        images: [],
      },
    ],
  },
};

const blog: Blog = {
  path: "/blog",
  label: "Blog",
  title: "Blog & Tulisan Teknis",
  description: `Tulisan dan artikel teknologi oleh ${person.name}`,
};

const work: Work = {
  path: "/projects",
  label: "Projects",
  title: `Proyek – ${person.name}`,
  description: `Portofolio proyek software engineering dan web development oleh ${person.name}`,
};

const gallery: Gallery = {
  path: "/gallery",
  label: "Gallery",
  title: `Photo gallery – ${person.name}`,
  description: `A photo collection by ${person.name}`,
  images: [
    {
      src: "/images/gallery/horizontal-1.jpg",
      alt: "image",
      orientation: "horizontal",
    },
    {
      src: "/images/gallery/vertical-4.jpg",
      alt: "image",
      orientation: "vertical",
    },
    {
      src: "/images/gallery/horizontal-3.jpg",
      alt: "image",
      orientation: "horizontal",
    },
    {
      src: "/images/gallery/vertical-1.jpg",
      alt: "image",
      orientation: "vertical",
    },
    {
      src: "/images/gallery/vertical-2.jpg",
      alt: "image",
      orientation: "vertical",
    },
    {
      src: "/images/gallery/horizontal-2.jpg",
      alt: "image",
      orientation: "horizontal",
    },
    {
      src: "/images/gallery/horizontal-4.jpg",
      alt: "image",
      orientation: "horizontal",
    },
    {
      src: "/images/gallery/vertical-3.jpg",
      alt: "image",
      orientation: "vertical",
    },
  ],
};

const learning: Learning = {
  path: "/learning",
  label: "Learning",
  title: `Learning & Progress Tracker – ${person.name}`,
  description: `Roadmap, kelas aktif, dan progres pembelajaran berkelanjutan oleh ${person.name} dalam bidang Cloud, Generative AI, dan Full-Stack Web Development.`,
  headline: <>Kurikulum & Progres Sertifikasi Teknis</>,
  subline: (
    <>
      Dokumentasi program sertifikasi profesional, beasiswa teknologi, dan modul teknis yang sedang ditempuh maupun telah diselesaikan.
    </>
  ),
  tracks: [
    {
      id: "ibm-fullstack-javascript",
      program: "IBM Full-Stack JavaScript Developer Professional Certificate",
      provider: "IBM Skills Network & Coursera",
      trackName: "Full-Stack JavaScript & Cloud-Native Developer",
      level: "Professional Certificate (Advanced)",
      status: "completed",
      statusLabel: "100% Selesai • Bersertifikat Resmi",
      progress: 100,
      deadline: "6 Oktober 2026",
      deadlineLabel: "Diselesaikan pada 6 Oktober 2026 • Credential ID: WIG8NPYN363B",
      announcement: {
        type: "success",
        title: "Sertifikasi Profesional Selesai (12/12 Kursus)",
        message:
          "Menyelesaikan seluruh 12 spesialisasi kursus dari IBM Skills Network yang mencakup React, Node.js, Express, MongoDB, Docker, Kubernetes, Microservices, OpenShift, Cloud Native, dan Serverless Computing.",
      },
      modules: [
        {
          title: "Introduction to Software Engineering",
          status: "completed",
          tags: ["Software Engineering", "SDLC", "Architecture", "Methodologies"],
          note: "Prinsip rekayasa perangkat lunak, siklus hidup pengembangan (SDLC), dan metodologi modern.",
        },
        {
          title: "Introduction to HTML, CSS, & JavaScript",
          status: "completed",
          tags: ["HTML5", "CSS3", "JavaScript", "Web Basics"],
          note: "Fondasi markup web, styling responsif, dan scripting interaktif.",
        },
        {
          title: "Getting Started with Git and GitHub",
          status: "completed",
          tags: ["Git", "GitHub", "Version Control", "Collaboration"],
          note: "Branching, merging, pull requests, dan alur kerja kolaboratif open-source.",
        },
        {
          title: "JavaScript Programming Essentials",
          status: "completed",
          tags: ["JavaScript", "ES6+", "OOP", "Async/Await"],
          note: "Sintaks esensial JavaScript modern, pemrograman fungsional & berorientasi objek.",
        },
        {
          title: "Developing Front-End Apps with React",
          status: "completed",
          tags: ["React", "Hooks", "Component Lifecycle", "State Management"],
          note: "Pengembangan antarmuka modular, reusable components, hooks, dan state management.",
        },
        {
          title: "Developing Back-End Apps with Node.js and Express",
          status: "completed",
          tags: ["Node.js", "Express.js", "REST API", "Routing"],
          note: "Perancangan RESTful API, penanganan routing, middleware, dan arsitektur server.",
        },
        {
          title: "Get Started with Cloud Native, DevOps, Agile, and NoSQL",
          status: "completed",
          tags: ["Cloud Native", "DevOps", "Agile", "NoSQL", "CI/CD"],
          note: "Konsep cloud-native, budaya DevOps, integrasi CI/CD, metodologi Agile, dan database NoSQL.",
        },
        {
          title: "Introduction to Containers w/ Docker, Kubernetes & OpenShift",
          status: "completed",
          tags: ["Docker", "Kubernetes", "Red Hat OpenShift", "Containers"],
          note: "Kontainerisasi aplikasi, container orchestration, deployment pod, dan manajemen cluster OpenShift.",
        },
        {
          title: "Application Development using Microservices and Serverless",
          status: "completed",
          tags: ["Microservices", "Serverless", "Event-Driven", "Cloud Functions"],
          note: "Arsitektur microservices terdistribusi, event-driven computing, dan fungsi serverless.",
        },
        {
          title: "Node.js & MongoDB: Developing Back-end Database Applications",
          status: "completed",
          tags: ["MongoDB", "Mongoose", "NoSQL", "CRUD Operations", "Database Design"],
          note: "Model data dokumen, query MongoDB, agregasi, dan integrasi driver Mongoose pada Node.js.",
        },
        {
          title: "JavaScript Full Stack Capstone Project",
          status: "completed",
          tags: ["Capstone Project", "Full Stack", "React", "Node.js", "Express", "MongoDB", "Cloud Native"],
          note: "Pengembangan dan deployment aplikasi full-stack berskala produksi dari perancangan hingga rilis.",
        },
        {
          title: "Software Developer Career Guide and Interview Preparation",
          status: "completed",
          tags: ["Career Guide", "Technical Interview", "Best Practices"],
          note: "Strategi kesiapan karier profesional, portfolio review, dan persiapan wawancara teknis.",
        },
      ],
      nextTarget: {
        title: "Penerapan Arsitektur Cloud-Native pada Proyek Skala Produksi",
        description: "Mengimplementasikan microservices, kontainerisasi Docker/K8s, dan database NoSQL pada proyek portofolio baru dan solusi enterprise.",
        status: "Implementasi Aktif",
      },
      link: "https://coursera.org/verify/professional-cert/WIG8NPYN363B",
    },
    {
      id: "dbs-coding-camp-2026",
      program: "Coding Camp 3.0 powered by DBS Foundation",
      provider: "DBS Foundation & Dicoding",
      trackName: "Full-Stack Web Developer",
      level: "Tahap Dasar & Pengenalan",
      status: "completed",
      statusLabel: "100% Selesai (1 Bulan Lebih Cepat)",
      progress: 100,
      deadline: "28 September 2026",
      deadlineLabel: "Pengumuman Seleksi Beasiswa Lanjutan (Batch 2): 30 September 2026",
      announcement: {
        type: "success",
        title: "Milestone Tahap Dasar & Pengenalan Tuntas 100%",
        message: "Seluruh kelas wajib telah diselesaikan satu bulan sebelum tenggat waktu resmi dan masuk ke tahap evaluasi Beasiswa Kelas Lanjutan Batch 2.",
      },
      modules: [
        {
          title: "Belajar Dasar Pemrograman Web",
          status: "completed",
          tags: ["HTML5", "CSS3", "Responsive Design", "Web Fundamentals"],
          note: "Penguasaan struktur semantik HTML dan styling modern.",
        },
        {
          title: "Belajar Dasar Pemrograman JavaScript",
          status: "completed",
          tags: ["JavaScript", "ES6+", "Async Programming", "Logic"],
          note: "Algoritma pemrograman, manipulasi data array/object, dan fungsi asinkron.",
        },
        {
          title: "Belajar Membuat Front-End Web untuk Pemula",
          status: "completed",
          tags: ["DOM Manipulation", "Web Storage", "Event Handling"],
          note: "Interaktivitas browser, event listener, dan persistensi client-side storage.",
        },
        {
          title: "Soft Skill: Belajar Strategi Pengembangan Diri",
          status: "completed",
          tags: ["Soft Skill", "Growth Mindset", "Time Management"],
          note: "Pola pikir bertumbuh, strategi manajemen fokus, dan produktivitas insinyur software.",
        },
        {
          title: "Introduction to Financial Literacy",
          status: "completed",
          tags: ["Finance", "Financial Literacy", "Investment Basics"],
          note: "Fondasi pengambilan keputusan finansial dan literasi investasi cerdas.",
        },
      ],
      nextTarget: {
        title: "Belajar Fundamental Front-End Web Development",
        description: "Tahap seleksi Beasiswa Kelas Lanjutan untuk mendalami arsitektur front-end modern, component lifecycle, dan integrasi API mendalam.",
        status: "Seleksi Batch 2 • 30 Sept 2026",
      },
      link: "https://www.dbs.com/foundation",
    },
    {
      id: "aws-ai-academy-2026",
      program: "AWS AI Academy 2026",
      provider: "AWS & Dicoding",
      trackName: "AWS AI Academy - Level Dasar & Pemula",
      level: "Cloud & Gen AI (Pemula)",
      status: "in-progress",
      statusLabel: "Sedang Berjalan (Active)",
      progress: 25,
      deadline: "31 Desember 2026 pukul 23.59",
      deadlineLabel: "Deadline Materi: 31 Desember 2026 (Target penyelesaian bertahap)",
      announcement: {
        type: "info",
        title: "Eksplorasi Cloud Infrastructure & Generative AI",
        message: "Program pelatihan teknis dari AWS untuk penguasaan komputasi awan, layanan Generative AI, dan penerapan model machine learning praktis.",
      },
      modules: [
        {
          title: "Spec-Driven Development dengan Kiro",
          status: "completed",
          tags: ["AI Methodology", "Specification", "Kiro"],
          note: "Penerapan metodologi rekayasa perangkat lunak berbasis spesifikasi terarah AI.",
        },
        {
          title: "Belajar Dasar Cloud dan Gen AI di AWS",
          status: "in-progress",
          tags: ["AWS", "Cloud Computing", "Generative AI", "Bedrock"],
          note: "Sedang dipelajari: konsep infrastruktur AWS Cloud dan ekosistem Generative AI.",
        },
        {
          title: "Memulai Pemrograman dengan Python",
          status: "locked",
          tags: ["Python", "Programming", "OOP"],
          note: "Modul prasyarat sebelum pendalaman machine learning.",
        },
        {
          title: "Belajar Machine Learning untuk Pemula",
          status: "upcoming",
          tags: ["Machine Learning", "Data Modeling", "Supervised Learning"],
          note: "Pondasi algoritma machine learning dan evaluasi model klasifikasi/regresi.",
        },
      ],
      link: "https://aws.amazon.com",
    },
  ],
};

export { person, social, newsletter, home, about, blog, learning, work, gallery };
