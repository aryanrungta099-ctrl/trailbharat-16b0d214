import { useState, useEffect, useMemo, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { User, Award, Mountain, Plus, Trash2, Heart, Save } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { treks } from "@/data/treks";
import { getEarnedBadges, Badge } from "@/data/badges";
import ScrollReveal from "@/components/ScrollReveal";
import { toast } from "sonner";
import SEOHead from "@/components/SEOHead";

/* ── Badge Celebration Overlay ── */
const BadgeCelebration = ({ badge, onDone }: { badge: Badge; onDone: () => void }) => {
  useEffect(() => {
    const t = setTimeout(onDone, 2800);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="flex flex-col items-center animate-badge-pop">
        {/* confetti ring */}
        <div className="relative">
          <div className="absolute -inset-8 rounded-full bg-primary/20 animate-ping opacity-40" />
          <div className={`relative w-28 h-28 rounded-full flex items-center justify-center text-5xl ${badge.color} border-4 border-primary/30 shadow-xl`}>
            {badge.emoji}
          </div>
        </div>
        <div className="mt-6 bg-card/95 backdrop-blur rounded-2xl px-8 py-5 text-center shadow-2xl border border-border">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-1">🎉 Congratulations!</p>
          <h3 className="text-xl font-display font-bold">{badge.name}</h3>
          <p className="text-sm text-muted-foreground mt-1">{badge.description}</p>
        </div>
      </div>
    </div>
  );
};

const Profile = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [completedTrekIds, setCompletedTrekIds] = useState<string[]>([]);
  const [selectedTrek, setSelectedTrek] = useState("");
  const [completedDate, setCompletedDate] = useState(new Date().toISOString().split("T")[0]);
  const [submitting, setSubmitting] = useState(false);
  const [profile, setProfile] = useState<{ display_name: string; bio: string | null; avatar_url: string | null; age: number | null; height_cm: number | null; weight_kg: number | null; health_conditions: string | null } | null>(null);
  const [celebrateBadge, setCelebrateBadge] = useState<Badge | null>(null);
  const seenBadgesRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (!loading && !user) navigate("/auth");
  }, [user, loading, navigate]);

  useEffect(() => {
    if (!user) return;
    supabase.from("profiles").select("display_name, bio, avatar_url, age, height_cm, weight_kg, health_conditions").eq("user_id", user.id).maybeSingle()
      .then(({ data }) => { if (data) setProfile(data as any); });
    fetchCompleted();
  }, [user]);

  const fetchCompleted = async () => {
    if (!user) return;
    const { data } = await supabase.from("completed_treks").select("trek_id").eq("user_id", user.id);
    if (data) setCompletedTrekIds(data.map((d: any) => d.trek_id));
  };

  const earnedBadges = useMemo(() => {
    return getEarnedBadges(completedTrekIds, treks);
  }, [completedTrekIds]);

  // Load seen badges from localStorage on mount
  useEffect(() => {
    if (!user) return;
    const stored = localStorage.getItem(`seen-badges-${user.id}`);
    if (stored) {
      try { seenBadgesRef.current = new Set(JSON.parse(stored)); } catch { /* ignore */ }
    }
  }, [user]);

  // Detect truly NEW badge (not seen before) and celebrate
  useEffect(() => {
    if (!user || earnedBadges.length === 0) return;
    const newBadge = earnedBadges.find(b => !seenBadgesRef.current.has(b.id));
    if (newBadge) {
      setCelebrateBadge(newBadge);
      // Mark all current badges as seen
      const allIds = earnedBadges.map(b => b.id);
      seenBadgesRef.current = new Set(allIds);
      localStorage.setItem(`seen-badges-${user.id}`, JSON.stringify(allIds));
    } else if (seenBadgesRef.current.size === 0) {
      // First load — mark all existing as seen without celebrating
      const allIds = earnedBadges.map(b => b.id);
      seenBadgesRef.current = new Set(allIds);
      localStorage.setItem(`seen-badges-${user.id}`, JSON.stringify(allIds));
    }
  }, [earnedBadges, user]);

  const addCompletedTrek = async () => {
    if (!user || !selectedTrek) return;
    setSubmitting(true);
    const { error } = await supabase.from("completed_treks").insert({ user_id: user.id, trek_id: selectedTrek, completed_at: completedDate });
    if (error) {
      if (error.code === "23505") toast.error("You've already logged this trek!");
      else toast.error("Failed to add trek");
    } else {
      toast.success("Trek added! 🎉");
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

  const completedTrekData = treks.filter(t => completedTrekIds.includes(t.id));
  const availableTreks = treks.filter(t => !completedTrekIds.includes(t.id));

  if (loading || !user) return null;

  return (
    <>
      {celebrateBadge && <BadgeCelebration badge={celebrateBadge} onDone={() => setCelebrateBadge(null)} />}

      <main className="pt-24 pb-16 min-h-screen relative overflow-hidden">
        {/* Mountain-themed background */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-b from-trek-forest/5 via-background to-trek-earth/5" />
          {/* Mountain silhouettes */}
          <svg className="absolute bottom-0 left-0 right-0 w-full opacity-[0.04]" viewBox="0 0 1440 320" preserveAspectRatio="none">
            <path fill="currentColor" className="text-trek-forest" d="M0,224L60,213.3C120,203,240,181,360,186.7C480,192,600,224,720,229.3C840,235,960,213,1080,186.7C1200,160,1320,128,1380,112L1440,96L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z" />
          </svg>
          <svg className="absolute bottom-0 left-0 right-0 w-full opacity-[0.03]" viewBox="0 0 1440 320" preserveAspectRatio="none">
            <path fill="currentColor" className="text-trek-earth" d="M0,288L48,272C96,256,192,224,288,213.3C384,203,480,213,576,229.3C672,245,768,267,864,261.3C960,256,1056,224,1152,208C1248,192,1344,192,1392,192L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z" />
          </svg>
          {/* Decorative dots */}
          <div className="absolute top-32 left-8 w-2 h-2 rounded-full bg-primary/10" />
          <div className="absolute top-48 right-16 w-3 h-3 rounded-full bg-trek-moss/10" />
          <div className="absolute top-80 left-1/4 w-2 h-2 rounded-full bg-trek-earth/10" />
        </div>

        <div className="container mx-auto px-4 max-w-3xl relative">
          {/* Profile header */}
          <ScrollReveal>
            <div className="bg-card/80 backdrop-blur-sm rounded-2xl border border-border p-8 mb-8 shadow-lg relative overflow-hidden">
              {/* Header accent */}
              <div className="absolute top-0 left-0 right-0 h-1 trek-gradient" />
              <div className="flex items-center gap-5 mb-5">
                <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center ring-4 ring-primary/5 shadow-md">
                  {profile?.avatar_url ? (
                    <img src={profile.avatar_url} className="w-20 h-20 rounded-full object-cover" alt="" />
                  ) : (
                    <User className="h-9 w-9 text-primary" />
                  )}
                </div>
                <div>
                  <h1 className="text-2xl font-display font-bold">{profile?.display_name || user.email}</h1>
                  {profile?.bio && <p className="text-muted-foreground text-sm mt-1">{profile.bio}</p>}
                  <p className="text-xs text-muted-foreground/60 mt-1">{user.email}</p>
                </div>
              </div>
              <div className="flex gap-6 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5 bg-primary/5 px-3 py-1.5 rounded-full"><Mountain className="h-4 w-4 text-primary" /> {completedTrekIds.length} treks</span>
                <span className="flex items-center gap-1.5 bg-primary/5 px-3 py-1.5 rounded-full"><Award className="h-4 w-4 text-primary" /> {earnedBadges.length} badges</span>
              </div>
            </div>
          </ScrollReveal>

          {/* Health Profile */}
          <ScrollReveal delay={60}>
            <div className="bg-card/80 backdrop-blur-sm rounded-2xl border border-border p-6 mb-8 shadow-sm">
              <h3 className="font-display font-semibold mb-4 flex items-center gap-2">
                <Heart className="h-4 w-4 text-destructive" /> Health Profile
              </h3>
              <div className="grid grid-cols-3 gap-3 mb-3">
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Age</label>
                  <input type="number" value={profile?.age ?? ""} min={10} max={100}
                    onChange={e => setProfile(p => p ? { ...p, age: e.target.value ? parseInt(e.target.value) : null } : p)}
                    className="w-full px-3 py-2 rounded-lg border border-input bg-background text-foreground text-sm" placeholder="Age" />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Height (cm)</label>
                  <input type="number" value={profile?.height_cm ?? ""} min={100} max={250}
                    onChange={e => setProfile(p => p ? { ...p, height_cm: e.target.value ? parseInt(e.target.value) : null } : p)}
                    className="w-full px-3 py-2 rounded-lg border border-input bg-background text-foreground text-sm" placeholder="cm" />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Weight (kg)</label>
                  <input type="number" value={profile?.weight_kg ?? ""} min={20} max={250}
                    onChange={e => setProfile(p => p ? { ...p, weight_kg: e.target.value ? parseInt(e.target.value) : null } : p)}
                    className="w-full px-3 py-2 rounded-lg border border-input bg-background text-foreground text-sm" placeholder="kg" />
                </div>
              </div>
              <div className="mb-3">
                <label className="text-xs text-muted-foreground mb-1 block">Health Conditions</label>
                <input type="text" value={profile?.health_conditions ?? ""} maxLength={500}
                  onChange={e => setProfile(p => p ? { ...p, health_conditions: e.target.value || null } : p)}
                  className="w-full px-3 py-2 rounded-lg border border-input bg-background text-foreground text-sm" placeholder="e.g., asthma, knee issues (optional)" />
              </div>
              <div className="flex items-center gap-3">
                <button onClick={async () => {
                  if (!user || !profile) return;
                  const { error } = await supabase.from("profiles").update({
                    age: profile.age, height_cm: profile.height_cm,
                    weight_kg: profile.weight_kg, health_conditions: profile.health_conditions,
                  }).eq("user_id", user.id);
                  if (error) toast.error("Failed to save");
                  else toast.success("Health profile updated!");
                }} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg trek-gradient text-primary-foreground text-sm font-medium shadow hover:shadow-md active:scale-[0.97] transition-all">
                  <Save className="h-3.5 w-3.5" /> Save Health Info
                </button>
                <Link to="/recommended" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-destructive hover:bg-destructive/90 text-destructive-foreground text-sm font-medium shadow transition-all active:scale-[0.97]">
                  <Heart className="h-3.5 w-3.5" /> Get Recommendations
                </Link>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={80}>
            <div className="mb-8">
              <h2 className="text-lg font-display font-semibold mb-4 flex items-center gap-2">
                <Award className="h-5 w-5 text-primary" /> Your Badges
              </h2>
              {earnedBadges.length === 0 ? (
                <div className="bg-card/80 backdrop-blur-sm rounded-2xl border border-border p-6 text-center text-muted-foreground text-sm">
                  Complete your first trek to earn badges! 🏔️
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {earnedBadges.map(badge => (
                    <div key={badge.id} className={`rounded-2xl border border-border p-4 text-center ${badge.color} shadow-sm hover:shadow-md transition-all hover:scale-[1.03] active:scale-[0.97] cursor-default`}>
                      <div className="text-3xl mb-2">{badge.emoji}</div>
                      <div className="font-medium text-sm">{badge.name}</div>
                      <div className="text-xs opacity-70 mt-1">{badge.description}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </ScrollReveal>

          {/* Add completed trek */}
          <ScrollReveal delay={120}>
            <div className="bg-card/80 backdrop-blur-sm rounded-2xl border border-border p-6 mb-8 shadow-sm">
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
                  className="px-5 py-2.5 rounded-lg trek-gradient text-primary-foreground text-sm font-medium shadow hover:shadow-md active:scale-[0.97] disabled:opacity-50 transition-all"
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
              <div className="bg-card/80 backdrop-blur-sm rounded-2xl border border-border p-8 text-center text-muted-foreground text-sm">
                No treks completed yet. Start logging your adventures!
              </div>
            ) : (
              <div className="space-y-3">
                {completedTrekData.map(trek => (
                  <div key={trek.id} className="bg-card/80 backdrop-blur-sm rounded-2xl border border-border p-5 flex items-center gap-4 shadow-sm hover:shadow-md transition-all">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <Mountain className="h-4 w-4 text-primary" />
                    </div>
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
    </>
  );
};

export default Profile;
