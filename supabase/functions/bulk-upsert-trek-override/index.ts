// Bulk upsert endpoint for trek_overrides — service-role bypass via shared secret.
// Used by /tmp/bulk_treks.ts batch script during content backfills.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-bulk-secret",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  try {
    const secret = req.headers.get("x-bulk-secret");
    const expected = Deno.env.get("LOVABLE_API_KEY");
    if (!secret || !expected || secret !== expected) {
      return json({ error: "unauthorized" }, 401);
    }

    const body = await req.json();
    const { trek_id, content, itinerary, highlights, photo_urls } = body;
    if (!trek_id) return json({ error: "trek_id required" }, 400);

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const { data: existing } = await supabase
      .from("trek_overrides")
      .select("id, long_form_content, itinerary_json, highlights")
      .eq("trek_id", trek_id)
      .maybeSingle();

    const patch: any = { updated_at: new Date().toISOString() };
    if (typeof content === "string" && content.length > 100) patch.long_form_content = content;
    if (itinerary && typeof itinerary === "object") patch.itinerary_json = itinerary;
    if (Array.isArray(highlights) && highlights.length) patch.highlights = highlights;
    if (Array.isArray(photo_urls) && photo_urls.length) patch.photo_urls = photo_urls;

    if (existing) {
      const { error } = await supabase.from("trek_overrides").update(patch).eq("id", existing.id);
      if (error) return json({ error: error.message }, 500);
      return json({ ok: true, action: "updated" });
    } else {
      patch.trek_id = trek_id;
      patch.content_source = "ai_generated";
      const { error } = await supabase.from("trek_overrides").insert(patch);
      if (error) return json({ error: error.message }, 500);
      return json({ ok: true, action: "inserted" });
    }
  } catch (e) {
    return json({ error: String(e) }, 500);
  }
});

function json(body: any, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
