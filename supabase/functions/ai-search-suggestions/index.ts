import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { query, type } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const currentMonth = new Date().toLocaleString("en", { month: "long" });

    let prompt: string;
    if (type === "trending") {
      prompt = `Generate exactly 8 trending SEO search queries for a Himalayan trekking platform. Current month: ${currentMonth}. 
Include seasonal suggestions, popular destinations, and trending topics.
Return ONLY a JSON array of strings, no explanation. Example: ["Best treks in ${currentMonth}", "..."]`;
    } else {
      prompt = `The user typed "${query}" in a trek search bar. Generate exactly 5 autocomplete suggestions that complete or relate to their query. Focus on SEO-friendly, specific trek searches.
Return ONLY a JSON array of strings, no explanation.`;
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash-lite",
        messages: [
          { role: "system", content: "You are a search suggestion engine for a Himalayan trekking website. Return ONLY valid JSON arrays of search query strings. No markdown, no explanation." },
          { role: "user", content: prompt },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "return_suggestions",
              description: "Return search suggestions",
              parameters: {
                type: "object",
                properties: {
                  suggestions: {
                    type: "array",
                    items: { type: "string" },
                    description: "Array of search suggestion strings"
                  }
                },
                required: ["suggestions"],
                additionalProperties: false
              }
            }
          }
        ],
        tool_choice: { type: "function", function: { name: "return_suggestions" } },
      }),
    });

    if (!response.ok) {
      const status = response.status;
      if (status === 429 || status === 402) {
        return new Response(JSON.stringify({ suggestions: [] }), { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }
      return new Response(JSON.stringify({ suggestions: [] }), { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const data = await response.json();
    let suggestions: string[] = [];
    
    try {
      const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
      if (toolCall) {
        const args = JSON.parse(toolCall.function.arguments);
        suggestions = args.suggestions || [];
      } else {
        const content = data.choices?.[0]?.message?.content || "";
        const match = content.match(/\[[\s\S]*\]/);
        if (match) suggestions = JSON.parse(match[0]);
      }
    } catch {
      suggestions = [];
    }

    return new Response(JSON.stringify({ suggestions }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("ai-search error:", e);
    return new Response(JSON.stringify({ suggestions: [] }), {
      status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
