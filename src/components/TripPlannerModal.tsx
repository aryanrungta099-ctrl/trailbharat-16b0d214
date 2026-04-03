import { useState, useMemo } from "react";
import { X, Copy, Check } from "lucide-react";
import type { Trek } from "@/data/treks";
import { MONTHS } from "@/data/treks";
import { generateBudget } from "@/data/budgets";
import { toast } from "sonner";

interface TripPlannerModalProps {
  treks: Trek[];
  onClose: () => void;
}

export default function TripPlannerModal({ treks, onClose }: TripPlannerModalProps) {
  const [copied, setCopied] = useState(false);

  const summary = useMemo(() => {
    const totalDays = treks.reduce((s, t) => s + t.durationDays, 0);
    const minAlt = Math.min(...treks.map(t => t.altitudeMeters));
    const maxAlt = Math.max(...treks.map(t => t.altitudeMeters));

    const budgets = treks.map(t => t.budget ?? generateBudget(t.country, t.durationDays, t.difficulty, t.altitudeMeters, t.name));

    // Find shared best months
    const monthSets = treks.map(t => new Set(t.bestMonths));
    const sharedMonths = [...monthSets[0]].filter(m => monthSets.every(s => s.has(m)));

    return {
      totalDays,
      minAlt,
      maxAlt,
      sharedMonths,
      trekNames: treks.map(t => t.name),
      budgetLow: budgets.map(b => b.low.total).join(" + "),
      budgetHigh: budgets.map(b => b.high.total).join(" + "),
    };
  }, [treks]);

  const clipboardText = `🏔️ Trip Plan — Himalayan Trails\n\nTreks: ${summary.trekNames.join(", ")}\nTotal Days: ${summary.totalDays}\nAltitude Range: ${summary.minAlt.toLocaleString()}m – ${summary.maxAlt.toLocaleString()}m\nBest Months: ${summary.sharedMonths.length > 0 ? summary.sharedMonths.map(m => MONTHS[m - 1]).join(", ") : "No overlapping months"}\n\nBudget (Low): ${summary.budgetLow}\nBudget (High): ${summary.budgetHigh}\n\nPlanned on himalayantrails.aryanrungta.com`;

  const handleCopy = () => {
    navigator.clipboard.writeText(clipboardText);
    setCopied(true);
    toast.success("Trip plan copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-[90] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in" onClick={onClose}>
      <div className="bg-card border border-border rounded-2xl w-full max-w-lg overflow-auto" onClick={e => e.stopPropagation()}>
        <div className="px-6 py-4 border-b border-border flex items-center justify-between">
          <h2 className="font-display text-xl font-bold">Trip Plan</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-foreground/5 flex items-center justify-center" aria-label="Close">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="space-y-2">
            {treks.map((t, i) => (
              <div key={t.id} className="flex items-center gap-3 text-sm">
                <span className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">{i + 1}</span>
                <span className="font-medium">{t.name}</span>
                <span className="text-muted-foreground text-xs">{t.durationDays}d</span>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-muted/30 rounded-lg p-3 border border-border/50">
              <div className="text-xs text-muted-foreground">Total Duration</div>
              <div className="font-display text-lg font-bold text-primary">{summary.totalDays} days</div>
            </div>
            <div className="bg-muted/30 rounded-lg p-3 border border-border/50">
              <div className="text-xs text-muted-foreground">Altitude Range</div>
              <div className="font-display text-lg font-bold text-primary">{summary.minAlt.toLocaleString()}–{summary.maxAlt.toLocaleString()}m</div>
            </div>
          </div>

          <div className="bg-muted/30 rounded-lg p-3 border border-border/50">
            <div className="text-xs text-muted-foreground mb-1">Best Shared Months</div>
            {summary.sharedMonths.length > 0 ? (
              <div className="flex flex-wrap gap-1">
                {summary.sharedMonths.map(m => (
                  <span key={m} className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-medium">{MONTHS[m - 1]}</span>
                ))}
              </div>
            ) : (
              <p className="text-xs text-muted-foreground">No overlapping best months — consider splitting the trip across seasons.</p>
            )}
          </div>

          <button
            onClick={handleCopy}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg trek-gradient text-primary-foreground font-semibold text-sm active:scale-[0.98] transition-transform"
          >
            {copied ? <><Check className="w-4 h-4" /> Copied!</> : <><Copy className="w-4 h-4" /> Copy Trip Plan</>}
          </button>
        </div>
      </div>
    </div>
  );
}
