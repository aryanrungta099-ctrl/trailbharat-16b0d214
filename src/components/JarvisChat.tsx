import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Bot, User } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { cn } from "@/lib/utils";
import hikerAiMountain from "@/assets/hiker-ai-mountain.png";

type Msg = { role: "user" | "assistant"; content: string };

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/jarvis-chat`;

const GREETINGS = [
  "Hey there, trail warrior! 🏔️ I'm HikerAI — ask me anything about trekking, altitude, gear, or safety!",
  "Welcome! I'm HikerAI, your trekking expert. Need help with altitude management or route planning? 🎒",
  "Hey explorer! HikerAI here — ready to help with trek tips, altitude sickness advice, and more! ⛰️",
];

export default function JarvisChat() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handler = () => setOpen(true);
    window.addEventListener("open-hiker-ai", handler);
    return () => window.removeEventListener("open-hiker-ai", handler);
  }, []);

  useEffect(() => {
    if (open && messages.length === 0) {
      const greeting = GREETINGS[Math.floor(Math.random() * GREETINGS.length)];
      setMessages([{ role: "assistant", content: greeting }]);
    }
    if (open) setTimeout(() => inputRef.current?.focus(), 100);
  }, [open]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const send = async () => {
    const text = input.trim();
    if (!text || isLoading) return;

    const userMsg: Msg = { role: "user", content: text };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    let assistantSoFar = "";
    const upsert = (chunk: string) => {
      assistantSoFar += chunk;
      setMessages(prev => {
        const last = prev[prev.length - 1];
        if (last?.role === "assistant" && prev.length > newMessages.length) {
          return prev.map((m, i) => i === prev.length - 1 ? { ...m, content: assistantSoFar } : m);
        }
        return [...prev.slice(0, newMessages.length), { role: "assistant", content: assistantSoFar }];
      });
    };

    try {
      const resp = await fetch(CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ messages: newMessages.filter(m => m.content) }),
      });

      if (!resp.ok) {
        const err = await resp.json().catch(() => ({ error: "Something went wrong" }));
        upsert(err.error || "Sorry, something went wrong. Try again in a moment.");
        setIsLoading(false);
        return;
      }

      const reader = resp.body?.getReader();
      if (!reader) throw new Error("No stream");
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        let idx: number;
        while ((idx = buffer.indexOf("\n")) !== -1) {
          let line = buffer.slice(0, idx);
          buffer = buffer.slice(idx + 1);
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (!line.startsWith("data: ")) continue;
          const json = line.slice(6).trim();
          if (json === "[DONE]") break;
          try {
            const parsed = JSON.parse(json);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) upsert(content);
          } catch {
            buffer = line + "\n" + buffer;
            break;
          }
        }
      }
    } catch (e) {
      console.error("Jarvis stream error:", e);
      upsert("Oops, lost connection for a moment. Give it another shot! 🔄");
    }
    setIsLoading(false);
  };

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen(!open)}
        className={cn(
          "fixed top-20 right-4 z-50 rounded-full shadow-lg transition-all duration-300",
          "w-14 h-14 flex items-center justify-center",
          open
            ? "bg-destructive text-destructive-foreground hover:bg-destructive/90 rotate-90"
            : "bg-[#111e16] text-primary hover:bg-[#172518] border border-primary/30"
        )}
        aria-label={open ? "Close HikerAI" : "Open HikerAI"}
      >
        {open ? (
          <X className="w-6 h-6" />
        ) : (
          <div className="relative flex items-center justify-center">
            <svg viewBox="0 0 40 40" className="w-9 h-9">
              <polygon points="20,6 4,34 36,34" fill="#74c69d" opacity="0.8" />
              <polygon points="20,12 12,28 28,28" fill="#c9973a" opacity="0.6" />
              <polygon points="20,16 15,24 25,24" fill="#e8dcc8" opacity="0.4" />
            </svg>
            <div className="absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full bg-primary flex items-center justify-center shadow-md border-2 border-[#0c1f13]">
              <span className="text-[8px] font-black text-primary-foreground leading-none">AI</span>
            </div>
          </div>
        )}
      </button>
      {!open && (
        <span className="fixed top-[5.75rem] right-[4.75rem] z-50 bg-[#111e16] text-primary text-xs font-semibold px-2 py-1 rounded-md shadow border border-primary/20 pointer-events-none">
          HikerAI
        </span>
      )}

      {/* Chat panel */}
      {open && (
        <div className="fixed top-40 right-4 z-50 w-[400px] max-w-[calc(100vw-2rem)] h-[520px] max-h-[calc(100vh-12rem)] rounded-2xl shadow-2xl border border-foreground/[0.07] flex flex-col overflow-hidden animate-in slide-in-from-top-4 fade-in duration-300"
          style={{ background: "#0c1f13" }}>
          {/* Header */}
          <div className="px-4 py-3 flex items-center gap-3 shrink-0 border-b border-foreground/[0.07]" style={{ background: "#111e16" }}>
            <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center">
              <Bot className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="font-display font-semibold text-sm text-foreground leading-tight">HikerAI</p>
              <p className="text-xs text-foreground/40">Your trekking expert</p>
            </div>
            <div className="ml-auto flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-xs text-foreground/40">Online</span>
            </div>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-3 space-y-3">
            {messages.map((m, i) => (
              <div key={i} className={cn("flex gap-2", m.role === "user" ? "justify-end" : "justify-start")}>
                {m.role === "assistant" && (
                  <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-1">
                    <Bot className="w-4 h-4 text-primary" />
                  </div>
                )}
                <div
                  className={cn(
                    "max-w-[80%] rounded-2xl px-3 py-2 text-sm leading-relaxed",
                    m.role === "user"
                      ? "bg-primary/20 text-foreground rounded-br-md"
                      : "rounded-bl-md text-foreground"
                  )}
                  style={m.role === "assistant" ? { background: "#172518" } : undefined}
                >
                  {m.role === "assistant" ? (
                    <div className="prose prose-sm prose-invert prose-p:my-1 prose-ul:my-1 max-w-none [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
                      <ReactMarkdown>{m.content}</ReactMarkdown>
                    </div>
                  ) : (
                    m.content
                  )}
                </div>
                {m.role === "user" && (
                  <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center shrink-0 mt-1">
                    <User className="w-4 h-4 text-primary" />
                  </div>
                )}
              </div>
            ))}
            {isLoading && messages[messages.length - 1]?.role !== "assistant" && (
              <div className="flex gap-2">
                <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4 text-primary" />
                </div>
                <div className="rounded-2xl rounded-bl-md px-4 py-3" style={{ background: "#172518" }}>
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-foreground/20 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-2 h-2 bg-foreground/20 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-2 h-2 bg-foreground/20 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="border-t border-foreground/[0.07] p-3 shrink-0">
            <form
              onSubmit={(e) => { e.preventDefault(); send(); }}
              className="flex gap-2"
            >
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask HikerAI anything..."
                className="flex-1 rounded-full border border-foreground/[0.1] bg-[#111e16] px-4 py-2 text-sm text-foreground placeholder:text-foreground/25 focus:outline-none focus:ring-2 focus:ring-primary/30"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="w-9 h-9 rounded-full bg-primary text-primary-foreground flex items-center justify-center disabled:opacity-50 hover:bg-primary/90 transition-colors active:scale-95"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
