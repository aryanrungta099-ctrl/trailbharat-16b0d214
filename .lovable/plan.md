## Switch filler script to Groq

You created a Groq API key, not a Google one. Groq's free tier gives ~14,400 requests/day on `llama-3.3-70b-versatile` — far more than the 53 remaining treks need, and it's very fast (~2 min total).

### Steps

1. **Add `GROQ_API_KEY` as a secret** in the project so the script can read it.
2. **Create a Groq variant of the filler script** (`scripts/fill-treks-groq.ts`) that:
   - Reads `GROQ_API_KEY` from env
   - Calls `https://api.groq.com/openai/v1/chat/completions` (OpenAI-compatible)
   - Uses model `llama-3.3-70b-versatile`
   - Keeps the same prompt, JSON schema, and Supabase update logic as the existing Gemini filler
   - Queries Supabase for treks still missing content and processes them sequentially with a small delay
3. **Run it once** via `code--exec` to finish the remaining ~53 treks.
4. **Verify** by re-querying the DB for any treks still missing fields and spot-checking one trek page in the preview.

### Notes
- No app/UI code changes — this is a one-off backfill script.
- Existing Google keys stay configured; we just stop relying on them for this batch.
- If Groq rate-limits (unlikely at this volume), the script will back off and retry.

Ready to proceed? I'll request the `GROQ_API_KEY` secret first.