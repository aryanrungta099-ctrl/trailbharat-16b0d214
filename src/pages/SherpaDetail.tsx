import { useParams, Link } from "react-router-dom";
import { useState, useEffect, useMemo } from "react";
import { ArrowLeft, Mountain, Phone, IndianRupee, Star, MessageSquare, ChevronDown, ChevronUp, Share2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { moderateContent } from "@/lib/moderation";
import ScrollReveal from "@/components/ScrollReveal";
import SEOHead, { breadcrumbSchema } from "@/components/SEOHead";

function StarRating({ rating, onRate, interactive = false, size = "h-4 w-4" }: { rating: number; onRate?: (r: number) => void; interactive?: boolean; size?: string }) {
  return (
    <span className="inline-flex gap-0.5">
      {[1, 2, 3, 4, 5].map(n => (
        <Star key={n} className={`${size} transition-colors ${n <= rating ? "fill-amber-400 text-amber-400" : "text-muted-foreground/30"} ${interactive ? "cursor-pointer hover:text-amber-400" : ""}`} onClick={() => interactive && onRate?.(n)} />
      ))}
    </span>
  );
}

const SherpaDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [sherpa, setSherpa] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [newRating, setNewRating] = useState(0);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    supabase.from("sherpa_listings").select("*").eq("id", id).single()
      .then(({ data }) => { setSherpa(data); setLoading(false); });
  }, [id]);

  const fetchReviews = async () => {
    const { data } = await supabase.from("sherpa_reviews").select("*").eq("sherpa_listing_id", id).order("created_at", { ascending: false });
    if (data) {
      const userIds = [...new Set((data as any[]).map((r: any) => r.user_id))];
      const { data: profiles } = await supabase.from("public_profiles").select("user_id, display_name").in("user_id", userIds);
      const nameMap = new Map((profiles || []).map(p => [p.user_id, p.display_name]));
      setReviews((data as any[]).map((r: any) => ({ ...r, display_name: nameMap.get(r.user_id) || "Trekker" })));
    }
  };

  useEffect(() => { if (id) fetchReviews(); }, [id]);

  const avgRating = useMemo(() => reviews.length === 0 ? 0 : reviews.reduce((s, r) => s + r.rating, 0) / reviews.length, [reviews]);
  const userAlreadyReviewed = user && reviews.some(r => r.user_id === user.id);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) { toast.error("Please log in"); return; }
    if (newRating === 0) { toast.error("Please select a rating"); return; }
    setSubmitting(true);
    const { data: inserted, error } = await supabase.from("sherpa_reviews").insert({ sherpa_listing_id: id, user_id: user.id, rating: newRating, comment: newComment.trim() }).select().single();
    if (error) toast.error("Failed");
    else {
      moderateContent({ table: "sherpa_reviews", recordId: (inserted as any).id, textContent: newComment.trim() });
      toast.success("Review submitted!"); setNewRating(0); setNewComment(""); setShowForm(false); fetchReviews();
    }
    setSubmitting(false);
  };

  const handleShare = () => {
    if (navigator.share) navigator.share({ title: sherpa?.name, text: `Check out ${sherpa?.name} on Himalayan Trails!`, url: window.location.href }).catch(() => {});
    else { navigator.clipboard.writeText(window.location.href); toast.success("Link copied!"); }
  };

  if (loading) return <main className="pt-24 pb-16 container mx-auto px-4"><div className="animate-pulse space-y-4"><div className="h-8 bg-muted rounded w-1/3" /><div className="h-4 bg-muted rounded w-2/3" /></div></main>;

  if (!sherpa) return (
    <main className="pt-24 pb-16 container mx-auto px-4 text-center">
      <h1>Sherpa Not Found</h1>
      <Link to="/guides" className="text-primary hover:underline mt-4 inline-block">← Back to guides</Link>
    </main>
  );

  const visibleReviews = expanded ? reviews : reviews.slice(0, 5);

  return (
    <main className="pt-24 pb-16 min-h-screen">
      <SEOHead
        title={sherpa.name}
        description={`${sherpa.name} — experienced mountain guide. ${sherpa.description.slice(0, 120)}`}
        path={`/sherpa/${id}`}
        jsonLd={breadcrumbSchema([{ name: "Home", url: "/" }, { name: "Guides", url: "/guides" }, { name: sherpa.name, url: `/sherpa/${id}` }])}
      />
      <div className="container mx-auto px-4 max-w-4xl">
        <Link to="/guides" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back to Sherpas & Agencies
        </Link>

        <ScrollReveal>
          <div className="bg-card rounded-2xl border border-border p-8 mb-6">
            <div className="flex flex-col sm:flex-row gap-6 items-start">
              {sherpa.photo_url ? (
                <img src={sherpa.photo_url} alt={sherpa.name} className="h-32 w-32 rounded-full object-cover border-4 border-background shadow-lg" />
              ) : (
                <div className="h-32 w-32 rounded-full bg-primary/10 flex items-center justify-center text-4xl font-bold text-primary border-4 border-background shadow-lg">
                  {sherpa.name.charAt(0).toUpperCase()}
                </div>
              )}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-2xl md:text-3xl">{sherpa.name}</h1>
                  <button onClick={handleShare} className="text-muted-foreground hover:text-foreground transition-colors"><Share2 className="h-4 w-4" /></button>
                </div>
                {avgRating > 0 && (
                  <div className="flex items-center gap-2 mb-3">
                    <StarRating rating={Math.round(avgRating)} />
                    <span className="text-sm text-muted-foreground">{avgRating.toFixed(1)} · {reviews.length} review{reviews.length !== 1 ? "s" : ""}</span>
                  </div>
                )}
                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4">
                  <a href={`tel:${sherpa.contact_number}`} className="inline-flex items-center gap-1.5 text-primary hover:underline"><Phone className="h-4 w-4" /> {sherpa.contact_number}</a>
                  {(sherpa.price_range_min > 0 || sherpa.price_range_max > 0) && (
                    <span className="inline-flex items-center gap-1.5"><IndianRupee className="h-4 w-4 text-primary" /> ₹{sherpa.price_range_min.toLocaleString()} – ₹{sherpa.price_range_max.toLocaleString()}/day</span>
                  )}
                </div>
                <p className="text-muted-foreground leading-relaxed">{sherpa.description}</p>
              </div>
            </div>

            {sherpa.treks_guided && (
              <div className="mt-6 pt-6 border-t border-border">
                <h3 className="text-sm font-semibold mb-3 flex items-center gap-2"><Mountain className="h-4 w-4 text-primary" /> Treks Guided</h3>
                <div className="flex flex-wrap gap-2">
                  {sherpa.treks_guided.split(",").map((t: string) => (
                    <span key={t.trim()} className="text-xs bg-primary/10 text-primary px-3 py-1 rounded-full">{t.trim()}</span>
                  ))}
                </div>
              </div>
            )}

            {sherpa.gallery_urls?.length > 0 && (
              <div className="mt-6 pt-6 border-t border-border">
                <h3 className="text-sm font-semibold mb-3">Gallery</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {sherpa.gallery_urls.map((url: string, i: number) => (
                    <img key={i} src={url} alt={`${sherpa.name} gallery ${i + 1}`} className="rounded-lg w-full aspect-[4/3] object-cover border border-border" />
                  ))}
                </div>
              </div>
            )}
          </div>
        </ScrollReveal>

        {/* Reviews */}
        <ScrollReveal delay={60}>
          <div className="bg-card rounded-xl border border-border p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="flex items-center gap-2"><Star className="h-5 w-5 text-primary" /> Reviews ({reviews.length})</h3>
              {user && !userAlreadyReviewed && sherpa.user_id !== user.id && (
                <button onClick={() => setShowForm(!showForm)} className="text-xs font-medium text-primary hover:underline flex items-center gap-1">
                  <MessageSquare className="h-3.5 w-3.5" /> Write Review
                </button>
              )}
            </div>
            {showForm && (
              <form onSubmit={handleSubmit} className="bg-muted/40 rounded-lg p-4 mb-4 space-y-3">
                <div><label className="block text-xs font-medium mb-1.5">Rating *</label><StarRating rating={newRating} onRate={setNewRating} interactive size="h-5 w-5" /></div>
                <div><label className="block text-xs font-medium mb-1.5">Comment</label><textarea rows={3} value={newComment} onChange={e => setNewComment(e.target.value)} maxLength={500} className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none" /></div>
                <div className="flex gap-2">
                  <button type="submit" disabled={submitting} className="px-4 py-1.5 rounded-md trek-gradient text-primary-foreground text-xs font-semibold disabled:opacity-60 active:scale-95 transition-transform">{submitting ? "Submitting…" : "Submit"}</button>
                  <button type="button" onClick={() => setShowForm(false)} className="px-4 py-1.5 rounded-md border border-border text-xs hover:bg-muted transition-colors active:scale-95">Cancel</button>
                </div>
              </form>
            )}
            {visibleReviews.length > 0 ? (
              <div className="space-y-3">
                {visibleReviews.map((r: any) => (
                  <div key={r.id} className="flex gap-3">
                    <div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary shrink-0">{(r.display_name || "T").charAt(0).toUpperCase()}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-medium">{r.display_name}</span>
                        <StarRating rating={r.rating} size="h-3 w-3" />
                      </div>
                      {r.comment && <p className="text-xs text-muted-foreground mt-1">{r.comment}</p>}
                    </div>
                  </div>
                ))}
                {reviews.length > 5 && (
                  <button onClick={() => setExpanded(!expanded)} className="text-xs text-primary hover:underline flex items-center gap-1">
                    {expanded ? <><ChevronUp className="h-3 w-3" /> Show less</> : <><ChevronDown className="h-3 w-3" /> All {reviews.length} reviews</>}
                  </button>
                )}
              </div>
            ) : (
              <p className="text-xs text-muted-foreground">No reviews yet. Be the first!</p>
            )}
          </div>
        </ScrollReveal>
      </div>
    </main>
  );
};

export default SherpaDetail;
