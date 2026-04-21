import { Mail, MessageCircle, AlertTriangle, Briefcase } from "lucide-react";
import SEOHead, { breadcrumbSchema } from "@/components/SEOHead";
import ScrollReveal from "@/components/ScrollReveal";

const channels = [
  { icon: Mail, title: "General enquiries", email: "hello@himalayantrails.aryanrungta.com", desc: "Questions about a trek, the site, or how to plan a trip." },
  { icon: AlertTriangle, title: "Corrections & errata", email: "corrections@himalayantrails.aryanrungta.com", desc: "Outdated route info, broken contact numbers, or factual errors. We respond within 5 working days." },
  { icon: Briefcase, title: "Listings & partnerships", email: "listings@himalayantrails.aryanrungta.com", desc: "Sherpas, agencies, or guesthouses applying to be verified." },
  { icon: MessageCircle, title: "Press & media", email: "press@himalayantrails.aryanrungta.com", desc: "Interview requests, data citations, syndication." },
];

const Contact = () => (
  <main className="pt-24 pb-16 min-h-screen">
    <SEOHead
      title="Contact Himalayan Trails — Corrections, Listings & Press"
      description="Get in touch with the Himalayan Trails team for trek questions, corrections, sherpa or agency listings, and press enquiries."
      path="/contact"
      jsonLd={breadcrumbSchema([{ name: "Home", url: "/" }, { name: "Contact", url: "/contact" }])}
    />
    <article className="container mx-auto px-4 max-w-3xl">
      <ScrollReveal>
        <header className="mb-10">
          <p className="text-xs uppercase tracking-[0.2em] text-primary mb-3">Contact</p>
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-4 text-foreground">Get in touch</h1>
          <p className="text-lg text-muted-foreground leading-relaxed">We're a small team. Email is the fastest way to reach us — please use the right address below to help us route your message.</p>
        </header>
      </ScrollReveal>

      <div className="grid md:grid-cols-2 gap-4">
        {channels.map(c => (
          <ScrollReveal key={c.title}>
            <div className="bg-card border border-border rounded-xl p-5 h-full">
              <c.icon className="h-5 w-5 text-primary mb-2" />
              <h2 className="font-display text-base font-semibold mb-1">{c.title}</h2>
              <p className="text-xs text-muted-foreground mb-2">{c.desc}</p>
              <a href={`mailto:${c.email}`} className="text-sm text-primary hover:underline break-all">{c.email}</a>
            </div>
          </ScrollReveal>
        ))}
      </div>

      <ScrollReveal>
        <section className="mt-10">
          <h2 className="font-display text-xl font-semibold mb-2">Response times</h2>
          <p className="text-sm text-muted-foreground">We aim to respond to general enquiries within 5 working days, and to corrections within 5 working days. We do not handle bookings — please contact agencies and sherpas directly using the numbers on their listing pages.</p>
        </section>
      </ScrollReveal>
    </article>
  </main>
);

export default Contact;
