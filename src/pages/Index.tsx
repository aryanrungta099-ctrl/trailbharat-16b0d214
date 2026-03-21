import { Link } from "react-router-dom";
import { Search, Shield, MessageSquare, ArrowRight } from "lucide-react";
import heroImg from "@/assets/hero-mountains.jpg";
import ScrollReveal from "@/components/ScrollReveal";

const features = [
{
  to: "/routes",
  icon: Search,
  title: "Explore Trek Routes",
  desc: "Search and discover trekking routes across India — from the Himalayas to the Western Ghats.",
  color: "trek-gradient"
},
{
  to: "/tips",
  icon: Shield,
  title: "Safety & Tips",
  desc: "Essential guidance on gear, fitness, altitude sickness, and weather to keep your trek safe.",
  color: "trek-gradient-warm"
},
{
  to: "/experiences",
  icon: MessageSquare,
  title: "Share Experiences",
  desc: "Read stories from fellow trekkers and share your own trail tales with the community.",
  color: "trek-gradient"
}];


const Index = () =>
<main>
    {/* Hero */}
    <section className="relative h-[85vh] min-h-[540px] flex items-end overflow-hidden">
      <img
      src={heroImg}
      alt="Himalayan mountain landscape at golden hour"
      className="absolute inset-0 w-full h-full object-cover"
      loading="eager" />
    
      <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/30 to-transparent" />
      <div className="relative z-10 container mx-auto px-4 pb-16 md:pb-24">
        <h1 className="text-primary-foreground text-balance animate-reveal max-w-2xl text-6xl font-mono text-center">
          Discover India's Most Breathtaking Trails
        </h1>
        <p className="mt-4 text-primary-foreground/85 text-lg md:text-xl max-w-lg animate-reveal animate-reveal-delay-1 font-body">
          Your complete guide to trekking across India — routes, safety tips, and real stories from the trail.
        </p>
        <Link
        to="/routes"
        className="inline-flex items-center gap-2 mt-8 px-6 py-3 rounded-lg trek-gradient text-primary-foreground font-semibold text-sm shadow-lg hover:shadow-xl transition-shadow active:scale-[0.97] animate-reveal animate-reveal-delay-2">
        
          Explore Routes <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>

    {/* Features */}
    <section className="container mx-auto px-4 -mt-16 relative z-20 pb-24">
      <div className="grid md:grid-cols-3 gap-6">
        {features.map((f, i) =>
      <ScrollReveal key={f.to} delay={i * 100}>
            <Link
          to={f.to}
          className="group block bg-card rounded-xl shadow-md hover:shadow-xl transition-shadow p-8 border border-border h-full">
          
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
      )}
      </div>
    </section>

    {/* Popular Treks teaser */}
    <section className="container mx-auto px-4 pb-24">
      <ScrollReveal>
        <div className="text-center mb-12">
          <h2 className="text-balance">Why Trek with TrailBharat?</h2>
          <p className="text-muted-foreground mt-3 max-w-lg mx-auto">
            We curate detailed information on every major trek in India so you can plan with confidence.
          </p>
        </div>
      </ScrollReveal>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
      { num: "50+", label: "Curated Routes" },
      { num: "8", label: "Indian States" },
      { num: "3,600–5,200m", label: "Altitude Range" },
      { num: "All Year", label: "Trekking Seasons" }].
      map((stat, i) =>
      <ScrollReveal key={stat.label} delay={i * 80}>
            <div className="text-center p-6 bg-card rounded-xl border border-border">
              <div className="font-display text-2xl md:text-3xl font-bold text-primary">{stat.num}</div>
              <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
            </div>
          </ScrollReveal>
      )}
      </div>
    </section>
  </main>;


export default Index;