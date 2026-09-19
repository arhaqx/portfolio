<div align="center">

  <img src="public/images/logo.svg" alt="arhaq.dev logo" width="96" height="96" />

  # arhaq.dev

  **Personal Portfolio & Engineering Showcase**  
  *Crafted by Muhammad Arinal Haq — Full Stack Web Developer & AI Systems Engineer*

  [![Live Site](https://img.shields.io/badge/Live_Site-arhaq.dev-38bdf8?style=for-the-badge&logo=vercel&logoColor=white)](https://arhaq.dev)
  [![Next.js](https://img.shields.io/badge/Next.js_16-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org)
  [![React](https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev)
  [![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
  [![Vercel](https://img.shields.io/badge/Vercel-Deployed-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com)

  <br />

  <p align="center">
    <a href="https://arhaq.dev"><strong>🌐 Explore Live Portfolio »</strong></a>
    <br />
    <a href="https://arhaq.dev/projects">View Projects</a>
    ·
    <a href="https://arhaq.dev/learning">Learning Tracker</a>
    ·
    <a href="https://arhaq.dev/about">About Me</a>
  </p>

</div>

---

## 🌟 Overview

**`arhaq.dev`** is the personal portfolio and digital playground of **Muhammad Arinal Haq**, an Informatics Engineering graduate from Universitas Dian Nuswantoro (UDINUS) and Dicoding Bootcamp Alumni. 

Built with **Next.js 16 (Turbopack)** and **React 19**, this portfolio showcases full-stack web applications, autonomous AI agent systems, interactive case studies, and a Notion-style live bootcamp progress tracker.

---

## ✨ Key Features

- ⚡ **Next.js 16 & Turbopack:** Supercharged performance with hybrid Static Site Generation (SSG), Edge runtime routes, and lightning-fast page transitions.
- 🎨 **Cyber-Dark Design System:** Sleek, minimalist aesthetics built on top of [Once UI](https://once-ui.com), featuring customized typography, neon cyan-indigo accents, and responsive micro-animations.
- 💎 **Custom ARHAQ Monogram:** High-DPI vector SVG favicon and brand icon designed specifically for `arhaq.dev`.
- 🛠️ **Interactive Project Showcase:** Detailed MDX case studies with tech stack tags, architecture diagrams, live demo links, and GitHub repository references:
  - **Hermes Autonomous Agent:** Autonomous AI agent on Microsoft Azure with Google Gemini API.
  - **HealSpace Platform:** Mental health self-check & consultation web platform (React + Django REST).
  - **Poliklinik Kampus UDINUS:** Comprehensive clinical registration & medical records system (Laravel).
  - **Sistem Informasi Parkir PT Worthfind:** Real-time parking management platform (Next.js + Django).
- 📚 **Notion-Style Learning Tracker (`/learning`):** Real-time interactive progress tracker for ongoing technical programs:
  - **DBS Foundation Coding Camp 2026** (Alumni Track — 100% Completed ahead of schedule).
  - **AWS AI Academy 2026** (AI Systems & Cloud Architecture — Active progress).
- 📱 **Mobile-First & Fully Responsive:** Engineered to deliver a desktop-grade experience across mobile phones, tablets, and ultrawide displays.
- 🔍 **Production SEO & OpenGraph:** Auto-generated dynamic sitemap (`/sitemap.xml`), robots rules (`/robots.txt`), schema.org JSON-LD, and dynamic social preview cards.

---

## 🛠️ Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Framework** | [Next.js 16](https://nextjs.org) (App Router, Turbopack) |
| **Library** | [React 19](https://react.dev) |
| **Language** | [TypeScript 5](https://www.typescriptlang.org) |
| **Design & UI** | [Once UI Core](https://once-ui.com), SCSS Modules, CSS Variables |
| **Content Engine** | MDX (`@next/mdx`, `next-mdx-remote`, `gray-matter`) |
| **Deployment** | [Vercel](https://vercel.com) (Global Edge Anycast Network) |
| **Domain & SSL** | Custom Domain (`arhaq.dev`) via Name.com with automated HTTPS |

---

## 📂 Project Structure

```bash
porto/
├── public/                  # Static assets (favicons, brand logo, project media)
│   ├── favicon.svg          # High-DPI vector favicon
│   ├── favicon.ico          # Legacy desktop favicon
│   └── images/              # Profile portraits, case study screenshots & logo
├── src/
│   ├── app/                 # Next.js App Router pages
│   │   ├── page.tsx         # Home & Featured Hero section
│   │   ├── about/           # Profile, work experience & technical skills
│   │   ├── projects/        # Fullstack & AI projects catalog + [slug] MDX
│   │   ├── learning/        # Interactive Notion-style progress tracker
│   │   ├── sitemap.ts       # Automated SEO sitemap generator
│   │   └── layout.tsx       # Root layout with brand metadata & theme provider
│   ├── components/          # Reusable UI components (Header, Footer, Cards)
│   ├── resources/           # Site configuration, content data, and routes
│   │   ├── content.tsx      # Central source of truth for bio & experiences
│   │   └── once-ui.config.ts# Domain baseURL, theme variables & route flags
│   └── types/               # TypeScript interfaces & type definitions
├── scripts/                 # Utility scripts (icon generation, asset building)
└── package.json             # Project dependencies and npm scripts
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: v18.18.0 or later (Recommended: v20+)
- **npm** or **pnpm** / **yarn**

### 1. Clone the Repository
```bash
git clone https://github.com/arhaqx/portfolio.git
cd portfolio
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### 4. Build for Production
```bash
npm run build
```

---

## 🌐 Deployment

This project is configured with continuous deployment via **Vercel**:

- **Production Branch:** `main`
- **Custom Domain:** `https://arhaq.dev`
- **Edge Anycast Routing:** Subdomain `www.arhaq.dev` automatically redirects to `https://arhaq.dev` with end-to-end SSL/TLS encryption.

---

## 📬 Connect With Me

- **Website:** [arhaq.dev](https://arhaq.dev)
- **LinkedIn:** [Muhammad Arinal Haq](https://www.linkedin.com/in/muhammad-arinal-2451a63a5)
- **GitHub:** [@arhaqx](https://github.com/arhaqx)
- **Email:** [arxhaq@gmail.com](mailto:arxhaq@gmail.com)
- **WhatsApp:** [+62 821-4165-8305](https://wa.me/6282141658305)

---

<div align="center">
  <sub>Designed & Developed with ❤️ by <strong>Muhammad Arinal Haq</strong> · © 2026 arhaq.dev</sub>
</div>
