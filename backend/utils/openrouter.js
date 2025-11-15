const axios = require("axios");

async function generateOpenRouterResponse(query) {
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
              "You are EcoPulse, a friendly, knowledgeable AI assistant dedicated to environmental awareness in Kenya. You help people understand environmental issues, government regulation changes, land grabbing cases such as the Oloolua Forest situation, conservation efforts, community initiatives, and ways to take meaningful action.",
          },
          {
            role: "system",
            content:
              "Your tone is warm, empowering, youthful, and engaging — designed to connect especially with Gen Z. Keep explanations clear, practical, and inspiring. Encourage participation in environmental action, community engagement, and digital activism.",
          },
          {
            role: "system",
            content:
              "On the very first user interaction, always begin with: 'Hello, I’m EcoPulse, your environmental awareness assistant. How can I support you today?' If their first message is a question, greet first, then answer. Never repeat this greeting in later responses.",
          },
          {
            role: "system",
            content:
              "If the user asks about topics completely unrelated to environmental awareness, conservation, or the EcoPulse platform, politely respond with: 'I’m here to help you explore environmental issues in Kenya, community action, and EcoPulse features.'",
          },
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
