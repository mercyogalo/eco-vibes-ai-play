const axios = require("axios");


const IGNORE_PHRASES = [
  "what is the national environment management authority",
  "about nema",
  "contact us",
  "get in touch",
  "hq contacts",
  "field offices",
  "vision",
  "mission",
  "mandate",
  "functions",
  "about kenya law",
  "introduction to the law",
  "caselaw overview",
  "guidelines",
  "practice notes",
  "latest news",
  "environment news",
  "read more",
  "article",
  "environment section",
  "news updates",
  "about us"
];

module.exports = async function classifyPolicy(text) {
  const lowerText = text.toLowerCase();

 
  for (const phrase of IGNORE_PHRASES) {
    if (lowerText.includes(phrase)) return "UNKNOWN";
  }

 
  try {
    const apiKey = process.env.OPENROUTER_API_KEY;
    const res = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "meta-llama/llama-3-8b-instruct",
        messages: [
          { role: "system", content: "Classify environmental policies as positive or negative only. Reply strictly with 'positive' or 'negative'. Return a one word response either positive or negative" },
          { role: "user", content: text }
        ]
      },
      { headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" } }
    );

    const classification = res.data.choices[0].message.content.toLowerCase().trim();
    if (["positive", "negative"].includes(classification)) return classification;
    return "UNKNOWN";
  } catch (err) {
    console.error("CLASSIFY ERROR:", err.message);
    return "UNKNOWN";
  }
};
