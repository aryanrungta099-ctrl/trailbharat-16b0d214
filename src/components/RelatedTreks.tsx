import { Link } from "react-router-dom";
import { treks, Trek } from "@/data/treks";
import { ArrowRight, MapPin, Mountain, TrendingUp } from "lucide-react";

const DIFFICULTY_RANK: Record<string, number> = {
  Easy: 1, Local: 1, Moderate: 2, Difficult: 3, Challenging: 4, Expert: 5,
};

interface Props {
  trek: Trek;
}

/**
 * Internal-linking block surfaced on every trek page.
 * All anchors are real <a> elements (via React Router <Link>) so
 * crawlers can traverse the site even with JS disabled.
 */
const RelatedTreks = ({ trek }: Props) => {
  const others = treks.filter(t => t.id !== trek.id);
  const myRank = DIFFICULTY_RANK[trek.difficulty] || 3;

  // Similar: same difficulty band (±1), overlapping season, similar altitude (±1000m)
  const similar = others
    .filter(t => {
      const r = DIFFICULTY_RANK[t.difficulty] || 3;
      const sameRegion = t.region === trek.region || t.country === trek.country;
      const altClose = Math.abs(t.altitudeMeters - trek.altitudeMeters) <= 1000;
      const seasonOverlap = t.bestMonths.some(m => trek.bestMonths.includes(m));
      return Math.abs(r - myRank) <= 1 && altClose && seasonOverlap && sameRegion;
    })
    .slice(0, 6);

  // Same region
  const sameRegion = others
    .filter(t => t.region === trek.region && !similar.find(s => s.id === t.id))
    .slice(0, 6);

  // Next step up
  const nextStep = others
    .filter(t => {
      const r = DIFFICULTY_RANK[t.difficulty] || 3;
      return r === myRank + 1 && (t.region === trek.region || t.country === trek.country);
    })
    .slice(0, 3);

  // Easier alternatives
  const easier = others
    .filter(t => {
      const r = DIFFICULTY_RANK[t.difficulty] || 3;
      return r < myRank && (t.region === trek.region || t.country === trek.country);
    })
    .slice(0, 3);

  const Block = ({ title, items, icon }: { title: string; items: Trek[]; icon: React.ReactNode }) => {
    if (items.length === 0) return null;
    return (
      <section className="bg-card rounded-xl border border-border p-5">
        <h3 className="font-display text-base font-semibold mb-3 flex items-center gap-2">
          {icon} {title}
        </h3>
        <ul className="space-y-2">
          {items.map(t => (
            <li key={t.id}>
              <Link
                to={`/trek/${t.id}`}
                className="group flex items-center justify-between gap-3 py-1.5 text-sm hover:text-primary transition-colors"
              >
                <span className="truncate">
                  <span className="font-medium">{t.name}</span>
                  <span className="text-xs text-muted-foreground ml-2">
                    {t.region} · {t.altitudeMeters.toLocaleString()}m · {t.difficulty}
                  </span>
                </span>
                <ArrowRight className="h-3.5 w-3.5 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
            </li>
          ))}
        </ul>
      </section>
    );
  };

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Block title="Similar treks" items={similar} icon={<Mountain className="h-4 w-4 text-primary" />} />
      <Block title={`More treks in ${trek.region}`} items={sameRegion} icon={<MapPin className="h-4 w-4 text-primary" />} />
      <Block title="Good next step after this" items={nextStep} icon={<TrendingUp className="h-4 w-4 text-primary" />} />
      <Block title="Easier alternatives" items={easier} icon={<Mountain className="h-4 w-4 text-primary" />} />
    </div>
  );
};

export default RelatedTreks;
