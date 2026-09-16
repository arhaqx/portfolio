import { About, Blog, Gallery, Home, Newsletter, Person, Social, Work } from "@/types";
import { Line, Row, Text } from "@once-ui-system/core";

const person: Person = {
  firstName: "Arinal",
  lastName: "Haq",
  name: `Muhammad Arinal Haq`,
  role: "Full Stack Web Developer",
  avatar: "/images/avatar.jpg",
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
    link: "https://www.linkedin.com/in/muhammad-arinal-2451a63a5",
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
  image: "/images/og/home.jpg",
  label: "Home",
  title: `${person.name} – Full Stack Web Developer`,
  description: `Portofolio website ${person.name}, seorang Full Stack Web Developer berdedikasi membangun aplikasi web responsif dan berskala tinggi.`,
  headline: <>Membangun Aplikasi Web Responsif, Modern, dan Berskala Tinggi</>,
  featured: {
    display: true,
    title: (
      <Row gap="12" vertical="center">
        <strong className="ml-4">Hermes Agent</strong>{" "}
        <Line background="brand-alpha-strong" vert height="20" />
        <Text marginRight="4" onBackground="brand-medium">
          Featured Project
        </Text>
      </Row>
    ),
    href: "/projects/hermes-autonomous-agent-azure",
  },
  subline: (
    <>
      Halo! Saya {person.firstName}, seorang {person.role.toLowerCase()} berbasis di Semarang, Indonesia. Berpengalaman mengembangkan aplikasi web modern dan autonomous AI agent menggunakan <Text as="span" size="xl" weight="strong">React, Next.js, Azure, Node.js, & Laravel</Text>.
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
        Lulusan S1 Teknik Informatika Universitas Dian Nuswantoro dan Dicoding Fullstack Web Developer Bootcamp yang berdedikasi membangun aplikasi web responsif dan berskala tinggi. Memiliki pengalaman praktis mengembangkan sisi front-end dan back-end menggunakan React, Next.js, Node.js, Django, dan Laravel.
        <br /><br />
        Membawa pengalaman magang selama 6 bulan di Diskominfo Kota Semarang dalam optimasi portal web, serta rekam jejak kolaborasi tim yang solid dalam merilis berbagai proyek dan terbiasa memecahkan masalah teknis kompleks guna menciptakan solusi perangkat lunak yang efisien.
      </>
    ),
  },
  work: {
    display: true, // set to false to hide this section
    title: "Pengalaman Kerja & Proyek",
    experiences: [
      {
        company: "Hermes Autonomous Agent & Cloud Automation",
        timeframe: "2026",
        role: "AI Systems & Cloud Engineer (Independent Project)",
        achievements: [
          <>
            Merancang dan men-deploy autonomous AI agent 24/7 di Microsoft Azure Ubuntu VM dengan integrasi Telegram Bot multi-thread dan background cron scheduler.
          </>,
          <>
            Mengintegrasikan 9Router Proxy AI Gateway untuk multi-model routing dan prompt caching yang berhasil menghemat ~85% token (2,4M+ input tokens ter-cache).
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
        role: "Full Stack Web Developer (Internship)",
        achievements: [
          <>
            Mengembangkan fitur baru serta melakukan pemeliharaan sistem, termasuk bug fixing dan optimasi performa, pada berbagai portal web sekolah di lingkup Kota Semarang untuk memastikan kelancaran operasional website.
          </>,
          <>
            Memastikan kelancaran operasional, keamanan data, dan keandalan sistem informasi pelayanan publik.
          </>,
        ],
        images: [],
      },
      {
        company: "PT Worthfind Travel Goods Jepara",
        timeframe: "Juli 2026 – Agustus 2026",
        role: "Full Stack Developer",
        achievements: [
          <>
            Mengembangkan sistem manajemen parkir dan kalkulasi pemasukan harian menggunakan React Native, Node.js, dan database PostgreSQL di server VPS.
          </>,
          <>
            Mengintegrasikan Cloudinary untuk foto bukti lapangan dengan algoritma deteksi keaslian/duplikasi foto, serta dashboard analitik okupansi dengan fitur export Excel.
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
        company: "Dicoding Bootcamp (Capstone Project)",
        timeframe: "April 2026 – Mei 2026",
        role: "Full Stack Web Developer (Proyek Akhir)",
        achievements: [
          <>
            Berkolaborasi dalam tim untuk merancang dan mengembangkan "HealSpace", sebuah aplikasi web Self-Check Platform kesehatan mental.
          </>,
          <>
            Pengembangan sistem diprioritaskan pada optimalisasi arsitektur guna memastikan skalabilitas dan performa yang tinggi.
          </>,
        ],
        images: [
          {
            src: "/images/projects/project-01/cover-01.jpg",
            alt: "HealSpace Project",
            width: 16,
            height: 9,
          },
        ],
      },
      {
        company: "Denah Master (Property Developer Project)",
        timeframe: "Maret – April 2026",
        role: "3D Front-End Developer (Freelance)",
        achievements: [
          <>
            Membangun aplikasi WebGL 3D interaktif untuk visualisasi dan simulasi pembagian tanah kapling seluas 9.910 m² menggunakan Three.js dan React Three Fiber.
          </>,
          <>
            Mengembangkan fitur Dual Scene (Sketsa Kasar makro & Master Plan mikro), ekstrusi poligon lahan custom, serta tooltip interaktif valuasi tanah komersial.
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
        role: "Frontend Web Developer",
        achievements: [
          <>
            Merancang dan mengembangkan antarmuka landing page yang responsif untuk menampilkan profil bisnis serta katalog menu digital guna meningkatkan presensi online kafe.
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
        company: "Bimbingan Karir Universitas Dian Nuswantoro",
        timeframe: "Februari 2024",
        role: "Full Stack Web Developer",
        achievements: [
          <>
            Merancang UI/UX dan mengembangkan antarmuka (front-end) website poliklinik kampus yang responsif untuk mendigitalisasi alur pelayanan kesehatan serta memudahkan akses informasi bagi mahasiswa.
          </>,
        ],
        images: [
          {
            src: "/images/projects/project-01/cover-04.jpg",
            alt: "Poliklinik UDINUS",
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
          <>Perancangan RESTful API, arsitektur server, manajemen database, dan integrasi logika bisnis.</>
        ),
        tags: [
          {
            name: "Node.js",
            icon: "nodejs",
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
            name: "PostgreSQL",
            icon: "postgresql",
          },
          {
            name: "Cloudinary",
            icon: "cloudinary",
          },
        ],
        images: [],
      },
      {
        title: "Cloud & Autonomous AI Agents",
        description: (
          <>Pengembangan autonomous AI agent, integrasi AI gateway (9Router Proxy), cloud deployment di Microsoft Azure VM, dan automasi cron / Linux.</>
        ),
        tags: [
          {
            name: "Azure",
            icon: "azure",
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
        title: "Soft Skills & Kolaborasi",
        description: (
          <>Terbiasa memecahkan masalah teknis kompleks, bekerja sama dalam tim, komunikatif, dan memiliki manajemen waktu yang baik.</>
        ),
        tags: [
          {
            name: "Problem Solving",
          },
          {
            name: "Teamwork",
          },
          {
            name: "Komunikatif",
          },
          {
            name: "Kemauan Belajar Tinggi",
          },
          {
            name: "Manajemen Waktu",
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

export { person, social, newsletter, home, about, blog, work, gallery };
