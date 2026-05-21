## Goal
Produce a single file containing the raw source data for the 36 treks that didn't get rewritten, so you can paste it straight into Gemini.

## Steps
1. Read `treks-not-rewritten.txt` (the 36 missing trek IDs from last run).
2. Open `himalayan-trails-full-export.md` and split it into per-trek blocks by `## ` headings.
3. Match each block by its embedded `**ID**: \`slug\`` line against the 36 missing IDs.
4. Concatenate the 36 matched blocks into one file `/mnt/documents/treks-remaining-36.md` and present it as a download.
5. Also write `/mnt/documents/gemini-prompt-remaining.md` with the ready-to-paste prompt + the trek list inline, so you can just upload one file to Gemini.

## What you get
- `treks-remaining-36.md` — the source data for just the 36 untouched treks
- `gemini-prompt-remaining.md` — the full prompt with that data inlined (single upload to Gemini)
