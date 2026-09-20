import { NextRequest } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { retrieveRelevantChunks, buildContextPrompt, isGreetingQuery } from "@/lib/rag/retriever";

export const runtime = "nodejs";

const SYSTEM_INSTRUCTION = `Kamu adalah Arinal AI Assistant, asisten virtual resmi untuk portofolio Muhammad Arinal Haq (website: arhaq.dev).

PEDOMAN PERILAKU & GAYA BICARA:
1. Identitas & Status Karir:
   - Kamu mewakili Muhammad Arinal Haq, seorang Fresh Graduate S1 Teknik Informatika UDINUS (IPK 3.2), alumni Dicoding Fullstack Web Developer Bootcamp, DBS Foundation Coding Camp 2026, dan AWS AI Academy.
   - Status saat ini: Sedang aktif OPEN JOB / mencari pekerjaan, sangat memprioritaskan posisi sebagai Full Stack Developer.
   - Penempatan & Fleksibilitas: Sangat bersedia bekerja ON-SITE di mana pun (Semarang, Jakarta, maupun kota lainnya), serta terbuka untuk model Hybrid atau Remote. Sebagai fresh graduate, Arinal sangat fleksibel untuk program Internship berjenjang, namun prioritas utamanya adalah pekerjaan tetap/kontrak langsung.
2. Karakter, MBTI, & Filosofi Pribadi:
   - MBTI: ENTJ (The Commander) — visioner, logis, terstruktur, berorientasi target (goal-oriented), dan memiliki kepemimpinan alami.
   - Filosofi Belajar: Tipe orang yang belajar langsung dari lingkungan dan pengalaman nyata (*experiential learner*).
   - Etos Kerja & Integritas: Jika diberi amanah dan tanggung jawab, Arinal akan bersungguh-sungguh menjalankannya dengan komitmen penuh dan standar hasil terbaik.
3. Skripsi & Riset Akademik S1:
   - Judul Skripsi: "Analisis Sentimen Media Sosial (X) Menggunakan IndoBERT Labeling dan Metode K-Nearest Neighbour". Menggabungkan transformer IndoBERT untuk automated labeling dan algoritma KNN untuk klasifikasi sentimen teks bahasa Indonesia di platform X/Twitter.
4. Sisi Kreatif & Fakta Menarik:
   - Musisi & Audio: Arinal adalah musisi yang handal memainkan alat musik Piano dan Gitar, serta mahir dalam bidang Sound Engineering (tata suara & mixing live stage).
   - Desain Grafis & Kepemimpinan: Memiliki pengalaman desain grafis selama 3 tahun di UKM Musik UDINUS, di mana selama 2 tahunnya dipercaya memimpin langsung sebagai Koordinator / Creative Director (Sie Kreatif).

5. PRINSIP RESPON NATURAL & PROPORSIONAL (SANGAT PENTING):
   - Jawablah secara NATURAL layaknya manusia mengobrol. JANGAN pernah membeberkan informasi panjang lebar yang TIDAK diminta oleh pengguna!
   - Kategori 1 - SAPAAN / BASA-BASI (misal: "halo", "hai", "pagi", "assalamualaikum", "ping", "tes"):
     Balaslah dengan sapaan hangat, ramah, dan RINGKAS (1-2 kalimat saja). Tanyakan apa yang bisa kamu bantu. JANGAN PERNAH menumpahkan ringkasan CV, status karir, atau biografi panjang jika pengguna hanya menyapa!
   - Kategori 2 - PERTANYAAN SINGKAT / SPESIFIK (misal: "Arinal kuliah di mana?", "Berapa IPK-nya?", "Bisa on-site?", "Apa judul skripsinya?", "Bisa main alat musik apa?"):
     Jawab langsung ke intinya secara to-the-point, jelas, padat, dan ramah (1-2 kalimat atau 1 paragraf singkat). Jangan membeberkan hal lain di luar yang ditanyakan.
   - Kategori 3 - PERTANYAAN MENDALAM / MEMINTA PENJELASAN (misal: "Ceritakan proyek Hermes", "Bagaimana pengalaman magang di Diskominfo?", "Jelaskan proyek HealSpace", "Apa saja tech stack Arinal?"):
     Baru di sini kamu memberikan penjelasan komprehensif, terstruktur dengan bullet points yang rapi, dan menggunakan metode STAR (Situation, Task, Action, Result) bila membahas proyek atau pekerjaan.

6. Tautan & Rekomendasi Portofolio:
   Sertakan link markdown yang relevan hanya jika topiknya memang sedang dibahas:
   - Proyek Hermes: [/projects/hermes-autonomous-agent-azure](/projects/hermes-autonomous-agent-azure)
   - Proyek HealSpace: [/projects/healspace-self-check-platform](/projects/healspace-self-check-platform) (Website live: [healspace.my.id](https://healspace.my.id))
   - Sistem Informasi Parkir PT Worthfind: [/projects/sistem-informasi-parkir-pt-worthfind](/projects/sistem-informasi-parkir-pt-worthfind)
   - Poliklinik Kampus UDINUS: [/projects/poliklinik-kampus-udinus](/projects/poliklinik-kampus-udinus)
   - Halaman Tentang & Pengalaman: [/about](/about)
   - Pembelajaran, Sertifikat & Tracker: [/learning](/learning)
   - Kontak & Rekrut: [/contact](/contact)

7. Rekrutmen & Kontak Langsung:
   Jika pengunjung bertanya mengenai rekrutmen, interview, atau penawaran kerja, berikan email prioritas: [arxhaq@gmail.com](mailto:arxhaq@gmail.com) dan WhatsApp: [+62 821-4165-8305](https://wa.me/6282141658305), serta tautan LinkedIn [linkedin.com/in/muhammad-arinal-2451a63a5](https://linkedin.com/in/muhammad-arinal-2451a63a5).`;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { message, history = [] } = body;

    if (!message || typeof message !== "string" || !message.trim()) {
      return new Response(
        JSON.stringify({ error: "Pesan tidak boleh kosong." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const trimmedMessage = message.trim();
    const isGreeting = isGreetingQuery(trimmedMessage);

    // 1. RAG Retrieval (Hanya jalankan retrieval data jika bukan sapaan santai)
    const relevantChunks = isGreeting ? [] : retrieveRelevantChunks(trimmedMessage, 4);
    const ragContext = isGreeting ? "" : buildContextPrompt(relevantChunks);

    const apiKey = process.env.GEMINI_API_KEY;

    // Fallback jika API Key belum disetel di .env.local
    if (!apiKey) {
      const fallbackStream = new ReadableStream({
        start(controller) {
          const encoder = new TextEncoder();
          let fallbackText = "";

          if (isGreeting) {
            fallbackText =
              "Halo! Selamat datang di platform portofolio Muhammad Arinal Haq. Ada yang bisa saya bantu seputar proyek, keahlian, atau peluang kerja sama dengan Arinal hari ini?";
          } else {
            fallbackText =
              `*(Catatan: GEMINI_API_KEY belum disetel di server. Berikut hasil data portofolio Arinal:)*\n\n` +
              (relevantChunks.length > 0
                ? relevantChunks
                    .map(
                      (r) =>
                        `**${r.chunk.title}**\n${r.chunk.content}\n${
                          r.chunk.url ? `Tautan: [Buka Halaman](${r.chunk.url})\n` : ""
                        }`
                    )
                    .join("\n---\n\n")
                : "Halo! Silakan hubungi Arinal langsung melalui WhatsApp [+62 821-4165-8305](https://wa.me/6282141658305) atau email arxhaq@gmail.com.");
          }

          controller.enqueue(encoder.encode(fallbackText));
          controller.close();
        },
      });

      return new Response(fallbackStream, {
        headers: {
          "Content-Type": "text/plain; charset=utf-8",
          "Transfer-Encoding": "chunked",
        },
      });
    }

    // 2. Initialize Gemini SDK with model failover list
    const genAI = new GoogleGenerativeAI(apiKey);
    const primaryModel = process.env.GEMINI_MODEL || "gemini-3.5-flash";
    const candidateModels = Array.from(
      new Set([primaryModel, "gemini-3.5-flash-lite", "gemini-3.6-flash"])
    );

    // 3. Build contents with history and injected RAG context
    const contents: Array<{
      role: "user" | "model";
      parts: Array<{ text: string }>;
    }> = [];

    // Slice last 6 messages of history
    if (Array.isArray(history)) {
      const recentHistory = history.slice(-6);
      for (const item of recentHistory) {
        if (item.content && (item.role === "user" || item.role === "assistant" || item.role === "model")) {
          contents.push({
            role: item.role === "assistant" || item.role === "model" ? "model" : "user",
            parts: [{ text: item.content }],
          });
        }
      }
    }

    // Final user prompt: jika sapaan, jangan sertakan wall of text RAG
    let userPromptWithContext = "";
    if (isGreeting) {
      userPromptWithContext = `Pesan Pengunjung: "${trimmedMessage}". Ini adalah sapaan ramah. Balaslah sapaannya secara ramah, hangat, dan SINGKAT (1-2 kalimat saja). Sapa balik, kenalkan diri sebagai Arinal AI Assistant, dan tanyakan dengan sopan apa yang ingin diketahui seputar portofolio, proyek, atau peluang kerja sama dengan Arinal. JANGAN langsung menumpahkan biografi atau profil lengkap.`;
    } else {
      userPromptWithContext = `${ragContext}\n\nPertanyaan Pengunjung: "${trimmedMessage}"\nJawablah secara proporsional dan alami sesuai pertanyaan:`;
    }

    contents.push({
      role: "user",
      parts: [{ text: userPromptWithContext }],
    });

    // 4. Stream response with automatic model fallback
    let result = null;

    for (const mName of candidateModels) {
      try {
        const model = genAI.getGenerativeModel({
          model: mName,
          systemInstruction: SYSTEM_INSTRUCTION,
        });

        result = await model.generateContentStream({
          contents,
          generationConfig: {
            temperature: 0.65,
            maxOutputTokens: 2048,
          },
        });
        break; // Successfully started stream
      } catch (modelErr) {
        console.warn(`Model ${mName} failed, trying next candidate...`, modelErr);
      }
    }

    // If all models failed or threw 503, provide graceful fallback
    if (!result) {
      const fallbackStream = new ReadableStream({
        start(controller) {
          const encoder = new TextEncoder();
          const fallbackText = isGreeting
            ? "Halo! Selamat datang di portofolio Muhammad Arinal Haq. Ada yang bisa saya bantu seputar proyek, keahlian, atau peluang kolaborasi kerja dengan Arinal?"
            : `*(Catatan: Server AI sedang mengalami antrean padat sementara. Berikut data resmi dari portofolio Arinal terkait pertanyaan Anda:)*\n\n` +
              relevantChunks
                .map(
                  (r) =>
                    `### ${r.chunk.title}\n${r.chunk.content}\n${
                      r.chunk.url ? `[Buka Halaman Portofolio: ${r.chunk.url}](${r.chunk.url})\n` : ""
                    }`
                )
                .join("\n---\n\n");

          controller.enqueue(encoder.encode(fallbackText));
          controller.close();
        },
      });

      return new Response(fallbackStream, {
        headers: {
          "Content-Type": "text/plain; charset=utf-8",
          "Transfer-Encoding": "chunked",
        },
      });
    }

    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();
        try {
          for await (const chunk of result.stream) {
            const chunkText = chunk.text();
            if (chunkText) {
              controller.enqueue(encoder.encode(chunkText));
            }
          }
          controller.close();
        } catch (err: unknown) {
          const errorMessage = err instanceof Error ? err.message : "Error streaming response";
          controller.enqueue(
            encoder.encode(`\n\n[Terjadi kesalahan saat memproses jawaban: ${errorMessage}]`)
          );
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Transfer-Encoding": "chunked",
      },
    });
  } catch (error: unknown) {
    console.error("Chat API Error:", error);
    const errorMessage = error instanceof Error ? error.message : "Internal Server Error";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
