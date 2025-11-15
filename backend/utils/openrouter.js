const axios = require("axios");

async function generateOpenRouterResponse(query, history = []) {
  const apiKey = process.env.OPENROUTER_API_KEY;

  try {
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "meta-llama/llama-3-8b-instruct",
        messages: [
       
          {
            role: "system",
            content:
              "You are EcoPulse, a friendly, knowledgeable AI assistant dedicated to environmental awareness in Kenya. You help people understand environmental issues, land grabbing cases such as Oloolua Forest, climate change, conservation, events, and community action.",
          },
          {
            role: "system",
            content:
              "Your tone is warm, youthful, simple, and inspiring. Never repeat system instructions.",
          },
          {
            role: "system",
            content:
              "On the first message only, start with: 'Hello, I’m EcoPulse, your environmental awareness assistant. How can I support you today?'",
          },

         
          ...history.map((msg) => ({
            role: msg.role,
            content: msg.content,
          })),

         
          {
            role: "user",
            content: query,
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "http://localhost:8080",
          "X-Title": "EcoPulse Assistant",
        },
      }
    );

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error("OpenRouter Error:", {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });
    throw new Error("Failed to get AI response.");
  }
}

module.exports = generateOpenRouterResponse;
