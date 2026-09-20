import { KNOWLEDGE_BASE, KnowledgeChunk } from "./knowledge";

export interface RetrievedResult {
  chunk: KnowledgeChunk;
  score: number;
}

const GREETING_WORDS = new Set([
  "halo", "haloo", "halooo", "hello", "hai", "hi", "hey", "hei", 
  "pagi", "siang", "sore", "malam", "assalamualaikum", "ping", "p", 
  "tes", "test", "permisi", "oi", "bro", "bray", "kawan"
]);

/**
 * Checks if the user message is purely a greeting or small talk.
 */
export function isGreetingQuery(query: string): boolean {
  const clean = query.toLowerCase().replace(/[^\w\s]/g, "").trim();
  const tokens = clean.split(/\s+/).filter(Boolean);
  if (tokens.length === 0) return true;
  
  // If query is short (1-3 words) and consists solely of greeting words / honorifics
  const allGreetings = tokens.every(
    (t) =>
      GREETING_WORDS.has(t) ||
      t === "selamat" ||
      t === "arinal" ||
      t === "bot" ||
      t === "ai" ||
      t === "min" ||
      t === "admin"
  );
  return allGreetings && tokens.length <= 3;
}

/**
 * Normalizes input string into lowercase alphanumeric tokens.
 */
function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, " ")
    .split(/\s+/)
    .filter((token) => token.length > 1);
}

/**
 * Scores and retrieves the most relevant knowledge chunks for a given query.
 */
export function retrieveRelevantChunks(
  query: string,
  maxResults: number = 4
): RetrievedResult[] {
  // If query is just a greeting, do not retrieve heavy chunks
  if (isGreetingQuery(query)) {
    return [];
  }

  const queryTokens = tokenize(query);

  if (queryTokens.length === 0) {
    const defaults = KNOWLEDGE_BASE.filter(
      (c) => c.id === "profile_summary"
    );
    return defaults.map((chunk) => ({ chunk, score: 1 }));
  }

  const scored: RetrievedResult[] = KNOWLEDGE_BASE.map((chunk) => {
    let score = 0;
    const lowerQuery = query.toLowerCase();
    const lowerTitle = chunk.title.toLowerCase();
    const lowerContent = chunk.content.toLowerCase();

    // 1. Direct keyword array matching (high priority)
    for (const token of queryTokens) {
      for (const kw of chunk.keywords) {
        if (kw === token) {
          score += 6;
        } else if (kw.includes(token) || token.includes(kw)) {
          score += 3;
        }
      }
    }

    // 2. Title matching
    for (const token of queryTokens) {
      if (lowerTitle.includes(token)) {
        score += 4;
      }
    }

    // 3. Content matching
    for (const token of queryTokens) {
      const matches = (lowerContent.match(new RegExp(`\\b${token}`, "g")) || []).length;
      score += Math.min(matches, 4) * 1.5;
    }

    // 4. Exact phrase matching bonus
    if (lowerContent.includes(lowerQuery)) {
      score += 8;
    }

    // 5. Category intent boosts
    if (
      (lowerQuery.includes("project") || lowerQuery.includes("proyek") || lowerQuery.includes("karya") || lowerQuery.includes("bikin apa") || lowerQuery.includes("portfolio")) &&
      chunk.category === "projects"
    ) {
      score += 5;
    }
    if (
      (lowerQuery.includes("kontak") || lowerQuery.includes("contact") || lowerQuery.includes("email") || lowerQuery.includes("whatsapp") || lowerQuery.includes("hire") || lowerQuery.includes("rekrut") || lowerQuery.includes("gaji") || lowerQuery.includes("kerja") || lowerQuery.includes("onsite") || lowerQuery.includes("on site") || lowerQuery.includes("penempatan") || lowerQuery.includes("fresh graduate") || lowerQuery.includes("internship")) &&
      chunk.category === "contact"
    ) {
      score += 7;
    }
    if (
      (lowerQuery.includes("sekolah") || lowerQuery.includes("kuliah") || lowerQuery.includes("kampus") || lowerQuery.includes("bootcamp") || lowerQuery.includes("dbs") || lowerQuery.includes("dicoding") || lowerQuery.includes("sertifikat") || lowerQuery.includes("ipk") || lowerQuery.includes("skripsi") || lowerQuery.includes("indobert") || lowerQuery.includes("knn")) &&
      chunk.category === "education"
    ) {
      score += 7;
    }
    if (
      (lowerQuery.includes("organisasi") || lowerQuery.includes("kepemimpinan") || lowerQuery.includes("hmti") || lowerQuery.includes("litbang") || lowerQuery.includes("semnasti") || lowerQuery.includes("leadership") || lowerQuery.includes("sie kreatif")) &&
      chunk.category === "organization"
    ) {
      score += 7;
    }
    if (
      (lowerQuery.includes("magang") || lowerQuery.includes("internship") || lowerQuery.includes("diskominfo") || lowerQuery.includes("pengalaman")) &&
      chunk.category === "experience"
    ) {
      score += 6;
    }
    if (
      (lowerQuery.includes("musik") || lowerQuery.includes("musisi") || lowerQuery.includes("piano") || lowerQuery.includes("gitar") || lowerQuery.includes("sound") || lowerQuery.includes("audio") || lowerQuery.includes("desain") || lowerQuery.includes("fakta menarik") || lowerQuery.includes("hobi") || lowerQuery.includes("mbti") || lowerQuery.includes("entj")) &&
      (chunk.category === "interests" || chunk.category === "profile")
    ) {
      score += 8;
    }

    return { chunk, score };
  });

  // Sort by score descending
  scored.sort((a, b) => b.score - a.score);

  // If top score is 0 or very low, ensure profile_summary is included
  const topResults = scored.slice(0, maxResults);
  const hasProfile = topResults.some((r) => r.chunk.id === "profile_summary");

  if (!hasProfile && (topResults[0]?.score ?? 0) < 4) {
    const profileChunk = KNOWLEDGE_BASE.find((c) => c.id === "profile_summary");
    if (profileChunk) {
      topResults.unshift({ chunk: profileChunk, score: 2 });
    }
  }

  return topResults.slice(0, maxResults);
}

/**
 * Formats retrieved chunks into context text to be injected into LLM prompt.
 */
export function buildContextPrompt(retrieved: RetrievedResult[]): string {
  if (retrieved.length === 0) return "";

  const sections = retrieved.map(({ chunk }) => {
    const urlInfo = chunk.url ? `\n[Tautan Portofolio: https://arhaq.dev${chunk.url}]` : "";
    return `### ${chunk.title} (Kategori: ${chunk.category})${urlInfo}\n${chunk.content}`;
  });

  return `Berikut adalah data dan fakta resmi terverifikasi mengenai Muhammad Arinal Haq:\n\n${sections.join(
    "\n\n---\n\n"
  )}`;
}
