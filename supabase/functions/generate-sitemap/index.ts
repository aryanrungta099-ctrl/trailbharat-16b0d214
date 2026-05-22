import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SITE_URL = "https://himalayantrails.aryanrungta.com";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const TREK_IDS = [
  "agasthyakoodam","agasthyarkoodam","ama-dablam-bc","amarkantak","annapurna-base-camp",
  "annapurna-circuit","annapurna-in-monsoon","annapurna-panorama","api-nampa",
  "arun-valley-makalu-link","auden-col","bailey-trail","bali-pass","bara-bhangal",
  "barsey-rhodo","barun-valley","beas-kund","bhaba-pass","bhrigu-lake","bhrigu-lake-winter",
  "brahmatal","buran-ghati","chadar","chandra-tal-baralacha","chandrakhani-pass",
  "chembra-peak","cho-la-pass","chopta-tungnath","chopta-tungnath-chandrashila","chulu-west",
  "david-scott-trail","dayara-bugyal","deo-tibba","deo-tibba-base","deoriatal-chandrashila",
  "dhampus-australian-camp","dhaulagiri-circuit","dhaulagiri-french-pass","dhorpatan",
  "dkd-trail","dodital-darwa","dolpo-phoksundo","double-decker-root","dudhsagar-trek",
  "dzukou-valley","everest-base-camp","everest-panorama","friendship-peak","ganesh-himal",
  "goechala","gokyo-lakes","gosaikunda","great-himalaya-trail","great-lakes-winter",
  "green-lake","guerrilla-trail","gurez-valley","guru-shikhar","hampta-pass","har-ki-dun",
  "harishchandragad","helambu","helambu-short","humla-simikot-kailash","island-peak",
  "island-peak-climb","jomsom-muktinath","jugal-himal","kafni-glacier","kalindi-khal",
  "kalsubai","kanchenjunga-circuit","kanchenjunga-north","kanchenjunga-south-bc",
  "kangchenjunga-north","kangtega-bc","karnali-corridor","kashmir-great-lakes",
  "kedarkantha","khaliya-top","kheerganga","khopra-ridge","khumbu-three-passes-extended",
  "kinnaur-kailash","kodachadri","kopra-danda","kopra-deurali","kuari-pass",
  "kuari-pass-winter","kudremukh","kumara-parvatha","ladakh-zanskar","lamkhaga-pass",
  "langtang-gosainkunda-helambu","langtang-valley","limi-valley","lower-dolpo",
  "lumba-sumba","madmaheshwar","mainpat-plateau","makalu-arun-valley","makalu-base-camp",
  "makalu-sherpani-col","manaslu-circuit","mardi-himal","mardi-himal-winter","markha-hemis",
  "markha-valley","mawryngkhang","mechuka-valley","meesapulimala","mera-peak",
  "milam-glacier","miyar-valley","mohare-danda","mount-abu-guru-shikhar","mustang-via-ferrata",
  "naar-phu","naar-phu-valley","nag-tibba","nagarkot-chisapani","nallamala-hills",
  "naranag-mahlish","nubra-pangong","numbur-cheese","numbur-cheese-circuit","pachmarhi",
  "padum-darcha","panch-pokhari","pangarchulla","parang-la","pathibhara","phawngpui",
  "phulara-ridge","pikey-peak","pin-parvati","pindari-glacier","pisang-peak","poon-hill",
  "rajgad-torna","rajmachi","rara-jumla","rara-lake","rolwaling","rolwaling-tashi-lapcha",
  "roopkund","ruby-valley","rumtse-tso-moriri","rumtse-tsomoriri","rupin-pass","sailung",
  "sandakphu","sandakphu-phalut","sar-pass","satopanth-lake","sham-valley","shey-phoksundo",
  "shey-phoksundo-upper-dolpo","shivapuri-national-park","singalila-ridge",
  "singalila-sandakphu","snow-lake","spiti-valley","stok-kangri","tadiandamol",
  "tadiyandamol","tamang-heritage","tarsar-marsar","tent-peak","three-passes","tilicho-lake",
  "tirthan-jalori","torna-fort","tsum-valley","tsum-valley-extended","upper-dolpo",
  "upper-mustang","valley-of-flowers","warwan-valley","western-nepal-saipal","zuluk-loop"
];

interface UrlEntry {
  loc: string;
  lastmod: string;
  changefreq: string;
  priority: string;
}

function urlsetXml(urls: UrlEntry[]): string {
  const items = urls.map(u => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${u.lastmod}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`).join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${items}
</urlset>`;
}

function sitemapIndexXml(maps: { loc: string; lastmod: string }[]): string {
  const items = maps.map(m => `  <sitemap>
    <loc>${m.loc}</loc>
    <lastmod>${m.lastmod}</lastmod>
  </sitemap>`).join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${items}
</sitemapindex>`;
}

const xmlResponse = (xml: string) => new Response(xml, {
  headers: { ...corsHeaders, "Content-Type": "application/xml; charset=utf-8", "Cache-Control": "public, max-age=3600" },
});

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const url = new URL(req.url);
    const section = url.searchParams.get("section");
    const today = new Date().toISOString().split("T")[0];
    const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
    const base = "https://otzzgoelrtpdwkhvkntk.supabase.co/functions/v1/generate-sitemap";

    // ----- Sitemap Index (default) -----
    if (!section) {
      const maps = [
        { loc: `${base}?section=static`, lastmod: today },
        { loc: `${base}?section=routes`, lastmod: today },
        { loc: `${base}?section=blog`, lastmod: today },
        { loc: `${base}?section=sherpas`, lastmod: today },
        { loc: `${base}?section=agencies`, lastmod: today },
        { loc: `${base}?section=guesthouses`, lastmod: today },
      ];
      return xmlResponse(sitemapIndexXml(maps));
    }

    // ----- Static pages -----
    if (section === "static") {
      const urls: UrlEntry[] = [
        { loc: `${SITE_URL}/`, lastmod: today, changefreq: "weekly", priority: "1.0" },
        { loc: `${SITE_URL}/routes`, lastmod: today, changefreq: "weekly", priority: "0.9" },
        { loc: `${SITE_URL}/blog`, lastmod: today, changefreq: "daily", priority: "0.9" },
        { loc: `${SITE_URL}/guides`, lastmod: today, changefreq: "weekly", priority: "0.8" },
        { loc: `${SITE_URL}/recommended`, lastmod: today, changefreq: "weekly", priority: "0.7" },
        { loc: `${SITE_URL}/suggest`, lastmod: today, changefreq: "weekly", priority: "0.7" },
        { loc: `${SITE_URL}/sherpas`, lastmod: today, changefreq: "weekly", priority: "0.7" },
        { loc: `${SITE_URL}/agencies`, lastmod: today, changefreq: "weekly", priority: "0.7" },
        { loc: `${SITE_URL}/guesthouses`, lastmod: today, changefreq: "weekly", priority: "0.7" },
        { loc: `${SITE_URL}/experiences`, lastmod: today, changefreq: "weekly", priority: "0.6" },
        { loc: `${SITE_URL}/tips`, lastmod: today, changefreq: "monthly", priority: "0.6" },
        { loc: `${SITE_URL}/ams`, lastmod: today, changefreq: "monthly", priority: "0.6" },
        { loc: `${SITE_URL}/about`, lastmod: today, changefreq: "monthly", priority: "0.5" },
        { loc: `${SITE_URL}/contact`, lastmod: today, changefreq: "monthly", priority: "0.5" },
        { loc: `${SITE_URL}/methodology`, lastmod: today, changefreq: "monthly", priority: "0.4" },
      ];
      return xmlResponse(urlsetXml(urls));
    }

    // ----- Routes (treks) — flagship priority + noindex filter -----
    if (section === "routes") {
      const { data: overrides } = await supabase
        .from("trek_overrides")
        .select("trek_id, is_flagship, noindex, updated_at");
      const overrideMap = new Map((overrides || []).map(o => [o.trek_id, o]));

      const urls: UrlEntry[] = [];
      for (const id of TREK_IDS) {
        const o = overrideMap.get(id);
        if (o?.noindex) continue; // skip noindex'd treks
        const isFlagship = o?.is_flagship === true;
        const lastmod = o?.updated_at?.split("T")[0] || today;
        urls.push({
          loc: `${SITE_URL}/trek/${id}`,
          lastmod,
          changefreq: isFlagship ? "weekly" : "monthly",
          priority: isFlagship ? "0.9" : "0.7",
        });
      }
      return xmlResponse(urlsetXml(urls));
    }

    // ----- Blog posts -----
    if (section === "blog") {
      const { data } = await supabase.from("blog_posts").select("slug, updated_at").eq("published", true);
      const urls: UrlEntry[] = (data || []).map(p => ({
        loc: `${SITE_URL}/blog/${p.slug}`,
        lastmod: p.updated_at?.split("T")[0] || today,
        changefreq: "monthly",
        priority: "0.6",
      }));
      return xmlResponse(urlsetXml(urls));
    }

    // ----- Sherpas -----
    if (section === "sherpas") {
      const { data } = await supabase.from("sherpa_listings").select("id, updated_at").eq("approved", true);
      const urls: UrlEntry[] = (data || []).map(s => ({
        loc: `${SITE_URL}/sherpa/${s.id}`,
        lastmod: s.updated_at?.split("T")[0] || today,
        changefreq: "monthly",
        priority: "0.5",
      }));
      return xmlResponse(urlsetXml(urls));
    }

    // ----- Agencies -----
    if (section === "agencies") {
      const { data } = await supabase.from("agency_listings").select("id, updated_at").eq("approved", true);
      const urls: UrlEntry[] = (data || []).map(a => ({
        loc: `${SITE_URL}/agency/${a.id}`,
        lastmod: a.updated_at?.split("T")[0] || today,
        changefreq: "monthly",
        priority: "0.5",
      }));
      return xmlResponse(urlsetXml(urls));
    }

    // ----- Guesthouses -----
    if (section === "guesthouses") {
      const { data } = await supabase.from("guesthouse_listings").select("id, updated_at").eq("approved", true);
      const urls: UrlEntry[] = (data || []).map(g => ({
        loc: `${SITE_URL}/guesthouse/${g.id}`,
        lastmod: g.updated_at?.split("T")[0] || today,
        changefreq: "monthly",
        priority: "0.5",
      }));
      return xmlResponse(urlsetXml(urls));
    }

    return new Response("Unknown section", { status: 404, headers: corsHeaders });
  } catch (error) {
    return new Response(`Error generating sitemap: ${(error as Error).message}`, { status: 500, headers: corsHeaders });
  }
});
