import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { AlertTriangle, ShieldCheck, Activity, Pill, Mountain, ArrowRight } from "lucide-react";
import SEOHead, { breadcrumbSchema } from "@/components/SEOHead";
import ScrollReveal from "@/components/ScrollReveal";

interface CalcResult {
  level: "Low" | "Moderate" | "High" | "Severe";
  color: string;
  summary: string;
  recommendations: string[];
}

function calculateRisk(input: {
  maxAltitude: number;
  ascentDays: number;
  acclimDays: number;
  age: number;
  priorHighAltitude: "none" | "below4000" | "above4000" | "above5000";
  history: boolean;
}): CalcResult {
  let score = 0;
  if (input.maxAltitude >= 5500) score += 4;
  else if (input.maxAltitude >= 4500) score += 3;
  else if (input.maxAltitude >= 3500) score += 2;
  else if (input.maxAltitude >= 2500) score += 1;

  const ascentRate = input.ascentDays > 0 ? (input.maxAltitude - 2500) / input.ascentDays : 0;
  if (ascentRate > 800) score += 3;
  else if (ascentRate > 500) score += 2;
  else if (ascentRate > 300) score += 1;

  if (input.acclimDays === 0 && input.maxAltitude >= 4000) score += 2;
  if (input.age > 60) score += 1;
  if (input.priorHighAltitude === "none") score += 2;
  else if (input.priorHighAltitude === "below4000") score += 1;
  if (input.history) score += 3;

  if (score >= 9) return {
    level: "Severe", color: "bg-destructive/15 text-destructive border-destructive/40",
    summary: "Your itinerary carries a severe AMS risk. Reconsider, slow down, or trek with a qualified guide.",
    recommendations: [
      "Add at least 2 extra acclimatisation days at intermediate altitudes",
      "Discuss prophylactic Diamox (acetazolamide) with your doctor before departure",
      "Carry a pulse oximeter — descend if SpO₂ stays below 80% after rest",
      "Have a written evacuation plan and helicopter-evacuation insurance",
      "Do not push to summit if you experience headache, nausea, or insomnia at altitude",
    ],
  };
  if (score >= 6) return {
    level: "High", color: "bg-trek-sunrise/15 text-trek-sunrise border-trek-sunrise/40",
    summary: "Higher than usual AMS risk. Build acclimatisation days into your itinerary and watch symptoms closely.",
    recommendations: [
      "Add 1–2 acclimatisation days above 3,500m before pushing higher",
      "Limit daily ascent to 300–500m above 3,000m",
      "Carry Diamox 250mg and know the HACE/HAPE warning signs",
      "Hydrate aggressively (4L/day) and avoid alcohol above 3,000m",
      "Trek with a partner — never push high in isolation",
    ],
  };
  if (score >= 3) return {
    level: "Moderate", color: "bg-yellow-500/15 text-yellow-700 border-yellow-500/40",
    summary: "Moderate AMS risk — typical for most Himalayan treks. Standard precautions apply.",
    recommendations: [
      "Climb high, sleep low whenever possible",
      "Drink 3–4 litres of water daily above 3,000m",
      "Watch for early symptoms: headache, loss of appetite, sleep disturbance",
      "Have Diamox available (consult doctor for dosage)",
      "Know your descent route from each campsite",
    ],
  };
  return {
    level: "Low", color: "bg-trek-moss/15 text-trek-moss border-trek-moss/40",
    summary: "Low AMS risk based on this itinerary. Routine precautions are sufficient.",
    recommendations: [
      "Stay hydrated and pace yourself",
      "Recognise symptoms even at moderate altitudes",
      "Don't ignore persistent headaches",
    ],
  };
}

const AmsHub = () => {
  const [maxAltitude, setMaxAltitude] = useState(4500);
  const [ascentDays, setAscentDays] = useState(5);
  const [acclimDays, setAcclimDays] = useState(1);
  const [age, setAge] = useState(30);
  const [priorHighAltitude, setPriorHighAltitude] = useState<"none" | "below4000" | "above4000" | "above5000">("below4000");
  const [history, setHistory] = useState(false);

  const result = useMemo(() => calculateRisk({ maxAltitude, ascentDays, acclimDays, age, priorHighAltitude, history }), [maxAltitude, ascentDays, acclimDays, age, priorHighAltitude, history]);

  return (
    <main className="pt-24 pb-16 min-h-screen">
      <SEOHead
        title="AMS on Himalayan Treks — Symptoms, Prevention & Risk Calculator"
        description="Complete guide to acute mountain sickness on Himalayan treks. Learn AMS symptoms, prevention, Diamox guidance, and use our free risk calculator to plan safer."
        path="/ams"
        jsonLd={[
          breadcrumbSchema([
            { name: "Home", url: "/" },
            { name: "AMS Guide", url: "/ams" },
          ]),
          {
            "@context": "https://schema.org",
            "@type": "MedicalWebPage",
            name: "Altitude Sickness on Himalayan Treks",
            description: "Educational guide to acute mountain sickness (AMS), HACE, HAPE, prevention, and risk assessment for Himalayan trekkers.",
            about: { "@type": "MedicalCondition", name: "Acute Mountain Sickness" },
          },
        ]}
      />
      <article className="container mx-auto px-4 max-w-4xl">
        <ScrollReveal>
          <header className="mb-10">
            <p className="text-xs uppercase tracking-[0.2em] text-primary mb-3">Safety Hub</p>
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-4 text-foreground">Altitude Sickness on Himalayan Treks</h1>
            <p className="text-lg text-muted-foreground leading-relaxed">A practical, evidence-based guide to acute mountain sickness (AMS), prevention, Diamox use, and recognising the killer escalations — HACE and HAPE.</p>
            <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg text-xs text-yellow-700 dark:text-yellow-400 flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
              <p><strong>Medical disclaimer.</strong> This article is educational only and is not a substitute for medical advice. Always consult a doctor — especially a travel-medicine specialist — before trekking above 3,000m or taking medications such as acetazolamide (Diamox).</p>
            </div>
          </header>
        </ScrollReveal>

        <ScrollReveal>
          <section className="mb-12 prose prose-invert max-w-none">
            <h2 className="font-display text-2xl font-semibold mb-3 flex items-center gap-2"><Activity className="h-5 w-5 text-primary" />What is AMS?</h2>
            <p className="text-muted-foreground leading-relaxed">Acute Mountain Sickness is a syndrome caused by reduced oxygen at altitudes above roughly 2,500m. It develops when you ascend faster than your body can adapt. Most trekkers will experience mild symptoms above 3,000m; a smaller number progress to dangerous forms — High-Altitude Cerebral Edema (HACE) and High-Altitude Pulmonary Edema (HAPE) — both of which can kill within hours if not treated by descent.</p>
            <h3 className="font-display text-lg font-semibold mt-6 mb-2">Common AMS symptoms</h3>
            <ul className="text-muted-foreground space-y-1 text-sm">
              <li>• Headache (the cardinal symptom)</li>
              <li>• Loss of appetite, nausea</li>
              <li>• Fatigue disproportionate to exertion</li>
              <li>• Disturbed sleep, vivid dreams</li>
              <li>• Dizziness, lightheadedness</li>
            </ul>
            <h3 className="font-display text-lg font-semibold mt-6 mb-2 text-trek-sunrise">HACE — life-threatening</h3>
            <ul className="text-muted-foreground space-y-1 text-sm">
              <li>• Confusion, drowsiness, behavioural change</li>
              <li>• Ataxia (loss of balance — the heel-to-toe walking test)</li>
              <li>• Severe headache unrelieved by paracetamol</li>
            </ul>
            <h3 className="font-display text-lg font-semibold mt-6 mb-2 text-destructive">HAPE — life-threatening</h3>
            <ul className="text-muted-foreground space-y-1 text-sm">
              <li>• Breathlessness at rest</li>
              <li>• Persistent dry cough progressing to wet/pink frothy sputum</li>
              <li>• Cyanosis (blue lips/fingertips)</li>
              <li>• Chest tightness, crackles in the lungs</li>
            </ul>
            <p className="text-foreground font-medium mt-4">If you suspect HACE or HAPE: <strong>descend immediately</strong>, by at least 500–1,000m. Do not wait for morning. Descent is the only definitive treatment.</p>
          </section>
        </ScrollReveal>

        <ScrollReveal>
          <section className="mb-12 prose prose-invert max-w-none">
            <h2 className="font-display text-2xl font-semibold mb-3 flex items-center gap-2"><Mountain className="h-5 w-5 text-primary" />Prevention — the golden rules</h2>
            <ol className="text-muted-foreground space-y-2 text-sm">
              <li><strong>Ascend slowly.</strong> Above 3,000m, sleep no more than 300–500m higher than the previous night.</li>
              <li><strong>Climb high, sleep low.</strong> Day hikes to higher altitude help acclimatisation if you descend to sleep.</li>
              <li><strong>Take rest days.</strong> One acclimatisation day for every 1,000m above 3,000m is a sensible default.</li>
              <li><strong>Hydrate.</strong> 3–4 litres of water per day above 3,000m. Urine should stay clear.</li>
              <li><strong>No alcohol or sedatives</strong> above 3,000m — both depress breathing.</li>
              <li><strong>Eat carbohydrate-rich food</strong> to support oxygen-efficient metabolism.</li>
              <li><strong>Listen to your body.</strong> If you feel unwell, do not ascend further until symptoms resolve.</li>
            </ol>
            <h3 className="font-display text-lg font-semibold mt-6 mb-2 flex items-center gap-2"><Pill className="h-4 w-4" />Diamox (Acetazolamide) — what to know</h3>
            <p className="text-muted-foreground text-sm">Acetazolamide is a prescription medicine that speeds up natural acclimatisation by stimulating breathing. It does not mask symptoms — it actually reduces them.</p>
            <ul className="text-muted-foreground space-y-1 text-sm mt-2">
              <li>• Common dosage: 125 mg twice daily, started 1 day before ascent above 3,000m</li>
              <li>• Continue until you reach your highest sleeping altitude or for 2 days at altitude</li>
              <li>• Side effects: tingling fingers/lips, increased urination, altered taste of carbonated drinks</li>
              <li>• Contraindicated in sulfa-drug allergy and certain kidney conditions</li>
            </ul>
            <p className="text-yellow-700 dark:text-yellow-400 text-xs mt-2 italic"><strong>Always</strong> consult your doctor for Diamox dosing — this guide is not medical advice.</p>
          </section>
        </ScrollReveal>

        {/* Risk Calculator */}
        <ScrollReveal>
          <section className="mb-12">
            <div className="bg-card rounded-2xl border border-border p-6 md:p-8">
              <h2 className="font-display text-2xl font-semibold mb-1 flex items-center gap-2"><ShieldCheck className="h-5 w-5 text-primary" />AMS Risk Calculator</h2>
              <p className="text-sm text-muted-foreground mb-6">Enter your trek details and personal factors to get a qualitative AMS risk estimate.</p>

              <div className="grid md:grid-cols-2 gap-5 mb-6">
                <div>
                  <label className="text-xs font-medium text-muted-foreground block mb-1.5">Maximum altitude (m): <span className="text-foreground font-semibold">{maxAltitude.toLocaleString()}</span></label>
                  <input type="range" min={2500} max={6500} step={100} value={maxAltitude} onChange={e => setMaxAltitude(Number(e.target.value))} className="w-full accent-primary" />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground block mb-1.5">Days of ascent: <span className="text-foreground font-semibold">{ascentDays}</span></label>
                  <input type="range" min={1} max={20} value={ascentDays} onChange={e => setAscentDays(Number(e.target.value))} className="w-full accent-primary" />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground block mb-1.5">Acclimatisation rest days: <span className="text-foreground font-semibold">{acclimDays}</span></label>
                  <input type="range" min={0} max={5} value={acclimDays} onChange={e => setAcclimDays(Number(e.target.value))} className="w-full accent-primary" />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground block mb-1.5">Your age: <span className="text-foreground font-semibold">{age}</span></label>
                  <input type="range" min={15} max={75} value={age} onChange={e => setAge(Number(e.target.value))} className="w-full accent-primary" />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground block mb-1.5">Prior high-altitude experience</label>
                  <select value={priorHighAltitude} onChange={e => setPriorHighAltitude(e.target.value as any)} className="w-full bg-muted border border-border rounded-lg px-3 py-2 text-sm">
                    <option value="none">None</option>
                    <option value="below4000">Trekked below 4,000m</option>
                    <option value="above4000">Trekked above 4,000m</option>
                    <option value="above5000">Trekked above 5,000m</option>
                  </select>
                </div>
                <div className="flex items-center">
                  <label className="flex items-center gap-2 text-sm cursor-pointer">
                    <input type="checkbox" checked={history} onChange={e => setHistory(e.target.checked)} className="h-4 w-4 accent-primary" />
                    <span>Prior history of AMS / HACE / HAPE</span>
                  </label>
                </div>
              </div>

              <div className={`rounded-xl border p-5 ${result.color}`}>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-display text-lg font-semibold">Risk: {result.level}</h3>
                </div>
                <p className="text-sm mb-3">{result.summary}</p>
                <ul className="space-y-1.5 text-sm">
                  {result.recommendations.map((r, i) => <li key={i} className="flex gap-2"><span>•</span>{r}</li>)}
                </ul>
              </div>
              <p className="text-[11px] text-muted-foreground/80 mt-3 italic">This calculator is a rough qualitative aid. It does not replace clinical assessment by a travel-medicine doctor.</p>
            </div>
          </section>
        </ScrollReveal>

        <ScrollReveal>
          <section className="mb-12">
            <h2 className="font-display text-2xl font-semibold mb-4">Related reading</h2>
            <div className="grid md:grid-cols-2 gap-3">
              <Link to="/blog/altitude-sickness-himalayan-treks-guide" className="block p-4 bg-card rounded-lg border border-border hover:border-primary/50 transition-colors">
                <p className="font-medium text-sm mb-1">Full AMS treatment guide</p>
                <p className="text-xs text-muted-foreground">Step-by-step protocol from symptom recognition to evacuation</p>
                <ArrowRight className="h-3 w-3 mt-2 text-primary" />
              </Link>
              <Link to="/tips" className="block p-4 bg-card rounded-lg border border-border hover:border-primary/50 transition-colors">
                <p className="font-medium text-sm mb-1">Trekking safety tips</p>
                <p className="text-xs text-muted-foreground">Weather, hydration, gear and emergency preparedness</p>
                <ArrowRight className="h-3 w-3 mt-2 text-primary" />
              </Link>
              <Link to="/routes" className="block p-4 bg-card rounded-lg border border-border hover:border-primary/50 transition-colors">
                <p className="font-medium text-sm mb-1">Browse all trek routes</p>
                <p className="text-xs text-muted-foreground">Each route page shows its own AMS risk summary</p>
                <ArrowRight className="h-3 w-3 mt-2 text-primary" />
              </Link>
              <Link to="/recommended" className="block p-4 bg-card rounded-lg border border-border hover:border-primary/50 transition-colors">
                <p className="font-medium text-sm mb-1">Find your trek</p>
                <p className="text-xs text-muted-foreground">Personalised recommendations based on your profile</p>
                <ArrowRight className="h-3 w-3 mt-2 text-primary" />
              </Link>
            </div>
          </section>
        </ScrollReveal>
      </article>
    </main>
  );
};

export default AmsHub;
