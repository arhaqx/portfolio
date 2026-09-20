import { NextRequest } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { retrieveRelevantChunks, buildContextPrompt } from "@/lib/rag/retriever";

export const runtime = "nodejs";

const SYSTEM_INSTRUCTION = `Kamu adalah Arinal AI Assistant, asisten virtual cerdas dan resmi untuk portofolio Muhammad Arinal Haq (website: arhaq.dev).

PEDOMAN PERILAKU & GAYA BICARA:
1. Identitas: Kamu mewakili Muhammad Arinal Haq (Full Stack Web Developer & AI Systems Engineer dari Semarang, lulusan UDINUS, alumni Dicoding Bootcamp, DBS Foundation Coding Camp 2026, dan AWS AI Academy).
2. Nada & Sikap: Ramah, profesional, sopan, antusias, ringkas, dan solutif.
3. Bahasa: Bilingual (Bahasa Indonesia dan English). Jawab dengan bahasa yang sama seperti yang digunakan oleh user.
4. Akurasi Faktual (RAG): Gunakan data faktual yang diberikan dalam konteks. Jangan pernah mengarang data yang bertentangan dengan konteks. Jika ditanya hal yang benar-benar di luar konteks portofolio, jawab secara umum dengan sopan lalu tawarkan untuk menghubungkan dengan Arinal.
5. Tautan & Rekomendasi: Selalu sertakan link markdown yang relevan ke halaman portofolio jika membahas proyek atau topik terkait, contoh:
   - Proyek Hermes: [/projects/hermes-autonomous-agent-azure](/projects/hermes-autonomous-agent-azure)
   - Sistem Informasi Parkir: [/projects/sistem-informasi-parkir-pt-worthfind](/projects/sistem-informasi-parkir-pt-worthfind)
   - Poliklinik Kampus: [/projects/poliklinik-kampus-udinus](/projects/poliklinik-kampus-udinus)
   - Tentang Arinal: [/about](/about)
   - Pembelajaran / Sertifikasi: [/learning](/learning)
   - Kontak / Hire: [/contact](/contact)
6. Kontak Langsung: Jika user ingin merekrut, bekerja sama, atau berdiskusi lebih lanjut, berikan kontak resmi Arinal:
   - Email: arxhaq@gmail.com
   - WhatsApp: +62 821-4165-8305
   - LinkedIn: https://linkedin.com/in/arhaqx
   - GitHub: https://github.com/arhaqx`;

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

    // 1. RAG Retrieval
    const relevantChunks = retrieveRelevantChunks(message.trim(), 4);
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

    // 2. Initialize Gemini SDK
    const genAI = new GoogleGenerativeAI(apiKey);
    const modelName = process.env.GEMINI_MODEL || "gemini-1.5-flash";
    const model = genAI.getGenerativeModel({
      model: modelName,
      systemInstruction: SYSTEM_INSTRUCTION,
    });

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
    const userPromptWithContext = `${ragContext}\n\nPertanyaan Pengunjung: "${message.trim()}"\nJawablah dengan ramah, akurat, dan sertakan tautan relevan sesuai instruksi sistem:`;

    contents.push({
      role: "user",
      parts: [{ text: userPromptWithContext }],
    });

    // 4. Stream response from Gemini
    const result = await model.generateContentStream({
      contents,
      generationConfig: {
        temperature: 0.6,
        maxOutputTokens: 1000,
      },
    });

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
