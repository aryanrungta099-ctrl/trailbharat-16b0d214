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

    const systemPrompt = `You are a professional trek preparation assistant for Himalayan Trails. You help trekkers prepare for their chosen trek.

Current trek: ${trekInfo.name}
Region: ${trekInfo.region}, ${trekInfo.state}
Altitude: ${trekInfo.altitude}m
Duration: ${trekInfo.duration} days
Difficulty: ${trekInfo.difficulty}
Best months: ${trekInfo.bestMonths?.join(", ")}
Description: ${trekInfo.description}

${profileInfo}

Your job:
1. Ask the user these questions ONE AT A TIME (wait for their answer before asking the next):
   - Q1: Have you done any high-altitude trekking before? If yes, what was the highest altitude?
   - Q2: How would you rate your current fitness level? (Beginner / Intermediate / Advanced)
   - Q3: Do you have any medical conditions or injuries we should know about?
   - Q4: When are you planning to do this trek?
   - Q5: Will you be trekking solo or with a group?
2. After each answer, give brief relevant advice based on their response
3. After ALL 5 questions are answered, provide a comprehensive preparation summary including:
   - Fitness assessment for this specific trek
   - Recommended gear checklist
   - Acclimatization tips (if altitude > 3500m)
   - Day-by-day preparation timeline
   - Nutrition and hydration advice
4. End your FINAL summary with exactly this line on its own: "**[PREP_COMPLETE]**"
   This signals the user is ready to view the full trek details.
5. Be encouraging but honest about the trek's challenges
6. If the user seems unfit, gently suggest easier alternatives but still provide the summary

Keep responses focused and practical. Use markdown for formatting. Number each question clearly.`;

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
