import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { messages, trekInfo, profileInfo } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const systemPrompt = `You are a professional trek preparation assistant for Himalayan Trails.

Current trek: ${trekInfo.name}
Region: ${trekInfo.region}, ${trekInfo.state}
Altitude: ${trekInfo.altitude}m
Duration: ${trekInfo.duration} days
Difficulty: ${trekInfo.difficulty}
Best months: ${trekInfo.bestMonths?.join(", ")}

${profileInfo}

Your job:
1. Ask the user these questions ONE AT A TIME. For EACH question, provide clear selectable OPTIONS so the user can pick one:
   - Q1: Have you done any high-altitude trekking before?
     A) No, this is my first trek  B) Yes, below 3000m  C) Yes, 3000-5000m  D) Yes, above 5000m
   - Q2: How would you rate your current fitness level?
     A) Beginner - I rarely exercise  B) Intermediate - I exercise 2-3 times/week  C) Advanced - I train regularly  D) Athletic - daily intense training
   - Q3: Do you have any medical conditions?
     A) None  B) Asthma or breathing issues  C) Heart condition  D) Joint/knee problems  E) Other (please specify)
   - Q4: When are you planning to do this trek?
     A) Within 1 month  B) 1-3 months  C) 3-6 months  D) 6+ months
   - Q5: Will you be trekking solo or with a group?
     A) Solo  B) With a partner  C) Small group (3-5)  D) Large group (6+)
2. Present options clearly with letter labels so users can reply with just a letter
3. After each answer, give 1-2 lines of brief relevant advice
4. After ALL 5 questions are answered, provide a preparation summary with:
   - Fitness assessment for this trek
   - Gear checklist
   - Acclimatization tips (if altitude > 3500m)
   - Nutrition and hydration advice
5. End your FINAL summary with exactly this line on its own: "**[PREP_COMPLETE]**"
6. Be encouraging but honest. If the user seems unfit, suggest easier alternatives but still give the summary.

Keep responses concise. Use markdown formatting.`;

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
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      const status = response.status;
      if (status === 429) {
        return new Response(JSON.stringify({ error: "Rate limited, please try again later." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (status === 402) {
        return new Response(JSON.stringify({ error: "Credits exhausted." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", status, t);
      return new Response(JSON.stringify({ error: "AI error" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("trek-prep-chat error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
