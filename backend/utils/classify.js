const axios = require("axios");


module.exports = async function classifyPolicy(text, url) {
   try {
   
      const apiKey = process.env.GEMINI_API_KEY; 

      
      const res = await axios.post(
         "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions",
         {
           
            model: "gemini-2.5-flash", 
            messages: [
               {
                  role: "system",
                  content: `
You are an AI that analyzes web content for environmental policies and government regulations. 
Your task is to determine:
1. Whether this page has meaningful content about environmental policies or recent government regulatory changes (new laws, rules, enforcement actions, or controversial cases).
2. If it does, classify it as 'positive' or 'negative'.
3. If it is mostly boilerplate, navigation, generic text, or lacks actionable information, classify as 'BOILERPLATE'.

Answer strictly with one word: 'positive', 'negative', or 'BOILERPLATE'.

Consider the following to judge content if it is negative:
- What happened?
- Why does it matter?
- Who is responsible?
- Why is this important
- How can young people take action to help

Consider the following to judge content if it is positive:
- What happened?
- Why does it matter?
- What value does it add?
- Why is this important

Always prioritize content related to:
- Government regulatory changes
- Legal enforcement actions
- Land, environmental, or policy controversies (e.g., land grabbing, illegal dumping)
- Updates to existing laws or guidelines
                  `
               },
               { role: "user", content: text }
            ]
         },
         { headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" } }
      );

      const classification = res.data.choices[0].message.content.trim().toUpperCase();

      if (["POSITIVE", "NEGATIVE", "BOILERPLATE"].includes(classification)) return classification;
      return "BOILERPLATE";

   } catch (err) {
      console.error("CLASSIFY ERROR:", err.message, "URL:", url);
      return "BOILERPLATE";
   }
};