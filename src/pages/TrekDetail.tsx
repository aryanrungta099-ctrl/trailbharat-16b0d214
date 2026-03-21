import { useParams, Link } from "react-router-dom";
import { useMemo, useState, useEffect } from "react";
import { ArrowLeft, MapPin, Clock, TrendingUp, Calendar, Shield, Users, ChevronDown, ChevronUp, Wallet, CloudSun, Home, Phone, Eye, AlertTriangle, Leaf, Mountain, ShieldCheck } from "lucide-react";
import { treks, MONTHS, Trek } from "@/data/treks";
import { generateBudget } from "@/data/budgets";
import { generateTrekExtras } from "@/data/trekExtras";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import ScrollReveal from "@/components/ScrollReveal";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts";

const difficultyColor: Record<string, string> = {
  Easy: "bg-trek-moss/15 text-trek-moss",
  Moderate: "bg-trek-sky/15 text-trek-sky",
  Difficult: "bg-trek-sunrise/15 text-trek-sunrise",
  Challenging: "bg-destructive/15 text-destructive",
};

const safetyColor: Record<string, string> = {
  Safe: "bg-trek-moss/15 text-trek-moss",
  "Moderate Risk": "bg-yellow-500/15 text-yellow-700",
  "High Risk": "bg-trek-sunrise/15 text-trek-sunrise",
  "Extreme Risk": "bg-destructive/15 text-destructive",
};

function getElevationRate(itinerary: Trek["itinerary"]): { day: number; rate: number; risk: string }[] {
  return itinerary.map((item, i) => {
    const elev = parseInt(item.elevation || "0");
    const prevElev = i > 0 ? parseInt(itinerary[i - 1].elevation || "0") : elev;
    const rate = elev - prevElev;
    const risk = rate > 800 ? "Dangerous" : rate > 500 ? "High" : rate > 300 ? "Moderate" : "Safe";
    return { day: item.day, rate, risk };
  });
}

const TrekDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const trek = treks.find(t => t.id === id);
  const [completionCount, setCompletionCount] = useState(0);
  const [budgetTab, setBudgetTab] = useState<"low" | "high">("low");
  const [activeTab, setActiveTab] = useState<"overview" | "altitude" | "budget" | "safety" | "stays" | "emergency">("overview");

  const budget = useMemo(() => trek ? (trek.budget ?? generateBudget(trek.country, trek.durationDays, trek.difficulty, trek.altitudeMeters, trek.name)) : null, [trek]);
  const extras = useMemo(() => trek ? generateTrekExtras(trek.name, trek.country, trek.region, trek.state, trek.altitudeMeters, trek.difficulty, trek.durationDays, trek.bestMonths, trek.highlights, trek.itinerary) : null, [trek]);

  const altitudeData = useMemo(() => {
    if (!trek) return [];
    return trek.itinerary.map(day => ({
      name: `Day ${day.day}`,
      altitude: parseInt(day.elevation || "0"),
      title: day.title,
    }));
  }, [trek]);

  const elevationRates = useMemo(() => trek ? getElevationRate(trek.itinerary) : [], [trek]);

  useEffect(() => {
    if (!trek) return;
    supabase.from("completed_treks").select("id", { count: "exact" }).eq("trek_id", trek.id)
      .then(({ count }) => setCompletionCount(count || 0));
  }, [trek]);

  if (!trek) return (
    <main className="pt-24 pb-16 container mx-auto px-4 text-center">
      <h1>Trek Not Found</h1>
      <Link to="/routes" className="text-primary hover:underline mt-4 inline-block">← Back to routes</Link>
    </main>
  );

  const tabs = [
    { id: "overview" as const, label: "Overview", icon: Mountain },
    { id: "altitude" as const, label: "Altitude Chart", icon: TrendingUp },
    { id: "budget" as const, label: "Budget", icon: Wallet },
    { id: "safety" as const, label: "Weather & Safety", icon: CloudSun },
    { id: "stays" as const, label: "Stays & Views", icon: Home },
    { id: "emergency" as const, label: "Emergency", icon: Phone },
  ];

  return (
    <main className="pt-24 pb-16">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Back link */}
        <Link to="/routes" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back to routes
        </Link>

        {/* Header */}
        <ScrollReveal>
          <div className="bg-card rounded-2xl border border-border p-8 mb-6 shadow-sm">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${difficultyColor[trek.difficulty]}`}>{trek.difficulty}</span>
              <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-muted text-muted-foreground">{trek.country}</span>
              {extras && <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${safetyColor[extras.weather.safetyLevel]}`}>{extras.weather.safetyLevel}</span>}
            </div>
            <h1 className="text-3xl md:text-4xl mb-4">{trek.name}</h1>
            <p className="text-muted-foreground leading-relaxed mb-6">{trek.description}</p>

            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-1.5"><MapPin className="h-4 w-4 text-primary" />{trek.region}, {trek.state}</span>
              <span className="inline-flex items-center gap-1.5"><Clock className="h-4 w-4 text-primary" />{trek.durationDays} days</span>
              <span className="inline-flex items-center gap-1.5"><TrendingUp className="h-4 w-4 text-primary" />{trek.altitudeMeters.toLocaleString()}m</span>
              <span className="inline-flex items-center gap-1.5"><Calendar className="h-4 w-4 text-primary" />{trek.bestMonths.map(m => MONTHS[m - 1]).join(", ")}</span>
              <span className="inline-flex items-center gap-1.5"><Users className="h-4 w-4 text-primary" />{completionCount} completed</span>
            </div>
          </div>
        </ScrollReveal>

        {/* Tabs */}
        <ScrollReveal delay={60}>
          <div className="flex gap-1.5 mb-6 overflow-x-auto pb-1">
            {tabs.map(t => (
              <button key={t.id} onClick={() => setActiveTab(t.id)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all active:scale-[0.97] ${activeTab === t.id ? "bg-primary text-primary-foreground shadow" : "bg-muted text-muted-foreground hover:text-foreground"}`}>
                <t.icon className="h-3.5 w-3.5" /> {t.label}
              </button>
            ))}
          </div>
        </ScrollReveal>

        <ScrollReveal delay={80}>
          {activeTab === "overview" && (
            <div className="space-y-6">
              {/* Highlights */}
              <div className="bg-card rounded-xl border border-border p-6">
                <h3 className="mb-4">Highlights</h3>
                <ul className="grid sm:grid-cols-2 gap-x-4 gap-y-2">
                  {trek.highlights.map(h => <li key={h} className="text-sm text-muted-foreground flex items-start gap-2"><span className="text-trek-moss mt-0.5">•</span> {h}</li>)}
                </ul>
              </div>

              {/* Itinerary */}
              <div className="bg-card rounded-xl border border-border p-6">
                <h3 className="mb-4">Day-by-Day Itinerary</h3>
                <div className="space-y-4">
                  {trek.itinerary.map(day => (
                    <div key={day.day} className="flex gap-4 text-sm">
                      <div className="shrink-0 w-16 text-right">
                        <span className="inline-flex items-center justify-center px-2 py-0.5 rounded bg-primary/10 text-primary font-medium text-xs">Day {day.day}</span>
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">{day.title}</div>
                        <p className="text-muted-foreground mt-0.5">{day.description}</p>
                        <div className="flex gap-3 mt-1 text-xs text-trek-stone">
                          {day.distance && <span>📏 {day.distance}</span>}
                          {day.elevation && <span>⛰️ {day.elevation}</span>}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Preparations */}
              {extras && (
                <div className="bg-card rounded-xl border border-border p-6">
                  <h3 className="mb-4 flex items-center gap-2"><ShieldCheck className="h-5 w-5 text-primary" /> Preparations</h3>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {extras.preparations.map(prep => (
                      <div key={prep.category} className="bg-muted/50 rounded-lg p-4 border border-border/50">
                        <div className="font-medium text-sm mb-2">{prep.category}</div>
                        <ul className="space-y-1">
                          {prep.items.map((item, i) => <li key={i} className="text-xs text-muted-foreground flex items-start gap-1.5"><Leaf className="h-3 w-3 text-trek-moss shrink-0 mt-0.5" /> {item}</li>)}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Viewpoints */}
              {extras && (
                <div className="bg-card rounded-xl border border-border p-6">
                  <h3 className="mb-4 flex items-center gap-2"><Eye className="h-5 w-5 text-primary" /> Viewpoints</h3>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {extras.viewpoints.map(vp => (
                      <div key={vp.name} className="bg-muted/50 rounded-lg p-3 border border-border/50">
                        <div className="font-medium text-sm">{vp.name}</div>
                        <p className="text-xs text-muted-foreground mt-1">{vp.description}</p>
                        <span className="text-xs text-primary mt-1 inline-block">🕐 {vp.bestTime}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === "altitude" && (
            <div className="space-y-6">
              <div className="bg-card rounded-xl border border-border p-6">
                <h3 className="mb-4">Altitude Profile</h3>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={altitudeData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="altGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(152, 35%, 28%)" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="hsl(152, 35%, 28%)" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(40, 12%, 86%)" />
                      <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                      <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `${v}m`} />
                      <Tooltip content={({ active, payload }) => {
                        if (!active || !payload?.length) return null;
                        const d = payload[0].payload;
                        return (
                          <div className="bg-card border border-border rounded-lg p-3 shadow-lg text-xs">
                            <div className="font-medium">{d.name}: {d.title}</div>
                            <div className="text-primary font-bold mt-1">{d.altitude.toLocaleString()}m</div>
                          </div>
                        );
                      }} />
                      <Area type="monotone" dataKey="altitude" stroke="hsl(152, 35%, 28%)" fill="url(#altGrad)" strokeWidth={2} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Elevation rate safety */}
              <div className="bg-card rounded-xl border border-border p-6">
                <h3 className="mb-4 flex items-center gap-2"><Shield className="h-5 w-5 text-primary" /> Elevation Gain Rate & Safety</h3>
                <p className="text-xs text-muted-foreground mb-4">
                  Above 3,000m, ascend no more than 300-500m per day. Rapid altitude gain increases risk of AMS (Acute Mountain Sickness).
                </p>
                <div className="space-y-2">
                  {elevationRates.map(er => (
                    <div key={er.day} className="flex items-center gap-3 text-sm">
                      <span className="w-14 shrink-0 text-xs font-medium text-primary">Day {er.day}</span>
                      <div className="flex-1 bg-muted rounded-full h-3 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${er.risk === "Safe" ? "bg-trek-moss" : er.risk === "Moderate" ? "bg-yellow-500" : er.risk === "High" ? "bg-trek-sunrise" : "bg-destructive"}`}
                          style={{ width: `${Math.min(Math.abs(er.rate) / 10, 100)}%` }}
                        />
                      </div>
                      <span className="w-20 text-right text-xs text-muted-foreground">{er.rate > 0 ? "+" : ""}{er.rate}m</span>
                      <span className={`w-20 text-xs font-medium px-2 py-0.5 rounded-full text-center ${er.risk === "Safe" ? "bg-trek-moss/15 text-trek-moss" : er.risk === "Moderate" ? "bg-yellow-500/15 text-yellow-700" : er.risk === "High" ? "bg-trek-sunrise/15 text-trek-sunrise" : "bg-destructive/15 text-destructive"}`}>
                        {er.risk}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "budget" && budget && (
            <div className="bg-card rounded-xl border border-border p-6">
              <div className="flex gap-2 mb-4">
                <button onClick={() => setBudgetTab("low")} className={`px-4 py-2 rounded-lg text-xs font-medium transition-all active:scale-[0.97] ${budgetTab === "low" ? "bg-trek-moss text-primary-foreground shadow" : "bg-muted text-muted-foreground"}`}>💰 Low Budget</button>
                <button onClick={() => setBudgetTab("high")} className={`px-4 py-2 rounded-lg text-xs font-medium transition-all active:scale-[0.97] ${budgetTab === "high" ? "bg-trek-sunrise text-primary-foreground shadow" : "bg-muted text-muted-foreground"}`}>💎 High Budget</button>
              </div>
              {(() => {
                const data = budgetTab === "low" ? budget.low : budget.high;
                return (
                  <div className={`rounded-xl border p-5 ${budgetTab === "low" ? "border-trek-moss/30 bg-trek-moss/5" : "border-trek-sunrise/30 bg-trek-sunrise/5"}`}>
                    <div className="flex items-baseline justify-between mb-4">
                      <div>
                        <div className="text-xs text-muted-foreground uppercase tracking-wider font-medium mb-1">{budgetTab === "low" ? "Estimated Low Budget" : "Estimated High Budget"}</div>
                        <div className="font-display text-2xl font-bold">{data.total}</div>
                      </div>
                      <div className={`text-sm font-medium px-3 py-1 rounded-full ${budgetTab === "low" ? "bg-trek-moss/15 text-trek-moss" : "bg-trek-sunrise/15 text-trek-sunrise"}`}>{data.perDay}</div>
                    </div>
                    <div className="space-y-2 mb-4">
                      {data.items.map(item => (
                        <div key={item.category} className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">{item.category}</span>
                          <span className="font-medium tabular-nums">{item.amount}</span>
                        </div>
                      ))}
                    </div>
                    <div className={`rounded-lg p-3 text-xs leading-relaxed ${budgetTab === "low" ? "bg-trek-moss/10 text-trek-moss" : "bg-trek-sunrise/10 text-trek-sunrise"}`}>
                      <span className="font-semibold">💡 Tip: </span>{data.tips}
                    </div>
                  </div>
                );
              })()}
            </div>
          )}

          {activeTab === "safety" && extras && (
            <div className="space-y-6">
              <div className={`bg-card rounded-xl border p-6 ${safetyColor[extras.weather.safetyLevel].split(" ")[0]}`}>
                <h3 className="mb-3 flex items-center gap-2"><CloudSun className="h-5 w-5" /> Weather Conditions</h3>
                <div className="grid sm:grid-cols-2 gap-3 text-sm mb-3">
                  <div><span className="text-muted-foreground">Season:</span> <span className="font-medium">{extras.weather.currentSeason}</span></div>
                  <div><span className="text-muted-foreground">Temperature:</span> <span className="font-medium">{extras.weather.temperature}</span></div>
                  <div><span className="text-muted-foreground">Rainfall:</span> <span className="font-medium">{extras.weather.rainfall}</span></div>
                  <div><span className="text-muted-foreground">Safety:</span> <span className={`font-medium px-2 py-0.5 rounded-full text-xs ${safetyColor[extras.weather.safetyLevel]}`}>{extras.weather.safetyLevel}</span></div>
                </div>
                <p className="text-sm">{extras.weather.safetyNote}</p>
              </div>

              <div className="bg-card rounded-xl border border-border p-6">
                <h3 className="mb-3">🐾 Wildlife</h3>
                <div className="flex flex-wrap gap-2 mb-3">
                  {extras.wildlife.animals.map(a => <span key={a} className="text-xs bg-muted border border-border rounded-full px-2.5 py-1">{a}</span>)}
                </div>
                <ul className="space-y-1">
                  {extras.wildlife.safetyTips.map((t, i) => <li key={i} className="text-xs text-muted-foreground flex items-start gap-1.5"><AlertTriangle className="h-3 w-3 text-yellow-600 shrink-0 mt-0.5" /> {t}</li>)}
                </ul>
              </div>
            </div>
          )}

          {activeTab === "stays" && extras && (
            <div className="space-y-6">
              <div className="bg-card rounded-xl border border-border p-6">
                <h3 className="mb-4 flex items-center gap-2"><Home className="h-5 w-5 text-primary" /> Recommended Stays</h3>
                <div className="space-y-3">
                  {extras.guesthouses.map((gh, i) => (
                    <div key={i} className="bg-muted/50 rounded-lg p-4 border border-border/50 flex flex-col sm:flex-row sm:items-center gap-3">
                      <div className="flex-1">
                        <div className="font-medium text-sm">{gh.name}</div>
                        <div className="text-xs text-muted-foreground mt-0.5">📍 {gh.location}</div>
                        <p className="text-xs text-muted-foreground mt-1">{gh.note}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="text-sm font-medium text-primary">{gh.priceRange}</div>
                        <div className="text-xs text-muted-foreground">⭐ {gh.rating}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-card rounded-xl border border-border p-6">
                <h3 className="mb-4 flex items-center gap-2"><Eye className="h-5 w-5 text-primary" /> Viewpoints</h3>
                <div className="grid sm:grid-cols-2 gap-3">
                  {extras.viewpoints.map(vp => (
                    <div key={vp.name} className="bg-muted/50 rounded-lg p-3 border border-border/50">
                      <div className="font-medium text-sm">{vp.name}</div>
                      <p className="text-xs text-muted-foreground mt-1">{vp.description}</p>
                      <span className="text-xs text-primary mt-1 inline-block">🕐 {vp.bestTime}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "emergency" && extras && (
            <div className="bg-card rounded-xl border border-destructive/30 bg-destructive/5 p-6">
              <h3 className="mb-4 flex items-center gap-2 text-destructive"><Phone className="h-5 w-5" /> Emergency</h3>
              <div className="space-y-3 text-sm">
                <div><span className="text-muted-foreground text-xs uppercase tracking-wider">Nearest Hospital</span><p className="font-medium mt-0.5">{extras.emergency.nearestHospital}</p></div>
                <div><span className="text-muted-foreground text-xs uppercase tracking-wider">Rescue Contacts</span><p className="font-medium mt-0.5">{extras.emergency.rescueContact}</p></div>
                <div><span className="text-muted-foreground text-xs uppercase tracking-wider">Evacuation</span><p className="font-medium mt-0.5">{extras.emergency.evacuationRoute}</p></div>
                <ul className="mt-3 space-y-1.5">
                  {extras.emergency.tips.map((tip, i) => <li key={i} className="text-xs flex items-start gap-2"><AlertTriangle className="h-3 w-3 text-destructive shrink-0 mt-0.5" /> {tip}</li>)}
                </ul>
              </div>
            </div>
          )}
        </ScrollReveal>
      </div>
    </main>
  );
};

export default TrekDetail;
