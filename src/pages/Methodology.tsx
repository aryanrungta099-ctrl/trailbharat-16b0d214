import { ShieldCheck, FileText, RefreshCw, AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";
import SEOHead, { breadcrumbSchema } from "@/components/SEOHead";
import ScrollReveal from "@/components/ScrollReveal";

const Methodology = () => (
  <main className="pt-24 pb-16 min-h-screen">
    <SEOHead
      title="Editorial Methodology — How We Verify Trek Information"
      description="How Himalayan Trails researches, writes, AI-assists, verifies, and updates the 180+ trek guides on the site. Full transparency on our editorial process."
      path="/methodology"
      jsonLd={breadcrumbSchema([{ name: "Home", url: "/" }, { name: "Methodology", url: "/methodology" }])}
    />
    <article className="container mx-auto px-4 max-w-3xl">
      <ScrollReveal>
        <header className="mb-10">
          <p className="text-xs uppercase tracking-[0.2em] text-primary mb-3">Editorial</p>
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-4 text-foreground">Our methodology</h1>
          <p className="text-lg text-muted-foreground leading-relaxed">Trek planning is a high-stakes purchase. This page explains exactly how we research, write, verify, and refresh the information you find on every trek page.</p>
        </header>
      </ScrollReveal>

      <ScrollReveal>
        <section className="mb-10 space-y-3">
          <h2 className="font-display text-2xl font-semibold flex items-center gap-2"><FileText className="h-5 w-5 text-primary" />Three content tiers</h2>
          <div className="space-y-4 mt-4">
            <div className="bg-card border border-border rounded-xl p-5">
              <p className="text-xs uppercase tracking-wider text-trek-moss font-semibold mb-1.5">Editorial · ✓ Verified</p>
              <h3 className="font-semibold text-base mb-1">Hand-written by trekkers</h3>
              <p className="text-sm text-muted-foreground">Our flagship 20 routes (Kedarkantha, EBC, Annapurna Circuit, Goechala, Hampta Pass, Roopkund, Chadar, Pin Parvati, Sandakphu, Brahmatal, Triund, Valley of Flowers, Langtang, Manaslu, ABC, Mardi Himal, Poon Hill, Upper Mustang, Gokyo, Three Passes) are written from primary trip experience and reviewed by at least one person who has walked the route.</p>
            </div>
            <div className="bg-card border border-border rounded-xl p-5">
              <p className="text-xs uppercase tracking-wider text-yellow-700 dark:text-yellow-400 font-semibold mb-1.5">AI-assisted · Pending review</p>
              <h3 className="font-semibold text-base mb-1">Structured AI draft, awaiting human verification</h3>
              <p className="text-sm text-muted-foreground">For less-popular routes, we use AI to draft a strict structured template (overview, day-by-day itinerary, best season, difficulty, max altitude, AMS risk, nearest railhead/airport, budget range, packing list, permits). The AI is instructed to leave fields blank rather than hallucinate. We never auto-generate pricing specifics, named guide endorsements, or AMS dosing advice. Every such page carries a visible banner.</p>
            </div>
            <div className="bg-card border border-border rounded-xl p-5">
              <p className="text-xs uppercase tracking-wider text-trek-sky font-semibold mb-1.5">AI-assisted · ✓ Reviewed</p>
              <h3 className="font-semibold text-base mb-1">AI draft upgraded by an editor</h3>
              <p className="text-sm text-muted-foreground">Pages move from "pending" to "reviewed" once a human contributor cross-checks the itinerary against published sources, walks the route, or confirms with a verified guide.</p>
            </div>
          </div>
        </section>
      </ScrollReveal>

      <ScrollReveal>
        <section className="mb-10 space-y-3">
          <h2 className="font-display text-2xl font-semibold flex items-center gap-2"><AlertCircle className="h-5 w-5 text-primary" />What we will <em>not</em> auto-generate</h2>
          <ul className="text-sm text-muted-foreground space-y-1.5 mt-2">
            <li>• Specific guide or agency endorsements</li>
            <li>• Exact pricing in INR or USD</li>
            <li>• Diamox dosing or other safety-critical medical advice</li>
            <li>• Named tea-house contact numbers</li>
            <li>• Route-specific safety claims (avalanche risk, recent landslide closures)</li>
          </ul>
          <p className="text-sm text-muted-foreground mt-3">These sections appear as <em>"Verified guide coming soon"</em> placeholders until a human contributor fills them in.</p>
        </section>
      </ScrollReveal>

      <ScrollReveal>
        <section className="mb-10 space-y-3">
          <h2 className="font-display text-2xl font-semibold flex items-center gap-2"><ShieldCheck className="h-5 w-5 text-primary" />Verification checks</h2>
          <p className="text-sm text-muted-foreground">For sherpas and agencies listed in our directory, we verify the following before publication:</p>
          <ul className="text-sm text-muted-foreground space-y-1.5 mt-2">
            <li>• Operating licence (where applicable)</li>
            <li>• Public liability insurance</li>
            <li>• At least one prior client reference</li>
            <li>• Working contact number we have called ourselves</li>
          </ul>
          <p className="text-sm text-muted-foreground mt-3">Verified listings carry a badge with a tooltip explaining what was checked.</p>
        </section>
      </ScrollReveal>

      <ScrollReveal>
        <section className="mb-10 space-y-3">
          <h2 className="font-display text-2xl font-semibold flex items-center gap-2"><RefreshCw className="h-5 w-5 text-primary" />Refresh cadence</h2>
          <ul className="text-sm text-muted-foreground space-y-1.5">
            <li>• <strong>Flagship 20 routes:</strong> reviewed every 6 months and at the start of each trekking season</li>
            <li>• <strong>AI-assisted routes:</strong> upgraded to editorial as contributors come in; mass-checked annually</li>
            <li>• <strong>Sherpa & agency listings:</strong> contact details re-verified annually</li>
            <li>• <strong>Tea-house data:</strong> verified seasonally where contributors are active</li>
          </ul>
          <p className="text-sm text-muted-foreground mt-3">Each trek page shows its <em>"Last verified"</em> date so you always know how fresh the information is.</p>
        </section>
      </ScrollReveal>

      <ScrollReveal>
        <section className="mb-10 space-y-3">
          <h2 className="font-display text-2xl font-semibold">Spotted an error?</h2>
          <p className="text-sm text-muted-foreground">Every trek page has a "Report outdated info" link, or email <a href="mailto:corrections@himalayantrails.aryanrungta.com" className="text-primary hover:underline">corrections@himalayantrails.aryanrungta.com</a>. We aim to respond within 5 working days.</p>
          <p className="text-sm text-muted-foreground">For more, see <Link to="/about" className="text-primary hover:underline">about us</Link> and <Link to="/contact" className="text-primary hover:underline">contact</Link>.</p>
        </section>
      </ScrollReveal>
    </article>
  </main>
);

export default Methodology;
