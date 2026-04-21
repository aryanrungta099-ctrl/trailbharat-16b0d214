import { Mountain, ShieldCheck, Users, BookOpen, Mail } from "lucide-react";
import { Link } from "react-router-dom";
import SEOHead, { breadcrumbSchema } from "@/components/SEOHead";
import ScrollReveal from "@/components/ScrollReveal";

const About = () => (
  <main className="pt-24 pb-16 min-h-screen">
    <SEOHead
      title="About Himalayan Trails — Independent Trek Guide for India & Nepal"
      description="Learn how Himalayan Trails researches, verifies and updates trek information for over 180 routes across the Indian and Nepalese Himalayas."
      path="/about"
      jsonLd={breadcrumbSchema([{ name: "Home", url: "/" }, { name: "About", url: "/about" }])}
    />
    <article className="container mx-auto px-4 max-w-3xl">
      <ScrollReveal>
        <header className="mb-10">
          <p className="text-xs uppercase tracking-[0.2em] text-primary mb-3">About us</p>
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-4 text-foreground">An independent guide to trekking in India & Nepal</h1>
          <p className="text-lg text-muted-foreground leading-relaxed">Himalayan Trails is a free, ad-free reference for over 180 trekking routes across the Indian and Nepalese Himalayas — built for trekkers who want accurate route information, honest difficulty ratings, and serious altitude-sickness guidance before they commit to a ₹30,000–₹2,00,000 trek.</p>
        </header>
      </ScrollReveal>

      <ScrollReveal>
        <section className="mb-10 space-y-4">
          <h2 className="font-display text-2xl font-semibold flex items-center gap-2"><Mountain className="h-5 w-5 text-primary" />What we cover</h2>
          <p className="text-muted-foreground leading-relaxed">Day-by-day itineraries, altitude profiles, AMS risk summaries, best-season guidance, real-world budget ranges, named villages and tea-houses on each trail, and verified guides and agencies who run those routes. We avoid bookings and commissions — when you contact a sherpa or agency through this site, you deal with them directly.</p>
        </section>
      </ScrollReveal>

      <ScrollReveal>
        <section className="mb-10 space-y-4">
          <h2 className="font-display text-2xl font-semibold flex items-center gap-2"><ShieldCheck className="h-5 w-5 text-primary" />Why we focus on AMS</h2>
          <p className="text-muted-foreground leading-relaxed">Acute Mountain Sickness kills more Himalayan trekkers than avalanches, falls and rockfall combined. Most commercial trek pages either ignore it or bury it in fine print. Every route page on Himalayan Trails carries a per-trek AMS risk summary, and our <Link to="/ams" className="text-primary hover:underline">AMS hub</Link> includes a free risk calculator. This is educational content, not medical advice — always consult a travel-medicine doctor.</p>
        </section>
      </ScrollReveal>

      <ScrollReveal>
        <section className="mb-10 space-y-4">
          <h2 className="font-display text-2xl font-semibold flex items-center gap-2"><BookOpen className="h-5 w-5 text-primary" />How we research and update content</h2>
          <p className="text-muted-foreground leading-relaxed">For our flagship 20 trek pages, content is hand-written and reviewed by people who have walked the route. For the long tail of less-popular routes, we use AI assistance to draft a structured template (overview, itinerary table, season, altitude, AMS risk, permits, packing) — every such page carries a visible <em>"AI-assisted, pending editorial review"</em> banner with a "report an error" link, and is upgraded to <em>editorial</em> status once a human contributor verifies it. We track this transparently on every page using a `content_source` tag.</p>
          <p className="text-muted-foreground leading-relaxed">For full details on this process, see our <Link to="/methodology" className="text-primary hover:underline">methodology page</Link>.</p>
        </section>
      </ScrollReveal>

      <ScrollReveal>
        <section className="mb-10 space-y-4">
          <h2 className="font-display text-2xl font-semibold flex items-center gap-2"><Users className="h-5 w-5 text-primary" />Community contributions</h2>
          <p className="text-muted-foreground leading-relaxed">Anyone who has trekked a route can contribute by sharing an <Link to="/experiences" className="text-primary hover:underline">experience</Link>, listing themselves as a <Link to="/sherpas" className="text-primary hover:underline">sherpa guide</Link>, registering their <Link to="/agencies" className="text-primary hover:underline">trekking agency</Link>, or adding a <Link to="/guesthouses" className="text-primary hover:underline">guesthouse</Link>. All listings are reviewed before publication.</p>
        </section>
      </ScrollReveal>

      <ScrollReveal>
        <section className="mb-10 space-y-4">
          <h2 className="font-display text-2xl font-semibold flex items-center gap-2"><Mail className="h-5 w-5 text-primary" />Contact & corrections</h2>
          <p className="text-muted-foreground leading-relaxed">Found an error? Want to suggest a route, contribute a guide, or report outdated tea-house info? Email <a href="mailto:hello@himalayantrails.aryanrungta.com" className="text-primary hover:underline">hello@himalayantrails.aryanrungta.com</a>. See our <Link to="/contact" className="text-primary hover:underline">contact page</Link> for more.</p>
        </section>
      </ScrollReveal>
    </article>
  </main>
);

export default About;
