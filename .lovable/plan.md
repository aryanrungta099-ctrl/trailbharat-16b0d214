# Fill missing trek content without Lovable AI credits

The blocker is the exhausted Lovable AI balance (HTTP 402). Below are the realistic ways to finish the fill, ranked by effort vs. quality.

## Option A (recommended) — Use a free Google AI Studio API key

Google gives a generous free tier on `gemini-2.5-flash` (15 req/min, 1500 req/day) — more than enough to generate all 128 itineraries + 123 highlights in one run, at zero cost.

**Steps:**
1. You create a free key at https://aistudio.google.com/apikey (takes ~30 seconds, no card required).
2. You add it as a project secret named `GOOGLE_AI_API_KEY`.
3. I update the sandbox fill script to call Google's API directly (same Gemini model, just a different endpoint) instead of the Lovable AI gateway.
4. Run the script — fills all missing itineraries + highlights in ~15–20 minutes.
5. Once done, the secret can be deleted; it isn't used by the app itself.

**Pros:** Free, same model quality as before, fully automated, finishes today.
**Cons:** You handle one external key for the duration of the fill.

## Option B — Scrape with Firecrawl (already connected)

Firecrawl is already enabled in this project. I can write a script that, for each missing trek, queries Firecrawl to scrape the top result on its name (e.g., Wikipedia, tourism boards) and extracts itinerary/highlights via regex + heuristics.

**Pros:** No extra keys; uses an already-connected service.
**Cons:** Itinerary structure is inconsistent across sources — many treks won't have a clean day-by-day breakdown online, so quality will be uneven and many will end up partially filled. Also costs Firecrawl credits per scrape.

## Option C — Hand-write content (no automation)

I write itineraries and highlights manually as a migration. Realistic for 5–10 well-known treks (Annapurna Base Camp, EBC, etc.), not all 123.

**Pros:** Free, perfectly tailored.
**Cons:** Not feasible at scale.

## Option D — Do nothing (current state)

The frontend already falls back to the base trek data in `src/data/treks.ts` when overrides are empty, so pages still render with a reasonable itinerary and highlights — just less rich than the AI-enriched version.

## Recommendation

Go with **Option A**. Tell me when the `GOOGLE_AI_API_KEY` secret is added and I'll kick off the fill.