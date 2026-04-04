import { useState, useEffect, useMemo } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Phone, IndianRupee, Briefcase, Plus, X, Upload, Trash2, Star, MessageSquare, ChevronDown, ChevronUp, Globe, Mail, Users, Calendar, ArrowRight, Search, SlidersHorizontal, BadgeCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { treks } from "@/data/treks";
import ScrollReveal from "@/components/ScrollReveal";
import { moderateContent } from "@/lib/moderation";
import SEOHead, { breadcrumbSchema } from "@/components/SEOHead";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;

interface AgencyListing {
  id: string; user_id: string; name: string; logo_url: string | null;
  description: string; website: string | null; contact_number: string;
  email: string | null; treks_offered: string[]; price_range_min: number;
  price_range_max: number; established_year: number | null; team_size: number | null;
  approved: boolean; created_at: string;
}

interface AgencyReview {
  id: string; agency_listing_id: string; user_id: string; rating: number;
  comment: string; created_at: string; display_name?: string;
}

function StarRating({ rating, onRate, interactive = false, size = "h-4 w-4" }: { rating: number; onRate?: (r: number) => void; interactive?: boolean; size?: string }) {
  return (
    <span className="inline-flex gap-0.5">
      {[1, 2, 3, 4, 5].map(n => (
        <Star key={n} className={`${size} transition-colors ${n <= rating ? "fill-amber-400 text-amber-400" : "text-muted-foreground/30"} ${interactive ? "cursor-pointer hover:text-amber-400" : ""}`} onClick={() => interactive && onRate?.(n)} />
      ))}
    </span>
  );
}

function AgencyReviewSection({ listing, user }: { listing: AgencyListing; user: any }) {
  const [reviews, setReviews] = useState<AgencyReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [newRating, setNewRating] = useState(0);
  const [newComment, setNewComment] = useState("");

  const fetchReviews = async () => {
    const { data } = await supabase.from("agency_reviews" as any).select("*").eq("agency_listing_id", listing.id).order("created_at", { ascending: false });
    if (data) {
      const userIds = [...new Set((data as any[]).map((r: any) => r.user_id))];
      const { data: profiles } = await supabase.from("public_profiles").select("user_id, display_name").in("user_id", userIds);
      const nameMap = new Map((profiles || []).map(p => [p.user_id, p.display_name]));
      setReviews((data as any[]).map((r: any) => ({ ...r, display_name: nameMap.get(r.user_id) || "Trekker" })));
    }
    setLoading(false);
  };

  useEffect(() => { fetchReviews(); }, [listing.id]);

  const avgRating = useMemo(() => reviews.length === 0 ? 0 : reviews.reduce((s, r) => s + r.rating, 0) / reviews.length, [reviews]);
  const userAlreadyReviewed = user && reviews.some(r => r.user_id === user.id);
  const isOwnListing = user?.id === listing.user_id;

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) { toast.error("Please log in"); return; }
    if (newRating === 0) { toast.error("Please select a rating"); return; }
    setSubmitting(true);
    const { data: inserted, error } = await supabase.from("agency_reviews" as any).insert({ agency_listing_id: listing.id, user_id: user.id, rating: newRating, comment: newComment.trim() } as any).select().single();
    if (error) toast.error("Failed to submit");
    else {
      moderateContent({ table: "agency_reviews", recordId: (inserted as any).id, textContent: newComment.trim() });
      toast.success("Review submitted!"); setNewRating(0); setNewComment(""); setShowForm(false); fetchReviews();
    }
    setSubmitting(false);
  };

  const handleDeleteReview = async (id: string) => {
    await supabase.from("agency_reviews" as any).delete().eq("id", id);
    toast.success("Review removed"); fetchReviews();
  };

  const visibleReviews = expanded ? reviews : reviews.slice(0, 2);

  return (
    <div className="border-t border-border pt-4 mt-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <StarRating rating={Math.round(avgRating)} />
          <span className="text-xs text-muted-foreground">{avgRating > 0 ? avgRating.toFixed(1) : "No ratings"} · {reviews.length} review{reviews.length !== 1 ? "s" : ""}</span>
        </div>
        {user && !isOwnListing && !userAlreadyReviewed && (
          <button onClick={() => setShowForm(!showForm)} className="text-xs font-medium text-primary hover:underline flex items-center gap-1"><MessageSquare className="h-3.5 w-3.5" /> Write Review</button>
        )}
      </div>
      {showForm && (
        <form onSubmit={handleSubmitReview} className="bg-muted/40 rounded-lg p-4 mb-4 space-y-3">
          <div><label className="block text-xs font-medium mb-1.5">Rating *</label><StarRating rating={newRating} onRate={setNewRating} interactive size="h-5 w-5" /></div>
          <div><label className="block text-xs font-medium mb-1.5">Comment</label><textarea rows={3} value={newComment} onChange={e => setNewComment(e.target.value)} maxLength={500} className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none" /></div>
          <div className="flex gap-2">
            <button type="submit" disabled={submitting} className="px-4 py-1.5 rounded-md trek-gradient text-primary-foreground text-xs font-semibold disabled:opacity-60 active:scale-95 transition-transform">{submitting ? "Submitting…" : "Submit"}</button>
            <button type="button" onClick={() => setShowForm(false)} className="px-4 py-1.5 rounded-md border border-border text-xs hover:bg-muted transition-colors active:scale-95">Cancel</button>
          </div>
        </form>
      )}
      {!loading && visibleReviews.length > 0 && (
        <div className="space-y-3">
          {visibleReviews.map(r => (
            <div key={r.id} className="flex gap-3">
              <div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary shrink-0">{(r.display_name || "T").charAt(0).toUpperCase()}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-medium">{r.display_name}</span>
                  <StarRating rating={r.rating} size="h-3 w-3" />
                </div>
                {r.comment && <p className="text-xs text-muted-foreground mt-1">{r.comment}</p>}
                {user?.id === r.user_id && <button onClick={() => handleDeleteReview(r.id)} className="text-[10px] text-destructive hover:underline mt-1">Delete</button>}
              </div>
            </div>
          ))}
          {reviews.length > 2 && (
            <button onClick={() => setExpanded(!expanded)} className="text-xs text-primary hover:underline flex items-center gap-1">
              {expanded ? <><ChevronUp className="h-3 w-3" /> Show less</> : <><ChevronDown className="h-3 w-3" /> All {reviews.length} reviews</>}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

const Agencies = ({ embedded = false }: { embedded?: boolean }) => {
  const { user } = useAuth();
  const [listings, setListings] = useState<AgencyListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [selectedTreks, setSelectedTreks] = useState<string[]>([]);
  const [trekSearch, setTrekSearch] = useState("");
  const [form, setForm] = useState({ name: "", description: "", website: "", contact_number: "", email: "", price_range_min: "", price_range_max: "", established_year: "", team_size: "" });

  const fetchListings = async () => {
    const { data } = await supabase.from("agency_listings" as any).select("*").order("created_at", { ascending: false });
    if (data) setListings(data as any[]);
    setLoading(false);
  };

  useEffect(() => { fetchListings(); }, []);

  const filteredTreks = useMemo(() => {
    if (!trekSearch) return treks.slice(0, 20);
    return treks.filter(t => t.name.toLowerCase().includes(trekSearch.toLowerCase())).slice(0, 20);
  }, [trekSearch]);

  const toggleTrek = (trekId: string) => {
    setSelectedTreks(prev => prev.includes(trekId) ? prev.filter(id => id !== trekId) : [...prev, trekId]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) { toast.error("Please log in"); return; }
    setSubmitting(true);
    let logo_url: string | null = null;
    if (logoFile) {
      const path = `${user.id}/${Date.now()}.${logoFile.name.split(".").pop()}`;
      const { error } = await supabase.storage.from("agency-photos").upload(path, logoFile);
      if (!error) logo_url = `${SUPABASE_URL}/storage/v1/object/public/agency-photos/${path}`;
    }
    const { data: inserted, error } = await supabase.from("agency_listings" as any).insert({
      user_id: user.id, name: form.name, logo_url, description: form.description,
      website: form.website || null, contact_number: form.contact_number,
      email: form.email || null, treks_offered: selectedTreks,
      price_range_min: parseInt(form.price_range_min) || 0,
      price_range_max: parseInt(form.price_range_max) || 0,
      established_year: parseInt(form.established_year) || null,
      team_size: parseInt(form.team_size) || null,
    } as any).select().single();
    if (error) toast.error("Failed to create listing");
    else {
      const textToCheck = `Agency: ${form.name}\nDescription: ${form.description}\nWebsite: ${form.website}`;
      const modResult = await moderateContent({ table: "agency_listings", recordId: (inserted as any).id, textContent: textToCheck });
      if (modResult.approved) {
        toast.success("Agency listing created and auto-approved! ✅");
      } else {
        toast.success("Agency listing submitted for review.");
      }
      setForm({ name: "", description: "", website: "", contact_number: "", email: "", price_range_min: "", price_range_max: "", established_year: "", team_size: "" });
      setLogoFile(null); setLogoPreview(null); setSelectedTreks([]); setShowForm(false); fetchListings();
    }
    setSubmitting(false);
  };

  const handleDelete = async (id: string) => {
    await supabase.from("agency_listings" as any).delete().eq("id", id);
    toast.success("Listing removed"); fetchListings();
  };

  const [searchQuery, setSearchQuery] = useState("");
  const [filterPrice, setFilterPrice] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const filteredListings = useMemo(() => {
    let result = listings;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(a => a.name.toLowerCase().includes(q) || a.description.toLowerCase().includes(q) || (a.email || "").toLowerCase().includes(q));
    }
    if (filterPrice === "low") result = result.filter(a => a.price_range_max > 0 && a.price_range_max <= 15000);
    else if (filterPrice === "mid") result = result.filter(a => a.price_range_min >= 10000 && a.price_range_max <= 50000);
    else if (filterPrice === "high") result = result.filter(a => a.price_range_min >= 50000);
    return result;
  }, [listings, searchQuery, filterPrice]);

  const Wrapper = embedded ? "div" : "main";
  return (
    <Wrapper className={embedded ? "" : "pt-24 pb-16 container mx-auto px-4 min-h-screen"}>
      {!embedded && (
        <>
          <SEOHead
            title="Travel Agencies"
            description="Find professional trekking and travel agencies across India & Nepal. Compare prices, read reviews, and book your Himalayan adventure."
            path="/agencies"
            jsonLd={breadcrumbSchema([{ name: "Home", url: "/" }, { name: "Travel Agencies", url: "/agencies" }])}
          />
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="font-display text-3xl md:text-4xl font-light text-foreground">Travel Agencies</h1>
              <p className="text-foreground/50 mt-2 max-w-lg">Find agencies that organize treks across India & Nepal, or list your own agency.</p>
            </div>
          </div>
        </>
      )}

      {/* Search & Filters */}
      <div className="mb-8 space-y-3">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground/30" />
            <input
              value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search by agency name, description…"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-foreground/[0.07] bg-card/60 backdrop-blur text-sm text-foreground placeholder:text-foreground/30 focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
          </div>
          <button onClick={() => setShowFilters(!showFilters)} className={`px-4 py-2.5 rounded-xl border text-sm font-medium flex items-center gap-2 transition-colors ${showFilters ? "border-primary/40 bg-primary/10 text-primary" : "border-foreground/[0.07] bg-card/60 text-foreground/50 hover:text-foreground"}`}>
            <SlidersHorizontal className="h-4 w-4" /> Filters
          </button>
        </div>
        {showFilters && (
          <div className="flex flex-wrap gap-2 p-4 rounded-xl border border-foreground/[0.07] bg-card/40 backdrop-blur">
            <span className="text-xs text-foreground/50 self-center mr-2">Price/trek:</span>
            {[{ v: "", l: "All" }, { v: "low", l: "Under ₹15k" }, { v: "mid", l: "₹10k–₹50k" }, { v: "high", l: "₹50k+" }].map(o => (
              <button key={o.v} onClick={() => setFilterPrice(o.v)} className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${filterPrice === o.v ? "bg-primary text-primary-foreground" : "bg-foreground/[0.05] text-foreground/60 hover:bg-foreground/[0.1]"}`}>{o.l}</button>
            ))}
          </div>
        )}
      </div>

      <div className="flex justify-end mb-6">
        {user ? (
          <button onClick={() => setShowForm(!showForm)} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl trek-gradient text-primary-foreground font-semibold text-sm shadow-md hover:shadow-lg active:scale-[0.97] transition">
            {showForm ? <><X className="h-4 w-4" /> Cancel</> : <><Plus className="h-4 w-4" /> List Your Agency</>}
          </button>
        ) : (
          <Link to="/auth" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-primary/30 text-primary font-medium text-sm hover:bg-primary/10 transition-colors">
            <Plus className="h-4 w-4" /> List Your Agency
          </Link>
        )}
      </div>

      {showForm && (
        <ScrollReveal>
          <form onSubmit={handleSubmit} className="bg-card border border-border rounded-xl p-6 md:p-8 mb-12 max-w-2xl mx-auto space-y-5">
            <h3>Create Agency Listing</h3>
            <div>
              <label className="block text-sm font-medium mb-2">Logo</label>
              <div className="flex items-center gap-4">
                {logoPreview ? <img src={logoPreview} alt="Logo" className="h-16 w-16 rounded-lg object-cover border-2 border-border" /> : <div className="h-16 w-16 rounded-lg bg-muted flex items-center justify-center"><Upload className="h-5 w-5 text-muted-foreground" /></div>}
                <label className="cursor-pointer px-4 py-2 text-sm rounded-md border border-border hover:bg-muted transition-colors">Choose Logo<input type="file" accept="image/*" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) { setLogoFile(f); setLogoPreview(URL.createObjectURL(f)); } }} /></label>
              </div>
            </div>
            <div><label className="block text-sm font-medium mb-1">Agency Name *</label><input required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring" /></div>
            <div className="grid grid-cols-2 gap-4">
              <div><label className="block text-sm font-medium mb-1">Contact Number *</label><input required value={form.contact_number} onChange={e => setForm(f => ({ ...f, contact_number: e.target.value }))} className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring" /></div>
              <div><label className="block text-sm font-medium mb-1">Email</label><input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring" /></div>
            </div>
            <div><label className="block text-sm font-medium mb-1">Website</label><input value={form.website} onChange={e => setForm(f => ({ ...f, website: e.target.value }))} placeholder="https://..." className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring" /></div>
            <div className="grid grid-cols-2 gap-4">
              <div><label className="block text-sm font-medium mb-1">Established Year</label><input type="number" value={form.established_year} onChange={e => setForm(f => ({ ...f, established_year: e.target.value }))} className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring" /></div>
              <div><label className="block text-sm font-medium mb-1">Team Size</label><input type="number" value={form.team_size} onChange={e => setForm(f => ({ ...f, team_size: e.target.value }))} className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring" /></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div><label className="block text-sm font-medium mb-1">Min Price (per trek)</label><input type="number" value={form.price_range_min} onChange={e => setForm(f => ({ ...f, price_range_min: e.target.value }))} className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring" /></div>
              <div><label className="block text-sm font-medium mb-1">Max Price (per trek)</label><input type="number" value={form.price_range_max} onChange={e => setForm(f => ({ ...f, price_range_max: e.target.value }))} className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring" /></div>
            </div>

            {/* Trek picker */}
            <div>
              <label className="block text-sm font-medium mb-1">Treks You Organize *</label>
              <input placeholder="Search treks…" value={trekSearch} onChange={e => setTrekSearch(e.target.value)} className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring mb-2" />
              <div className="max-h-40 overflow-y-auto border border-border rounded-md p-2 space-y-1">
                {filteredTreks.map(t => (
                  <label key={t.id} className={`flex items-center gap-2 px-2 py-1.5 rounded cursor-pointer text-sm transition-colors ${selectedTreks.includes(t.id) ? "bg-primary/10 text-primary" : "hover:bg-muted"}`}>
                    <input type="checkbox" checked={selectedTreks.includes(t.id)} onChange={() => toggleTrek(t.id)} className="rounded" />
                    {t.name} <span className="text-xs text-muted-foreground">({t.country})</span>
                  </label>
                ))}
              </div>
              {selectedTreks.length > 0 && <p className="text-xs text-primary mt-1">{selectedTreks.length} trek{selectedTreks.length !== 1 ? "s" : ""} selected</p>}
            </div>

            <div><label className="block text-sm font-medium mb-1">About Your Agency *</label><textarea required rows={4} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none" /></div>
            <p className="text-xs text-muted-foreground">⚠️ Your listing will be reviewed by admin before appearing publicly.</p>
            <button type="submit" disabled={submitting} className="w-full py-3 rounded-lg trek-gradient text-primary-foreground font-semibold text-sm shadow-md disabled:opacity-60 active:scale-[0.97] transition">{submitting ? "Submitting…" : "Submit Listing"}</button>
          </form>
        </ScrollReveal>
      )}

      {loading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">{[1,2,3].map(i => <div key={i} className="bg-card rounded-xl border border-border p-6 animate-pulse"><div className="h-16 w-16 bg-muted rounded-lg mb-4" /><div className="h-5 bg-muted rounded w-2/3 mb-3" /><div className="h-4 bg-muted rounded w-full" /></div>)}</div>
      ) : listings.length === 0 ? (
        <div className="text-center py-20"><Briefcase className="h-12 w-12 text-muted-foreground/40 mx-auto mb-4" /><p className="text-muted-foreground">No agency listings yet. Be the first!</p></div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {listings.map((a, i) => (
            <ScrollReveal key={a.id} delay={i * 80}>
              <div className="bg-card rounded-xl border border-border shadow-sm hover:shadow-lg transition-shadow overflow-hidden h-full flex flex-col">
                <div className="p-6 flex flex-col flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    {a.logo_url ? <img src={a.logo_url} alt={a.name} className="h-12 w-12 rounded-lg object-cover border border-border" /> : <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center"><Briefcase className="h-5 w-5 text-primary" /></div>}
                    <div>
                      <h3 className="text-lg font-semibold">{a.name}</h3>
                      {a.established_year && <span className="text-xs text-muted-foreground">Est. {a.established_year}</span>}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mb-2"><Phone className="h-4 w-4 text-primary" /><a href={`tel:${a.contact_number}`} className="text-sm font-medium hover:text-primary transition-colors">{a.contact_number}</a></div>
                  {a.email && <div className="flex items-center gap-2 mb-2"><Mail className="h-3.5 w-3.5 text-primary" /><span className="text-sm text-muted-foreground">{a.email}</span></div>}
                  {a.website && <div className="flex items-center gap-2 mb-2"><Globe className="h-3.5 w-3.5 text-primary" /><a href={a.website} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline truncate">{a.website}</a></div>}
                  {a.team_size && <div className="flex items-center gap-2 mb-2"><Users className="h-3.5 w-3.5 text-primary" /><span className="text-sm text-muted-foreground">{a.team_size} team members</span></div>}
                  {(a.price_range_min > 0 || a.price_range_max > 0) && (
                    <div className="flex items-center gap-2 mb-2"><IndianRupee className="h-4 w-4 text-primary" /><span className="text-sm text-muted-foreground">₹{a.price_range_min.toLocaleString()} – ₹{a.price_range_max.toLocaleString()}/trek</span></div>
                  )}
                  {a.treks_offered.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-3">{a.treks_offered.slice(0, 5).map(tid => { const t = treks.find(tr => tr.id === tid); return t ? <span key={tid} className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full">{t.name}</span> : null; })}{a.treks_offered.length > 5 && <span className="text-[10px] bg-muted text-muted-foreground px-2 py-0.5 rounded-full">+{a.treks_offered.length - 5} more</span>}</div>
                  )}
                  <p className="text-sm text-muted-foreground leading-relaxed flex-1 line-clamp-3">{a.description}</p>
                  <Link to={`/agency/${a.id}`} className="mt-3 inline-flex items-center gap-1 text-xs text-primary font-medium hover:underline"><ArrowRight className="h-3 w-3" /> View Details</Link>
                  {!a.approved && <span className="text-xs text-yellow-700 bg-yellow-100 px-2 py-1 rounded-full mt-2 inline-block w-fit">⏳ Pending approval</span>}
                  {user?.id === a.user_id && <button onClick={() => handleDelete(a.id)} className="mt-3 flex items-center gap-1 text-xs text-destructive hover:underline self-end"><Trash2 className="h-3.5 w-3.5" /> Remove</button>}
                  <AgencyReviewSection listing={a} user={user} />
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      )}
    </Wrapper>
  );
};

export default Agencies;
