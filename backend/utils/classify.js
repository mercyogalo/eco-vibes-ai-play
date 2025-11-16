const axios = require("axios");

module.exports = async function classifyPolicy(text) {
  const apiKey = process.env.OPENROUTER_API_KEY;
  const res = await axios.post(
    "https://openrouter.ai/api/v1/chat/completions",
    {
      model: "meta-llama/llama-3-8b-instruct",
      messages: [
        { role: "system", content: "Classify environmental policies as positive or negative only. Reply strictly with 'positive' or 'negative'." },
        { role: "user", content: text }
      ]
    },
    { headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" } }
  );

  return res.data.choices[0].message.content.toLowerCase().trim();
};
