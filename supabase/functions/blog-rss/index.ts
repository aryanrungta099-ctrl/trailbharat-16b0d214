import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SITE_URL = "https://himalayantrails.aryanrungta.com";
const SITE_NAME = "Himalayan Trails";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const escapeXml = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
    const { data: posts } = await supabase
      .from("blog_posts")
      .select("slug, title, excerpt, cover_image_url, created_at, updated_at, tags")
      .eq("published", true)
      .order("created_at", { ascending: false })
      .limit(50);

    const items = (posts || []).map(p => {
      const link = `${SITE_URL}/blog/${p.slug}`;
      const pubDate = new Date(p.created_at || Date.now()).toUTCString();
      const categories = (p.tags || []).map((t: string) => `      <category>${escapeXml(t)}</category>`).join("\n");
      return `    <item>
      <title>${escapeXml(p.title)}</title>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <pubDate>${pubDate}</pubDate>
      <description>${escapeXml(p.excerpt || "")}</description>
${categories}${p.cover_image_url ? `\n      <enclosure url="${escapeXml(p.cover_image_url)}" type="image/jpeg" />` : ""}
    </item>`;
    }).join("\n");

    const lastBuildDate = new Date().toUTCString();
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${SITE_NAME} — Blog</title>
    <link>${SITE_URL}/blog</link>
    <atom:link href="${SITE_URL}/blog/rss.xml" rel="self" type="application/rss+xml" />
    <description>Trekking guides, safety tips, gear reviews, and stories from the Himalayas.</description>
    <language>en-IN</language>
    <lastBuildDate>${lastBuildDate}</lastBuildDate>
${items}
  </channel>
</rss>`;

    return new Response(xml, {
      headers: { ...corsHeaders, "Content-Type": "application/rss+xml; charset=utf-8", "Cache-Control": "public, max-age=1800" },
    });
  } catch (error) {
    return new Response(`Error generating RSS: ${(error as Error).message}`, { status: 500, headers: corsHeaders });
  }
});
