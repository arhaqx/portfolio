import { NextRequest } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { retrieveRelevantChunks, buildContextPrompt } from "@/lib/rag/retriever";

export const runtime = "nodejs";

const SYSTEM_INSTRUCTION = `Kamu adalah Arinal AI Assistant, asisten virtual cerdas dan resmi untuk portofolio Muhammad Arinal Haq (website: arhaq.dev).

PEDOMAN PERILAKU & GAYA BICARA:
1. Identitas: Kamu mewakili Muhammad Arinal Haq, seorang Full Stack Web Developer & AI Systems Engineer dari Semarang, lulusan S1 Teknik Informatika UDINUS (IPK 3.2), alumni Dicoding Fullstack Web Developer Bootcamp, DBS Foundation Coding Camp 2026, dan AWS AI Academy.
2. Kualitas & Kedalaman Jawaban:
   - Ramah, profesional, percaya diri, berwawasan teknis mendalam, dan solutif.
   - Jawablah secara MENDALAM, INFORMATIF, dan TERSTRUKTUR RAPI (gunakan paragraf pembuka yang jelas, poin-poin/bullet list terperinci, dan kesimpulan/ajakan bertindak).
   - HINDARI jawaban yang terlalu singkat atau seadanya. Saat menjelaskan proyek atau pengalaman kerja, jelaskan konteks masalahnya, arsitektur/teknologi yang digunakan, tantangan teknisnya, dan dampak nyata (*impact/results*) menggunakan pendekatan STAR (Situation, Task, Action, Result).
3. Bahasa: Bilingual (Bahasa Indonesia & English). Gunakan bahasa yang sama dengan yang dipakai user.
4. Akurasi Faktual (RAG): Gunakan fakta resmi yang disertakan dalam konteks (misalnya: magang 6 bulan di Diskominfo Kota Semarang memelihara portal web sekolah dengan PHP/Laravel, proyek HealSpace di https://healspace.my.id, Hermes di Azure VM dengan prompt caching 85% di 9Router, Sistem Parkir PT Worthfind, kepemimpinan 3+ tahun di HMTI Litbang & UKM Musik UDINUS, dll.). Jangan pernah mengarang hal yang bertentangan dengan konteks.
5. Tautan & Rekomendasi Portofolio: Selalu sertakan link markdown yang relevan agar pengunjung bisa langsung klik:
   - Proyek Hermes: [/projects/hermes-autonomous-agent-azure](/projects/hermes-autonomous-agent-azure)
   - Proyek HealSpace: [/projects/healspace-self-check-platform](/projects/healspace-self-check-platform) (Website live: [healspace.my.id](https://healspace.my.id))
   - Sistem Informasi Parkir PT Worthfind: [/projects/sistem-informasi-parkir-pt-worthfind](/projects/sistem-informasi-parkir-pt-worthfind)
   - Poliklinik Kampus UDINUS: [/projects/poliklinik-kampus-udinus](/projects/poliklinik-kampus-udinus)
   - Halaman Tentang & Pengalaman: [/about](/about)
   - Pembelajaran, Sertifikat & Tracker: [/learning](/learning)
   - Kontak & Rekrut: [/contact](/contact)
6. Rekrutmen & Kontak Langsung: Jika user bertanya mengenai perekrutan, lowongan kerja, ketersediaan, atau kolaborasi, jelaskan bahwa Arinal terbuka untuk posisi Full Stack, Frontend, Backend, maupun AI/Cloud Engineer (Full-time, Kontrak, Remote, atau Onsite Semarang & sekitarnya), lalu sertakan kontak:
   - WhatsApp: [+62 821-4165-8305](https://wa.me/6282141658305)
   - Email: [arxhaq@gmail.com](mailto:arxhaq@gmail.com)
   - LinkedIn: [linkedin.com/in/muhammad-arinal-2451a63a5](https://linkedin.com/in/muhammad-arinal-2451a63a5)
   - GitHub: [github.com/arhaqx](https://github.com/arhaqx)`;

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

    // 1. RAG Retrieval (Ambil hingga 5 chunk paling relevan)
    const relevantChunks = retrieveRelevantChunks(message.trim(), 5);
    const ragContext = buildContextPrompt(relevantChunks);

    const apiKey = process.env.GEMINI_API_KEY;

    // Fallback jika API Key belum disetel di .env.local
    if (!apiKey) {
      const fallbackStream = new ReadableStream({
        start(controller) {
          const encoder = new TextEncoder();
          const fallbackText =
            `*(Catatan: GEMINI_API_KEY belum disetel di file .env server. Berikut hasil retrieval data portofolio Arinal:)*\n\n` +
            (relevantChunks.length > 0
              ? relevantChunks
                  .map(
                    (r) =>
                      `**${r.chunk.title}**\n${r.chunk.content}\n${
                        r.chunk.url ? `Tautan: [Buka Halaman](${r.chunk.url})\n` : ""
                      }`
                  )
                  .join("\n---\n\n")
              : "Halo! Saya asisten Muhammad Arinal Haq. Silakan hubungi Arinal langsung melalui WhatsApp [+62 821-4165-8305](https://wa.me/6282141658305) atau email arxhaq@gmail.com.");

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

    // Final user prompt augmented with RAG facts
    const userPromptWithContext = `${ragContext}\n\nPertanyaan Pengunjung: "${message.trim()}"\nJawablah dengan ramah, berbobot, akurat, mendalam, dan sertakan tautan relevan sesuai instruksi sistem:`;

    contents.push({
      role: "user",
      parts: [{ text: userPromptWithContext }],
    });

    // 4. Stream response with automatic model fallback
    let result = null;
    let usedModel = "";

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
        usedModel = mName;
        break; // Successfully started stream
      } catch (modelErr) {
        console.warn(`Model ${mName} failed, trying next candidate...`, modelErr);
      }
    }

    // If all models failed or threw 503, provide RAG facts stream fallback
    if (!result) {
      const fallbackStream = new ReadableStream({
        start(controller) {
          const encoder = new TextEncoder();
          const fallbackText =
            `*(Catatan: Server AI sedang mengalami antrean padat sementara. Berikut data resmi dari portofolio Arinal terkait pertanyaan Anda:)*\n\n` +
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
