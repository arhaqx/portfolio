"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  FiX,
  FiArrowUp,
  FiRotateCcw,
  FiCopy,
  FiCheck,
  FiRefreshCw,
  FiMinimize2,
  FiCornerDownLeft,
} from "react-icons/fi";
import styles from "./ChatWidget.module.scss";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

interface WelcomeSuggestion {
  title: string;
  label: string;
  prompt: string;
}

const THREAD_SUGGESTIONS: WelcomeSuggestion[] = [
  {
    title: "Proyek Hermes AI",
    label: "Arsitektur agent di Azure",
    prompt: "Ceritakan proyek Hermes Autonomous Agent di Azure",
  },
  {
    title: "Tech Stack Utama",
    label: "Next.js, TypeScript & Cloud",
    prompt: "Apa tech stack utama dan keahlian Arinal?",
  },
  {
    title: "Sertifikasi & Studi",
    label: "IBM Full-Stack & DBS Camp",
    prompt: "Jelaskan sertifikasi IBM Full-Stack JavaScript dan status DBS Coding Camp 2026",
  },
  {
    title: "Kontak & Kolaborasi",
    label: "Rekrutmen remote / on-site",
    prompt: "Bagaimana cara menghubungi dan merekrut Arinal?",
  },
];

function formatCurrentTime(): string {
  const now = new Date();
  return now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

/**
 * Minimalist geometric bot/terminal mark (no cheesy AI sparkles)
 */
const AssistantGlyph = () => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <rect x="3" y="4" width="18" height="16" rx="4" />
    <line x1="8" y1="10" x2="10" y2="12" />
    <line x1="8" y1="14" x2="10" y2="12" />
    <line x1="13" y1="14" x2="16" y2="14" />
  </svg>
);

/**
 * Dynamic Island animated waveform indicator
 */
const IslandWaveform: React.FC<{ active?: boolean }> = ({ active = false }) => (
  <span
    className={`${styles.waveform} ${active ? styles.waveformActive : ""}`}
    aria-hidden="true"
  >
    <span className={styles.waveBar} />
    <span className={styles.waveBar} />
    <span className={styles.waveBar} />
    <span className={styles.waveBar} />
  </span>
);

/**
 * Lightweight inline markdown renderer for formatting bold, code, lists, and links.
 */
function renderFormattedContent(text: string) {
  const lines = text.split("\n");

  return lines.map((line, lineIdx) => {
    const isBullet = line.startsWith("- ") || line.startsWith("* ");
    const cleanLine = isBullet ? line.substring(2) : line;

    const tokens: React.ReactNode[] = [];
    const linkRegex = /\[([^\]]+)\]\(([^)]+)\)|(\*\*[^*]+\*\*)|(`[^`]+`)/g;
    let lastIndex = 0;
    let match: RegExpExecArray | null;

    while ((match = linkRegex.exec(cleanLine)) !== null) {
      if (match.index > lastIndex) {
        tokens.push(cleanLine.substring(lastIndex, match.index));
      }

      if (match[1] && match[2]) {
        const label = match[1];
        const url = match[2];
        const isExternal =
          url.startsWith("http") ||
          url.startsWith("mailto") ||
          url.startsWith("tel");

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
        const boldText = match[3].slice(2, -2);
        tokens.push(
          <strong key={`b-${lineIdx}-${match.index}`}>{boldText}</strong>
        );
      } else if (match[4]) {
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

    if (cleanLine.trim() === "") {
      return <div key={`empty-${lineIdx}`} className={styles.paragraphSpacer} />;
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
  const [isAnimatingMorph, setIsAnimatingMorph] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [hasUnreadReply, setHasUnreadReply] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);
  const islandRef = useRef<HTMLDivElement | null>(null);
  const [viewportStyle, setViewportStyle] = useState<React.CSSProperties>({});
  const [isMac, setIsMac] = useState(false);

  useEffect(() => {
    setMounted(true);
    setIsMac(
      typeof navigator !== "undefined" &&
        /Mac|iPhone|iPod|iPad/i.test(navigator.userAgent)
    );
  }, []);

  const triggerIslandMorph = useCallback((nextOpen: boolean) => {
    setIsAnimatingMorph(true);
    setIsOpen(nextOpen);
    if (nextOpen) {
      setHasUnreadReply(false);
    }
    const timer = setTimeout(() => {
      setIsAnimatingMorph(false);
    }, 520);
    return () => clearTimeout(timer);
  }, []);

  // Global hotkey: Ctrl+K or Cmd+K to toggle AssistantModal
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        triggerIslandMorph(!isOpen);
      }
    };
    window.addEventListener("keydown", handleGlobalKeyDown);
    return () => window.removeEventListener("keydown", handleGlobalKeyDown);
  }, [isOpen, triggerIslandMorph]);

  // Lock mobile body scroll and adapt dynamically to iPhone virtual keyboard
  useEffect(() => {
    if (!isOpen) {
      setViewportStyle({});
      return;
    }

    const isMobile = window.innerWidth <= 768;
    const originalOverflow = document.body.style.overflow;

    if (isMobile) {
      document.body.style.overflow = "hidden";
    }

    const handleViewportChange = () => {
      if (window.innerWidth <= 768 && window.visualViewport) {
        const { height, offsetTop } = window.visualViewport;
        setViewportStyle({
          height: `${height}px`,
          top: `${offsetTop}px`,
          bottom: "auto",
        });
      } else {
        setViewportStyle({});
      }
    };

    if (window.visualViewport) {
      window.visualViewport.addEventListener("resize", handleViewportChange);
      window.visualViewport.addEventListener("scroll", handleViewportChange);
      handleViewportChange();
    }

    return () => {
      document.body.style.overflow = originalOverflow;
      if (window.visualViewport) {
        window.visualViewport.removeEventListener(
          "resize",
          handleViewportChange
        );
        window.visualViewport.removeEventListener(
          "scroll",
          handleViewportChange
        );
      }
    };
  }, [isOpen]);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      if (window.innerWidth > 768) {
        const focusTimer = setTimeout(() => inputRef.current?.focus(), 220);
        return () => clearTimeout(focusTimer);
      }
    }
  }, [isOpen, messages.length, isLoading, scrollToBottom]);

  // Auto-resize textarea height
  useEffect(() => {
    const el = inputRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 110)}px`;
  }, [input]);

  // Handle ESC key to collapse back to Dynamic Island pill
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        triggerIslandMorph(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, triggerIslandMorph]);

  const handleCopy = async (id: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 1800);
    } catch {
      // ignore clipboard errors
    }
  };

  const handleSend = async (userText?: string, customHistory?: Message[]) => {
    const query = (userText ?? input).trim();
    if (!query || isLoading) return;

    if (!userText) {
      setInput("");
    }

    const baseMessages = customHistory ?? messages;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content: query,
      timestamp: formatCurrentTime(),
    };

    const updatedMessages = [...baseMessages, userMessage];
    setMessages(updatedMessages);
    setIsLoading(true);

    const assistantMsgId = `assistant-${Date.now()}`;
    const assistantPlaceholder: Message = {
      id: assistantMsgId,
      role: "assistant",
      content: "",
      timestamp: formatCurrentTime(),
    };

    setMessages([...updatedMessages, assistantPlaceholder]);

    try {
      const historyPayload = updatedMessages.map((m) => ({
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

      if (!isOpen) {
        setHasUnreadReply(true);
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

  const handleRegenerate = () => {
    if (isLoading || messages.length < 2) return;
    // Find the last user message
    const lastUserIndex = [...messages]
      .map((m) => m.role)
      .lastIndexOf("user");
    if (lastUserIndex === -1) return;

    const lastUserMessage = messages[lastUserIndex];
    const historyBeforeLastTurn = messages.slice(0, lastUserIndex);
    handleSend(lastUserMessage.content, historyBeforeLastTurn);
  };

  const handleReset = () => {
    if (isLoading) return;
    setMessages([]);
    setInput("");
  };

  const handleComposerKeyDown = (
    e: React.KeyboardEvent<HTMLTextAreaElement>
  ) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!mounted) return null;

  const isEmptyThread = messages.length === 0;

  return (
    <div
      className={`${styles.assistantModalRoot} ${
        isOpen ? styles.rootOpen : styles.rootCollapsed
      }`}
    >
      {/* Mobile Backdrop */}
      <div
        className={`${styles.modalBackdrop} ${
          isOpen ? styles.backdropVisible : ""
        }`}
        onClick={() => triggerIslandMorph(false)}
        aria-hidden="true"
      />

      {/* Unified Dynamic Island Morphing Surface */}
      <div
        ref={islandRef}
        style={isOpen ? viewportStyle : undefined}
        className={[
          styles.dynamicIsland,
          isOpen ? styles.islandExpanded : styles.islandCollapsed,
          isAnimatingMorph ? styles.islandMorphing : "",
          isLoading && !isOpen ? styles.islandStreaming : "",
          hasUnreadReply && !isOpen ? styles.islandUnread : "",
        ]
          .filter(Boolean)
          .join(" ")}
        role={isOpen ? "dialog" : undefined}
        aria-modal={isOpen ? "true" : undefined}
        aria-label="Arinal AI Assistant"
      >
        {/* ============================================================
            COLLAPSED STATE: DYNAMIC ISLAND PILL TRIGGER
            ============================================================ */}
        <button
          type="button"
          className={styles.islandPillTrigger}
          onClick={() => triggerIslandMorph(true)}
          aria-label={`Buka Arinal AI Assistant (${isMac ? "Cmd+K" : "Ctrl+K"})`}
          aria-expanded={isOpen}
          tabIndex={isOpen ? -1 : 0}
        >
          <span className={styles.islandLeading}>
            {isLoading ? (
              <IslandWaveform active />
            ) : (
              <span className={styles.islandOrb}>
                <AssistantGlyph />
              </span>
            )}
          </span>

          <span className={styles.islandPillText}>
            {isLoading
              ? "Sedang menjawab..."
              : hasUnreadReply
              ? "Balasan baru tersedia"
              : "Tanya Arinal"}
          </span>

          <kbd className={styles.islandKbd}>{isMac ? "⌘K" : "Ctrl K"}</kbd>
        </button>

        {/* ============================================================
            EXPANDED STATE: ASSISTANT-UI MODAL + THREAD + COMPOSER
            ============================================================ */}
        <div
          className={styles.assistantModalContent}
          aria-hidden={!isOpen}
        >
          {/* Dynamic Island Top Notch / Modal Header */}
          <header className={styles.modalHeader}>
            <div className={styles.headerIdentity}>
              <div className={styles.islandHeaderCapsule}>
                <IslandWaveform active={isLoading} />
                <span className={styles.capsuleStatusText}>
                  {isLoading ? "Thinking..." : "RAG Active"}
                </span>
              </div>
              <div className={styles.headerTitles}>
                <h2 className={styles.headerTitle}>Arinal AI</h2>
                <span className={styles.headerDomain}>arhaq.dev</span>
              </div>
            </div>

            <div className={styles.headerControls}>
              {!isEmptyThread && (
                <button
                  type="button"
                  className={styles.headerIconBtn}
                  onClick={handleReset}
                  disabled={isLoading}
                  title="Thread Baru"
                  aria-label="Mulai percakapan baru"
                >
                  <FiRotateCcw size={14} />
                </button>
              )}
              <button
                type="button"
                className={styles.headerIconBtn}
                onClick={() => triggerIslandMorph(false)}
                title="Minimize ke Dynamic Island (Esc)"
                aria-label="Tutup jendela chat"
              >
                <FiMinimize2 size={14} className={styles.desktopMinimizeIcon} />
                <FiX size={17} className={styles.mobileCloseIcon} />
              </button>
            </div>
          </header>

          {/* ThreadPrimitive.Viewport */}
          <div
            className={styles.threadViewport}
            role="log"
            aria-live="polite"
            data-lenis-prevent
          >
            {isEmptyThread ? (
              /* ThreadPrimitive.Empty -> ThreadWelcome */
              <div className={styles.threadWelcome}>
                <div className={styles.welcomeHero}>
                  <div className={styles.welcomeAvatar}>
                    <AssistantGlyph />
                  </div>
                  <h3 className={styles.welcomeHeading}>
                    Ada yang ingin ditanyakan?
                  </h3>
                  <p className={styles.welcomeSubtext}>
                    Eksplorasi proyek, arsitektur sistem, sertifikasi, atau
                    kolaborasi dengan Muhammad Arinal Haq.
                  </p>
                </div>

                {/* ThreadWelcome.Suggestions (2x2 Grid like assistant-ui) */}
                <div className={styles.welcomeSuggestions}>
                  {THREAD_SUGGESTIONS.map((item, idx) => (
                    <button
                      key={idx}
                      type="button"
                      className={styles.suggestionCard}
                      onClick={() => handleSend(item.prompt)}
                      disabled={isLoading}
                    >
                      <span className={styles.suggestionTitle}>
                        {item.title}
                      </span>
                      <span className={styles.suggestionLabel}>
                        {item.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              /* ThreadPrimitive.Messages */
              <div className={styles.threadMessages}>
                {messages.map((msg, index) => {
                  const isWaiting =
                    msg.role === "assistant" && msg.content === "";
                  const isLastAssistant =
                    msg.role === "assistant" && index === messages.length - 1;

                  if (msg.role === "user") {
                    return (
                      <div key={msg.id} className={styles.userMessageRow}>
                        <div className={styles.userBubble}>
                          {renderFormattedContent(msg.content)}
                        </div>
                      </div>
                    );
                  }

                  return (
                    <div key={msg.id} className={styles.assistantMessageRow}>
                      <div className={styles.assistantAvatarCol}>
                        <div className={styles.assistantAvatar}>
                          <AssistantGlyph />
                        </div>
                      </div>

                      <div className={styles.assistantBodyCol}>
                        <div className={styles.assistantContent}>
                          {isWaiting ? (
                            <div className={styles.thinkingRow}>
                              <IslandWaveform active />
                              <span>Menyusun jawaban dari portofolio...</span>
                            </div>
                          ) : (
                            renderFormattedContent(msg.content)
                          )}
                        </div>

                        {/* AssistantActionBar */}
                        {!isWaiting && msg.content && (
                          <div className={styles.assistantActionBar}>
                            <button
                              type="button"
                              className={styles.actionBarBtn}
                              onClick={() => handleCopy(msg.id, msg.content)}
                              title="Salin jawaban"
                              aria-label="Salin jawaban"
                            >
                              {copiedId === msg.id ? (
                                <>
                                  <FiCheck size={12} />
                                  <span>Tersalin</span>
                                </>
                              ) : (
                                <>
                                  <FiCopy size={12} />
                                  <span>Salin</span>
                                </>
                              )}
                            </button>

                            {isLastAssistant && !isLoading && (
                              <button
                                type="button"
                                className={styles.actionBarBtn}
                                onClick={handleRegenerate}
                                title="Ulangi jawaban"
                                aria-label="Ulangi jawaban"
                              >
                                <FiRefreshCw size={12} />
                                <span>Ulangi</span>
                              </button>
                            )}

                            {msg.timestamp && (
                              <span className={styles.messageTimestamp}>
                                {msg.timestamp}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          {/* ComposerPrimitive.Root */}
          <div className={styles.composerWrapper}>
            <form
              className={styles.composerRoot}
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
            >
              <textarea
                ref={inputRef}
                rows={1}
                className={styles.composerInput}
                placeholder="Tanyakan sesuatu tentang Arinal..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleComposerKeyDown}
                disabled={isLoading}
              />

              <div className={styles.composerFooter}>
                <span className={styles.composerHint}>
                  <FiCornerDownLeft size={11} />
                  <span>Enter untuk kirim</span>
                </span>

                <button
                  type="submit"
                  className={styles.composerSendBtn}
                  disabled={!input.trim() || isLoading}
                  aria-label="Kirim pesan"
                >
                  <FiArrowUp size={16} strokeWidth={2.5} />
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
