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
    const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY")!;
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    // --- Authentication: verify the caller is logged in ---
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const userClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      global: { headers: { Authorization: authHeader } },
    });

    const token = authHeader.replace("Bearer ", "");
    const { data: claimsData, error: claimsError } = await userClient.auth.getClaims(token);
    if (claimsError || !claimsData?.claims) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const callerId = claimsData.claims.sub as string;

    // --- Parse and validate input ---
    const { table, record_id, text_content, image_urls } = await req.json();

    if (!table || !record_id || !text_content) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Only allow known tables
    const approvableTables = ["sherpa_listings", "guesthouse_listings", "agency_listings", "experiences"];
    const reviewTables = ["trek_reviews", "sherpa_reviews", "guesthouse_reviews", "agency_reviews"];
    const allowedTables = [...approvableTables, ...reviewTables];

    if (!allowedTables.includes(table)) {
      return new Response(JSON.stringify({ error: "Invalid table" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // --- Verify the caller owns the record ---
    const serviceClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    const { data: record, error: recordError } = await serviceClient
      .from(table)
      .select("user_id")
      .eq("id", record_id)
      .maybeSingle();

    if (recordError || !record) {
      return new Response(JSON.stringify({ error: "Record not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (record.user_id !== callerId) {
      return new Response(JSON.stringify({ error: "Forbidden: you do not own this record" }), {
        status: 403,
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
      approved = rawContent.toLowerCase().includes('"approved": true') || rawContent.toLowerCase().includes('"approved":true');
      reason = "AI response parsed heuristically";
    }

    if (approvableTables.includes(table)) {
      if (approved) {
        await serviceClient.from(table).update({ approved: true }).eq("id", record_id);
      }
    }

    // For review tables — if inappropriate, delete the review
    if (reviewTables.includes(table) && !approved) {
      await serviceClient.from(table).delete().eq("id", record_id);
    }

    return new Response(JSON.stringify({ approved, reason }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("Moderation error:", e);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
