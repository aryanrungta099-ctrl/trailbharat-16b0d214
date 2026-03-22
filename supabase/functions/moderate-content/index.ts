import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    const { table, record_id, text_content, image_urls } = await req.json();

    if (!table || !record_id || !text_content) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Build the moderation prompt
    const systemPrompt = `You are a content moderation bot for a trekking community platform called Himalayan Trails. 
Your job is to determine whether user-submitted content is appropriate.

APPROVE content that is:
- Related to trekking, hiking, mountains, travel, nature, outdoor activities
- Genuine business listings (sherpas, guesthouses, travel agencies)
- Honest reviews and experiences (even if negative, as long as not abusive)
- General outdoor/adventure discussion

REJECT content that contains:
- Profanity, slurs, hate speech, or discriminatory language
- Sexually explicit or suggestive content
- Spam, scams, or misleading advertisements
- Threats, harassment, or bullying
- Completely irrelevant content (politics, gambling, drugs, etc.)
- Fake or clearly fabricated reviews meant to manipulate ratings

Respond with ONLY a JSON object: {"approved": true/false, "reason": "brief reason"}`;

    const userMessage = `Please moderate this content:\n\n${text_content}`;

    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userMessage },
        ],
      }),
    });

    if (!aiResponse.ok) {
      if (aiResponse.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limited, content queued for manual review" }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (aiResponse.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted, content queued for manual review" }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      console.error("AI error:", aiResponse.status, await aiResponse.text());
      // On AI failure, leave for manual review (don't auto-approve)
      return new Response(JSON.stringify({ approved: false, reason: "Queued for manual review", auto: false }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const aiData = await aiResponse.json();
    const rawContent = aiData.choices?.[0]?.message?.content || "";
    
    // Parse the AI response
    let approved = false;
    let reason = "Could not determine";
    try {
      const cleaned = rawContent.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      const parsed = JSON.parse(cleaned);
      approved = parsed.approved === true;
      reason = parsed.reason || reason;
    } catch {
      // If parsing fails, check for simple keywords
      approved = rawContent.toLowerCase().includes('"approved": true') || rawContent.toLowerCase().includes('"approved":true');
      reason = "AI response parsed heuristically";
    }

    // Tables that have an "approved" column
    const approvableTables = ["sherpa_listings", "guesthouse_listings", "agency_listings", "experiences"];

    if (approvableTables.includes(table)) {
      if (approved) {
        await supabase.from(table).update({ approved: true }).eq("id", record_id);
      }
      // If not approved, it stays as approved=false for admin review
    }

    // For review tables — if inappropriate, delete the review
    const reviewTables = ["trek_reviews", "sherpa_reviews", "guesthouse_reviews", "agency_reviews"];
    if (reviewTables.includes(table) && !approved) {
      await supabase.from(table).delete().eq("id", record_id);
    }

    return new Response(JSON.stringify({ approved, reason }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("Moderation error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
