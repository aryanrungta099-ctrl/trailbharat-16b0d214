import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Heart, Loader2, Sparkles, AlertTriangle, ShieldCheck } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Trek } from "@/data/treks";
import { toast } from "sonner";

export interface PersonalizedDayPlan {
  day: number;
  status: "ok" | "watch" | "rest_recommended" | "abort_recommended";
  note: string;
}
export interface PersonalizedPlan {
  suitabilityScore: number;
  summary: string;
  paceAdjustments: string[];
  risks: string[];
  dayPlans: PersonalizedDayPlan[];
}

interface Props {
  trek: Trek;
  user: any;
  onPlan: (plan: PersonalizedPlan | null) => void;
  plan: PersonalizedPlan | null;
}

export default function PersonalizeItineraryPanel({ trek, user, onPlan, plan }: Props) {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("profiles")
      .select("age, height_cm, weight_kg, health_conditions")
      .eq("user_id", user.id)
      .maybeSingle()
      .then(({ data }) => {
        if (data) setProfile(data);
      });
  }, [user]);

  const hasProfile = !!(profile?.age || profile?.height_cm || profile?.weight_kg);

  const personalize = async () => {
    if (!profile) return;
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("personalize-itinerary", {
        body: {
          trekName: trek.name,
          altitudeMeters: trek.altitudeMeters,
          difficulty: trek.difficulty,
          durationDays: trek.durationDays,
          itinerary: trek.itinerary,
          age: profile.age,
          height_cm: profile.height_cm,
          weight_kg: profile.weight_kg,
          health_conditions: profile.health_conditions,
        },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      onPlan(data as PersonalizedPlan);
      toast.success("Itinerary personalised for your profile");
    } catch (e: any) {
      console.error(e);
      toast.error(e?.message || "Could not personalise itinerary. Try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="bg-card rounded-xl border border-border p-5">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-red-500/10 text-red-500 shrink-0">
            <Heart className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-semibold mb-1">Personalise this itinerary for you</h3>
            <p className="text-xs text-muted-foreground mb-3">
              Log in and add your age, weight, and health conditions to get day-by-day guidance tailored to you (extra rest days, AMS warnings, pace).
            </p>
            <Link
              to="/auth"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500 hover:bg-red-600 text-white text-xs font-semibold transition-colors"
            >
              Log in to personalise
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!hasProfile) {
    return (
      <div className="bg-card rounded-xl border border-border p-5">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-amber-500/10 text-amber-500 shrink-0">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-semibold mb-1">Add your health profile</h3>
            <p className="text-xs text-muted-foreground mb-3">
              We need your age, height, weight, and any health conditions to tailor this itinerary safely.
            </p>
            <Link
              to="/profile"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-semibold"
            >
              Complete profile
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (plan) {
    const scoreColor =
      plan.suitabilityScore >= 75
        ? "text-trek-moss"
        : plan.suitabilityScore >= 50
        ? "text-amber-500"
        : "text-destructive";
    return (
      <div className="bg-card rounded-xl border border-primary/30 p-5 space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10 text-primary">
            <Sparkles className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-semibold">Personalised for you</h3>
            <p className="text-[11px] text-muted-foreground">Based on your health profile</p>
          </div>
          <div className={`text-2xl font-bold tabular-nums ${scoreColor}`}>{plan.suitabilityScore}</div>
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed">{plan.summary}</p>
        {plan.paceAdjustments?.length > 0 && (
          <div>
            <h4 className="text-[11px] uppercase tracking-wider text-muted-foreground mb-1.5 flex items-center gap-1">
              <ShieldCheck className="h-3 w-3" /> Pace & preparation
            </h4>
            <ul className="space-y-1">
              {plan.paceAdjustments.map((p, i) => (
                <li key={i} className="text-xs text-foreground flex items-start gap-1.5">
                  <span className="text-primary mt-0.5">›</span> {p}
                </li>
              ))}
            </ul>
          </div>
        )}
        {plan.risks?.length > 0 && (
          <div>
            <h4 className="text-[11px] uppercase tracking-wider text-destructive mb-1.5 flex items-center gap-1">
              <AlertTriangle className="h-3 w-3" /> Risks for your profile
            </h4>
            <ul className="space-y-1">
              {plan.risks.map((r, i) => (
                <li key={i} className="text-xs text-foreground flex items-start gap-1.5">
                  <span className="text-destructive mt-0.5">!</span> {r}
                </li>
              ))}
            </ul>
          </div>
        )}
        <button
          onClick={() => onPlan(null)}
          className="text-[11px] text-muted-foreground hover:text-foreground underline"
        >
          Clear personalisation
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-primary/5 to-trek-moss/5 rounded-xl border border-primary/20 p-5">
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-lg bg-primary/15 text-primary shrink-0">
          <Sparkles className="h-5 w-5" />
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-semibold mb-1">Custom itinerary for your health profile</h3>
          <p className="text-xs text-muted-foreground mb-3">
            Adjust this plan to your age, fitness, and health conditions — get extra rest days, AMS warnings, and a per-day go/watch/rest signal.
          </p>
          <button
            onClick={personalize}
            disabled={loading}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-semibold transition-all active:scale-[0.97] disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" /> Personalising...
              </>
            ) : (
              <>
                <Sparkles className="h-3.5 w-3.5" /> Personalise this trek for me
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
