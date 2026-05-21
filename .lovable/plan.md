## Goal
You uploaded the Gemini AI Studio session (`Standardizing_Trek_Descriptions`) containing the rewritten content for all 36 remaining treks. Extract the trek blocks and import them into `trek_overrides` via the existing `bulk-upsert-trek-override` edge function.

## What's in the upload
The JSON has 52 chunks. The 6 model chunks that contain trek content are indices 5, 12, 21, 40, 48, 51 — concatenated they contain `## Trek Name` + `**ID**: \`slug\`` blocks for all 36 treks (Agasthyarkoodam → Rumtse to Tsomoriri).

## Steps
1. Parse `/tmp/gemini.json`, concatenate the 6 model text chunks, write `/mnt/documents/treks-rewritten-36.md` for your records.
2. Split into per-trek blocks on `^## ` and extract the `slug` from each `**ID**: \`slug\`` line. Confirm count = 36 and matches `treks-not-rewritten.txt`.
3. For each block, call the existing `bulk-upsert-trek-override` edge function with `{ trek_id: slug, content: <full markdown block> }` using `LOVABLE_API_KEY` as `x-bulk-secret`. This sets `long_form_content` and marks `content_source = 'ai_generated'`.
4. Report any slugs that failed or weren't found.

## No code/schema changes
Reuses the existing edge function and table. Nothing in `src/` or `supabase/` is modified.

Switch to build mode to run this.
