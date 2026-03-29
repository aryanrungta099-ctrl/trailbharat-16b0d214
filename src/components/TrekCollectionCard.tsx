import { Link } from "react-router-dom";
import { MapPin, TrendingUp, Clock, Mountain } from "lucide-react";
import type { Trek } from "@/data/treks";

const difficultyGradient: Record<string, string> = {
  Easy: "from-emerald-600 to-emerald-800",
  Moderate: "from-sky-600 to-sky-800",
  Difficult: "from-amber-600 to-amber-800",
  Challenging: "from-red-600 to-red-800",
  Expert: "from-purple-600 to-purple-800",
  Local: "from-yellow-600 to-yellow-800",
};

const difficultyBorder: Record<string, string> = {
  Easy: "border-emerald-500/30",
  Moderate: "border-sky-500/30",
  Difficult: "border-amber-500/30",
  Challenging: "border-red-500/30",
  Expert: "border-purple-500/30",
  Local: "border-yellow-500/30",
};

export default function TrekCollectionCard({ trek }: { trek: Trek }) {
  const grad = difficultyGradient[trek.difficulty] || difficultyGradient.Moderate;
  const border = difficultyBorder[trek.difficulty] || difficultyBorder.Moderate;

  return (
    <Link
      to={`/trek/${trek.id}`}
      className={`group block rounded-2xl border-2 ${border} overflow-hidden shadow-md hover:shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98]`}
    >
      {/* Card header with mountain art */}
      <div className={`relative bg-gradient-to-br ${grad} h-28 flex items-end p-4`}>
        {/* Mountain silhouette */}
        <svg className="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 200 100" preserveAspectRatio="none">
          <polygon points="0,100 40,30 80,70 120,20 160,60 200,10 200,100" fill="white" />
        </svg>
        {/* Difficulty badge */}
        <span className="relative z-10 text-[10px] font-bold uppercase tracking-wider bg-white/20 backdrop-blur-sm text-white px-2 py-0.5 rounded-full">
          {trek.difficulty}
        </span>
        {/* Country flag */}
        <span className="relative z-10 ml-auto text-[10px] font-medium bg-white/20 backdrop-blur-sm text-white px-2 py-0.5 rounded-full">
          {trek.country === "India" ? "🇮🇳" : "🇳🇵"} {trek.country}
        </span>
      </div>

      {/* Card body */}
      <div className="bg-card p-4">
        <h3 className="font-display font-bold text-sm truncate group-hover:text-primary transition-colors">
          {trek.name}
        </h3>
        <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
          <MapPin className="h-3 w-3" /> {trek.region}, {trek.state}
        </p>
        <div className="flex items-center gap-3 mt-3 text-xs text-muted-foreground">
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
