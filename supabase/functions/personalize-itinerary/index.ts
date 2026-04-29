// Personalize a trek itinerary based on a user's health profile.
// Returns adjusted day-by-day notes, pace, and warnings — does NOT replace the
// itinerary on the page; the client renders an overlay/sidebar with the result.

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const body = await req.json();
    const {
      trekName,
      altitudeMeters,
      difficulty,
      durationDays,
      itinerary,
      age,
      height_cm,
      weight_kg,
      health_conditions,
    } = body ?? {};

    if (!trekName || !Array.isArray(itinerary) || itinerary.length === 0) {
      return new Response(
        JSON.stringify({ error: "trekName and a non-empty itinerary array are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const compactItinerary = itinerary
      .map((d: any) =>
        `Day ${d.day}: ${d.title} | ${d.townName ?? ""} | ${d.townAltitude ?? d.elevation ?? "?"}m | ${d.distance ?? "?"}`
      )
      .join("\n");

    const systemPrompt = `You are a Himalayan high-altitude trek doctor and guide.
You receive a fixed trek itinerary and a person's health profile. You must:
1. Score overall suitability of this trek for this person from 0–100.
2. For EVERY day, return one of: "ok", "watch", "rest_recommended", "abort_recommended" + a one-sentence note tailored to their profile.
3. Suggest concrete pace adjustments (extra rest day after day X, slower walking pace, hydration target in litres/day, when to start Diamox, etc.).
4. Flag specific risks given their conditions (e.g. asthma + 5800m sleep, hypertension + Diamox interaction).
Be conservative. Real safety, not encouragement.`;

    const userPrompt = `TREK
Name: ${trekName}
Max altitude: ${altitudeMeters ?? "?"} m
Difficulty: ${difficulty ?? "?"}
Duration: ${durationDays ?? itinerary.length} days

ITINERARY
${compactItinerary}

PERSON
Age: ${age ?? "not specified"}
Height: ${height_cm ?? "?"} cm
Weight: ${weight_kg ?? "?"} kg
Health conditions / notes: ${health_conditions || "none reported"}`;

    const aiResp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "personalized_plan",
              description: "Personalised itinerary adjustments for the supplied trek and health profile.",
              parameters: {
                type: "object",
                properties: {
                  suitabilityScore: { type: "number", description: "0–100, how suitable this trek is for this person" },
                  summary: { type: "string", description: "2–3 sentence personalised summary" },
                  paceAdjustments: {
                    type: "array",
                    items: { type: "string" },
                    description: "Concrete actions: extra rest days, hydration targets, medication timing, gear",
                  },
                  risks: {
                    type: "array",
                    items: { type: "string" },
                    description: "Specific medical/altitude risks for this person on this trek",
                  },
                  dayPlans: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        day: { type: "number" },
                        status: {
                          type: "string",
                          enum: ["ok", "watch", "rest_recommended", "abort_recommended"],
                        },
                        note: { type: "string" },
                      },
                      required: ["day", "status", "note"],
                      additionalProperties: false,
                    },
                  },
                },
                required: ["suitabilityScore", "summary", "paceAdjustments", "risks", "dayPlans"],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "personalized_plan" } },
      }),
    });

    if (!aiResp.ok) {
      if (aiResp.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limited, try again shortly." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (aiResp.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await aiResp.text();
      console.error("AI error:", aiResp.status, t);
      throw new Error("AI gateway error");
    }

    const data = await aiResp.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall?.function?.arguments) {
      return new Response(JSON.stringify({ error: "AI did not return a structured plan" }), {
        status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const result = JSON.parse(toolCall.function.arguments);
    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("personalize-itinerary error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
