import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SITE_URL = "https://himalayantrails.aryanrungta.com";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Static trek data - IDs to generate URLs
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

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch blog posts
    const { data: blogPosts } = await supabase
      .from("blog_posts")
      .select("slug, updated_at")
      .eq("published", true);

    // Fetch approved sherpas
    const { data: sherpas } = await supabase
      .from("sherpa_listings")
      .select("id, updated_at")
      .eq("approved", true);

    // Fetch approved agencies
    const { data: agencies } = await supabase
      .from("agency_listings")
      .select("id, updated_at")
      .eq("approved", true);

    const today = new Date().toISOString().split("T")[0];

    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${SITE_URL}/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${SITE_URL}/routes</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>${SITE_URL}/experiences</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>${SITE_URL}/guides</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${SITE_URL}/blog</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>${SITE_URL}/guesthouses</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>${SITE_URL}/recommended</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`;

    // Trek pages
    for (const id of TREK_IDS) {
      xml += `
  <url>
    <loc>${SITE_URL}/trek/${id}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`;
    }

    // Blog posts
    if (blogPosts) {
      for (const post of blogPosts) {
        xml += `
  <url>
    <loc>${SITE_URL}/blog/${post.slug}</loc>
    <lastmod>${post.updated_at?.split("T")[0] || today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`;
      }
    }

    // Sherpa pages
    if (sherpas) {
      for (const s of sherpas) {
        xml += `
  <url>
    <loc>${SITE_URL}/sherpa/${s.id}</loc>
    <lastmod>${s.updated_at?.split("T")[0] || today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>`;
      }
    }

    // Agency pages
    if (agencies) {
      for (const a of agencies) {
        xml += `
  <url>
    <loc>${SITE_URL}/agency/${a.id}</loc>
    <lastmod>${a.updated_at?.split("T")[0] || today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>`;
      }
    }

    xml += `\n</urlset>`;

    return new Response(xml, {
      headers: {
        ...corsHeaders,
        "Content-Type": "application/xml",
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch (error) {
    return new Response(`Error generating sitemap: ${error.message}`, {
      status: 500,
      headers: corsHeaders,
    });
  }
});
