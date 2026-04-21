import { AlertTriangle, ShieldCheck, TrendingUp } from "lucide-react";
import { Trek } from "@/data/treks";
import { Link } from "react-router-dom";

function parseElev(s: string | undefined): number {
  if (!s) return 0;
  return parseInt(s.replace(/[^0-9]/g, "")) || 0;
}

interface AmsAnalysis {
  maxAltitude: number;
  daysAbove3000: number;
  daysAbove4000: number;
  daysAbove5000: number;
  recommendedAcclimDays: number;
  riskLevel: "Low" | "Moderate" | "High" | "Severe";
  riskColor: string;
  redFlags: string[];
}

export function analyseAmsRisk(trek: Trek): AmsAnalysis {
  const elevs = trek.itinerary.map(d => parseElev(d.elevation));
  const maxAltitude = Math.max(trek.altitudeMeters, ...elevs);
  const daysAbove3000 = elevs.filter(e => e >= 3000).length;
  const daysAbove4000 = elevs.filter(e => e >= 4000).length;
  const daysAbove5000 = elevs.filter(e => e >= 5000).length;

  // Compute max daily ascent above 3000m
  let maxAscent = 0;
  for (let i = 1; i < elevs.length; i++) {
    if (elevs[i] >= 3000) {
      maxAscent = Math.max(maxAscent, elevs[i] - elevs[i - 1]);
    }
  }

  let riskLevel: AmsAnalysis["riskLevel"] = "Low";
  let riskColor = "bg-trek-moss/15 text-trek-moss border-trek-moss/30";
  if (maxAltitude >= 5500 || daysAbove5000 >= 2) {
    riskLevel = "Severe"; riskColor = "bg-destructive/15 text-destructive border-destructive/30";
  } else if (maxAltitude >= 4500 || daysAbove4000 >= 3 || maxAscent > 800) {
    riskLevel = "High"; riskColor = "bg-trek-sunrise/15 text-trek-sunrise border-trek-sunrise/30";
  } else if (maxAltitude >= 3500 || daysAbove3000 >= 3) {
    riskLevel = "Moderate"; riskColor = "bg-yellow-500/15 text-yellow-700 border-yellow-500/30";
  }

  const recommendedAcclimDays = maxAltitude >= 5000 ? 3 : maxAltitude >= 4000 ? 2 : maxAltitude >= 3500 ? 1 : 0;

  const redFlags: string[] = [];
  if (maxAscent > 800) redFlags.push(`Daily ascent of ${maxAscent}m exceeds the safe limit of 500m above 3000m`);
  if (recommendedAcclimDays > 0) redFlags.push(`Plan at least ${recommendedAcclimDays} dedicated rest day(s) for acclimatisation`);
  if (maxAltitude >= 4000) redFlags.push("Carry Diamox (consult a doctor) and know HACE/HAPE warning signs");
  if (daysAbove5000 >= 1) redFlags.push("Sustained time above 5000m — descent must be immediate if symptoms worsen");

  return { maxAltitude, daysAbove3000, daysAbove4000, daysAbove5000, recommendedAcclimDays, riskLevel, riskColor, redFlags };
}

export function AmsRiskBlock({ trek }: { trek: Trek }) {
  const a = analyseAmsRisk(trek);
  return (
    <div className="bg-card rounded-xl border border-border p-5">
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-display text-sm font-semibold flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-trek-sunrise" /> AMS Risk Summary
        </h4>
        <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${a.riskColor}`}>{a.riskLevel}</span>
      </div>
      <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs mb-4">
        <dt className="text-muted-foreground">Max altitude</dt><dd className="font-medium text-right">{a.maxAltitude.toLocaleString()}m</dd>
        <dt className="text-muted-foreground">Days &gt; 3,000m</dt><dd className="font-medium text-right">{a.daysAbove3000}</dd>
        <dt className="text-muted-foreground">Days &gt; 4,000m</dt><dd className="font-medium text-right">{a.daysAbove4000}</dd>
        <dt className="text-muted-foreground">Days &gt; 5,000m</dt><dd className="font-medium text-right">{a.daysAbove5000}</dd>
        <dt className="text-muted-foreground">Acclim. days</dt><dd className="font-medium text-right">{a.recommendedAcclimDays || "Optional"}</dd>
      </dl>
      {a.redFlags.length > 0 && (
        <div className="border-t border-border pt-3 mb-3">
          <p className="text-xs font-semibold text-foreground mb-1.5 flex items-center gap-1.5"><TrendingUp className="h-3 w-3" /> Red flags</p>
          <ul className="space-y-1 text-xs text-muted-foreground">
            {a.redFlags.map((f, i) => <li key={i} className="flex gap-1.5"><span className="text-trek-sunrise">•</span>{f}</li>)}
          </ul>
        </div>
      )}
      <Link to="/ams" className="inline-flex items-center gap-1.5 text-xs text-primary hover:underline">
        <ShieldCheck className="h-3 w-3" /> Read the full AMS guide & calculator →
      </Link>
      <p className="text-[10px] text-muted-foreground/70 mt-2 italic">Educational information only. Not medical advice.</p>
    </div>
  );
}
