const axios = require("axios");


module.exports = async function summarizePolicy(text, classification) {
  const apiKey = process.env.GEMINI_API_KEY; 
  text = text.trim();

  let guidance = "";
  if (classification?.toUpperCase() === "NEGATIVE") {
    guidance = `
Consider the following to judge content if it's negative:
- What happened?
- Why does it matter?
- Who is responsible?
- Why is this important
- How can young people take action to help
Prioritize government regulatory changes, legal enforcement actions, land or policy controversies (e.g., land grabbing, illegal dumping), and updates to laws or guidelines.
Make the summary very detailed and well explained
    `;
  } else if (classification?.toUpperCase() === "POSITIVE") {
    guidance = `
Consider the following to judge content if it's positive:
- What happened?
- Why does it matter?
- What value does it add?
- Why is this important
Highlight government regulation improvements, successful enforcement actions, and positive policy updates.
Make the summary very detailed and well explained
    `;
  }

  try {
    const res = await axios.post(
      "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions",
      {
       
        model: "gemini-2.5-flash", 
        messages: [
          {
            role: "system",
            content: `
You are an expert in environmental policies and government regulations.
Your task is to summarize the content of a web page, focusing on **policy changes, regulatory updates, enforcement actions, and controversies**.
You must output **strictly valid JSON** with the following structure:

{
  "title": "<a short, attention-grabbing heading>",
  "summary": "<concise professional summary highlighting the key points>"
}

Do NOT include any text outside the JSON.
Do NOT add explanations, introductions, or any extra commentary.
Use the following guidance for classification:

${guidance}
            `
          },
          { role: "user", content: text }
        ]
      },
      { 
        headers: { 
          Authorization: `Bearer ${apiKey}`, 
          "Content-Type": "application/json" 
        } 
      }
    );

    let output = res.data.choices[0].message.content || "";

   
    let json = null;
    try {
      json = JSON.parse(output);
    } catch {
      const match = output.match(/\{[\s\S]*\}/);
      if (match) {
        try {
          json = JSON.parse(match[0]);
        } catch {
          json = null;
        }
      }
    }

    if (json) {
      json.title = (json.title || "").replace(/\*\*/g, "").trim();
      json.summary = (json.summary || "").replace(/\*\*/g, "").trim();
      return json;
    } else {
      console.warn("Summarization failed: invalid JSON returned by AI");
      return { title: "Environmental Policy Update", summary: text.slice(0, 200).trim() };
    }
  } catch (err) {
    console.warn("Summarization failed:", err.message);
    return { title: "Environmental Policy Update", summary: text.slice(0, 200).trim() };
  }
};