import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Mountain, Send, ArrowLeft, MapPin, Clock, TrendingUp, Star, Loader2 } from "lucide-react";
import { treks } from "@/data/treks";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import ReactMarkdown from "react-markdown";

type Msg = { role: "user" | "assistant"; content: string };

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;

const StartTrekking = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedTrek, setSelectedTrek] = useState<typeof treks[0] | null>(null);
  const [search, setSearch] = useState("");
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Load user profile
  useEffect(() => {
    if (!user) return;
    supabase.from("profiles").select("*").eq("user_id", user.id).maybeSingle()
      .then(({ data }) => { if (data) setProfile(data); });
  }, [user]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const filtered = search.trim()
    ? treks.filter(t =>
        t.name.toLowerCase().includes(search.toLowerCase()) ||
        t.region.toLowerCase().includes(search.toLowerCase()) ||
        t.state.toLowerCase().includes(search.toLowerCase())
      ).slice(0, 20)
    : treks.slice(0, 20);

  const selectTrek = (trek: typeof treks[0]) => {
    setSelectedTrek(trek);
    const profileInfo = profile
      ? `\nUser profile: Age ${profile.age || "unknown"}, Height ${profile.height_cm || "unknown"}cm, Weight ${profile.weight_kg || "unknown"}kg, Health: ${profile.health_conditions || "none reported"}.`
      : "";
    const systemMsg: Msg = {
      role: "assistant",
      content: `Great choice! You've selected **${trek.name}** in ${trek.region}, ${trek.state}.\n\n**Trek Overview:**\n- 🏔️ Altitude: ${trek.altitudeMeters.toLocaleString()}m\n- ⏱️ Duration: ${trek.durationDays} days\n- 💪 Difficulty: ${trek.difficulty}\n- 🌤️ Best months: ${trek.bestMonths.join(", ")}\n\n📝 **Description:** ${trek.description}\n\nI'm your trek preparation assistant. I'll help you get ready for this trek! Let me start by asking a few questions to make sure you're prepared.\n\n**1. Have you done any high-altitude trekking before?**`
    };
    setMessages([systemMsg]);
  };

  const sendMessage = async () => {
    if (!input.trim() || loading || !selectedTrek) return;
    const userMsg: Msg = { role: "user", content: input };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    let assistantText = "";
    const updateAssistant = (chunk: string) => {
      assistantText += chunk;
      setMessages(prev => {
        const last = prev[prev.length - 1];
        if (last?.role === "assistant" && prev.length > newMessages.length) {
          return prev.map((m, i) => i === prev.length - 1 ? { ...m, content: assistantText } : m);
        }
        return [...prev.slice(0, newMessages.length), { role: "assistant", content: assistantText }];
      });
    };

    try {
      const profileInfo = profile
        ? `User: Age ${profile.age || "?"}, Height ${profile.height_cm || "?"}cm, Weight ${profile.weight_kg || "?"}kg, Health: ${profile.health_conditions || "none"}.`
        : "No health profile available.";

      const resp = await fetch(`${SUPABASE_URL}/functions/v1/trek-prep-chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          messages: newMessages.map(m => ({ role: m.role, content: m.content })),
          trekInfo: {
            name: selectedTrek.name,
            region: selectedTrek.region,
            state: selectedTrek.state,
            altitude: selectedTrek.altitudeMeters,
            duration: selectedTrek.durationDays,
            difficulty: selectedTrek.difficulty,
            bestMonths: selectedTrek.bestMonths,
            description: selectedTrek.description,
          },
          profileInfo,
        }),
      });

      if (!resp.ok || !resp.body) throw new Error("Stream failed");

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let buf = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buf += decoder.decode(value, { stream: true });

        let idx: number;
        while ((idx = buf.indexOf("\n")) !== -1) {
          let line = buf.slice(0, idx);
          buf = buf.slice(idx + 1);
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (!line.startsWith("data: ")) continue;
          const json = line.slice(6).trim();
          if (json === "[DONE]") break;
          try {
            const parsed = JSON.parse(json);
            const c = parsed.choices?.[0]?.delta?.content;
            if (c) updateAssistant(c);
          } catch {}
        }
      }
    } catch (e) {
      console.error(e);
      updateAssistant("Sorry, I encountered an error. Please try again.");
    }
    setLoading(false);
  };

  if (!selectedTrek) {
    return (
      <main className="min-h-screen bg-background pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-3xl">
          <h1 className="text-3xl font-serif font-bold flex items-center gap-3 mb-2">
            <Mountain className="h-8 w-8 text-primary" /> Start Trekking
          </h1>
          <p className="text-muted-foreground mb-8">Select a trek to get personalized preparation guidance from our AI assistant.</p>

          <input
            type="text"
            placeholder="Search treks by name, region, or state..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border-2 border-primary/30 bg-card text-foreground mb-6 focus:outline-none focus:ring-2 focus:ring-primary"
          />

          <div className="grid gap-3">
            {filtered.map(trek => (
              <button
                key={trek.id}
                onClick={() => selectTrek(trek)}
                className="flex items-center gap-4 bg-card rounded-xl border border-border p-4 hover:shadow-lg transition-all hover:border-primary/50 text-left w-full group"
              >
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Mountain className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm group-hover:text-primary transition-colors">{trek.name}</h3>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                    <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{trek.state}</span>
                    <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{trek.durationDays}d</span>
                    <span className="flex items-center gap-1"><TrendingUp className="h-3 w-3" />{trek.altitudeMeters}m</span>
                    <span className={`font-medium px-2 py-0.5 rounded-full text-[10px] ${trek.difficulty === "Easy" ? "bg-trek-moss/15 text-trek-moss" : trek.difficulty === "Moderate" ? "bg-trek-sky/15 text-trek-sky" : trek.difficulty === "Difficult" ? "bg-trek-sunrise/15 text-trek-sunrise" : "bg-destructive/15 text-destructive"}`}>{trek.difficulty}</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background pt-20 pb-4 flex flex-col">
      <div className="container mx-auto px-4 max-w-3xl flex flex-col flex-1">
        {/* Header */}
        <div className="flex items-center gap-3 py-4 border-b border-border mb-4">
          <button onClick={() => { setSelectedTrek(null); setMessages([]); }} className="p-2 rounded-md hover:bg-muted">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <Mountain className="h-6 w-6 text-primary" />
          <div>
            <h2 className="font-semibold text-sm">{selectedTrek.name}</h2>
            <p className="text-xs text-muted-foreground">{selectedTrek.region}, {selectedTrek.state} · {selectedTrek.difficulty}</p>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto space-y-4 mb-4">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm ${
                msg.role === "user"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-foreground"
              }`}>
                {msg.role === "assistant" ? (
                  <div className="prose prose-sm dark:prose-invert max-w-none">
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                  </div>
                ) : msg.content}
              </div>
            </div>
          ))}
          {loading && messages[messages.length - 1]?.role === "user" && (
            <div className="flex justify-start">
              <div className="bg-muted rounded-2xl px-4 py-3">
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="flex gap-2 pb-4">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && sendMessage()}
            placeholder="Ask about preparations, fitness, gear..."
            className="flex-1 px-4 py-3 rounded-xl border border-border bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm"
          />
          <button onClick={sendMessage} disabled={loading || !input.trim()} className="px-4 py-3 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition-colors">
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    </main>
  );
};

export default StartTrekking;
