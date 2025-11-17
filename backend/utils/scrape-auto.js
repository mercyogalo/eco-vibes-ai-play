const scrape = require("./scraper");
const classifyPolicy = require("./classify");
const summarizePolicy = require("./summarize");
const generateVideo = require("./generateVideo");
const readFile = require("./readFile");
const Policy = require("../models/policy");
const axios = require("axios");
const cheerio = require("cheerio");

// Boilerplate phrases to skip
const boilerplate = [
  "national environment management authority",
  "nema is responsible",
  "kenya forest service",
  "kenya law",
  "standard media",
  "nation media"
];

// Function to check if content is boilerplate
function isBoilerplate(text) {
  const lower = text.toLowerCase();
  return boilerplate.some(bp => lower.includes(bp));
}

module.exports = async function runScraper() {
  try {
    const scrapedList = await scrape();
    const newPolicies = [];

    for (const p of scrapedList) {
      // Skip duplicates
      const exists = await Policy.findOne({ link: p.link });
      if (exists) continue;

      let text = "";
      let date = p.date || null;

      // Fetch full content (PDF, DOCX, or HTML)
      try {
        if (p.link.endsWith(".pdf") || p.link.endsWith(".docx") || p.link.endsWith(".doc")) {
          text = await readFile(p.link);
        } else {
          const html = await axios.get(p.link).then(r => r.data);
          const $ = cheerio.load(html);
          text = $("body").text().replace(/\s+/g, " ").trim();
        }
      } catch (err) {
        console.warn("Failed to fetch content, skipping:", p.link, err.message);
        continue;
      }

      // Skip boilerplate content
      if (isBoilerplate(text)) {
        console.log("Skipped boilerplate content:", p.link);
        continue;
      }

      // Classify policy (positive/negative)
      let status = "UNKNOWN";
      try {
        status = await classifyPolicy(text);
        if (!["positive", "negative", "UNKNOWN"].includes(status.toLowerCase())) {
          status = "UNKNOWN";
        }
      } catch {
        status = "UNKNOWN";
      }

      // Summarize policy and get AI-generated title
      let summaryObj;
      try {
        summaryObj = await summarizePolicy(text);

        // Skip generic AI titles
        if (!summaryObj.title || !summaryObj.summary || summaryObj.title === "Environmental Policy Update") {
          console.warn("Skipped due to generic AI title:", p.link);
          continue;
        }
      } catch (err) {
        console.warn("Skipped due to summarization error:", p.link, err.message);
        continue;
      }

      // Generate video
      let video = "";
      try {
        video = await generateVideo(summaryObj.summary, summaryObj.title);
      } catch {
        video = "";
      }

      // Save policy to database
      try {
        const saved = await Policy.create({
          title: summaryObj.title,
          summary: summaryObj.summary,
          source: p.source,
          date: date || new Date(), 
          videoPath: video,
          status: status.toUpperCase(),
          progress: p.progress || "UNKNOWN",
          link: p.link
        });

        console.log("Saved policy:", saved.title, "Status:", saved.status);
        newPolicies.push(saved);
      } catch (err) {
        console.error("Failed to save policy:", err.message);
      }
    }

    console.log(`[${new Date().toISOString()}] Scraper complete. ${newPolicies.length} policies added.`);
  } catch (err) {
    console.error("SCRAPER ERROR:", err.message);
  }
};
