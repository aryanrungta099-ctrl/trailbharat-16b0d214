import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useAdmin } from "@/hooks/useAdmin";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Shield, Check, X, Trash2, Mountain, Home } from "lucide-react";
import ScrollReveal from "@/components/ScrollReveal";

const Admin = () => {
  const { user, loading: authLoading } = useAuth();
  const { isAdmin, loading: adminLoading } = useAdmin();
  const navigate = useNavigate();
  const [sherpaListings, setSherpaListings] = useState<any[]>([]);
  const [guesthouseListings, setGuesthouseListings] = useState<any[]>([]);
  const [tab, setTab] = useState<"sherpas" | "guesthouses">("sherpas");

  useEffect(() => {
    if (!authLoading && !adminLoading) {
      if (!user || !isAdmin) navigate("/");
    }
  }, [user, isAdmin, authLoading, adminLoading]);

  const fetchAll = async () => {
    const { data: s } = await supabase.from("sherpa_listings").select("*").order("created_at", { ascending: false });
    if (s) setSherpaListings(s);
    const { data: g } = await supabase.from("guesthouse_listings" as any).select("*").order("created_at", { ascending: false });
    if (g) setGuesthouseListings(g as any[]);
  };

  useEffect(() => { if (isAdmin) fetchAll(); }, [isAdmin]);

  const approveSherpa = async (id: string) => {
    await supabase.from("sherpa_listings").update({ approved: true } as any).eq("id", id);
    toast.success("Sherpa approved"); fetchAll();
  };

  const approveGuesthouse = async (id: string) => {
    await supabase.from("guesthouse_listings" as any).update({ approved: true } as any).eq("id", id);
    toast.success("Guesthouse approved"); fetchAll();
  };

  const deleteSherpa = async (id: string) => {
    await supabase.from("sherpa_listings").delete().eq("id", id);
    toast.success("Sherpa deleted"); fetchAll();
  };

  const deleteGuesthouse = async (id: string) => {
    await supabase.from("guesthouse_listings" as any).delete().eq("id", id);
    toast.success("Guesthouse deleted"); fetchAll();
  };

  if (authLoading || adminLoading || !isAdmin) return null;

  const pendingSherpas = sherpaListings.filter(s => !s.approved);
  const pendingGuesthouses = guesthouseListings.filter(g => !g.approved);

  return (
    <main className="pt-24 pb-16 container mx-auto px-4 min-h-screen max-w-4xl">
      <ScrollReveal>
        <div className="flex items-center gap-3 mb-8">
          <Shield className="h-7 w-7 text-primary" />
          <h1>Admin Dashboard</h1>
        </div>

        <div className="flex gap-2 mb-6">
          <button onClick={() => setTab("sherpas")} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all active:scale-[0.97] ${tab === "sherpas" ? "trek-gradient text-primary-foreground shadow" : "bg-muted text-muted-foreground"}`}>
            <Mountain className="h-4 w-4 inline mr-1.5" /> Sherpa Listings ({pendingSherpas.length} pending)
          </button>
          <button onClick={() => setTab("guesthouses")} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all active:scale-[0.97] ${tab === "guesthouses" ? "trek-gradient text-primary-foreground shadow" : "bg-muted text-muted-foreground"}`}>
            <Home className="h-4 w-4 inline mr-1.5" /> Guesthouse Listings ({pendingGuesthouses.length} pending)
          </button>
        </div>
      </ScrollReveal>

      {tab === "sherpas" && (
        <div className="space-y-4">
          {sherpaListings.length === 0 ? <p className="text-muted-foreground text-center py-8">No sherpa listings</p> :
            sherpaListings.map(s => (
              <div key={s.id} className={`bg-card rounded-xl border p-5 flex items-center gap-4 ${s.approved ? "border-border" : "border-yellow-400/50 bg-yellow-50/30"}`}>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-medium">{s.name}</span>
                    {s.approved ? <span className="text-xs text-trek-moss bg-trek-moss/10 px-2 py-0.5 rounded-full">✅ Approved</span> : <span className="text-xs text-yellow-700 bg-yellow-100 px-2 py-0.5 rounded-full">⏳ Pending</span>}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{s.treks_guided} · {s.contact_number}</p>
                </div>
                <div className="flex gap-2 shrink-0">
                  {!s.approved && <button onClick={() => approveSherpa(s.id)} className="p-2 rounded-lg bg-trek-moss/10 text-trek-moss hover:bg-trek-moss/20 transition-colors active:scale-95"><Check className="h-4 w-4" /></button>}
                  <button onClick={() => deleteSherpa(s.id)} className="p-2 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors active:scale-95"><Trash2 className="h-4 w-4" /></button>
                </div>
              </div>
            ))
          }
        </div>
      )}

      {tab === "guesthouses" && (
        <div className="space-y-4">
          {guesthouseListings.length === 0 ? <p className="text-muted-foreground text-center py-8">No guesthouse listings</p> :
            guesthouseListings.map(g => (
              <div key={g.id} className={`bg-card rounded-xl border p-5 flex items-center gap-4 ${g.approved ? "border-border" : "border-yellow-400/50 bg-yellow-50/30"}`}>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-medium">{g.name}</span>
                    {g.approved ? <span className="text-xs text-trek-moss bg-trek-moss/10 px-2 py-0.5 rounded-full">✅ Approved</span> : <span className="text-xs text-yellow-700 bg-yellow-100 px-2 py-0.5 rounded-full">⏳ Pending</span>}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{g.location} · {g.trek_region} · {g.contact_number}</p>
                </div>
                <div className="flex gap-2 shrink-0">
                  {!g.approved && <button onClick={() => approveGuesthouse(g.id)} className="p-2 rounded-lg bg-trek-moss/10 text-trek-moss hover:bg-trek-moss/20 transition-colors active:scale-95"><Check className="h-4 w-4" /></button>}
                  <button onClick={() => deleteGuesthouse(g.id)} className="p-2 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors active:scale-95"><Trash2 className="h-4 w-4" /></button>
                </div>
              </div>
            ))
          }
        </div>
      )}
    </main>
  );
};

export default Admin;
