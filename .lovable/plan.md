# Why your pages aren't indexing

I traced the root cause and it's a real bug, not a Google patience issue.

## The bug

Your `robots.txt` points Google at `https://himalayantrails.aryanrungta.com/sitemap.xml`. That file is a **sitemap index** that delegates to 6 sub-sitemaps (static, routes, blog, sherpas, agencies, guesthouses) — that's where all your trek URLs actually live.

Currently those sub-sitemap URLs are emitted as:

```
http://otzzgoelrtpdwkhvkntk.supabase.co/generate-sitemap?section=routes
```

Two problems on every one of them:
1. `http://` instead of `https://`
2. Missing `/functions/v1/` path prefix

Result: **every sub-sitemap URL returns 404**. I just verified it:

```
curl -I "http://otzzgoelrtpdwkhvkntk.supabase.co/generate-sitemap?section=routes"
HTTP/1.1 404 Not Found
```

So Google fetches your sitemap index, follows the links, gets 404 on all 6, and never discovers a single trek, blog post, sherpa, agency, or guesthouse URL. Only the homepage gets crawled (which is why only the homepage is indexed).

## The cause in code

`supabase/functions/generate-sitemap/index.ts` line 92:

```ts
const base = `${url.origin}${url.pathname}`;
```

When Supabase's edge runtime invokes this function internally, `url.origin` resolves to the internal hostname (http, no `/functions/v1/`), not the public one. That bad value is then baked into the sitemap index.

## Fix

Replace the dynamic `base` with a hard-coded public URL of the edge function:

```ts
const base = "https://otzzgoelrtpdwkhvkntk.supabase.co/functions/v1/generate-sitemap";
```

One-line change. Edge function redeploys automatically. After that, every sub-sitemap URL in the index resolves with HTTP 200 and Google can discover all 180+ trek pages, blog posts, sherpas, agencies, and guesthouses.

## After the fix

1. Open Google Search Console → **Sitemaps** → re-submit `https://himalayantrails.aryanrungta.com/sitemap.xml`. It should report "Success" with discovered URLs instead of 0.
2. Use **URL Inspection** on a couple of trek pages (e.g. `/routes/everest-base-camp`) and click "Request indexing" to speed up the first crawl.
3. Indexing of all pages typically takes 1–4 weeks after this; GSC's Pages report will show the progress.

## Secondary notes (not blocking, just FYI)

- Your site is a client-rendered SPA. Googlebot does execute JS so this is fine, but social crawlers (LinkedIn, Slack, FB) only ever see the static `index.html` head — every shared trek link will preview as the homepage. Fixing that needs SSR/prerender and is a much bigger project; flag if you want me to plan it separately.
- `robots.txt` and on-page SEO (titles, descriptions, canonical, JSON-LD) all look correct. The only thing blocking indexing is the broken sitemap.

Want me to apply the fix?
