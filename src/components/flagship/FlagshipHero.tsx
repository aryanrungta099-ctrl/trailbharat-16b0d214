import { MapPin, Clock, TrendingUp, Calendar, Mountain } from "lucide-react";
import { Trek, MONTHS } from "@/data/treks";

interface Props {
  trek: Trek;
  heroImage?: { url: string; caption: string; source: string; descUrl?: string };
  tagline?: string;
}

// COMPONENT: flagship-hero — full-bleed image, title overlay, quick-facts strip
export default function FlagshipHero({ trek, heroImage, tagline }: Props) {
  return (
    <section className="-mt-24 mb-10 relative">
      {/* Full-bleed image */}
      <div className="relative h-[58vh] min-h-[440px] max-h-[640px] w-full overflow-hidden">
        {heroImage ? (
          <img
            src={heroImage.url}
            alt={heroImage.caption}
            className="w-full h-full object-cover"
            loading="eager"
            fetchPriority="high"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-trek-moss/30 to-background" />
        )}
        {/* Darken gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/60 via-transparent to-transparent" />

        {/* Title block */}
        <div className="absolute inset-0 flex items-end pb-16 md:pb-20">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl">
              <div className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-trek-moss font-medium mb-3">
                <Mountain className="h-3.5 w-3.5" />
                {trek.region} · {trek.state}
              </div>
              <h1 className="font-display text-4xl md:text-6xl lg:text-7xl leading-[1.05] text-foreground mb-4">
                {trek.name}
              </h1>
              {tagline && (
                <p className="text-base md:text-lg text-muted-foreground italic max-w-2xl leading-relaxed">
                  {tagline}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Image credit */}
        {heroImage && (
          <a
            href={heroImage.descUrl || "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute bottom-2 right-3 text-[10px] text-foreground/50 hover:text-foreground/80 transition-colors"
          >
            📷 {heroImage.source}
          </a>
        )}
      </div>

      {/* COMPONENT: quick-facts-strip */}
      <div className="container mx-auto px-4 -mt-10 relative z-10">
        <div className="bg-card border border-border rounded-2xl shadow-lg px-4 md:px-8 py-5 grid grid-cols-2 md:grid-cols-5 gap-4 md:gap-2">
          <Fact icon={Clock} label="Duration" value={`${trek.durationDays} days`} />
          <Fact icon={TrendingUp} label="Max Altitude" value={`${trek.altitudeMeters.toLocaleString()}m`} />
          <Fact icon={Mountain} label="Difficulty" value={trek.difficulty} />
          <Fact icon={Calendar} label="Best Season" value={trek.bestMonths.slice(0, 3).map(m => MONTHS[m - 1].slice(0, 3)).join(" · ")} />
          <Fact icon={MapPin} label="Trailhead" value={trek.itinerary[0]?.townName || trek.state} />
        </div>
      </div>
    </section>
  );
}

function Fact({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div className="flex flex-col items-start md:items-center text-left md:text-center">
      <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-muted-foreground font-medium mb-1">
        <Icon className="h-3 w-3 text-trek-moss" />
        {label}
      </div>
      <div className="font-display text-sm md:text-base font-semibold text-foreground leading-tight">
        {value}
      </div>
    </div>
  );
}
