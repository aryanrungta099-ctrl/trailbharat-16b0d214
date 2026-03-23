import { useState, useEffect, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Mountain, Send, ArrowLeft, MapPin, Clock, TrendingUp, Star, Loader2, Filter, X, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { treks } from "@/data/treks";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import ReactMarkdown from "react-markdown";

type Msg = { role: "user" | "assistant"; content: string };

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;

const difficulties = ["Easy", "Moderate", "Difficult", "Very Difficult"] as const;
const countries = [...new Set(treks.map(t => t.state.includes("Nepal") ? "Nepal" : "India"))].sort();
const regions = [...new Set(treks.map(t => t.region))].sort();
const durationRanges = [
  { label: "1-3 days", min: 1, max: 3 },
  { label: "4-7 days", min: 4, max: 7 },
  { label: "8-14 days", min: 8, max: 14 },
  { label: "15+ days", min: 15, max: 999 },
];

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

  // Filters
  const [showFilters, setShowFilters] = useState(false);
  const [filterDifficulty, setFilterDifficulty] = useState<string>("");
  const [filterCountry, setFilterCountry] = useState<string>("");
  const [filterRegion, setFilterRegion] = useState<string>("");
  const [filterDuration, setFilterDuration] = useState<string>("");

  const activeFilterCount = [filterDifficulty, filterCountry, filterRegion, filterDuration].filter(Boolean).length;

  const clearFilters = () => {
    setFilterDifficulty("");
    setFilterCountry("");
    setFilterRegion("");
    setFilterDuration("");
  };

  useEffect(() => {
    if (!user) return;
    supabase.from("profiles").select("*").eq("user_id", user.id).maybeSingle()
      .then(({ data }) => { if (data) setProfile(data); });
  }, [user]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const filtered = useMemo(() => {
    let result = treks;

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(t =>
        t.name.toLowerCase().includes(q) ||
        t.region.toLowerCase().includes(q) ||
        t.state.toLowerCase().includes(q)
      );
    }

    if (filterDifficulty) {
      result = result.filter(t => t.difficulty === filterDifficulty);
    }

    if (filterCountry) {
      result = result.filter(t => {
        const isNepal = t.state.includes("Nepal");
        return filterCountry === "Nepal" ? isNepal : !isNepal;
      });
    }

    if (filterRegion) {
      result = result.filter(t => t.region === filterRegion);
    }

    if (filterDuration) {
      const range = durationRanges.find(r => r.label === filterDuration);
      if (range) {
        result = result.filter(t => t.durationDays >= range.min && t.durationDays <= range.max);
      }
    }

    return result.slice(0, 30);
  }, [search, filterDifficulty, filterCountry, filterRegion, filterDuration]);

  const selectTrek = (trek: typeof treks[0]) => {
    setSelectedTrek(trek);
    const profileInfo = profile
      ? `\nUser profile: Age ${profile.age || "unknown"}, Height ${profile.height_cm || "unknown"}cm, Weight ${profile.weight_kg || "unknown"}kg, Health: ${profile.health_conditions || "none reported"}.`
      : "";
    const systemMsg: Msg = {
      role: "assistant",
      content: `Great choice! You've selected **${trek.name}**.\n\nI'm your trek preparation assistant. Let me ask you a few questions to make sure you're ready.\n\n**1. Have you done any high-altitude trekking before? If yes, what was the highest altitude?**`
    };
    setMessages([systemMsg]);
  };

  const sendMessageWithMessages = async (newMessages: Msg[]) => {
    if (!selectedTrek) return;
    setLoading(true);

    let assistantText = "";
    const updateAssistant = (chunk: string) => {
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

  const sendMessage = async () => {
    if (!input.trim() || loading || !selectedTrek) return;
    const userMsg: Msg = { role: "user", content: input };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    await sendMessageWithMessages(newMessages);
  };

  if (!selectedTrek) {
    return (
      <main className="min-h-screen bg-background pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-3xl">
          <h1 className="text-3xl font-serif font-bold flex items-center gap-3 mb-2">
            <Mountain className="h-8 w-8 text-primary" /> Start Trekking
          </h1>
          <p className="text-muted-foreground mb-6">Select a trek to get personalized preparation guidance from our AI assistant.</p>

          {/* Search */}
          <input
            type="text"
            placeholder="Search treks by name, region, or state..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border-2 border-primary/30 bg-card text-foreground mb-4 focus:outline-none focus:ring-2 focus:ring-primary"
          />

          {/* Filter toggle */}
          <div className="flex items-center gap-3 mb-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition-all ${showFilters ? "bg-primary text-primary-foreground border-primary" : "bg-card border-border text-foreground hover:border-primary/50"}`}
            >
              <Filter className="h-4 w-4" />
              Filters
              {activeFilterCount > 0 && (
                <span className="bg-primary-foreground text-primary rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                  {activeFilterCount}
                </span>
              )}
            </button>
            {activeFilterCount > 0 && (
              <button onClick={clearFilters} className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
                <X className="h-3 w-3" /> Clear all
              </button>
            )}
            <span className="text-sm text-muted-foreground ml-auto">{filtered.length} treks found</span>
          </div>

          {/* Filter panel */}
          {showFilters && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6 p-4 bg-muted/50 rounded-xl border border-border animate-in fade-in slide-in-from-top-2 duration-200">
              <div>
                <label className="text-xs font-semibold text-muted-foreground mb-1 block">Difficulty</label>
                <select
                  value={filterDifficulty}
                  onChange={e => setFilterDifficulty(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-border bg-card text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">All</option>
                  {difficulties.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground mb-1 block">Country</label>
                <select
                  value={filterCountry}
                  onChange={e => setFilterCountry(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-border bg-card text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">All</option>
                  {countries.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground mb-1 block">Region</label>
                <select
                  value={filterRegion}
                  onChange={e => setFilterRegion(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-border bg-card text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">All</option>
                  {regions.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground mb-1 block">Duration</label>
                <select
                  value={filterDuration}
                  onChange={e => setFilterDuration(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-border bg-card text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">All</option>
                  {durationRanges.map(r => <option key={r.label} value={r.label}>{r.label}</option>)}
                </select>
              </div>
            </div>
          )}

          {/* Trek list */}
          <div className="grid gap-3">
            {filtered.length === 0 && (
              <p className="text-center text-muted-foreground py-8">No treks match your filters. Try adjusting them.</p>
            )}
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
                    <ReactMarkdown>{msg.content.replace(/\*\*\[PREP_COMPLETE\]\*\*/g, "")}</ReactMarkdown>
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

        {/* Show "View Trek Details" when prep is complete */}
        {messages.some(m => m.role === "assistant" && m.content.includes("[PREP_COMPLETE]")) ? (
          <div className="flex flex-col items-center gap-3 pb-6 pt-2">
            <p className="text-sm text-muted-foreground">✅ You're all prepped! View the full trek details below.</p>
            <Link
              to={`/trek/${selectedTrek.id}`}
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-primary text-primary-foreground font-semibold text-base shadow-lg hover:shadow-xl transition-all active:scale-[0.97] hover:bg-primary/90"
            >
              <Mountain className="h-5 w-5" /> View Trek Details <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        ) : (
          <div className="pb-4 space-y-3">
            {/* Clickable option buttons */}
            {!loading && (() => {
              const lastAssistant = [...messages].reverse().find(m => m.role === "assistant");
              if (!lastAssistant) return null;
              const optionRegex = /(?:^|\n)\s*[A-E]\)\s+(.+)/g;
              const options: { letter: string; text: string }[] = [];
              let match;
              const content = lastAssistant.content;
              const lineRegex = /(?:^|\n)\s*([A-E])\)\s+(.+)/g;
              while ((match = lineRegex.exec(content)) !== null) {
                options.push({ letter: match[1], text: match[2].trim() });
              }
              if (options.length === 0) return null;
              return (
                <div className="space-y-2">
                  {options.map(opt => (
                    <button
                      key={opt.letter}
                      onClick={() => {
                        setInput(`${opt.letter}) ${opt.text}`);
                        setTimeout(() => {
                          const userMsg: Msg = { role: "user", content: `${opt.letter}) ${opt.text}` };
                          const newMessages = [...messages, userMsg];
                          setMessages(newMessages);
                          setInput("");
                          sendMessageWithMessages(newMessages);
                        }, 50);
                      }}
                      className="w-full text-left p-4 rounded-xl border border-border hover:border-primary/30 hover:bg-muted/50 transition-all active:scale-[0.98]"
                    >
                      <div className="font-medium text-sm">
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold mr-2">{opt.letter}</span>
                        {opt.text}
                      </div>
                    </button>
                  ))}
                </div>
              );
            })()}
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && sendMessage()}
                placeholder="Type your answer or pick an option above..."
                className="flex-1 px-4 py-3 rounded-xl border border-border bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm"
              />
              <button onClick={sendMessage} disabled={loading || !input.trim()} className="px-4 py-3 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition-colors">
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default StartTrekking;
