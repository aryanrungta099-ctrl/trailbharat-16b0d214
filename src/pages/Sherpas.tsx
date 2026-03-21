import { useState, useEffect, useMemo } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Phone, IndianRupee, Mountain, Plus, X, Upload, Trash2, Star, MessageSquare, ChevronDown, ChevronUp } from "lucide-react";
import ScrollReveal from "@/components/ScrollReveal";

interface SherpaListing {
  id: string;
  user_id: string;
  name: string;
  photo_url: string | null;
  treks_guided: string;
  contact_number: string;
  price_range_min: number;
  price_range_max: number;
  description: string;
  created_at: string;
}

interface SherpaReview {
  id: string;
  sherpa_listing_id: string;
  user_id: string;
  rating: number;
  comment: string;
  created_at: string;
  display_name?: string;
}

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;

function StarRating({ rating, onRate, interactive = false, size = "h-4 w-4" }: {
  rating: number;
  onRate?: (r: number) => void;
  interactive?: boolean;
  size?: string;
}) {
  return (
    <span className="inline-flex gap-0.5">
      {[1, 2, 3, 4, 5].map(n => (
        <Star
          key={n}
          className={`${size} transition-colors ${
            n <= rating ? "fill-amber-400 text-amber-400" : "text-muted-foreground/30"
          } ${interactive ? "cursor-pointer hover:text-amber-400" : ""}`}
          onClick={() => interactive && onRate?.(n)}
        />
      ))}
    </span>
  );
}

function ReviewSection({ listing, user, onReviewAdded }: {
  listing: SherpaListing;
  user: any;
  onReviewAdded: () => void;
}) {
  const [reviews, setReviews] = useState<SherpaReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [newRating, setNewRating] = useState(0);
  const [newComment, setNewComment] = useState("");

  const fetchReviews = async () => {
    const { data } = await supabase
      .from("sherpa_reviews" as any)
      .select("*")
      .eq("sherpa_listing_id", listing.id)
      .order("created_at", { ascending: false });

    if (data) {
      // Fetch display names for reviewers
      const userIds = [...new Set((data as any[]).map((r: any) => r.user_id))];
      const { data: profiles } = await supabase
        .from("profiles")
        .select("user_id, display_name")
        .in("user_id", userIds);

      const nameMap = new Map((profiles || []).map(p => [p.user_id, p.display_name]));
      setReviews((data as any[]).map((r: any) => ({
        ...r,
        display_name: nameMap.get(r.user_id) || "Trekker",
      })));
    }
    setLoading(false);
  };

  useEffect(() => { fetchReviews(); }, [listing.id]);

  const avgRating = useMemo(() => {
    if (reviews.length === 0) return 0;
    return reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
  }, [reviews]);

  const userAlreadyReviewed = user && reviews.some(r => r.user_id === user.id);
  const isOwnListing = user?.id === listing.user_id;

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) { toast.error("Please log in to leave a review"); return; }
    if (newRating === 0) { toast.error("Please select a rating"); return; }
    setSubmitting(true);

    const { error } = await supabase.from("sherpa_reviews" as any).insert({
      sherpa_listing_id: listing.id,
      user_id: user.id,
      rating: newRating,
      comment: newComment.trim(),
    } as any);

    if (error) {
      toast.error(error.message.includes("unique") ? "You've already reviewed this guide" : "Failed to submit review");
    } else {
      toast.success("Review submitted!");
      setNewRating(0);
      setNewComment("");
      setShowForm(false);
      fetchReviews();
      onReviewAdded();
    }
    setSubmitting(false);
  };

  const handleDeleteReview = async (id: string) => {
    const { error } = await supabase.from("sherpa_reviews" as any).delete().eq("id", id);
    if (!error) { toast.success("Review removed"); fetchReviews(); onReviewAdded(); }
  };

  const visibleReviews = expanded ? reviews : reviews.slice(0, 2);

  return (
    <div className="border-t border-border pt-4 mt-4">
      {/* Summary row */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <StarRating rating={Math.round(avgRating)} />
          <span className="text-xs text-muted-foreground">
            {avgRating > 0 ? avgRating.toFixed(1) : "No ratings"} · {reviews.length} review{reviews.length !== 1 ? "s" : ""}
          </span>
        </div>
        {user && !isOwnListing && !userAlreadyReviewed && (
          <button
            onClick={() => setShowForm(!showForm)}
            className="text-xs font-medium text-primary hover:underline flex items-center gap-1 active:scale-95 transition-transform"
          >
            <MessageSquare className="h-3.5 w-3.5" /> Write Review
          </button>
        )}
      </div>

      {/* Review form */}
      {showForm && (
        <form onSubmit={handleSubmitReview} className="bg-muted/40 rounded-lg p-4 mb-4 space-y-3">
          <div>
            <label className="block text-xs font-medium mb-1.5">Your Rating *</label>
            <StarRating rating={newRating} onRate={setNewRating} interactive size="h-5 w-5" />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1.5">Comment</label>
            <textarea
              rows={3}
              value={newComment}
              onChange={e => setNewComment(e.target.value)}
              placeholder="Share your experience with this guide…"
              maxLength={500}
              className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none"
            />
          </div>
          <div className="flex gap-2">
            <button type="submit" disabled={submitting}
              className="px-4 py-1.5 rounded-md trek-gradient text-primary-foreground text-xs font-semibold disabled:opacity-60 active:scale-95 transition-transform">
              {submitting ? "Submitting…" : "Submit"}
            </button>
            <button type="button" onClick={() => setShowForm(false)}
              className="px-4 py-1.5 rounded-md border border-border text-xs hover:bg-muted transition-colors active:scale-95">
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Reviews list */}
      {!loading && visibleReviews.length > 0 && (
        <div className="space-y-3">
          {visibleReviews.map(r => (
            <div key={r.id} className="flex gap-3">
              <div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary shrink-0">
                {(r.display_name || "T").charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-medium">{r.display_name}</span>
                  <StarRating rating={r.rating} size="h-3 w-3" />
                  <span className="text-[10px] text-muted-foreground">
                    {new Date(r.created_at).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" })}
                  </span>
                </div>
                {r.comment && <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{r.comment}</p>}
                {user?.id === r.user_id && (
                  <button onClick={() => handleDeleteReview(r.id)}
                    className="text-[10px] text-destructive hover:underline mt-1 active:scale-95 transition-transform">
                    Delete
                  </button>
                )}
              </div>
            </div>
          ))}
          {reviews.length > 2 && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="text-xs text-primary hover:underline flex items-center gap-1 active:scale-95 transition-transform"
            >
              {expanded ? <><ChevronUp className="h-3 w-3" /> Show less</> : <><ChevronDown className="h-3 w-3" /> Show all {reviews.length} reviews</>}
            </button>
          )}
        </div>
      )}
    </div>
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

  const [form, setForm] = useState({
    name: "",
    treks_guided: "",
    contact_number: "",
    price_range_min: "",
    price_range_max: "",
    description: "",
  });

  const fetchListings = async () => {
    const { data, error } = await supabase
      .from("sherpa_listings")
      .select("*")
      .order("created_at", { ascending: false });
    if (!error && data) setListings(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchListings();
  }, []);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoFile(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) { toast.error("Please log in first"); return; }
    setSubmitting(true);

    let photo_url: string | null = null;

    if (photoFile) {
      const ext = photoFile.name.split(".").pop();
      const path = `${user.id}/${Date.now()}.${ext}`;
      const { error: uploadErr } = await supabase.storage
        .from("sherpa-photos")
        .upload(path, photoFile);
      if (uploadErr) {
        toast.error("Photo upload failed");
        setSubmitting(false);
        return;
      }
      photo_url = `${SUPABASE_URL}/storage/v1/object/public/sherpa-photos/${path}`;
    }

    const { error } = await supabase.from("sherpa_listings").insert({
      user_id: user.id,
      name: form.name,
      photo_url,
      treks_guided: form.treks_guided,
      contact_number: form.contact_number,
      price_range_min: parseInt(form.price_range_min) || 0,
      price_range_max: parseInt(form.price_range_max) || 0,
      description: form.description,
    });

    if (error) {
      toast.error("Failed to create listing");
    } else {
      toast.success("Listing created!");
      setForm({ name: "", treks_guided: "", contact_number: "", price_range_min: "", price_range_max: "", description: "" });
      setPhotoFile(null);
      setPhotoPreview(null);
      setShowForm(false);
      fetchListings();
    }
    setSubmitting(false);
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("sherpa_listings").delete().eq("id", id);
    if (error) toast.error("Failed to delete");
    else { toast.success("Listing removed"); fetchListings(); }
  };

  return (
    <main className="pt-24 pb-16 container mx-auto px-4 min-h-screen">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10">
        <div>
          <h1 className="text-balance">Find a Sherpa Guide</h1>
          <p className="text-muted-foreground mt-2 max-w-lg">
            Connect with experienced mountain guides for your next trek. Browse listings, read reviews, or create your own.
          </p>
        </div>
        {user && (
          <button
            onClick={() => setShowForm(!showForm)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg trek-gradient text-primary-foreground font-semibold text-sm shadow-md hover:shadow-lg transition-shadow active:scale-[0.97]"
          >
            {showForm ? <><X className="h-4 w-4" /> Cancel</> : <><Plus className="h-4 w-4" /> Create Listing</>}
          </button>
        )}
      </div>

      {/* Creation form */}
      {showForm && (
        <ScrollReveal>
          <form onSubmit={handleSubmit} className="bg-card border border-border rounded-xl p-6 md:p-8 mb-12 max-w-2xl mx-auto space-y-5">
            <h3 className="text-lg font-semibold">Create Your Sherpa Listing</h3>

            {/* Photo upload */}
            <div>
              <label className="block text-sm font-medium mb-2">Your Photo</label>
              <div className="flex items-center gap-4">
                {photoPreview ? (
                  <img src={photoPreview} alt="Preview" className="h-20 w-20 rounded-full object-cover border-2 border-border" />
                ) : (
                  <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center">
                    <Upload className="h-6 w-6 text-muted-foreground" />
                  </div>
                )}
                <label className="cursor-pointer px-4 py-2 text-sm rounded-md border border-border hover:bg-muted transition-colors">
                  Choose Photo
                  <input type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Full Name *</label>
              <input required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Treks You Guide *</label>
              <input required value={form.treks_guided} onChange={e => setForm(f => ({ ...f, treks_guided: e.target.value }))}
                placeholder="e.g. Everest Base Camp, Annapurna Circuit, Roopkund"
                className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Contact Number *</label>
              <input required value={form.contact_number} onChange={e => setForm(f => ({ ...f, contact_number: e.target.value }))}
                placeholder="+91 98765 43210"
                className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Min Price (₹/day)</label>
                <input type="number" value={form.price_range_min} onChange={e => setForm(f => ({ ...f, price_range_min: e.target.value }))}
                  placeholder="1500"
                  className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Max Price (₹/day)</label>
                <input type="number" value={form.price_range_max} onChange={e => setForm(f => ({ ...f, price_range_max: e.target.value }))}
                  placeholder="5000"
                  className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">About You *</label>
              <textarea required rows={4} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                placeholder="Tell trekkers about your experience, certifications, languages spoken…"
                className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none" />
            </div>

            <button type="submit" disabled={submitting}
              className="w-full py-3 rounded-lg trek-gradient text-primary-foreground font-semibold text-sm shadow-md hover:shadow-lg disabled:opacity-60 transition active:scale-[0.97]">
              {submitting ? "Submitting…" : "Publish Listing"}
            </button>
          </form>
        </ScrollReveal>
      )}

      {/* Listings grid */}
      {loading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-card rounded-xl border border-border p-6 animate-pulse">
              <div className="h-24 w-24 rounded-full bg-muted mx-auto mb-4" />
              <div className="h-5 bg-muted rounded w-2/3 mx-auto mb-3" />
              <div className="h-4 bg-muted rounded w-full mb-2" />
              <div className="h-4 bg-muted rounded w-3/4" />
            </div>
          ))}
        </div>
      ) : listings.length === 0 ? (
        <div className="text-center py-20">
          <Mountain className="h-12 w-12 text-muted-foreground/40 mx-auto mb-4" />
          <p className="text-muted-foreground">No sherpa listings yet. Be the first to create one!</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {listings.map((s, i) => (
            <ScrollReveal key={s.id} delay={i * 80}>
              <div className="bg-card rounded-xl border border-border shadow-sm hover:shadow-lg transition-shadow overflow-hidden h-full flex flex-col">
                {/* Photo */}
                <div className="flex justify-center pt-8 pb-4">
                  {s.photo_url ? (
                    <img src={s.photo_url} alt={s.name} className="h-28 w-28 rounded-full object-cover border-4 border-background shadow-md" />
                  ) : (
                    <div className="h-28 w-28 rounded-full bg-muted flex items-center justify-center text-3xl font-bold text-muted-foreground border-4 border-background shadow-md">
                      {s.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>

                <div className="px-6 pb-6 flex flex-col flex-1">
                  {/* Name */}
                  <h3 className="text-center text-lg font-semibold mb-3">{s.name}</h3>

                  {/* Treks */}
                  <div className="flex items-start gap-2 mb-2">
                    <Mountain className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                    <p className="text-sm text-muted-foreground">{s.treks_guided}</p>
                  </div>

                  {/* Contact */}
                  <div className="flex items-center gap-2 mb-2">
                    <Phone className="h-4 w-4 text-primary shrink-0" />
                    <a href={`tel:${s.contact_number}`} className="text-sm font-medium hover:text-primary transition-colors">
                      {s.contact_number}
                    </a>
                  </div>

                  {/* Price */}
                  {(s.price_range_min > 0 || s.price_range_max > 0) && (
                    <div className="flex items-center gap-2 mb-3">
                      <IndianRupee className="h-4 w-4 text-primary shrink-0" />
                      <span className="text-sm text-muted-foreground">
                        ₹{s.price_range_min.toLocaleString()} – ₹{s.price_range_max.toLocaleString()} / day
                      </span>
                    </div>
                  )}

                  {/* Description */}
                  <p className="text-sm text-muted-foreground leading-relaxed pt-3 border-t border-border">
                    {s.description}
                  </p>

                  {/* Delete for owner */}
                  {user?.id === s.user_id && (
                    <button onClick={() => handleDelete(s.id)}
                      className="mt-4 flex items-center gap-1 text-xs text-destructive hover:underline self-end active:scale-95 transition-transform">
                      <Trash2 className="h-3.5 w-3.5" /> Remove listing
                    </button>
                  )}

                  {/* Reviews */}
                  <ReviewSection listing={s} user={user} onReviewAdded={() => {}} />
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
