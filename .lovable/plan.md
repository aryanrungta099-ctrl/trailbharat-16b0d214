## Plan: Use both Google AI keys to continue filling treks

### What I'll do
1. Update `/tmp/fill_treks.ts` to read both `GOOGLE_AI_API_KEY` and `GOOGLE_AI_API_KEY_2` from env, and rotate between them per request (round-robin). When one hits a 429 quota error, the script keeps going on the other.
2. Re-query Supabase for treks still missing `itinerary_json` or `highlights` in `trek_overrides` (currently ~108).
3. Run the script against that list. With 2 keys × ~50 free reqs/day each = ~100 treks/day, so this should finish almost everything in one run today, with ~8 stragglers for tomorrow.
4. Report the final coverage numbers (remaining missing itineraries / highlights).

### Notes
- No app code or UI changes — this is purely a backfill script run.
- The existing `bulk-upsert-trek-override` edge function handles writes; no schema changes needed.
- If both keys hit quota mid-run, I'll stop cleanly and you can say "continue filling" tomorrow.
