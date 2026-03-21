import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { Search, Shield, MessageSquare, Users, ArrowRight, Leaf, Mountain, Droplets, Footprints, Compass, Home, Briefcase, ShoppingBag, MapPin, Phone, ExternalLink, Star, ChevronRight } from "lucide-react";
import heroImg from "@/assets/hero-mountains.jpg";
import ScrollReveal from "@/components/ScrollReveal";
import { supabase } from "@/integrations/supabase/client";

const features = [
  { to: "/routes", icon: Search, title: "Explore Trek Routes", desc: "Search and discover trekking routes across India & Nepal — Himalayas to Western Ghats.", color: "trek-gradient" },
  { to: "/tips", icon: Shield, title: "Safety & Tips", desc: "Essential guidance on gear, fitness, altitude sickness, and weather to keep your trek safe.", color: "trek-gradient-warm" },
  { to: "/experiences", icon: MessageSquare, title: "Share Experiences", desc: "Read stories from fellow trekkers and share your own trail tales with the community.", color: "trek-gradient" },
  { to: "/sherpas", icon: Users, title: "Find a Sherpa", desc: "Browse experienced mountain guides, view their profiles, and contact them directly.", color: "trek-gradient-warm" },
];

const preparations = [
  { icon: Footprints, title: "Physical Training", desc: "Start cardio 6-8 weeks before. Stair climbing, jogging, and squats build trek-ready legs.", color: "text-trek-moss" },
  { icon: Mountain, title: "Altitude Awareness", desc: "Learn the signs of AMS. Carry Diamox. Ascend slowly — gain no more than 500m per day above 3,000m.", color: "text-trek-sunrise" },
  { icon: Droplets, title: "Hydration & Nutrition", desc: "Carry water purification. Pack energy bars, trail mix, and electrolytes. Drink 3-4 liters daily.", color: "text-trek-sky" },
  { icon: Compass, title: "Navigation & Permits", desc: "Download offline maps. Check permit requirements. Share your itinerary with family and local authorities.", color: "text-primary" },
];

const gearShops = [
  { name: "Decathlon", type: "Chain Store", desc: "Affordable trekking gear — boots, layers, backpacks, and accessories. Great for beginners.", locations: "100+ stores across India & Nepal", website: "https://www.decathlon.in", rating: 4.3 },
  { name: "Wildcraft", type: "Outdoor Brand", desc: "Indian brand specializing in outdoor and adventure gear. Durable rucksacks and rain gear.", locations: "Major cities across India", website: "https://www.wildcraft.com", rating: 4.1 },
  { name: "Quechua (at Decathlon)", type: "Budget Line", desc: "Decathlon's trekking sub-brand. Excellent value for layering systems and lightweight tents.", locations: "Inside Decathlon stores", website: "https://www.decathlon.in", rating: 4.2 },
  { name: "The North Face", type: "Premium", desc: "High-performance alpine gear for serious trekkers. Trusted by Himalayan expeditions.", locations: "Delhi, Mumbai, Bengaluru, Kathmandu", website: "https://www.thenorthface.com", rating: 4.7 },
  { name: "Sherpa Adventure Gear", type: "Nepal Brand", desc: "Kathmandu-based brand making quality gear while supporting local communities.", locations: "Thamel, Kathmandu & online", website: "https://www.sherpaadventuregear.com", rating: 4.4 },
  { name: "Mountain Hardware", type: "Premium", desc: "Technical mountaineering and trekking gear. Popular among high-altitude trekkers.", locations: "Online & select retailers in metros", website: "https://www.mountainhardwear.com", rating: 4.5 },
];

const LeafDecor = ({ className = "" }: { className?: string }) => (
  <svg className={`absolute pointer-events-none opacity-[0.08] ${className}`} width="40" height="40" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17 8C8 10 5.9 16.17 3.82 21.34l1.89.66.95-2.3c.48.17.98.3 1.34.3C19 20 22 3 22 3c-1 2-8 2.25-13 3.25S2 11.5 2 13.5s1.75 3.75 1.75 3.75C7 8 17 8 17 8z"/>
  </svg>
);

const Index = () => {
  const [guesthouses, setGuesthouses] = useState<any[]>([]);
  const [agencies, setAgencies] = useState<any[]>([]);

  useEffect(() => {
    supabase.from("guesthouse_listings").select("*").eq("approved", true).limit(4)
      .then(({ data }) => { if (data) setGuesthouses(data); });
    supabase.from("agency_listings").select("*").eq("approved", true).limit(4)
      .then(({ data }) => { if (data) setAgencies(data); });
  }, []);

  return (
    <main className="bg-gradient-to-b from-background via-muted/20 to-background relative overflow-hidden">
      {/* Subtle mountain background */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.025] z-0">
        <svg viewBox="0 0 1440 900" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
          <path d="M0 900 L0 600 L120 500 L240 550 L360 420 L480 480 L600 350 L720 400 L840 300 L960 380 L1080 280 L1200 350 L1320 250 L1440 320 L1440 900Z" fill="currentColor"/>
          <path d="M0 900 L0 700 L180 620 L360 680 L540 580 L720 640 L900 520 L1080 600 L1260 500 L1440 560 L1440 900Z" fill="currentColor" opacity="0.5"/>
        </svg>
      </div>

      <div className="relative z-10">
        {/* Hero */}
        <section className="relative h-[85vh] min-h-[540px] flex items-end overflow-hidden">
          <img src={heroImg} alt="Himalayan mountain landscape at golden hour" className="absolute inset-0 w-full h-full object-cover" loading="eager" />
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/30 to-transparent" />
          <div className="relative z-10 container mx-auto px-4 pb-16 md:pb-24">
            <h1 className="text-primary-foreground text-balance animate-reveal max-w-2xl text-6xl text-left font-serif">
              Amazing Trails
            </h1>
            <p className="mt-4 text-primary-foreground/85 text-lg md:text-xl max-w-lg animate-reveal animate-reveal-delay-1 font-body">
              Your complete guide to trekking across India & Nepal — routes, safety tips, and real stories from the trail.
            </p>
            <Link to="/routes"
              className="inline-flex items-center gap-2 mt-8 px-6 py-3 rounded-lg trek-gradient text-primary-foreground font-semibold text-sm shadow-lg hover:shadow-xl transition-shadow active:scale-[0.97] animate-reveal animate-reveal-delay-2">
              Explore Routes <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>

        {/* HikerAI CTA Banner */}
        <section className="container mx-auto px-4 -mt-24 relative z-20 mb-8">
          <ScrollReveal>
            <div className="bg-primary/10 border border-primary/20 rounded-xl p-6 flex items-center gap-4 backdrop-blur-sm">
              <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center shrink-0">
                <Mountain className="w-6 h-6 text-primary-foreground" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-foreground text-lg">Having problems with trekking?</p>
                <p className="text-muted-foreground text-sm">Consult <span className="font-bold text-primary">HikerAI</span> — your AI trekking expert for altitude management, gear advice, safety tips, and more. Click the green button on the top left!</p>
              </div>
            </div>
          </ScrollReveal>
        </section>

        {/* Features */}
        <section className="container mx-auto px-4 -mt-16 relative z-20 pb-24">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f, i) => (
              <ScrollReveal key={f.to} delay={i * 100}>
                <Link to={f.to}
                  className="group block bg-card rounded-xl shadow-md hover:shadow-xl transition-shadow p-8 border border-border h-full relative overflow-hidden">
                  <LeafDecor className="top-2 right-2 rotate-45 text-trek-moss" />
                  <LeafDecor className="bottom-2 left-2 -rotate-12 text-trek-moss" />
                  <div className={`inline-flex p-3 rounded-lg ${f.color} mb-5`}>
                    <f.icon className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <h3 className="mb-2 group-hover:text-primary transition-colors">{f.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{f.desc}</p>
                  <span className="inline-flex items-center gap-1 mt-4 text-sm font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                    Learn more <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </section>

        {/* Preparations */}
        <section className="container mx-auto px-4 pb-24 relative">
          <LeafDecor className="top-0 left-8 rotate-12 text-trek-moss w-16 h-16" />
          <LeafDecor className="top-4 right-12 -rotate-45 text-trek-moss w-12 h-12" />
          <ScrollReveal>
            <div className="text-center mb-12">
              <h2 className="text-balance flex items-center justify-center gap-2">
                <Leaf className="h-6 w-6 text-trek-moss" /> Essential Preparations
              </h2>
              <p className="text-muted-foreground mt-3 max-w-lg mx-auto">
                Don't hit the trail unprepared. Here's what every trekker needs to know before setting out.
              </p>
            </div>
          </ScrollReveal>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {preparations.map((prep, i) => (
              <ScrollReveal key={prep.title} delay={i * 80}>
                <div className="bg-card rounded-xl border border-border p-6 h-full relative overflow-hidden hover:shadow-md transition-shadow">
                  <LeafDecor className="top-1 right-1 rotate-90 text-trek-moss" />
                  <LeafDecor className="bottom-1 left-1 -rotate-45 text-trek-moss" />
                  <prep.icon className={`h-8 w-8 ${prep.color} mb-4`} />
                  <h4 className="font-display font-semibold text-sm mb-2">{prep.title}</h4>
                  <p className="text-muted-foreground text-xs leading-relaxed">{prep.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </section>

        {/* Guesthouses */}
        <section className="container mx-auto px-4 pb-24">
          <ScrollReveal>
            <div className="flex items-center justify-between mb-10">
              <div>
                <h2 className="text-balance flex items-center gap-2">
                  <Home className="h-6 w-6 text-primary" /> Featured Guesthouses
                </h2>
                <p className="text-muted-foreground mt-2 max-w-md">
                  Comfortable stays along popular trek routes — verified by the trekking community.
                </p>
              </div>
              <Link to="/guesthouses" className="hidden sm:inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline">
                View all <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          </ScrollReveal>
          {guesthouses.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {guesthouses.map((gh, i) => (
                <ScrollReveal key={gh.id} delay={i * 80}>
                  <div className="bg-card rounded-xl border border-border overflow-hidden hover:shadow-lg transition-shadow group">
                    {gh.photo_url ? (
                      <div className="aspect-[4/3] overflow-hidden">
                        <img src={gh.photo_url} alt={gh.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      </div>
                    ) : (
                      <div className="aspect-[4/3] bg-muted flex items-center justify-center">
                        <Home className="h-10 w-10 text-muted-foreground/30" />
                      </div>
                    )}
                    <div className="p-5">
                      <h4 className="font-display font-semibold text-sm mb-1 truncate">{gh.name}</h4>
                      <p className="text-xs text-muted-foreground flex items-center gap-1 mb-2"><MapPin className="h-3 w-3" /> {gh.location}</p>
                      <p className="text-xs text-muted-foreground line-clamp-2 mb-3">{gh.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-primary">₹{gh.price_range_min}–₹{gh.price_range_max}/night</span>
                        <a href={`tel:${gh.contact_number}`} className="text-xs text-muted-foreground hover:text-primary"><Phone className="h-3.5 w-3.5" /></a>
                      </div>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          ) : (
            <ScrollReveal>
              <div className="bg-card rounded-xl border border-border p-12 text-center">
                <Home className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
                <p className="text-muted-foreground text-sm">No guesthouses listed yet.</p>
                <Link to="/guesthouses" className="text-xs text-primary hover:underline mt-2 inline-block">List your guesthouse →</Link>
              </div>
            </ScrollReveal>
          )}
        </section>

        {/* Travel Agencies */}
        <section className="container mx-auto px-4 pb-24">
          <ScrollReveal>
            <div className="flex items-center justify-between mb-10">
              <div>
                <h2 className="text-balance flex items-center gap-2">
                  <Briefcase className="h-6 w-6 text-primary" /> Travel Agencies
                </h2>
                <p className="text-muted-foreground mt-2 max-w-md">
                  Trusted agencies organizing guided treks across the Himalayas.
                </p>
              </div>
              <Link to="/agencies" className="hidden sm:inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline">
                View all <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          </ScrollReveal>
          {agencies.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {agencies.map((ag, i) => (
                <ScrollReveal key={ag.id} delay={i * 80}>
                  <div className="bg-card rounded-xl border border-border p-6 hover:shadow-lg transition-shadow relative overflow-hidden">
                    <LeafDecor className="top-1 right-1 rotate-45 text-trek-moss" />
                    <div className="flex items-center gap-3 mb-3">
                      {ag.logo_url ? (
                        <img src={ag.logo_url} alt={ag.name} className="h-12 w-12 rounded-lg object-cover border border-border" />
                      ) : (
                        <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center"><Briefcase className="h-5 w-5 text-primary" /></div>
                      )}
                      <div className="min-w-0 flex-1">
                        <h4 className="font-display font-semibold text-sm truncate">{ag.name}</h4>
                        {ag.established_year && <p className="text-[10px] text-muted-foreground">Est. {ag.established_year}</p>}
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2 mb-3">{ag.description}</p>
                    <div className="flex items-center gap-2 flex-wrap">
                      <a href={`tel:${ag.contact_number}`} className="text-xs text-primary hover:underline flex items-center gap-1"><Phone className="h-3 w-3" /> Contact</a>
                      {ag.website && <a href={ag.website} target="_blank" rel="noopener noreferrer" className="text-xs text-muted-foreground hover:text-primary flex items-center gap-1"><ExternalLink className="h-3 w-3" /> Website</a>}
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          ) : (
            <ScrollReveal>
              <div className="bg-card rounded-xl border border-border p-12 text-center">
                <Briefcase className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
                <p className="text-muted-foreground text-sm">No agencies listed yet.</p>
                <Link to="/agencies" className="text-xs text-primary hover:underline mt-2 inline-block">List your agency →</Link>
              </div>
            </ScrollReveal>
          )}
        </section>

        {/* Recommended Gear Shops */}
        <section className="container mx-auto px-4 pb-24 relative">
          <LeafDecor className="top-0 right-8 rotate-12 text-trek-moss w-14 h-14" />
          <ScrollReveal>
            <div className="text-center mb-12">
              <h2 className="text-balance flex items-center justify-center gap-2">
                <ShoppingBag className="h-6 w-6 text-trek-sunrise" /> Recommended Gear Shops
              </h2>
              <p className="text-muted-foreground mt-3 max-w-lg mx-auto">
                Get the right gear before you hit the trail. These trusted shops stock everything a trekker needs.
              </p>
            </div>
          </ScrollReveal>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {gearShops.map((shop, i) => (
              <ScrollReveal key={shop.name} delay={i * 80}>
                <div className="bg-card rounded-xl border border-border p-6 hover:shadow-lg transition-shadow relative overflow-hidden group">
                  <LeafDecor className="bottom-1 right-1 -rotate-12 text-trek-moss" />
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-display font-semibold text-sm">{shop.name}</h4>
                      <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground mt-1 inline-block">{shop.type}</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs">
                      <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                      <span className="font-medium tabular-nums">{shop.rating}</span>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed mb-3">{shop.desc}</p>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-3">
                    <MapPin className="h-3 w-3 shrink-0 text-primary" />
                    <span>{shop.locations}</span>
                  </div>
                  <a href={shop.website} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:underline">
                    Visit website <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </section>

        {/* Stats */}
        <section className="container mx-auto px-4 pb-24">
          <ScrollReveal>
            <div className="text-center mb-12">
              <h2 className="text-balance">Why Trek with TrailBharat?</h2>
              <p className="text-muted-foreground mt-3 max-w-lg mx-auto">
                We curate detailed information on every major trek in India & Nepal so you can plan with confidence.
              </p>
            </div>
          </ScrollReveal>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { num: "120+", label: "Curated Routes" },
              { num: "2", label: "Countries" },
              { num: "3,600–8,849m", label: "Altitude Range" },
              { num: "All Year", label: "Trekking Seasons" },
            ].map((stat, i) => (
              <ScrollReveal key={stat.label} delay={i * 80}>
                <div className="text-center p-6 bg-card rounded-xl border border-border relative overflow-hidden">
                  <LeafDecor className="top-1 right-1 rotate-45 text-trek-moss" />
                  <div className="font-display text-2xl md:text-3xl font-bold text-primary">{stat.num}</div>
                  <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
};

export default Index;
