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
          content: `
You are an expert in environmental policies.
Produce a concise, clear, professional explanation of the policy content.
Make the heading attention-grabbing and controversial to highlight the issue.
Do not include audience-specific phrases like 'for Gen Z' in the heading.
Reply strictly in JSON format with keys: "title" and "summary".
Example: { "title": "Illegal Dumping Sparks Government Probe", "summary": "Text of summary..." }
          `
        },
        { role: "user", content: text }
      ]
    },
    { headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" } }
  );

  let output = res.data.choices[0].message.content || "";

  try {
    const json = JSON.parse(output);
    json.title = json.title.replace(/\*\*/g, "").trim();
    json.summary = json.summary.replace(/\*\*/g, "").trim();
    return json;
  } catch {
    return { title: "Environmental Policy Update", summary: text.slice(0, 200).trim() };
  }
};
