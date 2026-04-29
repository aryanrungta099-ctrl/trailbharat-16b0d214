import { Link } from "react-router-dom";
import { MapPin, TrendingUp, Clock } from "lucide-react";
import type { Trek } from "@/data/treks";

const difficultyColor: Record<string, string> = {
  Easy: "#74c69d",
  Moderate: "#c9973a",
  Difficult: "#c9973a",
  Challenging: "#e05c5c",
  Expert: "#a78bfa",
  Local: "#c9973a",
};

export default function TrekCollectionCard({ trek }: { trek: Trek }) {
  const color = difficultyColor[trek.difficulty] || difficultyColor.Moderate;

  return (
    <Link
      to={`/trek/${trek.id}`}
      className="group block glass-card glass-card-transition rounded-2xl overflow-hidden relative"
    >
      {/* Left colored bar */}
      <div className="absolute left-0 top-0 bottom-0 w-1 rounded-r" style={{ background: color }} />

      {/* Card header */}
      <div className="relative h-24 flex items-end p-4 overflow-hidden" style={{ background: `linear-gradient(135deg, ${color}15, ${color}08)` }}>
        {/* Mountain silhouette */}
        <svg className="absolute inset-0 w-full h-full opacity-[0.06]" viewBox="0 0 200 100" preserveAspectRatio="none">
          <polygon points="0,100 40,30 80,70 120,20 160,60 200,10 200,100" fill="currentColor" />
        </svg>
        <span className="relative z-10 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full" style={{ background: `${color}20`, color }}>
          {trek.difficulty}
        </span>
        <span className="relative z-10 ml-auto text-[10px] font-medium text-foreground/40 px-2 py-0.5 rounded-full bg-foreground/[0.05]">
          {trek.country === "India" ? "🇮🇳" : "🇳🇵"} {trek.country}
        </span>
      </div>

      <div className="p-4">
        <h3 className="font-display font-bold text-sm truncate group-hover:text-primary transition-colors">
          {trek.name}
        </h3>
        <p className="text-xs text-foreground/35 mt-1 flex items-center gap-1">
          <MapPin className="h-3 w-3" /> {trek.region}, {trek.state}
        </p>
        <div className="flex items-center gap-3 mt-3 text-xs text-foreground/35">
          <span className="flex items-center gap-1">
            <TrendingUp className="h-3 w-3 text-primary" />
            {trek.altitudeMeters.toLocaleString()}m
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3 text-primary" />
            {trek.durationDays}d
          </span>
        </div>
      </div>
    </Link>
  );
}
