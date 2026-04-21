import { Shield, Backpack, HeartPulse, Cloud, Footprints, Droplets, Sun, AlertTriangle } from "lucide-react";
import ScrollReveal from "@/components/ScrollReveal";
import SEOHead, { breadcrumbSchema } from "@/components/SEOHead";

const tips = [
  {
    icon: HeartPulse,
    title: "Build Fitness Gradually",
    items: [
      "Start cardio training at least 6–8 weeks before your trek",
      "Include stair climbing and hiking with a loaded backpack",
      "Practice breathing exercises for high-altitude preparation",
      "Strengthen your knees and ankles with targeted exercises",
    ],
  },
  {
    icon: Backpack,
    title: "Pack Smart",
    items: [
      "Layer clothing — base layer, insulation, waterproof shell",
      "Carry a first-aid kit with altitude sickness medication",
      "Bring a quality headlamp with extra batteries",
      "Pack 2–3 litres of water capacity and purification tablets",
    ],
  },
  {
    icon: AlertTriangle,
    title: "Altitude Sickness Awareness",
    items: [
      "Ascend no more than 300–500 m per day above 3,000 m",
      "Recognize symptoms: headache, nausea, dizziness, fatigue",
      "Descend immediately if symptoms worsen — never push through",
      "Stay hydrated and avoid alcohol at altitude",
    ],
  },
  {
    icon: Cloud,
    title: "Weather Preparedness",
    items: [
      "Check forecasts daily and be ready for sudden changes",
      "Carry rain gear even in dry seasons — mountains are unpredictable",
      "Know the monsoon dates for your trek region",
      "Start early to avoid afternoon thunderstorms at high altitude",
    ],
  },
  {
    icon: Footprints,
    title: "Trail Etiquette",
    items: [
      "Follow the 'Leave No Trace' principles — pack out all waste",
      "Stay on marked trails to protect fragile ecosystems",
      "Give right of way to ascending trekkers and pack animals",
      "Respect local culture, customs, and sacred sites",
    ],
  },
  {
    icon: Droplets,
    title: "Water & Nutrition",
    items: [
      "Eat energy-rich snacks every 1–2 hours on the trail",
      "Never drink untreated water from streams — always purify",
      "Carry electrolyte sachets for longer treks",
      "Eat warm, freshly cooked meals at camp when possible",
    ],
  },
  {
    icon: Sun,
    title: "Sun & Skin Protection",
    items: [
      "Use SPF 50+ sunscreen — UV is stronger at altitude",
      "Wear UV-protection sunglasses to prevent snow blindness",
      "Cover exposed skin with lightweight, breathable clothing",
      "Reapply sunscreen every 2 hours, especially on snow",
    ],
  },
  {
    icon: Shield,
    title: "Emergency Preparedness",
    items: [
      "Share your itinerary with someone who isn't on the trek",
      "Carry a fully charged power bank and emergency whistle",
      "Know the nearest rescue points and hospital locations",
      "Trek with a registered guide in unfamiliar or remote areas",
    ],
  },
];

const Tips = () => (
  <main className="pt-24 pb-16">
    <SEOHead
      title="Trekking Safety Tips & Essential Guidance"
      description="Expert trekking safety tips covering altitude sickness (AMS), fitness training, gear packing, hydration, sun protection, and emergency preparedness for Himalayan treks."
      path="/tips"
      jsonLd={breadcrumbSchema([
        { name: "Home", url: "/" },
        { name: "Safety Tips", url: "/tips" },
      ])}
    />
    <div className="container mx-auto px-4">
      <ScrollReveal>
        <h1 className="text-balance mb-2">Safety Tips & Guidance</h1>
        <p className="text-muted-foreground text-lg mb-12 max-w-xl">
          Essential advice to keep you safe and prepared on every trek.
        </p>
      </ScrollReveal>

      <div className="grid md:grid-cols-2 gap-6">
        {tips.map((tip, i) => (
          <ScrollReveal key={tip.title} delay={i * 80}>
            <div className="bg-card rounded-xl border border-border p-6 h-full shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-4">
                <div className="trek-gradient p-2.5 rounded-lg">
                  <tip.icon className="h-5 w-5 text-primary-foreground" />
                </div>
                <h3>{tip.title}</h3>
              </div>
              <ul className="space-y-2.5">
                {tip.items.map((item) => (
                  <li key={item} className="text-sm text-foreground/80 leading-relaxed flex items-start gap-2">
                    <span className="text-trek-moss mt-0.5 shrink-0">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </div>
  </main>
);

export default Tips;
