# Plan: Run the Groq Refill for Thin Trek Pages

Goal: refill long-form content for ~136 thin trek pages quickly and cheaply using Groq's Llama-3.1-8B-Instant, instead of (or before) Lovable AI Gemini Pro. Groq is ~20x faster and currently free-tier generous — perfect for bulk SEO refill.

You already have:
- `GROQ_API_KEY` secret set in the backend
- `generate-trek-content` edge function (uses Lovable AI Gemini Pro)
- `AiBatchPanel` admin UI that calls it in chunks of 3 with a "Force" mode

What's missing: a Groq code path and a UI toggle to pick it.

## Changes

### 1. `supabase/functions/generate-trek-content/index.ts`
Add a second provider branch:

- Accept `provider: "lovable" | "groq"` in the request body (default `"lovable"` so nothing else breaks).
- When `provider === "groq"`:
  - POST to `https://api.groq.com/openai/v1/chat/completions`
  - `Authorization: Bearer ${Deno.env.get("GROQ_API_KEY")}`
  - Default model `llama-3.1-8b-instant` (overridable via the existing `model` field)
  - Same `messages` array (system + PROMPT)
  - Same response shape (`choices[0].message.content`) — no parsing change needed
- Lower the per-trek sleep from 1200 ms → 300 ms for Groq (its rate limits are per-minute, not per-second).
- Keep the same `wordCount < 1500 → too_short` guard. 8B will sometimes underdeliver on 1800 words — those rows get re-tried later on Gemini Pro.

### 2. `src/components/AiBatchPanel.tsx`
- Add a small "Provider" segmented control: **Lovable AI (Gemini Pro)** | **Groq (Llama 8B — fast)**.
- Pass `provider` in the `supabase.functions.invoke` body.
- When Groq is selected, bump the chunk size from 3 → 8 (it's fast enough) and keep the existing parallelism.
- Surface `too_short_Xw` rows clearly so you can re-run them on Gemini Pro afterward.

### 3. Run order (what you actually click)
1. Open `/admin` → AI Batch panel.
2. Provider = **Groq**, leave Force off (skips flagships + already-written).
3. Click **Run 50** twice or **Run all pending** — should finish ~136 thin treks in 5–10 minutes.
4. Switch provider back to **Lovable AI (Gemini Pro)**, turn **Force** on, and re-run only the `too_short_*` failures so the weakest pages get a Pro pass.
5. Wait ~15 min, then resubmit the URL list in Google Search Console (Indexing → Sitemaps → re-submit, plus URL Inspection → Request indexing on 5–10 of the highest-priority refilled pages to seed re-crawl).

## Technical Notes

- Groq `llama-3.1-8b-instant` is OpenAI-compatible, same JSON shape as Lovable AI → minimal code branching.
- Free-tier limits at time of writing: ~30 req/min, ~14.4k tokens/min for 8B. The 300 ms delay + chunks of 8 stays comfortably under both.
- If you'd rather use Llama-3.3-70B-Versatile (better prose, still free, slower ~ 6k tok/min) just change the default `model` in the Groq branch — no other code change.
- Error handling: 429 from Groq → mark `rate_limited`, continue; 401 → bubble up so you know the key is wrong.
- Nothing changes about RLS, the admin check, or the `trek_overrides` insert — same writes, just a different upstream LLM.

## Out of scope
- Re-crawl automation (you'll do GSC manually).
- Per-trek prompt tuning for 8B (we keep the existing prompt; the word-count guard is the safety net).

Reply **approve** to implement, or tell me what to tweak (different model, different default chunk size, skip the UI toggle, etc.).