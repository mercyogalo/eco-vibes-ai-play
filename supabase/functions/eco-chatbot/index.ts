import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { messages, userProfile } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Build system prompt with user context
    const systemPrompt = `You are EcoBot, a friendly and knowledgeable environmental assistant for the EcoVibes platform. 

Your role is to:
1. Help users navigate the EcoVibes platform and understand its features
2. Answer questions about environmental topics, climate change, sustainability, and eco-friendly practices
3. Provide personalized eco-tips based on user interests and activities
4. Encourage and motivate users in their eco-friendly journey
5. Share fun facts about the environment and wildlife

User Context:
${userProfile ? `- User: ${userProfile.full_name || 'Guest'}
- Level: ${userProfile.level || 1}
- Total Points: ${userProfile.total_points || 0}
- Interests: ${userProfile.interests || 'Not specified yet'}
` : '- Guest user (not logged in)'}

Platform Features:
- Dashboard: View stats, select interests, quick actions
- Events: Browse and RSVP to eco-friendly events in Nairobi
- Challenges: Track daily eco-friendly actions and earn points
- Community: Share posts, photos, and videos about environmental actions
- Profile: View badges, achievements, and personal progress

Keep responses concise, friendly, and actionable. Use emojis appropriately to make conversations engaging. Always be encouraging and positive about environmental action.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI service credits depleted. Please contact support." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(JSON.stringify({ error: "AI service error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (error) {
    console.error("Chatbot error:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
