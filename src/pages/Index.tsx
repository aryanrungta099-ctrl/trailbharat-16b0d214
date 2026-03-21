import { Link } from "react-router-dom";
import { Search, Shield, MessageSquare, Users, ArrowRight, Leaf, Mountain, Droplets, Footprints, Compass } from "lucide-react";
import heroImg from "@/assets/hero-mountains.jpg";
import ScrollReveal from "@/components/ScrollReveal";

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

// Decorative leaf SVG for borders
const LeafDecor = ({ className = "" }: { className?: string }) => (
  <svg className={`absolute pointer-events-none opacity-[0.08] ${className}`} width="40" height="40" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17 8C8 10 5.9 16.17 3.82 21.34l1.89.66.95-2.3c.48.17.98.3 1.34.3C19 20 22 3 22 3c-1 2-8 2.25-13 3.25S2 11.5 2 13.5s1.75 3.75 1.75 3.75C7 8 17 8 17 8z"/>
  </svg>
);

const Index = () => (
  <main>
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

    {/* Features with leaf decorations */}
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

    {/* Preparations Section */}
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
          { num: "50+", label: "Curated Routes" },
          { num: "2", label: "Countries" },
          { num: "3,600–6,200m", label: "Altitude Range" },
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
  </main>
);

export default Index;
