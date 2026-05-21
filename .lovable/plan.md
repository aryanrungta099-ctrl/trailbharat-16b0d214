## Goal
Extract the rewritten trek content from your Gemini AI Studio session file (`Rewriting_Himalayan_Treks`) and push all 264 trek rewrites into the `trek_overrides` table.

## Steps

1. **Parse the Gemini session JSON**
   - The file is an AI Studio export — rewritten content lives inside `chunkedPrompt.chunks[]` as `role: "model"` text chunks.
   - Write a script that walks all model chunks, concatenates the text, and extracts each `## Trek Name` block.

2. **Map trek names → trek IDs**
   - Load `src/data/treks.ts` + `src/data/additionalTreks.ts` to build a `name → id` lookup.
   - Fuzzy-match Gemini's H2 headings against trek names (handles minor punctuation/casing differences).
   - Log any unmatched headings so you can review.

3. **Bulk upsert via existing edge function**
   - Use the already-deployed `bulk-upsert-trek-override` function (auth via `LOVABLE_API_KEY` shared secret).
   - For each matched trek, POST `{ trek_id, content }` — the function updates `long_form_content` and sets `content_source = 'ai_generated'`.
   - Throttle ~5 requests/sec to avoid hammering the DB.

4. **Report results**
   - Print: total chunks parsed, treks matched, treks upserted, unmatched headings list.
   - Save unmatched list to `/mnt/documents/unmatched-treks.txt` if any.

## Technical details
- Script: `/tmp/import_gemini.ts` (run with `bun`)
- No schema changes, no new code in the app
- No UI changes — purely a data backfill
- Existing `bulk-upsert-trek-override` function and `trek_overrides` RLS are unchanged

## What you'll see after
- Trek detail pages will render the new editorial prose (since `long_form_content` overrides the default description)
- You can review/edit any trek in `/admin` as usual
