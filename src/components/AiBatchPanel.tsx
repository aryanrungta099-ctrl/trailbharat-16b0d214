import { useState } from "react";
import { Sparkles, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const FLAGSHIP_IDS = new Set([
  "kedarkantha", "valley-of-flowers", "hampta-pass", "roopkund", "goechala",
  "sandakphu", "brahmatal", "triund", "chadar", "pin-parvati-pass",
  "everest-base-camp", "annapurna-base-camp", "annapurna-circuit",
  "langtang-valley", "manaslu-circuit", "poon-hill", "mardi-himal",
  "upper-mustang", "gokyo-lakes", "three-passes",
]);

interface Props {
  treks: any[];
  overrides: any[];
  onDone: () => void;
}

const AiBatchPanel = ({ treks, overrides, onDone }: Props) => {
  const [running, setRunning] = useState(false);
  const [progress, setProgress] = useState({ done: 0, total: 0, ok: 0, failed: 0 });
  const [log, setLog] = useState<string[]>([]);

  const overrideIds = new Set(
    overrides.filter(o => o.long_form_content).map(o => o.trek_id)
  );

  const pending = treks.filter(t => !FLAGSHIP_IDS.has(t.id) && !overrideIds.has(t.id));
  const totalAiGenerated = overrides.filter(o => o.content_source === "ai_generated").length;
  const totalEditorial = overrides.filter(o => o.content_source === "editorial" && o.long_form_content).length;

  const runBatch = async (batchSize: number) => {
    setRunning(true);
    setLog([]);
    const batch = pending.slice(0, batchSize);
    setProgress({ done: 0, total: batch.length, ok: 0, failed: 0 });

    // Send in chunks of 5 to avoid edge fn timeout
    const CHUNK = 5;
    let ok = 0, failed = 0;

    for (let i = 0; i < batch.length; i += CHUNK) {
      const slice = batch.slice(i, i + CHUNK).map(t => ({
        id: t.id, name: t.name, country: t.country, state: t.state,
        region: t.region, difficulty: t.difficulty, durationDays: t.durationDays,
        altitudeMeters: t.altitudeMeters, bestMonths: t.bestMonths,
        description: t.description, highlights: t.highlights || [],
      }));

      try {
        const { data, error } = await supabase.functions.invoke("generate-trek-content", {
          body: { treks: slice },
        });

        if (error) {
          failed += slice.length;
          setLog(l => [`✗ Chunk ${i / CHUNK + 1}: ${error.message}`, ...l]);
        } else if (data?.error === "PAYMENT_REQUIRED") {
          toast.error("Lovable AI credits exhausted. Top up to continue.");
          setLog(l => [`⚠ Credits exhausted. Stopped at ${ok + failed}/${batch.length}.`, ...l]);
          break;
        } else {
          for (const r of data?.results || []) {
            if (r.ok) {
              ok++;
              setLog(l => [`✓ ${r.id} (${r.length} chars)`, ...l]);
            } else {
              failed++;
              setLog(l => [`✗ ${r.id}: ${r.error}`, ...l]);
            }
          }
        }
      } catch (e: any) {
        failed += slice.length;
        setLog(l => [`✗ Chunk error: ${e.message}`, ...l]);
      }

      setProgress({ done: ok + failed, total: batch.length, ok, failed });
    }

    setRunning(false);
    toast.success(`Generated ${ok} guides, ${failed} failed`);
    onDone();
  };

  return (
    <div className="mb-8 rounded-xl border border-primary/20 bg-primary/5 p-5">
      <div className="flex items-start justify-between gap-4 mb-4 flex-wrap">
        <div>
          <h3 className="font-semibold flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            AI Content Generator
          </h3>
          <p className="text-xs text-muted-foreground mt-1 max-w-xl">
            Generates structured 1200–1800 word guides for treks without long-form content.
            Skips the 20 hand-written flagships. Marks output as <code className="text-primary">ai_generated</code>.
          </p>
        </div>
        <div className="flex gap-3 text-xs">
          <Stat label="Editorial" value={totalEditorial} color="text-primary" />
          <Stat label="AI generated" value={totalAiGenerated} color="text-accent" />
          <Stat label="Pending" value={pending.length} color="text-muted-foreground" />
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          disabled={running || !pending.length}
          onClick={() => runBatch(5)}
          className="px-4 py-2 rounded-lg bg-primary/10 text-primary text-sm font-medium hover:bg-primary/20 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          Test: generate 5
        </button>
        <button
          disabled={running || !pending.length}
          onClick={() => runBatch(25)}
          className="px-4 py-2 rounded-lg bg-primary/10 text-primary text-sm font-medium hover:bg-primary/20 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          Generate 25
        </button>
        <button
          disabled={running || !pending.length}
          onClick={() => runBatch(pending.length)}
          className="px-4 py-2 rounded-lg trek-gradient text-primary-foreground text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          Generate all {pending.length}
        </button>
      </div>

      {(running || progress.total > 0) && (
        <div className="mt-4">
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
            {running && <Loader2 className="h-3 w-3 animate-spin" />}
            <span>
              {progress.done} / {progress.total} processed
              · <span className="text-primary">{progress.ok} ok</span>
              · <span className="text-destructive">{progress.failed} failed</span>
            </span>
          </div>
          <div className="h-1.5 rounded-full bg-foreground/5 overflow-hidden">
            <div
              className="h-full trek-gradient transition-all"
              style={{ width: `${progress.total ? (progress.done / progress.total) * 100 : 0}%` }}
            />
          </div>
          {log.length > 0 && (
            <div className="mt-3 max-h-48 overflow-y-auto rounded-lg border border-foreground/[0.05] bg-background/50 p-2 space-y-0.5 font-mono text-[10px]">
              {log.slice(0, 50).map((l, i) => (
                <div key={i} className={l.startsWith("✓") ? "text-primary" : l.startsWith("✗") ? "text-destructive" : "text-muted-foreground"}>
                  {l}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const Stat = ({ label, value, color }: { label: string; value: number; color: string }) => (
  <div className="text-right">
    <div className={`font-semibold tabular-nums ${color}`}>{value}</div>
    <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
  </div>
);

export default AiBatchPanel;
