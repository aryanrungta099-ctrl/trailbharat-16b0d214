import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { age, height_cm, weight_kg, health_conditions, treks } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const trekSummary = treks.map((t: any) => `${t.id}|${t.name}|${t.difficulty}|${t.altitudeMeters}m|${t.durationDays}d|${t.region}|${t.state}`).join("\n");

    const systemPrompt = `You are a trekking health advisor. Given a person's physical profile, recommend the most suitable treks from the provided list. Consider:
- Age: younger people can handle more strenuous treks, older trekkers need gentler routes
- BMI (from height/weight): overweight individuals should start with easier, lower-altitude treks
- Health conditions: heart issues, asthma, knee problems etc severely limit altitude and difficulty
- Altitude risk increases with age and certain conditions

Return ONLY a JSON object with this exact structure:
{"recommended": ["trek-id-1", "trek-id-2", ...], "reasoning": "Brief explanation of why these treks suit this person"}

Return 5-15 trek IDs sorted from most to least recommended. Be conservative with health risks - safety first.`;

    const userPrompt = `Person profile:
- Age: ${age || "not specified"}
- Height: ${height_cm || "not specified"} cm
- Weight: ${weight_kg || "not specified"} kg
- Health conditions: ${health_conditions || "none reported"}

Available treks:
${trekSummary}

Recommend suitable treks for this person.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        tools: [{
          type: "function",
          function: {
            name: "recommend_treks",
            description: "Return recommended trek IDs and reasoning",
            parameters: {
              type: "object",
              properties: {
                recommended: { type: "array", items: { type: "string" }, description: "Array of trek IDs" },
                reasoning: { type: "string", description: "Brief explanation" }
              },
              required: ["recommended", "reasoning"],
              additionalProperties: false
            }
          }
        }],
        tool_choice: { type: "function", function: { name: "recommend_treks" } },
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limited, try again shortly." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI error:", response.status, t);
      throw new Error("AI gateway error");
    }

    const data = await response.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    if (toolCall?.function?.arguments) {
      const result = JSON.parse(toolCall.function.arguments);
      return new Response(JSON.stringify(result), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Fallback: try parsing content directly
    const content = data.choices?.[0]?.message?.content || "{}";
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    const result = jsonMatch ? JSON.parse(jsonMatch[0]) : { recommended: [], reasoning: "Could not generate recommendations." };
    
    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("recommend-treks error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
