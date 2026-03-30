import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { Search, Shield, MessageSquare, Users, ArrowRight, Mountain, Droplets, Footprints, Compass, Home, Briefcase, ShoppingBag, MapPin, Phone, ExternalLink, Star, ChevronRight, Clock, TrendingUp, Filter, Heart, Loader2, Sparkles } from "lucide-react";

import heroImg1 from "@/assets/hero-mountains.jpg";
import heroImg2 from "@/assets/hero-2.jpg";
import heroImg3 from "@/assets/hero-3.jpg";
import heroImg4 from "@/assets/hero-4.jpg";
import ScrollReveal from "@/components/ScrollReveal";
import { supabase } from "@/integrations/supabase/client";
import { treks, allRegions, allStates } from "@/data/treks";
import JarvisChat from "@/components/JarvisChat";
import FirstTrekModal from "@/components/FirstTrekModal";
import SEOHead, { websiteSchema } from "@/components/SEOHead";

const heroImages = [heroImg1, heroImg2, heroImg3, heroImg4];

const searchSuggestions = [
  "Top 5 treks near Kolkata",
  "Best treks in monsoon season",
  "Easy weekend treks in Western Ghats",
  "Best winter treks in Himachal Pradesh",
  "Top treks for beginners in India",
  "High altitude treks above 5000m",
  "Best treks in Uttarakhand for families",
  "Most scenic treks in Sikkim",
  "Best treks in October November",
  "Short 2-day treks near Delhi",
  "Top treks in Ladakh for summer",
  "Best snow treks in January",
  "Easiest Himalayan treks for first-timers",
  "Best treks in Kerala and Karnataka",
  "Top treks near Mumbai for weekends",
];

const features = [
  { to: "/routes", icon: Search, title: "Explore Trek Routes", desc: "Search and discover trekking routes across India & Nepal — Himalayas to Western Ghats.", num: "01" },
  { to: "/tips", icon: Shield, title: "Safety & Tips", desc: "Essential guidance on gear, fitness, altitude sickness, and weather to keep your trek safe.", num: "02" },
  { to: "/experiences", icon: MessageSquare, title: "Share Experiences", desc: "Read stories from fellow trekkers and share your own trail tales with the community.", num: "03" },
  { to: "/sherpas", icon: Users, title: "Find a Sherpa", desc: "Browse experienced mountain guides, view their profiles, and contact them directly.", num: "04" },
];

const preparations = [
  { icon: Footprints, title: "Physical Training", desc: "Start cardio 6-8 weeks before. Stair climbing, jogging, and squats build trek-ready legs.", pattern: "radial-gradient(circle, rgba(116,198,157,0.06) 1px, transparent 1px)", patternSize: "16px 16px" },
  { icon: Mountain, title: "Altitude Awareness", desc: "Learn the signs of AMS. Carry Diamox. Ascend slowly — gain no more than 500m per day above 3,000m.", pattern: "linear-gradient(45deg, rgba(201,151,58,0.04) 25%, transparent 25%, transparent 50%, rgba(201,151,58,0.04) 50%, rgba(201,151,58,0.04) 75%, transparent 75%)", patternSize: "12px 12px" },
  { icon: Droplets, title: "Hydration & Nutrition", desc: "Carry water purification. Pack energy bars, trail mix, and electrolytes. Drink 3-4 liters daily.", pattern: "radial-gradient(circle, rgba(100,180,220,0.05) 1px, transparent 1px)", patternSize: "20px 20px" },
  { icon: Compass, title: "Navigation & Permits", desc: "Download offline maps. Check permit requirements. Share your itinerary with family and local authorities.", pattern: "repeating-linear-gradient(0deg, rgba(232,220,200,0.03) 0px, rgba(232,220,200,0.03) 1px, transparent 1px, transparent 8px)", patternSize: "8px 8px" },
];

const gearShops = [
  { name: "Decathlon", type: "Chain Store", desc: "Affordable trekking gear — boots, layers, backpacks, and accessories. Great for beginners.", locations: "100+ stores across India & Nepal", website: "https://www.decathlon.in", rating: 4.3 },
  { name: "Wildcraft", type: "Outdoor Brand", desc: "Indian brand specializing in outdoor and adventure gear. Durable rucksacks and rain gear.", locations: "Major cities across India", website: "https://www.wildcraft.com", rating: 4.1 },
  { name: "Quechua (at Decathlon)", type: "Budget Line", desc: "Decathlon's trekking sub-brand. Excellent value for layering systems and lightweight tents.", locations: "Inside Decathlon stores", website: "https://www.decathlon.in", rating: 4.2 },
  { name: "The North Face", type: "Premium", desc: "High-performance alpine gear for serious trekkers. Trusted by Himalayan expeditions.", locations: "Delhi, Mumbai, Bengaluru, Kathmandu", website: "https://www.thenorthface.com", rating: 4.7 },
  { name: "Sherpa Adventure Gear", type: "Nepal Brand", desc: "Kathmandu-based brand making quality gear while supporting local communities.", locations: "Thamel, Kathmandu & online", website: "https://www.sherpaadventuregear.com", rating: 4.4 },
  { name: "Mountain Hardware", type: "Premium", desc: "Technical mountaineering and trekking gear. Popular among high-altitude trekkers.", locations: "Online & select retailers in metros", website: "https://www.mountainhardwear.com", rating: 4.5 },
];

/* Mountain SVG layers for parallax hero */
const MountainLayers = ({ mouseX, mouseY }: { mouseX: number; mouseY: number }) => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {/* Stars */}
    <div className="absolute inset-0">
      {Array.from({ length: 50 }).map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-foreground/60"
          style={{
            width: `${1 + Math.random() * 2}px`,
            height: `${1 + Math.random() * 2}px`,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 50}%`,
            animation: `twinkle ${2 + Math.random() * 4}s ease-in-out ${Math.random() * 3}s infinite`,
          }}
        />
      ))}
    </div>
    {/* Light ray */}
    <div className="absolute inset-0" style={{
      background: "linear-gradient(135deg, rgba(232,220,200,0.05) 0%, transparent 40%)",
    }} />
    {/* Mountain layer 5 (back) */}
    <svg className="absolute bottom-0 w-full h-[70%] text-foreground/[0.04]" viewBox="0 0 1440 600" preserveAspectRatio="none"
      style={{ transform: `translate(${mouseX * 0.02}px, ${mouseY * 0.01}px)` }}>
      <polygon points="0,600 100,200 250,350 400,150 550,300 700,100 850,250 1000,80 1150,220 1300,120 1440,180 1440,600" fill="currentColor" />
    </svg>
    {/* Mountain layer 4 */}
    <svg className="absolute bottom-0 w-full h-[60%] text-foreground/[0.06]" viewBox="0 0 1440 500" preserveAspectRatio="none"
      style={{ transform: `translate(${mouseX * 0.04}px, ${mouseY * 0.02}px)` }}>
      <polygon points="0,500 200,220 380,320 520,180 700,280 880,150 1050,250 1200,180 1440,240 1440,500" fill="currentColor" />
    </svg>
    {/* Mountain layer 3 */}
    <svg className="absolute bottom-0 w-full h-[50%] text-[#111e16]" viewBox="0 0 1440 400" preserveAspectRatio="none"
      style={{ transform: `translate(${mouseX * 0.06}px, ${mouseY * 0.03}px)` }}>
      <polygon points="0,400 150,250 350,310 500,200 680,290 850,210 1000,270 1200,230 1440,280 1440,400" fill="currentColor" />
    </svg>
    {/* Mountain layer 2 */}
    <svg className="absolute bottom-0 w-full h-[40%] text-[#152a1c]" viewBox="0 0 1440 350" preserveAspectRatio="none"
      style={{ transform: `translate(${mouseX * 0.08}px, ${mouseY * 0.04}px)` }}>
      <polygon points="0,350 180,260 400,300 600,240 800,290 1000,250 1200,280 1440,260 1440,350" fill="currentColor" />
    </svg>
    {/* Mountain layer 1 (front) */}
    <svg className="absolute bottom-0 w-full h-[30%] text-[#0c1f13]" viewBox="0 0 1440 300" preserveAspectRatio="none"
      style={{ transform: `translate(${mouseX * 0.1}px, ${mouseY * 0.05}px)` }}>
      <polygon points="0,300 200,280 400,260 600,275 800,260 1000,270 1200,265 1440,280 1440,300" fill="currentColor" />
    </svg>
    {/* Mist */}
    <svg className="absolute bottom-[15%] w-[120%] -left-[10%] h-24 opacity-40" viewBox="0 0 1440 80" preserveAspectRatio="none"
      style={{ animation: "float-mist 12s ease-in-out infinite alternate" }}>
      <ellipse cx="720" cy="40" rx="800" ry="35" fill="url(#mist-grad)" />
      <defs>
        <radialGradient id="mist-grad">
          <stop offset="0%" stopColor="rgba(232,220,200,0.08)" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
      </defs>
    </svg>
  </div>
);

const Index = () => {
  const navigate = useNavigate();
  const [guesthouses, setGuesthouses] = useState<any[]>([]);
  const [agencies, setAgencies] = useState<any[]>([]);
  const [trekReviews, setTrekReviews] = useState<Record<string, { avg: number; count: number }>>({});
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("All");
  const [searchResults, setSearchResults] = useState<typeof treks | null>(null);
  const [heroIndex, setHeroIndex] = useState(0);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showFirstTrek, setShowFirstTrek] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  const [aiLoading, setAiLoading] = useState(false);
  const [trendingTopics, setTrendingTopics] = useState<string[]>([]);
  const [trendingLoaded, setTrendingLoaded] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const aiDebounceRef = useRef<NodeJS.Timeout>();

  // Mouse parallax
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      setMousePos({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 10,
      });
    };
    window.addEventListener("mousemove", handler);
    return () => window.removeEventListener("mousemove", handler);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setHeroIndex(prev => (prev + 1) % heroImages.length);
    }, 10000);
    return () => clearInterval(timer);
  }, []);

  const displayedSuggestions = useMemo(() => {
    const shuffled = [...searchSuggestions].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 6);
  }, []);

  const uniqueStates = useMemo(() => ["All", ...new Set(treks.map(t => t.state))].sort(), []);

  const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;

  useEffect(() => {
    if (trendingLoaded) return;
    fetch(`${SUPABASE_URL}/functions/v1/ai-search-suggestions`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}` },
      body: JSON.stringify({ type: "trending" }),
    }).then(r => r.json()).then(data => {
      if (data.suggestions?.length) setTrendingTopics(data.suggestions);
      setTrendingLoaded(true);
    }).catch(() => setTrendingLoaded(true));
  }, []);

  const fetchAiSuggestions = useCallback((q: string) => {
    if (aiDebounceRef.current) clearTimeout(aiDebounceRef.current);
    if (q.length < 3) { setAiSuggestions([]); return; }
    aiDebounceRef.current = setTimeout(async () => {
      setAiLoading(true);
      try {
        const resp = await fetch(`${SUPABASE_URL}/functions/v1/ai-search-suggestions`, {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}` },
          body: JSON.stringify({ query: q, type: "autocomplete" }),
        });
        const data = await resp.json();
        setAiSuggestions(data.suggestions || []);
      } catch { setAiSuggestions([]); }
      setAiLoading(false);
    }, 500);
  }, []);

  const topTreks = useMemo(() => {
    let filtered = treks;
    if (selectedRegion !== "All") filtered = treks.filter(t => t.state === selectedRegion);
    return filtered
      .sort((a, b) => {
        const ra = trekReviews[a.id];
        const rb = trekReviews[b.id];
        const sa = ra ? ra.avg * Math.log(ra.count + 1) : 0;
        const sb = rb ? rb.avg * Math.log(rb.count + 1) : 0;
        return sb - sa || b.altitudeMeters - a.altitudeMeters;
      })
      .slice(0, 10);
  }, [selectedRegion, trekReviews]);

  useEffect(() => {
    if (!searchQuery.trim()) { setSearchResults(null); return; }
    const q = searchQuery.toLowerCase();
    const results = treks.filter(t =>
      t.name.toLowerCase().includes(q) ||
      t.region.toLowerCase().includes(q) ||
      t.state.toLowerCase().includes(q) ||
      t.description.toLowerCase().includes(q)
    ).slice(0, 12);
    setSearchResults(results);
  }, [searchQuery]);

  useEffect(() => {
    supabase.from("guesthouse_listings").select("*").eq("approved", true).limit(4)
      .then(({ data }) => { if (data) setGuesthouses(data); });
    supabase.from("agency_listings").select("*").eq("approved", true).limit(4)
      .then(({ data }) => { if (data) setAgencies(data); });
    supabase.from("trek_reviews").select("trek_id, rating").then(({ data }) => {
      if (!data) return;
      const map: Record<string, { sum: number; count: number }> = {};
      data.forEach(r => {
        if (!map[r.trek_id]) map[r.trek_id] = { sum: 0, count: 0 };
        map[r.trek_id].sum += r.rating;
        map[r.trek_id].count += 1;
      });
      const result: Record<string, { avg: number; count: number }> = {};
      Object.entries(map).forEach(([id, v]) => { result[id] = { avg: v.sum / v.count, count: v.count }; });
      setTrekReviews(result);
    });
  }, []);

  return (
    <main className="relative overflow-hidden" style={{ background: "#0c1f13" }}>
      <SEOHead
        title="Himalayan Trails"
        description="Your complete guide to trekking across India & Nepal — 200+ routes, safety tips, gear guides, and real stories from the trail."
        path="/"
        jsonLd={websiteSchema}
      />

      {/* ═══ HERO ═══ */}
      <section className="relative h-screen min-h-[600px] flex items-end overflow-hidden">
        {/* Background images */}
        {heroImages.map((img, i) => (
          <img key={i} src={img} alt={`Himalayan landscape ${i + 1}`}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-[2000ms] ${i === heroIndex ? "opacity-30" : "opacity-0"}`}
            loading={i === 0 ? "eager" : "lazy"} />
        ))}

        {/* Mountain parallax layers */}
        <MountainLayers mouseX={mousePos.x} mouseY={mousePos.y} />

        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0c1f13] via-[#0c1f13]/60 to-transparent" />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, transparent 60%, #0c1f13 100%)" }} />

        {/* Hero content */}
        <div className="relative z-10 container mx-auto px-4 pb-24 md:pb-32">
          {/* First Trek badge */}
          <button
            onClick={() => setShowFirstTrek(true)}
            className="mb-8 flex items-center gap-3 group cursor-pointer bg-transparent border border-alpine-mint/30 rounded-full px-5 py-2.5 hover:border-alpine-mint/60 transition-all"
            aria-label="First Trek? Get personalized advice"
          >
            <div className="relative">
              <div className="w-3 h-3 rounded-full bg-primary" />
              <div className="absolute inset-0 w-3 h-3 rounded-full bg-primary animate-pulse-ring" />
            </div>
            <span className="text-sm font-body font-medium text-foreground/90">First Trek? Get personalized advice →</span>
          </button>

          <h1 className="text-foreground max-w-3xl" style={{ fontSize: "clamp(3rem, 8vw, 6rem)", fontWeight: 300 }}>
            Himalayan{" "}
            <em className="italic text-primary" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Trails</em>
          </h1>
          <p className="mt-6 text-foreground/60 text-lg md:text-xl max-w-lg font-body font-light animate-reveal animate-reveal-delay-1">
            Your complete guide to trekking across India & Nepal — routes, safety tips, and real stories from the trail.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap items-center gap-4 mt-10 animate-reveal animate-reveal-delay-2">
            <Link to="/routes"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full trek-gradient text-primary-foreground font-semibold text-sm hover-scale">
              Explore Routes <ArrowRight className="h-4 w-4" />
            </Link>
            <button
              onClick={() => document.getElementById("top-treks-section")?.scrollIntoView({ behavior: "smooth" })}
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-accent text-accent-foreground font-semibold text-sm hover-scale">
              <Star className="h-4 w-4" /> Top Treks
            </button>
            <Link to="/recommended"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full border border-foreground/20 text-foreground font-medium text-sm hover:border-foreground/40 transition-colors">
              <Heart className="h-4 w-4" /> Recommended
            </Link>
          </div>

          <p className="mt-6 text-foreground/40 text-sm font-body animate-reveal animate-reveal-delay-3">
            Having trouble? Consult{" "}
            <button onClick={() => window.dispatchEvent(new CustomEvent("open-hiker-ai"))} className="font-semibold text-primary hover:text-primary/80 transition-colors cursor-pointer bg-transparent border-none p-0 story-link">
              HikerAI
            </button>{" "}→
          </p>
        </div>
      </section>

      {/* ═══ SOCIAL PROOF BAR ═══ */}
      <section className="relative z-20 py-8 border-y border-foreground/[0.05]" style={{ background: "linear-gradient(135deg, #111e16 0%, #0c1f13 100%)" }}>
        <div className="container mx-auto px-4">
          {/* Decorative watermark */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
            <span className="font-display text-[180px] font-bold italic text-foreground/[0.03] select-none">8849</span>
          </div>
          <div className="relative flex flex-wrap items-center justify-center gap-10 md:gap-20">
            {[
              { num: "181+", label: "Verified Routes" },
              { num: "50,000+", label: "Trekkers Helped" },
              { num: "3,600–8,849m", label: "Altitude Range" },
              { num: "All Year", label: "Trekking Seasons" },
            ].map((stat, i) => (
              <div key={stat.label} className="text-center flex items-center gap-6">
                <div>
                  <div className="font-display text-2xl md:text-3xl font-semibold italic text-primary">{stat.num}</div>
                  <div className="text-[11px] uppercase tracking-[0.2em] text-foreground/40 font-body mt-1">{stat.label}</div>
                </div>
                {i < 3 && <div className="hidden md:block w-px h-12 bg-foreground/[0.07]" />}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ FEATURES ═══ */}
      <section className="alpine-section dot-grid-bg">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f, i) => (
              <ScrollReveal key={f.to} delay={i * 100}>
                <Link to={f.to}
                  className="group block glass-card glass-card-transition rounded-2xl p-8 h-full relative overflow-hidden">
                  {/* Section number */}
                  <span className="absolute top-4 right-4 text-[10px] font-body font-semibold tracking-widest text-primary/40">{f.num}</span>
                  <div className="inline-flex p-3 rounded-xl bg-primary/10 mb-5">
                    <f.icon className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="mb-2 group-hover:text-primary transition-colors text-lg">{f.title}</h3>
                  <p className="text-foreground/45 text-sm leading-relaxed">{f.desc}</p>
                  <span className="inline-flex items-center gap-1 mt-5 text-sm font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                    Learn more <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ SEARCH BAR ═══ */}
      <section className="container mx-auto px-4 pb-20 relative z-20">
        <ScrollReveal>
          <div className="text-center mb-8">
            <span className="text-[10px] font-body font-semibold tracking-[0.3em] uppercase text-primary/60 mb-2 block">05</span>
            <h2 className="text-3xl">Search Treks</h2>
            <p className="text-foreground/40 text-sm mt-2">Find your next adventure by name, region, or state</p>
          </div>
          <div className="max-w-2xl mx-auto relative">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-foreground/30" />
            {aiLoading && <Loader2 className="absolute right-5 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-primary" />}
            <input
              type="text"
              placeholder="Search treks by name, region, or state..."
              value={searchQuery}
              onChange={e => {
                setSearchQuery(e.target.value);
                setShowSuggestions(false);
                fetchAiSuggestions(e.target.value);
              }}
              onFocus={() => { if (!searchQuery) setShowSuggestions(true); }}
              onBlur={() => setTimeout(() => { setShowSuggestions(false); setAiSuggestions([]); }, 200)}
              className="w-full pl-14 pr-12 py-5 rounded-2xl glass-card text-foreground text-base font-body placeholder:text-foreground/25 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/30 transition-all"
              style={{ background: "rgba(17, 30, 22, 0.8)", backdropFilter: "blur(12px)" }}
            />
            {/* AI Autocomplete suggestions */}
            {aiSuggestions.length > 0 && searchQuery.length >= 3 && (
              <div className="absolute top-full left-0 right-0 mt-2 glass-card rounded-xl shadow-2xl z-30 p-3">
                <p className="text-xs text-foreground/40 mb-2 px-2 font-medium flex items-center gap-1"><Sparkles className="h-3 w-3 text-primary" /> AI Suggestions</p>
                <div className="space-y-1">
                  {aiSuggestions.map(s => (
                    <button key={s} onClick={() => { setSearchQuery(s); setAiSuggestions([]); }}
                      className="w-full text-left text-sm px-3 py-2.5 rounded-lg hover:bg-primary/10 transition-colors text-foreground">
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {showSuggestions && !searchQuery && (
              <div className="absolute top-full left-0 right-0 mt-2 glass-card rounded-xl shadow-2xl z-30 p-3">
                <p className="text-xs text-foreground/40 mb-2 px-2 font-medium">Popular searches</p>
                <div className="flex flex-wrap gap-2">
                  {displayedSuggestions.map(s => (
                    <button key={s} onClick={() => { setSearchQuery(s); setShowSuggestions(false); }}
                      className="text-xs px-3 py-1.5 rounded-full border border-primary/20 text-primary hover:bg-primary/10 transition-colors">
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </ScrollReveal>

        {/* AI Trending Topics */}
        {trendingTopics.length > 0 && !searchResults && (
          <ScrollReveal delay={100}>
            <div className="max-w-2xl mx-auto mt-4">
              <p className="text-xs text-foreground/40 mb-2 flex items-center gap-1"><Sparkles className="h-3 w-3 text-primary" /> Trending right now</p>
              <div className="flex flex-wrap gap-2">
                {trendingTopics.map(t => (
                  <button key={t} onClick={() => setSearchQuery(t)}
                    className="text-xs px-3 py-1.5 rounded-full border border-primary/15 bg-primary/5 text-primary hover:bg-primary/15 transition-colors">
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </ScrollReveal>
        )}

        {searchResults && (
          <div className="mt-8">
            <h3 className="text-lg font-semibold mb-4">{searchResults.length} result{searchResults.length !== 1 ? "s" : ""} found</h3>
            {searchResults.length === 0 ? (
              <p className="text-foreground/40 text-sm">No treks match your search. Try different keywords.</p>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {searchResults.map(trek => {
                  const rev = trekReviews[trek.id];
                  return (
                    <Link key={trek.id} to={`/trek/${trek.id}`} className="glass-card glass-card-transition rounded-xl p-5 group">
                      <h4 className="font-display font-semibold text-sm mb-1 group-hover:text-primary transition-colors">{trek.name}</h4>
                      <div className="flex items-center gap-3 text-xs text-foreground/40 mb-2">
                        <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{trek.state}</span>
                        <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{trek.durationDays}d</span>
                        <span className="flex items-center gap-1"><TrendingUp className="h-3 w-3" />{trek.altitudeMeters}m</span>
                      </div>
                      <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${trek.difficulty === "Easy" ? "bg-primary/15 text-primary" : trek.difficulty === "Moderate" ? "bg-accent/15 text-accent" : trek.difficulty === "Difficult" ? "bg-accent/15 text-accent" : "bg-destructive/15 text-destructive"}`}>{trek.difficulty}</span>
                      {rev && (
                        <span className="ml-2 inline-flex items-center gap-1 text-xs">
                          <Star className="h-3 w-3 fill-accent text-accent" />
                          <span className="font-medium tabular-nums">{rev.avg.toFixed(1)}</span>
                          <span className="text-foreground/40">({rev.count})</span>
                        </span>
                      )}
                      <p className="text-xs text-foreground/40 mt-2 line-clamp-2">{trek.description}</p>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </section>

      {/* ═══ TOP 10 TREKS ═══ */}
      <section id="top-treks-section" className="alpine-section alpine-section-alt">
        <div className="container mx-auto px-4">
          <ScrollReveal>
            <div className="flex items-center justify-between mb-10 flex-wrap gap-4">
              <div>
                <span className="text-[10px] font-body font-semibold tracking-[0.3em] uppercase text-primary/60 mb-2 block">06</span>
                <h2 className="text-3xl flex items-center gap-3">
                  <Mountain className="h-6 w-6 text-primary" /> Top 10 Treks
                </h2>
                <p className="text-foreground/40 mt-2 max-w-md text-sm">
                  The best rated and most popular treks — filter by state to find treks near you.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-foreground/30" />
                <select
                  value={selectedRegion}
                  onChange={e => setSelectedRegion(e.target.value)}
                  className="rounded-lg bg-card border border-foreground/[0.07] px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                >
                  {uniqueStates.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>
          </ScrollReveal>

          <div className="space-y-3">
            {topTreks.map((trek, i) => {
              const rev = trekReviews[trek.id];
              const diffColor = trek.difficulty === "Easy" ? "#74c69d" : trek.difficulty === "Moderate" ? "#c9973a" : trek.difficulty === "Challenging" ? "#e05c5c" : "#74c69d";
              return (
                <ScrollReveal key={trek.id} delay={i * 60}>
                  <Link to={`/trek/${trek.id}`} className="group flex items-center gap-5 glass-card glass-card-transition rounded-xl p-5 relative overflow-hidden hover:translate-x-1">
                    {/* Left colored bar */}
                    <div className="absolute left-0 top-0 bottom-0 w-1 rounded-r" style={{ background: diffColor }} />
                    {/* Rank number */}
                    <span className="font-display text-5xl font-bold text-foreground/[0.08] shrink-0 w-12 text-center select-none">{i + 1}</span>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-display font-semibold text-base group-hover:text-primary transition-colors truncate">{trek.name}</h4>
                      <div className="flex items-center gap-3 text-xs text-foreground/40 mt-1 flex-wrap">
                        <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{trek.state}, {trek.country}</span>
                        <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{trek.durationDays} days</span>
                        <span className="flex items-center gap-1"><TrendingUp className="h-3 w-3" />{trek.altitudeMeters.toLocaleString()}m</span>
                        <span className="font-medium px-2 py-0.5 rounded-full text-[10px]" style={{ background: `${diffColor}22`, color: diffColor }}>{trek.difficulty}</span>
                      </div>
                    </div>
                    <div className="shrink-0 text-right">
                      {rev ? (
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-accent text-accent" />
                          <span className="font-semibold text-sm tabular-nums">{rev.avg.toFixed(1)}</span>
                          <span className="text-xs text-foreground/40">({rev.count})</span>
                        </div>
                      ) : (
                        <span className="text-xs text-primary">Be the first to review →</span>
                      )}
                    </div>
                    <ArrowRight className="h-4 w-4 text-foreground/20 shrink-0 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                  </Link>
                </ScrollReveal>
              );
            })}
          </div>
          <div className="text-center mt-10">
            <Link to="/routes" className="inline-flex items-center gap-2 text-sm font-medium text-primary story-link">
              View all {treks.length}+ treks <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ═══ PREPARATIONS ═══ */}
      <section className="alpine-section">
        <div className="container mx-auto px-4">
          <ScrollReveal>
            <div className="text-center mb-14">
              <span className="text-[10px] font-body font-semibold tracking-[0.3em] uppercase text-primary/60 mb-2 block">07</span>
              <h2 className="text-3xl">Essential Preparations</h2>
              <p className="text-foreground/40 mt-3 max-w-lg mx-auto text-sm">
                Don't hit the trail unprepared. Here's what every trekker needs to know before setting out.
              </p>
            </div>
          </ScrollReveal>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {preparations.map((prep, i) => (
              <ScrollReveal key={prep.title} delay={i * 80}>
                <div className="glass-card glass-card-transition rounded-2xl p-7 h-full relative overflow-hidden group"
                  style={{ backgroundImage: prep.pattern, backgroundSize: prep.patternSize }}>
                  <div className="border-t-2 border-primary/20 absolute top-0 left-4 right-4" />
                  <prep.icon className="h-12 w-12 text-primary mb-5 group-hover:rotate-[10deg] group-hover:scale-110 transition-transform" />
                  <h4 className="font-display font-semibold text-base mb-2">{prep.title}</h4>
                  <p className="text-foreground/40 text-sm leading-relaxed">{prep.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ GUESTHOUSES ═══ */}
      <section className="alpine-section alpine-section-alt">
        <div className="container mx-auto px-4">
          <ScrollReveal>
            <div className="flex items-center justify-between mb-10">
              <div>
                <span className="text-[10px] font-body font-semibold tracking-[0.3em] uppercase text-primary/60 mb-2 block">08</span>
                <h2 className="text-3xl flex items-center gap-2">
                  <Home className="h-6 w-6 text-primary" /> Featured Guesthouses
                </h2>
                <p className="text-foreground/40 mt-2 max-w-md text-sm">
                  Comfortable stays along popular trek routes — verified by the trekking community.
                </p>
              </div>
              <Link to="/guesthouses" className="hidden sm:inline-flex items-center gap-1.5 text-sm font-medium text-primary story-link">
                View all <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          </ScrollReveal>
          {guesthouses.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {guesthouses.map((gh, i) => (
                <ScrollReveal key={gh.id} delay={i * 80}>
                  <div className="glass-card glass-card-transition rounded-2xl overflow-hidden group">
                    {gh.photo_url ? (
                      <div className="aspect-[4/3] overflow-hidden">
                        <img src={gh.photo_url} alt={gh.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      </div>
                    ) : (
                      <div className="aspect-[4/3] bg-muted flex items-center justify-center">
                        <Home className="h-10 w-10 text-foreground/10" />
                      </div>
                    )}
                    <div className="p-5">
                      <h4 className="font-display font-semibold text-sm mb-1 truncate">{gh.name}</h4>
                      <p className="text-xs text-foreground/40 flex items-center gap-1 mb-2"><MapPin className="h-3 w-3" /> {gh.location}</p>
                      <p className="text-xs text-foreground/40 line-clamp-2 mb-3">{gh.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-primary">₹{gh.price_range_min}–₹{gh.price_range_max}/night</span>
                        <a href={`tel:${gh.contact_number}`} className="text-xs text-foreground/40 hover:text-primary transition-colors"><Phone className="h-3.5 w-3.5" /></a>
                      </div>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          ) : (
            <ScrollReveal>
              <div className="glass-card rounded-2xl p-12 text-center">
                <Home className="h-10 w-10 text-foreground/10 mx-auto mb-3" />
                <p className="text-foreground/40 text-sm">No guesthouses listed yet.</p>
                <Link to="/guesthouses" className="text-xs text-primary hover:underline mt-2 inline-block">List your guesthouse →</Link>
              </div>
            </ScrollReveal>
          )}
        </div>
      </section>

      {/* ═══ AGENCIES ═══ */}
      <section className="alpine-section">
        <div className="container mx-auto px-4">
          <ScrollReveal>
            <div className="flex items-center justify-between mb-10">
              <div>
                <span className="text-[10px] font-body font-semibold tracking-[0.3em] uppercase text-primary/60 mb-2 block">09</span>
                <h2 className="text-3xl flex items-center gap-2">
                  <Briefcase className="h-6 w-6 text-primary" /> Travel Agencies
                </h2>
                <p className="text-foreground/40 mt-2 max-w-md text-sm">
                  Trusted agencies organizing guided treks across the Himalayas.
                </p>
              </div>
              <Link to="/agencies" className="hidden sm:inline-flex items-center gap-1.5 text-sm font-medium text-primary story-link">
                View all <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          </ScrollReveal>
          {agencies.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {agencies.map((ag, i) => (
                <ScrollReveal key={ag.id} delay={i * 80}>
                  <div className="glass-card glass-card-transition rounded-2xl p-6 relative overflow-hidden">
                    <div className="flex items-center gap-3 mb-3">
                      {ag.logo_url ? (
                        <img src={ag.logo_url} alt={ag.name} className="h-12 w-12 rounded-lg object-cover border border-foreground/[0.07]" />
                      ) : (
                        <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center"><Briefcase className="h-5 w-5 text-primary" /></div>
                      )}
                      <div className="min-w-0 flex-1">
                        <h4 className="font-display font-semibold text-sm truncate">{ag.name}</h4>
                        {ag.established_year && <p className="text-[10px] text-foreground/30">Est. {ag.established_year}</p>}
                      </div>
                    </div>
                    <p className="text-xs text-foreground/40 line-clamp-2 mb-3">{ag.description}</p>
                    <div className="flex items-center gap-2 flex-wrap">
                      <a href={`tel:${ag.contact_number}`} className="text-xs text-primary hover:underline flex items-center gap-1"><Phone className="h-3 w-3" /> Contact</a>
                      {ag.website && <a href={ag.website} target="_blank" rel="noopener noreferrer" className="text-xs text-foreground/40 hover:text-primary flex items-center gap-1"><ExternalLink className="h-3 w-3" /> Website</a>}
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          ) : (
            <ScrollReveal>
              <div className="rounded-2xl p-10 md:p-14 text-center relative overflow-hidden" style={{ background: "linear-gradient(135deg, #2d6a4f 0%, #1b4332 100%)" }}>
                <Briefcase className="h-10 w-10 mx-auto mb-4 text-foreground/60" />
                <h3 className="text-xl md:text-2xl font-display mb-2">Are you a trekking agency?</h3>
                <p className="text-foreground/60 max-w-md mx-auto mb-6 text-sm">
                  Get listed on Himalayan Trails and reach thousands of trekkers planning their next adventure.
                </p>
                <Link to="/agencies" className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-foreground text-background font-semibold text-sm hover:opacity-90 transition-opacity active:scale-[0.97]">
                  Apply for free listing <ArrowRight className="h-4 w-4" />
                </Link>
                <p className="mt-4 text-xs text-foreground/40">
                  <Link to="/agencies" className="underline underline-offset-2">Already listed? Manage your profile →</Link>
                </p>
              </div>
            </ScrollReveal>
          )}
        </div>
      </section>

      {/* ═══ GEAR SHOPS ═══ */}
      <section className="alpine-section alpine-section-alt">
        <div className="container mx-auto px-4">
          <ScrollReveal>
            <div className="text-center mb-14">
              <span className="text-[10px] font-body font-semibold tracking-[0.3em] uppercase text-accent/60 mb-2 block">10</span>
              <h2 className="text-3xl flex items-center justify-center gap-2">
                <ShoppingBag className="h-6 w-6 text-accent" /> Recommended Gear Shops
              </h2>
              <p className="text-foreground/40 mt-3 max-w-lg mx-auto text-sm">
                Get the right gear before you hit the trail. These trusted shops stock everything a trekker needs.
              </p>
              <p className="text-[10px] text-foreground/25 mt-2 italic">Affiliate links — we may earn a small commission at no extra cost to you.</p>
            </div>
          </ScrollReveal>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {gearShops.map((shop, i) => (
              <ScrollReveal key={shop.name} delay={i * 80}>
                <div className="glass-card glass-card-transition rounded-2xl p-6 relative overflow-hidden group">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-display font-semibold text-base">{shop.name}</h4>
                      <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-accent/10 text-accent mt-1 inline-block">{shop.type}</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs">
                      {Array.from({ length: 5 }).map((_, si) => (
                        <Star key={si} className={`h-3.5 w-3.5 ${si < Math.round(shop.rating) ? "fill-accent text-accent" : "text-foreground/10"}`} />
                      ))}
                      <span className="font-medium tabular-nums text-foreground/60 ml-1">{shop.rating}</span>
                    </div>
                  </div>
                  <p className="text-xs text-foreground/40 leading-relaxed mb-3">{shop.desc}</p>
                  <div className="flex items-center gap-1.5 text-xs text-foreground/30 mb-4">
                    <MapPin className="h-3 w-3 shrink-0 text-primary" />
                    <span>{shop.locations}</span>
                  </div>
                  <a href={shop.website} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-foreground/50 border border-foreground/10 rounded-full px-4 py-2 hover:border-primary/30 hover:text-primary transition-all group-hover:translate-x-1">
                    Visit website <ArrowRight className="h-3 w-3" />
                  </a>
                  {/* Bottom gradient line */}
                  <div className="absolute bottom-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-accent/20 to-transparent" />
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ HIKER AI ═══ */}
      <section className="alpine-section dot-grid-bg relative">
        {/* Decorative "AI" watermark */}
        <div className="absolute inset-0 flex items-center justify-start pointer-events-none overflow-hidden">
          <span className="font-display text-[120px] font-bold italic text-foreground/[0.03] select-none ml-8">AI</span>
        </div>
        <div className="container mx-auto px-4">
          <ScrollReveal>
            <div className="flex flex-col lg:flex-row gap-12 items-center relative z-10">
              <div className="flex-1">
                <span className="inline-flex items-center gap-1.5 text-xs font-medium px-4 py-1.5 rounded-full border border-primary/20 text-primary mb-5">
                  <Sparkles className="h-3 w-3" /> AI-Powered
                </span>
                <h2 className="text-3xl mb-4">Plan smarter with HikerAI</h2>
                <p className="text-foreground/45 leading-relaxed mb-8 text-sm">
                  Our AI assistant knows every trail, permit requirement, and weather window across India & Nepal.
                </p>
                <div className="space-y-4 mb-8">
                  {[
                    { icon: Compass, text: "Route suggestions based on fitness & season" },
                    { icon: Shield, text: "Real-time weather and trail condition alerts" },
                    { icon: ShoppingBag, text: "Personalised gear checklist for your specific trek" },
                  ].map(item => (
                    <div key={item.text} className="flex items-center gap-3 text-sm">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <item.icon className="h-4 w-4 text-primary" />
                      </div>
                      <span className="text-foreground/70">{item.text}</span>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => window.dispatchEvent(new CustomEvent("open-hiker-ai"))}
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full trek-gradient text-primary-foreground font-semibold text-sm hover-scale"
                >
                  Try HikerAI Free <ArrowRight className="h-4 w-4" />
                </button>
              </div>
              <div className="flex-1 max-w-md">
                <div className="glass-card rounded-2xl p-6 space-y-4">
                  {/* Chat sample with timestamps */}
                  <div className="flex justify-end">
                    <div>
                      <div className="bg-primary/10 text-foreground rounded-2xl rounded-br-sm px-4 py-3 text-sm">
                        I want to do my first trek in October, moderate fitness
                      </div>
                      <p className="text-[10px] text-foreground/20 text-right mt-1">2:34 PM</p>
                    </div>
                  </div>
                  <div className="flex justify-start gap-2">
                    <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center shrink-0 mt-1">
                      <Mountain className="h-3 w-3 text-primary" />
                    </div>
                    <div>
                      <div className="bg-muted text-foreground rounded-2xl rounded-bl-sm px-4 py-3 text-sm">
                        Perfect timing! I'd recommend <strong className="text-primary">Hampta Pass</strong> in Himachal Pradesh — 5 days, stunning snow crossings, ideal for October. Want me to build your gear checklist?
                      </div>
                      <p className="text-[10px] text-foreground/20 mt-1">2:34 PM</p>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <div className="bg-primary/10 text-foreground rounded-2xl rounded-br-sm px-4 py-3 text-sm">
                      Yes please!
                    </div>
                  </div>
                  {/* Typing indicator */}
                  <div className="flex justify-start gap-2">
                    <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                      <Mountain className="h-3 w-3 text-primary" />
                    </div>
                    <div className="bg-muted rounded-2xl px-4 py-3 flex gap-1">
                      <span className="w-2 h-2 rounded-full bg-foreground/20 animate-bounce" style={{ animationDelay: "0ms" }} />
                      <span className="w-2 h-2 rounded-full bg-foreground/20 animate-bounce" style={{ animationDelay: "150ms" }} />
                      <span className="w-2 h-2 rounded-full bg-foreground/20 animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ═══ WHY TREK WITH US ═══ */}
      <section className="alpine-section alpine-section-alt">
        <div className="container mx-auto px-4">
          <ScrollReveal>
            <div className="text-center mb-14">
              <span className="text-[10px] font-body font-semibold tracking-[0.3em] uppercase text-primary/60 mb-2 block">11</span>
              <h2 className="text-3xl">Why Trek with Himalayan Trails?</h2>
              <p className="text-foreground/40 mt-3 max-w-lg mx-auto text-sm">
                We curate detailed information on every major trek in India & Nepal so you can plan with confidence.
              </p>
            </div>
          </ScrollReveal>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {[
              { num: "200+", label: "Curated Routes" },
              { num: "50,000+", label: "Trekkers Helped" },
              { num: "3,600–8,849m", label: "Altitude Range" },
              { num: "All Year", label: "Trekking Seasons" },
            ].map((stat, i) => (
              <ScrollReveal key={stat.label} delay={i * 80}>
                <div className="glass-card glass-card-transition rounded-2xl text-center p-8 relative overflow-hidden">
                  <div className="font-display text-3xl md:text-4xl font-semibold italic text-primary">{stat.num}</div>
                  <div className="text-sm text-foreground/40 mt-2">{stat.label}</div>
                </div>
              </ScrollReveal>
            ))}
          </div>
          <ScrollReveal delay={200}>
            <div className="max-w-xl mx-auto space-y-4">
              {[
                "Verified route data updated seasonally",
                "Real reviews from the trekking community",
                "Free to use — no booking fees ever",
              ].map(text => (
                <div key={text} className="flex items-center gap-3 text-sm">
                  <span className="text-primary font-bold text-lg">✓</span>
                  <span className="text-foreground/60">{text}</span>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      <JarvisChat />
      <FirstTrekModal open={showFirstTrek} onClose={() => setShowFirstTrek(false)} />
    </main>
  );
};

export default Index;
