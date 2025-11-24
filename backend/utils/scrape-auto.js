const scrape = require("./scraper");
const classifyPolicy = require("./classify");
const summarizePolicy = require("./summarize");
const generateVideo = require("./generateVideo");
const readFile = require("./readFile");
const Policy = require("../models/policy");
const axios = require("axios");
const cheerio = require("cheerio");

module.exports = async function runScraper() {
  try {
    const scrapedList = await scrape();
    const newPolicies = [];

    for (const p of scrapedList) {
      const exists = await Policy.findOne({ link: p.link });
      if (exists) continue;

      let text = "";
      let date = p.date || null;

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

     
      let status = "BOILERPLATE";
      try {
        status = await classifyPolicy(text, p.link);
        if (status === "BOILERPLATE") {
          console.log("Skipped boilerplate/irrelevant content:", p.link);
          continue;
        }
      } catch {
        status = "BOILERPLATE";
        continue;
      }

      
      let summaryObj;
      try {
        summaryObj = await summarizePolicy(text, status);

        
        if (!summaryObj.title || !summaryObj.summary || summaryObj.title === "Environmental Policy Update") {
          console.warn("Skipped due to generic AI title:", p.link);
          continue;
        }
      } catch (err) {
        console.warn("Skipped due to summarization error:", p.link, err.message);
        continue;
      }

      
      let video = "";
      try {
        video = await generateVideo(summaryObj.summary, summaryObj.title);
      } catch {
        video = "";
      }

      
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
