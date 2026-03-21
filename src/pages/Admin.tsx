import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useAdmin } from "@/hooks/useAdmin";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Shield, Check, X, Trash2, Mountain, Home, Briefcase, MessageSquare, Star, Image } from "lucide-react";
import ScrollReveal from "@/components/ScrollReveal";

const Admin = () => {
  const { user, loading: authLoading } = useAuth();
  const { isAdmin, loading: adminLoading } = useAdmin();
  const navigate = useNavigate();
  const [sherpaListings, setSherpaListings] = useState<any[]>([]);
  const [guesthouseListings, setGuesthouseListings] = useState<any[]>([]);
  const [agencyListings, setAgencyListings] = useState<any[]>([]);
  const [experiences, setExperiences] = useState<any[]>([]);
  const [sherpaReviews, setSherpaReviews] = useState<any[]>([]);
  const [guesthouseReviews, setGuesthouseReviews] = useState<any[]>([]);
  const [agencyReviews, setAgencyReviews] = useState<any[]>([]);
  const [trekReviews, setTrekReviews] = useState<any[]>([]);
  const [tab, setTab] = useState<"sherpas" | "guesthouses" | "agencies" | "experiences" | "reviews">("sherpas");

  useEffect(() => {
    if (!authLoading && !adminLoading) {
      if (!user || !isAdmin) navigate("/");
    }
  }, [user, isAdmin, authLoading, adminLoading]);

  const fetchAll = async () => {
    const [s, g, a, e, sr, gr, ar, tr] = await Promise.all([
      supabase.from("sherpa_listings").select("*").order("created_at", { ascending: false }),
      supabase.from("guesthouse_listings" as any).select("*").order("created_at", { ascending: false }),
      supabase.from("agency_listings" as any).select("*").order("created_at", { ascending: false }),
      supabase.from("experiences").select("*, profiles(display_name)").order("created_at", { ascending: false }),
      supabase.from("sherpa_reviews" as any).select("*").order("created_at", { ascending: false }),
      supabase.from("guesthouse_reviews" as any).select("*").order("created_at", { ascending: false }),
      supabase.from("agency_reviews" as any).select("*").order("created_at", { ascending: false }),
      supabase.from("trek_reviews" as any).select("*").order("created_at", { ascending: false }),
    ]);
    if (s.data) setSherpaListings(s.data);
    if (g.data) setGuesthouseListings(g.data as any[]);
    if (a.data) setAgencyListings(a.data as any[]);
    if (e.data) setExperiences((e.data as any[]).map((x: any) => ({ ...x, display_name: x.profiles?.display_name || "Unknown" })));
    if (sr.data) setSherpaReviews(sr.data as any[]);
    if (gr.data) setGuesthouseReviews(gr.data as any[]);
    if (ar.data) setAgencyReviews(ar.data as any[]);
    if (tr.data) setTrekReviews(tr.data as any[]);
  };

  useEffect(() => { if (isAdmin) fetchAll(); }, [isAdmin]);

  const approve = async (table: string, id: string) => {
    await supabase.from(table as any).update({ approved: true } as any).eq("id", id);
    toast.success("Approved"); fetchAll();
  };

  const approveExperience = async (id: string) => {
    await supabase.from("experiences").update({ approved: true } as any).eq("id", id);
    toast.success("Experience approved"); fetchAll();
  };

  const deleteItem = async (table: string, id: string) => {
    await supabase.from(table as any).delete().eq("id", id);
    toast.success("Deleted"); fetchAll();
  };

  if (authLoading || adminLoading || !isAdmin) return null;

  const pendingSherpas = sherpaListings.filter(s => !s.approved);
  const pendingGuesthouses = guesthouseListings.filter(g => !g.approved);
  const pendingAgencies = agencyListings.filter(a => !a.approved);
  const pendingExperiences = experiences.filter(e => !e.approved);

  const tabs = [
    { id: "sherpas" as const, label: "Sherpas", icon: Mountain, pending: pendingSherpas.length },
    { id: "guesthouses" as const, label: "Guesthouses", icon: Home, pending: pendingGuesthouses.length },
    { id: "agencies" as const, label: "Agencies", icon: Briefcase, pending: pendingAgencies.length },
    { id: "experiences" as const, label: "Experiences", icon: MessageSquare, pending: pendingExperiences.length },
    { id: "reviews" as const, label: "Reviews", icon: Star, pending: 0 },
  ];

  const renderListingRows = (items: any[], table: string, nameKey = "name") => (
    items.length === 0 ? <p className="text-muted-foreground text-center py-8">No items</p> :
    items.map(item => (
      <div key={item.id} className={`bg-card rounded-xl border p-5 flex items-center gap-4 ${item.approved === false ? "border-yellow-400/50 bg-yellow-50/30" : "border-border"}`}>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-medium">{item[nameKey]}</span>
            {item.approved === true && <span className="text-xs text-trek-moss bg-trek-moss/10 px-2 py-0.5 rounded-full">✅ Approved</span>}
            {item.approved === false && <span className="text-xs text-yellow-700 bg-yellow-100 px-2 py-0.5 rounded-full">⏳ Pending</span>}
          </div>
          <p className="text-xs text-muted-foreground mt-1 truncate">{item.contact_number || item.trek_name || ""}</p>
        </div>
        <div className="flex gap-2 shrink-0">
          {item.approved === false && <button onClick={() => table === "experiences" ? approveExperience(item.id) : approve(table, item.id)} className="p-2 rounded-lg bg-trek-moss/10 text-trek-moss hover:bg-trek-moss/20 transition-colors active:scale-95"><Check className="h-4 w-4" /></button>}
          <button onClick={() => deleteItem(table, item.id)} className="p-2 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors active:scale-95"><Trash2 className="h-4 w-4" /></button>
        </div>
      </div>
    ))
  );

  const allReviews = [
    ...sherpaReviews.map(r => ({ ...r, _type: "Sherpa", _table: "sherpa_reviews" })),
    ...guesthouseReviews.map(r => ({ ...r, _type: "Guesthouse", _table: "guesthouse_reviews" })),
    ...agencyReviews.map(r => ({ ...r, _type: "Agency", _table: "agency_reviews" })),
    ...trekReviews.map(r => ({ ...r, _type: "Trek", _table: "trek_reviews" })),
  ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  return (
    <main className="pt-24 pb-16 container mx-auto px-4 min-h-screen max-w-4xl">
      <ScrollReveal>
        <div className="flex items-center gap-3 mb-8">
          <Shield className="h-7 w-7 text-primary" />
          <h1>Admin Dashboard</h1>
        </div>

        <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all active:scale-[0.97] ${tab === t.id ? "trek-gradient text-primary-foreground shadow" : "bg-muted text-muted-foreground"}`}>
              <t.icon className="h-4 w-4" /> {t.label}
              {t.pending > 0 && <span className="bg-destructive text-destructive-foreground text-[10px] px-1.5 rounded-full">{t.pending}</span>}
            </button>
          ))}
        </div>
      </ScrollReveal>

      <div className="space-y-4">
        {tab === "sherpas" && renderListingRows(sherpaListings, "sherpa_listings")}
        {tab === "guesthouses" && renderListingRows(guesthouseListings, "guesthouse_listings")}
        {tab === "agencies" && renderListingRows(agencyListings, "agency_listings")}
        {tab === "experiences" && (
          experiences.length === 0 ? <p className="text-muted-foreground text-center py-8">No experiences</p> :
          experiences.map(exp => (
            <div key={exp.id} className={`bg-card rounded-xl border p-5 ${exp.approved ? "border-border" : "border-yellow-400/50 bg-yellow-50/30"}`}>
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-medium">{exp.display_name}</span>
                    <span className="text-xs text-muted-foreground">{exp.trek_name}</span>
                    <span className="text-trek-sunrise text-xs">{"★".repeat(exp.rating)}</span>
                    {exp.approved ? <span className="text-xs text-trek-moss bg-trek-moss/10 px-2 py-0.5 rounded-full">✅ Approved</span> : <span className="text-xs text-yellow-700 bg-yellow-100 px-2 py-0.5 rounded-full">⏳ Pending</span>}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{exp.story}</p>
                  {exp.photo_urls && exp.photo_urls.length > 0 && (
                    <div className="flex gap-1 mt-2">{exp.photo_urls.map((u: string, i: number) => <img key={i} src={u} alt="" className="h-10 w-14 rounded object-cover border border-border" />)}</div>
                  )}
                </div>
                <div className="flex gap-2 shrink-0 ml-4">
                  {!exp.approved && <button onClick={() => approveExperience(exp.id)} className="p-2 rounded-lg bg-trek-moss/10 text-trek-moss hover:bg-trek-moss/20 transition-colors active:scale-95"><Check className="h-4 w-4" /></button>}
                  <button onClick={() => deleteItem("experiences", exp.id)} className="p-2 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors active:scale-95"><Trash2 className="h-4 w-4" /></button>
                </div>
              </div>
            </div>
          ))
        )}
        {tab === "reviews" && (
          allReviews.length === 0 ? <p className="text-muted-foreground text-center py-8">No reviews</p> :
          allReviews.map(r => (
            <div key={`${r._type}-${r.id}`} className="bg-card rounded-xl border border-border p-5 flex items-center gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs bg-muted px-2 py-0.5 rounded-full font-medium">{r._type}</span>
                  <span className="text-trek-sunrise text-xs">{"★".repeat(r.rating)}</span>
                  <span className="text-xs text-muted-foreground">{new Date(r.created_at).toLocaleDateString()}</span>
                </div>
                {r.comment && <p className="text-xs text-muted-foreground mt-1">{r.comment}</p>}
              </div>
              <button onClick={() => deleteItem(r._table, r.id)} className="p-2 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors active:scale-95 shrink-0"><Trash2 className="h-4 w-4" /></button>
            </div>
          ))
        )}
      </div>
    </main>
  );
};

export default Admin;
