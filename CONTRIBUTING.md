# Contributing to arhaq.dev

Thank you for your interest in contributing to **arhaq.dev**! This document outlines our development workflows, coding standards, and submission guidelines.

---

## 🛠️ Development Workflow

1. **Fork or Clone the Repository:**
   ```bash
   git clone https://github.com/arhaqx/portfolio.git
   cd portfolio
   ```

2. **Create a Feature or Fix Branch:**
   Use clear, descriptive branch prefixes:
   - `feat/feature-name` for new capabilities
   - `fix/bug-description` for bug fixes
   - `docs/documentation-update` for documentation changes
   - `perf/performance-tweak` for optimizations

   ```bash
   git checkout -b feat/your-feature-name
   ```

3. **Install Dependencies & Set Environment:**
   ```bash
   npm install
   cp .env.example .env.local
   ```
   Add your `GEMINI_API_KEY` in `.env.local` to enable local RAG chatbot development.

4. **Run Dev Server & Verify:**
   ```bash
   npm run dev
   ```

5. **Build and Validate:**
   Before pushing, ensure the build passes cleanly without TypeScript or Turbopack warnings:
   ```bash
   npm run build
   ```

---

## 📝 Commit Conventions

We follow [Conventional Commits](https://www.conventionalcommits.org/):
- `feat:` A new feature or capability
- `fix:` A bug fix or layout correction
- `docs:` Documentation improvements
- `style:` Formatting, styling changes
- `refactor:` Code refactoring with no functional change
- `perf:` Performance optimizations
- `test:` Adding or updating tests

---

## 🚀 Submitting a Pull Request

1. Push your branch to GitHub:
   ```bash
   git push -u origin feat/your-feature-name
   ```
2. Open a Pull Request against the `main` branch.
3. Provide a clear summary of changes, rationale, and screenshots for visual updates.
4. Ensure all automated CI checks and builds succeed.
