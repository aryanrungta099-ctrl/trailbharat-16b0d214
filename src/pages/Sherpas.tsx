import { useState, useEffect, useMemo } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Phone, IndianRupee, Mountain, Plus, X, Upload, Trash2, Star, MessageSquare, ChevronDown, ChevronUp, Image, Share2 } from "lucide-react";
import { treks } from "@/data/treks";
import ScrollReveal from "@/components/ScrollReveal";

interface SherpaListing {
  id: string; user_id: string; name: string; photo_url: string | null;
  treks_guided: string; contact_number: string; price_range_min: number;
  price_range_max: number; description: string; gallery_urls: string[];
  approved: boolean; created_at: string;
}

interface SherpaReview {
  id: string; sherpa_listing_id: string; user_id: string; rating: number;
  comment: string; created_at: string; display_name?: string;
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

function ReviewSection({ listing, user }: { listing: SherpaListing; user: any }) {
  const [reviews, setReviews] = useState<SherpaReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [newRating, setNewRating] = useState(0);
  const [newComment, setNewComment] = useState("");

  const fetchReviews = async () => {
    const { data } = await supabase.from("sherpa_reviews" as any).select("*").eq("sherpa_listing_id", listing.id).order("created_at", { ascending: false });
    if (data) {
      const userIds = [...new Set((data as any[]).map((r: any) => r.user_id))];
      const { data: profiles } = await supabase.from("profiles").select("user_id, display_name").in("user_id", userIds);
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
    const { error } = await supabase.from("sherpa_reviews" as any).insert({ sherpa_listing_id: listing.id, user_id: user.id, rating: newRating, comment: newComment.trim() } as any);
    if (error) toast.error(error.message.includes("unique") ? "Already reviewed" : "Failed");
    else { toast.success("Review submitted!"); setNewRating(0); setNewComment(""); setShowForm(false); fetchReviews(); }
    setSubmitting(false);
  };

  const handleDeleteReview = async (id: string) => {
    await supabase.from("sherpa_reviews" as any).delete().eq("id", id);
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

function ShareButton({ name }: { name: string }) {
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: name, text: `Check out ${name} on TrailBharat!`, url: window.location.href }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied!");
    }
  };
  return (
    <button onClick={handleShare} className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 active:scale-95 transition-transform"><Share2 className="h-3 w-3" /> Share</button>
  );
}

const Sherpas = () => {
  const { user } = useAuth();
  const [listings, setListings] = useState<SherpaListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
  const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);
  const [selectedTreks, setSelectedTreks] = useState<string[]>([]);
  const [trekSearch, setTrekSearch] = useState("");

  const [form, setForm] = useState({
    name: "", contact_number: "", price_range_min: "", price_range_max: "", description: "",
  });

  const fetchListings = async () => {
    const { data } = await supabase.from("sherpa_listings").select("*").order("created_at", { ascending: false });
    if (data) setListings(data as any[]);
    setLoading(false);
  };

  useEffect(() => { fetchListings(); }, []);

  const filteredTreks = useMemo(() => {
    if (!trekSearch) return treks.slice(0, 20);
    return treks.filter(t => t.name.toLowerCase().includes(trekSearch.toLowerCase())).slice(0, 20);
  }, [trekSearch]);

  const toggleTrek = (trekName: string) => {
    setSelectedTreks(prev => prev.includes(trekName) ? prev.filter(n => n !== trekName) : [...prev, trekName]);
  };

  const handleGalleryAdd = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (galleryFiles.length + files.length > 5) { toast.error("Max 5 gallery photos"); return; }
    setGalleryFiles(prev => [...prev, ...files]);
    setGalleryPreviews(prev => [...prev, ...files.map(f => URL.createObjectURL(f))]);
  };

  const removeGalleryPhoto = (idx: number) => {
    setGalleryFiles(prev => prev.filter((_, i) => i !== idx));
    setGalleryPreviews(prev => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) { toast.error("Please log in"); return; }
    if (selectedTreks.length === 0) { toast.error("Please select at least one trek"); return; }
    setSubmitting(true);

    let photo_url: string | null = null;
    if (photoFile) {
      const path = `${user.id}/${Date.now()}.${photoFile.name.split(".").pop()}`;
      const { error } = await supabase.storage.from("sherpa-photos").upload(path, photoFile);
      if (!error) photo_url = `${SUPABASE_URL}/storage/v1/object/public/sherpa-photos/${path}`;
    }

    const gallery_urls: string[] = [];
    for (const file of galleryFiles) {
      const path = `${user.id}/gallery-${Date.now()}-${Math.random().toString(36).slice(2)}.${file.name.split(".").pop()}`;
      const { error } = await supabase.storage.from("sherpa-photos").upload(path, file);
      if (!error) gallery_urls.push(`${SUPABASE_URL}/storage/v1/object/public/sherpa-photos/${path}`);
    }

    const { error } = await supabase.from("sherpa_listings").insert({
      user_id: user.id, name: form.name, photo_url,
      treks_guided: selectedTreks.join(", "),
      contact_number: form.contact_number,
      price_range_min: parseInt(form.price_range_min) || 0,
      price_range_max: parseInt(form.price_range_max) || 0,
      description: form.description,
      gallery_urls,
    } as any);

    if (error) toast.error("Failed to create listing");
    else {
      toast.success("Listing created! Awaiting approval.");
      setForm({ name: "", contact_number: "", price_range_min: "", price_range_max: "", description: "" });
      setPhotoFile(null); setPhotoPreview(null); setGalleryFiles([]); setGalleryPreviews([]); setSelectedTreks([]); setShowForm(false); fetchListings();
    }
    setSubmitting(false);
  };

  const handleDelete = async (id: string) => {
    await supabase.from("sherpa_listings").delete().eq("id", id);
    toast.success("Listing removed"); fetchListings();
  };

  return (
    <main className="pt-24 pb-16 container mx-auto px-4 min-h-screen">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10">
        <div>
          <h1 className="text-balance">Find a Sherpa Guide</h1>
          <p className="text-muted-foreground mt-2 max-w-lg">Connect with experienced mountain guides. Browse listings, read reviews, or create your own.</p>
        </div>
        {user && (
          <button onClick={() => setShowForm(!showForm)} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg trek-gradient text-primary-foreground font-semibold text-sm shadow-md hover:shadow-lg active:scale-[0.97] transition">
            {showForm ? <><X className="h-4 w-4" /> Cancel</> : <><Plus className="h-4 w-4" /> Create Listing</>}
          </button>
        )}
      </div>

      {showForm && (
        <ScrollReveal>
          <form onSubmit={handleSubmit} className="bg-card border border-border rounded-xl p-6 md:p-8 mb-12 max-w-2xl mx-auto space-y-5">
            <h3>Create Your Sherpa Listing</h3>

            {/* Photo */}
            <div>
              <label className="block text-sm font-medium mb-2">Your Photo</label>
              <div className="flex items-center gap-4">
                {photoPreview ? <img src={photoPreview} alt="Preview" className="h-20 w-20 rounded-full object-cover border-2 border-border" /> : <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center"><Upload className="h-6 w-6 text-muted-foreground" /></div>}
                <label className="cursor-pointer px-4 py-2 text-sm rounded-md border border-border hover:bg-muted transition-colors">Choose Photo<input type="file" accept="image/*" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) { setPhotoFile(f); setPhotoPreview(URL.createObjectURL(f)); } }} /></label>
              </div>
            </div>

            <div><label className="block text-sm font-medium mb-1">Full Name *</label><input required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring" /></div>

            {/* Trek picker */}
            <div>
              <label className="block text-sm font-medium mb-1">Treks You Guide *</label>
              <input placeholder="Search treks…" value={trekSearch} onChange={e => setTrekSearch(e.target.value)} className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring mb-2" />
              <div className="max-h-40 overflow-y-auto border border-border rounded-md p-2 space-y-1">
                {filteredTreks.map(t => (
                  <label key={t.id} className={`flex items-center gap-2 px-2 py-1.5 rounded cursor-pointer text-sm transition-colors ${selectedTreks.includes(t.name) ? "bg-primary/10 text-primary" : "hover:bg-muted"}`}>
                    <input type="checkbox" checked={selectedTreks.includes(t.name)} onChange={() => toggleTrek(t.name)} className="rounded" />
                    {t.name} <span className="text-xs text-muted-foreground">({t.country})</span>
                  </label>
                ))}
              </div>
              {selectedTreks.length > 0 && <div className="flex flex-wrap gap-1 mt-2">{selectedTreks.map(n => <span key={n} className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">{n}</span>)}</div>}
            </div>

            <div><label className="block text-sm font-medium mb-1">Contact Number *</label><input required value={form.contact_number} onChange={e => setForm(f => ({ ...f, contact_number: e.target.value }))} className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring" /></div>

            <div className="grid grid-cols-2 gap-4">
              <div><label className="block text-sm font-medium mb-1">Min Price (₹/day)</label><input type="number" value={form.price_range_min} onChange={e => setForm(f => ({ ...f, price_range_min: e.target.value }))} className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring" /></div>
              <div><label className="block text-sm font-medium mb-1">Max Price (₹/day)</label><input type="number" value={form.price_range_max} onChange={e => setForm(f => ({ ...f, price_range_max: e.target.value }))} className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring" /></div>
            </div>

            {/* Gallery */}
            <div>
              <label className="block text-sm font-medium mb-2">Gallery Photos (up to 5)</label>
              <div className="flex flex-wrap gap-3">
                {galleryPreviews.map((url, i) => (
                  <div key={i} className="relative h-20 w-20 rounded-lg overflow-hidden border border-border">
                    <img src={url} alt="" className="h-full w-full object-cover" />
                    <button type="button" onClick={() => removeGalleryPhoto(i)} className="absolute top-0.5 right-0.5 p-0.5 rounded-full bg-destructive text-destructive-foreground"><X className="h-3 w-3" /></button>
                  </div>
                ))}
                {galleryFiles.length < 5 && (
                  <label className="h-20 w-20 rounded-lg border-2 border-dashed border-border flex items-center justify-center cursor-pointer hover:border-primary/50 transition-colors">
                    <Image className="h-5 w-5 text-muted-foreground" />
                    <input type="file" accept="image/*" className="hidden" onChange={handleGalleryAdd} />
                  </label>
                )}
              </div>
            </div>

            <div><label className="block text-sm font-medium mb-1">About You *</label><textarea required rows={4} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none" /></div>

            <button type="submit" disabled={submitting} className="w-full py-3 rounded-lg trek-gradient text-primary-foreground font-semibold text-sm shadow-md disabled:opacity-60 active:scale-[0.97] transition">{submitting ? "Submitting…" : "Publish Listing"}</button>
          </form>
        </ScrollReveal>
      )}

      {loading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">{[1,2,3].map(i => <div key={i} className="bg-card rounded-xl border border-border p-6 animate-pulse"><div className="h-24 w-24 rounded-full bg-muted mx-auto mb-4" /><div className="h-5 bg-muted rounded w-2/3 mx-auto mb-3" /><div className="h-4 bg-muted rounded w-full" /></div>)}</div>
      ) : listings.length === 0 ? (
        <div className="text-center py-20"><Mountain className="h-12 w-12 text-muted-foreground/40 mx-auto mb-4" /><p className="text-muted-foreground">No sherpa listings yet. Be the first!</p></div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {listings.map((s, i) => (
            <ScrollReveal key={s.id} delay={i * 80}>
              <div className="bg-card rounded-xl border border-border shadow-sm hover:shadow-lg transition-shadow overflow-hidden h-full flex flex-col">
                <div className="flex justify-center pt-8 pb-4">
                  {s.photo_url ? <img src={s.photo_url} alt={s.name} className="h-28 w-28 rounded-full object-cover border-4 border-background shadow-md" /> : <div className="h-28 w-28 rounded-full bg-muted flex items-center justify-center text-3xl font-bold text-muted-foreground border-4 border-background shadow-md">{s.name.charAt(0).toUpperCase()}</div>}
                </div>
                <div className="px-6 pb-6 flex flex-col flex-1">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-semibold">{s.name}</h3>
                    <ShareButton name={s.name} />
                  </div>
                  <div className="flex items-start gap-2 mb-2"><Mountain className="h-4 w-4 text-primary mt-0.5 shrink-0" /><p className="text-sm text-muted-foreground">{s.treks_guided}</p></div>
                  <div className="flex items-center gap-2 mb-2"><Phone className="h-4 w-4 text-primary shrink-0" /><a href={`tel:${s.contact_number}`} className="text-sm font-medium hover:text-primary transition-colors">{s.contact_number}</a></div>
                  {(s.price_range_min > 0 || s.price_range_max > 0) && (
                    <div className="flex items-center gap-2 mb-3"><IndianRupee className="h-4 w-4 text-primary shrink-0" /><span className="text-sm text-muted-foreground">₹{s.price_range_min.toLocaleString()} – ₹{s.price_range_max.toLocaleString()} / day</span></div>
                  )}

                  {/* Gallery */}
                  {s.gallery_urls && s.gallery_urls.length > 0 && (
                    <div className="flex gap-1.5 mb-3 overflow-x-auto pb-1">
                      {s.gallery_urls.map((url: string, j: number) => (
                        <img key={j} src={url} alt={`${s.name} photo ${j + 1}`} className="h-16 w-20 rounded-lg object-cover border border-border shrink-0" loading="lazy" />
                      ))}
                    </div>
                  )}

                  <p className="text-sm text-muted-foreground leading-relaxed pt-3 border-t border-border">{s.description}</p>
                  {!s.approved && <span className="text-xs text-yellow-700 bg-yellow-100 px-2 py-1 rounded-full mt-2 inline-block w-fit">⏳ Pending approval</span>}
                  {user?.id === s.user_id && <button onClick={() => handleDelete(s.id)} className="mt-4 flex items-center gap-1 text-xs text-destructive hover:underline self-end"><Trash2 className="h-3.5 w-3.5" /> Remove</button>}
                  <ReviewSection listing={s} user={user} />
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      )}
    </main>
  );
};

export default Sherpas;
