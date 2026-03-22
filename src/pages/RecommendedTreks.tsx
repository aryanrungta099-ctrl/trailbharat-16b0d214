import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Heart, Mountain, Clock, TrendingUp, ArrowLeft, Loader2, AlertTriangle } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { treks } from "@/data/treks";
import ScrollReveal from "@/components/ScrollReveal";
import { toast } from "sonner";

const RecommendedTreks = () => {
  const { user, loading: authLoading } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [recommendedIds, setRecommendedIds] = useState<string[]>([]);
  const [reasoning, setReasoning] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetched, setFetched] = useState(false);

  useEffect(() => {
    if (!user) return;
    supabase.from("profiles").select("age, height_cm, weight_kg, health_conditions").eq("user_id", user.id).maybeSingle()
      .then(({ data }) => { if (data) setProfile(data); });
  }, [user]);

  const fetchRecommendations = async () => {
    if (!profile) return;
    setLoading(true);
    try {
      const trekData = treks.map(t => ({
        id: t.id, name: t.name, difficulty: t.difficulty,
        altitudeMeters: t.altitudeMeters, durationDays: t.durationDays,
        region: t.region, state: t.state,
      }));

      const { data, error } = await supabase.functions.invoke("recommend-treks", {
        body: {
          age: profile.age,
          height_cm: profile.height_cm,
          weight_kg: profile.weight_kg,
          health_conditions: profile.health_conditions,
          treks: trekData,
        },
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      setRecommendedIds(data.recommended || []);
      setReasoning(data.reasoning || "");
      setFetched(true);
    } catch (e: any) {
      console.error(e);
      toast.error("Failed to get recommendations. Please try again.");
    }
    setLoading(false);
  };

  useEffect(() => {
    if (profile && !fetched) fetchRecommendations();
  }, [profile]);

  const recommendedTreks = recommendedIds
    .map(id => treks.find(t => t.id === id))
    .filter(Boolean) as typeof treks;

  const hasProfile = profile?.age || profile?.height_cm || profile?.weight_kg;

  if (authLoading) return null;

  return (
    <main className="pt-24 pb-16 min-h-screen bg-gradient-to-b from-background via-muted/20 to-background">
      <div className="container mx-auto px-4 max-w-6xl">
        <ScrollReveal>
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
            <ArrowLeft className="h-4 w-4" /> Back to Home
          </Link>

          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 rounded-xl bg-red-500 text-white">
              <Heart className="h-6 w-6" />
            </div>
            <h1 className="text-3xl font-display font-bold">Recommended Treks</h1>
          </div>
          <p className="text-muted-foreground mb-8">Personalized trek recommendations based on your health profile</p>
        </ScrollReveal>

        {!user ? (
          <ScrollReveal>
            <div className="bg-card rounded-2xl border border-border p-12 text-center">
              <AlertTriangle className="h-10 w-10 text-amber-500 mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">Login Required</h2>
              <p className="text-muted-foreground mb-6">Please log in with your health profile to get personalized recommendations.</p>
              <Link to="/auth" className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-red-500 hover:bg-red-600 text-white font-semibold text-sm shadow-lg transition-all active:scale-[0.97]">
                Log In / Sign Up
              </Link>
            </div>
          </ScrollReveal>
        ) : !hasProfile ? (
          <ScrollReveal>
            <div className="bg-card rounded-2xl border border-border p-12 text-center">
              <Mountain className="h-10 w-10 text-primary mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">Complete Your Health Profile</h2>
              <p className="text-muted-foreground mb-6">Add your age, height, weight, and health conditions in your profile to get personalized recommendations.</p>
              <Link to="/profile" className="inline-flex items-center gap-2 px-6 py-3 rounded-lg trek-gradient text-primary-foreground font-semibold text-sm shadow-lg transition-all active:scale-[0.97]">
                Go to Profile
              </Link>
            </div>
          </ScrollReveal>
        ) : loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="h-10 w-10 text-red-500 animate-spin mb-4" />
            <p className="text-muted-foreground">Analyzing your profile and finding the best treks...</p>
          </div>
        ) : (
          <>
            {reasoning && (
              <ScrollReveal>
                <div className="bg-primary/5 border border-primary/20 rounded-xl p-5 mb-8">
                  <p className="text-sm"><strong>AI Analysis:</strong> {reasoning}</p>
                </div>
              </ScrollReveal>
            )}

            {recommendedTreks.length === 0 && fetched ? (
              <div className="bg-card rounded-2xl border border-border p-12 text-center">
                <p className="text-muted-foreground">No recommendations could be generated. Try updating your health profile.</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recommendedTreks.map((trek, i) => (
                  <ScrollReveal key={trek.id} delay={i * 60}>
                    <Link to={`/trek/${trek.id}`}
                      className="group block bg-card rounded-xl border border-border shadow-sm hover:shadow-lg transition-all overflow-hidden h-full">
                      <div className="relative h-44 overflow-hidden bg-gradient-to-br from-primary/10 via-muted to-primary/5 flex items-center justify-center">
                        <Mountain className="h-16 w-16 text-primary/20" />
                        <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-red-500 text-white text-xs font-semibold">
                          #{i + 1} Pick
                        </div>
                        <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-full bg-foreground/60 text-background text-xs backdrop-blur-sm">
                          {trek.difficulty}
                        </div>
                      </div>
                      <div className="p-5">
                        <h3 className="font-display font-semibold text-lg mb-1 group-hover:text-primary transition-colors">{trek.name}</h3>
                        <p className="text-muted-foreground text-xs mb-3">{trek.region}, {trek.state}</p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1"><Mountain className="h-3.5 w-3.5" /> {trek.altitudeMeters.toLocaleString()}m</span>
                          <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {trek.durationDays}d</span>
                          <span className="flex items-center gap-1"><TrendingUp className="h-3.5 w-3.5" /> {trek.difficulty}</span>
                        </div>
                      </div>
                    </Link>
                  </ScrollReveal>
                ))}
              </div>
            )}

            <div className="text-center mt-8">
              <button onClick={fetchRecommendations} disabled={loading}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-red-500 hover:bg-red-600 text-white font-semibold text-sm shadow-lg transition-all active:scale-[0.97] disabled:opacity-50">
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Heart className="h-4 w-4" />}
                Refresh Recommendations
              </button>
            </div>
          </>
        )}
      </div>
    </main>
  );
};

export default RecommendedTreks;
