import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useAdmin } from "@/hooks/useAdmin";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Shield, Check, X, Trash2, Mountain, Home, Briefcase, MessageSquare, Star, Image, FileText, Plus, Edit2, Eye, EyeOff, MapPin, Phone, Coffee } from "lucide-react";
import ScrollReveal from "@/components/ScrollReveal";
import { treks } from "@/data/treks";

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
  const [blogPosts, setBlogPosts] = useState<any[]>([]);
  const [teaHouses, setTeaHouses] = useState<any[]>([]);
  const [trekOverrides, setTrekOverrides] = useState<any[]>([]);
  const [tab, setTab] = useState<"sherpas" | "guesthouses" | "agencies" | "experiences" | "reviews" | "blog" | "teahouses" | "treks">("sherpas");

  // Blog form state
  const [showBlogForm, setShowBlogForm] = useState(false);
  const [editingPost, setEditingPost] = useState<any>(null);
  const [blogForm, setBlogForm] = useState({ title: "", slug: "", excerpt: "", content: "", cover_image_url: "", tags: "", published: false });
  const [blogSubmitting, setBlogSubmitting] = useState(false);

  // Tea house form state
  const [showTeaHouseForm, setShowTeaHouseForm] = useState(false);
  const [editingTeaHouse, setEditingTeaHouse] = useState<any>(null);
  const [teaHouseForm, setTeaHouseForm] = useState({ trek_id: "", village: "", name: "", contact_number: "", facilities: "", price_range: "", description: "" });
  const [teaHouseSubmitting, setTeaHouseSubmitting] = useState(false);

  // Trek edit form state
  const [showTrekForm, setShowTrekForm] = useState(false);
  const [editingTrek, setEditingTrek] = useState<string | null>(null);
  const [trekForm, setTrekForm] = useState({ description: "", highlights: "", itinerary_json: "" });
  const [trekSubmitting, setTrekSubmitting] = useState(false);
  const [trekSearchQuery, setTrekSearchQuery] = useState("");

  useEffect(() => {
    if (!authLoading && !adminLoading) {
      if (!user || !isAdmin) navigate("/");
    }
  }, [user, isAdmin, authLoading, adminLoading]);

  const fetchAll = async () => {
    const [s, g, a, e, sr, gr, ar, tr, bp, th, to] = await Promise.all([
      supabase.from("sherpa_listings").select("*").order("created_at", { ascending: false }),
      supabase.from("guesthouse_listings").select("*").order("created_at", { ascending: false }),
      supabase.from("agency_listings").select("*").order("created_at", { ascending: false }),
      supabase.from("experiences").select("*, profiles(display_name)").order("created_at", { ascending: false }),
      supabase.from("sherpa_reviews").select("*").order("created_at", { ascending: false }),
      supabase.from("guesthouse_reviews").select("*").order("created_at", { ascending: false }),
      supabase.from("agency_reviews").select("*").order("created_at", { ascending: false }),
      supabase.from("trek_reviews").select("*").order("created_at", { ascending: false }),
      supabase.from("blog_posts").select("*").order("created_at", { ascending: false }),
      supabase.from("trek_tea_houses").select("*").order("trek_id").order("village"),
      supabase.from("trek_overrides").select("*").order("trek_id"),
    ]);
    if (s.data) setSherpaListings(s.data);
    if (g.data) setGuesthouseListings(g.data as any[]);
    if (a.data) setAgencyListings(a.data as any[]);
    if (e.data) setExperiences((e.data as any[]).map((x: any) => ({ ...x, display_name: x.profiles?.display_name || "Unknown" })));
    if (sr.data) setSherpaReviews(sr.data as any[]);
    if (gr.data) setGuesthouseReviews(gr.data as any[]);
    if (ar.data) setAgencyReviews(ar.data as any[]);
    if (tr.data) setTrekReviews(tr.data as any[]);
    if (bp.data) setBlogPosts(bp.data as any[]);
    if (th.data) setTeaHouses(th.data as any[]);
    if (to.data) setTrekOverrides(to.data as any[]);
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

  // Blog functions
  const generateSlug = (title: string) => title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

  const openBlogForm = (post?: any) => {
    if (post) {
      setEditingPost(post);
      setBlogForm({ title: post.title, slug: post.slug, excerpt: post.excerpt, content: post.content, cover_image_url: post.cover_image_url || "", tags: (post.tags || []).join(", "), published: post.published });
    } else {
      setEditingPost(null);
      setBlogForm({ title: "", slug: "", excerpt: "", content: "", cover_image_url: "", tags: "", published: false });
    }
    setShowBlogForm(true);
  };

  const handleBlogSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setBlogSubmitting(true);
    const slug = blogForm.slug || generateSlug(blogForm.title);
    const tags = blogForm.tags.split(",").map(t => t.trim()).filter(Boolean);
    const payload = { user_id: user.id, title: blogForm.title, slug, excerpt: blogForm.excerpt, content: blogForm.content, cover_image_url: blogForm.cover_image_url || null, tags, published: blogForm.published };
    if (editingPost) {
      const { error } = await supabase.from("blog_posts").update(payload as any).eq("id", editingPost.id);
      if (error) toast.error("Failed: " + error.message); else toast.success("Post updated!");
    } else {
      const { error } = await supabase.from("blog_posts").insert(payload as any);
      if (error) toast.error("Failed: " + error.message); else toast.success("Post created!");
    }
    setShowBlogForm(false); setEditingPost(null); setBlogSubmitting(false); fetchAll();
  };

  const togglePublish = async (post: any) => {
    await supabase.from("blog_posts").update({ published: !post.published } as any).eq("id", post.id);
    toast.success(post.published ? "Unpublished" : "Published"); fetchAll();
  };

  // Tea house functions
  const openTeaHouseForm = (th?: any) => {
    if (th) {
      setEditingTeaHouse(th);
      setTeaHouseForm({ trek_id: th.trek_id, village: th.village, name: th.name, contact_number: th.contact_number || "", facilities: (th.facilities || []).join(", "), price_range: th.price_range || "", description: th.description || "" });
    } else {
      setEditingTeaHouse(null);
      setTeaHouseForm({ trek_id: "", village: "", name: "", contact_number: "", facilities: "", price_range: "", description: "" });
    }
    setShowTeaHouseForm(true);
  };

  const handleTeaHouseSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTeaHouseSubmitting(true);
    const facilities = teaHouseForm.facilities.split(",").map(f => f.trim()).filter(Boolean);
    const payload = { trek_id: teaHouseForm.trek_id, village: teaHouseForm.village, name: teaHouseForm.name, contact_number: teaHouseForm.contact_number, facilities, price_range: teaHouseForm.price_range, description: teaHouseForm.description };
    if (editingTeaHouse) {
      const { error } = await supabase.from("trek_tea_houses").update(payload as any).eq("id", editingTeaHouse.id);
      if (error) toast.error("Failed: " + error.message); else toast.success("Tea house updated!");
    } else {
      const { error } = await supabase.from("trek_tea_houses").insert(payload as any);
      if (error) toast.error("Failed: " + error.message); else toast.success("Tea house added!");
    }
    setShowTeaHouseForm(false); setEditingTeaHouse(null); setTeaHouseSubmitting(false); fetchAll();
  };

  // Trek edit functions
  const openTrekForm = (trekId: string) => {
    const existing = trekOverrides.find(o => o.trek_id === trekId);
    const baseTrek = treks.find(t => t.id === trekId);
    if (existing) {
      setTrekForm({
        description: existing.description || baseTrek?.description || "",
        highlights: (existing.highlights || baseTrek?.highlights || []).join("\n"),
        itinerary_json: existing.itinerary_json ? JSON.stringify(existing.itinerary_json, null, 2) : JSON.stringify(baseTrek?.itinerary || [], null, 2),
      });
    } else {
      setTrekForm({
        description: baseTrek?.description || "",
        highlights: (baseTrek?.highlights || []).join("\n"),
        itinerary_json: JSON.stringify(baseTrek?.itinerary || [], null, 2),
      });
    }
    setEditingTrek(trekId);
    setShowTrekForm(true);
  };

  const handleTrekSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !editingTrek) return;
    setTrekSubmitting(true);

    let parsedItinerary;
    try {
      parsedItinerary = JSON.parse(trekForm.itinerary_json);
    } catch {
      toast.error("Invalid JSON for itinerary"); setTrekSubmitting(false); return;
    }

    const highlights = trekForm.highlights.split("\n").map(h => h.trim()).filter(Boolean);
    const payload = { trek_id: editingTrek, description: trekForm.description, highlights, itinerary_json: parsedItinerary, updated_by: user.id };

    const existing = trekOverrides.find(o => o.trek_id === editingTrek);
    if (existing) {
      const { error } = await supabase.from("trek_overrides").update(payload as any).eq("id", existing.id);
      if (error) toast.error("Failed: " + error.message); else toast.success("Trek updated!");
    } else {
      const { error } = await supabase.from("trek_overrides").insert(payload as any);
      if (error) toast.error("Failed: " + error.message); else toast.success("Trek override saved!");
    }
    setShowTrekForm(false); setEditingTrek(null); setTrekSubmitting(false); fetchAll();
  };

  const deleteTrekOverride = async (id: string) => {
    await supabase.from("trek_overrides").delete().eq("id", id);
    toast.success("Override removed — trek reverted to default"); fetchAll();
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
    { id: "blog" as const, label: "Blog", icon: FileText, pending: 0 },
    { id: "teahouses" as const, label: "Tea Houses", icon: Coffee, pending: 0 },
    { id: "treks" as const, label: "Treks", icon: MapPin, pending: 0 },
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

  const filteredTreks = trekSearchQuery
    ? treks.filter(t => t.name.toLowerCase().includes(trekSearchQuery.toLowerCase()) || t.region.toLowerCase().includes(trekSearchQuery.toLowerCase()))
    : treks.slice(0, 20);

  const inputClass = "w-full px-3 py-2 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring";

  return (
    <main className="pt-24 pb-16 container mx-auto px-4 min-h-screen max-w-5xl">
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

        {/* Blog Management */}
        {tab === "blog" && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <p className="text-sm text-muted-foreground">{blogPosts.length} article{blogPosts.length !== 1 ? "s" : ""}</p>
              <button onClick={() => openBlogForm()} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg trek-gradient text-primary-foreground font-semibold text-sm shadow-md hover:shadow-lg active:scale-[0.97] transition">
                <Plus className="h-4 w-4" /> New Article
              </button>
            </div>
            {showBlogForm && (
              <ScrollReveal>
                <form onSubmit={handleBlogSubmit} className="bg-card border border-border rounded-xl p-6 mb-8 space-y-4">
                  <h3 className="font-semibold">{editingPost ? "Edit Article" : "New Article"}</h3>
                  <div><label className="block text-sm font-medium mb-1">Title *</label><input required value={blogForm.title} onChange={e => setBlogForm(f => ({ ...f, title: e.target.value, slug: f.slug || generateSlug(e.target.value) }))} className={inputClass} /></div>
                  <div><label className="block text-sm font-medium mb-1">URL Slug</label><input value={blogForm.slug} onChange={e => setBlogForm(f => ({ ...f, slug: e.target.value }))} placeholder="auto-generated-from-title" className={inputClass} /></div>
                  <div><label className="block text-sm font-medium mb-1">Excerpt *</label><textarea required rows={2} value={blogForm.excerpt} onChange={e => setBlogForm(f => ({ ...f, excerpt: e.target.value }))} placeholder="Brief description for SEO and previews" className={inputClass + " resize-none"} /></div>
                  <div><label className="block text-sm font-medium mb-1">Cover Image URL</label><input value={blogForm.cover_image_url} onChange={e => setBlogForm(f => ({ ...f, cover_image_url: e.target.value }))} placeholder="https://..." className={inputClass} /></div>
                  <div><label className="block text-sm font-medium mb-1">Tags (comma-separated)</label><input value={blogForm.tags} onChange={e => setBlogForm(f => ({ ...f, tags: e.target.value }))} placeholder="safety, gear, tips" className={inputClass} /></div>
                  <div><label className="block text-sm font-medium mb-1">Content (Markdown) *</label><textarea required rows={12} value={blogForm.content} onChange={e => setBlogForm(f => ({ ...f, content: e.target.value }))} placeholder="Write your article in Markdown..." className={inputClass + " font-mono resize-y"} /></div>
                  <div className="flex items-center gap-3"><label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={blogForm.published} onChange={e => setBlogForm(f => ({ ...f, published: e.target.checked }))} className="rounded" /> Publish immediately</label></div>
                  <div className="flex gap-2">
                    <button type="submit" disabled={blogSubmitting} className="px-6 py-2 rounded-lg trek-gradient text-primary-foreground text-sm font-semibold disabled:opacity-60 active:scale-[0.97] transition">{blogSubmitting ? "Saving…" : editingPost ? "Update" : "Create"}</button>
                    <button type="button" onClick={() => { setShowBlogForm(false); setEditingPost(null); }} className="px-6 py-2 rounded-lg border border-border text-sm hover:bg-muted transition-colors active:scale-95">Cancel</button>
                  </div>
                </form>
              </ScrollReveal>
            )}
            {blogPosts.length === 0 && !showBlogForm ? (
              <p className="text-muted-foreground text-center py-8">No blog posts yet. Create your first article!</p>
            ) : blogPosts.map(post => (
              <div key={post.id} className="bg-card rounded-xl border border-border p-5 flex items-center gap-4 mb-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-medium">{post.title}</span>
                    {post.published ? <span className="text-xs text-trek-moss bg-trek-moss/10 px-2 py-0.5 rounded-full">Published</span> : <span className="text-xs text-yellow-700 bg-yellow-100 px-2 py-0.5 rounded-full">Draft</span>}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">/blog/{post.slug} · {new Date(post.created_at).toLocaleDateString()}</p>
                  {post.tags?.length > 0 && <div className="flex gap-1 mt-1">{post.tags.map((t: string) => <span key={t} className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded-full">{t}</span>)}</div>}
                </div>
                <div className="flex gap-2 shrink-0">
                  <button onClick={() => togglePublish(post)} className="p-2 rounded-lg bg-muted text-muted-foreground hover:text-foreground transition-colors active:scale-95" title={post.published ? "Unpublish" : "Publish"}>{post.published ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button>
                  <button onClick={() => openBlogForm(post)} className="p-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors active:scale-95"><Edit2 className="h-4 w-4" /></button>
                  <button onClick={() => deleteItem("blog_posts", post.id)} className="p-2 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors active:scale-95"><Trash2 className="h-4 w-4" /></button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tea House Management */}
        {tab === "teahouses" && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <p className="text-sm text-muted-foreground">{teaHouses.length} tea house{teaHouses.length !== 1 ? "s" : ""}</p>
              <button onClick={() => openTeaHouseForm()} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg trek-gradient text-primary-foreground font-semibold text-sm shadow-md hover:shadow-lg active:scale-[0.97] transition">
                <Plus className="h-4 w-4" /> Add Tea House
              </button>
            </div>
            {showTeaHouseForm && (
              <ScrollReveal>
                <form onSubmit={handleTeaHouseSubmit} className="bg-card border border-border rounded-xl p-6 mb-8 space-y-4">
                  <h3 className="font-semibold">{editingTeaHouse ? "Edit Tea House" : "Add Tea House"}</h3>
                  <div>
                    <label className="block text-sm font-medium mb-1">Trek *</label>
                    <select required value={teaHouseForm.trek_id} onChange={e => setTeaHouseForm(f => ({ ...f, trek_id: e.target.value }))} className={inputClass}>
                      <option value="">Select a trek...</option>
                      {treks.map(t => <option key={t.id} value={t.id}>{t.name} ({t.region})</option>)}
                    </select>
                  </div>
                  <div><label className="block text-sm font-medium mb-1">Village/Stop Name *</label><input required value={teaHouseForm.village} onChange={e => setTeaHouseForm(f => ({ ...f, village: e.target.value }))} placeholder="e.g. Sankri, Juda Ka Talab" className={inputClass} /></div>
                  <div><label className="block text-sm font-medium mb-1">Tea House Name *</label><input required value={teaHouseForm.name} onChange={e => setTeaHouseForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. Mountain View Lodge" className={inputClass} /></div>
                  <div className="grid grid-cols-2 gap-4">
                    <div><label className="block text-sm font-medium mb-1">Contact Number</label><input value={teaHouseForm.contact_number} onChange={e => setTeaHouseForm(f => ({ ...f, contact_number: e.target.value }))} placeholder="+91 XXXXX XXXXX" className={inputClass} /></div>
                    <div><label className="block text-sm font-medium mb-1">Price Range</label><input value={teaHouseForm.price_range} onChange={e => setTeaHouseForm(f => ({ ...f, price_range: e.target.value }))} placeholder="₹500-1000/night" className={inputClass} /></div>
                  </div>
                  <div><label className="block text-sm font-medium mb-1">Facilities (comma-separated)</label><input value={teaHouseForm.facilities} onChange={e => setTeaHouseForm(f => ({ ...f, facilities: e.target.value }))} placeholder="Hot Water, WiFi, Meals, Charging, Heater" className={inputClass} /></div>
                  <div><label className="block text-sm font-medium mb-1">Description</label><textarea rows={2} value={teaHouseForm.description} onChange={e => setTeaHouseForm(f => ({ ...f, description: e.target.value }))} placeholder="Brief description..." className={inputClass + " resize-none"} /></div>
                  <div className="flex gap-2">
                    <button type="submit" disabled={teaHouseSubmitting} className="px-6 py-2 rounded-lg trek-gradient text-primary-foreground text-sm font-semibold disabled:opacity-60 active:scale-[0.97] transition">{teaHouseSubmitting ? "Saving…" : editingTeaHouse ? "Update" : "Add"}</button>
                    <button type="button" onClick={() => { setShowTeaHouseForm(false); setEditingTeaHouse(null); }} className="px-6 py-2 rounded-lg border border-border text-sm hover:bg-muted transition-colors active:scale-95">Cancel</button>
                  </div>
                </form>
              </ScrollReveal>
            )}
            {teaHouses.length === 0 && !showTeaHouseForm ? (
              <p className="text-muted-foreground text-center py-8">No tea houses yet. Add your first one!</p>
            ) : teaHouses.map(th => {
              const trekName = treks.find(t => t.id === th.trek_id)?.name || th.trek_id;
              return (
                <div key={th.id} className="bg-card rounded-xl border border-border p-5 flex items-center gap-4 mb-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Coffee className="h-4 w-4 text-primary" />
                      <span className="font-medium">{th.name}</span>
                      <span className="text-xs bg-muted px-2 py-0.5 rounded-full">{th.village}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      <span className="text-primary">{trekName}</span>
                      {th.contact_number && <> · <Phone className="h-3 w-3 inline" /> {th.contact_number}</>}
                      {th.price_range && <> · {th.price_range}</>}
                    </p>
                    {th.facilities?.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1">{th.facilities.map((f: string) => <span key={f} className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded-full">{f}</span>)}</div>
                    )}
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button onClick={() => openTeaHouseForm(th)} className="p-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors active:scale-95"><Edit2 className="h-4 w-4" /></button>
                    <button onClick={() => deleteItem("trek_tea_houses", th.id)} className="p-2 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors active:scale-95"><Trash2 className="h-4 w-4" /></button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Trek Content Management */}
        {tab === "treks" && (
          <div>
            <div className="mb-6">
              <p className="text-sm text-muted-foreground mb-3">Edit trek descriptions, highlights, and itinerary data. Changes override the default content.</p>
              <input value={trekSearchQuery} onChange={e => setTrekSearchQuery(e.target.value)} placeholder="Search treks by name or region..." className={inputClass} />
            </div>

            {showTrekForm && editingTrek && (
              <ScrollReveal>
                <form onSubmit={handleTrekSubmit} className="bg-card border border-border rounded-xl p-6 mb-8 space-y-4">
                  <h3 className="font-semibold">Edit: {treks.find(t => t.id === editingTrek)?.name}</h3>
                  <div><label className="block text-sm font-medium mb-1">Description</label><textarea rows={4} value={trekForm.description} onChange={e => setTrekForm(f => ({ ...f, description: e.target.value }))} className={inputClass + " resize-y"} /></div>
                  <div><label className="block text-sm font-medium mb-1">Highlights (one per line)</label><textarea rows={4} value={trekForm.highlights} onChange={e => setTrekForm(f => ({ ...f, highlights: e.target.value }))} className={inputClass + " resize-y"} /></div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Itinerary (JSON)</label>
                    <p className="text-[11px] text-muted-foreground mb-2">Each item: {`{ "day": 1, "title": "...", "description": "...", "distance": "...", "elevation": "...", "townName": "...", "townDescription": "...", "townAltitude": 1920 }`}</p>
                    <textarea rows={16} value={trekForm.itinerary_json} onChange={e => setTrekForm(f => ({ ...f, itinerary_json: e.target.value }))} className={inputClass + " font-mono text-xs resize-y"} />
                  </div>
                  <div className="flex gap-2">
                    <button type="submit" disabled={trekSubmitting} className="px-6 py-2 rounded-lg trek-gradient text-primary-foreground text-sm font-semibold disabled:opacity-60 active:scale-[0.97] transition">{trekSubmitting ? "Saving…" : "Save Changes"}</button>
                    <button type="button" onClick={() => { setShowTrekForm(false); setEditingTrek(null); }} className="px-6 py-2 rounded-lg border border-border text-sm hover:bg-muted transition-colors active:scale-95">Cancel</button>
                  </div>
                </form>
              </ScrollReveal>
            )}

            <div className="space-y-2">
              {filteredTreks.map(t => {
                const hasOverride = trekOverrides.some(o => o.trek_id === t.id);
                const teaHouseCount = teaHouses.filter(th => th.trek_id === t.id).length;
                return (
                  <div key={t.id} className={`bg-card rounded-xl border p-4 flex items-center gap-4 ${hasOverride ? "border-primary/30" : "border-border"}`}>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-medium text-sm">{t.name}</span>
                        <span className="text-[10px] bg-muted px-2 py-0.5 rounded-full">{t.region}, {t.state}</span>
                        <span className="text-[10px] bg-muted px-2 py-0.5 rounded-full">{t.durationDays}d</span>
                        {hasOverride && <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full">✏️ Edited</span>}
                        {teaHouseCount > 0 && <span className="text-[10px] bg-trek-moss/10 text-trek-moss px-2 py-0.5 rounded-full">☕ {teaHouseCount} tea houses</span>}
                      </div>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <button onClick={() => openTrekForm(t.id)} className="p-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors active:scale-95"><Edit2 className="h-4 w-4" /></button>
                      {hasOverride && (
                        <button onClick={() => { const o = trekOverrides.find(x => x.trek_id === t.id); if (o) deleteTrekOverride(o.id); }} className="p-2 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors active:scale-95" title="Revert to default"><Trash2 className="h-4 w-4" /></button>
                      )}
                    </div>
                  </div>
                );
              })}
              {filteredTreks.length === 0 && <p className="text-muted-foreground text-center py-8">No treks found</p>}
              {!trekSearchQuery && treks.length > 20 && <p className="text-xs text-muted-foreground text-center py-2">Showing first 20 treks. Use search to find more.</p>}
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default Admin;
