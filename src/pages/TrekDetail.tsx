import { useParams, Link } from "react-router-dom";
import { useMemo, useState, useEffect } from "react";
import { ArrowLeft, MapPin, Clock, TrendingUp, Calendar, Shield, Users, Wallet, CloudSun, Home, Phone, Eye, AlertTriangle, Mountain, Share2, Star, MessageSquare, ChevronDown, ChevronUp, Briefcase, ExternalLink } from "lucide-react";
import SEOHead, { trekSchema, breadcrumbSchema } from "@/components/SEOHead";
import { treks, MONTHS, Trek } from "@/data/treks";
import { generateBudget } from "@/data/budgets";
import { generateTrekExtras } from "@/data/trekExtras";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import ScrollReveal from "@/components/ScrollReveal";
import { moderateContent } from "@/lib/moderation";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import EnquiryForm from "@/components/EnquiryForm";
import { realTrekPhotos } from "@/data/realTrekPhotos";
import { AmsRiskBlock } from "@/components/AmsRiskBlock";
import ReactMarkdown from "react-markdown";

const difficultyColor: Record<string, string> = {
  Easy: "bg-trek-moss/15 text-trek-moss",
  Moderate: "bg-trek-sky/15 text-trek-sky",
  Difficult: "bg-trek-sunrise/15 text-trek-sunrise",
  Challenging: "bg-destructive/15 text-destructive",
  Expert: "bg-purple-500/15 text-purple-700",
  Local: "bg-amber-500/15 text-amber-700",
};

const safetyColor: Record<string, string> = {
  Safe: "bg-trek-moss/15 text-trek-moss",
  "Moderate Risk": "bg-yellow-500/15 text-yellow-700",
  "High Risk": "bg-trek-sunrise/15 text-trek-sunrise",
  "Extreme Risk": "bg-destructive/15 text-destructive",
};

function parseElev(s: string | undefined): number {
  if (!s) return 0;
  return parseInt(s.replace(/[^0-9]/g, "")) || 0;
}

function getElevationRate(itinerary: Trek["itinerary"]): { day: number; rate: number; risk: string }[] {
  return itinerary.map((item, i) => {
    const elev = parseElev(item.elevation);
    const prevElev = i > 0 ? parseElev(itinerary[i - 1].elevation) : elev;
    const rate = elev - prevElev;
    const risk = rate > 800 ? "Dangerous" : rate > 500 ? "High" : rate > 300 ? "Moderate" : "Safe";
    return { day: item.day, rate, risk };
  });
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

function ShareButton({ title, text }: { title: string; text: string }) {
  const url = window.location.href;
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title, text, url }).catch(() => {});
    } else {
      navigator.clipboard.writeText(url);
      toast.success("Link copied to clipboard!");
    }
  };
  return (
    <button onClick={handleShare} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors active:scale-95">
      <Share2 className="h-3.5 w-3.5" /> Share
    </button>
  );
}

// Right sidebar panel for sherpas, guesthouses, agencies
function TrekServicePanel({ trek }: { trek: Trek }) {
  const [sherpas, setSherpas] = useState<any[]>([]);
  const [guesthouses, setGuesthouses] = useState<any[]>([]);
  const [agencies, setAgencies] = useState<any[]>([]);
  const [showAllSherpas, setShowAllSherpas] = useState(false);
  const [showAllGuesthouses, setShowAllGuesthouses] = useState(false);
  const [showAllAgencies, setShowAllAgencies] = useState(false);

  useEffect(() => {
    // Fetch sherpas that guide this trek
    supabase.from("sherpa_listings").select("*").eq("approved", true).then(({ data }) => {
      if (data) {
        const matching = data.filter(s => s.treks_guided.toLowerCase().includes(trek.name.toLowerCase()) || s.treks_guided.toLowerCase().includes(trek.id));
        setSherpas(matching);
      }
    });
    // Fetch guesthouses in this trek's region
    supabase.from("guesthouse_listings").select("*").eq("approved", true).then(({ data }) => {
      if (data) {
        const matching = (data as any[]).filter(g =>
          g.trek_region.toLowerCase().includes(trek.region.toLowerCase()) ||
          g.location.toLowerCase().includes(trek.state.toLowerCase()) ||
          trek.itinerary.some(day => g.location.toLowerCase().includes(day.title.toLowerCase().split(" to ").pop()?.trim().toLowerCase() || ""))
        );
        setGuesthouses(matching);
      }
    });
    // Fetch agencies offering this trek
    supabase.from("agency_listings").select("*").eq("approved", true).then(({ data }) => {
      if (data) {
        const matching = (data as any[]).filter(a => a.treks_offered && a.treks_offered.includes(trek.id));
        setAgencies(matching);
      }
    });
  }, [trek]);

  const visibleSherpas = showAllSherpas ? sherpas : sherpas.slice(0, 3);
  const visibleGuesthouses = showAllGuesthouses ? guesthouses : guesthouses.slice(0, 3);
  const visibleAgencies = showAllAgencies ? agencies : agencies.slice(0, 3);

  if (sherpas.length === 0 && guesthouses.length === 0 && agencies.length === 0) {
    return (
      <div className="space-y-4">
        {/* Decorative mountain illustration when no services */}
        <div className="bg-card rounded-xl border border-border p-6 text-center">
          <div className="mb-4">
            <svg viewBox="0 0 300 200" className="w-full max-w-[260px] mx-auto opacity-15" fill="currentColor">
              <path d="M0 200 L50 100 L100 140 L150 60 L200 120 L250 80 L300 200Z" />
              <path d="M0 200 L80 130 L130 160 L180 90 L230 130 L300 200Z" opacity="0.5" />
            </svg>
          </div>
          <h4 className="font-display text-sm font-semibold mb-2">Trek Services</h4>
          <p className="text-xs text-muted-foreground leading-relaxed mb-3">No guides or guesthouses listed for this trek yet. Be the first to add one!</p>
          <div className="space-y-2">
            <Link to="/guides" className="block text-xs text-primary hover:underline">Find a Sherpa →</Link>
            <Link to="/guesthouses" className="block text-xs text-primary hover:underline">List a Guesthouse →</Link>
          </div>
        </div>
        {/* Quick facts sidebar */}
        <div className="bg-card rounded-xl border border-border p-5">
          <h4 className="font-display text-sm font-semibold mb-3 flex items-center gap-2"><Mountain className="h-4 w-4 text-primary" /> Quick Facts</h4>
          <div className="space-y-2.5 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">Region</span><span className="font-medium">{trek.region}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">State</span><span className="font-medium">{trek.state}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Country</span><span className="font-medium">{trek.country}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Duration</span><span className="font-medium">{trek.durationDays} days</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Max Altitude</span><span className="font-medium">{trek.altitudeMeters.toLocaleString()}m</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Difficulty</span><span className="font-medium">{trek.difficulty}</span></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {sherpas.length > 0 && (
        <div className="bg-card rounded-xl border border-border p-5">
          <h4 className="font-display text-sm font-semibold mb-3 flex items-center gap-2"><Mountain className="h-4 w-4 text-primary" /> Sherpa Guides ({sherpas.length})</h4>
          <div className="space-y-3">
            {visibleSherpas.map(s => (
              <div key={s.id} className="flex gap-3 items-start">
                {s.photo_url ? <img src={s.photo_url} alt={s.name} className="h-10 w-10 rounded-full object-cover border border-border shrink-0" /> : <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0"><Mountain className="h-4 w-4 text-primary" /></div>}
                <div className="min-w-0 flex-1">
                  <div className="font-medium text-sm">{s.name}</div>
                  <a href={`tel:${s.contact_number}`} className="text-xs text-primary hover:underline">{s.contact_number}</a>
                  <div className="text-xs text-muted-foreground mt-0.5">₹{s.price_range_min}–₹{s.price_range_max}/day</div>
                </div>
              </div>
            ))}
          </div>
          {sherpas.length > 3 && (
            <button onClick={() => setShowAllSherpas(!showAllSherpas)} className="text-xs text-primary hover:underline mt-3 flex items-center gap-1">
              {showAllSherpas ? <><ChevronUp className="h-3 w-3" /> Show less</> : <><ChevronDown className="h-3 w-3" /> View all {sherpas.length}</>}
            </button>
          )}
        </div>
      )}

      {guesthouses.length > 0 && (
        <div className="bg-card rounded-xl border border-border p-5">
          <h4 className="font-display text-sm font-semibold mb-3 flex items-center gap-2"><Home className="h-4 w-4 text-primary" /> Guesthouses ({guesthouses.length})</h4>
          <div className="space-y-3">
            {visibleGuesthouses.map(g => (
              <div key={g.id} className="flex gap-3 items-start">
                {g.photo_url ? <img src={g.photo_url} alt={g.name} className="h-10 w-10 rounded-lg object-cover border border-border shrink-0" /> : <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0"><Home className="h-4 w-4 text-primary" /></div>}
                <div className="min-w-0 flex-1">
                  <div className="font-medium text-sm">{g.name}</div>
                  <div className="text-xs text-muted-foreground">{g.location}</div>
                  <a href={`tel:${g.contact_number}`} className="text-xs text-primary hover:underline">{g.contact_number}</a>
                </div>
              </div>
            ))}
          </div>
          {guesthouses.length > 3 && (
            <button onClick={() => setShowAllGuesthouses(!showAllGuesthouses)} className="text-xs text-primary hover:underline mt-3 flex items-center gap-1">
              {showAllGuesthouses ? <><ChevronUp className="h-3 w-3" /> Show less</> : <><ChevronDown className="h-3 w-3" /> View all {guesthouses.length}</>}
            </button>
          )}
        </div>
      )}

      {agencies.length > 0 && (
        <div className="bg-card rounded-xl border border-border p-5">
          <h4 className="font-display text-sm font-semibold mb-3 flex items-center gap-2"><Briefcase className="h-4 w-4 text-primary" /> Agencies ({agencies.length})</h4>
          <div className="space-y-3">
            {visibleAgencies.map(a => (
              <div key={a.id} className="flex gap-3 items-start">
                {a.logo_url ? <img src={a.logo_url} alt={a.name} className="h-10 w-10 rounded-lg object-cover border border-border shrink-0" /> : <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0"><Briefcase className="h-4 w-4 text-primary" /></div>}
                <div className="min-w-0 flex-1">
                  <div className="font-medium text-sm">{a.name}</div>
                  <a href={`tel:${a.contact_number}`} className="text-xs text-primary hover:underline">{a.contact_number}</a>
                  {a.website && <a href={a.website} target="_blank" rel="noopener noreferrer" className="text-xs text-muted-foreground hover:text-primary flex items-center gap-1 mt-0.5"><ExternalLink className="h-3 w-3" /> Website</a>}
                </div>
              </div>
            ))}
          </div>
          {agencies.length > 3 && (
            <button onClick={() => setShowAllAgencies(!showAllAgencies)} className="text-xs text-primary hover:underline mt-3 flex items-center gap-1">
              {showAllAgencies ? <><ChevronUp className="h-3 w-3" /> Show less</> : <><ChevronDown className="h-3 w-3" /> View all {agencies.length}</>}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

// Trek Review Section
function TrekReviewSection({ trekId, user }: { trekId: string; user: any }) {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [newRating, setNewRating] = useState(0);
  const [newComment, setNewComment] = useState("");

  const fetchReviews = async () => {
    const { data } = await supabase.from("trek_reviews").select("*").eq("trek_id", trekId).order("created_at", { ascending: false });
    if (data) {
      const userIds = [...new Set((data as any[]).map((r: any) => r.user_id))];
      if (userIds.length > 0) {
        const { data: profiles } = await supabase.from("public_profiles").select("user_id, display_name").in("user_id", userIds);
        const nameMap = new Map((profiles || []).map(p => [p.user_id, p.display_name]));
        setReviews((data as any[]).map((r: any) => ({ ...r, display_name: nameMap.get(r.user_id) || "Trekker" })));
      } else {
        setReviews([]);
      }
    }
    setLoading(false);
  };

  useEffect(() => { fetchReviews(); }, [trekId]);

  const avgRating = useMemo(() => reviews.length === 0 ? 0 : reviews.reduce((s: number, r: any) => s + r.rating, 0) / reviews.length, [reviews]);
  const userAlreadyReviewed = user && reviews.some((r: any) => r.user_id === user.id);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) { toast.error("Please log in"); return; }
    if (newRating === 0) { toast.error("Please select a rating"); return; }
    setSubmitting(true);
    const { data: inserted, error } = await supabase.from("trek_reviews").insert({ trek_id: trekId, user_id: user.id, rating: newRating, comment: newComment.trim() }).select().single();
    if (error) toast.error("Failed");
    else {
      moderateContent({ table: "trek_reviews", recordId: (inserted as any).id, textContent: newComment.trim() });
      toast.success("Review submitted!"); setNewRating(0); setNewComment(""); setShowForm(false); fetchReviews();
    }
    setSubmitting(false);
  };

  const visibleReviews = expanded ? reviews : reviews.slice(0, 3);

  return (
    <div className="bg-card rounded-xl border border-border p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="flex items-center gap-2"><Star className="h-5 w-5 text-primary" /> Reviews</h3>
        <div className="flex items-center gap-3">
          {avgRating > 0 && <span className="text-sm font-medium">{avgRating.toFixed(1)} <StarRating rating={Math.round(avgRating)} size="h-3.5 w-3.5" /></span>}
          <span className="text-xs text-muted-foreground">{reviews.length} review{reviews.length !== 1 ? "s" : ""}</span>
        </div>
      </div>
      {user && !userAlreadyReviewed && (
        <button onClick={() => setShowForm(!showForm)} className="text-xs font-medium text-primary hover:underline flex items-center gap-1 mb-3"><MessageSquare className="h-3.5 w-3.5" /> Write a review</button>
      )}
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
      {!loading && visibleReviews.length > 0 && (
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
                {user?.id === r.user_id && (
                  <button onClick={async () => { await supabase.from("trek_reviews").delete().eq("id", r.id); toast.success("Deleted"); fetchReviews(); }} className="text-[10px] text-destructive hover:underline mt-1">Delete</button>
                )}
              </div>
            </div>
          ))}
          {reviews.length > 3 && (
            <button onClick={() => setExpanded(!expanded)} className="text-xs text-primary hover:underline flex items-center gap-1">
              {expanded ? <><ChevronUp className="h-3 w-3" /> Show less</> : <><ChevronDown className="h-3 w-3" /> All {reviews.length} reviews</>}
            </button>
          )}
        </div>
      )}
      {!loading && reviews.length === 0 && !showForm && <p className="text-xs text-muted-foreground">No reviews yet. Be the first!</p>}
    </div>
  );
}

// Trek images - curated mountain/trek photos
const TREK_PHOTOS = [
  "https://images.unsplash.com/photo-1585409677983-0f6c41ca9c3b?w=800&h=500&fit=crop",
  "https://images.unsplash.com/photo-1486911278844-a81c5267e227?w=800&h=500&fit=crop",
  "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&h=500&fit=crop",
  "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=500&fit=crop",
  "https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=800&h=500&fit=crop",
  "https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?w=800&h=500&fit=crop",
  "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800&h=500&fit=crop",
  "https://images.unsplash.com/photo-1477346611705-65d1883cee1e?w=800&h=500&fit=crop",
  "https://images.unsplash.com/photo-1518791841217-8f162f1e1131?w=800&h=500&fit=crop",
  "https://images.unsplash.com/photo-1434394354979-a235cd36269d?w=800&h=500&fit=crop",
  "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800&h=500&fit=crop",
  "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&h=500&fit=crop",
];

function getTrekImages(trek: Trek): { url: string; caption: string; source: string; descUrl?: string; license?: string; artist?: string }[] {
  // Prefer real Wikimedia photos if available for this trek
  const real = realTrekPhotos[trek.id];
  if (real && real.length > 0) {
    return real.slice(0, 3).map(p => ({
      url: p.url,
      caption: p.caption || `${trek.name}`,
      source: p.source,
      descUrl: p.descUrl,
      license: p.license,
      artist: p.artist,
    }));
  }
  const hash = trek.id.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  return [
    { url: TREK_PHOTOS[hash % TREK_PHOTOS.length], caption: `${trek.region} landscape`, source: "Unsplash" },
    { url: TREK_PHOTOS[(hash + 1) % TREK_PHOTOS.length], caption: `${trek.name} trail`, source: "Unsplash" },
    { url: TREK_PHOTOS[(hash + 2) % TREK_PHOTOS.length], caption: `${trek.state} mountains`, source: "Unsplash" },
  ];
}

// Get an itinerary day photo based on trek and day
function getDayPhoto(trekId: string, day: number): string {
  const real = realTrekPhotos[trekId];
  if (real && real.length > 0) {
    return real[(day - 1) % real.length].url;
  }
  const hash = trekId.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  return TREK_PHOTOS[(hash + day * 3) % TREK_PHOTOS.length];
}

const TrekDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const baseTrek = treks.find(t => t.id === id);
  const [completionCount, setCompletionCount] = useState(0);
  const [budgetTab, setBudgetTab] = useState<"low" | "high">("low");
  const [activeTab, setActiveTab] = useState<"overview" | "altitude" | "budget" | "safety" | "stays" | "emergency">("overview");
  const [trekOverride, setTrekOverride] = useState<any>(null);
  const [teaHouses, setTeaHouses] = useState<any[]>([]);

  // Fetch override data and tea houses
  useEffect(() => {
    if (!baseTrek) return;
    supabase.from("trek_overrides").select("*").eq("trek_id", baseTrek.id).maybeSingle().then(({ data }) => {
      if (data) setTrekOverride(data);
    });
    supabase.from("trek_tea_houses").select("*").eq("trek_id", baseTrek.id).order("village").then(({ data }) => {
      if (data) setTeaHouses(data as any[]);
    });
  }, [baseTrek?.id]);

  // Merge override data with base trek
  const trek = useMemo(() => {
    if (!baseTrek) return null;
    if (!trekOverride) return baseTrek;
    return {
      ...baseTrek,
      description: trekOverride.description || baseTrek.description,
      highlights: trekOverride.highlights?.length > 0 ? trekOverride.highlights : baseTrek.highlights,
      itinerary: trekOverride.itinerary_json ? (trekOverride.itinerary_json as any[]) : baseTrek.itinerary,
    };
  }, [baseTrek, trekOverride]);

  const budget = useMemo(() => trek ? (trek.budget ?? generateBudget(trek.country, trek.durationDays, trek.difficulty, trek.altitudeMeters, trek.name)) : null, [trek]);
  const extras = useMemo(() => trek ? generateTrekExtras(trek.name, trek.country, trek.region, trek.state, trek.altitudeMeters, trek.difficulty, trek.durationDays, trek.bestMonths, trek.highlights, trek.itinerary) : null, [trek]);
  const trekImages = useMemo(() => trek ? getTrekImages(trek) : [], [trek]);

  const altitudeData = useMemo(() => {
    if (!trek) return [];
    return trek.itinerary.map(day => ({
      name: `Day ${day.day}`,
      altitude: parseElev(day.elevation),
      title: day.title,
    }));
  }, [trek]);

  const elevationRates = useMemo(() => trek ? getElevationRate(trek.itinerary) : [], [trek]);

  useEffect(() => {
    if (!trek) return;
    supabase.from("completed_treks").select("id", { count: "exact" }).eq("trek_id", trek.id)
      .then(({ count }) => setCompletionCount(count || 0));
  }, [trek]);

  if (!trek) return (
    <main className="pt-24 pb-16 container mx-auto px-4 text-center">
      <h1>Trek Not Found</h1>
      <Link to="/routes" className="text-primary hover:underline mt-4 inline-block">← Back to routes</Link>
    </main>
  );

  const tabs = [
    { id: "overview" as const, label: "Overview", icon: Mountain },
    { id: "altitude" as const, label: "Altitude Chart", icon: TrendingUp },
    { id: "budget" as const, label: "Budget", icon: Wallet },
    { id: "safety" as const, label: "Weather & Safety", icon: CloudSun },
    { id: "stays" as const, label: "Stays & Views", icon: Home },
    { id: "emergency" as const, label: "Emergency", icon: Phone },
  ];

  return (
    <main className="pt-24 pb-16 min-h-screen bg-gradient-to-b from-background via-muted/30 to-background relative overflow-hidden">
      <SEOHead
        title={trek.name}
        description={`${trek.name} trek in ${trek.region}, ${trek.state} — ${trek.durationDays} days, ${trek.altitudeMeters.toLocaleString()}m altitude. ${trek.description.slice(0, 100)}`}
        path={`/trek/${trek.id}`}
        jsonLd={[
          trekSchema(trek),
          breadcrumbSchema([{ name: "Home", url: "/" }, { name: "Trek Routes", url: "/routes" }, { name: trek.name, url: `/trek/${trek.id}` }]),
        ]}
      />
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-0">
        <svg viewBox="0 0 1440 900" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
          <path d="M0 900 L0 600 L120 500 L240 550 L360 420 L480 480 L600 350 L720 400 L840 300 L960 380 L1080 280 L1200 350 L1320 250 L1440 320 L1440 900Z" fill="currentColor"/>
          <path d="M0 900 L0 700 L180 620 L360 680 L540 580 L720 640 L900 520 L1080 600 L1260 500 L1440 560 L1440 900Z" fill="currentColor" opacity="0.5"/>
        </svg>
      </div>
      <div className="relative z-10">
      <div className="container mx-auto px-4">
        {/* Back link */}
        <Link to="/routes" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back to routes
        </Link>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Main content */}
          <div className="flex-1 min-w-0">
            {/* Header */}
            <ScrollReveal>
              <div className="bg-card rounded-2xl border border-border p-8 mb-6 shadow-sm">
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${difficultyColor[trek.difficulty]}`}>{trek.difficulty}</span>
                  <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-muted text-muted-foreground">{trek.country}</span>
                  {extras && <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${safetyColor[extras.weather.safetyLevel]}`}>{extras.weather.safetyLevel}</span>}
                  <ShareButton title={trek.name} text={`Check out ${trek.name} trek on Himalayan Trails!`} />
                </div>
                <h1 className="text-3xl md:text-4xl mb-4">{trek.name}</h1>

                {/* AI-content banner — shown only for ai_generated pages */}
                {trekOverride?.content_source === "ai_generated" && (
                  <div className="mb-4 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg text-xs text-yellow-700 dark:text-yellow-400 flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
                    <p>
                      <strong>This guide is AI-assisted and pending editorial review.</strong> Verified details are marked with ✓. Spotted an error? <a href="mailto:corrections@himalayantrails.aryanrungta.com" className="underline">Report it</a>.
                    </p>
                  </div>
                )}

                <p className="text-muted-foreground leading-relaxed mb-6">{trek.description}</p>

                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                  <span className="inline-flex items-center gap-1.5"><MapPin className="h-4 w-4 text-primary" />{trek.region}, {trek.state}</span>
                  <span className="inline-flex items-center gap-1.5"><Clock className="h-4 w-4 text-primary" />{trek.durationDays} days</span>
                  <span className="inline-flex items-center gap-1.5"><TrendingUp className="h-4 w-4 text-primary" />{trek.altitudeMeters.toLocaleString()}m</span>
                  <span className="inline-flex items-center gap-1.5"><Calendar className="h-4 w-4 text-primary" />{trek.bestMonths.map(m => MONTHS[m - 1]).join(", ")}</span>
                  <span className="inline-flex items-center gap-1.5"><Users className="h-4 w-4 text-primary" />{completionCount} completed</span>
                </div>

                {/* Trust strip */}
                <div className="mt-5 pt-4 border-t border-border flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[11px] text-muted-foreground">
                  <span className="inline-flex items-center gap-1">
                    <Shield className="h-3 w-3 text-trek-moss" />
                    {trekOverride?.last_verified_at
                      ? <>Last verified: <time dateTime={trekOverride.last_verified_at}>{new Date(trekOverride.last_verified_at).toLocaleDateString("en-IN", { month: "short", year: "numeric" })}</time></>
                      : <>Editorial baseline · {new Date().toLocaleDateString("en-IN", { month: "short", year: "numeric" })}</>}
                  </span>
                  {trekOverride?.author_name && (
                    <span>By <span className="font-medium text-foreground">{trekOverride.author_name}</span>{trekOverride.author_credentials ? `, ${trekOverride.author_credentials}` : ""}</span>
                  )}
                  <a href={`mailto:corrections@himalayantrails.aryanrungta.com?subject=Outdated info: ${encodeURIComponent(trek.name)}`} className="text-primary hover:underline ml-auto">Report outdated info →</a>
                </div>
              </div>
            </ScrollReveal>

            {/* Trek Images */}
            {trekImages.length > 0 && (
              <ScrollReveal delay={40}>
                <div className="mb-6">
                  <div className="grid grid-cols-3 gap-2 rounded-xl overflow-hidden">
                    {trekImages.map((img, i) => (
                      <div key={i} className="relative aspect-[4/3] bg-muted">
                        <img src={img.url} alt={img.caption} className="w-full h-full object-cover" loading="lazy" />
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2">
                          <p className="text-[10px] text-white/90 line-clamp-1">{img.caption}</p>
                          {img.descUrl ? (
                            <a href={img.descUrl} target="_blank" rel="noopener noreferrer" className="text-[8px] text-white/60 hover:text-white/90">
                              📷 {img.source}{img.license ? ` · ${img.license}` : ""}
                            </a>
                          ) : (
                            <p className="text-[8px] text-white/60">📷 {img.source}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </ScrollReveal>
            )}

            {/* Tabs */}
            <ScrollReveal delay={60}>
              <div className="flex gap-1.5 mb-6 overflow-x-auto pb-1">
                {tabs.map(t => (
                  <button key={t.id} onClick={() => setActiveTab(t.id)}
                    className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all active:scale-[0.97] ${activeTab === t.id ? "bg-primary text-primary-foreground shadow" : "bg-muted text-muted-foreground hover:text-foreground"}`}>
                    <t.icon className="h-3.5 w-3.5" /> {t.label}
                  </button>
                ))}
              </div>
            </ScrollReveal>

            <ScrollReveal delay={80}>
              {activeTab === "overview" && (
                <div className="space-y-6">
                  <div className="bg-card rounded-xl border border-border p-6">
                    <h3 className="mb-4">Highlights</h3>
                    <ul className="grid sm:grid-cols-2 gap-x-4 gap-y-2">
                      {trek.highlights.map(h => <li key={h} className="text-sm text-muted-foreground flex items-start gap-2"><span className="text-trek-moss mt-0.5">•</span> {h}</li>)}
                    </ul>
                  </div>

                  <div className="bg-card rounded-xl border border-border p-6">
                    <h3 className="mb-4">Day-by-Day Itinerary</h3>
                    <div className="space-y-4">
                      {trek.itinerary.map(day => {
                        const villageName = day.townName || day.title.split(" to ").pop()?.trim() || "";
                        const villageTeaHouses = teaHouses.filter(th => th.village.toLowerCase() === villageName.toLowerCase());
                        return (
                          <div key={day.day} className="border border-border rounded-xl overflow-hidden">
                            {/* Day header */}
                            <div className="bg-muted/40 px-4 py-3 flex items-center gap-3 border-b border-border">
                              <span className="inline-flex items-center justify-center px-2.5 py-1 rounded-full bg-primary text-primary-foreground font-semibold text-xs shrink-0">Day {day.day}</span>
                              <h4 className="font-semibold text-sm text-foreground">{day.title}</h4>
                            </div>
                            <div className="p-4">
                              <p className="text-sm text-muted-foreground leading-relaxed">{day.description}</p>
                              <div className="flex flex-wrap gap-3 mt-2 text-xs">
                                {day.distance && <span className="inline-flex items-center gap-1 bg-muted px-2 py-1 rounded-full">📏 {day.distance}</span>}
                                {day.elevation && <span className="inline-flex items-center gap-1 bg-muted px-2 py-1 rounded-full">⛰️ {day.elevation}</span>}
                                {day.townAltitude && <span className="inline-flex items-center gap-1 bg-primary/10 text-primary px-2 py-1 rounded-full">📍 {day.townAltitude.toLocaleString()}m</span>}
                              </div>
                              {/* Town/Village Info */}
                              {day.townName && day.townDescription && (
                                <div className="mt-3 bg-muted/50 rounded-lg p-3 border border-border/50">
                                  <div className="flex items-center gap-2 mb-1">
                                    <MapPin className="h-3.5 w-3.5 text-primary" />
                                    <span className="font-medium text-xs">{day.townName}</span>
                                    {day.townAltitude && <span className="text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded-full">{day.townAltitude.toLocaleString()}m</span>}
                                  </div>
                                  <p className="text-xs text-muted-foreground leading-relaxed">{day.townDescription}</p>
                                </div>
                              )}
                              {/* Tea Houses for this village */}
                              {villageTeaHouses.length > 0 && (
                                <div className="mt-2 space-y-2">
                                  {villageTeaHouses.map(th => (
                                    <div key={th.id} className="bg-primary/5 rounded-lg p-3 border border-primary/10">
                                      <div className="flex items-start justify-between gap-2">
                                        <div>
                                          <div className="font-medium text-xs flex items-center gap-1.5"><Home className="h-3 w-3 text-primary" /> {th.name}</div>
                                          {th.description && <p className="text-[11px] text-muted-foreground mt-0.5">{th.description}</p>}
                                        </div>
                                        {th.price_range && <span className="text-[10px] text-primary font-medium whitespace-nowrap">{th.price_range}</span>}
                                      </div>
                                      {th.contact_number && (
                                        <a href={`tel:${th.contact_number}`} className="text-[11px] text-primary hover:underline flex items-center gap-1 mt-1"><Phone className="h-3 w-3" /> {th.contact_number}</a>
                                      )}
                                      {th.facilities?.length > 0 && (
                                        <div className="flex flex-wrap gap-1 mt-1.5">
                                          {th.facilities.map((f: string) => <span key={f} className="text-[10px] bg-muted px-1.5 py-0.5 rounded-full text-muted-foreground">{f}</span>)}
                                        </div>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {extras && (
                    <div className="bg-card rounded-xl border border-border p-6">
                      <h3 className="mb-4 flex items-center gap-2"><Eye className="h-5 w-5 text-primary" /> Viewpoints</h3>
                      <div className="grid sm:grid-cols-2 gap-3">
                        {extras.viewpoints.map(vp => (
                          <div key={vp.name} className="bg-muted/50 rounded-lg p-3 border border-border/50">
                            <div className="font-medium text-sm">{vp.name}</div>
                            <p className="text-xs text-muted-foreground mt-1">{vp.description}</p>
                            <span className="text-xs text-primary mt-1 inline-block">🕐 {vp.bestTime}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === "altitude" && (
                <div className="space-y-6">
                  <div className="bg-card rounded-xl border border-border p-6">
                    <h3 className="mb-4">Altitude Profile</h3>
                    <div className="h-72">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={altitudeData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                          <defs>
                            <linearGradient id="altGrad" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="hsl(152, 35%, 28%)" stopOpacity={0.3} />
                              <stop offset="95%" stopColor="hsl(152, 35%, 28%)" stopOpacity={0} />
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="hsl(40, 12%, 86%)" />
                          <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                          <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `${v}m`} />
                          <Tooltip content={({ active, payload }) => {
                            if (!active || !payload?.length) return null;
                            const d = payload[0].payload;
                            return (
                              <div className="bg-card border border-border rounded-lg p-3 shadow-lg text-xs">
                                <div className="font-medium">{d.name}: {d.title}</div>
                                <div className="text-primary font-bold mt-1">{d.altitude.toLocaleString()}m</div>
                              </div>
                            );
                          }} />
                          <Area type="monotone" dataKey="altitude" stroke="hsl(152, 35%, 28%)" fill="url(#altGrad)" strokeWidth={2} />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div className="bg-card rounded-xl border border-border p-6">
                    <h3 className="mb-4 flex items-center gap-2"><Shield className="h-5 w-5 text-primary" /> Elevation Gain Rate & Safety</h3>
                    <p className="text-xs text-muted-foreground mb-4">Above 3,000m, ascend no more than 300-500m per day.</p>
                    <div className="space-y-2">
                      {elevationRates.map(er => (
                        <div key={er.day} className="flex items-center gap-3 text-sm">
                          <span className="w-14 shrink-0 text-xs font-medium text-primary">Day {er.day}</span>
                          <div className="flex-1 bg-muted rounded-full h-3 overflow-hidden">
                            <div className={`h-full rounded-full transition-all ${er.risk === "Safe" ? "bg-trek-moss" : er.risk === "Moderate" ? "bg-yellow-500" : er.risk === "High" ? "bg-trek-sunrise" : "bg-destructive"}`} style={{ width: `${Math.min(Math.abs(er.rate) / 10, 100)}%` }} />
                          </div>
                          <span className="w-20 text-right text-xs text-muted-foreground">{er.rate > 0 ? "+" : ""}{er.rate}m</span>
                          <span className={`w-20 text-xs font-medium px-2 py-0.5 rounded-full text-center ${er.risk === "Safe" ? "bg-trek-moss/15 text-trek-moss" : er.risk === "Moderate" ? "bg-yellow-500/15 text-yellow-700" : er.risk === "High" ? "bg-trek-sunrise/15 text-trek-sunrise" : "bg-destructive/15 text-destructive"}`}>{er.risk}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "budget" && budget && (
                <div className="bg-card rounded-xl border border-border p-6">
                  <div className="flex gap-2 mb-4">
                    <button onClick={() => setBudgetTab("low")} className={`px-4 py-2 rounded-lg text-xs font-medium transition-all active:scale-[0.97] ${budgetTab === "low" ? "bg-trek-moss text-primary-foreground shadow" : "bg-muted text-muted-foreground"}`}>💰 Low Budget</button>
                    <button onClick={() => setBudgetTab("high")} className={`px-4 py-2 rounded-lg text-xs font-medium transition-all active:scale-[0.97] ${budgetTab === "high" ? "bg-trek-sunrise text-primary-foreground shadow" : "bg-muted text-muted-foreground"}`}>💎 High Budget</button>
                  </div>
                  {(() => {
                    const data = budgetTab === "low" ? budget.low : budget.high;
                    return (
                      <div className={`rounded-xl border p-5 ${budgetTab === "low" ? "border-trek-moss/30 bg-trek-moss/5" : "border-trek-sunrise/30 bg-trek-sunrise/5"}`}>
                        <div className="flex items-baseline justify-between mb-4">
                          <div>
                            <div className="text-xs text-muted-foreground uppercase tracking-wider font-medium mb-1">{budgetTab === "low" ? "Estimated Low Budget" : "Estimated High Budget"}</div>
                            <div className="font-display text-2xl font-bold">{data.total}</div>
                          </div>
                          <div className={`text-sm font-medium px-3 py-1 rounded-full ${budgetTab === "low" ? "bg-trek-moss/15 text-trek-moss" : "bg-trek-sunrise/15 text-trek-sunrise"}`}>{data.perDay}</div>
                        </div>
                        <div className="space-y-2 mb-4">
                          {data.items.map(item => (
                            <div key={item.category} className="flex items-center justify-between text-sm">
                              <span className="text-muted-foreground">{item.category}</span>
                              <span className="font-medium tabular-nums">{item.amount}</span>
                            </div>
                          ))}
                        </div>
                        <div className={`rounded-lg p-3 text-xs leading-relaxed ${budgetTab === "low" ? "bg-trek-moss/10 text-trek-moss" : "bg-trek-sunrise/10 text-trek-sunrise"}`}>
                          <span className="font-semibold">💡 Tip: </span>{data.tips}
                        </div>
                      </div>
                    );
                  })()}
                </div>
              )}

              {activeTab === "safety" && extras && (
                <div className="space-y-6">
                  <div className={`bg-card rounded-xl border p-6 ${safetyColor[extras.weather.safetyLevel].split(" ")[0]}`}>
                    <h3 className="mb-3 flex items-center gap-2"><CloudSun className="h-5 w-5" /> Weather Conditions</h3>
                    <div className="grid sm:grid-cols-2 gap-3 text-sm mb-3">
                      <div><span className="text-muted-foreground">Season:</span> <span className="font-medium">{extras.weather.currentSeason}</span></div>
                      <div><span className="text-muted-foreground">Temperature:</span> <span className="font-medium">{extras.weather.temperature}</span></div>
                      <div><span className="text-muted-foreground">Rainfall:</span> <span className="font-medium">{extras.weather.rainfall}</span></div>
                      <div><span className="text-muted-foreground">Safety:</span> <span className={`font-medium px-2 py-0.5 rounded-full text-xs ${safetyColor[extras.weather.safetyLevel]}`}>{extras.weather.safetyLevel}</span></div>
                    </div>
                    <p className="text-sm">{extras.weather.safetyNote}</p>
                  </div>

                  {/* Monthly Best-Time Calendar */}
                  <div className="bg-card rounded-xl border border-border p-6">
                    <h3 className="mb-4 flex items-center gap-2"><Calendar className="h-5 w-5 text-primary" /> Best Time to Go</h3>
                    <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-12 gap-1.5">
                      {extras.monthlyConditions.map(mc => {
                        const bg = mc.condition === "Excellent" ? "bg-trek-moss/20 border-trek-moss/40 text-trek-moss" :
                          mc.condition === "Good" ? "bg-trek-sky/15 border-trek-sky/30 text-trek-sky" :
                          mc.condition === "Fair" ? "bg-yellow-500/15 border-yellow-500/30 text-yellow-700" :
                          mc.condition === "Poor" ? "bg-trek-sunrise/15 border-trek-sunrise/30 text-trek-sunrise" :
                          "bg-destructive/15 border-destructive/30 text-destructive";
                        return (
                          <div key={mc.month} className={`rounded-lg border p-2 text-center ${bg} ${mc.isBest ? "ring-2 ring-trek-moss ring-offset-1" : ""}`}>
                            <div className="text-xs font-bold">{mc.month}</div>
                            <div className="text-[9px] mt-0.5">{mc.tempRange}</div>
                            <div className="text-[9px] mt-0.5">{mc.rainfall}</div>
                          </div>
                        );
                      })}
                    </div>
                    <div className="flex flex-wrap gap-3 mt-3 text-[10px]">
                      <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-trek-moss/20 border border-trek-moss/40" /> Excellent</span>
                      <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-trek-sky/15 border border-trek-sky/30" /> Good</span>
                      <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-yellow-500/15 border border-yellow-500/30" /> Fair</span>
                      <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-trek-sunrise/15 border border-trek-sunrise/30" /> Poor</span>
                      <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-destructive/15 border border-destructive/30" /> Dangerous</span>
                    </div>
                  </div>

                  <div className="bg-card rounded-xl border border-border p-6">
                    <h3 className="mb-3">🐾 Wildlife</h3>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {extras.wildlife.animals.map(a => <span key={a} className="text-xs bg-muted border border-border rounded-full px-2.5 py-1">{a}</span>)}
                    </div>
                    <ul className="space-y-1">
                      {extras.wildlife.safetyTips.map((t, i) => <li key={i} className="text-xs text-muted-foreground flex items-start gap-1.5"><AlertTriangle className="h-3 w-3 text-yellow-600 shrink-0 mt-0.5" /> {t}</li>)}
                    </ul>
                  </div>
                </div>
              )}

              {activeTab === "stays" && extras && (
                <div className="space-y-6">
                  <div className="bg-card rounded-xl border border-border p-6">
                    <h3 className="mb-4 flex items-center gap-2"><Home className="h-5 w-5 text-primary" /> Recommended Stays</h3>
                    <div className="space-y-3">
                      {extras.guesthouses.map((gh, i) => (
                        <div key={i} className="bg-muted/50 rounded-lg p-4 border border-border/50 flex flex-col sm:flex-row sm:items-center gap-3">
                          <div className="flex-1">
                            <div className="font-medium text-sm">{gh.name}</div>
                            <div className="text-xs text-muted-foreground mt-0.5">📍 {gh.location}</div>
                            <p className="text-xs text-muted-foreground mt-1">{gh.note}</p>
                          </div>
                          <div className="text-right shrink-0">
                            <div className="text-sm font-medium text-primary">{gh.priceRange}</div>
                            <div className="text-xs text-muted-foreground">⭐ {gh.rating}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="bg-card rounded-xl border border-border p-6">
                    <h3 className="mb-4 flex items-center gap-2"><Eye className="h-5 w-5 text-primary" /> Viewpoints</h3>
                    <div className="grid sm:grid-cols-2 gap-3">
                      {extras.viewpoints.map(vp => (
                        <div key={vp.name} className="bg-muted/50 rounded-lg p-3 border border-border/50">
                          <div className="font-medium text-sm">{vp.name}</div>
                          <p className="text-xs text-muted-foreground mt-1">{vp.description}</p>
                          <span className="text-xs text-primary mt-1 inline-block">🕐 {vp.bestTime}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "emergency" && extras && (
                <div className="bg-card rounded-xl border border-destructive/30 bg-destructive/5 p-6">
                  <h3 className="mb-4 flex items-center gap-2 text-destructive"><Phone className="h-5 w-5" /> Emergency</h3>
                  <div className="space-y-3 text-sm">
                    <div><span className="text-muted-foreground text-xs uppercase tracking-wider">Nearest Hospital</span><p className="font-medium mt-0.5">{extras.emergency.nearestHospital}</p></div>
                    <div><span className="text-muted-foreground text-xs uppercase tracking-wider">Rescue Contacts</span><p className="font-medium mt-0.5">{extras.emergency.rescueContact}</p></div>
                    <div><span className="text-muted-foreground text-xs uppercase tracking-wider">Evacuation</span><p className="font-medium mt-0.5">{extras.emergency.evacuationRoute}</p></div>
                    <ul className="mt-3 space-y-1.5">
                      {extras.emergency.tips.map((tip, i) => <li key={i} className="text-xs flex items-start gap-2"><AlertTriangle className="h-3 w-3 text-destructive shrink-0 mt-0.5" /> {tip}</li>)}
                    </ul>
                  </div>
                </div>
              )}

              {/* Enquiry */}
              <div className="mt-6">
                <EnquiryForm defaultTrekName={trek.name} />
              </div>

              {/* Trek Reviews */}
              <div className="mt-6">
                <TrekReviewSection trekId={trek.id} user={user} />
              </div>
            </ScrollReveal>
          </div>

          {/* Right sidebar - services */}
          <aside className="lg:w-96 shrink-0">
            <div className="lg:sticky lg:top-20 space-y-4">
              <AmsRiskBlock trek={trek} />
              <TrekServicePanel trek={trek} />
            </div>
          </aside>
        </div>
      </div>
      </div>
    </main>
  );
};

export default TrekDetail;
