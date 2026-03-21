import { useState, useMemo } from "react";
import { Search, MapPin, Clock, TrendingUp, Calendar, ChevronDown, ChevronUp, Filter, Wallet, CloudSun, Leaf, Mountain, Phone, Eye, Home, AlertTriangle, ShieldCheck } from "lucide-react";
import { treks, Trek, allDifficulties, allRegions, MONTHS, TrekBudget } from "@/data/treks";
import { generateBudget } from "@/data/budgets";
import { generateTrekExtras, TrekExtras } from "@/data/trekExtras";
import ScrollReveal from "@/components/ScrollReveal";

const difficultyColor: Record<string, string> = {
  Easy: "bg-trek-moss/15 text-trek-moss",
  Moderate: "bg-trek-sky/15 text-trek-sky",
  Difficult: "bg-trek-sunrise/15 text-trek-sunrise",
  Challenging: "bg-destructive/15 text-destructive",
};

const safetyColor: Record<string, string> = {
  Safe: "bg-trek-moss/15 text-trek-moss",
  "Moderate Risk": "bg-yellow-500/15 text-yellow-700",
  "High Risk": "bg-trek-sunrise/15 text-trek-sunrise",
  "Extreme Risk": "bg-destructive/15 text-destructive",
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

const CIRCUIT_KEYWORDS = ["circuit", "pass", "three passes"];
const isAdvancedTrek = (t: Trek) =>
  t.altitudeMeters >= 5000 || CIRCUIT_KEYWORDS.some((kw) => t.name.toLowerCase().includes(kw));

type Tab = "beginner" | "advanced";
type DetailTab = "overview" | "budget" | "weather" | "guesthouses" | "emergency";

const Routes = () => {
  const [tab, setTab] = useState<Tab>("beginner");
  const [query, setQuery] = useState("");
  const [country, setCountry] = useState<string>("All");
  const [difficulty, setDifficulty] = useState<string>("All");
  const [region, setRegion] = useState<string>("All");
  const [durationIdx, setDurationIdx] = useState(0);
  const [altitudeIdx, setAltitudeIdx] = useState(0);
  const [month, setMonth] = useState<number>(0);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const tabTreks = useMemo(() => {
    return tab === "beginner" ? treks.filter((t) => !isAdvancedTrek(t)) : treks.filter(isAdvancedTrek);
  }, [tab]);

  const filtered = useMemo(() => {
    const dur = durationRanges[durationIdx];
    const alt = altitudeRanges[altitudeIdx];
    return tabTreks.filter((t) => {
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
  }, [tabTreks, query, country, difficulty, region, durationIdx, altitudeIdx, month]);

  const activeFilters = [country !== "All", difficulty !== "All", region !== "All", durationIdx !== 0, altitudeIdx !== 0, month !== 0].filter(Boolean).length;
  const beginnerCount = treks.filter((t) => !isAdvancedTrek(t)).length;
  const advancedCount = treks.filter(isAdvancedTrek).length;

  return (
    <main className="pt-24 pb-16">
      <div className="container mx-auto px-4">
        <ScrollReveal>
          <h1 className="text-balance mb-2">Trek Routes</h1>
          <p className="text-muted-foreground text-lg mb-6 max-w-xl">
            {treks.length} treks across India &amp; Nepal. Search, filter, and plan your next adventure.
          </p>
        </ScrollReveal>

        {/* Tabs */}
        <ScrollReveal delay={60}>
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => { setTab("beginner"); setExpanded(null); }}
              className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all active:scale-[0.97] ${tab === "beginner" ? "trek-gradient text-primary-foreground shadow-md" : "bg-card border border-border text-muted-foreground hover:text-foreground hover:bg-muted"}`}
            >
              🥾 Beginner Routes <span className="opacity-70">({beginnerCount})</span>
            </button>
            <button
              onClick={() => { setTab("advanced"); setExpanded(null); }}
              className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all active:scale-[0.97] ${tab === "advanced" ? "trek-gradient-warm text-primary-foreground shadow-md" : "bg-card border border-border text-muted-foreground hover:text-foreground hover:bg-muted"}`}
            >
              ⛰️ Advanced Routes <span className="opacity-70">({advancedCount})</span>
            </button>
          </div>
          <p className="text-xs text-muted-foreground mb-6 -mt-3">
            {tab === "beginner" ? "Treks below 5,000m — ideal for first-timers and intermediate trekkers." : "High-altitude circuits and treks above 5,000m — for experienced trekkers."}
          </p>
        </ScrollReveal>

        {/* Search */}
        <ScrollReveal delay={80}>
          <div className="flex gap-3 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input type="text" placeholder="Search by name, region, or state…" value={query} onChange={(e) => setQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-input bg-card text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring transition" />
            </div>
            <button onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-3 rounded-lg border text-sm font-medium transition-colors active:scale-[0.97] ${showFilters ? "bg-primary text-primary-foreground border-primary" : "bg-card border-input text-foreground hover:bg-muted"}`}>
              <Filter className="h-4 w-4" /> Filters
              {activeFilters > 0 && <span className="bg-accent text-accent-foreground text-xs px-1.5 rounded-full">{activeFilters}</span>}
            </button>
          </div>
        </ScrollReveal>

        {showFilters && (
          <ScrollReveal>
            <div className="bg-card rounded-xl border border-border p-5 mb-6 shadow-sm grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <FilterSelect label="Country" value={country} onChange={setCountry} options={["All", "India", "Nepal"]} />
              <FilterSelect label="Difficulty" value={difficulty} onChange={setDifficulty} options={["All", ...allDifficulties]} />
              <FilterSelect label="Region" value={region} onChange={setRegion} options={["All", ...allRegions]} />
              <FilterSelect label="Duration" value={String(durationIdx)} onChange={(v) => setDurationIdx(Number(v))} options={durationRanges.map((d, i) => ({ value: String(i), label: d.label }))} />
              <FilterSelect label="Altitude" value={String(altitudeIdx)} onChange={(v) => setAltitudeIdx(Number(v))} options={altitudeRanges.map((a, i) => ({ value: String(i), label: a.label }))} />
              <FilterSelect label="Best Month" value={String(month)} onChange={(v) => setMonth(Number(v))} options={[{ value: "0", label: "Any Month" }, ...MONTHS.map((m, i) => ({ value: String(i + 1), label: m }))]} />
              <button onClick={() => { setCountry("All"); setDifficulty("All"); setRegion("All"); setDurationIdx(0); setAltitudeIdx(0); setMonth(0); setQuery(""); }}
                className="text-sm text-primary font-medium hover:underline self-end pb-1">Clear all filters</button>
            </div>
          </ScrollReveal>
        )}

        <p className="text-sm text-muted-foreground mb-4">{filtered.length} trek{filtered.length !== 1 ? "s" : ""} found</p>

        <div className="space-y-4">
          {filtered.length === 0 && <div className="text-center py-16 text-muted-foreground">No treks match your filters. Try adjusting.</div>}
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

const TrekCard = ({ trek, isExpanded, onToggle }: { trek: Trek; isExpanded: boolean; onToggle: () => void }) => {
  const [budgetTab, setBudgetTab] = useState<"low" | "high">("low");
  const [detailTab, setDetailTab] = useState<DetailTab>("overview");
  const budget = useMemo(() => trek.budget ?? generateBudget(trek.country, trek.durationDays, trek.difficulty, trek.altitudeMeters, trek.name), [trek]);
  const extras = useMemo(() => generateTrekExtras(trek.name, trek.country, trek.region, trek.state, trek.altitudeMeters, trek.difficulty, trek.durationDays, trek.bestMonths, trek.highlights, trek.itinerary), [trek]);

  const detailTabs: { id: DetailTab; label: string; icon: typeof CloudSun }[] = [
    { id: "overview", label: "Overview", icon: Mountain },
    { id: "weather", label: "Weather & Safety", icon: CloudSun },
    { id: "budget", label: "Budget", icon: Wallet },
    { id: "guesthouses", label: "Stays & Views", icon: Home },
    { id: "emergency", label: "Emergency", icon: Phone },
  ];

  return (
    <div className="bg-card rounded-xl border border-border shadow-sm hover:shadow-md transition-shadow overflow-hidden">
      <button onClick={onToggle} className="w-full text-left p-6 flex flex-col md:flex-row md:items-center gap-4 active:scale-[0.998] transition-transform">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-1.5 flex-wrap">
            <h3 className="truncate">{trek.name}</h3>
            <span className={`shrink-0 text-xs font-medium px-2.5 py-0.5 rounded-full ${difficultyColor[trek.difficulty]}`}>{trek.difficulty}</span>
            <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-muted text-muted-foreground">{trek.country}</span>
            <span className={`shrink-0 text-xs font-medium px-2.5 py-0.5 rounded-full ${safetyColor[extras.weather.safetyLevel]}`}>
              {extras.weather.safetyLevel === "Safe" ? "✅" : extras.weather.safetyLevel === "Moderate Risk" ? "⚠️" : "🔴"} {extras.weather.safetyLevel}
            </span>
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
          {/* Detail tabs */}
          <div className="flex gap-1.5 mb-6 overflow-x-auto pb-1">
            {detailTabs.map(dt => (
              <button key={dt.id} onClick={() => setDetailTab(dt.id)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all active:scale-[0.97] ${detailTab === dt.id ? "bg-primary text-primary-foreground shadow" : "bg-muted text-muted-foreground hover:text-foreground"}`}>
                <dt.icon className="h-3.5 w-3.5" /> {dt.label}
              </button>
            ))}
          </div>

          {detailTab === "overview" && (
            <>
              <p className="text-sm text-foreground/85 leading-relaxed mb-5">{trek.description}</p>
              <div className="mb-5">
                <h4 className="font-display text-sm font-semibold mb-2">Highlights</h4>
                <ul className="grid sm:grid-cols-2 gap-x-4 gap-y-1.5">
                  {trek.highlights.map((h) => <li key={h} className="text-sm text-muted-foreground flex items-start gap-2"><span className="text-trek-moss mt-0.5">•</span> {h}</li>)}
                </ul>
              </div>

              {/* Viewpoints */}
              <div className="mb-5">
                <h4 className="font-display text-sm font-semibold mb-2 flex items-center gap-2"><Eye className="h-4 w-4 text-primary" /> Viewpoints</h4>
                <div className="grid sm:grid-cols-2 gap-3">
                  {extras.viewpoints.map(vp => (
                    <div key={vp.name} className="bg-muted/50 rounded-lg p-3 border border-border/50">
                      <div className="font-medium text-sm">{vp.name}</div>
                      <p className="text-xs text-muted-foreground mt-1">{vp.description}</p>
                      <span className="text-xs text-primary mt-1 inline-block">🕐 {vp.bestTime}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Preparations */}
              <div className="mb-5">
                <h4 className="font-display text-sm font-semibold mb-2 flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-primary" /> Preparations</h4>
                <div className="grid sm:grid-cols-2 gap-4">
                  {extras.preparations.map(prep => (
                    <div key={prep.category} className="bg-muted/50 rounded-lg p-4 border border-border/50">
                      <div className="font-medium text-sm mb-2">{prep.category}</div>
                      <ul className="space-y-1">
                        {prep.items.map((item, i) => <li key={i} className="text-xs text-muted-foreground flex items-start gap-1.5"><Leaf className="h-3 w-3 text-trek-moss shrink-0 mt-0.5" /> {item}</li>)}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>

              {/* Itinerary */}
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
            </>
          )}

          {detailTab === "weather" && (
            <div className="space-y-5">
              {/* Weather */}
              <div className={`rounded-xl border p-5 ${safetyColor[extras.weather.safetyLevel].replace("text-", "border-").split(" ")[0]}/30 ${safetyColor[extras.weather.safetyLevel].split(" ")[0]}`}>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-display text-sm font-semibold flex items-center gap-2"><CloudSun className="h-4 w-4" /> Current Weather Conditions</h4>
                  <span className={`text-xs font-medium px-3 py-1 rounded-full ${safetyColor[extras.weather.safetyLevel]}`}>{extras.weather.safetyLevel}</span>
                </div>
                <div className="grid sm:grid-cols-2 gap-3 text-sm">
                  <div><span className="text-muted-foreground">Season:</span> <span className="font-medium">{extras.weather.currentSeason}</span></div>
                  <div><span className="text-muted-foreground">Temperature:</span> <span className="font-medium">{extras.weather.temperature}</span></div>
                  <div><span className="text-muted-foreground">Rainfall:</span> <span className="font-medium">{extras.weather.rainfall}</span></div>
                </div>
                <p className="text-sm mt-3 leading-relaxed">{extras.weather.safetyNote}</p>
              </div>

              {/* Wildlife */}
              <div className="rounded-xl border border-border p-5 bg-muted/30">
                <h4 className="font-display text-sm font-semibold mb-3 flex items-center gap-2">🐾 Wildlife & Safety</h4>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs">Danger Level:</span>
                  <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${extras.wildlife.dangerLevel === "Low" ? "bg-trek-moss/15 text-trek-moss" : extras.wildlife.dangerLevel === "Moderate" ? "bg-yellow-500/15 text-yellow-700" : "bg-destructive/15 text-destructive"}`}>
                    {extras.wildlife.dangerLevel}
                  </span>
                </div>
                <div className="mb-3">
                  <div className="text-xs text-muted-foreground mb-1">Animals you may encounter:</div>
                  <div className="flex flex-wrap gap-2">
                    {extras.wildlife.animals.map(a => <span key={a} className="text-xs bg-card border border-border rounded-full px-2.5 py-1">{a}</span>)}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground mb-1">Safety Tips:</div>
                  <ul className="space-y-1">
                    {extras.wildlife.safetyTips.map((tip, i) => <li key={i} className="text-xs text-foreground/80 flex items-start gap-1.5"><AlertTriangle className="h-3 w-3 text-yellow-600 shrink-0 mt-0.5" /> {tip}</li>)}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {detailTab === "budget" && (
            <div>
              <div className="flex gap-2 mb-4">
                <button onClick={() => setBudgetTab("low")}
                  className={`px-4 py-2 rounded-lg text-xs font-medium transition-all active:scale-[0.97] ${budgetTab === "low" ? "bg-trek-moss text-primary-foreground shadow" : "bg-muted text-muted-foreground hover:text-foreground"}`}>
                  💰 Low Budget
                </button>
                <button onClick={() => setBudgetTab("high")}
                  className={`px-4 py-2 rounded-lg text-xs font-medium transition-all active:scale-[0.97] ${budgetTab === "high" ? "bg-trek-sunrise text-primary-foreground shadow" : "bg-muted text-muted-foreground hover:text-foreground"}`}>
                  💎 High Budget
                </button>
              </div>
              <BudgetPanel data={budgetTab === "low" ? budget.low : budget.high} type={budgetTab} currency={budget.currency} />
            </div>
          )}

          {detailTab === "guesthouses" && (
            <div className="space-y-5">
              <div>
                <h4 className="font-display text-sm font-semibold mb-3 flex items-center gap-2"><Home className="h-4 w-4 text-primary" /> Recommended Guesthouses</h4>
                <div className="space-y-3">
                  {extras.guesthouses.map((gh, i) => (
                    <div key={i} className="bg-muted/50 rounded-lg p-4 border border-border/50 flex flex-col sm:flex-row sm:items-center gap-3">
                      <div className="flex-1">
                        <div className="font-medium text-sm">{gh.name}</div>
                        <div className="text-xs text-muted-foreground mt-0.5">📍 {gh.location}</div>
                        <p className="text-xs text-muted-foreground mt-1">{gh.note}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="text-sm font-medium text-primary">{gh.priceRange}</div>
                        <div className="text-xs text-muted-foreground">⭐ {gh.rating}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-display text-sm font-semibold mb-3 flex items-center gap-2"><Eye className="h-4 w-4 text-primary" /> Must-See Viewpoints</h4>
                <div className="grid sm:grid-cols-2 gap-3">
                  {extras.viewpoints.map(vp => (
                    <div key={vp.name} className="bg-muted/50 rounded-lg p-4 border border-border/50">
                      <div className="font-medium text-sm">{vp.name}</div>
                      <p className="text-xs text-muted-foreground mt-1">{vp.description}</p>
                      <span className="text-xs text-primary mt-1 inline-block">🕐 Best: {vp.bestTime}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {detailTab === "emergency" && (
            <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-5">
              <h4 className="font-display text-sm font-semibold mb-4 flex items-center gap-2 text-destructive"><Phone className="h-4 w-4" /> Emergency Information</h4>
              <div className="space-y-3 text-sm">
                <div>
                  <span className="text-muted-foreground text-xs uppercase tracking-wider">Nearest Hospital</span>
                  <p className="font-medium mt-0.5">{extras.emergency.nearestHospital}</p>
                </div>
                <div>
                  <span className="text-muted-foreground text-xs uppercase tracking-wider">Rescue Contacts</span>
                  <p className="font-medium mt-0.5">{extras.emergency.rescueContact}</p>
                </div>
                <div>
                  <span className="text-muted-foreground text-xs uppercase tracking-wider">Evacuation</span>
                  <p className="font-medium mt-0.5">{extras.emergency.evacuationRoute}</p>
                </div>
                <div>
                  <span className="text-muted-foreground text-xs uppercase tracking-wider">Emergency Tips</span>
                  <ul className="mt-1 space-y-1.5">
                    {extras.emergency.tips.map((tip, i) => (
                      <li key={i} className="text-xs text-foreground/80 flex items-start gap-2"><AlertTriangle className="h-3 w-3 text-destructive shrink-0 mt-0.5" /> {tip}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const BudgetPanel = ({ data, type, currency }: { data: TrekBudget["low"]; type: "low" | "high"; currency: string }) => (
  <div className={`rounded-xl border p-5 ${type === "low" ? "border-trek-moss/30 bg-trek-moss/5" : "border-trek-sunrise/30 bg-trek-sunrise/5"}`}>
    <div className="flex items-baseline justify-between mb-4">
      <div>
        <div className="text-xs text-muted-foreground uppercase tracking-wider font-medium mb-1">
          {type === "low" ? "Estimated Low Budget" : "Estimated High Budget"}
        </div>
        <div className="font-display text-2xl font-bold text-foreground">{data.total}</div>
      </div>
      <div className={`text-sm font-medium px-3 py-1 rounded-full ${type === "low" ? "bg-trek-moss/15 text-trek-moss" : "bg-trek-sunrise/15 text-trek-sunrise"}`}>
        {data.perDay}
      </div>
    </div>
    <div className="space-y-2 mb-4">
      {data.items.map((item) => (
        <div key={item.category} className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">{item.category}</span>
          <span className="font-medium text-foreground tabular-nums">{item.amount}</span>
        </div>
      ))}
    </div>
    <div className={`rounded-lg p-3 text-xs leading-relaxed ${type === "low" ? "bg-trek-moss/10 text-trek-moss" : "bg-trek-sunrise/10 text-trek-sunrise"}`}>
      <span className="font-semibold">💡 Tip: </span>{data.tips}
    </div>
  </div>
);

export default Routes;
