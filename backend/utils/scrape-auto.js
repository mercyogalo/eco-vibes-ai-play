const scrape = require("./scraper");
const classify = require("./classify");
const summarize = require("./summarize");
const generateVideo = require("./generateVideo");
const readFile = require("./readFile");
const Policy = require("../models/policy");
const axios = require("axios");
const cheerio = require("cheerio");


function extractDateFromText(text) {
  const patterns = [
    // Matches: 15 November 2025 or 15 Nov 2025
    /\b(\d{1,2})\s?(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*[ ,.-]?(\d{4})\b/i,
    
    // Matches: Nov 15, 2025 or Nov. 15th, 2025
    /\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s?(\d{1,2})(st|nd|rd|th)?,?\s?(\d{4})\b/i,
    
    // Matches: 15/11/2025 or 15-11-2025
    /\b(\d{1,2})[\/-](\d{1,2})[\/-](\d{2,4})\b/,
    
    // Matches: 2025-11-15
    /\b(\d{4})[\/-](\d{1,2})[\/-](\d{1,2})\b/
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) {
      const date = new Date(match[0]);
      if (!isNaN(date)) return date;
    }
  }
  return null;
}

module.exports = async function runScraper() {
  try {
    const allPolicies = [];
    const list = await scrape();

    for (const p of list) {
      const exists = await Policy.findOne({ link: p.link });
      if (exists) continue;

      let text = "";
      let date = p.date; 

      if (p.link.endsWith(".pdf") || p.link.endsWith(".docx") || p.link.endsWith(".doc")) {
        try {
          text = await readFile(p.link);

          const fileDate = extractDateFromText(text);
          if (fileDate) date = fileDate;

        } catch (err) {
          console.warn("Failed to read file:", p.link, err.message);
          continue;
        }
      } else {
        try {
          const html = await axios.get(p.link).then(r => r.data);
          const $ = cheerio.load(html);
          text = $("body").text().replace(/\s+/g, " ").trim();

          const pageDate = extractDateFromText(text);
          if (pageDate) date = pageDate;

        } catch (err) {
          console.warn("Failed to fetch HTML:", p.link, err.message);
          continue;
        }
      }

      let sentiment = "positive";
      try {
        sentiment = await classify(text);
      } catch (err) {
        console.warn("Classification failed:", p.title, err.message);
      }

      let summary = "";
      try {
        summary = await summarize(text);
      } catch (err) {
        console.warn("Summarization failed:", p.title, err.message);
      }

      let video = "";
      try {
        video = await generateVideo(summary, p.title);
      } catch (err) {
        console.warn("Video generation skipped:", p.title, err.message);
        video = "";
      }

      const saved = await Policy.create({
        title: p.title,
        summary,
        fullText: text,
        source: p.source,
        date,
        videoPath: video,
        status: p.status,
        link: p.link
      });

      allPolicies.push(saved);
      console.log("Saved:", p.title);
    }

    console.log(
      `[${new Date().toISOString()}] Scraper run complete. ${allPolicies.length} new policies added.`
    );
  } catch (e) {
    console.error("Scraper error:", e.message);
  }
};
