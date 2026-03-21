import { useState, useMemo } from "react";
import { Search, MapPin, Clock, TrendingUp, Calendar, ChevronDown, ChevronUp, Filter } from "lucide-react";
import { treks, Trek, allDifficulties, allRegions, MONTHS } from "@/data/treks";
import ScrollReveal from "@/components/ScrollReveal";

const difficultyColor: Record<string, string> = {
  Easy: "bg-trek-moss/15 text-trek-moss",
  Moderate: "bg-trek-sky/15 text-trek-sky",
  Difficult: "bg-trek-sunrise/15 text-trek-sunrise",
  Challenging: "bg-destructive/15 text-destructive",
};

const durationRanges = [
  { label: "All Durations", min: 0, max: 999 },
  { label: "1–3 days", min: 1, max: 3 },
  { label: "4–7 days", min: 4, max: 7 },
  { label: "8–14 days", min: 8, max: 14 },
  { label: "15+ days", min: 15, max: 999 },
];

const altitudeRanges = [
  { label: "All Altitudes", min: 0, max: 99999 },
  { label: "Under 3,000m", min: 0, max: 2999 },
  { label: "3,000–4,000m", min: 3000, max: 4000 },
  { label: "4,000–5,000m", min: 4000, max: 5000 },
  { label: "5,000m+", min: 5000, max: 99999 },
];

const Routes = () => {
  const [query, setQuery] = useState("");
  const [country, setCountry] = useState<string>("All");
  const [difficulty, setDifficulty] = useState<string>("All");
  const [region, setRegion] = useState<string>("All");
  const [durationIdx, setDurationIdx] = useState(0);
  const [altitudeIdx, setAltitudeIdx] = useState(0);
  const [month, setMonth] = useState<number>(0); // 0 = all
  const [expanded, setExpanded] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(() => {
    const dur = durationRanges[durationIdx];
    const alt = altitudeRanges[altitudeIdx];
    return treks.filter((t) => {
      const q = query.toLowerCase();
      const matchQ = !q || t.name.toLowerCase().includes(q) || t.region.toLowerCase().includes(q) || t.state.toLowerCase().includes(q);
      const matchCountry = country === "All" || t.country === country;
      const matchDiff = difficulty === "All" || t.difficulty === difficulty;
      const matchRegion = region === "All" || t.region === region;
      const matchDur = t.durationDays >= dur.min && t.durationDays <= dur.max;
      const matchAlt = t.altitudeMeters >= alt.min && t.altitudeMeters <= alt.max;
      const matchMonth = month === 0 || t.bestMonths.includes(month);
      return matchQ && matchCountry && matchDiff && matchRegion && matchDur && matchAlt && matchMonth;
    });
  }, [query, country, difficulty, region, durationIdx, altitudeIdx, month]);

  const activeFilters = [country !== "All", difficulty !== "All", region !== "All", durationIdx !== 0, altitudeIdx !== 0, month !== 0].filter(Boolean).length;

  return (
    <main className="pt-24 pb-16">
      <div className="container mx-auto px-4">
        <ScrollReveal>
          <h1 className="text-balance mb-2">Trek Routes</h1>
          <p className="text-muted-foreground text-lg mb-8 max-w-xl">
            {treks.length} treks across India &amp; Nepal. Search, filter, and plan your next adventure.
          </p>
        </ScrollReveal>

        {/* Search */}
        <ScrollReveal delay={80}>
          <div className="flex gap-3 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search by name, region, or state…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-input bg-card text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring transition"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-3 rounded-lg border text-sm font-medium transition-colors active:scale-[0.97] ${showFilters ? "bg-primary text-primary-foreground border-primary" : "bg-card border-input text-foreground hover:bg-muted"}`}
            >
              <Filter className="h-4 w-4" />
              Filters
              {activeFilters > 0 && <span className="bg-accent text-accent-foreground text-xs px-1.5 rounded-full">{activeFilters}</span>}
            </button>
          </div>
        </ScrollReveal>

        {/* Filter panel */}
        {showFilters && (
          <ScrollReveal>
            <div className="bg-card rounded-xl border border-border p-5 mb-6 shadow-sm grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <FilterSelect label="Country" value={country} onChange={setCountry} options={["All", "India", "Nepal"]} />
              <FilterSelect label="Difficulty" value={difficulty} onChange={setDifficulty} options={["All", ...allDifficulties]} />
              <FilterSelect label="Region" value={region} onChange={setRegion} options={["All", ...allRegions]} />
              <FilterSelect label="Duration" value={String(durationIdx)} onChange={(v) => setDurationIdx(Number(v))} options={durationRanges.map((d, i) => ({ value: String(i), label: d.label }))} />
              <FilterSelect label="Altitude" value={String(altitudeIdx)} onChange={(v) => setAltitudeIdx(Number(v))} options={altitudeRanges.map((a, i) => ({ value: String(i), label: a.label }))} />
              <FilterSelect label="Best Month" value={String(month)} onChange={(v) => setMonth(Number(v))} options={[{ value: "0", label: "Any Month" }, ...MONTHS.map((m, i) => ({ value: String(i + 1), label: m }))]} />
              <button
                onClick={() => { setCountry("All"); setDifficulty("All"); setRegion("All"); setDurationIdx(0); setAltitudeIdx(0); setMonth(0); setQuery(""); }}
                className="text-sm text-primary font-medium hover:underline self-end pb-1"
              >
                Clear all filters
              </button>
            </div>
          </ScrollReveal>
        )}

        <p className="text-sm text-muted-foreground mb-4">{filtered.length} trek{filtered.length !== 1 ? "s" : ""} found</p>

        {/* Results */}
        <div className="space-y-4">
          {filtered.length === 0 && (
            <div className="text-center py-16 text-muted-foreground">No treks match your filters. Try adjusting.</div>
          )}
          {filtered.map((trek, i) => (
            <ScrollReveal key={trek.id} delay={Math.min(i * 40, 300)}>
              <TrekCard trek={trek} isExpanded={expanded === trek.id} onToggle={() => setExpanded(expanded === trek.id ? null : trek.id)} />
            </ScrollReveal>
          ))}
        </div>
      </div>
    </main>
  );
};

type SelOption = string | { value: string; label: string };
const FilterSelect = ({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: SelOption[] }) => (
  <div>
    <label className="block text-xs font-medium text-muted-foreground mb-1">{label}</label>
    <select value={value} onChange={(e) => onChange(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring">
      {options.map((o) => {
        const val = typeof o === "string" ? o : o.value;
        const lab = typeof o === "string" ? o : o.label;
        return <option key={val} value={val}>{lab}</option>;
      })}
    </select>
  </div>
);

const TrekCard = ({ trek, isExpanded, onToggle }: { trek: Trek; isExpanded: boolean; onToggle: () => void }) => (
  <div className="bg-card rounded-xl border border-border shadow-sm hover:shadow-md transition-shadow overflow-hidden">
    <button onClick={onToggle} className="w-full text-left p-6 flex flex-col md:flex-row md:items-center gap-4 active:scale-[0.998] transition-transform">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-3 mb-1.5 flex-wrap">
          <h3 className="truncate">{trek.name}</h3>
          <span className={`shrink-0 text-xs font-medium px-2.5 py-0.5 rounded-full ${difficultyColor[trek.difficulty]}`}>{trek.difficulty}</span>
          <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-muted text-muted-foreground">{trek.country}</span>
        </div>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
          <span className="inline-flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{trek.region}, {trek.state}</span>
          <span className="inline-flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{trek.durationDays} days</span>
          <span className="inline-flex items-center gap-1"><TrendingUp className="h-3.5 w-3.5" />{trek.altitudeMeters.toLocaleString()}m</span>
          <span className="inline-flex items-center gap-1"><Calendar className="h-3.5 w-3.5" />{trek.bestMonths.map((m) => MONTHS[m - 1]).join(", ")}</span>
        </div>
      </div>
      <div className="shrink-0">{isExpanded ? <ChevronUp className="h-5 w-5 text-primary" /> : <ChevronDown className="h-5 w-5 text-muted-foreground" />}</div>
    </button>
    {isExpanded && (
      <div className="px-6 pb-6 border-t border-border pt-4 animate-reveal" style={{ animationDuration: "0.4s" }}>
        <p className="text-sm text-foreground/85 leading-relaxed mb-5">{trek.description}</p>

        <div className="mb-5">
          <h4 className="font-display text-sm font-semibold mb-2">Highlights</h4>
          <ul className="grid sm:grid-cols-2 gap-x-4 gap-y-1.5">
            {trek.highlights.map((h) => (
              <li key={h} className="text-sm text-muted-foreground flex items-start gap-2"><span className="text-trek-moss mt-0.5">•</span> {h}</li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-display text-sm font-semibold mb-3">Day-by-Day Itinerary</h4>
          <div className="space-y-3">
            {trek.itinerary.map((day) => (
              <div key={day.day} className="flex gap-4 text-sm">
                <div className="shrink-0 w-16 text-right">
                  <span className="inline-flex items-center justify-center px-2 py-0.5 rounded bg-primary/10 text-primary font-medium text-xs">Day {day.day}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-foreground">{day.title}</div>
                  <p className="text-muted-foreground leading-relaxed mt-0.5">{day.description}</p>
                  <div className="flex gap-3 mt-1 text-xs text-trek-stone">
                    {day.distance && <span>📏 {day.distance}</span>}
                    {day.elevation && <span>⛰️ {day.elevation}</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )}
  </div>
);

export default Routes;
