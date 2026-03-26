import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SITE_URL = "https://himalayantrails.aryanrungta.com";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Static trek data - IDs to generate URLs
const TREK_IDS = [
  "kedarkantha","roopkund","valley-of-flowers","har-ki-dun","kuari-pass","brahmatal",
  "rupin-pass","chopta-tungnath","nag-tibba","dayara-bugyal","deoriatal-chandrashila",
  "phulara-ridge","pangarchulla","auden-col","kalindi-khal","pindari-glacier","milam-glacier",
  "kafni-glacier","hampta-pass","bhrigu-lake","beas-kund","chandrakhani-pass","sar-pass",
  "pin-parvati","deo-tibba","friendship-peak","triund","indrahar-pass","kareri-lake",
  "prashar-lake","chadar-trek","markha-valley","stok-kangri","snow-leopard-trek","lamayuru-darcha",
  "nubra-valley","goecha-la","sandakphu","dzongri","singalila-ridge","kanchenjunga-base",
  "barsey-rhododendron","everest-base-camp","annapurna-circuit","langtang-valley","manaslu-circuit",
  "poon-hill","mardi-himal","annapurna-base-camp","upper-mustang","gokyo-lakes",
  "three-passes","kanchenjunga-circuit","tilicho-lake","pikey-peak","mohare-danda",
  "khopra-danda","helambu","gosaikunda","makalu-base-camp","dolpo","rara-lake",
  "tsum-valley","ganesh-himal","ruby-valley","panch-pokhari","ama-dablam-base",
  "island-peak","mera-peak","lobuche-peak","tent-peak","chulu-west",
  "kudremukh","kumara-parvatha","tadiandamol","brahmagiri","kodachadri",
  "mullayanagiri","chembra-peak","agasthyakoodam","meesapulimala","nilgiri-peak",
  "rajmachi","kalsubai","harishchandragad","ratangad","torna-rajgad",
  "sandhan-valley","naneghat","visapur","lohagad","sinhagad",
  "bali-pass","kedartal","satopanth","borasu-pass","sarutal",
  "kedarnath-trek","tungnath-deoriatal","ali-bedni-bugyal","roopkund-ronti",
  "hemkund-sahib","nanda-devi-east-base","sunderdhunga","kafni-sunderdhunga",
  "kumaon-glaciers","munsiyari-milam","khaliya-top","panchachuli-base",
  "dzukou-valley","japfu-peak","phawngpui","david-scott-trail","living-root-bridges",
  "meghalaya-caves","manipur-hills","nagaland-highlands","mizoram-trails","arunachal-passes",
  "coorg-trails","wayanad-chembra","munnar-peaks","ponmudi","valparai",
  "yelagiri","javadi-hills","kolli-hills","meghamalai","palani-hills",
  "pushpagiri","bandaje-falls","netravati","ombattu-gudda","ballalarayana",
  "thadiyandamol","narasimha-parvatha","skandagiri","savandurga","uttari-betta",
  "kunti-betta","makalidurga","anthargange","channagiri","kabbaladurga",
  "nandi-hills","madhugiri","devarayanadurga","shivagange","avalabetta",
  "ranganathaswamy","horsley-hills","tirumala","nallamala","araku-valley",
  "lambasingi","gandikota","belum-caves","yercaud","kotagiri",
  "doddabetta","nilgiri-biosphere","anamalai","topslip","parambikulam",
  "eravikulam","grass-hills","silent-valley","attappadi","nelliampathi",
  "vagamon","ilaveezha-poonchira","thusharagiri","chembra-wayanad","banasura",
  "pakshipathalam","tholpetty","kuruva-island","edakkal","sulthan-bathery",
  "tarsar-marsar","great-lakes-kashmir","kolahoi-glacier","thajiwas","tulian-lake",
  "bangus-valley","gurez-valley","warwan-pass","sinthan-top","mughal-road",
  "aharbal","yousmarg","doodhpathri","sonamarg-thajiwas","naranag-mahadev",
  "frozen-river-zanskar","padum-darcha","phugtal","zanskar-valley","shingo-la",
  "umlingla","hanle","tso-moriri","pangong","khardungla",
  "hemis","rumbak","sham-valley","likir-tingmosgang","spituk-stok",
  "miyar-valley","bara-shigri","spiti-valley","pin-valley","ki-kibber",
  "tabo-dhankar","langza-hikkim","chandratal","hamta-chandratal","rohtang",
  "solang","gulaba","naggar","tirthan","jalori",
  "serolsar","raghupur","lambri","shoja","tirthan-valley",
  "billing","barot","rajgundha","parashar-lake","churdhar",
  "hatu-peak","narkanda","shimla-ridge","jakhu","kufri",
  "chail","dainkund","kalatop","khajjiar","mcleodganj",
  "dharamkot","naddi","kareri-lake-dharamshala","guna-devi","bhagsunag"
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
