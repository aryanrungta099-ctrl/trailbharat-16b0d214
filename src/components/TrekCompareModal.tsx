import { X } from "lucide-react";
import { useEffect } from "react";
import type { Trek } from "@/data/treks";
import { MONTHS } from "@/data/treks";
import { generateBudget } from "@/data/budgets";

const difficultyRank: Record<string, number> = {
  Easy: 1, Moderate: 2, Difficult: 3, Challenging: 4, Expert: 5, Local: 0,
};

const difficultyColor: Record<string, string> = {
  Easy: "#74c69d", Moderate: "#c9973a", Difficult: "#e05c5c", Challenging: "#a78bfa", Expert: "#f472b6", Local: "#fbbf24",
};

function cellColor(values: number[], idx: number, reverse = false) {
  const sorted = [...values].sort((a, b) => a - b);
  const rank = sorted.indexOf(values[idx]);
  if (reverse) {
    return rank === 0 ? "bg-destructive/10 text-destructive" : rank === sorted.length - 1 ? "bg-primary/10 text-primary" : "";
  }
  return rank === 0 ? "bg-primary/10 text-primary" : rank === sorted.length - 1 ? "bg-accent/10 text-accent" : "";
}

interface TrekCompareModalProps {
  treks: Trek[];
  onClose: () => void;
  onRemove: (id: string) => void;
}

export default function TrekCompareModal({ treks, onClose, onRemove }: TrekCompareModalProps) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", handler); document.body.style.overflow = ""; };
  }, [onClose]);

  const budgets = treks.map(t => t.budget ?? generateBudget(t.country, t.durationDays, t.difficulty, t.altitudeMeters, t.name));

  const rows = [
    {
      label: "Difficulty",
      values: treks.map(t => t.difficulty),
      render: (v: string) => (
        <span className="px-2 py-0.5 rounded-full text-xs font-medium" style={{ background: `${difficultyColor[v]}20`, color: difficultyColor[v] }}>{v}</span>
      ),
      compare: treks.map(t => difficultyRank[t.difficulty] ?? 0),
    },
    {
      label: "Duration",
      values: treks.map(t => `${t.durationDays} days`),
      compare: treks.map(t => t.durationDays),
    },
    {
      label: "Max Altitude",
      values: treks.map(t => `${t.altitudeMeters.toLocaleString()}m`),
      compare: treks.map(t => t.altitudeMeters),
    },
    {
      label: "Region / State",
      values: treks.map(t => `${t.region}, ${t.state}`),
    },
    {
      label: "Best Months",
      values: treks.map(t => t.bestMonths.map(m => MONTHS[m - 1]).join(", ")),
    },
    {
      label: "Budget (Low)",
      values: budgets.map(b => b.low.total),
    },
    {
      label: "Budget (High)",
      values: budgets.map(b => b.high.total),
    },
  ];

  return (
    <div className="fixed inset-0 z-[90] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in" onClick={onClose}>
      <div className="bg-card border border-border rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-auto" onClick={e => e.stopPropagation()}>
        <div className="sticky top-0 bg-card border-b border-border px-6 py-4 flex items-center justify-between z-10">
          <h2 className="font-display text-xl font-bold">Trek Comparison</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-foreground/5 flex items-center justify-center hover:bg-foreground/10 transition-colors" aria-label="Close comparison">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6">
          <table className="w-full text-sm">
            <thead>
              <tr>
                <th className="text-left text-xs text-muted-foreground font-medium pb-4 pr-4 w-32"></th>
                {treks.map(t => (
                  <th key={t.id} className="text-left pb-4 px-2">
                    <div className="font-display font-bold text-base">{t.name}</div>
                    <div className="text-xs text-muted-foreground">{t.country}</div>
                    <button
                      onClick={() => onRemove(t.id)}
                      className="text-[10px] text-destructive hover:underline mt-1"
                    >
                      Remove
                    </button>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.label} className="border-t border-border/50">
                  <td className="py-3 pr-4 text-xs font-medium text-muted-foreground whitespace-nowrap">{row.label}</td>
                  {row.values.map((v, i) => (
                    <td key={i} className={`py-3 px-2 ${row.compare ? cellColor(row.compare, i) : ""}`}>
                      {row.render ? row.render(v) : <span className="text-sm">{v}</span>}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
