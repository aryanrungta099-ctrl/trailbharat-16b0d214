import { Helmet } from "react-helmet-async";

const SITE_URL = "https://himalayantrails.aryanrungta.com";
const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1585409677983-0f6c41ca9c3b?w=1200&h=630&fit=crop";
const SITE_NAME = "Himalayan Trails";

// Strip tracking params from canonical URLs
const TRACKING_PARAMS = ["utm_source","utm_medium","utm_campaign","utm_term","utm_content","gclid","fbclid","mc_cid","mc_eid","ref","source"];
const cleanCanonicalPath = (path: string): string => {
  const [base, query] = path.split("?");
  if (!query) return base.replace(/\/$/, "") || "/";
  const params = new URLSearchParams(query);
  TRACKING_PARAMS.forEach(p => params.delete(p));
  const remaining = params.toString();
  const clean = remaining ? `${base}?${remaining}` : base;
  return clean.replace(/\/$/, "") || "/";
};

interface SEOHeadProps {
  title: string;
  description: string;
  path?: string;
  image?: string;
  type?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
  tags?: string[];
  jsonLd?: Record<string, any> | Record<string, any>[];
  noIndex?: boolean;
}

const SEOHead = ({
  title,
  description,
  path = "",
  image = DEFAULT_IMAGE,
  type = "website",
  publishedTime,
  modifiedTime,
  tags,
  jsonLd,
  noIndex = false,
}: SEOHeadProps) => {
  const fullTitle = path === "/" || path === "" ? `${SITE_NAME} — Find Your Trek` : `${title} — ${SITE_NAME}`;
  const canonical = `${SITE_URL}${cleanCanonicalPath(path)}`;
  const safeDesc = description.length > 160 ? description.slice(0, 157) + "..." : description;

  const jsonLdArray = jsonLd ? (Array.isArray(jsonLd) ? jsonLd : [jsonLd]) : [];

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={safeDesc} />
      <meta name="robots" content={noIndex ? "noindex, nofollow" : "index, follow"} />
      <link rel="canonical" href={canonical} />

      {/* Open Graph */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={safeDesc} />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content={SITE_NAME} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={safeDesc} />
      <meta name="twitter:image" content={image} />

      {/* Article-specific */}
      {publishedTime && <meta property="article:published_time" content={publishedTime} />}
      {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}
      {tags?.map(tag => <meta key={tag} property="article:tag" content={tag} />)}

      {/* JSON-LD */}
      {jsonLdArray.map((schema, i) => (
        <script key={i} type="application/ld+json">{JSON.stringify(schema)}</script>
      ))}
    </Helmet>
  );
};

export default SEOHead;

// Reusable JSON-LD generators
export const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: SITE_NAME,
  url: SITE_URL,
  description: "Your complete guide to trekking across India & Nepal — routes, safety tips, and real stories from the trail.",
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${SITE_URL}/routes?q={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
};

export const breadcrumbSchema = (items: { name: string; url: string }[]) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map((item, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: item.name,
    item: `${SITE_URL}${item.url}`,
  })),
});

export const articleSchema = (post: {
  title: string;
  excerpt: string;
  coverImage?: string | null;
  createdAt: string;
  updatedAt: string;
  slug: string;
}) => ({
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  headline: post.title,
  description: post.excerpt,
  image: post.coverImage || DEFAULT_IMAGE,
  datePublished: post.createdAt,
  dateModified: post.updatedAt,
  url: `${SITE_URL}/blog/${post.slug}`,
  publisher: {
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
  },
  mainEntityOfPage: {
    "@type": "WebPage",
    "@id": `${SITE_URL}/blog/${post.slug}`,
  },
});

export const trekSchema = (trek: {
  name: string;
  description: string;
  id: string;
  region: string;
  state: string;
  country: string;
  durationDays: number;
  altitudeMeters: number;
  difficulty: string;
  highlights?: string[];
  itinerary?: { day: number | string; description?: string; title?: string }[];
  image?: string;
}) => ({
  "@context": "https://schema.org",
  "@type": "TouristTrip",
  name: trek.name,
  description: trek.description,
  url: `${SITE_URL}/trek/${trek.id}`,
  touristType: ["Hikers", "Adventure travelers", "Trekkers"],
  ...(trek.image && { image: trek.image }),
  ...(trek.highlights && trek.highlights.length > 0 && {
    additionalProperty: trek.highlights.map(h => ({ "@type": "PropertyValue", name: "Highlight", value: h })),
  }),
  itinerary: {
    "@type": "ItemList",
    numberOfItems: trek.itinerary?.length || trek.durationDays,
    itemListElement: (trek.itinerary || []).map((d, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "TouristAttraction",
        name: d.title || `Day ${d.day}`,
        description: d.description || `Day ${d.day} of the ${trek.name} trek`,
      },
    })),
  },
  provider: {
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
  },
});

export const localBusinessSchema = (b: {
  type: "TravelAgency" | "LocalBusiness" | "Lodging";
  name: string;
  description: string;
  image?: string | null;
  telephone?: string;
  url: string;
  region?: string;
  ratingValue?: number;
  ratingCount?: number;
}) => ({
  "@context": "https://schema.org",
  "@type": b.type,
  name: b.name,
  description: b.description,
  url: b.url,
  ...(b.image && { image: b.image }),
  ...(b.telephone && { telephone: b.telephone }),
  ...(b.region && { areaServed: b.region }),
  ...(b.ratingValue && b.ratingCount && {
    aggregateRating: { "@type": "AggregateRating", ratingValue: b.ratingValue.toFixed(1), reviewCount: b.ratingCount },
  }),
});

export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE_NAME,
  url: SITE_URL,
  logo: `${SITE_URL}/favicon.ico`,
  description: "Trekking guides and route data for India and Nepal.",
};

