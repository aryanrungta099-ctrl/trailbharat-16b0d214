import { useState, useEffect, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { User, Award, Mountain, MapPin, TrendingUp, Calendar } from "lucide-react";
import TrekCollectionCard from "@/components/TrekCollectionCard";
import { supabase } from "@/integrations/supabase/client";
import { treks } from "@/data/treks";
import { getEarnedBadges } from "@/data/badges";
import ScrollReveal from "@/components/ScrollReveal";
import SEOHead from "@/components/SEOHead";

const PublicProfile = () => {
  const { userId } = useParams();
  const [profile, setProfile] = useState<{ display_name: string; bio: string | null; avatar_url: string | null } | null>(null);
  const [completedTrekIds, setCompletedTrekIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;
    Promise.all([
      supabase.from("public_profiles").select("display_name, bio, avatar_url").eq("user_id", userId).maybeSingle(),
      supabase.from("completed_treks").select("trek_id").eq("user_id", userId),
    ]).then(([{ data: prof }, { data: ct }]) => {
      if (prof) setProfile(prof);
      if (ct) setCompletedTrekIds(ct.map((d: any) => d.trek_id));
      setLoading(false);
    });
  }, [userId]);

  const earnedBadges = useMemo(() => getEarnedBadges(completedTrekIds, treks), [completedTrekIds]);
  const completedTrekData = treks.filter(t => completedTrekIds.includes(t.id));

  if (loading) return <main className="pt-24 pb-16 min-h-screen flex items-center justify-center"><p className="text-muted-foreground">Loading…</p></main>;
  if (!profile) return <main className="pt-24 pb-16 min-h-screen flex items-center justify-center"><p className="text-muted-foreground">Profile not found</p></main>;

  const displayName = profile.display_name || "Trekker";

  return (
    <main className="pt-24 pb-16 min-h-screen relative overflow-hidden">
      <SEOHead
        title={`${displayName}'s Profile`}
        description={`View ${displayName}'s trekking badges and completed treks on Himalayan Trails.`}
        path={`/profile/${userId}`}
      />
      {/* Mountain background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-trek-forest/5 via-background to-trek-earth/5" />
        <svg className="absolute bottom-0 left-0 right-0 w-full opacity-[0.04]" viewBox="0 0 1440 320" preserveAspectRatio="none">
          <path fill="currentColor" className="text-trek-forest" d="M0,224L60,213.3C120,203,240,181,360,186.7C480,192,600,224,720,229.3C840,235,960,213,1080,186.7C1200,160,1320,128,1380,112L1440,96L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z" />
        </svg>
      </div>

      <div className="container mx-auto px-4 max-w-3xl">
        <ScrollReveal>
          <div className="bg-card/80 backdrop-blur-sm rounded-2xl border border-border p-8 mb-8 shadow-lg relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 trek-gradient" />
            <div className="flex items-center gap-5 mb-5">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center ring-4 ring-primary/5 shadow-md">
                {profile.avatar_url ? <img src={profile.avatar_url} className="w-20 h-20 rounded-full object-cover" alt="" /> : <User className="h-9 w-9 text-primary" />}
              </div>
              <div>
                <h1 className="text-2xl font-display font-bold">{profile.display_name}</h1>
                {profile.bio && <p className="text-muted-foreground text-sm mt-1">{profile.bio}</p>}
              </div>
            </div>
            <div className="flex gap-6 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5 bg-primary/5 px-3 py-1.5 rounded-full"><Mountain className="h-4 w-4 text-primary" /> {completedTrekIds.length} treks</span>
              <span className="flex items-center gap-1.5 bg-primary/5 px-3 py-1.5 rounded-full"><Award className="h-4 w-4 text-primary" /> {earnedBadges.length} badges</span>
            </div>
          </div>
        </ScrollReveal>

        {/* Badges with icons */}
        <ScrollReveal delay={80}>
          <div className="mb-8">
            <h2 className="text-lg font-display font-semibold mb-4 flex items-center gap-2"><Award className="h-5 w-5 text-primary" /> Badges</h2>
            {earnedBadges.length === 0 ? (
              <p className="text-muted-foreground text-sm">No badges yet</p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {earnedBadges.map(badge => (
                  <div key={badge.id} className={`rounded-2xl border border-border p-4 text-center ${badge.color} shadow-sm`}>
                    <div className="text-3xl mb-2">{badge.emoji}</div>
                    <div className="font-medium text-sm">{badge.name}</div>
                    <div className="text-xs opacity-70 mt-1">{badge.description}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </ScrollReveal>

        {/* Trek Collection Cards */}
        <ScrollReveal delay={120}>
          <h2 className="text-lg font-display font-semibold mb-4 flex items-center gap-2">
            <Mountain className="h-5 w-5 text-primary" /> {displayName}'s Collection
          </h2>
          {completedTrekData.length === 0 ? (
            <p className="text-muted-foreground text-sm">No treks completed yet</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {completedTrekData.map(trek => (
                <TrekCollectionCard key={trek.id} trek={trek} />
              ))}
            </div>
          )}
        </ScrollReveal>
      </div>
    </main>
  );
};

export default PublicProfile;
