import { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import { Compass, ArrowRight, MapPin, Clock, TrendingUp, Calendar, RotateCcw } from "lucide-react";
import { treks, allRegions, MONTHS, Trek } from "@/data/treks";
import { generateBudget } from "@/data/budgets";
import ScrollReveal from "@/components/ScrollReveal";
import SEOHead, { breadcrumbSchema } from "@/components/SEOHead";

const STORAGE_KEY = "suggest-trek-prefs";

const fitnessLevels = [
  { value: "beginner", label: "Beginner", desc: "I walk/jog occasionally", maxAlt: 3500, maxDiff: ["Easy"] },
  { value: "moderate", label: "Moderate", desc: "I exercise 2-3 times/week", maxAlt: 4500, maxDiff: ["Easy", "Moderate"] },
  { value: "fit", label: "Fit", desc: "I exercise daily, run regularly", maxAlt: 5500, maxDiff: ["Easy", "Moderate", "Difficult"] },
  { value: "expert", label: "Expert", desc: "Experienced trekker, mountaineer", maxAlt: 99999, maxDiff: ["Easy", "Moderate", "Difficult", "Challenging"] },
];

const budgetRanges = [
  { value: "low", label: "Budget (< ₹15,000)", max: 15000 },
  { value: "mid", label: "Mid-range (₹15,000 - ₹50,000)", max: 50000 },
  { value: "high", label: "Comfortable (₹50,000 - ₹1,00,000)", max: 100000 },
  { value: "premium", label: "Premium (₹1,00,000+)", max: 999999 },
];

const dayRanges = [
  { value: "short", label: "1-3 days", min: 1, max: 3 },
  { value: "week", label: "4-7 days", min: 4, max: 7 },
  { value: "long", label: "8-14 days", min: 8, max: 14 },
  { value: "expedition", label: "15+ days", min: 15, max: 999 },
];

const experienceLevels = [
  { value: "first", label: "First timer", desc: "Never trekked before" },
  { value: "few", label: "A few treks", desc: "Done 2-5 treks" },
  { value: "regular", label: "Regular trekker", desc: "Done 5-15 treks" },
  { value: "veteran", label: "Veteran", desc: "15+ treks completed" },
];

function loadPrefs() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch {}
  return null;
}

const SuggestTrek = () => {
  const saved = useMemo(() => loadPrefs(), []);
  const hasSaved = !!saved?.fitness;
  const [step, setStep] = useState(hasSaved ? 4 : 0);
  const [fitness, setFitness] = useState(saved?.fitness || "");
  const [budget, setBudget] = useState(saved?.budget || "");
  const [days, setDays] = useState(saved?.days || "");
  const [experience, setExperience] = useState(saved?.experience || "");
  const [region, setRegion] = useState(saved?.region || "All");
  const [country, setCountry] = useState(saved?.country || "All");

  // Save preferences whenever the quiz is completed
  useEffect(() => {
    if (step >= 4 && fitness && budget && days && experience) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ fitness, budget, days, experience, region, country }));
    }
  }, [step, fitness, budget, days, experience, region, country]);

  const results = useMemo(() => {
    if (step < 4) return [];
    const fit = fitnessLevels.find(f => f.value === fitness);
    const bud = budgetRanges.find(b => b.value === budget);
    const dur = dayRanges.find(d => d.value === days);
    if (!fit || !bud || !dur) return [];

    return treks.filter(t => {
      if (t.altitudeMeters > fit.maxAlt) return false;
      if (!fit.maxDiff.includes(t.difficulty)) return false;
      if (t.durationDays < dur.min || t.durationDays > dur.max) return false;
      if (country !== "All" && t.country !== country) return false;
      if (region !== "All" && t.region !== region) return false;

      // Budget filter (approximate)
      const b = generateBudget(t.country, t.durationDays, t.difficulty, t.altitudeMeters, t.name);
      const lowTotal = parseInt(b.low.total.replace(/[^0-9]/g, "")) || 0;
      if (lowTotal > bud.max) return false;

      return true;
    }).slice(0, 12);
  }, [step, fitness, budget, days, experience, region, country]);

  const reset = () => { localStorage.removeItem(STORAGE_KEY); setStep(0); setFitness(""); setBudget(""); setDays(""); setExperience(""); setRegion("All"); setCountry("All"); };

  const questions = [
    {
      title: "What's your fitness level?",
      options: fitnessLevels,
      value: fitness,
      setValue: setFitness,
    },
    {
      title: "What's your budget?",
      options: budgetRanges,
      value: budget,
      setValue: setBudget,
    },
    {
      title: "How many days do you have?",
      options: dayRanges,
      value: days,
      setValue: setDays,
    },
    {
      title: "What's your experience level?",
      options: experienceLevels,
      value: experience,
      setValue: setExperience,
    },
  ];

  return (
    <main className="pt-24 pb-16 container mx-auto px-4 min-h-screen max-w-2xl">
      <SEOHead
        title="Suggest Me a Trek"
        description="Answer 4 quick questions about your fitness, budget, and schedule to find the perfect Himalayan trek."
        path="/suggest"
        jsonLd={breadcrumbSchema([{ name: "Home", url: "/" }, { name: "Suggest Trek", url: "/suggest" }])}
      />
      <ScrollReveal>
        <div className="text-center mb-10">
          <Compass className="h-10 w-10 text-primary mx-auto mb-4" />
          <h1 className="text-balance">Suggest Me a Trek</h1>
          <p className="text-muted-foreground mt-2">Answer 4 quick questions and we'll find the perfect trek for you.</p>
        </div>
      </ScrollReveal>

      {step < 4 ? (
        <ScrollReveal key={step}>
          <div className="bg-card rounded-2xl border border-border p-8 shadow-sm">
            {/* Progress */}
            <div className="flex gap-1.5 mb-6">
              {[0, 1, 2, 3].map(i => (
                <div key={i} className={`h-1.5 flex-1 rounded-full transition-colors ${i <= step ? "bg-primary" : "bg-muted"}`} />
              ))}
            </div>

            <h2 className="text-xl mb-6">{questions[step].title}</h2>

            {/* Region/country filters on last step */}
            {step === 3 && (
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Country</label>
                  <select value={country} onChange={e => setCountry(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm">
                    <option value="All">Any Country</option>
                    <option value="India">India</option>
                    <option value="Nepal">Nepal</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Region</label>
                  <select value={region} onChange={e => setRegion(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm">
                    <option value="All">Any Region</option>
                    {allRegions.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>
              </div>
            )}

            <div className="space-y-3">
              {questions[step].options.map((opt: any) => (
                <button
                  key={opt.value}
                  onClick={() => {
                    questions[step].setValue(opt.value);
                    setTimeout(() => setStep(s => s + 1), 200);
                  }}
                  className={`w-full text-left p-4 rounded-xl border transition-all active:scale-[0.98] ${questions[step].value === opt.value ? "border-primary bg-primary/5 shadow" : "border-border hover:border-primary/30 hover:bg-muted/50"}`}
                >
                  <div className="font-medium text-sm">{opt.label}</div>
                  {opt.desc && <div className="text-xs text-muted-foreground mt-0.5">{opt.desc}</div>}
                </button>
              ))}
            </div>

            {step > 0 && (
              <button onClick={() => setStep(s => s - 1)} className="text-sm text-muted-foreground hover:text-foreground mt-4 transition-colors">← Back</button>
            )}
          </div>
        </ScrollReveal>
      ) : (
        <ScrollReveal>
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl">Your Recommended Treks ({results.length})</h2>
            <button onClick={reset} className="text-sm text-primary hover:underline flex items-center gap-1"><RotateCcw className="h-3.5 w-3.5" /> Retake Quiz</button>
          </div>

          {results.length === 0 ? (
            <div className="bg-card rounded-xl border border-border p-8 text-center">
              <p className="text-muted-foreground">No treks match your criteria. Try adjusting your answers.</p>
              <button onClick={reset} className="mt-4 px-4 py-2 rounded-lg trek-gradient text-primary-foreground text-sm font-medium active:scale-[0.97]">Retake Quiz</button>
            </div>
          ) : (
            <div className="space-y-4">
              {results.map((trek, i) => (
                <ScrollReveal key={trek.id} delay={i * 60}>
                  <Link to={`/trek/${trek.id}`} className="block bg-card rounded-xl border border-border p-5 shadow-sm hover:shadow-md transition-all hover:border-primary/30 active:scale-[0.99]">
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                      <h3 className="text-base">{trek.name}</h3>
                      <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-muted text-muted-foreground">{trek.difficulty}</span>
                      <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-muted text-muted-foreground">{trek.country}</span>
                    </div>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                      <span className="inline-flex items-center gap-1"><MapPin className="h-3 w-3" />{trek.region}</span>
                      <span className="inline-flex items-center gap-1"><Clock className="h-3 w-3" />{trek.durationDays} days</span>
                      <span className="inline-flex items-center gap-1"><TrendingUp className="h-3 w-3" />{trek.altitudeMeters.toLocaleString()}m</span>
                      <span className="inline-flex items-center gap-1"><Calendar className="h-3 w-3" />{trek.bestMonths.map(m => MONTHS[m - 1]).join(", ")}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2 line-clamp-2">{trek.description}</p>
                  </Link>
                </ScrollReveal>
              ))}
            </div>
          )}
        </ScrollReveal>
      )}
    </main>
  );
};

export default SuggestTrek;
