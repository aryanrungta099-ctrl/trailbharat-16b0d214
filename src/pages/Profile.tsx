import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { User, Award, Mountain, Plus, Trash2, Calendar } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { treks } from "@/data/treks";
import { getEarnedBadges } from "@/data/badges";
import ScrollReveal from "@/components/ScrollReveal";
import { toast } from "sonner";

const Profile = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [completedTrekIds, setCompletedTrekIds] = useState<string[]>([]);
  const [selectedTrek, setSelectedTrek] = useState("");
  const [completedDate, setCompletedDate] = useState(new Date().toISOString().split("T")[0]);
  const [submitting, setSubmitting] = useState(false);
  const [profile, setProfile] = useState<{ display_name: string; bio: string | null; avatar_url: string | null } | null>(null);

  useEffect(() => {
    if (!loading && !user) navigate("/auth");
  }, [user, loading, navigate]);

  useEffect(() => {
    if (!user) return;
    // Fetch profile
    supabase.from("profiles").select("display_name, bio, avatar_url").eq("user_id", user.id).maybeSingle()
      .then(({ data }) => { if (data) setProfile(data); });
    // Fetch completed treks
    fetchCompleted();
  }, [user]);

  const fetchCompleted = async () => {
    if (!user) return;
    const { data } = await supabase.from("completed_treks").select("trek_id").eq("user_id", user.id);
    if (data) setCompletedTrekIds(data.map((d: any) => d.trek_id));
  };

  const addCompletedTrek = async () => {
    if (!user || !selectedTrek) return;
    setSubmitting(true);
    const { error } = await supabase.from("completed_treks").insert({ user_id: user.id, trek_id: selectedTrek, completed_at: completedDate });
    if (error) {
      if (error.code === "23505") toast.error("You've already logged this trek!");
      else toast.error("Failed to add trek");
    } else {
      toast.success("Trek added to your profile! 🎉");
      setSelectedTrek("");
      fetchCompleted();
    }
    setSubmitting(false);
  };

  const removeTrek = async (trekId: string) => {
    if (!user) return;
    await supabase.from("completed_treks").delete().eq("user_id", user.id).eq("trek_id", trekId);
    toast.success("Trek removed");
    fetchCompleted();
  };

  const earnedBadges = useMemo(() => {
    return getEarnedBadges(completedTrekIds, treks);
  }, [completedTrekIds]);

  const completedTrekData = treks.filter(t => completedTrekIds.includes(t.id));
  const availableTreks = treks.filter(t => !completedTrekIds.includes(t.id));

  if (loading || !user) return null;

  return (
    <main className="pt-24 pb-16">
      <div className="container mx-auto px-4 max-w-3xl">
        {/* Profile header */}
        <ScrollReveal>
          <div className="bg-card rounded-xl border border-border p-8 mb-8 shadow-sm">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                {profile?.avatar_url ? (
                  <img src={profile.avatar_url} className="w-16 h-16 rounded-full object-cover" alt="" />
                ) : (
                  <User className="h-8 w-8 text-primary" />
                )}
              </div>
              <div>
                <h1 className="text-2xl font-display font-bold">{profile?.display_name || user.email}</h1>
                {profile?.bio && <p className="text-muted-foreground text-sm mt-1">{profile.bio}</p>}
              </div>
            </div>
            <div className="flex gap-6 text-sm text-muted-foreground">
              <span className="flex items-center gap-1"><Mountain className="h-4 w-4" /> {completedTrekIds.length} treks completed</span>
              <span className="flex items-center gap-1"><Award className="h-4 w-4" /> {earnedBadges.length} badges earned</span>
            </div>
          </div>
        </ScrollReveal>

        {/* Badges */}
        <ScrollReveal delay={80}>
          <div className="mb-8">
            <h2 className="text-lg font-display font-semibold mb-4 flex items-center gap-2">
              <Award className="h-5 w-5 text-primary" /> Your Badges
            </h2>
            {earnedBadges.length === 0 ? (
              <div className="bg-card rounded-xl border border-border p-6 text-center text-muted-foreground text-sm">
                Complete your first trek to earn badges! 🏔️
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {earnedBadges.map(badge => (
                  <div key={badge.id} className={`rounded-xl border border-border p-4 text-center ${badge.color} transition-transform hover:scale-[1.02] active:scale-[0.98]`}>
                    <div className="text-3xl mb-2">{badge.emoji}</div>
                    <div className="font-medium text-sm">{badge.name}</div>
                    <div className="text-xs opacity-75 mt-1">{badge.description}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </ScrollReveal>

        {/* Add completed trek */}
        <ScrollReveal delay={120}>
          <div className="bg-card rounded-xl border border-border p-6 mb-8 shadow-sm">
            <h3 className="font-display font-semibold mb-4 flex items-center gap-2">
              <Plus className="h-4 w-4" /> Log a Completed Trek
            </h3>
            <div className="flex flex-col sm:flex-row gap-3">
              <select
                value={selectedTrek}
                onChange={(e) => setSelectedTrek(e.target.value)}
                className="flex-1 px-3 py-2.5 rounded-lg border border-input bg-background text-foreground text-sm"
              >
                <option value="">Select a trek…</option>
                {availableTreks.map(t => (
                  <option key={t.id} value={t.id}>{t.name} ({t.country})</option>
                ))}
              </select>
              <input
                type="date"
                value={completedDate}
                onChange={(e) => setCompletedDate(e.target.value)}
                className="px-3 py-2.5 rounded-lg border border-input bg-background text-foreground text-sm"
              />
              <button
                onClick={addCompletedTrek}
                disabled={!selectedTrek || submitting}
                className="px-5 py-2.5 rounded-lg trek-gradient text-primary-foreground text-sm font-medium shadow active:scale-[0.97] disabled:opacity-50 transition-all"
              >
                {submitting ? "Adding…" : "Add Trek"}
              </button>
            </div>
          </div>
        </ScrollReveal>

        {/* Completed treks list */}
        <ScrollReveal delay={160}>
          <h2 className="text-lg font-display font-semibold mb-4">Completed Treks</h2>
          {completedTrekData.length === 0 ? (
            <div className="bg-card rounded-xl border border-border p-8 text-center text-muted-foreground text-sm">
              No treks completed yet. Start logging your adventures!
            </div>
          ) : (
            <div className="space-y-3">
              {completedTrekData.map(trek => (
                <div key={trek.id} className="bg-card rounded-xl border border-border p-5 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">{trek.name}</div>
                    <div className="text-xs text-muted-foreground flex items-center gap-3 mt-1">
                      <span>{trek.country}</span>
                      <span>{trek.altitudeMeters.toLocaleString()}m</span>
                      <span>{trek.difficulty}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => removeTrek(trek.id)}
                    className="p-2 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors active:scale-95"
                    title="Remove"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </ScrollReveal>
      </div>
    </main>
  );
};

export default Profile;
