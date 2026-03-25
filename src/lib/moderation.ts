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
    // Get the current user's session token for authenticated calls
    const { data: { session } } = await supabase.auth.getSession();
    const token = session?.access_token;
    if (!token) {
      return { approved: false, reason: "Not authenticated, queued for manual review" };
    }

    const resp = await fetch(MODERATE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        table,
        record_id: recordId,
        text_content: textContent,
        image_urls: imageUrls,
      }),
    });

    if (!resp.ok) {
      return { approved: false, reason: "Queued for manual review" };
    }

    return await resp.json();
  } catch {
    return { approved: false, reason: "Moderation unavailable, queued for manual review" };
  }
}
