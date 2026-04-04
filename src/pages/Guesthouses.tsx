import { useState, useEffect, useMemo } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Phone, IndianRupee, Home, Plus, X, Upload, Trash2, Star, MessageSquare, ChevronDown, ChevronUp, MapPin, Check, Search, SlidersHorizontal } from "lucide-react";
import { Link } from "react-router-dom";
import ScrollReveal from "@/components/ScrollReveal";
import { moderateContent } from "@/lib/moderation";
import SEOHead, { breadcrumbSchema } from "@/components/SEOHead";

interface GuesthouseListing {
  id: string;
  user_id: string;
  name: string;
  photo_url: string | null;
  location: string;
  trek_region: string;
  contact_number: string;
  price_range_min: number;
  price_range_max: number;
  description: string;
  amenities: string[];
  approved: boolean;
  created_at: string;
}

interface GhReview {
  id: string;
  guesthouse_listing_id: string;
  user_id: string;
  rating: number;
  comment: string;
  created_at: string;
  display_name?: string;
}

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;

function StarRating({ rating, onRate, interactive = false, size = "h-4 w-4" }: { rating: number; onRate?: (r: number) => void; interactive?: boolean; size?: string }) {
  return (
    <span className="inline-flex gap-0.5">
      {[1, 2, 3, 4, 5].map(n => (
        <Star key={n} className={`${size} transition-colors ${n <= rating ? "fill-amber-400 text-amber-400" : "text-muted-foreground/30"} ${interactive ? "cursor-pointer hover:text-amber-400" : ""}`} onClick={() => interactive && onRate?.(n)} />
      ))}
    </span>
  );
}

function GhReviewSection({ listing, user }: { listing: GuesthouseListing; user: any }) {
  const [reviews, setReviews] = useState<GhReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [newRating, setNewRating] = useState(0);
  const [newComment, setNewComment] = useState("");

  const fetchReviews = async () => {
    const { data } = await supabase.from("guesthouse_reviews" as any).select("*").eq("guesthouse_listing_id", listing.id).order("created_at", { ascending: false });
    if (data) {
      const userIds = [...new Set((data as any[]).map((r: any) => r.user_id))];
      const { data: profiles } = await supabase.from("public_profiles").select("user_id, display_name").in("user_id", userIds);
      const nameMap = new Map((profiles || []).map(p => [p.user_id, p.display_name]));
      setReviews((data as any[]).map((r: any) => ({ ...r, display_name: nameMap.get(r.user_id) || "Guest" })));
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
    const { data: inserted, error } = await supabase.from("guesthouse_reviews" as any).insert({ guesthouse_listing_id: listing.id, user_id: user.id, rating: newRating, comment: newComment.trim() } as any).select().single();
    if (error) toast.error(error.message.includes("unique") ? "Already reviewed" : "Failed");
    else {
      moderateContent({ table: "guesthouse_reviews", recordId: (inserted as any).id, textContent: newComment.trim() });
      toast.success("Review submitted!"); setNewRating(0); setNewComment(""); setShowForm(false); fetchReviews();
    }
    setSubmitting(false);
  };

  const handleDeleteReview = async (id: string) => {
    await supabase.from("guesthouse_reviews" as any).delete().eq("id", id);
    toast.success("Review removed");
    fetchReviews();
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
              <div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary shrink-0">{(r.display_name || "G").charAt(0).toUpperCase()}</div>
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

const Guesthouses = () => {
  const { user } = useAuth();
  const [listings, setListings] = useState<GuesthouseListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", location: "", trek_region: "", contact_number: "", price_range_min: "", price_range_max: "", description: "", amenities: "" });

  const [searchQuery, setSearchQuery] = useState("");
  const [filterPrice, setFilterPrice] = useState("");
  const [filterRegion, setFilterRegion] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const fetchListings = async () => {
    const { data } = await supabase.from("guesthouse_listings" as any).select("*").order("created_at", { ascending: false });
    if (data) setListings(data as any[]);
    setLoading(false);
  };

  useEffect(() => { fetchListings(); }, []);

  const regions = useMemo(() => [...new Set(listings.map(g => g.trek_region).filter(Boolean))], [listings]);

  const filteredListings = useMemo(() => {
    let result = listings;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(g => g.name.toLowerCase().includes(q) || g.location.toLowerCase().includes(q) || g.trek_region.toLowerCase().includes(q) || g.description.toLowerCase().includes(q));
    }
    if (filterRegion) result = result.filter(g => g.trek_region === filterRegion);
    if (filterPrice === "low") result = result.filter(g => g.price_range_max > 0 && g.price_range_max <= 1000);
    else if (filterPrice === "mid") result = result.filter(g => g.price_range_min >= 500 && g.price_range_max <= 3000);
    else if (filterPrice === "high") result = result.filter(g => g.price_range_min >= 3000);
    return result;
  }, [listings, searchQuery, filterRegion, filterPrice]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) { toast.error("Please log in"); return; }
    setSubmitting(true);
    let photo_url: string | null = null;
    if (photoFile) {
      const path = `${user.id}/${Date.now()}.${photoFile.name.split(".").pop()}`;
      const { error } = await supabase.storage.from("guesthouse-photos").upload(path, photoFile);
      if (!error) photo_url = `${SUPABASE_URL}/storage/v1/object/public/guesthouse-photos/${path}`;
    }
    const { data: inserted, error } = await supabase.from("guesthouse_listings" as any).insert({
      user_id: user.id, name: form.name, photo_url, location: form.location, trek_region: form.trek_region,
      contact_number: form.contact_number, price_range_min: parseInt(form.price_range_min) || 0,
      price_range_max: parseInt(form.price_range_max) || 0, description: form.description,
      amenities: form.amenities.split(",").map(a => a.trim()).filter(Boolean),
    } as any).select().single();
    if (error) toast.error("Failed to create listing");
    else {
      const textToCheck = `Guesthouse: ${form.name}\nLocation: ${form.location}\nRegion: ${form.trek_region}\nDescription: ${form.description}`;
      const modResult = await moderateContent({ table: "guesthouse_listings", recordId: (inserted as any).id, textContent: textToCheck });
      if (modResult.approved) {
        toast.success("Listing created and auto-approved! ✅");
      } else {
        toast.success("Listing submitted for review.");
      }
      setForm({ name: "", location: "", trek_region: "", contact_number: "", price_range_min: "", price_range_max: "", description: "", amenities: "" });
      setPhotoFile(null); setPhotoPreview(null); setShowForm(false); fetchListings();
    }
    setSubmitting(false);
  };

  const handleDelete = async (id: string) => {
    await supabase.from("guesthouse_listings" as any).delete().eq("id", id);
    toast.success("Listing removed"); fetchListings();
  };

  return (
    <main className="pt-24 pb-16 container mx-auto px-4 min-h-screen">
      <SEOHead
        title="Guesthouses & Tea Houses"
        description="Find comfortable guesthouses and tea houses along popular trekking routes in India & Nepal. Verified stays with amenities, prices, and reviews."
        path="/guesthouses"
        jsonLd={breadcrumbSchema([{ name: "Home", url: "/" }, { name: "Guesthouses", url: "/guesthouses" }])}
      />
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display text-3xl md:text-4xl font-light text-foreground">Guesthouses & Tea Houses</h1>
          <p className="text-foreground/50 mt-2 max-w-lg">Find recommended stays along trek routes. Guesthouse owners can list their properties.</p>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="mb-8 space-y-3">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground/30" />
            <input
              value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search by name, location, region…"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-foreground/[0.07] bg-card/60 backdrop-blur text-sm text-foreground placeholder:text-foreground/30 focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
          </div>
          <button onClick={() => setShowFilters(!showFilters)} className={`px-4 py-2.5 rounded-xl border text-sm font-medium flex items-center gap-2 transition-colors ${showFilters ? "border-primary/40 bg-primary/10 text-primary" : "border-foreground/[0.07] bg-card/60 text-foreground/50 hover:text-foreground"}`}>
            <SlidersHorizontal className="h-4 w-4" /> Filters
          </button>
        </div>
        {showFilters && (
          <div className="flex flex-wrap gap-2 p-4 rounded-xl border border-foreground/[0.07] bg-card/40 backdrop-blur">
            <span className="text-xs text-foreground/50 self-center mr-2">Price/night:</span>
            {[{ v: "", l: "All" }, { v: "low", l: "Under ₹1k" }, { v: "mid", l: "₹500–₹3k" }, { v: "high", l: "₹3k+" }].map(o => (
              <button key={o.v} onClick={() => setFilterPrice(o.v)} className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${filterPrice === o.v ? "bg-primary text-primary-foreground" : "bg-foreground/[0.05] text-foreground/60 hover:bg-foreground/[0.1]"}`}>{o.l}</button>
            ))}
            {regions.length > 0 && (
              <>
                <div className="w-px h-6 bg-foreground/[0.07] mx-2 self-center" />
                <span className="text-xs text-foreground/50 self-center mr-2">Region:</span>
                <button onClick={() => setFilterRegion("")} className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${!filterRegion ? "bg-primary text-primary-foreground" : "bg-foreground/[0.05] text-foreground/60 hover:bg-foreground/[0.1]"}`}>All</button>
                {regions.map(r => (
                  <button key={r} onClick={() => setFilterRegion(r)} className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${filterRegion === r ? "bg-primary text-primary-foreground" : "bg-foreground/[0.05] text-foreground/60 hover:bg-foreground/[0.1]"}`}>{r}</button>
                ))}
              </>
            )}
          </div>
        )}
      </div>

      <div className="flex justify-end mb-6">
        {user ? (
          <button onClick={() => setShowForm(!showForm)} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl trek-gradient text-primary-foreground font-semibold text-sm shadow-md hover:shadow-lg active:scale-[0.97] transition">
            {showForm ? <><X className="h-4 w-4" /> Cancel</> : <><Plus className="h-4 w-4" /> List Your Guesthouse</>}
          </button>
        ) : (
          <Link to="/auth" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-primary/30 text-primary font-medium text-sm hover:bg-primary/10 transition-colors">
            <Plus className="h-4 w-4" /> List Your Guesthouse
          </Link>
        )}
      </div>

      {showForm && (
        <ScrollReveal>
          <form onSubmit={handleSubmit} className="bg-card border border-border rounded-xl p-6 md:p-8 mb-12 max-w-2xl mx-auto space-y-5">
            <h3>Create Guesthouse Listing</h3>
            <div>
              <label className="block text-sm font-medium mb-2">Photo</label>
              <div className="flex items-center gap-4">
                {photoPreview ? <img src={photoPreview} alt="Preview" className="h-20 w-20 rounded-lg object-cover border-2 border-border" /> : <div className="h-20 w-20 rounded-lg bg-muted flex items-center justify-center"><Upload className="h-6 w-6 text-muted-foreground" /></div>}
                <label className="cursor-pointer px-4 py-2 text-sm rounded-md border border-border hover:bg-muted transition-colors">Choose Photo<input type="file" accept="image/*" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) { setPhotoFile(f); setPhotoPreview(URL.createObjectURL(f)); } }} /></label>
              </div>
            </div>
            <div><label className="block text-sm font-medium mb-1">Name *</label><input required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring" /></div>
            <div className="grid grid-cols-2 gap-4">
              <div><label className="block text-sm font-medium mb-1">Location *</label><input required value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} placeholder="e.g. Namche Bazaar" className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring" /></div>
              <div><label className="block text-sm font-medium mb-1">Trek Region *</label><input required value={form.trek_region} onChange={e => setForm(f => ({ ...f, trek_region: e.target.value }))} placeholder="e.g. Khumbu, Annapurna" className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring" /></div>
            </div>
            <div><label className="block text-sm font-medium mb-1">Contact Number *</label><input required value={form.contact_number} onChange={e => setForm(f => ({ ...f, contact_number: e.target.value }))} className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring" /></div>
            <div className="grid grid-cols-2 gap-4">
              <div><label className="block text-sm font-medium mb-1">Min Price/night</label><input type="number" value={form.price_range_min} onChange={e => setForm(f => ({ ...f, price_range_min: e.target.value }))} className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring" /></div>
              <div><label className="block text-sm font-medium mb-1">Max Price/night</label><input type="number" value={form.price_range_max} onChange={e => setForm(f => ({ ...f, price_range_max: e.target.value }))} className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring" /></div>
            </div>
            <div><label className="block text-sm font-medium mb-1">Amenities (comma separated)</label><input value={form.amenities} onChange={e => setForm(f => ({ ...f, amenities: e.target.value }))} placeholder="WiFi, Hot Water, Heater, Restaurant" className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring" /></div>
            <div><label className="block text-sm font-medium mb-1">Description *</label><textarea required rows={4} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none" /></div>
            <p className="text-xs text-muted-foreground">⚠️ Your listing will be reviewed by admin before appearing publicly.</p>
            <button type="submit" disabled={submitting} className="w-full py-3 rounded-lg trek-gradient text-primary-foreground font-semibold text-sm shadow-md disabled:opacity-60 active:scale-[0.97] transition">{submitting ? "Submitting…" : "Submit Listing"}</button>
          </form>
        </ScrollReveal>
      )}

      {loading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">{[1,2,3].map(i => <div key={i} className="bg-card rounded-xl border border-border p-6 animate-pulse"><div className="h-40 bg-muted rounded-lg mb-4" /><div className="h-5 bg-muted rounded w-2/3 mb-3" /><div className="h-4 bg-muted rounded w-full" /></div>)}</div>
      ) : filteredListings.length === 0 ? (
        <div className="text-center py-20"><Home className="h-12 w-12 text-foreground/20 mx-auto mb-4" /><p className="text-foreground/50">{listings.length === 0 ? "No guesthouse listings yet. Be the first!" : "No results match your filters."}</p></div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredListings.map((g, i) => (
            <ScrollReveal key={g.id} delay={i * 80}>
              <div className="bg-card rounded-xl border border-border shadow-sm hover:shadow-lg transition-shadow overflow-hidden h-full flex flex-col">
                {g.photo_url ? <img src={g.photo_url} alt={g.name} className="h-40 w-full object-cover" /> : <div className="h-40 w-full bg-muted flex items-center justify-center"><Home className="h-10 w-10 text-muted-foreground/30" /></div>}
                <div className="p-6 flex flex-col flex-1">
                  <h3 className="text-lg font-semibold mb-1">{g.name}</h3>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground mb-2"><MapPin className="h-3.5 w-3.5 text-primary" />{g.location} · {g.trek_region}</div>
                  <div className="flex items-center gap-2 mb-2"><Phone className="h-4 w-4 text-primary" /><a href={`tel:${g.contact_number}`} className="text-sm font-medium hover:text-primary transition-colors">{g.contact_number}</a></div>
                  {(g.price_range_min > 0 || g.price_range_max > 0) && (
                    <div className="flex items-center gap-2 mb-2"><IndianRupee className="h-4 w-4 text-primary" /><span className="text-sm text-muted-foreground">₹{g.price_range_min.toLocaleString()} – ₹{g.price_range_max.toLocaleString()}/night</span></div>
                  )}
                  {g.amenities.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-3">{g.amenities.map(a => <span key={a} className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full">{a}</span>)}</div>
                  )}
                  <p className="text-sm text-muted-foreground leading-relaxed flex-1">{g.description}</p>
                  {!g.approved && <span className="text-xs text-yellow-700 bg-yellow-100 px-2 py-1 rounded-full mt-2 inline-block w-fit">⏳ Pending approval</span>}
                  {user?.id === g.user_id && <button onClick={() => handleDelete(g.id)} className="mt-3 flex items-center gap-1 text-xs text-destructive hover:underline self-end"><Trash2 className="h-3.5 w-3.5" /> Remove</button>}
                  <GhReviewSection listing={g} user={user} />
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      )}
    </main>
  );
};

export default Guesthouses;
