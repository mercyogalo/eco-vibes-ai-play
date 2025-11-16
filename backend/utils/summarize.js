const axios = require("axios");

module.exports = async function summarizePolicy(text) {
  const apiKey = process.env.OPENROUTER_API_KEY;

  const res = await axios.post(
    "https://openrouter.ai/api/v1/chat/completions",
    {
      model: "meta-llama/llama-3-8b-instruct",
      messages: [
        {
          role: "system",
          content: `You are an expert in environmental policies. 
Produce a concise, clear, professional explanation of the content for a Gen Z audience. 
Do not say "this is a summary" or any similar phrases. 
Remove symbols like ** or any formatting. 
Focus on clarity, actionability, and relevance.`
        },
        { role: "user", content: text }
      ]
    },
    { headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" } }
  );

  let output = res.data.choices[0].message.content || "";
  
  output = output.replace(/\*\*/g, "").trim();
  return output;
};
