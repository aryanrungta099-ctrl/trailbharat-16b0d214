import { supabase } from "@/integrations/supabase/client";

const MODERATE_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/moderate-content`;

export async function moderateContent({
  table,
  recordId,
  textContent,
  imageUrls = [],
}: {
  table: string;
  recordId: string;
  textContent: string;
  imageUrls?: string[];
}): Promise<{ approved: boolean; reason: string }> {
  try {
    const resp = await fetch(MODERATE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
      },
      body: JSON.stringify({
        table,
        record_id: recordId,
        text_content: textContent,
        image_urls: imageUrls,
      }),
    });

    if (!resp.ok) {
      // On error, content stays for manual review
      return { approved: false, reason: "Queued for manual review" };
    }

    return await resp.json();
  } catch {
    return { approved: false, reason: "Moderation unavailable, queued for manual review" };
  }
}
