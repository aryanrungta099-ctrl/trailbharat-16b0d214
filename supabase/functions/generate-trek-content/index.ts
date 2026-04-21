// Admin-only edge function to batch-generate AI trek guides.
// POST { trekIds: string[] } → generates and upserts into trek_overrides.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const PROMPT = (t: any) => `You are writing a structured trekking guide for SEO indexing.
Trek: ${t.name} (${t.country}, ${t.state})
Region: ${t.region} | Difficulty: ${t.difficulty} | Duration: ${t.durationDays} days
Max altitude: ${t.altitudeMeters}m | Best months: ${t.bestMonths.join(",")}
Short description: ${t.description}
Highlights: ${(t.highlights || []).join(", ")}

Write a 1200-1800 word guide using EXACTLY these markdown sections in order:

## Overview
2-3 paragraphs about the trek's character, terrain, and what makes it distinctive.

## Quick Facts
Bullet list: location, duration, difficulty, max altitude, best season, base town/airport (only if confident).

## Day-by-Day Itinerary
Markdown table: Day | Stage | Distance | Altitude | Notes. Use "—" if unsure rather than invent.

## Best Time to Visit
Month-by-month breakdown.

## Difficulty & Fitness
Who can do it, training, prior experience.

## AMS Risk Summary
Days above 3000m/4000m/5000m if applicable, recommended acclimatisation, red flags. End with: "**Note:** This is general guidance — see our [AMS Hub](/ams) for detailed protocols. Consult a doctor before using Diamox."

## How to Reach
Nearest airport, railhead, road route. Leave blank if unsure.

## What to Pack
Bullet list specific to this trek's altitude and season.

## Permits Required
List required permits. If unknown, write "Verified permit details coming soon — check with local trek operators."

## Budget Range
General range only. No specific agencies or quoted prices.

## FAQs
4-6 beginner Q&A.

RULES:
- No specific guide/agency names. No invented permit fees, phone numbers, or dates.
- No medical dosing advice — only point readers to the AMS Hub and a doctor.
- Output pure markdown only, no preamble. Start with \`## Overview\`.`;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) return json({ error: "unauthorized" }, 401);

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );
    const userClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } },
    );

    const { data: { user } } = await userClient.auth.getUser();
    if (!user) return json({ error: "unauthorized" }, 401);

    const { data: roles } = await supabase
      .from("user_roles").select("role").eq("user_id", user.id).eq("role", "admin");
    if (!roles?.length) return json({ error: "admin only" }, 403);

    const { treks } = await req.json();
    if (!Array.isArray(treks) || !treks.length) return json({ error: "no treks" }, 400);

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY")!;
    const results: any[] = [];

    for (const trek of treks) {
      try {
        const aiResp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${LOVABLE_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "google/gemini-2.5-flash",
            messages: [
              { role: "system", content: "You write factually careful, SEO-optimised trekking guides. When unsure of a specific detail, leave it blank rather than fabricate." },
              { role: "user", content: PROMPT(trek) },
            ],
          }),
        });

        if (aiResp.status === 429) { results.push({ id: trek.id, error: "rate_limited" }); continue; }
        if (aiResp.status === 402) return json({ error: "PAYMENT_REQUIRED", processed: results }, 402);
        if (!aiResp.ok) { results.push({ id: trek.id, error: `ai_${aiResp.status}` }); continue; }

        const aiData = await aiResp.json();
        const content = aiData.choices?.[0]?.message?.content;
        if (!content) { results.push({ id: trek.id, error: "empty" }); continue; }

        // delete existing AI rows then insert fresh
        await supabase.from("trek_overrides")
          .delete()
          .eq("trek_id", trek.id)
          .in("content_source", ["ai_generated", "ai_generated_reviewed"]);

        const { error: insErr } = await supabase.from("trek_overrides").insert({
          trek_id: trek.id,
          long_form_content: content,
          content_source: "ai_generated",
          updated_by: user.id,
        });
        if (insErr) { results.push({ id: trek.id, error: insErr.message }); continue; }

        results.push({ id: trek.id, ok: true, length: content.length });
        await new Promise(r => setTimeout(r, 800));
      } catch (e) {
        results.push({ id: trek.id, error: String(e) });
      }
    }

    return json({ results });
  } catch (e) {
    console.error(e);
    return json({ error: String(e) }, 500);
  }
});

function json(body: any, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
