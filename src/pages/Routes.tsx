import { useState, useMemo } from "react";
import { Search, MapPin, Clock, TrendingUp, Calendar } from "lucide-react";
import { treks, Trek } from "@/data/treks";
import ScrollReveal from "@/components/ScrollReveal";

const difficulties = ["All", "Easy", "Moderate", "Difficult", "Challenging"] as const;
const regions = ["All", ...Array.from(new Set(treks.map((t) => t.region)))];

const difficultyColor: Record<string, string> = {
  Easy: "bg-trek-moss/15 text-trek-moss",
  Moderate: "bg-trek-sky/15 text-trek-sky",
  Difficult: "bg-trek-sunrise/15 text-trek-sunrise",
  Challenging: "bg-destructive/15 text-destructive",
};

const Routes = () => {
  const [query, setQuery] = useState("");
  const [difficulty, setDifficulty] = useState<string>("All");
  const [region, setRegion] = useState<string>("All");
  const [expanded, setExpanded] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return treks.filter((t) => {
      const matchesQuery = t.name.toLowerCase().includes(query.toLowerCase()) || t.region.toLowerCase().includes(query.toLowerCase());
      const matchesDiff = difficulty === "All" || t.difficulty === difficulty;
      const matchesRegion = region === "All" || t.region === region;
      return matchesQuery && matchesDiff && matchesRegion;
    });
  }, [query, difficulty, region]);

  return (
    <main className="pt-24 pb-16">
      <div className="container mx-auto px-4">
        <ScrollReveal>
          <h1 className="text-balance mb-2">Trek Routes in India</h1>
          <p className="text-muted-foreground text-lg mb-8 max-w-xl">
            Search, filter, and find the perfect trek for your next adventure.
          </p>
        </ScrollReveal>

        {/* Search & Filters */}
        <ScrollReveal delay={100}>
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search by trek name or region…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-input bg-card text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring transition"
              />
            </div>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="px-4 py-3 rounded-lg border border-input bg-card text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              {difficulties.map((d) => (
                <option key={d} value={d}>{d === "All" ? "All Difficulties" : d}</option>
              ))}
            </select>
            <select
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              className="px-4 py-3 rounded-lg border border-input bg-card text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              {regions.map((r) => (
                <option key={r} value={r}>{r === "All" ? "All Regions" : r}</option>
              ))}
            </select>
          </div>
        </ScrollReveal>

        {/* Results */}
        <div className="space-y-4">
          {filtered.length === 0 && (
            <div className="text-center py-16 text-muted-foreground">
              No treks match your search. Try adjusting filters.
            </div>
          )}
          {filtered.map((trek, i) => (
            <ScrollReveal key={trek.id} delay={i * 60}>
              <TrekCard trek={trek} isExpanded={expanded === trek.id} onToggle={() => setExpanded(expanded === trek.id ? null : trek.id)} />
            </ScrollReveal>
          ))}
        </div>
      </div>
    </main>
  );
};

const TrekCard = ({ trek, isExpanded, onToggle }: { trek: Trek; isExpanded: boolean; onToggle: () => void }) => (
  <div className="bg-card rounded-xl border border-border shadow-sm hover:shadow-md transition-shadow overflow-hidden">
    <button
      onClick={onToggle}
      className="w-full text-left p-6 flex flex-col md:flex-row md:items-center gap-4 active:scale-[0.995] transition-transform"
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-3 mb-1.5">
          <h3 className="truncate">{trek.name}</h3>
          <span className={`shrink-0 text-xs font-medium px-2.5 py-0.5 rounded-full ${difficultyColor[trek.difficulty]}`}>
            {trek.difficulty}
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
          <span className="inline-flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{trek.region}</span>
          <span className="inline-flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{trek.duration}</span>
          <span className="inline-flex items-center gap-1"><TrendingUp className="h-3.5 w-3.5" />{trek.altitude}</span>
          <span className="inline-flex items-center gap-1"><Calendar className="h-3.5 w-3.5" />{trek.bestSeason}</span>
        </div>
      </div>
      <div className="text-sm text-primary font-medium shrink-0">
        {isExpanded ? "Collapse ▲" : "Details ▼"}
      </div>
    </button>
    {isExpanded && (
      <div className="px-6 pb-6 border-t border-border pt-4 animate-reveal" style={{ animationDuration: "0.4s" }}>
        <p className="text-sm text-foreground/85 leading-relaxed mb-4">{trek.description}</p>
        <div>
          <h4 className="font-display text-sm font-semibold mb-2">Highlights</h4>
          <ul className="grid sm:grid-cols-2 gap-x-4 gap-y-1.5">
            {trek.highlights.map((h) => (
              <li key={h} className="text-sm text-muted-foreground flex items-start gap-2">
                <span className="text-trek-moss mt-0.5">•</span> {h}
              </li>
            ))}
          </ul>
        </div>
      </div>
    )}
  </div>
);

export default Routes;
