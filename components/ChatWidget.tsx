"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

type Msg = { role: "user" | "model"; text: string };

const GREETING: Msg = {
  role: "model",
  text: "Hi! I'm the Noblesoft assistant. Ask me about our practices, staff augmentation, industries, or how to get in touch.",
};

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([GREETING]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, open]);

  // close on outside click / Escape
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent | TouchEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("touchstart", onDown, { passive: true });
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("touchstart", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  async function send() {
    const q = input.trim();
    if (!q || busy) return;
    const next = [...messages, { role: "user" as const, text: q }];
    setMessages(next);
    setInput("");
    setBusy(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // send only the dialogue turns (skip the canned greeting)
        body: JSON.stringify({ messages: next.slice(1) }),
      });
      const data = await res.json();
      setMessages((m) => [
        ...m,
        { role: "model", text: res.ok ? data.reply : data.error || "Something went wrong." },
      ]);
    } catch {
      setMessages((m) => [...m, { role: "model", text: "I couldn't reach the server. Please use the contact form." }]);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div ref={rootRef}>
      {/* Launcher */}
      <div className={`fixed bottom-5 right-5 z-[70] ${open ? "" : "anim-bob"}`}>
        {/* pulsing rings */}
        {!open && (
          <>
            <span className="absolute inset-0 rounded-full anim-pulse-ring bg-brand/50" />
            <span className="absolute inset-0 rounded-full anim-pulse-ring bg-accent/40" style={{ animationDelay: "1.3s" }} />
          </>
        )}
        <button
          onClick={() => setOpen((o) => !o)}
          aria-label={open ? "Close chat" : "Chat with us"}
          className="relative h-16 w-16 grid place-items-center rounded-full text-white shadow-[0_20px_60px_-10px_rgba(242,106,27,0.65)] transition-transform hover:scale-105 active:scale-95"
          style={{ background: "radial-gradient(120% 120% at 30% 25%, #FF9A4A, #F47C20 45%, #D5620C 100%)" }}
        >
          <span className="text-2xl leading-none">{open ? "✕" : "💬"}</span>
          {!open && (
            <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-[#2FB57F] ring-2 ring-[color:var(--background)] anim-blink" />
          )}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.97 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="fixed bottom-24 right-5 z-[70] w-[min(92vw,380px)] h-[min(70vh,560px)] flex flex-col rounded-2xl overflow-hidden border border-line-blue/60 bg-surface shadow-[0_40px_120px_-20px_rgba(0,0,0,0.9)]"
          >
            <div className="flex items-center gap-3 px-4 py-3.5 border-b border-line bg-surface-2">
              <span className="h-8 w-8 grid place-items-center rounded-lg bg-brand text-white font-display font-bold text-sm">N</span>
              <div className="min-w-0">
                <p className="text-sm font-medium text-ink leading-tight">Noblesoft assistant</p>
                <p className="text-[11px] text-graphite">Answers about Noblesoft only</p>
              </div>
            </div>

            <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed whitespace-pre-wrap ${
                      m.role === "user"
                        ? "bg-brand text-white rounded-br-sm"
                        : "bg-surface-2 text-ink/90 border border-line rounded-bl-sm"
                    }`}
                  >
                    {m.text}
                  </div>
                </div>
              ))}
              {busy && (
                <div className="flex justify-start">
                  <div className="bg-surface-2 border border-line rounded-2xl rounded-bl-sm px-3.5 py-2.5">
                    <span className="inline-flex gap-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-graphite anim-float" style={{ animationDuration: "1s" }} />
                      <span className="h-1.5 w-1.5 rounded-full bg-graphite anim-float" style={{ animationDuration: "1s", animationDelay: "0.15s" }} />
                      <span className="h-1.5 w-1.5 rounded-full bg-graphite anim-float" style={{ animationDuration: "1s", animationDelay: "0.3s" }} />
                    </span>
                  </div>
                </div>
              )}
            </div>

            <form
              onSubmit={(e) => { e.preventDefault(); send(); }}
              className="p-3 border-t border-line flex items-center gap-2"
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about Noblesoft…"
                className="flex-1 bg-surface-2 border border-line rounded-full px-4 py-2.5 text-sm text-ink placeholder:text-graphite/60 focus:border-brand focus:outline-none"
              />
              <button
                type="submit"
                disabled={busy || !input.trim()}
                className="h-10 w-10 grid place-items-center rounded-full bg-brand text-white hover:bg-brand-deep transition-colors disabled:opacity-40"
                aria-label="Send"
              >
                ↑
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
