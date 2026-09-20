"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  FiMessageSquare,
  FiX,
  FiSend,
  FiRotateCcw,
  FiCpu,
} from "react-icons/fi";
import styles from "./ChatWidget.module.scss";

const SparklesIcon = () => (
  <svg
    width="17"
    height="17"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
    <path d="M5 3v4" />
    <path d="M19 17v4" />
    <path d="M3 5h4" />
    <path d="M17 19h4" />
  </svg>
);

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

const QUICK_PROMPTS = [
  "🚀 Ceritakan proyek Hermes di Azure",
  "🛠️ Apa tech stack utama Arinal?",
  "🎓 Status DBS Coding Camp 2026",
  "📬 Kontak & Rekrut Arinal",
];

const INITIAL_MESSAGE: Message = {
  id: "welcome",
  role: "assistant",
  content:
    "Halo! 👋 Saya **Arinal AI Assistant**, asisten cerdas yang didukung teknologi **RAG (Retrieval-Augmented Generation)** dan Google Gemini.\n\nSaya siap menjawab pertanyaan seputar portofolio, proyek (seperti Hermes AI di Azure, Healspace, Parkir), pendidikan (UDINUS, Dicoding, DBS Camp), maupun opsi kolaborasi kerja dengan Muhammad Arinal Haq.\n\nApa yang ingin Anda ketahui hari ini?",
  timestamp: "",
};

function formatCurrentTime(): string {
  const now = new Date();
  return now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

/**
 * Lightweight inline markdown renderer for formatting bold, code, lists, and links.
 */
function renderFormattedContent(text: string) {
  const lines = text.split("\n");

  return lines.map((line, lineIdx) => {
    // Check if line is a bullet point
    const isBullet = line.startsWith("- ") || line.startsWith("* ");
    const cleanLine = isBullet ? line.substring(2) : line;

    // Split line into tokens for bold (**text**), code (`code`), and markdown links [text](url)
    const tokens: React.ReactNode[] = [];
    const linkRegex = /\[([^\]]+)\]\(([^)]+)\)|(\*\*[^*]+\*\*)|(`[^`]+`)/g;
    let lastIndex = 0;
    let match: RegExpExecArray | null;

    while ((match = linkRegex.exec(cleanLine)) !== null) {
      if (match.index > lastIndex) {
        tokens.push(cleanLine.substring(lastIndex, match.index));
      }

      if (match[1] && match[2]) {
        // [text](url)
        const label = match[1];
        const url = match[2];
        const isExternal = url.startsWith("http") || url.startsWith("mailto") || url.startsWith("tel");

        if (isExternal) {
          tokens.push(
            <a
              key={`link-${lineIdx}-${match.index}`}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
            >
              {label}
            </a>
          );
        } else {
          tokens.push(
            <Link key={`link-${lineIdx}-${match.index}`} href={url}>
              {label}
            </Link>
          );
        }
      } else if (match[3]) {
        // **bold**
        const boldText = match[3].slice(2, -2);
        tokens.push(
          <strong key={`b-${lineIdx}-${match.index}`}>{boldText}</strong>
        );
      } else if (match[4]) {
        // `code`
        const codeText = match[4].slice(1, -1);
        tokens.push(
          <code key={`c-${lineIdx}-${match.index}`}>{codeText}</code>
        );
      }

      lastIndex = linkRegex.lastIndex;
    }

    if (lastIndex < cleanLine.length) {
      tokens.push(cleanLine.substring(lastIndex));
    }

    if (isBullet) {
      return (
        <li key={`line-${lineIdx}`}>
          {tokens.length > 0 ? tokens : cleanLine}
        </li>
      );
    }

    // Empty line treated as spacer
    if (cleanLine.trim() === "") {
      return <div key={`empty-${lineIdx}`} style={{ height: "6px" }} />;
    }

    return (
      <p key={`p-${lineIdx}`}>
        {tokens.length > 0 ? tokens : cleanLine}
      </p>
    );
  });
}

export const ChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Initialize with initial message on client mount
  useEffect(() => {
    setMounted(true);
    setMessages([{ ...INITIAL_MESSAGE, timestamp: formatCurrentTime() }]);
  }, []);

  // Auto scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen, messages, isLoading]);

  // Handle ESC key to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  const handleSend = async (userText?: string) => {
    const query = (userText || input).trim();
    if (!query || isLoading) return;

    setInput("");

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content: query,
      timestamp: formatCurrentTime(),
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setIsLoading(true);

    const assistantMsgId = `assistant-${Date.now()}`;
    const assistantPlaceholder: Message = {
      id: assistantMsgId,
      role: "assistant",
      content: "",
      timestamp: formatCurrentTime(),
    };

    setMessages([...newMessages, assistantPlaceholder]);

    try {
      // Build history payload (role & content)
      const historyPayload = newMessages
        .filter((m) => m.id !== "welcome")
        .map((m) => ({
          role: m.role,
          content: m.content,
        }));

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: query,
          history: historyPayload,
        }),
      });

      if (!res.ok) {
        throw new Error(`Server returned error ${res.status}`);
      }

      if (!res.body) {
        throw new Error("No response body");
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let accumulated = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const textChunk = decoder.decode(value, { stream: true });
        accumulated += textChunk;

        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantMsgId ? { ...msg, content: accumulated } : msg
          )
        );
      }
    } catch (err: unknown) {
      console.error("Chat error:", err);
      const errText =
        "Maaf, terjadi gangguan saat menghubungi server AI. Anda tetap bisa melihat informasi portofolio langsung di halaman [Projects](/projects) atau menghubungi Arinal via WhatsApp [+62 821-4165-8305](https://wa.me/6282141658305).";

      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === assistantMsgId ? { ...msg, content: errText } : msg
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setMessages([{ ...INITIAL_MESSAGE, timestamp: formatCurrentTime() }]);
  };

  if (!mounted) return null;

  return (
    <div className={styles.chatWidgetContainer}>
      {/* Floating Trigger Button */}
      {!isOpen && (
        <button
          className={styles.floatingTrigger}
          onClick={() => setIsOpen(true)}
          aria-label="Tanya Arinal AI Assistant"
        >
          <div className={styles.triggerIconWrap}>
            <SparklesIcon />
          </div>
          <span className={styles.triggerLabel}>Tanya Arinal AI</span>
          <span className={styles.badgeOnline} />
        </button>
      )}

      {/* Expandable Chat Window */}
      {isOpen && (
        <div className={styles.chatWindow} role="dialog" aria-modal="true">
          {/* Header */}
          <div className={styles.chatHeader}>
            <div className={styles.headerInfo}>
              <div className={styles.avatar}>
                <FiCpu />
              </div>
              <div>
                <h3 className={styles.headerTitle}>
                  Arinal AI Assistant
                  <span className={styles.badgeOnline} />
                </h3>
                <p className={styles.headerSubtitle}>RAG Active • arhaq.dev</p>
              </div>
            </div>

            <div className={styles.headerActions}>
              <button
                className={styles.iconButton}
                onClick={handleReset}
                title="Reset Percakapan"
                aria-label="Reset Percakapan"
              >
                <FiRotateCcw size={15} />
              </button>
              <button
                className={styles.iconButton}
                onClick={() => setIsOpen(false)}
                title="Tutup Chat"
                aria-label="Tutup Chat"
              >
                <FiX size={18} />
              </button>
            </div>
          </div>

          {/* Quick Prompts */}
          <div className={styles.quickPrompts}>
            {QUICK_PROMPTS.map((prompt, idx) => (
              <button
                key={idx}
                className={styles.promptChip}
                onClick={() => handleSend(prompt)}
                disabled={isLoading}
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Messages Container */}
          <div className={styles.messagesList}>
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`${styles.messageRow} ${
                  msg.role === "user" ? styles.messageUser : styles.messageAssistant
                }`}
              >
                <div className={styles.bubble}>
                  {renderFormattedContent(msg.content)}
                </div>
                {msg.timestamp && (
                  <span
                    className={`${styles.timestamp} ${
                      msg.role === "user" ? styles.userTime : ""
                    }`}
                  >
                    {msg.timestamp}
                  </span>
                )}
              </div>
            ))}

            {isLoading && messages[messages.length - 1]?.content === "" && (
              <div className={`${styles.messageRow} ${styles.messageAssistant}`}>
                <div className={styles.typingIndicator}>
                  <span />
                  <span />
                  <span />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Box */}
          <form
            className={styles.inputForm}
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
          >
            <input
              ref={inputRef}
              type="text"
              className={styles.textInput}
              placeholder="Ketik pertanyaan atau klik topik..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isLoading}
            />
            <button
              type="submit"
              className={styles.sendButton}
              disabled={!input.trim() || isLoading}
              aria-label="Kirim Pesan"
            >
              <FiSend size={15} />
            </button>
          </form>
          <p className={styles.disclaimer}>
            Didukung oleh Google Gemini & Semantic RAG Portfolio
          </p>
        </div>
      )}
    </div>
  );
};
