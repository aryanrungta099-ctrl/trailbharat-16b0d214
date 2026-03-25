import { useState, useEffect } from "react";
import { X, Loader2, Mountain, Heart, Activity, AlertTriangle, CheckCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { treks } from "@/data/treks";
import { Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;

interface Props {
  open: boolean;
  onClose: () => void;
}

const FirstTrekModal = ({ open, onClose }: Props) => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [recommendation, setRecommendation] = useState("");
  const [fetchingProfile, setFetchingProfile] = useState(false);

  useEffect(() => {
    if (!open || !user) return;
    setFetchingProfile(true);
    supabase.from("profiles").select("*").eq("user_id", user.id).maybeSingle()
      .then(({ data }) => {
        setProfile(data);
        setFetchingProfile(false);
        if (data) fetchRecommendation(data);
        else fetchRecommendation(null);
      });
  }, [open, user]);

  const fetchRecommendation = async (profileData: any) => {
    setLoading(true);
    setRecommendation("");

    try {
      const resp = await fetch(`${SUPABASE_URL}/functions/v1/first-trek-advice`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          profile: profileData ? {
            age: profileData.age,
            height_cm: profileData.height_cm,
            weight_kg: profileData.weight_kg,
            health_conditions: profileData.health_conditions,
          } : null,
          easyTreks: treks
            .filter(t => t.difficulty === "Easy")
            .slice(0, 10)
            .map(t => ({ id: t.id, name: t.name, region: t.region, state: t.state, altitude: t.altitudeMeters, duration: t.durationDays })),
        }),
      });

      if (!resp.ok || !resp.body) throw new Error("Failed");

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let buf = "";
      let text = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buf += decoder.decode(value, { stream: true });
        let idx: number;
        while ((idx = buf.indexOf("\n")) !== -1) {
          let line = buf.slice(0, idx);
          buf = buf.slice(idx + 1);
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (!line.startsWith("data: ")) continue;
          const json = line.slice(6).trim();
          if (json === "[DONE]") break;
          try {
            const parsed = JSON.parse(json);
            const c = parsed.choices?.[0]?.delta?.content;
            if (c) {
              text += c;
              setRecommendation(text);
            }
          } catch {}
        }
      }
    } catch (e) {
      console.error(e);
      setRecommendation("Sorry, I couldn't generate recommendations right now. Please try again later.");
    }
    setLoading(false);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-card rounded-2xl border border-border shadow-2xl max-w-2xl w-full max-h-[85vh] overflow-auto" onClick={e => e.stopPropagation()}>
        <div className="sticky top-0 bg-card border-b border-border px-6 py-4 flex items-center justify-between z-10">
          <h2 className="text-lg font-serif font-semibold flex items-center gap-2">
            <Mountain className="h-5 w-5 text-primary" /> Your First Trek Guide
          </h2>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-muted active:scale-95 transition">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6">
          {!user ? (
            <div className="text-center py-8">
              <AlertTriangle className="h-10 w-10 text-amber-500 mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Sign in for personalized advice</h3>
              <p className="text-sm text-muted-foreground mb-4">Log in and complete your health profile to get recommendations tailored to your fitness level.</p>
              <Link to="/auth" onClick={onClose} className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-semibold text-sm">
                Sign In
              </Link>
            </div>
          ) : fetchingProfile ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : (
            <>
              {/* Profile summary */}
              {profile && (
                <div className="bg-muted/50 rounded-xl p-4 mb-6 border border-border/50">
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Your Health Profile</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="flex items-center gap-2">
                      <Activity className="h-4 w-4 text-primary" />
                      <div>
                        <div className="text-[10px] text-muted-foreground">Age</div>
                        <div className="text-sm font-medium">{profile.age || "Not set"}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Heart className="h-4 w-4 text-red-500" />
                      <div>
                        <div className="text-[10px] text-muted-foreground">Height</div>
                        <div className="text-sm font-medium">{profile.height_cm ? `${profile.height_cm}cm` : "Not set"}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Activity className="h-4 w-4 text-trek-sky" />
                      <div>
                        <div className="text-[10px] text-muted-foreground">Weight</div>
                        <div className="text-sm font-medium">{profile.weight_kg ? `${profile.weight_kg}kg` : "Not set"}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-trek-moss" />
                      <div>
                        <div className="text-[10px] text-muted-foreground">Conditions</div>
                        <div className="text-sm font-medium">{profile.health_conditions || "None"}</div>
                      </div>
                    </div>
                  </div>
                  {(!profile.age || !profile.height_cm || !profile.weight_kg) && (
                    <Link to="/profile" onClick={onClose} className="text-xs text-primary hover:underline mt-2 inline-block">
                      Complete your profile for better recommendations →
                    </Link>
                  )}
                </div>
              )}

              {/* AI Recommendation */}
              <div className="prose prose-sm dark:prose-invert max-w-none">
                {loading && !recommendation && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="text-sm">Analyzing your profile and finding the best treks...</span>
                  </div>
                )}
                {recommendation && <ReactMarkdown>{recommendation}</ReactMarkdown>}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default FirstTrekModal;
