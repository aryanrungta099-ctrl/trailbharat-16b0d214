import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { Compass, ArrowRight, Shield, Users, MapPin, Sparkles } from "lucide-react";
import { treks } from "@/data/treks";

const DIFFICULTIES = ["Easy", "Moderate", "Difficult"] as const;
const DURATIONS = [
  { label: "2–4 days", min: 2, max: 4 },
  { label: "5–8 days", min: 5, max: 8 },
  { label: "9+ days", min: 9, max: 99 },
];
const REGIONS = ["Uttarakhand", "Himachal Pradesh", "Sikkim", "Ladakh", "Nepal", "West Bengal"];
const MONTH_NAMES = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

interface Props {
  trekCount: number;
  reviewCount: number;
  sherpaCount: number;
}

const DiscoveryHero = ({ trekCount, reviewCount, sherpaCount }: Props) => {
  const navigate = useNavigate();
  const currentMonth = new Date().getMonth() + 1;
  const [difficulty, setDifficulty] = useState<string | null>(null);
  const [duration, setDuration] = useState<typeof DURATIONS[number] | null>(null);
  const [season, setSeason] = useState<number>(currentMonth);
  const [region, setRegion] = useState<string | null>(null);

  const matchCount = useMemo(() => {
    return treks.filter(t => {
      if (difficulty && t.difficulty !== difficulty) return false;
      if (duration && (t.durationDays < duration.min || t.durationDays > duration.max)) return false;
      if (season && !t.bestMonths.includes(season)) return false;
      if (region) {
        if (region === "Nepal") { if (t.country !== "Nepal") return false; }
        else if (t.state !== region) return false;
      }
      return true;
    }).length;
  }, [difficulty, duration, season, region]);

  const handleFindTreks = () => {
    const params = new URLSearchParams();
    if (difficulty) params.set("difficulty", difficulty);
    if (duration) params.set("duration", duration.label);
    if (season) params.set("month", String(season));
    if (region) params.set("region", region);
    navigate(`/routes?${params.toString()}`);
  };

  return (
    <section className="relative pt-28 pb-16 md:pt-36 md:pb-24 overflow-hidden">
      {/* Subtle aurora background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] rounded-full opacity-20"
             style={{ background: "radial-gradient(circle, hsl(var(--primary) / 0.4), transparent 70%)" }} />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full opacity-15"
             style={{ background: "radial-gradient(circle, hsl(var(--accent) / 0.4), transparent 70%)" }} />
      </div>

      <div className="container relative mx-auto px-4">
        {/* Eyebrow */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5 mb-6">
          <Sparkles className="h-3.5 w-3.5 text-primary" />
          <span className="text-xs font-medium text-primary tracking-wide">
            {trekCount}+ verified Himalayan routes
          </span>
        </div>

        {/* H1 */}
        <h1 className="text-foreground max-w-4xl font-display font-light leading-[1.05]"
            style={{ fontSize: "clamp(2.5rem, 6.5vw, 5rem)" }}>
          Find your next Himalayan trek in{" "}
          <em className="italic text-primary" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            60 seconds
          </em>
        </h1>

        {/* Subhead */}
        <p className="mt-6 text-foreground/65 text-lg md:text-xl max-w-2xl font-body font-light leading-relaxed">
          {trekCount} day-by-day itineraries across India and Nepal, with AMS risk guidance
          and verified guides. Plan with confidence, trek safely.
        </p>

        {/* Discovery Card */}
        <div className="mt-10 max-w-4xl rounded-3xl border border-foreground/10 backdrop-blur-xl p-6 md:p-8"
             style={{ background: "linear-gradient(135deg, rgba(17,30,22,0.85), rgba(12,31,19,0.7))" }}>
          <div className="flex items-center gap-2 mb-5">
            <Compass className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-display font-semibold text-foreground">
              Find My Trek
            </h2>
            <span className="text-xs text-foreground/40 ml-auto tabular-nums">
              {matchCount} match{matchCount !== 1 ? "es" : ""}
            </span>
          </div>

          {/* Difficulty */}
          <div className="space-y-4">
            <div>
              <label className="text-[11px] uppercase tracking-[0.2em] text-foreground/50 font-body font-medium block mb-2">
                Difficulty
              </label>
              <div className="flex flex-wrap gap-2">
                {DIFFICULTIES.map(d => (
                  <button
                    key={d}
                    onClick={() => setDifficulty(difficulty === d ? null : d)}
                    className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                      difficulty === d
                        ? "bg-primary text-primary-foreground"
                        : "bg-foreground/5 text-foreground/70 hover:bg-foreground/10 border border-foreground/10"
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            {/* Duration */}
            <div>
              <label className="text-[11px] uppercase tracking-[0.2em] text-foreground/50 font-body font-medium block mb-2">
                Duration
              </label>
              <div className="flex flex-wrap gap-2">
                {DURATIONS.map(d => (
                  <button
                    key={d.label}
                    onClick={() => setDuration(duration?.label === d.label ? null : d)}
                    className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                      duration?.label === d.label
                        ? "bg-primary text-primary-foreground"
                        : "bg-foreground/5 text-foreground/70 hover:bg-foreground/10 border border-foreground/10"
                    }`}
                  >
                    {d.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Season */}
            <div>
              <label className="text-[11px] uppercase tracking-[0.2em] text-foreground/50 font-body font-medium block mb-2">
                Best month {season === currentMonth && <span className="text-primary normal-case tracking-normal">· current</span>}
              </label>
              <div className="flex flex-wrap gap-1.5">
                {MONTH_NAMES.map((m, i) => (
                  <button
                    key={m}
                    onClick={() => setSeason(i + 1)}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-all tabular-nums ${
                      season === i + 1
                        ? "bg-primary text-primary-foreground"
                        : "bg-foreground/5 text-foreground/60 hover:bg-foreground/10 border border-foreground/10"
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

            {/* Region */}
            <div>
              <label className="text-[11px] uppercase tracking-[0.2em] text-foreground/50 font-body font-medium block mb-2">
                Region
              </label>
              <div className="flex flex-wrap gap-2">
                {REGIONS.map(r => (
                  <button
                    key={r}
                    onClick={() => setRegion(region === r ? null : r)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all flex items-center gap-1 ${
                      region === r
                        ? "bg-primary text-primary-foreground"
                        : "bg-foreground/5 text-foreground/70 hover:bg-foreground/10 border border-foreground/10"
                    }`}
                  >
                    <MapPin className="h-3 w-3" /> {r}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* CTAs */}
          <div className="mt-7 flex flex-wrap items-center gap-3">
            <button
              onClick={handleFindTreks}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-sm trek-gradient text-primary-foreground hover-scale transition-transform"
            >
              Show {matchCount} treks <ArrowRight className="h-4 w-4" />
            </button>
            <Link
              to="/routes"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-medium text-sm text-foreground/80 hover:text-foreground border border-foreground/15 hover:border-foreground/30 transition-colors"
            >
              Browse all {trekCount} routes
            </Link>
            <Link
              to="/suggest-trek"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-medium text-sm text-primary hover:text-primary border border-primary/30 hover:border-primary/60 transition-colors"
            >
              <Sparkles className="h-3.5 w-3.5" /> AI quiz instead
            </Link>
          </div>
        </div>

        {/* Trust strip */}
        <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl">
          <TrustItem icon={Shield} value={`${trekCount}+`} label="Verified treks" />
          <TrustItem icon={Sparkles} value={`${reviewCount}+`} label="Trekker reviews" />
          <TrustItem icon={Users} value={`${sherpaCount}+`} label="Sherpas listed" />
          <TrustItem icon={MapPin} value="2 countries" label="India & Nepal" />
        </div>
      </div>
    </section>
  );
};

const TrustItem = ({ icon: Icon, value, label }: { icon: any; value: string; label: string }) => (
  <div className="flex items-center gap-3 px-4 py-3 rounded-xl border border-foreground/[0.07] bg-foreground/[0.02]">
    <Icon className="h-4 w-4 text-primary shrink-0" />
    <div>
      <div className="text-sm font-semibold text-foreground tabular-nums">{value}</div>
      <div className="text-[10px] uppercase tracking-wider text-foreground/40">{label}</div>
    </div>
  </div>
);

export default DiscoveryHero;
