import { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, MapPin, Clock, TrendingUp, Calendar, ChevronDown, ChevronUp, Filter, Wallet, CloudSun, Mountain, Phone, Eye, Home, AlertTriangle, Compass, GitCompareArrows, X } from "lucide-react";
import { treks, Trek, allDifficulties, allRegions, MONTHS, TrekBudget } from "@/data/treks";
import { generateBudget } from "@/data/budgets";
import { generateTrekExtras, TrekExtras } from "@/data/trekExtras";
import ScrollReveal from "@/components/ScrollReveal";
import SEOHead, { breadcrumbSchema } from "@/components/SEOHead";

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
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [showCompare, setShowCompare] = useState(false);

  const toggleCompare = (id: string) => {
    setCompareIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : prev.length < 3 ? [...prev, id] : prev);
  };

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
    <main className="pt-24 pb-16 relative">
      <SEOHead
        title="Trek Routes"
        description={`Explore ${treks.length}+ trekking routes across India & Nepal. Filter by difficulty, altitude, duration, and season.`}
        path="/routes"
        jsonLd={breadcrumbSchema([{ name: "Home", url: "/" }, { name: "Trek Routes", url: "/routes" }])}
      />
      <Link to="/suggest" className="fixed top-20 right-4 z-40 inline-flex items-center gap-2 px-4 py-2.5 rounded-lg trek-gradient text-primary-foreground font-semibold text-sm shadow-lg hover:shadow-xl active:scale-[0.97] transition-all">
        <Compass className="h-4 w-4" /> Suggest Trek
      </Link>

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
              <TrekCard trek={trek} isExpanded={expanded === trek.id} onToggle={() => setExpanded(expanded === trek.id ? null : trek.id)} isComparing={compareIds.includes(trek.id)} onCompare={() => toggleCompare(trek.id)} compareDisabled={compareIds.length >= 3 && !compareIds.includes(trek.id)} />
            </ScrollReveal>
          ))}
        </div>

        {/* Compare Bar */}
        {compareIds.length > 0 && (
          <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 bg-card border border-border rounded-xl shadow-xl px-5 py-3 flex items-center gap-4 animate-reveal" style={{ animationDuration: "0.3s" }}>
            <GitCompareArrows className="h-5 w-5 text-primary shrink-0" />
            <span className="text-sm font-medium">{compareIds.length}/3 selected</span>
            <div className="flex gap-2">
              {compareIds.map(id => {
                const t = treks.find(x => x.id === id);
                return t ? (
                  <span key={id} className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full flex items-center gap-1">
                    {t.name.slice(0, 20)}{t.name.length > 20 ? "…" : ""}
                    <button onClick={() => toggleCompare(id)} className="hover:text-destructive"><X className="h-3 w-3" /></button>
                  </span>
                ) : null;
              })}
            </div>
            <button onClick={() => setShowCompare(true)} disabled={compareIds.length < 2}
              className="px-4 py-2 rounded-lg trek-gradient text-primary-foreground text-sm font-medium active:scale-[0.97] transition-transform disabled:opacity-50 disabled:cursor-not-allowed">
              Compare
            </button>
            <button onClick={() => setCompareIds([])} className="text-xs text-muted-foreground hover:text-foreground">Clear</button>
          </div>
        )}

        {/* Compare Modal */}
        {showCompare && <CompareModal trekIds={compareIds} onClose={() => setShowCompare(false)} />}
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

const TrekCard = ({ trek, isExpanded, onToggle, isComparing, onCompare, compareDisabled }: { trek: Trek; isExpanded: boolean; onToggle: () => void; isComparing?: boolean; onCompare?: () => void; compareDisabled?: boolean }) => {
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
    <div className={`bg-card rounded-xl border shadow-sm hover:shadow-md transition-shadow overflow-hidden ${isComparing ? "border-primary ring-2 ring-primary/20" : "border-border"}`}>
      <div className="flex items-center">
        <Link to={`/trek/${trek.id}`} className="flex-1 text-left p-6 flex flex-col md:flex-row md:items-center gap-4 hover:bg-muted/30 transition-colors">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-1.5 flex-wrap">
              <h3 className="truncate group-hover:text-primary transition-colors">{trek.name}</h3>
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
            <p className="text-xs text-muted-foreground mt-2 line-clamp-2">{trek.description}</p>
          </div>
          <div className="shrink-0 flex items-center gap-2">
            <span className="text-xs text-primary font-medium">View Details →</span>
          </div>
        </Link>
        <div className="flex items-center gap-2 pr-4">
          <button onClick={onToggle} className="p-2 rounded-lg hover:bg-muted text-muted-foreground active:scale-95 transition" title="Quick preview">
            {isExpanded ? <ChevronUp className="h-5 w-5 text-primary" /> : <ChevronDown className="h-5 w-5" />}
          </button>
          {onCompare && (
            <button onClick={onCompare} disabled={compareDisabled && !isComparing}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all active:scale-[0.97] ${isComparing ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground"} disabled:opacity-40 disabled:cursor-not-allowed`}>
              <GitCompareArrows className="h-3.5 w-3.5 inline mr-1" />{isComparing ? "Selected" : "Compare"}
            </button>
          )}
        </div>
      </div>
      
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

              {/* Monthly Calendar */}
              <div className="rounded-xl border border-border p-5 bg-card">
                <h4 className="font-display text-sm font-semibold mb-3 flex items-center gap-2"><Calendar className="h-4 w-4 text-primary" /> Best Time to Go</h4>
                <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-12 gap-1.5">
                  {extras.monthlyConditions.map(mc => {
                    const bg = mc.condition === "Excellent" ? "bg-trek-moss/20 border-trek-moss/40 text-trek-moss" :
                      mc.condition === "Good" ? "bg-trek-sky/15 border-trek-sky/30 text-trek-sky" :
                      mc.condition === "Fair" ? "bg-yellow-500/15 border-yellow-500/30 text-yellow-700" :
                      mc.condition === "Poor" ? "bg-trek-sunrise/15 border-trek-sunrise/30 text-trek-sunrise" :
                      "bg-destructive/15 border-destructive/30 text-destructive";
                    return (
                      <div key={mc.month} className={`rounded-lg border p-1.5 text-center ${bg} ${mc.isBest ? "ring-2 ring-trek-moss ring-offset-1" : ""}`}>
                        <div className="text-[10px] font-bold">{mc.month}</div>
                        <div className="text-[8px] mt-0.5">{mc.tempRange}</div>
                      </div>
                    );
                  })}
                </div>
                <div className="flex flex-wrap gap-2 mt-2 text-[9px]">
                  <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-trek-moss/20 border border-trek-moss/40" /> Excellent</span>
                  <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-trek-sky/15 border border-trek-sky/30" /> Good</span>
                  <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-yellow-500/15 border border-yellow-500/30" /> Fair</span>
                  <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-trek-sunrise/15 border border-trek-sunrise/30" /> Poor</span>
                  <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-destructive/15 border border-destructive/30" /> Dangerous</span>
                </div>
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

const CompareModal = ({ trekIds, onClose }: { trekIds: string[]; onClose: () => void }) => {
  const compareTreks = trekIds.map(id => treks.find(t => t.id === id)!).filter(Boolean);
  const budgets = compareTreks.map(t => t.budget ?? generateBudget(t.country, t.durationDays, t.difficulty, t.altitudeMeters, t.name));
  const extras = compareTreks.map(t => generateTrekExtras(t.name, t.country, t.region, t.state, t.altitudeMeters, t.difficulty, t.durationDays, t.bestMonths, t.highlights, t.itinerary));

  const rows: { label: string; values: string[] }[] = [
    { label: "Region", values: compareTreks.map(t => `${t.region}, ${t.state}`) },
    { label: "Country", values: compareTreks.map(t => t.country) },
    { label: "Difficulty", values: compareTreks.map(t => t.difficulty) },
    { label: "Duration", values: compareTreks.map(t => `${t.durationDays} days`) },
    { label: "Max Altitude", values: compareTreks.map(t => `${t.altitudeMeters.toLocaleString()}m`) },
    { label: "Best Months", values: compareTreks.map(t => t.bestMonths.map(m => MONTHS[m - 1]).join(", ")) },
    { label: "Current Safety", values: extras.map(e => e.weather.safetyLevel) },
    { label: "Temperature", values: extras.map(e => e.weather.temperature) },
    { label: "Low Budget", values: budgets.map(b => b.low.total) },
    { label: "High Budget", values: budgets.map(b => b.high.total) },
    { label: "Per Day (Low)", values: budgets.map(b => b.low.perDay) },
    { label: "Wildlife Danger", values: extras.map(e => e.wildlife.dangerLevel) },
  ];

  return (
    <div className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-card rounded-2xl border border-border shadow-2xl max-w-4xl w-full max-h-[85vh] overflow-auto" onClick={e => e.stopPropagation()}>
        <div className="sticky top-0 bg-card border-b border-border p-5 flex items-center justify-between z-10">
          <h2 className="text-lg font-display font-semibold flex items-center gap-2"><GitCompareArrows className="h-5 w-5 text-primary" /> Trek Comparison</h2>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-muted active:scale-95 transition"><X className="h-5 w-5" /></button>
        </div>
        <div className="p-5">
          <table className="w-full text-sm">
            <thead>
              <tr>
                <th className="text-left py-2 px-3 text-xs uppercase tracking-wider text-muted-foreground font-medium">Stat</th>
                {compareTreks.map(t => (
                  <th key={t.id} className="text-left py-2 px-3">
                    <Link to={`/trek/${t.id}`} className="text-primary hover:underline font-semibold text-sm">{t.name}</Link>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={row.label} className={i % 2 === 0 ? "bg-muted/30" : ""}>
                  <td className="py-2.5 px-3 text-muted-foreground font-medium text-xs">{row.label}</td>
                  {row.values.map((v, j) => {
                    let highlight = "";
                    if (row.label === "Current Safety") {
                      highlight = v === "Safe" ? "text-trek-moss font-semibold" : v === "Moderate Risk" ? "text-yellow-600 font-semibold" : "text-destructive font-semibold";
                    }
                    if (row.label === "Difficulty") {
                      highlight = difficultyColor[v] || "";
                    }
                    return <td key={j} className={`py-2.5 px-3 ${highlight}`}>{v}</td>;
                  })}
                </tr>
              ))}
            </tbody>
          </table>

          {/* Monthly conditions comparison */}
          <div className="mt-6">
            <h3 className="text-sm font-semibold mb-3">Monthly Conditions</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr>
                    <th className="py-1.5 px-2 text-left text-muted-foreground">Month</th>
                    {compareTreks.map(t => <th key={t.id} className="py-1.5 px-2 text-left">{t.name.slice(0, 15)}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {MONTHS.map((month, mi) => (
                    <tr key={month} className={mi % 2 === 0 ? "bg-muted/20" : ""}>
                      <td className="py-1 px-2 font-medium">{month.slice(0, 3)}</td>
                      {extras.map((ex, j) => {
                        const mc = ex.monthlyConditions[mi];
                        const color = mc.condition === "Excellent" ? "text-trek-moss font-bold" :
                          mc.condition === "Good" ? "text-trek-sky" :
                          mc.condition === "Fair" ? "text-yellow-600" :
                          mc.condition === "Poor" ? "text-trek-sunrise" : "text-destructive";
                        return <td key={j} className={`py-1 px-2 ${color}`}>{mc.condition}</td>;
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Routes;
