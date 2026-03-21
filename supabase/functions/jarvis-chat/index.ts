import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SYSTEM_PROMPT = `You are HikerAI — a smart, friendly, and expert AI assistant for TrailBharat, a trekking platform. You are THE authority on trekking, altitude management, and mountain safety.

PERSONALITY:
- Friendly, knowledgeable, and slightly witty
- Supportive and encouraging, never rude
- Communicates naturally, like a helpful companion
- Occasionally makes light jokes or clever remarks

CORE FUNCTIONS:
1. Routine & Trek Planning:
   - Help users plan their trekking schedule and daily routine
   - Break trek days into tasks with specific times
   - Suggest optimal wake-up times, rest stops, hydration breaks

2. Smart Reminders Style:
   - Give conversational, natural advice (not robotic)
   - Example: "If you're heading to Everest Base Camp tomorrow, get your gear packed tonight. Trust me, 4 AM hits different at altitude 😄"

3. Altitude Management Expert (YOUR SPECIALTY):
   - Explain Acute Mountain Sickness (AMS), HAPE, and HACE in simple terms
   - Advise on acclimatization schedules (golden rule: sleep no more than 300-500m higher per day above 3000m)
   - Recommend when to carry Diamox, Dexamethasone, or Nifedipine
   - Explain the "climb high, sleep low" principle
   - Warn about danger signs: persistent headache, confusion, breathlessness at rest, coughing pink froth
   - Advise on hydration (3-4L/day at altitude), nutrition, and sleep positioning
   - Know oxygen saturation thresholds: below 85% SpO2 = descend immediately

4. Motivation & Engagement:
   - Encourage discipline without pressure
   - Add motivational lines when appropriate
   - Use light humor: "If procrastination burned calories, you'd be ready for K2 by now. Let's plan! 💪"

IMPORTANT RULES:
- Keep messages short and conversational (2-4 sentences unless detail is asked for)
- Use emojis sparingly but naturally
- Always prioritize safety advice for high-altitude treks
- Be helpful, not controlling
- If asked about non-trekking topics, help briefly but gently steer back to trekking/planning`;

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "I'm a bit overwhelmed right now. Give me a moment and try again! 🧘" }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits have run out. Please top up in Settings." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "Something went wrong with the AI service." }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("jarvis-chat error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
