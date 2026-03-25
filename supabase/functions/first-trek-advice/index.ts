import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { profile, easyTreks } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const profileInfo = profile
      ? `User Profile: Age ${profile.age || "unknown"}, Height ${profile.height_cm || "unknown"}cm, Weight ${profile.weight_kg || "unknown"}kg, Health conditions: ${profile.health_conditions || "none reported"}.`
      : "No health profile available — give general advice for a healthy adult beginner.";

    const trekList = easyTreks.map((t: any) => `- ${t.name} (${t.region}, ${t.state}) — ${t.altitude}m, ${t.duration} days`).join("\n");

    const systemPrompt = `You are a friendly, expert trekking advisor for first-time trekkers on Himalayan Trails.

${profileInfo}

Available beginner-friendly treks:
${trekList}

Your job:
1. Greet the user warmly and acknowledge this is their first trek
2. Based on their health profile (BMI, age, conditions), give a brief **Health Assessment** with:
   - Fitness level evaluation
   - Any health concerns for trekking
   - Specific precautions based on their conditions
3. Recommend the **Top 3 treks** from the list that best match their profile, explaining why each is suitable
4. Provide a **Preparation Checklist**:
   - Physical training (4-6 week plan)
   - Essential gear list
   - Nutrition and hydration tips
   - Mental preparation tips
5. Include **Safety Tips** specifically for first-timers:
   - Altitude sickness awareness
   - When to turn back
   - Communication essentials
6. End with an encouraging message

Use markdown formatting with headers, bullet points, and bold text. Be concise but thorough.
If no profile data is available, give general advice suitable for a healthy adult beginner.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: "I'm planning my first ever trek. Please give me personalized health recommendations and preparation tips." },
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      const status = response.status;
      if (status === 429) {
        return new Response(JSON.stringify({ error: "Rate limited" }), { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }
      if (status === 402) {
        return new Response(JSON.stringify({ error: "Credits exhausted" }), { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }
      const t = await response.text();
      console.error("AI error:", status, t);
      return new Response(JSON.stringify({ error: "AI error" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("first-trek-advice error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
