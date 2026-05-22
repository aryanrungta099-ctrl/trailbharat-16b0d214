// Admin-only edge function to batch-generate AI trek guides.
// POST { trekIds: string[] } → generates and upserts into trek_overrides.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const PROMPT = (t: any) => `You are writing a deep, SEO-optimised long-form trekking guide for Himalayan Trails.
Trek: ${t.name} (${t.country}, ${t.state})
Region: ${t.region} | Difficulty: ${t.difficulty} | Duration: ${t.durationDays} days
Max altitude: ${t.altitudeMeters}m | Best months: ${t.bestMonths.join(",")}
Short description: ${t.description}
Highlights: ${(t.highlights || []).join(", ")}

TARGET LENGTH: 1800–2000 words. Do NOT go under 1800. Be substantive — no filler, no repetition.

Use EXACTLY these markdown sections in this order:

## Overview
3–4 rich paragraphs (~350 words). Cover: the trek's character & landscape; what makes it distinctive vs nearby alternatives; cultural/historical context of the region; who it appeals to. Naturally weave in the trek name, region, and 2–3 long-tail keywords (e.g. "${t.name} trek itinerary", "best time for ${t.name}", "${t.name} difficulty").

## Quick Facts
Bullet list: location, duration, difficulty, max altitude, total distance (if confident), best season, base town/airport, trek style (camping/teahouse), permits-at-a-glance.

## Day-by-Day Itinerary
Markdown table with columns: Day | Stage | Distance (km) | Altitude (m) | Terrain & Notes. One row per day for all ${t.durationDays} days. Use "—" only if genuinely uncertain. Follow the table with 2–3 sentences summarising the arc of the trek (acclimatisation pattern, the climax day, descent).

## Best Time to Visit
Month-by-month breakdown (at least 6 months). For each: weather, trail conditions, crowd level, photography appeal. Call out monsoon/winter closures explicitly.

## Difficulty & Fitness
~250 words. Who can attempt it, prior experience needed, training plan (cardio weeks, strength, altitude prep), red flags that mean you should pick an easier trek first. Mention pace expectations (km/day, ascent/day).

## AMS Risk Summary
Quantify days spent above 3000m / 4000m / 5000m for this trek. Recommended acclimatisation pattern, hydration, ascent rate. List 4–5 red-flag symptoms. End with: "**Note:** This is general guidance — see our [AMS Hub](/ams) for detailed protocols. Always consult a doctor before using Diamox or any altitude medication."

## How to Reach
Nearest airport, railhead, and road route from the closest major hub. Approximate travel times. Mention shared taxi vs private options. Leave blank only if genuinely unknown.

## What to Pack
Categorised bullet list (Clothing / Footwear / Sleeping / Backpack / Personal / Documents) tailored to this trek's altitude and season. At least 20 items.

## Permits Required
List each permit with issuing authority. If specific fees/processes are uncertain, write "Verify current fees with local trek operators or the forest department before travel."

## Budget Range
General per-person range in INR for self-organised vs guided trips. Break down: transport, permits, guide/porter, food, gear rental. No specific agency names or quoted prices.

## Safety & Responsible Trekking
~200 words. Weather hazards specific to this trek, river crossings, wildlife, mobile network gaps, evacuation realities. Leave-no-trace principles, local etiquette, supporting the local economy.

## Nearby Treks & Extensions
3–5 bullet suggestions of related treks in the same region (shorter alternatives, harder progressions, combinable side trips). Use generic names — do not link.

## FAQs
6–8 beginner Q&A targeting common search queries (e.g. "Is ${t.name} suitable for beginners?", "How cold does it get?", "Is there mobile network?", "Can solo women trek this?").

RULES:
- No specific guide/agency names. No invented permit fees, phone numbers, or dates.
- No medical dosing advice — only point readers to the AMS Hub and a doctor.
- Vary sentence length. Use Indian English. Avoid AI-tells like "nestled", "embark", "in conclusion", "tapestry".
- Output pure markdown only, no preamble. Start directly with \`## Overview\`.`;

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

    const { treks, force, model: requestedModel, provider: requestedProvider } = await req.json();
    if (!Array.isArray(treks) || !treks.length) return json({ error: "no treks" }, 400);
    const provider = requestedProvider === "groq" ? "groq" : "lovable";
    const model = requestedModel || (provider === "groq" ? "llama-3.1-8b-instant" : "google/gemini-2.5-pro");

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY")!;
    const GROQ_API_KEY = Deno.env.get("GROQ_API_KEY");
    if (provider === "groq" && !GROQ_API_KEY) return json({ error: "GROQ_API_KEY not configured" }, 500);

    const endpoint = provider === "groq"
      ? "https://api.groq.com/openai/v1/chat/completions"
      : "https://ai.gateway.lovable.dev/v1/chat/completions";
    const apiKey = provider === "groq" ? GROQ_API_KEY! : LOVABLE_API_KEY;
    const perTrekDelay = provider === "groq" ? 300 : 1200;

    const results: any[] = [];

    for (const trek of treks) {
      try {
        const aiResp = await fetch(endpoint, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model,
            messages: [
              { role: "system", content: "You write factually careful, deeply researched, SEO-optimised long-form trekking guides for Indian and Nepali Himalayan routes. Hit the requested word count. When unsure of a specific detail, leave it blank rather than fabricate." },
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

        const wordCount = content.trim().split(/\s+/).length;
        if (wordCount < 1500) {
          results.push({ id: trek.id, error: `too_short_${wordCount}w` });
          continue;
        }

        // force=true wipes ALL existing long-form for this trek (incl. editorial)
        const sourcesToDelete = force
          ? ["ai_generated", "ai_generated_reviewed", "editorial"]
          : ["ai_generated", "ai_generated_reviewed"];

        await supabase.from("trek_overrides")
          .delete()
          .eq("trek_id", trek.id)
          .in("content_source", sourcesToDelete);

        const { error: insErr } = await supabase.from("trek_overrides").insert({
          trek_id: trek.id,
          long_form_content: content,
          content_source: "ai_generated",
          updated_by: user.id,
        });
        if (insErr) { results.push({ id: trek.id, error: insErr.message }); continue; }

        results.push({ id: trek.id, ok: true, length: content.length, words: wordCount });
        await new Promise(r => setTimeout(r, perTrekDelay));
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
